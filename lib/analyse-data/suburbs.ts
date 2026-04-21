// lib/analyse-data/suburbs.ts
// Canonical suburb data for /analyse/[city]/[suburb] pages
// Each suburb has: full content, scores, rent data, case scenario, FAQs
//
// MIGRATION NOTE: overallScore, scores, and verdict fields are being phased out.
// As each suburb page migrates to the engine, these will be removed and replaced
// with engine-computed values via get[City]Suburb(slug) from lib/analyse-data/[city].ts
// See docs/engine-migration.md for the full migration plan.

import { SUBURBS } from '@/lib/suburb-data'
import { type LocationFactors } from './scoring-engine'
import { getSydneySuburb, getSydneySuburbs } from './sydney'
import { getPerthSuburb, getPerthSuburbs } from './melbourne'
import { isStaticIndustryHub } from './static-industry-hubs'

export type Verdict = 'GO' | 'CAUTION' | 'NO' | 'RISKY'
export type CompetitionLevel = 'Low' | 'Medium' | 'High' | 'Very High'

export interface RentRange {
  label: string
  range: string
  note: string
}

export interface ScoreBreakdown {
  footTraffic: number
  demographics: number
  rentViability: number
  competitionGap: number
  accessibility: number
}

export interface CaseScenario {
  concept: string
  monthlyRent: number
  dailyCoversRequired: number
  avgSpend: number
  breakEvenTimeline: string
  keyAssumptions: string[]
  verdict: string
}

export interface NearbySuburb {
  name: string
  slug: string
  /** Legacy field — migrated pages use engine compositeScore instead. */
  score?: number
  verdict: Verdict
}

export interface FAQ {
  question: string
  answer: string
}

export interface ContentSection {
  heading: string
  body: string
}

export interface SuburbPageData {
  slug: string
  city: string
  citySlug: string
  name: string
  postcode: string
  state: string
  verdict: Verdict
  /** Legacy field — migrated pages use suburb.compositeScore from engine instead. */
  overallScore?: number
  /** Legacy field — migrated pages use suburb.locationFactors from engine instead. */
  scores?: ScoreBreakdown
  /** Engine factors — when provided, use computeLocationModel() to derive scores. */
  factors?: LocationFactors
  tagline: string
  summary: string
  metaTitle: string
  metaDescription: string
  rentRanges: RentRange[]
  medianIncome: string
  population: string
  targetCustomer: string
  competitionLevel: CompetitionLevel
  sections: ContentSection[]
  advantages: string[]
  disadvantages: string[]
  caseScenario: CaseScenario
  nearbySuburbs: NearbySuburb[]
  faqs: FAQ[]
}

