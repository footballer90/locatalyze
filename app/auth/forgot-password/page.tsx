'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand:       '#0F766E',
  brandLight:  '#14B8A6',
  brandFaded:  '#F0FDFA',
  brandBorder: '#99F6E4',
  n50:  '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
  n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  headerBg: '#111827',
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit() {
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: S.font, padding: 24 }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Logo */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 900, fontSize: 16 }}>L</div>
        <span style={{ fontWeight: 800, fontSize: 18, color: S.white, letterSpacing: '-0.03em' }}>Locatalyze</span>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400, background: S.white, borderRadius: 16, padding: '36px 32px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'fadeIn 0.3s ease' }}>

        {sent ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22 }}>✉️</div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 10 }}>Check your email</h1>
            <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7, marginBottom: 24 }}>
              We sent a password reset link to <strong style={{ color: S.n800 }}>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <p style={{ fontSize: 12, color: S.n400, marginBottom: 20 }}>Didn't receive it? Check your spam folder or try again.</p>
            <button
              onClick={() => setSent(false)}
              style={{ background: 'none', border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, color: S.n700, cursor: 'pointer', fontFamily: S.font, width: '100%' }}
            >
              Try a different email
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              style={{ background: S.brand, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, color: S.white, cursor: 'pointer', fontFamily: S.font, width: '100%', marginTop: 10 }}
            >
              Back to sign in
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Reset your password</h1>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.6 }}>Enter the email address you signed up with and we'll send you a reset link.</p>
            </div>

            {error && (
              <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: S.red }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="you@example.com"
                autoFocus
                style={{
                  width: '100%', padding: '11px 14px', fontSize: 14, fontFamily: S.font,
                  border: `1.5px solid ${S.n200}`, borderRadius: 10, outline: 'none',
                  color: S.n900, background: S.white,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = S.brand}
                onBlur={e => e.target.style.borderColor = S.n200}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '12px', background: loading ? S.brandLight : S.brand,
                color: S.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: S.font,
                boxShadow: '0 2px 8px rgba(15,118,110,0.25)', transition: 'all 0.15s',
              }}
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={() => router.push('/auth/login')} style={{ background: 'none', border: 'none', fontSize: 13, color: S.n500, cursor: 'pointer', fontFamily: S.font }}>
                ← Back to sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}