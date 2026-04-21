/**
 * lib/analyse-data/mackay.ts
 * Engine-computed suburb data for Mackay, QLD.
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

export interface MackaySuburbSeed {
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

export interface MackaySuburb extends MackaySuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: MackaySuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: MackaySuburbSeed[]): MackaySuburb[] {
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

// ─── Mackay suburb seeds ──────────────────────────────────────────────────────

const MACKAY_SEEDS: MackaySuburbSeed[] = [
  {
    name: 'Mount Pleasant',
    slug: 'mount-pleasant',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      'Mount Pleasant is the most affluent suburb in Mackay — a mining executive and senior professional demographic with the highest per-visit spend in the region, and expectations for quality that local operators have consistently underserved.',
      'Competition is 4/10: the income demographic is well ahead of the hospitality supply, meaning quality independent operators face limited direct competition and build loyal regulars quickly.',
      'FIFO worker households in Mount Pleasant spend differently from the wider Mackay population — higher discretionary income, concentrated spending windows, and strong preference for quality over price.',
      'Rent is 4/10: below comparable high-income demographics in Cairns or Townsville, making break-even achievable at lower revenue thresholds and giving operators a longer runway to establish their customer base.',
      'Low seasonality (2/10) reflects the professional residential base rather than tourism — trade is consistent across the calendar and not sensitive to mining-cycle fluctuations at the consumer level.',
    ],
  },
  {
    name: 'Mackay CBD',
    slug: 'mackay-cbd',
    factors: { demand: 6, rent: 3, competition: 6, seasonality: 3, tourism: 4 },
    why: [
      'Mackay CBD clusters around Victoria Street and the Caneland Central shopping precinct — together they deliver the highest foot traffic concentration in the region and support the broadest range of food, beverage, and retail formats.',
      'Tourism is 4/10 from Whitsundays gateway activity — Mackay Airport serves as a transit point for Whitsundays-bound visitors who generate short-stay hospitality spend in the CBD before onward travel.',
      'Competition is 6/10: the highest density in the region, requiring genuine differentiation; CBD operators who offer nothing beyond convenience face direct pressure from established chains and incumbents.',
      'Rent is 3/10: Mackay CBD commercial rents are materially below comparable Queensland city centres — the lower entry cost reduces financial risk for independent operators.',
      'The government and professional services employment base creates reliable weekday lunch trade that sustains CBD operators through the shoulder periods when retail and tourism foot traffic softens.',
    ],
  },
  {
    name: 'North Mackay',
    slug: 'north-mackay',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      'North Mackay is the primary northern residential growth corridor — a growing family and professional population that is creating genuine demand for quality independent hospitality ahead of supply.',
      'Competition is 4/10: the northern residential base has grown faster than the hospitality strip, creating a first-mover window for operators who establish community loyalty before the market catches up.',
      'Tourism at 3/10 comes from proximity to Mackay Airport and the Whitsundays gateway — airport-adjacent hospitality and transit visitor spending add a revenue layer beyond local residential trade.',
      'Rent is 3/10: suburban commercial rates well below CBD positions, with new development tenancies priced to attract quality independent operators into the growing precinct.',
      'Low seasonality (2/10) reflects the residential nature of the catchment — the growing family demographic creates consistent demand rather than cyclical peaks.',
    ],
  },
  {
    name: 'Andergrove',
    slug: 'andergrove',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 1 },
    why: [
      'Andergrove is the gateway to Mackay\'s Northern Beaches residential corridor — one of the fastest-growing suburban areas in the region, with a young family demographic that is currently underserved by quality independent operators.',
      'Competition is 4/10: the population growth has outpaced hospitality development, creating a genuine supply gap for cafes, casual dining, and convenience food concepts.',
      'Rent is 3/10: Northern Beaches suburban commercial rents are low relative to the demographic growth trajectory, offering operators the opportunity to lock in below-market leases while the area matures.',
      'The young family demographic creates strong demand for child-friendly hospitality formats — cafes with outdoor seating, casual dining, and bakery-style concepts perform particularly well.',
      'Low seasonality (2/10) and minimal tourism (1/10) create a pure residential trade environment — consistent, predictable, and buildable through community relationships rather than destination marketing.',
    ],
  },
  {
    name: 'Blacks Beach',
    slug: 'blacks-beach',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 3, tourism: 4 },
    why: [
      'Blacks Beach is a coastal lifestyle suburb adjacent to the Eimeo-Northern Beaches corridor — an established residential base with a preference for local dining and beach lifestyle hospitality formats.',
      'Tourism is 4/10 from domestic holidaymakers using the Northern Beaches as a base and coastal visitors who extend their Mackay stay into the beach suburbs.',
      'Competition is 3/10: low operator density relative to the coastal lifestyle demand, with gaps for quality cafes and casual dining that serve both the local resident base and seasonal visitor market.',
      'Seasonality is 3/10: the beach lifestyle dynamic creates some variation between peak and off-peak months, but the established residential base moderates the seasonal cliff seen in more tourism-dependent coastal markets.',
      'Rent is 3/10 — coastal suburban pricing without the premium of the Whitsundays resort belt, making entry viable at conservative revenue projections.',
    ],
  },
  {
    name: 'Sarina',
    slug: 'sarina',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      'Sarina is the southern satellite town most directly tied to the sugar industry — a working agricultural community with modest hospitality demand that rewards essential-service and value-positioned concepts.',
      'Competition is 2/10: very low operator density reflects the genuine demand constraints of a small town catchment — the low competition is not a signal of undiscovered opportunity but of market scale.',
      'Rent is 2/10: among the lowest in the Mackay region, making break-even viable at very modest revenue volumes — the economics work for correctly calibrated, low-overhead concepts.',
      'Seasonal agricultural workers from the sugar harvest add episodic demand during the crushing season (June to November) that can meaningfully lift trade for food operators who serve the working community.',
      'Low seasonality (2/10) in the residential sense, but the agricultural calendar creates a distinct trade pattern that operators should model explicitly rather than assuming flat year-round volume.',
    ],
  },
  {
    name: 'Paget',
    slug: 'paget',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      'Paget is Mackay\'s primary industrial and trade services precinct — the customer base is business-to-business and working-professional rather than the casual hospitality consumer that most independent operators target.',
      'The industrial worker demographic creates strong demand for high-volume, fast-service food formats — lunch trade from workshops, warehouses, and trade businesses can be significant for correctly positioned operators.',
      'Competition is 2/10: very limited independent hospitality in the precinct, reflecting the specialised nature of demand rather than untapped consumer opportunity.',
      'Rent is 2/10: industrial precinct commercial rents are the lowest in the Mackay region, creating viable economics for operators who correctly target the B2B and trade worker customer base.',
      'Low tourism (1/10) and low seasonality (2/10) make Paget a consistent but niche market — operators who thrive here specialise in serving the working industrial community rather than pursuing the broader hospitality market.',
    ],
  },
  {
    name: 'Eimeo',
    slug: 'eimeo',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 3, tourism: 3 },
    why: [
      'Eimeo is the Northern Beaches coastal suburb with the strongest lifestyle positioning — the headland and beach access draw a mix of local residents and weekend visitors who support casual dining and coffee concepts.',
      'Competition is 2/10: minimal independent hospitality relative to the lifestyle demand, with a genuine gap for quality operators who position for both the local resident base and the weekend visitor market.',
      'Tourism is 3/10 from the Northern Beaches coastal lifestyle draw — weekend day-trippers from Mackay proper and domestic visitors staying in the area add a revenue layer beyond local residential trade.',
      'Seasonality is 3/10: the coastal lifestyle creates some seasonal variation, but the established residential base and the Northern Beaches\' year-round livability moderate the revenue swings.',
      'Rent is 3/10 — coastal suburban commercial rates without the premium associated with the main Mackay CBD or the Whitsundays resort towns.',
    ],
  },
]

const _MACKAY_BUILT = buildSuburbs(MACKAY_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getMackaySuburbs(): MackaySuburb[] {
  return _MACKAY_BUILT
}

export function getMackaySuburb(nameOrSlug: string): MackaySuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _MACKAY_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getMackaySuburbSlugs(): string[] {
  return _MACKAY_BUILT.map((s) => s.slug)
}

export function getMackayNearbySuburbs(currentSlug: string, limit = 3): MackaySuburb[] {
  const sorted = [..._MACKAY_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
