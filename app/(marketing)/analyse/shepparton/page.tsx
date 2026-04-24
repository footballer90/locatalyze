// app/(marketing)/analyse/shepparton/page.tsx
// Shepparton city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getSheppartonSuburb, getSheppartonSuburbs } from '@/lib/analyse-data/shepparton'

function sScore(slug: string): number {
  return getSheppartonSuburb(slug)?.compositeScore ?? 0
}
function sVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getSheppartonSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Shepparton — 2026 Location Guide',
  description:
    'Shepparton business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Shepparton suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/shepparton' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Shepparton — 2026 Location Guide',
    description: '8 Shepparton suburbs ranked and scored. Rent benchmarks, Goulburn Valley demographics, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/shepparton',
  },
}

const COMPARISON_ROWS = [
  { name: 'Shepparton CBD', score: sScore('shepparton-cbd'), verdict: sVerdict('shepparton-cbd'), rent: '$2,500–$5,000', footTraffic: 'High', bestFor: 'Retail, casual dining, professional services' },
  { name: 'Shepp East', score: sScore('shepp-east'), verdict: sVerdict('shepp-east'), rent: '$2,000–$4,000', footTraffic: 'High (hospital)', bestFor: 'Extended-hours cafe, allied health, convenience' },
  { name: 'Kialla', score: sScore('kialla'), verdict: sVerdict('kialla'), rent: '$1,500–$3,000', footTraffic: 'Medium (growing)', bestFor: 'First-mover family cafe, casual dining' },
  { name: 'Mooroopna', score: sScore('mooroopna'), verdict: sVerdict('mooroopna'), rent: '$1,200–$2,500', footTraffic: 'Medium', bestFor: 'Community hospitality, residential concepts' },
  { name: 'Shepparton North', score: sScore('shepparton-north'), verdict: sVerdict('shepparton-north'), rent: '$1,200–$2,500', footTraffic: 'Medium (industrial)', bestFor: 'Tradesperson cafe, lunch trade, essential services' },
  { name: 'Nagambie', score: sScore('nagambie'), verdict: sVerdict('nagambie'), rent: '$1,000–$2,500', footTraffic: 'Medium (seasonal)', bestFor: 'Wine region dining, lake tourism hospitality' },
  { name: 'Grahamvale', score: sScore('grahamvale'), verdict: sVerdict('grahamvale'), rent: '$700–$1,800', footTraffic: 'Low-Medium', bestFor: 'Community concept, artisan food, farm-adjacent retail' },
  { name: 'Tatura', score: sScore('tatura'), verdict: sVerdict('tatura'), rent: '$700–$1,800', footTraffic: 'Low', bestFor: 'Community essential services, rural market' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Commercial Core — Year-Round Trade',
    description: 'Shepparton CBD and Shepp East form the commercial and institutional spine of the Goulburn Valley. The CBD draws a 100km regional catchment; the hospital precinct delivers the most consistent year-round foot traffic in the city.',
    suburbs: [
      { name: 'Shepparton CBD', slug: 'shepparton-cbd', description: 'High Street is the primary retail and dining spine of northern Victoria. Eastbank Centre and Maude Street Mall anchor the highest foot traffic in the Goulburn Valley. Regional capital trade from a 100km catchment.', score: sScore('shepparton-cbd'), verdict: sVerdict('shepparton-cbd'), rentRange: '$2,500–$5,000/mo' },
      { name: 'Shepp East', slug: 'shepp-east', description: 'GV Health hospital precinct — 2,000+ staff, 7-day shift patterns, year-round demand. Extended-hours operators serving the healthcare workforce find a reliable, competition-light market.', score: sScore('shepp-east'), verdict: sVerdict('shepp-east'), rentRange: '$2,000–$4,000/mo' },
    ],
  },
  {
    title: 'Residential Growth — First-Mover Opportunities',
    description: 'Kialla is the fastest-growing residential corridor in Shepparton. Mooroopna has a stable community catchment across the river. Both are underserved by quality hospitality relative to their residential populations.',
    suburbs: [
      { name: 'Kialla', slug: 'kialla', description: 'Fastest-growing residential estate in the Shepparton area. Young families who travel to the CBD for hospitality they cannot find locally. First-mover window open for correctly positioned operators.', score: sScore('kialla'), verdict: sVerdict('kialla'), rentRange: '$1,500–$3,000/mo' },
      { name: 'Mooroopna', slug: 'mooroopna', description: 'Cross-river residential suburb with multicultural community character. Small number of established operators leave genuine space for quality-focused concepts serving the diverse local catchment.', score: sScore('mooroopna'), verdict: sVerdict('mooroopna'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
  {
    title: 'Industrial and Fringe — Blue-Collar Demand',
    description: 'Shepparton North serves the industrial estate workforce. Predictable weekday demand from SPC Ardmona, Murray Goulburn, and surrounding light industrial operators who need quality, value-focused food.',
    suburbs: [
      { name: 'Shepparton North', slug: 'shepparton-north', description: 'Industrial estate fringe serving blue-collar workforce. Reliable weekday breakfast and lunch trade. Low rents and genuine demand gap for quality food operators who calibrate to the workforce market.', score: sScore('shepparton-north'), verdict: sVerdict('shepparton-north'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
  {
    title: 'Wine Region and Rural Satellites',
    description: 'Nagambie is a genuine wine region tourism destination with seasonal uplift. Grahamvale and Tatura are smaller rural markets that reward community-focused operators over destination hospitality concepts.',
    suburbs: [
      { name: 'Nagambie', slug: 'nagambie', description: 'Tahbilk and Mitchelton winery region on Lake Nagambie. Genuine seasonal tourism from Melbourne day-trippers. Spring and summer peaks — operators must plan for winter.', score: sScore('nagambie'), verdict: sVerdict('nagambie'), rentRange: '$1,000–$2,500/mo' },
      { name: 'Grahamvale', slug: 'grahamvale', description: 'Peri-urban semi-rural suburb on the eastern fringe. Very low competition, very low rents, modest demand ceiling. Suits community-oriented artisan or farm-adjacent concepts.', score: sScore('grahamvale'), verdict: sVerdict('grahamvale'), rentRange: '$700–$1,800/mo' },
      { name: 'Tatura', slug: 'tatura', description: 'Small agricultural service town 20km west. Dairy and mixed-farming community with a modest hospitality market. Low rents make small-scale essential services viable.', score: sScore('tatura'), verdict: sVerdict('tatura'), rentRange: '$700–$1,800/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe in Shepparton?',
    answer: "Shepparton CBD and Shepp East are the strongest cafe markets. The CBD provides the broadest catchment — High Street foot traffic from the Goulburn Valley's regional capital draws shoppers and office workers year-round. Shepp East has the hospital edge: GV Health's 2,000-plus staff create a reliable shift-work demand pattern across seven days. Kialla is the first-mover opportunity — the fastest-growing residential estate in Shepparton has a large family catchment with no quality cafe nearby. Operators who establish community loyalty in Kialla before the market fills have a durable long-term position.",
  },
  {
    question: 'How does the Goulburn Valley harvest season affect Shepparton businesses?',
    answer: "The Goulburn Valley fruit harvest from February to April brings itinerant agricultural workers to the broader region, creating modest uplifts for CBD operators and especially for businesses near Mooroopna and outer suburban areas where seasonal accommodation is concentrated. The effect is real but not dramatic — the CBD's primary customer base is the permanent resident and professional population, not seasonal workers. Nagambie is more directly affected by its own seasonal cycle (winery tourism in spring and summer) than by the SPC harvest. Operators should model harvest season as a small bonus rather than a structural demand driver.",
  },
  {
    question: 'Is Nagambie a viable hospitality location?',
    answer: "Nagambie is viable for the right operator with the right strategy. The Tahbilk and Mitchelton wineries and Lake Nagambie water sports precinct create genuine Melbourne day-tripper and weekend visitor demand, particularly from October to February. Rents are low, competition is modest, and the wine region character supports quality positioning. The structural challenge is winter — June to August is materially softer, and operators who have not built a local community trade base face real cash flow pressure. The Nagambie model that works is: build local community loyalty first, treat the tourism season as upside. Operators who model only the peak season will be disappointed November through May.",
  },
  {
    question: 'What are the main risks of the Shepparton market?',
    answer: "Market scale is the primary structural constraint. Shepparton has approximately 65,000 people in the urban area — a genuine regional city with real demand, but a revenue ceiling that is lower than Geelong or Ballarat, let alone Melbourne. Operators who project growth-stage economics onto a stable regional market will be consistently disappointed. The second risk is competition complacency: the CBD has established operators who have built genuine local loyalty, and new entrants who open without clear differentiation find it harder than expected to capture market share. The third risk specific to outer suburbs is over-projecting from residential growth — Kialla's fast growth is real, but the commercial market matures more slowly than the residential population.",
  },
  {
    question: 'How does the hospital precinct affect business in Shepp East?',
    answer: "GV Health is the single most reliable demand anchor in the Shepparton urban area. The hospital employs more than 2,000 staff across all shifts, creating morning, lunchtime, and evening demand windows that conventional retail-oriented operators often fail to serve. Extended-hours concepts — cafes open from 6am, takeaway food available after the evening shift change — have a genuine competitive advantage in Shepp East that does not exist in the CBD. The demand is year-round, entirely independent of tourism or agricultural cycles, and driven by a professional demographic with reasonable spending capacity. The supply gap for quality food within walking distance of the hospital remains real.",
  },
  {
    question: 'What business types work best in Shepparton?',
    answer: "Quality-casual hospitality that serves the permanent resident and professional population works best. The Shepparton CBD supports retail and dining concepts that serve the regional catchment — businesses that become the destination for Goulburn Valley residents rather than competing for tourists who do not primarily visit Shepparton for its hospitality scene. Shepp East rewards extended-hours cafe and food operators who serve the hospital workforce. Kialla and Mooroopna reward community hospitality operators who build neighbourhood loyalty in underserved residential markets. Nagambie rewards operators who can execute genuine wine region quality for visitors while maintaining a local resident base through winter.",
  },
  {
    question: 'What are commercial rents like in Shepparton compared to Melbourne?',
    answer: "Shepparton commercial rents are a fraction of Melbourne equivalents. A quality High Street position in the CBD runs $2,500 to $5,000 per month — comparable to a secondary Melbourne suburban strip but without the Melbourne competition density or demographic income levels. Outer suburbs and satellite towns are materially cheaper: Kialla commercial tenancies from $1,500/month, Nagambie from $1,000/month, Tatura from under $1,000/month. The implication is that break-even is achievable at lower absolute revenue levels than Melbourne, but the revenue ceiling is also lower. The economics work for operators who correctly calibrate their concept to the market rather than transplanting a Melbourne business model.",
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

function SheppartonFactorDirectory() {
  const suburbs = getSheppartonSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/shepparton/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function SheppartonPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Shepparton"
        citySlug="shepparton"
        tagline="The Goulburn Valley's regional capital has a genuine year-round trade base anchored by the hospital precinct, a 100km retail catchment, and fast residential growth in Kialla. The wine region satellite of Nagambie adds a seasonal tourism layer for operators who plan around it."
        statChips={[
          { text: '8 suburbs scored — CBD to wine region satellite' },
          { text: 'GV Health hospital: 2,000+ staff generating year-round shift-work demand' },
          { text: 'Kialla fastest-growing residential corridor — first-mover window open' },
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
              { value: '65K', label: 'Goulburn Valley urban population — regional capital drawing from 100km catchment', source: 'ABS 2024' },
              { value: '2,000+', label: 'GV Health staff — shift-working hospital customer base driving year-round demand', source: 'GV Health 2025' },
              { value: 'Kialla', label: 'Fastest-growing residential corridor — thousands of families underserved by quality hospitality', source: 'REIV Q1 2026' },
              { value: '$2.5K', label: 'CBD High Street rents from $2,500/month — materially below Melbourne for regional capital quality', source: 'REIV Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Shepparton Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Shepparton is the Goulburn Valley's regional capital — the commercial and service hub for northern Victoria, drawing from a genuine 100km catchment that extends across Mooroopna, Tatura, Nagambie, Cobram, and surrounding agricultural towns. High Street is among the most active regional retail strips in Victoria, anchored by Eastbank Centre and Maude Street Mall, and the city's status as the only major commercial centre for this catchment is a structural advantage that no smaller regional competitor can replicate.",
              "The hospital precinct is the most underappreciated demand anchor in Shepparton. GV Health employs more than 2,000 staff and operates 24 hours across seven days — creating shift-work demand windows that most commercial operators fail to serve. Extended-hours food concepts positioned near the hospital find a professional, year-round customer base that is almost entirely independent of tourism, seasons, or the agricultural calendar. The supply gap for quality food serving shift workers in Shepp East remains real despite the obvious opportunity.",
              "Kialla is the growth opportunity. The fastest-developing residential corridor in the Shepparton urban area has added thousands of families over the past decade and the commercial supply has not kept pace. Families who want a quality cafe or casual dining experience are currently making the trip to the CBD. First-mover operators who establish genuine quality and community loyalty in Kialla capture the market before competition arrives — a window that is closing as the suburb matures but remains open for operators who move now.",
              "Nagambie adds a wine region tourism layer to the Shepparton market. Tahbilk and Mitchelton are genuine Goulburn Valley icons that draw Melbourne day-trippers year-round, with spring and summer peaks around the lake and winery tourism circuit. The challenge is that Nagambie is genuinely seasonal — June to August is materially softer than October to February, and operators without a year-round local trade strategy face cash flow pressure through the winter months. The model that works in Nagambie is building local community loyalty to underpin the quiet season while capturing the tourism upside in the warm months.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Shepparton CBD and Shepp East are the strongest cafe markets. The CBD provides the broadest catchment for quality specialty coffee. Shepp East suits extended-hours concepts serving the hospital workforce. Kialla is the first-mover residential opportunity for operators who want to build community loyalty without CBD competition.", best: ['Shepparton CBD', 'Shepp East', 'Kialla'] },
              { type: 'Full-Service Restaurants', insight: "Shepparton CBD is the primary dinner market for the Goulburn Valley — the regional catchment draws from 100km for special occasions. Nagambie suits quality wine region dining for Melbourne visitors. Shepp East suits lunchtime and pre-shift dining for the hospital precinct professional market.", best: ['Shepparton CBD', 'Nagambie', 'Shepp East'] },
              { type: 'Retail (Independent)', insight: "High Street CBD is the regional retail destination — the only meaningful retail strip for a 100km catchment. Merrivale-equivalent large-format retail in Shepparton suits volume operators. Nagambie suits artisan and wine-region retail with genuine tourism draw.", best: ['Shepparton CBD', 'Kialla', 'Nagambie'] },
              { type: 'Fitness & Wellness', insight: "The professional demographic in Shepp East and the growing family catchment in Kialla have genuine demand for allied health, boutique fitness, and wellness services. The CBD suits high-volume fitness formats. Mooroopna has an underserved community wellness market.", best: ['Shepp East', 'Shepparton CBD', 'Kialla'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Nagambie is the only genuine tourism-adjacent location in the Shepparton region — the winery, lake, and wine region tourism circuit creates visitor-facing demand. Operators positioned for the Tahbilk and Mitchelton visitor market find a quality demographic willing to spend on regional food experiences.", best: ['Nagambie'] },
              { type: 'Community and Convenience', insight: "Kialla and Mooroopna are the strongest community-convenience markets. Both have growing or established residential populations that are underserved by quality local food. Shepparton North serves the industrial workforce with value-focused convenience demand. Tatura and Grahamvale suit essential-service community operators.", best: ['Kialla', 'Mooroopna', 'Shepparton North'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Shepparton Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Shepparton CBD', slug: 'shepparton-cbd', verdict: sVerdict('shepparton-cbd'), score: sScore('shepparton-cbd'), rentFrom: '$2,500/mo', body: "High Street is the commercial and dining spine of the Goulburn Valley. The Eastbank Centre and Maude Street Mall anchor the strongest foot traffic in northern Victoria. A 100km regional catchment supplements the local residential base. Competition is real — established operators have built loyalty — but the market quality justifies the premium over outer suburbs." },
              { rank: 2, name: 'Shepp East', slug: 'shepp-east', verdict: sVerdict('shepp-east'), score: sScore('shepp-east'), rentFrom: '$2,000/mo', body: "GV Health hospital precinct with more than 2,000 staff operating across seven days. Shift-work demand pattern creates morning, lunchtime, and evening windows that standard commercial concepts miss. Extended-hours cafe and food operators find a year-round, professional customer base with virtually no seasonal variation." },
              { rank: 3, name: 'Kialla', slug: 'kialla', verdict: sVerdict('kialla'), score: sScore('kialla'), rentFrom: '$1,500/mo', body: "The fastest-growing residential corridor in Shepparton with a large, underserved family catchment. Quality cafe and casual dining is genuinely absent. First-mover operators who build community loyalty before the market fills capture a long-term position. Pure residential demand — no seasonality complexity." },
              { rank: 4, name: 'Mooroopna', slug: 'mooroopna', verdict: sVerdict('mooroopna'), score: sScore('mooroopna'), rentFrom: '$1,200/mo', body: "Residential suburb across the Goulburn River from the CBD with a multicultural community character. Low competition, low rents, and a genuine community need for quality local hospitality. Operators who embed in the community build durable local loyalty." },
              { rank: 5, name: 'Shepparton North', slug: 'shepparton-north', verdict: sVerdict('shepparton-north'), score: sScore('shepparton-north'), rentFrom: '$1,200/mo', body: "Industrial estate fringe with blue-collar workforce demand from SPC Ardmona, Murray Goulburn, and surrounding operators. Reliable weekday breakfast and lunch trade. Low rents and low competition for operators who serve the working demographic correctly." },
              { rank: 6, name: 'Nagambie', slug: 'nagambie', verdict: sVerdict('nagambie'), score: sScore('nagambie'), rentFrom: '$1,000/mo', body: "Wine region tourism destination with Tahbilk and Mitchelton wineries and Lake Nagambie water sports. Genuine Melbourne day-tripper demand in spring and summer. Seasonal revenue profile — winter is materially softer. Build local community trade to underpin the quiet months." },
              { rank: 7, name: 'Grahamvale', slug: 'grahamvale', verdict: sVerdict('grahamvale'), score: sScore('grahamvale'), rentFrom: '$700/mo', body: "Peri-urban semi-rural suburb on the eastern fringe. Very low rents and very low competition in a dispersed catchment. Suits community-oriented artisan or farm-adjacent concepts at modest revenue expectations. Not a growth hospitality market." },
              { rank: 8, name: 'Tatura', slug: 'tatura', verdict: sVerdict('tatura'), score: sScore('tatura'), rentFrom: '$700/mo', body: "Small agricultural service town 20km west serving the dairy and mixed-farming community. Genuine but modest demand ceiling. Very low rents make essential-service concepts viable. Rewards community-focused operators who become part of the town's commercial fabric." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/shepparton/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #14532D 0%, #15803D 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Shepparton address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Shepparton address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#DCFCE7', color: '#14532D', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Shepparton address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Shepparton Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="shepparton" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Shepparton Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Shepparton CBD vs Shepp East', body: "Both are strong markets but serve different operators. The CBD is the regional retail and dining destination — highest foot traffic, highest rents, highest competition. Shepp East is the hospital precinct specialist market — more predictable demand, lower competition, but a narrower customer profile. The CBD suits operators who want volume and regional catchment. Shepp East suits operators who want to serve a professional, shift-working customer base with extended hours and lower competitive noise." },
              { title: 'Kialla vs Mooroopna', body: "Both are residential markets with low competition and genuine community demand. Kialla has higher residential growth momentum and a larger current population — the first-mover opportunity is larger but the commercial infrastructure is still maturing. Mooroopna is more established, with a stable residential base and a multicultural community character that creates demand for inclusive hospitality. Kialla for operators who want to ride growth; Mooroopna for operators who want a stable community business now." },
              { title: 'Nagambie vs CBD for restaurants', body: "Nagambie and the Shepparton CBD suit completely different restaurant concepts. The CBD serves a broad regional catchment for casual dining and everyday restaurant trade — reliable year-round demand but generic. Nagambie serves a quality-seeking Melbourne visitor and local wine region market — higher average spend, stronger food culture expectations, but seasonal revenue and a smaller permanent population. Nagambie rewards operators who can execute genuine wine region quality; the CBD rewards operators who serve the Goulburn Valley community reliably." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Risk Zones — What Every Shepparton Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Shepparton business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Nagambie seasonality trap', why: "Nagambie has genuine tourism appeal but a real winter revenue gap. Operators who model only the spring and summer wine tourism peak will face cash flow pressure from June to August. The Nagambie model that works treats local community trade as the financial foundation and tourism as seasonal upside — not the other way around. Build the local loyal base through winter; capture the tourist wave in October to February." },
              { name: 'Projecting Melbourne metrics onto Shepparton', why: "Shepparton is a 65,000-person regional city. Revenue ceilings are materially lower than Melbourne or Geelong. Operators who transplant a Melbourne business model — scale projections, rent expectations, or customer density assumptions — will be consistently disappointed. The economics work at the right calibration for the market. Operators who build a correctly sized concept for Shepparton can generate sustainable income; those who expect city-scale returns will fail." },
              { name: 'Missing the hospital demand pattern', why: "The Shepp East hospital opportunity is consistently underserved because operators apply standard commercial hours to a 24/7 institutional demand environment. GV Health staff work before 7am and after 8pm. Operators who open at 8am and close at 3pm miss the shift changes that generate the most demand. Extended hours, grab-and-go formats, and genuine quality calibrated to a working professional are the keys to the hospital market." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Shepparton Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <SheppartonFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Shepparton Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Shepparton location?"
        subtitle="Run a free analysis on any Shepparton address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/shepparton/shepparton-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Shepparton CBD Analysis →</Link>
          <Link href="/analyse/shepparton/kialla" style={{ color: C.brand, textDecoration: 'none' }}>Kialla Analysis →</Link>
          <Link href="/analyse/shepparton/nagambie" style={{ color: C.brand, textDecoration: 'none' }}>Nagambie Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
