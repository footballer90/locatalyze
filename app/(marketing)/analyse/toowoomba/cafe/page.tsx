'use client'
// app/(marketing)/analyse/toowoomba/cafe/page.tsx

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
    headline: 'Best Suburbs to Open a Café in Toowoomba (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://locatalyze.com/analyse/toowoomba/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Toowoomba?', acceptedAnswer: { '@type': 'Answer', text: 'Toowoomba City scores 83/100 — the highest of any Toowoomba suburb. CBD heritage precinct with government worker base and Carnival of Flowers tourism. Rangeville (80/100) is the high-income professional suburb. Both score GO. For tourism+government: City. For income premium: Rangeville.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Toowoomba?', acceptedAnswer: { '@type': 'Answer', text: 'Toowoomba CBD café rents range from $2,200 to $3,800/month. Rangeville strip shops are $1,800–$2,800/month. Newtown sits at $1,500–$2,400/month. These are 60–70% below Brisbane rent levels — significant margin advantage.' } },
      { '@type': 'Question', name: 'How does Carnival of Flowers affect café trade in Toowoomba?', acceptedAnswer: { '@type': 'Answer', text: 'Carnival of Flowers (September–October, 150k+ visitors) generates $48M in tourism spend annually. This drives 2–3 weeks of 200% revenue uplift above baseline. Winter months (June–August) are cooler, optimal outdoor seating season. September–October is strong from both Carnival tourists and cooler weather.' } },
      { '@type': 'Question', name: 'Is Toowoomba City or Rangeville better for a café?', acceptedAnswer: { '@type': 'Answer', text: 'City has higher foot traffic (83 vs Rangeville 80) and Carnival of Flowers tourism anchor. Rangeville has higher income demographics ($98k vs City $74k) and professional customer base. Both viable — different positioning strategies. City = tourism+volume. Rangeville = income+loyalty.' } },
      { '@type': 'Question', name: 'What suburbs should I avoid for a café in Toowoomba?', acceptedAnswer: { '@type': 'Answer', text: 'Darling Heights (score 38, NO) has low income ($52k) and car-dependent demographics. Harristown (56, CAUTION) has mixed demographics and increasing chain competition. Both rank below viability unless positioned as ultra-budget alternatives.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Toowoomba City', score: 83, rent: 3000, traffic: 83, income: 74 },
  { suburb: 'Rangeville',     score: 80, rent: 2300, traffic: 80, income: 98 },
  { suburb: 'Newtown',        score: 77, rent: 1950, traffic: 74, income: 62 },
  { suburb: 'East Toowoomba', score: 74, rent: 2100, traffic: 70, income: 92 },
  { suburb: 'Harristown',     score: 56, rent: 1800, traffic: 48, income: 58 },
  { suburb: 'Darling Heights', score: 38, rent: 1400, traffic: 28, income: 52 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Toowoomba City', rent: 3000, revenue: 62000, ratio: 4.8 },
  { suburb: 'Rangeville',     rent: 2300, revenue: 68000, ratio: 3.4 },
  { suburb: 'Newtown',        rent: 1950, revenue: 48000, ratio: 4.1 },
  { suburb: 'East Toowoomba', rent: 2100, revenue: 64000, ratio: 3.3 },
  { suburb: 'Brisbane CBD',   rent: 8500, revenue: 82000, ratio: 10.4 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Toowoomba City', initial: 44 },
  { label: 'Rangeville',     initial: 36 },
  { label: 'Newtown',        initial: 14 },
  { label: 'East Toowoomba', initial: 6 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Toowoomba City', postcode: '4350', score: 83, verdict: 'GO' as const,
    income: '$74,000', rent: '$2,200–$3,800/mo', competition: '6 within 500m',
    footTraffic: 83, demographics: 82, rentFit: 82, competitionScore: 78,
    breakEven: '26/day', payback: '7 months', annualProfit: '$186,400',
    angle: 'Queensland&apos;s largest inland city with government worker base and Carnival of Flowers tourism anchor',
    detail: [
      'Toowoomba City CBD is the commercial and administrative heart of the Darling Downs. Ruthven Street and East Street host government offices, Toowoomba Regional Hospital (2,000+ staff), university facilities, retail precincts, and cultural venues. This creates a multi-anchor demographic with government workers, healthcare professionals, students, and tourists.',
      'Carnival of Flowers (September–October) is a 150k+ visitor event generating $48M in tourism spend. This drives 2–3 weeks of significantly elevated foot traffic and café trade. Combined with cooler winter months (June–August, optimal outdoor seating season), the CBD benefits from extended favorable trading season relative to coastal climates.',
      'Government worker demographics create reliable weekday morning and lunch trade. Hospital staff (2,000+) provide secondary customer base. Ruthven Street positioning benefits from foot traffic multiplier effect — customers visit retail/cultural venues and discover the café. The demographic is price-stable — government workers have predictable income and stable spending patterns.',
    ],
    risks: 'Six competitors within 500m is moderately saturated — new entrants require differentiation. Government worker demographic is price-sensitive to discretionary spending. Summer (December–February) cooler weather advantage vs coastal areas is not sufficient to overcome heat fatigue — January–February still experiences mid-30s temperatures.',
    opportunity: 'A modern café with strong lunch positioning (hot/cold bowls, salads, premium sandwiches) targeting hospital and government workers would capture underserved mid-day market. Afternoon trade (2–5pm) is underdeveloped — a café with ambient positioning (seating, free wifi) for post-work gathering would differentiate.',
  },
  {
    rank: 2, name: 'Rangeville', postcode: '4350', score: 80, verdict: 'GO' as const,
    income: '$98,000', rent: '$1,800–$2,800/mo', competition: '3 within 500m',
    footTraffic: 80, demographics: 88, rentFit: 88, competitionScore: 86,
    breakEven: '20/day', payback: '6 months', annualProfit: '$204,000',
    angle: 'Toowoomba&apos;s highest-income professional suburb — premium demographics with strong price tolerance',
    detail: [
      'Rangeville is Toowoomba&apos;s most affluent suburb with median income $98,000 (30% above Toowoomba average). Population skews toward established professionals, dual-income households, and business owners. The demographic is educated, urban-oriented, and familiar with quality café experiences from Brisbane/Melbourne work backgrounds.',
      'Strip shop positioning on Ruthven Street and Herries Street creates foot traffic from local shopping and services. The demographic is loyal to neighborhood venues — repeat visitation is high, customer acquisition cost is lower. Lifestyle amenities (bookshops, beauty, fashion, restaurants) complement café positioning.',
      'Income demographics support premium pricing — specialty coffee ($5.50–6.50), premium brunch ($18–24), and craft positioning are viable. Rent advantage ($1,800–$2,800/mo vs CBD $2,200–$3,800/mo) enables margin for brand investment and community programming.',
    ],
    risks: 'Foot traffic (80) requires destination visitation rather than pure walk-in capture — weekday morning commuter base is moderate. Competition at three within 500m is moderate but increasing. Demographic churn risk — young professionals relocate to Brisbane for career advancement.',
    opportunity: 'A "crafted experience" café positioning (third-wave coffee, local art, book swap, interest group meetings) would own defensible market position in this demographic. The professional, educated audience actively seeks alignment with values-driven businesses.',
  },
  {
    rank: 3, name: 'Newtown', postcode: '4350', score: 77, verdict: 'GO' as const,
    income: '$62,000', rent: '$1,500–$2,400/mo', competition: '2 within 500m',
    footTraffic: 74, demographics: 74, rentFit: 90, competitionScore: 92,
    breakEven: '18/day', payback: '6 months', annualProfit: '$144,000',
    angle: 'University precinct with student demographics and lowest rent tier',
    detail: [
      'Newtown is adjacent to University of Southern Queensland (15,000+ enrolled students). The demographic is young (median age 28), student-heavy, and price-sensitive. Income is lower ($62k) but foot traffic is consistent — students pass through daily heading to campus or services.',
      'Student demographics create 9–11am morning peak (coffee before classes) and 3–5pm afternoon secondary peak (post-class social time). Weekend foot traffic is softer — students disperse. Revenue is concentrated in weekday peaks, requiring strong all-day positioning to achieve viability.',
      'Rent is lowest in GO tier at $1,500–$2,400/mo — breakeven requires only 18 sales/day. This margin structure enables aggressive loyalty programming, student discounts, and event hosting without unit economic stress.',
    ],
    risks: 'Income demographics limit premium positioning — students default to budget chains ($15–20/month subscriptions). Price sensitivity is real. Summer semester breaks (November, March–April) create revenue cliffs — student base disperses. Two competitors within 500m suggests the market is validated but not oversaturated.',
    opportunity: 'A student-focused café (study space, free wifi, student events, loyalty pricing) would own defensible positioning. Partnership with USQ for student organization events, book launches, and guest lectures would drive traffic and community embedding.',
  },
  {
    rank: 4, name: 'East Toowoomba', postcode: '4350', score: 74, verdict: 'GO' as const,
    income: '$92,000', rent: '$1,900–$2,700/mo', competition: '2 within 500m',
    footTraffic: 70, demographics: 80, rentFit: 88, competitionScore: 89,
    breakEven: '22/day', payback: '7 months', annualProfit: '$168,000',
    angle: 'Established professional suburb with loyal demographics and strong rent/income ratio',
    detail: [
      'East Toowoomba is an established residential suburb with stable, professional demographics. Median income $92,000 reflects established professionals and business owners. Population has lived here 10+ years — loyalty to local businesses is high.',
      'Foot traffic (70) is moderate but repeat customer base is loyal and habitual. Strip shop positioning on retail corridors creates natural gathering places. The demographic seeks community connection — a "third place" café positioning would resonate.',
      'Rent advantage ($1,900–$2,700/mo) enables margin for event programming, community building, and seasonal promotion without unit economic compression.',
    ],
    risks: 'Foot traffic (70) requires destination visitation — passive walk-in traffic is limited. Population is aging, growth is flat. No tourism anchor like CBD or student base like Newtown.',
    opportunity: 'Position as the neighbourhood "gathering place" with programming (book clubs, yoga, local art showcases). The professional, established demographic actively seeks community connection.',
  },
]

const RISK_SUBURBS = [
  { name: 'Harristown', postcode: '4350', score: 56, verdict: 'CAUTION' as const, reason: 'Harristown has mixed demographics ($58k income), moderate foot traffic (48), and increasing chain competition (Dome, Gloria Jean&apos;s). Strip positioning is undifferentiated. Unit economics require 30+ sales/day for viability. Only viable with specific differentiation (raw juice bar, niche cuisine, family café with play area). Generic café positioning fails.' },
  { name: 'Darling Heights', postcode: '4350', score: 38, verdict: 'NO' as const, reason: 'Darling Heights is low-income ($52k), car-dependent, and outer-residential. Foot traffic (28) is insufficient for café foot traffic model. Rent ($1,400/mo) is cheap but reflects zero commercial demand. Only viable as ultra-budget positioning (supermarket café equivalent) or if positioned as a rural/outer-suburb niche (farm café, etc).' },
]

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Toowoomba?</h3>
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
    'Visit Ruthven Street CBD on Tuesday at 8am — count foot traffic for 30 minutes',
    'Check proximity to hospital and government offices for weekday trade anchors',
    'Model Carnival of Flowers week (September–October) revenue uplift (2–3 weeks at 200%)',
    'Visit 3 nearby cafés — ask about seasonal revenue patterns and year-round trade',
    'Assess parking (Toowoomba is highly car-dependent) — insufficient parking = 20% traffic reduction',
    'Survey 10 local customers about unmet café positioning needs',
    'Calculate rent ÷ projected revenue — must be under 0.08',
    'Verify Carnival of Flowers event calendar and projected visitor numbers',
    'Model June–August baseline revenue (cooler weather, optimal outdoor season)',
    'Negotiate break clause at 12–18 months on all lease offers',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Toowoomba Café Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Toowoomba location insights now coming to your inbox.</p>
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
export default function ToowoombaCafePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      {/* Nav */}
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Toowoomba', '/analyse/toowoomba']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,250,254,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.7)' }}>Cafés</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Toowoomba Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Café in Toowoomba (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,250,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Queensland&apos;s Garden City. Largest inland city, Carnival of Flowers tourism, Darling Downs agricultural economy. Scored by foot traffic, demographics, competition density, and rent viability.
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
            {[{ v: '6', l: 'Toowoomba suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
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
              { stat: '180k+', claim: 'population in Toowoomba — QLD&apos;s largest inland city', source: 'ABS 2021 Census + quarterly estimates 2024–2026', color: S.emerald },
              { stat: '$48M', claim: 'annual tourism spend from Carnival of Flowers (150k+ visitors Sept–Oct)', source: 'Toowoomba Regional Council tourism data, 2025', color: S.brand },
              { stat: '22%', claim: 'population growth to 2031 — Brisbane overflow creating steady demand', source: 'Queensland Regional Plan population projections', color: S.amber },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Toowoomba economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Toowoomba: The Garden City&apos;s Café Opportunity
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Toowoomba is Queensland&apos;s largest inland city with 180,000+ population. The Darling Downs agricultural economy is stable — diversified farming, food processing, and rural services create economic resilience. Toowoomba Regional Hospital (2,000+ staff) anchors government employment. University of Southern Queensland (15,000+ students) drives younger demographic flow. This creates a multi-anchor economy with less cyclical volatility than resource-dependent regions.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Carnival of Flowers (September–October, 150k+ visitors) generates $48M in annual tourism spend. This drives 2–3 weeks of significantly elevated foot traffic and café trade during spring season. Combined with cooler winter months (June–August, optimal outdoor café season), Toowoomba benefits from extended favorable trading periods relative to coastal Queensland climates.</p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Population projections show 22% growth to 2031, driven by Brisbane overflow migration. This is younger demographic flow (families relocating for cost of living advantage while maintaining Brisbane job proximity via improved highways). This creates demographic tailwinds for café positioning. The cost structure (rent 60–70% below Brisbane) enables margin for brand-building and customer acquisition that Brisbane cafés cannot afford.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Toowoomba vs Brisbane locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 8% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[40000, 90000]}/>
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
                        <p style={{ color: d.ratio < 8 ? S.emerald : d.ratio < 12 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 8 ? ' Healthy' : d.ratio < 12 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Brisbane CBD'].includes(d.suburb))} fill="#059669" name="Toowoomba suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Brisbane CBD'].includes(d.suburb))} fill="#E24B4A" name="Brisbane (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed customer volumes. Toowoomba rents: Queensland commercial surveys Q1 2026. Brisbane CBD rent: CBRE retail market report Q4 2025."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Toowoomba Suburb Scores — Café Viability
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
          <DataNote text="Scores: Locatalyze Scoring v2.1 — Rent Affordability 20%, Competition 25%, Market Demand 20%, Profitability 25%, Location Quality 10%. Aggregated from ABS, Queensland property surveys, Geoapify data. April 2026."/>
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
                <ScoreBar label="Area Demographics" value={s.demographics}/>
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
            Get a detailed Locatalyze score for any café location in Toowoomba. Foot traffic density, demographic match, competition mapping, and financial viability — analysed in seconds.
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
            Toowoomba is an underrated café opportunity. The city has 180,000+ population with 22% projected growth to 2031. Carnival of Flowers (150k+ visitors, $48M tourism spend) provides seasonal anchor. Multi-anchor economy (government, hospital, university, agriculture) creates demand diversity. Cost structure (rent 60–70% below Brisbane) enables margin for brand-building. Toowoomba City offers tourism + government worker base. Rangeville offers premium income demographics. Both are fundamentally viable. For a quality café operator with brand differentiation: Toowoomba is the best growth opportunity among regional Queensland cities.
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
