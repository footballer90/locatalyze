/**
 * app/api/backfill/route.ts
 *
 * POST /api/backfill
 *
 * One-time admin endpoint to compute computed_result for all existing reports
 * that have result_data (agent outputs) but no computed_result.
 *
 * PROTECTED: requires x-compute-secret header (same as /api/compute).
 *
 * Returns a summary: { total, processed, failed, skipped }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

export const maxDuration = 60  // Allow up to 60s for batch processing

function err(msg: string, status: number) {
  return NextResponse.json({ success: false, error: msg }, { status })
}

export async function POST(request: NextRequest) {
  // Auth
  const secret = process.env.COMPUTE_SECRET
  if (secret) {
    const provided = request.headers.get('x-compute-secret') ?? ''
    if (provided !== secret) return err('Unauthorized', 401)
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Find all reports needing compute
  const { data: reports, error } = await sb
    .from('reports')
    .select('report_id')
    .is('computed_result', null)
    .not('result_data', 'is', null)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return err(`DB query failed: ${error.message}`, 500)
  if (!reports || reports.length === 0) {
    return NextResponse.json({ success: true, message: 'Nothing to backfill', total: 0 })
  }

  const siteUrl   = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locatalyze.com'
  const computeUrl = `${siteUrl}/api/compute`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) headers['x-compute-secret'] = secret

  let processed = 0, failed = 0, skipped = 0
  const errors: string[] = []

  // Process sequentially to avoid overloading Vercel
  for (const { report_id } of reports) {
    try {
      const res = await fetch(computeUrl, {
        method:  'POST',
        headers,
        body:    JSON.stringify({ reportId: report_id }),
        signal:  AbortSignal.timeout(25000),
      })
      const json = await res.json().catch(() => ({}))

      if (json.cached) {
        skipped++
      } else if (res.ok && json.success) {
        processed++
        console.log(`[backfill] ✓ ${report_id} — netProfit=${json.netProfit} verdict=${json.verdict}`)
      } else {
        failed++
        const errMsg = `${report_id}: HTTP ${res.status} — ${json.error ?? 'unknown'}`
        errors.push(errMsg)
        console.error(`[backfill] ✗ ${errMsg}`)
      }
    } catch (e: any) {
      failed++
      errors.push(`${report_id}: ${e?.message ?? 'timeout'}`)
    }
  }

  return NextResponse.json({
    success:   true,
    total:     reports.length,
    processed,
    skipped,
    failed,
    errors:    errors.slice(0, 10),
  })
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'locatalyze-backfill' })
}
