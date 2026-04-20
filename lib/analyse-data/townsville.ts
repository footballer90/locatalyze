/**
 * lib/analyse-data/townsville.ts
 * Engine-computed suburb data for Townsville, QLD.
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

export interface TownsvilleSuburbSeed {
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

export interface TownsvilleSuburb extends TownsvilleSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: TownsvilleSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: TownsvilleSuburbSeed[]): TownsvilleSuburb[] {
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

// ─── Townsville suburb seeds ──────────────────────────────────────────────────

const TOWNSVILLE_SEEDS: TownsvilleSuburbSeed[] = [
  {
    name: 'Townsville City',
    slug: 'townsville-city',
    factors: { demand: 7, rent: 5, competition: 7, seasonality: 3, tourism: 6 },
    why: [
      'Flinders Street Mall is the commercial heart of Townsville — a pedestrianised retail and dining strip that serves the CBD workforce, Magnetic Island ferry passengers, and visitors to the Strand waterfront, producing consistent weekday foot traffic and strong weekend evening trade.',
      'Competition is 7/10: the CBD has the highest operator density in North Queensland outside Cairns, requiring a clear point of difference — generic formats are outcompeted by established incumbents within the first 12 months.',
      'Tourism is 6/10 driven by Magnetic Island ferry traffic, cruise ship terminal arrivals, and the reef diving market — weekend visitor trade provides meaningful uplift above the weekday professional and student base.',
    ],
  },
  {
    name: 'North Ward',
    slug: 'north-ward',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 3, tourism: 5 },
    why: [
      'The Strand is Townsville\'s premier waterfront dining and café precinct — a 2.2km beachfront boulevard with strong pedestrian flow from the adjacent residential population, gym-goers, cyclists, and domestic tourists who specifically seek out the Strand for dining and leisure.',
      'Competition is 5/10: validated demand with established operators, but not saturated — quality concepts that match the relaxed beachside positioning find loyal repeat customers from The Ville Resort-Casino proximity and the affluent North Ward residential demographic.',
      "Lavarack Barracks, less than 3km away, contributes a steady defence force demand stream — ADF personnel and families are high-frequency hospitality consumers who form the backbone of Townsville's most reliable repeat-customer segment.",
    ],
  },
  {
    name: 'South Townsville',
    slug: 'south-townsville',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 3, tourism: 4 },
    why: [
      'South Townsville is emerging as a creative and brewery precinct — the Townsville Brewery and surrounding creative businesses are attracting a younger professional demographic that has historically been underserved by the CBD and North Ward strips.',
      'Rent is 4/10: below both the CBD and The Strand for a suburb with genuine growth momentum — operators who enter ahead of the full gentrification curve access lower occupancy costs than the precinct will sustain in 3–5 years.',
      'Competition is 4/10 and the demographic trajectory is positive — the creative and hospitality precinct dynamic rewards operators who build community identity rather than relying on passing foot traffic.',
    ],
  },
  {
    name: 'Kirwan',
    slug: 'kirwan',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 2, tourism: 1 },
    why: [
      "Kirwan is Townsville's major western suburban hub anchored by Willows Shopping Centre — a high-volume suburban retail and services market serving the largest residential catchment in the city's western growth corridor.",
      'Rent is 3/10: suburban pricing with strong foot traffic anchored by the shopping centre, making value-positioned hospitality and essential services viable at lower revenue thresholds than inner-city formats require.',
      'Seasonality is 2/10 — a pure residential suburban market with year-round stable demand; professional and defence families in the Kirwan-Thuringowa corridor create consistent trade that does not depend on tourism or seasonal patterns.',
    ],
  },
  {
    name: 'Aitkenvale',
    slug: 'aitkenvale',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 2, tourism: 1 },
    why: [
      'Aitkenvale is the southern suburban commercial strip serving a residential and light-industrial catchment — a stable, moderate-volume market with consistent demand from the surrounding residential areas and the Townsville Airport proximity.',
      'Rent is 3/10: low occupancy costs create viable economics for value-positioned operators and essential service businesses targeting the southern suburban workforce and family demographic.',
      'Competition is 4/10 and the catchment is predominantly residential — operators who build genuine local loyalty perform reliably, though the income profile limits premium pricing relative to North Ward and the CBD.',
    ],
  },
  {
    name: 'Thuringowa/Mount Louisa',
    slug: 'thuringowa-mount-louisa',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Thuringowa and Mount Louisa form Townsville\'s western growth corridor — a rapidly expanding residential area where new housing is arriving ahead of hospitality and retail supply, creating first-mover opportunities for operators willing to build before the demographic matures.',
      'Competition is 3/10: one of the least saturated suburban markets in Greater Townsville, where early entrants can establish brand loyalty without competing against entrenched incumbents in an established strip.',
      'Rent is 3/10 and the defence force demographic from nearby Lavarack Barracks adds a consistent demand layer — ADF families in the western suburbs are high-frequency consumers of casual dining and essential services.',
    ],
  },
  {
    name: 'Hyde Park',
    slug: 'hyde-park',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 3, tourism: 3 },
    why: [
      "Hyde Park is Townsville's inner-north residential suburb, within walking distance of James Cook University's main campus — the student and academic demographic creates reliable weekday café and casual dining demand that distinguishes it from purely suburban markets.",
      'Rent is 4/10: inner-suburb pricing with a more diverse demand base than outer residential areas, making Hyde Park viable for specialty coffee, casual dining, and student-facing concepts at manageable occupancy costs.',
      'Competition is 4/10 and the JCU proximity adds academic and administrative professionals to the residential base — operators who serve both the student and local resident demographic capture a more resilient demand profile than student-only or local-only positioning.',
    ],
  },
  {
    name: 'Magnetic Island',
    slug: 'magnetic-island',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 6, tourism: 8 },
    why: [
      "Magnetic Island is a tourism-only market accessible by a 25-minute ferry from Townsville CBD — the island's national park, beaches, and relaxed character attract high-spending domestic tourists and backpackers, with tourism at 8/10 making it one of Queensland's most tourism-dependent markets.",
      'Seasonality is 6/10: wet season (November to April) suppresses both tourist and backpacker volumes, and operators who do not maintain a loyal island resident base face sustained cash flow pressure during the low season.',
      'Competition is 4/10 within the Arcadia and Nelly Bay precincts — operators who match the island lifestyle positioning and build strong relationships with the small permanent community and ferry-dependent tourist trade find viable niches.',
    ],
  },
  {
    name: 'Hermit Park',
    slug: 'hermit-park',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 3, tourism: 3 },
    why: [
      "Hermit Park is an established inner suburb with a loyal local customer base, low commercial vacancy, and a professional-residential demographic that supports consistent weekday and weekend hospitality trade without the volatility of tourism-facing precincts.",
      'Rent is 4/10: inner Townsville pricing at a level that creates viable unit economics for quality-casual dining and specialty café concepts serving a reliable repeat customer base.',
      'Competition is 4/10 and demand has a stable residential anchor — operators who invest in community relationships and build genuine neighbourhood identity outperform those relying on passing traffic or destination marketing.',
    ],
  },
]

const _TOWNSVILLE_BUILT = buildSuburbs(TOWNSVILLE_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getTownsvilleSuburbs(): TownsvilleSuburb[] {
  return _TOWNSVILLE_BUILT
}

export function getTownsvilleSuburb(nameOrSlug: string): TownsvilleSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _TOWNSVILLE_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getTownsvilleSuburbSlugs(): string[] {
  return _TOWNSVILLE_BUILT.map((s) => s.slug)
}

export function getTownsvilleNearbySuburbs(currentSlug: string, limit = 3): TownsvilleSuburb[] {
  const sorted = [..._TOWNSVILLE_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
