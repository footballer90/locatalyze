// app/(marketing)/analyse/geelong/page.tsx
// Geelong city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getGeelongSuburb, getGeelongSuburbs } from '@/lib/analyse-data/geelong'

function gScore(slug: string): number {
  return getGeelongSuburb(slug)?.compositeScore ?? 0
}
function gVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getGeelongSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Geelong — 2026 Location Guide',
  description:
    'Geelong business location guide 2026. 10 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Geelong suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/geelong' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Geelong — 2026 Location Guide',
    description: '10 Geelong suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/geelong',
  },
}

const COMPARISON_ROWS = [
  { name: 'Pakington St, Geelong West', score: gScore('geelong-west'), verdict: gVerdict('geelong-west'), rent: '$3,500–$6,000', footTraffic: 'Very High', bestFor: "Independent café, casual dining, boutique retail" },
  { name: 'Newtown', score: gScore('newtown'), verdict: gVerdict('newtown'), rent: '$2,800–$5,500', footTraffic: 'High', bestFor: 'Specialty café, quality-casual, independent retail' },
  { name: 'Geelong CBD / Little Malop St', score: gScore('geelong-cbd'), verdict: gVerdict('geelong-cbd'), rent: '$3,500–$7,000', footTraffic: 'High', bestFor: 'Restaurants, café, professional services' },
  { name: 'South Geelong / Rippleside', score: gScore('south-geelong'), verdict: gVerdict('south-geelong'), rent: '$2,500–$4,500', footTraffic: 'Medium-High', bestFor: 'Waterfront dining, café, casual hospitality' },
  { name: 'Belmont', score: gScore('belmont'), verdict: gVerdict('belmont'), rent: '$2,200–$4,000', footTraffic: 'Medium-High', bestFor: 'Community café, family dining, local retail' },
  { name: 'Torquay', score: gScore('torquay'), verdict: gVerdict('torquay'), rent: '$2,500–$5,000', footTraffic: 'High (seasonal)', bestFor: 'Surf lifestyle retail, casual dining, beach café' },
  { name: 'Ocean Grove', score: gScore('ocean-grove'), verdict: gVerdict('ocean-grove'), rent: '$2,200–$4,500', footTraffic: 'Medium-High (seasonal)', bestFor: 'Lifestyle café, casual dining, boutique retail' },
  { name: 'Armstrong Creek', score: gScore('armstrong-creek'), verdict: gVerdict('armstrong-creek'), rent: '$1,800–$3,500', footTraffic: 'Medium', bestFor: 'Community café, family dining, essential services' },
]

