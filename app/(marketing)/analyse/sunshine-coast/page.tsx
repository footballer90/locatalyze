// app/(marketing)/analyse/sunshine-coast/page.tsx
// Sunshine Coast city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getSunshineCoastSuburb, getSunshineCoastSuburbs } from '@/lib/analyse-data/sunshine-coast'

function scScore(slug: string): number {
  return getSunshineCoastSuburb(slug)?.compositeScore ?? 0
}
function scVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getSunshineCoastSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business on the Sunshine Coast — 2026 Location Guide',
  description:
    'Sunshine Coast business location guide 2026. 10 suburbs scored by foot traffic, tourism dependency, rent viability, and competition gap. Find the best Sunshine Coast suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/sunshine-coast' },
  openGraph: {
    title: 'Best Suburbs to Open a Business on the Sunshine Coast — 2026 Location Guide',
    description: '10 Sunshine Coast suburbs ranked and scored. Rent benchmarks, tourism seasonality, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/sunshine-coast',
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs to Open a Business on the Sunshine Coast 2026',
  description: 'Data-driven guide to Sunshine Coast commercial location decisions — 10 suburbs scored across tourism, rent, competition, foot traffic and demand.',
  author: { '@type': 'Organization', name: 'Locatalyze' },
  publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
  url: 'https://locatalyze.com/analyse/sunshine-coast',
  datePublished: '2026-01-01',
  dateModified: '2026-04-01',
}

