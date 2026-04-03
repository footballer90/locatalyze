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
 * 5. Write computed_result (write-once / idempotent)
 * 6. Update status to 'complete'
 *
 * Idempotency: if computed_result already exists, returns 200 immediately.
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
  if (secret) {
    const provided = request.headers.get('x-compute-secret') ?? ''
    if (provided !== secret) {
      return err('Unauthorized', 401)
    }
  }

  // ── 2. Parse body ─────────────────────────────────────────────────────────
  let body: {
    reportId:      string
    agentOutputs?: Record<string, Record<string, any>>
  }

  try {
    body = await request.json()
  } catch {
    return err('Invalid JSON body', 400)
  }

  const { reportId, agentOutputs: bodyAgentOutputs } = body

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

  // ── 4. Idempotency — immutable once written ───────────────────────────────
  if (report.computed_result != null) {
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
  console.log(`[compute] ${reportId} mode=${modeLabel} — a1=${!!agentOutputs.a1} a4=${!!agentOutputs.a4} a5=${!!agentOutputs.a5}`)

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

  const computeInput: ComputeInput = {  // eslint-disable-line prefer-const
    reportId,
    businessType:  rawBizType,
    monthlyRent,
    setupBudget,
    avgTicketSize,
    area:  rawArea,
    city:  rawCity,
    state: rawState,
    agentOutputs: {
      a1: agentOutputs.a1 ?? {},
      a2: agentOutputs.a2 ?? {},
      a3: agentOutputs.a3 ?? {},
      a4: agentOutputs.a4 ?? {},
      a5: agentOutputs.a5 ?? {},
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

  const computeMs = Date.now() - startMs
  console.log(`[compute] ${reportId} done in ${computeMs}ms — netProfit=${computedResult.netProfit} verdict=${computedResult.verdict}`)

  // ── 9. Write to Supabase ──────────────────────────────────────────────────
  const updatePayload: Record<string, any> = {
    computed_result:   computedResult,
    engine_version:    computedResult.meta.engineVersion,
    benchmark_version: computedResult.meta.benchmarkVersion,
    status:            'complete',
    progress_step:     'Complete',
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

  const { error: updateErr } = await sb
    .from('reports')
    .update(updatePayload)
    .eq('report_id', reportId)
    .is('computed_result', null)   // guard: only write if still null

  if (updateErr) {
    console.error(`[compute] Supabase write failed for ${reportId}:`, updateErr.message)
    return err('Failed to persist computed result', 500)
  }

  // ── 10. Cache ─────────────────────────────────────────────────────────────
  await setCachedResult(bizKey, rawArea, computedResult, isBackfill)

  return NextResponse.json({
    success:       true,
    reportId,
    netProfit:     computedResult.netProfit,
    verdict:       computedResult.verdict,
    computeMs,
    engineVersion: computedResult.meta.engineVersion,
    mode:          modeLabel,
  })
}

// ── GET — health check ────────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ ok: true, service: 'locatalyze-compute', engine: ENGINE_VERSION })
}
