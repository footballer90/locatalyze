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
       <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
       <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
      </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
       <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'inline-flex', background: 'rgba(15,118,110,0.18)', border: '1px solid rgba(15,118,110,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}> Use Case Guide</div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>How to Choose the Best Location for a Gym or Fitness Studio</h1>
        <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>Australia has one of the highest gym densities in the world. 24/7 chains have blanketed suburban retail strips. Before you commit to 300sqm and a 5-year lease, here is what the location data actually tells you — and how to find the gap that still exists.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
         <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.35)' }}>Analyse my location free →</Link>
         <a href="#checklist" style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.07)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Jump to checklist ↓</a>
        </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '24px', minWidth: 240 }}>
        {[['3,500+', 'Gyms and fitness studios in Australia'], ['3km', 'Max distance most members regularly travel'], ['22%', 'Annual growth of boutique fitness studios'], ['200+', 'Members needed before rent reaches 12%']].map(([v, l]) => (
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
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85" alt="Gym" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(12,31,28,0.7),transparent)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 32 }}>
       <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>A gym that is 200 metres away from a competitor may be invisible to their members. The 2km radius is your real competitive landscape.</p>
      </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Why gym location analysis is fundamentally different</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(440px,1fr))', gap: 20 }}>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>A café needs people walking past. A gym needs the right people living nearby. This fundamental difference changes the entire location analysis methodology. For gyms, residential catchment demographics — not street foot traffic — are the primary variable. A gym on a quiet side street in a high-income suburb packed with 25–45 year olds can dramatically outperform a gym on a main road in a suburb with the wrong demographic profile.</p>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>The other major difference: the competition radius. For a café, 500m is the critical competitive zone. For a gym, it is 2km. A gym 800m away from yours is a direct competitor — members will choose between you. That means your saturation analysis needs to look at a much wider area, and you need to understand not just how many gyms are nearby but what format they are operating in.</p>
      </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>5 factors that determine gym location viability</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
       {[
                { icon: '', color: '#0F766E', bg: '#F0FDFA', title: 'Residential catchment density', body: 'Most gym members come from within 3km. You need 8,000+ households within that radius skewed toward 22–50 year olds with above-average income. High-density apartment precincts are particularly valuable — apartment dwellers are disproportionate gym users.' },
        { icon: '', color: '#059669', bg: '#ECFDF5', title: 'Fitness culture proxy', body: 'Visit at 6am on a weekday. Are people jogging? In activewear? Is there a café open for post-workout coffee? If the suburb has visible fitness culture, the demand for a gym is more likely to be real. If the 6am streets are empty, research why.' },
        { icon: '', color: '#7C3AED', bg: '#F5F3FF', title: 'Format gap analysis', body: 'Map every gym, yoga studio, pilates and CrossFit box within 2km. Identify which formats are missing. A suburb with three 24/7 budget gyms but no reformer pilates, boutique functional training or martial arts studio may have a real format gap.' },
        { icon: '📐', color: '#B45309', bg: '#FFFBEB', title: 'Floor plate and rent maths', body: 'Gyms need 200–500sqm of clear floor space. At $80/sqm/year, a 300sqm gym costs $2,000/month. At $60/week membership, you need 200+ active members just to bring rent to 12% of revenue. Model this before you view any premises.' },
        { icon: '', color: '#DC2626', bg: '#FEF2F2', title: 'Parking at peak hours', body: 'Peak gym hours are 5:30–8:30am and 5–7:30pm on weekdays. During these windows, members arrive by car. Adequate parking within 150m during peak hours is a meaningful driver of member retention and growth.' },
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
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 24 }}>Australian fitness industry data 2026</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
       {[['$2.4B', 'Annual Australian gym industry revenue', 'IBISWorld 2025'], ['3,500+', 'Gyms operating in Australia', 'ABS 2024'], ['22%', 'Annual growth of boutique fitness', 'Industry estimate'], ['38%', 'Australians who exercise at a gym', 'AusPlay 2024'], ['$1,800', 'Average annual gym spend per member', 'Industry benchmark'], ['3km', 'Travel radius for most gym members', 'Member research']].map(([v, l, s]) => (
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
              {['8,000+ households within 3km aged 22–50', 'Above-average household income in catchment', 'Format gap — no equivalent offering within 2km', '200–500sqm ground or first floor with parking', '3-phase power and change room infrastructure', 'Visible fitness culture in suburb (joggers, activewear)', 'Low competition in your specific format'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.emerald, fontWeight: 800, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 16 }}> Red flags — walk away</h3>
              {['More than 3 gyms within 1km of the same format', 'Under 4,000 households within 3km', 'Purely commercial area with no residential catchment', 'No parking during 6–8am and 5–7pm peak windows', 'Rent above $8,000/month without clear membership model', 'Basement or upper floor with no accessible lift'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.red, fontWeight: 800, flexShrink: 0 }}>X</span>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
          </div>

          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 16 }}>What matters most when choosing a gym location?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {['Residential catchment density', 'Format gap in the market', 'Parking at peak hours', 'Household income demographics'].map(o => (
        <button key={o} onClick={() => setPoll(o)} style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${poll === o ? S.brand : S.brandBorder}`, background: poll === o ? S.brand : S.white, color: poll === o ? '#fff' : S.n700, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: S.font, textAlign: 'left' }}>
         {poll === o ? ' ' : ''}{o}
        </button>
              ))}
            </div>
            {poll && <p style={{ fontSize: 13, color: S.brand, fontWeight: 700, marginTop: 12 }}>Locatalyze analyses all four. Run a free analysis to see your location score.</p>}
          </div>

          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 48 }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 16 }}>How Locatalyze helps gym owners find the gap</h2>
      <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24, maxWidth: 560 }}>Paste any Australian address and get a full gym feasibility report: residential catchment data, format competition mapping, income demographics and membership revenue modelling in about 90 seconds.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 28 }}>
       {[['', 'Residential catchment within 2km and 3km radius'], ['', 'Format gap analysis — what is missing within 2km'], ['', 'Membership revenue model at 100/150/200 members'], ['', 'Parking density at peak training hours'], ['', 'GO / CAUTION / NO verdict in about 90 seconds']].map(([icon, text]) => (
        <div key={text as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px', display: 'flex', gap: 10 }}>
         <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.55 }}>{text}</p>
        </div>
              ))}
            </div>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>Analyse my gym location free →</Link>
     </div>

          <div>
            <p style={{ fontSize: 13, color: S.n500, marginBottom: 14 }}>Browse other business types →</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
       {[['', 'Cafes', '/use-case/cafes'], ['', 'Restaurants', '/use-case/restaurants'], ['', 'Retail Stores', '/use-case/retail'], ['', 'Takeaway', '/use-case/takeaway'], ['', 'All Types', '/use-case/all']].map(([icon, label, href]) => (
        <Link key={href as string} href={href as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: S.n700, textDecoration: 'none' }}>{icon} {label}</Link>
       ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}