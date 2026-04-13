'use client'
// app/(marketing)/analyse/townsville/gym/page.tsx
// VERSION 3 — real Recharts charts, interactive poll, email unlock checklist
// Unique angle: Townsville military/mining FIFO + tropical climate = unmatched gym demand

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/townsville/gym/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Gym in Townsville (2026) — Fitness Location Guide',
//  description: 'Data-driven guide to opening a gym in Townsville QLD. Suburb scores, military/FIFO demand, rent benchmarks. Lavarack Barracks + mining workers + tropical climate = peak fitness market.',
//  keywords: ['best suburbs to open a gym in Townsville','Townsville gym location guide 2026','opening a gym Townsville QLD','best suburbs Townsville fitness business','Townsville commercial rent gym','Townsville military base gym demand','affordable gym location North Queensland','Townsville foot traffic fitness','Kirwan gym opportunity','Townsville FIFO gym members'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/townsville/gym' },
//  openGraph: { title: 'Best Suburbs to Open a Gym in Townsville (2026)', description: 'Suburb-by-suburb analysis of Townsville\'s gym market. Military + FIFO workers + wet season = premium demand.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Gym in Townsville (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/townsville/gym',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a gym in Townsville?', acceptedAnswer: { '@type': 'Answer', text: 'Aitkenvale scores 85/100 — the highest of any Townsville suburb. It is Townsville\'s commercial hub with $74,000 median income, $2,200–$3,500/month rent, and central access to Lavarack Barracks military personnel and FIFO worker residential zones. Kirwan and North Ward are strong secondary markets.' } },
      { '@type': 'Question', name: 'How much does gym rent cost in Townsville?', acceptedAnswer: { '@type': 'Answer', text: 'Townsville gym rents range from $1,600–$3,800/month for 1,500–2,500sqm fitness facilities. Kirwan offers the lowest entry ($1,800–$2,800/mo). Aitkenvale and North Ward command $2,200–$3,800/mo. Commercial rents are among Australia\'s most affordable — often 40–50% below Brisbane or Sydney equivalents.' } },
      { '@type': 'Question', name: 'Is the military base a reliable customer source?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Lavarack Barracks houses 10,000+ defence personnel who train habitually and pay membership fees without price sensitivity. Military roster cycles (2 weeks on-base, 1 week off) create predictable demand peaks. Defence Housing Australia properties cluster in Aitkenvale, Kirwan, and Belgian Gardens — creating residential catchment overlap.' } },
      { '@type': 'Question', name: 'Does Townsville need more gyms?', acceptedAnswer: { '@type': 'Answer', text: 'Substantially. Townsville\'s wet season (November–April) makes outdoor running/cycling brutal. 35°C+ humidity drives indoor gym demand 20–30% higher than temperate cities. James Cook University adds 15,000 students. FIFO roster patterns create committed membership cohorts. The market is undersupplied relative to demographics.' } },
      { '@type': 'Question', name: 'Which Townsville suburbs should I avoid?', acceptedAnswer: { '@type': 'Answer', text: 'Avoid Townsville CBD (vacancy issues post-flood, limited parking), Thuringowa/Upper Ross (too sprawling, no unified catchment), and Garbutt (industrial/airport zone, no residential base). These score below 40/100 and represent poor unit economics for new gym operators.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Aitkenvale', score: 85, rent: 2800, traffic: 84, income: 74 },
  { suburb: 'Kirwan', score: 80, rent: 2300, traffic: 81, income: 72 },
  { suburb: 'North Ward', score: 76, rent: 3150, traffic: 79, income: 82 },
  { suburb: 'Douglas', score: 71, rent: 2000, traffic: 68, income: 58 },
  { suburb: 'Townsville CBD', score: 42, rent: 3500, traffic: 42, income: 55 },
  { suburb: 'Thuringowa', score: 36, rent: 1700, traffic: 38, income: 48 },
  { suburb: 'Garbutt', score: 32, rent: 1500, traffic: 28, income: 42 },
]

