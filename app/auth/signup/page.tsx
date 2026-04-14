'use client'
import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Turnstile } from '@marsidev/react-turnstile'
import posthog from 'posthog-js'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
 n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
 white: '#FFFFFF', red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
 amber: '#92400E', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBorder: '#A7F3D0',
}

function SignUpInner() {
 const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  const [email, setEmail]         = useState('')
 const [password, setPassword]   = useState('')
 const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'error' | 'existing' | null>(null)
 const [done, setDone]           = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<import('@marsidev/react-turnstile').TurnstileInstance>(null)

 const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

 async function handleSubmit() {
    if (!email || !password) { setError('Please enter your email and password'); setErrorType('error'); return }
  if (password.length < 8)  { setError('Password must be at least 8 characters'); setErrorType('error'); return }

  // Only enforce CAPTCHA if site key is configured
    if (siteKey && !captchaToken) {
      setError('Please complete the security check below'); setErrorType('error'); return
  }

    setLoading(true); setError(null); setErrorType(null)

    // Verify CAPTCHA server-side before creating account
    if (siteKey && captchaToken) {
      try {
        const verifyRes = await fetch('/api/auth/verify-captcha', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ token: captchaToken }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.success) {
          setLoading(false)
          setError('Security check failed. Please try again.')
     setErrorType('error')
     turnstileRef.current?.reset()
          setCaptchaToken(null)
          return
        }
      } catch {
        setLoading(false)
        setError('Security verification error. Please try again.')
    setErrorType('error')
    return
      }
    }

    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectTo
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
          : `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    // Reset CAPTCHA after use
    turnstileRef.current?.reset()
    setCaptchaToken(null)

    if (err) {
      setErrorType('error')
      setError('Unable to create account. Please check your details and try again.')
      return
    }

    if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
      // Existing account — show identical message to prevent enumeration
      setErrorType('error')
      setError('Unable to create account. Please check your details and try again.')
      return
    }

    posthog.identify(data.user!.id, { email: email.trim().toLowerCase() })
    posthog.capture('user_signed_up', { email: email.trim().toLowerCase() })
    setDone(true)
  }

  const inputStyle = {
    width: '100%', background: S.n50, border: `1.5px solid ${S.n200}`,
  borderRadius: 10, padding: '12px 14px', fontSize: 15, color: S.n800,
  outline: 'none', boxSizing: 'border-box' as const,
  fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  transition: 'border-color 0.15s',
 }
  const labelStyle = {
    fontSize: 11, fontWeight: 700 as const, color: S.n700,
    display: 'block' as const, marginBottom: 7,
  textTransform: 'uppercase' as const, letterSpacing: '0.05em',
 }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", display: 'flex', flexDirection: 'column' }}>
   <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} button{font-family:inherit;cursor:pointer;} input{font-family:inherit;} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

   {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center' }}>
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
     <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
    </Link>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
    <div style={{ width: '100%', maxWidth: 420 }}>

     {done ? (
            <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.06)', padding: 32, textAlign: 'center' }}>
       <div style={{ width: 56, height: 56, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}></div>
       <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 10 }}>Check your email</h2>
       <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.65, marginBottom: 24 }}>
                We sent a confirmation link to <strong style={{ color: S.n800 }}>{email}</strong>.<br />
                Click the link to activate your account.
              </p>
              <p style={{ fontSize: 12, color: S.n400 }}>Didn't get it? Check your spam folder.</p>
      </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <img src="/logo.svg" alt="Locatalyze" style={{ height: 40, width: 'auto', display: 'block', margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 6 }}>Start for free</h1>
        <p style={{ fontSize: 14, color: S.n500 }}>Analyse your first location in about 90 seconds</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        {[' Real competitor data', ' Break-even calculator', ' GO / CAUTION / NO score'].map(b => (
         <span key={b} style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>{b}</span>
                ))}
              </div>

              <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.06)', padding: 28 }}>

        {error && errorType === 'error' && (
         <div style={{ marginBottom: 18, padding: '12px 14px', background: S.redBg, border: `1px solid ${S.redBorder}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: S.red }}>{error}</p>
                  </div>
                )}

                {error && errorType === 'existing' && (
         <div style={{ marginBottom: 18, padding: '14px 16px', background: S.amberBg, border: `1px solid ${S.amberBorder}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: S.amber, fontWeight: 600, marginBottom: 6 }}>You already have an account</p>
                    <p style={{ fontSize: 13, color: S.amber, marginBottom: 10 }}>
                      <strong>{email}</strong> is already registered with Locatalyze.
                    </p>
                    <Link
                      href={`/auth/login?email=${encodeURIComponent(email)}${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
                      style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, borderRadius: 8, padding: '8px 16px', textDecoration: 'none' }}
          >
                      Sign in instead →
                    </Link>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
         <div>
                    <label style={labelStyle}>Email address</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
           placeholder="your@email.com" style={inputStyle}
           onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
                  </div>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
           placeholder="At least 6 characters" style={inputStyle}
           onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
                  </div>

                  {/* Cloudflare Turnstile — only renders when site key is set */}
                  {siteKey && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
           <Turnstile
                        ref={turnstileRef}
                        siteKey={siteKey}
                        onSuccess={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken(null)}
                        onError={() => { setCaptchaToken(null); setError('Security check failed. Please refresh and try again.'); setErrorType('error') }}
            options={{ theme: 'light', size: 'normal' }}
           />
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || (!!siteKey && !captchaToken)}
                    style={{
                      width: '100%', padding: '13px', borderRadius: 10, border: 'none',
           background: (loading || (!!siteKey && !captchaToken)) ? S.n200 : S.brand,
                      color: (loading || (!!siteKey && !captchaToken)) ? S.n400 : S.white,
                      fontWeight: 700, fontSize: 15, marginTop: 4,
                      boxShadow: (loading || (!!siteKey && !captchaToken)) ? 'none' : '0 2px 8px rgba(15,118,110,0.25)',
           transition: 'all 0.15s',
           cursor: (loading || (!!siteKey && !captchaToken)) ? 'not-allowed' : 'pointer',
          }}
                  >
                    {loading ? 'Creating account...' : 'Create free account →'}
         </button>
                </div>

                <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${S.n100}`, textAlign: 'center' }}>
         <p style={{ fontSize: 13, color: S.n500 }}>
                    Already have an account?{' '}
          <Link href={`/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`} style={{ color: S.brand, fontWeight: 700 }}>Sign in</Link>
         </p>
                </div>
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: S.n400, marginTop: 16 }}>
        No credit card required · First report free, no card needed
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpInner />
    </Suspense>
  )
}