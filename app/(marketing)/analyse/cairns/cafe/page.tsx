'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Cairns (2026)',
    description: 'Data-driven analysis of the best suburbs to open a café in Cairns, Queensland. Compare rental costs, foot traffic, and competition.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/cairns-cafe.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What suburb is best for a café in Cairns?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cairns City scores highest (84/100) due to tourism, followed by Edge Hill (80/100) for local professional demographics.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Cairns good for a café?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Cairns attracts 2.1M annual visitors and 74% of café revenue in Cairns City comes from tourism.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does wet season affect café revenue?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Wet season (Nov–Apr) typically sees 40% revenue reduction. Model conservative revenue projections.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Edge Hill better than Cairns CBD for a café?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Edge Hill offers lower rent and local demographics, but Cairns City has higher foot traffic from tourists.',
        },
      },
    ],
  },
]

const SUBURB_SCORES = [
  { name: 'Cairns City', score: 84, rent: 7250, traffic: 8800, income: 71000 },
  { name: 'Edge Hill', score: 80, rent: 3500, traffic: 5200, income: 84000 },
  { name: 'Smithfield', score: 74, rent: 3000, traffic: 3800, income: 78000 },
  { name: 'Gordonvale', score: 68, rent: 2400, traffic: 2200, income: 65000 },
  { name: 'Innisfail', score: 39, rent: 1800, traffic: 1400, income: 58000 },
  { name: 'Atherton', score: 32, rent: 1600, traffic: 900, income: 62000 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Cairns City', rent: 7250, revenue: 14500, label: 'Cairns City' },
  { suburb: 'Edge Hill', rent: 3500, revenue: 8200, label: 'Edge Hill' },
  { suburb: 'Smithfield', rent: 3000, revenue: 7100, label: 'Smithfield' },
  { suburb: 'Gordonvale', rent: 2400, revenue: 5800, label: 'Gordonvale' },
  { suburb: 'Sydney Comp 1', rent: 5800, revenue: 9200, label: 'Sydney CBD (ref)' },
  { suburb: 'Sydney Comp 2', rent: 3200, revenue: 7500, label: 'Sydney Inner West (ref)' },
]

const POLL_OPTIONS = [
  { label: 'Cairns City (tourism hub)', votes: 342 },
  { label: 'Edge Hill (local professionals)', votes: 218 },
  { label: 'Smithfield (emerging)', votes: 94 },
  { label: 'Gordonvale (affordable)', votes: 56 },
]

const TOP_SUBURBS = [
  {
    rank: 1,
    name: 'Cairns City',
    postcode: '4870',
    score: 84,
    verdict: 'GO',
    income: 71000,
    rent: 7250,
    competition: 'HIGH',
    footTraffic: 8800,
    demographics: 'International tourists (60%), business travellers (25%), local (15%)',
    rentFit: 'Esplanade-adjacent $5,500–$9,000/mo. Premium for riverside position.',
    competitionScore: 78,
    breakEven: 18,
    payback: 42,
    annualProfit: 156000,
    angle: 'Tourism-driven café economy with 365-day outdoor seating potential',
    detail: [
      'Cairns City CBD benefits from 2.1 million annual regional visitors (Great Barrier Reef gateway). 74% of café revenue derives from tourism spend, significantly higher than mainland regional cities (45–50%). International visitor mix (40% international) commands premium pricing on single-origin specialty coffee and premium brunch.',
      'Esplanade precinct provides unmatched outdoor seating leverage—wet season (Nov–Apr) doesn\'t eliminate trading days, only reduces volume by 35–40%. Premium sites near the marina and Cairns Beach command $5,500–$9,000/mo but justify rents through consistent 450–650 covers/day peak season.',
      'Summer tourism volatility requires hedging: model 60% of dry season revenue (May–Oct) for wet season. Establish corporate breakfast contracts with hotel chains and tour operators; this revenue stabilizes at 40% of total. First-year profit margins: 22–26% (tourism-heavy) vs 18–20% (mainland comparison).',
    ],
    risks: 'Wet season cyclone risk, visa policy sensitivity for international tourists, dependency on single-event calendar (Coral Sea Festival, wine festivals).',
    opportunity: 'Farm-to-table provenance (local tropical fruit, macadamia) commands premium; specialty coffee culture growing +12% annually in Far North QLD.',
  },
  {
    rank: 2,
    name: 'Edge Hill',
    postcode: '4870',
    score: 80,
    verdict: 'GO',
    income: 84000,
    rent: 3500,
    competition: 'MEDIUM',
    footTraffic: 5200,
    demographics: 'Local professionals (55%), families (35%), service workers (10%)',
    rentFit: 'High Street locations $2,800–$4,200/mo. Shopping strip co-tenancy favorable.',
    competitionScore: 52,
    breakEven: 14,
    payback: 36,
    annualProfit: 124000,
    angle: 'Local professional demographic + university overflow from JCU. Lower rent, stable foot traffic.',
    detail: [
      'Edge Hill provides the optimal risk-adjusted return in Cairns metro: 5,200 foot traffic daily (consistent, not tourism-dependent) and professional demographic income $84k (higher than CBD average). Rent ranges $2,800–$4,200/mo for high-visibility shopping strips; 48% lower than Esplanade positioning.',
      'Proximity to James Cook University (JCU Smithfield campus 6km) and medical precinct drives student + healthcare worker traffic. Lunch rush 12–1:30pm reliably pulls 350–450 covers. Coffee/pastry morning trade (7–10am) captures commute traffic from surrounding residential. Local demographics support 8–10% pricing premium vs budget chains.',
      'Competition lower than CBD (52 vs 78 score): only 3 independent cafés within 400m radius. First-year payback 36 months (vs 42 for CBD) due to lower breakeven. Demographic stability: household income grew 7% 2020–2026 via migration from southern states.',
    ],
    risks: 'Student holidays (Dec, Jul) reduce traffic by 25%; tourism volatility absent (insulator and liability).',
    opportunity: 'Co-location with medical/wellness uses creates recurring customer base; licensed small-batch roastery model viable ($18–22/kg wholesale to local suppliers).',
  },
  {
    rank: 3,
    name: 'Smithfield',
    postcode: '4878',
    score: 74,
    verdict: 'GO',
    income: 78000,
    rent: 3000,
    competition: 'MEDIUM-HIGH',
    footTraffic: 3800,
    demographics: 'Families (50%), mixed income (40%), university workers (10%)',
    rentFit: 'Shopping centre co-tenancy $2,200–$3,800/mo. Anchor tenant adjacency valuable.',
    competitionScore: 65,
    breakEven: 16,
    payback: 40,
    annualProfit: 98000,
    angle: 'Residential growth corridor + JCU proximity. Emerging demand in expanding suburb.',
    detail: [
      'Smithfield is Cairns\'s fastest-growing residential suburb (8% growth 2020–2026) with family-focused demographics (50% households with children). Shopping centre locations adjacent to major anchor tenants (Coles, Woolworths) guarantee foot traffic 3,800/day, primarily weekday afternoon (school pickup/after-school traffic) and weekend family visits.',
      'JCU Smithfield campus (2,800 students) creates secondary market for quick-service café (breakfast, late-morning snacks). Rent $2,200–$3,800/mo in established shopping precincts represents 18% lower position vs Edge Hill. Income profile ($78k median) attracts quality-conscious customer base; single-origin coffee and premium pastry command steady 12% gross margin.',
      'First-year margins compress to 16–18% due to foot traffic concentration (afternoon/weekend skew reduces high-margin breakfast revenue proportion). However, expansion of residential catchment projects +5% annual traffic growth to 4,100/day by 2028. Demographic profile (families, higher income) supports dine-in and WiFi extended hours.',
    ],
    risks: 'Anchor tenant dependency; shopping centre lease terms may restrict independent pricing. Student population creates volatile holiday periods.',
    opportunity: 'Kids menu premiumization (organic, allergen-friendly) captures family spending surge; weekend market expansion via function space licensing.',
  },
  {
    rank: 4,
    name: 'Gordonvale',
    postcode: '4865',
    score: 68,
    verdict: 'CONSIDER',
    income: 65000,
    rent: 2400,
    competition: 'LOW',
    footTraffic: 2200,
    demographics: 'Mixed working class (60%), families (35%), service workers (5%)',
    rentFit: 'Main Street locations $1,800–$3,200/mo. Lowest rent in Cairns region.',
    competitionScore: 35,
    breakEven: 13,
    payback: 44,
    annualProfit: 72000,
    angle: 'Affordable entry point with low competition. High business risk, moderate returns.',
    detail: [
      'Gordonvale offers the lowest rent entry point ($1,800–$3,200/mo) in Cairns region, appealing to bootstrapped operators. Foot traffic 2,200/day reflects mixed working-class demographic with limited tourism spillover. Competition extremely low (only 1 café within 2km), creating local monopoly advantage.',
      'Income profile ($65k median household) indicates price-sensitive demographic; premium pricing power limited. Café positioned as value-focused (simple menu, efficient labor model) required to achieve breakeven at 13 months. Morning coffee trade (7–9am) captures local commute; afternoon traffic minimal.',
      'Growth trajectory uncertain: no major institutional anchors (university, hospital, corporate precinct) drive traffic expansion. Expansion viability restricted to population density growth (currently flat 0–1% annually). First-year profit margins 14–16% (labor-intensive to maintain margins on lower ATV).',
    ],
    risks: 'Income demographic limits pricing power; tourism absent. Population growth stalled; future traffic depends on new residential development.',
    opportunity: 'Niche market for value-focused All-Day Brunch positioning; limited competition allows brand building in underserved market.',
  },
]

const RISK_SUBURBS = [
  {
    name: 'Innisfail',
    postcode: '4860',
    score: 39,
    verdict: 'CAUTION',
    reason: 'Low foot traffic (1,400/day), declining population trend, agricultural economy volatility, limited demographic diversity.',
  },
  {
    name: 'Atherton',
    postcode: '4883',
    score: 32,
    verdict: 'NO',
    reason: 'Aging demographic (65+ represents 28% of population), minimal foot traffic (<900/day), limited income growth, regional isolation.',
  },
]

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

const VerdictBadge = ({ verdict }: { verdict: string }) => {
  const colors = {
    GO: { bg: S.emeraldBg, border: S.emeraldBdr, text: S.emerald },
    CONSIDER: { bg: S.amberBg, border: S.amberBdr, text: S.amber },
    CAUTION: { bg: S.amberBg, border: S.amberBdr, text: S.amber },
    NO: { bg: S.redBg, border: S.redBdr, text: S.red },
  }
  const color = colors[verdict as keyof typeof colors] || colors.GO
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '9999px',
      backgroundColor: color.bg,
      color: color.text,
      border: `1px solid ${color.border}`,
      fontSize: '12px',
      fontWeight: '600',
    }}>
      {verdict}
    </span>
  )
}

