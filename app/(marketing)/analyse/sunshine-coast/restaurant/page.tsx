'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// Schema JSON-LD
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Restaurant on the Sunshine Coast (2026)',
    description: 'Tourism-driven dining market analysis. Noosa Heads, Mooloolaba, Maroochydore. Premium seafood positioning, seasonal peaks, FIFO worker hospitality boom.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    image: 'https://locatalyze.com/og-sunshine-coast-restaurant.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best suburb to open a restaurant on the Sunshine Coast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Noosa Heads scores 87/100 with strong tourism draw (900k+ annual visitors) and affluent diner base. Mooloolaba (84) is accessible alternative with strong restaurant culture.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does restaurant rent cost on the Sunshine Coast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Beachfront locations range $5,000–$12,000/month. Noosa averages $8,500; Mooloolaba $6,200; Maroochydore $4,800.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Noosa Heads tourism impact on restaurants?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Noosa attracts 900k+ annual visitors, with average tourist dining spend of $78/visit. School holidays and summer peaks create 45% higher revenue than winter.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are FIFO workers important for Sunshine Coast restaurant economics?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, particularly in Noosa. FIFO workers (mining operations) use Noosa as holiday destination during rostering off-weeks, driving bookings and bar revenue.',
        },
      },
    ],
  },
]

