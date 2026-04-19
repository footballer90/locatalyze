// lib/wollongong-suburbs.ts
// Canonical data model for /analyse/wollongong/[suburb] pages.
// 20 suburbs — consulting-grade content, fully typed, deterministic for static generation.

export type Verdict = 'GO' | 'CAUTION' | 'NO'
export type Level = 'Low' | 'Medium' | 'High' | 'Very High'
export type FitRating = 'Excellent' | 'Good' | 'Fair' | 'Poor'
export type SaturationLevel = 'Oversaturated' | 'Competitive' | 'Moderate' | 'Low' | 'Untapped'
export type RiskReward = 'Excellent' | 'Good' | 'Moderate' | 'Poor'

export interface BusinessFit {
  rating: FitRating
  reason: string
}

export interface RelatedSuburb {
  slug: string
  name: string
  reason: string
}

export interface WollongongSuburb {
  slug: string
  name: string
  metaTitle: string
  metaDescription: string
  heroSubline: string
  verdict: Verdict
  verdictReason: string
  revenueRange: string
  rentRange: string
  rentLevel: 'Low' | 'Medium' | 'High'
  competitionLevel: Level
  footTrafficLevel: Level
  demographics: string
  medianIncome: string
  spendingBehavior: string
  suburbVibe: string
  peakZones: string[]
  anchorBusinesses: string[]
  businessFit: {
    cafe: BusinessFit
    restaurant: BusinessFit
    retail: BusinessFit
    gym: BusinessFit
  }
  competitorCount: string
  saturationLevel: SaturationLevel
  whatWorking: string
  marketGaps: string[]
  rentJustified: boolean
  rentReason: string
  riskReward: RiskReward
  successConditions: string[]
  failureRisks: string[]
  relatedSuburbs: RelatedSuburb[]
  keyInsight: string
}

