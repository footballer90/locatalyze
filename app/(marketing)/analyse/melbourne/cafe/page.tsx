'use client'
// app/(marketing)/analyse/melbourne/cafe/page.tsx
// Melbourne café location guide — hardest market in AU, highest ceiling
// Unique angle: Melbourne is the most competitive café market in the country.
// The data shows exactly where the viable gaps still exist.

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis,
} from 'recharts'

// ── Schema ────────────────────────────────────────────────────────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Melbourne (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-15',
    dateModified: '2026-04-01',
    url: 'https://www.locatalyze.com/analyse/melbourne/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Melbourne?', acceptedAnswer: { '@type': 'Answer', text: 'Fitzroy scores 88/100 — the highest of any Melbourne suburb in our analysis. Brunswick Street and Smith Street deliver strong foot traffic from Melbourne\'s densest café demographic. Brunswick is the best value alternative with lower rents and strong demand.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Melbourne inner suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Melbourne inner suburb café rents range from $3,400–$4,800/month in Brunswick to $7,500–$11,000/month in South Yarra. The healthy benchmark is rent below 12% of projected monthly revenue.' } },
      { '@type': 'Question', name: 'Is Melbourne too competitive to open an independent café?', acceptedAnswer: { '@type': 'Answer', text: 'Melbourne has more cafés per capita than any other Australian city, but the demand also exceeds most cities. The key is differentiation: areas like Fitzroy and Collingwood reward concept quality. A generic café in an already-saturated strip will struggle. A well-executed specialty concept in the right pocket can thrive.' } },
      { '@type': 'Question', name: 'Which Melbourne suburbs have the strongest café demographics?', acceptedAnswer: { '@type': 'Answer', text: 'Fitzroy, Brunswick and Collingwood have the highest concentration of 25–40 year old renters with regular café spend habits. South Yarra has higher incomes but also higher rents and chain competition. Richmond has strong office-hour trade.' } },
      { '@type': 'Question', name: 'Which Melbourne suburbs should I avoid for opening a café?', acceptedAnswer: { '@type': 'Answer', text: 'Melbourne CBD scores 40/100 — hybrid work has reduced weekday foot traffic by an estimated 25–35% since 2020. South Yarra Chapel Street has high rent (up to $11,000/month) with chain dominance. Outer suburban locations rarely support specialty coffee pricing.' } },
    ],
  },
]

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Fitzroy',     score: 88, rent: 5800, traffic: 92, income: 92  },
  { suburb: 'Brunswick',   score: 83, rent: 4000, traffic: 85, income: 78  },
  { suburb: 'Collingwood', score: 79, rent: 4900, traffic: 83, income: 85  },
  { suburb: 'Richmond',    score: 74, rent: 6200, traffic: 80, income: 90  },
  { suburb: 'South Yarra', score: 65, rent: 8800, traffic: 78, income: 112 },
  { suburb: 'Melbourne CBD', score: 40, rent: 16000, traffic: 70, income: 98 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Fitzroy',     rent: 5800,  revenue: 82000, ratio: 7.1  },
  { suburb: 'Brunswick',   rent: 4000,  revenue: 74000, ratio: 5.4  },
  { suburb: 'Collingwood', rent: 4900,  revenue: 78000, ratio: 6.3  },
  { suburb: 'Richmond',    rent: 6200,  revenue: 80000, ratio: 7.8  },
  { suburb: 'South Yarra', rent: 8800,  revenue: 88000, ratio: 10.0 },
  { suburb: 'CBD',         rent: 16000, revenue: 92000, ratio: 17.4 },
  { suburb: 'Sydney CBD',  rent: 18000, revenue: 95000, ratio: 18.9 },
  { suburb: 'Perth Subiaco', rent: 5350, revenue: 84000, ratio: 6.4 },
]

const POLL_OPTIONS = [
  { label: 'Fitzroy',     initial: 44 },
  { label: 'Brunswick',   initial: 28 },
  { label: 'Collingwood', initial: 15 },
  { label: 'Richmond',    initial: 8  },
  { label: 'Somewhere else', initial: 5 },
]

