/**
 * app/api/compute/route.ts
 *
 * POST /api/compute
 *
 * TWO CALL MODES:
 *
 * A) Full payload (called by n8n Master Orchestrator as its last step):
 *    { reportId, agentOutputs: { a1, a2, a3, a4, a5 } }
 *
 * B) Self-contained (called by Supabase Edge Function trigger, backfill, or Orchestrator v6+):
 *    { reportId }
 *    → reads agentOutputs from result_data in Supabase automatically
 *
 * Responsibilities:
 * 1. Authenticate (COMPUTE_SECRET header — optional, skip auth if unset)
 * 2. Load input_data + result_data from Supabase
 * 3. Resolve missing inputs from benchmarks (avgTicketSize, setupBudget)
 * 4. Run computeEngine()
 * 5. Write computed_result (idempotent by default, force-recompute optional)
 * 6. Update status to 'complete'
 *
 * Idempotency: if computed_result already exists, returns 200 immediately unless
 * force=true is provided by an authenticated admin caller.
 */

import { NextRequest, NextResponse }          from 'next/server'
import { createClient }                       from '@supabase/supabase-js'
import { computeEngine }                      from '@/lib/compute/engine'
import { ENGINE_VERSION }                     from '@/types/computed'
import { getCachedResult, setCachedResult }   from '@/lib/compute/cache'
import { resolveBizKey, BIZ_BENCHMARKS }      from '@/lib/compute/benchmarks'
import { fetchLiveCompetitorDensity }         from '@/lib/places/multi-source'
import type { ComputeInput }                  from '@/types/computed'

export const maxDuration = 30

