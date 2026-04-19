// lib/newcastle-suburbs.ts
// Canonical data model for /analyse/newcastle/[suburb] pages.
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

export interface NewcastleSuburb {
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

export const NEWCASTLE_SUBURBS: Record<string, NewcastleSuburb> = {

  'merewether': {
    slug: 'merewether',
    name: 'Merewether',
    metaTitle: 'Open a Business in Merewether, Newcastle | Location Intelligence 2026',
    metaDescription: "Merewether is Newcastle's strongest café market by unit economics — high incomes, low competition, and beach lifestyle driving year-round brunch demand. Full rent, competitor, and viability analysis.",
    heroSubline: 'Affluent beach suburb · high discretionary spend · best café opportunity in Newcastle',
    verdict: 'GO',
    verdictReason: "Merewether combines the highest household incomes in inner Newcastle ($96,000+ median), low competition, and a beach-lifestyle demographic that spends generously on quality coffee and brunch. There is no strong incumbent specialty café. A quality operator breaks even at 38–45 customers/day — one of the lowest thresholds in Newcastle metro.",
    revenueRange: '$38,000–$62,000/month',
    rentRange: '$2,200–$4,200/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Young families, dual-income professionals, and lifestyle-oriented owner-occupiers. Skews 28–45. Beach culture is the organising identity.',
    medianIncome: '$96,000 household median',
    spendingBehavior: 'Generous discretionary spend on quality food, coffee, and lifestyle retail. Will pay $20–$26 for brunch. Active weekend beach trade.',
    suburbVibe: 'Affluent coastal suburb with genuine beach lifestyle. Brunch culture is the social anchor. Low-key, community-proud, quality-conscious.',
    peakZones: ["Bather's Way beachfront strip", 'Merewether Beach end of Laman St', 'Glebe Road residential catchment'],
    anchorBusinesses: ['Merewether Surfhouse', 'Beaches on the Beach', 'Beach Hotel'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The strongest café opportunity in Newcastle metro. High-income demographic, near-zero specialty competition, and reliable beach trade. Average ticket $18–$24. Break-even at 38–45/day.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'A quality dinner restaurant with a clear point of difference (seafood, modern Australian) performs well. Beach Hotel captures the mid-market; the gap is in premium sit-down dining.',
      },
      retail: {
        rating: 'Good',
        reason: 'Lifestyle retail — surf/beach accessories, homewares, boutique clothing — matches the demographic perfectly. Avoid commodity retail.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Outdoor exercise culture is dominant. A boutique fitness studio (yoga, pilates, reformer) fits the demographic better than a traditional gym.',
      },
    },
    competitorCount: '6–9 cafés within 1km',
    saturationLevel: 'Low',
    whatWorking: 'Specialty coffee with quality brunch menus is underprovided relative to the demographic. Existing cafés are mid-market. A quality-focused operator has clear space.',
    marketGaps: [
      'Specialty single-origin coffee program',
      'Quality brunch destination (above $22 average ticket)',
      'Artisan bakery-café hybrid',
      'Lifestyle retail for the beach demographic',
    ],
    rentJustified: true,
    rentReason: "At $2,200–$4,200/month, Merewether's rent is the best value-to-demand ratio in inner Newcastle. A café doing 45+ covers/day at $20 average ticket generates $27,000+/month revenue, making rent 8–15% of revenue — within the 10–15% benchmark.",
    riskReward: 'Excellent',
    successConditions: [
      'Quality specialty coffee program and genuine brunch menu',
      "Position on or near Bather's Way for beach foot traffic",
      'Open 7 days including early morning (6:30–7am) to capture beach runners',
      'Instagram-worthy presentation — the demographic actively shares food content',
    ],
    failureRisks: [
      'Opening on Charlestown Road without confirming specific foot traffic at that block',
      'Undercapitalising on fit-out — the demographic makes quality judgments instantly',
      'Ignoring the seasonal beach surge (Oct–Mar adds 25–35% revenue)',
    ],
    relatedSuburbs: [
      { slug: 'cooks-hill', name: 'Cooks Hill', reason: 'The prestige specialty coffee address — Darby Street culture and higher competition' },
      { slug: 'junction', name: 'The Junction', reason: 'Lower rent suburban strip, similar family demographic with less beach premium' },
      { slug: 'hamilton', name: 'Hamilton', reason: 'Beaumont Street dining strip for restaurant operators — more diverse cuisine mix' },
    ],
    keyInsight: "Merewether is the easiest market in Newcastle to build a quality café business. The demographic exists, the spend is there, and the competition is underdeveloped. The only risk is execution quality — this suburb will reward genuine product and punish mediocrity.",
  },

