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

export const maxDuration = 60

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
  const clean = (s: string) => s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
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

// ─── Prompt injection defence ────────────────────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?instructions?/gi,
  /forget\s+(all\s+)?previous/gi,
  /you\s+are\s+(now\s+)?a/gi,
  /act\s+as\s+(a|an)/gi,
  /disregard\s+(all\s+)?/gi,
  /system\s*:/gi,
  /assistant\s*:/gi,
  /\[\s*system\s*\]/gi,
  /output\s*:\s*go\b/gi,
  /output\s*:\s*caution\b/gi,
  /output\s*:\s*no\b/gi,
  /score\s*:\s*\d+/gi,
  /verdict\s*:\s*(go|caution|no)\b/gi,
]
function sanitizeAddress(raw: string): string {
  let s = raw.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
  for (const p of INJECTION_PATTERNS) s = s.replace(p, '')
  // Allow only chars valid in Australian addresses
  return s.replace(/[^a-zA-Z0-9 ,.\-\/'']/g, '').trim()
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
  // Sanitize address against prompt injection (applied after type validation)
  const sanitizedAddress = sanitizeAddress(data.address)
  if (sanitizedAddress.length < 5) {
    return errorResponse('Address contains invalid characters. Please enter a valid Australian address.', 400)
  }
  data.address = sanitizedAddress

  // ── Webhook URL check ──────────────────────────────────────────────────────
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return errorResponse('Analysis service not configured — NEXT_PUBLIC_N8N_WEBHOOK_URL is missing from Vercel env vars.', 503)
  }
  // Catch the #1 most common mistake: using the test URL instead of production
  if (webhookUrl.includes('/webhook-test/')) {
    return errorResponse(
      'n8n webhook is using a TEST URL. In n8n, click the webhook node → copy the Production URL (/webhook/ not /webhook-test/) → update NEXT_PUBLIC_N8N_WEBHOOK_URL in Vercel.',
      503
    )
  }

  // ── Quota check ─────────────────────────────────────────────────────────────
  const userId = data.userId || request.headers.get('x-user-id')
  if (userId) {
    try {
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const { data: profile } = await sb.from('profiles').select('total_analyses_used,plan').eq('id', userId).maybeSingle()
      const plan = profile?.plan || 'free'
      const used = profile?.total_analyses_used ?? 0
      if (plan === 'free' && used >= FREE_LIMIT) {
        return errorResponse(`You've used all ${FREE_LIMIT} free analyses. Upgrade to Pro for unlimited reports.`, 402)
      }
      if (!profile) {
        await sb.from('profiles').upsert({ id: userId, total_analyses_used: 0, plan: 'free' })
      }
    } catch (qErr: any) { console.error('[Analyse] Quota check failed:', qErr.message) }
  }

  // ── Call n8n ────────────────────────────────────────────────────────────────
  // n8n owns the full pipeline: geocoding, competitors, demographics, scoring, GPT.
  // We just pass the raw inputs and wait for the assembled report.
  console.log('[Analyse] Calling n8n:', webhookUrl.replace(/webhook.*/, 'webhook/...'))

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 50000) // 50s — leaves buffer for Vercel's 60s limit

  let result: any
  try {
    const response = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Locatalyze/1.0' },
      body:    JSON.stringify({
        businessType:  data.businessType,
        address:       sanitizedAddress,
        monthlyRent:   data.monthlyRent,
        setupBudget:   data.setupBudget,
        avgTicketSize: data.avgTicketSize,
        userId:        userId || 'anonymous',
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const text = await response.text()
    console.log('[Analyse] n8n status:', response.status, '| length:', text.length, '| preview:', text.slice(0, 200))

    if (!text || text.trim() === '') {
      return errorResponse(
        'n8n returned an empty response. Check: (1) workflow Active toggle is ON, (2) NEXT_PUBLIC_N8N_WEBHOOK_URL uses the Production URL (/webhook/ not /webhook-test/).',
        502
      )
    }

    try { result = JSON.parse(text) } catch {
      console.error('[Analyse] n8n returned invalid JSON:', text.slice(0, 300))
      return errorResponse('n8n returned an unexpected response format. Check the n8n execution log for errors.', 502)
    }

    // n8n async mode: {"message":"Workflow was started"} means Response Mode is wrong
    if (result?.message === 'Workflow was started') {
      return errorResponse(
        'n8n webhook is in async mode. Fix: in n8n, click the "01 | Webhook" node → set Response Mode to "Using Respond to Webhook Node" → Save.',
        502
      )
    }

    if (!result?.report) {
      console.error('[Analyse] n8n missing report. Keys:', Object.keys(result || {}).join(','))
      return errorResponse(
        'n8n workflow ran but did not return a report. Open the n8n execution log and check which node failed.',
        502
      )
    }
  } catch (err: any) {
    clearTimeout(timeout)
    const isTimeout = err.name === 'AbortError'
    console.error('[Analyse] n8n fetch error:', err.message)
    return errorResponse(
      isTimeout
        ? 'n8n timed out (>50s). The GPT step may be slow — check n8n execution log. Consider adding a timeout to node 14.'
        : 'Could not reach n8n. Check that NEXT_PUBLIC_N8N_WEBHOOK_URL is correct and n8n is running.',
      502
    )
  }

  // ── Save to Supabase ────────────────────────────────────────────────────────
  // Node 16 in n8n is disabled — we own the Supabase save here.
  const rpt = result.report
  if (rpt?.reportId) {
    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const row = {
        report_id:           rpt.reportId,
        submission_id:       rpt.submissionId || rpt.reportId,
        user_id:             userId || null,
        verdict:             rpt.verdict,
        overall_score:       rpt.overall_score,
        score_competition:   rpt.score_competition,
        score_rent:          rpt.score_rent,
        score_demand:        rpt.score_demand,
        score_cost:          rpt.score_cost,
        score_profitability: rpt.score_profitability,
        recommendation:      rpt.recommendation        || '',
        competitor_analysis: rpt.competitor_analysis   || '',
        rent_analysis:       rpt.rent_analysis         || '',
        market_demand:       rpt.market_demand         || '',
        cost_analysis:       rpt.cost_analysis         || '',
        profitability:       rpt.profitability         || '',
        pl_summary:          rpt.pl_summary            || '',
        three_year_projection: rpt.three_year_projection || '',
        sensitivity_analysis:  rpt.sensitivity_analysis  || '',
        swot_analysis:       rpt.swot_analysis         || '',
        breakeven_monthly:   rpt.breakeven_monthly,
        breakeven_daily:     rpt.breakeven_daily,
        breakeven_months:    rpt.breakeven_months,
        full_report_markdown: JSON.stringify(rpt.financials || {}),
        location_name:       rpt.location?.formattedAddress || sanitizedAddress,
        business_type:       data.businessType,
        monthly_rent:        data.monthlyRent,
        address:             sanitizedAddress,
        result_data:         rpt,          // full structured report — report page reads from here
        input_data:          rpt.input_data || {
          businessType: data.businessType, address: sanitizedAddress,
          monthlyRent: data.monthlyRent, setupBudget: data.setupBudget, avgTicketSize: data.avgTicketSize,
        },
        status: 'complete',
      }

      const { error: dbErr } = await sb.from('reports').upsert(row, { onConflict: 'report_id' })
      if (dbErr) {
        console.error('[Analyse] Supabase save failed:', dbErr.message)
      } else {
        console.log('[Analyse] Saved report:', rpt.reportId)

        // Increment permanent usage counter (never decremented when report deleted)
        if (userId) {
          try {
            await sb.rpc('increment_analyses_used', { uid: userId })
          } catch {
            // RPC not yet created — fallback read-then-write
            const { data: prof } = await sb.from('profiles').select('total_analyses_used,plan').eq('id', userId).maybeSingle()
            await sb.from('profiles').upsert(
              { id: userId, total_analyses_used: (prof?.total_analyses_used ?? 0) + 1, plan: prof?.plan ?? 'free' },
              { onConflict: 'id' }
            )
          }
        }
      }
    } catch (dbEx: any) {
      // Non-fatal — report still returned to client
      console.error('[Analyse] Supabase save exception:', dbEx.message)
    }
  }

  return NextResponse.json(result)
}