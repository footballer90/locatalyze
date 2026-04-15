/**
 * lib/compute/validation.ts
 *
 * TRUST LAYER — runs after computeEngine() to:
 *
 * 1. Detect contradictions:
 *    - High competitor count + "low saturation" claim
 *    - Declining demand + GO verdict
 *    - benchmark_default confidence + strong financial claims
 *    - low data completeness + high-confidence verdict
 *    - No competitor data + "blue ocean" saturation label
 *
 * 2. Build per-section confidence breakdown (not just one global score):
 *    financials, competition, demand, location — each with score + gaps
 *
 * 3. Enforce hard fail gates:
 *    - completeness < 25 → force CAUTION, never GO
 *    - netProfit < 0 → force NO (should already be handled but guard here)
 *    - declining demand + GO → force CAUTION
 *    - no competitor data + GO → downgrade to CAUTION
 *
 * 4. Produce an honest revenue range with uncertainty bounds.
 *
 * This file is PURE — no HTTP calls, no DB writes, no side effects.
 */

import type {
  ComputedResult,
  ComputeInput,
  ContradictionWarning,
  SectionConfidence,
  DataProvenance,
  RevenueRange,
  VerdictValue,
} from '@/types/computed'

// ── Contradiction detection ────────────────────────────────────────────────────

/**
 * Run all contradiction checks on a sealed ComputedResult.
 * Returns an array of warnings (may be empty — that's the happy path).
 */
