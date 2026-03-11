// app/api/newsletter/route.ts
// Handles newsletter subscriptions with honeypot bot protection and basic validation.

import { NextRequest, NextResponse } from 'next/server'

function err(msg: string, status: number) {
  return NextResponse.json({ success: false, error: msg }, { status })
}

// Simple in-memory rate limiter (resets on server restart; upgrade to Redis/Upstash for prod)
const submits = new Map<string, number[]>()
function rateOk(ip: string): boolean {
  const now = Date.now()
  const window = 60_000 // 1 min
  const times = (submits.get(ip) || []).filter(t => now - t < window)
  if (times.length >= 3) return false
  submits.set(ip, [...times, now])
  return true
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()

  if (!rateOk(ip)) {
    return err('Too many requests. Please wait a minute.', 429)
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return err('Invalid request', 400) }

  // Honeypot: bots fill every field including "website"
  if (body.website) {
    return NextResponse.json({ success: true }) // Silently discard bot submissions
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !/.+@.+\..+/.test(email) || email.length > 254) {
    return err('Invalid email address', 400)
  }

  // TODO: Connect to your email platform (Resend, Mailchimp, ConvertKit, etc.)
  // Example with Resend:
  // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! })

  console.log(`[Newsletter] New subscriber: ${email}`)

  return NextResponse.json({ success: true })
}