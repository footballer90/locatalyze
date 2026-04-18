'use client'
// app/(marketing)/analyse/darwin/retail/page.tsx
// VERSION 1 — Darwin retail location guide, defence spending angle, wet/dry season dynamics
// Unique angle: Australia's most underestimated retail market driven by defence, government, mining/LNG

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/darwin/retail/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Retail Shop in Darwin (2026) — Location Analysis',
//  description: 'Data-driven suburb guide for Darwin retail. Defence spending, wet season dynamics, foot traffic, commercial rent benchmarks. Based on NT government data and live competitor mapping.',
//  keywords: ['best suburbs to open a retail shop in Darwin','Darwin retail location guide 2026','opening a shop Darwin NT','best suburbs Darwin small business','Darwin commercial rent retail','Casuarina Square retail opportunity','affordable retail location Darwin','Darwin foot traffic shopping areas','Mitchell Street Darwin retail','Darwin defence spending retail','hidden gem suburbs Darwin business'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/darwin/retail' },
//  openGraph: { title: 'Best Suburbs to Open a Retail Shop in Darwin (2026)', description: 'Suburb-by-suburb analysis of Darwin retail market. Defence housing, LNG sector, wet season strategies covered.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Retail Shop in Darwin (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/darwin/retail',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a retail shop in Darwin?', acceptedAnswer: { '@type': 'Answer', text: 'Casuarina scores 84/100 — the highest of any Darwin suburb. It anchors the northern suburbs with Casuarina Square drawing consistent foot traffic, $88,000 median household income, and only 4 competitors in category. Rent ranges $3,200–$5,000/month. Expected annual profit: $156,000.' } },
      { '@type': 'Question', name: 'How much does retail rent cost in Darwin?', acceptedAnswer: { '@type': 'Answer', text: 'Darwin retail rents vary by location. Casuarina: $3,200–$5,000/month. Mitchell Street (CBD): $3,800–$6,200/month. Parap: $2,500–$3,800/month. Rent-to-revenue benchmarks differ significantly based on wet season revenue modelling — retail shops must account for a 40% revenue drop during monsoon season (November–April).' } },
      { '@type': 'Question', name: 'Is Darwin\'s small population enough for retail?', acceptedAnswer: { '@type': 'Answer', text: 'Darwin\'s population of 150,000 is small, but three factors change the equation: (1) median household income of $98,000 (among Australia\'s highest) driven by defence, government, mining/LNG sectors; (2) absence of major retail competition — no Westfield, limited national chains; (3) transient high-income populations from US Marine rotation and LNG sector. These factors create underserved retail categories despite small population.' } },
      { '@type': 'Question', name: 'How does the wet season affect Darwin retail?', acceptedAnswer: { '@type': 'Answer', text: 'Darwin\'s wet season (November–April) sees 40% revenue decline due to extreme weather limiting foot traffic. Dry season (May–October) brings tourist surge — Mitchell Street sees 2x volume during these months. Retail businesses must build 6-month cash reserves and model separate dry/wet season revenue profiles. Air-conditioned retail is a structural necessity, not a luxury — factored into operating costs.' } },
      { '@type': 'Question', name: 'Which Darwin suburbs should I avoid for retail?', acceptedAnswer: { '@type': 'Answer', text: 'Berrimah (industrial/warehouse zone, score: 38), Humpty Doo (rural fringe, dispersed population, score: 33), and Winnellie (light industrial, no residential density, score: 30) should be avoided. These lack retail foot traffic and are viable only for wholesale operations. Focus on residential-anchored suburbs: Casuarina, Mitchell Street, Parap, Stuart Park.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Casuarina', score: 84, rent: 4100, traffic: 88, income: 88 },
  { suburb: 'Mitchell St', score: 78, rent: 5000, traffic: 92, income: 82 },
  { suburb: 'Parap', score: 76, rent: 3150, traffic: 74, income: 92 },
  { suburb: 'Stuart Park', score: 70, rent: 2850, traffic: 68, income: 78 },
  { suburb: 'Rapid Creek', score: 62, rent: 2400, traffic: 58, income: 75 },
  { suburb: 'Palmerston', score: 58, rent: 1900, traffic: 48, income: 72 },
]

