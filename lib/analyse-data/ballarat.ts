/**
 * lib/analyse-data/ballarat.ts
 * Engine-computed suburb data for Ballarat, VIC.
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

export interface BallaratSuburbSeed {
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

export interface BallaratSuburb extends BallaratSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: BallaratSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: BallaratSuburbSeed[]): BallaratSuburb[] {
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

// ─── Ballarat suburb seeds ────────────────────────────────────────────────────

const BALLARAT_SEEDS: BallaratSuburbSeed[] = [
  {
    name: 'Ballarat Central',
    slug: 'ballarat-central',
    factors: { demand: 8, rent: 4, competition: 7, seasonality: 4, tourism: 7 },
    why: [
      "Sturt Street and the Bridge Mall precinct form Ballarat's commercial heart — heritage streetscape, consistent foot traffic from regional shoppers, government workers, and Sovereign Hill visitors who extend their stay into the city centre.",
      'Tourism is 7/10 from Sovereign Hill (700,000+ annual visitors), the Art Gallery of Ballarat, and the Ballarat Botanical Gardens — the central strip captures meaningful visitor spend that suburban locations cannot access.',
      'Competition is 7/10 and reflects the concentration of hospitality on Sturt Street — differentiated concepts find viable positions, but undifferentiated operators compete directly against long-established venues.',
    ],
  },
  {
    name: 'Bakery Hill',
    slug: 'bakery-hill',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 3, tourism: 5 },
    why: [
      "Bakery Hill's eastern CBD extension carries genuine goldfields character — the built heritage attracts Sovereign Hill spillover visitors and a creative-professional demographic that has established a growing café scene distinct from the Sturt Street mainstream.",
      'Competition is 5/10: fewer operators than Ballarat Central at comparable rents, creating real positioning opportunities for specialty coffee and quality-casual concepts that want heritage ambiance without central strip competition pressure.',
      'Tourism contributes 5/10 uplift from proximity to the CBD attractions — weekend visitor trade supplements the stable professional and student base without the full seasonality dependency of purely tourist-facing locations.',
    ],
  },
  {
    name: 'Ballarat East',
    slug: 'ballarat-east',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 3, tourism: 4 },
    why: [
      "Ballarat East's inner-suburb heritage residential character supports a loyal local base — the demographic is professional and community-oriented, providing consistent repeat trade for operators who invest in neighbourhood identity.",
      'Rent is 3/10: among the lowest in the Ballarat inner ring, creating genuinely favourable break-even economics for operators calibrated to the local demographic rather than seeking tourist volume.',
      'Tourism contribution of 4/10 comes from proximity to the Eureka Centre and heritage walking routes — weekends generate meaningful visitor foot traffic that supplements local resident demand without full tourist-trade dependency.',
    ],
  },
  {
    name: 'Sebastopol',
    slug: 'sebastopol',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Sebastopol's southern residential catchment is large and underserved by quality independent hospitality — the suburb's density supports café and casual dining trade that relies on repeat local visits rather than destination positioning.",
      'Low seasonality (2/10) reflects the stable residential demographic — trade is predictable and consistent year-round, which suits operators who value reliability over peak-season upside.',
      'Rent is 3/10 with low competition (4/10), creating one of the better value propositions in the Ballarat market for operators focused on community-embedded local trade rather than visitor capture.',
    ],
  },
  {
    name: 'Mount Pleasant',
    slug: 'mount-pleasant',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 3 },
    why: [
      "Mount Pleasant's growing northern residential base represents an emerging opportunity — newer housing stock is attracting professional families who bring Melbourne café and dining expectations to a suburb where hospitality supply has not yet caught up.",
      'Competition is 3/10: one of the lowest in the Ballarat market, meaning first-mover operators can establish brand loyalty before the precinct matures and competition arrives.',
      'Rent is 3/10 with low seasonality (2/10) — the economics are favourable for operators building a loyal local base, with lower break-even thresholds than the heritage commercial strips.',
    ],
  },
  {
    name: 'Wendouree',
    slug: 'wendouree',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "Wendouree's western commercial strip anchored by Stockland Ballarat provides reliable retail and hospitality foot traffic — the shopping centre creates consistent consumer activity that benefits adjacent independent operators.",
      'Competition is 4/10 on the secondary strips away from the Stockland anchors — independent operators who avoid direct comparison with the centre\'s food court find a viable residential catchment that supports specialty positioning.',
      'Low seasonality (2/10) reflects the stable west-Ballarat residential demographic — weekday lunch and weekend café trade are consistent through all four seasons.',
    ],
  },
  {
    name: 'Delacombe',
    slug: 'delacombe',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Delacombe's southern new estate represents the lowest-cost entry point in the Ballarat market — very low rent (2/10) and low competition (3/10) create viable economics for operators calibrated to a young family demographic.",
      'Demand is 5/10 and growing as residential development continues — operators who enter early capture community loyalty before the suburb reaches full population maturity.',
      'Low seasonality (2/10) and low tourism (2/10) indicate a pure residential-local market where community building and consistent quality drive retention rather than destination marketing.',
    ],
  },
  {
    name: 'Alfredton',
    slug: 'alfredton',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Alfredton is Ballarat's fastest-growing suburb — sustained residential development is delivering a growing professional family demographic that increasingly supports quality café and casual dining within their own precinct rather than travelling to the city centre.",
      'Competition is 3/10: the hospitality supply gap is genuine and growing faster than new operators are entering — first-mover advantage is available in 2026 for operators willing to build a business in a suburb with strong population growth trajectory.',
      'Rent is 3/10 with low seasonality (2/10) — the financial profile is among the most favourable in Greater Ballarat for operators seeking to build a loyal local base with low break-even requirements.',
    ],
  },
  {
    name: 'Smythesdale',
    slug: 'smythesdale',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 3 },
    why: [
      "Smythesdale operates as a heritage tourism satellite rather than a conventional suburban commercial market — visitor trade from Ballarat's goldfields heritage tourism provides seasonal uplift, but the local residential base is small.",
      'Demand is 4/10 and genuinely limited by population catchment size — operators entering this market must have a clear tourism-oriented concept with seasonal planning, as local trade alone cannot sustain most business models.',
      'Rent is 2/10 and competition is 2/10 — the low-entry economics work for operators with a heritage-tourism niche concept, but the catchment ceiling constrains maximum revenue potential relative to Ballarat\'s suburban markets.',
    ],
  },
]

const _BALLARAT_BUILT = buildSuburbs(BALLARAT_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getBallaratSuburbs(): BallaratSuburb[] {
  return _BALLARAT_BUILT
}

export function getBallaratSuburb(nameOrSlug: string): BallaratSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _BALLARAT_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getBallaratSuburbSlugs(): string[] {
  return _BALLARAT_BUILT.map((s) => s.slug)
}

export function getBallaratNearbySuburbs(currentSlug: string, limit = 3): BallaratSuburb[] {
  const sorted = [..._BALLARAT_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
