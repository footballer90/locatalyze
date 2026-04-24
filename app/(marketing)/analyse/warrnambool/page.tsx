// app/(marketing)/analyse/warrnambool/page.tsx
// Warrnambool city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getWarrnamboolSuburb, getWarrnamboolSuburbs } from '@/lib/analyse-data/warrnambool'

function wbScore(slug: string): number {
  return getWarrnamboolSuburb(slug)?.compositeScore ?? 0
}
function wbVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getWarrnamboolSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Warrnambool — 2026 Location Guide',
  description:
    'Warrnambool business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Warrnambool suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/warrnambool' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Warrnambool — 2026 Location Guide',
    description:
      '7 Warrnambool suburbs ranked and scored. Rent benchmarks, foot traffic data, whale watching season impact, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/warrnambool',
  },
}

const COMPARISON_ROWS = [
  { name: 'Warrnambool CBD', score: wbScore('warrnambool-cbd'), verdict: wbVerdict('warrnambool-cbd'), rent: '$2,000–$4,500', footTraffic: 'High', bestFor: 'Destination dining, specialty retail' },
  { name: 'Merrivale', score: wbScore('merrivale'), verdict: wbVerdict('merrivale'), rent: '$2,000–$4,000', footTraffic: 'High (anchor)', bestFor: 'Convenience dining, large-format retail' },
  { name: 'Woodford', score: wbScore('woodford'), verdict: wbVerdict('woodford'), rent: '$1,500–$3,000', footTraffic: 'Medium-High (hospital)', bestFor: 'Breakfast/lunch, allied health' },
  { name: 'Port Fairy', score: wbScore('port-fairy'), verdict: wbVerdict('port-fairy'), rent: '$2,000–$4,500', footTraffic: 'High (seasonal)', bestFor: 'Tourism dining, premium hospitality' },
  { name: 'Koroit', score: wbScore('koroit'), verdict: wbVerdict('koroit'), rent: '$1,000–$2,500', footTraffic: 'Medium (seasonal)', bestFor: 'Village dining, artisan food' },
  { name: 'Dennington', score: wbScore('dennington'), verdict: wbVerdict('dennington'), rent: '$1,200–$2,500', footTraffic: 'Medium', bestFor: 'Family cafe, convenience food' },
  { name: 'Allansford', score: wbScore('allansford'), verdict: wbVerdict('allansford'), rent: '$700–$1,800', footTraffic: 'Low-Medium (highway)', bestFor: 'Highway cafe, cheese tourism' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'CBD and Marine Tourism — Liebig Street and the Hospital Precinct',
    description:
      'Warrnambool CBD and Woodford anchor the two most reliable commercial precincts in the city. The CBD serves the regional commercial hub function with genuine tourism overlay. Woodford delivers year-round professional demand from the hospital that is completely independent of seasonal cycles.',
    suburbs: [
      {
        name: 'Warrnambool CBD',
        slug: 'warrnambool-cbd',
        description:
          'Liebig Street is the primary commercial and dining spine of south-west Victoria. Premium location with strong regional catchment, Logan Beach whale watching visitors, and a well-developed independent food scene. New entrants need genuine differentiation to compete with established operators.',
        score: wbScore('warrnambool-cbd'),
        verdict: wbVerdict('warrnambool-cbd'),
        rentRange: '$2,000–$4,500/mo',
      },
      {
        name: 'Woodford',
        slug: 'woodford',
        description:
          'Adjacent to Warrnambool Base Hospital, with a consistent professional and healthcare-worker customer base running on shift patterns. Reliable early-morning, lunchtime, and late-evening demand windows make this the most predictable year-round location in the city.',
        score: wbScore('woodford'),
        verdict: wbVerdict('woodford'),
        rentRange: '$1,500–$3,000/mo',
      },
    ],
  },
  {
    title: 'Premium Tourism Villages — Port Fairy and Koroit',
    description:
      'Port Fairy and Koroit serve distinct but complementary tourism markets. Port Fairy attracts premium Melbourne visitors with the Folk Festival and high-spend coastal accommodation. Koroit draws authentic village-experience seekers via Tower Hill Wildlife Reserve. Both reward quality and punish generic hospitality.',
    suburbs: [
      {
        name: 'Port Fairy',
        slug: 'port-fairy',
        description:
          'Victoria\'s premier coastal tourism village. The Port Fairy Folk Festival (March, 15,000 attendees) creates an extraordinary revenue peak. Premium visitor market with high per-visit spend sustained for six to seven months. The off-season (May to August) requires a clear local resident strategy.',
        score: wbScore('port-fairy'),
        verdict: wbVerdict('port-fairy'),
        rentRange: '$2,000–$4,500/mo',
      },
      {
        name: 'Koroit',
        slug: 'koroit',
        description:
          'Irish heritage village with Tower Hill Wildlife Reserve tourism and a reputation for quality independent food. Visitors seek the authentic village experience. Low rents, modest competition, and genuine tourism demand make this accessible for quality-focused operators.',
        score: wbScore('koroit'),
        verdict: wbVerdict('koroit'),
        rentRange: '$1,000–$2,500/mo',
      },
    ],
  },
  {
    title: 'Retail and Anchor Precincts — Year-Round Residential Trade',
    description:
      'Merrivale and Dennington serve the residential population with year-round consistency. Merrivale has the highest-volume anchor-driven foot traffic in the city. Dennington is an emerging residential estate with genuine first-mover opportunity for community-focused operators.',
    suburbs: [
      {
        name: 'Merrivale',
        slug: 'merrivale',
        description:
          'Gateway Plaza and Warrnambool Base Hospital create the highest-volume retail foot traffic location outside the CBD. Coles and Woolworths anchors drive consistent daily shopper trade. Low seasonality — this is a 52-week commercial environment that rewards format fit over destination appeal.',
        score: wbScore('merrivale'),
        verdict: wbVerdict('merrivale'),
        rentRange: '$2,000–$4,000/mo',
      },
      {
        name: 'Dennington',
        slug: 'dennington',
        description:
          'Fast-growing outer residential suburb with minimal commercial hospitality supply. Young families and first-home buyers who value community and convenience are underserved. Low rents and low competition create a genuine first-mover window for neighbourhood cafe and casual dining operators.',
        score: wbScore('dennington'),
        verdict: wbVerdict('dennington'),
        rentRange: '$1,200–$2,500/mo',
      },
    ],
  },
  {
    title: 'Highway and Satellite — Allansford',
    description:
      'Allansford sits on the Princes Highway east of Warrnambool, serving passing travellers and a small local community. The Allansford Cheese World creates modest tourism adjacency. Very low rents make the entry economics accessible, but market scale is genuinely constrained.',
    suburbs: [
      {
        name: 'Allansford',
        slug: 'allansford',
        description:
          'Highway village with Cheese World tourism and passing Melbourne-to-Warrnambool traveller trade. Very low rents and minimal competition. The market scale is limited by the small permanent population — viable for correctly positioned small-scale operators who serve both residents and passing trade.',
        score: wbScore('allansford'),
        verdict: wbVerdict('allansford'),
        rentRange: '$700–$1,800/mo',
      },
    ],
  },
]

