import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  // Use NEXT_PUBLIC_SITE_URL env var if set, otherwise derive from request headers.
  // NEVER hardcode localhost — this runs in production.
  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ?? `${request.headers.get('x-forwarded-proto') ?? 'https'}://${request.headers.get('host') ?? 'localhost'}`
  return NextResponse.redirect(new URL('/auth/login', origin))
}
