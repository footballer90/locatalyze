/**
 * lib/analyse-data/sunshine-coast.ts
 * Engine-computed suburb data for the Sunshine Coast, QLD.
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

export interface SunshineCoastSuburbSeed {
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

export interface SunshineCoastSuburb extends SunshineCoastSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: SunshineCoastSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: SunshineCoastSuburbSeed[]): SunshineCoastSuburb[] {
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

// ─── Sunshine Coast suburb seeds ──────────────────────────────────────────────

const SUNSHINE_COAST_SEEDS: SunshineCoastSuburbSeed[] = [
  {
    name: 'Noosa Heads',
    slug: 'noosa-heads',
    factors: { demand: 9, rent: 8, competition: 7, seasonality: 5, tourism: 9 },
    why: [
      "Noosa Heads is Australia's most exclusive coastal tourism destination — Hastings Street commands premium rent and delivers premium customer spend, with interstate and international visitors who budget significantly more per dining experience than any other Sunshine Coast market.",
      "Tourism is 9/10, creating the highest peak-season revenue ceiling on the Sunshine Coast — school holidays and long weekends produce exceptional trading periods, but the corollary is that operators pay a 40% rent premium for the Noosa brand association that must be earned back through premium pricing.",
      "Seasonality is 5/10: the off-season (February–April, school terms) sees tourist trade soften considerably, and operators without a loyal local customer base among Noosa Heads' permanent affluent residents face a meaningful winter revenue gap.",
      "Competition is 7/10 — Hastings Street has attracted nationally recognised operators who have raised the quality benchmark to a level where concept differentiation is not optional but structural — generic hospitality formats are outcompeted within 12 months.",
      "Demand is 9/10, reflecting both the tourism premium and the permanent resident base — Noosa Heads attracts high-net-worth permanent residents and lifestyle migrants who spend at premium hospitality levels year-round, partially offsetting the tourist seasonality risk.",
    ],
  },
  {
    name: 'Mooloolaba',
    slug: 'mooloolaba',
    factors: { demand: 8, rent: 6, competition: 7, seasonality: 4, tourism: 8 },
    why: [
      "Mooloolaba delivers the best tourism-to-local balance on the Sunshine Coast — a strong permanent residential base and a consistent family tourism market combine to produce more even year-round revenue than Noosa Heads, with a lower rent burden relative to the tourism premium.",
      "Tourism is 8/10: Mooloolaba Wharf and Esplanade produce very high tourist foot traffic across school holidays and long weekends, with a broad family demographic that spends consistently on casual dining, beach retail, and specialty food.",
      "Seasonality is 4/10: the stronger permanent resident base compared to Noosa Heads means the off-season revenue dip is more manageable — operators who build genuine local loyalty sustain 70–80% of peak-season revenue through quieter months.",
      "Competition is 7/10 — the Esplanade has attracted quality operators who have validated the premium market, but the competition is distributed across a longer strip than Noosa's Hastings Street, creating more viable entry positions for differentiated concepts.",
      "Rent is 6/10: meaningfully lower than Noosa Heads despite comparable tourism draw in peak season — the risk-adjusted economics are better for operators who want coastal tourism exposure without Noosa's rent premium.",
    ],
  },
  {
    name: 'Maroochydore',
    slug: 'maroochydore',
    factors: { demand: 8, rent: 5, competition: 7, seasonality: 3, tourism: 6 },
    why: [
      "Maroochydore is the Sunshine Coast's commercial capital — the Sunshine Coast Council headquarters, major retail centres, and a growing professional services cluster create consistent weekday foot traffic that coastal lifestyle markets cannot match.",
      "The Sunshine Coast City Centre (SCC) development is progressively delivering new commercial and residential density to Maroochydore's CBD core — operators who establish now capture the growth trajectory before rents reprice to reflect the maturing commercial precinct.",
      "Tourism is 6/10 from proximity to Mooloolaba and the Sunshine Coast Airport — visitor spillover adds a weekend demand layer beyond the local professional base without the extreme seasonal concentration of Noosa or Caloundra.",
      "Seasonality is 3/10: the commercial and professional employment base moderates the seasonal volatility typical of coastal markets — Maroochydore trade is more consistent across the year than any other Sunshine Coast market of comparable scale.",
      "Competition is 7/10 — a mature commercial centre with established operators across all categories; new entrants need a differentiated concept that the local professional catchment cannot already access from existing options.",
    ],
  },
  {
    name: 'Caloundra',
    slug: 'caloundra',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 4, tourism: 6 },
    why: [
      "Caloundra is the Sunshine Coast's southern gateway — a mature coastal town with a strong retiree and semi-retiree demographic that spends consistently on quality hospitality and retail, supplemented by visitor traffic from Brisbane and the Sunshine Coast hinterland.",
      "Tourism is 6/10: Caloundra's beaches and hinterland access attract consistent visitor numbers without the extreme peak concentration of Noosa — the tourism demand is spread more evenly through the year, producing a more stable revenue profile.",
      "The retiree affluence demographic is Caloundra's structural advantage — a customer base with above-average disposable income, strong willingness-to-pay for quality, and habitual local spending patterns that produce reliable repeat trade for well-positioned operators.",
      "Competition is 5/10: a validated market without saturation — independent operators can find viable positions in specialty coffee, quality-casual dining, and lifestyle retail without competing directly against an entrenched market leader.",
      "Rent is 4/10: affordable coastal commercial rents that reflect Caloundra's scale rather than its demographic quality — operators access a high-income catchment at rents that support sustainable unit economics for independents.",
    ],
  },
  {
    name: 'Buderim',
    slug: 'buderim',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      "Buderim is the Sunshine Coast's plateau residential hub — an elevated suburb above the coastal strip with one of the highest household incomes in the region, a stable professional and semi-retiree demographic, and consistent repeat trade that is not dependent on tourist volumes.",
      "Low seasonality (2/10) is Buderim's defining characteristic — the resident-only demand base produces year-round revenue consistency that coastal operators can only approximate, making Buderim one of the most predictable markets on the Sunshine Coast for financial planning.",
      "Demand is 7/10, driven entirely by high-income permanent residents rather than visitor flows — operators who build genuine community relationships benefit from exceptional repeat visit rates and word-of-mouth referral within a closely connected suburban community.",
      "Competition is 5/10: a viable market with established peers but genuine white space for quality independents — particularly in specialty coffee and premium casual dining, where the demographic quality supports pricing that generic operators cannot match.",
      "Rent is 4/10: significantly below coastal strip rents despite a demographic quality that would command premium rents in an inner-Melbourne or inner-Brisbane context — the gap between customer income and rent cost is Buderim's core operator opportunity.",
    ],
  },
  {
    name: 'Coolum Beach',
    slug: 'coolum-beach',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 4, tourism: 6 },
    why: [
      "Coolum Beach is the mid-coast lifestyle market — a growing permanent residential community combined with consistent visitor traffic creates a balanced demand profile that avoids the extreme seasonality of Noosa while still benefiting from the Sunshine Coast's tourism draw.",
      "Tourism is 6/10: Coolum's beach and proximity to the Noosa hinterland attract visitors who prefer a quieter alternative to Mooloolaba or Noosa — a customer profile that tends toward quality-casual over budget spending and produces good average transaction values.",
      "Seasonality is 4/10: moderately seasonal with school holiday peaks, but the growing permanent population moderates the off-season dip — operators who position for both tourist and local trade achieve year-round viability without Noosa-level risk.",
      "Competition is 5/10: a market with established operators but genuine entry positions for well-differentiated concepts — particularly in specialty food, quality coffee, and lifestyle retail categories that the local demographic actively seeks.",
      "Rent is 4/10: coastal commercial rents at a level that supports independent operator economics — the cost structure allows operators to build slowly and sustainably without the margin pressure of Noosa Heads or Mooloolaba premium positions.",
    ],
  },
  {
    name: 'Peregian Beach',
    slug: 'peregian-beach',
    factors: { demand: 7, rent: 4, competition: 3, seasonality: 4, tourism: 5 },
    why: [
      "Peregian Beach is the Sunshine Coast's most underrated operator opportunity — an upmarket surf village between Coolum and Noosa with genuinely low competition, a high-spending permanent and semi-permanent demographic, and Noosa-adjacent visitor traffic at a fraction of Hastings Street rent.",
      "Competition is 3/10: the lowest on the Sunshine Coast for a market of this demographic quality — independent operators who establish in Peregian find limited direct competition and can build first-mover brand recognition in a premium local market.",
      "Demand is 7/10, underpinned by a lifestyle-driven permanent residential base that spends at Noosa-comparable levels but shops locally — residents actively prefer quality independent operators over driving to Noosa or Maroochydore for comparable experiences.",
      "Tourism is 5/10: Peregian benefits from Noosa-corridor visitor traffic without the Noosa rent burden — visitors who want a quieter coastal experience choose Peregian, producing a mid-season demand layer that extends the viable trading year.",
      "Rent is 4/10: the most favourable rent-to-demographic ratio on the Sunshine Coast — premium customer quality at below-market commercial rents creates the strongest unit economics of any coastal market on the coast.",
    ],
  },
  {
    name: 'Nambour',
    slug: 'nambour',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Nambour is the Sunshine Coast hinterland's service town — a practical commercial hub that serves the broader hinterland residential and agricultural community with consistent, non-seasonal demand driven by essential services and value food rather than lifestyle spending.",
      "Rent is 3/10: the lowest commercial rents in the Sunshine Coast region, producing break-even thresholds that work for value-positioned operators and essential service businesses at revenue levels that coastal markets cannot sustain.",
      "Low seasonality (2/10) reflects a pure residential and services market — Nambour trade is entirely independent of tourist volumes or school holiday cycles, producing predictable year-round revenue for operators who correctly calibrate their concept.",
      "Competition is 4/10: a market with some established operators but genuine white space for quality independents who want to serve the hinterland community — particularly in specialty food and quality coffee, which the local market underserves relative to demand.",
      "Nambour's position as a regional hub with rail access to the coast makes it a viable entry market for operators who want Sunshine Coast proximity at significantly lower operating costs than any coastal location.",
    ],
  },
  {
    name: 'Sippy Downs',
    slug: 'sippy-downs',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Sippy Downs is the University of Sunshine Coast precinct — a growing suburban hub with a large student and academic population creating consistent weekday demand for affordable, quality-casual food and coffee that the current hospitality supply does not fully satisfy.",
      "Competition is 3/10: the hospitality supply in Sippy Downs remains thin relative to the University catchment — operators who establish here benefit from a captive student and staff population that provides predictable weekday volume.",
      "Rent is 3/10: suburban commercial rents that reflect the early-stage commercial development of the precinct — operators access a growing, educated demographic at rents significantly below any coastal market on the Sunshine Coast.",
      "The University of Sunshine Coast's ongoing campus expansion and residential development in adjacent Sippy Downs are progressively increasing the catchment density, making current entry conditions asymmetrically advantaged relative to the precinct's 5-year trajectory.",
      "Low seasonality (2/10) reflects a university-anchored demand base — while student numbers reduce during semester breaks, the permanent residential population and university staff provide a consistent demand floor throughout the year.",
    ],
  },
  {
    name: 'Palmview',
    slug: 'palmview',
    factors: { demand: 6, rent: 3, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      "Palmview is the Sunshine Coast's fastest-growing new suburb — a master-planned community between Mooloolaba and Caloundra that is delivering thousands of new dwellings and a young professional and family demographic that is currently almost entirely underserved by hospitality supply.",
      "Competition is 2/10: the lowest on the Sunshine Coast — operators who establish in Palmview face essentially no direct competition from established independents, creating the clearest first-mover opportunity in the region.",
      "Rent is 3/10: new-suburb commercial rents that reflect the early stage of the precinct's development — the demographic quality will continue to improve as the community matures, but current rents do not yet price in this trajectory.",
      "The Palmview master plan includes a town centre with dedicated commercial and hospitality precincts — operators who secure early positions in the town centre will build brand recognition among a growing resident base before the competitive landscape develops.",
      "Low seasonality (2/10) reflects a pure residential market without tourist dependency — Palmview operators build entirely on local habit and community relationships, which produces reliable repeat trade for operators who invest in customer relationships from day one.",
    ],
  },
]

const _SUNSHINE_COAST_BUILT = buildSuburbs(SUNSHINE_COAST_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getSunshineCoastSuburbs(): SunshineCoastSuburb[] {
  return _SUNSHINE_COAST_BUILT
}

export function getSunshineCoastSuburb(nameOrSlug: string): SunshineCoastSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _SUNSHINE_COAST_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getSunshineCoastSuburbSlugs(): string[] {
  return _SUNSHINE_COAST_BUILT.map((s) => s.slug)
}

export function getSunshineCoastNearbySuburbs(currentSlug: string, limit = 3): SunshineCoastSuburb[] {
  const sorted = [..._SUNSHINE_COAST_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
