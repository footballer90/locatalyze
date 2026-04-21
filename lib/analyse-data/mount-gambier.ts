/**
 * lib/analyse-data/mount-gambier.ts
 * Engine-computed suburb data for Mount Gambier, SA.
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

export interface MountGambierSuburbSeed {
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

export interface MountGambierSuburb extends MountGambierSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: MountGambierSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: MountGambierSuburbSeed[]): MountGambierSuburb[] {
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

// ─── Mount Gambier suburb seeds ───────────────────────────────────────────────

const MOUNT_GAMBIER_SEEDS: MountGambierSuburbSeed[] = [
  {
    name: 'Mount Gambier CBD',
    slug: 'mount-gambier-cbd',
    factors: { demand: 7, rent: 3, competition: 5, seasonality: 3, tourism: 6 },
    why: [
      'Commercial Street is the primary retail and dining strip of Mount Gambier — the largest regional city in South Australia outside Adelaide, with a population of approximately 32,000 and a substantial retail catchment that includes surrounding towns and rural communities spanning the southeast SA and southwest VIC border region. The Blue Lake and associated volcanic attractions draw genuine interstate and international visitors to the CBD year-round.',
      'Tourism is 6/10: the Blue Lake crater lake, Umpherston Sinkhole, and Cave Garden are legitimate natural tourism drawcards that bring visitors specifically to Mount Gambier from across SA, VIC, and beyond. The Blue Lake colour change (September to March) creates a seasonally concentrated visitor interest, though the cave and sinkhole attractions operate year-round. Tourism is a meaningful supplementary revenue layer rather than the primary market driver.',
      'Competition is 5/10: the CBD has a working commercial hospitality and retail density that reflects its status as the dominant service centre for a large rural and regional catchment. Quality independents can compete effectively here — the market rewards operators who deliver a standard above the existing supply, which has room to improve.',
      'Seasonality is 3/10: lower than most comparable tourist-adjacent regional cities because the agricultural, forestry, and dairy industry workforce provides a substantial and stable year-round commercial catchment. Blue Lake tourism peaks September to March, but the local economy does not collapse outside that window.',
      'Rent is 3/10: Mount Gambier has the lowest commercial rents of any SA regional city of comparable scale — the combination of land availability, modest growth, and limited interstate investment pressure keeps rents well below Adelaide outer suburbs and far below comparable-scale Victorian or NSW regional cities. This is a structural financial advantage for operators.',
    ],
  },
  {
    name: 'Suttontown',
    slug: 'suttontown',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Suttontown is the northern industrial and residential fringe of Mount Gambier — an area that blends light industrial activity, tradesperson and logistics businesses, and a working-class residential population. The catchment demographic is blue-collar and tradie-focused, creating genuine demand for practical, value-oriented food and beverage concepts that serve the breakfast and lunch trade of the industrial corridor.',
      'Competition is 2/10: limited commercial hospitality in Suttontown despite a real and consistent tradie and industrial workforce demand. The breakfast and lunch trade for workers in the northern industrial precinct is an underserved market — a concept positioned specifically for this customer base faces almost no direct competition.',
      'Demand is 4/10: the industrial and residential mix creates a moderate but very consistent daily demand pattern — breakfast before 8am and lunch 11:30am to 1:30pm. Outside these two windows, demand drops significantly. Operators who build a business model around the tradie breakfast and lunch trade find a loyal and repeat customer base.',
      'Low tourism (2/10) and low seasonality (3/10) make Suttontown an entirely local trade environment. There are no visitor uplifts or tourist season bonuses — trade is driven by the consistent patterns of the local industrial and residential workforce, which is predictable and reliable year-round.',
      'Rent is 2/10: industrial fringe commercial rents in Suttontown are very low, reducing break-even thresholds and making the financial model workable for lean-operating daytime trade concepts. The low rent structure is the key financial argument for operators who correctly model the breakfast-and-lunch revenue pattern.',
    ],
  },
  {
    name: 'Moorak',
    slug: 'moorak',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 3, tourism: 2 },
    why: [
      'Moorak is a southern residential growth area of Mount Gambier where new family housing development is creating an emerging catchment. Young families and couples relocating from Adelaide or from rural SA who want a lifestyle change and lower housing costs are settling in Moorak, bringing food culture expectations and consistent hospitality spending habits.',
      'Competition is 2/10: Moorak is underserved by quality hospitality relative to its growth trajectory — the new residential development has outpaced commercial activation. First-mover operators who establish a family-friendly cafe or casual dining concept in Moorak capture the growing catchment before competition follows.',
      'Demand is 5/10: the new residential demographic in Moorak has above-average food culture expectations relative to the broader Mount Gambier population. Families who have moved from Adelaide bring the spending habits and quality expectations of a metropolitan food scene to a regional market with far lower costs. This creates a genuine opportunity for quality operators.',
      'Low seasonality (3/10) and low tourism (2/10) create a purely residential trade environment in Moorak. Revenue is predictable and driven by the local community — building genuine loyalty with the new families settling in the suburb is the entire business case. Operators who achieve this build a durable business as the catchment continues to grow.',
      'Rent is 2/10: growth corridor commercial tenancies in Moorak are priced to attract first operators into the emerging precinct. The low rent structure combined with the growing residential base creates a workable financial model for operators who can establish the community loyalty that sustains trade as the suburb matures.',
    ],
  },
  {
    name: 'Mil Lel',
    slug: 'mil-lel',
    factors: { demand: 3, rent: 1, competition: 1, seasonality: 3, tourism: 2 },
    why: [
      'Mil Lel is an outer rural residential area 10km north of the Mount Gambier CBD — a small farming and rural lifestyle community with a modest catchment that generates limited hospitality demand. The area is characterised by hobby farms, small rural blocks, and long-term Mount Gambier region residents who make the trip to the CBD for most of their commercial needs.',
      'Competition is 1/10: essentially no existing commercial hospitality in Mil Lel, which accurately reflects the limited spending capacity and small population of this rural fringe area. The very low competition is not a hidden opportunity — it reflects the genuine demand constraints of a small rural catchment with easy access to the Mount Gambier CBD.',
      'Demand is 3/10: real but very limited. The rural residential community has genuine daily needs that a correctly positioned essential-service concept can serve, but the revenue ceiling is low. Operators who correctly calibrate their cost structure and pricing to the catchment can build a sustainable small business; those who project growth-stage economics will be consistently disappointed.',
      'Low tourism (2/10) creates modest visitor adjacency from rural tourism and agricultural trail itineraries in the southeast SA region. This is an occasional uplift rather than a revenue pillar — not something that changes the fundamental modest-scale character of the Mil Lel market.',
      'Rent is 1/10: the lowest in the Mount Gambier dataset, reflecting the minimal commercial activity and rural fringe location. Very low fixed costs make break-even achievable at very modest revenue volumes — this is the only financial argument for considering Mil Lel over the Mount Gambier CBD for most operator types.',
    ],
  },
  {
    name: 'Mount Gambier South',
    slug: 'mount-gambier-south',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 3, tourism: 3 },
    why: [
      'Mount Gambier South is an established residential suburb with a moderate to higher household income profile relative to the city average. Proximity to Lady Nelson Park and the broader southern residential belt creates a stable community of long-term Mount Gambier residents with consistent spending patterns and genuine demand for quality local hospitality.',
      'The southern residential belt is closer to the Blue Lake attraction than the northern and western suburbs — a modest tourism adjacency (3/10) from visitors passing through the southern approaches to the volcanic crater. This creates occasional visitor foot traffic that supplements the local residential demand without being a structural tourism market.',
      'Competition is 3/10: the established residential character and the moderate-to-higher income profile make Mount Gambier South an attractive location for quality hospitality concepts. Existing operators are limited enough that genuinely differentiated independents find loyal community audiences without excessive competitive pressure.',
      'Demand is 5/10: the established residential community with above-average household incomes creates reliable hospitality demand with higher per-visit spend potential than the city average. Mount Gambier South residents have the income and the lifestyle expectations to support quality cafe and restaurant concepts that are correctly positioned for the catchment.',
      'Rent is 2/10: established residential suburb commercial rents are well below CBD levels. The cost structure advantage combined with a solid residential catchment creates a workable financial model for quality independent operators who build genuine community loyalty.',
    ],
  },
  {
    name: 'Carpenter Rocks',
    slug: 'carpenter-rocks',
    factors: { demand: 3, rent: 1, competition: 1, seasonality: 6, tourism: 5 },
    why: [
      'Carpenter Rocks is a small coastal village 30km south of Mount Gambier with rock lobster fishing heritage and a modest tourist trade from coastal holiday-makers and anglers. The rugged coastline and holiday shack character create a genuine but highly seasonal visitor demand that concentrates into the summer holiday months (December to January) and the Easter school holiday period.',
      'Tourism is 5/10 relative to the village scale — coastal holiday-makers from Mount Gambier and broader SA use Carpenter Rocks as a holiday destination, creating concentrated hospitality demand during peak holiday periods. This is the defining commercial characteristic of the village: the trade is almost entirely tourism-dependent and highly seasonal.',
      'Seasonality is 6/10: the highest in the Mount Gambier dataset, reflecting the strongly seasonal nature of coastal holiday trade at Carpenter Rocks. Outside the December-January summer peak and the Easter shoulder, the village population drops sharply and commercial hospitality demand collapses. Operators must model this seasonal structure honestly.',
      'Competition is 1/10: very limited existing commercial hospitality in Carpenter Rocks reflects both the small permanent population and the seasonal nature of the market. A correctly positioned seasonal cafe or take-away concept has the coastal holiday market largely to itself during peak periods.',
      'Rent is 1/10: coastal village commercial rents are very low in Carpenter Rocks, making the economics of a lean seasonal operation viable despite the revenue concentration into a limited window. The business case must be built on very low fixed costs and a revenue model that captures maximum trade during the summer and Easter peaks.',
    ],
  },
  {
    name: 'Millicent',
    slug: 'millicent',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 3, tourism: 3 },
    why: [
      'Millicent is a satellite town 45km north of Mount Gambier with a population of approximately 5,000 — a genuine and self-contained commercial catchment serving the agricultural and plantation forestry communities of the southeast SA Limestone Coast. Millicent has its own commercial precinct on George Street that captures local trade from the town and surrounding rural areas.',
      'The Limestone Coast tourism corridor passes through Millicent on the Princes Highway between Adelaide and Mount Gambier — creating modest visitor foot traffic (3/10) from travellers stopping for fuel, food, and rest breaks. Millicent is not a destination tourism location but it captures genuine highway passing trade that supplements local residential demand.',
      'Competition is 3/10: Millicent has a small but functional commercial hospitality sector. Quality independents face limited direct competition from quality operators — the existing hospitality offer is functional rather than premium, creating room for a quality cafe or restaurant to establish a market-leading position in the town.',
      'Demand is 5/10: the combination of the local residential population, the agricultural and forestry industry workforce, and the Princes Highway passing trade creates a genuine and multi-source hospitality demand. Operators who serve all three segments — locals for daily trade, industry workers for breakfast and lunch, and highway travellers for convenience — build the most resilient revenue base.',
      'Rent is 2/10: Millicent commercial rents are very low, reflecting the small town scale and limited commercial competition for premises. The very low fixed cost structure makes the economics of a quality small-town hospitality concept very workable for operators who correctly calibrate to the Millicent catchment.',
    ],
  },
]

const _MOUNT_GAMBIER_BUILT = buildSuburbs(MOUNT_GAMBIER_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getMountGambierSuburbs(): MountGambierSuburb[] {
  return _MOUNT_GAMBIER_BUILT
}

export function getMountGambierSuburb(nameOrSlug: string): MountGambierSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _MOUNT_GAMBIER_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getMountGambierSuburbSlugs(): string[] {
  return _MOUNT_GAMBIER_BUILT.map((s) => s.slug)
}

export function getMountGambierNearbySuburbs(currentSlug: string, limit = 3): MountGambierSuburb[] {
  const sorted = [..._MOUNT_GAMBIER_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
