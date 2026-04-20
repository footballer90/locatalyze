/**
 * lib/analyse-data/bundaberg.ts
 * Engine-computed suburb data for Bundaberg, QLD.
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

export interface BundabergSuburbSeed {
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

export interface BundabergSuburb extends BundabergSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: BundabergSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: BundabergSuburbSeed[]): BundabergSuburb[] {
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

// ─── Bundaberg suburb seeds ───────────────────────────────────────────────────

const BUNDABERG_SEEDS: BundabergSuburbSeed[] = [
  {
    name: 'Bundaberg CBD',
    slug: 'bundaberg-cbd',
    factors: { demand: 6, rent: 3, competition: 6, seasonality: 3, tourism: 5 },
    why: [
      "Bourbong Street is Bundaberg's commercial heart — the main retail and dining strip draws a mix of local residents, agricultural workers from the surrounding region, and visitors drawn by the Bundaberg Brewed Drinks distillery tourism operation, which attracts 100,000+ annual visitors.",
      'Rent is 3/10 — Bundaberg CBD commercial rents are a fraction of coastal Queensland equivalents, creating break-even economics achievable at modest revenue thresholds. The challenge is that the catchment itself is modest: 75,000 people across the wider Bundaberg region.',
      'Tourism is 5/10 from the distillery, Mon Repos turtle centre proximity, and Fraser Coast gateway positioning — visitor trade adds meaningful uplift without creating the seasonal swings of a pure-tourism market.',
    ],
  },
  {
    name: 'Bargara',
    slug: 'bargara',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 4, tourism: 6 },
    why: [
      "Bargara is Bundaberg's coastal beach township — a growing residential community with genuine café culture appeal and a tourism layer driven by the Coral Sea and Mon Repos turtle nesting site, one of the world's most significant loggerhead nesting beaches.",
      'Tourism is 6/10 and seasonality is 4/10: turtle season (November–February) drives a meaningful visitor surge, but Bargara has enough permanent residents and sea-change demographics that off-season trade does not disappear entirely.',
      'Competition is 4/10 — lower than the CBD, with genuine whitespace for quality independent operators in the café and casual dining category. The demographic skews toward lifestyle-oriented sea-changers with higher-than-average discretionary spend.',
    ],
  },
  {
    name: 'Moore Park Beach',
    slug: 'moore-park-beach',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 5, tourism: 4 },
    why: [
      "Moore Park Beach is a northern coastal community with a small permanent population supplemented significantly by holiday visitors and caravan park occupants during peak season — a genuinely seasonal market that requires an honest assessment of off-season viability.",
      'Seasonality is 5/10: the shoulder and off-peak periods from April to September are materially softer, and operators who open based on school-holiday and summer projections need a clear winter strategy or supplementary income stream.',
      'Rent is 2/10 and competition is 2/10 — the lowest entry point in the Bundaberg dataset, suitable for operators who correctly model the seasonal revenue profile and price their offering to the holiday visitor demographic.',
    ],
  },
  {
    name: 'Avoca',
    slug: 'avoca',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Avoca is a northern residential suburb of Bundaberg with a stable local catchment of families and professionals — a pure local-market play with consistent but modest demand that suits operators who value reliability over scale.",
      'Low seasonality (2/10) and low competition (3/10) create a predictable operating environment. Revenue expectations should be calibrated to a suburban Bundaberg market rather than a coastal or CBD-level trade volume.',
      'Rent is 2/10 — very affordable entry, making Avoca viable for operators who understand that their customer acquisition strategy must be entirely community-driven rather than destination or tourism-based.',
    ],
  },
  {
    name: 'Kepnock',
    slug: 'kepnock',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      "Kepnock is a southern residential suburb anchored by Bundaberg's larger retail infrastructure — the local catchment supports essential food and service businesses that serve the immediate residential population without requiring a destination draw.",
      'Competition is 3/10 and demand is 5/10 — a stable, low-drama market where operators focused on community loyalty and repeat business can build durable trade. The demographic profile suits value-to-mid pricing rather than specialty positioning.',
      'Tourism is 1/10: Kepnock is a pure residential market with no meaningful visitor trade. Customer acquisition depends entirely on the local residential base, making community engagement the primary growth lever.',
    ],
  },
  {
    name: 'Millbank',
    slug: 'millbank',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Millbank occupies the southern commercial corridor of Bundaberg — a mixed residential and light industrial precinct where weekday lunch and essential services trade is the primary demand driver, supplemented by a growing residential population.",
      'Rent is 2/10 and competition is 3/10 — the commercial strip offers affordable entry for operators who can serve the local working population. Essential food service, lunch-focused café, and allied health formats perform reliably here.',
      'Low seasonality (2/10) reflects the industrial and residential employment base — trade is consistent across the year and not subject to the tourism-driven volatility of the coastal precincts.',
    ],
  },
  {
    name: 'Avenell Heights',
    slug: 'avenell-heights',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      "Avenell Heights is an eastern residential suburb with a loyal local customer base and very low competitive pressure — operators who establish here typically face limited direct competition and can build strong repeat business within a defined catchment.",
      'Competition is 2/10: the lowest in the Bundaberg dataset, creating a first-mover advantage for operators who correctly serve the residential demographic. The risk is that catchment size limits maximum revenue ceiling.',
      'Rent is 2/10 and seasonality is 2/10 — Avenell Heights suits operators who prioritise predictable, low-cost operations over high revenue potential, particularly those building a community-first business model.',
    ],
  },
]

const _BUNDABERG_BUILT = buildSuburbs(BUNDABERG_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getBundabergSuburbs(): BundabergSuburb[] {
  return _BUNDABERG_BUILT
}

export function getBundabergSuburb(nameOrSlug: string): BundabergSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _BUNDABERG_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getBundabergSuburbSlugs(): string[] {
  return _BUNDABERG_BUILT.map((s) => s.slug)
}

export function getBundabergNearbySuburbs(currentSlug: string, limit = 3): BundabergSuburb[] {
  const sorted = [..._BUNDABERG_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
