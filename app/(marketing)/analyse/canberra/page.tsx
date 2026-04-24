// app/(marketing)/analyse/canberra/page.tsx
// Canberra city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getCanberraSuburb, getCanberraSuburbs } from '@/lib/analyse-data/canberra'

function cScore(slug: string): number {
  return getCanberraSuburb(slug)?.compositeScore ?? 0
}
function cVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getCanberraSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Canberra — 2026 Location Guide',
  description:
    'Canberra business location guide 2026. 19 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Canberra suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/canberra' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Canberra — 2026 Location Guide',
    description: '19 Canberra suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/canberra',
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs to Open a Business in Canberra 2026',
  description: 'Data-driven guide to Canberra commercial location decisions — 19 suburbs scored across rent, competition, foot traffic and demand.',
  author: { '@type': 'Organization', name: 'Locatalyze' },
  publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
  url: 'https://locatalyze.com/analyse/canberra',
  datePublished: '2026-01-01',
  dateModified: '2026-04-01',
}

const COMPARISON_ROWS = [
  { name: 'Braddon', score: cScore('braddon'), verdict: cVerdict('braddon'), rent: '$380–$520/m²', footTraffic: 'Very High', bestFor: 'Specialty café, quality casual dining, bar concepts' },
  { name: 'Manuka', score: cScore('manuka'), verdict: cVerdict('manuka'), rent: '$380–$540/m²', footTraffic: 'Very High', bestFor: 'Premium dining, specialty café, boutique retail' },
  { name: 'Kingston', score: cScore('kingston'), verdict: cVerdict('kingston'), rent: '$420–$600/m²', footTraffic: 'High (seasonal)', bestFor: 'Restaurants, waterfront dining, premium retail' },
  { name: 'Civic', score: cScore('civic'), verdict: cVerdict('civic'), rent: '$380–$550/m²', footTraffic: 'Very High', bestFor: 'High-volume hospitality, quick-service, retail' },
  { name: 'Gungahlin', score: cScore('gungahlin'), verdict: cVerdict('gungahlin'), rent: '$220–$320/m²', footTraffic: 'High (growing)', bestFor: 'Independent café, casual dining, convenience retail' },
  { name: 'Dickson', score: cScore('dickson'), verdict: cVerdict('dickson'), rent: '$280–$380/m²', footTraffic: 'Medium-High', bestFor: 'Dining, specialty café, multicultural food concepts' },
  { name: 'Belconnen', score: cScore('belconnen'), verdict: cVerdict('belconnen'), rent: '$220–$340/m²', footTraffic: 'High', bestFor: 'Quick-service, casual dining, student-facing concepts' },
  { name: 'Fyshwick', score: cScore('fyshwick'), verdict: cVerdict('fyshwick'), rent: '$160–$260/m²', footTraffic: 'Medium', bestFor: 'Roastery, brewery, food production with retail' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium Inner Precincts — High Reward, High Entry',
    description: "Canberra's best-performing commercial strips. Public-service demographics and strong spending power, but rent and competition levels demand an operator with a clear and differentiated concept.",
    suburbs: [
      { name: 'Braddon', slug: 'braddon', description: "The ACT's café and dining epicentre. Weekday coffee and lunch trade is the most reliable in Canberra — driven by office workers within a 500m radius.", score: cScore('braddon'), verdict: cVerdict('braddon'), rentRange: '$380–$520/m²/yr' },
      { name: 'Manuka', slug: 'manuka', description: "Village strip for the inner south's highest-income residents. Politicians, diplomats and senior executives form a daytime base that consistently supports premium pricing.", score: cScore('manuka'), verdict: cVerdict('manuka'), rentRange: '$380–$540/m²/yr' },
      { name: 'Kingston', slug: 'kingston', description: 'Foreshore precinct for premium dining. Weekend trade is ACT-leading; weekday revenue requires deliberate positioning around the local apartment catchment.', score: cScore('kingston'), verdict: cVerdict('kingston'), rentRange: '$420–$600/m²/yr' },
      { name: 'Civic', slug: 'civic', description: "Canberra's CBD core. Highest absolute foot traffic in ACT. Works for high-volume concepts; differentiated independents must stake a clear position against established incumbents.", score: cScore('civic'), verdict: cVerdict('civic'), rentRange: '$380–$550/m²/yr' },
    ],
  },
  {
    title: 'Growing Districts — Best Risk/Return',
    description: 'Suburbs where demand is proven but rents have not caught up. These precincts offer meaningful first-mover advantage for operators entering in 2026.',
    suburbs: [
      { name: 'Gungahlin', slug: 'gungahlin', description: "ACT's fastest-growing district. Independent café and dining supply is chronically below resident demand. Light rail access makes the catchment city-wide, not just local.", score: cScore('gungahlin'), verdict: cVerdict('gungahlin'), rentRange: '$220–$320/m²/yr' },
      { name: 'Dickson', slug: 'dickson', description: 'Inner-north multicultural precinct with proven local loyalty. Lower rent than Braddon for a comparable inner-city position and a less saturated competitive environment.', score: cScore('dickson'), verdict: cVerdict('dickson'), rentRange: '$280–$380/m²/yr' },
      { name: 'Lyneham', slug: 'lyneham', description: "Quiet inner-north village strip serving Turner, O'Connor and Watson. Very low competition for the size of the professional catchment — genuine first-mover opportunity.", score: cScore('lyneham'), verdict: cVerdict('lyneham'), rentRange: '$240–$320/m²/yr' },
      { name: 'Griffith', slug: 'griffith', description: 'Inner-south residential with low competition and a high-income loyal local base. The Giles Street strip is underserved relative to the spending capacity of the surrounding streets.', score: cScore('griffith'), verdict: cVerdict('griffith'), rentRange: '$280–$400/m²/yr' },
    ],
  },
  {
    title: 'Town Centres — Captive Catchment, Lower Prestige',
    description: 'Canberra\'s planned town centres offer scale and captive trade but favour operators who can compete alongside established mall tenants and franchise chains.',
    suburbs: [
      { name: 'Belconnen', slug: 'belconnen', description: 'Second-largest town centre by retail floor space. University of Canberra proximity adds 12,000+ students. Westfield anchor creates consistent traffic for surrounding independents.', score: cScore('belconnen'), verdict: cVerdict('belconnen'), rentRange: '$220–$340/m²/yr' },
      { name: 'Woden', slug: 'woden', description: 'Southern town centre with large employed population (ACT Health, DoD) providing weekday lunch trade. Independents have genuine space given the franchise-heavy existing mix.', score: cScore('woden'), verdict: cVerdict('woden'), rentRange: '$230–$350/m²/yr' },
      { name: 'Tuggeranong', slug: 'tuggeranong', description: 'Largest southern catchment, lowest rents. Best suited to operators with a clearly differentiated concept — the Hyperdome anchors chains who are well-established.', score: cScore('tuggeranong'), verdict: cVerdict('tuggeranong'), rentRange: '$180–$280/m²/yr' },
      { name: 'Phillip', slug: 'phillip', description: "Woden Valley commercial hub. Underserved by quality independents in the Melrose Drive corridor. Works well for operators targeting the 9-to-5 weekday lunch market.", score: cScore('phillip'), verdict: cVerdict('phillip'), rentRange: '$220–$320/m²/yr' },
    ],
  },
  {
    title: 'Emerging & Niche — Early-Mover and Specialist Opportunity',
    description: 'Locations suited to specific formats — artisan production, specialist dining, and outer-growth suburb first-movers with low rent and low competition.',
    suburbs: [
      { name: 'Fyshwick', slug: 'fyshwick', description: 'Industrial precinct with very low rent and a growing artisan food scene. Perfect for roasteries, breweries and food production with a direct-to-consumer retail component.', score: cScore('fyshwick'), verdict: cVerdict('fyshwick'), rentRange: '$160–$260/m²/yr' },
      { name: 'Deakin', slug: 'deakin', description: 'Embassy and diplomatic strip with a high-income but low-volume daytime clientele. Best for premium café or specialty deli operators who want a narrow, loyal and high-spend customer base.', score: cScore('deakin'), verdict: cVerdict('deakin'), rentRange: '$280–$400/m²/yr' },
      { name: 'Bruce', slug: 'bruce', description: 'University of Canberra and Stadium precinct. Strong event-day revenue, significant semester-break seasonality. Best suited to operators who build a dual campus-and-local community base.', score: cScore('bruce'), verdict: cVerdict('bruce'), rentRange: '$200–$300/m²/yr' },
      { name: 'Casey', slug: 'casey', description: 'Outer Gungahlin with rapid residential growth and almost no independent operators. First-mover advantage is real but dependent on population growth continuing on trajectory.', score: cScore('casey'), verdict: cVerdict('casey'), rentRange: '$160–$240/m²/yr' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a café in Canberra?',
    answer: "Braddon is Canberra's benchmark café market — the ACT's highest concentration of independent operators, reliable weekday morning and lunch trade from the surrounding office district, and a customer demographic with among the highest coffee spend per visit of any Australian city. The constraint is competition: it is well above 8/10 in the café category. The better risk-adjusted opportunity for 2026 is Gungahlin, where a Melbourne-calibre café demographic is living in a suburb where quality independent supply is chronically below demand at rents 40% below Braddon.",
  },
  {
    question: 'How do Canberra commercial rents compare to Sydney and Melbourne?',
    answer: "Canberra rents in premium precincts ($380–$600/m²/year) sit meaningfully below Sydney's inner-ring equivalents ($600–$900/m²/year in Newtown, Surry Hills, or Fitzroy equivalents) and below Melbourne inner-north strips. The structural advantage is Canberra's income base: median household income in the ACT is the highest of any Australian state or territory, meaning the revenue capacity per customer is higher than in lower-income markets, even at equivalent rents.",
  },
  {
    question: 'Is Canberra a good market for restaurants?',
    answer: "Canberra is genuinely underrated for restaurant operators. The public-service demographic creates a mid-week dinner trading pattern unusual for Australian capitals — Wednesday and Thursday evenings often trade like Friday in comparable Sydney or Melbourne precincts. Kingston Foreshore and Manuka are the two premier restaurant precincts. Braddon suits quality-casual concepts. The failure mode is operators who run Sydney or Melbourne margin models and discover that Canberra's lower tourist exposure means there is no Saturday-night tourism spike to subsidise weaker mid-week trading.",
  },
  {
    question: "How does Canberra's public service economy affect retail businesses?",
    answer: "The public-service base creates commercial stability that retail operators in other cities don't have. Canberra's unemployment rate consistently runs 1–2% below national average, income is recession-resistant, and household spending is less affected by interest rate cycles than private-sector dominated cities like Sydney. The downside is trading patterns: Canberra retail is heavily weighted toward weekday and lunchtime — weekend trade is lower than in comparable Sydney or Melbourne inner suburbs, and evening retail is limited outside of the Civic centre.",
  },
  {
    question: 'What happens to Canberra businesses during sitting weeks?',
    answer: "Parliamentary sitting periods (February–May, August–November approximately) create visible revenue uplift for operators in Civic, Braddon, Kingston, and Barton. Visitors including lobbyists, journalists, consultants and interstate attendees add to the baseline. The non-sitting winter period is real but often overstated — Canberra's resident-driven economy means the floor remains higher than pure tourism markets. Operators in Manuka and Dickson, which serve predominantly local populations, are essentially unaffected by the parliamentary calendar.",
  },
  {
    question: 'Which Canberra suburbs are best for retail businesses?',
    answer: "The ACT's highest retail spending power is concentrated in Manuka, Griffith, Deakin and Forrest — the inner south's high-income corridor. For footfall-dependent retail, Civic (Canberra Centre) and Belconnen (Westfield) deliver the highest absolute traffic volumes. The emerging opportunity for independent retail is Braddon's Lonsdale and Mort Street strip, where a creative retail demographic is growing alongside the hospitality scene.",
  },
  {
    question: 'Is Gungahlin worth opening a business in?',
    answer: "Gungahlin is the single most under-supplied commercial precinct relative to its demographic size in the ACT. The district's population grew 18% in five years to 2024 and is now over 90,000 residents. The light rail connection to Civic (completed 2019) permanently extended the catchment to the whole city. Rents at $220–$320/m²/year are the lowest of any major Canberra town centre. For a quality independent café or casual dining operator, Gungahlin represents a first-mover window that will close as rents adjust upward to reflect the demographic that already exists.",
  },
]

function CanberraFactorDirectory() {
  const suburbs = getCanberraSuburbs()
    .slice()
    .sort((a, b) => b.compositeScore - a.compositeScore)

  return (
    <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
          Full Factor Breakdown — All 19 Suburbs
        </h2>
        <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>
          Every suburb scored across demand strength, rent pressure, competition density, seasonality risk, and tourism dependency. Scores are engine-computed — no manual adjustments.
        </p>
        <div style={{ display: 'grid', gap: '32px' }}>
          {suburbs.map((suburb) => (
            <div key={suburb.slug} style={{ backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                    <p style={{ fontSize: '13px', color: C.muted, margin: '3px 0 0' }}>{suburb.why[0]}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: C.brand, lineHeight: 1 }}>{suburb.compositeScore}</div>
                    <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>/ 100</div>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '6px',
                    backgroundColor: suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg,
                    color: suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red,
                    border: `1px solid ${suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr}`,
                  }}>
                    {suburb.verdict}
                  </span>
                  <Link href={`/analyse/canberra/${suburb.slug}`} style={{ fontSize: '13px', fontWeight: 600, color: C.brand, textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', border: `1px solid ${C.brand}` }}>
                    Full analysis →
                  </Link>
                </div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <FactorGrid factors={suburb.locationFactors} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CanberraPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Canberra"
        citySlug="canberra"
        tagline="Australia's most stable commercial market — and its most misread. Canberra's public-service economy creates predictable, high-income trade patterns that reward operators who understand the city's geography and reject those who don't."
        statChips={[
          { text: '19 suburbs scored — inner precincts to outer growth districts' },
          { text: "Braddon: ACT's benchmark café and dining precinct" },
          { text: 'Highest median household income of any Australian capital city' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, ACT Government Planning Data Q1 2026, CBRE Canberra, and Locatalyze proprietary foot traffic analysis.
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
              { value: '$137K', label: "Highest median household income of any Australian capital — ACT 2024", source: 'ABS 2024' },
              { value: '3.1%', label: 'Unemployment rate — consistently below national average, supports stable consumer spending', source: 'ABS Labour Force Q1 2026' },
              { value: '90K+', label: "Residents in Gungahlin — ACT's fastest-growing district and most under-served café market", source: 'ACT Planning 2025' },
              { value: '40%', label: 'Lower commercial rents in Gungahlin vs Braddon for comparable formats', source: 'CBRE Canberra Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Canberra Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Canberra is the most stable commercial market in Australia and, paradoxically, the most misread. Its reputation as a sleepy government town obscures what is actually one of the highest per-capita consumer spending markets in the country. The ACT's median household income of $137,000 exceeds every other Australian capital by a significant margin, and the public-service employment base means that income is unusually recession-resistant. Operators who understand this find a market that rewards execution quality in a way that lower-income cities simply cannot.",
              "The city's planned geography is the critical variable that operators from Sydney or Melbourne consistently get wrong. Canberra is not one market — it is a collection of town centres with distinct demographics, trading patterns, and competitive environments. Braddon and Manuka are the inner-city benchmarks, but they are not interchangeable. Braddon serves a weekday office worker demographic with strong morning and lunch peaks. Manuka serves a residential affluent demographic with a more distributed trading pattern and a distinct evening character.",
              "The growth story for 2026 and beyond is concentrated in two directions: Gungahlin in the north, which is chronically under-served by independent operators despite its now-substantial population and light rail connection, and the gentrifying inner strips of Dickson and Lyneham, which are delivering Braddon-quality demographics at meaningfully lower rents. Operators entering these markets in 2026 are locking in positions that will reprice significantly as the demographic maturity catches up.",
              "The failure mode unique to Canberra is misunderstanding the public-service trading calendar. Sitting weeks bring visible revenue uplift for operators near the Parliamentary Triangle. Semester breaks affect Bruce and Belconnen. Non-sitting winter periods create softness in the precinct rather than the city as a whole. Operators who model this correctly find Canberra's seasonal profile is actually less volatile than coastal markets — but those who don't notice the pattern until they've signed a lease face an unpleasant first winter.",
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
              { type: 'Cafés & Specialty Coffee', insight: "Braddon is the benchmark — highest foot traffic, most reliable weekday revenue. Gungahlin is the opportunity — identical demographic profile at 40% lower rent with almost no quality competition. Dickson is the underrated mid-tier: strong local loyalty, proven repeat trade, meaningfully less saturated than Braddon.", best: ['Braddon', 'Gungahlin', 'Dickson'] },
              { type: 'Full-Service Restaurants', insight: "Kingston Foreshore is Canberra's premier restaurant precinct — the ACT's highest average dinner spend per visit. Manuka's village strip delivers a professional and diplomatic clientele for quality casual dining. Braddon suits a quality-casual format capitalising on the established hospitality-friendly street culture.", best: ['Kingston', 'Manuka', 'Braddon'] },
              { type: 'Retail (Independent)', insight: "Manuka and Griffith serve the ACT's highest-income residential catchments for independent retail. Braddon's creative retail scene is growing alongside its hospitality strip. Civic (Canberra Centre precinct) delivers the highest absolute foot traffic for volume-dependent retail formats.", best: ['Manuka', 'Braddon', 'Civic'] },
              { type: 'Fitness & Wellness', insight: "Canberra's wellness spend is concentrated in the inner south — Manuka, Griffith and Deakin all have household income profiles that sustain boutique fitness and allied health. Braddon is growing as a wellness destination. Belconnen captures the university-adjacent wellness demographic at lower rent.", best: ['Manuka', 'Braddon', 'Belconnen'] },
              { type: 'Professional Services', insight: "Civic and Barton serve the primary government professional services market. Manuka and Deakin capture the diplomatic and senior executive clientele. Dickson serves the mid-tier professional market in the inner north.", best: ['Civic', 'Manuka', 'Dickson'] },
              { type: 'Food Production & Artisan', insight: "Fyshwick is the only viable market for large-format food production with a retail or cellar-door component — very low rent, no residential complaints, growing artisan food precinct with weekend market traffic. Casey suits satellite production for the northern growth corridor.", best: ['Fyshwick', 'Casey', 'Bruce'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Canberra Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Braddon', slug: 'braddon', verdict: cVerdict('braddon'), score: cScore('braddon'), rentFrom: '$380/m²/yr', body: "The ACT's proven café and dining precinct. Weekday foot traffic from the surrounding office district is the most reliable in Canberra. Competition is real — above 8/10 in the café category — which means a differentiated concept is non-negotiable, but the customer base consistently rewards operators who earn loyalty." },
              { rank: 2, name: 'Manuka', slug: 'manuka', verdict: cVerdict('manuka'), score: cScore('manuka'), rentFrom: '$380/m²/yr', body: "Village strip for Canberra's highest-income residential catchment. Politicians, diplomats and senior executives form a daytime base that is uniquely resistant to economic cycles. The 4% long-term vacancy rate signals an operator community that has found the economics work — the supply constraint is structural." },
              { rank: 3, name: 'Gungahlin', slug: 'gungahlin', verdict: cVerdict('gungahlin'), score: cScore('gungahlin'), rentFrom: '$220/m²/yr', body: "The best risk-adjusted opportunity in the ACT in 2026. A 90,000-person district chronically under-served by quality independent operators. Light rail access, family demographics with strong brunch and family-dining demand, and rents 40% below the inner-city benchmark. The window for below-market entry is real but time-limited." },
              { rank: 4, name: 'Kingston', slug: 'kingston', verdict: cVerdict('kingston'), score: cScore('kingston'), rentFrom: '$420/m²/yr', body: "Kingston Foreshore is where Canberra's restaurant industry concentrates. Weekend spend per visit is the highest in the ACT. Weekday economics require deliberate positioning — the local apartment catchment is your floor, not your ceiling. Tourism from the gallery and parliamentary precincts supports premium positioning." },
              { rank: 5, name: 'Dickson', slug: 'dickson', verdict: cVerdict('dickson'), score: cScore('dickson'), rentFrom: '$280/m²/yr', body: "Inner-north multicultural precinct with proven local loyalty and an established Asian dining strip. Works well for complementary food concepts that differentiate from the existing mix. Rents meaningfully below Braddon for a similar inner-city position and a less saturated competitive landscape." },
              { rank: 6, name: 'Lyneham', slug: 'lyneham', verdict: cVerdict('lyneham'), score: cScore('lyneham'), rentFrom: '$240/m²/yr', body: "Quiet village strip serving Turner, O'Connor and Watson with under-served café demand. Very low competition for the professional quality of the catchment. ANU proximity generates researchers and academics seeking an alternative to the Civic student crowd. Genuine first-mover opportunity at modest rent." },
              { rank: 7, name: 'Griffith', slug: 'griffith', verdict: cVerdict('griffith'), score: cScore('griffith'), rentFrom: '$280/m²/yr', body: "Inner-south suburb with low commercial vacancy and an affluent loyal local base. The Giles Street strip services a 15,000-resident catchment with limited competition. Embassy Row and Parliamentary Triangle proximity supports a professional lunchtime trade that is consistent and predictable." },
              { rank: 8, name: 'Civic', slug: 'civic', verdict: cVerdict('civic'), score: cScore('civic'), rentFrom: '$380/m²/yr', body: "Highest absolute foot traffic in the ACT via the Canberra Centre anchor. Government workers provide the stable weekday floor; ANU proximity extends trade into evenings. Competition is elevated but supply gaps remain in quality dinner-format operators — the quick-service and café categories are well-served." },
              { rank: 9, name: 'Belconnen', slug: 'belconnen', verdict: cVerdict('belconnen'), score: cScore('belconnen'), rentFrom: '$220/m²/yr', body: "Northern town centre with a large captive catchment and University of Canberra adding 12,000+ students. Untapped demand for specialty coffee and quality-casual dining. Operators who differentiate from the existing Westfield franchise mix find a loyal and underserved customer base at competitive rents." },
              { rank: 10, name: 'Deakin', slug: 'deakin', verdict: cVerdict('deakin'), score: cScore('deakin'), rentFrom: '$280/m²/yr', body: "Embassy and diplomatic strip with a narrow but high-spend daytime clientele. Competition is very low despite the affluence of the catchment. Works best for premium café, specialty deli, or allied health operators who want manageable volume with above-average spend per visit." },
              { rank: 11, name: 'Bruce', slug: 'bruce', verdict: cVerdict('bruce'), score: cScore('bruce'), rentFrom: '$200/m²/yr', body: "University of Canberra and Stadium precinct at the ACT's most affordable inner-north commercial rents. Event-day revenue spikes are meaningful. Semester-break seasonality requires advance planning — operators who build a dual campus-and-community customer base overcome the volatility." },
              { rank: 12, name: 'Woden', slug: 'woden', verdict: cVerdict('woden'), score: cScore('woden'), rentFrom: '$230/m²/yr', body: "Southern town centre with reliable weekday lunch trade from ACT Health and DoD employees. Limited independent dining in the Westfield corridor creates genuine supply gaps. Weekend trade is lower than inner-north precincts — a weekday-first revenue model is essential for this location." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/canberra/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Canberra address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Canberra address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FEE2E2', color: '#7F1D1D', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Canberra address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Canberra Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>19 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="canberra" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Canberra Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Braddon vs Gungahlin', body: "Braddon is the proven market — established foot traffic, national operator track record, and a precinct character that attracts Canberra's highest café spend per visit. Gungahlin is the growth market — same demographic trajectory, a 90,000-person catchment with light rail access, and rents 40% lower with almost no quality competition. For operators with a strong concept who can invest in building a loyal base, Gungahlin offers better long-term unit economics. For those who need established foot traffic from day one, Braddon's depth is more reliable." },
              { title: 'Manuka vs Kingston', body: "Manuka is residential-driven — the village strip serves a high-income local catchment with consistent year-round trading. Kingston is destination-driven — the Foreshore precinct captures Canberra's highest dinner spend, but weekend-peak economics need to be supplemented with a deliberate weekday strategy. Manuka suits operators who want predictability. Kingston suits operators who can execute a premium offer and build the reputation to draw the whole city on weekends." },
              { title: 'Dickson vs Lyneham', body: "Both are inner-north second-tier options relative to Braddon. Dickson has established foot traffic and a multicultural dining strip that proves the precinct works for food operators — it is less of a risk but also less of a first-mover opportunity. Lyneham has very low competition and a professional catchment from surrounding suburbs that is genuinely under-served. The risk in Lyneham is that building a customer base from scratch takes longer than inheriting Dickson's established traffic patterns." },
              { title: 'Civic vs Town Centres (Belconnen/Woden)', body: "Civic delivers the highest absolute foot traffic in the ACT but at the highest rent and the strongest competition. Belconnen and Woden deliver lower absolute traffic but also lower rent, less saturation, and captive catchments that are genuinely loyal to local operators who establish themselves. For most independent operators, the town centres deliver better unit economics than Civic despite the lower foot traffic ceiling." },
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
              { name: 'Tuggeranong secondary strips', why: "The Hyperdome dominates Tuggeranong's consumer attention for most categories. Independent operators on the secondary strips outside the centre find it difficult to attract the volume the catchment's size would suggest. The Hyperdome anchor chains capture most of the walkable foot traffic, leaving secondary positions dependent on destination visits rather than passing trade." },
              { name: 'Barton (non-weekday formats)', why: "Barton's government and embassy catchment is almost entirely a weekday market. Operators who open with a format relying on weekend or evening trade find a precinct that essentially closes on Friday afternoon. The location works specifically for quick-service and café concepts designed around the weekday office pattern — any other format is structurally disadvantaged." },
              { name: 'Civic (mid-market, non-premium concepts)', why: "The mathematical problem in Civic is the same as any high-rent CBD: mid-market concepts need volume that the rent level doesn't support at mid-market pricing. Civic rewards premium positioning and high-volume formats. A mid-market café paying $500/m²/year in City Walk cannot generate the revenue per square metre that the rent requires — the economics are fundamentally broken before the business opens." },
            ].map((zone) => (
              <div key={zone.name} style={{ padding: '22px', backgroundColor: C.redBg, borderRadius: '10px', border: `1px solid ${C.redBdr}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>{zone.name}</h3>
                <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>{zone.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CanberraFactorDirectory />

      <section id="faq" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FAQSection faqs={FAQS} title="Canberra Location FAQ" />
        </div>
      </section>

      <CTASection title="Ready to analyse your Canberra address?" subtitle="Run a free analysis on any Canberra address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis." buttonText="Analyse your Canberra address free →" />

      <footer style={{ backgroundColor: C.n900, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            {['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Darwin'].map((city) => (
              <Link key={city} href={`/analyse/${city.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{city}</Link>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>© 2026 Locatalyze · Commercial location intelligence for Australian operators</p>
        </div>
      </footer>
    </div>
  )
}
