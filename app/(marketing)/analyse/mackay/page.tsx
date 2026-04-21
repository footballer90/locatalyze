// app/(marketing)/analyse/mackay/page.tsx
// Mackay city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getMackaySuburb, getMackaySuburbs } from '@/lib/analyse-data/mackay'

function mScore(slug: string): number {
  return getMackaySuburb(slug)?.compositeScore ?? 0
}
function mVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getMackaySuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Mackay — 2026 Location Guide',
  description:
    'Mackay business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Mackay suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/mackay' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Mackay — 2026 Location Guide',
    description: '8 Mackay suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/mackay',
  },
}

const COMPARISON_ROWS = [
  { name: 'Mount Pleasant', score: mScore('mount-pleasant'), verdict: mVerdict('mount-pleasant'), rent: '$2,000–$4,500', footTraffic: 'Medium-High', bestFor: 'Premium café, specialty food, allied health' },
  { name: 'Mackay CBD', score: mScore('mackay-cbd'), verdict: mVerdict('mackay-cbd'), rent: '$1,500–$3,500', footTraffic: 'High', bestFor: 'Hospitality, retail, professional services' },
  { name: 'North Mackay', score: mScore('north-mackay'), verdict: mVerdict('north-mackay'), rent: '$1,200–$3,000', footTraffic: 'Medium-High', bestFor: 'Casual dining, convenience food, services' },
  { name: 'Andergrove', score: mScore('andergrove'), verdict: mVerdict('andergrove'), rent: '$1,200–$2,800', footTraffic: 'Medium', bestFor: 'Family-friendly café, casual dining' },
  { name: 'Blacks Beach', score: mScore('blacks-beach'), verdict: mVerdict('blacks-beach'), rent: '$1,200–$2,500', footTraffic: 'Medium (seasonal)', bestFor: 'Coastal café, lifestyle dining' },
  { name: 'Eimeo', score: mScore('eimeo'), verdict: mVerdict('eimeo'), rent: '$1,200–$2,500', footTraffic: 'Low-Medium', bestFor: 'Coastal lifestyle café, casual food' },
  { name: 'Sarina', score: mScore('sarina'), verdict: mVerdict('sarina'), rent: '$800–$2,000', footTraffic: 'Low-Medium', bestFor: 'Essential services, value food' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium Demand — Mining Executive Market',
    description: "Mount Pleasant is Mackay's highest-quality hospitality opportunity. Mining executives and senior professionals with the highest per-visit spend in the region — and genuine appetite for quality that local operators have consistently underdelivered.",
    suburbs: [
      { name: 'Mount Pleasant', slug: 'mount-pleasant', description: "Mackay's most affluent suburb. Mining executive demographic with high per-visit spend, consistent trade, and genuine supply gaps for quality independents.", score: mScore('mount-pleasant'), verdict: mVerdict('mount-pleasant'), rentRange: '$2,000–$4,500/mo' },
    ],
  },
  {
    title: 'Commercial Hubs — Volume and Foot Traffic',
    description: 'The CBD and North Mackay deliver the highest foot traffic volumes. Competition is real — differentiation is required.',
    suburbs: [
      { name: 'Mackay CBD', slug: 'mackay-cbd', description: 'Caneland Central anchor, government employment, Whitsundays gateway visitors. Highest diversity of demand in the region.', score: mScore('mackay-cbd'), verdict: mVerdict('mackay-cbd'), rentRange: '$1,500–$3,500/mo' },
      { name: 'North Mackay', slug: 'north-mackay', description: 'Northern residential growth corridor with airport proximity. Growing family demographic underserved by quality hospitality.', score: mScore('north-mackay'), verdict: mVerdict('north-mackay'), rentRange: '$1,200–$3,000/mo' },
      { name: 'Andergrove', slug: 'andergrove', description: "Northern Beaches gateway suburb. Fast-growing residential area with a young family demographic — the region's clearest first-mover opportunity.", score: mScore('andergrove'), verdict: mVerdict('andergrove'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'Coastal Lifestyle — Northern Beaches',
    description: 'Blacks Beach and Eimeo have genuine coastal lifestyle demand. Seasonal variation is real — local community loyalty is what sustains these operators through the quieter months.',
    suburbs: [
      { name: 'Blacks Beach', slug: 'blacks-beach', description: 'Coastal lifestyle suburb with Eimeo-adjacent visitor draw. Modest seasonal variation — stronger local residential base than pure tourism markets.', score: mScore('blacks-beach'), verdict: mVerdict('blacks-beach'), rentRange: '$1,200–$2,500/mo' },
      { name: 'Eimeo', slug: 'eimeo', description: 'Northern Beaches headland coastal suburb. Very low competition, lifestyle dining gap, genuine weekend visitor market.', score: mScore('eimeo'), verdict: mVerdict('eimeo'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
  {
    title: 'Specialist and Industrial Markets',
    description: 'Sarina and Paget serve distinct market segments. Not general hospitality opportunities — suited to operators who explicitly target these niche catchments.',
    suburbs: [
      { name: 'Sarina', slug: 'sarina', description: "Sugar industry southern satellite. Agricultural service community — seasonal sugar worker demand adds episodic uplift. Essential-service and value concepts perform.", score: mScore('sarina'), verdict: mVerdict('sarina'), rentRange: '$800–$2,000/mo' },
      { name: 'Paget', slug: 'paget', description: 'Industrial and trade services precinct. B2B and working-professional demand — high-volume lunch trade for the right operator, not a general hospitality location.', score: mScore('paget'), verdict: mVerdict('paget'), rentRange: '$800–$2,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a café in Mackay?',
    answer: "Mount Pleasant is the strongest demographic play — the highest-income customers in the region, a mining-executive base with premium spend expectations, and genuine supply gaps for quality operators. The honest constraint is that FIFO work schedules create less predictable daily trade than a purely residential suburb. Mackay CBD is the alternative for operators who want higher foot traffic volume and a broader demand mix including the Whitsundays gateway tourist segment.",
  },
  {
    question: 'How does the mining boom/bust cycle affect Mackay hospitality?',
    answer: "This is the central risk for any Mackay business and must be modelled honestly. When Bowen Basin coal prices are strong and mine activity is at capacity, Mount Pleasant and inner Mackay see significant discretionary spend from well-paid FIFO workers and mining executives. When commodity prices fall and mine activity contracts, this spending contracts sharply. Operators who set their cost base based on boom-cycle revenue will fail during downturns. The structural mitigation is low rent — Mackay's below-market commercial rents create a lower break-even threshold that helps operators survive down cycles.",
  },
  {
    question: 'What is the Whitsundays spillover opportunity in Mackay?',
    answer: "Mackay Airport is the primary gateway for Whitsundays-bound domestic visitors — a significant transit flow that passes through the CBD before heading north. CBD hospitality operators capture pre-departure and arrival spending from visitors who overnight in Mackay. This is a genuine but secondary revenue layer — it supplements local demand rather than replacing it. Operators should not build their primary business case on Whitsundays transit spend.",
  },
  {
    question: 'Is the Northern Beaches area worth considering?',
    answer: "Andergrove and North Mackay represent genuine first-mover opportunities in Mackay's fastest-growing residential corridor. The population growth is outpacing hospitality supply, creating demand gaps for quality operators who establish community loyalty early. The trade-off is that these are emerging rather than established markets — operators need the patience and capital to build a customer base over 12–18 months before trade fully matures.",
  },
  {
    question: 'What makes Mackay different from other North Queensland cities?',
    answer: "Mackay has a more pronounced two-speed economy than Cairns or Townsville. The mining executive and FIFO worker segment spends at a materially higher per-visit rate than the broader population — which creates excellent conditions for premium quality operators in Mount Pleasant but makes it difficult to plan consistent trade across the whole city. Cairns has more consistent tourism-driven demand year-round. Townsville has a larger, more diverse economic base. Mackay's advantage is low rents and genuine premium demand in its affluent suburbs.",
  },
  {
    question: 'What are the main risks of opening in Mackay?',
    answer: "Three distinct risks. Mining-cycle sensitivity: a commodity downturn can reduce discretionary spending across the region by 15–25% within 6–12 months. Cyclone season: Mackay has experienced significant cyclones historically (Yasi passed near Mackay in 2011) — operators should hold adequate business interruption insurance and model for seasonal revenue disruption from July to November. Market scale: at 85,000 people, Mackay is a genuine but small regional market — maximum revenue ceilings are lower than capital cities, and operators with ambitious growth plans will find the addressable market constraining.",
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

function MackayFactorDirectory() {
  const suburbs = getMackaySuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/mackay/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function MackayPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Mackay"
        citySlug="mackay"
        tagline="Sugar and coal built Mackay. Mining executives in Mount Pleasant spend at premium rates — but the boom/bust cycle is real, and operators who model only the boom will fail in the bust."
        statChips={[
          { text: '8 suburbs scored — CBD to Northern Beaches coastal' },
          { text: 'Mount Pleasant: highest per-visit spend in the region' },
          { text: 'Commercial rents from $1,500/month' },
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
            { label: 'Market Risks', href: '#market-risks' },
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
              { value: '85K', label: "Mackay urban population — regional city with two-speed spending economy", source: 'ABS 2024' },
              { value: 'Mt Pleasant', label: "Highest per-visit spend suburb — mining executive and senior professional demographic", source: 'Locatalyze' },
              { value: '$1.5K', label: 'Commercial rents from $1,500/month — materially below comparable Queensland cities', source: 'REIQ Q1 2026' },
              { value: 'Bowen Basin', label: 'Gateway city for the coal sector — boom/bust sensitivity is a real planning factor', source: 'Locatalyze' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Mackay Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Mackay is a sugar and coal city on the North Queensland coast, 970km north of Brisbane. The local economy is driven by agriculture (Mackay is the largest sugar-producing region in Australia), coal logistics for the Bowen Basin, and the associated professional and FIFO worker demographics that both industries generate. For independent business operators, the critical fact is that Mackay has a genuinely two-speed economy: the mining executive and FIFO worker segment spends at a significantly higher per-visit rate than the broader population, but this segment is sensitive to commodity price cycles in ways that a diversified economy is not.",
              "Mount Pleasant is where this premium demand concentrates. It is Mackay's most affluent suburb, and a quality independent café or restaurant in Mount Pleasant faces a customer base that will spend $30–$50 per visit consistently, expects quality that most current local operators do not deliver, and rewards operators who get it right with high loyalty. The risk is that FIFO work schedules create less predictable daily trade than a purely residential suburb — the peaks and troughs within a week are more pronounced.",
              "The CBD and Northern Beaches growth corridor represent different opportunities. Caneland Central anchors the CBD as Mackay's main commercial hub, generating diverse foot traffic from retail, government employment, and the Whitsundays gateway tourism segment. The Northern Beaches suburbs — Andergrove, North Mackay — are growing residential areas where hospitality supply has consistently lagged behind population growth, creating genuine first-mover opportunities for operators who are willing to build a customer base in an emerging market.",
              "The honest risk assessment is important: Mackay has experienced cyclone impacts (Yasi passed near Mackay in 2011 causing significant damage) and mining downturns (the coal price collapse of 2014–2016 hit Mackay discretionary spending hard). Operators should model conservative scenarios, maintain adequate insurance, and ensure their cost base — which should be manageable given Mackay's low commercial rents — can survive 3–6 months of reduced trade.",
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
              { type: 'Cafés & Specialty Coffee', insight: "Mount Pleasant is the clearest opportunity — premium demographic, supply gaps, and high per-visit spend. Mackay CBD delivers volume from the Caneland Central precinct and diverse demand. Andergrove and North Mackay offer first-mover positions in growing residential corridors.", best: ['Mount Pleasant', 'Mackay CBD', 'Andergrove'] },
              { type: 'Full-Service Restaurants', insight: "The CBD around Victoria Street is Mackay's primary restaurant precinct. Mount Pleasant works for premium quality dinner concepts targeting the mining executive demographic. Whitsundays gateway visitors add a tourism uplift to CBD dinner trade that suburban markets cannot replicate.", best: ['Mackay CBD', 'Mount Pleasant', 'North Mackay'] },
              { type: 'Retail (Independent)', insight: "Caneland Central and the CBD deliver the highest retail foot traffic. Mount Pleasant suits premium and specialty retail. Northern Beaches growth corridors are underserved by specialty retail relative to their growing demographic.", best: ['Mackay CBD', 'Mount Pleasant', 'Andergrove'] },
              { type: 'Fitness & Wellness', insight: "Mount Pleasant has the income demographics to sustain premium boutique fitness and allied health at higher price points. North Mackay and Andergrove have growing residential populations with demand for convenience-focused wellness formats.", best: ['Mount Pleasant', 'North Mackay', 'Mackay CBD'] },
              { type: 'Coastal and Lifestyle Concepts', insight: "Blacks Beach and Eimeo serve a Northern Beaches coastal lifestyle market with genuine demand for café and casual dining concepts that match the beachside environment. Weekend visitor trade adds a tourism uplift to both markets.", best: ['Blacks Beach', 'Eimeo'] },
              { type: 'Trade and Industrial Services', insight: "Paget is the only viable market for B2B food concepts targeting the trade and industrial worker demographic. High-volume, fast-service lunch formats are the specific opportunity — general hospitality is not suited to this precinct.", best: ['Paget'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Mackay Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Mount Pleasant', slug: 'mount-pleasant', verdict: mVerdict('mount-pleasant'), score: mScore('mount-pleasant'), rentFrom: '$2,000/mo', body: "The region's highest per-visit spend market. Mining executives and senior professionals with premium quality expectations that existing operators consistently underdeliver. Lower competition than the demographic quality suggests. The caveat: FIFO scheduling creates less predictable day-to-day trade patterns — model the weekly trade cycle, not just the daily average." },
              { rank: 2, name: 'Mackay CBD', slug: 'mackay-cbd', verdict: mVerdict('mackay-cbd'), score: mScore('mackay-cbd'), rentFrom: '$1,500/mo', body: "Caneland Central, Victoria Street, and the wider CBD deliver the most diverse demand base in Mackay. Government employment provides reliable weekday lunch trade. Whitsundays gateway visitors add tourism spend. Competition is the highest in the region at 6/10 — generic concepts are outcompeted; quality differentiators sustain." },
              { rank: 3, name: 'North Mackay', slug: 'north-mackay', verdict: mVerdict('north-mackay'), score: mScore('north-mackay'), rentFrom: '$1,200/mo', body: "Northern residential growth corridor with growing airport-adjacent visitor activity. Hospitality supply is lagging behind the population growth — first-mover operators who establish community loyalty capture the market before competition catches up." },
              { rank: 4, name: 'Andergrove', slug: 'andergrove', verdict: mVerdict('andergrove'), score: mScore('andergrove'), rentFrom: '$1,200/mo', body: "Northern Beaches gateway and fastest-growing residential suburb. Young families are driving demand for child-friendly café and casual dining formats that are genuinely absent. New development commercial tenancies are priced to attract operators into the emerging precinct." },
              { rank: 5, name: 'Blacks Beach', slug: 'blacks-beach', verdict: mVerdict('blacks-beach'), score: mScore('blacks-beach'), rentFrom: '$1,200/mo', body: "Coastal lifestyle suburb with a stable residential base and modest tourism draw. More balanced year-round trade than pure Northern Beaches tourist locations — the local community sustains operators through the quieter months." },
              { rank: 6, name: 'Eimeo', slug: 'eimeo', verdict: mVerdict('eimeo'), score: mScore('eimeo'), rentFrom: '$1,200/mo', body: "Northern Beaches headland with low competition and a genuine lifestyle dining gap. Weekend visitor trade from Mackay proper adds revenue beyond the local residential base. Best suited to café and casual dining concepts with outdoor seating and coastal positioning." },
              { rank: 7, name: 'Sarina', slug: 'sarina', verdict: mVerdict('sarina'), score: mScore('sarina'), rentFrom: '$800/mo', body: "Sugar industry southern satellite. Genuine agricultural community demand for essential-service food and hospitality. Seasonal sugar workers add episodic demand during the crushing season. Low rents, low volume ceiling — viable for correctly calibrated, low-overhead concepts." },
              { rank: 8, name: 'Paget', slug: 'paget', verdict: mVerdict('paget'), score: mScore('paget'), rentFrom: '$800/mo', body: "Industrial and trade services precinct. Not a general hospitality market — the B2B and working-professional customer base requires a format specifically designed for high-volume, fast-service trade worker lunch. Wrong format: fails. Right format: sustainable niche." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/mackay/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Mackay address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Mackay address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#E0F2FE', color: '#0C4A6E', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Mackay address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Mackay Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="mackay" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Mackay Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Mount Pleasant vs Mackay CBD', body: "Mount Pleasant delivers better customer quality — premium spend, lower competition, and high loyalty from operators who execute well. Mackay CBD delivers more customer diversity and higher daily transaction volume. For premium experience-led concepts, Mount Pleasant wins. For operators who need consistent daily transaction volume and a mixed customer base, the CBD offers a more resilient demand foundation." },
              { title: 'Andergrove vs North Mackay', body: "Both are Northern Beaches growth corridor first-mover opportunities. Andergrove is further into the Northern Beaches growth corridor with a slightly younger demographic and higher residential growth rate. North Mackay sits closer to the CBD and the airport, giving it the transit visitor benefit that Andergrove lacks. For operators who want the purest residential community-building play, Andergrove. For airport-adjacent hospitality with mixed demand, North Mackay." },
              { title: 'Blacks Beach vs Eimeo', body: "Blacks Beach has a more established residential base and slightly more existing competition — a more predictable market with known trade patterns. Eimeo has lower competition and a stronger lifestyle positioning, but the market is smaller and requires more patience to build. Both markets suit operators who genuinely want to serve a coastal community rather than a tourism-dependent destination." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="market-risks" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Mackay Market Risks — Be Honest Before You Sign</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three structural risks that every Mackay business plan must address explicitly.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Mining-cycle dependency', why: "When Bowen Basin coal prices fall sharply, Mackay discretionary spending contracts within 6–12 months. The 2014–2016 coal price collapse reduced hospitality trade in Mount Pleasant and the CBD by an estimated 20–30%. Operators must model conservative downside scenarios and maintain a cost base survivable on 75% of projected revenue." },
              { name: 'Cyclone season', why: "Mackay is in the cyclone belt. Tropical Cyclone Yasi (2011) caused significant damage across the region, and the broader Mackay area has experienced multiple named cyclones in the past 30 years. Business interruption insurance is essential, and seasonal revenue planning should account for storm events that force closures for days to weeks during the November–April season." },
              { name: 'Two-speed economy trap', why: "Operators who set their price point and cost base for the Mount Pleasant mining executive demographic and then discover their actual customer mix includes a much broader price-sensitive cohort face a structural mismatch. Know your specific customer segment before you commit to a location and a price positioning." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Mackay Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <MackayFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Mackay Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Mackay location?"
        subtitle="Run a free analysis on any Mackay address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/mackay/mount-pleasant" style={{ color: C.brand, textDecoration: 'none' }}>Mount Pleasant Analysis →</Link>
          <Link href="/analyse/mackay/mackay-cbd" style={{ color: C.brand, textDecoration: 'none' }}>CBD Analysis →</Link>
          <Link href="/analyse/mackay/andergrove" style={{ color: C.brand, textDecoration: 'none' }}>Andergrove Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
