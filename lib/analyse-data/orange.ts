/**
 * lib/analyse-data/orange.ts
 * Engine-computed suburb data for Orange, NSW.
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

export interface OrangeSuburbSeed {
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

export interface OrangeSuburb extends OrangeSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: OrangeSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: OrangeSuburbSeed[]): OrangeSuburb[] {
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

// ─── Orange suburb seeds ──────────────────────────────────────────────────────

const ORANGE_SEEDS: OrangeSuburbSeed[] = [
  {
    name: 'Orange CBD',
    slug: 'orange-cbd',
    factors: { demand: 8, rent: 5, competition: 7, seasonality: 3, tourism: 7 },
    why: [
      "Orange CBD has developed one of the most credible regional food and dining reputations in New South Wales — Summer Street and the surrounding CBD laneway network have attracted quality independent operators who have built a destination dining identity that draws visitors from Sydney and across regional NSW for food tourism weekends.",
      "Demand is 8/10: the Orange CBD draws from a resident population of approximately 42,000 people, supplemented by a strong food and wine tourism visitation that generates genuine additional revenue on top of the local residential base — a combination that produces more robust demand than comparable-population regional towns without the tourism overlay.",
      "Competition is 7/10: the CBD's culinary reputation has attracted a concentration of quality operators that makes it one of the most competitive regional food markets in NSW — new entrants must offer a genuine point of difference rather than a format already well-represented on the strip.",
      "Rent is 5/10: prime CBD commercial tenancies in Orange are priced at a modest premium over other regional NSW cities of comparable size, reflecting the destination-market demand pull — operators should model $2,500–$5,000/month for quality CBD floor space in the core dining precinct.",
      "Tourism is 7/10: the Orange food and wine tourism economy is built on the Central Tablelands wine region, the FOOD Week festival (attracting tens of thousands of visitors annually), and the destination dining reputation that has grown substantially since 2018 — a genuine and growing tourism revenue stream that supplements the local residential base.",
    ],
  },
  {
    name: 'Summer Street',
    slug: 'summer-street',
    factors: { demand: 8, rent: 5, competition: 7, seasonality: 4, tourism: 8 },
    why: [
      "Summer Street is Orange's premium dining corridor and the centrepiece of the city's food tourism identity — the concentration of award-winning restaurants, wine bars, and specialty food operators here has made it one of the most recognised dining precincts in regional NSW, drawing visitors who specifically plan weekends around the Summer Street experience.",
      "Tourism is 8/10: Summer Street is the primary beneficiary of Orange's growing food tourism economy — the Central Tablelands wine region, FOOD Week, and the broader food and wine destination reputation translate directly into genuine visitor spend concentrated on this strip, with weekend covers at quality operators regularly exceeding their local customer base.",
      "Competition is 7/10: the density of quality operators on Summer Street creates a genuinely competitive environment — the market has been validated multiple times over, but new entrants face the challenge of displacing or differentiating from operators who have built national-level reputations and loyal repeat visitor followings.",
      "Seasonality is 4/10: Summer Street trade has modest seasonal variation tied to the harvest and wine tourism calendar — the autumn harvest period (March to May) and spring FOOD Week are peak visitation periods, with quieter trade in the summer heat and winter cold months when visitor numbers from Sydney are lower.",
      "The Summer Street opportunity demands genuine quality: the destination dining positioning means that operators who cannot meet the quality expectations of food-literate Sydney visitors and local enthusiasts will struggle — the market rewards excellence and punishes mediocrity more severely than lower-profile regional markets.",
    ],
  },
  {
    name: 'Moulder Park',
    slug: 'moulder-park',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      "Moulder Park is Orange's major retail precinct — large-format retail anchored by supermarkets, discount department stores, and national chains generates substantial weekly foot traffic from the Orange residential catchment, creating a reliable convenience and casual dining demand base outside the CBD.",
      "Demand is 6/10: the Moulder Park catchment covers the bulk of Orange's western and northern residential population, with weekly supermarket and retail traffic generating consistent hospitality demand for convenience coffee, casual dining, and takeaway food formats.",
      "Competition is 5/10: the large-format retail precinct has an established operator mix with national chains dominating the anchor positions — independent operators who find a clear gap in the market (specialty coffee, quality lunch, bakery-cafe) can build loyal community followings within the broader retail foot traffic environment.",
      "Rent is 4/10: Moulder Park commercial tenancies are priced at the suburban strip premium — above residential-fringe rates but below the CBD destination strip, with genuine foot traffic justification for the mid-range occupancy cost.",
      "Tourism is 2/10: Moulder Park is an entirely local residential trade environment — the large-format retail precinct positioning does not attract the food tourism visitor trade that gravitates toward the CBD and Summer Street, making this a pure resident-serving market with no meaningful seasonal uplift.",
    ],
  },
  {
    name: 'Canobolas',
    slug: 'canobolas',
    factors: { demand: 5, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Canobolas is a southern residential growth area in Orange — new estate development has delivered a growing family demographic that is currently underserved by quality local hospitality options, with residents travelling to the CBD or Moulder Park for food and dining needs.",
      "Demand is 5/10: the Canobolas residential catchment is growing but not yet at full density — the demand is real and will increase materially as estate development completes, but operators should model conservative initial revenue projections that ramp over a 12 to 18-month establishment period.",
      "Competition is 3/10: low hospitality operator density in Canobolas creates a genuine first-mover opportunity for correctly positioned concepts — the suburb has clear unmet demand for quality convenience coffee and family casual dining that is not currently being served by an established local operator.",
      "Rent is 3/10: Canobolas commercial tenancies are priced at the suburban growth corridor level — competitive cost structures that make break-even viable at the volume levels a growing residential catchment can deliver, without requiring the revenue density of the CBD or major retail strips.",
      "Tourism is 2/10: Canobolas is an entirely residential trade market without the food tourism overlay that drives the CBD and Summer Street — operators should model stable, predictable revenue from the local catchment with no seasonal uplift component.",
    ],
  },
  {
    name: 'Spring Hill',
    slug: 'spring-hill',
    factors: { demand: 4, rent: 2, competition: 2, seasonality: 2, tourism: 2 },
    why: [
      "Spring Hill is a modest southern residential suburb of Orange with a small-scale community commercial offering — the local hospitality market is limited by the catchment size rather than any conceptual failure, and operators considering this location must accept realistic demand constraints.",
      "Demand is 4/10: the Spring Hill residential catchment is smaller than the major Orange suburbs and the household income profile is modest — the market can sustain community-oriented convenience concepts at the right price point, but cannot support ambitious hospitality concepts that require high revenue density.",
      "Competition is 2/10: very low operator density reflects the genuine scale limitations of the catchment rather than an underserved market opportunity — operators should be cautious about interpreting low competition as a gap to fill rather than a market signal.",
      "Rent is 2/10: very low commercial rents in Spring Hill reflect the modest catchment scale — the cost structure makes break-even achievable at conservative revenue volumes, which is the primary financial advantage of this location.",
      "Spring Hill suits community-service operators who explicitly choose this location to serve the local residential community at accessible price points — it is not a stepping stone to growth, but a viable community-scale business location for operators who correctly calibrate expectations to the market.",
    ],
  },
  {
    name: 'Bloomfield',
    slug: 'bloomfield',
    factors: { demand: 7, rent: 4, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Bloomfield is the hospital precinct of Orange — the Orange Base Hospital is the principal referral hospital for the Central West of NSW, generating a large and consistent demand from medical and allied health staff, patients' families, and the broader health services workforce concentrated in the Bloomfield precinct.",
      "Demand is 7/10: hospital precincts are among the most reliable hospitality catchments in any regional market — medical staff with above-average incomes, shift patterns that require early-morning and late-day food and coffee options, and a captive daytime market from patients' families all contribute to a consistent and high-frequency demand base.",
      "Competition is 3/10: the Bloomfield precinct is currently underserved relative to the size and spending power of the hospital workforce — quality breakfast and lunch operators, specialty coffee, and grab-and-go food concepts have clear unmet demand in the immediate hospital vicinity.",
      "Rent is 4/10: hospital precinct commercial tenancies carry a modest premium over purely residential suburban locations, reflecting the captive workforce demand — a defensible occupancy cost for operators who can sustain the weekday trading volumes generated by the hospital shift patterns.",
      "The Bloomfield opportunity has structural advantages: the hospital workforce trades on weekdays regardless of consumer confidence cycles, weather events, or broader economic conditions — the medical and allied health demographic is among the most recession-resistant hospitality catchments in regional Australia.",
    ],
  },
  {
    name: 'Lucknow',
    slug: 'lucknow',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 4, tourism: 6 },
    why: [
      "Lucknow is a heritage gold rush village 7 kilometres east of Orange city centre — a charming historic streetscape that has positioned itself as a food tourism satellite to the Orange wine and dining economy, with artisan producers, a weekend market, and destination small-batch food concepts already establishing a visitor identity.",
      "Tourism is 6/10: Lucknow benefits directly from the Orange food tourism economy — visitors who spend weekends in the Orange wine region extend their itineraries to include Lucknow's heritage precinct, particularly during the autumn harvest season and FOOD Week, creating genuine visitor foot traffic in a small-town setting.",
      "Demand is 5/10: the residential population of Lucknow itself is small — the hospitality demand case depends substantially on the tourism overlay rather than the local residential catchment, which means operators must build a concept that appeals to the food tourism visitor rather than primarily serving local residents.",
      "Seasonality is 4/10: Lucknow's tourism-adjacent positioning creates material seasonal variation — the autumn and spring peak periods (March to May, October to November) generate visitor trade, while the summer heat and winter months are materially quieter, requiring operators to build sufficient reserves during peak periods.",
      "Rent is 2/10: heritage village commercial tenancies in Lucknow are priced at the lowest end of the Orange market — an attractive cost structure for artisan and destination food concepts that can generate per-visit revenue premiums from food tourism visitors willing to pay for authentic, place-specific experiences.",
    ],
  },
]

const _ORANGE_BUILT = buildSuburbs(ORANGE_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getOrangeSuburbs(): OrangeSuburb[] {
  return _ORANGE_BUILT
}

export function getOrangeSuburb(nameOrSlug: string): OrangeSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _ORANGE_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getOrangeSuburbSlugs(): string[] {
  return _ORANGE_BUILT.map((s) => s.slug)
}

export function getOrangeNearbySuburbs(currentSlug: string, limit = 3): OrangeSuburb[] {
  const sorted = [..._ORANGE_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
