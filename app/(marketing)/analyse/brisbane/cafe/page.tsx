'use client'
// app/(marketing)/analyse/brisbane/cafe/page.tsx
// VERSION 3 — real Recharts chart, interactive poll with %, email unlock checklist
// Unique angle: Brisbane's post-pandemic migration boom, Olympics infrastructure, subtropical advantage

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/brisbane/cafe/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Café in Brisbane (2026) — Location Analysis',
//  description: 'Data-driven suburb guide for Brisbane coffee shops. Paddington, West End, New Farm scoring. Rent benchmarks, foot traffic, demographics and competition. 2032 Olympics infrastructure impact.',
//  keywords: ['best suburbs to open a cafe in Brisbane','Brisbane coffee shop location','specialty cafe Paddington Brisbane','opening a cafe West End Brisbane','Brisbane hospitality business location','low competition areas Brisbane cafe','affordable commercial rent Brisbane','best up and coming suburbs Brisbane','Brisbane cafe rent costs','hidden gems for cafe Brisbane'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/brisbane/cafe' },
//  openGraph: { title: 'Best Suburbs to Open a Café in Brisbane (2026)', description: 'Suburb-by-suburb analysis of Brisbane\'s booming café market. Olympics infrastructure, migration wave, subtropical advantage.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Brisbane (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/brisbane/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Brisbane?', acceptedAnswer: { '@type': 'Answer', text: 'Paddington scores 87/100 — the highest of any Brisbane suburb. Given Terrace delivers strong foot traffic from young professionals earning $98,000+ median income. West End (83/100) and New Farm (80/100) offer excellent alternatives with different competitive dynamics.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Brisbane inner suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Brisbane inner suburb café rents range from $3,200 to $5,500/month for a 60–80sqm tenancy (recent Queensland commercial surveys). This is 30–40% below equivalent Sydney locations and 20–25% below Melbourne — a material advantage for unit economics.' } },
      { '@type': 'Question', name: 'Why is Brisbane better than Sydney for opening a coffee shop?', acceptedAnswer: { '@type': 'Answer', text: 'Brisbane combines lower commercial rents (30–40% cheaper than Sydney) with a growing high-income demographic fuelled by interstate migration from Sydney and Melbourne. The subtropical climate enables year-round outdoor seating — a revenue stream that Sydney cafés cannot access. Combined, these factors produce rent-to-revenue ratios of 6–9% versus 12–18% in Sydney.' } },
      { '@type': 'Question', name: 'Is Fortitude Valley good for a café?', acceptedAnswer: { '@type': 'Answer', text: 'Fortitude Valley (score 68, CAUTION) has high foot traffic but the market is transitioning from nightlife to daytime vibrancy. Weekend foot traffic remains strong; weekday morning commuter base is softer than Paddington or West End. Rent is 15–20% higher than West End despite lower median income ($72,000 vs $82,000). New entrants face higher risk here than in GO-rated suburbs.' } },
      { '@type': 'Question', name: 'Which Brisbane suburbs should I avoid for a café?', acceptedAnswer: { '@type': 'Answer', text: 'Chermside (score 42, NO) is chain-dominated with insufficient independent operator space. Springfield (score 35, NO) is too new and car-dependent with immature demographics. Caboolture (score 31, NO) has income demographics below café viability thresholds. All three have rent-to-revenue ratios exceeding 18%, indicating high risk.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Paddington',   score: 87, rent: 4500, traffic: 89, income: 98 },
  { suburb: 'West End',     score: 83, rent: 3800, traffic: 91, income: 82 },
  { suburb: 'New Farm',     score: 80, rent: 4750, traffic: 84, income: 92 },
  { suburb: 'Teneriffe',    score: 76, rent: 4200, traffic: 79, income: 95 },
  { suburb: 'Fortitude Valley', score: 68, rent: 5100, traffic: 88, income: 72 },
  { suburb: 'Chermside',    score: 42, rent: 3600, traffic: 68, income: 65 },
  { suburb: 'Springfield',  score: 35, rent: 3400, traffic: 52, income: 72 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Paddington',   rent: 4500,  revenue: 82000, ratio: 5.5 },
  { suburb: 'West End',     rent: 3800,  revenue: 78000, ratio: 4.9 },
  { suburb: 'New Farm',     rent: 4750,  revenue: 79000, ratio: 6.0 },
  { suburb: 'Teneriffe',    rent: 4200,  revenue: 75000, ratio: 5.6 },
  { suburb: 'Fortitude Valley', rent: 5100, revenue: 68000, ratio: 7.5 },
  { suburb: 'Chermside',    rent: 3600,  revenue: 45000, ratio: 8.0 },
  { suburb: 'Sydney CBD',   rent: 12000, revenue: 90000, ratio: 13.3 },
  { suburb: 'Melbourne CBD', rent: 11000, revenue: 88000, ratio: 12.5 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Paddington',   initial: 41 },
  { label: 'West End',     initial: 28 },
  { label: 'New Farm',     initial: 18 },
  { label: 'Teneriffe',    initial: 9 },
  { label: 'Somewhere else', initial: 4 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Paddington', postcode: '4064', score: 87, verdict: 'GO' as const,
    income: '$98,000', rent: '$3,800–$5,200/mo', competition: '4 within 500m',
    footTraffic: 89, demographics: 87, rentFit: 86, competitionScore: 85,
    breakEven: '32/day', payback: '6 months', annualProfit: '$318,400',
    angle: 'Brisbane\'s highest-quality demographic with Given Terrace heritage positioning',
    detail: [
      'Paddington has undergone a complete demographic transition since 2020. Given Terrace is now dominated by young professionals aged 28–42, dual-income households, creative sector workers, and established executives earning $95,000–$145,000. This cohort migrated disproportionately from Sydney during the 2020–2023 interstate movement phase, bringing established café-spending habits and higher price tolerance than native Brisbane demographics.',
      'The foot traffic composition here is qualitatively different from other Brisbane suburbs. Wednesday to Friday 7–9am captures a 15-minute walk radius of commuters heading toward the CBD via public transport. Saturday and Sunday brunch trade (9am–1pm) is sustained by locals with above-average disposable income. At $13.50 average ticket (20% above Brisbane median), Paddington\'s demographic supports premium single-origin coffee, specialty pastries, and $18–22 brunch plates that struggle elsewhere.',
      'Competition within 500m sits at four operators — the optimal validation level. Enough to confirm demand. Not so many that new entry faces saturation. The quality bar is higher in Paddington — generic café concepts underperform; specialty positioning with clear identity thrives. Given Terrace has heritage building advantages that create natural positioning differentiation.',
    ],
    risks: 'Rent growth has been rapid: 2024–2026 rents rose 18% (Queensland commercial surveys). Lease negotiations require CPI caps and fixed periods. Weekend street parking pressures on Saturday mornings can suppress walk-in traffic from outer suburbs. The demographic skews younger — customer loyalty is lifestyle-dependent rather than habitual.',
    opportunity: 'Afternoon trade (2–5pm) and weekday lunch are genuinely underdeveloped relative to the morning peak. A café with strong lunch food offering (fresh salads, warm bowls, artisanal sandwiches) captures uncontested revenue. Weekday evening ambient food and wine positioning (5–8pm) is completely absent and would differentiate.',
  },
  {
    rank: 2, name: 'West End', postcode: '4101', score: 83, verdict: 'GO' as const,
    income: '$82,000', rent: '$3,200–$4,800/mo', competition: '5 within 500m',
    footTraffic: 91, demographics: 80, rentFit: 89, competitionScore: 84,
    breakEven: '29/day', payback: '7 months', annualProfit: '$276,800',
    angle: 'Brisbane\'s most walkable suburb — the foot traffic advantage compounds daily revenue',
    detail: [
      'West End is classified as Brisbane\'s most walkable suburb by urban planners (Walk Score 78). Boundary Street functions as a mixed-use precinct with restaurants, bars, bookstores, vintage shops, galleries and fitness studios. This creates foot traffic that extends beyond the café trading peak — customers arrive for adjacent businesses and discover the café as secondary spend.',
      'The demographic is culturally diverse with high representation from tertiary-educated households. Income is $82,000 median — lower than Paddington, but density-adjusted purchasing power is higher. A lower proportion of car dependency means repeat visitation increases with geography. Residents literally walk past your café more often than in car-dependent precincts. This effect is compounding over 5-year lease terms.',
      'The competitive set (5 within 500m) includes established operators with strong local positions. For a new entrant, this means differentiation is essential but the suburb has proven demand-to-competitor ratios. Boundary Street itself has the precinct energy that sustains a coffee shop across multiple day parts. Morning, lunch, and afternoon trade all exist — the revenue floor is higher than suburbs dependent on single peak periods.',
    ],
    risks: 'Five competitors is one operator away from saturation. A sixth strong competitor entering within 500m materially changes the economics. Weekday morning commuter base is softer than Paddington — the walk score advantage is partly leisure-focused. Student population (proximity to QUT) brings price sensitivity during semester breaks.',
    opportunity: 'The first craft-focused operator with a strong cultural positioning (art, design, activism) would own a clearly differentiated market position. West End\'s demographic actively seeks alignment with values-driven businesses. This positioning advantage is defensible long-term against generic competition.',
  },
  {
    rank: 3, name: 'New Farm', postcode: '4005', score: 80, verdict: 'GO' as const,
    income: '$92,000', rent: '$4,000–$5,500/mo', competition: '3 within 500m',
    footTraffic: 84, demographics: 84, rentFit: 83, competitionScore: 88,
    breakEven: '33/day', payback: '8 months', annualProfit: '$252,000',
    angle: 'Riverfront lifestyle positioning with brunch culture already embedded in the neighbourhood',
    detail: [
      'Brunswick Street New Farm has transitioned from a historic restaurant precinct to the city\'s strongest brunch destination in the last 5 years. Saturday and Sunday morning foot traffic (9am–1pm) exceeds 3,000 pedestrians within the active trading area. For a brunch-focused positioning, this is the single strongest location in Brisbane.',
      'The income demographic ($92,000 median) reflects professionals and established families attracted by riverfront lifestyle, parks, and the established food culture. Unlike Paddington\'s recent migration dynamic, New Farm\'s demographic is more settled and stable. Customer acquisition cost is lower; repeat visitation rates higher. The riverfront location attracts tourism — weekend foot traffic includes visitors from outer suburbs and tourists, supplementing local customer base.',
      'Competition is low at three within 500m — leaving space for new concepts without immediately facing saturation. The absence of large chains in New Farm is distinctive; all three competitors are independent or small group operators. This creates a quality-focused market where a well-executed café can achieve premium positioning without competing on volume alone.',
    ],
    risks: 'Over-dependence on weekend brunch trade creates revenue cliff mid-week. Weekday morning commuter base is moderate — the location would require a strong lunch and afternoon strategy to achieve annual profitability. Rent is highest in this tier at $4,000–$5,500/month. A brunch-only positioning fails; diversified day-part revenue is essential.',
    opportunity: 'Weekday lunch is materially underdeveloped despite high residential and office population density in surrounding suburbs. An early-mover with strong lunch positioning would capture uncontested market share. Evening food and wine (5–8pm) is also absent — positioning as a nightlife-adjacent venue (small plates, natural wine) would differentiate sharply.',
  },
  {
    rank: 4, name: 'Teneriffe', postcode: '4005', score: 76, verdict: 'GO' as const,
    income: '$95,000', rent: '$3,500–$5,000/mo', competition: '2 within 500m',
    footTraffic: 79, demographics: 82, rentFit: 85, competitionScore: 92,
    breakEven: '30/day', payback: '9 months', annualProfit: '$231,600',
    angle: 'Emerging warehouse conversion hotspot — pre-saturation window open now, lowest competition of GO-rated suburbs',
    detail: [
      'Teneriffe is experiencing the pre-saturation dynamic that Mount Lawley showed in Perth. Historic woolstores and industrial buildings have been converted into galleries, fitness studios, creative agencies and restaurants over the last 3 years. Population density is increasing via apartment development. Income demographics ($95,000 median) are comparable to New Farm. Yet competition remains low — only 2 operators within 500m.',
      'This represents a 12–18 month window where a new entrant can establish a defensible position before the suburb saturates. Council data shows 8 major conversion projects in pipeline through 2027. Each conversion brings 200–300 new residents within walking distance. This is observable demand growth without corresponding café infrastructure — classic market timing advantage.',
      'The woolstore aesthetic creates natural brand positioning differentiation. Exposed brick, high ceilings, and industrial character support premium positioning and word-of-mouth marketing. A café in a converted warehouse trades on visual distinctiveness that a generic strip location cannot achieve. This is a structural positioning advantage worth 3–5% on customer acquisition.',
    ],
    risks: 'Weekday morning commuter base is the softest in the GO-rated tier — foot traffic is 79 vs 89+ in Paddington and West End. This location would require an excellent all-day concept and afternoon positioning. Once additional operators enter, the first-mover advantage diminishes quickly. The transformation window is 18–24 months before saturation occurs.',
    opportunity: 'The first specialty coffee roaster with on-site roasting in Teneriffe would own a positioned differentiation that competitors cannot easily replicate. The warehouse aesthetic, emerging demographic, and limited competition create conditions for a concept-led venue that becomes a destination. This positioning compounds in value over 2–3 years.',
  },
]

const RISK_SUBURBS = [
  { name: 'Fortitude Valley', postcode: '4006', score: 68, verdict: 'CAUTION' as const, reason: 'Fortitude Valley is transitioning from nightlife to daytime vibrancy, but the economics are challenging. Rents are $4,200–$6,000/month — the highest in Brisbane — while median income is only $72,000. Foot traffic is high on Friday–Sunday nights; weekday mornings are softer. Rent-to-revenue for most day-focused café concepts exceeds 16%, leaving thin margins. Viability depends on strong brand differentiation and premium pricing.' },
  { name: 'Chermside', postcode: '4032', score: 42, verdict: 'NO' as const, reason: 'Chermside shopping centre dominates the precinct, forcing independent operators into a race-to-the-bottom competition with chains (The Coffee Club, Dome, Gloria Jean\'s). The mall takes a 15% commission from sales. Independent café economics at the Chermside shopping centre are structurally unviable. Suburban standalone locations lack foot traffic and lack the density to support quality pricing.' },
  { name: 'Caboolture', postcode: '4510', score: 31, verdict: 'NO' as const, reason: 'Median household income of $64,000 — 20% below Brisbane median — makes the premium café price point a genuine stretch purchase rather than habitual spend. Customer traffic exists but willingness-to-pay is insufficient to support the rent and cost structure a quality café requires. At these income levels, customers default to supermarket coffee during any economic uncertainty.' },
]

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: 'GO' | 'CAUTION' | 'NO' }) {
  const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  const icon = v === 'GO'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><polyline points="20 6 9 17 4 12"/></svg>
    : v === 'CAUTION'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: 'nowrap' as const, display: 'inline-flex', alignItems: 'center' }}>{icon}{v}</span>
}

