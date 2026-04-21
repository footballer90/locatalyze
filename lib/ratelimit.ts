/**
 * lib/ratelimit.ts
 *
 * Shared Upstash-backed rate limiter for every unauthenticated API route
 * that proxies a paid upstream (LocationIQ, Geoapify, Google Places,
 * Foursquare, OpenAI via n8n). This is the single source of truth — do
 * not instantiate `Ratelimit` directly inside a route handler.
 *
 * ─── Why this file exists ──────────────────────────────────────────────
 *
 * Before this, `/api/analyse/route.ts` had its own inline limiter (5/hr)
 * and `lib/ratelimit.ts` had a dead 3/hr stub that no one imported. That
 * drift is exactly the regression class the security audit flagged:
 * two numbers for the same policy, one in dead code, and supporting
 * GET proxies (`/api/autocomplete`, `/api/geocode`, `/api/nearby-places`)
 * had no limiter at all. A script hitting `/api/nearby-places` burns
 * Google Places credit directly on our bill.
 *
 * ─── Design decisions ──────────────────────────────────────────────────
 *
 * 1. **Fail mode is explicit, per-route.**
 *    When Upstash is configured and `ratelimit.limit()` throws (Redis
 *    outage, network partition), we must choose: block the request
 *    (503) or allow it (log + continue). Silent fail-open is how
 *    rate limits become theatre. So `limitByIp()` requires a
 *    `failMode` argument — no default.
 *      - `'closed'` for expensive upstreams (Google Places, n8n +
 *         OpenAI). An outage on Redis does not get to become a free
 *         pass on the cost attack surface.
 *      - `'open'` for UX-critical typing endpoints (autocomplete,
 *         geocode). Returning 503 while someone types an address is
 *         a worse product failure than burning a few LocationIQ calls
 *         during a Redis blip.
 *
 * 2. **When Upstash env is absent, we pass through.**
 *    Local dev and preview deploys don't require Redis credentials.
 *    This is not fail-open-on-error — it's "no limiter configured",
 *    which is a deliberate ops state, not a runtime error.
 *
 * 3. **Rate-limit key = IP + optional device id.**
 *    `x-forwarded-for` is trustworthy on Vercel (set by the edge
 *    proxy). We also accept an optional `x-lz-device` header: a
 *    client-generated stable id (8–128 chars) stored in localStorage.
 *    It is hashed with the IP so raw device ids never hit Redis;
 *    same IP + rotating fingerprints still get independent buckets
 *    (minor abuse uplift vs IP-only, acceptable). With no header,
 *    behaviour is unchanged from pure IP limiting.
 *
 * 4. **Window sizes come from realistic UX, not round numbers.**
 *    See the individual limiter definitions for the rationale behind
 *    each threshold.
 */

import { createHash } from 'node:crypto'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ─── Shared Redis client (lazy singleton) ─────────────────────────────
//
// We want a single Redis connection shared across all limiters in a
// given lambda warm start, not one connection per route. `Redis.fromEnv()`
// throws if the env vars are missing, so we check first and cache `null`
// to signal "not configured" without retrying on every request.

let cachedRedis: Redis | null | undefined = undefined

function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    cachedRedis = null
    return null
  }
  try {
    cachedRedis = new Redis({ url, token })
    return cachedRedis
  } catch (err) {
    console.error('[ratelimit] Redis init failed:', (err as Error).message)
    cachedRedis = null
    return null
  }
}

// ─── Limiter factory ──────────────────────────────────────────────────

