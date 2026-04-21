/**
 * lib/analyse-data/geelong.ts
 * Engine-computed suburb data for Geelong, VIC.
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

export interface GeelongSuburbSeed {
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

export interface GeelongSuburb extends GeelongSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: GeelongSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: GeelongSuburbSeed[]): GeelongSuburb[] {
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

// ─── Geelong suburb seeds ─────────────────────────────────────────────────────

const GEELONG_SEEDS: GeelongSuburbSeed[] = [
  {
    name: 'Pakington Street, Geelong West',
    slug: 'geelong-west',
    factors: { demand: 9, rent: 5, competition: 7, seasonality: 2, tourism: 4 },
    why: [
      "Pakington Street is Geelong's premier independent retail and hospitality strip — the closest equivalent to Melbourne's Fitzroy but at roughly 40% lower rent, with a professional and creative demographic that expects quality and supports independent operators over chains.",
      "Competition is 7/10, reflecting a genuinely active strip with established operators across coffee, casual dining, and boutique retail — new entrants need a differentiated concept to find a durable position rather than competing head-on with incumbents.",
      "Demand is 9/10, driven by a dual catchment: the immediate Geelong West residential base of young professionals and families, and a broader Geelong-wide destination draw that positions Pakington Street as the city's reference point for independent hospitality quality.",
      "Rent at 5/10 is the critical structural advantage — a main-strip position that would cost $9,000–$14,000/month in Fitzroy is achievable for $3,500–$6,000/month here, producing a materially lower break-even threshold and more resilient unit economics for independent operators.",
      "Low seasonality (2/10) reflects a stable, year-round residential catchment — Pakington Street trade is consistent across all 52 weeks, with no meaningful tourist-driven summer spike or winter cliff to plan around.",
    ],
  },
  {
    name: 'Newtown',
    slug: 'newtown',
    factors: { demand: 8, rent: 5, competition: 5, seasonality: 2, tourism: 3 },
    why: [
      "Newtown is Geelong's most affluent established suburb — a heritage residential precinct with one of the highest household incomes in Greater Geelong, producing a customer base with above-average willingness-to-pay for specialty coffee, quality-casual dining, and independent retail.",
      "Competition is 5/10: the market is validated by existing operators but not saturated — quality independents can find positions with genuine white space rather than fighting for market share against a dozen established competitors.",
      "Demand is 8/10, anchored by consistent repeat trade from high-income local residents rather than tourism or events — this produces reliable weekly revenue that is predictable for financial planning and lease commitment.",
      "Low seasonality (2/10) and low tourism (3/10) together mean the entire customer base is local and habitual — operators who build genuine community relationships see repeat visit rates well above the Geelong average.",
      "Proximity to the Pakington Street corridor creates a natural catchment overlap — Newtown residents who shop and dine on Pakington Street also support neighbourhood-level venues within walking distance of their homes.",
    ],
  },
  {
    name: 'Geelong CBD / Little Malop Street',
    slug: 'geelong-cbd',
    factors: { demand: 8, rent: 6, competition: 7, seasonality: 3, tourism: 5 },
    why: [
      "Little Malop Street and the broader Geelong CBD have undergone significant reinvention since 2018 — the pedestrianised core has attracted a genuinely independent hospitality culture that competes on quality rather than footfall volume, supported by Geelong Waterfront adjacency driving lunch and after-work trade.",
      "Tourism is 5/10, reflecting the Geelong Waterfront's role as a regional visitor destination — cruise ship visits, Geelong Botanic Gardens access, and day-trippers from Melbourne add a meaningful demand layer beyond the local professional base.",
      "Competition is 7/10: the CBD has attracted skilled operators who have raised the quality benchmark — generic hospitality concepts are outcompeted quickly, while differentiated offerings build loyal followings that extend beyond the immediate CBD catchment.",
      "Rent is 6/10 — elevated relative to Pakington Street but significantly below Melbourne CBD equivalents; a prime Little Malop Street position achieves CBD adjacency and foot traffic at a fraction of Flinders Lane pricing.",
      "Seasonality is 3/10: CBD trade is moderately event-driven through Geelong Football Club matches, major events at GMHBA Stadium, and the Geelong Show — operators benefit from structured revenue uplifts without the sharp seasonal cliff of the Surf Coast markets.",
    ],
  },
  {
    name: 'South Geelong / Rippleside',
    slug: 'south-geelong',
    factors: { demand: 7, rent: 4, competition: 4, seasonality: 3, tourism: 4 },
    why: [
      "Rippleside and South Geelong occupy a strategic position between the CBD and the waterfront — Cunningham Pier events and the Eastern Beach foreshore drive consistent hospitality demand that is currently underserved by quality independent operators.",
      "Tourism is 4/10 from waterfront activity and Geelong Waterfront events — weekends generate visitor foot traffic that supplements a growing residential base, creating a dual-demand structure that reduces weekday/weekend revenue volatility.",
      "Competition is 4/10: genuinely low for a waterfront-adjacent market with this demand trajectory — operators who establish here benefit from first-mover recognition among a growing local residential population and a recurring visitor base.",
      "Rent is 4/10: below the CBD and well below comparable Melbourne waterfront positions — the cost structure supports independent operators who would be priced out of prime CBD or Pakington Street positions.",
      "The Cunningham Pier precinct has hosted consistently high-attendance events since 2019, embedding a hospitality expectation in the local market that neighbourhood-level venues can capture without competing directly with CBD operators.",
    ],
  },
  {
    name: 'Belmont',
    slug: 'belmont',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 2, tourism: 2 },
    why: [
      "Belmont is Geelong's established southeastern residential hub — the Myers Street and High Street corridor serves a stable, high-loyalty family and professional demographic that supports consistent but moderate-volume trade from local residents who shop and dine close to home.",
      "Low seasonality (2/10) and low tourism (2/10) define Belmont as a pure local-residential market — customer acquisition requires genuine community investment, but operators who execute consistently build durable repeat businesses with very low churn.",
      "Competition is 5/10: a validated market without saturation — independent operators compete against established peers but retain meaningful white space for differentiated concepts, particularly in specialty coffee and quality-casual dining.",
      "Rent is 4/10: affordable for the demographic quality — Belmont delivers a household income profile comparable to inner-Geelong suburbs at rents that reflect its suburban positioning, creating viable unit economics for operators with realistic volume expectations.",
      "The Myers Street Shopping Centre anchors consistent foot traffic to the precinct, generating passing trade that neighbourhood hospitality venues capture without relying on their own destination positioning.",
    ],
  },
  {
    name: 'Torquay',
    slug: 'torquay',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 5, tourism: 7 },
    why: [
      "Torquay is the Surf Coast gateway — the first stop from Melbourne on the Great Ocean Road and the commercial heart of Australia's surf culture, with a tourism draw that produces very high peak-season foot traffic from October through April.",
      "Tourism is 7/10: the combination of Bells Beach surf events, Great Ocean Road visitor traffic, and a growing permanent population of lifestyle-driven professionals creates a multi-layered demand structure that few regional markets can match.",
      "Seasonality is 5/10 and represents the genuine risk — summer revenue is exceptional, but winter months (June–August) see tourist trade fall significantly, requiring operators to cultivate a strong permanent resident base to sustain off-season cash flow.",
      "Competition is 5/10: a validated hospitality market with established operators, particularly in surf lifestyle retail and casual dining — new entrants need a clear point of difference to carve out a durable position rather than relying on tourist traffic alone.",
      "Rent is 4/10: significantly below Gold Coast or Byron Bay equivalents despite comparable tourism demographics — the cost advantage relative to comparable coastal markets is Torquay's structural advantage for operators who correctly model the seasonality.",
    ],
  },
  {
    name: 'Ocean Grove',
    slug: 'ocean-grove',
    factors: { demand: 7, rent: 4, competition: 5, seasonality: 5, tourism: 6 },
    why: [
      "Ocean Grove is the Bellarine Peninsula's lifestyle hub — a large permanent residential base combined with a significant holiday home population creates a dual-demand structure that differentiates it from purely tourist-dependent coastal markets.",
      "Tourism is 6/10: summer school holiday peaks are significant, driven by Melbourne families who treat Ocean Grove as a holiday destination — but the larger permanent population compared to other Bellarine towns moderates the severity of the off-season dip.",
      "Seasonality is 5/10: the revenue differential between summer peak and winter base is real but more manageable than Surf Coast markets — operators with a genuine local community following can sustain viable cash flow year-round.",
      "Demand is 7/10, reflecting both the growing permanent residential base (Ocean Grove is one of the Bellarine's fastest-growing towns by population) and the consistent holiday visitor volume that arrives across school holiday periods.",
      "Rent is 4/10: coastal pricing that reflects the lifestyle premium without the speculative inflation seen in more tourist-intensive markets — independent operators can access high-quality positions at rents that support sustainable unit economics.",
    ],
  },
  {
    name: 'Lara',
    slug: 'lara',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Lara sits in the northern growth corridor between Geelong and Melbourne — a suburb that is transitioning from a commuter bedroom community to a more self-contained residential hub as population growth continues along the Princes Freeway corridor.",
      "Competition is 3/10: the hospitality supply in Lara remains thin relative to its growing population — independent operators who establish here face limited direct competition and can build first-mover brand loyalty in a market that will continue to grow.",
      "Rent is 3/10: the lowest of any viable Geelong market, making break-even achievable at lower revenue thresholds than any inner-Geelong position — the economics support independent operators who are willing to build a customer base over time.",
      "Low seasonality (2/10) and low tourism (2/10) reflect an almost entirely residential market — trade is predictable and consistent, driven by local habit rather than visitor flows or seasonal events.",
      "The ongoing residential development in the Lara growth corridor and freeway-adjacent commercial precincts will continue to expand the catchment over the next 5–10 years, making current entry positions asymmetrically advantaged.",
    ],
  },
  {
    name: 'Armstrong Creek',
    slug: 'armstrong-creek',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Armstrong Creek is the fastest-growing new suburb south of Geelong — a planned community that has delivered thousands of new dwellings since 2015 and continues to expand, creating a young professional and family demographic that is significantly underserved by quality hospitality.",
      "Competition is 3/10: the hospitality supply in Armstrong Creek is in its early stages — operators who establish here now are building brand relationships with a growing permanent population before the precinct reaches the supply density that drives up competition.",
      "Rent is 3/10: new-suburb commercial rents that reflect the early stage of the precinct's development — the gap between demographic quality and rent level will compress over time as the suburb matures, making current entry conditions asymmetrically favourable.",
      "The demographic profile — young families, dual-income professionals, and new-home owners — supports consistent cafe and casual dining spend, with a customer base that has limited established alternatives and strong appetite for quality independent operators.",
      "Armstrong Creek's proximity to the Surf Coast and Bellarine Peninsula creates a weekend lifestyle orientation that will support quality independent operators who position themselves as the local alternative to driving into Geelong or Torquay.",
    ],
  },
  {
    name: 'Corio',
    slug: 'corio',
    factors: { demand: 5, rent: 2, competition: 3, seasonality: 2, tourism: 1 },
    why: [
      "Corio is Geelong's industrial north — a suburb defined by its proximity to the Ford manufacturing legacy and continuing industrial/logistics employment, with a median household income that constrains premium pricing for independent operators.",
      "Demand is 5/10: the workforce-driven demand for value food and essential services is consistent, but the limited professional residential base reduces the ceiling for specialty concepts — operators must calibrate their offer to the catchment's spending capacity.",
      "Rent is 2/10: the lowest in Greater Geelong, making break-even achievable at very low revenue thresholds — the economics work for value-positioned operators, quick-service formats, and essential services that do not depend on premium pricing.",
      "Competition is 3/10 and tourism is 1/10 — Corio is a pure local-residential and workforce market with limited visitor traffic or premium demand, requiring operators to build their business on local repeat trade rather than destination positioning.",
      "The long-term opportunity in Corio is tied to industrial corridor infrastructure investment and any residential renewal in the northern suburbs — operators who enter early at very low rent can build durable community businesses if they correctly calibrate their concept to the local market.",
    ],
  },
]

const _GEELONG_BUILT = buildSuburbs(GEELONG_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getGeelongSuburbs(): GeelongSuburb[] {
  return _GEELONG_BUILT
}

export function getGeelongSuburb(nameOrSlug: string): GeelongSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _GEELONG_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getGeelongSuburbSlugs(): string[] {
  return _GEELONG_BUILT.map((s) => s.slug)
}

export function getGeelongNearbySuburbs(currentSlug: string, limit = 3): GeelongSuburb[] {
  const sorted = [..._GEELONG_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
