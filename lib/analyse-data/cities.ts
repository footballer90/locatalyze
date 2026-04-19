// lib/analyse-data/cities.ts
// Canonical city data for /analyse/[city] pages
// Each city has full SEO content: overview, suburb categories, comparisons, FAQs
//
// MIGRATION NOTE: score and verdict fields are optional.
// Legacy city data still provides them manually (see .check-scores-ignore).
// As each city is migrated to a proper engine data layer (lib/analyse-data/[city].ts),
// remove score/verdict from the SuburbRef entries and compute them via the engine.
// See docs/engine-migration.md for the full migration plan.

import {
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from './scoring-engine'

export type Verdict = 'GO' | 'CAUTION' | 'NO'

export interface SuburbRef {
  name: string
  slug: string
  description: string
  /** Legacy field — will be removed as cities migrate to engine scoring. */
  score?: number
  /** Legacy field — will be removed as cities migrate to engine scoring. */
  verdict?: Verdict
  rentRange: string
  /**
   * Engine factors for computing score/verdict without manual values.
   * When provided, consumers should call deriveSuburbRef() to get the computed score.
   * See docs/engine-migration.md.
   */
  factors?: LocationFactors
}

/**
 * Given a SuburbRef seed with `factors`, compute score and verdict from the engine.
 * Use this in migrated city hub pages instead of hardcoding score/verdict.
 *
 * @example
 * const ref = deriveSuburbRef({
 *   name: 'Fortitude Valley',
 *   slug: 'fortitude-valley',
 *   description: '...',
 *   rentRange: '$4,000–$7,000/mo',
 *   factors: { demandStrength: 8, rentPressure: 7, competitionDensity: 7, seasonalityRisk: 4, tourismDependency: 6 },
 * })
 * // ref.score → computed composite, ref.verdict → 'GO' | 'CAUTION' | 'RISKY'
 */
export function deriveSuburbRef(seed: Omit<SuburbRef, 'score' | 'verdict'> & { factors: LocationFactors }): SuburbRef & { score: number; verdict: Verdict } {
  const model = computeLocationModel(seed.factors)
  // Map engine 'RISKY' to legacy 'NO' so the returned type satisfies SuburbRef.verdict (Verdict)
  const verdict: Verdict = model.verdict === 'RISKY' ? 'NO' : model.verdict
  return {
    ...seed,
    score: model.compositeScore,
    verdict,
  }
}

export interface SuburbCategoryData {
  title: string
  description: string
  suburbs: SuburbRef[]
}

export interface BusinessTypeInsight {
  type: string
  insight: string
  bestSuburbs: string[]
}

export interface SuburbComparison {
  title: string
  body: string
}

export interface SuburbHighlight {
  name: string
  slug: string
  why: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface StatData {
  value: string
  label: string
  source: string
}

export interface CityPageData {
  slug: string
  name: string
  state: string
  population: string
  tagline: string
  metaTitle: string
  metaDescription: string
  overviewParagraphs: string[]
  stats: StatData[]
  suburbCategories: SuburbCategoryData[]
  businessTypes: BusinessTypeInsight[]
  comparisons: SuburbComparison[]
  hiddenGems: SuburbHighlight[]
  highRiskZones: SuburbHighlight[]
  faqs: FAQ[]
}

export const CITY_PAGE_DATA: Record<string, CityPageData> = {
  sydney: {
    slug: 'sydney',
    name: 'Sydney',
    state: 'NSW',
    population: '5.3M',
    tagline: "Australia's Most Expensive — And Most Rewarding — Business Market",
    metaTitle: 'Best Suburbs to Start a Business in Sydney (2026 Analysis)',
    metaDescription:
      'Honest suburb-by-suburb breakdown of Sydney business locations. Foot traffic data, rent benchmarks, and 17 suburbs scored. Find where the numbers actually work.',
    overviewParagraphs: [
      "Sydney is simultaneously the best and worst place to start a business in Australia. Worst because commercial rents in the CBD and inner ring suburbs are among the highest globally — a 50sqm retail space in Surry Hills costs $9,000–$12,000 monthly. Best because the metropolitan population of 5.3 million, combined with some of the highest discretionary incomes on the continent, creates massive addressable markets. Understanding this tension separates thriving businesses from failed ones.",
      "The inner ring versus outer west divide is the single most important economic variable in Sydney location strategy. A 185sqm restaurant in Surry Hills costs $120,000–$144,000 per year in rent. The same footprint in Parramatta costs $54,000–$72,000. That $50,000+ difference is often the margin between profitable and insolvent for independent operators. Parramatta captures 70% of Surry Hills foot traffic at 45% of the rent — which is why it scores highest on our model.",
      "Western Sydney's trajectory has been reshaped permanently by infrastructure investment. Parramatta Square brought 20,000+ public servants to a previously office-light precinct. The M12 motorway and Western Sydney Airport at Badgerys Creek are transforming fringe suburbs that were unviable five years ago. Operators who position now — before rents normalize — capture the asymmetric upside.",
      "Post-COVID hybrid work has produced a counterintuitive demographic shift. CBD lunch trade never fully recovered; office density sits at 65–70% of pre-2020 levels on peak days. But hybrid workers migrating from inner to middle suburbs have elevated spending density in the 12–18km band. Suburbs like Ryde, Burwood, and Merrylands saw 15–20% increases in daytime foot traffic from 2022 to 2025 as this cohort reshaped neighbourhood commerce.",
      "The inner west café saturation problem is real and underreported. Newtown, Surry Hills, and Glebe have 4–6x the café density of comparable-income suburbs globally. Break-even in these areas requires 300+ covers per day. Many operators do not hit this threshold outside of Saturday morning. The more interesting café markets are now in second-tier suburbs with growing professional populations — Ryde, Hornsby, and parts of Western Sydney — where customer-to-café ratios remain favourable.",
    ],
    stats: [
      { value: '$2.1T', label: 'Sydney metro GDP — largest urban economy in the Southern Hemisphere', source: 'Oxford Economics 2025' },
      { value: '31%', label: 'Hospitality businesses fail in year 1 in inner Sydney', source: 'IBISWorld 2025' },
      { value: '40%', label: 'Lower commercial rents in Western Sydney vs inner ring', source: 'CBRE Q1 2026' },
      { value: '$92K', label: 'Average household income in Parramatta corridor — viable for most business types', source: 'ABS 2024' },
    ],
    suburbCategories: [
      {
        title: 'Premium — High Risk, High Reward',
        description: 'Inner ring suburbs with exceptional foot traffic but punishing rents. Only established concepts with strong capital and proven unit economics belong here.',
        suburbs: [
          { name: 'Surry Hills', slug: 'surry-hills', description: "Sydney's premier café and hospitality district. 400+ food/drink venues, 87 overall score.", score: 87, verdict: 'GO', rentRange: '$8,000–$14,000/mo' },
          { name: 'Sydney CBD', slug: 'sydney-cbd', description: 'Maximum foot traffic, maximum rent. Works for volume plays only.', score: 78, verdict: 'CAUTION', rentRange: '$15,000–$38,000/mo' },
          { name: 'Bondi', slug: 'bondi', description: 'Beach lifestyle premium. Dual-season economics require solid off-peak strategy.', score: 74, verdict: 'GO', rentRange: '$7,000–$12,000/mo' },
        ],
      },
      {
        title: 'Growth — Balanced Risk/Return',
        description: 'Professional suburbs with strong demographics and rent levels that allow sustainable unit economics. Best bet for most independent operators.',
        suburbs: [
          { name: 'Parramatta', slug: 'parramatta', description: 'Western Sydney second CBD. Best rent-to-foot-traffic ratio in Greater Sydney.', score: 84, verdict: 'GO', rentRange: '$3,500–$6,500/mo' },
          { name: 'Chatswood', slug: 'chatswood', description: 'North Shore professional epicentre. Asian market strength is unique.', score: 82, verdict: 'GO', rentRange: '$6,000–$10,000/mo' },
          { name: 'North Sydney', slug: 'north-sydney', description: 'Corporate concentration with under-served hospitality market.', score: 76, verdict: 'GO', rentRange: '$5,500–$9,000/mo' },
          { name: 'Ryde', slug: 'ryde', description: 'North Shore suburban stability. Growing middle-class demographic.', score: 77, verdict: 'GO', rentRange: '$3,000–$5,500/mo' },
          { name: 'Burwood', slug: 'burwood', description: 'Inner west accessibility. Korean and Asian market well-established.', score: 75, verdict: 'GO', rentRange: '$3,500–$6,000/mo' },
          { name: 'Hornsby', slug: 'hornsby', description: 'Northern corridor anchor. Underpriced relative to catchment.', score: 72, verdict: 'GO', rentRange: '$2,800–$5,000/mo' },
        ],
      },
      {
        title: 'Outer Growth — Value Plays',
        description: 'Western and outer ring suburbs with lower rents and improving demographics. Patience required, but asymmetric upside for early movers.',
        suburbs: [
          { name: 'Penrith', slug: 'penrith', description: 'Regional economy anchor. Olympics infrastructure transforming Western Sydney.', score: 76, verdict: 'GO', rentRange: '$2,200–$4,000/mo' },
          { name: 'Merrylands', slug: 'merrylands', description: 'Multicultural hub, strong community cohesion, low rent.', score: 74, verdict: 'GO', rentRange: '$2,000–$3,800/mo' },
          { name: 'Bankstown', slug: 'bankstown', description: 'Demographic diversity drives specialty food and services demand.', score: 70, verdict: 'GO', rentRange: '$2,000–$3,500/mo' },
          { name: 'Blacktown', slug: 'blacktown', description: 'Large catchment, strong value positioning. Works for non-premium concepts.', score: 71, verdict: 'GO', rentRange: '$1,800–$3,200/mo' },
          { name: 'Liverpool', slug: 'liverpool', description: 'Southwest anchor with growing professional population.', score: 73, verdict: 'GO', rentRange: '$2,000–$3,800/mo' },
          { name: 'Campbelltown', slug: 'campbelltown', description: 'South west growth corridor. Healthcare and education anchor employment.', score: 73, verdict: 'GO', rentRange: '$1,800–$3,200/mo' },
          { name: 'Auburn', slug: 'auburn', description: 'Inner west value alternative. Strong multicultural food market.', score: 71, verdict: 'GO', rentRange: '$2,200–$4,000/mo' },
        ],
      },
      {
        title: 'Speculative — Proceed with Research',
        description: 'Developing or underperforming suburbs where specific niches work but general retail is challenging. Deep local knowledge required.',
        suburbs: [
          { name: 'Ultimo', slug: 'ultimo', description: 'Student corridor near UTS. Works for budget-focused daily-use concepts.', score: 68, verdict: 'CAUTION', rentRange: '$3,500–$6,000/mo' },
          { name: 'Granville', slug: 'granville', description: 'Inner west affordability play. Specific demographics reward targeted concepts.', score: 69, verdict: 'CAUTION', rentRange: '$1,800–$3,200/mo' },
          { name: 'Fairfield', slug: 'fairfield', description: 'Multicultural strength; lower average incomes limit some categories.', score: 67, verdict: 'CAUTION', rentRange: '$1,600–$3,000/mo' },
          { name: 'Mount Druitt', slug: 'mount-druitt', description: 'Far west value position. Infrastructure lags demographic growth.', score: 68, verdict: 'CAUTION', rentRange: '$1,400–$2,600/mo' },
        ],
      },
    ],
    businessTypes: [
      {
        type: 'Cafés & Specialty Coffee',
        insight: "Inner west (Surry Hills, Newtown) is saturated — break-even requires 300+ daily covers. The better café opportunity is now in second-tier suburbs: Ryde, Hornsby, and Parramatta, where customer-to-café ratios are 3–4x more favourable. Avoid the Glebe/Newtown corridor unless you have a genuinely differentiated concept and $150K in runway.",
        bestSuburbs: ['Parramatta', 'Ryde', 'Hornsby', 'Surry Hills (if differentiated)'],
      },
      {
        type: 'Restaurants',
        insight: 'Full-service dining requires $90K+ median household income to sustain $60–$80 average covers. This threshold is met reliably in Surry Hills, Chatswood, North Sydney, and parts of Parramatta. CBD restaurants face structural headwinds from hybrid work reducing weekday covers to 3–4 services per week instead of 5.',
        bestSuburbs: ['Surry Hills', 'Chatswood', 'North Sydney', 'Parramatta (value positioning)'],
      },
      {
        type: 'Retail (General)',
        insight: "Premium positioning works in CBD and Chatswood only. Value retail dominates Parramatta and outer west. The squeezed middle (mid-market retail) is struggling across Sydney — Westfield dominance has consolidated mid-tier spend. Independent retailers need either a premium differentiation story (CBD/Chatswood) or a community/daily-needs positioning (outer suburbs).",
        bestSuburbs: ['Chatswood', 'Parramatta', 'Bankstown', 'Blacktown'],
      },
      {
        type: 'Fitness & Wellness',
        insight: 'Boutique fitness (pilates, yoga, HIIT) clusters in Eastern Suburbs and Inner West where discretionary income is highest. Scale gym concepts (24-hour, budget) work in Parramatta and outer west. Allied health (physio, chiro, psych) grows linearly with income and works across most growth suburbs — especially Ryde, Chatswood, and Parramatta.',
        bestSuburbs: ['Surry Hills', 'Bondi', 'Chatswood', 'Parramatta'],
      },
      {
        type: 'Professional Services',
        insight: 'Legal, accounting, financial advisory follows corporate concentration. North Sydney, CBD fringe, and Parramatta are the anchor markets. Co-working and flexible office demand has grown 40% since 2022 as hybrid work normalized — Ultimo and Pyrmont absorb the tech sector.',
        bestSuburbs: ['North Sydney', 'Parramatta', 'CBD fringe', 'Ultimo (tech services)'],
      },
    ],
    comparisons: [
      {
        title: 'Parramatta vs Sydney CBD',
        body: "Parramatta captures 70% of CBD foot traffic at 40% of the rent. For most independent operators — cafés, restaurants, retail — the economics simply work better in Parramatta. The exception is luxury or premium positioning: CBD still commands aspirational demographics that justify $25,000+/month rents for high-ticket concepts. But for operators targeting the $30–$80 transaction range, Parramatta's Church Street delivers superior unit economics.",
      },
      {
        title: 'Surry Hills vs Parramatta',
        body: "Surry Hills is Sydney's premium hospitality address with proven market demand and wealthy demographics. But the bar to entry is steep: rents of $10,000–$14,000/month require daily foot traffic that only established, highly differentiated concepts reliably achieve. Parramatta is the operator's choice if you're building a sustainable business — lower risk, acceptable growth ceiling, and the infrastructure tailwind from the Olympic corridor. Choose Surry Hills if your concept specifically requires Eastern Suburbs demographics.",
      },
      {
        title: 'Chatswood vs North Sydney',
        body: "Chatswood has a unique advantage: the highest density of East and Southeast Asian residents in Sydney creates a specialised market that rewards culturally-specific concepts (bubble tea, Asian bakeries, Japanese food). North Sydney is a pure corporate market — stronger for lunch-focused operators and professional services. North Sydney suffers post-pandemic from reduced office occupancy; Chatswood is more residential and thus more resilient to hybrid work trends.",
      },
      {
        title: 'Blacktown vs Penrith',
        body: "Both serve Western Sydney's outer ring but with different profiles. Blacktown has larger population density and more established retail infrastructure (Westpoint). Penrith is undergoing structural transformation via Western Sydney Airport investment and Olympic Games infrastructure — the 5-year growth curve looks steeper. For a business launching now, Blacktown is lower risk; Penrith is a growth bet.",
      },
    ],
    hiddenGems: [
      {
        name: 'Merrylands',
        slug: 'merrylands',
        why: "Consistently underestimated. Merrylands has multicultural community cohesion that drives higher revisit rates than comparable Western Sydney suburbs. Rents are 50% below Surry Hills with solid accessibility via Merrylands station. Food businesses targeting the Lebanese, Pacific Islander, and South Asian communities here see loyal, repeat customer bases.",
      },
      {
        name: 'Auburn',
        slug: 'auburn',
        why: "Auburn's inner west location (10km from CBD) means it catches the professional spillover from Burwood and Strathfield at half the rent. The Turkish and Middle Eastern community creates a specialty food market with genuine repeat demand. Rent on Auburn Road sits at $2,500–$4,500/month — remarkable for this proximity to the CBD.",
      },
      {
        name: 'Ryde',
        slug: 'ryde',
        why: "Ryde is the quiet achiever of Sydney's north. It scores 77 without the headline recognition of Chatswood. Growing professional population post-COVID, strong income demographics, and a café market that is not oversaturated. The Shepherd's Bay precinct development is adding commercial density without proportional supply increase.",
      },
    ],
    highRiskZones: [
      {
        name: 'Glebe',
        slug: 'glebe',
        why: "Glebe suffers from the worst combination: high rent ($7,000–$11,000/mo), declining foot traffic post-pandemic (university students still hybrid), and severe café oversaturation. Glebe Point Road has more independent cafés per capita than almost anywhere in Australia. Unless you have a deeply differentiated concept and 12+ months of runway, avoid.",
      },
      {
        name: 'Newtown',
        slug: 'newtown',
        why: "Newtown's reputation as a vibrant hospitality strip is real, but the economics are punishing. King Street has 70+ food and drink venues. Average lifespan of independent cafés on this strip is under 3 years. Rent is $7,500–$13,000/month with the expectation of 250+ daily covers. A handful of operators are thriving; the majority are breakeven at best.",
      },
      {
        name: 'Sydney CBD (premium retail)',
        slug: 'sydney-cbd',
        why: "CBD retail rents have declined 8% from 2023 peaks but remain structurally high. Hybrid work has permanently reduced the lunchtime population by 25–30%. Office vacancy sits at 12.5% (JLL Q1 2026). Premium concepts still work; volume-dependent operations with sub-$15,000/day revenue targets face a mathematical problem.",
      },
    ],
    faqs: [
      {
        question: 'What is the best suburb to start a business in Sydney?',
        answer: "Parramatta (score 84) is the all-around strongest performer on our model — it delivers the best combination of foot traffic, demographics, and commercial rent viability. Surry Hills (87) scores higher but demands premium rent and proven unit economics. For hospitality, Surry Hills is the prestige market; for most other business types, Parramatta's economics are materially better.",
      },
      {
        question: 'Is Sydney CBD too expensive for independent businesses?',
        answer: "For most independent operators, yes. CBD retail rents of $15,000–$38,000/month require 300+ daily customers at average $50 spend just to cover rent. Add labour, COGS, and overheads, and break-even typically requires $450K–$600K annual revenue. Only high-volume, premium-priced concepts sustain these economics. Inner-ring alternatives like Surry Hills or North Sydney offer better risk-adjusted positions.",
      },
      {
        question: 'Which Western Sydney suburbs have the best business potential in 2026?',
        answer: "Parramatta (84) is the proven performer — established commercial precinct, strong foot traffic, improving professional demographics via Parramatta Square. Penrith (76) is the growth bet — Western Sydney Airport and Olympic infrastructure are fundamentally reshaping the Western corridor and Penrith rents haven't caught up yet. Merrylands (74) is underrated with multicultural demographic strength and low rent-to-revenue ratios.",
      },
      {
        question: 'What rent should I expect for retail in Sydney suburbs?',
        answer: 'Retail rents vary enormously by location. Inner ring (Surry Hills, Newtown, Bondi): $7,000–$14,000/month. North Shore (Chatswood, North Sydney): $6,000–$10,000/month. Middle ring (Ryde, Burwood, Hornsby): $3,000–$6,000/month. Western Sydney (Parramatta, Blacktown): $2,000–$5,000/month. Outer ring (Penrith, Liverpool, Campbelltown): $1,800–$4,000/month.',
      },
      {
        question: 'Which Sydney suburbs are underrated for cafés in 2026?',
        answer: "Ryde, Hornsby, and Merrylands are the three most underrated café markets in Greater Sydney. All three have professional demographics, growing residential populations, and café customer-to-venue ratios that are 3–4x more favourable than the oversaturated inner west. Rents are 50–60% lower than Surry Hills or Newtown with comparable or higher average household incomes.",
      },
      {
        question: 'How does hybrid work affect Sydney commercial locations?',
        answer: "The main impact is on CBD and inner-city lunch trade, which has not returned to pre-2020 levels. Office occupancy on peak Tuesdays and Wednesdays sits at 70–75%; Mondays and Fridays see 40–50% occupancy. Concepts dependent on the CBD worker lunch trade face structural headwinds. The counter-trend benefits middle-ring suburbs: professionals working from home 2–3 days/week spend more locally in their home suburbs.",
      },
    ],
  },

  melbourne: {
    slug: 'melbourne',
    name: 'Melbourne',
    state: 'VIC',
    population: '5.2M',
    tagline: "Australia's Coffee Capital — Where Culture and Commerce Intersect",
    metaTitle: 'Best Suburbs to Start a Business in Melbourne (2026 Analysis)',
    metaDescription:
      "Melbourne's café culture, laneway dining, and creative economy create unique business opportunities. Suburb scores, rent benchmarks, and honest analysis of where the numbers work.",
    overviewParagraphs: [
      "Melbourne punches above its weight on business formation, hospitality quality, and cultural consumption. The laneway café economy that began in the early 2000s created a permanent premium consumer that other cities have struggled to replicate. This consumer pays $6.50 for a flat white and $28 for a weekend brunch — and does so 3–4 times per week. For hospitality and specialty retail operators, Melbourne's inner suburbs represent some of the most viable small business markets in Australia.",
      "The challenge is increasingly geographic. Fitzroy, Collingwood, and Brunswick — once the affordable fringe — now command rents that rival Sydney's Surry Hills. A retail space on Smith Street costs $7,000–$11,000/month. The demographic that made these suburbs work is migrating outward: Northcote, Preston, and Thornbury now absorb the creative professionals who were priced out of the inner north. These suburbs offer the same demographic at 35–50% lower rent.",
      "The outer north and east — suburbs like Epping, Bundoora, and Dandenong — are structurally different markets. Lower average incomes ($55,000–$68,000 household), lower discretionary spending, and stronger preference for chain retail and value positioning. Independent businesses with premium pricing strategies consistently underperform in these suburbs, while franchise operators and value-focused concepts thrive.",
      "Melbourne's CBD retail market has recovered better than Sydney's post-pandemic — RMIT, Melbourne University, and a higher proportion of international students have maintained weekday foot traffic. However, the homogeneity of CBD retail (dominated by international chains) means independent operators still find the outer lanes and Flinders Lane precincts more viable than the Bourke Street Mall precinct.",
    ],
    stats: [
      { value: '$390B', label: "Melbourne metropolitan GDP — Australia's second largest urban economy", source: 'Deloitte Access Economics 2025' },
      { value: '4.2x', label: 'More hospitality venues per capita than national average', source: 'IBISWorld 2025' },
      { value: '$8,500', label: 'Average café monthly rent in Fitzroy — up 22% since 2022', source: 'CBRE Q1 2026' },
      { value: '78%', label: 'Of Melburnians visit a café at least once per week', source: 'Roy Morgan 2025' },
    ],
    suburbCategories: [
      {
        title: 'Inner North — Premium Market',
        description: 'Fitzroy, Collingwood, and Brunswick are Melbourne\'s hospitality heartland. Exceptional demographics and established consumer culture — at a significant rent premium.',
        suburbs: [
          { name: 'Fitzroy', slug: 'fitzroy', description: "Melbourne's creative hospitality epicentre. Smith Street café density is extraordinary.", score: 88, verdict: 'GO', rentRange: '$7,000–$11,000/mo' },
          { name: 'Collingwood', slug: 'collingwood', description: 'Arts, fashion, food convergence. High creative professional density.', score: 85, verdict: 'GO', rentRange: '$6,500–$10,000/mo' },
          { name: 'Brunswick', slug: 'brunswick', description: 'Sydney Road corridor. Multicultural with strong café and music culture.', score: 83, verdict: 'GO', rentRange: '$5,500–$8,500/mo' },
        ],
      },
      {
        title: 'Inner East & South — Established Premium',
        description: 'South Yarra and Richmond serve the high-income eastern corridor. Strong fashion and hospitality markets but premium rents require premium concepts.',
        suburbs: [
          { name: 'South Yarra', slug: 'south-yarra', description: 'Fashion and dining epicentre. Chapel Street luxury positioning.', score: 84, verdict: 'GO', rentRange: '$8,000–$13,000/mo' },
          { name: 'Richmond', slug: 'richmond', description: 'Swan Street and Bridge Road. Strong hospitality and health retail.', score: 82, verdict: 'GO', rentRange: '$6,000–$9,500/mo' },
          { name: 'St Kilda', slug: 'st-kilda', description: 'Tourism and nightlife economy. Seasonal dynamics require management.', score: 77, verdict: 'GO', rentRange: '$6,500–$10,000/mo' },
        ],
      },
      {
        title: 'Outer Growth — Rising Value',
        description: 'Northcote, Preston, and Thornbury absorb the inner north demographic overflow. Lower rents, growing professional populations.',
        suburbs: [
          { name: 'Northcote', slug: 'northcote', description: 'Inner north overflow market. High Street corridor growing strongly.', score: 79, verdict: 'GO', rentRange: '$4,500–$7,000/mo' },
          { name: 'Footscray', slug: 'footscray', description: "Melbourne's most underrated suburb. Gentrification trajectory clear.", score: 76, verdict: 'GO', rentRange: '$3,500–$5,500/mo' },
          { name: 'Dandenong', slug: 'dandenong', description: 'Southeast multicultural market. Value positioning required.', score: 68, verdict: 'CAUTION', rentRange: '$2,000–$3,500/mo' },
        ],
      },
    ],
    businessTypes: [
      {
        type: 'Specialty Cafés',
        insight: "Melbourne's café market is the most sophisticated in Australia but also the most saturated in the inner north. Third-wave coffee concepts work in Fitzroy, Collingwood, and Northcote; volume café plays work in Dandenong and outer east. The best opportunity gap is in growing middle suburbs like Thornbury and Preston.",
        bestSuburbs: ['Fitzroy', 'Collingwood', 'Northcote', 'Thornbury'],
      },
      {
        type: 'Creative & Design Services',
        insight: "Melbourne's creative economy cluster around Collingwood's manufacturing precincts and Fitzroy's studio network. Co-working and creative office demand is strong; the Brunswick and Fitzroy corridor has among the lowest office vacancy for creative tenants in Australia.",
        bestSuburbs: ['Collingwood', 'Fitzroy', 'Brunswick'],
      },
      {
        type: 'Wellness & Fitness',
        insight: "Premium yoga, pilates, and wellness studio demand is concentrated in South Yarra, Fitzroy, and Richmond. The growing outer suburbs (Northcote, Footscray) are underserved in premium wellness — which creates genuine entry opportunity at 40% lower rent than inner core.",
        bestSuburbs: ['South Yarra', 'Fitzroy', 'Richmond', 'Northcote'],
      },
    ],
    comparisons: [
      {
        title: 'Fitzroy vs Northcote',
        body: "Fitzroy is Melbourne's gold standard hospitality market: exceptional demographics, established consumer culture, and the Smith Street precinct generating 15,000+ daily pedestrians. But rent at $7,000–$11,000/month demands 280+ daily covers to break even. Northcote offers 70% of Fitzroy's demographic quality at 55% of the rent. For operators who can't absorb the Fitzroy rent risk, Northcote's High Street corridor is the smart alternative.",
      },
      {
        title: 'South Yarra vs Richmond',
        body: "South Yarra serves Melbourne's highest-income eastern suburbs demographic — Chapel Street consistently delivers aspirational consumer spending. Richmond's Swan Street is more diverse: sports culture, healthcare, and everyday hospitality coexist. Richmond rents are 20–25% lower than South Yarra, making it the better unit economics play for most independent operators.",
      },
    ],
    hiddenGems: [
      {
        name: 'Footscray',
        slug: 'footscray',
        why: "Footscray's transformation is the clearest gentrification story in Melbourne. Vietnamese food culture, growing arts presence, and proximity to CBD have attracted a creative professional demographic — at rents that are still 60% below Fitzroy. The window of opportunity before rents normalize is approximately 24–36 months.",
      },
      {
        name: 'Thornbury',
        slug: 'thornbury',
        why: "Thornbury is Northcote at 2019 prices. The demographic already lives there — young professionals, families, high cultural consumption — but the commercial strip hasn't yet caught up. High Street Thornbury has excellent independent café operator opportunity with customer-to-café ratios among the best in Melbourne's north.",
      },
    ],
    highRiskZones: [
      {
        name: 'Bourke Street Mall (CBD)',
        slug: 'melbourne-cbd',
        why: "CBD retail rents at premium corridor locations ($20,000–$35,000/month) require extraordinary volume. International chains can absorb this; independent operators cannot. The Bourke Street Mall precinct has seen 15+ independent business failures in the 2024–25 period alone.",
      },
    ],
    faqs: [
      {
        question: 'What is the best suburb to open a café in Melbourne?',
        answer: "Fitzroy (score 88) is the prestige market; Northcote (79) is the smart operator choice. Fitzroy has Melbourne's highest café foot traffic and a proven consumer base, but rent at $7,000–$11,000/month demands exceptional execution. Northcote delivers comparable demographics at significantly lower rent — and the consumer migration from Fitzroy is actively boosting Northcote trade.",
      },
      {
        question: 'Is Fitzroy too saturated for new cafés?',
        answer: "Smith Street has 40+ food and drink venues in a 600m strip. Oversupply is real. That said, Melbourne's inner north consumer is habitual — they return to favorites, but regularly trial new concepts. A highly differentiated concept (unique format, specific dietary niche, cultural specialisation) can still find market share. Generic café concepts will struggle. The better answer for most operators is Northcote or Collingwood.",
      },
      {
        question: 'Which Melbourne suburbs are underrated for small businesses?',
        answer: "Footscray is Melbourne's best underrated market — Vietnamese food culture, growing arts precinct, and proximity to CBD create a unique consumer profile at rents that are still 60% below Fitzroy. Thornbury and Preston are both ahead of their rent curve — income demographics have improved faster than commercial rents.",
      },
    ],
  },

  brisbane: {
    slug: 'brisbane',
    name: 'Brisbane',
    state: 'QLD',
    population: '2.5M',
    tagline: 'The 2032 Olympics Effect — Australia\'s Fastest-Moving Commercial Market',
    metaTitle: 'Best Suburbs to Start a Business in Brisbane (2026 Analysis)',
    metaDescription:
      'Brisbane is transformed. Post-G20, post-pandemic, pre-Olympics — which suburbs offer genuine business opportunity? Scores, rents, and honest suburb analysis.',
    overviewParagraphs: [
      "Brisbane's commercial property market is mid-transformation. The 2032 Olympics infrastructure pipeline — $7.1B committed across venues, transport, and precinct redevelopment — is the most significant structural catalyst in Queensland commercial real estate in decades. Operators who positioned in West End, Fortitude Valley, and New Farm in 2022–24 are already seeing demographic dividends. The window for Olympic positioning is narrowing but not closed.",
      "The South East Queensland migration story has materially changed Brisbane demographics. Net interstate migration peaked at 40,000+ per year in 2022 and remains elevated. The incoming cohort is disproportionately young professional families from Sydney and Melbourne — higher incomes, higher hospitality expenditure, and consumer expectations shaped in Australia's more sophisticated markets. This is a permanent structural upgrade to Brisbane's consumer base.",
      "Brisbane's main commercial challenge is geographic fragmentation. Unlike Sydney's linear east-west spine or Melbourne's dense inner north, Brisbane's commercial activity is dispersed across multiple precincts (New Farm, West End, Paddington, Fortitude Valley) that don't form a continuous strip. This means operators need to choose a specific community rather than positioning on a corridor.",
    ],
    stats: [
      { value: '$7.1B', label: 'Olympics infrastructure investment committed to SEQ by 2032', source: 'Queensland Government 2025' },
      { value: '+40K', label: 'Annual net interstate migration to SEQ — highest in nation', source: 'ABS 2024' },
      { value: '35%', label: 'Lower commercial rents than Sydney comparable suburbs', source: 'CBRE Q1 2026' },
    ],
    suburbCategories: [
      {
        title: 'Established Premium',
        description: 'Inner Brisbane suburbs with proven market demand and strong demographics.',
        suburbs: [
          { name: 'New Farm', slug: 'new-farm', description: 'Riverfront brunch capital. Demand exceeds supply — only 3 independent cafés.', score: 80, verdict: 'GO', rentRange: '$4,000–$7,500/mo' },
          { name: 'Paddington', slug: 'paddington', description: 'Latrobe Terrace — Brisbane\'s best café street.', score: 87, verdict: 'GO', rentRange: '$5,000–$8,500/mo' },
          { name: 'West End', slug: 'west-end', description: 'Creative precinct with strong multicultural hospitality.', score: 85, verdict: 'GO', rentRange: '$4,500–$7,500/mo' },
        ],
      },
      {
        title: 'Growth Suburbs',
        description: 'Olympics-adjacent precincts and growing residential catchments.',
        suburbs: [
          { name: 'Fortitude Valley', slug: 'fortitude-valley', description: 'Nighttime economy with growing daytime hospitality. Olympics venue precinct.', score: 74, verdict: 'GO', rentRange: '$4,500–$8,000/mo' },
          { name: 'South Brisbane', slug: 'south-brisbane', description: 'Cultural precinct anchor. QPAC and Gallery foot traffic.', score: 77, verdict: 'GO', rentRange: '$4,000–$7,000/mo' },
        ],
      },
    ],
    businessTypes: [
      {
        type: 'Hospitality',
        insight: 'New Farm and Paddington are Brisbane\'s premium hospitality markets. West End serves the multicultural and creative demographic. Fortitude Valley is improving as Olympics precinct development transforms the daytime economy.',
        bestSuburbs: ['New Farm', 'Paddington', 'West End'],
      },
    ],
    comparisons: [
      {
        title: 'New Farm vs Paddington',
        body: 'New Farm has riverfront positioning and demand that significantly exceeds supply — only 3 independent cafés for a weekend brunch market of 4,000+ customers. Paddington\'s Latrobe Terrace is more established with a proven café strip. For a new entrant, New Farm\'s supply gap is the stronger opportunity.',
      },
    ],
    hiddenGems: [
      {
        name: 'West End',
        slug: 'west-end',
        why: 'West End\'s multicultural community creates specialty food demand that rewards genuine cultural cuisine operators. Vietnamese, Middle Eastern, and South Asian food concepts find loyal customer bases here at rents 30% below Paddington.',
      },
    ],
    highRiskZones: [
      {
        name: 'Brisbane CBD (Queen Street)',
        slug: 'brisbane-cbd',
        why: 'CBD foot traffic remains below pre-COVID levels. Premium rents without the foot traffic recovery creates poor unit economics for most operator types.',
      },
    ],
    faqs: [
      {
        question: 'Which Brisbane suburb is best for a new café?',
        answer: 'New Farm has the best opportunity gap — significant unmet demand with limited supply. Paddington is the established café market with proven economics. For new entrants, New Farm\'s 3-café constraint on a weekend brunch market of 4,000+ customers is a compelling opening.',
      },
      {
        question: 'How will the 2032 Olympics affect Brisbane business locations?',
        answer: 'Olympics infrastructure drives permanent demographic shifts, not just 2-week crowds. Fortitude Valley and South Brisbane are the primary beneficiaries — venue development, transport upgrades, and precinct activation will permanently change foot traffic and demographics.',
      },
      {
        question: 'Is Brisbane cheaper than Sydney for commercial rent?',
        answer: 'Yes — meaningfully so. Comparable suburban retail positions in Brisbane are 30–40% cheaper than Sydney equivalents. Paddington (Brisbane) sits at $5,000–$8,500/month vs Surry Hills (Sydney) at $8,000–$14,000/month for comparable footprint and foot traffic.',
      },
    ],
  },
}

export const SUPPORTED_CITY_SLUGS = Object.keys(CITY_PAGE_DATA)

export function getCityPageData(slug: string): CityPageData | null {
  return CITY_PAGE_DATA[slug] ?? null
}