export function detectContradictions(result: ComputedResult): ContradictionWarning[] {
  const warnings: ContradictionWarning[] = []
  const {
    validCompetitorCount, marketSignals, marketIntelligence,
    scores, verdict, netProfit, dataCompleteness,
    competitorDataQuality, modelConfidence,
  } = result

  // ── C1: High competitor count vs low saturation claim ────────────────────
  if (
    validCompetitorCount > 8 &&
    (marketSignals.saturationLabel === 'low' || marketIntelligence.saturationBand === 'low')
  ) {
    warnings.push({
      field: 'saturation_vs_competitors',
      reason: `${validCompetitorCount} competitors found but saturation is labelled "low" — the market appears more contested than indicated`,
      severity: 'warning',
      affectedSections: ['competition', 'market'],
    })
  }

  // ── C2: Declining demand + GO verdict ─────────────────────────────────────
  if (verdict === 'GO' && marketSignals.demandTrend === 'declining') {
    warnings.push({
      field: 'demand_vs_verdict',
      reason: 'Market demand trend is declining — a GO verdict under declining demand requires exceptional competitive positioning',
      severity: 'error',
      affectedSections: ['market', 'verdict'],
    })
  }

  // ── C3: Benchmark-only confidence + GO verdict ────────────────────────────
  if (verdict === 'GO' && modelConfidence === 'benchmark_default') {
    warnings.push({
      field: 'confidence_vs_verdict',
      reason: 'GO verdict is based entirely on benchmark estimates — no live revenue, cost, or market data was available to validate this outcome',
      severity: 'error',
      affectedSections: ['financials', 'verdict'],
    })
  }

  // ── C4: No competitor data + strong opportunity claim ─────────────────────
  if (
    competitorDataQuality === 'no_data' &&
    (marketIntelligence.opportunityLevel === 'high' || marketIntelligence.saturationBand === 'low')
  ) {
    warnings.push({
      field: 'competitor_data_vs_opportunity',
      reason: 'Opportunity is rated high but competitor data is unavailable — this cannot be verified without live market data',
      severity: 'warning',
      affectedSections: ['competition'],
    })
  }

  // ── C5: Strong competitor count + high opportunity level ─────────────────
  if (
    marketIntelligence.strongCount >= 4 &&
    marketIntelligence.opportunityLevel === 'high'
  ) {
    warnings.push({
      field: 'strong_competitors_vs_opportunity',
      reason: `${marketIntelligence.strongCount} dominant operators nearby — market opportunity cannot be "high" with this level of established competition`,
      severity: 'warning',
      affectedSections: ['competition'],
    })
  }

  // ── C6: Low data completeness + GO verdict ────────────────────────────────
  if (verdict === 'GO' && dataCompleteness < 30) {
    warnings.push({
      field: 'completeness_vs_verdict',
      reason: `Data completeness is ${dataCompleteness}% — a GO verdict requires at least 30% live data to be reliable`,
      severity: 'error',
      affectedSections: ['verdict'],
    })
  }

  // ── C7: Demand score null + demand-reliant GO reasons ────────────────────
  if (
    marketSignals.demandScore == null &&
    verdict === 'GO' &&
    result.verdictReasons.some(r => r.toLowerCase().includes('demand'))
  ) {
    warnings.push({
      field: 'demand_data_missing',
      reason: 'Verdict cites demand strength but no market demand data was available — demand claim is inferred from benchmark only',
      severity: 'warning',
      affectedSections: ['market', 'verdict'],
    })
  }

  // ── C8: Negative net profit in scenarios while presenting GO ──────────────
  if (
    verdict === 'GO' &&
    result.scenarios.worst.monthly_profit < -10000
  ) {
    warnings.push({
      field: 'worst_scenario_vs_verdict',
      reason: `Worst-case scenario shows ${formatMoney(result.scenarios.worst.monthly_profit)}/month — significant downside risk exists even for a GO rating`,
      severity: 'warning',
      affectedSections: ['financials'],
    })
  }

  // ── C9: Projected customers far below break-even but verdict is not NO ────
  // This fires AFTER deriveVerdict() — if the engine already returned NO for
  // this reason, this check is redundant but harmless. It catches edge cases
  // where the verdict slipped through without the customer gap being flagged.
  const { dailyCustomers, breakEvenDaily } = result
  if (
    breakEvenDaily > 0 &&
    dailyCustomers > 0 &&
    dailyCustomers < breakEvenDaily * 0.70 &&
    result.netProfit < 0 &&
    verdict !== 'NO'
  ) {
    const gapPct = Math.round((1 - dailyCustomers / breakEvenDaily) * 100)
    warnings.push({
      field: 'customer_volume_vs_breakeven',
      reason: `Projected ${dailyCustomers} customers/day is ${gapPct}% below the ${breakEvenDaily}/day break-even — this is a structural gap, not a marginal one. Verdict should be reviewed.`,
      severity: 'error',
      affectedSections: ['financials', 'verdict'],
    })
  }

  // ── C10: Demand claimed when A3 data is missing ────────────────────────────
  // If no demand score AND no trend, but verdict reasons mention "demand" positively,
  // flag as potentially misleading inference.
  if (
    marketSignals.demandScore == null &&
    marketSignals.demandTrend == null &&
    result.verdictReasons.some(r =>
      r.toLowerCase().includes('demand') &&
      !r.toLowerCase().includes('unavailable') &&
      !r.toLowerCase().includes('incomplete') &&
      !r.toLowerCase().includes('missing')
    )
  ) {
    warnings.push({
      field: 'demand_inference_without_data',
      reason: 'Verdict references demand conditions but no A3 market data was available — demand signals are inferred from benchmarks only and may not reflect local conditions',
      severity: 'warning',
      affectedSections: ['market', 'verdict'],
    })
  }

  // ── C11: Payback period exceeds first lease term ─────────────────────────
  // Most Australian small business leases are 3+3 years. If break-even in months
  // exceeds 36, the business will not recoup its setup cost within the first term.
  // This is a capital risk signal regardless of the GO/CAUTION verdict.
  if (result.breakEvenMonths != null && result.breakEvenMonths > 36) {
    warnings.push({
      field: 'payback_exceeds_lease_term',
      reason: `Payback period of ${result.breakEvenMonths} months exceeds 36 months — the business may not recoup setup costs within the first lease term. Lease renewal risk is significant.`,
      severity: 'warning',
      affectedSections: ['financials'],
    })
  }

  // ── C12: Projected monthly profit too thin to sustain ramp-up ────────────
  // A typical café/restaurant takes 3–6 months to reach full volume.
  // If net profit is positive but less than $2,000/month, working capital will
  // be exhausted during ramp-up unless the setup budget is very large.
  // Threshold: netProfit > 0 && netProfit < 2000 is a false-positive GO signal.
  if (
    result.netProfit > 0 &&
    result.netProfit < 2000 &&
    verdict === 'GO'
  ) {
    warnings.push({
      field: 'thin_margin_go_verdict',
      reason: `GO verdict with net profit of ${formatMoney(result.netProfit)}/month — this margin is too thin to absorb the typical 3–6 month ramp-up period. Any revenue shortfall or unexpected cost will push to loss.`,
      severity: 'warning',
      affectedSections: ['financials', 'verdict'],
    })
  }

  return warnings
}

