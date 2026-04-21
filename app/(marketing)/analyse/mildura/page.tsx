// app/(marketing)/analyse/mildura/page.tsx
// Mildura city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getMilduraSuburb, getMilduraSuburbs } from '@/lib/analyse-data/mildura'

function mScore(slug: string): number {
  return getMilduraSuburb(slug)?.compositeScore ?? 0
}
function mVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getMilduraSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Mildura — 2026 Location Guide',
  description:
    'Mildura business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Mildura suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/mildura' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Mildura — 2026 Location Guide',
    description: '8 Mildura suburbs ranked and scored. Rent benchmarks, Murray River tourism, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/mildura',
  },
}

const COMPARISON_ROWS = [
  { name: 'Mildura CBD', score: mScore('mildura-cbd'), verdict: mVerdict('mildura-cbd'), rent: '$2,000–$4,500', footTraffic: 'High', bestFor: 'Regional dining, retail, tourism hospitality' },
  { name: 'Mildura South', score: mScore('mildura-south'), verdict: mVerdict('mildura-south'), rent: '$2,000–$4,000', footTraffic: 'High', bestFor: 'Family dining, convenience retail, essential services' },
  { name: 'Nichols Point', score: mScore('nichols-point'), verdict: mVerdict('nichols-point'), rent: '$1,500–$3,500', footTraffic: 'Medium-High', bestFor: 'Premium residential cafe, quality casual dining' },
  { name: 'Gol Gol', score: mScore('gol-gol'), verdict: mVerdict('gol-gol'), rent: '$1,200–$2,500', footTraffic: 'Medium (growing)', bestFor: 'First-mover convenience, residential hospitality' },
  { name: 'Irymple', score: mScore('irymple'), verdict: mVerdict('irymple'), rent: '$1,200–$2,500', footTraffic: 'Medium', bestFor: 'Community hospitality, multicultural food, workforce dining' },
  { name: 'Red Cliffs', score: mScore('red-cliffs'), verdict: mVerdict('red-cliffs'), rent: '$800–$2,000', footTraffic: 'Low-Medium', bestFor: 'Community essential services, satellite town market' },
  { name: 'Wentworth', score: mScore('wentworth'), verdict: mVerdict('wentworth'), rent: '$700–$1,800', footTraffic: 'Low (seasonal)', bestFor: 'Tourism-facing cafe, river junction visitor market' },
  { name: 'Merbein', score: mScore('merbein'), verdict: mVerdict('merbein'), rent: '$700–$1,800', footTraffic: 'Low', bestFor: 'Essential services, community-focused rural operator' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'CBD and Commercial Hub — Regional Catchment',
    description: 'Mildura CBD on Langtree Avenue is the only major commercial centre for 150km in any direction. The pedestrian mall concentrates regional foot traffic from a 70,000-person catchment that includes both sides of the Murray.',
    suburbs: [
      { name: 'Mildura CBD', slug: 'mildura-cbd', description: 'Langtree Avenue pedestrian mall is the Sunraysia region commercial spine. Murray River and wine tourism adds to a strong resident retail catchment. Established food scene validates the market but raises the quality bar.', score: mScore('mildura-cbd'), verdict: mVerdict('mildura-cbd'), rentRange: '$2,000–$4,500/mo' },
      { name: 'Mildura South', slug: 'mildura-south', description: 'Fifteenth Street suburban corridor serving the largest residential area in Mildura. Consistent year-round family trade independent of tourism. Lower rents than CBD for an established commercial strip.', score: mScore('mildura-south'), verdict: mVerdict('mildura-south'), rentRange: '$2,000–$4,000/mo' },
    ],
  },
  {
    title: 'Riverfront Premium — High-Spend Residential',
    description: 'Nichols Point is the premium residential market in the Mildura urban area — above-average household incomes, riverfront lifestyle, and demand for quality hospitality that is underserved relative to the demographic quality.',
    suburbs: [
      { name: 'Nichols Point', slug: 'nichols-point', description: 'Premium riverfront residential suburb with above-average household incomes. Quality casual dining and specialty retail find loyal, high-spend customers. Warm-season river tourism adds to resident trade.', score: mScore('nichols-point'), verdict: mVerdict('nichols-point'), rentRange: '$1,500–$3,500/mo' },
    ],
  },
  {
    title: 'Residential Growth and Multicultural Communities',
    description: 'Irymple serves the horticultural workforce with a large multicultural community. Gol Gol on the NSW side is growing fast with residential development outpacing commercial supply — a first-mover window for convenience operators.',
    suburbs: [
      { name: 'Irymple', slug: 'irymple', description: 'Horticultural residential suburb with Sikh, Afghan, and Pacific Islander communities. Large multicultural catchment underserved by quality food. Workforce demand pattern creates early-morning and value-lunch opportunities.', score: mScore('irymple'), verdict: mVerdict('irymple'), rentRange: '$1,200–$2,500/mo' },
      { name: 'Gol Gol', slug: 'gol-gol', description: 'Growing NSW residential suburb across the Murray from Mildura. New estate development outpacing commercial supply — first-mover window open for convenience and casual dining. Note: NSW licensing rules apply.', score: mScore('gol-gol'), verdict: mVerdict('gol-gol'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
  {
    title: 'Rural Satellites — Essential Services and Tourism',
    description: 'Red Cliffs and Merbein serve self-contained satellite town communities with genuine but modest demand. Wentworth is a genuine tourism attraction — the Murray-Darling river junction — with above-average visitor demand for a town its size.',
    suburbs: [
      { name: 'Red Cliffs', slug: 'red-cliffs', description: 'Eastern satellite town 14km from Mildura CBD. Community with strong local loyalty — residents prefer local businesses. Low competition, low rents. Viable for quality essential services.', score: mScore('red-cliffs'), verdict: mVerdict('red-cliffs'), rentRange: '$800–$2,000/mo' },
      { name: 'Wentworth', slug: 'wentworth', description: 'Murray-Darling river junction historic town 30km east. Tourism exceeds what existing operators can serve at peak. Seasonal revenue profile — spring and autumn strongest. Very low rents.', score: mScore('wentworth'), verdict: mVerdict('wentworth'), rentRange: '$700–$1,800/mo' },
      { name: 'Merbein', slug: 'merbein', description: 'Western satellite town 9km from Mildura. Loyal community with limited supply. Modest demand ceiling. Very low rents for essential-service concepts that serve the resident base.', score: mScore('merbein'), verdict: mVerdict('merbein'), rentRange: '$700–$1,800/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe in Mildura?',
    answer: "Mildura CBD on Langtree Avenue is the strongest market for a quality-positioned cafe that wants to capture both the regional resident catchment and the Murray River and wine tourism trade. The pedestrian mall concentrates foot traffic and the established independent food scene validates demand — though it also means new entrants need genuine differentiation. Mildura South on Fifteenth Street suits operators who want a high-volume, year-round residential market without the CBD competition intensity. Nichols Point suits operators targeting a premium residential demographic with above-average spend — a quality coffee and brunch concept that serves the riverfront lifestyle market.",
  },
  {
    question: 'How does Murray River tourism affect Mildura businesses?',
    answer: "Murray River tourism — houseboating, river cruises, and the Sunraysia wine and food scene — creates above-average visitor demand in Mildura compared to most inland regional cities. The CBD on Langtree Avenue captures the strongest tourism uplift, particularly during the warmer months when river tourism is most active. Wentworth benefits from its unique position at the Murray-Darling river junction, which generates day-tripper visits from Mildura. Nichols Point has a warm-season tourism overlay from the riverfront accommodation market. Unlike highly seasonal coastal tourism markets, Mildura's tourism has a broader seasonal distribution — spring, summer, and autumn all generate visitor trade, with only mid-winter being significantly quieter.",
  },
  {
    question: 'Is Gol Gol worth considering for a new business?',
    answer: "Gol Gol is a genuine opportunity for the right operator but requires understanding the NSW context. The suburb is growing rapidly as a residential overflow from Mildura, with new estates creating a catchment that currently lacks local commercial options and uses Mildura CBD for most needs. The first-mover opportunity for convenience-oriented food and retail is real. The practical complexity is that Gol Gol sits on the NSW side of the Murray, which means NSW planning and licensing rules apply rather than Victorian equivalents. Operators need to verify NSW small business and hospitality licensing requirements before committing. This is an administrative hurdle, not an insurmountable barrier — but operators should do the homework before signing a lease.",
  },
  {
    question: 'What makes Mildura different from other regional Victorian cities?',
    answer: "Mildura is the most geographically isolated major regional city in Victoria — the nearest competing commercial centre is more than 150km away. This means the Mildura CBD functions as the sole commercial hub for a 70,000-person catchment that has no alternative. There is no parallel shopping centre or competing strip to dilute foot traffic. The city also has a genuine, established food culture that is unusually strong for its size — the Sunraysia wine and produce scene, Italian-heritage food traditions, and the river tourism market have created a population with higher food culture expectations than most inland regional cities of comparable size. This means the market rewards quality but also means the quality bar for new entrants is higher.",
  },
  {
    question: 'What are the main risks of the Mildura market?',
    answer: "Summer heat is the most significant structural challenge for Mildura operators. January and February temperatures regularly exceed 40 degrees Celsius, creating a genuine reduction in daytime foot traffic on outdoor-oriented strips. Operators who have not adapted their format — air-conditioned environments, shaded outdoor areas, hot-weather menus — suffer disproportionately in summer. The second risk is the geographic isolation: Mildura is far from Melbourne supplier networks, which means food supply chains, hospitality equipment servicing, and specialist trade support are more expensive and less reliable than in metropolitan or closer regional markets. The third risk for satellite town operators is revenue ceiling — Red Cliffs, Merbein, and Wentworth have genuine but modest demand that caps revenue potential regardless of concept quality.",
  },
  {
    question: 'What business types perform best in Mildura?',
    answer: "Quality-casual hospitality that serves both the regional resident catchment and the tourism market performs best in the Mildura CBD. The Sunraysia food culture rewards genuine quality — a well-executed cafe or restaurant on Langtree Avenue that becomes part of the local food scene earns loyal local customers and captures visitor trade. In Mildura South and Irymple, community-focused convenience dining and family restaurants that serve the residential catchment reliably build durable local loyalty without needing tourism to sustain them. Nichols Point suits boutique concepts with premium positioning for a high-income residential demographic. The satellite towns reward essential-service operators who become community institutions — trying to operate premium hospitality in Red Cliffs or Merbein misreads the market.",
  },
  {
    question: 'What are commercial rents like in Mildura compared to regional Victoria?',
    answer: "Mildura CBD rents on Langtree Avenue run approximately $2,000 to $4,500 per month for viable strip positions — comparable to a secondary Melbourne suburban strip and higher than most Victorian regional city equivalents because the CBD is the only commercial centre for a large catchment. Mildura South is somewhat lower at $2,000 to $4,000. Outer suburbs, satellite towns, and NSW-side suburbs are significantly cheaper — Red Cliffs and Merbein from under $1,000 per month, Wentworth similarly. The economics work for correctly calibrated concepts at every price point, but operators should not project Melbourne revenue volumes onto any Mildura location.",
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

function MilduraFactorDirectory() {
  const suburbs = getMilduraSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/mildura/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function MilduraPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Mildura"
        citySlug="mildura"
        tagline="Australia's Murray River city is the only major commercial centre for 150km. Langtree Avenue draws a 70,000-person Sunraysia catchment. The wine and river tourism market elevates food culture expectations well above what most inland regional cities can sustain."
        statChips={[
          { text: '8 suburbs scored — CBD to Murray-Darling river junction' },
          { text: 'Sunraysia wine and Murray River tourism drives above-average visitor spend' },
          { text: 'Sole regional commercial centre for 150km — no competing hub' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, REIV Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '70K', label: 'Sunraysia catchment — largest commercial hinterland of any Victorian regional city relative to distance', source: 'ABS 2024' },
              { value: '150km', label: 'Distance to nearest competing commercial centre — Mildura CBD is the sole major retail hub', source: 'Geographic analysis' },
              { value: 'Murray', label: 'River and wine tourism draws interstate and intrastate visitors who specifically seek the Mildura food scene', source: 'Tourism VIC 2025' },
              { value: '$2K', label: 'CBD Langtree Avenue rents from $2,000/month — below Melbourne rates for a high-catchment pedestrian mall position', source: 'REIV Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Mildura Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Mildura is structurally different from most regional Victorian cities. It is the only major commercial centre for more than 150km in any direction — there is no competing city, no parallel shopping strip, and no alternative destination for the Sunraysia region's commercial activity. The Langtree Avenue pedestrian mall functions as the commercial capital for a 70,000-person catchment that extends across both sides of the Murray River into New South Wales. This geographic monopoly is a genuine structural advantage that operators in Geelong, Bendigo, or Ballarat do not have.",
              "The Mildura food culture is a specific asset that distinguishes the city from comparably sized inland regional centres. The Italian-heritage food traditions brought by post-war migrants, the Sunraysia wine and fresh produce scene, and the river tourism market have created a population with genuine food culture expectations. A well-executed cafe or restaurant on Langtree Avenue is not competing for a market that does not care about quality — it is serving a local population and a visitor market that understands and values good food. The quality bar for new entrants is accordingly higher than in most regional Victorian cities.",
              "The summer heat challenge is real and must be planned for. January and February in Mildura regularly exceed 40 degrees Celsius — conditions that materially reduce daytime foot traffic and outdoor dining. Operators who have not adapted their format to the climate (air conditioning, shaded outdoor areas, lighter menus) discover that summer in Mildura is the operational challenge that their business case did not model. This is not a reason to avoid Mildura — it is a design and operational requirement that separates operators who succeed from those who are surprised.",
              "Beyond the CBD, the Mildura market has genuine residential growth stories in Mildura South and Gol Gol, a premium residential opportunity in Nichols Point, and a multicultural community market in Irymple. Red Cliffs and Merbein are genuine satellite town markets with low competition and community loyalty habits that reward operators who embed themselves in the local commercial fabric rather than treating them as urban overflow markets.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Mildura CBD is the strongest specialty coffee market — the established food culture creates a customer base that genuinely understands quality. Nichols Point suits a premium residential coffee concept for the above-average income catchment. Mildura South suits high-volume community cafes without CBD competition intensity.", best: ['Mildura CBD', 'Nichols Point', 'Mildura South'] },
              { type: 'Full-Service Restaurants', insight: "Langtree Avenue CBD is Mildura's primary dinner destination — the regional catchment includes people driving from Red Cliffs, Merbein, and rural areas for a quality restaurant meal. The tourism market elevates average spend and frequency. Wine-region positioning suits the Sunraysia food culture.", best: ['Mildura CBD', 'Nichols Point'] },
              { type: 'Retail (Independent)', insight: "Langtree Avenue is the regional retail destination — the sole major commercial strip for 150km. Mildura South on Fifteenth Street suits convenience and family retail for the southern residential catchment. Irymple suits multicultural food and community retail for the horticultural workforce demographic.", best: ['Mildura CBD', 'Mildura South', 'Irymple'] },
              { type: 'Fitness & Wellness', insight: "The premium residential demographic in Nichols Point has strong demand for allied health and boutique fitness. Mildura CBD suits high-volume gym and wellness formats. Mildura South serves a large family demographic with family-oriented fitness demand.", best: ['Nichols Point', 'Mildura CBD', 'Mildura South'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Mildura CBD captures the strongest tourism trade — river tourism visitors and Sunraysia wine tourists concentrate on Langtree Avenue. Wentworth at the Murray-Darling junction has concentrated visitor demand that exceeds the local supply during peak season. Nichols Point serves warm-season river tourism.", best: ['Mildura CBD', 'Wentworth', 'Nichols Point'] },
              { type: 'Community and Convenience', insight: "Irymple, Red Cliffs, and Merbein are the strongest community-convenience markets. All three have residential populations that actively support local operators who provide quality within their community. Gol Gol is the first-mover growth opportunity for convenience food serving a rapidly expanding residential base.", best: ['Irymple', 'Red Cliffs', 'Gol Gol'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Mildura Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Mildura CBD', slug: 'mildura-cbd', verdict: mVerdict('mildura-cbd'), score: mScore('mildura-cbd'), rentFrom: '$2,000/mo', body: "Langtree Avenue pedestrian mall is the commercial and dining spine of the Sunraysia region. The only major commercial centre for 150km draws a 70,000-person catchment. Strong independent food scene validates the market and raises the quality bar. Wine and river tourism adds above-average visitor spend year-round." },
              { rank: 2, name: 'Mildura South', slug: 'mildura-south', verdict: mVerdict('mildura-south'), score: mScore('mildura-south'), rentFrom: '$2,000/mo', body: "Fifteenth Street commercial corridor serving the largest residential catchment in Mildura. Consistent year-round family and convenience trade independent of tourism cycles. Lower competition intensity than the CBD for operators who want reliable residential demand." },
              { rank: 3, name: 'Nichols Point', slug: 'nichols-point', verdict: mVerdict('nichols-point'), score: mScore('nichols-point'), rentFrom: '$1,500/mo', body: "Premium riverfront residential suburb with above-average household incomes and quality hospitality demand that is underserved relative to the demographic. Warm-season river tourism adds to a strong year-round resident base. The quality casual dining gap in this suburb is real." },
              { rank: 4, name: 'Gol Gol', slug: 'gol-gol', verdict: mVerdict('gol-gol'), score: mScore('gol-gol'), rentFrom: '$1,200/mo', body: "Growing NSW residential suburb across the Murray with residential development outpacing commercial supply. First-mover convenience and casual dining opportunity for operators who understand the NSW planning and licensing context. River tourism adds a warm-season uplift." },
              { rank: 5, name: 'Irymple', slug: 'irymple', verdict: mVerdict('irymple'), score: mScore('irymple'), rentFrom: '$1,200/mo', body: "Horticultural residential suburb with a large multicultural community. Underserved by quality food relative to its residential population. Early-morning and value-lunch demand from the agricultural workforce creates specific trading windows. Low rents and genuine community need." },
              { rank: 6, name: 'Red Cliffs', slug: 'red-cliffs', verdict: mVerdict('red-cliffs'), score: mScore('red-cliffs'), rentFrom: '$800/mo', body: "Self-contained satellite town 14km east with strong community loyalty. Residents prefer local businesses over the Mildura trip for everyday needs. Low competition, low rents, and a captive catchment for operators who become part of the town's commercial fabric." },
              { rank: 7, name: 'Wentworth', slug: 'wentworth', verdict: mVerdict('wentworth'), score: mScore('wentworth'), rentFrom: '$700/mo', body: "Murray-Darling river junction historic town with above-average day-tripper demand for its permanent population. Tourism peak in spring and autumn. Very low rents but seasonal revenue — winter is genuinely quiet without a local trade plan." },
              { rank: 8, name: 'Merbein', slug: 'merbein', verdict: mVerdict('merbein'), score: mScore('merbein'), rentFrom: '$700/mo', body: "Small western satellite town 9km from Mildura. Modest demand ceiling constrained by catchment scale. Loyal community character supports essential-service operators. The lowest rents in the Mildura region make small-scale viable at lower revenue thresholds." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/mildura/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #451A03 0%, #92400E 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Mildura address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Mildura address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FEF3C7', color: '#451A03', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Mildura address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Mildura Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="mildura" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Mildura Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Mildura CBD vs Mildura South', body: "Both are strong markets but with different risk profiles. The CBD on Langtree Avenue has the regional catchment, tourism overlay, and the established food culture — but higher competition means new entrants need genuine differentiation. Mildura South on Fifteenth Street has consistent residential trade without tourism complexity, slightly lower rents, and a more forgiving competitive environment for well-executed concepts that serve the family and convenience market. CBD for operators who want to compete in the premium food scene; Mildura South for operators who want reliable volume without the CBD noise." },
              { title: 'Nichols Point vs CBD for premium concepts', body: "Nichols Point has a higher-income demographic than the CBD — above-average household incomes and strong owner-occupier rates create a quality-seeking residential market. The CBD wins on volume and tourism; Nichols Point wins on demographic quality and lower competition intensity. A premium residential cafe or quality casual dining concept that wants loyal, high-spend customers in a less competitive environment should seriously consider Nichols Point over the CBD, despite the lower absolute foot traffic count." },
              { title: 'Red Cliffs vs Wentworth for satellite towns', body: "Both are self-contained satellite communities with low rents and low competition. Red Cliffs has a larger, more stable residential catchment — 14km from Mildura, 8,000-plus residents, strong community loyalty habits, and consistent year-round demand. Wentworth has a smaller permanent population but genuine tourism at the Murray-Darling junction that creates visitor-facing demand. Red Cliffs suits operators who want a stable residential community business; Wentworth suits operators who want to serve the tourism market at very low entry cost with the understanding that winter is quiet." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Risk Zones — What Every Mildura Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Mildura business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Summer heat operational failure', why: "January and February in Mildura regularly exceed 40 degrees Celsius. Operators who have not adapted their format — air conditioning, shaded outdoor areas, lighter summer menus — discover that daytime foot traffic on Langtree Avenue drops materially during heatwave conditions. This is a plannable operational challenge, not an unpredictable event. Operators who design for the heat rather than being surprised by it find that well-adapted formats attract customers who are specifically seeking cool, comfortable environments during heatwave periods." },
              { name: 'Misreading the Gol Gol NSW complexity', why: "Gol Gol is a genuine first-mover opportunity but the NSW state boundary creates real administrative complexity that some operators discover after committing to a lease. Food business licensing, liquor licensing, building compliance, and employment law all operate under NSW rules rather than Victorian rules. Operators who do the licensing homework before signing a Gol Gol lease avoid an expensive surprise; those who assume Victorian rules apply discover they have committed to a process that takes longer and costs more than planned." },
              { name: 'Projecting Wentworth tourism across all months', why: "Wentworth has genuine tourism at the Murray-Darling river junction and very low rents — an apparently compelling combination. The risk is that peak-season tourism (spring and autumn) is strong, but mid-summer heat and mid-winter cold reduce visitor numbers significantly, and the permanent population of Wentworth is very small. Operators who model a Wentworth business on the peak-season visitor trade will face cash flow pressure for five or six months of the year. The model that works is seasonal revenue management with costs structured for the off-season baseline." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Mildura Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <MilduraFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Mildura Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Mildura location?"
        subtitle="Run a free analysis on any Mildura address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/mildura/mildura-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Mildura CBD Analysis →</Link>
          <Link href="/analyse/mildura/nichols-point" style={{ color: C.brand, textDecoration: 'none' }}>Nichols Point Analysis →</Link>
          <Link href="/analyse/mildura/red-cliffs" style={{ color: C.brand, textDecoration: 'none' }}>Red Cliffs Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
