/**
 * lib/compute/benchmarks.ts
 *
 * Single source of truth for all Australian industry benchmarks and
 * competitor keyword filters.
 *
 * RULES:
 * - Never import this file from a UI component — only computeEngine() uses it
 * - Update BENCHMARK_VERSION in types/computed.ts when any value changes
 * - All monetary values in AUD/month
 */

// ── Business type benchmark ───────────────────────────────────────────────────

export interface BizBenchmark {
  /** Typical customers per day at median competition level */
  dailyCustomersBase: number
  dailyCustomersLow:  number
  dailyCustomersHigh: number

  /** Average revenue per customer transaction (AUD) */
  avgTicketSize: number

  /** Gross margin after COGS, as a percentage (0–100) */
  grossMarginPct: number

  /** Typical all-in staff costs AUD/month (inc. super, casual loading) */
  staffCosts: number

  /** Other opex (insurance, utilities, marketing, supplies) as fraction of revenue */
  otherCostsPct: number

  /** Competitor search radius in metres for this business type */
  competitorRadiusM: number

  /**
   * Saturation ceiling: weighted competitor count at which the market
   * is considered fully saturated (demand signal hits zero).
   * Used to normalise density into a 0–100 demand signal.
   *   gym:        10  (rare; > 10 gyms in 1.5km = oversaturated)
   *   cafe:       20  (high street cafes are dense; > 20 = very saturated)
   *   restaurant: 25
   *   other:      15
   */
  maxCompetitorsInRadius: number

  /** Revenue channel labels in order of typical share */
  revenueChannelLabels: string[]
}

