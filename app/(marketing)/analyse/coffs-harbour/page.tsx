// app/(marketing)/analyse/coffs-harbour/page.tsx
// Coffs Harbour city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getCoffsHarbourSuburb, getCoffsHarbourSuburbs } from '@/lib/analyse-data/coffs-harbour'

function chScore(slug: string): number {
  return getCoffsHarbourSuburb(slug)?.compositeScore ?? 0
}
function chVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getCoffsHarbourSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Coffs Harbour — 2026 Location Guide',
  description:
    'Coffs Harbour business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Coffs Harbour suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/coffs-harbour' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Coffs Harbour — 2026 Location Guide',
    description: '8 Coffs Harbour suburbs ranked and scored. Rent benchmarks, foot traffic data, tourism season impact, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/coffs-harbour',
  },
}

const COMPARISON_ROWS = [
  { name: 'Coffs Harbour CBD', score: chScore('coffs-harbour-cbd'), verdict: chVerdict('coffs-harbour-cbd'), rent: '$1,400–$3,200', footTraffic: 'High (year-round)', bestFor: 'Retail, office services, all-day dining' },
  { name: 'Jetty', score: chScore('jetty'), verdict: chVerdict('jetty'), rent: '$1,500–$3,500', footTraffic: 'High (seasonal)', bestFor: 'Ocean dining, marina hospitality, quality coffee' },
  { name: 'Park Beach', score: chScore('park-beach'), verdict: chVerdict('park-beach'), rent: '$1,200–$2,800', footTraffic: 'High (seasonal)', bestFor: 'Casual dining, cafe, beach lifestyle retail' },
  { name: 'Toormina', score: chScore('toormina'), verdict: chVerdict('toormina'), rent: '$1,200–$2,800', footTraffic: 'High (year-round)', bestFor: 'Retail, food court, specialty food, services' },
  { name: 'Sawtell', score: chScore('sawtell'), verdict: chVerdict('sawtell'), rent: '$1,000–$2,500', footTraffic: 'Medium-High', bestFor: 'Boutique dining, specialty coffee, lifestyle retail' },
  { name: 'Woolgoolga', score: chScore('woolgoolga'), verdict: chVerdict('woolgoolga'), rent: '$800–$2,000', footTraffic: 'Medium', bestFor: 'Cultural cafe, casual dining, heritage tourism' },
  { name: 'Moonee Beach', score: chScore('moonee-beach'), verdict: chVerdict('moonee-beach'), rent: '$700–$1,800', footTraffic: 'Low-Medium (growing)', bestFor: 'First-mover community cafe, convenience food' },
  { name: 'Grafton', score: chScore('grafton'), verdict: chVerdict('grafton'), rent: '$700–$1,800', footTraffic: 'Medium', bestFor: 'Community dining, essential services, casual cafe' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Coastal Tourism Precincts — Seasonal Strategy Required',
    description: "The summer school holidays and mid-year tourist season create pronounced revenue peaks at Jetty and Park Beach. Operators who rely solely on tourist revenue fail in the shoulder months. Building genuine local loyalty before the first tourist season is the non-negotiable discipline for sustainable coastal trade.",
    suburbs: [
      { name: 'Jetty', slug: 'jetty', description: "Coffs Harbour's premier dining destination adjacent to the marina and Muttonbird Island. Strong tourist flow and a quality-conscious local demographic who support independent operators year-round.", score: chScore('jetty'), verdict: chVerdict('jetty'), rentRange: '$1,500–$3,500/mo' },
      { name: 'Park Beach', slug: 'park-beach', description: 'Primary tourism accommodation strip in Coffs Harbour. Holiday parks and motels create a captive summer visitor market. Revenue cliff is real outside school holidays — local trade must be built.', score: chScore('park-beach'), verdict: chVerdict('park-beach'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'CBD and Regional Commercial — Year-Round Trade',
    description: "Coffs Harbour CBD and Toormina deliver the most consistent year-round trade. CBD serves the office worker and civic catchment; Toormina is anchored by one of the mid-North Coast's strongest performing shopping centres.",
    suburbs: [
      { name: 'Coffs Harbour CBD', slug: 'coffs-harbour-cbd', description: "The primary retail and hospitality core of the mid-North Coast. Main street foot traffic, office workers, transit visitors, and tourism flow combine for the highest consistent operator density in the region.", score: chScore('coffs-harbour-cbd'), verdict: chVerdict('coffs-harbour-cbd'), rentRange: '$1,400–$3,200/mo' },
      { name: 'Toormina', slug: 'toormina', description: 'Toormina Gardens Shopping Centre anchor delivers consistently high foot traffic with the lowest seasonality in the dataset. Resident-driven demand with minimal tourist dependency — the most predictable trade environment.', score: chScore('toormina'), verdict: chVerdict('toormina'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'Boutique Village and Heritage Precincts',
    description: 'Sawtell and Woolgoolga attract quality-seeking operators and above-average per-visit spend. Lower rents and genuine community identity make these precincts competitive for independents who do not need high-volume throughput.',
    suburbs: [
      { name: 'Sawtell', slug: 'sawtell', description: "Boutique village south of Coffs Harbour with a strong independent hospitality culture. Loyal lifestyle demographic with above-average income and food expectations. Competition is 4/10 — genuine space for quality concepts.", score: chScore('sawtell'), verdict: chVerdict('sawtell'), rentRange: '$1,000–$2,500/mo' },
      { name: 'Woolgoolga', slug: 'woolgoolga', description: 'Distinctive coastal village with significant Sikh cultural heritage and a genuine tourism draw through the Guru Nanak temple. Low competition and low rent with year-round modest visitor trade.', score: chScore('woolgoolga'), verdict: chVerdict('woolgoolga'), rentRange: '$800–$2,000/mo' },
    ],
  },
  {
    title: 'Emerging and Satellite Markets',
    description: 'Moonee Beach offers a genuine first-mover opportunity as new residential estates deliver a growing family demographic. Grafton is the Clarence Valley service centre with stable community demand and very low rents.',
    suburbs: [
      { name: 'Moonee Beach', slug: 'moonee-beach', description: 'Fast-growing coastal residential corridor. New estates deliver a family demographic currently travelling elsewhere for quality food. First-mover operators capture community loyalty before competition arrives.', score: chScore('moonee-beach'), verdict: chVerdict('moonee-beach'), rentRange: '$700–$1,800/mo' },
      { name: 'Grafton', slug: 'grafton', description: 'The Jacaranda City on the Clarence River. A genuine community with stable year-round demand. Lowest rents in the dataset and a modestly sized but loyal hospitality market.', score: chScore('grafton'), verdict: chVerdict('grafton'), rentRange: '$700–$1,800/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe in Coffs Harbour?',
    answer: "The Jetty precinct is the strongest cafe market in Coffs Harbour — the marina setting, Muttonbird Island visitor circuit, and quality-conscious local demographic combine to create consistent demand for specialty coffee and quality food. Sawtell is the second-strongest option for operators who want a boutique village positioning with lower rent and a loyal lifestyle demographic. The CBD suits high-volume operators who need the foot traffic anchor of the main street.",
  },
  {
    question: 'How seasonal is the Coffs Harbour business market?',
    answer: "It depends entirely on location. Toormina has the lowest seasonality in the dataset — the shopping centre retail trade is resident-driven and consistent across all 52 weeks. The Coffs Harbour CBD and Grafton are also low-seasonality due to the office and civic catchment. Park Beach and the Jetty have the highest seasonal peaks driven by school holidays and the summer tourist trade — operators in these precincts must plan their cash flow around the January to March, April, July, and September school holiday periods and the quieter February, June, and August months.",
  },
  {
    question: 'Is Sawtell a viable business location or too small?',
    answer: "Sawtell is genuinely viable for the right operator — the boutique village format, loyal lifestyle demographic, and above-average per-visit spend support quality independent cafes, casual dining, and specialty retail. The market is smaller than the CBD or Toormina, which means revenue ceilings are lower, but the demographic quality is higher and the competition is lighter. Operators who try to import a high-volume CBD business model to Sawtell will find the market too small. Operators who build a quality community institution calibrated to the Sawtell catchment typically find strong local loyalty.",
  },
  {
    question: 'What is the tourist market like in Coffs Harbour?',
    answer: "Coffs Harbour receives a broad tourism market driven by the Big Banana, Muttonbird Island, coastal walks, and its position as a key stopover on the Pacific Highway between Sydney and Brisbane. The visitor base is diverse — family road-trip tourists, coastal holiday makers, and the whale-watching and marine adventure segment. Tourism peaks align with school holidays: December to January, April, July, and September. The Jetty and Park Beach precincts capture the most direct tourist trade. The CBD and Toormina capture overflow and transit spending.",
  },
  {
    question: 'How does Woolgoolga compare to the Coffs Harbour main areas?',
    answer: "Woolgoolga is a distinctive micro-market rather than a Coffs Harbour alternative — the Sikh cultural heritage, Guru Nanak temple tourism, and uncrowded northern beaches create a unique positioning that attracts deliberate visitors rather than mainstream tourist traffic. The rent is substantially lower than Coffs Harbour CBD or Jetty, and the competition is genuinely low. Operators who lean into the multicultural and coastal village character of Woolgoolga can build a loyal following across the local resident and heritage tourism segments. It is not suitable for operators who need Coffs Harbour CBD volume.",
  },
  {
    question: 'Is Moonee Beach worth considering for a new business?',
    answer: "Moonee Beach is a genuine first-mover opportunity for operators who are willing to enter an emerging market and build trade as the residential population grows. The new estate development is delivering families and young professionals who currently travel to Coffs Harbour CBD for quality food — the unmet local demand is real. The risk is the ramp-up period: the existing population base may not support full revenue from day one, and operators need to model a growth trajectory rather than a mature market. The trade-off is very low rent, very low competition, and the chance to become the defining local operator before anyone else does.",
  },
  {
    question: 'What are commercial rents like in Coffs Harbour?',
    answer: "Commercial rents in Coffs Harbour are low relative to major capital cities but vary significantly by location. The Jetty and CBD command the highest rents at $1,400–$3,500/month for retail and hospitality tenancies. Toormina and Park Beach are mid-range at $1,200–$2,800/month. Sawtell and Woolgoolga are lower at $800–$2,500/month. Moonee Beach and Grafton offer the most accessible entry points at $700–$1,800/month. Operators should budget for fitout costs separately from rent — a quality fitout in Coffs Harbour typically runs $80,000–$180,000 for a cafe or small restaurant.",
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

function CoffsHarbourFactorDirectory() {
  const suburbs = getCoffsHarbourSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/coffs-harbour/${s.slug}`} style={{ textDecoration: 'none' }}>
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
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A' }}>{value}</div>
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

export default function CoffsHarbourPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Coffs Harbour"
        citySlug="coffs-harbour"
        tagline="The mid-North Coast's largest city has a diverse business market — from the Jetty's premium marina dining to Toormina's year-round shopping centre trade. Seasonal tourism amplifies the strong resident base. The operators who win build local loyalty before the first tourist season."
        statChips={[
          { text: '8 suburbs scored — marina dining to inland service towns' },
          { text: 'Toormina Gardens: lowest seasonality in the dataset — consistent year-round trade' },
          { text: 'Coffs Harbour receives 2M+ visitors annually — Big Banana, Muttonbird Island, coastal walks' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NSW Commercial Property Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '75K', label: 'Coffs Harbour urban population — genuine mid-sized regional market', source: 'ABS 2024' },
              { value: '2M+', label: 'Annual visitors — Big Banana, Muttonbird Island, Pacific Highway traffic', source: 'Destination NSW 2025' },
              { value: '2/10', label: "Toormina seasonality score — the most consistent year-round retail trade on the mid-North Coast", source: 'Locatalyze Engine' },
              { value: '$1.4K', label: 'CBD commercial rents from $1,400/month — competitive for a regional city', source: 'NSW Commercial Property Q1 2026' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#16A34A', marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Coffs Harbour Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Coffs Harbour is the mid-North Coast's most significant urban centre — a city of 75,000 people that bridges the tourist economy of the coastal strip and the service economy of the inland agricultural and forestry regions. The Pacific Highway placement means Coffs Harbour captures both a resident market and a constant stream of transit and destination visitors, creating a more complex demand structure than smaller coastal towns.",
              "The Jetty precinct is the hospitality flagship — Coffs Harbour's most recognised food and beverage destination, drawing both local residents and tourists through the marina and Muttonbird Island circuit. Quality independent operators in the Jetty have built strong local identities that sustain year-round trade while capturing the tourist wave during summer and school holiday peaks. The key discipline is building the local base before the first tourist season arrives.",
              "Toormina represents the counter-narrative: the shopping centre model that delivers consistent year-round trade with minimal seasonality. Toormina Gardens is one of the strongest-performing regional shopping centres on the mid-North Coast, and the foot traffic consistency creates a different type of opportunity — not the premium positioning of the Jetty, but the reliable baseline that chains and well-capitalised independents can build on without seasonal cash flow anxiety.",
              "Operators entering Coffs Harbour need to make an honest assessment of which market they are building for. The Jetty and Park Beach reward operators who can execute quality-led hospitality and sustain the shoulder months on local trade. Toormina and the CBD reward consistency and volume over premium positioning. Sawtell and Woolgoolga reward the boutique independent who wants a smaller, more loyal market with genuine community identity. These are not interchangeable markets — the right location depends on your format, your capital, and your appetite for seasonal variability.",
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
              { type: 'Cafes & Specialty Coffee', insight: "The Jetty is the strongest specialty coffee and quality cafe market in Coffs Harbour — the combination of tourism flow, marina lifestyle positioning, and a quality-conscious local demographic rewards operators who take coffee and food seriously. Sawtell is the boutique village alternative with a loyal local following and lighter competition. The CBD suits volume-focused cafe operators who want consistent weekday trade.", best: ['Jetty', 'Sawtell', 'Coffs Harbour CBD'] },
              { type: 'Full-Service Restaurants', insight: "Jetty is the premium restaurant market — ocean views, above-average spend, and a tourist base that genuinely seeks quality dining experiences. The CBD suits mid-market restaurants that serve both the lunch and dinner trade from the office worker and resident catchment. Park Beach works for casual dining operators positioned for the family holiday maker during peak season.", best: ['Jetty', 'Coffs Harbour CBD', 'Park Beach'] },
              { type: 'Retail (Independent)', insight: "Toormina delivers the most consistent year-round retail foot traffic through the shopping centre anchor. The CBD suits boutique and lifestyle retail targeting the urban resident market. Sawtell suits premium lifestyle and homewares retail for the sea-change demographic. Woolgoolga suits artisan and culturally distinctive retail concepts.", best: ['Toormina', 'Coffs Harbour CBD', 'Sawtell'] },
              { type: 'Fitness & Wellness', insight: "The Coffs Harbour CBD has the strongest catchment for high-volume fitness formats. Sawtell and the Jetty precincts suit boutique wellness and allied health concepts targeting quality-seeking lifestyle residents. Woolgoolga has an emerging wellness market driven by the sea-change demographic.", best: ['Coffs Harbour CBD', 'Sawtell', 'Jetty'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Park Beach is the highest-volume tourism accommodation strip and suits food and beverage concepts positioned for the family holiday maker. The Jetty captures marine and heritage tourism visitors. Woolgoolga attracts heritage tourism through the Sikh cultural precinct — the visitor profile here is more deliberate and higher-spending than the average coastal tourist.", best: ['Park Beach', 'Jetty', 'Woolgoolga'] },
              { type: 'Community and Convenience', insight: "Moonee Beach is the premier first-mover community opportunity — growing residential estates are underserved by quality local food. Grafton suits community-focused essential service operators who serve the Clarence Valley agricultural catchment. Toormina suits convenience food operators who want shopping centre foot traffic without premium positioning.", best: ['Moonee Beach', 'Grafton', 'Toormina'] },
            ].map((bt) => (
              <div key={bt.type} style={{ padding: '20px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A', marginBottom: '8px' }}>{bt.type}</h3>
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Coffs Harbour Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Coffs Harbour CBD', slug: 'coffs-harbour-cbd', verdict: chVerdict('coffs-harbour-cbd'), score: chScore('coffs-harbour-cbd'), rentFrom: '$1,400/mo', body: "The primary commercial core of the mid-North Coast. Main street foot traffic, office workers, government services, and tourist overflow create the broadest demand base in the city. Competition is 6/10 — the highest in the region — but the market scale justifies quality independent operators who differentiate on concept and execution." },
              { rank: 2, name: 'Jetty', slug: 'jetty', verdict: chVerdict('jetty'), score: chScore('jetty'), rentFrom: '$1,500/mo', body: "Coffs Harbour's premier hospitality precinct. Marina setting, Muttonbird Island visitor circuit, and a quality-conscious local demographic who actively support quality independent operators. Summer and school holiday peaks are genuine uplifts on top of a strong year-round base from the local residential community." },
              { rank: 3, name: 'Toormina', slug: 'toormina', verdict: chVerdict('toormina'), score: chScore('toormina'), rentFrom: '$1,200/mo', body: "Toormina Gardens Shopping Centre anchors one of the most consistent retail trade environments on the mid-North Coast. Lowest seasonality score in the dataset — resident-driven demand creates stable year-round foot traffic that does not depend on tourism. Competition is 6/10 inside the centre — differentiation required." },
              { rank: 4, name: 'Park Beach', slug: 'park-beach', verdict: chVerdict('park-beach'), score: chScore('park-beach'), rentFrom: '$1,200/mo', body: "Primary holiday accommodation strip with the highest summer visitor volume in Coffs Harbour. Captive tourist market for food, beverage, and convenience during school holidays. Seasonality is 6/10 — the highest in the dataset. Local trade plan is essential for the quieter February, June, and August periods." },
              { rank: 5, name: 'Sawtell', slug: 'sawtell', verdict: chVerdict('sawtell'), score: chScore('sawtell'), rentFrom: '$1,000/mo', body: "Boutique village south of Coffs Harbour with a loyal lifestyle demographic and a genuine independent food culture. Above-average per-visit spend, lighter competition than the CBD, and a community identity that rewards quality independent operators. The right scale for operators who want community over volume." },
              { rank: 6, name: 'Woolgoolga', slug: 'woolgoolga', verdict: chVerdict('woolgoolga'), score: chScore('woolgoolga'), rentFrom: '$800/mo', body: "Distinctive coastal village 25km north with Sikh heritage tourism, uncrowded northern beaches, and low competition. The cultural identity creates a genuine point of differentiation for operators who lean into the multicultural story. Modest resident catchment — revenue ceilings are lower than urban Coffs Harbour." },
              { rank: 7, name: 'Moonee Beach', slug: 'moonee-beach', verdict: chVerdict('moonee-beach'), score: chScore('moonee-beach'), rentFrom: '$700/mo', body: "Growing residential corridor with the lowest competition in the dataset. New estate families currently travel to Coffs Harbour CBD for quality food — the unmet demand is real. First-mover operators who enter now capture community loyalty before the market fills. Requires patience through the ramp-up period." },
              { rank: 8, name: 'Grafton', slug: 'grafton', verdict: chVerdict('grafton'), score: chScore('grafton'), rentFrom: '$700/mo', body: "Clarence Valley service town 60km south with stable year-round community demand, low seasonality, and very low commercial rents. Jacaranda Festival creates an October tourism spike. Suited for community-institution hospitality rather than destination or growth concepts." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/coffs-harbour/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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
                      <div style={{ fontSize: '26px', fontWeight: 900, color: '#16A34A', lineHeight: 1 }}>{suburb.score}</div>
                      <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>/ 100</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #052E16 0%, #166534 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Coffs Harbour address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Coffs Harbour address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#DCFCE7', color: '#052E16', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Coffs Harbour address &#x2192;
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Coffs Harbour Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by market type and risk profile.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#16A34A', marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="coffs-harbour" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Coffs Harbour Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Jetty vs Coffs Harbour CBD', body: "The Jetty wins on quality and experience — the marina setting, tourism flow, and premium food culture create a stronger positioning for quality independent operators who want above-average per-visit spend. The CBD wins on volume and consistency — the main street foot traffic and office worker catchment deliver reliable day trade without the seasonal complexity. For a quality-led cafe or restaurant, the Jetty. For a volume-driven retail or multi-purpose food concept, the CBD." },
              { title: 'Toormina vs CBD', body: "Toormina is the lower-seasonality choice — shopping centre foot traffic is consistent across all 52 weeks and insensitive to tourism cycles. The CBD has higher seasonality but better premium positioning and access to the growing tourist trade. Operators who want predictable unit economics and can compete in a shopping centre environment choose Toormina. Operators who want premium independent positioning and are comfortable managing seasonal cash flow choose the CBD." },
              { title: 'Sawtell vs Woolgoolga', body: "Both are boutique village precincts south and north of Coffs Harbour respectively, but they serve different market propositions. Sawtell has a stronger local residential base with above-average income and more consistent year-round community demand — it is the safer boutique village choice. Woolgoolga has a unique cultural identity through the Sikh heritage that creates a genuine point of differentiation and a heritage tourism draw, but the resident catchment is smaller. Sawtell suits lifestyle hospitality; Woolgoolga suits operators who want to build a culturally distinctive identity." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A', marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="risk-zones" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>High-Risk Patterns — What Fails in Coffs Harbour</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three structural failure modes that account for the majority of business closures in the Coffs Harbour market.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Modelling on peak tourist revenue', why: "Park Beach and Jetty operators who project January or July school holiday revenue as their normal monthly baseline consistently overestimate their annual P&L. February, June, and August are materially softer. Cash flow modelling must be built on the 12-month average, not the peak four weeks. Operators who do not model the shoulder correctly run out of working capital before the next peak arrives." },
              { name: 'Generic tourist-facing concepts', why: "Coffs Harbour's tourist market is not searching for generic cafes and average food. The visitor demographic — particularly the Pacific Highway drive market and the Byron to Sydney tourist segment — has developed strong expectations for quality independent hospitality. Generic fast casual and average coffee concepts are passed over in favour of operators who have built a genuine local reputation. The best tourist trade flows to operators with strong local identity." },
              { name: 'Oversized fitout for Moonee Beach or Grafton', why: "The growth-phase markets of Moonee Beach and the smaller service town of Grafton cannot support high-rent, high-fitout-cost hospitality concepts from opening day. Operators who sign expensive leases or commit to $300,000+ fitouts on the expectation that the growing residential base will immediately support them typically find the ramp-up period too long to survive. Match your capital commitment to the current catchment, not the projected 5-year population." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Coffs Harbour Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <CoffsHarbourFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Coffs Harbour Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Coffs Harbour location?"
        subtitle="Run a free analysis on any Coffs Harbour address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}>&#x2190; All Cities</Link>
          <Link href="/analyse/coffs-harbour/jetty" style={{ color: '#16A34A', textDecoration: 'none' }}>Jetty Analysis &#x2192;</Link>
          <Link href="/analyse/coffs-harbour/coffs-harbour-cbd" style={{ color: '#16A34A', textDecoration: 'none' }}>CBD Analysis &#x2192;</Link>
          <Link href="/analyse/coffs-harbour/toormina" style={{ color: '#16A34A', textDecoration: 'none' }}>Toormina Analysis &#x2192;</Link>
          <Link href="/analyse/coffs-harbour/sawtell" style={{ color: '#16A34A', textDecoration: 'none' }}>Sawtell Analysis &#x2192;</Link>
        </div>
      </section>
    </div>
  )
}