const FAQS = [
  {
    question: 'How does the whale watching season affect Warrnambool businesses?',
    answer:
      'Logan Beach whale watching runs from approximately June to September, when southern right whales use the bay as a nursery. This is a genuine and significant tourism driver for the CBD — visitors come specifically to Warrnambool for the whales and spend on food, accommodation, and retail during their stay. The key difference from Hervey Bay is that Warrnambool has a much stronger non-seasonal commercial base: it is the regional hub for south-west Victoria, and the whale season is a meaningful uplift on top of a functioning year-round economy rather than the defining commercial event. Operators in the CBD benefit from the whale season without being structurally dependent on it the way Esplanade operators in a pure coastal tourism town are.',
  },
  {
    question: 'Port Fairy vs Warrnambool CBD — which is the better location?',
    answer:
      'They serve fundamentally different markets and the right answer depends entirely on what you are building. Port Fairy is a premium tourism village: the Folk Festival is exceptional, the visitor spend is very high, and the location commands attention from Melbourne visitors seeking a coastal experience. But it is a town of 3,000 permanent residents, and the off-season (May to August) is materially softer — operators must have a genuine local resident strategy to sustain winter trade. Warrnambool CBD is the regional commercial hub for 35,000 people and a substantial rural hinterland. Year-round trade is more consistent, the competition density is higher, and the tourism overlay (whale watching, racing carnival) supplements a fundamentally commercial catchment. For premium hospitality with a tourism-first model, Port Fairy. For a business built on reliable year-round commercial trade with tourism upside, Warrnambool CBD.',
  },
  {
    question: 'Does Great Ocean Road tourism benefit Warrnambool businesses?',
    answer:
      'Warrnambool is positioned as the western terminus of the Great Ocean Road tourism corridor, which creates genuine visitor flow through the city. Tourists travelling the Road often end their journey in Warrnambool, where they stay overnight and spend on food and accommodation before heading back to Melbourne or continuing west. This is a real revenue contribution — particularly for CBD restaurants and accommodation — but it is important to frame it correctly. Warrnambool is not a stop on the Great Ocean Road in the same way that Apollo Bay or Lorne are; it is the end point, which means visitors arrive after a long drive and are looking for quality hospitality rather than a quick stop. This suits quality-casual dining concepts well, but does not generate the same pass-through volume as mid-route destinations.',
  },
  {
    question: 'Is Liebig Street worth the higher rent for a new cafe or restaurant?',
    answer:
      'Liebig Street is the strongest commercial dining precinct in regional Victoria south-west of Geelong. The foot traffic is genuine, the demographic has above-average food culture expectations, and the location anchors all CBD visitor and resident spending. The rents — $2,000 to $4,500 per month — are elevated relative to outer suburbs but are significantly below what equivalent strip positions cost in Geelong or Melbourne. The critical question is whether your concept can genuinely compete in a well-developed independent food scene. Liebig Street has established operators who have built strong local followings. A generic concept that does not offer clear differentiation in quality, format, or positioning will find the competition difficult. An operator with a genuinely differentiated concept and strong execution finds an excellent commercial environment at rents that remain affordable by any capital city comparison.',
  },
  {
    question: 'Merrivale vs Warrnambool CBD — which suits my business better?',
    answer:
      'The choice comes down to the customer you are building for. Merrivale serves the convenience and destination-shopping customer — the person who comes to Gateway Plaza for the supermarket, hardware, and large-format retail and wants food as a functional extension of the shopping trip. Foot traffic is very high, year-round, and reliable. But the customer mindset is convenience rather than destination dining — average ticket size and dwell time are lower than the CBD. The CBD Liebig Street precinct serves the destination customer: people who come specifically to eat, drink, and browse. Average spend is higher, but you are competing in a more active hospitality scene. Merrivale suits convenience cafe, casual dining, and essential-service food concepts. The CBD suits quality-casual dining, specialty coffee, and retail concepts where the experience itself is the draw.',
  },
  {
    question: 'How does the Warrnambool Racing Carnival affect the city?',
    answer:
      'The Warrnambool Racing Carnival in May is a three-day event centred on the Grand National Steeplechase that draws approximately 20,000 visitors to the city across the three race days. It is one of the most significant regional racing events in Australia and creates a concentrated revenue spike for CBD hospitality and accommodation. Visitors at race time have high per-visit spend and a willingness to eat and drink well. The practical impact for businesses is a three-day uplift in May that materially exceeds normal trade — useful as a revenue buffer, but a small proportion of the annual calendar. Operators who can manage the additional demand well capture a useful revenue contribution; those who underestimate the volumes face service pressure during the event.',
  },
  {
    question: 'What types of businesses work best in the Warrnambool region?',
    answer:
      'The businesses that succeed in Warrnambool share a consistent characteristic: they serve the local community as their primary market and treat tourism as a supplementary revenue layer. Warrnambool is not a pure tourism town — it is a functioning regional commercial hub where locals, healthcare workers, and rural catchment residents drive the majority of trade year-round. Quality-casual hospitality with genuine local community positioning performs best in the CBD and Merrivale. Healthcare-adjacent concepts (breakfast and lunch-focused) perform well in Woodford. Premium hospitality with high tourism dependency works in Port Fairy if the operator models the off-season honestly. Community-positioned neighbourhood cafes have a clear first-mover opportunity in Dennington. Allansford suits highway and tourism-adjacent concepts at very low entry costs.',
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

function WarrnamboolFactorDirectory() {
  const suburbs = getWarrnamboolSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/warrnambool/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function WarrnamboolPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Warrnambool"
        citySlug="warrnambool"
        tagline="South-west Victoria's regional commercial hub has a genuine year-round hospitality market anchored by the Liebig Street dining scene, Logan Beach whale watching, and the Port Fairy Folk Festival economy. Lower seasonal risk than pure coastal tourism markets."
        statChips={[
          { text: '7 suburbs scored — Liebig Street to highway satellite' },
          { text: 'Whale watching June–September: real tourism uplift on a year-round commercial base' },
          { text: 'Port Fairy Folk Festival March: 15,000 visitors and the highest per-visit spend in the region' },
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
            { label: 'Seasonality', href: '#seasonality' },
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
              { value: '35K', label: 'Warrnambool urban population — regional hub serving a substantially larger rural catchment across south-west VIC', source: 'ABS 2024' },
              { value: 'Jun–Sep', label: 'Logan Beach whale watching season — southern right whale nursery, genuine CBD tourism uplift', source: 'Parks Victoria 2025' },
              { value: 'March', label: 'Port Fairy Folk Festival — 15,000 attendees and the highest per-visit spend in the South West Coast region', source: 'Port Fairy Folk Festival 2025' },
              { value: '$2.0K', label: 'Liebig Street commercial rents from $2,000/month — affordable for a quality regional strip position', source: 'REIV Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Warrnambool Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              'Warrnambool is the commercial capital of south-west Victoria — a genuine regional hub that draws trade from Portland, Port Fairy, Terang, Camperdown, and the surrounding rural communities across a catchment that substantially exceeds the 35,000-person urban population. The Liebig Street and Timor Street precincts constitute the most active independent retail and dining strips in regional Victoria south-west of Geelong, with a food scene that has been built over years by operators who understand the quality expectations of both the local community and the visitor market.',
              'The key distinction between Warrnambool and most comparable regional coastal cities is the lower structural seasonality. Logan Beach whale watching from June to September is a genuine and significant tourism driver, but it operates as an uplift on top of a functioning year-round commercial economy — not as the defining event that determines whether a business survives. The Racing Carnival in May, the Great Ocean Road visitor terminus function, and the Flagstaff Hill Maritime Village create a distributed tourism calendar that moderates the revenue peaks and troughs that characterise more tourism-dependent coastal markets.',
              'Port Fairy, 30km west, adds a premium tourism dimension to the region that operators need to understand and position against deliberately. The Folk Festival in March is one of the most significant regional cultural events in Australia and creates concentrated high-spend visitor demand for a long weekend that benefits both Port Fairy directly and Warrnambool as overflow accommodation and hospitality. Port Fairy and Warrnambool serve different customer profiles — Port Fairy serves the Melbourne premium visitor seeking an authentic coastal experience; Warrnambool serves the regional resident, the rural catchment, and the touring visitor seeking a genuine commercial town.',
              'Be accurate about the competitive landscape. The CBD has a well-developed independent food scene with operators who have built real local followings over years. New entrants on Liebig Street face genuine competition from quality incumbents, and a generic concept that does not offer clear differentiation will be outcompeted. The market rewards operators who offer something genuinely better or different — not those who replicate what already exists.',
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
              { type: 'Cafes & Specialty Coffee', insight: 'Warrnambool CBD (Liebig Street) is the strongest cafe market — established foot traffic, strong food culture, and a demographic with above-average coffee and quality expectations. Woodford suits extended-hours cafes serving the hospital precinct. Dennington is the first-mover community cafe opportunity in the growing residential estate.', best: ['Warrnambool CBD', 'Woodford', 'Dennington'] },
              { type: 'Full-Service Restaurants', insight: 'Liebig Street is the destination dining address for the region — the customer base comes specifically to eat and has the per-visit spend to support quality independent restaurants. Port Fairy suits premium hospitality for high-spend Melbourne visitors during the tourism season. Koroit suits quality village dining for the Tower Hill and Shipwreck Coast visitor market.', best: ['Warrnambool CBD', 'Port Fairy', 'Koroit'] },
              { type: 'Retail (Independent)', insight: 'Liebig Street has the strongest retail foot traffic for specialty and independent retail. Merrivale suits convenience and large-format retail aligned to the anchor tenant environment. Dennington offers a low-cost entry point for community retail serving the growing residential catchment.', best: ['Warrnambool CBD', 'Merrivale', 'Dennington'] },
              { type: 'Fitness & Wellness', insight: 'The professional and healthcare-worker demographic in Woodford and the CBD has genuine demand for quality allied health and boutique wellness. Merrivale suits high-volume fitness formats supported by the large anchor-driven foot traffic. Dennington is an early opportunity as the residential population grows.', best: ['Woodford', 'Warrnambool CBD', 'Merrivale'] },
              { type: 'Tourism and Experience Concepts', insight: 'Port Fairy is the highest-tourism-exposure location in the region, with the Folk Festival creating an extraordinary March revenue event. Koroit suits authentic village experience concepts for the Tower Hill visitor market. The Warrnambool CBD captures Great Ocean Road terminus visitors and whale watching season trade.', best: ['Port Fairy', 'Koroit', 'Warrnambool CBD'] },
              { type: 'Community and Convenience', insight: 'Dennington is the clearest community and convenience opportunity in the Warrnambool region — a large and growing residential estate with very limited hospitality supply. Low rents and genuine unmet demand create the conditions for a community institution that builds loyalty as the suburb matures. Allansford suits very small-scale highway convenience.', best: ['Dennington', 'Allansford'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Warrnambool Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Warrnambool CBD', slug: 'warrnambool-cbd', verdict: wbVerdict('warrnambool-cbd'), score: wbScore('warrnambool-cbd'), rentFrom: '$2,000/mo', body: "Liebig Street is the commercial and dining spine of south-west Victoria. The strongest balance of year-round residential trade and tourism overlay in the region. Well-developed independent food scene means new operators need genuine differentiation — concepts that offer clear quality or format advantages find a receptive market with strong spending habits." },
              { rank: 2, name: 'Merrivale', slug: 'merrivale', verdict: wbVerdict('merrivale'), score: wbScore('merrivale'), rentFrom: '$2,000/mo', body: "Gateway Plaza and the Warrnambool Base Hospital anchor the highest-volume foot traffic location in the city outside the CBD. The most consistently year-round commercial environment in Warrnambool — virtually no seasonal variation. Convenience dining and essential-service food concepts suit the anchor-driven customer profile." },
              { rank: 3, name: 'Port Fairy', slug: 'port-fairy', verdict: wbVerdict('port-fairy'), score: wbScore('port-fairy'), rentFrom: '$2,000/mo', body: "Victoria's premier coastal tourism village. Folk Festival in March is extraordinary. High-spend Melbourne visitor market sustains premium hospitality for six to seven months. Off-season (May to August) requires a genuine local resident strategy. High quality bar — discerning visitors expect premium execution." },
              { rank: 4, name: 'Woodford', slug: 'woodford', verdict: wbVerdict('woodford'), score: wbScore('woodford'), rentFrom: '$1,500/mo', body: "Hospital-adjacent precinct with a reliable professional and healthcare-worker customer base. Shift patterns create demand windows outside standard commercial hours — early morning, lunchtime, late evening. Year-round trade that is completely independent of tourism cycles. The most predictable revenue environment in the dataset." },
              { rank: 5, name: 'Koroit', slug: 'koroit', verdict: wbVerdict('koroit'), score: wbScore('koroit'), rentFrom: '$1,000/mo', body: "Irish heritage village with genuine Tower Hill Wildlife Reserve tourism and a reputation for quality independent food. Very low rents make this accessible for quality operators who can serve both the village visitor and the Warrnambool day-tripper market. Seasonal variation but manageable off-season with a local resident base." },
              { rank: 6, name: 'Dennington', slug: 'dennington', verdict: wbVerdict('dennington'), score: wbScore('dennington'), rentFrom: '$1,200/mo', body: "Warrnambool's fastest-growing residential suburb with minimal commercial hospitality supply. Young families who value community and convenience are genuinely underserved. First-mover operators who establish themselves as the neighbourhood cafe build durable loyalty as the residential population grows. No seasonality, pure community trade." },
              { rank: 7, name: 'Allansford', slug: 'allansford', verdict: wbVerdict('allansford'), score: wbScore('allansford'), rentFrom: '$700/mo', body: "Small highway village with Cheese World tourism and Melbourne-to-Warrnambool passing trade. Very low rents and minimal competition. Genuine scale limitations — the permanent population is small and the revenue ceiling is modest. Viable for correctly positioned small-scale concepts that serve both residents and passing travellers." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/warrnambool/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Warrnambool address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Warrnambool or South West Coast address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#E0F2FE', color: '#0F172A', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Warrnambool address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Warrnambool Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="warrnambool" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Warrnambool Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Warrnambool CBD vs Merrivale', body: "The CBD serves the destination customer — someone who comes specifically to the Liebig Street precinct to eat, drink, and browse, with a higher per-visit spend and a greater willingness to try quality independents. Merrivale serves the convenience shopper — someone who is primarily at Gateway Plaza for the supermarket or hardware and wants food as a functional extension of the trip. CBD average ticket size is higher; Merrivale foot traffic volume is higher. For destination dining and specialty retail, the CBD. For convenience food and essential services, Merrivale." },
              { title: 'Port Fairy vs Koroit', body: "Port Fairy is the premium tourism market — high-spend Melbourne visitors, the Folk Festival, and a visitor demographic with strong food culture expectations and a willingness to pay for quality. Koroit is the authentic village market — Tower Hill Wildlife Reserve visitors and Warrnambool day-trippers seeking a genuine village experience. Port Fairy has more revenue upside during the season but steeper off-season softness and higher rents. Koroit has lower rents, lower competition, and a more manageable seasonal profile for operators who can balance tourism and local resident trade." },
              { title: 'Dennington vs CBD for a new cafe', body: "A first-time operator choosing between Dennington and the CBD is really choosing between market certainty and community opportunity. The CBD has established foot traffic, a clear market, and proven demand — but it also has established competition that raises the quality bar for new entrants. Dennington has no established competition, a genuine and growing residential catchment, and low rents — but requires building a business from a blank sheet in an emerging precinct. A first-time operator with strong community positioning skills and a family-cafe concept has a clearer path to success in Dennington than on Liebig Street." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="seasonality" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Seasonality in Warrnambool — Lower Risk Than Most Coastal Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that distinguish Warrnambool from higher-seasonality coastal markets — and the failure modes that still catch operators out.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Port Fairy off-season risk', why: "Port Fairy is the highest-seasonality location in the dataset. The Folk Festival and the October-to-April warm season are genuinely exceptional for revenue. May to August is materially softer — the permanent population of 3,000 alone does not sustain the trade volumes that tourism creates during the season. Operators without a genuine local resident strategy face cash flow pressure every winter. This is not a reason to avoid Port Fairy — it is a reason to model the off-season honestly and plan accordingly before signing a lease." },
              { name: 'Projecting tourism revenue year-round', why: "The whale watching season, the Folk Festival, and the Racing Carnival are all genuine and significant revenue events. The failure mode is operators who use peak-event revenue as representative of the full year. Warrnambool's commercial base moderates this risk compared to purely tourist-dependent markets, but the seasonal uplifts are still uplifts — not the baseline. Build the financial model on the resident and rural catchment demand, and treat the tourism events as the upside." },
              { name: 'Koroit summer versus winter gap', why: "Koroit's tourism market (Tower Hill Wildlife Reserve and the village dining scene) is strongest in spring and summer. The winter months rely more heavily on local residents and Warrnambool day-trippers for whom Koroit is a short drive. Operators who build genuine quality and a local village following find the seasonal variation manageable. Those who depend entirely on the tourist visitor without cultivating the local community face a real gap between October and April and June to September." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Warrnambool Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <WarrnamboolFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Warrnambool Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Warrnambool location?"
        subtitle="Run a free analysis on any Warrnambool or South West Coast address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/warrnambool/warrnambool-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Warrnambool CBD Analysis →</Link>
          <Link href="/analyse/warrnambool/port-fairy" style={{ color: C.brand, textDecoration: 'none' }}>Port Fairy Analysis →</Link>
          <Link href="/analyse/warrnambool/merrivale" style={{ color: C.brand, textDecoration: 'none' }}>Merrivale Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
