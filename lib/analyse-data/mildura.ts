/**
 * lib/analyse-data/mildura.ts
 * Engine-computed suburb data for Mildura, VIC.
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

export interface MilduraSuburbSeed {
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

export interface MilduraSuburb extends MilduraSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: MilduraSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: MilduraSuburbSeed[]): MilduraSuburb[] {
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

// ─── Mildura suburb seeds ─────────────────────────────────────────────────────

const MILDURA_SEEDS: MilduraSuburbSeed[] = [
  {
    name: 'Mildura CBD',
    slug: 'mildura-cbd',
    state: 'VIC',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 3, tourism: 6 },
    why: [
      'Langtree Avenue is the pedestrian mall spine of Mildura CBD — a purpose-built pedestrian retail and dining precinct that concentrates foot traffic for the entire Sunraysia region, drawing from a 70,000-person catchment across Mildura, Red Cliffs, Merbein, Irymple, and the NSW side of the Murray.',
      'Tourism is 6/10: Mildura is a genuine tourism destination — the Murray River, houseboating, and the Sunraysia wine and food scene draw interstate and intrastate visitors who specifically seek the regional food culture, elevating average spend and supporting quality-positioned hospitality concepts year-round.',
      'Competition is 6/10: Langtree Avenue has one of the strongest independent food and hospitality scenes of any regional Victorian city — the precinct has established operators, which validates the market but means new entrants need a clearly differentiated concept to stand out.',
      'Rent is 5/10: Mildura CBD strip rents are higher than outer suburbs but remain affordable relative to Melbourne or even Bendigo equivalents — operators can access a high-quality retail and dining precinct at costs that support viable unit economics if the concept is well-executed.',
      'The Mildura CBD benefits from being the only major commercial centre within 150km in any direction — there is no competing regional city to draw trade away, and the CBD captures a regional catchment that includes both the immediate urban population and a wide rural hinterland.',
    ],
  },
  {
    name: 'Mildura South',
    slug: 'mildura-south',
    state: 'VIC',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      'Fifteenth Street is the main commercial strip serving the southern residential suburbs of Mildura — a suburban retail corridor anchored by supermarkets and essential services that generates consistent year-round foot traffic from a large residential catchment.',
      'Competition is 5/10: the Fifteenth Street corridor has a mature mix of convenience and dining operators, but the residential-scale demand means well-differentiated concepts can find loyal local customers without needing to compete with the CBD dining scene.',
      'Rent is 4/10: strip rents on Fifteenth Street are lower than the Langtree Avenue CBD precinct but carry a suburban commercial premium that reflects the established trade base — operators should model $2,000 to $4,000 per month for viable positions depending on the tenancy size.',
      'The southern residential catchment is the largest contiguous residential area in Mildura, with established family demographics who value proximity and quality convenience — operators who become the local neighbourhood institution build durable community loyalty.',
      'Seasonality is 2/10: the residential character of the southern suburbs moderates the tourism-driven seasonal variation of the CBD, creating a more stable year-round trade pattern that suits operators who prefer predictable revenue over high peaks and off-season softness.',
    ],
  },
  {
    name: 'Irymple',
    slug: 'irymple',
    state: 'VIC',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 3, tourism: 2 },
    why: [
      'Irymple is the principal horticultural residential suburb of the Mildura region — a working suburb where a significant proportion of residents are employed in the grape, citrus, and dried fruit industries, creating a multicultural demographic that includes Australian-born residents alongside large Sikh, Afghan, and Pacific Islander communities.',
      'Competition is 3/10: Irymple is underserved by quality hospitality for the scale of its residential population — the commercial supply is primarily convenience-oriented, leaving genuine space for concepts that reflect the actual multicultural character of the suburb.',
      'Rent is 3/10: commercial rents in Irymple are significantly lower than the Mildura CBD, reflecting the suburban and working-class character of the area — this makes the entry economics accessible for operators who correctly size their concept to the residential catchment.',
      'The horticultural workforce creates a distinctive demand pattern: early-morning trade from workers heading to the orchards, strong demand for value-focused lunch and takeaway, and a community that values genuine hospitality over formal dining experiences.',
      'Seasonality is 3/10: the agricultural workforce and harvest cycle create modest seasonal variation — peak periods around the grape harvest (February to March) and citrus season (June to September) bring temporary population increases, while post-harvest periods are quieter.',
    ],
  },
  {
    name: 'Red Cliffs',
    slug: 'red-cliffs',
    state: 'VIC',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Red Cliffs is an eastern satellite town 14km from Mildura CBD, the second-largest community in the Sunraysia region — a self-contained town with a distinct commercial centre on Indi Avenue that serves the local residential population and surrounding horticultural properties.',
      'Competition is 2/10: Red Cliffs has a limited operator mix concentrated on essential services, leaving genuine space for quality food and hospitality concepts that the local community currently cannot access without travelling to Mildura.',
      'Rent is 2/10: among the lowest in the Mildura region, making the entry economics very accessible for operators who want to serve a residential and rural catchment without CBD-level occupancy costs.',
      'The Red Cliffs population has strong community loyalty habits — local residents actively prefer to support businesses within their town rather than making the 14km trip to Mildura for everyday needs, which creates a captive customer base for operators who establish themselves as part of the local commercial fabric.',
      'Seasonality is 3/10: the horticultural character of the Red Cliffs area creates some seasonal variation tied to the grape and citrus harvest calendar, with temporary population increases during peak harvest periods and quieter months in winter when agricultural activity is lower.',
    ],
  },
  {
    name: 'Nichols Point',
    slug: 'nichols-point',
    state: 'VIC',
    factors: { demand: 5, rent: 4, competition: 3, seasonality: 2, tourism: 4 },
    why: [
      'Nichols Point is the premium residential suburb of the Mildura urban area — a riverfront lifestyle precinct where above-average household incomes and a strong owner-occupier demographic create demand for quality hospitality and specialty retail that is not easily found in the broader Mildura market.',
      'Tourism is 4/10: the Murray River frontage and the concentration of holiday accommodation in the Nichols Point area brings a visitor population that supplements local resident spending — particularly in the warm season when river tourism is most active.',
      'Competition is 3/10: the Nichols Point residential and riverfront precinct has limited commercial supply relative to the demographic quality of the catchment — operators who position for the premium residential market can capture loyal, high-spend customers.',
      'Rent is 4/10: the premium residential character carries a modest rent premium over the outer suburbs but remains well below CBD strip rates — operators can access a high-quality demographic at occupancy costs that support quality-casual positioning.',
      'Seasonality is 2/10: the established residential demographic provides consistent year-round trade, with warm-season river tourism adding a modest uplift rather than dominating the trade profile the way seasonal tourism does in less residentially anchored locations.',
    ],
  },
  {
    name: 'Merbein',
    slug: 'merbein',
    state: 'VIC',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Merbein is a western satellite town 9km from Mildura, a historic viticultural and mixed-farming community with a small residential population and a modest commercial strip on Eleventh Street that serves the immediate residential catchment.',
      'Competition is 2/10: Merbein has minimal operator density — the local food and hospitality supply is limited, and the community regularly travels to Mildura for most of its hospitality and retail needs.',
      'Rent is 2/10: commercial rents in Merbein are among the lowest in the Mildura region, reflecting the modest catchment size and the limited trading history of existing commercial operators.',
      'The Merbein community has a loyal character — residents who prefer not to travel to Mildura for everyday needs will actively support local operators who provide quality and value within their town, creating a captive customer base for the right concept.',
      'Seasonality is 3/10: the agricultural character creates some seasonal variation tied to the harvest calendar, but the market scale is small enough that operators must be realistic about revenue ceilings regardless of season.',
    ],
  },
  {
    name: 'Gol Gol',
    slug: 'gol-gol',
    state: 'NSW',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 3 },
    why: [
      'Gol Gol is on the NSW side of the Murray River directly opposite Mildura, effectively part of the Mildura urban area but subject to NSW planning and licensing rules — a growing residential suburb where new estate development has created a catchment that uses Mildura CBD for most commercial needs but seeks local convenience options.',
      'Tourism is 3/10: the Murray River frontage and the proximity to Mildura tourism infrastructure brings some visitor trade, particularly from houseboating and river tourism activity based in the Gol Gol area.',
      'Competition is 3/10: the Gol Gol commercial strip has limited supply relative to the growing residential base — new residential development has outpaced commercial supply, creating genuine first-mover opportunities for convenience-oriented operators.',
      'Rent is 3/10: comparable to Mildura outer suburbs, with commercial rents priced to attract operators into a growing but still-maturing residential market.',
      'Being on the NSW side means operators need to navigate different licensing and planning rules to Mildura VIC, which adds administrative complexity — operators should verify NSW small business and hospitality licensing requirements before committing to a Gol Gol tenancy.',
    ],
  },
  {
    name: 'Wentworth',
    slug: 'wentworth',
    state: 'NSW',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 4, tourism: 5 },
    why: [
      'Wentworth is a historic river junction town at the confluence of the Murray and Darling rivers, 30km east of Mildura — the actual geographic meeting point of Australia\'s two greatest rivers, which makes it a genuine tourism attraction despite its very small permanent population.',
      'Tourism is 5/10: the river junction, the historic courthouse, and the Wentworth Gaol attract a steady stream of day-trippers from Mildura and travelling visitors exploring the Murray-Darling river system — creating above-average tourism demand for a town of its size.',
      'Seasonality is 4/10: tourism peaks in the spring and autumn shoulder seasons when comfortable temperatures make river touring and outdoor experiences appealing, while summer heat and winter cold soften visitor numbers and the small resident population alone cannot sustain hospitality businesses through the quieter months.',
      'Competition is 2/10: Wentworth has very limited commercial hospitality supply — the tourism demand exceeds what existing operators can serve during peak periods, creating a real opportunity for well-positioned visitor-facing concepts.',
      'Rent is 2/10: among the lowest in the broader Mildura/Sunraysia region, reflecting the small permanent population and the limited trading history of commercial hospitality in Wentworth — entry economics are highly accessible for operators who can serve the tourism market.',
    ],
  },
]

const _MILDURA_BUILT = buildSuburbs(MILDURA_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getMilduraSuburbs(): MilduraSuburb[] {
  return _MILDURA_BUILT
}

export function getMilduraSuburb(nameOrSlug: string): MilduraSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _MILDURA_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getMilduraSuburbSlugs(): string[] {
  return _MILDURA_BUILT.map((s) => s.slug)
}

export function getMilduraNearbySuburbs(currentSlug: string, limit = 3): MilduraSuburb[] {
  const sorted = [..._MILDURA_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
