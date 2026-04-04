import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/reports/[reportId]/save
// Body: { saved: boolean, status?: string, label?: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const { saved, status, label } = body

    if (typeof saved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const VALID_STATUSES = ['researching', 'shortlisted', 'visited', 'opened', 'rejected']
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Verify ownership
    const { data: report, error: fetchErr } = await supabase
      .from('reports')
      .select('id, user_id')
      .eq('report_id', reportId)
      .single()

    if (fetchErr || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    if (report.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates: Record<string, any> = {
      is_saved: saved,
      saved_at: saved ? new Date().toISOString() : null,
    }
    if (status) updates.location_status = status
    if (label !== undefined) updates.saved_label = label || null

    const { error: updateErr } = await supabase
      .from('reports')
      .update(updates)
      .eq('report_id', reportId)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true, is_saved: saved, location_status: status || null })
  } catch (err: any) {
    console.error('[Save API]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/reports/[reportId]/save — update status only (no save toggle)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { status } = await request.json()
    const VALID_STATUSES = ['researching', 'shortlisted', 'visited', 'opened', 'rejected']
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data: report, error: fetchErr } = await supabase
      .from('reports')
      .select('id, user_id')
      .eq('report_id', reportId)
      .single()

    if (fetchErr || !report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (report.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await supabase.from('reports').update({ location_status: status }).eq('report_id', reportId)

    return NextResponse.json({ success: true, location_status: status })
  } catch (err: any) {
    console.error('[Save PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
