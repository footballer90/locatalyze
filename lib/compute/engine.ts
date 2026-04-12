/**
 * lib/compute/engine.ts
 *
 * THE single source of truth for all financial and scoring calculations.
 *
 * NON-NEGOTIABLE RULES:
 * 1. computeEngine() is the ONLY function that produces a ComputedResult.
 * 2. netProfit is ALWAYS computed here as revenue - totalCosts. Never from agents.
 * 3. A4/A5 outputs are SUGGESTIONS — they are validated against benchmarks
 *    using a 3-tier blending model before use.
 * 4. No value from any agent bypasses the plausibility check.
 * 5. This function is pure and deterministic: same inputs → same outputs.
 * 6. It has no side effects (no DB writes, no HTTP calls).
 *
 * Blending model:
 *   diff = |agentValue - benchmarkValue| / benchmarkValue
 *   diff < 0.25   → use agent value (trust it)
 *   0.25–0.60     → weighted blend, shifting toward benchmark as diff grows
 *   diff ≥ 0.60   → ignore agent, use benchmark only
 */

import { ENGINE_VERSION, BENCHMARK_VERSION }  from '@/types/computed'
import type {
  ComputedResult, ComputeInput, VerdictValue,
  ScenarioRow, RevenueChannel, ValidatedCompetitor,
  ConfidenceLabel, CompetitorDataQuality, Projection,
} from '@/types/computed'
import {
  BIZ_BENCHMARKS, resolveBizKey, isValidCompetitor,
} from './benchmarks'
import { ComputeLogger, logComputeSummary } from './logger'
import {
  detectContradictions,
  applyHardFailGates,
  buildSectionConfidence,
  buildProvenance,
  buildRevenueRange,
} from './validation'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse any money string or number to a clean float, or null */
function parseMoney(v: unknown): number | null {
  if (v == null) return null
  if (typeof v === 'number') return isFinite(v) ? v : null
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? null : n
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function round(n: number): number {
  return Math.round(n)
}

/**
 * Three-tier blend:
 *   diff < LOW_THRESHOLD        → full agent
 *   LOW_THRESHOLD ≤ diff < HIGH → weighted blend
 *   diff ≥ HIGH_THRESHOLD       → full benchmark
 *
 * Returns { value, weight, diffPct, source }
 */
const LOW_THRESHOLD  = 0.25   // 25% — start blending above this
const HIGH_THRESHOLD = 0.60   // 60% — ignore agent above this

function blend(
  agentRaw:  number | null,
  benchmark: number,
  fieldName: string,
  logger:    ComputeLogger,
): {
  value:   number
  weight:  number   // 1 = full agent, 0 = full benchmark
  diffPct: number | null
  source:  'agent' | 'blended' | 'benchmark'
} {
  if (agentRaw == null || !isFinite(agentRaw) || agentRaw <= 0) {
    return { value: benchmark, weight: 0, diffPct: null, source: 'benchmark' }
  }

  const diff = Math.abs(agentRaw - benchmark) / benchmark

  if (diff < LOW_THRESHOLD) {
    // Trust agent
    return { value: agentRaw, weight: 1, diffPct: diff, source: 'agent' }
  }

  if (diff >= HIGH_THRESHOLD) {
    // Reject agent
    logger.rejectValue(fieldName, agentRaw, `diff ${(diff * 100).toFixed(0)}% exceeds 60% threshold vs benchmark ${benchmark}`)
    return { value: benchmark, weight: 0, diffPct: diff, source: 'benchmark' }
  }

  // Blend zone: weight slides from 1→0 as diff goes from 25%→60%
  const blendRatio = (diff - LOW_THRESHOLD) / (HIGH_THRESHOLD - LOW_THRESHOLD)
  const weight = 1 - blendRatio
  const value  = round(agentRaw * weight + benchmark * (1 - weight))
  return { value, weight, diffPct: diff, source: 'blended' }
}

// ── Scoring helpers ───────────────────────────────────────────────────────────

function scoreRent(monthlyRent: number, revenue: number): number {
  if (revenue <= 0) return 20
  const rentPct = monthlyRent / revenue
  if (rentPct < 0.08) return 95
  if (rentPct < 0.12) return 85
  if (rentPct < 0.18) return 70
  if (rentPct < 0.25) return 50
  if (rentPct < 0.35) return 30
  return 10
}

/**
 * Score competition.
 *
 * HARD RULE: 0 competitors is only treated as "blue ocean" (score 90) when
 * the data quality is confirmed `live_verified` (meaning A1 actually searched
 * and found nothing). If the data quality is `zero_warning`, `partial`, or
 * `no_data`, we return a neutral 50 — we cannot claim it's a blue ocean
 * when we don't know whether the search worked correctly.
 */
function scoreCompetition(validCount: number, dq: CompetitorDataQuality): number {
  if (validCount === 0) {
    // Only reward as blue ocean if data source is confirmed reliable
    return dq === 'live_verified' ? 85 : 50
  }
  if (validCount <= 2)  return 80
  if (validCount <= 5)  return 65
  if (validCount <= 10) return 45
  if (validCount <= 20) return 25
  return 10
}

function scoreDemand(demandScore: number | null): number {
  if (demandScore != null) return clamp(demandScore, 0, 100)
  return 55   // neutral default when A3 is unavailable
}

function scoreProfitability(netProfit: number): number {
  if (netProfit > 15000) return 95
  if (netProfit > 8000)  return 85
  if (netProfit > 3000)  return 70
  if (netProfit > 1000)  return 55
  if (netProfit > 0)     return 40
  if (netProfit > -5000) return 25
  return 10
}

function scoreLocation(locationSignals: ComputedResult['locationSignals']): number {
  let score = 50
  const footfall = (locationSignals.footfallSignal ?? '').toLowerCase()
  const transit  = (locationSignals.transitSignal  ?? '').toLowerCase()
  if (footfall.includes('high'))   score += 20
  if (footfall.includes('medium')) score += 10
  if (footfall.includes('low'))    score -= 10
  if (transit.includes('excellent') || transit.includes('strong')) score += 15
  if (transit.includes('good'))   score += 8
  if (transit.includes('poor'))   score -= 8
  if (locationSignals.nearbyAnchors.length >= 3) score += 10
  return clamp(score, 0, 100)
}

// ── Market intelligence scoring ───────────────────────────────────────────────

/**
 * Market Saturation Score (0–100).
 * Weighted by threat severity — a market with 2 strong operators is far
 * more saturated than one with 10 weak ones.
 *   strong   × 25 pts  (rating ≥ 4.0, review count ≥ 100, close proximity)
 *   moderate × 12 pts
 *   weak     ×  4 pts
 * Capped at 100.
 */
function scoreSaturation(
  strongCount:   number,
  moderateCount: number,
  weakCount:     number,
): number {
  return clamp(round(strongCount * 25 + moderateCount * 12 + weakCount * 4), 0, 100)
}

/**
 * Market Opportunity Score (0–100).
 * Inverse of saturation, adjusted for demand trend and footfall.
 * Higher = more room in the market for a new entrant.
 */
function scoreOpportunity(
  saturationScore: number,
  demandScore:     number | null,
  demandTrend:     string | null,
  footfallSignal:  string | null,
): number {
  let score = 100 - saturationScore   // base: inverse of saturation

  const trend    = (demandTrend    ?? '').toLowerCase()
  const footfall = (footfallSignal ?? '').toLowerCase()

  if (trend === 'growing')    score += 12
  else if (trend === 'stable') score += 4
  else if (trend === 'declining') score -= 15

  if (footfall.includes('high'))   score += 8
  else if (footfall.includes('low')) score -= 10

  // Demand score adjustment relative to neutral 50
  if (demandScore != null) score += round((demandScore - 50) * 0.15)

  return clamp(round(score), 0, 100)
}

/**
 * Location Viability Score (0–100).
 * Composite: opportunity (40%) + demand attractiveness (35%) + location signals (25%).
 * This is the primary "should you open here?" signal.
 */
function scoreViability(
  opportunityScore: number,
  demandScore:      number | null,
  demandTrend:      string | null,
  locationScore:    number,
): number {
  const trend = (demandTrend ?? '').toLowerCase()
  let demandAttractiveness = demandScore != null
    ? clamp(round((demandScore / 10) * 60
        + (trend === 'growing'   ?  20 : 0)
        + (trend === 'declining' ? -15 : 0)),
        0, 100)
    : 50   // neutral when A3 is unavailable

  return clamp(round(
    opportunityScore    * 0.40 +
    demandAttractiveness * 0.35 +
    locationScore        * 0.25,
  ), 0, 100)
}

/**
 * Derive saturation band label from score.
 */
function saturationBand(
  score:      number,
  totalCount: number,
): ComputedResult['marketIntelligence']['saturationBand'] {
  if (score >= 75) return 'very_high'
  if (score >= 50) return 'high'
  if (score >= 25) return 'moderate'
  if (totalCount === 0) return 'unknown'
  return 'low'
}

/**
 * Detect a specific market gap, if any.
 * Returns a plain-English note or null.
 */
function detectMarketGap(
  bizKey:      string,
  strongCount: number,
  totalCount:  number,
  radiusM:     number,
  area:        string,
): string | null {
  if (totalCount === 0) {
    return `No ${bizKey} operators detected within ${radiusM}m of ${area} — verify locally before treating as blue ocean`
  }
  if (strongCount === 0 && totalCount > 0) {
    return `No dominant operator in market — ${totalCount} competitor(s) found but none are strongly established`
  }
  if (strongCount === 1 && totalCount === 1) {
    return `One strong operator holds the market — premium or niche positioning could carve a distinct segment`
  }
  return null
}

// ── Verdict engine ────────────────────────────────────────────────────────────

function deriveVerdict(
  scores:           ComputedResult['scores'],
  netProfit:        number,
  validCompCount:   number,
  monthlyRent:      number,
  revenue:          number,
  compDataQuality:  CompetitorDataQuality,
  viabilityScore:   number,
  opportunityLevel: string,
  strongCount:      number,
  dailyCustomers:   number,
  breakEvenDaily:   number,
): {
  verdict:             VerdictValue
  verdictReasons:      string[]
  verdictConditions:   string[]
  verdictFailureModes: string[]
} {
  const rentPct = revenue > 0 ? (monthlyRent / revenue) : 1

  // ── Hard NO: projected customers far below break-even with negative profit ─
  // When projected daily customers are <70% of break-even AND the business is
  // already running at a loss, there is no plausible path to viability without
  // a structural change to revenue or cost. This is a harder signal than raw
  // netProfit alone because it captures the SCALE of the gap.
  const customerCoverageRatio = breakEvenDaily > 0 ? dailyCustomers / breakEvenDaily : 1
  if (customerCoverageRatio < 0.70 && netProfit < 0) {
    const customerDeficit = Math.max(0, breakEvenDaily - dailyCustomers)
    const gapPct = Math.round((1 - customerCoverageRatio) * 100)
    return {
      verdict: 'NO',
      verdictReasons: [
        `Projected ${dailyCustomers} customers/day is ${gapPct}% below the ${breakEvenDaily}/day break-even — this gap cannot close without a fundamental change to revenue or cost structure`,
        netProfit < -20000
          ? `Monthly losses of ${fmt(Math.abs(netProfit))} confirm this location is structurally non-viable at current rent and costs`
          : `Negative net profit with projected volume ${gapPct}% below break-even means the business cannot self-fund toward viability`,
        `Requires ${customerDeficit} additional customers per day — a ${gapPct}% volume increase — before this location becomes sustainable`,
      ],
      verdictConditions: [
        `Reduce monthly costs by at least ${fmt(Math.round(Math.abs(netProfit) * 1.1))} OR demonstrate a credible path to ${breakEvenDaily}+ daily customers before reconsidering`,
        `Renegotiate rent below ${fmt(Math.round(revenue * 0.15))}/month to create meaningful margin of safety`,
      ],
      verdictFailureModes: [
        `At current trajectory, will exhaust a typical setup budget within 6–9 months — well before reaching sustainable volume`,
        `Requires ${gapPct}% more volume than projected — this is not a marginal gap that marketing alone can close`,
      ],
    }
  }

  // ── Hard NO triggers ──────────────────────────────────────────────────────
  // Severe financial loss or extreme rent burden
  if (netProfit < -20000 || rentPct > 0.45 || (scores.overall < 30 && viabilityScore < 25)) {
    return {
      verdict: 'NO',
      verdictReasons: [
        netProfit < -20000
          ? `Monthly losses of ${fmt(Math.abs(netProfit))} are not recoverable under current cost structure`
          : `Viability score of ${viabilityScore}/100 — competitive and demand conditions do not support entry`,
        rentPct > 0.45
          ? `Rent at ${(rentPct * 100).toFixed(0)}% of projected revenue leaves no margin for error`
          : `Saturation score indicates ${strongCount > 0 ? strongCount + ' strong operator(s) dominating the market' : 'unfavourable market conditions'}`,
        `Profitability score of ${scores.profitability}/100 does not support the required setup investment`,
      ].slice(0, 3),
      verdictConditions:   ['Renegotiate rent below 20% of projected revenue before reconsidering'],
      verdictFailureModes: ['Will not survive the first 12 months at current cost-to-revenue ratio'],
    }
  }

  // ── CAUTION triggers ──────────────────────────────────────────────────────
  // STRICT DATA RELIABILITY: no_data and zero_warning are UNCONDITIONAL CAUTION triggers.
  // A report with unknown competition cannot reach GO regardless of financial score.
  // zero_warning means A1 ran and found nothing — that is unverified, not confirmed.
  const isCaution =
    netProfit <= 0 ||
    scores.rent < 40 ||
    viabilityScore < 45 ||
    opportunityLevel === 'low' ||
    compDataQuality === 'no_data' ||        // no competitor search ran or returned nothing usable
    compDataQuality === 'zero_warning'      // search ran but found zero — cannot confirm as blue ocean

  if (isCaution) {
    const reasons: string[] = []
    if (netProfit <= 0)
      reasons.push(`Projected net position is break-even or negative — margin is too thin for safe entry`)
    if (scores.competition < 35 || opportunityLevel === 'low')
      reasons.push(`${validCompCount} competitors detected (${strongCount} strong) — market is crowded within the search radius`)
    if (scores.rent < 40)
      reasons.push(`Rent at ${(rentPct * 100).toFixed(0)}% of revenue exceeds the 20% sustainable threshold`)
    if (scores.demand != null && scores.demand < 50)
      reasons.push(`Market demand indicators are below average for this suburb and business type`)
    if (viabilityScore < 45)
      reasons.push(`Location viability score of ${viabilityScore}/100 — market conditions are challenging`)
    if (compDataQuality === 'no_data')
      reasons.push(`Competitor intelligence is unavailable — competition level at this address is unknown. Verify on the ground before committing.`)
    if (compDataQuality === 'zero_warning')
      reasons.push(`No competitors were found but the result is unconfirmed — the search may have failed or the area has low coverage. Manual verification required.`)

    return {
      verdict: 'CAUTION',
      verdictReasons:      reasons.slice(0, 5),
      verdictConditions: [
        `Achieves profitability only if daily customers consistently exceed break-even volume`,
        `Requires rent below ${fmt(round(revenue * 0.18))}/month to reach sustainable margins`,
      ],
      verdictFailureModes: [
        `Slow ramp (< 6 months to full capacity) will exhaust the setup budget`,
        `A second strong competitor opening nearby would eliminate projected margin`,
      ],
    }
  }

  // ── GO ────────────────────────────────────────────────────────────────────
  // Note: compCaveat is not needed here — no_data and zero_warning now
  // unconditionally force CAUTION above, so they can never reach this path.
  // Any GO verdict reaching here has confirmed competitor data (live_verified or partial).
  const goReasons: string[] = [
    `Projected net profit of ${fmt(netProfit)}/month supports a strong return on setup investment`,
    opportunityLevel === 'high'
      ? `High opportunity score — market is underserved with ${validCompCount} low-threat competitor(s) within radius`
      : `Location viability score of ${viabilityScore}/100 — competitive landscape has room for a quality operator`,
    `Rent at ${(rentPct * 100).toFixed(0)}% of revenue is within the sustainable 8–20% range`,
    scores.demand != null && scores.demand >= 65
      ? `Demand score of ${scores.demand}/100 indicates active customer intent in this area`
      : `Location score of ${scores.location}/100 — good footfall and access signals`,
  ]

  return {
    verdict: 'GO',
    verdictReasons: goReasons.slice(0, 5),
    verdictConditions: [
      `Maintain revenue above ${fmt(round(revenue * 0.85))}/month to stay profitable`,
      `Staff costs must not exceed ${fmt(round(revenue * 0.30))}/month`,
    ],
    verdictFailureModes: [
      `Revenue dropping more than 25% below projections eliminates all net profit`,
      `Rent increase at lease renewal above ${fmt(round(monthlyRent * 1.25))}/month would flip to loss`,
    ],
  }
}

function fmt(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-AU')
}

// ── Revenue channel generator ─────────────────────────────────────────────────

function buildRevenueChannels(
  bizKey:  string,
  revenue: number,
  a5Raw:   Record<string, any>,
): RevenueChannel[] {
  const bm = BIZ_BENCHMARKS[bizKey] ?? BIZ_BENCHMARKS['other']

  // Try to use A5 channels IF they are business-type-appropriate
  const wrongTypeKws = ['dine-in', 'delivery', 'catering', 'walk-in', 'takeaway', 'dining']
  const a5channels: Array<{channel: string; percentage?: number; monthly_revenue?: number}> =
    Array.isArray(a5Raw?.revenue_channels) ? a5Raw.revenue_channels : []

  const hasWrongType = a5channels.some(ch =>
    wrongTypeKws.some(kw => String(ch.channel ?? '').toLowerCase().includes(kw)),
  )

  if (a5channels.length > 0 && !hasWrongType) {
    // A5 channels are plausible — use them, recalculate monetary values from our revenue
    const totalPct = a5channels.reduce((s, ch) => s + (ch.percentage ?? 0), 0)
    if (totalPct > 0) {
      return a5channels.map(ch => {
        const pct = round((ch.percentage ?? 0) / totalPct * 100)
        return { channel: ch.channel, pct, monthly: round(revenue * pct / 100), isBenchmark: false }
      })
    }
  }

  // Fall back to benchmark channel labels with equal-ish split
  // isBenchmark: true — these splits are industry averages, not this business's actual mix
  const labels = bm.revenueChannelLabels
  const splits: number[] = labels.length === 3 ? [60, 28, 12] : [50, 30, 20]
  return labels.map((label, i) => ({
    channel:     label,
    pct:         splits[i] ?? Math.floor(100 / labels.length),
    monthly:     round(revenue * (splits[i] ?? Math.floor(100 / labels.length)) / 100),
    isBenchmark: true,
  }))
}

// ── Scenario builder ──────────────────────────────────────────────────────────

function buildScenarios(
  baseRevenue:      number,
  baseCosts:        number,
  dailyCustomers:   number,
  avgTicket:        number,
  fixedCostsOnly:   number,   // staff + rent — truly fixed regardless of scenario
  contributionUnit: number,   // avgTicket × (grossMargin% - otherCosts%)
): ComputedResult['scenarios'] {
  const worstRevenue = round(baseRevenue * 0.65)
  const bestRevenue  = round(baseRevenue * 1.40)
  const worstCosts   = round(baseCosts   * 1.10)   // 10% cost overrun in worst case
  const bestCosts    = round(baseCosts   * 0.93)   // 7% savings in best case

  const makeRow = (rev: number, costs: number, assumption: string): ScenarioRow => {
    // customers_needed = daily customers to cover FIXED costs under this scenario
    // Uses contribution margin formula (not gross margin on total costs)
    const needed = contributionUnit > 0
      ? Math.ceil(fixedCostsOnly / (contributionUnit * 30))
      : 0
    return {
      assumption,
      monthly_revenue:  rev,
      monthly_costs:    costs,
      monthly_profit:   rev - costs,
      customers_needed: needed,
    }
  }

  return {
    worst: makeRow(worstRevenue, worstCosts,
      'Slow customer acquisition, higher than expected operating costs'),
    base: makeRow(baseRevenue, baseCosts,
      'Expected ramp-up with consistent marketing and operations'),
    best: makeRow(bestRevenue, bestCosts,
      'Strong word-of-mouth, high utilisation, well-managed costs'),
  }
}

// ── Confidence scoring ────────────────────────────────────────────────────────

function computeConfidence(
  revenueSource:  string,
  costsSource:    string,
  compDataQuality: CompetitorDataQuality,
  a3Available:    boolean,
): { completeness: number; label: ConfidenceLabel } {
  let score = 0

  // Revenue source (max 35)
  // STRICT: A4 revenue is a cost-projection model output — not live market data.
  // It earns 0 confidence points. Only A5 (market analysis agent) earns credit here.
  if (revenueSource === 'a5_live')         score += 35
  else if (revenueSource === 'a5_blended') score += 20
  // a4_fallback = 0   (model estimate, not a real market observation)
  // benchmark_default = 0

  // Cost source (max 25)
  if (costsSource === 'a4_live')          score += 25
  else if (costsSource === 'a4_blended')  score += 15
  // benchmark_default = 0

  // Competitor data quality (max 25)
  // STRICT: zero_warning earns 0 — we cannot tell if "0 competitors" means blue ocean
  // or search failure. Uncertainty must not add confidence points.
  if (compDataQuality === 'live_verified') score += 25
  else if (compDataQuality === 'partial')  score += 12
  // zero_warning = 0  (unverified absence of data ≠ confirmed absence of competitors)
  // no_data = 0

  // Market demand data (max 15)
  if (a3Available) score += 15

  const completeness = clamp(score, 0, 100)
  const label: ConfidenceLabel =
    completeness >= 70 ? 'high'
    : completeness >= 45 ? 'medium'
    : completeness >= 20 ? 'low'
    : 'benchmark_default'

  return { completeness, label }
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * computeEngine()
 *
 * The ONLY function that may produce a ComputedResult.
 * Pure function — no side effects, no DB calls, no HTTP.
 */
export function computeEngine(input: ComputeInput): ComputedResult {
  const logger  = new ComputeLogger()
  const bizKey  = resolveBizKey(input.businessType)
  const bm      = BIZ_BENCHMARKS[bizKey] ?? BIZ_BENCHMARKS['other']

  const { a1 = {}, a2 = {}, a3 = {}, a4 = {}, a5 = {}, a6 = {} } =
    input.agentOutputs as Record<string, Record<string, any>>

  // ── Agent availability detection ─────────────────────────────────────────
  //
  // An agent is considered "available" when it returned at least one substantive
  // data key (i.e. not just boilerplate status/error/message fields).
  // This is the authoritative source for "which agents ran successfully."
  //
  // These flags drive:
  //   - agentCoverage in the result (consumed by UI for targeted "no data" states)
  //   - Hard gates in applyHardFailGates() (e.g. both A2+A3 missing → block GO)
  //   - Future: per-section data quality badges
  //
  // CRITICAL: empty object defaults ({}) are assigned when an agent key is
  // entirely absent from agentOutputs — treating that as "available" is the
  // bug that allowed 0-data reports to produce confident outputs.
  const META_KEYS = new Set(['status', 'error', 'message', 'timestamp', 'agent', 'agent_id', 'run_id'])
  const hasAgentData = (obj: Record<string, any>): boolean =>
    Object.keys(obj).some(k => !META_KEYS.has(k) && obj[k] != null && obj[k] !== '')

  const a1Available = hasAgentData(a1)
  const a2Available = hasAgentData(a2)
  // A3 requires at least one market signal key — not just any non-meta field
  const a3Available = hasAgentData(a3) && (
    a3.market_score     != null ||
    a3.demand_score     != null ||
    a3.demand_trend     != null ||
    a3.saturation_label != null ||
    a3.saturation       != null
  )
  const a4Available = hasAgentData(a4)
  // A5 requires at least one revenue signal key
  const a5Available = hasAgentData(a5) && (
    a5.monthly_revenue             != null ||
    a5.projected_monthly_revenue   != null ||
    a5.revenue_range               != null
  )

  const agentCoverage = { a1: a1Available, a2: a2Available, a3: a3Available, a4: a4Available, a5: a5Available }

  console.log('[computeEngine] agentCoverage', agentCoverage)

  // ── STEP 1: Resolve revenue ──────────────────────────────────────────────

  // Operating hours multiplier — baked into bmRevenue so it affects the
  // entire blend (not just the benchmark-only path)
  const hoursMultiplier: Record<string, number> = {
    breakfast_lunch: 0.65,   // AM-only: lower overall volume
    lunch_dinner:    1.00,   // baseline
    all_day:         1.35,   // more trading hours = more customers
    dinner_evening:  0.55,   // evening-only: typically lower covers
    weekends_only:   0.45,   // ~2/7 operating days
  }
  const hoursKey  = input.operatingHours ?? null   // null = don't adjust
  const hoursMult = hoursKey ? (hoursMultiplier[hoursKey] ?? 1.0) : 1.0

  // Location access multiplier — street frontage IS the benchmark baseline (1.0)
  // arcades and side streets materially reduce walk-in volume
  const locationAccessMultiplier: Record<string, number> = {
    street_frontage:  1.00,   // this IS the benchmark baseline — no adjustment
    transport_hub:    1.10,   // captive commuter audience
    shopping_centre:  1.05,   // indoor foot traffic
    side_street:      0.75,   // reduced passing trade
    arcade:           0.70,   // hardest to find, destination-only
  }
  const accessKey  = input.locationAccess ?? null  // null = don't adjust
  const accessMult = accessKey ? (locationAccessMultiplier[accessKey] ?? 1.0) : 1.0

  // User's avgOrderValue takes highest priority for revenue calculation
  // This ensures the benchmark path uses the user's actual pricing
  const ticketForBenchmark = (input.avgOrderValue != null && input.avgOrderValue > 0)
    ? input.avgOrderValue : bm.avgTicketSize

  // Benchmark baseline — incorporates hours + access multipliers and user ticket
  const bmRevenue = round(bm.dailyCustomersBase * hoursMult * accessMult * ticketForBenchmark * 30)

  // Agent revenue candidates (in priority order: A5 > A4)
  const agentRevRaw =
    parseMoney(a5?.monthly_revenue)
    ?? parseMoney(a5?.projected_monthly_revenue)
    ?? parseMoney(a5?.revenue_range?.monthly_base)
    ?? parseMoney(a4?.financial_projections?.estimated_monthly_revenue)
    ?? null

  const revBlend = blend(agentRevRaw, bmRevenue, 'monthly_revenue', logger)

  const revenueSource: 'a5_live' | 'a5_blended' | 'a4_fallback' | 'benchmark_default' =
    agentRevRaw == null
      ? 'benchmark_default'
      : revBlend.source === 'agent'
        ? (a5?.monthly_revenue != null ? 'a5_live' : 'a4_fallback')
        : revBlend.source === 'blended'
          ? 'a5_blended'
          : 'benchmark_default'

  logger.setRevenueSource(
    revenueSource, agentRevRaw, bmRevenue, revBlend.diffPct, revBlend.weight,
  )

  // ── Apply live competitor pressure to revenue ────────────────────────────
  // When real-world density is available (multi-source fetch), apply a
  // pressure factor based on WEIGHTED competitor count (not raw headcount).
  // Google-verified venues carry full weight; OSM-only venues carry 0.6x.
  // This is the ONLY place the pressure factor touches revenue.
  const liveCD         = input.liveCompetitorDensity
  const pressureFactor = liveCD?.pressureFactor ?? 1.0
  const revenue        = Math.round(revBlend.value * pressureFactor)

  // ── STEP 2: Resolve costs ────────────────────────────────────────────────

  // Benchmark costs
  const bmOtherCosts = round(bmRevenue * bm.otherCostsPct)
  const bmCogs       = round(bmRevenue * (1 - bm.grossMarginPct / 100))
  const bmTotalCosts = bm.staffCosts + bmOtherCosts + bmCogs + input.monthlyRent

  // Agent total costs
  const agentCostsRaw =
    parseMoney(a4?.total_monthly_costs)
    ?? parseMoney(a4?.totalMonthlyCosts)
    ?? null

  // Validate agent staff line (sanity check — most common fabrication)
  const agentStaff = parseMoney(a4?.staffing_costs ?? a4?.staff_costs ?? a4?.staffing)
  if (agentStaff != null) {
    const diffStaff = Math.abs(agentStaff - bm.staffCosts) / bm.staffCosts
    if (diffStaff > 0.80) {
      logger.rejectValue('staffing_costs', agentStaff,
        `${(diffStaff * 100).toFixed(0)}% off benchmark ${bm.staffCosts} for ${bizKey}`)
    }
  }

  const costsBlend = blend(agentCostsRaw, bmTotalCosts, 'total_monthly_costs', logger)

  const costsSource: 'a4_live' | 'a4_blended' | 'benchmark_default' =
    agentCostsRaw == null
      ? 'benchmark_default'
      : costsBlend.source === 'agent'
        ? 'a4_live'
        : costsBlend.source === 'blended'
          ? 'a4_blended'
          : 'benchmark_default'

  logger.setCostsSource(
    costsSource, agentCostsRaw, bmTotalCosts, costsBlend.diffPct, costsBlend.weight,
  )

  // Use blended total costs; split it back into components proportionally
  const totalCosts  = costsBlend.value
  const rent        = input.monthlyRent
  // staff and other from benchmark ratios, constrained to totalCosts - rent
  const nonRent     = Math.max(0, totalCosts - rent)
  const bmNonRent   = Math.max(1, bmTotalCosts - rent)
  const staff       = round(bm.staffCosts / bmNonRent * nonRent)
  const cogs        = round(bmCogs / bmNonRent * nonRent)
  const other       = Math.max(0, totalCosts - rent - staff - cogs)

  // ── STEP 3: Net profit — THE INVARIANT ───────────────────────────────────
  //   netProfit is ALWAYS computed here. Never from any agent output.
  const netProfit = revenue - totalCosts

  // ── STEP 4: Gross margin ─────────────────────────────────────────────────
  const grossMarginPct = revenue > 0
    ? round((revenue - cogs) / revenue * 100)
    : bm.grossMarginPct

  // ── STEP 5: Average ticket size & daily customers ────────────────────────
  // User-entered avgTicketSize is ground truth.
  // Only accept agent value if within 30% of user-entered.
  // avgOrderValue from onboarding form takes highest priority — user knows their own pricing
  // (ticketForBenchmark already used this in STEP 1 for bmRevenue)
  const userTicketOverride = (input.avgOrderValue != null && input.avgOrderValue > 0)
    ? input.avgOrderValue : null
  const userTicket    = input.avgTicketSize
  const agentTicket   = parseMoney(a5?.avg_ticket_size ?? a4?.avg_ticket_size)
  const ticketDiff    = agentTicket != null ? Math.abs(agentTicket - userTicket) / userTicket : 1
  const avgTicketSize = userTicketOverride
    ?? (ticketDiff < 0.30 ? (agentTicket ?? userTicket) : userTicket)

  // Daily customers — derived from revenue / ticket (hoursMult+accessMult already
  // baked into bmRevenue in STEP 1, so they flow through the blend into revenue)
  let dailyCustomers = avgTicketSize > 0
    ? round(revenue / avgTicketSize / 30)
    : round(bm.dailyCustomersBase * hoursMult * accessMult)

  // Seating capacity cap — for dine-in businesses, daily customers cannot
  // physically exceed seats × average_turns_per_day × operating_days_factor
  if (input.seatingCapacity != null && input.seatingCapacity > 0) {
    const turnsPerDay = bizKey === 'restaurant' ? 2.5 : bizKey === 'bar' ? 3.0 : 2.0
    const capacityCap = Math.round(input.seatingCapacity * turnsPerDay)
    dailyCustomers = Math.min(dailyCustomers, capacityCap)
  }

  // ── STEP 6: Break-even ───────────────────────────────────────────────────
  // Correct formula uses CONTRIBUTION MARGIN (not gross margin) against FIXED costs only.
  // Variable costs (COGS, other costs as % of revenue) auto-adjust with volume — only
  // staff and rent are truly fixed. Using total costs in the numerator double-counts COGS.
  //
  //   fixedCosts          = staffCosts + rent
  //   contributionMargin  = avgTicket × (grossMarginPct% - otherCostsPct%)
  //   breakEvenDaily      = fixedCosts / (contributionMargin × 30)
  //
  // Example (cafe): 23,000 / ($18 × 0.53 × 30) = 81 customers/day ✓
  //   vs old formula: 53,456 / ($18 × 0.65 × 30) = 153 customers/day ✗ (wrong)
  const fixedCostsOnly         = bm.staffCosts + input.monthlyRent
  const contributionMarginUnit = avgTicketSize * Math.max(0.01, (bm.grossMarginPct / 100) - bm.otherCostsPct)
  const breakEvenDaily = contributionMarginUnit > 0
    ? Math.ceil(fixedCostsOnly / (contributionMarginUnit * 30))
    : 0

  // Suppress payback period when setup budget is a benchmark estimate.
  // Displaying "12 months payback" when setup cost was guessed from staffCosts×8
  // is false precision — user has no way to know the denominator is fabricated.
  const breakEvenMonths = (netProfit > 0 && !input.setupBudgetIsEstimated)
    ? Math.ceil(input.setupBudget / netProfit)
    : null

  // ── STEP 7: Validate & filter competitors ────────────────────────────────
  //
  // A1 uses many different output key names — collect from ALL known variants
  // to avoid silent data loss when A1 uses an unexpected key name.
  const rawCompetitors: Array<Record<string, any>> = [
    ...(Array.isArray(a1?.competitors)             ? a1.competitors             : []),
    ...(Array.isArray(a1?.direct_competitors)      ? a1.direct_competitors      : []),
    ...(Array.isArray(a1?.indirect_competitors)    ? a1.indirect_competitors    : []),
    ...(Array.isArray(a1?.nearby_businesses)       ? a1.nearby_businesses       : []),
    ...(Array.isArray(a1?.competitor_businesses)   ? a1.competitor_businesses   : []),
    ...(Array.isArray(a1?.all_competitors)         ? a1.all_competitors         : []),
    ...(Array.isArray(a1?.businesses)              ? a1.businesses              : []),
    ...(Array.isArray(a1?.places)                  ? a1.places                  : []),
    ...(Array.isArray(a1?.results)                 ? a1.results                 : []),
    ...(Array.isArray(a1?.nearby_places)           ? a1.nearby_places           : []),
  ]

  // Deduplicate by name before filtering (avoids double-counting the same place)
  const seenRaw = new Set<string>()
  const uniqueRaw = rawCompetitors.filter(c => {
    const key = String(c.name ?? c.business_name ?? '').toLowerCase().trim()
    if (!key || seenRaw.has(key)) return false
    seenRaw.add(key)
    return true
  })

  const seen = new Set<string>()
  const competitors: ValidatedCompetitor[] = uniqueRaw
    .filter(c => isValidCompetitor(c, bizKey))
    .filter(c => {
      const key = String(c.name ?? c.business_name ?? '').toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map(c => ({
      name:     String(c.name ?? c.business_name ?? 'Unknown'),
      rating:   parseMoney(c.rating ?? c.google_rating),
      type:     String(c.type ?? c.competitor_type ?? '').toLowerCase() === 'direct'
                  ? 'direct' as const
                  : 'indirect' as const,
      distance: parseMoney(c.distance ?? c.distance_m) ?? undefined,
      address:  c.address ?? c.full_address ?? undefined,
    }))

  const a1CompetitorCount = competitors.length
  const competitorRadius  = bm.competitorRadiusM

  // ── Competitor data quality assessment ────────────────────────────────────
  //
  // This determines whether "0 competitors" means genuine blue ocean or data failure.
  //
  // HARD RULE: If A1 returned no competitor array at all → no_data
  //            If A1 searched but found nothing → zero_warning (not blue ocean)
  //            If A1 found ≥1 valid competitors → live_verified
  //            If A1 found raw entries but all were filtered out → partial or zero_warning
  const a1HasArray =
    Array.isArray(a1?.competitors) ||
    Array.isArray(a1?.nearby_businesses) ||
    Array.isArray(a1?.competitor_businesses) ||
    Array.isArray(a1?.all_competitors) ||
    Array.isArray(a1?.businesses) ||
    Array.isArray(a1?.places) ||
    Array.isArray(a1?.results) ||
    Array.isArray(a1?.nearby_places)

  const a1DataQuality: CompetitorDataQuality =
    !a1HasArray
      ? 'no_data'
      : a1CompetitorCount > 0
        ? 'live_verified'
        : uniqueRaw.length > 0
          ? 'zero_warning'
          : 'zero_warning'

  // ── OVERRIDE with live multi-source density when available ────────────────
  //
  // liveCD is more reliable than A1 (A1 has a broken webhook that returns 404).
  // When present:
  //   • validCompetitorCount → weightedCount1km (confidence-weighted, not raw)
  //   • competitorDataQuality → live_verified
  //   • strong/moderate/weak → estimated from weightedCount500m
  //
  // Using weighted count means:
  //   - 10 Google-verified venues  → effectiveCount = 10.0
  //   - 10 Geoapify-only venues    → effectiveCount =  6.0
  //   - Mixed (5 Google + 5 Geoa)  → effectiveCount =  8.0
  // This prevents OSM data quality issues from triggering "high competition" scores.

  // Round to integer — weighted float (e.g. 7.3) is meaningful for scoring
  // but must display as a whole number to users ("7 competitors", not "7.3")
  const validCompetitorCount: number = liveCD != null
    ? Math.round(liveCD.weightedCount1km)   // weighted, post-cluster — rounded for display
    : a1CompetitorCount                      // A1 agent fallback

  const competitorDataQuality: CompetitorDataQuality =
    liveCD != null
      ? (liveCD.avgConfidence >= 0.8 ? 'live_verified' : 'partial')
      : a1DataQuality

  // Threat breakdown: use weighted 500m count as the close-range proxy
  const liveStrongCount   = liveCD != null ? Math.round(liveCD.weightedCount500m * 0.30) : null
  const liveModerateCount = liveCD != null ? Math.round(liveCD.weightedCount500m * 0.40) : null
  const liveWeakCount     = liveCD != null
    ? Math.max(0, Math.round(liveCD.weightedCount1km - (liveStrongCount ?? 0) - (liveModerateCount ?? 0)))
    : null

  // ── STEP 7b: A1 v4 threat-count fields ───────────────────────────────────
  //
  // A1 v4 enriches each competitor with a threat_score and provides
  // aggregate counts. When present, use them for precise saturation
  // scoring. When absent (v3 or earlier), estimate from raw count.
  const a1StrongCount    = typeof a1?.strong_count   === 'number' ? a1.strong_count   : null
  const a1ModerateCount  = typeof a1?.moderate_count === 'number' ? a1.moderate_count : null
  const a1WeakCount      = typeof a1?.weak_count     === 'number' ? a1.weak_count     : null
  const a1OpportunityLvl = typeof a1?.opportunity_level === 'string'
    ? (a1.opportunity_level as 'high' | 'medium' | 'low' | 'unknown')
    : null

  // Estimate counts from raw competitor list if A1 v4 fields missing.
  // Priority: A1 v4 explicit → live density estimate → raw-count estimate
  const strongCount   = a1StrongCount   ?? liveStrongCount   ?? Math.round(validCompetitorCount * 0.25)
  const moderateCount = a1ModerateCount ?? liveModerateCount ?? Math.round(validCompetitorCount * 0.40)
  const weakCount     = a1WeakCount     ?? liveWeakCount     ?? Math.max(0, validCompetitorCount - strongCount - moderateCount)

  // Attach threat fields from A1 v4 to the validated competitor list
  const competitors2: ValidatedCompetitor[] = competitors.map((c, idx) => {
    // Find matching raw place in A1 output by name
    const rawMatch = rawCompetitors.find(r =>
      String(r.name ?? '').toLowerCase().trim() === c.name.toLowerCase().trim()
    )
    return {
      ...c,
      threatScore: typeof rawMatch?.threat_score === 'number' ? rawMatch.threat_score : undefined,
      threatLabel: rawMatch != null && (['strong', 'moderate', 'weak'] as const).includes(rawMatch.threat_label)
        ? rawMatch.threat_label as 'strong' | 'moderate' | 'weak'
        : undefined,
      rank: typeof rawMatch?.rank === 'number' ? rawMatch.rank : idx + 1,
    }
  })

  // ── STEP 8: Location signals (A2) ────────────────────────────────────────
  const locationSignals: ComputedResult['locationSignals'] = {
    medianRent:     parseMoney(a2?.median_rent ?? a2?.average_rent ?? a2?.rent_per_sqm),
    footfallSignal: String(a2?.footfall_signal ?? a2?.foot_traffic ?? '').trim() || null,
    transitSignal:  String(a2?.transit_signal  ?? a2?.public_transport ?? '').trim() || null,
    roadType:       String(a2?.road_type ?? a2?.street_type ?? '').trim() || null,
    nearbyAnchors:  Array.isArray(a2?.nearby_anchors)
                      ? a2.nearby_anchors.map(String)
                      : [],
  }

  // ── STEP 8b: A2 contamination guard ──────────────────────────────────────
  //
  // Known n8n bug: both SerpApi nodes in A2 have hardcoded Fitzroy/Carlton/Collingwood
  // suburb names. Every address — regardless of city — receives location signals that
  // describe a specific Melbourne inner suburb. This contaminates footfall, transit,
  // and anchor data for all non-Melbourne addresses.
  //
  // Detection: if the combined signals text contains contaminated suburb names AND
  // the user's input area is not one of those suburbs → zero out the qualitative signals.
  // medianRent is preserved (still useful as a rough AU benchmark even if area is wrong).
  //
  // Effect: scoreLocation() drops to its neutral base of 50, which is honest.
  //         Without this fix, Perth or Brisbane reports showed "high footfall" based on
  //         Brunswick Street Fitzroy data.
  const A2_CONTAMINATED_SUBURBS = ['fitzroy', 'collingwood', 'carlton', 'richmond', 'brunswick']
  const inputAreaNorm = input.area.toLowerCase().trim()
  const a2SignalsText = [
    locationSignals.footfallSignal,
    locationSignals.transitSignal,
    locationSignals.roadType,
    ...locationSignals.nearbyAnchors,
  ].join(' ').toLowerCase()

  const a2IsContaminated =
    // Signals contain a known contaminated suburb name
    A2_CONTAMINATED_SUBURBS.some(s => a2SignalsText.includes(s)) &&
    // But the user's actual area is NOT one of those suburbs
    !A2_CONTAMINATED_SUBURBS.some(s => inputAreaNorm.includes(s)) &&
    // Only flag when there is actually signal text to examine
    a2SignalsText.trim().length > 0

  if (a2IsContaminated) {
    console.warn(
      `[computeEngine] A2 contamination detected for area="${input.area}": ` +
      `signals contain Fitzroy/Carlton/Brunswick keywords. Zeroing qualitative location signals. ` +
      `medianRent preserved as-is.`
    )
    locationSignals.footfallSignal = null
    locationSignals.transitSignal  = null
    locationSignals.roadType       = null
    locationSignals.nearbyAnchors  = []
  }

  // ── STEP 9: Market signals (A3) ──────────────────────────────────────────
  const rawDemandScore = parseMoney(a3?.market_score ?? a3?.demand_score)
  const rawSaturation  = String(a3?.saturation_label ?? a3?.saturation ?? '').toLowerCase()

  // Cross-validate: competition score vs saturation label
  // HARD RULE: Only override A3's label with our count when data is reliable.
  // If data quality is uncertain, defer to A3's label (or null) rather than
  // incorrectly claiming "low saturation" because we found 0.
  const impliedSaturation =
    competitorDataQuality === 'no_data'
      ? null                               // can't imply saturation from no data
      : validCompetitorCount <= 3  ? 'low'
      : validCompetitorCount <= 8  ? 'moderate'
      : 'high'

  // If A3 says "low saturation" but we found 20 competitors → trust our count
  // But if we found 0 and data quality is uncertain → defer to A3 or null
  const saturationLabel =
    (competitorDataQuality === 'live_verified' && rawSaturation && rawSaturation !== impliedSaturation && validCompetitorCount > 5)
      ? impliedSaturation                  // override AI label with confirmed count
      : (rawSaturation || impliedSaturation || null)

  // ── STEP 9b: Confidence-adjusted demand signal ───────────────────────────
  //
  // The demand score that drives scoring is a confidence-weighted blend of:
  //   A) A3 agent demand score (0–100) — direct market research signal
  //   B) Density-derived demand signal — inverse of market saturation
  //
  // Density demand signal:
  //   saturationPct = weightedCount1km / maxCompetitorsInRadius (capped 0–1)
  //   densityDemand = 100 × (1 - saturationPct)
  //   → Few competitors → high density demand (lots of unmet demand)
  //   → Many competitors → low density demand (market already served)
  //
  // Blend weights:
  //   A3 confidence:      0.65 when A3 returned data, else 0
  //   Density confidence: avgSourceConfidence × 0.55 when liveCD available, else 0
  //   → Normalised so they sum to 1.0

  const maxComp = bm.maxCompetitorsInRadius
  let adjustedDemandScore: number | null = null

  if (liveCD != null || rawDemandScore != null) {
    let a3Weight   = rawDemandScore != null ? 0.65 : 0
    let densWeight = liveCD != null ? liveCD.avgConfidence * 0.55 : 0
    const totalW   = a3Weight + densWeight

    if (totalW > 0) {
      a3Weight   /= totalW
      densWeight /= totalW

      const densityDemand = liveCD != null
        ? clamp(100 * (1 - liveCD.weightedCount1km / maxComp), 10, 95)
        : 55   // neutral when no live data

      adjustedDemandScore = clamp(
        round(
          (rawDemandScore != null ? rawDemandScore * a3Weight : 0) +
          densityDemand * densWeight,
        ),
        0, 100,
      )
    }
  }

  // ── STEP 9c: A6 demographics income adjustment ───────────────────────────
  //
  // A6 provides suburb-level demographics (ABS-adjacent).
  // Median income signals spending power — used as a modest ±8pt adjustment
  // on adjustedDemandScore. Small weight so demographics don't override
  // market research; they refine it.
  //
  //   AUD income tiers:
  //     ≥ 110,000 → high spending power   → +8 pts
  //     ≥  80,000 → moderate-high         → +4 pts
  //     ≥  60,000 → moderate (neutral)    →  0 pts
  //     ≥  45,000 → below average         → -4 pts
  //     <  45,000 → low spending power    → -8 pts
  //
  // Only applied when A6 returned valid data (income > 0).
  const a6MedianIncome = Number(a6?.median_household_income ?? a6?.median_income ?? 0) || null
  if (a6MedianIncome != null && a6MedianIncome > 0 && adjustedDemandScore != null) {
    const incomeAdj =
      a6MedianIncome >= 110000 ?  8 :
      a6MedianIncome >=  80000 ?  4 :
      a6MedianIncome >=  60000 ?  0 :
      a6MedianIncome >=  45000 ? -4 : -8
    adjustedDemandScore = clamp(adjustedDemandScore + incomeAdj, 0, 100)
    console.log('[computeEngine] A6 demographics income adjustment', { median_income: a6MedianIncome, adj: incomeAdj, result: adjustedDemandScore })
  }

  const marketSignals: ComputedResult['marketSignals'] = {
    demandScore:     rawDemandScore != null ? clamp(rawDemandScore, 0, 100) : null,
    demandTrend:     String(a3?.demand_trend ?? a3?.trend ?? '').trim() || null,
    saturationLabel,
  }

  // ── STEP 10: Scores ──────────────────────────────────────────────────────
  // Use adjustedDemandScore when available — it blends A3 agent data with
  // confidence-weighted density signal for a grounded demand estimate.
  const effectiveDemandScore = adjustedDemandScore ?? marketSignals.demandScore

  const scoreRentV    = scoreRent(rent, revenue)
  const scoreCompV    = scoreCompetition(validCompetitorCount, competitorDataQuality)
  const scoreDemandV  = scoreDemand(effectiveDemandScore)
  const scoreProfV    = scoreProfitability(netProfit)
  const scoreLocV     = scoreLocation(locationSignals)
  const scoreOverall  = round(
    scoreRentV   * 0.20 +
    scoreCompV   * 0.25 +
    scoreDemandV * 0.20 +
    scoreProfV   * 0.25 +
    scoreLocV    * 0.10,
  )

  // ── STEP 10b: Market intelligence scores ─────────────────────────────────
  // Both opportunity and viability use adjustedDemandScore for groundedness
  const satScore   = scoreSaturation(strongCount, moderateCount, weakCount)
  const oppScore   = scoreOpportunity(
    satScore,
    effectiveDemandScore,
    marketSignals.demandTrend,
    locationSignals.footfallSignal,
  )
  const viabScore  = scoreViability(
    oppScore,
    effectiveDemandScore,
    marketSignals.demandTrend,
    scoreLocV,
  )
  const satBand    = saturationBand(satScore, validCompetitorCount)
  const opportunityLevel: 'high' | 'medium' | 'low' | 'unknown' =
    a1OpportunityLvl
    ?? (satBand === 'unknown'   ? 'unknown'
      : satBand === 'low'       ? 'high'
      : satBand === 'moderate'  ? 'medium'
      : 'low')

  const marketGapNote = detectMarketGap(bizKey, strongCount, validCompetitorCount, competitorRadius, input.area)

  // Top 3 threats: prefer A1 v4 rank field, else sort by threatScore, else by rating
  const topThreats = competitors2
    .slice()
    .sort((a, b) => {
      if (a.rank != null && b.rank != null) return a.rank - b.rank
      if (a.threatScore != null && b.threatScore != null) return b.threatScore - a.threatScore
      return (b.rating ?? 0) - (a.rating ?? 0)
    })
    .slice(0, 3)

  // STRICT: demand sub-score is null when it is a placeholder.
  // effectiveDemandScore is null when both A3 and live competitor density are absent.
  // The internal scoreOverall calculation already used scoreDemandV (55 neutral) so the
  // overall score reflects a neutral assumption — but we must NOT surface that 55 as a
  // real demand measurement. Downstream UI: show "No data" when scores.demand is null.
  const demandScoreOutput: number | null =
    effectiveDemandScore !== null ? clamp(scoreDemandV, 0, 100) : null

  const scores: ComputedResult['scores'] = {
    overall:       clamp(scoreOverall, 0, 100),
    rent:          clamp(scoreRentV, 0, 100),
    competition:   clamp(scoreCompV, 0, 100),
    demand:        demandScoreOutput,
    profitability: clamp(scoreProfV, 0, 100),
    location:      clamp(scoreLocV, 0, 100),
    saturation:    satScore,
    viability:     viabScore,
  }

  // ── STEP 11: Verdict ─────────────────────────────────────────────────────
  const { verdict, verdictReasons, verdictConditions, verdictFailureModes } =
    deriveVerdict(
      scores, netProfit, validCompetitorCount, rent, revenue,
      competitorDataQuality, viabScore, opportunityLevel, strongCount,
      dailyCustomers, breakEvenDaily,
    )

  // ── STEP 12: Revenue channels ────────────────────────────────────────────
  const revenueChannels = buildRevenueChannels(bizKey, revenue, a5)

  // ── STEP 13: Scenarios & projection ──────────────────────────────────────
  const scenarios = buildScenarios(revenue, totalCosts, dailyCustomers, avgTicketSize, fixedCostsOnly, contributionMarginUnit)

  // STRICT: multi-year projections require a live revenue signal.
  // Applying 8%/10% growth to a benchmark-derived revenue figure produces false precision —
  // a specific "Year 3: $171,072" based on industry averages is not a projection, it is a guess.
  // When suppressed, year2 and year3 are null. UI must not render suppressed projections.
  const projectionsReliable = revenueSource !== 'benchmark_default'
  const projection: Projection = {
    year1:      round(netProfit * 12),
    year2:      projectionsReliable ? round(netProfit * 12 * 1.08)              : null,
    year3:      projectionsReliable ? round(netProfit * 12 * 1.08 * 1.10)       : null,
    suppressed: !projectionsReliable,
  }

  // ── STEP 14: Confidence ──────────────────────────────────────────────────
  const { completeness, label: modelConfidence } = computeConfidence(
    revenueSource, costsSource,
    competitorDataQuality,
    rawDemandScore != null,
  )

  // ── STEP 15: Seal the log ────────────────────────────────────────────────
  logger.setCompetitorMeta(uniqueRaw.length, validCompetitorCount, competitorDataQuality)
  const computeLog = logger.seal()
  logComputeSummary(input.reportId, bizKey, input.area, computeLog, netProfit)

  // ── STEP 16: Trust layer ─────────────────────────────────────────────────
  //
  // Build a preliminary result shape to run validation functions against.
  // This is required because validation functions inspect the full result.
  //
  // Order:
  //   16a. Build preliminary result
  //   16b. Apply hard fail gates (may override verdict)
  //   16c. Detect contradictions (on potentially-overridden verdict)
  //   16d. Build section confidence breakdown
  //   16e. Build per-metric provenance map
  //   16f. Build honest revenue range

  // 16a — Partial result used by validation (no trust-layer fields yet)
  const prelimResult: Omit<ComputedResult,
    'sectionConfidence' | 'provenance' | 'revenueRange' | 'contradictions' | 'verdictGateTriggered'
  > = {
    agentCoverage,
    revenue,
    totalCosts,
    netProfit,
    grossMarginPct,
    costBreakdown: { rent, staff, cogs, other },
    revenueChannels,
    dailyCustomers,
    avgTicketSize,
    breakEvenDaily,
    breakEvenMonths,
    scenarios,
    projection,
    scores,
    verdict,
    verdictReasons,
    verdictConditions,
    verdictFailureModes,
    competitors: competitors2,
    validCompetitorCount,
    competitorRadius,
    competitorDataQuality,
    locationSignals,
    marketSignals,
    marketIntelligence: {
      saturationScore:  satScore,
      saturationBand:   satBand,
      opportunityScore: oppScore,
      viabilityScore:   viabScore,
      opportunityLevel,
      topThreats,
      marketGapNote,
      strongCount,
      moderateCount,
      weakCount,
    },
    competitorPressure: {
      density:            liveCD?.density            ?? 'unknown',
      // null means "no live data attempted" — distinct from verified zero competitors
      rawCount500m:       liveCD?.rawCount500m        ?? null,
      rawCount1km:        liveCD?.rawCount1km         ?? null,
      weightedCount500m:  liveCD?.weightedCount500m   ?? null,
      weightedCount1km:   liveCD?.weightedCount1km    ?? null,
      avgConfidence:      liveCD?.avgConfidence       ?? null,
      pressureFactor,
      revenueAdjusted:    pressureFactor < 1.0,
      adjustedDemandScore,
      sources:            liveCD?.sources             ?? [],
    },
    dataCompleteness: completeness,
    modelConfidence,
    meta: {
      engineVersion:    ENGINE_VERSION,
      benchmarkVersion: BENCHMARK_VERSION,
      computedAt:       computeLog.computedAt,
      computeLog,
    },
  }

  // 16b — Hard fail gates: may override verdict
  const gateResult = applyHardFailGates(
    prelimResult.verdict,
    prelimResult.verdictReasons,
    prelimResult.verdictConditions,
    {
      dataCompleteness:       prelimResult.dataCompleteness,
      modelConfidence:        prelimResult.modelConfidence,
      competitorDataQuality:  prelimResult.competitorDataQuality,
      marketSignals:          prelimResult.marketSignals,
      netProfit:              prelimResult.netProfit,
      // PIPELINE-LEVEL GATES: pass revenueSource and agentCoverage so the gate
      // function can enforce: benchmark revenue → no GO, missing A2+A3 → no GO
      revenueSource,
      agentCoverage,
    }
  )
  const finalVerdict             = gateResult.verdict
  const finalVerdictReasons      = gateResult.verdictReasons
  const finalVerdictConditions   = gateResult.verdictConditions
  const verdictGateTriggered     = gateResult.gateTriggered

  // Patch prelim result with final verdict for contradiction detection
  const resultForValidation = {
    ...prelimResult,
    verdict:           finalVerdict,
    verdictReasons:    finalVerdictReasons,
    verdictConditions: finalVerdictConditions,
  } as ComputedResult

  // 16c — Contradiction detection
  const contradictions = detectContradictions(resultForValidation)

  // 16d — Section confidence breakdown
  const sectionConfidence = buildSectionConfidence(resultForValidation, input)

  // 16e — Per-metric provenance map
  const provenance = buildProvenance(resultForValidation, input)

  // 16f — Honest revenue range with uncertainty bounds
  const revenueRange = buildRevenueRange(revenue, modelConfidence, revenueSource)

  // ── ASSEMBLE & RETURN ────────────────────────────────────────────────────
  return {
    // Core financials — always computed, never from agents
    revenue,
    totalCosts,
    netProfit,         // INVARIANT: always === revenue - totalCosts ✓
    grossMarginPct,

    costBreakdown: { rent, staff, cogs, other },
    revenueChannels,
    dailyCustomers,
    avgTicketSize,
    breakEvenDaily,
    breakEvenMonths,

    scenarios,
    projection,
    scores,

    // Verdict — may have been overridden by hard fail gates
    verdict:             finalVerdict,
    verdictReasons:      finalVerdictReasons,
    verdictConditions:   finalVerdictConditions,
    verdictFailureModes,

    competitors:          competitors2,
    validCompetitorCount,
    competitorRadius,
    competitorDataQuality,

    locationSignals,
    marketSignals,

    // ── Market intelligence (v3.0) ────────────────────────────────────────
    marketIntelligence: {
      saturationScore:   satScore,
      saturationBand:    satBand,
      opportunityScore:  oppScore,
      viabilityScore:    viabScore,
      opportunityLevel,
      topThreats,
      marketGapNote,
      strongCount,
      moderateCount,
      weakCount,
    },

    // ── Competitor pressure (live multi-source density) ───────────────────
    competitorPressure: {
      density:             liveCD?.density             ?? 'unknown',
      rawCount500m:        liveCD?.rawCount500m        ?? 0,
      rawCount1km:         liveCD?.rawCount1km         ?? 0,
      weightedCount500m:   liveCD?.weightedCount500m   ?? 0,
      weightedCount1km:    liveCD?.weightedCount1km    ?? 0,
      avgConfidence:       liveCD?.avgConfidence       ?? 0,
      pressureFactor:      pressureFactor,
      revenueAdjusted:     pressureFactor < 1.0,
      adjustedDemandScore: adjustedDemandScore,
      sources:             liveCD?.sources             ?? [],
    },

    dataCompleteness: completeness,
    modelConfidence,

    // ── Trust layer (v3.2) ────────────────────────────────────────────────
    sectionConfidence,
    provenance,
    revenueRange,
    contradictions,
    verdictGateTriggered,

    // ── Agent coverage (v3.4) — pipeline-level data availability ─────────
    // Tells the UI and any downstream consumer which agents ran successfully.
    // Drives targeted "no data" states (e.g. "A3 failed → no demand score")
    // and is consumed by applyHardFailGates to block GO when critical agents fail.
    agentCoverage,

    meta: {
      engineVersion:    ENGINE_VERSION,
      benchmarkVersion: BENCHMARK_VERSION,
      computedAt:       computeLog.computedAt,
      computeLog,
    },
  }
}