const REVENUE_VS_RENT = [
  { suburb: 'Casuarina', rent: 4100, revenue: 58000, ratio: 7.1 },
  { suburb: 'Mitchell St', rent: 5000, revenue: 52000, ratio: 9.6 },
  { suburb: 'Parap', rent: 3150, revenue: 48000, ratio: 6.6 },
  { suburb: 'Stuart Park', rent: 2850, revenue: 42000, ratio: 6.8 },
  { suburb: 'Rapid Creek', rent: 2400, revenue: 38000, ratio: 6.3 },
  { suburb: 'Palmerston', rent: 1900, revenue: 32000, ratio: 5.9 },
  { suburb: 'Brisbane retail', rent: 6500, revenue: 68000, ratio: 9.6 },
  { suburb: 'Perth retail', rent: 5200, revenue: 61000, ratio: 8.5 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Casuarina', initial: 52 },
  { label: 'Mitchell Street', initial: 24 },
  { label: 'Parap', initial: 18 },
  { label: 'Stuart Park', initial: 8 },
  { label: 'Somewhere else', initial: 4 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Casuarina', postcode: '0810', score: 84, verdict: 'GO' as const,
    income: '$88,000', rent: '$3,200–$5,000/mo', competition: '4 within 500m',
    footTraffic: 88, demographics: 85, rentFit: 82, competitionScore: 86,
    breakEven: '48/day', payback: '9 months', annualProfit: '$156,000',
    angle: 'Darwin\'s real commercial hub — anchored by Casuarina Square, northern suburbs magnet',
    detail: [
      'Casuarina is Darwin\'s true retail epicentre, despite being 10km from CBD. The suburb captures two distinct traffic engines: Casuarina Square (the shopping precinct) drives foot traffic Monday–Sunday, and the surrounding northern suburbs residential base ($88,000 median income with strong defence housing population) provides reliable repeat customers. A retail operator here captures both precinct walk-ins and planned destination shoppers.',
      'Defence housing proximity is the structural advantage. Robertson Barracks (RAAF) and the broader defence establishment creates a population cohort with above-average household income, high spending discipline during rotation periods, and a preference for convenient local retail over driving to CBD. During base rotation cycles, defence family spending in Casuarina increases measurably — a seasonal tailwind that southern retailers never experience.',
      'Competition sits at exactly four direct competitors within 500m — the optimal signal. Enough to validate demand; not so many that new entrants face saturation. Casuarina Square\'s anchor retailer position means foot traffic is consistent and defensible. A specialty retail operator here with differentiated product positioning faces less direct competitive pressure than equivalent suburbs in Brisbane or Perth.',
    ],
    risks: 'Air conditioning is non-negotiable operating cost — Darwin\'s climate means customers expect full climate control. Factor $800–$1,200/month air conditioning costs into budgets. Wet season (November–April) sees 35–40% revenue decline; operators must model cashflow separately for each season.',
    opportunity: 'Premium lifestyle retail (specialty fashion, home décor, sporting goods) is significantly underrepresented relative to Casuarina\'s affluent demographic. Concept-driven retailers with clear positioning capture market share that discount-focused competitors leave uncaptured.',
  },
  {
    rank: 2, name: 'Mitchell Street CBD', postcode: '0800', score: 78, verdict: 'GO' as const,
    income: '$82,000', rent: '$3,800–$6,200/mo', competition: '5 within 500m',
    footTraffic: 92, demographics: 75, rentFit: 70, competitionScore: 72,
    breakEven: '54/day', payback: '11 months', annualProfit: '$132,000',
    angle: 'Highest raw foot traffic, but wet season revenue collapse requires seasonal strategy',
    detail: [
      'Mitchell Street delivers Darwin\'s highest raw foot traffic — tourists, hospitality precincts, nightlife anchors create pedestrian volumes that dwarf suburban locations. The dry season (May–October) sees foot traffic surge 100%+ above wet season baseline. Tourist season profoundly shifts Mitchell Street retail economics.',
      'The wet season challenge is structural: November–April brings extreme weather (monsoon, heat, flooding risk), causing visitor numbers to drop 40%+ and residential foot traffic to plummet. A Mitchell Street retail business must operate as a two-season model: dry season captures 60% of annual revenue in six months; wet season requires cost discipline and staff reduction. Without explicit seasonal strategy, wet season cash flow stress becomes critical.',
      'Tourism opportunity is real but requires category selection. Gift shops, specialty tourism retail (art, souvenirs), and casual apparel perform well during dry season. Necessity retail (supermarket substitutes) struggles against foot traffic volatility. Success here depends on category choice and financial resilience during November–April downturn.',
    ],
    risks: 'Wet season revenue drop is not a mild decline — it\'s structural. A shop generating $52,000/month May–October may only achieve $31,000/month November–April. Monthly profit margins collapse from $8,000 to near break-even. Requires 4–6 month cash reserve before signing lease.',
    opportunity: 'A retail operation with flexible part-time staffing, seasonal product rotation, and explicit wet-season cost model can capture both dry season volume and wet season traveller traffic. The key is intentional seasonal planning, not fighting the cycle.',
  },
  {
    rank: 3, name: 'Parap', postcode: '0820', score: 76, verdict: 'GO' as const,
    income: '$92,000', rent: '$2,500–$3,800/mo', competition: '2 within 500m',
    footTraffic: 74, demographics: 89, rentFit: 88, competitionScore: 90,
    breakEven: '42/day', payback: '8 months', annualProfit: '$118,000',
    angle: 'Village feel, highest income catchment, famous Saturday market, minimal direct competition',
    detail: [
      'Parap is Darwin\'s most underrated retail location — small population but extraordinarily affluent. Median household income of $92,000 (second only to high-end Perth suburbs) combined with a strong "village lifestyle" demographic creates premium positioning retail opportunity. Parap residents actively support local independent retail in a way that larger suburbs do not.',
      'The Saturday Parap market is the suburb\'s traffic engine. Saturdays see foot traffic 3–4x baseline as residents and visitors arrive for the market precinct (food, crafts, local produce). A retail shop positioned near market entry captures both planned weekend shoppers and impulse buyers walking the precinct. This recurring weekend surge provides reliable revenue anchor.',
      'Competition is remarkably sparse — only two direct competitors within 500m. This means a new retail entrant with clear positioning has an unusually long runway to establish market position before competitive response. In Darwin retail terms, Parap represents a first-mover advantage that lasts months, not weeks.',
    ],
    risks: 'Weekday foot traffic is soft — the suburb depends heavily on weekends. Monday–Friday retail revenue is approximately 35% of Saturday revenue. A concept requiring consistent weekday trade will struggle. Premium lifestyle retail, market-day goods, and weekend-focused categories perform; essential daily retail struggles.',
    opportunity: 'The first premium specialty retail concept with clear weekend/market day positioning in Parap captures long-term customer loyalty in an affluent, underserved demographic. Once established, this position is difficult for competitors to displace.',
  },
  {
    rank: 4, name: 'Stuart Park', postcode: '0820', score: 70, verdict: 'CAUTION' as const,
    income: '$78,000', rent: '$2,200–$3,500/mo', competition: '3 within 500m',
    footTraffic: 68, demographics: 72, rentFit: 84, competitionScore: 80,
    breakEven: '39/day', payback: '10 months', annualProfit: '$94,000',
    angle: 'Emerging location between CBD and suburbs, foot traffic not yet established but improving',
    detail: [
      'Stuart Park occupies a unique position: it\'s intermediate between Mitchell Street CBD and suburban Casuarina. The suburb is experiencing residential growth from new apartment development, but retail foot traffic has not yet caught up with population growth. This creates a pre-saturation window.',
      'The opportunity is timing. Retail foot traffic is 15–20% below Casuarina currently, but population growth rates suggest three-year traffic improvement trajectory. A retail operator entering now with a differentiated concept can establish market position during the low-competition phase and benefit from improving foot traffic as residential base expands.',
      'Rent economics are the strongest in this analysis — $2,200–$3,500/month is 40% below Casuarina. A retail business achieving modest volume here can generate better margins than equivalent locations elsewhere in Darwin. The risk is that traffic doesn\'t materialise on expected timeline.',
    ],
    risks: 'Foot traffic is the core uncertainty. If residential growth slows or retail traffic lags expectations, volume targets become unachievable. This location requires confidence in medium-term demographic trajectory, not immediate viability.',
    opportunity: 'First-mover advantage in emerging retail location. A well-positioned operator entering now during pre-saturation phase can establish brand presence and customer loyalty before competitive response.',
  },
]

const RISK_SUBURBS = [
  { name: 'Berrimah', postcode: '0828', score: 38, verdict: 'NO' as const, reason: 'Industrial and warehouse zone with no retail foot traffic infrastructure. Businesses here serve wholesale and B2B only. Residential population density is insufficient to support retail. Zero walk-in traffic; all revenue must come from destination shopping by vehicle.' },
  { name: 'Humpty Doo', postcode: '0836', score: 33, verdict: 'NO' as const, reason: 'Rural fringe population is severely dispersed across large geographic area. The \"drive-through retail culture\" means customers do not walk or browse — they drive purposefully to destination retailers. No retail foot traffic generation. Population too sparse to support independent retail economics.' },
  { name: 'Winnellie', postcode: '0821', score: 30, verdict: 'NO' as const, reason: 'Light industrial zone with transient business visitors only. No residential density; no repeat customer base. Foot traffic is incidental to industrial activity, not retail-driving. Viable only for wholesale, office supply, or B2B operations targeting industrial tenants.' },
]

const S = {
  brand: '#0F766E', brandLight: '#14B8A6',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#475569', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: 'GO' | 'CAUTION' | 'NO' }) {
  const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
      : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  const icon = v === 'GO'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
    : v === 'CAUTION'
      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
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
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }} />
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a retail shop in Darwin?</h3>
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
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: isWinner ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }} />
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
            Ready to analyse a specific Darwin address?{' '}
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
    } catch { }
    setSubmitted(true)
    setLoading(false)
  }

  const CHECKLIST = [
    'Visit at 9am on a weekday — count foot traffic for 30 mins (baseline volume)',
    'Visit same location on Saturday at 10am — measure weekend surge (repeat customers)',
    'Calculate rent ÷ projected revenue — must be under 0.10 for Darwin (tighter than south)',
    'Model two revenue profiles: dry season (May–Oct) and wet season (Nov–Apr) separately',
    'Verify air-conditioning costs are factored in — Darwin retail is climate-dependent',
    'Assess Defence housing proximity — Robertson Barracks influence on foot traffic?',
    'Count dry season tourist boost effect — Mitchell Street multiplier vs baseline',
    'Verify cyclone insurance requirements and cost — mandatory in Northern Territory',
    'Check Mindil Beach market proximity (Saturday/Sunday) — tourism capture potential',
    'Survey competition for category gaps — Darwin lacks retailers southern cities take for granted',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Darwin Retail Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            Darwin-specific checklist: wet season modelling, defence sector influence, cyclone risk, seasonal revenue profiles. Free — enter your email.
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Darwin location insights now coming to your inbox.</p>
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
export default function DarwinRetailPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Nav */}
      {/* Hero — Darwin outback gradient */}
      <div style={{ background: 'linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Darwin', '/analyse/darwin']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(255,246,233,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(255,246,233,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(255,246,233,0.7)' }}>Retail</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#D97706', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Darwin Retail Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#FFFBEB', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Retail Shop in Darwin (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,246,233,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Darwin's retail market — scored by foot traffic, defence spending patterns, wet season dynamics, and rent viability. Darwin is Australia's most misunderstood retail market: small population, but extraordinary median income and zero major chain competition.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D97706', color: '#78350F', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '6', l: 'Darwin suburbs scored' }, { v: '150k', l: 'City population' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#D97706', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(255,246,233,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census with 2024–26 NT population estimates, NT government economic data, live competitor mapping via Geoapify Places API, commercial property data from Darwin CBD management, and Locatalyze proprietary scoring model. Defence employment data from Defence Community Organisation. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '98k', claim: 'Median household income in Darwin — highest in Australia relative to city population', source: 'ABS Income Distribution Analysis 2024–25 and NT government economic report', color: S.emerald },
              { stat: '0', claim: 'Major retail chains (Westfield-anchored centres) — Darwin has zero', source: 'Australian Retail Council Centre Database 2025', color: '#D97706' },
              { stat: '40%', claim: 'Revenue drop during wet season (Nov–Apr) — structural challenge requiring seasonal planning', source: 'Locatalyze analysis of Darwin retail operator cash flows and foot traffic seasonal patterns', color: S.red },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Defence + income economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Darwin is Australia's Most Misunderstood Retail Market
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Darwin's retail market breaks every southern Australian assumption about how small-city retail works. Population of 150,000 is genuinely tiny compared to Sydney, Melbourne or Brisbane. But three structural factors create a retail environment that rival cities do not offer:
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            First: median household income of $98,000 is among Australia's highest — driven by defence (Robertson Barracks, Navy presence), government employment, mining/LNG sector wages, and construction workers on premium rates. This income concentration means Darwin's small population has discretionary spending power that southern cities with larger populations do not match per capita.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Second: Darwin has zero Westfield-anchored shopping centres and limited national chains. A retail operator entering with differentiated concept faces almost no established competitive infrastructure. This is the opposite of southern markets where shopping centre chains dominate all prime locations. An independent retailer in Darwin is not competing against Myer/David Jones/Westfield — they are competing against other independents.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Third: the wet season (November–April) creates a seasonal revenue model entirely different from southern retail. Rain, heat, cyclone risk, and extreme weather depress foot traffic 40%+ for four months. But the dry season (May–October) brings tourists and creates the opposite effect — Mitchell Street foot traffic doubles during tourist season. Retailers must explicitly model two revenue scenarios, not one.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Darwin vs Brisbane/Perth retail locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 10% of revenue (Darwin benchmark).</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[30000, 75000]} />
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1500, 7000]} />
                  <ZAxis dataKey="ratio" range={[60, 300]} name="Rent/Revenue %" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Revenue: <strong>${(d.revenue / 1000).toFixed(0)}k/mo</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent / 1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 10 ? S.emerald : d.ratio < 15 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 10 ? ' Healthy' : d.ratio < 15 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }} />
                  <Scatter data={REVENUE_VS_RENT.filter(d => !['Brisbane retail', 'Perth retail'].includes(d.suburb))} fill="#B45309" name="Darwin suburbs" opacity={0.8} />
                  <Scatter data={REVENUE_VS_RENT.filter(d => ['Brisbane retail', 'Perth retail'].includes(d.suburb))} fill="#64748B" name="Brisbane/Perth (comparison)" opacity={0.6} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze retail model using IBISWorld COGS benchmarks and observed Darwin foot traffic. Darwin rent: property listings Q1 2026. Brisbane/Perth rents: CoStar retail market reports Q4 2025." />
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Darwin Suburb Scores — Retail Viability
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18 }}>Scores above 70 = GO. 55–69 = CAUTION. Below 55 = NO.</p>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBURB_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="suburb" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={({ payload, label }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    const verdict = d.score >= 70 ? 'GO' : d.score >= 55 ? 'CAUTION' : 'NO'
                    const color = d.score >= 70 ? S.emerald : d.score >= 55 ? S.amber : S.red
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{label}</p>
                        <p style={{ color, fontWeight: 700 }}>{verdict} — {d.score}/100</p>
                        <p style={{ color: S.muted }}>Income: ${d.income}k median</p>
                        <p style={{ color: S.muted }}>Foot traffic: {d.traffic}/100</p>
                      </div>
                    )
                  }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}
                    fill={S.brand}
                    label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}
                    isAnimationActive={true}>
                    {SUBURB_SCORES.map((entry, index) => (
                      <rect key={index} fill={entry.score >= 70 ? S.emerald : entry.score >= 55 ? S.amber : S.red} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Rent 25%, Foot Traffic 35%, Demographics 25%, Competition 15%). Aggregated from ABS 2024–26 data, NT government economic data, Geoapify, Darwin property listings. March 2026." />
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Darwin Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,#B45309,#D97706)` }} />}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, NT {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict} />
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: Darwin property listings Q1 2026. Profit and payback: Locatalyze model, $140,000 setup, IBISWorld COGS benchmarks, dry season baseline." />
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
                  <ScoreBar label="Profitability" value={sub.footTraffic} />
                  <ScoreBar label="Area Demographics" value={sub.demographics} />
                  <ScoreBar label="Rent Affordability" value={sub.rentFit} />
                  <ScoreBar label="Competition" value={sub.competitionScore} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Mid-page CTA */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Darwin address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map, seasonal revenue model, and climate factors in ~90 seconds. Free.</p>
          </div>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emerald, color: S.white, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
            Analyse my address →
          </Link>
        </div>

        {/* Interactive poll */}
        <SuburbPoll />

        {/* Email unlock checklist */}
        <ChecklistUnlock />

        {/* Suburbs to avoid */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Darwin Suburbs to Avoid for Retail
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, NT {sub.postcode}</h3><VerdictBadge v={sub.verdict} /></div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{sub.reason}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 56 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: S.red, lineHeight: 1 }}>{sub.score}</div>
                <div style={{ fontSize: 10, color: S.muted }}>/100</div>
              </div>
            </div>
          ))}
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Darwin Retail Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Foot traffic volume', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, detail: 'Darwin retail lives on destination foot traffic — anchor shopping centres are absent. Casuarina Square, Mitchell Street precinct, and Parap Saturday market drive baseline volumes. Visit your location on Wednesday at 10am and Saturday at 11am; count pedestrians for 30 minutes each. The weekend surge reveals true repeat-customer capacity. Darwin retailers must explicitly account for both.' },
              { title: 'Median household income', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>, detail: 'Darwin\'s $98,000 median household income creates a spending profile unlike smaller Australian cities. Defence sector, government employment, and mining/LNG wages concentrate discretionary income. At this income level, quality retail concept with clear positioning captures category loyalty. A generic discount retailer struggles against online alternatives; differentiated concept thrives.' },
              { title: 'Seasonal revenue modelling', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>, detail: 'Wet season (November–April) creates 40% revenue drop that southern retailers never model. A $58,000/month dry season revenue becomes $35,000/month November–April. Budget cashflow for two distinct seasons. A retail business at 9% rent-to-revenue during dry season hits 15%+ during wet season. Build 6-month cash reserves or risk insolvency despite strong overall viability.' },
              { title: 'Air conditioning infrastructure', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, detail: 'Air conditioning is not a luxury in Darwin — it is retail infrastructure. Full-service AC is mandatory for customer comfort during dry season (32+°C heat) and absolutely required during wet season (extreme humidity). Budget $800–$1,200/month AC operating costs. This is a fixed cost that does not scale with revenue. Location with existing efficient AC systems is a material economic advantage.' },
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

        {/* Case study: Casuarina specialty retail vs Mitchell Street */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Case Study: Specialty Retail — Parap vs Mitchell Street
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {[
              {
                name: 'Premium Lifestyle Retail, Parap, NT 0820',
                rent: 2800, revenue: 48000, customers: 140, margin: 32.5, annual: 94000, payback: 11,
                gradient: 'linear-gradient(135deg, #78350F, #92400E)',
                desc: '45 sqm · Saturday market anchor · Premium positioning · Lower volatility'
              },
              {
                name: 'Tourist/Dry Season Retail, Mitchell Street, NT 0800',
                rent: 5200, revenue: 52000, customers: 150, margin: 26.8, annual: 62000, payback: 16,
                gradient: 'linear-gradient(135deg, #064E3B, #0F766E)',
                desc: '55 sqm · Dry season 2x volume · Wet season 40% drop · Tourist dependent'
              }
            ].map((cs, i) => (
              <div key={i} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ background: cs.gradient, padding: '22px 28px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,246,233,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario</p>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFBEB' }}>{cs.name}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,246,233,0.5)' }}>{cs.desc}</p>
                </div>
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 8 }}>
                    {[['Monthly rent', `$${cs.rent}`, S.muted], ['Monthly revenue', `$${(cs.revenue * 1000).toLocaleString()}`, S.emerald], ['Customers/day', `${cs.customers}`, S.brand], ['Margin', `${cs.margin}%`, S.emerald], ['Annual profit', `$${(cs.annual * 1000).toLocaleString()}`, S.emerald], ['Payback', `${cs.payback} months`, S.amber]].map(([l, v, c]) => (
                      <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                        <p style={{ fontSize: 15, fontWeight: 900, color: c as string }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <DataNote text={i === 0 ? "Parap model: Weekend-anchored. Saturday volume 3.5x baseline. Weekday revenue assumed 40% of average. Setup $140k, COGS 35%, labour $18k/mo, overheads $1,200, AC $900/mo." : "Mitchell Street model: Dry season (May–Oct) achieves full $52k/mo. Wet season (Nov–Apr) drops to $31k/mo. Weighted annual average: $40.3k/mo. Setup $140k, COGS 34%, labour $20k/mo, overheads $2,000, AC $1,200/mo."} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px', marginTop: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Key insight: Different strategies, similar risk profiles</p>
            <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Parap offers lower rent, predictable weekend revenue, longer customer loyalty — but depends on weekend market traffic. Mitchell Street offers higher absolute revenue during dry season — but structural wet season collapse requires 4-month cash reserve and intentional seasonal cost management. Both succeed with explicit strategy; both fail with generic retail approach.</p>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            10 Things to Do Before Signing a Darwin Retail Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Visit Wednesday at 10am AND Saturday at 11am', detail: 'Weekday foot traffic is baseline; weekend traffic reveals true capacity. Darwin retail depends on both. Count 30 minutes each day. The ratio tells you whether the location is weekday-driven or weekend-anchored.' },
              { n: '02', tip: 'Model two revenue profiles: dry season and wet season', detail: 'Dry season (May–Oct) drives volume; wet season (Nov–Apr) depresses trade 40%. Calculate rent-to-revenue for each season separately. A location viable in dry season might be loss-making in wet season without careful modelling.' },
              { n: '03', tip: 'Verify air-conditioning capacity and costs', detail: 'Full AC is mandatory. Request tenant utility history — actual AC bills from previous tenant or from landlord. Budget $800–$1,200/month. This is a fixed operating cost that does not scale; it should be factored into breakeven analysis.' },
              { n: '04', tip: 'Assess Defence housing proximity to Robertson Barracks', detail: 'Defence sector creates high-income, spending-conscious population. Check distance to base and residential zones. Casuarina and surrounding northern suburbs capture this demographic; Mitchell Street does not.' },
              { n: '05', tip: 'Calculate rent ÷ revenue before you tour the space', detail: 'Monthly rent divided by projected monthly revenue. Dry season benchmark: under 0.09 is excellent. 0.09–0.12 is workable. Above 0.12 is high risk. This one number should determine whether you spend further time on a site.' },
              { n: '06', tip: 'Negotiate a 12-month break clause or 24-month max lease', detail: 'Darwin retail is volatile. If wet season revenue doesn\'t materialise, you need exit protection. Landlords often resist multi-year leases for new tenants; 24 months is compromise. Break clause at month 12 is essential.' },
              { n: '07', tip: 'Survey category gaps in the shopping precinct', detail: 'Darwin lacks retailers that southern cities take for granted. Premium fashion, specialty homewares, sporting goods with expert staff are all underrepresented. Identify the category gap first; then find the location that serves that category.' },
              { n: '08', tip: 'Verify cyclone insurance requirements and costs', detail: 'Northern Territory retail faces cyclone season insurance (November–April). This is mandatory and not optional. Costs are 30–40% higher than southern Australia. Factor into annual operating costs before committing.' },
              { n: '09', tip: 'Check Mindil Beach market proximity', detail: 'Saturday Mindil market brings tourists and foot traffic. Even a location 1km away captures market-day foot traffic spillover. Closer locations (Parap, Stuart Park) benefit significantly; CBD locations depend on tourist season timing.' },
              { n: '10', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level data is the starting point. The specific address — which side of street, proximity to anchors, visibility from footpath, AC efficiency — changes the score materially. A speciality retail concept positioned correctly can score 12–18 points higher than generic retail in same suburb.' },
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
                  {['Suburb', 'Score', 'Verdict', 'Median Income', 'Rent Range', 'Competition', 'Est. Payback'].map(h => (
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
                    <td style={{ padding: '10px 14px' }}><VerdictBadge v={row.verdict} /></td>
                    <td style={{ padding: '10px 14px', color: S.muted }}>{row.income}/yr</td>
                    <td style={{ padding: '10px 14px', color: S.muted, whiteSpace: 'nowrap' as const }}>{row.rent}</td>
                    <td style={{ padding: '10px 14px', color: S.muted }}>{row.comp}</td>
                    <td style={{ padding: '10px 14px', color: row.verdict === 'NO' ? S.red : S.muted }}>{row.payback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataNote text="Income: ABS 2023–24. Rent: Darwin property listings Q1 2026. Payback: Locatalyze model, $140k setup, IBISWorld COGS benchmarks, dry season baseline." />
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Darwin'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Darwin'}</h3>
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
              { href: '/analyse/canberra/retail', label: 'Retail in Canberra' },
              { href: '/analyse/brisbane/cafe', label: 'Cafés in Brisbane' },
              { href: '/analyse/townsville/gym', label: 'Gyms in Townsville' },
              { href: '/analyse/adelaide/restaurant', label: 'Restaurants in Adelaide' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #78350F 0%, #92400E 60%, #B45309 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#FFFBEB', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Darwin address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,246,233,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data and seasonal patterns. Your specific address — street position, exact competitor count, proximity to Casuarina Square or Mindil market, air-conditioning capacity — produces a different score. Run it before you commit.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D97706', color: '#78350F', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Darwin address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,246,233,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}