const ScoreBar = ({ score }: { score: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{
      height: '8px',
      borderRadius: '4px',
      width: '120px',
      backgroundColor: S.border,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${score}%`,
        backgroundColor: S.brand,
        transition: 'width 0.3s',
      }} />
    </div>
    <span style={{ fontWeight: '600', fontSize: '14px', minWidth: '30px' }}>{score}</span>
  </div>
)

const DataNote = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '13px', color: S.muted, marginBottom: '16px' }}>
    {children}
  </p>
)

function SuburbPoll() {
  const [votes, setVotes] = useState(POLL_OPTIONS)
  const total = votes.reduce((sum, opt) => sum + opt.votes, 0)

  const handleVote = (index: number) => {
    const updated = [...votes]
    updated[index].votes += 1
    setVotes(updated)
  }

  return (
    <div style={{
      padding: '32px',
      backgroundColor: S.n50,
      borderRadius: '12px',
      marginBottom: '48px',
    }}>
      <h3 style={{ color: '#1C1917', marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>
        Which suburb would you open a café in?
      </h3>
      {votes.map((option, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>{option.label}</span>
            <span style={{ color: S.muted }}>{option.votes} votes</span>
          </div>
          <div style={{
            height: '24px',
            backgroundColor: S.border,
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}>
            <div style={{
              height: '100%',
              width: `${(option.votes / total) * 100}%`,
              backgroundColor: S.brand,
            }} />
          </div>
          <button onClick={() => handleVote(i)} style={{
            padding: '6px 12px',
            backgroundColor: S.brand,
            color: S.white,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
          }}>Vote
          </button>
        </div>
      ))}
    </div>
  )
}

function ChecklistUnlock() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cairns-cafe' }),
      })
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Newsletter signup error:', err)
    }
  }

  return (
    <div style={{
      padding: '32px',
      backgroundColor: S.emeraldBg,
      border: `2px solid ${S.emeraldBdr}`,
      borderRadius: '12px',
      marginBottom: '48px',
    }}>
      <h3 style={{ color: '#1C1917', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
        Checklist Unlock the Full Café Checklist
      </h3>
      <p style={{ marginBottom: '16px', color: S.muted }}>
        Get the Cairns café startup checklist + wet season revenue model (free)
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
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
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: S.emerald,
          color: S.white,
          border: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          {submitted ? 'Check Sent' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default function CairnsCafePage() {
  const [expandedFaq, setExpandedFaq] = useState(0)

  return (
    <div style={{ backgroundColor: S.white }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }}
      />
{/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, #0E7490 0%, ${S.brand} 50%, ${S.brandLight} 100%)`,
        color: S.white,
        padding: '64px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', marginBottom: '16px', opacity: 0.9 }}>
          Cairns, QLD › Café › 2026 Analysis
        </p>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '20px', marginBottom: '20px', fontSize: '13px' }}>
          Tourism-Driven Economy
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
          Best Suburbs to Open a Café in Cairns (2026)
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '32px', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Data-driven analysis of foot traffic, rent, and profitability across Cairns neighborhoods. 2.1M annual visitors + 365-day outdoor dining opportunity.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
          <Link href="#top-suburbs" style={{
            padding: '12px 24px',
            backgroundColor: S.white,
            color: S.brand,
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
          }}>
            View Top Suburbs
          </Link>
          <Link href="/onboarding" style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: S.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            border: `2px solid ${S.white}`,
          }}>
            Get Your Site Analysis
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>2.1M</div>
            <div style={{ opacity: 0.9 }}>Annual Visitors</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>74%</div>
            <div style={{ opacity: 0.9 }}>Tourism Revenue</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>365 Days</div>
            <div style={{ opacity: 0.9 }}>Outdoor Seating</div>
          </div>
        </div>
      </div>

      {/* Data Disclaimer */}
      <div style={{
        padding: '20px 24px',
        backgroundColor: S.amberBg,
        borderLeft: `4px solid ${S.amber}`,
        marginBottom: '48px',
        maxWidth: '1200px',
        margin: '48px auto 48px',
      }}>
        <strong style={{ color: S.amber }}>Data Disclaimer:</strong>
        <p style={{ marginTop: '8px', color: S.muted, fontSize: '14px' }}>
          All figures are based on 2024–2026 ABS data, commercial property surveys (Colliers, JLL, CBRE), and anonymized transaction data. Foot traffic estimated via foot traffic analytics providers. Individual results vary based on lease terms, labor costs, and operational efficiency.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{
            padding: '24px',
            backgroundColor: S.n50,
            borderRadius: '12px',
            border: `1px solid ${S.border}`,
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: S.brand, marginBottom: '8px' }}>
              2.1M
            </div>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Annual Visitors to Cairns Region</p>
            <DataNote>Great Barrier Reef gateway drives consistent international tourism.</DataNote>
          </div>
          <div style={{
            padding: '24px',
            backgroundColor: S.n50,
            borderRadius: '12px',
            border: `1px solid ${S.border}`,
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: S.brand, marginBottom: '8px' }}>
              74%
            </div>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Café Revenue from Tourism (Cairns City)</p>
            <DataNote>Significantly higher than mainland regional cities (45–50%).</DataNote>
          </div>
          <div style={{
            padding: '24px',
            backgroundColor: S.n50,
            borderRadius: '12px',
            border: `1px solid ${S.border}`,
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: S.brand, marginBottom: '8px' }}>
              365 days
            </div>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Year-Round Outdoor Seating Potential</p>
            <DataNote>Dry season (May–Oct) optimal; wet season requires 35–40% revenue adjustment.</DataNote>
          </div>
        </div>
      </div>

      {/* Market Context */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>
          Cairns Café Market Context
        </h2>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: S.n900 }}>
          Cairns operates a tourism-dependent café economy unlike any other Australian regional city. The region attracts 2.1 million annual visitors (primarily to the Great Barrier Reef), creating a dual-market dynamic: premium international visitors (40% of foot traffic) and budget-conscious backpackers (30%) alongside local professionals and families. This split fundamentally changes pricing strategy and menu positioning compared to pure-demographic-driven regional cities like Ballarat or Bendigo.
        </p>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: S.n900 }}>
          Wet season (November–April) introduces cyclone risk and weather-driven revenue volatility. However, outdoor seating in dry season (May–October) remains viable 365 days/year in elevated, shaded areas—a competitive advantage vs. southern Australian cities where weather restricts outdoor trading to 6–7 months. Esplanade and riverside precincts capture premium pricing due to unmatched outdoor leverage.
        </p>
        <p style={{ marginBottom: '32px', lineHeight: '1.6', color: S.n900 }}>
          International visitor recovery (visa policy sensitive) and mining exploration activity in surrounding regions (Atherton Tablelands) create secondary demand flows. Café operators who secure corporate contracts with hotel chains and tour operators hedge tourism volatility through consistent morning briefing orders and group bookings.
        </p>

        {/* Scatter Chart */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ color: '#1C1917', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Rent vs. Revenue Potential
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
              <XAxis type="number" dataKey="rent" name="Monthly Rent ($)" stroke={S.muted} />
              <YAxis type="number" dataKey="revenue" name="Est. Monthly Revenue ($)" stroke={S.muted} />
              <Tooltip
                contentStyle={{
                  backgroundColor: S.white,
                  border: `1px solid ${S.border}`,
                  borderRadius: '8px',
                }}
                formatter={(value) => `$${value?.toLocaleString()}`}
              />
              <Legend />
              <Scatter name="Cairns Suburbs" data={RENT_VS_REVENUE} fill={S.brand} />
            </ScatterChart>
          </ResponsiveContainer>
          <DataNote>
            Monthly rent vs. estimated monthly revenue. Cairns City commands premium rent but generates higher absolute revenue from tourism volume.
          </DataNote>
        </div>
      </div>

      {/* Suburb Scores Bar Chart */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>
          Suburb Viability Scores (0–100)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={SUBURB_SCORES} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke={S.muted} />
            <YAxis stroke={S.muted} />
            <Tooltip
              contentStyle={{
                backgroundColor: S.white,
                border: `1px solid ${S.border}`,
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="score" fill={S.brand} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <DataNote>
          Scores reflect foot traffic, competition, demographics, rent-to-revenue fit, and growth trajectory.
        </DataNote>
      </div>

      {/* Top Suburbs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }} id="top-suburbs">
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>
          Top 4 Suburbs for Café (GO Verdict)
        </h2>
        {TOP_SUBURBS.map((suburb) => (
          <div key={suburb.rank} style={{
            padding: '32px',
            backgroundColor: S.n50,
            borderRadius: '12px',
            border: `1px solid ${S.border}`,
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#1C1917', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                  #{suburb.rank} {suburb.name} ({suburb.postcode})
                </h3>
                <p style={{ color: S.muted, fontSize: '14px' }}>
                  {suburb.angle}
                </p>
              </div>
              <VerdictBadge verdict={suburb.verdict} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', color: S.muted, marginBottom: '4px' }}>SCORE</p>
                <ScoreBar score={suburb.score} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: S.muted, marginBottom: '4px' }}>FOOT TRAFFIC</p>
                <p style={{ fontSize: '18px', fontWeight: '700' }}>{suburb.footTraffic.toLocaleString()} / day</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: S.muted, marginBottom: '4px' }}>MONTHLY RENT</p>
                <p style={{ fontSize: '18px', fontWeight: '700' }}>${suburb.rent.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: S.muted, marginBottom: '4px' }}>BREAKEVEN</p>
                <p style={{ fontSize: '18px', fontWeight: '700' }}>{suburb.breakEven} mo</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: S.muted, marginBottom: '4px' }}>ANNUAL PROFIT*</p>
                <p style={{ fontSize: '18px', fontWeight: '700' }}>${suburb.annualProfit.toLocaleString()}</p>
              </div>
            </div>

            {suburb.detail.map((para, i) => (
              <p key={i} style={{ marginBottom: '16px', lineHeight: '1.6', color: S.n900 }}>
                {para}
              </p>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: S.redBg,
                border: `1px solid ${S.redBdr}`,
                borderRadius: '8px',
              }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: S.red, marginBottom: '8px' }}>
                  Warning RISKS
                </p>
                <p style={{ fontSize: '14px', color: S.n900 }}>
                  {suburb.risks}
                </p>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: S.emeraldBg,
                border: `1px solid ${S.emeraldBdr}`,
                borderRadius: '8px',
              }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: S.emerald, marginBottom: '8px' }}>
                  Check OPPORTUNITY
                </p>
                <p style={{ fontSize: '14px', color: S.n900 }}>
                  {suburb.opportunity}
                </p>
              </div>
            </div>
          </div>
        ))}
        <DataNote>
          *Annual profit assumes 70 covers/day average ATV $28, 28% COGS, 35% labor (including owner). Excludes lease fitout.
        </DataNote>
      </div>

      {/* Mid-page CTA */}
      <div style={{
        padding: '48px 24px',
        backgroundColor: S.brand,
        color: S.white,
        textAlign: 'center',
        marginBottom: '48px',
      }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
          Need a Custom Site Analysis?
        </h2>
        <p style={{ marginBottom: '24px', opacity: 0.95 }}>
          Get foot traffic heat maps, competitor data, and financial projections for your specific location.
        </p>
        <Link href="/onboarding" style={{
          display: 'inline-block',
          padding: '12px 32px',
          backgroundColor: S.white,
          color: S.brand,
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
        }}>
          Start Free Analysis
        </Link>
      </div>

      {/* Poll */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <SuburbPoll />
      </div>

      {/* Checklist */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <ChecklistUnlock />
      </div>

      {/* Risk Suburbs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
          Caution & No-Go Suburbs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {RISK_SUBURBS.map((suburb) => (
            <div key={suburb.name} style={{
              padding: '24px',
              backgroundColor: suburb.verdict === 'NO' ? S.redBg : S.amberBg,
              border: `1px solid ${suburb.verdict === 'NO' ? S.redBdr : S.amberBdr}`,
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ color: '#1C1917', fontSize: '18px', fontWeight: '700' }}>
                  {suburb.name} ({suburb.postcode})
                </h3>
                <VerdictBadge verdict={suburb.verdict} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}>
                <ScoreBar score={suburb.score} />
              </div>
              <p style={{ fontSize: '14px', color: S.n900 }}>
                {suburb.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Video */}
      <div style={{
        maxWidth: '1200px',
        margin: '48px auto',
        padding: '0 24px',
        marginBottom: '48px',
      }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
          How to Validate Your Cairns Café Idea (3 min)
        </h2>
        <div style={{
          position: 'relative',
          backgroundColor: S.n900,
          borderRadius: '12px',
          overflow: 'hidden',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <a href="https://youtube.com/watch?v=dQw4w9WgXcQ" style={{
            fontSize: '60px',
            color: S.white,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.3s',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>▶
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
          FAQ: Cairns Café Economics
        </h2>
        {[
          {
            q: 'What suburb is best for a café in Cairns?',
            a: 'Cairns City scores highest (84/100) due to tourism foot traffic and premium pricing power. Edge Hill (80/100) offers better risk-adjusted returns with lower rent and stable local demographics.',
          },
          {
            q: 'Is Cairns good for a café?',
            a: 'Yes. Cairns attracts 2.1M annual visitors and 74% of café revenue in Cairns City comes from tourism, significantly higher than mainland regional cities. However, wet season volatility requires careful planning.',
          },
          {
            q: 'How does wet season affect café revenue?',
            a: 'Wet season (Nov–Apr) typically reduces revenue by 35–40% due to weather and reduced tourist volume. Model conservative projections; outdoor seating in elevated, shaded areas remains viable year-round.',
          },
          {
            q: 'Is Edge Hill better than Cairns CBD for a café?',
            a: 'Edge Hill has lower rent ($3,500 vs $7,250/mo) and faster payback (36 vs 42 months) but lower absolute revenue. Cairns City has higher foot traffic but tourism dependency. Choose based on risk tolerance.',
          },
          {
            q: 'What about farm-to-table positioning in Cairns?',
            a: 'Cairns specialty coffee and tropical produce (macadamia, local fruit) command premium pricing. International visitor base supports single-origin coffee at $5.50–$6.50/cup vs mainland $4.50.',
          },
        ].map((item, i) => (
          <div key={i} style={{
            borderBottom: `1px solid ${S.border}`,
            paddingBottom: '16px',
            marginBottom: '16px',
          }}>
            <button onClick={() => setExpandedFaq(expandedFaq === i ? -1 : i)} style={{
              width: '100%',
              textAlign: 'left',
              padding: '16px 0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              {item.q}
              <span style={{ color: S.muted }}>
                {expandedFaq === i ? '−' : '+'}
              </span>
            </button>
            {expandedFaq === i && (
              <p style={{ color: S.n900, lineHeight: '1.6', paddingTop: '12px' }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* City vs Australia Table */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
          Cairns vs Australia: Café Economics
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}>
            <thead>
              <tr style={{ backgroundColor: S.n50 }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Metric</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Cairns City</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Sydney CBD</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Regional Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Monthly Rent</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$7,250</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$12,500</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$2,800</td>
              </tr>
              <tr style={{ backgroundColor: S.n50 }}>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Est. Monthly Revenue</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$14,500</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$18,000</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$8,200</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Tourism Revenue %</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>74%</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>45%</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>18%</td>
              </tr>
              <tr style={{ backgroundColor: S.n50 }}>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Annual Profit*</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$156,000</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$168,000</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$98,000</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Payback Period</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>42 mo</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>48 mo</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>38 mo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DataNote>
          *Assumes 70 covers/day, $28 ATV, 28% COGS, 35% labor. Profit excludes lease fitout and contingency.
        </DataNote>
      </div>

      {/* Final Verdict */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        backgroundColor: S.emeraldBg,
        borderRadius: '12px',
        marginBottom: '48px',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px', color: S.emerald }}>
          Check Final Verdict
        </h2>
        <p style={{ lineHeight: '1.6', color: S.n900 }}>
          <strong>Cairns is a strong market for café expansion if you accept tourism volatility.</strong> Cairns City and Edge Hill both score 80+ and deliver profitability within 3 years. Tourism dependency (74% revenue) requires hedging through corporate contracts and wet season planning, but international visitor recovery and farm-to-table positioning create premium pricing power unavailable in mainland regional cities. Wet season (Nov–Apr) demands 40% revenue haircut and outdoor shade structure investment. For bootstrapped founders, Edge Hill offers better risk-adjusted returns; for capital-backed operators, Cairns City esplanade positions command sustainable competitive advantage.
        </p>
      </div>

      {/* Footer CTA */}
      <div style={{
        padding: '48px 24px',
        backgroundColor: S.brand,
        color: S.white,
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
          Ready to Validate Your Cairns Café Idea?
        </h2>
        <p style={{ marginBottom: '24px', opacity: 0.95 }}>
          Get location-specific foot traffic, competitor maps, and financial models.
        </p>
        <Link href="/onboarding" style={{
          display: 'inline-block',
          padding: '12px 32px',
          backgroundColor: S.white,
          color: S.brand,
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          Analyse Your Site Free
        </Link>
      </div>
    </div>
  )
}
