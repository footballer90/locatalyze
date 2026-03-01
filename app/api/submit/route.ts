import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, ''), // remove trailing slash if present
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Step 1: Read form data
    const body = await req.json()
    console.log('📥 Received form data:', JSON.stringify(body, null, 2))

    // Step 2: Save to Supabase
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        business_type:        body.business_type        || null,
        industry_category:    body.industry_category    || null,
        business_stage:       body.business_stage       || null,
        franchise_flag:       body.franchise_flag       || null,
        city:                 body.city                 || null,
        area:                 body.area                 || null,
        target_demographic:   body.target_demographic   || null,
        monthly_rent_budget:  body.monthly_rent_budget  ? Number(body.monthly_rent_budget)  : null,
        setup_budget:         body.setup_budget         ? Number(body.setup_budget)         : null,
        avg_ticket_size:      body.avg_ticket_size      ? Number(body.avg_ticket_size)      : null,
        daily_customers_goal: body.daily_customers_goal ? Number(body.daily_customers_goal) : null,
        lease_term:           body.lease_term           || null,
        space_size:           body.space_size           || null,
        parking_required:     body.parking_required     || null,
        foot_traffic_pref:    body.foot_traffic_pref    || null,
        competitors_okay:     body.competitors_okay     || null,
        priority_factor:      body.priority_factor      || null,
        timeline:             body.timeline             || null,
        extra_notes:          body.extra_notes          || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select('id')
      .single()

    if (error) {
      console.error('❌ Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save submission', details: error.message },
        { status: 500 }
      )
    }

    if (!data || !data.id) {
      console.error('❌ No ID returned from Supabase')
      return NextResponse.json(
        { error: 'No ID returned from database' },
        { status: 500 }
      )
    }

    const submissionId = data.id
    console.log('✅ Saved to Supabase. ID:', submissionId)

    // Step 3: Trigger n8n
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        const n8nPayload = {
          submission_id: submissionId,
          ...body
        }
        console.log('🚀 Calling n8n webhook:', webhookUrl)
        console.log('🚀 Payload:', JSON.stringify(n8nPayload, null, 2))

        const n8nRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n8nPayload)
        })

        console.log('✅ n8n responded with status:', n8nRes.status)
      } catch (err) {
        console.error('⚠️ n8n webhook error (non-fatal):', err)
      }
    } else {
      console.warn('⚠️ N8N_WEBHOOK_URL not set in .env.local')
    }

    // Step 4: Return the ID to the frontend
    console.log('📤 Returning submission_id to frontend:', submissionId)
    return NextResponse.json({ submission_id: submissionId })

  } catch (err) {
    console.error('❌ Unexpected error in /api/submit:', err)
    return NextResponse.json(
      { error: 'Server error', details: String(err) },
      { status: 500 }
    )
  }
}