// app/api/email/report-complete/route.ts
// Sends a plain-text "your report is ready" email when a report finishes.
// Called by:
//   1. The frontend useReport hook when it first detects completion
//   2. (optional) n8n Master Orchestrator at end of pipeline — POST to this URL

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const sb = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verdictEmoji(verdict: string | null) {
  if (!verdict) return '📋'
  const v = verdict.toUpperCase()
  if (v === 'GO')      return '✅'
  if (v === 'CAUTION') return '⚠️'
  if (v === 'NO')      return '🚫'
  return '📋'
}

function fmtMoney(n: number | null | undefined) {
  if (n == null) return null
  return `A$${Math.abs(n).toLocaleString('en-AU')}`
}

function buildEmailHtml(opts: {
  verdict:      string
  score:        number | null
  location:     string
  businessType: string
  netProfit:    number | null
  rent:         number | null
  reportUrl:    string
  isEstimated:  boolean
}) {
  const { verdict, score, location, businessType, netProfit, rent, reportUrl, isEstimated } = opts

  const verdictColor = verdict === 'GO' ? '#059669' : verdict === 'CAUTION' ? '#D97706' : '#DC2626'
  const verdictBg    = verdict === 'GO' ? '#ECFDF5' : verdict === 'CAUTION' ? '#FFFBEB' : '#FEF2F2'
  const verdictLabel = verdict === 'GO' ? 'GO — viable location' : verdict === 'CAUTION' ? 'CAUTION — verify before committing' : 'NO — not recommended'
  const emoji        = verdictEmoji(verdict)

  const profitLine = netProfit != null
    ? netProfit >= 0
      ? `Estimated net profit: <strong style="color:#059669">${fmtMoney(netProfit)}/month</strong>`
      : `Estimated net loss: <strong style="color:#DC2626">${fmtMoney(netProfit)}/month</strong>`
    : null

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F5F4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F4;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0C2340;padding:24px 32px;border-radius:12px 12px 0 0;">
          <p style="margin:0;font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Locatalyze</p>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.45);">Location Intelligence for Australian Businesses</p>
        </td></tr>

        <!-- Verdict hero -->
        <tr><td style="background:#ffffff;padding:32px 32px 24px;border-left:1px solid #E7E5E4;border-right:1px solid #E7E5E4;">
          <p style="margin:0 0 6px;font-size:13px;color:#78716C;">Your report is ready</p>
          <p style="margin:0 0 20px;font-size:22px;font-weight:800;color:#1C1917;line-height:1.2;">${businessType} — ${location}</p>

          <!-- Verdict badge -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="background:${verdictBg};border:1.5px solid ${verdictColor}40;border-radius:10px;padding:14px 20px;">
              <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:${verdictColor};text-transform:uppercase;letter-spacing:0.06em;">Verdict</p>
              <p style="margin:0;font-size:20px;font-weight:900;color:${verdictColor};">${emoji} ${verdictLabel}${score != null ? ` — ${score}/100` : ''}</p>
            </td></tr>
          </table>

          <!-- Key numbers -->
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;border:1px solid #E7E5E4;border-radius:8px;overflow:hidden;">
            ${profitLine ? `<tr style="background:#F9FAFB;">
              <td style="padding:12px 16px;font-size:13px;color:#78716C;border-bottom:1px solid #E7E5E4;">Net profit / month</td>
              <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#1C1917;text-align:right;border-bottom:1px solid #E7E5E4;">${fmtMoney(netProfit)}</td>
            </tr>` : ''}
            ${rent != null ? `<tr>
              <td style="padding:12px 16px;font-size:13px;color:#78716C;">Monthly rent</td>
              <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#1C1917;text-align:right;">${fmtMoney(rent)}</td>
            </tr>` : ''}
          </table>

          ${isEstimated ? `<p style="margin:0 0 20px;font-size:12px;color:#A8A29E;background:#FAFAF9;border:1px solid #E7E5E4;border-radius:6px;padding:10px 14px;">
            ⚡ Financials are benchmark estimates — see the full report for data sources and confidence levels.
          </p>` : ''}

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
            <tr><td style="background:#0F766E;border-radius:8px;">
              <a href="${reportUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                View your free preview →
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 12px;font-size:13px;color:#78716C;line-height:1.6;">
            Your free report includes the verdict, competitor map, and score. Unlock the full financial model, break-even analysis, and PDF export for <strong style="color:#0F766E;">$29</strong>.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F5F5F4;padding:20px 32px;border-radius:0 0 12px 12px;border:1px solid #E7E5E4;border-top:none;">
          <p style="margin:0;font-size:12px;color:#A8A29E;line-height:1.6;">
            This report was generated by Locatalyze. The analysis is for decision-support only — always verify data locally before signing a lease.
            <br>Questions? Reply to this email.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// Track which reports have had emails sent (in-memory, survives for the lifetime of the serverless instance)
// For production robustness, use a Supabase column instead.
const sentSet = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const { reportId, userEmail } = await req.json()

    if (!reportId) {
      return NextResponse.json({ error: 'reportId required' }, { status: 400 })
    }

    // Deduplicate: only send once per report
    if (sentSet.has(reportId)) {
      return NextResponse.json({ skipped: true, reason: 'already_sent' })
    }

    // Fetch report from Supabase
    const { data: report, error: fetchErr } = await sb
      .from('reports')
      .select('report_id,verdict,overall_score,location_name,business_type,monthly_rent,computed_result,result_data,user_id')
      .or(`report_id.eq.${reportId},id.eq.${reportId}`)
      .maybeSingle()

    if (fetchErr || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Only send for completed reports
    if (!report.verdict) {
      return NextResponse.json({ skipped: true, reason: 'not_complete' })
    }

    // Get user email from auth.users via service role
    let toEmail = userEmail
    if (!toEmail && report.user_id) {
      const { data: authUser } = await sb.auth.admin.getUserById(report.user_id)
      toEmail = authUser?.user?.email
    }

    if (!toEmail) {
      return NextResponse.json({ error: 'No email found for user' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })
    }

    const C = report.computed_result as any
    const netProfit    = C?.netProfit ?? null
    const isEstimated  = C?.meta?.computeLog?.revenueSource === 'benchmark_default'
    const verdict      = (report.verdict ?? 'CAUTION').toUpperCase()
    const score        = report.overall_score ?? null
    const location     = report.location_name ?? 'your location'
    const businessType = report.business_type ?? 'Business'
    const rent         = report.monthly_rent ?? null

    const baseUrl  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://locatalyze.com'
    const reportId2 = report.report_id ?? reportId
    const reportUrl = `${baseUrl}/dashboard/${reportId2}`

    const html = buildEmailHtml({ verdict, score, location, businessType, netProfit, rent, reportUrl, isEstimated })

    const subject = verdict === 'GO'
      ? `✅ ${businessType} at ${location} — Report ready (GO)`
      : verdict === 'CAUTION'
      ? `⚠️ ${businessType} at ${location} — Report ready (Caution)`
      : `🚫 ${businessType} at ${location} — Report ready (Not recommended)`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Prash from Locatalyze <insights@locatalyze.com>',
        to:      [toEmail],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('Resend error:', body)
      return NextResponse.json({ error: 'Email send failed', detail: body }, { status: 500 })
    }

    sentSet.add(reportId)
    return NextResponse.json({ success: true, to: toEmail })

  } catch (err) {
    console.error('/api/email/report-complete error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
