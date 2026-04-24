// app/(marketing)/analyse/gold-coast/page.tsx
// Gold Coast city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getGoldCoastSuburb, getGoldCoastSuburbs } from '@/lib/analyse-data/gold-coast'

function gcScore(slug: string): number {
  return getGoldCoastSuburb(slug)?.compositeScore ?? 0
}
function gcVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getGoldCoastSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business on the Gold Coast — 2026 Location Guide',
  description:
    'Gold Coast business location guide 2026. 20 suburbs scored by tourism dependency, rent viability, foot traffic, and competition gap. Find the best Gold Coast suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/gold-coast' },
  openGraph: {
    title: 'Best Suburbs to Open a Business on the Gold Coast — 2026 Location Guide',
    description: '20 Gold Coast suburbs ranked and scored. Rent benchmarks, tourism and seasonality data, best business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/gold-coast',
  },
}

const COMPARISON_ROWS = [
  { name: 'Burleigh Heads', score: gcScore('burleigh-heads'), verdict: gcVerdict('burleigh-heads'), rent: '$4,500–$9,000', footTraffic: 'Very High', bestFor: 'Specialty cafe, quality casual dining, lifestyle retail' },
  { name: 'Broadbeach', score: gcScore('broadbeach'), verdict: gcVerdict('broadbeach'), rent: '$5,000–$12,000', footTraffic: 'Very High', bestFor: 'Premium casual dining, upscale cafe, cocktail bar' },
  { name: 'Mermaid Beach', score: gcScore('mermaid-beach'), verdict: gcVerdict('mermaid-beach'), rent: '$3,500–$6,500', footTraffic: 'Medium-High', bestFor: 'Premium breakfast cafe, casual dining, boutique wellness' },
  { name: 'Palm Beach', score: gcScore('palm-beach'), verdict: gcVerdict('palm-beach'), rent: '$2,500–$4,500', footTraffic: 'Medium', bestFor: 'Cafe (early-mover), casual dining, surf lifestyle retail' },
  { name: 'Southport', score: gcScore('southport'), verdict: gcVerdict('southport'), rent: '$3,000–$7,000', footTraffic: 'High (weekday)', bestFor: 'Corporate lunch cafe, healthcare-allied, professional services' },
  { name: 'Surfers Paradise', score: gcScore('surfers-paradise'), verdict: gcVerdict('surfers-paradise'), rent: '$8,000–$20,000', footTraffic: 'Extreme (seasonal)', bestFor: 'High-volume fast casual, tourist retail, nightlife venues' },
  { name: 'Coolangatta', score: gcScore('coolangatta'), verdict: gcVerdict('coolangatta'), rent: '$2,500–$4,500', footTraffic: 'Medium', bestFor: 'Surf-identity cafe, casual beachside dining, food retail' },
  { name: 'Robina', score: gcScore('robina'), verdict: gcVerdict('robina'), rent: '$2,500–$5,500', footTraffic: 'Medium', bestFor: 'Casual family dining, health food cafe, practical services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Coastal Benchmark Strips — High Reward, High Entry',
    description: "The Gold Coast's strongest independent hospitality strips. Proven demand and quality customer base, but rents and competition require strong unit economics and a differentiated concept.",
    suburbs: [
      { name: 'Burleigh Heads', slug: 'burleigh-heads', description: "The Gold Coast's most established independent strip. James Street vacancy is estimated below 2% — the primary constraint is finding a site, not generating demand once you have one.", score: gcScore('burleigh-heads'), verdict: gcVerdict('burleigh-heads'), rentRange: '$4,500–$9,000/mo' },
      { name: 'Broadbeach', slug: 'broadbeach', description: 'Upscale mixed market. Pacific Fair and the casino precinct create a demand floor that moderates tourist-season volatility for operators in shoulder months.', score: gcScore('broadbeach'), verdict: gcVerdict('broadbeach'), rentRange: '$5,000–$12,000/mo' },
      { name: 'Main Beach', slug: 'main-beach', description: 'Luxury residential and Marina Mirage precinct. Very low competition. GO verdict applies specifically to premium concepts where low volume and high spend per head make unit economics work.', score: gcScore('main-beach'), verdict: gcVerdict('main-beach'), rentRange: '$4,000–$8,000/mo' },
      { name: 'Mermaid Beach', slug: 'mermaid-beach', description: 'Established affluent residential. Estimated 80%+ of commercial spending from locals — community loyalty is structurally higher than in tourist-adjacent suburbs.', score: gcScore('mermaid-beach'), verdict: gcVerdict('mermaid-beach'), rentRange: '$3,500–$6,500/mo' },
    ],
  },
  {
    title: 'Growth Strips — Best Rent-to-Demand Ratio',
    description: "Suburbs where demand is building but rents have not yet caught up. The early-mover window is open — these markets reward operators who establish now and build loyalty ahead of the re-pricing.",
    suburbs: [
      { name: 'Palm Beach', slug: 'palm-beach', description: "Best rent-adjusted opportunity on the coast right now. Population growth above GC average, surf culture demographic, and rents 45% below Burleigh at comparable demand trajectory.", score: gcScore('palm-beach'), verdict: gcVerdict('palm-beach'), rentRange: '$2,500–$4,500/mo' },
      { name: 'Miami', slug: 'miami', description: 'Emerging creative district between Burleigh and Mermaid Beach. The art precinct is editorially referenced — operators coherent with the precinct identity benefit from media attention at low cost.', score: gcScore('miami'), verdict: gcVerdict('miami'), rentRange: '$2,500–$4,500/mo' },
      { name: 'Coolangatta', slug: 'coolangatta', description: 'Southern border surf town with airport-corridor consistency and NSW cross-border catchment. Genuine local identity that community-focused operators can build on.', score: gcScore('coolangatta'), verdict: gcVerdict('coolangatta'), rentRange: '$2,500–$4,500/mo' },
      { name: 'Coomera', slug: 'coomera', description: "One of Queensland's fastest-growing residential corridors. Genuinely underserved relative to population. An operator who establishes now builds brand loyalty ahead of competition at below-market rents.", score: gcScore('coomera'), verdict: gcVerdict('coomera'), rentRange: '$1,800–$3,500/mo' },
    ],
  },
  {
    title: 'Professional and Family Hubs — Weekday-Dominant',
    description: 'Suburbs driven by residential families and weekday professionals. Low seasonality, consistent demand — but revenue models must account for the weekday/weekend split.',
    suburbs: [
      { name: 'Southport', slug: 'southport', description: "The Gold Coast's traditional commercial centre. Strong weekday professional demand from government, medical, and legal precincts. Light rail connection. Weekend volume is thin.", score: gcScore('southport'), verdict: gcVerdict('southport'), rentRange: '$3,000–$7,000/mo' },
      { name: 'Robina', slug: 'robina', description: 'Master-planned family suburb with Bond University corridor. Robina Town Centre exerts strong gravity over discretionary spending — operators positioned for Bond corridor find a less contested market.', score: gcScore('robina'), verdict: gcVerdict('robina'), rentRange: '$2,500–$5,500/mo' },
      { name: 'Helensvale', slug: 'helensvale', description: 'Northern GC family hub. Light rail station has created a morning commuter coffee window that is commercially meaningful for a well-positioned cafe on the commuter path.', score: gcScore('helensvale'), verdict: gcVerdict('helensvale'), rentRange: '$2,000–$4,000/mo' },
      { name: 'Varsity Lakes', slug: 'varsity-lakes', description: 'Bond University adjacent. Student-young professional mix with very low competition. Constraint is revenue per customer — premium pricing is not viable here.', score: gcScore('varsity-lakes'), verdict: gcVerdict('varsity-lakes'), rentRange: '$2,000–$3,800/mo' },
    ],
  },
  {
    title: 'Community Scale — Loyalty Model Required',
    description: 'Suburbs where passive foot traffic is insufficient for most formats. These markets reward operators explicitly building community-scale businesses, not growth-stage concepts.',
    suburbs: [
      { name: 'Labrador', slug: 'labrador', description: 'Multicultural residential on the Broadwater. Foreshore positions offer premium waterfront settings at prices well below beach-core strips — a gap that exists while the demographic transition continues.', score: gcScore('labrador'), verdict: gcVerdict('labrador'), rentRange: '$1,800–$3,500/mo' },
      { name: 'Ashmore', slug: 'ashmore', description: 'Middle suburban family area. Medical centre cluster creates reliable adjacent-visit foot traffic. Practical services demonstrably outperform hospitality here.', score: gcScore('ashmore'), verdict: gcVerdict('ashmore'), rentRange: '$1,800–$3,500/mo' },
      { name: 'Currumbin', slug: 'currumbin', description: 'Tourist-resident hybrid. Wildlife Sanctuary proximity drives school-holiday volume. Revenue is structurally seasonal — model across both peak-tourist and quiet-residential periods before committing.', score: gcScore('currumbin'), verdict: gcVerdict('currumbin'), rentRange: '$2,000–$3,500/mo' },
      { name: 'Tugun', slug: 'tugun', description: 'Lowest commercial rents on the GC coastal strip. Suits operators running a community loyalty model — high repeat local visits rather than new-customer acquisition. Airport proximity does not convert to strip trade.', score: gcScore('tugun'), verdict: gcVerdict('tugun'), rentRange: '$1,600–$3,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe on the Gold Coast?',
    answer: "Burleigh Heads is the Gold Coast's benchmark cafe market — the strongest year-round resident demand on the coast, a nationally recognised independent hospitality strip, and a customer demographic that sustains premium pricing. The honest caveat: James Street vacancy is estimated below 2%, so accessing a site is the primary constraint. The best rent-adjusted alternative for 2026 is Palm Beach, where a surf-culture demographic with genuine demand is growing faster than the rent market has repriced.",
  },
  {
    question: 'How does Gold Coast tourism affect businesses, and which suburbs benefit most?',
    answer: "Tourism on the Gold Coast is concentrated in Surfers Paradise, Broadbeach, and to a lesser extent Coolangatta and Currumbin. The critical insight is that tourism is a double-edged factor: it creates real peak-season volume but introduces winter shoulder periods that tourist-dependent revenue models cannot sustain. Surfers Paradise and Broadbeach see the highest tourist volumes — Broadbeach benefits from casino and Pacific Fair stabilising year-round trade, while Surfers Paradise has extreme seasonality that pressures most independent operators. Burleigh Heads and Mermaid Beach have low tourism dependency, which is their structural advantage: resident demand is consistent rather than seasonal.",
  },
  {
    question: "Is Surfers Paradise worth considering for an independent business?",
    answer: "Surfers Paradise is viable for specific formats: high-volume fast casual, tourist retail, and nightlife-adjacent venues designed for throughput. It is hostile to most independent operators because rent at $8,000–$20,000/month combined with extreme seasonality creates a structural pressure that requires tourist-scale volumes to survive. A cafe concept in Surfers Paradise at a $12,000/month midpoint rent would need indicatively 280–350+ customer visits per day at $28–35 average spend just to cover rent — in mid-year shoulder periods, most independent operators fall well short of this threshold.",
  },
  {
    question: 'What is the outlook for Palm Beach as a business location in 2026?',
    answer: "Palm Beach is the best rent-adjusted opportunity on the Gold Coast right now. Population growth in the southern corridor is above GC average, the surf culture demographic has genuine hospitality spending habits, and rents at $2,500–$4,500/month are materially below Burleigh while demand trends upward. The gap between Burleigh and Palm Beach rents has been narrowing — operators who establish now do so at lower rent before the market reprices as the strip matures. Palm Beach requires patience: a 12–18 month establishment runway is realistic, not exceptional.",
  },
  {
    question: 'Which Gold Coast suburbs have the lowest seasonality risk?',
    answer: "Mermaid Beach, Southport, Robina, and Varsity Lakes all have seasonality risk scores of 2/10 — the lowest in the dataset. These suburbs are driven by resident and professional demand that does not fluctuate materially across school holiday cycles. Burleigh Heads has a seasonality risk of 3/10, which is very low given the coast's tourist profile. This reflects the strong year-round resident base that moderates the tourist-season overlay. For operators who need revenue predictability rather than peak-season upside, these suburbs are the most reliable year-round markets.",
  },
  {
    question: 'How does the theme park corridor (Coomera, Helensvale) perform for strip businesses?',
    answer: "Theme park proximity does not meaningfully benefit strip operators. Theme park visitors transit through the corridor — they do not stop at local strips. Helensvale's light rail station has created a commuter coffee window that is commercially real, but this is a commuter dynamic, not a theme park dynamic. Coomera is interesting for a different reason: it is one of Queensland's fastest-growing residential corridors, and local hospitality supply is genuinely behind population growth. The opportunity is a medium-term (3–5 year) investment thesis for early-mover operators, not an immediate high-volume proposition.",
  },
  {
    question: 'What are the highest-risk locations on the Gold Coast for independent operators?',
    answer: "Surfers Paradise is the highest-risk location for independent cafes, restaurants, and quality retail — extreme rent pressure, saturated competition, and deep seasonal troughs create structural conditions that most independent operators cannot sustain without tourist-scale volumes. Nerang presents different risks: it is a hinterland gateway town with demand at 3/10, the weakest commercial demand in the dataset, where low rent is a market signal rather than an opportunity. Burleigh Waters is frequently selected by operators who assume proximity to Burleigh Heads means access to Burleigh Heads demand — this assumption is incorrect, and the suburb rewards practical services, not hospitality.",
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

function GoldCoastFactorDirectory() {
  const suburbs = getGoldCoastSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictDisplay = s.verdict === 'RISKY' ? 'NO' : s.verdict
        const verdictColor = verdictDisplay === 'GO' ? C.emerald : verdictDisplay === 'CAUTION' ? C.amber : C.red
        const verdictBg = verdictDisplay === 'GO' ? C.emeraldBg : verdictDisplay === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = verdictDisplay === 'GO' ? C.emeraldBdr : verdictDisplay === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/gold-coast/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', backgroundColor: verdictBg, color: verdictColor, border: `1px solid ${verdictBdr}`, letterSpacing: '0.05em' }}>
                  {verdictDisplay}
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
              <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '760px' }}>{s.why}</p>
              <FactorGrid factors={s.factors} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function GoldCoastPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Gold Coast"
        citySlug="gold-coast"
        tagline="Tourism is the defining force on the Gold Coast — but the operators who build lasting businesses are the ones who do not depend on it. Resident demand is where the durable commercial opportunity lives."
        statChips={[
          { text: '20 suburbs scored — beachside tourism to residential family hubs' },
          { text: "Burleigh Heads: Gold Coast's benchmark independent strip" },
          { text: 'Extreme seasonality in Surfers Paradise — most independents cannot sustain it' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on tourism dependency, resident demand depth, commercial rent viability, competitive density, and seasonality risk. Data sourced from ABS 2024, CBRE Gold Coast Q1 2026, Colliers GC Retail Report, and Locatalyze proprietary foot traffic analysis.
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
              { value: '14M+', label: 'Domestic visitor nights per year — highest of any non-capital city in Australia', source: 'Tourism Research Australia 2025' },
              { value: '2%', label: 'Estimated vacancy rate on James Street, Burleigh Heads — supply is the constraint, not demand', source: 'Locatalyze field analysis 2026' },
              { value: '40%+', label: 'Peak-season revenue uplift during school holidays in tourist-adjacent suburbs', source: 'Locatalyze operator surveys 2025' },
              { value: '650K+', label: 'Gold Coast population — growing at above-Queensland-average via SE QLD migration corridor', source: 'ABS 2024' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Gold Coast Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "The Gold Coast is the only major Australian city where tourism is both the dominant economic force and the primary business risk. Every operator on the coast must answer the same foundational question: is my revenue model tourist-dependent, or does it work without tourists? The answer determines which suburbs are viable, which months are dangerous, and whether the business survives its first full year.",
              "The coastal strip runs roughly 50 kilometres from Coolangatta in the south to Coomera in the north, but commercial reality concentrates in five or six distinct precincts. Burleigh Heads is the benchmark: a genuinely resident-driven market with year-round depth, a track record of independent operators succeeding without tourist dependency, and the highest demand score on the coast. Broadbeach sits above it in terms of rent but benefits from Pacific Fair and the casino precinct stabilising trade through winter. These two markets define what sustainable commercial operation on the Gold Coast looks like.",
              "Surfers Paradise is the cautionary counterpoint. The tourist volumes are real — international and interstate visitors generate extraordinary peak-season foot traffic — but the rent levels, competition density, and winter trough create a structural trap for most independent operators. A café that opens in November on summer projections discovers in June that 40–50% of expected trade has evaporated. The operators who succeed in Surfers Paradise are those running high-volume, low-margin, tourist-oriented formats — not quality independents with standard hospitality economics.",
              "The emerging opportunity for 2026 is in the southern corridor: Palm Beach, Miami, and to a lesser extent Coolangatta. These three suburbs share a demographic profile — surf culture, young professionals, health-conscious — that is economically compatible with independent hospitality. Palm Beach in particular offers the best rent-to-demand ratio on the coast: demand tracking upward toward Burleigh levels at rents that are still materially below. The establishment period is longer and the foot traffic density is lower, but the unit economics for a patient operator are among the most attractive in southeast Queensland.",
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
              { type: 'Cafes and Specialty Coffee', insight: "Burleigh Heads is the Gold Coast's benchmark cafe market — resident demand, national track record, and year-round depth. Palm Beach is the growth-stage play: surf culture demand at 45% of Burleigh rent. Mermaid Beach suits a community-first operator who does not need tourist volume. Avoid Surfers Paradise unless you are engineered for 300+ covers daily.", best: ['Burleigh Heads', 'Palm Beach', 'Mermaid Beach'] },
              { type: 'Full-Service Restaurants', insight: "Broadbeach is the strongest restaurant market on the coast — the casino precinct and Pacific Fair create an evening economy that sustains year-round dining trade. Burleigh Heads works for quality casual. Main Beach rewards destination dining operators: very low competition, premium demographic, but the catchment is small.", best: ['Broadbeach', 'Burleigh Heads', 'Main Beach'] },
              { type: 'Retail (Independent)', insight: "Surfers Paradise and Broadbeach generate the highest tourist retail volumes, but rents reflect this. Palm Beach and Coolangatta offer surf lifestyle retail with growing resident bases and manageable rent. Mermaid Beach boutique retail performs well with the affluent residential catchment.", best: ['Broadbeach', 'Palm Beach', 'Mermaid Beach'] },
              { type: 'Fitness and Wellness', insight: "Allied health and boutique fitness follows high-income residential — Mermaid Beach, Burleigh Heads, and Broadbeach all have household income demographics that sustain premium wellness spend. Southport's medical precinct creates allied health adjacency that is commercially reliable.", best: ['Mermaid Beach', 'Burleigh Heads', 'Southport'] },
              { type: 'Professional Services', insight: "Professional services follow corporate and government concentration — Southport is the Gold Coast's professional services hub with government offices, legal firms, and the medical precinct. Broadbeach suits premium professional services aligned with the casino and corporate market.", best: ['Southport', 'Broadbeach', 'Robina'] },
              { type: 'Family and Practical Services', insight: "Coomera, Robina, and Helensvale all have family-dominant demographics that are genuinely underserved by quality practical services. Childcare, tutoring, allied health, and gym formats perform consistently in these suburbs. Robina Town Centre competition is real but does not capture service categories it cannot provide.", best: ['Coomera', 'Robina', 'Helensvale'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Gold Coast Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across resident demand, tourism dependency, rent economics, competition gap, and seasonality risk.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Burleigh Heads', slug: 'burleigh-heads', verdict: gcVerdict('burleigh-heads'), score: gcScore('burleigh-heads'), rentFrom: '$4,500/mo', body: "James Street is the clearest quality signal in Gold Coast hospitality — the strongest year-round resident demand on the coast, a track record of nationally recognised independents, and a demographic that genuinely supports premium pricing. Vacancy is estimated below 2%, which means the constraint is finding a site, not building a business. When a site appears, the demand to fill it is already there." },
              { rank: 2, name: 'Broadbeach', slug: 'broadbeach', verdict: gcVerdict('broadbeach'), score: gcScore('broadbeach'), rentFrom: '$5,000/mo', body: "The casino precinct and Pacific Fair are estimated to provide 30–40% of evening economy revenue in the surrounding area regardless of tourist season — a meaningful stabiliser that most coastal suburbs lack. Rent at $5,000–$12,000/month is the highest structural risk. The market rewards operators with premium positioning and strong volume; mid-market concepts face rent pressure that the demand base may not consistently resolve." },
              { rank: 3, name: 'Mermaid Beach', slug: 'mermaid-beach', verdict: gcVerdict('mermaid-beach'), score: gcScore('mermaid-beach'), rentFrom: '$3,500/mo', body: "Established affluent residential with estimated 80% of commercial spending coming from locals rather than tourists. Very low competition (3/10) combined with very low seasonality risk (2/10) creates the most predictable operating environment on the coast. The revenue ceiling is real — the catchment is not large — but within that ceiling, community loyalty and repeat visit rates are structurally high." },
              { rank: 4, name: 'Palm Beach', slug: 'palm-beach', verdict: gcVerdict('palm-beach'), score: gcScore('palm-beach'), rentFrom: '$2,500/mo', body: "The best rent-adjusted opportunity on the Gold Coast right now. Demand is at 7/10 and trending upward; rent pressure is only 4/10. The gap between Palm Beach and Burleigh Heads has been narrowing — operators who establish now do so at lower rent before the market reprices. Requires a 12–18 month establishment runway and a concept that works for the surf culture demographic." },
              { rank: 5, name: 'Main Beach', slug: 'main-beach', verdict: gcVerdict('main-beach'), score: gcScore('main-beach'), rentFrom: '$4,000/mo', body: "Luxury residential and Marina Mirage precinct with very low competition (2/10). The verdict is GO specifically for premium concepts — a $90 per head breakfast is achievable, a $22 café concept is not. The local demographic will not support mid-market pricing regardless of execution quality. For the right concept, the combination of affluent demand and minimal competition is the strongest premium positioning opportunity on the coast." },
              { rank: 6, name: 'Southport', slug: 'southport', verdict: gcVerdict('southport'), score: gcScore('southport'), rentFrom: '$3,000/mo', body: "The Gold Coast's traditional commercial centre with government offices, medical precinct, light rail, and legal and finance services. Strong weekday professional demand — consistent and predictable. Seasonality risk is very low (2/10). The structural challenge is weekend revenue: operators with 7-day fixed cost models will find Friday-to-Sunday trade significantly below weekday levels." },
              { rank: 7, name: 'Miami', slug: 'miami', verdict: gcVerdict('miami'), score: gcScore('miami'), rentFrom: '$2,500/mo', body: "Emerging creative district between Burleigh and Mermaid Beach. The art precinct on Currumbin Creek Road has shifted from obscure to editorially referenced over the past 3 years. Very low competition (2/10) at a rent level (4/10) that is attractive relative to comparable resident suburbs. Rewards operators who can generate their own destination intent through concept and identity, not those relying on passing trade." },
              { rank: 8, name: 'Coolangatta', slug: 'coolangatta', verdict: gcVerdict('coolangatta'), score: gcScore('coolangatta'), rentFrom: '$2,500/mo', body: "Southern border surf town with airport-corridor consistency and NSW cross-border catchment. Coolangatta has a structural advantage the northern tourist strips lack: a genuinely local identity that community-focused operators can build on. Low competition (3/10) and favourable rent (4/10) create a cost-to-opportunity ratio that is better than the suburb's reputation suggests." },
              { rank: 9, name: 'Robina', slug: 'robina', verdict: gcVerdict('robina'), score: gcScore('robina'), rentFrom: '$2,500/mo', body: "Master-planned family suburb with Bond University and Robina Town Centre. The CAUTION verdict reflects Robina Town Centre gravity — the Westfield effect captures discretionary spend that strip operators compete against indirectly. Operators positioned for the Bond University corridor rather than adjacent to the centre find a less contested market with consistent family demand." },
              { rank: 10, name: 'Helensvale', slug: 'helensvale', verdict: gcVerdict('helensvale'), score: gcScore('helensvale'), rentFrom: '$2,000/mo', body: "Northern Gold Coast family hub. The light rail station has created a morning commuter coffee window that is commercially real — a well-positioned café on the commuter path captures consistent daily repeat visits. Theme park proximity does not benefit strip operators; it creates tourist expectation that rarely converts to local commercial trade." },
              { rank: 11, name: 'Varsity Lakes', slug: 'varsity-lakes', verdict: gcVerdict('varsity-lakes'), score: gcScore('varsity-lakes'), rentFrom: '$2,000/mo', body: "Bond University adjacent with very low competition (2/10) and the lowest rent pressure in the dataset (3/10). The CAUTION verdict is driven by price sensitivity — this is not a location where premium pricing is viable. Demand volume is available; revenue per customer is the binding constraint. Practical services (fitness, tutoring) are the strongest opportunity because service-based pricing is less exposed to the student price ceiling." },
              { rank: 12, name: 'Coomera', slug: 'coomera', verdict: gcVerdict('coomera'), score: gcScore('coomera'), rentFrom: '$1,800/mo', body: "One of Queensland's fastest-growing residential corridors — genuinely underserved relative to population. Demand at 5/10 today understates the 3–5 year trajectory, but operators should model against current demographics, not projected ones. Rent (3/10) and competition (2/10) are both low. The opportunity is a medium-term investment thesis: establish now, build loyalty, own the market as the suburb matures." },
            ].map((suburb) => {
              const verdictBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const verdictColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const verdictBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/gold-coast/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '20px', alignItems: 'start', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                      <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textAlign: 'center', backgroundColor: verdictBg, color: verdictColor, border: `1px solid ${verdictBdr}` }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #78350F 0%, #92400E 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Gold Coast address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Gold Coast address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FEF3C7', color: '#78350F', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Gold Coast address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Gold Coast Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>20 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="gold-coast" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Gold Coast Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Burleigh Heads vs Palm Beach', body: "Burleigh is the proven market — established demand, nationally recognised operators, and a customer demographic that sustains premium pricing. Palm Beach is the growth market — the same surf culture demographic trajectory at rents that are 45% lower, but with less foot traffic depth today and a longer establishment period. For operators with a strong concept and a 12–18 month runway, Palm Beach offers better long-term unit economics. For operators who need immediate volume and are prepared to pay for it, Burleigh is more reliable." },
              { title: 'Broadbeach vs Surfers Paradise', body: "Both are high-volume tourist-adjacent markets, but the risk profile differs significantly. Broadbeach is stabilised by the casino and Pacific Fair — these anchor the evening economy across shoulder months and reduce the winter revenue cliff. Surfers Paradise has higher peak-season volumes but deeper winter troughs and higher rents. For independent operators, Broadbeach is the lower-risk choice in almost every scenario. Surfers Paradise rewards high-volume, tourist-oriented formats where volume compensates for margin compression." },
              { title: 'Mermaid Beach vs Miami', body: "Both are resident-dominant markets between Burleigh and Broadbeach, but at different stages of establishment. Mermaid Beach is an established affluent community with structurally high operator loyalty and very low competition — the ceiling exists, but within it, the operating environment is favourable. Miami is earlier stage — the art precinct is emerging rather than established, strip cohesion is developing, and passive foot traffic is limited. Miami rewards operators who generate their own destination intent; Mermaid Beach rewards operators who integrate into an existing community." },
              { title: 'Southport vs Robina', body: "Both serve professional and family demographics, but through different mechanisms. Southport is a weekday professional market — government, medical, legal, and TAFE create consistent weekday lunch volume with very low seasonality. Robina is a family-dominant market anchored around Robina Town Centre and Bond University. Southport suits concepts that operate 5 days a week and treat weekends as bonus trade. Robina suits family-oriented formats that position outside the Westfield gravity, targeting Bond University corridor traffic." },
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
              { name: 'Surfers Paradise (independent cafes and quality dining)', why: "Rent at $8,000–$20,000/month combined with extreme competition (10/10) and deep winter troughs creates structural conditions that most independent operators cannot sustain. A cafe at the midpoint rent needs 280–350+ daily customer visits just to cover occupancy. Mid-year shoulder periods consistently fall short of this threshold for non-tourist-oriented formats." },
              { name: 'Burleigh Waters (hospitality operators)', why: "Operators frequently select Burleigh Waters assuming proximity to Burleigh Heads translates to Burleigh Heads demand. This assumption is incorrect. Despite sharing a demographic profile, the inland position means almost no passing trade — the commercial mechanics are fundamentally different. Burleigh Waters rewards allied health and practical family services, not hospitality." },
              { name: 'Nerang (premium concepts at any price point)', why: "Nerang has the weakest commercial demand in the dataset (3/10). Very low rent (2/10) is a market signal here, not a cost advantage — it reflects limited commercial activity rather than hidden opportunity. Hospitality investment in Nerang is unlikely to achieve coastal returns regardless of concept quality or operator execution." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Gold Coast Suburb Factor Breakdown — All 20 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <GoldCoastFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Gold Coast Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Gold Coast location?"
        subtitle="Run a free analysis on any Gold Coast address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/gold-coast/burleigh-heads" style={{ color: C.brand, textDecoration: 'none' }}>Burleigh Heads Analysis →</Link>
          <Link href="/analyse/gold-coast/broadbeach" style={{ color: C.brand, textDecoration: 'none' }}>Broadbeach Analysis →</Link>
          <Link href="/analyse/gold-coast/surfers-paradise" style={{ color: C.brand, textDecoration: 'none' }}>Surfers Paradise Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