export const SUBURB_PAGE_DATA: Record<string, SuburbPageData> = {
  'sydney/ultimo': {
    slug: 'ultimo',
    city: 'Sydney',
    citySlug: 'sydney',
    name: 'Ultimo',
    postcode: '2007',
    state: 'NSW',
    verdict: 'CAUTION',
    overallScore: 68,
    scores: {
      footTraffic: 72,
      demographics: 58,
      rentViability: 65,
      competitionGap: 74,
      accessibility: 81,
    },
    tagline: 'Student Corridor with Genuine Day-Trade Upside — If You Understand the Market',
    summary:
      "Ultimo is misread as a secondary market. It's not — it's a specialist market. The UTS student population of 45,000+ and TAFE NSW proximity create a daytime demand engine that rewards budget-conscious, high-frequency business models. The mistake most operators make is applying an inner-city premium model to what is fundamentally a value-driven, habitual customer base. Rent is moderate by inner-Sydney standards, competition is thin, and the competition gap score of 74 reflects genuine underservice relative to demand.",
    metaTitle: 'Opening a Business in Ultimo, Sydney — 2026 Location Analysis',
    metaDescription:
      'Ultimo has 45,000+ students, low competition, and moderate rents. But the demographics require a specific approach. Full analysis of Ultimo business opportunity, rent benchmarks, and what actually works.',
    rentRanges: [
      { label: 'Harris Street (Prime)', range: '$4,500–$7,000/mo', note: 'Main street frontage, highest foot traffic. Required for food/beverage.' },
      { label: 'Broadway Junction', range: '$5,000–$7,500/mo', note: 'High-volume pedestrian connection to UTS. Best for quick-service.' },
      { label: 'Secondary Streets', range: '$2,800–$4,500/mo', note: 'Jones, Thomas, Ultimo Road. Works for services and non-foot-traffic businesses.' },
      { label: 'Above-ground / First floor', range: '$2,000–$3,200/mo', note: 'Viable for professional services, tutoring, allied health.' },
    ],
    medianIncome: '$62,000',
    population: '7,200 residents + 45,000+ daily students',
    targetCustomer: 'University students (18–26), young academics, creative professionals, TAFE students, tech workers from nearby Pyrmont/Haymarket',
    competitionLevel: 'Low',
    sections: [
      {
        heading: 'The UTS Effect: Asset and Liability',
        body: "UTS is Ultimo's primary commercial driver — and its most significant constraint. 45,000 students generate consistent daytime foot traffic Monday to Friday, 8am–5pm. The asset: high frequency, habitual visiting patterns, strong lunchtime demand. The liability: students spend cautiously ($8–$15 per visit), prefer value pricing over quality positioning, and completely evacuate during exam periods and semester breaks. A business modelled on the UTS calendar can maintain 80%+ occupancy 37 weeks per year; a business that doesn't account for the 15-week low-traffic periods will experience alarming revenue gaps.",
      },
      {
        heading: "The Competition Gap — Ultimo's Clearest Opportunity Signal",
        body: "Ultimo has a competition gap score of 74 — meaning demand materially exceeds supply for several business categories. There are only 6 independent cafés in the core Ultimo precinct serving a 45,000-student catchment. By comparison, Newtown has 70+ cafés for a resident population of 12,000. The ratio in Ultimo is extraordinarily favourable. Operators who have understood this have built sustainable businesses here; the market has not been fully discovered by the hospitality sector.",
      },
      {
        heading: 'What Works in Ultimo (And Why)',
        body: "Budget-conscious daily-use concepts with fast service and low average transaction values consistently outperform premium concepts in Ultimo. The model: 120+ covers per day, $12–$16 average transaction, high repeat visitation, lean cost structure. This means a well-run casual café, a lunch bowl concept, a dumpling bar, or a healthy fast-casual format can achieve break-even at $6,000/month rent within 4–6 months. The counter-model — a $22 brunch plate with flat whites at $5.50 — will spend 18 months trying to convert students to premium consumer behaviour and fail.",
      },
      {
        heading: 'Rent vs Revenue Reality Check',
        body: "At $5,500/month for a Harris Street position, the break-even revenue requirement is approximately $22,000/month for a café (40% food cost, 35% labour, 25% rent+overhead). This requires 110 covers per day at $14 average spend — achievable on the UTS calendar but not guaranteed during semester breaks. Operators who supplement with delivery (Uber Eats, DoorDash) report 25–30% additional revenue, materially improving semester-break periods when dine-in drops.",
      },
      {
        heading: 'Evening and Weekend: A Different Market',
        body: "Evening Ultimo is a fundamentally different proposition to daytime Ultimo. Students return to residential areas; the resident population of 7,200 is a relatively thin base for dinner trade. Evening foot traffic drops by 60%+ compared to lunch peak. Businesses that attempt a dual daytime/evening model often underperform on both. The strongest Ultimo operators deliberately close by 5–6pm or pivot to delivery-only evenings — reducing labour costs and focusing capital on the profitable daytime window.",
      },
      {
        heading: 'Infrastructure and Access',
        body: "Ultimo scores 81 on accessibility — one of its clearest advantages. Haymarket light rail, Central Station (10-minute walk), and multiple bus routes create exceptional public transport access. This is critical for a student market that skews heavily toward non-car transport. Car parking is practically non-existent and should not factor into business models. Delivery vehicles have limited access to Harris Street during peak hours — factor this into operations planning if delivery is part of the model.",
      },
    ],
    advantages: [
      'Low competition relative to demand — student catchment dramatically underserved by food/beverage options',
      'Captive repeat customer base (UTS 5 days/week, 37 weeks/year)',
      'Excellent public transport access (light rail, Central Station proximity)',
      'Lower rents vs comparable inner-Sydney positions (40–50% below Surry Hills)',
      'Growing tech workforce from adjacent Pyrmont/Haymarket adds higher-income daytime visits',
      'Proximity to CBD without CBD rent premium',
      'Rising residential density via apartment development in the Ultimo/Pyrmont corridor',
    ],
    disadvantages: [
      'Semester break revenue gaps (up to 15 weeks/year of significantly reduced trade)',
      'Price-sensitive customer base limits menu pricing and margins',
      'Evening trade is very weak — business models must account for daytime-only revenue',
      'Parking virtually non-existent — limits older demographic attraction',
      'Weekend foot traffic drops 50–60% without student population',
      'Limited aspirational dining demand — premium concepts consistently underperform',
      'Harris Street rent ($5,000+/month) requires consistent high-volume trade to justify',
    ],
    caseScenario: {
      concept: "Casual lunch and coffee concept — 'study-friendly' format with communal seating, fast service, $12–$16 average spend",
      monthlyRent: 5500,
      dailyCoversRequired: 115,
      avgSpend: 14,
      breakEvenTimeline: '4–6 months (semester weeks), 8–10 months annualised',
      keyAssumptions: [
        'Open Monday–Friday, 7am–5pm. Closed weekends to reduce labour cost',
        'Delivery via Uber Eats/DoorDash supplements semester-break periods (target 25% of revenue)',
        'Menu priced at $10–$17 range with coffee at $5',
        'Lean 4-person team structure, with casual staff during peak periods',
        '37 operating weeks at full capacity, 15 weeks at 50–60% during semester breaks',
      ],
      verdict: "This concept works in Ultimo. The risk is not the market — it's operators who misjudge the pricing ceiling or ignore semester-break planning. With the right format and cost structure, Ultimo's competition gap and captive student base make this a genuinely viable 68-score location.",
    },
    nearbySuburbs: [
      { name: 'Haymarket', slug: 'haymarket', score: 74, verdict: 'GO' },
      { name: 'Surry Hills', slug: 'surry-hills', score: 87, verdict: 'GO' },
      { name: 'Pyrmont', slug: 'pyrmont', score: 73, verdict: 'GO' },
    ],
    faqs: [
      {
        question: 'Is Ultimo a good place to open a café?',
        answer: "Yes, for specific concepts. A value-positioned, fast-service café targeting the UTS student market can perform well in Ultimo — the competition gap is real. A premium brunch café with $22 plates will struggle. The score of 68 reflects the market constraints (semester breaks, price-sensitive demographics) not the absence of opportunity. Operators who understand the UTS calendar and model accordingly succeed here consistently.",
      },
      {
        question: 'What are the best streets in Ultimo for retail?',
        answer: "Harris Street is the primary commercial artery with highest foot traffic — essential for food and beverage. The Broadway junction near UTS campus provides the most consistent student foot traffic. Secondary streets (Jones Street, Thomas Street) work for services businesses that don't rely on walk-in traffic. Above-ground tenancies are viable for tutoring, allied health, and professional services.",
      },
      {
        question: 'How does Ultimo compare to Surry Hills for a new business?',
        answer: "Surry Hills scores 87 vs Ultimo's 68. The gap reflects higher foot traffic diversity, better evening trade, and stronger demographics in Surry Hills. Rents are also 40–60% higher in Surry Hills. For operators who can execute in either market, Surry Hills provides more consistent 7-day revenue; Ultimo provides better economics for daytime-focused concepts with lean cost structures.",
      },
      {
        question: 'What happens to Ultimo businesses during university semester breaks?',
        answer: "Revenue typically drops 40–50% during December/January and June/July semester breaks when the UTS population departs. Experienced Ultimo operators plan for this explicitly: reduce staffing during breaks, increase delivery platform revenue, and use break periods for maintenance and preparation. Businesses that don't model this gap are consistently caught off-guard.",
      },
      {
        question: 'Is the Ultimo commercial rent expensive?',
        answer: "Relative to broader inner Sydney, Ultimo is moderate — Harris Street prime positions are $4,500–$7,000/month versus $9,000–$14,000/month for comparable footprint in Surry Hills. The value proposition exists. The question is whether your business model can generate sufficient revenue from the student/daytime demographic to justify even the moderate Ultimo rent.",
      },
    ],
  },

  'sydney/parramatta': {
    slug: 'parramatta',
    city: 'Sydney',
    citySlug: 'sydney',
    name: 'Parramatta',
    postcode: '2150',
    state: 'NSW',
    verdict: 'GO',
    overallScore: 84,
    scores: {
      footTraffic: 86,
      demographics: 82,
      rentViability: 88,
      competitionGap: 79,
      accessibility: 90,
    },
    tagline: "Western Sydney's Commercial Centre — The Best Rent-to-Foot-Traffic Ratio in Greater Sydney",
    summary:
      "Parramatta is not the second choice. For most business categories, it delivers the strongest unit economics in Greater Sydney: 15,000+ daily pedestrians on Church Street, a professional class of 40,000+ government and corporate workers from Parramatta Square, and commercial rents that are 40–50% below inner Sydney equivalents. The demographic upgrade from the Parramatta Square development — which brought KPMG, NAB, and 5,000+ government workers to a precinct that was previously dominated by transient retail — has fundamentally changed the spending profile of this market.",
    metaTitle: 'Opening a Business in Parramatta, Sydney — 2026 Location Analysis',
    metaDescription:
      'Parramatta scores 84/100 — the best rent-to-foot-traffic ratio in Greater Sydney. Full analysis of Parramatta commercial opportunities, Church Street rents, and demographic breakdown.',
    rentRanges: [
      { label: 'Church Street (Core)', range: '$5,500–$8,500/mo', note: 'Prime pedestrian strip, highest foot traffic, Westfield proximity.' },
      { label: 'Church Street (North)', range: '$4,000–$6,500/mo', note: 'Growing precinct north of Parramatta Square. Corporate worker catchment.' },
      { label: 'Macquarie Street Precinct', range: '$3,500–$6,000/mo', note: 'Government and legal professional strip. Strong weekday lunch trade.' },
      { label: 'Secondary Streets', range: '$2,500–$4,500/mo', note: 'George Street, Phillip Street. Accessible rents for services businesses.' },
    ],
    medianIncome: '$78,000',
    population: '32,000 residents + 40,000+ daily workers',
    targetCustomer: 'Government and corporate workers (35–50), multicultural families, Western Sydney professionals, Parramatta Square office tenants',
    competitionLevel: 'Medium',
    sections: [
      {
        heading: 'Parramatta Square: The Demographic Accelerator',
        body: "Parramatta Square is the single most important commercial development in Western Sydney in two decades. The six-tower development — housing NAB, the Department of Communities, KPMG, and 20,000+ workers — transformed a precinct that was primarily retail-dominated into a genuine commercial CBD. The workers arriving in Parramatta Square have household incomes averaging $105,000+ — materially higher than the Parramatta suburb average of $78,000. This high-income layer now walks Church Street for lunch, coffee, and after-work hospitality. The demographic upgrade is permanent.",
      },
      {
        heading: 'Church Street: The Economics Argument',
        body: "Church Street generates 15,000–18,000 daily pedestrians in its core zone, comparable to many inner-Sydney strips. Prime Church Street rent runs $5,500–$8,500/month versus $9,000–$14,000 for equivalent positions in Surry Hills. The math is stark: an operator in Parramatta pays 40% less in rent for 75–80% of the foot traffic. The revenue gap required to bridge this is modest; the rent savings are significant. For most business categories — café, restaurant, retail — Parramatta's unit economics outperform inner Sydney on a risk-adjusted basis.",
      },
      {
        heading: "Multicultural Advantage — Parramatta's Hidden Strength",
        body: "Parramatta has the most diverse demographic profile of any major Sydney commercial centre. Lebanese, South Asian, Middle Eastern, East Asian, and Pacific Islander communities create specialty food markets with exceptional loyalty characteristics. Lebanese restaurants on Church Street have operated for 20+ years with consistent trade; Indian and Pakistani food operators command customer loyalty that inner-city operators rarely achieve. For food operators targeting multicultural communities, Parramatta's catchment is genuinely unmatched in Greater Sydney.",
      },
      {
        heading: 'Weekday vs Weekend Dynamic',
        body: "Parramatta runs two distinct economic cycles. Weekdays (Monday–Friday) are driven by the 40,000+ professional and government workers concentrated in the Parramatta Square and Westfield precincts — strong lunch trade, good morning coffee, consistent afternoon retail. Weekends shift to family and community patterns — shopping centre dominance, multicultural dining, lower corporate spend. Operators who model only the weekday worker dynamic underestimate weekend family trade; those who model only family trade underestimate the weekday professional opportunity. Both revenue streams are real and complementary.",
      },
      {
        heading: 'Competition Landscape: Growing but Gaps Remain',
        body: "Parramatta's medium competition score (79) reflects a market that is contested but not saturated. The rapid growth of the corporate worker population has created demand that the existing supply has not fully addressed. Specifically: specialty coffee (third-wave café culture is underrepresented), quality casual dining ($35–$60 range is underserved relative to worker incomes), and premium health/wellness. The 'premium' gap in Parramatta is not theoretical — higher-income Parramatta Square workers are currently travelling to Harris Park or Westfield for premium positioning that should be available on Church Street.",
      },
      {
        heading: 'Infrastructure and Accessibility',
        body: "Parramatta scores 90 on accessibility — the highest of any Sydney suburb in our dataset. The recently upgraded Parramatta light rail, Parramatta Station (T1 and Sydney Trains), multiple bus routes, and the future Western Sydney metro extension make Parramatta the most transport-accessible suburban commercial centre in NSW. This accessibility multiplies the catchment: operators in Parramatta draw customers from a 20km radius via PT, not just residents and local workers.",
      },
    ],
    advantages: [
      "Best rent-to-foot-traffic ratio in Greater Sydney — 75% of CBD foot traffic at 40% of CBD rent",
      'Parramatta Square corporate workforce (20,000+ workers) creates guaranteed weekday demand',
      'Multicultural demographics drive loyalty patterns and specialty market demand unavailable in inner Sydney',
      'Highest accessibility score (90/100) — largest PT catchment radius of any suburban centre',
      'Infrastructure investment pipeline (light rail, metro extension) permanently elevating the commercial profile',
      'Growing residential density: new apartment development is adding permanent resident base',
      'Lower competition relative to demand — premium segments materially underserved',
    ],
    disadvantages: [
      'Westfield concentration risk: Westfield Parramatta dominates retail spending and can undercut independent operators',
      'Premium positioning is more challenging — aspirational dining demand is lower than inner Sydney',
      'Traffic congestion during peak periods affects delivery operations and customer parking',
      'Church Street construction disruption from light rail has ongoing impact on foot traffic patterns (clearing by late 2026)',
      'Some demographic segments are price-sensitive — full-service restaurant pricing above $70/head is harder to sustain',
      "Evening economy is developing but still behind inner Sydney — weeknight dinner trade weaker than CBD fringe",
    ],
    caseScenario: {
      concept: "Quality casual restaurant — modern Australian/fusion, $45–$65 average spend, targeting Parramatta Square worker lunch and Friday dinner trade",
      monthlyRent: 7000,
      dailyCoversRequired: 95,
      avgSpend: 52,
      breakEvenTimeline: '5–7 months',
      keyAssumptions: [
        'Lunch service (12–2:30pm): 60 covers weekdays, 40 weekends',
        'Dinner service (6–9:30pm): 35 covers Thursday–Saturday',
        'BYO licence reduces beverage complexity while maintaining customer spend',
        '4–6 person team with casual Thursday–Saturday dinner additions',
        'Church Street Core position to capture Parramatta Square worker foot traffic',
      ],
      verdict: "Parramatta rewards operators who position correctly. The quality casual gap is real — there is no established quality-casual Australian restaurant on Church Street despite 40,000+ workers with above-average incomes. First-mover into this gap captures loyal repeat customers who currently have no equivalent option. Break-even is achievable within 6 months at these cover targets.",
    },
    nearbySuburbs: [
      { name: 'Merrylands', slug: 'merrylands', score: 74, verdict: 'GO' },
      { name: 'Auburn', slug: 'auburn', score: 71, verdict: 'GO' },
      { name: 'Blacktown', slug: 'blacktown', score: 71, verdict: 'GO' },
    ],
    faqs: [
      {
        question: 'Is Parramatta good for a restaurant or café?',
        answer: "Parramatta scores 84/100 — it's the best overall performer in our Greater Sydney model on a risk-adjusted basis. For cafés, the Parramatta Square worker morning coffee market is substantially underserved by specialty coffee (third-wave café culture is thin here). For restaurants, quality casual and multicultural dining both have genuine market gaps. Avoid trying to replicate a Surry Hills premium dining concept here; instead, position for the worker lunch market and multicultural family dining.",
      },
      {
        question: "How does Parramatta compare to Sydney CBD for business?",
        answer: "Parramatta captures 70–75% of CBD foot traffic at 40–45% of CBD rent. For independent operators in the $30–$70 transaction range, this is materially better unit economics. CBD is preferable for: luxury positioning, international tourist-dependent concepts, and businesses requiring very high-income demographics exclusively. Parramatta is better for: everyday hospitality, multicultural food, retail, professional services, and any concept where rent coverage is the primary risk.",
      },
      {
        question: 'What is Parramatta Square and why does it matter for business?',
        answer: 'Parramatta Square is a $3B commercial development that added 20,000+ professional and government workers to Parramatta. NAB, KPMG, and multiple NSW government agencies occupy the towers. This workforce has household incomes averaging $105,000+ — significantly above the suburb average — and creates consistent weekday demand for quality food, coffee, and services. It has permanently changed the demographic profile of the Church Street precinct.',
      },
      {
        question: 'What businesses succeed in Parramatta?',
        answer: "Consistently successful in Parramatta: multicultural food operators (Lebanese, Indian, Pakistani, Middle Eastern), specialty coffee (supply gap), professional services (legal, financial, allied health), value-to-mid retail (not luxury), health and wellness (growing professional catchment). Consistently underperforming: premium dining ($80+ per head), luxury retail, CBD-style volume fast food in secondary positions.",
      },
      {
        question: 'What are commercial rents in Parramatta?',
        answer: "Church Street Core (prime): $5,500–$8,500/month. Church Street North (Parramatta Square precinct): $4,000–$6,500/month. Macquarie Street/Government area: $3,500–$6,000/month. Secondary streets: $2,500–$4,500/month. Rents increased 15–18% since 2023 following Parramatta Square completion but remain 40% below comparable Surry Hills positions.",
      },
    ],
  },
}

