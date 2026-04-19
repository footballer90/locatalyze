/**
 * Sydney suburb seed data — engine-derived scores only.
 *
 * Factors (all 1–10):
 *   demand    = demandStrength  (higher = better)
 *   rent      = rentPressure    (higher = more expensive / worse)
 *   comp      = competitionDensity (higher = more saturated / worse)
 *   season    = seasonalityRisk (higher = more volatile / worse)
 *   tourism   = tourismDependency (higher = tourism-driven)
 */

import {
  assertNoManualScores,
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from './scoring-engine'

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface SuburbSeed {
  name: string
  slug: string
  factors: { demand: number; rent: number; comp: number; season: number; tourism: number }
  why: string[]
}

export interface SuburbModel extends SuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: SuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.comp,
    seasonalityRisk: f.season,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: SuburbSeed[]): SuburbModel[] {
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

// ─── Sydney suburbs ────────────────────────────────────────────────────────────

const SYDNEY_SEEDS: SuburbSeed[] = [
  {
    name: 'Newtown',
    slug: 'newtown',
    factors: { demand: 10, rent: 5, comp: 6, season: 2, tourism: 4 },
    why: [
      'Demand 10/10: King Street delivers unmatched independent hospitality foot traffic with a loyal, high-frequency local demographic.',
      'Rent 5/10: moderate for inner-city — accessible compared to Surry Hills or the CBD.',
    ],
  },
  {
    name: 'Surry Hills',
    slug: 'surry-hills',
    factors: { demand: 10, rent: 6, comp: 6, season: 2, tourism: 5 },
    why: [
      'Demand 10/10: Crown Street is one of Australia\'s densest premium hospitality strips — 400+ venues drawing high-income professional residents.',
      'Competition 6/10: elevated but spread across enough street frontage that well-positioned independents find unclaimed niches.',
    ],
  },
  {
    name: 'Glebe',
    slug: 'glebe',
    factors: { demand: 9, rent: 5, comp: 5, season: 2, tourism: 4 },
    why: [
      'Demand 9/10: Glebe Point Road café culture anchored by University of Sydney proximity and strong residential density.',
      'Rent 5/10: significantly lower than neighbouring Newtown for comparable foot traffic quality.',
    ],
  },
  {
    name: 'Redfern',
    slug: 'redfern',
    factors: { demand: 9, rent: 6, comp: 5, season: 2, tourism: 3 },
    why: [
      'Demand 9/10: rapid gentrification since 2018 has transformed Redfern into a destination hospitality precinct.',
      'Tourism 3/10: locally-driven demand base — strong weekday professional lunch crowd, steady evening trade.',
    ],
  },
  {
    name: 'Marrickville',
    slug: 'marrickville',
    factors: { demand: 9, rent: 4, comp: 5, season: 3, tourism: 3 },
    why: [
      'Demand 9/10: inner west cultural hub with a fiercely loyal local customer base across cafés, specialty food, and creative retail.',
      'Rent 4/10: one of the best rent-to-foot-traffic ratios in inner Sydney — a genuine opportunity for independent operators.',
    ],
  },
  {
    name: 'Balmain',
    slug: 'balmain',
    factors: { demand: 8, rent: 6, comp: 4, season: 3, tourism: 4 },
    why: [
      'Demand 8/10: high-income residential peninsula with strong weekend trade on Darling Street.',
      'Competition 4/10: lower venue density than comparable inner-city suburbs creates room for differentiated operators.',
    ],
  },
  {
    name: 'Leichhardt',
    slug: 'leichhardt',
    factors: { demand: 8, rent: 5, comp: 5, season: 3, tourism: 3 },
    why: [
      'Demand 8/10: Norton Street Italian precinct draws destination diners from across Greater Sydney.',
      'Rent 5/10: moderate — accessible entry point for operators wanting inner-west positioning.',
    ],
  },
  {
    name: 'Paddington',
    slug: 'paddington',
    factors: { demand: 9, rent: 7, comp: 6, season: 2, tourism: 6 },
    why: [
      'Demand 9/10: Oxford Street and Five Ways draw high-spending fashion, hospitality, and gallery crowds.',
      'Tourism 6/10: significant visitor spend from interstate and international tourists overlaps with premium local demographic.',
    ],
  },
  {
    name: 'Double Bay',
    slug: 'double-bay',
    factors: { demand: 8, rent: 8, comp: 5, season: 3, tourism: 7 },
    why: [
      'Demand 8/10: ultra-high income demographic with strong appetite for premium café, dining, and retail.',
      'Rent 8/10: premium — conservative unit economics required to absorb $12,000–$18,000/month rents.',
    ],
  },
  {
    name: 'Woollahra',
    slug: 'woollahra',
    factors: { demand: 8, rent: 7, comp: 5, season: 3, tourism: 5 },
    why: [
      'Demand 8/10: Queen Street antique and café precinct with a wealthy residential and design professional catchment.',
      'Rent 7/10: high — boutique operators with strong margins perform; volume-dependent models struggle.',
    ],
  },
  {
    name: 'Potts Point',
    slug: 'potts-point',
    factors: { demand: 9, rent: 7, comp: 6, season: 3, tourism: 7 },
    why: [
      'Demand 9/10: Macleay Street hospitality density rivals Newtown; apartment-heavy demographics drive daily café and dining visits.',
      'Tourism 7/10: Potts Point hotel and serviced apartment concentration supports evening restaurant trade.',
    ],
  },
  {
    name: 'Rozelle',
    slug: 'rozelle',
    factors: { demand: 8, rent: 5, comp: 4, season: 3, tourism: 3 },
    why: [
      'Demand 8/10: Darling Street café strip catches inner-west commuters and a rapidly gentrifying residential base.',
      'Competition 4/10: gap between demand and venue supply creates genuine opportunity for new independents.',
    ],
  },
  {
    name: 'Petersham',
    slug: 'petersham',
    factors: { demand: 8, rent: 4, comp: 4, season: 3, tourism: 3 },
    why: [
      'Demand 8/10: New Canterbury Road Lebanese precinct draws destination food customers from across the inner west.',
      'Rent 4/10: significantly underpriced relative to neighbouring Newtown — best value inner-west entry point.',
    ],
  },
  {
    name: 'Mosman',
    slug: 'mosman',
    factors: { demand: 8, rent: 7, comp: 4, season: 3, tourism: 5 },
    why: [
      'Demand 8/10: highest household income per capita in NSW; Military Road supports premium café and specialty retail.',
      'Competition 4/10: lower venue density than income level would suggest — upside for well-positioned entrants.',
    ],
  },
  {
    name: 'Neutral Bay',
    slug: 'neutral-bay',
    factors: { demand: 8, rent: 6, comp: 5, season: 3, tourism: 5 },
    why: [
      'Demand 8/10: Military Road food and service precinct catching lower north shore professional commuters daily.',
      'Rent 6/10: moderate — accessible for operators who can capture the reliable weekday corporate lunch market.',
    ],
  },
  {
    name: 'Randwick',
    slug: 'randwick',
    factors: { demand: 8, rent: 5, comp: 5, season: 3, tourism: 4 },
    why: [
      'Demand 8/10: UNSW and Prince of Wales Hospital create a reliable dual-demographic of students and healthcare workers.',
      'Rent 5/10: moderate with strong daytime foot traffic predictability from institutional anchors.',
    ],
  },
  {
    name: 'Sydney CBD',
    slug: 'sydney-cbd',
    factors: { demand: 10, rent: 9, comp: 8, season: 3, tourism: 8 },
    why: [
      'Demand 10/10: maximum foot traffic — but hybrid work has permanently reduced weekday lunchtime populations by 25–30% since 2020.',
      'Rent 9/10: $15,000–$38,000/month eliminates margin for independent operators unless premium pricing and very high volume align.',
    ],
  },
  {
    name: 'North Sydney',
    slug: 'north-sydney',
    factors: { demand: 9, rent: 8, comp: 6, season: 3, tourism: 7 },
    why: [
      'Demand 9/10: corporate concentration — 40,000+ office workers create predictable weekday lunch and coffee demand.',
      'Rent 8/10: high; weekend trade is thin, so operators need strong weekday-only economics to survive.',
    ],
  },
  {
    name: 'Ultimo',
    slug: 'ultimo',
    factors: { demand: 7, rent: 6, comp: 5, season: 4, tourism: 6 },
    why: [
      'Demand 7/10: UTS and TAFE proximity drives student lunch trade but strong seasonality with semester breaks.',
      'Tourism 6/10: Powerhouse Museum and media industry presence add visitor spend but inconsistently.',
    ],
  },
  {
    name: 'Chatswood',
    slug: 'chatswood',
    factors: { demand: 9, rent: 7, comp: 7, season: 3, tourism: 7 },
    why: [
      'Demand 9/10: North Shore retail epicentre with unmatched Asian market concentration — strongest Chinese consumer market outside Sydney CBD.',
      'Competition 7/10: elevated; well-capitalised operators have established dominant positions in the main mall strips.',
    ],
  },
  {
    name: 'Hornsby',
    slug: 'hornsby',
    factors: { demand: 7, rent: 4, comp: 5, season: 4, tourism: 6 },
    why: [
      'Demand 7/10: northern corridor anchor for a large suburban catchment; Westfield drives reliable Saturday foot traffic.',
      'Rent 4/10: significantly underpriced relative to its catchment size — best value north shore positioning.',
    ],
  },
  {
    name: 'Ryde',
    slug: 'ryde',
    factors: { demand: 8, rent: 4, comp: 5, season: 3, tourism: 5 },
    why: [
      'Demand 8/10: growing professional and Asian-Australian demographic; consistent daily trade from Top Ryde City Westfield.',
      'Rent 4/10: moderate — one of the best rent-to-foot-traffic ratios north of the Harbour Bridge.',
    ],
  },
  {
    name: 'Bondi',
    slug: 'bondi',
    factors: { demand: 9, rent: 7, comp: 6, season: 5, tourism: 7 },
    why: [
      'Demand 9/10: Bondi Road and Hall Street drive year-round café and retail demand with a particularly strong summer premium.',
      'Seasonality 5/10: winter shoulder sees meaningful drop in foot traffic vs. peak summer — cash flow planning essential.',
    ],
  },
  {
    name: 'Bondi Beach',
    slug: 'bondi-beach',
    factors: { demand: 9, rent: 8, comp: 6, season: 6, tourism: 8 },
    why: [
      'Demand 9/10: Campbell Parade and the beachfront strip produce the highest tourist spend per square metre of any Sydney suburb.',
      'Seasonality 6/10: significant winter revenue cliff — operators must budget for 3–4 lean months annually.',
    ],
  },
  {
    name: 'Burwood',
    slug: 'burwood',
    factors: { demand: 8, rent: 5, comp: 6, season: 3, tourism: 6 },
    why: [
      'Demand 8/10: Burwood Road Korean and Asian restaurant corridor draws destination diners from across inner-west and north-west Sydney.',
      'Tourism 6/10: significant Korean diaspora visitor spend makes this a genuine dining destination rather than a local-only market.',
    ],
  },
  {
    name: 'Strathfield',
    slug: 'strathfield',
    factors: { demand: 8, rent: 5, comp: 6, season: 3, tourism: 5 },
    why: [
      'Demand 8/10: multicultural food precinct with strong Asian community loyalty driving repeat dining visits.',
      'Rent 5/10: accessible inner-west entry — strong train connectivity brings catchment from Parramatta and the CBD.',
    ],
  },
  {
    name: 'Parramatta',
    slug: 'parramatta',
    factors: { demand: 9, rent: 5, comp: 9, season: 3, tourism: 7 },
    why: [
      'Demand 9/10: best rent-to-foot-traffic ratio in Greater Sydney with 40,000+ daily workers and a growing residential base.',
      'Competition 9/10: The Coffee Club, Starbucks, Gloria Jean\'s, and Muffin Break dominate Church Street — independents need strong concept differentiation to break through chain saturation.',
    ],
  },
  {
    name: 'Auburn',
    slug: 'auburn',
    factors: { demand: 7, rent: 3, comp: 5, season: 4, tourism: 5 },
    why: [
      'Demand 7/10: Auburn Road Middle Eastern food precinct draws destination diners across Sydney for specialty cuisine.',
      'Rent 3/10: low — inner-west proximity at outer-west pricing creates an undervalued opportunity for the right concept.',
    ],
  },
  {
    name: 'Granville',
    slug: 'granville',
    factors: { demand: 7, rent: 3, comp: 4, season: 4, tourism: 5 },
    why: [
      'Demand 7/10: multicultural community drives consistent specialty food and service demand with strong loyalty.',
      'Rent 3/10: very affordable — accessible entry point for operators targeting specific cultural demographics.',
    ],
  },
  {
    name: 'Merrylands',
    slug: 'merrylands',
    factors: { demand: 7, rent: 3, comp: 5, season: 4, tourism: 4 },
    why: [
      'Demand 7/10: multicultural community cohesion drives higher revisit rates than comparable Western Sydney suburbs.',
      'Rent 3/10: 50% below inner-city pricing with solid accessibility via Merrylands station.',
    ],
  },
  {
    name: 'Bankstown',
    slug: 'bankstown',
    factors: { demand: 7, rent: 3, comp: 6, season: 4, tourism: 5 },
    why: [
      'Demand 7/10: demographic diversity drives specialty food and services demand — Arabic, Vietnamese and Chinese community clusters each sustain distinct precincts.',
      'Competition 6/10: elevated in the main mall — side streets and specialty food retain clear opportunity.',
    ],
  },
  {
    name: 'Blacktown',
    slug: 'blacktown',
    factors: { demand: 7, rent: 3, comp: 6, season: 4, tourism: 4 },
    why: [
      'Demand 7/10: large western Sydney catchment with Westfield driving reliable Saturday foot traffic for value retail and food.',
      'Competition 6/10: chain-heavy main strip — differentiated independents in the food and services category retain strong prospects.',
    ],
  },
  {
    name: 'Liverpool',
    slug: 'liverpool',
    factors: { demand: 7, rent: 3, comp: 6, season: 4, tourism: 5 },
    why: [
      'Demand 7/10: south-west anchor with growing professional and healthcare employee base from Liverpool Hospital.',
      'Rent 3/10: low with improving infrastructure investment — strong 5-year growth trajectory.',
    ],
  },
  {
    name: 'Campbelltown',
    slug: 'campbelltown',
    factors: { demand: 7, rent: 2, comp: 4, season: 4, tourism: 4 },
    why: [
      'Demand 7/10: south-west growth corridor; healthcare and education employment anchors drive reliable service demand.',
      'Rent 2/10: very low — genuine opportunity for operators who can build a loyal local following in an underserved market.',
    ],
  },
  {
    name: 'Fairfield',
    slug: 'fairfield',
    factors: { demand: 6, rent: 2, comp: 5, season: 5, tourism: 3 },
    why: [
      'Demand 6/10: multicultural specialty food demand is genuine but income demographics limit higher-priced categories.',
      'Rent 2/10: lowest rents in inner-south-west — viable for operators targeting specific community dining formats.',
    ],
  },
  {
    name: 'Lakemba',
    slug: 'lakemba',
    factors: { demand: 6, rent: 2, comp: 4, season: 5, tourism: 4 },
    why: [
      'Demand 6/10: Haldon Street is one of Sydney\'s most visited Middle Eastern food precincts — draws destination visitors especially on weekends.',
      'Rent 2/10: low entry cost for operators targeting the Lebanese and Muslim community food market.',
    ],
  },
  {
    name: 'Penrith',
    slug: 'penrith',
    factors: { demand: 7, rent: 2, comp: 5, season: 4, tourism: 4 },
    why: [
      'Demand 7/10: Western Sydney Olympic infrastructure investment is reshaping Penrith\'s commercial base and population growth trajectory.',
      'Rent 2/10: very affordable — strong 10-year growth case as airport and Olympic venue development accelerates.',
    ],
  },
  {
    name: 'Mount Druitt',
    slug: 'mount-druitt',
    factors: { demand: 5, rent: 2, comp: 4, season: 5, tourism: 3 },
    why: [
      'Demand 5/10: large population base but lower average income limits premium pricing; essential services and value food perform reliably.',
      'Rent 2/10: lowest rents in Greater Sydney — viable for value concepts and community service businesses.',
    ],
  },
  {
    name: 'Alexandria',
    slug: 'alexandria',
    factors: { demand: 9, rent: 6, comp: 5, season: 3, tourism: 4 },
    why: [
      'Demand 9/10: creative and industrial precinct undergoing rapid gentrification — growing daytime hospitality demand from tech and design workers.',
      'Rent 6/10: rising fast as development accelerates; operators entering now face lower rents than in 3 years.',
    ],
  },
  {
    name: 'Erskineville',
    slug: 'erskineville',
    factors: { demand: 8, rent: 6, comp: 6, season: 2, tourism: 3 },
    why: [
      'Erskineville Road and the station corridor deliver strong weekday coffee and convenience demand from rail commuters and apartment residents.',
      'Rent has lifted with the post-2019 apartment pipeline, so margins are tighter than in nearby Marrickville despite similar inner-west spending behaviour.',
      'The suburb is now a mature gentrification pocket: younger professional households keep discretionary spend high, but concept differentiation is essential because venue density has risen quickly.',
    ],
  },
  {
    name: 'Waterloo',
    slug: 'waterloo',
    factors: { demand: 8, rent: 6, comp: 5, season: 2, tourism: 3 },
    why: [
      'High-density apartment living creates reliable seven-day local demand, especially for short-distance food, health, and service retail.',
      'Competition is still moderate outside East Village, so operators on secondary streets can avoid direct chain-heavy pressure.',
      'Metro-driven connectivity and ongoing redevelopment are increasing footfall quality year-on-year, but rent repricing is catching up fast.',
    ],
  },
  {
    name: 'Zetland',
    slug: 'zetland',
    factors: { demand: 8, rent: 6, comp: 5, season: 2, tourism: 2 },
    why: [
      'Zetland\'s compact residential density supports high repeat-frequency spending rather than occasional destination trade.',
      'East Village captures core traffic, so strip locations need a convenience-led or niche proposition to convert local households.',
      'Demographic mix is trending toward higher-income young professionals, supporting premium-lite pricing but not luxury-only positioning.',
    ],
  },
  {
    name: 'Dulwich Hill',
    slug: 'dulwich-hill',
    factors: { demand: 7, rent: 4, comp: 4, season: 2, tourism: 2 },
    why: [
      'Light rail plus station access drives consistent commuter coffee demand with a stable local residential base.',
      'Rent remains materially below Newtown/Enmore equivalents, creating one of the better inner-west cost-to-demand profiles.',
      'The suburb is in a slower-burn gentrification phase, which favours operators with community retention over high-volume destination playbooks.',
    ],
  },
  {
    name: 'Ashfield',
    slug: 'ashfield',
    factors: { demand: 7, rent: 4, comp: 5, season: 3, tourism: 2 },
    why: [
      'Liverpool Road and the station node generate dependable daily traffic from transit users and local family households.',
      'Competition is concentrated in established Asian dining clusters, so new entrants need clear category whitespace rather than generic offerings.',
      'Infrastructure and housing turnover are improving spending depth, but price sensitivity remains higher than in nearby premium inner-west pockets.',
    ],
  },
  {
    name: 'Crows Nest',
    slug: 'crows-nest',
    factors: { demand: 8, rent: 7, comp: 7, season: 2, tourism: 3 },
    why: [
      'Pacific Highway and Willoughby Road combine office-worker lunches with affluent local evening demand, creating strong daypart coverage.',
      'Rents are high and competition is dense, so undifferentiated cafe and casual dining models are easily margin-compressed.',
      'Metro accessibility and nearby commercial growth support long-term demand, but tenant quality expectations are now notably higher.',
    ],
  },
  {
    name: 'Lane Cove',
    slug: 'lane-cove',
    factors: { demand: 7, rent: 6, comp: 5, season: 2, tourism: 2 },
    why: [
      'Lane Cove village has stable spend from dual-income families and professionals, with strong weekday service demand.',
      'Competition is moderate and mostly clustered, allowing specialist operators to win through convenience and quality consistency.',
      'Recent apartment delivery has lifted catchment density, but customer expectations around fitout and product quality have risen in parallel.',
    ],
  },
  {
    name: 'Kirribilli',
    slug: 'kirribilli',
    factors: { demand: 8, rent: 8, comp: 5, season: 3, tourism: 6 },
    why: [
      'Milsons Point station proximity and harbourside foot traffic create strong baseline demand across weekdays and weekends.',
      'Rent pressure is premium-level for small shopfronts, requiring high ticket quality or strong turnover discipline.',
      'Tourism and event spillover from the harbour precinct add upside, but operators are still primarily judged by affluent local repeat customers.',
    ],
  },
  {
    name: 'Rose Bay',
    slug: 'rose-bay',
    factors: { demand: 7, rent: 7, comp: 5, season: 3, tourism: 5 },
    why: [
      'New South Head Road captures affluent residential spend and ferry-linked movement, supporting premium neighbourhood retail formats.',
      'Rents are high relative to strip scale, so smaller footprints with efficient labour models perform better than large-format hospitality.',
      'Demographic stability is a strength, but growth is incremental rather than explosive, making execution quality more important than hype.',
    ],
  },
  {
    name: 'Coogee',
    slug: 'coogee',
    factors: { demand: 8, rent: 7, comp: 6, season: 5, tourism: 7 },
    why: [
      'Beach adjacency and dense local apartment living support strong all-day hospitality demand, especially weekends.',
      'High occupancy costs and saturated food competition reduce error tolerance for new operators entering peak-season assumptions.',
      'Seasonality is real: winter softness and weather variability can materially impact cash flow versus summer trading expectations.',
    ],
  },
  {
    name: 'Manly',
    slug: 'manly',
    factors: { demand: 9, rent: 8, comp: 8, season: 6, tourism: 8 },
    why: [
      'Ferry arrivals, beach traffic, and a high-spending local base make Manly one of Sydney\'s strongest lifestyle-demand precincts.',
      'Competition is intensely saturated in core strips, and rent levels force operators to maintain high throughput to protect margin.',
      'Tourism lifts peak revenue but increases volatility; operators without shoulder-season strategy often overestimate annual performance.',
    ],
  },
  {
    name: 'Dee Why',
    slug: 'dee-why',
    factors: { demand: 7, rent: 5, comp: 5, season: 4, tourism: 5 },
    why: [
      'The beachfront plus Pittwater Road corridor creates a mixed demand profile of locals, commuters, and weekend visitors.',
      'Rent is more manageable than Manly, offering better entry economics for operators targeting mid-market price points.',
      'Population growth in surrounding Northern Beaches apartments is improving depth, though trade remains more weather-sensitive than inland centres.',
    ],
  },
  {
    name: 'Cronulla',
    slug: 'cronulla',
    factors: { demand: 8, rent: 6, comp: 6, season: 5, tourism: 7 },
    why: [
      'The station-to-beach spine delivers strong hospitality and lifestyle retail demand with consistent local loyalty.',
      'Competition is concentrated in established dining strips, so new venues need distinct positioning, not generic beach-cafe execution.',
      'Summer and event periods drive outsized volume, but winter trading softness can pressure businesses built on peak-month assumptions.',
    ],
  },
  {
    name: 'Brookvale',
    slug: 'brookvale',
    factors: { demand: 7, rent: 5, comp: 6, season: 3, tourism: 3 },
    why: [
      'Warringah Mall gravity and light-industrial conversion have built strong daytime demand, particularly for food, fitness, and service concepts.',
      'Competition has accelerated with brewery and casual hospitality clustering, increasing customer acquisition costs.',
      'It\'s a growth corridor with improving demographics, but site selection matters heavily because trade quality changes block-by-block.',
    ],
  },
  {
    name: 'Rouse Hill',
    slug: 'rouse-hill',
    factors: { demand: 7, rent: 5, comp: 5, season: 3, tourism: 2 },
    why: [
      'Metro connectivity and family-oriented residential growth are steadily increasing weekday and weekend local spend.',
      'Competition is anchored by major centre formats, leaving opportunities for neighbourhood convenience and specialised services outside mall ecosystems.',
      'Demand trajectory is positive, but many concepts still need value-led pricing to align with suburban household spend patterns.',
    ],
  },
  {
    name: 'Schofields',
    slug: 'schofields',
    factors: { demand: 6, rent: 4, comp: 3, season: 3, tourism: 1 },
    why: [
      'Rapid housing growth is building a larger local customer base, but commercial maturity still lags residential expansion.',
      'Low competition reflects limited established precinct depth rather than immediate easy demand for all categories.',
      'The opportunity is early-cycle: operators with patience can establish brand loyalty before full corridor saturation.',
    ],
  },
  {
    name: 'Oran Park',
    slug: 'oran-park',
    factors: { demand: 6, rent: 4, comp: 4, season: 3, tourism: 1 },
    why: [
      'Population growth is strong and family-heavy, supporting recurring demand for practical retail and service-led hospitality.',
      'Town-centre concentration means visibility is good, but category overlap is rising as national tenants expand west.',
      'Spending is consistent but value-conscious, so high-ticket premium concepts usually face slower ramp-up than in inner Sydney.',
    ],
  },
  {
    name: 'Leppington',
    slug: 'leppington',
    factors: { demand: 5, rent: 3, comp: 2, season: 3, tourism: 1 },
    why: [
      'Leppington is still early-stage as a commercial market, with demand growing behind large residential land-release programs.',
      'Very low competition signals an immature precinct, so first movers need longer runway before full catchment monetisation.',
      'Infrastructure-led growth is a long-term positive, but near-term trading can be thin outside commuter and essential-service patterns.',
    ],
  },
  {
    name: 'Austral',
    slug: 'austral',
    factors: { demand: 4, rent: 3, comp: 2, season: 4, tourism: 1 },
    why: [
      'Austral remains car-dependent and fragmented, with limited walk-by foot traffic to support spontaneous retail conversion.',
      'Low occupancy cost helps, but weak precinct intensity means customer acquisition relies heavily on destination intent and local awareness.',
      'Growth potential exists through broader south-west expansion, yet current demand depth is still below most metro Sydney trade corridors.',
    ],
  },
  {
    name: 'Marsden Park',
    slug: 'marsden-park',
    factors: { demand: 6, rent: 4, comp: 5, season: 3, tourism: 1 },
    why: [
      'Large-format retail and logistics-driven employment create practical demand for food, services, and convenience categories.',
      'Competition is increasingly chain-led around major retail centres, making independent differentiation harder on mainstream offers.',
      'The suburb\'s growth is structurally strong, but trading is still highly car-based and less supportive of pure impulse walk-in models.',
    ],
  }

]

const _SYDNEY_BUILT = buildSuburbs(SYDNEY_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getSydneySuburbs(): SuburbModel[] {
  return _SYDNEY_BUILT
}

export function getSydneySuburb(name: string): SuburbModel | undefined {
  return _SYDNEY_BUILT.find(
    (s) =>
      s.name.toLowerCase() === name.toLowerCase() ||
      s.slug.toLowerCase() === name.toLowerCase(),
  )
}

export function getSydneySuburbSlugs(): string[] {
  return _SYDNEY_BUILT.map((s) => s.slug)
}

export function getSydneyNearbySuburbs(currentSlug: string, limit = 3): SuburbModel[] {
  const sorted = [..._SYDNEY_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  const filtered = sorted.filter((s) => s.slug !== currentSlug)
  return filtered.slice(0, limit)
}
