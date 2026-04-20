/**
 * lib/analyse-data/toowoomba.ts
 * Engine-computed suburb data for Toowoomba, QLD.
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

export interface ToowoombaSuburbSeed {
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

export interface ToowoombaSuburb extends ToowoombaSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: ToowoombaSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: ToowoombaSuburbSeed[]): ToowoombaSuburb[] {
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

// ─── Toowoomba suburb seeds ───────────────────────────────────────────────────

const TOOWOOMBA_SEEDS: ToowoombaSuburbSeed[] = [
  {
    name: 'Toowoomba City',
    slug: 'toowoomba-city',
    factors: { demand: 7, rent: 4, competition: 7, seasonality: 3, tourism: 5 },
    why: [
      "Margaret Street and Ruthven Street form the commercial heart of Australia's largest inland non-capital city — a CBD serving a regional catchment of 250,000+ people across the Darling Downs who depend on Toowoomba for retail, hospitality, and professional services.",
      'Competition is 7/10, reflecting the concentration of established operators in the CBD core; differentiated concepts that serve the agricultural and resources professional demographic find viable positions, while undifferentiated formats face comparison with entrenched incumbents.',
      'Tourism is 5/10, spiking significantly in September during the Carnival of Flowers — operators who plan for the 400,000+ visitor surge during this period capture one of regional Queensland\'s most reliable annual revenue uplifts.',
    ],
  },
  {
    name: 'Newtown',
    slug: 'newtown',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      "Newtown is Toowoomba's most established independent café and dining strip — a precinct of boutique hospitality operators serving the city's professional and creative class who want Melbourne-calibre food culture without the Southeast Queensland prices.",
      'Competition is 5/10: enough peers to validate the market and signal quality positioning, but without the saturation that compresses margins in the CBD core — well-differentiated concepts find loyal repeat customers in this highly community-minded suburb.',
      'Low seasonality (2/10) reflects the stable professional residential base that underpins Newtown trade year-round; demand does not meaningfully fluctuate with school holidays or weather, rewarding operators who build genuine neighbourhood relationships.',
    ],
  },
  {
    name: 'East Toowoomba',
    slug: 'east-toowoomba',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      'East Toowoomba is the most affluent inner residential suburb in the city — a professional and established-family demographic with above-average willingness to pay for specialty coffee, premium casual dining, and quality independent retail.',
      'Competition is 4/10: notably low for a suburb with this income profile, creating genuine supply gaps for quality independent operators who correctly position for the demographic rather than competing on price.',
      'Ruthven Street South and the East Toowoomba café corridor benefit from low seasonality (2/10) and a residential base that maintains spending habits consistently across all 52 weeks of the year.',
    ],
  },
  {
    name: 'Darling Heights',
    slug: 'darling-heights',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Darling Heights is home to the University of Southern Queensland's main campus — the USQ student and academic population creates reliable weekday café, casual dining, and essential service demand that distinguishes this suburb from purely residential suburban markets.",
      'Rent is 3/10: university-precinct pricing that provides viable economics for student-facing concepts and affordable casual formats — entry point is meaningfully below the CBD and Newtown while drawing a concentrated foot traffic source.',
      'Competition is 4/10 and the student-academic demographic cycles consistently with the university calendar — operators who align their offer to the USQ community and supplement with local residential trade achieve stable year-round revenue.',
    ],
  },
  {
    name: 'Harristown',
    slug: 'harristown',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Harristown is a southern residential suburb with a loyal, working-family demographic that supports essential services, value hospitality, and community-oriented businesses — a reliable but volume-constrained market.',
      'Rent is 3/10 and competition is 3/10: one of the lowest-saturation markets in Greater Toowoomba, where first-mover operators who build genuine community relationships dominate without facing meaningful competitive pressure.',
      'Low tourism (1/10) and low seasonality (2/10) reflect a pure residential catchment — customer acquisition requires local marketing and community engagement rather than destination positioning or seasonal strategies.',
    ],
  },
  {
    name: 'Wilsonton',
    slug: 'wilsonton',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Wilsonton is the western suburban commercial strip serving a residential, agricultural-service, and light-industrial catchment — a moderate-volume market with stable demand from the surrounding working-family demographic.',
      'Rent is 3/10: low occupancy costs make break-even achievable at modest revenue thresholds for value-positioned operators — the catchment rewards reliability and affordability over premium concepts.',
      'Competition is 3/10 — a low-saturation market where a community-focused operator can become the go-to venue for the local resident and small-business owner demographic without fighting through a crowded field.',
    ],
  },
  {
    name: 'North Toowoomba',
    slug: 'north-toowoomba',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "James Street and the North Toowoomba precinct are experiencing growing residential development and a shift toward younger professional families — a market where demand is improving ahead of supply, creating early-mover opportunities.",
      'Rent is 3/10: suburban north Toowoomba pricing provides very competitive occupancy costs for the growing residential catchment — operators who enter ahead of the full demographic maturation capture below-market leases.',
      'Competition is 4/10 and demand trajectory is positive — the suburb rewards operators who build brand identity and community loyalty in a precinct that is still being discovered by the wider Toowoomba market.',
    ],
  },
  {
    name: 'Centenary Heights',
    slug: 'centenary-heights',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Centenary Heights is part of the southern Toowoomba growth corridor — newer residential development is bringing professional families who have high hospitality expectations but currently limited local supply to meet them.',
      'Competition is 3/10: low saturation in a growing catchment creates genuine first-mover opportunity for operators willing to establish before the demographic fully matures — early community investment pays long-term dividends.',
      'Rent is 3/10 and seasonality is 2/10 — low-cost, low-volatility market conditions that provide a stable base for operators focused on building consistent local trade rather than chasing tourism or event-driven revenue.',
    ],
  },
  {
    name: 'Highfields',
    slug: 'highfields',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Highfields is Toowoomba's fastest-growing northern suburb — a rapidly expanding residential area with new housing estates drawing professional families from the city who retain strong expectations for quality local hospitality and retail.",
      'Competition is 3/10: the hospitality supply in Highfields has not kept pace with population growth, creating a clear gap for cafés, casual dining, and specialty food concepts that serve the growing permanent resident base.',
      'Rent is 3/10: semi-rural northern Toowoomba pricing that provides very competitive occupancy economics — operators who enter during the growth phase lock in lease terms that will look underpriced as the suburb matures over the next 3–5 years.',
    ],
  },
]

const _TOOWOOMBA_BUILT = buildSuburbs(TOOWOOMBA_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getToowoombaSuburbs(): ToowoombaSuburb[] {
  return _TOOWOOMBA_BUILT
}

export function getToowoombaSuburb(nameOrSlug: string): ToowoombaSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _TOOWOOMBA_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getToowoombaSuburbSlugs(): string[] {
  return _TOOWOOMBA_BUILT.map((s) => s.slug)
}

export function getToowoombaNearbySuburbs(currentSlug: string, limit = 3): ToowoombaSuburb[] {
  const sorted = [..._TOOWOOMBA_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