const GENERATED_SUBURB_CACHE: Record<string, SuburbPageData> = {}

function mapCompetitionLevel(footTraffic: string): CompetitionLevel {
  if (footTraffic === 'Very High') return 'Very High'
  if (footTraffic === 'High') return 'High'
  if (footTraffic === 'Moderate') return 'Medium'
  return 'Low'
}

function toVerdict(score: number): Verdict {
  if (score >= 78) return 'GO'
  if (score >= 62) return 'CAUTION'
  return 'NO'
}

function fromEngineVerdict(v: 'GO' | 'CAUTION' | 'RISKY'): Verdict {
  return v
}

function buildSydneyEngineSuburbPageData(suburbSlug: string): SuburbPageData | null {
  const suburb = getSydneySuburb(suburbSlug)
  if (!suburb) return null

  const nearbySuburbs: NearbySuburb[] = getSydneySuburbs()
    .filter((s) => s.slug !== suburb.slug)
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 3)
    .map((s) => ({
      name: s.name,
      slug: s.slug,
      score: s.compositeScore,
      verdict: fromEngineVerdict(s.verdict),
    }))

  const demand = suburb.locationFactors.demandStrength
  const rent = suburb.locationFactors.rentPressure
  const comp = suburb.locationFactors.competitionDensity
  const season = suburb.locationFactors.seasonalityRisk
  const tourism = suburb.locationFactors.tourismDependency

  return {
    slug: suburb.slug,
    city: 'Sydney',
    citySlug: 'sydney',
    name: suburb.name,
    postcode: 'N/A',
    state: 'NSW',
    verdict: fromEngineVerdict(suburb.verdict),
    overallScore: suburb.compositeScore,
    factors: suburb.locationFactors,
    scores: {
      footTraffic: suburb.cafe,
      demographics: suburb.restaurant,
      rentViability: suburb.retail,
      competitionGap: Math.max(30, 100 - comp * 7),
      accessibility: tourism >= 7 ? 82 : demand >= 8 ? 78 : 70,
    },
    tagline: `${suburb.name}, Sydney — engine-derived suburb viability profile`,
    summary: suburb.why.join(' '),
    metaTitle: `${suburb.name}, Sydney Business Analysis — ${suburb.compositeScore}/100 ${suburb.verdict} | Locatalyze`,
    metaDescription: `${suburb.name} scored ${suburb.compositeScore}/100 using a five-factor weighted Sydney model (demand, rent, competition, seasonality, tourism).`,
    rentRanges: [
      { label: 'Prime strip', range: 'Varies by micro-location', note: `Rent pressure ${rent}/10 for top-exposure positions.` },
      { label: 'Secondary streets', range: 'Varies by frontage and fitout', note: 'Usually better value if destination demand is strong.' },
      { label: 'Local pockets', range: 'Indicative only', note: 'Validate current quoting with live listings and agent comps.' },
    ],
    medianIncome: 'Sydney profile varies by SA2',
    population: 'Refer to suburb-specific census and daytime movement data',
    targetCustomer: 'Local residents plus commuter/visitor overlay depending on strip position',
    competitionLevel: comp >= 8 ? 'Very High' : comp >= 6 ? 'High' : comp >= 4 ? 'Medium' : 'Low',
    sections: [
      { heading: 'Demand and Movement', body: `Demand strength is ${demand}/10. ${suburb.why[0] ?? ''}` },
      { heading: 'Rent and Competitive Pressure', body: `Rent pressure is ${rent}/10 and competition density is ${comp}/10. ${suburb.why[1] ?? ''}` },
      { heading: 'Structural Risk and Upside', body: `Seasonality risk is ${season}/10 and tourism dependency is ${tourism}/10. ${suburb.why[2] ?? ''}` },
    ],
    advantages: [
      `Weighted composite score ${suburb.compositeScore}/100 from the shared scoring engine.`,
      `Business-type scores: Cafe ${suburb.cafe}, Restaurant ${suburb.restaurant}, Retail ${suburb.retail}.`,
      `Demand/rent/competition inputs are explicit and auditable at suburb level.`,
    ],
    disadvantages: [
      'Suburb-level factors do not replace site-level due diligence.',
      'Street-by-street tenancy economics can differ materially within one suburb.',
      'Use address-level analysis before final lease decisions.',
    ],
    caseScenario: {
      concept: `Suburb-fit concept in ${suburb.name}`,
      monthlyRent: 6500,
      dailyCoversRequired: 65,
      avgSpend: 24,
      breakEvenTimeline: '4–9 months',
      keyAssumptions: [
        'Model uses the same deterministic five-factor scoring engine as all migrated cities.',
        'Operating format aligns with strongest business-type score.',
        'Final site validates frontage, visibility, and tenancy terms.',
      ],
      verdict: `${suburb.name} currently rates ${suburb.verdict} at ${suburb.compositeScore}/100 in the Sydney engine model.`,
    },
    nearbySuburbs,
    faqs: [
      {
        question: `How is ${suburb.name} scored in the Sydney model?`,
        answer: `${suburb.name} is scored from five factors on a 1–10 scale, then weighted into cafe/restaurant/retail scores and a single composite.`,
      },
      {
        question: `Is ${suburb.name} a high-rent suburb?`,
        answer: `Current model rent pressure is ${rent}/10 for ${suburb.name}; confirm live market asking rents before committing to a tenancy.`,
      },
      {
        question: `What is the main risk in ${suburb.name}?`,
        answer: `Key model risk signals are competition ${comp}/10, seasonality ${season}/10, and tourism dependency ${tourism}/10.`,
      },
    ],
  }
}

