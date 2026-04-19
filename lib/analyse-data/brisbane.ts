/**
 * lib/analyse-data/brisbane.ts
 * Engine-computed suburb data for Brisbane + Queensland regional cities.
 *
 * Factor semantics (1–10 scale):
 *   demand      → higher = stronger independent-operator demand
 *   rent        → higher = more expensive (worse for operators)
 *   competition → higher = more saturated (worse for new entrants)
 *   seasonality → higher = more revenue volatility (worse)
 *   tourism     → higher = more tourism-driven (helps restaurants/retail, neutral/negative for cafes)
 *
 * NEVER add score / compositeScore / cafe / restaurant / retail / verdict fields to seed objects.
 * All numeric outputs are computed by computeLocationModel() below.
 */

import {
  assertNoManualScores,
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from './scoring-engine'

// ─── Shared suburb shape ──────────────────────────────────────────────────────

export interface QldSuburbSeed {
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

export interface QldSuburb extends QldSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: QldSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: QldSuburbSeed[]): QldSuburb[] {
  return seeds.map((suburb) => {
    assertNoManualScores(suburb as unknown as Record<string, unknown>, suburb.name)
    const locationFactors = toLocationFactors(suburb.factors)
    const model = computeLocationModel(locationFactors)
    return {
      ...suburb,
      locationFactors,
      cafe: model.cafe,
      restaurant: model.restaurant,
      retail: model.retail,
      compositeScore: model.compositeScore,
      verdict: model.verdict,
    }
  })
}

// ─── Brisbane city suburb seeds ───────────────────────────────────────────────

const BRISBANE_SUBURB_SEEDS: QldSuburbSeed[] = [
  {
    name: 'Paddington',
    slug: 'paddington',
    factors: { demand: 10, rent: 5, competition: 4, seasonality: 3, tourism: 4 },
    why: [
      'Demand is 10/10: Given Terrace is Brisbane\'s benchmark for independent hospitality — young professionals migrated from Sydney during 2020–2023 have embedded premium café-spending habits that sustain the highest spend-per-customer in the city.',
      'Rent is 5/10 (medium) and competition only 4/10: entry is still achievable for the right operator, with enough peers to validate demand but not so many that new entrants face saturation.',
    ],
  },
  {
    name: 'West End',
    slug: 'west-end',
    factors: { demand: 9, rent: 5, competition: 6, seasonality: 3, tourism: 5 },
    why: [
      'Demand is 9/10 because Boundary Street\'s walkable, mixed-use precinct generates multi-day-part foot traffic that compounds over a lease term.',
      'Competition sits at 6/10 — one operator away from saturation — meaning differentiation is essential but the market is proven.',
    ],
  },
  {
    name: 'New Farm',
    slug: 'new-farm',
    factors: { demand: 9, rent: 6, competition: 4, seasonality: 3, tourism: 5 },
    why: [
      'Demand is 9/10: Brunswick Street is Brisbane\'s strongest brunch destination, with 3,000+ pedestrians on Saturday and Sunday mornings.',
      'Competition is only 4/10 — three independents despite exceptional demand — making this a genuine first-mover opportunity at higher rent.',
    ],
  },
  {
    name: 'Woolloongabba',
    slug: 'woolloongabba',
    factors: { demand: 8, rent: 5, competition: 5, seasonality: 4, tourism: 7 },
    why: [
      'Demand is 8/10 driven by Olympics infrastructure: The Gabba precinct is in structural gentrification — professional residents are arriving ahead of commercial operators.',
      'Tourism is 7/10 (stadium events, precinct activation) which helps restaurant and retail above café economics.',
    ],
  },
  {
    name: 'Bulimba',
    slug: 'bulimba',
    factors: { demand: 8, rent: 4, competition: 4, seasonality: 4, tourism: 3 },
    why: [
      'Demand is 8/10: Oxford Street has affluent residential base comparable to Paddington, but without the operator attention — making it under-served relative to spending power.',
      'Rent is only 4/10 and tourism 3/10: this is a pure local-resident market with excellent unit economics for the right concept.',
    ],
  },
  {
    name: 'Kangaroo Point',
    slug: 'kangaroo-point',
    factors: { demand: 9, rent: 5, competition: 5, seasonality: 5, tourism: 7 },
    why: [
      'Demand is 9/10: Story Bridge and riverfront positioning create strong weekend draw; the professional residential base adds a growing weekday layer.',
      'Tourism at 7/10 reflects significant weekend visitor traffic from the riverfront precinct — a tailwind for restaurants and retail.',
    ],
  },
  {
    name: 'Teneriffe',
    slug: 'teneriffe',
    factors: { demand: 9, rent: 6, competition: 4, seasonality: 3, tourism: 5 },
    why: [
      'Demand is 9/10: woolstore conversion projects are consistently delivering new high-income residents — demand is growing faster than operator supply.',
      'Competition is 4/10 (pre-saturation window): only 2 operators within 500m with 8 major conversion projects in pipeline through 2027.',
    ],
  },
  {
    name: 'South Brisbane',
    slug: 'south-brisbane',
    factors: { demand: 8, rent: 7, competition: 5, seasonality: 4, tourism: 8 },
    why: [
      'Demand is 8/10 from GOMA/QPAC cultural precinct, but rent is 7/10 and tourism dependency is 8/10 — making weekend trade very strong but weekday economics more variable.',
      'High tourism dependency (8/10) helps restaurants but adds revenue seasonality risk for all-day café concepts.',
    ],
  },
  {
    name: 'Fortitude Valley',
    slug: 'fortitude-valley',
    factors: { demand: 8, rent: 7, competition: 7, seasonality: 5, tourism: 6 },
    why: [
      'Rent is 7/10 (highest in Brisbane) while competition is also 7/10 — the daytime café viability is compressed by costs even though foot traffic is high.',
      'Daytime trade is building but the weekday morning commuter base remains softer than Paddington or West End; rent-to-revenue for cafés routinely exceeds 16%.',
    ],
  },
  {
    name: 'Toowong',
    slug: 'toowong',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 6, tourism: 3 },
    why: [
      'Demand is 7/10: UQ gateway suburb with student-professional mix, but semester breaks create meaningful revenue dips — hence seasonality 6/10.',
      'Tourism is 3/10 — this is a resident-only market; weekend tourist uplift does not apply.',
    ],
  },
  {
    name: 'Greenslopes',
    slug: 'greenslopes',
    factors: { demand: 8, rent: 4, competition: 4, seasonality: 5, tourism: 3 },
    why: [
      'Demand is 8/10: Greenslopes Private Hospital anchors consistent allied-health and professional foot traffic that operates independently of retail trends.',
      'Low rent (4/10) and low competition (4/10) produce reasonable unit economics, though the catchment is not as lifestyle-driven as inner suburbs.',
    ],
  },
  {
    name: 'Newmarket',
    slug: 'newmarket',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 4, tourism: 3 },
    why: [
      'Demand is 7/10: Enoggera Road corridor is improving with younger professional residents, but foot traffic has not yet reached inner-ring intensity.',
      'Low rent (4/10) is the key advantage — early operators can lock in sub-market leases before demographics reprice.',
    ],
  },
  {
    name: 'Nundah',
    slug: 'nundah',
    factors: { demand: 8, rent: 4, competition: 4, seasonality: 4, tourism: 4 },
    why: [
      'Demand is 8/10: Sandgate Road and Nundah Village strip have strong community-driven café culture with established repeat-visitor base.',
      'Low rent (4/10) and low competition (4/10) create excellent entry conditions for the inner-north catchment.',
    ],
  },
  {
    name: 'Mount Gravatt',
    slug: 'mount-gravatt',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 4, tourism: 3 },
    why: [
      'Demand is 7/10: Griffith University anchors consistent student and academic foot traffic, supplemented by established family residential base.',
      'Low rent (4/10) keeps occupancy costs manageable against the diverse but not premium-spending catchment.',
    ],
  },
  {
    name: 'Indooroopilly',
    slug: 'indooroopilly',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 4, tourism: 4 },
    why: [
      'Demand is 7/10 — UQ proximity and Westfield Indooroopilly drive foot traffic, but the Westfield gravity competes with strip retail for consumer attention.',
      'Competition is 6/10 because Westfield anchors multiple chain operators, making differentiation critical for independent operators on the strip.',
    ],
  },
  {
    name: 'Carindale',
    slug: 'carindale',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 4, tourism: 4 },
    why: [
      'Demand is 7/10: Westfield Carindale drives strong family foot traffic — casual dining and health concepts positioned adjacent to the centre perform well.',
      'Rent is 5/10 and competition 5/10 — viable for concepts positioned correctly but not the most forgiving entry environment.',
    ],
  },
  {
    name: 'Annerley',
    slug: 'annerley',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 5, tourism: 3 },
    why: [
      'Demand is 6/10: Ipswich Road corridor improvement is real but early-stage; healthcare and multicultural food are established, café culture still emerging.',
      'Rent is just 3/10 — the lowest in the inner ring — making unit economics attractive for operators willing to pioneer the market.',
    ],
  },
  {
    name: 'Brisbane CBD',
    slug: 'brisbane-cbd',
    factors: { demand: 9, rent: 9, competition: 8, seasonality: 4, tourism: 7 },
    why: [
      'Demand is 9/10 (Queen Street Mall foot traffic) but rent is 9/10 ($12,000–$28,000/month) and competition is 8/10 — the economics work only for premium volume concepts or chains.',
      'Tourism is 7/10 — the CBD receives strong visitor traffic, but independent operators rarely capture it before chains or hotel F&B do.',
    ],
  },
  {
    name: 'Spring Hill',
    slug: 'spring-hill',
    factors: { demand: 7, rent: 7, competition: 5, seasonality: 5, tourism: 5 },
    why: [
      'Office-residential mix suburb where weekday corporate lunch works but weekend population is thin — demand is 7/10 but heavily skewed to weekdays.',
      'Rent is 7/10 (elevated) against a moderate catchment makes Spring Hill a considered bet rather than a reliable performer.',
    ],
  },
  {
    name: 'Chermside',
    slug: 'chermside',
    factors: { demand: 5, rent: 5, competition: 9, seasonality: 4, tourism: 4 },
    why: [
      'Competition is 9/10: Westfield Chermside\'s monopoly gravity traps independent operators in a race-to-the-bottom against entrenched chains — the mall takes 15% commission and monopolises foot traffic.',
      'Effective demand for independents is only 5/10 because most consumer spending flows to the centre rather than to strip retail.',
    ],
  },
  {
    name: 'Springfield',
    slug: 'springfield',
    factors: { demand: 4, rent: 3, competition: 3, seasonality: 5, tourism: 2 },
    why: [
      'Demand is 4/10: Springfield is still maturing demographically — car-dependent layout limits walk-in hospitality trade and the income base is still building.',
      'Low rent (3/10) and low competition (3/10) are structural positives but cannot compensate for thin demand at this stage of suburb development.',
    ],
  },
  {
    name: 'Caboolture',
    slug: 'caboolture',
    factors: { demand: 4, rent: 3, competition: 5, seasonality: 5, tourism: 3 },
    why: [
      'Demand is 4/10: median household income of $64,000 places premium hospitality pricing at the limit of habitual spend — viable for value concepts, not specialty.',
      'Competition is 5/10 against a value-focused demographic creates risk for quality-positioned operators whose cost structure doesn\'t align with willingness-to-pay.',
    ],
  },
]

