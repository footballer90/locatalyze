/**
 * Melbourne & Perth suburb seed data — engine-derived scores only.
 *
 * Factors (all 1–10):
 *   demand    = demandStrength  (higher = better)
 *   rent      = rentPressure    (higher = more expensive / worse)
 *   comp      = competitionDensity (higher = more saturated / worse)
 *   season    = seasonalityRisk (higher = more volatile / worse)
 *   tourism   = tourismDependency (higher = tourism-driven)
 */

import {
  assertNoManualScores,
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from './scoring-engine'

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface SuburbSeed {
  name: string
  slug: string
  factors: { demand: number; rent: number; comp: number; season: number; tourism: number }
  why: string[]
}

export interface SuburbModel extends SuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: SuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.comp,
    seasonalityRisk: f.season,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: SuburbSeed[]): SuburbModel[] {
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

// ─── Melbourne suburbs ────────────────────────────────────────────────────────

const MELBOURNE_SEEDS: SuburbSeed[] = [
  {
    name: 'Fitzroy',
    slug: 'fitzroy',
    factors: { demand: 10, rent: 4, comp: 3, season: 2, tourism: 7 },
    why: [
      'Demand 10/10: Smith Street and Gertrude Street set the national benchmark for independent hospitality density and customer quality.',
      'Competition 3/10: fewer than expected direct competitors relative to foot traffic; independent operators thrive here.',
    ],
  },
  {
    name: 'Richmond',
    slug: 'richmond',
    factors: { demand: 9, rent: 5, comp: 4, season: 2, tourism: 5 },
    why: [
      'Demand 9/10: Swan Street and Bridge Road draw high-spending residential and sporting-event crowds.',
      'Rent 5/10: materially lower than Fitzroy for comparable quality catchment.',
    ],
  },
  {
    name: 'South Yarra',
    slug: 'south-yarra',
    factors: { demand: 10, rent: 7, comp: 5, season: 2, tourism: 7 },
    why: [
      'Demand 10/10: Chapel Street premium strip attracts highest average spend per customer in Melbourne outside the CBD.',
      'Rent 7/10: high — requires strong unit economics to absorb $12,000–$20,000/month lease.',
    ],
  },
  {
    name: 'Brunswick',
    slug: 'brunswick',
    factors: { demand: 9, rent: 4, comp: 5, season: 2, tourism: 4 },
    why: [
      'Demand 9/10: Sydney Road creative corridor with a loyal independent retail and café culture.',
      'Rent 4/10: accessible — one of the best value inner-city strips in Melbourne.',
    ],
  },
  {
    name: 'Collingwood',
    slug: 'collingwood',
    factors: { demand: 9, rent: 5, comp: 6, season: 2, tourism: 6 },
    why: [
      'Demand 9/10: Smith Street spill-over from Fitzroy; arts and creative professional concentration drives strong weekend trade.',
      'Competition 6/10: elevated due to proximity to Fitzroy hospitality density.',
    ],
  },
  {
    name: 'Carlton',
    slug: 'carlton',
    factors: { demand: 9, rent: 5, comp: 5, season: 3, tourism: 6 },
    why: [
      'Demand 9/10: Lygon Street institution; university density drives consistent daytime demand.',
      'Tourism 6/10: international student and heritage tourism presence uplift restaurant revenue.',
    ],
  },
  {
    name: 'Northcote',
    slug: 'northcote',
    factors: { demand: 8, rent: 4, comp: 5, season: 2, tourism: 4 },
    why: [
      'Demand 8/10: High Street growth strip; younger professional demographic with above-average café spending.',
      'Rent 4/10: still accessible relative to inner suburbs; first-mover advantage persists.',
    ],
  },
  {
    name: 'St Kilda',
    slug: 'st-kilda',
    factors: { demand: 9, rent: 6, comp: 5, season: 4, tourism: 8 },
    why: [
      'Demand 9/10: coastal premium with strong tourist and residential mix.',
      'Seasonality 4/10: summer peaks 40% above winter; operators must plan for trough months.',
    ],
  },
  {
    name: 'Prahran',
    slug: 'prahran',
    factors: { demand: 9, rent: 6, comp: 5, season: 3, tourism: 7 },
    why: [
      'Demand 9/10: positioned between South Yarra and St Kilda; captures premium catchment at lower rents than its neighbours.',
      'Rent 6/10: moderate-high; secondary streets offer good value against Toorak Road frontage.',
    ],
  },
  {
    name: 'Hawthorn',
    slug: 'hawthorn',
    factors: { demand: 8, rent: 5, comp: 4, season: 2, tourism: 3 },
    why: [
      'Demand 8/10: professional enclave with one of the highest household incomes in Melbourne; underserved for premium hospitality.',
      'Competition 4/10: relatively thin supply for the demographic quality.',
    ],
  },
  {
    name: 'Camberwell',
    slug: 'camberwell',
    factors: { demand: 8, rent: 4, comp: 4, season: 2, tourism: 3 },
    why: [
      'Demand 8/10: Burke Road premium corridor with established professional base and strong weekend trade.',
      'Rent 4/10: accessible for the income quality of the catchment.',
    ],
  },
  {
    name: 'Preston',
    slug: 'preston',
    factors: { demand: 8, rent: 3, comp: 4, season: 3, tourism: 3 },
    why: [
      'Demand 8/10: High Street improving rapidly; early-mover advantage still available before rents catch demographics.',
      'Rent 3/10: very accessible — one of the best value inner-ring positions in Melbourne.',
    ],
  },
  {
    name: 'Box Hill',
    slug: 'box-hill',
    factors: { demand: 8, rent: 3, comp: 6, season: 3, tourism: 3 },
    why: [
      'Demand 8/10: best rent-to-foot-traffic ratio in Melbourne east; Asian market concentration is a structural advantage.',
      'Competition 6/10: established operators in the centre; differentiation required.',
    ],
  },
  {
    name: 'Footscray',
    slug: 'footscray',
    factors: { demand: 8, rent: 3, comp: 4, season: 3, tourism: 3 },
    why: [
      'Demand 8/10: rapid demographic shift brings professional population and higher spending power to a historically value-positioned market.',
      'Rent 3/10: accessible; early-mover operators are already benefiting.',
    ],
  },
  {
    name: 'Melbourne CBD',
    slug: 'melbourne-cbd',
    factors: { demand: 10, rent: 9, comp: 8, season: 3, tourism: 8 },
    why: [
      'Demand 10/10: maximum foot traffic, but $25,000+ rent requires extreme volume and execution precision.',
      'Rent 9/10 and competition 8/10: structural headwinds for independent operators post-hybrid work.',
    ],
  },
  {
    name: 'Southbank',
    slug: 'southbank',
    factors: { demand: 8, rent: 8, comp: 6, season: 3, tourism: 8 },
    why: [
      'Demand 8/10: tourist and office weekend trade strong, but weekday residential population is thinner than rent implies.',
      'Rent 8/10: high rents for a location with inconsistent daily traffic.',
    ],
  },
  {
    name: 'Docklands',
    slug: 'docklands',
    factors: { demand: 7, rent: 7, comp: 4, season: 4, tourism: 5 },
    why: [
      'Demand 7/10: planned precinct with residential-commercial imbalance; weekday office trade is real but evenings and weekends underperform significantly.',
      'Seasonality 4/10: outdoor events and seasonal programming create high variance.',
    ],
  },
  {
    name: 'Chadstone',
    slug: 'chadstone',
    factors: { demand: 8, rent: 6, comp: 7, season: 3, tourism: 4 },
    why: [
      'Demand 8/10: high overall, but Westfield Chadstone concentrates spend inside the mall; strip retail outside faces structural competition.',
      'Competition 7/10: dominant mall reduces independent viability outside its perimeter.',
    ],
  },
  {
    name: 'Dandenong',
    slug: 'dandenong',
    factors: { demand: 7, rent: 3, comp: 7, season: 4, tourism: 3 },
    why: [
      'Demand 7/10: multicultural strength, but lower average incomes constrain premium positioning.',
      'Competition 7/10: established multicultural food operators are entrenched.',
    ],
  },
  {
    name: 'Werribee',
    slug: 'werribee',
    factors: { demand: 6, rent: 3, comp: 4, season: 3, tourism: 3 },
    why: [
      'Demand 6/10: western growth corridor with real infrastructure investment but commercial maturity is years away.',
      'Rent 3/10: very low — upside for patient operators entering early.',
    ],
  },
  {
    name: 'Epping',
    slug: 'epping',
    factors: { demand: 6, rent: 3, comp: 6, season: 3, tourism: 2 },
    why: [
      'Demand 6/10: outer northern suburb; residential growth is real but commercial supply is catching up.',
      'Competition 6/10: established chains have already occupied the best positions.',
    ],
  },
  {
    name: 'Sunshine',
    slug: 'sunshine',
    factors: { demand: 6, rent: 3, comp: 5, season: 3, tourism: 3 },
    why: [
      'Demand 6/10: improving western suburb; lower household income limits premium pricing.',
      'Rent 3/10: very accessible; value-positioned concepts can achieve strong unit economics.',
    ],
  },
  {
    name: 'Narre Warren',
    slug: 'narre-warren',
    factors: { demand: 7, rent: 3, comp: 4, season: 3, tourism: 2 },
    why: [
      'Demand 7/10: southeast outer suburb with growing residential population and improving commercial strip.',
      'Rent 3/10: low — strong value play for operators targeting family demographics.',
    ],
  },
  {
    name: 'Pakenham',
    slug: 'pakenham',
    factors: { demand: 7, rent: 3, comp: 3, season: 3, tourism: 2 },
    why: [
      'Demand 7/10: fast-growing southeast growth corridor with underserved commercial strip.',
      'Competition 3/10: limited existing operators; genuine first-mover opportunity.',
    ],
  },
  {
    name: 'Cranbourne',
    slug: 'cranbourne',
    factors: { demand: 6, rent: 3, comp: 4, season: 3, tourism: 2 },
    why: [
      'Demand 6/10: outer southeast suburb; residential base growing but commercial activation lagging.',
      'Rent 3/10: low — appropriate for operators building a local base before expanding.',
    ],
  },
  {
    name: 'Hoppers Crossing',
    slug: 'hoppers-crossing',
    factors: { demand: 6, rent: 3, comp: 5, season: 3, tourism: 2 },
    why: [
      'Demand 6/10: outer western suburb; household incomes constrain premium hospitality concepts.',
      'Competition 5/10: moderate chain presence; independent operators need clear differentiation.',
    ],
  },
  {
    name: 'Frankston',
    slug: 'frankston',
    factors: { demand: 6, rent: 4, comp: 5, season: 4, tourism: 5 },
    why: [
      'Demand 6/10: gateway to the Mornington Peninsula; beach tourism creates seasonal trade but year-round revenue base is thin.',
      'Seasonality 4/10: strong summer / weak winter pattern requires careful cash-flow planning.',
    ],
  },
  {
    name: 'Broadmeadows',
    slug: 'broadmeadows',
    factors: { demand: 6, rent: 3, comp: 5, season: 4, tourism: 2 },
    why: [
      'Demand 6/10: outer northern suburb with lower household incomes and limited willingness-to-pay for premium concepts.',
      'Seasonality 4/10: northern suburbs have high temperature variance reducing year-round foot traffic reliability.',
    ],
  },
]

// ─── Perth suburbs ────────────────────────────────────────────────────────────

const PERTH_SEEDS: SuburbSeed[] = [
  {
    name: 'Subiaco',
    slug: 'subiaco',
    factors: { demand: 9, rent: 5, comp: 4, season: 2, tourism: 5 },
    why: [
      'Demand 9/10: Oxford Street is Perth\'s strongest inner commercial strip; affluent demographic ($105k avg household income) with consistent spending.',
      'Competition 4/10: manageable for quality operators; fewer chains than Northbridge.',
    ],
  },
  {
    name: 'Leederville',
    slug: 'leederville',
    factors: { demand: 8, rent: 4, comp: 4, season: 2, tourism: 4 },
    why: [
      'Demand 8/10: best rent-to-revenue ratio in inner Perth — 20% below Subiaco rents with comparable demographic quality.',
      'Rent 4/10: accessible — genuine value play for operators who find Subiaco rents challenging.',
    ],
  },
  {
    name: 'Mount Lawley',
    slug: 'mount-lawley',
    factors: { demand: 8, rent: 4, comp: 3, season: 2, tourism: 3 },
    why: [
      'Demand 8/10: Beaufort Street has the best entry timing in Perth — improving demographics, thin competition supply.',
      'Competition 3/10: genuinely underserved for the income quality of the catchment.',
    ],
  },
  {
    name: 'Northbridge',
    slug: 'northbridge',
    factors: { demand: 8, rent: 5, comp: 7, season: 3, tourism: 6 },
    why: [
      'Demand 8/10: highest volume location in Perth; strong hospitality culture and foot traffic.',
      'Competition 7/10: tight margins require strong differentiation; chains and established operators dominate.',
    ],
  },
  {
    name: 'Fremantle',
    slug: 'fremantle',
    factors: { demand: 7, rent: 5, comp: 5, season: 4, tourism: 8 },
    why: [
      'Demand 7/10: tourism uplift plus strong local demographic; heritage precinct drives weekend trade.',
      'Seasonality 4/10: tourist-driven revenue creates significant winter-summer variance.',
    ],
  },
  {
    name: 'Perth CBD',
    slug: 'perth-cbd',
    factors: { demand: 9, rent: 8, comp: 7, season: 3, tourism: 7 },
    why: [
      'Demand 9/10: Hay Street Mall and surrounds generate real foot traffic, but $10,000–$22,000/month rents require high-volume execution.',
      'Rent 8/10 + competition 7/10: structural challenge for independent operators.',
    ],
  },
  {
    name: 'Morley',
    slug: 'morley',
    factors: { demand: 7, rent: 3, comp: 5, season: 3, tourism: 2 },
    why: [
      'Demand 7/10: major northern suburb hub; Westfield Morley drives catchment but limits strip-retail upside.',
      'Rent 3/10: accessible — value positioning works here.',
    ],
  },
  {
    name: 'Armadale',
    slug: 'armadale',
    factors: { demand: 4, rent: 2, comp: 4, season: 3, tourism: 2 },
    why: [
      'Demand 4/10: median household income 26% below Perth median — premium café price points are a stretch purchase for the local demographic.',
      'Not viable for independent espresso bar operators; value-format services only.',
    ],
  },
  {
    name: 'Joondalup',
    slug: 'joondalup',
    factors: { demand: 6, rent: 3, comp: 8, season: 3, tourism: 2 },
    why: [
      'Demand 6/10: major northern hub, but oversaturated with established chains (The Coffee Club, Dome, Gloria Jean\'s).',
      'Competition 8/10: independent operators cannot compete on volume; rent-to-revenue for new entrants exceeds 22%.',
    ],
  },
  {
    name: 'Midland',
    slug: 'midland',
    factors: { demand: 4, rent: 2, comp: 5, season: 3, tourism: 2 },
    why: [
      'Demand 4/10: commercial vacancy on Great Northern Highway exceeds 18% — a clear signal of foot traffic below the threshold for new hospitality entrants.',
      'Vacancy rate this high means the market has already rejected the economics of operating there.',
    ],
  },
]

// ─── Compiled data ────────────────────────────────────────────────────────────

const MELBOURNE_SUBURBS: SuburbModel[] = buildSuburbs(MELBOURNE_SEEDS)
const PERTH_SUBURBS: SuburbModel[] = buildSuburbs(PERTH_SEEDS)

// ─── Melbourne exports ────────────────────────────────────────────────────────

export function getMelbourneSuburbs(): SuburbModel[] {
  return [...MELBOURNE_SUBURBS]
}

export function getMelbourneSuburb(name: string): SuburbModel | undefined {
  const key = name.toLowerCase().trim()
  return MELBOURNE_SUBURBS.find((s) => s.name.toLowerCase() === key)
}

// ─── Perth exports ────────────────────────────────────────────────────────────

export function getPerthSuburbs(): SuburbModel[] {
  return [...PERTH_SUBURBS]
}

export function getPerthSuburb(name: string): SuburbModel | undefined {
  const key = name.toLowerCase().trim()
  return PERTH_SUBURBS.find(
    (s) => s.name.toLowerCase() === key || s.slug.toLowerCase() === key,
  )
}

export function getPerthSuburbSlugs(): string[] {
  return PERTH_SUBURBS.map((s) => s.slug)
}
