import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await response.text()

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Empty response from analysis server' },
        { status: 502 }
      )
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Invalid response from analysis server', raw: text.slice(0, 200) },
        { status: 502 }
      )
    }

    return NextResponse.json(data)

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}