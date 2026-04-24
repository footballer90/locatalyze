// app/(marketing)/analyse/bunbury/page.tsx
// Bunbury city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getBunburySuburb, getBunburySuburbs } from '@/lib/analyse-data/bunbury'

function bScore(slug: string): number {
  return getBunburySuburb(slug)?.compositeScore ?? 0
}
function bVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getBunburySuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Bunbury — 2026 Location Guide',
  description:
    'Bunbury business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Bunbury suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/bunbury' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Bunbury — 2026 Location Guide',
    description: '8 Bunbury suburbs ranked and scored. Rent benchmarks, foot traffic data, South West gateway tourism impact, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/bunbury',
  },
}

const COMPARISON_ROWS = [
  { name: 'Bunbury CBD', score: bScore('bunbury-cbd'), verdict: bVerdict('bunbury-cbd'), rent: '$1,500–$3,500', footTraffic: 'High (year-round)', bestFor: 'Victoria Street hospitality, government worker lunch, South West gateway dining' },
  { name: 'Eaton', score: bScore('eaton'), verdict: bVerdict('eaton'), rent: '$1,200–$2,800', footTraffic: 'High (year-round)', bestFor: 'Regional shopping centre hospitality, high-volume retail' },
  { name: 'Australind', score: bScore('australind'), verdict: bVerdict('australind'), rent: '$900–$2,000', footTraffic: 'Medium-High', bestFor: 'Fast-growing residential community, first-mover café' },
  { name: 'South Bunbury', score: bScore('south-bunbury'), verdict: bVerdict('south-bunbury'), rent: '$900–$2,200', footTraffic: 'Medium', bestFor: 'Foreshore lifestyle café, coastal residential demographic' },
  { name: 'College Grove', score: bScore('college-grove'), verdict: bVerdict('college-grove'), rent: '$800–$1,800', footTraffic: 'Medium', bestFor: 'School catchment, family café, first-mover residential' },
  { name: 'Dalyellup', score: bScore('dalyellup'), verdict: bVerdict('dalyellup'), rent: '$800–$1,800', footTraffic: 'Low-Medium', bestFor: 'Coastal masterplanned community, first-mover family café' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'City Centre — Year-Round Commercial Hub',
    description: "Bunbury CBD is WA's third city and the undisputed commercial and hospitality hub for a 100,000-person regional catchment. Victoria Street and the central lanes generate genuine pedestrian trade from government workers, commercial businesses, and South West tourism visitors. The year-round office worker trade makes Bunbury CBD less seasonal than tourist-dependent regional centres.",
    suburbs: [
      { name: 'Bunbury CBD', slug: 'bunbury-cbd', description: 'Victoria Street commercial spine with government worker daytime trade, genuine hospitality precinct, and South West gateway tourism. Year-round consistency from the commercial office catchment. Competition is 6/10 — operators need genuine differentiation.', score: bScore('bunbury-cbd'), verdict: bVerdict('bunbury-cbd'), rentRange: '$1,500–$3,500/mo' },
    ],
  },
  {
    title: 'Regional Shopping Anchor — Eaton',
    description: "Eaton Fair is the dominant suburban retail anchor for the entire greater Bunbury catchment. The highest suburban foot traffic volumes in WA's South West — a regional shopping centre that draws from a large multi-suburb residential area with no competing regional centre within 20km.",
    suburbs: [
      { name: 'Eaton', slug: 'eaton', description: 'Eaton Fair regional shopping centre — highest suburban foot traffic in WA South West. Large residential catchment, no competing regional centre within 20km. Competition is 6/10 with established chains and strong local independents.', score: bScore('eaton'), verdict: bVerdict('eaton'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'Coastal Lifestyle — South Bunbury and Foreshore',
    description: "South Bunbury's inner residential neighbourhood adjacent to the Bunbury Foreshore and Back Beach serves a lifestyle demographic with above-average household incomes and genuine food culture expectations. The dolphin tour market creates a modest tourism overlay on top of the local residential trade.",
    suburbs: [
      { name: 'South Bunbury', slug: 'south-bunbury', description: 'Inner residential suburb adjacent to Bunbury Foreshore. Coastal lifestyle demographic with above-average incomes. Dolphin tour tourist overlay lifts summer trade. Competition is 4/10 with genuine space for quality independent cafe concepts.', score: bScore('south-bunbury'), verdict: bVerdict('south-bunbury'), rentRange: '$900–$2,200/mo' },
    ],
  },
  {
    title: 'Residential Growth — First-Mover Opportunities',
    description: "Australind, College Grove, and Dalyellup are the three fastest-growing residential corridors in the Bunbury catchment. Each is significantly underserved by quality hospitality relative to its residential population — operators who establish before the supply catches up capture genuine first-mover advantage.",
    suburbs: [
      { name: 'Australind', slug: 'australind', description: 'One of the fastest-growing residential corridors in WA South West. Population growth outpacing hospitality supply — Australind residents currently travel to Bunbury CBD or Eaton for quality food. Demand already exists and continues to grow.', score: bScore('australind'), verdict: bVerdict('australind'), rentRange: '$900–$2,000/mo' },
      { name: 'College Grove', slug: 'college-grove', description: 'Bunbury Catholic College school catchment suburb. Morning café trade, after-school food demand, and weekend family visits. Very low competition — residents currently travel elsewhere for quality options.', score: bScore('college-grove'), verdict: bVerdict('college-grove'), rentRange: '$800–$1,800/mo' },
      { name: 'Dalyellup', slug: 'dalyellup', description: 'Coastal masterplanned suburb 15km south with young family demographic. Commercial development at an early stage relative to residential density. First-mover market for operators willing to establish ahead of competition.', score: bScore('dalyellup'), verdict: bVerdict('dalyellup'), rentRange: '$800–$1,800/mo' },
    ],
  },
  {
    title: 'Established Residential — Essential Service Positions',
    description: "Withers and Carey Park are established residential suburbs whose hospitality supply serves the essential-service and convenience needs of the local community. Low rents and predictable year-round demand — viable for operators who correctly calibrate to the community scale.",
    suburbs: [
      { name: 'Withers', slug: 'withers', description: 'Established working-class residential suburb with essential-service hospitality demand. Low competition, consistent year-round trade. Value-focused operators who serve the community reliably build durable trade at the lowest rents in the Bunbury catchment.', score: bScore('withers'), verdict: bVerdict('withers'), rentRange: '$600–$1,500/mo' },
      { name: 'Carey Park', slug: 'carey-park', description: 'Established southern residential suburb between CBD and outer suburbs. Modest but consistent local demand. Convenience food and neighbourhood café operators who build genuine community presence find predictable year-round trade.', score: bScore('carey-park'), verdict: bVerdict('carey-park'), rentRange: '$600–$1,500/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'Is Bunbury a good place to open a café or restaurant?',
    answer: "Bunbury is a strong regional hospitality market for operators who understand its positioning as WA's third city and the commercial hub of the South West. The city has a large, stable government and commercial office worker catchment that generates reliable year-round weekday trade — far less seasonal than most regional coastal cities of comparable size. The South West gateway positioning creates a consistent tourism overlay from visitors travelling to Margaret River and the Capes region. The operators who succeed in Bunbury are those who serve the resident commercial and professional catchment as their primary customer and capture tourist trade as the secondary revenue layer.",
  },
  {
    question: 'What makes Bunbury different from other WA regional cities?',
    answer: "Bunbury's key differentiator is the combination of genuine commercial city scale (WA's third city, regional centre for 100,000 people) with South West tourism gateway positioning. The government and commercial office presence on Victoria Street creates year-round weekday foot traffic that most regional coastal cities simply do not have — Bunbury CBD trade does not collapse outside the tourist season the way purely tourism-dependent precincts do. This makes Bunbury less risky for operators who want year-round consistency rather than high seasonality.",
  },
  {
    question: 'What is the difference between Bunbury CBD and Eaton for a food business?',
    answer: "Bunbury CBD is the commercial and hospitality heart of the city — Victoria Street offers the highest pedestrian density and government worker daytime trade, with a growing night-time hospitality scene. The atmosphere is urban and commercial, and the competition density is meaningful. Eaton is a suburban retail anchor — Eaton Fair is the regional shopping centre draw that generates the highest suburban foot traffic volumes in WA's South West, with a more family and residential-oriented customer demographic. CBD suits operators who want the city-centre hospitality positioning and the office worker trade. Eaton suits operators who want high suburban volume and a retail-anchor environment.",
  },
  {
    question: 'Should I open in Australind or Bunbury CBD?',
    answer: "These are fundamentally different markets. Bunbury CBD gives you immediate access to the city's highest foot traffic density, the commercial worker catchment, and the South West gateway tourism trade — but at higher rent and competition. Australind gives you a first-mover opportunity in one of WA's fastest-growing residential corridors, where the demand already exists but the quality hospitality supply has not kept pace with population growth — at significantly lower rent and much lower competition. CBD suits operators with a proven concept who need volume immediately. Australind suits operators who are willing to invest 6–12 months in building community loyalty to capture a market before the competition arrives.",
  },
  {
    question: 'What are the main risks of opening a business in Bunbury?',
    answer: "The primary risk in Bunbury CBD is differentiation failure — Victoria Street has meaningful operator density, and generic concepts that replicate what is already there get absorbed into the competitive noise without building loyal customers. The second risk is the Eaton Fair lease trap: national chain anchor tenancies in regional shopping centres often have rent terms that work for high-volume franchise operators but are punishing for independent operators who overestimate the benefit of being near a big anchor. The third risk is the residential growth suburb time horizon — Australind, College Grove, and Dalyellup all require 6–18 months of community-building before trade volumes match projections, and operators who need immediate revenue from day one will find this difficult.",
  },
  {
    question: 'How does the South West tourism route affect Bunbury businesses?',
    answer: "Bunbury sits at the northern entry point of the South West tourism corridor that leads to Margaret River, Dunsborough, and the Capes region. This creates a consistent flow of visitors who pass through or overnight in Bunbury before continuing south. The effect is most visible in Bunbury CBD — visitors seeking a meal or coffee before the Margaret River drive, or after returning. The tourism overlay is genuine but should be understood as supplementary to the local trade rather than the primary market. Operators in Bunbury who build strong local community loyalty find that tourist revenue adds on top of a stable base, rather than making up for the absence of one.",
  },
  {
    question: 'What business types work best in Bunbury?',
    answer: "Quality-casual hospitality that serves the professional and commercial worker demographic in the CBD is the highest-performing format in Bunbury. This means breakfast and lunch cafes with quality food and coffee on Victoria Street and the central lanes, and dinner restaurant formats that serve the local professional community in the evenings. Eaton suits higher-volume food and retail concepts that can benefit from the regional shopping centre foot traffic. In the growth corridors (Australind, College Grove, Dalyellup), community café formats that serve the family residential demographic reliably are the strongest entry point — not destination dining concepts that require customers to seek out the location.",
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

function BunburyFactorDirectory() {
  const suburbs = getBunburySuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/bunbury/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function BunburyPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Bunbury"
        citySlug="bunbury"
        tagline="WA's third city is the commercial and hospitality hub of the South West — a 100,000-person regional centre with genuine year-round office worker trade and the gateway position for the Margaret River tourism corridor."
        statChips={[
          { text: '8 suburbs scored — CBD to coastal growth corridors' },
          { text: 'South West gateway: Margaret River and Capes visitor traffic year-round' },
          { text: 'Government and commercial office catchment moderates seasonal variation' },
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
              { value: '100K', label: "Bunbury regional catchment — WA's third city and South West commercial hub", source: 'ABS 2024' },
              { value: '$1.5K', label: 'CBD commercial rents from $1,500/month — below Perth metro, above smaller regional centres', source: 'REIWA Q1 2026' },
              { value: 'Eaton', label: 'Eaton Fair — highest suburban foot traffic in WA South West, regional shopping centre draw', source: 'REIWA Q1 2026' },
              { value: 'Top 3', label: 'Australind among fastest-growing residential corridors in regional WA — demand outpacing supply', source: 'ABS 2024' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Bunbury Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Bunbury is WA's third-largest city and the undisputed commercial and administrative hub of the South West region. A 100,000-person catchment, a genuine government and commercial office precinct on Victoria Street, and the position as the gateway city for the Margaret River and Capes tourism corridor combine to make Bunbury one of the most commercially viable regional hospitality markets in Western Australia. The city is less seasonal than most regional coastal centres because the government worker and commercial office catchment creates consistent year-round weekday trade that does not depend on tourist arrivals.",
              "The South West tourism gateway positioning is an important secondary layer. Visitors travelling from Perth to Margaret River, Dunsborough, and the Capes region pass through or overnight in Bunbury — creating consistent visitor trade that supplements the local commercial and residential market. The effect is most visible in Bunbury CBD, where the Victoria Street hospitality precinct captures both the local office worker trade and the passing tourist visitor market. This dual demand profile is what makes Bunbury CBD the most commercially robust position in the dataset.",
              "The growth corridors — Australind, College Grove, and Dalyellup — represent a different opportunity entirely. These are rapidly expanding residential communities whose hospitality and retail supply has lagged significantly behind population growth. The demand already exists in these markets; it is currently being satisfied by residents driving to Bunbury CBD or Eaton. Operators who establish in these corridors before the supply catches up capture genuine first-mover advantage in markets with real and growing demand.",
              "The key risk in Bunbury is differentiation failure, not demand failure. The CBD and Eaton have meaningful competitive density, and generic concepts that replicate existing operators without clear positioning do not win market share. The growth corridors require time — community loyalty takes 6–18 months to build, and operators who need immediate revenue from day one will find the residential-first markets difficult. The operators who succeed in Bunbury treat differentiation and community loyalty as the primary investment, not as afterthoughts.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Bunbury CBD's Victoria Street is the strongest café market — office worker morning trade, government precinct lunch demand, and the South West tourist passing trade. South Bunbury suits the foreshore lifestyle café concept. Australind and College Grove offer first-mover community café opportunities in residential corridors with real but currently unserved demand.", best: ['Bunbury CBD', 'South Bunbury', 'Australind'] },
              { type: 'Full-Service Restaurants', insight: "Bunbury CBD is the primary full-service restaurant market — the commercial and office catchment supports quality dinner trade, and the South West gateway position creates visitor dining demand. South Bunbury suits operators who want a more intimate foreshore setting for quality-casual dining. Eaton suits volume-oriented restaurant formats that benefit from the regional shopping centre environment.", best: ['Bunbury CBD', 'South Bunbury', 'Eaton'] },
              { type: 'Retail (Independent)', insight: "Eaton Fair delivers the highest retail foot traffic volume in the dataset — a regional shopping centre draw from a wide multi-suburb catchment. Bunbury CBD suits specialty and independent retail operators who benefit from the urban commercial environment. Australind is an emerging retail opportunity as the residential catchment grows and local retail supply lags behind.", best: ['Eaton', 'Bunbury CBD', 'Australind'] },
              { type: 'Fitness & Wellness', insight: "The professional and commercial demographic in Bunbury CBD and the higher-income residential communities in South Bunbury and Australind have genuine demand for boutique fitness, allied health, and wellness services. Eaton suits high-volume fitness formats that benefit from the regional shopping centre foot traffic generator.", best: ['Bunbury CBD', 'South Bunbury', 'Eaton'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Bunbury CBD is the primary tourism-adjacent location — the Victoria Street and Central City precinct captures South West gateway visitors. South Bunbury's dolphin tour proximity creates a more specific marine tourism context. The growth corridors (Australind, College Grove, Dalyellup) are entirely residential trade — no tourism relevance.", best: ['Bunbury CBD', 'South Bunbury'] },
              { type: 'Community and Convenience', insight: "Australind, College Grove, Dalyellup, Withers, and Carey Park all serve residential communities that have genuine unmet demand for reliable local food and café options. Low rents, low competition, and community loyalty as the primary competitive advantage. Operators who become the local institution in these suburbs build durable businesses.", best: ['Australind', 'College Grove', 'Dalyellup'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Bunbury Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Bunbury CBD', slug: 'bunbury-cbd', verdict: bVerdict('bunbury-cbd'), score: bScore('bunbury-cbd'), rentFrom: '$1,500/mo', body: "Victoria Street commercial spine — government worker daytime trade, genuine pedestrian hospitality precinct, and South West gateway tourist flow. Year-round consistency from the office catchment. Competition is 6/10: operators need genuine differentiation, but the demand profile supports quality independent concepts." },
              { rank: 2, name: 'Eaton', slug: 'eaton', verdict: bVerdict('eaton'), score: bScore('eaton'), rentFrom: '$1,200/mo', body: "Eaton Fair regional shopping centre — the dominant suburban retail anchor for the entire greater Bunbury catchment. Highest suburban foot traffic in WA South West. Competition is high with national chains; surrounding commercial strip offers more accessible entry points that still benefit from the traffic draw." },
              { rank: 3, name: 'Australind', slug: 'australind', verdict: bVerdict('australind'), score: bScore('australind'), rentFrom: '$900/mo', body: "One of WA's fastest-growing residential corridors. Population growth materially outpacing hospitality supply — residents currently drive to CBD or Eaton for quality food. First-mover operators who establish community loyalty capture the market before competition arrives." },
              { rank: 4, name: 'South Bunbury', slug: 'south-bunbury', verdict: bVerdict('south-bunbury'), score: bScore('south-bunbury'), rentFrom: '$900/mo', body: "Inner residential suburb adjacent to the Bunbury Foreshore and Back Beach. Coastal lifestyle demographic with above-average household incomes. Dolphin tour tourist overlay creates summer uplift. Quality independent café concepts find genuine space in the foreshore lifestyle market." },
              { rank: 5, name: 'College Grove', slug: 'college-grove', verdict: bVerdict('college-grove'), score: bScore('college-grove'), rentFrom: '$800/mo', body: "Bunbury Catholic College school catchment. Reliable morning and after-school trade cycle from the school community. Very low competition — residents travel elsewhere for quality options. First-mover café operators serve a predictable and loyal school-year trade cycle." },
              { rank: 6, name: 'Dalyellup', slug: 'dalyellup', verdict: bVerdict('dalyellup'), score: bScore('dalyellup'), rentFrom: '$800/mo', body: "Coastal masterplanned suburb 15km south with young family demographic. Commercial development at an early stage relative to residential density. Genuine first-mover market. Operators who build community presence before competition establishes capture a loyal local catchment." },
              { rank: 7, name: 'Withers', slug: 'withers', verdict: bVerdict('withers'), score: bScore('withers'), rentFrom: '$600/mo', body: "Established working-class residential suburb. Essential-service demand for reliable, affordable food options. Low competition and consistent year-round trade. Value-positioned operators who serve the community reliably build durable trade at the lowest rents in Bunbury." },
              { rank: 8, name: 'Carey Park', slug: 'carey-park', verdict: bVerdict('carey-park'), score: bScore('carey-park'), rentFrom: '$600/mo', body: "Established southern residential suburb between CBD and outer growth areas. Modest but consistent local demand. Neighbourhood café and convenience food operators who build genuine community presence find predictable everyday trade." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/bunbury/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Bunbury address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Bunbury address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#DBEAFE', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Bunbury address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Bunbury Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="bunbury" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Bunbury Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Bunbury CBD vs Eaton', body: "CBD and Eaton serve different customers and different operator formats. CBD is the urban commercial choice — pedestrian hospitality, office worker trade, tourism gateway position, and a growing night-time food and beverage scene. Eaton is the suburban volume choice — regional shopping centre anchor, family residential catchment, and the highest suburban foot traffic in WA South West. CBD suits operators who want the city-centre atmosphere and the commercial worker demographic. Eaton suits operators who need high-volume suburban foot traffic and are comfortable competing in a retail anchor environment." },
              { title: 'Australind vs College Grove', body: "Both are first-mover residential opportunities with strong population growth and low competition. Australind has the larger total catchment and the stronger growth trajectory — one of WA's fastest-growing corridors with demand volumes that can support multiple quality operators once the commercial supply catches up. College Grove has the school catchment advantage — a predictable and reliable morning and after-school trade cycle tied to the academic year calendar. Australind suits operators who want the larger long-term market. College Grove suits operators whose café format benefits specifically from the school community trade pattern." },
              { title: 'South Bunbury vs Bunbury CBD', body: "South Bunbury is the lifestyle coastal alternative to the CBD commercial environment. Where CBD trade is driven by government workers and the commercial precinct, South Bunbury trade is driven by the residential lifestyle demographic and the foreshore recreational visitor market. South Bunbury suits boutique, quality-casual operators who want the ocean-facing atmosphere and the higher-income residential base. Bunbury CBD suits operators who want the maximum foot traffic density and the year-round commercial worker demand that does not depend on recreational use patterns." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Risk Zones — What Every Bunbury Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Bunbury business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'CBD differentiation failure', why: "Victoria Street has meaningful competitive density for a regional city — multiple established cafes, restaurants, and retail concepts. Generic operators who do not offer a clear reason for customers to choose them over the incumbents spend their first year fighting for table scraps from an already-divided market. The operators who succeed in Bunbury CBD do one thing distinctly better than anyone else: a coffee standard, a specific cuisine, a quality level, a community positioning. Decide what that is before signing the lease." },
              { name: 'Growth corridor time horizon mismatch', why: "Australind, College Grove, and Dalyellup all require 6–18 months of community-building before trade volumes match a commercial viability threshold. Operators who project year-one revenue from a growth corridor at the same density as an established commercial hub will run out of cash before the community loyalty is built. Model the ramp period honestly, capitalise for 18 months of below-projection trading, or do not enter these markets." },
              { name: 'Eaton Fair lease structure trap', why: "Regional shopping centre tenancy terms are written for national franchise operators with high turnover per square metre. Independent hospitality operators who enter Eaton Fair at standard anchor-adjacent tenancy rates without negotiating performance-based rent structures often find that the foot traffic is there but the lease cost absorbs the margin. Negotiate rent relief periods, turnover-linked rent, or anchor-adjacent positioning in the external strip rather than inside the centre." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Bunbury Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <BunburyFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Bunbury Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Bunbury location?"
        subtitle="Run a free analysis on any Bunbury address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/bunbury/bunbury-cbd" style={{ color: C.brand, textDecoration: 'none' }}>CBD Analysis →</Link>
          <Link href="/analyse/bunbury/eaton" style={{ color: C.brand, textDecoration: 'none' }}>Eaton Analysis →</Link>
          <Link href="/analyse/bunbury/australind" style={{ color: C.brand, textDecoration: 'none' }}>Australind Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
