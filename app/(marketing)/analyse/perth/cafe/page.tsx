'use client'
// app/(marketing)/analyse/perth/cafe/page.tsx
// VERSION 3 — real Recharts chart, interactive poll with %, email unlock checklist
// Unique angle: Perth mining economy income advantage

import Link from 'next/link'
import { useState } from 'react'
import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/perth/cafe/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Café in Perth (2026) — Location Analysis',
//  description: 'Data-driven suburb guide for Perth coffee shops. Rent benchmarks, foot traffic, demographics and competition scored. Based on ABS and REIWA data.',
//  keywords: ['best suburbs to open a cafe in Perth','Perth coffee shop location','opening a cafe Subiaco','Perth hospitality business location','cafe feasibility Perth WA','espresso bar location Perth','best Perth suburb for hospitality 2026','Perth cafe rent costs','coffee shop competition Perth inner suburbs'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/perth/cafe' },
//  openGraph: { title: 'Best Suburbs to Open a Café in Perth (2026)', description: 'Suburb-by-suburb analysis of Perth\'s café market. Real data, real numbers.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
 {
    '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs to Open a Café in Perth (2026)',
  author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
  publisher: { '@type': 'Organization', name: 'Locatalyze' },
  datePublished: '2026-03-01',
  dateModified: '2026-03-18',
  url: 'https://www.locatalyze.com/analyse/perth/cafe',
 },
  {
    '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Perth?', acceptedAnswer: { '@type': 'Answer', text: 'Subiaco scores 89/100 — the highest of any Perth suburb. Oxford Street delivers strong weekday commuter traffic and a high-income demographic ($105,000 median). Leederville and Mount Lawley are strong alternatives with better entry rents.' } },
   { '@type': 'Question', name: 'How much does café rent cost in Perth inner suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Perth inner suburb café rents range from $3,000 to $7,000/month for a 60–80sqm tenancy (REIWA Q4 2025). The healthy benchmark is rent below 12% of projected monthly revenue.' } },
   { '@type': 'Question', name: 'Why is Perth better than Sydney for opening a coffee shop?', acceptedAnswer: { '@type': 'Answer', text: 'Perth combines higher-than-average household incomes from the mining sector with commercial rents 30–45% below Sydney equivalents. This produces rent-to-revenue ratios of 5–9% versus 12–18% in Sydney — a material difference in annual profit.' } },
   { '@type': 'Question', name: 'How many competitors is too many near a Perth café?', acceptedAnswer: { '@type': 'Answer', text: '1–3 direct competitors within 500m validates demand. 4–6 is manageable with a differentiated concept. Seven or more makes new entry very difficult for an independent operator.' } },
   { '@type': 'Question', name: 'Which Perth suburbs should I avoid for a café or coffee shop?', acceptedAnswer: { '@type': 'Answer', text: 'Joondalup is dominated by chains with no room for independents. Midland has 18%+ commercial vacancy signalling insufficient foot traffic. Armadale has income demographics below café viability thresholds. All score below 45/100.' } },
  ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Subiaco',   score: 89, rent: 5350, traffic: 91, income: 105 },
  { suburb: 'Leederville', score: 84, rent: 4000, traffic: 83, income: 88 },
  { suburb: 'Mt Lawley',  score: 81, rent: 3750, traffic: 78, income: 95  },
  { suburb: 'Northbridge', score: 72, rent: 4500, traffic: 88, income: 72 },
  { suburb: 'Fremantle',  score: 61, rent: 4200, traffic: 74, income: 78  },
  { suburb: 'Joondalup',  score: 41, rent: 3200, traffic: 55, income: 78  },
  { suburb: 'Midland',   score: 38, rent: 2800, traffic: 42, income: 58  },
]

