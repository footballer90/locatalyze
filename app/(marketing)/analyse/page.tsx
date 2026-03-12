'use client'
export const dynamic = 'force-dynamic'
import { CITIES, BUSINESS_TYPES, getScoreColor } from '@/lib/location-data'
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

const TYPES = [
  { icon: '☕', label: 'Cafes & Coffee',    href: '/use-case/cafes',       desc: 'Morning commuter traffic, rent ratios, bean-to-chair economics', color: '#92400E', bg: '#FEF3C7' },
  { icon: '🍽️', label: 'Restaurants',       href: '/use-case/restaurants', desc: 'Evening trade, parking access, destination dining dynamics', color: '#991B1B', bg: '#FEE2E2' },
  { icon: '👗', label: 'Retail Stores',     href: '/use-case/retail',      desc: 'Foot traffic counts, anchor stores, spend demographics', color: '#1E40AF', bg: '#DBEAFE' },
  { icon: '💪', label: 'Gyms & Fitness',    href: '/use-case/gyms',        desc: 'Residential catchment, competition saturation, floor plate cost', color: '#065F46', bg: '#D1FAE5' },
  { icon: '🥐', label: 'Bakeries',          href: '/use-case/cafes',       desc: 'Breakfast trade windows, artisan vs convenience positioning', color: '#78350F', bg: '#FEF3C7' },
  { icon: '🏪', label: 'All business types', href: '/use-case/all',        desc: 'Works for any retail, food or service business in Australia', color: S.n700, bg: S.n100 },
]

const CITIES = [
  {
    name: 'Sydney', state: 'NSW', emoji: '🌉',
    insight: 'Highest commercial rents in Australia. Inner-west suburbs (Newtown, Surry Hills) offer better ROI than CBD for most SMEs.',
    suburbs: [
      { name: 'Newtown', score: 81, type: 'Cafes, Retail', rent: '$4,200/mo avg' },
      { name: 'Surry Hills', score: 78, type: 'Restaurants, Bars', rent: '$5,100/mo avg' },
      { name: 'Bondi', score: 72, type: 'Cafes, Fitness', rent: '$6,800/mo avg' },
      { name: 'Parramatta', score: 74, type: 'Retail, Food', rent: '$3,900/mo avg' },
      { name: 'Chatswood', score: 69, type: 'Retail, Dining', rent: '$4,700/mo avg' },
    ],
  },
  {
    name: 'Melbourne', state: 'VIC', emoji: '🏙️',
    insight: 'Australia\'s café capital. Inner suburbs have Australia\'s most sophisticated food culture. Competition is high but so is spend.',
    suburbs: [
      { name: 'Fitzroy', score: 84, type: 'Cafes, Bars, Retail', rent: '$3,800/mo avg' },
      { name: 'Richmond', score: 79, type: 'Restaurants, Cafes', rent: '$4,200/mo avg' },
      { name: 'St Kilda', score: 76, type: 'Hospitality, Fitness', rent: '$4,900/mo avg' },
      { name: 'Brunswick', score: 80, type: 'Cafes, Independent Retail', rent: '$3,200/mo avg' },
      { name: 'Collingwood', score: 77, type: 'Dining, Retail', rent: '$3,600/mo avg' },
    ],
  },
  {
    name: 'Brisbane', state: 'QLD', emoji: '☀️',
    insight: 'Australia\'s fastest growing major city. Lower rents than Sydney/Melbourne with strong population growth driving new demand.',
    suburbs: [
      { name: 'Fortitude Valley', score: 75, type: 'Hospitality, Nightlife', rent: '$3,400/mo avg' },
      { name: 'West End', score: 78, type: 'Cafes, Independent Retail', rent: '$2,900/mo avg' },
      { name: 'Paddington', score: 73, type: 'Boutique Retail, Dining', rent: '$3,100/mo avg' },
      { name: 'Newstead', score: 71, type: 'Corporate Dining, Fitness', rent: '$3,800/mo avg' },
      { name: 'Ascot', score: 68, type: 'Premium Retail, Cafes', rent: '$2,700/mo avg' },
    ],
  },
  {
    name: 'Perth', state: 'WA', emoji: '🌅',
    insight: 'Resource economy drives above-average incomes. Subiaco and Leederville are the strongest SME corridors in WA.',
    suburbs: [
      { name: 'Subiaco', score: 82, type: 'Cafes, Boutique Retail', rent: '$3,600/mo avg' },
      { name: 'Fremantle', score: 74, type: 'Tourism, Hospitality', rent: '$3,100/mo avg' },
      { name: 'Leederville', score: 79, type: 'Cafes, Restaurants', rent: '$2,800/mo avg' },
      { name: 'Mount Lawley', score: 76, type: 'Dining, Bars', rent: '$2,900/mo avg' },
      { name: 'Northbridge', score: 71, type: 'Nightlife, Food', rent: '$2,600/mo avg' },
    ],
  },
  {
    name: 'Adelaide', state: 'SA', emoji: '🍷',
    insight: 'Most affordable major city for commercial leasing. Strong food and wine culture. Lower population density but loyal customer bases.',
    suburbs: [
      { name: 'Rundle Mall', score: 70, type: 'Retail, Hospitality', rent: '$2,400/mo avg' },
      { name: 'Unley', score: 72, type: 'Boutique Retail, Dining', rent: '$2,100/mo avg' },
      { name: 'Norwood', score: 74, type: 'Cafes, Restaurants', rent: '$2,200/mo avg' },
      { name: 'Glenelg', score: 68, type: 'Tourism, Hospitality', rent: '$2,800/mo avg' },
      { name: 'Prospect', score: 71, type: 'Independent Retail, Cafes', rent: '$1,900/mo avg' },
    ],
  },
  {
    name: 'Canberra', state: 'ACT', emoji: '🏛️',
    insight: 'Government workers = stable, high-income customer base. Less foot traffic than other capitals but much less competition.',
    suburbs: [
      { name: 'Braddon', score: 76, type: 'Cafes, Bars, Dining', rent: '$3,000/mo avg' },
      { name: 'Kingston', score: 73, type: 'Hospitality, Retail', rent: '$2,800/mo avg' },
      { name: 'Manuka', score: 75, type: 'Premium Dining, Retail', rent: '$3,200/mo avg' },
      { name: 'New Acton', score: 71, type: 'Arts, Hospitality', rent: '$3,400/mo avg' },
      { name: 'Dickson', score: 69, type: 'Asian Dining, Retail', rent: '$2,200/mo avg' },
    ],
  },
]

