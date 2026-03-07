import { NextRequest, NextResponse } from 'next/server'
import { enrichLocation } from '@/lib/enrichLocation'

// ─── Rate limiting (graceful fallback) ──────────────────────────
let ratelimit: any = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = require('@upstash/ratelimit')
    const { Redis }     = require('@upstash/redis')
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'locatalyze:analyse' })
  }
} catch {}

export const maxDuration = 60

interface AnalysePayload {
  businessType: string
  address: string
  monthlyRent: number
  setupBudget: number
  avgTicketSize: number
  userId?: string
}

function validatePayload(body: any): { valid: true; data: AnalysePayload } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid request body' }
  const { businessType, address, monthlyRent, setupBudget, avgTicketSize, userId } = body
  if (!businessType || typeof businessType !== 'string' || businessType.trim().length < 2) return { valid: false, error: 'Business type is required' }
  if (!address || typeof address !== 'string' || address.trim().length < 5) return { valid: false, error: 'Address must be at least 5 characters' }
  const rent   = Number(monthlyRent)
  const setup  = Number(setupBudget)
  const ticket = Number(avgTicketSize)
  if (!isFinite(rent)   || rent   < 100 || rent   > 500000)  return { valid: false, error: 'Monthly rent must be between $100 and $500,000' }
  if (!isFinite(setup)  || setup  < 100 || setup  > 10000000) return { valid: false, error: 'Setup budget must be between $100 and $10,000,000' }
  if (!isFinite(ticket) || ticket < 1   || ticket > 10000)    return { valid: false, error: 'Average ticket size must be between $1 and $10,000' }
  const clean = (s: string) => s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()
  return { valid: true, data: { businessType: clean(businessType), address: clean(address), monthlyRent: rent, setupBudget: setup, avgTicketSize: ticket, userId: typeof userId === 'string' ? userId.slice(0, 100) : undefined } }
}

function secureHeaders(r: NextResponse) {
  r.headers.set('X-Content-Type-Options', 'nosniff')
  r.headers.set('X-Frame-Options', 'DENY')
  return r
}

function errorResponse(msg: string, status: number) {
  return secureHeaders(NextResponse.json({ success: false, error: { message: msg } }, { status }))
}

export async function POST(request: NextRequest) {
  // Rate limit
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
  if (ratelimit) {
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(`${request.headers.get('x-user-id') || ip}:${ip}`)
      if (!success) {
        const resetIn = Math.ceil((reset - Date.now()) / 60000)
        return errorResponse(`Rate limit reached. ${limit} analyses per hour. Try again in ${resetIn}m.`, 429)
      }
    } catch { console.error('[Rate limit] Redis unavailable') }
  }

  // Parse & validate
  let rawBody: any
  try { rawBody = await request.json() } catch { return errorResponse('Invalid JSON', 400) }
  const validation = validatePayload(rawBody)
  if (!validation.valid) return errorResponse(validation.error, 400)
  const { data } = validation

  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
  if (!webhookUrl) return errorResponse('Analysis service not configured', 503)

  // ── NEW: Enrich with real location data ────────────────────────────────
  let locationData = null
  try {
    locationData = await enrichLocation(data.address, data.businessType)
    console.log(`[Analyse] Enriched ${data.address}: ${locationData.competitors.count} competitors, suburb=${locationData.suburb}, income=${locationData.demographics.medianIncome}, quality=${locationData.dataQuality}`)
  } catch (err) {
    // Non-fatal — carry on without enrichment
    console.error('[Analyse] Enrichment failed:', err)
  }

  // ── Build enriched payload for n8n/Claude ──────────────────────────────
  const enrichedPayload = {
    ...data,
    // Real location signals — Claude uses these to score accurately
    locationSignals: locationData ? {
      suburb:            locationData.suburb,
      state:             locationData.state,
      dataQuality:       locationData.dataQuality,

      // Competitor data from Geoapify (REAL)
      competitorCount:        locationData.competitors.count,
      competitorNames:        locationData.competitors.names,
      competitionIntensity:   locationData.competitors.intensityLabel,
      competitionScore:       locationData.competitors.intensityScore,

      // Demographics from ABS suburb lookup (REAL)
      medianHouseholdIncome:  locationData.demographics.medianIncome,
      populationDensity:      locationData.demographics.populationDensity,
      areaAgeProfile:         locationData.demographics.ageProfile,
      affordabilityLabel:     locationData.demographics.affordabilityLabel,
      demographicScore:       locationData.demographics.incomeScore,
    } : null,
  }

  // ── Call n8n ───────────────────────────────────────────────────────────
  try {
    const response = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Locatalyze/1.0' },
      body:    JSON.stringify(enrichedPayload),
    })

    const text = await response.text()
    if (!text || text.trim() === '') return errorResponse('Analysis server returned empty response', 502)

    let result: any
    try { result = JSON.parse(text) } catch {
      console.error('[Analyse] n8n returned invalid JSON:', text.slice(0, 300))
      return errorResponse('Analysis server returned unexpected response', 502)
    }

    return secureHeaders(NextResponse.json(result))
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout')
    console.error('[Analyse] Fetch error:', err.message)
    return errorResponse(isTimeout ? 'Analysis timed out. Please try again.' : 'Could not reach analysis server. Check your connection.', 502)
  }
}