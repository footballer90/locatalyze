// app/(marketing)/analyse/mandurah/page.tsx
// Mandurah city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getMandurahSuburb, getMandurahSuburbs } from '@/lib/analyse-data/mandurah'

function mScore(slug: string): number {
  return getMandurahSuburb(slug)?.compositeScore ?? 0
}
function mVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getMandurahSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Mandurah — 2026 Location Guide',
  description:
    'Mandurah business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Mandurah suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/mandurah' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Mandurah — 2026 Location Guide',
    description: '8 Mandurah suburbs ranked and scored. Rent benchmarks, foot traffic data, estuary tourism impact, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/mandurah',
  },
}

const COMPARISON_ROWS = [
  { name: 'Mandurah City Centre', score: mScore('mandurah-city-centre'), verdict: mVerdict('mandurah-city-centre'), rent: '$1,500–$3,500', footTraffic: 'High (seasonal)', bestFor: 'Esplanade dining, tourism café, waterfront hospitality' },
  { name: 'Rockingham', score: mScore('rockingham'), verdict: mVerdict('rockingham'), rent: '$1,500–$3,500', footTraffic: 'High', bestFor: 'Metropolitan-scale hospitality, Penguin Island tourism' },
  { name: 'Halls Head', score: mScore('halls-head'), verdict: mVerdict('halls-head'), rent: '$1,200–$2,800', footTraffic: 'Medium-High', bestFor: 'Suburban retail, family casual dining, essential services' },
  { name: 'Meadow Springs', score: mScore('meadow-springs'), verdict: mVerdict('meadow-springs'), rent: '$1,000–$2,200', footTraffic: 'Medium', bestFor: 'Family cafe, convenience food, masterplanned community' },
  { name: 'Falcon', score: mScore('falcon'), verdict: mVerdict('falcon'), rent: '$900–$2,000', footTraffic: 'Low-Medium', bestFor: 'Lifestyle café, boutique food, sea-change demographic' },
  { name: 'Dudley Park', score: mScore('dudley-park'), verdict: mVerdict('dudley-park'), rent: '$800–$1,800', footTraffic: 'Low-Medium', bestFor: 'Neighbourhood café, convenience, inner residential' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Esplanade and Coastal Strip — Tourism Overlay Required',
    description: "Mandurah City Centre and Falcon share the coastal positioning that attracts both the sea-change resident base and Perth day-tripper and tourist visitors. Summer (November to March) creates 30–50% revenue uplifts. Building local residential loyalty is what distinguishes the businesses that are durable year-round from those entirely dependent on the summer visitor market.",
    suburbs: [
      { name: 'Mandurah City Centre', slug: 'mandurah-city-centre', description: 'Primary esplanade hospitality destination. Ocean-facing dining on Mandurah Terrace attracts canal tourists, dolphin cruise visitors, and the large permanent retiree and sea-change base. Summer uplift is meaningful but the residential base moderates the off-season.', score: mScore('mandurah-city-centre'), verdict: mVerdict('mandurah-city-centre'), rentRange: '$1,500–$3,500/mo' },
      { name: 'Falcon', slug: 'falcon', description: 'Coastal sea-change suburb with genuine first-mover opportunity. Residents have above-average incomes and food culture expectations, currently travelling to City Centre or Halls Head for quality options. Low competition and low rent.', score: mScore('falcon'), verdict: mVerdict('falcon'), rentRange: '$900–$2,000/mo' },
    ],
  },
  {
    title: 'Metropolitan Scale — Rockingham',
    description: "Rockingham is a city of 110,000 in its own right — the largest market in this dataset and the most competitive. The Penguin Island tourist attraction and Shoalwater Bay marine park create genuine tourism demand on top of the large residential and commercial catchment.",
    suburbs: [
      { name: 'Rockingham', slug: 'rockingham', description: "WA's fifth-largest city. Waterfront hospitality precinct, Penguin Island tourism, and a large growing professional residential base. Competition is high — independent operators need genuine differentiation, but the market scale supports quality concepts.", score: mScore('rockingham'), verdict: mVerdict('rockingham'), rentRange: '$1,500–$3,500/mo' },
    ],
  },
  {
    title: 'Suburban Commercial Hub — Halls Head',
    description: "Halls Head delivers the most consistent year-round suburban trade in the Mandurah corridor. Halls Head Central shopping centre anchors a large family residential catchment with reliable 52-week foot traffic and moderate seasonality.",
    suburbs: [
      { name: 'Halls Head', slug: 'halls-head', description: "Dominant suburban commercial hub in Mandurah's southern corridor. Halls Head Central anchors reliable year-round family trade. Competition is 5/10 — quality independents who differentiate from the incumbent chain operators find loyal customers.", score: mScore('halls-head'), verdict: mVerdict('halls-head'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'Residential Growth — First-Mover Opportunities',
    description: "Meadow Springs, Greenfields, and Dudley Park serve growing and established residential communities whose hospitality supply lags behind population. Low competition and low tourism — entirely dependent on building genuine local community loyalty.",
    suburbs: [
      { name: 'Meadow Springs', slug: 'meadow-springs', description: 'Large masterplanned residential estate with genuine unmet demand. Growing family catchment currently travels to Halls Head for quality food options. First-mover window open for operators who establish before supply catches up.', score: mScore('meadow-springs'), verdict: mVerdict('meadow-springs'), rentRange: '$1,000–$2,200/mo' },
      { name: 'Greenfields', slug: 'greenfields', description: 'Established northern residential suburb with consistent year-round demand. Residents travel outward for hospitality — genuine convenience-oriented opportunity at the lowest rents in the corridor.', score: mScore('greenfields'), verdict: mVerdict('greenfields'), rentRange: '$700–$1,600/mo' },
      { name: 'Dudley Park', slug: 'dudley-park', description: 'Inner residential suburb adjacent to City Centre. Modest local demand with some City Centre incidental traffic. Neighbourhood café operators who build genuine local community presence find durable trade.', score: mScore('dudley-park'), verdict: mVerdict('dudley-park'), rentRange: '$800–$1,800/mo' },
    ],
  },
  {
    title: 'Inland Satellite — Pinjarra',
    description: "Pinjarra is a small rural town on the Murray River with genuine scale limitations. Not a general hospitality growth market — suits community-focused operators who explicitly serve the agricultural and rural highway catchment.",
    suburbs: [
      { name: 'Pinjarra', slug: 'pinjarra', description: 'Inland rural town 30km east of Mandurah. Small agricultural community and highway trade. Very low rents — viable for essential-service and community-focused concepts at correct revenue expectations.', score: mScore('pinjarra'), verdict: mVerdict('pinjarra'), rentRange: '$600–$1,400/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'Is Mandurah a good place to open a café or restaurant?',
    answer: "Mandurah is a viable hospitality market for operators who approach it correctly. The city of 100,000 has a substantial sea-change and retiree demographic that generates consistent above-average per-visit spend, year-round. The esplanade and canal precinct creates a genuine tourism overlay from Perth day-trippers and overnight visitors that lifts summer trade. The operators who succeed in Mandurah are those who serve the permanent resident demographic first and treat the tourist seasonal uplift as a bonus. Operators who project only peak-season esplanade trade across the full year consistently underperform.",
  },
  {
    question: 'How does Mandurah tourism affect business viability?',
    answer: "Mandurah's canal and esplanade tourism — dolphin cruises, canal boat tours, and waterfront dining visitors from Perth — creates genuine summer uplifts of 30–50% for City Centre operators from November to March. The Mandurah Crab Fest and other events create additional short-peak windows. The critical planning note is that Perth is only 80km north, so Mandurah functions as a day-trip market — many visitors eat once and leave rather than spending multiple meals. Operators who build genuine loyalty with the permanent resident and sea-change demographic are far less dependent on this variable tourist trade.",
  },
  {
    question: 'What is the difference between Mandurah City Centre and Halls Head for a food business?',
    answer: "Mandurah City Centre is the tourism and premium dining destination — esplanade positioning, ocean views, canal access, and higher average ticket prices, but with meaningful summer/winter seasonality and higher competition density. Halls Head is the year-round suburban hub — consistent foot traffic from the large residential family catchment anchored by Halls Head Central, lower average ticket prices, and more predictable seasonal variation. City Centre suits operators whose concept benefits from the tourism overlay and premium positioning. Halls Head suits operators who want reliable year-round community trade without the seasonal complexity.",
  },
  {
    question: 'Is Rockingham part of the Mandurah market?',
    answer: "Rockingham is included in this dataset as a neighbouring major coastal city, but it is operationally distinct from Mandurah — it is a 110,000-person city in its own right, 40km north of Mandurah City Centre. Operators should not treat Mandurah and Rockingham as a single market. Rockingham has its own commercial centre, its own tourism draw through Penguin Island and Shoalwater Bay, and its own competitive hospitality landscape. It is the largest and most competitive market in this dataset and requires the same level of differentiation and planning as any major city commercial precinct.",
  },
  {
    question: 'What are the main risks of opening a business in Mandurah?',
    answer: "The primary risk is seasonality combined with over-projection: operators who model their summer esplanade trade as representative of the full year consistently discover that the autumn and winter period is materially softer, particularly for concepts that depend on the tourist and day-tripper market. The second risk is market scale — Mandurah is a 100,000-person city, which means revenue ceilings are lower than Perth or larger cities, and operators who project metropolitan volumes will be consistently disappointed. The third risk is the Pinjarra/Greenfields trap: operators who choose very low-rent suburban positions without correctly modelling the limited demand in those catchments.",
  },
  {
    question: 'What types of businesses work best in Mandurah?',
    answer: "The strongest business formats in Mandurah are quality-casual hospitality concepts that serve the sea-change and retiree demographic as their primary customer. These customers have above-average household incomes, genuine food culture expectations, and strong loyalty habits once operators earn it. Esplanade-facing café and restaurant operators who position themselves as local institutions — rather than tourist traps — build the most durable businesses. Suburban commercial operators in Halls Head who serve the family residential catchment reliably also perform well. The weakest format is the seasonal concept with no genuine local following, which collapses in autumn.",
  },
  {
    question: 'How does Meadow Springs compare to established Mandurah suburbs?',
    answer: "Meadow Springs is a fundamentally different opportunity from Mandurah City Centre or Halls Head. It is a large masterplanned residential estate whose commercial development has lagged behind its population growth — meaning there is genuine existing demand for quality café and casual food options that residents are currently satisfying by travelling elsewhere. The opportunity is first-mover advantage in a market that already has the demand volume to sustain a well-positioned operator. The risk is pure residential trade with no tourism overlay — success depends entirely on building community loyalty with the local family demographic, which takes time and genuine investment in the community.",
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

function MandurahFactorDirectory() {
  const suburbs = getMandurahSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/mandurah/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function MandurahPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Mandurah"
        citySlug="mandurah"
        tagline="WA's second-largest non-metropolitan city has a genuine year-round hospitality market anchored by the sea-change demographic. The esplanade tourist trade is the seasonal bonus — not the foundation of the business case."
        statChips={[
          { text: '8 suburbs scored — esplanade to inland rural' },
          { text: 'Summer tourism November–March: 30–50% uplift for City Centre operators' },
          { text: 'Perth day-tripper market 80km north — canal and dolphin cruise visitors year-round' },
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
              { value: '100K', label: "Mandurah urban population — WA's second-largest non-metropolitan city with stable year-round demand", source: 'ABS 2024' },
              { value: '110K', label: 'Rockingham population — separate major coastal city in this dataset with its own commercial centre', source: 'ABS 2024' },
              { value: '$1.5K', label: 'Esplanade commercial rents from $1,500/month — accessible entry cost for a waterfront position', source: 'REIWA Q1 2026' },
              { value: '80km', label: 'Distance from Perth CBD — day-tripper and weekend visitor market that amplifies summer esplanade trade', source: 'Main Roads WA' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Mandurah Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Mandurah is a city of 100,000 people built around the estuary, canals, and coastal esplanade that give the city its character. It has become one of WA's most significant sea-change destinations — people who have moved from Perth and interstate to live near the water, bringing above-average household incomes and genuine food culture expectations. This demographic sustains quality hospitality trade year-round and represents the foundation of any successful Mandurah business. The mistake most operators make is overlooking this residential market in favour of the more visible tourist activity on the esplanade.",
              "The tourism overlay in Mandurah is real but should be understood correctly. Perth is 80km north, which creates a large day-trip market for canal boat tours, dolphin cruises, and esplanade dining — particularly on weekends and public holidays, and especially during the summer months from November to March. This creates genuine seasonal uplifts for correctly positioned City Centre operators. But these visitors often eat once and leave. The operators who build durable businesses in Mandurah serve the permanent sea-change and retiree community as their primary customer and treat the Perth day-tripper market as additional revenue.",
              "The practical location choice comes down to trade-offs between tourism exposure and year-round consistency. Mandurah City Centre and Rockingham offer the highest tourism overlay and highest competition density — they require genuine differentiation and the ability to manage seasonal variation. Halls Head delivers the most consistent year-round suburban trade from a large family residential catchment with lower seasonal complexity. Meadow Springs, Greenfields, and Falcon offer first-mover opportunities in residential markets where demand already exists but supply has not caught up.",
              "Be honest about scale. Mandurah is a 100,000-person regional city. A well-run café in the City Centre builds a loyal local community, does solid summer tourist trade, and generates sustainable income for a well-managed small business. It does not scale into a multi-site hospitality group without operational expansion into Rockingham or Perth. Operators who understand this scale limitation build something genuinely durable. Those who project metropolitan revenue into a regional market will cycle through the city looking for a business case that cannot exist at the local population scale.",
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
              { type: 'Cafes & Specialty Coffee', insight: "City Centre esplanade positioning and Halls Head are the strongest café markets. City Centre suits quality-casual operators who can capture both the sea-change residential base and the tourist day-tripper market. Halls Head suits volume-focused café operators serving a large family residential catchment. Falcon and Meadow Springs offer first-mover community café opportunities at significantly lower rent and competition.", best: ['City Centre', 'Halls Head', 'Falcon'] },
              { type: 'Full-Service Restaurants', insight: "Mandurah City Centre's esplanade is the primary restaurant market — ocean views, canal setting, higher average spend, and the tourism wave amplifying the residential customer base. Rockingham suits operators who want metropolitan-scale demand volume at a coastal city scale. South Bunbury-equivalent positioning does not exist in Mandurah — the waterfront is the premium dining destination.", best: ['City Centre', 'Rockingham'] },
              { type: 'Retail (Independent)', insight: "Halls Head's Central shopping precinct delivers the most consistent year-round retail foot traffic. City Centre suits tourism-adjacent and lifestyle retail. Rockingham is the highest-volume retail market in this dataset with the corresponding competitive density. Meadow Springs and Greenfields offer low-competition community retail positions for operators serving the residential catchment directly.", best: ['Halls Head', 'City Centre', 'Rockingham'] },
              { type: 'Fitness & Wellness', insight: "The sea-change and retiree demographic across City Centre, Halls Head, and Falcon has strong consistent demand for allied health, boutique fitness, and wellness services. Rockingham's larger population supports higher-volume fitness formats. Meadow Springs is an emerging opportunity as the residential base grows and demand for wellness services increases.", best: ['City Centre', 'Halls Head', 'Rockingham'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Mandurah City Centre is the only genuine tourism-adjacent location in this dataset — canal cruise operators, dolphin tour services, and the foreshore festival circuit concentrate on the Mandurah Terrace and City Lane precinct. Concepts that cater specifically to the day-tripper visitor market should position in the City Centre; everywhere else is primarily residential trade.", best: ['City Centre'] },
              { type: 'Community and Convenience', insight: "Meadow Springs, Greenfields, and Pinjarra serve growing and established communities that are underserved by quality convenience food and casual dining. Low rents, low competition, and genuine community need. Operators who embed themselves as the local institution create durable trade from residents who prioritise convenience and community over destination experiences.", best: ['Meadow Springs', 'Greenfields', 'Pinjarra'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Mandurah Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Mandurah City Centre', slug: 'mandurah-city-centre', verdict: mVerdict('mandurah-city-centre'), score: mScore('mandurah-city-centre'), rentFrom: '$1,500/mo', body: "Esplanade and canal dining precinct with the strongest balance of tourism and residential demand in Mandurah. Summer tourist trade from Perth day-trippers lifts peak revenue. The sea-change and retiree demographic provides year-round baseline trade. Build local loyalty first — the tourist wave adds on top." },
              { rank: 2, name: 'Rockingham', slug: 'rockingham', verdict: mVerdict('rockingham'), score: mScore('rockingham'), rentFrom: '$1,500/mo', body: "A 110,000-person coastal city with its own commercial centre, Penguin Island tourism draw, and growing professional residential base. The largest and most competitive market in this dataset. High-volume demand but high competition density — independent operators need genuine differentiation to win." },
              { rank: 3, name: 'Halls Head', slug: 'halls-head', verdict: mVerdict('halls-head'), score: mScore('halls-head'), rentFrom: '$1,200/mo', body: "Mandurah's dominant suburban commercial hub. Halls Head Central delivers reliable year-round family retail foot traffic from a large residential catchment. Competition is 5/10 — quality independents who differentiate from chain incumbents build loyal community trade." },
              { rank: 4, name: 'Meadow Springs', slug: 'meadow-springs', verdict: mVerdict('meadow-springs'), score: mScore('meadow-springs'), rentFrom: '$1,000/mo', body: "Large masterplanned residential estate with genuine unmet demand for quality café and casual food. Growing family catchment currently travelling to Halls Head. First-mover operators who establish community loyalty capture the market before competition arrives." },
              { rank: 5, name: 'Falcon', slug: 'falcon', verdict: mVerdict('falcon'), score: mScore('falcon'), rentFrom: '$900/mo', body: "Coastal lifestyle suburb with sea-change demographic. Above-average household incomes and food culture expectations currently going unserved locally. Low competition and low rent — genuine boutique café opportunity for operators who serve the lifestyle positioning correctly." },
              { rank: 6, name: 'Dudley Park', slug: 'dudley-park', verdict: mVerdict('dudley-park'), score: mScore('dudley-park'), rentFrom: '$800/mo', body: "Inner residential suburb adjacent to City Centre. Modest local demand with some incidental City Centre foot traffic. Neighbourhood café operators who build genuine community presence in the local residential catchment find consistent everyday trade." },
              { rank: 7, name: 'Greenfields', slug: 'greenfields', verdict: mVerdict('greenfields'), score: mScore('greenfields'), rentFrom: '$700/mo', body: "Established northern residential suburb with consistent year-round convenience demand. Low competition and the lowest rents in the corridor. Suits essential-service and convenience-focused concepts that serve the working family community reliably." },
              { rank: 8, name: 'Pinjarra', slug: 'pinjarra', verdict: mVerdict('pinjarra'), score: mScore('pinjarra'), rentFrom: '$600/mo', body: "Inland rural town 30km east on the Murray River. Real but modest demand from the agricultural and residential catchment and highway trade. The lowest rents in the region — viable for community-focused essential-service concepts at correct revenue calibration." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/mandurah/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Mandurah address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Mandurah address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#CCFBF1', color: '#134E4A', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Mandurah address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Mandurah Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="mandurah" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Mandurah Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'City Centre vs Halls Head', body: "City Centre is the tourism and premium dining destination — esplanade positioning, canal views, higher average ticket prices, and the Perth day-tripper market amplifying summer trade. Halls Head is the year-round consistency choice — Halls Head Central anchors reliable foot traffic from a large residential family catchment without the seasonal complexity. City Centre suits operators who can manage and capitalise on the seasonal cycle. Halls Head suits operators who want 52-week predictability at a more accessible rent level." },
              { title: 'Falcon vs Meadow Springs', body: "Both are first-mover residential opportunities. Falcon has a premium sea-change and lifestyle demographic with above-average household incomes and food culture expectations — the quality ceiling and average ticket size are higher. Meadow Springs has a larger total catchment of family owner-occupiers with more volume but slightly lower per-visit spend. Falcon suits boutique specialty concepts; Meadow Springs suits community café and casual dining formats that can build repeat volume from a larger family demographic." },
              { title: 'Rockingham vs City Centre', body: "Rockingham is a 110,000-person city with its own commercial dynamics — higher population, higher competition, and a metropolitan-scale market that operates independently of Mandurah. City Centre is smaller but more tourism-amplified and has a more distinctive sea-change lifestyle demographic. For an operator entering the Peel/Rockingham corridor for the first time, the choice between them is essentially a choice between metropolitan-scale competition (Rockingham) and a smaller, more distinctive market with a strong tourism overlay (Mandurah City Centre)." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Risk Zones — What Every Mandurah Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Mandurah business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Summer seasonality over-projection', why: "Mandurah City Centre's summer esplanade trade is genuinely strong from November to March. The failure mode is operators who use peak-season revenue to project a full-year business case and then discover that the autumn and winter period is materially softer. The Perth day-tripper market drops with the weather. Build the year-round local trade base first; treat the summer tourist uplift as the margin on top." },
              { name: 'Pinjarra and Greenfields scale mismatch', why: "The very low rents in Pinjarra and Greenfields are attractive but accurately reflect the genuine scale limitations of these markets. Operators who choose them on rent alone — without correctly modelling the modest demand ceiling — consistently underperform. Low rent only helps if the volume projections are calibrated to the local catchment, not to a larger city standard." },
              { name: 'Rockingham differentiation failure', why: "Rockingham is the largest and most competitive market in this dataset. Operators who enter Rockingham with a generic concept — the same café format that already exists in four other positions — get absorbed into the competitive noise and fail to build the loyal base that sustains a business. The market scale is genuinely higher but so is the quality bar that independent operators need to clear." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Mandurah Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <MandurahFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Mandurah Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Mandurah location?"
        subtitle="Run a free analysis on any Mandurah address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/mandurah/mandurah-city-centre" style={{ color: C.brand, textDecoration: 'none' }}>City Centre Analysis →</Link>
          <Link href="/analyse/mandurah/halls-head" style={{ color: C.brand, textDecoration: 'none' }}>Halls Head Analysis →</Link>
          <Link href="/analyse/mandurah/rockingham" style={{ color: C.brand, textDecoration: 'none' }}>Rockingham Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
