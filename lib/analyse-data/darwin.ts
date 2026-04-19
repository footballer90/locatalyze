import {
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from './scoring-engine'

export interface DarwinSuburbSeed {
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

export interface DarwinSuburb extends DarwinSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

export const DARWIN_SUBURB_DATASET: DarwinSuburbSeed[] = [
  {
    name: 'Darwin City',
    slug: 'darwin-city',
    factors: {
      demand: 8,
      rent: 6,
      competition: 5,
      seasonality: 7,
      tourism: 7,
    },
    why: [
      'Darwin City concentrates the CBD worker base, Mitchell Street visitor traffic, and the highest density of hospitality activity in the Territory, which is why demand is 8/10.',
      'Rent is 6/10 because CBD sites still carry a premium, but not every Darwin City site is priced at the top of the market in the way Mitchell Street trophy positions are.',
      'Seasonality and tourism both sit at 7/10 because dry-season visitors materially lift trade, but the CBD still has enough worker and service demand to avoid behaving like a pure visitor market.',
    ],
  },
  {
    name: 'Parap',
    slug: 'parap',
    factors: {
      demand: 8,
      rent: 4,
      competition: 4,
      seasonality: 6,
      tourism: 5,
    },
    why: [
      'Parap scores demand at 8/10 because Parap Village and the market precinct create one of Darwin’s most reliable neighbourhood demand clusters.',
      'Rent is only 4/10, which makes Parap materially more forgiving than the CBD for independents testing Darwin with a first site.',
      'Seasonality is still 6/10 because Darwin’s wet/dry cycle affects all hospitality, but Parap has more resident support than the city core so the downside is softer.',
    ],
  },
  {
    name: 'Nightcliff',
    slug: 'nightcliff',
    factors: {
      demand: 7,
      rent: 4,
      competition: 3,
      seasonality: 4,
      tourism: 4,
    },
    why: [
      'Nightcliff lands at 7/10 demand because the foreshore, weekend activity, and established local loyalty create a consistent community-led trade base.',
      'Competition is 3/10, reflecting a thinner independent field than Darwin City or Parap and leaving more room for a clear operator.',
      'Seasonality is only 4/10 and tourism 4/10 because Nightcliff leans more on repeat locals than on visitor-heavy dry-season spikes, which makes it one of Darwin’s steadier hospitality plays.',
    ],
  },
  {
    name: 'Larrakeyah',
    slug: 'larrakeyah',
    factors: {
      demand: 6,
      rent: 6,
      competition: 3,
      seasonality: 5,
      tourism: 5,
    },
    why: [
      'Larrakeyah demand is 6/10 because it benefits from CBD adjacency and a high-income residential base, but it does not have the same concentrated village-style trading spine as Parap.',
      'Rent pressure is 6/10 because premium harbour-adjacent positioning can push occupancy costs above what the immediate catchment alone supports.',
      'Competition is only 3/10, so a strong convenience-led hospitality or service concept has more whitespace here than in Darwin’s better-known hubs.',
    ],
  },
  {
    name: 'Fannie Bay',
    slug: 'fannie-bay',
    factors: {
      demand: 7,
      rent: 5,
      competition: 3,
      seasonality: 5,
      tourism: 5,
    },
    why: [
      'Fannie Bay scores 7/10 on demand because affluent households, coastal lifestyle spending, and proximity to the city create a dependable premium local customer base.',
      'Competition is 3/10, meaning the suburb is still less saturated than Darwin City despite having stronger spending power than many suburban areas.',
      'Rent is 5/10 rather than low because the prestige of the area lifts occupancy expectations, but not to CBD levels.',
    ],
  },
  {
    name: 'Casuarina',
    slug: 'casuarina',
    factors: {
      demand: 6,
      rent: 7,
      competition: 8,
      seasonality: 4,
      tourism: 3,
    },
    why: [
      'Casuarina demand is 6/10 because the area serves a large northern-suburbs catchment and major retail anchors, but much of that spend is already captured inside dominant centres.',
      'Competition sits at 8/10 because independents here are competing against entrenched mall gravity rather than just neighbouring strip operators.',
      'Tourism is only 3/10 and seasonality 4/10, so the suburb is steadier than the CBD, but the real constraint is competitive pressure rather than volatility.',
    ],
  },
  {
    name: 'Palmerston',
    slug: 'palmerston',
    factors: {
      demand: 6,
      rent: 4,
      competition: 4,
      seasonality: 4,
      tourism: 2,
    },
    why: [
      'Palmerston scores 6/10 on demand because it has a growing suburban population and genuine family-services demand, but it lacks the intensity of Darwin’s inner clusters.',
      'Rent pressure is 4/10, which gives Palmerston one of the easier cost bases for operators who do not need tourist trade or CBD foot traffic.',
      'Tourism is just 2/10, meaning the suburb is not a lifestyle or visitor play at all; it succeeds when the concept fits suburban repeat-use behaviour.',
    ],
  },
  {
    name: 'Stuart Park',
    slug: 'stuart-park',
    factors: {
      demand: 6,
      rent: 5,
      competition: 4,
      seasonality: 5,
      tourism: 4,
    },
    why: [
      'Stuart Park scores 6/10 on demand because it sits between the CBD and inner suburbs with a growing apartment population, but foot traffic has not yet caught up with residential growth.',
      'Rent pressure is 5/10, positioning Stuart Park as a middle-ground option — cheaper than Darwin City, but not as affordable as Palmerston or Nightcliff.',
      'Seasonality is 5/10 because the suburb benefits from CBD adjacency but lacks a strong tourism or resident-anchor profile to cushion wet-season downturns.',
    ],
  },
  {
    name: 'Rapid Creek',
    slug: 'rapid-creek',
    factors: {
      demand: 6,
      rent: 3,
      competition: 3,
      seasonality: 5,
      tourism: 3,
    },
    why: [
      'Rapid Creek lands at 6/10 demand because the local retail strip and suburban residential catchment create a reliable community trading base, though population density is not exceptional.',
      'Rent pressure is only 3/10, making Rapid Creek one of Darwin\'s more affordable commercial strips and an accessible entry point for operators testing the market.',
      'Competition sits at 3/10, indicating the retail category is relatively open compared to Casuarina or the CBD, leaving room for a clear independent operator to establish presence.',
    ],
  },
]

function normalizeSuburbKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toLocationFactors(seed: DarwinSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: seed.demand,
    rentPressure: seed.rent,
    competitionDensity: seed.competition,
    seasonalityRisk: seed.seasonality,
    tourismDependency: seed.tourism,
  }
}

const DARWIN_SUBURBS: DarwinSuburb[] = DARWIN_SUBURB_DATASET.map((suburb) => {
  const locationFactors = toLocationFactors(suburb.factors)
  const model = computeLocationModel(locationFactors)

  return {
    ...suburb,
    locationFactors: model.factors,
    cafe: model.cafe,
    restaurant: model.restaurant,
    retail: model.retail,
    compositeScore: model.compositeScore,
    verdict: model.verdict,
  }
})

export function getDarwinSuburbs(): DarwinSuburb[] {
  return [...DARWIN_SUBURBS]
}

export function getDarwinSuburb(key: string): DarwinSuburb | undefined {
  const normalizedKey = normalizeSuburbKey(key)

  return DARWIN_SUBURBS.find(
    (suburb) =>
      suburb.slug === normalizedKey || normalizeSuburbKey(suburb.name) === normalizedKey,
  )
}

export function getDarwinSuburbStaticParams() {
  return DARWIN_SUBURBS.map((suburb) => ({ suburb: suburb.slug }))
}

export function getDarwinNearbySuburbs(currentSlug: string, limit = 3): DarwinSuburb[] {
  return DARWIN_SUBURBS
    .filter((suburb) => suburb.slug !== currentSlug)
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, limit)
}
