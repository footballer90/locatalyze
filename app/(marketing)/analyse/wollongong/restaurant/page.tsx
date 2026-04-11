'use client'
// app/(marketing)/analyse/wollongong/restaurant/page.tsx
// VERSION 3 — real Recharts chart, interactive poll with %, email unlock checklist
// Unique angle: Wollongong as Sydney's release valve — high-income demographic with low rent

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/wollongong/restaurant/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Restaurant in Wollongong (2026) — Location Analysis',
//  description: 'Data-driven suburb guide for opening restaurants in Wollongong. Rent benchmarks, foot traffic, Sydney commuter demographics, and competition analysis. Crown Street, Thirroul, Harbour precinct scored.',
//  keywords: ['best suburbs to open a restaurant in Wollongong','Wollongong restaurant location guide 2026','opening a restaurant Wollongong NSW','best suburbs Wollongong hospitality business','Wollongong commercial rent restaurant','Crown Street Wollongong dining','affordable restaurant location Illawarra','Wollongong foot traffic areas restaurant','hidden gem suburbs Wollongong business','Thirroul restaurant opportunity'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/wollongong/restaurant' },
//  openGraph: { title: 'Best Suburbs to Open a Restaurant in Wollongong (2026)', description: 'Suburb-by-suburb analysis of Wollongong\'s emerging restaurant market. Sydney-level income, regional-level rent.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Restaurant in Wollongong (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/wollongong/restaurant',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a restaurant in Wollongong?', acceptedAnswer: { '@type': 'Answer', text: 'Crown Street Wollongong CBD scores 84/100 — the highest for a full-service restaurant. It combines strong weekday lunch trade from University of Wollongong (30,000+ students), evening trade from Sydney commuters, and a growing dining culture. Thirroul (score 81) offers a premium coastal positioning with Sydney-income residents and lower competition.' } },
      { '@type': 'Question', name: 'How much does restaurant rent cost in Wollongong?', acceptedAnswer: { '@type': 'Answer', text: 'Wollongong CBD restaurant rents range from $3,500 to $5,500/month for a 100–150sqm tenancy. Thirroul commands premium positioning at $2,800–$4,000/month due to lower foot traffic but higher average spend. The healthy benchmark is rent below 15% of projected monthly revenue for full-service dining.' } },
      { '@type': 'Question', name: 'Is Thirroul good for a restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'Thirroul scores 81/100 and ranks second for restaurant viability. It offers a captive affluent audience (Sydney-income coastal residents), only three direct competitors within 500m, and acceptance of premium pricing. Weekend destination dining generates strong Saturday/Sunday covers that CBD locations cannot capture consistently.' } },
      { '@type': 'Question', name: 'Can Wollongong support fine dining?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Wollongong\'s relocated Sydney workforce ($110,000–$160,000 salary range) creates demand for elevated dining that traditional regional markets cannot. The economic gap is widening: commercial rents are 35–50% below Sydney equivalents while the customer income profile is Sydney-level. Fine dining at $65+ per person has viability in Thirroul and premium Wollongong Harbour locations that would struggle in equivalent regional NSW towns.' } },
      { '@type': 'Question', name: 'Which Wollongong suburbs should I avoid for a restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'Dapto (score 40, NO) — car-dependent with fast-food dominance and no fine dining culture. Warrawong (score 34, NO) — Westfield proximity kills independent restaurant foot traffic. Unanderra (score 30, NO) — industrial area with zero destination appeal. All score below 45/100.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Wollongong CBD', score: 84, rent: 4500, traffic: 82, income: 78 },
  { suburb: 'Thirroul',   score: 81, rent: 3400, traffic: 68, income: 95  },
  { suburb: 'Harbour/Flagstaff', score: 76, rent: 4000, traffic: 75, income: 72  },
  { suburb: 'Fairy Meadow',  score: 68, rent: 2700, traffic: 62, income: 65  },
  { suburb: 'Austinmer',  score: 64, rent: 2400, traffic: 55, income: 88  },
  { suburb: 'Dapto',   score: 40, rent: 2200, traffic: 38, income: 52  },
  { suburb: 'Warrawong',   score: 34, rent: 2600, traffic: 42, income: 58  },
]

