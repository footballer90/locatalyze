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

export const ENGINE_VERSION    = '3.5.0' as const   // bumped: normalized benchmarkContext for A7/A8 storytelling
export const BENCHMARK_VERSION = '2026-04' as const

// ── Confidence ────────────────────────────────────────────────────────────────

export type ConfidenceLabel = 'high' | 'medium' | 'low' | 'benchmark_default'

// ── Trust layer types (v3.2) ──────────────────────────────────────────────────

/**
 * Contradiction detected between two data points in the report.
 * Severity 'error' means it's significant enough to override a verdict.
 * Severity 'warning' means it's a red flag the user should know about.
 */
export interface ContradictionWarning {
  field:            string                    // e.g. 'saturation_vs_competitors'
  reason:           string                    // human-readable explanation
  severity:         'warning' | 'error'
  affectedSections: string[]                  // which report tabs this affects
}

/**
 * Explains where a single metric value came from and how much to trust it.
 * Attached to every key output metric so the UI can show provenance badges.
 */
export interface DataProvenance {
  source:      string     // e.g. 'Market analysis (A5 agent)'
  sourceLabel: string     // short label for badge: 'Live Data' | 'Benchmark' | 'Estimated'
  confidence:  number     // 0-100
  isBenchmark: boolean    // true when value comes entirely from AU industry benchmarks
  note?:       string     // optional explanation shown on hover/expand
}

/**
 * Per-section confidence breakdown.
 * Shows users which parts of the report are reliable vs. estimated.
 */
export interface SectionScore {
  score: number                                       // 0-100
  label: 'high' | 'medium' | 'low' | 'insufficient'
  gaps:  string[]                                     // specific missing data items
}

export interface SectionConfidence {
  financials:  SectionScore
  competition: SectionScore
  demand:      SectionScore
  location:    SectionScore
}

/**
 * Honest revenue range with uncertainty bounds.
 * Replaces false-precision single values like "$47,200/month".
 */
export interface RevenueRange {
  low:         number   // lower bound (e.g. -40% from mid for benchmark estimates)
  mid:         number   // central estimate (same as result.revenue)
  high:        number   // upper bound
  p10?:        number   // optional percentile lower bound used by UI chips
  p50?:        number   // optional percentile midpoint used by UI chips
  p90?:        number   // optional percentile upper bound used by UI chips
  uncertainty: number   // ±% (e.g. 30 means ±30%)
  source:      string   // which source produced the mid value
  note:        string   // human-readable explanation
}

/**
 * Normalized benchmark + macro context for UI storytelling.
 * This keeps A7/A8-style intelligence in the sealed compute contract so all
 * surfaces (dashboard/share/compare) can render the same message.
 */
export interface BenchmarkContext {
  benchmarkRentRatio: number | null      // rent as % of revenue (0-100)
  marketSentiment: 'positive' | 'neutral' | 'negative' | 'unknown'
  timingScore: number | null             // 0-100 (higher = better entry window)
  benchmarkNarrative: string             // short, opinionated advisor line
}

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
  channel:     string   // e.g. "Memberships", "Personal Training", "Retail"
  pct:         number   // 0–100
  monthly:     number   // AUD
  isBenchmark: boolean  // true = industry-average split, not from A5 agent data
}

export interface ScenarioRow {
  assumption:       string
  monthly_revenue:  number
  monthly_costs:    number
  monthly_profit:   number
  customers_needed: number
}

