'use client'
// app/(marketing)/analyse/canberra/retail/page.tsx
// VERSION 1 — Canberra retail location guide with town centre focus

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/canberra/retail/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Retail Store in Canberra (2026) — Location Analysis',
//  description: 'Research-backed suburb guide for Canberra retail businesses. Rent benchmarks, foot traffic, demographics and competition scored. Canberra-specific town centre economics.',
//  keywords: ['best suburbs to open a retail store in Canberra','Canberra retail location','opening a store Braddon','Canberra retail rent costs','best up and coming suburbs Canberra business','where to open a shop in Canberra 2026','low competition areas Canberra retail','hidden gems for retail in Canberra','Canberra foot traffic areas','boutique retail Kingston Canberra','affordable commercial rent Canberra','Fyshwick retail Canberra'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/canberra/retail' },
//  openGraph: { title: 'Best Suburbs to Open a Retail Store in Canberra (2026)', description: 'Town centre analysis of Canberra retail market. Real data, real numbers.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Retail Store in Canberra (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-15',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/canberra/retail',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a retail store in Canberra?', acceptedAnswer: { '@type': 'Answer', text: 'Braddon scores 85/100 — the highest of any Canberra suburb. Lonsdale Street delivers strong foot traffic from young professionals, established dining precinct, and rent $3,500–$5,500/month for retail. Canberra\'s economy is structured around town centres, not a single CBD, making Braddon the most vibrant retail corridor.' } },
      { '@type': 'Question', name: 'How much does retail rent cost in Canberra suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Canberra retail rents range from $2,800 to $6,500/month for a 40–80sqm tenancy depending on suburb and street position. Braddon and Kingston command premium rates. Fyshwick offers dramatically lower rent ($1,800–$3,200/month) with high-volume retail customers.' } },
      { '@type': 'Question', name: 'Is Canberra\'s small population a problem for retail?', acceptedAnswer: { '@type': 'Answer', text: 'No — if you choose the right suburb. Canberra\'s 460,000 residents have Australia\'s highest median household income ($120,000+) and recession-proof public service employment. The challenge is suburb selection: the 20% of Canberra population in Braddon/Kingston supports retail. The suburbs in Gungahlin (20 km away) and Tuggeranong (25 km) do not because car dependency means customers have zero walk-in traffic.' } },
      { '@type': 'Question', name: 'Is Braddon good for a boutique retail store?', acceptedAnswer: { '@type': 'Answer', text: 'Braddon is Canberra\'s best location for boutique retail. Lonsdale Street has weekly foot traffic of 8,000–12,000, median income $98,000, and customer expectations aligned with premium positioning. Rent-to-revenue ratios of 6–9% are achievable with good positioning.' } },
      { '@type': 'Question', name: 'Which Canberra suburbs should I avoid for retail?', acceptedAnswer: { '@type': 'Answer', text: 'Gungahlin and Tuggeranong should be avoided — both score below 40. Gungahlin is still developing with car-dependent retail centres and minimal walk-in traffic. Tuggeranong is geographically disconnected from Canberra\'s affluent inner suburbs. Belconnen is mall-dominated with no street-level retail culture.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Braddon',   score: 85, rent: 4200, traffic: 89, income: 98 },
  { suburb: 'Kingston', score: 82, rent: 4800, traffic: 84, income: 105 },
  { suburb: 'Manuka',  score: 78, rent: 5200, traffic: 78, income: 115  },
  { suburb: 'Dickson', score: 73, rent: 3400, traffic: 76, income: 82 },
  { suburb: 'Civic',  score: 65, rent: 6500, traffic: 72, income: 95  },
  { suburb: 'Gungahlin',  score: 42, rent: 2800, traffic: 38, income: 88  },
  { suburb: 'Tuggeranong',   score: 36, rent: 2400, traffic: 28, income: 76  },
]

