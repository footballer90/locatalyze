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
 amber: '#D97706', amberBg: '#FFFBEB',
}

type Plan = 'pro' | 'business' | 'annual'

const PLANS = [
 {
    id: 'pro' as Plan,
  name: 'Pro',
  price: '$59',
  period: '/month',
  sub: 'Cancel anytime · no lock-in',
  reports: '20 reports / month',
  perReport: '≈ $2.95 per report',
  badge: null,
    dark: false,
    features: ['20 location reports/month', 'Location comparison tool', 'PDF export', 'Report email delivery', 'Priority support'],
  cta: 'Start Pro — $59/mo',
 },
  {
    id: 'annual' as Plan,
  name: 'Annual',
  price: '$490',
  period: '/year',
  sub: 'Save $218 vs monthly',
  reports: '240 reports / year',
  perReport: '≈ $2.04 per report',
  badge: ' MOST POPULAR',
  dark: true,
    features: ['240 location reports/year', 'Location comparison tool', 'PDF export', 'Report email delivery', 'Priority support'],
  cta: 'Get Annual — $490/yr',
 },
  {
    id: 'business' as Plan,
  name: 'Business',
  price: '$119',
  period: '/month',
  sub: 'For agencies & franchisees',
  reports: '60 reports / month',
  perReport: '≈ $1.98 per report',
  badge: null,
    dark: false,
    features: ['60 location reports/month', 'Location comparison tool', 'PDF export', 'Report email delivery', 'Priority support', 'Team sharing — coming soon', 'API access — coming soon'],
  cta: 'Start Business — $119/mo',
 },
]

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<Plan | null>(null)
  const [error, setError] = useState('')

 async function checkout(plan: Plan) {
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
        window.location.href = data.url
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

   <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
     <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
    </button>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', fontSize: 13, color: S.n500, cursor: 'pointer', fontFamily: S.font }}>
     ← Back to dashboard
        </button>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px' }}>

    <div style={{ textAlign: 'center', marginBottom: 16, maxWidth: 580 }}>
     <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 20 }}>
       Upgrade to Pro
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
      More reports. Better decisions.
          </h1>
          <p style={{ fontSize: 16, color: S.n500, lineHeight: 1.75 }}>
            You've used your 3 free reports. Upgrade for more analyses, PDF export, side-by-side location comparison, and report email delivery.
     </p>
        </div>

        <div style={{ background: S.amberBg, border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 20px', marginBottom: 40, fontSize: 13, color: '#92400E', fontWeight: 600, textAlign: 'center' }}>
     Opening a location can cost $150,000+. A Locatalyze report costs less than dinner.
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 20px', marginBottom: 24, fontSize: 14, color: '#DC2626' }}>
      {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, width: '100%', maxWidth: 900 }}>
     {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.dark ? 'linear-gradient(145deg,#0F766E 0%,#0891B2 100%)' : S.white,
       border: plan.dark ? 'none' : `1.5px solid ${S.n200}`,
       borderRadius: 24, padding: '36px 28px 32px',
       boxShadow: plan.dark ? '0 8px 32px rgba(15,118,110,0.25)' : '0 4px 16px rgba(0,0,0,0.05)',
       position: 'relative', marginTop: plan.badge ? 14 : 0,
      }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: S.amber, color: S.white, borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
         {plan.badge}
                </div>
              )}
              <p style={{ fontSize: 12, fontWeight: 700, color: plan.dark ? 'rgba(255,255,255,0.5)' : S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{plan.name}</p>
       <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 44, fontWeight: 900, color: plan.dark ? S.white : S.n900, letterSpacing: '-0.03em' }}>{plan.price}</span>
        <span style={{ fontSize: 15, color: plan.dark ? 'rgba(255,255,255,0.5)' : S.n400 }}>{plan.period}</span>
       </div>
              <p style={{ fontSize: 12, color: plan.dark ? 'rgba(255,255,255,0.7)' : S.emerald, fontWeight: 600, marginBottom: 4 }}>{plan.reports}</p>
       <p style={{ fontSize: 11, color: plan.dark ? 'rgba(255,255,255,0.4)' : S.n400, marginBottom: 4 }}>{plan.perReport}</p>
       <p style={{ fontSize: 12, color: plan.dark ? 'rgba(255,255,255,0.45)' : S.n400, marginBottom: 24 }}>{plan.sub}</p>
       {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
         <div style={{ width: 17, height: 17, borderRadius: '50%', background: plan.dark ? 'rgba(255,255,255,0.15)' : S.emeraldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: plan.dark ? S.white : S.emerald, fontWeight: 900 }}></span>
                  </div>
                  <span style={{ fontSize: 13, color: plan.dark ? 'rgba(255,255,255,0.85)' : S.n700 }}>{f}</span>
        </div>
              ))}
              <button onClick={() => checkout(plan.id)} disabled={loading !== null} style={{
                marginTop: 24, width: '100%', padding: '14px',
        background: plan.dark ? (loading === plan.id ? 'rgba(255,255,255,0.5)' : S.white) : (loading === plan.id ? S.n100 : S.white),
        color: S.brand, border: plan.dark ? 'none' : `2px solid ${S.brand}`,
        borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: loading !== null ? 'not-allowed' : 'pointer', fontFamily: S.font,
        boxShadow: plan.dark ? '0 2px 12px rgba(0,0,0,0.1)' : 'none',
       }}>
                {loading === plan.id ? 'Redirecting to Stripe…' : plan.cta}
       </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 12, padding: '12px 24px', fontSize: 13, color: S.brand, fontWeight: 600, textAlign: 'center' }}>
     Annual saves $218 vs monthly · $59 × 12 = $708 · Annual = $490
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
     {[' Secure checkout via Stripe', ' Instant access after payment', ' All major cards accepted', '↩ Cancel monthly anytime'].map(b => (
      <span key={b} style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>{b}</span>
          ))}
        </div>

        <div style={{ marginTop: 52, width: '100%', maxWidth: 560 }}>
     <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 20, textAlign: 'center' }}>Common questions</h3>
     {[
            { q: 'What happens to my 3 free reports?', a: 'They stay in your dashboard permanently. Upgrading adds your new monthly or annual report allowance on top.' },
      { q: 'Can I cancel my monthly plan?', a: 'Yes, any time from your Profile page. You keep access until the end of your current billing period. No cancellation fees.' },
      { q: 'What is the difference between Pro and Business?', a: 'Pro gives 20 reports/month — right for individual founders and operators. Business gives 60 reports/month and is designed for commercial agents, franchise groups, and agencies evaluating multiple sites. Team sharing and API access are on the Business roadmap.' },
      { q: 'Why is annual the best value?', a: 'Annual costs $490 vs $708 for 12 months of Pro monthly — a saving of $218. It also locks in your pricing if Pro rates increase.' },
      { q: 'What payment methods are accepted?', a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay where supported by your browser.' },
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
