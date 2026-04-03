// app/api/admin/newsletter-send/route.ts
// Server-side broadcast sender — calls Resend API to send to entire audience

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { WEEK_1, WEEK_2, WEEK_3, WEEK_4 } from '@/lib/newsletter-templates'

const TEMPLATES: Record<string, { subject: string; html: string }> = {
  week1: WEEK_1,
  week2: WEEK_2,
  week3: WEEK_3,
  week4: WEEK_4,
}

export async function POST(req: NextRequest) {
  // Auth check — admin only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('plan').eq('id', user!.id).single()
  if (profile?.plan !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { weekId } = await req.json()
  const template = TEMPLATES[weekId]
  if (!template) return NextResponse.json({ error: 'Invalid weekId' }, { status: 400 })

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const AUDIENCE_ID   = process.env.RESEND_AUDIENCE_ID

  if (!RESEND_API_KEY || !AUDIENCE_ID) {
    return NextResponse.json({ error: 'RESEND_API_KEY or RESEND_AUDIENCE_ID not set in env vars' }, { status: 500 })
  }

  // Get all contacts from audience
  const contactsRes = await fetch(
    `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
    { headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` } }
  )
  const contactsData = await contactsRes.json()
  const contacts: { email: string; unsubscribed: boolean }[] = contactsData.data || []
  const subscribers = contacts.filter(c => !c.unsubscribed).map(c => c.email)

  if (subscribers.length === 0) {
    return NextResponse.json({ error: 'No subscribers found' }, { status: 400 })
  }

  // Resend supports batch sending to up to 100 recipients per call
  // Split into chunks of 50 to be safe
  const chunks: string[][] = []
  for (let i = 0; i < subscribers.length; i += 50) {
    chunks.push(subscribers.slice(i, i + 50))
  }

  let sent = 0
  for (const chunk of chunks) {
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        chunk.map(email => ({
          from:    'Prash from Locatalyze <insights@locatalyze.com>',
          to:      [email],
          subject: template.subject,
          html:    template.html,
        }))
      ),
    })
    if (res.ok) sent += chunk.length
  }

  return NextResponse.json({ success: true, sent })
}