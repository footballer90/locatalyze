// app/(marketing)/analyse/orange/page.tsx
// Orange city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getOrangeSuburb, getOrangeSuburbs } from '@/lib/analyse-data/orange'

function orScore(slug: string): number {
  return getOrangeSuburb(slug)?.compositeScore ?? 0
}
function orVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getOrangeSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Orange NSW — 2026 Location Guide',
  description:
    'Orange business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Orange suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/orange' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Orange NSW — 2026 Location Guide',
    description: '7 Orange suburbs ranked and scored. Rent benchmarks, foot traffic data, FOOD Week impact, wine tourism season, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/orange',
  },
}

const COMPARISON_ROWS = [
  { name: 'Orange CBD', score: orScore('orange-cbd'), verdict: orVerdict('orange-cbd'), rent: '$2,500–$5,000', footTraffic: 'High', bestFor: 'Premium dining, boutique retail, food tourism' },
  { name: 'Summer Street', score: orScore('summer-street'), verdict: orVerdict('summer-street'), rent: '$3,000–$5,500', footTraffic: 'High (peaks)', bestFor: 'Destination dining, wine bars, artisan food' },
  { name: 'Moulder Park', score: orScore('moulder-park'), verdict: orVerdict('moulder-park'), rent: '$1,500–$3,500', footTraffic: 'High (retail anchor)', bestFor: 'Convenience dining, specialty coffee' },
  { name: 'Bloomfield', score: orScore('bloomfield'), verdict: orVerdict('bloomfield'), rent: '$1,800–$3,500', footTraffic: 'Medium-High (hospital)', bestFor: 'Breakfast/lunch, specialty coffee' },
  { name: 'Canobolas', score: orScore('canobolas'), verdict: orVerdict('canobolas'), rent: '$1,200–$2,500', footTraffic: 'Medium', bestFor: 'Family cafe, casual dining' },
  { name: 'Lucknow', score: orScore('lucknow'), verdict: orVerdict('lucknow'), rent: '$800–$2,000', footTraffic: 'Medium (seasonal)', bestFor: 'Artisan food, heritage tourism' },
  { name: 'Spring Hill', score: orScore('spring-hill'), verdict: orVerdict('spring-hill'), rent: '$700–$1,800', footTraffic: 'Low-Medium', bestFor: 'Essential services, community cafe' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Destination Dining — Summer Street and CBD',
    description: "Orange CBD and Summer Street have built one of the strongest regional food identities in NSW. This is not aspirational positioning — it is a genuine and documented reputation, validated by Sydney food media, national restaurant guides, and tens of thousands of annual FOOD Week visitors. New entrants must bring a genuine point of difference; the market rewards excellence and punishes format duplication.",
    suburbs: [
      { name: 'Orange CBD', slug: 'orange-cbd', description: 'The culinary heart of Central West NSW. A growing concentration of quality independent operators has created a destination dining identity that draws visitors from Sydney and across regional NSW. Strong resident base with above-average food culture sophistication. FOOD Week and the Central Tablelands wine region create a genuine tourism revenue layer on top of consistent local demand.', score: orScore('orange-cbd'), verdict: orVerdict('orange-cbd'), rentRange: '$2,500–$5,000/mo' },
      { name: 'Summer Street', slug: 'summer-street', description: "Orange's premium dining corridor with national-level restaurant recognition. Award-winning operators have built repeat visitor followings from Sydney and the Hunter. Weekend covers at quality operators regularly exceed their local customer base. The highest tourism exposure in the dataset — and the highest quality bar for new entrants. Moderate seasonal variation tied to harvest and FOOD Week calendar.", score: orScore('summer-street'), verdict: orVerdict('summer-street'), rentRange: '$3,000–$5,500/mo' },
    ],
  },
  {
    title: 'Retail and Professional Anchors',
    description: 'Moulder Park and Bloomfield deliver consistent year-round trade from anchored demand sources that are largely insulated from tourism seasonality. Moulder Park is driven by large-format retail foot traffic. Bloomfield is driven by the hospital workforce — one of the most recession-resistant catchments in regional Australia.',
    suburbs: [
      { name: 'Moulder Park', slug: 'moulder-park', description: "Orange's major retail precinct with supermarket and national chain anchors generating consistent weekly resident foot traffic. Quality convenience coffee, specialty food, and casual dining concepts find loyal community followings within the broader retail environment. No tourism overlay — pure resident-serving market with strong baseline consistency.", score: orScore('moulder-park'), verdict: orVerdict('moulder-park'), rentRange: '$1,500–$3,500/mo' },
      { name: 'Bloomfield', slug: 'bloomfield', description: 'Hospital precinct of Orange. Orange Base Hospital — the principal referral hospital for Central West NSW — generates a large and consistent hospitality demand from medical staff, allied health workers, and patients families. Breakfast and lunch operators, specialty coffee, and grab-and-go formats have clear unmet demand. Hospital workforce trades reliably regardless of consumer confidence cycles.', score: orScore('bloomfield'), verdict: orVerdict('bloomfield'), rentRange: '$1,800–$3,500/mo' },
    ],
  },
  {
    title: 'Residential Growth',
    description: 'Canobolas and Spring Hill serve the southern residential growth corridors of Orange. Canobolas has a growing family demographic that is currently travelling to the CBD or Moulder Park for quality food — the first-mover opportunity is open. Spring Hill is a smaller, community-scale market with genuine but modest demand.',
    suburbs: [
      { name: 'Canobolas', slug: 'canobolas', description: 'Southern residential growth area with estate development delivering a growing family demographic underserved by local quality hospitality. First-mover window open for correctly positioned cafe and casual dining concepts. Conservative initial revenue projections with a 12 to 18-month ramp as residential density increases. No tourism overlay — stable and predictable resident trade.', score: orScore('canobolas'), verdict: orVerdict('canobolas'), rentRange: '$1,200–$2,500/mo' },
      { name: 'Spring Hill', slug: 'spring-hill', description: 'Modest southern residential suburb with a small-scale community commercial offering. The market is limited by catchment size rather than concept failure. Very low commercial rents make break-even viable at conservative volumes. Suits community-service operators who choose this location to serve the local residential community at accessible price points.', score: orScore('spring-hill'), verdict: orVerdict('spring-hill'), rentRange: '$700–$1,800/mo' },
    ],
  },
  {
    title: 'Tourism Satellite',
    description: "Lucknow is Orange's heritage gold rush satellite — a charming historic village 7km from the city centre that has developed a food tourism identity anchored in artisan producers, weekend markets, and destination small-batch food concepts. The opportunity is specific and seasonal; operators who thrive here build a concept that appeals to the food tourism visitor rather than primarily serving local residents.",
    suburbs: [
      { name: 'Lucknow', slug: 'lucknow', description: 'Heritage gold rush village 7km east of Orange. Artisan producers and a weekend market have created a food tourism satellite to the Orange wine and dining economy. Autumn harvest and FOOD Week generate genuine visitor foot traffic in a small-town setting. Very low commercial rents with premium per-visit spend from food-literate tourism visitors. Material seasonal variation — plan carefully for the quieter summer and winter months.', score: orScore('lucknow'), verdict: orVerdict('lucknow'), rentRange: '$800–$2,000/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'How significant is FOOD Week for Orange businesses?',
    answer: "FOOD Week is one of Australia's most established regional food festivals — it draws tens of thousands of visitors to Orange annually and has been central to building the city's food and wine destination identity over the past two decades. For Summer Street and CBD operators, FOOD Week represents a genuine peak revenue period with visitor numbers that materially exceed the local residential base. The practical effect for business operators is that FOOD Week weekend and the surrounding weeks represent the strongest trading period of the year for hospitality businesses positioned in the CBD and Summer Street precincts. The broader FOOD Week effect is also cumulative: each festival reinforces Orange's food destination reputation, which drives visitor interest and spend throughout the year rather than only during the event itself.",
  },
  {
    question: 'What is the wine tourism season in Orange and how does it affect hospitality trade?',
    answer: "The Central Tablelands wine region has two primary peak periods that align with the harvest and growing calendar. Autumn — March through May — is the harvest season and the strongest visitor period, with the FOOD Week festival typically occurring in October reinforcing the spring peak. The summer months (December to February) and winter (June to August) are the quieter visitor periods when the Central Tablelands altitude creates cold winters and hot summers that reduce the leisure tourism draw from Sydney. For Summer Street and CBD operators, the practical model is to treat autumn and spring as the peak tourism revenue periods and ensure the local residential base sustains trade through summer and winter. The seasonal variation is real but not extreme — the resident base of approximately 42,000 provides a solid year-round foundation.",
  },
  {
    question: 'Summer Street or Orange CBD — which is better for a restaurant?',
    answer: "Summer Street is Orange's highest-profile dining address and the location most associated with the city's national food reputation — if your concept can compete at the level expected on Summer Street, it is the strongest positioning for a destination restaurant. The challenge is that Summer Street operators have built loyal repeat visitor followings from Sydney and regional NSW that new entrants must displace or supplement rather than simply fill a gap. The Orange CBD offers a broader and more diverse customer base with strong resident dining demand and food tourism overlay, but without the concentrated destination intensity of Summer Street. For operators who are confident in competing at the highest regional standard, Summer Street is the aspirational choice. For operators who want strong food tourism adjacency with a more balanced resident and visitor demand profile, the CBD gives more operational flexibility.",
  },
  {
    question: 'Is the Bloomfield hospital precinct really a viable hospitality location?',
    answer: "Hospital precincts are structurally among the most reliable hospitality catchments in any regional market, and Bloomfield is genuinely underserved relative to the size and spending power of the Orange Base Hospital workforce. Medical and allied health staff have above-average incomes, shift patterns that require early-morning and after-shift food options, and a strong habitual cafe culture. The captive daytime market from patients' families adds a consistent additional demand layer. The key advantages are that hospital workforce trade is recession-resistant — medical staff keep their jobs and their coffee habits regardless of consumer confidence cycles — and the shift patterns create demand at times (early morning, late afternoon) that many CBD operators do not serve well. A quality breakfast and lunch operator or specialty coffee concept in the Bloomfield precinct is building on a captive and reliable customer base.",
  },
  {
    question: 'What is the quality bar for entering the Orange dining market?',
    answer: "Orange has a food culture that is genuinely sophisticated relative to its population size — the combination of a well-travelled resident population, decades of wine and food tourism development, and the influence of national food media coverage has created a customer base with high expectations and low tolerance for mediocrity. Summer Street in particular has been reviewed in national publications and has attracted operators with significant hospitality credentials. The practical implication for new entrants is that generic concepts — a cafe with an average menu, a restaurant with no clear identity — will struggle to build the loyalty and reputation that sustains a business in this market. Operators who succeed in Orange bring genuine quality, a clear concept identity, and the ability to engage the food-literate visitor and resident demographic on their terms.",
  },
  {
    question: 'Is Lucknow worth considering for an artisan food business?',
    answer: "Lucknow is a specific opportunity for a specific type of operator — it is not a general hospitality location, but it can be an excellent one for the right concept. The heritage gold rush village setting, the existing cluster of artisan producers, and the food tourism visitors who extend their Orange weekends to include Lucknow create a market that rewards authentic, place-specific food concepts with genuine craft credentials. The revenue model is seasonal and tourism-dependent: the autumn harvest season and spring FOOD Week period generate the strongest visitor trade, while summer and winter require either conservative operations or a plan to sustain through the quieter months. Very low commercial rents mean that the break-even volume is achievable at modest sales figures. The opportunity is real for operators who can build a concept that earns a place in the Orange food tourism itinerary.",
  },
  {
    question: 'What types of businesses are most underserved in Orange right now?',
    answer: "The clearest gap in the Orange market is quality hospitality in the Bloomfield hospital precinct — early-morning specialty coffee, quality breakfast and lunch, and grab-and-go food concepts for the hospital workforce are genuinely underserved relative to the size and spending power of that catchment. In the residential growth corridors — Canobolas in particular — quality family cafe concepts are travelling to the CBD or Moulder Park because nothing comparable exists locally. The Moulder Park retail precinct has national chain food and coffee but limited quality independent alternatives, which is an opportunity for specialty operators who can differentiate on quality within the large-format retail environment. Summer Street and the CBD are well-served at the high end; the gap is in formats that serve the broader residential population outside the premium dining precincts.",
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

function OrangeFactorDirectory() {
  const suburbs = getOrangeSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/orange/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function OrangePage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Orange"
        citySlug="orange"
        tagline="Orange has built one of the most credible regional food identities in Australia. Summer Street has national dining recognition. The Central Tablelands wine region and FOOD Week drive genuine tourism revenue. The quality bar is real — and so is the opportunity."
        statChips={[
          { text: '7 suburbs scored — Summer Street destination dining to residential growth' },
          { text: 'FOOD Week: tens of thousands of annual visitors, national food media recognition' },
          { text: 'Central Tablelands wine region — autumn harvest and spring peak seasons' },
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
              { value: '42K', label: 'Orange population — regional city with metropolitan food culture expectations', source: 'ABS 2024' },
              { value: 'FOOD\nWeek', label: 'Annual food festival drawing tens of thousands of visitors — primary tourism peak', source: 'FOOD Week 2025' },
              { value: 'Oct', label: 'FOOD Week peak — plus autumn harvest March to May as the second tourism high', source: 'Destination NSW 2025' },
              { value: '$700', label: 'Commercial rents from $700/month — competitive entry cost for residential and satellite positions', source: 'NSW Valuer General Q1 2026' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: C.brand, marginBottom: '8px', whiteSpace: 'pre-line' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Orange Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Orange is the emerging destination food city of regional NSW. A city of approximately 42,000 people in the Central Tablelands has built a food and wine tourism reputation that substantially exceeds what its population size alone would predict. Summer Street has attracted operators whose restaurants appear in national food media and whose weekend bookings draw visitors from Sydney who plan their trip around a table rather than finding a table as an afterthought. This is a genuine and documented reputation — not a marketing claim.",
              "The engine behind the food identity is the Central Tablelands wine region and the FOOD Week festival. The wine region produces cool-climate varieties — Cabernet Sauvignon, Chardonnay, Shiraz, Riesling — that have developed strong critical recognition and a loyal visitor following. FOOD Week attracts tens of thousands of visitors annually and has been running long enough to have built cumulative visitor loyalty: people return because the festival and the city's food scene have consistently delivered. This is not seasonal dependency in the traditional sense — it is a deliberately cultivated food tourism economy that has real and growing commercial weight.",
              "The Bloomfield hospital precinct is the underappreciated opportunity in the Orange market. Orange Base Hospital is the principal referral hospital for Central West NSW — a large institution with a substantial medical workforce, significant allied health staff, and a consistent demand from patients' families. This precinct is currently underserved relative to the spending power and volume of the hospital workforce. Quality breakfast and lunch concepts, specialty coffee, and grab-and-go formats that serve shift workers have a captive market that trades reliably regardless of the food tourism calendar.",
              "Be clear about the quality bar before entering Summer Street or the CBD dining precinct. The destination dining identity that makes Orange attractive as a market is maintained by operators who have invested in genuine quality — the food-literate visitors who plan weekends in Orange have expectations shaped by the best of what is already there. Generic concepts, average execution, or format duplication of what is already well-established on the strip will struggle to build the reputation that sustains a hospitality business in this environment. The opportunity is real; the standard required to capture it is also real.",
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
              { type: 'Cafes and Specialty Coffee', insight: "Bloomfield hospital precinct is the strongest underserved cafe opportunity in Orange — the hospital workforce demand is captive, consistent, and high-frequency. Moulder Park suits volume-focused coffee operators. Canobolas is the residential first-mover opportunity. Summer Street and CBD suit the premium cafe positioning that serves both residents and food tourism visitors.", best: ['Bloomfield', 'Moulder Park', 'Canobolas'] },
              { type: 'Full-Service Restaurants', insight: "Summer Street is the aspirational address — national dining recognition, loyal visitor following, above-average per-visit spend. The quality bar is the highest in the dataset. Orange CBD offers strong food tourism and resident demand with more operational flexibility. Both suit operators who can genuinely compete at a destination dining standard.", best: ['Summer Street', 'Orange CBD'] },
              { type: 'Retail (Independent)', insight: "Orange CBD suits boutique retail that positions for the food tourism visitor and quality-seeking resident. Moulder Park delivers the highest consistent residential retail foot traffic. Lucknow suits artisan and curated retail for the heritage tourism niche at very low rent — the right concept in the right setting can command premium per-item pricing.", best: ['Orange CBD', 'Moulder Park', 'Lucknow'] },
              { type: 'Wine Bars and Tasting Rooms', insight: "Summer Street is the natural home for wine bar concepts in Orange — the food tourism visitor demographic is the ideal customer, and the concentration of quality operators creates a destination strip that benefits all participants. The CBD suits wine bar concepts that want to serve both the resident base and the food tourism visitor with a slightly less concentrated competition profile.", best: ['Summer Street', 'Orange CBD'] },
              { type: 'Fitness and Wellness', insight: "The Bloomfield hospital precinct creates allied health and wellness demand from the medical workforce. Moulder Park suits high-volume fitness formats with consistent retail foot traffic. Orange CBD suits premium wellness and fitness concepts that serve the quality-seeking resident demographic who also engages with the broader food culture.", best: ['Bloomfield', 'Moulder Park', 'Orange CBD'] },
              { type: 'Artisan and Destination Food', insight: "Lucknow is the specific Orange opportunity for artisan and destination small-batch food concepts — the heritage setting, very low rents, and food tourism adjacency create a viable environment for operators whose concept is distinctive enough to earn a place in the Orange food weekend itinerary. The seasonal model requires careful planning.", best: ['Lucknow', 'Summer Street'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Orange Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Bloomfield', slug: 'bloomfield', verdict: orVerdict('bloomfield'), score: orScore('bloomfield'), rentFrom: '$1,800/mo', body: "Hospital precinct with the strongest unmet demand in the Orange dataset. Orange Base Hospital generates a large and consistent captive workforce market — medical and allied health staff with above-average incomes and high-frequency cafe habits. Quality breakfast, lunch, and coffee concepts are genuinely underserved relative to the workforce volume. Recession-resistant demand that trades reliably regardless of tourism season." },
              { rank: 2, name: 'Orange CBD', slug: 'orange-cbd', verdict: orVerdict('orange-cbd'), score: orScore('orange-cbd'), rentFrom: '$2,500/mo', body: "The culinary heart of Central West NSW. A documented and growing food destination reputation draws visitors from Sydney and regional NSW who plan weekends around the dining experience. Strong resident base of approximately 42,000 people with metropolitan food expectations. FOOD Week and the wine region create a genuine tourism revenue layer. Competition is high — generic concepts will struggle; quality operators with a clear identity find a loyal and food-literate market." },
              { rank: 3, name: 'Summer Street', slug: 'summer-street', verdict: orVerdict('summer-street'), score: orScore('summer-street'), rentFrom: '$3,000/mo', body: "National-level dining reputation in a regional city. Award-winning operators have built loyal visitor followings from Sydney that book weekends specifically for the Summer Street experience. The highest tourism concentration and the highest quality bar in the Orange dataset. For operators who can genuinely compete at this level, the revenue from food tourism visitors is materially above what a residential market alone would generate. Moderate seasonal variation tied to wine harvest and FOOD Week calendar." },
              { rank: 4, name: 'Moulder Park', slug: 'moulder-park', verdict: orVerdict('moulder-park'), score: orScore('moulder-park'), rentFrom: '$1,500/mo', body: "Major retail precinct with consistent year-round residential foot traffic. Supermarket and national chain anchors generate reliable weekly shopping traffic from the western and northern Orange residential base. Quality specialty coffee and casual dining find loyal community followings within the retail environment. No tourism seasonality — stable 52-week resident trade. Competition from national chains requires clear quality differentiation." },
              { rank: 5, name: 'Canobolas', slug: 'canobolas', verdict: orVerdict('canobolas'), score: orScore('canobolas'), rentFrom: '$1,200/mo', body: "Southern residential growth area with quality hospitality absent from the local commercial strips. Growing family demographic currently travelling to the CBD or Moulder Park for food — the demand is real and the first-mover opportunity is open. Conservative initial revenue projections with a 12 to 18-month ramp as residential density increases. Very low seasonality — stable resident trade with no tourism overlay to manage." },
              { rank: 6, name: 'Lucknow', slug: 'lucknow', verdict: orVerdict('lucknow'), score: orScore('lucknow'), rentFrom: '$800/mo', body: "Heritage gold rush village 7km east of Orange. Artisan producers and a weekend market have created a food tourism satellite to the Orange wine and dining economy. Food tourism visitors extend Orange weekends to include Lucknow during autumn harvest and FOOD Week. Very low commercial rents with premium per-visit spend from food-literate visitors. Material seasonal variation — summer and winter are significantly quieter. A specific opportunity for the right artisan concept." },
              { rank: 7, name: 'Spring Hill', slug: 'spring-hill', verdict: orVerdict('spring-hill'), score: orScore('spring-hill'), rentFrom: '$700/mo', body: "Modest southern residential suburb with a small-scale community commercial offering. The market is limited by catchment size — this is a community-scale location for community-scale concepts. Very low commercial rents make break-even viable at conservative volumes. Suits operators who choose this location specifically to serve the local residential community at accessible price points rather than as a stepping stone to growth." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/orange/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #431407 0%, #C2410C 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Orange address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Orange address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FFF7ED', color: '#431407', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Orange address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Orange Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="orange" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — All Orange Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Summer Street vs Orange CBD', body: "Summer Street is the destination dining address — higher tourism concentration, national media recognition, and the strongest peak revenue from food tourism visitors. It also has the highest quality bar and the most established competition. Orange CBD has a broader and more balanced demand profile — strong resident dining trade with food tourism overlay but without the concentrated destination intensity of Summer Street. For operators with the credentials to compete at the highest regional standard, Summer Street. For operators who want strong food tourism adjacency with more format flexibility and a more balanced customer base, the CBD." },
              { title: 'Bloomfield vs Moulder Park', body: "Both are reliable year-round trade environments without meaningful tourism seasonality. Bloomfield has the stronger demand-supply gap — the hospital workforce is a captive, high-frequency, above-average-income customer base that is currently underserved. Moulder Park has higher foot traffic volume from the large-format retail anchors but more established competition from national chains. For specialty coffee and quality breakfast and lunch, Bloomfield's unmet demand is a stronger opportunity. For volume-focused concepts that can differentiate within a retail environment, Moulder Park delivers consistent baseline foot traffic." },
              { title: 'Lucknow vs Canobolas', body: "Fundamentally different market types. Lucknow is a seasonal tourism-dependent opportunity for artisan and destination food concepts — the revenue case depends substantially on food tourism visitors rather than a local residential base, and the seasonal variation is material. Canobolas is a residential first-mover opportunity — the revenue case is entirely resident-driven with very low seasonality, and the demand ramps as the residential estate density grows. Lucknow suits operators whose concept can earn a place in the Orange food tourism itinerary. Canobolas suits operators who want to build a stable community business in a growing residential catchment." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>The Seasonality Reality — What Every Orange Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that determine whether an Orange business succeeds on a 12-month basis.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'The Summer Street quality trap', why: "Summer Street is a market that rewards excellence and punishes mediocrity more sharply than lower-profile regional markets. Food-literate visitors who have read national media coverage arrive with expectations shaped by the best of what is already there. Operators who open with average execution, borrowed concepts, or insufficient investment in quality find that the food tourism visitor base does not return and the reputation damage travels quickly. The lesson from Summer Street is not to avoid it — it is to only enter it when the concept and execution genuinely justify the address." },
              { name: 'Tourism seasonality without a resident foundation', why: "The Central Tablelands wine tourism season has two distinct peaks — autumn harvest (March to May) and FOOD Week (October) — with quieter periods in summer and winter. Operators on Summer Street and in the CBD who rely too heavily on the tourism trade without building genuine local resident loyalty face softer months that require reserves accumulated during the peak periods. The resident base of 42,000 is large enough to sustain quality hospitality year-round — operators who build local loyalty treat the tourism peaks as upside rather than the primary revenue source." },
              { name: 'Underestimating the Bloomfield opportunity', why: "The Bloomfield hospital precinct consistently underwhelms the market's expectations — most operators focus on Summer Street and the CBD because that is where the food identity lives. The hospital workforce is a captive market of thousands of people with above-average incomes, early-morning shift patterns, and strong cafe habits who currently have limited quality options in the immediate precinct. The operators who recognise this before it becomes obvious to the broader market capture a loyalist customer base that does not require tourism season management and does not respond to consumer confidence cycles the way discretionary dining does." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Orange Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <OrangeFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Orange Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Orange location?"
        subtitle="Run a free analysis on any Orange address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/orange/summer-street" style={{ color: C.brand, textDecoration: 'none' }}>Summer Street Analysis →</Link>
          <Link href="/analyse/orange/orange-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Orange CBD Analysis →</Link>
          <Link href="/analyse/orange/bloomfield" style={{ color: C.brand, textDecoration: 'none' }}>Bloomfield Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