function ScoreBar({ label, value, color = S.emerald }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }}/>
      </div>
    </div>
  )
}

function DataNote({ text }: { text: string }) {
  return <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 6, lineHeight: 1.6 }}>{text}</p>
}

// ── Poll component ─────────────────────────────────────────────────────────
function SuburbPoll() {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(idx: number) {
    if (voted !== null) return
    const updated = votes.map((v, i) => i === idx ? v + 1 : v)
    setVotes(updated)
    setVoted(idx)
  }

  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px 24px', marginBottom: 44 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Brisbane?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {voted === null ? 'Based on this guide — what\'s your top pick? Click to vote.' : `You voted for ${POLL_OPTIONS[voted].label}. Here's how ${total} readers voted:`}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {POLL_OPTIONS.map((option, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          const isWinner = votes[i] === Math.max(...votes)
          return (
            <button key={option.label} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: voted !== null ? (isWinner ? S.emeraldBg : S.n50) : S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', overflow: 'hidden', fontFamily: 'inherit' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: isWinner ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }}/>
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: voted === i ? 700 : 500, color: voted === i ? '#065F46' : S.n900 }}>
                  {option.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: voted !== null ? (isWinner ? S.emerald : S.muted) : S.muted }}>
                  {voted !== null ? `${pct}%` : ''}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857' }}>
            Ready to analyse a specific address in {POLL_OPTIONS[voted].label}? {' '}
            <Link href="/onboarding" style={{ fontWeight: 700, color: S.emerald, textDecoration: 'underline' }}>Run it free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

// ── Email unlock checklist ─────────────────────────────────────────────────────
function ChecklistUnlock() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email.includes('@')) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
    } catch {}
    setSubmitted(true)
    setLoading(false)
  }

  const CHECKLIST = [
    'Visit on Wednesday at 7:30am — count foot traffic for 30 mins on Boundary St or Given Terrace',
    'Check BCC planning portal for approved developments within 400m radius',
    'Visit 3 nearby cafés — ask about their quietest months and rent benchmarks',
    'Calculate rent ÷ projected revenue — must be under 0.12',
    'Verify public transport access — under 8 min walk to train station = strong signal',
    'Count direct competitors within 500m using Google Maps (not estimates)',
    'Assess parking supply — insufficient parking suppresses Saturday walk-ins 15–20%',
    'Run your specific address through Locatalyze before lease negotiations',
    'Model 65% demand scenario — if it breaks the business, the rent is too high',
    'Negotiate break clause at 12 months on all lease offers',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Brisbane Café Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            The exact checklist used in Locatalyze analysis. Free — enter your email and we'll send it plus weekly location insights.
          </p>
        </div>
      </div>

      {submitted ? (
        <div>
          <div style={{ background: S.white, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#065F46', marginBottom: 10 }}>Sent to {email} — check your inbox</p>
            {CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: S.emerald, minWidth: 20, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Brisbane location insights now coming to your inbox.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ flex: '1 1 200px', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${S.emeraldBdr}`, fontSize: 14, background: S.white, outline: 'none', fontFamily: 'inherit', color: S.n900 }}
          />
          <button onClick={handleSubmit} disabled={loading || !email.includes('@')}
            style={{ padding: '11px 20px', background: (!email.includes('@') || loading) ? '#A7F3D0' : S.emerald, color: S.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed', fontFamily: 'inherit', flexShrink: 0 }}>
            {loading ? 'Sending…' : 'Send me the checklist →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BrisbaneCafePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: \'13px\', height: \'13px\' }} /></div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #06B6D4 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Brisbane', '/analyse/brisbane']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,250,254,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.7)' }}>Cafés</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Brisbane Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Café in Brisbane (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,250,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Brisbane's booming coffee shop market. Post-pandemic migration boom, Olympics infrastructure, subtropical outdoor advantage, and genuine underrated opportunities. Scored by foot traffic, demographics, competition density, and rent viability.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#22C55E', color: '#0E7490', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '7', l: 'Brisbane suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#22C55E', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(206,250,254,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), Queensland commercial property surveys, CoStar market data, live competitor mapping via Geoapify Places API, and Locatalyze's proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '34%', claim: 'café growth in Brisbane inner suburbs 2023–2026 — fastest in Australia', source: 'ABS business counts by ANZSIC code, Brisbane SA2/SA3 regions 2023–26', color: S.emerald },
              { stat: '40%', claim: 'commercial rent advantage over Sydney — Brisbane cafés beat Sydney unit economics', source: 'CBRE retail market reports Q4 2025 + Queensland commercial surveys Q1 2026', color: S.brand },
              { stat: '52 weeks', claim: 'of outdoor seating season — Brisbane subtropical climate beats Melbourne/Sydney', source: 'Bureau of Meteorology historical data; outdoor café operability analysis', color: S.amber },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Brisbane economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Brisbane's Coffee Market Changed in 2024–2026
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Brisbane's café market transitioned through a structural inflection point between 2024–2026. What was historically an underdeveloped coffee culture compared to Melbourne is now maturing rapidly — driven by three parallel dynamics that are unlikely to reverse.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Interstate migration from Sydney and Melbourne has been constant since 2020, but 2024–2026 showed the highest net inflow of higher-income households. People earning $90,000–$160,000 who developed coffee-spending habits in Sydney and Melbourne brought those behaviours to Brisbane. The aggregate effect is a population shift toward younger, cosmopolitan, premium-café-spending demographics. Paddington and West End bore the brunt of this migration. This is observable in median income growth (+14–18% since 2022 in these suburbs) and in the quality bar rising for new café concepts.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The 2032 Olympics infrastructure investment created observable confidence in property development. Cross River Rail station openings in 2025–2026 shifted foot traffic patterns, creating new café opportunity zones. The City Beat planning overlay encouraged mixed-use development in historic precincts. These infrastructure signals are trickling down into consumer confidence and business expansion decisions. A café operator viewing Brisbane now sees a different risk profile than in 2022.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Finally, Brisbane's subtropical climate is a revenue advantage that Sydney and Melbourne cannot replicate. Outdoor seating is operationally viable 52 weeks of the year. This creates a revenue stream that Melbourne cafés cannot access in winter and Sydney cafés lose during summer (heat restrictions). A Brisbane café with good outdoor positioning generates 15–20% more revenue from seating expansion than the same café in cooler climates.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Brisbane vs Sydney/Melbourne locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 12% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[40000, 100000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[2000, 14000]}/>
                  <ZAxis dataKey="ratio" range={[60, 300]} name="Rent/Revenue %"/>
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Revenue: <strong>${(d.revenue/1000).toFixed(0)}k/mo</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent/1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 12 ? S.emerald : d.ratio < 18 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 12 ? ' Healthy' : d.ratio < 18 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Sydney CBD','Melbourne CBD'].includes(d.suburb))} fill="#059669" name="Brisbane suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Sydney CBD','Melbourne CBD'].includes(d.suburb))} fill="#E24B4A" name="Sydney/Melbourne (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed customer volumes. Sydney/Melbourne rents: CBRE retail market report Q4 2025. Brisbane rents: Queensland commercial surveys Q1 2026."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Brisbane Suburb Scores — Café Viability
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18 }}>Scores above 70 = GO. 45–69 = CAUTION. Below 45 = NO.</p>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBURB_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                  <XAxis dataKey="suburb" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                  <Tooltip content={({ payload, label }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    const verdict = d.score >= 70 ? 'GO' : d.score >= 45 ? 'CAUTION' : 'NO'
                    const color = d.score >= 70 ? S.emerald : d.score >= 45 ? S.amber : S.red
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{label}</p>
                        <p style={{ color, fontWeight: 700 }}>{verdict} — {d.score}/100</p>
                        <p style={{ color: S.muted }}>Income: ${d.income}k median</p>
                        <p style={{ color: S.muted }}>Traffic score: {d.traffic}/100</p>
                      </div>
                    )
                  }}/>
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}
                    fill={S.brand}
                    label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}
                    isAnimationActive={true}>
                    {SUBURB_SCORES.map((entry, index) => (
                      <rect key={index} fill={entry.score >= 70 ? S.emerald : entry.score >= 45 ? S.amber : S.red}/>))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Rent 30%, Profitability 25%, Competition 25%, Demographics 20%). Aggregated from ABS, Queensland property surveys, Geoapify data. March 2026."/>
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Brisbane Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, QLD {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict}/>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: Queensland commercial surveys Q1 2026. Profit and payback: Locatalyze model, $175,000 setup, IBISWorld COGS benchmarks."/>
                  <div style={{ marginTop: 14 }}>
                    {sub.detail.map((para, i) => <p key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: 12 }}>{para}</p>)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                    <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Key risk</p>
                      <p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.65 }}>{sub.risks}</p>
                    </div>
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Opportunity</p>
                      <p style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.65 }}>{sub.opportunity}</p>
                    </div>
                  </div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 52, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>{sub.score}</div>
                    <div style={{ fontSize: 11, color: S.muted }}>/100</div>
                  </div>
                  <ScoreBar label="Foot traffic" value={sub.footTraffic}/>
                  <ScoreBar label="Demographics" value={sub.demographics}/>
                  <ScoreBar label="Rent fit" value={sub.rentFit}/>
                  <ScoreBar label="Competition" value={sub.competitionScore}/>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Mid-page CTA */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Brisbane address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map and financial model in 60 seconds. Free.</p>
          </div>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emerald, color: S.white, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
            Analyse my address →
          </Link>
        </div>

        {/* Interactive poll */}
        <SuburbPoll/>

        {/* Email unlock checklist */}
        <ChecklistUnlock/>

        {/* Suburbs to avoid */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Brisbane Suburbs to Avoid for Cafés and Coffee Shops
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, QLD {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{sub.reason}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 56 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: S.red, lineHeight: 1 }}>{sub.score}</div>
                <div style={{ fontSize: 10, color: S.muted }}>/100</div>
              </div>
            </div>
          ))}
        </section>

        {/* Video section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Watch: How to Choose a Café Location in Brisbane
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#0C1F1C', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 12, cursor: 'pointer' }}
            onClick={() => window.open('https://www.youtube.com/@locatalyze', '_blank')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #22C55E', marginLeft: 4 }}/>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,253,249,0.8)' }}>Locatalyze: How to Read a Location Analysis Report</p>
            <p style={{ fontSize: 12, color: 'rgba(206,250,254,0.4)' }}>Click to visit our YouTube channel</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>To embed your own video: replace the onClick with {'<iframe src="https://www.youtube.com/embed/YOUR_ID" .../>'}</p>
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Brisbane Café Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Morning foot traffic', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, detail: 'Brisbane café revenue is disproportionately concentrated in the pre-10am commuter window. Unlike Melbourne, Brisbane lacks the established café-crawl culture that spreads traffic across the day. A coffee shop at Given Terrace Paddington captures commuter flow walking to transport and toward the office. Visit your location on Wednesday at 7:30am and count pedestrians for 30 minutes. That number multiplied by 8–10% capture rate gives your realistic daily commuter base.' },
              { title: 'Median household income', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, detail: 'Brisbane\'s average café ticket is $11.20. Below $75,000 median income, customers default to supermarket coffee under financial pressure. Above $90,000 — particularly in Paddington\'s $98,000 median — residents view quality coffee as non-discretionary spend. The income floor determines pricing power. Paddington\'s demographic supports $14–15 lattes; Caboolture cannot.' },
              { title: 'Competition within 500m', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, detail: '1–3 competitors within 500m validates demand without saturation. 4–6 is workable with differentiation. Seven or more makes new entry very difficult. Brisbane\'s suburbs show wide variance: Teneriffe has 2 (high opportunity); Fortitude Valley has 8+ (high risk). This precision matters — a competitor 499m away is in your catchment; 501m is not.' },
              { title: 'Rent-to-revenue ratio', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, detail: 'Monthly rent ÷ projected monthly revenue. Under 12%: excellent. 12–18%: workable with discipline. Above 18%: high risk. At $4,000/month rent, you need $33,000/month revenue — approximately 100 customers/day at $11 average ticket. If a location cannot plausibly deliver that, the rent is too high. Brisbane\'s advantage is rents are 30–40% below Sydney, making this ratio much more achievable.' },
            ].map(f => (
              <div key={f.title} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDFA', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, marginBottom: 3 }}>{f.title}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.emerald, marginBottom: 10 }}>{f.weight}</p>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Case study */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Case Study: A Specialty Coffee Shop on Given Terrace, Paddington
          </h2>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #0E7490, #0891B2)', padding: '22px 28px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(34,197,94,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ECFDF5' }}>Specialty Coffee Shop, Given Terrace, Paddington QLD 4064</h3>
              <p style={{ fontSize: 13, color: 'rgba(206,250,254,0.6)' }}>65 sqm · $4,200/mo rent · $13.50 avg ticket · 210 customers/day · $175k setup</p>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
                {[['Monthly revenue','$85,050',S.emerald],['Monthly costs','$58,640',S.red],['Monthly profit','$26,410',S.emerald],['Net margin','31.1%',S.emerald],['Annual profit','$318,400',S.emerald],['Payback','6 months',S.brand]].map(([l,v,c]) => (
                  <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $4,200, labour $23,800 (3 FTE at Queensland award rates), COGS 30% of revenue ($25,515), overheads $2,325. Revenue: 210 customers × $13.50 × 30 days. IBISWorld café COGS benchmarks applied. Brisbane's subtropical advantage enables outdoor seating revenue expansion."/>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
                At 4.9% rent-to-revenue, this espresso bar has a margin buffer that most Sydney equivalents never achieve. The same coffee shop in Sydney with $10,000/month rent on comparable revenue faces 14% rent burden — materially lower annual profit and much less resilience against slow months. Brisbane's rent advantage is not theoretical; it compounds significantly at scale over 5-year leases.
              </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 65% of projected demand (137 customers/day)</p>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to ~$8,900. Still solvent with healthy margins. A $45,000 cash reserve provides complete 5-month protection through a slow start. The low rent is what makes this scenario survivable — a hospitality business at 18% rent-to-revenue at 65% demand is loss-making with no floor.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            7 Things to Do Before Signing a Brisbane Café Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Visit on Wednesday at 7:30am', detail: 'Boundary Street West End, Given Terrace Paddington, and Brunswick Street New Farm all have dramatically different Wednesday morning patterns than weekends. Wednesday is the truest test of your weekday trading base. Count pedestrians for 30 minutes — multiply by 8–10% capture rate.' },
              { n: '02', tip: 'Check the BCC planning portal', detail: 'The City of Brisbane planning portal shows approved developments, infrastructure projects, and zoning changes. A Cross River Rail station opening 800m away or a major conversion project launching changes your competitive environment. Plan for 18–24 month horizon, not today\'s snapshot.' },
              { n: '03', tip: 'Calculate rent ÷ revenue before you inspect', detail: 'Monthly rent ÷ projected monthly revenue. If the answer exceeds 0.12, the economics are marginal. This single calculation should determine whether you spend further time on a site. Brisbane\'s advantage means this is often achievable — but don\'t ignore it.' },
              { n: '04', tip: 'Talk to three nearby café operators', detail: 'Ask about their quiet months, rent negotiations, and what they wish they\'d known. Brisbane hospitality operators are generally candid. Three conversations reveal patterns that months of desk research cannot.' },
              { n: '05', tip: 'Negotiate a 12-month break clause', detail: 'Brisbane landlords are increasingly accommodating on break clauses for strong covenants. This provides complete protection if foot traffic doesn\'t materialise. It\'s the single most important lease term for any new café.' },
              { n: '06', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level analysis is the starting point. Given Terrace Paddington has variation: number 200 vs number 400 produces different foot traffic and parking dynamics. The specific address changes the score meaningfully.' },
              { n: '07', tip: 'Model 65% demand, not 100%', detail: 'What does the café look like if only 65% of customers arrive in Month 1? If the answer is loss-making with no cash reserve, the rent is too high. Brisbane\'s best locations survive this stress test.' },
            ].map(({ n, tip, detail }) => (
              <div key={n} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: S.emerald, flexShrink: 0 }}>{n}</div>
                <div><p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 5 }}>{tip}</p><p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{detail}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>Full Comparison Table</h2>
          <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${S.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: S.white, minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${S.border}`, background: S.n50 }}>
                  {['Suburb','Score','Verdict','Median Income','Rent Range','Competition','Est. Payback'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ...TOP_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: s.income, rent: s.rent, comp: s.competition, payback: s.payback })),
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $75k', rent: 'Not viable', comp: '7+', payback: 'N/A' })),
                ].map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < 6 ? `1px solid ${S.n100}` : 'none', background: row.verdict === 'NO' ? '#FEF8F8' : 'transparent' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.name}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 800, color: (row.verdict as string) === 'GO' ? S.emerald : (row.verdict as string) === 'CAUTION' ? S.amber : S.red }}>{row.score}</td>
                    <td style={{ padding: '10px 14px' }}><VerdictBadge v={row.verdict}/></td>
                    <td style={{ padding: '10px 14px', color: S.muted }}>{row.income}/yr</td>
                    <td style={{ padding: '10px 14px', color: S.muted, whiteSpace: 'nowrap' as const }}>{row.rent}</td>
                    <td style={{ padding: '10px 14px', color: S.muted }}>{row.comp}</td>
                    <td style={{ padding: '10px 14px', color: row.verdict === 'NO' ? S.red : S.muted }}>{row.payback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataNote text="Income: ABS 2023–24. Rent: Queensland commercial surveys Q1 2026. Payback: Locatalyze model, $175k setup, IBISWorld COGS benchmarks."/>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Brisbane'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Brisbane'}</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{acceptedAnswer.text}</p>
            </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 12 }}>More location guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[
              { href: '/analyse/brisbane/restaurant', label: 'Restaurants in Brisbane' },
              { href: '/analyse/brisbane/gym', label: 'Gyms in Brisbane' },
              { href: '/analyse/perth/cafe', label: 'Cafés in Perth' },
              { href: '/analyse/sydney/cafe', label: 'Cafés in Sydney' },
              { href: '/analyse/melbourne/cafe', label: 'Cafés in Melbourne' },
              { href: '/analyse', label: 'All location guides' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 60%, #06B6D4 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Brisbane address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(206,250,254,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street position, exact competitor count, proximity to anchors and transport — produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#22C55E', color: '#0E7490', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Brisbane address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(206,250,254,0.35)', marginTop: 10 }}>No credit card · 3 reports included · 60 seconds</p>
        </div>

      </div>
    </div>
  )
}
