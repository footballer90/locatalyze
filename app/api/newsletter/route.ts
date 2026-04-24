// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'

function err(msg: string, status: number) {
 return NextResponse.json({ success: false, error: msg }, { status })
}

const submits = new Map<string, number[]>()
function rateOk(ip: string): boolean {
  const now = Date.now()
  const times = (submits.get(ip) || []).filter(t => now - t < 60_000)
  if (times.length >= 3) return false
  submits.set(ip, [...times, now])
  return true
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
 if (!rateOk(ip)) return err('Too many requests. Please wait a minute.', 429)

 let body: Record<string, unknown>
  try { body = await req.json() } catch { return err('Invalid request', 400) }

 if (body.website) return NextResponse.json({ success: true }) // honeypot

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
 if (!email || !/.+@.+\..+/.test(email) || email.length > 254) {
    return err('Invalid email address', 400)
 }

  const RESEND_API_KEY  = process.env.RESEND_API_KEY
  const AUDIENCE_ID     = process.env.RESEND_AUDIENCE_ID

  if (!RESEND_API_KEY) {
    console.log(`[Newsletter] No RESEND_API_KEY — subscriber: ${email}`)
    return NextResponse.json({ success: true })
  }

  // ── 1. Add to Resend audience (only if audience ID is set) ────────────────
  if (AUDIENCE_ID) {
    try {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method:  'POST',
    headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
     'Content-Type': 'application/json',
    },
        body: JSON.stringify({ email, unsubscribed: false }),
      })
    } catch (e) {
      console.error('[Newsletter] Audience add error:', e)
  }
  }

  // ── 2. Send welcome email ─────────────────────────────────────────────────
  try {
    await fetch('https://api.resend.com/emails', {
   method:  'POST',
   headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
   },
      body: JSON.stringify({
        from:    'Prash from Locatalyze <insights@locatalyze.com>',
    to:      [email],
        subject: 'Welcome to Locatalyze Weekly Insights ',
    html:    buildWelcomeEmail(email),
      }),
    })
    console.log(`[Newsletter] Welcome email sent to: ${email}`)
  } catch (e) {
    console.error('[Newsletter] Send error:', e)
 }

  return NextResponse.json({ success: true })
}

function buildWelcomeEmail(email: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to Locatalyze Insights</title></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #E5E7EB;overflow:hidden;">

 <!-- Header -->
  <div style="background:linear-gradient(135deg,#0C1F1C 0%,#0F766E 60%,#0891B2 100%);padding:36px 40px;">
  <div style="font-size:13px;font-weight:800;color:#34D399;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:16px;">Locatalyze Insights</div>
  <h1 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 10px;letter-spacing:-0.03em;line-height:1.2;">You're in. Weekly location intelligence starts now.</h1>
  <p style="font-size:14px;color:rgba(255,255,255,0.65);margin:0;line-height:1.6;">Every week: where Australian businesses are opening, failing, and thriving.</p>
 </div>

  <!-- Body -->
  <div style="padding:36px 40px;">
  <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
   Every week we dig into Australian suburb data and share insights that help founders and business owners make smarter location decisions — before they sign a lease.
    </p>

    <!-- What you'll get -->
  <div style="background:#F0FDF4;border-left:4px solid #34D399;border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:28px;">
   <p style="font-size:12px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 14px;">What lands in your inbox each week</p>
   <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:5px 0;font-size:14px;color:#374151;"><span style="margin-right:10px;"></span><strong>Suburb of the Week</strong> — one suburb, fully analysed</td></tr>
    <tr><td style="padding:5px 0;font-size:14px;color:#374151;"><span style="margin-right:10px;"></span><strong>Business trend</strong> — what's growing and where</td></tr>
    <tr><td style="padding:5px 0;font-size:14px;color:#374151;"><span style="margin-right:10px;"></span><strong>Risk alert</strong> — suburbs showing early warning signs</td></tr>
    <tr><td style="padding:5px 0;font-size:14px;color:#374151;"><span style="margin-right:10px;"></span><strong>Opportunity spotlight</strong> — underserved demand signals</td></tr>
    <tr><td style="padding:5px 0;font-size:14px;color:#374151;"><span style="margin-right:10px;"></span><strong>Data of the week</strong> — one sharp, shareable stat</td></tr>
   </table>
    </div>

    <p style="font-size:14px;color:#6B7280;line-height:1.7;margin:0 0 28px;">
   Your first insights email arrives this week. In the meantime, you can analyse any Australian address free — get a full GO / CAUTION / NO verdict with competitor mapping and financials in about 90 seconds.
    </p>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:28px;">
   <a href="https://locatalyze.com" style="display:inline-block;background:#0F766E;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">
    Analyse a location free →
      </a>
    </div>

    <p style="font-size:13px;color:#9CA3AF;line-height:1.6;margin:0;">
   — Prash<br>
      <span style="color:#D1D5DB;">Founder, Locatalyze · Perth, WA</span>
  </p>
  </div>

  <!-- Footer -->
  <div style="padding:20px 40px;border-top:1px solid #F3F4F6;background:#FAFAFA;">
  <p style="font-size:11px;color:#9CA3AF;margin:0;line-height:1.6;">
   You subscribed at locatalyze.com · 
      <a href="https://locatalyze.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9CA3AF;">Unsubscribe</a>
  </p>
  </div>
</div>
</body>
</html>`
}