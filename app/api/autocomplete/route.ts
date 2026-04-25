import { NextRequest, NextResponse } from 'next/server'
import { getAutocompleteLimiter, limitByIp } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  // Fail-open: autocomplete fires on every keystroke — returning 503 on
  // a Redis blip would break the address field entirely. The limiter's
  // job here is to cap obvious abuse (automated keystroke generators),
  // not to enforce exact billing boundaries.
  const gate = await limitByIp(req, getAutocompleteLimiter(), {
    failMode: 'open',
    label: 'autocomplete',
  })
  if (!gate.ok) return gate.response!

  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 3) return NextResponse.json([])

  // Hard length cap — autocomplete queries longer than this aren't
  // legitimate user input.
  if (q.length > 200) return NextResponse.json([], { status: 400 })

  const key = process.env.LOCATIONIQ_API_KEY
  if (!key) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://api.locationiq.com/v1/autocomplete.php?key=${key}&q=${encodeURIComponent(q)}&countrycodes=au&limit=5&dedupe=1&normalizecity=1`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    const autocompleteRes = NextResponse.json(Array.isArray(data) ? data : [])
    autocompleteRes.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return autocompleteRes
  } catch {
    return NextResponse.json([])
  }
}