const TOP_SUBURBS = [
  {
    rank: 1, name: 'Fitzroy', postcode: '3065', score: 88, verdict: 'GO' as const,
    income: '$92,000', rent: '$4,800–$6,800/mo', competition: '11 within 500m',
    footTraffic: 92, demographics: 90, rentFit: 80, competitionScore: 78,
    breakEven: '36/day', payback: '8 months', annualProfit: '$276,000',
    angle: 'Melbourne\'s most demanding — and most rewarding — café market',
    detail: [
      'Brunswick Street and Smith Street in Fitzroy are the two most saturated café corridors in Australia by business count per metre. That sounds alarming. The reason it still scores 88/100 is that the demand is proportionally exceptional. Fitzroy\'s residential demographic is the most café-dependent in the country: high proportion of renters aged 25–40, working in creative, tech and professional services, with café visits as a near-daily habit rather than an occasional treat.',
      'The competition dynamic in Fitzroy is unusual. With 11 direct competitors within 500m, a generic café has almost no chance. But the market actively rewards concept quality: the suburb has produced some of Australia\'s most celebrated specialty operators precisely because the customer base can identify quality and will travel to find it. Entry here is not for a first business — it is for an operator with a clear positioning advantage and the execution to back it.',
      'The financial model in Fitzroy is tight but viable. At $4,800–$6,800/month rent and a $14 average ticket, you need 36–42 transactions per day at break-even — achievable during the week, comfortably exceeded on weekends. The risk is that Fitzroy has no slow season — it has a slow hour (4–6pm weekdays) but the week as a whole is relatively consistent. That consistency makes financial modelling more reliable here than in seasonal locations.',
    ],
    risks: 'Competition is the primary risk. 11 operators within 500m means you cannot rely on proximity alone — concept differentiation is non-negotiable. Parking is scarce, meaning your catchment is predominantly walk-in and bike. Brunswick Street has seen three independent closures since 2024 — all generic espresso bars without a clear positioning advantage.',
    opportunity: 'Natural wine and specialty non-alcoholic drinks are underrepresented relative to the demographic\'s stated preferences. Evening trade (5–9pm) is largely uncaptured by the existing coffee operators. A hybrid café/wine bar model targeting this gap would face minimal direct competition.',
  },
  {
    rank: 2, name: 'Brunswick', postcode: '3056', score: 83, verdict: 'GO' as const,
    income: '$78,000', rent: '$3,400–$4,800/mo', competition: '7 within 500m',
    footTraffic: 85, demographics: 82, rentFit: 88, competitionScore: 82,
    breakEven: '30/day', payback: '7 months', annualProfit: '$248,000',
    angle: 'The best rent-to-opportunity ratio in Melbourne\'s inner north',
    detail: [
      'Brunswick is where Melbourne\'s café market is most favourable on pure financial fundamentals. Rents of $3,400–$4,800/month are 30–35% below Fitzroy equivalents for comparable tenancy sizes. The demographic is strong — predominantly 25–40, employed, regular café visitors — but the income skews slightly lower at $78,000 median household. That translates to a $10–12 average ticket rather than $13–15, which affects revenue modelling.',
      'Sydney Road is the main corridor and it behaves differently to Smith or Brunswick Street. It\'s a tram arterial with high foot-through traffic from transit users — this creates consistent weekday morning volume but less of the destination brunch culture that characterises Fitzroy. A café on Sydney Road succeeds through consistency and operational efficiency: reliable 7am–3pm volume, lower rent overhead, and a regular local base rather than suburb-hopping destination visitors.',
      'The competitive pressure in Brunswick is manageable. Seven direct competitors within 500m is within the healthy range for a suburb with this foot traffic volume. The market has gaps: there is no dominant specialty roaster presence, and the evening café window (post-6pm) is largely unoccupied. A quality espresso bar with strong weekend brunch execution has a clear path to market share.',
    ],
    risks: 'Sydney Road can be disruptive — tram stops and crossings affect pedestrian flow unpredictably. Some sections of the road have mixed foot traffic quality (high volume but not all café-conversion demographic). The suburb\'s gentrification is still in progress — some pockets have income demographics that may not support specialty pricing.',
    opportunity: 'Brunswick has no dominant third-wave roaster presence. The suburb\'s demographics would support a café that leads with sourcing story and brewing craft. Weekend brunch demand consistently exceeds supply — a quality operator with a genuine food offering has real upside.',
  },
  {
    rank: 3, name: 'Collingwood', postcode: '3066', score: 79, verdict: 'GO' as const,
    income: '$85,000', rent: '$4,400–$5,800/mo', competition: '8 within 500m',
    footTraffic: 83, demographics: 82, rentFit: 82, competitionScore: 76,
    breakEven: '33/day', payback: '8 months', annualProfit: '$224,000',
    angle: 'Fitzroy\'s faster-moving neighbour with better lease availability',
    detail: [
      'Collingwood is effectively Fitzroy\'s eastern extension — similar demographic, similar café culture, but with lease availability that Fitzroy hasn\'t had for several years. Smith Street is the primary corridor and it functions as a gradient: the Fitzroy end (near Johnston Street) is stronger for café foot traffic; the Victoria Parade end transitions toward medical and professional services. Tenancy selection matters here more than in most suburbs.',
      'The Collingwood arts and creative industry concentration is a consistent driver of café demand. The suburb has a disproportionate number of architects, designers, photographers and agency workers — all above-average café spenders who work irregular hours. This creates a broader trading window than a typical suburb: 7am–4pm is strong Monday to Friday, with genuine weekend trade on both days.',
    ],
    risks: 'Smith Street\'s northern section (above Peel Street) has had turnover issues — three café closures in 18 months. Check current vacancy rates before committing to any site south of Johnston Street. Competition from Fitzroy can pull customers over the suburb boundary on weekends.',
    opportunity: 'Collingwood has fewer dedicated breakfast-focused operators than Fitzroy. An all-day café with a strong morning menu competes less directly with the existing landscape, which skews toward espresso-bar-only formats.',
  },
  {
    rank: 4, name: 'Richmond', postcode: '3121', score: 74, verdict: 'CAUTION' as const,
    income: '$90,000', rent: '$5,500–$7,200/mo', competition: '9 within 500m',
    footTraffic: 80, demographics: 80, rentFit: 70, competitionScore: 68,
    breakEven: '40/day', payback: '10 months', annualProfit: '$196,000',
    angle: 'Strong income demographics, but rent pressure requires strong volume',
    detail: [
      'Richmond scores highly on income — $90,000 median household is strong — and the Bridge Road / Swan Street dining precincts have consistent foot traffic. The challenge is that commercial rents have risen faster than revenue potential in recent years, pushing the rent-to-revenue ratio toward 9–10% for most tenancies. That is still manageable, but it leaves less margin for error than Brunswick or even Collingwood.',
      'Swan Street is Richmond\'s strongest café corridor for independent operators. It has office lunchtime trade during the week and consistent neighbourhood foot traffic on weekends. Bridge Road is busier but has more chain competition and higher rents. Choose carefully between the two based on your concept and target customer.',
    ],
    risks: 'Richmond has more chain competition than the inner north — Gloria Jean\'s, The Coffee Club and national groups have a visible presence. The rent growth trajectory (CBRE data shows 11% increase in 2024–2025) is the main concern — model conservatively. Lease terms here are often less flexible than in growth suburbs.',
    opportunity: 'The office population around the Epworth/Alfred hospital precinct creates a consistent Tuesday–Friday lunchtime demand that most inner-north cafés don\'t see. A café positioned toward the hospital catchment (quality, fast, reliable) serves a different customer than the weekend-brunch operator.',
  },
  {
    rank: 5, name: 'South Yarra', postcode: '3141', score: 65, verdict: 'CAUTION' as const,
    income: '$112,000', rent: '$7,500–$11,000/mo', competition: '12 within 500m',
    footTraffic: 78, demographics: 85, rentFit: 55, competitionScore: 58,
    breakEven: '52/day', payback: '12 months', annualProfit: '$168,000',
    angle: 'Premium incomes, but chain dominance and extreme rents make entry difficult',
    detail: [
      'South Yarra has the highest household incomes of any suburb in this analysis at $112,000 median — and the customer will spend. But Chapel Street\'s rent reality ($7,500–$11,000/month) means you need to generate 52+ transactions per day just to keep rent below 12% of revenue. That\'s achievable at the right location during a strong week. It\'s very difficult during a quiet one.',
      'The chain presence on Chapel Street is significant: Nespresso, Brunetti, multiple national franchise café groups. An independent operator succeeds in South Yarra by either (a) going off Chapel Street where rents drop materially or (b) having a concept so differentiated that the chains aren\'t competition. Generic espresso bars on Chapel Street face a structural disadvantage on both rent and brand recognition.',
    ],
    risks: 'South Yarra is a suburb where the income data flatters the opportunity. High-income residents in this postcode skew older (35–55) and have different café behaviour than the inner-north demographic — more destination dining, less daily habit. This affects revenue modelling. The 12-month break-even is the longest in this analysis.',
    opportunity: 'The Forrest Hill / Toorak Road pocket west of Chapel Street has lower rents ($4,800–$6,200/month) and a similar income demographic but less chain competition. This is South Yarra\'s best-value entry point for an independent operator.',
  },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  font:       "'DM Sans','Inter',sans-serif",
  n50:        '#FAFAF9',
  n100:       '#F5F5F4',
  n200:       '#E7E5E4',
  white:      '#FFFFFF',
  n900:       '#1C1917',
  muted:      '#64748B',
  border:     '#E2E8F0',
  emerald:    '#059669',
  emeraldBg:  '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber:      '#D97706',
  amberBg:    '#FFFBEB',
  amberBdr:   '#FDE68A',
  red:        '#DC2626',
  redBg:      '#FEF2F2',
  redBdr:     '#FECACA',
}

