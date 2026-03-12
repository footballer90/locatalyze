'use client'
import { useState } from 'react'
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
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706',
}

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<'monthly' | 'lifetime' | null>(null)
  const [error, setError] = useState('')

  async function checkout(plan: 'monthly' | 'lifetime') {
    setLoading(plan)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url   // redirect to Stripe hosted checkout
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(null)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900, display: 'flex', flexDirection: 'column' }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </button>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', fontSize: 13, color: S.n500, cursor: 'pointer', fontFamily: S.font }}>
          ← Back to dashboard
        </button>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52, maxWidth: 540 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 20 }}>
            ⚡ Upgrade to Pro
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
            Unlimited location analysis
          </h1>
          <p style={{ fontSize: 16, color: S.n500, lineHeight: 1.75 }}>
            You've used your 3 free reports. Upgrade for unlimited analyses, PDF export, and the location comparison tool.
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 20px', marginBottom: 24, fontSize: 14, color: '#DC2626' }}>
            {error}
          </div>
        )}

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 680 }}>

          {/* Monthly */}
          <div style={{ background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 24, padding: '32px 28px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Pro Monthly</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>$19</span>
              <span style={{ fontSize: 15, color: S.n400 }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: S.n400, marginBottom: 28 }}>Cancel anytime, no lock-in</p>
            {['Unlimited reports', 'Location comparison tool', 'PDF export', 'Priority support', 'All future features'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: S.emerald, fontWeight: 900 }}>✓</span>
                </div>
                <span style={{ fontSize: 14, color: S.n700 }}>{f}</span>
              </div>
            ))}
            <button
              onClick={() => checkout('monthly')}
              disabled={loading !== null}
              style={{
                marginTop: 28, width: '100%', padding: '14px', background: loading === 'monthly' ? S.n100 : S.white,
                color: loading === 'monthly' ? S.n400 : S.brand, border: `2px solid ${S.brand}`,
                borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading !== null ? 'not-allowed' : 'pointer',
                fontFamily: S.font, transition: 'all 0.15s',
              }}
            >
              {loading === 'monthly' ? 'Redirecting to Stripe…' : 'Start monthly — $19/mo'}
            </button>
          </div>

          {/* Founder Annual */}
          <div style={{ background: `linear-gradient(145deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 24, padding: '32px 28px', boxShadow: '0 8px 32px rgba(15,118,110,0.25)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: S.amber, color: S.white, borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(217,119,6,0.3)' }}>
              SAVE 35% — ANNUAL
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Pro Annual</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>\
              <span style={{ fontSize: 44, fontWeight: 900, color: S.white, letterSpacing: '-0.03em' }}>$149</span>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>/year</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Equivalent to $12.40/mo — billed annually</p>
            {['Everything in Monthly', 'Save $79 vs monthly billing', 'Priority support', 'Location comparison tool', 'First access to new features'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: S.white, fontWeight: 900 }}>✓</span>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
              </div>
            ))}
            <button
              onClick={() => checkout('lifetime')}
              disabled={loading !== null}
              style={{
                marginTop: 28, width: '100%', padding: '14px', background: loading === 'lifetime' ? 'rgba(255,255,255,0.5)' : S.white,
                color: S.brand, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
                cursor: loading !== null ? 'not-allowed' : 'pointer', fontFamily: S.font, transition: 'all 0.15s',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              }}
            >
              {loading === 'lifetime' ? 'Redirecting to Stripe…' : 'Get annual access — $149/yr'}
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: 36, display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Secure checkout via Stripe', 'Instant access after payment', 'All major cards accepted', 'Cancel anytime'].map(b => (
            <span key={b} style={{ fontSize: 13, color: S.n500, fontWeight: 500 }}>{b}</span>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 52, width: '100%', maxWidth: 540 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 20, textAlign: 'center' }}>Common questions</h3>
          {[
            { q: 'What happens to my free reports?', a: 'They stay. Upgrading gives you unlimited reports on top of your existing 3.' },
            { q: 'Can I cancel monthly or annual?', a: 'Monthly: cancel any time, access until end of billing period. Annual: cancel before renewal to avoid next charge.' },
            { q: 'What is included in annual vs monthly?', a: 'Annual includes everything in Monthly plus priority support and the location comparison tool, at a 35% saving.' },
            { q: 'What payment methods are accepted?', a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay where available.' },
          ].map(item => (
            <div key={item.q} style={{ borderBottom: `1px solid ${S.n100}`, padding: '16px 0' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 6 }}>{item.q}</p>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}