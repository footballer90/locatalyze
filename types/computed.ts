/**
 * types/computed.ts
 *
 * The CONTRACT between computeEngine() and the UI.
 * This is the ONLY shape the UI is allowed to read from.
 * Once written to computed_result in Supabase it is immutable.
 *
 * Rule: NO arithmetic is permitted in any file that imports this type.
 *       All values arrive pre-computed and sealed.
 */

export const ENGINE_VERSION    = '3.1.0' as const   // bumped: multi-source live density
export const BENCHMARK_VERSION = '2026-04' as const

// ── Confidence ────────────────────────────────────────────────────────────────

export type ConfidenceLabel = 'high' | 'medium' | 'low' | 'benchmark_default'

/** 0–1 weight on agent value (1 = full agent, 0 = full benchmark) */
export type BlendWeight = number

// ── Verdict ───────────────────────────────────────────────────────────────────

export type VerdictValue = 'GO' | 'CAUTION' | 'NO'

// ── Competitor data quality ───────────────────────────────────────────────────

/**
 * Describes how reliable the competitor count is.
 *
 * live_verified  – ≥1 competitor found from a live API source, passed validation
 * partial        – Some data returned but low sample size (< 3 raw results pre-filter)
 * zero_warning   – 0 competitors found; radius was searched but result is unconfirmed
 *                  (genuine blue ocean OR data failure — cannot tell from this data alone)
 * no_data        – A1 returned no competitor array at all (agent failed or skipped)
 */
export type CompetitorDataQuality =
  | 'live_verified'
  | 'partial'
  | 'zero_warning'
  | 'no_data'

// ── Sub-shapes ────────────────────────────────────────────────────────────────

export interface RevenueChannel {
  channel: string   // e.g. "Memberships", "Personal Training", "Retail"
  pct:     number   // 0–100
  monthly: number   // AUD
}

export interface ScenarioRow {
  assumption:       string
  monthly_revenue:  number
  monthly_costs:    number
  monthly_profit:   number
  customers_needed: number
}

export interface Projection {
  year1: number
  year2: number
  year3: number
}

export interface ValidatedCompetitor {
  name:         string
  rating:       number | null
  type:         'direct' | 'indirect'
  distance?:    number   // metres
  address?:     string
  // A1 v4 threat-scoring fields (present when A1 v4 workflow is active)
  threatScore?: number              // 0–100 composite threat score
  threatLabel?: 'strong' | 'moderate' | 'weak'
  rank?:        number              // 1 = strongest threat
}

// ── Compute audit log (stored alongside result for debugging) ─────────────────

export interface RejectedValue {
  field:      string
  agentValue: number
  reason:     string
}

export interface ComputeLog {
  // Sources
  revenueSource: 'a5_live' | 'a5_blended' | 'a4_fallback' | 'benchmark_default'
  costsSource:   'a4_live' | 'a4_blended' | 'benchmark_default'

  // Raw agent values (before blending/rejection)
  agentRevenueRaw:  number | null
  agentCostsRaw:    number | null

  // Benchmark reference values used
  benchmarkRevenue: number
  benchmarkCosts:   number

  // Difference between agent and benchmark (as fraction, e.g. 0.35 = 35%)
  revenueDiffPct: number | null
  costsDiffPct:   number | null

  // Blend weights (1.0 = 100% agent, 0.0 = 100% benchmark)
  revenueBlendWeight: BlendWeight
  costsBlendWeight:   BlendWeight

  // Values that were rejected entirely
  rejectedValues: RejectedValue[]

  // Competitor search metadata (for debugging data quality issues)
  rawCompetitorCount:      number    // how many A1 gave us before filtering
  validatedCompetitorCount: number   // after isValidCompetitor filter
  competitorDataQuality:   CompetitorDataQuality

  // Timing and versioning
  computeTimeMs:    number
  engineVersion:    string
  benchmarkVersion: string
  computedAt:       string   // ISO-8601
}

// ── The sealed result written to computed_result in Supabase ──────────────────

export interface ComputedResult {
  // ─── Core financials (all calculated by computeEngine, NEVER copied from agents) ───
  revenue:        number    // monthly AUD
  totalCosts:     number    // monthly AUD
  netProfit:      number    // INVARIANT: always === revenue - totalCosts
  grossMarginPct: number    // 0–100

  // ─── Cost breakdown ───────────────────────────────────────────────────────
  costBreakdown: {
    rent:  number
    staff: number
    cogs:  number
    other: number
  }

  // ─── Revenue channels (always correct for this business type) ────────────
  revenueChannels: RevenueChannel[]

  // ─── Customers ───────────────────────────────────────────────────────────
  dailyCustomers: number
  avgTicketSize:  number

  // ─── Break-even ──────────────────────────────────────────────────────────
  breakEvenDaily:  number        // customers/day to cover all costs
  breakEvenMonths: number | null // months to recoup setupBudget (null if netProfit ≤ 0)

  // ─── Scenarios ───────────────────────────────────────────────────────────
  scenarios: {
    worst: ScenarioRow
    base:  ScenarioRow
    best:  ScenarioRow
  }