export const BIZ_BENCHMARKS: Record<string, BizBenchmark> = {
  cafe: {
    dailyCustomersBase: 120, dailyCustomersLow: 80,  dailyCustomersHigh: 180,
    avgTicketSize: 18, grossMarginPct: 65, staffCosts: 18000, otherCostsPct: 0.12,
    competitorRadiusM: 600, maxCompetitorsInRadius: 20,
    revenueChannelLabels: ['Coffee & Beverages', 'Food & Brunch', 'Catering & Events'],
  },
  restaurant: {
    dailyCustomersBase: 80, dailyCustomersLow: 50, dailyCustomersHigh: 130,
    avgTicketSize: 55, grossMarginPct: 68, staffCosts: 35000, otherCostsPct: 0.15,
    competitorRadiusM: 600, maxCompetitorsInRadius: 25,
    revenueChannelLabels: ['Dine-in', 'Delivery & Takeaway', 'Private Functions'],
  },
  bakery: {
    dailyCustomersBase: 100, dailyCustomersLow: 60, dailyCustomersHigh: 160,
    avgTicketSize: 22, grossMarginPct: 62, staffCosts: 15000, otherCostsPct: 0.10,
    competitorRadiusM: 600, maxCompetitorsInRadius: 12,
    revenueChannelLabels: ['Bread & Pastries', 'Café / Beverages', 'Wholesale'],
  },
  gym: {
    dailyCustomersBase: 80, dailyCustomersLow: 40, dailyCustomersHigh: 140,
    avgTicketSize: 65, grossMarginPct: 80, staffCosts: 22000, otherCostsPct: 0.08,
    competitorRadiusM: 1500, maxCompetitorsInRadius: 10,
    revenueChannelLabels: ['Memberships', 'Personal Training', 'Classes & Programs'],
  },
  fitness: {
    dailyCustomersBase: 80, dailyCustomersLow: 40, dailyCustomersHigh: 140,
    avgTicketSize: 65, grossMarginPct: 80, staffCosts: 22000, otherCostsPct: 0.08,
    competitorRadiusM: 1500, maxCompetitorsInRadius: 10,
    revenueChannelLabels: ['Memberships', 'Personal Training', 'Classes & Programs'],
  },
  salon: {
    dailyCustomersBase: 18, dailyCustomersLow: 10, dailyCustomersHigh: 28,
    avgTicketSize: 90, grossMarginPct: 70, staffCosts: 18000, otherCostsPct: 0.10,
    competitorRadiusM: 600, maxCompetitorsInRadius: 15,
    revenueChannelLabels: ['Hair Services', 'Colour & Treatments', 'Retail Products'],
  },
  retail: {
    dailyCustomersBase: 40, dailyCustomersLow: 20, dailyCustomersHigh: 70,
    avgTicketSize: 75, grossMarginPct: 55, staffCosts: 16000, otherCostsPct: 0.12,
    competitorRadiusM: 500, maxCompetitorsInRadius: 18,
    revenueChannelLabels: ['In-store Sales', 'Online / Click & Collect', 'Wholesale'],
  },
  bar: {
    dailyCustomersBase: 80, dailyCustomersLow: 40, dailyCustomersHigh: 140,
    avgTicketSize: 35, grossMarginPct: 72, staffCosts: 25000, otherCostsPct: 0.10,
    competitorRadiusM: 600, maxCompetitorsInRadius: 18,
    revenueChannelLabels: ['Drinks & Bar Sales', 'Food & Snacks', 'Functions & Events'],
  },
  takeaway: {
    dailyCustomersBase: 140, dailyCustomersLow: 80, dailyCustomersHigh: 220,
    avgTicketSize: 20, grossMarginPct: 60, staffCosts: 14000, otherCostsPct: 0.08,
    competitorRadiusM: 500, maxCompetitorsInRadius: 22,
    revenueChannelLabels: ['Walk-in Orders', 'Delivery Platforms', 'Catering'],
  },
  pharmacy: {
    dailyCustomersBase: 70, dailyCustomersLow: 40, dailyCustomersHigh: 110,
    avgTicketSize: 55, grossMarginPct: 35, staffCosts: 20000, otherCostsPct: 0.08,
    competitorRadiusM: 800, maxCompetitorsInRadius: 8,
    revenueChannelLabels: ['Prescription', 'OTC Products', 'Health & Beauty'],
  },
  other: {
    dailyCustomersBase: 60, dailyCustomersLow: 30, dailyCustomersHigh: 100,
    avgTicketSize: 50, grossMarginPct: 60, staffCosts: 18000, otherCostsPct: 0.10,
    competitorRadiusM: 600, maxCompetitorsInRadius: 15,
    revenueChannelLabels: ['Primary Revenue', 'Secondary Revenue', 'Other'],
  },
}

/**
 * Resolve a free-text business type to a BIZ_BENCHMARKS key.
 * Returns 'other' if no match found.
 */
export function resolveBizKey(businessType: string): string {
  const bt = (businessType ?? '').toLowerCase().replace(/[\s\/&-]+/g, ' ').trim()
  const keys = Object.keys(BIZ_BENCHMARKS)
  return keys.find(k => bt.includes(k)) ?? 'other'
}

// ── Google Places API types per business type ─────────────────────────────────
//
// Google's place type taxonomy is inconsistent — real gyms appear under
// multiple types depending on how the operator registered their listing.
// We track all plausible types here so A1 can run multiple queries.

export const GOOGLE_PLACES_TYPES: Record<string, string[]> = {
  gym:        ['gym', 'health', 'spa', 'stadium'],
  fitness:    ['gym', 'health', 'spa', 'stadium'],
  cafe:       ['cafe', 'bakery', 'restaurant', 'food'],
  restaurant: ['restaurant', 'meal_takeaway', 'meal_delivery', 'food'],
  bakery:     ['bakery', 'cafe', 'food'],
  bar:        ['bar', 'night_club', 'liquor_store'],
  salon:      ['beauty_salon', 'hair_care', 'spa'],
  retail:     ['clothing_store', 'shoe_store', 'department_store', 'store', 'shopping_mall'],
  takeaway:   ['meal_takeaway', 'restaurant', 'food'],
  pharmacy:   ['pharmacy', 'drugstore', 'health'],
  other:      ['establishment'],
}

