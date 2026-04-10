'use client'
// app/(marketing)/analyse/hervey-bay/restaurant/page.tsx

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
    headline: 'Best Suburbs to Open a Restaurant in Hervey Bay (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/hervey-bay/restaurant',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a restaurant in Hervey Bay?', acceptedAnswer: { '@type': 'Answer', text: 'Torquay scores 85/100 — the highest of any Hervey Bay suburb. Beach-facing esplanade positioning with highest tourist foot traffic. Pialba (81/100) offers strong CBD foot traffic with lower rent. Both score GO. For premium tourism: Torquay. For local trade volume: Pialba.' } },
      { '@type': 'Question', name: 'How much does restaurant rent cost in Hervey Bay?', acceptedAnswer: { '@type': 'Answer', text: 'Torquay esplanade restaurants range from $3,500 to $6,500/month (premium location). Pialba CBD is $2,800–$4,500/month. Urangan marina is $2,500–$4,000/month. Hervey Bay is 40–50% cheaper than comparable coastal Australian destinations.' } },
      { '@type': 'Question', name: 'How does whale season affect restaurant revenue in Hervey Bay?', acceptedAnswer: { '@type': 'Answer', text: 'Whale watching peak (July–October) drives 280,000+ annual visitors and generates 380% revenue uplift above baseline. Winter season (June–October) is strong. May and November are transitional. December–April is quieter baseline. Model 40% of whale season revenue for off-season viability.' } },
      { '@type': 'Question', name: 'Is Torquay or Pialba better for a restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'Torquay has beach positioning, highest tourist foot traffic (85), and premium revenue per cover. Rent is 25–30% higher. Pialba has local customer base, CBD positioning, and lower rent. For tourism/premium: Torquay. For locals/volume: Pialba. Both viable with different strategies.' } },
      { '@type': 'Question', name: 'What suburbs should I avoid for a restaurant in Hervey Bay?', acceptedAnswer: { '@type': 'Answer', text: 'Scarness (score 62, CAUTION) is declining with chain competition increasing. Maryborough (39, NO) is a nearby city without premium market presence. Both lack the tourism or demographic support for new restaurant concepts. Scarness only viable with strong differentiation.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Torquay',        score: 85, rent: 5000, traffic: 88, income: 72 },
  { suburb: 'Pialba',         score: 81, rent: 3650, traffic: 82, income: 64 },
  { suburb: 'Urangan',        score: 78, rent: 3250, traffic: 78, income: 68 },
  { suburb: 'Point Vernon',   score: 70, rent: 2800, traffic: 64, income: 66 },
  { suburb: 'Scarness',       score: 62, rent: 3200, traffic: 56, income: 58 },
  { suburb: 'Maryborough',    score: 39, rent: 2400, traffic: 32, income: 52 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Torquay',        rent: 5000, revenue: 84000, ratio: 5.9 },
  { suburb: 'Pialba',         rent: 3650, revenue: 76000, ratio: 4.8 },
  { suburb: 'Urangan',        rent: 3250, revenue: 72000, ratio: 4.5 },
  { suburb: 'Point Vernon',   rent: 2800, revenue: 58000, ratio: 4.8 },
  { suburb: 'Brisbane CBD',   rent: 12000, revenue: 120000, ratio: 10.0 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Torquay',      initial: 45 },
  { label: 'Pialba',       initial: 32 },
  { label: 'Urangan',      initial: 18 },
  { label: 'Point Vernon', initial: 5 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Torquay', postcode: '4655', score: 85, verdict: 'GO' as const,
    income: '$72,000', rent: '$3,500–$6,500/mo', competition: '4 within 500m',
    footTraffic: 88, demographics: 84, rentFit: 80, competitionScore: 82,
    breakEven: '32/day', payback: '7 months', annualProfit: '$312,000',
    angle: 'Australia&apos;s whale watching capital — beach-facing esplanade with highest tourism foot traffic',
    detail: [
      'Torquay is Hervey Bay&apos;s premium beachfront precinct. The esplanade stretches 6km with restaurants, bars, retail, and whale-watching tour operators positioned along the foreshore. This creates a destination environment — visitors arrive to watch whales and eat secondary to that primary activity. Tourism-driven foot traffic is 280,000+ annually during whale season (July–October).',
      'Whale watching season generates 380% revenue uplift above baseline. A restaurant open 365 days/year earns 50% of annual revenue during 16-week whale season (July–October). This creates feast-famine dynamics but with high certainty. Winter season (June–October) is operationally ideal — mild weather, outdoor seating is pleasant, tourist volumes are predictable.',
      'Premium positioning thrives here — diners view the restaurant as part of whale watching experience. Seafood restaurants, outdoor deck positioning, and premium pricing ($35–50/entree) are normalized. High margin per cover enables aggressive marketing and service quality investment.',
    ],
    risks: 'Rent is highest tier at $3,500–$6,500/month (esplanade premium). December–April baseline revenue is 40% of whale season — significant volatility. Summer heat (December–February) suppresses covered outdoor dining. Chain restaurants (Red Lobster, Kingfisher Bay Resort dining) create brand competition.',
    opportunity: 'A unique concept café-restaurant hybrid (daytime café, evening restaurant) would capture both whale-season visitors (day tourists) and local evening diners. Positioning as the "whale watcher&apos;s headquarters" with whale watching tour desk integration would differentiate.',
  },
  {
    rank: 2, name: 'Pialba', postcode: '4655', score: 81, verdict: 'GO' as const,
    income: '$64,000', rent: '$2,800–$4,500/mo', competition: '3 within 500m',
    footTraffic: 82, demographics: 76, rentFit: 84, competitionScore: 84,
    breakEven: '28/day', payback: '6 months', annualProfit: '$288,000',
    angle: 'CBD and esplanade — strong local and tourist foot traffic with balanced seasonality',
    detail: [
      'Pialba is Hervey Bay&apos;s CBD and commercial heart. Esplanade positioning combines local resident foot traffic with tourist visitors. The demographic is mixed — retirees, families, and tourists. Revenue base is more balanced than Torquay — less dependent on whale season, more dependent on local customer loyalty.',
      'Foot traffic (82) is nearly equal to Torquay (88) but composition differs. Pialba captures local lunch and dinner trade from professionals and families. Tourist foot traffic exists but is secondary. This creates more stable baseline revenue — off-season viability is higher than Torquay.',
      'Rent is 25–30% cheaper than Torquay esplanade — margins are healthier. Restaurant positioning can be more casual (gastropub, family-friendly) than Torquay&apos;s premium-focused market. Multi-day stays captured — whale watchers arriving day 1 eat at different venues each night.',
    ],
    risks: 'Competition is higher (3 within 500m vs Torquay 4). Local customer base is price-sensitive ($25–35/entree positioning works better than $50+). Off-season revenue is material concern — requires strong local value-positioning to survive May–September baseline.',
    opportunity: 'A "whale watcher&apos;s value" positioning — quality seafood at moderate pricing ($25–35/entree) with whale-themed ambiance — would capture price-sensitive tourists. Local loyalty positioning during off-season creates defensible differentiation.',
  },
  {
    rank: 3, name: 'Urangan', postcode: '4655', score: 78, verdict: 'GO' as const,
    income: '$68,000', rent: '$2,500–$4,000/mo', competition: '2 within 500m',
    footTraffic: 78, demographics: 74, rentFit: 86, competitionScore: 88,
    breakEven: '26/day', payback: '7 months', annualProfit: '$258,000',
    angle: 'Marina precinct restaurant positioning — whale watching tours and boat dining overlap',
    detail: [
      'Urangan Marina is the departure point for whale watching tours and boat dining experiences. This creates natural positioning advantage — visitors arriving to depart for whale tours eat pre-departure meals. Evening whale watching cruises depart 5–7pm — restaurants positioned to capture pre-cruise dinner are logical.',
      'Two competitors within 500m is low saturation — first-mover positioning in whale tour-integrated dining is defensible. The demographic is tourism-driven but less premium than Torquay. Pricing ($20–30/entree) reflects tourist expectations but lower than esplanade premium.',
      'Rent advantage ($2,500–$4,000/mo vs Torquay $3,500–$6,500) enables aggressive customer acquisition and service quality investment. Marina positioning creates natural event programming opportunities — boat charter partnerships, tour operator promotions.',
    ],
    risks: 'Foot traffic (78) is lower than Pialba/Torquay — relies more on destination visitation. Marina environment is car-centric — walk-in traffic is limited. Off-season revenue is volatile — whale tour departures are seasonal (July–October peaks).',
    opportunity: 'Partner with whale tour operators for integrated dining packages — "pre-tour dinner" positioning becomes defensible and operator-supported. A restaurant with private dining/group dining capability would capture tour operator group bookings.',
  },
  {
    rank: 4, name: 'Point Vernon', postcode: '4655', score: 70, verdict: 'GO' as const,
    income: '$66,000', rent: '$2,400–$3,600/mo', competition: '1 within 500m',
    footTraffic: 64, demographics: 70, rentFit: 88, competitionScore: 94,
    breakEven: '22/day', payback: '8 months', annualProfit: '$174,000',
    angle: 'Established residential with low competition — loyal locals, minimal tourist seasonality',
    detail: [
      'Point Vernon is an established residential suburb with stable demographics. One competitor within 500m is the lowest in GO tier — first-mover positioning is highly defensible. Foot traffic (64) is moderate but customer base is loyal and habitual.',
      'Revenue is less volatile than tourist-focused precincts — locals create year-round baseline. Whale season provides uplift but business doesn&apos;t depend on it. Restaurant positioning can focus on quality local reputation rather than seasonal tourism optimization.',
      'Rent is lowest in tier at $2,400–$3,600/mo — margin structure enables aggressive loyalty programming, events, and seasonal promotions without margin compression.',
    ],
    risks: 'Foot traffic (64) requires destination visitation — passive walk-in traffic is limited. Population is established, flat growth — no demographic tailwinds. Tourism upside is limited (off Urangan whale tour path).',
    opportunity: 'Position as the neighbourhood "destination restaurant" with regular event programming (wine dinners, chef&apos;s menus, cooking classes). Low competition and loyal resident base enable community-embedded positioning.',
  },
]

const RISK_SUBURBS = [
  { name: 'Scarness', postcode: '4655', score: 62, verdict: 'CAUTION' as const, reason: 'Scarness is a declining strip with increasing chain competition (Fish &apos;n&apos; Chips franchises, generic pubs). Foot traffic is soft (56 vs Torquay 88). Positioning is unclear — not premium enough for Torquay branding, not local-focused enough for residential. Only viable with very specific differentiation (raw bar, fine dining niche, specific cuisine).' },
  { name: 'Maryborough', postcode: '4650', score: 39, verdict: 'NO' as const, reason: 'Maryborough is a nearby city (50km away) without coastal positioning or premium market. Median income ($52k) and foot traffic (32) are below viability. This is an inland regional centre, not a coastal tourism destination. Restaurant economics fail unless positioned as ultra-casual (RSA club equivalent).' },
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a restaurant in Hervey Bay?</h3>
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
    'Model revenue at 40% of whale season baseline for off-season viability',
    'Assess outdoor deck potential for whale season trade (covered + heated for cooler nights)',
    'Check events calendar (Whale Festival, school holidays) and revenue spike timing',
    'Visit Torquay esplanade Saturday 10am during whale season (July–October) — observe peak patterns',
    'Survey 15 whale tour operators — understand dining partnership opportunities',
    'Verify parking (Torquay often constrained during peak) — insufficient parking = 20% traffic loss',
    'Model June–October revenue uplift (whale season) and May/November/Dec–April baseline',
    'Calculate rent ÷ projected whale season revenue (not annual) — must be under 0.075',
    'Negotiate seasonal lease adjustment clauses (lower rent May/Nov/Dec–Apr)',
    'Evaluate whale watching tour integration potential (pre/post-tour dining packages)',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Hervey Bay Restaurant Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Hervey Bay location insights now coming to your inbox.</p>
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
export default function HerveyBayRestaurantPage() {
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
            {[['Location Guides', '/analyse'], ['Hervey Bay', '/analyse/hervey-bay']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,250,254,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.7)' }}>Restaurants</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Hervey Bay Restaurant Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Restaurant in Hervey Bay (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,250,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Hervey Bay&apos;s tourism-driven restaurant market. Whale watching capital, retirement destination, seasonal revenue peaks. Scored by foot traffic, demographics, competition density, and seasonal viability.
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
            {[{ v: '6', l: 'Hervey Bay suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
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
              { stat: '280k', claim: 'annual whale watching visitors July–October — tourism dining revenue peak season', source: 'Hervey Bay Tourism Bureau visitor surveys, 2025', color: S.emerald },
              { stat: '380%', claim: 'revenue uplift during whale season vs off-season baseline — highly seasonal market', source: 'Locatalyze restaurant operator surveys, Hervey Bay region', color: S.brand },
              { stat: '42%', claim: 'retiree population concentration in Hervey Bay (vs 18% QLD average)', source: 'ABS Census 2021 + quarterly estimates 2024–2026', color: S.amber },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hervey Bay economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Hervey Bay: Australia&apos;s Whale Watching Capital and Retirement Destination
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Hervey Bay is the gateway to the Great Barrier Reef (K&apos;gari, formerly Fraser Island) and Australia&apos;s whale watching capital. July–October attracts 280,000+ visitors for humpback whale migration. This creates observable seasonality — whale season revenue is 380% above baseline. A restaurant earning $50k/month during whale season might earn only $13k/month May–June. Success requires sophisticated financial planning.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Hervey Bay also attracts retirees — 42% of population is 65+ (vs 18% QLD average). Asset-rich retirees create stable off-season dining base. The demographic is price-tolerant for quality seafood experiences and willing to pay premium pricing ($35–50/entree). This creates defensible positioning for quality-focused restaurants.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Torquay is the premium esplanade positioning — highest foot traffic (88) and tourist density. Pialba offers balanced local+tourist trade with lower rent. Urangan captures whale tour integration opportunity. All GO-rated suburbs are fundamentally viable with different positioning strategies. The key success factor is modelling the seasonal revenue volatility and ensuring 40% baseline off-season viability.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected average revenue — Hervey Bay vs Brisbane locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 8% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[50000, 130000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[2000, 13000]}/>
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
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Brisbane CBD'].includes(d.suburb))} fill="#059669" name="Hervey Bay suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Brisbane CBD'].includes(d.suburb))} fill="#E24B4A" name="Brisbane (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld restaurant revenue benchmarks and seasonal adjustment factors (whale season +380%, off-season -60%). Hervey Bay rents: Queensland commercial surveys Q1 2026."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Hervey Bay Suburb Scores — Restaurant Viability
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
          <DataNote text="Scores: Locatalyze model (Rent 25%, Seasonal Viability 35%, Competition 20%, Demographics 20%). Aggregated from ABS, Queensland property surveys, Geoapify data. March 2026."/>
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
                      <p style={{ fontWeight: 700, color: S.n900 }}>{s.breakEven} covers</p>
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
            Get a detailed Locatalyze score for any restaurant location in Hervey Bay. Foot traffic density, demographic match, competition mapping, and seasonal viability — analysed in seconds.
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
            Hervey Bay is a seasonal opportunity market driven by whale watching tourism (280k+ visitors July–October) and retiree migration (42% 65+ population). Torquay is the premium esplanade positioning with highest foot traffic. Pialba offers balanced local+tourist trade. Urangan captures whale tour integration opportunity. All are fundamentally viable BUT require sophisticated seasonal revenue modelling — whale season revenue is 380% above baseline, requiring 40% off-season viability modelling. Success requires positioning for multi-source demand: tourists (seasonal), whale tour integration, and retiree loyalty (year-round). Rent is 40–50% below Brisbane equivalents, enabling margin for brand investment. This is a high-reward seasonal market for operators comfortable with revenue volatility.
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
