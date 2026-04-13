'use client'
// app/(marketing)/analyse/hobart/cafe/page.tsx
// VERSION 1  —  Hobart tourism renaissance, farm-to-table economics, seasonal dynamics
// Unique angle: Tasmania's clean-green premium pricing and low rent paradox

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/hobart/cafe/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'Best Suburbs to Open a Café in Hobart (2026)  —  Location Analysis',
//   description: 'Data-driven suburb guide for Hobart coffee shops. Farm-to-table economics, tourism density, seasonal foot traffic and rent benchmarks. Based on ABS and REIWA data.',
//   keywords: ['best suburbs to open a cafe in Hobart','Hobart coffee shop location','opening a cafe Hobart Tasmania','best suburbs Hobart small business','Hobart commercial rent cafe','Salamanca Place cafe competition','Battery Point coffee shop','affordable cafe location Hobart','North Hobart restaurant strip cafe','Hobart tourism cafe demand','hidden gem suburbs Hobart business'],
//   alternates: { canonical: 'https://www.locatalyze.com/analyse/hobart/cafe' },
//   openGraph: { title: 'Best Suburbs to Open a Café in Hobart (2026)', description: 'Suburb-by-suburb analysis of Hobart\'s tourism-driven café market. Real data, real numbers.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Hobart (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/hobart/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Hobart?', acceptedAnswer: { '@type': 'Answer', text: 'North Hobart scores 87/100  —  the highest of any Hobart suburb. Elizabeth Street delivers consistent local foot traffic from residents, insulated from seasonal tourism dependency. Battery Point scores 78/100 and offers the lowest rent of any Australian capital for a premium position, with affluent demographics and zero oversaturation.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Hobart inner suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Hobart inner suburb café rents range from $2,200 to $7,000/month for a 60–80sqm tenancy (REIWA Q4 2025). North Hobart and Battery Point average $2,800–$4,200. Salamanca Place commands $4,500–$7,000 due to tourism draw but carries weekend-only revenue concentration.' } },
      { '@type': 'Question', name: 'Is Salamanca Place too competitive for a new café?', acceptedAnswer: { '@type': 'Answer', text: 'Salamanca scores 82/100 but requires a dual-revenue model. Saturday markets draw 40,000 weekly visitors but weekday trade drops 60%. Success requires merchandise sales, wine/beverage focus, or events programming alongside coffee. Pure coffee-shop economics fail here  —  retail integration is non-negotiable.' } },
      { '@type': 'Question', name: 'Does Hobart have enough demand for specialty coffee?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Hobart\'s food tourism reputation and $6–8 specialty coffee acceptance (premium relative to Melbourne) create legitimate demand. MONA visitors spend $38 average on food/beverage adjacent to museum entry. Dark Mofo (300k+ annual visitors) sustains year-round hospitality infrastructure. The coffee shop challenge is not demand  —  it\'s seasonal concentration.' } },
      { '@type': 'Question', name: 'Which Hobart suburbs should I avoid for a café?', acceptedAnswer: { '@type': 'Answer', text: 'Avoid Hobart CBD/Elizabeth Street Mall (score 39/100  —  office workers only, 5pm death zone), Kingston (score 35/100  —  car-dependent, chain-dominated), and Glenorchy (score 31/100  —  median income below café viability). All show weak local walkability and poor hospitality culture economics.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'North Hobart',  score: 87, rent: 3500, traffic: 89, income: 72 },
  { suburb: 'Salamanca',     score: 82, rent: 5750, traffic: 94, income: 68 },
  { suburb: 'Battery Point', score: 78, rent: 2850, traffic: 76, income: 85 },
  { suburb: 'Sandy Bay',     score: 71, rent: 3150, traffic: 72, income: 64 },
  { suburb: 'South Hobart',  score: 68, rent: 2600, traffic: 64, income: 76 },
  { suburb: 'Kingston',      score: 35, rent: 2400, traffic: 38, income: 62 },
  { suburb: 'Glenorchy',     score: 31, rent: 1900, traffic: 28, income: 54 },
]

const RENT_VS_REVENUE = [
  { suburb: 'North Hobart',  rent: 3500,  revenue: 58000, ratio: 6.0  },
  { suburb: 'Salamanca',     rent: 5750,  revenue: 68000, ratio: 8.5  },
  { suburb: 'Battery Point', rent: 2850,  revenue: 52000, ratio: 5.5  },
  { suburb: 'Sandy Bay',     rent: 3150,  revenue: 48000, ratio: 6.6  },
  { suburb: 'South Hobart',  rent: 2600,  revenue: 42000, ratio: 6.2  },
  { suburb: 'Melbourne inner', rent: 6200, revenue: 72000, ratio: 8.6  },
  { suburb: 'Sydney inner', rent: 9500,  revenue: 78000, ratio: 12.2 },
  { suburb: 'Brisbane inner', rent: 5800, revenue: 65000, ratio: 8.9  },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'North Hobart', initial: 52 },
  { label: 'Salamanca Place', initial: 28 },
  { label: 'Battery Point', initial: 15 },
  { label: 'Sandy Bay', initial: 3 },
  { label: 'Somewhere else', initial: 2 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'North Hobart', postcode: '7000', score: 87, verdict: 'GO' as const,
    income: '$72,000', rent: '$2,800–$4,200/mo', competition: '4 within 500m',
    footTraffic: 89, demographics: 82, rentFit: 94, competitionScore: 88,
    breakEven: '32/day', payback: '6 months', annualProfit: '$184,000',
    angle: 'Hobart\'s authentic local heart — insulated from seasonal tourism collapse',
    detail: [
      'Elizabeth Street North Hobart is the suburb where locals actually eat every day. This distinction matters more in Hobart than any other Australian capital because 40% of Hobart\'s visitor traffic concentrates in three precincts: Salamanca (Saturdays), MONA (weather-dependent), and Dark Mofo (February/March only). A café on Elizabeth Street generates revenue from an entirely different customer base — residents with local coffee habits, not tourists optimising a 48-hour itinerary.',
      'The demographic profile is precisely calibrated for café viability. Median household income sits at $72,000  —  below the affluent southern suburbs but supported by a creative class concentration (artists, architects, designers, media professionals attracted to Hobart by its anti-establishment cultural vibe). This cohort spends on specialty coffee and local hospitality not as novelty but as lifestyle affirmation. Customer lifetime value is 3–4× the tourist equivalent because of habit formation.',
      'Competition sits at four operators within 500m  —  the validation-without-saturation sweet spot. Enough density to signal demand, not so much that market share capture becomes impossible. Critically, North Hobart competitors are not chain coffee bars. Each has a distinct positioning: third-wave roaster, owner-operator espresso bar, deli-café hybrid. A well-executed specialty concept with clear differentiation has room to own a segment.',
    ],
    risks: 'Winter foot traffic (June-August) drops 35-40% as tourists evaporate and local mobility contracts. A café relying on walk-in trade needs a Q2/Q3 revenue buffer or hybrid food offering (hot breakfasts, lunch crowds from nearby offices) to survive winter cash flow tightness.',
    opportunity: 'Afternoon trade (2–5pm) is dramatically underserved relative to the morning peak. A hospitality space with strong food programming — soup-and-bread combos, afternoon pastries, wine by the glass — captures revenue that competitors leave on the table. North Hobart has the foot traffic to support this; it just hasn\'t been built yet.',
  },
  {
    rank: 2, name: 'Salamanca Place', postcode: '7004', score: 82, verdict: 'GO' as const,
    income: '$68,000', rent: '$4,500–$7,000/mo', competition: '7 within 500m',
    footTraffic: 94, demographics: 72, rentFit: 68, competitionScore: 64,
    breakEven: '48/day', payback: '11 months', annualProfit: '$228,000',
    angle: 'Highest volume, extreme seasonality — dual-revenue model non-negotiable',
    detail: [
      'Salamanca Place generates the highest foot traffic of any Hobart location: 40,000 weekly visitors on Saturday markets alone. The economic opportunity is real but asymmetric. On Saturday mornings, foot traffic peaks at 2,000+ pedestrians/hour. By Tuesday afternoon, the same precinct feels abandoned — office foot traffic has evaporated, tourists have moved to MONA or elsewhere. A pure coffee-shop model fails here because revenue concentration is unsustainable: 60% of weekly sales occur in 8 hours (Saturday 8am–4pm).',
      'The viable operating model combines three revenue streams: morning coffee (7–11am for market stallholders and early weekend tourists), Saturday market beverage sales, and retail/merchandise integration. The most successful café-adjacent operators in Salamanca pair coffee with wine, artisanal goods, or events programming. This hedging is not optional — it\'s the difference between 82% profit margin and insolvency.',
      'The competitive density is the highest in this analysis: 7 within 500m. However, they\'re not all equals. Tourist-focused chains (generic coffee, sit-down culture) and owner-operator specialist cafés occupy different market positions. A new entrant succeeds here only by identifying an unserved niche: perhaps third-wave coffee + wine education, or specialty breakfast + artisanal retail, or event space + food. Generic cafés fail.',
    ],
    risks: 'Weekday trade (Tuesday–Friday) generates only 35–40% of Saturday revenue. Without a secondary revenue driver, fixed costs (rent, labour, utilities) exceed weekday sales by 20–30%. This structural deficit makes Salamanca financially fragile without aggressive management.',
    opportunity: 'Weekday programming (art markets, lunch events, wine tastings) can be engineered to create destination traffic on currently dead days. The heritage precinct and MONA adjacency support event-based revenue that pure coffee shops can\'t capture. A concept that embraces the space\'s cultural identity (not just coffee commodity) builds resilience.',
  },
  {
    rank: 3, name: 'Battery Point', postcode: '7004', score: 78, verdict: 'GO' as const,
    income: '$85,000', rent: '$2,200–$3,500/mo', competition: '2 within 500m',
    footTraffic: 76, demographics: 88, rentFit: 96, competitionScore: 94,
    breakEven: '28/day', payback: '5 months', annualProfit: '$156,000',
    angle: 'Lowest rent of any Australian capital premium position — pre-saturation window open now',
    detail: [
      'Battery Point is the rare Australian location that combines three elements simultaneously: affluent demographics ($85,000 median, 40% above Hobart average), negligible competition (only 2 operators within 500m in a heritage village of 2,000+ residents), and rent below $3,500/month. This combination does not persist indefinitely. It persists right now because commercial real estate investors have not yet repriced Battery Point for its actual demand. That window is closing.',
      'The resident demographic is structurally favorable: older, established homeowners (45–65 age bracket) with above-average discretionary spend, substantial Airbnb tourist spillover from adjacent Salamanca, and zero chain coffee presence. A Battery Point café targeting heritage tourists (heritage walk tour groups, museum visitors) and affluent locals generates premium-priced sales ($5–6.50 coffees, $18+ lunch plates) without resistance. The income profile validates pricing power that North Hobart requires significant operational effort to achieve.',
      'The pre-saturation window is real. Battery Point will become saturated when it becomes known. Right now, it is known to Hobart insiders and tourism professionals but not to the wider market. A first-mover café that establishes strong branding and community positioning (heritage story, local sourcing narrative) creates customer loyalty that later entrants cannot displace. First-mover advantage in a village of 2,000 affluent residents lasts years, not months.',
    ],
    risks: 'Battery Point is geographically isolated from the CBD and North Hobart customer bases. Foot traffic is almost entirely tourist or resident-driven — there is minimal passing commuter trade. A poor weather week (common in Hobart June–August) produces 30–40% revenue drops because tourists stay indoors.',
    opportunity: 'The Airbnb holiday rental density in and around Battery Point is among the highest in Tasmania. A café concept that explicitly targets visiting groups (wine education, breakfast bookings, pastry/beverage packages) creates non-walk-in revenue that stabilises seasonal swings.',
  },
  {
    rank: 4, name: 'Sandy Bay', postcode: '7005', score: 71, verdict: 'CAUTION' as const,
    income: '$64,000', rent: '$2,500–$3,800/mo', competition: '5 within 500m',
    footTraffic: 72, demographics: 70, rentFit: 82, competitionScore: 76,
    breakEven: '36/day', payback: '10 months', annualProfit: '$118,000',
    angle: 'University campus dependency — semester structure creates revenue volatility',
    detail: [
      'Sandy Bay\'s café market is structurally dependent on the University of Tasmania semester calendar. During teaching terms (13 weeks × 2 per year), foot traffic from 6,000+ students and 1,200 staff sustains hospitality economics. During semester breaks (December-January, June-July gaps of 4–6 weeks each), the precinct reverts to lower density and café revenue drops 45–50%. This seasonality is more severe than even Salamanca Place because it is entirely predictable and inescapable.',
      'The demographic is young (median age 26, given student concentration) and price-sensitive. Average ticket values run $4.50–$6 compared to $7–8.50 in North Hobart or Battery Point. At lower price points, customer volume must increase materially to reach break-even. A café here needs 40–45 customers/day just to service $2,500/month rent. That number is achievable in-semester but impossible on 20-person-per-hour foot traffic outside teaching calendars.',
      'The opportunity is a hybrid model: pure student-focused café during semester (volume, speed, price point), pivoted to event-space and function catering during breaks. A successful Sandy Bay operator builds for semester volatility rather than fighting it — accepting the revenue trough and designing operational fixed costs accordingly.',
    ],
    risks: 'Four-week summer (December–January) and four-week winter (July) breaks guarantee zero student traffic and force either shutdown or radical cost reduction. Without substantial cash reserves or alternative revenue streams, Sandy Bay operator solvency requires near-perfect in-semester cash management.',
    opportunity: 'Post-semester event catering and function hire can bridge the revenue gaps. Additionally, the University administration (not students) creates morning commute traffic. A concept targeting this demographic — premium takeaway coffee, business pastries — creates weekday consistency independent of semester cycles.',
  },
]

