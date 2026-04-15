import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // ── One-time payment completed (pay-per-report) ─────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}
    const userId = meta.supabase_user_id
    const credits = parseInt(meta.credits ?? '0', 10)
    const reportId = meta.report_id

    if (userId && session.mode === 'payment' && credits > 0) {
      // Add credits to the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('report_credits')
        .eq('id', userId)
        .single()

      const currentCredits = profile?.report_credits ?? 0
      await supabase
        .from('profiles')
        .update({ report_credits: currentCredits + credits })
        .eq('id', userId)

      // If a specific report was being unlocked, mark it
      if (reportId) {
        await supabase
          .from('reports')
          .update({ is_unlocked: true })
          .eq('report_id', reportId)
          .eq('user_id', userId)

        // Deduct 1 credit for the unlocked report
        await supabase
          .from('profiles')
          .update({ report_credits: currentCredits + credits - 1 })
          .eq('id', userId)
      }
    }

    // Handle subscription checkout
    if (userId && session.mode === 'subscription') {
      const plan = meta.plan ?? 'pro'
      await supabase
        .from('profiles')
        .update({ plan, stripe_subscription_id: session.subscription as string })
        .eq('id', userId)
    }

    if (userId) {
      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: userId,
        event: 'payment_completed',
        properties: {
          plan: meta.plan ?? null,
          credits: parseInt(meta.credits ?? '0', 10),
          report_id: meta.report_id ?? null,
          payment_mode: session.mode,
          amount_total: session.amount_total,
          currency: session.currency,
        },
      })
    }
  }

  // ── Subscription lifecycle ──────────────────────────────────────────────
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const sub = event.data.object as Stripe.Subscription
    const customerId = sub.customer as string
    const plan = sub.items.data[0]?.price.lookup_key?.includes('business')
      ? 'business'
      : 'pro'

    await supabase
      .from('profiles')
      .update({ plan, stripe_subscription_id: sub.id })
      .eq('stripe_customer_id', customerId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