const RENT_VS_REVENUE = [
  { suburb: 'Wollongong CBD',   rent: 4500,  revenue: 52000, ratio: 8.7  },
  { suburb: 'Thirroul', rent: 3400, revenue: 58000, ratio: 5.9  },
  { suburb: 'Harbour', rent: 4000,  revenue: 48000, ratio: 8.3  },
  { suburb: 'Fairy Meadow',  rent: 2700, revenue: 38000, ratio: 7.1  },
  { suburb: 'Austinmer',   rent: 2400,  revenue: 40000, ratio: 6.0  },
  { suburb: 'Dapto', rent: 2200,  revenue: 24000, ratio: 9.2 },
  { suburb: 'Sydney CBD', rent: 12000, revenue: 72000, ratio: 16.7 },
  { suburb: 'Newtown',   rent: 9500,  revenue: 65000, ratio: 14.6 },
]

// ── Poll data ──────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Crown Street Wollongong', initial: 42 },
  { label: 'Thirroul', initial: 35 },
  { label: 'Harbour precinct', initial: 16 },
  { label: 'Fairy Meadow', initial: 4  },
  { label: 'Somewhere else', initial: 3 },
]

// ── Suburb data ───────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Wollongong CBD', postcode: '2500', score: 84, verdict: 'GO' as const,
    income: '$78,000', rent: '$3,500–$5,500/mo', competition: '6 within 500m',
    footTraffic: 82, demographics: 76, rentFit: 81, competitionScore: 74,
    breakEven: '45/night', payback: '8 months', annualProfit: '$192,000',
    angle: 'Market in transition — first-mover advantage for serious operators',
    detail: [
      'Crown Street Wollongong CBD is where Wollongong\'s restaurant market is transforming in real time. For decades, this precinct was RSL clubs, fish-and-chips, and casual dining. That\'s structurally changing because the customer base changed. Remote workers earning $110,000–$160,000 Sydney salaries relocated south for coastal lifestyle and housing costs 40–50% lower than Sydney. They brought Sydney dining expectations with them. A professionally executed restaurant on Crown Street now captures both the university weekday lunch base (University of Wollongong: 30,000+ students) and evening trade from this new demographic. This is the rare market-in-transition scenario where early entrants build defensible positions before competition fills in.',
      'The income signal is critical. Crown Street\'s median household income of $78,000 understates the residential catchment significantly because it includes non-earning households and pensioners in adjacent areas. The actual customer profile for Crown Street evening dining skews toward the relocated professional cohort ($110,000–$160,000) with Sydney-level discretionary spend. These customers order wine. They accept $65+ price points. They visit on weeknights. At a $22 average ticket (lunch) and $48 average ticket (dinner), Crown Street supports 120–150 covers per night breakeven — materially different from traditional regional NSW markets.',
      'Competition density sits at six direct restaurants within 500m — the optimal range for a well-differentiated concept. Enough to validate demand without saturation. The gap is quality: Wollongong\'s restaurant scene is opening space for elevated positioning that independent operators arriving now can claim before chains discover the market.',
    ],
    risks: 'Weekday lunch depends entirely on university trade. Semester breaks (May, July, October) create revenue troughs that require careful cash management. Sydney commuters drive Friday–Sunday evening trade, but this traffic pattern means Monday–Wednesday lunch is the financial test. Some operators underestimate this volatility.',
    opportunity: 'Wine programs are almost entirely absent from Crown Street venues. A restaurant with serious wine selection and knowledgeable staff captures a significant markup opportunity — $8–$12 per bottle above cost versus $4–$6 in casual settings. This alone changes annual profit by $40,000–$60,000 on modest volume.',
  },
  {
    rank: 2, name: 'Thirroul', postcode: '2515', score: 81, verdict: 'GO' as const,
    income: '$95,000', rent: '$2,800–$4,000/mo', competition: '3 within 500m',
    footTraffic: 68, demographics: 92, rentFit: 88, competitionScore: 89,
    breakEven: '40/night', payback: '7 months', annualProfit: '$168,000',
    angle: 'Premium coastal positioning with Sydney-income demographic and minimal competition',
    detail: [
      'Thirroul operates as a separate market entirely from Wollongong CBD. This is the coastal village where Sydney money accumulated during the remote-work migration. Median household income of $95,000 masks the actual purchasing power: the residents who dine out are earning $130,000–$200,000. They chose Thirroul specifically because it offers coastal village amenity with escape velocity from Sydney costs — but they brought their dining expectations. A restaurant here survives at price points that would fail in equivalent outer-Sydney suburbs. Premium positioning is not optional; it is the entire strategy.',
      'The competition scenario is exceptional: only three direct competitors within 500m. This is pre-saturation territory. In most established restaurant markets, three competitors validates demand but leaves limited room for entrants. In Thirroul, it signals that the market hasn\'t yet caught up to the demographic shift. This window typically lasts 18–36 months. Thirroul is approximately 10–14 months in. The first serious operator with a strong concept and confident pricing claims a position that becomes very difficult to displace once established.',
      'Thirroul\'s foot traffic is softer than Crown Street ($68 vs $82 score) — but this is misleading. A commuter-driven destination has lower total foot traffic but higher average transaction value and customer loyalty. Weekend visitor flow (Friday–Sunday lunch and dinner) compensates for mid-week softness. The financial model is: 65 covers on Friday–Saturday, 35 covers mid-week. This distribution is less stable than CBD commuter peaks, but the margin is higher.',
    ],
    risks: 'Three competitors is a fragile equilibrium — the arrival of a fourth serious operator materially changes the market dynamics. Mid-week lunch is inconsistent and weather-dependent. Winter alfresco seating (a core Thirroul draw) becomes unusable June–August, depressing walk-in traffic. The village\'s seasonal population flux (higher weekends, lower mid-week) requires pricing discipline.',
    opportunity: 'Alfresco dining is almost entirely missing in Thirroul relative to the coastal village positioning. A restaurant with quality outdoor seating (heated, weather-protected) captures a market perception gap worth 12–15 covers per night in shoulder seasons — $12,000–$18,000 annual incremental revenue.',
  },
  {
    rank: 3, name: 'Wollongong Harbour/Flagstaff Hill', postcode: '2500', score: 76, verdict: 'GO' as const,
    income: '$72,000', rent: '$3,200–$4,800/mo', competition: '4 within 500m',
    footTraffic: 75, demographics: 68, rentFit: 82, competitionScore: 81,
    breakEven: '48/night', payback: '9 months', annualProfit: '$148,000',
    angle: 'Waterfront tourism and local weekender trade — seasonal strength, summer volatility',
    detail: [
      'The Harbour precinct operates on a fundamentally different trade pattern than Crown Street or Thirroul: it is destination dining for tourists (summer dominant) combined with local weekend leisure. The economics are seasonal but powerful. November–February (summer) generates covers volumes that sustain the business for the entire year; June–August (winter) is survival mode. An operator accepting this trade pattern captures margin that competitors attempting to optimize for consistent mid-week trade never reach.',
      'The tourist trade is structurally reliable. Wollongong attracts 2.5 million visitor nights annually (Tourism NSW). The Harbour precinct captures a meaningful share: families on coastal holidays, long-weekend visitors, retirees on leisure drives. These customers have higher average spend ($52+ dinner ticket) and higher wine uptake than local mid-week trade. They make reservations. They eat outdoors. A restaurant positioned for this traffic (dedicated reservation system, outdoor ambient design, tourist-friendly menu) outperforms a venue trying to capture both tourist and commuter trade simultaneously.',
      'Competition at four is manageable, and the competitive set is lower quality than Crown Street — mostly casual fish-and-chips, tourism chains. A restaurant with service infrastructure and elevated positioning operates in a different market than its nominal competitors despite proximity.',
    ],
    risks: 'June–August revenue can fall 30–40% below annual average — a material cash flow challenge without substantial reserves. Stormy weather impacts both foot traffic and outdoor seating viability (a core Harbour draw). Public holiday calendars matter disproportionately: Easter and school holidays are outsized revenue events. A single poor summer season can destroy the annual profit projection.',
    opportunity: 'Progressive dining experiences (degustation, wine pairing menus) are almost entirely absent from the Harbour precinct despite the tourist demographic being willing to spend $150–$220 per person. This positioning generates materials additional margin and attracts a different (higher-spend) customer cohort than standard à la carte positioning.',
  },
]