export interface Projection {
  year1:      number
  /**
   * null when revenue is benchmark-derived — multi-year projections cannot be
   * reliably extrapolated from industry averages alone. UI must NOT display year2/year3
   * when suppressed is true.
   */
  year2:      number | null
  year3:      number | null
  /** true when year2 and year3 are suppressed due to insufficient data confidence */
  suppressed: boolean
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
    /**
     * null when no A3 market data AND no live competitor density signal is available.
     * In this case the engine used a neutral 55 internally for overall score weighting,
     * but cannot claim to have a real demand score. UI must show "No data" not "55".
     */
    demand:        number | null
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
    competitionSentence?: string | null
    localSummary?: string | null
  }

  // ─── Live competitor pressure (from multi-source density fetch) ──────────
  // Present only when lat/lng were available and live API calls succeeded.
  competitorPressure: {
    density:              'low' | 'medium' | 'high' | 'unknown'
    rawCount500m:         number | null   // null = no live data attempted (not zero competitors)
    rawCount1km:          number | null
    weightedCount500m:    number | null   // authoritative count used for scoring
    weightedCount1km:     number | null
    avgConfidence:        number | null   // 0–1; null = no live data
    pressureFactor:       number   // 0.75–1.00 revenue multiplier applied
    revenueAdjusted:      boolean  // true when pressureFactor < 1.0
    adjustedDemandScore:  number | null   // blended A3 + density demand signal
    sources:              string[]
  }

  // ─── Confidence ──────────────────────────────────────────────────────────
  dataCompleteness: number         // 0–100, how much live data was available
  modelConfidence:  ConfidenceLabel
  confidenceScore?: number
  dataMode?: string | null
  dataQuality?: string | {
    missingFields?: string[]
    completeness?: number
    mode?: string
    [key: string]: any
  }

  // ─── Trust layer (v3.2) — data transparency + contradiction detection ─────
  /**
   * Per-section confidence breakdown.
   * financials / competition / demand / location each have score, label, and gaps[].
   * UI should render these as section-level confidence badges.
   */
  sectionConfidence: SectionConfidence

  /**
   * Per-metric data provenance.
   * Keys: 'revenue' | 'costs' | 'competitors' | 'demandScore' | 'rent' | 'avgTicketSize'
   * Each entry tells the UI: where did this number come from, how much to trust it.
   */
  provenance: Record<string, DataProvenance>

  /**
   * Honest revenue range based on data confidence level.
   * Replaces single-point revenue estimate with ±% uncertainty band.
   * UI should show "~$35k–$55k/month" instead of "$47,200/month".
   */
  revenueRange: RevenueRange

  /**
   * Unified benchmark + market context for "advisor-style" messaging.
   */
  benchmarkContext: BenchmarkContext

  /**
   * Contradictions detected between data points in this report.
   * Empty array = no contradictions (happy path).
   * UI should render error-severity contradictions as prominent warnings.
   */
  contradictions: ContradictionWarning[]

  /**
   * If a hard fail gate was triggered, records which one.
   * null = verdict was not overridden.
   * e.g. 'benchmark_default_confidence' | 'insufficient_data_completeness' | 'declining_demand'
   */
  verdictGateTriggered: string | null
  decisionExplanation?: {
    oneLine?: string | null
    advisorLine?: string | null
    killSwitch?: string | null
    [key: string]: any
  }
  decisionContract?: {
    mustHitFirst30Days?: string[]
    mustNotIgnore?: string[]
    commitNow?: string[]
    [key: string]: any
  }
  validationDifficulty?: any
  modelDependencies?: any
  downside?: any
  breakEvenMonthsRealistic?: number | null

  /**
   * Which pipeline agents returned usable data for this report.
   * false = agent failed, timed out, or returned an empty/error-only response.
   * Used to:
   *   - Block specific outputs when the relevant agent failed (e.g. no demand score without A3)
   *   - Surface "data missing" UI states rather than showing benchmark estimates as real data
   *   - Drive the "Missing A2 → no customer estimates" and "Missing A3 → no demand score" rules
   */
  agentCoverage: {
    a1: boolean   // Competitor intelligence — drives competitor count, threat scores
    a2: boolean   // Location & Rent — drives footfall, transit, median rent signals
    a3: boolean   // Market Demand — drives demand score, trend, saturation label
    a4: boolean   // Cost Projection — drives cost estimates
    a5: boolean   // Revenue & Scenarios — drives revenue estimate (most critical)
  }

  // ─── Metadata ────────────────────────────────────────────────────────────
  meta: {
    engineVersion:    string
    benchmarkVersion: string
    computedAt:       string   // ISO-8601
    computeLog:       ComputeLog
  }
  [key: string]: any
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

  /**
   * Optional accuracy-improving inputs from the onboarding form.
   * When provided, these override benchmark defaults in the engine.
   */
  operatingHours?:  string | null   // e.g. 'all_day' | 'breakfast_lunch' | 'lunch_dinner' | 'dinner_evening'
  seatingCapacity?: number | null   // for food: covers; for retail: sqm — used to cap daily customers
  businessMode?:    string | null   // 'new_startup' | 'relocating' | 'buying_existing'
  avgOrderValue?:   number | null   // user's own avg ticket override — replaces benchmark if provided
  locationAccess?:  string | null   // 'street_frontage' | 'transport_hub' | 'shopping_centre' | 'side_street' | 'arcade'

  /**
   * True when setupBudget was filled from a benchmark estimate (staffCosts × 8)
   * rather than user-provided. When true, breakEvenMonths is suppressed (set to null)
   * because an estimated setup cost produces a meaningless payback period.
   */
  setupBudgetIsEstimated?: boolean

  /**
   * True when avgTicketSize was filled from a benchmark estimate rather than user-provided.
   * Used by buildSectionConfidence to apply a financial confidence penalty.
   */
  avgTicketSizeIsEstimated?: boolean

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
