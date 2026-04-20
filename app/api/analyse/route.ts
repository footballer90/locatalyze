import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { getPostHogClient } from '@/lib/posthog-server'
import { getAnalyseLimiter, limitByIp } from '@/lib/ratelimit'

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
  // ACT ranges MUST be checked before NSW — Canberra postcodes (2600–2620, 2900–2920)
  // fall inside the NSW 2000–2999 range and would be misclassified otherwise.
  if (n >= 2600 && n <= 2620) return 'ACT'  // Canberra inner (Civic, Braddon, Barton…)
  if (n >= 2900 && n <= 2920) return 'ACT'  // Canberra south (Woden, Tuggeranong…)
  if (n >= 2000 && n <= 2999) return 'NSW'
  if (n >= 3000 && n <= 3999) return 'VIC'
  if (n >= 4000 && n <= 4999) return 'QLD'
  if (n >= 5000 && n <= 5999) return 'SA'
  if (n >= 6000 && n <= 6999) return 'WA'
  if (n >= 7000 && n <= 7999) return 'TAS'
  if (n >= 800  && n <= 999)  return 'NT'
  if (n >= 200  && n <= 299)  return 'ACT'  // ACT PO box range
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
      // FIX: use parts[i-1] when i>=1, not parts[1] when state is at index 1
      area = suburbInSeg || (i >= 1 ? parts[i - 1] : parts[0])
      break
    }
  }

  // Pass 2 – look for full state names (e.g. "Western Australia", "Queensland")
  if (!state) {
    for (let i = parts.length - 1; i >= 1; i--) {
      const segLower = parts[i].toLowerCase().trim()
      const abbrev = FULL_STATE_NAMES[segLower]
      if (abbrev) {
        state = abbrev
        city  = STATE_CITY[abbrev] || ''
        // FIX: when state is at index 1, use parts[0] (the suburb), not parts[1] (the state)
        area  = i >= 1 ? parts[i - 1] : parts[0]
        // Also extract postcode from next segment if present (e.g. "Rockhampton, Queensland, 4700")
        if (!postcode && i + 1 < parts.length) {
          const nextSeg = parts[i + 1].trim()
          if (/^\d{4}$/.test(nextSeg)) postcode = nextSeg
        }
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
  // ── Input sanitiser (defense-in-depth for LLM prompt injection) ─────────────
  //
  // User-supplied strings (address, businessType, operatingHours, etc.) are
  // shipped to n8n, which interpolates them into an OpenAI prompt. This
  // function is the last chokepoint before that happens — it must assume
  // the input is hostile.
  //
  // Layers, in order:
  //   1. Strip invisible / bidi / control unicode. Zero-width joiners,
  //      right-to-left overrides, and bidi isolates are the classic
  //      vectors for hiding instructions inside otherwise innocent-looking
  //      strings ("Sydney" + U+202E + "esaelp erongi"). These characters
  //      render invisibly to the user typing the address but survive into
  //      the LLM prompt.
  //   2. Strip HTML angle brackets (XSS hygiene for any downstream render).
  //   3. Collapse all whitespace variants (including U+00A0 nbsp and
  //      U+3000 ideographic space) into ASCII space — prevents
  //      "   ignore previous" from slipping past substring filters that
  //      match on ASCII space.
  //   4. Substring filter for the most common injection patterns.
  //      This is NOT sufficient on its own (trivially bypassed by
  //      paraphrase or encoding), but it raises the bar for a casual
  //      attacker copy-pasting a known jailbreak.
  //   5. Hard length cap. Passed in per-field because "address" can
  //      legitimately be 180 chars but "businessType" shouldn't exceed 60.
  //
  // IMPORTANT: regex with `g` flag are stateful (lastIndex advances on
  // every .test()/.exec() call) — a shared instance would produce
  // unpredictable results. Each call builds fresh regexes inside.
  const clean = (s: string, maxLen: number) => {
    const stripInvisible = s
      // Zero-width + bidi + directional formatting: U+200B-U+200F,
      // U+202A-U+202E (LRE/RLE/PDF/LRO/RLO), U+2066-U+2069 (isolates),
      // U+FEFF (BOM), U+180E (Mongolian vowel separator).
      .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u180E]/g, '')
      // C0 and C1 control characters (except \t \n \r which we normalise below).
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    const noHtml = stripInvisible.replace(/<[^>]*>/g, '').replace(/[<>]/g, '')
    const normalisedWs = noHtml.replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, ' ').trim()
    const filtered = normalisedWs.replace(
      /ignore|forget|disregard|pretend|you are|act as|jailbreak|prompt|system:|assistant:|\\n\\n/gi,
      '',
    )
    return filtered.slice(0, maxLen)
  }

  // Field-level length caps. Numbers chosen from realistic Australian
  // address lengths + reasonable business descriptors; exceeding any of
  // these is a signal of either bad input or an attempt to stuff a
  // prompt inside a field.
  const MAX = {
    address: 200,
    businessType: 60,
    operatingHours: 100,
    businessMode: 40,
    locationAccess: 40,
    rentSource: 40,
  } as const

  const parsed = parseAustralianAddress(address)
  let latNum = typeof lat === 'number' ? lat : (lat ? parseFloat(lat) : null)
  let lngNum = typeof lng === 'number' ? lng : (lng ? parseFloat(lng) : null)

  // ── Coordinate × state cross-validation ─────────────────────────────────────
  // If the user's Mapbox pin is in the wrong state (e.g. lng=138.66 but state=NSW),
  // null out the coordinates so the compute engine falls back to text-based search
  // rather than running A1 competitor search in one state and A3/A5 in another.
  const STATE_LNG_BOUNDS: Record<string, [number, number]> = {
    NSW: [140, 154], VIC: [140, 150], QLD: [137, 155],
    SA:  [129, 142], WA:  [112, 130], TAS: [143, 149],
    NT:  [129, 139], ACT: [148, 150],
  }
  if (lngNum !== null && isFinite(lngNum) && parsed.state && STATE_LNG_BOUNDS[parsed.state]) {
    const [minLng, maxLng] = STATE_LNG_BOUNDS[parsed.state]
    if (lngNum < minLng || lngNum > maxLng) {
      console.warn(
        `[analyse] Coordinate mismatch: lng=${lngNum} is outside expected range for ` +
        `${parsed.state} (${minLng}–${maxLng}). Nulling coordinates to prevent cross-state data contamination.`
      )
      latNum = null
      lngNum = null
    }
  }

  return {
    valid: true,
    data: {
      businessType:  clean(businessType, MAX.businessType),
      address:       clean(address, MAX.address),
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
      // Optional accuracy inputs — all string fields pass through clean()
      // with field-specific caps so a hostile payload can't embed a
      // 5,000-char instruction block inside e.g. `operatingHours`.
      operatingHours:  typeof operatingHours  === 'string' ? clean(operatingHours, MAX.operatingHours)  : null,
      seatingCapacity: typeof seatingCapacity === 'number' ? seatingCapacity : (seatingCapacity ? Number(seatingCapacity) || null : null),
      businessMode:    typeof businessMode    === 'string' ? clean(businessMode, MAX.businessMode)      : null,
      avgOrderValue:   typeof avgOrderValue   === 'number' ? avgOrderValue   : (avgOrderValue ? Number(avgOrderValue) || null : null),
      locationAccess:  typeof locationAccess  === 'string' ? clean(locationAccess, MAX.locationAccess)  : null,
      rentSource:      typeof rentSource      === 'string' ? clean(rentSource, MAX.rentSource)          : 'benchmark',
      estimatedSqm:    typeof estimatedSqm    === 'number' ? estimatedSqm    : (estimatedSqm ? Number(estimatedSqm) || null : null),
    }
  }
}

