/**
 * lib/analyse-data/rockhampton.ts
 * Engine-computed suburb data for Rockhampton, QLD.
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

export interface RockhamptonSuburbSeed {
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

export interface RockhamptonSuburb extends RockhamptonSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: RockhamptonSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: RockhamptonSuburbSeed[]): RockhamptonSuburb[] {
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

// ─── Rockhampton suburb seeds ─────────────────────────────────────────────────

const ROCKHAMPTON_SEEDS: RockhamptonSuburbSeed[] = [
  {
    name: 'The Range',
    slug: 'the-range',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      'The Range is the most affluent suburb in the Rockhampton region — household income is the highest in the CQ catchment, driven by professionals, management, and mining-sector executives who expect and pay for quality independent hospitality.',
      'Competition is 4/10: the professional demographic is underserved relative to its spending capacity, meaning well-positioned cafes and specialty food concepts find loyal repeat customers without fighting through a saturated market.',
      'Rent is 4/10 — materially lower than coastal Queensland equivalents for a comparable income demographic, giving operators a lower break-even threshold and a more forgiving first-year runway.',
      'Low seasonality (2/10) reflects the residential nature of the catchment — trade is consistent year-round with no significant tourism peaks or mining-cycle disruptions at the consumer level.',
      'Tourism at 3/10 adds weekend visitor exposure from CQUniversity parent visits and regional events without creating the volatility of a tourism-dependent market.',
    ],
  },
  {
    name: 'Rockhampton CBD',
    slug: 'rockhampton-cbd',
    factors: { demand: 6, rent: 3, competition: 6, seasonality: 3, tourism: 5 },
    why: [
      'Quay Street is the heritage heart of Rockhampton — the riverfront precinct draws a mix of office workers, regional visitors, and event-day crowds that create consistent weekday lunch demand and strong weekend foot traffic.',
      'Tourism is 5/10 from Fitzroy River foreshore events, heritage tourism (Rockhampton is home to Australia\'s most intact Victorian-era streetscape north of Melbourne), and RAAF Base visitor activity.',
      'Competition is 6/10 — the highest density in the region — requiring a clearly differentiated concept; undifferentiated cafes and casual dining on the main strip face direct comparison with established venues.',
      'Rent is 3/10: CBD commercial rents in Rockhampton are among the lowest for any Queensland city centre, making break-even achievable at modest revenue volumes.',
      'CQUniversity\'s 16,000+ student catchment and the government/professional services employment base create reliable weekday trade that suburban locations cannot replicate.',
    ],
  },
  {
    name: 'North Rockhampton',
    slug: 'north-rockhampton',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      'North Rockhampton anchors on Stockland Rockhampton — the largest shopping centre in Central Queensland — which generates the highest retail foot traffic volumes outside the CBD and creates reliable day-visit consumer spending.',
      'Competition is 5/10: the shopping centre gravity draws chains and major operators, but independent operators positioned on surrounding streets or within the centre\'s specialty tenancy mix find viable trade.',
      'Rent is 3/10 for surrounding commercial strips, though Stockland tenancies carry higher occupancy costs that require careful modelling — surrounding street positions offer lower rents with proximity to the centre\'s foot traffic.',
      'Low seasonality (2/10) reflects pure residential and suburban retail trade — there are no tourism peaks or seasonal employment swings affecting this catchment.',
      'The northern residential growth area has a growing family demographic that creates consistent demand for convenience food, casual dining, and essential services.',
    ],
  },
  {
    name: 'Park Avenue',
    slug: 'park-avenue',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Park Avenue is one of Rockhampton\'s established professional inner suburbs — a stable base of repeat trade from residents who have high loyalty to local operators they trust and visit regularly.',
      'Competition is 4/10: the suburb is served but not saturated, meaning quality independents find genuine customer acquisition opportunities without fighting for share in an overcrowded market.',
      'Strong repeat trade dynamics reward operators who invest in community building — the professional demographic visits cafes and casual dining 3–4 times weekly, delivering high lifetime customer value.',
      'Rent is 3/10 — low enough to make the economics work at modest revenue volumes, with a customer demographic that supports mid-to-premium pricing within a regional market context.',
      'Low seasonality (2/10) and low tourism (2/10) create a predictable trade environment — operators can model revenue conservatively and consistently hit targets without depending on external events.',
    ],
  },
  {
    name: 'Norman Gardens',
    slug: 'norman-gardens',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Norman Gardens is one of Rockhampton\'s southern growth corridors — a newer residential suburb with a growing family and young professional demographic that is currently underserved by quality independent hospitality.',
      'Competition is 4/10: the suburb has fewer operators than the demand trajectory suggests, creating a genuine first-mover window for well-positioned independents who establish community loyalty before the market matures.',
      'Rent is 3/10 — new development commercial tenancies are competitively priced to attract operators into the growing precinct, with lease terms structured to support independent businesses.',
      'The newer residential demographic skews toward families and young professionals with convenience-focused spending habits, creating reliable demand for casual dining, specialty coffee, and takeaway food.',
      'Low seasonality (2/10) reflects the residential nature of the catchment — growth in the area is population-driven rather than event or tourism dependent.',
    ],
  },
  {
    name: 'Frenchville',
    slug: 'frenchville',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Frenchville is a northern mid-market residential suburb with a stable, established community that supports local trade reliably — not a high-growth market, but a consistent one.',
      'Competition is 3/10: one of the lowest in the Rockhampton region, meaning first-mover operators face very limited direct competition and can build loyal customer bases with minimal acquisition cost.',
      'Rent is 3/10: low occupancy costs make the economics viable at modest revenue targets, reducing the risk profile for operators entering a lower-volume market.',
      'The established residential demographic values consistency and reliability over novelty — operators who become genuinely local institutions build durable repeat trade that sustains through regional economic cycles.',
      'Low seasonality (2/10) and low tourism (2/10) create a stable, predictable trade environment suitable for operators who prioritise steady income over peak-season windfalls.',
    ],
  },
  {
    name: 'Gracemere',
    slug: 'gracemere',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Gracemere is Rockhampton\'s western satellite town, historically tied to the mining and agricultural sectors — FIFO worker spending creates episodic demand that does not translate to the consistent trade patterns independent operators require.',
      'Competition is 3/10: low operator density reflects the genuine demand constraints of a small satellite catchment rather than an undiscovered opportunity.',
      'Rent is 2/10: the lowest in the region, which is the primary structural advantage — break-even is achievable at very low revenue volumes, making Gracemere viable for essential-service and convenience-focused concepts.',
      'FIFO worker demographics create unpredictable spending patterns — operators who model consistent daily trade will be disappointed; operators targeting the specific FIFO visit pattern can find a niche.',
      'Low seasonality (2/10) in the residential sense, but mining-cycle sensitivity creates a different form of volatility — regional economic downturns affect Gracemere trade more directly than urban Rockhampton.',
    ],
  },
  {
    name: 'Yeppoon',
    slug: 'yeppoon',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 4, tourism: 6 },
    why: [
      'Yeppoon is the Capricorn Coast\'s main beach town, 45km east of Rockhampton — a separate seasonal market with strong tourism demand from domestic holidaymakers, Rockhampton day-trippers, and Great Keppel Island gateway visitors.',
      'Tourism is 6/10: the beachside esplanade and surrounding hospitality precinct captures genuine visitor spend during Queensland school holidays and summer months, with measurable uplift above the local residential baseline.',
      'Seasonality is 4/10: winter and off-peak months see material softening in visitor trade — operators must build genuine local community loyalty from Yeppoon\'s resident population to sustain revenue through the quieter periods.',
      'Competition is 4/10: the tourist economy has attracted enough operators to validate the market, but the esplanade strip retains genuine gaps for differentiated concepts that serve both locals and visitors well.',
      'Rent is 3/10 for most commercial positions — lower than comparable beachside strips in larger Queensland cities, making the economics viable even at conservative year-round revenue projections.',
    ],
  },
]

const _ROCKHAMPTON_BUILT = buildSuburbs(ROCKHAMPTON_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getRockhamptonSuburbs(): RockhamptonSuburb[] {
  return _ROCKHAMPTON_BUILT
}

export function getRockhamptonSuburb(nameOrSlug: string): RockhamptonSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _ROCKHAMPTON_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getRockhamptonSuburbSlugs(): string[] {
  return _ROCKHAMPTON_BUILT.map((s) => s.slug)
}

export function getRockhamptonNearbySuburbs(currentSlug: string, limit = 3): RockhamptonSuburb[] {
  const sorted = [..._ROCKHAMPTON_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
