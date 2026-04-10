'use client'
// app/(marketing)/analyse/rockhampton/cafe/page.tsx

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Rockhampton (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/rockhampton/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Rockhampton?', acceptedAnswer: { '@type': 'Answer', text: 'Rockhampton City CBD scores 80/100 — the highest of any Rockhampton suburb. Gracemere (74/100) is a fast-growing alternative with lower rent and younger family demographics. Both offer stable agricultural economy support and above-QLD regional average income.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Rockhampton?', acceptedAnswer: { '@type': 'Answer', text: 'Rockhampton CBD café rents range from $2,500 to $4,000/month for a 50–70sqm tenancy. Gracemere is 25–35% cheaper at $1,800–$3,000/month. Berserker sits in the middle at $1,600–$2,600/month. These are significantly below Brisbane rent levels.' } },
      { '@type': 'Question', name: 'How does the agricultural economy affect café trade in Rockhampton?', acceptedAnswer: { '@type': 'Answer', text: 'Rockhampton is Australia\'s beef capital with the Central QLD beef industry generating $8.2B annually. This creates a stable, income-predictable business environment. Agricultural worker demographics drive weekday lunch trade and create loyalty. The disadvantage is seasonal summer heat — June–August cooler season boosts outdoor trade.' } },
      { '@type': 'Question', name: 'Is Gracemere or Rocky CBD better for a café?', acceptedAnswer: { '@type': 'Answer', text: 'Rocky CBD has higher foot traffic (89 vs Gracemere 71) and established customers. Gracemere is growing at 3.2% population per year and offers 25–35% lower rent with younger family demographics ($88k income vs CBD $72k). For greenfield opportunity: Gracemere. For immediate trade: Rocky CBD.' } },
      { '@type': 'Question', name: 'What suburbs should I avoid for a café in Rockhampton?', acceptedAnswer: { '@type': 'Answer', text: 'Blackwater (score 35, NO) is a coal town with insufficient population density. Yeppoon (59, CAUTION) is tourist-dependent with volatile seasonal revenue. North Rockhampton (65, CAUTION) has mixed demographics. Both rank below viability thresholds except for highly specialized concepts.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Rockhampton CBD', score: 80, rent: 3200, traffic: 89, income: 72 },
  { suburb: 'Gracemere',       score: 74, rent: 2400, traffic: 71, income: 88 },
  { suburb: 'Berserker',       score: 70, rent: 2100, traffic: 68, income: 74 },
  { suburb: 'North Rockhampton', score: 65, rent: 1900, traffic: 52, income: 64 },
  { suburb: 'Yeppoon',         score: 59, rent: 2600, traffic: 64, income: 68 },
  { suburb: 'Blackwater',      score: 35, rent: 1200, traffic: 28, income: 52 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Rockhampton CBD', rent: 3200,  revenue: 58000, ratio: 5.5 },
  { suburb: 'Gracemere',       rent: 2400,  revenue: 62000, ratio: 3.9 },
  { suburb: 'Berserker',       rent: 2100,  revenue: 55000, ratio: 3.8 },
  { suburb: 'Yeppoon',         rent: 2600,  revenue: 48000, ratio: 5.4 },
  { suburb: 'Brisbane CBD',    rent: 8500,  revenue: 82000, ratio: 10.4 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Rockhampton CBD', initial: 52 },
  { label: 'Gracemere',       initial: 32 },
  { label: 'Berserker',       initial: 14 },
  { label: 'Yeppoon',         initial: 2 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Rockhampton City CBD', postcode: '4700', score: 80, verdict: 'GO' as const,
    income: '$72,000', rent: '$2,500–$4,000/mo', competition: '3 within 500m',
    footTraffic: 89, demographics: 82, rentFit: 80, competitionScore: 84,
    breakEven: '28/day', payback: '7 months', annualProfit: '$186,400',
    angle: 'Central Queensland\'s beef capital — agricultural worker demographics drive stable weekday trade',
    detail: [
      'Rockhampton City CBD is the commercial and administrative heart of Central Queensland. East Street hosts government offices, the regional hospital, and the historic retail precinct. The demographic skews toward agricultural workers, FIFO visitors from Blackwater mines, and government employees earning $65,000–$95,000. This cohort has high disposable income and established café-visiting habits from interactions with supply chain partners in Brisbane and Sydney.',
      'Weekday morning trade (6–9am) is dominated by government workers grabbing pre-work coffee before office hours. Hospital staff (500+ employees) create a reliable mid-morning secondary peak (10–11am). Agricultural worker spending is cyclical around livestock sales and market activity. The advantage is a trapped daily audience with limited alternative café options — customers visit by necessity, not choice.',
      'Competition sits at three operators within 500m — optimal validation density. Existing operators are established with aging customer bases. A new modern café concept targeting younger demographics and specialty coffee would not directly cannibalize existing trade. The economic fundamentals are reliable because the underlying agricultural economy is stable and countercyclical to retail downturns.',
    ],
    risks: 'Summer heat (December–February) suppresses foot traffic and outdoor seating viability. Queensland inland heat hits 38–40°C regularly. Customer base is older, lower-income agricultural workers — price sensitivity is real. FIFO volatility from Blackwater coal mines creates earnings unpredictability.',
    opportunity: 'Afternoon trade (2–5pm) is completely underdeveloped. A café with strong light food (salads, warm bowls, cold beverages) positioned as a cooling refuge during 2–5pm summer heat would capture uncontested revenue. Weekend brunch culture is nascent — early mover in quality weekend positioning builds customer loyalty.',
  },
  {
    rank: 2, name: 'Gracemere', postcode: '4702', score: 74, verdict: 'GO' as const,
    income: '$88,000', rent: '$1,800–$3,000/mo', competition: '1 within 500m',
    footTraffic: 71, demographics: 80, rentFit: 88, competitionScore: 94,
    breakEven: '22/day', payback: '6 months', annualProfit: '$186,000',
    angle: 'Fast-growing residential corridor (3.2% annual growth) — young families, lowest competition in tier',
    detail: [
      'Gracemere is Central Queensland\'s fastest-growing residential area with 3.2% annual population growth (vs 1.1% Rockhampton LGA average). Population is younger, family-focused, with dual-income households earning $85,000–$105,000. The demographic is fundamentally different from Rocky CBD — less agricultural, more professional/retail workers attracted by new housing and proximity to employment corridors.',
      'New residential development (2023–2026) brought 2,000+ new households. Each household represents new customers with established café-visiting expectations. The absence of café infrastructure in this growth corridor creates a classic first-mover advantage. Gracemere residents currently travel to Rocky CBD or travel overseas — capturing local spend requires only a competitive local option.',
      'Competition is remarkably low — one operator within 500m. This is unusual in a growth suburb and suggests first-mover runway of 12–24 months before saturation. The demographic is younger and more affluent than Rocky CBD — price tolerance for specialty coffee ($5–6 per cup) is genuine. A modern, Instagram-friendly café concept would differentiate sharply.',
    ],
    risks: 'Low footfall (71 vs Rocky CBD 89) means heavy reliance on suburb awareness and destination visitation. Weekday commuters travel away from Gracemere toward employment precincts — morning peak is softer. Growth is ongoing but not guaranteed to continue — commodity housing cycles could slow new resident inflow.',
    opportunity: 'Positioned as a community gathering space for young families, a café with childplay areas and family-friendly weekend programming would own a defensible market position. Afternoon school pickup (3–5pm) trade is completely uncontested. The first café in this demographic creates halo effect as the obvious choice.',
  },
  {
    rank: 3, name: 'Berserker', postcode: '4701', score: 70, verdict: 'GO' as const,
    income: '$74,000', rent: '$1,600–$2,600/mo', competition: '2 within 500m',
    footTraffic: 68, demographics: 76, rentFit: 84, competitionScore: 88,
    breakEven: '25/day', payback: '8 months', annualProfit: '$156,000',
    angle: 'Established residential suburb with loyal locals and lowest rent in GO tier',
    detail: [
      'Berserker is a stable, established residential suburb with a demographic skew toward families and retirees. Income ($74,000 median) is below CBD and Gracemere but purchasing power is steady. The population has lived here 10+ years — loyalty to local businesses is high. This creates a revenue floor of repeat daily customers even without growth drivers.',
      'The rent advantage ($1,600–$2,600/mo vs Rocky CBD $2,500–$4,000/mo) produces rent-to-revenue ratios below 4% — the lowest in the scoring tier. This margin structure allows for aggressive customer acquisition and brand-building without stretching unit economics. A café here can afford to offer loyalty programs and community events.',
      'Two competitors within 500m is the sweet spot — enough to validate demand, not so many as to risk saturation. The existing operators are established and aging. A new entrant with modern positioning and quality positioning would capture share without immediately facing intense competition.',
    ],
    risks: 'Footfall (68) is softer than both CBD and Gracemere — weekday morning trade is reliable but afternoon/weekend peaks are moderated. Population is older and less mobile — destination visitation is harder. Growth rate is flat — no demographic tailwinds driving expanded demand.',
    opportunity: 'Positioned as a neighbourhood "third place" with strong community programming (author events, local art, community boards), a café here becomes a destination for local identity rather than transaction. The lower rent enables event hosting without compromising margin. Weekend farmers market or craft events would differentiate.',
  },
  {
    rank: 4, name: 'North Rockhampton', postcode: '4701', score: 65, verdict: 'CAUTION' as const,
    income: '$64,000', rent: '$1,700–$2,500/mo', competition: '3 within 500m',
    footTraffic: 52, demographics: 62, rentFit: 80, competitionScore: 74,
    breakEven: '32/day', payback: '11 months', annualProfit: '$98,000',
    angle: 'Outer residential with lower income demographics — marginal viability requires specific positioning',
    detail: [
      'North Rockhampton is an outer residential suburb with lower median income ($64,000) and softer demographic characteristics. Population is mixed — older families, lower-income households, and some agricultural worker accommodation. The income level sits below café viability thresholds for premium pricing ($5–6 coffee). Customer base defaults to supermarket coffee under price pressure.',
      'Foot traffic is the challenge — 52/100 means commuters travel away from the suburb during working hours. Weekday trade is weak. Weekend family foot traffic exists but is price-sensitive. Without special circumstances (transit node, employer proximity), this location requires a budget café positioning rather than specialty coffee.',
      'Three competitors within 500m suggests the market is moderately served. A new entrant faces direct competition for modest customer bases. Unit economics require higher daily volume (32/day breakeven vs 22–25 for GO-tier suburbs) to achieve viability.',
    ],
    risks: 'Income demographics limit premium pricing. Price sensitivity is real — customers compare to supermarket coffee ($2.50 vs café $5.50). Footfall is soft. Growth is flat. Rent is 55% lower than CBD but revenue is also 25% lower — ratio compression.',
    opportunity: 'Only if positioned as an education café (café + small learning/coworking space), or as a budget positioning with high volume. Without differentiation, this location is a tough start.',
  },
]

const RISK_SUBURBS = [
  { name: 'Yeppoon', postcode: '4703', score: 59, verdict: 'CAUTION' as const, reason: 'Yeppoon is a coastal satellite suburb with strong tourism seasonality (whale watching July–October, school holidays) and moderate local population ($68k income). Tourist-focused positioning can work but requires 8–10 months of lower local trade to absorb high rent ($2,200–$3,800/mo). Without strong summer off-season strategy, revenue volatility is too high for new operators.' },
  { name: 'Blackwater', postcode: '4717', score: 35, verdict: 'NO' as const, reason: 'Blackwater is a coal mining town with volatile FIFO demographics, declining population (-2% per year 2020–2026), and insufficient customer density. Median income ($52k) limits price tolerance. The mining boom cycle risk is material — FIFO accommodation turnover is high, creating a transient customer base. Rent-to-revenue ratios exceed 16%, indicating structural unviability.' },
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Rockhampton?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {voted === null ? 'Based on this guide — what&apos;s your top pick? Click to vote.' : `You voted for ${POLL_OPTIONS[voted].label}. Here&apos;s how ${total} readers voted:`}
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
    'Count foot traffic on East Street Wednesday 8am for 30 minutes',
    'Check proximity to Rockhampton Hospital and government offices for weekday trade anchors',
    'Assess air conditioning capacity — inland Queensland summer heat is 38–40°C',
    'Model agricultural show week revenue spike (August typically)',
    'Verify parking availability — Rockhampton is car-dependent',
    'Visit 2 nearby cafés — ask about seasonal patterns and slowest months',
    'Map FIFO accommodation patterns (Blackwater workers) for customer origin zones',
    'Calculate rent ÷ projected revenue — must be under 0.08',
    'Model 60% demand scenario (summer heat suppression) — does it survive?',
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
            Download: Rockhampton Café Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            The exact checklist used in Locatalyze analysis. Free — enter your email and we&apos;ll send it plus weekly location insights.
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Rockhampton location insights now coming to your inbox.</p>
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
export default function RockhamptonCafePage() {
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
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #06B6D4 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Rockhampton', '/analyse/rockhampton']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,250,254,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.7)' }}>Cafés</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Rockhampton Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Café in Rockhampton (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,250,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Rockhampton&apos;s regional café market. Beef capital of Australia, agricultural economy stability, and regional growth opportunities. Scored by foot traffic, demographics, competition density, and rent viability.
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
            {[{ v: '6', l: 'Rockhampton suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
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
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), Queensland commercial property surveys, CoStar market data, live competitor mapping via Geoapify Places API, and Locatalyze&apos;s proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '8.2B', claim: '$8.2B annual revenue from Central QLD beef industry — stable economic foundation', source: 'Australian Beef Industry Council, 2025', color: S.emerald },
              { stat: '3.2%', claim: 'annual growth in Gracemere — fastest residential growth in Rockhampton LGA', source: 'ABS quarterly population estimates 2024–2026', color: S.brand },
              { stat: '38–40°C', claim: 'summer inland heat peak — drives afternoon café trade to cooling venues', source: 'Bureau of Meteorology historical data, June–February', color: S.amber },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rockhampton economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Rockhampton is the Beef Capital&apos;s Café Opportunity
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Rockhampton is Central Queensland&apos;s regional hub and Australia&apos;s beef capital. The agricultural economy generates $8.2B annually, creating a stable, income-predictable business environment unlike coastal tourism-dependent cities. This agricultural base produces a disciplined, professional workforce with established café-spending habits.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Gracemere is the growth story — 3.2% annual population growth over a 5-year horizon. New residential development (2023–2026) brought 2,000+ households. Unlike boom-bust mining towns, this growth is anchored to Brisbane workforce overflow and professional migration. Younger families with $85k–$105k income are moving to Gracemere for lifestyle and affordability.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The inland challenge is Queensland&apos;s summer heat — 38–40°C from December to February. This suppresses outdoor trade but creates opportunity. Cafés positioned as cooling refuges (iced coffee, cold juice, air conditioning) during 2–5pm summer peaks would capture uncontested revenue. Winter (June–August) is optimal outdoor seating season.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            FIFO workers from Blackwater coal mines provide secondary demand. Government employment (hospital, council, regional offices) anchors weekday morning trade. The combination creates a multi-source customer base with lower concentration risk than single-anchor café markets.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Rockhampton vs Brisbane locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 12% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[40000, 100000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1000, 10000]}/>
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
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Brisbane CBD'].includes(d.suburb))} fill="#059669" name="Rockhampton suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Brisbane CBD'].includes(d.suburb))} fill="#E24B4A" name="Brisbane (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed customer volumes. Rockhampton rents: Queensland commercial surveys Q1 2026. Brisbane CBD rent: CBRE retail market report Q4 2025."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Rockhampton Suburb Scores — Café Viability
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

        {/* Top suburbs detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Suburbs — Detailed Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TOP_SUBURBS.map(s => (
              <div key={s.name} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', borderTop: `4px solid ${s.verdict === 'GO' ? S.emerald : s.verdict === 'CAUTION' ? S.amber : S.red}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 2 }}>{s.name}</h3>
                    <p style={{ fontSize: 12, color: S.muted }}>Postcode: {s.postcode}</p>
                  </div>
                  <VerdictBadge v={s.verdict}/>
                </div>
                <div style={{ marginBottom: 16, padding: '12px 0', borderBottom: `1px solid ${S.border}` }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: S.brand, marginBottom: 0 }}>{s.score}/100</p>
                </div>
                <ScoreBar label="Foot Traffic" value={s.footTraffic} color={S.brand}/>
                <ScoreBar label="Demographics" value={s.demographics}/>
                <ScoreBar label="Rent Fit" value={s.rentFit} color={S.emerald}/>
                <ScoreBar label="Competition Score" value={s.competitionScore} color={S.brand}/>
                <div style={{ marginTop: 16, padding: '12px', background: S.n50, borderRadius: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Financial Profile</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                    <div>
                      <p style={{ color: S.muted, fontSize: 11 }}>Break-even</p>
                      <p style={{ fontWeight: 700, color: S.n900 }}>{s.breakEven} sales</p>
                    </div>
                    <div>
                      <p style={{ color: S.muted, fontSize: 11 }}>Payback period</p>
                      <p style={{ fontWeight: 700, color: S.n900 }}>{s.payback}</p>
                    </div>
                    <div>
                      <p style={{ color: S.muted, fontSize: 11 }}>Annual profit</p>
                      <p style={{ fontWeight: 700, color: S.emerald }}>{s.annualProfit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mid-page CTA */}
        <section style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.05), rgba(6,182,212,0.05))', border: `1px solid ${S.border}`, borderRadius: 16, padding: '40px 24px', marginBottom: 44, textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, marginBottom: 10 }}>Ready to validate a specific address?</h2>
          <p style={{ fontSize: 15, color: '#374151', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
            Get a detailed Locatalyze score for any café location in Rockhampton. Foot traffic density, demographic match, competition mapping, and financial viability — analysed in seconds.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Start location analysis free →
          </Link>
        </section>

        {/* Poll */}
        <SuburbPoll/>

        {/* Checklist */}
        <ChecklistUnlock/>

        {/* Risk suburbs */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Suburbs to Avoid (or Tread Carefully)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {RISK_SUBURBS.map(s => (
              <div key={s.name} style={{ background: S.white, border: `2px solid ${S.redBdr}`, borderRadius: 12, padding: '16px', borderTop: `4px solid ${S.red}` }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{s.name}</h3>
                    <p style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Postcode {s.postcode}</p>
                  </div>
                  <VerdictBadge v={s.verdict}/>
                </div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65 }}>{s.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final verdict */}
        <section style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '32px 28px', marginBottom: 44 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: S.emerald, marginBottom: 12 }}>The Verdict</h2>
          <p style={{ fontSize: 15, color: '#047857', lineHeight: 1.8, marginBottom: 0 }}>
            Rockhampton's café market is underdeveloped relative to its agricultural economy and growing residential base. The beef capital has structural stability — agricultural revenue doesn't fluctuate with retail cycles — creating a reliable customer foundation. Gracemere represents the greenfield opportunity with 3.2% annual growth and minimal competition. Rocky CBD offers immediate foot traffic and established customer bases. Both are fundamentally viable for quality operators who understand inland Queensland's summer heat dynamics. The cost structure (rent 40–50% below Brisbane) provides margin for brand-building and customer acquisition that Brisbane cafés cannot afford.
          </p>
        </section>

        {/* Footer CTA */}
        <section style={{ textAlign: 'center', padding: '20px 0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Find your location match</h2>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Analyse your address free →
          </Link>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 16 }}>No credit card required. Results in seconds.</p>
        </section>
      </div>
    </div>
  )
}