function buildPerthEngineSuburbPageData(suburbSlug: string): SuburbPageData | null {
  const suburb = getPerthSuburb(suburbSlug)
  if (!suburb) return null

  const nearbySuburbs: NearbySuburb[] = getPerthSuburbs()
    .filter((s) => s.slug !== suburb.slug)
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 3)
    .map((s) => ({
      name: s.name,
      slug: s.slug,
      score: s.compositeScore,
      verdict: fromEngineVerdict(s.verdict),
    }))

  const demand = suburb.locationFactors.demandStrength
  const rent = suburb.locationFactors.rentPressure
  const comp = suburb.locationFactors.competitionDensity
  const season = suburb.locationFactors.seasonalityRisk
  const tourism = suburb.locationFactors.tourismDependency

  return {
    slug: suburb.slug,
    city: 'Perth',
    citySlug: 'perth',
    name: suburb.name,
    postcode: 'N/A',
    state: 'WA',
    verdict: fromEngineVerdict(suburb.verdict),
    overallScore: suburb.compositeScore,
    factors: suburb.locationFactors,
    scores: {
      footTraffic: suburb.cafe,
      demographics: suburb.restaurant,
      rentViability: suburb.retail,
      competitionGap: Math.max(30, 100 - comp * 7),
      accessibility: tourism >= 7 ? 80 : demand >= 8 ? 76 : 68,
    },
    tagline: `${suburb.name}, Perth — engine-derived suburb viability profile`,
    summary: suburb.why.join(' '),
    metaTitle: `${suburb.name}, Perth Business Analysis — ${suburb.compositeScore}/100 ${suburb.verdict} | Locatalyze`,
    metaDescription: `${suburb.name} scored ${suburb.compositeScore}/100 using a five-factor weighted Perth model (demand, rent, competition, seasonality, tourism).`,
    rentRanges: [
      { label: 'Prime strip', range: 'Varies by micro-location', note: `Rent pressure ${rent}/10 for top-exposure positions.` },
      { label: 'Secondary streets', range: 'Varies by frontage and fitout', note: 'Usually better value if destination demand is strong.' },
      { label: 'Local pockets', range: 'Indicative only', note: 'Validate current quoting with live listings and agent comps.' },
    ],
    medianIncome: 'Perth profile varies by SA2',
    population: 'Refer to suburb-specific census and daytime movement data',
    targetCustomer: 'Local residents plus commuter/visitor overlay depending on strip position',
    competitionLevel: comp >= 8 ? 'Very High' : comp >= 6 ? 'High' : comp >= 4 ? 'Medium' : 'Low',
    sections: [
      { heading: 'Demand and Movement', body: `Demand strength is ${demand}/10. ${suburb.why[0] ?? ''}` },
      { heading: 'Rent and Competitive Pressure', body: `Rent pressure is ${rent}/10 and competition density is ${comp}/10. ${suburb.why[1] ?? ''}` },
      { heading: 'Structural Risk and Upside', body: `Seasonality risk is ${season}/10 and tourism dependency is ${tourism}/10. ${suburb.why[2] ?? ''}` },
    ],
    advantages: [
      `Weighted composite score ${suburb.compositeScore}/100 from the shared scoring engine.`,
      `Business-type scores: Cafe ${suburb.cafe}, Restaurant ${suburb.restaurant}, Retail ${suburb.retail}.`,
      `Demand/rent/competition inputs are explicit and auditable at suburb level.`,
    ],
    disadvantages: [
      'Suburb-level factors do not replace site-level due diligence.',
      'Street-by-street tenancy economics can differ materially within one suburb.',
      'Use address-level analysis before final lease decisions.',
    ],
    caseScenario: {
      concept: `Suburb-fit concept in ${suburb.name}`,
      monthlyRent: 5500,
      dailyCoversRequired: 60,
      avgSpend: 22,
      breakEvenTimeline: '4–9 months',
      keyAssumptions: [
        'Model uses the same deterministic five-factor scoring engine as all migrated cities.',
        'Operating format aligns with strongest business-type score.',
        'Final site validates frontage, visibility, and tenancy terms.',
      ],
      verdict: `${suburb.name} currently rates ${suburb.verdict} at ${suburb.compositeScore}/100 in the Perth engine model.`,
    },
    nearbySuburbs,
    faqs: [
      {
        question: `How is ${suburb.name} scored in the Perth model?`,
        answer: `${suburb.name} is scored from five factors on a 1–10 scale, then weighted into cafe/restaurant/retail scores and a single composite.`,
      },
      {
        question: `Is ${suburb.name} a high-rent suburb?`,
        answer: `Current model rent pressure is ${rent}/10 for ${suburb.name}; confirm live market asking rents before committing to a tenancy.`,
      },
      {
        question: `What is the main risk in ${suburb.name}?`,
        answer: `Key model risk signals are competition ${comp}/10, seasonality ${season}/10, and tourism dependency ${tourism}/10.`,
      },
    ],
  }
}

