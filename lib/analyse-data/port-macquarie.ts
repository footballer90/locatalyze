/**
 * lib/analyse-data/port-macquarie.ts
 * Engine-computed suburb data for Port Macquarie, NSW.
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

export interface PortMacquarieSuburbSeed {
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

export interface PortMacquarieSuburb extends PortMacquarieSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: PortMacquarieSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: PortMacquarieSuburbSeed[]): PortMacquarieSuburb[] {
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

// ─── Port Macquarie suburb seeds ─────────────────────────────────────────────

const PORT_MACQUARIE_SEEDS: PortMacquarieSuburbSeed[] = [
  {
    name: 'Port Macquarie CBD',
    slug: 'port-macquarie-cbd',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 4, tourism: 7 },
    why: [
      'Port Macquarie CBD is the primary retail and hospitality hub for the Hastings region — the concentration along Horton Street and the riverfront Short Street precinct creates the highest foot traffic density in the city, drawing both local residents and the substantial tourist trade that defines Port Macquarie as one of the NSW mid-North Coast\'s premier holiday destinations.',
      'Tourism is 7/10: Port Macquarie receives over 3 million visitors annually, and the CBD is the primary recipient of visitor food and beverage spending — the riverfront precincts, the Koala Hospital nearby, and the coastal walk network funnel significant tourist volume through the central business district.',
      'Demand is 7/10: the CBD serves both a growing resident population of approximately 50,000 and a strong regional service catchment — office workers, government services, and the TAFE and Charles Sturt University presence generate consistent weekday demand that complements weekend and holiday visitor trade.',
      'Competition is 6/10: the CBD has the highest operator density in Port Macquarie, with a mix of established national chains and well-regarded local independents — differentiation in quality, concept, or demographic targeting is required to displace incumbent operators.',
      'Seasonality is 4/10: the CBD demand profile is better balanced than the pure beachside locations because the office worker and residential trade moderates the tourist-driven seasonal cycle, though summer and school holiday peaks are still pronounced and operators must plan for the shoulder months.',
    ],
  },
  {
    name: 'Westport Park',
    slug: 'westport-park',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 5, tourism: 7 },
    why: [
      'Westport Park is the beachside dining and lifestyle precinct adjacent to Town Beach and the Hastings River foreshore — the combination of ocean views, the coastal walk connectivity, and proximity to the CBD creates a premium positioning for hospitality concepts targeting both quality-seeking residents and the visitor market.',
      'Tourism is 7/10: the Town Beach and coastal walk precinct generates consistent tourist foot traffic through the year, with the beachside positioning creating demand for quality breakfast, casual lunch, and waterfront dining from visitors who specifically seek the waterfront dining experience during their Port Macquarie stay.',
      'Demand is 6/10: the Westport Park foreshore is a destination within Port Macquarie rather than a commuter or convenience trade area — operators who position correctly for the lifestyle dining market access a customer base willing to spend on quality in a premium setting.',
      'Competition is 4/10: the waterfront precinct has fewer operators than the CBD strip, creating genuine opportunity for quality independent concepts to establish a premium position — the market is not saturated, and the tourism flow provides volume to support well-differentiated operators.',
      'Seasonality is 5/10: the beachside positioning creates a pronounced summer peak from December to January and school holiday spikes, with the June to August period being softer — operators need a strong local residential following to sustain the quieter winter months.',
    ],
  },
  {
    name: 'Settlement City',
    slug: 'settlement-city',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 2, tourism: 2 },
    why: [
      'Settlement City is Port Macquarie\'s major regional shopping centre, anchored by Myer, Kmart, Coles, and Woolworths — the combined anchor tenancy mix generates the highest consistent foot traffic volumes in the Hastings region and creates a year-round retail trade environment that is largely insulated from coastal tourism seasonality.',
      'Demand is 7/10: the shopping centre catchment draws from across Port Macquarie and the broader Hastings Valley, with the anchor tenancy pull concentrating retail spending from a regional population base that relies on Settlement City for fashion, homewares, food, and services.',
      'Seasonality is 2/10: the lowest in the Port Macquarie dataset — shopping centre trade is driven by resident shopping routines rather than tourism, making the December to January school holiday season relatively consistent with the rest of the year compared to the beachside precincts.',
      'Competition is 6/10: the national chain presence in the food court and specialty retail categories sets a quality and pricing benchmark that independent operators must meet or exceed — the foot traffic volume justifies the higher competition, but operators need clear differentiation to build a loyal following.',
      'Tourism is 2/10: Settlement City does not benefit from tourist trade — visitors to Port Macquarie seek the beachside and waterfront precincts rather than the shopping centre, making this a purely resident-facing retail and food trade location.',
    ],
  },
  {
    name: 'Lake Cathie',
    slug: 'lake-cathie',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 5, tourism: 4 },
    why: [
      'Lake Cathie is a coastal residential growth area 15km south of Port Macquarie on the Limeburners Creek system — a rapidly growing family and sea-change demographic is creating increasing demand for quality local hospitality and convenience retail that currently requires a trip to Port Macquarie CBD to access.',
      'Competition is 2/10: the limited operator supply is a genuine first-mover opportunity — the emerging residential base has sufficient scale to support a quality independent cafe or casual dining concept, and the absence of quality local alternatives creates a captive local market for correctly positioned operators.',
      'Tourism is 4/10: Lake Cathie has a modest coastal tourism draw from the lake and beach environment, creating some visitor trade overlay during summer and school holiday periods that supplements the resident customer base.',
      'Demand is 5/10: the current population scale is on the threshold of viability for a quality independent operator — the growth trajectory supports entry now for operators who can sustain a ramp-up period, but the resident catchment is not yet deep enough to support multiple competing concepts simultaneously.',
      'Seasonality is 5/10: the coastal positioning and tourism overlay create summer peaks and winter softness — operators who build strong local community loyalty with the resident base navigate the seasonal cycle more effectively than those who rely primarily on the tourist segment.',
    ],
  },
  {
    name: 'Wauchope',
    slug: 'wauchope',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 3, tourism: 3 },
    why: [
      'Wauchope is the inland service town 16km west of Port Macquarie, serving the agricultural and timber hinterland of the Hastings Valley — a community of approximately 6,000 people with a genuine but modest demand for food and hospitality services and one of the lowest commercial rent structures in the region.',
      'Demand is 5/10: the combination of a resident population and the rural hinterland catchment creates consistent year-round demand at a modest scale — Wauchope is the service hub for farming families, forestry workers, and the broader inland community who travel from smaller surrounding settlements.',
      'Seasonality is 3/10: Wauchope\'s inland position insulates it from the coastal tourism seasonal cycle — trade is driven by the resident and agricultural community rather than holiday visitor patterns, creating a more stable year-round revenue profile than any Port Macquarie coastal suburb.',
      'Competition is 3/10: the limited operator base reflects genuine scale constraints rather than an untapped demand opportunity — Wauchope is a market that rewards the right operator at the right scale, not a location for growth-oriented hospitality concepts.',
      'Tourism is 3/10: Wauchope has modest tourism relevance through the Timbertown heritage attraction and passing tourist traffic on the Oxley Highway connecting the Pacific Highway to the New England region, providing a low-level visitor trade overlay without creating tourism dependency.',
    ],
  },
  {
    name: "Flynn's Beach",
    slug: 'flynns-beach',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 6, tourism: 7 },
    why: [
      "Flynn's Beach is one of Port Macquarie's most popular surf and family beaches — a concentration of holiday accommodation, a defined beach village atmosphere, and consistent visitor demand for premium-casual dining and quality coffee makes this one of the strongest seasonal hospitality locations on the NSW mid-North Coast.",
      'Tourism is 7/10: the beach attracts significant domestic holiday maker volume from Sydney and the Hunter region during summer and school holidays — food and beverage operators adjacent to the beach foreshore capture tourist spending from visitors who are in an elevated spending mindset during their holiday.',
      'Demand is 6/10: the beach village character and the quality of the surrounding residential demographic create a genuine food culture expectation — local residents and holidaymakers share a preference for quality independent operators over generic fast food, supporting above-average per-visit spend.',
      'Seasonality is 6/10: the beach-driven demand profile creates a very pronounced December to January peak and Easter spike, with the May to August period being materially softer — operators without a strong local residential following face significant cash flow pressure during the quieter six months of the year.',
      "Competition is 4/10: Flynn's Beach has established operators but genuine room for quality differentiation — the tourist volume during peak season creates space for multiple concepts to coexist, and the quality-conscious demographic rewards operators who set a higher standard.",
    ],
  },
  {
    name: 'Bonny Hills',
    slug: 'bonny-hills',
    factors: { demand: 4, rent: 3, competition: 2, seasonality: 5, tourism: 4 },
    why: [
      'Bonny Hills is a quiet coastal village 15km south of Port Macquarie — a genuine sea-change and lifestyle destination that has attracted a demographic of well-educated, income-secure residents who have deliberately chosen a smaller, quieter community over the bustle of the Port Macquarie urban area.',
      'Demand is 4/10: the resident population of Bonny Hills is small, and the market scale is genuinely limited — operators who enter this market must correctly calibrate to the catchment size and accept lower revenue ceilings than Port Macquarie urban locations as the price of the low-competition, low-rent environment.',
      'Competition is 2/10: the very low operator density is accurate to the market scale — there is genuine opportunity for a first-rate independent cafe or specialty food concept to become the defining local operator, but the catchment size means the revenue opportunity is capped.',
      'Tourism is 4/10: Bonny Hills benefits from a modest coastal tourism draw and day-trip visitors from Port Macquarie seeking the quieter northern beaches atmosphere — this visitor overlay provides some revenue uplifts in summer and long weekends without creating the extreme seasonality of the main tourist beaches.',
      'Seasonality is 5/10: the coastal positioning creates summer peaks, but the predominantly resident-focused demand profile means the seasonal swing is less extreme than the major Port Macquarie tourist beaches — operators who establish genuine local loyalty sustain consistent trade through the quieter months.',
    ],
  },
  {
    name: 'Laurieton',
    slug: 'laurieton',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 4, tourism: 5 },
    why: [
      'Laurieton is the principal village of the Camden Haven estuary on the southern edge of the Hastings region — a lifestyle food scene has emerged in recent years around the estuary environment, with quality independent operators drawing both the local sea-change demographic and day-trip visitors from Port Macquarie and the broader mid-North Coast.',
      'Tourism is 5/10: the Camden Haven National Park, the estuary boating and fishing scene, and the village\'s growing reputation as a quality food destination create a genuine visitor trade overlay — Laurieton draws deliberate visitors rather than transit traffic, which translates into higher per-visit spend from a quality-seeking tourist segment.',
      'Demand is 5/10: the resident community of the Camden Haven has grown substantially through lifestyle migration, and the demographic quality is above the regional average — sea-change households with metropolitan food culture expectations are actively seeking quality independent operators to establish in their community.',
      'Competition is 3/10: the operator base is limited relative to the demand signals — the growth of quality food culture in Laurieton has created space for additional concepts, and the early operators who have established here have built strong local loyalty without significant competitive pressure.',
      'Seasonality is 4/10: Laurieton\'s demand profile is more balanced than the major Port Macquarie tourist beaches because the resident base is larger relative to the tourist component — summer holiday visitor volume adds to rather than dominates the trade pattern, moderating the seasonal swing.',
    ],
  },
]

const _PORT_MACQUARIE_BUILT = buildSuburbs(PORT_MACQUARIE_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getPortMacquarieSuburbs(): PortMacquarieSuburb[] {
  return _PORT_MACQUARIE_BUILT
}

export function getPortMacquarieSuburb(nameOrSlug: string): PortMacquarieSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _PORT_MACQUARIE_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getPortMacquarieSuburbSlugs(): string[] {
  return _PORT_MACQUARIE_BUILT.map((s) => s.slug)
}

export function getPortMacquarieNearbySuburbs(currentSlug: string, limit = 3): PortMacquarieSuburb[] {
  const sorted = [..._PORT_MACQUARIE_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
