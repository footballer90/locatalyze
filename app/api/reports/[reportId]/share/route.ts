import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

function secureHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  return res
}

// POST /api/reports/[reportId]/share
// Body: { action: 'enable' | 'disable' }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params

   const supabase = createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return secureHeaders(NextResponse.json({ error: 'Unauthorised' }, { status: 401 }))
    }

    const { action } = await request.json()
    if (!['enable', 'disable'].includes(action)) {
      return secureHeaders(NextResponse.json({ error: 'Invalid action' }, { status: 400 }))
    }

    // Verify ownership
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('id, report_id, user_id, is_public, public_token')
      .eq('report_id', reportId)
      .single()

    if (fetchError || !report) {
      return secureHeaders(NextResponse.json({ error: 'Report not found' }, { status: 404 }))
    }

    if (report.user_id !== user.id) {
      return secureHeaders(NextResponse.json({ error: 'Forbidden' }, { status: 403 }))
    }

    if (action === 'enable') {
      // Generate a token if one doesn't exist
      const token = report.public_token || crypto.randomBytes(16).toString('hex')

      const { error: updateError } = await supabase
        .from('reports')
        .update({ is_public: true, public_token: token })
        .eq('report_id', reportId)

      if (updateError) throw updateError

      return secureHeaders(NextResponse.json({
        success: true,
        is_public: true,
        public_token: token,
        share_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://locatalyze.vercel.app'}/r/${token}`,
      }))
    } else {
      // Disable sharing — keep the token so the same URL can be re-enabled later
      const { error: updateError } = await supabase
        .from('reports')
        .update({ is_public: false })
        .eq('report_id', reportId)

      if (updateError) throw updateError

      return secureHeaders(NextResponse.json({ success: true, is_public: false }))
    }
  } catch (err: any) {
    console.error('[Share API]', err)
    return secureHeaders(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}