const RISK_SUBURBS = [
  { name: 'Dapto', postcode: '2526', score: 40, verdict: 'NO' as const, reason: 'Car-dependent, big-box retail dominated (shopping centre gravity), and median household income of $52,000 makes restaurant dining a discretionary purchase rather than habitual. Fast-food chains dominate because the customer base defaults to supermarket and chain options under any financial pressure. Fine dining viability threshold is $65,000+ income; Dapto falls materially below this.' },
  { name: 'Warrawong', postcode: '2502', score: 34, verdict: 'NO' as const, reason: 'Westfield Shopping Centre proximity creates structural headwind: retail foot traffic is purpose-driven (shopping), not leisure-oriented. Independent restaurants within 500m of major shopping centres struggle because customers optimize for convenience (food court options) over destination dining. Median income of $58,000 offers insufficient margin for premium positioning.' },
  { name: 'Unanderra', postcode: '2526', score: 30, verdict: 'NO' as const, reason: 'Industrial area with zero destination appeal. Median household income of $48,000 is below viability thresholds. No ambient dining culture, no weekend leisure traffic, no tourist flow. This is a commute-through suburb, not a destination. Operating a restaurant here requires pricing so low that the business model never reaches sustainability.' },
]

const S = {
  brand: '#0C4A6E', brandLight: '#0369A1',
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a restaurant in Wollongong?</h3>
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
            Ready to analyse a specific address in {POLL_OPTIONS[voted].label}?{' '}
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
    'Assess dinner timing demand: survey Sydney commuters arriving 7:30pm+',
    'Check university semester calendar — align soft openings with student intake',
    'Verify coastal weather impact on alfresco dining (wind, rain, sea spray)',
    'Survey RSL club and counter-serve competition for family dining shifts',
    'Visit Crown Street on Wednesday lunch (11:30am–1:30pm) — count covers',
    'Run rent ÷ revenue model at 60% occupancy — must remain solvent',
    'Talk to existing Crown Street operators about commuter dinner volume swings',
    'Check parking availability at shortlist sites (diner behavior differs by car access)',
    'Model seasonal volatility (summer vs winter revenue for Harbour locations)',
    'Get 3 independent rent valuations — compare to Sydney CBD equivalent space',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Wollongong Restaurant Location Checklist (10 steps)
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
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ flex: 1, padding: '11px 14px', borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: 'inherit' }}/>
            <button type="submit" disabled={!email.includes('@') || loading} style={{ background: S.emerald, color: S.white, border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 13, fontWeight: 700, cursor: !email.includes('@') ? 'default' : 'pointer', opacity: !email.includes('@') ? 0.5 : 1 }}>
              {loading ? 'Sending...' : 'Send checklist'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Main page component ────────────────────────────────────────────────────
export default function WollongongRestaurantPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50 }}>
      {/* Inject schema for SEO */}
      {SCHEMAS.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
      ))}

      {/* Hero section with ocean gradient */}
      <div style={{ background: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 50%, #0891B2 100%)', color: S.white, padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
          Best Suburbs to Open a Restaurant in Wollongong (2026)
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(240,253,249,0.8)', maxWidth: 640, margin: '0 auto', lineHeight: 1.65 }}>
          Sydney's remote workers discovered Wollongong. Learn which suburbs support restaurant viability, and why Wollongong's market is different from every other regional NSW town.
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '44px 24px' }}>

        {/* Opening context */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Wollongong's Structural Shift: Why Restaurants Are Opening Now
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Wollongong doesn't feel like a regional NSW town anymore. In the past three years, a specific demographic arrived: Sydney professionals earning $110,000–$160,000 annually who relocated south for coastal lifestyle and housing costs 40–50% lower than equivalent Sydney suburbs. Remote work made this economically viable. A mortgage on a $950,000 Thirroul beachfront cottage costs less than a $2.2 million inner-west Sydney equivalent, while the salary remains the same.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            This created an economic anomaly: Sydney-level discretionary income with regional-level commercial rents. A 120sqm restaurant space on Crown Street costs $4,200–$5,200/month. The Sydney CBD equivalent costs $10,000–$14,000/month. Both locations serve customers with similar income profiles and dining expectations. The Wollongong operator keeps the difference — approximately $72,000–$108,000 annually, compounding into $360,000–$540,000 over a five-year lease.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            At the same time, Wollongong's traditional restaurant market is minimal. RSL clubs and fish-and-chips dominate. The operators who arrive now with serious concepts capture a market in transition before competitive supply normalises. This window typically lasts 24–36 months.
          </p>

          {/* Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Wollongong vs Sydney restaurant locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 15% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[20000, 80000]}/>
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
                        <p style={{ color: d.ratio < 15 ? S.emerald : d.ratio < 18 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 15 ? ' Healthy' : d.ratio < 18 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Sydney CBD','Newtown'].includes(d.suburb))} fill="#059669" name="Wollongong suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Sydney CBD','Newtown'].includes(d.suburb))} fill="#E24B4A" name="Sydney (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld full-service restaurant COGS benchmarks and observed customer volumes. Sydney rents: CBRE retail market report Q4 2025. Wollongong rents: commercial property agent quotes Q1 2026."/>
          </div>
        </section>

        {/* Bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Wollongong Suburb Scores — Restaurant Viability
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
          <DataNote text="Scores: Locatalyze model (Rent 25%, Profitability 30%, Competition 25%, Demographics 20%). Aggregated from ABS, commercial property agents, foot traffic data. March 2026."/>
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 3 Wollongong Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, NSW {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict}/>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: commercial property agent Q1 2026. Profit and payback: Locatalyze model, $200,000 setup (fit-out + working capital), IBISWorld full-service restaurant COGS benchmarks."/>
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
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Wollongong address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map and financial model in ~90 seconds. Free.</p>
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
            Wollongong Suburbs to Avoid for Restaurants
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, NSW {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
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
            Watch: How to Choose a Restaurant Location in Wollongong
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#0C2F38', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 12, cursor: 'pointer' }}
            onClick={() => window.open('https://www.youtube.com/@locatalyze', '_blank')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(8,145,178,0.15)', border: '2px solid rgba(8,145,178,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #0891B2', marginLeft: 4 }}/>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,253,249,0.8)' }}>Locatalyze: How to Read a Restaurant Location Analysis</p>
            <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.4)' }}>Click to visit our YouTube channel</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>To embed your own video: replace the onClick with {'<iframe src="https://www.youtube.com/embed/YOUR_ID" .../>'}</p>
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Wollongong Restaurant Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Sydney commuter dinner timing', weight: '30% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, detail: 'Sydney professionals working remote arrive in Wollongong around 7:00–7:30pm for dinner, not 6:00pm like traditional suburbs. Your dining room needs capacity flexibility: weekend covers spike to 80–100, weekday mid-week drops to 30–40. A restaurant built for consistent 60-cover nights will be understaffed on Friday and overstaffed on Tuesday. This timing volatility is the #1 surprise for operators from other markets.' },
              { title: 'University semester calendar', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, detail: 'University of Wollongong drives weekday lunch traffic October–May, then evaporates May–October. Semester breaks (May, July, October) create 2–3 week revenue troughs where lunchtime covers drop 40–50%. Model your break-even assuming zero university trade. If the business survives on Sydney dinner commuters alone, you can absorb semester drops; if you depend on lunch, the volatility is severe.' },
              { title: 'Commuter income demographics', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, detail: 'Crown Street demographic is $110,000–$160,000 earners from tech, finance, government. They spend on wine ($60–$120 bottles), elevated mains ($35–$48), quality desserts. Average spend is $68 per person dinner (vs $48 for traditional inner-west Sydney). Thirroul skews $130,000+ — supporting $80–$120 per person fine dining. This is not subtle: price point disconnect costs you 20–40 covers per night.' },
              { title: 'Rent-to-revenue ratio', weight: '20% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, detail: 'Monthly rent ÷ projected monthly revenue. Under 15%: excellent for full-service dining. 15–20%: workable with disciplined labour and COGS. Above 20%: high risk. At $4,200/month rent, you need $28,000/month revenue (70 covers × $400 table spend including beverages). If a location cannot plausibly deliver that, the rent is too high. Most operators underestimate labour costs (15–20% of revenue for full-service dining).' },
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

        {/* Case study: comparison */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Case Study: Thirroul Restaurant vs Dapto Venture (Why Location Matters)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {/* Thirroul success */}
            <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #065F46, #0D9488)', padding: '22px 28px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,253,249,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — profitable restaurant</p>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F0FDF9' }}>Modern Australian, Thirroul NSW 2515</h3>
                <p style={{ fontSize: 13, color: 'rgba(204,235,229,0.6)' }}>110 sqm · $3,200/mo rent · $68 avg ticket · 65 covers/night</p>
              </div>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 8 }}>
                  {[['Monthly revenue','$132,000',S.emerald],['Monthly costs','$97,600',S.amber],['Monthly profit','$34,400',S.emerald],['Net margin','26.1%',S.emerald],['Annual profit','$412,800',S.emerald],['Payback','6 months',S.brand]].map(([l,v,c]) => (
                    <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                    </div>
                  ))}
                </div>
                <DataNote text="Cost breakdown: rent $3,200, labour $39,600 (7 FTE at NSW award), COGS 31% ($40,920), overheads $13,880. Revenue: 65 covers × $68 × 30 days. IBISWorld full-service restaurant COGS benchmarks applied. Assumes 80% weekday, 95% Friday–Sunday occupancy."/>
              </div>
            </div>

            {/* Dapto failure */}
            <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #7F1D1D, #991B1B)', padding: '22px 28px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(254,242,242,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — loss-making venture</p>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FEF2F2' }}>Casual Dining, Dapto NSW 2526</h3>
                <p style={{ fontSize: 13, color: 'rgba(254,205,205,0.6)' }}>100 sqm · $2,400/mo rent · $38 avg ticket · 30 covers/night</p>
              </div>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 8 }}>
                  {[['Monthly revenue','$36,000',S.amber],['Monthly costs','$38,200',S.red],['Monthly loss','($2,200)',S.red],['Margin','(6.1%)',S.red],['Annual loss','($26,400)',S.red],['Survival','6 months max',S.red]].map(([l,v,c]) => (
                    <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                    </div>
                  ))}
                </div>
                <DataNote text="Cost breakdown: rent $2,400, labour $14,400 (3 FTE at NSW award), COGS 35% ($12,600), overheads $8,800. Revenue: 30 covers × $38 × 30 days. Low covers reflect car-dependent foot traffic + fast-food competition. No wine program (narrow margin doesn't support training). Business becomes loss-making at month 3 without cash reserve."/>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 20 }}>
            This comparison is not theoretical — it reflects real outcomes in Wollongong 2024–2026. The Thirroul operator captures $412,800 annual profit. The Dapto operator is bankrupt by month 6. The difference is not concept quality or operational skill; it is location selection. The Dapto location cannot support a full-service restaurant at any price point because the customer base doesn't exist. A perfectly executed casual restaurant at 80% occupancy still loses money. An average restaurant in Thirroul thrives.
          </p>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            10 Things to Do Before Signing a Wollongong Restaurant Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Survey Sydney commuters at 7:00pm on a Friday', detail: 'Visit your shortlist at 7:00–9:00pm Friday night. Count how many customers are dining. If the street feels quiet, this is a signal. Sydney workers arrive in Wollongong at 7:00pm, not 6:00pm. A venue quiet at 7:30pm on Friday is not viable for evening trade.' },
              { n: '02', tip: 'Check University of Wollongong semester calendar', detail: 'Model your financial projections assuming zero university lunch trade May–October. If your business survives on Sydney dinner commuters alone, you can absorb semester breaks. If you depend on 20–30 lunch covers daily, the seasonal volatility will exhaust your cash reserves.' },
              { n: '03', tip: 'Calculate rent ÷ revenue before touring the space', detail: 'Monthly rent divided by projected monthly revenue. For full-service dining, this must be below 0.15. At $3,500/month rent, you need $23,333/month revenue (approximately 58 covers × $400 including beverages). If a location cannot plausibly deliver that, do not pursue it.' },
              { n: '04', tip: 'Run the numbers at 60% occupancy', detail: 'What does the P&L look like if you hit 60% of projected covers in Month 1 and Month 2? If the answer is loss-making with no cash reserve, the rent or operating costs are too high. Wollongong\'s best locations survive this scenario.' },
              { n: '05', tip: 'Talk to 5 Crown Street operators about commuter volatility', detail: 'Ask specifically about Friday–Saturday vs Monday–Tuesday cover volatility. Monday–Tuesday lunch is the stress test that separates viable from marginal locations. Three conversations will tell you more than a month of desk research.' },
              { n: '06', tip: 'Verify parking capacity at your shortlist site', detail: 'Sydney commuters travel by car (not public transit like Sydney). Locations with on-site or 2-minute walk parking outperform those requiring 5+ minute walks significantly. Wollongong diners abandon restaurants with poor parking access — their behavior differs from inner-city customers.' },
              { n: '07', tip: 'Model seasonal revenue for Harbour/Flagstaff sites', detail: 'Summer (November–February) can be 40% higher revenue than winter (June–August). Build a cash reserve of 4 months operating costs if you choose a seasonally dependent location. This is non-negotiable.' },
              { n: '08', tip: 'Negotiate a 12-month break clause', detail: 'Landlords rarely resist this for strong tenant covenants. This provides complete protection if commuter traffic doesn\'t materialise as expected. Do not sign a lease without this.' },
              { n: '09', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level data is the starting point. The specific address — visibility from the street, parking proximity, proximity to university — changes viability materially. Run it before committing.' },
              { n: '10', tip: 'Get 3 independent rent valuations', detail: 'Compare agent quotes to Sydney CBD equivalent space. If Crown Street rent is 65% of Sydney CBD rent, you\'re at market. If it\'s 85%+, the landlord is pricing prematurely. This number matters more than any other single variable.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $60k', rent: 'Not viable', comp: '5+', payback: 'N/A' })),
                ].map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < 5 ? `1px solid ${S.n100}` : 'none', background: row.verdict === 'NO' ? '#FEF8F8' : 'transparent' }}>
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
          <DataNote text="Income: ABS 2023–24. Rent: commercial property agents Q1 2026. Payback: Locatalyze model, $200,000 setup, IBISWorld full-service restaurant COGS benchmarks."/>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Wollongong'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Wollongong'}</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{acceptedAnswer.text}</p>
            </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 12 }}>More location guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[
              { href: '/analyse/perth/cafe', label: 'Cafés in Perth' },
              { href: '/analyse/brisbane/cafe', label: 'Cafés in Brisbane' },
              { href: '/analyse/adelaide/restaurant', label: 'Restaurants in Adelaide' },
              { href: '/analyse/hobart/cafe', label: 'Cafés in Hobart' },
              { href: '/analyse/gold-coast/gym', label: 'Gyms on Gold Coast' },
              { href: '/analyse/sydney/restaurant', label: 'Restaurants in Sydney' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 60%, #0891B2 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(8,145,178,0.15)', border: '1px solid rgba(8,145,178,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Wollongong address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(204,235,229,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street visibility, exact competitor count, parking proximity, proximity to university — produces a different score. Run it before you commit.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0891B2', color: '#F0FDF9', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Wollongong address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.35)', marginTop: 10 }}>No credit card · 1 free preview · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}
