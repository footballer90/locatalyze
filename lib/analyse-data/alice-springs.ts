/**
 * lib/analyse-data/alice-springs.ts
 * Engine-computed suburb data for Alice Springs, NT.
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

export interface AliceSpringsSuburbSeed {
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

export interface AliceSpringsSuburb extends AliceSpringsSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: AliceSpringsSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: AliceSpringsSuburbSeed[]): AliceSpringsSuburb[] {
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

// ─── Alice Springs suburb seeds ───────────────────────────────────────────────

const ALICE_SPRINGS_SEEDS: AliceSpringsSuburbSeed[] = [
  {
    name: 'Alice Springs CBD',
    slug: 'alice-springs-cbd',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 6, tourism: 8 },
    why: [
      'Todd Street Mall is the primary retail and hospitality strip in the Red Centre — the highest concentration of tourist foot traffic in Alice Springs, with visitors passing through on their way to and from Uluru, Kings Canyon, and the West MacDonnell Ranges. Tourism score of 8/10 reflects genuine international and domestic visitor flow from April through September.',
      'Seasonality is 6/10: the Alice Springs climate creates two very distinct trading periods. The May to September dry season is the peak tourism window when temperatures are mild and international visitor numbers spike. November to March brings extreme heat (regularly above 40C) that significantly suppresses outdoor dining, street-level foot traffic, and visitor numbers.',
      'The captive government and public service workforce is the year-round demand anchor for CBD hospitality — federal government agencies, NT government offices, health services, and education institutions provide a stable lunchtime and after-work customer base that sustains trade through the summer months when tourism drops sharply.',
      'Competition is 6/10: the Todd Street precinct has a sufficient density of cafes, restaurants, and retail operators to validate the market, but the tourist season creates periods where demand exceeds existing supply — well-positioned new entrants find genuine trade during the May to September window.',
      'Rent is 5/10: Alice Springs CBD rents are higher than most NT regional centres due to remote location logistics, high building maintenance costs in an extreme climate, and the elevated operating cost environment. Operators must factor in higher freight, labour, and energy costs that are structural features of running a business in Central Australia.',
    ],
  },
  {
    name: 'Eastside',
    slug: 'eastside',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 4, tourism: 2 },
    why: [
      'Eastside is the eastern residential corridor of Alice Springs, home to a professional demographic including government workers, health sector staff, and educators — a customer base with stable incomes and consistent spending patterns that is not materially affected by the tourism seasonal cycle.',
      'Competition is 3/10: genuinely low operator density in the residential eastern suburbs means there is an unmet need for quality convenience dining and specialty coffee. Operators who establish community-facing concepts here face limited direct competition from existing businesses.',
      'Demand is 5/10: the professional residential demographic creates solid daily trade for cafes and convenience food concepts, though the population base is constrained by Alice Springs overall size of approximately 30,000 people — revenue ceilings are lower than comparable suburban markets in Darwin or other larger regional centres.',
      'Low tourism exposure (2/10) means Eastside operators are almost entirely dependent on the local residential and professional catchment. This eliminates the seasonal revenue spike but also removes the seasonal revenue cliff — trade is more predictable, if lower in absolute volume.',
      'Rent is 3/10: residential corridor commercial tenancies are priced well below CBD rates, reducing break-even thresholds and making the financial model more forgiving for operators who correctly calibrate to the catchment capacity.',
    ],
  },
  {
    name: 'Larapinta',
    slug: 'larapinta',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 4, tourism: 3 },
    why: [
      'Larapinta is a western residential suburb with a mixed socioeconomic profile — a combination of long-term Alice Springs residents, Indigenous community members, and working-class households that creates demand for value-oriented and essential-service food and beverage concepts rather than premium hospitality.',
      'Competition is 2/10: very low operator density in Larapinta reflects both the modest spending capacity of the catchment and the fact that most hospitality investment in Alice Springs has concentrated in the CBD and higher-income eastern suburbs. First-mover operators serving genuine community needs face limited direct competition.',
      'The western suburb position means some tourism adjacency from the Larapinta Trail hiking corridor and the West MacDonnell Ranges, which creates modest visitor traffic during the dry season (May to September) — scored 3/10 to reflect genuine but limited tourism exposure.',
      'Demand is 4/10: the mixed socioeconomic profile of Larapinta creates real but modest hospitality demand. Operators who correctly price and position for the actual catchment — value-driven, community-focused, essential-service — build durable local trade. Concepts priced for the CBD market will not find their customer here.',
      'Rent is 2/10: the lowest commercial rents in the Alice Springs suburban belt, reflecting the catchment profile and the lack of established commercial activity. Break-even is achievable at modest revenue volumes for correctly structured operations.',
    ],
  },
  {
    name: 'Gillen',
    slug: 'gillen',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 3, tourism: 2 },
    why: [
      'Gillen is an established residential suburb in the southern part of Alice Springs with a higher household income profile than the city average — proximity to Alice Springs Hospital and the broader health precinct means the catchment includes senior medical staff, allied health professionals, and long-term residents with strong community loyalty habits.',
      'The hospital and health precinct proximity creates a consistent and substantial lunchtime and early-evening demand from medical and support staff — a customer segment that is present 365 days per year and has above-average per-visit spend expectations for quality and convenience.',
      'Competition is 3/10: the established residential character of Gillen and the strong professional catchment are under-served by quality hospitality. Quality cafe and casual dining concepts find a loyal community audience in Gillen without the competitive pressure of the CBD strip.',
      'Seasonality is 3/10: the professional and residential customer base in Gillen is far less exposed to the tourism seasonal cycle than CBD locations. The year-round health precinct workforce provides a stable revenue anchor through both the dry season tourism peak and the hot summer months.',
      'Demand is 6/10: the higher-income professional demographic and the health precinct workforce combine to create above-average demand density for Alice Springs standards. The market rewards quality over price sensitivity — operators who invest in product and service find a receptive audience.',
    ],
  },
  {
    name: 'Braitling',
    slug: 'braitling',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 4, tourism: 2 },
    why: [
      'Braitling is a northern residential suburb of Alice Springs with a moderate household demographic — a mixed residential area that serves long-term Alice Springs residents and some government housing. The catchment is relatively modest in spending capacity compared to Gillen or Desert Springs.',
      'Competition is 2/10: limited commercial activity in the northern residential corridor means genuine first-mover opportunity exists for operators who can serve the local community need. The absence of competition is accurate rather than aspirational — the catchment supports one or two well-positioned operators rather than a developing commercial precinct.',
      'Demand is 4/10: the moderate demographic and relatively small catchment in Alice Springs northern suburbs creates real but limited hospitality demand. Convenience food, basic cafe, and essential retail concepts that serve the daily needs of residents are better positioned than aspirational dining concepts that require a premium-spending customer base.',
      'Seasonality is 4/10: the extreme summer heat (November to March) affects all Alice Springs locations, and northern suburbs like Braitling have less protection from this cyclicality than the CBD which has year-round government trade. Summer months require clear planning for reduced foot traffic.',
      'Rent is 2/10: very low commercial rents in the northern residential corridor make break-even achievable at modest revenue volumes. This is the primary financial argument for operators considering Braitling — very low fixed cost base against a limited but real local demand.',
    ],
  },
  {
    name: 'Desert Springs',
    slug: 'desert-springs',
    factors: { demand: 6, rent: 4, competition: 2, seasonality: 3, tourism: 4 },
    why: [
      'Desert Springs is the premium residential suburb of Alice Springs — a professional and higher-income catchment built around the Alice Springs Golf Club. Residents include senior government officials, medical specialists, business owners, and long-term professionals who have chosen to settle in Alice Springs rather than transit through. This demographic has the highest per-visit spend potential in the city.',
      'The golf club and resort precinct creates a genuine tourism adjacency that is distinct from the CBD tourist market — corporate visitors, government delegations, and higher-end leisure travellers who stay in the Desert Springs area generate consistent hospitality demand during the dry season (May to September) and moderate demand year-round.',
      'Competition is 2/10: remarkably low for a premium residential market — the Desert Springs area is under-served by quality hospitality relative to the spending capacity of its resident base. Correctly positioned food and beverage concepts here face almost no direct competition and can build a loyal professional community following.',
      'Seasonality is 3/10: the professional residential catchment and golf resort positioning moderate the Alice Springs seasonal extremes. The desert resort visitor segment adds dry season revenue uplifts, while the resident professional base sustains year-round trade at above-average ticket values.',
      'Demand is 6/10: the combination of premium residential catchment, golf club lifestyle positioning, and resort visitor flow creates real demand for quality hospitality that the current operator supply does not adequately serve. This is a genuine unmet need rather than a speculative opportunity.',
    ],
  },
  {
    name: 'Stuart',
    slug: 'stuart',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 5, tourism: 3 },
    why: [
      'Stuart is a southern residential suburb of Alice Springs on the growth fringe — new residential development is bringing families and young professionals into the area, creating an emerging hospitality catchment that is currently underserved. The suburb sits along the Stuart Highway corridor, which creates some passing trade from travellers moving between Alice Springs and the southern regions.',
      'The Stuart Highway position creates a modest tourism adjacency (3/10) from through-traffic — travellers and transport workers using the main road corridor provide occasional hospitality demand, though this is irregular rather than reliable daily trade. Operators should model local residential trade as the foundation.',
      'Competition is 2/10: genuine first-mover opportunity in an emerging suburb. The population is growing but commercial development has not kept pace — quality convenience food and cafe concepts that establish community loyalty in Stuart now will capture the growing residential base before competition arrives.',
      'Seasonality is 5/10: the southern fringe position and the mix of permanent residents plus highway through-traffic creates slightly higher seasonal variation than established inner suburbs. The extreme summer heat still suppresses foot traffic from November to March, requiring operators to plan for the lean months.',
      'Rent is 2/10: the growth fringe position and limited commercial development keep rents very low in Stuart. Developers and landowners price commercial tenancies to attract the first operators who will anchor the emerging precinct — genuinely competitive entry terms for first movers.',
    ],
  },
]

const _ALICE_SPRINGS_BUILT = buildSuburbs(ALICE_SPRINGS_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAliceSpringsSuburbs(): AliceSpringsSuburb[] {
  return _ALICE_SPRINGS_BUILT
}

export function getAliceSpringsSuburb(nameOrSlug: string): AliceSpringsSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _ALICE_SPRINGS_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getAliceSpringsSuburbSlugs(): string[] {
  return _ALICE_SPRINGS_BUILT.map((s) => s.slug)
}

export function getAliceSpringsNearbySuburbs(currentSlug: string, limit = 3): AliceSpringsSuburb[] {
  const sorted = [..._ALICE_SPRINGS_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
