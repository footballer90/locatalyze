/**
 * lib/compute/cache.ts
 *
 * Redis caching layer for computed results (Upstash REST).
 *
 * Key strategy:
 *   computed:{businessTypeKey}:{suburb_lc}  →  ComputedResult JSON
 *
 * TTL:
 *   7 days  — fresh compute (first analysis for this suburb+type)
 *   30 days — backfill (cache warmed by a second identical analysis)
 *
 * This avoids re-running computeEngine() for repeated suburb+type queries,
 * since benchmarks don't change week-to-week.  Individual reportId data
 * (competitor names, listing prices) should NOT be cached — only the
 * benchmark-heavy financial output is stable enough.
 *
 * Graceful degradation: if Redis is unavailable, cache ops are no-ops.
 */

import type { ComputedResult } from '@/types/computed'

// ── Redis client (lazy-initialised) ──────────────────────────────────────────

let _redis: {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, opts?: { ex?: number }) => Promise<unknown>
} | null = null

function getRedis() {
  if (_redis) return _redis
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  // Upstash REST API — no SDK dependency, plain fetch
  _redis = {
    async get(key: string) {
      try {
        const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return null
        const json = await res.json()
        return typeof json.result === 'string' ? json.result : null
      } catch { return null }
    },

    async set(key: string, value: string, opts?: { ex?: number }) {
      try {
        const url_ = opts?.ex
          ? `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${opts.ex}`
          : `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`
        await fetch(url_, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch { /* no-op */ }
    },
  }
  return _redis
}

// ── Cache key helpers ─────────────────────────────────────────────────────────

const TTL_FRESH   = 60 * 60 * 24 * 7   // 7 days in seconds
const TTL_BACKFILL = 60 * 60 * 24 * 30  // 30 days in seconds

function makeCacheKey(bizKey: string, suburb: string): string {
  const s = suburb.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)
  return `computed:${bizKey}:${s}`
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Attempt to read a cached ComputedResult.
 * Returns null on cache miss, Redis error, or JSON parse failure.
 */
export async function getCachedResult(
  bizKey: string,
  suburb: string,
): Promise<ComputedResult | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const raw = await redis.get(makeCacheKey(bizKey, suburb))
    if (!raw) return null
    return JSON.parse(raw) as ComputedResult
  } catch {
    return null
  }
}

/**
 * Store a ComputedResult in Redis.
 * @param isBackfill  true if this suburb+type was already cached (use longer TTL)
 */
export async function setCachedResult(
  bizKey:     string,
  suburb:     string,
  result:     ComputedResult,
  isBackfill: boolean = false,
): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    const ttl = isBackfill ? TTL_BACKFILL : TTL_FRESH
    await redis.set(makeCacheKey(bizKey, suburb), JSON.stringify(result), { ex: ttl })
  } catch { /* no-op */ }
}

/**
 * Invalidate cache for a suburb+type (e.g. after a manual override).
 */
export async function invalidateCachedResult(
  bizKey: string,
  suburb: string,
): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/del/${encodeURIComponent(makeCacheKey(bizKey, suburb))}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      },
    )
  } catch { /* no-op */ }
}