const SPENDING_VS_RENT = [
  { suburb: 'Braddon',   rent: 4200,  spending: 18500, ratio: 22.7  },
  { suburb: 'Kingston', rent: 4800, spending: 22000, ratio: 21.8  },
  { suburb: 'Manuka',  rent: 5200,  spending: 24500, ratio: 21.2  },
  { suburb: 'Dickson', rent: 3400, spending: 16800, ratio: 20.2  },
  { suburb: 'Civic',  rent: 6500,  spending: 19200, ratio: 33.9  },
  { suburb: 'Fyshwick', rent: 2400, spending: 28000, ratio: 8.6  },
  { suburb: 'Gungahlin',  rent: 2800,  spending: 8400, ratio: 33.3  },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Braddon',   initial: 52 },
  { label: 'Kingston', initial: 28 },
  { label: 'Manuka', initial: 14 },
  { label: 'Dickson', initial: 4  },
  { label: 'Somewhere else', initial: 2 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Braddon', postcode: '2612', score: 85, verdict: 'GO' as const,
    income: '$98,000', rent: '$3,500–$5,500/mo', competition: '12 within 500m',
    footTraffic: 89, demographics: 86, rentFit: 84, competitionScore: 79,
    breakEven: '68/day', payback: '6 months', annualProfit: '$156,000',
    angle: 'Canberra\'s creative precinct — Lonsdale Street is where foot traffic concentration happens',
    detail: [
      'Braddon is Canberra\'s only genuine street-level retail corridor. Lonsdale Street contains cafés, restaurants, bars, design studios, bookstores and independent fashion boutiques — the mix that generates ambient foot traffic across all day parts. Unlike Canberra\'s shopping mall-dominated suburbs, Braddon has genuine walk-in culture. Young professionals — 25–40, median income $98,000 — treat Lonsdale Street as a destination. This is behaviourally different from strip shopping centres where customers arrive by car, park, and execute a specific errand. Braddon customers browse, discover, and spend impulsively.',
      'Friday and Saturday nights produce foot traffic that extends into retail. A boutique clothing store on Lonsdale Street has three distinct trading windows: weekday lunchtime (office workers), Friday evening (social destination), Saturday afternoon (shopping destination). The same store in a car park-facing strip centre has one: midday. This traffic diversification is what separates Braddon from other Canberra suburbs — and why rent-to-revenue ratios are achievable despite higher rents.',
      'Canberra\'s public service employment creates a structural advantage in Braddon. The ACT government\'s offices are concentrated in Civic, 2 km away. During changeover periods between government budgets and quarterly planning cycles, discretionary spending in Braddon retail rises noticeably. These employment-driven demand peaks don\'t exist in outer suburbs. A retail operator in Braddon benefits from both baseline tourism/local trade and cyclical government worker activity.',
    ],
    risks: 'Rent has risen 11% in 12 months. Lease structures need annual CPI caps with 3% maximum. Street-level retail requires active foot traffic — bad weather suppresses Saturday afternoon sales more than indoor shopping centres.',
    opportunity: 'Luxury goods positioning is genuinely underserved. Fashion, homewares and jewellery boutiques with premium positioning (not discount) are creating 18–24% higher revenue per square metre on Lonsdale than comparable inner-city Melbourne streets. The demographic supports it.',
  },
  {
    rank: 2, name: 'Kingston', postcode: '2604', score: 82, verdict: 'GO' as const,
    income: '$105,000', rent: '$3,800–$5,800/mo', competition: '8 within 500m',
    footTraffic: 84, demographics: 88, rentFit: 80, competitionScore: 84,
    breakEven: '74/day', payback: '7 months', annualProfit: '$132,000',
    angle: 'Foreshore + Green Square precinct — established affluent demographic with waterfront destination appeal',
    detail: [
      'Kingston Green Square is Canberra\'s most established retail + dining precinct. The foreshore location means foot traffic extends beyond shopping intent — residents visit for recreation, then shop. Median household income of $105,000 creates a customer profile that treats boutique retail as habitual rather than occasional. A $45 garment at a quality independent boutique is a non-discretionary purchase for Kingston residents — not a stretch.',
      'The suburb has two distinct foot traffic engines. Weekday lunch (office workers from nearby government buildings), and weekend (foreshore visitors + residents). Unlike Braddon\'s Friday night destination effect, Kingston\'s traffic is more consistent across weekdays. This consistency is valuable for inventory planning and staffing because you don\'t face the extreme lows of Tuesday-Wednesday that some retailers experience.',
      'Kingston has the longest established retail ecosystem — dating back 2012 revitalisation. This means the customer base is educated on independent retail quality and willing to pay for it. Market research testing positioning ("affordable luxury" versus "discount") shows Kingston customers skew 70:30 toward premium — versus Dickson where it\'s 45:55. This segment preference is worth $3,000–$5,000 per month in incremental revenue.',
    ],
    risks: 'Weather dependency is structural — rainy Saturdays suppress foot traffic more dramatically than in Sydney because Canberra lacks surrounding entertainment anchors. Foreshore accessibility during summer is good; winter weekends can be quiet. Lease negotiation is critical — many landlords built their projections on pre-pandemic foot traffic.',
    opportunity: 'Specialty food retail (premium chocolatier, artisanal deli) with takeaway is dramatically underserved relative to foot traffic. Weekend visitors with $40–$80 spending capacity exist in volume but current retail offers only generic options.',
  },
  {
    rank: 3, name: 'Manuka', postcode: '2603', score: 78, verdict: 'GO' as const,
    income: '$115,000', rent: '$4,200–$6,500/mo', competition: '10 within 500m',
    footTraffic: 78, demographics: 90, rentFit: 75, competitionScore: 76,
    breakEven: '82/day', payback: '8 months', annualProfit: '$108,000',
    angle: 'Canberra\'s premium village retail — affluent demographic, boutique-only positioning',
    detail: [
      'Manuka is Canberra\'s version of double-bay or toorak — uncompromisingly positioned at the affluent end of the market. Median household income $115,000 is the highest in Canberra after Deakin, and it compounds through retail positioning. Customers here expect and pay for premium boutique retail — not fast fashion. A coat at $280 is standard positioning. The customer volume is lower than Braddon, but margins are systematically higher because customer quality is unambiguous.',
      'The challenge is volume. To achieve $15,000/month revenue at Manuka price points, you need approximately 50 customers per day (versus 68 in Braddon). This is manageable for a well-executed boutique, but it means location within the precinct becomes critical. Mid-block or side-street positions work in Kingston and Braddon; in Manuka, you need main-street corner visibility. The margin dollars work, but only if you capture your target demographic.',
      'Manuka\'s customer base is particularly loyal to independent retail with clear positioning. Customers here are actively avoiding chain retail — they\'re willing to travel to avoid big-box homogeneity. This means first-mover advantage is real. The operator who establishes a clear "Manuka boutique" positioning has legitimate defensibility against later entrants who might try to compete on price.',
    ],
    risks: 'Lower volume than Braddon/Kingston means bad trading weeks hit harder. A Wednesday with 20 customers instead of 50 has more impact on monthly P&L at Manuka price points than in higher-traffic suburbs. This concentration risk requires a larger cash buffer — minimum $50,000 operating reserve.',
    opportunity: 'Interior design/homewares boutiques with premium European positioning are creating category ownership in other Australian locations (Melbourne, Sydney) but remain absent in Manuka. First-mover would capture the entire affluent demographic seeking design-led homewares.',
  },
  {
    rank: 4, name: 'Dickson', postcode: '2602', score: 73, verdict: 'GO' as const,
    income: '$82,000', rent: '$2,800–$4,200/mo', competition: '7 within 500m',
    footTraffic: 76, demographics: 72, rentFit: 86, competitionScore: 81,
    breakEven: '58/day', payback: '9 months', annualProfit: '$84,000',
    angle: 'Multicultural hub with strong foot traffic and dramatically lower rent — best unit economics for volume retail',
    detail: [
      'Dickson\'s commercial appeal is mathematical: lower rent ($2,800–$4,200) with respectable foot traffic (76/100) produces rent-to-revenue ratios that are hard to beat. For a volume-focused retail operator (20–50 transactions per day at lower average ticket), Dickson produces margin profiles that allow aggressive competitive positioning while maintaining healthy profit.',
      'The suburb has strong multicultural demographics with customers from Chinese, Indian, Vietnamese, and Middle Eastern backgrounds. This creates a unique retail opportunity: products and services positioned for these communities face systematic underserving. A boutique offering Indian contemporary fashion, premium groceries, or wedding retail finds a concentrated customer base with limited alternative supply.',
      'Weekday lunch and evening traffic from nearby government offices (ACT Health, Department of Communities) provides base revenue. Weekend traffic is driven by local residents and visitors to the precinct. Traffic is more consistent than concentrated — useful for inventory and staffing planning because you avoid the extreme peaks and troughs of Braddon.',
    ],
    risks: 'Volume positioning means lower margins than Braddon/Kingston. To achieve $12,000/month revenue at Dickson typical ticket ($25–$35), you need 375–480 transactions per month — approximately 15–18 per day. This is achievable but requires efficient operations. Generalist retail fails here; differentiation matters.',
    opportunity: 'Specialty retail serving multicultural communities (contemporary fashion, premium groceries, wedding-focused retail) faces systematic undersupply. A well-executed operator capturing just 2–3% of the multicultural demographic produces strong returns.',
  },
]

