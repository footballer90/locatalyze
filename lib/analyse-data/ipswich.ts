/**
 * lib/analyse-data/ipswich.ts
 * Engine-computed suburb data for Ipswich, QLD.
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

export interface IpswichSuburbSeed {
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

export interface IpswichSuburb extends IpswichSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: IpswichSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: IpswichSuburbSeed[]): IpswichSuburb[] {
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

// ─── Ipswich suburb seeds ─────────────────────────────────────────────────────

const IPSWICH_SEEDS: IpswichSuburbSeed[] = [
  {
    name: 'Ipswich CBD',
    slug: 'ipswich-cbd',
    factors: { demand: 6, rent: 3, competition: 6, seasonality: 2, tourism: 4 },
    why: [
      "Ipswich's historic sandstone city centre along Brisbane Street carries genuine heritage character and a loyal local catchment — foot traffic concentrates around the council precinct, markets, and the Ipswich Art Gallery, creating consistent weekday and weekend trade windows.",
      'Rent is 3/10 — among the most affordable CBD-facing commercial strips in South East Queensland, giving independent operators a cost structure that is simply unavailable in Brisbane or the Gold Coast at equivalent foot traffic levels.',
      'Tourism is 4/10 from the Workshops Rail Museum and heritage architecture, adding a meaningful visitor layer beyond the residential catchment — the museum draws 120,000+ annual visitors who spill into the CBD dining precinct.',
    ],
  },
  {
    name: 'Riverlink',
    slug: 'riverlink',
    factors: { demand: 7, rent: 4, competition: 6, seasonality: 2, tourism: 3 },
    why: [
      "Riverlink Shopping Centre anchors the highest foot traffic in the Ipswich region — as the dominant retail destination for a catchment of 250,000+ residents, the precinct delivers reliable daily volume that suburban strips cannot replicate.",
      'Demand is 7/10 and seasonality is low (2/10), reflecting the shopping centre model: consistent trade across all 52 weeks without meaningful holiday dips or weather-driven variation.',
      'Competition is 6/10 from established food court and pad-site operators — differentiated concepts find viable positions, but undifferentiated food and beverage formats face direct chain comparison that compresses margins.',
    ],
  },
  {
    name: 'Booval',
    slug: 'booval',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      "Booval's inner suburb commercial strip along Limestone Street serves an established residential catchment that has traded here for decades — loyal local repeat business is the foundation, with limited reliance on destination or tourist trade.",
      'Rent is 3/10 and competition is 5/10 — a viable independent market where quality operators can build durable repeat business without fighting against chain-level incumbents or high-rent economics.',
      'Low seasonality (2/10) reflects the residential base: Booval trade is consistent and predictable, rewarding operators who invest in community relationships rather than seasonal marketing.',
    ],
  },
  {
    name: 'Goodna',
    slug: 'goodna',
    factors: { demand: 5, rent: 2, competition: 4, seasonality: 2, tourism: 1 },
    why: [
      "Goodna serves the western corridor of the Ipswich region with a value-market demographic — median household income constrains premium pricing but supports essential services, value food, and community-oriented businesses that do not require high per-transaction spend.",
      'Rent is 2/10: the lowest in the Ipswich dataset, creating viable break-even economics for operators who correctly calibrate their price point to the catchment rather than importing an inner-city margin model.',
      'Competition is 4/10 — fewer operators than the CBD precinct but sufficient existing supply to validate demand. Operators entering should focus on clear differentiation from existing value-food formats rather than competing head-on.',
    ],
  },
  {
    name: 'Springfield',
    slug: 'springfield',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      "Springfield is one of Australia's most successful master-planned cities — built from greenfield land since the 1990s, it has delivered a high-income professional demographic that expects quality hospitality at a volume that suburban Ipswich cannot offer. The precinct is the fastest-growing in the region.",
      'Demand is 7/10 driven by the Springfield Central retail and commercial precinct, University of Southern Queensland campus, and a growing residential base that is skewing younger and more professionally qualified than older Ipswich suburbs.',
      'Rent is 4/10 — Springfield offers suburban rent for a genuinely higher-income demographic than the CBD, making it one of the better risk-adjusted entry points in the Ipswich LGA for operators targeting the professional mid-market.',
    ],
  },
  {
    name: 'Ripley',
    slug: 'ripley',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      "Ripley is Ipswich's highest-growth new estate — a rapidly expanding residential precinct where hospitality supply has not kept pace with population growth, creating a genuine first-mover window for operators willing to build into a market that is still maturing.",
      'Competition is 3/10: unusually low for a growing residential area, meaning operators who establish brand loyalty now build the customer relationships before competitors arrive. The risk is that the catchment is still building density.',
      'Rent is 3/10 and demand is 6/10 — the economics support entry for patient operators, but those requiring immediate volume should understand that foot traffic depth will take 12–18 months to reach the levels a fully-established suburb provides.',
    ],
  },
  {
    name: 'Gatton',
    slug: 'gatton',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Gatton serves as the commercial gateway for the Lockyer Valley agricultural region — a service-town market where agricultural workers, rural residents, and University of Queensland Gatton campus staff create a stable but modest demand base.",
      'Rent is 2/10 and competition is 3/10 — Gatton offers the lowest-cost entry in the broader Ipswich region, suitable for operators who understand a rural service-town model with high loyalty, low volume, and thin competitive pressure.',
      'Tourism is 2/10 from Lockyer Valley heritage trails and the National Trust township character, adding occasional visitor trade without creating meaningful seasonal swings — trade is consistent but modest.',
    ],
  },
  {
    name: 'Brassall',
    slug: 'brassall',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      "Brassall is Ipswich's northern residential growth corridor — a genuinely under-served market where new housing development is increasing the resident population faster than hospitality supply is appearing, creating a supply gap that quality operators can capture.",
      'Competition is 3/10: very low for a suburb of this size, meaning operators who position correctly face minimal direct competition and can build loyal repeat customers from day one.',
      'Rent is 3/10 and demand is 6/10 — the fundamentals support independent entry, particularly for café and casual dining formats that serve the morning and lunch trade of a growing professional residential population.',
    ],
  },
]

const _IPSWICH_BUILT = buildSuburbs(IPSWICH_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getIpswichSuburbs(): IpswichSuburb[] {
  return _IPSWICH_BUILT
}

export function getIpswichSuburb(nameOrSlug: string): IpswichSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _IPSWICH_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getIpswichSuburbSlugs(): string[] {
  return _IPSWICH_BUILT.map((s) => s.slug)
}

export function getIpswichNearbySuburbs(currentSlug: string, limit = 3): IpswichSuburb[] {
  const sorted = [..._IPSWICH_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