const STATS = [
  { value: '$287K', label: 'Average cost of a bad location decision', sub: 'Including fit-out, lease break fees, lost revenue' },
  { value: '60%', label: 'Of small businesses fail in first 3 years', sub: 'Location is cited as a factor in over 40% of failures' },
  { value: '500m', label: 'Critical competitive radius for most retail', sub: 'Customers rarely walk further to choose between options' },
  { value: '12%', label: 'Maximum healthy rent-to-revenue ratio', sub: 'Above 15% significantly increases failure risk' },
]

const INSIGHTS = [
  {
    icon: '📊',
    title: 'The 3 numbers that determine location viability',
    body: 'Before any other analysis, three numbers matter most: (1) estimated daily foot traffic past your door, (2) monthly rent as a % of projected revenue, and (3) competitor count within 500m. If these three stack up, everything else is refinable. If they don\'t, no amount of great branding will save you.',
    tag: 'Fundamentals',
  },
  {
    icon: '🏙️',
    title: 'Why the same business thrives in one suburb and fails 2km away',
    body: 'Demographics shift dramatically within short distances in Australian cities. A suburb of young professionals (Fitzroy, Newtown) has fundamentally different purchasing behaviour to a suburb of families (Box Hill, Parramatta). Median income, age profile, and household type are the three demographic variables that most predict category spend.',
    tag: 'Demographics',
  },
  {
    icon: '🏪',
    title: 'The anchor effect: why being near Woolworths matters',
    body: 'Anchor tenants (supermarkets, major pharmacy chains, large format retail) generate habitual foot traffic that benefits nearby businesses. A café or retail store within 100m of a busy Woolworths draws from that traffic pattern. Landlords know this — which is why anchor-adjacent rents are higher. The question is whether the traffic premium justifies the rent premium.',
    tag: 'Strategy',
  },
  {
    icon: '💰',
    title: 'How to calculate whether a rent is actually affordable',
    body: 'The rent affordability test: take your monthly rent and divide it by 0.12. That\'s the monthly revenue you need to make the rent manageable. Then divide that by your average transaction value and by 26 trading days. That\'s your required daily transaction count. If that number seems achievable based on observed foot traffic — you might have a viable site.',
    tag: 'Financial model',
  },
]

function SuburbScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? S.emerald : score >= 70 ? S.amber : S.red
  const bg = score >= 80 ? S.emeraldBg : score >= 70 ? S.amberBg : S.redBg
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: bg, color, borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 800 }}>
      {score}
    </span>
  )
}


}
export default function AnalysePage() {
  const [openCity, setOpenCity] = useState<string | null>('Sydney')

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Hero */}
        <div style={{ background: S.headerBg, padding: '60px 24px 56px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Location Intelligence Hub</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 1.15 }}>
            Everything you need to know<br />before signing a commercial lease
          </h1>
          <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 560, margin: '0 auto 32px' }}>
            Suburb scores, city guides, business type analysis and location fundamentals — all in one place. Or skip the reading and run your own analysis in 30 seconds.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.3)' }}>
              Run a free analysis →
            </Link>
            <a href="#city-guides" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Browse city guides ↓
            </a>
          </div>
        </div>

        {/* Key stats banner */}
        <div style={{ background: S.brand, padding: '28px 24px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {STATS.map(s => (
              <div key={s.value} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginTop: 4, marginBottom: 3 }}>{s.label}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 20px 80px' }}>

          {/* Business type cards */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>By business type</p>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>What makes a good location depends on your business</h2>
              <p style={{ fontSize: 15, color: S.n500, maxWidth: 560 }}>A café and a gym on the same street will have completely different viability. Each guide covers the specific factors that drive success for that business type.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {TYPES.map(t => (
                <Link key={t.href + t.label} href={t.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '22px', display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{t.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 5 }}>{t.label}</p>
                      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.55 }}>{t.desc}</p>
                    </div>
                    <span style={{ color: S.brand, fontSize: 18, fontWeight: 700, flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Location insights */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Location intelligence</p>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em' }}>What the data actually tells you</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 16 }}>
              {INSIGHTS.map(insight => (
                <div key={insight.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{insight.icon}</div>
                    <div>
                      <span style={{ display: 'inline-block', background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700, marginBottom: 5 }}>{insight.tag}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: S.n900, lineHeight: 1.4 }}>{insight.title}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{insight.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rent calculator explainer */}
          <div style={{ background: S.n900, borderRadius: 20, padding: '36px', marginBottom: 72, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle,${S.brand}30,transparent 70%)` }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, position: 'relative' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>The rent affordability formula</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.3 }}>Is this rent actually affordable for your business?</h3>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 20 }}>Most people look at rent as a monthly cost. The right way to look at it is as a percentage of your projected revenue. Here is the simple test every founder should run before signing anything.</p>
                <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Model my numbers free →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { pct: 'Under 10%', label: 'Excellent', desc: 'Strong buffer. Even a slow month won\'t hurt you.', color: S.emerald, bg: 'rgba(5,150,105,0.1)' },
                  { pct: '10–12%', label: 'Healthy', desc: 'Industry standard for most retail and hospitality.', color: S.emerald, bg: 'rgba(5,150,105,0.08)' },
                  { pct: '13–15%', label: 'Caution zone', desc: 'Manageable but leaves little room for slow periods.', color: S.amber, bg: 'rgba(217,119,6,0.1)' },
                  { pct: '16–20%', label: 'High risk', desc: 'One slow month creates serious cash flow stress.', color: S.red, bg: 'rgba(220,38,38,0.1)' },
                  { pct: 'Over 20%', label: 'Avoid', desc: 'Statistically, very few businesses survive this ratio.', color: S.red, bg: 'rgba(220,38,38,0.15)' },
                ].map(r => (
                  <div key={r.pct} style={{ background: r.bg, border: `1px solid ${r.color}25`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: r.color, width: 70, flexShrink: 0 }}>{r.pct}</span>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.label}</span>
                      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* City guides */}
          <div id="city-guides" style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>City guides</p>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Australian city-by-city breakdown</h2>
              <p style={{ fontSize: 15, color: S.n500 }}>Each city has a different commercial property market, culture and customer profile. Here is what you need to know.</p>
            </div>

            {/* City tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {CITIES.map(c => (
                <button key={c.name} onClick={() => setOpenCity(c.name)}
                  style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font, background: openCity === c.name ? S.brand : S.white, color: openCity === c.name ? '#fff' : S.n500, boxShadow: openCity === c.name ? '0 4px 12px rgba(15,118,110,0.2)' : '0 1px 3px rgba(0,0,0,0.06)', outline: openCity === c.name ? 'none' : `1.5px solid ${S.n200}` }}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>

            {CITIES.filter(c => c.name === openCity).map(city => (
              <div key={city.name}>
                {/* City insight */}
                <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: S.brand, fontWeight: 700, marginBottom: 4 }}>📍 {city.name}, {city.state} — Market overview</p>
                  <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>{city.insight}</p>
                </div>

                {/* Suburb table */}
                <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: `1px solid ${S.n100}`, display: 'grid', gridTemplateColumns: '1fr 80px 1fr 120px 140px', gap: 12, alignItems: 'center' }}>
                    {['Suburb', 'Score', 'Best for', 'Avg rent', 'Action'].map(h => (
                      <p key={h} style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</p>
                    ))}
                  </div>
                  {city.suburbs.map((suburb, i) => (
                    <div key={suburb.name} style={{ padding: '14px 20px', borderBottom: i < city.suburbs.length - 1 ? `1px solid ${S.n100}` : 'none', display: 'grid', gridTemplateColumns: '1fr 80px 1fr 120px 140px', gap: 12, alignItems: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900 }}>{suburb.name}</p>
                      <SuburbScoreBadge score={suburb.score} />
                      <p style={{ fontSize: 12, color: S.n500 }}>{suburb.type}</p>
                      <p style={{ fontSize: 12, color: S.n700, fontWeight: 600 }}>{suburb.rent}</p>
                      <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: S.brandFaded, color: S.brand, borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700, textDecoration: 'none', border: `1px solid ${S.brandBorder}` }}>
                        Analyse this suburb →
                      </Link>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: S.n400, marginTop: 8, textAlign: 'right' }}>* Scores and rents are indicative estimates based on available data. Always verify before committing.</p>
              </div>
            ))}
          </div>

          {/* Competition explainer */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Competition analysis</p>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em' }}>How to read competitor density</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { icon: '🟢', level: 'Low competition', count: '0–2 competitors within 500m', verdict: 'Good sign', desc: 'Market may be underserved. Check that demand exists before assuming it is an opportunity.', color: S.emerald, bg: S.emeraldBg },
                { icon: '🟡', level: 'Moderate', count: '3–5 competitors within 500m', verdict: 'Healthy', desc: 'Proven demand exists. Differentiation becomes the key success factor.', color: S.amber, bg: S.amberBg },
                { icon: '🟠', level: 'High competition', count: '6–9 competitors within 500m', verdict: 'Caution', desc: 'Market is competitive. You need a clear point of difference or superior location.', color: '#EA580C', bg: '#FFF7ED' },
                { icon: '🔴', level: 'Saturated', count: '10+ competitors within 500m', verdict: 'Avoid', desc: 'Unless foot traffic is exceptional, margin pressure will be severe from day one.', color: S.red, bg: S.redBg },
              ].map(row => (
                <div key={row.level} style={{ background: row.bg, border: `1px solid ${row.color}25`, borderRadius: 14, padding: '20px' }}>
                  <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>{row.icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 800, color: row.color, marginBottom: 3 }}>{row.level}</p>
                  <p style={{ fontSize: 11, color: row.color, opacity: 0.7, marginBottom: 10 }}>{row.count}</p>
                  <p style={{ display: 'inline-block', background: row.color, color: '#fff', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 800, marginBottom: 8 }}>{row.verdict}</p>
                  <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65 }}>{row.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>Common questions about location analysis</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { q: 'How long should I spend analysing a location before signing?', a: 'At minimum: one full week of data gathering. Visit the site at least 3 times — once on a weekday morning, once on a weekday lunch, once on a weekend. Run a data analysis (like Locatalyze) to check demographics, competition and financials. Then speak to neighbouring business owners. Most founders who regret their location signed within 2 weeks of finding the site.' },
                { q: 'Can I trust an AI analysis for a decision this big?', a: 'AI analysis is a tool, not a replacement for professional advice. Locatalyze gives you a fast, data-driven starting point — competition counts, demographic scoring, financial modelling. It narrows down which sites are worth deeper investigation. Before signing any lease, you should also get advice from a commercial real estate agent and a business accountant.' },
                { q: 'What is the single most important thing to check?', a: 'The rent-to-revenue ratio. Everything else — foot traffic, demographics, competition — ultimately flows through to your P&L. But the rent is your fixed commitment. A location with moderate foot traffic and cheap rent can be far more profitable than a premium location with high rent.' },
                { q: 'Does Locatalyze work for businesses outside the food and fitness industry?', a: 'Yes. The financial model works for any business where you can define an average transaction value and estimate a daily customer count. We have built-in calibrations for cafes, restaurants, retail, gyms and takeaway — but the scoring engine works for any retail or service business.' },
              ].map((faq, i) => (
                <div key={i} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Q: {faq.q}</p>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, borderRadius: 20, padding: '48px 36px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>Stop guessing. Start analysing.</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>Paste any Australian address and get a full feasibility report with GO/CAUTION/NO verdict in 30 seconds. Free to start — no credit card.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: S.brand, borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
              Run my free analysis →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}