// ── Hard fail gates ────────────────────────────────────────────────────────────

/**
 * Apply hard overrides that cannot be bypassed.
 * Returns potentially modified verdict + updated verdictReasons.
 *
 * STRICT DATA RELIABILITY MODE — rules in priority order:
 *   1. benchmark_default confidence + GO → force CAUTION
 *      (all financial outputs are industry averages, not this-location data)
 *   2. completeness ≤ 45 + GO → force CAUTION
 *      (raised from < 25 — at least 45% live data is required for a GO verdict)
 *   3. declining demand + GO → force CAUTION
 *   4. no_data OR zero_warning competitors + GO → force CAUTION
 *      (unknown competition cannot support a GO verdict at any completeness level)
 */
export function applyHardFailGates(
  verdict: VerdictValue,
  verdictReasons: string[],
  verdictConditions: string[],
  result: {
    dataCompleteness: number
    modelConfidence: string
    competitorDataQuality: string
    marketSignals: { demandTrend: string | null }
    netProfit: number
    /** Revenue source from computeEngine — used to block GO when revenue is benchmark-derived */
    revenueSource?: string
    /** Agent coverage — used to block GO when critical agents (A2, A3) both failed */
    agentCoverage?: { a1: boolean; a2: boolean; a3: boolean; a4: boolean; a5: boolean }
  }
): {
  verdict: VerdictValue
  verdictReasons: string[]
  verdictConditions: string[]
  gateTriggered: string | null
} {
  if (verdict !== 'GO') {
    return { verdict, verdictReasons, verdictConditions, gateTriggered: null }
  }

  // ── Gate 0: Benchmark revenue source ─────────────────────────────────────
  //
  // Revenue is the single most important financial metric in the report.
  // When A5 returned no data, revenue is an industry-average for this business
  // TYPE, not a real market observation for this specific LOCATION.
  //
  // STRICT: A GO verdict means "this specific location is viable." That claim
  // requires real local revenue data. A benchmark revenue figure says:
  //   "A café in Australia typically does $X/month" — not "this café at this
  //   address in Darwin will do $X/month."
  //
  // This gate is separate from Gate 1 (modelConfidence === 'benchmark_default')
  // because it is possible to have: revenueSource=benchmark_default + competitor
  // data + A4 cost data → modelConfidence='medium' (50 pts) → Gate 1 doesn't fire.
  // But without real revenue, the GO verdict cannot be trusted.
  //
  // Previous behaviour: Darwin restaurant showed GO with 0% real revenue data.
  // Fix: this gate unconditionally blocks GO when revenue is benchmark-derived.
  if (result.revenueSource === 'benchmark_default') {
    return {
      verdict: 'CAUTION',
      verdictReasons: [
        'Revenue projections are estimated from industry benchmarks — no live market data is available for this specific location. A GO verdict requires a real local revenue signal.',
        ...verdictReasons.slice(0, 3),
      ],
      verdictConditions: [
        'Validate revenue potential against 3+ comparable businesses in the same suburb before committing to a lease',
        'Obtain actual trading data (e.g. from a broker, franchise disclosure, or comparable sale) before treating financial projections as reliable',
        ...verdictConditions.slice(0, 1),
      ],
      gateTriggered: 'benchmark_revenue_only',
    }
  }

  // ── Gate 0b: Both A2 and A3 missing ──────────────────────────────────────
  //
  // A2 provides location signals (footfall, transit, rent) and A3 provides
  // market demand signals. When BOTH are absent, the report has no real local
  // intelligence — only competitor headcount and benchmark financials.
  // This is insufficient for a positive location recommendation.
  if (
    result.agentCoverage != null &&
    !result.agentCoverage.a2 &&
    !result.agentCoverage.a3
  ) {
    return {
      verdict: 'CAUTION',
      verdictReasons: [
        'Location and market demand data could not be retrieved — both the location analysis (A2) and market research (A3) agents failed to return usable data for this address',
        ...verdictReasons.slice(0, 3),
      ],
      verdictConditions: [
        'Conduct on-ground verification: visit the location at peak and off-peak hours to assess footfall and demand',
        'Research the local market independently — check ABS data, local council plans, and competitor activity for this suburb',
        ...verdictConditions.slice(0, 1),
      ],
      gateTriggered: 'missing_location_and_demand_data',
    }
  }

  // Gate 1: Benchmark-only confidence — all financials are industry averages
  if (result.modelConfidence === 'benchmark_default') {
    return {
      verdict: 'CAUTION',
      verdictReasons: [
        'Financial projections are based entirely on industry benchmarks — no live revenue or cost data was available for this location',
        ...verdictReasons.slice(0, 3),
      ],
      verdictConditions: [
        'Validate actual rent-to-revenue ratio against 3 comparable businesses in the same suburb before committing',
        'Obtain real comparable sales data before treating financial projections as reliable',
        ...verdictConditions.slice(0, 1),
      ],
      gateTriggered: 'benchmark_default_confidence',
    }
  }

  // Gate 2: Insufficient data completeness (STRICT: > 45% required for GO)
  // Raised from < 25 — reports at 26–45% completeness have too little live signal
  // to issue a definitive GO recommendation. Boundary is inclusive (≤ 45, not < 46).
  if (result.dataCompleteness <= 45) {
    return {
      verdict: 'CAUTION',
      verdictReasons: [
        `Data completeness is ${result.dataCompleteness}% — a minimum of 46% live data is required for a GO verdict. Too many inputs were estimated from benchmarks.`,
        ...verdictReasons.slice(0, 3),
      ],
      verdictConditions: [
        'Conduct on-ground validation: visit the location on weekday and weekend peak hours',
        'Verify competitor count directly — data coverage may be incomplete for this area',
        ...verdictConditions.slice(0, 1),
      ],
      gateTriggered: 'insufficient_data_completeness',
    }
  }

  // Gate 3: Declining demand
  if (result.marketSignals.demandTrend === 'declining') {
    return {
      verdict: 'CAUTION',
      verdictReasons: [
        'Market demand trend is declining — entering a contracting market requires a strong differentiation strategy',
        ...verdictReasons.slice(0, 3),
      ],
      verdictConditions: [
        'Identify a specific customer segment that is growing within the declining overall market',
        ...verdictConditions.slice(0, 2),
      ],
      gateTriggered: 'declining_demand',
    }
  }

  // Gate 4: Unknown competitor landscape — both no_data AND zero_warning blocked
  // Previous logic: no_data + completeness < 40 (boundary flaw — 40 slipped through)
  // STRICT: If we do not have confirmed competitor intelligence, GO is not permitted.
  // zero_warning means search ran and found nothing — that is UNVERIFIED ABSENCE, not
  // confirmed blue ocean. The risk of a false GO here is worse than a false CAUTION.
  if (
    result.competitorDataQuality === 'no_data' ||
    result.competitorDataQuality === 'zero_warning'
  ) {
    const isNoData      = result.competitorDataQuality === 'no_data'
    const primaryReason = isNoData
      ? 'Competitor data is unavailable — competition level at this address is unknown and cannot support a GO verdict'
      : 'No competitors were detected but the result is unverified — the search may have returned empty due to a data source failure, not genuine absence of competition'
    return {
      verdict: 'CAUTION',
      verdictReasons: [
        primaryReason,
        ...verdictReasons.slice(0, 3),
      ],
      verdictConditions: [
        'Visit the location and manually count competitors within 500m before making any financial commitment',
        'Search Google Maps for this business type near this address and compare against the report',
        ...verdictConditions.slice(0, 1),
      ],
      gateTriggered: isNoData ? 'no_competitor_data' : 'zero_warning_competitor_data',
    }
  }

  return { verdict, verdictReasons, verdictConditions, gateTriggered: null }
}