export async function POST(request: NextRequest) {
  // ── Rate limit (fail-closed) ────────────────────────────────────────────────
  //
  // Uses the shared IP-keyed limiter from `lib/ratelimit.ts`. Fail mode
  // is 'closed': if Redis is unreachable, we return 503 rather than
  // letting the request through unlimited. This route triggers an n8n
  // pipeline + OpenAI call — a Redis outage is not allowed to become an
  // unbounded-cost bug.
  //
  // The previous implementation silently swallowed the error and
  // continued, which is exactly how rate limits become security theatre.
  const gate = await limitByIp(request, getAnalyseLimiter(), {
    failMode: 'closed',
    label: 'analyse',
  })
  if (!gate.ok) return gate.response!

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

  // ── Resolve userId from the authenticated session (NEVER from the request body) ──
  // Trusting userId from the body would allow one user to consume another's quota slot
  // or to receive another user's deduplication cache. Read it from the Supabase JWT
  // cookie instead. Unauthenticated access remains allowed (userId = null) — rate
  // limiting is the only protection in that case.
  let userId: string | null = null
  try {
    const authClient = await createAuthClient()
    const { data: { user: sessionUser } } = await authClient.auth.getUser()
    userId = sessionUser?.id ?? null
    // Block unverified accounts — users created before the email verification gate
    // was added will have email_confirmed_at = null. Require verification before
    // running analyses to prevent abuse via throwaway unverified accounts.
    if (sessionUser && !sessionUser.email_confirmed_at) {
      return errorResponse(
        'Email not verified. Check your inbox for a verification link before running an analysis.',
        403
      )
    }
  } catch {
    // Non-fatal: fall back to unauthenticated (quota skipped, rate limit still applies)
    console.warn('[Analyse] Could not resolve session user — proceeding without userId')
  }

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
        .in('status', ['complete', 'completed'])
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

  // Track analysis started (server-side)
  try {
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: userId ?? 'anonymous',
      event: 'analysis_started',
      properties: {
        report_id: reportId,
        business_type: data.businessType,
        area: data.area,
        city: data.city,
        state: data.state,
        monthly_rent: data.monthlyRent,
        authenticated: userId !== null,
      },
    })
  } catch { /* non-fatal */ }

  // ── Trigger n8n via after() — runs after response is sent, keeps function alive ──
  // n8n master now ACKs immediately (202) then processes A1-A8 asynchronously.
  // after() ensures Vercel doesn't kill the function before the fetch completes.
  // ── n8n payload ────────────────────────────────────────────────────────────
  //
  // Shape note, for the n8n workflow author:
  //   - Top-level keys are SYSTEM-CONTROLLED (reportId, parsed address
  //     components, coordinates, currency). Safe to interpolate into a
  //     prompt without quoting.
  //   - `userInputs.*` keys are USER-CONTROLLED and have already passed
  //     through the hardened `clean()` + length caps above. They must
  //     still be treated as hostile in any downstream prompt template:
  //       - never interpolate raw into a system message;
  //       - always pass as a JSON argument to a tool call, or wrap in a
  //         clearly delimited block (e.g. <<<USER_INPUT>>> ... <<<END>>>)
  //         with an instruction ordering that disallows execution of
  //         instructions found inside that block.
  //
  // The current n8n node uses `{{ $json.body }}` which dumps the entire
  // payload as one blob — that's the prompt-injection surface the audit
  // flagged. Splitting system vs user here is the structural precondition
  // for fixing it on the n8n side without having to re-engineer every
  // agent node at once.
  const n8nPayload = JSON.stringify({
    reportId,
    // Parsed address components (system-derived from user address)
    locality:  data.locality,
    area:      data.area,
    suburb:    data.area,     // alias — A3/A5 should use suburb-level search, not city
    city:      data.city,
    state:     data.state,
    postcode:  data.postcode,
    country:   'Australia',
    currency:  'A$',
    // Validated numeric inputs (not user-templatable strings; safe)
    monthlyRent:   data.monthlyRent,
    setupBudget:   data.setupBudget,
    avgTicketSize: data.avgTicketSize,
    seatingCapacity: data.seatingCapacity ?? null,
    avgOrderValue:   data.avgOrderValue   ?? null,
    estimatedSqm:    data.estimatedSqm    ?? null,
    // Coordinates (Mapbox-supplied, bounds-validated above)
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    userId: userId || null,
    // User-controlled free-text fields. Treat as hostile in any LLM
    // prompt template. See shape note above.
    userInputs: {
      businessType:    data.businessType,
      address:         data.address,
      operatingHours:  data.operatingHours  ?? null,
      businessMode:    data.businessMode    ?? null,
      locationAccess:  data.locationAccess  ?? null,
      rentSource:      data.rentSource      ?? 'benchmark',
    },
    // ── Back-compat mirror ──────────────────────────────────────────────────
    // The existing n8n workflow reads these at the top level. Duplicate
    // them so this change doesn't break the deployed pipeline. Once n8n
    // has been updated to read from `userInputs.*` exclusively, remove
    // the mirror.
    businessType:    data.businessType,
    address:         data.address,
    operatingHours:  data.operatingHours  ?? null,
    businessMode:    data.businessMode    ?? null,
    locationAccess:  data.locationAccess  ?? null,
    rentSource:      data.rentSource      ?? 'benchmark',
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