  // ─── 3-year projection ───────────────────────────────────────────────────
  projection: Projection

  // ─── Scores (0–100, all computed from validated data) ────────────────────
  scores: {
    overall:       number
    rent:          number
    competition:   number
    demand:        number
    profitability: number
    location:      number
    saturation:    number   // 0=no saturation, 100=fully saturated (lower is better for entry)
    viability:     number   // 0–100 composite: opportunity + demand + location (higher is better)
  }

  // ─── Verdict ─────────────────────────────────────────────────────────────
  verdict:              VerdictValue
  verdictReasons:       string[]   // 3–5 specific bullets (not generic AI filler)
  verdictConditions:    string[]   // "This works ONLY IF: ..."
  verdictFailureModes:  string[]   // "This will fail if: ..."

  // ─── Competition (validated & filtered by isValidCompetitor) ─────────────
  competitors:             ValidatedCompetitor[]
  validCompetitorCount:    number
  competitorRadius:        number                // metres used for search/display
  competitorDataQuality:   CompetitorDataQuality // reliability of the competitor count

  // ─── Location signals (from A2) ──────────────────────────────────────────
  locationSignals: {
    medianRent:      number | null
    footfallSignal:  string | null
    transitSignal:   string | null
    roadType:        string | null
    nearbyAnchors:   string[]
  }

  // ─── Market signals (from A3) ────────────────────────────────────────────
  marketSignals: {
    demandScore:     number | null   // 0–100
    demandTrend:     string | null   // 'growing' | 'stable' | 'declining'
    saturationLabel: string | null   // 'low' | 'moderate' | 'high'
  }

  // ─── Market intelligence (new in v3.0) ───────────────────────────────────
  marketIntelligence: {
    saturationScore:   number          // 0–100 weighted by threat severity (lower = easier entry)
    saturationBand:    'low' | 'moderate' | 'high' | 'very_high' | 'unknown'
    opportunityScore:  number          // 0–100 (higher = more room in market)
    viabilityScore:    number          // 0–100 composite location viability
    opportunityLevel:  'high' | 'medium' | 'low' | 'unknown'
    topThreats:        ValidatedCompetitor[]   // top 3 ranked by threat
    marketGapNote:     string | null   // specific gap detected, or null
    strongCount:       number
    moderateCount:     number
    weakCount:         number
  }

  // ─── Live competitor pressure (from multi-source density fetch) ──────────
  // Present only when lat/lng were available and live API calls succeeded.
  competitorPressure: {
    density:              'low' | 'medium' | 'high' | 'unknown'
    rawCount500m:         number
    rawCount1km:          number
    weightedCount500m:    number   // authoritative count used for scoring
    weightedCount1km:     number
    avgConfidence:        number   // 0–1; data quality indicator
    pressureFactor:       number   // 0.75–1.00 revenue multiplier applied
    revenueAdjusted:      boolean  // true when pressureFactor < 1.0
    adjustedDemandScore:  number | null   // blended A3 + density demand signal
    sources:              string[]
  }

  // ─── Confidence ──────────────────────────────────────────────────────────
  dataCompleteness: number         // 0–100, how much live data was available
  modelConfidence:  ConfidenceLabel

  // ─── Metadata ────────────────────────────────────────────────────────────
  meta: {
    engineVersion:    string
    benchmarkVersion: string
    computedAt:       string   // ISO-8601
    computeLog:       ComputeLog
  }
}

// ── Input type for computeEngine() ───────────────────────────────────────────

export interface ComputeInput {
  // User-provided (ground truth — never override these with agent values)
  reportId:     string
  businessType: string
  monthlyRent:  number
  setupBudget:  number
  avgTicketSize: number
  area:         string   // suburb
  city:         string
  state:        string

  // Raw n8n agent outputs (treated as SUGGESTIONS, not truth)
  agentOutputs: {
    a1?: Record<string, any>
    a2?: Record<string, any>
    a3?: Record<string, any>
    a4?: Record<string, any>
    a5?: Record<string, any>
    a6?: Record<string, any>
    a7?: Record<string, any>
    a8?: Record<string, any>
  }

  /**
   * Live competitor density from multi-source API fetch (Google Places + Geoapify).
   * Injected by /api/compute when lat/lng are available in input_data.
   * After DBSCAN clustering + confidence weighting — not a raw headcount.
   *
   * When present:
   *   - competition score uses weightedCount1km instead of A1 count
   *   - revenue is multiplied by pressureFactor
   *   - demand signal is blended with density-derived demand signal
   */
  liveCompetitorDensity?: {
    rawCount500m:       number
    rawCount1km:        number
    rawCount2km:        number
    weightedCount500m:  number   // Σ(confidence) of cluster reps within 500m
    weightedCount1km:   number   // Σ(confidence) of cluster reps within 1km
    avgConfidence:      number   // 0–1; 1.0 = all Google, 0.6 = all OSM
    density:            'low' | 'medium' | 'high'
    pressureFactor:     number   // 0.75–1.00
    sources:            string[]
  }
}
