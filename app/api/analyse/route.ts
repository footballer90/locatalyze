import { NextRequest, NextResponse } from 'next/server'

// ─── Rate limiting (Upstash) ────────────────────────────────────
// Gracefully skip if env vars not set (local dev without Redis)
let ratelimit: any = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = require('@upstash/ratelimit')
    const { Redis } = require('@upstash/redis')
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    // 5 requests per user per hour
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
      prefix: 'locatalyze:analyse',
    })
  }
} catch {}

// ─── Input validation ───────────────────────────────────────────
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

  // Business type
  if (!businessType || typeof businessType !== 'string' || businessType.trim().length < 2) {
    return { valid: false, error: 'Business type is required' }
  }
  if (businessType.length > 100) return { valid: false, error: 'Business type too long' }

  // Address
  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return { valid: false, error: 'Address must be at least 5 characters' }
  }
  if (address.length > 300) return { valid: false, error: 'Address too long' }

  // Numbers
  const rent = Number(monthlyRent)
  const setup = Number(setupBudget)
  const ticket = Number(avgTicketSize)

  if (!isFinite(rent) || rent < 100 || rent > 500000) {
    return { valid: false, error: 'Monthly rent must be between $100 and $500,000' }
  }
  if (!isFinite(setup) || setup < 100 || setup > 10000000) {
    return { valid: false, error: 'Setup budget must be between $100 and $10,000,000' }
  }
  if (!isFinite(ticket) || ticket < 1 || ticket > 10000) {
    return { valid: false, error: 'Average ticket size must be between $1 and $10,000' }
  }

  // Sanitise strings — strip HTML/script tags
  const clean = (s: string) => s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim()

  return {
    valid: true,
    data: {
      businessType: clean(businessType),
      address:      clean(address),
      monthlyRent:  rent,
      setupBudget:  setup,
      avgTicketSize: ticket,
      userId:       typeof userId === 'string' ? userId.slice(0, 100) : undefined,
    },
  }
}

// ─── Security headers ───────────────────────────────────────────
function secureHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

function errorResponse(message: string, status: number): NextResponse {
  return secureHeaders(NextResponse.json({ success: false, error: { message } }, { status }))
}

// ─── Max duration (Vercel) ──────────────────────────────────────
export const maxDuration = 60

// ─── Handler ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Get identifier (user ID from header or IP address)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
  const userIdHeader = request.headers.get('x-user-id') || ip
  const identifier = `${userIdHeader}:${ip}`

  // 2. Rate limit check
  if (ratelimit) {
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier)
      if (!success) {
        const resetIn = Math.ceil((reset - Date.now()) / 60000)
        const res = errorResponse(
          `Rate limit reached. You can run ${limit} analyses per hour. Try again in ${resetIn} minute${resetIn !== 1 ? 's' : ''}.`,
          429
        )
        res.headers.set('X-RateLimit-Limit', String(limit))
        res.headers.set('X-RateLimit-Remaining', '0')
        res.headers.set('X-RateLimit-Reset', String(reset))
        return res
      }
    } catch {
      // If Redis is down, don't block the user — just log and continue
      console.error('[Rate limit] Redis unavailable, skipping')
    }
  }

  // 3. Parse + validate body
  let rawBody: any
  try {
    rawBody = await request.json()
  } catch {
    return errorResponse('Invalid JSON in request body', 400)
  }

  const validation = validatePayload(rawBody)
  if (!validation.valid) {
    return errorResponse(validation.error, 400)
  }

  const { data } = validation

  // 4. Check webhook URL configured
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return errorResponse('Analysis service not configured. Contact support.', 503)
  }

  // 5. Call n8n
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Locatalyze/1.0',
      },
      body: JSON.stringify(data),
    })

    const text = await response.text()

    if (!text || text.trim() === '') {
      return errorResponse('Analysis server returned an empty response. Please try again.', 502)
    }

    let result: any
    try {
      result = JSON.parse(text)
    } catch {
      console.error('[Analyse] n8n returned invalid JSON:', text.slice(0, 300))
      return errorResponse('Analysis server returned an unexpected response. Please try again.', 502)
    }

    return secureHeaders(NextResponse.json(result))

  } catch (err: any) {
    const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout')
    console.error('[Analyse] Fetch error:', err.message)
    return errorResponse(
      isTimeout
        ? 'Analysis timed out. Please try again — it usually completes in 20–30 seconds.'
        : 'Could not reach the analysis server. Please check your connection and try again.',
      502
    )
  }
}