function buildGeneratedSuburbPageData(citySlug: string, suburbSlug: string): SuburbPageData | null {
  const suburb = SUBURBS.find((s) => s.citySlug === citySlug && s.slug === suburbSlug)
  if (!suburb) return null

  const score = Math.round(
    (suburb.demandScores.cafes +
      suburb.demandScores.restaurants +
      suburb.demandScores.retail +
      suburb.demandScores.gyms) / 4
  )
  const verdict = toVerdict(score)

  const peers = SUBURBS.filter((s) => s.citySlug === citySlug && s.slug !== suburbSlug).slice(0, 3)
  const nearbySuburbs: NearbySuburb[] = peers.map((s) => {
    const peerScore = Math.round(
      (s.demandScores.cafes + s.demandScores.restaurants + s.demandScores.retail + s.demandScores.gyms) / 4
    )
    return { name: s.name, slug: s.slug, score: peerScore, verdict: toVerdict(peerScore) }
  })

  return {
    slug: suburb.slug,
    city: suburb.city,
    citySlug: suburb.citySlug,
    name: suburb.name,
    postcode: 'N/A',
    state: suburb.state,
    verdict,
    overallScore: score,
    scores: {
      footTraffic: suburb.demandScores.cafes,
      demographics: suburb.demandScores.restaurants,
      rentViability: suburb.demandScores.retail,
      competitionGap: Math.max(45, 100 - suburb.demandScores.gyms + 10),
      accessibility: suburb.footTraffic === 'Very High' ? 90 : suburb.footTraffic === 'High' ? 80 : 68,
    },
    tagline: `${suburb.name}, ${suburb.city} — practical location viability snapshot`,
    summary: `${suburb.description} ${suburb.keyInsight}`,
    metaTitle: `${suburb.name} Business Analysis: Score ${score}, ${verdict} Verdict | Locatalyze`,
    metaDescription: `Suburb-level feasibility read for ${suburb.name}, ${suburb.city}: demand, rent context, competition signals, and practical go/no-go guidance.`,
    rentRanges: [
      { label: suburb.topStreets[0] ?? 'Prime strip', range: suburb.rentRange, note: 'Primary visibility corridor.' },
      { label: suburb.topStreets[1] ?? 'Secondary strip', range: suburb.rentRange, note: 'Balanced cost and demand profile.' },
      { label: suburb.topStreets[2] ?? 'Local pocket', range: suburb.rentRange, note: 'Lower overhead, demand-dependent.' },
    ],
    medianIncome: suburb.avgIncome,
    population: suburb.population,
    targetCustomer: suburb.demographics,
    competitionLevel: mapCompetitionLevel(suburb.footTraffic),
    sections: [
      { heading: 'Market Fundamentals', body: `${suburb.vibe}. ${suburb.keyInsight}` },
      { heading: 'Rent and Street Context', body: `Typical asking rent range is ${suburb.rentRange}. Core demand streets include ${suburb.topStreets.join(', ')}.` },
      { heading: 'Who wins here', body: `Best-fit formats in ${suburb.name}: ${suburb.bestFor.join(', ')}. Higher-risk formats: ${suburb.notBestFor.join(', ')}.` },
    ],
    advantages: [
      `Demand profile supports ${suburb.bestFor.slice(0, 2).join(' and ')} concepts.`,
      `Anchor drivers include ${suburb.nearbyAnchors.slice(0, 2).join(' and ')}.`,
      `City-level access context: ${suburb.footTraffic} movement intensity.`,
    ],
    disadvantages: [
      `Formats that commonly struggle here: ${suburb.notBestFor.join(', ')}.`,
      `Parking ease is ${suburb.parkingEase.toLowerCase()}, which can cap destination trade.`,
      'Site-level execution still determines outcomes; use address-level analysis before lease signature.',
    ],
    caseScenario: {
      concept: `Local-service concept optimized for ${suburb.name}`,
      monthlyRent: 5000,
      dailyCoversRequired: 70,
      avgSpend: 22,
      breakEvenTimeline: '4–8 months',
      keyAssumptions: [
        'Rent inside stated suburb range',
        'Offer aligned with local demand profile',
        'Conservative staffing plan in first quarter',
      ],
      verdict: `${suburb.name} is a ${verdict} on suburb-level signals. Validate the exact address before committing.`,
    },
    nearbySuburbs,
    faqs: [
      {
        question: `Is ${suburb.name} good for opening a business?`,
        answer: `${suburb.name} currently scores ${score}/100 with a ${verdict} verdict on suburb-level demand and rent signals.`,
      },
      {
        question: `What rent range should I expect in ${suburb.name}?`,
        answer: `Most visible positions sit around ${suburb.rentRange}, depending on frontage and fit-out condition.`,
      },
      {
        question: `What business types suit ${suburb.name} best?`,
        answer: `Higher-fit categories are ${suburb.bestFor.join(', ')} based on local demand and movement patterns.`,
      },
    ],
  }
}

