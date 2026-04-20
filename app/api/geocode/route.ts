import { NextRequest, NextResponse } from 'next/server'
import { getGeocodeLimiter, limitByIp } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  // Fail-open: geocode is UX-critical (user clicked Confirm Address);
  // returning 503 during a Redis blip would block a legitimate analysis.
  // LocationIQ has its own upstream quota, so the cost blast-radius is
  // bounded even if this limiter fails open temporarily.
  const gate = await limitByIp(req, getGeocodeLimiter(), {
    failMode: 'open',
    label: 'geocode',
  })
  if (!gate.ok) return gate.response!

  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 5) return NextResponse.json([])

  // Hard length cap — LocationIQ won't do anything useful with >200 chars
  // and accepting arbitrarily long input is a minor DoS vector.
  if (q.length > 200) return NextResponse.json([], { status: 400 })

  const key = process.env.LOCATIONIQ_API_KEY
  if (!key) return NextResponse.json([], { status: 503 })

  try {
    const res = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${key}&q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=1&countrycodes=au`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}
