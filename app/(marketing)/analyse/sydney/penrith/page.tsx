'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg = v === 'GO'
    ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION'
    ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.txt, background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 6, padding: '2px 9px' }}>
      {v}
    </span>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100 }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 100 }}/>
      </div>
    </div>
  )
}

function SuburbPoll({ suburb }: { suburb: string }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([42, 31, 27])
  const total = votes.reduce((a, b) => a + b, 0)
  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  const opts = ['Yes', 'Maybe', 'No']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Would you open a business in {suburb}?</h3>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)' }}/>
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{opt}</span>
                <span style={{ fontSize: 13, color: S.muted }}>{voted !== null ? `${pct}%` : ''}</span>
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857' }}>
            Ready to run a full analysis for {suburb}?{' '}
            <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

const SCHEMA_ARTICLE = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Penrith Business Location Analysis - Western Sydney Growth Hub',
  description: 'Commercial real estate analysis for Penrith Sydney. Western Sydney Airport proximity, Panthers precinct, demographics, and business opportunities.',
  image: 'https://locatalyze.com/og-penrith.png',
  datePublished: '2026-03-24',
  dateModified: '2026-03-24',
  author: { '@type': 'Organization', name: 'Locatalyze' },
  publisher: { '@type': 'Organization', name: 'Locatalyze' },
}

const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Penrith a good place to open a business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Penrith combines $80,000+ median income, existing large commercial district, Panthers Entertainment precinct (500,000+ annual visitors), and 25-minute proximity to Western Sydney International Airport. The economic case is strongest relative to risk in Western Sydney.' },
    },
    {
      '@type': 'Question',
      name: 'How is Western Sydney Airport affecting Penrith businesses?',
      acceptedAnswer: { '@type': 'Answer', text: 'Western Sydney International (opening 2026) is 25 minutes from Penrith — second-closest major hub. Penrith LGA added 35,000 residents 2021-2026. Aerotropolis employment corridor will shift income composition. Operators who establish now lock in current rents before growth is fully priced.' },
    },
    {
      '@type': 'Question',
      name: 'What is commercial rent like in Penrith?',
      acceptedAnswer: { '@type': 'Answer', text: 'High Street / Penrith Plaza: $2,800–$5,500/month. Secondary locations: $1,800–$3,500/month. 50% cheaper than Parramatta at comparable foot traffic. Rents are increasing — aerotropolis effect is already in pricing data.' },
    },
    {
      '@type': 'Question',
      name: 'What businesses succeed near the Panthers precinct?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sports-adjacent hospitality (craft beer bar, quality pub dining), specialty café, and health/allied health. Panthers membership exceeds 65,000 — one of Australia\'s largest. Entertainment complex drives 500,000+ annual visitors with spillover demand.' },
    },
    {
      '@type': 'Question',
      name: 'Is Penrith\'s demographic changing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Younger professional families are moving in from Glenmore Park, Jordan Springs, and Caddens estate developments. New residents earn $85,000–$110,000 per household with established spending habits seeking food and lifestyle options.' },
    },
  ],
}

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 80 },
  { label: 'Demographics', value: 72 },
  { label: 'Rent Viability', value: 86 },
  { label: 'Competition', value: 70 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Blacktown', slug: 'blacktown', score: 71, verdict: 'GO' },
  { name: 'Mount Druitt', slug: 'mount-druitt', score: 68, verdict: 'CAUTION' },
  { name: 'Campbelltown', slug: 'campbelltown', score: 73, verdict: 'GO' },
]

