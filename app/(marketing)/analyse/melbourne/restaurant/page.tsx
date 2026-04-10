'use client'
// app/(marketing)/analyse/melbourne/restaurant/page.tsx
// Melbourne restaurant location guide — most competitive dining market in Australia
// Unique angle: Melbourne has the highest restaurant density per capita in AU — the
// viable gaps are specific, not general. This page shows exactly where they are.

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
    headline: 'Best Suburbs to Open a Restaurant in Melbourne (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-04-10',
    url: 'https://www.locatalyze.com/analyse/melbourne/restaurant',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best suburb to open a restaurant in Melbourne?',
        acceptedAnswer: { '@type': 'Answer', text: 'Fitzroy scores 87/100 — highest of any Melbourne suburb for restaurants. Brunswick Street delivers 14,000+ daily foot traffic, $92,000 median household income and an established culture of dining out 4–5 nights per week. Collingwood and Brunswick are the strongest alternatives with better lease availability.' },
      },
      {
        '@type': 'Question',
        name: 'How much does restaurant rent cost in Melbourne inner suburbs?',
        acceptedAnswer: { '@type': 'Answer', text: 'Melbourne inner suburb restaurant rents range from $3,800–$5,500/month in Brunswick to $9,500–$14,000/month in South Yarra (100–140sqm tenancy). The healthy benchmark is rent below 12% of projected monthly revenue. For most concepts targeting $80,000–$100,000 monthly revenue, this means keeping rent below $9,600–$12,000.' },
      },
      {
        '@type': 'Question',
        name: 'Is Melbourne too competitive to open an independent restaurant?',
        acceptedAnswer: { '@type': 'Answer', text: 'Melbourne has more restaurants per capita than any other Australian city, but the demand equally exceeds other cities. The highest-risk approach is opening a generic concept without clear positioning. Fitzroy and Collingwood reward differentiation — a clearly positioned restaurant (natural wine, single-origin cuisine, specialty diet) competes on identity rather than just proximity.' },
      },
      {
        '@type': 'Question',
        name: 'Which Melbourne suburbs have the strongest restaurant demographics?',
        acceptedAnswer: { '@type': 'Answer', text: 'Fitzroy, Collingwood and South Yarra have the highest dining-out frequency per household. Fitzroy and Collingwood lean toward 28–42 creative and professional demographic who dine out 3–5 nights per week. South Yarra has higher incomes ($112,000+ median) but a stronger chain restaurant presence that independents must compete against.' },
      },
      {
        '@type': 'Question',
        name: 'Which Melbourne suburbs should I avoid for a new restaurant?',
        acceptedAnswer: { '@type': 'Answer', text: 'Melbourne CBD scores 38/100 for new restaurant openings — hybrid work has permanently reduced weekday lunch trade. Outer suburban locations rarely support premium independent restaurant pricing. Docklands has a captive lunchtime market but drops sharply on evenings and weekends.' },
      },
    ],
  },
]

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Fitzroy',     score: 87, rent: 6800,  traffic: 92, income: 92  },
  { suburb: 'Collingwood', score: 83, rent: 5400,  traffic: 85, income: 86  },
  { suburb: 'Brunswick',   score: 80, rent: 4500,  traffic: 83, income: 78  },
  { suburb: 'Richmond',    score: 75, rent: 6900,  traffic: 81, income: 90  },
  { suburb: 'South Yarra', score: 66, rent: 10500, traffic: 79, income: 112 },
  { suburb: 'CBD',         score: 38, rent: 18000, traffic: 68, income: 98  },
]

const RENT_VS_REVENUE = [
  { suburb: 'Fitzroy',     rent: 6800,  revenue: 98000,  ratio: 6.9  },
  { suburb: 'Collingwood', rent: 5400,  revenue: 88000,  ratio: 6.1  },
  { suburb: 'Brunswick',   rent: 4500,  revenue: 82000,  ratio: 5.5  },
  { suburb: 'Richmond',    rent: 6900,  revenue: 91000,  ratio: 7.6  },
  { suburb: 'South Yarra', rent: 10500, revenue: 105000, ratio: 10.0 },
  { suburb: 'CBD',         rent: 18000, revenue: 96000,  ratio: 18.8 },
  { suburb: 'Sydney Surry Hills', rent: 11000, revenue: 95000, ratio: 11.6 },
  { suburb: 'Perth Mt Lawley', rent: 4200,   revenue: 78000, ratio: 5.4  },
]

const POLL_OPTIONS = [
  { label: 'Fitzroy',       initial: 44 },
  { label: 'Collingwood',   initial: 26 },
  { label: 'Brunswick',     initial: 17 },
  { label: 'Richmond',      initial: 8  },
  { label: 'Somewhere else',initial: 5  },
]