export function getSuburbPageData(citySlug: string, suburbSlug: string): SuburbPageData | null {
  const key = `${citySlug}/${suburbSlug}`
  if (SUBURB_PAGE_DATA[key]) return SUBURB_PAGE_DATA[key]
  if (GENERATED_SUBURB_CACHE[key]) return GENERATED_SUBURB_CACHE[key]
  if (citySlug === 'sydney') {
    const sydneyBuilt = buildSydneyEngineSuburbPageData(suburbSlug)
    if (sydneyBuilt) {
      GENERATED_SUBURB_CACHE[key] = sydneyBuilt
      return sydneyBuilt
    }
  }
  if (citySlug === 'perth') {
    const perthBuilt = buildPerthEngineSuburbPageData(suburbSlug)
    if (perthBuilt) {
      GENERATED_SUBURB_CACHE[key] = perthBuilt
      return perthBuilt
    }
  }
  const built = buildGeneratedSuburbPageData(citySlug, suburbSlug)
  if (built) GENERATED_SUBURB_CACHE[key] = built
  return built
}

export function getAllSuburbKeys(): { citySlug: string; suburbSlug: string }[] {
  const keys = new Set<string>(Object.keys(SUBURB_PAGE_DATA))
  for (const suburb of SUBURBS) {
    keys.add(`${suburb.citySlug}/${suburb.slug}`)
  }
  for (const suburb of getSydneySuburbs()) {
    keys.add(`sydney/${suburb.slug}`)
  }
  for (const suburb of getPerthSuburbs()) {
    // Dedicated Perth pages exist for these slugs. Excluding them here avoids
    // dynamic-route static path collisions on hosted builds.
    if (suburb.slug === 'mount-lawley' || suburb.slug === 'perth-cbd') continue
    keys.add(`perth/${suburb.slug}`)
  }
  return Array.from(keys)
    .map((key) => {
      const [citySlug, suburbSlug] = key.split('/')
      return { citySlug, suburbSlug }
    })
    .filter(({ citySlug, suburbSlug }) => !isStaticIndustryHub(citySlug, suburbSlug))
}
