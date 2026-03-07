'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
  n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF', red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBorder: '#A7F3D0',
}

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit() {
    if (!email || !password) { setError('Please enter your email and password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (err) { setError(err.message); return }

    // ── Send welcome email (fire and forget) ──
    fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'welcome', to: email.trim().toLowerCase() }),
    }).catch(() => {})

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
          <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </Link>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {done ? (
            /* Success state */
            <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.06)', padding: 32, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✓</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 10 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.65, marginBottom: 24 }}>
                We sent a confirmation link to <strong style={{ color: S.n800 }}>{email}</strong>.<br />
                Click the link to activate your account.
              </p>
              <p style={{ fontSize: 12, color: S.n400 }}>Didn't get it? Check your spam folder.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 20, margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(15,118,110,0.25)' }}>L</div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 6 }}>Start for free</h1>
                <p style={{ fontSize: 14, color: S.n500 }}>Analyse your first location in under 60 seconds</p>
              </div>

              {/* Benefits */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
                {['📍 Real competitor data', '📊 Break-even calculator', '🎯 GO / CAUTION / NO score'].map(b => (
                  <span key={b} style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>{b}</span>
                ))}
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
                    <label style={labelStyle}>Password</label>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters" style={inputStyle}
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
                    {loading ? 'Creating account...' : 'Create free account →'}
                  </button>
                </div>

                <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${S.n100}`, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: S.n500 }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: S.brand, fontWeight: 700 }}>Sign in</Link>
                  </p>
                </div>
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: S.n400, marginTop: 16 }}>
                No credit card required · Free plan includes 3 full reports
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}