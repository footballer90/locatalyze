// app/(marketing)/analyse/alice-springs/page.tsx
// Alice Springs city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getAliceSpringsSuburb, getAliceSpringsSuburbs } from '@/lib/analyse-data/alice-springs'

function aScore(slug: string): number {
  return getAliceSpringsSuburb(slug)?.compositeScore ?? 0
}
function aVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getAliceSpringsSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Alice Springs — 2026 Location Guide',
  description:
    'Alice Springs business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Alice Springs suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/alice-springs' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Alice Springs — 2026 Location Guide',
    description: '7 Alice Springs suburbs ranked and scored. Rent benchmarks, foot traffic data, dry season tourism impact, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/alice-springs',
  },
}

const COMPARISON_ROWS = [
  { name: 'Alice Springs CBD', score: aScore('alice-springs-cbd'), verdict: aVerdict('alice-springs-cbd'), rent: '$1,800-$3,500', footTraffic: 'High (seasonal)', bestFor: 'Tourism-facing dining, cafe, dry season hospitality' },
  { name: 'Gillen', score: aScore('gillen'), verdict: aVerdict('gillen'), rent: '$800-$1,800', footTraffic: 'Medium', bestFor: 'Professional cafe, hospital precinct dining' },
  { name: 'Desert Springs', score: aScore('desert-springs'), verdict: aVerdict('desert-springs'), rent: '$1,200-$2,500', footTraffic: 'Medium', bestFor: 'Premium residential dining, golf precinct hospitality' },
  { name: 'Eastside', score: aScore('eastside'), verdict: aVerdict('eastside'), rent: '$700-$1,500', footTraffic: 'Low-Medium', bestFor: 'Community cafe, professional residential trade' },
  { name: 'Stuart', score: aScore('stuart'), verdict: aVerdict('stuart'), rent: '$600-$1,200', footTraffic: 'Low', bestFor: 'Growth suburb first-mover, highway passing trade' },
  { name: 'Larapinta', score: aScore('larapinta'), verdict: aVerdict('larapinta'), rent: '$600-$1,200', footTraffic: 'Low', bestFor: 'Value-oriented community food, essential services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Tourism Strip and CBD — Dry Season Strategy Required',
    description: "The May to September dry season creates a genuine tourism wave through Alice Springs CBD. Operators who model only the tourist peak will face the November to March summer collapse. Building a durable government and professional workforce customer base is what keeps CBD businesses alive year-round.",
    suburbs: [
      { name: 'Alice Springs CBD', slug: 'alice-springs-cbd', description: 'Todd Street Mall and the primary tourist precinct. Highest foot traffic in the Red Centre during the dry season. Government and public service workforce provides year-round anchor trade.', score: aScore('alice-springs-cbd'), verdict: aVerdict('alice-springs-cbd'), rentRange: '$1,800-$3,500/mo' },
    ],
  },
  {
    title: 'Professional and Health Precinct — Year-Round Stability',
    description: 'Gillen and Desert Springs serve the highest-income demographics in Alice Springs. The hospital precinct and premium residential catchment provide consistent year-round demand that is far less exposed to the tourism seasonal cycle.',
    suburbs: [
      { name: 'Gillen', slug: 'gillen', description: 'Southern suburb adjacent to Alice Springs Hospital. Higher-income professional demographic with year-round demand. Health precinct workforce sustains consistent lunchtime trade 365 days per year.', score: aScore('gillen'), verdict: aVerdict('gillen'), rentRange: '$800-$1,800/mo' },
      { name: 'Desert Springs', slug: 'desert-springs', description: 'Premium residential suburb around Alice Springs Golf Club. Under-served relative to the spending capacity of residents. Corporate and government delegation visitors add dry season uplift.', score: aScore('desert-springs'), verdict: aVerdict('desert-springs'), rentRange: '$1,200-$2,500/mo' },
    ],
  },
  {
    title: 'Residential Corridors — First-Mover Opportunities',
    description: 'Eastside and Stuart serve established and emerging residential communities. Low competition and low tourism — entirely dependent on building local community loyalty.',
    suburbs: [
      { name: 'Eastside', slug: 'eastside', description: 'Eastern residential corridor with professional government and health sector demographic. Genuine coffee gap — low competition, consistent professional catchment, no tourism seasonal swing.', score: aScore('eastside'), verdict: aVerdict('eastside'), rentRange: '$700-$1,500/mo' },
      { name: 'Stuart', slug: 'stuart', description: 'Southern growth fringe on the Stuart Highway corridor. New residential development underserved by quality hospitality. First-mover opportunity before competition arrives.', score: aScore('stuart'), verdict: aVerdict('stuart'), rentRange: '$600-$1,200/mo' },
    ],
  },
  {
    title: 'Western and Outer Residential',
    description: 'Larapinta and Braitling are value-oriented community markets. Real demand but modest revenue ceilings — suited to essential-service and community-focused operators who correctly calibrate to the catchment.',
    suburbs: [
      { name: 'Larapinta', slug: 'larapinta', description: 'Western suburb with mixed socioeconomic profile. Real demand for value-oriented community food concepts. Low competition, low rents, Larapinta Trail tourism adjacency in dry season.', score: aScore('larapinta'), verdict: aVerdict('larapinta'), rentRange: '$600-$1,200/mo' },
      { name: 'Braitling', slug: 'braitling', description: 'Northern residential corridor. Moderate demographic with genuine but limited daily hospitality demand. Very low rents make break-even achievable at modest revenue volumes.', score: aScore('braitling'), verdict: aVerdict('braitling'), rentRange: '$600-$1,200/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'How does the dry season affect Alice Springs businesses?',
    answer: "The May to September dry season is the primary tourism window for Alice Springs — mild temperatures, international and domestic visitor flow from the Uluru-Kata Tjuta and Kings Canyon corridor, and genuine foot traffic on Todd Street Mall. This creates real revenue uplifts for CBD operators during these five months. The trap is operators who project dry season revenue across the full year. November to March brings extreme heat that regularly exceeds 40 degrees Celsius, suppressing outdoor foot traffic and visitor numbers sharply. The government and public service workforce is the year-round trade anchor for CBD operators — this is the customer base that sustains business through the hot months when tourism drops.",
  },
  {
    question: 'Who is the Alice Springs customer?',
    answer: "Alice Springs has three primary customer segments. The government and public service workforce — federal agencies, NT government, health services, education — provides stable year-round demand with reliable income levels and consistent spending habits. This is the foundation of any CBD or inner-suburb business. Dry season tourists (May to September) generate genuine uplift for correctly positioned hospitality operators — international visitors heading to Uluru and Kings Canyon, domestic travellers, and backpackers create concentrated demand during the cooler months. Local professionals and residents in Gillen and Desert Springs form a premium community segment with higher per-visit spend than the broader population. Operators who build loyalty with the government workforce first, and treat tourism as a seasonal bonus, build the most durable Alice Springs businesses.",
  },
  {
    question: 'Is the Uluru tourism corridor relevant for Alice Springs businesses?',
    answer: "Uluru-Kata Tjuta National Park is approximately 450km from Alice Springs, which makes Alice Springs the primary gateway and staging post for visitors travelling to and from the Red Centre. A meaningful proportion of international and interstate Uluru visitors overnight in Alice Springs before or after the park visit, creating genuine hospitality demand in the CBD and at tourism-adjacent accommodation precincts. The dry season (May to September) concentrates this visitor flow into the best trading months. For correctly positioned CBD hospitality operators, the Uluru corridor is a real supplementary revenue source — it should be modelled as a dry season bonus on top of the year-round local customer base, not as the primary business case.",
  },
  {
    question: 'What are the main risks of operating in Alice Springs?',
    answer: "The extreme summer heat (November to March) is the primary structural risk — it creates genuine foot traffic suppression that no amount of good marketing can overcome. Operators who have not built sufficient year-round local trade before the summer slowdown face cash flow pressure. The second risk is the small market scale: Alice Springs has approximately 30,000 people, which creates absolute revenue ceilings lower than comparable-population regional centres in the eastern states. Remote location logistics add structural cost pressure that does not exist for operators in capital cities or coastal regional centres — freight, energy, and building maintenance costs are higher here as a feature of geography, not as a temporary condition. Understanding and pricing for these costs at the outset is essential.",
  },
  {
    question: 'What types of businesses work best in Alice Springs?',
    answer: "Businesses that succeed in Alice Springs share a characteristic: they serve the local government and professional workforce as their primary customer and treat the tourism season as an upside. Quality cafe and casual dining concepts that build daily loyalty with the public service workforce in the CBD or health precinct are the most resilient format. Specialty retail that serves the lifestyle needs of the professional and premium residential demographic performs well in Desert Springs and Gillen. Value-oriented food concepts that serve the essential community needs of residential suburbs face low competition and low rents. Tourism-dependent concepts that cannot sustain through the summer months are the highest-failure-rate category.",
  },
  {
    question: 'Is Desert Springs worth considering over the CBD?',
    answer: "Desert Springs is a genuinely under-served market relative to the spending capacity of its residents. The golf club positioning, the premium residential demographic, and the fact that quality hospitality options in the precinct are extremely limited mean that a well-positioned food and beverage concept in Desert Springs faces almost no direct competition and a customer base with above-average per-visit spend. The trade-off is absolute scale — the Desert Springs catchment is smaller than the CBD, which caps total revenue potential. For an operator who wants a loyal premium residential community customer base rather than the highest-possible volume, Desert Springs is a legitimate and underrated option.",
  },
  {
    question: 'What commercial rents should I expect in Alice Springs?',
    answer: "Alice Springs commercial rents are higher than most NT regional centres outside Darwin, due to the remote location cost structure, high building maintenance costs in an extreme climate, and limited new commercial development that would expand supply. CBD rates typically run from $1,800 to $3,500 per month for quality street-level retail and hospitality premises. Inner residential suburbs like Gillen and Eastside range from $700 to $1,800 per month. Outer and western residential suburbs run from $600 to $1,200 per month. These rents are modest by any capital city comparison but must be assessed against the revenue ceiling of a 30,000-person remote market and the higher structural operating costs of the Red Centre environment.",
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

function AliceSpringsFactorDirectory() {
  const suburbs = getAliceSpringsSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/alice-springs/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function AliceSpringsPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Alice Springs"
        citySlug="alice-springs"
        tagline="The Red Centre has a real hospitality market — but operators who model only the dry season tourist window will face the summer collapse. The government workforce sustains year-round trade. The Uluru corridor is the bonus."
        statChips={[
          { text: '7 suburbs scored — CBD to outer residential' },
          { text: 'Dry season May-Sep: genuine Uluru corridor tourism uplift for CBD operators' },
          { text: 'Government and health workforce: the year-round demand anchor' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NT Government commercial property data Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '30K', label: 'Alice Springs urban population — remote market that rewards specialists who serve the community', source: 'ABS 2024' },
              { value: 'May-Sep', label: 'Dry season tourism window — primary Uluru corridor visitor flow, mild temperatures, genuine foot traffic uplift', source: 'Tourism NT 2025' },
              { value: 'Uluru', label: 'Red Centre gateway — Alice Springs is the staging post for Uluru-Kata Tjuta and Kings Canyon visitors', source: 'Tourism NT 2025' },
              { value: '$1.8K', label: 'CBD commercial rents from $1,800/month — higher than most NT regional centres due to remote cost structure', source: 'NT Property Council Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Alice Springs Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Alice Springs is the commercial heart of Central Australia — a remote city of approximately 30,000 people that functions as the primary service centre for an enormous geographic region stretching from the NT-SA border to Tennant Creek. It is the gateway city for the Uluru-Kata Tjuta corridor, the staging point for Kings Canyon and the West MacDonnell Ranges, and the largest settlement in one of the most spectacular tourism landscapes in the world. This creates a real and recurring hospitality opportunity during the dry season (May to September) — but the mistake most new operators make is treating this tourism window as the business case rather than as the bonus.",
              "The market that sustains Alice Springs businesses year-round is the government and public service workforce. Federal government agencies, the Northern Territory government, NT Health, Charles Darwin University's Alice Springs campus, and the education sector create a stable, professional customer base with reliable incomes and consistent spending habits. This workforce is present 52 weeks per year and does not disappear when the temperature climbs above 40 degrees in summer. For CBD and inner-suburb operators, building daily loyalty with this demographic is the difference between a business that survives the November to March heat and one that does not.",
              "The remote location adds structural cost pressures that operators in coastal or capital city markets do not face. Freight costs, energy costs in an extreme climate, and building maintenance in a harsh environment all add to the operating cost base. These are permanent features of doing business in Central Australia — not temporary conditions that will improve. Operators who correctly model these costs at the outset build sustainable businesses; those who project their east coast operating costs onto an Alice Springs opportunity will be consistently surprised by the numbers.",
              "Be honest about the revenue ceiling. Alice Springs is a 30,000-person remote city. A well-run cafe on Todd Street builds a loyal community, does good dry season tourist trade, and generates a sustainable income for a correctly scaled operation. It is not the foundation of a multi-site hospitality group. The operators who thrive here understand the market they are entering — a high-character, high-impact environment where community businesses can genuinely succeed at the right scale.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Todd Street CBD has the highest volume during the dry season. Gillen is the strongest year-round cafe market — the hospital precinct workforce and higher-income residential base create daily loyalty without the seasonal swing. Desert Springs is the premium under-served opportunity for a quality specialty coffee concept.", best: ['Gillen', 'Alice Springs CBD', 'Desert Springs'] },
              { type: 'Full-Service Restaurants', insight: "The Alice Springs CBD is the primary restaurant market — tourist foot traffic in season, government and event dining year-round. Desert Springs suits a quality licensed dining concept serving the premium residential and golf club catchment. Gillen works for quality casual dining serving the health precinct and residential community.", best: ['Alice Springs CBD', 'Desert Springs', 'Gillen'] },
              { type: 'Retail (Independent)', insight: "Todd Street Mall CBD delivers the most consistent year-round retail foot traffic in Alice Springs. Desert Springs suits independent specialty retail targeting the premium residential demographic. Eastside offers a first-mover position for a carefully targeted community retail concept.", best: ['Alice Springs CBD', 'Desert Springs', 'Eastside'] },
              { type: 'Fitness & Wellness', insight: "The professional demographics in Gillen and Desert Springs have strong demand for allied health, boutique fitness, and wellness services that go under-served in Alice Springs. These catchments have income levels and lifestyle expectations to support quality wellness businesses at sustainable price points.", best: ['Gillen', 'Desert Springs', 'Eastside'] },
              { type: 'Tourism-Facing Concepts', insight: "The Alice Springs CBD is the only genuine tourism market in the city. Operators who want to capture the Uluru corridor visitor spend should position on or near Todd Street Mall, where the May to September tourist flow is concentrated. Must plan for the November to March low season.", best: ['Alice Springs CBD'] },
              { type: 'Community and Essential Services', insight: "Larapinta, Braitling, and Stuart all have genuine community demand for affordable convenience food and essential hospitality that is currently underserved. Very low rents, first-mover positioning, and real daily community need — suited to operators who want a stable local business with no tourism complexity.", best: ['Larapinta', 'Braitling', 'Stuart'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Alice Springs Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Alice Springs CBD', slug: 'alice-springs-cbd', verdict: aVerdict('alice-springs-cbd'), score: aScore('alice-springs-cbd'), rentFrom: '$1,800/mo', body: "Todd Street Mall is the primary tourist and commercial strip of the Red Centre. Dry season (May to September) generates genuine visitor trade from the Uluru corridor. The government and public service workforce provides the year-round trade anchor. Build your local customer base first — the tourist season adds on top." },
              { rank: 2, name: 'Gillen', slug: 'gillen', verdict: aVerdict('gillen'), score: aScore('gillen'), rentFrom: '$800/mo', body: "Southern suburb adjacent to Alice Springs Hospital. The health precinct workforce and higher-income professional residential base create the most consistent year-round demand in Alice Springs. Quality cafe and casual dining concepts find a loyal professional community audience here without CBD competitive pressure." },
              { rank: 3, name: 'Desert Springs', slug: 'desert-springs', verdict: aVerdict('desert-springs'), score: aScore('desert-springs'), rentFrom: '$1,200/mo', body: "Premium residential suburb around Alice Springs Golf Club — the highest-income catchment in the city. Remarkably under-served by quality hospitality. Corporate visitors and government delegations add dry season uplift. The community loyalty potential is high for a correctly positioned concept." },
              { rank: 4, name: 'Eastside', slug: 'eastside', verdict: aVerdict('eastside'), score: aScore('eastside'), rentFrom: '$700/mo', body: "Eastern residential corridor with a professional government and health sector demographic. Almost no direct competition for quality specialty coffee or community cafe. Year-round consistent trade with no tourism seasonal swing — entirely reliant on building community loyalty." },
              { rank: 5, name: 'Stuart', slug: 'stuart', verdict: aVerdict('stuart'), score: aScore('stuart'), rentFrom: '$600/mo', body: "Southern growth fringe on the Stuart Highway corridor. New residential development is underserved by quality hospitality. First-mover opportunity before competition arrives. The highway position adds modest passing trade from inter-city travellers." },
              { rank: 6, name: 'Larapinta', slug: 'larapinta', verdict: aVerdict('larapinta'), score: aScore('larapinta'), rentFrom: '$600/mo', body: "Western suburb with a mixed socioeconomic profile. Real demand for value-oriented community food concepts. Very low competition, very low rents. The Larapinta Trail hiking corridor adds dry season tourism adjacency for correctly positioned operators." },
              { rank: 7, name: 'Braitling', slug: 'braitling', verdict: aVerdict('braitling'), score: aScore('braitling'), rentFrom: '$600/mo', body: "Northern residential corridor. Moderate demographic with genuine but modest daily hospitality demand. The lowest rent structure in the Alice Springs belt makes break-even achievable at conservative revenue projections for operators who serve the local community need." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/alice-springs/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Alice Springs address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Alice Springs address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FEE2E2', color: '#7F1D1D', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Alice Springs address
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Alice Springs Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="alice-springs" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Alice Springs Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'CBD vs Gillen', body: "The CBD has the highest volume potential during the dry season tourist window but requires operators to manage the summer revenue collapse with year-round local trade. Gillen has no tourist uplift but delivers far more consistent year-round demand from the hospital precinct and professional residential base. For operators who want seasonal excitement and peak revenue in the tourist window, the CBD. For operators who want more predictable year-round trade with a higher-income community customer, Gillen is the lower-risk choice." },
              { title: 'Gillen vs Desert Springs', body: "Both serve professional, higher-income demographics. Gillen has the hospital precinct workforce as a daily captive customer — 365 days per year, reliable lunchtime trade, above-average spend. Desert Springs has the premium residential golf club catchment — fewer customers but possibly higher per-visit spend, and virtually no direct competition for a quality food concept. Gillen for volume consistency; Desert Springs for premium community positioning with almost no competitive pressure." },
              { title: 'CBD vs Residential Suburbs', body: "The CBD delivers the most foot traffic in Alice Springs but comes with higher rents, summer revenue decline, and competitive pressure from existing operators. Residential suburbs (Eastside, Gillen, Stuart) deliver more consistent year-round trade from local catchments at materially lower rents. The financial model for a community-positioned residential suburb concept is often more workable than a CBD concept that depends on seasonal tourism to justify the higher rent." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Risk Reality — What Every Alice Springs Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether an Alice Springs business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Summer heat dependency trap', why: "November to March in Alice Springs routinely exceeds 40 degrees Celsius, suppressing outdoor foot traffic sharply. CBD operators who have not built genuine year-round local trade before the heat arrives face a real cash flow problem during these five months. Plan for the summer low first; treat the dry season as the upside." },
              { name: 'Modelling tourist revenue across 12 months', why: "The May to September tourist window generates visible foot traffic and tourism revenue that can mislead operators into projecting this level of trade across the year. July to September accounts for only three months of the operating year — what happens during the other nine months must be fully costed and planned." },
              { name: 'Underestimating remote cost structures', why: "Freight, energy, and maintenance costs in Central Australia are structurally higher than coastal markets. This is permanent, not temporary. Operators who model their Alice Springs business on east coast unit economics without adjusting for the remote cost premium will consistently face margin erosion that was avoidable with correct up-front modelling." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Alice Springs Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <AliceSpringsFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Alice Springs Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Alice Springs location?"
        subtitle="Run a free analysis on any Alice Springs address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>All Cities</Link>
          <Link href="/analyse/alice-springs/alice-springs-cbd" style={{ color: C.brand, textDecoration: 'none' }}>CBD Analysis</Link>
          <Link href="/analyse/alice-springs/gillen" style={{ color: C.brand, textDecoration: 'none' }}>Gillen Analysis</Link>
          <Link href="/analyse/alice-springs/desert-springs" style={{ color: C.brand, textDecoration: 'none' }}>Desert Springs Analysis</Link>
        </div>
      </section>
    </div>
  )
}
