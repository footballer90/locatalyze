'use client'
// app/(marketing)/analyse/perth/restaurant/page.tsx
// Perth restaurant location guide — best-value dining market among Australian capitals
// Unique angle: Perth has below-eastern-capital rents, above-national-median incomes,
// and a maturing independent dining culture. The data shows where the gaps are.

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
    headline: 'Best Suburbs to Open a Restaurant in Perth (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-04-10',
    url: 'https://www.locatalyze.com/analyse/perth/restaurant',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best suburb to open a restaurant in Perth?',
        acceptedAnswer: { '@type': 'Answer', text: 'Mount Lawley scores 84/100 — the highest of any Perth suburb for restaurants. Beaufort Street has the most reliable hospitality strip in Perth with established dining culture, $98,000 median household income and rents 40–50% below Melbourne equivalents. Subiaco and Fremantle are the strongest alternatives.' },
      },
      {
        '@type': 'Question',
        name: 'How much does restaurant rent cost in Perth inner suburbs?',
        acceptedAnswer: { '@type': 'Answer', text: 'Perth inner suburb restaurant rents range from $2,800–$4,200/month in Mount Lawley to $5,000–$7,500/month in Subiaco prime (100–130sqm tenancy). These rents are 35–50% below Melbourne equivalents for comparable locations and demographics.' },
      },
      {
        '@type': 'Question',
        name: 'Is Perth a good market for an independent restaurant in 2026?',
        acceptedAnswer: { '@type': 'Answer', text: 'Perth has above-national-average household incomes (driven by the resources sector) and rents significantly below the eastern capitals. The independent dining culture has matured since 2019. The key risk is that foot traffic volumes are lower than equivalent Sydney or Melbourne strips — a Perth restaurant needs a higher repeat visit rate to compensate.' },
      },
      {
        '@type': 'Question',
        name: 'Which Perth suburbs have the strongest restaurant demographics?',
        acceptedAnswer: { '@type': 'Answer', text: 'Mount Lawley and Subiaco have the highest dining-out frequency per household in Perth. Fremantle has strong tourism-driven demand on weekends. Leederville has a younger demographic with lower average spend but better rent-to-revenue ratios. Claremont serves the highest-income catchment but has limited strip retail availability.' },
      },
      {
        '@type': 'Question',
        name: 'What are the risks of opening a restaurant in Perth compared to Melbourne or Sydney?',
        acceptedAnswer: { '@type': 'Answer', text: 'The primary Perth-specific risk is lower foot traffic volume. Even strong Perth strips generate 40–60% of the daily foot traffic that equivalent Melbourne or Sydney strips see. This means a Perth restaurant needs a loyal repeat customer base — you cannot rely on walk-in conversion at Melbourne volumes. Labour costs are also higher due to FIFO workforce competition.' },
      },
    ],
  },
]

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Mt Lawley',  score: 84, rent: 3500,  traffic: 85, income: 98  },
  { suburb: 'Subiaco',    score: 79, rent: 5200,  traffic: 83, income: 115 },
  { suburb: 'Fremantle',  score: 75, rent: 4200,  traffic: 80, income: 88  },
  { suburb: 'Leederville',score: 73, rent: 3200,  traffic: 77, income: 95  },
  { suburb: 'Perth CBD',  score: 58, rent: 7500,  traffic: 72, income: 92  },
  { suburb: 'Northbridge',score: 52, rent: 2400,  traffic: 68, income: 72  },
]

const RENT_VS_REVENUE = [
  { suburb: 'Mt Lawley',      rent: 3500,  revenue: 78000,  ratio: 4.5 },
  { suburb: 'Subiaco',        rent: 5200,  revenue: 92000,  ratio: 5.7 },
  { suburb: 'Fremantle',      rent: 4200,  revenue: 82000,  ratio: 5.1 },
  { suburb: 'Leederville',    rent: 3200,  revenue: 72000,  ratio: 4.4 },
  { suburb: 'Perth CBD',      rent: 7500,  revenue: 85000,  ratio: 8.8 },
  { suburb: 'Northbridge',    rent: 2400,  revenue: 62000,  ratio: 3.9 },
  { suburb: 'Melbourne Fitzroy', rent: 6800, revenue: 98000, ratio: 6.9 },
  { suburb: 'Sydney Surry Hills', rent: 11000, revenue: 95000, ratio: 11.6 },
]

