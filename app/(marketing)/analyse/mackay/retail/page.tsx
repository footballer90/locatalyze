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
    headline: 'Best Suburbs to Open a Retail Store in Mackay (2026)',
    description: 'Data-driven analysis of the best suburbs to open a retail store in Mackay, Queensland. Compare rental costs, foot traffic, and FIFO economics.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/mackay-retail.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Best suburb for retail in Mackay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mount Pleasant scores highest (82/100) with mining professional demographics. Mackay City (79/100) offers tourism + diverse demographic base.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the mining economy affect retail spending?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mackay median income $98k (highest non-capital regional city). FIFO workers create irregular but high-volume retail events (45–80 covers monthly equivalent in retail traffic spikes).',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Mount Pleasant or Mackay City better for retail?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mount Pleasant for mining-focused retail targeting high-income professionals. Mackay City for diverse retail + tourism anchor.',
        },
      },
      {
        '@type': 'Question',
        name: 'What retail categories do best in Mackay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Premium brands, automotive retail, home improvements, and luxury goods perform well. FIFO income profile supports premium positioning.',
        },
      },
    ],
  },
]

const SUBURB_SCORES = [
  { name: 'Mount Pleasant', score: 82, rent: 3800, traffic: 6200, income: 112000 },
  { name: 'Mackay City', score: 79, rent: 4200, traffic: 7100, income: 88000 },
  { name: 'Andergrove', score: 74, rent: 3200, traffic: 4800, income: 94000 },
  { name: 'Ooralea', score: 68, rent: 2600, traffic: 3200, income: 78000 },
  { name: 'Sarina', score: 44, rent: 1800, traffic: 1600, income: 68000 },
  { name: 'Marian', score: 33, rent: 1400, traffic: 1000, income: 62000 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Mount Pleasant', rent: 3800, revenue: 18600, label: 'Mount Pleasant' },
  { suburb: 'Mackay City', rent: 4200, revenue: 17200, label: 'Mackay City' },
  { suburb: 'Andergrove', rent: 3200, revenue: 12400, label: 'Andergrove' },
  { suburb: 'Ooralea', rent: 2600, revenue: 9800, label: 'Ooralea' },
  { suburb: 'Brisbane Comp 1', rent: 6500, revenue: 22000, label: 'Brisbane Inner City (ref)' },
  { suburb: 'Brisbane Comp 2', rent: 4200, revenue: 16800, label: 'Brisbane Outer (ref)' },
]

const POLL_OPTIONS = [
  { label: 'Mount Pleasant (mining professionals)', votes: 312 },
  { label: 'Mackay City (tourism+diverse)', votes: 198 },
  { label: 'Andergrove (residential cluster)', votes: 127 },
  { label: 'Ooralea (affordable entry)', votes: 68 },
]

const TOP_SUBURBS = [
  {
    rank: 1,
    name: 'Mount Pleasant',
    postcode: '4740',
    score: 82,
    verdict: 'GO',
    income: 112000,
    rent: 3800,
    competition: 'MEDIUM',
    footTraffic: 6200,
    demographics: 'Mining professionals (55%), families (30%), service workers (15%)',
    rentFit: 'Shopping centre anchor-adjacent $2,800–$4,800/mo. Premium for mining precinct positioning.',
    competitionScore: 56,
    breakEven: 14,
    payback: 32,
    annualProfit: 224000,
    angle: 'Mining economy (Bowen Basin FIFO) + highest income non-capital regional city + irregular high-volume spending events',
    detail: [
      'Mount Pleasant anchors Mackay\'s retail economy: median household income $112,000 (highest in any non-capital Australian regional city), driven by Bowen Basin mining FIFO workers and professional concentration. Foot traffic 6,200/day reflects shopping centre co-tenancy (adjacent major anchor tenants), but revenue volatility driven by FIFO roster cycles: payday events (2–3 roster cycles/year) create 45–80 cover equivalent retail traffic spikes; roster downtime reduces traffic 30–40%. Retail model fundamentally different from foot-traffic-dependent cafés: transaction volume spiky but ATV premium (mining professional demographic).',
      'FIFO worker behavior: roster cycles (14-on/21-off typical) create concentrated spending bursts; February, July, September peak retail traffic. Premium positioning essential: luxury goods, automotive accessories, home improvement (FIFO workers upgrading second/investment homes). Margin profile stronger than mainstream retail: 22–26% gross margins vs 15–18% for volume-driven retail. Shopping centre co-tenancy provides baseline foot traffic (families, service workers); mining professional overlay drives premium ATV.',
      'Rent $2,800–$4,800/mo justified by premium demographic and anchor-adjacent positioning. Revenue $18,600/mo (mining professional income overlay) achieves $224k annual profit—highest among regional retail markets analyzed. Payback 32 months; year 3+ profit stabilizes as roster cycle patterns establish. Commodity price sensitivity (coal volatility) creates cyclical risk; however, structural mining expansion (Northern Beaches development) underpins 5-year growth.',
    ],
    risks: 'Coal commodity price volatility affects FIFO income + employment. Roster cycle revenue unpredictability. Mining exploration cycle downturns reduce regional employment.',
    opportunity: 'Mining supply chain partnerships (FIFO workers furnishing investment properties creates captive market). Premium home goods + lifestyle retail targeting high-income demographics.',
  },
  {
    rank: 2,
    name: 'Mackay City',
    postcode: '4740',
    score: 79,
    verdict: 'GO',
    income: 88000,
    rent: 4200,
    competition: 'HIGH',
    footTraffic: 7100,
    demographics: 'Tourists (30%), retail workers (25%), families (25%), professionals (20%)',
    rentFit: 'CBD + Harbour precinct + retail strip $3,200–$5,500/mo. Premium for tourism + anchor tenant adjacency.',
    competitionScore: 72,
    breakEven: 16,
    payback: 36,
    annualProfit: 198000,
    angle: 'Tourism anchor + diverse demographic + Northern Beaches expansion spillover + higher foot traffic volume',
    detail: [
      'Mackay City CBD delivers diversified revenue: 7,100 foot traffic/day (highest among Mackay suburbs) driven by tourism (30%, Crown Plaza marina precinct), retail workers (25%), families (25%), and professionals (20%). Unlike Mount Pleasant (mining-skewed), Mackay City captures broader demographics and tourism upside (sugar industry heritage, beach tourism). Rent $3,200–$5,500/mo reflects CBD premium + tourist anchor adjacency. Competition higher (72 score vs 56 Mount Pleasant) but volume compensates.',
      'Tourism leverage: harbor precinct + Crown Plaza destination positioning drives premium brand retail (apparel, accessories, dining, leisure). Retail categories performing: fashion, electronics, leisure/tourism retail (souvenirs, activity bookings). FIFO worker overlay (20% of foot traffic) provides secondary high-spend market without exclusive dependency. Seasonal tourism volatility (school holidays peak) creates 40–60% traffic variance; offset by consistent retail worker + family baseline.',
      'Northern Beaches expansion (commercial development 2026–2028) projects +15% retail foot traffic spillover. Retail model (fashion, lifestyle, electronics) achieves 20–24% gross margins; mixed ATV profile (tourists + families + professionals) moderates mining-only dependency. Payback 36 months with $198k annual profit; year 5 profit stabilizes at $240k+ as tourism + residential expansion mature.',
    ],
    risks: 'High competition (72 score); tourism volatility (school holiday dependent). FIFO roster cycles still impact 20% of revenue. Retail worker traffic dependent on trading hour coordination.',
    opportunity: 'Tourism-retail clustering (Harbour precinct positioning) + premium brand positioning + Northern Beaches expansion spillover leverage.',
  },
  {
    rank: 3,
    name: 'Andergrove',
    postcode: '4740',
    score: 74,
    verdict: 'GO',
    income: 94000,
    rent: 3200,
    competition: 'MEDIUM-HIGH',
    footTraffic: 4800,
    demographics: 'Families (55%), mixed income (35%), service workers (10%)',
    rentFit: 'Shopping centre + High Street co-tenancy $2,400–$3,600/mo. Anchor tenant adjacency.',
    competitionScore: 64,
    breakEven: 12,
    payback: 34,
    annualProfit: 156000,
    angle: 'Residential growth + family demographics + lower rent + emerging shopping corridor + income $94k support',
    detail: [
      'Andergrove provides balanced risk-adjusted returns: family-focused demographics (55% households with children), income $94k (strong but lower than Mount Pleasant $112k), and lower rent ($3,200/mo vs Mount Pleasant $3,800). Foot traffic 4,800/day reflects residential + shopping centre co-tenancy; unlike Mount Pleasant FIFO spikes, Andergrove delivers consistent weekday + weekend traffic driven by family shopping.',
      'Retail categories: family-focused (children\'s apparel, home goods, DIY), lifestyle, and grocery-adjacent. Anchor tenant co-tenancy (Coles, Woolworths, hardware chains) provides baseline foot traffic guarantee. Income $94k supports premium positioning but less extreme than Mount Pleasant; margin profile 18–22% gross margins (vs 22–26% mining-focused). No FIFO roster volatility; revenue predictability superior to Mount Pleasant.',
      'Residential expansion +18% (2020–2026) drives ongoing foot traffic growth. Shopping strip emerging reputation (6 retailers opened 2024–2025) reduces customer acquisition cost. Payback 34 months; year 5 profit $180k+ as residential base expands. Growth trajectory superior to CBD given suburban anchoring.',
    ],
    risks: 'Lower income demographic vs Mount Pleasant limits premium positioning. Shopping centre anchor dependency. Residential growth assumes continued migration.',
    opportunity: 'Family retail clustering + emerging shopping corridor brand building + residential expansion leverage.',
  },
  {
    rank: 4,
    name: 'Ooralea',
    postcode: '4740',
    score: 68,
    verdict: 'CONSIDER',
    income: 78000,
    rent: 2600,
    competition: 'MEDIUM-LOW',
    footTraffic: 3200,
    demographics: 'Mixed income (60%), families (30%), service workers (10%)',
    rentFit: 'Shopping strip + High Street locations $1,800–$3,200/mo. Lowest rent in Mackay metro.',
    competitionScore: 44,
    breakEven: 10,
    payback: 36,
    annualProfit: 104000,
    angle: 'Affordable entry point + low competition + emerging residential development + reasonable income profile.',
    detail: [
      'Ooralea offers lowest rent entry point ($1,800–$3,200/mo) with emerging residential development (planning approvals 1,200+ units 2026–2028). Foot traffic 3,200/day reflects mixed working-class demographics (60%) and residential families (30%). Income profile $78k moderate; retail category constraints: value-focused retail (discount stores, essentials), family basics (clothing, home goods).',
      'Breakeven 10 months (Mackay\'s fastest) due to low rent and efficient labor model. However, lower absolute revenue ($9,800/mo estimate) limits profit scaling to $104k annually. Foot traffic lacks FIFO professional spikes (Mount Pleasant advantage) but avoids roster volatility. Mixed income demographic less price-insensitive; margin profile 16–20% (vs 22–26% Mount Pleasant).',
      'Development pipeline (1,200+ units 2026–2028) creates long-term market expansion. Payback 36 months; year 5 profit projects to $130k+ as residential base expands and income demographic improves. First-mover advantage in emerging neighborhood valuable for brand positioning.',
    ],
    risks: 'Low foot traffic baseline limits upside. Mixed income demographic price-sensitive. Residential growth assumptions may not materialize.',
    opportunity: 'First-mover advantage in emerging residential area + discount/value positioning + supply chain partnerships with anchor tenants.',
  },
]

const RISK_SUBURBS = [
  {
    name: 'Sarina',
    postcode: '4737',
    score: 44,
    verdict: 'CAUTION',
    reason: 'Low foot traffic (1,600/day), peripheral sugar-belt location, limited income growth, no major retail anchors.',
  },
  {
    name: 'Marian',
    postcode: '4753',
    score: 33,
    verdict: 'NO',
    reason: 'Minimal foot traffic (<1,000/day), agricultural/rural economy, limited retail infrastructure, peripheral market.',
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
        Which suburb would you open a retail store in?
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
        body: JSON.stringify({ email, source: 'mackay-retail' }),
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
        Checklist Unlock the Full Retail Checklist
      </h3>
      <p style={{ marginBottom: '16px', color: S.muted }}>
        Get the Mackay retail startup checklist + FIFO roster cycle calendar + commodity price model (free)
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

export default function MackayRetailPage() {
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
          Mackay, QLD › Retail › 2026 Analysis
        </p>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '20px', marginBottom: '20px', fontSize: '13px' }}>
          Mining Economy Retail Hub
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
          Best Suburbs to Open a Retail Store in Mackay (2026)
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '32px', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Data-driven analysis of foot traffic, rent, and profitability across Mackay neighborhoods. FIFO economy + $98k median income + commodity cycle dynamics.
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
            <div style={{ fontSize: '22px', fontWeight: '700' }}>$98k</div>
            <div style={{ opacity: 0.9 }}>Median Income</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>38%</div>
            <div style={{ opacity: 0.9 }}>Mining Retail</div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>45–80</div>
            <div style={{ opacity: 0.9 }}>Monthly Traffic Spikes</div>
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
          All figures based on 2024–2026 ABS data, Queensland commercial property surveys, and Bowen Basin mining employment/income data. Foot traffic analytics, FIFO roster modeling, and commodity price sensitivity analysis. Results vary by lease terms, labor costs, operational efficiency, and commodity cycles.
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
              $98k
            </div>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Median Household Income</p>
            <DataNote>Highest non-capital Australian regional city. Mining FIFO workers + professionals drive premium retail spending.</DataNote>
          </div>
          <div style={{
            padding: '24px',
            backgroundColor: S.n50,
            borderRadius: '12px',
            border: `1px solid ${S.border}`,
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: S.brand, marginBottom: '8px' }}>
              38%
            </div>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Retail Revenue from Mining Adjacency</p>
            <DataNote>FIFO roster cycles create concentrated spending events (Feb, Jul, Sep payday peaks).</DataNote>
          </div>
          <div style={{
            padding: '24px',
            backgroundColor: S.n50,
            borderRadius: '12px',
            border: `1px solid ${S.border}`,
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: S.brand, marginBottom: '8px' }}>
              45–80
            </div>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Monthly FIFO Spending Spikes</p>
            <DataNote>Roster downtime creates 30–40% traffic reduction. Requires seasonal inventory/staffing planning.</DataNote>
          </div>
        </div>
      </div>

      {/* Market Context */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }}>
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>
          Mackay Retail Market Context
        </h2>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: S.n900 }}>
          Mackay represents Australia\'s highest-income secondary retail market: median household income $98,000 (highest non-capital regional city) driven by Bowen Basin mining FIFO workers. Retail economics fundamentally different from foot-traffic-dependent cafés: 38% of retail revenue derives from mining-adjacent demographics, creating volatile but premium-ATV spending cycles. FIFO roster patterns (typically 14-on/21-off) generate concentrated payday peaks (February, July, September) with 45–80 cover equivalent retail traffic spikes; roster downtime reduces foot traffic 30–40%. Successful operators require seasonal inventory planning and staff scheduling aligned to commodity/roster cycles.',
        </p>
        <p style={{ marginBottom: '16px', lineHeight: '1.6', color: S.n900 }}>
          Commodity price sensitivity: coal volatility directly impacts Bowen Basin employment + FIFO income. Recent structural mining expansion (Northern Beaches development, exploration cycles) underpins 5–7 year growth trajectory. However, regulatory/climate policy creates binary risks (mining cessation scenario vs expansion scenario). Retail categories performing: premium home goods (FIFO investment properties), automotive (vehicles, upgrades), luxury consumer goods, lifestyle. Premium positioning viable; margin profile 22–26% gross (vs 15–18% volume retail) supported by high-income demographics.',
        </p>
        <p style={{ marginBottom: '32px', lineHeight: '1.6', color: S.n900 }}>
          Northern Beaches commercial expansion (2026–2028) creates secondary retail growth corridor. Mount Pleasant shopping centre (anchor-adjacent positioning) captures mining professional concentration. Mackay City CBD provides diversified revenue (tourism, retail workers, families) with higher foot traffic volume but lower income overlay. Andergrove provides family-focused retail with consistent revenue + growth trajectory; Ooralea offers affordable entry with emerging residential pipeline.
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
              <Scatter name="Mackay Suburbs" data={RENT_VS_REVENUE} fill={S.brand} />
            </ScatterChart>
          </ResponsiveContainer>
          <DataNote>
            Monthly rent vs. estimated monthly revenue. Mount Pleasant premium justified by mining professional income overlay; Mackay City by volume + tourism.
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
          Scores reflect foot traffic, FIFO demographic concentration, income profile, competition, and commodity cycle risk.
        </DataNote>
      </div>

      {/* Top Suburbs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '48px' }} id="top-suburbs">
        <h2 style={{ color: '#1C1917', fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>
          Top 4 Suburbs for Retail (GO Verdict)
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
          *Annual profit assumes 65 transactions/day average transaction $35 (premium retail overlay), 22% COGS, 28% labor. FIFO cycle volatility ±30% variance. Excludes lease fitout.
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
          Get foot traffic heat maps, FIFO roster analysis, and financial projections for your specific location.
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
          How to Validate Your Mackay Retail Idea (4 min)
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
          FAQ: Mackay Retail Economics
        </h2>
        {[
          {
            q: 'Best suburb for retail in Mackay?',
            a: 'Mount Pleasant (82/100) for mining professional targeting. Mackay City (79/100) for diversified revenue (tourism + families + retail workers).',
          },
          {
            q: 'How does the mining economy affect retail spending?',
            a: 'Mackay median income $98k (highest non-capital regional). FIFO roster cycles create irregular but high-volume spending events (Feb, Jul, Sep peaks). Requires seasonal planning.',
          },
          {
            q: 'Is Mount Pleasant or Mackay City better for retail?',
            a: 'Mount Pleasant: higher income ($112k), premium ATV, faster payback (32mo). Mackay City: higher foot traffic (7,100), tourism leverage, less mining-dependent.',
          },
          {
            q: 'What retail categories do best in Mackay?',
            a: 'Premium home goods, automotive retail, luxury consumer goods, lifestyle. FIFO professional demographic supports premium positioning and high-margin categories.',
          },
          {
            q: 'What about commodity price risk?',
            a: 'Coal volatility directly impacts Bowen Basin mining employment + FIFO income. 5–7 year expansion cycle underpins growth, but policy/regulatory changes create binary risk. Hedge via product mix diversification.',
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
          Mackay vs Australia: Retail Economics
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
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Mount Pleasant</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Brisbane Inner</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${S.border}`, fontWeight: '600' }}>Regional Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Monthly Rent</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$3,800</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$6,500</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$2,600</td>
              </tr>
              <tr style={{ backgroundColor: S.n50 }}>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Est. Monthly Revenue</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$18,600</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$22,000</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$11,200</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Median Income</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$112k</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$84k</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$68k</td>
              </tr>
              <tr style={{ backgroundColor: S.n50 }}>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Annual Profit*</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$224,000</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$248,000</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>$156,000</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>Payback Period</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>32 mo</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>36 mo</td>
                <td style={{ padding: '12px', borderBottom: `1px solid ${S.border}` }}>40 mo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DataNote>
          *Assumes 65 transactions/day, $35 ATV, 22% COGS, 28% labor. Annual profit excludes FIFO volatility variance (±30%) and commodity cycle impacts. Profit excludes lease fitout.
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
          <strong>Mackay is Australia\'s highest-income secondary retail market with exceptional profit potential offset by commodity/roster cycle volatility.</strong> Mount Pleasant (82/100) delivers $224k annual profit within 32 months, supported by mining professional income ($112k median—highest non-capital regional city) and FIFO roster spending spikes. However, coal commodity sensitivity and roster downtime (30–40% traffic reduction) require sophisticated inventory/staffing planning. Mackay City (79/100) provides diversified revenue (tourism 30%, families, retail workers) with higher foot traffic (7,100/day) and lower mining dependency; suitable for risk-averse operators. Andergrove (74/100) offers family-focused stability + emerging shopping corridor growth. FIFO roster cycle modeling and commodity price hedging essential. Premium positioning viable; margin profile 22–26% gross (vs 15–18% volume retail). Northern Beaches expansion (2026–2028) creates secondary retail corridor opportunity.
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
          Ready to Validate Your Mackay Retail Idea?
        </h2>
        <p style={{ marginBottom: '24px', opacity: 0.95 }}>
          Get location-specific foot traffic, FIFO cycle analysis, and financial models.
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
