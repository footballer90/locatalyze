/**
 * supabase/functions/auto-compute/index.ts
 *
 * Supabase Edge Function — triggered via Supabase Database Webhook
 * when the `reports` table is updated.
 *
 * Trigger condition: reports row updated where:
 *   - result_data IS NOT NULL  (n8n saved agent outputs)
 *   - computed_result IS NULL  (not yet computed)
 *
 * This bridges the gap between n8n saving raw data and the compute engine
 * running. When n8n completes, this function auto-triggers /api/compute.
 *
 * Setup:
 *   1. Deploy: supabase functions deploy auto-compute
 *   2. Create Database Webhook in Supabase Dashboard:
 *      Table: reports | Event: UPDATE
 *      Filter: result_data IS NOT NULL AND computed_result IS NULL
 *      Webhook URL: https://<project>.supabase.co/functions/v1/auto-compute
 */

const SITE_URL      = Deno.env.get('SITE_URL')      ?? 'https://www.locatalyze.com'
const COMPUTE_SECRET = Deno.env.get('COMPUTE_SECRET') ?? ''

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json()

    // Supabase webhooks send { type, table, schema, record, old_record }
    const record = payload?.record as Record<string, any> | null

    if (!record?.report_id) {
      return new Response(JSON.stringify({ skipped: true, reason: 'no report_id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Skip if already computed or no result_data
    if (record.computed_result != null || record.result_data == null) {
      return new Response(JSON.stringify({ skipped: true, reason: 'already computed or no result_data' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const computeUrl = `${SITE_URL}/api/compute`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (COMPUTE_SECRET) headers['x-compute-secret'] = COMPUTE_SECRET

    const res = await fetch(computeUrl, {
      method:  'POST',
      headers,
      body:    JSON.stringify({ reportId: record.report_id }),
      signal:  AbortSignal.timeout(28000),
    })

    const json = await res.json().catch(() => ({}))

    console.log(`[auto-compute] ${record.report_id} → HTTP ${res.status}`, json)

    return new Response(JSON.stringify({ ok: res.ok, reportId: record.report_id, result: json }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    console.error('[auto-compute] error:', e?.message)
    return new Response(JSON.stringify({ error: e?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