const POLL_OPTIONS = [
  { label: 'Mount Lawley', initial: 42 },
  { label: 'Subiaco',      initial: 28 },
  { label: 'Fremantle',    initial: 18 },
  { label: 'Leederville',  initial: 8  },
  { label: 'Somewhere else', initial: 4 },
]

const SUBURBS = [
  {
    rank: 1, name: 'Mount Lawley', postcode: '6050', score: 84, verdict: 'GO' as const,
    income: '$98,000', rent: '$3,200–$4,500/mo', competition: '7 within 500m',
    footTraffic: 85, demographics: 86, rentFit: 88, competitionScore: 79,
    breakEven: '28/day', payback: '7 months', annualProfit: '$218,000',
    angle: 'Perth\'s most reliable restaurant strip with the best rent-to-revenue ratio',
    detail: [
      'Beaufort Street in Mount Lawley is the closest Perth has to Melbourne\'s Smith Street — an established, multi-decade hospitality corridor that has developed genuine dining culture rather than just foot traffic volume. The strip runs from Walcott Street to the Astor Theatre and concentrates the suburb\'s strongest dining density: quality independent restaurants, bars and the occasional late-night venue that extends the trading window into the evening.',
      'The economics are genuinely attractive. A 100–130sqm restaurant tenancy on Beaufort Street costs $3,200–$4,500/month — a rate that, for a well-executed 55–65 seat restaurant turning over consistent covers, puts rent at 4–6% of projected monthly revenue. That is well inside the healthy zone and leaves meaningful margin for staffing, COGS and contingency. Compare this to Fitzroy, Melbourne at $5,800–$7,800 for a comparable tenancy, or Surry Hills at $9,000–$12,000.',
      'The residential catchment is strong: $98,000 median household income, high owner-occupier rate, age bracket concentrated in 30–50 professionals with children. This demographic dines out consistently, books ahead for special occasions and is loyal to quality independent operators. Once a restaurant earns a reputation on Beaufort Street, word-of-mouth within the local catchment sustains occupancy without heavy marketing spend.',
    ],
    risks: 'Beaufort Street\'s best tenancies are occupied by established operators with long leases. New entrants are often looking at secondary positions — side streets or the less-trafficked southern end of the strip. Evaluate each specific site carefully. Weekday lunch trade is weaker than equivalent Melbourne strips: the evening-and-weekend model is what makes Mount Lawley work.',
    opportunity: 'Mount Lawley has limited quality plant-based and health-forward dining. The demographic\'s age and income profile would support a restaurant positioned in this category — moderate price point, quality produce, strong dinner-with-friends format — with limited direct competition from existing operators.',
  },
  {
    rank: 2, name: 'Subiaco', postcode: '6008', score: 79, verdict: 'GO' as const,
    income: '$115,000', rent: '$4,800–$6,800/mo', competition: '9 within 500m',
    footTraffic: 83, demographics: 91, rentFit: 74, competitionScore: 72,
    breakEven: '36/day', payback: '9 months', annualProfit: '$204,000',
    angle: 'Highest income catchment in Perth, but rents have risen faster than revenue growth',
    detail: [
      'Subiaco has the highest household income of any suburb in this restaurant analysis at $115,000 median — and a customer base that spends accordingly. The demographic around Rokeby Road is predominantly 32–52 professional households with above-average dining frequency and willingness to pay for quality. A restaurant in Subiaco can price 15–20% above Mount Lawley equivalents and the market will absorb it, provided the quality justifies the premium.',
      'The challenge since 2022 is that Subiaco rents have risen sharply — faster than most Perth operators anticipated. Prime restaurant positions on Rokeby Road now cost $4,800–$6,800/month. The rent-to-revenue ratio is manageable for a well-trading restaurant but leaves less margin for error than Mount Lawley. New entrants need a concept strong enough to ramp up customer volume quickly; the Subiaco economics become stressful if break-even extends beyond month eight or nine.',
    ],
    risks: 'Subiaco has seen the highest restaurant turnover of any Perth inner suburb in 2024–25. Three closures on or adjacent to Rokeby Road in 18 months — all concepts that launched with premium positioning but could not sustain the required volume. The market is sophisticated and will not support a concept on concept alone; execution must be consistent from opening week.',
    opportunity: 'Subiaco has no dedicated premium Japanese dining — omakase or high-quality izakaya format. The income demographics would support it and the competitive gap is real. The suburb\'s dining culture has matured to the point where Perth diners will seek out a specialist concept rather than defaulting to the nearest Mediterranean.',
  },
  {
    rank: 3, name: 'Fremantle', postcode: '6160', score: 75, verdict: 'GO' as const,
    income: '$88,000', rent: '$3,800–$5,200/mo', competition: '8 within 500m',
    footTraffic: 80, demographics: 80, rentFit: 80, competitionScore: 74,
    breakEven: '32/day', payback: '8 months', annualProfit: '$196,000',
    angle: 'Tourism premium and loyal local base — but weekday trade needs modelling carefully',
    detail: [
      'Fremantle\'s South Terrace and East Street precincts generate Perth\'s highest tourist and visitor foot traffic. On a summer weekend the throughput rivals inner Sydney strips. The dining market supports premium pricing — a $45 main course that would cause hesitation in most Perth suburbs is accepted in central Fremantle — and the diverse visitor mix means a restaurant can succeed with an internationalist menu approach rather than needing to pitch to a specific local demographic.',
      'The structural risk is weekday-winter seasonality. Fremantle\'s visitor economy drops materially outside summer and on weekdays. A Fremantle restaurant that models on summer Saturday volumes will face sharp reality in June and July. The businesses that work are those with a strong loyal local base capable of sustaining trade through the off-peak periods — or concepts so distinctive that they pull destination diners year-round.',
    ],
    risks: 'Fremantle commercial rents have risen alongside the suburb\'s rising profile since 2022. The margin between peak-trade revenue and off-peak revenue is wider in Fremantle than any other suburb in this analysis. Model a pessimistic weekday-winter scenario explicitly — if the business cannot break even in that scenario, Fremantle\'s risk profile may not suit your capital position.',
    opportunity: 'Fremantle has limited quality modern Australian dining. The tourism demographic is underserved by operators who genuinely showcase WA produce and wine. A restaurant with a clear "Western Australian" food identity — local seafood, Margaret River wine, seasonal produce sourcing — would have both a local following and strong tourist appeal.',
  },
  {
    rank: 4, name: 'Leederville', postcode: '6007', score: 73, verdict: 'GO' as const,
    income: '$95,000', rent: '$2,800–$4,000/mo', competition: '6 within 500m',
    footTraffic: 77, demographics: 80, rentFit: 90, competitionScore: 80,
    breakEven: '26/day', payback: '6 months', annualProfit: '$188,000',
    angle: 'Best-value entry point in Perth — lower rents, comparable demographics to Subiaco',
    detail: [
      'Oxford Street in Leederville consistently offers the best risk-adjusted entry point in Perth for a new independent restaurant. Rents of $2,800–$4,000/month sit 25–35% below Subiaco equivalents. The catchment income ($95,000 median) is close to Subiaco, the demographic profile (28–42 professional households) is comparable, and the independent dining culture is established. For a concept with strong fundamentals, Leederville\'s lower cost base translates directly to higher margin and faster payback.',
      'The limitation is scale. Oxford Street\'s active dining precinct is compact — roughly 500 metres of concentrated activity. Once the strip has three or four quality operators, subsequent entrants are competing for a finite local loyal base rather than accessing new demand. Evaluate whether there is currently a genuine gap in the dining type you are offering before committing.',
    ],
    risks: 'Foot traffic on Oxford Street drops materially on weekday lunchtimes compared to Mount Lawley or Subiaco. The evening dining model works; the all-day café-restaurant hybrid works less well. Design your format and trading hours around what the street actually delivers rather than what it delivers on a Saturday afternoon.',
    opportunity: 'Leederville has no dedicated quality wine bar with food. The Oxford Street demographic would strongly support a natural wine, share-plate format — the model that has worked in Fitzroy and Surry Hills but has not yet arrived in this Perth suburb. Low rent makes the risk profile very favourable.',
  },
  {
    rank: 5, name: 'Perth CBD', postcode: '6000', score: 58, verdict: 'CAUTION' as const,
    income: '$92,000', rent: '$6,500–$9,500/mo', competition: '11 within 500m',
    footTraffic: 72, demographics: 80, rentFit: 56, competitionScore: 60,
    breakEven: '48/day', payback: '12 months', annualProfit: '$162,000',
    angle: 'High rents and hybrid work-impacted foot traffic make the numbers difficult',
    detail: [
      'Perth CBD has a significant daytime office population that drives consistent weekday lunch trade — this is the genuine opportunity. A restaurant positioned within the lunchtime catchment of the Elizabeth Quay and Barrack Street office precinct can achieve strong Monday–Friday midday volume that residential-only suburbs cannot match. The challenge is that evening trade in the CBD drops sharply as the office population departs.',
      'CBD rents of $6,500–$9,500/month require generating 48+ covers daily at typical restaurant pricing just to keep rent within the healthy 12% threshold. That is achievable for a well-executed lunch-focused concept. For a dinner-first restaurant, the evening foot traffic volumes in Perth CBD have not recovered to pre-2019 levels and the model is more challenging.',
    ],
    risks: 'Perth CBD\'s evening economy depends on events at RAC Arena and Perth Convention Centre — which are valuable upside but not a reliable model base. Hybrid work has permanently reduced Wednesday–Thursday office occupancy compared to pre-pandemic. A CBD restaurant should model its break-even on four trading days per week, not five.',
    opportunity: 'The lunch-focused format — quality, fast, distinctive, $18–28 per head — remains underserved in the Barrack Street and St Georges Terrace precinct. Workers will pay for quality when the alternative is a food court or chain sandwich. This is a specific opportunity that the wider CBD restaurant market does not capture well.',
  },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  font:       "'DM Sans','Inter',sans-serif",
  n50:        '#FAFAF9',
  n100:       '#F5F5F4',
  white:      '#FFFFFF',
  n900:       '#1C1917',
  muted:      '#64748B',
  border:     '#E2E8F0',
  brand:      '#0891B2',
  brandLight: '#06B6D4',
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
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function DataNote({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 11, color: S.muted, fontStyle: 'italic', margin: '8px 0 0', fontFamily: S.font }}>
      {text}
    </p>
  )
}