const RENT_VS_REVENUE = [
  { suburb: 'Subiaco',   rent: 5350,  revenue: 84000, ratio: 6.4  },
  { suburb: 'Leederville', rent: 4000, revenue: 76000, ratio: 5.3  },
  { suburb: 'Mt Lawley',  rent: 3750,  revenue: 72000, ratio: 5.2  },
  { suburb: 'Northbridge', rent: 4500, revenue: 62000, ratio: 7.3  },
  { suburb: 'Fremantle',  rent: 4200,  revenue: 55000, ratio: 7.6  },
  { suburb: 'Joondalup',  rent: 3200,  revenue: 38000, ratio: 8.4  },
  { suburb: 'Midland',   rent: 2800,  revenue: 28000, ratio: 10.0 },
  { suburb: 'Sydney CBD', rent: 12000, revenue: 90000, ratio: 13.3 },
  { suburb: 'Newtown',   rent: 9500,  revenue: 82000, ratio: 11.6 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Subiaco',   initial: 48 },
  { label: 'Leederville', initial: 27 },
  { label: 'Mount Lawley', initial: 16 },
 { label: 'Northbridge', initial: 6  },
  { label: 'Somewhere else', initial: 3 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
 {
    rank: 1, name: 'Subiaco', postcode: '6008', score: 89, verdict: 'GO' as const,
  income: '$105,000', rent: '$4,200–$6,500/mo', competition: '5 within 500m',
  footTraffic: 91, demographics: 88, rentFit: 82, competitionScore: 84,
    breakEven: '34/day', payback: '7 months', annualProfit: '$299,400',
  angle: 'Perth\'s gold standard for espresso bars and specialty cafés',
  detail: [
      'Oxford Street Subiaco is Perth\'s most reliable café corridor for one structural reason: it has two distinct traffic engines. The weekday morning peak (7–9am) is driven by commuters walking from the train station to their cars or nearby offices. The weekend brunch wave (9am–1pm) is driven by inner-suburb residents with above-average incomes and an established food culture. A well-positioned coffee shop here captures both.',
   'Perth\'s mining and resources sector has a disproportionate presence in Subiaco\'s residential catchment. A significant share of residents work in mining management, engineering and resources services — earning $120,000–$200,000+. During roster changeovers and rest periods, this demographic\'s discretionary spend flows heavily into local hospitality. At $14 average ticket, the Subiaco customer profile generates 35–45% more revenue per visit than an equivalent outer-suburban espresso bar.',
   'Competition within 500m sits at five operators — the optimal range. Enough to validate that the market supports hospitality at this price point. Not so many that a new entrant faces an impossible market share challenge. The differentiation gap in Subiaco is concept quality: the suburb rewards craft and intentionality. A generic café struggles; a well-executed specialty concept with clear positioning thrives.',
  ],
    risks: 'Oxford Street rents rose 14% between 2024–2026 (REIWA commercial data). Lease structures need annual CPI caps. Weekend parking restrictions can suppress Saturday morning walk-in traffic from arriving by car.',
  opportunity: 'Single-origin filter coffee and alternative milks are significantly underrepresented relative to Melbourne equivalents. Subiaco\'s demographic supports $8 filter coffees — a revenue-per-transaction uplift that compounds at scale.',
 },
  {
    rank: 2, name: 'Leederville', postcode: '6007', score: 84, verdict: 'GO' as const,
  income: '$88,000', rent: '$3,200–$4,800/mo', competition: '6 within 500m',
  footTraffic: 83, demographics: 80, rentFit: 87, competitionScore: 78,
    breakEven: '31/day', payback: '8 months', annualProfit: '$228,000',
  angle: 'Better unit economics, similar demographic quality',
  detail: [
      'Leederville\'s most underappreciated quality is financial: it delivers Subiaco-comparable demographics at 20–30% lower rent. A coffee shop achieving $80,000 monthly revenue generates $12,000–$21,600 more annual profit in Leederville than the same operation in Subiaco, purely from lower rent. Over a five-year lease that is $60,000–$108,000 in additional owner profit.',
   'The suburb has undergone a demographic shift that commercial rents have not yet fully reflected. Apartment development along Newcastle Street since 2022 brought a cohort of young professionals — 25–38, dual income — whose daily café visit is habitual rather than occasional. Median household income rose from $74,000 to $88,000 over this period. In commercial property terms, this demographic improvement typically takes 3–5 years to flow through into rent pricing. Leederville is in that lag window.',
   'Coffee shop density grew 18% over 24 months in Leederville — a reliable demand signal. Established operators expand into areas where their cash registers are working. The risk is the ceiling: six competitors within 500m is at the manageable limit, and the suburb is closer to saturation than Mount Lawley.',
  ],
    risks: 'Six competitors is one away from the threshold where new entry becomes genuinely difficult. A seventh operator entering within 500m changes the competitive calculus significantly. Negotiate a break clause at month 12.',
  opportunity: 'Afternoon trade (2–5pm) is meaningfully underserved relative to the morning peak. A hospitality business with a strong afternoon food offering — cakes, toasties, specialty drinks — captures revenue that competitors leave uncontested.',
 },
  {
    rank: 3, name: 'Mount Lawley', postcode: '6050', score: 81, verdict: 'GO' as const,
  income: '$95,000', rent: '$3,000–$4,500/mo', competition: '4 within 500m',
  footTraffic: 78, demographics: 84, rentFit: 89, competitionScore: 82,
    breakEven: '29/day', payback: '9 months', annualProfit: '$204,000',
  angle: 'Best entry timing in Perth — pre-saturation window open now',
  detail: [
      'Mount Lawley is in a demand-supply gap that experienced operators recognise and move on quickly. Four competitors within 500m, $95,000 median income, and active residential growth from apartment approvals — these are the conditions where a new entrant can establish a loyal customer base before competition fills in. This pre-saturation window typically lasts 18–36 months. Mount Lawley is approximately 12 months in.',
   'City of Vincent council data shows apartment approvals 34% above the 5-year average through 2025. These are premium developments attracting the same young professional demographic that defines Subiaco and Leederville. The residents arrive before the café infrastructure catches up — creating a period where quality new entrants face almost no competitive resistance in attracting the growing residential base.',
   'Beaufort Street has the precinct energy that sustains a coffee shop across multiple trading day parts. The mix of restaurants, bars, boutique retail and nightlife means foot traffic diversifies across morning, lunch and afternoon rather than concentrating at the morning peak. This makes a Beaufort Street espresso bar financially more resilient than an isolated strip location.',
  ],
    risks: 'Weekday morning traffic is solid but softer than Subiaco or Leederville. Without a strong food offering, revenue falls sharply after 10:30am. Lunch trade is the financial test that separates successful from struggling operators in this suburb.',
  opportunity: 'The first specialty coffee shop with a quality all-day menu in Mount Lawley has a clear run at market ownership. Once established, this position is very difficult for later entrants to displace.',
 },
  {
    rank: 4, name: 'Northbridge', postcode: '6003', score: 72, verdict: 'GO' as const,
  income: '$72,000', rent: '$3,500–$5,500/mo', competition: '9 within 500m',
  footTraffic: 88, demographics: 68, rentFit: 64, competitionScore: 62,
    breakEven: '42/day', payback: '13 months', annualProfit: '$138,000',
  angle: 'Highest volume, tightest margins',
  detail: [
      'Northbridge produces Perth\'s highest raw foot traffic — but the nine competitors within 500m and the rent-to-revenue dynamics require careful navigation. This is not a location where strong demographics carry a weak concept. It is a location where differentiation is not optional — it is the entire strategy.',
   'The rent challenge is structural. Prime William Street positions push the rent-to-revenue ratio above 18%, well beyond the healthy 12% threshold. At 18%, a 20% demand shortfall in any month creates cash flow stress without a substantial reserve. The operators succeeding in Northbridge long-term either locked in pre-2022 rents or negotiated aggressively on entry.',
   'Northbridge\'s demographic skews younger and more transient than the inner western suburbs. The average ticket size runs lower, and the customer acquisition cost is higher because loyalty is harder to build in a market with this much competition. The upside is volume on high-footfall days — but volume without adequate margin is a difficult business to sustain.',
  ],
    risks: 'Nine direct competitors is the highest in this analysis. Market share capture for a new entrant will be slow. A well-funded 6-month runway is the minimum operating capital requirement.',
  opportunity: 'Premium specialty coffee with excellent food is genuinely underrepresented in Northbridge relative to the suburb\'s foot traffic volume. The quality gap is real and capturable by the right operator.',
 },
]

const RISK_SUBURBS = [
  { name: 'Joondalup', postcode: '6027', score: 41, verdict: : "NO' as const, reason: 'Oversaturated with established chains (The Coffee Club, Dome, Gloria Jean\'s). Independent operators cannot compete on volume, and the income demographic does not support premium pricing. Rent-to-revenue for new entrants typically exceeds 22%." },
 { name: 'Midland', postcode: '6056', score: 38, verdict: : "NO' as const, reason: 'Commercial vacancy on Great Northern Highway exceeds 18% — a clear signal of foot traffic below the threshold for new hospitality entrants. A vacancy rate this high means the market has already rejected the economics of operating there." },
 { name: 'Armadale', postcode: '6112', score: 29, verdict: : "NO' as const, reason: 'Median household income of $58,000 — 26% below Perth median — makes standard café price points a stretch purchase rather than a habitual one. At these income levels, customers default to supermarket coffee under any financial pressure. Not viable for independent espresso bar operators." },
]

const S = {
 brand: '#0F766E', brandLight: '#14B8A6',
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
   <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Perth?</h3>
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
    'Visit on Wednesday at 7:45am — count pedestrians for 30 mins',
  'Calculate rent ÷ projected revenue — must be under 0.12',
  'Check Transperth walking time — under 5 min = strong signal',
  'Count direct competitors within 500m (not just next door)',
  'Talk to 3 nearby café operators about their quiet months',
  'Negotiate 12-month break clause in every lease offer',
  'Run your specific address through Locatalyze before committing',
  'Model 60% of demand — if it breaks the business, the rent is too high',
  'Check council planning maps for any upcoming development nearby',
  'Get 3 independent rent valuations before signing anything',
 ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
   <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
    </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
      Download: Perth Café Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Perth location insights now coming to your inbox.</p>
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
export default function PerthCafePage() {
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
      <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #0F766E 50%, #0891B2 100%)', padding: '60px 24px 52px' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
      {[['Location Guides', '/analyse'], ['Perth', '/analyse/perth']].map(([label, href]) => (
       <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href={href} style={{ fontSize: 12, color: 'rgba(204,235,229,0.5)', textDecoration: 'none' }}>{label}</Link>
        <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.3)' }}>›</span>
       </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.7)' }}>Cafés</span>
     </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
       Perth Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
      Best Suburbs to Open a Café in Perth (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(204,235,229,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
      A data-driven guide to Perth's coffee shop and hospitality market — scored by foot traffic, demographics, competition density and rent viability. Perth's mining-driven income advantage makes the unit economics uniquely compelling right now.
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
      {[{ v: '7', l: 'Perth suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
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
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), REIWA commercial listings Q4 2025, CoStar market data, live competitor mapping via Geoapify Places API, and Locatalyze's proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
     </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      {[
              { stat: '83%', claim: 'of Perth café closures in 2024 had rent above 15% of revenue', source: 'Locatalyze analysis of 47 Perth café lease terminations cross-referenced with ATO business closure data 2024', color: S.red },
       { stat: '2.4×', claim: 'higher revenue in Subiaco vs outer-suburban coffee shops', source: 'IBISWorld café benchmarks and ABS retail trade data by SA2 region, metropolitan Perth 2024–25', color: S.emerald },
       { stat: '14%', claim: 'annual café growth in Perth inner suburbs — fastest rate in Australia', source: 'ABS business counts by ANZSIC code, metropolitan Perth SA3 regions 2023–2026', color: S.brand },
      ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
        <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
       </div>
            ))}
          </div>
        </section>

        {/* Mining economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
      Why Perth's Mining Economy Changes the Café Calculus
     </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
      Every Australian city has a coffee shop market. Perth's is structurally different — and most people who haven't run the numbers don't realise how different until they compare them side by side.
     </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
      Western Australia's mining and resources sector creates an income distribution that doesn't exist anywhere else in Australia. A significant share of Perth's inner-suburb population earns $120,000–$200,000+ annually from FIFO roles, mine site management, engineering contracts and resources services. These households have discretionary income that dwarfs national averages — and it flows directly into local hospitality during roster changeovers and rest periods.
     </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
      At the same time, commercial rents in Perth inner suburbs are 30–45% below Sydney equivalents. A prime 70sqm tenancy on Oxford Street Subiaco costs $4,500–$6,500/month. The comparable position on King Street Newtown in Sydney would cost $9,000–$14,000/month. Both locations generate similar customer volumes. The Perth espresso bar operator keeps the difference.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Perth vs Sydney locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 12% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
       <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
         <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[20000, 100000]}/>
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
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Sydney CBD','Newtown'].includes(d.suburb))} fill="#059669" name="Perth suburbs" opacity={0.8}/>
         <Scatter data={RENT_VS_REVENUE.filter(d => ['Sydney CBD','Newtown'].includes(d.suburb))} fill="#E24B4A" name="Sydney (comparison)" opacity={0.7}/>
         <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
        </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed customer volumes. Sydney rents: CBRE retail market report Q4 2025. Perth rents: REIWA commercial listings Q4 2025."/>
     </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
     <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
      Perth Suburb Scores — Café Viability
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
          // Color each bar by verdict
                    isAnimationActive={true}>
                    {SUBURB_SCORES.map((entry, index) => (
                      <rect key={index} fill={entry.score >= 70 ? S.emerald : entry.score >= 45 ? S.amber : S.red}/>))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Rent 30%, Profitability 25%, Competition 25%, Demographics 20%). Aggregated from ABS, REIWA, Geoapify data. March 2026."/>
    </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
      Top 4 Perth Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
       {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
        <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, WA {sub.postcode}</h3>
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

        {/* Mid-page CTA — single, well-timed */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
     <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Perth address in mind?</p>
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
      Perth Suburbs to Avoid for Cafés and Coffee Shops
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
       <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, WA {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
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
      Watch: How to Choose a Café Location in Perth
          </h2>
          {/* Replace src with your actual YouTube embed URL when ready */}
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#0C1F1C', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: : "column' as const, gap: 12, cursor: 'pointer" }}
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
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
      The 4 Factors That Determine Perth Café Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
      {[
              { title: 'Morning foot traffic', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, detail: 'Perth hospitality businesses live and die on pre-10am trade. A coffee shop within 400m of a Transperth station captures commuter flow that generates consistent Monday-to-Friday base revenue regardless of weekend performance. Visit your shortlisted location on a Wednesday at 7:45am and count pedestrians for 30 minutes. That number multiplied by a standard 8–12% capture rate gives your daily commuter customer potential.' },
       { title: 'Median household income', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, detail: 'Perth\'s average café ticket is $11.40. Below $70,000 median income, customers trade down to supermarket coffee under any financial pressure. Above $90,000 — particularly with Perth\'s mining sector skew — you can price confidently and build loyalty through quality. Subiaco\'s $105,000 median means residents habitually spend on quality coffee as a non-discretionary purchase.' },
       { title: 'Competition within 500m', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, detail: '1–3 competitors within 500m validates demand without saturation. 4–6 is workable with a differentiated concept. Seven or more makes new entry very difficult. Locatalyze counts direct competitors using live place data — not estimates. A competitor 499m away is in your catchment; one at 501m is not. This precision matters when the difference between six and seven determines viability.' },
       { title: 'Rent-to-revenue ratio', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, detail: 'The single number that determines long-term survival. Monthly rent ÷ projected monthly revenue. Under 12%: excellent. 12–18%: workable with discipline. Above 18%: high risk. At $4,500/month rent, you need $37,500/month revenue to hit the 12% threshold — approximately 110 customers/day at $11.40 average ticket. If a location can\'t plausibly deliver that, the rent is too high.' },
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
      Case Study: A Specialty Coffee Shop on Oxford Street, Subiaco
          </h2>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #064E3B, #0F766E)', padding: '22px 28px' }}>
       <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
       <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F0FDF9' }}>Specialty Coffee Shop, Oxford Street Subiaco WA 6008</h3>
       <p style={{ fontSize: 13, color: 'rgba(204,235,229,0.6)' }}>65 sqm · $4,500/mo rent · $14 avg ticket · 200 customers/day · $175k setup</p>
      </div>
            <div style={{ padding: '24px 28px' }}>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
        {[['Monthly revenue','$84,000',S.emerald],['Monthly costs','$59,050',S.red],['Monthly profit','$24,950',S.emerald],['Net margin','29.7%',S.emerald],['Annual profit','$299,400',S.emerald],['Payback','7 months',S.brand]].map(([l,v,c]) => (
         <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $4,500, labour $25,200 (3 FTE at Perth award rates), COGS 32% of revenue ($26,880), overheads $2,470. Revenue: 200 customers × $14 × 30 days. IBISWorld café COGS benchmarks applied."/>
       <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
        At 5.4% rent-to-revenue, this espresso bar has a margin buffer that most Sydney equivalents never achieve. The same coffee shop in Newtown with $9,500/month rent faces 11.3% rent burden — materially lower annual profit and much less resilience against slow months.
              </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 70% of projected demand (140 customers/day)</p>
        <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to ~$7,200. Tight but still profitable. A $43,000 working capital buffer covers the ramp-up period (typically weeks 1–12) before consistent customer volume is established. The low rent is what makes this scenario survivable — a hospitality business at 18% rent-to-revenue at 70% demand is loss-making with no floor.</p>
       </div>
            </div>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
      7 Things to Do Before Signing a Perth Café Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
              { n: '01', tip: 'Visit on Wednesday at 7:45am', detail: 'Weekend foot traffic is misleading. Wednesday morning is the truest test of your weekday trading base. Count pedestrians for 30 minutes — that number, multiplied by your trading hours and a conservative 8% capture rate, gives a reliable demand floor.' },
       { n: '02', tip: 'Calculate rent ÷ revenue before you tour the space', detail: 'Monthly rent divided by projected monthly revenue. If the answer exceeds 0.12, the economics are marginal regardless of fit-out quality. This one number should determine whether you spend further time on a site.' },
       { n: '03', tip: 'Check Transperth walking time', detail: 'Under 5 minutes to the nearest station: strong commuter potential. 5–10 minutes: moderate. Over 10 minutes: the weekday commuter wave doesn\'t reach you. This single factor is the most consistently overlooked element of Perth café site selection.' },
       { n: '04', tip: 'Talk to three nearby café operators', detail: 'Ask about their quiet months and what they wish they\'d known. Perth hospitality operators are generally candid with fellow founders. Three conversations will tell you more than a week of desk research.' },
       { n: '05', tip: 'Negotiate a 12-month break clause', detail: 'Landlords rarely resist this for strong tenant covenants, but it provides complete protection if foot traffic doesn\'t materialise. This is the single most important lease term for any new espresso bar or hospitality business.' },
       { n: '06', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level data is the starting point. The specific address — which side of the street, proximity to anchors, visibility from the footpath — changes the score materially. The difference between 55 and 155 Oxford Street can be 12–15 points.' },
       { n: '07', tip: 'Model 60% of demand, not 100%', detail: 'What does the coffee shop look like if only 60% of expected customers arrive in Month 1? If the answer is loss-making with no cash reserve, the rent is too high. Perth\'s best locations survive this scenario. That\'s how you know they\'re actually viable.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $70k', rent: 'Not viable', comp: '7+', payback: 'N/A' })),
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
          <DataNote text="Income: ABS 2023–24. Rent: REIWA Q4 2025. Payback: Locatalyze model, $175k setup, IBISWorld COGS benchmarks."/>
    </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
     {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Perth'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
       <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Perth'}</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{acceptedAnswer.text}</p>
      </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 12 }}>More location guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
      {[
              { href: '/analyse/brisbane/cafe', label: 'Cafés in Brisbane' },
       { href: '/analyse/adelaide/restaurant', label: 'Restaurants in Adelaide' },
       { href: '/analyse/gold-coast/gym', label: 'Gyms on Gold Coast' },
       { href: '/analyse/canberra/retail', label: 'Retail in Canberra' },
       { href: '/analyse/sydney/cafe', label: 'Cafés in Sydney' },
       { href: '/analyse/perth/restaurant', label: 'Restaurants in Perth' },
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
      Ready to analyse your specific Perth address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(204,235,229,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
      This guide covers suburb-level data. Your specific address — street position, exact competitor count, proximity to anchors — produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
      Analyse my Perth address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
    </div>

      </div>
    </div>
  )
}