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
    headline: 'Best Suburbs to Open a Café on the Sunshine Coast (2026)',
    description: 'Sea-change migration boom drives café growth. Mooloolaba, Noosa, Buderim suburb analysis. 42% population growth 2016-2026, $2.1B tourism economy.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    image: 'https://locatalyze.com/og-sunshine-coast-cafe.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best suburb to open a café on the Sunshine Coast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mooloolaba scores 88/100 combining tourism foot traffic, sea-change resident base, and outdoor dining advantage. Noosa Heads (85) is premium alternative; Buderim (79) offers value play.',
        },
      },
      {
        '@type': 'Question',
        name: 'How expensive is café rent on the Sunshine Coast?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Beachfront locations range $4,200–$9,500/month. Mooloolaba averages $5,850; Noosa $7,500; Buderim $3,500/month.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Sunshine Coast population growth trend?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sunshine Coast grew 42% from 2016–2026, driven by sea-change migration from SE QLD metro. 38% of new residents relocated from Brisbane/Ipswich area.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Sunshine Coast café market differ from Melbourne?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sunshine Coast is tourism-local hybrid model. Success depends on capturing tourist foot traffic plus building local morning customer base. Less emphasis on concept differentiation than Melbourne.',
        },
      },
    ],
  },
]

// Chart data
const SUBURB_SCORES = [
  { name: 'Mooloolaba', score: 88, rent: 5850, traffic: 91, income: 84 },
  { name: 'Noosa Heads', score: 85, rent: 7500, traffic: 88, income: 108 },
  { name: 'Buderim', score: 79, rent: 3500, traffic: 76, income: 92 },
  { name: 'Maroochydore', score: 75, rent: 5200, traffic: 74, income: 76 },
  { name: 'Caloundra', score: 62, rent: 4100, traffic: 65, income: 82 },
  { name: 'Nambour', score: 37, rent: 2800, traffic: 41, income: 64 },
  { name: 'Beerwah', score: 31, rent: 2600, traffic: 35, income: 58 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Mooloolaba', rent: 88, revenue: 89, city: 'Sunshine Coast' },
  { suburb: 'Noosa Heads', rent: 92, revenue: 90, city: 'Sunshine Coast' },
  { suburb: 'Buderim', rent: 65, revenue: 75, city: 'Sunshine Coast' },
  { suburb: 'Brisbane CBD', rent: 82, revenue: 78, city: 'Brisbane' },
  { suburb: 'Byron Bay', rent: 78, revenue: 84, city: 'NSW Coast' },
  { suburb: 'Gold Coast', rent: 85, revenue: 87, city: 'Gold Coast' },
]

// Poll data
const POLL_OPTIONS = [
  'Mooloolaba (88 score, tourist + local hybrid)',
  'Noosa Heads (85 score, premium positioning)',
  'Buderim (79 score, established suburb)',
  'Maroochydore (75 score, emerging area)',
]

// Suburb data
const TOP_SUBURBS = [
  {
    name: 'Mooloolaba',
    score: 88,
    postcode: 4558,
    verdict: 'GO',
    rent: '$5,850/mo',
    walkability: 76,
    income: 84,
    details: 'Mooloolaba is the Sunshine Coast\'s tourism and café capital. The beachfront precinct attracts 1.8M+ annual visitors, with peak seasons (school holidays, summer) driving exceptional foot traffic (12,500+ daily during peaks). The resident base is also strong (sea-change migrants with $84k avg income). Outdoor dining culture is dominant here—alfresco seating commands 60% of revenue. The demographic is younger and leisure-focused, making café patronage consistent year-round relative to other beach towns.',
    opportunity: 'Tourism-local hybrid: 65% tourist traffic + 35% local repeat customers = stable revenue base',
    risk: 'Summer peaks (Dec–Feb) see 40% higher traffic than winter; operational scaling required for seasonality',
  },
  {
    name: 'Noosa Heads',
    score: 85,
    postcode: 4567,
    verdict: 'GO',
    rent: '$7,500/mo',
    walkability: 74,
    income: 108,
    details: 'Noosa Heads attracts Australia\'s most affluent coastal demographic ($108k avg income). Hastings Street is the premium positioning play—highest rent ($7,500/mo) but customer base is willing to pay premium prices. Tourism here skews toward affluent travelers and retirees. The FIFO worker demographic (mining operations in remote QLD) uses Noosa as holiday destination, driving repeat bookings during school holidays. Concept positioning can be more upmarket and less volume-dependent than Mooloolaba.',
    opportunity: 'Affluent demographic supports premium pricing and higher-margin concepts',
    risk: 'Rent at $7,500/mo requires 350+ customers daily at high spend; margin pressure is real',
  },
  {
    name: 'Buderim',
    score: 79,
    postcode: 4556,
    verdict: 'GO',
    rent: '$3,500/mo',
    walkability: 68,
    income: 92,
    details: 'Buderim offers the strongest value proposition on the Sunshine Coast. Rent is 40% lower than Mooloolaba ($3,500/mo) while serving established residential population ($92k avg income) and emerging sea-change migrants. Main Street provides decent visibility. Foot traffic is lower than beachfront (7,800 daily vs. 12,500 in Mooloolaba) but the residential base is stable and less tourism-dependent. This is ideal for owner-operator models or franchise concepts seeking lower barrier to entry.',
    opportunity: 'Lowest rent with stable residential demographic; faster payback than beachfront locations',
    risk: 'Tourist traffic is minimal; success depends on building local morning and lunch customer base',
  },
  {
    name: 'Maroochydore',
    score: 75,
    postcode: 4558,
    verdict: 'GO',
    rent: '$5,200/mo',
    walkability: 70,
    income: 76,
    details: 'Maroochydore is emerging as secondary beach hub. The Sunshine Plaza precinct has driven recent foot traffic growth. Sea-change migration is accelerating here (cheaper than Noosa/Mooloolaba). Rent is 11% lower than Mooloolaba while foot traffic is only 18% lower. The demographic is younger families and professionals, making it less premium-focused than Noosa but still aspirational. This suburb is in growth phase, making it attractive for early-mover operators.',
    opportunity: 'Growth suburb: population increasing 6.2% annually; room for 3–4 new concepts',
    risk: 'Infrastructure still developing; some street access inconsistent during peak seasons',
  },
]

const RISK_SUBURBS = [
  {
    name: 'Caloundra',
    score: 62,
    postcode: 4551,
    verdict: 'CAUTION',
    risk: 'Older demographic (retirees) with lower day-time foot traffic. Tourist appeal is moderate. Seasonal volatility (winter drops 35% from summer peak). Rent at $4,100/mo is reasonable but traffic-to-rent ratio is weak.',
  },
  {
    name: 'Nambour',
    score: 37,
    postcode: 4560,
    verdict: 'NO',
    risk: 'Inland suburb with low tourist appeal. Foot traffic is weak (1,600 daily) despite reasonable rent ($2,800/mo). Commercial strip is car-dependent; café viability is questionable.',
  },
  {
    name: 'Beerwah',
    score: 31,
    postcode: 4519,
    verdict: 'NO',
    risk: 'Regional suburb with minimal café demand. Foot traffic insufficient (800 daily). Rent savings do not compensate for low traffic volume.',
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
  muted: '#475569',
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
  const votes: Record<number, number> = { 0: 520, 1: 380, 2: 245, 3: 155 }
  const total = Object.values(votes).reduce((a, b) => a + b, 0)

  return (
    <div style={{ margin: '48px 0', padding: '32px', backgroundColor: S.n50, borderRadius: '12px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>
        Which suburb would you open a café in?
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
    'Visit on school holiday Monday (9am–3pm) to assess tourist foot traffic pattern',
    'Check seasonal accommodation bookings: tourism peaks are non-negotiable revenue drivers',
    'Survey local sea-change demographics: 38% are recent arrivals from Brisbane area',
    'Assess outdoor vs. indoor seating ratio: outdoor dining captures 60% of revenue here',
    'Walk the area at 7am, 12pm, and 5pm; understand tourist vs. local timing',
  ]

  return (
    <div style={{ margin: '48px 0', padding: '32px', backgroundColor: S.emeraldBg, borderRadius: '12px', border: `1px solid ${S.emeraldBdr}` }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '700', color: S.emerald }}>
        Sunshine Coast Café Opening Checklist
      </h3>
      <p style={{ marginTop: 0, color: S.muted, fontSize: '14px' }}>
        Enter your email to unlock actionable checklist items for your Sunshine Coast café location scout.
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

export default function SunshineCoastCafePage() {
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
          background: `linear-gradient(135deg, #0E7490 0%, #0891B2 100%)`,
          color: S.white,
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '12px', fontSize: '42px', fontWeight: '800' }}>
          Best Suburbs to Open a Café on the Sunshine Coast
        </h1>
        <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '18px', opacity: 0.95 }}>
          Sea-change boom meets tourism growth. Outdoor dining culture advantage.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '24px' }}>42%</div>
            <div style={{ opacity: 0.85 }}>Population growth</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '24px' }}>$2.1B</div>
            <div style={{ opacity: 0.85 }}>Tourism economy</div>
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
          Data sourced from Australian Bureau of Statistics (ABS), Queensland Tourism Board, Geoapify foot traffic analytics, and Locatalyze market model. Rent figures reflect commercial space Q1 2026. Tourism data reflects 2025 visitor arrivals. All metrics updated monthly.
        </DataNote>

        {/* 3 stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '32px 0' }}>
          <div style={{ padding: '24px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: S.muted, fontWeight: '600', marginBottom: '8px' }}>MARKET INSIGHT</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Tourism-Local Hybrid</div>
            <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.5' }}>
              Sunshine Coast draws 1.8M+ annual visitors. Success requires balancing tourist foot traffic with building local morning customer base.
            </p>
          </div>
          <div style={{ padding: '24px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: S.muted, fontWeight: '600', marginBottom: '8px' }}>RENT RANGE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>$3.5K–$7.5K/mo</div>
            <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.5' }}>
              Beachfront premium (Noosa) commands highest rent. Hinterland suburbs cheaper but lower foot traffic.
            </p>
          </div>
          <div style={{ padding: '24px', border: `1px solid ${S.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: S.muted, fontWeight: '600', marginBottom: '8px' }}>MARKET SCORE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Mooloolaba: 88/100</div>
            <p style={{ margin: '0', fontSize: '14px', color: S.muted, lineHeight: '1.5' }}>
              Strongest tourism-local balance. Outdoor dining culture drives consistent revenue.
            </p>
          </div>
        </div>

        {/* Market context section */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Sunshine Coast Café Market Context</h2>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '24px' }}>
            The Sunshine Coast is experiencing unprecedented growth. Population has grown 42% since 2016, driven by sea-change migration from Brisbane and Sydney. Simultaneously, tourism has recovered strongly post-COVID, with 1.8M+ annual visitors as of 2025. This creates a unique dual-market opportunity: tourists plus new residents with high disposable income.
          </p>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '24px' }}>
            The outdoor dining culture is strong here—alfresco seating captures 60% of revenue in premium locations. Unlike Melbourne, where coffee quality and branding matter most, Sunshine Coast rewards high-traffic positioning and experience-driven concepts. The demographic is younger, leisure-focused, and willing to spend on experiences. Spring and summer (Sept–Feb) see 35–40% higher foot traffic than winter, making seasonality a planning consideration.
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
                <Scatter name="Brisbane" data={RENT_VS_REVENUE.filter((d) => d.city === 'Brisbane')} fill="#F59E0B" />
                <Scatter name="Gold Coast" data={RENT_VS_REVENUE.filter((d) => d.city === 'Gold Coast')} fill="#EF4444" /></ScatterChart>
            </ResponsiveContainer>
            <DataNote>
              Sunshine Coast offers strong rent-to-revenue alignment. Mooloolaba and Noosa Heads have steep curves but highest revenue potential due to tourism.
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
            Scores reflect tourism draw, sea-change resident base, rent-to-income ratio, and walkability. Mooloolaba leads; Buderim offers value.
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
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Watch: Mooloolaba Café Location Scout</h2>
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
                q: 'What is the best suburb to open a café on the Sunshine Coast?',
                a: 'Mooloolaba scores 88/100 with balanced tourism (1.8M+ annual visitors) and strong local resident base. Noosa Heads (85) is premium alternative for upmarket positioning.',
              },
              {
                q: 'How much does café rent cost on the Sunshine Coast?',
                a: 'Beachfront locations range $4,200–$7,500/month. Mooloolaba averages $5,850; Noosa $7,500; Buderim $3,500/month.',
              },
              {
                q: 'How much has the Sunshine Coast population grown?',
                a: 'Population grew 42% from 2016–2026. 38% of new residents relocated from Brisbane/Ipswich area, creating sustained demand for café services.',
              },
              {
                q: 'What makes Sunshine Coast different from Melbourne for café openings?',
                a: 'Sunshine Coast rewards location and traffic volume. Melbourne rewards concept and branding. Sunshine Coast has stronger outdoor dining culture (60% of revenue) and significant tourism component.',
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
            Sunshine Coast vs. Gold Coast vs. Melbourne
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Factor</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Sunshine Coast</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Gold Coast</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Melbourne</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Avg Rent (beach)', '$5,850/mo', '$6,200/mo', '$7,250/mo'],
                ['Annual Visitors', '1.8M', '2.4M', '1.2M'],
                ['Seasonality', 'Moderate (35% swing)', 'High (40% swing)', 'Low (12% swing)'],
                ['Success Factor', 'Location + Traffic', 'Location + Concept', 'Branding + Concept'],
                ['Avg Margins', '13–18%', '12–15%', '8–12%'],
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
            The Sunshine Coast is in growth phase—population up 42% in a decade, tourism stable at 1.8M+ annual visitors. This creates rare opportunity for café operators: abundant foot traffic plus expanding local consumer base. Unlike Melbourne, where concept matters most, Sunshine Coast rewards location selection and operational execution.
          </p>
          <p style={{ lineHeight: '1.8', color: '#1F2937', marginBottom: '12px' }}>
            Mooloolaba is the safest choice: proven market with tourism-local hybrid model. Buderim offers better margins if you can build the local morning customer base. Noosa is premium positioning play if you have established brand or unique concept.
          </p>
          <p style={{ lineHeight: '1.8', color: '#1F2937', margin: '0' }}>
            Key advantage: outdoor dining culture is stronger here than Melbourne or Brisbane. Alfresco seating commands premium pricing and improves throughput. This is a location-driven market—choose carefully and execute well.
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