// ─── Bundaberg region suburb seeds ───────────────────────────────────────────

const BUNDABERG_SUBURB_SEEDS: QldSuburbSeed[] = [
  {
    name: 'Bargara',
    slug: 'bargara',
    factors: { demand: 7, rent: 4, competition: 3, seasonality: 6, tourism: 8 },
    why: [
      'Demand is 7/10: coastal retiree and sea-changer demographic is asset-rich and price-tolerant — the esplanade precinct drives destination café visits.',
      'Tourism is 8/10 (whale-watching season, school holidays) and seasonality is 6/10 — June–October peaks can lift revenue 40–50%, but the off-season requires strong local repeat business.',
    ],
  },
  {
    name: 'Bundaberg Central',
    slug: 'bundaberg-central',
    factors: { demand: 7, rent: 3, competition: 5, seasonality: 6, tourism: 5 },
    why: [
      'Demand is 7/10: regional CBD with established foot traffic and a loyal local customer base supplemented by seasonal agricultural workers.',
      'Seasonality is 6/10 (harvest season March–August can lift revenue 40%) and low rent (3/10) makes break-even achievable for well-positioned operators.',
    ],
  },
  {
    name: 'Kepnock',
    slug: 'kepnock',
    factors: { demand: 5, rent: 3, competition: 4, seasonality: 5, tourism: 3 },
    why: [
      'Demand is 5/10: suburban Kepnock has a stable family residential base but foot traffic intensity is well below the CBD or Bargara esplanade.',
      'Low rent (3/10) supports viability for value-positioned concepts, though premium pricing is difficult against the moderate income demographic.',
    ],
  },
  {
    name: 'Bundaberg North',
    slug: 'bundaberg-north',
    factors: { demand: 4, rent: 2, competition: 3, seasonality: 6, tourism: 3 },
    why: [
      'Demand is 4/10: lower residential density and less commercial activation than the CBD or Kepnock — a suburban residential play only.',
      'Very low rent (2/10) is the key attraction, but thin foot traffic means concept and value positioning must be precisely calibrated for local demographics.',
    ],
  },
  {
    name: 'Gin Gin',
    slug: 'gin-gin',
    factors: { demand: 2, rent: 2, competition: 2, seasonality: 7, tourism: 3 },
    why: [
      'Demand is 2/10: small rural population of approximately 2,500 with limited commercial foot traffic — insufficient density for a viable café concept.',
      'High seasonality (7/10) reflects agricultural dependence and limited year-round trade base.',
    ],
  },
  {
    name: 'Childers',
    slug: 'childers',
    factors: { demand: 1, rent: 2, competition: 2, seasonality: 7, tourism: 2 },
    why: [
      'Demand is 1/10: Childers is a small rural service town where backpacker seasonal worker traffic creates extreme price sensitivity — a premium café concept cannot sustain here.',
      'Population density and income demographics are below any viable independent hospitality threshold.',
    ],
  },
]

