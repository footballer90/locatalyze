import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, email, name, message } = body

    // ── Newsletter subscription ────────────────────────────────────────────
    if (type === 'newsletter') {
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
      }

      // Check honeypot — if 'website' field is filled, it's a bot
      if (body.website) {
        // Silently return 200 to confuse bots
        return NextResponse.json({ success: true })
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: email.toLowerCase().trim(), subscribed_at: new Date().toISOString(), active: true },
          { onConflict: 'email', ignoreDuplicates: true }
        )

      if (error) {
        console.error('Newsletter subscribe error:', error)
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    // ── Contact form ───────────────────────────────────────────────────────
    if (type === 'contact') {
      if (!email || !name || !message) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          message: message.trim(),
          submitted_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Contact form error:', error)
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })

  } catch (err) {
    console.error('/api/email error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}