// ── Section-level confidence breakdown ────────────────────────────────────────

/**
 * Build a per-section confidence breakdown for display in the UI.
 * Each section shows a score (0-100), label, and specific gap explanations.
 */
export function buildSectionConfidence(
  result: ComputedResult,
  input: ComputeInput,
): SectionConfidence {
  const { meta, competitorDataQuality, marketSignals, locationSignals } = result
  const { computeLog } = meta

  // ── Financials section ────────────────────────────────────────────────────
  const financialGaps: string[] = []
  let financialScore = 100

  if (computeLog.revenueSource === 'benchmark_default') {
    financialScore -= 55
    financialGaps.push('Revenue estimated from industry benchmarks — no agent or user data available')
  } else if (computeLog.revenueSource === 'a4_fallback') {
    financialScore -= 25
    financialGaps.push('Revenue from A4 cost model estimate — A5 market data was unavailable')
  } else if (computeLog.revenueSource === 'a5_blended') {
    financialScore -= 10
    financialGaps.push('Revenue blended with benchmarks — agent estimate diverged by more than 25%')
  }

  if (computeLog.costsSource === 'benchmark_default') {
    financialScore -= 30
    financialGaps.push('Cost structure estimated from business-type benchmarks — no detailed cost breakdown available')
  } else if (computeLog.costsSource === 'a4_blended') {
    financialScore -= 10
    financialGaps.push('Costs blended with benchmarks — agent cost estimate diverged significantly')
  }

  // Use the explicit isEstimated flags set by /api/compute rather than checking for
  // zero values. The compute route always fills avgTicketSize and setupBudget from
  // benchmarks, so checking `<= 0` here is always false (dead code).
  if (input.avgTicketSizeIsEstimated || input.setupBudgetIsEstimated) {
    financialScore -= 15
    const missing: string[] = []
    if (input.avgTicketSizeIsEstimated) missing.push('Average ticket size')
    if (input.setupBudgetIsEstimated)   missing.push('Setup budget')
    financialGaps.push(`${missing.join(' and ')} estimated from industry benchmarks — not provided by user`)
  }

  financialScore = clamp(financialScore, 0, 100)

  // ── Competition section ───────────────────────────────────────────────────
  const competitionGaps: string[] = []
  let competitionScore = 100

  if (competitorDataQuality === 'no_data') {
    competitionScore -= 80
    competitionGaps.push('Competitor data is unavailable — competition analysis is not possible from current data sources')
  } else if (competitorDataQuality === 'zero_warning') {
    competitionScore -= 40
    competitionGaps.push('No competitors detected but search coverage may be incomplete for this area')
  } else if (competitorDataQuality === 'partial') {
    competitionScore -= 20
    competitionGaps.push('Limited competitor data — fewer than 3 results were returned from live sources')
  }

  if ((result.competitorPressure.avgConfidence ?? 1) < 0.6 && result.competitorPressure.sources.length > 0) {
    competitionScore -= 15
    competitionGaps.push('Competitor data is primarily from OpenStreetMap (lower accuracy) — Google Places data was unavailable')
  }

  competitionScore = clamp(competitionScore, 0, 100)

  // ── Demand / Market section ───────────────────────────────────────────────
  const demandGaps: string[] = []
  let demandScore = 100

  if (marketSignals.demandScore == null) {
    demandScore -= 60
    demandGaps.push('Market demand data (A3) unavailable — demand score is inferred from competitor density proxy')
  }

  if (marketSignals.demandTrend == null) {
    demandScore -= 20
    demandGaps.push('Demand trend direction unknown — cannot determine if market is growing or declining')
  }

  if (marketSignals.saturationLabel == null) {
    demandScore -= 15
    demandGaps.push('Market saturation label unavailable — inferred from competitor count only')
  }

  demandScore = clamp(demandScore, 0, 100)

  // ── Location section ──────────────────────────────────────────────────────
  const locationGaps: string[] = []
  let locationSectionScore = 100

  if (!locationSignals.footfallSignal) {
    locationSectionScore -= 25
    locationGaps.push('Footfall data unavailable — foot traffic level could not be estimated for this location')
  }

  if (!locationSignals.transitSignal) {
    locationSectionScore -= 20
    locationGaps.push('Transit accessibility data unavailable — public transport access was not assessed')
  }

  if (locationSignals.nearbyAnchors.length === 0) {
    locationSectionScore -= 10
    locationGaps.push('No major anchor tenants detected nearby — foot traffic may be self-generated rather than pass-by')
  }

  if (!locationSignals.medianRent) {
    locationSectionScore -= 15
    locationGaps.push('Area median rent data unavailable — cannot benchmark your rent against market rates')
  }

  locationSectionScore = clamp(locationSectionScore, 0, 100)

  return {
    financials: {
      score: financialScore,
      label: confidenceLabel(financialScore),
      gaps: financialGaps,
    },
    competition: {
      score: competitionScore,
      label: confidenceLabel(competitionScore),
      gaps: competitionGaps,
    },
    demand: {
      score: demandScore,
      label: confidenceLabel(demandScore),
      gaps: demandGaps,
    },
    location: {
      score: locationSectionScore,
      label: confidenceLabel(locationSectionScore),
      gaps: locationGaps,
    },
  }
}