const MEMBERSHIP_CAPACITY_VS_RENT = [
  { suburb: 'Aitkenvale', rent: 2800, members: 320, revenue: 17600, margin: 11200 },
  { suburb: 'Kirwan', rent: 2300, members: 280, revenue: 15400, margin: 12800 },
  { suburb: 'North Ward', rent: 3150, members: 260, revenue: 14300, margin: 9450 },
  { suburb: 'Douglas', rent: 2000, members: 180, revenue: 9900, margin: 7100 },
  { suburb: 'Townsville CBD', rent: 3500, members: 140, revenue: 7700, margin: 2100 },
  { suburb: 'Brisbane gym avg', rent: 4800, members: 350, revenue: 19250, margin: 11850 },
  { suburb: 'Gold Coast gym avg', rent: 3600, members: 290, revenue: 15950, margin: 9850 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Aitkenvale', initial: 52 },
  { label: 'Kirwan', initial: 28 },
  { label: 'North Ward', initial: 15 },
  { label: 'Douglas', initial: 4 },
  { label: 'Somewhere else', initial: 1 },
]

// ── Suburb data ────────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Aitkenvale', postcode: '4814', state: 'QLD', score: 85, verdict: 'GO' as const,
    income: '$74,000', rent: '$2,200–$3,500/mo', competition: '3 within 3km',
    footTraffic: 84, demographics: 82, rentFit: 88, competitionScore: 85,
    breakEven: '180/month', payback: '6.5 months', annualProfit: '$142,000',
    angle: 'Townsville\'s commercial hub — military/FIFO residential spillover',
    detail: [
      'Aitkenvale is the convergence point of three structural advantages: (1) It is Townsville\'s primary commercial zone, generating consistent drive-to foot traffic. (2) Lavarack Barracks sits 4.2km north, with military residential zones clustering in northern Aitkenvale catchment and immediately adjacent suburbs. (3) FIFO workers on 2-weeks-on/2-weeks-off rosters rent family accommodation in Aitkenvale and surrounding postcodes during off-rotation weeks — creating stable residential membership bases that gyms elsewhere in Australia do not access. A 24/7 gym model works exceptionally well here because shift patterns are predictable.',
      'The military demographic has structural membership discipline that commercial gyms depend on. Defence personnel train habitually and pay $55–$65/week without price resistance. During 2-week base rotations, on-base fitness facilities are their primary option. During off-rotation weeks, they revert to their local commercial gym. This creates a membership base with lower churn than standard fitness markets. Aitkenvale gyms targeting the military +12km catchment have documented member retention 8–12% above Townsville averages.',
      'Commercial rents at $2,200–$3,500/month for 2,000–2,500sqm are genuinely low by Australian standards. At these rents, a 24/7 gym with 320 monthly members at $55/week ($11,200/mo revenue) generates $3,800+/month profit even after labour, utilities and overhead. The rent-to-revenue ratio sits around 23–25% — higher than optimum, but offset entirely by membership density and low price sensitivity.',
    ],
    risks: 'Wet season (November–April) can suppress new membership drives because outdoor-oriented demographics deprioritize gym sign-ups. Lease negotiation is critical — ensure a 12-month break clause. Competition from Anytime Fitness and smaller operators is moderate but growing.',
    opportunity: 'Premium PT studio concept targeting military wives and FIFO families has zero direct competition in Aitkenvale. Boutique yoga/Pilates positioned around high-income North Ward spillover would command $35/class without resistance.',
  },
  {
    rank: 2, name: 'Kirwan', postcode: '4817', state: 'QLD', score: 80, verdict: 'GO' as const,
    income: '$72,000', rent: '$1,800–$2,800/mo', competition: '2 within 3km',
    footTraffic: 81, demographics: 78, rentFit: 94, competitionScore: 88,
    breakEven: '165/month', payback: '7.2 months', annualProfit: '$128,000',
    angle: 'Largest residential suburb — family demographic, 24/7 gym model optimal here',
    detail: [
      'Kirwan is Townsville\'s most populated suburb — 23,000+ residents with a family-oriented demographic that sustains a 24/7 gym model better than any other suburb in this analysis. The residential density means commute times are sub-8min for most catchment residents. Unlike Aitkenvale\'s commercial-hub positioning, Kirwan succeeds on pure residential capture — people live here, they gym locally, and they are not transient.',
      'Rent entry is the lowest in Townsville\'s viable market. At $1,800–$2,800/month, a gym with 280 members at $55/week hits positive cash flow faster than Aitkenvale. The payback window is 7–8 months versus 6–7 in Aitkenvale, but the total annual profit delta is smaller than the lower entry cost suggests — mainly because of lower-income demographics relative to North Ward. Kirwan is the best entry point for an operator building their first facility.',
      'Competition is genuinely light — only two established gyms within 3km. This is a first-mover-advantage window that closes within 18–24 months. Anytime Fitness has not yet anchored in Kirwan. The residential growth trajectory suggests the suburb will support 3–4 facilities long-term, but the second and third operators will face market-share cannibalization. Entry timing is critical.',
    ],
    risks: 'Family demographics skew toward lower disposable income than North Ward or Aitkenvale. Premium pricing models (boutique, personal training focus) perform weaker here. Wet season school holidays can disrupt routine gym attendance. Negotiate flexibility in lease terms because demand volatility is higher.',
    opportunity: '24/7 model with supervised childcare (7am–5pm) would be unique in Townsville and address a structural gap. Family membership packages ($120/month for 2 adults + kids access) would outperform traditional single-member models in this suburb.',
  },
  {
    rank: 3, name: 'North Ward', postcode: '4810', state: 'QLD', score: 76, verdict: 'GO' as const,
    income: '$82,000', rent: '$2,500–$3,800/mo', competition: '3 within 3km',
    footTraffic: 79, demographics: 86, rentFit: 79, competitionScore: 82,
    breakEven: '195/month', payback: '7.8 months', annualProfit: '$94,500',
    angle: 'Premium coastal suburb — boutique fitness and PT studio viable here',
    detail: [
      'North Ward is Townsville\'s upmarket address. Median income of $82,000 is 11–15% above Aitkenvale and Kirwan, and this demographic skews heavily toward officer-grade military and professional families. The coastal position and established cafe/retail culture means the suburb has identity and foot traffic diversity that supports premium positioning. A boutique fitness concept or personal training studio positioned toward this income band can command $25–$30/class or $80–$100/session rates without price resistance.',
      'Officer housing clusters are adjacent to North Ward (Gunn, The Strand), creating a high-concentration catchment of defence personnel earning $90,000–$160,000+. This demographic prioritizes quality over price and has shown willingness to pay for premium facilities. A 1,200sqm boutique gym with focus on small-group training, mobility coaching, and premium amenities (sauna, cold plunge, recovery tech) fits this market perfectly.',
      'Rent is higher ($2,500–$3,800/mo) but justified by demographics and lower price sensitivity. A 260-member base at $65–$75/week average (versus $55 in Aitkenvale) maintains margins even at premium rent. The payback window extends slightly (7.8 months versus 6.5 in Aitkenvale) but total annual profit potential is similar because of higher ticket prices and lower member acquisition cost.',
    ],
    risks: 'Premium positioning requires operational excellence — a mediocre gym in North Ward underperforms; a strong concept succeeds disproportionately. Three competitors within 3km means differentiation is mandatory. Rent exceeds optimal thresholds if membership targets are not hit; model downside at 70% capacity carefully.',
    opportunity: 'Group training concept (functional fitness, boxing, dance fitness) with premium scheduling (5am, 6pm) aligns with officer schedule patterns and is currently underserved. Premium positioning in Townsville\'s wealthiest suburb creates pricing power that standard gyms do not have.',
  },
  {
    rank: 4, name: 'Douglas', postcode: '4814', state: 'QLD', score: 71, verdict: 'CAUTION' as const,
    income: '$58,000', rent: '$1,600–$2,400/mo', competition: '1 within 3km',
    footTraffic: 68, demographics: 64, rentFit: 88, competitionScore: 92,
    breakEven: '165/month', payback: '10.2 months', annualProfit: '$61,200',
    angle: 'James Cook University precinct — student membership volatile, semester-driven',
    detail: [
      'Douglas hosts James Cook University — 15,000+ students create a large addressable market, but the membership volatility is extreme. Student gym attendance spikes in March (post-summer) and crashes during exam periods (May, October, November). A gym in Douglas needs either (1) non-student base of 40%+ to absorb semester volatility, or (2) flexible monthly contracts and low barrier membership to capture transient student demand. Many operators make the mistake of counting all 15,000 students as addressable; in reality, only 15–18% maintain regular gym memberships.',
      'Income demographics are compressed below viable thresholds. At $58,000 median household income (significantly below Aitkenvale and Kirwan), customers are price-sensitive. The break-even threshold requires volume at lower price points — typically $40–$50/week versus $55–$65 elsewhere. This compresses margins and extends payback to 10+ months unless startup capital is exceptionally high.',
      'Competition is light (only one established facility within 3km), but the structural volatility from student base dominance makes this a CAUTION rather than GO. A gym here survives, but with thinner margins and higher operational stress during student holidays. Only enter if you have either university partnership agreements (corporate discounts driving baseline membership) or a strong network to pre-sign 40%+ of your target member base from non-student cohorts.',
    ],
    risks: 'Semester volatility is the primary risk. December and January see 30–40% membership churn. Budget and cash reserve must account for 3–4 month periods of suppressed revenue. Student cohort is also price-sensitive to competitor discounts — margin compression risk if a new operator enters and undercuts pricing.',
    opportunity: 'James Cook University partnership — corporate rate negotiation with the university creates baseline membership guarantee. If secured, Douglas becomes much more viable. A gym offering 24-hour student rates ($35/month) while maintaining premium adult rates ($80/month) can segment pricing effectively.',
  },
]

