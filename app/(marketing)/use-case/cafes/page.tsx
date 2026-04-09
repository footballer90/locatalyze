'use client'
import Link from 'next/link'
import { useState } from 'react'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
 n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const OTHER_TYPES = [
 { icon: '', label: 'Restaurants', href: '/use-case/restaurants' },
 { icon: '', label: 'Retail Stores', href: '/use-case/retail' },
 { icon: '', label: 'Gyms & Fitness', href: '/use-case/gyms' },
 { icon: '', label: 'Takeaway', href: '/use-case/takeaway' },
 { icon: '', label: 'All Types', href: '/use-case/all' },
]

export default function Page() {
 const [poll, setPoll] = useState<string | null>(null)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
   <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

    {/* Hero */}
        <div style={{ background: S.headerBg, padding: '0 0 0 0', position: 'relative', overflow: 'hidden' }}>
     <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${S.brand}25,transparent 70%)` }} />
     <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle,${S.brandLight}15,transparent 70%)` }} />
     <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px 56px', position: 'relative' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
       <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}><img src="/logo-mark.svg" alt="" style={{ width: \'13px\', height: \'13px\' }} /></div>
       <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
      </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
       <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.18)', border: '1px solid rgba(15,118,110,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}> Use Case Guide</div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>How to Choose the Best Location for a Café</h1>
        <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>Location is the single most consequential decision a café owner makes. It determines your customer base, daily revenue ceiling, and whether the business survives the first two years. This guide covers every factor you need to evaluate.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
         <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.35)' }}>
          Analyse my location free →
                  </Link>
                  <a href="#checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Jump to checklist ↓
                  </a>
                </div>
              </div>
              {/* Stats card */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '24px', minWidth: 240 }}>
        {[
                  { v: '60%', l: 'of café failures linked to poor location' },
         { v: '$80K+', l: 'average fit-out cost before opening' },
         { v: '18mo', l: 'avg survival time for undercapitalised cafés' },
         { v: '12%', l: 'maximum healthy rent-to-revenue ratio' },
        ].map(s => (
                  <div key={s.v} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 26, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</p>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>{s.l}</p>
         </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 20px 80px' }}>

     {/* Hero image */}
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 56, position: 'relative' }}>
      <img src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=85" alt="Busy café" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,31,28,0.7), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 32 }}>
       <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>The right location means a queue before 9am. The wrong one means closing at lunch.</p>
      </div>
          </div>

          {/* Intro */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Why location beats everything</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>A great coffee cannot fix a bad address</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(440px,1fr))', gap: 20 }}>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>Walk into any great café and you will find it almost impossible to separate the quality of the coffee from the energy of the space. But behind that energy is a decision made months or years before the first bag of beans arrived: where to put it. A café with extraordinary coffee in the wrong location will struggle to survive. A café with good-enough coffee in the right location will thrive.</p>
       <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.85 }}>The numbers are sobering. Over 60% of café failures are linked — at least in part — to location decisions that were made without proper analysis. Rent that looked manageable on paper became unmanageable when foot traffic underperformed. Residential suburbs that seemed quiet turned out to have no morning commuter flow. Office districts that looked busy at lunch were empty by 3pm. Every one of these outcomes was predictable with the right data.</p>
      </div>
          </div>

          {/* 5 Key Factors */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The 5 factors that determine viability</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>What to analyse before you sign anything</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
       {[
                { icon: '', color: '#0F766E', bg: '#F0FDFA', title: 'Morning foot traffic', body: 'The 7–9am window is where 40–60% of café revenue is made. Count pedestrians at 7am on a Tuesday. Under 30 per hour is very difficult. Over 100 per hour is a strong signal. Direction matters too — inbound (away from the station) traffic is more likely to stop than outbound.' },
        { icon: '', color: '#1D4ED8', bg: '#EFF6FF', title: 'Nearby offices and anchors', body: 'Office workers are the backbone of weekday café revenue. Proximity to a gym, train station or school creates habitual foot traffic that passes your door on a schedule. Being within 200m of a major office building or precinct is a significant revenue driver.' },
        { icon: '', color: '#7C3AED', bg: '#F5F3FF', title: 'Local demographics', body: 'ABS Census data reveals the income profile, age distribution and household type of the surrounding suburb. A suburb with above-average household income and a 25–45 professional demographic is the natural habitat for specialty coffee. Demographics also predict average spend per visit.' },
        { icon: '', color: '#B45309', bg: '#FFFBEB', title: 'Rent-to-revenue ratio', body: 'Rent should sit between 8–12% of monthly revenue for a café to remain financially healthy. Take the monthly rent, divide by 0.10 — that is the revenue needed to keep rent at 10%. Work backwards from your expected daily transaction count to test whether the site stacks up.' },
        { icon: '', color: '#DC2626', bg: '#FEF2F2', title: 'Competitor density', body: '2–3 cafes nearby is healthy — it confirms demand. 6+ direct competitors within 200m is oversaturation unless foot traffic is exceptional (150+/hour). Check Google ratings of competitors — multiple operators below 4.0 stars signals a quality gap you could fill.' },
       ].map(f => (
                <div key={f.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
         <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
         <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image + insight */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24, marginBottom: 56 }}>
      <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80" alt="café morning" style={{ borderRadius: 16, width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
       <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The 7am test</p>
       <h3 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>The most important 10 minutes of your research</h3>
       <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.8, marginBottom: 16 }}>Visit your candidate location at exactly 7am on a Tuesday. Set a timer for 10 minutes. Count every person who walks past. Multiply by 6 to get an hourly rate. This single data point — collected in person, at the right time — tells you more about café viability than any report.</p>
       <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 12, padding: '14px 16px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 6 }}>Benchmark thresholds</p>
                {[['Under 30/hour', 'Very difficult — avoid unless rent is exceptional', S.red],
         ['30–60/hour', 'Viable with strong positioning', S.amber],
         ['60–120/hour', 'Good opportunity — check competition next', S.emerald],
         ['120+/hour', 'Strong location — focus on lease terms', S.brand]].map(([v, l, c]) => (
         <div key={v as string} style={{ display: 'flex', gap: 10, marginBottom: 4, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: c as string, width: 90, flexShrink: 0 }}>{v}</span>
                    <span style={{ fontSize: 12, color: S.n500 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 56 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Industry data & market insights</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 24 }}>What the numbers say about café viability</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
       {[
                { v: '24,000+', l: 'Cafes operating in Australia', s: 'ABS Business Register 2024' },
        { v: '3.8%', l: 'Annual industry revenue growth', s: 'IBISWorld 2025' },
        { v: '$4.20', l: 'Average flat white price nationally', s: 'Industry average 2026' },
        { v: '28–34%', l: 'COGS as % of revenue', s: 'Industry benchmark' },
        { v: '30–38%', l: 'Labour as % of revenue', s: 'Industry benchmark' },
        { v: '4–9%', l: 'Net profit margin for well-run cafes', s: 'IBISWorld 2025' },
       ].map(s => (
                <div key={s.v} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px' }}>
         <p style={{ fontSize: 28, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</p>
         <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5, lineHeight: 1.4 }}>{s.l}</p>
         <p style={{ fontSize: 10, color: '#4B5563', marginTop: 4 }}>{s.s}</p>
        </div>
              ))}
            </div>
          </div>

          {/* SWOT */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>SWOT analysis</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 20 }}>How location affects your café business</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
       {[
                { label: 'Strengths', icon: '', color: S.emerald, bg: S.emeraldBg, bdr: S.emeraldBdr, items: ['Corner position with dual street visibility', 'Existing café infrastructure saves fit-out costs', 'High morning commuter density', 'Near established anchor businesses (gyms, offices)'] },
        { label: 'Weaknesses', icon: '', color: S.amber, bg: S.amberBg, bdr: S.amberBdr, items: ['High rent in premium locations squeezes margin', 'Dependency on single peak window (7–9am)', 'Seasonal variation in outdoor areas', 'Limited parking in dense urban locations'] },
        { label: 'Opportunities', icon: '', color: '#1D4ED8', bg: '#EFF6FF', bdr: '#BFDBFE', items: ['Underserved apartment precincts with new residents', 'Suburbs where competitors score below 3.8 stars', 'Office precincts lacking quality independent options', 'Growth corridors with new residential development'] },
        { label: 'Threats', icon: '🚨', color: S.red, bg: S.redBg, bdr: S.redBdr, items: ['National chain opening nearby with larger marketing budget', 'Office vacancies reduce worker foot traffic', 'Rent escalation above CPI at lease review', 'New apartment development blocking street visibility'] },
       ].map(q => (
                <div key={q.label} style={{ background: q.bg, border: `1px solid ${q.bdr}`, borderRadius: 14, padding: '20px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>{q.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: q.color }}>{q.label}</span>
                  </div>
                  {q.items.map((item, i) => (
                    <p key={i} style={{ fontSize: 12, color: S.n700, lineHeight: 1.6, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${q.color}40` }}>{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div id="checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20, marginBottom: 56 }}>
      <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 16 }}> What to look for</h3>
              {['Strong morning foot traffic (60+/hour at 7am)', 'Offices, gyms or train station within 200m', 'Suburb income demographics above $85K median', '2–4 competitors nearby (demand confirmed, not saturated)', 'Corner or street-facing position with window display', 'Existing commercial kitchen infrastructure', 'North or east-facing outdoor seating potential', 'Low vacancy rate on surrounding street'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.emerald, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>→</span>
                  <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 16, padding: '26px' }}>
       <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 16 }}> Red flags — walk away</h3>
              {['Rent above 15% of conservatively projected revenue', 'Under 30 pedestrians per hour at 7am on a weekday', 'More than 5 established cafes within 200m', 'No morning commuter flow past the site', 'Purely residential suburb with low daytime population', 'Basement or first-floor location with no street presence', 'Multiple vacant shops on the same street', 'Landlord refusing a rent-free fit-out period'].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
         <span style={{ color: S.red, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✕</span>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>{item}</p>
        </div>
              ))}
            </div>
          </div>

          {/* Real-world scenario */}
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Real-world scenario</p>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 14 }}>Two cafés, same suburb, very different outcomes</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
       <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '18px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: S.emerald, marginBottom: 8 }}> Café A — Corner of train station exit</p>
                <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.75 }}>Located 50 metres from the station exit on the inbound side. 180 pedestrians per hour at 7:30am. Rent $4,200/month. At a 2.5% capture rate and $9 average spend, that is 270 transactions before 10am — $2,430/day just from morning trade. Rent sits at 8.4% of monthly revenue. Profitable in month 4.</p>
       </div>
              <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '18px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: S.red, marginBottom: 8 }}> Café B — Quiet side street, 3 blocks away</p>
                <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.75 }}>Same suburb, 400 metres from the station. 22 pedestrians per hour at 7:30am. Rent $3,500/month. Despite better interior design and objectively better coffee, the café averaged 55 transactions per day. Revenue could not sustain the rent. Closed at 14 months.</p>
       </div>
            </div>
          </div>

          {/* Poll */}
          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Quick poll</p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 16 }}>What matters most to you when choosing a café location?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {['Morning foot traffic volume', 'Affordable rent ratio', 'Low competitor density', 'Suburb income demographics'].map(option => (
        <button key={option} onClick={() => setPoll(option)}
                  style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${poll === option ? S.brand : S.brandBorder}`, background: poll === option ? S.brand : S.white, color: poll === option ? '#fff' : S.n700, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: S.font, textAlign: 'left', transition: 'all 0.15s' }}>
         {poll === option ? ' ' : ''}{option}
        </button>
              ))}
            </div>
            {poll && <p style={{ fontSize: 13, color: S.brand, fontWeight: 700, marginTop: 12 }}>Good choice. Locatalyze analyses all four together. Run a free analysis below to see how your candidate location scores.</p>}
          </div>

          {/* How Locatalyze helps */}
          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', marginBottom: 48 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How Locatalyze helps café owners</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 16 }}>Stop guessing. Start with data.</h2>
      <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24, maxWidth: 560 }}>Locatalyze combines ABS demographic data, competitor mapping and financial modelling into a single 30-second analysis for any Australian address. Paste a street address and get a full feasibility report with a GO / CAUTION / NO verdict.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 28 }}>
       {[['', 'Competition count & scoring within your radius'], ['', 'Suburb demographics matched to café profile'], ['', 'Rent-to-revenue ratio with your actual numbers'], ['', 'Daily customer volume estimate'], ['', 'GO / CAUTION / NO verdict in about 90 seconds']].map(([icon, text]) => (
        <div key={text as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
         <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.55 }}>{text}</p>
        </div>
              ))}
            </div>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.3)' }}>
       Analyse my café location free →
            </Link>
          </div>

          {/* Other types */}
          <div>
            <p style={{ fontSize: 13, color: S.n500, marginBottom: 14 }}>Browse other business types →</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
       {OTHER_TYPES.map(t => (
                <Link key={t.href} href={t.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: S.n700, textDecoration: 'none' }}>
         {t.icon} {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}