/**
 * lib/analyse-data/shepparton.ts
 * Engine-computed suburb data for Shepparton, VIC.
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

export interface SheppartonSuburbSeed {
  name: string
  slug: string
  state: string
  factors: {
    demand: number
    rent: number
    competition: number
    seasonality: number
    tourism: number
  }
  why: string[]
}

export interface SheppartonSuburb extends SheppartonSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: SheppartonSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: SheppartonSuburbSeed[]): SheppartonSuburb[] {
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

// ─── Shepparton suburb seeds ──────────────────────────────────────────────────

const SHEPPARTON_SEEDS: SheppartonSuburbSeed[] = [
  {
    name: 'Shepparton CBD',
    slug: 'shepparton-cbd',
    state: 'VIC',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 2, tourism: 3 },
    why: [
      'High Street is the primary retail and dining spine of northern Victoria — the highest concentration of foot traffic in the Goulburn Valley, anchored by the Eastbank Centre and Maude Street Mall, which draw shoppers from a 100km catchment across Shepparton, Mooroopna, Tatura, and surrounding towns.',
      'Competition is 6/10: the CBD has a mature operator mix of established cafes, restaurants, and retailers that have built local loyalty, meaning new entrants need clear differentiation to capture market share rather than simply relying on location alone.',
      'Rent is 5/10 for a regional capital: High Street strip rents are materially lower than Melbourne or Geelong equivalents but carry a genuine premium over fringe suburbs — operators should model $2,500 to $5,000 per month for viable strip tenancies depending on the specific position.',
      'The hospital and government precinct drives a professional lunchtime and after-work trade that is consistent year-round — GV Health, council offices, and service-sector employers create a reliable weekday customer base that supplements weekend retail and dining traffic.',
      'Seasonality is 2/10: the CBD serves a genuinely year-round trade base. The Goulburn Valley fruit harvest season (February to April) creates a modest uplift from itinerant agricultural workers, but this does not significantly move the needle for most operators.',
    ],
  },
  {
    name: 'Mooroopna',
    slug: 'mooroopna',
    state: 'VIC',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Mooroopna sits directly across the Goulburn River from Shepparton CBD, connected by the Mooroopna Bridge — a residential suburb of approximately 7,000 people that functions as an overflow residential market for the broader Shepparton urban area, with a tight local commercial strip on Melville Road.',
      'Competition is 3/10: the suburb has a small number of long-established local operators, leaving genuine space for quality-focused concepts that serve the residential catchment without competing directly in the Shepparton CBD market.',
      'Rent is 3/10: Mooroopna commercial rents are significantly below CBD levels, making it an accessible entry point for operators who want to test a concept or serve a residential market at lower financial risk than the main strip.',
      'The multicultural demographic character of Mooroopna — with significant Koori and Pacific Islander communities — creates demand for inclusive, community-oriented hospitality concepts that reflect the actual diversity of the suburb rather than defaulting to mainstream formats.',
      'Low seasonality (2/10) reflects a stable residential customer base. While the harvest season brings some agricultural workers to the broader region, the Mooroopna residential market trades on a consistent year-round pattern driven by families and local residents.',
    ],
  },
  {
    name: 'Kialla',
    slug: 'kialla',
    state: 'VIC',
    factors: { demand: 6, rent: 3, competition: 2, seasonality: 1, tourism: 1 },
    why: [
      'Kialla is the fastest-growing residential corridor in the Shepparton urban area — new estate development along Archer Road and Balaclava Road has added thousands of families over the past decade, creating a large and underserved local catchment that currently travels to the CBD or Maude Street for food and hospitality services.',
      'Competition is 2/10: genuinely low, reflecting the early-stage commercial development of a growing residential area rather than a market without demand — first-mover operators who establish quality concepts capture the community loyalty before the market fills.',
      'Rent is 3/10: new development commercial tenancies in Kialla are priced competitively to attract operators into the emerging precinct, and lease terms typically reflect the early-stage trade environment rather than the established demand ceiling.',
      'The Kialla demographic is young families — couples in their 30s and 40s with school-age children who value proximity, child-friendly environments, and quality casual dining within their suburb. They currently make the trip to Shepparton CBD for the hospitality experience they want but cannot find locally.',
      'Seasonality is 1/10: the pure residential trade environment means revenue is almost entirely determined by local community loyalty, with no seasonal variation — the trade pattern is consistent, predictable, and dependent entirely on serving the resident base well.',
    ],
  },
  {
    name: 'Shepparton North',
    slug: 'shepparton-north',
    state: 'VIC',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Shepparton North encompasses the industrial estate along Doyles Road and the mixed residential fringe north of the CBD — a working-class suburb where the primary demand driver is a blue-collar workforce needing practical, value-for-money food and service concepts rather than premium hospitality.',
      'The industrial precinct generates reliable weekday trade from workers at SPC Ardmona, Murray Goulburn, and a range of light industrial operators — breakfast and lunch trade from a workforce demographic that values speed, quality, and price accessibility over atmosphere or experience.',
      'Competition is 3/10: the northern industrial and residential fringe is underserved by quality food operators, with most existing supply being low-quality convenience options — there is genuine space for a well-run cafe or lunch spot that correctly calibrates to the blue-collar market.',
      'Rent is 3/10: the fringe location and industrial character of the precinct keep commercial rents well below CBD levels, making the economics viable for operators who can achieve sufficient volume from the workforce catchment.',
      'Seasonality is 2/10: the industrial workforce drives consistent weekday demand, and the residential catchment provides a modest but stable community customer base — the main risk is that weekend trade is limited by the lower residential density compared to Kialla or the CBD surrounds.',
    ],
  },
  {
    name: 'Shepp East',
    slug: 'shepp-east',
    state: 'VIC',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 1, tourism: 2 },
    why: [
      'Shepp East encompasses the GV Health hospital precinct and the broader professional residential corridor east of the CBD — the primary professional catchment in Shepparton, with nurses, doctors, allied health workers, and administrators generating consistent lunchtime and before/after-shift demand.',
      'GV Health is the principal health service for the Goulburn Valley and employs over 2,000 staff — a reliable, year-round, shift-working customer base that creates morning, midday, and evening demand windows that conventional retail-oriented operators often miss.',
      'Competition is 4/10: the hospital precinct has some established operators, but the shift-work demand pattern (7-day trading, early starts, late finishes) creates specific supply gaps that standard cafe and retail hours do not serve — extended-hours concepts have a clear competitive opportunity.',
      'Rent is 4/10: the proximity to the hospital and the professional residential precinct carries a modest premium over the outer suburbs, but remains well below CBD strip rates — operators can access a high-quality catchment at reasonable occupancy costs.',
      'Seasonality is 1/10: the hospital catchment is entirely independent of agricultural, tourism, or weather cycles — it is the single most consistent year-round demand location in the Shepparton urban area, driven by the fixed employment base of the health service.',
    ],
  },
  {
    name: 'Grahamvale',
    slug: 'grahamvale',
    state: 'VIC',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      'Grahamvale is a peri-urban suburb on the outer eastern edge of Shepparton — a semi-rural residential area with small farms, lifestyle blocks, and newer housing estates that creates a scattered catchment with modest aggregate demand for hospitality and retail services.',
      'Competition is 2/10: very low operator density reflects both the genuine scale limitations of a dispersed peri-urban market and the relative underservicing of the local community — but the low competition is accurate, and the demand ceiling is also genuinely modest.',
      'Rent is 2/10: the lowest in the Shepparton urban area, making break-even achievable at quite low revenue volumes for operators who correctly size their concept to the catchment rather than projecting CBD-scale demand onto a semi-rural location.',
      'The semi-rural demographic values community, local provenance, and connection — farm produce, artisan food, and community-oriented concepts align well with the lifestyle character of Grahamvale, particularly if they can serve as a destination rather than relying solely on passing trade.',
      'Seasonality is 2/10: the residential and rural character creates a stable trade pattern with no significant tourist or seasonal uplift — the modest but consistent local demand is the foundation of any viable concept in this location.',
    ],
  },
  {
    name: 'Tatura',
    slug: 'tatura',
    state: 'VIC',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Tatura is a small agricultural service town 20km west of Shepparton, primarily serving the dairy and mixed-farming community of the western Goulburn Valley — a genuine rural town with a modest resident population and a hospitality market constrained by catchment scale rather than concept quality.',
      'Competition is 2/10: very low operator density reflects the real limitations of a small rural market — there are gaps in the local food supply, but the revenue ceiling for any single operator is genuinely modest.',
      'Rent is 2/10: among the lowest in the broader Shepparton region, making small-scale essential-service concepts economically viable at lower revenue volumes than anything on the Shepparton commercial strip.',
      'Seasonality is 3/10: the dairy farming calendar and agricultural cycles create modest variation in the local trade pattern, with busy periods around harvest and quieter months in winter when farm activity slows and the local workforce is smaller.',
      'The Tatura market rewards community-focused operators who embed themselves in the town rather than treating it as a passing trade opportunity — the local loyalty that comes from serving the farming and working community consistently is the economic foundation of any durable Tatura business.',
    ],
  },
  {
    name: 'Nagambie',
    slug: 'nagambie',
    state: 'VIC',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 5, tourism: 6 },
    why: [
      'Nagambie sits on Lake Nagambie 40km south of Shepparton, anchored by the Tahbilk and Mitchelton wineries and the Nagambie Lakes water sports precinct — a genuine wine region and lifestyle tourism destination that generates above-average visitor spend from Melbourne day-trippers and weekend travellers.',
      'Tourism is 6/10: the winery and lake tourism market creates seasonal demand peaks in spring (October to November) and summer (December to February) when Melbourne visitors drive up for cellar door experiences, water sports, and regional dining — operators positioned for this market have a genuine seasonal uplift.',
      'Seasonality is 5/10: the tourism-driven trade creates a genuinely seasonal revenue profile. Winter (June to August) is materially softer than the warm-season peak. Operators who have not built a local community trade base to underpin the quieter months face real cash flow pressure in winter.',
      'Competition is 3/10: the Nagambie main strip and lakeside precinct have a small number of established operators, and the winery restaurant market is somewhat separate from the town centre — there is genuine space for quality independent food concepts that serve both the visitor and local resident market.',
      'Rent is 3/10: Nagambie commercial rents are low by any regional comparison, making entry economics accessible for operators who can execute a quality product for the wine region and lake lifestyle market.',
    ],
  },
]

const _SHEPPARTON_BUILT = buildSuburbs(SHEPPARTON_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getSheppartonSuburbs(): SheppartonSuburb[] {
  return _SHEPPARTON_BUILT
}

export function getSheppartonSuburb(nameOrSlug: string): SheppartonSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _SHEPPARTON_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getSheppartonSuburbSlugs(): string[] {
  return _SHEPPARTON_BUILT.map((s) => s.slug)
}

export function getSheppartonNearbySuburbs(currentSlug: string, limit = 3): SheppartonSuburb[] {
  const sorted = [..._SHEPPARTON_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
