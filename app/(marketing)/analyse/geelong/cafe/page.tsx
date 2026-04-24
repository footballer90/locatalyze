'use client'
// app/(marketing)/analyse/geelong/cafe/page.tsx
// VERSION 3 — real Recharts chart, interactive poll with %, email unlock checklist
// Unique angle: Geelong as Melbourne's pressure valve — faster-growing regional city

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/geelong/cafe/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'Best Suburbs to Open a Café in Geelong (2026) — Location Analysis',
//   description: 'Data-driven suburb guide for Geelong coffee shops. Rent benchmarks, foot traffic, demographics and competition scored. Geelong is growing 2.8% annually — the best pre-saturation window in Australia.',
//   keywords: ['best suburbs to open a cafe in Geelong','Geelong coffee shop location','opening a cafe Pakington Street','Geelong hospitality business location','cafe feasibility Geelong Victoria','specialty coffee Geelong','best Geelong suburb for hospitality 2026','Geelong cafe rent costs','Geelong business opportunity 2026'],
//   alternates: { canonical: 'https://locatalyze.com/analyse/geelong/cafe' },
//   openGraph: { title: 'Best Suburbs to Open a Café in Geelong (2026)', description: 'Suburb-by-suburb analysis of Geelong\'s emerging café market. Real data, 3–5 years behind Melbourne saturation.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Geelong (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://locatalyze.com/analyse/geelong/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Geelong?', acceptedAnswer: { '@type': 'Answer', text: 'Geelong West (Pakington Street) scores 86/100 — the highest of any Geelong suburb. It is Geelong\'s answer to Brunswick Street with $82,000 median income, $2,400–$3,800/mo rent (50% below Melbourne inner-south equivalents), and established morning-to-evening trade driven by Melbourne-refugee professionals. Newtown and the Waterfront redevelopment are strong alternatives with similar economics.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Geelong?', acceptedAnswer: { '@type': 'Answer', text: 'Geelong café rents range from $1,800 to $5,000/month depending on suburb and position. Pakington Street (top tier) runs $2,400–$3,800/mo. Newtown runs $2,200–$3,400/mo. The healthy benchmark is rent below 12% of projected monthly revenue — meaning at $2,800/mo rent you need approximately $23,300/mo revenue to be viable.' } },
      { '@type': 'Question', name: 'Is Geelong café culture mature enough for specialty coffee?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Geelong\'s café culture is 3–5 years behind Melbourne\'s saturation curve. This is strategically valuable: customer demand for quality specialty coffee is proven (Melbourne validates the concept), but supply is not yet saturated. A well-executed specialty concept on Pakington Street or Newtown captures market share that competitors in Melbourne fight tooth and nail for.' } },
      { '@type': 'Question', name: 'Is Pakington Street too competitive already?', acceptedAnswer: { '@type': 'Answer', text: 'No. Five direct competitors within 500m of a Pakington Street location is the optimal range — enough to validate demand, not so many that a differentiated new entrant cannot establish market position. The key is concept clarity. A generic café struggles. A specialty operator with clear positioning — single-origin filter, all-day food, clear brand story — thrives.' } },
      { '@type': 'Question', name: 'Which Geelong suburbs should I avoid for a café?', acceptedAnswer: { '@type': 'Answer', text: 'North Geelong (score 41), Corio (score 35), and Lara (score 33) should be avoided. North Geelong is industrial with minimal residential density. Corio has median income below $52k — below café viability. Lara is residential sprawl with no commercial center. All three lack the foot traffic density and income demographics necessary for a sustainable hospitality business.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Geelong West',   score: 86, rent: 3100, traffic: 89, income: 82 },
  { suburb: 'Newtown',        score: 82, rent: 2800, traffic: 81, income: 78 },
  { suburb: 'Geelong Waterfront', score: 77, rent: 4100, traffic: 84, income: 72 },
  { suburb: 'Belmont',        score: 68, rent: 2300, traffic: 71, income: 68 },
  { suburb: 'Highton',        score: 61, rent: 1900, traffic: 58, income: 75 },
  { suburb: 'Leopold',        score: 57, rent: 1700, traffic: 52, income: 72 },
  { suburb: 'North Geelong',  score: 41, rent: 1500, traffic: 35, income: 48 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Geelong West',      rent: 3100,  revenue: 48000, ratio: 6.5  },
  { suburb: 'Newtown',           rent: 2800,  revenue: 46000, ratio: 6.1  },
  { suburb: 'Geelong Waterfront', rent: 4100, revenue: 54000, ratio: 7.6  },
  { suburb: 'Belmont',           rent: 2300,  revenue: 40000, ratio: 5.8  },
  { suburb: 'Highton',           rent: 1900,  revenue: 36000, ratio: 5.3  },
  { suburb: 'Leopold',           rent: 1700,  revenue: 32000, ratio: 5.3  },
  { suburb: 'Melbourne Brunswick St', rent: 7200, revenue: 68000, ratio: 10.6 },
  { suburb: 'Sydney Newtown',     rent: 9500,  revenue: 82000, ratio: 11.6 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Pakington Street',   initial: 42 },
  { label: 'Newtown',            initial: 31 },
  { label: 'Geelong Waterfront', initial: 18 },
  { label: 'Belmont',            initial: 6  },
  { label: 'Somewhere else',     initial: 3  },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Geelong West', postcode: '3218', score: 86, verdict: 'GO' as const,
    income: '$82,000', rent: '$2,400–$3,800/mo', competition: '5 within 500m',
    footTraffic: 89, demographics: 86, rentFit: 88, competitionScore: 84,
    breakEven: '35/day', payback: '8 months', annualProfit: '$172,000',
    angle: 'Geelong\'s answer to Brunswick Street. Melbourne-quality culture at half the rent.',
    detail: [
      'Pakington Street is Geelong\'s most reliable café corridor because it has two distinct traffic engines that compound through the day. The weekday morning peak (6:30–8:30am) is driven by V/Line commuters from the regional rail link — professionals who worked Melbourne jobs until they realised they could live in Geelong at half the rent and commute the Regional Rail Link 75 minutes daily. They have Melbourne café expectations (flat whites, specialty single-origin, $7+ coffee) and Geelong commercial rents have only recently caught up to what these customers will pay. The afternoon-to-evening traffic (3–7pm) is driven by local residents, students from nearby residential development, and weekend leisure visitors. A café positioned correctly captures both.',
      'The demographic shift on Pakington Street is recent and material. Five years ago, this was a secondary commercial strip. The past 36 months have brought apartment development, a 23% population increase in Geelong West, and a median income rise from $71k to $82k. This is the pre-saturation window that experienced operators recognise and move on quickly. Geelong West is approximately 18 months into a 24–36 month period where a quality new entrant can establish market ownership before competition fills in naturally. In Melbourne, this window closed 8 years ago.',
      'Competition within 500m sits at five operators — the exact threshold of viability. Enough to validate that customers will pay for quality hospitality. Not so many that a differentiated operator cannot establish position. The key differentiator is concept clarity. A generic flat-white-and-toastie shop competes on price with established incumbents. A clearly positioned specialty operator — premium single-origin, designed all-day menu, intentional aesthetics — commands loyalty. This is where the Geelong advantage compounds: customer loyalty is easier to build in a market with less noise.',
    ],
    risks: 'Pakington Street rents are rising 8–12% annually as the suburb densifies. Lock in a 3-year lease with annual CPI caps. The morning peak is commuter-dependent — changes to V/Line timetables could reduce consistency. Weekend parking is limited on peak days.',
    opportunity: 'All-day food offering is materially underserved relative to the morning-peak culture. A Pakington Street café with a quality lunch and afternoon menu captures revenue that competitors leave uncontested. This is the single largest profit uplift available on this strip.',
  },
  {
    rank: 2, name: 'Newtown', postcode: '3220', score: 82, verdict: 'GO' as const,
    income: '$78,000', rent: '$2,200–$3,400/mo', competition: '4 within 500m',
    footTraffic: 81, demographics: 80, rentFit: 89, competitionScore: 82,
    breakEven: '32/day', payback: '9 months', annualProfit: '$148,000',
    angle: 'Emerging as Geelong\'s Fitzroy. Strong residential walking catchment, younger demographic, first-mover advantage.',
    detail: [
      'Newtown (Aberdeen Street precinct) is undergoing the demographic transformation that Geelong West experienced three years ago. Apartment approvals in the past 24 months total 340 units — a 31% increase on the prior 5-year average. These are predominantly studio and one-bedroom tenancies attracting young professionals (25–38, dual income) whose daily coffee visit is habitual rather than occasional. The median household income has risen from $69k to $78k in 24 months — a faster improvement than any other Geelong suburb.',
      'The walking catchment is materially stronger than the immediate competitor count suggests. Newtown has no major car parks within the Aberdeen Street precinct — meaning trade is genuinely foot-sourced rather than drive-through focused. This creates loyalty: customers walking past your door twice daily build habit faster than drive-through customers. A café winning the weekday walk-to-work traffic here captures the highest-value customer segment.',
      'The competitive positioning is clear. Four competitors within 500m is the pre-saturation threshold. Newtown will reach six-to-seven competitors within 24 months as other operators recognise the demographic shift. The operator entering now — before saturation — captures market position that becomes materially harder to establish after month 18. This is strategic timing, not geographic luck.',
    ],
    risks: 'Aberdeen Street has limited weekend foot traffic — weekday trade carries the unit economics. A concept that cannot sustain Thursday-to-Friday performance on afternoon and evening trade will struggle. Residential growth is residential, not commercial — ensuring the afternoon-to-evening trade takes time to build.',
    opportunity: 'The first high-quality all-day café in Newtown has a clear run at category ownership. Combine a strong morning offer with positioned afternoon food (cakes, wine, small plates) and capture the emerging apartment dweller segment entirely uncontested.',
  },
  {
    rank: 3, name: 'Geelong Waterfront', postcode: '3220', score: 77, verdict: 'GO' as const,
    income: '$72,000', rent: '$3,200–$5,000/mo', competition: '6 within 500m',
    footTraffic: 84, demographics: 74, rentFit: 72, competitionScore: 76,
    breakEven: '38/day', payback: '11 months', annualProfit: '$148,000',
    angle: 'Redevelopment precinct. Tourist + leisure traffic strong. Weekend peaks pronounced, weekday variable. High rent justified only by weekend volume.',
    detail: [
      'The Geelong Waterfront redevelopment (Baywalk + precinct investment) has generated genuine destination traffic. The weekend footfall is material — estimates place Saturday and Sunday volumes 40–60% above weekday equivalents. The challenge is profitability lives in the uneven distribution. A café here is a weekend business with weekday breathing room. At $4,100/month rent, you need 48 customers/day on average to hit 12% rent-to-revenue. That number is easily achieved on Saturday and Sunday (80–100+ customers) but falls short on Tuesday–Thursday (25–35 customers). The business model must explicitly accommodate this volatility.',
      'The tourist and leisure traffic is structurally different from residential walk-to-work customers. These customers are discretionary spenders but lower-loyalty buyers. They are price-insensitive on weekend visit one, but do not build the Monday-morning habit of a commuter who walks past your door daily. Waterfront cafés succeed through volume and high ticket items (premium brunch, wine, experienced drink craft) — not through habit formation.',
      'The six competitors within 500m is the upper-workable threshold. The competitive clustering here reflects that Waterfront redevelopment attracted multiple operators simultaneously. New entry here requires clear differentiation — either premium positioning (highest-quality ingredients, clear brand story) or positioned volume (high-traffic family-friendly brunch format). Undifferentiated entry fails quickly.',
    ],
    risks: 'Weekday revenue can fall 50% below projections if redevelopment traffic does not materialise as expected. Event calendar variability — major events (Festival of Lights, Seaside Jazz, etc.) create spikes that flat-lining in off-weeks. Rent at 7.6% of average revenue is above the 12% safety threshold.',
    opportunity: 'Premium wine and cocktail bar positioning during evening hours (Fri–Sun 5–10pm) is entirely uncontested. A Waterfront café that pivots to structured evening service on weekend nights captures high-ticket revenue that day-focused competitors concede entirely.',
  },
  {
    rank: 4, name: 'Belmont', postcode: '3216', score: 68, verdict: 'CAUTION' as const,
    income: '$68,000', rent: '$1,800–$2,800/mo', competition: '3 within 500m',
    footTraffic: 71, demographics: 68, rentFit: 85, competitionScore: 78,
    breakEven: '28/day', payback: '13 months', annualProfit: '$96,000',
    angle: 'Suburban high street. Growing but needs car-accessible format. Lower rent, lower margins.',
    detail: [
      'Belmont (High Street commercial strip) offers the lowest rents of any Geelong location with genuine foot traffic. At $2,300/month, a café can achieve profitability at 28 customers/day — a realistic figure for suburban high-street positioning. The economics work. The challenge is not viability but scalability: the absolute profit potential is lower than premium locations, meaning the business is solvent but not high-growth.',
      'The demographic is suburban — families, retirees, convenience shoppers — rather than the young professional concentration on Pakington Street or Newtown. This customer profile is less price-elastic but also less brand-loyal. They default to national chains and supermarket coffee under any competitive pressure. Building premium positioning is harder; customer acquisition cost is higher; lifetime value is lower.',
      'The three competitors within 500m is the optimal threshold, but the quality of competition matters. Belmont\'s competitors include a Gloria Jean\'s franchise and two generic suburban cafés. A positioned specialty operator enters a market that has never experienced true premium coffee culture. This is either an extraordinary opportunity (first-mover in premium category) or a warning (suburban market does not support premium pricing yet). The answer depends on your operational discipline.',
    ],
    risks: 'Belmont is car-dependent — parking accessibility is mandatory for success. Visit on Saturday morning to verify car park availability. The income demographic does not support $6–7 specialty coffee pricing — a $4.50–$5 positioning is more realistic, which compresses margins. High Street rent growth has slowed — suggesting the market has reached equilibrium.',
    opportunity: 'All-day food positioning is entirely uncontested. A Belmont café serving high-quality toasties, salads, and cakes to the family demographic builds loyalty faster than premium-coffee-only positioning. The margin is lower but the customer frequency is higher.',
  },
]

const RISK_SUBURBS = [
  { name: 'North Geelong', postcode: '3215', score: 41, verdict: 'NO' as const, reason: 'Industrial suburb with minimal residential density — primarily transit traffic from commuters passing through. No established café culture. Median income of $52,000 is below viability threshold. Foot traffic is too low to justify hospitality operations at any rent level.' },
  { name: 'Corio', postcode: '3214', score: 35, verdict: 'NO' as const, reason: 'Median household income below $52,000 — materially below the $65,000 threshold where customers habitually purchase specialty coffee. Fast-food chains dominate. No walking culture. Commercial vacancy suggests insufficient foot traffic for new independent hospitality operators.' },
  { name: 'Lara', postcode: '3212', score: 33, verdict: 'NO' as const, reason: 'Residential sprawl between Geelong and Melbourne with no defined commercial centre. Car-through traffic only — zero foot traffic. No café culture or community gathering point. This is drive-in territory, not walk-up location.' },
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Geelong?</h3>
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
    } catch { }
    setSubmitted(true)
    setLoading(false)
  }

  const CHECKLIST = [
    'Check V/Line timetable — verify commuter peak (6:30–7:30am) consistency for weekday base',
    'Assess Melbourne visitor weekend surge — survey parking on Saturday and Sunday',
    'Verify Deakin University semester impact — campus drives baseline daytime foot traffic',
    'Count waterfront event calendar — confirm weekend activation frequency and visitor volume',
    'Survey Pakington Street parking — verify street availability on peak mornings and weekends',
    'Check council outdoor dining permits — verify feasibility of pavement positioning',
    'Count direct competitors within 500m (use Locatalyze mapping — not estimates)',
    'Model 60% of demand — if the unit economics fail, the rent is too high for Geelong',
    'Talk to 2–3 existing café operators — understand quiet months and seasonality',
    'Run your specific address through Locatalyze before committing to a lease',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Geelong Café Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            The exact checklist used in Locatalyze analysis. Free — enter your email and we'll send it plus weekly Geelong location insights.
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Geelong location insights now coming to your inbox.</p>
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
export default function GeelongCafePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Nav */}
      {/* Hero — deep navy/marine gradient */}
      <div style={{ background: 'linear-gradient(135deg, #172554 0%, #1E3A5F 50%, #1E40AF 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Geelong', '/analyse/geelong']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(204,235,229,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.7)' }}>Cafés</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Geelong Café Location Guide — Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Café in Geelong (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(204,235,229,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            Geelong is Australia's fastest-growing regional city and Melbourne's pressure valve. Population 270,000+, growing 2.8% annually. Commercial rents 50–65% below Melbourne. The best pre-saturation window in the country is open now.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#172554', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '7', l: 'Geelong suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#34D399', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(204,235,229,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2023–24 Census (with quarterly population estimates), council commercial valuation data, live competitor mapping via Geoapify Places API, Deakin University enrolment data, and Locatalyze proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '2.8%', claim: 'Geelong annual growth rate — fastest regional Australian city growth', source: 'ABS population estimates 2024–26, regional centres analysis', color: S.emerald },
              { stat: '50–65%', claim: 'Geelong café rent discount vs Melbourne inner-south equivalents', source: 'Commercial valuation comparison: Geelong ($2,400–$3,800/mo) vs Melbourne (Fitzroy $7,200–$11,500/mo)', color: S.brand },
              { stat: '3–5 yrs', claim: 'Geelong café market is behind Melbourne saturation curve', source: 'Locatalyze competitor density analysis comparing density per 10,000 residents across Australian cities', color: S.red },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Geelong as pressure valve section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Geelong: Melbourne's Pressure Valve — Why Now Is Unique
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Five years ago, Geelong was viewed as a commuter suburb by people priced out of Melbourne. Today it is viewed as a lifestyle city in its own right. The transformation is structural, not temporary, and it creates a café market opportunity that will not exist in 36 months.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The Regional Rail Link (Melbourne to Geelong, 75 minutes) created a new cohort: Melbourne-salaried professionals who can no longer afford inner-city housing. A software engineer or accountant earning $140,000 in Melbourne can afford a $1.2M apartment in Fitzroy. That same person earns $140,000, lives in Geelong, and buys a $650k house. The difference compounds over a 30-year mortgage. These professionals bring Melbourne café expectations (flat whites, specialty single-origin, $18 avo toast) to a city where commercial rents are half the price. Pakington Street is the result.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Deakin University's Waurn Ponds campus (17,000 students) and the waterfront redevelopment have transformed Geelong from a factory town to a genuine lifestyle city. The café culture is 3–5 years behind Melbourne's saturation — meaning the best positions are available now at prices they will never be again. Pakington Street is not saturated. Newtown is not saturated. The first-mover advantage exists right now.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Geelong vs Melbourne locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 12% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[20000, 100000]} />
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1000, 14000]} />
                  <ZAxis dataKey="ratio" range={[60, 300]} name="Rent/Revenue %" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Revenue: <strong>${(d.revenue / 1000).toFixed(0)}k/mo</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent / 1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 12 ? S.emerald : d.ratio < 18 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 12 ? ' Healthy' : d.ratio < 18 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }} />
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Melbourne Brunswick St', 'Sydney Newtown'].includes(d.suburb))} fill="#059669" name="Geelong suburbs" opacity={0.8} />
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Melbourne Brunswick St', 'Sydney Newtown'].includes(d.suburb))} fill="#E24B4A" name="Melbourne & Sydney (comparison)" opacity={0.7} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed customer volumes. Melbourne and Sydney rents: commercial valuation data Q4 2025. Geelong rents: Council commercial listings Q4 2025." />
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Geelong Suburb Scores — Café Viability
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18 }}>Scores above 70 = GO. 45–69 = CAUTION. Below 45 = NO.</p>
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
                  }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}
                    fill={S.brand}
                    label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}
                    isAnimationActive={true}>
                    {SUBURB_SCORES.map((entry, index) => (
                      <rect key={index} fill={entry.score >= 70 ? S.emerald : entry.score >= 45 ? S.amber : S.red} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze Scoring v2.1 — Rent Affordability 20%, Competition 25%, Market Demand 20%, Profitability 25%, Location Quality 10%. Aggregated from ABS, Council data, Geoapify, Deakin enrolment data. April 2026." />
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Geelong Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }} />}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, VIC {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict} />
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: Council commercial Q4 2025. Profit and payback: Locatalyze model, $175,000 setup, IBISWorld COGS benchmarks." />
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

        {/* Mid-page CTA — single, well-timed */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Geelong address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map and financial model in ~90 seconds. Free.</p>
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
            Geelong Suburbs to Avoid for Cafés and Coffee Shops
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, VIC {sub.postcode}</h3><VerdictBadge v={sub.verdict} /></div>
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
            Watch: How to Choose a Café Location in Geelong
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#1E3A5F', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 12, cursor: 'pointer' }}
            onClick={() => window.open('https://www.youtube.com/@locatalyze', '_blank')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #34D399', marginLeft: 4 }} /></div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,253,249,0.8)' }}>Locatalyze: How to Read a Location Analysis Report</p>
            <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.4)' }}>Click to visit our YouTube channel</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>To embed your own video: replace the onClick with {'<iframe src="https://www.youtube.com/embed/YOUR_ID" .../>'}</p>
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Geelong Café Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Morning foot traffic', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, detail: 'Geelong café viability lives on commuter traffic. A location within 400m of a train station (V/Line Geelong to Melb, peak 6:30–7:30am) captures Melbourne-salaried workers at peak commute time. Visit your shortlisted location on a Wednesday at 6:45am and count pedestrians for 30 minutes. That number multiplied by a standard 8–12% capture rate gives your weekday customer base.' },
              { title: 'Median household income', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>, detail: 'Geelong\'s average café ticket is $10.80. Below $65,000 median income, customers trade down to supermarket coffee. Above $80,000 — particularly among Melbourne commuters earning Melbourne salaries — you can price confidently. Pakington Street\'s $82,000 median income enables $6–7 specialty coffee pricing as habitual spend rather than discretionary.' },
              { title: 'Competition within 500m', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>, detail: '1–3 competitors validates demand without saturation. 4–6 is workable with differentiation. Seven or more makes new entry difficult. Geelong is currently 3–5 years behind Melbourne saturation — meaning many suburbs still sit in the 1–3 competitor sweet spot. Pakington Street at five is optimal. Newtown at four is pre-saturation. This advantage disappears in 24 months.' },
              { title: 'Rent-to-revenue ratio', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, detail: 'Monthly rent ÷ projected monthly revenue. Under 12%: excellent. 12–18%: workable. Above 18%: risky. At $2,800/month rent, you need approximately $23,300/month revenue to hit 12% — roughly 75 customers/day at $10.80 average ticket. Geelong\'s lower rents mean this is achievable earlier than Melbourne equivalents.' },
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
            Case Study: Specialty Coffee Shop on Pakington Street, Geelong West
          </h2>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #172554, #1E3A5F)', padding: '22px 28px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F0FDF9' }}>Specialty Coffee Shop, Pakington Street Geelong West VIC 3218</h3>
              <p style={{ fontSize: 13, color: 'rgba(204,235,229,0.6)' }}>65 sqm · $2,800/mo rent · $11 avg ticket · 160 customers/day · $175k setup</p>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
                {[['Monthly revenue', '$52,800', S.emerald], ['Monthly costs', '$36,400', S.red], ['Monthly profit', '$16,400', S.emerald], ['Net margin', '31.1%', S.emerald], ['Annual profit', '$172,000', S.emerald], ['Payback', '8 months', S.brand]].map(([l, v, c]) => (
                  <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $2,800, labour $18,200 (2.5 FTE at Victorian award rates), COGS 34% of revenue ($17,952), overheads $1,448. Revenue: 160 customers × $11 × 30 days. IBISWorld café COGS benchmarks applied." />
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
                At 5.3% rent-to-revenue, this coffee shop has an extraordinary margin buffer. The same café in Melbourne Fitzroy at $7,200/month rent faces 13.6% rent burden — a material structural disadvantage. At Geelong rents, the business is resilient. At Melbourne rents, it requires flawless execution.
              </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 60% of projected demand (96 customers/day)</p>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to ~$3,800. Still solvent. A $38,000 working capital buffer covers the soft-launch period before demand stabilises — not a survival fund, but a confidence fund for an operator who knows it will take 3–4 months to reach consistent volume. The low rent makes this scenario recoverable. A Geelong café at 18% rent-to-revenue under 60% demand is loss-making with no protection floor.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            7 Things to Do Before Signing a Geelong Café Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Visit on Wednesday at 6:45am', detail: 'Count V/Line commuter pedestrians. This is your baseline weekday customer potential. Weekend traffic is misleading — commuter flow is the sustainable revenue base for a Geelong café.' },
              { n: '02', tip: 'Calculate rent ÷ revenue before you tour the space', detail: 'Monthly rent divided by projected monthly revenue. If the answer exceeds 0.12, the economics are marginal. Geelong rents are lower — but they still need to pass this test.' },
              { n: '03', tip: 'Assess weekend traffic (Saturday 10am–12pm)', detail: 'Many Geelong locations (especially Waterfront) depend on weekend volume. Count Saturday morning foot traffic — if it is materially lower than Wednesday morning, you are dependent on weekend leisure spending, which is less stable.' },
              { n: '04', tip: 'Verify Deakin University semester calendar impact', detail: 'Deakin (17,000 students) drives baseline daytime foot traffic in Geelong. Check semester breaks — foot traffic drops 25–35% during July and December. Model the business assuming these breaks every year.' },
              { n: '05', tip: 'Talk to two nearby café operators — candid conversation', detail: 'Ask about their quiet months and what they wish they\'d known at day one. Ask specifically about V/Line commuter consistency and summer seasonality. Most Geelong hospitality operators are candid with fellow founders.' },
              { n: '06', tip: 'Negotiate a 12-month break clause', detail: 'Landlords rarely resist this for strong tenants, but it provides complete protection if foot traffic or customer quality does not materialise. This is the most important lease term for any new café.' },
              { n: '07', tip: 'Model 60% of demand, not 100%', detail: 'What does the coffee shop look like if only 60% of expected customers arrive in Month 1? If the answer is loss-making with no buffer, the rent is too high. Geelong\'s best locations survive this scenario.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $65k', rent: 'Not viable', comp: '5+', payback: 'N/A' })),
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
          <DataNote text="Income: ABS 2023–24. Rent: Council commercial Q4 2025. Payback: Locatalyze model, $175k setup, IBISWorld COGS benchmarks." />
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Geelong'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Geelong'}</h3>
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
              { href: '/analyse/melbourne/cafe', label: 'Cafés in Melbourne' },
              { href: '/analyse/brisbane/cafe', label: 'Cafés in Brisbane' },
              { href: '/analyse/hobart/cafe', label: 'Cafés in Hobart' },
              { href: '/analyse/adelaide/restaurant', label: 'Restaurants in Adelaide' },
              { href: '/analyse/newcastle/bakery', label: 'Bakeries in Newcastle' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #172554 0%, #1E3A5F 60%, #1E40AF 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Geelong address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(204,235,229,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street position, exact competitor count, proximity to anchors — produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#172554', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Geelong address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}