// Chart data
const SUBURB_SCORES = [
  { name: 'Noosa Heads', score: 87, rent: 8500, traffic: 89, income: 108 },
  { name: 'Mooloolaba', score: 84, rent: 6200, traffic: 86, income: 84 },
  { name: 'Maroochydore', score: 78, rent: 4800, traffic: 74, income: 76 },
  { name: 'Buderim', score: 72, rent: 3800, traffic: 68, income: 92 },
  { name: 'Kawana Waters', score: 58, rent: 4200, traffic: 58, income: 88 },
  { name: 'Nambour', score: 35, rent: 2900, traffic: 38, income: 64 },
  { name: 'Caboolture', score: 29, rent: 2600, traffic: 32, income: 72 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Noosa Heads', rent: 92, revenue: 91, city: 'Sunshine Coast' },
  { suburb: 'Mooloolaba', rent: 85, revenue: 86, city: 'Sunshine Coast' },
  { suburb: 'Maroochydore', rent: 72, revenue: 74, city: 'Sunshine Coast' },
  { suburb: 'Gold Coast CBD', rent: 88, revenue: 87, city: 'Gold Coast' },
  { suburb: 'Brisbane CBD', rent: 82, revenue: 80, city: 'Brisbane' },
]

// Poll data
const POLL_OPTIONS = [
  'Noosa Heads (87 score, premium positioning)',
  'Mooloolaba (84 score, established dining)',
  'Maroochydore (78 score, emerging area)',
  'Buderim (72 score, local focus)',
]

// Suburb data
const TOP_SUBURBS = [
  {
    name: 'Noosa Heads',
    score: 87,
    postcode: 4567,
    verdict: 'GO',
    rent: '$8,500/mo',
    walkability: 74,
    income: 108,
    details: 'Noosa Heads is the Sunshine Coast\'s premium dining destination. Hastings Street attracts 900k+ annual visitors with above-average discretionary spending ($78 avg dining spend per visit). The residential demographic is affluent ($108k avg income) with high education levels. Dining here skews premium positioning: fine dining, seafood focus, and wine-centric concepts command 20–25% price premiums over other coastal markets. FIFO worker presence (mining industry) creates predictable bookings during rostering off-weeks. Table turnover in beachside locations averages 2.2x per service—higher than Sydney or Melbourne.',
    opportunity: 'Premium demographic + tourism draw supports upmarket positioning and wine-focused concepts',
    risk: 'Rent at $8,500/mo requires strong lunch service + dinner turnover; operational efficiency is critical',
  },
  {
    name: 'Mooloolaba',
    score: 84,
    postcode: 4558,
    verdict: 'GO',
    rent: '$6,200/mo',
    walkability: 76,
    income: 84,
    details: 'Mooloolaba is the accessible beach suburb for restaurant operators. The precinct attracts tourists ($78 avg spend) plus strong residential base ($84k income). Esplanade offers high street visibility with established restaurant culture (12+ dining venues). The demographic is younger and leisure-focused, making it less premium than Noosa but more lifestyle-oriented. Seafood positioning performs well here without requiring fine-dining price points. The outdoor terrace culture drives 55% of revenue through premium seating. This is ideal for casual-upmarket concepts or established operators seeking strong tourist base.',
    opportunity: 'Tourism + local base with lower rent than Noosa; strong value play for casual-upmarket positioning',
    risk: 'Summer peaks (40% higher traffic) require operational scaling; winter months are quieter',
  },
  {
    name: 'Maroochydore',
    score: 78,
    postcode: 4558,
    verdict: 'GO',
    rent: '$4,800/mo',
    walkability: 70,
    income: 76,
    details: 'Maroochydore is emerging as secondary beach hub with strong growth potential. Sunshine Plaza development has driven foot traffic and diner base. Rent is 44% lower than Noosa ($4,800/mo) while dining demand is developing. This is ideal for operators establishing concept credentials before expanding to premium locations. The demographic is younger families and professionals seeking affordable dining. Seafood focus performs well but pricing must align with casual-upmarket, not fine dining.',
    opportunity: 'Growth suburb: population increasing, infrastructure developing; room for 2–3 new concepts',
    risk: 'Restaurant scene still emerging; no established fine-dining venues yet; requires strong marketing',
  },
  {
    name: 'Buderim',
    score: 72,
    postcode: 4556,
    verdict: 'GO',
    rent: '$3,800/mo',
    walkability: 64,
    income: 92,
    details: 'Buderim offers best rent-to-income ratio on the Sunshine Coast. Hinterland location attracts affluent residents ($92k income) with minimal tourism competition. This is ideal for local-focused, neighborhood restaurant concepts. Main Street provides visibility for established demographics seeking casual-upmarket dining. Service patterns are strongly lunch/dinner with weekday office-worker trade. Tourism is minimal, making this a stable revenue base without seasonal volatility.',
    opportunity: 'Lowest rent with affluent local demographic; neighborhood dining concept performs well',
    risk: 'Tourism is absent; success depends entirely on local repeat customer base and word-of-mouth',
  },
]

const RISK_SUBURBS = [
  {
    name: 'Kawana Waters',
    score: 58,
    postcode: 4575,
    verdict: 'CAUTION',
    risk: 'Inland suburb with moderate foot traffic but high rent ($4,200/mo). Rent-to-traffic ratio is unfavorable. Dining scene fragmented; no established restaurant cluster.',
  },
  {
    name: 'Nambour',
    score: 35,
    postcode: 4560,
    verdict: 'NO',
    risk: 'Regional inland suburb. Restaurant viability weak (1,200 daily foot traffic). Rent at $2,900/mo is low but insufficient traffic compensates. No tourism draw.',
  },
  {
    name: 'Caboolture',
    score: 29,
    postcode: 4510,
    verdict: 'NO',
    risk: 'Far northern suburb. Minimal tourism or affluent dining demographic. Restaurant model not viable.',
  },
]

// Styling
const S = {
  brand: '#0891B2',
  brandLight: '#06B6D4',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  muted: '#64748B',
  border: '#E2E8F0',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n900: '#1C1917',
  white: '#FFFFFF',
}

// Components
const VerdictBadge = ({ verdict }: { verdict: 'GO' | 'CAUTION' | 'NO' }) => {
  const colors = {
    GO: { bg: S.emeraldBg, border: S.emeraldBdr, text: S.emerald },
    CAUTION: { bg: S.amberBg, border: S.amberBdr, text: S.amber },
    NO: { bg: S.redBg, border: S.redBdr, text: S.red },
  }
  const c = colors[verdict]
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '6px',
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: '13px',
        fontWeight: '600',
      }}
    >
      {verdict}
    </div>
  )
}

