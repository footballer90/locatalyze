import { NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY || '') }
const FROM = 'Locatalyze <reports@locatalyze.com>'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://locatalyze.com'

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number | null | undefined) {
  if (n == null) return '—'
  return '$' + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function verdictColor(v: string | null) {
  if (v === 'GO')      return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', emoji: '✅' }
  if (v === 'CAUTION') return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', emoji: '⚠️' }
  return                      { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', emoji: '🚫' }
}

// ── Report Ready Email HTML ───────────────────────────────────────────────────
function reportReadyHTML(report: any, reportUrl: string) {
  const vc = verdictColor(report.verdict)
  const fin = report.result_data?.financials || {}
  const annualProfit = fin.monthlyNetProfit ? fin.monthlyNetProfit * 12 : null

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your location analysis is ready</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo -->
        <tr><td style="padding-bottom:24px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:linear-gradient(135deg,#0F766E,#14B8A6);border-radius:10px;text-align:center;vertical-align:middle;">
                <span style="color:#ffffff;font-weight:800;font-size:16px;">L</span>
              </td>
              <td style="padding-left:10px;font-size:16px;font-weight:800;color:#1C1917;letter-spacing:-0.02em;">Locatalyze</td>
            </tr>
          </table>
        </td></tr>

        <!-- Main card -->
        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #E7E5E4;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">

          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(135deg,#0F766E 0%,#0891B2 100%);padding:28px 28px 24px;">
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Your report is ready</p>
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;line-height:1.2;">${report.business_type}</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">📍 ${report.location_name || '—'}</p>
            </td></tr>
          </table>

          <!-- Verdict + Score -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:24px 28px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${vc.bg};border:1.5px solid ${vc.border};border-radius:100px;padding:6px 16px;">
                    <span style="font-size:12px;font-weight:700;color:${vc.text};">${vc.emoji} ${report.verdict || '—'}</span>
                  </td>
                  <td style="padding-left:16px;">
                    <span style="font-size:32px;font-weight:900;color:${vc.text};">${report.overall_score ?? '—'}</span>
                    <span style="font-size:13px;color:#A8A29E;">/100</span>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Key metrics -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:20px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF9;border-radius:12px;border:1px solid #F5F5F4;overflow:hidden;">
                <tr>
                  ${annualProfit && annualProfit > 0 ? `
                  <td style="padding:14px 16px;border-right:1px solid #F5F5F4;width:50%;">
                    <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:0.06em;">Est. Annual Profit</p>
                    <p style="margin:0;font-size:18px;font-weight:900;color:#059669;">${fmt(annualProfit)}</p>
                  </td>` : ''}
                  <td style="padding:14px 16px;${annualProfit && annualProfit > 0 ? 'border-right:1px solid #F5F5F4;' : ''}width:${annualProfit && annualProfit > 0 ? '50%' : '100%'};">
                    <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:0.06em;">Monthly Revenue</p>
                    <p style="margin:0;font-size:18px;font-weight:900;color:#1C1917;">${fmt(fin.monthlyRevenue)}</p>
                  </td>
                </tr>
                <tr style="border-top:1px solid #F5F5F4;">
                  <td style="padding:14px 16px;border-right:1px solid #F5F5F4;">
                    <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:0.06em;">Break-even / Day</p>
                    <p style="margin:0;font-size:18px;font-weight:900;color:#1C1917;">${report.breakeven_daily ?? '—'} customers</p>
                  </td>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:0.06em;">Payback Period</p>
                    <p style="margin:0;font-size:18px;font-weight:900;color:#1C1917;">${report.breakeven_months && report.breakeven_months !== 999 ? report.breakeven_months + ' months' : 'Not viable'}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 28px 28px;text-align:center;">
              <a href="${reportUrl}" style="display:inline-block;background:#0F766E;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;box-shadow:0 2px 10px rgba(15,118,110,0.25);">
                View full report →
              </a>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A8A29E;">You received this because you ran a location analysis on Locatalyze.</p>
          <p style="margin:4px 0 0;font-size:11px;color:#A8A29E;">
            <a href="${SITE}" style="color:#0F766E;text-decoration:none;">locatalyze.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Welcome Email HTML ────────────────────────────────────────────────────────
function welcomeHTML(email: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Welcome to Locatalyze</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo -->
        <tr><td style="padding-bottom:24px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:linear-gradient(135deg,#0F766E,#14B8A6);border-radius:10px;text-align:center;vertical-align:middle;">
                <span style="color:#ffffff;font-weight:800;font-size:16px;">L</span>
              </td>
              <td style="padding-left:10px;font-size:16px;font-weight:800;color:#1C1917;letter-spacing:-0.02em;">Locatalyze</td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #E7E5E4;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">

          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(135deg,#0F766E 0%,#0891B2 100%);padding:28px;">
              <p style="margin:0 0 8px;font-size:28px;">👋</p>
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">Welcome to Locatalyze</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">You're ready to find the perfect location for your business.</p>
            </td></tr>
          </table>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:24px 28px;">
              <p style="margin:0 0 20px;font-size:14px;color:#78716C;line-height:1.7;">
                Locatalyze analyses competitor density, foot traffic, demographics, and financials to give you a real <strong style="color:#1C1917;">GO / CAUTION / NO</strong> verdict for any location in under 30 seconds.
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  { n: '1', title: 'Enter your business type', desc: 'Tell us what you\'re opening' },
                  { n: '2', title: 'Enter the address', desc: 'Any location in Australia' },
                  { n: '3', title: 'Get your verdict', desc: 'Full financial model in ~30 seconds' },
                ].map(s => `
                <tr><td style="padding-bottom:14px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;height:28px;background:#F0FDFA;border:1px solid #99F6E4;border-radius:8px;text-align:center;vertical-align:middle;font-size:12px;font-weight:800;color:#0F766E;">${s.n}</td>
                      <td style="padding-left:12px;">
                        <p style="margin:0;font-size:13px;font-weight:700;color:#1C1917;">${s.title}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#A8A29E;">${s.desc}</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>`).join('')}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr><td style="text-align:center;">
                  <a href="${SITE}/onboarding" style="display:inline-block;background:#0F766E;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;box-shadow:0 2px 10px rgba(15,118,110,0.25);">
                    Analyse your first location →
                  </a>
                  <p style="margin:10px 0 0;font-size:12px;color:#A8A29E;">Free · No credit card required · Takes 30 seconds</p>
                </td></tr>
              </table>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A8A29E;">You're receiving this because you signed up for Locatalyze.</p>
          <p style="margin:4px 0 0;font-size:11px;color:#A8A29E;">
            <a href="${SITE}" style="color:#0F766E;text-decoration:none;">locatalyze.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── API Route ─────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, to, report, reportId } = body

    if (!type || !to) {
      return NextResponse.json({ error: 'Missing type or to' }, { status: 400 })
    }

    if (type === 'report_ready') {
      const reportUrl = `${SITE}/dashboard/${reportId}`
      const fin = report?.result_data?.financials || {}
      const annualProfit = fin.monthlyNetProfit ? fin.monthlyNetProfit * 12 : null

      const subject = annualProfit && annualProfit > 0
        ? `Your ${report.business_type} analysis is ready — ${fmt(annualProfit)} annual profit potential`
        : `Your ${report.business_type} analysis is ready — ${report.verdict} verdict`

      await getResend().emails.send({
        from: FROM,
        to,
        subject,
        html: reportReadyHTML(report, reportUrl),
      })
    }

    if (type === 'welcome') {
      await getResend().emails.send({
        from: FROM,
        to,
        subject: 'Welcome to Locatalyze — analyse your first location',
        html: welcomeHTML(to),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}