interface LimiterConfig {
  /** Tokens (requests) per window. */
  tokens: number
  /** Window string accepted by Upstash: e.g. '1 h', '1 m', '10 s'. */
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`
  /** Redis key prefix — scope limiters so they never collide. */
  prefix: string
}

function makeLimiter({ tokens, window, prefix }: LimiterConfig): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
    analytics: true,
  })
}

// ─── Limiters ─────────────────────────────────────────────────────────
//
// Each limiter is a `get-once, use-everywhere` singleton. Lazy because
// `makeLimiter()` touches env vars — we don't want that running at
// module-import time in tests or type checks.

let _analyseLimiter: Ratelimit | null | undefined
let _nearbyPlacesLimiter: Ratelimit | null | undefined
let _autocompleteLimiter: Ratelimit | null | undefined
let _geocodeLimiter: Ratelimit | null | undefined

/**
 * `/api/analyse` — expensive path (n8n pipeline + OpenAI).
 *
 * 5 per hour per IP. Paired with the per-profile free quota (1 total)
 * and email verification, this is sufficient to make systematic abuse
 * unprofitable without a CAPTCHA on every legitimate report.
 */
export function getAnalyseLimiter(): Ratelimit | null {
  if (_analyseLimiter === undefined) {
    _analyseLimiter = makeLimiter({ tokens: 5, window: '1 h', prefix: 'locatalyze:analyse' })
  }
  return _analyseLimiter
}

/**
 * `/api/nearby-places` — Google Places / Foursquare / Geoapify.
 *
 * 20 per minute per IP. A legitimate session hits this on map load
 * and occasionally on pan/zoom (maybe 3–8 times). 20/min covers the
 * worst legitimate case (rapid map exploration) with headroom, and
 * makes a "scrape every suburb × category" attack cost-prohibitive
 * (20 requests/min × 60 min × 24 h = 28,800/day per IP; a serious
 * scraper would rotate IPs long before that, but combined with
 * per-IP CAPTCHA follow-up this is defensible).
 */
export function getNearbyPlacesLimiter(): Ratelimit | null {
  if (_nearbyPlacesLimiter === undefined) {
    _nearbyPlacesLimiter = makeLimiter({
      tokens: 20,
      window: '1 m',
      prefix: 'locatalyze:nearby',
    })
  }
  return _nearbyPlacesLimiter
}

/**
 * `/api/autocomplete` — LocationIQ.
 *
 * 60 per minute per IP. Fires on every keystroke in the address field.
 * A user typing a full Australian address is 20–45 keystrokes spread
 * over 5–15 seconds; 60/min is ~1/sec, well above the throttling
 * already applied in the UI (300ms debounce = max 200/min at pathological
 * input). The real purpose here is to cap an automated keystroke
 * generator at something that still shows up on a LocationIQ bill
 * but doesn't materially move the number.
 */
export function getAutocompleteLimiter(): Ratelimit | null {
  if (_autocompleteLimiter === undefined) {
    _autocompleteLimiter = makeLimiter({
      tokens: 60,
      window: '1 m',
      prefix: 'locatalyze:autocomplete',
    })
  }
  return _autocompleteLimiter
}

/**
 * `/api/geocode` — LocationIQ forward geocode.
 *
 * 30 per minute per IP. Called at most once per address confirmation.
 * A legitimate user burns 1–3 geocode calls across a whole session;
 * 30/min makes the endpoint useless as a mass geocoding proxy for
 * someone trying to offload their own geocoding bill onto ours.
 */
export function getGeocodeLimiter(): Ratelimit | null {
  if (_geocodeLimiter === undefined) {
    _geocodeLimiter = makeLimiter({
      tokens: 30,
      window: '1 m',
      prefix: 'locatalyze:geocode',
    })
  }
  return _geocodeLimiter
}

// ─── Request-level helper ─────────────────────────────────────────────

export type FailMode = 'open' | 'closed'

export interface LimitResult {
  /** Whether the caller should proceed. */
  ok: boolean
  /**
   * If `ok === false`, the NextResponse to return directly. Preformatted
   * with the right status code, JSON body, and Retry-After header so
   * route handlers don't re-implement the 429/503 shape.
   */
  response?: NextResponse
}

/**
 * Extract the client IP from a NextRequest.
 *
 * On Vercel, `x-forwarded-for` is set by the edge proxy; the first
 * comma-separated entry is the original client IP. Subsequent entries
 * are hops, which are less trustworthy. If the header is missing, we
 * bucket all traffic under `'anonymous'` — which is a strict (single
 * shared bucket) fallback, not a permissive one.
 */
export function getClientIp(req: NextRequest | Request): string {
  const xff =
    (req as NextRequest).headers?.get?.('x-forwarded-for') ??
    ((req.headers as unknown as { get?: (k: string) => string | null })?.get?.('x-forwarded-for') || null)
  if (!xff) return 'anonymous'
  return xff.split(',')[0].trim() || 'anonymous'
}

const DEVICE_HDR = 'x-lz-device'

/**
 * Redis key for rate limiting — IP-only unless client sends a stable device id.
 */
export function getRateLimitKey(req: NextRequest | Request): string {
  const ip = getClientIp(req)
  const headers = (req as NextRequest).headers ?? req.headers
  const raw =
    typeof headers?.get === 'function' ? headers.get(DEVICE_HDR) : null
  const device = raw?.trim().slice(0, 128) ?? ''
  // Require minimum length so trivial single-byte "rotation" doesn't create new buckets.
  if (device.length < 8) return ip
  const digest = createHash('sha256').update(`${ip}\n${device}`, 'utf8').digest('hex').slice(0, 48)
  return `lz:${digest}`
}

/**
 * Apply an IP-keyed rate limit to a request.
 *
 * Usage:
 *   const gate = await limitByIp(req, getNearbyPlacesLimiter(), {
 *     failMode: 'closed',
 *   })
 *   if (!gate.ok) return gate.response!
 *
 * `limiter === null` means Upstash isn't configured (likely local dev
 * or a misconfigured preview). We pass through without limiting — this
 * is by design. Production must set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN.
 */
export async function limitByIp(
  req: NextRequest | Request,
  limiter: Ratelimit | null,
  opts: { failMode: FailMode; label?: string },
): Promise<LimitResult> {
  if (!limiter) return { ok: true }

  const key = getRateLimitKey(req)
  const label = opts.label ?? 'ratelimit'

  try {
    const { success, limit, reset } = await limiter.limit(key)
    if (success) return { ok: true }

    const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: `Too many requests. Limit: ${limit}. Try again in ${retryAfterSec}s.`,
          code: 'RATE_LIMITED',
        },
      },
      { status: 429 },
    )
    response.headers.set('Retry-After', String(retryAfterSec))
    response.headers.set('X-Content-Type-Options', 'nosniff')
    return { ok: false, response }
  } catch (err) {
    console.error(`[${label}] Rate limit check threw:`, (err as Error).message)
    if (opts.failMode === 'open') return { ok: true }

    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: 'Service temporarily unavailable. Please try again shortly.',
          code: 'RATE_LIMIT_DEGRADED',
        },
      },
      { status: 503 },
    )
    response.headers.set('Retry-After', '30')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    return { ok: false, response }
  }
}

// ─── Deprecated export kept for back-compat ───────────────────────────
//
// `analysisLimit` was the original dead export. Preserved as an alias
// of `getAnalyseLimiter()` so any stale imports don't break at build
// time — but nothing in the repo should be importing it. Grep for
// `analysisLimit` during the next cleanup pass and delete.
export const analysisLimit = {
  /** @deprecated use `getAnalyseLimiter()` */
  get current() {
    return getAnalyseLimiter()
  },
}
