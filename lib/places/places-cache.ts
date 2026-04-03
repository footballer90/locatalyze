/**
 * lib/places/places-cache.ts
 *
 * Redis cache for live Places API results (Upstash REST).
 *
 * Cache key: places:{lat3}:{lng3}:{radius}:{type}
 *   lat/lng rounded to 3dp ≈ 111m precision — same enough location = same cache
 *
 * TTL: 24 hours
 *   Fresh enough for competitor counts to be accurate.
 *   Avoids burning Google Places quota on repeated onboarding attempts.
 *
 * Caches the full structured competitor array (NormalizedPOI[]) and
 * computed LiveCompetitorDensity — not raw Google JSON.
 *
 * Graceful degradation: any Redis error → cache miss (caller fetches live).
 */

import type { NormalizedPOI }       from './multi-source'
import type { LiveCompetitorDensity } from './multi-source'

const PLACES_TTL_SECONDS = 24 * 60 * 60   // 24 hours

// ── Shared Upstash REST client (mirrors lib/compute/cache.ts) ─────────────────

let _redis: {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, opts?: { ex?: number }) => Promise<unknown>
} | null = null

function getRedis() {
  if (_redis) return _redis
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  _redis = {
    async get(key: string) {
      try {
        const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(2500),
        })
        if (!res.ok) return null
        const body = await res.json()
        return typeof body.result === 'string' ? body.result : null
      } catch { return null }
    },
    async set(key: string, value: string, opts?: { ex?: number }) {
      try {
        const url2 = opts?.ex
          ? `${url}/set/${encodeURIComponent(key)}?ex=${opts.ex}`
          : `${url}/set/${encodeURIComponent(key)}`
        await fetch(url2, {
          method:  'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body:    JSON.stringify(value),
          signal:  AbortSignal.timeout(2500),
        })
      } catch { /* non-fatal */ }
    },
  }
  return _redis
}

// ── Cache key ─────────────────────────────────────────────────────────────────

function placesKey(lat: string, lng: string, radius: number, type: string): string {
  const latR = parseFloat(lat).toFixed(3)
  const lngR = parseFloat(lng).toFixed(3)
  return `places:${latR}:${lngR}:${radius}:${type}`
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface PlacesCacheEntry {
  clusteredPOIs: NormalizedPOI[]
  density:       LiveCompetitorDensity
  cachedAt:      string   // ISO-8601
}

export async function getCachedPlaces(
  lat: string,
  lng: string,
  radius: number,
  type: string,
): Promise<PlacesCacheEntry | null> {
  const redis = getRedis()
  if (!redis) return null

  try {
    const raw = await redis.get(placesKey(lat, lng, radius, type))
    if (!raw) return null
    const parsed = JSON.parse(raw) as PlacesCacheEntry
    console.log(`[places-cache] HIT key=${placesKey(lat, lng, radius, type)} cachedAt=${parsed.cachedAt}`)
    return parsed
  } catch {
    return null
  }
}

export async function setCachedPlaces(
  lat: string,
  lng: string,
  radius: number,
  type: string,
  entry: PlacesCacheEntry,
): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    await redis.set(
      placesKey(lat, lng, radius, type),
      JSON.stringify(entry),
      { ex: PLACES_TTL_SECONDS },
    )
    console.log(`[places-cache] SET key=${placesKey(lat, lng, radius, type)} ttl=${PLACES_TTL_SECONDS}s`)
  } catch { /* non-fatal */ }
}