// ── Per-metric provenance map ──────────────────────────────────────────────────

/**
 * Build a map of data provenance for key metrics.
 * Each entry explains where the value came from and how much to trust it.
 */
export function buildProvenance(
  result: ComputedResult,
  input: ComputeInput,
): Record<string, DataProvenance> {
  const log = result.meta.computeLog

  return {
    revenue: {
      source:      provenanceSource(log.revenueSource),
      sourceLabel: provenanceLabel(log.revenueSource),
      confidence:  provenanceConfidence(log.revenueSource),
      isBenchmark: log.revenueSource === 'benchmark_default',
      note:        log.revenueSource === 'benchmark_default'
        ? `Estimated from ${input.businessType} industry benchmarks (AU average). Actual revenue will vary.`
        : log.revenueSource === 'a4_fallback'
          ? 'Revenue derived from agent cost model. Market demand data was unavailable.'
          : log.revenueSource === 'a5_blended'
            ? `Agent estimate blended with benchmarks (diff: ${log.revenueDiffPct != null ? Math.round(log.revenueDiffPct * 100) + '%' : 'unknown'}).`
            : 'Based on market analysis data.',
    },
    costs: {
      source:      provenanceSource(log.costsSource),
      sourceLabel: provenanceLabel(log.costsSource),
      confidence:  provenanceConfidence(log.costsSource),
      isBenchmark: log.costsSource === 'benchmark_default',
      note:        log.costsSource === 'benchmark_default'
        ? `Cost structure estimated from ${input.businessType} benchmarks. Actual costs vary by fitout quality, staff experience, and supplier contracts.`
        : 'Based on detailed cost breakdown from analysis.',
    },
    competitors: {
      source: result.competitorDataQuality === 'live_verified'
        ? (result.competitorPressure.sources.includes('google') ? 'Google Places API (live)' : 'Live APIs')
        : result.competitorDataQuality === 'no_data'
          ? 'Unavailable'
          : 'Partial live data',
      sourceLabel: competitorSourceLabel(result.competitorDataQuality, result.competitorPressure.sources),
      confidence:  competitorConfidenceScore(result.competitorDataQuality, result.competitorPressure.avgConfidence ?? 0),
      isBenchmark: false,
      note:        competitorNote(result.competitorDataQuality, result.validCompetitorCount, result.competitorPressure),
    },
    demandScore: {
      source:      result.marketSignals.demandScore != null ? 'Market analysis (A3 agent)' : 'Competitor density proxy',
      sourceLabel: result.marketSignals.demandScore != null ? 'Market Research' : 'Estimated',
      confidence:  result.marketSignals.demandScore != null ? 65 : 30,
      isBenchmark: result.marketSignals.demandScore == null,
      note:        result.marketSignals.demandScore != null
        ? 'Based on search trend analysis and market demand signals for this business type and suburb.'
        : 'Demand score estimated from competitor density — no direct market demand data was available.',
    },
    rent: {
      source:      'User input',
      sourceLabel: 'Verified Input',
      confidence:  100,
      isBenchmark: false,
      note:        'Provided directly at analysis time. This is the actual rent figure for the location.',
    },
    avgTicketSize: {
      source:      input.avgTicketSize > 0 ? 'User input' : 'Benchmark estimate',
      sourceLabel: input.avgTicketSize > 0 ? 'Verified Input' : 'Estimated',
      confidence:  input.avgTicketSize > 0 ? 95 : 40,
      isBenchmark: input.avgTicketSize <= 0,
      note:        input.avgTicketSize > 0
        ? 'Provided at analysis time. Drives revenue calculation directly.'
        : `Estimated from ${input.businessType} industry data. Actual average ticket depends on pricing strategy and product mix.`,
    },
  }
}

