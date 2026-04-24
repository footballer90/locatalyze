// app/(marketing)/analyse/port-macquarie/page.tsx
// Port Macquarie city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getPortMacquarieSuburb, getPortMacquarieSuburbs } from '@/lib/analyse-data/port-macquarie'

function pmScore(slug: string): number {
  return getPortMacquarieSuburb(slug)?.compositeScore ?? 0
}
function pmVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getPortMacquarieSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Port Macquarie — 2026 Location Guide',
  description:
    'Port Macquarie business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Port Macquarie suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/port-macquarie' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Port Macquarie — 2026 Location Guide',
    description: '8 Port Macquarie suburbs ranked and scored. Rent benchmarks, beach tourism data, Hastings region demographics, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/port-macquarie',
  },
}

const COMPARISON_ROWS = [
  { name: 'Port Macquarie CBD', score: pmScore('port-macquarie-cbd'), verdict: pmVerdict('port-macquarie-cbd'), rent: '$1,500–$3,500', footTraffic: 'High (seasonal)', bestFor: 'All-day dining, retail, services, office lunch trade' },
  { name: 'Settlement City', score: pmScore('settlement-city'), verdict: pmVerdict('settlement-city'), rent: '$1,400–$3,200', footTraffic: 'High (year-round)', bestFor: 'Retail, food court, specialty food, services' },
  { name: 'Westport Park', score: pmScore('westport-park'), verdict: pmVerdict('westport-park'), rent: '$1,200–$2,800', footTraffic: 'Medium-High (seasonal)', bestFor: 'Waterfront dining, lifestyle cafe, premium casual' },
  { name: "Flynn's Beach", score: pmScore('flynns-beach'), verdict: pmVerdict('flynns-beach'), rent: '$1,200–$2,800', footTraffic: 'High (seasonal)', bestFor: 'Beach casual dining, quality coffee, surf lifestyle' },
  { name: 'Laurieton', score: pmScore('laurieton'), verdict: pmVerdict('laurieton'), rent: '$800–$2,000', footTraffic: 'Medium', bestFor: 'Estuary dining, quality-casual, sea-change lifestyle' },
  { name: 'Lake Cathie', score: pmScore('lake-cathie'), verdict: pmVerdict('lake-cathie'), rent: '$700–$1,800', footTraffic: 'Low-Medium (growing)', bestFor: 'First-mover community cafe, local convenience' },
  { name: 'Wauchope', score: pmScore('wauchope'), verdict: pmVerdict('wauchope'), rent: '$700–$1,800', footTraffic: 'Medium (inland)', bestFor: 'Community dining, essential services, local cafe' },
  { name: 'Bonny Hills', score: pmScore('bonny-hills'), verdict: pmVerdict('bonny-hills'), rent: '$700–$1,600', footTraffic: 'Low-Medium', bestFor: 'Village cafe, sea-change community dining' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Beachside Tourism Precincts — Peak Season Strategy Required',
    description: "Port Macquarie receives over 3 million visitors annually. Flynn's Beach and Westport Park capture significant tourist trade during summer and school holidays but face softer winter months. Building local residential loyalty before the first tourist season is the discipline that separates sustainable operators from those who close after the first off-season.",
    suburbs: [
      { name: "Flynn's Beach", slug: 'flynns-beach', description: "One of Port Macquarie's most popular surf beaches. Strong domestic holiday maker volume from Sydney and Hunter during summer. Quality-conscious local and tourist demographic rewards genuine food culture. Seasonality is 6/10 — local community trade is essential for the winter months.", score: pmScore('flynns-beach'), verdict: pmVerdict('flynns-beach'), rentRange: '$1,200–$2,800/mo' },
      { name: 'Westport Park', slug: 'westport-park', description: 'Town Beach foreshore with coastal walk connectivity and premium lifestyle positioning. Destination dining for quality-seeking residents and visitors. Tourism is 7/10 — consistent visitor flow through the beach village that demands quality over convenience.', score: pmScore('westport-park'), verdict: pmVerdict('westport-park'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'CBD and Regional Commercial — Strong Year-Round Base',
    description: "Port Macquarie CBD and Settlement City anchor the two strongest year-round demand environments. The CBD captures tourist spending alongside office and residential trade. Settlement City's major shopping centre delivers consistent resident foot traffic insulated from beach tourism cycles.",
    suburbs: [
      { name: 'Port Macquarie CBD', slug: 'port-macquarie-cbd', description: "Primary retail and hospitality hub for the Hastings region. Horton Street and the riverfront Short Street precinct create the highest foot traffic density in the city. Tourism is 7/10 — the CBD is the first stop for 3 million annual visitors.", score: pmScore('port-macquarie-cbd'), verdict: pmVerdict('port-macquarie-cbd'), rentRange: '$1,500–$3,500/mo' },
      { name: 'Settlement City', slug: 'settlement-city', description: "Major regional shopping centre anchored by Myer, Kmart, Coles, and Woolworths. Highest consistent foot traffic volumes in the Hastings region. Seasonality is 2/10 — the most predictable retail environment in Port Macquarie.", score: pmScore('settlement-city'), verdict: pmVerdict('settlement-city'), rentRange: '$1,400–$3,200/mo' },
    ],
  },
  {
    title: 'Coastal Village and Estuary Markets',
    description: "Laurieton and Bonny Hills serve growing sea-change communities with emerging food culture. Lower rents, genuine community identity, and above-average demographic quality create opportunity for operators who want a smaller loyal market.",
    suburbs: [
      { name: 'Laurieton', slug: 'laurieton', description: "Camden Haven estuary village with a growing reputation as a quality food destination. Sea-change demographic with metropolitan food expectations and strong community loyalty. Day-trip visitors from Port Macquarie supplement the resident base.", score: pmScore('laurieton'), verdict: pmVerdict('laurieton'), rentRange: '$800–$2,000/mo' },
      { name: 'Bonny Hills', slug: 'bonny-hills', description: 'Quiet coastal village deliberately chosen by income-secure lifestyle migrants. Very low competition and a defined community identity. Revenue ceiling is modest — suited for operators who calibrate correctly to the catchment.', score: pmScore('bonny-hills'), verdict: pmVerdict('bonny-hills'), rentRange: '$700–$1,600/mo' },
    ],
  },
  {
    title: 'Growth Corridor and Inland Service Towns',
    description: "Lake Cathie is the standout first-mover opportunity in the Port Macquarie region — rapidly growing residential estates are underserved by quality local food. Wauchope serves the Hastings Valley agricultural hinterland with stable year-round community demand.",
    suburbs: [
      { name: 'Lake Cathie', slug: 'lake-cathie', description: 'Coastal residential growth area 15km south of Port Macquarie. Growing families travelling to the city for quality food create genuine first-mover demand. Competition is 2/10 — the operator gap is real and the window is open.', score: pmScore('lake-cathie'), verdict: pmVerdict('lake-cathie'), rentRange: '$700–$1,800/mo' },
      { name: 'Wauchope', slug: 'wauchope', description: 'Inland service town 16km west serving the Hastings Valley agricultural and timber hinterland. Stable year-round demand with very low seasonality. Modest scale — suited for community-institution operators at correct calibration.', score: pmScore('wauchope'), verdict: pmVerdict('wauchope'), rentRange: '$700–$1,800/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe in Port Macquarie?',
    answer: "Port Macquarie CBD and Flynn's Beach are the two strongest cafe markets. The CBD has the broadest demand base — office workers, residents, and 3 million annual visitors create consistent year-round foot traffic. Flynn's Beach is the premium beach village cafe market with a quality-conscious demographic and strong summer tourism uplift. For operators who want the lowest risk entry point with high quality positioning, the CBD is the choice. For operators who want a beach lifestyle identity and can manage the seasonal cash flow, Flynn's Beach is the opportunity.",
  },
  {
    question: 'How seasonal is the Port Macquarie business market?',
    answer: "Seasonality varies significantly by location. Settlement City has the lowest seasonality in the dataset — shopping centre trade is resident-driven and consistent across all 52 weeks. The CBD and Wauchope have low-moderate seasonality due to the office, residential, and inland agricultural trade base. Flynn's Beach and Westport Park have the highest seasonality — pronounced December to January and Easter peaks, with May to August materially softer. Operators in the beachside precincts must plan their cash flow around 12-month averages and ensure the local resident trade is built before the first off-season arrives.",
  },
  {
    question: 'Is Laurieton worth considering as a business location?',
    answer: "Laurieton is a genuinely interesting emerging market. The Camden Haven sea-change demographic has brought metropolitan food expectations to a small coastal village, creating demand for quality that the current operator base is not fully meeting. The day-trip trade from Port Macquarie is growing as Laurieton builds a food destination reputation. For operators who want lower rent, lighter competition, and the chance to become a defining local institution, Laurieton offers a compelling proposition — but the revenue ceiling is lower than Port Macquarie urban locations and operators need to calibrate correctly to the catchment scale.",
  },
  {
    question: 'What makes Port Macquarie different from other mid-North Coast markets?',
    answer: "Port Macquarie punches above its weight as a hospitality market because of the tourist volume and the quality of the sea-change demographic. Over 3 million annual visitors create a hospitality demand environment that is proportionally larger than the resident population alone would suggest. The Charles Sturt University campus and TAFE presence add a younger demographic layer. The Koala Hospital and coastal walk network generate tourism that is more family-oriented and repeat-visit than typical beach tourism markets. This combination creates a market that rewards genuine quality — generic tourist-facing concepts face stronger competition from quality independents here than in smaller coastal towns.",
  },
  {
    question: 'What are the main risks of operating in Port Macquarie?',
    answer: "Seasonal cash flow is the primary risk for beachside operators. Flynn's Beach and Westport Park can see 50-70% of annual tourist trade concentrated in December to January and school holiday periods — operators who have not built sufficient local trade to sustain the May to August period face genuine cash flow pressure. The second risk is overestimating the tourism-driven revenue ceiling — Port Macquarie's tourist market is quality-seeking and will support well-positioned operators, but generic concepts face direct competition from established local operators who have already built community loyalty. The third risk is undercapitalising the fitout — quality-conscious markets penalise operators who cut corners on fit and finish.",
  },
  {
    question: 'Is Lake Cathie a viable business opportunity?',
    answer: "Lake Cathie is a genuine first-mover opportunity with real timing risk. The residential growth in the corridor is documented and ongoing — the population trajectory supports quality independent operators who enter now and build community loyalty as the resident base grows. The risk is the ramp-up period: the current catchment may not support peak revenue from day one, and operators need working capital to sustain through the growth phase. The trade-off is very low rent, very low competition, and the chance to become the defining local operator. Operators with sufficient capital and patience for a 12-18 month ramp-up will find Lake Cathie rewarding. Those who need immediate high revenue should choose the CBD or Settlement City.",
  },
  {
    question: 'What commercial rents should I expect in Port Macquarie?',
    answer: "Port Macquarie CBD and Settlement City command the highest rents at $1,400–$3,500/month for hospitality and retail tenancies. Flynn's Beach and Westport Park are mid-range at $1,200–$2,800/month. Laurieton and Lake Cathie are lower at $700–$2,000/month. Wauchope and Bonny Hills offer the most accessible entry points at $700–$1,800/month. Fitout costs in Port Macquarie are comparable to other regional NSW cities — budget $80,000–$200,000 for a quality cafe or restaurant fitout depending on the quality of the space and the extent of the build.",
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

function PortMacquarieFactorDirectory() {
  const suburbs = getPortMacquarieSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/port-macquarie/${s.slug}`} style={{ textDecoration: 'none' }}>
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
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284C7' }}>{value}</div>
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

export default function PortMacquariePage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Port Macquarie"
        citySlug="port-macquarie"
        tagline="Port Macquarie receives over 3 million visitors a year — but the operators who build sustainable businesses here serve the quality-seeking sea-change demographic first. Tourist trade is the amplifier. Local community loyalty is the foundation."
        statChips={[
          { text: '8 suburbs scored — CBD riverfront to coastal villages and inland hinterland' },
          { text: '3M+ annual visitors — Koala Hospital, coastal walks, beach tourism' },
          { text: 'Settlement City: 2/10 seasonality — most consistent year-round retail trade in the Hastings region' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NSW Commercial Property Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '50K', label: 'Port Macquarie resident population with growing sea-change and retiree demographic', source: 'ABS 2024' },
              { value: '3M+', label: 'Annual visitors — one of the highest visitor-to-resident ratios of any NSW regional city', source: 'Destination NSW 2025' },
              { value: '2/10', label: "Settlement City seasonality — consistent year-round shopping centre trade", source: 'Locatalyze Engine' },
              { value: '$1.5K', label: 'CBD commercial rents from $1,500/month — competitive for the visitor volume delivered', source: 'NSW Commercial Property Q1 2026' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#0284C7', marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Port Macquarie Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Port Macquarie is the Hastings region's largest city and one of NSW's most visited coastal destinations — the combination of the Koala Hospital, the coastal walk network connecting nine beaches, and the Town Beach riverfront creates a tourism draw that is more diversified and family-oriented than typical beach-focused destinations. Over 3 million annual visitors pass through the city, creating a hospitality demand environment that comfortably exceeds what the 50,000-person resident population alone would support.",
              "The sea-change demographic is reshaping the quality expectation. People who have retired to or made a lifestyle move to Port Macquarie from Sydney and the Hunter Valley bring metropolitan food culture expectations and the income to pay for quality. This demographic — concentrated in the CBD foreshore, Westport Park, and Laurieton — is the economic backbone of the independent hospitality market. They are loyal customers who return repeatedly and recommend actively, creating the word-of-mouth reputation that defines quality operators in the Port Macquarie market.",
              "Settlement City represents the other end of the spectrum: the shopping centre model that insulates operators from coastal tourism seasonality. Anchored by Myer, Kmart, and two supermarkets, Settlement City delivers consistent resident foot traffic across all 52 weeks. The trade-off is a more competitive tenancy environment driven by national chain presence — operators who position purely on convenience face direct chain competition, while those who offer genuine quality and differentiation find a loyal resident customer base.",
              "The practical investment decision is fundamentally about risk tolerance. The CBD and Flynn's Beach offer higher peak revenue and premium positioning but require genuine plans for the May to August shoulder period. Settlement City and Wauchope offer consistency and predictability at a lower revenue ceiling. Lake Cathie and Laurieton offer low rent and first-mover opportunity for operators patient enough to build trade as the market develops. None of these are wrong choices — they suit different operator profiles, capital positions, and risk appetites.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Port Macquarie CBD and Flynn's Beach are the strongest specialty coffee markets. The CBD delivers consistent year-round trade from office workers, residents, and tourists. Flynn's Beach suits quality cafe operators who want a beach lifestyle identity and can sustain the winter months on local residential trade. Laurieton is the boutique emerging market for operators who want lower competition and a loyal sea-change demographic.", best: ['Port Macquarie CBD', "Flynn's Beach", 'Laurieton'] },
              { type: 'Full-Service Restaurants', insight: "The CBD riverfront precinct is Port Macquarie's primary restaurant market — Short Street and the foreshore deliver the highest average dinner spend in the city. Westport Park suits premium-casual dining with beach views for a quality-seeking visitor and resident demographic. Flynn's Beach suits casual beach dining concepts that serve both the tourist summer peak and a strong local following.", best: ['Port Macquarie CBD', 'Westport Park', "Flynn's Beach"] },
              { type: 'Retail (Independent)', insight: "Settlement City delivers the most consistent year-round retail foot traffic. The CBD suits lifestyle and specialty retail targeting both residents and the tourist market. Laurieton suits artisan and coastal lifestyle retail for the sea-change community. Westport Park suits premium coastal lifestyle retail adjacent to the beach walk.", best: ['Settlement City', 'Port Macquarie CBD', 'Laurieton'] },
              { type: 'Fitness & Wellness', insight: "The CBD has the strongest catchment for high-volume fitness formats. Westport Park and Flynn's Beach suit boutique fitness and allied health targeting the active coastal lifestyle demographic. Settlement City suits high-volume gym formats that require consistent foot traffic anchor. Laurieton has genuine emerging demand for wellness services from the sea-change community.", best: ['Port Macquarie CBD', 'Settlement City', 'Laurieton'] },
              { type: 'Tourism-Adjacent Concepts', insight: "The CBD foreshore is Port Macquarie's primary tourism hospitality destination. Flynn's Beach captures the beach holiday maker market concentrated in summer and school holidays. Westport Park suits premium tourism-adjacent concepts that capture the quality-seeking visitor segment willing to seek out a destination dining experience.", best: ['Port Macquarie CBD', "Flynn's Beach", 'Westport Park'] },
              { type: 'Community and Convenience', insight: "Lake Cathie is the outstanding first-mover community opportunity — growing residential estates without quality local food options. Wauchope serves the Hastings Valley hinterland as an essential service and community dining market. Bonny Hills suits a single high-quality community operator who wants to become the defining local institution for a small loyal village.", best: ['Lake Cathie', 'Wauchope', 'Bonny Hills'] },
            ].map((bt) => (
              <div key={bt.type} style={{ padding: '20px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0284C7', marginBottom: '8px' }}>{bt.type}</h3>
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Port Macquarie Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Port Macquarie CBD', slug: 'port-macquarie-cbd', verdict: pmVerdict('port-macquarie-cbd'), score: pmScore('port-macquarie-cbd'), rentFrom: '$1,500/mo', body: "Primary hospitality hub for the Hastings region. Horton Street and the Short Street riverfront precinct deliver the highest foot traffic density in the city. Tourism is 7/10 — 3 million annual visitors create consistent year-round demand on top of a strong resident and office worker base. Competition is 6/10 — differentiation required." },
              { rank: 2, name: 'Settlement City', slug: 'settlement-city', verdict: pmVerdict('settlement-city'), score: pmScore('settlement-city'), rentFrom: '$1,400/mo', body: "Major regional shopping centre anchored by Myer, Kmart, Coles, and Woolworths. Highest consistent foot traffic in the Hastings region. Seasonality is 2/10 — the most stable revenue environment in the Port Macquarie dataset. Competition is 6/10 — quality differentiation required to compete against national chains." },
              { rank: 3, name: "Flynn's Beach", slug: 'flynns-beach', verdict: pmVerdict('flynns-beach'), score: pmScore('flynns-beach'), rentFrom: '$1,200/mo', body: "Port Macquarie's most popular surf and family beach with a quality-conscious food culture. Strong domestic holiday maker volume from Sydney and the Hunter during summer. Tourism is 7/10. Seasonality is 6/10 — genuine local residential base required to sustain winter trade." },
              { rank: 4, name: 'Westport Park', slug: 'westport-park', verdict: pmVerdict('westport-park'), score: pmScore('westport-park'), rentFrom: '$1,200/mo', body: "Town Beach foreshore with coastal walk connectivity and premium lifestyle positioning. Destination dining and quality coffee for residents and visitors. Tourism is 7/10. Lower competition than the CBD creates genuine opportunity for quality-led concepts." },
              { rank: 5, name: 'Laurieton', slug: 'laurieton', verdict: pmVerdict('laurieton'), score: pmScore('laurieton'), rentFrom: '$800/mo', body: "Camden Haven estuary village with an emerging reputation as a quality food destination. Sea-change demographic with above-average food expectations actively seeking quality operators. Day-trip visitors from Port Macquarie add to the resident base. Low rent, low competition — a genuine opportunity for the right operator." },
              { rank: 6, name: 'Lake Cathie', slug: 'lake-cathie', verdict: pmVerdict('lake-cathie'), score: pmScore('lake-cathie'), rentFrom: '$700/mo', body: "Coastal residential growth area 15km south with a genuine first-mover opportunity. Competition is 2/10 — quality independent operators are absent from a market that is growing. Operators who enter now and build community loyalty capture the market before it fills." },
              { rank: 7, name: 'Wauchope', slug: 'wauchope', verdict: pmVerdict('wauchope'), score: pmScore('wauchope'), rentFrom: '$700/mo', body: "Inland service town for the Hastings Valley agricultural hinterland. Stable year-round community demand from resident and agricultural catchment. Seasonality is 3/10 — highly consistent. Modest scale suits community-institution operators who calibrate correctly." },
              { rank: 8, name: 'Bonny Hills', slug: 'bonny-hills', verdict: pmVerdict('bonny-hills'), score: pmScore('bonny-hills'), rentFrom: '$700/mo', body: "Quiet coastal village deliberately chosen by income-secure lifestyle migrants. Very low competition. Revenue ceiling is modest — suited for a single quality operator who becomes the defining community institution for a small, loyal village catchment." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/port-macquarie/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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
                      <div style={{ fontSize: '26px', fontWeight: 900, color: '#0284C7', lineHeight: 1 }}>{suburb.score}</div>
                      <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>/ 100</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Port Macquarie address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Port Macquarie address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#E0F2FE', color: '#0C4A6E', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Port Macquarie address &#x2192;
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Port Macquarie Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by market type and risk profile.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0284C7', marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="port-macquarie" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Port Macquarie Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: "CBD vs Flynn's Beach", body: "The CBD offers the broadest demand base — office workers, residents, and 3 million annual tourists create consistent year-round trade across the longest operating hours. Flynn's Beach offers the premium beach village positioning and a more intensely loyal local community, but with more pronounced seasonal softness in winter. For multi-format operators who want volume and consistency, the CBD. For quality-led cafe and restaurant operators who want a defining beach lifestyle identity, Flynn's Beach." },
              { title: 'Settlement City vs CBD', body: "Settlement City is the year-round consistency choice — the shopping centre model delivers reliable weekly foot traffic regardless of the tourist season or time of year. The CBD delivers higher peak revenue during summer and school holidays and allows premium independent positioning that the shopping centre environment constrains. Operators who need predictable cash flow and can compete in a chain-dominated tenancy mix choose Settlement City. Operators who want independent premium positioning with seasonal upside choose the CBD." },
              { title: 'Laurieton vs Lake Cathie', body: "Both are emerging markets with genuine first-mover opportunity, but they serve different propositions. Laurieton has a stronger existing food culture — the village has an established reputation as a quality food destination that draws day-trip visitors from Port Macquarie. Lake Cathie is a purer residential growth play — the demand exists but the food culture is not yet established. Laurieton suits operators who want to participate in an existing quality food scene. Lake Cathie suits operators who want to create the defining local food institution from scratch." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0284C7', marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="risk-zones" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>High-Risk Patterns — What Fails in Port Macquarie</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three structural failure modes observed in the Port Macquarie market.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Modelling the tourist peak as average', why: "Flynn's Beach and the CBD waterfront see concentrated tourist trade from December to January and school holidays. Operators who project this peak revenue across all 12 months consistently overestimate their annual P&L. The May to August period is materially softer on the beach strips. Sustainable cash flow planning requires accurate modelling of the full annual revenue cycle, with the local residential base providing the floor and tourist trade adding the peaks." },
              { name: 'Underestimating quality expectations', why: "Port Macquarie's sea-change demographic has lived in Sydney, Newcastle, and other quality food markets. They arrived with calibrated expectations and the income to support them. Generic coffee, average food, and inadequate service are not tolerated — they simply go elsewhere or stay home. Operators who enter the market without a genuine quality commitment find that the local community does not build the loyalty that sustains year-round trade. The market rewards operators who take quality seriously." },
              { name: 'Entering Bonny Hills or Wauchope at CBD scale', why: "The small village and inland service town markets of Bonny Hills and Wauchope have real but genuinely modest revenue ceilings. Operators who commit to high rent, extensive fitout, or CBD-scale operational models in these markets find the revenue base insufficient to cover costs. The opportunity in these locations is real for correctly calibrated operators — but the calibration is non-negotiable. Match your fixed cost structure to the catchment, not to the market you wish it were." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Port Macquarie Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <PortMacquarieFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Port Macquarie Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Port Macquarie location?"
        subtitle="Run a free analysis on any Port Macquarie address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: '#0284C7', fontWeight: 600, textDecoration: 'none' }}>&#x2190; All Cities</Link>
          <Link href="/analyse/port-macquarie/port-macquarie-cbd" style={{ color: '#0284C7', textDecoration: 'none' }}>CBD Analysis &#x2192;</Link>
          <Link href="/analyse/port-macquarie/flynns-beach" style={{ color: '#0284C7', textDecoration: 'none' }}>Flynn&apos;s Beach Analysis &#x2192;</Link>
          <Link href="/analyse/port-macquarie/settlement-city" style={{ color: '#0284C7', textDecoration: 'none' }}>Settlement City Analysis &#x2192;</Link>
          <Link href="/analyse/port-macquarie/laurieton" style={{ color: '#0284C7', textDecoration: 'none' }}>Laurieton Analysis &#x2192;</Link>
        </div>
      </section>
    </div>
  )
}