/**
 * Returns the search keyword string to use in Google Places textSearch or
 * NearbySearch `keyword` parameter for a given business type.
 * Using keyword is broader than type= and catches more listings.
 */
export function getGoogleSearchKeywords(bizKey: string): string[] {
  const MAP: Record<string, string[]> = {
    gym:        ['gym', 'fitness centre', 'health club', 'yoga studio',
                 'pilates studio', 'crossfit', 'boxing gym', 'martial arts'],
    fitness:    ['gym', 'fitness centre', 'health club', 'yoga studio',
                 'pilates studio', 'crossfit', 'boxing gym'],
    cafe:       ['cafe', 'coffee shop', 'espresso bar', 'brunch cafe'],
    restaurant: ['restaurant', 'bistro', 'dining'],
    bakery:     ['bakery', 'patisserie', 'bread shop'],
    bar:        ['bar', 'pub', 'tavern', 'brewery'],
    salon:      ['hair salon', 'barber', 'beauty salon'],
    retail:     ['clothing store', 'boutique', 'retail shop'],
    takeaway:   ['takeaway', 'fast food', 'fish and chips'],
    pharmacy:   ['pharmacy', 'chemist'],
    other:      [],
  }
  return MAP[bizKey] ?? []
}

// ── Competitor keyword filters ────────────────────────────────────────────────

export const VALID_COMPETITOR_KEYWORDS: Record<string, string[]> = {
  cafe: [
    'cafe', 'coffee', 'espresso', 'brunch', 'bakery', 'patisserie',
    'tea room', 'brasserie', 'roastery', 'barista', 'latte', 'cappuccino',
  ],
  restaurant: [
    'restaurant', 'dining', 'eatery', 'bistro', 'trattoria', 'brasserie',
    'grill', 'kitchen', 'diner', 'cuisine', 'chophouse',
  ],
  bakery: [
    'bakery', 'patisserie', 'pastry', 'cake', 'bread', 'boulangerie',
    'sourdough', 'artisan bread', 'croissant',
  ],
  gym: [
    // Generic activity terms
    'gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'boxing',
    'martial arts', 'health club', 'sport', 'athletic', 'training',
    'bootcamp', 'boot camp', 'strength', 'conditioning', 'wellbeing',
    'wellness', 'recreation', 'leisure centre', 'aquatic centre',
    'studio', 'functional', 'hiit', 'barre', 'spin', 'cycling',
    'reformer', 'dance',
    // Australian & international franchise brands
    'f45', 'orangetheory', 'anytime fitness', 'snap fitness',
    'goodlife', 'plus fitness', 'jetts', 'genesis', 'planet fitness',
    'fitness first', 'fernwood', 'curves', 'kx pilates', 'body fit',
    'the base', 'viva leisure', '24/7 fitness', 'crunch fitness',
    "gold's gym", 'la fitness', 'virgin active', 'fitstop',
    'bare', 'bodypump', 'lesmills', 'les mills', 'athletic evolution',
    'club lime', 'ryze', 'hit', 'kokoda', 'ufc gym', 'ufc',
    'movement', 'perform', 'push', 'elevate', 'rise', 'forge',
    'iron', 'peak', 'apex', 'alpha', 'titan', 'evolve',
  ],
  fitness: [  // alias for gym — kept in sync
    'gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'boxing',
    'martial arts', 'health club', 'sport', 'athletic', 'training',
    'bootcamp', 'studio', 'hiit', 'barre', 'spin', 'cycling',
    'reformer', 'f45', 'orangetheory', 'anytime fitness', 'snap fitness',
    'goodlife', 'plus fitness', 'jetts', 'genesis', 'fitness first',
    'fernwood', 'kx pilates', 'body fit', 'fitstop', 'club lime',
    "gold's gym", 'functional', 'strength', 'conditioning',
  ],
  salon: [
    'salon', 'hair', 'barber', 'barbershop', 'beauty', 'spa',
    'nail', 'grooming', 'aesthetics', 'wax', 'blow dry', 'colourist',
  ],
  retail: [
    'shop', 'store', 'boutique', 'retail', 'clothing', 'fashion',
    'apparel', 'merchandise', 'gift', 'market', 'outlet',
  ],
  bar: [
    'bar', 'pub', 'tavern', 'hotel', 'brewery', 'wine bar',
    'cocktail', 'nightclub', 'lounge', 'bottle shop', 'craft beer',
    'taproom', 'alehouse',
  ],
  takeaway: [
    'takeaway', 'take-away', 'fast food', 'takeout', 'burger', 'pizza',
    'fish chips', 'kebab', 'chinese', 'thai', 'indian', 'sushi', 'noodle',
    'fried chicken', 'mcdonald', 'subway', 'kfc', 'hungry jack', "grill'd",
    'domino', 'red rooster', 'oporto', 'zambreros',
  ],
  pharmacy: [
    'pharmacy', 'chemist', 'drug store', 'dispensary', 'apothecary',
    'priceline', 'chemist warehouse', 'amcal', 'terry white',
  ],
  other: [],
}