export const WOLLONGONG_SUBURBS: Record<string, WollongongSuburb> = {

  'wollongong-cbd': {
    slug: 'wollongong-cbd',
    name: 'Wollongong CBD',
    metaTitle: 'Open a Business in Wollongong CBD | Location Intelligence 2026',
    metaDescription: 'Wollongong CBD has genuine weekday office trade and weekend coastal visitors — but headline rents outpace the hospitality culture that is still maturing. Full viability analysis.',
    heroSubline: 'Crown Street dining spine · office workers · coastal tourism · evolving hospitality culture',
    verdict: 'CAUTION',
    verdictReason: 'The CBD has real foot traffic anchored by Crown Street Mall, the University campus, and a growing apartment population. The caution is rent — Crown Street positions are priced for a hospitality culture that is still developing. Negotiate hard and validate specific block traffic before signing. A well-positioned specialty café breaks even at 55–70 covers/day.',
    revenueRange: '$38,000–$80,000/month',
    rentRange: '$3,000–$7,500/month',
    rentLevel: 'High',
    competitionLevel: 'High',
    footTrafficLevel: 'High',
    demographics: 'Office workers, UOW students, coastal tourists, growing apartment residents. Age mix 22–50. Weekday lunch trade is the primary driver.',
    medianIncome: '$72,000 household median',
    spendingBehavior: 'Weekday lunch and coffee dominate. Weekend tourist and beach visitor spend is secondary. Less premium-focused than comparable Sydney inner suburbs — accessible pricing ($5 coffee, $16–20 mains) outperforms luxury positioning.',
    suburbVibe: 'Mid-size regional city in genuine transition. Crown Street is the commercial spine. The beach is two blocks east and that proximity is both the opportunity and the distraction — visitors often skip the CBD for the foreshore.',
    peakZones: ['Crown Street Mall retail core', 'Keira Street office tower surrounds', 'University of Wollongong campus edge (Northfields Ave)', 'Station precinct lunch zone'],
    anchorBusinesses: ['Crown Street Mall', 'WIN Entertainment Centre', 'Wollongong City Library', 'UOW Innovation Campus'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'Office tower proximity drives reliable weekday morning trade. Break-even at 55–70 covers/day is achievable near the Keira Street / Crown Street intersection. Avoid positions more than 200m from the Mall core — foot traffic drops sharply.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'Crown Street dinner trade is growing. A quality restaurant with a clear cuisine point of difference fills Thursday–Saturday. Sunday–Tuesday dinner is thin outside events. WIN Entertainment Centre on event nights creates spikes worth planning around.',
      },
      retail: {
        rating: 'Good',
        reason: 'Crown Street Mall has national chains — the opportunity is in independent specialty retail that fills the gaps (quality food retail, gifts, homewares). Avoid generic fashion retail that competes with the Mall anchors.',
      },
      gym: {
        rating: 'Good',
        reason: 'Office worker and student demographic is a reliable gym customer. A boutique format (pilates, reformer, functional training) at accessible pricing ($75–$95/week) performs above a traditional gym in this demographic.',
      },
    },
    competitorCount: '25–40 cafés and restaurants within 800m',
    saturationLevel: 'Competitive',
    whatWorking: 'Quality specialty coffee with efficient weekday service. Office-precinct lunch with $15–20 main and speed-of-service priority. Restaurant concepts with clear cuisine identity in underrepresented categories (Japanese, modern Lebanese, Korean).',
    marketGaps: [
      'Quality fast-casual lunch for office workers ($15–19, 8 min turnaround)',
      'Japanese or Korean dinner concept (none quality-positioned)',
      'Specialty wine bar for evening apartment resident trade',
      'Artisan bakery with café seating (no strong incumbent)',
    ],
    rentJustified: false,
    rentReason: 'Crown Street headline rents ($5,000–$7,500/month) are not justified on blocks with below-average foot traffic. Treat every quoted rent as a negotiation starting point. Vacancy rates on secondary CBD streets remain elevated — use this as leverage.',
    riskReward: 'Moderate',
    successConditions: [
      'Secure rent at or below $4,500/month — not the headline rate',
      'Position within 150m of the Crown Street Mall core',
      'Office tower proximity is the single biggest predictor of weekday café success',
      'Build an event-day strategy for WIN Entertainment Centre nights',
    ],
    failureRisks: [
      'Paying headline rent on a Crown Street block with below-average pedestrian flow',
      'Opening a full-service dinner restaurant without a weekend coastal visitor strategy',
      'Ignoring the post-6pm foot traffic drop on non-event days',
    ],
    relatedSuburbs: [
      { slug: 'north-wollongong', name: 'North Wollongong', reason: 'Beachside dining precinct — stronger weekend leisure trade with lower competition' },
      { slug: 'gwynneville', name: 'Gwynneville', reason: 'University-adjacent suburb with consistent student trade and lower rent' },
      { slug: 'fairy-meadow', name: 'Fairy Meadow', reason: 'Established independent café strip 5 minutes north with loyal local demographic' },
    ],
    keyInsight: "Wollongong CBD is the right direction but at the wrong rent on most blocks. The operators who win here negotiate 20–30% below quoted rates, choose positions near the Mall core or Keira Street office towers, and build their model around the weekday lunch trade rather than the tourist economy.",
  },

  'north-wollongong': {
    slug: 'north-wollongong',
    name: 'North Wollongong',
    metaTitle: 'Open a Business in North Wollongong | Beachside Location Guide 2026',
    metaDescription: "North Wollongong's beach strip and proximity to the CBD creates the strongest weekend leisure trade in the region. Low competition for quality operators. Full analysis.",
    heroSubline: 'Beachside dining · weekend leisure · proximity to CBD · low competition for quality operators',
    verdict: 'GO',
    verdictReason: "North Wollongong occupies the sweet spot: walking distance from the CBD, direct access to Wollongong Beach, and far less competition than Crown Street. The weekend beach economy creates Saturday–Sunday foot traffic that rivals the CBD, while weekday trade from the UOW corridor provides a workday base.",
    revenueRange: '$32,000–$62,000/month',
    rentRange: '$2,200–$4,500/month',
    rentLevel: 'Medium',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Young professionals, UOW students, beach families, coastal tourists. Weekend visitors from the Southern Highlands and Sydney add significant summer volume.',
    medianIncome: '$74,000 household median',
    spendingBehavior: 'Weekend leisure spend is generous — brunch at $20–28 per head is standard expectation. Weekday trade from the university and commuter base is more price-conscious ($5 coffee, $14–18 lunch).',
    suburbVibe: "Relaxed coastal strip with a mix of beach shacks and emerging quality dining. The feel is Bondi 2005 — before the premium operators arrived. That window is still open.",
    peakZones: ['Cliff Road beachfront strip', 'Stuart Park surrounds', 'North Beach Pavilion zone', 'Marine Drive weekend walk corridor'],
    anchorBusinesses: ['Wollongong Beach', 'North Beach Pavilion', 'Stuart Park', 'UOW main campus (2km south)'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The strongest café opportunity in the Wollongong region. Beach proximity drives weekend brunch demand at $22–28/head average. Weekday student and commuter trade provides a weekday base. No quality specialty café incumbent. Break-even at 40–52 covers/day.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'Beachside casual dining (seafood, modern Australian, share plates) performs strongly on Friday–Sunday. A quality restaurant with an ocean outlook commands the highest per-head spend in the Wollongong market.',
      },
      retail: {
        rating: 'Good',
        reason: 'Beach lifestyle retail — surfwear, outdoor equipment, artisan gifts — finds a natural audience. Weekend tourist spend adds to the resident base.',
      },
      gym: {
        rating: 'Good',
        reason: 'Outdoor fitness culture is dominant, but a boutique indoor studio (yoga, pilates, reformer) for the beach-lifestyle demographic performs well at $80–$100/week pricing.',
      },
    },
    competitorCount: '8–14 venues (limited quality independent)',
    saturationLevel: 'Low',
    whatWorking: 'Weekend brunch tourism from Sydney day-trippers. Student lunch trade during semester. Beach-day visitors who want quality over convenience.',
    marketGaps: [
      'Quality specialty café (absolute first-mover on the beach strip)',
      'Premium casual seafood restaurant with ocean views',
      'Beach lifestyle retail for the day-tripper demographic',
      'Natural wine bar open Thursday–Sunday evenings',
    ],
    rentJustified: true,
    rentReason: 'At $2,200–$4,500/month with beach positioning and weekend tourism uplift, North Wollongong delivers the best rent-to-foot-traffic ratio in the region. Ensure outdoor seating is negotiated into the lease — alfresco generates 35–45% of weekend revenue.',
    riskReward: 'Excellent',
    successConditions: [
      'Beach-facing or beach-proximate position with outdoor seating',
      'Weekend brunch as the primary revenue model',
      'Open 7 days — beach trade is 7-day in summer, 5–6 day year-round',
      'Instagram-worthy presentation — coastal visitors share content actively',
    ],
    failureRisks: [
      'Weekday-only model that ignores the beach weekend economy',
      'No outdoor seating — the premium is almost entirely in the alfresco experience',
      'Positioning inland from the beach strip where the tourist foot traffic does not reach',
    ],
    relatedSuburbs: [
      { slug: 'wollongong-cbd', name: 'Wollongong CBD', reason: 'Higher weekday office trade — better for weekday-primary business models' },
      { slug: 'thirroul', name: 'Thirroul', reason: 'Northern beach suburb with similar coastal demographic at lower rents' },
      { slug: 'austinmer', name: 'Austinmer', reason: 'Boutique beach village 12km north — weekend-only viable at lowest regional rents' },
    ],
    keyInsight: "North Wollongong is the closest thing to an undiscovered coastal café market in NSW. The beach is world-class, the weekend foot traffic is real, and the quality café gap is genuine. A quality operator who opens here before the market catches on will own the suburb's social morning for years.",
  },

  'fairy-meadow': {
    slug: 'fairy-meadow',
    name: 'Fairy Meadow',
    metaTitle: 'Open a Business in Fairy Meadow, Wollongong | 2026 Guide',
    metaDescription: 'Fairy Meadow is the most established independent café suburb in Wollongong — loyal demographics, beachside access, and a community that actively supports independent business.',
    heroSubline: 'Established independent strip · loyal community · beach access · young professional renters',
    verdict: 'GO',
    verdictReason: "Fairy Meadow has what most Wollongong suburbs lack: an established culture of supporting independent business. The Lawrence Hargrave Drive strip, proximity to Fairy Meadow Beach, and an influx of young professional renters from Sydney creates a demographic that spends generously and builds loyalty fast.",
    revenueRange: '$28,000–$52,000/month',
    rentRange: '$1,800–$3,800/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Young professional renters (25–40), established families, Sydney weekenders. Strong independent-business identity. The suburb attracts people who moved from Sydney\'s inner suburbs specifically for lifestyle quality at lower cost.',
    medianIncome: '$79,000 household median',
    spendingBehavior: 'Quality-seeking, experience-driven. Will pay $6 for specialty coffee and $22–26 for brunch. Weekend social dining is the dominant spend pattern. Loyal once committed to a venue.',
    suburbVibe: 'The Newtown of Wollongong — slightly rough around the edges, deeply independent, and actively creative. Lawrence Hargrave Drive has genuine strip energy that Crown Street has not yet matched.',
    peakZones: ['Lawrence Hargrave Drive strip (core 600m)', 'Fairy Meadow Beach surrounds', 'Saturday morning farmers market zone', 'Evening dinner strip (Thu–Sun)'],
    anchorBusinesses: ['Fairy Meadow Beach', 'The Neighbourhood (café/bar precinct)', 'Fairy Meadow Hotel'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: "One of the best café opportunities in the Illawarra. High-income renters, beach-lifestyle brunch culture, and a community that genuinely rewards quality with loyalty. Average ticket $19–24. Break-even at 42–55 covers/day — achievable within 2 months for a quality operator.",
      },
      restaurant: {
        rating: 'Good',
        reason: 'A quality dinner restaurant with personality (not just competence) fills Friday–Sunday consistently. The demographic is food-literate and will travel from the CBD for a genuinely good concept.',
      },
      retail: {
        rating: 'Good',
        reason: 'Independent and artisan retail fits the community identity perfectly — specialty food, lifestyle goods, independent fashion. Avoid anything that looks corporate.',
      },
      gym: {
        rating: 'Good',
        reason: 'Boutique wellness (yoga, pilates, functional training) for the young professional demographic. A reformer pilates studio here with 12–18 month lead time would be well-timed ahead of the demographic growth curve.',
      },
    },
    competitorCount: '12–18 cafés and restaurants within 1km',
    saturationLevel: 'Moderate',
    whatWorking: 'Specialty coffee, quality brunch, and dinner concepts with genuine identity. The community actively markets businesses it loves on social media — new openings with quality product get immediate organic reach.',
    marketGaps: [
      'Japanese or Korean dinner concept (none in the suburb)',
      'Artisan bakery with café seating (strong demand, no incumbent)',
      'Natural wine bar with serious food program',
      'High-quality takeaway for the family dinner market',
    ],
    rentJustified: true,
    rentReason: 'At $1,800–$3,800/month, Fairy Meadow delivers quality foot traffic at 40–50% below comparable Sydney inner-suburb rents. The best value independent hospitality position in the Illawarra region.',
    riskReward: 'Excellent',
    successConditions: [
      'Clear concept identity — Fairy Meadow rewards personality and punishes generic',
      'Quality product that earns Google review momentum (4.5+ essential)',
      'Community investment: local events, collaborations, visible presence',
      'Weekend brunch as the primary revenue anchor',
    ],
    failureRisks: [
      'Generic café concept in a strip that already has quality midmarket options',
      'Ignoring the evening economy — dinner trade is real and growing',
      'Pricing below the demographic\'s quality expectations (underselling causes distrust here)',
    ],
    relatedSuburbs: [
      { slug: 'north-wollongong', name: 'North Wollongong', reason: 'Beach strip with stronger weekend tourism pull and even lower competition' },
      { slug: 'thirroul', name: 'Thirroul', reason: 'Similar independent-community demographic 15km north at lower rents' },
      { slug: 'woonona', name: 'Woonona', reason: 'Quieter adjacent suburb with emerging café culture and first-mover positions available' },
    ],
    keyInsight: "Fairy Meadow is for operators who want to build something people actually love. The community is sophisticated, independent, and loyal. Open with genuine quality and clear identity and you will have a suburb behind you. Open with a generic concept and you will be invisible.",
  },

  'gwynneville': {
    slug: 'gwynneville',
    name: 'Gwynneville',
    metaTitle: 'Open a Business in Gwynneville, Wollongong | University Precinct 2026',
    metaDescription: 'Gwynneville sits directly adjacent to the University of Wollongong — 38,000 students and staff create structured weekday demand. Full semester-aware analysis.',
    heroSubline: 'UOW adjacent · student and academic economy · semester-structured demand · walkable campus edge',
    verdict: 'GO',
    verdictReason: "Gwynneville's adjacency to UOW (38,000+ students and staff) creates the most predictable weekday café demand in the Wollongong region. The suburb is underserved relative to the captive demand base. A quality café positioned on the campus-facing side of Gwynneville achieves break-even from university trade alone.",
    revenueRange: '$22,000–$40,000/month',
    rentRange: '$1,400–$3,000/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'UOW students and academic staff, permanent residents, young professional renters. Heavy student influence during semester.',
    medianIncome: '$64,000 household median (student-weighted)',
    spendingBehavior: 'Students: high frequency, accessible pricing ($4.50–$5 coffee). Academic staff: quality-seeking, willing to pay $5.50–$6.50 for specialty. Semester-break drop of 30–40% must be modelled.',
    suburbVibe: 'Quiet residential suburb that comes alive during semester. The UOW campus edge is the economic driver. Between the university and Wollongong CBD — close to both, directly dependent on neither.',
    peakZones: ['Squires Way (UOW campus edge)', 'Northfields Avenue student corridor', 'Manning Street intersection', 'Semester Monday–Thursday peak'],
    anchorBusinesses: ['University of Wollongong (main campus)', 'UOW Innovation Campus', 'Campus eateries (the competition)'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'UOW proximity creates structured daily demand from 38,000+ students and staff. The campus café offering is institutional — a quality independent 5 minutes walk away pulls the demographic that cares about coffee quality. Semester-break model must account for 30–40% volume drop.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'A quality lunch restaurant or fast-casual concept (BYO, generous portions, $14–18 meals) performs during semester. Dinner trade is secondary — students primarily eat at home or the CBD.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Student-adjacent retail (stationery, convenience, specialty food) works during semester. Non-student retail struggles with semester-break seasonality.',
      },
      gym: {
        rating: 'Good',
        reason: 'Students are a strong gym demographic. Semester membership structures ($40–$55/week or semester-block pricing) outperform month-to-month. UOW has a campus gym — differentiate on community feel and timetable variety.',
      },
    },
    competitorCount: '6–10 cafés within 1km (mostly mid-market or campus-institutional)',
    saturationLevel: 'Low',
    whatWorking: 'Quality specialty coffee positioned as the "better than campus" alternative. Study-friendly environments with good WiFi and long opening hours.',
    marketGaps: [
      'Specialty café with quality coffee and study-comfortable seating',
      'Healthy fast-casual lunch for the academic staff demographic ($14–$18)',
      'International cuisine reflecting UOW\'s student diversity (Korean, Vietnamese, Sri Lankan)',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month rent against 38,000+ daily campus visitors within walking distance is exceptional value. Build the model on semester-break volumes — treat semester as the upside.',
    riskReward: 'Good',
    successConditions: [
      'Location within 600m of UOW main campus entrance',
      'Study-friendly environment: power outlets, good WiFi, long hours',
      'Semester-break contingency plan — delivery, locals, event-driven revenue',
      'Accessible pricing for students ($4.50–$5.50 coffee)',
    ],
    failureRisks: [
      'Modelling revenue on peak semester weeks — break periods drop 30–40%',
      'Premium pricing that the student market systematically avoids',
      'Opening mid-year without accounting for the December–February exodus',
    ],
    relatedSuburbs: [
      { slug: 'wollongong-cbd', name: 'Wollongong CBD', reason: 'More diverse non-student customer base — less semester dependency' },
      { slug: 'north-wollongong', name: 'North Wollongong', reason: 'Beach trade for operators who want weekend-primary revenue without semester risk' },
      { slug: 'fairy-meadow', name: 'Fairy Meadow', reason: 'Young professional demographic with more stable year-round spend patterns' },
    ],
    keyInsight: "The university is Gwynneville's economic engine and its primary risk in one. Operators who build their fixed cost structure around semester-break volumes — and treat the 30-week semester as the upside — build sustainable businesses. Those who model on semester peaks and are surprised by December get into trouble.",
  },

  'corrimal': {
    slug: 'corrimal',
    name: 'Corrimal',
    metaTitle: 'Open a Business in Corrimal, Wollongong | Suburban Strip Analysis 2026',
    metaDescription: 'Corrimal has an established commercial strip, stable family demographic, and very low café competition for its population size. Best first-mover café opportunity in the northern Illawarra suburbs.',
    heroSubline: 'Established suburban strip · family demographic · low café competition · strong first-mover position',
    verdict: 'GO',
    verdictReason: "Corrimal's commercial strip on Princes Highway and Rawson Street punches above its weight — it has the retail infrastructure, the population base (12,000+ in catchment), and the missing piece is a quality independent café. The suburb has the density to support quality hospitality. Nobody has shown up yet.",
    revenueRange: '$20,000–$36,000/month',
    rentRange: '$1,400–$2,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Established families, owner-occupiers, commuters. Age mix 30–60. Community-oriented shopping behaviour with a strong local-first preference.',
    medianIncome: '$72,000 household median',
    spendingBehavior: 'Regular café visits as a weekly ritual rather than daily indulgence. Weekend brunch is the primary occasion. Coffee at $5–$5.50 and food at $14–18 is the sweet spot. Quality is expected; overt premiumisation is not.',
    suburbVibe: 'Solid, functional suburban strip with a loyal residential catchment. The Corrimal Hotel, the supermarket cluster, and the train station create genuine foot traffic anchors.',
    peakZones: ['Rawson Street shopping strip', 'Corrimal train station surrounds', 'Saturday morning peak (9am–12pm)', 'School-run morning window'],
    anchorBusinesses: ['Corrimal Hotel', 'Corrimal train station', 'IGA and supermarket strip'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The clearest first-mover café opportunity in the northern Illawarra suburbs. 12,000+ resident catchment, virtually no quality competition, and a demographic with the income and habit to support daily visits. Break-even at 34–42 covers/day on $15 average ticket.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'A quality family-friendly restaurant (pizza, pasta, modern Australian) fills weekends reliably. The suburb\'s family demographic spends on family occasion dining. BYO policy increases perceived value.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Convenience and community retail works. Specialty food retail (quality deli, artisan products) fits the demographic. Destination retail requires a compelling reason to visit.',
      },
      gym: {
        rating: 'Good',
        reason: 'Community gym at accessible pricing ($55–$75/week) for the family and commuter demographic. Corrimal has a train station — commuters who work out near home are the best gym membership customers.',
      },
    },
    competitorCount: '5–8 cafés within 1km (none quality-specialty)',
    saturationLevel: 'Untapped',
    whatWorking: 'The strip has consistent local foot traffic from the train station, supermarkets, and hotel. The community visits regularly. The gap is in quality.',
    marketGaps: [
      'Quality specialty café (no incumbent)',
      'Artisan bakery with café seating',
      'Family-friendly casual restaurant with BYO',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month for a Rawson Street or Princes Highway position with consistent commuter and local foot traffic is excellent value. The low rent allows for a patient 90-day ramp to community loyalty.',
    riskReward: 'Good',
    successConditions: [
      'Position near the train station or supermarket strip for passive foot traffic',
      'Community-first marketing: school networks, local Facebook groups, train station regulars',
      'Quality over trend — this demographic trusts consistency and friendliness above novelty',
      'Weekend brunch as the primary occasion driver',
    ],
    failureRisks: [
      'Specialty-premium pricing before earning community trust',
      'Ignoring the commuter morning coffee window (7–9am is primary)',
      'Opening on a side street without the strip\'s established foot traffic',
    ],
    relatedSuburbs: [
      { slug: 'fairy-meadow', name: 'Fairy Meadow', reason: 'Higher-income demographic with established independent café culture 3km south' },
      { slug: 'woonona', name: 'Woonona', reason: 'Similar community suburb adjacent to Corrimal — consider which strip has stronger foot traffic' },
      { slug: 'towradgi', name: 'Towradgi', reason: 'Smaller residential suburb between Corrimal and Fairy Meadow — less foot traffic, lower rent' },
    ],
    keyInsight: "Corrimal is the Adamstown of the Illawarra — a suburb with real population density and almost no quality café to serve it. The first operator to open a genuine specialty café on the Rawson Street strip owns the suburb's mornings for the next 3–4 years. The opportunity is uncontested and the rents are low.",
  },

  'thirroul': {
    slug: 'thirroul',
    name: 'Thirroul',
    metaTitle: 'Open a Business in Thirroul, Wollongong | Coastal Village Analysis 2026',
    metaDescription: 'Thirroul is the Illawarra\'s most coveted coastal village — D.H. Lawrence\'s "most beautiful place in the world". High-income renters, beach lifestyle, and a thriving independent café culture.',
    heroSubline: 'Coveted coastal village · high-income renters · thriving independent strip · DH Lawrence country',
    verdict: 'GO',
    verdictReason: "Thirroul is the Illawarra's most attractive suburb for an independent hospitality operator. The demographic is high-income (among the region's highest), the coastal lifestyle drives generous discretionary spend, and the existing strip demonstrates that quality operators here build businesses that last. Competition exists but the market is not closed.",
    revenueRange: '$32,000–$58,000/month',
    rentRange: '$2,000–$4,200/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'High-income Sydney escapees, established coastal professionals, young families. The suburb has gentrified significantly over the past decade. People who live in Thirroul chose it — and their spending reflects that intentionality.',
    medianIncome: '$95,000 household median',
    spendingBehavior: 'Generous discretionary spend. Quality coffee at $5.50–$6.50 is expected. Weekend brunch at $24–28/head is the social norm. Will drive 20 minutes for an exceptional dining experience. Highly social-media active.',
    suburbVibe: 'The Illawarra\'s answer to Berry or Byron — a coastal village with genuine lifestyle credentials. The beach, the escarpment, and the village strip create an environment where quality is rewarded and mediocrity is ignored.',
    peakZones: ['Wigram Street village strip (core 400m)', 'Thirroul Beach surrounds', 'Saturday morning farmers market zone', 'Escarpment walking track trailheads'],
    anchorBusinesses: ['Thirroul Beach', 'Thirroul Hotel', 'Village strip independent cluster'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'One of the highest-revenue café markets per head in the Illawarra. High-income demographic, beach lifestyle, and community that expects and rewards quality. Average ticket $22–28. Break-even at 38–48 covers/day.',
      },
      restaurant: {
        rating: 'Excellent',
        reason: 'The village atmosphere and food-literate demographic supports destination dining. A quality restaurant in Thirroul becomes a regional destination — people drive from Wollongong and beyond for a genuinely good experience.',
      },
      retail: {
        rating: 'Good',
        reason: 'Artisan retail, lifestyle goods, specialty food — the Thirroul demographic is one of the strongest independent retail audiences in the region. Keep it genuine and locally connected.',
      },
      gym: {
        rating: 'Good',
        reason: 'Boutique fitness (reformer pilates, yoga, functional training) for the high-income coastal demographic. Outdoor fitness is dominant — a studio that extends rather than replaces the outdoor lifestyle wins.',
      },
    },
    competitorCount: '10–16 cafés and restaurants on the strip',
    saturationLevel: 'Moderate',
    whatWorking: 'Quality specialty hospitality. The strip has multiple excellent cafés and the demand still outpaces supply on Saturday mornings. A new quality operator does not cannibalise — it grows the category.',
    marketGaps: [
      'Premium dinner restaurant (the evening food offering lags the brunch offering)',
      'Natural wine bar with food (the demographic is aligned, no strong incumbent)',
      'Artisan bakery with genuine bread program',
      'Specialty food retail (quality cheese, small-batch preserves, wine)',
    ],
    rentJustified: true,
    rentReason: 'At $2,000–$4,200/month in a suburb with $95,000 median household income and genuine weekend beach tourism, rent is the strongest justified position in the northern Illawarra. Negotiate for outdoor seating — it is worth a 15–20% premium on the lease.',
    riskReward: 'Excellent',
    successConditions: [
      'Village strip position — Thirroul is a destination, not a passing-trade suburb',
      'Quality execution that earns organic word-of-mouth from the high-connected demographic',
      'Outdoor seating provision — essential for the coastal lifestyle proposition',
      'Weekend-primary revenue model backed by strong weekday resident trade',
    ],
    failureRisks: [
      'Generic concept in a strip where quality is the baseline expectation',
      'No outdoor seating — the lifestyle premium is almost entirely outdoors',
      'Pricing below the demographic\'s expectations (the Thirroul market distrusts cheap)',
    ],
    relatedSuburbs: [
      { slug: 'austinmer', name: 'Austinmer', reason: 'Adjacent village 2km north with similar lifestyle demographic at lower rent — weekend viable' },
      { slug: 'fairy-meadow', name: 'Fairy Meadow', reason: '10km south with similar independent culture at lower rents and higher population density' },
      { slug: 'woonona', name: 'Woonona', reason: 'Quieter intermediate suburb between Thirroul and Corrimal' },
    ],
    keyInsight: "Thirroul is the Illawarra's premium independent hospitality address. A café or restaurant that earns the community's trust here becomes a regional institution — people from Wollongong, Sydney's Southern Highlands, and further come specifically for the village experience. The market rewards genuine quality with remarkable loyalty.",
  },

  'towradgi': {
    slug: 'towradgi',
    name: 'Towradgi',
    metaTitle: 'Open a Business in Towradgi, Wollongong | Residential Suburb Analysis 2026',
    metaDescription: 'Towradgi is a quiet coastal residential suburb between Fairy Meadow and Corrimal. Low competition, low rent, and a stable family demographic make it viable for community-positioned operators.',
    heroSubline: 'Quiet coastal residential · low competition · community-loyalty model · between two stronger strips',
    verdict: 'CAUTION',
    verdictReason: "Towradgi sits between two stronger commercial strips (Fairy Meadow to the south, Corrimal to the north) and has limited commercial infrastructure. The opportunity exists for a community-positioned café at very low rent, but the walk-in foot traffic is minimal. Success requires building a local loyal base rather than attracting passing trade.",
    revenueRange: '$14,000–$24,000/month',
    rentRange: '$1,200–$2,400/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Established families, retirees, long-term residents. Tight-knit community. Beach access via Towradgi Beach adds weekend leisure visitors.',
    medianIncome: '$75,000 household median',
    spendingBehavior: 'Community loyalty-driven. Regular local café visits at accessible price points ($4.50–$5.50 coffee). Weekend brunch is a family occasion, not a daily ritual.',
    suburbVibe: 'Quiet, residential, beach-adjacent. The kind of suburb where people know their neighbours. A café that becomes the community meeting point is the only viable model here.',
    peakZones: ['Crown Street (local strip)', 'Towradgi Beach access', 'School-morning drop-off window'],
    anchorBusinesses: ['Towradgi Beach', 'Local residential strip'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'Community-positioned café at sub-$1,800/month rent can achieve break-even at 28–35 covers/day from loyal locals. Beach weekenders add Saturday and Sunday trade. This works only with a genuine community investment strategy.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'Insufficient passing foot traffic to sustain a full-service restaurant. A quality takeaway or pizza concept with delivery radius can work.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Destination retail has no foot traffic base. Local convenience retail only.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Small boutique studio for the local family demographic at accessible pricing. Keep overhead minimal.',
      },
    },
    competitorCount: '2–4 venues (minimal)',
    saturationLevel: 'Untapped',
    whatWorking: 'The beach creates weekend visitor trade. The residential community will support a quality local option that feels genuinely theirs.',
    marketGaps: [
      'Community café (first and only quality option)',
    ],
    rentJustified: true,
    rentReason: 'Very low rents make the community-loyalty model economically viable. At sub-$1,600/month, a café only needs 28 covers/day at $13 average ticket to break even.',
    riskReward: 'Moderate',
    successConditions: [
      'Community investment from day one — local Facebook groups, school networks',
      'Beach weekender strategy to supplement thin weekday trade',
      'Accept a 60–90 day ramp to community loyalty',
    ],
    failureRisks: [
      'Expecting passing foot traffic — it does not exist here',
      'Competing with Fairy Meadow or Corrimal for anything except local loyalty',
      'Full-service concept without the local density to support it',
    ],
    relatedSuburbs: [
      { slug: 'fairy-meadow', name: 'Fairy Meadow', reason: 'More established strip 3km south with better foot traffic and proven independent trade' },
      { slug: 'corrimal', name: 'Corrimal', reason: 'Larger residential catchment 3km north with established commercial strip' },
      { slug: 'woonona', name: 'Woonona', reason: 'Similar quiet coastal suburb immediately north' },
    ],
    keyInsight: "Towradgi works for operators who want a quiet, low-cost base with a loyal local community and are genuinely prepared to build that community from scratch. It is not a foot traffic business. It is a relationship business.",
  },

  'balgownie': {
    slug: 'balgownie',
    name: 'Balgownie',
    metaTitle: 'Open a Business in Balgownie, Wollongong | Residential Suburb 2026',
    metaDescription: "Balgownie is a quiet inner suburb adjacent to UOW with a stable residential base. Low competition and very low rents make it viable for community-positioned operators targeting the university catchment.",
    heroSubline: 'UOW-adjacent residential · low competition · community-positioned · quiet strip',
    verdict: 'CAUTION',
    verdictReason: "Balgownie's commercial presence is minimal but its adjacency to UOW and stable residential base create viability for a community-positioned café. The primary risk is the small catchment and limited passing trade — this is a relationship business, not a foot traffic play.",
    revenueRange: '$13,000–$22,000/month',
    rentRange: '$1,100–$2,200/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Established families, UOW staff and faculty, long-term residents. The suburb has a quiet, educated, income-stable demographic.',
    medianIncome: '$78,000 household median',
    spendingBehavior: 'Regular local visits at accessible-to-quality price points. Coffee is a daily habit. Weekly brunch is the primary occasion.',
    suburbVibe: 'Quiet, leafy inner suburb. Feels more like a residential village than a commercial precinct. The UOW proximity gives it more economic activity than the commercial strip suggests.',
    peakZones: ['Princes Highway local strip', 'Balgownie Road residential corridor'],
    anchorBusinesses: ['UOW main campus (1.5km)', 'Local residential strip'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'UOW faculty and staff catchment creates reliable weekday morning trade at quality-seeking price points ($5.50–$6 coffee). A café that positions as the quality alternative to campus institutional coffee can build a loyal academic customer base.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A small, quality local restaurant has precedent in similar quiet suburbs. Must rely on local loyalty rather than passing trade.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Insufficient passing foot traffic for destination retail. Local convenience only.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Small boutique studio for the educated residential demographic. Academic staff are strong boutique fitness customers at $75–$90/week.',
      },
    },
    competitorCount: '2–4 venues',
    saturationLevel: 'Untapped',
    whatWorking: 'Academic staff loyalty and residential community habit.',
    marketGaps: ['Quality café targeting UOW faculty and local families'],
    rentJustified: true,
    rentReason: 'Among the lowest rents in the Wollongong region. At $1,200–$1,500/month, a café that does 25–30 covers/day breaks even — achievable with UOW faculty trade.',
    riskReward: 'Moderate',
    successConditions: [
      'Target UOW academic staff explicitly — they are your most reliable customers',
      'Quality specialty coffee that makes academics drive past campus',
      'Community investment with the residential catchment',
    ],
    failureRisks: [
      'Expecting walk-in foot traffic from passing trade',
      'Semester-break drop without a locals strategy',
    ],
    relatedSuburbs: [
      { slug: 'gwynneville', name: 'Gwynneville', reason: 'Closer to campus with higher student volume — better for volume-first model' },
      { slug: 'fairy-meadow', name: 'Fairy Meadow', reason: 'More established independent strip with higher foot traffic and proven community' },
      { slug: 'wollongong-cbd', name: 'Wollongong CBD', reason: 'Higher overall foot traffic for operators who need faster ramp' },
    ],
    keyInsight: "Balgownie is for an operator who wants a quiet, low-cost base with an educated residential catchment. The UOW faculty segment is the most reliable and quality-seeking customer in the suburb — build for them first.",
  },

  'figtree': {
    slug: 'figtree',
    name: 'Figtree',
    metaTitle: 'Open a Business in Figtree, Wollongong | Shopping Centre Market 2026',
    metaDescription: 'Figtree Grove Shopping Centre anchors the suburb — high foot traffic but chain-dominated. The independent opportunity is in categories the centre under-serves. Full analysis.',
    heroSubline: 'Shopping centre anchored · suburban families · chain-dominated hospitality · independent niche opportunity',
    verdict: 'CAUTION',
    verdictReason: "Figtree Grove Shopping Centre generates high foot traffic but almost entirely from suburban family shoppers oriented toward national chains. An independent café or restaurant adjacent to the centre — not inside it — that clearly differentiates from the food court offering can perform well. Inside the centre is structurally challenging for independents.",
    revenueRange: '$22,000–$42,000/month',
    rentRange: '$2,000–$5,000/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'High',
    demographics: 'Suburban families, retirees, car-dependent shoppers. Figtree has one of the higher median incomes among Wollongong\'s suburban rings ($82,000). Family discretionary spend is the driver.',
    medianIncome: '$82,000 household median',
    spendingBehavior: 'Volume shopping orientation. National chain price-reference point. Will pay for clearly differentiated quality adjacent to the centre.',
    suburbVibe: 'Affluent suburban retail precinct. Families with disposable income and a preference for convenience. Car parking is essential — pedestrian traffic is almost non-existent.',
    peakZones: ['Figtree Grove Shopping Centre external strip', 'Princes Highway adjacent positions', 'Weekend family shopping peak'],
    anchorBusinesses: ['Figtree Grove Shopping Centre', 'Kmart and Woolworths anchors'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'An external position adjacent to Figtree Grove with specialty coffee positioning and clear quality differentiation from the food court. The high-income demographic will seek out a genuinely better option.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'Quality family restaurant adjacent to the centre (not inside) with a compelling value proposition. BYO policy is effective for this demographic.',
      },
      retail: {
        rating: 'Good',
        reason: 'Specialty retail in categories the centre under-serves — quality food, homeware, specialty gifts for the high-income family demographic.',
      },
      gym: {
        rating: 'Good',
        reason: 'Family-fitness gym at accessible pricing ($70–$90/week). The high-income Figtree demographic has above-average gym membership rates.',
      },
    },
    competitorCount: '15–25 venues within 1km (mostly chain)',
    saturationLevel: 'Competitive',
    whatWorking: 'Specialty coffee adjacent to the centre. Quality family retail in underserved categories.',
    marketGaps: [
      'Quality specialty café external to Figtree Grove',
      'Artisan food retail (quality cheese, wine, deli)',
      'Boutique fitness studio for the high-income suburban demographic',
    ],
    rentJustified: false,
    rentReason: 'In-centre Figtree Grove rents include turnover clauses that disadvantage independents. External positions on Princes Highway at $2,500–$3,500/month are the justified range. Always read lease terms with a commercial solicitor before any centre-adjacent signing.',
    riskReward: 'Moderate',
    successConditions: [
      'External position adjacent to (not inside) the shopping centre',
      'Clear quality differentiation from food court — specialty, artisan, premium',
      'Car parking at your specific position is essential',
      'Family weekend strategy: takeaway options, family-friendly seating',
    ],
    failureRisks: [
      'Signing an in-centre lease without understanding turnover rent clauses',
      'Generic concept that competes on chain territory',
      'No car parking — the suburb is entirely car-dependent',
    ],
    relatedSuburbs: [
      { slug: 'unanderra', name: 'Unanderra', reason: 'Industrial suburban market with lower rents and different trade profile' },
      { slug: 'dapto', name: 'Dapto', reason: 'Suburban growth corridor with similar family demographic at lower rents' },
      { slug: 'wollongong-cbd', name: 'Wollongong CBD', reason: 'Higher foot traffic density and more diverse customer base' },
    ],
    keyInsight: "The Figtree opportunity is specific: external-to-centre, clearly differentiated from the food court, with car parking. Operators who get all three right find a high-income family demographic that genuinely prefers quality over chains.",
  },

  'shellharbour': {
    slug: 'shellharbour',
    name: 'Shellharbour',
    metaTitle: 'Open a Business in Shellharbour, Wollongong | Coastal Village Guide 2026',
    metaDescription: "Shellharbour Village is the Illawarra's most charming coastal village with genuine weekend tourism, quality dining, and a demographic that actively supports independent business.",
    heroSubline: 'Coastal tourism village · weekend dining destination · quality-seeking demographic · genuine community character',
    verdict: 'GO',
    verdictReason: "Shellharbour Village has quietly become one of the Illawarra's strongest weekend dining destinations. The coastal village character, established independent strip, and growing tourist trade from Shellharbour Marina create a genuine GO scenario for quality hospitality. Competition exists but the market is growing faster than supply.",
    revenueRange: '$28,000–$55,000/month',
    rentRange: '$1,800–$3,800/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Coastal families, beach lifestyle seekers, growing tourism from Shellharbour Marina precinct, weekend visitors from the Southern Highlands and Macarthur region.',
    medianIncome: '$79,000 household median',
    spendingBehavior: 'Weekend leisure spend is the primary driver. Brunch at $22–28/head. Quality dinner trade Thursday–Sunday. Waterfront and marina proximity commands a premium on experience expectations.',
    suburbVibe: 'Genuine coastal village character — more authentic than manufactured. The old fishing village heritage mixes with growing marina tourism. The right business feels like it belongs here.',
    peakZones: ['Shellharbour Village strip', 'Shellharbour Marina precinct', 'Killalea Regional Park (nearby visitor draw)', 'Weekend beach zone'],
    anchorBusinesses: ['Shellharbour Marina', 'Shellharbour Beach', 'Village Bakery Shellharbour'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'Weekend beach tourism and marina visitors create strong brunch demand at $22–28/head. The village character means quality presentation with local connection outperforms generic café formats. Break-even at 40–52 covers/day.',
      },
      restaurant: {
        rating: 'Excellent',
        reason: 'Seafood and modern Australian dining in the village character performs strongly Thursday–Sunday. The marina demographic expects and pays for quality.',
      },
      retail: {
        rating: 'Good',
        reason: 'Artisan and coastal lifestyle retail — handmade gifts, local art, specialty food — performs well with tourist and village resident spend.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Boutique fitness for the coastal lifestyle demographic. Outdoor fitness culture is dominant — a quality indoor studio complements rather than competes.',
      },
    },
    competitorCount: '12–18 venues within the village strip',
    saturationLevel: 'Moderate',
    whatWorking: 'Coastal village character dining with quality food programs. Marina visitor spend is growing year-on-year as the precinct develops.',
    marketGaps: [
      'Premium seafood restaurant (quality gap exists above mid-market)',
      'Natural wine bar with food',
      'Quality artisan gifts and local produce retail',
    ],
    rentJustified: true,
    rentReason: 'Village character positions at $2,000–$3,500/month with weekend beach and marina tourism are excellent value. Negotiate for outdoor seating as it is critical to the village dining experience.',
    riskReward: 'Good',
    successConditions: [
      'Village strip position with outdoor seating capability',
      'Concept that has authentic local connection — the tourist demographic can tell',
      'Strong weekend focus with a quality food program',
      'Marine/coastal identity built into the brand',
    ],
    failureRisks: [
      'Generic concept that could be anywhere — Shellharbour rewards specificity',
      'Weekday-only model without weekend focus',
      'No outdoor seating in a village where the outdoor experience is the product',
    ],
    relatedSuburbs: [
      { slug: 'kiama', name: 'Kiama', reason: 'Similar coastal village 15km south with stronger tourist draw and higher rents' },
      { slug: 'albion-park', name: 'Albion Park', reason: 'Inland suburban market adjacent to Shellharbour at lower rents with different trade profile' },
      { slug: 'thirroul', name: 'Thirroul', reason: 'Northern coastal village with higher-income demographic and stronger weekday trade' },
    ],
    keyInsight: "Shellharbour Village is the Illawarra's most underrated weekend dining destination. The marina is growing the tourist economy year-on-year. An operator who opens a quality restaurant or café here with genuine coastal identity will be an institution in five years.",
  },

  'kiama': {
    slug: 'kiama',
    name: 'Kiama',
    metaTitle: 'Open a Business in Kiama | Coastal Tourism Destination Analysis 2026',
    metaDescription: "Kiama is the Illawarra's premier coastal tourism destination — consistent weekend visitors, high-income local demographic, and a proven market for quality independent hospitality.",
    heroSubline: 'Premier coastal tourism · blowhole destination · high-income demographic · proven independent market',
    verdict: 'GO',
    verdictReason: "Kiama is the Illawarra's most established tourism destination — the Blowhole alone draws 500,000+ visitors annually. This creates a tourism-first commercial environment where quality operators building on local loyalty plus visitor trade generate the most resilient revenue in the region. The challenge is rent has risen with the reputation.",
    revenueRange: '$35,000–$72,000/month',
    rentRange: '$2,500–$5,500/month',
    rentLevel: 'High',
    competitionLevel: 'Medium',
    footTrafficLevel: 'High',
    demographics: 'High-income owner-occupiers, Sydney weekenders, coastal tourists, young families. Kiama has one of the highest median incomes in the Illawarra ($92,000). The demographic actively seeks quality experiences.',
    medianIncome: '$92,000 household median',
    spendingBehavior: 'Generous tourist spend plus local discretionary spend. Brunch at $24–32/head. Quality dinner trade 5 days/week. Will travel for exceptional food. Highly social-media active — good review momentum travels fast.',
    suburbVibe: 'The Illawarra\'s answer to Byron Bay — coastal, premium, and increasingly destination-oriented. Collins Street is the high street. The harbour foreshore is the experience. The demand for quality exceeds current supply.',
    peakZones: ['Collins Street strip', 'Kiama Harbour foreshore', 'Blowhole Point tourist zone', 'Saturday morning farmers market'],
    anchorBusinesses: ['Kiama Blowhole', 'Kiama Harbour', 'Kiama Markets', 'Grand Hotel Kiama'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'Tourism economy plus high-income local base creates year-round café demand above Newcastle or outer-Illawarra equivalents. Average ticket $22–28. Summer uplift of 35–45%. A quality café here becomes a destination in its own right.',
      },
      restaurant: {
        rating: 'Excellent',
        reason: 'The strongest restaurant market in the Illawarra per capita. Quality operators consistently receive regional recognition. The tourism economy sustains 7-day dinner trade in summer and 5-day in winter — exceptional by regional standards.',
      },
      retail: {
        rating: 'Good',
        reason: 'Tourist and high-income local retail — artisan food, quality gifts, lifestyle goods, local art. Avoid generic souvenir retail; the Kiama demographic actively rejects it.',
      },
      gym: {
        rating: 'Good',
        reason: 'Boutique wellness for the high-income coastal demographic. Reformer pilates, yoga, and functional training with lifestyle positioning ($90–$110/week) works well.',
      },
    },
    competitorCount: '18–25 venues across Collins Street and the foreshore',
    saturationLevel: 'Competitive',
    whatWorking: 'Destination dining and quality brunch. Operators who earn recognition travel well in the Kiama market — word-of-mouth extends to Sydney and Southern Highlands.',
    marketGaps: [
      'Premium degustation or chef-led dining (the evening offering lags the brunch quality)',
      'High-quality artisan bakery',
      'Specialty wine retail with tasting room',
    ],
    rentJustified: true,
    rentReason: 'Kiama rents are the highest in the Illawarra but justified by tourism volume and high-income local spending. A café doing 60+ covers on a summer Saturday at $25 average ticket generates $1,500+ in a single session. Negotiate outdoor seating — it is where the margin is made.',
    riskReward: 'Good',
    successConditions: [
      'Concept with genuine quality differentiation — Kiama has the highest quality baseline in the region',
      'Summer activation strategy that maximises peak tourism revenue',
      'Collins Street or harbour-facing position with outdoor seating',
      'Year-round model: strong summer peak, sustainable winter base from high-income locals',
    ],
    failureRisks: [
      'Mid-market concept in a market where the baseline quality is already high',
      'Tourist-only model with no winter local loyalty strategy',
      'Paying premium rent without a clear high-ticket revenue model to justify it',
    ],
    relatedSuburbs: [
      { slug: 'shellharbour', name: 'Shellharbour', reason: 'Coastal village 15km north with lower rents and comparable weekend tourism dynamics' },
      { slug: 'thirroul', name: 'Thirroul', reason: 'Northern coastal village with similar high-income demographic and stronger weekday trade' },
      { slug: 'albion-park', name: 'Albion Park', reason: 'Inland market adjacent to the Kiama hinterland at significantly lower rents' },
    ],
    keyInsight: "Kiama is the Illawarra's most proven hospitality market. The combination of 500,000+ annual visitors and a resident demographic that genuinely supports quality means the revenue ceiling here is the highest in the region. The risk is that quality expectations are also the highest — this is not a forgiving market for average product.",
  },

  'dapto': {
    slug: 'dapto',
    name: 'Dapto',
    metaTitle: 'Open a Business in Dapto, Wollongong | Growing Suburban Market 2026',
    metaDescription: "Dapto is one of Wollongong's fastest-growing suburbs — new residential development, improving demographics, and very low commercial rent create an emerging opportunity for independent operators.",
    heroSubline: 'Fast-growing residential · new apartment pipeline · improving demographics · lowest rents in region',
    verdict: 'CAUTION',
    verdictReason: "Dapto's residential growth is real — the suburb has seen significant new housing development and demographic improvement. However, the commercial strip has not yet caught up with the residential growth. The opportunity is for a first-mover who opens before the market matures. The risk is patience — this is a 2–3 year ramp.",
    revenueRange: '$18,000–$32,000/month',
    rentRange: '$1,200–$2,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Young families, first-home buyers, growing professional influx following new development. The demographic is improving — average income rising as new housing attracts higher-income residents.',
    medianIncome: '$65,000 household median (rising with new development)',
    spendingBehavior: 'Value-conscious but quality-seeking as demographics improve. Coffee at $4.50–$5.50. Weekend brunch as a family occasion. Volume over premium — for now.',
    suburbVibe: 'Suburban growth corridor. The train station, the Dapto Mall, and new housing developments are the commercial anchors. The suburb is becoming rather than being — which is the opportunity.',
    peakZones: ['Dapto Mall precinct', 'Princes Highway commercial strip', 'Dapto train station surrounds'],
    anchorBusinesses: ['Dapto Mall', 'Dapto train station', 'New residential development zones'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'A quality café positioned near the train station or Dapto Mall captures the growing commuter and family demographic. Lock in a long lease now before the suburb matures and rents rise.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'Family-casual restaurant at accessible price points (BYO, generous portions). The demographic supports family dining but not premium dining yet.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Convenience and community retail. The Dapto Mall covers major retail needs — gaps are in specialty food and service retail.',
      },
      gym: {
        rating: 'Good',
        reason: 'Community gym at accessible pricing for the growing family demographic. New residential development means new gym members.',
      },
    },
    competitorCount: '6–10 venues (limited quality)',
    saturationLevel: 'Low',
    whatWorking: 'Train station proximity generates consistent commuter coffee demand. New residential arrivals are looking for local quality hospitality.',
    marketGaps: [
      'Quality café near the train station (commuter demand is unserved)',
      'Artisan bakery for the growing professional demographic',
      'Family-casual restaurant with BYO',
    ],
    rentJustified: true,
    rentReason: "Sub-$2,000/month for a suburb with 30,000+ residents and growing demographics is excellent long-term value. Lock in a 3-year lease now — rents will rise as the residential development matures.",
    riskReward: 'Moderate',
    successConditions: [
      'Train station or Mall-adjacent positioning for maximum passive foot traffic',
      'Lock in a 3-year lease before the suburb\'s commercial rents rise with the residential growth',
      'Accessible pricing that matches current demographics while building for the improving future demographic',
    ],
    failureRisks: [
      'Expecting immediate returns from the current demographic without a patient ramp',
      'Premium pricing that the current income level cannot sustain',
      'Positioning away from the train station and Mall in a car-dependent suburb',
    ],
    relatedSuburbs: [
      { slug: 'albion-park', name: 'Albion Park', reason: 'Adjacent growth corridor with similar family demographic and comparable rents' },
      { slug: 'unanderra', name: 'Unanderra', reason: 'Industrial suburban market between Dapto and Wollongong CBD' },
      { slug: 'shellharbour', name: 'Shellharbour', reason: 'More mature coastal market 10km east with higher income demographic' },
    ],
    keyInsight: "Dapto is a 3-year bet on demographic growth, not an immediate-return market. The operators who open now at sub-$2,000/month rent and build loyalty with the incoming professional demographic will be the established incumbents when the suburb matures. The risk is patience. The reward is a long-term defensible position at locked-in low rent.",
  },

  'albion-park': {
    slug: 'albion-park',
    name: 'Albion Park',
    metaTitle: 'Open a Business in Albion Park | Shellharbour LGA Analysis 2026',
    metaDescription: "Albion Park is a growing family suburb in the Shellharbour LGA with consistent local patronage, low competition, and very affordable rents. Best for community-positioned operators.",
    heroSubline: 'Growing family suburb · Shellharbour LGA · consistent local patronage · affordable rents',
    verdict: 'CAUTION',
    verdictReason: "Albion Park has a large residential catchment and genuine local patronage but limited commercial development relative to its population. The opportunity is for a community-positioned operator who builds local loyalty. The caution is destination appeal — this is a locals-first market with limited visitor draw.",
    revenueRange: '$16,000–$28,000/month',
    rentRange: '$1,100–$2,200/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Established families, tradespeople, young families. Growing but affordable residential area. Community-oriented.',
    medianIncome: '$66,000 household median',
    spendingBehavior: 'Value-oriented. Regular local visits for coffee and convenience. Weekend family dining at accessible price points ($12–16 mains).',
    suburbVibe: 'Unpretentious suburban community. Princes Highway is the commercial spine. People shop local by habit rather than aspiration.',
    peakZones: ['Princes Highway commercial strip', 'Albion Park train station surrounds', 'Weekend morning family peak'],
    anchorBusinesses: ['Albion Park Hotel', 'Princes Highway strip'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'Community-positioned café at very low rent. Break-even at 28–35 covers/day. Local loyalty model with 4–6 month build period.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'Family-casual with BYO and accessible pricing. No destination pull from outside the local catchment.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Local convenience retail. Specialty food can work for the above-median income pockets within the suburb.',
      },
      gym: {
        rating: 'Good',
        reason: 'Value gym ($50–$65/week) for the family and tradesperson demographic. Accessible pricing and community feel.',
      },
    },
    competitorCount: '5–8 venues (limited quality)',
    saturationLevel: 'Low',
    whatWorking: 'Local community loyalty. Train commuter coffee demand.',
    marketGaps: [
      'Quality café (none in the suburb)',
      'Healthy fast-casual lunch for commuters and tradespeople',
    ],
    rentJustified: true,
    rentReason: 'Lowest commercial rents in the Shellharbour LGA. Viable for community-loyalty model at sub-$1,500/month.',
    riskReward: 'Moderate',
    successConditions: [
      'Community investment from day one',
      'Accessible pricing aligned with the demographic',
      'Train station proximity for commuter trade',
    ],
    failureRisks: [
      'Premium positioning the demographic cannot sustain',
      'Expecting visitor trade that does not come to Albion Park',
    ],
    relatedSuburbs: [
      { slug: 'shellharbour', name: 'Shellharbour', reason: 'Coastal village 8km east with tourism upside and higher income demographic' },
      { slug: 'dapto', name: 'Dapto', reason: 'Similar inland growth corridor with comparable demographics and larger catchment' },
      { slug: 'warrawong', name: 'Warrawong', reason: 'Industrial and service suburb with similar community-market dynamics' },
    ],
    keyInsight: "Albion Park rewards patience and community investment. The demographics are not exceptional but the rents are among the lowest in the region. A café that becomes the community meeting point here generates reliable income on a very low cost base.",
  },

  'unanderra': {
    slug: 'unanderra',
    name: 'Unanderra',
    metaTitle: 'Open a Business in Unanderra, Wollongong | Industrial Suburb Analysis 2026',
    metaDescription: "Unanderra is an industrial and residential suburb between Wollongong CBD and Dapto. Low rents, commuter coffee demand, and a growing residential catchment create viable opportunities.",
    heroSubline: 'Industrial and residential mix · commuter trade · low rents · growing residential catchment',
    verdict: 'CAUTION',
    verdictReason: "Unanderra's industrial character limits its hospitality appeal, but the train station creates a reliable commuter coffee demand and the growing residential catchment along the corridor creates genuine local trade. This is a volume-efficiency business rather than a quality-margin play.",
    revenueRange: '$14,000–$26,000/month',
    rentRange: '$1,000–$2,000/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Industrial workers, commuters, residential families. Practical and value-oriented.',
    medianIncome: '$61,000 household median',
    spendingBehavior: 'Speed and value. Morning coffee is a daily ritual at $4–$5. Lunch is functional ($12–$15). Premium positioning is not viable.',
    suburbVibe: 'Industrial working suburb. The train station is the primary commercial generator. Function over aesthetics.',
    peakZones: ['Unanderra train station', 'Fowlers Road commercial strip', 'Early morning trade (6–9am)'],
    anchorBusinesses: ['Unanderra train station', 'Local industrial businesses'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'A fast, reliable café near the train station at accessible pricing can generate consistent commuter trade. Not a quality-margin business — a volume-efficiency business.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'Limited demand for sit-down dining in an industrial suburb.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Minimal retail demand outside trade supplies and convenience.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Low-cost gym for the industrial worker demographic. $40–$55/week, functional format.',
      },
    },
    competitorCount: '3–5 venues',
    saturationLevel: 'Untapped',
    whatWorking: 'Train station commuter trade. Industrial worker morning coffee.',
    marketGaps: ['Fast, reliable café near the train station'],
    rentJustified: true,
    rentReason: "Newcastle's lowest commercial rents. Technically viable on a volume-efficiency model at sub-$1,200/month.",
    riskReward: 'Poor',
    successConditions: [
      'Train station position within 100m',
      'Fast service and accessible pricing above all else',
      'Open from 5:30am for the first industrial shift change',
    ],
    failureRisks: [
      'Any premium positioning in an inherently working-class market',
      'Sit-down concept without guaranteed volume',
    ],
    relatedSuburbs: [
      { slug: 'dapto', name: 'Dapto', reason: 'Larger suburban market 10km south with better long-term demographics' },
      { slug: 'warrawong', name: 'Warrawong', reason: 'Similar industrial market profile with established retail strip' },
      { slug: 'wollongong-cbd', name: 'Wollongong CBD', reason: 'More diverse market 8km north for operators who need a broader customer base' },
    ],
    keyInsight: "Unanderra is a volume-first, train-station-dependent market. The only viable business model here is one built around commuter speed and accessible pricing. It is not a quality-margin play.",
  },

  'warrawong': {
    slug: 'warrawong',
    name: 'Warrawong',
    metaTitle: 'Open a Business in Warrawong, Wollongong | Service Suburb Analysis 2026',
    metaDescription: 'Warrawong is a practical service suburb with established retail and low commercial rents. Best for volume-oriented takeaway and convenience food operators targeting the diverse local community.',
    heroSubline: 'Service suburb · diverse community · affordable rents · volume-oriented market',
    verdict: 'CAUTION',
    verdictReason: "Warrawong has established retail infrastructure and a diverse community with consistent local patronage. The opportunity is for an operator who designs for volume and accessibility rather than quality margin. Ethnic cuisine and affordable takeaway consistently outperform quality-positioning in this market.",
    revenueRange: '$18,000–$32,000/month',
    rentRange: '$1,200–$2,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Diverse multicultural community, working families, established residential base. Port Kembla industrial workers form a significant customer segment.',
    medianIncome: '$58,000 household median',
    spendingBehavior: 'Value-dominant. Ethnic takeaway and affordable lunch are the primary spend categories. Coffee at $4–$4.50 is expected. Premium positioning is actively resisted.',
    suburbVibe: 'Practical multicultural service suburb. The Warrawong Plaza and surrounding strip serve daily convenience needs. Authenticity over aesthetics.',
    peakZones: ['Warrawong Plaza surrounds', 'King Street commercial strip', 'Lunch and early afternoon window'],
    anchorBusinesses: ['Warrawong Plaza', 'Warrawong Hotel'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'A practical, fast café at accessible pricing can work. Premium specialty café is misaligned with the market.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'Authentic ethnic cuisine (Vietnamese, Thai, Filipino, Lebanese) at accessible pricing is the strongest format. BYO and generous portions outperform quality-premium positioning.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Practical community retail. Specialty food from the ethnic community (Asian grocery, halal deli) has genuine demand.',
      },
      gym: {
        rating: 'Good',
        reason: 'Value gym at $40–$55/week for the working family and industrial worker demographic.',
      },
    },
    competitorCount: '15–20 venues (mostly takeaway and fast-casual)',
    saturationLevel: 'Moderate',
    whatWorking: 'Authentic ethnic cuisine at accessible pricing. Fast, reliable takeaway for the working community.',
    marketGaps: [
      'Quality Vietnamese or Filipino restaurant (gap in the current ethnic mix)',
      'Authentic halal dining option',
    ],
    rentJustified: true,
    rentReason: 'Low rents match the market. Volume-first model with accessible pricing makes the economics work.',
    riskReward: 'Moderate',
    successConditions: [
      'Authentic cuisine that the local multicultural community recognises',
      'Accessible pricing ($12–$16 mains)',
      'Volume and speed over margin',
    ],
    failureRisks: [
      'Premium positioning in a price-sensitive market',
      'Inauthentic ethnic cuisine in a community with high authenticity radar',
    ],
    relatedSuburbs: [
      { slug: 'port-kembla', name: 'Port Kembla', reason: 'Adjacent industrial suburb with similar community dynamics' },
      { slug: 'unanderra', name: 'Unanderra', reason: 'Similar working-community market further north' },
      { slug: 'shellharbour', name: 'Shellharbour', reason: 'Coastal market 10km south with higher income demographic and tourism upside' },
    ],
    keyInsight: "Warrawong is a volume-first, community-authenticity market. Operators who bring genuine ethnic cuisine at accessible pricing earn fierce loyalty from a multicultural community that knows the real thing. Premium concepts that ignore the local character will not find their customer here.",
  },

  'port-kembla': {
    slug: 'port-kembla',
    name: 'Port Kembla',
    metaTitle: 'Open a Business in Port Kembla, Wollongong | Industrial Harbour Suburb 2026',
    metaDescription: 'Port Kembla is an industrial harbour suburb with a small but loyal community and emerging waterfront character. Very low rents and a first-mover creative opportunity exist here.',
    heroSubline: 'Industrial harbour · small loyal community · emerging creative character · first-mover creative opportunity',
    verdict: 'CAUTION',
    verdictReason: "Port Kembla is a genuine outlier — an industrial harbour suburb with an emerging arts and creative community that has not yet been commercially capitalised. Very low rents and an incoming creative demographic create a first-mover opportunity for operators willing to be early. The risk is that the market is small and the timeline is uncertain.",
    revenueRange: '$12,000–$20,000/month',
    rentRange: '$900–$1,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Industrial workers, established working families, incoming creative community, arts-oriented residents seeking affordable character.',
    medianIncome: '$57,000 household median',
    spendingBehavior: 'Industrial worker trade: accessible pricing, fast service. Creative community: quality-seeking, willing to support independent operators.',
    suburbVibe: 'Industrial harbour with growing creative energy. The maritime character and low rents are attracting artists and makers. Raw, unpolished, potentially interesting.',
    peakZones: ['Illawarra Road main strip', 'Harbour foreshore access', 'Industrial worker shift-change windows'],
    anchorBusinesses: ['Port Kembla Harbour', 'BlueScope Steel (major employer)', 'Community hub'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'A creative-positioned café with maritime character identity can attract both the industrial worker quick-coffee trade and the emerging creative community. Very low rent makes it technically viable on minimal daily covers.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'Insufficient population density for a full-service restaurant. Takeaway or casual food only.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Artisan and maker retail for the creative community can work at very low overhead.',
      },
      gym: {
        rating: 'Poor',
        reason: 'Insufficient population base for standalone gym.',
      },
    },
    competitorCount: '2–3 venues (minimal)',
    saturationLevel: 'Untapped',
    whatWorking: 'Industrial worker volume trade. Creative community support for independent operators.',
    marketGaps: [
      'Creative café with maritime character identity',
      'Artist studio / gallery with café component',
    ],
    rentJustified: true,
    rentReason: 'The lowest commercial rents in the Wollongong metro. Viable for a creative operator with low overhead expectations and genuine community investment.',
    riskReward: 'Poor',
    successConditions: [
      'Maritime / industrial character identity — not a generic café',
      'Industrial worker quick-trade as the revenue base, creative community as the identity',
      'Extremely low overhead — this is not a high-revenue market',
    ],
    failureRisks: [
      'Expecting the creative community alone to generate viable revenue quickly',
      'Premium positioning in a value-market',
      'Opening without an established connection to the community',
    ],
    relatedSuburbs: [
      { slug: 'warrawong', name: 'Warrawong', reason: 'Adjacent suburb with established retail strip and larger community' },
      { slug: 'north-wollongong', name: 'North Wollongong', reason: 'Beach strip 8km north for operators who want coastal character without industrial context' },
      { slug: 'mayfield', name: 'Mayfield', reason: 'Newcastle industrial gentrification suburb — a comparison market for the creative-first-mover model' },
    ],
    keyInsight: "Port Kembla is for operators who have genuine creative vision and minimal financial pressure. The rent is almost free, the character is genuine, and the creative community is arriving. Those who can wait are the only ones for whom this suburb makes sense.",
  },

  'austinmer': {
    slug: 'austinmer',
    name: 'Austinmer',
    metaTitle: 'Open a Business in Austinmer, Wollongong | Beach Village Guide 2026',
    metaDescription: "Austinmer is a small, high-income beach village 12km north of Wollongong. Weekend tourism and a loyal resident community support quality independent operators at low rent.",
    heroSubline: 'Small beach village · high-income residents · weekend tourism · very low rent',
    verdict: 'GO',
    verdictReason: "Austinmer's high-income demographic ($91,000 median), beach tourism draw, and almost zero quality café competition create a genuine GO for a small-footprint quality operator. The market ceiling is modest — this is a boutique business, not a high-volume operation — but the rent is low enough that the economics work beautifully at 30–40 covers/day.",
    revenueRange: '$18,000–$32,000/month',
    rentRange: '$1,200–$2,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'High-income owner-occupiers, beach lifestyle professionals, Sydney weekenders, coastal tourists. Small community with strong identity.',
    medianIncome: '$91,000 household median',
    spendingBehavior: 'Quality-seeking. Will pay $6+ for specialty coffee and $24–28 for brunch without hesitation. The community actively supports independent business. High social media engagement.',
    suburbVibe: 'Tiny, beautiful beach village with some of the best ocean pool swimming in NSW. The community is small, tight-knit, and has deliberately avoided over-development.',
    peakZones: ['Lawrence Hargrave Drive village strip', 'Austinmer Beach and ocean pools', 'Saturday morning beach community'],
    anchorBusinesses: ['Austinmer Beach (ocean pools)', 'Headland Retreat', 'Local village strip'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'Small-footprint quality café with beach character. 30–40 covers/day at $22–28 average ticket generates $25,000–$35,000/month revenue against sub-$2,000/month rent. One of the best unit economics in the Illawarra for a boutique operation.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'Small, quality casual restaurant for the Friday–Sunday weekend visitor market. The beach-village setting commands a premium on experience that a quality dinner concept can capitalise on.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Small artisan retail — ceramics, local art, specialty food — for the high-income weekend visitor. The market is small but the average spend is high.',
      },
      gym: {
        rating: 'Poor',
        reason: 'Village is too small for a standalone gym. Outdoor fitness is culturally dominant.',
      },
    },
    competitorCount: '3–5 venues (minimal quality)',
    saturationLevel: 'Untapped',
    whatWorking: 'Weekend beach tourism at premium price points. Loyal resident base that will become a weekly habit customer.',
    marketGaps: [
      'Quality specialty café (first quality incumbent)',
      'Small dinner restaurant with genuine food program',
    ],
    rentJustified: true,
    rentReason: 'Sub-$1,800/month rent against a $91,000 median income community with weekend tourism premium is the strongest unit economics in the northern Illawarra for a boutique operation.',
    riskReward: 'Good',
    successConditions: [
      'Accept that this is a boutique 30–40 cover business — not scalable, but beautifully profitable at low rent',
      'Beach character identity that earns organic social sharing',
      'Weekend-primary model with weekend tourist trade as the revenue driver',
      'Village strip positioning — the community will not find you if you are not visible',
    ],
    failureRisks: [
      'Expecting high-volume trade in a small village',
      'Generic concept that does not reflect the village character',
      'Weekday-only model — the community is largely commuting to Sydney or Wollongong on weekdays',
    ],
    relatedSuburbs: [
      { slug: 'thirroul', name: 'Thirroul', reason: 'Adjacent village 2km south with higher population and more established commercial strip' },
      { slug: 'woonona', name: 'Woonona', reason: 'Quieter suburb 5km south with similar coastal demographic' },
      { slug: 'north-wollongong', name: 'North Wollongong', reason: 'Beach precinct with more foot traffic volume and proximity to UOW and CBD' },
    ],
    keyInsight: "Austinmer is the Illawarra's best-kept secret for a boutique hospitality operator. The rent is low, the demographic is high-income, the beach is world-class, and there is no quality competitor. A café that earns the village's trust here needs only 35 covers/day to generate a genuinely comfortable living — at rent that would have been a steal five years ago.",
  },

  'woonona': {
    slug: 'woonona',
    name: 'Woonona',
    metaTitle: 'Open a Business in Woonona, Wollongong | Coastal Residential Guide 2026',
    metaDescription: 'Woonona is a quiet coastal suburb between Corrimal and Thirroul with a stable family demographic and emerging café culture. First-mover opportunity at low rent.',
    heroSubline: 'Quiet coastal residential · between two stronger strips · first-mover café opportunity · community loyalty model',
    verdict: 'GO',
    verdictReason: "Woonona is the overlooked suburb between Corrimal (strong commercial strip) and Thirroul (strong independent culture). It has 10,000+ residents, beach access, and no quality café. The first operator to open with genuine quality here builds a loyal suburban base that Corrimal or Thirroul residents have no reason to pull away from.",
    revenueRange: '$18,000–$32,000/month',
    rentRange: '$1,400–$2,600/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Established families, coastal lifestyle residents, commuters. Stable, community-oriented demographic. Beach access via Woonona Beach.',
    medianIncome: '$78,000 household median',
    spendingBehavior: 'Community loyalty-driven. Regular weekly café visits. Weekend brunch as a family ritual. Will pay $5–$5.50 for quality coffee from a venue they trust.',
    suburbVibe: 'Quiet, stable, beach-adjacent. The Lawrence Hargrave Drive strip has consistent local foot traffic but no quality café anchor.',
    peakZones: ['Lawrence Hargrave Drive local strip', 'Woonona Beach access', 'Saturday morning community window'],
    anchorBusinesses: ['Woonona Beach', 'Local residential strip'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'First-mover community café in a suburb with $78,000 median income and no quality incumbent. Break-even at 30–38 covers/day on $14 average ticket. Community loyalty ramp takes 60–90 days but sustains for years.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'Small community restaurant or quality takeaway. Limited destination draw from outside the suburb.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Local convenience and lifestyle retail. Specialty food for the income-decent demographic.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Small boutique studio at accessible pricing for the family community.',
      },
    },
    competitorCount: '3–5 venues (no quality café)',
    saturationLevel: 'Untapped',
    whatWorking: 'Local community loyalty for businesses that invest in neighbourhood relationships.',
    marketGaps: [
      'Quality café (no incumbent in $78k income suburb)',
      'Local artisan food retail',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month in a $78,000 median income suburb is excellent value for a community-loyalty model.',
    riskReward: 'Good',
    successConditions: [
      'Community investment: local Facebook groups, school networks, neighbourhood presence',
      'Consistent quality and friendliness — community loyalty is won slowly',
      'Weekend brunch as the primary occasion driver',
    ],
    failureRisks: [
      'Expecting foot traffic without investing in community relationships',
      'Premium pricing before establishing community trust',
    ],
    relatedSuburbs: [
      { slug: 'corrimal', name: 'Corrimal', reason: 'Adjacent suburb north with larger commercial strip and stronger foot traffic' },
      { slug: 'thirroul', name: 'Thirroul', reason: 'Adjacent suburb south with higher income and more established independent culture' },
      { slug: 'towradgi', name: 'Towradgi', reason: 'Similar quiet coastal suburb 3km south' },
    ],
    keyInsight: "Woonona is the suburb that Corrimal and Thirroul operators should have opened in — before anyone did. The income demographic is solid, the beach access is real, and the competition is zero. A patient operator who builds community loyalty here first will have a loyal base that neither Corrimal nor Thirroul can easily pull away.",
  },

  'berkeley': {
    slug: 'berkeley',
    name: 'Berkeley',
    metaTitle: 'Open a Business in Berkeley, Wollongong | Working Community Market 2026',
    metaDescription: 'Berkeley is a working-class suburb south of Wollongong CBD with low commercial rents and a loyal community. Best for accessible, community-first operators at minimal overhead.',
    heroSubline: 'Working community · south of CBD · low rents · community-loyalty model',
    verdict: 'CAUTION',
    verdictReason: "Berkeley has a loyal, working-class community and some of the lowest commercial rents in the Wollongong metro. However, the demographic's spending power is below average and the suburb lacks the foot traffic to support a quality-premium concept. Community-positioned accessible café or takeaway is the viable model.",
    revenueRange: '$12,000–$20,000/month',
    rentRange: '$900–$1,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Working families, social housing residents, long-term community members. Predominantly working class with modest income levels.',
    medianIncome: '$54,000 household median',
    spendingBehavior: 'Value-first. Coffee at $4–$4.50. Lunch at $10–$13. Community authenticity over quality premium.',
    suburbVibe: 'Tight-knit working community. Neighbours know each other. A business that invests genuinely in the community is rewarded with fierce loyalty.',
    peakZones: ['Berkeley Road strip', 'Local convenience cluster'],
    anchorBusinesses: ['Berkeley Hotel', 'Local shopping strip'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'An accessible, community-first café at sub-$1,500/month rent can achieve break-even at 25–30 covers/day. Quality at affordable pricing is the only model that works here.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'Very limited demand for sit-down dining. Quality takeaway or pizza concept at accessible pricing is the most viable option.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Minimal commercial retail demand. Local convenience only.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Community gym at the lowest price point ($35–$50/week) with a genuine community-first atmosphere.',
      },
    },
    competitorCount: '3–5 venues',
    saturationLevel: 'Low',
    whatWorking: 'Community loyalty for businesses that are genuinely present in the neighbourhood.',
    marketGaps: ['Accessible, community-positioned café'],
    rentJustified: true,
    rentReason: 'Lowest rents in the Wollongong metro. The only context where the low-income market becomes financially viable.',
    riskReward: 'Poor',
    successConditions: [
      'Accessible pricing ($4–$4.50 coffee, $10–$13 food)',
      'Genuine community investment — not performing community but being community',
      'Sub-$1,200/month rent — the economics only work at very low overhead',
    ],
    failureRisks: [
      'Any premium positioning in a below-average income community',
      'Expecting foot traffic instead of building community relationships',
    ],
    relatedSuburbs: [
      { slug: 'warrawong', name: 'Warrawong', reason: 'Adjacent suburb with established retail strip and slightly higher income' },
      { slug: 'port-kembla', name: 'Port Kembla', reason: 'Similar industrial community character immediately east' },
      { slug: 'unanderra', name: 'Unanderra', reason: 'Similar working community market between Berkeley and Wollongong CBD' },
    ],
    keyInsight: "Berkeley is not a commercial opportunity in the conventional sense. It is a community opportunity — for an operator who genuinely wants to serve a community rather than extract from it, and who can make the economics work on a lean cost base at the region's lowest rents.",
  },

  'mount-keira': {
    slug: 'mount-keira',
    name: 'Mount Keira',
    metaTitle: 'Open a Business in Mount Keira, Wollongong | Escarpment Residential 2026',
    metaDescription: 'Mount Keira is a scenic escarpment residential suburb with a small community and no commercial strip. Limited business viability — best assessed alongside adjacent Wollongong CBD opportunity.',
    heroSubline: 'Scenic escarpment residential · small community · no commercial strip · limited business viability',
    verdict: 'NO',
    verdictReason: "Mount Keira is a quiet escarpment residential suburb with no established commercial strip. The population is too small and dispersed to support independent hospitality. Business operators should consider the adjacent Wollongong CBD or Gwynneville instead.",
    revenueRange: 'Not applicable',
    rentRange: '$1,000–$1,800/month (residential conversion)',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Established professionals and families who chose Mount Keira for its quiet escarpment character and views. Small community, car-dependent.',
    medianIncome: '$88,000 household median',
    spendingBehavior: 'Residents drive to Wollongong CBD, Gwynneville, or Figtree for hospitality. No expectation of local commercial offering.',
    suburbVibe: 'Scenic, quiet, residential. The escarpment views and proximity to Mount Keira Scout Camp and lookout are the suburb\'s identity. Not a commercial suburb.',
    peakZones: ['Mount Keira lookout (day-tripper destination)', 'Scout Camp track access'],
    anchorBusinesses: ['Mount Keira Summit Park', 'Mount Keira Scout Camp'],
    businessFit: {
      cafe: {
        rating: 'Poor',
        reason: 'No commercial strip, no passing foot traffic, small dispersed population. Not a viable café location.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'No viable commercial restaurant market.',
      },
      retail: {
        rating: 'Poor',
        reason: 'No retail viability without a commercial strip.',
      },
      gym: {
        rating: 'Poor',
        reason: 'Population too small and dispersed for any commercial fitness concept.',
      },
    },
    competitorCount: 'None (no commercial activity)',
    saturationLevel: 'Untapped',
    whatWorking: 'Mount Keira Summit Park day-trippers create a narrow opportunity for a weekend-only kiosk or food truck. Not a fixed commercial tenancy opportunity.',
    marketGaps: ['Weekend kiosk at the summit lookout (seasonal, permit-dependent)'],
    rentJustified: false,
    rentReason: 'Commercial tenancy is not the viable model here. A weekend food truck or kiosk permit at the summit is the only commercially rational approach.',
    riskReward: 'Poor',
    successConditions: [
      'Weekend summit kiosk or food truck — not a fixed commercial tenancy',
      'Council permit for the summit area',
      'Seasonal summer operation only',
    ],
    failureRisks: [
      'Any fixed commercial tenancy without a proven commercial strip',
      'Expecting residents to support a local business without the foot traffic infrastructure',
    ],
    relatedSuburbs: [
      { slug: 'gwynneville', name: 'Gwynneville', reason: 'University-adjacent suburb with genuine daily commercial demand 3km east' },
      { slug: 'wollongong-cbd', name: 'Wollongong CBD', reason: 'The nearest viable commercial location with established foot traffic' },
      { slug: 'figtree', name: 'Figtree', reason: 'Shopping centre suburb with high-income demographics 5km south' },
    ],
    keyInsight: "Mount Keira is a beautiful place to live. It is not a place to open a business. The population is small, dispersed, and already travels to Wollongong CBD or Figtree for commercial needs. Evaluate adjacent suburbs before committing to this location.",
  },

}

export function getWollongongSuburb(slug: string): WollongongSuburb | null {
  return WOLLONGONG_SUBURBS[slug] ?? null
}

export function getAllWollongongSuburbs(): WollongongSuburb[] {
  return Object.values(WOLLONGONG_SUBURBS)
}

export const WOLLONGONG_SUBURB_SLUGS = Object.keys(WOLLONGONG_SUBURBS) as Array<keyof typeof WOLLONGONG_SUBURBS>