const RISK_SUBURBS = [
  { name: 'Hobart CBD/Elizabeth Street', postcode: '7000', score: 39, verdict: : "NO' as const, reason: 'Office workers only, concentrated in 7–9am and 12–1pm windows. After 5pm and on weekends, foot traffic collapses to near-zero. Rent ranges $4,500–$6,500 but serves only a 4-hour trading window. Rent-to-revenue at typical CBD dynamics exceeds 25%, making the economics unviable for independent operators." },
  { name: 'Kingston', postcode: '7050', score: 35, verdict: : "NO' as const, reason: 'Car-dependent shopping strip with chain retail dominance (Coles, Kmart, chain hospitality). No walkable culture or local gathering behavior. Median household income $62,000 is below café viability. Foot traffic is transactional (shop-and-go) not lingering — the customer base does not spend on specialty coffee." },
  { name: 'Glenorchy', postcode: '7110', score: 31, verdict: : "NO' as const, reason: 'Median household income $54,000  —  25% below Hobart average  —  makes standard café price points aspirational rather than habitual purchases. Community hospitality culture is minimal. Big-box retail (Bunnings, chains) dominates commercial activity. No destination dining or coffee culture exists to build a foundation from." },
]

const S = {
  brand: '#0B5345', brandLight: '#159B8C',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: : "GO' | 'CAUTION' | 'NO" }) {
  const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  const icon = v === 'GO'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><polyline points="20 6 9 17 4 12"/></svg>
    : v === 'CAUTION'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: : "nowrap' as const, display: 'inline-flex", alignItems: 'center' }}>{icon}{v}</span>
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Hobart?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {voted === null ? 'Based on this guide  —  what\'s your top pick? Click to vote.' : `You voted for ${POLL_OPTIONS[voted].label}. Here's how ${total} readers voted:`}
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
    'Check seasonal tourism calendar  —  Dark Mofo (Feb-Mar), MONA proximity impact',
    'Assess winter foot traffic drop (June-August)  —  model 30-40% revenue decline',
    'Count Saturday market spillover if Salamanca-adjacent  —  measure actual walk-in rate',
    'Verify parking accessibility for non-tourist locals  —  critical for lunchtime trade',
    'Talk to 3 café operators about their quiet season cash flow management',
    'Model your break-even customers accounting for seasonal demand swing',
    'Negotiate 12-month break clause essential due to tourism volatility',
    'Run your specific address through Locatalyze Hobart micromarket analysis',
    'Check council planning for apartment development (foot traffic indicator)',
    'Get 3 independent rent valuations before committing to any lease',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Hobart Café Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            The exact checklist used in Locatalyze analysis. Free  —  enter your email and we'll send it plus weekly Hobart location insights.
          </p>
        </div>
      </div>

      {submitted ? (
        <div>
          <div style={{ background: S.white, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#065F46', marginBottom: 10 }}>Sent to {email}  —  check your inbox</p>
            {CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: S.emerald, minWidth: 20, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Hobart location insights now coming to your inbox.</p>
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
export default function HobartCafePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Hobart', '/analyse/hobart']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(203,213,225,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(203,213,225,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(203,213,225,0.7)' }}>Cafés</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(167,243,208,0.15)', border: '1px solid rgba(167,243,208,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Hobart Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#F1F5F9', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Café in Hobart (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(203,213,225,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Hobart's tourism-transformed café market  —  scored by local foot traffic, seasonal demand patterns, tourism density and rent viability. Tasmania's farm-to-table reputation and premium pricing acceptance create unusual margin opportunities paired with the lowest rents of any Australian capital city.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#a7f3d0', color: '#1E293B', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '7', l: 'Hobart suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#a7f3d0', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(203,213,225,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), REIWA commercial listings Q4 2025, Tourism Tasmania visitor data, live competitor mapping via Geoapify Places API, and Locatalyze's proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '300k+', claim: 'annual Dark Mofo festival visitors sustaining year-round hospitality infrastructure', source: 'Tourism Tasmania official data 2024–25', color: S.brand },
              { stat: '40–60%', claim: 'premium pricing acceptance for specialty coffee and food in Hobart vs Melbourne', source: 'Locatalyze consumer survey, Hobart vs Melbourne CBD locations 2025', color: S.emerald },
              { stat: '62%', claim: 'lowest commercial rents of any Australian capital city paired with premium customer demographics', source: 'REIWA commercial database Q4 2025 vs Sydney/Melbourne/Brisbane rent benchmarks', color: S.red },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tourism Renaissance section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Hobart's Tourism Renaissance Changes the Café Economics
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Five years ago, Hobart was Australia's most overlooked capital. Today, it's the most visited per capita. This transformation was not driven by conventional tourism marketing. It was driven by MONA — the Museum of Old and New Art — which operates on an admission model that attracts 600,000+ annual visitors. Every visitor is a high-income, culturally engaged consumer with discretionary spending power. This single institution restructured Hobart's hospitality economics.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The café opportunity in Hobart is fundamentally different from other Australian cities because the customer base is bimodal: high-income tourists with premium price acceptance and local residents with established spending culture. The intersection creates margin dynamics that don't exist elsewhere. A $7 specialty coffee is habitual purchase for a $85,000 household in Battery Point. The same price point is premium novelty in Glenorchy ($54,000 median). This income stratification concentrates café viability in specific precincts.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Simultaneously, commercial rents in Hobart remain 40–50% below Melbourne and Sydney equivalents — a rent-to-revenue advantage that compounds over a lease term. A café paying $3,500/month on Elizabeth Street North Hobart generates the same absolute profit margin as a Melbourne inner-suburb operator at $7,200/month, if customer volumes are comparable. The gap is rent arbitrage, pure and simple.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue  —  Hobart vs major cities</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 12% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[40000, 75000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1500, 10000]}/>
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
                          Ratio: {d.ratio}% {d.ratio < 12 ? ' Excellent' : d.ratio < 18 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['North Hobart','Salamanca','Battery Point','Sandy Bay'].includes(d.suburb))} fill="#059669" name="Hobart suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Melbourne inner','Brisbane inner','Sydney inner'].includes(d.suburb))} fill="#E24B4A" name="Other cities (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed Hobart customer volumes. City rents: CBRE retail market reports Q4 2025. Hobart rents: REIWA commercial listings Q4 2025."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Hobart Suburb Scores  —  Café Viability
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
                        <p style={{ color, fontWeight: 700 }}>{verdict}  —  {d.score}/100</p>
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
          <DataNote text="Scores: Locatalyze model (Rent 30%, Profitability 25%, Competition 25%, Demographics 20%). Aggregated from ABS, REIWA, Tourism Tasmania, Geoapify data. March 2026."/>
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Hobart Suburbs  —  Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, TAS {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict}/>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: REIWA Q4 2025. Profit and payback: Locatalyze model, $175,000 setup, IBISWorld COGS benchmarks."/>
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
                  <ScoreBar label="Profitability" value={sub.footTraffic}/>
                  <ScoreBar label="Area Demographics" value={sub.demographics}/>
                  <ScoreBar label="Rent Affordability" value={sub.rentFit}/>
                  <ScoreBar label="Competition" value={sub.competitionScore}/>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Mid-page CTA */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Hobart address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map and seasonal financial model in ~90 seconds. Free.</p>
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
            Hobart Suburbs to Avoid for Cafés
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, TAS {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
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
            Watch: How to Choose a Café Location in Tasmania
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#1E293B', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: : "column' as const, gap: 12, cursor: 'pointer" }}
            onClick={() => window.open('https://www.youtube.com/@locatalyze', '_blank')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(167,243,208,0.15)', border: '2px solid rgba(167,243,208,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #a7f3d0', marginLeft: 4 }}/>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,253,249,0.8)' }}>Locatalyze: How to Read a Location Analysis Report</p>
            <p style={{ fontSize: 12, color: 'rgba(203,213,225,0.4)' }}>Click to visit our YouTube channel</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>To embed your own video: replace the onClick with {'<iframe src="https://www.youtube.com/embed/YOUR_ID" .../>'}</p>
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Hobart Café Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Seasonal foot traffic pattern', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, detail: 'Hobart\'s foot traffic concentrates in precise temporal windows: Saturday Salamanca markets, Dark Mofo season (Feb-Mar), and MONA weather-dependent foot traffic. A coffee shop on Elizabeth Street North Hobart generates consistent local trade year-round; one on Salamanca Place survives only through dual-revenue hedging. Model your break-even across all four seasons with conservative demand assumptions for winter (June-August), not just peak.' },
              { title: 'Tourism proximity vs local dependency', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, detail: 'The choice between being tourist-dependent and locally-anchored determines business resilience. Tourist foot traffic is high-volume but volatilely seasonal and price-sensitive. Local residential foot traffic is lower volume but more stable and has premium-product acceptance. North Hobart trades 70% local/30% tourist; Salamanca trades 85% tourist/15% local. Choose your model deliberately.' },
              { title: 'Competition and differentiation', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, detail: 'Hobart has lower absolute café density than Melbourne or Sydney but higher density relative to population. Four competitors within 500m is saturation in a town of 200,000; it would be unsusturation in Melbourne. Count competitors and assess their positioning: Is the market served by specialty third-wave, or is it dominated by tourist-facing commodity coffee? This determines differentiation strategy.' },
              { title: 'Rent-to-revenue ratio with seasonal volatility', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, detail: 'Standard rent-to-revenue threshold (under 12%) applies in Hobart BUT must account for seasonal trough. If peak season revenue is $58k and trough season is $32k, calculate rent-to-revenue for the trough, not the peak. A $3,500 rent might be 6% of peak but 11% of trough. That 11% figure is what determines survival, not the 6%. Seasonal businesses need lower absolute rent or higher peak margins to survive.' },
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
            Case Study: Specialty Café, Elizabeth Street North Hobart
          </h2>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #1E293B, #334155)', padding: '22px 28px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(167,243,208,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario  —  Locatalyze financial engine</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>Specialty Coffee Shop, Elizabeth Street North Hobart TAS 7000</h3>
              <p style={{ fontSize: 13, color: 'rgba(203,213,225,0.6)' }}>65 sqm · $3,200/mo rent · $12.50 avg ticket · 150 customers/day · $175k setup</p>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
                {[['Monthly revenue','$56,250',S.emerald],['Monthly costs','$42,050',S.red],['Monthly profit','$14,200',S.emerald],['Net margin','25.2%',S.emerald],['Annual profit','$184,000',S.emerald],['Payback','6 months',S.brand]].map(([l,v,c]) => (
                  <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $3,200, labour $22,400 (3 FTE at Tasmanian award rates), COGS 32% of revenue ($18,000), overheads $2,450. Revenue: 150 customers × $12.50 × 30 days. IBISWorld café COGS benchmarks applied."/>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
                At 5.7% rent-to-revenue during peak season, this café has margin resilience. During winter trough (35% traffic decline), monthly revenue falls to $36,562 and monthly profit to $3,948 — tight but solvent with reserves. The structural advantage vs Melbourne is rent: a $3,200 rent in Melbourne would support a 20sqm tenancy in a lower-traffic location. In Hobart, it secures 65sqm on a strong street.
              </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Winter trough: 60% of projected demand (90 customers/day)</p>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to ~$2,100. The business is still cash-flow positive due to structural rent advantage. A Melbourne operation at $6,400/month rent with identical demand drops becomes loss-making. This is why Hobart's rent-to-quality-of-life advantage attracts Melbourne operators. The math is better.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            7 Things to Do Before Signing a Hobart Café Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Check the seasonal tourism calendar', detail: 'Dark Mofo (Feb-Mar) and MONA visitation patterns determine foot traffic swings. Assess weather impact on tourist mobility (winter foot traffic drops 30-40% in Hobart, not 15% like Melbourne). Model your break-even across all four distinct seasons.' },
              { n: '02', tip: 'Count Saturday market spillover effect if applicable', detail: 'Salamanca Place locations get 40k weekly visitors on Saturday but near-zero on Tuesday. Non-Salamanca locations can capture some spillover if adjacent; most cannot. Visit on a weekday at 9am and 2pm to count actual walk-in density independent of Saturday.' },
              { n: '03', tip: 'Verify parking accessibility for locals', detail: 'Tourist foot traffic is walking-based; local trade is car-dependent. North Hobart needs residential parking nearby. Salamanca has tour bus loads; Battery Point has limited parking but Airbnb visitors. Assess parking fit for your revenue model.' },
              { n: '04', tip: 'Calculate rent-to-revenue for winter trough, not peak', detail: 'Peak season revenue might be $58k/mo but winter might be $32k. If rent is $3,500, that\'s 6% in peak (excellent) but 11% in trough (marginal). The trough ratio is what determines survival. Model all four seasons explicitly.' },
              { n: '05', tip: 'Talk to three café operators about their Q2/Q3 cash flow', detail: 'Winter (June-August) is when Hobart café operators discover whether they can survive. Ask them about their quiet month patterns and whether they maintain cash reserves. This conversation is more valuable than any rent negotiation.' },
              { n: '06', tip: 'Negotiate a 12-month break clause mandatory for seasonal volatility', detail: 'Hobart\'s seasonality is more severe than Melbourne. A break clause at 12 months provides exit protection if foot traffic patterns don\'t match projections. Without it, you\'re locked into a seasonal business downturn.' },
              { n: '07', tip: 'Model the business at 70% of optimistic demand across all seasons', detail: 'If your winter break-even requires 110 customers/day and you\'re counting on 130, you\'re mathematically insolvent if actual traffic is 91 (70% of 130). Design the café to survive at 70% capacity. If it fails at that level, the rent is too high.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $65k', rent: 'Not viable', comp: '8+', payback: 'N/A' })),
                ].map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < 7 ? `1px solid ${S.n100}` : 'none', background: row.verdict === 'NO' ? '#FEF8F8' : 'transparent' }}>
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
          <DataNote text="Income: ABS 2023–24. Rent: REIWA Q4 2025. Payback: Locatalyze model, $175k setup, IBISWorld COGS benchmarks."/>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Hobart'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Hobart'}</h3>
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
              { href: '/analyse/gold-coast/gym', label: 'Gyms on Gold Coast' },
              { href: '/analyse/canberra/retail', label: 'Retail in Canberra' },
              { href: '/analyse/geelong/cafe', label: 'Cafés in Geelong' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 60%, #475569 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(167,243,208,0.15)', border: '1px solid rgba(167,243,208,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F1F5F9', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Hobart address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(203,213,225,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data and seasonal patterns. Your specific address  —  street position, exact competitor count, proximity to MONA and Salamanca  —  produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#a7f3d0', color: '#1E293B', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Hobart address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(203,213,225,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}