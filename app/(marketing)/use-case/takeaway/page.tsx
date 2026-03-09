'use client'
import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

export default function Page() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <span style={{ fontSize: 52, display: 'block', marginBottom: 12 }}>🥡</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#14B8A6', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>Location analysis for takeaway businesses</div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,36px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', marginBottom: 12 }}>Takeaway</h1>
          <p style={{ fontSize: 15, color: '#9CA3AF', maxWidth: 520, margin: '0 auto' }}>Takeaway is one of the most location-sensitive businesses in food. Foot traffic, residential density and delivery zone quality all drive viability.</p>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px 80px' }}>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: S.n900, marginBottom: 20 }}>Key location factors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))', gap: 16 }}>
              {[
                { icon: '👥', title: 'Lunchtime foot traffic', desc: 'Takeaway peaks at lunch and dinner. Office workers within 500m are the core lunch customer.' },
                { icon: '📊', title: 'Delivery platform reach', desc: 'UberEats, DoorDash and Menulog extend your catchment to 3–5km. A lower foot-traffic site can be offset by strong delivery demand.' },
                { icon: '💰', title: 'Rider access', desc: 'Easy access for delivery riders matters. Side streets with easy pull-in are better than busy main roads with no stopping.' },
                { icon: '📍', title: 'Category competition', desc: 'Identify whether your cuisine category is underserved. An oversaturated category in a good location is still a problem.' },
              ].map(f => (
                <div key={f.title} style={{ background: S.white, border: '1px solid #E7E5E4', borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: S.brandFaded, border: '1px solid #99F6E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>{f.title}</p>
                      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20, marginBottom: 48 }}>
            <div style={{ background: S.emeraldBg, border: '1px solid #A7F3D0', borderRadius: 14, padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.emerald, marginBottom: 14 }}>✅ What to look for</h3>
              {['Office workers within 500m for lunch trade','High-density residential within 2km for delivery','Delivery rider access and parking','Underserved cuisine category in the area'].map((item,i) => (
                <p key={i} style={{ fontSize: 13, color: '#065F46', lineHeight: 1.65, marginBottom: 6 }}>· {item}</p>
              ))}
            </div>
            <div style={{ background: S.redBg, border: '1px solid #FECACA', borderRadius: 14, padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 14 }}>🚩 Red flags</h3>
              {['No offices and low residential density','Category dominated by 3+ operators within 500m','Difficult rider access or no loading zone','Suburb with low app-based ordering behaviour'].map((item,i) => (
                <p key={i} style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.65, marginBottom: 6 }}>· {item}</p>
              ))}
            </div>
          </div>

          <div style={{ background: S.amberBg, border: '1px solid #FDE68A', borderRadius: 14, padding: '24px', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.amber, marginBottom: 8 }}>💡 Check your delivery zone first</p>
            <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.75 }}>Before signing, map your 3km delivery radius on UberEats. Count residential density. Under 3,000 households within 3km means delivery revenue alone will not sustain you.</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg,#0F766E,#0891B2)', borderRadius: 20, padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>Analyse your location now</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>Paste any Australian address and get a full feasibility report in 30 seconds. Free to start — no credit card.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#0F766E', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Run my free analysis →
              </Link>
              <Link href="/analyse" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Browse other business types
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}