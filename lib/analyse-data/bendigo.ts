/**
 * lib/analyse-data/bendigo.ts
 * Engine-computed suburb data for Bendigo, VIC.
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

export interface BendigoSuburbSeed {
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

export interface BendigoSuburb extends BendigoSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: BendigoSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: BendigoSuburbSeed[]): BendigoSuburb[] {
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

// ─── Bendigo suburb seeds ────────────────────────────────────────────────────

const BENDIGO_SEEDS: BendigoSuburbSeed[] = [
  {
    name: 'Bendigo CBD',
    slug: 'bendigo-cbd',
    factors: { demand: 8, rent: 4, competition: 7, seasonality: 4, tourism: 7 },
    why: [
      "Hargreaves Street Mall and the surrounding CBD precinct form Bendigo's commercial heart — high pedestrian traffic year-round from regional shoppers, government employees, and cultural visitors drawn by the Bendigo Art Gallery (300,000+ annual visitors).",
      "Tourism is 7/10: the Easter Festival alone draws 400,000+ visitors annually, creating a significant revenue spike for hospitality operators, and heritage tram tourism generates consistent visitor engagement across the rest of the year.",
      'Competition is 7/10 — the CBD is Bendigo\'s most competitive hospitality environment — but the precinct\'s scale means differentiated concepts find viable positions without the saturation pressure of a Sydney or Melbourne equivalent.',
    ],
  },
  {
    name: 'Golden Square',
    slug: 'golden-square',
    factors: { demand: 7, rent: 3, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      "Golden Square's southern suburban commercial strip serves a large, stable residential catchment — strong weekday lunch trade from local businesses and consistent weekend café demand from family demographics that shop within their own precinct.",
      'Rent is 3/10: materially lower than the CBD for comparable residential demand, creating favourable break-even economics for operators who correctly calibrate their offer to the local catchment.',
      'Low seasonality (2/10) reflects the residential permanence of the Golden Square demographic — trade is consistent across all 52 weeks with no meaningful tourist-driven variability.',
    ],
  },
  {
    name: 'Strathdale',
    slug: 'strathdale',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "Strathdale is Bendigo's most affluent northern residential suburb — a high-income professional demographic with above-average spending on specialty coffee, quality-casual dining, and premium retail creates demand that exceeds current supply.",
      'Competition is 4/10: notably low for the income profile — Strathdale is underserved by quality independent operators, creating a genuine gap for well-positioned concepts targeting the professional household demographic.',
      'Low seasonality (2/10) reflects the stable residential base — the professional demographic provides consistent year-round trade without the volatility of tourist-dependent or student-dependent markets.',
    ],
  },
  {
    name: 'Kangaroo Flat',
    slug: 'kangaroo-flat',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Kangaroo Flat's southern working-suburb commercial strip supports practical local trade — cafés, casual dining, and essential services perform reliably for operators who calibrate their offer to the working-family demographic.",
      'Rent is 3/10 and competition is 4/10 — the economics support independent operators who avoid premium positioning; value-to-mid concepts with strong community engagement build durable businesses here.',
      'Low seasonality (2/10) and low tourism (2/10) indicate a pure local market where repeat visits and community loyalty drive revenue rather than visitor capture or event-driven spikes.',
    ],
  },
  {
    name: 'Long Gully',
    slug: 'long-gully',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Long Gully's northern residential market offers the lowest entry costs in the greater Bendigo area — very low rent (2/10) and low competition (3/10) create viable economics for value-positioned operators serving the local community.",
      'Demand is 5/10 — sufficient for a well-run community-oriented café or essential services business, but the catchment size limits the revenue ceiling relative to Bendigo CBD or Strathdale.',
      'Low seasonality (2/10) reflects the residential stability of the catchment — operators who build genuine local loyalty find consistent trade without the volatility that tourist or student markets introduce.',
    ],
  },
  {
    name: 'Eaglehawk',
    slug: 'eaglehawk',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 3 },
    why: [
      "Eaglehawk functions as a satellite heritage town north of Bendigo — the suburb's distinct character and local identity support community-embedded businesses, with occasional heritage tourism uplift from visitors exploring Bendigo's goldfields history.",
      'Rent is 2/10 and competition is 3/10 — entry costs are among the lowest in the Bendigo market, but operators must correctly size their ambition to the catchment; Eaglehawk rewards community-first positioning over destination concepts.',
      'Tourism is 3/10 from heritage trail visitors who extend into Eaglehawk from the CBD precinct — weekends generate modest uplift, but the core trade base is the local residential community.',
    ],
  },
  {
    name: 'Epsom',
    slug: 'epsom',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Epsom's growing northern residential estate is delivering a young professional family demographic that is increasingly underserved by local hospitality — demand is outpacing supply as new residential development continues.",
      'Competition is 3/10: early operators in Epsom can establish brand loyalty before the suburb reaches commercial maturity, locking in the community relationship advantage that later entrants cannot replicate.',
      'Rent is 3/10 with low seasonality (2/10) — the financial profile supports break-even at lower revenue thresholds than the CBD, making Epsom viable for operators willing to build a local institution over 2–3 years.',
    ],
  },
  {
    name: 'Flora Hill',
    slug: 'flora-hill',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Flora Hill's La Trobe University campus precinct generates consistent student demand for affordable cafés, casual dining, and essential services — the 8,000+ student population creates a reliable daytime trade base that runs throughout semester.",
      'Rent is 3/10 — below the Bendigo average — making Flora Hill viable for operators who correctly calibrate their price point to the student demographic; premium positioning is less effective than value-to-mid quality concepts.',
      'Competition is 4/10: existing operators have not fully captured the student-professional demand gap around the campus — specialty coffee and quality food concepts find receptive early adopters in the La Trobe precinct.',
    ],
  },
  {
    name: 'Maiden Gully',
    slug: 'maiden-gully',
    factors: { demand: 6, rent: 3, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      "Maiden Gully is Bendigo's fastest-growing western suburb — sustained residential development has created a large professional family demographic with no quality independent hospitality to serve it, making this a genuine first-mover opportunity.",
      'Competition is 2/10: the lowest in the greater Bendigo market — an operator who enters in 2026 faces effectively no direct independent competition and can establish community loyalty before the suburb matures.',
      'Rent is 3/10 with low seasonality (2/10) and growing demand — the risk/return profile is among the most favourable in regional Victoria for operators who accept the 12–18 month community-building period before reaching full revenue.',
    ],
  },
]

const _BENDIGO_BUILT = buildSuburbs(BENDIGO_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getBendigoSuburbs(): BendigoSuburb[] {
  return _BENDIGO_BUILT
}

export function getBendigoSuburb(nameOrSlug: string): BendigoSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _BENDIGO_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getBendigoSuburbSlugs(): string[] {
  return _BENDIGO_BUILT.map((s) => s.slug)
}

export function getBendigoNearbySuburbs(currentSlug: string, limit = 3): BendigoSuburb[] {
  const sorted = [..._BENDIGO_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
