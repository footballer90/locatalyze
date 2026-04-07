import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Rate limiting (graceful no-op if not configured) ───────────────────────
let ratelimit: any = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = require('@upstash/ratelimit')
    const { Redis }     = require('@upstash/redis')
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'locatalyze:analyse' })
  }
} catch {}

// after() keeps function alive post-response — maxDuration covers total execution
// n8n sequential pipeline can take 60-90s; give it 55s to at least receive the payload
export const maxDuration = 60

const FREE_LIMIT = 1

function errorResponse(msg: string, status: number) {
  const r = NextResponse.json({ success: false, error: { message: msg } }, { status })
  r.headers.set('X-Content-Type-Options', 'nosniff')
  r.headers.set('X-Frame-Options', 'DENY')
  return r
}

// ── Address parser: handles full state names, suburb-only, and standard formats ──
const STATE_CITY: Record<string, string> = {
  VIC: 'Melbourne', NSW: 'Sydney', QLD: 'Brisbane',
  SA:  'Adelaide',  WA:  'Perth',  TAS: 'Hobart',
  NT:  'Darwin',    ACT: 'Canberra',
}

const FULL_STATE_NAMES: Record<string, string> = {
  'western australia': 'WA',      'new south wales': 'NSW',
  'victoria': 'VIC',              'queensland': 'QLD',
  'south australia': 'SA',        'tasmania': 'TAS',
  'northern territory': 'NT',     'australian capital territory': 'ACT',
}

// 4-digit postcode → state abbreviation
function postcodeToState(pc: string): string {
  const n = parseInt(pc, 10)
  if (!n || isNaN(n)) return ''
  if (n >= 2000 && n <= 2999) return 'NSW'
  if (n >= 3000 && n <= 3999) return 'VIC'
  if (n >= 4000 && n <= 4999) return 'QLD'
  if (n >= 5000 && n <= 5999) return 'SA'
  if (n >= 6000 && n <= 6999) return 'WA'
  if (n >= 7000 && n <= 7999) return 'TAS'
  if (n >= 800  && n <= 999)  return 'NT'
  if (n >= 200  && n <= 299)  return 'ACT'
  // PO box ranges
  if (n >= 9000 && n <= 9999) return 'QLD'
  if (n >= 8000 && n <= 8999) return 'NSW'
  return ''
}

