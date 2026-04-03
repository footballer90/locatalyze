/**
 * lib/compute/logger.ts
 *
 * Structured logging for the compute engine.
 * Records: revenue source, cost source, rejected values, blend weights,
 * competitor data quality, and timing.
 * Written to Supabase compute_log column and stdout for Vercel log drain.
 */

import type { ComputeLog, RejectedValue, CompetitorDataQuality } from '@/types/computed'
import { ENGINE_VERSION, BENCHMARK_VERSION } from '@/types/computed'

// ── Mutable builder used inside computeEngine() ───────────────────────────────

export class ComputeLogger {
  private startMs = Date.now()
  private log: Partial<ComputeLog> = {
    rejectedValues:           [],
    engineVersion:            ENGINE_VERSION,
    benchmarkVersion:         BENCHMARK_VERSION,
    revenueBlendWeight:       0,
    costsBlendWeight:         0,
    revenueDiffPct:           null,
    costsDiffPct:             null,
    agentRevenueRaw:          null,
    agentCostsRaw:            null,
    rawCompetitorCount:       0,
    validatedCompetitorCount: 0,
    competitorDataQuality:    'no_data',
  }

  setRevenueSource(
    source: ComputeLog['revenueSource'],
    agentRaw:  number | null,
    benchmark: number,
    diffPct:   number | null,
    weight:    number,
  ) {
    this.log.revenueSource      = source
    this.log.agentRevenueRaw    = agentRaw
    this.log.benchmarkRevenue   = benchmark
    this.log.revenueDiffPct     = diffPct !== null ? Math.round(diffPct * 100) / 100 : null
    this.log.revenueBlendWeight = weight
  }

  setCostsSource(
    source: ComputeLog['costsSource'],
    agentRaw:  number | null,
    benchmark: number,
    diffPct:   number | null,
    weight:    number,
  ) {
    this.log.costsSource       = source
    this.log.agentCostsRaw     = agentRaw
    this.log.benchmarkCosts    = benchmark
    this.log.costsDiffPct      = diffPct !== null ? Math.round(diffPct * 100) / 100 : null
    this.log.costsBlendWeight  = weight
  }

  setCompetitorMeta(
    rawCount:       number,
    validatedCount: number,
    quality:        CompetitorDataQuality,
  ) {
    this.log.rawCompetitorCount       = rawCount
    this.log.validatedCompetitorCount = validatedCount
    this.log.competitorDataQuality    = quality
  }

  rejectValue(field: string, agentValue: number, reason: string) {
    const entry: RejectedValue = { field, agentValue, reason }
    ;(this.log.rejectedValues as RejectedValue[]).push(entry)
    console.warn(`[computeEngine] REJECTED ${field}=${agentValue}: ${reason}`)
  }

  /** Call this at the end of computeEngine() to seal the log */
  seal(): ComputeLog {
    const now = new Date().toISOString()
    return {
      revenueSource:            this.log.revenueSource            ?? 'benchmark_default',
      costsSource:              this.log.costsSource              ?? 'benchmark_default',
      agentRevenueRaw:          this.log.agentRevenueRaw          ?? null,
      agentCostsRaw:            this.log.agentCostsRaw            ?? null,
      benchmarkRevenue:         this.log.benchmarkRevenue         ?? 0,
      benchmarkCosts:           this.log.benchmarkCosts           ?? 0,
      revenueDiffPct:           this.log.revenueDiffPct           ?? null,
      costsDiffPct:             this.log.costsDiffPct             ?? null,
      revenueBlendWeight:       this.log.revenueBlendWeight       ?? 0,
      costsBlendWeight:         this.log.costsBlendWeight         ?? 0,
      rejectedValues:           this.log.rejectedValues           ?? [],
      rawCompetitorCount:       this.log.rawCompetitorCount       ?? 0,
      validatedCompetitorCount: this.log.validatedCompetitorCount ?? 0,
      competitorDataQuality:    this.log.competitorDataQuality    ?? 'no_data',
      computeTimeMs:            Date.now() - this.startMs,
      engineVersion:            ENGINE_VERSION,
      benchmarkVersion:         BENCHMARK_VERSION,
      computedAt:               now,
    }
  }
}

/** Print a summary of the compute result to stdout (Vercel logs) */
export function logComputeSummary(
  reportId:  string,
  bizType:   string,
  area:      string,
  log:       ComputeLog,
  netProfit: number,
) {
  const status = log.rejectedValues.length > 0
    ? `${log.rejectedValues.length} value(s) rejected`
    : 'all values accepted'

  console.log(JSON.stringify({
    event:                    'compute_complete',
    reportId,
    bizType,
    area,
    engineVersion:            log.engineVersion,
    revenueSource:            log.revenueSource,
    costsSource:              log.costsSource,
    netProfit,
    revenueDiffPct:           log.revenueDiffPct,
    costsDiffPct:             log.costsDiffPct,
    blendRevenue:             log.revenueBlendWeight,
    blendCosts:               log.costsBlendWeight,
    rejected:                 log.rejectedValues,
    agentStatus:              status,
    rawCompetitorCount:       log.rawCompetitorCount,
    validatedCompetitorCount: log.validatedCompetitorCount,
    competitorDataQuality:    log.competitorDataQuality,
    computeTimeMs:            log.computeTimeMs,
    computedAt:               log.computedAt,
  }))
}