function err(msg: string, status: number) {
  console.error(`[compute] ${status} — ${msg}`)
  return NextResponse.json({ success: false, error: msg }, { status })
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 1. Authenticate ───────────────────────────────────────────────────────
  const secret = process.env.COMPUTE_SECRET
  // On Vercel (preview or production), never leave this route open — it runs Places + full compute.
  if (process.env.VERCEL === '1' && !secret) {
    return err('COMPUTE_SECRET must be configured', 503)
  }
  if (secret) {
    const provided = request.headers.get('x-compute-secret') ?? ''
    if (provided !== secret) {
      return err('Unauthorized', 401)
    }
  }

  // ── 2. Parse body ─────────────────────────────────────────────────────────
  let body: {
    reportId:      string
    force?:        boolean
    agentOutputs?: Record<string, Record<string, any>>
  }

  try {
    body = await request.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  const { reportId, force: forceRecompute = false, agentOutputs: bodyAgentOutputs } = body

  if (!reportId || typeof reportId !== 'string') {
    return err('Missing reportId', 400)
  }

  // ── 3. Load report row from Supabase ──────────────────────────────────────
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: report, error: fetchErr } = await sb
    .from('reports')
    .select('report_id, input_data, result_data, computed_result, status, business_type, monthly_rent')
    .eq('report_id', reportId)
    .maybeSingle()

  if (fetchErr || !report) {
    return err(`Report not found: ${reportId}`, 404)
  }

  // ── 4. Idempotency — immutable once written unless force=true ─────────────
  if (report.computed_result != null && !forceRecompute) {
    console.log(`[compute] ${reportId} already computed — skipping`)
    return NextResponse.json({ success: true, reportId, cached: true })
  }

  // ── 5. Resolve agentOutputs ───────────────────────────────────────────────
  // Mode A: caller sent agentOutputs in body (n8n)
  // Mode B: self-contained — read from result_data already in Supabase
  const agentOutputs = bodyAgentOutputs ?? (report.result_data as Record<string, any> | null) ?? {}

  if (!agentOutputs || typeof agentOutputs !== 'object') {
    return err('No agent outputs available (result_data is empty and none provided in body)', 422)
  }

  const modeLabel = bodyAgentOutputs ? 'full-payload' : 'self-contained'

  // Detailed agent field presence logging — helps diagnose partial agent failures
  const a4obj = agentOutputs.a4 as Record<string, any> | null | undefined
  const a5obj = agentOutputs.a5 as Record<string, any> | null | undefined
  const a4HasCosts   = !!(a4obj?.total_monthly_costs ?? a4obj?.totalMonthlyCosts)
  const a4HasRevenue = !!(a4obj?.financial_projections?.estimated_monthly_revenue)
  const a5HasRevenue = !!(a5obj?.monthly_revenue ?? a5obj?.projected_monthly_revenue)
  console.log(
    `[compute] ${reportId} mode=${modeLabel} — ` +
    `a1=${!!agentOutputs.a1} a3=${!!agentOutputs.a3} ` +
    `a4=${!!agentOutputs.a4}(costs=${a4HasCosts} rev=${a4HasRevenue}) ` +
    `a5=${!!agentOutputs.a5}(rev=${a5HasRevenue})`
  )
  if (!a4HasCosts) {
    console.warn(`[compute] ${reportId} — A4 missing total_monthly_costs. Falling back to benchmark costs.`)
  }
  if (!a5HasRevenue && !a4HasRevenue) {
    console.warn(`[compute] ${reportId} — Both A5 and A4 missing revenue estimates. Report revenue will be benchmark-only.`)
  }

  // ── Agent failure detection ───────────────────────────────────────────────
  //
  // STRICT DATA RELIABILITY: detect agents that returned error objects, failed
  // status fields, or objects that only contain metadata with no useful data.
  // Previously: only caught null and {} — missed { error: "timeout" }, { status: "failed" }
  // and partial stubs like { agent: "A1", timestamp: "..." } with no actual fields.
  //
  // NON_DATA_KEYS: housekeeping fields that do not constitute agent output.
  const NON_DATA_KEYS = new Set([
    'error', 'status', 'failed', 'success', 'message', 'code',
    'timestamp', 'agent', 'agent_id', 'run_id', 'version', 'type',
  ])

  function isAgentFailed(v: unknown): boolean {
    if (v == null) return true
    if (typeof v !== 'object' || Array.isArray(v)) return true
    const obj = v as Record<string, unknown>
    if (Object.keys(obj).length === 0) return true
    // Explicit failure signals
    if (obj.error != null) return true
    if (obj.failed === true) return true
    if (typeof obj.status === 'string' &&
        ['failed', 'error', 'timeout', 'skipped', 'missing'].includes(obj.status.toLowerCase())) return true
    // Object exists but contains only metadata — no actual business data
    const dataKeys = Object.keys(obj).filter(k => !NON_DATA_KEYS.has(k))
    return dataKeys.length === 0
  }

  const agentKeys = ['a1', 'a3', 'a4', 'a5'] as const
  const emptyAgents = agentKeys.filter(k => isAgentFailed(agentOutputs[k]))
  const allAgentsFailed = emptyAgents.length === agentKeys.length

  if (allAgentsFailed) {
    console.error(
      `[compute] ${reportId} CRITICAL — ALL primary agents failed or returned empty (${emptyAgents.join(', ')}). ` +
      `GO verdict will be blocked — benchmark-only data cannot support a GO recommendation.`
    )
  } else if (emptyAgents.length >= 2) {
    console.warn(
      `[compute] ${reportId} WARNING — ${emptyAgents.length} agents failed: ${emptyAgents.join(', ')}. ` +
      `Report quality degraded — using benchmark fallbacks for missing agents.`
    )
  }

  // ── 6. Build ComputeInput ─────────────────────────────────────────────────
  const inp = (report.input_data ?? {}) as Record<string, any>

  // Accept both camelCase (new /api/analyse) and snake_case (legacy n8n save)
  const rawBizType    = String(inp.businessType  ?? inp.business_type   ?? report.business_type ?? '')
  const rawRent       = Number(inp.monthlyRent   ?? inp.monthly_rent    ?? report.monthly_rent  ?? 0)
  const rawSetup      = Number(inp.setupBudget   ?? inp.setup_cost      ?? inp.setup_budget     ?? 0)
  const rawTicket     = Number(inp.avgTicketSize ?? inp.avg_ticket_size ?? inp.average_ticket_size ?? 0)
  const rawArea       = String(inp.area          ?? inp.suburb          ?? inp.locality          ?? '')
  const rawCity       = String(inp.city          ?? '')
  const rawState      = String(inp.state         ?? '')
  const rawLat        = Number(inp.lat           ?? inp.latitude        ?? 0)
  const rawLng        = Number(inp.lng           ?? inp.longitude       ?? 0)

  // ── Benchmark fallbacks for missing numeric inputs ────────────────────────
  // When the user's inputs were not saved (legacy reports) or are 0, use
  // the industry benchmark so computeEngine always has something to work with.
  const bizKey   = resolveBizKey(rawBizType)
  const bm       = BIZ_BENCHMARKS[bizKey] ?? BIZ_BENCHMARKS.other

  const avgTicketSize = rawTicket  > 0  ? rawTicket  : bm.avgTicketSize
  const setupBudget   = rawSetup   > 0  ? rawSetup   : bm.staffCosts * 8  // ~8 months staff = typical setup
  const monthlyRent   = rawRent    > 0  ? rawRent    : 5000               // conservative fallback

  const usedBenchmarkForTicket = rawTicket <= 0
  const usedBenchmarkForSetup  = rawSetup  <= 0

  // New accuracy-improving optional inputs (onboarding form additions)
  const rawOperatingHours  = inp.operatingHours  ?? inp.operating_hours  ?? null
  const rawSeatingCapacity = inp.seatingCapacity != null ? Number(inp.seatingCapacity) : (inp.seating_capacity != null ? Number(inp.seating_capacity) : null)
  const rawBusinessMode    = inp.businessMode    ?? inp.business_mode    ?? null
  const rawAvgOrderValue   = inp.avgOrderValue   != null ? Number(inp.avgOrderValue)   : (inp.avg_order_value   != null ? Number(inp.avg_order_value)   : null)
  const rawLocationAccess  = inp.locationAccess  ?? inp.location_access  ?? null

  const computeInput: ComputeInput = {  // eslint-disable-line prefer-const
    reportId,
    businessType:  rawBizType,
    monthlyRent,
    setupBudget,
    avgTicketSize,
    area:  rawArea,
    city:  rawCity,
    state: rawState,
    operatingHours:  rawOperatingHours  || null,
    seatingCapacity: rawSeatingCapacity && rawSeatingCapacity > 0 ? rawSeatingCapacity : null,
    businessMode:    rawBusinessMode    || null,
    avgOrderValue:   rawAvgOrderValue   && rawAvgOrderValue > 0 ? rawAvgOrderValue : null,
    locationAccess:  rawLocationAccess  || null,
    // Signal to the engine that setup budget was estimated — breakEvenMonths will be suppressed
    setupBudgetIsEstimated:   usedBenchmarkForSetup,
    // Signal that avgTicketSize came from benchmarks — used by buildSectionConfidence
    avgTicketSizeIsEstimated: usedBenchmarkForTicket,
    agentOutputs: {
      a1: agentOutputs.a1 ?? {},
      a2: agentOutputs.a2 ?? {},
      a3: agentOutputs.a3 ?? {},
      a4: agentOutputs.a4 ?? {},
      a5: agentOutputs.a5 ?? {},
      a6: agentOutputs.a6 ?? {},
      a7: agentOutputs.a7 ?? {},
      a8: agentOutputs.a8 ?? {},
    },
  }

  console.log(
    `[compute] ${reportId} resolved — biz="${computeInput.businessType}" rent=${monthlyRent} ` +
    `setup=${setupBudget}${usedBenchmarkForSetup ? '(bm)' : ''} ` +
    `ticket=${avgTicketSize}${usedBenchmarkForTicket ? '(bm)' : ''} area="${rawArea}"`
  )

  if (!computeInput.businessType) {
    return err('businessType is empty — cannot compute (tried: businessType, business_type, reports.business_type)', 422)
  }

  // ── 6b. Fetch live competitor density (multi-source) ─────────────────────
  // When lat/lng are available, fetch Google Places + Geoapify in parallel.
  // The result is injected into computeInput so the engine can:
  //   (a) apply a revenue pressure factor based on real saturation
  //   (b) use the live count for competition scoring (overrides broken A1 data)
  if (rawLat !== 0 && rawLng !== 0) {
    const googleKey   = process.env.GOOGLE_PLACES_API_KEY
    const geoapifyKey = process.env.GEOAPIFY_API_KEY
    try {
      const liveDensity = await fetchLiveCompetitorDensity(
        String(rawLat),
        String(rawLng),
        BIZ_BENCHMARKS[bizKey]?.competitorRadiusM ?? 1500,
        bizKey,
        googleKey,
        geoapifyKey,
      )
      if (liveDensity) {
        computeInput.liveCompetitorDensity = liveDensity
        console.log(
          `[compute] ${reportId} live density: w500=${liveDensity.weightedCount500m} ` +
          `w1km=${liveDensity.weightedCount1km} density=${liveDensity.density} ` +
          `pressure=${liveDensity.pressureFactor} sources=${liveDensity.sources.join(',')}`,
        )
      }
    } catch (densityErr: any) {
      // Non-fatal — proceed with agent data only
      console.warn(`[compute] ${reportId} live density fetch failed:`, densityErr?.message)
    }
  } else {
    console.log(`[compute] ${reportId} no lat/lng in input_data — skipping live density`)
  }

  // ── 7. Check cache ────────────────────────────────────────────────────────
  const cacheHit   = await getCachedResult(bizKey, rawArea)
  const isBackfill = cacheHit != null

  // ── 8. Run compute engine ─────────────────────────────────────────────────
  const startMs = Date.now()
  let computedResult

  try {
    computedResult = computeEngine(computeInput)
  } catch (engineErr: any) {
    console.error(`[compute] Engine error for ${reportId}:`, engineErr?.message)
    return err(`Compute engine failed: ${engineErr?.message ?? 'unknown'}`, 500)
  }

  // Hard gate: a GO verdict on benchmark-only data actively misleads users into
  // making lease decisions based on industry averages, not this specific location.
  if (allAgentsFailed && computedResult.verdict === 'GO') {
    computedResult = {
      ...computedResult,
      verdict: 'CAUTION' as const,
      verdictGateTriggered: 'all_agents_failed_go_blocked',
    }
    console.warn(`[compute] ${reportId} — GO verdict overridden to CAUTION (benchmark-only data)`)
  }

  const computeMs = Date.now() - startMs

  // ── Trust layer logging ───────────────────────────────────────────────────
  if (computedResult.contradictions.length > 0) {
    console.warn(
      `[compute] ${reportId} — ${computedResult.contradictions.length} contradiction(s) detected:`,
      computedResult.contradictions.map(c => `[${c.severity}] ${c.field}: ${c.reason}`).join(' | ')
    )
  }
  if (computedResult.verdictGateTriggered) {
    console.warn(`[compute] ${reportId} — hard fail gate triggered: ${computedResult.verdictGateTriggered} (verdict overridden to ${computedResult.verdict})`)
  }

  console.log(
    `[compute] ${reportId} done in ${computeMs}ms — ` +
    `netProfit=${computedResult.netProfit} verdict=${computedResult.verdict} ` +
    `completeness=${computedResult.dataCompleteness}% confidence=${computedResult.modelConfidence} ` +
    `contradictions=${computedResult.contradictions.length}`
  )

  // ── 9. Write to Supabase ──────────────────────────────────────────────────
  // Quality gate: when dataCompleteness is very low (all agents failed), flag
  // the report so the UI can show a "limited data" warning to the user.
  // We still write 'complete' so the report loads — but we annotate it clearly.
  const lowConfidence   = computedResult.dataCompleteness < 20 || allAgentsFailed
  const progressStep    = lowConfidence ? 'Complete — limited data' : 'Complete'

  if (lowConfidence) {
    console.warn(
      `[compute] ${reportId} — low-confidence completion: ` +
      `dataCompleteness=${computedResult.dataCompleteness}% allAgentsFailed=${allAgentsFailed}. ` +
      `progress_step set to "${progressStep}".`
    )
  }

  const updatePayload: Record<string, any> = {
    computed_result: {
      ...computedResult,
      benchmarkFlags: {
        ticketSizeFromBenchmark: usedBenchmarkForTicket,
        setupBudgetFromBenchmark: usedBenchmarkForSetup,
        allAgentsFailed,
        agentsEmpty: emptyAgents,
      },
    },
    engine_version:    computedResult.meta.engineVersion,
    benchmark_version: computedResult.meta.benchmarkVersion,
    status:            'complete',
    progress_step:     progressStep,
    // Legacy columns — keep in sync so old code paths don't break
    overall_score:       computedResult.scores.overall,
    score_rent:          computedResult.scores.rent,
    score_competition:   computedResult.scores.competition,
    score_demand:        computedResult.scores.demand,
    score_profitability: computedResult.scores.profitability,
    verdict:             computedResult.verdict,
    breakeven_daily:     computedResult.breakEvenDaily,
    breakeven_months:    computedResult.breakEvenMonths,
  }

  // In full-payload mode, also write the raw snapshot (authoritative)
  // In self-contained mode, result_data is already there — don't overwrite it
  if (bodyAgentOutputs) {
    updatePayload.raw_data_snapshot = bodyAgentOutputs
    updatePayload.result_data       = bodyAgentOutputs  // backward compat
  }

  const updateQuery = sb
    .from('reports')
    .update(updatePayload)
    .eq('report_id', reportId)

  // Default mode protects immutability. Force mode intentionally refreshes
  // old rows so new contract fields (for example benchmarkContext) are present.
  if (!forceRecompute) updateQuery.is('computed_result', null)

  const { error: updateErr } = await updateQuery

  if (updateErr) {
    console.error(`[compute] Supabase write failed for ${reportId}:`, updateErr.message)
    return err('Failed to persist computed result', 500)
  }

  // ── 10. Cache ─────────────────────────────────────────────────────────────
  await setCachedResult(bizKey, rawArea, computedResult, isBackfill)

  return NextResponse.json({
    success:              true,
    reportId,
    netProfit:            computedResult.netProfit,
    verdict:              computedResult.verdict,
    verdictGateTriggered: computedResult.verdictGateTriggered,
    dataCompleteness:     computedResult.dataCompleteness,
    modelConfidence:      computedResult.modelConfidence,
    contradictions:       computedResult.contradictions.length,
    revenueRange:         computedResult.revenueRange,
    computeMs,
    engineVersion:        computedResult.meta.engineVersion,
    mode:                 modeLabel,
    forced:               forceRecompute,
  })
}

// ── GET — health check ────────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ ok: true, service: 'locatalyze-compute', engine: ENGINE_VERSION })
}
