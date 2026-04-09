/**
 * lib/compute/client-calc.ts
 *
 * Shared client-side financial calculator.
 * Mirrors the formulas in lib/compute/engine.ts so that what-if sliders
 * and the pre-report calculator use THE SAME math as the engine.
 *
 * RULES:
 * - This file is safe for client import ('use client')
 * - NO Supabase, NO API calls — pure math only
 * - If the engine formula changes, update the constant here too
 * - The compute engine (engine.ts) is the authoritative source;
 *   this file is a READ-ONLY projection of those formulas for UI purposes
 */

// ── Client-safe benchmark subset ─────────────────────────────────────────────
// Duplicated (not imported) from benchmarks.ts because that file is server-only.
// Keep in sync with lib/compute/benchmarks.ts — update both when values change.

export interface ClientBenchmark {
  dailyCustomersBase: number
  avgTicketSize: number
  grossMarginPct: number
  staffCosts: number
  otherCostsPct: number
}

export const CLIENT_BENCHMARKS: Record<string, ClientBenchmark> = {
  cafe:       { dailyCustomersBase: 120, avgTicketSize: 18, grossMarginPct: 65, staffCosts: 18000, otherCostsPct: 0.12 },
  restaurant: { dailyCustomersBase:  80, avgTicketSize: 55, grossMarginPct: 68, staffCosts: 35000, otherCostsPct: 0.15 },
  bakery:     { dailyCustomersBase: 100, avgTicketSize: 22, grossMarginPct: 62, staffCosts: 15000, otherCostsPct: 0.10 },
  gym:        { dailyCustomersBase:  80, avgTicketSize: 65, grossMarginPct: 80, staffCosts: 22000, otherCostsPct: 0.08 },
  fitness:    { dailyCustomersBase:  80, avgTicketSize: 65, grossMarginPct: 80, staffCosts: 22000, otherCostsPct: 0.08 },
  salon:      { dailyCustomersBase:  18, avgTicketSize: 90, grossMarginPct: 70, staffCosts: 18000, otherCostsPct: 0.10 },
  retail:     { dailyCustomersBase:  40, avgTicketSize: 75, grossMarginPct: 55, staffCosts: 16000, otherCostsPct: 0.12 },
  bar:        { dailyCustomersBase:  80, avgTicketSize: 35, grossMarginPct: 72, staffCosts: 25000, otherCostsPct: 0.10 },
  takeaway:   { dailyCustomersBase: 140, avgTicketSize: 20, grossMarginPct: 60, staffCosts: 14000, otherCostsPct: 0.08 },
  pharmacy:   { dailyCustomersBase:  70, avgTicketSize: 55, grossMarginPct: 35, staffCosts: 20000, otherCostsPct: 0.08 },
  other:      { dailyCustomersBase:  60, avgTicketSize: 50, grossMarginPct: 60, staffCosts: 18000, otherCostsPct: 0.10 },
}

/**
 * Resolve a free-text business type to a benchmark key.
 * Mirrors lib/compute/benchmarks.ts resolveBizKey().
 */
export function resolveBizKey(businessType: string): string {
  const bt = (businessType ?? '').toLowerCase().replace(/[\s\/&-]+/g, ' ').trim()
  const keys = Object.keys(CLIENT_BENCHMARKS)
  return keys.find(k => bt.includes(k)) ?? 'other'
}

// ── What-if calculator ───────────────────────────────────────────────────────

export interface WhatIfInput {
  /** Business type (free text — will be resolved to benchmark key) */
  businessType: string
  /** Monthly rent in AUD */
  monthlyRent: number
  /** Average ticket size in AUD (user override or benchmark) */
  avgTicketSize?: number | null
  /** Daily customers (user override or benchmark) */
  dailyCustomers?: number | null
  /** Setup / fit-out budget — used to compute break-even months */
  setupBudget?: number | null
}

export interface WhatIfResult {
  dailyCustomers: number
  avgTicketSize: number
  monthlyRevenue: number
  grossMarginPct: number
  totalCosts: number
  costBreakdown: {
    rent: number
    staff: number
    cogs: number
    other: number
  }
  netProfit: number
  profitMarginPct: number
  rentToRevenuePct: number
  breakEvenDaily: number
  breakEvenMonths: number | null
  /** Setup budget is user-supplied; not computed here */
}

/**
 * Calculate financial projections using the SAME formula structure as
 * lib/compute/engine.ts — benchmark path (no agent data).
 *
 * Formula chain (mirrors engine.ts):
 *   revenue     = dailyCustomers × avgTicketSize × 30
 *   cogs        = revenue × (1 - grossMarginPct/100)
 *   otherCosts  = revenue × otherCostsPct
 *   totalCosts  = rent + staffCosts + cogs + otherCosts
 *   netProfit   = revenue - totalCosts     ← THE INVARIANT
 *   breakEvenDaily = totalCosts / (avgTicketSize × grossMarginPct/100 × 30)
 */
