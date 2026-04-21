/**
 * lib/analyse-data/albury-wodonga.ts
 * Engine-computed suburb data for Albury-Wodonga, NSW/VIC.
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

export interface AlburyWodongaSuburbSeed {
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

export interface AlburyWodongaSuburb extends AlburyWodongaSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: AlburyWodongaSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: AlburyWodongaSuburbSeed[]): AlburyWodongaSuburb[] {
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

// ─── Albury-Wodonga suburb seeds ──────────────────────────────────────────────

const ALBURY_WODONGA_SEEDS: AlburyWodongaSuburbSeed[] = [
  {
    name: 'Albury CBD',
    slug: 'albury-cbd',
    state: 'NSW',
    factors: { demand: 8, rent: 6, competition: 7, seasonality: 2, tourism: 5 },
    why: [
      "Albury CBD anchors the NSW side of Australia's largest cross-border conurbation — Dean Street is the primary dining and retail strip for a combined urban population exceeding 100,000, making it one of the most significant regional commercial precincts on the east coast of Australia.",
      "Demand is 8/10: Albury draws from both the NSW and VIC side of the border, with a combined catchment that is substantially larger than the individual state populations suggest — cross-border spending flows in both directions, and Dean Street captures the majority of the dining and hospitality trade from the entire conurbation.",
      "Competition is 7/10: the Dean Street strip has a well-developed hospitality ecosystem with established independents and national chains — the market is validated and the demand is real, but differentiation is critical for new entrants competing against operators who have built years of local loyalty.",
      "Rent is 6/10: prime Dean Street commercial tenancies are priced at regional capital levels — operators should model $3,000–$5,500/month for quality floor space in the core strip, with genuine pedestrian foot traffic to justify the higher occupancy cost.",
      "Tourism is 5/10: Albury-Wodonga generates consistent visitor traffic from the Melbourne to Sydney highway corridor, regional events at the Entertainment Centre, and from the snowfield season gateway traffic heading to Mount Hotham and Falls Creek from the VIC side — a meaningful supplementary revenue stream without creating material seasonality risk.",
    ],
  },
  {
    name: 'Wodonga',
    slug: 'wodonga',
    state: 'VIC',
    factors: { demand: 7, rent: 5, competition: 6, seasonality: 2, tourism: 4 },
    why: [
      "Wodonga is the Victorian anchor of the cross-border conurbation — High Street and the Wodonga retail precinct serve the VIC side residential catchment and draw from the growing new estate development on the southern and western fringe of the twin-city region.",
      "Demand is 7/10: Wodonga has experienced stronger residential growth than Albury over the past decade, with substantial estate development in Gateway Island and surrounding precincts delivering a young family and professional demographic with real hospitality spending power.",
      "Competition is 6/10: the Wodonga commercial strip has an established operator base but with genuine gaps in the quality food and coffee market — the VIC side of the conurbation has historically been underserved relative to Albury Dean Street for quality independent hospitality.",
      "Rent is 5/10: Wodonga commercial tenancies are priced modestly below the Albury CBD strip, reflecting the secondary commercial status of the VIC side — a cost structure that is attractive for operators who want access to the cross-border catchment without the premium CBD rent.",
      "Tourism is 4/10: Wodonga captures the snowfield gateway traffic on the Kiewa Valley Highway as a first stop for Melbourne travellers heading to Mount Beauty and Falls Creek — a seasonal revenue component that supplements year-round local residential trade.",
    ],
  },
  {
    name: 'Lavington',
    slug: 'lavington',
    state: 'NSW',
    factors: { demand: 6, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      "Lavington is Albury's principal suburban commercial spine — a large-format retail corridor anchored by major supermarkets and national chains that generates the highest retail foot traffic volumes in the Albury-Wodonga conurbation outside the CBD itself.",
      "Demand is 6/10: the Lavington catchment is large and established, covering the bulk of northern Albury's residential population and drawing from the surrounding suburbs for weekly supermarket and convenience shopping runs — reliable, consistent, year-round trade.",
      "Competition is 5/10: the Lavington strip has a well-established commercial operator base, with national chains dominating the anchor tenancies — independent operators who find a clear positioning gap (specialty coffee, quality lunch, artisan baking) can build loyal community followings within the broader retail foot traffic environment.",
      "Rent is 4/10: Lavington commercial tenancies are priced at the suburban strip premium — above residential-fringe rates but below the CBD strip, representing a defensible occupancy cost for operators who can generate the foot traffic volumes that justify a mid-range rent.",
      "Lavington's commercial success is structural rather than aspirational: the large-format retail anchors guarantee baseline foot traffic that independent operators can convert, but the strip's character is functional rather than destination-focused — concepts that serve the convenience and casual dining market outperform destination hospitality concepts here.",
    ],
  },
  {
    name: 'Thurgoona',
    slug: 'thurgoona',
    state: 'NSW',
    factors: { demand: 7, rent: 3, competition: 3, seasonality: 3, tourism: 2 },
    why: [
      "Thurgoona hosts the Charles Sturt University Albury-Wodonga campus — a university precinct with approximately 4,000 to 5,000 enrolled students and a substantial academic and administrative staff base generating strong weekday food and coffee demand that is currently underserved by the local hospitality offer.",
      "Demand is 7/10: university precincts generate reliable, high-frequency food and beverage demand from students and staff during semester — weekday breakfast, lunch, and afternoon coffee represent a predictable and repeating revenue base for correctly positioned operators within or adjacent to the campus precinct.",
      "Competition is 3/10: the university precinct is genuinely underserved for quality independent hospitality — on-campus food options are limited and the surrounding commercial strip has not developed at the pace of campus enrolment growth, leaving a clear market gap for quality operators.",
      "Rent is 3/10: Thurgoona commercial tenancies are priced at the suburban fringe rate, well below the CBD strip — the cost structure is highly attractive for operators who can capture the university demographic during semester without requiring CBD-level revenues to break even.",
      "Seasonality is 3/10: university precincts experience material trade softening during semester breaks (December to February, mid-year break) — operators should model the non-semester periods realistically and consider whether the off-semester months can be sustained by the residential and staff trade without the student volume.",
    ],
  },
  {
    name: 'East Albury',
    slug: 'east-albury',
    state: 'NSW',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 2, tourism: 2 },
    why: [
      "East Albury is the city's premium leafy residential enclave — a well-established suburb with a professional, medical, and public sector demographic that has developed a genuine local cafe culture, with spending habits that resemble those of inner-city suburbs in larger regional centres.",
      "Demand is 7/10: the East Albury demographic represents the highest household income density in the Albury-Wodonga conurbation — professional couples, medical staff from the Albury Base Hospital precinct, and established business owners create a reliable, high-frequency, high-spend hospitality market.",
      "Competition is 4/10: East Albury has established hospitality on the neighbourhood strip but with genuine room for quality additions — specialty coffee, quality brunch, and casual dinner concepts have demonstrated demand here that exceeds the current supply in some categories.",
      "Rent is 4/10: East Albury commercial rents reflect the premium residential catchment premium — above suburban average but with clear revenue justification given the demographic's willingness to spend on quality, making the cost structure defensible for correctly positioned concepts.",
      "The East Albury customer is loyal when won: the professional residential demographic builds habitual routines around quality local operators, meaning that a well-run cafe or casual dining concept can sustain high weekly visit frequency from a smaller loyal customer base than a higher-volume, lower-loyalty suburban strip would require.",
    ],
  },
  {
    name: 'Hamilton Valley',
    slug: 'hamilton-valley',
    state: 'NSW',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      "Hamilton Valley is a western working-class residential suburb of Albury with a genuine community demand for quality convenience food and essential services — the current hospitality offer is modest relative to the resident population, and the low commercial rent creates viable economics for correctly calibrated operators.",
      "Demand is 5/10: the working-class residential demographic generates consistent, if modest, demand for value-oriented convenience food, takeaway, and everyday dining — the spend per visit ceiling is lower than the CBD or East Albury, but the trade is reliable and the community loyalty factor is strong once established.",
      "Competition is 3/10: low hospitality operator density in Hamilton Valley reflects the limited commercial investment in this suburb rather than an absence of resident demand — operators who establish trusted community relationships here face limited direct competition.",
      "Rent is 2/10: the lowest commercial rents in the Albury residential suburbs — the cost structure is viable at the volume levels that the working-class catchment can sustain, which is a meaningful advantage when modelling break-even at conservative revenue assumptions.",
      "Hamilton Valley suits operators with genuine community-service intent: the suburb rewards concepts that serve an everyday convenience need at an accessible price point — hospitality operators seeking a lifestyle or destination dining positioning will find the catchment demographic a poor fit for that concept.",
    ],
  },
  {
    name: 'Ettamogah',
    slug: 'ettamogah',
    state: 'NSW',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 3, tourism: 3 },
    why: [
      "Ettamogah sits on the northern Albury fringe adjacent to the Hume Highway corridor — the industrial and commercial land north of the urban boundary captures some highway trade and services the logistics and light industrial workforce in the northern business park precincts.",
      "Demand is 5/10: the Ettamogah demand base is a combination of the industrial and commercial workforce (trade and logistics workers with strong breakfast and lunch demand) and the highway transit trade from Melbourne to Sydney — a smaller but consistent revenue base for correctly positioned operators.",
      "Competition is 2/10: very low hospitality operator density in the northern corridor — the industrial workforce demand is real but has been largely underserved, creating an opportunity for operators who understand the demographic (quick service, value, reliable quality) rather than misaligning a destination dining concept with a trade-and-transit catchment.",
      "Rent is 3/10: fringe industrial and highway commercial rents are priced at the lower end of the Albury market — attractive cost structures for operators who correctly calibrate their concept to the catchment rather than attempting to transplant an inner-city concept to a highway service location.",
      "Seasonality is 3/10: highway trade has some variation with school holiday peak travel periods, but the industrial workforce trade moderates the seasonal volatility — overall a more predictable trading environment than pure tourism locations, but with genuine demand variation through the year.",
    ],
  },
  {
    name: 'Baranduda',
    slug: 'baranduda',
    state: 'VIC',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 2, tourism: 1 },
    why: [
      "Baranduda is a new Wodonga estate on the VIC side southern fringe — significant residential development has delivered a growing young family catchment that is currently without quality hospitality options within the immediate estate, creating a first-mover opportunity for community-oriented operators.",
      "Demand is 5/10: new estate demographics in Baranduda are characterised by young families and dual-income professional couples — a catchment with genuine hospitality demand that will grow materially as the residential development pipeline delivers approved dwelling numbers over the next three to five years.",
      "Competition is 2/10: near-zero established hospitality in Baranduda at present — the first quality operator to establish creates the community dining habit for the entire estate population and builds loyalty before any competition arrives, a structural advantage that compounds as the catchment grows.",
      "Rent is 2/10: new estate commercial tenancies are priced to attract operators, with developer incentives and graduated rent structures common in the early establishment phase — very competitive cost structures relative to the potential of the growing catchment.",
      "The Baranduda opportunity requires timing discipline: operators must commit to an establishment phase where revenue ramps with the residential population, accepting lower initial trading volumes in exchange for the first-mover loyalty advantage — the opportunity is real but the payoff timeline extends to 18 to 36 months post-opening.",
    ],
  },
]

const _ALBURY_WODONGA_BUILT = buildSuburbs(ALBURY_WODONGA_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAlburyWodongaSuburbs(): AlburyWodongaSuburb[] {
  return _ALBURY_WODONGA_BUILT
}

export function getAlburyWodongaSuburb(nameOrSlug: string): AlburyWodongaSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _ALBURY_WODONGA_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getAlburyWodongaSuburbSlugs(): string[] {
  return _ALBURY_WODONGA_BUILT.map((s) => s.slug)
}

export function getAlburyWodongaNearbySuburbs(currentSlug: string, limit = 3): AlburyWodongaSuburb[] {
  const sorted = [..._ALBURY_WODONGA_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
