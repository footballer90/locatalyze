/**
 * lib/analyse-data/adelaide.ts
 * Engine-computed suburb data for Adelaide, SA.
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

export interface AdelaideSuburbSeed {
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

export interface AdelaideSuburb extends AdelaideSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: AdelaideSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: AdelaideSuburbSeed[]): AdelaideSuburb[] {
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

// ─── Adelaide suburb seeds ────────────────────────────────────────────────────

const ADELAIDE_SEEDS: AdelaideSuburbSeed[] = [
  {
    name: 'Norwood',
    slug: 'norwood',
    factors: { demand: 9, rent: 6, competition: 6, seasonality: 2, tourism: 4 },
    why: [
      'The Parade is Adelaide\'s benchmark independent hospitality strip — 200+ independent operators, the highest pedestrian density in SA outside Rundle Street, and a café culture with nationally recognised alumni.',
      'Competition is 6/10, elevated but distributed across a long strip, meaning differentiated concepts find unclaimed positions; undifferentiated operators face direct comparison with established venues.',
      'Demand is anchored by a dual demographic: inner-east professional residents as weekday regulars, and a broader eastern suburbs catchment driving weekend destination visits.',
    ],
  },
  {
    name: 'Unley',
    slug: 'unley',
    factors: { demand: 8, rent: 6, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      'King William Road is Adelaide\'s most consistently high-income café strip — the household income demographic in Unley ($97K median) is the strongest of any suburban strip outside North Adelaide and Norwood.',
      'Competition is 5/10: enough peers to validate the market, but the strip is not saturated — quality operators find loyal regulars who visit 3–4 times weekly.',
      'Low seasonality (2/10) reflects the stable professional residential base; Unley trade is consistent across all 52 weeks with no meaningful holiday dips.',
    ],
  },
  {
    name: 'Hyde Park',
    slug: 'hyde-park',
    factors: { demand: 8, rent: 5, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      'King William Road south of Unley Road has a high-income residential catchment with above-average spend on specialty coffee and casual dining, supported by a dense apartment population.',
      'Rent is 5/10 — materially lower than Norwood for comparable demographic quality, making Hyde Park one of the better inner-south entry points.',
      'Low competition (5/10) and low seasonality (2/10) create a reliable, repeatable trade environment for well-positioned independent operators.',
    ],
  },
  {
    name: 'North Adelaide',
    slug: 'north-adelaide',
    factors: { demand: 8, rent: 6, competition: 6, seasonality: 3, tourism: 5 },
    why: [
      'O\'Connell Street and Melbourne Street together deliver the strongest restaurant-and-café street precinct in Adelaide, drawing a professional and tourist demographic with above-average dinner spend.',
      'Tourism is 5/10 from proximity to the CBD and Adelaide Oval — event days (AFL, cricket, concerts) create significant revenue uplifts for food and beverage operators.',
      'Competition is 6/10 and rents are 6/10 — the market is mature, requiring a clearly differentiated concept; operators who blend into existing formats underperform.',
    ],
  },
  {
    name: 'Adelaide CBD',
    slug: 'adelaide-cbd',
    factors: { demand: 9, rent: 8, competition: 7, seasonality: 3, tourism: 7 },
    why: [
      'Rundle Street is one of Australia\'s top five hospitality precincts by venue quality per square metre — foot traffic is high and consistent, but rents at $8,000–$22,000/month require premium volume or premium price.',
      'Tourism is 7/10: the Adelaide CBD draws strong interstate and international visitors, particularly during Fringe, WOMAD, and WOMADelaide — which can lift operator revenue 30–50% in peak weeks.',
      'Competition is 7/10 — the highest density in SA — meaning only operators with a clear point of difference sustain margins; generic café or casual dining formats are outcompeted within 18 months.',
    ],
  },
  {
    name: 'Prospect',
    slug: 'prospect',
    factors: { demand: 8, rent: 4, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      'Prospect Road has emerged as Adelaide\'s fastest-growing independent café and hospitality strip — a younger professional demographic with Melbourne-equivalent café expectations, at 50% of Norwood rents.',
      'Rent is 4/10: early operators locked in sub-market leases that are now generating returns impossible to replicate in the inner east; new entrants still find rents 40–50% below comparable strips.',
      'Low seasonality (2/10) reflects an established resident demographic that drinks coffee year-round regardless of season or weather.',
    ],
  },
  {
    name: 'Bowden',
    slug: 'bowden',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 3, tourism: 3 },
    why: [
      'The Bowden urban renewal precinct has delivered 1,800+ new dwellings since 2017, creating a growing young professional residential base that is currently underserved by hospitality supply.',
      'Rent is 4/10 — Renewal SA leases in the precinct are structured to support independent operators, with entry-level fit-out terms below market.',
      'Competition is 4/10: the pre-saturation window is closing but not closed — operators entering in 2026 can still establish first-mover brand loyalty before the precinct matures.',
    ],
  },
  {
    name: 'Thebarton',
    slug: 'thebarton',
    factors: { demand: 7, rent: 3, competition: 4, seasonality: 3, tourism: 3 },
    why: [
      'The Sir Donald Bradman Drive corridor is Adelaide\'s emerging creative and brewery precinct — conversion of former industrial sites is generating a concentrated young professional demand that existing operators have not fully captured.',
      'Rent is 3/10: among the lowest in the inner ring, making Thebarton the strongest value-entry market for operators willing to build a brand in a precinct that is still being discovered.',
      'Competition is 4/10 — limited hospitality supply relative to the growing residential and creative worker population creates a genuine gap for cafés, casual dining, and specialty food.',
    ],
  },
  {
    name: 'Glenelg',
    slug: 'glenelg',
    factors: { demand: 8, rent: 6, competition: 6, seasonality: 6, tourism: 9 },
    why: [
      'Tourism is 9/10: Glenelg is South Australia\'s most visited domestic tourism destination — Jetty Road produces very high peak revenue from November to March, with interstate and international visitors who spend significantly above local averages.',
      'Seasonality is 6/10: the revenue cliff from April to October is real — operators who rely on summer tourist trade without a strong local repeat base consistently underperform their peak-month projections.',
      'Strong operators build dual income streams: tourist revenue in summer (premium pricing) plus established local café repeat trade that sustains winter months.',
    ],
  },
  {
    name: 'Glenelg North',
    slug: 'glenelg-north',
    factors: { demand: 7, rent: 5, competition: 4, seasonality: 5, tourism: 6 },
    why: [
      'Glenelg North captures residential spill from Glenelg\'s premium beachside positioning at 20% lower rent — the local professional residential base is stable and underserved by quality operators.',
      'Competition is 4/10: fewer operators than Glenelg proper, with demand growing as residential development in the beachside corridor continues.',
      'Tourism benefit (6/10) from proximity to Glenelg and Holdfast Shores adds weekend uplift without full tourist-trade revenue dependence.',
    ],
  },
  {
    name: 'Henley Beach',
    slug: 'henley-beach',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 6, tourism: 7 },
    why: [
      'Henley Square is Adelaide\'s most consistent beachside dining precinct — a mix of local year-round residents and holiday visitors creates a more balanced seasonal trade profile than Semaphore or Aldinga.',
      'Tourism is 7/10: the esplanade and beach attract significant summer visitor spend, but the stronger-than-average local residential base moderates the off-season revenue dip.',
      'Seasonality is 6/10 — operators need a clear local loyalty strategy for the April–October period; beach-only positioning without local community engagement produces significant winter cash flow pressure.',
    ],
  },
  {
    name: 'Semaphore',
    slug: 'semaphore',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 6, tourism: 6 },
    why: [
      'Semaphore Road has a strong community identity and loyal local customer base that differentiates it from purely tourist-dependent beachside precincts — repeat visits are higher than comparable beach strips.',
      'Low rent (4/10) and low competition (4/10) make entry viable for operators with a community-first positioning; the market rewards those who become a local institution rather than a seasonal venue.',
      'Seasonality is 6/10: winter trade is softer but more resilient than Glenelg due to the established resident demographic — operators with strong community loyalty maintain 70–75% of summer revenue in winter.',
    ],
  },
  {
    name: 'Port Adelaide',
    slug: 'port-adelaide',
    factors: { demand: 7, rent: 3, competition: 4, seasonality: 4, tourism: 5 },
    why: [
      'Port Adelaide\'s gentrification wave is accelerating — new residential developments, the Heritage Wharf precinct, and government investment are bringing a professional demographic to a suburb that was commercial-only a decade ago.',
      'Rent is 3/10: the lowest in any inner-ring suburb with genuine growth trajectory — the asymmetric opportunity is clear for operators who enter before rents reprice over the next 3–5 years.',
      'Tourism is 5/10 from the maritime precinct and Port Adelaide Football Club events — weekends generate strong visitor foot traffic that supplements the growing local resident base.',
    ],
  },
  {
    name: 'Goodwood',
    slug: 'goodwood',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 3, tourism: 2 },
    why: [
      'Goodwood Road\'s café corridor is driven by a professional inner-south demographic that has the spending behaviour of Norwood at 35% of the rent — one of the best value inner-ring positions in Adelaide.',
      'Competition is 5/10 — a viable market with established peers who validate demand, but without the saturation that compresses margins on The Parade.',
      'Low tourism (2/10) reflects a pure residential-local market: customer acquisition requires community building rather than destination positioning, which favours operators with strong hospitality skills over concept novelty.',
    ],
  },
  {
    name: 'Burnside',
    slug: 'burnside',
    factors: { demand: 7, rent: 6, competition: 4, seasonality: 3, tourism: 2 },
    why: [
      'Burnside Village and the Hawthorn strip serve the highest average household income demographic in Greater Adelaide ($108K median) — willingness-to-pay for specialty coffee and premium casual dining is the strongest in SA.',
      'Competition is 4/10: notably low for an affluent suburb — the eastern hills income demographic is underserved by quality independent operators, creating genuine supply gaps.',
      'Low tourism (2/10) means the customer base is almost entirely local, delivering exceptional repeat-visit rates for operators who execute well and build relationships.',
    ],
  },
  {
    name: 'Mitcham',
    slug: 'mitcham',
    factors: { demand: 6, rent: 5, competition: 4, seasonality: 3, tourism: 2 },
    why: [
      'Mitcham Village strip serves a stable, high-loyalty family and professional demographic that supports consistent but moderate-volume trade — suitable for operators who value reliability over scale.',
      'Competition is 4/10 and seasonality 3/10 — a predictable, low-drama market where operators who execute consistently build durable repeat business without constant competition pressure.',
      'The suburb\'s income demographics ($85K median) support specialty coffee and quality-casual dining positioning, though the catchment size limits maximum revenue ceiling compared to inner suburbs.',
    ],
  },
  {
    name: 'Modbury',
    slug: 'modbury',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 4, tourism: 2 },
    why: [
      'Modbury is the northern catchment anchor for the Tea Tree Plaza precinct — suburban foot traffic is driven by the shopping centre, which creates reliable but chain-heavy competition for independent operators.',
      'Rent is 4/10 and demand is 6/10 — the economics work for value-positioned operators, but premium concept differentiation is required to compete against established chain presence.',
      'Growing northeastern corridor population is improving the demographic base, but income levels ($72K median) constrain premium pricing — value-to-mid positioning outperforms specialty in this catchment.',
    ],
  },
  {
    name: 'Salisbury',
    slug: 'salisbury',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 4, tourism: 2 },
    why: [
      'Salisbury\'s defence and manufacturing employment base (BAE Systems, SAAB) creates a stable working-professional demographic with consistent weekday lunch demand — healthcare and allied services also perform well.',
      'Rent is 3/10 — the lowest of any viable suburban market, making break-even achievable at lower revenue thresholds than most Adelaide positions.',
      'Competition is 5/10, concentrated in the main strip — side streets and specialist food retain whitespace that generic strip positions have already filled.',
    ],
  },
  {
    name: 'Elizabeth',
    slug: 'elizabeth',
    factors: { demand: 5, rent: 2, competition: 4, seasonality: 4, tourism: 2 },
    why: [
      'Elizabeth offers the lowest occupancy costs in Greater Adelaide, but median household income of $62K constrains premium pricing — value food, essential services, and community-oriented concepts perform reliably here.',
      'Demand is 5/10: the northern growth corridor is improving with new residential development but has not yet reached the foot-traffic intensity of comparable Western Sydney or outer Melbourne markets.',
      'Low competition (4/10) and very low rent (2/10) create viable economics for operators who correctly calibrate their price point to the catchment\'s spending capacity.',
    ],
  },
  {
    name: 'Mount Barker',
    slug: 'mount-barker',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 4, tourism: 3 },
    why: [
      'Mount Barker is Adelaide\'s fastest-growing satellite town — 20% population growth from 2016–2024 has created a growing professional residential base that is significantly underserved by quality hospitality.',
      'Rent is 3/10: Adelaide Hills satellite pricing despite a demographic that increasingly works in metropolitan professional roles and expects inner-city hospitality quality.',
      'Tourism is 3/10 from Adelaide Hills wine region day-trippers, adding a weekend demand layer beyond the local residential base — operators positioned for both capture the broader catchment.',
    ],
  },
  {
    name: 'Kensington',
    slug: 'kensington',
    factors: { demand: 8, rent: 5, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      'The Parade corridor east of Norwood has a premium residential demographic with spending behaviour that mirrors The Parade proper, but significantly lower competition — a genuine opportunity for operators priced out of Norwood.',
      'Competition is 4/10: Kensington has fewer than half the operator density of Norwood despite a comparable income catchment, creating reliable supply gaps for well-positioned independents.',
      'Low seasonality (2/10) reflects the stable professional inner-east residential base — trade is consistent year-round with strong midweek and weekend evenings.',
    ],
  },
  {
    name: 'Kent Town',
    slug: 'kent-town',
    factors: { demand: 8, rent: 5, competition: 5, seasonality: 2, tourism: 4 },
    why: [
      'Rundle Street East and the Kent Town commercial corridor sit at the intersection of the CBD and inner-east residential, capturing professional lunch and after-work trade from both precincts.',
      'Tourism is 4/10 from CBD proximity — Fringe and festival event spillover adds significant revenue uplifts in February–March and October.',
      'Rent is 5/10 — competitive with Norwood but significantly below Rundle Street CBD, making Kent Town a smart positioning for operators who want CBD adjacency at suburban rent.',
    ],
  },
]

const _ADELAIDE_BUILT = buildSuburbs(ADELAIDE_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAdelaideSuburbs(): AdelaideSuburb[] {
  return _ADELAIDE_BUILT
}

export function getAdelaideSuburb(nameOrSlug: string): AdelaideSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _ADELAIDE_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getAdelaideSuburbSlugs(): string[] {
  return _ADELAIDE_BUILT.map((s) => s.slug)
}

export function getAdelaideNearbySuburbs(currentSlug: string, limit = 3): AdelaideSuburb[] {
  const sorted = [..._ADELAIDE_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
