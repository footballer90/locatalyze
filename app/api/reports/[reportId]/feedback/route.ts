import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/reports/[reportId]/feedback
// Body: { proceeded: boolean, accuracy: 1–5, notes?: string }
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
    const { proceeded, accuracy, notes, dismissed } = body

    // Verify ownership
    const { data: report, error: fetchErr } = await supabase
      .from('reports')
      .select('id, user_id')
      .eq('report_id', reportId)
      .single()

    if (fetchErr || !report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (report.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Dismiss without feedback
    if (dismissed === true) {
      await supabase
        .from('reports')
        .update({ feedback_dismissed_at: new Date().toISOString() })
        .eq('report_id', reportId)
      return NextResponse.json({ success: true, dismissed: true })
    }

    if (typeof proceeded !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload — proceeded required' }, { status: 400 })
    }
    if (accuracy !== undefined && (accuracy < 1 || accuracy > 5)) {
      return NextResponse.json({ error: 'accuracy must be 1–5' }, { status: 400 })
    }

    const feedback = {
      proceeded,
      accuracy:      accuracy ?? null,
      notes:         (typeof notes === 'string' ? notes.slice(0, 500) : null),
      submitted_at:  new Date().toISOString(),
    }

    const { error: updateErr } = await supabase
      .from('reports')
      .update({ outcome_feedback: feedback })
      .eq('report_id', reportId)

    if (updateErr) throw updateErr

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[Feedback API]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
