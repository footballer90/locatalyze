'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

const S = {
 font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
 brand:       '#0F766E',
 brandLight:  '#14B8A6',
 n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
 n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 headerBg: '#111827',
}

export default function ResetPasswordPage() {
 const router = useRouter()
  const [password, setPassword]   = useState('')
 const [confirm, setConfirm]     = useState('')
 const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [showPw, setShowPw]       = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession()
  }, [])

  async function handleReset() {
    if (!password) { setError('Please enter a new password.'); return }
  if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
  if (password !== confirm) { setError('Passwords do not match.'); return }
  setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
 }

  return (
    <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: S.font, padding: 24 }}>
   <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

   <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
    <Logo variant="dark" size="md" />
   </div>

      <div style={{ width: '100%', maxWidth: 400, background: S.white, borderRadius: 16, padding: '36px 32px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'fadeIn 0.3s ease' }}>
    {done ? (
          <div style={{ textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: S.emeraldBg, border: `2px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22 }}></div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Password updated</h1>
            <p style={{ fontSize: 13, color: S.n500 }}>Redirecting you to your dashboard…</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Set new password</h1>
       <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.6 }}>Choose a strong password for your account.</p>
            </div>

            {error && (
              <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: S.red }}>
        {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New password</label>
       <div style={{ position: 'relative' }}>
        <input
                  type={showPw ? 'text' : 'password'}
         value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
         style={{ width: '100%', padding: '11px 40px 11px 14px', fontSize: 14, fontFamily: S.font, border: `1.5px solid ${S.n200}`, borderRadius: 10, outline: 'none', color: S.n900 }}
         onFocus={e => e.target.style.borderColor = S.brand}
                  onBlur={e => e.target.style.borderColor = S.n200}
                />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: S.n400 }}>
         {showPw ? '' : ''}
        </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm password</label>
       <input
                type={showPw ? 'text' : 'password'}
        value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
        placeholder="Repeat your password"
        style={{ width: '100%', padding: '11px 14px', fontSize: 14, fontFamily: S.font, border: `1.5px solid ${confirm && confirm !== password ? S.red : S.n200}`, borderRadius: 10, outline: 'none', color: S.n900 }}
        onFocus={e => e.target.style.borderColor = S.brand}
                onBlur={e => e.target.style.borderColor = confirm && confirm !== password ? S.red : S.n200}
              />
              {confirm && confirm !== password && (
                <p style={{ fontSize: 11, color: S.red, marginTop: 4 }}>Passwords don't match</p>
       )}
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? S.brandLight : S.brand, color: S.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: S.font, boxShadow: '0 2px 8px rgba(15,118,110,0.25)' }}
      >
              {loading ? 'Updating…' : 'Update password'}
      </button>
          </>
        )}
      </div>
    </div>
  )
}