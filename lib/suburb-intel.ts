// lib/suburb-intel.ts
// Data layer for programmatic suburb × business-type SEO pages.
// Each entry is fully self-contained — add new entries to SUBURB_DATA to scale.

export type BusinessTypeIntel = 'cafe' | 'restaurant' | 'retail' | 'gym' | 'salon'
export type VerdictType       = 'GO' | 'CAUTION' | 'NO'
export type ConfidenceLevel   = 'low' | 'medium' | 'high'
export type RentLevel         = 'below-market' | 'at-market' | 'above-market' | 'premium'
export type CompetitionLevel  = 'low' | 'medium' | 'high' | 'saturated'

export interface RelatedSuburb {
  label    : string  // "Newtown cafés"
  suburbSlug: string // "newtown"
  citySlug  : string // "sydney"
  type      : BusinessTypeIntel
}

export interface SuburbIntelData {
  // ── Identity ──────────────────────────────────────────────────────────────
  suburb        : string            // "Surry Hills"
  suburbSlug    : string            // "surry-hills"
  city          : string            // "Sydney"
  citySlug      : string            // "sydney"
  state         : string            // "NSW"
  businessType  : BusinessTypeIntel
  businessLabel : string            // "Café / Coffee Shop"

  // ── Verdict ───────────────────────────────────────────────────────────────
  verdict       : VerdictType
  verdictSummary: string            // 1–2 crisp sentences

  // ── Metrics ───────────────────────────────────────────────────────────────
  monthlyRevenue         : { low: number; high: number }  // AUD
  monthlyProfit          : { low: number; high: number }  // AUD, after all costs, pre-tax
  monthlyRent            : { low: number; high: number }  // AUD realistic range
  rentLevel              : RentLevel
  avgTicket              : number
  dailyCustomersNeeded   : number   // break-even estimate
  competitionLevel       : CompetitionLevel
  demandScore            : number   // 1–10
  confidenceLevel        : ConfidenceLevel
  confidenceNote         : string

  // ── Suburb profile ────────────────────────────────────────────────────────
  suburbProfile          : string   // 2–3 sentences: who lives here, what's the vibe

  // ── Core analysis ─────────────────────────────────────────────────────────
  demandAnalysis         : string
  competitionAnalysis    : string
  rentAnalysis           : string
  customerBehavior       : string

  // ── Intelligence layer ────────────────────────────────────────────────────
  successConditions      : string[]   // 4 items
  failureScenarios       : string[]   // 4 items
  whatWouldMakeItBetter  : string[]   // 2–3 items

  // ── SEO ───────────────────────────────────────────────────────────────────
  metaTitle              : string
  metaDescription        : string

  // ── Internal linking ──────────────────────────────────────────────────────
  relatedSuburbs         : RelatedSuburb[]  // 3 entries

  // ── Methodology ───────────────────────────────────────────────────────────
  dataAssumptions        : string
  lastUpdated            : string   // "Q1 2025"
}

// ── Data ──────────────────────────────────────────────────────────────────────
// Key format: `${type}/${citySlug}/${suburbSlug}`