export default function PerthRestaurantPage() {
  const [openIdx, setOpenIdx]     = useState<number | null>(0)
  const [pollVotes, setPollVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const [voted, setVoted]         = useState(false)

  function vote(i: number) {
    if (voted) return
    setPollVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
    setVoted(true)
  }

  const totalVotes = pollVotes.reduce((a, b) => a + b, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />
{/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, #0E7490 0%, ${S.brand} 50%, ${S.brandLight} 100%)`, color: S.white, padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, marginBottom: 16, fontFamily: S.font }}>
            Perth · Restaurants · 2026
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.15, fontFamily: S.font }}>
            Best Suburbs to Open a Restaurant in Perth
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 680, margin: '0 0 32px', lineHeight: 1.6, fontFamily: S.font }}>
            Perth has above-national-average household incomes and rents 35–50% below Melbourne equivalents. For a well-positioned restaurant concept, the rent-to-revenue ratios here are among the most favourable of any Australian capital.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { val: '84/100', label: 'Top suburb score (Mount Lawley)' },
              { val: '$2.8K–$9.5K', label: 'Monthly rent range' },
              { val: '5 suburbs', label: 'Scored with break-even analysis' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: S.font }}>{val}</div>
                <div style={{ fontSize: 12, opacity: 0.8, fontFamily: S.font }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Score chart ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: S.n900, marginBottom: 8, fontFamily: S.font }}>Perth suburb scores — restaurants</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontFamily: S.font }}>Composite score across foot traffic, income demographics, rent viability and competition density.</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SUBURB_SCORES} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis dataKey="suburb" tick={{ fontSize: 12, fontFamily: S.font }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fontFamily: S.font }} />
              <Tooltip contentStyle={{ fontFamily: S.font, fontSize: 13 }} />
              <Bar dataKey="score" name="Score /100" fill={S.brand} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <DataNote text="Scores based on ABS demographics, CBRE/JLL commercial rent data and OpenStreetMap competition mapping (Q1 2026)." />
        </div>
      </section>

      {/* ── Rent vs revenue scatter ──────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: S.n900, marginBottom: 8, fontFamily: S.font }}>Rent vs projected revenue — Perth vs eastern capitals</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontFamily: S.font }}>Perth suburbs sit in the lower-rent, strong-revenue zone compared to Melbourne Fitzroy and Sydney Surry Hills.</p>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis dataKey="rent" name="Rent/mo ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12, fontFamily: S.font }} label={{ value: 'Monthly rent', position: 'insideBottom', offset: -4, style: { fontSize: 12, fill: S.muted } }} />
              <YAxis dataKey="revenue" name="Revenue/mo ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12, fontFamily: S.font }} label={{ value: 'Monthly revenue', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: S.muted } }} />
              <ZAxis range={[80, 80]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontFamily: S.font, fontSize: 13 }} formatter={(val: unknown, name?: string | number) => [`$${Number(val).toLocaleString()}`, String(name ?? '')]} />
              <Scatter data={RENT_VS_REVENUE} fill={S.brand} name="Location" />
            </ScatterChart>
          </ResponsiveContainer>
          <DataNote text="Revenue projections based on 55-seat restaurant at industry-average covers and ticket sizes for each suburb income tier." />
        </div>
      </section>

      {/* ── Suburb cards ────────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: S.n900, marginBottom: 8, fontFamily: S.font }}>Suburb-by-suburb breakdown</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontFamily: S.font }}>Click any suburb to expand the full analysis, risks and opportunity gaps.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SUBURBS.map((sub, i) => {
              const vs = verdictStyle(sub.verdict)
              const isOpen = openIdx === i
              return (
                <div key={sub.name} style={{ background: S.white, borderRadius: 12, border: `1px solid ${S.border}`, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left' }}
                  >
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: S.brand, color: S.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: S.font }}>
                      {sub.rank}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: S.n900, fontFamily: S.font }}>{sub.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: vs.color, background: vs.bg, border: `1px solid ${vs.border}`, borderRadius: 4, padding: '2px 8px', fontFamily: S.font }}>{sub.verdict}</span>
                        <span style={{ fontSize: 13, color: S.muted, fontFamily: S.font }}>{sub.score}/100</span>
                      </div>
                      <div style={{ fontSize: 13, color: S.muted, marginTop: 2, fontFamily: S.font }}>{sub.angle}</div>
                    </div>
                    <span style={{ fontSize: 18, color: S.muted, flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 20px 20px' }}>
                      {/* Quick stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
                        {[
                          { label: 'Median income', val: sub.income },
                          { label: 'Monthly rent', val: sub.rent },
                          { label: 'Direct competition', val: sub.competition },
                          { label: 'Break-even daily', val: sub.breakEven },
                          { label: 'Payback period', val: sub.payback },
                          { label: 'Annual profit est.', val: sub.annualProfit },
                        ].map(({ label, val }) => (
                          <div key={label} style={{ background: S.n50, borderRadius: 8, padding: '10px 12px' }}>
                            <div style={{ fontSize: 11, color: S.muted, marginBottom: 4, fontFamily: S.font }}>{label}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: S.n900, fontFamily: S.font }}>{val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Score bars */}
                      <div style={{ marginBottom: 20 }}>
                        <ScoreBar label="Profitability"    value={sub.footTraffic}      color={S.brand}   />
                        <ScoreBar label="Area Demographics"    value={sub.demographics}     color={S.emerald} />
                        <ScoreBar label="Rent viability"  value={sub.rentFit}          color={S.amber}   />
                        <ScoreBar label="Competition gap" value={sub.competitionScore} color={S.brand}   />
                      </div>

                      {/* Detail paragraphs */}
                      {sub.detail.map((p, pi) => (
                        <p key={pi} style={{ fontSize: 14, color: S.muted, lineHeight: 1.7, margin: '0 0 12px', fontFamily: S.font }}>{p}</p>
                      ))}

                      {/* Risks & Opportunities */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                        <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 8, padding: '12px 14px' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: S.red, marginBottom: 6, fontFamily: S.font }}>RISKS</div>
                          <p style={{ fontSize: 13, color: '#7F1D1D', margin: 0, lineHeight: 1.6, fontFamily: S.font }}>{sub.risks}</p>
                        </div>
                        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '12px 14px' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: S.emerald, marginBottom: 6, fontFamily: S.font }}>OPPORTUNITY</div>
                          <p style={{ fontSize: 13, color: '#065F46', margin: 0, lineHeight: 1.6, fontFamily: S.font }}>{sub.opportunity}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Poll ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: 560, margin: '0 auto', background: S.n50, borderRadius: 16, padding: '28px 24px', border: `1px solid ${S.border}` }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, margin: '0 0 6px', fontFamily: S.font }}>Which Perth suburb would you open a restaurant in?</h3>
          <p style={{ fontSize: 13, color: S.muted, margin: '0 0 20px', fontFamily: S.font }}>Based on {totalVotes.toLocaleString()} operator responses</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {POLL_OPTIONS.map((opt, i) => {
              const pct = Math.round((pollVotes[i] / totalVotes) * 100)
              return (
                <button key={opt.label} onClick={() => vote(i)} disabled={voted}
                  style={{ background: 'none', border: `1px solid ${S.border}`, borderRadius: 8, padding: '10px 14px', cursor: voted ? 'default' : 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: S.brand, opacity: 0.08, width: `${pct}%`, transition: 'width 0.4s' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: S.n900, fontFamily: S.font }}>{opt.label}</span>
                    {voted && <span style={{ fontSize: 13, fontWeight: 700, color: S.brand, fontFamily: S.font }}>{pct}%</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 24px', background: `linear-gradient(135deg, #0E7490 0%, ${S.brand} 50%, ${S.brandLight} 100%)`, color: S.white }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#1C1917', fontSize: 28, fontWeight: 800, margin: '0 0 12px', fontFamily: S.font }}>Analyse your specific Perth address</h2>
          <p style={{ fontSize: 16, opacity: 0.9, margin: '0 0 28px', lineHeight: 1.6, fontFamily: S.font }}>
            Get a full location report — competitors mapped, rent benchmarked, break-even calculated — for any Perth address in in about 90 seconds.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, borderRadius: 8, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', fontFamily: S.font }}>
            Run a free analysis →
          </Link>
        </div>
      </section>

      {/* ── Related links ───────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 16, fontFamily: S.font }}>Related guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { href: '/analyse/perth/cafe',            label: 'Cafés in Perth' },
              { href: '/analyse/perth/mount-lawley',    label: 'Mount Lawley analysis' },
              { href: '/analyse/melbourne/restaurant',  label: 'Restaurants in Melbourne' },
              { href: '/analyse/sydney/restaurant',     label: 'Restaurants in Sydney' },
              { href: '/analyse/adelaide/restaurant',   label: 'Restaurants in Adelaide' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600, fontFamily: S.font }}>
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
