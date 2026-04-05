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

type Plan = 'single' | 'pack3' | 'pack10' | 'pro' | 'business' | 'annual'

const REPORT_PACKS = [
  {
    id: 'single' as Plan,
    name: 'Single Report',
    price: '$29',
    perReport: '$29 per report',
    badge: null,
    primary: true,
    features: ['Full financial model (revenue, costs, profit)', 'Break-even analysis (customers/day required)', 'Revenue & profit projections', 'Competitive positioning & SWOT', 'Downloadable PDF report', 'Location comparison'],
    cta: 'Unlock full report — $29',
    sub: 'One-time payment · instant access',
  },
  {
    id: 'pack3' as Plan,
    name: '3 Report Pack',
    price: '$59',
    perReport: '$19.67 per report — save 32%',
    badge: 'BEST VALUE',
    primary: false,
    features: ['Everything in Single Report', '3 full location reports', 'Compare all 3 side by side', 'Ideal for shortlisting sites'],
    cta: 'Get 3 reports — $59',
    sub: 'One-time payment · use anytime',
  },
  {
    id: 'pack10' as Plan,
    name: '10 Report Pack',
    price: '$149',
    perReport: '$14.90 per report — save 49%',
    badge: null,
    primary: false,
    features: ['Everything in Single Report', '10 full location reports', 'Compare all locations', 'For multi-site operators & agents'],
    cta: 'Get 10 reports — $149',
    sub: 'One-time payment · use anytime',
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<Plan | null>(null)
  const [error, setError] = useState('')
  const [showSubs, setShowSubs] = useState(false)

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
          <h1 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
            Avoid a $200k+ lease mistake.
          </h1>
          <p style={{ fontSize: 16, color: S.n500, lineHeight: 1.75 }}>
            Get a second opinion on any location before you commit. Full financial model, competitive analysis, and a clear verdict in about 90 seconds.
          </p>
        </div>

        <div style={{ background: S.amberBg, border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 20px', marginBottom: 40, fontSize: 13, color: '#92400E', fontWeight: 600, textAlign: 'center' }}>
          The average failed lease costs $150,000–$250,000. A full Locatalyze report costs less than dinner.
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 20px', marginBottom: 24, fontSize: 14, color: '#DC2626' }}>
            {error}
          </div>
        )}

        {/* ── Free vs Paid comparison ────────────────────────────────────────── */}
        <div style={{ width: '100%', maxWidth: 900, marginBottom: 32, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 20, padding: '22px 28px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 14 }}>What you already have vs what you unlock</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <div style={{ paddingRight: 24, borderRight: `1px solid ${S.n200}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: S.n500, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 10 }}>Free (you have this)</p>
              {['GO / CAUTION / NO verdict','Competitor map (500m radius)','Basic suburb insights'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 8, color: S.emerald, fontWeight: 900 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 13, color: S.n700 }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ paddingLeft: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 10 }}>Paid — unlock from $29</p>
              {['Full financial model','Revenue projections','Break-even analysis','SWOT & AI insights','PDF export'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F0FDFA', border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 8, color: S.brand, fontWeight: 900 }}>+</span>
                  </div>
                  <span style={{ fontSize: 13, color: S.n700 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Report packs (primary) ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, width: '100%', maxWidth: 900 }}>
          {REPORT_PACKS.map(pack => (
            <div key={pack.id} style={{
              background: pack.primary ? 'linear-gradient(145deg,#0F766E 0%,#0891B2 100%)' : S.white,
              border: pack.primary ? 'none' : `1.5px solid ${S.n200}`,
              borderRadius: 24, padding: '36px 28px 32px',
              boxShadow: pack.primary ? '0 8px 32px rgba(15,118,110,0.25)' : '0 4px 16px rgba(0,0,0,0.05)',
              position: 'relative', marginTop: pack.badge ? 14 : 0,
            }}>
              {pack.badge && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: S.amber, color: S.white, borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {pack.badge}
                </div>
              )}
              <p style={{ fontSize: 12, fontWeight: 700, color: pack.primary ? 'rgba(255,255,255,0.5)' : S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{pack.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: pack.primary ? S.white : S.n900, letterSpacing: '-0.03em' }}>{pack.price}</span>
              </div>
              <p style={{ fontSize: 12, color: pack.primary ? 'rgba(255,255,255,0.7)' : S.emerald, fontWeight: 600, marginBottom: 4 }}>{pack.perReport}</p>
              <p style={{ fontSize: 12, color: pack.primary ? 'rgba(255,255,255,0.45)' : S.n400, marginBottom: 24 }}>{pack.sub}</p>
              {pack.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <div style={{ width: 17, height: 17, borderRadius: '50%', background: pack.primary ? 'rgba(255,255,255,0.15)' : S.emeraldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: pack.primary ? S.white : S.emerald, fontWeight: 900 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 13, color: pack.primary ? 'rgba(255,255,255,0.85)' : S.n700 }}>{f}</span>
                </div>
              ))}
              <button onClick={() => checkout(pack.id)} disabled={loading !== null} style={{
                marginTop: 24, width: '100%', padding: '14px',
                background: pack.primary ? (loading === pack.id ? 'rgba(255,255,255,0.5)' : S.white) : (loading === pack.id ? S.n100 : S.white),
                color: S.brand, border: pack.primary ? 'none' : `2px solid ${S.brand}`,
                borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: loading !== null ? 'not-allowed' : 'pointer', fontFamily: S.font,
                boxShadow: pack.primary ? '0 2px 12px rgba(0,0,0,0.1)' : 'none',
              }}>
                {loading === pack.id ? 'Redirecting to Stripe…' : pack.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ── What you get ─────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 48, width: '100%', maxWidth: 700 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 6, textAlign: 'center' }}>What you get when you unlock</h3>
          <p style={{ fontSize: 13, color: S.n400, textAlign: 'center', marginBottom: 24 }}>Every paid report includes all of the following</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { title: 'Full Financial Model', desc: 'Revenue, costs, profit projections with staffing and opex built in' },
              { title: 'Break-even Analysis', desc: 'Exactly how many customers/day you need and how many months to payback' },
              { title: '3-Year Projections', desc: 'Worst, base, and optimistic scenarios with sensitivity analysis' },
              { title: 'Competitive Positioning', desc: 'Competitor strength scoring, market gaps, and SWOT analysis' },
              { title: 'PDF Export', desc: 'Professionally formatted report you can share with partners and banks' },
              { title: 'Location Comparison', desc: 'Compare up to 3 locations side by side with a recommendation' },
            ].map(item => (
              <div key={item.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '18px 16px' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: S.brand, fontWeight: 900 }}>✓</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800, marginBottom: 4 }}>{item.title}</p>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Subscription (tertiary, collapsed — for agents/brokers/franchises only) ─ */}
        <div style={{ marginTop: 48, width: '100%', maxWidth: 700 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Not for most users</p>
          </div>
          <button
            onClick={() => setShowSubs(!showSubs)}
            style={{
              width: '100%', background: S.white, border: `1px solid ${S.n200}`,
              borderRadius: 12, padding: '14px 20px', cursor: 'pointer', fontFamily: S.font,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Commercial agent, broker, or franchise operator?</p>
              <p style={{ fontSize: 12, color: S.n400 }}>Monthly subscriptions for professionals running 15+ reports/month</p>
            </div>
            <span style={{ fontSize: 14, color: S.n400, transform: showSubs ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>

          {showSubs && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              {[
                { id: 'pro' as Plan, name: 'Pro', price: '$149', period: '/month', reports: 'Unlimited reports', perReport: 'Best for active researchers', cta: 'Start Pro' },
                { id: 'business' as Plan, name: 'Business', price: '$199', period: '/month', reports: 'Unlimited + team access', perReport: 'For agencies & franchises', cta: 'Start Business' },
              ].map(sub => (
                <div key={sub.id} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 20px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{sub.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: S.n900 }}>{sub.price}</span>
                    <span style={{ fontSize: 13, color: S.n400 }}>{sub.period}</span>
                  </div>
                  <p style={{ fontSize: 12, color: S.emerald, fontWeight: 600, marginBottom: 2 }}>{sub.reports}</p>
                  <p style={{ fontSize: 11, color: S.n400, marginBottom: 16 }}>{sub.perReport} · Cancel anytime</p>
                  <button onClick={() => checkout(sub.id)} disabled={loading !== null} style={{
                    width: '100%', padding: '10px', background: S.white, color: S.brand,
                    border: `1.5px solid ${S.brand}`, borderRadius: 10, fontSize: 13, fontWeight: 700,
                    cursor: loading !== null ? 'not-allowed' : 'pointer', fontFamily: S.font,
                  }}>
                    {loading === sub.id ? 'Redirecting…' : sub.cta}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Secure checkout via Stripe', 'Instant access after payment', 'All major cards accepted'].map(b => (
            <span key={b} style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>{b}</span>
          ))}
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 52, width: '100%', maxWidth: 560 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 20, textAlign: 'center' }}>Common questions</h3>
          {[
            { q: 'What does the free report include?', a: 'Your first report shows the GO / CAUTION / NO verdict, a basic competitor map with count, and your top-level location score. The full financial model, break-even analysis, and PDF are available when you unlock.' },
            { q: 'Do report credits expire?', a: 'No. If you buy the 3 or 10 pack, your credits stay in your account until you use them. No rush.' },
            { q: 'Can I unlock just one report?', a: 'Yes. The $29 single report is the simplest way to get the full analysis for a specific location you\'re evaluating.' },
            { q: 'What if the report isn\'t useful?', a: 'We offer a 7-day refund window if no paid reports have been generated. Once a full report is generated, it\'s non-refundable — but the data is yours to keep.' },
            { q: 'What payment methods are accepted?', a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay where supported by your browser.' },
            { q: 'Who needs a subscription?', a: 'Almost nobody. Subscriptions are built for commercial agents, business brokers, and franchise operators who run 15+ reports a month for clients. If you\'re evaluating a location for your own business, the single report ($29) or 3-pack ($59) will cover you — no subscription needed.' },
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
