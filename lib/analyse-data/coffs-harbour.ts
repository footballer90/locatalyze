/**
 * lib/analyse-data/coffs-harbour.ts
 * Engine-computed suburb data for Coffs Harbour, NSW.
 *
 * Factor semantics (1–10 scale):
 *   demand      → higher = stronger independent-operator demand
 *   rent        → higher = more expensive (worse for operators)
 *   competition → higher = more saturated (worse for new entrants)
 *   seasonality → higher = more revenue volatility (worse)
 *   tourism     → higher = more tourism-driven (helps restaurants/retail)
 *
 * NEVER add score / compositeScore / cafe / restaurant / retail / verdict fields to seeds.
 * All numeric outputs are computed by computeLocationModel() below.
 */

import {
  assertNoManualScores,
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from './scoring-engine'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CoffsHarbourSuburbSeed {
  name: string
  slug: string
  factors: {
    demand: number
    rent: number
    competition: number
    seasonality: number
    tourism: number
  }
  why: string[]
}

export interface CoffsHarbourSuburb extends CoffsHarbourSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: CoffsHarbourSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: CoffsHarbourSuburbSeed[]): CoffsHarbourSuburb[] {
  return seeds.map((s) => {
    assertNoManualScores(s as unknown as Record<string, unknown>, s.name)
    const locationFactors = toLocationFactors(s.factors)
    const m = computeLocationModel(locationFactors)
    return {
      ...s,
      locationFactors,
      cafe: m.cafe,
      restaurant: m.restaurant,
      retail: m.retail,
      compositeScore: m.compositeScore,
      verdict: m.verdict,
    }
  })
}

// ─── Coffs Harbour suburb seeds ───────────────────────────────────────────────