// ── Honest revenue range (uncertainty bounds) ──────────────────────────────────

/**
 * Compute an honest revenue range based on data confidence.
 * Instead of showing "$47,200/month" (false precision), show "$35k–$55k".
 *
 * Uncertainty bands:
 *   benchmark_default:  ±40%  (very wide — pure estimate)
 *   low:                ±30%
 *   medium:             ±20%
 *   high:               ±10%
 */
export function buildRevenueRange(
  revenue: number,
  modelConfidence: string,
  revenueSource: string,
): RevenueRange {
  const uncertainty =
    modelConfidence === 'benchmark_default' ? 0.40
    : modelConfidence === 'low'            ? 0.30
    : modelConfidence === 'medium'         ? 0.20
    : 0.10   // high

  return {
    low:         Math.round(revenue * (1 - uncertainty)),
    mid:         revenue,
    high:        Math.round(revenue * (1 + uncertainty)),
    uncertainty: Math.round(uncertainty * 100),   // as percentage
    source:      revenueSource,
    note:        `±${Math.round(uncertainty * 100)}% uncertainty based on ${modelConfidence === 'benchmark_default' ? 'benchmark-only estimates' : `${modelConfidence} data confidence`}`,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function confidenceLabel(score: number): 'high' | 'medium' | 'low' | 'insufficient' {
  if (score >= 70) return 'high'
  if (score >= 45) return 'medium'
  if (score >= 20) return 'low'
  return 'insufficient'
}

function provenanceSource(logSource: string): string {
  switch (logSource) {
    case 'a5_live':          return 'Market analysis (A5 agent, unblended)'
    case 'a5_blended':       return 'Market analysis + benchmark blend (A5 agent)'
    case 'a4_fallback':      return 'Cost model estimate (A4 agent fallback)'
    case 'benchmark_default': return `Industry benchmark (AU average)`
    case 'a4_live':          return 'Detailed cost analysis (A4 agent, unblended)'
    case 'a4_blended':       return 'Cost analysis + benchmark blend (A4 agent)'
    default: return logSource
  }
}

function provenanceLabel(logSource: string): string {
  switch (logSource) {
    case 'a5_live':           return 'Live Market Data'
    case 'a5_blended':        return 'Market Data + Benchmark'
    case 'a4_fallback':       return 'Cost Model Estimate'
    case 'benchmark_default': return 'Benchmark Estimate'
    case 'a4_live':           return 'Live Cost Data'
    case 'a4_blended':        return 'Cost Data + Benchmark'
    default: return 'Estimated'
  }
}

function provenanceConfidence(logSource: string): number {
  switch (logSource) {
    case 'a5_live':           return 85
    case 'a5_blended':        return 65
    case 'a4_fallback':       return 45
    case 'benchmark_default': return 20
    case 'a4_live':           return 80
    case 'a4_blended':        return 60
    default: return 25
  }
}

function competitorSourceLabel(dq: string, sources: string[]): string {
  if (dq === 'no_data')      return 'Data Unavailable'
  if (dq === 'zero_warning') return 'Unverified (0 found)'
  if (dq === 'partial')      return 'Partial Data'
  if (sources.includes('google')) return 'Google Verified'
  if (sources.includes('foursquare')) return 'Foursquare Verified'
  return 'OSM Data'
}

function competitorConfidenceScore(dq: string, avgConf: number): number {
  if (dq === 'no_data')      return 0
  if (dq === 'zero_warning') return 20
  if (dq === 'partial')      return 45
  // live_verified: scale by avgConfidence (Google=1.0, OSM=0.6)
  return Math.round(avgConf * 95)
}

function competitorNote(
  dq: string,
  count: number,
  pressure: ComputedResult['competitorPressure'],
): string {
  if (dq === 'no_data') {
    return 'No competitor data was returned by any source. Competition level is unknown — validate on-ground before committing.'
  }
  if (dq === 'zero_warning') {
    return `No competitors found but search coverage may be incomplete. ${pressure.sources.length > 0 ? 'Sources: ' + pressure.sources.join(', ') + '.' : ''} Verify locally.`
  }
  if (dq === 'partial') {
    return `Limited competitor data — ${count} competitor(s) found from partial coverage. Actual competition may be higher.`
  }
  const sourceList = pressure.sources.join(', ') || 'live APIs'
  const confidencePct = Math.round((pressure.avgConfidence ?? 0) * 100)
  return `${count} competitor(s) found from ${sourceList} (${confidencePct}% data confidence). Confidence-weighted count used for scoring.`
}

function formatMoney(n: number): string {
  return (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-AU')
}
