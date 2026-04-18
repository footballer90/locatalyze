// lib/suburb-intel.ts
// Data layer for programmatic suburb × business-type SEO pages.
// Each entry is fully self-contained — add new entries to SUBURB_DATA to scale.
// Additional routes are generated from lib/suburb-data (SUBURBS × core types) for scale.

import { SUBURBS, type SuburbData } from './suburb-data'

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


  // ── 4. CAFÉ · SYDNEY · NEWTOWN ──────────────────────────────────────────────
  'cafe/sydney/newtown': {
    suburb: 'Newtown', suburbSlug: 'newtown', city: 'Sydney', citySlug: 'sydney', state: 'NSW',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'CAUTION',
    verdictSummary: 'Newtown has deep café culture and consistent demand, but King Street is one of Sydney\'s most saturated strips. The market rewards bold concepts with a clear identity — a generic café will drown in a street with 70+ options inside 2km.',
    monthlyRevenue: { low: 32_000, high: 58_000 }, monthlyProfit: { low: 1_500, high: 10_000 },
    monthlyRent: { low: 5_000, high: 9_000 }, rentLevel: 'above-market',
    avgTicket: 17, dailyCustomersNeeded: 55, competitionLevel: 'saturated', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Newtown is one of Sydney\'s most documented hospitality precincts. Rent data from commercial listings on RealCommercial and LJ Hooker Commercial, Q1 2025.',
    suburbProfile: 'Newtown sits 4km southwest of Sydney CBD — a dense, walkable suburb anchored by King Street, one of Sydney\'s most eclectic retail and hospitality strips. The population is a mix of University of Sydney students and academics, creative professionals, and long-term residents who define themselves by the suburb\'s independent-business culture. Median age is 29, rental rate exceeds 70%, and the suburb has one of the highest café-per-capita ratios in Australia.',
    demandAnalysis: 'Café demand in Newtown is structural and year-round. The USYD proximity drives consistent weekday morning trade from 7–10am, and the suburb\'s culture of remote work and extended café sessions creates strong 10am–2pm revenue from the work-from-café cohort. Weekends are driven by brunch — Newtown\'s brunch culture is serious, with $30–45 per-head spend achievable if your food program is genuinely good. The challenge: that demand is split across far too many operators. Average ticket of $15–19 is slightly below Surry Hills — Newtown\'s demographic skews younger and more price-conscious — which means the volume bar to break even is higher per dollar of rent.',
    competitionAnalysis: 'King Street has over 70 independent cafés within 2km. The quality ceiling is high — Newtown customers are café-literate and have strong existing loyalties. Operators who have broken through (Black Star Pastry, Gigi\'s) did so with a product that was genuinely unambiguous in its differentiation. There are no gaps in the generic café category. What is underserved: extended evening café trade (the area has strong nightlife but few quality espresso options after 5pm), specialty non-dairy milk programs at the premium end, and cafés with a serious retail/bean component. If you cannot identify a clear gap, Newtown is the wrong market.',
    rentAnalysis: 'King Street frontage runs $7,000–$9,000/month for a viable tenancy. Secondary streets and laneways offer $4,500–$6,500/month — the functional range for a sustainable new entry. At $7,000/month rent with 2 staff and overheads, your fixed costs run approximately $18,500/month. At $17 average ticket with 33% COGS, each customer contributes $11.39. You need 1,624 customers/month — 55 per day — to break even before profit. That is achievable in Newtown but not comfortable. Every dollar negotiated off rent meaningfully improves survivability.',
    customerBehavior: 'Newtown café customers are independent-business loyalists who actively avoid chains and actively support what they perceive as "theirs." They are influenced by word of mouth, Instagram, and the recommendation of a trusted regular more than any paid channel. They respond well to origin storytelling (where the beans come from, who the producer is) and sustainability credentials. They are less price-sensitive about coffee than the eastern suburbs but more price-sensitive about food — breakfast at $24 feels right here, $32 feels like it belongs in Bondi. Building a morning regular cohort of 30–40 people who come 4–5 times per week is the business model that works.',
    successConditions: [
      'A product concept that is distinctly Newtown — alternative, independent, anti-corporate. This is not just aesthetics; it needs to be embedded in the sourcing, the menu, and the service culture.',
      'Rent negotiated below $6,500/month or a lease with turnover rent capped at 9% of revenue, giving you protection in slow periods.',
      'A secondary revenue stream from day one — retail beans, ready-to-drink product, or catering for the USYD academic precinct and nearby creative studios.',
      'A genuine presence in the Newtown food community before opening — attending the Newtown festival, participating in local markets, building relationships with adjacent independent businesses.',
    ],
    failureScenarios: [
      'A quality-first café without a distinct concept opening on King Street at $8,500/month rent — the most common entry failure mode in this market over the past five years.',
      'Underestimating the USYD semester calendar: trade in January and July (semester breaks) can drop 30–40% from peak, and fixed costs don\'t shift. Budget accordingly.',
      'A fit-out that reads as generic despite good intentions — Newtown customers read the room. A predictable Scandi-minimal interior with no point of view signals the product will be equally forgettable.',
      'Opening without an established social media presence and without engaging the Newtown food media circuit (Broadsheet, Time Out Sydney, local food bloggers) before launch.',
    ],
    whatWouldMakeItBetter: [
      'A laneways or laneway-adjacent location with lower rent and a "find it if you know" positioning — Newtown\'s culture rewards places that feel discovered rather than obvious.',
      'An evening trade extension (espresso bar 6pm–10pm) to capture the pre-dinner and post-film crowd that currently has no quality coffee option after 5pm on King Street.',
    ],
    metaTitle: 'Is Newtown Good for a Café? Sydney Location Intelligence | Locatalyze',
    metaDescription: 'Thinking of opening a café in Newtown, Sydney? Real verdict: demand score 8/10, competition analysis, rent range $5k–$9k/month, break-even estimate, and what actually works.',
    relatedSuburbs: [
      { label: 'Café in Surry Hills', suburbSlug: 'surry-hills', citySlug: 'sydney', type: 'cafe' },
      { label: 'Café in Glebe',       suburbSlug: 'glebe',       citySlug: 'sydney', type: 'cafe' },
      { label: 'Café in Redfern',     suburbSlug: 'redfern',     citySlug: 'sydney', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 40–65 covers/day at $15–19 average ticket, 6 trading days. Rent from King Street commercial listings Q1 2025. Staff: 2 FT + 2 casual including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 5. RESTAURANT · SYDNEY · NEWTOWN ────────────────────────────────────────
  'restaurant/sydney/newtown': {
    suburb: 'Newtown', suburbSlug: 'newtown', city: 'Sydney', citySlug: 'sydney', state: 'NSW',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'GO',
    verdictSummary: 'Newtown\'s restaurant market is meaningfully less saturated than its café market and the economics are better — lower average ticket expectations but genuine year-round demand from a restaurant-loyal demographic. The right ethnic or independent concept has clear room to build a following.',
    monthlyRevenue: { low: 42_000, high: 88_000 }, monthlyProfit: { low: 4_000, high: 16_000 },
    monthlyRent: { low: 5_000, high: 8_500 }, rentLevel: 'at-market',
    avgTicket: 52, dailyCustomersNeeded: 34, competitionLevel: 'high', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Newtown restaurant market well-documented. Data from commercial listings, ABS 2021 Census Newtown SA2, and hospitality industry benchmarks for inner-Sydney.',
    suburbProfile: 'Newtown\'s restaurant demographic — young, diverse, culturally curious, with strong disposable income relative to rent — makes it one of Sydney\'s best performing restaurant precincts. The suburb actively supports independent dining and has produced some of Sydney\'s most celebrated restaurants. The average dinner customer arrives with a recommendation and an expectation of quality, not a corporate expense account.',
    demandAnalysis: 'Restaurant demand in Newtown runs 5 nights per week with genuine Friday–Saturday dinner peaks. The suburb\'s cultural mix — significant East and South-East Asian community, strong Latin American presence, broad independent food culture — creates appetite for authentic ethnic cuisine that is not available elsewhere in Sydney at accessible price points. Average ticket of $48–58 positions Newtown restaurants in the casual-quality segment: above pub food, below fine dining, occupying the sweet spot where local regulars return weekly. Thai, Japanese, Korean, Vietnamese, and Mexican concepts consistently outperform in Newtown relative to their rent costs. Modern Australian and European fine dining sits in a smaller, more competitive segment.',
    competitionAnalysis: 'The restaurant market in Newtown is competitive but not saturated in the way its café market is. Category gaps exist: there is no credible modern Korean concept, no strong natural wine bar-restaurant, and the ramen/Japanese noodle category is underserved for the volume of demand. The established leaders (Thai Pothong, Oscillate Wildly, various Vietnamese) occupy specific niches. A new concept in an underrepresented category entering at $55–60 per head has genuine room to build a regular customer base within 12 months.',
    rentAnalysis: 'King Street restaurant tenancies run $5,500–$8,500/month for functional space (60–120 seats). Side streets and Enmore Road offer $4,000–$6,000/month with strong foot traffic from spill from King Street. At $6,500/month rent with 3 staff and overheads, total fixed costs run approximately $27,000/month. At $52 average ticket and 35% COGS, each cover contributes $33.80. You need 799 covers/month — 34 per trading day — across 6 trading days. That is well below what a performing Newtown restaurant achieves at capacity, giving meaningful buffer.',
    customerBehavior: 'Newtown restaurant customers choose by word of mouth and Google review before any other channel. They are independent-business loyalists who travel the extra distance to avoid a chain. They are price-conscious in a relative sense — they\'ll spend $60/head at a restaurant they believe in but will resent $50/head for a mediocre experience more acutely than an eastern suburbs diner. BYOB culture is strong in Newtown (several restaurants maintain BYOB with a small corkage) which suppresses average ticket vs licensed venues but meaningfully increases customer satisfaction and repeat visit rate.',
    successConditions: [
      'An ethnic cuisine concept that is authentic and specific — not "pan-Asian" but genuinely Korean, Taiwanese, or Sri Lankan — in a category the suburb currently underserves.',
      'BYOB or a focused, value-forward wine list. The Newtown diner is wine-literate and resents overpriced, generic cellar selections. A 25-bottle list with great backstory beats a 200-bottle list of safe brands.',
      'Thursday–Saturday dinner as the primary revenue window, with a focused lunch offering on weekends only. Don\'t attempt a full 6-day lunch program until you have a regular customer base.',
      'Rent below $7,000/month — the additional $1,000/month buys you approximately 30 fewer covers you need per month, which in Newtown\'s competitive market is meaningful survivability headroom.',
    ],
    failureScenarios: [
      'A generic Modern Australian concept at $70/head in a suburb where customers associate that price point with fine dining ambition, not casual quality.',
      'Attempting to replicate the format of an already-successful Newtown restaurant in the same category — the suburb\'s loyal customers have already given their loyalty.',
      'Opening without a clear alcohol strategy — BYOB vs licensed changes your margin structure fundamentally. Model both before signing a lease.',
      'Underestimating kitchen set-up for an ethnic concept — authentic preparation often requires specialist equipment (wok burners, tandoor, fermentation equipment) that can add $30,000–$80,000 to fit-out cost.',
    ],
    whatWouldMakeItBetter: [
      'A Tuesday or Wednesday early-week special to smooth revenue — Newtown has a strong habit of "locals night out" midweek, and a $45 set menu with matching wine builds the regular base that carries you through slow periods.',
      'Community integration: collaborating with local artists for wall space, hosting quarterly supper clubs, or partnering with Newtown\'s creative businesses builds the word-of-mouth that no marketing budget can buy in this suburb.',
    ],
    metaTitle: 'Is Newtown Good for a Restaurant? Sydney Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Newtown Sydney? Verdict: GO. Demand score 8/10, rent range, break-even estimate, and the concepts that actually work in this market.',
    relatedSuburbs: [
      { label: 'Restaurant in Surry Hills', suburbSlug: 'surry-hills', citySlug: 'sydney', type: 'restaurant' },
      { label: 'Restaurant in Redfern',     suburbSlug: 'redfern',     citySlug: 'sydney', type: 'restaurant' },
      { label: 'Café in Newtown',           suburbSlug: 'newtown',     citySlug: 'sydney', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 30–60 covers/service, 2 services Friday–Saturday, 1 service Tuesday–Thursday, $48–58 average ticket. Rent from King Street commercial listings Q1 2025. Staff: 2 FT + 3 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 6. CAFÉ · SYDNEY · GLEBE ────────────────────────────────────────────────
  'cafe/sydney/glebe': {
    suburb: 'Glebe', suburbSlug: 'glebe', city: 'Sydney', citySlug: 'sydney', state: 'NSW',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Glebe is the quiet achiever of inner-west Sydney café markets. Lower rent than Newtown or Surry Hills, a loyal local demographic, and medium competition create better operating margins than its more famous neighbours. The ceiling is lower, but so is the floor.',
    monthlyRevenue: { low: 28_000, high: 50_000 }, monthlyProfit: { low: 3_000, high: 11_000 },
    monthlyRent: { low: 3_500, high: 6_500 }, rentLevel: 'at-market',
    avgTicket: 16, dailyCustomersNeeded: 42, competitionLevel: 'medium', demandScore: 6,
    confidenceLevel: 'medium',
    confidenceNote: 'Glebe is a smaller and less documented market than Newtown or Surry Hills. Estimates draw on Glebe Point Road commercial listings and inner-west hospitality benchmarks.',
    suburbProfile: 'Glebe sits 3km west of Sydney CBD, sharing a postcode boundary with Newtown but with a markedly different character — quieter, more residential, with a higher proportion of owner-occupiers and a mix of academics (USYD proximity), established families, and professionals. Glebe Point Road is the primary strip, shorter and less dense than King Street but with genuine loyal foot traffic from the surrounding residential catchment.',
    demandAnalysis: 'Glebe café demand is neighbourhood-driven rather than destination-driven. The suburb\'s population doesn\'t have the transient, aspirational energy of Surry Hills — customers here are regulars who come consistently across the week rather than explorers looking for the next new thing. That consistency is valuable: a café in Glebe that builds a strong local regular base of 80–100 people achieves revenue stability that a Surry Hills operator chasing novelty-seeking customers cannot. The USYD proximity adds weekday morning demand. Glebe Point Farmers Market (Saturday mornings) drives elevated Saturday foot traffic that benefits adjacent cafés.',
    competitionAnalysis: 'Competition in Glebe is medium — there are solid neighbourhood cafés (Sappho Books Café, various neighbourhood operators) but no operator in Glebe has achieved the kind of cult status that Kings Cross or Surry Hills operators have. This means: the market is not saturated, the ceiling is lower (you are unlikely to build a 120-cover operation), but building a profitable 50–70 cover business with a regular customer base is genuinely achievable. The key competition to monitor is new café openings in the 12–18 months post-lease, which in a smaller suburb have an outsized impact.',
    rentAnalysis: 'Glebe Point Road commercial rents run $3,500–$6,500/month — meaningfully below Newtown and substantially below Surry Hills. This is Glebe\'s structural advantage. At $5,000/month rent with 1.5 staff (owner + 1 FT), total fixed costs run approximately $14,000/month. At $16 average ticket with 33% COGS, each customer contributes $10.72. You need 1,305 customers/month — 42 per trading day — to break even. That is a manageable target for a café with genuine local regulars in Glebe.',
    customerBehavior: 'Glebe café customers are community-builders rather than experience-seekers. They value knowing the owner by name, having their order remembered, and feeling that the café is genuinely part of the neighbourhood rather than a business dropping into it. They are less influenced by Instagram and Broadsheet than their Newtown equivalents and more influenced by a personal recommendation from a neighbour. They skew older (35+) for the midweek regular trade and younger (25–34) on weekends. Loyalty programs (even a simple stamp card) significantly outperform digital marketing in this suburb.',
    successConditions: [
      'A genuine community presence from the first week — attending the Glebe Farmers Market, engaging with local community groups, and treating the café as a neighbourhood institution rather than a hospitality business.',
      'Rent under $5,500/month. Glebe\'s revenue ceiling is lower than its neighbours, which means your cost base must also be lower to generate meaningful profit.',
      'A tight 7am–3pm operation with a focused menu — Glebe rewards consistency and quality over breadth. A café that does 6 things exceptionally well outperforms one that does 20 things adequately.',
      'A Saturday presence that captures the Glebe Point Farmers Market overflow — this single morning generates 25–35% above-average Saturday revenue for well-positioned cafés on Glebe Point Road.',
    ],
    failureScenarios: [
      'Opening with a high fit-out budget expecting Surry Hills-level revenue. Glebe\'s market cap is real — a $180,000 fit-out at a $16 average ticket requires years to recoup and limits your ability to respond to slow periods.',
      'Trying to position as a destination café — Glebe doesn\'t have the foot traffic for this model. The business must be built on regulars, not visitors.',
      'Ignoring the community dimension and operating as a pure hospitality business. Glebe customers disengage quickly from operators who don\'t invest in the neighbourhood relationship.',
      'Underestimating competition from the strong takeaway coffee market — Glebe has several strong options and the suburb\'s older demographic is particularly price-sensitive on coffee.',
    ],
    whatWouldMakeItBetter: [
      'A books-and-coffee hybrid positioning (following Sappho\'s model) or a partnership with one of Glebe\'s existing community institutions to create immediate neighbourhood credibility.',
      'A simple catering or office delivery program targeting Glebe\'s professional households and small businesses — this revenue is weekday-stable and insulated from café foot traffic variability.',
    ],
    metaTitle: 'Is Glebe Good for a Café? Sydney Inner West Intelligence | Locatalyze',
    metaDescription: 'Thinking of opening a café in Glebe, Sydney? Verdict: GO. Lower rent than Newtown, loyal local demographic, medium competition — here\'s the full breakdown.',
    relatedSuburbs: [
      { label: 'Café in Newtown',      suburbSlug: 'newtown',    citySlug: 'sydney', type: 'cafe' },
      { label: 'Café in Redfern',      suburbSlug: 'redfern',    citySlug: 'sydney', type: 'cafe' },
      { label: 'Café in Surry Hills',  suburbSlug: 'surry-hills',citySlug: 'sydney', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 35–58 covers/day at $14–18 average ticket, 6 trading days. Rent from Glebe Point Road listings Q1 2025. Staff: owner + 1 FT including Super. COGS 33%. Profit pre-tax, owner wage not drawn.',
    lastUpdated: 'Q1 2025',
  },

  // ── 7. CAFÉ · SYDNEY · REDFERN ──────────────────────────────────────────────
  'cafe/sydney/redfern': {
    suburb: 'Redfern', suburbSlug: 'redfern', city: 'Sydney', citySlug: 'sydney', state: 'NSW',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Redfern is one of Sydney\'s most compelling inner-city café opportunities right now. The gentrification wave is underway, rents haven\'t caught up with demand, and the suburb\'s proximity to the CBD creates strong weekday commuter trade. This is the window — it will close.',
    monthlyRevenue: { low: 30_000, high: 55_000 }, monthlyProfit: { low: 3_500, high: 12_000 },
    monthlyRent: { low: 4_000, high: 7_000 }, rentLevel: 'below-market',
    avgTicket: 17, dailyCustomersNeeded: 48, competitionLevel: 'medium', demandScore: 7,
    confidenceLevel: 'medium',
    confidenceNote: 'Redfern is a rapidly changing market. Rent estimates from commercial listings Q1 2025 but the market is moving fast. Treat as directional rather than precise.',
    suburbProfile: 'Redfern sits 2km south of Sydney CBD — historically underserviced, now in the middle of a significant gentrification cycle driven by its proximity to the CBD and its rail connection. The suburb\'s demographic is shifting from predominantly social housing and Indigenous community to a mix of young professionals, creative workers, and tech employees attracted by rents that are 20–30% below equivalent inner-city suburbs. The hospitality scene has emerged in the last five years and is still building.',
    demandAnalysis: 'Redfern\'s café demand is two-layered. The weekday morning commuter trade — Redfern station processes significant CBD-bound traffic — generates consistent 7–9am demand that rivals Surry Hills despite lower overall foot traffic. The second layer is the growing residential café culture among the new professional demographic who have moved in but haven\'t built brand loyalty to any existing operator. This is the opportunity window: a new café can build a regular base before competitors arrive. By 2026–2027, Redfern\'s café market will likely be as saturated as Newtown. Entry now captures the pre-saturation premium.',
    competitionAnalysis: 'Competition is medium and growing. The established operators (Single Origin Roasters\' Redfern café, several neighbourhood independents on Redfern Street) have built their base but the market is not yet saturated. There are clear gaps: no strong specialty coffee offering near Redfern Station, no café with a strong food program in the southern precinct, and no operator targeting the growing tech/creative demographic in the South Eveleigh precinct. The South Eveleigh innovation district — a 10-minute walk from Redfern Station — houses thousands of tech and creative workers who currently have limited food/coffee options nearby.',
    rentAnalysis: 'Redfern commercial rents remain below equivalent inner-Sydney suburbs at $4,000–$7,000/month. This discount reflects lagging perception rather than lagging fundamentals — the demographic and foot traffic data already support rents 20–30% higher. Operators signing leases now are locking in below-market rent at exactly the moment the suburb\'s hospitality demand is accelerating. At $5,500/month rent with 2 staff, fixed monthly costs run approximately $16,500. At $17 average ticket with 33% COGS, you need 1,454 customers/month — 48/day. Achievable in the current market, with meaningful upside as the suburb fills in.',
    customerBehavior: 'Redfern café customers span two distinct cohorts. The established community is price-sensitive and loyalty-driven — they respond to fair pricing and genuine community engagement. The incoming professional demographic is quality-driven and willing to pay $4.50 for a specialty flat white but less willing to pay $22 for a brunch plate — they benchmark against Surry Hills and Newtown. A café that serves both cohorts requires careful menu positioning: premium coffee, accessible food pricing. Don\'t try to be a $35 brunch venue in Redfern — the demographic is not there yet.',
    successConditions: [
      'Proximity to Redfern Station or the South Eveleigh precinct — foot traffic near the station is the highest-value location in the suburb right now and will appreciate significantly over the next 3 years.',
      'A lease locked in below $6,000/month before rent catches up with the suburb\'s hospitality reality — this window is likely 12–18 months.',
      'A coffee program that genuinely competes at the specialty level (quality roaster partnership, trained baristas) to capture the professional demographic who will form your high-frequency regular base.',
      'Community engagement with both Redfern\'s existing residents and the incoming demographic — the suburb\'s social history means operators who appear to be displacing the community rather than integrating with it face real reputational risk.',
    ],
    failureScenarios: [
      'Waiting 12 months before moving — Redfern\'s rent and competition will both have moved significantly, eliminating the current opportunity.',
      'Positioning exclusively as a premium café and alienating the existing community — the backlash in a suburb with Redfern\'s history can be severe and immediate.',
      'Opening near Redfern Station without solving the 7–9am throughput challenge — commuter trade demands fast service and efficient workflow that brunch-focused fit-outs often can\'t deliver.',
      'Underestimating the South Eveleigh distance — it is walkable but the 10-minute distance means you need to actively market to that cohort rather than capture them passively.',
    ],
    whatWouldMakeItBetter: [
      'A walk-up window or dedicated commuter line at Redfern Station — captures the 7–9am volume that the surrounding retail misses entirely due to format constraints.',
      'A corporate coffee account program targeting the South Eveleigh tenants (Atlassian, Accenture, and others in the precinct) — predictable B2B revenue from a demographic with high per-head spend.',
    ],
    metaTitle: 'Is Redfern Good for a Café? Sydney Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Redfern Sydney? Verdict: GO — rents haven\'t caught up with demand yet. Full demand analysis, rent range, break-even estimate, and timing insight.',
    relatedSuburbs: [
      { label: 'Café in Surry Hills', suburbSlug: 'surry-hills', citySlug: 'sydney', type: 'cafe' },
      { label: 'Café in Newtown',     suburbSlug: 'newtown',     citySlug: 'sydney', type: 'cafe' },
      { label: 'Restaurant in Redfern',suburbSlug: 'redfern',    citySlug: 'sydney', type: 'restaurant' },
    ],
    dataAssumptions: 'Revenue based on 38–62 covers/day at $15–19 average ticket, 6 trading days. Rent from Redfern Street and surrounding commercial listings Q1 2025. Staff: 2 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 8. CAFÉ · SYDNEY · BONDI ────────────────────────────────────────────────
  'cafe/sydney/bondi': {
    suburb: 'Bondi', suburbSlug: 'bondi', city: 'Sydney', citySlug: 'sydney', state: 'NSW',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'CAUTION',
    verdictSummary: 'Bondi has among the highest foot traffic and average tickets of any Sydney café market, but rent at the premium end is among the highest in Australia. The numbers only work with exceptional positioning — beachfront or Hall Street — and a concept built around the health-conscious, tourist-present demographic rather than against it.',
    monthlyRevenue: { low: 45_000, high: 90_000 }, monthlyProfit: { low: 2_000, high: 18_000 },
    monthlyRent: { low: 8_000, high: 18_000 }, rentLevel: 'premium',
    avgTicket: 22, dailyCustomersNeeded: 65, competitionLevel: 'saturated', demandScore: 9,
    confidenceLevel: 'high',
    confidenceNote: 'Bondi is one of Australia\'s most documented hospitality markets. Rent data from Bondi Junction and beachfront commercial listings Q1 2025.',
    suburbProfile: 'Bondi is Sydney\'s most internationally recognised suburb — a beachfront destination that generates year-round foot traffic from local residents, eastern suburbs professionals, and domestic and international tourists. The demographic spans affluent owner-occupiers (Campbell Parade, Curlewis Street) and younger renters (Hall Street corridor), united by a health-conscious, outdoor lifestyle that drives above-average café spend. Seasonality is real — summer trade can be 40–60% above winter.',
    demandAnalysis: 'Bondi café demand is the highest-volume, highest-average-ticket café market in Sydney. The combination of tourist foot traffic (year-round, with summer peak), an affluent local demographic willing to pay $24–28 for a brunch plate, and a health and fitness culture that drives 6am–9am coffee demand creates a revenue opportunity unmatched in comparable Sydney suburbs. The ceiling, however, is set by rent — Campbell Parade beachfront tenancies run $15,000–$18,000+/month, which demands 80+ customers/day at $22 average ticket just to cover fixed costs. The economics only work with exceptional volume or exceptional rent negotiation.',
    competitionAnalysis: 'Bondi is saturated at the café level. The Hall Street corridor alone has over 30 cafés within 500m. The operators who dominate — Three Blue Ducks, Porch & Parlour, Gertrude & Alice, and several international-brand-adjacent concepts — have established followings that are not easily displaced. The competitive gap that exists: the post-beach fitness market (5am–8am quick-service, protein-forward), the grab-and-go tourist market (high volume, lower ticket but no dwell time), and the genuine specialty coffee market (which Bondi underserves relative to its income level).',
    rentAnalysis: 'Bondi rent is the primary risk variable and the reason this market warrants CAUTION despite its demand. Campbell Parade and beachfront positions command $13,000–$18,000/month. Hall Street and secondary streets run $7,000–$11,000/month. At $10,000/month rent with 2.5 staff and overheads, fixed monthly costs run approximately $26,000. At $22 average ticket with 33% COGS, each customer contributes $14.74. You need 1,764 customers/month — 65/day — before profit. That is achievable in peak summer season and challenging in winter. Model the seasonal swing carefully before committing.',
    customerBehavior: 'Bondi café customers are the most diverse demographic of any Sydney suburb in terms of mixing locals, domestic visitors, and international tourists. Locals are loyalty-driven (once they choose their café, they are deeply committed); tourists are discovery-driven (they Google "best café Bondi" and choose from the top 5 results). A Bondi café strategy must serve both: a local regular base for revenue stability and a Google presence that captures the tourist discovery moment. Health-conscious positioning (plant-based options, açaí bowls, cold-pressed juices) is not a niche in Bondi — it is the expectation.',
    successConditions: [
      'A rent negotiated below $10,000/month outside of beachfront — the premium on a Campbell Parade address is real but not always justified by the additional foot traffic it generates vs Hall Street.',
      'A concept built for the 6am–10am window that serves the pre-beach and post-beach fitness crowd — this is the most underserved high-frequency segment in Bondi\'s café market.',
      'A Google Business profile optimised aggressively from day one — tourist discovery in Bondi is 80% Google Maps, not Instagram or word of mouth. Photos, reviews, and keyword visibility are operational priorities.',
      'A summer trading model that accumulates capital for the winter trough. Build the cash buffer in November–February that sustains the May–August slowdown without requiring owner capital injection.',
    ],
    failureScenarios: [
      'A premium beachfront lease above $15,000/month — the foot traffic premium does not justify the cost increase for a new operator without an established brand.',
      'A concept that ignores the health and fitness demographic. A traditional brunch-focused café with no plant-based options, no protein-forward menu items, and no cold brew loses 30–40% of Bondi\'s highest-frequency customers.',
      'Entering without modelling the seasonal revenue swing. Many Bondi operators fail not because they don\'t perform in summer but because they haven\'t reserved enough capital to survive winter.',
      'Underestimating the staff cost in a premium Sydney beachside suburb — experienced baristas and kitchen staff in Bondi command wages 10–15% above the Sydney inner-west average.',
    ],
    whatWouldMakeItBetter: [
      'A walk-up window or external service window for the beach-going crowd — throughput at peak summer hours on the promenade is the highest-value service format and cannot be achieved by a sit-down café alone.',
      'An evening partnership with an adjacent bar or restaurant for shared space revenue in the dead hours between 3pm–6pm, which in Bondi are consistently the weakest trading period.',
    ],
    metaTitle: 'Is Bondi Good for a Café? Sydney Beachside Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Bondi Beach Sydney? Verdict: CAUTION — high demand but premium rent. Full seasonal analysis, rent range $8k–$18k/month, break-even, and what works.',
    relatedSuburbs: [
      { label: 'Café in Surry Hills', suburbSlug: 'surry-hills', citySlug: 'sydney', type: 'cafe' },
      { label: 'Café in Newtown',     suburbSlug: 'newtown',     citySlug: 'sydney', type: 'cafe' },
      { label: 'Gym in Bondi',        suburbSlug: 'bondi',       citySlug: 'sydney', type: 'gym' },
    ],
    dataAssumptions: 'Revenue based on 55–90 covers/day at $19–25 average ticket, 7 trading days, with 40% seasonal variance. Rent from Bondi commercial listings Q1 2025. Staff: 2 FT + 2 casual including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 9. GYM · SYDNEY · BONDI ─────────────────────────────────────────────────
  'gym/sydney/bondi': {
    suburb: 'Bondi', suburbSlug: 'bondi', city: 'Sydney', citySlug: 'sydney', state: 'NSW',
    businessType: 'gym', businessLabel: 'Gym / Fitness Studio',
    verdict: 'GO',
    verdictSummary: 'Bondi is arguably the strongest fitness market in Australia — the lifestyle, demographic, and culture are perfectly aligned. The opportunity is in boutique studio formats (pilates, reformer, functional fitness) not in competing with the established big-box gyms on equipment volume.',
    monthlyRevenue: { low: 38_000, high: 80_000 }, monthlyProfit: { low: 5_000, high: 22_000 },
    monthlyRent: { low: 6_000, high: 12_000 }, rentLevel: 'above-market',
    avgTicket: 32, dailyCustomersNeeded: 42, competitionLevel: 'high', demandScore: 9,
    confidenceLevel: 'medium',
    confidenceNote: 'Boutique fitness market in Bondi is well-established. Revenue and membership estimates based on comparable Sydney boutique studio benchmarks and public pricing from Bondi operators.',
    suburbProfile: 'Bondi\'s fitness culture is not a demographic feature — it is the suburb\'s identity. The beach, the coastal walk, the concentration of personal trainers, nutritionists, and wellness practitioners, and a population that treats exercise as a social activity create demand for fitness that is unmatched in metropolitan Sydney. The average Bondi resident spends significantly more on fitness per month than any comparable Sydney postcode.',
    demandAnalysis: 'Fitness demand in Bondi is consistent year-round with a summer uplift. The primary demand segments: boutique group fitness (reformer pilates, HIIT, yoga) where sessions are social and Instagram-visible; personal training and semi-private small group training; and specialist modalities (breathwork, recovery, infrared sauna) that are emerging as premium wellness categories. A boutique studio running 8–12 classes per day at $35–45/session with a capacity of 10–14 participants can generate $28,000–$55,000/month at 70–85% class fill rates — achievable in Bondi within 6–12 months for a well-positioned concept.',
    competitionAnalysis: 'The Bondi boutique fitness market is competitive (Barry\'s, F45 franchises, multiple reformer pilates studios) but not saturated in the same way the café market is. The differentiation axis in fitness is format and community rather than product — a studio with a strong instructor identity and community culture builds switching costs that café customers do not have. The emerging gap: recovery-focused concepts (ice bath, infrared, contrast therapy) and hybrid strength-conditioning boutiques that don\'t exist in a premium format in Bondi yet.',
    rentAnalysis: 'Gym and studio tenancies require more space than cafés — typically 150–300sqm for a viable boutique studio. At this scale, Bondi rents run $6,000–$12,000/month depending on location and fit-out state. The key consideration: back-street or upper-floor locations run 30–40% below street-level equivalents and often perform equally well for fitness studios, where customers come specifically rather than discovering by walking past. At $8,000/month rent and $28,000 total fixed costs (including equipment loan servicing), at $32/session average you need 875 sessions/month — 42/day — across 7 days. At 12 classes/day × 10 participants that is 35% average class fill rate. A GO scenario.',
    customerBehavior: 'Bondi fitness customers are willing to pay premium for quality but are highly sensitive to instructor quality and class experience consistency. A studio where the lead instructor is present and engaged builds strong loyalty; a studio where sessions are taught by rotational casuals sees significantly higher churn. The social dimension is critical — Bondi fitness customers join a community as much as they buy a service. Instagram visibility (class photos, instructor profiles) is a genuine acquisition channel in this market in a way that it isn\'t for retail or hospitality.',
    successConditions: [
      'A studio format that is differentiated from the existing F45/Barry\'s/reformer pilates offer — functional strength, recovery modalities, or a specialist discipline that the suburb doesn\'t currently have at a quality level.',
      'A founding instructor with an existing Bondi social following — the first 50 members of a Bondi fitness studio typically come from the instructor\'s network, not from cold acquisition.',
      'A back-street or upper-floor location that keeps rent under $9,000/month — boutique fitness customers will walk upstairs or 200m off the main street for a studio with the right culture.',
      'A membership model with pre-sold founding memberships before opening — this validates demand, generates upfront capital to offset fit-out, and creates the community launch momentum that boutique fitness lives on.',
    ],
    failureScenarios: [
      'A generic boutique HIIT or pilates studio without a clear identity or instructor brand — Bondi already has these and the established players have the reviews and the regulars.',
      'Overinvestment in equipment and fit-out without pre-selling memberships. Boutique fitness fit-out costs in Bondi run $150,000–$350,000 — without pre-sold members, this capital sits at risk for 12+ months.',
      'Hiring exclusively casual or rotational instructors to reduce costs — the single fastest way to destroy retention in a boutique fitness business.',
      'Opening in competition with a big-box gym on volume and price rather than on experience and community. Competing with a $25/month gym on a $35/class model requires a quality gap that is obvious to every customer within the first session.',
    ],
    whatWouldMakeItBetter: [
      'A recovery and wellness add-on service (infrared sauna, ice bath, compression therapy) that members can book alongside classes — this increases average monthly spend per member from $150 to $250+ without proportional cost increase.',
      'A corporate wellness partnership with the eastern suburbs professional firms — many Bondi-adjacent businesses have wellness budgets that go unspent because no local studio has built a corporate program.',
    ],
    metaTitle: 'Is Bondi Good for a Gym or Fitness Studio? Sydney Fitness Market Intelligence | Locatalyze',
    metaDescription: 'Opening a gym or fitness studio in Bondi? Verdict: GO. Strongest fitness market in Sydney — but boutique format only. Full demand analysis, rent range, and break-even.',
    relatedSuburbs: [
      { label: 'Café in Bondi',          suburbSlug: 'bondi',       citySlug: 'sydney', type: 'cafe' },
      { label: 'Gym in Surry Hills',     suburbSlug: 'surry-hills', citySlug: 'sydney', type: 'gym' },
      { label: 'Fitness in Newtown',     suburbSlug: 'newtown',     citySlug: 'sydney', type: 'gym' },
    ],
    dataAssumptions: 'Revenue based on 8–14 classes/day × 10–14 participants at $30–38/session, 7 days, 70–85% fill rate. Rent from Bondi commercial listings 150–300sqm Q1 2025. Staff: 2 FT instructors + casuals. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 10. CAFÉ · MELBOURNE · FITZROY ──────────────────────────────────────────
  'cafe/melbourne/fitzroy': {
    suburb: 'Fitzroy', suburbSlug: 'fitzroy', city: 'Melbourne', citySlug: 'melbourne', state: 'VIC',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'CAUTION',
    verdictSummary: 'Fitzroy is the epicentre of Melbourne\'s café culture — and that is precisely the problem. Operating here means competing directly against the operators who define Australian café standards globally. The market is real but the bar is extraordinarily high, and rent has followed.',
    monthlyRevenue: { low: 36_000, high: 70_000 }, monthlyProfit: { low: 1_500, high: 12_000 },
    monthlyRent: { low: 6_000, high: 12_000 }, rentLevel: 'premium',
    avgTicket: 18, dailyCustomersNeeded: 58, competitionLevel: 'saturated', demandScore: 9,
    confidenceLevel: 'high',
    confidenceNote: 'Fitzroy is one of Australia\'s most extensively documented café markets. Data from Smith Street and Brunswick Street commercial listings, VIC hospitality industry benchmarks, ABS 2021 Census.',
    suburbProfile: 'Fitzroy sits 2km north of Melbourne CBD — the suburb that, arguably more than any other in Australia, shaped what a specialty café looks like. Brunswick Street and Smith Street have produced some of Australia\'s most celebrated operators and are internationally referenced as benchmarks. The demographic is younger, renter-heavy, creatively employed, and café-literate to a degree that demands constant quality and punishes complacency immediately.',
    demandAnalysis: 'Café demand in Fitzroy is among the highest in Australia in terms of both volume and average ticket. A $18–22 average ticket is achievable because the customer base expects to pay for quality and understands the difference between good and great coffee. The problem — as in Surry Hills — is that this demand is absorbed by an extremely dense existing operator landscape. The daily foot traffic on Brunswick Street and Smith Street is genuine, but converting it away from established loyalties is the challenge. The opportunity in Fitzroy is not in the primary strips but in secondary streets and laneways adjacent to them, where rent is 30–40% lower and foot traffic is still meaningful.',
    competitionAnalysis: 'Fitzroy is home to some of Australia\'s most influential café operators — Proud Mary, Patricia, Brother Baba Budan (adjacent in the CBD), and dozens of highly-regarded neighbourhood cafés. The competition is not just local — it is the global reference point for what a specialty café should be. Operating here requires a product and experience that can genuinely stand alongside these benchmarks, not a café that is "good for its price point." There are no available gaps in the generic quality café category. What exists: a gap in extended-hours quality espresso (most Fitzroy cafés close by 4pm), in a café with a serious natural wine and espresso hybrid format, and in a café-retail concept with a genuinely curated offer.',
    rentAnalysis: 'Brunswick Street and Smith Street command $8,000–$12,000/month for viable tenancies. Secondary Fitzroy streets (Gertrude Street, Gore Street, side streets off Brunswick) run $5,500–$8,000/month. At $8,000/month rent with 2 FT and 2 casual staff, fixed monthly costs run approximately $20,500. At $18 average ticket with 33% COGS, you need 1,747 customers/month — 58/day — before profit. The secondary street option at $6,000/month reduces this to 44/day — a much more achievable target.',
    customerBehavior: 'Fitzroy café customers are the most demanding in Australia, not in terms of behaviour but in terms of standard. They have spent years calibrating their palate against the best operators and they notice instantly when something is below par — coffee extraction, milk texture, bread quality, service rhythm. They are deeply loyal to cafés that earn their trust and completely disengaged from those that don\'t. Social media is a genuine discovery channel here, but execution is the retention channel. Fitzroy customers talk — both positively and negatively — and the word-of-mouth network in this suburb moves faster than in any equivalent Australian market.',
    successConditions: [
      'A secondary street location at rent below $7,500/month — the economics of a primary strip position in Fitzroy require exceptional volume that a new operator cannot achieve in the first 12–18 months.',
      'A product concept that has a specific, articulable point of view that cannot be experienced elsewhere in Fitzroy — a roasting partnership with a specific origin, a food program built around a specific cuisine tradition, or a format that does not currently exist in the suburb.',
      'A head barista or founder with an existing Fitzroy coffee community presence. Cold entry without a network in this suburb is significantly harder than in any other Australian café market.',
      'A realistic 3-year financial model that accounts for the 12–18 month customer acquisition period before a new Fitzroy café achieves stable revenue — the market rewards patience but it does not give fast returns.',
    ],
    failureScenarios: [
      'Opening on Brunswick Street or Smith Street with a $9,000/month lease and a quality-first-but-undifferentiated concept — this is the most expensive and most common failure pattern in this market.',
      'Underestimating the customer acquisition timeline. Building a Fitzroy regular base takes 18–24 months. An operator who burns through capital in months 6–12 expecting Newtown-speed payback will fail.',
      'A fit-out that reads as derivative of existing Fitzroy aesthetics — the market recognises a Scandi-minimal café with exposed brick and batch brew, and it is not excited by another one.',
      'Ignoring the evening opportunity. Most Fitzroy cafés close at 4pm. An operator willing to run quality espresso service until 8–9pm captures an entirely underserved segment with zero direct competition.',
    ],
    whatWouldMakeItBetter: [
      'A natural wine and espresso bar format (6am–10pm, coffee in the morning, wine in the evening, open kitchen for light food all day) — there is no credible version of this in Fitzroy despite obvious demand.',
      'A collaboration with Melbourne\'s specialty roasting community (Market Lane, St Ali, Dukes) to create an event-based offering (cuppings, producer visits, workshops) that builds community and media coverage simultaneously.',
    ],
    metaTitle: 'Is Fitzroy Good for a Café? Melbourne Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Fitzroy Melbourne? Verdict: CAUTION — world-class demand but a ferociously competitive market. Full analysis, rent range, and what it actually takes.',
    relatedSuburbs: [
      { label: 'Café in Collingwood', suburbSlug: 'collingwood', citySlug: 'melbourne', type: 'cafe' },
      { label: 'Restaurant in Fitzroy',suburbSlug: 'fitzroy',    citySlug: 'melbourne', type: 'restaurant' },
      { label: 'Café in Richmond',    suburbSlug: 'richmond',   citySlug: 'melbourne', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 45–72 covers/day at $16–20 average ticket, 6 trading days. Rent from Brunswick Street and Smith Street commercial listings Q1 2025. Staff: 2 FT + 2 casual including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 11. RESTAURANT · MELBOURNE · FITZROY ────────────────────────────────────
  'restaurant/melbourne/fitzroy': {
    suburb: 'Fitzroy', suburbSlug: 'fitzroy', city: 'Melbourne', citySlug: 'melbourne', state: 'VIC',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'GO',
    verdictSummary: 'Fitzroy\'s restaurant market is more navigable than its café market — the competition is high-quality but the category landscape has genuine gaps, rent on secondary streets is workable, and the demographic will reward a concept that has something genuine to say.',
    monthlyRevenue: { low: 55_000, high: 120_000 }, monthlyProfit: { low: 5_000, high: 24_000 },
    monthlyRent: { low: 5_500, high: 11_000 }, rentLevel: 'above-market',
    avgTicket: 68, dailyCustomersNeeded: 36, competitionLevel: 'high', demandScore: 9,
    confidenceLevel: 'high',
    confidenceNote: 'Fitzroy restaurant market well-documented. Data from VIC commercial listings, ABS income data for Fitzroy SA2, and VIC hospitality industry benchmarks.',
    suburbProfile: 'Fitzroy\'s restaurant demographic is affluent, food-literate, and restaurant-loyal in a way that most Australian suburbs are not. The suburb has produced restaurants of national and international significance and the local customer base expects that standard. Average household income for Fitzroy renters (predominantly 25–40) sits above the Melbourne median despite rental costs. Eating out is a cultural priority, not an occasional treat.',
    demandAnalysis: 'Restaurant demand in Fitzroy is strong Thursday–Saturday evening and growing on Tuesday and Wednesday as the suburb\'s professional demographic ages into more consistent weeknight dining habits. The natural wine and share-plate format has become the defining category of Fitzroy dining — Longsong, Embla-adjacent concepts, and several Gertrude Street operators have established this as the dominant dining language. The gaps: a credible Japanese or Korean tasting menu format at $80–110/head, a serious wood-fire grill concept, and a restaurant that operates a genuine set lunch program for the suburb\'s creative and professional workforce.',
    competitionAnalysis: 'Fitzroy has several genuinely world-class restaurants (Cutler & Co, Marion Wine Bar, Embla\'s influence) and a dense layer of excellent neighbourhood operators. The competition is real and the quality floor is high. However, category gaps exist: the ramen and Japanese noodle format is underrepresented, there is no credible wood-fire bakery-restaurant concept, and the $60–80/head casual fine dining segment has meaningful room for a focused operator with a clear cuisine identity. Success in Fitzroy\'s restaurant market is about having a specific point of view, not about being generally good.',
    rentAnalysis: 'Fitzroy restaurant tenancies on Brunswick Street and Smith Street run $8,000–$11,000/month. Gertrude Street and secondary positions run $5,500–$8,000/month — meaningfully different economics for the same demographic catchment. At $7,500/month rent with 3 FT and 3 casual staff, fixed monthly costs run approximately $36,000. At $68 average ticket and 35% COGS, each cover contributes $44.20. You need 815 covers/month — 36/trading day across 6 days. A well-positioned Fitzroy restaurant achieves 60–100 covers on peak nights.',
    customerBehavior: 'Fitzroy restaurant customers are some of Australia\'s most sophisticated diners. They read Broadsheet, they follow restaurant-adjacent Instagram accounts, they know which sommelier is at which restaurant, and they form strong loyalties quickly. Discovery is primarily through Broadsheet Melbourne coverage and word-of-mouth within the suburb\'s dense social network. A Broadsheet review within 6 months of opening is transformative in this market; absence from Broadsheet coverage for 12 months is a meaningful signal of market position. Quality consistency is non-negotiable — Fitzroy diners are unforgiving of a bad experience at a restaurant they\'ve recommended to others.',
    successConditions: [
      'A specific cuisine identity that Fitzroy doesn\'t already have at the quality level the market expects — Japanese, Korean, Levantine, or a serious wood-fire concept would each have room to establish.',
      'A Gertrude Street or secondary-street location under $8,000/month — the economics of a secondary position in Fitzroy are meaningfully better than a Brunswick Street premium address for a new entry.',
      'A natural wine list that is genuinely curated rather than assembled — Fitzroy diners will call out a generic natural wine list and the absence of real curation is visible within one visit.',
      'Press strategy from day one — a Broadsheet Melbourne feature within 3 months of opening is worth 6 months of Instagram growth and significantly accelerates the regulars acquisition curve.',
    ],
    failureScenarios: [
      'A generic share-plate and natural wine format that replicates what 15 other Fitzroy restaurants already offer — the market is not looking for another version of what it already has.',
      'Premium pricing without the backing reputation. $110/head tasting menus in Fitzroy require the credibility of a known chef or a specific origin story that justifies the price. Cold entry at that price point will fail.',
      'Ignoring the lunch opportunity. Fitzroy\'s creative and professional workforce generates consistent midday demand that most dinner-focused operators leave entirely on the table.',
      'Underestimating the Broadsheet effect in both directions — a critical Broadsheet review of a new Fitzroy restaurant can permanently damage the reputation before the operator has had time to address the issues.',
    ],
    whatWouldMakeItBetter: [
      'A lunch program on Thursday and Friday targeting the suburb\'s creative workforce — a focused 3-course set menu at $55 with wine builds the midweek regular base that dinner-only restaurants can\'t access.',
      'A collaboration with one of Melbourne\'s significant natural wine importers to build a cellar list with genuine producer backstories — the Fitzroy diner has heard the "small producer, minimal intervention" story and is no longer impressed by the generic version of it.',
    ],
    metaTitle: 'Is Fitzroy Good for a Restaurant? Melbourne Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Fitzroy Melbourne? Verdict: GO — but only with a specific concept. Demand score 9/10, rent analysis, and what the Fitzroy dining market actually wants.',
    relatedSuburbs: [
      { label: 'Café in Fitzroy',          suburbSlug: 'fitzroy',    citySlug: 'melbourne', type: 'cafe' },
      { label: 'Restaurant in Collingwood',suburbSlug: 'collingwood',citySlug: 'melbourne', type: 'restaurant' },
      { label: 'Restaurant in Prahran',    suburbSlug: 'prahran',    citySlug: 'melbourne', type: 'restaurant' },
    ],
    dataAssumptions: 'Revenue based on 35–70 covers/service, 2 services Friday–Saturday, 1 service Tuesday–Thursday, $60–75 average ticket. Rent from Fitzroy commercial listings Q1 2025. Staff: 3 FT + 3 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 12. RESTAURANT · MELBOURNE · PRAHRAN ────────────────────────────────────
  'restaurant/melbourne/prahran': {
    suburb: 'Prahran', suburbSlug: 'prahran', city: 'Melbourne', citySlug: 'melbourne', state: 'VIC',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'GO',
    verdictSummary: 'Prahran\'s restaurant market is underrated relative to its income level and population density. Chapel Street has a mixed reputation but the eastern side of Prahran — High Street, Commercial Road — has a loyal, high-spending demographic that is currently underserved for quality casual dining.',
    monthlyRevenue: { low: 50_000, high: 100_000 }, monthlyProfit: { low: 5_000, high: 20_000 },
    monthlyRent: { low: 5_000, high: 9_500 }, rentLevel: 'at-market',
    avgTicket: 65, dailyCustomersNeeded: 35, competitionLevel: 'medium', demandScore: 7,
    confidenceLevel: 'medium',
    confidenceNote: 'Prahran restaurant market data from VIC commercial listings and inner-south Melbourne hospitality benchmarks. Chapel Street\'s volatility means estimates carry higher uncertainty than more stable precincts.',
    suburbProfile: 'Prahran sits 4km south of Melbourne CBD — a diverse, affluent inner-south suburb straddling the Stonnington and Port Phillip council areas. Chapel Street is its primary commercial strip, known for fashion retail and hospitality but with a reputation for high-vacancy rates in recent years as the retail mix has evolved. The suburb\'s residential density is high — median household income for Prahran\'s owner-occupier demographic sits above $120,000 — and the evening hospitality demand is strong and consistent.',
    demandAnalysis: 'Prahran\'s restaurant demand is driven by its affluent residential base and its position between South Yarra (which anchors the premium dining market) and Windsor (which has the neighbourhood casual market). The Prahran Market on Commercial Road is a meaningful demand anchor — it draws food-motivated residents from a wide catchment and creates a food culture that benefits surrounding hospitality. Friday and Saturday dinner are the primary revenue windows; Thursday is growing as the suburb\'s professional demographic eats out more frequently midweek. A quality casual restaurant at $60–75/head occupies the sweet spot between South Yarra fine dining and pub food.',
    competitionAnalysis: 'Chapel Street\'s restaurant market is competitive but not saturated in the way Fitzroy or Surry Hills is. The strip has seen significant operator turnover in the past five years, which means the loyal customer base is looking for quality replacement operators. The gaps: modern Asian (the Prahran demographic has strong appetite for elevated Japanese and Korean dining that isn\'t currently available within walking distance), serious wine bar concepts, and quality set-menu dinner formats at $70–90/head.',
    rentAnalysis: 'Chapel Street rents have corrected from peak levels as the retail mix has shifted. Viable restaurant tenancies run $5,500–$9,500/month depending on size and position. Commercial Road and High Street secondary positions run $4,500–$7,000/month with equivalent access to the Prahran residential catchment. At $7,000/month rent with 3 staff and overheads, fixed monthly costs run approximately $34,000. At $65 average ticket and 35% COGS, each cover contributes $42.25. You need 805 covers/month — 35/trading day.',
    customerBehavior: 'Prahran restaurant customers are sophisticated but not avant-garde. They appreciate quality and pay for it, but they are dining for pleasure rather than to engage with a culinary experiment. The South Yarra and Prahran demographic responds well to warm, polished service; a professional-but-not-stuffy floor experience is the target. Discovery is primarily through word of mouth and Google reviews among this demographic — paid social advertising has limited ROI here, whereas a strong Zomato and Google review profile is genuinely influential.',
    successConditions: [
      'A quality-casual positioning at $60–75/head that occupies the gap between South Yarra fine dining and the pub food options on the Chapel Street strip.',
      'A concept in the modern Asian or wine bar category that doesn\'t currently have a quality incumbent in Prahran — the demographic actively seeks this and will travel within 2km for it.',
      'Rent below $7,500/month with a 5-year term — Prahran\'s stability makes a longer lease less risky than a transitional precinct, and locking in below the market median is the primary lever on long-run profitability.',
      'A proximity to the Prahran Market with an ingredient story — sourcing from market stallholders and communicating this is a Prahran-specific narrative that resonates deeply with the food-motivated resident demographic.',
    ],
    failureScenarios: [
      'A high-end tasting menu format on Chapel Street without an established chef profile — the Prahran market has been disappointed by aspirational dining concepts before and is cautious about unknown operators charging fine dining prices.',
      'Positioning on the western end of Chapel Street where vacancy rates and foot traffic are weakest — the eastern precincts (Commercial Road, High Street end) perform better for destination dining.',
      'Ignoring the Prahran Market connection — operating a restaurant in Prahran without engaging the Market as a community anchor misses the most distinctive marketing asset in the suburb.',
      'Underestimating the South Yarra competition just 800m away — Prahran customers will drive or walk to South Yarra for a better dining experience, which means the quality bar is set by what South Yarra offers.',
    ],
    whatWouldMakeItBetter: [
      'A Saturday set lunch program aligned with the Prahran Market trading day — the market draws 2,000+ visitors on Saturday and a restaurant with a 12pm–3pm set menu and market ingredient story captures a pre-existing high-intent food audience.',
      'A private dining function for the suburb\'s professional demographic — Prahran has significant corporate residents (lawyers, finance professionals, medical practitioners) who entertain clients and require quality, private, local options.',
    ],
    metaTitle: 'Is Prahran Good for a Restaurant? Melbourne Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Prahran Melbourne? Verdict: GO — underrated market, high-income demographic, medium competition. Full analysis and rent range.',
    relatedSuburbs: [
      { label: 'Restaurant in Fitzroy',    suburbSlug: 'fitzroy',    citySlug: 'melbourne', type: 'restaurant' },
      { label: 'Restaurant in South Yarra',suburbSlug: 'south-yarra',citySlug: 'melbourne', type: 'restaurant' },
      { label: 'Café in Prahran',          suburbSlug: 'prahran',    citySlug: 'melbourne', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 35–65 covers/service, 2 services Friday–Saturday, 1 service Tuesday–Thursday, $58–72 average ticket. Rent from Chapel Street commercial listings Q1 2025. Staff: 2 FT + 3 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 13. RESTAURANT · PERTH · FREMANTLE ──────────────────────────────────────
  'restaurant/perth/fremantle': {
    suburb: 'Fremantle', suburbSlug: 'fremantle', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'GO',
    verdictSummary: 'Fremantle is Perth\'s most distinctive dining destination — the port heritage, the tourist overlay, and a locally loyal food culture create consistent year-round demand that few Perth suburbs match. The rent economics are significantly below east-coast equivalents. The right concept has clear room.',
    monthlyRevenue: { low: 50_000, high: 105_000 }, monthlyProfit: { low: 6_000, high: 24_000 },
    monthlyRent: { low: 4_000, high: 7_500 }, rentLevel: 'at-market',
    avgTicket: 70, dailyCustomersNeeded: 34, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Fremantle is a well-established restaurant market. Data from WA commercial listings, Fremantle council tourism data, and WA hospitality industry benchmarks.',
    suburbProfile: 'Fremantle sits 19km southwest of Perth CBD — Western Australia\'s historic port city with a distinct cultural identity that is far more bohemian and independent than most Perth suburbs. The population is a mix of long-term Fremantle identities, younger creative residents attracted by the suburb\'s character, and an international student population from Notre Dame University. The Fishing Boat Harbour precinct, South Terrace, and the cappuccino strip are the primary hospitality destinations.',
    demandAnalysis: 'Fremantle\'s restaurant demand has two layers: a strong local regular base (the suburb\'s population eats and drinks locally with genuine loyalty to the precinct) and a tourism overlay — domestic and international visitors making a Fremantle day trip as part of a Perth visit. The Fishing Boat Harbour is the highest-volume tourist dining location but with the lowest margins (tourist volume requires large format, high throughput operations). The better opportunity is on South Terrace and High Street — genuine destination dining for an experienced Fremantle food customer at $65–85/head. Demand is strong across the week, with weekend and public holiday peaks that reflect the tourist overlay.',
    competitionAnalysis: 'Fremantle\'s restaurant market has quality leaders (Bread in Common, Strange Company, Little Creatures precinct) but identifiable gaps. The Japanese and Korean category is underrepresented. There is no credible plant-forward concept. The fine dining segment ($100+/head) is absent despite the demographic capacity to support it. Operators from Subiaco and Leederville considering Fremantle should note: the suburb rewards operators who understand Fremantle\'s cultural identity — independent, character-driven, not corporate — and penalises those that don\'t.',
    rentAnalysis: 'South Terrace and High Street restaurant tenancies run $4,500–$7,500/month — below Perth equivalents in Subiaco and Leederville and dramatically below east-coast equivalents. The Fishing Boat Harbour tourist precinct commands a premium for high-volume formats ($7,000–$11,000/month) but these are large-format operations. The economics of a 60–80 seat restaurant at $5,500/month rent in Fremantle are genuinely attractive: with 3 staff and standard overheads, fixed monthly costs run approximately $30,000. At $70 average ticket and 35% COGS, each cover contributes $45.50. You need 660 covers/month — 34/trading day — across 5–6 trading days.',
    customerBehavior: 'Fremantle restaurant customers are independent-business loyalists with a strong "buy local, stay local" ethic. They will not support a chain or franchise format in Fremantle — the suburb has an almost cultural immune system against this. They respond to provenance storytelling (where the fish came from, which producer grew the vegetables), to creative menus that change with season, and to service that treats them as community members rather than tourists. Discovery is through Fremantle\'s active word-of-mouth network — the suburb has a strong community of food-motivated locals who communicate via local Facebook groups, community media, and direct recommendation.',
    successConditions: [
      'A concept that is genuinely Fremantle in spirit — independent, character-driven, with a connection to the port heritage or the local produce catchment. A restaurant that could be in any city will struggle here.',
      'South Terrace or High Street positioning at rent below $6,500/month — the Fishing Boat Harbour premium is only justified for high-volume tourist formats.',
      'A seafood-forward or Western Australian produce-led menu — Fremantle\'s proximity to fresh seafood and the South-West produce region is an unambiguous competitive advantage that the best operators fully exploit.',
      'A genuine relationship with the Fremantle Market and local producers — the community connection this creates is marketing, sourcing advantage, and differentiation simultaneously.',
    ],
    failureScenarios: [
      'A tourist-oriented format on the Fishing Boat Harbour that competes on volume and price with the established large operators — the established players have scale and tourist recognition that a new operator cannot replicate without years of marketing spend.',
      'A concept that reads as generic or corporate in a suburb whose identity is built on independence and character. Fremantle customers are adept at spotting inauthenticity.',
      'Underestimating the Fremantle winds — outdoor dining is the preferred format but the sea wind makes outdoor service operationally challenging 30–40% of the year. Plan your layout with wind mitigation built in.',
      'Not engaging the Notre Dame University student demographic — 7,000+ students within walking distance represent consistent low-ticket weekday lunch and coffee demand that premium restaurants often ignore.',
    ],
    whatWouldMakeItBetter: [
      'A set lunch program Tuesday–Friday targeting the Notre Dame University academic staff and surrounding Fremantle professional services — a 2-course set at $45 fills a gap the premium Fremantle market leaves open.',
      'A Sunday market day extended trading and farmers market partnership — the Fremantle Markets draw significant weekend foot traffic and a restaurant with market-adjacent visibility and a shared producer story captures this organically.',
    ],
    metaTitle: 'Is Fremantle Good for a Restaurant? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Fremantle Perth? Verdict: GO — strong demand, below-market rent, identifiable gaps. Full analysis and what Fremantle diners actually respond to.',
    relatedSuburbs: [
      { label: 'Restaurant in Subiaco',    suburbSlug: 'subiaco',    citySlug: 'perth', type: 'restaurant' },
      { label: 'Restaurant in Leederville',suburbSlug: 'leederville',citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Fremantle',        suburbSlug: 'fremantle',  citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 35–70 covers/service, 2 services Friday–Saturday, 1 service Tuesday–Thursday, $62–78 average ticket. Rent from South Terrace and High Street commercial listings Q1 2025. Staff: 2 FT + 4 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 14. CAFÉ · PERTH · FREMANTLE ────────────────────────────────────────────
  'cafe/perth/fremantle': {
    suburb: 'Fremantle', suburbSlug: 'fremantle', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Fremantle\'s café market is one of Perth\'s strongest — genuine local demand, below-Subiaco rent, and a cultural identity that rewards quality independent operators. Competition exists but has not reached Sydney or Melbourne saturation levels. There is real room for the right concept.',
    monthlyRevenue: { low: 30_000, high: 58_000 }, monthlyProfit: { low: 3_500, high: 13_000 },
    monthlyRent: { low: 3_500, high: 6_500 }, rentLevel: 'below-market',
    avgTicket: 17, dailyCustomersNeeded: 44, competitionLevel: 'medium', demandScore: 7,
    confidenceLevel: 'high',
    confidenceNote: 'Fremantle café market well-documented relative to its size. Data from WA commercial listings and Perth hospitality benchmarks.',
    suburbProfile: 'Fremantle\'s café culture is authentic rather than aspirational — the suburb has a genuine café identity that predates the specialty coffee movement and has evolved with it. The cappuccino strip on South Terrace is historically significant in Australian café culture, and the suburb\'s demographic (bohemian, independent-minded, food-motivated) continues to support quality independent café operators.',
    demandAnalysis: 'Fremantle café demand is strong and consistent. The suburb\'s walkability, the tourist overlay (domestic day-trippers, international visitors at the market), and a local population that treats café culture as a community ritual rather than a convenience create reliable 7-day demand. Average ticket of $15–18 is in line with Perth norms. Weekend demand peaks significantly, driven by the Fremantle Markets and the Fishing Boat Harbour. Morning trade is strong from the Notre Dame student and staff population on weekdays.',
    competitionAnalysis: 'Fremantle has established café operators (Ootong & Lincoln, Gino\'s, various South Terrace stalwarts) but the market is not saturated at the specialty level. The quality gap between the suburb\'s best and its average operators is significant. There is room for a specialty coffee-focused operator with a serious single-origin program and a quality food offer in a secondary position at below-cappuccino-strip rent. The suburb\'s cultural identity will reward authenticity and penalise corporate or generic positioning.',
    rentAnalysis: 'South Terrace and the cappuccino strip run $4,500–$6,500/month. Secondary streets (High Street, Marine Terrace, Adelaide Street) run $3,000–$5,000/month. At $5,000/month rent with 2 staff, fixed monthly costs run approximately $14,500. At $17 average ticket with 33% COGS, you need 1,279 customers/month — 44/day. This is very achievable in Fremantle\'s regular café market and is well below what the leading South Terrace operators achieve.',
    customerBehavior: 'Fremantle café customers are loyal to operators who are genuinely embedded in the community. They are not searching for the newest or most Instagrammable option — they want quality, consistency, and the feeling that the café owner knows who they are. This makes Fremantle an excellent market for an owner-operator model where the quality of the hospitality experience is directly tied to the presence of the owner. Morning regulars once established are extremely sticky.',
    successConditions: [
      'A secondary street location at rent below $5,000/month with access to the morning foot traffic patterns — not on the cappuccino strip, but within 200m of it.',
      'An owner-operator model that builds genuine community relationships — Fremantle rewards operators who show up personally more than any other Perth suburb.',
      'A specialty coffee program with a genuine roaster story — Fremantle\'s café customers are increasingly coffee-literate and the gap between the suburb\'s leading and average coffee quality is an opportunity.',
      'A food program aligned with local producers — Fremantle\'s strong farmers market culture means ingredient provenance is noticed and valued.',
    ],
    failureScenarios: [
      'A premium cappuccino strip position at $6,500+/month for a new operator — the competition from established stalwarts at that rent level is severe.',
      'A corporate or chain-adjacent aesthetic in a suburb that is culturally built around independent businesses.',
      'Ignoring the tourist dimension entirely. Fremantle has a genuine tourist market that passes through the cappuccino strip — operators who are not positioned for some level of tourist capture are leaving meaningful revenue uncaptured.',
      'Underestimating the sea wind\'s impact on outdoor seating — Fremantle\'s famous Doctor wind makes outdoor service operationally difficult and affects customer experience 30–40% of the year.',
    ],
    whatWouldMakeItBetter: [
      'A collaboration with the Fremantle Markets for a branded stall or pop-up on market days — this builds awareness and customer trial among the market\'s significant weekend crowd at low cost.',
      'An evening café extension (espresso, light food, local wine) — Fremantle\'s evening culture is strong but quality espresso after 4pm is almost entirely unavailable on the strip.',
    ],
    metaTitle: 'Is Fremantle Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Fremantle Perth? Verdict: GO — genuine local demand, below-market rent, medium competition. Full analysis and what makes Fremantle cafés succeed.',
    relatedSuburbs: [
      { label: 'Restaurant in Fremantle', suburbSlug: 'fremantle',  citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Subiaco',         suburbSlug: 'subiaco',    citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Leederville',     suburbSlug: 'leederville',citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 38–65 covers/day at $14–19 average ticket, 7 trading days. Rent from South Terrace and secondary street listings Q1 2025. Staff: 2 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 15. CAFÉ · PERTH · LEEDERVILLE ──────────────────────────────────────────
  'cafe/perth/leederville': {
    suburb: 'Leederville', suburbSlug: 'leederville', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Leederville\'s Oxford Street strip is one of Perth\'s best-performing café precincts — strong local demographic, below-Subiaco rent, and medium competition that hasn\'t yet reached saturation. This is the Perth café market equivalent of Redfern: a strong opportunity that is still open.',
    monthlyRevenue: { low: 32_000, high: 60_000 }, monthlyProfit: { low: 4_000, high: 14_000 },
    monthlyRent: { low: 3_500, high: 6_500 }, rentLevel: 'at-market',
    avgTicket: 17, dailyCustomersNeeded: 42, competitionLevel: 'medium', demandScore: 7,
    confidenceLevel: 'high',
    confidenceNote: 'Leederville is a well-documented Perth hospitality precinct. Data from Oxford Street commercial listings and WA hospitality benchmarks.',
    suburbProfile: 'Leederville sits 3km north of Perth CBD — an inner-suburban precinct anchored by Oxford Street, one of Perth\'s consistently performing hospitality strips. The demographic is a mix of young professionals, creatives, and established families with a median age of 33 and household income above the Perth median. The suburb has a strong community identity and its hospitality precinct is genuinely local-first — customers walk, not drive, to their regular café.',
    demandAnalysis: 'Leederville café demand is consistent year-round with less seasonal volatility than coastal suburbs. The Oxford Street strip generates steady morning commuter trade from the high density of professional residents walking to Perth CBD or the nearby train station. Weekend brunch is a genuine revenue driver — the suburb\'s demographic and density supports $25–35 brunch spend and the cultural expectation of quality food. Average ticket of $15–18 is at the Perth inner-suburb standard. The demand is sustainable and growth-oriented as the suburb\'s gentrification continues.',
    competitionAnalysis: 'Oxford Street has a concentrated hospitality precinct (Greens & Co, 1907 Espresso, and several strong independents) but the market has not reached Subiaco or Fremantle saturation levels. There is room for a specialty coffee-focused entry with a serious food program, particularly if positioned in a secondary Oxford Street position or on a connecting street at lower rent. The key competitive dynamic: established operators have loyal morning regulars but the weekend brunch segment is more transient and available to a new quality entrant.',
    rentAnalysis: 'Oxford Street commercial rents run $3,500–$6,500/month for café-scale tenancies. This is meaningfully below Subiaco and well below Sydney or Melbourne inner-suburb equivalents. At $5,000/month rent with 2 staff, total fixed monthly costs run approximately $14,500. At $17 average ticket with 33% COGS, you need 44 customers/day — a comfortable target for an Oxford Street position with foot traffic. The margin profile in Leederville is better than most comparable Sydney café markets at the same revenue level.',
    customerBehavior: 'Leederville café customers are quality-motivated and community-oriented. They choose their café deliberately and maintain strong loyalties, but they are genuinely curious about quality new entries — unlike Surry Hills or Fitzroy where loyalty to established operators is close to unbreakable, Leederville has a softer loyalty structure that allows a quality new entrant to build its own customer base within 6–9 months. The suburb\'s social network is active — word of mouth moves fast and in both directions.',
    successConditions: [
      'An Oxford Street position at rent under $5,500/month — the foot traffic delta between primary and secondary Oxford Street positions is small but the rent differential is significant.',
      'A specialty coffee program that genuinely outperforms the current Oxford Street standard — Leederville customers are increasingly coffee-literate and will switch for a meaningfully better cup.',
      'A quality food program. Weekend brunch is Leederville\'s highest-value trading window and operators who don\'t have a serious food offer are leaving Saturday revenue on the table.',
      'Community engagement from day one — Leederville\'s local identity is strong and operators who embed in the community build loyal customer bases faster than those who operate as pure hospitality businesses.',
    ],
    failureScenarios: [
      'A generic quality café opening without clear differentiation from the existing Oxford Street operators — in a medium-competition market, "good" is insufficient when three existing operators are already "good."',
      'A coffee-only operation without food — Leederville\'s brunch culture means a café that doesn\'t do food is leaving 25–35% of available revenue on the table on weekends.',
      'Underestimating the importance of owner presence — Leederville customers want to know who owns their café and a café operated entirely by staff without owner presence loses the community dimension that drives repeat visits.',
      'Ignoring the station commuter trade — Leederville station generates consistent weekday morning foot traffic and a café without a fast-service morning protocol misses this high-frequency segment.',
    ],
    whatWouldMakeItBetter: [
      'A collaboration with Leederville\'s strong arts and community events calendar — the Oxford Street precinct hosts events that draw significant crowds and café operators who actively participate build awareness and customer trial at low cost.',
      'A retail coffee shelf (beans, brew equipment, merch) that gives loyal customers a way to extend their relationship with the café at home — this is low-cost, high-margin, and builds the community identity that drives repeat visits.',
    ],
    metaTitle: 'Is Leederville Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Leederville Perth? Verdict: GO — one of Perth\'s best café precincts, below-Subiaco rent, medium competition. Full demand analysis and break-even.',
    relatedSuburbs: [
      { label: 'Café in Subiaco',      suburbSlug: 'subiaco',    citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Fremantle',    suburbSlug: 'fremantle',  citySlug: 'perth', type: 'cafe' },
      { label: 'Restaurant in Leederville',suburbSlug:'leederville',citySlug:'perth',type:'restaurant'},
    ],
    dataAssumptions: 'Revenue based on 40–68 covers/day at $15–19 average ticket, 6 trading days. Rent from Oxford Street commercial listings Q1 2025. Staff: 2 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── 16. RETAIL · PERTH · SUBIACO ────────────────────────────────────────────
  'retail/perth/subiaco': {
    suburb: 'Subiaco', suburbSlug: 'subiaco', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'retail', businessLabel: 'Retail Shop',
    verdict: 'CAUTION',
    verdictSummary: 'Subiaco retail has the right demographic but Rokeby Road has struggled to maintain its retail volume as online substitution has affected non-specialist categories. The opportunity is specific and requires a non-commodity product with a strong reason to visit physically.',
    monthlyRevenue: { low: 28_000, high: 55_000 }, monthlyProfit: { low: 2_000, high: 10_000 },
    monthlyRent: { low: 4_000, high: 8_000 }, rentLevel: 'above-market',
    avgTicket: 80, dailyCustomersNeeded: 30, competitionLevel: 'medium', demandScore: 6,
    confidenceLevel: 'medium',
    confidenceNote: 'Subiaco retail market data from Rokeby Road commercial listings and WA retail industry benchmarks Q1 2025. Retail markets carry higher estimation uncertainty than hospitality.',
    suburbProfile: 'Subiaco\'s retail strip on Rokeby Road sits within one of Perth\'s highest-income suburban demographics — a structural advantage for retail requiring spend above $60/transaction. The suburb\'s affluent, owner-occupier base (household income above $120,000) creates genuine purchasing power. The challenge: Perth\'s retail market has been affected by online substitution and the Subiaco strip has seen vacancies increase since 2015, mirroring Bridge Road in Melbourne.',
    demandAnalysis: 'Retail demand in Subiaco is category-dependent. Specialist retail (optical, quality homewares, specialty food, independent fashion with a specific identity), service-based retail (alterations, high-end grooming, specialty repair), and experience-led retail perform well. Generic clothing, homewares, and commodity categories continue to lose ground to online alternatives. The suburb\'s demographic will pay premium prices for quality and authenticity — this is actually the right demographic for a premium specialist retailer. The demand ceiling is lower than hospitality (fewer transactions per day), but the average ticket is higher.',
    competitionAnalysis: 'Rokeby Road has shed several major retail operators in the past five years, creating genuine space for independents who can position as the alternative to what has vacated. The category gaps include: a credible independent bookshop, a quality specialty food and providore concept, premium homewares and gifts, and a curated independent fashion boutique. Existing anchor tenants (cafés and restaurants) generate foot traffic that passes potential retail customers who are currently given limited quality retail options.',
    rentAnalysis: 'Subiaco Rokeby Road retail rents run $4,500–$8,000/month for 60–120sqm tenancies. The premium is above what Subiaco\'s current retail volumes justify, which means negotiation leverage is real. At $6,000/month rent with 1 FT and standard retail overheads, fixed monthly costs run approximately $15,000. At $80 average ticket and 48% COGS, each transaction contributes $41.60. You need 361 transactions/month — 30/trading day — to break even. This requires deliberate shoppers rather than impulse browsers, which means your discovery marketing must be active before they arrive.',
    customerBehavior: 'Subiaco retail customers are researched purchasers. They visit Rokeby Road with a category intent rather than a browsing agenda — they are looking for specific products and will pay for quality and curation. This demographic responds well to expert staff who can explain products, to provenance and backstory (who made it, where the materials come from), and to a physical retail experience that is meaningfully different from the online equivalent. Instagram and Google are the primary discovery channels for specialty retail in Subiaco.',
    successConditions: [
      'A non-commodity product category that has no strong online equivalent — specialty food and beverage, premium artisan goods, custom or fitted products, or a category requiring physical interaction to purchase.',
      'Rent negotiated below $6,000/month — the Subiaco retail market does not justify 2015-era rents. Landlords know this; the negotiation leverage is yours.',
      'A strong online presence (Instagram, Google, own website with e-commerce) that drives deliberate visits to the physical store rather than relying on foot traffic alone.',
      'A format that creates a reason to visit beyond the transaction — a tasting, a personalisation service, a consultation, a class — any experiential layer that the online equivalent cannot replicate.',
    ],
    failureScenarios: [
      'A generic fashion, homewares, or beauty retail concept that competes with online alternatives or the Subiaco demographic\'s existing suburban shopping center habits.',
      'Rent above $7,000/month without a turnover rent clause — the retail volumes in Subiaco do not support this cost base for an independent operator without an established brand.',
      'Ignoring digital discovery. Subiaco retail customers research before they visit; a store with no Google presence, poor Instagram, and no website is invisible to its own target customer.',
      'Positioning at the middle of the market — Subiaco\'s demographic responds to either premium quality or significant value. The middle is occupied by online retail and the suburb\'s customers have already migrated there.',
    ],
    whatWouldMakeItBetter: [
      'A providore or specialty food retail concept positioned as a complement to Subiaco\'s restaurant and café precinct — Rokeby Road\'s hospitality strength is an underutilised anchor for adjacent food retail.',
      'An events and workshops program (tasting events, masterclasses, product launches) that uses the physical space for community-building beyond retail transactions — this is the format that generates earned media and word-of-mouth in a suburb where social proof is the primary purchase trigger.',
    ],
    metaTitle: 'Is Subiaco Good for Retail? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a retail shop in Subiaco Perth? Verdict: CAUTION — right demographic, but only specialist non-commodity concepts work. Full rent analysis and what succeeds.',
    relatedSuburbs: [
      { label: 'Restaurant in Subiaco',  suburbSlug: 'subiaco',    citySlug: 'perth', type: 'restaurant' },
      { label: 'Retail in Leederville',  suburbSlug: 'leederville',citySlug: 'perth', type: 'retail' },
      { label: 'Retail in Fremantle',    suburbSlug: 'fremantle',  citySlug: 'perth', type: 'retail' },
    ],
    dataAssumptions: 'Revenue based on 22–45 daily transactions at $70–90 average ticket, 6 trading days, Saturday-weighted. Rent from Rokeby Road commercial listings Q1 2025. Staff: 1 FT + casual including Super. COGS 48%. Profit pre-tax, owner wage included in staff costs.',
    lastUpdated: 'Q1 2025',
  },

  // ── 17. CAFÉ · PERTH · SUBIACO ──────────────────────────────────────────────
  'cafe/perth/subiaco': {
    suburb: 'Subiaco', suburbSlug: 'subiaco', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Subiaco\'s café market offers the same demographic advantage as its restaurant market — high spending, quality-motivated customers — at better rent economics than equivalent east-coast suburbs. Competition is manageable and the suburb\'s daily foot traffic on Rokeby Road sustains a quality independent operator well.',
    monthlyRevenue: { low: 32_000, high: 62_000 }, monthlyProfit: { low: 4_000, high: 14_000 },
    monthlyRent: { low: 4_000, high: 7_500 }, rentLevel: 'at-market',
    avgTicket: 18, dailyCustomersNeeded: 45, competitionLevel: 'medium', demandScore: 7,
    confidenceLevel: 'high',
    confidenceNote: 'Subiaco café data from Rokeby Road commercial listings and WA hospitality benchmarks. Consistent with broader Perth inner-suburb café market data.',
    suburbProfile: 'Subiaco\'s café market benefits from the same structural advantage as its restaurant market: a high-income, quality-motivated demographic within walking distance, below-east-coast rent, and a Rokeby Road strip with genuine daily foot traffic from residents, retail customers, and weekend hospitality visitors.',
    demandAnalysis: 'Café demand in Subiaco is driven by the suburb\'s affluent professional base and the consistent foot traffic generated by Rokeby Road\'s hospitality precinct. Average ticket of $17–20 is achievable — Subiaco customers are accustomed to quality and will pay for it. Weekday morning commuter trade is strong from the professional resident demographic. Saturday brunch is the revenue peak. The demand profile is more stable and less seasonal than coastal suburbs, making financial planning more predictable.',
    competitionAnalysis: 'Subiaco has established café operators on Rokeby Road but the market has not reached Fitzroy or Newtown saturation levels. There is identifiable room for a specialty coffee entrant with a quality food program, particularly at a secondary position at below-primary-strip rent. The existing operators are strong but their loyal customer bases are not impregnable — a quality new entry with genuine differentiation will convert customers within 6–9 months.',
    rentAnalysis: 'Rokeby Road café tenancies run $4,500–$7,500/month. At $5,500/month rent with 2 staff, fixed monthly costs run approximately $15,000. At $18 average ticket with 33% COGS, each customer contributes $12.06. You need 1,244 customers/month — 45/day — across 26 trading days. This is achievable for a well-positioned Rokeby Road café and creates genuine profit potential from month 6 once the regular customer base is established.',
    customerBehavior: 'Subiaco café customers are quality-driven and relatively loyal once a preference is established. They are less trend-sensitive than inner-east Melbourne or inner-Sydney customers — they will return to a café they trust for years. Building the morning regular is the primary revenue strategy in Subiaco: 60–80 people who come 4–5 times per week at $7–9 per visit generates $1,700–$3,000/week of highly predictable revenue before a single new customer walks in.',
    successConditions: [
      'A quality coffee program with a serious roaster partnership — Subiaco customers notice coffee quality and will travel for better coffee once they find it.',
      'A Rokeby Road position at rent under $6,500/month or a secondary street at under $5,000/month with equivalent foot traffic access.',
      'A strong Saturday brunch program — this is Subiaco\'s highest-value trading window and the primary customer acquisition moment for building the regular base.',
      'Community integration: Subiaco\'s small-suburb identity means the café owner\'s visible presence in the community is a genuine competitive advantage.',
    ],
    failureScenarios: [
      'A generic café without a specialty coffee point of difference in a suburb where customers have been drinking quality coffee for years.',
      'A primary strip position at $7,500+/month for a new operator without an established customer base — the revenue timeline to justify this rent is longer than many operators allow for.',
      'Ignoring the food program. Subiaco\'s café customers expect quality food to accompany quality coffee — a coffee-only operation loses the brunch occasion entirely.',
      'Underestimating the importance of parking — unlike Sydney inner suburbs, Subiaco customers frequently drive, and a café without accessible parking nearby can underperform relative to its quality.',
    ],
    whatWouldMakeItBetter: [
      'A roasting program or bean retail shelf — Subiaco\'s demographic is willing to buy quality beans at home if they trust the operator, creating a recurring revenue stream beyond in-store visits.',
      'A collaboration with Subiaco\'s farmers market or local produce network — this creates the ingredient provenance story that Subiaco customers respond well to and costs nothing but relationship-building.',
    ],
    metaTitle: 'Is Subiaco Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Subiaco Perth? Verdict: GO — quality-motivated demographic, below-east-coast rent, medium competition. Full analysis and break-even estimate.',
    relatedSuburbs: [
      { label: 'Restaurant in Subiaco', suburbSlug: 'subiaco',    citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Leederville',   suburbSlug: 'leederville',citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Fremantle',     suburbSlug: 'fremantle',  citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 40–68 covers/day at $16–20 average ticket, 6 trading days. Rent from Rokeby Road commercial listings Q1 2025. Staff: 2 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · MOUNT HAWTHORN · CAFÉ ────────────────────────────────────────────
  'cafe/perth/mount-hawthorn': {
    suburb: 'Mount Hawthorn', suburbSlug: 'mount-hawthorn', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Mount Hawthorn is Perth\'s best-kept café secret — a village-feel inner suburb with loyal, quality-conscious locals, rents well below Subiaco, and an established café strip that rewards operators who commit to the community. Lower ceiling than Subiaco, but genuinely lower risk.',
    monthlyRevenue: { low: 26_000, high: 50_000 }, monthlyProfit: { low: 3_000, high: 11_000 },
    monthlyRent: { low: 2_200, high: 5_000 }, rentLevel: 'below-market',
    avgTicket: 16, dailyCustomersNeeded: 36, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'Mount Hawthorn is a smaller, less-documented market. Estimates drawn from Scarborough Beach Road and Oxford Street commercial listings. Treat financial ranges as directional.',
    suburbProfile: 'Mount Hawthorn sits 4km north of Perth CBD, bordered by Leederville to the south and Osborne Park to the north. With approximately 8,000 residents and a median household income above $80,000, it has the demographic DNA of Subiaco without the commercial intensity. The suburb\'s retail is concentrated on a short strip of Scarborough Beach Road and Oxford Street — compact, walkable, and entirely independent. There are no national chains and residents actively prefer it that way.',
    demandAnalysis: 'Mount Hawthorn café demand is neighbourhood-first. The suburb\'s residents — predominantly young families and professionals who chose Mount Hawthorn for its quieter character — are intense café loyalists who visit 4–5 times per week once a favourite is established. The challenge is scale: with 8,000 residents and a relatively contained catchment, you are building a business on a loyal regular base rather than destination traffic. The upside is that that regular base is remarkably stable — Mount Hawthorn cafés do not experience the volatility of tourist-dependent strips.',
    competitionAnalysis: 'Competition is medium — the strip has quality operators but is not saturated. Unlike Subiaco or Fremantle, there is no single dominant café that owns the morning. The gap in the market is a café with an exceptional food program — most Mount Hawthorn operators do coffee well but food is secondary. A café that anchors the Saturday brunch occasion with a genuinely great 8-item brunch menu, in addition to quality coffee, will pull customers from across the north of the city.',
    rentAnalysis: 'Mount Hawthorn commercial rents are among the most attractive in inner Perth for the demographic quality delivered. Scarborough Beach Road and Oxford Street positions run $2,200–$5,000/month — 25–40% below Subiaco equivalents. At $3,500/month rent with 1.5 staff (owner + 1 FT), total monthly fixed costs run approximately $11,000. At $16 average ticket and 33% COGS, each customer contributes $10.72. You need 1,027 customers/month — 36 per trading day. That is a very low bar for a suburb with the right regular base, and is consistently achievable.',
    customerBehavior: 'Mount Hawthorn café customers are community-builders. They want to know the owner by name, understand the sourcing story, and feel that the café is an authentic part of the suburb rather than a business that could exist anywhere. They are quality-driven but not extravagant — $5.50 for a specialty flat white feels right here; $7 feels like it belongs in Subiaco. They are highly responsive to loyalty programs and to operators who visibly support the suburb — the Mount Hawthorn Facebook community group has 15,000+ members and word spreads fast.',
    successConditions: [
      'A visible community presence from day one — the Facebook group, the school fetes, the local sports clubs. Mount Hawthorn rewards operators who are seen as part of the suburb, not just trading within it.',
      'Rent under $4,000/month. The suburb\'s revenue ceiling is lower than Subiaco; the cost structure must match. A $4,500+/month lease significantly narrows your profit margin.',
      'A compelling Saturday brunch program — this is the week\'s highest-revenue trading window and the moment new customers form their opinion of whether they\'ll become regulars.',
      'A lean model (owner-operator + 1 FT) that can run the weekday efficiently without the full cost structure of a larger operation.',
    ],
    failureScenarios: [
      'Attempting to replicate a Subiaco or Leederville café concept without adapting to Mount Hawthorn\'s village scale and price expectations.',
      'High fit-out investment ($150,000+) at a revenue ceiling that doesn\'t support rapid repayment. Mount Hawthorn rewards low-cost, character-led fit-outs over expensive minimalist builds.',
      'Ignoring the community dimension entirely and operating as a pure hospitality business. The suburb\'s small size means negative word-of-mouth travels faster than positive.',
      'Closing on Sundays or opening late on Saturdays. The Saturday–Sunday weekend accounts for 45–50% of weekly revenue in a suburb where families are home and looking for a café destination.',
    ],
    whatWouldMakeItBetter: [
      'A Saturday farmers market collaboration or pop-up with local producers — this creates earned media within the suburb and builds community credibility that advertising cannot replicate.',
      'A simple catering program targeting the suburb\'s professional households and small business community — reliable weekday revenue that insulates the business from slow morning trading.',
    ],
    metaTitle: 'Is Mount Hawthorn Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Mount Hawthorn? Verdict: GO — village community, loyal locals, below-Subiaco rent. Full break-even analysis and key success conditions.',
    relatedSuburbs: [
      { label: 'Café in Leederville',   suburbSlug: 'leederville',   citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Subiaco',       suburbSlug: 'subiaco',       citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Northbridge',   suburbSlug: 'northbridge',   citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 30–55 covers/day at $14–18 avg ticket, 6 trading days. Rent from Scarborough Beach Road/Oxford Street listings Q1 2025. Staff: owner + 1 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · VICTORIA PARK · RESTAURANT ───────────────────────────────────────
  'restaurant/perth/victoria-park': {
    suburb: 'Victoria Park', suburbSlug: 'victoria-park', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'GO',
    verdictSummary: 'Victoria Park\'s Albany Highway is Perth\'s best-value emerging restaurant corridor — rents 40–50% below Subiaco, a gentrifying demographic with rising incomes, and almost no serious competition in the mid-market restaurant category. The suburb is 3 years into a demand wave that most operators haven\'t noticed yet.',
    monthlyRevenue: { low: 40_000, high: 85_000 }, monthlyProfit: { low: 5_000, high: 18_000 },
    monthlyRent: { low: 1_800, high: 4_500 }, rentLevel: 'below-market',
    avgTicket: 58, dailyCustomersNeeded: 30, competitionLevel: 'low', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'Victoria Park restaurant market is emerging and less documented than established Perth precincts. Estimates from Albany Highway commercial listings and Perth metro hospitality benchmarks, Q1 2025.',
    suburbProfile: 'Victoria Park sits 3km southeast of Perth CBD across the Causeway. Albany Highway — the suburb\'s commercial spine — has historically been a multicultural strip of budget eateries and takeaways. That is changing fast: in the past four years, a wave of quality independents has arrived, incomes have risen, and younger buyers priced out of Subiaco and South Perth have moved in. The suburb now hosts a demographic that wants quality dining but hasn\'t had it at the right price point. Proximity to Perth Stadium and the Burswood entertainment precinct provides a significant event-day revenue overlay.',
    demandAnalysis: 'Restaurant demand in Victoria Park is structurally underdeveloped relative to its demographic. The suburb has 14,000 residents with a median household income of $70,000 and growing — a demographic that goes to Subiaco or South Perth for a decent dinner because the local options haven\'t been good enough. An operator who opens a genuinely quality restaurant on Albany Highway is not competing for market share; they are creating a market that currently drives 30km for dinner. The Perth Stadium precinct (400m from Albany Highway) delivers 10–15 high-foot-traffic event days per year that dramatically spike nearby hospitality revenue.',
    competitionAnalysis: 'Restaurant competition in Victoria Park is low. The current occupants of Albany Highway are primarily: budget Asian takeaways, established Vietnamese and Thai institutions, and a handful of new-entrant quality operators. There is no credible mid-market contemporary Australian restaurant, no quality burger or pizza concept that competes with Subiaco equivalents, and no serious wine bar. A restaurant that opens at $55–65/head with a clear identity and good wine list becomes, immediately, the best restaurant in the suburb — a position that is extremely valuable for word-of-mouth and Google Review profile.',
    rentAnalysis: 'Albany Highway commercial rents are Perth\'s most compelling value opportunity for restaurant operators. Visible street frontage runs $2,500–$4,500/month — half the cost of a Subiaco equivalent. At $3,200/month rent with 3 staff and standard restaurant overheads, total monthly fixed costs run approximately $23,000. At $58 average ticket and 35% COGS, each cover contributes $37.70. You need 611 covers/month — 30 per trading day across 5 trading days. That is a very achievable target for a restaurant that becomes, by default, the suburb\'s best.',
    customerBehavior: 'Victoria Park restaurant customers are neighbourhood loyalists who are ready to spend on quality but have been without nearby options. They respond strongly to: Google Reviews (check Albany Highway restaurant scores and you will understand how underserved this demographic is), word of mouth from the suburb\'s tight residential community, and genuine value — $55–65/head for excellent food and wine at a comfortable restaurant is perceived as fair here in a way it would not be in Subiaco. They will drive past three mediocre restaurants to reach your tables if you are genuinely the best option in the suburb.',
    successConditions: [
      'An Albany Highway frontage with visibility from the road — discovery is critical in an emerging precinct where destination dining habits haven\'t yet formed.',
      'A clear cuisine identity at a price point between $50–70/head — not trying to be a fine dining destination, but not a budget restaurant either. The mid-market quality segment is the gap.',
      'Event-day strategy for Perth Stadium — catering, pre-booking promotions, extended hours on match days. The 50,000-capacity stadium is 400m away. Capture that revenue or leave it on the table.',
      'Strong Google and social presence before opening — Victoria Park restaurant customers search before they walk in. You need 20+ reviews before the first month ends.',
    ],
    failureScenarios: [
      'A fine-dining format at $120+/head — the suburb is not there yet and destination dining reputation takes 2–3 years to build. Start at $55–70/head and earn the pricing power.',
      'An Albanian Highway position without good street visibility — the suburb\'s car-dependent character means passing trade matters more than in walkable inner suburbs.',
      'Opening without an event-day strategy. The Perth Stadium precinct generates more foot traffic per event than Albany Highway sees in a standard week. Operators who ignore this leave 15–20% of annual revenue uncaptured.',
      'Generic offering in a market where "best in suburb" is the competitive threshold. There is no benefit to being Victoria Park\'s second-best restaurant.',
    ],
    whatWouldMakeItBetter: [
      'A private dining room for the suburb\'s growing professional cohort — corporate dinners and celebration bookings generate 20–30% higher average tickets and carry very low marketing cost.',
      'A Thursday–Friday lunch program targeting the Curtin University staff and CBD-adjacent professionals commuting through the suburb — a largely untapped weekday revenue segment.',
    ],
    metaTitle: 'Is Victoria Park Good for a Restaurant? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Victoria Park? Verdict: GO — below-market rent, low competition, gentrifying demographic. Full analysis, break-even, and what works on Albany Highway.',
    relatedSuburbs: [
      { label: 'Restaurant in Subiaco',   suburbSlug: 'subiaco',     citySlug: 'perth', type: 'restaurant' },
      { label: 'Restaurant in Northbridge', suburbSlug: 'northbridge', citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Victoria Park',   suburbSlug: 'victoria-park', citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 25–55 covers/service, dinner Tue–Sun plus stadium event uplift. Rent from Albany Highway listings Q1 2025. Staff: 2 FT + 2 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · NORTHBRIDGE · RESTAURANT ─────────────────────────────────────────
  'restaurant/perth/northbridge': {
    suburb: 'Northbridge', suburbSlug: 'northbridge', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'CAUTION',
    verdictSummary: 'Northbridge has Perth\'s highest restaurant density and strongest evening foot traffic — but it also has the highest rents and the highest failure rate. The market rewards operators with a compelling, well-funded concept; it destroys generic mid-market entrants within 18 months. Proceed only if your concept has a genuine point of difference.',
    monthlyRevenue: { low: 55_000, high: 130_000 }, monthlyProfit: { low: 3_000, high: 22_000 },
    monthlyRent: { low: 3_500, high: 10_000 }, rentLevel: 'above-market',
    avgTicket: 65, dailyCustomersNeeded: 52, competitionLevel: 'saturated', demandScore: 9,
    confidenceLevel: 'high',
    confidenceNote: 'Northbridge is WA\'s most documented restaurant precinct. Data from James Street and William Street commercial listings, City of Perth foot traffic counts, and CBRE Perth commercial data, Q1 2025.',
    suburbProfile: 'Northbridge is Perth\'s primary entertainment precinct, directly north of the CBD separated by the rail line and Cultural Centre. James Street, William Street, and Lake Street together host the highest concentration of restaurants, bars, and late-night venues in WA. The suburb\'s population of 5,000 residents is vastly outnumbered by the evening dining and entertainment population it attracts — on a peak Friday or Saturday night, thousands of CBD workers, tourists, and suburban diners flood the streets. The challenge is that this same foot traffic has dozens of competitive options within 200m.',
    demandAnalysis: 'Northbridge restaurant demand is unambiguously strong — the suburb generates more restaurant covers per square kilometre than anywhere in WA. Thursday–Saturday dinner is the primary revenue window, with genuine all-night trade until 11pm on weekends. The lunch market is smaller but growing as CBD workers extend their work-from-nearby patterns. The key demand insight: Northbridge customers arrive with a destination in mind more often than not — they searched your restaurant before they arrived. Organic walk-in discovery is declining as Google Reviews and Instagram become the primary booking triggers.',
    competitionAnalysis: 'Saturated is an understatement for some categories. Italian, pizza, and standard Asian concepts are severely overrepresented. What Northbridge lacks: a credible elevated Middle Eastern concept, a serious modern Korean restaurant, a premium natural wine bar-restaurant pairing, and a compelling plant-forward dining destination. Operators who enter established categories face brutal competition from incumbents with years of Google Reviews and loyal regulars. Operators who enter underserved categories in Northbridge have a genuine 12–18 month window to establish before competition follows.',
    rentAnalysis: 'James Street and William Street command Perth\'s highest commercial restaurant rents: $6,000–$10,000/month for viable restaurant tenancies. Lake Street and secondary positions offer $3,500–$6,000/month. At $7,000/month rent with 4 staff and overheads, total fixed monthly costs run approximately $37,000. At $65 average ticket and 35% COGS, each cover contributes $42.25. You need 876 covers/month — 52 per active trading day across 5 days. That is a high but achievable target for a well-reviewed Northbridge restaurant at full capacity.',
    customerBehavior: 'Northbridge restaurant customers choose by reputation and search behaviour. Google Reviews, Instagram presence, and friend recommendation drive the vast majority of first visits. Price sensitivity is lower than Subiaco — the precinct\'s entertainment positioning means diners arrive with spending intent and a group context that inflates average ticket. However, quality expectations are high and negative reviews spread fast. A restaurant that opens in Northbridge must have its Google Reviews strategy active from week one — not week eight.',
    successConditions: [
      'A cuisine concept in an underrepresented Northbridge category — not Italian, not generic Asian, not standard Australian. Something the suburb hasn\'t had before that you can own.',
      'A minimum capital position of $300,000 for fit-out, working capital, and a six-month runway before trading revenue covers all costs.',
      'A Northbridge-specific launch strategy: pre-opening press, an Instagram presence with 1,000+ followers before you open the door, and a curated opening week that generates 30+ Google Reviews.',
      'Rent below $7,500/month or a turnover rent arrangement. The difference between $6,500/month and $8,500/month rent is approximately 47 additional covers per month at break-even — material in a competitive market.',
    ],
    failureScenarios: [
      'A quality but generic concept (standard burger bar, average Italian, café-style Asian) in the $55–70/head segment that has no memorable reason to choose it over eight near-identical competitors.',
      'Undercapitalisation: operators who open Northbridge restaurants with $120,000–$150,000 run out of cash before Google Reviews and word of mouth build to sustainable levels.',
      'Neglecting review management in a suburb where 4.2 stars on Google is the threshold between struggling and thriving.',
      'Weekend-only trading. Northbridge weeknight trade (Tuesday–Thursday) is underutilised by many operators but is essential to covering fixed costs. A Monday-to-Thursday closure on $8,000/month rent is a structural loss.',
    ],
    whatWouldMakeItBetter: [
      'A bar program that creates revenue between 9pm and midnight — Northbridge\'s entertainment strip generates significant late-night spending that restaurant-only operators systematically miss.',
      'A private events or dining packages component that generates high-margin, pre-booked revenue insulated from nightly trading variability.',
    ],
    metaTitle: 'Is Northbridge Good for a Restaurant? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Northbridge? Verdict: CAUTION — high demand but saturated competition and premium rent. Full analysis, break-even, and the concepts that actually work.',
    relatedSuburbs: [
      { label: 'Restaurant in Subiaco',       suburbSlug: 'subiaco',       citySlug: 'perth', type: 'restaurant' },
      { label: 'Restaurant in Victoria Park', suburbSlug: 'victoria-park', citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Northbridge',         suburbSlug: 'northbridge',   citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 40–80 covers/service, dinner Thu–Sat (2 services), Tue–Wed (1 service), $60–75 avg ticket. Rent from James/William Street listings Q1 2025. Staff: 3 FT + 3 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },


  // ── PERTH · SCARBOROUGH · CAFÉ ───────────────────────────────────────────────
  'cafe/perth/scarborough': {
    suburb: 'Scarborough', suburbSlug: 'scarborough', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Scarborough\'s redeveloped foreshore has transformed this suburb into one of Perth\'s strongest emerging café markets. The beach-lifestyle demographic, strong tourism overlay, and a $100M precinct upgrade create the conditions for a well-positioned café operator to build a genuinely strong business.',
    monthlyRevenue: { low: 32_000, high: 68_000 }, monthlyProfit: { low: 4_000, high: 15_000 },
    monthlyRent: { low: 2_500, high: 6_500 }, rentLevel: 'at-market',
    avgTicket: 17, dailyCustomersNeeded: 45, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'Scarborough\'s hospitality market is in active growth following the foreshore redevelopment. Data from Scarborough Beach Road listings and Perth northern suburbs benchmarks, Q1 2025.',
    suburbProfile: 'Scarborough is 14km north of Perth CBD — a beachside suburb of 11,000 residents that has undergone a significant transformation since the 2018 foreshore redevelopment. The $100M precinct upgrade replaced a tired strip of fast-food outlets with quality hospitality, an amphitheatre, and a 50m pool complex. Scarborough now attracts a much broader demographic: the original beach-lifestyle residents, families from surrounding northern suburbs, and a growing tourist contingent. The suburb has morning surfers by 5am and families on the esplanade until sunset.',
    demandAnalysis: 'Café demand in Scarborough runs on two distinct cycles. Summer (October–April): very high foot traffic from beach visitors, strong tourism, and consistent 7-day trading that peaks on Saturdays when the Esplanade fills from 7am. Winter (May–September): demand drops 30–40% as beach visitors retreat, leaving core resident trade. An operator who plans for this seasonality — lower costs in winter, maximum extraction in summer — runs a viable model. Average ticket of $15–19 is supported by the beach-lifestyle premium; Scarborough visitors budget for an experience, not just a coffee.',
    competitionAnalysis: 'Competition is medium and the foreshore precinct itself occupies the premium positions. The opportunity for an independent operator lies immediately adjacent to the precinct rather than inside it — foreshore kiosk rents are premium and under exclusive licence. Scarborough Beach Road (running north from the foreshore) has genuine street-level café positions at lower rents where a quality independent can establish itself as the local alternative to the beachfront options. The market gap: a specialty coffee-focused café with excellent breakfast and brunch food that attracts the resident early-morning segment before the tourist tide arrives.',
    rentAnalysis: 'Scarborough Beach Road commercial rents vary significantly by proximity to the foreshore. Beachfront and esplanade-adjacent positions run $5,000–$8,000+/month; Scarborough Beach Road strip positions run $2,500–$5,500/month. At $4,000/month in a street-level position with 2 staff, total fixed monthly costs run approximately $13,500. At $17 average ticket and 33% COGS, each customer contributes $11.39. You need 45 customers per trading day to break even — achievable from spring through autumn and tight but manageable in winter with a lean cost structure.',
    customerBehavior: 'Scarborough café customers divide by season. Summer brings the tourist and beach visitor segment: price-aware but leisure-mode, Instagram-influenced (the foreshore backdrop drives significant social media activity), and willing to wait 15 minutes for a good coffee if the setting delivers. The year-round resident segment is the business foundation: active, health-conscious, early-rising surfers and families who want consistent quality coffee and reliable breakfast food before their beach session. The resident segment decides your survival; the tourist segment determines your peak revenue.',
    successConditions: [
      'A Scarborough Beach Road position with morning sun exposure — the suburb\'s beach-lifestyle demographic makes outdoor seating an asset from 7am, and shaded north-facing or east-facing positions fill before those without.',
      'Summer operating hours from 6am to catch the pre-surf and early beach crowd — this segment tips well and becomes fierce loyalists if you know their order.',
      'A social media presence anchored in the Scarborough beach lifestyle — location-tagged Instagram content showing the surf, the sunrise, and quality coffee drives tourism discovery at zero cost.',
      'A lean winter cost structure: two fewer staff, shorter hours, reduced menu. The margin between viable and unviable in Scarborough is seasonal planning, not concept quality.',
    ],
    failureScenarios: [
      'Treating Scarborough like an inner-city café market and expecting consistent year-round trade at summer volumes — the seasonal dip is real and catches underprepared operators out.',
      'An interior-focused concept without outdoor seating in a suburb where the outdoor lifestyle is the primary appeal. A Scarborough café without alfresco options is leaving significant summer revenue behind.',
      'Signing a beachfront or esplanade-adjacent lease at premium rent without accounting for the winter trough. $7,000+/month rent requires summer revenue that is exceptional to cover winter months.',
      'Ignoring the early-morning surfer and fitness market. These customers represent 25–35% of Scarborough\'s weekday morning trade and have almost no quality café options before 7am.',
    ],
    whatWouldMakeItBetter: [
      'A takeaway-only window for the pre-surf rush (5:30–7am): minimal incremental staff cost, captures customers who want speed before paddling out, and builds a loyal early-morning base.',
      'A partnership with one of the Scarborough Beach surf schools or fitness studios creates cross-referral that is free, community-authentic, and directly targeted at your primary customer segment.',
    ],
    metaTitle: 'Is Scarborough Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Scarborough? Verdict: GO — beach lifestyle market, foreshore redevelopment, strong summer trade. Full analysis and break-even for this emerging Perth suburb.',
    relatedSuburbs: [
      { label: 'Café in Cottesloe',     suburbSlug: 'cottesloe',     citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Mount Hawthorn', suburbSlug: 'mount-hawthorn', citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Fremantle',     suburbSlug: 'fremantle',     citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 38–68 covers/day at $15–19 avg ticket, weighted to summer. Rent from Scarborough Beach Road listings Q1 2025. Staff: 2 FT including Super, seasonal adjustment. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · COTTESLOE · CAFÉ ──────────────────────────────────────────────────
  'cafe/perth/cottesloe': {
    suburb: 'Cottesloe', suburbSlug: 'cottesloe', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Cottesloe is Perth\'s premium beach café market — a small, affluent suburb where customers spend more per visit than almost anywhere else in WA. Napoleon Street supports genuine premium pricing and the beach lifestyle drives strong all-week demand. The risk is small market size and a winter slowdown that demands planning.',
    monthlyRevenue: { low: 32_000, high: 62_000 }, monthlyProfit: { low: 4_500, high: 14_000 },
    monthlyRent: { low: 3_000, high: 7_000 }, rentLevel: 'at-market',
    avgTicket: 21, dailyCustomersNeeded: 38, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Cottesloe is a well-established Perth hospitality suburb. Data from Napoleon Street commercial listings and western suburbs demographic benchmarks, Q1 2025.',
    suburbProfile: 'Cottesloe sits 12km southwest of Perth CBD — a small, wealthy suburb of 7,000 residents built around one of Australia\'s most celebrated beaches. Median household income exceeds $98,000. Napoleon Street is the compact commercial strip: a 400m strip of cafés, boutiques, and restaurants serving a demographic that is unhurried, quality-expecting, and deeply familiar with premium hospitality. Beach visitors from across Perth\'s western suburbs add a significant weekend surge, particularly October through April.',
    demandAnalysis: 'Cottesloe café demand is driven by a premium beach-lifestyle demographic that spends significantly more per visit than Perth-average customers. Average ticket of $19–24 is achievable without customer resistance — this is a suburb where the $28 brunch plate and the $6.50 specialty coffee are normal expectations. The resident demographic generates very consistent weekday morning trade (dog-walkers, home-workers, early beach swimmers), while weekends bring a broader western suburbs influx. The business model that works: quality-driven, food-forward, premium but not precious.',
    competitionAnalysis: 'Napoleon Street has a defined set of quality operators but is not saturated. The market leader has strong loyalty but the café category on the strip can support 2–3 quality operations sustainably. What the street lacks: a specialty coffee operator with a genuinely differentiated roaster relationship, and a breakfast concept that goes beyond the standard eggs and toast. Cottesloe customers have the spending power and palate to support a café that charges premium prices for genuinely exceptional product.',
    rentAnalysis: 'Napoleon Street commercial rents run $4,000–$7,000/month for visible café positions; Marine Parade and secondary streets offer $3,000–$4,500/month. At $5,000/month rent with 2 staff and overheads, total monthly fixed costs run approximately $15,500. At $21 average ticket and 33% COGS, each customer contributes $14.07. You need 38 customers per trading day to break even — one of the lower daily targets in inner Perth for the rent level, a reflection of Cottesloe\'s higher average ticket.',
    customerBehavior: 'Cottesloe café customers are quality-first and price-resilient. They are not testing value — they expect excellence and respond negatively to mediocrity. The core segments: the pre-swim or post-swim morning regular (daily, consistent, fast-turn, essential for operational rhythm), the Saturday brunch group (high average ticket, longer dwell time, the week\'s highest-value session), and the active-retiree midweek customer (mid-morning, unhurried, high repeat rate). Building all three segments is the path to a sustainable model; the beach lifestyle means the morning pool is never empty.',
    successConditions: [
      'A Napoleon Street frontage with beach sightlines or natural light — Cottesloe customers are paying for the lifestyle experience alongside the coffee, and a dark interior struggles here.',
      'Premium coffee execution: Cottesloe\'s demographic has drunk specialty coffee for a decade. Your pour-over, cold brew, and alternative milk program must be genuinely excellent, not aspirationally so.',
      'A weekend brunch menu that justifies $26–32 per plate — three-course brunch culture is strong here, and a café that only does good coffee but mediocre food leaves significant Saturday revenue uncaptured.',
      'A lean winter structure (May–August) to account for the 25–30% demand reduction when beach traffic drops. Two fewer staff and reduced stock holdings are the difference between a profitable winter and a break-even one.',
    ],
    failureScenarios: [
      'Average product at premium pricing. Cottesloe customers have high expectations and are acutely quality-aware — a mediocre flat white at $5.50 will generate a Google Review that costs more than the coffee.',
      'An inland or secondary street position without Napoleon Street visibility. In a suburb of 7,000, discovery depends on foot traffic past your door more than in larger suburbs.',
      'Treating the café as a summer-only business and failing to build the resident regular base during winter. The winter cohort is your financial foundation — without them, summer peaks don\'t save you.',
      'A standard, unspecialised menu that cannot justify Cottesloe\'s premium pricing expectations. Customers here compare you to Sydney\'s best café food; meet that standard or charge less.',
    ],
    whatWouldMakeItBetter: [
      'A health-forward menu (genuinely excellent smoothies, acai bowls, protein-oriented breakfast options) specifically targeted at the beach-active demographic — a clear gap on Napoleon Street and directly aligned with the suburb\'s lifestyle values.',
      'A retail shelf with premium pantry items and estate coffee beans — Cottesloe\'s income bracket means take-home purchases at $25–45 are natural add-ons to a regular visit.',
    ],
    metaTitle: 'Is Cottesloe Good for a Café? Perth Beach Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Cottesloe? Verdict: GO — affluent beach market, higher average ticket, medium competition. Full analysis, break-even, and success conditions on Napoleon Street.',
    relatedSuburbs: [
      { label: 'Café in Scarborough',   suburbSlug: 'scarborough',   citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Fremantle',     suburbSlug: 'fremantle',     citySlug: 'perth', type: 'cafe' },
      { label: 'Retail in Claremont',   suburbSlug: 'claremont',     citySlug: 'perth', type: 'retail' },
    ],
    dataAssumptions: 'Revenue based on 30–55 covers/day at $19–24 avg ticket, 6 trading days, summer-weighted. Rent from Napoleon Street listings Q1 2025. Staff: 2 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · SOUTH PERTH · CAFÉ ────────────────────────────────────────────────
  'cafe/perth/south-perth': {
    suburb: 'South Perth', suburbSlug: 'south-perth', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'South Perth offers a rare combination: an affluent riverside demographic, a ferry connection to the CBD that creates an unusual commuter trade pattern, and commercial rents well below equivalent western-suburbs locations. The suburb is underserved for quality café options relative to its spending power.',
    monthlyRevenue: { low: 28_000, high: 55_000 }, monthlyProfit: { low: 3_500, high: 12_000 },
    monthlyRent: { low: 2_500, high: 5_500 }, rentLevel: 'below-market',
    avgTicket: 19, dailyCustomersNeeded: 36, competitionLevel: 'low', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'South Perth hospitality market is smaller and less documented than inner Perth. Estimates from Angelo Street commercial listings and southern-river demographic data, Q1 2025.',
    suburbProfile: 'South Perth occupies the southern bank of the Swan River directly opposite Perth CBD. The suburb of 16,000 residents has one of the highest household incomes in the Perth metro area ($91,000 median) and a demographic profile dominated by families, established professionals, and empty nesters who chose South Perth for its riverside setting and relative tranquility. The South Perth Esplanade and Zoo precinct drive significant weekend foot traffic from across the metropolitan area, while the ferry service to Elizabeth Quay creates an unusual CBD-commuter trade pattern.',
    demandAnalysis: 'South Perth café demand is split between the large, income-wealthy resident base and the visitor-driven weekend trade around the Zoo and foreshore. Weekday mornings generate a commuter café trade from ferry users heading to the CBD — a captive, time-pressed, quality-expecting segment that other South Perth operators have underserved. Angelo Street\'s café strip generates consistent neighbourhood patronage across the week. The Sunday morning brunch occasion — riverside walks, Zoo visits — is the single highest-revenue trading window of the week. An operator who captures all three demand streams has a genuinely strong business model.',
    competitionAnalysis: 'Competition is low relative to demand. Angelo Street has a small number of established cafés but none that would be described as a destination. No operator on Angelo Street has built the profile that their suburb\'s demographic would expect from a comparable Subiaco or Cottesloe café. This gap is the opportunity: South Perth\'s residents drive to Subiaco or Applecross for a genuinely quality café experience. The business case is simply providing them with a reason not to.',
    rentAnalysis: 'Angelo Street commercial rents run $2,500–$5,500/month — significantly below western-suburbs equivalents despite comparable or higher demographics. At $4,000/month rent with 1.5 staff, total monthly fixed costs run approximately $12,500. At $19 average ticket and 33% COGS, each customer contributes $12.73. You need 36 customers per trading day to break even — one of the lowest daily targets in inner-south Perth for this demographic quality.',
    customerBehavior: 'South Perth café customers are experience-oriented and quality-loyal. Once they find a café they respect, they return with remarkable consistency — South Perth residents are not explorers by nature. They respond well to personalised service (knowing their name, their order), clear quality signals (visible roaster provenance, excellent milk texture), and a sense that the café belongs to the suburb rather than a hospitality group. The ferry commuter segment wants speed and reliability; the weekend brunch segment wants experience and a relaxed table.',
    successConditions: [
      'A position on Angelo Street near the ferry terminus — capturing the morning CBD-commuter trade is the business\'s weekday revenue spine.',
      'A consistently excellent product that gives residents a reason to stop driving to Subiaco for their Saturday coffee. The quality bar they\'re comparing you to is real.',
      'A Sunday brunch menu worthy of the Zoo-visitor and foreshore-walker crowd — this is South Perth\'s highest foot-traffic window and the primary customer acquisition moment.',
      'Rent below $4,500/month to preserve the margin advantage that makes South Perth commercially attractive versus more established precincts.',
    ],
    failureScenarios: [
      'An adequate but unremarkable café that doesn\'t give South Perth\'s quality-aware demographic a reason to change their Subiaco Saturday habit.',
      'A premium fit-out that exceeds the precinct\'s commercial reality — Angelo Street is a neighbourhood strip, not a destination. A $200,000 fit-out requires revenue that the catchment takes time to deliver.',
      'Weak Sunday trading — the Zoo and foreshore drive 30–40% above baseline foot traffic on Sundays, and operators who close or half-open on Sundays miss their single highest-value trading session.',
      'Ignoring the commuter segment. Ferry users are a reliable, daily, time-pressed segment. A coffee window or pre-order system for commuters adds meaningful weekday revenue at low incremental cost.',
    ],
    whatWouldMakeItBetter: [
      'A partnership with the South Perth community garden or local produce network creates ingredient provenance stories that this demographic responds strongly to.',
      'A Perth Zoo collaboration — a takeaway coffee cart or post-visit café destination partnership with the Zoo creates a visitor flow that no marketing budget can replicate.',
    ],
    metaTitle: 'Is South Perth Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in South Perth? Verdict: GO — affluent riverside demographic, low competition, below-market rent. Full analysis and break-even for the Angelo Street café market.',
    relatedSuburbs: [
      { label: 'Café in Applecross',    suburbSlug: 'applecross',    citySlug: 'perth', type: 'cafe' },
      { label: 'Restaurant in Subiaco', suburbSlug: 'subiaco',       citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Como',          suburbSlug: 'como',          citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 28–52 covers/day at $17–22 avg ticket, 6 trading days. Rent from Angelo Street listings Q1 2025. Staff: owner + 1 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },


  // ── PERTH · EAST PERTH · CAFÉ ─────────────────────────────────────────────────
  'cafe/perth/east-perth': {
    suburb: 'East Perth', suburbSlug: 'east-perth', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'CAUTION',
    verdictSummary: 'East Perth has strong weekday corporate and commuter demand but very thin weekend trade. The economics work for an operator who builds a tight Monday–Friday model and controls their cost structure accordingly. A standard café model expecting Saturday brunch trade will struggle in a suburb that empties after 6pm on Fridays.',
    monthlyRevenue: { low: 24_000, high: 48_000 }, monthlyProfit: { low: 2_000, high: 10_000 },
    monthlyRent: { low: 2_000, high: 5_000 }, rentLevel: 'at-market',
    avgTicket: 15, dailyCustomersNeeded: 40, competitionLevel: 'low', demandScore: 7,
    confidenceLevel: 'medium',
    confidenceNote: 'East Perth is a developing market with limited comparable data. Estimates from Royal Street commercial listings and CBD-fringe hospitality benchmarks, Q1 2025.',
    suburbProfile: 'East Perth is a redeveloped inner-city suburb on the eastern edge of the Perth CBD — a predominantly apartment-and-office environment that has grown from nothing in the 1990s to 9,000 residents. The suburb\'s character is more corporate corridor than neighbourhood: glass apartment towers, law firms, Royal Perth Hospital, and the Claisebrook Cove waterfront. Weekday daytime population is high and coffee-consuming. Weekend population is thin as residents leave for suburb-with-more-life destinations.',
    demandAnalysis: 'East Perth café demand is strongly weekday-concentrated. The Monday–Friday commercial population — office workers, hospital staff, apartment residents heading to the CBD — generates consistent 7–9am and 12–1pm trade peaks. Royal Street and the Claisebrook Cove precinct have genuine foot traffic during business hours. The weekend drop-off is significant: a café doing 100 customers on a Tuesday might see 30 on a Sunday. An operator who runs a 7am–3pm weekday model with limited weekend hours, and builds a corporate catering or office supply component, operates profitably. An operator who expects weekend brunch trade will find a deserted street.',
    competitionAnalysis: 'Competition is low — East Perth is genuinely underserved for quality café options relative to its weekday population. Royal Perth Hospital and the adjacent office precinct support several thousand potential coffee customers who currently have limited specialty options. The market gap is clear: a quality specialty café positioned for the weekday professional segment, with fast-service for hospital staff and a comfortable work-from-café environment for apartment residents.',
    rentAnalysis: 'Royal Street and Claisebrook Cove commercial positions run $2,000–$5,000/month — below comparable CBD-fringe suburbs. At $3,500/month with 1.5 staff operating Monday–Saturday, total fixed monthly costs run approximately $11,500. At $15 average ticket and 33% COGS, each customer contributes $10.05. You need 40 customers per trading day across a 5.5-day model. With a solid corporate regular base, this is achievable from month three.',
    customerBehavior: 'East Perth café customers are time-pressed professionals and hospital workers who prioritise speed and consistency over experience. They are not Saturday brunch lingerers — they are ordering a flat white with one minute to spare before a meeting. The work-from-café segment exists (apartment residents with flexible hours) but is smaller than in Leederville or Mount Hawthorn. Loyalty programs (digital stamp cards, pre-order apps) outperform experiential elements here — this customer wants to feel known, not to linger.',
    successConditions: [
      'A Mon–Fri focused model with lean weekend trading: 7am–2pm weekdays at full capacity, limited Saturdays, closed or half-open Sundays.',
      'A corporate catering relationship with one or two Royal Street office buildings — this recurring weekly revenue insulates the business from foot-traffic variability.',
      'A location near Royal Perth Hospital — hospital staff represent 2,000+ potential daily customers with reliable 7am–8am and 1pm–2pm demand peaks that are predictable year-round.',
      'Speed of service as a product feature: East Perth customers are time-scarce. A café that can produce a specialty coffee in 90 seconds and move a queue of 15 people in 10 minutes has a genuine competitive advantage.',
    ],
    failureScenarios: [
      'Building a weekend brunch model expecting the same demand as an inner-suburb café. East Perth empties on weekends and the economics of a full Saturday operation rarely stack up.',
      'A large fitout and high rent assuming CBD-comparable revenue. East Perth\'s ceiling is lower than the CBD — plan the business for $35,000–$50,000/month revenue, not $70,000+.',
      'Slow service in a suburb where customers have a maximum 7-minute break window. A café that takes 10 minutes per order on a hospital morning rush loses those customers permanently.',
      'Ignoring corporate catering. Walk-in revenue in East Perth can be supplemented significantly by proactive office-supply relationships, and this revenue is weather, traffic, and mood-independent.',
    ],
    whatWouldMakeItBetter: [
      'A pre-order mobile system for hospital staff — this converts a chaotic 7:30am rush into an ordered, high-volume, fast-turn service window with lower error rates and happier customers.',
      'A collaboration with the Claisebrook Cove waterfront events and apartment building managers to supply corporate gift packs and catering at building events.',
    ],
    metaTitle: 'Is East Perth Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in East Perth? Verdict: CAUTION — strong weekday demand but thin weekends. Full analysis, break-even, and the model that actually works in this CBD-fringe suburb.',
    relatedSuburbs: [
      { label: 'Café in West Perth',    suburbSlug: 'west-perth',    citySlug: 'perth', type: 'cafe' },
      { label: 'Restaurant in Northbridge', suburbSlug: 'northbridge', citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Subiaco',       suburbSlug: 'subiaco',       citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 32–58 covers/day Mon–Fri, minimal weekend. Rent from Royal Street listings Q1 2025. Staff: owner + 1 FT Mon–Fri including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · WEST PERTH · CAFÉ ─────────────────────────────────────────────────
  'cafe/perth/west-perth': {
    suburb: 'West Perth', suburbSlug: 'west-perth', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'West Perth is Perth\'s most underrated café market: a dense professional and legal services precinct with thousands of daily office workers, very limited quality café options, and commercial rents below the CBD. A quality café in the right position can achieve break-even within 45 days of opening and build a loyal corporate regular base within 3 months.',
    monthlyRevenue: { low: 28_000, high: 58_000 }, monthlyProfit: { low: 3_500, high: 13_000 },
    monthlyRent: { low: 2_500, high: 6_000 }, rentLevel: 'at-market',
    avgTicket: 15, dailyCustomersNeeded: 44, competitionLevel: 'low', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'West Perth is primarily an office-precinct market. Data from Hay Street and Outram Street commercial listings and CBD-fringe benchmarks, Q1 2025.',
    suburbProfile: 'West Perth is Perth CBD\'s primary office overflow suburb — 4km west of the centre along Hay Street and Outram Street. The suburb houses law firms, mining companies, government agencies, and professional services businesses that house tens of thousands of workers during business hours. The residential population of 4,500 belies a daytime population that is multiples larger. Unlike the CBD itself, West Perth has never developed a quality food and café ecosystem commensurate with its population, creating a persistent gap that quality operators can exploit.',
    demandAnalysis: 'West Perth café demand is one of Australia\'s most predictable: Monday–Friday, 7am–2pm, driven by professional office workers with above-average incomes and strong specialty coffee literacy. The resource sector and legal profession attract high-earning staff who are accustomed to paying $6+ for a specialty coffee. Average ticket of $13–17 is achievable, with a lunch occasion pushing toward $20–25 when food is added. The demand is not aspirational — it is structural and daily. 10,000+ office workers within walking distance is not a variable; it is a fixed asset.',
    competitionAnalysis: 'Competition is genuinely low. West Perth\'s quality café offering is sparse relative to the daytime population it serves — the suburb has historically been overlooked by hospitality operators in favour of Northbridge or Subiaco. The result: corporate workers walk to the CBD for quality coffee or settle for inferior options nearby. A well-positioned café with specialty coffee, fast service, and a simple lunch menu immediately becomes the best option in West Perth by a significant margin and can capture 200+ customers per day within 6 months.',
    rentAnalysis: 'Hay Street and Outram Street commercial rents run $2,500–$6,000/month for ground-floor café positions. At $4,000/month rent with 2 staff (fast-service model), total monthly fixed costs run approximately $13,500. At $15 average ticket and 33% COGS, each customer contributes $10.05. You need 44 customers per trading day across a 5.5-day week. In a precinct with 10,000+ office workers within 400m, capturing 44 customers is a very low bar for a quality operator.',
    customerBehavior: 'West Perth café customers are time-scarce professionals who have made a deliberate choice to come to your café rather than the CBD. They are quality-aware and willing to pay a premium for a coffee that is genuinely better — not aesthetically better — than what they\'ve been getting. Speed is non-negotiable: a West Perth corporate customer will leave a queue that isn\'t moving after 3 minutes. Loyalty is real once earned: the same office worker who comes five times a week for two years is the business\'s financial bedrock. Build for loyalty through consistency, not novelty.',
    successConditions: [
      'A ground-floor position on a Hay Street or Outram Street block frequented by large office tenants. Know which buildings house the most people and position accordingly.',
      'A fast-service system designed for 7–9am peaks: flat-surface espresso bar, clear ordering point, pre-made baked goods that don\'t require assembly time. The morning rush in West Perth is your make-or-break window.',
      'A corporate catering program launched in month one: morning tea, working lunches, board room coffee for the law firms and mining companies. This revenue is bookable, plannable, and insulated from weather and foot traffic.',
      'Quality above all else. West Perth workers are comparing you to the CBD\'s best cafés. If your coffee isn\'t genuinely excellent, the 10-minute walk to the CBD will win.',
    ],
    failureScenarios: [
      'Weekend operating hours that consume staff cost for minimal revenue — West Perth is a ghost town on weekends and the economics rarely justify full operation.',
      'A large food menu that slows service in a suburb where speed is the primary purchase criterion. A 4-item lunch menu served fast beats a 12-item lunch menu served slowly in West Perth.',
      'Ignoring corporate catering. Morning tea and working lunch bookings can add $3,000–$8,000/month in recurring revenue with almost no incremental cost beyond ingredients.',
      'A café concept optimised for experience (ambient music, slow bar, extended menu) rather than efficiency. The West Perth demographic does not linger on weekdays.',
    ],
    whatWouldMakeItBetter: [
      'A pre-order app or website linked to office building management systems — getting coffee pre-ordered and ready for collection removes the queue friction that costs you customers during peak hour.',
      'A monthly corporate account billing system for law firm and company accounts. Corporate customers on monthly accounts spend 40–60% more than walk-in customers and almost never churn.',
    ],
    metaTitle: 'Is West Perth Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in West Perth? Verdict: GO — dense professional precinct, low competition, captive weekday demand. Full analysis, break-even, and the model that works in this corporate suburb.',
    relatedSuburbs: [
      { label: 'Café in East Perth',    suburbSlug: 'east-perth',    citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Subiaco',       suburbSlug: 'subiaco',       citySlug: 'perth', type: 'cafe' },
      { label: 'Restaurant in Northbridge', suburbSlug: 'northbridge', citySlug: 'perth', type: 'restaurant' },
    ],
    dataAssumptions: 'Revenue based on 38–68 covers/day Mon–Fri at $13–17 avg ticket, minimal weekend. Rent from Hay/Outram Street listings Q1 2025. Staff: 2 FT Mon–Fri including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · NEDLANDS · CAFÉ ───────────────────────────────────────────────────
  'cafe/perth/nedlands': {
    suburb: 'Nedlands', suburbSlug: 'nedlands', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Nedlands combines two of Perth\'s most reliable café demand drivers — a major university and a hospital precinct — within a single suburb. The result is dual-shift demand: students and academics in the morning, medical staff and professionals at lunch. Rents are competitive and competition is medium. A focused, quality operator has a clear path to profitability.',
    monthlyRevenue: { low: 29_000, high: 56_000 }, monthlyProfit: { low: 3_500, high: 12_000 },
    monthlyRent: { low: 2_500, high: 6_000 }, rentLevel: 'at-market',
    avgTicket: 17, dailyCustomersNeeded: 40, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Nedlands demand anchors (UWA, QEII) are well-documented. Estimates from Broadway commercial listings and university-precinct hospitality benchmarks, Q1 2025.',
    suburbProfile: 'Nedlands sits 6km west of Perth CBD — a leafy, established suburb home to the University of Western Australia (25,000 students and staff), the QEII Medical Centre (3,000+ staff), and Sir Charles Gairdner Hospital. With a median household income of $105,000, Nedlands is one of Perth\'s wealthiest suburbs. The Broadway retail strip services both the UWA population and the long-established professional families who have lived here for decades. The suburb has two distinct characters: the academic/student zone west of Stirling Highway, and the quiet residential streets east.',
    demandAnalysis: 'Nedlands café demand runs on two independent cycles that, combined, create excellent all-day coverage. UWA drives morning coffee trade from 7am as students and academics arrive, and a strong 10am–2pm work-from-café wave during semester. QEII Medical Centre and Gairdner Hospital drive a consistent weekday 7–9am pre-shift and 12:30–1:30pm lunch demand from medical staff. The challenge: UWA demand drops 30–40% during semester breaks in January and July, while hospital demand is year-round. An operator who plans for semester-break trough with lower staffing and a stronger focus on the medical precinct segment manages the volatility effectively.',
    competitionAnalysis: 'Broadway has a medium density of café operators with one or two clear leaders. The specialty coffee category is not fully served — several Broadway cafés are quality but not specialist. The gap is a café with a serious roaster relationship, alternative milk expertise, and a food program that goes beyond the standard smashed-avo offering. UWA students are coffee-literate and Instagram-active — a café that generates organic UWA social media content has effectively free marketing in a population of 25,000.',
    rentAnalysis: 'Broadway commercial rents run $2,500–$6,000/month for viable café tenancies. Stirling Highway positions are higher. At $4,000/month rent with 2 staff and overheads, total monthly fixed costs run approximately $13,500. At $17 average ticket and 33% COGS, each customer contributes $11.39. You need 40 customers per trading day — well within reach for a quality operator serving both UWA and the hospital precinct.',
    customerBehavior: 'Nedlands café customers split between two distinct behaviours. The UWA student segment: digital-first discovery (Google Maps and Instagram before any other channel), willing to try something new but quick to defect if quality drops, price-sensitive on food but not on specialty coffee. The medical professional segment: time-pressed, routine-driven, quality-expecting, and deeply loyal once a preference is established. Building the medical segment as the business foundation and treating UWA as seasonal upside is the model that creates year-round revenue stability.',
    successConditions: [
      'A Broadway position between UWA and the medical precinct — capturing foot traffic from both anchors simultaneously rather than being positioned to serve only one.',
      'Semester-conscious staffing: full team September–November and February–May, lean team January and July. Don\'t pay full staff cost for 40% demand.',
      'A medical staff loyalty program — simple, fast, and genuinely useful. Hospital workers who have a 20-minute break will choose the café that remembers their order and has it ready.',
      'Quality coffee execution as the primary differentiator. Both the UWA academic and the medical professional segment are quality-discriminating; this is not a market where average is sufficient.',
    ],
    failureScenarios: [
      'Failing to plan for semester breaks. A café on UWA-adjacent Broadway with no hospital segment strategy will face 30–40% demand drops in January and July that can eliminate months of accumulated profit.',
      'Ignoring medical precinct customers in favour of the more visible student segment. QEII and Gairdner staff represent 3,000+ potential daily customers who are more financially stable and less seasonally variable than students.',
      'A student-facing aesthetic and pricing that alienates the suburb\'s high-income residential demographic and medical professionals.',
      'Weak or average coffee in a suburb where the customer base includes academics, many of whom lived in Melbourne or Sydney and carry strong coffee quality benchmarks.',
    ],
    whatWouldMakeItBetter: [
      'A UWA-specific collaboration — supplying the faculty club, catering for academic events, or partnering with the UWA business school for a student card discount program — creates institutional demand that isn\'t weather or mood-dependent.',
      'A grab-and-go format alongside the café setting: medical staff on 15-minute breaks need speed and certainty, not a leisurely experience. A designated fast-track window or pre-order system captures this segment without disrupting the café atmosphere.',
    ],
    metaTitle: 'Is Nedlands Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Nedlands? Verdict: GO — UWA + medical precinct demand, medium competition, at-market rent. Full analysis, break-even, and what works on Broadway.',
    relatedSuburbs: [
      { label: 'Café in Subiaco',       suburbSlug: 'subiaco',       citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Claremont',     suburbSlug: 'claremont',     citySlug: 'perth', type: 'cafe' },
      { label: 'Retail in Claremont',   suburbSlug: 'claremont',     citySlug: 'perth', type: 'retail' },
    ],
    dataAssumptions: 'Revenue based on 34–60 covers/day at $15–19 avg ticket, 6 trading days, semester-weighted. Rent from Broadway listings Q1 2025. Staff: 2 FT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · CLAREMONT · RETAIL ────────────────────────────────────────────────
  'retail/perth/claremont': {
    suburb: 'Claremont', suburbSlug: 'claremont', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'retail', businessLabel: 'Retail Shop',
    verdict: 'GO',
    verdictSummary: 'Claremont is Perth\'s strongest non-CBD retail market — an affluent western-suburbs precinct anchored by Claremont Quarter with one of WA\'s highest retail spending rates. The independent retail strip on Bay View Terrace and St Quentin Avenue supports premium pricing in categories that don\'t overlap with the centre\'s offering.',
    monthlyRevenue: { low: 35_000, high: 80_000 }, monthlyProfit: { low: 4_000, high: 16_000 },
    monthlyRent: { low: 3_500, high: 8_000 }, rentLevel: 'at-market',
    avgTicket: 85, dailyCustomersNeeded: 28, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Claremont is one of Perth\'s best-documented retail precincts. Data from Bay View Terrace commercial listings, CBRE Perth retail benchmarks, and ABS income data for the Claremont SA2, Q1 2025.',
    suburbProfile: 'Claremont sits 9km west of Perth CBD in the heart of Perth\'s established, affluent western suburbs. Claremont Quarter — a 39,000sqm shopping centre with 130+ tenants including premium brands — anchors the suburb\'s retail identity. Bay View Terrace and St Quentin Avenue provide an independent retail strip of boutiques, cafés, and specialty stores serving a resident demographic with a median household income above $95,000. The suburb also hosts Claremont Showgrounds, which generates significant event foot traffic across the year.',
    demandAnalysis: 'Retail demand in Claremont is structural and high-quality. The suburb\'s demographic — affluent western suburbs families, private school parents, high-income professionals — generates spending behaviour that closely resembles inner-Sydney suburbs at a fraction of the rent. Average retail transaction size in Claremont significantly exceeds Perth metro average. The Claremont Quarter drives baseline foot traffic that spills onto Bay View Terrace, benefiting independent retailers who position adjacent to the centre\'s edges. Key retail categories that perform strongly: premium homewares, specialty food, jewellery and accessories, children\'s clothing and gifts.',
    competitionAnalysis: 'The Claremont Quarter occupies all major national retail categories, but the independent strip competes in the space the centre cannot own: bespoke, specialty, and experience-led retail. The Bay View Terrace independents that survive and thrive are those that offer something the centre cannot: a specialist wine merchant, a curated gift store, a children\'s concept store, a local fashion brand with a distinctive POV. A new entrant choosing a category that the Claremont Quarter serves adequately (fast fashion, mass-market cosmetics, chain café) will struggle. A new entrant in a category the centre neglects or cannot execute — specialty foods, artisan homewares, boutique lifestyle — has strong conditions.',
    rentAnalysis: 'Bay View Terrace and St Quentin Avenue commercial rents run $3,500–$8,000/month depending on proximity to Claremont Quarter and floor size. At $5,500/month rent with 1.5 staff (owner + 1 PT), total monthly fixed costs run approximately $16,500. At $85 average ticket and 48% COGS, each transaction contributes $44.20. You need 373 transactions per month — 62 per trading week — to break even. For a specialty retailer in the right category, this is achievable from months three to four as the local regular base builds.',
    customerBehavior: 'Claremont retail customers are deliberate spenders with high quality expectations. They arrive with a category in mind and are comparing you to the best version of that category they\'ve experienced in Sydney, Melbourne, or internationally. They are loyal to retailers who demonstrate expertise, genuine curation, and consistent stock quality — not to those who run promotions. Price sensitivity is low in lifestyle and specialty categories; price resistance is high in categories where they perceive a quality ceiling.',
    successConditions: [
      'A product category that the Claremont Quarter does not serve adequately — specialty wine, artisan homewares, curated children\'s gifts, boutique stationery, local fashion.',
      'A position on Bay View Terrace close to the Claremont Quarter entrance to capture the spill-over foot traffic from shopping centre visitors.',
      'Premium visual merchandising that matches the suburb\'s aesthetic expectations. Claremont windows are noticed and judged — a great window display drives significant walk-in on Bay View Terrace.',
      'An Instagram and digital presence before opening. Claremont\'s social-media-active demographic means your store\'s online presence should precede your physical one by at least 4 weeks.',
    ],
    failureScenarios: [
      'A product category that the Claremont Quarter serves adequately — direct competition with a national retailer at 8× your buying power and 20× your foot traffic is a structural disadvantage.',
      'Generic product at boutique pricing without a clear reason to choose you over the many alternatives this demographic has access to.',
      'Weekend-only trading. Claremont\'s working-parent demographic shops weekday afternoons and Saturday mornings — limited weekday hours leaves significant revenue uncaptured.',
      'A lease commitment above $7,000/month without a proven concept in the Claremont market. Test the concept at a lower rent before upgrading to premium street frontage.',
    ],
    whatWouldMakeItBetter: [
      'A gift wrapping, personalisation, or monogramming service — Claremont\'s gift-buying culture is significant and a differentiated gifting service adds margin without adding floor space.',
      'An events or workshop component (wine tastings, product launches, styling sessions) that creates community and word-of-mouth without advertising spend — and generates direct revenue from otherwise-empty floor time.',
    ],
    metaTitle: 'Is Claremont Good for Retail? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a retail shop in Claremont? Verdict: GO — affluent western suburbs, Claremont Quarter anchor, medium competition. Full analysis for Bay View Terrace and the Perth retail market.',
    relatedSuburbs: [
      { label: 'Retail in Booragoon',   suburbSlug: 'booragoon',     citySlug: 'perth', type: 'retail' },
      { label: 'Café in Claremont',     suburbSlug: 'claremont',     citySlug: 'perth', type: 'cafe' },
      { label: 'Café in Cottesloe',     suburbSlug: 'cottesloe',     citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 22–50 daily transactions at $70–100 avg ticket, 6 trading days. Rent from Bay View Terrace/St Quentin Ave listings Q1 2025. Staff: owner + 1 PT including Super. COGS 48%. Profit pre-tax, owner wage included in staff cost.',
    lastUpdated: 'Q1 2025',
  },


  // ── PERTH · APPLECROSS · RESTAURANT ──────────────────────────────────────────
  'restaurant/perth/applecross': {
    suburb: 'Applecross', suburbSlug: 'applecross', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'restaurant', businessLabel: 'Restaurant / Bistro',
    verdict: 'GO',
    verdictSummary: 'Applecross is Perth\'s highest-income southern suburb — a tight, quality-demanding community with excellent spending power and a restaurant market that is significantly underserved relative to what the demographic will pay. A quality mid-to-premium restaurant concept has a genuine path to becoming the suburb\'s default fine-casual dining destination.',
    monthlyRevenue: { low: 50_000, high: 105_000 }, monthlyProfit: { low: 6_000, high: 21_000 },
    monthlyRent: { low: 2_800, high: 6_000 }, rentLevel: 'at-market',
    avgTicket: 75, dailyCustomersNeeded: 34, competitionLevel: 'low', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'Applecross restaurant market is smaller and less documented than inner Perth. Estimates from Canning Highway commercial listings and southern-suburbs demographic benchmarks, Q1 2025.',
    suburbProfile: 'Applecross sits on the southern bank of the Swan River, 9km from Perth CBD. With a median household income above $112,000 — among the highest in WA — and a predominantly established, owner-occupier demographic of families and executives, Applecross has extraordinary restaurant spending potential. Canning Highway and Riseley Street support a compact retail and hospitality strip. The suburb\'s quiet, river-adjacent character means its residents tend to dine locally when the quality is right, rather than driving to Subiaco.',
    demandAnalysis: 'Applecross restaurant demand is quality-gated: the suburb\'s demographic will spend $80–100/head at a restaurant they believe in but will not tolerate mediocrity at any price. When the quality is there, frequency of dining is high — this is an income bracket that goes to dinner twice a week as a household norm. The riverside location creates a strong Thursday–Sunday dinner trade with the Swan River as a backdrop, and a Saturday lunch market that is genuinely premium. Corporate dinners and milestone celebrations are significant — Applecross households host professional networks and expect nearby restaurant options for these occasions.',
    competitionAnalysis: 'Competition is low — Applecross is meaningfully underserved for quality dining relative to its income profile. The Canning Highway strip has a handful of established cafés and casual restaurants, but no operator that occupies the fine-casual segment ($70–90/head, quality wine list, serious kitchen) that this demographic travels to Subiaco or South Perth to access. Being the best restaurant in Applecross is the business proposition — and in a suburb of this income level, "best" is very well rewarded with loyalty and referral.',
    rentAnalysis: 'Canning Highway and Riseley Street commercial rents run $2,800–$6,000/month for viable restaurant tenancies. At $4,500/month rent with 3 staff and standard overheads, total monthly fixed costs run approximately $25,000. At $75 average ticket and 35% COGS, each cover contributes $48.75. You need 513 covers/month — 34 per active trading day across 5 days. For a restaurant that is the suburb\'s clear quality leader, this is achievable and leaves meaningful margin.',
    customerBehavior: 'Applecross restaurant customers have high baseline expectations and are acutely quality-discriminating. They will spend generously when food, wine, and service meet their standard — but they are precise critics when the experience falls short and their Google Review will reflect it. They value personalised service and treating regulars as known guests more than any other hospitality market in Perth. An Applecross restaurant owner who is visible, who learns names, and who genuinely demonstrates care for the dining experience builds loyalty that is extraordinarily durable.',
    successConditions: [
      'A concept at $70–90/head in the fine-casual segment — not a pub bistro, not a formal fine dining restaurant, but the quality-confident middle ground that Applecross households look for on a Wednesday evening.',
      'A wine program with depth and genuine knowledge — Applecross customers are wine-literate professionals who will appreciate a thoughtful, explained wine list more than a 200-bottle volume approach.',
      'A Canning Highway or Riseley Street position with parking — unlike inner-suburb dining, Applecross customers drive to dinner and a restaurant without accessible parking loses a material share of its potential market.',
      'Private dining capacity for corporate and celebration occasions. The suburb\'s income bracket generates regular high-value bookings — a semi-private table or dining room is directly revenue-generating.',
    ],
    failureScenarios: [
      'A concept priced above $100/head without an established reputation. Applecross diners will pay premium prices once trust is earned, not before — build reputation at $70–85/head first.',
      'Inconsistent quality. This demographic\'s loyalty is intense but fragile — two or three substandard experiences within a month will break a habit that took a year to build.',
      'A generic offering at any price point. There is no benefit in Applecross to being the suburb\'s second-quality restaurant — the category "best" carries all the loyalty.',
      'Poor Google Review management. Applecross diners search before they visit and check reviews in detail — a 3.9 rating in this suburb has a disproportionate negative impact versus what the same rating would mean in a tourist suburb.',
    ],
    whatWouldMakeItBetter: [
      'A chef\'s table or open-kitchen design element — Applecross\'s food-literate demographic engages with culinary process and it creates an in-restaurant conversation that generates social media content organically.',
      'A monthly wine dinner or curated event program to fill midweek covers and build the restaurant\'s community of regulars. These events generate 30–40% higher per-head revenue than standard à la carte and build loyalty efficiently.',
    ],
    metaTitle: 'Is Applecross Good for a Restaurant? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a restaurant in Applecross? Verdict: GO — Perth\'s highest-income suburb, low competition, strong riverside dining demand. Full analysis and break-even for Canning Highway.',
    relatedSuburbs: [
      { label: 'Restaurant in Subiaco',   suburbSlug: 'subiaco',     citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Applecross',      suburbSlug: 'applecross',  citySlug: 'perth', type: 'cafe' },
      { label: 'Café in South Perth',     suburbSlug: 'south-perth', citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 25–50 covers/service, dinner Thu–Sun plus Sat lunch, $70–90 avg ticket. Rent from Canning Highway/Riseley Street listings Q1 2025. Staff: 2 FT + 2 casual including Super. COGS 35%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · COMO · CAFÉ ───────────────────────────────────────────────────────
  'cafe/perth/como': {
    suburb: 'Como', suburbSlug: 'como', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Como is one of inner Perth\'s most overlooked café markets — a leafy, riverside suburb with genuinely lower rents than its neighbours and a professional, family-oriented demographic that is spending its café budget in Applecross and South Perth for want of better local options. The first genuinely quality operator on Preston Street becomes the default suburb café.',
    monthlyRevenue: { low: 24_000, high: 48_000 }, monthlyProfit: { low: 3_000, high: 11_000 },
    monthlyRent: { low: 1_800, high: 4_500 }, rentLevel: 'below-market',
    avgTicket: 17, dailyCustomersNeeded: 34, competitionLevel: 'low', demandScore: 7,
    confidenceLevel: 'medium',
    confidenceNote: 'Como is a smaller and less-documented market. Estimates from Preston Street commercial listings and southern-suburbs benchmarks, Q1 2025.',
    suburbProfile: 'Como is a residential inner suburb 6km south of Perth CBD, bounded by the Swan River to the west and Curtin University to the east. Preston Street is the main commercial artery — a quiet, pleasant strip of independent businesses, a handful of cafés, and a neighbourhood feel that is genuinely different from the more commercial strips of South Perth or Applecross. The suburb houses 10,000 residents of mixed demographic: Curtin students in rental apartments toward the university end, families and professionals in the river-proximate pockets, and a growing base of first-home buyers who have chosen Como for value.',
    demandAnalysis: 'Como café demand is neighbourhood-scale and loyalty-dependent. The suburb does not generate destination traffic from outside — customers are almost entirely residents and those passing through to the university or river. Within that resident catchment, however, the demand for a quality café is real and currently unmet. Como residents are spending their weekend café budget in South Perth or Applecross, driving 5km for a decent flat white. An operator who provides that quality locally captures not just their coffee but their brunch occasion and their midweek work-from-café session.',
    competitionAnalysis: 'Competition is low. Preston Street has a small number of café operators but none has established the quality reputation that would give residents a reason to stay local. The suburb\'s close proximity to better-serviced Applecross and South Perth means there is a quality expectation ceiling — if you can\'t match the coffee quality available 5 minutes away, Como residents will keep driving.',
    rentAnalysis: 'Preston Street commercial rents run $1,800–$4,500/month — among the lowest for residential inner-suburb café markets in Perth. At $2,800/month rent with a lean owner + 1 PT staff model, total monthly fixed costs run approximately $9,500. At $17 average ticket and 33% COGS, each customer contributes $11.39. You need 34 customers per trading day — achievable from month two for a quality operator in a suburb with no strong incumbent.',
    customerBehavior: 'Como café customers are neighbourhood loyalists who want a quality local option. They are quality-discriminating (they\'ve been drinking good coffee in Applecross) but community-loyal — they will actively switch their Saturday morning to a Como café that earns their respect, simply because it is local. They respond strongly to familiarity and recognition, and weakly to marketing. The Curtin student segment provides additional volume during semester but is more price-sensitive than the resident demographic.',
    successConditions: [
      'Consistent specialty coffee quality that matches or exceeds what the suburb\'s residents currently drive to Applecross to find.',
      'A visible Preston Street presence with outdoor seating — Como\'s residential character means discovery comes from walking past, not from search.',
      'Community presence from week one — the Como Facebook community group, the local school networks, the river-walk community. Como rewards operators who are visibly part of the suburb.',
      'A lean cost model: owner-operator + 1 PT staff, 7am–2pm hours, focused menu. The suburb\'s revenue ceiling is lower than Applecross; the cost structure must reflect it.',
    ],
    failureScenarios: [
      'A fit-out investment above $80,000 in a market where revenue ceiling limits payback period to 3+ years.',
      'Average coffee quality in a suburb where the competition is not on Preston Street but is 5 minutes away in Applecross.',
      'A large menu requiring 3 staff to execute in a small-market café that cannot sustain that labour cost.',
      'Ignoring the Curtin University connection — the university end of Como has thousands of students who represent a meaningful additional revenue stream during semester.',
    ],
    whatWouldMakeItBetter: [
      'A Curtin University student discount or loyalty program to build the semester-time student base as a complementary revenue stream to the resident morning trade.',
      'A Saturday morning walk-up window serving the Como foreshore and river-walk crowd — this captures the outdoor lifestyle audience at the week\'s peak traffic moment without requiring table space.',
    ],
    metaTitle: 'Is Como Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Como? Verdict: GO — low competition, below-market rent, underserved professional demographic. Full analysis for Preston Street and Perth\'s inner south café market.',
    relatedSuburbs: [
      { label: 'Café in South Perth',   suburbSlug: 'south-perth',  citySlug: 'perth', type: 'cafe' },
      { label: 'Restaurant in Applecross', suburbSlug: 'applecross', citySlug: 'perth', type: 'restaurant' },
      { label: 'Café in Victoria Park', suburbSlug: 'victoria-park', citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 26–50 covers/day at $15–19 avg ticket, 6 trading days. Rent from Preston Street listings Q1 2025. Staff: owner + 1 PT including Super. COGS 33%. Profit pre-tax, owner wage included in staff.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · BOORAGOON · RETAIL ────────────────────────────────────────────────
  'retail/perth/booragoon': {
    suburb: 'Booragoon', suburbSlug: 'booragoon', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'retail', businessLabel: 'Retail Shop',
    verdict: 'CAUTION',
    verdictSummary: 'Garden City dominates Booragoon\'s retail environment with 350+ tenants — extraordinary foot traffic but extreme competition from national chains. Independent retail adjacent to Garden City is viable only in categories the centre doesn\'t serve well: specialty, experiential, or locally-specific. A category that Garden City serves adequately will not survive outside it.',
    monthlyRevenue: { low: 30_000, high: 75_000 }, monthlyProfit: { low: 2_500, high: 14_000 },
    monthlyRent: { low: 3_500, high: 10_000 }, rentLevel: 'above-market',
    avgTicket: 70, dailyCustomersNeeded: 35, competitionLevel: 'high', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Booragoon retail market is anchored by Garden City, one of WA\'s most documented retail precincts. Data from Garden City Drive commercial listings and CBRE Perth retail benchmarks, Q1 2025.',
    suburbProfile: 'Booragoon is 12km south of Perth CBD — a suburban hub built around Garden City Shopping Centre, one of Western Australia\'s largest retail destinations with 350+ stores, 5,000+ car bays, and significant annual foot traffic. The resident population of 8,000 is supplemented by a large catchment of southern suburbs shoppers for whom Garden City is the primary retail destination. Median household income of $84,000 is above Perth average.',
    demandAnalysis: 'Retail demand in Booragoon is generated almost entirely by Garden City\'s foot traffic. The centre drives 10+ million visits per year — Saturday traffic volume rivals small CBD shopping districts. Adjacent strip retail benefits directly from centre overflow: a tenant on Garden City Drive adjacent to a centre entry captures genuine centre-level foot traffic at lower rent. The challenge is that Garden City itself satisfies most retail demand categories, leaving a narrow but real opportunity for independents in complementary niches.',
    competitionAnalysis: 'The competitive challenge in Booragoon is unusual: your direct competitors are not other independents but the 350+ retailers inside Garden City itself. A new independent retailer positioned opposite or adjacent to the centre must offer something the centre cannot: ultra-specialty product, personalised service, or a local identity that a national chain cannot replicate. Operators who have succeeded near Garden City cluster in: specialty food and produce, artisan services (tailoring, custom jewellery, specialist repairs), and children\'s concept retail with a community dimension.',
    rentAnalysis: 'Retail rents adjacent to Garden City run $3,500–$10,000/month depending on proximity and frontage. At $5,000/month with 1.5 staff, total monthly fixed costs run approximately $16,500. At $70 average ticket and 48% COGS, each transaction contributes $36.40. You need 454 transactions/month — approximately 75 per trading week. This is achievable if you are in a high-foot-traffic position and in a category that generates genuine repeat traffic rather than one-time purchases.',
    customerBehavior: 'Booragoon retail customers arrive primarily for Garden City and are available for adjacent discovery only if your window display, signage, or entrance immediately communicates a clear reason to enter. They are browsing for something specific within the centre\'s ecosystem — adjacent retailers must intercept this intent with a complementary, not competing, proposition. Loyalty in Booragoon\'s strip retail is lower than in neighbourhood strips because the primary shopping habit centres on the mall, not the street.',
    successConditions: [
      'A product category that Garden City\'s tenants do not serve adequately: specialty wine, artisan gifts, bespoke children\'s products, quality cheese and charcuterie, or complementary health services.',
      'A prominent position on Garden City Drive adjacent to a major entry point, with compelling visual merchandising that intercepts centre traffic organically.',
      'Extended Saturday hours to maximise the shopping centre\'s peak trading day — Saturday at Garden City generates 25–30% of weekly visitor volume.',
      'A loyalty or subscription component to convert one-time adjacent traffic into repeat customers who return for the independent experience, not just centre overflow.',
    ],
    failureScenarios: [
      'A product category well-served by Garden City\'s existing tenants — competing with a national chain at twice their buying power with one tenth of their foot traffic.',
      'Premium rent commitments ($7,500+/month) without a clear independent draw. Adjacent rent in Booragoon is correlated with centre proximity, not independent retail performance.',
      'Relying on foot traffic discovery alone without a Google Maps listing and Instagram presence. A significant portion of Garden City visitors plan their shopping before arrival — be discoverable before they park.',
      'A generic retail experience that provides no reason to choose you over the centre\'s equivalent category offering.',
    ],
    whatWouldMakeItBetter: [
      'A "shop local" positioning within the broader Booragoon community — appealing to residents\' desire to support local business rather than positioning against the national retailers in the centre.',
      'An in-store experience or service component that Garden City cannot offer: custom engraving, product personalisation, a repair service, or an in-store class — turning the retail visit into something the centre cannot replicate.',
    ],
    metaTitle: 'Is Booragoon Good for Retail? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a retail shop in Booragoon? Verdict: CAUTION — Garden City dominates, but adjacent independents can thrive in categories the centre underserves. Full analysis for Perth\'s southern retail hub.',
    relatedSuburbs: [
      { label: 'Retail in Claremont',   suburbSlug: 'claremont',   citySlug: 'perth', type: 'retail' },
      { label: 'Retail in Joondalup',   suburbSlug: 'joondalup',   citySlug: 'perth', type: 'retail' },
      { label: 'Retail in Morley',      suburbSlug: 'morley',       citySlug: 'perth', type: 'retail' },
    ],
    dataAssumptions: 'Revenue based on 22–50 daily transactions at $60–85 avg ticket, 6 trading days Saturday-weighted. Rent from Garden City Drive listings Q1 2025. Staff: owner + 1 PT including Super. COGS 48%. Profit pre-tax, owner wage included in staff.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · JOONDALUP · RETAIL ────────────────────────────────────────────────
  'retail/perth/joondalup': {
    suburb: 'Joondalup', suburbSlug: 'joondalup', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'retail', businessLabel: 'Retail Shop',
    verdict: 'GO',
    verdictSummary: 'Joondalup is Perth\'s northern regional centre — a planned city with a hospital, university, train station, and shopping precinct that together generate genuine all-day foot traffic. Rents are lower than inner Perth for equivalent catchment size, and population growth in the northern corridor continues to expand the customer base.',
    monthlyRevenue: { low: 28_000, high: 65_000 }, monthlyProfit: { low: 3_000, high: 13_000 },
    monthlyRent: { low: 2_500, high: 6_000 }, rentLevel: 'at-market',
    avgTicket: 72, dailyCustomersNeeded: 28, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'high',
    confidenceNote: 'Joondalup is a well-documented regional centre. Data from Boas Avenue commercial listings and Lakeside Joondalup foot traffic data, Q1 2025.',
    suburbProfile: 'Joondalup sits 26km north of Perth CBD — WA\'s planned northern strategic centre. Lakeside Joondalup Shopping City (230+ stores) is the primary retail anchor, supplemented by ECU\'s Joondalup campus (22,000 students and staff), Joondalup Health Campus (one of WA\'s busiest hospitals), and the Joondalup train station hub. The Boas Avenue and Reid Promenade pedestrian precinct functions as the suburb\'s town centre strip. Northern suburbs population growth has expanded Joondalup\'s catchment significantly in the past decade.',
    demandAnalysis: 'Retail demand in Joondalup is anchored by three independent customer sources that operate on different schedules: the shopping centre draw (weekends primarily), the university population (semester weekdays), and the hospital precinct (year-round, all hours). This combination produces more consistent all-day, all-week trading than many comparable suburban retail markets. Average retail transaction size is slightly below inner Perth levels — Joondalup\'s demographic is cost-aware but growing — but volume compensates for ticket size in a market with this catchment density.',
    competitionAnalysis: 'Competition is medium. Lakeside Joondalup covers most national chain categories, but the pedestrian strip and surrounding commercial zone supports independent retail in categories the centre doesn\'t own. Health and wellness, specialty food, trade and professional services, and community-oriented retail are underrepresented by the Joondalup centre\'s national-chain tenancy mix. These are the segments available to independent operators.',
    rentAnalysis: 'Boas Avenue and Reid Promenade commercial rents run $2,500–$6,000/month for quality retail positions. At $4,000/month rent with 1.5 staff, total monthly fixed costs run approximately $13,000. At $72 average ticket and 48% COGS, each transaction contributes $37.44. You need 347 transactions/month — approximately 58 per trading week. Achievable for a specialist retailer in the right category with the ECU and hospital catchment.',
    customerBehavior: 'Joondalup retail customers span a wide demographic range — students, hospital workers, families, retirees — which creates both opportunity (broad appeal) and risk (no single clear customer). Successful operators in Joondalup\'s strip identify their specific segment and serve it with clarity rather than trying to appeal to everyone. Health and wellness businesses perform particularly well because the hospital precinct normalises health-related spending.',
    successConditions: [
      'A clearly defined customer segment within Joondalup\'s broad demographic range — not trying to appeal to everyone, but owning a specific niche for ECU students, hospital staff, or active families.',
      'A position on Boas Avenue or Reid Promenade within the established pedestrian zone — Joondalup\'s strip retail depends on the pedestrian flow that the town centre precinct generates.',
      'A health and wellness positioning that aligns with the hospital precinct\'s demographic impact — Joondalup\'s health-literate population over-indexes for health-related retail spending.',
      'Weekend trading that aligns with the Lakeside Joondalup shopping day — Saturday is the highest-volume day in the Joondalup strip by a significant margin.',
    ],
    failureScenarios: [
      'A product category that Lakeside Joondalup\'s tenants serve adequately — independent retail cannot compete with national chains in shared categories at this level of foot traffic differential.',
      'A premium price positioning that the Joondalup demographic, skewed toward families and students rather than high-income professionals, does not fully support.',
      'Operating hours that don\'t align with the hospital\'s shift patterns — hospital workers shop at unusual hours and a retailer that closes at 5pm loses this segment entirely.',
      'Ignoring the ECU student segment as "too young." ECU\'s 22,000 students represent a significant daily foot traffic source and a category-specific spending population that many Joondalup operators overlook.',
    ],
    whatWouldMakeItBetter: [
      'An ECU student discount or term-time promotion to build the university regular base and create a social media presence in the student community at zero marketing cost.',
      'A hospital staff partnership — providing a uniform or staff-card discount creates institutional loyalty and turns the hospital into a referral network rather than just a passing demographic.',
    ],
    metaTitle: 'Is Joondalup Good for Retail? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a retail shop in Joondalup? Verdict: GO — hospital, university, and shopping centre anchor, growing northern corridor. Full analysis for Perth\'s northern regional centre.',
    relatedSuburbs: [
      { label: 'Retail in Morley',       suburbSlug: 'morley',      citySlug: 'perth', type: 'retail' },
      { label: 'Retail in Booragoon',    suburbSlug: 'booragoon',   citySlug: 'perth', type: 'retail' },
      { label: 'Café in Midland',        suburbSlug: 'midland',     citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 20–45 daily transactions at $62–82 avg ticket, 6 trading days Saturday-weighted. Rent from Boas Avenue/Reid Promenade listings Q1 2025. Staff: owner + 1 PT including Super. COGS 48%. Profit pre-tax, owner wage included.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · MIDLAND · CAFÉ ────────────────────────────────────────────────────
  'cafe/perth/midland': {
    suburb: 'Midland', suburbSlug: 'midland', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'GO',
    verdictSummary: 'Midland is Perth\'s clearest emerging café opportunity. The new St John of God Hospital has transformed the suburb\'s daytime demand profile, rents are the lowest in the metro area, and competition is minimal. An operator entering now locks in pre-gentrification lease rates at exactly the moment when demand is beginning its most significant structural uplift.',
    monthlyRevenue: { low: 20_000, high: 42_000 }, monthlyProfit: { low: 2_500, high: 9_000 },
    monthlyRent: { low: 1_500, high: 4_000 }, rentLevel: 'below-market',
    avgTicket: 14, dailyCustomersNeeded: 36, competitionLevel: 'low', demandScore: 7,
    confidenceLevel: 'medium',
    confidenceNote: 'Midland is an emerging market undergoing structural transformation. Estimates from Great Northern Highway commercial listings and hospital precinct benchmarks, Q1 2025.',
    suburbProfile: 'Midland is 17km northeast of Perth CBD — historically a working-class industrial suburb that has been significantly upgraded by the 2015 opening of St John of God Midland Public Hospital (430 beds, 3,000+ staff) and the ongoing Midland Gate Shopping Centre expansion. The suburb\'s residential population of 21,000 is predominantly working-class families, but the hospital and railway station have dramatically altered the suburb\'s daytime demographic. A proposed arts and cultural precinct and the Midland Atelier development signal continued investment.',
    demandAnalysis: 'Midland café demand is led by hospital staff — a reliable, year-round, shift-working customer base that requires coffee at unusual hours and creates consistent demand even on weekdays. St John of God\'s 3,000 staff represent Midland\'s most significant café demand driver, followed by Midland Gate shoppers (weekend) and Midland Train Station commuters (weekday mornings). Average ticket of $12–16 reflects the suburb\'s working-class demographic, but hospital staff skew higher — a specialty flat white at $5.50 is normal for a medical professional even in a working-class suburb.',
    competitionAnalysis: 'Competition is genuinely low. Midland has minimal quality café options relative to its daytime population. The hospital precinct — 3,000 staff who need coffee every day — is served almost entirely by a hospital canteen and a small number of undistinguished nearby cafés. A quality operator adjacent to the hospital entrance could realistically become the default coffee choice for hundreds of daily regular customers within three months of opening.',
    rentAnalysis: 'Midland commercial rents are Perth\'s lowest metro market. Great Northern Highway and hospital-adjacent positions run $1,500–$4,000/month. At $2,500/month rent with 1.5 staff, total monthly fixed costs run approximately $9,000. At $14 average ticket and 33% COGS, each customer contributes $9.38. You need 36 customers per trading day — achievable from week three for a café positioned for hospital-staff access.',
    customerBehavior: 'Midland café customers are value-conscious but willing to pay for quality when quality is demonstrated. Hospital staff — the core demand segment — are time-pressed on shift transitions, familiar with specialty coffee from their training (often in Melbourne or Sydney hospitals), and intensely habitual once a preference is formed. They visit daily and tip generously when service is fast and consistent. The broader Midland demographic is more price-sensitive; a two-tier menu (specialty coffee at premium, standard coffee at accessible price) can serve both.',
    successConditions: [
      'A position within 200m of the St John of God Hospital main entrance — proximity to the hospital is the single most important location factor in Midland.',
      'Extended operating hours (5:30am–6pm) to capture both early-morning and late-afternoon shift changes — hospital workers don\'t arrive and leave at standard retail hours.',
      'Efficient service: hospital staff have 10–15 minute breaks. A café that serves a specialty coffee in 90 seconds and clears a queue of 8 in 5 minutes will be preferred over a quality café that takes 4 minutes per order.',
      'Intentionally low rent: sign a 3-year lease at or below $3,000/month and treat the next 3 years as the window before rents inevitably rise with the suburb.',
    ],
    failureScenarios: [
      'A café concept designed for a demographic that Midland doesn\'t yet have in significant numbers — a $30 brunch plate or $48/head restaurant concept is too far ahead of where the suburb currently sits.',
      'Positioning on the retail strip away from the hospital. Foot traffic in Midland is hospital and train station-anchored; the traditional retail strip has lower and less-predictable pedestrian counts.',
      'Standard retail hours (9am–5pm) that miss both the pre-shift 6–7am rush and the post-shift 4–6pm demand.',
      'Not adjusting for the working-class price sensitivity on the food menu. Quality coffee at specialty prices is acceptable in Midland; $22 brunch plates are not — yet.',
    ],
    whatWouldMakeItBetter: [
      'A pre-order system or app for hospital staff — a text-order system (even a simple WhatsApp order line) removes queue friction for time-pressed shift workers and creates predictable order flow.',
      'A hospital staff loyalty card with a 10th coffee free — simple, high-repeat-rate, and the single most effective retention tool for a daily-habit product in a captive-audience market.',
    ],
    metaTitle: 'Is Midland Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Midland? Verdict: GO — hospital precinct demand, lowest rents in Perth metro, low competition. Full analysis for this emerging eastern Perth café market.',
    relatedSuburbs: [
      { label: 'Café in Morley (nearby)',  suburbSlug: 'morley',     citySlug: 'perth', type: 'cafe' },
      { label: 'Retail in Joondalup',     suburbSlug: 'joondalup',  citySlug: 'perth', type: 'retail' },
      { label: 'Café in Armadale',        suburbSlug: 'armadale',   citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 28–52 covers/day at $12–16 avg ticket, 6 trading days, hospital-weighted. Rent from Great Northern Highway/hospital precinct listings Q1 2025. Staff: owner + 1 PT including Super. COGS 33%. Profit pre-tax, no owner wage.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · MORLEY · RETAIL ───────────────────────────────────────────────────
  'retail/perth/morley': {
    suburb: 'Morley', suburbSlug: 'morley', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'retail', businessLabel: 'Retail Shop',
    verdict: 'GO',
    verdictSummary: 'Morley is Perth\'s strongest northern suburban retail market outside Joondalup. Galleria Shopping Centre anchors consistent high-volume foot traffic and the surrounding Walter Road strip supports independent retail at rents well below equivalent southern-suburbs markets. The suburb\'s multicultural demographic creates demand for product categories underserved by national chains.',
    monthlyRevenue: { low: 24_000, high: 58_000 }, monthlyProfit: { low: 2_500, high: 11_000 },
    monthlyRent: { low: 2_000, high: 5_500 }, rentLevel: 'below-market',
    avgTicket: 65, dailyCustomersNeeded: 28, competitionLevel: 'medium', demandScore: 8,
    confidenceLevel: 'medium',
    confidenceNote: 'Morley retail market is anchored by Galleria. Data from Walter Road commercial listings and northern suburbs retail benchmarks, Q1 2025.',
    suburbProfile: 'Morley is 10km northeast of Perth CBD — a northern suburban hub anchored by Galleria Shopping Centre (180+ stores), a major bus station, and strong multicultural community character. The suburb\'s 15,000 residents are predominantly working families from diverse backgrounds, with a significant East and Southeast Asian community that creates demand for specialty food, cultural retail, and community-oriented services not typically served by mainstream national chains.',
    demandAnalysis: 'Retail demand in Morley is driven by Galleria\'s significant foot traffic (estimated 12M+ annual visits) and the density of the northern suburb residential catchment. Walter Road\'s independent strip benefits from Galleria proximity without paying Galleria rents. The suburb\'s multicultural demographic creates genuine demand gaps: specialty Asian groceries and ingredients, cultural gift and homeware retailers, specialty food processors, and community-oriented service businesses. These niches are not competitive with Galleria\'s national chain tenancy.',
    competitionAnalysis: 'Competition for independent retail in Morley is medium. Galleria dominates the mainstream categories but leaves clear gaps in specialty and community-oriented retail that the suburb\'s demographic demands. Walter Road has a mix of long-established independents and newer operators, with clear spaces in the specialty food, artisan homeware, and cultural services categories.',
    rentAnalysis: 'Walter Road commercial rents run $2,000–$5,500/month — significantly below southern suburbs equivalents for comparable catchment size. At $3,500/month rent with 1.5 staff, total monthly fixed costs run approximately $12,000. At $65 average ticket and 48% COGS, each transaction contributes $33.80. You need 355 transactions/month — approximately 59 per trading week. For a specialty retailer with a clear niche in this demographic, achievable.',
    customerBehavior: 'Morley retail customers are community-oriented and respond to genuine diversity representation in product and service. The suburb\'s East and Southeast Asian demographic actively seeks retailers who understand their specific needs — specialty ingredient retailers, cultural gift businesses, and service providers who communicate in community languages generate stronger loyalty than equivalent mainstream operators. Morley customers also demonstrate strong family-unit purchasing behaviour — products and services that appeal to multiple family members outperform individual-focused concepts.',
    successConditions: [
      'A product category aligned with Morley\'s multicultural demographic: specialty Asian pantry, cultural gifts and homewares, artisan food services, or community-oriented services.',
      'A Walter Road position with Galleria proximity — the centre\'s foot traffic creates a baseline of street-level activity that adjacent independents benefit from.',
      'Community-authentic positioning: Morley\'s diverse community supports operators who genuinely engage with the cultural needs of the suburb rather than applying a generic retail formula.',
      'Weekend peak activation — Saturday is Morley\'s highest-traffic day as Galleria draws shoppers from across the northern suburbs.',
    ],
    failureScenarios: [
      'A product category that Galleria serves adequately with national-chain scale and buying power.',
      'A premium positioning that Morley\'s predominantly working-family demographic cannot sustain as a regular purchase.',
      'Operating hours that don\'t align with Galleria\'s trading windows — Galleria drives street-level activity and closing while the centre is open loses the primary foot-traffic period.',
      'Ignoring the suburb\'s cultural diversity as a market segment. A generic, mainstream product aimed at the "average Australian" customer misses Morley\'s most underserved and community-loyal demographic.',
    ],
    whatWouldMakeItBetter: [
      'A community event or food pop-up that creates social media activity within the Morley multicultural community — authentic community engagement costs nothing and generates more discovery than paid advertising in this suburb.',
      'A loyalty scheme with multilingual capability — even a simple bilingual loyalty card signals cultural respect and generates disproportionate loyalty from community-conscious customers.',
    ],
    metaTitle: 'Is Morley Good for Retail? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a retail shop in Morley? Verdict: GO — Galleria anchor, multicultural demand gaps, below-market rent. Full analysis for Perth\'s northern retail hub.',
    relatedSuburbs: [
      { label: 'Retail in Joondalup',   suburbSlug: 'joondalup',   citySlug: 'perth', type: 'retail' },
      { label: 'Retail in Booragoon',   suburbSlug: 'booragoon',   citySlug: 'perth', type: 'retail' },
      { label: 'Café in Midland',       suburbSlug: 'midland',     citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 18–42 daily transactions at $55–75 avg ticket, 6 trading days Saturday-weighted. Rent from Walter Road listings Q1 2025. Staff: owner + 1 PT including Super. COGS 48%. Profit pre-tax, owner wage included.',
    lastUpdated: 'Q1 2025',
  },

  // ── PERTH · ARMADALE · CAFÉ ───────────────────────────────────────────────────
  'cafe/perth/armadale': {
    suburb: 'Armadale', suburbSlug: 'armadale', city: 'Perth', citySlug: 'perth', state: 'WA',
    businessType: 'cafe', businessLabel: 'Café / Coffee Shop',
    verdict: 'CAUTION',
    verdictSummary: 'Armadale has the lowest commercial rents in the Perth metro area and a large growing residential base — but current average incomes and café spending norms are below inner-Perth equivalents. The Metronet extension is a genuine transformative catalyst. An operator who enters now at low rent and builds a loyal base before the rail opens has the best structural position.',
    monthlyRevenue: { low: 16_000, high: 35_000 }, monthlyProfit: { low: 1_500, high: 7_000 },
    monthlyRent: { low: 1_200, high: 3_500 }, rentLevel: 'below-market',
    avgTicket: 13, dailyCustomersNeeded: 34, competitionLevel: 'low', demandScore: 6,
    confidenceLevel: 'medium',
    confidenceNote: 'Armadale is an emerging market with limited hospitality comparables. Estimates from Armadale Road commercial listings and outer-suburb hospitality benchmarks, Q1 2025.',
    suburbProfile: 'Armadale is 30km southeast of Perth CBD — Perth\'s southeastern growth corridor and one of the fastest-growing residential areas in WA. The suburb\'s 25,000 residents are predominantly working families and first-home buyers with a working-class income profile (median $62,000). The suburb has historically had minimal café culture — most residents drive to Cannington or Fremantle for a quality experience — but this is beginning to change as the residential demographic expands. The Metronet rail extension (expected 2025–26) will significantly improve CBD access and typically catalyses local hospitality development in outer suburbs.',
    demandAnalysis: 'Armadale café demand is growing but has not yet reached the structural density of inner or middle suburbs. The residential expansion is driving new families into the suburb who expect café amenity they previously had elsewhere. Current demand is anchored by Armadale Shopping City foot traffic, Armadale Road passing traffic, and a small existing local regular base. The Metronet rail connection, when completed, will create a commuter segment that does not currently exist — early-morning CBD-commuter coffee demand is one of the most reliable café revenue streams in any suburb, and Armadale currently has almost none.',
    competitionAnalysis: 'Competition is low — Armadale has very limited quality café options. The Armadale Shopping City food court and a small number of basic nearby cafés constitute the current market. There is no specialty coffee operator, no quality brunch destination, and no café that would give inner-Perth-accustomed new residents a reason to stay local rather than driving to Cannington. Being the first quality café in Armadale is a structurally advantaged position — limited competition, growing residential base, and a pre-Metronet lease price.',
    rentAnalysis: 'Armadale commercial rents are Perth\'s most affordable: $1,200–$3,500/month depending on position and size. At $2,000/month rent with a lean owner + 1 PT model, total monthly fixed costs run approximately $8,000. At $13 average ticket and 33% COGS, each customer contributes $8.71. You need 34 customers per trading day. In a suburb with 25,000 residents and no quality incumbent, this is achievable — but the growth timeline to a comfortable business requires patience and the right concept.',
    customerBehavior: 'Armadale café customers are price-sensitive but loyalty-oriented. They respond strongly to value — $4.50 for a quality coffee is welcomed, $6.50 requires justification. They are habitual once a choice is made and respond to the community dimension (local ownership, suburb investment, local sourcing). The new-resident demographic — younger families who moved to Armadale from inner suburbs for affordability — has higher café quality expectations than the suburb\'s historical demographic and is creating upward demand pressure. Targeting this cohort with slightly higher quality than the local norm positions you for the suburb\'s demographic trajectory rather than its current average.',
    successConditions: [
      'A lease signed at current below-market rates — $2,000–$2,500/month — with a 3-year option that protects against the rent increase the Metronet opening will trigger.',
      'A concept pitched slightly ahead of the current demographic: quality above the current local norm, accessible pricing, and an aesthetic that new-resident families will be proud to bring their friends to.',
      'Metronet-ready positioning: plan for the commuter segment before it exists. A coffee window, early hours (5:30am from opening day), and proximity to the planned station are structural advantages that compound over time.',
      'Community investment from month one — local school sponsorships, social media presence in the Armadale Facebook community groups, engagement with the suburb\'s rapidly growing new-resident cohort.',
    ],
    failureScenarios: [
      'Pricing or concept above what the current Armadale demographic can sustain as a habitual purchase — the new-resident cohort is growing but the current resident majority is price-sensitive.',
      'Waiting for the Metronet to open before establishing your regular base. The operators who build loyalty before the rail arrives will own the commuter segment when it appears.',
      'A fit-out investment over $60,000 in a market where revenue growth is gradual rather than immediate. Armadale rewards low-cost, character-led concepts over expensive minimalist builds.',
      'Ignoring the suburb\'s Facebook community as a free marketing channel. The Armadale Facebook groups have thousands of members and are the primary local discovery mechanism for new businesses.',
    ],
    whatWouldMakeItBetter: [
      'A Metronet Station proximity play: lease adjacent to the planned station site now, at pre-uplift rates, and position your café as the commuter coffee destination before competitors realise the opportunity.',
      'A community anchor strategy — partnering with local schools, sporting clubs, or the Champion Lakes events precinct creates brand awareness at scale in a suburb where formal advertising is less effective than community engagement.',
    ],
    metaTitle: 'Is Armadale Good for a Café? Perth Location Intelligence | Locatalyze',
    metaDescription: 'Opening a café in Armadale? Verdict: CAUTION — lowest rents in Perth metro, growing residential base, Metronet catalyst coming. Full analysis for Perth\'s southeastern growth corridor.',
    relatedSuburbs: [
      { label: 'Café in Midland',       suburbSlug: 'midland',       citySlug: 'perth', type: 'cafe' },
      { label: 'Retail in Morley',      suburbSlug: 'morley',        citySlug: 'perth', type: 'retail' },
      { label: 'Café in Victoria Park', suburbSlug: 'victoria-park', citySlug: 'perth', type: 'cafe' },
    ],
    dataAssumptions: 'Revenue based on 24–48 covers/day at $11–15 avg ticket, 6 trading days. Rent from Armadale Road listings Q1 2025. Staff: owner + 1 PT including Super. COGS 33%. Profit pre-tax, owner wage included.',
    lastUpdated: 'Q1 2025',
  },

}

// ── Generated pages (SUBURBS × cafe | restaurant | retail | gym) ─────────────
const GENERATED_TYPES: BusinessTypeIntel[] = ['cafe', 'restaurant', 'retail', 'gym']

const GENERATED_INTEL_CACHE: Record<string, SuburbIntelData> = {}

function demandScoreFromSuburb(sd: SuburbData, bt: BusinessTypeIntel): number {
  const map: Record<BusinessTypeIntel, keyof SuburbData['demandScores']> = {
    cafe: 'cafes',
    restaurant: 'restaurants',
    retail: 'retail',
    gym: 'gyms',
    salon: 'retail',
  }
  const k = map[bt]
  return sd.demandScores[k]
}

function verdictFromScore(score: number): VerdictType {
  if (score >= 72) return 'GO'
  if (score >= 52) return 'CAUTION'
  return 'NO'
}

function competitionFromFootTraffic(
  ft: SuburbData['footTraffic'],
): CompetitionLevel {
  if (ft === 'Very High') return 'saturated'
  if (ft === 'High') return 'high'
  if (ft === 'Moderate') return 'medium'
  return 'low'
}

function buildGeneratedIntel(type: string, city: string, suburb: string): SuburbIntelData | null {
  if (!GENERATED_TYPES.includes(type as BusinessTypeIntel)) return null
  const sd = SUBURBS.find(s => s.citySlug === city && s.slug === suburb)
  if (!sd) return null
  const bt = type as BusinessTypeIntel
  const key = `${type}/${city}/${suburb}`
  if (SUBURB_DATA[key]) return null

  const score = demandScoreFromSuburb(sd, bt)
  const verdict = verdictFromScore(score)

  const labels: Record<BusinessTypeIntel, string> = {
    cafe: 'Café / Coffee Shop',
    restaurant: 'Restaurant / Bistro',
    retail: 'Retail Store',
    gym: 'Gym / Fitness',
    salon: 'Hair / Beauty Salon',
  }

  const monthlyRevenue = {
    low: Math.round(score * 320 + (bt === 'gym' ? 8000 : 0)),
    high: Math.round(score * 620 + (bt === 'gym' ? 22000 : 0)),
  }
  const monthlyRent = {
    low: Math.round(2500 + score * 35),
    high: Math.round(4500 + score * 55),
  }
  const monthlyProfit = {
    low: Math.round((monthlyRevenue.low - monthlyRent.high) * 0.08),
    high: Math.round((monthlyRevenue.high - monthlyRent.low) * 0.22),
  }

  const rentLevel: RentLevel =
    score >= 78 ? 'premium' : score >= 65 ? 'above-market' : score >= 50 ? 'at-market' : 'below-market'

  const avgTicket =
    bt === 'cafe' ? 18 : bt === 'restaurant' ? 48 : bt === 'retail' ? 42 : bt === 'gym' ? 18 : 45

  const dailyCustomersNeeded = Math.max(18, Math.min(95, Math.round(72 - score * 0.45)))

  const shortLabel = labels[bt].split('/')[0].trim()
  const sameCityOthers = SUBURBS.filter(s => s.citySlug === sd.citySlug && s.slug !== sd.slug)
  const pool = sameCityOthers.length >= 1 ? sameCityOthers : SUBURBS.filter(s => s.slug !== sd.slug)
  const related: RelatedSuburb[] = pool.slice(0, 3).map(s => ({
    label: `${shortLabel} in ${s.name}`,
    suburbSlug: s.slug,
    citySlug: s.citySlug,
    type: bt,
  }))

  const name = sd.name
  const cityName = sd.city

  return {
    suburb: name,
    suburbSlug: sd.slug,
    city: cityName,
    citySlug: sd.citySlug,
    state: sd.state,
    businessType: bt,
    businessLabel: labels[bt],

    verdict,
    verdictSummary: `${name} scores ${score}/100 for ${labels[bt]} demand in our model — verdict ${verdict}. ${sd.keyInsight.slice(0, 220)}${sd.keyInsight.length > 220 ? '…' : ''}`,

    monthlyRevenue,
    monthlyProfit,
    monthlyRent,
    rentLevel,
    avgTicket,
    dailyCustomersNeeded,
    competitionLevel: competitionFromFootTraffic(sd.footTraffic),
    demandScore: Math.max(1, Math.min(10, Math.round(score / 10))),
    confidenceLevel: score >= 60 ? 'medium' : 'low',
    confidenceNote:
      'This page is generated from suburb benchmarks in our dataset plus industry assumptions. For a decision-grade report, run a full Locatalyze analysis on your exact address.',

    suburbProfile: `${sd.description} ${sd.demographics}`,

    demandAnalysis: `${name} (${cityName}) shows a demand score of ${score}/100 for ${labels[bt].toLowerCase()} based on local foot traffic (${sd.footTraffic}), income (${sd.avgIncome}), and catchment size (${sd.population}). ${sd.vibe}. Operators who align concept with ${sd.bestFor.slice(0, 2).join(' and ')} categories tend to perform best here.`,

    competitionAnalysis: `Foot traffic is rated ${sd.footTraffic.toLowerCase()} — ${competitionFromFootTraffic(sd.footTraffic) === 'saturated' ? 'expect crowded trade areas and fight for share of wallet.' : 'there is still room for differentiated concepts if rent and positioning are right.'} ${sd.keyInsight}`,

    rentAnalysis: `Typical asking rents in ${name} sit around ${sd.rentRange} for visible positions — treat quotes above this band as requiring stronger revenue proof. Parking is ${sd.parkingEase.toLowerCase()}, which shapes how far customers will travel and how long they stay.`,

    customerBehavior: `Locals skew toward ${sd.vibe}. Spending power aligns with ${sd.avgIncome} median income signals. Anchor traffic drivers include ${sd.nearbyAnchors.slice(0, 2).join(' and ')}.`,

    successConditions: [
      `Secure rent at or below the typical ${sd.rentRange} band for your format size.`,
      `Match your concept to what ${name} rewards: ${sd.bestFor.slice(0, 3).join(', ')}.`,
      `Plan staffing and hours around ${sd.footTraffic.toLowerCase()} foot-traffic reality — do not assume CBD-style throughput.`,
      `Use ${name}'s anchors (${sd.nearbyAnchors[0] ?? 'local catchment'}) in marketing and positioning.`,
    ],

    failureScenarios: [
      `Paying top-quartile rent without a proven daily customer engine — ${name} punishes loose economics quickly.`,
      `Launching a format ${name} is known to struggle with: ${sd.notBestFor.slice(0, 2).join(', ')}.`,
      `Underestimating fit-out and working capital — especially where ${sd.parkingEase === 'Difficult' || sd.parkingEase === 'Very Difficult' ? 'access and parking add friction' : 'local competition is active'}.`,
      `Generic offer in a market where locals already have strong habitual choices.`,
    ],

    whatWouldMakeItBetter: [
      `Negotiate incentives (rent-free period, fit-out contribution) given ${sd.footTraffic} foot traffic profile.`,
      `Build a loyalty loop early — ${name}'s repeat trade drives most sustainable operators.`,
    ],

    metaTitle: `Is ${name} Good for a ${labels[bt].split('/')[0].trim()}? ${cityName} Location Intel | Locatalyze`,
    metaDescription: `Thinking of opening a ${labels[bt].toLowerCase()} in ${name}, ${cityName}? Demand score ${score}/100, verdict-style read, rent band ${sd.rentRange}, and local risk notes — before you sign.`,

    relatedSuburbs: related,

    dataAssumptions:
      'Generated page: scores derived from suburb demand indices in Locatalyze suburb data. Financial ranges are illustrative benchmarks, not a substitute for address-level modelling. Updated quarterly.',
    lastUpdated: 'Q2 2026',
  }
}

/** True when this route uses the long-form hand-crafted copy (not generated). */
export function isHandCraftedIntelKey(type: string, city: string, suburb: string): boolean {
  return Boolean(SUBURB_DATA[`${type}/${city}/${suburb}`])
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getSuburbData(
  type   : string,
  city   : string,
  suburb : string,
): SuburbIntelData | null {
  const key = `${type}/${city}/${suburb}`
  if (SUBURB_DATA[key]) return SUBURB_DATA[key]
  if (GENERATED_INTEL_CACHE[key]) return GENERATED_INTEL_CACHE[key]
  const built = buildGeneratedIntel(type, city, suburb)
  if (built) GENERATED_INTEL_CACHE[key] = built
  return built ?? null
}

export function getAllSlugs(): { type: string; city: string; suburb: string }[] {
  const keys = new Set<string>()
  Object.keys(SUBURB_DATA).forEach(k => keys.add(k))
  for (const sd of SUBURBS) {
    for (const bt of GENERATED_TYPES) {
      keys.add(`${bt}/${sd.citySlug}/${sd.slug}`)
    }
  }
  return Array.from(keys).map(k => {
    const [t, c, s] = k.split('/')
    return { type: t, city: c, suburb: s }
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