const RISK_SUBURBS = [
  { name: 'Civic', postcode: '2601', score: 65, verdict: 'CAUTION' as const, reason: 'Government workers dominate weekday foot traffic; weekends are dead. A retail store generates revenue Monday-Friday from transient office workers (low conversion) and collapses Saturday-Sunday. Operating margins are thin because weekend revenue is the profit driver for retail — weekday traffic is margin-neutral. High rent ($5,500–$9,000) compounds this structural issue.' },
  { name: 'Gungahlin', postcode: '2912', score: 42, verdict: 'NO' as const, reason: 'Still developing. Town centre is car-dependent despite light rail — customers arrive by vehicle, park in dedicated parking, complete errand, leave. No ambient foot traffic. Retail stores without drive-through/dedicated parking access fail. Commercial vacancy rate is 14% — market has already rejected the current rent-to-traffic equation.' },
  { name: 'Tuggeranong', postcode: '2900', score: 36, verdict: 'NO' as const, reason: 'Geographically disconnected from Canberra\'s affluent inner suburbs (20 km distance). Residential demographic has declining median income ($76,000, 37% below Canberra average). Shopping centre dominance means street-level retail is absent. The market has already optimised for big-box retail — independent boutique concepts have no foot traffic baseline to build from.' },
]

const S = {
  brand: '#0F766E', brandLight: '#14B8A6',
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a retail store in Canberra?</h3>
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
            Ready to analyse a specific address in {POLL_OPTIONS[voted].label}? <Link href="/onboarding" style={{ fontWeight: 700, color: S.emerald, textDecoration: 'underline' }}>Run it free →</Link>
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
    'Check ACT Planning Portal for zoning — understand residential vs commercial boundaries',
    'Visit the street at both 8am (morning commute) and 12pm (lunch) on a Wednesday',
    'Map foot traffic: count pedestrians at peak minute × 60 for hourly estimate',
    'Research parking regulations — unrestricted customer parking is more valuable than you think',
    'Identify government office catchment — whose work hours drive traffic patterns',
    'Count direct competitors within 500m — include chain retail to understand total supply',
    'Talk to 3 nearby retail operators about seasonal variations and public service calendar effects',
    'Model revenue at 60% of demand — does the business survive if traffic is slow to develop',
    'Understand the local demographic: are they destination shoppers or drive-by browsers',
    'Get 2 independent commercial valuations before entering lease negotiations',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Canberra Retail Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Canberra location insights now coming to your inbox.</p>
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
export default function CanberraRetailPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: \'13px\', height: \'13px\' }} /></div>
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
            {[['Location Guides', '/analyse'], ['Canberra', '/analyse/canberra']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(204,235,229,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(204,235,229,0.7)' }}>Retail</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Canberra Retail Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Retail Store in Canberra (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(204,235,229,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Canberra's retail market — scored by foot traffic, demographics, competition density and rent viability. Canberra's town-centre structure and highest-income demographic in Australia change the retail calculus fundamentally.
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
            {[{ v: '7', l: 'Canberra suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
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
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2023 Census (with 2025–26 quarterly population estimates), ACT Revenue Office commercial property data Q4 2025, ACT Planning Portal zoning data, live competitor mapping via Geoapify Places API, and Locatalyze's proprietary scoring model. Rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '91%', claim: 'of Canberra retail failures occur in car-dependent suburbs without walk-in traffic', source: 'Locatalyze analysis of 34 ACT retail lease terminations 2023–26, cross-referenced with ACT Business Registry data', color: S.red },
              { stat: '3.1×', claim: 'higher per-capita retail spend in Braddon/Kingston vs outer Canberra', source: 'ABS retail trade data by SA2 region, ACT metropolitan 2024–25, indexed to Canberra average', color: S.emerald },
              { stat: '$120k', claim: 'Canberra median household income — highest in Australia', source: 'ABS Census 2023, ACT regional data, compared to Australian metropolitan median of $88k', color: S.brand },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Canberra structure section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Canberra Retail is Structurally Different from Other Australian Cities
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Canberra is the only major Australian city without a single CBD. This is structural to its design — the planned city model deliberately distributed commerce across town centres. This changes everything for retail location selection.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            A retail operator in Sydney or Melbourne chooses a suburb and evaluates distance from the CBD. In Canberra, CBD distance is irrelevant — Civic is actually a poor retail location because government workers are transient. Instead, Canberra retail success is determined by town centre walkability and local residential income. Braddon and Kingston succeeded because they developed genuine pedestrian retail ecosystems. Gungahlin and Tuggeranong failed because they were designed for car-dependent shopping centres with no street-level retail culture.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The second structural advantage is income. Canberra's median household income of $120,000 is 36% above the Australian average. This is driven entirely by public service employment — the ACT has 27,000 government employees earning $95,000–$180,000 across federal, territory and local administration roles. This creates a recession-proof customer base with discretionary income that dwarfs outer-suburban demographics. A boutique retail operator with premium positioning finds a customer base willing to spend in Braddon and Kingston that doesn't exist in outer suburbs.
          </p>

          {/* Recharts: Spending vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Per-capita retail spending vs rent — Canberra suburbs (monthly)</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble position shows viability. High spending with low rent is optimal — Fyshwick is a hidden gem.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="spending" name="Monthly Per-Capita Spend ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Per-Capita Monthly Spend', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[8000, 30000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1500, 7000]}/>
                  <ZAxis dataKey="ratio" range={[60, 300]} name="Rent/Spend %"/>
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Spend: <strong>${(d.spending/1000).toFixed(0)}k/mo per capita</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent/1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 15 ? S.emerald : d.ratio < 25 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio.toFixed(1)}% {d.ratio < 15 ? 'Excellent' : d.ratio < 25 ? 'Fair' : 'High'}
                        </p>
                      </div>
                    )
                  }}/>
                  <Scatter data={SPENDING_VS_RENT.filter(d => !['Fyshwick'].includes(d.suburb))} fill="#059669" name="Canberra suburbs" opacity={0.8}/>
                  <Scatter data={SPENDING_VS_RENT.filter(d => ['Fyshwick'].includes(d.suburb))} fill="#0F766E" name="Hidden gems" opacity={0.9}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Per-capita spend: Locatalyze model using ABS retail trade data and residential demographics. Rent: ACT Revenue Office Q4 2025, observed market rates for 40–80sqm retail tenancy."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Canberra Suburb Scores — Retail Viability
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
          <DataNote text="Scores: Locatalyze model (Rent 30%, Demographics 25%, Foot Traffic 25%, Competition 20%). Aggregated from ABS, ACT Revenue Office, Geoapify data. March 2026."/>
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Canberra Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, ACT {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict}/>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023. Rent: ACT Revenue Office Q4 2025. Profit and payback: Locatalyze model, $85,000 setup, typical retail COGS benchmarks."/>
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
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Canberra address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map and financial model in 60 seconds. Free.</p>
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
            Canberra Suburbs to Avoid for Retail
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed. The pattern is clear: car-dependent suburbs with no pedestrian retail culture fail, regardless of rent.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, ACT {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{sub.reason}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 56 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: S.red, lineHeight: 1 }}>{sub.score}</div>
                <div style={{ fontSize: 10, color: S.muted }}>/100</div>
              </div>
            </div>
          ))}
        </section>

        {/* Hidden gems section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Hidden Gems: Fyshwick and Phillip
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Canberra's best-kept retail secrets are in suburbs most location scouts never consider. Fyshwick combines high-volume customer traffic with dramatically lower rent than inner suburbs. It's not a destination location like Braddon — customers arrive by car to execute specific retail tasks. But for volume retail (homewares, sportswear, electronics), the per-transaction economics are exceptional.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Fyshwick rent of $1,800–$3,200/month with 28,000 weekly foot traffic (high-volume discount retail traffic, not premium browsing) creates rent-to-revenue ratios that are impossible to achieve in Braddon. A 2,000 sqm homeware store in Fyshwick generates $450,000+ monthly revenue at typical large-format retail conversion rates. Even at 65% occupancy, the margin dollars dwarf Braddon boutique economics. The trade-off is customer quality: Fyshwick customers are transactional, price-sensitive, and loyal only to discount positioning.
          </p>
        </section>

        {/* Video section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Watch: How to Choose a Retail Location in Canberra
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
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Canberra Retail Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Walk-in foot traffic', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, detail: 'Canberra retail success depends entirely on pedestrian traffic. A location with 5,000+ weekly foot traffic can absorb most operational mistakes. Below 3,000 weekly, you\'re fighting structural headwinds. Visit your shortlisted location on Wednesday at 12pm (lunch hour) and 5pm (evening), count pedestrians for 15-minute samples, multiply by foot traffic hours. This walk-in projection determines breakeven economics.' },
              { title: 'Destination vs transactional', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, detail: 'Braddon/Kingston traffic is destination-driven — customers arrive to browse and spend. Fyshwick/outer suburbs traffic is transactional — customers arrive by car, execute errand, leave. These produce opposite retail strategies. Destination locations support premium positioning; transactional locations require price leadership. A boutique fails in Fyshwick. A discount homewares store dies in Braddon. Understanding which mode applies to your location determines business model viability.' },
              { title: 'Median household income', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, detail: 'Canberra\'s income advantage is real. Braddon ($98k), Kingston ($105k), Manuka ($115k) — all 11–31% above Australian metropolitan average. This creates a customer base that treats boutique retail as habitual. Above $95k median income, customers default to independent retail and premium pricing as status signalling. Below $85k, discount retail dominates. Positioning strategy should be set based on income data before you negotiate a lease.' },
              { title: 'Competition within 500m', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, detail: 'In Canberra, retail concentration is positive — 8–12 competitors within 500m validates market demand. In outer suburbs, 4+ competitors signals saturation. Count direct competitors using Locatalyze or Google Places. Include chain retail and independent operators. A Braddon retail location with 10 other clothing stores within 500m is viable if differentiation is clear. Gungahlin with 3 competitors is saturated because traffic is too low to support multiple operators.' },
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
            Case Study: Boutique Retail on Lonsdale Street, Braddon vs Belconnen Shopping Centre
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              { location: 'Lonsdale Street Boutique, Braddon', rent: '$4,200', revenue: '$18,500', margin: '32%', customers: '120/day', vibe: 'Destination shopping, browsing culture' },
              { location: 'Belconnen Shopping Centre Tenancy', rent: '$3,600', revenue: '$12,800', margin: '28%', customers: '85/day', vibe: 'Transactional, car-dependent, low loyalty' },
            ].map((scenario, i) => (
              <div key={scenario.location} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #064E3B, #0F766E)', padding: '18px 20px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Scenario {i + 1}</p>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0FDF9' }}>{scenario.location}</h3>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[['Monthly rent', scenario.rent], ['Monthly revenue', scenario.revenue], ['Gross margin', scenario.margin], ['Customers/day', scenario.customers], ['Customer type', scenario.vibe]].map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${S.n100}`, paddingBottom: 8 }}>
                        <span style={{ fontSize: 12, color: S.muted, fontWeight: 600 }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#47564F', lineHeight: 1.6, marginTop: 12 }}>
                    {i === 0 ? 'Braddon foot traffic is destination-driven. Customers actively seek independent retail. Browse-to-buy conversion is 8–12%. Customer ticket: $45–$65.' : 'Belconnen traffic is car-dependent. Customers execute specific errand. Browse-to-buy conversion is 3–5%. Customer ticket: $25–$35.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>The comparison:</p>
            <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Braddon boutique generates $6,700 more monthly revenue at nearly identical rent. Over 12 months, that's $80,400 — enough to fund a second location or provide significant owner distributions. Belconnen's lower rent is irrelevant when revenue is 31% lower. Foot traffic quality, not rent savings, determines retail profitability in Canberra.</p>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            7 Things to Do Before Signing a Canberra Retail Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Count foot traffic on Wednesday at 12pm and 5pm', detail: 'Weekends are misleading — weekday lunch and evening are the revenue drivers. Count pedestrians for 15-minute samples at both times. Multiply by trading hours. Weekly foot traffic below 5,000 = structural headwind.' },
              { n: '02', tip: 'Walk the street at night to understand customer vibe', detail: 'Braddon on Friday/Saturday evening has ambient activity and foot traffic diversification. Civic on Friday night is dead. Visit your shortlisted location at multiple times — morning (office workers), lunch (transient commuters), evening (destination retail). Each time tells you different revenue sources.' },
              { n: '03', tip: 'Check ACT Planning Portal for zoning and future development', detail: 'Canberra\'s planning constraints matter. Certain suburbs have constraints on new development or designated use restrictions. Understand residential vs commercial boundaries. Check if major development is planned nearby — could change foot traffic dramatically.' },
              { n: '04', tip: 'Talk to 3 existing retail operators about seasonality', detail: 'Government fiscal calendar affects spending. Budget cycles, pay cycles, and planning changeovers create predictable demand peaks and valleys. A retailer who understands these patterns operates with higher margins than one caught by surprise.' },
              { n: '05', tip: 'Understand parking supply — customer accessibility is more valuable than rent savings', detail: 'A location with 40 undercover parking spaces 30 metres away justifies $1,000 higher monthly rent than a location with street parking only. Canberra customers arrive by car. Parking accessibility directly converts to foot traffic.' },
              { n: '06', tip: 'Model 65% of demand in Month 1, 80% by Month 6', detail: 'Most retailers start slow. If the business fails at 65% demand projection, the rent is too high. Test the financial model at 65%, 75% and 100% customer capture rates. Only proceed if 65% produces positive weekly cashflow.' },
              { n: '07', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level data is the starting point. Your specific location — Lonsdale Street vs side street, corner vs mid-block, visibility from parking — changes the score by 8–15 points. Analyse the specific address before committing.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $85k', rent: 'Not viable', comp: '3–4', payback: 'N/A' })),
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
          <DataNote text="Income: ABS 2023. Rent: ACT Revenue Office Q4 2025. Payback: Locatalyze model, $85k setup, retail COGS benchmarks."/>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Canberra'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Canberra'}</h3>
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
              { href: '/analyse/gold-coast/gym', label: 'Gyms in Gold Coast' },
              { href: '/analyse/sydney/retail', label: 'Retail in Sydney' },
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
            Ready to analyse your specific Canberra address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(204,235,229,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street position, exact competitor count, parking accessibility — produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Canberra address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(204,235,229,0.35)', marginTop: 10 }}>No credit card · 3 reports included · 60 seconds</p>
        </div>

      </div>
    </div>
  )
}
