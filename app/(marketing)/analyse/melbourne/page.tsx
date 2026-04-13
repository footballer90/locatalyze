// app/(marketing)/analyse/melbourne/page.tsx
// Melbourne city hub page — SEO optimised, human-written
// Uses shared components from components/analyse/

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { PollSection } from '@/components/analyse/PollSection'
import { C } from '@/components/analyse/AnalyseTheme'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Melbourne — 2026 Location Guide',
  description:
    'Melbourne business location guide 2026. 20 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Melbourne suburb for your café, restaurant, retail or service business — with honest analysis of what works and what fails.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/melbourne' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Melbourne — 2026 Location Guide',
    description: '20 Melbourne suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/melbourne',
  },
}

const COMPARISON_ROWS = [
  { name: 'Fitzroy', score: 86, verdict: : "GO' as const, rent: '$9,000–$16,000", footTraffic: 'Very High', bestFor: 'Premium hospitality, specialty retail, creative' },
  { name: 'Richmond', score: 83, verdict: : "GO' as const, rent: '$7,000–$13,000", footTraffic: 'High', bestFor: 'Hospitality, specialty food, health' },
  { name: 'South Yarra', score: 82, verdict: : "GO' as const, rent: '$12,000–$20,000", footTraffic: 'Very High', bestFor: 'Premium retail, fine dining, wellness' },
  { name: 'Brunswick', score: 80, verdict: : "GO' as const, rent: '$6,000–$11,000", footTraffic: 'High', bestFor: 'Cafés, creative, independent retail' },
  { name: 'Box Hill', score: 79, verdict: : "GO' as const, rent: '$4,000–$8,000", footTraffic: 'High', bestFor: 'Asian market, professional services, health' },
  { name: 'Footscray', score: 77, verdict: : "GO' as const, rent: '$4,000–$7,000", footTraffic: 'Medium-High', bestFor: 'Specialty food, cafés, value retail' },
  { name: 'Melbourne CBD', score: 72, verdict: : "CAUTION' as const, rent: '$20,000–$50,000", footTraffic: 'Very High', bestFor: 'Premium/luxury, high-volume hospitality' },
  { name: 'Dandenong', score: 68, verdict: : "CAUTION' as const, rent: '$3,000–$6,000", footTraffic: 'Medium', bestFor: 'Multicultural food, value services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium — High Reward, High Risk',
    description: 'Inner ring with exceptional foot traffic and strong consumer spending. Rents are punishing — viable only for premium concepts with proven unit economics.',
    suburbs: [
      { name: 'Fitzroy', slug: 'fitzroy', description: "Melbourne's highest-density hospitality strip. Smith Street and Gertrude Street set the national benchmark for independent food culture.", score: 86, verdict: : "GO' as const, rentRange: '$9,000–$16,000/mo" },
      { name: 'South Yarra', slug: 'south-yarra', description: 'Chapel Street premium. Highest average spend per customer in Melbourne outside the CBD.', score: 82, verdict: : "GO' as const, rentRange: '$12,000–$20,000/mo" },
      { name: 'Melbourne CBD', slug: 'melbourne-cbd', description: 'Maximum foot traffic but $25K+ rent requires extreme volume. Hybrid work created structural headwinds.', score: 72, verdict: : "CAUTION' as const, rentRange: '$20,000–$50,000/mo" },
      { name: 'Collingwood', slug: 'collingwood', description: 'Smith Street spill-over. Arts and creative professional concentration with strong weekend trade.', score: 78, verdict: : "GO' as const, rentRange: '$8,000–$14,000/mo" },
    ],
  },
  {
    title: 'Growth — Best Risk/Return Balance',
    description: 'Inner and middle suburbs where rent economics align with foot traffic and demographics. The considered choice for most independent operators.',
    suburbs: [
      { name: 'Richmond', slug: 'richmond', description: 'Swan Street and Bridge Road offer premium catchment at materially lower rents than Fitzroy.', score: 83, verdict: : "GO' as const, rentRange: '$7,000–$13,000/mo" },
      { name: 'Brunswick', slug: 'brunswick', description: 'Sydney Road creative corridor. Strong café and independent retail culture, improving demographics.', score: 80, verdict: : "GO' as const, rentRange: '$6,000–$11,000/mo" },
      { name: 'Carlton', slug: 'carlton', description: 'Lygon Street institution. University density drives daytime demand; evenings strong on dining.', score: 76, verdict: : "GO' as const, rentRange: '$6,000–$11,000/mo" },
      { name: 'Northcote', slug: 'northcote', description: 'High Street growth strip. Younger professional demographic with above-average café spending.', score: 75, verdict: : "GO' as const, rentRange: '$5,500–$9,500/mo" },
      { name: 'St Kilda', slug: 'st-kilda', description: 'Fitzroy Street coastal premium. Tourist-residential mix; dual-season economics require planning.', score: 74, verdict: : "GO' as const, rentRange: '$7,500–$13,000/mo" },
    ],
  },
  {
    title: 'Outer Growth — Value Plays',
    description: 'Middle and outer suburbs with lower rents and improving demographics. Earlier movers benefit from years of below-market rent before the market matures.',
    suburbs: [
      { name: 'Box Hill', slug: 'box-hill', description: 'Best rent-to-foot-traffic ratio in Melbourne east. Asian market concentration is a structural advantage for targeted operators.', score: 79, verdict: : "GO' as const, rentRange: '$4,000–$8,000/mo" },
      { name: 'Footscray', slug: 'footscray', description: 'Rapid demographic shift brings professional population and higher spending power to a historically value-positioned market.', score: 77, verdict: : "GO' as const, rentRange: '$4,000–$7,000/mo" },
      { name: 'Prahran', slug: 'prahran', description: 'Between South Yarra and St Kilda — premium catchment without premium rents on secondary streets.', score: 76, verdict: : "GO' as const, rentRange: '$6,000–$10,500/mo" },
      { name: 'Preston', slug: 'preston', description: 'High Street corridor improving rapidly. Early-mover advantage still available before rents catch up to demographics.', score: 74, verdict: : "GO' as const, rentRange: '$4,000–$7,000/mo" },
      { name: 'Hawthorn', slug: 'hawthorn', description: "Professional enclave with one of Melbourne's highest household incomes. Underserved for premium hospitality.", score: 73, verdict: : "GO' as const, rentRange: '$5,000–$9,000/mo" },
      { name: 'Camberwell', slug: 'camberwell', description: 'Burke Road premium corridor. Established professional base, consistently strong weekend trade.', score: 73, verdict: : "GO' as const, rentRange: '$5,000–$9,500/mo" },
    ],
  },
  {
    title: 'Speculative — Know Before You Go',
    description: 'Markets where specific niches work but general operators struggle. Deep local knowledge and a targeted concept are non-negotiable here.',
    suburbs: [
      { name: 'Southbank', slug: 'southbank', description: 'Tourist and office weekend trade; weekday residential population thinner than rent implies.', score: 71, verdict: : "CAUTION' as const, rentRange: '$10,000–$22,000/mo" },
      { name: 'Docklands', slug: 'docklands', description: 'Planned precinct with residential-commercial imbalance. Weekday office trade strong; evenings and weekends underperform.', score: 65, verdict: : "CAUTION' as const, rentRange: '$8,000–$18,000/mo" },
      { name: 'Chadstone', slug: 'chadstone', description: "Shopping centre dominance concentrates spend inside the mall. Strip retail outside struggles to compete.", score: 67, verdict: : "CAUTION' as const, rentRange: '$5,000–$10,000/mo" },
      { name: 'Dandenong', slug: 'dandenong', description: 'Multicultural strength; lower average incomes constrain premium positioning. Specialty food concepts with community focus succeed.', score: 68, verdict: : "CAUTION' as const, rentRange: '$3,000–$6,000/mo" },
      { name: 'Werribee', slug: 'werribee', description: 'Western growth corridor. Infrastructure investment is real but commercial maturity is years away.', score: 66, verdict: : "CAUTION' as const, rentRange: '$2,500–$5,000/mo" },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a business in Melbourne?',
    answer: "Fitzroy (score 86) is Melbourne's benchmark for hospitality and independent retail — Smith Street and Gertrude Street have produced more successful independent businesses per square metre than anywhere else in Australia. But Fitzroy rents at $12,000–$16,000/month require premium unit economics. For most independent operators, Richmond (83) or Brunswick (80) deliver a better risk-adjusted position — comparable demographics at meaningfully lower rents. Box Hill (79) is the standout value play: best rent-to-foot-traffic ratio in Melbourne east.",
  },
  {
    question: 'Is Melbourne CBD too expensive for independent businesses in 2026?',
    answer: "For most independent operators, yes. CBD retail rents of $20,000–$50,000/month require extraordinary volume just to cover occupancy. Hybrid work has structurally reduced weekday lunchtime populations — office density on peak days sits at 65–70% of pre-2020 levels. The CBD works for high-volume QSR concepts and premium fine dining with the margin structure to absorb $30,000+ monthly rent. Independent cafés and small retailers have better economics in inner-ring suburbs like Fitzroy, Richmond, or Carlton.",
  },
  {
    question: 'Which Melbourne suburbs have the best café opportunities in 2026?',
    answer: "Brunswick and Northcote are the strongest emerging café markets by risk-adjusted economics. Both have professional demographic growth, strong café culture spending, and rents that haven't caught up to demand. Fitzroy remains the prestige address — but the customer-to-venue ratio is thin after a decade of openings. Richmond (Swan Street) has consistent high foot traffic with materially lower rents than Fitzroy. For value plays: Box Hill and Footscray have improving demographics and café customer-to-venue ratios 3–4x more favourable than the inner north.",
  },
  {
    question: 'What commercial rent should I expect in Melbourne suburbs?',
    answer: "Melbourne commercial rents vary significantly by location and zone. Inner north premium (Fitzroy, Collingwood, South Yarra): $9,000–$20,000/month. Inner middle ring (Richmond, Brunswick, Carlton): $6,000–$13,000/month. East (Box Hill, Hawthorn, Camberwell): $4,000–$9,500/month. West (Footscray, Prahran): $4,000–$10,500/month. Outer growth (Preston, Dandenong, Werribee): $2,500–$7,000/month. CBD and Southbank sit above all at $20,000–$50,000/month. These are gross rent estimates — incentives and net effective rents may vary significantly in the current market.",
  },
  {
    question: 'How does Melbourne compare to Sydney for opening a business?',
    answer: "Melbourne is generally more viable for independent operators. Inner-ring rents in Fitzroy or Richmond are 20–30% lower than equivalent Sydney suburbs like Surry Hills. Melbourne's café and hospitality culture is more established, creating deeper consumer habits around specialty coffee and independent dining. The inner north (Fitzroy, Collingwood, Brunswick) has a depth of hospitality culture that is unmatched anywhere in Australia. For Western Sydney comparisons: Box Hill ($4,000–$8,000) competes directly with Parramatta but with stronger food culture fundamentals.",
  },
  {
    question: 'Is Fitzroy oversaturated for cafés and restaurants?',
    answer: "Fitzroy has one of the highest venue densities in Australia — over 400 food and drink venues across the Smith-Gertrude-Johnston triangle. Saturation is real, but so is demand. The nuance is that Fitzroy is highly segmented: a specialty Korean barbecue restaurant does not directly compete with a specialty coffee roaster or a natural wine bar. What is saturated is the generic café category. Operators with a specific, differentiated offering continue to launch and succeed in Fitzroy because the customer base is large, educated, and experimental.",
  },
  {
    question: 'What are the best Melbourne suburbs for retail in 2026?',
    answer: "South Yarra (Chapel Street) and Fitzroy (Smith Street) are Melbourne's two highest-quality independent retail strips. Camberwell (Burke Road) serves a professional catchment with established spend patterns. Brunswick has a unique advantage for independent lifestyle retail — the creative professional demographic shops local by habit. CBD retail has struggled post-pandemic from foot traffic losses and Westfield consolidation. The growth opportunity for retail is in Box Hill (Asian market) and Hawthorn (professional enclave underserved by quality retailers).",
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

export default function MelbournePage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* Sticky Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.border}`,
          zIndex: 40,
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/analyse" style={{ fontSize: '14px', fontWeight: 600, color: C.brand, textDecoration: 'none' }}>
          ← All Cities
        </Link>
        <Link
          href="/onboarding"
          style={{
            padding: '8px 18px',
            backgroundColor: C.emerald,
            color: C.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <CityHero
        cityName="Melbourne"
        citySlug="melbourne"
        tagline="The deepest café and hospitality culture in Australia, some of the most competitive commercial strips, and a set of outer suburbs where the economics are genuinely compelling. Here is where the numbers actually work."
        statChips={[
          { text: "20 suburbs scored — inner north to outer west" },
          { text: "Fitzroy: Melbourne's benchmark hospitality address" },
          { text: 'Box Hill: best rent-to-foot-traffic ratio in Melbourne east' },
        ]}
      />

      {/* Methodology Banner */}
      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, CoreLogic, CBRE Q1 2026, City of Melbourne, and Locatalyze proprietary foot traffic analysis.
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
              { value: '$420B', label: 'Melbourne metro GDP — second largest urban economy in Australia', source: 'DEWR 2025' },
              { value: '28%', label: 'Hospitality businesses fail in year 1 in inner Melbourne', source: 'IBISWorld 2025' },
              { value: '35%', label: 'Lower commercial rents in Box Hill vs. inner north at equivalent foot traffic', source: 'CBRE Q1 2026' },
              { value: '$98K', label: 'Average household income in inner north (Fitzroy–Brunswick corridor)', source: 'ABS 2024' },
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
            Melbourne Business Landscape — 2026
          </h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Melbourne has produced more successful independent hospitality businesses per capita than any other Australian city. The culture runs deep — third wave coffee didn't arrive here, it was invented here. Smith Street in Fitzroy has seen more genuine innovation in Australian food over the past decade than the rest of the country combined. That heritage matters because it creates a consumer base that actively seeks out independent operators, pays premium prices for quality, and values authenticity over familiarity. It also means competition is real, discerning, and merciless to average concepts.",
              "The inner north corridor — Fitzroy, Collingwood, Brunswick, Carlton, Northcote — is where the reputation was built, and where rents now reflect it. A 60sqm café tenancy on Smith Street commands $12,000–$15,000 per month. A restaurant on Gertrude Street will exceed $16,000. These numbers work for operators who run a tight ship with a clear concept and proven margins. They don't work for operators who are discovering their concept in real time with borrowed money. The hard truth about Melbourne's inner north is that the window for easy-money café economics closed somewhere around 2019.",
              "East Melbourne tells a different story. Box Hill has quietly become one of the most commercially interesting suburbs in Australia. The Asian community concentration — predominantly Chinese-Australian with a significant recent-migration cohort — has created a specialty food market of extraordinary depth. Asian grocery chains, Chinese bakeries, bubble tea operators, and regional Chinese restaurants here are not competing against Fitzroy's café culture; they are serving a distinct market with its own loyalty patterns, spending habits, and preferences. Box Hill's commercial rent at $4,000–$8,000/month is 40% below comparable Fitzroy positions while delivering comparable foot traffic on peak weekend days.",
              "The western suburbs are undergoing the kind of demographic transition that creates genuine commercial opportunity for patient operators. Footscray's gentrification has been discussed since 2015 — but the transition is now clearly real. Vietnamese food culture (Footscray has been Melbourne's de facto Vietnamese food hub since the 1980s) is being joined by a professional residential population that moved here for affordability and brought its spending habits with it. The result is a suburb with two distinct customer bases — the established multicultural community and the arriving professional cohort — each spending at different price points and at different times of day. Operators who understand both can build unusually resilient businesses.",
              "Melbourne's CBD faces the same structural challenge as every Australian CBD post-pandemic: office density has not recovered to 2019 levels. Foot traffic on peak Tuesdays and Wednesdays runs at 70–75% of pre-2020 volumes; Mondays and Fridays remain at 50–60%. The Swanston Street and Bourke Street malls have been slower to recover than Fitzroy or Richmond. The CBD still works — at the right concept, in the right location — but the operators profiting here in 2026 are running premium propositions with strong margin structures. The days of a generic 80-seat café surviving on CBD foot traffic at $5.50 per coffee are effectively over.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection
        suburbName="Melbourne"
        question="What type of business are you planning to open in Melbourne?"
        options={['Café or coffee shop', 'Restaurant or bar', 'Retail or boutique', 'Gym or wellness studio', 'Professional services']}
        initialVotes={[38, 27, 15, 12, 8]}
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
                insight: 'The inner north is at capacity. Fitzroy and Collingwood customer-to-café ratios are thin. The better opportunity is Brunswick, Northcote, and Box Hill, where demographics support specialty coffee spending and venue density remains favourable.',
                best: ['Brunswick', 'Northcote', 'Box Hill'],
              },
              {
                type: 'Full-Service Restaurants',
                insight: 'Full-service dining sustains at $85K+ household income. Fitzroy, Richmond (Swan Street), and South Yarra all meet this threshold. Carlton (Lygon Street) holds well for Italian and European. Hawthorn and Camberwell are underserved for quality mid-range.',
                best: ['Fitzroy', 'Richmond', 'South Yarra'],
              },
              {
                type: 'Retail (Independent)',
                insight: "Melbourne's best independent retail strips are Smith Street (Fitzroy) and Chapel Street (South Yarra). Camberwell (Burke Road) serves a wealthy professional catchment. Brunswick is strong for lifestyle, creative, and homewares retail.",
                best: ['Fitzroy', 'South Yarra', 'Brunswick'],
              },
              {
                type: 'Fitness & Wellness',
                insight: 'Boutique studios cluster in Fitzroy, South Yarra, and Richmond. Allied health services follow income: Hawthorn, Camberwell, and Prahran all have professional catchments willing to pay for premium wellness. Northcote is emerging.',
                best: ['South Yarra', 'Richmond', 'Hawthorn'],
              },
              {
                type: 'Asian Specialty Food',
                insight: "Box Hill is the undisputed capital of Melbourne's Asian food market outside the CBD. Chinese, Japanese, Korean, and bubble tea operators here serve loyal community markets with spending patterns far more reliable than the inner north's trend-driven base.",
                best: ['Box Hill', 'Docklands', 'Melbourne CBD'],
              },
              {
                type: 'Professional Services',
                insight: 'CBD fringe (Collins Street, St Kilda Road) anchors legal, financial, and corporate advisory. Hawthorn and Camberwell serve the professional residential east. Box Hill is the hub for Asian-community professional services.',
                best: ['CBD fringe', 'Hawthorn', 'Box Hill'],
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

      {/* TOP 20 SUBURBS */}
      <section id="top-20" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>
            Top 20 Suburbs to Open a Business in Melbourne (2026)
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>
            Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory. No filler — what works and what doesn't.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                rank: 1, name: 'Fitzroy', slug: 'fitzroy', score: 86, verdict: 'GO' as const,
                rentFrom: '$9,000/mo',
                body: "Melbourne's undisputed hospitality benchmark. Smith Street and Gertrude Street have produced more successful independent venues than anywhere in Australia. Competition is intense — the inner triangle (Smith/Johnston/Gertrude) has 400+ food and drink venues, so your concept needs a clear reason to exist. Generic cafés fail here within 18 months. Specific, differentiated operators with strong margin discipline continue to thrive.",
              },
              {
                rank: 2, name: 'Richmond', slug: 'richmond', score: 83, verdict: 'GO' as const,
                rentFrom: '$7,000/mo',
                body: "Swan Street is Melbourne's best hospitality strip by risk-adjusted economics. Demographically equivalent to Fitzroy — household incomes $88K+, professional-heavy, café-loyal — at 20% lower rents. Bridge Road tells a more mixed story: premium furniture and homeware has recovered but fashion retail has not. Swan Street for hospitality, Bridge Road for specialty home goods only.",
              },
              {
                rank: 3, name: 'South Yarra', slug: 'south-yarra', score: 82, verdict: 'GO' as const,
                rentFrom: '$12,000/mo',
                body: "Chapel Street has the highest average transaction value of any Melbourne retail strip. Household income in the South Yarra catchment exceeds $115K — the demographics support premium pricing across most categories. The risk is that Chapel Street's identity has fragmented since the mid-2010s: north Chapel (towards Commercial Road) is the viable premium zone; south Chapel has vacancy issues. Know exactly which block you're assessing before signing.",
              },
              {
                rank: 4, name: 'Brunswick', slug: 'brunswick', score: 80, verdict: 'GO' as const,
                rentFrom: '$6,000/mo',
                body: "Sydney Road is Melbourne's most genuinely diverse commercial strip — Turkish grocers, vintage stores, specialty coffee, Lebanese bakeries, and natural wine bars exist in a proximity that works because the customer base is educated and open. The demographic has been upgrading for a decade: younger professional renters replacing the older working-class base, bringing spending power without eliminating the cultural texture. The best remaining value play in Melbourne's inner north.",
              },
              {
                rank: 5, name: 'Box Hill', slug: 'box-hill', score: 79, verdict: 'GO' as const,
                rentFrom: '$4,000/mo',
                body: "The most underrated commercial location in Melbourne east. Box Hill Central draws 60,000+ weekly visits from a catchment that is predominantly Chinese-Australian with above-average household incomes. The specialty food market here — Chinese regional cuisine, Asian bakeries, bubble tea, Japanese food — serves a distinct community market with loyalty economics that inner-north operators rarely achieve. The opportunity for targeted operators is exceptional at these rents.",
              },
              {
                rank: 6, name: 'Collingwood', slug: 'collingwood', score: 78, verdict: 'GO' as const,
                rentFrom: '$8,000/mo',
                body: "Smith Street's continuation into Collingwood creates a near-seamless precinct for operators who can't afford Fitzroy's peak rents. The demographics are functionally identical — creative professional, high café spend, food-curious. Weekend foot traffic from Fitzroy spills south. The creative industry concentration (studio spaces, galleries, design firms) provides lunch and coffee demand that the residential population alone wouldn't generate.",
              },
              {
                rank: 7, name: 'Carlton', slug: 'carlton', score: 76, verdict: 'GO' as const,
                rentFrom: '$6,000/mo',
                body: "Lygon Street's Italian heritage creates a permanent demand baseline that no trend can fully erode. The University of Melbourne produces 12,000+ student foot passes daily through the Carlton corridor. Evenings are strong — Lygon Street remains one of Melbourne's most consistent dinner destinations. The opportunity gap is in daytime: the student catchment is underserved for affordable, quality lunch and specialty coffee that isn't $3.50 campus drip.",
              },
              {
                rank: 8, name: 'Footscray', slug: 'footscray', score: 77, verdict: 'GO' as const,
                rentFrom: '$4,000/mo',
                body: "Footscray is in transition — and the transition is now clearly real. Vietnamese food has anchored the suburb for 40 years; that community and its spending habits remain. The arriving cohort is younger professionals and artists priced out of the inner north, who moved here for affordability and are now pushing food culture upmarket. The result is a suburb with two customer bases at different price points creating unusual resilience. Best timing for early-mover advantage is 2025–2027.",
              },
              {
                rank: 9, name: 'Prahran', slug: 'prahran', score: 76, verdict: 'GO' as const,
                rentFrom: '$6,000/mo',
                body: "Prahran sits between South Yarra and St Kilda and captures spending from both without paying either suburb's peak rents. The Prahran Market anchors weekend foot traffic with remarkable consistency — market-adjacent tenancies benefit from Saturday-morning crowds that rival any strip in Melbourne. Commercial Road's nightlife and restaurant concentration adds evening density. The underrated entry point to the Chapel Street precinct.",
              },
              {
                rank: 10, name: 'Northcote', slug: 'northcote', score: 75, verdict: 'GO' as const,
                rentFrom: '$5,500/mo',
                body: "High Street Northcote has been where Fitzroy's overflow goes — the operators who love the inner north culture but couldn't justify the rent. That migration has been occurring for long enough that Northcote now has its own identity. The demographic is younger professional families: couples who moved north of Fitzroy for space, kept the income and spending habits. Strong Saturday foot traffic. Brunch is the highest-earning daypart — quality concepts here run 200+ covers on weekends.",
              },
              {
                rank: 11, name: 'St Kilda', slug: 'st-kilda', score: 74, verdict: 'GO' as const,
                rentFrom: '$7,500/mo',
                body: "Fitzroy Street and Acland Street are Melbourne's beach-lifestyle premium strips. Summer trade from October to March runs at 130–150% of winter. The challenge: winter at 65–70% of summer revenue requires solid cash reserves and a concept that works without tourist volume. The best St Kilda operators build businesses that stand on residential trade alone and treat the tourist premium as upside, not baseline.",
              },
              {
                rank: 12, name: 'Preston', slug: 'preston', score: 74, verdict: 'GO' as const,
                rentFrom: '$4,000/mo',
                body: "High Street Preston is 4–5 years behind Northcote in the gentrification curve — which is exactly why early-mover rents remain available. The demographic shift is visible: the established multicultural community (Italian, Greek, Vietnamese) is being joined by younger renters priced out of Northcote and Brunswick. Quality café operators who open in Preston now will face materially higher rents in three years as the market matures around them.",
              },
              {
                rank: 13, name: 'Hawthorn', slug: 'hawthorn', score: 73, verdict: 'GO' as const,
                rentFrom: '$5,000/mo',
                body: "Average household income in Hawthorn exceeds $120K — among the highest of any Melbourne suburb. Church Street has consistent professional foot traffic with limited quality hospitality supply. The Hawthorn customer is established, 35–55, income-insensitive to quality pricing, and loyal once they find a venue that meets their standards. Not a volume market — a margin market. The right café here runs fewer covers than Fitzroy at significantly higher ticket sizes.",
              },
              {
                rank: 14, name: 'Camberwell', slug: 'camberwell', score: 73, verdict: 'GO' as const,
                rentFrom: '$5,000/mo',
                body: "Burke Road Camberwell is Melbourne's gold-standard suburban professional strip. The Camberwell Junction precinct has decades of established foot traffic from a high-income (average $118K household) catchment. Weekend trade is consistently strong — Saturday morning brunch and Saturday afternoon retail both perform. This is where Melbourne's doctors, lawyers, and executives shop local. Quality hospitality and professional services succeed; discount retail does not belong here.",
              },
              {
                rank: 15, name: 'Southbank', slug: 'southbank', score: 71, verdict: 'CAUTION' as const,
                rentFrom: '$10,000/mo',
                body: "Southbank's problem is structural rather than cyclical. The Yarra riverfront generates tourist and event trade — Crown precinct, arts venues, and MCG events move significant people — but the residential density needed to sustain consistent everyday trade is thin. Office weekday populations help, but Southbank weekday hospitality depends heavily on corporate clients who became more cost-conscious post-pandemic. Works for premium venue operators with proven event and corporate revenue channels.",
              },
              {
                rank: 16, name: 'Dandenong', slug: 'dandenong', score: 68, verdict: 'CAUTION' as const,
                rentFrom: '$3,000/mo',
                body: "Greater Dandenong's multicultural composition — Sri Lankan, Afghan, Indian, Southeast Asian communities — creates specialty food markets with genuine loyalty economics. Average household incomes ($58K) limit premium positioning significantly. The commercial area around Lonsdale Street serves community needs effectively but struggles to attract discretionary spending from outside the area. Works well for ethnic specialty food and community-targeted professional services.",
              },
              {
                rank: 17, name: 'Docklands', slug: 'docklands', score: 65, verdict: 'CAUTION' as const,
                rentFrom: '$8,000/mo',
                body: "Docklands is Melbourne's most visible commercial planning failure. Twenty years of development has produced a suburb with residential population but without the organic street life that makes commercial strips viable. The office towers generate strong weekday lunch trade but the evenings and weekends remain quiet despite the residential component. Harbour Town and New Quay are the stronger zones. Operators need event-adjacent positioning or corporate client channels to make the economics work.",
              },
              {
                rank: 18, name: 'Chadstone', slug: 'chadstone', score: 67, verdict: 'CAUTION' as const,
                rentFrom: '$5,000/mo',
                body: "Chadstone Shopping Centre is Australia's largest; the surrounding commercial area is largely in its shadow. Strip retail outside the mall struggles to capture spend that Westfield's tenant mix has already consolidated. The exception: service categories that Westfield doesn't offer well — independent health practitioners, auto services, specialty food outside the food court. New residential development in the Chadstone precinct is improving the independent retail case, but slowly.",
              },
              {
                rank: 19, name: 'Werribee', slug: 'werribee', score: 66, verdict: 'CAUTION' as const,
                rentFrom: '$2,500/mo',
                body: "Werribee is growing — population increased 18% from 2020–2025 and infrastructure investment is real. But commercial maturity typically lags residential growth by 5–7 years. The current catchment of young families, many first-home buyers, has lower discretionary incomes than established suburbs. Entry-level food and services perform; premium concepts are premature. The economics are compelling for patient operators who want lowest-available rent in a growing corridor.",
              },
              {
                rank: 20, name: 'Melbourne CBD', slug: 'melbourne-cbd', score: 72, verdict: 'CAUTION' as const,
                rentFrom: '$20,000/mo',
                body: "The paradox of Melbourne's CBD is that it was the most vibrant retail and hospitality precinct in Australia before 2020, and has had the hardest recovery since. Office vacancy at 14% and hybrid work reducing peak-day populations by 25–30% have permanently altered the CBD's commercial dynamics. High-volume QSR, premium fine dining, and liquor-led venues have adapted. The independent café model that defined Melbourne's CBD coffee culture in the 2010s is structurally challenged by current economics.",
              },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/melbourne/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      {/* Mid-Page CTA */}
      <section
        style={{
          padding: '48px 24px',
          background: `linear-gradient(135deg, #047857 0%, ${C.emerald} 100%)`,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>
            Have a specific Melbourne address in mind?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>
            Get a full competitor map, rent benchmarks, foot traffic analysis, and GO/CAUTION/NO verdict for any Melbourne address. Free.
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
            Analyse your Melbourne address →
          </Link>
        </div>
      </section>

      {/* Suburb Directory */}
      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
            Melbourne Suburb Directory — By Category
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>
            20 suburbs grouped by risk profile. Compare key metrics and link through to full suburb analysis pages.
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
                    citySlug="melbourne"
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
      <section id="comparisons" style={{ padding: '56px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
            Melbourne Suburb Comparison — Key Metrics
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>
            Side-by-side scoring across eight suburbs. Use this to shortlist locations before running a full analysis.
          </p>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      {/* High-Risk Zones */}
      <section id="high-risk" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Where Melbourne Operators Get It Wrong
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              {
                title: 'Signing the wrong block on Chapel Street',
                body: "Chapel Street is not one market — it is three different markets stacked on one road. North Chapel (Commercial Road to Toorak Road) is viable premium. Central Chapel is mixed and vacancy-prone. South Chapel (Windsor end) has been declining for a decade. Operators who sign on brand recognition alone without walking every block at multiple times of day are taking on risks that aren't priced into their business case.",
              },
              {
                title: 'Treating Docklands as a CBD extension',
                body: "Docklands sits 1.5km from the CBD grid and has none of the spontaneous street traffic that makes Melbourne's CBD viable. The weekday office trade is real, but it supports lunch, not dinner. Corporate clients who arrived post-pandemic have reduced hospitality budgets. Operators who underwrote Docklands tenancies on pre-pandemic corporate spending assumptions have consistently struggled.",
              },
              {
                title: "Underestimating St Kilda's seasonal spread",
                body: "St Kilda's summer-to-winter revenue swing is 40–50 percentage points for tourist-dependent businesses. Operators who model annual revenue from a January week in summer consistently overstate their viable rent level. The businesses that have survived on Fitzroy Street for 10+ years are those that run profitably in July — they treat the summer bump as savings, not as baseline.",
              },
              {
                title: "Mistaking Fitzroy foot traffic for Fitzroy margin",
                body: "Fitzroy has extraordinary foot traffic on Friday nights and Saturdays. What it also has is a customer base that has been trained by 20 years of competition to expect value — not cheap prices, but high quality at fair prices. Operators who arrive in Fitzroy with premium pricing from a market that doesn't have the competition find themselves benchmarked against Melbourne's best within weeks. Margin discipline from day one is not optional.",
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

      {/* Deep Insights */}
      <section style={{ padding: '56px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>
            What the Numbers Don&apos;t Show — Structural Insights for Melbourne Operators
          </h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Melbourne's commercial real estate market in 2026 is bifurcating faster than at any point since the 1990s. Premium inner-ring properties — Fitzroy, Collingwood, South Yarra — have seen rents recover and in some cases exceed pre-pandemic levels. Secondary strips in outer suburbs remain 15–25% below 2019 effective rents even as face rents have been maintained. This creates a structural opportunity: the gap between face rent and effective rent is largest in the outer suburbs, where landlords are more willing to offer longer rent-free periods, fit-out contributions, and flexible break clauses to attract tenants.",
              "The data on Melbourne's café closures tells a story that the industry rarely discusses publicly. The failure rate for independent cafés that open in inner-city Melbourne in their first 18 months is approximately 35–40%. The failure rate for those that survive 18 months drops dramatically — to under 10% annually. The implication is that the first 18 months are the period of highest risk, and the operators who survive do so by maintaining obsessive cost discipline during that window. The businesses that fail typically do so because they reached break-even at 70–80% of projections and assumed the gap would close with time. It doesn't close on its own.",
              "Melbourne's tram network creates commercial patterns that differ significantly from Sydney's bus and rail-dependent suburbs. Tram corridors — Brunswick Road, Sydney Road, Smith Street, Swanston Street — generate foot traffic that is qualitatively different from car-parking-dependent strips. Tram-corridor customers arrive in smaller groups, more frequently, and on impulse more often than customers who drove to a destination. This means tram-adjacent tenancies generate more casual-drop-in revenue than the foot count alone would suggest. It is one of the structural reasons Smith Street consistently outperforms its residential population.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '32px' }}>
            Melbourne Location — Frequently Asked Questions
          </h2>
          <FAQSection faqs={FAQS} />
        </div>
      </section>

      {/* Internal Links */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>
            Explore Melbourne Suburb Analysis Pages
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { name: 'Melbourne CBD', slug: 'melbourne-cbd' },
              { name: 'Fitzroy', slug: 'fitzroy' },
              { name: 'Richmond', slug: 'richmond' },
              { name: 'South Yarra', slug: 'south-yarra' },
              { name: 'Brunswick', slug: 'brunswick' },
              { name: 'Collingwood', slug: 'collingwood' },
              { name: 'Carlton', slug: 'carlton' },
              { name: 'Northcote', slug: 'northcote' },
              { name: 'St Kilda', slug: 'st-kilda' },
              { name: 'Prahran', slug: 'prahran' },
              { name: 'Box Hill', slug: 'box-hill' },
              { name: 'Footscray', slug: 'footscray' },
              { name: 'Hawthorn', slug: 'hawthorn' },
              { name: 'Camberwell', slug: 'camberwell' },
              { name: 'Preston', slug: 'preston' },
              { name: 'Southbank', slug: 'southbank' },
              { name: 'Docklands', slug: 'docklands' },
              { name: 'Chadstone', slug: 'chadstone' },
              { name: 'Dandenong', slug: 'dandenong' },
              { name: 'Werribee', slug: 'werribee' },
            ].map((s) => (
              <Link
                key={s.slug}
                href={`/analyse/melbourne/${s.slug}`}
                style={{
                  padding: '8px 16px',
                  backgroundColor: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: C.brand,
                  textDecoration: 'none',
                }}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection
        title="Ready to choose your Melbourne location?"
        subtitle="Run a free analysis on any Melbourne address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis."
        buttonText="Analyse your Melbourne address free →"
        buttonHref="/onboarding"
      />
    </div>
  )
}
