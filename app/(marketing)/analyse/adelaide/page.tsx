// app/(marketing)/analyse/adelaide/page.tsx
// Adelaide city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getAdelaideSuburb, getAdelaideSuburbs } from '@/lib/analyse-data/adelaide'

function aScore(slug: string): number {
  return getAdelaideSuburb(slug)?.compositeScore ?? 0
}
function aVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getAdelaideSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Adelaide — 2026 Location Guide',
  description:
    'Adelaide business location guide 2026. 22 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Adelaide suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/adelaide' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Adelaide — 2026 Location Guide',
    description: '22 Adelaide suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/adelaide',
  },
}

const COMPARISON_ROWS = [
  { name: 'Norwood', score: aScore('norwood'), verdict: aVerdict('norwood'), rent: '$4,500–$8,500', footTraffic: 'Very High', bestFor: 'Premium hospitality, specialty café, boutique retail' },
  { name: 'Prospect', score: aScore('prospect'), verdict: aVerdict('prospect'), rent: '$2,500–$4,500', footTraffic: 'High', bestFor: 'Independent café, casual dining, creative retail' },
  { name: 'North Adelaide', score: aScore('north-adelaide'), verdict: aVerdict('north-adelaide'), rent: '$4,000–$7,500', footTraffic: 'High', bestFor: 'Restaurants, café, professional services' },
  { name: 'Glenelg', score: aScore('glenelg'), verdict: aVerdict('glenelg'), rent: '$4,000–$7,000', footTraffic: 'High (seasonal)', bestFor: 'Hospitality, beach retail, tourism concepts' },
  { name: 'Burnside', score: aScore('burnside'), verdict: aVerdict('burnside'), rent: '$4,000–$7,000', footTraffic: 'Medium-High', bestFor: 'Premium café, specialty retail, allied health' },
  { name: 'Adelaide CBD', score: aScore('adelaide-cbd'), verdict: aVerdict('adelaide-cbd'), rent: '$8,000–$22,000', footTraffic: 'Very High', bestFor: 'Premium dining, high-volume hospitality' },
  { name: 'Port Adelaide', score: aScore('port-adelaide'), verdict: aVerdict('port-adelaide'), rent: '$1,800–$3,500', footTraffic: 'Medium', bestFor: 'Creative concepts, café, casual dining' },
  { name: 'Thebarton', score: aScore('thebarton'), verdict: aVerdict('thebarton'), rent: '$1,500–$3,000', footTraffic: 'Medium', bestFor: 'Brewery, creative, specialty food' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium Inner East — High Reward, High Entry',
    description: "Adelaide's benchmark hospitality strips. Strong customer quality, but rents and competition demand an operator who knows exactly what they're building.",
    suburbs: [
      { name: 'Norwood', slug: 'norwood', description: "Adelaide's best independent strip. The Parade delivers the highest pedestrian density in SA outside the CBD.", score: aScore('norwood'), verdict: aVerdict('norwood'), rentRange: '$4,500–$8,500/mo' },
      { name: 'North Adelaide', slug: 'north-adelaide', description: "O'Connell Street and Melbourne Street — the city's top restaurant precinct with strong AFL and event uplift.", score: aScore('north-adelaide'), verdict: aVerdict('north-adelaide'), rentRange: '$4,000–$7,500/mo' },
      { name: 'Unley', slug: 'unley', description: 'Highest-income suburban strip. Consistent professional repeat trade, low seasonality.', score: aScore('unley'), verdict: aVerdict('unley'), rentRange: '$4,000–$7,000/mo' },
      { name: 'Kent Town', slug: 'kent-town', description: 'CBD-adjacent at suburban rent. Captures professional lunch and Fringe festival spillover.', score: aScore('kent-town'), verdict: aVerdict('kent-town'), rentRange: '$3,500–$6,500/mo' },
    ],
  },
  {
    title: 'Growth Strips — Best Risk/Return',
    description: "Suburbs where demand is proven but rents haven't fully caught up. The smart operator window is open but closing.",
    suburbs: [
      { name: 'Prospect', slug: 'prospect', description: "Adelaide's fastest-growing independent strip. Melbourne café culture at 50% of Norwood's rent.", score: aScore('prospect'), verdict: aVerdict('prospect'), rentRange: '$2,500–$4,500/mo' },
      { name: 'Kensington', slug: 'kensington', description: 'Norwood-quality demographic at lower competition and lower rent. An underrated inner-east entry.', score: aScore('kensington'), verdict: aVerdict('kensington'), rentRange: '$3,000–$5,500/mo' },
      { name: 'Hyde Park', slug: 'hyde-park', description: 'High-income residential, low seasonality. Strong repeat trade, moderate entry point.', score: aScore('hyde-park'), verdict: aVerdict('hyde-park'), rentRange: '$3,500–$6,000/mo' },
      { name: 'Goodwood', slug: 'goodwood', description: 'Norwood-adjacent demographic at 35% lower rent. Loyal local base with growth trajectory.', score: aScore('goodwood'), verdict: aVerdict('goodwood'), rentRange: '$2,500–$4,500/mo' },
      { name: 'Burnside', slug: 'burnside', description: "Adelaide's highest average income suburb. Underserved by quality independents — supply gap is real.", score: aScore('burnside'), verdict: aVerdict('burnside'), rentRange: '$4,000–$7,000/mo' },
    ],
  },
  {
    title: 'Beachside — Seasonal Strategy Required',
    description: 'Strong peak-season revenue, genuine off-season risk. These markets reward operators with dual income streams: tourist peak plus local loyalty.',
    suburbs: [
      { name: 'Glenelg', slug: 'glenelg', description: "SA's top tourism precinct. Summer revenue is exceptional — winter requires a strong local repeat base.", score: aScore('glenelg'), verdict: aVerdict('glenelg'), rentRange: '$4,000–$7,000/mo' },
      { name: 'Henley Beach', slug: 'henley-beach', description: 'More balanced than Glenelg — strong local residential reduces the winter cliff.', score: aScore('henley-beach'), verdict: aVerdict('henley-beach'), rentRange: '$3,000–$5,500/mo' },
      { name: 'Semaphore', slug: 'semaphore', description: 'Community-first beachside market. Loyal locals moderate seasonal risk.', score: aScore('semaphore'), verdict: aVerdict('semaphore'), rentRange: '$2,000–$4,000/mo' },
      { name: 'Glenelg North', slug: 'glenelg-north', description: 'Beachside residential at lower rent than Glenelg proper. Growing and underserved.', score: aScore('glenelg-north'), verdict: aVerdict('glenelg-north'), rentRange: '$2,800–$5,000/mo' },
    ],
  },
  {
    title: 'Emerging — Early-Mover Opportunity',
    description: 'Gentrifying precincts where rents are low and first-mover advantage is still available.',
    suburbs: [
      { name: 'Bowden', slug: 'bowden', description: 'Urban renewal precinct. 1,800+ new dwellings, growing young professional population, below-market leases.', score: aScore('bowden'), verdict: aVerdict('bowden'), rentRange: '$2,000–$3,800/mo' },
      { name: 'Thebarton', slug: 'thebarton', description: 'Creative and brewery precinct. Lowest inner-ring rents with a growing young professional demographic.', score: aScore('thebarton'), verdict: aVerdict('thebarton'), rentRange: '$1,500–$3,000/mo' },
      { name: 'Port Adelaide', slug: 'port-adelaide', description: 'Gentrification wave underway. Heritage waterfront, lowest inner-ring rents, 3–5 year growth trajectory.', score: aScore('port-adelaide'), verdict: aVerdict('port-adelaide'), rentRange: '$1,800–$3,500/mo' },
      { name: 'Mount Barker', slug: 'mount-barker', description: "Adelaide Hills' fastest-growing satellite. Professional demographics arriving ahead of hospitality supply.", score: aScore('mount-barker'), verdict: aVerdict('mount-barker'), rentRange: '$1,800–$3,500/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a café in Adelaide?',
    answer: "Norwood (The Parade) is Adelaide's benchmark café market — the highest pedestrian density outside the CBD, a national track record of successful independents, and a customer demographic that spends consistently. The honest caveat: competition is elevated and rents have risen to $6,000–$9,000/month. The better value play for 2026 is Prospect Road, where Melbourne-calibre café demand exists at 50% of Norwood's rent.",
  },
  {
    question: 'How do Adelaide commercial rents compare to Sydney and Melbourne?',
    answer: "Adelaide rents are 40–60% lower than equivalent Sydney positions and 30–45% lower than Melbourne. A prime Norwood position at $7,000/month would cost $12,000–$15,000 in Fitzroy or Surry Hills. This lower entry cost is Adelaide's structural advantage for independent operators — break-even is achievable at materially lower revenue thresholds, reducing first-year failure risk significantly.",
  },
  {
    question: 'Is Adelaide CBD worth considering for an independent restaurant or café?',
    answer: "The Rundle Street precinct (East End) is genuinely viable for premium concepts — rent at $10,000–$18,000/month is expensive for Adelaide but 40% below comparable Sydney positions. The CBD's tourism draw (Fringe, WOMADelaide, arts festivals) adds revenue uplifts unavailable in suburban markets. For independent operators without premium pricing or high volume, suburban strips like Norwood or Prospect offer better risk-adjusted economics.",
  },
  {
    question: 'What makes Prospect Road worth considering in 2026?',
    answer: "Prospect Road is where the demographic curve and the rent curve have not yet met. A younger professional population with Melbourne-equivalent café expectations is living in a suburb where rents are still 50% below Norwood. Operators who entered in 2022–2024 are seeing the benefit; the window for below-market entry is closing but still open in 2026.",
  },
  {
    question: 'Is Glenelg a good location for a restaurant or café?',
    answer: "Glenelg is an excellent location for operators who correctly model the seasonality. Summer revenue (November–March) can be 40–60% above the annual average. The failure mode is operators who project summer revenue across 12 months — winter softness from May to August requires a strong local customer base to sustain.",
  },
  {
    question: 'Which Adelaide suburbs are underrated for business in 2026?',
    answer: "Three markets consistently outperform their reputation: Kensington (Norwood demographic at lower rent and lower competition), Goodwood (inner-south loyal residential base at 35% below Norwood pricing), and Burnside (Adelaide's highest household income suburb with genuine supply gaps for quality independents).",
  },
  {
    question: 'What is the outlook for Port Adelaide and Thebarton?',
    answer: "Both are genuine early-mover opportunities with 3–5 year growth trajectories. Port Adelaide's Heritage Wharf precinct and government investment are bringing new residential density to a formerly commercial-only suburb. Thebarton's creative and brewery precinct is attracting a young professional demographic. In both cases, rents are among the lowest in the inner ring — the first-mover window is open but not permanent.",
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

function AdelaideFactorDirectory() {
  const suburbs = getAdelaideSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/adelaide/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function AdelaidePage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Adelaide"
        citySlug="adelaide"
        tagline="Lower rents, loyal locals, and an underrated food culture. Adelaide rewards operators who read the market correctly — and punishes those who don't understand its seasonality."
        statChips={[
          { text: '22 suburbs scored — inner east to beachside to outer growth' },
          { text: "Norwood: Adelaide's benchmark independent strip" },
          { text: 'Rents 40–60% below Sydney equivalents' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, REISA Q1 2026, JLL Adelaide, and Locatalyze proprietary foot traffic analysis.
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
              { value: '$108K', label: 'Highest median household income in Adelaide — Burnside', source: 'ABS 2024' },
              { value: '40%', label: 'Lower commercial rents vs Sydney inner ring', source: 'JLL Adelaide Q1 2026' },
              { value: '900K+', label: 'Annual visitors to Adelaide Fringe — largest arts festival in Southern Hemisphere', source: 'Adelaide Fringe 2025' },
              { value: '22%', label: 'Population growth in Mount Barker since 2016', source: 'ABS Census 2024' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Adelaide Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Adelaide is the most underestimated food and beverage market in Australia. The city has produced nationally recognised hospitality businesses — Africola, Peel St, Press, Hentley Farm — from a metropolitan population of 1.4 million, at commercial rents that are 40–60% lower than Sydney equivalents. This cost structure creates a more forgiving environment for independent operators: break-even is achievable at lower revenue thresholds, first-year failures occur less frequently, and operators who execute well build sustainable businesses rather than grinding against rent.",
              "The inner east is where Adelaide's café and dining culture concentrates. Norwood's The Parade, Unley's King William Road, North Adelaide's O'Connell and Melbourne Streets, and the emerging Prospect Road corridor all deliver professional demographics with above-average hospitality spend. These strips are not oversaturated in the Sydney or Melbourne sense — a quality independent concept can still find a viable position without fighting through 400 competitors for the same customer.",
              "The beachside market is Adelaide's most nuanced. Glenelg, Henley Beach, and Semaphore all deliver strong peak-season revenue that attracts operators who then underestimate the off-season. The operators who succeed in these markets are not those who capture the summer wave — they're those who build genuine local community loyalty that sustains trade through the cooler months.",
              "The emerging opportunity for 2026 is in the gentrifying precincts: Bowden, Thebarton, Port Adelaide, and Prospect Road all have the demand trajectory without the rent trajectory having fully caught up. First-mover operators in these precincts are locking in leases that will look underpriced in 3–5 years as demographics mature.",
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
              { type: 'Cafés & Specialty Coffee', insight: "Norwood and Prospect are the two ends of the opportunity spectrum — Norwood for operators who want the established market, Prospect for those who want the growth market. Unley and Hyde Park are the underrated mid-tier plays: professional demographics, loyal repeat customers, lower competition than Norwood.", best: ['Norwood', 'Prospect', 'Unley'] },
              { type: 'Full-Service Restaurants', insight: "North Adelaide (O'Connell/Melbourne Street) is Adelaide's primary restaurant precinct — event-night trade from Adelaide Oval and the CBD adds meaningful revenue uplift. Norwood's The Parade works for quality-casual dining.", best: ['North Adelaide', 'Norwood', 'Adelaide CBD'] },
              { type: 'Retail (Independent)', insight: "Burnside Village and the Norwood strip are Adelaide's strongest independent retail precincts by household income. Prospect is the growth-stage retail play. Glenelg works for lifestyle retail with a tourist uplift — but seasonal planning is essential.", best: ['Burnside', 'Norwood', 'Prospect'] },
              { type: 'Fitness & Wellness', insight: 'Allied health and boutique fitness follows high-income residential. Burnside, Unley, and North Adelaide all have household income demographics that sustain premium wellness spend. Hyde Park is the underrated play — strong demographics at lower rent.', best: ['Burnside', 'Unley', 'Hyde Park'] },
              { type: 'Professional Services', insight: 'Professional services follow corporate concentration — the Adelaide CBD, North Adelaide professional firms on Melbourne Street, and the Norwood small-business cluster are the three primary markets.', best: ['Adelaide CBD', 'North Adelaide', 'Norwood'] },
              { type: 'Creative & Hospitality Concepts', insight: "Thebarton's brewery precinct, Port Adelaide's Heritage Wharf, and Bowden's urban renewal zone are the three markets where emerging creative hospitality concepts find affordable entry and a receptive early-adopter demographic.", best: ['Thebarton', 'Bowden', 'Port Adelaide'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Adelaide Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Norwood', slug: 'norwood', verdict: aVerdict('norwood'), score: aScore('norwood'), rentFrom: '$4,500/mo', body: "The Parade is the clearest quality signal in South Australian hospitality — 200+ independents, a track record of nationally recognised operators, and a customer demographic that genuinely supports premium pricing. Differentiated concepts thrive; generic ones are outcompeted. Rent is elevated for Adelaide but 45% below a comparable Surry Hills or Fitzroy position." },
              { rank: 2, name: 'Prospect', slug: 'prospect', verdict: aVerdict('prospect'), score: aScore('prospect'), rentFrom: '$2,500/mo', body: "The rent-to-demand ratio on Prospect Road is the best in Adelaide in 2026. A professional demographic with Melbourne café habits is living in a suburb where rents are still half of Norwood. The window for below-market entry is closing — Prospect rents rose 25% from 2022–2025 — but operators entering now capture better conditions than in two years." },
              { rank: 3, name: 'Kensington', slug: 'kensington', verdict: aVerdict('kensington'), score: aScore('kensington'), rentFrom: '$3,000/mo', body: "Kensington sits in Norwood's shadow in terms of operator attention, despite sharing its demographic. The Parade corridor east of the main Norwood strip has fewer than half the competitors at 30% lower rent — a genuine gap for operators who want Norwood-quality customers without Norwood-level competition." },
              { rank: 4, name: 'North Adelaide', slug: 'north-adelaide', verdict: aVerdict('north-adelaide'), score: aScore('north-adelaide'), rentFrom: '$4,000/mo', body: "O'Connell Street is Adelaide's primary restaurant corridor with strong AFL and cricket event uplift from Adelaide Oval. Melbourne Street serves a professional lunch and dinner market with above-average spend. Entry requires a clearly differentiated concept given the established incumbents." },
              { rank: 5, name: 'Kent Town', slug: 'kent-town', verdict: aVerdict('kent-town'), score: aScore('kent-town'), rentFrom: '$3,500/mo', body: "Rundle Street East and the Kent Town corridor combine CBD adjacency with suburban rent. Professional lunch trade from the CBD and Fringe festival spillover (February–March) are consistent revenue drivers. At $5,000/month, a position here captures inner-city foot traffic at a fraction of CBD rent." },
              { rank: 6, name: 'Unley', slug: 'unley', verdict: aVerdict('unley'), score: aScore('unley'), rentFrom: '$4,000/mo', body: "King William Road's highest-income suburban strip. The Unley demographic spends more per café visit than any comparable suburban strip in Adelaide. Works exceptionally well for specialty coffee and quality-casual; less suitable for high-volume value concepts." },
              { rank: 7, name: 'Burnside', slug: 'burnside', verdict: aVerdict('burnside'), score: aScore('burnside'), rentFrom: '$4,000/mo', body: "Adelaide's highest household income suburb is conspicuously underserved by quality independent operators. Competition is 4/10 — unusual for a suburb with this income profile. A genuine first-mover opportunity for operators with a premium positioning." },
              { rank: 8, name: 'Hyde Park', slug: 'hyde-park', verdict: aVerdict('hyde-park'), score: aScore('hyde-park'), rentFrom: '$3,500/mo', body: "King William Road south of Unley Road at 15% below Unley rents. Low seasonality, consistent repeat trade, and a growing apartment population make Hyde Park reliable. The market rewards execution quality over concept novelty." },
              { rank: 9, name: 'Glenelg', slug: 'glenelg', verdict: aVerdict('glenelg'), score: aScore('glenelg'), rentFrom: '$4,000/mo', body: "South Australia's top tourism precinct. Summer revenue November–March can be 40–60% above the annual average. The failure mode is operators who project summer revenue forward without a viable winter strategy. Local loyalty is non-negotiable." },
              { rank: 10, name: 'Goodwood', slug: 'goodwood', verdict: aVerdict('goodwood'), score: aScore('goodwood'), rentFrom: '$2,500/mo', body: "Goodwood Road delivers inner-south Adelaide professional demographics at 35% below Norwood pricing. Low tourism means the customer base is entirely local — requiring genuine community investment rather than destination marketing." },
              { rank: 11, name: 'Bowden', slug: 'bowden', verdict: aVerdict('bowden'), score: aScore('bowden'), rentFrom: '$2,000/mo', body: "The Bowden urban renewal precinct is delivering new residents faster than hospitality supply is appearing. Renewal SA lease terms support independent operators. First-mover operators who build community loyalty now capture the demographic before rents reprice." },
              { rank: 12, name: 'Henley Beach', slug: 'henley-beach', verdict: aVerdict('henley-beach'), score: aScore('henley-beach'), rentFrom: '$3,000/mo', body: "Henley Square delivers a more balanced seasonal trade profile than Glenelg. Operators who position for both the tourist peak and the local resident base achieve consistent year-round economics that pure beach-town concepts cannot." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/adelaide/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Adelaide address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Adelaide address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#EDE9FE', color: '#4C1D95', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Adelaide address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Adelaide Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>22 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="adelaide" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Adelaide Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Norwood vs Prospect', body: "Norwood is the proven market — established demand, national track record, premium customer quality. Prospect is the growth market — same demographic trajectory at half the rent, but less foot traffic depth today. For operators with a strong concept and the capital to weather a build period, Prospect offers better long-term unit economics. For operators who need immediate volume, Norwood's established foot traffic is more reliable." },
              { title: 'Glenelg vs Henley Beach', body: "Glenelg has higher peak revenue but steeper winter softness — tourist dependency is 9/10 versus Henley's 7/10. Henley Beach's stronger local residential base moderates the off-season cliff and makes revenue more predictable across 12 months. For operators without the capital to sustain 3–4 lean winter months, Henley's more balanced demand profile is the lower-risk choice." },
              { title: 'Bowden vs Thebarton vs Port Adelaide', body: "All three are genuine early-mover plays. Bowden has the most structured opportunity — Renewal SA leases are designed for independent operators and residential density is already arriving. Thebarton suits creative and brewery concepts. Port Adelaide is the highest-upside, highest-patience play — the gentrification wave is real but 3–5 years from full maturity." },
              { title: 'Adelaide CBD vs North Adelaide', body: "CBD rents ($10,000–$22,000/month) require high volume or premium pricing — Fringe festival revenue uplift helps but doesn't sustain poor unit economics year-round. North Adelaide is the superior option for most independent restaurant operators: O'Connell Street delivers comparable foot traffic on event nights at 45% lower rent." },
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
              { name: 'Modbury & Salisbury main strips', why: "Both suffer from major shopping centre gravity — Tea Tree Plaza and Parabanks Centre monopolise consumer attention and chains capture most foot traffic. Independent operators on secondary strips face difficulty acquiring the volume that strip positioning promises." },
              { name: 'Glenelg (without winter strategy)', why: "Glenelg is not a high-risk location for operators who model the seasonality correctly. It is very high-risk for operators who open in November based on summer projections and discover in June that 40% of expected trade disappears. The location works; planning failure is the risk." },
              { name: 'Adelaide CBD (non-premium concepts)', why: "Mid-market concepts in the CBD face a mathematical problem: $14,000–$20,000/month rent requires volume that a non-premium concept cannot generate. The CBD rewards premium pricing and high-volume formats — casual independent operators with standard margins are squeezed before the 12-month mark." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Adelaide Suburb Factor Breakdown — All 22 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <AdelaideFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Adelaide Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Adelaide location?"
        subtitle="Run a free analysis on any Adelaide address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/adelaide/norwood" style={{ color: C.brand, textDecoration: 'none' }}>Norwood Analysis →</Link>
          <Link href="/analyse/adelaide/prospect" style={{ color: C.brand, textDecoration: 'none' }}>Prospect Analysis →</Link>
          <Link href="/analyse/adelaide/glenelg" style={{ color: C.brand, textDecoration: 'none' }}>Glenelg Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