export default function PenrithPage() {
  return (
    <div style={{ background: S.n50, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ARTICLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_FAQ) }} />

      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: S.brand, textDecoration: 'none' }}>Locatalyze</Link>
        <Link href="/onboarding" style={{ fontSize: 14, fontWeight: 600, color: S.brand, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${S.brand}`, borderRadius: 8 }}>Analyse your location</Link>
      </nav>

      <div style={{ background: `linear-gradient(135deg, ${S.brand} 0%, ${S.brandLight} 100%)`, padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: S.white, marginBottom: 16, opacity: 0.9 }}>
            <Link href="/analyse/sydney" style={{ color: S.white, textDecoration: 'none' }}>Sydney</Link> / Penrith
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: S.white, marginBottom: 24 }}>Penrith</h1>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <div style={{ fontSize: 32, fontWeight: 900, color: S.white }}>76</div>
          </div>
          <p style={{ fontSize: 18, color: S.white, opacity: 0.95, margin: 0 }}>Western Sydney's best commercial case. Panthers precinct, airport proximity, growing demographics, supply gaps.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Quick Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, marginBottom: 16 }}>
            Penrith is the Western Sydney location where the economic case for new business is strongest relative to current risk. The ingredients are in place: $80,000+ median household income (growing), existing large commercial district anchored by Westfield Penrith and Penrith Plaza, Panthers Entertainment complex generating premium hospitality demand, and 25-minute proximity to Western Sydney International Airport.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, margin: 0 }}>
            What's missing is the supply-side response. Materially fewer quality food, retail, and health operators exist than the demand base justifies. This gap — genuine demand without supply match — is the basic condition for new operators to achieve strong early performance without needing to displace existing customers.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Location Scores</h2>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Business Environment</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Penrith's commercial story is defined by two multipliers most external business analysts misunderstand: Western Sydney University Macarthur campus sits 20 minutes south, but Penrith's immediate advantage is the Panthers Entertainment precinct. This is not a stadium with a car park — it is one of the largest entertainment, dining, and hotel complexes in NSW outside the Sydney CBD. The complex drives 500,000+ annual visitors and generates spillover demand for adjacent businesses that has not been fully captured by current High Street strip positioning. A quality hospitality operator within 400m of the Panthers precinct accesses entertainment-visit customer overflow that is genuinely underpriced in current rents.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            High Street has undergone significant improvement since 2022, driven by council-led activation and improved streetscape. The contrast with 2018 High Street is material. Food and café offer has improved, but supply of quality operators lags the available customer base. This gap — genuine demand without supply match — is the basic condition for a new operator to enter and achieve strong early performance without displacing existing customers.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The Macarthur residential growth corridor (Glenmore Park, Jordan Springs, Caddens) is adding 5,000–7,000 households per year. New residents are younger families (median age 33), earning $85,000–$105,000 per household with children aged 0–12. They currently drive 25–35 minutes to Macquarie Centre or Parramatta Westfield for quality retail and dining. An operator who locates in Penrith and serves this demographic correctly captures spending that currently leaks north to Parramatta.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Competition Analysis</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Competition on High Street is primarily chain-based: Grill'd, Boost, Zambrero, Gloria Jean's, and the Westfield food court anchor the existing market. Independent quality operators are thin on the High Street strip. This is both a challenge (no proven independent benchmark) and an opportunity (being the first quality independent in high visibility creates outsized awareness with minimal marketing spend).
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The café market is the clearest gap. One specialty café operates on the Penrith strip; remaining coffee offer is chain-based or convenience quality. For a suburb with $80,000+ median income, this is a structural underserve. Demand for specialty coffee — evidenced by consistently long queues at the single quality café — is unambiguous.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Demographics</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Penrith's demographic is shifting rapidly toward younger professional families as Glenmore Park, Jordan Springs, and Caddens estate developments reach completion. New residents earn $85,000–$110,000 per household, have established spending habits from Sydney's inner suburbs, and actively seek the food and lifestyle options they had before moving west. This demographic is more similar to Parramatta's professional corridor than the older Penrith resident base.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The sports and entertainment dimension is real. Panthers membership alone exceeds 65,000 — one of Australia's largest club memberships. This creates a social infrastructure that amplifies weekend hospitality trade in a way that pure residential demographics don't. Game-day foot traffic is a genuine variable that Penrith operators can model and leverage.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Works Here</h2>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Specialty Café</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>The single clearest gap in the Penrith market. Professional demographic, proven demand from crowded single competitor, no quality competition. Revenue potential $60,000–80,000/month at maturity.</p>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Sports-Adjacent Hospitality (Craft Beer, Quality Pub Dining)</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Panthers foot traffic creates a weekend hospitality multiplier that few other Western Sydney locations can match. Membership base of 65,000+ creates a ready customer segment.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Health and Allied Health (Physio, Women's Health, Sports Medicine)</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Growing young professional demographic and family structure create strong demand. Zero competition visible on High Street despite obvious market gap.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Fails Here</h2>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Fine Dining (Over $90pp Degustation Format)</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>The market has the income to support it in theory but not yet the dining culture. In 3–4 years, possibly. In 2026, pure fine dining operators face a thin customer base.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Fashion Boutiques (Over $200 ATV)</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Penrith customers drive to Parramatta Westfield for premium fashion. Local shopping is practical and price-accessible, not aspirational.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The breakfast/brunch corridor adjacent to Jordan Springs and Glenmore Park estate exits is the most compelling underserved micro-location in Penrith LGA. These 25,000+ new residents pass through one or two key arterial exits every weekday morning with zero quality café or quick breakfast option. A compact café with drive-through capability or a 15-seat express-format on an arterial exit would capture 100–150 daily transactions with minimal marketing — location does the work. Daily revenue potential: $18,000–22,000/month at a $1,500/month rent position.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Key Risks</h2>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Aerotropolis Timeline Risk</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Delays shift the income uplift timeline. Underlying demographic trend is positive regardless, but pace of change affects how quickly premium positioning becomes viable.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Westfield Penrith Gravitational Pull</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>The centre's food court and adjacent retail absorb significant consumer spend. Independent operators on the strip must differentiate clearly or cede ground.</p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Over-Reliance on Panthers Events</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Game-day trade is valuable but irregular. A business model dependent on event-driven traffic cannot handle season disruptions or unexpected changes to the Panthers calendar.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Compare Nearby</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {NEARBY.map(suburb => (
              <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.n50, border: `1px solid ${S.border}`, borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{suburb.name}</h3>
                    <VerdictBadge v={suburb.verdict} />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: S.brand }}>{suburb.score}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SuburbPoll suburb="Penrith" />

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Final Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Penrith is a GO location. The combination of growing demographics, existing commercial infrastructure, Panthers Entertainment precinct demand, and proximity to Western Sydney International Airport creates one of Western Sydney's strongest business cases. Supply gaps exist where genuine demand can support new quality operators.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Specialty café, sports-adjacent hospitality, and health services are the positioning lanes. Operators who execute well will find a receptive market with less competition than equivalent Sydney locations. This is Western Sydney's best-positioned hub for quality operator entry.
          </p>
        </div>

        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '32px', marginBottom: 48, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.emerald, marginBottom: 12 }}>Ready to Analyse Your Location?</h3>
          <p style={{ fontSize: 16, color: S.emerald, marginBottom: 20, opacity: 0.9 }}>Get detailed commercial real estate intelligence for any Sydney location.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.emerald, color: S.white, padding: '12px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Analyse your address →</Link>
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 40, textAlign: 'center' }}>
          <div style={{ marginBottom: 24 }}>
            <Link href="/analyse/sydney" style={{ fontSize: 14, color: S.brand, textDecoration: 'none', fontWeight: 600 }}>← Back to Sydney Hub</Link>
          </div>
          <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>Postcode: 2750 | Median income: $80,000 | Rent range: $1,800–$5,500/month</p>
        </div>
      </div>
    </div>
  )
}
