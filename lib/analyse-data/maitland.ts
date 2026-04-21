/**
 * lib/analyse-data/maitland.ts
 * Engine-computed suburb data for Maitland, NSW.
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

export interface MaitlandSuburbSeed {
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

export interface MaitlandSuburb extends MaitlandSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: MaitlandSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: MaitlandSuburbSeed[]): MaitlandSuburb[] {
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

// ─── Maitland suburb seeds ────────────────────────────────────────────────────

const MAITLAND_SEEDS: MaitlandSuburbSeed[] = [
  {
    name: 'Maitland CBD',
    slug: 'maitland-cbd',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 2, tourism: 4 },
    why: [
      'Maitland CBD is the historic commercial heart of the Hunter Valley\'s largest inland centre — the High Street precinct and the surrounding heritage streetscape create a distinctive positioning for independent operators, with a resident catchment of over 85,000 people in the broader Maitland LGA and strong year-round demand insulated from coastal tourism cycles.',
      'Demand is 7/10: Maitland\'s strong population growth — one of NSW\'s fastest-growing inland LGAs — is driven by housing affordability and proximity to Newcastle, creating a growing resident base with metropolitan food culture expectations and consistent year-round spending on food and hospitality.',
      'Tourism is 4/10: the heritage streetscape draws some weekend tourism from Newcastle and Sydney, and the proximity to the Hunter Valley wine country creates tourism adjacency — Maitland CBD is not a primary tourism destination but benefits from the overflow of visitors travelling to the Hunter wine region.',
      'Competition is 5/10: the CBD has an established but not saturated operator base, with genuine room for quality independent concepts that leverage the heritage character and the growing resident base — the streetscape supports boutique retail and quality dining rather than high-volume generic concepts.',
      'Seasonality is 2/10: Maitland\'s inland position and resident-driven demand create the most stable year-round trade environment in the dataset — the seasonal variation is very low relative to the coastal cities, with consistent demand across all months of the year.',
    ],
  },
  {
    name: 'Rutherford',
    slug: 'rutherford',
    factors: { demand: 7, rent: 4, competition: 6, seasonality: 2, tourism: 1 },
    why: [
      'Rutherford is the major suburban commercial hub of the Maitland LGA — the Rutherford Marketplace shopping centre anchors a high-volume retail precinct serving the extensive residential catchment across the northern Maitland suburbs, delivering some of the most consistent year-round foot traffic volumes in the Hunter Valley inland region.',
      'Demand is 7/10: the shopping centre catchment draws from a wide suburban residential area including Rutherford, Metford, and surrounding estates — the combined resident population creates high baseline foot traffic that is entirely insensitive to tourism or seasonal variation.',
      'Seasonality is 2/10: Rutherford\'s trade is driven by residential shopping patterns on a weekly and daily cycle rather than tourism or seasonal visitor flows — the revenue stability across all 52 weeks of the year is a structural advantage for operators who prioritise predictability over peak opportunity.',
      'Competition is 6/10: the national chain presence in the shopping centre food court and the established specialty retail tenancies set a quality benchmark — independent operators need to compete on quality, concept differentiation, or demographic relevance to justify discretionary spending from a value-conscious suburban resident catchment.',
      'Tourism is 1/10: the lowest tourism score in the Maitland dataset — Rutherford is a domestic residential retail precinct with no tourism draw whatsoever, making it the purest resident-trade location in the regional market.',
    ],
  },
  {
    name: 'East Maitland',
    slug: 'east-maitland',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'East Maitland is the primary residential growth corridor for the Maitland LGA — ongoing residential development is delivering a growing young professional and family demographic with metropolitan food culture expectations who currently travel to Maitland CBD or Rutherford for quality hospitality, creating a genuine first-mover opportunity in the emerging commercial strips.',
      'Demand is 6/10: the East Maitland residential base is growing faster than the local commercial supply, creating demand overhang that well-positioned early operators can capture — the demographic is quality-seeking and income-secure, supporting above-average per-visit spend for correctly positioned concepts.',
      'Competition is 4/10: the limited existing operator base reflects the emerging nature of the commercial strip rather than insufficient demand — first-mover operators who establish quality independent concepts capture the community loyalty of a growing resident base before competition arrives.',
      'Seasonality is 2/10: East Maitland\'s trade is entirely resident-driven, with no tourism overlay whatsoever — the revenue pattern is highly consistent across the year, with modest variation driven by school holidays and major events rather than seasonal tourist flows.',
      'Rent is 4/10: commercial rents in East Maitland\'s emerging strips are lower than the CBD and Rutherford shopping centre, with the pricing reflecting the current lower foot traffic rather than the growth trajectory — early operators access below-market rents for the catchment they will capture as the population grows.',
    ],
  },
  {
    name: 'Cessnock',
    slug: 'cessnock',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 3, tourism: 6 },
    why: [
      'Cessnock is the gateway to the Hunter Valley wine region — a town of approximately 25,000 residents that sits at the entrance to the Pokolbin and Broke wine tourism corridor, creating a genuine tourism adjacency for hospitality concepts that position for the wine country visitor market without the high rents of the vineyard precincts themselves.',
      'Tourism is 6/10: the Hunter Valley wine region attracts approximately 1.8 million visitors annually, and Cessnock is the primary urban service hub for that visitor flow — hospitality operators who position for the wine tourism catchment access a consistent visitor trade from Sydney and Newcastle weekenders who pass through Cessnock en route to the wineries.',
      'Demand is 6/10: the resident base and the tourism overlay combine to create a demand profile that has genuine scale — quality food and beverage operators who serve both the local community and the tourism-adjacent market build diversified revenue streams that moderate the seasonal risk of pure tourism dependency.',
      'Seasonality is 3/10: wine tourism has some seasonal variation with spring and autumn being peak visitor periods, but the Hunter Valley wine region attracts visitors year-round and the resident demand base is consistent across the full calendar year.',
      'Competition is 4/10: Cessnock\'s operator base is established but not saturated — there is genuine room for quality independent concepts, particularly in the quality-casual dining and specialty food categories that serve the wine tourism demographic who expect above-average food experiences.',
    ],
  },
  {
    name: 'Singleton',
    slug: 'singleton',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      'Singleton is the Upper Hunter\'s primary commercial centre — a town of approximately 22,000 residents built on the coal mining and agricultural economy, with a workforce that generates consistent food and hospitality demand through high average wages and a corporate and contractor population that regularly dines out.',
      'Demand is 6/10: the mining industry workforce demographics create strong hospitality demand at above-average ticket values — FIFO workers, mining company contractors, and agribusiness professionals generate consistent lunch and dinner trade at quality-positioned restaurants and cafes throughout the working week.',
      'Seasonality is 2/10: Singleton\'s demand is driven by resident, workforce, and agricultural community patterns rather than tourist seasonality — the trade profile is highly consistent year-round with very low seasonal variation, making it one of the most stable revenue environments in the Hunter Valley region.',
      'Tourism is 3/10: Singleton benefits from some Upper Hunter wine tourism, horse stud tourism, and the Singleton Military Area heritage interest, but is primarily a service town rather than a tourism destination — the visitor overlay adds to rather than dominates the resident and workforce trade.',
      'Competition is 4/10: Singleton\'s operator base is modest relative to the demand signals — quality independent operators who position above the fast food and pub dining default earn strong loyalty from a workforce demographic that has a genuine appetite for better food options and the income to pay for them.',
    ],
  },
  {
    name: 'Morpeth',
    slug: 'morpeth',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 3, tourism: 6 },
    why: [
      'Morpeth is a heritage-listed village on the Hunter River 5km from Maitland CBD — a National Trust-protected streetscape of Victorian and Federation-era buildings has created one of the most distinctive boutique shopping and artisan food destinations in the Hunter Valley, drawing day-trip tourists from Newcastle and Sydney who specifically seek out the village\'s heritage food culture.',
      'Tourism is 6/10: Morpeth\'s heritage village identity creates a genuine tourism draw independent of the wine region — the specialty food producers, artisan bakeries, heritage accommodation, and boutique retail that have established in the village draw deliberate visitors rather than transit traffic, generating above-average per-visit spend from quality-seeking tourists.',
      'Demand is 5/10: the resident population of Morpeth itself is small, and the market is primarily driven by day-trip and weekend visitor trade supplemented by the local demographic — operators must correctly position for both the tourist and the local community rather than choosing one.',
      'Competition is 4/10: the heritage village positioning has attracted quality independent operators, and the existing cluster of specialty food and artisan retail actually reinforces the tourism draw rather than competing against it — new entrants who complement rather than duplicate the existing mix are welcomed by the precinct.',
      'Seasonality is 3/10: Morpeth\'s tourism draw is year-round through the heritage identity — the seasonal variation is modest compared to coastal locations, with spring and the lead-up to Christmas generating peak visitor volumes and autumn being the other strong period.',
    ],
  },
  {
    name: 'Kurri Kurri',
    slug: 'kurri-kurri',
    factors: { demand: 4, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Kurri Kurri is a working-class inner Hunter town of approximately 6,000 people with roots in the coal mining and aluminium smelting industries — a community built on blue-collar employment and strong local identity, where operators who understand and serve the resident community can build durable trade at the lowest commercial rents in the Hunter Valley.',
      'Demand is 4/10: the Kurri Kurri resident market is genuine but modest in scale and purchasing power — successful operators calibrate their pricing and format to the community rather than importing metropolitan concepts that the catchment does not naturally sustain.',
      'Competition is 3/10: the limited operator density reflects the genuine scale constraints of the market — there is real space for community-positioned operators who serve the resident base, but the revenue ceiling is lower than the larger Maitland or Cessnock markets.',
      'Rent is 2/10: the lowest commercial rents in the Maitland regional dataset, creating favourable unit economics for operators who correctly calibrate to the market and accept modest revenue volumes as the trade-off for very low occupancy costs.',
      'Seasonality is 2/10: Kurri Kurri\'s trade is driven entirely by resident patterns with no tourism overlay — the revenue is consistent and predictable, creating a stable environment for operators who serve the community without seasonal peaks or troughs.',
    ],
  },
  {
    name: 'Raymond Terrace',
    slug: 'raymond-terrace',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 3, tourism: 4 },
    why: [
      'Raymond Terrace is the administrative centre of Port Stephens Council and the gateway town for Port Stephens coastal tourism — a growing residential community of approximately 15,000 people positioned at the confluence of the Hunter River and the Pacific Highway, with strong population growth driven by housing affordability relative to Newcastle.',
      'Demand is 6/10: the growing resident population and the gateway positioning for Port Stephens tourism create a combined demand profile that is stronger than Raymond Terrace\'s population alone would suggest — commuters from Newcastle, Port Stephens tourists, and the expanding local residential base all contribute to the food and hospitality demand.',
      'Tourism is 4/10: Raymond Terrace sits on the route to Nelson Bay, Anna Bay, and the Stockton Bight sand dunes — significant tourist traffic passes through the town on the way to Port Stephens coastal destinations, creating a visitor trade overlay for food and convenience concepts positioned for the tourist corridor.',
      'Competition is 4/10: the existing operator base is modest relative to the demand signals — the population growth and gateway positioning create genuine space for quality independent operators who have not yet established in Raymond Terrace.',
      'Seasonality is 3/10: while the Port Stephens tourism corridor creates some seasonal variation, Raymond Terrace\'s own demand is primarily resident-driven — the seasonal swing is moderate rather than extreme, with the resident base providing consistent year-round baseline trade.',
    ],
  },
]

const _MAITLAND_BUILT = buildSuburbs(MAITLAND_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getMaitlandSuburbs(): MaitlandSuburb[] {
  return _MAITLAND_BUILT
}

export function getMaitlandSuburb(nameOrSlug: string): MaitlandSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _MAITLAND_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getMaitlandSuburbSlugs(): string[] {
  return _MAITLAND_BUILT.map((s) => s.slug)
}

export function getMaitlandNearbySuburbs(currentSlug: string, limit = 3): MaitlandSuburb[] {
  const sorted = [..._MAITLAND_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
