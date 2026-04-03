import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 3) return NextResponse.json([])

  const key = process.env.LOCATIONIQ_API_KEY
  if (!key) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://api.locationiq.com/v1/autocomplete.php?key=${key}&q=${encodeURIComponent(q)}&countrycodes=au&limit=5&dedupe=1&normalizecity=1`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch {
    return NextResponse.json([])
  }
}