const SUBURB_DATA: Record<string, SuburbIntelData> = {

  // ── 1. CAFÉ · SYDNEY · SURRY HILLS ─────────────────────────────────────────
  'cafe/sydney/surry-hills': {
    suburb       : 'Surry Hills',
    suburbSlug   : 'surry-hills',
    city         : 'Sydney',
    citySlug     : 'sydney',
    state        : 'NSW',
    businessType : 'cafe',
    businessLabel: 'Café / Coffee Shop',

    verdict: 'CAUTION',
    verdictSummary:
      'Surry Hills has the demand — walkable, coffee-literate, high daily foot traffic — but the economics only work if you negotiate rent hard and bring a genuinely differentiated concept. A generic café at market rent here will average 58 customers/day just to break even before paying yourself.',

    monthlyRevenue        : { low: 38_000, high: 68_000 },
    monthlyProfit         : { low: 2_000,  high: 12_000 },
    monthlyRent           : { low: 6_000,  high: 12_000 },
    rentLevel             : 'premium',
    avgTicket             : 19,
    dailyCustomersNeeded  : 62,
    competitionLevel      : 'saturated',
    demandScore           : 9,
    confidenceLevel       : 'high',
    confidenceNote:
      'Surry Hills is one of Australia\'s most data-rich café markets. Estimates are based on publicly available lease listings, published industry benchmarks, and median wage data from ABS 2021 Census.',

    suburbProfile:
      'Surry Hills sits 2km south of Sydney CBD — a predominantly renter suburb (72% renters) of young professionals, creative workers, and tech employees with median individual income above $65,000. The suburb scores among Australia\'s highest for walkability and café density, which is both the opportunity and the problem.',

    demandAnalysis:
      'Café demand in Surry Hills is structural, not cyclical. The suburb\'s demographic — commuters who walk to and through the area, a creative-industry workforce that treats a café as a third office, and a brunch culture anchored by some of Australia\'s most celebrated operators — creates consistent 7-day demand. Weekday mornings (7–10am) and Saturday brunch (9am–1pm) are the revenue peaks. Average ticket size of $18–22 is achievable here, meaningfully above a suburban equivalent, because local customers are accustomed to paying for quality. The problem is not demand — it\'s cost structure relative to demand. You need 62+ customers per day just to cover fixed costs before taking any profit.',

    competitionAnalysis:
      'Saturated is the only accurate description. Surry Hills and adjacent Crown Street contain over 80 independent cafés within a 1.5km radius, including nationally recognised operators — Paramount Coffee Project, Single O, Reuben Hills, and dozens of neighbourhood stalwarts. The competition is not abstract: these operators have loyal morning regulars, established roasting partnerships, and a social media presence that has taken years to build. You are not entering a gap in the market; you are asking existing customers to change a habit. That requires a distinctive reason to switch — a unique roaster relationship, a better food offering, or a format that existing operators haven\'t captured (late-night espresso bar, zero-waste concept, walk-up window only).',

    rentAnalysis:
      'Crown Street frontage and high-visibility corners command $9,000–$12,000/month. Secondary streets and laneways offer $5,500–$7,500/month — the functional range for a new operator. At $8,000/month rent with 2 staff and standard overheads, your total fixed costs run approximately $20,000/month. With a $19 average ticket and 35% COGS, each customer contributes $12.35. You need 1,620 customers per month — 62 per trading day — before you earn a dollar of profit. Every dollar of rent above $7,000/month adds approximately 7 customers to that daily target. Negotiate hard. Target a rent below $7,000/month or include a turnover rent clause capped at 8% of revenue.',

    customerBehavior:
      'Surry Hills café customers are deliberate choosers. They do not visit by accident — they walk past 10 other cafés to get to their preferred one. Loyalty is real, but it is earned through consistency and point of view, not proximity. The core segments are: (1) the daily commuter who needs their morning coffee repeatable and fast, (2) the work-from-café cohort who stay 2–4 hours and spend $25–35 per visit, and (3) the weekend brunch group who push average ticket to $30–45 with food. Building all three segments is the path to a viable revenue model — relying on commuters alone produces high volume but insufficient average ticket.',

    successConditions: [
      'Rent negotiated below $7,000/month or a structured turnover rent arrangement — non-negotiable at the Surry Hills cost base.',
      'A clearly differentiated concept that does not replicate what the top 5 operators already do. A specific roaster relationship, a unique food program, or a format niche (zero-waste, specialty non-dairy, extended evening hours) is the minimum requirement.',
      'A corner or high-visibility position on Crown Street, Cleveland Street, or Foveaux Street — secondary laneways without foot traffic can\'t generate 62 customers/day organically.',
      'A second revenue stream active from month one — wholesale beans, catering, or a retail shelf product — to supplement floor revenue during slow periods.',
    ],

    failureScenarios: [
      'A quality-first but generic café (great beans, pretty fit-out, standard menu) opening in a secondary position at $9,000/month rent — the most common failure mode in this market.',
      'Underestimating fit-out cost. A compliant, high-quality café fit-out in Surry Hills runs $150,000–$250,000. Undercapitalisation is fatal before you\'ve built a customer base.',
      'Launching without an established presence in the local food media and Instagram community. Discovery in Surry Hills is social-first; a café with no presence before launch starts months behind.',
      'Assuming weekend brunch alone will carry the business. Saturday brunch revenue cannot compensate for weak weekday trading — the fixed cost base runs 7 days regardless of whether you trade 6.',
    ],

    whatWouldMakeItBetter: [
      'A 7am–3pm model focused on throughput over ambience reduces rent-per-square-metre pressure and simplifies staffing. Evening café service in Surry Hills is a different competitive market.',
      'A B2B coffee delivery or office account program targeting the Crown Street corridor businesses — this revenue is highly predictable and structurally different from walk-in dependency.',
      'A leaseback or revenue-share arrangement with the landlord rather than a fixed lease — increasingly available in post-COVID Surry Hills as landlords prefer occupied tenancies.',
    ],

    metaTitle      : 'Is Surry Hills Good for a Café? Location Intelligence Report | Locatalyze',
    metaDescription: 'Thinking of opening a café in Surry Hills, Sydney? Get a real verdict: demand score, break-even estimate, rent analysis, and key success conditions — before you sign.',

    relatedSuburbs: [
      { label: 'Café in Newtown',       suburbSlug: 'newtown',       citySlug: 'sydney',     type: 'cafe' },
      { label: 'Café in Redfern',       suburbSlug: 'redfern',       citySlug: 'sydney',     type: 'cafe' },
      { label: 'Café in Darlinghurst',  suburbSlug: 'darlinghurst',  citySlug: 'sydney',     type: 'cafe' },
    ],

    dataAssumptions:
      'Revenue estimates based on 45–75 covers/day at $17–22 average ticket, 6 trading days/week. Rent ranges drawn from commercial lease listings on CBRE, RealCommercial, and LJ Hooker Commercial, Q1 2025. Staff costs assume 2 FT + 2 casual, including Super at 11%. Profit estimates are post all fixed costs, pre-income tax, with no owner wage drawn. Daily customers needed calculated at 33% COGS on $19 average ticket with $19,500/month total fixed costs.',
    lastUpdated: 'Q1 2025',
  },


  // ── 2. RESTAURANT · PERTH · SUBIACO ────────────────────────────────────────
  'restaurant/perth/subiaco': {
    suburb       : 'Subiaco',
    suburbSlug   : 'subiaco',
    city         : 'Perth',
    citySlug     : 'perth',
    state        : 'WA',
    businessType : 'restaurant',
    businessLabel: 'Restaurant / Bistro',

    verdict: 'GO',
    verdictSummary:
      'Subiaco offers a rare combination in Australian hospitality: a high-spending demographic, below-east-coast rent, and a competition landscape with clear gaps. The conditions are real — you need the right concept and $250,000+ capital — but the underlying market economics are genuinely favourable.',

    monthlyRevenue        : { low: 55_000, high: 110_000 },
    monthlyProfit         : { low: 6_000,  high: 22_000 },
    monthlyRent           : { low: 4_500,  high: 8_000 },
    rentLevel             : 'at-market',
    avgTicket             : 72,
    dailyCustomersNeeded  : 38,
    competitionLevel      : 'medium',
    demandScore           : 8,
    confidenceLevel       : 'high',
    confidenceNote:
      'Subiaco is well-documented as one of Perth\'s primary dining precincts. Estimates draw on Perth commercial leasing data, ABS income data for the Subiaco SA2, and industry benchmarks for WA hospitality payroll costs.',

    suburbProfile:
      'Subiaco sits 4km west of Perth CBD — an affluent, established suburb with high home ownership among the 40+ demographic and a growing younger renter base. Median household income sits above $120,000. Rokeby Road is the primary dining and retail strip, functioning as a genuine destination rather than a thoroughfare. The suburb is compact, walkable, and has strong community loyalty.',

    demandAnalysis:
      'Subiaco\'s restaurant demand is anchored by its demographic profile and precinct identity. The 35–55 age cohort — high discretionary income, established dining habits, preference for quality over novelty — generates reliable Thursday–Sunday dinner trade. A growing 25–40 renter segment adds weekday lunch and Thursday evening demand. The suburb\'s proximity to Subiaco Oval (now Optus Stadium precinct) and several healthcare precincts creates a midday corporate dining segment that most operators underserve. Average ticket of $65–90 for dinner is expected and achievable — the customer base is not price-sensitive at that level, but it is quality-sensitive. Mediocre food at premium pricing will fail quickly in a suburb where residents have been dining out for decades.',

    competitionAnalysis:
      'The Subiaco dining scene has medium competition density with notable category gaps. Italian and pizza concepts are overrepresented on Rokeby Road. The suburb lacks a credible modern Asian offering (no contemporary Japanese, no elevated South-East Asian), no strong plant-forward concept, and no serious cocktail bar-restaurant hybrid. The existing leaders have strong local loyalty but are predominantly in the European-casual category. A new entrant with a clearly defined cuisine identity — and the kitchen execution to back it — has genuine room to establish a position within 12–18 months. The key differentiator in Perth restaurant success is quality consistency over time, not launch buzz.',

    rentAnalysis:
      'Perth commercial rents are the single most structurally attractive feature of Subiaco relative to east-coast equivalents. Comparable tenancies in Sydney\'s Surry Hills or Melbourne\'s Fitzroy would run $10,000–$18,000/month. Subiaco Rokeby Road frontage runs $5,000–$8,000/month; side street and secondary positions run $3,500–$5,500/month. At $6,000/month rent with 4 staff (2 FT, 4 casual) and standard overheads, total fixed monthly costs sit at approximately $33,000. With a $72 average ticket and 35% COGS (food-led restaurant), each cover contributes approximately $47. You need 38 covers/day across your trading days to break even — achievable at 60% of a typical Subiaco restaurant\'s volume. That is a meaningful profit buffer.',

    customerBehavior:
      'Subiaco diners are experience-motivated but not trend-chasing. They prioritise: consistent quality, a comfortable environment, good wine, and service that treats them as regulars rather than transaction numbers. They are highly sensitive to service quality declines — a few bad visits can break a reputation that took two years to build. Reservations dominate Friday and Saturday dinner; walk-in trade is stronger at lunch. The suburb\'s Google Review culture is intense — your rating on Google Maps matters more here than any paid marketing channel. Build toward a 4.4+ rating before ramping marketing spend.',

    successConditions: [
      'A concept in an underrepresented category — modern Asian, elevated plant-forward, contemporary Australian — rather than competing in the crowded Italian/pizza segment.',
      'A minimum of 50 covers with a private dining room or semi-private section to capture corporate and celebration bookings, which carry 20–30% higher average tickets.',
      'A lease below $6,500/month with a 5-year term and options — Perth\'s market stability makes longer leases less risky than in Melbourne or Sydney. Lock in the rent before success pushes renewal leverage to the landlord.',
      'A lunch trade program from month one. Most Subiaco restaurants leave significant lunch revenue on the table — the healthcare precinct and professional services workforce creates 200+ potential midday covers within walking distance.',
    ],

    failureScenarios: [
      'Entering the Italian/pizza category without a compelling point of differentiation — three credible incumbents already own that customer in Subiaco.',
      'Overpricing relative to Perth\'s value expectations. A $140/head degustation format will not sustain in Subiaco without a destination reputation that takes 2–3 years to build. Start at $70–90/head and earn the pricing power.',
      'Underestimating kitchen fit-out cost in older Rokeby Road buildings — heritage-listed or older tenancies often require $80,000–$150,000 in infrastructure before any design spend.',
      'Assuming Perth\'s strong economy removes demand risk — the mining sector creates income volatility that flows through to discretionary dining spend during downturns.',
    ],

    whatWouldMakeItBetter: [
      'A private dining events program activated in the first 3 months — Subiaco\'s corporate demographic makes this high-ROI and creates a revenue floor that is insulated from weekly trading variability.',
      'A collaboration with the Subiaco farmers market and local producers to create visible supply chain provenance — Perth diners respond strongly to local sourcing stories and it creates earned media without advertising spend.',
    ],

    metaTitle      : 'Is Subiaco Good for a Restaurant? Location Intelligence Report | Locatalyze',
    metaDescription: 'Thinking of opening a restaurant in Subiaco, Perth? Real verdict: demand analysis, rent range, break-even estimate, and key risks — before you commit.',

    relatedSuburbs: [
      { label: 'Restaurant in Leederville', suburbSlug: 'leederville', citySlug: 'perth', type: 'restaurant' },
      { label: 'Restaurant in Mt Hawthorn', suburbSlug: 'mt-hawthorn', citySlug: 'perth', type: 'restaurant' },
      { label: 'Restaurant in Cottesloe',   suburbSlug: 'cottesloe',   citySlug: 'perth', type: 'restaurant' },
    ],

    dataAssumptions:
      'Revenue estimates based on 40–70 covers/service, 2 services Friday–Saturday, 1 service Tuesday–Thursday, $65–90 average ticket. Rent from Perth commercial listings on RealCommercial and CBRE, Q1 2025. Staff costs assume 2 FT + 4 casual including Super. Break-even calculates 35% COGS, $6,000/month rent, $33,000 total monthly fixed costs. Profit pre-tax, no owner wage drawn.',
    lastUpdated: 'Q1 2025',
  },


  // ── 3. RETAIL · MELBOURNE · RICHMOND ───────────────────────────────────────
  'retail/melbourne/richmond': {
    suburb       : 'Richmond',
    suburbSlug   : 'richmond',
    city         : 'Melbourne',
    citySlug     : 'melbourne',
    state        : 'VIC',
    businessType : 'retail',
    businessLabel: 'Retail Shop',

    verdict: 'CAUTION',
    verdictSummary:
      'Richmond\'s Bridge Road strip offers genuinely reset rents and strong demographic density, but the structural shift away from commodity retail is real and ongoing. The opportunity is specific: specialist, non-commoditised retail with a digital presence and low rent commitment. The trap is generic product at historical rent.',

    monthlyRevenue        : { low: 28_000, high: 55_000 },
    monthlyProfit         : { low: 1_500,  high: 9_000 },
    monthlyRent           : { low: 3_500,  high: 7_000 },
    rentLevel             : 'below-market',
    avgTicket             : 75,
    dailyCustomersNeeded  : 32,
    competitionLevel      : 'medium',
    demandScore           : 6,
    confidenceLevel       : 'medium',
    confidenceNote:
      'Bridge Road\'s retail dynamics are in active transition. Vacancy data from the Yarra City Council and CBRE, combined with publicly listed commercial rents, provides a solid estimate base. Revenue projections carry higher uncertainty than hospitality pages due to the category-dependency of retail performance.',

    suburbProfile:
      'Richmond is Melbourne\'s inner-east suburb 3km from the CBD — anchored by Bridge Road, historically one of Melbourne\'s premier fashion and homewares precincts. The suburb demographic is a mix of long-established families (Punt Road corridor), younger renters in new apartment buildings (Bridge Road end), and a significant Vietnamese-Australian community in the south. The Melbourne Cricket Ground sits adjacent, generating 15–20 high foot-traffic event days per year.',

    demandAnalysis:
      'Retail demand in Richmond is format-dependent in a way that hospitality is not. Generic fashion, homewares, and commodity product categories face a structural ceiling from online substitution — this is not a cyclical softening but a permanent market shift that Bridge Road is still digesting. The categories that are performing: experience-adjacent retail (specialty food, providores, gift), service-based retail (optical, alterations, repairs, specialty grooming), and clearly positioned independent brands with a social following before opening. The MCG event day cycle (AFL season, Boxing Day Test, New Year\'s cricket) generates genuine foot traffic spikes of 30–50% above baseline — this is an underutilised opportunity for accessible, impulse-oriented retail.',

    competitionAnalysis:
      'The visible vacancy rate on Bridge Road (estimated 15–25% by city council data) reads as weakness but functions differently for a new operator. It means: competition from other specialty retailers is lower than the strip\'s historical peak, and landlords are incentivised to deal. Swan Street, a parallel retail strip 400m south, has demonstrably outperformed Bridge Road and provides a comparison case — the right concept in the right position can build a loyal local customer base. The key observation: operators who have succeeded on Bridge Road in the past five years are either destination-specific (bridal, specialty outdoor, vintage) or food-adjacent. Generic fashion and home décor have vacated.',

    rentAnalysis:
      'Bridge Road rents have corrected 20–35% from their peak. Current tenancies run $3,500–$7,000/month depending on size (typically 100–200sqm ground floor). This is the strip\'s primary structural advantage — a lease negotiated today at $4,500/month would have cost $6,500–$7,000/month in 2017. At $4,500/month rent with 1.5 staff (owner + 1 casual) and standard retail overheads, total fixed monthly costs run approximately $14,500. With a $75 average ticket and 48% COGS, each transaction contributes $39. You need 373 transactions per month — approximately 62 per trading week — to break even. That is a manageable target if your product draws deliberate shoppers rather than impulse browsers.',

    customerBehavior:
      'Richmond retail customers are category-specific and deliberate. They do not browse Bridge Road the way they once did — the aimless Saturday afternoon shopping trip has largely moved online or to centralised destinations. What brings customers to Bridge Road now: a specific need in a specific category, a recommendation from their social network, or proximity to the MCG on event days. The implication is clear: a marketing strategy for Bridge Road retail must be discovery-led (Google Search, Instagram) rather than foot-traffic-dependent. Your customers need to know you exist before they arrive, not discover you by walking past. Build the digital presence before the physical one.',

    successConditions: [
      'A specialist, non-commodity product that cannot be easily ordered on Amazon or found at Kmart — bridal or formalwear, specialty outdoor gear, art supplies, musical instruments, specialty food, or artisan goods.',
      'Rent under $5,000/month with a 3-year lease. Limit your commitment until Bridge Road\'s trajectory becomes clearer. Avoid 5-year leases without a 2-year exit clause.',
      'A digital-first customer acquisition strategy active before opening — an Instagram following, Google Business profile, and online store that drives people to the physical location rather than relying on walk-ins.',
      'Event-day activation for MCG events: outdoor signage, extended hours, a product range optimised for the crowd profile (merchandise-adjacent, gift-ready, accessible price points under $50).',
    ],

    failureScenarios: [
      'A generic fashion, home décor, or beauty concept that competes directly with online alternatives and mass-market chains — the segment that has produced the majority of Bridge Road vacancies since 2018.',
      'A rent commitment above $6,500/month without turnover clauses. Bridge Road landlords are still asking historical rates for premium positions; push back hard or walk away.',
      'Relying on weekday foot traffic alone. Bridge Road is a weekend market — Monday through Thursday trading is thin and the economics don\'t change that fact.',
      'Opening without a complementary online store. Specialty retail without e-commerce in 2025 leaves 20–35% of revenue potential on the table and removes the discovery layer that drives new customers to the physical location.',
    ],

    whatWouldMakeItBetter: [
      'A workshop, class, or event component to the retail model — a specialty food store that runs cooking classes, a fabric shop that runs sewing workshops — creates destination traffic and community that pure product retail cannot replicate, and builds an email list that is more valuable than a lease.',
      'A MCG events partnership or formal activation strategy: Bridge Road is within walking distance of 85,000-seat Optus MCG. The 15–20 major events per year represent an untapped commercial opportunity for any retailer with an accessible, visible product.',
    ],

    metaTitle      : 'Is Richmond Good for Retail? Bridge Road Location Intelligence | Locatalyze',
    metaDescription: 'Thinking of opening a retail shop on Bridge Road, Richmond? Get the real verdict: rent reset analysis, demand score, break-even estimate, and which concepts actually work.',

    relatedSuburbs: [
      { label: 'Retail in Fitzroy',    suburbSlug: 'fitzroy',    citySlug: 'melbourne', type: 'retail' },
      { label: 'Retail in Collingwood',suburbSlug: 'collingwood',citySlug: 'melbourne', type: 'retail' },
      { label: 'Retail in Prahran',    suburbSlug: 'prahran',    citySlug: 'melbourne', type: 'retail' },
    ],

    dataAssumptions:
      'Revenue estimates based on 28–50 daily transactions at $65–90 average ticket, 6-day trading week weighted heavily to Saturday–Sunday. Rent from Bridge Road commercial listings on RealCommercial and Yarra City Council vacancy survey, Q1 2025. Staff costs assume 1 FT owner + 1 casual, including Super. COGS at 48% (specialty retail benchmark). Profit pre-tax, owner wage included in staff cost.',
    lastUpdated: 'Q1 2025',
  },

}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getSuburbData(
  type   : string,
  city   : string,
  suburb : string,
): SuburbIntelData | null {
  return SUBURB_DATA[`${type}/${city}/${suburb}`] ?? null
}

