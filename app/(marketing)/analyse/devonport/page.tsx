// app/(marketing)/analyse/devonport/page.tsx
// Devonport city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getDevonportSuburb, getDevonportSuburbs } from '@/lib/analyse-data/devonport'

function dScore(slug: string): number {
  return getDevonportSuburb(slug)?.compositeScore ?? 0
}
function dVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getDevonportSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Devonport — 2026 Location Guide',
  description:
    'Devonport business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Devonport suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/devonport' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Devonport — 2026 Location Guide',
    description: '7 Devonport suburbs ranked and scored. Rent benchmarks, Spirit of Tasmania ferry foot traffic, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/devonport',
  },
}

const COMPARISON_ROWS = [
  { name: 'Devonport CBD', score: dScore('devonport-cbd'), verdict: dVerdict('devonport-cbd'), rent: '$1,200-$2,800', footTraffic: 'High', bestFor: 'Ferry visitor hospitality, CBD retail, year-round dining' },
  { name: 'East Devonport', score: dScore('east-devonport'), verdict: dVerdict('east-devonport'), rent: '$800-$1,800', footTraffic: 'High (ferry)', bestFor: 'Ferry terminal first-impression hospitality, visitor trade' },
  { name: 'Latrobe', score: dScore('latrobe'), verdict: dVerdict('latrobe'), rent: '$600-$1,400', footTraffic: 'Medium', bestFor: 'Boutique artisan dining, heritage village destination food' },
  { name: 'Ulverstone', score: dScore('ulverstone'), verdict: dVerdict('ulverstone'), rent: '$600-$1,400', footTraffic: 'Medium', bestFor: 'Coastal lifestyle cafe, northwest corridor visitor trade' },
  { name: 'Don', score: dScore('don'), verdict: dVerdict('don'), rent: '$500-$1,200', footTraffic: 'Low-Medium', bestFor: 'Family residential cafe, community convenience food' },
  { name: 'Spreyton', score: dScore('spreyton'), verdict: dVerdict('spreyton'), rent: '$500-$1,000', footTraffic: 'Low', bestFor: 'Commuter community cafe, essential services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Ferry Gateway — Year-Round Visitor Trade',
    description: "The Spirit of Tasmania ferry creates a unique and sustained visitor flow through Devonport that moderates the seasonal softness affecting most Tasmanian regional businesses. Ferry-adjacent operators benefit from a year-round interstate visitor stream rather than a purely summer-dependent tourism model.",
    suburbs: [
      { name: 'Devonport CBD', slug: 'devonport-cbd', description: 'Rooke Street and Formby Road commercial spine. Spirit of Tasmania visitors use the CBD before and after ferry crossings. Government and retail workforce provides year-round anchor trade alongside visitor flow.', score: dScore('devonport-cbd'), verdict: dVerdict('devonport-cbd'), rentRange: '$1,200-$2,800/mo' },
      { name: 'East Devonport', slug: 'east-devonport', description: 'Adjacent to the Spirit of Tasmania terminal. First hospitality experience for approximately 380,000 arriving mainland passengers per year. Under-served relative to the ferry passenger volume — genuine first-impression opportunity.', score: dScore('east-devonport'), verdict: dVerdict('east-devonport'), rentRange: '$800-$1,800/mo' },
    ],
  },
  {
    title: 'Destination Dining and Coastal Towns',
    description: 'Latrobe and Ulverstone have developed independent food and hospitality scenes that draw visitors beyond the main Devonport CBD. Both benefit from the northwest coast tourism corridor and offer the lowest rents in the region.',
    suburbs: [
      { name: 'Latrobe', slug: 'latrobe', description: 'Heritage village 10km south with a boutique artisan food scene. Platypus observation site and cycling trails create genuine visitor draw. Very low rents make destination dining financially very workable.', score: dScore('latrobe'), verdict: dVerdict('latrobe'), rentRange: '$600-$1,400/mo' },
      { name: 'Ulverstone', slug: 'ulverstone', description: 'Coastal town 20km west on the northwest tourism corridor. Established lifestyle dining scene with beach and river foreshore character. Very low rents, genuine visitor trade from inter-city travellers.', score: dScore('ulverstone'), verdict: dVerdict('ulverstone'), rentRange: '$600-$1,400/mo' },
    ],
  },
  {
    title: 'Residential Corridors — First-Mover Opportunities',
    description: 'Don and Spreyton serve established and growing residential communities that export most of their hospitality spend to the CBD. Low competition and very low rents create genuine first-mover opportunity for community-focused operators.',
    suburbs: [
      { name: 'Don', slug: 'don', description: 'Eastern residential corridor with a stable growing family demographic. Quality cafe and family-friendly casual dining concepts are absent. First-mover community loyalty opportunity before the suburb matures.', score: dScore('don'), verdict: dVerdict('don'), rentRange: '$500-$1,200/mo' },
      { name: 'Spreyton', slug: 'spreyton', description: 'Southern suburban commuter residential area. Real daily demand for convenience food and cafe concepts currently underserved. Lowest rents in the Devonport belt — lean operating model achieves break-even at modest volumes.', score: dScore('spreyton'), verdict: dVerdict('spreyton'), rentRange: '$500-$1,000/mo' },
    ],
  },
  {
    title: 'Community Essential Services',
    description: 'Shorewell Park is a working-class community market with genuine demand for affordable essential services. Suits value-oriented operators who correctly price for the catchment.',
    suburbs: [
      { name: 'Shorewell Park', slug: 'shorewell-park', description: 'Working-class residential suburb with genuine demand for affordable community food and essential services. Very low competition, very low rents. Operators who serve the actual catchment reality build durable local trade.', score: dScore('shorewell-park'), verdict: dVerdict('shorewell-park'), rentRange: '$400-$900/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'How does the Spirit of Tasmania ferry affect Devonport businesses?',
    answer: "The Spirit of Tasmania is the most significant differentiating factor for Devonport as a business location compared to any other northwest Tasmanian city. The ferry carries approximately 380,000 passengers per year between Melbourne and Devonport, and more recently includes Sydney-Devonport sailings. This creates a genuine, year-round flow of mainland visitors arriving in and departing from Devonport — visitors who need hospitality, fuel, and services before and after their ferry crossing. For East Devonport operators adjacent to the terminal, this means predictable demand spikes tied to ferry arrival and departure windows. For CBD operators, it means a consistent stream of visitors who use Rooke Street and Formby Road before dispersing across Tasmania. The ferry moderates the seasonal softness that affects purely tourism-dependent Tasmanian businesses.",
  },
  {
    question: 'Is Devonport a good gateway to the northwest Tasmania tourism market?',
    answer: "Devonport is the primary entry point for mainland visitors arriving in Tasmania by sea, which positions the city as the de facto gateway to the Cradle Mountain-Lake St Clair corridor, the northwest coast, and the entire island. A meaningful proportion of Tasmanian tourism begins with visitors arriving at Devonport by ferry and driving west toward Cradle Mountain or south toward Launceston and Hobart. This creates a genuine visitor economy in Devonport itself — visitors who overnight before heading inland, who stop in the CBD for supplies, or who use East Devonport before or after their ferry. The northwest tourism corridor extends westward to Ulverstone and Burnie, giving businesses along this route access to through-traffic that complements local residential trade.",
  },
  {
    question: 'Who is the Devonport customer?',
    answer: "Devonport has three primary customer segments. The local residential and government workforce — approximately 25,000 people in the city proper, with the broader northwest TAS catchment extending the effective market — forms the year-round trade foundation for any Devonport business. Spirit of Tasmania ferry visitors generate genuine supplementary demand in the CBD and East Devonport throughout the year, with summer peaks from December to February when leisure travel increases. Northwest Tasmania tourism visitors travelling the Devonport-to-Cradle Mountain corridor stop in and around Devonport as the regional hub. Operators who build loyalty with local residents first and treat ferry and touring visitors as a supplementary layer build the most resilient Devonport businesses.",
  },
  {
    question: 'What commercial rents should I expect in Devonport?',
    answer: "Devonport commercial rents are among the most affordable in Tasmania and among the lowest of any Australian regional city of comparable scale. CBD rents typically run from $1,200 to $2,800 per month for quality street-level retail and hospitality premises on the main commercial strips. East Devonport, closer to the ferry terminal, ranges from $800 to $1,800 per month. Latrobe and Ulverstone are very low at $600 to $1,400 per month. Residential suburb corridors in Don and Spreyton run from $500 to $1,200 per month. These rents create very workable financial models for quality independent operators — the rent-to-revenue ratio in Devonport is genuinely attractive compared to any capital city market and even most larger mainland regional centres.",
  },
  {
    question: 'What are the main risks of operating in Devonport?',
    answer: "Market scale is the primary constraint. Devonport has approximately 25,000 people — a genuine but modest-sized market where revenue ceilings are lower than Launceston, Hobart, or any sizeable mainland regional city. Operators who project Hobart-scale trade volumes into a Devonport business will be consistently disappointed. The second risk is over-dependence on the ferry visitor segment without building local community loyalty — ferry visitors are a supplementary revenue layer, not a business foundation. The Tasmanian economy is also more exposed to weather and seasonality impacts on tourism than mainland markets. Operators who understand these constraints and correctly calibrate their business scale, pricing, and positioning build genuinely sustainable Devonport businesses.",
  },
  {
    question: 'What types of businesses work best in Devonport?',
    answer: "Businesses that succeed in Devonport serve the local residential and government workforce as their primary customer base and treat ferry visitors as a supplementary revenue layer. Quality cafe concepts with genuine community positioning perform consistently well in the CBD and residential suburbs. Destination dining and artisan food concepts in Latrobe and Ulverstone leverage the Tasmanian food culture movement, which has elevated the standard and the willingness-to-pay for quality food experiences across the northwest. East Devonport suits hospitality operators who can capture the ferry arrival and departure demand spike twice daily. Businesses that rely entirely on summer tourism without a year-round community customer base face consistent off-season pressure.",
  },
  {
    question: 'Is Latrobe worth considering over the Devonport CBD?',
    answer: "Latrobe is a genuinely compelling option for operators who want to build a destination dining or artisan food concept rather than a volume-based CBD business. The village has developed a reputation for quality independent food and hospitality that draws Devonport day-trippers and northwest Tasmania visitors specifically — it functions as a food destination rather than a convenience location. Rents are very low compared to the CBD, the competitive environment is less crowded, and the boutique positioning commands premium pricing. The trade-off is absolute scale — the Latrobe catchment is smaller and operators who need high volume will find the CBD more appropriate. For operators who want to build quality over volume, Latrobe is a legitimately underrated location.",
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

function DevonportFactorDirectory() {
  const suburbs = getDevonportSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/devonport/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', backgroundColor: verdictBg, color: verdictColor, border: `1px solid ${verdictBdr}`, letterSpacing: '0.05em' }}>
                  {s.verdict === 'RISKY' ? 'NO' : s.verdict}
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
              <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '760px' }}>{s.why[0]}</p>
              <FactorGrid factors={s.locationFactors} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function DevonportPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Devonport"
        citySlug="devonport"
        tagline="Northwest Tasmania's gateway city has a genuine hospitality market anchored by the Spirit of Tasmania ferry. The 380,000 annual ferry passengers create year-round visitor flow — but the local residential community is what sustains businesses between crossings."
        statChips={[
          { text: '7 suburbs scored — ferry terminal to inland residential' },
          { text: 'Spirit of Tasmania: 380,000 annual passengers through Devonport' },
          { text: 'Northwest TAS tourism gateway — Cradle Mountain corridor entry point' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, Tasmania commercial property data Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
            { label: 'Risk Zones', href: '#risk-zones' },
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
              { value: '25K', label: 'Devonport urban population with broader northwest TAS catchment extending the effective market', source: 'ABS 2024' },
              { value: '380K', label: 'Annual Spirit of Tasmania passengers — year-round interstate visitor flow through Devonport', source: 'TT-Line 2025' },
              { value: 'Cradle', label: 'Northwest Tasmania gateway — Devonport is the primary entry point for the Cradle Mountain tourism corridor', source: 'Tourism Tasmania 2025' },
              { value: '$1.2K', label: 'CBD commercial rents from $1,200/month — among the lowest of any comparable Australian regional city', source: 'REIT Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Devonport Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Devonport is Tasmania's northwest gateway — the city where approximately 380,000 mainland Australians arrive each year on the Spirit of Tasmania ferry before dispersing across the island. This creates something genuinely unusual in the Australian regional city landscape: a year-round flow of interstate visitors who pass through the city with money to spend, time on their hands before or after the crossing, and an appetite for their first (or last) Tasmanian food and beverage experience. No other northwest Tasmanian city has this structural visitor advantage.",
              "The Spirit of Tasmania is a moderating force on Devonport's seasonality. Where most Tasmanian tourist-dependent businesses face sharp revenue swings between the summer peak and the winter quiet, Devonport's ferry-adjacent operators benefit from a more consistent year-round visitor flow. The ferry runs year-round, the Melbourne-Devonport route carries both leisure and freight travellers, and the seasonality of the passenger mix is far less extreme than the Hobart summer peak. This does not eliminate seasonality — December to February is meaningfully busier — but it smooths the revenue curve in a way that pure summer-tourism operators cannot access.",
              "The northwest coast context matters for operators thinking beyond the CBD and ferry precinct. Devonport sits at the head of a tourism corridor that runs westward through Ulverstone and Burnie toward the Cradle Mountain approach road, and that attracts visitors from across Tasmania's highly regarded tourism economy. The Tasmanian food and beverage movement — which has elevated standards and willingness-to-pay for quality hospitality across the island — creates genuine demand for quality operators in satellite locations like Latrobe and Ulverstone, not just in the Devonport CBD.",
              "Market scale requires honest assessment. The Devonport urban population is approximately 25,000 people. The ferry and tourism overlay add a meaningful visitor dimension, but a well-run Devonport business builds sustainable income for a correctly scaled operation — not the revenue of a Launceston or Hobart equivalent. Operators who understand this build durable, community-anchored businesses that benefit from the visitor layer without depending on it. Those who project capital city economics onto a 25,000-person market will cycle through disappointment.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Devonport CBD and East Devonport are the strongest cafe markets — ferry visitor flow provides consistent demand and the local workforce anchors year-round trade. Latrobe suits a boutique specialty coffee concept that builds destination-dining positioning. Don and Spreyton offer first-mover community cafe opportunities at very low rents.", best: ['Devonport CBD', 'East Devonport', 'Latrobe'] },
              { type: 'Full-Service Restaurants', insight: "Devonport CBD is the primary restaurant market with the broadest demand base. Latrobe is the destination dining choice — artisan and quality-casual restaurant concepts find a food-culture audience at very low rents. Ulverstone suits a quality coastal dining concept leveraging the lifestyle and visitor trade on the northwest corridor.", best: ['Devonport CBD', 'Latrobe', 'Ulverstone'] },
              { type: 'Retail (Independent)', insight: "Devonport CBD delivers the most consistent retail foot traffic in the northwest. East Devonport suits specialty retail targeting ferry visitors — Tasmanian products, travel essentials, quality food to take on board. Ulverstone suits lifestyle and coastal retail targeting the northwest tourism visitor.", best: ['Devonport CBD', 'East Devonport', 'Ulverstone'] },
              { type: 'Fitness & Wellness', insight: "The Devonport CBD and adjacent suburbs have genuine demand for allied health, boutique fitness, and wellness services that serve the local professional and residential community. The ferry visitor segment adds supplementary demand for recovery and wellness services post-crossing.", best: ['Devonport CBD', 'Don', 'Spreyton'] },
              { type: 'Tourism-Facing Concepts', insight: "East Devonport is the primary tourism-facing market — the ferry terminal arrival experience. Devonport CBD is the secondary tourism location where visitors explore before dispersing. Latrobe and Ulverstone capture northwest touring visitors who use these towns as day-trip or overnight stops.", best: ['East Devonport', 'Devonport CBD', 'Latrobe'] },
              { type: 'Community and Essential Services', insight: "Don, Spreyton, and Shorewell Park all have genuine community demand for affordable everyday food and essential services that is currently underserved. Very low rents and almost no direct competition make these residential corridor locations viable for community-focused operators who build genuine local loyalty.", best: ['Don', 'Spreyton', 'Shorewell Park'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Devonport Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Devonport CBD', slug: 'devonport-cbd', verdict: dVerdict('devonport-cbd'), score: dScore('devonport-cbd'), rentFrom: '$1,200/mo', body: "Rooke Street and Formby Road deliver the strongest balanced demand in the city — ferry visitor flow, government and retail workforce, and the existing hospitality density that validates the market. The Spirit of Tasmania ferry moderates seasonal softness year-round. Build local community loyalty as the foundation; ferry visitors add on top." },
              { rank: 2, name: 'East Devonport', slug: 'east-devonport', verdict: dVerdict('east-devonport'), score: dScore('east-devonport'), rentFrom: '$800/mo', body: "Adjacent to the Spirit of Tasmania terminal with the highest tourism exposure of any Devonport suburb. The first hospitality experience mainland visitors have in Tasmania. Under-served relative to 380,000 annual passengers. Predictable demand spikes tied to ferry arrivals twice daily." },
              { rank: 3, name: 'Latrobe', slug: 'latrobe', verdict: dVerdict('latrobe'), score: dScore('latrobe'), rentFrom: '$600/mo', body: "Heritage village with a boutique artisan food and dining scene that draws Devonport day-trippers and northwest visitors. Platypus observation site and cycling trails create genuine visitor draw. Very low rents make destination dining financially very workable for quality operators." },
              { rank: 4, name: 'Ulverstone', slug: 'ulverstone', verdict: dVerdict('ulverstone'), score: dScore('ulverstone'), rentFrom: '$600/mo', body: "Coastal town 20km west on the northwest tourism corridor. Established lifestyle dining scene with beach foreshore character. Captures visitors travelling between Devonport and Cradle Mountain. Very low rents and differentiated coastal positioning." },
              { rank: 5, name: 'Don', slug: 'don', verdict: dVerdict('don'), score: dScore('don'), rentFrom: '$500/mo', body: "Eastern residential corridor with a stable growing family demographic. Quality cafe and family-friendly casual dining concepts are genuinely absent. First-mover operators who establish community loyalty capture the market before competition arrives." },
              { rank: 6, name: 'Spreyton', slug: 'spreyton', verdict: dVerdict('spreyton'), score: dScore('spreyton'), rentFrom: '$500/mo', body: "Southern commuter residential suburb. Real daily demand for convenience food and cafe that is currently going unmet. The lowest rent structure in the Devonport belt — break-even achievable at very modest revenue volumes for correctly structured operations." },
              { rank: 7, name: 'Shorewell Park', slug: 'shorewell-park', verdict: dVerdict('shorewell-park'), score: dScore('shorewell-park'), rentFrom: '$400/mo', body: "Working-class community suburb with genuine demand for affordable essential food services. Very low competition, very low rents. Viable for essential-service operators who correctly price and position for the actual catchment spending capacity." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/devonport/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '20px', alignItems: 'start', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                      <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textAlign: 'center', backgroundColor: vBg, color: vColor, border: `1px solid ${vBdr}` }}>
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
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Devonport address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Devonport address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#D1FAE5', color: '#064E3B', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Devonport address
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Devonport Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="devonport" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Devonport Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Devonport CBD vs East Devonport', body: "The CBD delivers broader year-round demand from the residential workforce, retail trade, and ferry visitors dispersed across the Rooke Street precinct. East Devonport has higher tourism concentration — the first-impression hospitality opportunity for ferry arrivals — but a smaller residential catchment. For operators who want the broadest customer base, the CBD. For operators who want to specifically capture the ferry arrival moment with a quality hospitality experience, East Devonport is the sharper positioning." },
              { title: 'Devonport CBD vs Latrobe', body: "The CBD has significantly more foot traffic and a broader customer base. Latrobe offers a fundamentally different market — destination dining and artisan food positioning, very low rents, and almost no direct competition from quality operators. A quality Latrobe concept that builds a reputation commands premium pricing and draws customers from across northwest Tasmania. The financial model at Latrobe rents is often more viable than at CBD rents — the question is whether the operator can build and sustain the destination-dining positioning that makes Latrobe work." },
              { title: 'Latrobe vs Ulverstone', body: "Both are satellite locations that have developed independent food scenes beyond the Devonport CBD. Latrobe has a more established artisan food reputation and the platypus and cycling trail visitor draw. Ulverstone has the coastal lifestyle and beach foreshore positioning that suits hospitality concepts with an outdoor dining component. Latrobe suits boutique and artisan operators; Ulverstone suits lifestyle cafe and casual dining concepts that leverage the coastal character." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="risk-zones" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Risk Reality — What Every Devonport Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Devonport business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Modelling ferry visitors as the primary customer', why: "The ferry visitor segment is a genuine supplementary revenue layer — not the business foundation. Operators who build their entire model around capturing ferry arrivals without also building local residential loyalty face cash flow vulnerability on days when the ferry is not running, in seasons when passenger volumes are lower, and as the novelty of the location fades. Build the local community customer base first." },
              { name: 'Underestimating market scale', why: "Devonport is a 25,000-person city, not a 100,000-person regional centre. Revenue ceilings are genuine. Operators who project Launceston or Hobart trade volumes onto Devonport will be consistently disappointed. The market is real and viable at the right scale — the failure pattern is operators who entered Devonport with business models that required significantly more customers than the city can deliver." },
              { name: 'Seasonal planning gaps in satellite locations', why: "Latrobe and Ulverstone benefit from northwest tourism corridor visitor trade that concentrates into the warmer months. Operators who build their satellite location business model around summer visitor revenue without a clear year-round local community strategy face June to August cash flow pressure. The destination dining positioning that makes these locations work must include a local residential trade foundation." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Devonport Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <DevonportFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Devonport Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Devonport location?"
        subtitle="Run a free analysis on any Devonport address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>All Cities</Link>
          <Link href="/analyse/devonport/devonport-cbd" style={{ color: C.brand, textDecoration: 'none' }}>CBD Analysis</Link>
          <Link href="/analyse/devonport/east-devonport" style={{ color: C.brand, textDecoration: 'none' }}>East Devonport Analysis</Link>
          <Link href="/analyse/devonport/latrobe" style={{ color: C.brand, textDecoration: 'none' }}>Latrobe Analysis</Link>
        </div>
      </section>
    </div>
  )
}
