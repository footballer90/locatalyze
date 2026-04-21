// app/(marketing)/analyse/hervey-bay/page.tsx
// Hervey Bay city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getHerveyBaySuburb, getHerveyBaySuburbs } from '@/lib/analyse-data/hervey-bay'

function hScore(slug: string): number {
  return getHerveyBaySuburb(slug)?.compositeScore ?? 0
}
function hVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getHerveyBaySuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Hervey Bay — 2026 Location Guide',
  description:
    'Hervey Bay business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Hervey Bay suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/hervey-bay' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Hervey Bay — 2026 Location Guide',
    description: '7 Hervey Bay suburbs ranked and scored. Rent benchmarks, foot traffic data, whale-watching season impact, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/hervey-bay',
  },
}

const COMPARISON_ROWS = [
  { name: 'Torquay', score: hScore('torquay'), verdict: hVerdict('torquay'), rent: '$1,500–$3,500', footTraffic: 'High (seasonal)', bestFor: 'Ocean-facing dining, café, whale season tourism' },
  { name: 'Urangan', score: hScore('urangan'), verdict: hVerdict('urangan'), rent: '$1,500–$3,000', footTraffic: 'High (seasonal)', bestFor: 'Marina hospitality, whale-watching visitor trade' },
  { name: 'Pialba', score: hScore('pialba'), verdict: hVerdict('pialba'), rent: '$1,500–$3,500', footTraffic: 'High', bestFor: 'Retail, casual dining, essential services' },
  { name: 'Scarness', score: hScore('scarness'), verdict: hVerdict('scarness'), rent: '$1,500–$3,000', footTraffic: 'Medium-High', bestFor: 'Lifestyle café, casual dining, Esplanade dining' },
  { name: 'Eli Waters', score: hScore('eli-waters'), verdict: hVerdict('eli-waters'), rent: '$1,200–$2,500', footTraffic: 'Medium', bestFor: 'Family café, convenience food, new residential' },
  { name: 'Kawungan', score: hScore('kawungan'), verdict: hVerdict('kawungan'), rent: '$1,000–$2,000', footTraffic: 'Low-Medium', bestFor: 'Essential services, convenience food' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Esplanade and Tourism Strip — Seasonal Strategy Required',
    description: "The whale-watching season (July to October) creates 40–60% revenue uplifts. Operators who model only the season will fail November to June. Building genuine local loyalty is what separates the businesses that survive from those that don't.",
    suburbs: [
      { name: 'Torquay', slug: 'torquay', description: "Ocean-facing Esplanade strip. Premium waterfront dining with whale-watching season uplift. Local residential base moderates — but does not eliminate — the off-season softness.", score: hScore('torquay'), verdict: hVerdict('torquay'), rentRange: '$1,500–$3,500/mo' },
      { name: 'Urangan', slug: 'urangan', description: 'Marina whale-watching departure point. Highest tourism concentration in Hervey Bay. Lean months (November to June) require strong local trade to survive.', score: hScore('urangan'), verdict: hVerdict('urangan'), rentRange: '$1,500–$3,000/mo' },
      { name: 'Scarness', slug: 'scarness', description: 'Central Esplanade lifestyle dining market. Retirement and sea-change demographic with higher per-visit spend. More balanced year-round than Urangan.', score: hScore('scarness'), verdict: hVerdict('scarness'), rentRange: '$1,500–$3,000/mo' },
    ],
  },
  {
    title: 'Commercial Hub — Year-Round Trade',
    description: 'Pialba delivers the most consistent year-round trade in Hervey Bay through the Central shopping precinct. Higher competition but more reliable baseline demand.',
    suburbs: [
      { name: 'Pialba', slug: 'pialba', description: "Hervey Bay's main commercial hub. Central shopping centre anchor delivers the highest year-round retail foot traffic. Competition is 6/10 — differentiation required.", score: hScore('pialba'), verdict: hVerdict('pialba'), rentRange: '$1,500–$3,500/mo' },
    ],
  },
  {
    title: 'Residential Growth — First-Mover Opportunities',
    description: 'Eli Waters and Kawungan serve the growing residential western and southern corridors. Low competition and low tourism — entirely dependent on building local community loyalty.',
    suburbs: [
      { name: 'Eli Waters', slug: 'eli-waters', description: 'Southern new residential estate. Growing family demographic underserved by quality hospitality. First-mover window open for correctly positioned operators.', score: hScore('eli-waters'), verdict: hVerdict('eli-waters'), rentRange: '$1,200–$2,500/mo' },
      { name: 'Kawungan', slug: 'kawungan', description: 'Western residential corridor. Stable community, modest demand ceiling, lowest rents in the coastal belt. Suits essential-service and convenience concepts.', score: hScore('kawungan'), verdict: hVerdict('kawungan'), rentRange: '$1,000–$2,000/mo' },
    ],
  },
  {
    title: 'Inland Satellite',
    description: 'Howard is a small agricultural service town with real scale limitations. Not a general hospitality opportunity — suits community-focused operators who explicitly serve this rural catchment.',
    suburbs: [
      { name: 'Howard', slug: 'howard', description: 'Inland satellite 40km south. Small agricultural community with genuine demand limitations. Very low rents — viable for essential-service concepts at correct price calibration.', score: hScore('howard'), verdict: hVerdict('howard'), rentRange: '$700–$1,800/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'How does the whale-watching season affect Hervey Bay businesses?',
    answer: "The whale-watching season (July to October) is Hervey Bay's primary tourism driver and creates 40–60% revenue uplifts for Esplanade and Marina operators during those four months. The failure pattern is operators who model whale season revenue as representative of the full year and then discover that November to June is materially softer. Operators who succeed in Hervey Bay treat the whale season as an upside that supplements year-round local trade — not the foundation of their business case. Building genuine community loyalty with the resident and sea-change demographic is what sustains trade through the quieter eight months.",
  },
  {
    question: 'Is the Torquay Esplanade worth the higher rent?',
    answer: "Torquay's ocean-facing Esplanade commands a premium over inland Hervey Bay positions, but the rent premium is modest by any capital city comparison — $1,500–$3,500/month for a waterfront position is genuinely good value if you can justify the location. The question is not whether the rent is affordable but whether your concept is suited to the market: waterfront dining in Hervey Bay works for quality-casual operators who serve both tourists in season and the local retirement and sea-change demographic year-round. Generic concepts that rely only on the tourist wave underperform on a 12-month basis.",
  },
  {
    question: "Who is the Hervey Bay customer?",
    answer: "Hervey Bay has three primary customer segments. The sea-change and retirement demographic — people who have moved to Hervey Bay for the lifestyle — has high per-visit spend and strong local loyalty once operators earn it. This segment sustains year-round trade at above-average ticket values and is the foundation of any successful Hervey Bay business. Tourist and whale-watching visitors generate seasonal uplifts in July to October and around Fraser Island (K'gari) tourism. Local families and younger residents form the convenience and casual dining segment. The operators who thrive serve the sea-change demographic first and treat tourists as a seasonal bonus.",
  },
  {
    question: 'Is Fraser Island tourism relevant for Hervey Bay businesses?',
    answer: "Fraser Island (K'gari) tourism generates a significant flow of visitors through Hervey Bay as the primary mainland gateway for island access. This creates genuine hospitality demand — visitors overnight in Hervey Bay before and after island trips, often dining in Torquay and Pialba. The K'gari visitor season broadly aligns with the school holiday calendar, providing some revenue uplifts in January, April, July, and September. This is a secondary revenue layer rather than the primary market — Fraser Island visitors are often in transit rather than specifically seeking Hervey Bay hospitality experiences.",
  },
  {
    question: 'What are the main risks of operating in Hervey Bay?',
    answer: "Seasonality is the primary structural risk: the November to June period is materially softer than July to October, and operators who have not built sufficient local trade to sustain this period face cash flow pressure. The second risk is market scale — at 60,000 people, Hervey Bay has a genuine revenue ceiling that is lower than larger regional centres. Operators who project Sunshine Coast or Gold Coast trade volumes will be consistently disappointed. The third risk is over-reliance on tourism: Hervey Bay is a small market that rewards specialists who serve the community, not generic tourist-facing concepts that disappear with the off-season.",
  },
  {
    question: 'What types of businesses work best in Hervey Bay?',
    answer: "Businesses that succeed in Hervey Bay share a common characteristic: they serve the local community as their primary customer and treat tourism as an upside. The strongest format is quality-casual hospitality with genuine local community positioning — a café or restaurant that becomes a neighbourhood institution for residents while capturing tourist trade during the season. Specialty retail that serves the lifestyle and retirement demographic performs well in Pialba and Scarness. Businesses that depend entirely on the tourist season and have no genuine local following are exposed to the November to June revenue cliff every year.",
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

function HerveyBayFactorDirectory() {
  const suburbs = getHerveyBaySuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/hervey-bay/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function HerveyBayPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Hervey Bay"
        citySlug="hervey-bay"
        tagline="Australia's whale watching capital has a genuine hospitality market — but operators who model only whale season will fail. The sea-change demographic sustains year-round trade. The tourist season is the bonus."
        statChips={[
          { text: '7 suburbs scored — Esplanade to inland residential' },
          { text: 'Whale season July–October: 40–60% revenue uplift for Esplanade operators' },
          { text: "Fraser Island (K'gari) gateway tourism year-round" },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, REIQ Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '60K', label: "Hervey Bay urban population — small market that rewards specialists", source: 'ABS 2024' },
              { value: 'Jul–Oct', label: "Whale watching season — primary tourism driver with 40–60% revenue uplift on the Esplanade", source: 'Tourism Hervey Bay 2025' },
              { value: "K'gari", label: 'Fraser Island gateway — year-round island visitor traffic through the city', source: 'Tourism Hervey Bay 2025' },
              { value: '$1.5K', label: 'Esplanade commercial rents from $1,500/month — low entry cost for waterfront positions', source: 'REIQ Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Hervey Bay Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Hervey Bay is Australia's whale watching capital — the only place in the world where humpback whales stop to rest during their annual migration, rather than simply passing through. This creates four months of concentrated tourism from July to October that generates genuine hospitality revenue on the Esplanade and at Urangan Marina. The mistake most operators make is using whale season revenue to project a business case for the remaining eight months.",
              "The market that sustains Hervey Bay businesses year-round is not the tourist market — it is the sea-change and retirement demographic that has made Hervey Bay one of Queensland's fastest-growing lifestyle destinations. People who have moved to Hervey Bay from Brisbane, Sydney, and Melbourne bring above-average household incomes, strong food culture expectations, and a willingness to spend on quality hospitality. This demographic drives consistent year-round trade at above-average ticket values. It is also the demographic that most new Hervey Bay operators fail to cultivate because they are distracted by the more obvious tourist opportunity.",
              "The practical implication is location strategy. Operators who position on the Esplanade in Torquay or Scarness have access to both the tourist wave and the sea-change residential base — the most balanced demand profile in the city. Operators at Urangan Marina have the highest tourism exposure and the most pronounced off-season softness. Pialba, the commercial hub, delivers the most consistent year-round foot traffic through the Central shopping precinct with lower seasonality than the Esplanade.",
              "Be honest about market scale. Hervey Bay is a 60,000-person city. A well-run café in Torquay builds a loyal community, does excellent whale season trade, and generates sustainable income for a well-managed small business. It does not scale to a multi-site hospitality group. Operators who understand this build something durable. Those who expect growth-stage economics from a small regional market will cycle through Hervey Bay looking for a business case that the market cannot support.",
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
              { type: 'Cafés & Specialty Coffee', insight: "Torquay and Scarness are the strongest café markets — ocean-facing positioning, lifestyle dining demographic, and whale season uplift. Pialba suits volume-focused café operators. Eli Waters offers a first-mover community position in a growing residential estate without the seasonal complexity.", best: ['Torquay', 'Scarness', 'Pialba'] },
              { type: 'Full-Service Restaurants', insight: "Torquay Esplanade is Hervey Bay's primary restaurant market — ocean views, higher average spend, and the tourism wave in season. Urangan Marina works for operators who can maximise whale season revenue and sustain on lower local trade outside it. Scarness is the mid-tier option with a more balanced demand profile.", best: ['Torquay', 'Urangan', 'Scarness'] },
              { type: 'Retail (Independent)', insight: "Pialba's Central shopping precinct delivers the most consistent year-round retail foot traffic. Torquay suits lifestyle and tourism-adjacent retail in season. Scarness suits independent specialty retail targeting the sea-change and retirement demographic.", best: ['Pialba', 'Torquay', 'Scarness'] },
              { type: 'Fitness & Wellness', insight: "The retirement and sea-change demographic in Scarness and Torquay has strong demand for allied health, boutique fitness, and wellness services. Pialba suits high-volume fitness formats. Eli Waters is an emerging opportunity as the residential base grows.", best: ['Scarness', 'Torquay', 'Pialba'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Urangan Marina is the highest-tourism-exposure location in Hervey Bay. Whale-watching tour operators, charter boats, and Fraser Island ferry services create a captive tourism environment for correctly positioned food and retail concepts. Whale season only — must have a plan for November to June.", best: ['Urangan', 'Torquay'] },
              { type: 'Community and Convenience', insight: "Eli Waters and Kawungan serve growing and established residential communities that are underserved by quality convenience food and casual dining. Low rents, low competition, and a genuine community need that operators can fill by becoming local institutions.", best: ['Eli Waters', 'Kawungan'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Hervey Bay Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Torquay', slug: 'torquay', verdict: hVerdict('torquay'), score: hScore('torquay'), rentFrom: '$1,500/mo', body: "Ocean-facing Esplanade strip with the strongest balance of tourism and residential demand in Hervey Bay. Whale season (July to October) creates genuine peak revenue. The sea-change demographic provides year-round trade from a customer base with above-average spend. Build the local loyal base first — the tourist wave adds on top." },
              { rank: 2, name: 'Urangan', slug: 'urangan', verdict: hVerdict('urangan'), score: hScore('urangan'), rentFrom: '$1,500/mo', body: "Marina departure point for all whale-watching tours and Fraser Island services. The highest tourism concentration in Hervey Bay. July to October peak revenue can be very strong. November to June requires a genuine local trade plan — operators without one face real cash flow pressure in the eight off-peak months." },
              { rank: 3, name: 'Pialba', slug: 'pialba', verdict: hVerdict('pialba'), score: hScore('pialba'), rentFrom: '$1,500/mo', body: "Hervey Bay's commercial hub with the most consistent year-round trade. Central shopping centre anchor delivers reliable baseline foot traffic that does not collapse outside the tourist season. Competition is the highest in the city — generic concepts are outcompeted; quality independents find loyal customers." },
              { rank: 4, name: 'Scarness', slug: 'scarness', verdict: hVerdict('scarness'), score: hScore('scarness'), rentFrom: '$1,500/mo', body: "Central Esplanade lifestyle dining market. The retirement and sea-change demographic here has higher per-visit spend and stronger community loyalty habits than the broader Hervey Bay population. More balanced year-round trade than Urangan. The right lifestyle café or casual dining concept builds a very loyal local following." },
              { rank: 5, name: 'Eli Waters', slug: 'eli-waters', verdict: hVerdict('eli-waters'), score: hScore('eli-waters'), rentFrom: '$1,200/mo', body: "Southern new residential estate with a growing family demographic. Quality café and casual dining concepts are genuinely absent. First-mover operators who establish community loyalty capture the market before competition arrives. Pure residential trade — no tourism seasonality." },
              { rank: 6, name: 'Kawungan', slug: 'kawungan', verdict: hVerdict('kawungan'), score: hScore('kawungan'), rentFrom: '$1,000/mo', body: "Western residential corridor. Stable community with modest demand ceiling and the lowest rents in the coastal belt. Suits essential-service and convenience-focused concepts that serve the resident community reliably. Not a destination hospitality market." },
              { rank: 7, name: 'Howard', slug: 'howard', verdict: hVerdict('howard'), score: hScore('howard'), rentFrom: '$700/mo', body: "Inland agricultural satellite 40km south. Genuine scale limitations — a small rural town with a real but modest demand base. Viable for community-oriented essential services at the lowest rents in the region. Not a hospitality growth market." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/hervey-bay/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #083344 0%, #0891B2 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Hervey Bay address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Hervey Bay address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#CFFAFE', color: '#083344', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Hervey Bay address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Hervey Bay Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="hervey-bay" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Hervey Bay Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Torquay vs Urangan', body: "Torquay has a better balance of tourist and residential demand — the sea-change demographic resident base moderates the off-season revenue cliff better than Urangan's higher tourism dependency. Urangan has higher peak-season revenue during whale watching but steeper off-season softness. For operators who can maximise and manage the seasonal cycle, Urangan's peak revenue is higher. For operators who want more year-round predictability, Torquay is the lower-risk choice." },
              { title: 'Torquay vs Scarness', body: "Both are Esplanade lifestyle dining markets. Torquay has the stronger tourism overlay — ocean-facing positioning and whale season draw — which lifts peak revenue. Scarness has a slightly older, more established sea-change demographic that delivers consistent high per-visit spend with less seasonal variation. For operators who can execute premium waterfront hospitality, Torquay. For those who want a reliable community-dining business with less seasonal complexity, Scarness." },
              { title: 'Pialba vs Esplanade suburbs', body: "Pialba is the year-round commercial hub choice. Central shopping centre foot traffic is consistent across 52 weeks with modest seasonal variation — there is no whale season cliff to navigate. The trade-off is that Pialba lacks the premium lifestyle positioning of the Esplanade, limiting the per-visit spend ceiling. Esplanade suburbs (Torquay, Scarness) deliver higher average ticket size but require a genuine plan for the eight months outside whale season." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Seasonality Reality — What Every Hervey Bay Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether a Hervey Bay business succeeds or fails on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Whale season dependency trap', why: "July to October is genuinely exceptional for Esplanade and Marina operators. The trap is operators who project this revenue across all 12 months. November to June accounts for 67% of the calendar year. Operators without a year-round local trade strategy face cash flow pressure for two-thirds of their operating year. Plan November to June first; treat July to October as the upside." },
              { name: 'Failing to build the local base', why: "The sea-change and retirement demographic is the economic foundation of any successful Hervey Bay business. These customers spend consistently, have genuine loyalty when operators earn it, and provide the year-round revenue that whale season visitors cannot. Operators who treat local residents as a backup for the off-season — rather than as their primary customer — fail to build the loyalty that makes Hervey Bay businesses sustainable." },
              { name: 'Urangan without an off-season plan', why: "Urangan Marina is exceptional from July to October. From November to June, marina activity drops significantly and the local residential base is smaller than Torquay or Scarness. Operators in Urangan without a clear local community strategy or a complementary revenue stream face genuinely lean months. The location works — the failure mode is planning failure, not location failure." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Hervey Bay Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <HerveyBayFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Hervey Bay Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Hervey Bay location?"
        subtitle="Run a free analysis on any Hervey Bay address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/hervey-bay/torquay" style={{ color: C.brand, textDecoration: 'none' }}>Torquay Analysis →</Link>
          <Link href="/analyse/hervey-bay/urangan" style={{ color: C.brand, textDecoration: 'none' }}>Urangan Analysis →</Link>
          <Link href="/analyse/hervey-bay/pialba" style={{ color: C.brand, textDecoration: 'none' }}>Pialba Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