function parseAustralianAddress(address: string): {
  locality: string; area: string; city: string; state: string; postcode: string
} {
  const parts = address.split(',').map(s => s.trim()).filter(Boolean)
  let locality = parts[0] || ''
  let area = '', state = '', postcode = '', city = ''

  // Pass 1 – look for abbreviated state abbreviation (e.g. "VIC 3065" or just "VIC")
  for (let i = parts.length - 1; i >= 1; i--) {
    const seg = parts[i]
    const m = seg.match(/\b(NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\s*(\d{4})?\b/i)
    if (m) {
      state    = m[1].toUpperCase()
      postcode = m[2] || ''
      city     = STATE_CITY[state] || ''
      const suburbInSeg = seg.replace(m[0], '').replace(/,/g, '').trim()
      area = suburbInSeg || (i > 1 ? parts[i - 1] : parts[1])
      break
    }
  }

  // Pass 2 – look for full state names (e.g. "Western Australia")
  if (!state) {
    for (let i = parts.length - 1; i >= 1; i--) {
      const segLower = parts[i].toLowerCase().trim()
      const abbrev = FULL_STATE_NAMES[segLower]
      if (abbrev) {
        state = abbrev
        city  = STATE_CITY[abbrev] || ''
        area  = i > 1 ? parts[i - 1] : parts[1]
        break
      }
    }
  }

  // Pass 3 – look for a standalone 4-digit postcode segment
  if (!state) {
    for (let i = parts.length - 1; i >= 1; i--) {
      const seg = parts[i].trim()
      if (/^\d{4}$/.test(seg)) {
        postcode = seg
        const derived = postcodeToState(seg)
        if (derived) {
          state = derived
          city  = STATE_CITY[derived] || ''
          area  = i > 1 ? parts[i - 1] : parts[1]
        }
        break
      }
    }
  }

  // Pass 4 – look for "Australia" as last segment; take segment before as possible state/area
  if (!state) {
    const lastLower = (parts[parts.length - 1] || '').toLowerCase()
    if (lastLower === 'australia') {
      // Check second-to-last for a 4-digit postcode
      const secondLast = parts[parts.length - 2] || ''
      if (/^\d{4}$/.test(secondLast)) {
        postcode = secondLast
        const derived = postcodeToState(secondLast)
        if (derived) { state = derived; city = STATE_CITY[derived] || '' }
        area = parts.length >= 3 ? parts[parts.length - 3] : parts[1]
      }
    }
  }

  // Fallback area: second segment if still empty
  if (!area && parts.length >= 2) area = parts[1]

  // If city is still empty but we have state, map it
  if (!city && state) city = STATE_CITY[state] || ''

  // If the address has only 1 real segment (suburb-only), first part IS the area
  if (parts.length === 1) { area = locality; locality = '' }
  else if (!area) area = parts[1]

  // Strip digits-only prefix from area (artefact of "3065 Fitzroy")
  area = area.replace(/^\d+\s*/, '').replace(/,/g, '').trim()

  // If locality looks like just a suburb with no street (no digits), treat it as area too
  if (locality && !area && !/\d/.test(locality)) area = locality

  return { locality, area, city, state, postcode }
}

function validatePayload(body: any): { valid: true; data: any } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid request body' }
  const { businessType, address, monthlyRent, setupBudget, avgTicketSize, userId, lat, lng,
    operatingHours, seatingCapacity, businessMode, avgOrderValue, locationAccess,
    rentSource, estimatedSqm } = body
  if (!businessType || typeof businessType !== 'string' || businessType.trim().length < 2)
    return { valid: false, error: 'Business type is required' }
  if (!address || typeof address !== 'string' || address.trim().length < 5)
    return { valid: false, error: 'Address must be at least 5 characters' }
  const rent   = Number(monthlyRent)
  const setup  = Number(setupBudget)
  const ticket = Number(avgTicketSize)
  if (!isFinite(rent)   || rent   < 100  || rent   > 500000)  return { valid: false, error: 'Monthly rent must be between $100 and $500,000' }
  if (!isFinite(setup)  || setup  < 100  || setup  > 10000000) return { valid: false, error: 'Setup budget must be between $100 and $10,000,000' }
  if (!isFinite(ticket) || ticket < 1    || ticket > 10000)    return { valid: false, error: 'Average ticket size must be between $1 and $10,000' }
  const injectionPattern = /ignore|forget|disregard|pretend|you are|act as|jailbreak|prompt|system:|assistant:|\\n\\n/gi
  const clean = (s: string) => {
    const stripped = s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
    if (injectionPattern.test(stripped)) return stripped.replace(injectionPattern, '')
    return stripped
  }

  const parsed = parseAustralianAddress(address)
  const latNum = typeof lat === 'number' ? lat : (lat ? parseFloat(lat) : null)
  const lngNum = typeof lng === 'number' ? lng : (lng ? parseFloat(lng) : null)

  return {
    valid: true,
    data: {
      businessType:  clean(businessType),
      address:       clean(address),
      locality:      parsed.locality,
      area:          parsed.area,
      city:          parsed.city,
      state:         parsed.state,
      postcode:      parsed.postcode,
      monthlyRent:   rent,
      setupBudget:   setup,
      avgTicketSize: ticket,
      lat:           (latNum && isFinite(latNum)) ? latNum : null,
      lng:           (lngNum && isFinite(lngNum)) ? lngNum : null,
      userId: typeof userId === 'string' ? userId.slice(0, 100) : undefined,
      // Optional accuracy inputs
      operatingHours:  typeof operatingHours  === 'string' ? operatingHours  : null,
      seatingCapacity: typeof seatingCapacity === 'number' ? seatingCapacity : (seatingCapacity ? Number(seatingCapacity) || null : null),
      businessMode:    typeof businessMode    === 'string' ? businessMode    : null,
      avgOrderValue:   typeof avgOrderValue   === 'number' ? avgOrderValue   : (avgOrderValue ? Number(avgOrderValue) || null : null),
      locationAccess:  typeof locationAccess  === 'string' ? locationAccess  : null,
      rentSource:      typeof rentSource      === 'string' ? rentSource      : 'benchmark',
      estimatedSqm:    typeof estimatedSqm    === 'number' ? estimatedSqm    : (estimatedSqm ? Number(estimatedSqm) || null : null),
    }
  }
}

