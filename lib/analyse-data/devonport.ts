/**
 * lib/analyse-data/devonport.ts
 * Engine-computed suburb data for Devonport, TAS.
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

export interface DevonportSuburbSeed {
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

export interface DevonportSuburb extends DevonportSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: DevonportSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: DevonportSuburbSeed[]): DevonportSuburb[] {
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

// ─── Devonport suburb seeds ───────────────────────────────────────────────────

const DEVONPORT_SEEDS: DevonportSuburbSeed[] = [
  {
    name: 'Devonport CBD',
    slug: 'devonport-cbd',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 4, tourism: 6 },
    why: [
      'Rooke Street and Formby Road form the primary commercial spine of Devonport CBD — the highest concentration of retail and hospitality activity in the northwest Tasmanian gateway city. The Spirit of Tasmania ferry terminal, located under 2km from the CBD, creates a genuine flow of interstate visitors arriving and departing who use the CBD for pre-boarding and post-arrival hospitality.',
      'Tourism is 6/10: Devonport is the primary entry point for mainland visitors arriving in Tasmania by sea. The Spirit of Tasmania carries approximately 380,000 passengers per year, and a meaningful proportion spend time in the CBD before dispersing to Launceston, Hobart, or the Cradle Mountain corridor. This creates reliable visitor foot traffic that is less dependent on Tasmanian-specific seasonal patterns than other northwest towns.',
      'Competition is 5/10: the CBD has a working commercial hospitality density that validates the market, but the growing food culture movement in Devonport — driven partly by the Tasmanian food and beverage boom — means there is genuine room for quality operators who raise the standard of the existing offer.',
      'Seasonality is 4/10: the Spirit of Tasmania ferry runs year-round, moderating the seasonal softness that affects purely tourist-dependent northwest Tasmanian businesses. The local residential and government workforce provides year-round baseline trade. December to February delivers visitor uplift from summer holiday travel; June to August is the quieter period.',
      'Rent is 4/10: Devonport CBD commercial rents are moderate for a Tasmanian regional city — below Launceston and well below Hobart, but higher than fringe suburbs and satellite towns. The rent-to-revenue ratio is more workable here than in larger Tasmanian cities for operators who can build both local and visitor trade.',
    ],
  },
  {
    name: 'East Devonport',
    slug: 'east-devonport',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 4, tourism: 7 },
    why: [
      'East Devonport sits directly adjacent to the Spirit of Tasmania ferry terminal — the first impression of Tasmania for approximately 380,000 arriving mainland passengers per year. The visitor first-impression hospitality opportunity is genuine: ferry arrivals often spend 30 to 90 minutes in East Devonport before heading to their final destination, creating concentrated hospitality demand in a specific window.',
      'Tourism is 7/10: the highest tourism exposure of any Devonport suburb, driven entirely by the ferry terminal adjacency. The Spirit of Tasmania arrival pattern creates predictable demand spikes twice daily during ferry operating periods, and the scale of the passenger flow — across both the Melbourne-Devonport and Sydney-Devonport routes — provides a genuine revenue base for correctly positioned hospitality.',
      'Competition is 3/10: the immediate ferry terminal precinct is under-served relative to the passenger volume passing through. The opportunity to be the first quality hospitality experience arriving visitors encounter in Tasmania is commercially significant and not adequately captured by the current operator supply.',
      'Seasonality is 4/10: the Spirit of Tasmania ferry operates year-round with relatively consistent passenger volumes, though summer (December to February) sees a meaningful uplift in leisure traveller numbers. The year-round ferry operation moderates the seasonal revenue risk compared to purely summer-tourism-dependent locations.',
      'Demand is 5/10 for the broader East Devonport residential catchment, which has a working-class and mixed demographic profile separate from the ferry terminal opportunity. Operators who can serve both the ferry terminal visitor segment and the local residential community build the most resilient revenue base in this suburb.',
    ],
  },
  {
    name: 'Don',
    slug: 'don',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Don is an eastern residential corridor of Devonport with a stable family demographic — a growing suburban catchment that currently travels to the Devonport CBD or East Devonport for most hospitality and convenience food needs. The residential density is increasing as new family housing development fills the eastern corridor.',
      'Competition is 2/10: very low operator density in Don reflects the underserved residential market rather than a lack of demand. Quality cafe and family-oriented casual dining concepts that establish community loyalty in Don currently face almost no direct competition in the immediate vicinity.',
      'Demand is 5/10: the family residential demographic creates real and consistent daily demand for cafes, family-friendly casual dining, and convenience food concepts. The household income profile is moderate — value-for-money and family-friendly positioning outperforms premium concepts in this catchment.',
      'Low seasonality (3/10) and low tourism (2/10) create a pure residential trade environment in Don. Revenue is predictable and not subject to the tourist season upswings and downswings that affect more visitor-dependent Devonport locations. Year-round consistency is the trade-off against lower absolute volume.',
      'Rent is 2/10: residential corridor commercial tenancies in Don are priced well below CBD and ferry terminal precinct rents. The low entry cost and low competition make break-even achievable at modest revenue volumes — important for operators building from a local residential base without an early tourism subsidy.',
    ],
  },
  {
    name: 'Latrobe',
    slug: 'latrobe',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 4, tourism: 5 },
    why: [
      'Latrobe is a historic village 10km south of Devonport CBD with a boutique food and dining scene that has developed independently from the main city commercial strip. The Platypus spotting at Warrawee Forest Reserve and the heritage streetscape create a genuine visitor attraction that brings both Devonport day-trippers and Tasmania-wide visitors into the village.',
      'Tourism is 5/10: Latrobe benefits from a combination of heritage tourism, the platypus observation site at Warrawee, and the cycling trail network connecting to the broader northwest. The Latrobe food scene has developed enough of a reputation to function as a destination dining location for Devonport residents — a genuine food tourism draw within the broader regional context.',
      'Competition is 3/10: Latrobe has established a small but quality food and hospitality scene. The existing operators have built genuine reputations that validate the market, but the village scale and the visitor draw mean there is room for additional quality concepts that fit the artisan and heritage character of the precinct.',
      'Demand is 5/10: a combination of the local Latrobe and broader Devonport residential catchment who treat Latrobe as a destination dining experience, plus genuine visitor foot traffic from the platypus site and cycling trails, creates above-average demand density for a 10km-from-the-city village.',
      'Rent is 2/10: Latrobe commercial rents are very low relative to Devonport CBD, reflecting the village scale and the secondary commercial status. This makes the financial model very workable for boutique operators who can generate destination-dining revenue from a low fixed-cost base.',
    ],
  },
  {
    name: 'Ulverstone',
    slug: 'ulverstone',
    factors: { demand: 5, rent: 2, competition: 4, seasonality: 4, tourism: 5 },
    why: [
      'Ulverstone is a coastal town 20km west of Devonport with its own established dining precinct and a lifestyle food scene that serves both the local residential population and visitors travelling the northwest coast tourism corridor. The beach and coastal foreshore give Ulverstone a distinct lifestyle character that supports premium-casual food and beverage positioning.',
      'Tourism is 5/10: Ulverstone captures northwest coast visitors travelling between Devonport and the coastal towns heading toward the Cradle Mountain approach road. The coastal foreshore, the river inlet, and the relaxed lifestyle character make Ulverstone an attractive stop for visitors rather than a pure transit point.',
      'Competition is 4/10: Ulverstone has an established dining precinct with enough existing operators to validate the market, but the coastal lifestyle positioning means genuinely differentiated concepts — quality coffee, artisan food, lifestyle retail — find receptive audiences without being crowded out.',
      'Demand is 5/10: the residential catchment in Ulverstone and the surrounding agricultural and coastal communities provides a stable local customer base, supplemented by the northwest coast visitor trade during the warmer months and shoulder season. The income profile includes farming families, coastal lifestyle residents, and some retirees.',
      'Rent is 2/10: Ulverstone commercial rents are very low compared to Devonport CBD — a coastal town with a lifestyle hospitality scene where operators can build a quality food business at a fraction of the fixed-cost structure required in a Hobart or Launceston equivalent location.',
    ],
  },
  {
    name: 'Spreyton',
    slug: 'spreyton',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Spreyton is a southern suburban residential area of Devonport with a family-oriented demographic — an established suburb that serves as a commuter residential base for Devonport CBD workers and healthcare employees. The catchment is stable and consistent, with modest but genuine hospitality demand for everyday convenience food and cafe concepts.',
      'Competition is 2/10: limited commercial activity in Spreyton means genuine first-mover opportunity for operators who want to establish a community-facing convenience concept. The suburb currently exports most of its hospitality spend to the CBD, East Devonport, or local fast-food options — a quality independent cafe or casual dining concept fills a real gap.',
      'Demand is 4/10: the family residential demographic creates genuine daily demand for cafes and convenience food that is currently underserved. The income profile is moderate working-class to middle-class — operators should position for value-for-money and family-friendly appeal rather than premium pricing.',
      'Low seasonality (3/10) and low tourism (2/10) create a predictable residential trade environment. Revenue consistency across the year is the characteristic of Spreyton — no tourist season uplift, but also no tourist season cliff. The trade baseline is stable and entirely dependent on local community loyalty.',
      'Rent is 2/10: Spreyton commercial rents are very low, reflecting the limited commercial development in the suburb. This makes break-even achievable at modest revenue volumes and reduces financial risk for operators establishing the first quality hospitality concept in the catchment.',
    ],
  },
  {
    name: 'Shorewell Park',
    slug: 'shorewell-park',
    factors: { demand: 3, rent: 1, competition: 1, seasonality: 3, tourism: 1 },
    why: [
      'Shorewell Park is a working-class residential suburb of Devonport with a genuine community need for accessible, affordable food and essential services. The demographic profile is lower-income residential — a catchment that prioritises value and reliability over premium food experiences and that represents an underserved essential-services market rather than an aspirational hospitality opportunity.',
      'Competition is 1/10: essentially no existing commercial hospitality in the immediate Shorewell Park area — the lowest competitive density in the Devonport dataset. The absence of competition is accurate and reflects both the catchment spending capacity constraints and the lack of previous operator investment in this area.',
      'Demand is 3/10: genuine but limited — the catchment has real demand for affordable convenience food and community-facing essential services. Operators who correctly price and position for the actual spending capacity of the Shorewell Park demographic build durable local trade. Concepts priced or positioned above the catchment reality will not survive.',
      'Rent is 1/10: the lowest commercial rents in the Devonport dataset, reflecting the lower-income residential character and the minimal commercial infrastructure of the suburb. Break-even is achievable at very modest revenue volumes for essential-service concepts with lean operating structures.',
      'Low seasonality (3/10) and very low tourism (1/10) make Shorewell Park a purely local residential trade environment. There is no seasonal uplift, no visitor trade, and no external revenue source beyond the immediate community. Operators who build genuine community loyalty in Shorewell Park build something sustainable; those who need volume growth will hit the catchment ceiling quickly.',
    ],
  },
]

const _DEVONPORT_BUILT = buildSuburbs(DEVONPORT_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getDevonportSuburbs(): DevonportSuburb[] {
  return _DEVONPORT_BUILT
}

export function getDevonportSuburb(nameOrSlug: string): DevonportSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _DEVONPORT_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getDevonportSuburbSlugs(): string[] {
  return _DEVONPORT_BUILT.map((s) => s.slug)
}

export function getDevonportNearbySuburbs(currentSlug: string, limit = 3): DevonportSuburb[] {
  const sorted = [..._DEVONPORT_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
