/**
 * lib/analyse-data/canberra.ts
 * Engine-computed suburb data for Canberra, ACT.
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

export interface CanberraSuburbSeed {
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

export interface CanberraSuburb extends CanberraSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: CanberraSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: CanberraSuburbSeed[]): CanberraSuburb[] {
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

// ─── Canberra suburb seeds ────────────────────────────────────────────────────

const CANBERRA_SEEDS: CanberraSuburbSeed[] = [
  {
    name: 'Braddon',
    slug: 'braddon',
    factors: { demand: 9, rent: 6, competition: 8, seasonality: 2, tourism: 5 },
    why: [
      'Highest café density in ACT but demand consistently outpaces supply on weekday mornings',
      'Public-service workers generate reliable mid-week lunch and breakfast traffic',
      'Rent at $380–$520/m² is mid-tier for a precinct with this foot-traffic volume',
      'Weekend dining scene draws from across the city reducing reliance on local catchment',
      'New residential towers on Lonsdale Street are adding 1,200+ rooftop residents by 2027',
    ],
  },
  {
    name: 'Manuka',
    slug: 'manuka',
    factors: { demand: 9, rent: 7, competition: 6, seasonality: 2, tourism: 5 },
    why: [
      'Inner-south catchment has the highest household incomes in ACT — $130k+ median',
      'Village strip format limits new supply; vacancies stay below 4% long-term',
      'Politicians, diplomats and senior bureaucrats form a high-spend daytime customer base',
      'Oval events (cricket, AFL) spike weekend revenues 30–50% for surrounding operators',
      'Competition is established but not saturated — differentiated operators perform well',
    ],
  },
  {
    name: 'Kingston',
    slug: 'kingston',
    factors: { demand: 8, rent: 7, competition: 7, seasonality: 3, tourism: 7 },
    why: [
      "Kingston Foreshore precinct attracts ACT's highest weekend dining spend per visit",
      'Tourism traffic from Parliamentary Triangle and gallery precinct peaks in spring/autumn',
      'Rent premium ($420–$600/m²) justified by high average ticket sizes in the area',
      'Strong brunch and dinner trading windows; slow Tuesday–Wednesday pattern to plan around',
      'New apartment completions on Eastlake Drive are adding 800+ residents in 2025–26',
    ],
  },
  {
    name: 'Civic',
    slug: 'civic',
    factors: { demand: 8, rent: 7, competition: 8, seasonality: 2, tourism: 6 },
    why: [
      'City Walk and the Canberra Centre anchor foot traffic for 40,000+ daily visitors',
      'Government department workers provide an unusually stable and predictable weekday trade',
      'High competition in quick-service categories but gaps remain in quality dinner-format operators',
      'Tourism from national institutions (War Memorial, Parliament) benefits lunch and café operators',
      "ANU's proximity adds student demand that extends trading into evenings and weekends",
    ],
  },
  {
    name: 'Dickson',
    slug: 'dickson',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 2, tourism: 3 },
    why: [
      'Inner-north multicultural precinct with strong local loyalty and repeat-visit culture',
      'Established Asian dining strip reduces risk for complementary food operators',
      'Rent ($280–$380/m²) is meaningfully lower than Braddon for similar inner-city access',
      'Walking distance from multiple ACT government offices and Northbourne Avenue apartments',
      'Low tourist exposure insulates operators from seasonal revenue swings',
    ],
  },
  {
    name: 'Gungahlin',
    slug: 'gungahlin',
    factors: { demand: 8, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      'Fastest-growing district in ACT — population grew 18% in five years to 2024',
      'Chronically under-served for quality independent cafés and mid-market restaurants',
      'Light rail connection to city from 2019 has made the catchment permanently accessible',
      'Rent at $220–$320/m² is the most competitive of any major Canberra town centre',
      'Young family demographic generates strong breakfast and family-dining demand on weekends',
    ],
  },
  {
    name: 'Belconnen',
    slug: 'belconnen',
    factors: { demand: 7, rent: 4, competition: 6, seasonality: 2, tourism: 2 },
    why: [
      'Second-largest town centre in ACT by retail floor space — large and captive catchment',
      'University of Canberra adds 12,000+ students within 2km creating reliable daytime demand',
      'Westfield anchor stabilises foot traffic but creates dependency on mall developer decisions',
      'Rent ($220–$340/m²) is among the lowest for a major Canberra commercial area',
      'Untapped demand for specialty coffee, plant-based dining and fast-casual formats',
    ],
  },
  {
    name: 'Lyneham',
    slug: 'lyneham',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Quiet inner-north village strip with under-served café and grocer demand from nearby suburbs',
      'Low competition density creates first-mover advantage for quality operators',
      "Highly walkable catchment from Turner, O'Connor and Watson residential areas",
      'Rent ($240–$320/m²) reflects the low-profile location but not the quality of the catchment',
      'ANU proximity brings academics and researchers seeking a quieter work-from-café environment',
    ],
  },
  {
    name: 'Griffith',
    slug: 'griffith',
    factors: { demand: 7, rent: 5, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      'Inner-south suburb with low commercial vacancy and loyal high-income local customer base',
      'Shops strip on Giles Street services a 15,000-resident affluent catchment with few options',
      'Low competition means even modest operators can establish strong repeat-visit habits',
      'Close to Embassy Row and Parliamentary Triangle — lunchtime professional spend is real',
      'Almost entirely insulated from tourism volatility given residential character',
    ],
  },
  {
    name: 'Woden',
    slug: 'woden',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      'Southern town centre anchored by Westfield Woden and ACT Health precinct foot traffic',
      'Large government employer base (DoD, ACT Health) drives reliable weekday lunch trade',
      'Limited independent dining and café options create an opportunity gap',
      'Rent ($230–$350/m²) reflects the lower perceived prestige vs. inner-north precincts',
      'Suburban character dampens evening trade — strong lunch/daytime, quieter dinner window',
    ],
  },
  {
    name: 'Deakin',
    slug: 'deakin',
    factors: { demand: 6, rent: 5, competition: 4, seasonality: 2, tourism: 4 },
    why: [
      'Embassy and diplomatic mission strip generates a high-income clientele for lunch trade',
      'Low competition despite affluent catchment — most operators are long-established',
      'Tourism adjacent via Parliamentary Triangle proximity; weekday demand is the core',
      'Shops strip format limits scale but reduces exposure to large-format retail risk',
      'Premium café or deli format has a clear gap here and matches the demographic precisely',
    ],
  },
  {
    name: 'Barton',
    slug: 'barton',
    factors: { demand: 5, rent: 5, competition: 3, seasonality: 2, tourism: 4 },
    why: [
      'Government and embassy precinct with almost no retail — a genuine opportunity gap',
      'Low competition but also lower volume; works best for high-margin quick-service formats',
      'Parliament House proximity creates seasonal peaks during sitting periods',
      'Rent is moderate given the prestige address but footfall is very corridor-specific',
      'Works for operators who understand the very predictable weekday-only pattern',
    ],
  },
  {
    name: 'Bruce',
    slug: 'bruce',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 4, tourism: 3 },
    why: [
      'University of Canberra campus and CISAC precinct generate 15,000+ daily visitors',
      'High seasonality risk — significant revenue drops during university semester breaks',
      'Stadium and sporting precinct drives event-day spikes for food operators nearby',
      'Rent ($200–$300/m²) is the most affordable inner-north commercial option',
      'Best suited to operators who can build a dual university-and-local community customer base',
    ],
  },
  {
    name: 'Phillip',
    slug: 'phillip',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      'Woden Valley commercial hub with a large employed population and underserved lunch demand',
      'Established shopping centre ensures foot traffic but limits positioning for independents',
      'Rent at $220–$320/m² is at the low end for southern ACT commercial strips',
      'Predominantly weekday trading pattern; weekend foot traffic is lower than inner-north',
      'Gap in quality quick-service and café formats within the Melrose Drive corridor',
    ],
  },
  {
    name: 'Fyshwick',
    slug: 'fyshwick',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Industrial and bulky-goods precinct with a growing artisan food and café scene',
      'Very low rent ($160–$260/m²) enables high-margin operations for the right format',
      'Weekend market trade and direct-to-consumer food producers attract a loyal day-tripper crowd',
      'Not suitable for standard café or restaurant concepts relying on walk-in evening traffic',
      'Best for roasteries, breweries, food production with cellar-door style retail components',
    ],
  },
  {
    name: 'Casey',
    slug: 'casey',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Outer Gungahlin suburb with rapid residential growth and almost no independent operators',
      'Young family demographic (median age 32) with strong demand for convenient dining options',
      'Very low rent ($160–$240/m²) and low competition creates first-mover opportunity',
      'Long drive to inner-city alternatives means local options capture a captive catchment',
      'Risk is that population growth must continue — currently reliant on new-estate expansion',
    ],
  },
  {
    name: 'Kaleen',
    slug: 'kaleen',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Established suburban north catchment with modest commercial strip on Maribrynong Avenue',
      'Low competition makes even a modest café a strong local anchor',
      'Population is older demographic — strong demand for sit-down breakfast and lunch formats',
      'Very low rent and low footfall risk profile suits owner-operator models well',
      'Limited growth potential — steady rather than expanding catchment',
    ],
  },
  {
    name: 'Tuggeranong',
    slug: 'tuggeranong',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 2, tourism: 1 },
    why: [
      'Southern ACT town centre anchored by Hyperdome shopping centre',
      'Large residential catchment but dominated by national and franchise operators',
      'Independent operators face a difficult competitive environment against mall tenants',
      'Rent ($180–$280/m²) is low but so is the average customer spend in the area',
      'Best suited to niche formats addressing a clear gap in the existing franchise mix',
    ],
  },
  {
    name: 'Narrabundah',
    slug: 'narrabundah',
    factors: { demand: 5, rent: 4, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      'Inner-south suburb with a small village commercial strip and loyal local following',
      'Limited competition means a quality operator can quickly dominate the local catchment',
      'Close to Manuka and Griffith but with lower rents for a similar demographic profile',
      'Predominantly residential character means evening trade requires effort to establish',
      'Works best for owner-operators wanting a tight, manageable and loyal customer base',
    ],
  },
]

// ─── Build suburb models ──────────────────────────────────────────────────────

const _CANBERRA_BUILT: CanberraSuburb[] = buildSuburbs(CANBERRA_SEEDS)

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCanberraSuburbs(): CanberraSuburb[] {
  return _CANBERRA_BUILT
}

export function getCanberraSuburb(nameOrSlug: string): CanberraSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _CANBERRA_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getCanberraSuburbSlugs(): string[] {
  return _CANBERRA_BUILT.map((s) => s.slug)
}

export function getCanberraNearbySuburbs(currentSlug: string, limit = 3): CanberraSuburb[] {
  const sorted = [..._CANBERRA_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
