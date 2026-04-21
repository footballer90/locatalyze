// app/(marketing)/analyse/geraldton/page.tsx
// Geraldton city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getGeraldtonSuburb, getGeraldtonSuburbs } from '@/lib/analyse-data/geraldton'

function gScore(slug: string): number {
  return getGeraldtonSuburb(slug)?.compositeScore ?? 0
}
function gVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getGeraldtonSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Geraldton — 2026 Location Guide',
  description:
    'Geraldton business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Geraldton suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/geraldton' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Geraldton — 2026 Location Guide',
    description: '7 Geraldton suburbs ranked and scored. Rent benchmarks, foot traffic data, Abrolhos Islands tourism impact, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/geraldton',
  },
}

const COMPARISON_ROWS = [
  { name: 'Geraldton City Centre', score: gScore('geraldton-city-centre'), verdict: gVerdict('geraldton-city-centre'), rent: '$1,200–$2,800', footTraffic: 'High (seasonal)', bestFor: 'Marine Terrace hospitality, Abrolhos Islands tourist trade, commercial worker lunch' },
  { name: 'Beresford', score: gScore('beresford'), verdict: gVerdict('beresford'), rent: '$800–$2,000', footTraffic: 'Medium-High', bestFor: 'Foreshore lifestyle café, sea-change residential dining' },
  { name: 'Wonthella', score: gScore('wonthella'), verdict: gVerdict('wonthella'), rent: '$700–$1,600', footTraffic: 'Medium', bestFor: 'Differentiated café (Dome-adjacent), established residential' },
  { name: 'Strathalbyn', score: gScore('strathalbyn'), verdict: gVerdict('strathalbyn'), rent: '$600–$1,400', footTraffic: 'Low-Medium', bestFor: 'Family café, first-mover growth corridor' },
  { name: 'Rangeway', score: gScore('rangeway'), verdict: gVerdict('rangeway'), rent: '$500–$1,200', footTraffic: 'Low-Medium', bestFor: 'Essential services, community convenience food' },
  { name: 'Spalding', score: gScore('spalding'), verdict: gVerdict('spalding'), rent: '$500–$1,200', footTraffic: 'Low-Medium', bestFor: 'Community convenience, western residential catchment' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'City Centre and Foreshore — Tourism Season Drives the Premium',
    description: "Geraldton City Centre and Beresford share the Marine Terrace and foreshore positioning that creates the city's highest-value hospitality locations. The Abrolhos Islands tourist season from April to October generates meaningful revenue uplifts for correctly positioned operators. Geraldton's climate pattern — comfortable autumn and winter, hot summer — is the opposite of most Australian coastal cities, with off-season trade actually being the stronger period.",
    suburbs: [
      { name: 'Geraldton City Centre', slug: 'geraldton-city-centre', description: 'Marine Terrace commercial and hospitality spine. Gateway to Abrolhos Islands tourism, commercial worker daytime trade, and the Mid West catchment hub. Competition is 6/10 — differentiation required, but the tourism overlay and commercial catchment support quality concepts.', score: gScore('geraldton-city-centre'), verdict: gVerdict('geraldton-city-centre'), rentRange: '$1,200–$2,800/mo' },
      { name: 'Beresford', slug: 'beresford', description: "Geraldton's premier beachside suburb adjacent to the Foreshore and HMAS Sydney II memorial. Lifestyle café opportunity serving the sea-change and professional residential demographic and foreshore visitors. Competition is 4/10 — genuine space for quality-casual concepts.", score: gScore('beresford'), verdict: gVerdict('beresford'), rentRange: '$800–$2,000/mo' },
    ],
  },
  {
    title: 'Established Western Suburbs — Community Trade',
    description: "Wonthella and Spalding are established residential suburbs with commercial strips that serve the local community. Wonthella has a Dome Cafe franchise incumbent that defines the competitive landscape. Both suburbs suit independent operators with genuine product differentiation rather than direct competitive replication.",
    suburbs: [
      { name: 'Wonthella', slug: 'wonthella', description: 'Established residential suburb with Dome Cafe franchise incumbent. Independent operators must differentiate clearly from the franchise to capture the residential demand that is not served by the existing operator. Consistent year-round trade from a stable community.', score: gScore('wonthella'), verdict: gVerdict('wonthella'), rentRange: '$700–$1,600/mo' },
      { name: 'Spalding', slug: 'spalding', description: 'Established western residential suburb with community commercial strip. Incumbent operators have genuine community loyalty — new entrants need differentiated positioning. Consistent convenience trade from the local catchment at accessible rents.', score: gScore('spalding'), verdict: gVerdict('spalding'), rentRange: '$500–$1,200/mo' },
    ],
  },
  {
    title: 'Residential Growth — First-Mover Opportunity',
    description: "Strathalbyn is a newer eastern growth corridor whose residential density has outpaced its commercial development. The first-mover opportunity is real — demand exists and is currently being satisfied by residents travelling to the City Centre, creating an opening for operators who establish before the supply catches up.",
    suburbs: [
      { name: 'Strathalbyn', slug: 'strathalbyn', description: 'Newer eastern residential growth area. Family demographic with genuine first-mover opportunity — commercial supply lagging residential growth. Residents travel to City Centre for quality food and café options currently, creating the opening for a correctly positioned local operator.', score: gScore('strathalbyn'), verdict: gVerdict('strathalbyn'), rentRange: '$600–$1,400/mo' },
    ],
  },
  {
    title: 'Essential Service Suburbs',
    description: "Rangeway and Bluff Point serve residential communities with essential-service demand at the lowest rents in the Geraldton catchment. These markets suit operators who correctly calibrate to the modest but genuine residential demand rather than projecting City Centre-scale revenue.",
    suburbs: [
      { name: 'Rangeway', slug: 'rangeway', description: 'Established inner residential suburb with consistent essential-service demand. Value positioning and community reliability are the key competitive advantages. Low competition and low rent — viable for operators who serve the local catchment without over-projecting on scale.', score: gScore('rangeway'), verdict: gVerdict('rangeway'), rentRange: '$500–$1,200/mo' },
      { name: 'Bluff Point', slug: 'bluff-point', description: 'Coastal northern headland suburb with small residential population. Modest local demand and incidental recreational visitor foot traffic. Lowest rents in the Geraldton spectrum — viable only for operators with realistic low-volume revenue expectations.', score: gScore('bluff-point'), verdict: gVerdict('bluff-point'), rentRange: '$400–$1,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'Is Geraldton a good place to open a café or restaurant?',
    answer: "Geraldton is a viable hospitality market for operators who understand its specific characteristics. The city of 80,000 serves as the commercial, administrative, and tourism hub for a vast Mid West catchment — the genuine regional centre for a wide geographic area that extends several hundred kilometres inland. This creates a commercial and government worker trade base on Marine Terrace that supports year-round weekday hospitality. The Abrolhos Islands tourist season from April to October creates meaningful revenue uplifts. The operators who succeed in Geraldton understand the climate-driven seasonal pattern and build a resident community base that sustains trade through both the tourist peak and the summer heat.",
  },
  {
    question: 'How does Geraldton\'s climate affect business seasonality?',
    answer: "Geraldton's climate creates a seasonal pattern that is the reverse of most Australian coastal cities. The comfortable months from April to October are when the city is at its most attractive for outdoor dining, recreational activity, and tourist visits — the Abrolhos Islands dive and snorkel season peaks in this period. The hot summer months from November to March reduce casual outdoor foot traffic and are when Geraldton hospitality trade softens. Operators who model Geraldton seasonality using east coast summer-peak assumptions will make significant errors in their revenue projections. Plan for April-October as the primary season and build year-round resident loyalty to sustain the November-March period.",
  },
  {
    question: 'What makes the Abrolhos Islands relevant for Geraldton hospitality businesses?',
    answer: "The Houtman Abrolhos Islands are a world-class dive, snorkel, and marine wildlife destination accessible only via Geraldton — the city is the gateway for all island access, whether by boat charter or light aircraft. The April to October tourist season brings significant visitor spending to Marine Terrace and the foreshore precinct as visitors arrive and depart via Geraldton. This creates genuine hospitality demand for restaurants and cafes that are visible to the island visitor flow. The effect is most pronounced for City Centre operators on Marine Terrace and in the foreshore precinct. Beresford and the HMAS Sydney II memorial add a secondary historical tourism layer that draws day visitors year-round.",
  },
  {
    question: 'What is the difference between City Centre and Beresford for a cafe?',
    answer: "Geraldton City Centre is the commercial and tourism hub — Marine Terrace pedestrian trade, government worker daytime demand, and the Abrolhos Islands tourist visitor flow. It is more competitive (6/10) and more tourism-dependent. Beresford is the lifestyle coastal alternative — the foreshore adjacent suburb with an ocean-facing positioning, a more intimate residential community, and a lifestyle demographic that values quality over volume. City Centre suits operators who want maximum foot traffic and can compete in a denser competitive environment. Beresford suits operators who want the coastal lifestyle positioning with a more community-oriented approach and less seasonal tourism dependency.",
  },
  {
    question: 'What is the Wonthella Dome Cafe situation and how does it affect new operators?',
    answer: "Wonthella has an established Dome Cafe franchise outlet that has captured a significant share of the local café market. The franchise creates a competitive floor that independent operators need to acknowledge explicitly when planning their entry into this suburb. The opportunity for an independent is not to compete directly with the Dome on the same product and positioning — it is to serve segments the franchise does not address. Quality specialty coffee operators, artisan food concepts, and independent café brands that offer a genuinely different experience from the franchise format find space in Wonthella alongside the Dome, rather than fighting for the same customers. Operators who replicate the Dome's format directly will find the competitive dynamic very difficult.",
  },
  {
    question: 'What business types work best in Geraldton?',
    answer: "Quality-casual hospitality that serves both the commercial worker and the tourist visitor market is the strongest format for City Centre operators on Marine Terrace. The combination of year-round government and commercial worker daytime trade with the April-October tourist season uplift creates the best demand profile in the city. Beresford suits boutique lifestyle café concepts that serve the sea-change and professional residential demographic with above-average incomes. The growth and established residential suburbs (Strathalbyn, Rangeway, Spalding) suit community-focused café and convenience food formats that build local loyalty from repeat residential customers — destination dining concepts do not work in these locations.",
  },
  {
    question: 'How large is the Geraldton market and what revenue ceiling should I expect?',
    answer: "Geraldton is an 80,000-person city — larger than most people expect for a Mid West regional centre, given its broad geographic catchment role. A well-positioned café on Marine Terrace can build a substantial loyal community following and generate solid tourist-season revenue. The ceiling is regional, not metropolitan: operators who project Perth or Fremantle volumes into a Geraldton location will be consistently disappointed. The scale that Geraldton can realistically support is a well-run, community-embedded small business with genuine seasonal revenue management — not a multi-site hospitality group. Operators who set expectations correctly from the outset build something durable.",
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

function GeraldtonFactorDirectory() {
  const suburbs = getGeraldtonSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/geraldton/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function GeraldtonPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Geraldton"
        citySlug="geraldton"
        tagline="WA's fourth city is the gateway to the Abrolhos Islands and the commercial hub for a vast Mid West catchment. The tourist season runs April to October — the reverse of most Australian coastal cities."
        statChips={[
          { text: '7 suburbs scored — Marine Terrace to coastal headland' },
          { text: 'Abrolhos Islands season April–October: tourist uplift for City Centre operators' },
          { text: 'Mid West regional catchment hub — commercial and government worker trade year-round' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, REIWA Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '80K', label: "Geraldton urban population — WA's fourth city and Mid West regional commercial hub", source: 'ABS 2024' },
              { value: 'Apr–Oct', label: 'Abrolhos Islands tourist season — primary tourism driver with city centre revenue uplifts', source: 'Tourism WA 2025' },
              { value: 'HMAS', label: 'HMAS Sydney II memorial — year-round historical tourism to the Geraldton foreshore', source: 'Tourism WA 2025' },
              { value: '$1.2K', label: 'Marine Terrace commercial rents from $1,200/month — accessible for a regional city centre position', source: 'REIWA Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Geraldton Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Geraldton is WA's fourth-largest city and the undisputed commercial, administrative, and tourism hub for the Mid West — a vast region extending hundreds of kilometres inland from the coast. The city's Marine Terrace hospitality and retail spine serves a catchment that extends well beyond the 80,000-person urban population, drawing trade from surrounding regional communities that have no comparable commercial centre of their own. This geographic centrality is what distinguishes Geraldton from other WA regional coastal cities of similar population size.",
              "The Abrolhos Islands tourism market is Geraldton's primary tourism driver — a world-class dive, snorkel, and marine wildlife destination accessible only through Geraldton as the gateway city. The April to October tourist season creates genuine hospitality demand on Marine Terrace and the foreshore precinct. What makes Geraldton unusual is that this tourist season aligns with the city's most comfortable climate period — autumn and winter — when outdoor dining and recreational activity is at its most attractive. The hot summer from November to March reduces casual foot traffic on the exposed foreshore positions.",
              "The practical implication for operators is a seasonal planning framework that is the reverse of most Australian coastal markets. The operators who succeed in Geraldton build their resident community base first — the commercial and government worker trade on Marine Terrace, the sea-change and professional demographic in Beresford — and treat the April-October tourist uplift as the peak revenue period rather than the only revenue period. Operators who model only the tourist season and have no genuine local trade strategy face lean conditions for five months of the year.",
              "The residential growth suburbs — Strathalbyn and to a lesser extent the western established suburbs — represent a different opportunity from the Marine Terrace precinct. These are communities with genuine demand that is currently being satisfied by travelling to the City Centre. First-mover operators who establish in Strathalbyn before the supply catches up with residential growth face modest competition and low rent, at the cost of building community loyalty from scratch. The revenue trajectory is slower but the competitive position once established is durable.",
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
              { type: 'Cafes & Specialty Coffee', insight: "City Centre's Marine Terrace is the strongest café market — commercial worker morning trade, tourist visitor daytime demand, and the foreshore ambience. Beresford suits the boutique lifestyle café concept for the sea-change residential demographic. Strathalbyn offers a first-mover community café position at low rent and low competition in a growing family suburb.", best: ['City Centre', 'Beresford', 'Strathalbyn'] },
              { type: 'Full-Service Restaurants', insight: "Geraldton City Centre is the only genuine full-service restaurant market in the dataset — the commercial and tourist catchment on Marine Terrace supports quality dinner trade from both the resident professional demographic and the Abrolhos tourist visitor market. Beresford suits quality-casual dining for the lifestyle residential community. No other suburb in the dataset has sufficient demand volume for full-service restaurant formats.", best: ['City Centre', 'Beresford'] },
              { type: 'Retail (Independent)', insight: "City Centre's Marine Terrace has the highest retail foot traffic in the dataset. Wonthella's established commercial strip suits community retail formats that serve the western residential catchment. Strathalbyn is an emerging first-mover retail opportunity as the residential base grows. The essential-service suburbs (Rangeway, Bluff Point) suit community retail at the lowest rents.", best: ['City Centre', 'Wonthella', 'Strathalbyn'] },
              { type: 'Fitness & Wellness', insight: "The sea-change and professional demographic in Beresford and the commercial and government worker population in the City Centre have genuine demand for boutique fitness, allied health, and wellness services. Wonthella has stable established residential demand that can support community wellness concepts. Growth suburbs like Strathalbyn offer first-mover wellness opportunities as the family demographic builds.", best: ['Beresford', 'City Centre', 'Wonthella'] },
              { type: 'Tourism-Adjacent Concepts', insight: "City Centre is the only genuine tourism-adjacent location — Marine Terrace and the foreshore precinct capture Abrolhos Islands visitors arriving and departing via Geraldton. Beresford benefits from the HMAS Sydney II memorial visitor trade and the foreshore recreational user market. All other suburbs are essentially residential trade with minimal tourism relevance.", best: ['City Centre', 'Beresford'] },
              { type: 'Community and Convenience', insight: "Rangeway, Strathalbyn, Spalding, and Bluff Point all serve residential communities with genuine essential-service demand at the lowest rents in the catchment. Operators who build genuine community presence as the reliable local option — not the premium destination — create durable repeat trade from residents who prioritise convenience and familiarity.", best: ['Rangeway', 'Strathalbyn', 'Spalding'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Geraldton Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Geraldton City Centre', slug: 'geraldton-city-centre', verdict: gVerdict('geraldton-city-centre'), score: gScore('geraldton-city-centre'), rentFrom: '$1,200/mo', body: "Marine Terrace commercial and hospitality spine. Abrolhos Islands tourist season April-October creates genuine peak revenue. Commercial and government worker trade provides year-round baseline. Competition is 6/10 — quality independents with clear differentiation find loyal customers in the city that serves the entire Mid West." },
              { rank: 2, name: 'Beresford', slug: 'beresford', verdict: gVerdict('beresford'), score: gScore('beresford'), rentFrom: '$800/mo', body: "Geraldton's premier beachside suburb adjacent to the foreshore and HMAS Sydney II memorial. Lifestyle café opportunity for the sea-change and professional residential demographic. Competition is 4/10 — quality-casual concepts that serve the coastal lifestyle positioning find genuine space at rents well below Perth coastal equivalents." },
              { rank: 3, name: 'Wonthella', slug: 'wonthella', verdict: gVerdict('wonthella'), score: gScore('wonthella'), rentFrom: '$700/mo', body: "Established western residential suburb with Dome Cafe franchise incumbent. Consistent year-round residential trade. Independent operators who differentiate clearly from the franchise — specialty coffee, different cuisine, boutique positioning — find the local demand that is not being served by the existing operator." },
              { rank: 4, name: 'Strathalbyn', slug: 'strathalbyn', verdict: gVerdict('strathalbyn'), score: gScore('strathalbyn'), rentFrom: '$600/mo', body: "Newer eastern residential growth area. Family demographic with genuine first-mover opportunity — residents currently travel to City Centre for quality food options. Operators who establish community loyalty before supply catches up capture the market with durable competitive advantage." },
              { rank: 5, name: 'Rangeway', slug: 'rangeway', verdict: gVerdict('rangeway'), score: gScore('rangeway'), rentFrom: '$500/mo', body: "Established inner residential suburb. Consistent essential-service demand from a stable community at the lowest rents in the dataset. Suits value-positioned operators who serve the local catchment reliably — community presence and convenience are the primary competitive advantages here." },
              { rank: 6, name: 'Spalding', slug: 'spalding', verdict: gVerdict('spalding'), score: gScore('spalding'), rentFrom: '$500/mo', body: "Established western residential commercial strip. Incumbent operators have community loyalty — new entrants need differentiated positioning to capture share. Accessible rents and predictable year-round trade from the established residential catchment." },
              { rank: 7, name: 'Bluff Point', slug: 'bluff-point', verdict: gVerdict('bluff-point'), score: gScore('bluff-point'), rentFrom: '$400/mo', body: "Coastal northern headland suburb with small residential population. Lowest rents in Geraldton. Modest demand volume and incidental coastal visitor traffic in the comfortable season. Viable only for operators whose revenue expectations match the genuine scale of this small community market." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/geraldton/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Geraldton address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Geraldton address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FFEDD5', color: '#7C2D12', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Geraldton address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Geraldton Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="geraldton" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Geraldton Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'City Centre vs Beresford', body: "City Centre is the commercial and tourism hub — Marine Terrace pedestrian trade, government worker demand, and the Abrolhos Islands visitor flow. The competitive density is higher (6/10) and the positioning is more commercial than lifestyle. Beresford is the coastal lifestyle alternative — ocean-facing with the sea-change residential demographic, lower competition (4/10), and more intimate positioning. City Centre suits operators who want maximum commercial foot traffic. Beresford suits operators who want the coastal lifestyle atmosphere with a community that has genuine per-visit spend and food culture expectations." },
              { title: 'City Centre vs Wonthella', body: "City Centre and Wonthella serve fundamentally different operators. City Centre is the tourism-amplified commercial hub that works for destination hospitality concepts — quality café, full-service restaurant, tourism retail. Wonthella is an established residential market that works for community operators who serve the local catchment rather than attracting visitors from elsewhere. The Dome Cafe franchise presence in Wonthella means any café operator entering needs a genuinely differentiated concept rather than a like-for-like café format. City Centre suits new operators who want maximum demand volume; Wonthella suits those who want to serve the local community with something the franchise cannot offer." },
              { title: 'Strathalbyn vs Rangeway', body: "Both are residential markets without tourism relevance — pure community trade in different stages of development. Strathalbyn is the growth market: a newer suburb whose population is expanding and whose commercial supply has lagged, creating a first-mover window that will close as the suburb matures. Rangeway is the established essential-service market: stable demand, stable competition, and a community demographic that values reliability and value over quality or novelty. Strathalbyn suits operators willing to invest in building community loyalty in a growing market. Rangeway suits operators who want immediate, predictable, modest trade from an established residential catchment." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Risk Zones — What Every Geraldton Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Geraldton business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Reversed seasonality mis-modelling', why: "Geraldton is hotter in summer (November-March) and more comfortable in autumn-winter (April-October). The tourist season follows the comfortable climate — which means the seasonal pattern is the opposite of most Australian coastal cities. Operators who model Geraldton using standard east coast summer-peak assumptions will project their strongest trade in the period when casual foot traffic is actually lowest. Build the resident year-round base first and treat April-October as the tourism-amplified peak, not the other way around." },
              { name: 'Wonthella direct franchise competition', why: "The Dome Cafe presence in Wonthella has established genuine community loyalty in the suburb. Operators who enter with a format that directly replicates the Dome's product and positioning — a standard all-day café with the same coffee and menu formats — will find the competitive dynamic very difficult. The opportunity is to serve the segments the franchise does not: specialty coffee culture, artisan food, a distinctively different brand experience. Direct competition with an entrenched franchise in a suburban residential market is one of the highest-risk entry strategies in this dataset." },
              { name: 'Growth corridor revenue ramp underestimation', why: "Strathalbyn is a genuine first-mover opportunity, but first-mover advantage has a cost: the community loyalty that drives repeat trade takes 6-18 months to build from scratch. Operators who enter Strathalbyn with a 90-day payback timeline and week-one revenue expectations will exhaust their capital before the community loyalty is established. Model the ramp period conservatively, capitalise for 18 months of below-projection trading, or do not enter the growth corridor markets." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Geraldton Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <GeraldtonFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Geraldton Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Geraldton location?"
        subtitle="Run a free analysis on any Geraldton address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/geraldton/geraldton-city-centre" style={{ color: C.brand, textDecoration: 'none' }}>City Centre Analysis →</Link>
          <Link href="/analyse/geraldton/beresford" style={{ color: C.brand, textDecoration: 'none' }}>Beresford Analysis →</Link>
          <Link href="/analyse/geraldton/wonthella" style={{ color: C.brand, textDecoration: 'none' }}>Wonthella Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
