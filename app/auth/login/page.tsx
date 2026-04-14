'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import posthog from 'posthog-js'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
  n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF', red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!email || !password) { setError('Please enter your email and password'); return }
    setLoading(true); setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    setLoading(false)
    if (err) { setError('Invalid email or password. Please try again.'); return }

    const supabaseUser = (await createClient().auth.getUser()).data.user
    if (supabaseUser) {
      posthog.identify(supabaseUser.id, { email: email.trim().toLowerCase() })
      posthog.capture('user_logged_in', { email: email.trim().toLowerCase() })
    }

    // Respect the redirectTo param set by middleware (or by our own code)
    const redirectTo = searchParams.get('redirectTo')
    if (redirectTo && redirectTo.startsWith('/')) {
      router.push(redirectTo)
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  const inputStyle = {
    width: '100%', background: S.n50, border: `1.5px solid ${S.n200}`,
    borderRadius: 10, padding: '12px 14px', fontSize: 15, color: S.n800,
    outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  }
  const labelStyle = {
    fontSize: 11, fontWeight: 700 as const, color: S.n700,
    display: 'block' as const, marginBottom: 7,
    textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} button{font-family:inherit;cursor:pointer;} input{font-family:inherit;}`}</style>

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
        </Link>
        <Link href="/auth/signup" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 9, padding: '7px 16px', fontWeight: 700 }}>
          Sign up free
        </Link>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img src="/logo.svg" alt="Locatalyze" style={{ height: 40, width: 'auto', display: 'block', margin: '0 auto 16px' }} />
            <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: S.n500 }}>Sign in to access your reports</p>
          </div>

          {/* Card */}
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.06)', padding: 28 }}>

            {error && (
              <div style={{ marginBottom: 18, padding: '12px 14px', background: S.redBg, border: `1px solid ${S.redBorder}`, borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: S.red }}>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" style={inputStyle}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <Link href="/auth/forgot-password" style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>Forgot password?</Link>
                </div>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                  background: loading ? S.n200 : S.brand,
                  color: loading ? S.n400 : S.white,
                  fontWeight: 700, fontSize: 15, marginTop: 4,
                  boxShadow: loading ? 'none' : '0 2px 8px rgba(15,118,110,0.25)',
                  transition: 'all 0.15s',
                }}
              >
                {loading ? 'Signing in...' : 'Sign in →'}
              </button>
            </div>

            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${S.n100}`, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: S.n500 }}>
                No account?{' '}
                <Link href="/auth/signup" style={{ color: S.brand, fontWeight: 700 }}>Sign up free</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
