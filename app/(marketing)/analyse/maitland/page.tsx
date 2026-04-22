// app/(marketing)/analyse/maitland/page.tsx
// Maitland city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getMaitlandSuburb, getMaitlandSuburbs } from '@/lib/analyse-data/maitland'

function mtScore(slug: string): number {
  return getMaitlandSuburb(slug)?.compositeScore ?? 0
}
function mtVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getMaitlandSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Maitland NSW — 2026 Location Guide',
  description:
    'Maitland business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Maitland suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/maitland' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Maitland NSW — 2026 Location Guide',
    description: '8 Maitland suburbs ranked and scored. Rent benchmarks, foot traffic data, Hunter Valley wine adjacency, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/maitland',
  },
}

const COMPARISON_ROWS = [
  { name: 'Maitland CBD', score: mtScore('maitland-cbd'), verdict: mtVerdict('maitland-cbd'), rent: '$2,500–$5,500', footTraffic: 'Medium-High', bestFor: 'Heritage dining, boutique retail, quality hospitality' },
  { name: 'Rutherford', score: mtScore('rutherford'), verdict: mtVerdict('rutherford'), rent: '$1,500–$3,500', footTraffic: 'High (shopping centre)', bestFor: 'Year-round resident trade, convenience food, retail' },
  { name: 'East Maitland', score: mtScore('east-maitland'), verdict: mtVerdict('east-maitland'), rent: '$1,500–$3,000', footTraffic: 'Medium', bestFor: 'First-mover residential, quality cafe, family dining' },
  { name: 'Cessnock', score: mtScore('cessnock'), verdict: mtVerdict('cessnock'), rent: '$1,200–$3,000', footTraffic: 'Medium (seasonal)', bestFor: 'Wine tourism hospitality, quality casual dining' },
  { name: 'Singleton', score: mtScore('singleton'), verdict: mtVerdict('singleton'), rent: '$1,200–$3,000', footTraffic: 'Medium', bestFor: 'Mining workforce dining, quality hospitality, lunch trade' },
  { name: 'Morpeth', score: mtScore('morpeth'), verdict: mtVerdict('morpeth'), rent: '$1,000–$2,500', footTraffic: 'Medium (weekend peaks)', bestFor: 'Artisan food, boutique retail, heritage village tourism' },
  { name: 'Kurri Kurri', score: mtScore('kurri-kurri'), verdict: mtVerdict('kurri-kurri'), rent: '$800–$2,000', footTraffic: 'Low-Medium', bestFor: 'Community essentials, convenience food, local services' },
  { name: 'Raymond Terrace', score: mtScore('raymond-terrace'), verdict: mtVerdict('raymond-terrace'), rent: '$1,200–$2,500', footTraffic: 'Medium (seasonal)', bestFor: 'Gateway dining, resident trade, Port Stephens visitor corridor' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Heritage Spine — CBD and Village',
    description: "Maitland CBD and Morpeth share a heritage identity that no suburban commercial strip can replicate. The CBD High Street precinct and the Morpeth village draw visitors who seek the distinctive experience of operating from a National Trust streetscape. These locations reward quality-positioned independent operators who lean into the heritage character rather than importing generic concepts.",
    suburbs: [
      { name: 'Maitland CBD', slug: 'maitland-cbd', description: 'The historic commercial heart of the Hunter Valley inland region. Heritage High Street precinct with a growing resident catchment and strong year-round demand. The lowest seasonality risk in the dataset. Suited to destination dining and boutique retail that leverages the heritage character.', score: mtScore('maitland-cbd'), verdict: mtVerdict('maitland-cbd'), rentRange: '$2,500–$5,500/mo' },
      { name: 'Morpeth', slug: 'morpeth', description: 'Heritage-listed village on the Hunter River with a distinctive food and artisan retail identity. Weekend and day-trip tourism from Newcastle and Sydney drives above-average per-visit spend. The existing cluster of specialty operators reinforces rather than undermines the destination draw.', score: mtScore('morpeth'), verdict: mtVerdict('morpeth'), rentRange: '$1,000–$2,500/mo' },
    ],
  },
  {
    title: 'Suburban Commercial Hubs',
    description: 'Rutherford and East Maitland deliver the most consistent year-round resident trade in the LGA. Rutherford is anchored by the Marketplace shopping centre — high foot traffic volumes with low seasonality. East Maitland is the emerging residential growth corridor where the first-mover opportunity remains open.',
    suburbs: [
      { name: 'Rutherford', slug: 'rutherford', description: 'Major suburban commercial hub anchored by the Rutherford Marketplace. The highest and most consistent foot traffic volumes in the Maitland LGA. Pure resident trade — no tourism dependency, no seasonal variation. Competition from national chains requires strong concept differentiation.', score: mtScore('rutherford'), verdict: mtVerdict('rutherford'), rentRange: '$1,500–$3,500/mo' },
      { name: 'East Maitland', slug: 'east-maitland', description: 'Primary residential growth corridor with commercial supply lagging behind population growth. Quality hospitality operators are genuinely absent. The first-mover opportunity is open — resident demographic is quality-seeking with metropolitan food culture expectations.', score: mtScore('east-maitland'), verdict: mtVerdict('east-maitland'), rentRange: '$1,500–$3,000/mo' },
    ],
  },
  {
    title: 'Tourism-Adjacent Wine Country',
    description: 'Cessnock and Singleton sit within the Hunter Valley wine economy — the largest wine tourism region in NSW. Cessnock is the direct gateway to Pokolbin and the vineyard corridor. Singleton serves the Upper Hunter with a strong mining workforce. Both have genuine tourism adjacency without the high rents of the vineyard precincts themselves.',
    suburbs: [
      { name: 'Cessnock', slug: 'cessnock', description: 'Gateway to the Hunter Valley wine region with 1.8 million annual visitors passing through or near the town. Quality casual dining and specialty food operators who position for wine tourism visitors capture genuine additional revenue on top of the local resident base. Wine tourism has modest seasonality.', score: mtScore('cessnock'), verdict: mtVerdict('cessnock'), rentRange: '$1,200–$3,000/mo' },
      { name: 'Singleton', slug: 'singleton', description: 'Upper Hunter commercial centre built on mining and agriculture. High-wage workforce demographic creates consistent above-average hospitality demand on weekdays. Low seasonality, modest Upper Hunter wine tourism overlay. Quality independents fill an underserved gap the pub and fast food defaults have not closed.', score: mtScore('singleton'), verdict: mtVerdict('singleton'), rentRange: '$1,200–$3,000/mo' },
    ],
  },
  {
    title: 'Emerging and Satellite Markets',
    description: 'Kurri Kurri and Raymond Terrace serve distinct community needs at the edges of the regional market. Kurri Kurri is a working-class inland town with the lowest rents in the dataset — viable for operators who calibrate correctly to the community scale. Raymond Terrace is a growing gateway town with a tourism corridor to Port Stephens.',
    suburbs: [
      { name: 'Kurri Kurri', slug: 'kurri-kurri', description: 'Working-class inland Hunter community with genuine but modest demand. The lowest commercial rents in the Maitland regional dataset. Viable for community-positioned essential services and convenience food operators who accept the revenue ceiling in exchange for very low occupancy costs.', score: mtScore('kurri-kurri'), verdict: mtVerdict('kurri-kurri'), rentRange: '$800–$2,000/mo' },
      { name: 'Raymond Terrace', slug: 'raymond-terrace', description: 'Port Stephens Council gateway town with growing residential population and tourist corridor positioning. Port Stephens beach tourism passes through on the way to Nelson Bay and the Stockton Bight. Resident trade is the foundation — tourism adds a seasonal overlay rather than dominating the demand base.', score: mtScore('raymond-terrace'), verdict: mtVerdict('raymond-terrace'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'How does proximity to the Hunter Valley wine region affect Maitland businesses?',
    answer: "The Hunter Valley wine region is the largest wine tourism destination in NSW, drawing approximately 1.8 million visitors annually. Maitland businesses benefit from this in two ways: directly through Cessnock, which sits at the gateway of the Pokolbin vineyard corridor, and indirectly through the broader regional profile that draws visitors to the Hunter Valley who may overnight in Maitland or Morpeth. Cessnock operators who position for the wine tourism demographic — quality-casual dining, specialty food, artisan retail — access genuine visitor spend on top of their local resident base. Maitland CBD operators benefit less directly, but the region's food culture has elevated the expectations of local residents who regularly visit the wineries and expect comparable quality closer to home.",
  },
  {
    question: 'Is Maitland close enough to Newcastle for that to matter?',
    answer: "Newcastle is approximately 50 kilometres from Maitland, and the rail connection makes the two cities part of the same daily commuter and lifestyle catchment. The practical effect for Maitland businesses is significant: Maitland captures the housing affordability migration from Newcastle — people who cannot afford Newcastle prices but maintain Newcastle income levels and Newcastle food culture expectations. This is the demographic driving Maitland's population growth, and it is exactly the customer base that sustains quality hospitality and retail concepts. The Newcastle proximity also means Maitland operators compete with Newcastle dining when positioning for special-occasion dining — the CBD and Morpeth are the locations that can retain this spend locally through distinctive identity and quality.",
  },
  {
    question: 'What makes Morpeth different from a typical regional village?',
    answer: "Morpeth is a heritage-listed village with National Trust designation — the intact Victorian and Federation streetscape is genuinely distinctive rather than a replica heritage theme. This creates a tourism draw that is independent of and complementary to the Hunter Valley wine tourism circuit. Day-trip visitors from Newcastle and Sydney visit Morpeth specifically for the heritage food culture experience rather than as a transit stop on the way to somewhere else. The existing cluster of artisan bakeries, specialty food producers, and boutique retail has created a gravitational pull — each new quality operator reinforces the destination identity rather than competing against it. The risk is over-reliance on weekend tourism; successful Morpeth operators build a local community customer base alongside the visitor trade.",
  },
  {
    question: 'How fast is Maitland actually growing?',
    answer: "Maitland LGA is one of the fastest-growing inland LGAs in New South Wales — the combination of housing affordability relative to Newcastle, strong transport links, and the lifestyle appeal of the Hunter region has created sustained population inflows. The LGA population has grown past 90,000 and is projected to continue growing substantially through the 2030s. The practical business implication is that commercial supply has not kept pace with residential growth, particularly in East Maitland and the northern suburbs — demand for quality food and hospitality is running ahead of operator supply. First-mover operators who establish before the commercial strips mature capture the loyalty of a growing resident base before competition catches up.",
  },
  {
    question: 'Morpeth or Maitland CBD — which is better for a food business?',
    answer: "They suit different concepts and operators. Maitland CBD has a larger and more consistent resident catchment, stronger year-round trade, and more diverse commercial activity — better for operators who want stable year-round revenue from a mixed customer base of residents, workers, and some heritage tourism. Morpeth is a weekend-peak market with a distinctive destination identity — better for artisan concepts, specialty food producers, and boutique retail that can command premium pricing from a food-literate visitor demographic. Morpeth weekends can be very strong; Morpeth weekdays require careful management. The CBD provides more predictable weekly revenue. For a quality-casual cafe, both can work — the CBD gives you 52-week consistency; Morpeth gives you stronger weekend peaks and a more distinctive identity that supports premium positioning.",
  },
  {
    question: 'Does Maitland have low seasonality compared to coastal NSW?',
    answer: "Yes — and this is one of Maitland's most underappreciated structural advantages for business operators. Coastal NSW cities like Newcastle, Port Macquarie, and Byron Bay have material seasonal variation driven by summer beach tourism and school holiday peaks. Maitland's inland position and resident-driven demand base create a highly consistent revenue pattern across all 12 months. The seasonal variation in Maitland CBD and Rutherford is among the lowest in the NSW regional dataset — the revenue swings that force coastal operators to build up reserves for the off-season are largely absent. Operators who have experienced the cash flow stress of coastal seasonality will find Maitland's stable year-round trade pattern to be a significant operational advantage.",
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

function MaitlandFactorDirectory() {
  const suburbs = getMaitlandSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/maitland/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function MaitlandPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Maitland"
        citySlug="maitland"
        tagline="NSW's fastest-growing inland LGA has a genuine and growing hospitality market with the lowest seasonality risk in the Hunter region. The resident base drives year-round demand — the heritage streetscape and wine country adjacency are the upside."
        statChips={[
          { text: '8 suburbs scored — heritage CBD to wine country gateway' },
          { text: 'One of NSW\'s fastest-growing inland LGAs — 90,000+ population' },
          { text: 'Hunter Valley wine region: 1.8 million annual visitors via Cessnock' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NSW Valuer General Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
            { label: 'Market Reality', href: '#market-reality' },
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
              { value: '90K+', label: 'Maitland LGA population — one of NSW\'s fastest-growing inland councils', source: 'ABS 2024' },
              { value: '50km', label: 'Distance to Newcastle — commuter catchment with metropolitan food expectations', source: 'Transport NSW 2025' },
              { value: '1.8M', label: 'Annual Hunter Valley wine region visitors via Cessnock gateway', source: 'Destination NSW 2025' },
              { value: '$1K', label: 'Commercial rents from $1,000/month — low entry cost for heritage village positions', source: 'NSW Valuer General Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Maitland Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Maitland is the commercial and cultural capital of the Hunter Valley inland region — a city of over 90,000 people in the LGA that has consistently been one of NSW's fastest-growing inland councils. The growth is driven by a combination that benefits business operators directly: housing affordability relative to Newcastle, strong transport links, and a resident demographic that brings metropolitan income levels and food culture expectations to a regional market with regional rent structures.",
              "The lowest seasonality risk in the Hunter region is Maitland's most underappreciated business advantage. Coastal NSW cities face material revenue variation between summer beach tourism peaks and off-season softness. Maitland's inland position and resident-driven demand create a highly consistent 52-week revenue pattern that removes the cash flow pressure coastal operators manage as a structural condition of their business. The Maitland CBD and Rutherford in particular have year-round demand variation so low that operators can model a genuinely flat monthly revenue baseline.",
              "The heritage dimension opens a quality positioning that most inland regional cities cannot offer. The Maitland CBD High Street and the Morpeth heritage village are genuinely distinctive settings with National Trust recognition — the heritage streetscape creates a character that supports premium positioning for independent operators. Visitors come specifically to experience the heritage precinct rather than treating it as a generic regional destination. This tourism adjacency sits alongside the dominant resident trade, creating a layered demand profile without coastal-style seasonality risk.",
              "Be realistic about the opportunity tier. Maitland is a growing regional city, not a metropolitan market. A well-run quality cafe in the CBD or Morpeth builds strong community loyalty, earns good wine-country tourism adjacency trade, and generates sustainable income for an owner-operated business. The growth trajectory is genuine. The revenue ceiling is real. Operators who model metropolitan volumes will find a strong regional market that is not yet — and may never be — a metropolitan one.",
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
              { type: 'Cafes and Specialty Coffee', insight: "Maitland CBD and Morpeth are the strongest cafe markets — heritage positioning, quality-seeking resident demographic, and tourism adjacency. East Maitland offers a genuine first-mover residential opportunity in the growth corridor. Rutherford suits volume-focused coffee operators who want consistent weekday shopping centre foot traffic.", best: ['Maitland CBD', 'Morpeth', 'East Maitland'] },
              { type: 'Full-Service Restaurants', insight: "Maitland CBD is the primary restaurant market for the LGA — heritage dining character, growing resident base, and the strongest destination positioning in the inland Hunter. Morpeth suits boutique dining concepts that can leverage the weekend tourism peak. Cessnock works for operators who want to capture the Hunter Valley wine tourism visitor trade at accessible rents.", best: ['Maitland CBD', 'Morpeth', 'Cessnock'] },
              { type: 'Retail (Independent)', insight: "Maitland CBD heritage strip suits boutique and specialty retail with the strongest destination character. Rutherford Marketplace delivers the highest year-round retail foot traffic volumes. Morpeth suits artisan and curated retail targeting the heritage tourism visitor demographic at above-average per-visit spend.", best: ['Maitland CBD', 'Rutherford', 'Morpeth'] },
              { type: 'Fitness and Wellness', insight: "The growing young professional and family demographic across East Maitland and the broader LGA creates strong demand for allied health, boutique fitness, and wellness services. Maitland CBD suits premium wellness positioning. Rutherford suits high-volume fitness formats with consistent shopping centre foot traffic.", best: ['East Maitland', 'Maitland CBD', 'Rutherford'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Cessnock is the highest-tourism-exposure location in the Maitland regional dataset — wine tourism, vineyard visitors, and the Hunter Valley visitor economy create genuine hospitality demand from an above-average-spend visitor demographic. Morpeth has a distinct heritage village tourism draw. Both require local resident trade to underpin the tourism overlay.", best: ['Cessnock', 'Morpeth'] },
              { type: 'Community and Convenience', insight: "East Maitland, Raymond Terrace, and Kurri Kurri serve growing or established residential communities that are underserved by quality convenience food and casual dining. Low rents, clear unmet demand, and community loyalty opportunity for operators who position correctly. East Maitland has the strongest growth trajectory of the three.", best: ['East Maitland', 'Raymond Terrace', 'Kurri Kurri'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Maitland Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Maitland CBD', slug: 'maitland-cbd', verdict: mtVerdict('maitland-cbd'), score: mtScore('maitland-cbd'), rentFrom: '$2,500/mo', body: "The historic commercial heart of the Maitland LGA. Heritage High Street precinct with a growing resident catchment driven by Newcastle affordability migration. The lowest seasonality in the dataset and the strongest overall demand profile — the resident demographic has metropolitan food expectations and consistent year-round spending habits. The heritage character reinforces rather than limits quality independent positioning." },
              { rank: 2, name: 'Rutherford', slug: 'rutherford', verdict: mtVerdict('rutherford'), score: mtScore('rutherford'), rentFrom: '$1,500/mo', body: "The major suburban commercial hub anchored by Rutherford Marketplace shopping centre. Highest foot traffic volumes in the LGA from a broad residential catchment. Year-round consistency with no seasonal variation — pure resident shopping trade. Competition from national chains is the primary challenge; independent operators need strong concept differentiation to earn the discretionary spend." },
              { rank: 3, name: 'East Maitland', slug: 'east-maitland', verdict: mtVerdict('east-maitland'), score: mtScore('east-maitland'), rentFrom: '$1,500/mo', body: "The primary residential growth corridor with commercial supply running behind population growth. Quality cafe and dining concepts are genuinely absent from the emerging commercial strips. The first-mover window is open — early operators capture the loyalty of a quality-seeking demographic before competition arrives. Below-market rents for the growth trajectory." },
              { rank: 4, name: 'Cessnock', slug: 'cessnock', verdict: mtVerdict('cessnock'), score: mtScore('cessnock'), rentFrom: '$1,200/mo', body: "Gateway to the Hunter Valley wine region. The 1.8 million annual wine tourists create genuine visitor trade for hospitality operators who position for the wine country market. The local resident base provides the year-round foundation. Quality casual dining and specialty food operators find a diversified revenue stream from both tourism and resident segments at rents well below the vineyard precincts." },
              { rank: 5, name: 'Singleton', slug: 'singleton', verdict: mtVerdict('singleton'), score: mtScore('singleton'), rentFrom: '$1,200/mo', body: "Upper Hunter commercial centre with a mining and agricultural workforce demographic. High-average-income FIFO workers, contractors, and agribusiness professionals generate strong weekday hospitality demand at above-average ticket values. Very low seasonality. Quality independents fill a gap the pub dining and fast food default has left open — the market is underserved relative to the spending power present." },
              { rank: 6, name: 'Morpeth', slug: 'morpeth', verdict: mtVerdict('morpeth'), score: mtScore('morpeth'), rentFrom: '$1,000/mo', body: "Heritage-listed village with a distinctive food tourism identity independent of the wine region. National Trust streetscape draws day-trip visitors from Newcastle and Sydney. The existing cluster of artisan bakeries and specialty food operators creates a destination gravity. Weekend peaks are strong. Weekday trade requires a genuine local community customer base to sustain — the heritage identity alone is not enough." },
              { rank: 7, name: 'Raymond Terrace', slug: 'raymond-terrace', verdict: mtVerdict('raymond-terrace'), score: mtScore('raymond-terrace'), rentFrom: '$1,200/mo', body: "Port Stephens gateway town with growing residential population. The tourist corridor to Nelson Bay and the Stockton Bight creates a tourism overlay on top of the resident base. Population growth driven by housing affordability relative to Newcastle is similar to the Maitland CBD dynamic. The commercial strip is underdeveloped relative to the resident and visitor demand." },
              { rank: 8, name: 'Kurri Kurri', slug: 'kurri-kurri', verdict: mtVerdict('kurri-kurri'), score: mtScore('kurri-kurri'), rentFrom: '$800/mo', body: "Working-class inner Hunter community with genuine but modest demand. The lowest commercial rents in the regional dataset create favourable unit economics for operators who correctly calibrate their concept to the community scale. A viable community-service business location — not a hospitality growth market, but a stable one for operators who serve the resident base at the right price point." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/maitland/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #431407 0%, #9A3412 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Maitland address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Maitland address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FFEDD5', color: '#431407', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Maitland address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Maitland Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="maitland" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — All Maitland Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Maitland CBD vs Morpeth', body: "Maitland CBD has a larger resident catchment, more consistent weekday trade, and broader commercial activity — better for operators who want year-round revenue stability from a mixed resident and heritage tourism customer base. Morpeth has a more distinctive heritage village identity that supports premium positioning but is more weekend-peak dependent. For a quality cafe, the CBD gives 52-week consistency. Morpeth gives stronger weekend peaks and a destination identity that supports higher per-visit spend from food tourism visitors." },
              { title: 'Rutherford vs East Maitland', body: "Rutherford delivers today — high and consistent shopping centre foot traffic, proven resident demand, established commercial strip. East Maitland delivers tomorrow — lower current foot traffic but strong population growth trajectory and no established competition. Operators who want predictable revenue now choose Rutherford. Operators who want to build a dominant community position in a growing suburb before competition arrives choose East Maitland. The risk profiles are inverse: Rutherford has competition risk; East Maitland has execution risk." },
              { title: 'Cessnock vs Singleton', body: "Both are regional towns with mining or agricultural workforce demographics and genuine quality hospitality gaps. Cessnock has the stronger tourism overlay from the Hunter Valley wine region — the visitor trade diversifies revenue beyond the local resident base. Singleton has a slightly larger mining workforce demographic with above-average wages, creating stronger weekday corporate and contractor dining trade. For operators who want to capture wine tourism as well as local trade, Cessnock. For a purely resident and workforce hospitality play with very low seasonality, Singleton." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="market-reality" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Maitland Market Reality — Three Things Operators Must Understand</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>The structural patterns that determine success in the Maitland regional market.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'The growth dividend is real but gradual', why: "Maitland is growing faster than most inland NSW cities — this is genuine and it creates real first-mover opportunity in the growth corridors. But population growth translates into hospitality demand over years, not months. East Maitland operators who enter the emerging commercial strip will see steady growth as the residential density increases; they should not expect metro-equivalent volumes in the first 12 months. Model conservatively and plan for an 18-month ramp period." },
              { name: 'The heritage identity is a business asset, not just a backdrop', why: "Maitland CBD and Morpeth are not just pleasant places to operate — the heritage designation creates a genuine point of difference from every suburban commercial strip in the Hunter region. Operators who build their brand identity around the heritage character attract both the local community and the weekend visitor trade in ways that a generic shopfront cannot. Lean into the streetscape. It is the scarcest asset in the market." },
              { name: 'Wine country adjacency requires active capture', why: "The Hunter Valley wine region proximity is a latent opportunity for Maitland and Cessnock operators — but the wine tourists do not automatically find you. Operators who actively build relationships with the vineyard visitor economy, list on wine tourism platforms, and build a reputation in the food-literate visitor demographic capture this revenue. Those who wait for it to arrive passively see it flow directly to the vineyard precincts without touching the town hospitality sector." },
            ].map((zone) => (
              <div key={zone.name} style={{ padding: '22px', backgroundColor: C.amberBg, borderRadius: '10px', border: `1px solid ${C.amberBdr}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.amber, marginBottom: '10px' }}>{zone.name}</h3>
                <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>{zone.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Maitland Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <MaitlandFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Maitland Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Maitland location?"
        subtitle="Run a free analysis on any Maitland address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/maitland/maitland-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Maitland CBD Analysis →</Link>
          <Link href="/analyse/maitland/rutherford" style={{ color: C.brand, textDecoration: 'none' }}>Rutherford Analysis →</Link>
          <Link href="/analyse/maitland/morpeth" style={{ color: C.brand, textDecoration: 'none' }}>Morpeth Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
