/**
 * lib/analyse-data/cairns.ts
 * Engine-computed suburb data for Cairns, QLD.
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

export interface CairnsSuburbSeed {
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

export interface CairnsSuburb extends CairnsSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: CairnsSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: CairnsSuburbSeed[]): CairnsSuburb[] {
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

// ─── Cairns suburb seeds ──────────────────────────────────────────────────────

const CAIRNS_SEEDS: CairnsSuburbSeed[] = [
  {
    name: 'Cairns CBD',
    slug: 'cairns-cbd',
    factors: { demand: 7, rent: 6, competition: 7, seasonality: 5, tourism: 9 },
    why: [
      'Cairns CBD is the commercial and tourism gateway for 2M+ annual Great Barrier Reef visitors — the Esplanade, Shields Street, and Spence Street corridors attract a mix of international tourists, backpackers, and professionals that sustains strong daily foot traffic.',
      'Competition is 7/10, reflecting the density of hospitality and retail operators concentrated around the waterfront and CBD core; differentiated concepts find viable positions while undifferentiated formats face direct pressure from established chains and tour operators.',
      'Seasonality is 5/10: the wet season (November to April) suppresses visitor numbers by 30–40%, creating genuine revenue volatility — operators without a strong local repeat base and a clear off-peak strategy face cash flow pressure in the shoulder months.',
    ],
  },
  {
    name: 'Palm Cove',
    slug: 'palm-cove',
    factors: { demand: 8, rent: 7, competition: 5, seasonality: 5, tourism: 9 },
    why: [
      'Palm Cove commands the highest average nightly accommodation rates in Far North Queensland — a premium resort village with a concentrated international and domestic tourist demographic that spends well above regional averages on dining and retail.',
      'Competition is 5/10: the village strip is curated and boutique, meaning differentiated concepts that match the premium positioning find loyal visitors and limited direct competition from generic operators.',
      'Wet season (November to April) creates real seasonality risk — operators who rely solely on tourist trade without capturing the affluent residential base face significant revenue softness outside the dry season peak.',
    ],
  },
  {
    name: 'Port Douglas',
    slug: 'port-douglas',
    factors: { demand: 8, rent: 6, competition: 5, seasonality: 5, tourism: 9 },
    why: [
      'Macrossan Street is one of Queensland\'s most iconic tropical tourist strips — a compact, walkable precinct of restaurants, boutiques, and tour operators drawing high-spending domestic and international visitors who are specifically choosing a premium FNQ experience.',
      'Competition is 5/10 across Macrossan Street, where the strip rewards operators who match the destination positioning — quality-casual dining, specialty retail, and experience-led concepts outperform generic formats at every price point.',
      'Japanese and Chinese visitor demographics, together with high-income domestic leisure travellers, create a spending profile considerably above Cairns CBD averages — premium pricing is genuinely supported by the market.',
    ],
  },
  {
    name: 'Clifton Beach',
    slug: 'clifton-beach',
    factors: { demand: 7, rent: 5, competition: 4, seasonality: 5, tourism: 7 },
    why: [
      'Clifton Beach sits in the Northern Beaches growth corridor — a residential-tourist mix suburb where demand is growing as new housing estates bring professional families from Cairns who retain strong expectations for quality local hospitality.',
      'Competition is 4/10: the local hospitality supply has not kept pace with residential growth, creating a genuine gap for cafés, casual dining, and specialty food concepts that serve the permanent resident base plus holiday visitor traffic.',
      'Tourism is 7/10 from the beachside location and proximity to Palm Cove — weekend visitor traffic adds meaningful uplift beyond the residential trade base, supporting operators who build dual income streams.',
    ],
  },
  {
    name: 'Smithfield',
    slug: 'smithfield',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 3, tourism: 5 },
    why: [
      'Smithfield is the northern Cairns commercial hub anchored by Smithfield Shopping Centre, the northern campus of James Cook University, and Skyrail Rainforest Cableway — creating a mixed demand base of students, local residents, and tourists passing through to the Kuranda region.',
      'Rent is 4/10: commercial rents in the Smithfield corridor are significantly below the Cairns CBD and Palm Cove, providing viable economics for operators targeting the student, residential, and passing-tourist market segments.',
      'Seasonality is 3/10 compared to more tourism-dependent suburbs — the JCU and residential anchors provide year-round demand that buffers the wet season softness affecting more tourist-facing precincts.',
    ],
  },
  {
    name: 'Gordonvale',
    slug: 'gordonvale',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 3, tourism: 3 },
    why: [
      'Gordonvale is a southern sugarcane town with a stable, loyal local community that supports essential services and value-positioned hospitality — foot traffic is lower than coastal suburbs but consistent year-round among established residents.',
      'Rent is 3/10: among the lowest viable commercial rents in the Greater Cairns region, making break-even achievable at moderate revenue thresholds for operators who correctly calibrate their price point to the catchment.',
      'Competition is 3/10 and tourism is limited — operators who build genuine community relationships and serve the local demographic reliably outperform those who enter expecting broader catchment demand.',
    ],
  },
  {
    name: 'Mareeba',
    slug: 'mareeba',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 3, tourism: 3 },
    why: [
      'Mareeba is the Atherton Tablelands gateway with a growing agricultural tourism market — tourism spillover from the Kuranda scenic railway and Atherton Tablelands day-trippers adds weekend demand beyond the local farming and residential community.',
      'Rent is 2/10: the lowest commercial rents in the broader Cairns region make Mareeba viable for operators seeking very low fixed-cost structures, particularly those serving the rural community and passing tourist trade.',
      'Competition is 2/10 — a low-saturation market where a well-positioned operator can become the go-to venue for both the local community and visiting tourists without facing entrenched incumbents.',
    ],
  },
  {
    name: 'Kuranda',
    slug: 'kuranda',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 6, tourism: 8 },
    why: [
      'Kuranda is Australia\'s most visited rainforest village, with Skyrail Rainforest Cableway and the Kuranda Scenic Railway delivering high volumes of day-trippers — tourism is 8/10, making this one of the most tourism-dependent markets in Queensland outside Cairns CBD.',
      'Seasonality is 6/10 — wet season (November to April) suppresses tourist volumes significantly, and operators whose revenue is almost entirely tourism-driven face genuine hardship in the off-peak months; a strong local community following is essential to sustain winter cash flow.',
      'Competition is 4/10 within the village market strip, where established souvenir and hospitality operators hold first-mover advantage — differentiated food and beverage concepts targeting the day-tripper demographic find viable positions.',
    ],
  },
  {
    name: 'Edge Hill',
    slug: 'edge-hill',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 3, tourism: 5 },
    why: [
      'Edge Hill is Cairns\'s most affluent inner suburb, home to professionals and academics from James Cook University and Cairns Hospital — the local demographic supports specialty coffee, quality-casual dining, and independent retail at a level uncommon in FNQ beyond Palm Cove.',
      'Rent is 4/10: significantly below the Cairns CBD and coastal strips for a comparable demographic quality, making Edge Hill the strongest value-entry market for operators seeking professional-residential demand with manageable occupancy costs.',
      'Tourism is 5/10 from proximity to the Cairns Botanic Gardens and the Crystal Cascades recreational area — weekend visitor traffic supplements the strong weekday professional and residential trade base.',
    ],
  },
  {
    name: 'Trinity Beach',
    slug: 'trinity-beach',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 5, tourism: 6 },
    why: [
      'Trinity Beach is a Northern Beaches suburb with a growing residential base and steady tourist traffic — positioned between Cairns and Palm Cove, it benefits from beachside lifestyle appeal without the premium rent pressure of the more established resort villages.',
      'Competition is 4/10: the suburb is underserved relative to its growing population, and operators who enter ahead of the demand curve can build strong local loyalty before the market matures.',
      'Seasonality is 5/10 — wet season impacts are real but moderated by a stronger permanent residential base than more tourism-dependent Northern Beaches suburbs; operators with a community-first positioning maintain more consistent year-round revenue.',
    ],
  },
]

const _CAIRNS_BUILT = buildSuburbs(CAIRNS_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getCairnsSuburbs(): CairnsSuburb[] {
  return _CAIRNS_BUILT
}

export function getCairnsSuburb(nameOrSlug: string): CairnsSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _CAIRNS_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getCairnsSuburbSlugs(): string[] {
  return _CAIRNS_BUILT.map((s) => s.slug)
}

export function getCairnsNearbySuburbs(currentSlug: string, limit = 3): CairnsSuburb[] {
  const sorted = [..._CAIRNS_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
