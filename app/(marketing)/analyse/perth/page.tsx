// app/(marketing)/analyse/perth/page.tsx
// Perth city hub — engine-derived scores, FactorGrid, full suburb directory
// Mirrors Melbourne page structure

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { PollSection } from '@/components/analyse/PollSection'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { C } from '@/components/analyse/AnalyseTheme'
import { getPerthSuburb, getPerthSuburbs } from '@/lib/analyse-data/melbourne'

function pScore(name: string): number {
  return getPerthSuburb(name)?.compositeScore ?? 0
}
function pVerdict(name: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getPerthSuburb(name)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Perth — 2026 Location Guide',
  description:
    'Perth business location guide 2026. 10 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Mining-driven income advantage, 30–45% lower rents than Sydney — find the best Perth suburb for your café, restaurant, or retail business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/perth' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Perth — 2026 Location Guide',
    description: '10 Perth suburbs ranked and scored. Rent benchmarks, foot traffic data, best business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/perth',
  },
}

const COMPARISON_ROWS = [
  { name: 'Subiaco',      score: pScore('Subiaco'),      verdict: pVerdict('Subiaco')      as 'GO' | 'CAUTION' | 'NO', rent: '$4,200–$6,500', footTraffic: 'High',        bestFor: 'Specialty café, quality dining, boutique retail' },
  { name: 'Leederville',  score: pScore('Leederville'),  verdict: pVerdict('Leederville')  as 'GO' | 'CAUTION' | 'NO', rent: '$3,500–$5,500', footTraffic: 'High',        bestFor: 'Café, casual dining, wellness' },
  { name: 'Mount Lawley', score: pScore('Mount Lawley'), verdict: pVerdict('Mount Lawley') as 'GO' | 'CAUTION' | 'NO', rent: '$3,000–$5,000', footTraffic: 'Medium-High', bestFor: 'Café, health food, independent retail' },
  { name: 'Northbridge',  score: pScore('Northbridge'),  verdict: pVerdict('Northbridge')  as 'GO' | 'CAUTION' | 'NO', rent: '$4,000–$7,500', footTraffic: 'Very High',   bestFor: 'High-volume hospo, nightlife, restaurant' },
  { name: 'Fremantle',    score: pScore('Fremantle'),    verdict: pVerdict('Fremantle')    as 'GO' | 'CAUTION' | 'NO', rent: '$3,500–$6,000', footTraffic: 'High',        bestFor: 'Tourism-adjacent café, heritage dining, lifestyle retail' },
  { name: 'Perth CBD',    score: pScore('Perth CBD'),    verdict: pVerdict('Perth CBD')    as 'GO' | 'CAUTION' | 'NO', rent: '$7,000–$15,000', footTraffic: 'Very High',  bestFor: 'High-volume QSR, premium dining, professional services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium — Strong Demand, Proven Returns',
    description: 'Inner Perth with exceptional demographics and foot traffic. Mining-income catchments sustain premium pricing across hospitality and retail.',
    suburbs: [
      { name: 'Subiaco',     slug: 'subiaco',     description: "Oxford Street is Perth's strongest inner commercial strip. Affluent demographic ($105K avg household income) with consistent spending and below-east-coast rents.",                 score: pScore('Subiaco'),     verdict: pVerdict('Subiaco')     as 'GO' | 'CAUTION' | 'NO', rentRange: '$4,200–$6,500/mo' },
      { name: 'Leederville', slug: 'leederville', description: "Best rent-to-revenue ratio in inner Perth — 20% below Subiaco rents with comparable demographic quality and Oxford Street overspill foot traffic.",                              score: pScore('Leederville'), verdict: pVerdict('Leederville') as 'GO' | 'CAUTION' | 'NO', rentRange: '$3,500–$5,500/mo' },
      { name: 'Mount Lawley',slug: 'mount-lawley', description: "Beaufort Street has the best entry timing in Perth right now — improving demographics, thin competition supply, and rents that haven't yet caught up to catchment income quality.", score: pScore('Mount Lawley'),verdict: pVerdict('Mount Lawley') as 'GO' | 'CAUTION' | 'NO', rentRange: '$3,000–$5,000/mo' },
    ],
  },
  {
    title: 'High Volume — Competitive but Viable',
    description: "Perth's highest foot traffic strips. Real opportunity for operators who can execute at volume — tight margins require differentiated concepts.",
    suburbs: [
      { name: 'Northbridge', slug: 'northbridge', description: "Perth's highest-volume hospitality district. Strong food culture and consistent foot traffic — but established operators and chain presence compress independent margins.",          score: pScore('Northbridge'), verdict: pVerdict('Northbridge') as 'GO' | 'CAUTION' | 'NO', rentRange: '$4,000–$7,500/mo' },
      { name: 'Perth CBD',   slug: 'perth-cbd',   description: "Hay Street Mall generates real foot traffic. $10,000–$22,000/month rents require high-volume execution — viable for premium dining and professional services, not independents.", score: pScore('Perth CBD'),   verdict: pVerdict('Perth CBD')   as 'GO' | 'CAUTION' | 'NO', rentRange: '$7,000–$15,000/mo' },
    ],
  },
  {
    title: 'Speculative — Specific Niches Only',
    description: 'Markets where targeted concepts succeed but general operators face structural headwinds. Know your niche before committing.',
    suburbs: [
      { name: 'Fremantle', slug: 'fremantle', description: 'Heritage precinct with tourism uplift and strong local demographic. Seasonal revenue spread (tourist-summer / local-year-round) requires explicit cash-flow planning.',             score: pScore('Fremantle'), verdict: pVerdict('Fremantle') as 'GO' | 'CAUTION' | 'NO', rentRange: '$3,500–$6,000/mo' },
      { name: 'Morley',    slug: 'morley',    description: 'Major northern hub anchored by Westfield Morley. Strip retail outside the centre competes against Westfield gravity — practical services and health work; hospitality is harder.',  score: pScore('Morley'),    verdict: pVerdict('Morley')    as 'GO' | 'CAUTION' | 'NO', rentRange: '$2,500–$4,500/mo' },
    ],
  },
  {
    title: 'Risky — Structural Constraints',
    description: 'Low demand, low income catchments, or oversupplied markets. Viable only for specific low-cost-base operators. Premium concepts will not succeed.',
    suburbs: [
      { name: 'Armadale', slug: 'armadale', description: 'Median household income 26% below Perth median. Premium café price points are a stretch purchase for the local demographic — value-format services only.',                              score: pScore('Armadale'), verdict: pVerdict('Armadale') as 'GO' | 'CAUTION' | 'NO', rentRange: '$1,500–$3,000/mo' },
      { name: 'Joondalup', slug: 'joondalup', description: 'Oversaturated with established chains — independent operators cannot compete on volume. Rent-to-revenue for new entrants exceeds 22% at market rents.',                            score: pScore('Joondalup'), verdict: pVerdict('Joondalup') as 'GO' | 'CAUTION' | 'NO', rentRange: '$2,000–$4,000/mo' },
      { name: 'Midland',   slug: 'midland',   description: 'Commercial vacancy on Great Northern Highway exceeds 18% — a clear market signal that foot traffic is below the threshold for new hospitality entrants.',                           score: pScore('Midland'),   verdict: pVerdict('Midland')   as 'GO' | 'CAUTION' | 'NO', rentRange: '$1,500–$3,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a business in Perth?',
    answer: "Subiaco is Perth's benchmark inner commercial strip — Oxford Street generates the city's most consistent independent hospitality returns, with $105K+ average household income and commercial rents 30–40% below Sydney equivalents. For operators who want better entry economics with comparable demographics, Leederville offers 20% lower rents than Subiaco with strong foot traffic and improving café culture. Mount Lawley (Beaufort Street) has the best entry timing right now: improving demographics, genuinely thin competition supply, and rents that haven't yet priced in the catchment quality.",
  },
  {
    question: 'Why does Perth have better business economics than Sydney and Melbourne?',
    answer: "Perth's unit economics advantage comes from two structural factors that have compounded over time. First, the mining sector creates a household income distribution that doesn't exist on the east coast — a significant share of inner Perth residents earn $120,000–$200,000+ annually from resources roles, sustaining premium spending on cafés, restaurants, and retail at price points that would struggle in lower-income markets. Second, Perth commercial rents are 30–45% below Sydney equivalents, meaning operators generate comparable revenue at a fraction of the occupancy cost. The café rent-to-revenue ratio in Subiaco (5–8%) compares to 16–19% in comparable Sydney strips.",
  },
  {
    question: 'Is Perth good for opening a café in 2026?',
    answer: "Yes — Subiaco, Leederville, and Mount Lawley are three of the strongest café opportunities in Australia right now by risk-adjusted economics. The combination of high income demographics and accessible rents creates unit economics that are structurally superior to equivalent inner-city strips in Sydney or Melbourne. Perth's specialty coffee culture has matured significantly since 2020. The risk is picking the wrong suburb: Joondalup is oversaturated, Midland has below-threshold foot traffic, and Armadale has income demographics that don't support specialty pricing. Inner Perth is GO; outer Perth requires careful qualification.",
  },
  {
    question: 'What commercial rent should I expect in Perth suburbs?',
    answer: "Perth commercial rents range widely by location. Inner premium (Subiaco, Leederville): $3,500–$6,500/month. High volume (Northbridge, Perth CBD): $4,000–$15,000/month. Heritage/tourism (Fremantle): $3,500–$6,000/month. Mid-ring (Morley, Mount Lawley): $2,500–$5,000/month. Outer/value (Armadale, Midland): $1,500–$3,000/month. All figures are gross rent estimates for ground-floor retail and hospitality tenancies. Incentives in the current market — particularly in outer suburbs with high vacancy — can include significant rent-free periods that reduce effective rent by 15–25%.",
  },
  {
    question: 'How does Perth compare to Melbourne for opening a business?',
    answer: "Perth wins on unit economics, Melbourne wins on market depth. Perth café rents at $4,200–$6,500/month in Subiaco compare to $9,000–$15,000 in Melbourne's Fitzroy or Richmond for comparable demographic strips — a 50–60% cost advantage. Melbourne's hospitality market is deeper and more established: more customers, more competition, and a food culture that has been self-reinforcing since the 1990s. Perth's advantage is that its market is still maturing — operators who enter Subiaco or Mount Lawley now are building equity in a market that will price up as the food culture deepens, rather than competing in a market where the valuation is already fully reflected in rents.",
  },
  {
    question: 'Is Northbridge good for a restaurant in 2026?',
    answer: "Northbridge works for hospitality operators who can execute at volume and differentiate from established players. It generates the highest raw foot traffic of any Perth strip — weekend evenings produce significant throughput. The challenge is competition density: chains and established independent operators have already optimised for the Northbridge customer. New entrants face a market where being good is insufficient — the concept needs to be genuinely different from what's already there. Margins are tighter than Subiaco because of higher competition density, not higher rents. The CAUTION verdict reflects execution risk, not demand weakness.",
  },
]

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

// ── Full suburb factor directory ──────────────────────────────────────────────

function PerthFactorDirectory() {
  const suburbs = getPerthSuburbs().sort((a, b) => b.compositeScore - a.compositeScore)

  const VERDICT_CFG = {
    GO:      { bg: C.emeraldBg, bdr: C.emeraldBdr, txt: C.emerald },
    CAUTION: { bg: C.amberBg,   bdr: C.amberBdr,   txt: C.amber },
    RISKY:   { bg: C.redBg,     bdr: C.redBdr,     txt: C.red },
  }

  return (
    <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
          Perth Suburb Factor Breakdown — All {suburbs.length} Suburbs
        </h2>
        <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>
          Engine-derived scores for every Perth suburb in the dataset. Five factors rated 1–10 feed into business-type composite scores. Sorted by overall composite score.
        </p>

        <div style={{ display: 'grid', gap: '20px' }}>
          {suburbs.map((s) => {
            const v = VERDICT_CFG[s.verdict]
            return (
              <Link
                key={s.slug}
                href={`/analyse/perth/${s.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{ padding: '22px 24px', backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: C.n900, margin: 0 }}>{s.name}</h3>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 6, backgroundColor: v.bg, color: v.txt, border: `1px solid ${v.bdr}` }}>
                        {s.verdict}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {[
                        { label: 'Café', value: s.cafe },
                        { label: 'Rest.', value: s.restaurant },
                        { label: 'Retail', value: s.retail },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 900, color: value >= 70 ? C.emerald : value >= 58 ? C.amber : C.red, lineHeight: 1 }}>{value}</div>
                          <div style={{ fontSize: '10px', color: C.mutedLight, marginTop: '2px' }}>{label}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center', paddingLeft: '12px', borderLeft: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: '26px', fontWeight: 900, color: C.brand, lineHeight: 1 }}>{s.compositeScore}</div>
                        <div style={{ fontSize: '10px', color: C.mutedLight }}>/ 100</div>
                      </div>
                    </div>
                  </div>

                  <FactorGrid factors={s.locationFactors} />

                  <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '8px 0 0 0' }}>
                    {s.why[0]}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PerthPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* Hero */}
      <CityHero
        cityName="Perth"
        citySlug="perth"
        tagline="Australia's strongest business unit economics right now. Mining-driven household incomes above the national average, inner-ring rents 30–45% below Sydney, and an independent food culture that is maturing fast. Here is where the numbers work best."
        statChips={[
          { text: '10 suburbs scored — inner to outer Perth' },
          { text: 'Subiaco: best rent-to-income ratio in Australia' },
          { text: 'Mining income advantage: $78K median household income' },
        ]}
      />

      {/* Methodology Banner */}
      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores derived from demand strength, rent pressure, competition density, seasonality risk, and tourism dependency. Data sourced from ABS 2024, REIWA Q1 2026, CBRE, City of Perth, and Locatalyze proprietary foot traffic analysis.
          </p>
        </div>
      </div>

      {/* Jump Nav */}
      <nav style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
          {[
            { label: 'Top Suburbs',      href: '#top-suburbs' },
            { label: 'By Business Type', href: '#by-type' },
            { label: 'Suburb Directory', href: '#suburbs' },
            { label: 'Factor Breakdown', href: '#factor-directory' },
            { label: 'Comparisons',      href: '#comparisons' },
            { label: 'High-Risk Zones',  href: '#high-risk' },
            { label: 'FAQ',              href: '#faq' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontSize: '13px', fontWeight: 600, color: C.n700, textDecoration: 'none', padding: '6px 14px', borderRadius: '5px', backgroundColor: C.n50, border: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Stats Row */}
      <section style={{ padding: '40px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { value: '$78K',  label: 'Perth median household income — driven by mining sector incomes above national average', source: 'ABS 2023–24' },
              { value: '−40%', label: 'Inner Perth rent vs equivalent Sydney strips — structural unit economics advantage',       source: 'REIWA + CBRE Q1 2026' },
              { value: '5–8%', label: 'Typical café rent-to-revenue ratio in Subiaco — vs 16–19% in inner Sydney',              source: 'REIWA + Locatalyze 2026' },
              { value: '14%',  label: 'Annual inner suburb café growth rate — fastest of any Australian city',                   source: 'ABS business counts 2025' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: C.brand, marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.mutedLight }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Landscape */}
      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>
            Perth Business Landscape — 2026
          </h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Perth has quietly become the most compelling business location in Australia for independent operators. The narrative that east coast cities dominate commercial opportunity has obscured a structural advantage that has been building in Perth for a decade: a mining-sector income distribution that sustains premium spending at price points that would struggle in most Australian markets, combined with commercial rents that are still priced 30–45% below Sydney equivalents. For an operator running a quality café or restaurant, this is not a marginal advantage — it is the difference between a 5–8% rent-to-revenue ratio and a 16–19% one. At scale, that gap determines whether a business is viable or not.",
              "Subiaco is where Perth's case is most clearly demonstrated. Oxford Street generates foot traffic from a catchment averaging $105,000+ household income — comparable to Melbourne's Hawthorn or Sydney's Mosman — at commercial rents that would buy you a secondary location on a suburban strip in either of those cities. The café operators on Oxford Street are not running discount economics; they are running premium concepts with margins that their east coast counterparts can only achieve in exceptional circumstances. This is Perth's competitive reality in 2026, and it is largely invisible to operators who default to Sydney and Melbourne without modelling the alternatives.",
              "Leederville and Mount Lawley represent the next tier — and in some ways the better entry opportunity. Both are 20% below Subiaco rents with demographics that are functionally equivalent. Mount Lawley in particular has the best entry timing of any Perth suburb right now: Beaufort Street has improving foot traffic, thin competition supply relative to income quality, and rents that haven't yet reflected the gentrification trajectory. Operators who establish in Mount Lawley in 2025–2026 are doing so at a cost base that will look exceptional in three to five years as the strip matures.",
              "Perth's outer suburbs tell a different story. Joondalup is oversaturated — chains have already captured the viable commercial positions, and new independents face rent-to-revenue ratios that exceed viability thresholds. Midland has commercial vacancy above 18%, which is a market signal, not a discount opportunity. Armadale's household income is 26% below the Perth median, which constrains specialty pricing irrespective of execution quality. The outer Perth market is not uniformly bad — it is specifically problematic for the hospitality and specialty retail categories that benefit most from Perth's structural advantages. Those advantages accrue in the inner suburbs.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection
        suburbName="Perth"
        question="What type of business are you planning to open in Perth?"
        options={['Café or coffee shop', 'Restaurant or bar', 'Retail or boutique', 'Gym or wellness studio', 'Professional services']}
        initialVotes={[42, 24, 16, 11, 7]}
      />

      {/* By Business Type */}
      <section id="by-type" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Location Strategy by Business Type
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              {
                type: 'Cafés & Specialty Coffee',
                insight: "Perth's specialty coffee culture has matured significantly since 2021. Subiaco and Leederville are the strongest markets — high-income demographics, established café-going habits, and rents that support viable unit economics. Mount Lawley is the best emerging opportunity: thin competition, improving foot traffic.",
                best: ['Subiaco', 'Leederville', 'Mount Lawley'],
              },
              {
                type: 'Full-Service Restaurants',
                insight: "Perth dining supports premium pricing across inner suburbs. Subiaco anchors the highest average spend; Northbridge drives the highest volume. Fremantle works for heritage-character concepts with tourism adjacency. The CBD suits premium fine dining with corporate client channels.",
                best: ['Subiaco', 'Northbridge', 'Fremantle'],
              },
              {
                type: 'Retail (Independent)',
                insight: "Oxford Street (Subiaco) is Perth's strongest independent retail strip. Leederville appeals to lifestyle and creative retail. Mount Lawley is underserved for quality retail at its income level — early movers benefit from low competition and a loyal professional resident base.",
                best: ['Subiaco', 'Leederville', 'Mount Lawley'],
              },
              {
                type: 'Fitness & Wellness',
                insight: "Mining-sector demographics drive strong wellness spend in inner Perth. Subiaco and Leederville attract boutique studio operators who achieve high member acquisition through a relatively small but loyal local catchment. Perth's outdoor lifestyle culture supports premium fitness pricing.",
                best: ['Subiaco', 'Leederville', 'Northbridge'],
              },
              {
                type: 'Tourism-Adjacent Concepts',
                insight: "Fremantle is Perth's primary tourism hub — heritage precinct, working port, markets. Weekend tourist trade is strong from October to April. Operators positioned in the core Fremantle precinct access visitor spend that supplements local resident trade in a way that outer suburban strips cannot replicate.",
                best: ['Fremantle', 'Perth CBD', 'Northbridge'],
              },
              {
                type: 'Professional Services',
                insight: "Perth CBD and its St George's Terrace fringe anchor legal, financial, and corporate advisory. Subiaco serves the professional residential west. Leederville is emerging as a hub for creative-economy professional services — design, media, and tech-adjacent firms attracted by culture and rent.",
                best: ['Perth CBD', 'Subiaco', 'Leederville'],
              },
            ].map((bt) => (
              <div key={bt.type} style={{ padding: '20px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.brand, marginBottom: '8px' }}>{bt.type}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 10px' }}>{bt.insight}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {bt.best.map((s) => (
                    <span key={s} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', backgroundColor: C.n100, borderRadius: '4px', color: C.n700 }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Suburbs */}
      <section id="top-suburbs" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>
            Top Perth Suburbs to Open a Business (2026)
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>
            Ranked by engine-derived composite score across demand, rent viability, competition gap, seasonality, and growth trajectory. All scores computed from five-factor model — no manual overrides.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                rank: 1, name: 'Subiaco', slug: 'subiaco', score: pScore('Subiaco'), verdict: pVerdict('Subiaco') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$4,200/mo',
                body: "Perth's strongest inner commercial strip by every metric that matters. Oxford Street delivers consistent foot traffic from a catchment averaging $105K+ household income at commercial rents 40% below Sydney equivalents. The café rent-to-revenue ratio here (5–7%) is the best of any premium Australian suburb — operators who run tight concepts with strong margin discipline build equity faster here than in Melbourne's Fitzroy or Sydney's Surry Hills, at half the fixed cost.",
              },
              {
                rank: 2, name: 'Leederville', slug: 'leederville', score: pScore('Leederville'), verdict: pVerdict('Leederville') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$3,500/mo',
                body: "Leederville is Perth's best risk-adjusted entry point. Oxford Street Leederville runs at 20% below Subiaco rents with functionally equivalent demographics — professional households, high café spend frequency, and a growing independent food culture. The shorter strip means individual operator visibility is higher; a strong concept here builds a loyal following faster than on longer, more diffuse strips. Strong Wednesday–Saturday trade; Sunday brunch is the standout daypart.",
              },
              {
                rank: 3, name: 'Mount Lawley', slug: 'mount-lawley', score: pScore('Mount Lawley'), verdict: pVerdict('Mount Lawley') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$3,000/mo',
                body: "Beaufort Street is Perth's current best entry opportunity. Competition density is genuinely low for the income quality of the catchment — the street has not yet been fully discovered by operators who have been concentrating on Subiaco and Leederville. The demographic has been steadily professionalising over the past five years: younger FIFO workers and creative professionals moving into nearby Inglewood and Maylands increasingly spend on Beaufort Street. Operators who establish now set the quality baseline before the strip matures.",
              },
              {
                rank: 4, name: 'Northbridge', slug: 'northbridge', score: pScore('Northbridge'), verdict: pVerdict('Northbridge') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$4,000/mo',
                body: "Perth's highest foot traffic hospitality district. Northbridge generates real volume on Wednesday–Saturday evenings and Sunday brunch. The constraint is competition density: the strip has an established operator base that has already positioned for the key customer types. New entrants need a concept that clearly occupies a gap rather than competing head-on. Margins are tighter than Subiaco — not because rents are higher, but because the competitive set demands more precision in execution.",
              },
              {
                rank: 5, name: 'Perth CBD', slug: 'perth-cbd', score: pScore('Perth CBD'), verdict: pVerdict('Perth CBD') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$7,000/mo',
                body: "Perth CBD generates strong weekday lunch and after-work trade from professional services workers. The rent gap with Sydney CBD is significant — Perth CBD rents are 40–55% lower for comparable foot traffic zones. Hybrid work has reduced weekday density (similar to east coast cities), but Perth's office return rates have been stronger than Melbourne's. Premium fine dining and high-volume QSR work well; independent cafés in the $6.50/coffee range face structural volume requirements that are achievable but require disciplined site selection.",
              },
              {
                rank: 6, name: 'Fremantle', slug: 'fremantle', score: pScore('Fremantle'), verdict: pVerdict('Fremantle') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$3,500/mo',
                body: "Fremantle's heritage precinct, working port, and strong local community create a distinct commercial identity that draws visitors from across Perth on weekends. The tourism component is real: Fremantle Markets and the cappuccino strip attract interstate visitors and day-trippers year-round. The seasonality risk comes from a tourist-summer / local-winter pattern that requires operators to build a resident customer base during off-season months. Operators who model revenue from a January weekend consistently overpay for their lease.",
              },
              {
                rank: 7, name: 'Morley', slug: 'morley', score: pScore('Morley'), verdict: pVerdict('Morley') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$2,500/mo',
                body: "Morley's major commercial hub is anchored by Westfield Morley, which creates a gravitational effect that concentrates discretionary spend inside the centre rather than on surrounding strips. Strip operators compete against Westfield's convenience, parking, and tenant mix on an uneven footing. The exception: service categories Westfield doesn't serve well — allied health, specialist food, tutoring, and practical services — can operate successfully adjacent to the centre without facing this structural disadvantage.",
              },
              {
                rank: 8, name: 'Armadale', slug: 'armadale', score: pScore('Armadale'), verdict: pVerdict('Armadale') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$1,500/mo',
                body: "Armadale's median household income sits 26% below the Perth median — which is the fundamental constraint on all hospitality and specialty retail in this suburb. The low income demographic does not support specialty coffee pricing ($5.50+ per drink), premium brunch ($24+ per person), or independent retail at non-discount price points. Value-format food services and practical retail can operate viably at the low rent levels available. Premium concepts will not find the customer base they require regardless of execution quality.",
              },
              {
                rank: 9, name: 'Joondalup', slug: 'joondalup', score: pScore('Joondalup'), verdict: pVerdict('Joondalup') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$2,000/mo',
                body: "Joondalup is Perth's most oversaturated suburban commercial hub for independent café operators. The Coffee Club, Dome, and Gloria Jean's have already optimised for the catchment — their price points and service models are calibrated precisely for Joondalup's demographics. New independent operators entering this market face direct competition from chains with established loyalty, lower costs, and proven local positioning. Rent-to-revenue for a new independent entrant exceeds 22% at current market rents — above the sustainable threshold for most concepts.",
              },
              {
                rank: 10, name: 'Midland', slug: 'midland', score: pScore('Midland'), verdict: pVerdict('Midland') as 'GO' | 'CAUTION' | 'NO',
                rentFrom: '$1,500/mo',
                body: "Commercial vacancy above 18% on Great Northern Highway is the definitive market signal for Midland — the market has already voted against the economics of operating there. Vacancy at this level means foot traffic is below the threshold that sustains new entrants, rents that appear attractive are priced to reflect a genuinely distressed commercial environment, and any neighbouring vacancies will suppress customer confidence in the strip as a destination. The correct reading of low rents in Midland is market signal, not opportunity.",
              },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/perth/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '20px', alignItems: 'start', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                  <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                    <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textAlign: 'center', backgroundColor: suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg, color: suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red, border: `1px solid ${suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr}` }}>
                      {suburb.verdict}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                      <span style={{ fontSize: '12px', color: C.mutedLight }}>From {suburb.rentFrom}</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: C.muted, margin: 0 }}>{suburb.body}</p>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '52px' }}>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: C.brand, lineHeight: 1 }}>{suburb.score}</div>
                    <div style={{ fontSize: '10px', color: C.mutedLight, fontWeight: 600 }}>/ 100</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Page CTA */}
      <section style={{ padding: '48px 24px', background: `linear-gradient(135deg, #047857 0%, ${C.emerald} 100%)`, textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: '1.3' }}>
            Have a specific Perth address in mind?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>
            Get a full competitor map, rent benchmarks, foot traffic analysis, and GO/CAUTION/NO verdict for any Perth address. Free.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FFFFFF', color: C.emerald, borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Perth address →
          </Link>
        </div>
      </section>

      {/* Suburb Directory */}
      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
            Perth Suburb Directory — By Category
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>
            10 suburbs grouped by risk profile. Compare key metrics and link through to full suburb analysis pages.
          </p>

          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard
                    key={s.slug}
                    name={s.name}
                    slug={s.slug}
                    citySlug="perth"
                    description={s.description}
                    score={s.score}
                    verdict={s.verdict}
                    rentRange={s.rentRange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Factor Directory */}
      <PerthFactorDirectory />

      {/* Comparison Table */}
      <section id="comparisons" style={{ padding: '56px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
            Perth Suburb Comparison — Key Metrics
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>
            Side-by-side scoring across six suburbs. Use this to shortlist locations before running a full analysis.
          </p>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      {/* High-Risk Zones */}
      <section id="high-risk" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Where Perth Operators Get It Wrong
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              {
                title: "Assuming 'Perth is affordable' means every suburb works",
                body: "Perth's rent advantage is real but concentrated in the inner suburbs. Joondalup, Midland, and Armadale have low rents for a reason — the market has priced in structural demand constraints that no concept can overcome. The operators who fail in outer Perth consistently make the same mistake: they model on Perth's average income ($78K median) rather than the specific suburb's income distribution. Armadale's median is $57K. That difference makes specialty coffee pricing economically impossible regardless of quality.",
              },
              {
                title: "Underestimating Fremantle's seasonal revenue swing",
                body: "Fremantle generates genuine tourist trade from October to April that significantly inflates weekend and holiday revenue. Operators who sign their lease after a summer weekend in Fremantle and model annualised revenue from peak-season observations consistently overpay for their tenancy. The correct model: run profitably on the January–March resident base trade alone, and treat tourist uplift as unmodelled upside. Operators who require the tourist revenue to break even have miscalibrated their unit economics from day one.",
              },
              {
                title: "Competing head-on with chains in Joondalup",
                body: "Joondalup's chain penetration — The Coffee Club, Dome, Gloria Jean's, and others — represents a decade of market optimisation for the local demographic. These operators know the income level, the price sensitivity, and the peak trading periods better than any new entrant. Independent operators who try to position between the chains and their customers consistently lose on price-to-quality comparison. The viable position in Joondalup is above the chains (specialty product the chains can't replicate) or in a category they don't occupy — which narrows the viable concept set significantly.",
              },
              {
                title: 'Treating Northbridge as a launch market for untested concepts',
                body: "Northbridge has a self-selecting customer base that is experienced and demanding — the suburb has produced more hospitality openings per year than any other Perth precinct, and the customer base has been educated by that supply. New concepts that succeed in Northbridge typically arrive with proven execution, a clear point of difference, and financial reserves to survive the establishment period. Northbridge is not a forgiving testing ground — it is a mature market that rewards operator quality and punishes concepts that are discovering themselves in real time.",
              },
            ].map((item) => (
              <div key={item.title} style={{ padding: '24px', backgroundColor: C.n50, borderRadius: '10px', border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.amber}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: C.muted, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '32px' }}>
            Perth Location — Frequently Asked Questions
          </h2>
          <FAQSection faqs={FAQS} />
        </div>
      </section>

      {/* Internal Links */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>
            Explore Perth Suburb Analysis Pages
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { name: 'Subiaco',     slug: 'subiaco'     },
              { name: 'Leederville', slug: 'leederville' },
              { name: 'Mount Lawley',slug: 'mount-lawley'},
              { name: 'Northbridge', slug: 'northbridge' },
              { name: 'Fremantle',   slug: 'fremantle'   },
              { name: 'Perth CBD',   slug: 'perth-cbd'   },
              { name: 'Morley',      slug: 'morley'      },
              { name: 'Armadale',    slug: 'armadale'    },
              { name: 'Joondalup',   slug: 'joondalup'   },
              { name: 'Midland',     slug: 'midland'     },
            ].map((s) => (
              <Link
                key={s.slug}
                href={`/analyse/perth/${s.slug}`}
                style={{ padding: '8px 16px', backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: C.brand, textDecoration: 'none' }}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection
        title="Ready to choose your Perth location?"
        subtitle="Run a free analysis on any Perth address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis."
        buttonText="Analyse your Perth address free →"
        buttonHref="/onboarding"
      />
    </div>
  )
}
