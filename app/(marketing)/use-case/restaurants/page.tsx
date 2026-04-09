'use client'
import Link from 'next/link'
import { useState } from 'react'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
 n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
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
       <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}><img src="/logo-mark.svg" alt="" style={{ width: \'13px\', height: \'13px\' }} /></div>
       <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
      </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
       <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.18)', border: '1px solid rgba(15,118,110,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}> Use Case Guide</div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>How to Choose the Best Location for a Restaurant</h1>
        <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>A commercial lease is the largest commitment most restaurant owners ever make. Sign on the wrong site — without proper analysis — and you are locked in for 5 years. This guide covers every factor that determines whether a restaurant location can actually be profitable.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
         <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.35)' }}>Analyse my location free →</Link>
         <a href="#checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Jump to checklist ↓</a>
        </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '24px', minWidth: 240 }}>
        {[['60%', 'of restaurant failures linked to poor location'], ['$150K', 'average fit-out cost for a restaurant site'], ['5 years', 'typical minimum commercial lease term'], ['15%', 'max sustainable rent-to-revenue ratio']].map(([v, l]) => (
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
      <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85" alt="Restaurant dining" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(12,31,28,0.7),transparent)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 32 }}>
       <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>Full tables on a Friday night are not accidental. They are the result of choosing the right location before signing the lease.</p>
      </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Why location is everything for restaurants</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>The decision that determines everything before you open</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(440px,1fr))', gap: 20 }}>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>Over 60% of restaurant closures can be traced back — at least in part — to location decisions made without adequate analysis. The pattern is consistent: a restaurateur falls in love with a space, does a rough back-of-envelope on the rent, signs a 5-year lease, and only discovers six months later that the evening foot traffic was never going to support their covers target.</p>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>The challenge is that restaurant locations are particularly difficult to evaluate because the variables that matter most — evening traffic, dinner-mode pedestrians, parking availability at 7:30pm — are not visible on a Wednesday morning site inspection. Proper analysis requires visiting at the right times, with the right methodology, and combining that observation with hard data on demographics, competition and financials.</p>
      </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The 5 factors that determine viability</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>What to analyse before you sign anything</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
       {[
                { icon: '', color: '#1D4ED8', bg: '#EFF6FF', title: 'Evening foot traffic', body: 'Restaurants live or die on dinner trade. Visit at 7:30pm on a Friday. Are other restaurants full? Are groups of people walking past deciding where to eat? 15 minutes of direct observation tells you more about dinner viability than any data platform.' },
        { icon: '', color: '#B45309', bg: '#FFFBEB', title: 'Car parking within 400m', body: 'Dinner diners drive. A restaurant without accessible parking within 400m will lose a real percentage of potential customers — particularly families and those over 40. Public transport helps for lunch and younger demographics, but dinner requires parking.' },
        { icon: '🍷', color: '#7C3AED', bg: '#F5F3FF', title: 'Dining precinct dynamics', body: 'Being in an established dining strip means customers arrive in the area specifically to eat and may be deciding between you and two other options. That is a better position than being an isolated destination. The question is whether the precinct has room for another operator.' },
        { icon: '', color: '#0F766E', bg: '#F0FDFA', title: 'Spend per head viability', body: 'A restaurant at $75 average spend needs far fewer covers to break even than one at $28. Know your concept pricing and confirm that the suburb demographic will sustain it. ABS median income data tells you what the area will bear.' },
        { icon: '', color: '#DC2626', bg: '#FEF2F2', title: 'Liquor licence pathway', body: 'Licensed venues typically derive 25–35% of revenue from beverages. A site that cannot be licensed, or where the council approval process is uncertain, carries significant financial risk for any full-service restaurant concept.' },
       ].map(f => (
                <div key={f.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '22px' }}>
         <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
         <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24, marginBottom: 56 }}>
      <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80" alt="Restaurant evaluation" style={{ borderRadius: 16, width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
       <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The Friday night test</p>
       <h3 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>The most revealing 15 minutes of your site research</h3>
       <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.8, marginBottom: 16 }}>Visit at 7:30pm on a Friday night. Stand outside for 15 minutes. How many people walk past? How many are in groups that look like they are deciding where to eat? Are other restaurants on the street busy? This is the real test of a restaurant location — not how it looks at 11am on a Tuesday.</p>
       <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: '14px 16px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: S.amber, marginBottom: 8 }}> Also check on a Wednesday at 7pm</p>
                <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.7 }}>Friday is your best night. Wednesday is a proxy for your average week. If Wednesday is dead, your revenue model is based on weekends only — which makes the maths very difficult unless your weekend trade is exceptional.</p>
       </div>
            </div>
          </div>

          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 56 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Industry data & market insights</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 24 }}>What the numbers say about restaurant viability</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
       {[['14,000+', 'Restaurants in Sydney and Melbourne combined', 'IBISWorld 2025'], ['$68', 'Average mid-range dinner spend per head', 'Industry estimate 2026'], ['3.2%', 'Annual restaurant industry revenue growth', 'IBISWorld 2025'], ['22%', 'Revenue from beverages in licensed venues', 'Industry benchmark'], ['35–40%', 'Labour as % of restaurant revenue', 'Restaurant benchmark'], ['$180K', 'Average commercial fit-out cost', 'Industry estimate 2025']].map(([v, l, s]) => (
        <div key={v} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px' }}>
         <p style={{ fontSize: 26, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</p>
         <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5, lineHeight: 1.4 }}>{l}</p>
         <p style={{ fontSize: 10, color: '#4B5563', marginTop: 4 }}>{s}</p>
        </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>SWOT analysis</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 20 }}>How location shapes your restaurant outlook</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
       {[
                { label: 'Strengths', icon: '', c: S.emerald, bg: S.emeraldBg, bdr: S.emeraldBdr, items: ['Established dining precinct draws diners actively choosing the area', 'Liquor licence potential adds 25–35% beverage revenue', 'High-income demographics support $65–$90+ spend per head', 'Dense residential within 1km builds loyal regular base'] },
        { label: 'Weaknesses', icon: '', c: S.amber, bg: S.amberBg, bdr: S.amberBdr, items: ['Mon–Wed dinner trade often cashflow-negative in first year', 'High labour (35–40%) plus rent above 12% is unsustainable', 'Long lease commitment before concept has been market-tested', 'Seasonal volatility in tourist-dependent precincts'] },
        { label: 'Opportunities', icon: '', c: '#1D4ED8', bg: '#EFF6FF', bdr: '#BFDBFE', items: ['Underserved cuisine category in established suburb', 'Precinct with ageing or low-rated existing operators', 'Growth corridor suburb with new residential population', 'Hybrid dine-in and delivery model for additional revenue'] },
        { label: 'Threats', icon: '🚨', c: S.red, bg: S.redBg, bdr: S.redBdr, items: ['Well-funded competitor opening in same precinct', 'Office vacancy reducing weekday lunch trade', 'Rent escalation at market review above trading capacity', 'Delivery platforms eroding dine-in covers per night'] },
       ].map(q => (
                <div key={q.label} style={{ background: q.bg, border: `1px solid ${q.bdr}`, borderRadius: 14, padding: '20px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>{q.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: q.c }}>{q.label}</span>
                  </div>
                  {q.items.map((item, i) => <p key={i} style={{ fontSize: 12, color: S.n700, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${q.c}40` }}>{item}</p>)}
                </div>
              ))}
            </div>
          </div>

          <div id="checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, marginBottom: 56 }}>
      <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 16 }}> What to look for</h3>
              {['Strong foot traffic 6–10pm Thursday through Saturday', 'Parking within 300m for dinner service', 'Liquor licence obtainable or already in place', 'Suburb income demographics above $90K median', 'Established or emerging dining precinct with demand', 'Residential density within 1km for loyal regular base', 'Complementary businesses (bars, theatres, cinemas) nearby'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.emerald, fontWeight: 800, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 16 }}> Red flags — walk away</h3>
              {['No parking within 400m in a dinner dining context', 'Rent above 15% of conservatively projected revenue', 'Purely corporate area that empties after 5pm on weekdays', 'Multiple restaurant vacancies or closures on the same street', 'Liquor licence unobtainable or restricted at the site', 'No residential population within 1km for regular customers'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.red, fontWeight: 800, flexShrink: 0 }}>✕</span>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
          </div>

          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Real-world scenario</p>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 14 }}>Same cuisine type. Same suburb. Completely opposite outcomes.</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
       <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '18px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: S.emerald, marginBottom: 8 }}> Restaurant A — Dining precinct, main street</p>
                <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.75 }}>Located in an established dining strip with 5 other restaurants. Strong Friday evening traffic of 220+ per hour. Liquor licence in place. High-income residential within 800m. Reached break-even in month 9. Currently trading at 11% rent-to-revenue. Still operating after 4 years.</p>
       </div>
              <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '18px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: S.red, marginBottom: 8 }}> Restaurant B — Office precinct, no evening trade</p>
                <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.75 }}>Looked busy at lunch. But from 5:30pm onwards and all weekend, the street was empty. Lunch trade alone could not sustain the $6,200/month rent. Concept was strong. Location was fatal. Closed at 19 months despite good reviews.</p>
       </div>
            </div>
          </div>

          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Quick poll</p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 16 }}>What matters most when choosing a restaurant location?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {['Evening foot traffic density', 'Parking access for dinner diners', 'Proximity to dining precinct', 'Liquor licence availability'].map(o => (
        <button key={o} onClick={() => setPoll(o)} style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${poll === o ? S.brand : S.brandBorder}`, background: poll === o ? S.brand : S.white, color: poll === o ? '#fff' : S.n700, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: S.font, textAlign: 'left' }}>
         {poll === o ? ' ' : ''}{o}
        </button>
              ))}
            </div>
            {poll && <p style={{ fontSize: 13, color: S.brand, fontWeight: 700, marginTop: 12 }}>Great choice. Locatalyze scores all four factors together. Run a free analysis to see how your location performs.</p>}
          </div>

          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 48 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How Locatalyze helps restaurant owners</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 16 }}>Stop guessing. Start with data.</h2>
      <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24, maxWidth: 560 }}>Locatalyze analyses any Australian address and delivers a full restaurant feasibility report with competition mapping, demographic scoring and financial modelling in about 90 seconds.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 28 }}>
       {[['', 'Evening foot traffic scoring for your concept'], ['', 'Parking density mapping within 400m'], ['', 'Revenue model at your target spend per head'], ['', 'Dining category saturation analysis'], ['', 'GO / CAUTION / NO verdict in about 90 seconds']].map(([icon, text]) => (
        <div key={text as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px', display: 'flex', gap: 10 }}>
         <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.55 }}>{text}</p>
        </div>
              ))}
            </div>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
       Analyse my restaurant location free →
            </Link>
          </div>

          <div>
            <p style={{ fontSize: 13, color: S.n500, marginBottom: 14 }}>Browse other business types →</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
       {[['', 'Cafes', '/use-case/cafes'], ['', 'Retail Stores', '/use-case/retail'], ['', 'Gyms & Fitness', '/use-case/gyms'], ['', 'Takeaway', '/use-case/takeaway'], ['', 'All Types', '/use-case/all']].map(([icon, label, href]) => (
        <Link key={href as string} href={href as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: S.n700, textDecoration: 'none' }}>
         {icon} {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}