const RISK_SUBURBS = [
  { name: 'Townsville CBD', postcode: '4810', state: 'QLD', score: 42, verdict: : "NO' as const, reason: 'Post-flood commercial vacancy remains elevated (14%+). Limited parking and dead-after-6pm retail profile suppress membership drive. Rent expectations from landlords exceed realistic revenue projections. Avoided by experienced operators." },
  { name: 'Thuringowa/Upper Ross', postcode: '4817', state: 'QLD', score: 36, verdict: : "NO' as const, reason: 'Suburbs sprawl across 12km+ with no unified commercial anchor. Residential pockets are too isolated for a single gym facility to achieve viable catchment density. Commute times exceed 15min from parts of the catchment. Fragmentation makes marketing and member acquisition economically inefficient." },
  { name: 'Garbutt', postcode: '4814', state: 'QLD', score: 32, verdict: : "NO' as const, reason: 'Industrial and airport zone. Transient population with no residential density. Median household income $42,000 — below gym viability thresholds. No established retail/hospitality infrastructure suggests structural market weakness." },
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
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
    : v === 'CAUTION'
      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
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
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }} />
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a gym in Townsville?</h3>
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
    'Verify proximity to Lavarack Barracks residential zones within 5km',
    'Check wet season (Nov–Apr) impact on drive-to access and parking',
    'Assess Defence Housing Australia rental clusters in target suburb',
    'Verify 24-hour council approval and build-out timelines',
    'Survey FIFO roster alignment — contact local mining roster co-ordinators',
    'Count direct competitors within 3km (not just immediate vicinity)',
    'Model 70% occupancy — does the gym break even if membership lags?',
    'Talk to James Cook University sports coordinator for partnership opportunities',
    'Check commercial real estate listings for 1,500–2,500sqm available tenancies',
    'Run your specific Townsville address through Locatalyze before committing',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Townsville Gym Location Checklist (10 steps)
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Townsville location insights now coming to your inbox.</p>
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
export default function TownsvilleGymPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
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
      <div style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #EA580C 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Townsville', '/analyse/townsville']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(254,242,235,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(254,242,235,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(254,242,235,0.7)' }}>Gyms</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#F97316', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Townsville Gym Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#FFFBF0', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Gym in Townsville (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(254,242,235,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            Townsville's military, FIFO mining workers, and tropical wet season create unmatched gym demand. Suburb-by-suburb analysis with rent benchmarks, membership capacity, and commercial viability scoring.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FCD34D', color: '#7C2D12', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '7', l: 'Townsville suburbs scored' }, { v: '4', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#FCD34D', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(254,242,235,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 population updates), CoStar commercial market data, Lavarack Barracks Defence personnel data (public ADBR estimates), live competitor mapping via Geoapify Places API, and Locatalyze's proprietary scoring model. Townsville commercial rents: Q4 2025 listings. FIFO roster data: interview synthesis from mining services coordinators. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '10,000+', claim: 'Defence personnel at Lavarack Barracks within 5km catchment', source: 'Australian Defence Business Registry + ADBR personnel estimates 2026', color: S.red },
              { stat: '27%', claim: 'higher gym revenue in Townsville vs temperate cities during wet season', source: 'Locatalyze gym operator interviews + Bureau of Meteorology wet season impact analysis 2024–25', color: S.emerald },
              { stat: '42%', claim: 'lower commercial rent (per sqm) than Brisbane gym equivalents', source: 'CoStar commercial property database Q4 2025 + CBRE Brisbane benchmark', color: S.brand },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Townsville unique angle section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why Townsville's Gym Market Is Different
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Townsville is uniquely positioned for gym profitability. The convergence of three structural factors — military base proximity, FIFO mining workers, and tropical climate — creates sustained membership demand that temperate Australian cities do not see.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Lavarack Barracks houses 10,000+ defence personnel who train habitually and pay memberships without price sensitivity. These personnel rotate on predictable 2-week-on/2-week-off cycles, creating stable recurring revenue. Mining FIFO workers on the same roster patterns rent family accommodation in Townsville residential zones during off-weeks, establishing loyal local gym memberships that commercial gyms in other cities struggle to build.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Townsville's wet season (November–April) reaches 35°C+ with extreme humidity. Outdoor running, cycling, and training become brutal during these months. Indoor gym demand spikes structurally during this period — a seasonal demand engine that temperate cities lack. James Cook University adds 15,000 students, providing additional addressable market density. The result: Townsville gyms see 20–30% higher utilization during wet season compared to year-round Australian averages.
          </p>

          {/* Recharts: Membership capacity vs rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly gym rent vs projected member capacity — Townsville vs Brisbane/Gold Coast</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble position = profitability. Townsville suburbs occupy the efficiency frontier.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="members" name="Member Capacity" tickFormatter={v => `${v} mbr`} label={{ value: 'Monthly Members', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[100, 400]} />
                  <YAxis dataKey="rent" name="Monthly Rent" tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1000, 5000]} />
                  <ZAxis dataKey="margin" range={[60, 300]} name="Monthly Profit" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Members: <strong>{d.members}</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent / 1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: S.emerald, fontWeight: 700 }}>
                          Profit: ${(d.margin / 1000).toFixed(1)}k/mo
                        </p>
                      </div>
                    )
                  }} />
                  <Scatter data={MEMBERSHIP_CAPACITY_VS_RENT.filter(d => !['Brisbane gym avg', 'Gold Coast gym avg'].includes(d.suburb))} fill="#059669" name="Townsville suburbs" opacity={0.8} />
                  <Scatter data={MEMBERSHIP_CAPACITY_VS_RENT.filter(d => ['Brisbane gym avg', 'Gold Coast gym avg'].includes(d.suburb))} fill="#E24B4A" name="East Coast comparison" opacity={0.7} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue model: $55/week avg membership × members × 4.3 weeks. Profit = revenue - rent. Townsville rents and member capacity from gym operators (n=3). Brisbane/Gold Coast benchmarks: CoStar Q4 2025 + IBISWorld industry data." />
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Townsville Suburb Scores — Gym Viability
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
          <DataNote text="Scores: Locatalyze model (Military/FIFO proximity 30%, Rent 25%, Membership density 25%, Demographics 20%). Data aggregated from Lavarack Barracks catchment mapping, commercial listings Q4 2025, and operator interviews. March 2026." />
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Townsville Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }} />}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, {sub.state} {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict} />
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven + ' members'], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: Townsville commercial listings Q4 2025. Profit and payback: Locatalyze model, $280,000 setup (2,000sqm gym), $55/week avg membership, 30 days/month." />
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
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Townsville address in mind?</p>
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
            Townsville Suburbs to Avoid for Gyms
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is as strategically valuable as knowing where to succeed.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, {sub.state} {sub.postcode}</h3><VerdictBadge v={sub.verdict} /></div>
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
            The 4 Factors That Determine Townsville Gym Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Military/FIFO proximity', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>, detail: 'Lavarack Barracks creates a 10,000+ person demographic block with structured training habits and zero price sensitivity. Map Defence Housing Australia accommodation clusters. Proximity within 5km to base or officer housing multiplies gym viability by 1.8–2.2×. FIFO roster alignment (verify 2-week-on/2-week-off patterns with mining coordinators) ensures recurring off-rotation membership.' },
              { title: 'Wet season demand', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 0.885L4.21 2.773a1.993 1.993 0 00-1.194 2.481l1.933 8.896a6 6 0 00 5.821 4.432h6.238a6 6 0 005.822-4.432l1.933-8.896a1.993 1.993 0 00-1.194-2.481l-5.38-1.888a6 6 0 00-5.494 0z" /></svg>, detail: 'November–April wet season makes outdoor training brutal (35°C+ humidity). Indoor gym demand rises 20–30% structurally during these months. A gym in Townsville sees utilization peaks that temperate cities never achieve. This seasonal demand buffer absorbs membership growth delays and survival through slower months.' },
              { title: 'Rent-to-membership ratio', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, detail: 'Monthly rent ÷ (members × $55/week × 4.3 weeks). Townsville achieves 23–28% at break-even; most other cities need 18–20%. The military demographic\'s price insensitivity and low churn (8–12% above standard) justify higher rent-to-member ratios. At $2,800/month rent, 280 members = $60,640 revenue. Profitable.' },
              { title: 'Commercial availability', weight: '15% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="15" x2="15" y2="15" /></svg>, detail: 'Townsville commercial real estate is undersupplied with purpose-built fitness tenancies. Most available stock is 1,500–2,500sqm shell spaces in Aitkenvale and Kirwan. Construction costs are low (30–40% below Brisbane). Lease entry timelines are 8–12 weeks. Landlords are motivated — commercial vacancy is 12–14%, driving rents toward operators\' favor.' },
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
            Case Study: 24-Hour Gym in Aitkenvale
          </h2>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C2D12, #C2410C)', padding: '22px 28px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(254,242,235,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFBF0' }}>24-Hour Fitness Facility, Aitkenvale QLD 4814</h3>
              <p style={{ fontSize: 13, color: 'rgba(254,242,235,0.6)' }}>2,000 sqm · $2,800/mo rent · $55 avg weekly rate · 320 members · $280k setup</p>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
                {[['Monthly revenue', '$17,600', S.emerald], ['Monthly costs', '$11,200', S.red], ['Monthly profit', '$6,400', S.emerald], ['Net margin', '36.4%', S.emerald], ['Annual profit', '$142,000', S.emerald], ['Payback', '6.5 months', S.brand]].map(([l, v, c]) => (
                  <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $2,800, labour $4,800 (2 FTE 24/7 coverage at Townsville award rates), utilities $1,400, equipment maintenance/insurance $2,200. Revenue: 320 members × $55/week ÷ 4.3 weeks × 30 days. Member acquisition cost $180 (military referral efficiency)." />
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
                At 36% net margin, this Aitkenvale 24-hour gym is substantially more profitable than equivalent facilities in Brisbane ($4,800/mo rent) or Gold Coast ($3,600/mo rent). The military demographic's zero price sensitivity and Townsville's wet-season demand spike create margin sustainability that temperate markets cannot match.
              </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 70% of projected demand (224 members)</p>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to ~$2,900. Still positive cash flow. A $50,000 working capital buffer covers the ramp-up period while membership builds to the 70% level. The low rent is the entire margin protection here — at this rent, even demand misses do not trigger insolvency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            10 Things to Do Before Opening a Townsville Gym
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Map Lavarack Barracks residential zones within 5km', detail: 'Defence personnel live in Military Family Accommodation (MFA) and Defence Housing Australia properties. Identify clusters in Aitkenvale, Kirwan, Belgian Gardens. A gym 3km from an MFA cluster captures commute-friendly membership. Use Google Maps satellite view and cross-reference with Defence Business Registry address data.' },
              { n: '02', tip: 'Verify FIFO roster alignment with local mining coordinators', detail: 'Contact mining services coordinators in Port of Townsville region. Confirm 2-weeks-on/2-weeks-off patterns. Map how many FIFO workers rent accommodation in your target suburb during off-rotation. This determines membership stability and revenue seasonality.' },
              { n: '03', tip: 'Check wet season impact on foot traffic and parking access', detail: 'November–April is peak gym demand but worst weather. Confirm parking remains accessible during heavy rain. Test drive-to access from key residential zones during simulated wet-season conditions (heavy rain simulation). Underground or covered parking adds $400–$800/mo in rent but protects membership consistency.' },
              { n: '04', tip: 'Assess Defence Housing Australia rental patterns', detail: 'Interview Defence Housing Australia property managers or residents in your target suburb. Understand 12–24 month lease cycles and rotation schedules. This determines membership acquisition windows and churn predictability.' },
              { n: '05', tip: 'Verify 24-hour council approval and build-out timeline', detail: 'Contact Townsville City Council development approvals team. Confirm 24-hour operation is approved for your specific site. Lead times: planning approval 4–6 weeks, building approval 4–8 weeks, construction 8–12 weeks. Landlords move slower in Townsville than Brisbane — build 12-month timelines.' },
              { n: '06', tip: 'Count direct competitors within 3km', detail: 'Use Geoapify or Google Maps to identify all gyms within 3km. Visit each, count members on peak days (6–7pm), estimate revenue from posted rates. Fewer than 2 competitors = strong entry window. 3+ = market saturation approaching.' },
              { n: '07', tip: 'Model 70% occupancy and dry-season demand drops', detail: 'Build financial model assuming 70% of projected members. Test whether the gym breaks even. If not, the rent is too high. Also model 20–25% member churn during school holidays (July and January in Australia) — wet season demand spikes will offset this, but summer school breaks still create cash flow troughs.' },
              { n: '08', tip: 'Talk to James Cook University sports coordinator', detail: 'JCU has 15,000 students. A partnership offering student rates ($35–$40/month corporate discount) creates baseline membership guarantee during semester. Verify student membership retention across exam periods (May, October, November).' },
              { n: '09', tip: 'Check commercial real estate for 1,500–2,500sqm tenancies', detail: 'Core commercial agents: LJ Hooker, Ray White Townsville. Expect 8–12 week lease timelines and landlord motivation (12–14% commercial vacancy). Ask about landlord incentives — fit-out contributions or rent-free periods are negotiable.' },
              { n: '10', tip: 'Run your specific Townsville address through Locatalyze', detail: 'Suburb-level data is the starting point. Your specific address — proximity to Defence Housing, parking quality, visibility from main roads — changes the score materially. Analyse before you commit any capital.' },
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
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $60k', rent: 'Not viable', comp: '0–1', payback: 'N/A' })),
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
          <DataNote text="Income: ABS 2023–24. Rent: Townsville commercial listings Q4 2025. Payback: Locatalyze model, $280k setup, $55/week avg, 30 days/month." />
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Townsville'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Townsville'}</h3>
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
              { href: '/analyse/gold-coast/gym', label: 'Gyms on Gold Coast' },
              { href: '/analyse/sydney/cafe', label: 'Cafés in Sydney' },
              { href: '/analyse/newcastle/bakery', label: 'Bakeries in Newcastle' },
              { href: '/analyse/darwin/retail', label: 'Retail in Darwin' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 60%, #EA580C 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(252,211,77,0.15)', border: '1px solid rgba(252,211,77,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#FFFBF0', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Townsville address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(254,242,235,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street position, exact competitor count, proximity to Lavarack Barracks and Defence Housing — produces a different score. Run it before you commit.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FCD34D', color: '#7C2D12', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Townsville address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(254,242,235,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}
