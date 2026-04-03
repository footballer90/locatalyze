import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to 'next' if it's a safe relative path, otherwise fall back to /dashboard
  const redirectPath = next && next.startsWith('/') ? next : '/dashboard'
  return NextResponse.redirect(origin + redirectPath)
}
