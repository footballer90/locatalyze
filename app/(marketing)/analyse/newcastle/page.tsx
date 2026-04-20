// app/(marketing)/analyse/newcastle/page.tsx
// Newcastle city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getNewcastleSuburb, getAllNewcastleSuburbs } from '@/lib/newcastle-suburbs'

function nScore(slug: string): number {
  return getNewcastleSuburb(slug)?.compositeScore ?? 0
}
function nVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getNewcastleSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Newcastle NSW — 2026 Location Guide',
  description:
    'Newcastle business location guide 2026. 20 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Newcastle suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/newcastle' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Newcastle NSW — 2026 Location Guide',
    description: '20 Newcastle suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/newcastle',
  },
}

const COMPARISON_ROWS = [
  { name: 'Merewether', score: nScore('merewether'), verdict: nVerdict('merewether'), rent: '$2,200–$4,200', footTraffic: 'Medium-High', bestFor: 'Specialty cafe, brunch destination, lifestyle retail' },
  { name: 'Cooks Hill', score: nScore('cooks-hill'), verdict: nVerdict('cooks-hill'), rent: '$2,500–$5,000', footTraffic: 'High', bestFor: 'Specialty cafe, independent restaurant, boutique retail' },
  { name: 'Hamilton', score: nScore('hamilton'), verdict: nVerdict('hamilton'), rent: '$2,000–$4,500', footTraffic: 'High', bestFor: 'Restaurant, cafe, specialty food, service business' },
  { name: 'Newcastle CBD', score: nScore('newcastle-cbd'), verdict: nVerdict('newcastle-cbd'), rent: '$3,500–$8,500', footTraffic: 'Very High', bestFor: 'Premium dining, high-volume hospitality, retail' },
  { name: 'Honeysuckle', score: nScore('honeysuckle'), verdict: nVerdict('honeysuckle'), rent: '$3,000–$6,500', footTraffic: 'High (seasonal)', bestFor: 'Waterfront dining, cafe, leisure retail' },
  { name: 'Adamstown', score: nScore('adamstown'), verdict: nVerdict('adamstown'), rent: '$1,200–$2,500', footTraffic: 'Medium', bestFor: 'First-mover cafe, community dining, allied health' },
  { name: 'Wickham', score: nScore('wickham'), verdict: nVerdict('wickham'), rent: '$1,200–$2,800', footTraffic: 'Medium', bestFor: 'Creative concept, cafe, light-industrial food business' },
  { name: 'Charlestown', score: nScore('charlestown'), verdict: nVerdict('charlestown'), rent: '$2,000–$4,500', footTraffic: 'High', bestFor: 'High-volume hospitality, franchise, convenience retail' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium Inner Suburbs — High Reward, High Entry',
    description: "Newcastle's benchmark hospitality strips. Strong customer quality and genuine street life, but rents and competition require clear positioning.",
    suburbs: [
      { name: 'Cooks Hill', slug: 'cooks-hill', description: "Darby Street is the strongest independent hospitality strip in regional NSW — Newcastle's equivalent of Fitzroy's Brunswick Street.", score: nScore('cooks-hill'), verdict: nVerdict('cooks-hill'), rentRange: '$2,500–$5,000/mo' },
      { name: 'Merewether', slug: 'merewether', description: "Affluent beach suburb with the best cafe unit economics in Newcastle. High incomes, low competition, and beach lifestyle driving year-round brunch demand.", score: nScore('merewether'), verdict: nVerdict('merewether'), rentRange: '$2,200–$4,200/mo' },
      { name: 'Hamilton', slug: 'hamilton', description: "Beaumont Street is Newcastle's dining spine — diverse cuisine mix, strong local loyalty, and the highest restaurant density outside the CBD.", score: nScore('hamilton'), verdict: nVerdict('hamilton'), rentRange: '$2,000–$4,500/mo' },
      { name: 'Newcastle CBD', slug: 'newcastle-cbd', description: "Hunter Street and the revitalised CBD precinct. Light rail has restored pedestrian life. Best for high-volume concepts with premium positioning.", score: nScore('newcastle-cbd'), verdict: nVerdict('newcastle-cbd'), rentRange: '$3,500–$8,500/mo' },
    ],
  },
  {
    title: 'Growth Strips — Best Risk/Return',
    description: "Suburbs where demand is proven but rents have not fully repriced. The window for smart operator entry is open.",
    suburbs: [
      { name: 'Honeysuckle', slug: 'honeysuckle', description: 'Waterfront dining precinct with strong weekend trade. Event-driven uplift from Newcastle Entertainment Centre. Seasonal risk managed by local repeat trade.', score: nScore('honeysuckle'), verdict: nVerdict('honeysuckle'), rentRange: '$3,000–$6,500/mo' },
      { name: 'The Junction', slug: 'junction', description: 'Community-first suburban strip between Cooks Hill and Merewether. Loyal local catchment with lower rents than both premium neighbours.', score: nScore('junction'), verdict: nVerdict('junction'), rentRange: '$1,500–$3,200/mo' },
      { name: 'Waratah', slug: 'waratah', description: 'Hospital-worker demand base creates reliable weekday trade. Underserved by quality independents with genuine first-mover space.', score: nScore('waratah'), verdict: nVerdict('waratah'), rentRange: '$1,000–$2,200/mo' },
      { name: 'Adamstown', slug: 'adamstown', description: 'Established residential catchment with low competition and the lowest rents near the inner ring. Reliable community foot traffic.', score: nScore('adamstown'), verdict: nVerdict('adamstown'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
  {
    title: 'Emerging — First-Mover Opportunity',
    description: 'Gentrifying precincts where rents are low and early operators can lock in leases before demographics fully mature.',
    suburbs: [
      { name: 'Wickham', slug: 'wickham', description: 'Light rail connectivity is accelerating gentrification. Creative class moving in. Lowest inner-ring rents available to operators willing to build the market.', score: nScore('wickham'), verdict: nVerdict('wickham'), rentRange: '$1,200–$2,800/mo' },
      { name: 'Carrington', slug: 'carrington', description: 'Heritage harbour suburb with boutique character. Tourism upside from waterfront position. Genuine first-mover opportunity as residential density grows.', score: nScore('carrington'), verdict: nVerdict('carrington'), rentRange: '$900–$2,000/mo' },
      { name: 'Mayfield', slug: 'mayfield', description: 'Industrial suburb in transition. Younger creative demographic arriving. Low rents and genuine white space for the right concept.', score: nScore('mayfield'), verdict: nVerdict('mayfield'), rentRange: '$800–$1,800/mo' },
    ],
  },
  {
    title: 'Suburban Convenience — Community-Anchored',
    description: 'Established suburban markets driven by local loyalty. Lower ceilings but lower risk for operators building community-first businesses.',
    suburbs: [
      { name: 'Charlestown', slug: 'charlestown', description: "Charlestown Square anchors strong foot traffic but dominates the market. Independents must position clear of the centre's gravitational pull.", score: nScore('charlestown'), verdict: nVerdict('charlestown'), rentRange: '$2,000–$4,500/mo' },
      { name: 'Kotara', slug: 'kotara', description: "Westfield Kotara creates similar chain-dominance dynamics to Charlestown. Works for high-volume franchise operators.", score: nScore('kotara'), verdict: nVerdict('kotara'), rentRange: '$2,200–$5,000/mo' },
      { name: 'Lambton', slug: 'lambton', description: 'Quiet residential strip with loyal local demographic. Higher median incomes than nearby suburbs. Low competition.', score: nScore('lambton'), verdict: nVerdict('lambton'), rentRange: '$900–$2,000/mo' },
      { name: 'Wallsend', slug: 'wallsend', description: 'Working-class community suburb with established commercial strip. Community loyalty model works; destination concepts do not.', score: nScore('wallsend'), verdict: nVerdict('wallsend'), rentRange: '$800–$1,800/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe in Newcastle?',
    answer: "Merewether and Cooks Hill (Darby Street) are the two benchmark cafe markets in Newcastle, but for different operator profiles. Merewether offers the best unit economics: high household incomes ($96,000+ median), low specialty competition, and a beach-lifestyle demographic that spends generously on quality coffee and brunch. Break-even at 38-45 customers per day is among the lowest thresholds in Newcastle metro. Darby Street in Cooks Hill is the higher-competition, higher-reward play — the street has genuine food culture and customers who pay $18-22 average ticket, but 15+ cafes within 800m means differentiation is non-negotiable.",
  },
  {
    question: 'How do Newcastle commercial rents compare to Sydney?',
    answer: "Newcastle commercial rents are 50-70% lower than equivalent Sydney inner-city positions. A prime Darby Street position at $4,500/month would cost $10,000-$14,000 in Newtown or Surry Hills. This structural advantage means break-even is achievable at materially lower revenue thresholds, and first-year failure risk is significantly reduced. The trade-off is a smaller overall customer pool — Newcastle metro at 500,000 people is roughly one-tenth of Sydney. Operators who build genuine local loyalty rather than relying on foot traffic density tend to build more sustainable businesses in Newcastle than in Sydney's high-rent, high-churn inner suburbs.",
  },
  {
    question: 'Is Newcastle CBD worth considering for an independent restaurant or cafe?',
    answer: "The revitalised Hunter Street corridor and the CBD light rail precinct are genuinely viable for premium concepts. The light rail has restored pedestrian life that the CBD lost during the construction period, and new residential density is arriving in the city core. At $5,000-$9,000/month, CBD rents are expensive by Newcastle standards but 50% below comparable Sydney positions. For mid-market independent operators, Darby Street or Beaumont Street offer better risk-adjusted economics — lower rent, stronger established food culture, and more consistent foot traffic.",
  },
  {
    question: 'What makes Darby Street (Cooks Hill) worth considering?',
    answer: "Darby Street is the strongest independent hospitality strip in regional NSW. It has genuine street life rather than constructed retail ambience — people actively walk, browse, and spend on the strip independent of any anchor tenant. The food-literate demographic pays $18-22 for average cafe visits and actively supports independent operators over chains. The honest caveat is that competition is real: 15+ cafes within 800m means a generic concept is outcompeted quickly. Operators who enter with a clear point of difference and quality execution perform very well.",
  },
  {
    question: 'Is Honeysuckle a good location for a restaurant?',
    answer: "Honeysuckle works well for operators who correctly model the mix of weekend waterfront trade and event-driven uplift from the Newcastle Entertainment Centre. The precinct has been transformed from an industrial port into a genuine dining and leisure destination. The failure mode is operators who project peak-event revenue across non-event weeks without a strategy for quieter periods. Operators with a strong local repeat customer base from surrounding residential areas weather the mid-week troughs better than those relying on foot traffic alone.",
  },
  {
    question: 'Which Newcastle suburbs are the best early-mover opportunities in 2026?',
    answer: "Three suburbs offer the clearest first-mover advantage in 2026: Wickham, where light rail connectivity is accelerating gentrification and rents are among the lowest in the inner ring; Carrington, a heritage harbour suburb where tourism upside and growing residential density have not yet repriced commercial leases; and Mayfield, an industrial suburb in transition where a younger creative demographic is arriving ahead of hospitality supply. All three require patience — break-even timelines are longer — but operators who lock in leases now are positioned ahead of the rent curve.",
  },
  {
    question: 'What are the high-risk locations in Newcastle to avoid?',
    answer: "Independent operators consistently struggle in two contexts in Newcastle. The first is directly adjacent to Westfield Kotara or Charlestown Square without a compelling reason to pull customers away from the centre — chain gravity is powerful and foot traffic that enters the shopping centre rarely returns to street-level independents. The second is Stockton, where ferry dependency creates isolation that limits the viable customer pool and makes daily consistency difficult. Broadmeadow without an event-day strategy is the third context: event-day revenue is real but mid-week without stadium activity is sparse.",
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

function NewcastleFactorDirectory() {
  const suburbs = getAllNewcastleSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/newcastle/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', backgroundColor: verdictBg, color: verdictColor, border: `1px solid ${verdictBdr}`, letterSpacing: '0.05em' }}>
                  {s.verdict}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[{ label: 'Cafe', value: s.cafe }, { label: 'Restaurant', value: s.restaurant }, { label: 'Retail', value: s.retail }].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: C.brand }}>{value}</div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>Composite</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>{s.compositeScore}</div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '760px' }}>{s.verdictReason}</p>
              <FactorGrid factors={s.factors} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function NewcastlePage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Newcastle"
        citySlug="newcastle"
        tagline="Steel city turned creative capital. Newcastle rewards operators who understand its beach lifestyle, tight-knit suburb loyalties, and the commercial opportunity gap that Sydney pricing has never erased."
        statChips={[
          { text: '20 suburbs scored — inner city to beachside to outer growth' },
          { text: "Newcastle East: Hunter's benchmark dining precinct" },
          { text: 'Steel city to creative capital' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NSW Valuer General Q1 2026, CBRE Newcastle, and Locatalyze proprietary foot traffic analysis.
          </p>
        </div>
      </div>

      <nav style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
          {[
            { label: 'Top Suburbs', href: '#top-suburbs' },
            { label: 'By Business Type', href: '#by-type' },
            { label: 'Suburb Directory', href: '#suburbs' },
            { label: 'Comparisons', href: '#comparisons' },
            { label: 'High-Risk Zones', href: '#high-risk' },
            { label: 'Factor Breakdown', href: '#factor-directory' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: '13px', fontWeight: 600, color: C.n700, textDecoration: 'none', padding: '6px 14px', borderRadius: '5px', backgroundColor: C.n50, border: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <section style={{ padding: '40px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { value: '500K+', label: "Newcastle metro population — 2nd largest city in NSW", source: 'ABS 2024' },
              { value: '$400M+', label: 'Annual food and hospitality sector revenue in the Hunter', source: 'Hunter Valley Research Foundation 2025' },
              { value: '50-70%', label: 'Lower commercial rents vs Sydney inner-city equivalents', source: 'CBRE Newcastle Q1 2026' },
              { value: '$96K', label: 'Highest median household income in inner Newcastle — Merewether', source: 'ABS 2024' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: C.brand, marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Newcastle Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Newcastle is the most misread business location in NSW. Operators from Sydney consistently underestimate the city's market depth and overestimate how much the smaller population limits revenue potential. The Hunter region has a $400 million food and hospitality sector, a cafe culture anchored by Darby Street that rivals inner-Sydney strips in quality, and a beach-lifestyle demographic in suburbs like Merewether and Cooks Hill that spends at levels most regional centres cannot match. The structural advantage is rent: a prime Darby Street position at $4,500/month would cost $12,000 in Newtown.",
              "Newcastle's transformation from steel city to creative capital is real and measurable. The light rail corridor has restored pedestrian life to the CBD. Honeysuckle's waterfront precinct has established itself as a genuine dining destination. Wickham and Carrington are at the front of a gentrification wave that is delivering younger professional demographics ahead of hospitality supply. Operators who enter these precincts in 2026 are locking in leases that will look underpriced in three years.",
              "The beach suburbs are Newcastle's premium residential market and its most underrated hospitality opportunity. Merewether has higher household incomes than most Sydney inner suburbs and fewer quality cafes than its demographic profile should support. Cooks Hill's Darby Street strip has the food literacy of Fitzroy at roughly 35% of Melbourne's rent. These are not second-tier markets — they are structurally advantaged positions for operators who can execute at a quality level.",
              "The failure pattern in Newcastle is operators who treat it as a scaled-down Sydney. The customer acquisition model is fundamentally different: community loyalty matters more than destination-drawing power, repeat customers sustain more businesses than passing foot traffic, and the tight-knit suburb identity means operators who genuinely invest in their local community outperform those who rely on marketing. The suburbs that reward this model — Adamstown, Lambton, Waratah, The Junction — are consistently underrated and underpriced.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="by-type" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Location Strategy by Business Type</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { type: 'Cafes & Specialty Coffee', insight: "Merewether is the best unit-economics cafe play in Newcastle — high incomes, low competition, beach lifestyle demographic. Cooks Hill (Darby Street) is the higher-competition, higher-reward play for operators with a strong concept and clear differentiation. Hamilton works for operators who want strip energy without Darby Street rent.", best: ['Merewether', 'Cooks Hill', 'Hamilton'] },
              { type: 'Full-Service Restaurants', insight: "Beaumont Street (Hamilton) is Newcastle's primary restaurant corridor — diverse cuisine mix, loyal dining culture, the highest restaurant density outside the CBD. Honeysuckle works for waterfront dining concepts with strong weekend positioning. The CBD is viable for premium concepts with a clear lunch and dinner trade split.", best: ['Hamilton', 'Honeysuckle', 'Newcastle CBD'] },
              { type: 'Retail (Independent)', insight: "Darby Street in Cooks Hill is Newcastle's benchmark independent retail strip for lifestyle and boutique concepts. Merewether works for beach lifestyle retail with an affluent demographic. The CBD's revitalised Hunter Street corridor is building retail foot traffic via the light rail.", best: ['Cooks Hill', 'Merewether', 'Newcastle CBD'] },
              { type: 'Fitness & Wellness', insight: "Boutique fitness follows high-income residential. Merewether's beach culture makes it the natural home for yoga, pilates, and reformer studios. Cooks Hill's creative demographic supports premium wellness concepts. The Junction is underrated — similar demographics to Merewether at lower rent.", best: ['Merewether', 'Cooks Hill', 'The Junction'] },
              { type: 'Professional Services', insight: "Professional services follow corporate concentration — the Newcastle CBD has the strongest professional firm cluster. Hamilton is the secondary market with strong SME density on Beaumont Street. Kotara works for suburban professional service providers co-located near Westfield.", best: ['Newcastle CBD', 'Hamilton', 'Kotara'] },
              { type: 'Creative & Hospitality Concepts', insight: "Wickham, Carrington, and Mayfield are the three markets where creative hospitality concepts find affordable entry and an early-adopter demographic. All three have the gentrification trajectory without the rent having caught up. First-mover advantage is real and the window is open in 2026.", best: ['Wickham', 'Carrington', 'Mayfield'] },
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

      <section id="top-suburbs" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Newcastle Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Merewether', slug: 'merewether', verdict: nVerdict('merewether'), score: nScore('merewether'), rentFrom: '$2,200/mo', body: "The easiest market in Newcastle to build a quality cafe business. High household incomes ($96,000+ median), low specialty competition, and a beach-lifestyle demographic that spends generously on quality coffee and brunch. Break-even at 38-45 customers per day — one of the lowest thresholds in Newcastle metro. No strong incumbent specialty cafe. A quality operator has clear space to own the suburb." },
              { rank: 2, name: 'Cooks Hill', slug: 'cooks-hill', verdict: nVerdict('cooks-hill'), score: nScore('cooks-hill'), rentFrom: '$2,500/mo', body: "Darby Street is the benchmark independent hospitality strip in regional NSW. Genuine street life, a food-literate demographic paying $18-22 average ticket, and a creative class that actively supports quality independents. Competition is the only barrier — 15+ cafes within 800m means a generic concept is outcompeted quickly. Operators with clear differentiation perform very well." },
              { rank: 3, name: 'Hamilton', slug: 'hamilton', verdict: nVerdict('hamilton'), score: nScore('hamilton'), rentFrom: '$2,000/mo', body: "Beaumont Street is Newcastle's most diverse dining corridor. Strong local loyalty, above-average spend on hospitality, and a customer base drawn from surrounding professional suburbs. Works for restaurants, cafes, and specialty food businesses. Lower competition than Darby Street at comparable rent." },
              { rank: 4, name: 'Newcastle CBD', slug: 'newcastle-cbd', verdict: nVerdict('newcastle-cbd'), score: nScore('newcastle-cbd'), rentFrom: '$3,500/mo', body: "The light rail has restored pedestrian life to Hunter Street and the CBD core. New residential density is arriving. Best for premium concepts and high-volume hospitality. CBD rents are expensive by Newcastle standards — break-even requires either premium pricing or volume that simpler concepts cannot generate." },
              { rank: 5, name: 'Honeysuckle', slug: 'honeysuckle', verdict: nVerdict('honeysuckle'), score: nScore('honeysuckle'), rentFrom: '$3,000/mo', body: "Waterfront precinct with strong weekend and event-day trade from Newcastle Entertainment Centre. A genuine dining destination. Operators who build local repeat trade alongside the waterfront tourism trade achieve consistent year-round economics. Pure waterfront-reliant concepts face mid-week exposure." },
              { rank: 6, name: 'The Junction', slug: 'junction', verdict: nVerdict('junction'), score: nScore('junction'), rentFrom: '$1,500/mo', body: "Community-first strip between Cooks Hill and Merewether that inherits quality demographics from both premium neighbours. Loyal local catchment, lower rents, and genuine white space for a quality independent. The Merewether demographic shops here as well as on the beach strip." },
              { rank: 7, name: 'Adamstown', slug: 'adamstown', verdict: nVerdict('adamstown'), score: nScore('adamstown'), rentFrom: '$1,200/mo', body: "Established residential catchment with low specialty competition and the lowest rents near the inner ring. Reliable community foot traffic without the volatility of event-dependent markets. The first-mover cafe opportunity is genuine — no quality specialty incumbent has moved in yet." },
              { rank: 8, name: 'Wickham', slug: 'wickham', verdict: nVerdict('wickham'), score: nScore('wickham'), rentFrom: '$1,200/mo', body: "Light rail connectivity is accelerating Wickham's gentrification faster than rent has adjusted. A creative professional demographic is arriving. Lowest inner-ring rents available to operators willing to build the market rather than inherit it. First-mover advantage is real and the window is open in 2026." },
              { rank: 9, name: 'Waratah', slug: 'waratah', verdict: nVerdict('waratah'), score: nScore('waratah'), rentFrom: '$1,000/mo', body: "Hospital-worker demand creates reliable weekday trade that most suburban strips cannot match. John Hunter Hospital generates consistent morning and lunch-hour customer flow. Underserved by quality independents — a hospital-adjacent cafe with quality product and convenient opening hours has a clear first-mover position." },
              { rank: 10, name: 'Carrington', slug: 'carrington', verdict: nVerdict('carrington'), score: nScore('carrington'), rentFrom: '$900/mo', body: "Heritage harbour suburb with boutique character and genuine tourism upside from the waterfront position. Lowest commercial rents in the Newcastle inner ring. Growing residential density is bringing a new demographic before hospitality supply has responded. The 3-5 year trajectory is strong for early operators." },
              { rank: 11, name: 'Charlestown', slug: 'charlestown', verdict: nVerdict('charlestown'), score: nScore('charlestown'), rentFrom: '$2,000/mo', body: "Charlestown Square drives strong area foot traffic, but chains dominate within the centre. Independents who position clearly outside the centre's gravity — specialty coffee, quality casual dining — capture the local residential catchment that prefers genuine hospitality to shopping-centre offerings." },
              { rank: 12, name: 'Lambton', slug: 'lambton', verdict: nVerdict('lambton'), score: nScore('lambton'), rentFrom: '$900/mo', body: "Quiet residential strip with higher median incomes than neighbouring suburbs, loyal local customers, and almost no specialty competition. The community-loyalty model works well here. Operators who invest genuinely in the local community build sustainable businesses at very low break-even thresholds." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/newcastle/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '20px', alignItems: 'start', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                  <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                    <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textAlign: 'center', backgroundColor: suburb.verdict === 'GO' ? C.emeraldBg : C.amberBg, color: suburb.verdict === 'GO' ? C.emerald : C.amber, border: `1px solid ${suburb.verdict === 'GO' ? C.emeraldBdr : C.amberBdr}` }}>
                      {suburb.verdict}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                      <span style={{ fontSize: '12px', color: C.muted }}>From {suburb.rentFrom}</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: C.muted, margin: 0 }}>{suburb.body}</p>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '52px' }}>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: C.brand, lineHeight: 1 }}>{suburb.score}</div>
                    <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>/ 100</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #1E3A5F 0%, #1E40AF 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Newcastle address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Newcastle address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#DBEAFE', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Newcastle address
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Newcastle Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>20 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="newcastle" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Newcastle Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Merewether vs Cooks Hill', body: "Merewether is the better unit-economics play — lower competition, higher household income, and a beach lifestyle demographic that spends generously with fewer incumbents to compete against. Break-even thresholds are among the lowest in Newcastle metro. Cooks Hill (Darby Street) has higher foot traffic depth and a food-literate street culture that drives higher average ticket and faster customer acquisition for operators who can differentiate. For operators who need immediate volume, Darby Street delivers faster. For operators who want to build a loyal community business with lower risk, Merewether is the cleaner entry." },
              { title: 'Hamilton vs Newcastle CBD', body: "Hamilton's Beaumont Street is the better choice for most independent restaurant operators — established dining culture, diverse cuisine mix, loyal residential catchment from surrounding professional suburbs, and rents that are 30-50% lower than CBD positions. The CBD delivers higher weekday corporate trade and light rail foot traffic, but $5,000-$9,000/month rent requires either premium pricing or volume that casual dining concepts cannot sustain. Premium, high-volume concepts belong in the CBD; quality-casual and independent dining belongs on Beaumont Street." },
              { title: 'Wickham vs Carrington vs Mayfield', body: "All three are first-mover plays at the front of Newcastle's industrial-to-creative gentrification wave. Wickham has the clearest short-term catalyst: light rail connectivity is already delivering a new residential demographic. Carrington has the highest long-term upside via its heritage waterfront position and tourism potential. Mayfield has the largest residential catchment but the longest ramp time. Operators who need cash flow within 12 months should choose Wickham. Operators with 24-month patience and a concept that benefits from boutique heritage setting should consider Carrington." },
              { title: 'Adamstown vs Lambton vs Waratah', body: "All three are community-loyalty markets with low competition and below-market rents. The differentiator is demand source. Waratah has hospital-worker demand creating reliable weekday trade that the other two lack. Adamstown has the largest residential catchment and the most established commercial strip. Lambton has higher median incomes than both but a smaller catchment and quieter strip. For operators who want the fastest ramp with lowest competition, Waratah wins. For operators who want the biggest potential community customer pool, Adamstown." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="high-risk" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>High-Risk Zones</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Locations where independent operators consistently underperform relative to expectation.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Directly adjacent to Westfield Kotara or Charlestown Square', why: "Shopping centre gravity in Newcastle is particularly powerful. Chains dominate inside both centres and the foot traffic that enters rarely returns to street-level independents. Operators who position on commercial strips within 100m of these centres without a compelling reason to pull customers away consistently underperform versus the foot traffic numbers that pass their door." },
              { name: 'Stockton (without a ferry-dependent strategy)', why: "Stockton's ferry isolation is a structural constraint. The customer pool is limited to local residents and visitors who specifically cross the harbour. For operators relying on passing trade or a broader catchment, the ferry bottleneck creates daily consistency challenges that conventional suburban strip locations do not face. The economics only work with very low rent and community-first positioning." },
              { name: 'Broadmeadow (without an event-day strategy)', why: "McDonald Jones Stadium drives strong trade on event days, and operators who position for that demand can build healthy businesses. The risk is operators who project event-day revenue into mid-week periods. Non-event weekdays at Broadmeadow are sparse — a business that needs consistent daily trade to cover rent should not rely on stadium foot traffic as its primary customer source." },
            ].map((zone) => (
              <div key={zone.name} style={{ padding: '22px', backgroundColor: C.redBg, borderRadius: '10px', border: `1px solid ${C.redBdr}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>{zone.name}</h3>
                <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>{zone.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Newcastle Suburb Factor Breakdown — All 20 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <NewcastleFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Newcastle Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Newcastle location?"
        subtitle="Run a free analysis on any Newcastle address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>All Cities</Link>
          <Link href="/analyse/newcastle/merewether" style={{ color: C.brand, textDecoration: 'none' }}>Merewether Analysis</Link>
          <Link href="/analyse/newcastle/cooks-hill" style={{ color: C.brand, textDecoration: 'none' }}>Cooks Hill Analysis</Link>
          <Link href="/analyse/newcastle/hamilton" style={{ color: C.brand, textDecoration: 'none' }}>Hamilton Analysis</Link>
        </div>
      </section>
    </div>
  )
}
