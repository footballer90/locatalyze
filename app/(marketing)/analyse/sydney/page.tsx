// app/(marketing)/analyse/sydney/page.tsx
// Sydney city hub page — 2500-4000 word SEO optimised
// Uses shared components from components/analyse/

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getSydneySuburbs } from '@/lib/analyse-data/sydney'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Sydney — 2026 Location Guide',
  description:
    'Sydney business location guide 2026. 20 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Sydney suburb for your café, restaurant, retail or service business — with honest analysis of what works and what fails.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Sydney — 2026 Location Guide',
    description: '20 Sydney suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/sydney',
  },
}

const COMPARISON_ROWS = [
  { name: 'Surry Hills', score: 87, verdict: 'GO' as const, rent: '$8,000–$14,000', footTraffic: 'Very High', bestFor: 'Premium hospitality, specialty retail' },
  { name: 'Parramatta', score: 84, verdict: 'GO' as const, rent: '$3,500–$6,500', footTraffic: 'High', bestFor: 'Most categories, multicultural food' },
  { name: 'Chatswood', score: 82, verdict: 'GO' as const, rent: '$6,000–$10,000', footTraffic: 'High', bestFor: 'Asian market, professional services' },
  { name: 'North Sydney', score: 76, verdict: 'GO' as const, rent: '$5,500–$9,000', footTraffic: 'High (weekday)', bestFor: 'Corporate lunch, professional services' },
  { name: 'Ryde', score: 77, verdict: 'GO' as const, rent: '$3,000–$5,500', footTraffic: 'Medium-High', bestFor: 'Everyday café, services, health' },
  { name: 'Penrith', score: 76, verdict: 'GO' as const, rent: '$2,200–$4,000', footTraffic: 'Medium', bestFor: 'Value retail, services' },
  { name: 'Sydney CBD', score: 78, verdict: 'CAUTION' as const, rent: '$15,000–$38,000', footTraffic: 'Very High', bestFor: 'Premium/luxury concepts only' },
  { name: 'Ultimo', score: 68, verdict: 'CAUTION' as const, rent: '$3,500–$6,000', footTraffic: 'Medium (weekday)', bestFor: 'Budget cafés, student services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium — High Reward, High Risk',
    description: 'Inner ring with exceptional foot traffic. Punishing rents require premium unit economics and proven execution.',
    suburbs: [
      { name: 'Surry Hills', slug: 'surry-hills', description: "Sydney's premier hospitality district. 400+ food/drink venues, unmatched dining culture.", score: 87, verdict: 'GO' as const, rentRange: '$8,000–$14,000/mo' },
      { name: 'Sydney CBD', slug: 'sydney-cbd', description: 'Maximum foot traffic but $15K+ rent demands extremely high volume.', score: 78, verdict: 'CAUTION' as const, rentRange: '$15,000–$38,000/mo' },
      { name: 'Bondi', slug: 'bondi', description: 'Beach premium. Dual-season economics need solid off-peak planning.', score: 74, verdict: 'GO' as const, rentRange: '$7,000–$12,000/mo' },
    ],
  },
  {
    title: 'Growth — Best Risk/Return Balance',
    description: 'Professional suburbs where rent economics align with foot traffic. The smart operator choice for most business types.',
    suburbs: [
      { name: 'Parramatta', slug: 'parramatta', description: 'Best rent-to-foot-traffic ratio in Greater Sydney. 40,000+ daily workers.', score: 84, verdict: 'GO' as const, rentRange: '$3,500–$6,500/mo' },
      { name: 'Chatswood', slug: 'chatswood', description: 'North Shore epicentre with unmatched Asian market concentration.', score: 82, verdict: 'GO' as const, rentRange: '$6,000–$10,000/mo' },
      { name: 'North Sydney', slug: 'north-sydney', description: 'Corporate concentration. Under-served hospitality for worker density.', score: 76, verdict: 'GO' as const, rentRange: '$5,500–$9,000/mo' },
      { name: 'Ryde', slug: 'ryde', description: 'Quiet achiever. Professional growth post-COVID, moderate rents.', score: 77, verdict: 'GO' as const, rentRange: '$3,000–$5,500/mo' },
      { name: 'Burwood', slug: 'burwood', description: 'Inner west accessibility. Korean and Asian market well-established.', score: 75, verdict: 'GO' as const, rentRange: '$3,500–$6,000/mo' },
      { name: 'Hornsby', slug: 'hornsby', description: 'Northern corridor anchor. Underpriced for its catchment.', score: 72, verdict: 'GO' as const, rentRange: '$2,800–$5,000/mo' },
    ],
  },
  {
    title: 'Outer Growth — Value Plays',
    description: 'Western and outer suburbs with lower rents and improving demographics. Patience required, but clear upside for early movers.',
    suburbs: [
      { name: 'Penrith', slug: 'penrith', description: 'Olympics infrastructure reshaping Western Sydney. Growth trajectory strong.', score: 76, verdict: 'GO' as const, rentRange: '$2,200–$4,000/mo' },
      { name: 'Merrylands', slug: 'merrylands', description: 'Multicultural hub, strong loyalty patterns, low rent vs. demand.', score: 74, verdict: 'GO' as const, rentRange: '$2,000–$3,800/mo' },
      { name: 'Bankstown', slug: 'bankstown', description: 'Demographic diversity drives specialty food and services demand.', score: 70, verdict: 'GO' as const, rentRange: '$2,000–$3,500/mo' },
      { name: 'Blacktown', slug: 'blacktown', description: 'Large Western Sydney catchment. Non-premium concepts perform well.', score: 71, verdict: 'GO' as const, rentRange: '$1,800–$3,200/mo' },
      { name: 'Liverpool', slug: 'liverpool', description: 'Southwest anchor. Growing professional population base.', score: 73, verdict: 'GO' as const, rentRange: '$2,000–$3,800/mo' },
      { name: 'Auburn', slug: 'auburn', description: 'Inner west value play. Strong multicultural food market.', score: 71, verdict: 'GO' as const, rentRange: '$2,200–$4,000/mo' },
      { name: 'Campbelltown', slug: 'campbelltown', description: 'Southwest growth corridor. Healthcare and education drive employment.', score: 73, verdict: 'GO' as const, rentRange: '$1,800–$3,200/mo' },
    ],
  },
  {
    title: 'Speculative — Know Before You Go',
    description: 'Developing markets where specific niches work but general retail is challenging. Deep local knowledge essential.',
    suburbs: [
      { name: 'Ultimo', slug: 'ultimo', description: 'Student corridor near UTS. Works for daytime value concepts.', score: 68, verdict: 'CAUTION' as const, rentRange: '$3,500–$6,000/mo' },
      { name: 'Granville', slug: 'granville', description: 'Inner west affordability. Specific demographics reward targeted concepts.', score: 69, verdict: 'CAUTION' as const, rentRange: '$1,800–$3,200/mo' },
      { name: 'Fairfield', slug: 'fairfield', description: 'Multicultural strength; lower incomes limit some categories.', score: 67, verdict: 'CAUTION' as const, rentRange: '$1,600–$3,000/mo' },
      { name: 'Mount Druitt', slug: 'mount-druitt', description: 'Far west value position. Infrastructure lags demographic growth.', score: 68, verdict: 'CAUTION' as const, rentRange: '$1,400–$2,600/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to start a business in Sydney?',
    answer: "Parramatta (score 84) is the all-around strongest performer on our model — it delivers the best combination of foot traffic, demographics, and commercial rent viability. Surry Hills (87) scores higher but demands premium rent and proven unit economics. For hospitality, Surry Hills is the prestige market; for most other business types, Parramatta's economics are materially better.",
  },
  {
    question: 'Is Sydney CBD too expensive for independent businesses?',
    answer: "For most independent operators, yes. CBD retail rents of $15,000–$38,000/month require 300+ daily customers at average $50 spend just to cover rent. Add labour, COGS, and overheads, and break-even typically requires $450K–$600K annual revenue. Only high-volume, premium-priced concepts sustain these economics. Inner-ring alternatives like Surry Hills or North Sydney offer better risk-adjusted positions.",
  },
  {
    question: 'Which Western Sydney suburbs have the best business potential in 2026?',
    answer: "Parramatta (84) is the proven performer — established commercial precinct, strong foot traffic, improving professional demographics via Parramatta Square. Penrith (76) is the growth bet — Western Sydney Airport and Olympic infrastructure are fundamentally reshaping the Western corridor and Penrith rents haven't caught up yet. Merrylands (74) is underrated with multicultural demographic strength and low rent-to-revenue ratios.",
  },
  {
    question: 'What rent should I expect for retail in Sydney suburbs?',
    answer: 'Retail rents vary enormously. Inner ring (Surry Hills, Newtown, Bondi): $7,000–$14,000/month. North Shore (Chatswood, North Sydney): $6,000–$10,000/month. Middle ring (Ryde, Burwood, Hornsby): $3,000–$6,000/month. Western Sydney (Parramatta, Blacktown): $2,000–$5,000/month. Outer ring (Penrith, Liverpool, Campbelltown): $1,800–$4,000/month.',
  },
  {
    question: 'Which Sydney suburbs are underrated for cafés in 2026?',
    answer: "Ryde, Hornsby, and Merrylands are the three most underrated café markets in Greater Sydney. All three have professional demographics, growing residential populations, and café customer-to-venue ratios 3–4x more favourable than the oversaturated inner west. Rents are 50–60% lower than Surry Hills or Newtown with comparable or higher average household incomes.",
  },
  {
    question: 'How does hybrid work affect Sydney commercial locations?',
    answer: "The main impact is on CBD and inner-city lunch trade, which has not returned to pre-2020 levels. Office occupancy on peak Tuesdays and Wednesdays sits at 70–75%; Mondays and Fridays see 40–50% occupancy. Concepts dependent on the CBD worker lunch trade face structural headwinds. The counter-trend benefits middle-ring suburbs: professionals working from home 2–3 days/week spend more locally in their home suburb.",
  },
  {
    question: 'Is Parramatta a good location for a restaurant?',
    answer: "Yes — Parramatta is one of Sydney's best restaurant markets by risk-adjusted economics. The Parramatta Square development added 20,000+ professional and government workers with above-average household incomes ($105K+) to the Church Street precinct. Quality casual and multicultural dining have genuine supply gaps. Rents at $4,000–$7,000/month are half of comparable Surry Hills positions.",
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

function SydneyFactorDirectory() {
  const suburbs = getSydneySuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor =
          s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg =
          s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr =
          s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link
            key={s.slug}
            href={`/analyse/sydney/${s.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                backgroundColor: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '24px',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: verdictBg,
                    color: verdictColor,
                    border: `1px solid ${verdictBdr}`,
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.verdict}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>Café</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: C.brand }}>{s.cafe}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>Restaurant</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: C.brand }}>{s.restaurant}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>Retail</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: C.brand }}>{s.retail}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>Composite</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>{s.compositeScore}</div>
                  </div>
                </div>
              </div>

              {/* Key insight */}
              <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '760px' }}>
                {s.why[0]}
              </p>

              {/* FactorGrid */}
              <FactorGrid factors={s.locationFactors} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function SydneyPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
{/* Hero */}
      <CityHero
        cityName="Sydney"
        citySlug="sydney"
        tagline="Honest assessment of Australia's most expensive business market. Where the numbers work, where they don't, and the underrated suburbs most operators overlook."
        statChips={[
          { text: '20 suburbs scored — inner ring to outer west' },
          { text: 'Parramatta: best rent-to-foot-traffic ratio in Greater Sydney' },
          { text: 'CBD rents 40% above inner ring — rarely justified' },
        ]}
      />

      {/* Methodology Banner */}
      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Suburb scores are a five-dimensional composite — Rent Affordability, Competition, Market Demand, Profitability, and Location Quality — the same model used in the individual-address report. Suburb-level inputs come from ABS 2024 (demographic income and population), CoreLogic and CBRE Q1 2026 (rent benchmarks), Google Maps / Geoapify (competitor density within 500m), and Locatalyze foot-traffic and access scoring. An individual address can score meaningfully higher or lower than its suburb average.
          </p>
        </div>
      </div>

      {/* Jump Nav */}
      <nav style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
          {[
            { label: 'Top 20 Suburbs', href: '#top-20' },
            { label: 'By Business Type', href: '#by-type' },
            { label: 'Suburb Directory', href: '#suburbs' },
            { label: 'Comparisons', href: '#comparisons' },
            { label: 'High-Risk Zones', href: '#high-risk' },
            { label: 'Factor Breakdown', href: '#factor-directory' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: C.n700,
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '5px',
                backgroundColor: C.n50,
                border: `1px solid ${C.border}`,
                whiteSpace: 'nowrap',
              }}
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
              { value: '$2.1T', label: "Sydney metro GDP — largest urban economy in Southern Hemisphere", source: 'Oxford Economics 2025' },
              { value: '31%', label: 'Hospitality businesses fail in year 1 in inner Sydney', source: 'IBISWorld 2025' },
              { value: '40%', label: 'Lower commercial rents in Western Sydney vs inner ring', source: 'CBRE Q1 2026' },
              { value: '$92K', label: 'Average household income in Parramatta corridor', source: 'ABS 2024' },
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

      {/* Business Landscape — Full Overview */}
      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>
            Sydney Business Landscape — 2026
          </h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Sydney is simultaneously the best and worst place to start a business in Australia. Worst because commercial rents in the CBD and inner ring suburbs are among the highest globally — a 50sqm retail space in Surry Hills costs $9,000–$12,000 monthly. Best because the metropolitan population of 5.3 million, combined with some of the highest discretionary incomes on the continent, creates massive addressable markets. Understanding this tension separates thriving businesses from failed ones.",
              "The inner ring versus outer west divide is the single most important economic variable in Sydney location strategy. A 185sqm restaurant in Surry Hills costs $120,000–$144,000 per year in rent. The same footprint in Parramatta costs $54,000–$72,000. That $50,000+ difference is the margin between profitable and insolvent for independent operators. Parramatta captures 70% of Surry Hills foot traffic at 45% of the rent — yet Parramatta is not fully discovered. The real opportunity lies in the middle tier: suburbs like Auburn, Merrylands, and Hornsby, where rents sit 60–70% below inner suburbs but foot traffic and income demographics remain viable.",
              "Western Sydney's trajectory has been reshaped permanently by infrastructure investment. Parramatta Square brought 20,000+ public servants to a previously office-light precinct. The M12 motorway and Western Sydney Airport at Badgerys Creek are transforming fringe suburbs that were unviable five years ago. Operators who position now — before rents normalize — capture the asymmetric upside. The window is not unlimited: Parramatta rents rose 15–18% from 2023 to 2025 and will continue rising as the catchment matures.",
              "Post-COVID hybrid work has produced a counterintuitive demographic shift. CBD lunch trade never fully recovered; office density sits at 65–70% of pre-2020 levels on peak days. But hybrid workers migrating from inner to middle suburbs have elevated spending density in the 12–18km band. Suburbs like Ryde, Burwood, and Merrylands saw 15–20% increases in daytime foot traffic from 2022 to 2025 as this cohort reshaped neighbourhood commerce.",
              "The inner west café saturation problem is real and underreported. Newtown, Surry Hills, and Glebe have 4–6x the café density of comparable-income suburbs globally. Break-even requires 300+ covers per day. The more interesting café markets are now in second-tier suburbs with growing professional populations — Ryde, Hornsby, and parts of Western Sydney — where customer-to-café ratios remain favourable and rents are half of Newtown's. For new café operators, the inner west is a proving ground for the brave; the middle suburbs are where the economics are actually sound.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

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
                insight: 'Inner west is oversaturated — break-even requires 300+ daily covers. The better opportunity is in Ryde, Hornsby, and Parramatta, where customer-to-café ratios are 3–4x more favourable.',
                best: ['Parramatta', 'Ryde', 'Hornsby'],
              },
              {
                type: 'Full-Service Restaurants',
                insight: 'Full-service dining requires $90K+ household income to sustain $60–$80 average covers. Surry Hills, Chatswood, North Sydney, and Parramatta (quality casual) meet this threshold.',
                best: ['Surry Hills', 'Chatswood', 'North Sydney'],
              },
              {
                type: 'Retail (Independent)',
                insight: "Premium positioning works in CBD and Chatswood. Value retail works in Parramatta and outer west. The squeezed middle is struggling — Westfield dominance has consolidated mid-tier spend.",
                best: ['Chatswood', 'Parramatta', 'Bankstown'],
              },
              {
                type: 'Fitness & Wellness',
                insight: 'Boutique studios cluster in Eastern Suburbs and Inner West. Scale gyms work in Parramatta and outer west. Allied health grows linearly with income across all growth suburbs.',
                best: ['Surry Hills', 'Bondi', 'Chatswood'],
              },
              {
                type: 'Professional Services',
                insight: 'Legal, accounting, and financial advisory follows corporate concentration. North Sydney, CBD fringe, and Parramatta Square are the anchor markets for professional services.',
                best: ['North Sydney', 'Parramatta', 'CBD fringe'],
              },
              {
                type: 'Multicultural Food & Specialty',
                insight: "Sydney's multicultural communities create specialty markets with exceptional repeat loyalty. Parramatta (Lebanese, Indian), Bankstown (Vietnamese), Chatswood (Asian) each support distinct specialist operators.",
                best: ['Parramatta', 'Bankstown', 'Chatswood'],
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

      {/* ── TOP 20 SUBURBS ── */}
      <section id="top-20" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>
            Top 20 Suburbs to Open a Business in Sydney (2026)
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>
            Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory. Each entry is honest about what works and what doesn't.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                rank: 1, name: 'Surry Hills', slug: 'surry-hills', score: 87, verdict: 'GO' as const,
                rentFrom: '$8,000/mo',
                body: "Sydney's benchmark hospitality address. Over 400 food and drink venues, yet demand consistently absorbs strong operators. Rents are the highest risk factor — $10,000–$14,000/month means you need to be running 280+ covers daily. Premium concept or differentiated café only. Generic concepts will be outcompeted within 18 months.",
              },
              {
                rank: 2, name: 'Parramatta', slug: 'parramatta', score: 84, verdict: 'GO' as const,
                rentFrom: '$3,500/mo',
                body: "The clearest value-per-dollar location in Greater Sydney. Parramatta Square brought 20,000+ professional and government workers to a previously retail-dominated precinct, permanently upgrading the spending profile. At $5,500/month on Church Street, you're getting 70% of inner-Sydney foot traffic at 40% of the rent. Best for: quality casual dining, specialty coffee, multicultural food, professional services.",
              },
              {
                rank: 3, name: 'Chatswood', slug: 'chatswood', score: 82, verdict: 'GO' as const,
                rentFrom: '$6,000/mo',
                body: "Chatswood's competitive edge is demographic specificity — it has the highest concentration of East and Southeast Asian residents in Sydney. This creates a specialty market (bubble tea, Asian bakeries, Japanese food, Korean BBQ) that is unavailable at this scale anywhere else in Greater Sydney. Non-culturally-specific operators underperform here; targeted Asian concepts are among the most profitable in the metro area.",
              },
              {
                rank: 4, name: 'Ryde', slug: 'ryde', score: 77, verdict: 'GO' as const,
                rentFrom: '$3,000/mo',
                body: "Ryde is Sydney's quiet achiever — consistently underpriced relative to its demographic quality. Professional population grew 18% from 2020–2025 as hybrid workers settled here from the Inner North. Café customer-to-venue ratios are among the best in Sydney's middle ring. Shepherd's Bay precinct adds commercial density without proportional supply. Best for: everyday cafés, allied health, professional services.",
              },
              {
                rank: 5, name: 'North Sydney', slug: 'north-sydney', score: 76, verdict: 'GO' as const,
                rentFrom: '$5,500/mo',
                body: "80,000 office workers — and hospitality supply that hasn't kept pace. North Sydney has the highest ratio of corporate workers to food/beverage venues of any major Sydney centre. Hybrid work reduced occupancy but peak Tuesday–Thursday remains 70–75%. The gap: quality casual restaurants and specialty coffee in the $15–$50 transaction range. Currently underserved.",
              },
              {
                rank: 6, name: 'Penrith', slug: 'penrith', score: 76, verdict: 'GO' as const,
                rentFrom: '$2,200/mo',
                body: "Western Sydney Airport and Olympic infrastructure are the defining factors. Penrith's rent has not caught up to its 5-year growth trajectory. A quality café operator paying $3,200/month in Penrith today is getting positioning that will be worth significantly more by 2028. Risk: the growth curve is real but not yet delivered. Suits operators willing to take a 3–5 year view.",
              },
              {
                rank: 7, name: 'Burwood', slug: 'burwood', score: 75, verdict: 'GO' as const,
                rentFrom: '$3,500/mo',
                body: "Korean food culture in Burwood has created a specialty market with customer loyalty that rivals established inner-city strips. The key demographic is Korean-Australian and broader Asian-Australian community with above-average household incomes. Burwood benefits from proximity to both Strathfield (professional) and Auburn (value market), creating a hybrid catchment.",
              },
              {
                rank: 8, name: 'Liverpool', slug: 'liverpool', score: 73, verdict: 'GO' as const,
                rentFrom: '$2,000/mo',
                body: "Liverpool's hospital, university, and TAFE create stable anchor employment that drives consistent weekday trade. Healthcare-adjacent businesses (allied health, health food, pharmacy) are among the best performers here. Retail has been challenged by Westfield Liverpool concentration, but professional services and health businesses are underserved relative to employment density.",
              },
              {
                rank: 9, name: 'Campbelltown', slug: 'campbelltown', score: 73, verdict: 'GO' as const,
                rentFrom: '$1,800/mo',
                body: "Southwest growth spine with dual employment anchors: Campbelltown Hospital (5,000+ workers) and Western Sydney University. The hospital workforce creates reliable weekday demand for health food, cafés, and allied health services. Commercial rent is among the lowest viable positions in Sydney's metro area. Best for: everyday hospitality, allied health, professional services.",
              },
              {
                rank: 10, name: 'Merrylands', slug: 'merrylands', score: 74, verdict: 'GO' as const,
                rentFrom: '$2,000/mo',
                body: "Merrylands is consistently underestimated because it lacks the headline recognition of Parramatta. But the multicultural community cohesion here — Lebanese, Pacific Islander, South Asian — creates loyalty patterns that inner-city operators rarely achieve. Once a customer finds their preferred food business in Merrylands, they return weekly without the fickleness of inner-city dining trends.",
              },
              {
                rank: 11, name: 'Hornsby', slug: 'hornsby', score: 72, verdict: 'GO' as const,
                rentFrom: '$2,800/mo',
                body: "Northern corridor anchor serving a 180,000+ catchment at prices significantly below Chatswood. The professional population is established and underserved for quality hospitality — particularly in the $20–$45 lunch range. Hornsby Westfield anchors foot traffic, but the surrounding strip has independent operator opportunity that Westfield doesn't cover.",
              },
              {
                rank: 12, name: 'Auburn', slug: 'auburn', score: 71, verdict: 'GO' as const,
                rentFrom: '$2,200/mo',
                body: "10km from the CBD with rents at 25% of Surry Hills — Auburn's location economics are extraordinary for operators who understand the market. The Turkish and Middle Eastern specialty food market here has loyal community spending patterns. Auburn Road generates consistent foot traffic 6 days per week. Not a generic market; a specific, loyal demographic market.",
              },
              {
                rank: 13, name: 'Bankstown', slug: 'bankstown', score: 70, verdict: 'GO' as const,
                rentFrom: '$2,000/mo',
                body: "Vietnamese, Lebanese, Cambodian, and Southeast Asian communities create a specialty food market with strong community spending. The demographic diversity is Bankstown's strength — multicultural food operators find loyal customer bases across different communities. Lower average incomes ($62K household) limit premium positioning but make value-positioned businesses highly viable.",
              },
              {
                rank: 14, name: 'Blacktown', slug: 'blacktown', score: 71, verdict: 'GO' as const,
                rentFrom: '$1,800/mo',
                body: "Western Sydney's largest population node at 380,000+. Westpoint shopping centre anchors a significant retail catchment. Best for high-volume, value-positioned concepts serving a broad Western Sydney demographic. Not a premium market — average household income of $71K means price sensitivity is real. But the sheer population density makes volume plays viable.",
              },
              {
                rank: 15, name: 'Bondi', slug: 'bondi', score: 74, verdict: 'GO' as const,
                rentFrom: '$7,000/mo',
                body: "Beach lifestyle premium creates an aspirational consumer base willing to pay $7 for a flat white and $30 for a brunch. The challenge is dual-season economics: January–March summer peak at 150% of normal trade, versus June–August winter at 60%. Operators who can't manage seasonal cash flow will struggle despite strong peak revenue. The market rewards precision operators.",
              },
              {
                rank: 16, name: 'Ultimo', slug: 'ultimo', score: 68, verdict: 'CAUTION' as const,
                rentFrom: '$3,500/mo',
                body: "45,000 UTS students create consistent daytime demand Monday–Friday — but semester breaks produce 15 weeks/year of 40–50% revenue gaps. The competition gap (74) is real: only 6 independent cafés for a 45,000-student catchment. This market works for operators who plan around the academic calendar and price for a student demographic ($12–$16 average spend).",
              },
              {
                rank: 17, name: 'Granville', slug: 'granville', score: 69, verdict: 'CAUTION' as const,
                rentFrom: '$1,800/mo',
                body: "Inner west affordability play — 12km from CBD at Western Sydney rents. The multicultural market (Middle Eastern, South Asian) creates specialty food demand but average household incomes of $67K constrain premium positioning. Works for operators who understand the specific community market; underperforms for generic concepts seeking cheap rent.",
              },
              {
                rank: 18, name: 'Fairfield', slug: 'fairfield', score: 67, verdict: 'CAUTION' as const,
                rentFrom: '$1,600/mo',
                body: "Vietnamese and Cambodian community concentration creates a specialty food market with loyalty characteristics. Fairfield food culture is genuine and under-recognised — Vietnamese banh mi and pho operators here have operated for 20+ years. Lower average incomes ($55K) make premium positioning very difficult; value-positioned specialty food concepts succeed.",
              },
              {
                rank: 19, name: 'Mount Druitt', slug: 'mount-druitt', score: 68, verdict: 'CAUTION' as const,
                rentFrom: '$1,400/mo',
                body: "Far west value position with improving infrastructure. Western Sydney Airport investment is beginning to impact the outer west corridor, but Mount Druitt's commercial viability is 3–5 years from maturing. For operators with patient capital and value positioning, early entry captures the asymmetric upside. Not a market for operators who need immediate returns.",
              },
              {
                rank: 20, name: 'Sydney CBD', slug: 'sydney-cbd', score: 78, verdict: 'CAUTION' as const,
                rentFrom: '$15,000/mo',
                body: "The paradox suburb: highest foot traffic in Australia, worst unit economics for independent operators. Hybrid work has permanently reduced weekday lunchtime populations by 25–30%. Office vacancy sits at 12.5%. Premium and luxury concepts work — they have the demographics and margin structure to absorb $25,000+/month rents. Volume-dependent independent operators consistently fail here.",
              },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr auto',
                    gap: '20px',
                    alignItems: 'start',
                    padding: '20px 24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {/* Rank */}
                  <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '3px 7px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        backgroundColor: suburb.verdict === 'GO' ? C.emeraldBg : C.amberBg,
                        color: suburb.verdict === 'GO' ? C.emerald : C.amber,
                        border: `1px solid ${suburb.verdict === 'GO' ? C.emeraldBdr : C.amberBdr}`,
                      }}
                    >
                      {suburb.verdict}
                    </div>
                  </div>
                  {/* Content */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                      <span style={{ fontSize: '12px', color: C.mutedLight }}>From {suburb.rentFrom}</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: C.muted, margin: 0 }}>{suburb.body}</p>
                  </div>
                  {/* Score */}
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

      {/* ── MID-PAGE CTA ── */}
      <section
        style={{
          padding: '48px 24px',
          background: `linear-gradient(135deg, #047857 0%, ${C.emerald} 100%)`,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: '1.3' }}>
            Have a specific Sydney address in mind?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>
            Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Sydney address. Free.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '14px 30px',
              backgroundColor: '#FFFFFF',
              color: C.emerald,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 800,
            }}
          >
            Analyse your Sydney address →
          </Link>
        </div>
      </section>

      {/* Suburb Directory */}
      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
            Sydney Suburb Directory — By Category
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>
            20 suburbs grouped by risk profile. Use these cards to compare key metrics and link to full suburb analysis pages.
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
                    citySlug="sydney"
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

      {/* Comparison Table */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Quick Comparison — Top Sydney Suburbs
          </h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      {/* Head-to-Head */}
      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Head-to-Head: Suburb Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'Parramatta vs Sydney CBD',
                body: "Parramatta captures 70% of CBD foot traffic at 40% of the rent. For most independent operators — cafés, restaurants, retail — the economics work materially better in Parramatta. The exception is luxury or premium positioning: CBD commands aspirational demographics that justify $25,000+/month rents for high-ticket concepts. But for operators targeting the $30–$80 transaction range, Parramatta's Church Street delivers superior unit economics.",
              },
              {
                title: 'Surry Hills vs Parramatta',
                body: "Surry Hills is Sydney's premium hospitality address with proven market demand and wealthy demographics. The bar to entry is steep: rents of $10,000–$14,000/month require daily foot traffic that only established, highly differentiated concepts reliably achieve. Parramatta is the operator's choice for a sustainable business — lower risk, acceptable growth ceiling, and the infrastructure tailwind from the Olympic corridor.",
              },
              {
                title: 'Chatswood vs North Sydney',
                body: "Chatswood's unique advantage is the highest density of East and Southeast Asian residents in Sydney — a specialised market that rewards culturally-specific concepts. North Sydney is a pure corporate market — stronger for lunch-focused operators. North Sydney suffers from hybrid work trends reducing office occupancy; Chatswood is more residential and thus more resilient.",
              },
              {
                title: 'Blacktown vs Penrith',
                body: "Both serve the outer west with different risk profiles. Blacktown has larger population density and more established retail infrastructure (Westpoint). Penrith is undergoing structural transformation via the Western Sydney Airport and Olympic infrastructure — the 5-year growth curve looks steeper. Blacktown is lower risk now; Penrith is a growth bet.",
              },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Underrated Suburbs */}
      <section style={{ padding: '48px 24px', backgroundColor: C.purpleBg }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
            Underrated Sydney Suburbs
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>
            Markets that consistently outperform their reputation — and their rent.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Merrylands', slug: 'merrylands', why: "Consistently underestimated. Merrylands has multicultural community cohesion that drives higher revisit rates than comparable Western Sydney suburbs. Rents are 50% below Surry Hills with solid accessibility via Merrylands station." },
              { name: 'Auburn', slug: 'auburn', why: "Auburn's inner west location (10km from CBD) means it catches the professional spillover from Burwood and Strathfield at half the rent. Turkish and Middle Eastern community creates specialty food loyalty unavailable in most suburbs." },
              { name: 'Ryde', slug: 'ryde', why: "Ryde is the quiet achiever of Sydney's north. Score 77 without the headline recognition. Growing professional population post-COVID, strong income demographics, and a café market that is not oversaturated." },
              { name: 'Hornsby', slug: 'hornsby', why: "Northern corridor anchor at $2,800–$5,000/month for positions serving the same demographic as suburbs charging double. Population growth and infrastructure investment make this a strong 5-year proposition." },
            ].map((gem) => (
              <Link key={gem.slug} href={`/analyse/sydney/${gem.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '22px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.n900, margin: 0 }}>{gem.name}</h3>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', backgroundColor: C.purpleBg, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.2)' }}>UNDERRATED</span>
                  </div>
                  <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.65', margin: 0 }}>{gem.why}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* High Risk Zones */}
      <section id="high-risk" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>High-Risk Zones</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>
            Oversaturated or economically challenging locations where most independent operators struggle.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              {
                name: 'Glebe',
                why: "Glebe suffers from high rent ($7,000–$11,000/mo), declining foot traffic post-pandemic, and severe café oversaturation. Glebe Point Road has more independent cafés per capita than almost anywhere in Australia. Unless you have a deeply differentiated concept and 12+ months of runway, avoid.",
              },
              {
                name: 'Newtown (King Street)',
                why: "King Street has 70+ food and drink venues. Average lifespan of independent cafés on this strip is under 3 years. Rent is $7,500–$13,000/month with the expectation of 250+ daily covers. A handful of operators thrive; the majority are breakeven at best.",
              },
              {
                name: 'Sydney CBD (Premium Retail)',
                why: "CBD retail rents remain structurally high despite declining 8% from 2023 peaks. Hybrid work has permanently reduced the lunchtime population by 25–30%. Office vacancy sits at 12.5% (JLL Q1 2026). Volume-dependent operations face a mathematical problem.",
              },
            ].map((zone) => (
              <div key={zone.name} style={{ padding: '22px', backgroundColor: C.redBg, borderRadius: '10px', border: `1px solid ${C.redBdr}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>{zone.name}</h3>
                <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>{zone.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT PEOPLE GET WRONG ── */}
      <section style={{ padding: '60px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.3' }}>
            What Most Sydney Operators Get Wrong
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px' }}>
            Four location mistakes that separate failed businesses from successful ones in Greater Sydney.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'Assuming inner-west means success',
                body: "The inner-west café market (Newtown, Glebe, Surry Hills) has a reputation that attracts operators who haven't run the numbers. At $10,000/month rent, your café needs 250+ covers daily before you earn a dollar of profit. Most inner-west operators are running between 140–180 covers. They're not thriving — they're grinding.",
              },
              {
                title: 'Underestimating the Parramatta premium opportunity',
                body: "Most operators who 'consider' Parramatta still think of it as the old version. The post-Parramatta-Square demographic is different: $105K+ household incomes among workers who walk from glass office towers to Church Street for lunch. There is no quality casual dining on Church Street. That gap is real money for the right operator.",
              },
              {
                title: 'Confusing foot traffic with revenue',
                body: "Ultimo has 45,000 students and moderate foot traffic scores. What the score doesn't capture: 90% of those students spend $10–$15 per visit, and they're gone entirely for 15 weeks per year. High foot traffic at low average spend with seasonal gaps produces the same revenue as lower foot traffic with consistent, higher-spending customers.",
              },
              {
                title: "CBD as a safe bet",
                body: "The CBD feels safe because foot traffic is visible. But the $20,000+/month rent is invisible until month three when the cash flow statement arrives. CBD retail vacancy is 12.5% — that's not a sign of a healthy market. That's a sign that many operators have already discovered the economics don't work.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '24px',
                  backgroundColor: C.n50,
                  borderRadius: '12px',
                  border: `1px solid ${C.border}`,
                  borderTop: `3px solid ${C.brand}`,
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.n900, marginBottom: '10px', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.7', margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should NOT Open in Sydney */}
      <section style={{ padding: '56px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.3' }}>
            Who Should Not Open in Sydney
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '760px' }}>
            Sydney is not the right market for every operator. These situations reliably produce poor outcomes — not because the businesses are bad, but because the economics of specific Sydney locations do not match their requirements.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'New operators without 12 months of capital',
                body: "Sydney's first-year failure rate for hospitality is 31% (IBISWorld 2025). Most failures are not caused by a bad concept — they are caused by insufficient capital to survive the learning curve and seasonal variations. If you have less than 12 months of operating capital after fit-out, consider a lower-rent market first.",
              },
              {
                title: 'Volume-dependent concepts in the CBD',
                body: "If your business model requires 250+ covers per day, the CBD is the only Sydney location with sufficient foot traffic. But CBD rents require $450K–$600K annual revenue just to cover occupancy. For the majority of independent operators, this maths does not resolve. CBD concepts need high average spend, not just high volume.",
              },
              {
                title: 'Operators who want low rent and high foot traffic simultaneously',
                body: "This combination does not exist in Sydney. Low-rent positions (Western Sydney, outer ring) have proportionally lower foot traffic. High foot traffic positions (inner ring, CBD) have proportionally higher rents. The best risk-adjusted positions — like Parramatta — offer an efficient compromise, but no suburb delivers both extremes simultaneously.",
              },
              {
                title: 'Premium concepts without differentiation',
                body: "Surry Hills and Newtown are saturated with well-executed hospitality. A premium café or restaurant needs genuine differentiation — not just quality, but a distinct position that the market does not already have. Generic 'quality' does not command a premium in markets that already have 400+ quality options within 2km.",
              },
              {
                title: 'Weekend-only revenue models',
                body: "Weekend-dependent businesses in Sydney's middle and outer suburbs face a structural revenue challenge. The strong weekend markets (Bondi, Inner West, CBD fringe) also command the highest rents. Value-positioned outer-ring businesses often have lower weekend foot traffic. Build your model on weekday revenue first, weekends as upside.",
              },
              {
                title: 'Concepts designed for a different city',
                body: "A business concept optimised for Melbourne's café culture, Brisbane's outdoor hospitality, or a regional market often underperforms when transplanted to Sydney without local adaptation. Sydney's demographics, price sensitivity, and competitive density differ significantly from other Australian cities. The same concept requires Sydney-specific positioning.",
              },
            ].map((item) => (
              <div key={item.title} style={{ padding: '22px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.n900, marginBottom: '8px', lineHeight: '1.4' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.65', margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n900 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: C.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Location Intelligence
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: '1.3' }}>
            Don't guess. Choosing the wrong Sydney location costs 6–12 months of revenue.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '28px', lineHeight: '1.65' }}>
            Get foot traffic analysis, competitor mapping, rent benchmarks, and a GO/CAUTION/NO verdict for any Sydney address. Free. Takes 3 minutes.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/onboarding"
              style={{
                display: 'inline-block',
                padding: '13px 28px',
                backgroundColor: C.emerald,
                color: '#FFFFFF',
                borderRadius: '7px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Analyse your Sydney address →
            </Link>
            <Link
              href="/analyse/sydney/parramatta"
              style={{
                display: 'inline-block',
                padding: '13px 24px',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                borderRadius: '7px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Read Parramatta analysis
            </Link>
          </div>
        </div>
      </section>

      {/* ── Factor Directory ── */}
      <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Sydney Suburb Factor Breakdown — All 60 Markets
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>
            Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.
          </p>
          <SydneyFactorDirectory />
        </div>
      </section>

      {/* FAQ — Fixed visibility with new component */}
      <FAQSection faqs={FAQS} title="Sydney Business Location — FAQ" id="faq" />

      {/* CTA */}
      <CTASection
        title="Ready to find your Sydney location?"
        subtitle="First report free on any Sydney address — foot traffic, demographics, rent benchmarks, and competitive analysis in ~90 seconds. No credit card required."
        variant="green"
      />

      {/* Footer Nav */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/sydney/parramatta" style={{ color: C.brand, textDecoration: 'none' }}>Parramatta Analysis →</Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: C.brand, textDecoration: 'none' }}>Surry Hills Analysis →</Link>
          <Link href="/analyse/sydney/ultimo" style={{ color: C.brand, textDecoration: 'none' }}>Ultimo Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