  'cooks-hill': {
    slug: 'cooks-hill',
    name: 'Cooks Hill',
    metaTitle: 'Open a Business in Cooks Hill (Darby Street), Newcastle | 2026 Guide',
    metaDescription: 'Cooks Hill — Darby Street is the strongest independent hospitality strip in regional NSW. High competition but high reward for quality operators. Rent, foot traffic, and market gap analysis.',
    heroSubline: 'Darby Street culture · creative class · café-literate locals · Newcastle\'s independent hospitality spine',
    verdict: 'GO',
    verdictReason: 'Darby Street has genuine street life, a food-literate demographic that actively supports independent business, and average café tickets of $18–22 — significantly above Newcastle average. Competition is real (15+ cafés within 800m) but the market rewards quality and point of difference. The economics work for operators with clear positioning.',
    revenueRange: '$42,000–$78,000/month',
    rentRange: '$2,500–$5,000/month',
    rentLevel: 'Medium',
    competitionLevel: 'High',
    footTrafficLevel: 'High',
    demographics: 'Creative professionals, young adults, café-literate locals. Age skew 24–42. Owner-occupiers and long-term renters who identify strongly with the suburb.',
    medianIncome: '$82,000 household median',
    spendingBehavior: 'Genuine discretionary spend on specialty coffee, quality food, and boutique retail. Will pay a premium for provenance and craft. Loyal once committed to a venue.',
    suburbVibe: 'Darby Street is Newcastle\'s independent hospitality spine — the street equivalent of Fitzroy\'s Brunswick Street or Sydney\'s Newtown. Street life is genuine, browsing culture is embedded.',
    peakZones: ['Darby Street strip (King St to National Park St)', 'Tyrrell Street restaurant cluster', 'Beaumont Street cross-connection'],
    anchorBusinesses: ['Estabar', 'Goldbergs Coffee House', 'The Edwards', 'Newcastle Art Gallery (nearby)'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The highest-reward café market in Newcastle. Darby Street customers pay $18–22 average ticket. A quality specialty café with differentiated menu captures loyal, repeat trade. Competition is the only barrier.',
      },
      restaurant: {
        rating: 'Excellent',
        reason: 'Tyrrell Street and Darby Street have the highest restaurant density and spend. A distinct cuisine with quality execution fills quickly. The dining culture here is the strongest in the Hunter.',
      },
      retail: {
        rating: 'Good',
        reason: 'Boutique retail — independent fashion, books, homewares, gifts — aligns with the demographic. Avoid anything that looks chain-adjacent.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Boutique fitness works (yoga, reformer pilates). Traditional gyms are already covered. Position as lifestyle/wellness rather than performance.',
      },
    },
    competitorCount: '15–20 cafés within 800m',
    saturationLevel: 'Competitive',
    whatWorking: 'Quality independent hospitality consistently outperforms chains on Darby Street. Locals will queue for outstanding product. The strip rewards genuine operators.',
    marketGaps: [
      'Natural wine bar / bottle shop hybrid',
      'Specialty bakery (Newcastle has no Bourke Street Bakery equivalent)',
      'Plant-based restaurant with full dinner menu',
      'High-end degustation concept (the strip is missing a prestige dining anchor)',
    ],
    rentJustified: true,
    rentReason: 'At $18–22 average café ticket and 60–80 covers/day achievable for a quality operator, rent at $3,500/month represents 10–13% of revenue — justified by foot traffic quality.',
    riskReward: 'Good',
    successConditions: [
      'Clear, differentiated positioning — Darby Street has everything mid-market',
      'Quality execution that earns Google review momentum (4.5+ essential)',
      'Verify exact block foot traffic — meaningful variation from King St to National Park St',
      'Budget for fitout that matches the street aesthetic',
    ],
    failureRisks: [
      'Entering with a mid-market concept in a high-competition strip',
      'Under-negotiating rent — every quoted price is a starting point',
      'Foot traffic falls meaningfully past the strip\'s southern end',
    ],
    relatedSuburbs: [
      { slug: 'merewether', name: 'Merewether', reason: 'Highest-income catchment with lower competition — better unit economics for first-time operators' },
      { slug: 'hamilton', name: 'Hamilton', reason: 'Beaumont Street offers similar strip energy with lower rents and more cuisine diversity' },
      { slug: 'wickham', name: 'Wickham', reason: 'First-mover opportunity at lowest inner-Newcastle rents — similar emerging creative demographic' },
    ],
    keyInsight: 'Darby Street is the most competitive independent hospitality strip in the Hunter but also the highest-reward. The market is sophisticated and unforgiving of mediocrity. Operators who bring genuine quality and clear positioning win loyal customers quickly — and those customers become your marketing.',
  },

  'hamilton': {
    slug: 'hamilton',
    name: 'Hamilton',
    metaTitle: 'Open a Business in Hamilton, Newcastle | Beaumont Street Guide 2026',
    metaDescription: 'Hamilton (Beaumont Street) is the most underrated suburb for independent hospitality in Newcastle. Diverse dining culture, medium competition, and rents 40% below inner-Sydney. Full analysis.',
    heroSubline: 'Beaumont Street dining strip · independent hospitality · young professional renters · most underrated suburb',
    verdict: 'GO',
    verdictReason: "Hamilton's Beaumont Street is the most diverse and underrated commercial strip in Newcastle — genuine multicultural restaurants, independent cafés, and boutique businesses at rents 40–50% below Sydney inner-suburb equivalents. A restaurant entering an under-represented cuisine category has the fastest path to local loyalty in Newcastle.",
    revenueRange: '$35,000–$65,000/month',
    rentRange: '$2,000–$4,500/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Young professional renters, established families, multicultural community. Age mix 22–50. High proportion of inner-suburb lifestyle seekers drawn by the strip.',
    medianIncome: '$78,000 household median',
    spendingBehavior: 'Regular dining out and café visits. Will try new cuisines. Less premium-focused than Cooks Hill but genuine food interest. Commuter coffee trade via Hamilton station.',
    suburbVibe: 'Newcastle\'s most diverse suburb commercially. Beaumont Street has Italian, Thai, Indian, Greek, Japanese, and modern Australian all within 600m. Community-proud and independent-first.',
    peakZones: ['Beaumont Street strip (core block at Tudor St to Lindsay St)', 'Hamilton train station surrounds', 'Merthyr Road residential catchment'],
    anchorBusinesses: ['Romeo\'s Italian', 'Earp Distillery (nearby)', 'Hamilton Hotel'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'Consistent commuter demand from Hamilton station and residential catchment. Average ticket $15–19. Break-even at 45–55 covers/day. Competition is manageable.',
      },
      restaurant: {
        rating: 'Excellent',
        reason: 'The strongest restaurant suburb in Newcastle. A distinct cuisine in an underserved category (Korean, Vietnamese, modern Australian, contemporary Indian) fills quickly and builds loyalty. Weekend dinner trade is the primary revenue driver.',
      },
      retail: {
        rating: 'Good',
        reason: 'Boutique retail with clear point of difference works on the Beaumont Street strip. Clothing, gifts, specialty food retail all have precedent and local support.',
      },
      gym: {
        rating: 'Good',
        reason: 'Young professional demographic responds to boutique fitness. Pilates studios and functional training gyms already have traction in the suburb.',
      },
    },
    competitorCount: '20–28 cafés and restaurants within 800m',
    saturationLevel: 'Moderate',
    whatWorking: 'Cuisine diversity is the strip\'s strength. Restaurants that own a clear category build loyal followings quickly. Mid-week dinner trade is growing with the younger residential demographic.',
    marketGaps: [
      'High-quality Vietnamese or Korean restaurant',
      'Contemporary wine bar with food',
      'Quality specialty bakery',
      'Modern Australian with a proper chef-led kitchen',
    ],
    rentJustified: true,
    rentReason: 'Hamilton offers the best value rent-to-foot-traffic ratio of any established strip in Newcastle. $2,500–$3,500/month for a quality Beaumont Street position is exceptional value versus Sydney comparables.',
    riskReward: 'Good',
    successConditions: [
      'Distinct cuisine category or clear point of difference from existing strip offers',
      'Strong weekend dinner concept — weekday lunch is secondary revenue',
      'Quality on-street signage and presence (strip is well-walked)',
      'Build local loyalty via community presence (neighbourhood events, regular specials)',
    ],
    failureRisks: [
      'Undifferentiated concept in a strip that already has everything mid-market',
      'Ignoring the post-Thursday dinner traffic drop for less-established concepts',
      'Positioning price points above the suburb\'s average ticket expectations without clear quality justification',
    ],
    relatedSuburbs: [
      { slug: 'cooks-hill', name: 'Cooks Hill', reason: 'Darby Street for specialty café operators — higher rents, higher upside' },
      { slug: 'adamstown', name: 'Adamstown', reason: 'Lower competition and rent for operators who want to be first in a suburb' },
      { slug: 'merewether', name: 'Merewether', reason: 'Beach-lifestyle demographic for café operators prioritising income demographics' },
    ],
    keyInsight: "Hamilton's Beaumont Street is the most underrated commercial address in the Hunter. Sydney operators priced out of inner suburbs should assess Hamilton first — the combination of genuine strip life, multicultural dining culture, and rents 40% below equivalent Sydney strips is a genuine opportunity.",
  },

  'newcastle-cbd': {
    slug: 'newcastle-cbd',
    name: 'Newcastle CBD',
    metaTitle: 'Open a Business in Newcastle CBD | Hunter Street Location Analysis 2026',
    metaDescription: 'Newcastle CBD is mid-transformation. Light rail, Hunter Street redevelopment, and growing apartment population are positive signals — but rent is priced optimistically. Full viability analysis.',
    heroSubline: 'Coastal urban revival · office workers · light rail · tourism · Hunter Street redevelopment',
    verdict: 'CAUTION',
    verdictReason: 'The CBD is genuinely improving — the light rail, apartment growth, and Hunter Street Mall redevelopment have pushed weekday foot traffic meaningfully higher. The caution is on rent: marquee Hunter Street positions are priced optimistically relative to the hospitality culture the CBD is still building. Negotiate hard on rent and validate foot traffic at your specific address before committing.',
    revenueRange: '$42,000–$85,000/month',
    rentRange: '$3,500–$8,000/month',
    rentLevel: 'High',
    competitionLevel: 'High',
    footTrafficLevel: 'High',
    demographics: 'Office workers (weekday), coastal tourists (weekends/summer), growing apartment resident base. Mixed age range. Increasing younger professional residents.',
    medianIncome: '$74,000 household median',
    spendingBehavior: 'Weekday lunch and coffee trade from office towers. Weekend tourist and leisure spend. Less price-sensitive than suburban markets when the offering is clearly quality-led.',
    suburbVibe: 'Mid-transformation urban precinct. The light rail corridor, the foreshore redevelopment, and the apartment pipeline are all pointing upward. The bar for quality has risen — chains no longer dominate.',
    peakZones: ['Hunter Street Mall (post-redevelopment)', 'Honeysuckle waterfront', 'Scott Street office precinct', 'King Street restaurant strip'],
    anchorBusinesses: ['The Edwards', 'Scott Street hospitality cluster', 'Newcastle Museum', 'Civic Theatre'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'Office tower proximity is the driver. A café on a commuter-flow street (Scott/King) can hit 55–65 covers before 10am. Avoid Hunter Street Mall positions with high rent and uncertain foot traffic on their specific block.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'King Street and Hunter Street have genuine dinner trade growing. A quality restaurant needs a clear dinner draw — weekend foot traffic drops after 6pm outside event nights.',
      },
      retail: {
        rating: 'Good',
        reason: 'The CBD retail opportunity is in categories that serve office workers and tourists — specialty food, gifts, concept stores. The Hunter Street Mall redevelopment will improve the retail environment through 2026–2027.',
      },
      gym: {
        rating: 'Good',
        reason: 'CBD office worker demographic is the gym\'s best customer. A functional training or boutique format at accessible price points ($70–$90/week) has strong demand.',
      },
    },
    competitorCount: '30–45 cafés and restaurants within 1km',
    saturationLevel: 'Competitive',
    whatWorking: 'Quality specialty hospitality is outperforming chains as the CBD demographic upgrades. The Honeysuckle waterfront cluster is performing above expectations.',
    marketGaps: [
      'Quality fast-casual lunch concept for office workers ($14–18 price point)',
      'Specialty coffee with proper office commuter infrastructure (efficient queue, good pre-order)',
      'Evening wine bar serving the growing apartment population',
    ],
    rentJustified: false,
    rentReason: 'Hunter Street headline rents ($5,000–$8,000/month) are not justified by current foot traffic on many blocks. Vacancy rates remain elevated. A café needs 55–65 covers/day to break even at $5,000/month rent. Validate actual foot traffic at your specific address before accepting any quoted rent.',
    riskReward: 'Moderate',
    successConditions: [
      'Secure a lease with rent at or below $4,500/month for your first CBD position',
      'Commission a foot traffic count at your specific address — block-by-block variation is extreme',
      'Office tower proximity is the single biggest predictor of weekday café success',
      'Build an event-day revenue strategy (Newcastle hosts 30+ major events/year)',
    ],
    failureRisks: [
      'Paying headline rent on a Hunter Street block that has below-average pedestrian flow',
      'Building a financial model on weekend tourism revenue as the primary driver',
      'Launching a full restaurant concept without a clear dinner draw in the 2026 market',
    ],
    relatedSuburbs: [
      { slug: 'honeysuckle', name: 'Honeysuckle', reason: 'Waterfront precinct adjacent to CBD — lower rents, growing dining destination' },
      { slug: 'cooks-hill', name: 'Cooks Hill', reason: 'Better foot traffic quality and clearer food culture than the CBD at similar rent' },
      { slug: 'wickham', name: 'Wickham', reason: 'Urban renewal precinct with first-mover advantage at much lower rent' },
    ],
    keyInsight: 'The Newcastle CBD is the right direction but not yet the right rent. The transformation is real — in 2028 this analysis will read differently. For 2026, the operators who win in the CBD are those who negotiate rents 20–30% below quoted rates and choose locations with proven foot traffic rather than aspirational Hunter Street Mall positions.',
  },

  'honeysuckle': {
    slug: 'honeysuckle',
    name: 'Honeysuckle',
    metaTitle: 'Open a Business in Honeysuckle, Newcastle | Waterfront Precinct 2026',
    metaDescription: "Honeysuckle is Newcastle's growing waterfront dining destination. Weekend leisure trade is established; weekday lunch trade is building with the apartment population. Full location analysis.",
    heroSubline: 'Waterfront dining precinct · apartments · weekend leisure · growing lunch trade',
    verdict: 'GO',
    verdictReason: "Honeysuckle's waterfront position, established apartment population, and growing reputation as Newcastle's weekend dining destination creates a genuine GO scenario for quality restaurant and bar operators. Weekend trade is the primary driver — weekday lunch is supplementary and growing with apartment density.",
    revenueRange: '$40,000–$80,000/month',
    rentRange: '$2,800–$6,000/month',
    rentLevel: 'High',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Apartment residents, Newcastle CBD workers, weekend leisure visitors, families on weekends. Growing millennial and professional resident base.',
    medianIncome: '$81,000 household median',
    spendingBehavior: 'Weekend dining and brunch is the primary spend driver. Will spend on quality waterfront experiences. Less price-sensitive on weekends. Apartment dwellers are regular repeat customers.',
    suburbVibe: 'Polished waterfront precinct. Feels purposefully developed but has genuine weekend life. The dining strip along Honeysuckle Drive is the reference point.',
    peakZones: ['Honeysuckle Drive waterfront strip', 'Newcastle Foreshore Park', 'Honeysuckle Station surrounds'],
    anchorBusinesses: ['The Deck at Honeysuckle', 'Nagisa Japanese', 'Honeysuckle Hotel'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'Weekend brunch is strong. Weekday is the gap — apartment population generates consistent morning demand. A café with waterfront positioning and quality brunch can hit 50+ covers on Saturday-Sunday reliably.',
      },
      restaurant: {
        rating: 'Excellent',
        reason: 'The highest-performing restaurant format is a quality casual dining concept with waterfront views and a clear dinner narrative. Seafood, modern Australian, and share-plate formats all work.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Retail has limited traction in Honeysuckle. The precinct is primarily hospitality. Artisan food retail or experience-based retail can work on weekends.',
      },
      gym: {
        rating: 'Fair',
        reason: 'The apartment demographic is a strong gym customer. A boutique fitness studio (pilates, yoga, reformer) would serve the resident base well at accessible price points.',
      },
    },
    competitorCount: '8–14 restaurants and cafés within 600m',
    saturationLevel: 'Moderate',
    whatWorking: 'Waterfront dining has established demand. The precinct pulls weekend visitors from across Newcastle. Quality operators with genuine food programs perform well.',
    marketGaps: [
      'Quality specialty café for the morning apartment crowd',
      'Japanese or Asian-fusion dinner restaurant (gap in the precinct)',
      'Premium cocktail bar with food (evening economy growing)',
    ],
    rentJustified: true,
    rentReason: 'Waterfront positioning commands a premium that is justified by weekend foot traffic volume. Ensure the lease allows for outdoor seating — alfresco positions generate 30–40% of revenue on good weather weekends.',
    riskReward: 'Good',
    successConditions: [
      'Waterfront or water-view position — the precinct reward is tied to the outlook',
      'Weekend trade strategy that maximises Saturday-Sunday revenue',
      'Outdoor seating provision — critical for the waterfront format',
      'Build apartment-resident loyalty through weekday offerings',
    ],
    failureRisks: [
      'Building on weekday lunch trade that is still maturing',
      'Indoors-only format that loses the waterfront premium',
      'Opening without a clear dinner concept — evenings are where the revenue ceiling is highest',
    ],
    relatedSuburbs: [
      { slug: 'newcastle-cbd', name: 'Newcastle CBD', reason: 'Adjacent precinct with higher weekday office trade and more diverse location options' },
      { slug: 'cooks-hill', name: 'Cooks Hill', reason: 'Stronger lunch and all-day trade; less dependent on waterfront weather' },
      { slug: 'carrington', name: 'Carrington', reason: 'Heritage waterfront alternative at significantly lower rent with boutique character' },
    ],
    keyInsight: "Honeysuckle has quietly become Newcastle's most reliable weekend dining precinct. The apartment population makes weekday trade viable and growing. A quality operator who understands the weekend-primary revenue model and commits to waterfront activation will build a strong business here.",
  },

  'junction': {
    slug: 'junction',
    name: 'The Junction',
    metaTitle: 'Open a Café or Business in The Junction, Newcastle | 2026 Analysis',
    metaDescription: 'The Junction is a compact Newcastle suburb with a loyal residential demographic and low café competition. Best value suburban café market for operators who want community loyalty over volume.',
    heroSubline: 'Suburban village feel · family-oriented · low competition · high local loyalty',
    verdict: 'GO',
    verdictReason: 'The Junction has no strong quality café incumbent despite a family-oriented demographic with decent spending power. An operator who installs quality here at below-market rent becomes the suburb\'s default café — a loyalty position that is extremely difficult for competitors to dislodge.',
    revenueRange: '$22,000–$38,000/month',
    rentRange: '$1,800–$3,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Established families, owner-occupiers, professionals aged 30–55. Strong community identity. Long-term residents who shop local by preference.',
    medianIncome: '$86,000 household median',
    spendingBehavior: 'Regular café visits for community social ritual. Will pay for quality at a local venue they trust. Not driven by novelty — driven by reliability and warmth.',
    suburbVibe: 'Compact, confident suburban village. The Glebe Road strip is small but active. Community connection is the organising value.',
    peakZones: ['Glebe Road strip (core 200m)', 'Tuesday–Saturday morning peak', 'After-school afternoon window'],
    anchorBusinesses: ['The Junction Hotel', 'Junction post office strip'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The best first-mover opportunity in inner Newcastle for a community-positioned café. No strong incumbent. Resident base drives 4–5 visits/week from loyal regulars. Break-even at 35–42 covers/day.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'The Junction strip is too small for a destination restaurant. A quality takeaway or pizza concept works; a full-service dinner restaurant has limited local capture.',
      },
      retail: {
        rating: 'Good',
        reason: 'Convenience and lifestyle retail for the family demographic — quality food retail, specialty groceries, gifts. Avoid fashion or category retail that requires destination pull.',
      },
      gym: {
        rating: 'Fair',
        reason: 'A small boutique studio (yoga, pilates) for the family demographic can work, but the suburb is too small for a full gym format.',
      },
    },
    competitorCount: '3–5 cafés within 800m',
    saturationLevel: 'Low',
    whatWorking: 'Local loyalty is the dominant commercial force here. Businesses that invest in community relationships sustain well above their foot traffic numbers.',
    marketGaps: [
      'Quality specialty café (first-mover position)',
      'Premium artisan bakery-café (no incumbent)',
      'Specialty local food retail (deli, cheese, wine)',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,500/month rent in a suburb with $86,000 median household income and low competition is exceptional value. The community-loyalty revenue model means a well-run café here generates reliable income on a low cost base.',
    riskReward: 'Good',
    successConditions: [
      'Community presence is non-negotiable — local Facebook groups, school networks, sporting clubs',
      'Quality coffee and a focused food menu (10–14 items, done well)',
      'Early opening (6:30–7am) to capture the commuter and school-run window',
      'Friendly, consistent service that builds personal relationships',
    ],
    failureRisks: [
      'Treating The Junction as a passing foot traffic play — it is not',
      'Trying to attract visitors from outside the immediate catchment as primary strategy',
      'Overly premium positioning without earning the community\'s trust first',
    ],
    relatedSuburbs: [
      { slug: 'merewether', name: 'Merewether', reason: 'Higher-income beach suburb with similar family demographic and higher revenue ceiling' },
      { slug: 'adamstown', name: 'Adamstown', reason: 'Comparable community suburb with larger resident catchment and even lower rents' },
      { slug: 'lambton', name: 'Lambton', reason: 'Similar quiet suburban strip with loyal local demographic' },
    ],
    keyInsight: "The Junction is for operators who want to own a suburb rather than chase foot traffic. The community-first business model generates remarkable loyalty and resilience. A café that becomes The Junction's social hub in year one is almost impossible to dislodge in year three.",
  },

  'adamstown': {
    slug: 'adamstown',
    name: 'Adamstown',
    metaTitle: 'Open a Business in Adamstown, Newcastle | Emerging Café Market 2026',
    metaDescription: "Adamstown is Newcastle's clearest emerging café opportunity — 12,000+ residents, an established strip on Brunker Road, and almost no quality café competition. Lowest break-even threshold in Newcastle.",
    heroSubline: 'Established working families · underserved local strip · clearest first-mover café opportunity in Newcastle',
    verdict: 'GO',
    verdictReason: "Adamstown has 12,000+ residents, an established commercial strip on Brunker Road, and almost no quality café offering. Rents are among Newcastle's lowest for an established suburb. Break-even at 32–38 covers/day is the lowest target in Newcastle metro. The opportunity is real and uncontested.",
    revenueRange: '$20,000–$35,000/month',
    rentRange: '$1,500–$3,000/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Established working families and owner-occupiers. Age mix 30–55. Community-oriented, local-first shopping behaviour.',
    medianIncome: '$71,000 household median',
    spendingBehavior: 'Price-conscious but will pay for quality at a local venue they trust. Coffee is a daily ritual. Brunch is a weekend occasion, not daily.',
    suburbVibe: 'Solid, established suburban strip. Brunker Road has butchers, bakeries, and convenience. The gap is in quality hospitality.',
    peakZones: ['Brunker Road commercial strip', 'Adamstown train station corridor', 'Weekend morning window'],
    anchorBusinesses: ['Adamstown Hotel', 'Local strip shopping'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The strongest first-mover café position in Newcastle by unit economics. 12,000+ resident catchment, virtually no specialty competition, lowest break-even in the metro. An operator here at $1,800/month rent breaks even at 32 covers/day.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A quality takeaway or pizza concept fits Adamstown better than a full-service restaurant. Residents will support a quality local dinner option but the destination-dining pull is limited.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Convenience and community retail (specialty food, local gifts) can work. Avoid premium or destination retail that requires visitors from outside the suburb.',
      },
      gym: {
        rating: 'Fair',
        reason: 'A functional, value-positioned gym ($60–$75/week) for the family demographic has demand. The community mindset suits a neighbourhood gym rather than a premium studio.',
      },
    },
    competitorCount: '4–6 cafés within 1km (none quality-specialty)',
    saturationLevel: 'Untapped',
    whatWorking: 'The strip has consistent local foot traffic. Existing hospitality is low-quality. A quality operator enters against no meaningful competition.',
    marketGaps: [
      'Specialty café (first and only in the suburb)',
      'Quality takeaway with a proper menu',
      'Artisan bakery',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month rent against a 12,000+ resident catchment with zero quality café competition is the best value in Newcastle metro. A café at $1,800/month that does 38 covers/day at $15 average ticket generates $17,100/month revenue — rent is under 11%.',
    riskReward: 'Excellent',
    successConditions: [
      'Price positioning accessible to the demographic ($4.50–$5.50 coffee)',
      'Community integration — local sporting clubs, schools, Facebook groups',
      'Quality over trend — this suburb rewards consistency and friendliness over Instagram aesthetics',
      'Weekend brunch menu as the anchor draw',
    ],
    failureRisks: [
      'Specialty-premium pricing ($6+ coffee) before earning community trust',
      'Inconsistent hours or quality — community loyalty is won slowly and lost fast',
      'Ignoring the local community network and relying on passing foot traffic',
    ],
    relatedSuburbs: [
      { slug: 'hamilton', name: 'Hamilton', reason: 'Higher income demographic and established dining strip for operators who want proven foot traffic' },
      { slug: 'junction', name: 'The Junction', reason: 'Similar community-first suburb with smaller catchment but higher median income' },
      { slug: 'waratah', name: 'Waratah', reason: 'Similar opportunity profile with the added hospital worker demand base' },
    ],
    keyInsight: 'Adamstown is the best risk-adjusted café opportunity in Newcastle. The combination of large resident catchment, zero quality competition, and lowest-break-even economics makes this the most compelling suburb for a first-time operator or a brand entering Newcastle.',
  },

  'waratah': {
    slug: 'waratah',
    name: 'Waratah',
    metaTitle: 'Open a Business in Waratah, Newcastle | Hospital Precinct Analysis 2026',
    metaDescription: 'Waratah has a hidden advantage — proximity to John Hunter Hospital (5,000+ staff) generates predictable medical-professional café demand 5 days/week. Full location and viability analysis.',
    heroSubline: 'Hospital precinct · reliable weekday demand · blue-collar community · predictable coffee trade',
    verdict: 'GO',
    verdictReason: "John Hunter Hospital — one of NSW's largest regional hospitals with 5,000+ staff — generates reliable weekday medical-professional café demand that is almost entirely unserved. A café within 400m of the hospital entrance can achieve 80+ covers by month three from hospital staff alone.",
    revenueRange: '$22,000–$38,000/month',
    rentRange: '$1,300–$2,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Hospital workers (nurses, doctors, admin), local working families, blue-collar community. Strong weekday footfall from medical precinct.',
    medianIncome: '$67,000 household median',
    spendingBehavior: 'Reliable weekday café visits from hospital staff on shift-change patterns (7–9am, 12:30–1:30pm, 3–4pm). Accessible pricing preference ($4.50–$5.50 coffee).',
    suburbVibe: 'Unpretentious working-class suburb anchored by hospital precinct. Turton Road is the main commercial spine.',
    peakZones: ['Turton Road within 400m of John Hunter Hospital', 'Shift-change windows (7am, 1pm, 3pm)', 'Monday–Friday peak'],
    anchorBusinesses: ['John Hunter Hospital (5,000+ staff)', 'Hunter New England Health precinct'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'Hospital proximity creates structured daily demand that most café locations cannot replicate. Shift workers visit on predictable schedules. 80+ covers/day by month three is achievable from staff alone. Weekend trade is thin — build the model on weekdays.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A quality takeaway or lunch restaurant for hospital workers performs well at accessible pricing ($12–16 meals). A full-service dinner restaurant has limited demand outside the hospital trade.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Retail without a connection to the hospital worker demographic is difficult. A pharmacy, convenience, or health-adjacent retail can work.',
      },
      gym: {
        rating: 'Good',
        reason: 'Hospital staff are a strong gym customer. A functional gym at $60–$75/week close to the hospital captures shift-worker demand across morning, afternoon, and evening sessions.',
      },
    },
    competitorCount: '3–5 cafés within 800m (none specifically positioned for hospital trade)',
    saturationLevel: 'Untapped',
    whatWorking: 'Hospital foot traffic is structured and predictable. There is no quality café specifically positioned for the medical professional demographic within the immediate precinct.',
    marketGaps: [
      'Quality café within 400m of hospital entrance',
      'Fast-casual healthy lunch for hospital workers',
      'Grab-and-go breakfast and coffee for early shift workers (5:30–7am)',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month rent with 5,000+ potential daily customers within 400m walking distance is exceptional value. The hospital creates a captive demand base that justifies confidence in the financial model.',
    riskReward: 'Good',
    successConditions: [
      'Location within 400m of John Hunter Hospital entrance (walking distance matters)',
      'Open for early shifts (5:30–6am start for the first shift change)',
      'Efficient service — hospital workers have strict break times',
      'Accessible pricing ($4.50–$5.50 coffee, $12–16 lunch)',
    ],
    failureRisks: [
      'Location more than 600m from the hospital entrance — walking threshold matters',
      'Premium pricing that hospital staff find inconvenient relative to the hospital canteen',
      'Weak weekend trade strategy — you need a secondary revenue source for Saturday-Sunday',
    ],
    relatedSuburbs: [
      { slug: 'adamstown', name: 'Adamstown', reason: 'Similar first-mover opportunity profile with large residential catchment' },
      { slug: 'wallsend', name: 'Wallsend', reason: 'Comparable working-community suburb at similar rent levels' },
      { slug: 'lambton', name: 'Lambton', reason: 'Quiet residential strip with similar low-competition café opportunity' },
    ],
    keyInsight: 'The hospital anchor makes Waratah the most defensible weekday café position in Newcastle metro. Hospital workers are the most reliable café customers in existence — structured shifts, consistent schedules, price-accessible preference, and genuine loyalty to a quality local option. Build this business for Monday-to-Friday and treat weekends as upside.',
  },

  'kotara': {
    slug: 'kotara',
    name: 'Kotara',
    metaTitle: 'Open a Business in Kotara, Newcastle | Westfield Precinct Analysis 2026',
    metaDescription: 'Kotara is home to Westfield — high foot traffic but structured around national chains. The opportunity for an independent is in categories Westfield under-serves. Full analysis.',
    heroSubline: 'Westfield-anchored · family suburban · high foot traffic · independent niche opportunity',
    verdict: 'CAUTION',
    verdictReason: "Westfield Kotara dominates the suburb's commercial landscape. The opportunity for an independent is in categories Westfield under-serves: specialty food, artisan product, and experience-led retail. A generic café or restaurant inside will compete directly with major chains at a structural disadvantage. The opportunity is specific — not broad.",
    revenueRange: '$28,000–$55,000/month',
    rentRange: '$2,500–$6,000/month',
    rentLevel: 'Medium',
    competitionLevel: 'Medium',
    footTrafficLevel: 'High',
    demographics: 'Suburban families, retirees, car-dependent shoppers. Primary catchment radius 5km. Weekend family shopping is the dominant commercial pattern.',
    medianIncome: '$76,000 household median',
    spendingBehavior: 'High volume, price-conscious. National chain reference pricing. Will pay premium only for a clearly differentiated quality experience.',
    suburbVibe: 'Car-dependent suburban retail. Westfield is the anchor. Park Avenue and surrounds offer the independent opportunity outside the centre.',
    peakZones: ['Park Avenue adjacent to Westfield', 'Kotara train station surrounds', 'Saturday-Sunday family shopping peak'],
    anchorBusinesses: ['Westfield Kotara', 'Event Cinemas Kotara'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'A quality café on Park Avenue adjacent to Westfield gets overflow foot traffic without paying centre rent. The key is differentiation from Westfield chains — specialty coffee, quality brunch, clearly non-chain positioning.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'Independent restaurants in centre-adjacent positions can work with a cuisine gap that Westfield does not cover. Avoid direct competition with food court formats.',
      },
      retail: {
        rating: 'Good',
        reason: 'Artisan, specialty, or experience retail adjacent to the centre captures the demographic that actively avoids chains. The family demographic will seek out a genuinely different offer.',
      },
      gym: {
        rating: 'Good',
        reason: 'Family-oriented fitness (functional training, group classes) with accessible pricing ($70–$90/week) has strong demand from the suburban family demographic.',
      },
    },
    competitorCount: '15–20 cafés within 1km (majority chain-format)',
    saturationLevel: 'Competitive',
    whatWorking: "Independents adjacent to Westfield who clearly differentiate from the food court. Specialty coffee and quality brunch is the most reliable gap — Westfield's café offering is chain-dominated.",
    marketGaps: [
      'Quality specialty café adjacent to (not inside) Westfield',
      'Artisan bakery with café seating',
      'Experience retail that Westfield does not offer (board games, specialty toys, craft)',
    ],
    rentJustified: false,
    rentReason: "In-centre Westfield rents include turnover clauses and high base rent that disadvantages independents. External Park Avenue positions at $2,500–$3,500/month are the justified range. Avoid in-centre positions unless you've done the turnover rent math with a hospitality accountant.",
    riskReward: 'Moderate',
    successConditions: [
      'External position on Park Avenue rather than inside the centre',
      'Clear non-chain differentiation visible from the street',
      'Read all lease terms — Westfield in-centre leases have specific turnover clauses',
      'Strong Saturday-Sunday trading strategy for the family peak',
    ],
    failureRisks: [
      'Signing an in-centre Westfield lease without fully understanding turnover rent clauses',
      'A generic café concept that competes with chains on chain territory',
      'Ignoring that weekday non-school-term foot traffic drops significantly',
    ],
    relatedSuburbs: [
      { slug: 'charlestown', name: 'Charlestown', reason: 'Similar Westfield-adjacent dynamic — read the same caution notes' },
      { slug: 'adamstown', name: 'Adamstown', reason: 'No Westfield competition, lower rent, clear first-mover position' },
      { slug: 'hamilton', name: 'Hamilton', reason: 'Established independent strip with higher baseline quality trade' },
    ],
    keyInsight: "Kotara's foot traffic is real but not for everyone. Independents who position clearly against the chain format — specialty, artisan, experiential — find a receptive audience. Generalist formats that try to compete on Westfield's terms will lose.",
  },

  'jesmond': {
    slug: 'jesmond',
    name: 'Jesmond',
    metaTitle: 'Open a Business in Jesmond, Newcastle | University Precinct Analysis 2026',
    metaDescription: "Jesmond's University of Newcastle proximity delivers strong semester-time foot traffic but 35–45% drops during breaks. Seasonal financial modelling is essential. Full analysis.",
    heroSubline: 'University student belt · volume-hungry · price-sensitive · seasonal revenue model',
    verdict: 'CAUTION',
    verdictReason: "University proximity is a double-edged sword. Semester time delivers strong 7-day foot traffic and a volume-hungry market. Outside semester (November–February, July), foot traffic drops 35–45% as students leave. Never model Jesmond on semester-peak performance.",
    revenueRange: '$18,000–$32,000/month (semester average)',
    rentRange: '$1,500–$3,000/month',
    rentLevel: 'Low',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'University of Newcastle students and staff, long-term residents, young professionals. Heavy student population during semester.',
    medianIncome: '$58,000 household median (student-skewed)',
    spendingBehavior: 'Price-sensitive. Volume-driven. Sub-$5 coffee and $10–$14 food is the market sweet spot. High frequency, low ticket.',
    suburbVibe: 'Student-dominated commercial strip. Value-for-money is the dominant commercial signal. High-quality but accessible pricing outperforms premium positioning.',
    peakZones: ['Griffith Street student strip', 'University Road (UoN proximity)', 'Semester Monday–Thursday peak'],
    anchorBusinesses: ['University of Newcastle main campus', 'Jesmond Village shopping strip'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'High-volume, accessible pricing ($4.50–$5 coffee, $10–14 food) works well in semester. A café that does 90–120 covers on a Tuesday in semester needs to survive 50–60 covers in late November. Model conservatively.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A value-focused restaurant (BYO, accessible pricing, generous portions) fits the student market. Premium dining struggles without a secondary non-student customer base.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Student-essential retail (stationery, convenience, textbooks) works year-round. Lifestyle retail is semester-dependent and struggles in breaks.',
      },
      gym: {
        rating: 'Good',
        reason: 'Students are a strong gym demographic if the pricing is accessible ($40–$60/week or semester-based memberships). Semester membership structures that align with academic calendar outperform month-to-month.',
      },
    },
    competitorCount: '10–16 cafés and takeaways within 1km',
    saturationLevel: 'Moderate',
    whatWorking: 'Volume-first concepts at accessible pricing. BYO restaurants. Fast and reliable coffee service.',
    marketGaps: [
      'Quality fast casual lunch at student price points ($12–$15)',
      'Study-friendly café with good WiFi and long opening hours',
      'International cuisine reflecting the student demographic (Korean, Vietnamese)',
    ],
    rentJustified: true,
    rentReason: 'Low rent is the saving grace of the Jesmond model. At $1,800–$2,200/month rent, a café can survive semester-break volume drops without crisis. The annual average revenue model must account for the seasonal pattern.',
    riskReward: 'Moderate',
    successConditions: [
      'Build financial model on semester-break volume (not semester-peak)',
      'Accessible pricing — resist the urge to go specialty-premium',
      'Study-friendly environment if café-format (outlets, WiFi, tables)',
      'Plan a semester-break revenue strategy (events, locals, delivery)',
    ],
    failureRisks: [
      'Modelling annual revenue based on semester-peak weeks',
      'Specialty-premium pricing that the student market rejects',
      'No semester-break contingency plan',
    ],
    relatedSuburbs: [
      { slug: 'adamstown', name: 'Adamstown', reason: 'Established residential catchment without seasonal revenue volatility' },
      { slug: 'hamilton', name: 'Hamilton', reason: 'More diverse and stable customer base at comparable rent levels' },
      { slug: 'broadmeadow', name: 'Broadmeadow', reason: 'Another event-dependent market — different type of seasonal pattern' },
    ],
    keyInsight: "Jesmond is viable but requires seasonal financial discipline. Operators who understand the semester cycle and build their fixed cost base on break-period volumes — treating semester as the upside rather than the baseline — build sustainable businesses here.",
  },

  'charlestown': {
    slug: 'charlestown',
    name: 'Charlestown',
    metaTitle: 'Open a Business in Charlestown, Newcastle | Shopping Centre Analysis 2026',
    metaDescription: 'Charlestown Square is a major shopping centre with high foot traffic but chain-dominated hospitality. An independent needs a clear quality differential to attract deliberate visit. Full analysis.',
    heroSubline: 'Major shopping centre · big-box retail · families · chain-dominated hospitality',
    verdict: 'CAUTION',
    verdictReason: "Charlestown Square is one of Newcastle's largest shopping centres. High foot traffic is real but almost entirely captured by national chains. An independent café or restaurant here needs a quality differential significant enough to make customers choose it deliberately over the chain defaults.",
    revenueRange: '$28,000–$52,000/month',
    rentRange: '$2,500–$5,500/month',
    rentLevel: 'Medium',
    competitionLevel: 'High',
    footTrafficLevel: 'High',
    demographics: 'Suburban families, retirees, volume shoppers. Primary catchment 5–7km. Weekend family shopping is the dominant pattern.',
    medianIncome: '$72,000 household median',
    spendingBehavior: 'Value-conscious. Chain-price reference point. Will pay up for a clearly better experience but needs to see clear justification.',
    suburbVibe: 'Suburban big-box retail precinct. Charlestown Square sets the commercial tone. Street-level opportunity is in positions adjacent to rather than inside the centre.',
    peakZones: ['Adjacent to Charlestown Square (external positions)', 'Pearson Street strip', 'Weekend family shopping peak'],
    anchorBusinesses: ['Charlestown Square', 'Kmart, Woolworths, Big W anchors'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'The chain café environment is highly competitive. An independent café adjacent to Charlestown Square with specialty positioning and clear quality differentiation can attract the deliberate-choice customer. A generic café here loses.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'High restaurant churn adjacent to major centres is well-documented. Independent restaurants without a compelling differentiation and destination draw struggle against the centre\'s food court.',
      },
      retail: {
        rating: 'Good',
        reason: 'Categories that Charlestown Square under-serves — specialty food, artisan product, experience retail — find an audience adjacent to the centre.',
      },
      gym: {
        rating: 'Good',
        reason: 'Family-oriented gym at accessible pricing. The suburb catchment is large. A value-gym or family-fitness format performs well.',
      },
    },
    competitorCount: '20–30 hospitality venues within 1km (majority chain-format)',
    saturationLevel: 'Oversaturated',
    whatWorking: 'Independents that clearly differentiate from the chain format. Quality specialty coffee adjacent to the centre finds a loyal, deliberate customer base.',
    marketGaps: [
      'Quality specialty café (non-chain, adjacent to centre)',
      'Artisan food retail / deli (under-served in this format)',
      'Experience retail (escape rooms, specialty hobbies)',
    ],
    rentJustified: false,
    rentReason: 'Verify competitor longevity before signing — the area around Charlestown Square has high restaurant and café churn. The foot traffic looks attractive from the outside but the economics of non-chain hospitality are difficult in this environment.',
    riskReward: 'Moderate',
    successConditions: [
      'External position adjacent to centre — avoid in-centre if independent',
      'Clear quality differential visible from the street',
      'Specialty positioning (not generic café or restaurant)',
      'Weekend family strategy with takeaway and convenience components',
    ],
    failureRisks: [
      'Competing directly with the food court on price and convenience',
      'Signing a lease without verifying the churn rate of previous tenants at that specific address',
      'Generic hospitality concept in a high-chain-competition environment',
    ],
    relatedSuburbs: [
      { slug: 'kotara', name: 'Kotara', reason: 'Similar Westfield-adjacent dynamic — apply the same caution framework' },
      { slug: 'adamstown', name: 'Adamstown', reason: 'Lower competition, lower rent, clearer first-mover position' },
      { slug: 'belmont', name: 'Belmont', reason: 'Suburban convenience market at lower rent with less chain competition' },
    ],
    keyInsight: 'The Charlestown foot traffic is real. The question is whether you can build a business that earns a deliberate-choice customer in a chain-saturated environment. Independent operators who answer yes — with genuine quality and clear positioning — can thrive. Everyone else will be another churn statistic.',
  },

  'mayfield': {
    slug: 'mayfield',
    name: 'Mayfield',
    metaTitle: 'Open a Business in Mayfield, Newcastle | Emerging Suburb Analysis 2026',
    metaDescription: "Mayfield is where Newcastle's next independent hospitality wave is taking root — cheap rents, industrial-conversion spaces, young renters, and genuine first-mover advantage. 5-year play.",
    heroSubline: 'Industrial grit meets gentrification · young renters · first-mover advantage · lowest inner-Newcastle rents',
    verdict: 'GO',
    verdictReason: "Mayfield has the DNA of an early-stage gentrifying suburb: sub-$2,000/month rents, industrial-conversion spaces, an influx of young renters, and a growing appetite for quality local food. The first quality independent café on Maitland Road will own the morning for 3–4 years before competition follows.",
    revenueRange: '$18,000–$32,000/month',
    rentRange: '$1,200–$2,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Young renters (24–35), creative workers, young families priced out of inner suburbs. Growing influx following urban renewal investment.',
    medianIncome: '$64,000 household median (shifting upward)',
    spendingBehavior: 'Quality-seeking despite lower incomes — young renters prioritise experiences over possessions. Coffee is a daily ritual and a social signal. Will support independents actively.',
    suburbVibe: 'Industrial heritage in transition. Raw spaces, warehouse conversions, artists and makers arriving. The feeling of a suburb becoming something.',
    peakZones: ['Maitland Road strip', 'Industrial-to-residential conversion zones', 'Morning coffee window'],
    anchorBusinesses: ['Mayfield Hotel', 'Early-stage creative business cluster'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'First-mover advantage is the entire thesis. A quality café on Maitland Road has no incumbent to compete with. 90-day ramp to loyal local base is realistic. The risk is that volume takes 12–18 months to build. Operators who can hold through the ramp win a 3–4 year unchallenged position.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'A quality casual restaurant (share plates, natural wine, modern Australian) would be the only quality dinner option in the suburb. First-mover advantage is as strong as for cafés.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Creative and maker retail fits the emerging demographic. Avoid commodity retail. Think studio-retail, artisan craft, independent bookshop.',
      },
      gym: {
        rating: 'Fair',
        reason: 'A functional, community-focused gym at accessible pricing fits the demographic. The market is small — keep overhead low.',
      },
    },
    competitorCount: '3–5 hospitality venues (none quality-positioned)',
    saturationLevel: 'Untapped',
    whatWorking: 'The incoming demographic actively seeks quality independent hospitality. There is no supply for this demand yet.',
    marketGaps: [
      'Quality specialty café (absolute first-mover)',
      'Quality casual restaurant / wine bar',
      'Artisan food retail',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month rent in a suburb with active gentrification and no quality hospitality competition is exceptional first-mover value. Lock in a long lease while rents are low.',
    riskReward: 'Good',
    successConditions: [
      'Accept the 90-day ramp before genuine local support builds',
      'Lock in a long lease (3 years minimum) while rents are pre-gentrification',
      'Quality execution that earns word-of-mouth in the community',
      'Validate that the apartment and office projects near your site are under construction, not just approved',
    ],
    failureRisks: [
      'Operators who need to break even in month two — Mayfield is a 90-day ramp minimum',
      'Failing to lock in a long lease before gentrification rent increases arrive',
      'Overestimating current foot traffic levels',
    ],
    relatedSuburbs: [
      { slug: 'wickham', name: 'Wickham', reason: 'Similar first-mover play with light rail proximity and slightly more advanced gentrification' },
      { slug: 'carrington', name: 'Carrington', reason: 'Heritage gentrification suburb at comparable rents with tourism upside' },
      { slug: 'hamilton', name: 'Hamilton', reason: 'More established strip if you need immediate foot traffic rather than first-mover position' },
    ],
    keyInsight: "Mayfield is a bet on the direction of Newcastle's urban development — and the direction is clear. Industrial suburbs are the consistent next-wave gentrification pattern in Australian cities. The operators who move first at low rent win the suburb for years. The risk is patience, not quality.",
  },

  'wallsend': {
    slug: 'wallsend',
    name: 'Wallsend',
    metaTitle: 'Open a Business in Wallsend, Newcastle | Community Market Analysis 2026',
    metaDescription: 'Wallsend has a loyal community and very low commercial rents. A café at accessible pricing ($4–5 coffee) can build a viable local business. Full community market analysis.',
    heroSubline: 'Mining heritage · working families · community-proud · low rents · loyal local market',
    verdict: 'CAUTION',
    verdictReason: "Wallsend's community is loyal and its rents are very low. However, the median household income ($62,000) and café spending culture are below inner-suburb equivalents. A café that pitches quality at accessible pricing can build a viable local business with a 4–6 month build period. This is a slow-burn market, not a quick-ramp opportunity.",
    revenueRange: '$16,000–$28,000/month',
    rentRange: '$1,200–$2,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Medium',
    demographics: 'Working-class families, retirees, long-term community residents. Strong community pride and local-first shopping habits.',
    medianIncome: '$62,000 household median',
    spendingBehavior: 'Price-sensitive. Coffee at $4–$5 is expected. Food at $12–$16 is the ceiling for regular visits. Community authenticity and value for money are the primary purchase drivers.',
    suburbVibe: 'Mining heritage suburb with tight community bonds. Nelson Street is the commercial spine. Locals support locals.',
    peakZones: ['Nelson Street commercial strip', 'Wallsend train station surrounds', 'Morning and lunchtime peaks'],
    anchorBusinesses: ['Wallsend Hotel', 'Nelson Street strip'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'At $1,500/month rent, a café that does 38 covers/day at $12 average ticket generates $13,680/month revenue — viable on a lean operation. The community loyalty model works if you invest in relationships.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A value-positioned restaurant (BYO, generous portions, family-friendly) can build a loyal local following. Premium dining struggles.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Community convenience retail (specialty food, local services) can work. Destination retail is too far from the traffic to justify.',
      },
      gym: {
        rating: 'Good',
        reason: 'Community gym at accessible pricing ($50–$70/week) for the working-family demographic has genuine demand.',
      },
    },
    competitorCount: '5–8 cafés and takeaways within 1km',
    saturationLevel: 'Low',
    whatWorking: 'Community businesses that invest in local relationships and maintain consistent quality at accessible price points.',
    marketGaps: [
      'Quality café at accessible pricing (none currently)',
      'Healthy takeaway for working families ($12–$15 meals)',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month rent makes the economics work even at lower ticket prices and slower ramp. Plan for a 4–6 month community build period.',
    riskReward: 'Moderate',
    successConditions: [
      'Accessible pricing — $4–$5 coffee, $12–$16 food',
      '4–6 month community build plan with genuine local investment',
      'Community presence: local events, sporting clubs, school networks',
      'Consistency — the community will notice every bad day',
    ],
    failureRisks: [
      'Premium pricing that the demographic rejects',
      'Expecting quick profitability — Wallsend is a slow-burn market',
      'Treating it as a passing foot traffic business rather than a community business',
    ],
    relatedSuburbs: [
      { slug: 'adamstown', name: 'Adamstown', reason: 'Similar working-community suburb with slightly higher income and larger catchment' },
      { slug: 'waratah', name: 'Waratah', reason: 'Hospital-anchored demand creates faster ramp than the community-only model' },
      { slug: 'lambton', name: 'Lambton', reason: 'Quieter but higher-income community suburb at similar rents' },
    ],
    keyInsight: 'Wallsend is for operators who genuinely want to become part of a community rather than extract from it. The business model requires patience and investment in local relationships. Those who make that investment build something that is genuinely hard to displace.',
  },

  'broadmeadow': {
    slug: 'broadmeadow',
    name: 'Broadmeadow',
    metaTitle: 'Open a Business in Broadmeadow, Newcastle | Stadium Precinct Analysis 2026',
    metaDescription: "Broadmeadow's McDonald Jones Stadium (35,000 capacity) generates 15–20 high-revenue event days per year. Between events, foot traffic is thin. A business here must be event-ready. Full analysis.",
    heroSubline: 'Stadium precinct · event-driven revenue · industrial transition · thin weekday trade',
    verdict: 'CAUTION',
    verdictReason: "McDonald Jones Stadium generates 15–20 high-foot-traffic event days per year that can produce single-day revenue equivalent to a slow month. Between events, Broadmeadow has thin weekday foot traffic. A business here needs to be event-day-ready and built on a lean cost structure for the other 340+ days.",
    revenueRange: '$16,000–$30,000/month (averaged across event and non-event)',
    rentRange: '$1,200–$2,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Stadium event visitors (event days), industrial workers, growing apartment and residential base nearby.',
    medianIncome: '$65,000 household median',
    spendingBehavior: 'Event day spend is high and rapid — convenience, volume, speed of service. Non-event day spend is thin and price-sensitive.',
    suburbVibe: 'Industrial precinct in transition. Stadium is the dominant commercial force. Between events, the suburb is quiet.',
    peakZones: ['Parry Street adjacent to McDonald Jones Stadium', 'Event-day crowd corridors', 'Post-event departure routes'],
    anchorBusinesses: ['McDonald Jones Stadium (35,000 capacity)', 'Newcastle Knights, Jets, NSW Blues events'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'A café near the stadium works as an event-day volume play with a lean non-event-day structure. Open extended hours on event days. Keep staff levels minimal on regular days.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'A pub or casual restaurant with a clear event-day activation strategy can generate meaningful revenue on 15–20 days per year. The challenge is the lean economics on the other 340+ days.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Retail without a consistent foot traffic base is structurally difficult. Event-merchandise adjacent retail can work but requires licensing agreements.',
      },
      gym: {
        rating: 'Fair',
        reason: 'Growing apartment population makes a small functional gym viable at low overhead. Not event-dependent.',
      },
    },
    competitorCount: '3–6 venues (minimal quality hospitality)',
    saturationLevel: 'Untapped',
    whatWorking: 'Event-day activation. Businesses that design specifically for the pre- and post-event crowd generate significant single-day revenue.',
    marketGaps: [
      'Pre-event bar and food activation',
      'Event-day fast casual with high-volume menu',
      'Post-event convenient dining',
    ],
    rentJustified: true,
    rentReason: 'Very low rent base makes the event-day revenue model viable. At $1,500/month, even 12 strong event days per year at $4,000–$8,000 revenue each makes the maths work if the non-event cost structure is lean.',
    riskReward: 'Moderate',
    successConditions: [
      'Event-day activation strategy is fully developed before signing any lease',
      'Lean fixed cost structure for non-event periods (minimal staff, simplified menu)',
      'Location on the primary event-day foot traffic corridor (Parry Street)',
      'Establish non-event revenue stream from industrial workers or growing residential base',
    ],
    failureRisks: [
      'Signing a lease without a developed event-day strategy — the stadium is the entire business case',
      'High fixed costs that cannot be sustained on non-event-day volumes',
      'Expecting regular weekday foot traffic that does not currently exist',
    ],
    relatedSuburbs: [
      { slug: 'wickham', name: 'Wickham', reason: 'Urban renewal first-mover with light rail — more consistent daily demand' },
      { slug: 'mayfield', name: 'Mayfield', reason: 'Similar industrial transition suburb with broader daily demand potential' },
      { slug: 'newcastle-cbd', name: 'Newcastle CBD', reason: 'Higher daily foot traffic with event-day upside from the broader CBD precinct' },
    ],
    keyInsight: "Do not sign a lease in Broadmeadow without an event-day activation strategy. The stadium is the business case — without it, the location economics do not work. With it, the combination of low rent and high event-day revenue creates a viable niche business.",
  },

  'wickham': {
    slug: 'wickham',
    name: 'Wickham',
    metaTitle: 'Open a Business in Wickham, Newcastle | Urban Renewal First-Mover 2026',
    metaDescription: "Wickham is Newcastle's most interesting emerging suburb — light rail corridor, urban renewal investment, incoming creative demographic. First-mover advantage at lowest inner-Newcastle rents.",
    heroSubline: 'Urban renewal · light rail corridor · creative demographic · first-mover advantage · lowest inner-Newcastle rents',
    verdict: 'GO',
    verdictReason: "Wickham is a former industrial precinct being converted into apartments, creative studios, and office space along the light rail corridor. First-mover advantage is real: the suburb has virtually no independent hospitality and the incoming demographic actively expects it. A café opening now at $1,500–$2,000/month will be the established incumbent when competition follows.",
    revenueRange: '$18,000–$34,000/month',
    rentRange: '$1,200–$2,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Young creative workers, apartment residents, urban professionals following the light rail corridor. Incoming wave of 25–40 demographic.',
    medianIncome: '$68,000 household median (shifting upward with new residents)',
    spendingBehavior: 'Quality-seeking urban professionals who actively support independent business. Coffee as identity signal. Willing to pay for quality.',
    suburbVibe: 'Industrial-to-urban transition. Raw creative energy. Incoming apartment population and office conversions. The light rail has changed the suburb\'s connectivity.',
    peakZones: ['Hannell Street light rail corridor', 'Industrial-to-apartment conversion zones', 'Wickham light rail stop surrounds'],
    anchorBusinesses: ['Honeysuckle light rail (adjacent)', 'Wickham Interchange'],
    businessFit: {
      cafe: {
        rating: 'Excellent',
        reason: 'The best first-mover café opportunity in inner Newcastle alongside Adamstown. No incumbent. Light rail connectivity brings daily foot traffic from CBD workers. A quality café at $1,500–$2,000/month rent breaks even at 28–35 covers/day — the lowest threshold of any inner Newcastle location.',
      },
      restaurant: {
        rating: 'Good',
        reason: 'A casual quality restaurant (natural wine, small plates, modern Australian) would be the only quality dinner option in the suburb for 2–3 years. First-mover advantage strong.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Creative and artisan retail fits the incoming demographic. Low current foot traffic limits retail viability for destination categories.',
      },
      gym: {
        rating: 'Fair',
        reason: 'A small boutique studio for the apartment population. Keep overhead minimal until residential density increases.',
      },
    },
    competitorCount: '2–4 venues (no quality independent hospitality)',
    saturationLevel: 'Untapped',
    whatWorking: 'Light rail connectivity and apartment pipeline are creating genuine new demand. No supply to meet it yet.',
    marketGaps: [
      'Quality specialty café (absolute first-mover, inner Newcastle)',
      'Quality wine bar and casual dining',
      'Creative workspace with café integration',
    ],
    rentJustified: true,
    rentReason: "Sub-$2,000/month for an inner-Newcastle light rail-connected position with zero quality competition is the best value lease in Newcastle in 2026. Lock in a 3-year lease minimum.",
    riskReward: 'Good',
    successConditions: [
      'Validate that apartment and office projects near your site are under construction (not just approved)',
      'Lock in a 3-year lease while rents are pre-gentrification',
      'Quality execution that earns the incoming community\'s loyalty early',
      'Morning coffee trade from light rail commuters is the initial volume driver',
    ],
    failureRisks: [
      'Development timelines slipping — urban renewal precincts regularly miss projected completion dates',
      'Opening before the apartment population density can support daily trade',
      'Failing to lock in a long lease before gentrification drives rent increases',
    ],
    relatedSuburbs: [
      { slug: 'mayfield', name: 'Mayfield', reason: 'Similar industrial gentrification play without light rail proximity' },
      { slug: 'honeysuckle', name: 'Honeysuckle', reason: 'Adjacent waterfront precinct — more established, higher rent' },
      { slug: 'newcastle-cbd', name: 'Newcastle CBD', reason: 'More established daily foot traffic for operators who need faster ramp' },
    ],
    keyInsight: "Wickham is the single best risk-adjusted first-mover opportunity in inner Newcastle for 2026. The light rail has done the hard infrastructure work. The apartment pipeline is real. The operator who opens a quality café here now at sub-$2,000/month rent will be collecting the reward for 3–4 years before the first competitor arrives.",
  },

  'carrington': {
    slug: 'carrington',
    name: 'Carrington',
    metaTitle: 'Open a Business in Carrington, Newcastle | Heritage Harbour Suburb 2026',
    metaDescription: 'Carrington is the most characterful suburb in Newcastle — heritage harbour community, creative residents, weekend tourism. A boutique café or artisan retail concept with local connection performs best.',
    heroSubline: 'Harbour heritage · boutique · creative community · weekend tourism upside',
    verdict: 'GO',
    verdictReason: "Carrington is Newcastle's most characterful suburb — a heritage-listed harbour community attracting creative workers, artists, and heritage-home owners. Tourism from the heritage precinct adds a weekend visitor component. A specialty café or artisan retail concept with genuine connection to the place performs best.",
    revenueRange: '$16,000–$28,000/month',
    rentRange: '$1,200–$2,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Creative workers, artists, heritage-home owners, young professionals seeking character. Weekend visitors from across Newcastle attracted by the harbour precinct.',
    medianIncome: '$69,000 household median',
    spendingBehavior: 'Quality-seeking, independent-supporting. Will pay for genuine, place-specific experiences. Weekend tourism adds a visitor spend component.',
    suburbVibe: 'Maritime heritage, compact character. The streets feel like a different Newcastle — intimate, place-specific, unhurried.',
    peakZones: ['Young Street heritage strip', 'Carrington waterfront foreshore', 'Weekend morning and afternoon windows'],
    anchorBusinesses: ['Carrington Hotel (historic pub)', 'Heritage precinct walking trail'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'A specialty café with genuine connection to the suburb\'s maritime heritage and creative community. Weekend tourism adds volume. Break-even is achievable at very low rent and 30–40 covers/day on weekdays, 60+ on weekends.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A small, character-driven restaurant (seafood, share plates) fits the suburb\'s identity. Capacity is limited by the small size of the commercial strip. Weekend dinner is the primary opportunity.',
      },
      retail: {
        rating: 'Good',
        reason: 'Artisan and heritage-adjacent retail (ceramics, art, local crafts, maritime goods) performs well with both residents and weekend visitors.',
      },
      gym: {
        rating: 'Poor',
        reason: 'The suburb is too small for a standalone gym. Outdoor and water-based fitness fits the character better.',
      },
    },
    competitorCount: '3–5 venues (character-light)',
    saturationLevel: 'Untapped',
    whatWorking: 'Weekend heritage tourism combined with loyal creative-community residents. Place-specific businesses outperform generic concepts.',
    marketGaps: [
      'Quality specialty café with maritime heritage design',
      'Artisan ceramics or craft studio-retail',
      'Weekend brunch destination with harbour character',
    ],
    rentJustified: true,
    rentReason: 'The lowest commercial rents in inner Newcastle matched with the highest-character environment. A boutique business at $1,500/month rent that becomes the suburb\'s café has excellent unit economics.',
    riskReward: 'Good',
    successConditions: [
      'Deep community investment — Carrington is a village and knows when a business is genuine',
      'Heritage-sensitive fitout that matches the suburb\'s character (not generic cafe aesthetic)',
      'Weekend tourism activation — Carrington is a destination for Newcastle visitors',
      'Lean cost structure — the volume ceiling is lower than inner-city suburbs',
    ],
    failureRisks: [
      'Generic concept without place-specific identity',
      'Building on volume rather than character and margin',
      'Ignoring the small community size — negative word-of-mouth travels fast in a village',
    ],
    relatedSuburbs: [
      { slug: 'wickham', name: 'Wickham', reason: 'Adjacent industrial-gentrification suburb with light rail connectivity and higher volume ceiling' },
      { slug: 'honeysuckle', name: 'Honeysuckle', reason: 'Waterfront precinct with higher established foot traffic at higher rent' },
      { slug: 'mayfield', name: 'Mayfield', reason: 'Similar creative-community emerging suburb with larger residential catchment' },
    ],
    keyInsight: "Carrington is for operators who want to build something genuinely meaningful in a genuinely special place. The revenue ceiling is lower than inner-city suburbs. The quality of the experience and the depth of community connection is higher. Keep costs low, stay authentic, and Carrington will sustain a boutique business for years.",
  },

  'stockton': {
    slug: 'stockton',
    name: 'Stockton',
    metaTitle: 'Open a Business in Stockton, Newcastle | Ferry-Linked Coastal Suburb 2026',
    metaDescription: 'Stockton is accessible only by ferry from Newcastle CBD — creating an unusual tourism dynamic. Weekend visitors come specifically for the beach and quiet character. Full viability analysis.',
    heroSubline: 'Ferry-linked coastal · weekend beach visitors · quiet residential · unusual tourism dynamic',
    verdict: 'CAUTION',
    verdictReason: "Stockton's ferry isolation creates a unique tourism dynamic — the ferry ride is itself a Newcastle experience, and the suburb receives weekend visitors deliberately. A café positioned for the ferry terminus generates viable revenue on weekend-primary model at very low rent. Weekday trade from residents alone is thin.",
    revenueRange: '$14,000–$24,000/month',
    rentRange: '$1,000–$2,200/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Quiet residential community, weekend beach visitors, ferry-trip tourists. Older established residents, some young families attracted by lower property prices.',
    medianIncome: '$60,000 household median',
    spendingBehavior: 'Weekend visitor spend is holiday-mindset (relaxed, generous). Weekday resident spend is modest and price-conscious.',
    suburbVibe: 'Isolated coastal village. The ferry crossing frames the experience. Quiet, unhurried, beach-oriented.',
    peakZones: ['Ferry terminal surrounds', 'Nelson Bay Road main strip', 'Stockton beach access points'],
    anchorBusinesses: ['Stockton Ferry terminal', 'Stockton Beach (4WD beach)'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'A café positioned for the ferry terminal can generate weekend visitor trade on top of resident demand. Weekend foot traffic from beach visitors and ferry-trippers is real. Weekday model must survive on residents alone.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A weekend-only or weekend-primary casual restaurant for beach visitors can work at very low rent. The weekday model is difficult without resident density.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Beach lifestyle retail (surf accessories, local crafts, convenience) works on weekends. Weekday retail is very thin.',
      },
      gym: {
        rating: 'Poor',
        reason: 'Population is too small to sustain a standalone gym without a high membership penetration rate.',
      },
    },
    competitorCount: '2–4 venues (minimal)',
    saturationLevel: 'Untapped',
    whatWorking: 'Weekend ferry tourism is the consistent demand driver. The 4WD beach access is a significant destination draw for NSW-wide visitors in summer.',
    marketGaps: [
      'Quality café at ferry terminal with weekend brunch menu',
      'Beach lifestyle retail with surf/outdoor focus',
    ],
    rentJustified: true,
    rentReason: "Newcastle's lowest commercial rents. At $1,000–$1,500/month, even a weekend-primary model with modest weekday trade generates viable economics on a lean operation.",
    riskReward: 'Moderate',
    successConditions: [
      'Ferry terminal or beach-access positioning — distance from ferry matters',
      'Weekend-primary revenue model with lean weekday cost structure',
      'Summer activation strategy for the beach 4WD crowd',
      'Weekday resilience — can the business survive Monday–Wednesday on local residents alone?',
    ],
    failureRisks: [
      'Building a financial model on peak summer weekend volumes',
      'Cannot sustain Monday–Wednesday on resident trade',
      'Location that requires visitors to walk more than 300m from the ferry',
    ],
    relatedSuburbs: [
      { slug: 'carrington', name: 'Carrington', reason: 'Similar character harbour suburb with more residential density and no ferry isolation' },
      { slug: 'belmont', name: 'Belmont', reason: 'Lake Macquarie suburban convenience market at similar rent levels' },
      { slug: 'wallsend', name: 'Wallsend', reason: 'Community-loyalty market without the seasonal volatility' },
    ],
    keyInsight: "Stockton is viable with the right model — weekend-primary, ferry-proximate, lean on weekdays. It is not viable as a traditional 7-day-uniform-trade café. Operators who design for the ferry-tourism pattern and treat weekdays as break-even rather than primary revenue build a sustainable niche here.",
  },

  'belmont': {
    slug: 'belmont',
    name: 'Belmont',
    metaTitle: 'Open a Business in Belmont, Newcastle | Lake Macquarie Gateway 2026',
    metaDescription: 'Belmont sits on the Lake Macquarie foreshore with consistent local patronage and limited destination appeal. A convenience-model café at accessible pricing works. Full analysis.',
    heroSubline: 'Lake Macquarie gateway · suburban convenience · families · car-dependent · local patronage',
    verdict: 'CAUTION',
    verdictReason: 'Belmont is a suburban convenience market for local residents and lake-foreshore visitors. The commercial strip on Pacific Highway has consistent local patronage. The economics can work at sub-$2,500/month rent with a focused weekday coffee-and-lunch offering. A destination model does not work here.',
    revenueRange: '$18,000–$30,000/month',
    rentRange: '$1,500–$3,200/month',
    rentLevel: 'Low',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Suburban families, retirees, lake-foreshore residents. Car-dependent. Primary catchment 3km.',
    medianIncome: '$70,000 household median',
    spendingBehavior: 'Convenience and value-driven. Will not pay Darby Street prices for a Belmont location. Speed and reliability matter as much as quality.',
    suburbVibe: 'Suburban lake-gateway. Pacific Highway commercial strip is the primary trade zone. Car parking is essential.',
    peakZones: ['Pacific Highway commercial strip', 'Lake Macquarie foreshore access', 'Weekend family morning window'],
    anchorBusinesses: ['Belmont Hotel', 'Lake Macquarie Fair shopping centre'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'A convenience-positioned café ($4.50 coffee, $12–16 food) at $2,000/month rent with adequate parking can generate consistent local patronage. The lake foreshore adds weekend visitor trade. Price competitively — the demographic will not pay inner-suburb premiums.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A family-friendly casual restaurant at accessible pricing can build a loyal local following. Premium dining struggles without a compelling destination draw.',
      },
      retail: {
        rating: 'Good',
        reason: 'Convenience and family retail at accessible price points. Lake-lifestyle retail (fishing, outdoor, water sports accessories) has local relevance.',
      },
      gym: {
        rating: 'Good',
        reason: 'Family-friendly gym or pool at accessible pricing for the suburban family demographic.',
      },
    },
    competitorCount: '8–12 venues within 1km',
    saturationLevel: 'Moderate',
    whatWorking: 'Consistent local patronage for convenience-positioned businesses. Lake foreshore adds weekend leisure trade.',
    marketGaps: [
      'Quality casual café at suburban price points',
      'Healthy takeaway for families ($14–$18 meals)',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,500/month for a Pacific Highway position with consistent local foot traffic is fair value for a convenience-model business.',
    riskReward: 'Moderate',
    successConditions: [
      'Price competitively — this is a convenience market, not a premium destination',
      'Adequate car parking — the suburb is car-dependent',
      'Weekend lake-foreshore activation strategy for leisure visitors',
      'Speed of service — suburban convenience customers value efficiency',
    ],
    failureRisks: [
      'Premium pricing that the demographic rejects',
      'No car parking — car-dependent suburban market will not walk',
      'Destination-model without a compelling reason to drive to Belmont specifically',
    ],
    relatedSuburbs: [
      { slug: 'charlestown', name: 'Charlestown', reason: 'Similar suburban convenience market with higher foot traffic from Charlestown Square' },
      { slug: 'glendale', name: 'Glendale', reason: 'Comparable suburban retail-anchored market with similar consumer profile' },
      { slug: 'adamstown', name: 'Adamstown', reason: 'Lower competition community market with clear first-mover café opportunity' },
    ],
    keyInsight: "Belmont works as a convenience business, not as a destination. The lake foreshore adds genuine weekend trade that differentiates it from pure suburban strips. Operators who price right, park adequately, and serve reliably build a consistent local business here.",
  },

  'glendale': {
    slug: 'glendale',
    name: 'Glendale',
    metaTitle: 'Open a Business in Glendale, Newcastle | Industrial Retail Precinct 2026',
    metaDescription: 'Glendale is home to a major Hunter Region retail park. The opportunity for an independent is trade-day volume adjacent to big-box retail. Full market analysis.',
    heroSubline: 'Big-box retail · trade-day crowd · commuter families · volume-first market',
    verdict: 'CAUTION',
    verdictReason: "Glendale's retail park generates foot traffic but that traffic is primarily oriented around big-box retail and national chains. The independent opportunity is specific: capturing the trade-day crowd with a fast, quality offering adjacent to the retail precinct. A destination concept has limited pull in this environment.",
    revenueRange: '$20,000–$35,000/month',
    rentRange: '$1,500–$3,500/month',
    rentLevel: 'Low',
    competitionLevel: 'Medium',
    footTrafficLevel: 'Medium',
    demographics: 'Commuter families, tradespeople, retail park shoppers. Car-dependent. Volume-oriented shopping behaviour.',
    medianIncome: '$68,000 household median',
    spendingBehavior: 'Value and speed are the primary purchase drivers. Trade workers want fast, filling, affordable. Families want value and familiarity.',
    suburbVibe: 'Industrial retail park precinct. High car traffic, low street life. Trade-oriented.',
    peakZones: ['Adjacent to Bunnings and trade-facing retailers', 'Pacific Highway retail strip', 'Morning trade worker coffee window (6:30–9am)'],
    anchorBusinesses: ['Bunnings Glendale', 'Glendale retail park'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'A quality coffee offering near the Bunnings or trade-facing strip captures tradespeople on their morning stop. Volume is the model — $4.50 coffee done fast, consistently. Not a brunch destination.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'Full-service restaurants struggle without genuine foot traffic beyond the trade-day crowd. Takeaway and fast-casual works; sit-down dinner does not.',
      },
      retail: {
        rating: 'Good',
        reason: 'Specialty retail adjacent to the big-box precinct that fills gaps — specialty trade supplies, outdoor equipment, unique categories not in the retail park.',
      },
      gym: {
        rating: 'Good',
        reason: 'Accessible value gym ($50–$70/week) for the commuter-family demographic. Large format or family-fitness focus.',
      },
    },
    competitorCount: '10–15 venues (chain and fast-casual dominant)',
    saturationLevel: 'Competitive',
    whatWorking: 'Trade-worker coffee trade in the early morning. Volume-based fast-casual lunch.',
    marketGaps: [
      'Quality fast coffee adjacent to trade retailers (6am open, efficient service)',
      'Healthy fast-casual lunch for tradespeople ($12–$16)',
    ],
    rentJustified: true,
    rentReason: 'Low rents make the volume-first model viable. Margin comes from efficiency and throughput, not high average ticket.',
    riskReward: 'Moderate',
    successConditions: [
      'Adjacent to Bunnings or trade-facing retail for the early morning trade crowd',
      'Open from 6–6:30am to capture the first trade shift',
      'Fast, reliable service — tradespeople will not queue',
      'Volume model: price accessible, prioritise throughput over per-cover revenue',
    ],
    failureRisks: [
      'Premium positioning that the trade-demographic rejects',
      'Opening after 7:30am — the trade crowd has moved on',
      'Sit-down restaurant model without a clear dinner trade draw',
    ],
    relatedSuburbs: [
      { slug: 'kotara', name: 'Kotara', reason: 'Similar Westfield-adjacent trade environment with higher foot traffic' },
      { slug: 'belmont', name: 'Belmont', reason: 'Comparable suburban convenience market with lake foreshore leisure upside' },
      { slug: 'wallsend', name: 'Wallsend', reason: 'Community-loyalty market without the trade-dependency' },
    ],
    keyInsight: "Glendale is a volume-efficiency play, not a quality-margin play. The opportunity is defined by the trade worker and big-box retail crowd. Operators who design for speed, accessibility, and early morning trade will find consistent volume. Destination concepts are misaligned with this market.",
  },

  'lambton': {
    slug: 'lambton',
    name: 'Lambton',
    metaTitle: 'Open a Business in Lambton, Newcastle | Quiet Suburban Strip 2026',
    metaDescription: 'Lambton is a quiet suburb with a stable, income-decent residential base and no quality café. A local café here builds 60–80 loyal regulars who visit 4–5 times/week. Low cost, reliable income.',
    heroSubline: 'Quiet suburban · owner-occupier families · underserved local strip · loyal regular trade',
    verdict: 'GO',
    verdictReason: "Lambton's demographic is stable, income-decent ($78,000 median), and underserved for quality café options. Being the best local café here generates a regular customer base of 60–80 people who visit 4–5 times per week. Revenue ceiling is modest but so is the cost floor at sub-$2,500/month rent.",
    revenueRange: '$16,000–$26,000/month',
    rentRange: '$1,400–$2,800/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Owner-occupier families, retirees, established professionals. Stable, long-term community. Age mix 35–65.',
    medianIncome: '$78,000 household median',
    spendingBehavior: 'Regular local patronage driven by habit and relationship. Will pay $5–$5.50 for a good coffee from a venue they trust. Weekly brunch is a family ritual.',
    suburbVibe: 'Quiet, established suburban village. Elder Street strip is small but purposeful. The community supports what it values.',
    peakZones: ['Elder Street commercial strip (core 150m)', 'Saturday morning family window', 'School-day morning commuter'],
    anchorBusinesses: ['Lambton Park', 'Elder Street strip'],
    businessFit: {
      cafe: {
        rating: 'Good',
        reason: 'The community-loyalty café model works well in Lambton. 60–80 loyal regulars at 4–5 visits/week generates 240–400 weekly covers from the loyalty base alone. Break-even at 32 covers/day on $14 average ticket. Very achievable.',
      },
      restaurant: {
        rating: 'Fair',
        reason: 'A quality local restaurant (pizza, pasta, family casual) can build a loyal following. The strip is too small for a destination restaurant. Weekend family dinner is the primary opportunity.',
      },
      retail: {
        rating: 'Fair',
        reason: 'Local convenience and community retail. Specialty food (deli, wine) for the higher-income demographic. Destination retail does not work here.',
      },
      gym: {
        rating: 'Poor',
        reason: 'Population catchment is too small to sustain a standalone gym. A small yoga or pilates studio for the established professional demographic could work at minimal overhead.',
      },
    },
    competitorCount: '3–4 cafés within 800m (no quality incumbent)',
    saturationLevel: 'Untapped',
    whatWorking: 'Community loyalty drives above-average visit frequency for established local businesses. The suburb actively supports quality local options.',
    marketGaps: [
      'Quality café (no quality incumbent)',
      'Specialty local food retail (deli, quality wine)',
    ],
    rentJustified: true,
    rentReason: 'Sub-$2,000/month rent in a $78,000 median income suburb with low competition is excellent value for a loyalty-model café.',
    riskReward: 'Good',
    successConditions: [
      'Community-first marketing — local networks, school groups, sporting clubs',
      'Consistent quality and friendly service (the community will notice every drop)',
      'Saturday morning brunch as the anchor weekly occasion',
      'Long-term lease — community loyalty takes 3–6 months to build, then sustains for years',
    ],
    failureRisks: [
      'Treating Lambton as a foot traffic play — it is a community loyalty play',
      'Inconsistent hours or quality — reliability is the primary value proposition',
      'Attempting premium/trend positioning without establishing community trust first',
    ],
    relatedSuburbs: [
      { slug: 'junction', name: 'The Junction', reason: 'Similar quiet community suburb with slightly higher income and larger passing trade' },
      { slug: 'adamstown', name: 'Adamstown', reason: 'Larger residential catchment with similar first-mover café opportunity' },
      { slug: 'waratah', name: 'Waratah', reason: 'Hospital-anchored demand creates more predictable weekday trade than pure community model' },
    ],
    keyInsight: "Lambton is perfect for an operator who wants a stable, low-cost base with reliable income from a loyal community. The revenue ceiling is real but so is the floor — at sub-$2,000/month rent and 60–80 loyal regulars, this is a genuinely sustainable local business with minimal external pressure.",
  },

  'elermore-vale': {
    slug: 'elermore-vale',
    name: 'Elermore Vale',
    metaTitle: 'Open a Business in Elermore Vale, Newcastle | Low-Density Suburban Analysis 2026',
    metaDescription: "Elermore Vale is a quiet residential suburb with limited commercial activity and no café culture. An operator here would be creating a market rather than serving one. Full risk analysis.",
    heroSubline: 'Low-density residential · no established café culture · market-creation required · lowest rents in Newcastle metro',
    verdict: 'CAUTION',
    verdictReason: 'Elermore Vale is a quiet, low-density residential suburb with limited commercial activity and no established café culture. An operator here would be creating a market rather than serving one. The very low rent makes the economics technically possible, but the absence of passing foot traffic makes discovery very difficult.',
    revenueRange: '$10,000–$18,000/month',
    rentRange: '$1,000–$2,000/month',
    rentLevel: 'Low',
    competitionLevel: 'Low',
    footTrafficLevel: 'Low',
    demographics: 'Young families, first-home buyers, quiet residential community. Limited commercial activity.',
    medianIncome: '$68,000 household median',
    spendingBehavior: 'Residents currently travel to other suburbs for café visits. No established local café habit. Building the habit requires community investment over 6–12 months.',
    suburbVibe: 'Quiet, low-density residential suburb. Very limited commercial strip. Car-oriented.',
    peakZones: ['Limited commercial cluster', 'Weekend morning if positioned near community facilities'],
    anchorBusinesses: ['Limited — no strong commercial anchors'],
    businessFit: {
      cafe: {
        rating: 'Fair',
        reason: 'At $1,200–$1,500/month rent, the economics are technically possible if you can build a loyal local base. The challenge is discovery — residents have no established café habit and are not currently passing a quality café on their daily route.',
      },
      restaurant: {
        rating: 'Poor',
        reason: 'A destination restaurant has no foot traffic base and limited local dining culture. Not viable as a primary market.',
      },
      retail: {
        rating: 'Poor',
        reason: 'Destination retail is structurally not viable. Convenience retail adjacent to residential facilities could work at minimal overhead.',
      },
      gym: {
        rating: 'Fair',
        reason: 'A small community gym at very accessible pricing ($45–$60/week) could build membership from the young family demographic over 12–18 months.',
      },
    },
    competitorCount: '1–3 venues (minimal)',
    saturationLevel: 'Untapped',
    whatWorking: 'The absence of competition means a quality operator would have the entire suburb. But the suburb first needs to develop a café-visiting habit.',
    marketGaps: [
      'Any quality café (no incumbent)',
    ],
    rentJustified: true,
    rentReason: "The lowest rents in the Newcastle metro. Technically viable on a 3-day-per-week model while validating demand. Full 7-day commitment before demand is validated carries significant risk.",
    riskReward: 'Poor',
    successConditions: [
      'Begin with 3-day-per-week operation to validate demand before scaling',
      'Deep community investment — school, local groups, letterbox marketing',
      'Do not expect break-even before month 9–12',
      'Adjacent to a community facility (school, park, sports club) that provides foot traffic',
    ],
    failureRisks: [
      'Full 7-day operation before validating local demand',
      'Insufficient community marketing to overcome the discovery challenge',
      'Expecting the suburb\'s café culture to appear naturally without active building',
    ],
    relatedSuburbs: [
      { slug: 'adamstown', name: 'Adamstown', reason: 'Much stronger café opportunity with established foot traffic and larger catchment' },
      { slug: 'wallsend', name: 'Wallsend', reason: 'Community market with existing commercial strip and more established trade flow' },
      { slug: 'lambton', name: 'Lambton', reason: 'Similar quiet suburb with higher median income and small established commercial strip' },
    ],
    keyInsight: "Elermore Vale is not a first-choice market. The economics at rock-bottom rent are technically possible but the market-creation challenge is real and slow. If committed to this suburb, validate demand with a limited operation before signing a full 7-day lease.",
  },

}

export function getNewcastleSuburb(slug: string): NewcastleSuburb | null {
  return NEWCASTLE_SUBURBS[slug] ?? null
}

export function getAllNewcastleSuburbs(): NewcastleSuburb[] {
  return Object.values(NEWCASTLE_SUBURBS)
}

export const NEWCASTLE_SUBURB_SLUGS = Object.keys(NEWCASTLE_SUBURBS) as Array<keyof typeof NEWCASTLE_SUBURBS>
