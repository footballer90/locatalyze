/**
 * lib/analyse-data/geraldton.ts
 * Engine-computed suburb data for Geraldton, WA.
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

export interface GeraldtonSuburbSeed {
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

export interface GeraldtonSuburb extends GeraldtonSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: GeraldtonSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: GeraldtonSuburbSeed[]): GeraldtonSuburb[] {
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

// ─── Geraldton suburb seeds ───────────────────────────────────────────────────

const GERALDTON_SEEDS: GeraldtonSuburbSeed[] = [
  {
    name: 'Geraldton City Centre',
    slug: 'geraldton-city-centre',
    state: 'WA',
    factors: { demand: 7, rent: 4, competition: 6, seasonality: 4, tourism: 6 },
    why: [
      'Marine Terrace is the primary hospitality and retail spine of WA\'s fourth-largest city — a mid-sized regional centre of 80,000 people that serves as the commercial, administrative, and tourism hub for a vast Mid West catchment extending several hundred kilometres inland.',
      'Tourism is 6/10: Geraldton is the gateway for the Abrolhos Islands marine park, the Houtman Abrolhos Islands dive and snorkel tourism, and the broader Coral Coast tourism corridor — visitor spending concentrates on Marine Terrace and the foreshore precinct, particularly during the April to October tourist season.',
      'Competition is 6/10: Marine Terrace has meaningful operator density for a city of this scale — a mix of established local institutions, national cafe chains, and independently owned restaurants that have served the commercial and public sector workforce for years. New operators need clear differentiation.',
      'Seasonality is 4/10: the tourist season from April to October (driven by the Abrolhos Islands and the Coral Coast visitor market) creates revenue uplifts that are offset by softer summer trade — Geraldton\'s summer heat reduces casual foot traffic compared to the comfortable autumn and winter months.',
      'Rent is 4/10 — below WA metropolitan rents and competitive for a regional city of Geraldton\'s scale and catchment size, representing accessible entry costs relative to the demand volume on Marine Terrace.',
    ],
  },
  {
    name: 'Beresford',
    slug: 'beresford',
    state: 'WA',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 4, tourism: 5 },
    why: [
      'Beresford is Geraldton\'s premier beachside suburb, adjacent to the Foreshore precinct and the HMAS Sydney II memorial — an ocean-facing lifestyle location where the sea-change and professional residential demographic has genuine food culture expectations that local hospitality supply has not yet fully met.',
      'Tourism is 5/10: the Geraldton Foreshore and Beresford beach strip attract both local recreational users and visiting tourists, with the HMAS Sydney II memorial drawing significant historical tourism that concentrates near the foreshore precinct.',
      'Competition is 4/10: some established operators in the Beresford and foreshore area, but the lifestyle café opportunity for a quality-casual concept serving the beachside residential demographic and foreshore visitors is genuinely underexploited.',
      'Seasonality is 4/10: the beach and foreshore position creates a genuine seasonal pattern — autumn and winter are the most comfortable months for outdoor dining in Geraldton\'s climate, while the hot summer reduces casual foot traffic at exposed foreshore positions.',
      'Rent is 3/10 — beachside residential commercial positions in Geraldton are priced well below Perth coastal suburb equivalents, representing strong value for operators who can capitalise on the foreshore and lifestyle positioning.',
    ],
  },
  {
    name: 'Rangeway',
    slug: 'rangeway',
    state: 'WA',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Rangeway is an established inner residential suburb with a modest demographic profile — a community that generates consistent demand for essential-service food and café trade from the local residential population without the premium positioning characteristics of the City Centre or Beresford.',
      'Competition is 3/10: limited operator density that accurately reflects the suburban essential-service scale of the market — there is genuine residential demand for convenience food and community café options, and the competitive environment does not strongly penalise correctly positioned new entrants.',
      'Seasonality is 2/10: the residential character creates consistent year-round trade without material tourism or seasonal variation — predictable demand from a stable community.',
      'The demographic in Rangeway responds to value positioning, community familiarity, and reliable convenience — operators who position as the reliable local option rather than the premium destination build the most durable trade in this suburban market.',
      'Rent is 2/10 — among the lowest commercial rents in the Geraldton catchment, making break-even achievable at modest revenue volumes for essential-service and convenience-focused operators.',
    ],
  },
  {
    name: 'Strathalbyn',
    slug: 'strathalbyn',
    state: 'WA',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      'Strathalbyn is a newer residential growth area in Geraldton\'s eastern corridor — a developing family suburb whose population growth is outpacing commercial supply, creating a first-mover window for operators who establish before the market\'s demand is captured by established competitors.',
      'Competition is 2/10: very low — the suburb\'s commercial activity is at an early stage relative to its residential density, and Strathalbyn residents currently travel to the City Centre or Spalding for most of their hospitality and retail needs.',
      'Seasonality is 2/10: the residential growth area character creates consistent year-round trade driven by the local community\'s everyday needs — no material tourism exposure and highly predictable demand from a growing residential catchment.',
      'The family demographic in Strathalbyn has strong demand for child-friendly, accessible café and casual dining formats — operators who correctly position for the young family lifestyle and build genuine community presence create loyal repeat customers from the growing residential population.',
      'Rent is 3/10 — newer residential growth area commercial tenancies are priced to attract operators into the developing precinct, with lease terms that reflect the early-stage market rather than the established commercial density of Geraldton\'s city centre.',
    ],
  },
  {
    name: 'Spalding',
    slug: 'spalding',
    state: 'WA',
    factors: { demand: 5, rent: 2, competition: 4, seasonality: 2, tourism: 1 },
    why: [
      'Spalding is an established residential suburb with a modest commercial strip that serves as a convenience hub for the surrounding western residential areas — a community-scale market that rewards operators who serve the local catchment consistently rather than competing for destination traffic.',
      'Competition is 4/10: Spalding\'s commercial strip has incumbent operators in established positions — new entrants need a clear differentiated proposition to capture share in a market where operators have built genuine community loyalty over time.',
      'Seasonality is 2/10: the residential character creates consistent year-round trade that is not materially affected by tourism or seasonal variation — stable, predictable, and appropriate for operators who value reliability over peak-season revenue.',
      'The established residential demographic in Spalding has consistent convenience food and café demand — morning coffee trade, takeaway lunch, and casual dining for the local community are the primary revenue opportunities for well-positioned operators.',
      'Rent is 2/10 — suburban residential commercial rates that are accessible for operators serving the local catchment, with break-even achievable at modest volume levels.',
    ],
  },
  {
    name: 'Bluff Point',
    slug: 'bluff-point',
    state: 'WA',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 3 },
    why: [
      'Bluff Point is a coastal residential suburb on Geraldton\'s northern headland — a quiet lifestyle community with ocean access and a small resident population whose hospitality needs are currently met by travelling to the City Centre or Beresford rather than accessing quality local options.',
      'Competition is 2/10: very low — the modest scale of the residential catchment and the absence of meaningful commercial activity create a genuinely underserved local market, though the demand volume is constrained by the suburb\'s residential density.',
      'Tourism is 3/10: the coastal headland position creates some incidental visitor foot traffic from beachgoers and recreational users, particularly during the comfortable autumn and winter months when the Geraldton coast is at its most attractive.',
      'Seasonality is 3/10: the coastal character creates a modest seasonal pattern driven by climate — autumn and winter foot traffic from outdoor recreational users and ocean visitors is higher than the hot summer months when beach activity decreases.',
      'Rent is 2/10 — coastal residential suburb commercial positions are priced at the lower end of the Geraldton spectrum, making the economics achievable for operators correctly calibrated to the modest but genuine local demand.',
    ],
  },
  {
    name: 'Wonthella',
    slug: 'wonthella',
    state: 'WA',
    factors: { demand: 5, rent: 3, competition: 5, seasonality: 2, tourism: 1 },
    why: [
      'Wonthella is a western residential suburb with an established commercial strip that includes the presence of a Dome Cafe franchise — the franchise incumbent creates a competitive baseline that independent operators must acknowledge and differentiate from when positioning in this market.',
      'Competition is 5/10: the Dome Cafe presence raises the effective competitive floor for any new hospitality entrant — independent operators need genuinely differentiated concepts that serve segments the franchise does not address, rather than competing directly on the same product positioning.',
      'Demand is 5/10: the residential catchment generates consistent everyday hospitality demand from a stable community — there is genuine trade volume for operators who correctly position against the existing competitive environment rather than replicating it.',
      'Seasonality is 2/10: the residential character creates consistent year-round trade with no material tourism exposure and negligible seasonal variation — predictable demand from an established community.',
      'Rent is 3/10 — commercial strip rates in Wonthella are accessible for independent operators, though the competitive dynamic with the Dome Cafe franchise means that revenue projections need to account for the existing operator\'s market share.',
    ],
  },
]

const _GERALDTON_BUILT = buildSuburbs(GERALDTON_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getGeraldtonSuburbs(): GeraldtonSuburb[] {
  return _GERALDTON_BUILT
}

export function getGeraldtonSuburb(nameOrSlug: string): GeraldtonSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _GERALDTON_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getGeraldtonSuburbSlugs(): string[] {
  return _GERALDTON_BUILT.map((s) => s.slug)
}

export function getGeraldtonNearbySuburbs(currentSlug: string, limit = 3): GeraldtonSuburb[] {
  const sorted = [..._GERALDTON_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
