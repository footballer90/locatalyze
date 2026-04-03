// app/api/auth/verify-captcha/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // If key not set, allow through (dev mode)
    return NextResponse.json({ success: true })
  }

  const formData = new FormData()
  formData.append('secret', secret)
  formData.append('response', token)
  // Pass the user's IP for extra security
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
  if (ip) formData.append('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification failed' },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Verification error' },
      { status: 500 }
    )
  }
}