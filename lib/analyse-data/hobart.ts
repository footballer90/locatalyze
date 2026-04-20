/**
 * lib/analyse-data/hobart.ts
 * Engine-computed suburb data for Hobart, TAS.
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

export interface HobartSuburbSeed {
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

export interface HobartSuburb extends HobartSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: HobartSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: HobartSuburbSeed[]): HobartSuburb[] {
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

// ─── Hobart suburb seeds ──────────────────────────────────────────────────────

const HOBART_SEEDS: HobartSuburbSeed[] = [
  {
    name: 'Salamanca Place',
    slug: 'salamanca-place',
    factors: { demand: 9, rent: 7, competition: 7, seasonality: 6, tourism: 9 },
    why: [
      "Salamanca Place is Tasmania's premier commercial strip and the benchmark for tourist-facing hospitality — Saturday market days draw 20,000+ visitors and the historic sandstone warehouses command rents that reflect that demand.",
      "Tourism dependency is 9/10: the precinct is heavily reliant on interstate and international visitors whose spending peaks from November to April, creating a material revenue cliff in the June–August winter period.",
      "Competition is 7/10 — the strip is saturated with established operators, meaning new entrants need a highly differentiated concept and sufficient capital to survive the winter softness before building summer-season brand equity.",
      "Heritage listing constraints on the sandstone buildings limit fitout flexibility and increase compliance costs; tenants should budget AUD 15,000–25,000 above standard fitout costs for heritage-compliant works.",
      "The MONA effect is strongest here — ferry traffic from MONA docks at Brooke Street Pier, 400m away, and visitors typically combine MONA and Salamanca in the same day, concentrating high-spend foot traffic at weekends.",
    ],
  },
  {
    name: 'Battery Point',
    slug: 'battery-point',
    factors: { demand: 8, rent: 7, competition: 5, seasonality: 5, tourism: 8 },
    why: [
      "Battery Point is Hobart's most affluent inner suburb — historic Georgian and Victorian cottages house a professional demographic with above-average discretionary spend and strong loyalty to independent operators.",
      "Tourism is 8/10 from proximity to Salamanca and the Hobart waterfront; the neighbourhood's photogenic character attracts visitors who stay longer and spend more per visit than the average Salamanca tourist.",
      "Competition is 5/10 — heritage constraints limit commercial development, keeping operator density low and protecting established tenants from new entrants; spaces rarely become available.",
      "Seasonality is 5/10, moderated by the resident demographic — the professional base sustains meaningful winter trade that pure tourist strips cannot maintain, though summer revenue is still 30–40% above the winter baseline.",
      "Retail and hospitality operators who establish here benefit from word-of-mouth marketing driven by the suburb's social cohesion — the neighbourhood has a village dynamic that is rare in any Australian capital city.",
    ],
  },
  {
    name: 'North Hobart',
    slug: 'north-hobart',
    factors: { demand: 8, rent: 5, competition: 7, seasonality: 3, tourism: 5 },
    why: [
      "Elizabeth Street in North Hobart is Tasmania's best independent business strip — 80+ operators across food, beverage, and retail serve a culturally engaged, educated demographic with a strong preference for independent over chain.",
      "Competition is 7/10 on the strip itself, distributed across a walkable 600m corridor that allows differentiated concepts to find unclaimed positions; undifferentiated café or casual dining formats face direct comparison with established venues.",
      "Demand is 8/10 anchored by dual catchments: inner-north professional residents as weekday regulars, and a broader citywide destination-dining audience that drives strong Friday and Saturday evening trade.",
      "Rent at $60–$90/m² is materially lower than Salamanca at comparable foot traffic volumes — North Hobart offers the best rent-to-demand ratio of any Hobart inner precinct for operators who do not need tourist revenue.",
      "Tourism is 5/10 from accommodation proximity and festival overflow during Dark Mofo and Taste of Tasmania, adding meaningful revenue uplifts in June and December without creating full tourist-trade dependency.",
    ],
  },
  {
    name: 'Sandy Bay',
    slug: 'sandy-bay',
    factors: { demand: 8, rent: 6, competition: 5, seasonality: 2, tourism: 4 },
    why: [
      "Sandy Bay carries Hobart's highest-income residential demographic — median household income of $98K and a concentration of professionals, academics from the adjacent University of Tasmania, and established families with strong café and dining spend.",
      "Competition is 5/10: the commercial strip along Sandy Bay Road has enough peers to validate the market but has not reached the saturation of North Hobart — quality operators find loyal regulars who visit 3–4 times weekly.",
      "Low seasonality (2/10) reflects the stable residential base; Sandy Bay trade is consistent across all 52 weeks with no meaningful dependence on tourist flows or festival events.",
      "Rent at $55–$75/m² is elevated for a suburban strip but justified by the income demographic — willingness-to-pay for specialty coffee and premium casual dining is the highest of any non-tourist Hobart suburb.",
      "The University of Tasmania Sandy Bay campus proximity adds a secondary daytime demographic of staff and postgraduate students who supplement the core professional residential customer base.",
    ],
  },
  {
    name: 'Bellerive',
    slug: 'bellerive',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 3, tourism: 5 },
    why: [
      "Bellerive sits at the centre of the east shore's most established commercial precinct — Bligh Street and the Bellerive Village strip serve a professional residential catchment across Clarence City's growing population.",
      "Bellerive Oval (Blundstone Arena) is Tasmania's major sporting and concert venue; event days generate significant revenue uplifts for food and beverage operators within 500m and establish the suburb as a destination rather than a purely residential catchment.",
      "Tourism is 5/10 from the Bellerive ferry terminal and event visitors — the oval hosts Ashes Tests, BBL matches, and major concerts that attract interstate visitors who supplement local trade on event weekends.",
      "Competition is 5/10 — sufficient operators to validate demand, but the east shore village format means supply gaps exist for operators who position clearly against the existing mix.",
      "Rent at $50–$70/m² reflects east shore pricing — 15–20% below equivalent North Hobart positions with a comparable professional demographic, making Bellerive one of Hobart's better value-entry inner positions.",
    ],
  },
  {
    name: 'New Town',
    slug: 'new-town',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "New Town Road is one of Hobart's most underrated commercial strips — a suburban village format serving a residential catchment that increasingly skews professional as housing affordability pressure pushes buyers north from Sandy Bay and West Hobart.",
      "Rent at $45–$65/m² is among the most accessible of any Hobart inner suburb with genuine residential density — operators enter at low cost and build a loyal local base before pricing pressure arrives.",
      "Competition is 4/10: the strip has fewer operators than the demographic quality warrants, creating genuine supply gaps for cafés, specialty food, and service businesses that are well-matched to the resident profile.",
      "Low seasonality (2/10) reflects the residential base — New Town trade is built on repeat visits from locals rather than tourist flows, which produces consistent weekly revenue without meaningful seasonal variation.",
      "New Town is in the early stages of the same gentrification trajectory that North Hobart experienced in the 2010s — operators who enter now build brands ahead of the demographic curve and the rent repricing that follows.",
    ],
  },
  {
    name: 'West Hobart',
    slug: 'west-hobart',
    factors: { demand: 7, rent: 4, competition: 3, seasonality: 2, tourism: 3 },
    why: [
      "West Hobart's Cascade Road and Hill Street commercial nodes serve a professional demographic that mirrors Sandy Bay in income profile at materially lower rent — an underrated inner-west entry point.",
      "Competition is 3/10 — notably low for a suburb with this demographic quality. West Hobart has fewer cafés per capita than any comparable Hobart inner suburb, creating a genuine opportunity for operators who can build a local community positioning.",
      "The suburb's leafy, residential character creates a strong café culture expectation without the competitive density that compresses margins on Elizabeth Street or Salamanca — the market rewards quality execution over competitive positioning.",
      "Low seasonality (2/10) reflects the purely residential demand base; West Hobart has no tourist exposure and very limited festival dependence, producing stable weekly revenue patterns year-round.",
      "Heritage-listed residential streets attract an established professional demographic with high willingness-to-pay; specialty coffee and premium casual formats consistently outperform value concepts in this catchment.",
    ],
  },
  {
    name: 'Moonah',
    slug: 'moonah',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Moonah's Main Road commercial strip serves Hobart's most culturally diverse residential population — a mix of established working families, recent migrants, and a growing creative worker contingent that is generating demand for quality independent food and beverage operators.",
      "Rent at $35–$50/m² is among the lowest in greater Hobart while remaining in the inner metropolitan area — break-even is achievable at substantially lower revenue thresholds than North Hobart or Sandy Bay positions.",
      "Competition is 4/10 with a multicultural food offer that creates demand for complementary concepts — operators who position as quality independent rather than ethnic-specialist find a market with limited direct competition.",
      "The suburb's industrial-edge creative precinct is emerging, attracting studio spaces, makers, and hospitality concepts that serve the growing professional creative worker population moving in from North Hobart.",
      "Low seasonality (2/10) and low tourism (2/10) reflect a market that is built entirely on resident spend — predictable and consistent, but requiring genuine community investment rather than destination marketing.",
    ],
  },
  {
    name: 'Glenorchy',
    slug: 'glenorchy',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      "Glenorchy is greater Hobart's northern commercial hub — the main retail spine along Main Road anchors foot traffic from a large working-class residential catchment that extends across the Derwent Valley corridor.",
      "Rent at $30–$45/m² is the lowest of any suburban commercial area within 15km of Hobart CBD — entry costs and break-even thresholds are materially lower than equivalent southern suburbs.",
      "Competition is 5/10 with a mix of national chains and established independents; new entrants need differentiation from the existing format mix to avoid direct comparison with incumbents who have established local loyalty.",
      "The suburb's position on the Brooker Highway corridor creates strong drive-through trade for food and beverage operators — capture rates from passing traffic can supplement the local residential base meaningfully.",
      "Glenorchy City Council's commercial revitalisation strategy is bringing new development and residential density to the area — operators who enter now position ahead of the demographic upgrade.",
    ],
  },
  {
    name: 'Kingston',
    slug: 'kingston',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "Kingston is greater Hobart's southern growth centre — population growth from the Kingborough corridor is delivering new professional residents faster than commercial supply is appearing, creating genuine demand gaps for quality operators.",
      "Rent at $35–$55/m² reflects the suburban character but the income demographic is increasingly professional as infrastructure investment in the Channel Highway corridor attracts families from inner Hobart.",
      "Competition is 4/10 — the Channel Court and Kingston Beach precincts have enough operators to validate demand, but independent quality operators face limited direct competition and can build loyal local followings.",
      "Tourism is 3/10 from proximity to Huon Valley day-trip routes and Kingston Beach — the beach precinct adds a seasonal weekend uplift without creating full tourist-trade dependency.",
      "The suburb's role as southern Hobart's commercial anchor means it captures spending from a broad hinterland of Channel Peninsula and Huon Valley residents — the effective catchment extends well beyond Kingston itself.",
    ],
  },
  {
    name: 'Rosny Park',
    slug: 'rosny-park',
    factors: { demand: 6, rent: 4, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "Rosny Park is the east shore's primary retail hub — Eastlands Shopping Centre anchors substantial foot traffic from Clarence City's 60,000+ residents, providing a captive customer base for complementary independent operators.",
      "Rent at $45–$65/m² reflects the shopping centre adjacency premium but remains below North Hobart and Sandy Bay for a comparable level of foot traffic — one of the better value positions on the east shore.",
      "Competition is 4/10 outside the shopping centre itself — the surrounding commercial streets have limited quality independent operators despite the residential density and spending capacity of the Clarence catchment.",
      "Tourism is 3/10 from Rosny Hill Nature Recreation Area and east shore visitor accommodation — weekend traffic from Bellerive Oval events adds meaningful revenue uplift to operators within the precinct.",
      "The east shore is undergoing sustained residential growth as the Kangaroo Bay urban renewal project delivers new apartments and infrastructure — Rosny Park operators are positioned to capture a growing and increasingly affluent catchment.",
    ],
  },
  {
    name: 'Lindisfarne',
    slug: 'lindisfarne',
    factors: { demand: 6, rent: 4, competition: 3, seasonality: 3, tourism: 4 },
    why: [
      "Lindisfarne's village commercial strip on Derwent Avenue serves an established east shore residential demographic with above-average income and strong café culture expectations — an underserved market for quality independent operators.",
      "Competition is 3/10 — unusually low for a suburb with this demographic profile. Lindisfarne has fewer food and beverage operators per capita than comparable inner Hobart suburbs, creating genuine supply gaps.",
      "Tourism is 4/10 from the Derwent River foreshore, the Lindisfarne Bay area, and proximity to the East Derwent Highway visitor corridor — weekends draw broader east shore visitors beyond the immediate residential catchment.",
      "Rent at $40–$60/m² reflects the village strip character — well below equivalent North Hobart or Bellerive positions despite a comparable professional residential demographic.",
      "The suburb's heritage character and waterfront proximity create a strong quality-of-life positioning that attracts the professional demographic operators most want to serve — loyal, repeat-visit customers with high willingness-to-pay.",
    ],
  },
  {
    name: 'Howrah',
    slug: 'howrah',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Howrah serves the outer east shore residential catchment — a suburban strip along Howrah Road with limited existing competition and a growing residential population that is underserved by quality independent operators.",
      "Rent at $30–$45/m² is among the lowest of any accessible greater Hobart commercial location — the low entry cost makes break-even achievable at modest revenue levels, reducing first-year risk for independent operators.",
      "Competition is 3/10 — the suburb has few established operators, meaning a quality independent can quickly become the local anchor and build strong repeat-visit loyalty without fighting established incumbents.",
      "The outer east shore demographic is predominantly owner-occupier families with stable income — the customer base is loyal and consistent, but the catchment size limits maximum revenue ceiling compared to inner suburbs.",
      "Howrah's proximity to Rokeby and Tranmere expands the effective catchment for a well-positioned operator — an accessible location with parking serves a combined east shore residential area of 25,000+ residents.",
    ],
  },
  {
    name: 'Bridgewater',
    slug: 'bridgewater',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      "Bridgewater is the outer northern gateway to greater Hobart — a working-class residential suburb where median household income ($58K) constrains premium pricing and the viable business formats are value-oriented food and essential services.",
      "Rent at $20–$35/m² is the lowest in the greater Hobart dataset, making break-even achievable at very low revenue thresholds — the economics work for operators who correctly calibrate their price point to the catchment.",
      "Competition is 2/10: very few operators means a first entrant can establish a strong local monopoly, but the limited spending capacity of the catchment constrains how much revenue that monopoly position can actually generate.",
      "The suburb sits on the Midland Highway, adding some drive-through trade from the Hobart–Launceston corridor — fuel, food, and convenience operators benefit from passing traffic in addition to the local residential base.",
      "Demand is 4/10 reflecting a market that rewards essential services and value positioning over quality-independent concepts — the gap between customer expectation and premium product pricing is wide in this catchment.",
    ],
  },
]

const _HOBART_BUILT = buildSuburbs(HOBART_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getHobartSuburbs(): HobartSuburb[] {
  return _HOBART_BUILT
}

export function getHobartSuburb(nameOrSlug: string): HobartSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _HOBART_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getHobartSuburbSlugs(): string[] {
  return _HOBART_BUILT.map((s) => s.slug)
}

export function getHobartNearbySuburbs(currentSlug: string, limit = 3): HobartSuburb[] {
  const sorted = [..._HOBART_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
