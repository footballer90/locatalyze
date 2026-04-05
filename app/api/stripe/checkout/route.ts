import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// ── Price IDs: set in Vercel env vars ─────────────────────────────────────────
// Pay-per-report tiers (one-time payments)
const REPORT_PRICE_IDS: Record<string, string | undefined> = {
  single:  process.env.STRIPE_SINGLE_REPORT_PRICE_ID,  // $29
  pack3:   process.env.STRIPE_PACK3_PRICE_ID,           // $59
  pack10:  process.env.STRIPE_PACK10_PRICE_ID,          // $149
}

// Legacy subscription tiers (retained for power users)
const SUB_PRICE_IDS: Record<string, string | undefined> = {
  pro:      process.env.STRIPE_PRO_PRICE_ID,
  business: process.env.STRIPE_BUSINESS_PRICE_ID,
  annual:   process.env.STRIPE_ANNUAL_PRICE_ID,
}

// Report credits per purchase
const REPORT_CREDITS: Record<string, number> = {
  single: 1,
  pack3:  3,
  pack10: 10,
}

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const plan: string = body.plan ?? 'single'
  const reportId: string | null = body.reportId ?? null  // unlock a specific report

  // Determine payment mode
  const isSubscription = ['pro', 'business', 'annual'].includes(plan)
  const priceId = isSubscription ? SUB_PRICE_IDS[plan] : REPORT_PRICE_IDS[plan]

  if (!priceId) {
    return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const metadata: Record<string, string> = {
    plan,
    supabase_user_id: user.id,
    credits: String(REPORT_CREDITS[plan] ?? 0),
  }
  if (reportId) metadata.report_id = reportId

  const successUrl = reportId
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${reportId}?unlocked=true`
    : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true&plan=${plan}`

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isSubscription ? 'subscription' : 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
    metadata,
  })

  return NextResponse.json({ url: session.url })
}
