'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState } from 'react'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C', n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA', headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}
export default function Page() {
  const [poll, setPoll] = useState<string | null>(null)
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
        <div style={{ background: S.headerBg, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${S.brand}25,transparent 70%)` }} />
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px 56px', position: 'relative' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'inline-flex', background: 'rgba(15,118,110,0.18)', border: '1px solid rgba(15,118,110,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>👗 Use Case Guide</div>
                <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>How to Choose the Best Location for a Retail Store</h1>
                <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>In retail, location is the product. The best inventory cannot save a store on the wrong street. But the right location — with strong foot traffic, aligned demographics and manageable rent — can sustain even an average range.</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.35)' }}>Analyse my location free →</Link>
                  <a href="#checklist" style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.07)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Jump to checklist ↓</a>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '24px', minWidth: 240 }}>
                {[['55%', 'of retail failures attributed to poor location or rent'], ['1,000+', 'pedestrians/hour needed for viable retail strip'], ['15%', 'max healthy rent-to-revenue ratio for retail'], ['500m', 'radius where competitors directly compete for same traffic']].map(([v, l]) => (
                  <div key={v} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 26, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 20px 80px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 56, position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85" alt="Retail store" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(12,31,28,0.7),transparent)' }} />
            <div style={{ position: 'absolute', bottom: 28, left: 32 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>The right retail strip sees 1,000+ pedestrians per hour. Every 100 people per hour is worth roughly 1–2 additional transactions.</p>
            </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Why retail is the most location-sensitive business</p>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Foot traffic is your product. Choose accordingly.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(440px,1fr))', gap: 20 }}>
              <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>Retail is a volume game. Unlike a gym or specialist service, most retail businesses cannot easily market their way to customers — they depend on people already walking past making an impulse decision to enter. That dependency on foot traffic means location is not just important in retail. It is essentially the business model.</p>
              <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>The data is clear: over 55% of retail failures cite location or rent as a contributing factor. The most common pattern is an operator who chose a premises based on aesthetics or rental appeal, without counting the actual foot traffic or verifying whether the demographics matched their price point. Both mistakes are entirely avoidable with proper pre-lease analysis.</p>
            </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>5 factors that determine retail location viability</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
              {[
                { icon: '👥', color: '#0F766E', bg: '#F0FDFA', title: 'Pedestrian foot traffic volume', body: 'Retail depends on volume. Count pedestrians on a Saturday between 11am and 1pm — peak weekend browsing time. A viable retail strip needs 500+ people per hour. Under 200 per hour is very difficult for most independent retail concepts.' },
                { icon: '🏪', color: '#1D4ED8', bg: '#EFF6FF', title: 'Anchor store proximity', body: 'Anchor tenants — Woolworths, Chemist Warehouse, major pharmacy chains — generate habitual foot traffic that benefits nearby retailers. Being within 100–200m of a strong anchor store is one of the most reliable foot traffic multipliers available to independent retail.' },
                { icon: '📊', color: '#7C3AED', bg: '#F5F3FF', title: 'Spend demographics', body: 'Median household income, age profile and household type determine whether passing traffic matches your price point. ABS Census data by suburb gives you this profile. A $120 average transaction concept does not work in a suburb with a $65K median income.' },
                { icon: '💰', color: '#B45309', bg: '#FFFBEB', title: 'Rent-to-revenue ratio', body: 'Retail can sustain slightly higher rent ratios (10–15%) than food businesses because labour costs are lower. But above 18%, the margin erosion becomes severe. Always model rent as a percentage of realistic weekly revenue — not an absolute dollar amount.' },
                { icon: '🪟', color: '#DC2626', bg: '#FEF2F2', title: 'Street vacancy rate', body: 'Walk the full retail strip. Count vacant or for-lease premises. More than 15% vacancy signals declining demand or oversupply. A healthy retail strip has low vacancy and active trading from its tenants. High vacancy often precedes a broader area decline.' },
              ].map(f => (
                <div key={f.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '22px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 56 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 24 }}>Retail market data for Australia 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {[['$380B', 'Annual Australian retail industry revenue', 'ABS 2025'], ['2.1%', 'Annual retail industry growth rate', 'IBISWorld 2025'], ['1,000+', 'Pedestrians/hour on high-performing retail strips', 'Industry benchmark'], ['10–15%', 'Healthy rent-to-revenue ratio for retail', 'Industry benchmark'], ['0.5–2%', 'Walk-in capture rate for most retail stores', 'Industry estimate'], ['500m', 'Critical competition radius for street retail', 'Pedestrian behaviour research']].map(([v, l, s]) => (
                <div key={v} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px' }}>
                  <p style={{ fontSize: 26, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5, lineHeight: 1.4 }}>{l}</p>
                  <p style={{ fontSize: 10, color: '#4B5563', marginTop: 4 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 20 }}>SWOT: How location shapes your retail outlook</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
              {[
                { label: 'Strengths', icon: '💪', c: S.emerald, bg: S.emeraldBg, bdr: S.emeraldBdr, items: ['High pedestrian volume from anchor stores nearby', 'Demographics precisely matched to price point', 'Low vacancy rate signals healthy street demand', 'Corner position with dual visibility'] },
                { label: 'Weaknesses', icon: '⚠️', c: S.amber, bg: S.amberBg, bdr: S.amberBdr, items: ['Premium locations carry premium rents', 'Online retail continues to pressure in-store volume', 'Seasonal variation in outdoor shopping strips', 'Limited differentiation if adjacent to similar retailers'] },
                { label: 'Opportunities', icon: '🚀', c: '#1D4ED8', bg: '#EFF6FF', bdr: '#BFDBFE', items: ['Suburb with high income but no quality equivalent option', 'Village strip with loyal community customer base', 'Gentrifying suburb with rising income demographics', 'Category underserved within 1km catchment'] },
                { label: 'Threats', icon: '🚨', c: S.red, bg: S.redBg, bdr: S.redBdr, items: ['Online pure-play competitor with lower price point', 'Anchor tenant closing and removing passive traffic', 'Street decline due to new development diverting foot traffic', 'Rent increase at review above sustainable level'] },
              ].map(q => (
                <div key={q.label} style={{ background: q.bg, border: `1px solid ${q.bdr}`, borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><span style={{ fontSize: 18 }}>{q.icon}</span><span style={{ fontSize: 14, fontWeight: 800, color: q.c }}>{q.label}</span></div>
                  {q.items.map((item, i) => <p key={i} style={{ fontSize: 12, color: S.n700, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${q.c}40` }}>{item}</p>)}
                </div>
              ))}
            </div>
          </div>

          <div id="checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, marginBottom: 56 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '26px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 16 }}>✅ What to look for</h3>
              {['500+ pedestrians/hour on Saturday 11am–1pm', 'Anchor store (supermarket, pharmacy) within 200m', 'Demographics matched to your price point', 'Low vacancy rate on the street (under 10%)', 'Strong window display potential and signage rights', 'Complementary retailers nearby (not direct competitors)', 'Accessible public transport within 300m'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: S.emerald, fontWeight: 800, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 16, padding: '26px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 16 }}>🚩 Red flags — walk away</h3>
              {['Under 200 pedestrians/hour at peak weekend time', 'Rent above 18% of projected weekly revenue', 'High vacancy rate on surrounding street', 'No anchor tenant or foot traffic driver within 300m', 'Demographics significantly misaligned with price point', 'Declining shopping centre with visibly falling traffic', 'Multiple direct competitors immediately adjacent'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: S.red, fontWeight: 800, flexShrink: 0 }}>✕</span>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 16 }}>What matters most to you when choosing a retail location?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Pedestrian foot traffic volume', 'Demographic match to my product', 'Rent-to-revenue ratio', 'Anchor store proximity'].map(o => (
                <button key={o} onClick={() => setPoll(o)} style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${poll === o ? S.brand : S.brandBorder}`, background: poll === o ? S.brand : S.white, color: poll === o ? '#fff' : S.n700, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: S.font, textAlign: 'left' }}>
                  {poll === o ? '✓ ' : ''}{o}
                </button>
              ))}
            </div>
            {poll && <p style={{ fontSize: 13, color: S.brand, fontWeight: 700, marginTop: 12 }}>Locatalyze analyses all four. Run a free location analysis below.</p>}
          </div>

          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 48 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 16 }}>How Locatalyze helps retail store owners</h2>
            <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24, maxWidth: 560 }}>Paste any Australian address and get foot traffic scoring, demographic analysis, competition mapping and a full financial model in 30 seconds.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 28 }}>
              {[['👥', 'Pedestrian volume scoring for peak trading windows'], ['📊', 'Demographic match to your product price point'], ['💰', 'Rent-to-revenue modelling with your numbers'], ['🏪', 'Anchor store and competitor proximity analysis'], ['✅', 'GO / CAUTION / NO verdict in 30 seconds']].map(([icon, text]) => (
                <div key={text as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px', display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.55 }}>{text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse my retail location free →
            </Link>
          </div>

          <div>
            <p style={{ fontSize: 13, color: S.n500, marginBottom: 14 }}>Browse other business types →</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[['☕', 'Cafes', '/use-case/cafes'], ['🍽️', 'Restaurants', '/use-case/restaurants'], ['💪', 'Gyms', '/use-case/gyms'], ['🥡', 'Takeaway', '/use-case/takeaway'], ['🏪', 'All Types', '/use-case/all']].map(([icon, label, href]) => (
                <Link key={href as string} href={href as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: S.n700, textDecoration: 'none' }}>{icon} {label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}