// ─── Sunshine Coast suburb seeds ─────────────────────────────────────────────

const SUNSHINE_COAST_SUBURB_SEEDS: QldSuburbSeed[] = [
  {
    name: 'Mooloolaba',
    slug: 'mooloolaba',
    factors: { demand: 9, rent: 6, competition: 5, seasonality: 6, tourism: 9 },
    why: [
      'Demand is 9/10: Mooloolaba combines tourism foot traffic (Walk Score 76 beachfront) with a strong sea-change resident base — two demand streams that de-risk seasonality.',
      'Tourism is 9/10: 42% population growth since 2016 drives both visitor and local spending; outdoor dining advantage is year-round given subtropical climate.',
    ],
  },
  {
    name: 'Noosa Heads',
    slug: 'noosa-heads',
    factors: { demand: 10, rent: 7, competition: 4, seasonality: 7, tourism: 10 },
    why: [
      'Demand is 10/10 and tourism is 10/10: 900,000+ annual visitors, $78 average tourist dining spend, and an affluent permanent resident base create the highest revenue ceiling on the Sunshine Coast.',
      'Rent is 7/10 (Hastings Street premium) and seasonality is 7/10 — school holidays and summer peaks create 45% revenue uplift but winter softness requires strong local customer base.',
    ],
  },
  {
    name: 'Buderim',
    slug: 'buderim',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 5, tourism: 5 },
    why: [
      'Demand is 7/10: elevated plateau suburb with high-income residential base ($92,000 median) — café and wellness spending is above Sunshine Coast average.',
      'Low rent (4/10) and moderate competition (4/10) create attractive entry conditions for the affluent-local demographic.',
    ],
  },
  {
    name: 'Maroochydore',
    slug: 'maroochydore',
    factors: { demand: 8, rent: 5, competition: 5, seasonality: 5, tourism: 6 },
    why: [
      'Demand is 8/10: Sunshine Coast regional hub with strong commercial activity and growing business district — a more volume-reliable market than beach towns.',
      'Balanced competition (5/10) and tourism (6/10) make Maroochydore a considered alternative to the higher-risk beachfront options.',
    ],
  },
  {
    name: 'Caloundra',
    slug: 'caloundra',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 7, tourism: 7 },
    why: [
      'Demand is 7/10 but seasonality is also 7/10 — the beach-town revenue pattern requires strong local repeat trade to survive winter.',
      'Tourism (7/10) helps restaurants and retail but increases revenue volatility for all-day café concepts.',
    ],
  },
  {
    name: 'Kawana Waters',
    slug: 'kawana-waters',
    factors: { demand: 7, rent: 5, competition: 5, seasonality: 6, tourism: 6 },
    why: [
      'Demand is 7/10: Sunshine Coast University Hospital precinct drives healthcare professional traffic alongside residential growth in the Bokarina corridor.',
      'Moderate on all factors — a reasonable CAUTION market for operators who understand the residential-health demographic rather than tourist trade.',
    ],
  },
  {
    name: 'Nambour',
    slug: 'nambour',
    factors: { demand: 3, rent: 3, competition: 3, seasonality: 7, tourism: 3 },
    why: [
      'Demand is 3/10: inland agricultural service town with declining retail strip and limited café culture — below viable independent hospitality threshold.',
      'High seasonality (7/10) and limited tourism (3/10) make Nambour a challenging market without a compelling local niche.',
    ],
  },
  {
    name: 'Beerwah',
    slug: 'beerwah',
    factors: { demand: 2, rent: 2, competition: 2, seasonality: 7, tourism: 4 },
    why: [
      'Demand is 2/10: small hinterland town where Australia Zoo proximity generates tourist traffic but not the local density needed for a standalone café concept.',
      'Population too sparse and car-dependent for walk-in hospitality trade to be reliable.',
    ],
  },
  {
    name: 'Caboolture',
    slug: 'caboolture',
    factors: { demand: 4, rent: 3, competition: 5, seasonality: 5, tourism: 3 },
    why: [
      'Demand is 4/10: outer-suburban income demographics limit willingness-to-pay for premium hospitality — viable for value-positioned concepts only.',
      'Competition (5/10) is elevated relative to the consumer spending capacity of the catchment.',
    ],
  },
]

