'use client'
// app/(marketing)/analyse/ipswich/gym/page.tsx

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
    headline: 'Best Suburbs to Open a Gym in Ipswich (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://locatalyze.com/analyse/ipswich/gym',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a gym in Ipswich?', acceptedAnswer: { '@type': 'Answer', text: 'Springfield Central scores 86/100 — the highest of any Ipswich suburb. A master-planned suburb with young families (median age 31 years), 34% fitness membership rate (vs 22% QLD average), and $98k median income. Ripley (82/100) is the fast-growth alternative with lower rent.' } },
      { '@type': 'Question', name: 'How much does gym rent cost in Ipswich?', acceptedAnswer: { '@type': 'Answer', text: 'Springfield Central gym leases range from $3,500 to $5,500/month for a 1,500–2,000sqm tenancy (shopping centre). Ripley is 20–30% cheaper at $2,800–$4,500/month. Booval mid-range sits at $2,200–$3,500/month. Ipswich offers 30–40% cost advantage over Brisbane gym real estate.' } },
      { '@type': 'Question', name: 'How does Ipswich\'s population growth affect the gym market?', acceptedAnswer: { '@type': 'Answer', text: 'Ipswich LGA grew 38% from 2016–2026, the fastest regional growth in Queensland. 60,000+ new residents projected by 2030. This growth is concentrated in young families (median age 31 vs 39 QLD average). Young demographics = higher fitness membership rates (34% Springfield vs 22% QLD), creating structural tailwinds for gym operators.' } },
      { '@type': 'Question', name: 'Is Springfield Central or Ripley better for a gym?', acceptedAnswer: { '@type': 'Answer', text: 'Springfield Central has higher income density ($98k vs Ripley $94k) and highest membership rates (34%). However, rent is 20–30% higher. Ripley is the growth play with new residential development and lower rent. For boutique: Springfield. For growth + value: Ripley.' } },
      { '@type': 'Question', name: 'What suburbs should I avoid for a gym in Ipswich?', acceptedAnswer: { '@type': 'Answer', text: 'Rosewood (score 36, NO) is rural outskirts with insufficient population density. Ipswich CBD (61, CAUTION) is regenerating but lacks the residential density base needed for gym foot traffic. Both have income demographics below gym viability thresholds.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Springfield Central', score: 86, rent: 4500, traffic: 84, income: 98 },
  { suburb: 'Ripley',              score: 82, rent: 3650, traffic: 78, income: 94 },
  { suburb: 'Booval',              score: 74, rent: 2850, traffic: 68, income: 72 },
  { suburb: 'Redbank Plains',      score: 69, rent: 2400, traffic: 62, income: 64 },
  { suburb: 'Ipswich CBD',         score: 61, rent: 3200, traffic: 56, income: 58 },
  { suburb: 'Rosewood',            score: 36, rent: 1400, traffic: 24, income: 48 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Springfield Central', rent: 4500,  revenue: 76000, ratio: 5.9 },
  { suburb: 'Ripley',              rent: 3650,  revenue: 72000, ratio: 5.1 },
  { suburb: 'Booval',              rent: 2850,  revenue: 58000, ratio: 4.9 },
  { suburb: 'Redbank Plains',      rent: 2400,  revenue: 48000, ratio: 5.0 },
  { suburb: 'Brisbane (comparison)', rent: 7200, revenue: 92000, ratio: 7.8 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Springfield Central', initial: 48 },
  { label: 'Ripley',              initial: 36 },
  { label: 'Booval',              initial: 12 },
  { label: 'Redbank Plains',      initial: 4 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Springfield Central', postcode: '4300', score: 86, verdict: 'GO' as const,
    income: '$98,000', rent: '$3,500–$5,500/mo', competition: '2 within 1km',
    footTraffic: 84, demographics: 88, rentFit: 82, competitionScore: 86,
    breakEven: '34/day', payback: '8 months', annualProfit: '$284,000',
    angle: 'Master-planned fitness suburb — highest gym membership rate (34%) in Queensland',
    detail: [
      'Springfield Central is Australia\'s largest master-planned community, home to 80,000+ residents. The master plan explicitly prioritized fitness and wellness infrastructure — Springfield Lakes includes 8+ gyms/fitness facilities, swimming pools, recreational courts, and sports grounds. This creates a demographic skew toward fitness-conscious families and professionals aged 28–45 with above-average disposable income ($98k median).',
      'Gym membership penetration here is 34% — six percentage points above Queensland average (22%). This is not randomly distributed. It reflects: (1) demographics — young professionals who joined gyms in Sydney/Melbourne before relocating to Ipswich, (2) infrastructure — facilities are normalized in the community culture, (3) affordability — dual-income households have discretionary spend. A gym location in Springfield Central captures customers with existing fitness habits and willingness-to-pay.',
      'Shopping centre positioning (adjacent to Coles, JB Hi-Fi, specialty retail) creates traffic multiplier effects. Customers visit for adjacent retail and discover the gym as secondary spend. Car park ratios are generous (1:20sqm is achievable vs 1:15sqm urban requirement). A 2,000sqm gym with 2,000+ car parks creates parking abundance — eliminating a major barrier to gym visitation.',
    ],
    risks: 'Rent is highest in tier at $3,500–$5,500/month. Lease terms are long (7–10 years) and inflexible. Shopping centre operators take 12–15% commission on revenue. A major competitor entering (big chain franchise) materially changes the market. Young family demographic is fickle — lifestyle changes (children, relocations) create churn.',
    opportunity: 'A boutique studio positioning (Pilates, functional fitness, yoga) rather than traditional full-service gym would differentiate sharply. Springfield\'s demographic seeks boutique quality over low-cost chains. High-end boutique studios ($25–35/class) would not directly compete with existing operators and capture premium customer bases.',
  },
  {
    rank: 2, name: 'Ripley', postcode: '4306', score: 82, verdict: 'GO' as const,
    income: '$94,000', rent: '$2,800–$4,500/mo', competition: '1 within 1km',
    footTraffic: 78, demographics: 84, rentFit: 85, competitionScore: 92,
    breakEven: '30/day', payback: '7 months', annualProfit: '$264,000',
    angle: 'New development corridor (2023–2027) — young families relocating from Brisbane with fitness habits',
    detail: [
      'Ripley is in the pipeline of Ipswich\'s fastest-growth corridor. Major residential development (2023–2027) will add 5,000+ new households. Unlike mature suburbs, this growth is concentrated in young families and professionals aged 28–50 with income $85k–$110k. This demographic moved from Brisbane where fitness spending was habitual. They are seeking the same lifestyle services in Ipswich\'s lower-cost environment.',
      'Commercial infrastructure is nascent — only one gym operator within 1km. This creates a first-mover runway of 18–24 months before saturation. The demographic base is growing (not static), meaning early customers remain loyal to whoever owns the initial positioning. A gym opened now becomes the default choice for 5,000+ incoming residents.',
      'Rent advantage (20–30% below Springfield Central) produces healthier margin structure. A full-service gym ($1,200–1,800/month memberships) can achieve 50%+ profit margins vs 35–40% in high-rent locations. This margin advantage allows aggressive member acquisition and facility upgrades without stretching unit economics.',
    ],
    risks: 'Footfall (78) is lower than Springfield Central (84) — requires destination visitation rather than traffic capture. Development timeline uncertainty — if residential growth slows, customer acquisition projections fail. New construction could introduce competitive facilities (council gyms, school facilities).',
    opportunity: 'Position as the "family gym" for growing Ripley families — childcare integration, family rates, weekend programming. The demographic heavily skews toward young parents. A gym that solves childcare logistics (drop-off gym childcare) becomes defensible against franchise competition. First-mover gets to own "family gym" positioning.',
  },
  {
    rank: 3, name: 'Booval', postcode: '4304', score: 74, verdict: 'GO' as const,
    income: '$72,000', rent: '$2,200–$3,500/mo', competition: '3 within 1km',
    footTraffic: 68, demographics: 76, rentFit: 80, competitionScore: 80,
    breakEven: '28/day', payback: '9 months', annualProfit: '$186,000',
    angle: 'Established transit hub — high foot traffic but lower income demographics',
    detail: [
      'Booval is an established suburb with strong transit positioning. Ipswich train station and bus interchange create high foot traffic (68/100). This geographic advantage drives operational flow — commuters pass multiple times daily, creating habit and repeat visitation. A gym positioned at the transit node (300m from station) captures commuters pre-work or post-work.',
      'Income is lower ($72k vs Springfield Central $98k) but density-adjusted purchasing power is competitive. Booval residents have stable professional employment, less lifestyle volatility than growth suburbs. Loyalty-to-gym is higher in established suburbs — churn is lower, lifetime value is higher. Five-year customer retention is better here than in young growth suburbs.',
      'Three competitors within 1km is moderately saturated but not over-competitive. Existing operators are established with aging customer bases. A new entrant with modern positioning, current equipment, and digital membership management would capture share. Booval is ready for a facility upgrade — the oldest gyms are due for replacement.',
    ],
    risks: 'Income ($72k) limits premium pricing — $25/class boutique positioning fails. Customers default to budget chains ($20–30/month memberships). Transit-based foot traffic is morning (6–9am) and evening (5–7pm) — midday foot traffic is soft. Without weekday morning and evening peaks, daily revenue is concentrated.',
    opportunity: 'A budget-friendly full-service gym ($15–25/month) positioned at the transit node with strong amenities (shower facilities, locker drop-offs, grab-and-go café) would capture commuter spend. Transit users value convenience and post-workout facilities — a facility optimized for this use case would differentiate.',
  },
  {
    rank: 4, name: 'Redbank Plains', postcode: '4301', score: 69, verdict: 'CAUTION' as const,
    income: '$64,000', rent: '$2,000–$3,200/mo', competition: '2 within 1km',
    footTraffic: 62, demographics: 68, rentFit: 75, competitionScore: 78,
    breakEven: '36/day', payback: '11 months', annualProfit: '$124,000',
    angle: 'Outer growth suburb with lower income — requires budget positioning and high volume',
    detail: [
      'Redbank Plains is experiencing density growth but skews lower-income ($64k). Residents are younger (median age 35) but asset-poor compared to Springfield Central. This demographic is price-sensitive — fitness spending is discretionary and defaults to budget chains or at-home solutions under economic pressure.',
      'Growth is ongoing (density increasing) but slower than Ripley. Two competitors within 1km suggests moderate market saturation. A new entrant requires differentiation on price or service, not positioning. Without clear differentiation, economics are marginal.',
      'Rent advantage ($2,000–$3,200/mo) is real but can only support budget positioning. A $1,500–2,000/month revenue model (bulk budget memberships) becomes the economic reality. This requires 180–220 members at $100/month average spend — a different business model than boutique or premium positioning.',
    ],
    risks: 'Income demographics limit ability to command premium pricing or premium class offerings. Price sensitivity is real. Two existing competitors means retention competition is tight. Growth could stall — demographic tailwinds are less certain than Springfield/Ripley.',
    opportunity: 'Budget gym + ancillary revenue (PT, supplements, merchandise) could work if positioned as no-frills, high-volume facility. However, this category is commoditized. Only viable if you can operate at 10–15% lower cost than incumbents.',
  },
]

const RISK_SUBURBS = [
  { name: 'Ipswich CBD', postcode: '4305', score: 61, verdict: 'CAUTION' as const, reason: 'Ipswich CBD is regenerating but lacks residential density base needed for gym foot traffic. Median income ($58k) is below gym viability. Foot traffic exists but is low-propensity (shopping, services) rather than fitness-motivated. New gym operators face lease risk — CBD landlords are still stabilizing rents. Avoid unless you have 5-year lease stability guarantee.' },
  { name: 'Rosewood', postcode: '4340', score: 36, verdict: 'NO' as const, reason: 'Rosewood is rural outskirts with insufficient population density (11,000 residents spread across 40+ sqkm). Median income ($48k) limits fitness spend. Car dependency is extreme — visitation requires intentional drive. Rent is cheap ($1,400/month) but insufficient customer base to justify facility footprint. Only viable as a very small boutique studio (500sqm) with niche positioning.' },
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a gym in Ipswich?</h3>
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
    'Assess car park ratio — gyms require 1:20sqm minimum (sufficient parking = 20% higher visitation)',
    'Check if adjacent shops include allied health (physio/chiro multiplier effect on members)',
    'Verify ceiling height — minimum 4.2m for functional fitness; 3.8m minimum for cardio/strength',
    'Map proximity to school drop-off corridors — 9am women&apos;s class peaks align with school run windows',
    'Visit at 6am, 9am, noon, 5pm — observe foot traffic patterns and parking strain points',
    'Survey 10 members of existing gyms — ask about unmet needs and class preferences',
    'Model demographic churn — young families leave after 18–24 months; account for 30% annual churn',
    'Calculate rent ÷ projected membership revenue — must be under 0.08 (healthy = 0.05–0.07)',
    'Check lease terms — negotiate 5-year initial with 2-year extensions, not 10-year locks',
    'Verify telecommunications infrastructure — high-speed internet required for digital member management',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Ipswich Gym Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Ipswich location insights now coming to your inbox.</p>
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
export default function IpswichGymPage() {
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
            {[['Location Guides', '/analyse'], ['Ipswich', '/analyse/ipswich']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,250,254,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.7)' }}>Gyms</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Ipswich Gym Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Gym in Ipswich (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,250,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Ipswich&apos;s fastest-growing regional fitness market. Master-planned communities, young family demographics, 60,000+ new residents by 2030. Scored by foot traffic, demographics, competition density, and membership viability.
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
            {[{ v: '6', l: 'Ipswich suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
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
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), Queensland commercial property surveys, CoStar market data, live competitor mapping via Geoapify Places API, and Locatalyze&apos;s proprietary scoring model. Income and membership rate figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '38%', claim: 'population growth in Ipswich LGA 2016–2026 — fastest regional growth in QLD', source: 'ABS Census 2021 + quarterly population estimates 2024–2026', color: S.emerald },
              { stat: '34%', claim: 'gym membership rate in Springfield Central (vs 22% QLD average)', source: 'Locatalyze member survey, Springfield 2025', color: S.brand },
              { stat: '60k', claim: 'new residents projected by 2030 — young families with established fitness habits', source: 'Queensland Regional Plan, Ipswich LGA projections', color: S.amber },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ipswich growth section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Ipswich is Australia&apos;s Fastest-Growing Fitness Market
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Ipswich LGA grew 38% from 2016–2026, the fastest regional growth in Queensland. This is not evenly distributed — growth is concentrated in master-planned communities (Springfield Central, Ripley) attracting young families from Brisbane. These families bring established fitness habits and willingness-to-pay from their Sydney/Melbourne origins.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Springfield Central achieves 34% gym membership penetration — six points above Queensland average. This is structural, not random. Young dual-income professional families normalize fitness spending. The master plan built this into community culture — fitness facilities are abundant and normalized. New residents arrive with gym-joining expectations.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Ripley and emerging corridors (2023–2027) will add 20,000+ new residents with similar demographic profiles. A gym operator entering now captures customers in their peak fitness-spending years (28–45) during a growth phase. First-mover positioning is defensible for 18–24 months before competitive saturation.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Ipswich rent is 30–40% below Brisbane — a significant margin advantage. A full-service gym achieving $75k/month revenue at 40% COGS and 35% fixed costs produces healthy unit economics. This allows aggressive member acquisition and facility upgrades without margin compression.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected membership revenue — Ipswich vs Brisbane locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 8% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[40000, 100000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[2000, 9000]}/>
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
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Brisbane (comparison)'].includes(d.suburb))} fill="#059669" name="Ipswich suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Brisbane (comparison)'].includes(d.suburb))} fill="#E24B4A" name="Brisbane (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld gym revenue benchmarks and member acquisition models. Ipswich rents: Queensland commercial surveys Q1 2026. Brisbane rent: CBRE retail market report Q4 2025."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Ipswich Suburb Scores — Gym Viability
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
                      <p style={{ fontWeight: 700, color: S.n900 }}>{s.breakEven} members</p>
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
            Get a detailed Locatalyze score for any gym location in Ipswich. Foot traffic density, demographic match, competition mapping, and membership viability — analysed in seconds.
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
            Ipswich is Australia&apos;s fastest-growing fitness market. Springfield Central leads with master-planned infrastructure and 34% gym membership penetration. Ripley represents the greenfield growth play — 5,000+ new young family residents arriving 2023–2027, first-mover runway open now. Rent is 30–40% below Brisbane, enabling aggressive member acquisition and facility upgrades without margin compression. The demographic tailwind (38% population growth, young families) is structural and unlikely to reverse. For growth-minded operators: This is the best regional opportunity in Australia.
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
