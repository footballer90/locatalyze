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