export async function POST(request: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────────────────
  if (ratelimit) {
    try {
      const ip = (request.headers.get('x-forwarded-for') || 'anonymous').split(',')[0].trim()
      const uid = request.headers.get('x-user-id') || ip
      const { success, limit, reset } = await ratelimit.limit(`${uid}:${ip}`)
      if (!success) {
        const resetIn = Math.ceil((reset - Date.now()) / 60000)
        return errorResponse(`Rate limit reached. ${limit} analyses per hour. Try again in ${resetIn}m.`, 429)
      }
    } catch { console.error('[Analyse] Rate limit check failed') }
  }

  // ── Parse & validate ───────────────────────────────────────────────────────
  let rawBody: any
  try { rawBody = await request.json() } catch { return errorResponse('Invalid JSON', 400) }
  const validation = validatePayload(rawBody)
  if (!validation.valid) return errorResponse(validation.error, 400)
  const { data } = validation

  // ── Webhook URL check ──────────────────────────────────────────────────────
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) return errorResponse('Analysis service not configured — N8N_WEBHOOK_URL missing.', 503)
  if (webhookUrl.includes('/webhook-test/')) return errorResponse('n8n using TEST URL. Use Production URL (/webhook/ not /webhook-test/).', 503)

  const userId = data.userId || request.headers.get('x-user-id')
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // ── Quota check ────────────────────────────────────────────────────────────
  if (userId) {
    try {
      const { data: profile } = await sb.from('profiles').select('total_analyses_used,plan').eq('id', userId).maybeSingle()
      const plan = profile?.plan || 'free'
      const used = profile?.total_analyses_used ?? 0
      if (plan !== 'admin' && plan === 'free' && used >= FREE_LIMIT) {
        return errorResponse(`You've used your free report. Unlock full reports from $29 at /upgrade`, 402)
      }
      if (!profile) {
        await sb.from('profiles').upsert({ id: userId, total_analyses_used: 0, plan: 'free' })
      }
    } catch (qErr: any) { console.error('[Analyse] Quota check failed:', qErr.message) }
  }

  // ── Deduplication: return cached report if same address+type was run in last 24h ──
  if (userId) {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data: cached } = await sb
        .from('reports')
        .select('report_id')
        .eq('user_id', userId)
        .eq('business_type', data.businessType)
        .eq('address', data.address)
        .eq('status', 'completed')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cached?.report_id) {
        console.log('[Analyse] Dedup hit — returning cached report:', cached.report_id)
        return NextResponse.json({ success: true, reportId: cached.report_id, cached: true })
      }
    } catch (dedupErr: any) {
      // Non-fatal: log and continue to run a fresh analysis
      console.warn('[Analyse] Dedup check failed (non-fatal):', dedupErr?.message)
    }
  }

  // ── Generate report ID & save PENDING row ─────────────────────────────────
  const reportId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const pendingRow = {
    report_id:     reportId,
    submission_id: reportId,
    user_id:       userId || null,
    status:        'pending',
    progress_step: 'Queued',
    business_type: data.businessType,
    address:       data.address,
    monthly_rent:  data.monthlyRent,
    input_data: {
      businessType:  data.businessType,
      address:       data.address,
      locality:      data.locality,
      area:          data.area,
      city:          data.city,
      state:         data.state,
      postcode:      data.postcode,
      country:       'Australia',
      monthlyRent:   data.monthlyRent,
      setupBudget:   data.setupBudget,
      avgTicketSize: data.avgTicketSize,
      lat:           data.lat,
      lng:           data.lng,
      operatingHours:  data.operatingHours  ?? null,
      seatingCapacity: data.seatingCapacity ?? null,
      businessMode:    data.businessMode    ?? null,
      avgOrderValue:   data.avgOrderValue   ?? null,
      locationAccess:  data.locationAccess  ?? null,
      rentSource:      data.rentSource      ?? 'benchmark',
      estimatedSqm:    data.estimatedSqm    ?? null,
    },
  }

  const { error: insertErr } = await sb.from('reports').upsert(pendingRow, { onConflict: 'report_id' })
  if (insertErr) {
    console.error('[Analyse] Failed to create pending row:', insertErr.message)
    return errorResponse('Failed to initialise report. Please try again.', 500)
  }

  // ── Trigger n8n via after() — runs after response is sent, keeps function alive ──
  // n8n master now ACKs immediately (202) then processes A1-A8 asynchronously.
  // after() ensures Vercel doesn't kill the function before the fetch completes.
  const n8nPayload = JSON.stringify({
    reportId,
    // Core inputs
    businessType:  data.businessType,
    address:       data.address,
    monthlyRent:   data.monthlyRent,
    setupBudget:   data.setupBudget,
    avgTicketSize: data.avgTicketSize,
    userId:        userId || null,
    // Parsed address components — used by A2 SerpApi queries
    locality:  data.locality,
    area:      data.area,
    city:      data.city,
    state:     data.state,
    postcode:  data.postcode,
    country:   'Australia',
    currency:  'A$',
    // Coordinates from Mapbox — eliminates re-geocoding in A2
    lat: data.lat ?? '',
    lng: data.lng ?? '',
    // Accuracy inputs — agents can use these for context
    operatingHours:  data.operatingHours  ?? null,
    seatingCapacity: data.seatingCapacity ?? null,
    businessMode:    data.businessMode    ?? null,
    avgOrderValue:   data.avgOrderValue   ?? null,
    locationAccess:  data.locationAccess  ?? null,
    rentSource:      data.rentSource      ?? 'benchmark',
    estimatedSqm:    data.estimatedSqm    ?? null,
  })

  after(async () => {
    try {
      await sb.from('reports')
        .update({ progress_step: 'Sending to analysis engine' })
        .eq('report_id', reportId)

      console.log('[Analyse] Calling n8n:', webhookUrl)

      // Strategy: send the payload to n8n, but don't require an immediate HTTP response.
      // n8n sequential workflows can take 60-120s before they send HTTP 200 back.
      // We abort after 55s — by then the full JSON payload has been delivered to n8n
      // (it's < 2KB so it's sent in the first packet). n8n continues processing and
      // writes results directly to Supabase. An AbortError is NOT treated as a failure.
      const controller = new AbortController()
      const payloadSentTimeout = setTimeout(() => controller.abort(), 55000)

      let hardFail = false
      try {
        const n8nRes = await fetch(webhookUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': 'Locatalyze/1.0' },
          body:    n8nPayload,
          signal:  controller.signal,
        })
        clearTimeout(payloadSentTimeout)
        console.log('[Analyse] n8n acked:', n8nRes.status)
        if (!n8nRes.ok) {
          console.error('[Analyse] n8n returned non-2xx:', n8nRes.status)
          hardFail = true
        }
      } catch (fetchErr: any) {
        clearTimeout(payloadSentTimeout)
        if (fetchErr?.name === 'AbortError') {
          // We timed out waiting for n8n's response — but n8n received the payload
          // and is processing asynchronously. Do NOT mark as failed.
          console.log('[Analyse] n8n payload sent, waiting for async result via Supabase realtime')
        } else {
          // True connection error (ECONNREFUSED, DNS failure, etc.)
          console.error('[Analyse] n8n unreachable:', fetchErr?.message)
          hardFail = true
        }
      }

      if (hardFail) {
        await sb.from('reports')
          .update({ status: 'failed', progress_step: 'Analysis engine error — please try again' })
          .eq('report_id', reportId)
      } else {
        await sb.from('reports')
          .update({ progress_step: 'Analysing your location' })
          .eq('report_id', reportId)
      }
    } catch (err: any) {
      console.error('[Analyse] after() error:', err?.message)
    }
  })

  // Return immediately — n8n saves result, frontend subscribes via Realtime
  console.log('[Analyse] Queued report:', reportId)
  return NextResponse.json({ success: true, reportId })
}