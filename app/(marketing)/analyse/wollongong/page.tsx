// app/(marketing)/analyse/wollongong/page.tsx
// Wollongong city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getWollongongSuburb, getAllWollongongSuburbs } from '@/lib/wollongong-suburbs'

function wScore(slug: string): number {
  return getWollongongSuburb(slug)?.compositeScore ?? 0
}
function wVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getWollongongSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Wollongong — 2026 Location Guide',
  description:
    'Wollongong business location guide 2026. 20 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Wollongong suburb for your cafe, restaurant, retail or service business in the Illawarra region.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/wollongong' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Wollongong — 2026 Location Guide',
    description: '20 Wollongong suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/wollongong',
  },
}

const COMPARISON_ROWS = [
  { name: 'North Wollongong', score: wScore('north-wollongong'), verdict: wVerdict('north-wollongong'), rent: '$2,200–$4,500', footTraffic: 'Medium (peak weekends)', bestFor: 'Specialty cafe, beachside dining, lifestyle retail' },
  { name: 'Fairy Meadow', score: wScore('fairy-meadow'), verdict: wVerdict('fairy-meadow'), rent: '$1,800–$3,800', footTraffic: 'Medium-High', bestFor: 'Independent cafe, casual dining, community retail' },
  { name: 'Wollongong CBD', score: wScore('wollongong-cbd'), verdict: wVerdict('wollongong-cbd'), rent: '$3,000–$7,500', footTraffic: 'High (weekday)', bestFor: 'Office-trade cafe, restaurant, specialty retail' },
  { name: 'Thirroul', score: wScore('thirroul'), verdict: wVerdict('thirroul'), rent: '$2,000–$4,200', footTraffic: 'Medium', bestFor: 'Village cafe, casual dining, artisan retail' },
  { name: 'Kiama', score: wScore('kiama'), verdict: wVerdict('kiama'), rent: '$2,500–$5,500', footTraffic: 'High (seasonal)', bestFor: 'Tourism hospitality, premium cafe, lifestyle retail' },
  { name: 'Corrimal', score: wScore('corrimal'), verdict: wVerdict('corrimal'), rent: '$1,500–$3,200', footTraffic: 'Medium', bestFor: 'Community cafe, local dining, value retail' },
  { name: 'Shellharbour', score: wScore('shellharbour'), verdict: wVerdict('shellharbour'), rent: '$2,000–$4,500', footTraffic: 'High (centre)', bestFor: 'Family dining, cafe, retail in village precinct' },
  { name: 'Gwynneville', score: wScore('gwynneville'), verdict: wVerdict('gwynneville'), rent: '$1,400–$3,000', footTraffic: 'Medium', bestFor: 'Student cafe, budget dining, specialty food' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Coastal Strip — High Upside, Weekend-Primary',
    description: "Wollongong's coastal precincts deliver the highest leisure spend in the region. Beach proximity drives weekend brunch and tourism revenue, but weekday volumes require supplementary strategies.",
    suburbs: [
      { name: 'North Wollongong', slug: 'north-wollongong', description: "The region's strongest cafe opportunity — beach proximity, UOW corridor trade, and virtually no quality incumbent. The Bondi of Wollongong, before premium operators arrived.", score: wScore('north-wollongong'), verdict: wVerdict('north-wollongong'), rentRange: '$2,200–$4,500/mo' },
      { name: 'Fairy Meadow', slug: 'fairy-meadow', description: "Wollongong's most established independent strip. Lawrence Hargrave Drive has a proven culture of supporting local business — the best pure-residential café market in the Illawarra.", score: wScore('fairy-meadow'), verdict: wVerdict('fairy-meadow'), rentRange: '$1,800–$3,800/mo' },
      { name: 'Austinmer', slug: 'austinmer', description: 'Boutique beach village 12km north. Remarkable unit economics at sub-$1,800/month — the lowest break-even threshold in the region. Weekend-only viable.', score: wScore('austinmer'), verdict: wVerdict('austinmer'), rentRange: '$900–$1,800/mo' },
      { name: 'Thirroul', slug: 'thirroul', description: "The Illawarra's most coveted village strip. DH Lawrence country — creative community, artisan appeal, strong repeat trade from loyal locals.", score: wScore('thirroul'), verdict: wVerdict('thirroul'), rentRange: '$2,000–$4,200/mo' },
    ],
  },
  {
    title: 'CBD & Inner Suburbs — Office Trade, Higher Rent',
    description: 'The commercial core. Higher rents require volume or premium positioning — but weekday office trade is the most reliable daytime revenue in the region.',
    suburbs: [
      { name: 'Wollongong CBD', slug: 'wollongong-cbd', description: "Crown Street Mall anchors the region's highest foot traffic. Works for office-trade cafes and well-positioned restaurants. Negotiate below headline rent.", score: wScore('wollongong-cbd'), verdict: wVerdict('wollongong-cbd'), rentRange: '$3,000–$7,500/mo' },
      { name: 'Gwynneville', slug: 'gwynneville', description: "University of Wollongong-adjacent. Reliable student trade during semester — 30–40% softer in summer break. Lowest inner-suburb rent.", score: wScore('gwynneville'), verdict: wVerdict('gwynneville'), rentRange: '$1,400–$3,000/mo' },
      { name: 'Keiraville', slug: 'keiraville', description: 'Leafy inner suburb beside UOW. Academic and professional residential, loyal repeat trade, small commercial strip with low competition.', score: wScore('keiraville'), verdict: wVerdict('keiraville'), rentRange: '$1,400–$2,800/mo' },
    ],
  },
  {
    title: 'Established Suburbs — Community Trade, Lower Risk',
    description: 'Proven residential markets with loyal local bases. Lower revenue ceilings than coastal strips, but more predictable and with genuine community support for good operators.',
    suburbs: [
      { name: 'Corrimal', slug: 'corrimal', description: 'Established northern suburb with loyal working-class and young family demographic. Rents well below the coastal strip — community cafe economics are strong.', score: wScore('corrimal'), verdict: wVerdict('corrimal'), rentRange: '$1,500–$3,200/mo' },
      { name: 'Figtree', slug: 'figtree', description: 'Shopping centre suburb with a high-income demographic. Westfield proximity creates reliable foot traffic for retail — competition from chains is the main challenge.', score: wScore('figtree'), verdict: wVerdict('figtree'), rentRange: '$2,000–$4,500/mo' },
      { name: 'Dapto', slug: 'dapto', description: "Wollongong's largest growth suburb south of the CBD. New residential arrivals from Sydney creating demand the existing supply has not yet met.", score: wScore('dapto'), verdict: wVerdict('dapto'), rentRange: '$1,800–$3,800/mo' },
    ],
  },
  {
    title: 'South Coast Satellites — Tourism-Driven Markets',
    description: "Kiama and Shellharbour are the Illawarra's tourism anchors. Strong peak revenue, genuine off-season softness — operators need a dual local-tourist strategy.",
    suburbs: [
      { name: 'Kiama', slug: 'kiama', description: "The region's premium tourism market. Kiama Blowhole drives year-round visitors, and the local demographic supports the highest per-head spend outside the CBD.", score: wScore('kiama'), verdict: wVerdict('kiama'), rentRange: '$2,500–$5,500/mo' },
      { name: 'Shellharbour', slug: 'shellharbour', description: 'The Shellharbour Village precinct has genuine charm and a growing residential base. Less seasonal than Kiama, stronger local demographic.', score: wScore('shellharbour'), verdict: wVerdict('shellharbour'), rentRange: '$2,000–$4,500/mo' },
      { name: 'Gerringong', slug: 'gerringong', description: "South of Kiama — smaller, boutique, high-income residential. The Illawarra's most underrated village opportunity.", score: wScore('gerringong'), verdict: wVerdict('gerringong'), rentRange: '$1,500–$3,200/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a cafe in Wollongong?',
    answer: "North Wollongong is the strongest cafe opportunity in the region — beach proximity, UOW corridor trade, and virtually no quality incumbent. For an operator who wants community loyalty over tourism, Fairy Meadow's Lawrence Hargrave Drive strip offers the best independent cafe culture in the Illawarra at rents 40-50% below comparable Sydney strips. For the single lowest break-even threshold, Austinmer's small beach village delivers remarkable unit economics: 30 covers/day at $24 average ticket on sub-$1,800/month rent.",
  },
  {
    question: 'How much does commercial rent cost in Wollongong?',
    answer: "Wollongong commercial rent ranges from $900-$1,800/month in outer working-class suburbs like Berkeley and Port Kembla, to $3,000-$7,500/month for prime Crown Street CBD positions. Inner coastal suburbs like North Wollongong and Fairy Meadow sit at $1,800-$4,500/month. Kiama (the premium coastal market) ranges $2,500-$5,500/month. Thirroul runs $2,000-$4,200/month. Rents across the Illawarra are 35-55% below Sydney inner-suburb equivalents for comparable foot traffic quality.",
  },
  {
    question: 'Is Wollongong good for opening a restaurant?',
    answer: "Wollongong is good for opening a restaurant if you choose the right suburb and cuisine. Kiama is the region's strongest restaurant market — tourism economy plus high-income local demographic sustains 7-day dinner trade in summer. Fairy Meadow and Thirroul are strong for quality casual dining. Wollongong CBD works for lunch and Thursday-Saturday dinner with a clear cuisine identity. Most Wollongong suburbs are weekend-primary restaurant markets — weekday dinner trade outside the CBD and Kiama is genuinely thin.",
  },
  {
    question: 'How does Wollongong compare to Sydney for business costs?',
    answer: "Commercial rents in Wollongong are 35-55% below Sydney inner-suburb equivalents. A position comparable to Newtown or Glebe in Wollongong (Fairy Meadow or North Wollongong) costs $2,000-$4,000/month versus $6,000-$12,000/month in Sydney. Staffing costs are marginally lower (5-10%) and average cafe ticket is $18-24 versus $22-30 in inner Sydney. The business case in Wollongong is built on significantly lower fixed costs. Revenue ceilings are also lower, but for operators priced out of Sydney, Wollongong's coastal suburbs offer genuine quality of life and financially viable hospitality businesses.",
  },
  {
    question: 'What are the risks of opening a business in Wollongong?',
    answer: "The primary risks: (1) Weekend-demand trap — many suburbs have strong Saturday brunch trade but thin weekday volumes, making annual average revenue much lower than weekend-peak figures suggest. (2) University seasonality — Gwynneville and student-adjacent suburbs lose 30-40% of foot traffic during December-February semester break. (3) Rent optimism — Crown Street CBD landlords quote rents priced for a hospitality culture the market is still building; negotiate hard. (4) Destination overestimation — suburban Wollongong does not have the tourist draw of Sydney's inner suburbs; most revenue must come from loyal locals.",
  },
  {
    question: 'Which Wollongong suburbs are underrated for business in 2026?',
    answer: "Three consistently underperform their reputation and deserve more operator attention: Thirroul (the Illawarra's most coveted village strip, priced below its demographic quality), Gerringong (south of Kiama, boutique high-income residential with minimal competition), and Shellharbour Village (stronger local base than Kiama at lower rent and seasonality).",
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

function WollongongFactorDirectory() {
  const suburbs = getAllWollongongSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/wollongong/${s.slug}`} style={{ textDecoration: 'none' }}>
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
              <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '760px' }}>{s.verdictReason}</p>
              <FactorGrid factors={s.factors} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function WollongongPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Wollongong"
        citySlug="wollongong"
        tagline="Steel city meets beach lifestyle. Wollongong's Illawarra strip offers Sydney-quality coastal demographics at 35-55% below Sydney rents — for operators who understand the weekend economy."
        statChips={[
          { text: '20 suburbs scored — CBD to beach strip to south coast satellites' },
          { text: "North Wollongong: the region's best undiscovered cafe market" },
          { text: 'Rents 35-55% below comparable Sydney inner-suburb positions' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, Illawarra commercial property benchmarks Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '320K+', label: 'Illawarra region population — largest regional city in NSW south of Sydney', source: 'ABS 2024' },
              { value: '55%', label: 'Lower commercial rents vs comparable Sydney inner-suburb strips', source: 'Illawarra Commercial Property 2026' },
              { value: '2hr', label: 'Day-trip catchment from Sydney — 2.5 million potential weekend visitors within range', source: 'Transport for NSW 2024' },
              { value: '40K+', label: 'University of Wollongong students driving consistent semester-time demand', source: 'UOW 2025' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Wollongong Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Wollongong is one of Australia's most misread business markets. The steel city stigma — a legacy of BHP's closure in 1999 — has kept operator attention and commercial rents below what the city's demographics actually warrant. The reality in 2026: the Illawarra has a growing professional population, a world-class beach strip, a major university, and Sydney escapees who have brought Sydney spending habits to a city where rents are 35-55% lower. For hospitality operators who read this market correctly, Wollongong offers better unit economics than comparable Sydney suburban strips.",
              "The coastal strip is where the opportunity concentrates. North Wollongong's beach precinct, Fairy Meadow's Lawrence Hargrave Drive, Thirroul's village strip, and Austinmer's boutique beach community all deliver demographics that spend generously on quality food and coffee. These markets are not oversaturated — quality independent concepts find genuine whitespace without the competition intensity of comparable Sydney precincts.",
              "The Wollongong CBD functions differently to what its size might suggest. Crown Street Mall is the foot traffic anchor, and weekday office worker trade from the surrounding commercial towers is real — but the hospitality culture is still maturing. The CBD works for well-located cafes and clearly positioned restaurants; it fails operators who pay headline rents for positions with below-average flow, or who project weekend tourist revenue across weekday afternoons.",
              "The south coast satellites — Kiama and Shellharbour — are Wollongong's tourism anchors. Kiama in particular draws visitors year-round, with peak summer revenue that can be exceptional. These markets reward operators with genuine local bases to sustain them through the cooler months. University of Wollongong proximity creates a distinct student market in Gwynneville and Keiraville — consistent during semester, materially softer in December-February.",
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
              { type: 'Cafes and Specialty Coffee', insight: "North Wollongong is the region's benchmark cafe opportunity — beach proximity, UOW corridor trade, and no quality incumbent. Fairy Meadow is the best pure-community cafe market: established independent culture, loyal demographics, and rents 40% below Crown Street. Thirroul for operators who want the village feel.", best: ['North Wollongong', 'Fairy Meadow', 'Thirroul'] },
              { type: 'Full-Service Restaurants', insight: "Kiama leads for restaurants — tourism economy and high local income sustain 7-day dinner trade at premium pricing. Fairy Meadow and Thirroul work for quality casual dining with a loyal local base. Crown Street CBD works Thursday-Saturday for clearly positioned cuisine concepts.", best: ['Kiama', 'Fairy Meadow', 'Wollongong CBD'] },
              { type: 'Retail (Independent)', insight: "Figtree's Westfield proximity creates reliable retail foot traffic for the right concept. Thirroul suits artisan and lifestyle retail matching its creative community demographic. Fairy Meadow's independent strip supports quality specialty retail that aligns with the residential demographic.", best: ['Thirroul', 'Figtree', 'Fairy Meadow'] },
              { type: 'Fitness and Wellness', insight: 'Boutique fitness follows high-income professional residential. North Wollongong and Fairy Meadow have beach lifestyle demographics that sustain reformer pilates, yoga, and functional training at $80-$100/week. Keiraville suits wellness concepts serving the UOW academic community.', best: ['North Wollongong', 'Fairy Meadow', 'Keiraville'] },
              { type: 'Tourism Hospitality', insight: "Kiama is the Illawarra's strongest tourism hospitality market — the Blowhole draws year-round visitors and peak summer revenue is exceptional. Shellharbour Village is the secondary tourism market with a stronger local base and lower seasonal volatility.", best: ['Kiama', 'Shellharbour', 'North Wollongong'] },
              { type: 'Student and Value Concepts', insight: "Gwynneville and Keiraville serve the UOW student population — reliable demand during semester (March-November), 30-40% softer in the December-February break. Lowest rents in the inner suburb ring make break-even achievable at modest volumes.", best: ['Gwynneville', 'Keiraville', 'Wollongong CBD'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Wollongong Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'North Wollongong', slug: 'north-wollongong', verdict: wVerdict('north-wollongong'), score: wScore('north-wollongong'), rentFrom: '$2,200/mo', body: "The strongest cafe opportunity in the Illawarra region. Beach proximity creates weekend brunch demand at $22-28/head, UOW corridor provides weekday base trade, and there is no quality specialty cafe incumbent on the beachfront strip. A quality operator who establishes here before the market catches on will own the suburb's social morning for years." },
              { rank: 2, name: 'Fairy Meadow', slug: 'fairy-meadow', verdict: wVerdict('fairy-meadow'), score: wScore('fairy-meadow'), rentFrom: '$1,800/mo', body: "Wollongong's most established independent cafe suburb. Lawrence Hargrave Drive has a proven culture of supporting independent business — young professional renters from Sydney bring Melbourne-calibre cafe expectations at Wollongong rents. The best pure-community market in the Illawarra." },
              { rank: 3, name: 'Thirroul', slug: 'thirroul', verdict: wVerdict('thirroul'), score: wScore('thirroul'), rentFrom: '$2,000/mo', body: "DH Lawrence's Wollongong — the most coveted village strip in the Illawarra. A creative, artistic community with above-average income and genuine loyalty to quality independent operators. Rents at $2,000-$4,200/month for foot traffic that rivals far more expensive Sydney village strips." },
              { rank: 4, name: 'Kiama', slug: 'kiama', verdict: wVerdict('kiama'), score: wScore('kiama'), rentFrom: '$2,500/mo', body: "The region's premium tourism market. Kiama Blowhole drives year-round visitors and the local demographic has the highest per-head spend in the Illawarra outside the CBD. Strong operators who build genuine local loyalty through winter come out of summer with exceptional annual unit economics." },
              { rank: 5, name: 'Wollongong CBD', slug: 'wollongong-cbd', verdict: wVerdict('wollongong-cbd'), score: wScore('wollongong-cbd'), rentFrom: '$3,000/mo', body: "Crown Street Mall anchors the region's highest weekday foot traffic. Office tower proximity drives reliable morning and lunch trade. The caution: headline CBD rents ($5,000-$7,500/month) require hard negotiation — vacancy on secondary CBD streets gives operators significant leverage." },
              { rank: 6, name: 'Corrimal', slug: 'corrimal', verdict: wVerdict('corrimal'), score: wScore('corrimal'), rentFrom: '$1,500/mo', body: "Northern Wollongong's established community market. Loyal working-class and young family demographic that actively supports independent businesses over chains. Rents well below the coastal strip — community cafe economics are consistently strong." },
              { rank: 7, name: 'Shellharbour', slug: 'shellharbour', verdict: wVerdict('shellharbour'), score: wScore('shellharbour'), rentFrom: '$2,000/mo', body: "Shellharbour Village precinct has genuine heritage charm and a growing residential base from the broader Shellharbour LGA. Less seasonal than Kiama, stronger local demographic, and Stocklands shopping centre creates baseline foot traffic for retail concepts." },
              { rank: 8, name: 'Austinmer', slug: 'austinmer', verdict: wVerdict('austinmer'), score: wScore('austinmer'), rentFrom: '$900/mo', body: "The region's boutique beach village. Sub-$1,800/month rent with 30 covers/day at $24 average ticket creates break-even economics that exceed much more expensive positions. Weekend-only viable — the small catchment cannot sustain 6-day operations." },
              { rank: 9, name: 'Dapto', slug: 'dapto', verdict: wVerdict('dapto'), score: wScore('dapto'), rentFrom: '$1,800/mo', body: "Wollongong's largest growth corridor south of the CBD. New residential arrivals from Sydney are creating hospitality demand that the existing supply has not yet met — a first-mover window for operators comfortable with a 12-18 month community build." },
              { rank: 10, name: 'Figtree', slug: 'figtree', verdict: wVerdict('figtree'), score: wScore('figtree'), rentFrom: '$2,000/mo', body: "High-income residential suburb anchored by Westfield Figtree. The shopping centre creates reliable foot traffic, and the professional demographic has above-average spend. Independent concepts that complement rather than compete with Westfield anchors perform best." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/wollongong/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Wollongong address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Wollongong address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#CCFBF1', color: '#134E4A', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Wollongong address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Wollongong Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>20 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="wollongong" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Wollongong Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'North Wollongong vs Fairy Meadow', body: "North Wollongong has the stronger weekend peak — beach proximity creates Saturday-Sunday brunch trade that rivals any comparable Sydney beachside suburb, at a fraction of the rent. Fairy Meadow has the stronger weekday base — the established independent community means regulars arrive Monday to Friday. For operators who need volume 7 days, Fairy Meadow is more reliable. For operators building around weekend brunch, North Wollongong is the better bet." },
              { title: 'Wollongong CBD vs Fairy Meadow', body: "The CBD offers the region's highest weekday foot traffic, anchored by office towers and Crown Street Mall. But rents are 2-3x Fairy Meadow for comparable or worse hospitality culture. Fairy Meadow's lower rent means break-even is achievable at 40 covers/day; the CBD requires 55-70 covers/day. For operators without deep capital and high-volume confidence, Fairy Meadow's economics are materially more forgiving." },
              { title: 'Kiama vs Shellharbour', body: "Kiama delivers higher peak revenue — tourism draw from the Blowhole is genuinely exceptional in summer. Shellharbour has a stronger year-round residential base and less seasonal dependence. For operators who can sustain 3-4 lean winter months and model the summer correctly, Kiama offers the region's highest revenue ceiling. For operators who need consistent year-round trade, Shellharbour is more predictable." },
              { title: 'Thirroul vs Austinmer', body: "Both are village beach communities north of Wollongong. Thirroul is the more established market — larger commercial strip, stronger foot traffic, more diverse demographic. Austinmer is the boutique play — smaller catchment, but sub-$1,800/month rent means the break-even bar is the lowest in the region. A quality operator who owns Austinmer's morning captures exceptional unit economics at minimal capital risk." },
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
              { name: 'Crown Street CBD (without negotiated rent)', why: "Crown Street headline rents ($5,000-$7,500/month) are priced for a hospitality culture that Wollongong is still building. Secondary CBD blocks with below-average foot traffic are the highest-failure-rate positions in the region. Vacancy leverage is real — use it. Every quoted CBD rent is a negotiation starting point, not a fixed price." },
              { name: 'Gwynneville and Keiraville (January-February)', why: "University of Wollongong semester break removes 30-40% of foot traffic from December to February. Operators who open in semester without planning for the summer break consistently underperform their projections in their first January. Student suburb business models require a local non-student resident base to sustain the break period." },
              { name: 'Illawarra outer suburbs (Berkeley, Port Kembla)', why: "Working-class outer suburbs with high-value industrial heritage but limited commercial hospitality viability. Low household incomes constrain hospitality pricing at exactly the level that makes fixed-cost recovery difficult. These markets suit essential services and value food, not premium independent hospitality concepts." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Wollongong Suburb Factor Breakdown — All 20 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <WollongongFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Wollongong Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Wollongong location?"
        subtitle="Run a free analysis on any Wollongong address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/wollongong/north-wollongong" style={{ color: C.brand, textDecoration: 'none' }}>North Wollongong Analysis →</Link>
          <Link href="/analyse/wollongong/fairy-meadow" style={{ color: C.brand, textDecoration: 'none' }}>Fairy Meadow Analysis →</Link>
          <Link href="/analyse/wollongong/kiama" style={{ color: C.brand, textDecoration: 'none' }}>Kiama Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