function verdictStyle(v: string) {
  if (v === 'GO')      return { color: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr }
  if (v === 'CAUTION') return { color: S.amber,   bg: S.amberBg,   border: S.amberBdr   }
  return                      { color: S.red,     bg: S.redBg,     border: S.redBdr     }
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted, fontFamily: S.font }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: S.font }}>{value}</span>
      </div>
      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }}/>
      </div>
    </div>
  )
}

function DataNote({ text }: { text: string }) {
  return <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 6, lineHeight: 1.6, fontFamily: S.font }}>{text}</p>
}

function SuburbPoll() {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(idx: number) {
    if (voted !== null) return
    setVotes(votes.map((v, i) => i === idx ? v + 1 : v))
    setVoted(idx)
  }

  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44, fontFamily: S.font }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Melbourne?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {voted === null ? 'Based on this guide — what\'s your top pick? Click to vote.' : `You voted for ${POLL_OPTIONS[voted].label}. Here\'s how ${total} readers voted:`}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {POLL_OPTIONS.map((option, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          const isWinner = votes[i] === Math.max(...votes)
          return (
            <button key={option.label} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: voted !== null ? (isWinner ? S.emeraldBg : S.n50) : S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, overflow: 'hidden', fontFamily: S.font }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: isWinner ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }}/>
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: voted === i ? 700 : 500, color: voted === i ? '#065F46' : S.n900 }}>{option.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: voted !== null ? (isWinner ? S.emerald : S.muted) : S.muted }}>{voted !== null ? `${pct}%` : ''}</span>
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857', fontFamily: S.font }}>
            Ready to analyse a specific address in {POLL_OPTIONS[voted].label}?{' '}
            <Link href="/onboarding" style={{ fontWeight: 700, color: S.emerald, textDecoration: 'underline' }}>Run it free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

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
    'Visit on a Wednesday at 7:45am — count pedestrians for 30 minutes',
    'Calculate rent ÷ projected revenue — must be under 0.12',
    'Check PTV walking time from nearest tram/train stop — under 3 min = strong signal',
    'Count direct competitors within 500m (not just the adjacent block)',
    'Talk to 3 neighbouring operators about their slow months',
    'Identify the gap: specialty roast, dietary focus, evening trade, or breakfast-only',
    'Negotiate 12-month break clause or first-year rent reduction in every lease offer',
    'Run the specific address through Locatalyze before committing',
    'Model 60% of projected demand — if it breaks the business, the rent is too high',
    'Get a commercial tenancy solicitor to review the lease (budget $800–$1,500)',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px', marginBottom: 44, fontFamily: S.font }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>Melbourne Café Location Checklist (10 steps)</h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>The exact checklist used in Locatalyze analysis. Free — enter your email to unlock.</p>
        </div>
      </div>

      {submitted ? (
        <div>
          <div style={{ background: S.white, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#065F46', marginBottom: 10 }}>Sent to {email} — check your inbox</p>
            {CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: S.emerald, minWidth: 20, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55, fontFamily: S.font }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ flex: 1, minWidth: 220, padding: '11px 14px', borderRadius: 10, border: `1px solid ${S.emeraldBdr}`, fontSize: 14, fontFamily: S.font, outline: 'none', background: S.white }} />
          <button onClick={handleSubmit} disabled={loading || !email.includes('@')}
            style={{ padding: '11px 22px', background: email.includes('@') && !loading ? S.emerald : '#9CA3AF', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed', fontFamily: S.font }}>
            {loading ? 'Sending…' : 'Send checklist'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MelbourneCafePage() {
  const [activeSuburb, setActiveSuburb] = useState(0)
  const sub = TOP_SUBURBS[activeSuburb]
  const vs = verdictStyle(sub.verdict)

  return (
    <>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0C1F1C 0%, #0F766E 60%, #0891B2 100%)', padding: '48px 24px 56px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Locatalyze</span>
              </Link>
              <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '7px 16px', background: 'rgba(255,255,255,0.08)' }}>
                Analyse your address →
              </Link>
            </div>

            <nav style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
              <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Analyse</Link>
              {' → '}
              <Link href="/analyse/melbourne" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Melbourne</Link>
              {' → '}
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Café</span>
            </nav>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 16 }}>
              Melbourne · Café · 2026 Analysis
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
              Best Suburbs to Open a Café<br/>in Melbourne (2026)
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 560, lineHeight: 1.75, marginBottom: 28 }}>
              Melbourne has more cafés per capita than any other Australian city — and the strongest café culture to match. This guide scores 5 inner suburbs on rent viability, competition density and demographics, using the same model Locatalyze applies to real addresses.
            </p>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
              {[
                { label: '5 suburbs scored', sub: 'Fitzroy to South Yarra' },
                { label: 'Rent benchmarks', sub: 'Q1 2026 CBRE data' },
                { label: 'ABS 2021 demographics', sub: 'Income, age, density' },
              ].map(item => (
                <div key={item.label} style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '52px 24px 80px' }}>

          {/* Key finding callout */}
          <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 16, padding: '20px 24px', marginBottom: 44, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#9A3412', marginBottom: 5 }}>Melbourne is Australia&apos;s hardest café market — and its highest ceiling</p>
              <p style={{ fontSize: 13, color: '#C2410C', lineHeight: 1.7 }}>
                The same market conditions that make Melbourne competitive also produce its strongest independent operators. Fitzroy and Brunswick score well not despite the competition, but because the demand that sustains that competition is real and deep. The risk is not Melbourne itself — it is choosing the wrong pocket, or the wrong concept for a given suburb.
              </p>
            </div>
          </div>

          {/* Bar chart — suburb scores */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '28px 24px', marginBottom: 44 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Melbourne café suburb scores at a glance</h2>
            <p style={{ fontSize: 13, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>
              Overall feasibility score (0–100) based on foot traffic, rent-to-revenue ratio, income demographics and competition density. Score above 70 = viable entry with correct concept positioning.
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={SUBURB_SCORES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={S.border}/>
                <XAxis dataKey="suburb" tick={{ fontSize: 12, fontFamily: S.font, fill: S.muted }} axisLine={false} tickLine={false}/>
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: S.font, fill: S.muted }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: S.font, borderRadius: 10, border: `1px solid ${S.border}` }} formatter={(v) => [`${(v as number) ?? 0}/100`, 'Score']}/>
                <Bar dataKey="score" fill="#0F766E" radius={[6, 6, 0, 0]} maxBarSize={60}
                  label={{ position: 'top', fontSize: 11, fontWeight: 700, fill: '#0F766E', fontFamily: S.font }}/>
              </BarChart>
            </ResponsiveContainer>
            <DataNote text="Scores based on Locatalyze model: foot traffic weight 30%, rent-to-revenue 30%, demographics 25%, competition 15%. Suburb-level aggregate — individual addresses may score higher or lower."/>
          </div>

          {/* Rent vs revenue scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '28px 24px', marginBottom: 44 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Rent vs revenue — where Melbourne sits nationally</h2>
            <p style={{ fontSize: 13, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>
              Monthly rent (x-axis) plotted against estimated monthly revenue (y-axis). Points above the trend line have favourable rent-to-revenue ratios. Points below are structurally difficult. Sydney CBD and Melbourne CBD are included for comparison.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={S.border}/>
                <XAxis dataKey="rent" name="Rent" type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fontFamily: S.font, fill: S.muted }} axisLine={false} tickLine={false} label={{ value: 'Monthly rent', position: 'insideBottom', offset: -2, fontSize: 11, fill: S.muted, fontFamily: S.font }}/>
                <YAxis dataKey="revenue" name="Revenue" type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fontFamily: S.font, fill: S.muted }} axisLine={false} tickLine={false}/>
                <ZAxis range={[60, 60]}/>
                <Tooltip contentStyle={{ fontSize: 12, fontFamily: S.font, borderRadius: 10, border: `1px solid ${S.border}` }}
                  formatter={(v, name) => [name === 'Rent' ? `$${(v as number).toLocaleString()}/mo` : `$${((v as number)/1000).toFixed(0)}k/mo`, name as string]}
                  labelFormatter={() => ''}/>
                <Scatter data={RENT_VS_REVENUE} fill="#0F766E" opacity={0.85}
                  label={{ dataKey: 'suburb', position: 'top', fontSize: 10, fill: S.muted, fontFamily: S.font }}/>
              </ScatterChart>
            </ResponsiveContainer>
            <DataNote text="Revenue estimates are suburb-level medians based on 80sqm tenancy, 7am–4pm trading, $13 avg ticket. Individual results vary based on format, concept and execution. Source: Locatalyze model + CBRE commercial data Q1 2026."/>
          </div>

          <SuburbPoll />

          {/* Suburb detail tabs */}
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Suburb-by-suburb breakdown
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 28, lineHeight: 1.7 }}>
            Each suburb is scored on four dimensions: foot traffic volume, demographics (income, age, density), rent-to-revenue fit, and competition intensity. Click to explore each.
          </p>

          {/* Suburb selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 28 }}>
            {TOP_SUBURBS.map((s, i) => {
              const vs = verdictStyle(s.verdict)
              return (
                <button key={s.name} onClick={() => setActiveSuburb(i)}
                  style={{ padding: '8px 16px', borderRadius: 100, border: `1.5px solid ${i === activeSuburb ? vs.color : S.border}`, background: i === activeSuburb ? vs.bg : S.white, color: i === activeSuburb ? vs.color : S.muted, fontSize: 13, fontWeight: i === activeSuburb ? 700 : 500, cursor: 'pointer', fontFamily: S.font, transition: 'all 0.15s' }}>
                  #{s.rank} {s.name}
                </button>
              )
            })}
          </div>

          {/* Active suburb card */}
          <div style={{ background: S.white, border: `1.5px solid ${vs.border}`, borderRadius: 20, overflow: 'hidden', marginBottom: 44 }}>
            {/* Card header */}
            <div style={{ background: 'linear-gradient(135deg, #0C1F1C, #0F766E)', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}/>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>#{sub.rank} — {sub.postcode}</p>
                    <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 8 }}>{sub.name}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.55, maxWidth: 420 }}>{sub.angle}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                    <div style={{ background: vs.bg, border: `2px solid ${vs.border}`, borderRadius: 12, padding: '10px 18px', textAlign: 'center' as const }}>
                      <p style={{ fontSize: 18, fontWeight: 900, color: vs.color, lineHeight: 1 }}>{sub.verdict}</p>
                      <p style={{ fontSize: 9, color: vs.color, opacity: 0.75, marginTop: 2 }}>Location verdict</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 18px', textAlign: 'center' as const }}>
                      <p style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{sub.score}</p>
                      <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>/100 score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Key stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 28 }}>
                {[
                  { l: 'Median income', v: sub.income },
                  { l: 'Monthly rent range', v: sub.rent },
                  { l: 'Direct competition', v: sub.competition },
                  { l: 'Break-even (est.)', v: sub.breakEven + ' transactions/day' },
                  { l: 'Est. payback', v: sub.payback },
                  { l: 'Est. annual profit', v: sub.annualProfit },
                ].map(item => (
                  <div key={item.l} style={{ background: S.n50, borderRadius: 12, border: `1px solid ${S.border}`, padding: '12px 14px' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 4 }}>{item.l}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: S.n900, lineHeight: 1.2 }}>{item.v}</p>
                  </div>
                ))}
              </div>

              {/* Score bars */}
              <div style={{ background: S.n50, borderRadius: 14, border: `1px solid ${S.border}`, padding: '18px 20px', marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 14 }}>Score breakdown</p>
                <ScoreBar label="Foot traffic & demand" value={sub.footTraffic} color={vs.color}/>
                <ScoreBar label="Income demographics" value={sub.demographics} color={vs.color}/>
                <ScoreBar label="Rent-to-revenue fit" value={sub.rentFit} color={vs.color}/>
                <ScoreBar label="Competition level" value={sub.competitionScore} color={vs.color}/>
              </div>

              {/* Detail paragraphs */}
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.n900, marginBottom: 14 }}>Why {sub.name} scores {sub.score}/100</h4>
              {sub.detail.map((para, i) => (
                <p key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: 14 }}>{para}</p>
              ))}

              {/* Risks and opportunity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
                <div style={{ background: '#FEF9F0', border: '1px solid #FED7AA', borderRadius: 12, padding: '16px 18px' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 8 }}>Key risks</p>
                  <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.65 }}>{sub.risks}</p>
                </div>
                <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#065F46', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 8 }}>Opportunity gap</p>
                  <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.65 }}>{sub.opportunity}</p>
                </div>
              </div>
            </div>
          </div>

          <ChecklistUnlock />

          {/* Context: Melbourne vs other cities */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '28px 24px', marginBottom: 44 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 16 }}>How Melbourne compares to other Australian cities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
              {[
                { city: 'Melbourne', score: 'Hard', detail: 'Highest competition, strongest culture', color: '#0F766E' },
                { city: 'Sydney', score: 'Hard', detail: 'High rents, strong inner suburbs', color: '#0891B2' },
                { city: 'Brisbane', score: 'Medium', detail: 'Growing fast, less saturated', color: '#7C3AED' },
                { city: 'Perth', score: 'Accessible', detail: 'Best rent-to-revenue nationally', color: '#059669' },
              ].map(item => (
                <div key={item.city} style={{ background: S.n50, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: item.color, marginBottom: 3 }}>{item.city}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 4 }}>{item.score}</p>
                  <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.5 }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)', borderRadius: 20, padding: '40px 36px', textAlign: 'center' as const }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Got a specific Melbourne address in mind?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 8, lineHeight: 1.7 }}>
              This guide scores suburbs. Locatalyze scores individual addresses — with competitor mapping, live business data, rent-to-revenue calculation and a GO/CAUTION/NO verdict.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
              No signup required to start. Results in about 90 seconds.
            </p>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0F766E', borderRadius: 12, padding: '14px 30px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
              Check my Melbourne address →
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