export function whatIfCalc(input: WhatIfInput): WhatIfResult {
  const bizKey = resolveBizKey(input.businessType)
  const bm = CLIENT_BENCHMARKS[bizKey] ?? CLIENT_BENCHMARKS['other']

  const dailyCustomers = input.dailyCustomers ?? bm.dailyCustomersBase
  const avgTicketSize  = input.avgTicketSize ?? bm.avgTicketSize
  const grossMarginPct = bm.grossMarginPct

  // Revenue = customers × ticket × 30 days (same as engine benchmark path)
  const monthlyRevenue = Math.round(dailyCustomers * avgTicketSize * 30)

  // Cost breakdown (same structure as engine lines 628–672)
  const rent       = input.monthlyRent
  const cogs       = Math.round(monthlyRevenue * (1 - grossMarginPct / 100))
  const otherCosts = Math.round(monthlyRevenue * bm.otherCostsPct)
  const staff      = bm.staffCosts
  const totalCosts = rent + staff + cogs + otherCosts

  // THE INVARIANT — netProfit = revenue - totalCosts
  const netProfit = monthlyRevenue - totalCosts

  const profitMarginPct = monthlyRevenue > 0
    ? Math.round((netProfit / monthlyRevenue) * 1000) / 10
    : 0

  const rentToRevenuePct = monthlyRevenue > 0
    ? Math.round((rent / monthlyRevenue) * 1000) / 10
    : 0

<<<<<<< HEAD
  // Break-even daily customers = totalCosts / (ticket × grossMargin × 30)
  const contributionPerCustomer = avgTicketSize * (grossMarginPct / 100)
  const breakEvenDaily = contributionPerCustomer > 0
    ? Math.ceil(totalCosts / (contributionPerCustomer * 30))
=======
  // Break-even daily customers — mirrors engine.ts lines 712-727 EXACTLY.
  // Uses FIXED costs only (staff + rent) in the numerator; variable costs
  // (COGS, other %) auto-adjust with volume so they don't belong here.
  // Contribution margin subtracts otherCostsPct from gross margin.
  //
  //   fixedCosts         = staffCosts + rent
  //   contributionMargin = avgTicket × max(0.01, grossMarginPct% - otherCostsPct)
  //   breakEvenDaily     = ceil(fixedCosts / (contributionMargin × 30))
  const fixedCostsOnly          = staff + rent
  const contributionPerCustomer = avgTicketSize * Math.max(0.01, (grossMarginPct / 100) - bm.otherCostsPct)
  const breakEvenDaily = contributionPerCustomer > 0
    ? Math.ceil(fixedCostsOnly / (contributionPerCustomer * 30))
>>>>>>> fix: break-even formula in client-calc + _beMonthly reads from engine
    : 0

  // Break-even months = setupBudget / netProfit (only if profitable + budget known)
  const breakEvenMonths: number | null =
    (input.setupBudget && input.setupBudget > 0 && netProfit > 0)
      ? Math.ceil(input.setupBudget / netProfit)
      : null

  return {
    dailyCustomers,
    avgTicketSize,
    monthlyRevenue,
    grossMarginPct,
    totalCosts,
    costBreakdown: { rent, staff, cogs, other: otherCosts },
    netProfit,
    profitMarginPct,
    rentToRevenuePct,
    breakEvenDaily,
    breakEvenMonths,
  }
}

/**
 * Calculate break-even months given a setup budget and monthly net profit.
 * Returns null if not profitable.
 */
export function breakEvenMonthsCalc(setupBudget: number, monthlyNetProfit: number): number | null {
  if (monthlyNetProfit <= 0 || setupBudget <= 0) return null
  return Math.ceil(setupBudget / monthlyNetProfit)
}

/**
 * Derive a composite score from individual dimensions.
 * Exactly mirrors engine.ts weights (lines 962–968):
 *   rent:0.20  competition:0.25  demand:0.20  profitability:0.25  location:0.10
 *
 * `location` defaults to 50 (neutral) when the what-if calculator has no
 * location signal — same neutral value the engine uses when A2 is unavailable.
 */
export function compositeScore(scores: {
  rent: number
  profitability: number
  competition: number
  demand: number
  location?: number
}): { overall: number; verdict: 'GO' | 'CAUTION' | 'NO' } {
  const loc = scores.location ?? 50  // neutral when no location data
  const overall = Math.round(
    scores.rent          * 0.20 +
    scores.competition   * 0.25 +
    scores.demand        * 0.20 +
    scores.profitability * 0.25 +
    loc                  * 0.10
  )
  const verdict = overall >= 70 ? 'GO' as const
    : overall >= 45 ? 'CAUTION' as const
    : 'NO' as const
  return { overall, verdict }
}

/**
 * Score rent affordability from rent-to-revenue ratio.
 * Exactly mirrors engine.ts scoreRent() — thresholds are percentages (e.g. 8 = 8%).
 */
export function scoreRent(rentPct: number): number {
  if (rentPct < 8)  return 95
  if (rentPct < 12) return 85
  if (rentPct < 18) return 70
  if (rentPct < 25) return 50
  if (rentPct < 35) return 30
  return 10
}

/**
 * Score profitability from monthly net profit.
 * Exactly mirrors engine.ts scoreProfitability().
 */
export function scoreProfitability(netProfit: number): number {
  if (netProfit > 15000) return 95
  if (netProfit > 8000)  return 85
  if (netProfit > 3000)  return 70
  if (netProfit > 1000)  return 55
  if (netProfit > 0)     return 40
  if (netProfit > -5000) return 25
  return 10
}