const SUBURB_CATEGORIES = [
  {
    title: "Established Strips — Geelong's Best Independent Markets",
    description: "Geelong's proven hospitality and retail corridors. Strong customer quality, active foot traffic, and a demonstrated track record of successful independent operators.",
    suburbs: [
      { name: 'Pakington Street, Geelong West', slug: 'geelong-west', description: "Geelong's Fitzroy. Melbourne-quality independent strip at 40% lower rent — the clearest entry point for quality hospitality operators.", score: gScore('geelong-west'), verdict: gVerdict('geelong-west'), rentRange: '$3,500–$6,000/mo' },
      { name: 'Newtown', slug: 'newtown', description: "Heritage residential at its best. High household income, consistent repeat trade, and validated demand for quality independent operators.", score: gScore('newtown'), verdict: gVerdict('newtown'), rentRange: '$2,800–$5,500/mo' },
      { name: 'Geelong CBD / Little Malop Street', slug: 'geelong-cbd', description: "Reinvented city heart with waterfront adjacency. Event-driven revenue uplifts and a growing professional and visitor demographic.", score: gScore('geelong-cbd'), verdict: gVerdict('geelong-cbd'), rentRange: '$3,500–$7,000/mo' },
    ],
  },
  {
    title: 'Residential Value — Loyal Trade, Lower Cost',
    description: 'Established suburban markets where demand is proven, rents are below the inner strips, and loyal local trade sustains operators who build genuine community relationships.',
    suburbs: [
      { name: 'Belmont', slug: 'belmont', description: "Geelong's established SE hub. Myers Street centre anchors consistent foot traffic; loyal local trade rewards quality execution.", score: gScore('belmont'), verdict: gVerdict('belmont'), rentRange: '$2,200–$4,000/mo' },
      { name: 'South Geelong / Rippleside', slug: 'south-geelong', description: 'Waterfront adjacency at suburban rent. Cunningham Pier events drive hospitality demand in an underserved market.', score: gScore('south-geelong'), verdict: gVerdict('south-geelong'), rentRange: '$2,500–$4,500/mo' },
    ],
  },
  {
    title: 'Surf Coast — Seasonal Strategy Required',
    description: 'Strong peak-season revenue from tourism, genuine off-season risk. Operators need dual income streams: tourist peak plus local loyalty to sustain year-round viability.',
    suburbs: [
      { name: 'Torquay', slug: 'torquay', description: "Surf Coast gateway. Summer revenue exceptional — winter requires a strong permanent resident base. Rents well below Gold Coast equivalents.", score: gScore('torquay'), verdict: gVerdict('torquay'), rentRange: '$2,500–$5,000/mo' },
      { name: 'Ocean Grove', slug: 'ocean-grove', description: "Bellarine Peninsula lifestyle hub. Larger permanent population than Torquay moderates the off-season cliff.", score: gScore('ocean-grove'), verdict: gVerdict('ocean-grove'), rentRange: '$2,200–$4,500/mo' },
    ],
  },
  {
    title: 'Growth Corridors — First-Mover Opportunity',
    description: 'New and developing suburbs where demand is growing but hospitality supply has not kept pace. Very low competition, very low rent, asymmetric first-mover advantage.',
    suburbs: [
      { name: 'Armstrong Creek', slug: 'armstrong-creek', description: "Fastest-growing new suburb south of Geelong. Young family demographic, almost no competition, sub-market rents.", score: gScore('armstrong-creek'), verdict: gVerdict('armstrong-creek'), rentRange: '$1,800–$3,500/mo' },
      { name: 'Lara', slug: 'lara', description: "Northern growth corridor between Geelong and Melbourne. Growing permanent residential base, thin hospitality supply.", score: gScore('lara'), verdict: gVerdict('lara'), rentRange: '$1,500–$3,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: "What is the best suburb to open a café in Geelong?",
    answer: "Pakington Street in Geelong West is the clearest answer for operators who want an established market — it is Geelong's benchmark independent strip, comparable to Melbourne's Fitzroy but at roughly 40% lower rent. For operators who want the best risk-adjusted opportunity in 2026, Newtown delivers a high-income residential catchment with consistent repeat trade and competition that is active but not saturated. The growth-stage play is Armstrong Creek, where a young professional and family demographic is significantly underserved by quality hospitality supply.",
  },
  {
    question: 'How do Geelong commercial rents compare to Melbourne?',
    answer: "Geelong rents are 35–50% lower than comparable Melbourne inner-suburb positions. A prime Pakington Street position at $5,000/month would cost $9,000–$14,000/month in Fitzroy or Prahran. This cost advantage is Geelong's structural opportunity for independent operators — break-even is achievable at materially lower revenue thresholds, reducing first-year failure risk. The rent differential persists despite significant demand growth, particularly in Geelong West and Newtown, because population scale keeps a ceiling on how far rents can rise.",
  },
  {
    question: "Is Pakington Street genuinely comparable to Fitzroy?",
    answer: "In terms of customer quality and independent hospitality culture, yes — Pakington Street has produced nationally recognised cafés and restaurants and attracts a professional demographic with Melbourne-equivalent expectations for quality and experience. The critical difference is rent: a comparable Fitzroy strip position costs 40–60% more. This means Geelong operators achieve similar customer quality at significantly lower cost, which translates to better unit economics and more resilient businesses in the first 18–24 months.",
  },
  {
    question: 'What is the risk of opening a business in Torquay or Ocean Grove?',
    answer: "Both markets are viable with the right planning — the risk is operators who open based on peak-season revenue projections without a viable winter strategy. Summer trade in both markets can be exceptional, but June through August sees tourist traffic fall significantly. The operators who succeed in Torquay and Ocean Grove are those who build genuine permanent resident loyalty that sustains the business through the quieter months. Ocean Grove has a larger permanent population than Torquay, making the off-season risk slightly more manageable.",
  },
  {
    question: "What is the post-Ford Geelong opportunity for business operators?",
    answer: "The closure of Ford manufacturing in Geelong in 2016 triggered a deliberate economic transition toward creative industries, education, and healthcare. Deakin University's Geelong Waterfront and Waurn Ponds campuses now enrol over 60,000 students, creating consistent demand from a student and academic population. The creative economy expansion has driven residential demand in inner suburbs like Geelong West, Newtown, and South Geelong. The net result is a more diverse, professional consumer base than the manufacturing-era city delivered.",
  },
  {
    question: 'Are Armstrong Creek and Lara worth considering?',
    answer: "Both are genuine first-mover opportunities for operators who are willing to build a customer base over time. Armstrong Creek is growing fastest and will continue to do so — a young professional and family demographic is arriving ahead of hospitality supply. Lara is more established but similarly underserved. The case for both is the same: very low rent, very low competition, and a demographic trajectory that will continue to improve. The tradeoff is patience — volume will be lower in the first 12–18 months than an established strip, requiring a longer build period.",
  },
  {
    question: "How does Geelong's tourism market compare to the Surf Coast?",
    answer: "Geelong city itself (CBD, Waterfront, Pakington Street) has a moderate tourism draw that adds revenue uplift without extreme seasonality — the Geelong Waterfront, GMHBA Stadium events, and Melbourne day-tripper traffic contribute a steady visitor layer. The Surf Coast (Torquay, Ocean Grove) is a materially different market with much higher peak tourism and much higher seasonal risk. Operators who want tourism upside without Surf Coast seasonality should target the CBD or Waterfront precincts rather than the coastal towns.",
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

function GeelongFactorDirectory() {
  const suburbs = getGeelongSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/geelong/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', backgroundColor: verdictBg, color: verdictColor, border: `1px solid ${verdictBdr}`, letterSpacing: '0.05em' }}>
                  {s.verdict === 'RISKY' ? 'NO' : s.verdict}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[{ label: 'Café', value: s.cafe }, { label: 'Restaurant', value: s.restaurant }, { label: 'Retail', value: s.retail }].map(({ label, value }) => (
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

export default function GeelongPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Geelong"
        citySlug="geelong"
        tagline="Melbourne operators are looking at Geelong for a reason. Pakington Street delivers Fitzroy-quality customers at 40% lower rent — and the post-Ford economy is producing a more sophisticated independent market than Geelong has ever had."
        statChips={[
          { text: "Pakington Street: Geelong's Fitzroy, at 40% lower rent" },
          { text: 'Deakin University: 60,000+ students across two campuses' },
          { text: 'Geelong Waterfront revitalisation driving real tourism demand' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, REIV Q1 2026, JLL Geelong, and Locatalyze proprietary foot traffic analysis.
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
              { value: '270K+', label: "Greater Geelong population — Victoria's second-largest city by population", source: 'ABS 2024' },
              { value: '40%', label: 'Lower commercial rents vs comparable Melbourne inner-suburb strips', source: 'REIV / JLL Q1 2026' },
              { value: '60K+', label: 'Deakin University students across Geelong Waterfront and Waurn Ponds campuses', source: 'Deakin University 2025' },
              { value: '75km', label: 'From Melbourne CBD — fastest-growing satellite city in regional Victoria', source: 'Infrastructure Victoria 2025' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Geelong Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Geelong is the most compelling regional business location in Victoria for independent operators who want Melbourne-quality customers at regional rents. The city has undergone a structural economic transformation since the Ford manufacturing closure in 2016 — creative industries, education, and healthcare have replaced heavy manufacturing as the employment base, producing a more diverse, younger, and more professionally oriented population than the city has had at any point in its history.",
              "Pakington Street in Geelong West is the reference point. It is not an emerging market or a city hoping to develop a food culture — it is an established, nationally recognised independent hospitality strip that has produced award-winning operators across coffee, casual dining, and boutique retail. The critical data point for Melbourne operators considering Geelong: a comparable strip position costs 40% less than Fitzroy or Collingwood, with a customer demographic whose expectations and spending behaviour are approaching Melbourne equivalents.",
              "Deakin University's two Geelong campuses — the Waterfront campus in the CBD and the Waurn Ponds campus in the south — collectively enrol over 60,000 students. This institutional anchor creates consistent demand from a young, educated, and quality-oriented consumer base that extends well beyond the student population itself to include the academic and professional services workforce that has grown around the university.",
              "The Surf Coast market (Torquay, Ocean Grove, the Bellarine Peninsula) is a separate economic entity from the Geelong city market and requires fundamentally different planning. Summer tourism revenue in these markets is exceptional — but operators who do not build a permanent resident loyalty base before winter arrive in June to discover that a significant percentage of their customer base has returned to Melbourne for the school term. The operators who succeed in these markets build both income streams deliberately.",
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
              { type: "Cafés & Specialty Coffee", insight: "Pakington Street is the default benchmark. Newtown is the underrated play — comparable demographic quality, lower competition, reliable repeat trade. For operators who want a growth market, Armstrong Creek's young family demographic is underserved and actively seeking quality coffee at a local level.", best: ['Pakington St', 'Newtown', 'Armstrong Creek'] },
              { type: "Full-Service Restaurants", insight: "The Geelong CBD and Little Malop Street is the primary restaurant precinct — event-night trade from GMHBA Stadium and the Waterfront adds meaningful revenue uplift. South Geelong and Rippleside are the emerging opportunity for waterfront dining concepts.", best: ['Geelong CBD', 'South Geelong', 'Pakington St'] },
              { type: "Retail (Independent)", insight: "Pakington Street is Geelong's strongest independent retail strip — the boutique retail culture mirrors Fitzroy's, with a customer base that actively seeks independent alternatives to chains. Belmont's Myers Street corridor serves the suburban retail market with a loyal local base.", best: ['Pakington St', 'Newtown', 'Belmont'] },
              { type: "Fitness & Wellness", insight: "Boutique fitness and allied health follow high-income residential concentration. Newtown and Pakington Street serve the highest-income demographics in inner Geelong. Torquay and Ocean Grove support lifestyle wellness positioning with a health-oriented permanent population.", best: ['Newtown', 'Pakington St', 'Torquay'] },
              { type: "Surf Lifestyle & Beach Retail", insight: "Torquay is the definitive surf lifestyle retail market — Surf Coast Highway and Surf City Plaza are the reference points for the category nationally. Ocean Grove is the Bellarine Peninsula equivalent, with a more balanced seasonal profile.", best: ['Torquay', 'Ocean Grove', 'Geelong CBD'] },
              { type: "Creative & Hospitality Concepts", insight: "The post-Ford creative economy is concentrating in inner Geelong — Geelong West, Newtown, and South Geelong are the precincts where emerging creative hospitality concepts find an early-adopter demographic and affordable entry before the market matures.", best: ['Geelong West', 'Geelong CBD', 'South Geelong'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Geelong Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Pakington Street, Geelong West', slug: 'geelong-west', verdict: gVerdict('geelong-west'), score: gScore('geelong-west'), rentFrom: '$3,500/mo', body: "Pakington Street is Geelong's Fitzroy — an established, nationally recognised independent strip that delivers Melbourne-quality customers at 40% lower rent. Differentiated concepts find loyal followings; undifferentiated operators face direct comparison with established incumbents. The critical structural advantage is rent: independent hospitality economics that are impossible in Fitzroy are routine here." },
              { rank: 2, name: 'Newtown', slug: 'newtown', verdict: gVerdict('newtown'), score: gScore('newtown'), rentFrom: '$2,800/mo', body: "Geelong's most affluent heritage suburb delivers one of the clearest value propositions in regional Victoria: a high-income residential catchment with consistent repeat trade at rents that are 30–40% below Pakington Street. The customer base is almost entirely local — operators who build genuine community relationships sustain revenue that does not depend on tourism or event traffic." },
              { rank: 3, name: 'Geelong CBD / Little Malop Street', slug: 'geelong-cbd', verdict: gVerdict('geelong-cbd'), score: gScore('geelong-cbd'), rentFrom: '$3,500/mo', body: "Little Malop Street's reinvented hospitality precinct and Waterfront adjacency make the Geelong CBD the most event-driven market in the region. GMHBA Stadium events (AFL, concerts) and Waterfront tourism add structured revenue uplifts that neighbourhood markets cannot access. Quality operators have raised the bar — differentiation is non-optional." },
              { rank: 4, name: 'South Geelong / Rippleside', slug: 'south-geelong', verdict: gVerdict('south-geelong'), score: gScore('south-geelong'), rentFrom: '$2,500/mo', body: "Waterfront adjacency and Cunningham Pier events at suburban rent — a genuine gap market for operators who want waterfront demand without CBD pricing. The current underservice of quality hospitality supply is the opportunity: a growing residential base is arriving ahead of the operators who should be serving it." },
              { rank: 5, name: 'Belmont', slug: 'belmont', verdict: gVerdict('belmont'), score: gScore('belmont'), rentFrom: '$2,200/mo', body: "Geelong's established southeastern residential corridor. The Myers Street centre anchors consistent foot traffic; the local family and professional demographic supports reliable repeat trade. Low seasonality and low tourism mean the business model is entirely local — which rewards operators who invest in community relationships over destination marketing." },
              { rank: 6, name: 'Torquay', slug: 'torquay', verdict: gVerdict('torquay'), score: gScore('torquay'), rentFrom: '$2,500/mo', body: "The Surf Coast gateway delivers exceptional peak-season revenue for operators who correctly model both the summer upside and the winter risk. Bells Beach, Great Ocean Road visitor traffic, and a growing permanent professional population create a multi-layered demand structure. The failure mode is projecting October–April revenue across 12 months without a local loyalty strategy." },
              { rank: 7, name: 'Ocean Grove', slug: 'ocean-grove', verdict: gVerdict('ocean-grove'), score: gScore('ocean-grove'), rentFrom: '$2,200/mo', body: "The Bellarine Peninsula's lifestyle hub has a larger permanent population than Torquay, which moderates the off-season revenue dip. School holiday peaks are significant; the local community base is growing consistently. Operators who build genuine permanent resident loyalty alongside tourist-season revenue achieve year-round viability that pure tourist-trade concepts cannot." },
              { rank: 8, name: 'Armstrong Creek', slug: 'armstrong-creek', verdict: gVerdict('armstrong-creek'), score: gScore('armstrong-creek'), rentFrom: '$1,800/mo', body: "The fastest-growing new suburb south of Geelong is delivering a young professional and family demographic that is actively seeking quality hospitality options it currently has to drive to Geelong West or the CBD to find. Very low rent, very low competition, and a demographic trajectory that will continue to improve make Armstrong Creek a first-mover opportunity with a 3–5 year growth runway." },
              { rank: 9, name: 'Lara', slug: 'lara', verdict: gVerdict('lara'), score: gScore('lara'), rentFrom: '$1,500/mo', body: "The northern growth corridor between Geelong and Melbourne is building a self-contained residential community. Operators who establish in Lara now build first-mover brand loyalty in a growing catchment at the lowest commercial rents in Greater Geelong. The business case is patience: volume builds as the corridor develops, not immediately at opening." },
              { rank: 10, name: 'Corio', slug: 'corio', verdict: gVerdict('corio'), score: gScore('corio'), rentFrom: '$1,200/mo', body: "Geelong's industrial north serves a workforce and residential catchment that supports value food and essential services at the lowest rents in the region. Premium independent concepts face a spending-capacity ceiling; value-positioned operators can achieve viable economics at revenue thresholds below any other Geelong market." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/geelong/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Geelong address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Geelong address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#F5F5F4', color: '#1C1917', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Geelong address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Geelong Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>10 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="geelong" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Geelong Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Pakington Street vs Newtown', body: "Pakington Street is the higher-volume, higher-competition option — an established strip with proven customer depth but active competition from experienced operators. Newtown is the quieter, higher-margin play — a comparable income demographic at 30–40% lower rent with less competition to absorb. Operators who want volume should choose Pakington Street; operators who want reliable margins and a loyal local base should look at Newtown." },
              { title: 'Torquay vs Ocean Grove', body: "Torquay has higher peak tourism revenue but sharper seasonal risk — the permanent population is smaller relative to the holiday visitor base. Ocean Grove has a larger permanent residential base that moderates the off-season cliff. For operators who need year-round cash flow without Torquay-level winter risk, Ocean Grove's more balanced demand structure is the lower-risk choice. Both require a genuine local loyalty strategy for viable winter economics." },
              { title: 'Geelong CBD vs Pakington Street', body: "The CBD delivers event-driven traffic from GMHBA Stadium and the Waterfront that Pakington Street cannot access — on Cats match days and major concerts, CBD foot traffic significantly exceeds a typical Pakington Street weekend. But Pakington Street delivers more consistent daily foot traffic from its residential catchment across every day of the week. For restaurants that benefit from event peaks, the CBD is compelling. For cafés that need consistent weekday volume, Pakington Street is more reliable." },
              { title: 'Armstrong Creek vs Lara', body: "Both are first-mover growth corridor plays at very low rent. Armstrong Creek is growing faster and has a younger, more hospitality-oriented demographic — the master-planned community design includes commercial precincts built for the operators who are not yet there. Lara is more established but similarly underserved. Armstrong Creek has the better near-term growth trajectory; Lara has the advantage of an already-settled residential base that Armstrong Creek is still accumulating." },
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
              { name: 'Torquay and Ocean Grove (without winter strategy)', why: "Both markets are viable for operators who correctly model the seasonality — not viable for operators who open in December based on peak-month projections and treat winter as a surprise. The operators who fail in these markets almost universally share the same profile: strong summer trading, no local loyalty base, cash flow crisis from May to August. The solution is not to avoid these markets but to build the local customer relationship before summer, not instead of it." },
              { name: "Corio (premium concept positioning)", why: "Corio's workforce and residential demographic constrains premium pricing in a way that makes specialty coffee, fine dining, and boutique retail economically unviable at standard industry margins. The market supports value-positioned food, essential services, and community-oriented concepts. Operators who arrive with a premium positioning and a Pakington Street mental model are mismatched to the catchment in ways that cannot be resolved by quality of execution." },
              { name: 'Pakington Street (undifferentiated entry)', why: "Pakington Street is not a high-risk location for a genuinely differentiated concept — it is high-risk for an operator who opens a generic café or casual dining format without a clear reason for local customers to choose them over the seven comparable venues already on the strip. The strip rewards differentiation and punishes homogeneity. The market is not oversaturated in the Sydney or Melbourne sense, but it has enough quality operators that generic does not survive." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Geelong Suburb Factor Breakdown — All 10 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <GeelongFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Geelong Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Geelong location?"
        subtitle="Run a free analysis on any Geelong address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/geelong/geelong-west" style={{ color: C.brand, textDecoration: 'none' }}>Pakington Street Analysis →</Link>
          <Link href="/analyse/geelong/newtown" style={{ color: C.brand, textDecoration: 'none' }}>Newtown Analysis →</Link>
          <Link href="/analyse/geelong/torquay" style={{ color: C.brand, textDecoration: 'none' }}>Torquay Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
