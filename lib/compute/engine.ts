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
  ConfidenceLabel, CompetitorDataQuality,
} from '@/types/computed'
import {
  BIZ_BENCHMARKS, resolveBizKey, isValidCompetitor,
} from './benchmarks'
import { ComputeLogger, logComputeSummary } from './logger'

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
): {
  verdict:             VerdictValue
  verdictReasons:      string[]
  verdictConditions:   string[]
  verdictFailureModes: string[]
} {
  const rentPct = revenue > 0 ? (monthlyRent / revenue) : 1

  // ── Hard NO triggers ──────────────────────────────────────────────────────
  // Financial loss is always a hard NO regardless of viability score
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
  // Triggered by financial weakness OR low viability OR unknown data
  const isCaution =
    netProfit <= 0 ||
    scores.rent < 40 ||
    viabilityScore < 45 ||
    opportunityLevel === 'low' ||
    (compDataQuality === 'no_data' && scores.overall < 60)

  if (isCaution) {
    const reasons: string[] = []
    if (netProfit <= 0)
      reasons.push(`Projected net position is break-even or negative — margin is too thin for safe entry`)
    if (scores.competition < 35 || opportunityLevel === 'low')
      reasons.push(`${validCompCount} competitors detected (${strongCount} strong) — market is crowded within the search radius`)
    if (scores.rent < 40)
      reasons.push(`Rent at ${(rentPct * 100).toFixed(0)}% of revenue exceeds the 20% sustainable threshold`)
    if (scores.demand < 50)
      reasons.push(`Market demand indicators are below average for this suburb and business type`)
    if (viabilityScore < 45)
      reasons.push(`Location viability score of ${viabilityScore}/100 — market conditions are challenging`)
    if (compDataQuality === 'no_data' || compDataQuality === 'zero_warning')
      reasons.push(`Competitor data is incomplete — validate competition level on the ground before committing`)

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

  // ── Data quality caveat ───────────────────────────────────────────────────
  const compCaveat =
    compDataQuality === 'no_data'
      ? `Competitor data was unavailable — competition score is a neutral estimate; verify locally`
      : compDataQuality === 'zero_warning'
        ? `No competitors detected but coverage may be incomplete — confirm on the ground`
        : null

  // ── GO ────────────────────────────────────────────────────────────────────
  const goReasons: string[] = [
    `Projected net profit of ${fmt(netProfit)}/month supports a strong return on setup investment`,
    opportunityLevel === 'high'
      ? `High opportunity score — market is underserved with ${validCompCount} low-threat competitor(s) within radius`
      : `Location viability score of ${viabilityScore}/100 — competitive landscape has room for a quality operator`,
    `Rent at ${(rentPct * 100).toFixed(0)}% of revenue is within the sustainable 8–20% range`,
    scores.demand >= 65
      ? `Demand score of ${scores.demand}/100 indicates active customer intent in this area`
      : `Location score of ${scores.location}/100 — good footfall and access signals`,
  ]
  if (compCaveat) goReasons.push(compCaveat)

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
        return { channel: ch.channel, pct, monthly: round(revenue * pct / 100) }
      })
    }
  }

  // Fall back to benchmark channel labels with equal-ish split
  const labels = bm.revenueChannelLabels
  const splits: number[] = labels.length === 3 ? [60, 28, 12] : [50, 30, 20]
  return labels.map((label, i) => ({
    channel: label,
    pct:     splits[i] ?? Math.floor(100 / labels.length),
    monthly: round(revenue * (splits[i] ?? Math.floor(100 / labels.length)) / 100),
  }))
}

// ── Scenario builder ──────────────────────────────────────────────────────────

function buildScenarios(
  baseRevenue:    number,
  baseCosts:      number,
  dailyCustomers: number,
  avgTicket:      number,
): ComputedResult['scenarios'] {
  const worstRevenue = round(baseRevenue * 0.65)
  const bestRevenue  = round(baseRevenue * 1.40)
  const worstCosts   = round(baseCosts   * 1.05)
  const bestCosts    = round(baseCosts   * 0.95)

  const makeRow = (rev: number, costs: number, assumption: string): ScenarioRow => {
    const needed = avgTicket > 0
      ? Math.ceil(costs / (avgTicket * 0.70))   // ~70% gross margin assumption for break-even
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
  if (revenueSource === 'a5_live')        score += 35
  else if (revenueSource === 'a5_blended') score += 20
  else if (revenueSource === 'a4_fallback') score += 15
  // benchmark_default = 0

  // Cost source (max 25)
  if (costsSource === 'a4_live')          score += 25
  else if (costsSource === 'a4_blended')  score += 15
  // benchmark_default = 0

  // Competitor data quality (max 25)
  if (compDataQuality === 'live_verified') score += 25
  else if (compDataQuality === 'partial')  score += 12
  else if (compDataQuality === 'zero_warning') score += 8
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

  const { a1 = {}, a2 = {}, a3 = {}, a4 = {}, a5 = {} } =
    input.agentOutputs as Record<string, Record<string, any>>

  // ── STEP 1: Resolve revenue ──────────────────────────────────────────────

  // Benchmark baseline
  const bmRevenue = round(bm.dailyCustomersBase * bm.avgTicketSize * 30)

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
  const userTicket    = input.avgTicketSize
  const agentTicket   = parseMoney(a5?.avg_ticket_size ?? a4?.avg_ticket_size)
  const ticketDiff    = agentTicket != null ? Math.abs(agentTicket - userTicket) / userTicket : 1
  const avgTicketSize = ticketDiff < 0.30 ? (agentTicket ?? userTicket) : userTicket

  const dailyCustomers = avgTicketSize > 0
    ? round(revenue / avgTicketSize / 30)
    : bm.dailyCustomersBase

  // ── STEP 6: Break-even ───────────────────────────────────────────────────
  const grossMarginFraction = bm.grossMarginPct / 100
  const breakEvenDaily = avgTicketSize > 0 && grossMarginFraction > 0
    ? Math.ceil(totalCosts / (avgTicketSize * grossMarginFraction * 30))
    : 0

  const breakEvenMonths = netProfit > 0
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

  const validCompetitorCount: number = liveCD != null
    ? liveCD.weightedCount1km   // weighted, post-cluster — most reliable
    : a1CompetitorCount          // A1 agent fallback

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

  const scores: ComputedResult['scores'] = {
    overall:       clamp(scoreOverall, 0, 100),
    rent:          clamp(scoreRentV, 0, 100),
    competition:   clamp(scoreCompV, 0, 100),
    demand:        clamp(scoreDemandV, 0, 100),
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
    )

  // ── STEP 12: Revenue channels ────────────────────────────────────────────
  const revenueChannels = buildRevenueChannels(bizKey, revenue, a5)

  // ── STEP 13: Scenarios & projection ──────────────────────────────────────
  const scenarios = buildScenarios(revenue, totalCosts, dailyCustomers, avgTicketSize)

  const projection = {
    year1: round(netProfit * 12),
    year2: round(netProfit * 12 * 1.08),   // 8% growth assumption
    year3: round(netProfit * 12 * 1.08 * 1.10),  // 10% growth in yr3
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

    verdict,
    verdictReasons,
    verdictConditions,
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

    meta: {
      engineVersion:    ENGINE_VERSION,
      benchmarkVersion: BENCHMARK_VERSION,
      computedAt:       computeLog.computedAt,
      computeLog,
    },
  }
}
