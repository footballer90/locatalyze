import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Rate limiting (graceful no-op if not configured) ───────────────────────
let ratelimit: any = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = require('@upstash/ratelimit')
    const { Redis }     = require('@upstash/redis')
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'locatalyze:analyse' })
  }
} catch {}

// KEY CHANGE: maxDuration dropped to 10s — we return in <1s now
export const maxDuration = 10

const FREE_LIMIT = 3

function errorResponse(msg: string, status: number) {
  const r = NextResponse.json({ success: false, error: { message: msg } }, { status })
  r.headers.set('X-Content-Type-Options', 'nosniff')
  r.headers.set('X-Frame-Options', 'DENY')
  return r
}

function validatePayload(body: any): { valid: true; data: any } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid request body' }
  const { businessType, address, monthlyRent, setupBudget, avgTicketSize, userId } = body
  if (!businessType || typeof businessType !== 'string' || businessType.trim().length < 2)
    return { valid: false, error: 'Business type is required' }
  if (!address || typeof address !== 'string' || address.trim().length < 5)
    return { valid: false, error: 'Address must be at least 5 characters' }
  const rent   = Number(monthlyRent)
  const setup  = Number(setupBudget)
  const ticket = Number(avgTicketSize)
  if (!isFinite(rent)   || rent   < 100  || rent   > 500000)  return { valid: false, error: 'Monthly rent must be between $100 and $500,000' }
  if (!isFinite(setup)  || setup  < 100  || setup  > 10000000) return { valid: false, error: 'Setup budget must be between $100 and $10,000,000' }
  if (!isFinite(ticket) || ticket < 1    || ticket > 10000)    return { valid: false, error: 'Average ticket size must be between $1 and $10,000' }
  const injectionPattern = /ignore|forget|disregard|pretend|you are|act as|jailbreak|prompt|system:|assistant:|\\n\\n/gi
  const clean = (s: string) => {
    const stripped = s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
    if (injectionPattern.test(stripped)) return stripped.replace(injectionPattern, '')
    return stripped
  }
  return {
    valid: true,
    data: {
      businessType:  clean(businessType),
      address:       clean(address),
      monthlyRent:   rent,
      setupBudget:   setup,
      avgTicketSize: ticket,
      userId: typeof userId === 'string' ? userId.slice(0, 100) : undefined,
    }
  }
}

