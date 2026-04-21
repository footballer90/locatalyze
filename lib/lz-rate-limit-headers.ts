/**
 * Optional client id for API rate limiting (see `getRateLimitKey` in lib/ratelimit.ts).
 * Only call from client components — never from Server Components or Route Handlers.
 */
const STORAGE_KEY = 'lz_rl_device_v1'

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    /* ignore */
  }
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`
}

export function lzRateLimitHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id || id.length < 8) {
      id = newId()
      localStorage.setItem(STORAGE_KEY, id)
    }
    return { 'x-lz-device': id.slice(0, 128) }
  } catch {
    return {}
  }
}
