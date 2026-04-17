import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Only /dashboard/* requires authentication.
 * All marketing, blog, analyse, and public pages are intentionally open
 * so Google can crawl them without redirect errors.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Fast-path: non-dashboard routes need no auth check
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Build response that refreshes the session cookie
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: object) {
          request.cookies.set({ name, value, ...(options as Record<string, unknown>) })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...(options as Record<string, unknown>) })
        },
        remove(name: string, options: object) {
          request.cookies.set({ name, value: '', ...(options as Record<string, unknown>) })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...(options as Record<string, unknown>) })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Only run on dashboard routes — never touches marketing pages
  matcher: ['/dashboard/:path*'],
}