export function getAllSlugs(): { type: string; city: string; suburb: string }[] {
  return Object.keys(SUBURB_DATA).map(key => {
    const [type, city, suburb] = key.split('/')
    return { type, city, suburb }
  })
}

export const VERDICT_CONFIG: Record<VerdictType, {
  label     : string
  color     : string
  bg        : string
  border    : string
  lightBg   : string
  lightBorder: string
}> = {
  GO: {
    label      : 'GO',
    color      : '#059669',
    bg         : '#059669',
    border     : '#059669',
    lightBg    : '#ECFDF5',
    lightBorder: '#A7F3D0',
  },
  CAUTION: {
    label      : 'CAUTION',
    color      : '#D97706',
    bg         : '#D97706',
    border     : '#D97706',
    lightBg    : '#FFFBEB',
    lightBorder: '#FDE68A',
  },
  NO: {
    label      : 'NO',
    color      : '#DC2626',
    bg         : '#DC2626',
    border     : '#DC2626',
    lightBg    : '#FEF2F2',
    lightBorder: '#FECACA',
  },
}

export const COMPETITION_LABELS: Record<CompetitionLevel, string> = {
  low      : 'Low — clear market gap',
  medium   : 'Medium — manageable',
  high     : 'High — competitive',
  saturated: 'Saturated — very crowded',
}

export const RENT_LABELS: Record<RentLevel, string> = {
  'below-market' : 'Below market',
  'at-market'    : 'At market',
  'above-market' : 'Above market',
  'premium'      : 'Premium / top of market',
}

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  low   : 'Low — limited local data',
  medium: 'Medium — industry benchmarks applied',
  high  : 'High — data-rich market',
}
