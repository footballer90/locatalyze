/**
 * lib/analyse-data/warrnambool.ts
 * Engine-computed suburb data for Warrnambool, VIC.
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

export interface WarrnamboolSuburbSeed {
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

export interface WarrnamboolSuburb extends WarrnamboolSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: WarrnamboolSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: WarrnamboolSuburbSeed[]): WarrnamboolSuburb[] {
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

// ─── Warrnambool suburb seeds ─────────────────────────────────────────────────

const WARRNAMBOOL_SEEDS: WarrnamboolSuburbSeed[] = [
  {
    name: 'Warrnambool CBD',
    slug: 'warrnambool-cbd',
    state: 'VIC',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 3, tourism: 6 },
    why: [
      'Liebig Street is the primary commercial and dining spine of Warrnambool — the main pedestrian retail strip for the South West Coast region, anchored by the Warrnambool Plaza shopping centre and drawing from a 35,000-person urban catchment plus a substantial visitor population from the Great Ocean Road and Shipwreck Coast tourism corridor.',
      'Tourism is 6/10: Warrnambool is a genuine tourism destination — the Flagstaff Hill Maritime Village, Logan Beach whale watching (June to September), and the Warrnambool Racing Carnival (May) create concentrated visitor demand that elevates food and hospitality spending well above the resident-only baseline.',
      'Competition is 6/10: the Liebig Street and Timor Street precincts have a well-developed independent food and hospitality scene, which validates the market but means new entrants need genuinely differentiated concepts to compete against established operators who have built loyal local followings.',
      'Rent is 5/10: Warrnambool CBD strip rents are higher than outer suburbs and the satellite towns, but remain significantly below Melbourne or Geelong equivalents — the premium reflects the genuine trade quality of the Liebig Street precinct, which is among the most active retail strips in regional Victoria.',
      'The CBD benefits from serving as the commercial hub for a wide rural and coastal hinterland — Portland, Port Fairy, Terang, and Camperdown all funnel a proportion of their commercial activity to Warrnambool, extending the effective catchment well beyond the 35,000-person urban population.',
    ],
  },
  {
    name: 'Merrivale',
    slug: 'merrivale',
    state: 'VIC',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 2, tourism: 3 },
    why: [
      'Merrivale contains the Gateway Plaza large-format retail precinct and the Warrnambool Base Hospital, making it the highest-volume retail foot traffic location in the Warrnambool urban area outside the CBD — Coles and Woolworths anchors drive consistent daily shopper traffic, supplemented by the hospital employee and visitor trade.',
      'Competition is 6/10: the large-format retail environment has attracted major food and service operators, including fast food chains and specialty retail — independent operators need to differentiate clearly on quality or format to compete effectively with established tenants.',
      'Demand is 7/10: the combination of major supermarket anchors, the hospital precinct, and the growing southern residential catchment creates one of the most reliable foot traffic environments in Warrnambool, independent of tourism cycles or seasonal variation.',
      'Rent is 5/10: Gateway Plaza tenancy costs reflect the high-volume, anchor-driven trade environment — operators can expect occupancy costs similar to CBD strip positions but with a different customer profile focused on convenience shopping rather than destination dining.',
      'Seasonality is 2/10: the anchor tenant structure and the hospital precinct create a trade pattern that is almost entirely independent of tourism or seasonal variation — arguably the most consistently year-round location in Warrnambool, with reliable foot traffic 52 weeks a year.',
    ],
  },
  {
    name: 'Dennington',
    slug: 'dennington',
    state: 'VIC',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 1, tourism: 1 },
    why: [
      'Dennington is the primary outer residential growth suburb of Warrnambool, situated between the CBD and the industrial estate on the Princes Highway — new estate development on Caramut Road and surrounding streets has created a large and growing family catchment that is significantly underserved by quality local hospitality.',
      'Competition is 2/10: Dennington has minimal commercial hospitality supply relative to its residential population — the suburb lacks quality cafe and casual dining options, and residents currently drive to the CBD or Merrivale for food and hospitality services they would prefer closer to home.',
      'Rent is 3/10: new development commercial tenancies in Dennington are priced to attract operators into an emerging precinct, with rents that reflect the early-stage market rather than the eventual trade potential as the residential population matures.',
      'The Dennington demographic is young families and first-home buyers who value community, convenience, and quality over destination dining — operators who establish themselves as the neighbourhood cafe or family restaurant build durable community loyalty as the suburb grows.',
      'Seasonality is 1/10: the pure residential and industrial fringe character creates an almost entirely season-independent trade pattern — revenue is driven by the local resident and worker catchment, which is consistent and predictable regardless of time of year.',
    ],
  },
  {
    name: 'Allansford',
    slug: 'allansford',
    state: 'VIC',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 3 },
    why: [
      'Allansford is a small dairy-country village 7km east of Warrnambool on the Princes Highway, primarily known for the Allansford Cheese World tourist attraction — a small community with a modest resident population supplemented by highway passing trade and tourism associated with the Cheese World and Princes Highway routes.',
      'Tourism is 3/10: the Allansford Cheese World and the Princes Highway position generate above-average passing trade for a village of this size — travellers on the Melbourne to Warrnambool route stop for fuel, coffee, and food, creating demand that exceeds what the resident population alone would support.',
      'Competition is 2/10: Allansford has very limited commercial hospitality supply — the existing operators are minimal and the community is genuinely underserved, but the market scale is constrained by the small permanent population.',
      'Rent is 2/10: Allansford commercial rents are among the lowest in the Warrnambool region, making the entry economics accessible for small-scale operators who can serve both the resident community and the passing highway trade.',
      'Seasonality is 3/10: the highway and tourism trade creates some seasonal variation, with summer (December to February) and the May racing carnival weekend generating uplifts in passing traffic, while winter months are quieter and the small resident base alone provides modest revenue.',
    ],
  },
  {
    name: 'Woodford',
    slug: 'woodford',
    state: 'VIC',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Woodford is the established inner residential suburb adjacent to Warrnambool Base Hospital, encompassing a professional and healthcare-worker demographic who generates consistent demand for quality hospitality within walking distance of both the hospital and the residential neighbourhood.',
      'The proximity to Warrnambool Base Hospital creates a reliable professional customer base — nurses, doctors, allied health workers, and administrators working shift patterns create early-morning, lunchtime, and late-evening demand windows that suit extended-hours hospitality concepts.',
      'Competition is 4/10: Woodford has some established operators serving the hospital and residential catchment, but the shift-working demand pattern and the residential professional demographic create specific supply gaps that standard commercial hours do not serve.',
      'Rent is 4/10: the proximity to the hospital and the inner-residential character carries a modest rent premium over outer suburbs, but remains well below Liebig Street CBD rates — operators can access a high-quality professional catchment at reasonable occupancy costs.',
      'Seasonality is 2/10: the hospital employment base creates a trade pattern that is entirely independent of tourism or seasonal cycles, making Woodford one of the most consistent year-round locations in Warrnambool for operators who can serve the healthcare-worker market.',
    ],
  },
  {
    name: 'Koroit',
    slug: 'koroit',
    state: 'VIC',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 4, tourism: 6 },
    why: [
      'Koroit is a well-preserved Irish heritage village 15km east of Warrnambool, centred on the Tower Hill Wildlife Reserve and the historic town centre — a boutique food and regional tourism destination that attracts Melbourne day-trippers and Shipwreck Coast visitors seeking an authentic village experience beyond the main highway strip.',
      'Tourism is 6/10: the Tower Hill Wildlife Reserve is one of Victoria\'s most visited regional wildlife destinations, and Koroit\'s Irish heritage character and quality independent food scene draw visitors who specifically seek the village experience — the tourism demand is genuine and supports above-average spend.',
      'Competition is 4/10: Koroit has a small but quality food and hospitality scene with some well-established independent operators, including operators who have built reputations that draw visitors from Warrnambool and beyond — new entrants need genuine quality and differentiation.',
      'Seasonality is 4/10: the tourism market creates meaningful seasonal variation, with spring (October to November) and summer (December to February) being strongest for visitor trade, and winter months relying more heavily on local residents and day-trippers from Warrnambool for whom Koroit is an easy short drive.',
      'Rent is 3/10: Koroit commercial rents are low by any regional comparison, making the entry economics accessible for operators who can execute genuine quality for both the tourist and local resident market.',
    ],
  },
  {
    name: 'Port Fairy',
    slug: 'port-fairy',
    state: 'VIC',
    factors: { demand: 6, rent: 5, competition: 5, seasonality: 5, tourism: 8 },
    why: [
      'Port Fairy is one of Victoria\'s premier coastal tourism villages — a National Trust-classified heritage town 30km west of Warrnambool that hosts the Port Fairy Folk Festival (March, 15,000 attendees), draws Melbourne visitors seeking premium coastal accommodation and food, and commands the highest per-visit spend of any location in the South West Coast region.',
      'Tourism is 8/10: Port Fairy\'s tourism market is among the strongest per-capita in regional Victoria — the Folk Festival alone represents one concentrated weekend of extraordinary revenue, and the premium accommodation market (100+ holiday homes and B&Bs) sustains above-average visitor spending for six to seven months of the year.',
      'Seasonality is 5/10: the tourism concentration creates a pronounced seasonal revenue profile. The Folk Festival and the October to April warm-season period deliver exceptional revenue for well-positioned operators. May to August is materially softer, and operators without a strong local resident base or a strategy for the shoulder season face cash flow pressure in winter.',
      'Competition is 5/10: Port Fairy has a quality-dense food and hospitality scene for a town of 3,000 permanent residents — the market is well-developed and discerning visitors expect quality. New operators need to clear a genuine quality bar to compete with established venues that have built loyal visitor followings.',
      'Rent is 5/10: commercial rents in Port Fairy are elevated relative to other South West Coast towns, reflecting the premium tourism positioning and the relatively limited supply of quality commercial tenancies in the heritage town centre.',
    ],
  },
]

const _WARRNAMBOOL_BUILT = buildSuburbs(WARRNAMBOOL_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getWarrnamboolSuburbs(): WarrnamboolSuburb[] {
  return _WARRNAMBOOL_BUILT
}

export function getWarrnamboolSuburb(nameOrSlug: string): WarrnamboolSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _WARRNAMBOOL_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getWarrnamboolSuburbSlugs(): string[] {
  return _WARRNAMBOOL_BUILT.map((s) => s.slug)
}

export function getWarrnamboolNearbySuburbs(currentSlug: string, limit = 3): WarrnamboolSuburb[] {
  const sorted = [..._WARRNAMBOOL_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
