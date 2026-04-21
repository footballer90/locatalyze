/**
 * lib/analyse-data/bunbury.ts
 * Engine-computed suburb data for Bunbury, WA.
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

export interface BunburySuburbSeed {
  name: string
  slug: string
  state: string
  factors: {
    demand: number
    rent: number
    competition: number
    seasonality: number
    tourism: number
  }
  why: string[]
}

export interface BunburySuburb extends BunburySuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: BunburySuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: BunburySuburbSeed[]): BunburySuburb[] {
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

// ─── Bunbury suburb seeds ─────────────────────────────────────────────────────

const BUNBURY_SEEDS: BunburySuburbSeed[] = [
  {
    name: 'Bunbury CBD',
    slug: 'bunbury-cbd',
    state: 'WA',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 3, tourism: 5 },
    why: [
      'Victoria Street is the primary commercial spine of WA\'s third-largest city — a compact city centre with genuine pedestrian trade, government office workers, and a growing hospitality precinct that has been drawing investment from operators who recognise Bunbury\'s position as the regional hub for a 100,000-person catchment.',
      'Competition is 6/10: a meaningful concentration of established cafes, restaurants, and retail on Victoria Street and the central lanes — operators need genuine differentiation, but the city centre positioning and government worker daytime trade justify the higher competitive density.',
      'Tourism is 5/10: Bunbury is the gateway city for the South West tourism region — visitors travelling to Margaret River, Dunsborough, and the Capes region pass through or overnight in Bunbury, creating a consistent tourism overlay on top of the substantial local trade.',
      'Seasonality is 3/10: the government and commercial office catchment creates strong year-round weekday trade that moderates the seasonal variation affecting purely tourist-dependent regional centres — Bunbury CBD is less seasonal than most WA regional city centres of comparable size.',
      'Rent is 5/10 — WA\'s third city commands commercial rents above the broader South West region but well below Perth, representing reasonable value for a city centre position with the highest foot traffic density in the region.',
    ],
  },
  {
    name: 'Withers',
    slug: 'withers',
    state: 'WA',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Withers is an established working-class residential suburb in Bunbury\'s northern corridor — a community with genuine essential-service demand that is underserved by quality affordable food options, creating an opportunity for value-focused operators who serve the local catchment correctly.',
      'Competition is 3/10: low operator density in a suburb where the existing hospitality options are limited — there is real demand from the resident population for reliable, affordable food and café trade, and the competitive environment does not punish first-movers who position correctly.',
      'Seasonality is 2/10: the working residential character creates highly consistent year-round demand driven by the local community\'s everyday needs rather than discretionary tourism or seasonal visitor spend.',
      'The demographic in Withers responds strongly to value-for-money positioning, reliability, and genuine community presence — operators who become the local institution build durable trade from residents who prioritise convenience and price over premium concepts.',
      'Rent is 2/10 — the lowest commercial rents in the Bunbury catchment, making break-even achievable at modest volume levels and reducing the financial risk for operators who correctly calibrate to the market\'s spending capacity.',
    ],
  },
  {
    name: 'College Grove',
    slug: 'college-grove',
    state: 'WA',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      'College Grove is a newer residential suburb in Bunbury\'s eastern corridor anchored by Bunbury Catholic College — the school catchment and surrounding family residential community generate consistent morning café trade, after-school food demand, and weekend family hospitality needs that are not currently met by local operators.',
      'Competition is 2/10: very low — the suburb\'s commercial development has lagged behind its residential growth, and residents currently travel to Eaton or Bunbury CBD for quality food and café options, representing a genuine first-mover opportunity.',
      'Seasonality is 2/10: the school-year rhythm creates a predictable trade cycle, and the residential community provides year-round baseline demand that is not materially affected by tourism or seasonal variation.',
      'The school community catchment is a reliable morning and afternoon trade driver — before-school coffee and breakfast trade, after-school casual food, and weekend family café visits are the primary revenue opportunities for well-positioned operators.',
      'Rent is 3/10 — newer suburban commercial tenancies in the College Grove precinct are priced competitively to attract operators into the developing market, with lease structures that recognise the early-stage commercial environment.',
    ],
  },
  {
    name: 'Eaton',
    slug: 'eaton',
    state: 'WA',
    factors: { demand: 7, rent: 4, competition: 6, seasonality: 2, tourism: 1 },
    why: [
      'Eaton Fair shopping centre is the dominant suburban retail anchor in the greater Bunbury catchment — a regional shopping centre that generates the highest suburban retail foot traffic volumes in WA\'s South West, serving a large residential catchment from multiple surrounding suburbs.',
      'Competition is 6/10: Eaton Fair and the surrounding commercial precinct have high operator density with established national chains and strong local independents — new entrants need genuine differentiation to compete effectively, but the foot traffic volume justifies quality operators entering the market.',
      'Demand is 7/10: the combination of Eaton Fair\'s regional draw, the large surrounding residential catchment, and the absence of competing regional shopping centres within a 20km radius creates consistently high foot traffic that sustains a broad range of food, retail, and service businesses.',
      'Seasonality is 2/10: suburban shopping centre trade is highly consistent year-round with the seasonal variation affecting Bunbury CBD and coastal locations largely absent — the retail anchor positioning creates reliable 52-week foot traffic.',
      'Rent is 4/10 — Eaton Fair tenancy costs reflect the higher-than-average foot traffic, but the surrounding Eaton commercial strip offers more affordable positions that still benefit from the shopping centre\'s traffic-generating effect.',
    ],
  },
  {
    name: 'Carey Park',
    slug: 'carey-park',
    state: 'WA',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Carey Park is an established residential suburb in Bunbury\'s southern corridor with a stable community demographic that generates modest but consistent hospitality demand — the suburb sits between Bunbury CBD and the southern residential expansion without a strong commercial hub of its own.',
      'Competition is 3/10: limited operator density relative to the residential catchment — Carey Park residents travel to Bunbury CBD or Eaton for the majority of their hospitality spending, with local options limited to essential-service and convenience formats.',
      'Seasonality is 2/10: the established residential character creates predictable year-round trade that is not materially affected by tourism or seasonal variation — consistent demand from a stable community.',
      'The demographic in Carey Park values convenience and local presence — breakfast café, takeaway, and casual lunch formats that fit the working resident lifestyle create more durable trade than destination dining concepts that require residents to seek out the location.',
      'Rent is 2/10 — affordable commercial rates in an established residential suburb, making entry achievable for operators with modest revenue projections and a clear community-focused positioning.',
    ],
  },
  {
    name: 'South Bunbury',
    slug: 'south-bunbury',
    state: 'WA',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 3, tourism: 4 },
    why: [
      'South Bunbury\'s inner residential neighbourhood sits adjacent to the Bunbury Foreshore and Back Beach — a café opportunity driven by the coastal lifestyle demographic of owner-occupiers and sea-change residents who value proximity to the ocean and have above-average household incomes relative to outer Bunbury suburbs.',
      'Tourism is 4/10: the Bunbury Foreshore is the primary recreational focus for Bunbury visitors — dolphin tours, beach access, and the waterfront walking path generate visitor foot traffic that supplements the local residential trade particularly during summer months.',
      'Competition is 4/10: the inner residential positioning has some established operators near the foreshore, but there is genuine space for quality independent café concepts that serve the lifestyle demographic rather than the mass market.',
      'Seasonality is 3/10: the coastal and foreshore-adjacent position creates a modest summer uplift from visitor and recreational activity, while the permanent residential base provides consistent year-round baseline trade.',
      'Rent is 3/10 — inner residential commercial positions are priced below the CBD and Eaton, allowing operators to access the lifestyle demographic without the rent pressure of the city\'s highest-foot-traffic precincts.',
    ],
  },
  {
    name: 'Australind',
    slug: 'australind',
    state: 'WA',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Australind is one of the fastest-growing residential corridors in WA\'s South West — a rapidly expanding family residential community 10km north of Bunbury CBD whose population growth has outpaced commercial hospitality supply, creating a genuine first-mover opportunity for operators targeting the underserved local catchment.',
      'Competition is 3/10: significantly underserved relative to population — Australind residents currently travel to Bunbury CBD or Eaton for quality hospitality, and the demand volume to support well-positioned local operators already exists and continues to grow.',
      'Demand is 6/10 and rising: population growth projections for the Australind corridor are among the strongest in regional WA, driven by affordability, proximity to Bunbury employment, and the lifestyle appeal of the northern Leschenault Estuary area.',
      'Seasonality is 2/10: pure residential trade environment with consistent year-round demand from a community whose hospitality needs are driven by lifestyle and convenience rather than tourism or seasonal visitor activity.',
      'Rent is 3/10 — emerging residential corridor commercial rents are priced to attract operators into the developing precinct, with lease terms that reflect the early-stage commercial density rather than established suburban market rates.',
    ],
  },
  {
    name: 'Dalyellup',
    slug: 'dalyellup',
    state: 'WA',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      'Dalyellup is a coastal masterplanned suburb 15km south of Bunbury CBD — a newer community of young families and owner-occupiers who have chosen the coastal lifestyle but currently lack quality local hospitality options, making the short drive to Bunbury or Eaton a regular inconvenience that a correctly positioned operator could solve.',
      'Competition is 2/10: very low — Dalyellup\'s commercial development is at an early stage relative to its residential density, and the suburb represents a genuine first-mover market for operators willing to establish ahead of the competition.',
      'Seasonality is 2/10: the masterplanned residential character creates predictable year-round trade, with a modest coastal lifestyle uplift during summer weekends from the beach proximity and the outdoor-oriented community demographic.',
      'The young family demographic in Dalyellup has strong demand for child-friendly, outdoor casual dining and quality café concepts — operators who correctly read the community\'s lifestyle and family orientation create loyal repeat customers from the suburb\'s growing population.',
      'Rent is 3/10 — coastal masterplanned suburb commercial tenancies are priced to attract operators, and the combination of low rent and low competition creates a viable business case for operators who can build genuine community presence.',
    ],
  },
]

const _BUNBURY_BUILT = buildSuburbs(BUNBURY_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getBunburySuburbs(): BunburySuburb[] {
  return _BUNBURY_BUILT
}

export function getBunburySuburb(nameOrSlug: string): BunburySuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _BUNBURY_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getBunburySuburbSlugs(): string[] {
  return _BUNBURY_BUILT.map((s) => s.slug)
}

export function getBunburyNearbySuburbs(currentSlug: string, limit = 3): BunburySuburb[] {
  const sorted = [..._BUNBURY_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
