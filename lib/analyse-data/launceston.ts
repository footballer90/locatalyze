/**
 * lib/analyse-data/launceston.ts
 * Engine-computed suburb data for Launceston, TAS.
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

export interface LauncestonSuburbSeed {
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

export interface LauncestonSuburb extends LauncestonSuburbSeed {
  locationFactors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

function toLocationFactors(f: LauncestonSuburbSeed['factors']): LocationFactors {
  return {
    demandStrength: f.demand,
    rentPressure: f.rent,
    competitionDensity: f.competition,
    seasonalityRisk: f.seasonality,
    tourismDependency: f.tourism,
  }
}

function buildSuburbs(seeds: LauncestonSuburbSeed[]): LauncestonSuburb[] {
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

// ─── Launceston suburb seeds ──────────────────────────────────────────────────

const LAUNCESTON_SEEDS: LauncestonSuburbSeed[] = [
  {
    name: 'Launceston CBD',
    slug: 'launceston-cbd',
    factors: { demand: 7, rent: 4, competition: 7, seasonality: 4, tourism: 7 },
    why: [
      "Brisbane Street Mall and the surrounding CBD precinct form Tasmania's second retail heart — the City Mall and adjacent laneways concentrate foot traffic from regional shoppers, government workers, and the growing stream of visitors attracted by Tasmania's tourism boom.",
      'Tourism is 7/10 from Cataract Gorge (within 1km of the CBD), QVMAG, and Design Tasmania — Launceston has become a destination in its own right for interstate and international visitors exploring beyond Hobart, adding consistent hospitality demand.',
      'Competition is 7/10 and reflects the concentration of hospitality on the mall and adjacent streets — differentiated concepts find viable positions, but generic café or casual dining formats compete directly against well-established incumbents.',
    ],
  },
  {
    name: 'Inveresk',
    slug: 'inveresk',
    factors: { demand: 7, rent: 3, competition: 4, seasonality: 3, tourism: 6 },
    why: [
      "The Inveresk cultural precinct — home to QVMAG, the Launceston Tramway Museum, and the University of Tasmania arts campus — has created a growing mixed-use environment that attracts both cultural visitors and a creative-professional residential demographic.",
      'Tourism is 6/10: QVMAG draws strong visitor numbers and the Invermay industrial-to-residential conversion is bringing new residents to a precinct that was previously commercial-only — demand is growing ahead of hospitality supply.',
      'Competition is 4/10 and rent is 3/10 — the combination of cultural foot traffic, growing residential density, and below-market rents creates a genuinely compelling early-mover opportunity for hospitality concepts that fit the precinct character.',
    ],
  },
  {
    name: 'West Launceston',
    slug: 'west-launceston',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "West Launceston's inner-residential character supports a loyal local café and casual dining demographic — professional families and established residents provide consistent repeat trade without significant tourist-trade dependency.",
      'Rent is 3/10 and competition is 4/10 — viable economics for operators who build genuine community relationships; the market rewards consistency and quality over destination marketing.',
      'Low seasonality (2/10) reflects the stable residential base — trade is reliable year-round, which suits operators focused on building a neighbourhood institution rather than capturing tourism peaks.',
    ],
  },
  {
    name: 'East Launceston',
    slug: 'east-launceston',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 3 },
    why: [
      "East Launceston's affluent inner-east residential character — including heritage-listed streetscape areas — attracts a professional demographic with above-average hospitality spend, creating demand that consistently exceeds local supply.",
      'Competition is 3/10: notably low for an affluent inner suburb — quality independent operators find loyal repeat customers without the saturation pressure of the CBD strip.',
      'Rent is 3/10 and seasonality is 2/10 — the financial profile is among the most favourable in greater Launceston for specialty coffee and quality-casual dining positioned at the professional demographic.',
    ],
  },
  {
    name: 'South Launceston',
    slug: 'south-launceston',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 2, tourism: 3 },
    why: [
      "Charles Street's southern commercial strip serves a mixed residential and light-commercial catchment — consistent weekday trade from local businesses and weekend café demand from established residential neighbourhoods.",
      'Rent is 3/10 and competition is 4/10 — the entry economics are favourable for value-to-mid positioned operators who calibrate their offer to the local demographic rather than pursuing destination positioning.',
      'Low seasonality (2/10) reflects the residential stability of South Launceston — operators who build local loyalty find the trade consistent across all 52 weeks.',
    ],
  },
  {
    name: 'Newnham',
    slug: 'newnham',
    factors: { demand: 6, rent: 3, competition: 4, seasonality: 3, tourism: 3 },
    why: [
      "The University of Tasmania Newnham campus generates consistent semester-time demand from 10,000+ students and staff — cafés, casual dining, and affordable food concepts find a reliable daytime trade base that supplements the surrounding residential catchment.",
      'Seasonality is 3/10: semester breaks create moderate trade dips that operators should model — the university calendar is predictable, which allows operators to plan staffing and procurement around the quieter periods.',
      'Rent is 3/10 and competition is 4/10 — UTAS proximity at below-average rents creates viable entry conditions for operators who correctly calibrate price and product to the student-and-staff demographic.',
    ],
  },
  {
    name: 'Prospect Vale',
    slug: 'prospect-vale',
    factors: { demand: 6, rent: 3, competition: 3, seasonality: 2, tourism: 2 },
    why: [
      "Prospect Vale's western growth corridor anchored by Southgate Shopping Centre provides reliable retail and hospitality foot traffic — growing residential development is increasing the catchment density in a suburb where hospitality supply has not kept pace.",
      'Competition is 3/10: first-mover operators can establish community loyalty before the suburb reaches commercial maturity — the 2026 window is still open for operators willing to build a local customer base.',
      'Rent is 3/10 with low seasonality (2/10) — the financial profile is favourable for operators targeting the growing western residential demographic at accessible price points.',
    ],
  },
  {
    name: 'Hadspen',
    slug: 'hadspen',
    factors: { demand: 5, rent: 2, competition: 2, seasonality: 2, tourism: 3 },
    why: [
      "Hadspen's position as the Meander Valley gateway gives it a rural-lifestyle demographic distinct from suburban Launceston — residents are community-oriented and support local businesses at rates that exceed the headline population size.",
      'Rent is 2/10 and competition is 2/10 — the lowest entry costs in the greater Launceston market, creating viable conditions for operators who correctly calibrate to the local catchment size and spending capacity.',
      'Tourism is 3/10 from Meander Valley heritage tourism and the route to Deloraine and the Great Western Tiers — weekends generate modest visitor uplift for well-positioned community-facing concepts.',
    ],
  },
  {
    name: 'Evandale',
    slug: 'evandale',
    factors: { demand: 5, rent: 3, competition: 2, seasonality: 3, tourism: 5 },
    why: [
      "Evandale's National Trust heritage village character south of Launceston makes it one of Tasmania's most distinctive tourism assets — the village streets, colonial architecture, and National Penny Farthing Championships (February) draw visitors who actively seek authentic food and hospitality experiences.",
      'Tourism is 5/10 — above average for regional Tasmania — driven by the heritage village character, access to Clarendon homestead, and the broader Tamar Valley wine tourism circuit that routes visitors through Evandale.',
      'Competition is 2/10: very few quality independent operators, creating a clear gap for concept-driven hospitality that fits the heritage character — but operators must plan for the seasonal tourism pattern, as visitor trade peaks from October to April.',
    ],
  },
]

const _LAUNCESTON_BUILT = buildSuburbs(LAUNCESTON_SEEDS)

// ─── Public API ───────────────────────────────────────────────────────────────

export function getLauncestonSuburbs(): LauncestonSuburb[] {
  return _LAUNCESTON_BUILT
}

export function getLauncestonSuburb(nameOrSlug: string): LauncestonSuburb | undefined {
  const key = nameOrSlug.toLowerCase().trim()
  return _LAUNCESTON_BUILT.find(
    (s) => s.name.toLowerCase() === key || s.slug === key,
  )
}

export function getLauncestonSuburbSlugs(): string[] {
  return _LAUNCESTON_BUILT.map((s) => s.slug)
}

export function getLauncestonNearbySuburbs(currentSlug: string, limit = 3): LauncestonSuburb[] {
  const sorted = [..._LAUNCESTON_BUILT].sort((a, b) => b.compositeScore - a.compositeScore)
  return sorted.filter((s) => s.slug !== currentSlug).slice(0, limit)
}
