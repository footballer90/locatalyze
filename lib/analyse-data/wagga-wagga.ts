/**
 * lib/analyse-data/wagga-wagga.ts
 * Engine-computed suburb data for Wagga Wagga, NSW.
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

export interface WaggaWaggaSuburbSeed {
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

export interface WaggaWaggaSuburb extends WaggaWaggaSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: WaggaWaggaSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: WaggaWaggaSuburbSeed[]): WaggaWaggaSuburb[] {
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

// ─── Wagga Wagga suburb seeds ─────────────────────────────────────────────────

const WAGGA_WAGGA_SEEDS: WaggaWaggaSuburbSeed[] = [
  {
    name: 'Wagga Wagga CBD',
    slug: 'wagga-wagga-cbd',
    factors: { demand: 8, rent: 6, competition: 7, seasonality: 2, tourism: 5 },
    why: [
      "Wagga Wagga CBD is the commercial and civic heart of the largest inland city in New South Wales — Baylis and Fitzmaurice Streets form the primary retail spine and generate the highest foot traffic volumes in the entire Riverina region, drawing from a residential catchment that extends well beyond the immediate urban boundary.",
      "Demand is 8/10: Wagga Wagga's population of approximately 68,000 residents, combined with a strong public sector workforce (Defence, Health, Charles Sturt University), creates year-round weekday foot traffic with above-average household incomes relative to regional NSW benchmarks.",
      "Competition is 7/10: the CBD hosts the densest concentration of hospitality and retail operators in the Riverina — established chains and well-regarded local independents have built loyalty over years, and new entrants must offer genuine differentiation to win market share from incumbent operators.",
      "Rent is 6/10: prime CBD retail tenancies on Baylis Street command rents that are competitive compared to coastal centres but represent a genuine fixed-cost commitment — operators should model rent at $3,000–$5,500/month for quality floor space in the core strip.",
      "Tourism is 5/10: Wagga Wagga generates modest but consistent visitor traffic through the RAAF Base Wagga open days, Charles Sturt University graduations, regional events at the Civic Theatre, and through-traffic on the Hume and Olympic Highways — sufficient to supplement local residential trade without creating material seasonality risk.",
    ],
  },
  {
    name: 'Fitzmaurice Street',
    slug: 'fitzmaurice-street',
    factors: { demand: 8, rent: 5, competition: 6, seasonality: 2, tourism: 4 },
    why: [
      "Fitzmaurice Street is Wagga Wagga's established premium dining and cafe corridor — a walkable strip that has developed a reputation for quality independent hospitality concepts over the past decade, attracting the professional and public-sector demographic that lives and works within the inner city.",
      "Demand is 8/10: the corridor draws from the Wagga Wagga Hospital precinct (one of the largest regional hospitals in NSW), the professional services cluster on Fitzmaurice and nearby streets, and the residential catchment of Turvey Park and East Wagga Wagga — a reliably high-income and high-frequency hospitality demographic.",
      "Competition is 6/10: Fitzmaurice Street has a well-developed hospitality ecosystem — several owner-operated cafes and restaurants have built strong loyal followings here, and differentiation is the key challenge for new entrants rather than a lack of demonstrated market demand.",
      "Rent is 5/10: commercial tenancies on Fitzmaurice Street are priced below the premium Baylis Street CBD strip but above purely suburban locations — a positioning that is defensible for quality operators with a well-calibrated concept and realistic revenue projections.",
      "The lifestyle dining demographic on Fitzmaurice Street spends on quality and repeats frequently — a single loyal professional customer visiting four to five times per week represents meaningfully more revenue than a tourist or one-time visitor, and this is the customer profile that sustainable Fitzmaurice Street operators have built their businesses around.",
    ],
  },
  {
    name: 'Kooringal',
    slug: 'kooringal',
    factors: { demand: 6, rent: 3, competition: 5, seasonality: 2, tourism: 1 },
    why: [
      "Kooringal is the principal southern suburban hub of Wagga Wagga — a large-format retail precinct anchored by major supermarkets generates substantial weekly foot traffic from the established southern residential catchment, creating a reliable convenience and casual dining demand base.",
      "Demand is 6/10: the southern residential catchment is large and established, with a working- and middle-income family demographic that generates consistent weekly spend across convenience food, takeaway, and casual dining categories — the volume ceiling is genuine.",
      "Competition is 5/10: the Kooringal retail strip has a moderate operator density with a mix of established chains and local independents — quality concepts with clear positioning (specialty coffee, quality takeaway, family casual dining) find loyal customers within the local community.",
      "Rent is 3/10: Kooringal commercial tenancies are priced for the suburban market, with rents well below the CBD strip — break-even is achievable at volume levels that the residential catchment can realistically deliver, which is a meaningful advantage for operators entering the Wagga Wagga market without CBD-level capital reserves.",
      "Tourism is 1/10: Kooringal is entirely residential trade with no material visitor economy component — operators should model conservative, stable revenue projections built entirely on the local community, with no seasonal uplift factors to rely upon.",
    ],
  },
  {
    name: 'Tolland',
    slug: 'tolland',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      "Tolland is a western working-class residential suburb of Wagga Wagga with a genuine community need for quality convenience food and essential services — the current hospitality offer is thin relative to the resident population, creating a clear first-mover opportunity for correctly positioned operators.",
      "Demand is 5/10: the working-class residential demographic generates reliable demand for value-oriented convenience food, takeaway, and essential services — the spend per visit ceiling is lower than the CBD or Fitzmaurice Street, but the frequency of need is consistent and the current supply is genuinely limited.",
      "Competition is 3/10: Tolland has low hospitality operator density, reflecting the limited supply in this suburb rather than an absence of demand — operators who establish a trusted community presence capture a loyal local trade that tends to be sticky once established.",
      "Rent is 2/10: the lowest commercial rents in the Wagga Wagga urban area, making the fixed-cost structure viable at the volume levels that the working-class residential catchment can sustain — an important structural advantage in a market where revenue ceilings are modest.",
      "The Tolland opportunity is genuinely narrow: it suits operators who are explicitly serving a community convenience need at an appropriate price point, not hospitality concepts designed for the CBD or lifestyle dining market that have been displaced to a lower-rent location.",
    ],
  },
  {
    name: 'Forest Hill',
    slug: 'forest-hill',
    factors: { demand: 6, rent: 3, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      "Forest Hill is a newer northern residential estate in Wagga Wagga's growth corridor — estate development has brought a young family demographic that currently has limited quality hospitality options within the immediate precinct, creating a first-mover window that will close as the market matures.",
      "Demand is 6/10: young families in new estates have strong demand for child-friendly cafes, quality takeaway, and casual dining — a demographic that values community and convenience equally, and that will build genuine loyalty with operators who establish the precinct's first quality option.",
      "Competition is 2/10: the near-absence of established hospitality in Forest Hill reflects the early stage of development rather than a validated absence of demand — the first quality operator to establish here builds the community dining habit and sets the standard before competition arrives.",
      "Rent is 3/10: new estate commercial tenancies are priced to attract first-mover operators, with lease structures that recognise the emerging-market context — operators who negotiate carefully can achieve competitive cost structures relative to the potential of the growing catchment.",
      "The Forest Hill opportunity requires patience: the residential catchment is growing but not yet at full maturity, and operators should model a ramp-up period of 12 to 18 months before the resident base is large enough to sustain full trading volumes — the opportunity is real but the timeline matters.",
    ],
  },
  {
    name: 'Turvey Park',
    slug: 'turvey-park',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "Turvey Park is a professional and medical residential suburb adjacent to the Wagga Wagga Hospital precinct — one of the largest regional hospitals in NSW — generating strong weekday breakfast, brunch, and lunch demand from medical staff, visiting health professionals, and patients' families.",
      "Demand is 7/10: the hospital precinct demographic is among the most valuable hospitality catchments in regional NSW — medical and allied health professionals have above-average incomes, limited time, and a strong willingness to spend on quality food and coffee as part of a daily routine.",
      "Competition is 4/10: the Turvey Park strip has established hospitality but with genuine gaps in the market — specialty coffee, quality lunch, and early-morning breakfast concepts are under-represented relative to the demand profile of the professional and medical catchment.",
      "Rent is 4/10: commercial rents in Turvey Park reflect the professional catchment premium — above suburban rates but below the CBD strip, representing a defensible cost structure for quality operators who can capture the hospital precinct's weekday trade.",
      "Tourism is 2/10: Turvey Park trade is almost entirely residential and professional, with modest visitor component from patients' families staying overnight in the suburb's rental properties — a stable, predictable trading environment with no meaningful seasonality risk.",
    ],
  },
  {
    name: 'Estella',
    slug: 'estella',
    factors: { demand: 6, rent: 3, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      "Estella is a rapidly growing masterplan community in Wagga Wagga's northern corridor — purpose-built residential development with significant approved dwelling numbers in the pipeline is delivering a growing young family and professional catchment that is currently underserved by quality hospitality.",
      "Demand is 6/10: the masterplan community demographic tends to have above-average household incomes compared to older established suburbs, with strong spending habits on quality food, coffee, and casual dining — a demographic that is explicitly seeking a community hospitality hub as the suburb matures.",
      "Competition is 2/10: Estella has near-zero hospitality supply at present — the first quality operator to establish here sets the community dining standard and builds loyalty before any competition exists, a genuinely rare position in an urban market with this much approved residential development in the pipeline.",
      "Rent is 3/10: Estella commercial tenancies are priced to attract early-market operators, and the masterplan developer's commercial leasing incentives often include rent abatements or graduated rent structures designed to support the first operators establishing the precinct's food and beverage offering.",
      "The Estella risk is timing: the opportunity window requires operators to commit before the catchment reaches full density, accepting a ramp-up period where revenue grows with the residential population — operators who time the entry correctly will have built a loyal community institution by the time competition arrives.",
    ],
  },
  {
    name: 'Glenfield Park',
    slug: 'glenfield-park',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      "Glenfield Park is a new residential growth corridor in Wagga Wagga's western fringe — estate development is delivering new households at a steady rate, but the commercial precinct is early-stage and the resident catchment is not yet at the scale needed to sustain multiple hospitality operators simultaneously.",
      "Demand is 5/10: the emerging residential catchment will develop genuine hospitality demand as estate density increases — the market is real but early, and operators should model conservative initial revenue projections with growth assumptions tied to approved dwelling completions rather than projected population targets.",
      "Competition is 2/10: very low hospitality operator density reflects the early stage of the growth corridor — the first-mover advantage is real but requires patience, and operators who establish strong community ties in the early phase will benefit as the catchment grows.",
      "Rent is 2/10: the lowest commercial rents in the Wagga Wagga growth corridors — competitive lease structures reflect the developer's need to attract operators into an emerging precinct, with the cost structure viable at conservative revenue volumes.",
      "Glenfield Park is a patient-capital opportunity: the suburb will develop, the catchment will grow, and the first operators who establish here will eventually trade at volumes that make the early commitment worthwhile — but the timeline extends to three to five years before the market reaches its potential density.",
    ],
  },
]

const _WAGGA_WAGGA_BUILT = buildSuburbs(WAGGA_WAGGA_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getWaggaWaggaSuburbs(): WaggaWaggaSuburb[] {
  return _WAGGA_WAGGA_BUILT
}

export function getWaggaWaggaSuburb(nameOrSlug: string): WaggaWaggaSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _WAGGA_WAGGA_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getWaggaWaggaSuburbSlugs(): string[] {
  return _WAGGA_WAGGA_BUILT.map((s) => s.slug)
}

export function getWaggaWaggaNearbySuburbs(currentSlug: string, limit = 3): WaggaWaggaSuburb[] {
  const sorted = [..._WAGGA_WAGGA_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