export async function POST(request: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────────────────
  if (ratelimit) {
    try {
      const ip = (request.headers.get('x-forwarded-for') || 'anonymous').split(',')[0].trim()
      const uid = request.headers.get('x-user-id') || ip
      const { success, limit, reset } = await ratelimit.limit(`${uid}:${ip}`)
      if (!success) {
        const resetIn = Math.ceil((reset - Date.now()) / 60000)
        return errorResponse(`Rate limit reached. ${limit} analyses per hour. Try again in ${resetIn}m.`, 429)
      }
    } catch { console.error('[Analyse] Rate limit check failed') }
  }

  // ── Parse & validate ───────────────────────────────────────────────────────
  let rawBody: any
  try { rawBody = await request.json() } catch { return errorResponse('Invalid JSON', 400) }
  const validation = validatePayload(rawBody)
  if (!validation.valid) return errorResponse(validation.error, 400)
  const { data } = validation

  // ── Webhook URL check ──────────────────────────────────────────────────────
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) return errorResponse('Analysis service not configured — N8N_WEBHOOK_URL missing.', 503)
  if (webhookUrl.includes('/webhook-test/')) return errorResponse('n8n using TEST URL. Use Production URL (/webhook/ not /webhook-test/).', 503)

  const userId = data.userId || request.headers.get('x-user-id')
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // ── Quota check ─────────────────────────────────────────────────────────────
  if (userId) {
    try {
      const { data: profile } = await sb.from('profiles').select('total_analyses_used,plan').eq('id', userId).maybeSingle()
      const plan = profile?.plan || 'free'
      const used = profile?.total_analyses_used ?? 0
      if (plan !== 'admin' && plan === 'free' && used >= FREE_LIMIT) {
        return errorResponse(`You've used all ${FREE_LIMIT} free analyses. Upgrade to Pro for unlimited reports.`, 402)
      }
      if (!profile) {
        await sb.from('profiles').upsert({ id: userId, total_analyses_used: 0, plan: 'free' })
      }
    } catch (qErr: any) { console.error('[Analyse] Quota check failed:', qErr.message) }
  }

  // ── Generate report ID & save PENDING row immediately ─────────────────────
  // This is the key architectural change: we create the DB row NOW with
  // status='pending', return the reportId to the frontend, then fire n8n
  // asynchronously. The frontend subscribes to this row via Supabase Realtime
  // and gets notified the moment n8n writes the completed report.
  const reportId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const pendingRow = {
    report_id:    reportId,
    submission_id: reportId,
    user_id:      userId || null,
    status:       'pending',
    progress_step: 'Queued',
    business_type: data.businessType,
    address:      data.address,
    monthly_rent: data.monthlyRent,
    input_data: {
      businessType: data.businessType,
      address:      data.address,
      monthlyRent:  data.monthlyRent,
      setupBudget:  data.setupBudget,
      avgTicketSize: data.avgTicketSize,
    },
  }

  const { error: insertErr } = await sb.from('reports').upsert(pendingRow, { onConflict: 'report_id' })
  if (insertErr) {
    console.error('[Analyse] Failed to create pending row:', insertErr.message)
    return errorResponse('Failed to initialise report. Please try again.', 500)
  }

  // ── Fire n8n WITHOUT awaiting — this is the async handoff ────────────────
  // n8n will process the full pipeline (geocoding → competitors → AI → financials)
  // and write the completed report back to Supabase directly.
  // n8n MUST: upsert to reports table with the same report_id and status='complete'
  sb.from('reports')
    .update({ progress_step: 'Sending to analysis engine' })
    .eq('report_id', reportId)
    .then(() => {})
    .catch(() => {})

  fetch(webhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Locatalyze/1.0' },
    body: JSON.stringify({
      reportId,           // n8n uses this to upsert back to the same row
      businessType:  data.businessType,
      address:       data.address,
      monthlyRent:   data.monthlyRent,
      setupBudget:   data.setupBudget,
      avgTicketSize: data.avgTicketSize,
      userId:        userId || 'anonymous',
    }),
  })
  .then(async res => {
    // n8n responded synchronously (old mode) — save the result
    if (res.ok) {
      const text = await res.text().catch(() => '')
      if (text && text.trim()) {
        try {
          const result = JSON.parse(text)
          if (result?.report) {
            const rpt = result.report
            await sb.from('reports').upsert({
              report_id:           rpt.reportId || reportId,
              submission_id:       rpt.submissionId || reportId,
              user_id:             userId || null,
              verdict:             rpt.verdict,
              overall_score:       rpt.overall_score,
              score_competition:   rpt.score_competition,
              score_rent:          rpt.score_rent,
              score_demand:        rpt.score_demand,
              score_cost:          rpt.score_cost,
              score_profitability: rpt.score_profitability,
              recommendation:      rpt.recommendation      || '',
              competitor_analysis: rpt.competitor_analysis || '',
              rent_analysis:       rpt.rent_analysis       || '',
              market_demand:       rpt.market_demand       || '',
              cost_analysis:       rpt.cost_analysis       || '',
              profitability:       rpt.profitability       || '',
              pl_summary:          rpt.pl_summary          || '',
              three_year_projection: rpt.three_year_projection || '',
              sensitivity_analysis:  rpt.sensitivity_analysis  || '',
              swot_analysis:       rpt.swot_analysis       || '',
              breakeven_monthly:   rpt.breakeven_monthly,
              breakeven_daily:     rpt.breakeven_daily,
              breakeven_months:    rpt.breakeven_months,
              full_report_markdown: JSON.stringify(rpt.financials || {}),
              location_name:       rpt.location?.formattedAddress || data.address,
              business_type:       data.businessType,
              monthly_rent:        data.monthlyRent,
              address:             data.address,
              result_data:         rpt,
              input_data:          rpt.input_data || pendingRow.input_data,
              status:              'complete',
              progress_step:       'Complete',
            }, { onConflict: 'report_id' })
            .then(() => {
              // Increment usage counter
              if (userId) {
                sb.rpc('increment_analyses_used', { uid: userId }).catch(() => {
                  sb.from('profiles').select('total_analyses_used,plan').eq('id', userId).maybeSingle()
                    .then(({ data: prof }) => {
                      sb.from('profiles').upsert(
                        { id: userId, total_analyses_used: (prof?.total_analyses_used ?? 0) + 1, plan: prof?.plan ?? 'free' },
                        { onConflict: 'id' }
                      )
                    })
                })
              }
            })
          }
        } catch { /* n8n returned non-JSON — it will write to DB itself */ }
      }
    }
  })
  .catch(err => {
    // n8n unreachable — mark as failed so dashboard shows error
    console.error('[Analyse] n8n fire-and-forget error:', err.message)
    sb.from('reports')
      .update({ status: 'failed', progress_step: 'Analysis engine unreachable' })
      .eq('report_id', reportId)
      .then(() => {})
      .catch(() => {})
  })

  // ── Return immediately — frontend navigates to dashboard and subscribes ───
  console.log('[Analyse] Queued report:', reportId)
  return NextResponse.json({ success: true, reportId })
}