export const EXCLUDED_POI_KEYWORDS = [
  'park', 'reserve', 'toilet', 'public toilet', 'restroom',
  'playground', 'memorial', 'monument', 'statue', 'sculpture',
  'artwork', 'landmark', 'library', 'council office', 'post office',
  'post box', 'church', 'mosque', 'temple', 'synagogue', 'chapel',
  'cathedral', 'kindergarten', 'preschool', 'primary school',
  'high school', 'university', 'tafe', 'college',
  'hospital', 'fire station', 'police station', 'court house',
  'parking', 'car park', 'garage', 'service station', 'petrol station',
  'atm', 'bus stop', 'tram stop', 'train station',
  'viewpoint', 'lookout', 'residential building', 'apartment complex',
]

/**
 * Returns true if the POI is a valid competitor for the given business type.
 *
 * Matching strategy (in priority order):
 *  1. Explicitly tagged 'direct' by A1 → always include
 *  2. Exclude non-business POIs (parks, schools, etc.)
 *  3. Google API type array match (gym, health, spa, etc.)
 *  4. Keyword match on name + type + category fields
 *
 * Designed to have LOW false-negative rate — we prefer to include a borderline
 * competitor over silently excluding it.
 */
export function isValidCompetitor(poi: Record<string, any>, bizKey: string): boolean {
  const name     = String(poi.name     ?? poi.business_name ?? '').toLowerCase()
  const type     = String(poi.type     ?? poi.competitor_type ?? poi.place_type ?? '').toLowerCase()
  const category = String(poi.category ?? poi.place_category ?? '').toLowerCase()
  const combined = `${name} ${type} ${category}`

  // Step 1: Explicitly tagged 'direct' by A1 → trust it immediately
  if (type === 'direct') return true

  // Step 2: Exclude non-business POIs (hard exclusion list)
  if (EXCLUDED_POI_KEYWORDS.some(kw => combined.includes(kw))) return false

  // Step 3: Google Places API type array (e.g. ["gym", "health", "establishment"])
  // A1 may pass this under `google_types`, `place_types`, or `types`
  const googleTypes: string[] = [
    ...(Array.isArray(poi.google_types) ? poi.google_types : []),
    ...(Array.isArray(poi.place_types)  ? poi.place_types  : []),
    ...(Array.isArray(poi.types)        ? poi.types        : []),
  ].map(t => String(t).toLowerCase())

  const validApiTypes = GOOGLE_PLACES_TYPES[bizKey] ?? []
  if (googleTypes.length > 0 && validApiTypes.some(t => googleTypes.includes(t))) {
    return true
  }

  // Step 4: Keyword match against this business type's keyword list
  const keywords = VALID_COMPETITOR_KEYWORDS[bizKey] ?? VALID_COMPETITOR_KEYWORDS['other'] ?? []
  return keywords.some(kw => combined.includes(kw))
}