// ─── Compiled exports ─────────────────────────────────────────────────────────

const BRISBANE_SUBURBS: QldSuburb[] = buildSuburbs(BRISBANE_SUBURB_SEEDS)
const BUNDABERG_SUBURBS: QldSuburb[] = buildSuburbs(BUNDABERG_SUBURB_SEEDS)
const SUNSHINE_COAST_SUBURBS: QldSuburb[] = buildSuburbs(SUNSHINE_COAST_SUBURB_SEEDS)

export function getBrisbaneSuburbs(): QldSuburb[] {
  return [...BRISBANE_SUBURBS]
}

export function getBundabergSuburbs(): QldSuburb[] {
  return [...BUNDABERG_SUBURBS]
}

export function getSunshineCoastSuburbs(): QldSuburb[] {
  return [...SUNSHINE_COAST_SUBURBS]
}

/**
 * Look up a Brisbane suburb by name (case-insensitive).
 * Returns undefined if not found (pages should handle this gracefully).
 */
export function getBrisbaneSuburb(name: string): QldSuburb | undefined {
  const key = name.toLowerCase().trim()
  return BRISBANE_SUBURBS.find((s) => s.name.toLowerCase() === key)
}

export function getBundabergSuburb(name: string): QldSuburb | undefined {
  const key = name.toLowerCase().trim()
  return BUNDABERG_SUBURBS.find((s) => s.name.toLowerCase() === key)
}

export function getSunshineCoastSuburb(name: string): QldSuburb | undefined {
  const key = name.toLowerCase().trim()
  return SUNSHINE_COAST_SUBURBS.find((s) => s.name.toLowerCase() === key)
}
