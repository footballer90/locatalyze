import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 5) return NextResponse.json([])

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
