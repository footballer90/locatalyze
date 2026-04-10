// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
 const { name, email, reason, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
 }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // No API key — fail gracefully in dev
    console.log('Contact form submission (no RESEND_API_KEY):', { name, email, reason, message })
  return NextResponse.json({ success: true })
  }

  try {
    // Email 1 — notify Prash/Aman
    await fetch('https://api.resend.com/emails', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
   body: JSON.stringify({
        from: 'Locatalyze Contact <noreply@locatalyze.com>',
    to: ['pg4441@gmail.com'],
    subject: `New contact: ${reason} — ${name}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px 24px;background:#FAFAF9;">
      <div style="background:#fff;border-radius:16px;border:1px solid #E7E5E4;padding:28px;">
       <h2 style="font-size:18px;font-weight:800;color:#1C1917;margin:0 0 4px;">New contact form submission</h2>
       <p style="font-size:13px;color:#78716C;margin:0 0 24px;">Received from locatalyze.com</p>

       <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F5F5F4;color:#78716C;width:120px;">Name</td>
         <td style="padding:10px 0;border-bottom:1px solid #F5F5F4;font-weight:600;color:#1C1917;">${name}</td>
        </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F5F5F4;color:#78716C;">Email</td>
         <td style="padding:10px 0;border-bottom:1px solid #F5F5F4;font-weight:600;color:#0F766E;">
          <a href="mailto:${email}" style="color:#0F766E;">${email}</a>
         </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F5F5F4;color:#78716C;">Reason</td>
         <td style="padding:10px 0;border-bottom:1px solid #F5F5F4;color:#1C1917;">${reason}</td>
        </tr>
                <tr>
                  <td style="padding:16px 0 6px;color:#78716C;vertical-align:top;">Message</td>
         <td style="padding:16px 0 6px;color:#1C1917;line-height:1.65;">${message.replace(/\n/g, '<br/>')}</td>
        </tr>
              </table>

              <div style="margin-top:24px;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(reason)}"
          style="display:inline-block;background:#0F766E;color:#fff;padding:11px 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">
         Reply to ${name.split(' ')[0]} →
        </a>
              </div>
            </div>
          </div>
        `,
      }),
    })

    // Email 2 — auto-reply to sender
    await fetch('https://api.resend.com/emails', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
   body: JSON.stringify({
        from: 'Locatalyze <hello@locatalyze.com>',
    to: [email],
        subject: 'We received your message — Locatalyze',
    html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#F0FDF4;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:560px;margin:40px auto;padding:0 16px 40px;">

       <div style="text-align:center;padding:28px 0 20px;">
        <div style="display:inline-flex;align-items:center;gap:8px;">
         <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#0F766E,#14B8A6);display:inline-flex;align-items:center;justify-content:center;">
          <span style="color:#fff;font-weight:900;font-size:15px;">L</span>
         </div>
                  <span style="font-weight:800;font-size:17px;color:#0F172A;letter-spacing:-0.02em;">Locatalyze</span>
        </div>
              </div>

              <div style="background:#fff;border-radius:20px;border:1px solid #E2E8F0;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <div style="background:linear-gradient(135deg,#064E3B 0%,#065F46 40%,#059669 100%);padding:32px 36px;text-align:center;">
         <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.15);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px;"></div>
         <h1 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 6px;letter-spacing:-0.02em;">Message received</h1>
         <p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0;">We'll get back to you within one business day.</p>
        </div>

                <div style="padding:32px 36px;">
         <p style="font-size:15px;color:#334155;line-height:1.8;margin:0 0 20px;">
          Hi ${name.split(' ')[0]},
         </p>
                  <p style="font-size:15px;color:#334155;line-height:1.8;margin:0 0 20px;">
          Thanks for reaching out. We've received your message about <strong>${reason.toLowerCase()}</strong> and will respond to <strong>${email}</strong> within one business day.
         </p>

                  <div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
          <p style="font-size:12px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Your message</p>
          <p style="font-size:14px;color:#374151;line-height:1.7;margin:0;font-style:italic;">"${message.length > 200 ? message.slice(0, 200) + '…' : message}"</p>
         </div>

                  <p style="font-size:13px;color:#94A3B8;line-height:1.7;margin:0;">
          In the meantime, if your question is urgent you can reply directly to this email or email us at
                    <a href="mailto:hello@locatalyze.com" style="color:#0F766E;">hello@locatalyze.com</a>.
         </p>
                </div>
              </div>

              <div style="text-align:center;padding:20px 0 0;">
        <p style="font-size:12px;color:#94A3B8;margin:0;">Locatalyze · Perth, WA · Australia</p>
       </div>
            </div>
          </body>
          </html>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
  return NextResponse.json({ success: false, error: 'Failed to send. Please email us directly at hello@locatalyze.com' }, { status: 500 })
 }
}