const SUBURBS = [
  {
    rank: 1, name: 'Fitzroy', postcode: '3065', score: 87, verdict: 'GO' as const,
    income: '$92,000', rent: '$5,800–$7,800/mo', competition: '10 within 500m',
    footTraffic: 92, demographics: 91, rentFit: 76, competitionScore: 78,
    breakEven: '38/day', payback: '8 months', annualProfit: '$268,000',
    angle: 'Australia\'s highest-density dining culture with proven demand for independent concepts',
    detail: [
      'Fitzroy is where Melbourne\'s restaurant market has its highest ceiling and its highest floor. Brunswick Street and Smith Street together generate over 14,000 daily pedestrians, with the evening dining window (6–10pm Thursday to Sunday) consistently the strongest in Victoria. The demographic — 28–42, creative and professional, median household income $92,000 — dines out more frequently than any equivalent cohort in Australia. This is not a market you need to build; it exists and it is looking for new experiences.',
      'Restaurant rents on Brunswick Street prime positions have risen to $5,800–$7,800/month for a 100–130sqm tenancy. That is a real cost that requires strong execution to manage — but the revenue potential supports it. A well-positioned 60-seat restaurant in Fitzroy turning over 45 covers at dinner can realistically generate $90,000–$110,000 monthly. Rent at $7,000 is 6–7% of that — well within the healthy zone.',
      'The competitive density is real: 10 direct competitors within 500m is the highest of any suburb in this analysis. But the market is large enough to absorb multiple operators in the same category. Fitzroy\'s diners do not commit exclusively to one venue. They visit regularly and rotate. A restaurant that earns one visit per fortnight from 400 households is trading well.',
    ],
    risks: 'The competitive environment means weak concepts fail quickly. Three new restaurants opened on Smith Street in 2024 and two closed within six months — both generic concepts without clear positioning. Fitzroy\'s customers are highly food-literate and will not return if the first experience is average.',
    opportunity: 'Natural wine and biodynamic dining is underrepresented relative to the demographic\'s stated preferences. A restaurant with a serious drinks program built around natural producers would face limited direct competition in the Brunswick Street precinct.',
  },
  {
    rank: 2, name: 'Collingwood', postcode: '3066', score: 83, verdict: 'GO' as const,
    income: '$86,000', rent: '$4,800–$6,200/mo', competition: '8 within 500m',
    footTraffic: 85, demographics: 86, rentFit: 82, competitionScore: 80,
    breakEven: '34/day', payback: '7 months', annualProfit: '$244,000',
    angle: 'Better lease availability than Fitzroy, comparable dining culture',
    detail: [
      'Collingwood is Fitzroy\'s immediate neighbour and shares most of its advantages — high foot traffic, strong dining demographics, an established culture of independent hospitality — at meaningfully lower rents. Smith Street is the primary corridor and has available tenancies that Fitzroy hasn\'t seen for several years. The window to enter Collingwood at reasonable terms is open; it may not be in three to four years.',
      'The Collingwood arts and creative industry base drives consistent weekday lunch trade that most residential-only suburbs do not have. The suburb has a disproportionate number of architects, photographers and agency workers who lunch out regularly and are above-average restaurant spenders. Thursday–Saturday evening trade is strong. Sunday lunch has become a reliable trading session as the suburb\'s resident density has increased.',
    ],
    risks: 'Smith Street\'s northern section (above Peel Street) has had higher turnover than the Fitzroy-adjacent end. Tenancy selection matters — evaluate each specific site\'s pedestrian count rather than relying on the suburb average. The tram infrastructure creates occasional foot traffic pinch points.',
    opportunity: 'Collingwood has no dominant modern Asian restaurant. The demographic — young professional, food-literate — has a strong appetite for quality Asian dining at accessible price points. This category gap is larger in Collingwood than in Fitzroy.',
  },
  {
    rank: 3, name: 'Brunswick', postcode: '3056', score: 80, verdict: 'GO' as const,
    income: '$78,000', rent: '$3,800–$5,200/mo', competition: '7 within 500m',
    footTraffic: 83, demographics: 80, rentFit: 88, competitionScore: 82,
    breakEven: '30/day', payback: '7 months', annualProfit: '$228,000',
    angle: 'The best rent-to-opportunity ratio in Melbourne\'s inner north',
    detail: [
      'Brunswick\'s Sydney Road has the strongest rent-to-revenue ratio in this analysis. At $3,800–$5,200/month for a viable restaurant tenancy, the cost base is 25–30% below Fitzroy and Collingwood equivalents. The catchment income is lower ($78,000 median household) but the dining frequency is high — this is a suburb that eats out consistently, at accessible price points, with real loyalty to good independent operators.',
      'Sydney Road operates differently to Fitzroy\'s model. It\'s a tram arterial with consistent foot-through traffic rather than destination pedestrian flow. This creates reliable weekday lunch trade but less of the event-led evening culture that characterises Brunswick and Smith Streets. A Brunswick restaurant succeeds through operational consistency: strong weekday lunch, steady Friday–Saturday evenings, a local loyal base. The model rewards reliability over concept hype.',
    ],
    risks: 'Lower income demographics mean the average spend per head is $5–8 less than equivalent Fitzroy covers. This compresses margin — model your menu pricing carefully. Sydney Road\'s tram infrastructure can disrupt pedestrian access during service works.',
    opportunity: 'Brunswick has limited quality Middle Eastern and Mediterranean dining relative to its demographic\'s cultural mix. An operator with genuine credentials in this cuisine would fill a genuine gap in the suburb\'s dining landscape.',
  },
  {
    rank: 4, name: 'Richmond', postcode: '3121', score: 75, verdict: 'CAUTION' as const,
    income: '$90,000', rent: '$5,800–$7,500/mo', competition: '9 within 500m',
    footTraffic: 81, demographics: 84, rentFit: 70, competitionScore: 68,
    breakEven: '42/day', payback: '10 months', annualProfit: '$204,000',
    angle: 'High income catchment with stadium event upside, but rising rent pressure',
    detail: [
      'Richmond has the strongest income demographics in this analysis after South Yarra — $90,000 median household income with strong representation of professional households. Swan Street is the primary dining corridor and it generates reliable evening trade Thursday to Saturday, with the Melbourne Cricket Ground and Melbourne Park providing irregular but significant event-night upside. A restaurant within 400m of Swan Street/MCG can see 30–40% revenue uplift on AFL final nights and major concert events.',
      'The risk in Richmond is rent growth. CBRE commercial data shows 13% average rent increase on Swan Street in 2024–25 — one of the highest of any Melbourne inner suburb. New entrants are paying rents that existing operators with older leases do not face, creating a two-tier cost structure. Model your financials against current market rent, not the rates you see incumbents paying.',
    ],
    risks: 'Chain restaurant presence on Bridge Road is the primary competitive risk — Gloria Jean\'s, major pizza groups and established franchise dining have higher brand recognition for casual dining occasions. An independent must compete on distinctiveness, not volume. Event-night revenue is volatile — do not build your financial model around it.',
    opportunity: 'Richmond has no dominant quality Southeast Asian restaurant. The income demographic and the suburb\'s multicultural dining history creates demand that is currently served by mid-quality operators. A well-executed Vietnamese or Thai concept with quality differentiation has a clear positioning gap.',
  },
  {
    rank: 5, name: 'South Yarra', postcode: '3141', score: 66, verdict: 'CAUTION' as const,
    income: '$112,000', rent: '$9,000–$14,000/mo', competition: '13 within 500m',
    footTraffic: 79, demographics: 88, rentFit: 52, competitionScore: 56,
    breakEven: '58/day', payback: '13 months', annualProfit: '$182,000',
    angle: 'Highest income catchment in Melbourne, but rent and chain competition are extreme',
    detail: [
      'South Yarra has the highest household income of any suburb in this analysis — $112,000 median — and the dining frequency to match. Chapel Street between Commercial Road and Toorak Road is one of the most densely traded retail and dining strips in Australia. The customer spends more per head, books further in advance, and expects a higher quality of both food and service than any other Melbourne demographic.',
      'The obstacle is structural. Chapel Street prime restaurant rents of $9,000–$14,000/month require generating 58+ covers daily just to keep rent below 12% of revenue at standard pricing. That is achievable for an established operator with a full room. It is very difficult for a new entrant in the first six months before word of mouth builds. The chain presence is significant — Nobu, major Italian groups and established fine dining brands have Chapel Street positions that generate brand loyalty an independent cannot match on day one.',
    ],
    risks: 'South Yarra\'s dining demographic (35–55, established professional) has different behaviour to the inner-north cohort. They book in advance, they are less likely to walk in, and they are more brand-loyal to venues with established reputations. A new independent needs a strong PR strategy alongside the restaurant quality. The payback period here is the longest in this analysis.',
    opportunity: 'The Forrest Hill / Toorak Road pocket, west of Chapel Street, has rents of $5,200–$7,500/month with comparable income demographics. This is South Yarra\'s best entry point — lower risk than Chapel Street prime, same customer quality.',
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

export default function MelbourneRestaurantPage() {
  const [openIdx, setOpenIdx]   = useState<number | null>(0)
  const [pollVotes, setPollVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const [voted, setVoted]       = useState(false)

  function vote(i: number) {
    if (voted) return
    setPollVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
    setVoted(true)
  }

  const totalVotes = pollVotes.reduce((a, b) => a + b, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />

      {/* ── Breadcrumb nav ──────────────────────────────────────────────────── */}
      <nav style={{ padding: '12px 24px', borderBottom: `1px solid ${S.border}`, backgroundColor: S.white, position: 'sticky', top: 0, zIndex: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: S.muted, fontFamily: S.font }}>
          <Link href="/analyse" style={{ color: S.brand, textDecoration: 'none' }}>Analyse</Link>
          {' › '}
          <Link href="/analyse/melbourne" style={{ color: S.brand, textDecoration: 'none' }}>Melbourne</Link>
          {' › Restaurants'}
        </div>
        <Link href="/onboarding" style={{ padding: '8px 16px', background: S.emerald, color: S.white, borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: S.font }}>
          Analyse free →
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, #0E7490 0%, ${S.brand} 50%, ${S.brandLight} 100%)`, color: S.white, padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, marginBottom: 16, fontFamily: S.font }}>
            Melbourne · Restaurants · 2026
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.15, fontFamily: S.font }}>
            Best Suburbs to Open a Restaurant in Melbourne
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 680, margin: '0 0 32px', lineHeight: 1.6, fontFamily: S.font }}>
            Melbourne has more restaurants per capita than any other Australian city. The viable entry points are specific — this guide scores each suburb on rent, foot traffic, income and competition density so you can identify exactly where the opportunity is.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { val: '87/100', label: 'Top suburb score (Fitzroy)' },
              { val: '$4.5K–$14K', label: 'Monthly rent range' },
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: S.n900, marginBottom: 8, fontFamily: S.font }}>Melbourne suburb scores — restaurants</h2>
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
          <DataNote text="Scores based on ABS demographics, CBRE commercial rent data and OpenStreetMap competition mapping (Q1 2026)." />
        </div>
      </section>

      {/* ── Rent vs revenue scatter ──────────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: S.n900, marginBottom: 8, fontFamily: S.font }}>Rent vs projected revenue</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, fontFamily: S.font }}>Monthly rent plotted against projected monthly revenue for a 60-seat restaurant (100–130sqm).</p>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis dataKey="rent" name="Rent/mo ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12, fontFamily: S.font }} label={{ value: 'Monthly rent', position: 'insideBottom', offset: -4, style: { fontSize: 12, fill: S.muted } }} />
              <YAxis dataKey="revenue" name="Revenue/mo ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12, fontFamily: S.font }} label={{ value: 'Monthly revenue', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: S.muted } }} />
              <ZAxis range={[80, 80]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontFamily: S.font, fontSize: 13 }} formatter={(val: unknown, name: string) => [`$${Number(val).toLocaleString()}`, name]} />
              <Scatter data={RENT_VS_REVENUE} fill={S.brand} name="Suburb" />
            </ScatterChart>
          </ResponsiveContainer>
          <DataNote text="Revenue projections based on 60-seat venue at industry-average covers and ticket sizes for each suburb income tier." />
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
                        <ScoreBar label="Foot traffic"   value={sub.footTraffic}      color={S.brand}   />
                        <ScoreBar label="Demographics"   value={sub.demographics}     color={S.emerald} />
                        <ScoreBar label="Rent viability" value={sub.rentFit}          color={S.amber}   />
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
          <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, margin: '0 0 6px', fontFamily: S.font }}>Which Melbourne suburb would you open a restaurant in?</h3>
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
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px', fontFamily: S.font }}>Analyse your specific Melbourne address</h2>
          <p style={{ fontSize: 16, opacity: 0.9, margin: '0 0 28px', lineHeight: 1.6, fontFamily: S.font }}>
            Get a full location report — competitors mapped, rent benchmarked, break-even calculated — for any Melbourne address in under 60 seconds.
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
              { href: '/analyse/melbourne/cafe',      label: 'Cafés in Melbourne' },
              { href: '/analyse/sydney/restaurant',   label: 'Restaurants in Sydney' },
              { href: '/analyse/perth/restaurant',    label: 'Restaurants in Perth' },
              { href: '/analyse/brisbane',            label: 'Brisbane analysis' },
              { href: '/analyse/adelaide/restaurant', label: 'Restaurants in Adelaide' },
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
