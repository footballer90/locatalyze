// app/(marketing)/analyse/hobart/page.tsx
// Hobart city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getHobartSuburb, getHobartSuburbs } from '@/lib/analyse-data/hobart'

function hScore(slug: string): number {
  return getHobartSuburb(slug)?.compositeScore ?? 0
}
function hVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getHobartSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Hobart — 2026 Location Guide',
  description:
    'Hobart business location guide 2026. 14 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Hobart suburb for your café, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/hobart' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Hobart — 2026 Location Guide',
    description: '14 Hobart suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/hobart',
  },
}

const COMPARISON_ROWS = [
  { name: 'Salamanca Place', score: hScore('salamanca-place'), verdict: hVerdict('salamanca-place'), rent: '$5,500–$9,500', footTraffic: 'Very High (seasonal)', bestFor: 'Premium dining, tourism retail, hospitality' },
  { name: 'North Hobart', score: hScore('north-hobart'), verdict: hVerdict('north-hobart'), rent: '$3,800–$6,500', footTraffic: 'High', bestFor: 'Independent café, casual dining, specialty retail' },
  { name: 'Sandy Bay', score: hScore('sandy-bay'), verdict: hVerdict('sandy-bay'), rent: '$3,500–$5,500', footTraffic: 'High', bestFor: 'Premium café, specialty retail, professional services' },
  { name: 'Battery Point', score: hScore('battery-point'), verdict: hVerdict('battery-point'), rent: '$3,500–$5,500', footTraffic: 'Medium-High', bestFor: 'Specialty hospitality, boutique retail' },
  { name: 'Bellerive', score: hScore('bellerive'), verdict: hVerdict('bellerive'), rent: '$3,000–$5,000', footTraffic: 'Medium-High', bestFor: 'Café, casual dining, allied health' },
  { name: 'West Hobart', score: hScore('west-hobart'), verdict: hVerdict('west-hobart'), rent: '$2,500–$4,200', footTraffic: 'Medium', bestFor: "Specialty café, community dining" },
  { name: 'New Town', score: hScore('new-town'), verdict: hVerdict('new-town'), rent: '$2,500–$4,500', footTraffic: 'Medium', bestFor: 'Independent café, casual dining, retail' },
  { name: 'Moonah', score: hScore('moonah'), verdict: hVerdict('moonah'), rent: '$1,800–$3,200', footTraffic: 'Medium', bestFor: 'Value food, multicultural dining, creative concepts' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Tourism Premium — High Reward, High Seasonality',
    description: "Hobart's flagship precincts. The MONA effect and Salamanca market drive extraordinary peak-season revenue, but winter requires operators with a viable local customer base to sustain.",
    suburbs: [
      { name: 'Salamanca Place', slug: 'salamanca-place', description: "Tasmania's benchmark tourism precinct. Sandstone warehouses, Saturday market, and MONA ferry traffic drive exceptional summer revenue.", score: hScore('salamanca-place'), verdict: hVerdict('salamanca-place'), rentRange: '$5,500–$9,500/mo' },
      { name: 'Battery Point', slug: 'battery-point', description: "Historic inner south, deeply affluent. Heritage constraints limit supply — spaces rarely become available and operators who secure them stay.", score: hScore('battery-point'), verdict: hVerdict('battery-point'), rentRange: '$3,500–$5,500/mo' },
      { name: 'Bellerive', slug: 'bellerive', description: "East shore hub with Blundstone Arena event uplift. Strong professional residential base moderates the seasonal risk.", score: hScore('bellerive'), verdict: hVerdict('bellerive'), rentRange: '$3,000–$5,000/mo' },
      { name: 'Lindisfarne', slug: 'lindisfarne', description: "East shore village strip. Derwent foreshore draw adds tourism layer to a loyal professional residential base.", score: hScore('lindisfarne'), verdict: hVerdict('lindisfarne'), rentRange: '$2,800–$4,500/mo' },
    ],
  },
  {
    title: 'Best Risk/Return — Inner Hobart Growth Strips',
    description: "Where demand is proven but rents reflect the pre-gentrification era. These markets reward operators who enter before the demographic catches the rent curve.",
    suburbs: [
      { name: 'North Hobart', slug: 'north-hobart', description: "Elizabeth Street is Tasmania's best independent strip. Melbourne-calibre café culture at a fraction of mainland rents.", score: hScore('north-hobart'), verdict: hVerdict('north-hobart'), rentRange: '$3,800–$6,500/mo' },
      { name: 'Sandy Bay', slug: 'sandy-bay', description: "Highest-income residential suburb. Consistent professional repeat trade, university proximity, low seasonality.", score: hScore('sandy-bay'), verdict: hVerdict('sandy-bay'), rentRange: '$3,500–$5,500/mo' },
      { name: 'West Hobart', slug: 'west-hobart', description: "Sandy Bay demographics at lower competition and lower rent. An underrated inner-west entry with strong café culture demand.", score: hScore('west-hobart'), verdict: hVerdict('west-hobart'), rentRange: '$2,500–$4,200/mo' },
      { name: 'New Town', slug: 'new-town', description: "Underrated suburban village strip. Early-stage gentrification with low competition and accessible entry rents.", score: hScore('new-town'), verdict: hVerdict('new-town'), rentRange: '$2,500–$4,500/mo' },
    ],
  },
  {
    title: 'Emerging — Early-Mover Opportunity',
    description: "Suburbs where residential growth is outpacing hospitality supply. First-mover operators can establish strong local loyalty before rents reprice.",
    suburbs: [
      { name: 'Rosny Park', slug: 'rosny-park', description: "East shore retail hub. Eastlands foot traffic plus Kangaroo Bay urban renewal delivering new density.", score: hScore('rosny-park'), verdict: hVerdict('rosny-park'), rentRange: '$2,800–$4,500/mo' },
      { name: 'Kingston', slug: 'kingston', description: "Southern growth corridor. Professional demographic arriving ahead of quality hospitality supply.", score: hScore('kingston'), verdict: hVerdict('kingston'), rentRange: '$2,200–$3,800/mo' },
      { name: 'Moonah', slug: 'moonah', description: "Multicultural inner suburb. Emerging creative precinct, lowest inner-ring rents, culturally diverse demand.", score: hScore('moonah'), verdict: hVerdict('moonah'), rentRange: '$1,800–$3,200/mo' },
    ],
  },
  {
    title: 'Outer Suburban — Value Entry, Limited Ceiling',
    description: "Lower rents, lower competition, but smaller catchments. Viable for owner-operators calibrated to the local spending capacity.",
    suburbs: [
      { name: 'Glenorchy', slug: 'glenorchy', description: "Northern commercial hub. Large residential catchment, very low rents, council revitalisation underway.", score: hScore('glenorchy'), verdict: hVerdict('glenorchy'), rentRange: '$1,800–$3,000/mo' },
      { name: 'Howrah', slug: 'howrah', description: "Outer east shore. Minimal competition, captive local catchment, low entry cost.", score: hScore('howrah'), verdict: hVerdict('howrah'), rentRange: '$1,800–$3,000/mo' },
      { name: 'Bridgewater', slug: 'bridgewater', description: "Outer northern gateway. Lowest rents in the dataset. Value-oriented formats only.", score: hScore('bridgewater'), verdict: hVerdict('bridgewater'), rentRange: '$1,200–$2,200/mo' },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a café in Hobart?',
    answer: "North Hobart's Elizabeth Street is the strongest café market in Tasmania — a culturally engaged professional demographic with genuine independent café culture, strong repeat trade, and rents ($3,800–$6,500/month) that are 40–50% below Melbourne or Sydney equivalents. The honest trade-off is competition at 7/10, meaning differentiated concepts thrive while generic formats are outcompeted. Sandy Bay is the premium residential play — highest income demographic, lower competition, and consistent year-round trade without tourism dependence.",
  },
  {
    question: 'How does MONA affect Hobart commercial real estate?',
    answer: "MONA's $230M+ annual visitor economy has concentrated primarily in the waterfront, Salamanca, and North Hobart corridors. The museum's 450,000+ annual visitors create significant weekend and summer spending that benefits operators near the ferry terminal and Salamanca Place. Critically, the effect is not evenly distributed — suburbs more than 3km from the waterfront corridor see very limited MONA flow. Operators should assess whether their specific location captures MONA foot traffic before pricing it into a revenue model.",
  },
  {
    question: 'Is Salamanca Place worth the higher rent?',
    answer: "Salamanca Place works for operators who correctly model the seasonality and enter with sufficient capital to survive winter softness. Summer revenue (November–April) can be 50–70% above the winter baseline, and the Saturday market consistently delivers 20,000+ visitors. The failure mode is operators who open in November based on peak-season projections and discover in July that 45% of expected revenue has evaporated. The location requires a strong local customer base to sustain winter trade — tourist revenue alone does not produce viable year-round economics.",
  },
  {
    question: "What makes Hobart's east shore different from the west side?",
    answer: "The east shore (Bellerive, Rosny Park, Lindisfarne, Howrah) has a distinct character from inner Hobart — more residential, lower tourist dependency, and a catchment anchored by Clarence City's professional and family demographic. East shore rents are 15–25% below equivalent west-side positions. The trade-off is lower peak-season uplift and less destination dining traffic. For operators who want consistent local repeat trade without the summer/winter volatility of Salamanca or North Hobart, the east shore offers attractive risk-adjusted economics.",
  },
  {
    question: 'How does Hobart seasonality compare to mainland capitals?',
    answer: "Hobart's seasonality is more pronounced than Sydney, Melbourne, or Brisbane but less extreme than a pure tourist destination like Cairns. Food and hospitality operators in tourist-facing suburbs like Salamanca and Battery Point typically see 40–60% higher revenue in summer (November–March) versus winter (June–August). Suburbs with a strong residential base — North Hobart, Sandy Bay, West Hobart — show much more moderate seasonal variation of 15–25%. Any financial model for a Hobart business should explicitly account for this variation rather than using annual averages.",
  },
  {
    question: 'Are heritage constraints a significant issue for Hobart operators?',
    answer: "Yes — more so than in any other Australian capital city outside parts of Sydney. Salamanca Place and Battery Point have strict heritage overlay controls that limit fitout flexibility, restrict signage, and can require expensive heritage-compliant works before a tenancy can open. Operators should budget an additional AUD 15,000–35,000 above standard fitout costs and allow 4–8 weeks for heritage approval processes. North Hobart and the east shore suburbs have more permissive planning controls and are easier to fit out efficiently.",
  },
  {
    question: 'Which Hobart suburbs are emerging for business in 2026?',
    answer: "Three markets are at different stages of the same growth trajectory. Moonah is in the earliest stage — very low rents, a multicultural creative demographic arriving, and almost no quality independent hospitality. New Town is one step further along — early gentrification, accessible rents, but demand clearly outpacing supply. West Hobart has reached the point where the demographic quality is clearly established but competition has not caught up — the best current risk/return entry for operators who want a strong catchment without fighting North Hobart's established operators.",
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

function HobartFactorDirectory() {
  const suburbs = getHobartSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/hobart/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function HobartPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Hobart"
        citySlug="hobart"
        tagline="Australia's most underestimated hospitality city. MONA tourism, a loyal independent café culture, and constrained supply from heritage listings create real opportunity — for operators who understand the seasonality."
        statChips={[
          { text: '14 suburbs scored — waterfront to east shore to outer growth' },
          { text: "Salamanca: Tasmania's benchmark tourism precinct" },
          { text: 'MONA effect — $230M visitor economy' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, REIT Tasmania Q1 2026, JLL Hobart, and Locatalyze proprietary foot traffic analysis.
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
              { value: '$230M+', label: "MONA annual visitor economy — Tasmania's cultural tourism anchor", source: 'Tourism Tasmania 2025' },
              { value: '450K+', label: 'Annual MONA visitors — concentrated into Salamanca and waterfront corridors', source: 'MONA visitor data 2024' },
              { value: '$87K', label: "Sandy Bay median household income — Hobart's highest-income residential suburb", source: 'ABS Census 2024' },
              { value: '35%', label: 'Hobart commercial rents below Melbourne inner-ring equivalents', source: 'JLL Hobart Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Hobart Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Hobart has undergone a remarkable transformation over the past decade. MONA's opening in 2011 repositioned Tasmania from a quiet domestic tourism destination to an internationally recognised cultural hub — and that repositioning has compounded year after year. The museum draws 450,000+ visitors annually, sustains a $230M visitor economy, and has catalysed a hospitality scene that now produces nationally recognised operators from a metropolitan population of just 250,000.",
              "The constraint on Hobart's commercial market is supply, not demand. Heritage listings across Salamanca Place, Battery Point, and much of the inner city limit the stock of commercial premises available for hospitality and retail. This means quality locations trade at a premium and tenancies rarely turn over — operators who secure a strong position in these precincts tend to hold it. For new entrants, the better opportunities are often in the growth suburbs: North Hobart, West Hobart, and the east shore precincts where supply constraints are less severe.",
              "The seasonality dynamic is Hobart's defining commercial variable. Tourist-facing suburbs like Salamanca and the waterfront experience revenue swings of 40–70% between summer and winter — an operating environment that rewards operators with dual income streams (tourist peak plus local loyalty) and punishes those who rely on summer trade to fund year-round costs. Residential suburbs — Sandy Bay, West Hobart, North Hobart — show much more moderate seasonal patterns and suit operators who want consistent rather than variable revenue.",
              "Dark Mofo in June and Taste of Tasmania in December-January create the two most significant festival revenue events in the Hobart calendar. These events are genuine revenue drivers for well-positioned operators, but they should be modelled as annual bonuses rather than monthly run-rates. The operators who build sustainable Hobart businesses are those who treat festival revenue as a supplement to a viable year-round model.",
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
              { type: "Cafés & Specialty Coffee", insight: "North Hobart is the benchmark — Elizabeth Street has the deepest independent café culture in Tasmania and a customer base that supports premium pricing. Sandy Bay and West Hobart are the two best residential plays: high-income demographics at lower competition than North Hobart.", best: ['North Hobart', 'Sandy Bay', 'West Hobart'] },
              { type: 'Full-Service Restaurants', insight: "North Hobart and Salamanca Place are the two primary restaurant markets. North Hobart offers better year-round consistency; Salamanca rewards operators with a strong concept who can model the winter softness. Battery Point suits premium small-format concepts.", best: ['North Hobart', 'Salamanca Place', 'Battery Point'] },
              { type: 'Retail (Independent)', insight: "Salamanca Place is the strongest independent retail precinct by visitor volume — artisan, food, and lifestyle retail performs well in the tourist-facing format. Sandy Bay suits premium gift and lifestyle retail targeting the local affluent demographic.", best: ['Salamanca Place', 'Sandy Bay', 'Rosny Park'] },
              { type: 'Fitness & Wellness', insight: "Allied health and boutique fitness follows high-income residential. Sandy Bay, West Hobart, and Battery Point have the income demographics that sustain premium wellness spend. Bellerive is the east shore equivalent — professional residential with limited quality wellness supply.", best: ['Sandy Bay', 'West Hobart', 'Bellerive'] },
              { type: 'Professional Services', insight: "Professional services concentrate in the CBD and Sandy Bay professional firm corridors. North Hobart has a growing professional services cluster. Bellerive and Rosny Park serve the east shore professional catchment.", best: ['Sandy Bay', 'North Hobart', 'Bellerive'] },
              { type: 'Tourism & Experience Concepts', insight: "Salamanca Place and Battery Point capture the highest-intent tourist traffic in Tasmania. Festival-period operators and experience concepts (tours, tastings, workshops) perform best here during peak season.", best: ['Salamanca Place', 'Battery Point', 'Bellerive'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Hobart Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Salamanca Place', slug: 'salamanca-place', verdict: hVerdict('salamanca-place'), score: hScore('salamanca-place'), rentFrom: '$5,500/mo', body: "Tasmania's most famous commercial precinct. The Saturday market draws 20,000+ visitors, MONA ferry traffic lands 400m away, and summer revenue is exceptional. The honest calculus: winter softness is real, competition is 7/10, and rents reflect tourist demand rather than resident trade. Operators with a differentiated concept and sufficient capital to model the seasonality correctly can build a genuinely premium business here." },
              { rank: 2, name: 'North Hobart', slug: 'north-hobart', verdict: hVerdict('north-hobart'), score: hScore('north-hobart'), rentFrom: '$3,800/mo', body: "Elizabeth Street is Tasmania's best independent strip — 80+ operators, a culturally engaged demographic with genuine café loyalty, and rents that are 40% below mainland equivalents for comparable foot traffic. The strip has produced nationally recognised operators and remains the strongest year-round market in Hobart. Competition is elevated but the strip is long enough that differentiated concepts find unclaimed positions." },
              { rank: 3, name: 'Sandy Bay', slug: 'sandy-bay', verdict: hVerdict('sandy-bay'), score: hScore('sandy-bay'), rentFrom: '$3,500/mo', body: "Hobart's highest-income residential suburb. A University of Tasmania campus proximity adds academic and postgraduate demand to an established professional catchment. Low seasonality and consistent repeat trade make Sandy Bay the most reliable year-round market in greater Hobart — suited to operators who want sustainable economics without tourist-trade dependency." },
              { rank: 4, name: 'Battery Point', slug: 'battery-point', verdict: hVerdict('battery-point'), score: hScore('battery-point'), rentFrom: '$3,500/mo', body: "Historic inner-south Hobart's most affluent neighbourhood. Heritage constraints keep operator density low and protect established tenants — spaces rarely become available. Operators who secure a Battery Point position benefit from a loyal, high-income residential base supplemented by strong tourism from adjacent Salamanca." },
              { rank: 5, name: 'West Hobart', slug: 'west-hobart', verdict: hVerdict('west-hobart'), score: hScore('west-hobart'), rentFrom: '$2,500/mo', body: "Sandy Bay demographics at 35–40% lower rent and notably lower competition. Cascade Road and Hill Street commercial nodes serve a professional demographic that has the spending behaviour of Sandy Bay without the Sandy Bay price premium. Competition is 3/10 — the lowest of any quality Hobart inner suburb — creating genuine supply gaps for well-positioned independents." },
              { rank: 6, name: 'Bellerive', slug: 'bellerive', verdict: hVerdict('bellerive'), score: hScore('bellerive'), rentFrom: '$3,000/mo', body: "The east shore's commercial hub, anchored by Blundstone Arena event days. Professional residential catchment across Clarence City, Bellerive Oval event uplifts, and rents 15–20% below North Hobart for comparable professional demographics. The best east shore entry point for operators who want a balanced market." },
              { rank: 7, name: 'New Town', slug: 'new-town', verdict: hVerdict('new-town'), score: hScore('new-town'), rentFrom: '$2,500/mo', body: "Hobart's most underrated suburban strip. A gentrifying professional demographic, low competition at 4/10, and rents ($2,500–$4,500/month) that represent genuine value for an inner Hobart location. New Town is on the early part of the same demographic trajectory North Hobart completed — operators who enter now build brands ahead of the rent repricing." },
              { rank: 8, name: 'Rosny Park', slug: 'rosny-park', verdict: hVerdict('rosny-park'), score: hScore('rosny-park'), rentFrom: '$2,800/mo', body: "East shore retail hub with Eastlands foot traffic and the Kangaroo Bay urban renewal delivering new residential density. Operators outside the shopping centre find limited direct competition despite a large Clarence City catchment — quality independent positioning is underserved relative to the demographic quality." },
              { rank: 9, name: 'Kingston', slug: 'kingston', verdict: hVerdict('kingston'), score: hScore('kingston'), rentFrom: '$2,200/mo', body: "Southern Hobart's growth corridor. Professional residential demographic arriving ahead of quality hospitality supply, rents at $2,200–$3,800/month, and a hinterland catchment extending into the Huon Valley that supplements the immediate residential base. The best southern entry point for 2026." },
              { rank: 10, name: 'Lindisfarne', slug: 'lindisfarne', verdict: hVerdict('lindisfarne'), score: hScore('lindisfarne'), rentFrom: '$2,800/mo', body: "East shore village strip with above-average demographic quality and notably low competition. Derwent foreshore character attracts a professional residential demographic and weekend visitors from across the east shore. Rents at $2,800–$4,500/month are well below equivalent North Hobart positions." },
              { rank: 11, name: 'Moonah', slug: 'moonah', verdict: hVerdict('moonah'), score: hScore('moonah'), rentFrom: '$1,800/mo', body: "Hobart's emerging multicultural creative precinct. Very low rents, a growing creative worker demographic, and limited quality independent competition. The early-mover window for quality independent hospitality in Moonah is open — operators who build community loyalty now will lock in leases that look underpriced in 3–5 years." },
              { rank: 12, name: 'Glenorchy', slug: 'glenorchy', verdict: hVerdict('glenorchy'), score: hScore('glenorchy'), rentFrom: '$1,800/mo', body: "Northern commercial hub with the lowest rents of any Hobart inner corridor. A large working-class residential catchment and council revitalisation strategy create an improving backdrop. Value-positioned operators who correctly calibrate to the catchment can achieve strong break-even economics." },
            ].map((suburb) => (
              <Link key={suburb.slug} href={`/analyse/hobart/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #172554 0%, #1E40AF 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Hobart address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Hobart address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#DBEAFE', color: '#1E3A5F', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Hobart address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Hobart Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>14 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="hobart" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Hobart Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Salamanca Place vs North Hobart', body: "Salamanca offers higher peak revenue but a steeper winter cliff — the right market for operators with a tourist-facing concept, strong capital reserves, and a plan for June–August. North Hobart offers more consistent year-round trade, a loyal local customer base, and lower competition. For operators entering in 2026 without guaranteed tourist revenue, North Hobart is the lower-risk choice with comparable demographic quality." },
              { title: 'Sandy Bay vs West Hobart', body: "Sandy Bay is the established premium residential market — higher rents, higher competition, but a deeper and more established customer base. West Hobart is the same demographic at 35–40% lower rent and notably lower competition. For operators with a quality concept who do not need Sandy Bay's existing foot traffic to survive the build period, West Hobart offers better long-term unit economics." },
              { title: 'East Shore vs West Shore', body: "The east shore (Bellerive, Rosny Park, Lindisfarne) is a distinct market from inner Hobart — more residential, lower tourist dependency, 15–25% lower rents. Operators who want consistent local repeat trade without tourism seasonality find the east shore more predictable. The trade-off is lower peak-season revenue and less destination traffic. West shore inner suburbs trade at a premium for their food culture reputation and tourist adjacency." },
              { title: 'New Town vs Moonah vs Glenorchy', body: "All three are suburban growth-stage markets at different points in the same trajectory. New Town is furthest along — early gentrification, a clear demographic upgrade in progress, accessible rents. Moonah is the earliest stage — multicultural creative emerging, very low rents, almost no quality independent competition. Glenorchy is the most established of the three but with the most value-oriented demographic — operators need to calibrate pricing carefully." },
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
              { name: 'Salamanca Place (without winter strategy)', why: "Salamanca is not a high-risk location for operators who correctly model the seasonality — it is very high-risk for those who open in November based on summer projections and find in July that 45–60% of expected trade disappears. The location works for operators with a local customer base strategy that sustains winter months. Tourist-only positioning is structurally unviable year-round." },
              { name: 'Hobart Waterfront (Brooke Street Pier)', why: "The waterfront strip attracts exceptional tourist volumes but the operating costs reflect that premium. Rents at $95–$120/m² require high volume or premium pricing that most independent operators cannot sustain outside summer. The structural mismatch between winter trading reality and lease obligations has driven multiple closures in this corridor." },
              { name: 'Elizabeth Street Mall (CBD)', why: "The Hobart CBD mall carries the structural disadvantages of retail malls in a city of Hobart's scale — rents that reflect national tenants, foot traffic concentrated in a few hours per day, and a competitive environment that disadvantages independents. In a city of 250,000, the mall's apparent foot traffic numbers are not translating to sustainable independent operator economics." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Hobart Suburb Factor Breakdown — All 14 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <HobartFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Hobart Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Hobart location?"
        subtitle="Run a free analysis on any Hobart address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/hobart/north-hobart" style={{ color: C.brand, textDecoration: 'none' }}>North Hobart Analysis →</Link>
          <Link href="/analyse/hobart/salamanca-place" style={{ color: C.brand, textDecoration: 'none' }}>Salamanca Place Analysis →</Link>
          <Link href="/analyse/hobart/sandy-bay" style={{ color: C.brand, textDecoration: 'none' }}>Sandy Bay Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
