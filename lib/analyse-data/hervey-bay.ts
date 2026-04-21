/**
 * lib/analyse-data/hervey-bay.ts
 * Engine-computed suburb data for Hervey Bay, QLD.
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

export interface HerveyBaySuburbSeed {
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

export interface HerveyBaySuburb extends HerveyBaySuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: HerveyBaySuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: HerveyBaySuburbSeed[]): HerveyBaySuburb[] {
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

// ─── Hervey Bay suburb seeds ──────────────────────────────────────────────────

const HERVEY_BAY_SEEDS: HerveyBaySuburbSeed[] = [
  {
    name: 'Torquay',
    slug: 'torquay',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 4, tourism: 6 },
    why: [
      'Torquay\'s Esplanade strip is the primary ocean-facing dining destination in Hervey Bay — restaurants and cafes with bay views command premium pricing and attract both local residents and visitors who specifically seek the waterfront experience.',
      'Tourism is 6/10: the whale-watching season (July to October) creates significant foot traffic uplift as tour operators, whale-watching passengers, and supporting visitor spend concentrate along the Torquay foreshore.',
      'Seasonality is 4/10: the November to June period sees a material softening of tourist trade — operators who have not built strong local community loyalty face cash flow pressure during the off-peak months.',
      'Competition is 5/10: the Esplanade strip has enough established operators to validate the market, but the tourism-and-lifestyle positioning means genuinely differentiated concepts find loyal customers from both resident and visitor segments.',
      'Rent is 3/10 — competitive for an ocean-facing commercial position, with the premium of waterfront visibility not yet fully priced into Hervey Bay\'s commercial rents.',
    ],
  },
  {
    name: 'Urangan',
    slug: 'urangan',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 4, tourism: 7 },
    why: [
      'Urangan Marina is the departure point for all whale-watching tours and Fraser Island ferry services — the highest concentration of tourism spending in Hervey Bay, with visitor foot traffic directly adjacent to the marina precinct during the season.',
      'Tourism is 7/10: the whale-watching season (July to October) is the most concentrated tourism demand in the Fraser Coast region, with tour passengers spending on pre- and post-tour food and beverage in Urangan before and after departures.',
      'Seasonality is 4/10: outside the July to October peak, marina activity drops significantly — operators who are entirely tourism-dependent face genuinely lean months from November to June when local residential trade must sustain the business.',
      'Competition is 4/10: the marina precinct has hospitality supply, but demand during peak season consistently exceeds what existing operators can capture — there is genuine room for well-positioned food and beverage concepts.',
      'Rent is 3/10 — marina commercial positions are priced for the regional market rather than the tourism premium that comparable Gold Coast or Airlie Beach marinas command.',
    ],
  },
  {
    name: 'Pialba',
    slug: 'pialba',
    factors: { demand: 6, rent: 3, competition: 6, seasonality: 4, tourism: 5 },
    why: [
      'Pialba is the main retail and commercial hub of Hervey Bay — Central shopping centre anchors the precinct and generates the highest retail foot traffic volumes in the city, making it the primary trade location for essential-service and convenience-focused operators.',
      'Competition is 6/10: the highest density in Hervey Bay, concentrated around the Central shopping precinct and the main commercial strip — independent operators need clear differentiation to compete with established chains and incumbents.',
      'Tourism is 5/10: Pialba\'s commercial hub positioning captures transit visitor spending — travellers arriving in Hervey Bay pass through the main retail precinct before dispersing to accommodation and tourist attractions.',
      'Rent is 3/10 for surrounding commercial strips, though Central shopping centre tenancies carry higher occupancy costs that need careful modelling against the foot traffic benefit.',
      'Seasonality is 4/10: tourism-driven trade creates variation, but the commercial hub positioning and the strong local resident catchment provide more year-round baseline trade than purely tourism-dependent locations.',
    ],
  },
  {
    name: 'Scarness',
    slug: 'scarness',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 4, tourism: 5 },
    why: [
      'Scarness sits on the central Esplanade between Torquay and Pialba — a lifestyle dining and coffee location that captures both the beach visitor market and the local professional residential demographic.',
      'Tourism is 5/10: the central Esplanade position captures visitor foot traffic without the full tourism dependency of Urangan Marina — the visitor trade supplements rather than dominates the local customer base.',
      'Competition is 4/10: fewer operators than Pialba or Torquay, with genuine space for quality independent concepts that serve the lifestyle market — coffee, casual dining, and beach-lifestyle retail perform well here.',
      'The sea-change and retirement demographic that has settled in the Esplanade corridor has a higher per-visit spend than the Hervey Bay average — retirees with time to linger and money to spend are a valuable customer segment.',
      'Seasonality is 4/10: the central Esplanade position and the stable residential base moderate the seasonal revenue cliff compared to purely tourism-dependent locations in Urangan or Torquay.',
    ],
  },
  {
    name: 'Eli Waters',
    slug: 'eli-waters',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Eli Waters is a southern new residential estate with a growing family demographic — purpose-built residential development has created a local community that currently travels to Pialba or Torquay for food and hospitality services.',
      'Competition is 3/10: genuinely low, reflecting the underserved nature of a new estate rather than a market without demand — first-mover operators who establish convenience-focused concepts capture the residential catchment before supply catches up.',
      'Rent is 3/10: new development commercial tenancies are priced competitively to attract operators into the emerging precinct, with lease terms that recognise the early-stage market.',
      'The family demographic creates strong demand for child-friendly, convenience-oriented hospitality — cafes with outdoor space, casual dining, and takeaway food concepts align well with the resident lifestyle.',
      'Low seasonality (2/10) and low tourism (2/10) create a pure residential trade environment — consistent, predictable, and entirely dependent on building genuine local community loyalty.',
    ],
  },
  {
    name: 'Kawungan',
    slug: 'kawungan',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Kawungan is the western residential corridor of Hervey Bay — an established suburb with a stable community and modest hospitality demand, serving a catchment that values convenience and familiarity over destination dining.',
      'Competition is 3/10: low operator density reflects the genuine scale of the western residential market rather than a hidden opportunity — operators should model conservative revenue projections.',
      'Rent is 2/10: the lowest in the Hervey Bay coastal belt, making break-even achievable at modest revenue volumes and reducing the financial risk for operators entering a lower-volume market.',
      'The western residential demographic is less exposed to tourism cycles than the Esplanade suburbs — trade is stable year-round but at a lower volume ceiling than beachside or commercial hub locations.',
      'Low seasonality (2/10) and low tourism (2/10) create a predictable trade environment suitable for operators who prioritise consistent, reliable income over high-peak seasonal revenue.',
    ],
  },
  {
    name: 'Howard',
    slug: 'howard',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      'Howard is an inland satellite town 40km south of Hervey Bay proper — an agricultural service community with a small resident population and hospitality demand that is limited by market scale rather than concept quality.',
      'Competition is 2/10: very low operator density reflects the genuine demand constraints of a small rural town — the low competition is accurate, but the ceiling on revenue is also genuinely low.',
      'Rent is 2/10: the lowest in the broader Hervey Bay region, making the economics viable for essential-service and community-oriented concepts that correctly calibrate to the catchment\'s spending capacity.',
      'The agricultural and rural community demographic values reliability, value for money, and local community connection — operators who embed themselves in the community build durable trade that sustains through regional economic cycles.',
      'Howard is honest about its limitations: it is a small market that rewards specialists and community-focused operators, not a hidden gem for growth-focused independent hospitality concepts.',
    ],
  },
]

const _HERVEY_BAY_BUILT = buildSuburbs(HERVEY_BAY_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getHerveyBaySuburbs(): HerveyBaySuburb[] {
  return _HERVEY_BAY_BUILT
}

export function getHerveyBaySuburb(nameOrSlug: string): HerveyBaySuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _HERVEY_BAY_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getHerveyBaySuburbSlugs(): string[] {
  return _HERVEY_BAY_BUILT.map((s) => s.slug)
}

export function getHerveyBayNearbySuburbs(currentSlug: string, limit = 3): HerveyBaySuburb[] {
  const sorted = [..._HERVEY_BAY_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