const COFFS_HARBOUR_SEEDS: CoffsHarbourSuburbSeed[] = [
  {
    name: 'Coffs Harbour CBD',
    slug: 'coffs-harbour-cbd',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 4, tourism: 6 },
    why: [
      'Coffs Harbour CBD is the primary retail and hospitality core of the mid-North Coast — the main street concentration of foot traffic, office workers, and transit visitors creates consistent year-round trade that underpins most independent operator business cases in the region.',
      'Tourism is 6/10: the CBD captures visitor spending from the broader Coffs Harbour tourism market, including Big Banana visitors, Muttonbird Island walkers, and regional event attendees who funnel through the city centre before dispersing to coastal and hinterland destinations.',
      'Competition is 6/10: the highest operator density in the Coffs Harbour region, with a mix of national chains and established independents — new entrants need clear differentiation in format, quality, or demographic targeting to displace incumbent operators.',
      'Demand is 7/10: the CBD benefits from office worker lunch trade, government services catchment, and the broader urban population of approximately 75,000 people who access the city centre for commercial and civic activity throughout the week.',
      'Seasonality is 4/10: the CBD has a more balanced year-round demand profile than beachside suburbs due to its non-tourism-dependent resident and office worker base — summer peaks are real but the cliff is less severe than foreshore locations.',
    ],
  },
  {
    name: 'Jetty',
    slug: 'jetty',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 5, tourism: 7 },
    why: [
      'The Jetty precinct is Coffs Harbour\'s premier dining and lifestyle destination — the strip along Harbour Drive adjacent to the marina and Muttonbird Island creates the highest concentration of quality food and beverage operators in the city, with ocean views, tourist flow, and a strong local foodie identity.',
      'Tourism is 7/10: the Jetty benefits directly from marina activity, charter fishing, whale watching departures, and the Muttonbird Island visitor circuit — tourism-driven foot traffic is material and consistent from October through April, with genuine visitor spending at food and beverage venues.',
      'Demand is 7/10: the Jetty serves both the tourist segment and a quality-conscious local demographic — the residential areas surrounding the marina have above-average household income and food culture expectations that sustain quality independent operators year-round.',
      'Competition is 5/10: the Jetty strip has an established hospitality operator base with recognised local brands — new entrants need a genuine differentiation story rather than a generic offer, but the market is not saturated to the point of foreclosing on quality independent concepts.',
      'Seasonality is 5/10: the Jetty\'s summer peak (November to March) is pronounced with domestic holiday visitor volume, and the shoulder months of June to August are softer — operators who have not built sufficient local community trade to sustain the quieter period face cash flow pressure mid-year.',
    ],
  },
  {
    name: 'Park Beach',
    slug: 'park-beach',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 6, tourism: 7 },
    why: [
      'Park Beach is the primary tourism accommodation strip in Coffs Harbour — the concentration of holiday parks, motels, and serviced apartments along Park Beach Road creates a captive visitor market for food, beverage, and convenience retail that is highly pronounced during the December to January peak school holiday period.',
      'Tourism is 7/10: Park Beach generates some of the highest visitor foot traffic volumes in Coffs Harbour during summer, with holiday makers from inland NSW and Queensland creating concentrated demand for breakfast cafes, casual dining, and beach lifestyle retail in the foreshore commercial strip.',
      'Seasonality is 6/10: the highest in the Coffs Harbour suburban dataset — Park Beach operators face a genuine revenue cliff outside the school holiday periods (December to January, April, July, and September), and the off-peak weeks from mid-February to late March and June are materially soft.',
      'Demand is 6/10: within the tourism season, demand is strong; outside it, the local residential base in the Park Beach corridor is sufficient to sustain convenience and essential-service operators but does not support premium or destination hospitality concepts through the quieter periods.',
      'Competition is 5/10: the Park Beach commercial strip has established fast casual, takeaway, and convenience operators — there is room for quality-led concepts that differentiate from the existing tourist-convenience offer, particularly in the breakfast and coffee category.',
    ],
  },
  {
    name: 'Toormina',
    slug: 'toormina',
    factors: { demand: 7, rent: 4, competition: 6, seasonality: 2, tourism: 2 },
    why: [
      'Toormina is anchored by Toormina Gardens Shopping Centre, one of the strongest performing regional shopping centres on the mid-North Coast — the anchor tenant mix of supermarkets and discount department stores generates high baseline foot traffic that makes Toormina the most consistent year-round retail trade location in the Coffs Harbour region.',
      'Demand is 7/10: the shopping centre catchment draws from a wide suburban residential area across multiple Coffs Harbour suburbs, creating high foot traffic volumes that are relatively insensitive to tourism cycles and sustain consistent year-round trade for food court operators, specialty food, and retail tenancies.',
      'Seasonality is 2/10 — the lowest in the dataset: Toormina\'s retail trade is driven by resident shopping patterns rather than tourism, meaning the summer-winter revenue variation is minimal compared to the beachside and CBD precincts.',
      'Competition is 6/10: the shopping centre environment creates direct competition between tenants, and the national chain presence in the food court sets a pricing and quality benchmark that independent operators need to clear to justify discretionary spend from the resident catchment.',
      'Tourism is 2/10: Toormina is a domestic retail precinct with no tourism draw — it is not a destination visitors seek out, which is a structural advantage for operators who want a predictable, seasonality-resistant trade environment.',
    ],
  },
  {
    name: 'Sawtell',
    slug: 'sawtell',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 4, tourism: 5 },
    why: [
      'Sawtell is the boutique village precinct south of Coffs Harbour — a compact main street with a strong independent hospitality culture, higher per-visit spend than the Coffs Harbour average, and a loyal local demographic that actively supports quality independent operators over chain alternatives.',
      'Demand is 6/10: Sawtell\'s resident base is smaller than the CBD or Toormina catchments, but the demographic quality is higher — the lifestyle and sea-change households that have settled in Sawtell and surrounds have above-average incomes and genuine food culture expectations that translate into consistent high per-visit spend.',
      'Competition is 4/10: Sawtell has the right level of operator density — enough to validate the market and create a dining precinct atmosphere, but with genuine space for quality independent concepts in coffee, brunch, and casual evening dining formats.',
      'Tourism is 5/10: Sawtell benefits from day-trip and weekend visitor trade from Coffs Harbour and surrounding areas — the village atmosphere, beach access, and reputation as a quality food destination draws visitors who specifically seek out Sawtell rather than passing through.',
      'Seasonality is 4/10: Sawtell\'s summer tourist overlay creates revenue uplifts during the school holiday and long-weekend periods, but the strong local loyal customer base moderates the off-season softness better than purely tourism-dependent locations in the Coffs Harbour region.',
    ],
  },
  {
    name: 'Woolgoolga',
    slug: 'woolgoolga',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 5, tourism: 5 },
    why: [
      'Woolgoolga is a distinctive coastal village 25km north of Coffs Harbour with a significant Sikh community heritage that has created a unique cultural identity — the Guru Nanak Sikh temple is a genuine tourist attraction, and the town\'s multicultural character creates a distinctive positioning for food and hospitality concepts that lean into the cultural story.',
      'Demand is 5/10: Woolgoolga is a smaller market than Coffs Harbour proper, with a resident population that supports modest hospitality demand — the market scale is honest rather than generous, but the low competition and low rent mean operators can achieve sustainable economics at modest revenue volumes.',
      'Competition is 3/10: genuinely low for the coastal NSW market — the limited operator density reflects the small resident catchment rather than a hidden oversupply, creating real opportunity for a quality independent concept to become the defining local operator without displacing entrenched incumbents.',
      'Tourism is 5/10: Woolgoolga draws heritage tourism through the Sikh cultural precinct, beach tourism from the uncrowded northern beaches, and passing visitor traffic on the Pacific Highway — the tourism overlay is year-round at a modest level rather than concentrated in a single season.',
      'Seasonality is 5/10: coastal tourism creates summer peaks from December to January, with moderate shoulder-season softness — operators who balance the tourist trade with the genuine local loyal customer base navigate the seasonality curve more effectively than those who rely on summer trade alone.',
    ],
  },
  {
    name: 'Moonee Beach',
    slug: 'moonee-beach',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 4, tourism: 3 },
    why: [
      'Moonee Beach is a fast-growing coastal residential corridor north of Coffs Harbour — new residential estates are delivering a growing family and young professional demographic that currently travels to Coffs Harbour CBD or Woolgoolga for quality food and hospitality, creating a genuine first-mover opportunity for correctly positioned operators.',
      'Demand is 5/10 and growing: residential development in the Moonee Beach corridor is ongoing, and the expanding household base creates increasing demand for quality local cafes, casual dining, and convenience retail that does not yet exist in sufficient supply at the local level.',
      'Competition is 2/10: the lowest in the Coffs Harbour dataset — the limited existing supply is a direct reflection of the emerging residential nature of the precinct, not a signal of insufficient demand; the opportunity is genuine but requires patience as the resident base builds to critical mass.',
      'Rent is 3/10: commercial rents in the Moonee Beach growth corridor are at the lower end of the Coffs Harbour spectrum, creating favourable unit economics for operators who enter early and can sustain a growth-phase revenue ramp without excessive occupancy cost pressure.',
      'Seasonality is 4/10: coastal positioning creates some summer uplift from visitors to the uncrowded Moonee Beach, but the dominant demand driver is the growing resident base — operators who build genuine community loyalty will experience the most consistent trade profile.',
    ],
  },
  {
    name: 'Grafton',
    slug: 'grafton',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 3, tourism: 3 },
    why: [
      'Grafton is the Jacaranda City 60km south of Coffs Harbour on the Clarence River — a regional service town of approximately 20,000 people with a strong community identity, low commercial rents, and a genuine but modest independent hospitality market that rewards operators who position as community institutions rather than destination concepts.',
      'Demand is 5/10: Grafton\'s resident population creates consistent demand for quality casual dining and coffee, with the Jacaranda Festival (October) generating a significant tourism spike and the regional service town role ensuring year-round activity from the broader Clarence Valley agricultural catchment.',
      'Tourism is 3/10: Grafton receives the Jacaranda Festival visitor surge in October and some heritage tourism through the historic streetscape, but is not a primary tourism destination — the visitor overlay supplements resident trade rather than defining it.',
      'Competition is 4/10: Grafton has an established but modest hospitality operator base — enough competition to validate the market but genuine room for quality independent concepts that set a higher standard than the existing incumbent offer.',
      'Seasonality is 3/10 — low: Grafton\'s trade is driven primarily by the resident and agricultural catchment rather than coastal tourism seasonality, creating a more stable year-round demand profile than the Coffs Harbour coastal suburbs.',
    ],
  },
]

const _COFFS_HARBOUR_BUILT = buildSuburbs(COFFS_HARBOUR_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getCoffsHarbourSuburbs(): CoffsHarbourSuburb[] {
  return _COFFS_HARBOUR_BUILT
}

export function getCoffsHarbourSuburb(nameOrSlug: string): CoffsHarbourSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _COFFS_HARBOUR_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getCoffsHarbourSuburbSlugs(): string[] {
  return _COFFS_HARBOUR_BUILT.map((s) => s.slug)
}

export function getCoffsHarbourNearbySuburbs(currentSlug: string, limit = 3): CoffsHarbourSuburb[] {
  const sorted = [..._COFFS_HARBOUR_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
