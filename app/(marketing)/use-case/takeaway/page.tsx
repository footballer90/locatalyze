'use client'
import Link from 'next/link'
import { useState } from 'react'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n200: '#E7E5E4', n500: '#78716C', n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
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
                <div style={{ display: 'inline-flex', background: 'rgba(15,118,110,0.18)', border: '1px solid rgba(15,118,110,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}> Use Case Guide</div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>How to Choose the Best Location for a Takeaway Business</h1>
        <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>Takeaway is one of the most location-sensitive food formats in Australia. Lunch foot traffic, residential density for delivery, and cuisine gap analysis all drive viability — and each one requires a different analysis methodology.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
         <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.35)' }}>Analyse my location free →</Link>
         <a href="#checklist" style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.07)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Jump to checklist ↓</a>
        </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '24px', minWidth: 240 }}>
        {[['$12B+', 'Annual Australian takeaway and delivery revenue'], ['3–5km', 'Typical delivery platform radius from kitchen'], ['12–1pm', 'Peak window for office lunch trade'], ['50%', 'Of takeaway orders now placed via app']].map(([v, l]) => (
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
      <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&q=85" alt="Takeaway food" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(12,31,28,0.7),transparent)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 32 }}>
       <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>For takeaway, the delivery zone households are as important as the people walking past. Map both before you commit.</p>
      </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>The hybrid location model: walk-in plus delivery</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(440px,1fr))', gap: 20 }}>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>Takeaway businesses now operate two revenue models simultaneously: walk-in customers from the street and delivery orders from a 3–5km residential radius. This means your location analysis has two separate variables to optimise. The walk-in model needs office density and lunch foot traffic. The delivery model needs residential household density and cuisine gap analysis within your delivery zone.</p>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>A takeaway on a busy lunch strip with 8,000 households within 3km is operating at full advantage. A takeaway on a quiet back street with 3,000 households in its delivery zone is dependent almost entirely on app-based ordering from a limited pool. The difference in revenue ceiling between these two locations is enormous — and entirely predictable before you sign.</p>
      </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>5 factors that determine takeaway location viability</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
       {[
                { icon: '', color: '#1D4ED8', bg: '#EFF6FF', title: 'Office density for lunch trade', body: 'The 12–1pm lunch rush is where most takeaway businesses make their weekday revenue. Offices within 500m — particularly large employers — are the most reliable source of high-frequency lunch customers. Check the ABS worker population data for your suburb.' },
        { icon: '', color: '#0F766E', bg: '#F0FDFA', title: 'Residential density for delivery', body: 'Map your 3km delivery radius and count households. Under 3,000 households means delivery-only is very difficult to sustain. 6,000–10,000 is a strong delivery opportunity. 10,000+ with good cuisine positioning is excellent.' },
        { icon: '', color: '#7C3AED', bg: '#F5F3FF', title: 'Cuisine gap analysis', body: 'Open UberEats and search your cuisine category in your suburb. How many direct competitors are already serving that area? An underserved cuisine in a dense residential suburb is a genuine opportunity. An overcrowded category is not.' },
        { icon: '🛵', color: '#B45309', bg: '#FFFBEB', title: 'Rider access and logistics', body: 'Easy access for delivery riders matters more than most takeaway owners realise. A side street with a loading zone or easy pull-in is better than a main road with no stopping. Rider frustration with difficult pickup locations leads to lower ratings and fewer orders.' },
        { icon: '', color: '#DC2626', bg: '#FEF2F2', title: 'Rent vs delivery revenue ceiling', body: 'Unlike dine-in businesses, takeaway can operate from lower-rent premises. You do not need shopfront prestige. A premises at $2,000–$2,500/month with good kitchen infrastructure and strong delivery zone density often outperforms a premium $4,500/month location.' },
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
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 24 }}>Australian takeaway and delivery data 2026</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
       {[['$12B+', 'Annual takeaway and delivery revenue', 'IBISWorld 2025'], ['50%', 'Orders placed via delivery app', 'Industry estimate 2026'], ['3–5km', 'Standard platform delivery radius', 'UberEats/DoorDash'], ['12–1pm', 'Peak revenue window for office-adjacent locations', 'Operator data'], ['5–7pm', 'Peak delivery window for residential locations', 'Operator data'], ['8–12%', 'Healthy rent-to-revenue ratio for takeaway', 'Industry benchmark']].map(([v, l, s]) => (
        <div key={v} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px' }}>
         <p style={{ fontSize: 26, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</p>
         <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5, lineHeight: 1.4 }}>{l}</p>
         <p style={{ fontSize: 10, color: '#4B5563', marginTop: 4 }}>{s}</p>
        </div>
              ))}
            </div>
          </div>

          <div id="checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, marginBottom: 56 }}>
      <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 16 }}> What to look for</h3>
              {['Office density within 500m for lunch trade', '6,000+ households within 3km delivery zone', 'Underserved cuisine category in the area', 'Easy rider access — loading zone or side street', 'Commercial kitchen infrastructure already in place', 'Rent under $3,500/month for delivery-optimised model', 'Strong delivery platform coverage in suburb'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.emerald, fontWeight: 800, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 16 }}> Red flags — walk away</h3>
              {['Under 3,000 households within 3km delivery radius', 'No office density for weekday lunch trade', 'Cuisine category with 5+ competitors in delivery zone', 'Difficult rider access on main road with no stopping', 'Rent above 15% of projected combined revenue', 'Suburb with low delivery platform ordering behaviour'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.red, fontWeight: 800, flexShrink: 0 }}>✕</span>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
          </div>

          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 16 }}>What matters most when choosing a takeaway location?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {['Residential delivery zone density', 'Office proximity for lunch trade', 'Cuisine gap in the area', 'Low rent for delivery-first model'].map(o => (
        <button key={o} onClick={() => setPoll(o)} style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${poll === o ? S.brand : S.brandBorder}`, background: poll === o ? S.brand : S.white, color: poll === o ? '#fff' : S.n700, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: S.font, textAlign: 'left' }}>
         {poll === o ? ' ' : ''}{o}
        </button>
              ))}
            </div>
            {poll && <p style={{ fontSize: 13, color: S.brand, fontWeight: 700, marginTop: 12 }}>Locatalyze analyses all four together. Run a free analysis to see your score.</p>}
          </div>

          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 48 }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 16 }}>How Locatalyze helps takeaway operators</h2>
      <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24, maxWidth: 560 }}>Paste any Australian address. Get delivery zone household mapping, cuisine saturation analysis, office density scoring and a full financial model in 30 seconds.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 28 }}>
       {[['', 'Household density mapping in 3km delivery zone'], ['', 'Office worker density within 500m'], ['', 'Cuisine saturation analysis in delivery zone'], ['', 'Revenue model for walk-in plus delivery combined'], ['', 'GO / CAUTION / NO verdict in 30 seconds']].map(([icon, text]) => (
        <div key={text as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px', display: 'flex', gap: 10 }}>
         <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.55 }}>{text}</p>
        </div>
              ))}
            </div>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>Analyse my takeaway location free →</Link>
     </div>

          <div>
            <p style={{ fontSize: 13, color: S.n500, marginBottom: 14 }}>Browse other business types →</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
       {[['', 'Cafes', '/use-case/cafes'], ['', 'Restaurants', '/use-case/restaurants'], ['', 'Retail Stores', '/use-case/retail'], ['', 'Gyms', '/use-case/gyms'], ['', 'All Types', '/use-case/all']].map(([icon, label, href]) => (
        <Link key={href as string} href={href as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: S.n700, textDecoration: 'none' }}>{icon} {label}</Link>
       ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}