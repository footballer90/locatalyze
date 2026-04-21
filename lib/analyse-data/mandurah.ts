/**
 * lib/analyse-data/mandurah.ts
 * Engine-computed suburb data for Mandurah, WA.
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

export interface MandurahSuburbSeed {
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

export interface MandurahSuburb extends MandurahSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: MandurahSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: MandurahSuburbSeed[]): MandurahSuburb[] {
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

// ─── Mandurah suburb seeds ────────────────────────────────────────────────────

const MANDURAH_SEEDS: MandurahSuburbSeed[] = [
  {
    name: 'Mandurah City Centre',
    slug: 'mandurah-city-centre',
    state: 'WA',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 4, tourism: 7 },
    why: [
      'Mandurah Terrace and the coastal esplanade are the primary hospitality destination in this city of 100,000 — ocean-facing dining positions attract both the substantial retiree and sea-change resident base and the tourist visitors who come for the canals, dolphin cruises, and Mandurah waterfront experience.',
      'Tourism is 7/10: the Mandurah waterfront draws day-trippers and overnight visitors from Perth (80km north) year-round, with a particularly strong summer season from November to March when the esplanade strip reaches its highest foot traffic volumes.',
      'Competition is 6/10: a meaningful concentration of established operators along the Mandurah Terrace and City Lane precinct — independent operators need clear differentiation from incumbents, but the tourist and residential demand profile supports genuinely well-positioned concepts.',
      'Seasonality is 4/10: summer uplifts are real but the large permanent resident base — Mandurah is WA\'s second-largest non-metropolitan city — moderates the seasonal revenue cliff that smaller coastal towns face.',
      'Rent is 5/10 — meaningfully higher than outer Mandurah suburbs but still well below Perth metropolitan commercial rents, representing reasonable value for a coastal city centre commercial position.',
    ],
  },
  {
    name: 'Halls Head',
    slug: 'halls-head',
    state: 'WA',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      'Halls Head is the dominant suburban commercial hub in Mandurah\'s southern corridor — the Halls Head Central shopping centre anchors a large catchment of established residential suburbs and generates reliable year-round retail foot traffic from the surrounding family demographic.',
      'Competition is 5/10: Halls Head Central and the surrounding commercial strip have meaningful operator density, but the large residential catchment supports quality independents that are differentiated from the chain incumbents already established in the precinct.',
      'Seasonality is 2/10: the residential catchment and suburban commercial hub positioning create highly consistent year-round trade that is almost entirely insulated from the tourism seasonality affecting Mandurah City Centre.',
      'The established family demographic in Halls Head has predictable spending patterns and strong community loyalty habits — operators who become embedded in the local community build durable trade rather than chasing the variable tourist and visitor market.',
      'Rent is 4/10 — affordable suburban commercial rates that allow operators to reach break-even at achievable volume levels, without the rent pressure of the City Centre esplanade strip.',
    ],
  },
  {
    name: 'Falcon',
    slug: 'falcon',
    state: 'WA',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 3, tourism: 3 },
    why: [
      'Falcon is a coastal lifestyle suburb that has attracted a significant sea-change demographic from Perth — residents who have moved south for the ocean lifestyle bring genuine food culture expectations and above-average household incomes to a suburb that currently lacks quality independent hospitality.',
      'Competition is 3/10: genuinely low — Falcon\'s coastal residential community currently travels to Mandurah City Centre or Halls Head for quality café and dining options, representing a first-mover opportunity for operators positioned to serve the local demographic.',
      'Seasonality is 3/10: the permanent sea-change resident base provides consistent year-round trade, with a modest summer uplift from extended visitor stays and holiday letting activity in the coastal village.',
      'The boutique food and lifestyle positioning suits Falcon\'s demographic — quality-casual café concepts, artisan food, and specialty retail that serve the lifestyle aspirations of the sea-change community perform better here than volume-driven fast food formats.',
      'Rent is 3/10 — competitive coastal suburb commercial rates that allow well-positioned operators to build a sustainable business without the rent pressure of the City Centre or larger commercial hubs.',
    ],
  },
  {
    name: 'Meadow Springs',
    slug: 'meadow-springs',
    state: 'WA',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Meadow Springs is one of the largest masterplanned residential developments in the Mandurah corridor — a growing catchment of families and owner-occupiers who currently travel to Halls Head or Mandurah City Centre for quality hospitality, creating a genuine unmet local demand.',
      'Competition is 3/10: the suburb\'s residential scale outpaces its commercial development — operators who establish here before the supply catches up capture the local catchment with genuine first-mover advantage in a market that has real demand volume.',
      'Seasonality is 2/10: pure residential trade environment with negligible tourism and highly consistent year-round demand driven by families, commuters, and the growing population of the masterplanned community.',
      'The family demographic in Meadow Springs has strong demand for child-friendly casual dining, convenience food, and community café concepts — operators who correctly position for the residential lifestyle create durable trade from repeat local customers.',
      'Rent is 3/10 — new development commercial tenancies in masterplanned estates are priced to attract operators, with rent terms that reflect the early-stage market rather than the established commercial density of the city centre.',
    ],
  },
  {
    name: 'Greenfields',
    slug: 'greenfields',
    state: 'WA',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      'Greenfields is an established northern residential suburb with a stable working family demographic that generates consistent convenience food and hospitality demand — the suburb sits in the corridor between Mandurah City Centre and Halls Head without a dominant commercial hub of its own.',
      'Competition is 3/10: low operator density relative to the residential catchment — Greenfields residents travel outward for hospitality rather than having quality options locally, which represents a genuine convenience-oriented opportunity for well-positioned operators.',
      'Seasonality is 2/10: established residential suburb with stable year-round trade and minimal tourism exposure — the predictable demand environment suits operators who value consistent revenue over high-peak seasonal income.',
      'The convenience food demand in Greenfields is driven by the working family lifestyle — breakfast café, takeaway, and casual lunch formats that fit the commuter and after-school schedule perform better than destination dining concepts.',
      'Rent is 2/10 — the lowest commercial rents in the Mandurah northern corridor, making the economics accessible for operators entering a lower-volume but consistent residential market.',
    ],
  },
  {
    name: 'Dudley Park',
    slug: 'dudley-park',
    state: 'WA',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Dudley Park is an inner suburban residential suburb adjacent to the Mandurah City Centre with a modest commercial strip that serves the local community — proximity to the City Centre creates some incidental foot traffic but the suburb\'s own demand base is smaller than the commercial hub.',
      'Competition is 4/10: the commercial strip has incumbent operators including a mix of established local businesses and service providers — new entrants need to offer a differentiated proposition to capture a share of the modest but consistent local demand.',
      'Seasonality is 2/10: the residential character creates year-round predictable trade, though the suburb\'s proximity to the City Centre means some of its potential customers choose City Centre options for discretionary spending.',
      'The inner residential demographic in Dudley Park values convenience and local community — café and casual food operators who build a genuine neighbourhood presence create durable trade from residents who prefer not to drive to the City Centre for everyday hospitality.',
      'Rent is 3/10 — inner-suburb commercial rates that are below City Centre levels, making entry achievable for operators serving the local residential catchment with modest revenue projections.',
    ],
  },
  {
    name: 'Rockingham',
    slug: 'rockingham',
    state: 'WA',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 3, tourism: 5 },
    why: [
      'Rockingham is a major coastal city in its own right — a 110,000-person metropolitan area 40km north of Mandurah with its own active commercial centre, waterfront hospitality precinct, and growing professional residential demographic.',
      'Competition is 6/10: Rockingham\'s commercial centre has meaningful operator density — established chains, local independents, and a waterfront dining strip that has attracted significant investment. New entrants need genuine differentiation.',
      'Tourism is 5/10: Rockingham\'s proximity to Perth, access to the Penguin Island tourist attraction, and the Shoalwater Bay marine park create a consistent tourism overlay that lifts hospitality demand above the base residential trade.',
      'Seasonality is 3/10: Rockingham\'s size (larger than Mandurah) and metropolitan proximity create more year-round trade consistency than smaller regional coastal towns — the tourist uplift is real but moderate rather than transformative.',
      'Rent is 5/10 — commercial rents in Rockingham\'s centre are higher than outer Mandurah suburbs, reflecting the city\'s scale, population density, and proximity to the Perth metropolitan area.',
    ],
  },
  {
    name: 'Pinjarra',
    slug: 'pinjarra',
    state: 'WA',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      'Pinjarra is an inland rural town on the Murray River 30km east of Mandurah — the administrative centre of the Murray River region with a small but stable resident population supplemented by the surrounding agricultural community and passing highway trade.',
      'Competition is 2/10: very low operator density that accurately reflects the genuine scale of the market — there is real but modest demand from the local community and highway travellers, and first-mover operators face limited competitive pressure.',
      'Rent is 2/10 — the lowest commercial rents in the Mandurah region, making the economics accessible for community-focused and essential-service concepts that correctly calibrate their revenue expectations to the smaller catchment.',
      'The rural community demographic values reliability, value for money, and local connection — operators who embed themselves in the Pinjarra community and serve the agricultural and residential catchment build genuinely loyal trade from a small but appreciative customer base.',
      'Seasonality is 2/10: the inland rural character creates consistent year-round trade without the coastal tourism variation affecting Mandurah City Centre — predictable, modest, and entirely dependent on the local and passing trade.',
    ],
  },
]

const _MANDURAH_BUILT = buildSuburbs(MANDURAH_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getMandurahSuburbs(): MandurahSuburb[] {
  return _MANDURAH_BUILT
}

export function getMandurahSuburb(nameOrSlug: string): MandurahSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _MANDURAH_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getMandurahSuburbSlugs(): string[] {
  return _MANDURAH_BUILT.map((s) => s.slug)
}

export function getMandurahNearbySuburbs(currentSlug: string, limit = 3): MandurahSuburb[] {
  const sorted = [..._MANDURAH_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
