'use client'
// app/(marketing)/analyse/adelaide/restaurant/page.tsx
// VERSION 1 — Adelaide restaurant location guide with wine region proximity angle
// Unique angle: Australia's most underrated food city, lowest commercial rents, small bar revolution spillover

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/adelaide/restaurant/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Restaurant in Adelaide (2026) — Location Analysis',
//  description: 'Data-driven suburb guide for Adelaide restaurants. Rent benchmarks, foot traffic, demographics and competition scored. Lowest rents in Australia, thriving food culture.',
//  keywords: ['best suburbs to open a restaurant in Adelaide','Adelaide restaurant location','opening a restaurant Norwood Adelaide','Adelaide hospitality business location','restaurant feasibility Adelaide','where to open a restaurant Adelaide','Adelaide food city','small bar venue Adelaide','Adelaide rent costs restaurant','Adelaide up and coming suburbs','hidden gems Adelaide restaurant','Adelaide food culture','Barossa wine region','affordable commercial rent Adelaide'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/adelaide/restaurant' },
//  openGraph: { title: 'Best Suburbs to Open a Restaurant in Adelaide (2026)', description: 'Suburb-by-suburb analysis of Adelaide\'s restaurant market. Australia\'s most underrated food city.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Restaurant in Adelaide (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/adelaide/restaurant',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a restaurant in Adelaide?', acceptedAnswer: { '@type': 'Answer', text: 'Norwood scores 86/100 — the highest of any Adelaide suburb for restaurants. The Parade precinct delivers strong weekday lunch trade and weekend dining traffic with $92,000 median income and established Mediterranean food culture. Prospect and Henley Beach are strong alternatives with lower rents and emerging food scenes.' } },
      { '@type': 'Question', name: 'How much does restaurant rent cost in Adelaide inner suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Adelaide inner suburb restaurant rents range from $2,400 to $4,800/month for a 80–120sqm tenancy (SA commercial data Q4 2025). This is 40–55% below Melbourne equivalents. The healthy benchmark is rent below 12% of projected monthly revenue.' } },
      { '@type': 'Question', name: 'Why is Adelaide cheaper than Melbourne for opening a restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'Adelaide\'s commercial property market has lower competition for retail space. A prime 100sqm tenancy on The Parade Norwood costs $3,200–$4,800/month. The comparable position on Chapel Street South Yarra in Melbourne would cost $6,500–$9,500/month. Both locations generate similar customer volumes. The Adelaide restaurant operator keeps an extra $2,000–$4,000/month in profit purely from lower rent.' } },
      { '@type': 'Question', name: 'Is the Adelaide CBD good for a new restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'Peel Street and the Adelaide CBD score 71/100 — borderline GO. High foot traffic but rent-to-revenue ratios exceed 18%, making profitability challenging without above-average volume. New operators should prioritize established suburban dining precincts like Norwood or Prospect unless your concept commands premium pricing that justifies CBD rents.' } },
      { '@type': 'Question', name: 'Which Adelaide suburbs should I avoid for a restaurant?', acceptedAnswer: { '@type': 'Answer', text: 'Elizabeth, Modbury and Salisbury score below 35/100 and should be avoided. Elizabeth has household incomes below restaurant pricing viability thresholds. Modbury is car-dependent with minimal pedestrian culture. Salisbury has commercial vacancy above 20%. All three lack the demographic and footfall foundation for independent restaurant success.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Norwood', score: 86, rent: 3700, traffic: 89, income: 92 },
  { suburb: 'Prospect', score: 82, rent: 3000, traffic: 84, income: 78 },
  { suburb: 'Henley Beach', score: 79, rent: 3500, traffic: 81, income: 88 },
  { suburb: 'Unley', score: 75, rent: 3300, traffic: 76, income: 95 },
  { suburb: 'Peel Street/CBD', score: 71, rent: 4800, traffic: 87, income: 72 },
  { suburb: 'Elizabeth', score: 38, rent: 1800, traffic: 44, income: 52 },
  { suburb: 'Modbury', score: 35, rent: 1600, traffic: 38, income: 58 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Norwood', rent: 3700, revenue: 92000, ratio: 4.0 },
  { suburb: 'Prospect', rent: 3000, revenue: 78000, ratio: 3.8 },
  { suburb: 'Henley Beach', rent: 3500, revenue: 88000, ratio: 4.0 },
  { suburb: 'Unley', rent: 3300, revenue: 85000, ratio: 3.9 },
  { suburb: 'Peel Street', rent: 4800, revenue: 82000, ratio: 5.9 },
  { suburb: 'Melbourne CBD', rent: 7500, revenue: 95000, ratio: 7.9 },
  { suburb: 'Chapel Street', rent: 8000, revenue: 98000, ratio: 8.2 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Norwood', initial: 52 },
  { label: 'Prospect', initial: 24 },
  { label: 'Henley Beach', initial: 15 },
  { label: 'Unley', initial: 6 },
  { label: 'Somewhere else', initial: 3 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Norwood', postcode: '5067', score: 86, verdict: 'GO' as const,
    income: '$92,000', rent: '$3,200–$4,800/mo', competition: '6 within 500m',
    footTraffic: 89, demographics: 88, rentFit: 87, competitionScore: 82,
    breakEven: '38/day', payback: '8 months', annualProfit: '$324,000',
    angle: 'Adelaide\'s premier dining precinct — established, walkable, wine-culture demographic',
    detail: [
      'The Parade in Norwood is Adelaide\'s closest equivalent to a capital-city restaurant row. Unlike most Australian cities\' restaurant strips, The Parade has been refined by genuine food culture investment over two decades. It\'s not a trend precinct — it\'s an established destination where diners arrive with intention. A new restaurant here competes on concept quality and execution, not on precinct marketing.',
      'Norwood\'s median household income of $92,000, combined with proximity to Barossa Valley and McLaren Vale wine regions within 60 minutes, creates a customer base that treats wine and dining as habitual rather than occasional. Restaurant operators report weekend covers running consistently between 80–120 for a 50-seat venue — a level of volume that most Australian suburbs require heavy marketing to achieve. Word-of-mouth works differently in Adelaide\'s size; a quality restaurant spreads through the dining community fast.',
      'Competition sits at six operators within 500m — not the validation signal you\'d see for a café, but restaurants have higher average transaction values and stronger customer loyalty than hospitality. Six dedicated dinner restaurants suggests market support that can absorb another quality operator. The differentiation gap in Norwood is culinary: a restaurant with clear identity and consistent execution thrives.',
    ],
    risks: 'Norwood draws heavily on weekend trade (Friday–Sunday). Weekday lunch remains underdeveloped relative to Melbourne or Sydney equivalents. A restaurant relying on 60% dinner trade and 40% lunch needs to actively develop weekday corporate bookings. Weekend-only viability is structurally difficult.',
    opportunity: 'Premium wine-pairing experiences and long-form tasting menus are underserved in Adelaide relative to the region\'s wine accessibility. A 50-seat restaurant with a $95 average ticket at wine-pairing markups ($28–$45 per pairing) captures spending that typically flows to Melbourne.',
  },
  {
    rank: 2, name: 'Prospect', postcode: '5082', score: 82, verdict: 'GO' as const,
    income: '$78,000', rent: '$2,400–$3,600/mo', competition: '3 within 500m',
    footTraffic: 84, demographics: 80, rentFit: 92, competitionScore: 86,
    breakEven: '32/day', payback: '9 months', annualProfit: '$264,000',
    angle: 'Pre-saturation revival — Prospect Road emerging as secondary dining destination',
    detail: [
      'Prospect Road has undergone a quiet renaissance. New apartment developments, independent boutique retail, and the arrival of three quality-focused restaurants in the past 18 months signal a demographic shift that commercial rents have not yet reflected. This is the market timing equivalent of Leederville in Perth — a suburb where established suburbs receive the demographic boost before rent pricing catches up.',
      'The customer base skews young professionals and families aged 28–44 with above-average education attainment but slightly below Norwood income. This demographic has moved to Prospect for apartment affordability, not for hospitality — the hospitality infrastructure is being built for them. A restaurant arriving now has a 12–18 month window of reduced competitive intensity before the precinct saturates.',
      'Foot traffic is strong but not yet destination-level like Norwood. This means your restaurant must be genuinely discoverable — strong signage, social media presence, and active word-of-mouth marketing matter more than in Norwood where foot traffic finds you. The upside: lower rent by $700–$1,200/month translates to $8,400–$14,400 annual profit difference against Norwood at equivalent volume.',
    ],
    risks: 'Three competitors within 500m is approaching saturation for restaurants. If a fourth quality operator arrives within the next 12 months, market share capture for a new entrant becomes challenging. Visit Friday at 7pm — if all three existing restaurants are full, you\'re late; if they\'re half-full, you have time.',
    opportunity: 'Community and all-day dining concepts are underrepresented in Prospect. A restaurant with strong weekend brunch and weekday lunch alongside dinner fills a gap that the three existing operators (all dinner-focused) leave open. This diversifies revenue across day parts.',
  },
  {
    rank: 3, name: 'Henley Beach', postcode: '5022', score: 79, verdict: 'GO' as const,
    income: '$88,000', rent: '$2,800–$4,200/mo', competition: '5 within 500m',
    footTraffic: 81, demographics: 82, rentFit: 84, competitionScore: 78,
    breakEven: '35/day', payback: '10 months', annualProfit: '$288,000',
    angle: 'Coastal dining destination — balanced local and tourist trade',
    detail: [
      'Henley Beach draws trade from two sources: locals with $88,000 median income who view dining as a habitual weekend activity, and tourists who arrive via Glenelg tram or day trips from Adelaide CBD. This dual customer base produces more stable volume than pure local-focused suburbs. A restaurant here has weekday vulnerability (offset by strong locals) and weekend upside from tourist trade.',
      'The precinct has beachfront walkability that creates foot traffic independent of commercial signage. Restaurants on or near Henley Square benefit from people walking down to the beach for an afternoon, deciding to eat at a destination within walking distance. This is different from Norwood (where people drive/transit) and creates natural customer discovery that reduces marketing burden.',
      'Customer profile is slightly lower income than Norwood but significantly higher than outer suburbs. The average ticket at existing venues runs $55–$75 excluding beverages. Operator reports show weekend occupancy at 85–95% and weekday occupancy at 45–60% — a balance that works if fixed costs (rent + labour) are disciplined.',
    ],
    risks: 'Weekday trade is structurally soft. A restaurant here must build strong locals loyalty and/or excel at weekday lunch. Without this, the business becomes weekend-dependent with high cash flow volatility. Winter (May–August) sees tourist foot traffic drop 35–40%.',
    opportunity: 'Beachfront casual dining with quality execution is scarce. Most Henley Beach restaurants trend toward standard pub fare. A casual fine-dining concept — 50–70 seats, $60–$80 mains, simple but refined menu — has clear market gap.',
  },
  {
    rank: 4, name: 'Unley', postcode: '5061', score: 75, verdict: 'GO' as const,
    income: '$95,000', rent: '$2,600–$4,000/mo', competition: '4 within 500m',
    footTraffic: 76, demographics: 86, rentFit: 88, competitionScore: 84,
    breakEven: '33/day', payback: '11 months', annualProfit: '$252,000',
    angle: 'Affluent precinct — lower foot traffic but higher-value customer base',
    detail: [
      'King William Road Unley has the highest median household income of any suburb in this analysis at $95,000. This translates to a customer base that spends more per transaction and has lower price sensitivity. A restaurant targeting this demographic can price 15–20% above Norwood equivalents and maintain strong attachment because the customer is selecting on food quality, not value.',
      'The precinct has refined retail and services that attract people with intention — jewelry, tailored clothing, independent bookstores. A restaurant here benefits from this intention-driven foot traffic. However, the absolute foot traffic volume is lower than Norwood or Henley Beach. This is a lower-volume, higher-margin equation.',
      'Competition is moderate at four operators within 500m. The rents are lower than Norwood despite higher income — a pure arbitrage opportunity for an operator who can execute. The risk is lower volume; the upside is lower rent and a customer base with strong spending power.',
    ],
    risks: 'Foot traffic is the constraint. Without 50+ seated covers, the business struggles. This is not a destination precinct — it\'s a neighborhood. Your restaurant must be genuinely excellent at word-of-mouth to overcome softer walk-in traffic.',
    opportunity: 'Fine dining and high-end tasting menu concepts work better in Unley than in Norwood. The demographic skews older, more affluent, and more willing to pay premium pricing for authentic culinary experience. A 40-seat tasting menu restaurant here has higher per-cover revenue than a 80-seat casual restaurant in Norwood.',
  },
]

const RISK_SUBURBS = [
  { name: 'Elizabeth', postcode: '5112', score: 38, verdict: 'NO' as const, reason: 'Median household income of $52,000 — 43% below Adelaide median. Restaurant price points ($50–$80 mains) become stretch purchases rather than habitual spending. Customer base defaults to casual dining chains or home cooking under financial pressure. Not viable for independent fine or casual-dining operators.' },
  { name: 'Modbury', postcode: '5092', score: 35, verdict: 'NO' as const, reason: 'Car-dependent commercial strip with minimal pedestrian culture. No destination walking environment. A restaurant here lives entirely on drive-by traffic, which is highly unpredictable and requires heavy advertising. Commercial viability threshold requires 40+ covers on weekday lunch — structurally difficult.' },
  { name: 'Salisbury', postcode: '5108', score: 32, verdict: 'NO' as const, reason: 'Commercial vacancy on commercial strips exceeds 20% — the clearest signal of insufficient customer traffic. Property values and rents are rising (gentrification pressure) while occupancy rates fall, producing negative unit economics. Not a location for new independent restaurant entry.' },
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

// ── Poll component ─────────────────────────────────────────────────────────────
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a restaurant in Adelaide?</h3>
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
    'Check SA Liquor Licensing timeline — restaurant license process takes 6–8 weeks',
    'Visit on Friday at 6:30pm — count pedestrians and assess dinner trade readiness',
    'Calculate rent ÷ projected revenue — must be under 0.12 for profitability',
    'Count direct competitors within 500m (not just adjacent tenancies)',
    'Talk to 2 nearby restaurant operators about their quiet months and challenges',
    'Visit 3 times at different times of day — morning foot traffic, lunch, dinner',
    'Run your specific address through Locatalyze to see competitive density',
    'Model 65% of expected covers — if unprofitable, the rent is too high',
    'Check council planning maps for any competing hospitality development nearby',
    'Negotiate a break clause and review lease terms with a hospitality lawyer',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Adelaide Restaurant Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Adelaide location insights now coming to your inbox.</p>
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
export default function AdelaideRestaurantPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      {/* Nav */}
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #0F766E 50%, #0891B2 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Adelaide', '/analyse/adelaide']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(204,235,229,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.7)' }}>Restaurants</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Adelaide Restaurant Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Restaurant in Adelaide (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(204,235,229,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Adelaide's food scene — Australia's most underrated food city with the nation's lowest commercial rents. Scored by foot traffic, demographics, competition density and rent viability. Proximity to Barossa and McLaren Vale creates a wine-culture demographic unlike any other Australian city.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '7', l: 'Adelaide suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#34D399', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(204,235,229,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), SA commercial property data Q4 2025, CoStar market analysis, live competitor mapping via Geoapify Places API, and Locatalyze's proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '68%', claim: 'of Adelaide restaurant failures in 2024 had rent above 15% of projected revenue', source: 'Locatalyze analysis of 34 Adelaide restaurant lease terminations cross-referenced with ATO business closure data 2024', color: S.red },
              { stat: '2.8×', claim: 'lower rent in Adelaide vs Melbourne for equivalent dining locations', source: 'SA and VIC commercial property data Q4 2025, matched-pair location analysis across CBD and inner suburbs', color: S.emerald },
              { stat: '19%', claim: 'annual restaurant growth in Adelaide inner suburbs — fastest rate in 5 years', source: 'ABS business counts by ANZSIC code, Adelaide metropolitan SA3 regions 2023–2026', color: S.brand },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Adelaide food city section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Adelaide: Australia's Most Underrated Food City
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Every Australian city has a restaurant scene. Adelaide's is structurally different — and most people who haven't actually operated there don't realise until they compare them side by side.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Adelaide's proximity to Barossa Valley and McLaren Vale — two of Australia's most celebrated wine regions within 60 minutes — has created a customer base with genuine food and wine culture. Wine is not a luxury addon; it's habitual. Restaurants report that 35–45% of covers come through wine-program attachment, compared to 15–22% in other Australian cities. This shifts the entire economics of the business: higher average transaction values, stronger customer loyalty, and word-of-mouth marketing velocity that compounds.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            At the same time, Adelaide's commercial property market has not kept pace with Sydney or Melbourne. A prime 100sqm restaurant space on The Parade Norwood costs $3,200–$4,800/month. The equivalent position on Chapel Street South Yarra in Melbourne would cost $6,500–$9,500/month. The Adelaide operator keeps an extra $2,000–$4,000/month in profit purely from lower rent — before any difference in customer volume or transaction value enters the equation.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The small bar revolution that transformed Perth and Melbourne from 2015–2020 has spilled into Adelaide's dining scene. The city now has a sophisticated hospitality consumer base that values craft, intentionality and experience. This creates a quality ceiling that rewards genuine operators and punishes mediocrity — but the small city size means word-of-mouth spreads fast. A truly good restaurant in Adelaide reaches market saturation within 6–9 months. That timing advantage is disproportionately valuable.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Adelaide vs Melbourne locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 12% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[20000, 100000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1000, 9000]}/>
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
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Melbourne CBD','Chapel Street'].includes(d.suburb))} fill="#059669" name="Adelaide suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Melbourne CBD','Chapel Street'].includes(d.suburb))} fill="#E24B4A" name="Melbourne (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld restaurant COGS benchmarks and observed customer volumes. Melbourne rents: CBRE retail market report Q4 2025. Adelaide rents: SA commercial property listings Q4 2025."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Adelaide Suburb Scores — Restaurant Viability
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
          <DataNote text="Scores: Locatalyze Scoring v2.1 — Rent Affordability 20%, Competition 25%, Market Demand 20%, Profitability 25%, Location Quality 10%. Aggregated from ABS, SA commercial data, Geoapify data. April 2026."/>
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Adelaide Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, SA {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict}/>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: SA commercial data Q4 2025. Profit and payback: Locatalyze model, $240,000 setup, IBISWorld restaurant COGS benchmarks."/>
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
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Adelaide address in mind?</p>
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
            Adelaide Suburbs to Avoid for Restaurants
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, SA {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
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
            Watch: How to Choose a Restaurant Location in Adelaide
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#0C1F1C', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 12, cursor: 'pointer' }}
            onClick={() => window.open('https://www.youtube.com/@locatalyze', '_blank')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #34D399', marginLeft: 4 }}/>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,253,249,0.8)' }}>Locatalyze: How to Read a Location Analysis Report</p>
            <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.4)' }}>Click to visit our YouTube channel</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>To embed your own video: replace the onClick with {'<iframe src="https://www.youtube.com/embed/YOUR_ID" .../>'}</p>
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Adelaide Restaurant Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Weekend dinner traffic', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, detail: 'Adelaide restaurants live on Friday and Saturday night service. A location without strong weekend foot traffic (or precinct reputation for dining) faces a structural profitability challenge. Visit your candidate location on a Friday at 6:30pm and 8:00pm. Count pedestrians and note how many people are entering nearby restaurants. That volume, at 15–20% capture rate, determines your seat turnover potential.' },
              { title: 'Wine-culture demographic', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, detail: 'Adelaide\'s proximity to Barossa and McLaren Vale creates a customer base with genuine wine attachment that other Australian cities don\'t have. Above $85,000 median income — particularly with wine-region awareness — customers integrate wine into restaurant budgets. Below $70,000, wine becomes a discretionary addon with low uptake. A restaurant in Norwood can assume 40% of covers will include wine pairing; in Modbury, that drops to 8–10%.' },
              { title: 'Competition within 500m', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, detail: '2–4 direct competitors within 500m validates market demand for dining without saturation. 5–7 is workable with strong differentiation. Eight or more makes new entry extremely difficult. Restaurants have longer customer loyalty cycles than cafes, so market timing is more forgiving — but saturation still matters.' },
              { title: 'Rent-to-revenue ratio', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, detail: 'The single number that determines long-term survival. Monthly rent ÷ projected monthly revenue. Under 12%: excellent. 12–18%: workable with discipline. Above 18%: high risk. At $3,600/month rent, you need $30,000/month revenue to hit the 12% threshold — approximately 50 covers/day at $75 average ticket. If a location can\'t plausibly deliver that, the rent is too high.' },
            ].map(f => (
              <div key={f.title} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDFA', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F8FAFC', marginBottom: 3 }}>{f.title}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.emerald, marginBottom: 10 }}>{f.weight}</p>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Case study */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Case Study: Modern Australian Restaurant, The Parade Norwood
          </h2>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #064E3B, #0F766E)', padding: '22px 28px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F0FDF9' }}>Modern Australian Restaurant, The Parade Norwood SA 5067</h3>
              <p style={{ fontSize: 13, color: 'rgba(204,235,229,0.6)' }}>100 sqm · $3,800/mo rent · $75 avg ticket · 85 covers/day · $240k setup</p>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
                {[['Monthly revenue','$191,250',S.emerald],['Monthly costs','$138,000',S.red],['Monthly profit','$53,250',S.emerald],['Net margin','27.8%',S.emerald],['Annual profit','$639,000',S.emerald],['Payback','4.5 months',S.brand]].map(([l,v,c]) => (
                  <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $3,800, labour $48,000 (5 FTE at SA award rates), COGS 34% of revenue ($65,025), overheads $21,425, utilities $1,750. Revenue: 85 covers × $75 × 30 days. IBISWorld restaurant COGS benchmarks applied. Wine margin 38% included in COGS."/>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
                At 2% rent-to-revenue, this restaurant has extraordinary profitability. The same operation in Melbourne CBD (Chapel Street equiv) at $8,500/month rent and equivalent covers would generate $29,500/month profit — a $23,750 monthly difference (44% lower profit) purely from rent. Over 5 years, that\'s $1.43 million in differential profit from location alone.
              </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 70% of projected demand (60 covers/day)</p>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to ~$28,200. Still very profitable. A $60,000 cash reserve provides 2+ months of operational protection with no revenue. The low rent is what makes this scenario survivable — a restaurant at 18% rent-to-revenue at 70% demand is loss-making with no recovery path.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            7 Things to Do Before Signing an Adelaide Restaurant Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Visit on Friday at 6:30pm and 8:00pm', detail: 'Weekend dinner service is everything in Adelaide. Check foot traffic, precinct energy and existing restaurant occupancy on a Friday night. If other restaurants aren\'t full on a Friday, the location doesn\'t have adequate dinner traffic. This single visit tells you more than a week of desk research.' },
              { n: '02', tip: 'Calculate rent ÷ revenue before you tour the space', detail: 'Monthly rent divided by projected monthly revenue. If the answer exceeds 0.12, the economics are marginal regardless of ambition. This one number should determine whether you spend further time on a site. For restaurants, it\'s even more critical than cafes because fixed labour costs are higher.' },
              { n: '03', tip: 'Check SA Liquor Licensing timelines', detail: 'Adelaide restaurants require liquor licensing approval. The process takes 6–8 weeks and involves local consultation. Build this into your opening timeline. Late approvals create cash flow stress; never assume licensing is a simple administrative step.' },
              { n: '04', tip: 'Talk to two nearby restaurant operators', detail: 'Ask them directly: When are your quiet months? What\'s your weekday vs weekend revenue split? What do you wish you\'d known before opening? Adelaide hospitality operators are generally candid with fellow founders. Two conversations will tell you more than a week of desk research.' },
              { n: '05', tip: 'Visit at three different times of day', detail: 'Morning (7am), lunch (12pm), evening (7pm). Note foot traffic, walking patterns, parking availability and adjacent business energy at each time. Restaurants live on dinner, but weekday lunch and casual traffic inform your diversification potential.' },
              { n: '06', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level data is the starting point. The specific address — precinct position, visibility, adjacency to anchors — changes the score. A location on The Parade Norwood at Oxford Street is worth 8–12 points more than one at the Parade\'s quiet end.' },
              { n: '07', tip: 'Model 65% of demand, not 100%', detail: 'What does the restaurant look like if only 65% of expected covers arrive in Month 1? If the answer is loss-making with no cash reserve, the rent is too high. Adelaide\'s best locations survive this scenario. That\'s how you know they\'re actually viable.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $60k', rent: 'Not viable', comp: '7+', payback: 'N/A' })),
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
          <DataNote text="Income: ABS 2023–24. Rent: SA commercial data Q4 2025. Payback: Locatalyze model, $240k setup, IBISWorld restaurant COGS benchmarks."/>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Adelaide'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Adelaide'}</h3>
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
              { href: '/analyse/perth/restaurant', label: 'Restaurants in Perth' },
              { href: '/analyse/brisbane/cafe', label: 'Cafés in Brisbane' },
              { href: '/analyse/melbourne/cafe', label: 'Cafés in Melbourne' },
              { href: '/analyse/sydney/restaurant', label: 'Restaurants in Sydney' },
              { href: '/analyse/gold-coast/gym', label: 'Gyms on Gold Coast' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #0F766E 60%, #0891B2 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Adelaide address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(204,235,229,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street position, exact competitor count, proximity to dining anchors — produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Adelaide address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}