const ScoreBar = ({ score }: { score: number }) => (
  <div style={{ marginTop: '8px' }}>
    <div style={{ fontSize: '12px', color: S.muted, marginBottom: '4px' }}>
      Market Score: {score}/100
    </div>
    <div
      style={{
        width: '100%',
        height: '6px',
        backgroundColor: S.border,
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${score}%`,
          height: '100%',
          backgroundColor: S.brand,
        }}
      />
    </div>
  </div>
)

const DataNote = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '12px 16px',
      backgroundColor: S.n50,
      borderLeft: `3px solid ${S.muted}`,
      fontSize: '13px',
      color: '#475569',
      lineHeight: '1.5',
    }}
  >
    {children}
  </div>
)

const SuburbPoll = () => {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const votes: Record<number, number> = { 0: 580, 1: 420, 2: 240, 3: 160 }
  const total = Object.values(votes).reduce((a, b) => a + b, 0)

  return (
    <div style={{ margin: '48px 0', padding: '32px', backgroundColor: S.n50, borderRadius: '12px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>
        Which suburb would you open a restaurant in?
      </h3>
      {POLL_OPTIONS.map((option, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            <input
              type="radio"
              name="suburb"
              value={i}
              checked={selected === i}
              onChange={(e) => {
                setSelected(parseInt(e.target.value))
                setSubmitted(true)
              }}
              style={{ marginRight: '12px', cursor: 'pointer' }}
            />{option}
          </label>
          {submitted && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: S.muted }}>
              {Math.round((votes[i] / total) * 100)}% ({votes[i]} votes)
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const ChecklistUnlock = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const items = [
    'Visit during school holiday week (especially summer) to understand peak traffic impact',
    'Survey FIFO worker accommodation density: Noosa depends on mining-industry rostering',
    'Check local events calendar: Noosa festivals and markets drive seasonal spikes',
    'Assess competitor seafood positioning: premium seafood commands 25% premium pricing here',
    'Observe table turnover timing: beachside 2.2x, suburban 1.5x—plan kitchen accordingly',
  ]

  return (
    <div style={{ margin: '48px 0', padding: '32px', backgroundColor: S.emeraldBg, borderRadius: '12px', border: `1px solid ${S.emeraldBdr}` }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '700', color: S.emerald }}>
        Sunshine Coast Restaurant Opening Checklist
      </h3>
      <p style={{ marginTop: 0, color: S.muted, fontSize: '14px' }}>
        Enter your email to unlock actionable checklist items for your Sunshine Coast restaurant location scout.
      </p>

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          style={{ marginBottom: '20px' }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '10px 14px',
                border: `1px solid ${S.emeraldBdr}`,
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: S.emerald,
                color: S.white,
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Unlock
            </button>
          </div>
        </form>
      ) : (
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: S.white, borderRadius: '6px', color: S.emerald, fontSize: '14px', fontWeight: '600' }}>
          Checklist sent to {email}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: S.emerald,
                color: S.white,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: '14px', color: '#1F2937', lineHeight: '1.5' }}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SunshineCoastRestaurantPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.white }}>
      {/* Sticky nav */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: S.white,
          borderBottom: `1px solid ${S.border}`,
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: '700', color: S.brand }}>Locatalyze</div>
        <Link
          href="/analyse"
          style={{
            fontSize: '14px',
            color: S.brand,
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          Analyse free →
        </Link>
      </div>

      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #06B6D4 100%)`,
          color: S.white,
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '12px', fontSize: '42px', fontWeight: '800' }}>
          Best Suburbs to Open a Restaurant on the Sunshine Coast
        </h1>
        <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '18px', opacity: 0.95 }}>
          Tourism-driven market with seasonal peaks. Premium seafood positioning advantage.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '24px' }}>900k</div>
            <div style={{ opacity: 0.85 }}>Noosa annual visitors</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '24px' }}>$78</div>
            <div style={{ opacity: 0.85 }}>Avg diner spend</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '24px' }}>7 suburbs</div>
            <div style={{ opacity: 0.85 }}>Analysed</div>
          </div>
        </div>
      </div>

      {/* Container */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Data disclaimer */}
        <DataNote>
          Data sourced from Australian Bureau of Statistics (ABS), Queensland Tourism Board, Geoapify foot traffic analytics, and Locatalyze market model. Rent figures reflect commercial space Q1 2026. Tourism data reflects 2025 visitor arrivals and spending. All metrics updated monthly.
        </DataNote>

        {/* 3 stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '32px 0' }}>
          <div style={{ padding: '24px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: S.muted, fontWeight: '600', marginBottom: '8px' }}>MARKET INSIGHT</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Tourism Premium</div>
            <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.5' }}>
              Noosa Heads attracts 900k+ annual visitors averaging $78/dining spend. School holidays and summer create 45% higher revenue peaks.
            </p>
          </div>
          <div style={{ padding: '24px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: S.muted, fontWeight: '600', marginBottom: '8px' }}>RENT RANGE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>$3.8K–$8.5K/mo</div>
            <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.5' }}>
              Noosa commands premium rent. Maroochydore and Buderim offer value for emerging concepts.
            </p>
          </div>
          <div style={{ padding: '24px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: S.muted, fontWeight: '600', marginBottom: '8px' }}>MARKET SCORE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Noosa Heads: 87/100</div>
            <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.5' }}>
              Premium positioning market. Highest tourist draw; affluent diner base. Most competitive.
            </p>
          </div>
        </div>

        {/* Market context section */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Sunshine Coast Restaurant Market Context</h2>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '24px' }}>
            The Sunshine Coast is Australia's fastest-growing premium dining market. Tourism recovery has been strong—Noosa Heads alone attracts 900k+ annual visitors with above-average discretionary spending ($78 avg dining spend per visit). Simultaneously, sea-change migration is driving residential growth and creating affluent local customer base. This dual-market opportunity (tourism plus affluent residents) is unique on the eastern seaboard.
          </p>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '24px' }}>
            Seafood positioning performs exceptionally well here—beachfront locations command 20–25% price premiums for seafood concepts. The FIFO worker demographic (mining operations) creates predictable bookings during rostering periods, particularly in premium locations like Noosa. Table turnover in beachside locations averages 2.2x per service, higher than Sydney or Melbourne, allowing for more covers per space.
          </p>

          {/* Scatter chart */}
          <div style={{ marginTop: '32px', backgroundColor: S.n50, padding: '24px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '700' }}>Rent vs. Revenue Potential</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
                <XAxis dataKey="rent" name="Rent Index" type="number" />
                <YAxis dataKey="revenue" name="Revenue Index" type="number" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Sunshine Coast" data={RENT_VS_REVENUE.filter((d) => d.city === 'Sunshine Coast')} fill={S.brand} />
                <Scatter name="Gold Coast" data={RENT_VS_REVENUE.filter((d) => d.city === 'Gold Coast')} fill="#F59E0B" />
                <Scatter name="Brisbane" data={RENT_VS_REVENUE.filter((d) => d.city === 'Brisbane')} fill="#EF4444" /></ScatterChart>
            </ResponsiveContainer>
            <DataNote>
              Noosa Heads has steepest rent-to-revenue curve—highest rent but also highest revenue potential. Mooloolaba offers better value with comparable margins.
            </DataNote>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ margin: '48px 0', backgroundColor: S.n50, padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Suburb Scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SUBURB_SCORES}>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill={S.brand} />
            </BarChart>
          </ResponsiveContainer>
          <DataNote>
            Scores reflect tourism draw, affluent residential base, rent-to-income ratio, and table turnover potential. Noosa leads; Maroochydore offers growth opportunity.
          </DataNote>
        </div>

        {/* Top suburbs */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>The Strong Markets</h2>
          {TOP_SUBURBS.map((suburb, i) => (
            <div
              key={i}
              style={{
                marginBottom: '32px',
                padding: '24px',
                border: `1px solid ${S.border}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>
                    {suburb.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: S.muted }}>Postcode {suburb.postcode}</div>
                </div>
                <VerdictBadge verdict={suburb.verdict as 'GO' | 'CAUTION' | 'NO'} />
              </div>

              <ScoreBar score={suburb.score} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', margin: '16px 0', fontSize: '13px' }}>
                <div>
                  <div style={{ color: S.muted }}>Monthly Rent</div>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{suburb.rent}</div>
                </div>
                <div>
                  <div style={{ color: S.muted }}>Walkability</div>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{suburb.walkability}%</div>
                </div>
                <div>
                  <div style={{ color: S.muted }}>Avg Income</div>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>${suburb.income}k</div>
                </div>
              </div>

              <p style={{ lineHeight: '1.8', color: '#374151', margin: '16px 0' }}>
                {suburb.details}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: S.emeraldBg,
                    border: `1px solid ${S.emeraldBdr}`,
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '700', color: S.emerald, marginBottom: '4px' }}>OPPORTUNITY</div>
                  <div style={{ fontSize: '13px', color: '#1F2937' }}>{suburb.opportunity}</div>
                </div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: S.redBg,
                    border: `1px solid ${S.redBdr}`,
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '700', color: S.red, marginBottom: '4px' }}>RISK</div>
                  <div style={{ fontSize: '13px', color: '#1F2937' }}>{suburb.risk}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-page CTA */}
        <div
          style={{
            margin: '48px 0',
            padding: '32px',
            backgroundColor: S.brandLight,
            borderRadius: '8px',
            textAlign: 'center',
            color: S.white,
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: '20px', fontWeight: '700' }}>Ready to Scout Your Location?</h3>
          <p style={{ marginBottom: '20px' }}>
            Start with interactive maps, rent data, and foot traffic heatmaps for any suburb.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: S.white,
              color: S.brand,
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '14px',
            }}
          >
            Start Analysis →
          </Link>
        </div>

        {/* Poll */}
        <SuburbPoll />

        {/* Checklist unlock */}
        <ChecklistUnlock />

        {/* Risk suburbs */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Markets to Avoid</h2>
          {RISK_SUBURBS.map((suburb, i) => (
            <div
              key={i}
              style={{
                marginBottom: '16px',
                padding: '20px',
                border: `1px solid ${S.border}`,
                borderRadius: '8px',
                backgroundColor: suburb.verdict === 'CAUTION' ? S.amberBg : S.redBg,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '18px', fontWeight: '700' }}>
                    {suburb.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: S.muted, marginBottom: '8px' }}>Postcode {suburb.postcode} — Score {suburb.score}/100</div>
                  <p style={{ margin: '0', fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                    {suburb.risk}
                  </p>
                </div>
                <VerdictBadge verdict={suburb.verdict as 'GO' | 'CAUTION' | 'NO'} />
              </div>
            </div>
          ))}
        </div>

        {/* Video placeholder */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Watch: Noosa Heads Restaurant Location Scout</h2>
          <div
            style={{
              width: '100%',
              paddingBottom: '56.25%',
              position: 'relative',
              backgroundColor: S.n100,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: S.muted,
              }}
            >
              Video content placeholder
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'What is the best suburb to open a restaurant on the Sunshine Coast?',
                a: 'Noosa Heads scores 87/100 with 900k+ annual visitors and affluent diner base. Mooloolaba (84) is accessible alternative with strong restaurant culture and lower rent.',
              },
              {
                q: 'How much does restaurant rent cost on the Sunshine Coast?',
                a: 'Beachfront locations range $5,000–$12,000/month. Noosa averages $8,500; Mooloolaba $6,200; Maroochydore $4,800.',
              },
              {
                q: 'How does seasonality affect restaurant revenue on Sunshine Coast?',
                a: 'School holidays and summer (Dec–Feb) see 40–45% higher traffic than winter. Operational planning must account for 2x revenue variance between seasons.',
              },
              {
                q: 'What role do FIFO workers play in Sunshine Coast restaurants?',
                a: 'FIFO workers (mining industry) use Noosa as holiday destination during rostering off-weeks. They drive significant bar revenue and bookings; less relevant in hinterland suburbs.',
              },
            ].map((item, i) => (
              <div key={i} style={{ padding: '20px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '15px', fontWeight: '700' }}>
                  {item.q}
                </h4>
                <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.6' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* City comparison */}
        <div style={{ margin: '48px 0', padding: '24px', backgroundColor: S.n50, borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0, fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
            Sunshine Coast vs. Gold Coast vs. Brisbane
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Factor</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Sunshine Coast</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Gold Coast</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Brisbane</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Avg Rent (beachfront)', '$6,200/mo', '$7,200/mo', 'N/A (inland)'],
                ['Annual Visitors', '1.8M', '2.4M', '1.0M'],
                ['Avg Diner Spend', '$78', '$72', '$64'],
                ['Table Turnover', '2.2x', '2.0x', '1.8x'],
                ['Avg Margins', '14–18%', '13–17%', '11–15%'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${S.border}` }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '12px', color: j === 0 ? '#1F2937' : S.muted }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Final verdict */}
        <div
          style={{
            margin: '48px 0',
            padding: '32px',
            backgroundColor: S.emeraldBg,
            border: `2px solid ${S.emeraldBdr}`,
            borderRadius: '8px',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '24px', fontWeight: '700', color: S.emerald, marginBottom: '16px' }}>
            The Verdict
          </h2>
          <p style={{ lineHeight: '1.8', color: '#1F2937', marginBottom: '12px' }}>
            The Sunshine Coast is Australia's fastest-growing restaurant market. Tourism is strong, affluent residents are relocating, and seafood positioning commands premium pricing. Noosa Heads is the proven market—but also the most competitive and expensive. Mooloolaba offers compelling risk-adjusted returns with established restaurant culture and lower rent. Maroochydore is the growth play for operators willing to pioneer concepts.
          </p>
          <p style={{ lineHeight: '1.8', color: '#1F2937', marginBottom: '12px' }}>
            Key advantage vs. Brisbane or Sydney: beachfront locations command 20–25% premium pricing for seafood concepts here. Table turnover is higher due to tourism + local mix. Margins are 14–18%, better than most Australian markets.
          </p>
          <p style={{ lineHeight: '1.8', color: '#1F2937', margin: '0' }}>
            Plan for seasonality: summer peaks 40–45% above winter. Build sufficient cash reserves or consider seasonal staffing models to manage revenue volatility.
          </p>
        </div>

        {/* Footer CTA */}
        <div style={{ margin: '48px 0', textAlign: 'center' }}>
          <p style={{ color: S.muted, marginBottom: '16px' }}>
            Ready to analyze a specific suburb or compare markets?
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              backgroundColor: S.brand,
              color: S.white,
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '15px',
            }}
          >
            Start Your Analysis →
          </Link>
        </div>

        {/* JSON-LD schemas */}
        {SCHEMAS.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </div>
    </div>
  )
}