const COMPARISON_ROWS = [
  { name: 'Noosa Heads', score: scScore('noosa-heads'), verdict: scVerdict('noosa-heads'), rent: '$6,000–$14,000', footTraffic: 'Very High (seasonal)', bestFor: 'Premium dining, boutique retail, high-end hospitality' },
  { name: 'Mooloolaba', score: scScore('mooloolaba'), verdict: scVerdict('mooloolaba'), rent: '$3,500–$7,000', footTraffic: 'High (seasonal)', bestFor: 'Cafés, casual dining, beach retail' },
  { name: 'Maroochydore', score: scScore('maroochydore'), verdict: scVerdict('maroochydore'), rent: '$2,800–$6,000', footTraffic: 'High', bestFor: 'Quick-service, professional services, casual dining' },
  { name: 'Caloundra', score: scScore('caloundra'), verdict: scVerdict('caloundra'), rent: '$2,200–$4,500', footTraffic: 'Medium-High (seasonal)', bestFor: 'Cafés, family dining, coastal retail' },
  { name: 'Buderim', score: scScore('buderim'), verdict: scVerdict('buderim'), rent: '$2,000–$4,000', footTraffic: 'Medium-High', bestFor: 'Specialty café, wellness, allied health' },
  { name: 'Coolum Beach', score: scScore('coolum-beach'), verdict: scVerdict('coolum-beach'), rent: '$2,000–$4,000', footTraffic: 'Medium (seasonal)', bestFor: 'Lifestyle café, casual dining, surf retail' },
  { name: 'Peregian Beach', score: scScore('peregian-beach'), verdict: scVerdict('peregian-beach'), rent: '$1,800–$3,500', footTraffic: 'Medium (seasonal)', bestFor: 'Premium café, boutique, wellness' },
  { name: 'Nambour', score: scScore('nambour'), verdict: scVerdict('nambour'), rent: '$1,000–$2,200', footTraffic: 'Medium', bestFor: 'Local services, independent café, tradesperson-adjacent' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium Tourism Precincts — Highest Reward, Highest Seasonality',
    description: "The Sunshine Coast's most recognised locations. Tourism income is exceptional in peak periods — the risk is operators who project peak revenue as year-round reality.",
    suburbs: [
      { name: 'Noosa Heads', slug: 'noosa-heads', description: "Australia's most exclusive coastal tourism destination. Hastings Street delivers the highest per-visit spend on the Sunshine Coast — but rent is priced to match.", score: scScore('noosa-heads'), verdict: scVerdict('noosa-heads'), rentRange: '$6,000–$14,000/mo' },
      { name: 'Mooloolaba', slug: 'mooloolaba', description: "Best tourism-to-local-resident balance on the coast. Esplanade trade is strong year-round, with school-holiday spikes layered on top of a solid local base.", score: scScore('mooloolaba'), verdict: scVerdict('mooloolaba'), rentRange: '$3,500–$7,000/mo' },
      { name: 'Coolum Beach', slug: 'coolum-beach', description: "Mid-coast lifestyle market. Loyally local in winter, destination in summer. Works for operators who invest in the permanent community.", score: scScore('coolum-beach'), verdict: scVerdict('coolum-beach'), rentRange: '$2,000–$4,000/mo' },
    ],
  },
  {
    title: 'Commercial Centres — Consistent Trade, Lower Tourism Exposure',
    description: 'Maroochydore and Caloundra anchor the commercial spine. Lower seasonality, larger resident catchment, more predictable year-round revenue.',
    suburbs: [
      { name: 'Maroochydore', slug: 'maroochydore', description: "Sunshine Coast's commercial capital. Growing CBD, Sunshine Coast University Hospital precinct and SCC relocation drive professional daytime demand.", score: scScore('maroochydore'), verdict: scVerdict('maroochydore'), rentRange: '$2,800–$6,000/mo' },
      { name: 'Caloundra', slug: 'caloundra', description: "Southern gateway with a retiree-affluent demographic. Consistent local spend underpins strong café and casual dining trade with visitor uplift in school holidays.", score: scScore('caloundra'), verdict: scVerdict('caloundra'), rentRange: '$2,200–$4,500/mo' },
    ],
  },
  {
    title: 'Hinterland & Village Markets — Lower Rent, Loyal Locals',
    description: 'Buderim, Peregian Beach and Nambour trade on local community loyalty rather than tourist volume. Lower seasonality, lower rents, sustainable for the right operator.',
    suburbs: [
      { name: 'Buderim', slug: 'buderim', description: "Plateau village with the highest household incomes of any non-coastal Sunshine Coast suburb. Loyal professional repeat trade at 40% below coastal strip rents.", score: scScore('buderim'), verdict: scVerdict('buderim'), rentRange: '$2,000–$4,000/mo' },
      { name: 'Peregian Beach', slug: 'peregian-beach', description: "Upmarket surf village with low competition and high average spend. The resident demographic is Noosa-quality at half the rent.", score: scScore('peregian-beach'), verdict: scVerdict('peregian-beach'), rentRange: '$1,800–$3,500/mo' },
      { name: 'Nambour', slug: 'nambour', description: 'Hinterland service town with very low rents and a genuine local renewal underway. Best for operators who want a patient first-mover opportunity.', score: scScore('nambour'), verdict: scVerdict('nambour'), rentRange: '$1,000–$2,200/mo' },
    ],
  },
  {
    title: 'Growth Suburbs — First-Mover Opportunity',
    description: 'New and fast-growing suburbs where population growth is outpacing hospitality supply. Low competition, low rent, early-mover advantage.',
    suburbs: [
      { name: 'Sippy Downs', slug: 'sippy-downs', description: "University of the Sunshine Coast precinct. Student and staff daytime demand at very affordable rents — seasonality follows the academic calendar.", score: scScore('sippy-downs'), verdict: scVerdict('sippy-downs'), rentRange: '$1,500–$2,800/mo' },
      { name: 'Palmview', slug: 'palmview', description: "One of the fastest-growing new suburbs in SE Queensland. Almost no independent operators yet — a genuine first-mover window for the right café or casual dining concept.", score: scScore('palmview'), verdict: scVerdict('palmview'), rentRange: '$1,200–$2,500/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a café on the Sunshine Coast?',
    answer: "Mooloolaba is the best risk-adjusted café market on the Sunshine Coast. It delivers high foot traffic year-round (not just school holidays), has a strong local residential base that supports off-season trade, and rents — while elevated compared to inland areas — are 40–60% below Noosa Heads. The better opportunity play for 2026 is Peregian Beach: Noosa-quality demographics at Nambour-adjacent rent, with very low competition and a village strip format that rewards loyalty-building operators.",
  },
  {
    question: "How does Sunshine Coast seasonality compare to other Australian markets?",
    answer: "The Sunshine Coast's seasonality pattern is driven by school holidays rather than climate — the region has mild year-round weather, so revenue volatility is almost entirely tied to Queensland school terms, interstate visitor flows, and the Christmas-January peak. Operators whose revenue drops more than 30% outside school holidays have a positioning problem, not a location problem. Noosa Heads and Mooloolaba carry the most seasonal risk; Maroochydore, Buderim and Sippy Downs carry the least.",
  },
  {
    question: "Is Noosa Heads worth the premium rent for a restaurant?",
    answer: "Noosa Heads rewards operators who can charge premium prices — average dinner spend per visit is the highest of any regional Queensland market. The risk is the rent-to-revenue ratio during the off-peak May-August window, when tourist volumes drop 40-55% from the January peak. Operators who succeed in Noosa build genuine local customer loyalty from the 5,000+ permanent residents who sustain trade year-round, rather than relying on the tourist wave as their primary revenue model.",
  },
  {
    question: "How does the Sunshine Coast hospital and university precinct affect business locations?",
    answer: "Sunshine Coast University Hospital (Birtinya) and the University of the Sunshine Coast (Sippy Downs) together represent 8,000+ daily workers and students — a professional demand base that is largely independent of tourist seasonality. Operators in the Maroochydore-Birtinya corridor benefit from this weekday professional trade as a stable revenue floor. Sippy Downs specifically is chronically under-served by quality food operators given the USC campus population.",
  },
  {
    question: "Which Sunshine Coast suburbs are best for retail businesses?",
    answer: "Noosa Heads (Hastings Street) delivers the highest retail spend per visit but at the highest rent. For independent retailers, Mooloolaba Esplanade and Maroochydore's Sunshine Plaza precinct offer higher foot traffic with more manageable rents. Buderim is the underrated retail opportunity — high-income residential catchment, below-market rents, and a population that actively prefers independent over chain operators.",
  },
  {
    question: "Is Maroochydore worth choosing over Mooloolaba or Noosa?",
    answer: "Maroochydore is the correct choice for operators whose revenue model depends on consistent weekday trade — the growing CBD, council relocation and hospital growth create a professional daytime base that neither Mooloolaba nor Noosa can match. For pure weekend and holiday trade, Mooloolaba wins on foot traffic depth. For premium positioning and the highest average spend, Noosa wins — but the year-round economics are harder to model. Maroochydore is the most predictable of the three.",
  },
  {
    question: "What are the biggest risks for new operators on the Sunshine Coast?",
    answer: "The most common failure mode is opening in November based on December-January revenue projections and discovering in June that 50% of expected trade disappears. The second is paying Noosa rent on the assumption that Noosa foot traffic will materialise year-round. The third — and most avoidable — is not building any relationship with the permanent resident community in tourism-dominant locations, which means the operator has no customer base when the tourists leave.",
  },
]

function SunshineCoastFactorDirectory() {
  const suburbs = getSunshineCoastSuburbs()
    .slice()
    .sort((a, b) => b.compositeScore - a.compositeScore)

  return (
    <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
          Full Factor Breakdown — All 10 Suburbs
        </h2>
        <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>
          Every suburb scored across demand strength, rent pressure, competition density, seasonality risk, and tourism dependency. Scores are engine-computed.
        </p>
        <div style={{ display: 'grid', gap: '32px' }}>
          {suburbs.map((suburb) => (
            <div key={suburb.slug} style={{ backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                  <p style={{ fontSize: '13px', color: C.muted, margin: '3px 0 0' }}>{suburb.why[0]}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: C.brand, lineHeight: 1 }}>{suburb.compositeScore}</div>
                    <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>/ 100</div>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '6px',
                    backgroundColor: suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg,
                    color: suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red,
                    border: `1px solid ${suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr}`,
                  }}>
                    {suburb.verdict === 'RISKY' ? 'NO' : suburb.verdict}
                  </span>
                  <Link href={`/analyse/sunshine-coast/${suburb.slug}`} style={{ fontSize: '13px', fontWeight: 600, color: C.brand, textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', border: `1px solid ${C.brand}` }}>
                    Full analysis →
                  </Link>
                </div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <FactorGrid factors={suburb.locationFactors} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function SunshineCoastPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Sunshine Coast"
        citySlug="sunshine-coast"
        tagline="One of Australia's fastest-growing regions — and one of its most misread. Tourism revenue peaks matter less than building a local customer base that sustains trade year-round."
        statChips={[
          { text: '10 suburbs scored — coastal to hinterland' },
          { text: "Noosa Heads: Queensland's premium tourism destination" },
          { text: 'Population growing 3.5% annually — one of the fastest in Australia' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, tourism dependency, and seasonality risk. Data sourced from ABS 2024, SCRC commercial data Q1 2026, JLL Queensland, and Locatalyze proprietary analysis.
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
              { value: '450K+', label: 'Sunshine Coast resident population — one of Australia\'s fastest-growing regions', source: 'ABS 2024' },
              { value: '3.5%', label: 'Annual population growth rate — double the national average, sustained for 5+ years', source: 'ABS 2024' },
              { value: '$127K', label: 'Median household income in Noosa — highest of any regional Queensland LGA', source: 'ABS 2024' },
              { value: '40%', label: 'Revenue difference between peak school holidays and off-peak periods in Noosa Heads', source: 'Locatalyze 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Sunshine Coast Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "The Sunshine Coast is one of Australia's most misread commercial markets. Operators from Sydney and Melbourne look at the tourism numbers — 4 million+ annual visitors, one of the highest per-visit spend rates in regional Queensland — and project those numbers forward as a business model. The operators who fail are the ones who forgot that visitors are seasonal. The operators who build sustainable businesses are the ones who treated the permanent 450,000-person resident population as their primary customer base and the tourists as a welcome revenue uplift.",
              "The geography of the Sunshine Coast creates meaningfully different commercial markets within the same postcode region. Noosa Heads, Mooloolaba, and Caloundra are tourism-dominant precincts where winter revenue drops are measurable and must be planned for. Maroochydore, Buderim and Sippy Downs are resident-dominant markets where the trading pattern is more like a suburban Melbourne or Sydney strip — consistent, weekday-heavy, and less exposed to school holiday cycles.",
              "The growth story for 2026 and beyond is in the commercial gap between the coast's population expansion and its independent-operator supply. The Sunshine Coast added 60,000 new residents between 2019 and 2024. Most of those residents are in the southern corridor — Sippy Downs, Palmview, Bokarina — where quality independent café and dining supply is significantly below what the demographic would sustain. First-mover operators in these growth areas are capturing loyal customer bases before rents adjust to reflect the population.",
              "The Sunshine Coast Hospital precinct at Birtinya, the University of the Sunshine Coast at Sippy Downs, and the Sunshine Coast Council relocation to Maroochydore together represent a structural shift away from pure tourism dependency. These anchor institutions generate year-round professional demand that moderates the seasonal risk for operators positioned in the commercial corridor between Maroochydore and Kawana. For operators who want the Sunshine Coast without the seasonality, this corridor is where the unit economics work best.",
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
              { type: 'Cafés & Specialty Coffee', insight: "Mooloolaba is the depth-of-demand benchmark for coastal cafés — strong year-round, peaks in school holidays, local residential base provides the off-season floor. Peregian Beach is the upside opportunity: Noosa-quality demographics at 60% of Noosa rent. Buderim is the sleeper: high-income hinterland village, loyal repeat trade, very limited specialty competition.", best: ['Mooloolaba', 'Peregian Beach', 'Buderim'] },
              { type: 'Full-Service Restaurants', insight: "Noosa Heads is the only genuine premium restaurant market on the Sunshine Coast — the average dinner spend supports pricing that most other regional markets cannot. Mooloolaba works for quality-casual. Maroochydore suits the mid-market professional dinner format. None of these work without a clear strategy for the off-peak window.", best: ['Noosa Heads', 'Mooloolaba', 'Maroochydore'] },
              { type: 'Retail (Independent)', insight: "Noosa Heads (Hastings Street) delivers the highest retail spend per visit of any regional Queensland market. Mooloolaba Esplanade suits lifestyle and surf retail. Buderim suits premium independent retail with a high-income residential catchment who actively prefer independents over chains.", best: ['Noosa Heads', 'Mooloolaba', 'Buderim'] },
              { type: 'Fitness & Wellness', insight: "Wellness spend follows household income — Noosa, Buderim and Peregian Beach have the income profiles that sustain boutique fitness and allied health. Maroochydore suits allied health serving the professional corridor. Sippy Downs is underserved for the university and hospital staff population it contains.", best: ['Noosa Heads', 'Buderim', 'Maroochydore'] },
              { type: 'Professional Services', insight: "Maroochydore is the Sunshine Coast's commercial capital for professional services — Sunshine Coast Council, the hospital precinct and growing CBD create the professional-client base that other markets cannot match. Noosa is secondary for professional services but strong for wealth management and legal.", best: ['Maroochydore', 'Noosa Heads', 'Caloundra'] },
              { type: 'Tourism-Adjacent Concepts', insight: "Noosa Heads and Mooloolaba are the only markets where a tourism-first concept (gift retail, experience-led food, tour operator, day-spa) can model revenue primarily on visitor traffic rather than resident trade. Everywhere else, the resident base must be the primary revenue model.", best: ['Noosa Heads', 'Mooloolaba', 'Coolum Beach'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Sunshine Coast Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Mooloolaba', slug: 'mooloolaba', verdict: scVerdict('mooloolaba'), score: scScore('mooloolaba'), rentFrom: '$3,500/mo', body: "Best year-round depth of demand on the Sunshine Coast. The local residential base sustains trade when the tourists leave — which separates it from Noosa Heads where off-season is genuinely difficult. School holiday peaks add meaningful uplift on top of a reliable floor." },
              { rank: 2, name: 'Maroochydore', slug: 'maroochydore', verdict: scVerdict('maroochydore'), score: scScore('maroochydore'), rentFrom: '$2,800/mo', body: "The commercial capital growing fastest from non-tourism drivers. Sunshine Coast University Hospital, the Council relocation and the growing CBD professional population create a weekday demand base that most coastal markets cannot offer. Lowest seasonal variance of the major precincts." },
              { rank: 3, name: 'Buderim', slug: 'buderim', verdict: scVerdict('buderim'), score: scScore('buderim'), rentFrom: '$2,000/mo', body: "Hinterland plateau village with Noosa-quality household income at Nambour-adjacent rent. Loyal repeat trade, very low tourist dependency (almost zero seasonal swing), and a professional demographic that actively prefers independent operators over chains." },
              { rank: 4, name: 'Peregian Beach', slug: 'peregian-beach', verdict: scVerdict('peregian-beach'), score: scScore('peregian-beach'), rentFrom: '$1,800/mo', body: "The most undervalued location on the Sunshine Coast for quality independent operators. Peregian Beach has Noosa-adjacent demographics, very low competition, and rents that have not yet caught up with the resident income profile. The window is open but narrowing." },
              { rank: 5, name: 'Noosa Heads', slug: 'noosa-heads', verdict: scVerdict('noosa-heads'), score: scScore('noosa-heads'), rentFrom: '$6,000/mo', body: "Queensland's premium coastal market. The highest per-visit spend of any regional market in Australia, but at rents that require either premium pricing or strong volume. Year-round local loyalty from Noosa's 5,000+ permanent residents is essential — operators who rely only on tourists don't survive the off-season." },
              { rank: 6, name: 'Caloundra', slug: 'caloundra', verdict: scVerdict('caloundra'), score: scScore('caloundra'), rentFrom: '$2,200/mo', body: "Southern gateway with a retiree-affluent demographic that spends consistently and loyally. School holiday visitor uplift adds to a resident base that provides a reliable off-season floor. Works best for quality-casual café and family dining formats." },
              { rank: 7, name: 'Coolum Beach', slug: 'coolum-beach', verdict: scVerdict('coolum-beach'), score: scScore('coolum-beach'), rentFrom: '$2,000/mo', body: "Mid-coast lifestyle market that rewards operators who invest in the community. Permanent residents sustain trade during the winter shoulder; summer and school holiday peaks add meaningful uplift. Less volatile than Noosa Heads, more character than Maroochydore." },
              { rank: 8, name: 'Sippy Downs', slug: 'sippy-downs', verdict: scVerdict('sippy-downs'), score: scScore('sippy-downs'), rentFrom: '$1,500/mo', body: "Chronically under-served university and hospital corridor. 15,000+ students and staff at USC and nearby Sunshine Coast Hospital generate reliable daytime demand at very affordable rents. Semester-break seasonality is real but manageable for operators who plan for it." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/sunshine-coast/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '20px', alignItems: 'start', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                  <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                    <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textAlign: 'center', backgroundColor: suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg, color: suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red, border: `1px solid ${suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr}` }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Sunshine Coast address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Sunshine Coast address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FFEDD5', color: '#7C2D12', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Sunshine Coast address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Sunshine Coast Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>10 suburbs grouped by market type and risk profile.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="sunshine-coast" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Sunshine Coast Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Noosa Heads vs Mooloolaba', body: "Noosa delivers higher per-visit spend but steeper off-season risk. Mooloolaba has better year-round depth and a more manageable rent-to-revenue ratio. For most independent operators, Mooloolaba's economics are more sustainable — the upside is lower than Noosa, but so is the risk of a catastrophic winter quarter. Noosa is the right choice for operators who can charge premium prices and have the capital to weather seasonal variation." },
              { title: 'Maroochydore vs Mooloolaba', body: "Maroochydore is the commercial choice; Mooloolaba is the lifestyle choice. Maroochydore wins on weekday professional trade and year-round consistency. Mooloolaba wins on weekend foot traffic, atmosphere and the ability to attract tourists as supplementary customers. For café operators wanting reliability, Maroochydore. For restaurant operators wanting atmosphere and peak-weekend revenue, Mooloolaba." },
              { title: 'Buderim vs Peregian Beach', body: "Both are under-the-radar high-income villages at below-market rent. Buderim has higher volume and a larger resident catchment — it is the safer choice. Peregian Beach has lower competition and a Noosa-adjacent demographic — it is the higher-upside choice. Buderim suits operators who want to build steady repeat trade quickly. Peregian suits operators who can invest time in building a community reputation." },
              { title: 'Sippy Downs vs Palmview', body: "Sippy Downs has the established USC campus as its anchor demand — 15,000+ students and staff provide a predictable weekday base. Palmview is a blank canvas growing suburb with no anchor and very little competition — higher risk, higher upside. Sippy Downs is the lower-risk option for operators who can manage the semester-break seasonality. Palmview requires patience but captures the first-mover position in a suburb that will be 30,000+ residents by 2030." },
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
              { name: 'Noosa Heads (without a winter strategy)', why: "Noosa Heads is not a high-risk location for operators who model the seasonality correctly. It is very high-risk for operators who open based on January projections and discover in June that 50% of expected trade has evaporated. The location works for operators who build genuine local community loyalty from Noosa's permanent residents. It fails for operators who treat locals as supplementary to tourist revenue." },
              { name: 'Nambour main street', why: "Nambour is genuinely improving — but slowly. The main street still carries the legacy of decades of retail decline, and operators who open expecting the renewal to arrive on their timeline consistently misjudge the pace. Nambour suits patient operators with very low overhead requirements. It is a difficult location for anyone who needs rapid volume to cover fixed costs." },
              { name: 'Isolated beachside positions (non-Noosa, non-Mooloolaba)', why: "Small beachside strips at Rainbow Beach, Dicky Beach or similar positions carry the seasonality risk of Noosa with almost none of Noosa's tourist depth. The summer months look viable; the autumn-winter quarter reveals that the catchment is too small and too seasonal to sustain year-round operations without a very specific niche format." },
            ].map((zone) => (
              <div key={zone.name} style={{ padding: '22px', backgroundColor: C.redBg, borderRadius: '10px', border: `1px solid ${C.redBdr}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>{zone.name}</h3>
                <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>{zone.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SunshineCoastFactorDirectory />

      <section id="faq" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FAQSection faqs={FAQS} title="Sunshine Coast Location FAQ" />
        </div>
      </section>

      <CTASection
        title="Ready to analyse your Sunshine Coast address?"
        subtitle="Run a free analysis on any Sunshine Coast address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis."
        buttonText="Analyse your Sunshine Coast address free →"
      />

      <footer style={{ backgroundColor: C.n900, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            {['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Cairns', 'Darwin'].map((city) => (
              <Link key={city} href={`/analyse/${city.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{city}</Link>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>© 2026 Locatalyze · Commercial location intelligence for Australian operators</p>
        </div>
      </footer>
    </div>
  )
}
