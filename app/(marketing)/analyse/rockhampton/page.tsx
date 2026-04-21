// app/(marketing)/analyse/rockhampton/page.tsx
// Rockhampton city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getRockhamptonSuburb, getRockhamptonSuburbs } from '@/lib/analyse-data/rockhampton'

function rScore(slug: string): number {
  return getRockhamptonSuburb(slug)?.compositeScore ?? 0
}
function rVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getRockhamptonSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Rockhampton — 2026 Location Guide',
  description:
    'Rockhampton business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Rockhampton suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/rockhampton' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Rockhampton — 2026 Location Guide',
    description: '8 Rockhampton suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/rockhampton',
  },
}

const COMPARISON_ROWS = [
  { name: 'The Range', score: rScore('the-range'), verdict: rVerdict('the-range'), rent: '$2,000–$4,500', footTraffic: 'Medium-High', bestFor: 'Premium café, specialty food, allied health' },
  { name: 'Rockhampton CBD', score: rScore('rockhampton-cbd'), verdict: rVerdict('rockhampton-cbd'), rent: '$1,500–$3,500', footTraffic: 'High', bestFor: 'Hospitality, retail, professional services' },
  { name: 'North Rockhampton', score: rScore('north-rockhampton'), verdict: rVerdict('north-rockhampton'), rent: '$1,500–$3,000', footTraffic: 'High', bestFor: 'Casual dining, convenience retail, services' },
  { name: 'Yeppoon', score: rScore('yeppoon'), verdict: rVerdict('yeppoon'), rent: '$1,500–$3,000', footTraffic: 'Medium (seasonal)', bestFor: 'Hospitality, lifestyle retail, tourism concepts' },
  { name: 'Park Avenue', score: rScore('park-avenue'), verdict: rVerdict('park-avenue'), rent: '$1,200–$2,800', footTraffic: 'Medium', bestFor: 'Café, casual dining, professional services' },
  { name: 'Norman Gardens', score: rScore('norman-gardens'), verdict: rVerdict('norman-gardens'), rent: '$1,200–$2,800', footTraffic: 'Medium', bestFor: 'Convenience food, casual dining' },
  { name: 'Gracemere', score: rScore('gracemere'), verdict: rVerdict('gracemere'), rent: '$800–$2,000', footTraffic: 'Low-Medium', bestFor: 'Essential services, value food' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Best-Value Entry — Professional Demand, Lower Rents',
    description: "Rockhampton's highest-quality demand at costs that make the numbers work for independent operators. The income demographics are real; the rents have not caught up.",
    suburbs: [
      { name: 'The Range', slug: 'the-range', description: "Rockhampton's most affluent suburb. Mining executives and professionals with high per-visit spend and genuine appetite for quality independents.", score: rScore('the-range'), verdict: rVerdict('the-range'), rentRange: '$2,000–$4,500/mo' },
      { name: 'Park Avenue', slug: 'park-avenue', description: 'Professional inner suburb. Stable repeat trade, loyal community base, low competition relative to demographic quality.', score: rScore('park-avenue'), verdict: rVerdict('park-avenue'), rentRange: '$1,200–$2,800/mo' },
      { name: 'Norman Gardens', slug: 'norman-gardens', description: 'Southern growth suburb. Growing family demographic underserved by quality hospitality — first-mover window is open.', score: rScore('norman-gardens'), verdict: rVerdict('norman-gardens'), rentRange: '$1,200–$2,800/mo' },
    ],
  },
  {
    title: 'Commercial Hubs — Volume and Footfall',
    description: 'Rockhampton CBD and North Rockhampton deliver the highest foot traffic volumes. Competition is real here — differentiation is required.',
    suburbs: [
      { name: 'Rockhampton CBD', slug: 'rockhampton-cbd', description: 'Heritage Quay Street precinct, Fitzroy River foreshore, CQUniversity proximity. Diverse demand — office workers, students, visitors.', score: rScore('rockhampton-cbd'), verdict: rVerdict('rockhampton-cbd'), rentRange: '$1,500–$3,500/mo' },
      { name: 'North Rockhampton', slug: 'north-rockhampton', description: 'Stockland shopping centre anchor. Highest retail foot traffic outside the CBD. Chain-heavy competition — independents need a clear point of difference.', score: rScore('north-rockhampton'), verdict: rVerdict('north-rockhampton'), rentRange: '$1,500–$3,000/mo' },
    ],
  },
  {
    title: 'Seasonal Market — Capricorn Coast',
    description: 'Yeppoon is a separate market from Rockhampton proper. Strong tourism revenue in peak season, genuine local residential base in the off-season. Seasonal strategy is mandatory.',
    suburbs: [
      { name: 'Yeppoon', slug: 'yeppoon', description: 'Capricorn Coast beach town 45km east. Esplanade tourism trade in peak season plus a growing local residential base that sustains year-round.', score: rScore('yeppoon'), verdict: rVerdict('yeppoon'), rentRange: '$1,500–$3,000/mo' },
    ],
  },
  {
    title: 'Lower-Volume Markets',
    description: 'Viable for correctly calibrated, low-overhead concepts. Not hidden gems — honest markets with real scale limitations.',
    suburbs: [
      { name: 'Frenchville', slug: 'frenchville', description: 'Northern mid-market residential. Consistent but modest trade — rewards operators who become genuine community institutions.', score: rScore('frenchville'), verdict: rVerdict('frenchville'), rentRange: '$1,000–$2,500/mo' },
      { name: 'Gracemere', slug: 'gracemere', description: 'Mining-adjacent western satellite. FIFO worker episodic demand. Lowest rents in the region, lowest revenue ceiling.', score: rScore('gracemere'), verdict: rVerdict('gracemere'), rentRange: '$800–$2,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a café in Rockhampton?',
    answer: "The Range is the strongest pure demographic play for a quality café — the highest household income in the region, a professional customer base that visits consistently, and genuine supply gaps for well-positioned independents. The honest constraint is market scale: Rockhampton has a population of 87,000. The Range rewards operators who build genuine community loyalty rather than relying on volume. For higher foot traffic at lower rent, the CBD around Quay Street delivers professional and student demand with strong heritage tourism uplift.",
  },
  {
    question: 'How does Rockhampton compare to other Queensland regional cities?',
    answer: "Rockhampton sits between Toowoomba (130,000 pop, stronger economy) and Mackay (85,000 pop, mining-dependent) in terms of market size and stability. Commercial rents are among the lowest for any Queensland city, which is the structural advantage. The trade-off is volume — a strong Rockhampton location generates materially less revenue than an equivalent Cairns or Gold Coast position. Break-even is achievable at lower thresholds, but maximum revenue is also lower. Operators who thrive here are those who correctly calibrate expectations and build durable community-based businesses.",
  },
  {
    question: 'Is the Rockhampton CBD worth considering for an independent restaurant?',
    answer: "The CBD around Quay Street and the Fitzroy River foreshore is the most viable location for food and beverage in Rockhampton outside The Range. Heritage tourism, CQUniversity activity, RAAF Base proximity, and regular Fitzroy River foreshore events create a genuine mixed-demand environment. Rents are low — $1,500–$3,000/month — making break-even achievable at modest volumes. The honest caveat: competition is the highest in Rockhampton, and generic concepts struggle against established incumbents.",
  },
  {
    question: 'What is the opportunity in Yeppoon?',
    answer: "Yeppoon is a separate market from Rockhampton proper — the Capricorn Coast beach town 45km east has its own tourism-driven hospitality economy. The whale-watching and beach tourism season generates real revenue uplift, and the esplanade strip is genuinely underserved by quality independent operators. The risk is the same as any seasonal coastal market: November to April is softer, and operators who model peak-season revenue across 12 months consistently disappoint themselves. Build a local residential loyal base first, and treat the tourist season as an uplift.",
  },
  {
    question: "Who is the Rockhampton business customer?",
    answer: "Rockhampton has four distinct customer segments that behave very differently. CQUniversity students (16,000+) drive volume-based, price-sensitive demand in the CBD. Mining and resource sector professionals — concentrated in The Range and surrounding inner suburbs — drive premium, consistent spend. Government and health sector employees create reliable weekday lunch demand. RAAF Base Rockhampton personnel add a stable military-professional segment. Understanding which segment you are targeting determines which location makes sense.",
  },
  {
    question: 'What are the main risks for a new business in Rockhampton?',
    answer: "The primary risk is market size: at 87,000 people, Rockhampton rewards specialists and community-embedded operators rather than growth-stage ambitions. The secondary risk is the mining-sector sensitivity — regional economic downturns (commodity price falls, mine closures) affect discretionary spending across the region, including in affluent suburbs like The Range. Operators should model conservative scenarios that account for 15–20% revenue softening during downturns. The structural advantage — very low rents — means the break-even hurdle is low enough to survive periods of softness.",
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

function RockhamptonFactorDirectory() {
  const suburbs = getRockhamptonSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/rockhampton/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function RockhamptonPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Rockhampton"
        citySlug="rockhampton"
        tagline="The Beef Capital of Australia has a genuine independent hospitality market — low rents, mining-sector professional demand, and a student population that is consistently underserved by quality operators."
        statChips={[
          { text: '8 suburbs scored — CBD to Capricorn Coast' },
          { text: 'CQUniversity: 16,000+ students in the region' },
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
            { label: 'Market Context', href: '#market-context' },
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
              { value: '87K', label: 'Rockhampton urban population — regional city with consistent demand base', source: 'ABS 2024' },
              { value: '16K+', label: 'CQUniversity students generating CBD and inner-suburb hospitality demand', source: 'CQUniversity 2025' },
              { value: '$1.5K', label: 'Commercial rents from $1,500/month — among the lowest of any Queensland city', source: 'REIQ Q1 2026' },
              { value: '45km', label: 'To Yeppoon — Capricorn Coast beach town with separate seasonal market', source: 'Locatalyze' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Rockhampton Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Rockhampton is Australia's Beef Capital — it hosts the largest cattle saleyards in the Southern Hemisphere, the annual Beef Australia exposition, and a regional economy tied to agriculture, mining services, the Bowen Basin, and RAAF Base Rockhampton. For independent business operators, the relevant fact is this: the city's 87,000 population sustains a genuine independent hospitality and retail market with commercial rents that are among the lowest of any Queensland city centre.",
              "The demand structure is more diverse than Rockhampton's regional reputation suggests. CQUniversity's 16,000+ students create price-sensitive but volume-consistent demand in the CBD and inner suburbs. Mining and resource sector professionals — concentrated in The Range and Park Avenue — represent premium-spend customers who will pay well for quality. Government, health, and education employment creates reliable weekday demand. RAAF Base Rockhampton adds a stable professional military demographic to the northern catchment.",
              "The honest assessment of Rockhampton's scale is important. This is an 87,000-person city, not 500,000. A well-positioned café in The Range will build a loyal base of several hundred regulars and generate steady, sustainable income — it will not scale to a multi-site operation. Operators who enter Rockhampton with realistic expectations for a regional community business will find a market that rewards execution. Operators who project Brisbane-scale growth from a Rockhampton location will be disappointed.",
              "Yeppoon, 45km east on the Capricorn Coast, is a genuinely distinct market from Rockhampton proper. The beach town has its own tourism-driven hospitality economy — the esplanade strip, Great Keppel Island gateway activity, and domestic holiday traffic create revenue dynamics that are separate from the inland city. Operators who can serve both markets should treat Yeppoon as supplementary rather than substitute.",
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
              { type: 'Cafés & Specialty Coffee', insight: "The Range is the clearest opportunity — professional and mining-executive demographic with Melbourne-calibre expectations at regional rent. The CBD (Quay Street) delivers volume from students and heritage visitors. Park Avenue and Norman Gardens reward patient community-builders with loyal repeat trade.", best: ['The Range', 'Rockhampton CBD', 'Park Avenue'] },
              { type: 'Full-Service Restaurants', insight: "Quay Street and the Fitzroy River foreshore in the CBD is Rockhampton's primary restaurant precinct — heritage tourism, event-day crowds, and a professional dinner market. Yeppoon's esplanade is the alternative for operators who can manage the seasonal trade profile.", best: ['Rockhampton CBD', 'Yeppoon', 'The Range'] },
              { type: 'Retail (Independent)', insight: "North Rockhampton around Stockland delivers the highest retail foot traffic volume. The Range suits premium and specialty retail with a high-income residential catchment. The CBD suits lifestyle and gift retail with heritage tourist uplift.", best: ['North Rockhampton', 'The Range', 'Rockhampton CBD'] },
              { type: 'Fitness & Wellness', insight: "Wellness spend follows income demographics. The Range and Park Avenue have the household income base to support boutique fitness and allied health at premium pricing. The CBD suits high-volume, value-positioned wellness formats.", best: ['The Range', 'Park Avenue', 'Rockhampton CBD'] },
              { type: 'Professional Services', insight: "The CBD concentrates corporate and government professional services. The Range suits high-end professional practices serving the mining and management demographic.", best: ['Rockhampton CBD', 'The Range'] },
              { type: 'Takeaway & Casual Food', insight: "North Rockhampton delivers the highest foot traffic volume for casual food through the Stockland centre. Frenchville and Norman Gardens offer lower rents with a captive residential catchment that values convenience.", best: ['North Rockhampton', 'Norman Gardens', 'Frenchville'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Rockhampton Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'The Range', slug: 'the-range', verdict: rVerdict('the-range'), score: rScore('the-range'), rentFrom: '$2,000/mo', body: "The Range is Rockhampton's clearest quality opportunity — the region's highest household income, a professional and mining-executive demographic with genuine appetite for quality, and competition that is lower than the demographic deserves. The trade-off is volume: this is an affluent suburb in an 87,000-person city. Operators build loyal, high-value customer bases, not high-volume trade." },
              { rank: 2, name: 'Rockhampton CBD', slug: 'rockhampton-cbd', verdict: rVerdict('rockhampton-cbd'), score: rScore('rockhampton-cbd'), rentFrom: '$1,500/mo', body: "Quay Street and the Fitzroy River foreshore deliver the most diverse demand in Rockhampton — heritage tourism, CQUniversity proximity, professional services employment, and RAAF Base visitor activity. Competition is 6/10, the highest in the region. Only differentiated concepts should enter — generic formats are outcompeted by established incumbents." },
              { rank: 3, name: 'North Rockhampton', slug: 'north-rockhampton', verdict: rVerdict('north-rockhampton'), score: rScore('north-rockhampton'), rentFrom: '$1,500/mo', body: "Stockland Rockhampton anchors the largest retail foot traffic volumes outside the CBD. The challenge for independents is competing with the chain and major-operator presence the centre attracts. Surrounding streets and specialty tenancies within the centre offer access to foot traffic at lower direct competition." },
              { rank: 4, name: 'Yeppoon', slug: 'yeppoon', verdict: rVerdict('yeppoon'), score: rScore('yeppoon'), rentFrom: '$1,500/mo', body: "The Capricorn Coast's main beach town is a separate seasonal hospitality market. Tourism uplift during school holidays and the summer season creates genuine revenue above the local residential baseline. The failure mode is operators who model tourist-season revenue as year-round — build the local loyal base first, and treat visitor trade as an upside." },
              { rank: 5, name: 'Park Avenue', slug: 'park-avenue', verdict: rVerdict('park-avenue'), score: rScore('park-avenue'), rentFrom: '$1,200/mo', body: "Professional inner suburb with strong repeat trade dynamics. Loyal customers who visit consistently — not a high-volume market, but a reliable one. Suits operators who want predictable income and a community they genuinely know." },
              { rank: 6, name: 'Norman Gardens', slug: 'norman-gardens', verdict: rVerdict('norman-gardens'), score: rScore('norman-gardens'), rentFrom: '$1,200/mo', body: "Growing southern residential suburb with a newer family demographic that currently travels further than it needs to for quality food. First-mover window is open for operators who establish community loyalty before supply catches up with demand." },
              { rank: 7, name: 'Frenchville', slug: 'frenchville', verdict: rVerdict('frenchville'), score: rScore('frenchville'), rentFrom: '$1,000/mo', body: "Northern mid-market residential. Very low competition and very low rent — the economics work for modest-volume concepts that become genuine local institutions. Not a growth market; a stability market." },
              { rank: 8, name: 'Gracemere', slug: 'gracemere', verdict: rVerdict('gracemere'), score: rScore('gracemere'), rentFrom: '$800/mo', body: "Mining-adjacent satellite town. FIFO worker episodic spending does not translate to consistent daily trade. The lowest rents in the region make break-even viable for essential-service concepts at very low revenue targets — but the market ceiling is also genuinely low." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/rockhampton/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Rockhampton address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Rockhampton address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FFF7ED', color: '#431407', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Rockhampton address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Rockhampton Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="rockhampton" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Rockhampton Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'The Range vs Rockhampton CBD', body: "The Range offers better demographic quality — the highest-income customers in the region, lower competition, and consistent repeat trade. The CBD offers better volume — a broader demand base from students, tourists, and office workers. Operators with a premium, experience-driven concept should favour The Range. Operators who need higher daily transactions to cover costs should consider the CBD." },
              { title: 'Rockhampton CBD vs North Rockhampton', body: "The CBD around Quay Street delivers a more diverse and interesting demand mix — heritage tourism, university proximity, professional services. North Rockhampton delivers higher retail foot traffic volume through Stockland. For food and beverage independents seeking character and mixed demand, the CBD wins. For retail and convenience food seeking raw volume, North Rockhampton has the numbers." },
              { title: 'Rockhampton vs Yeppoon', body: "These are two separate markets that require different strategies. Rockhampton is an inland regional city with consistent year-round demand from its resident population. Yeppoon is a coastal beach town with seasonal tourism peaks and a smaller residential base. The two markets rarely substitute — operators choosing between them should assess which demand profile better fits their concept and their capacity to manage seasonality." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="market-context" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Market Context — What Rockhampton Is and Is Not</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>An honest account of the risks and realities of operating in a regional Queensland city.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Mining-cycle sensitivity', why: "Rockhampton's professional class is significantly tied to the Bowen Basin mining sector. When commodity prices fall and mine activity contracts, discretionary spending across the region softens — including in affluent suburbs like The Range. Operators should model a 15–20% revenue reduction scenario for mining downturns and ensure their cost base can survive it." },
              { name: 'Market scale', why: "At 87,000 people, Rockhampton is a genuine regional city with a sustainable hospitality market — but maximum revenue ceilings are materially lower than capital cities or major regional centres like Cairns or Townsville. Operators who plan for this from the beginning build sustainable businesses. Those who expect Brisbane-scale growth will be consistently disappointed." },
              { name: 'North Rockhampton without differentiation', why: "The Stockland centre and surrounding strip attract chain and franchise operators who are optimised for volume. Independent operators who enter North Rockhampton without a clear point of difference face direct comparison with chains that have lower costs and higher marketing budgets." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Rockhampton Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <RockhamptonFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Rockhampton Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Rockhampton location?"
        subtitle="Run a free analysis on any Rockhampton address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/rockhampton/the-range" style={{ color: C.brand, textDecoration: 'none' }}>The Range Analysis →</Link>
          <Link href="/analyse/rockhampton/rockhampton-cbd" style={{ color: C.brand, textDecoration: 'none' }}>CBD Analysis →</Link>
          <Link href="/analyse/rockhampton/yeppoon" style={{ color: C.brand, textDecoration: 'none' }}>Yeppoon Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
