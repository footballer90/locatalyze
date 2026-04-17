// lib/viability-calc.ts
// Deterministic viability scoring for the free public checker.
// Uses the same suburb demand data that powers the full paid report,
// so preview numbers align with what users see after paying.

import { SUBURBS, type SuburbData } from './suburb-data'

export type BusinessType =
  | 'cafe'
  | 'restaurant'
  | 'takeaway'
  | 'retail'
  | 'gym'
  | 'salon'
  | 'bar'

export type BudgetBand = 'under-50k' | '50k-100k' | '100k-250k' | '250k-plus'

export interface ViabilityInput {
  businessType: BusinessType
  suburbSlug: string
  monthlyRent: number         // AUD
  monthlyBudget: BudgetBand   // setup capital band
  avgTicket?: number          // optional, in AUD
}

export interface ViabilityResult {
  score: number                // 0–100
  verdict: 'GO' | 'CAUTION' | 'NO'
  summary: string              // 2-sentence human summary
  suburb: SuburbData
  estimatedMonthlyRevenue: { low: number; base: number; high: number } | null
  estimatedMonthlyCosts: { low: number; base: number; high: number }
  estimatedNetProfit: { low: number; base: number; high: number } | null
  breakEvenMonths: number | null
  strengths: string[]
  risks: string[]
  conditions: string[]         // "this works ONLY IF..."
  failureModes: string[]       // "this will fail if..."
  dataCompleteness: number     // 0–100
  // CTAs — what the paid report unlocks
  locked: {
    competitorIntel: string
    footTraffic: string
    demographics: string
    rentValidation: string
    financialModel: string
  }
}

// ─── Tunables (kept explicit so we can calibrate against real reports) ────

const BUSINESS_META: Record<BusinessType, {
  label: string
  avgTicket: number            // AUD default
  customersPerDay: { low: number; base: number; high: number }
  staffMonthly: { low: number; base: number; high: number }
  cogsRatio: number            // % of revenue
  demandKey: keyof SuburbData['demandScores']
}> = {
  cafe: {
    label: 'Café',
    avgTicket: 14,
    customersPerDay: { low: 80, base: 140, high: 220 },
    staffMonthly: { low: 22000, base: 28000, high: 36000 },
    cogsRatio: 0.32,
    demandKey: 'cafes',
  },
  restaurant: {
    label: 'Restaurant',
    avgTicket: 42,
    customersPerDay: { low: 45, base: 85, high: 140 },
    staffMonthly: { low: 32000, base: 45000, high: 58000 },
    cogsRatio: 0.34,
    demandKey: 'restaurants',
  },
  takeaway: {
    label: 'Takeaway',
    avgTicket: 18,
    customersPerDay: { low: 70, base: 120, high: 200 },
    staffMonthly: { low: 14000, base: 20000, high: 26000 },
    cogsRatio: 0.36,
    demandKey: 'takeaway',
  },
  retail: {
    label: 'Retail Shop',
    avgTicket: 65,
    customersPerDay: { low: 25, base: 55, high: 95 },
    staffMonthly: { low: 14000, base: 22000, high: 30000 },
    cogsRatio: 0.45,
    demandKey: 'retail',
  },
  gym: {
    label: 'Gym / Studio',
    avgTicket: 180, // monthly membership
    customersPerDay: { low: 8, base: 18, high: 34 }, // new members per month proxy
    staffMonthly: { low: 10000, base: 16000, high: 24000 },
    cogsRatio: 0.10,
    demandKey: 'gyms',
  },
  salon: {
    label: 'Salon / Beauty',
    avgTicket: 75,
    customersPerDay: { low: 8, base: 16, high: 28 },
    staffMonthly: { low: 10000, base: 16000, high: 22000 },
    cogsRatio: 0.18,
    demandKey: 'cafes', // fall back to foot-traffic proxy
  },
  bar: {
    label: 'Bar / Pub',
    avgTicket: 28,
    customersPerDay: { low: 40, base: 85, high: 160 },
    staffMonthly: { low: 24000, base: 34000, high: 48000 },
    cogsRatio: 0.30,
    demandKey: 'restaurants',
  },
}

const BUDGET_MIDPOINT: Record<BudgetBand, number> = {
  'under-50k': 40000,
  '50k-100k': 75000,
  '100k-250k': 175000,
  '250k-plus': 350000,
}

const MIN_SETUP_BY_TYPE: Record<BusinessType, number> = {
  cafe: 80000,
  restaurant: 180000,
  takeaway: 65000,
  retail: 55000,
  gym: 150000,
  salon: 45000,
  bar: 220000,
}

// ─── Main calc ────────────────────────────────────────────────────────────

export function calculateViability(input: ViabilityInput): ViabilityResult | null {
  const suburb = SUBURBS.find((s) => s.slug === input.suburbSlug)
  if (!suburb) return null

  const meta = BUSINESS_META[input.businessType]
  const demand = suburb.demandScores[meta.demandKey] ?? 50
  const avgTicket = input.avgTicket && input.avgTicket > 0 ? input.avgTicket : meta.avgTicket

  // Demand multiplier: 0.55 at demand=40, 1.0 at demand=75, 1.35 at demand=95
  const demandMult = 0.25 + (demand / 75)

  // Revenue projection
  const customers = meta.customersPerDay
  const revenue = {
    low: Math.round(customers.low * avgTicket * 30 * demandMult * 0.85),
    base: Math.round(customers.base * avgTicket * 30 * demandMult),
    high: Math.round(customers.high * avgTicket * 30 * demandMult * 1.15),
  }

  // Cost projection
  const rent = input.monthlyRent
  const costs = {
    low: Math.round(meta.staffMonthly.low + rent + revenue.low * meta.cogsRatio + 4500),
    base: Math.round(meta.staffMonthly.base + rent + revenue.base * meta.cogsRatio + 6500),
    high: Math.round(meta.staffMonthly.high + rent + revenue.high * meta.cogsRatio + 9000),
  }

  const net = {
    low: revenue.low - costs.high,       // worst-case profit
    base: revenue.base - costs.base,
    high: revenue.high - costs.low,      // best-case profit
  }

  const setupBudget = BUDGET_MIDPOINT[input.monthlyBudget]
  const minSetup = MIN_SETUP_BY_TYPE[input.businessType]
  const budgetOk = setupBudget >= minSetup

  const breakEvenMonths = net.base > 0 ? Math.ceil(minSetup / net.base) : null

  // ─── Scoring ──────────────────────────────────────────────────────────
  let score = 0

  // Demand (40 pts)
  score += (demand / 100) * 40

  // Rent sanity (25 pts) — compare to suburb rent range midpoint
  const rentMid = parseRentMidpoint(suburb.rentRange)
  if (rentMid) {
    const ratio = rent / rentMid
    if (ratio <= 0.9) score += 25
    else if (ratio <= 1.1) score += 20
    else if (ratio <= 1.35) score += 12
    else if (ratio <= 1.6) score += 6
    else score += 0
  } else {
    score += 15
  }

  // Budget adequacy (20 pts)
  if (setupBudget >= minSetup * 1.5) score += 20
  else if (setupBudget >= minSetup) score += 15
  else if (setupBudget >= minSetup * 0.75) score += 7
  else score += 0

  // Suburb fit (15 pts)
  if (suburb.bestFor.includes(getBestForKey(input.businessType))) score += 15
  else if (suburb.notBestFor.includes(getBestForKey(input.businessType))) score += 0
  else score += 8

  score = Math.max(0, Math.min(100, Math.round(score)))

  const verdict: 'GO' | 'CAUTION' | 'NO' =
    score >= 72 ? 'GO' : score >= 52 ? 'CAUTION' : 'NO'

  // ─── Narrative ────────────────────────────────────────────────────────
  const strengths: string[] = []
  const risks: string[] = []
  const conditions: string[] = []
  const failureModes: string[] = []

  if (demand >= 80) strengths.push(`${suburb.name} has one of the strongest demand signals in ${suburb.city} for ${meta.label.toLowerCase()} operators (${demand}/100).`)
  else if (demand >= 65) strengths.push(`Demand for ${meta.label.toLowerCase()}s in ${suburb.name} is above the ${suburb.city} average (${demand}/100).`)
  else risks.push(`${suburb.name} has a below-average demand score for ${meta.label.toLowerCase()}s (${demand}/100) — you will compete hard for every customer.`)

  if (suburb.bestFor.includes(getBestForKey(input.businessType))) {
    strengths.push(`${meta.label} is one of the business types ${suburb.name} is best known for — customers already come here looking for it.`)
  }
  if (suburb.notBestFor.includes(getBestForKey(input.businessType))) {
    risks.push(`${suburb.name} historically underperforms for ${meta.label.toLowerCase()} operators — local demographics and anchors don't match this format.`)
  }

  if (rentMid && rent > rentMid * 1.35) {
    risks.push(`Your proposed rent is ~${Math.round((rent/rentMid - 1) * 100)}% above the suburb median — margins will be squeezed from month one.`)
    failureModes.push(`revenue comes in below $${revenue.base.toLocaleString()}/month for more than 3 consecutive months`)
  }
  if (rentMid && rent < rentMid * 0.85) {
    strengths.push(`Your rent is below the ${suburb.name} median — this gives you meaningful margin cushion.`)
  }

  if (!budgetOk) {
    risks.push(`Your setup budget band is below the typical minimum for a ${meta.label.toLowerCase()} (${formatMoney(minSetup)}). Undercapitalised openings are the #1 failure driver.`)
    failureModes.push(`you open under-capitalised and can't fund 3 months of operating losses`)
  }

  if (suburb.parkingEase === 'Difficult' || suburb.parkingEase === 'Very Difficult') {
    if (input.businessType === 'retail' || input.businessType === 'gym') {
      risks.push(`Parking in ${suburb.name} is ${suburb.parkingEase.toLowerCase()} — a real constraint for ${meta.label.toLowerCase()}s that need drive-in customers.`)
    }
  }

  conditions.push(`You hit at least ${customers.base} customers/day within 90 days.`)
  conditions.push(`Your average ticket stays at or above $${avgTicket}.`)
  if (rentMid) conditions.push(`You negotiate rent close to the ${suburb.name} median (${suburb.rentRange}).`)

  failureModes.push(`a direct competitor opens within 200m in your first 6 months`)
  failureModes.push(`you rely on walk-in traffic only and don't build a delivery / loyalty channel`)

  const summary = buildSummary({ verdict, score, suburb, meta, revenue, net, demand })

  // Data completeness: we have good inputs but missing live signals
  const dataCompleteness = input.avgTicket ? 55 : 45

  return {
    score,
    verdict,
    summary,
    suburb,
    estimatedMonthlyRevenue: revenue,
    estimatedMonthlyCosts: costs,
    estimatedNetProfit: net,
    breakEvenMonths,
    strengths: strengths.slice(0, 4),
    risks: risks.slice(0, 4),
    conditions: conditions.slice(0, 4),
    failureModes: failureModes.slice(0, 4),
    dataCompleteness,
    locked: {
      competitorIntel: `Live competitor scan: every ${meta.label.toLowerCase()} within 500m of your exact address, ratings, cuisine/format overlap, and pricing gaps.`,
      footTraffic: `Hour-by-hour foot traffic for the exact block, weekday vs weekend split, and transit/anchor contribution to your door.`,
      demographics: `500m catchment demographics: age, income, commuter flow, household composition, and spend propensity for ${meta.label.toLowerCase()}s.`,
      rentValidation: `Real listings within 400m benchmarked against your proposed rent, with a negotiation target range.`,
      financialModel: `12-month P&L, worst/base/best scenarios, break-even chart, and the exact revenue threshold you need to hit in each of the first 6 months.`,
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function buildSummary(args: {
  verdict: 'GO' | 'CAUTION' | 'NO'
  score: number
  suburb: SuburbData
  meta: typeof BUSINESS_META[BusinessType]
  revenue: { low: number; base: number; high: number }
  net: { low: number; base: number; high: number }
  demand: number
}): string {
  const { verdict, suburb, meta, revenue, net, demand } = args
  const fmt = (n: number) => '$' + Math.max(0, Math.round(n / 1000)) + 'k'
  if (verdict === 'GO') {
    return `A ${meta.label.toLowerCase()} in ${suburb.name} is viable on the inputs you gave us. Demand (${demand}/100) and suburb fit are both in your favour, with a base-case of ${fmt(revenue.base)}/mo revenue and ${fmt(net.base)}/mo net profit.`
  }
  if (verdict === 'CAUTION') {
    return `A ${meta.label.toLowerCase()} in ${suburb.name} can work, but not on autopilot. Demand is ${demand}/100 and your base-case clears ${fmt(net.base)}/mo net — workable only if rent, capital, and ramp-up land within the conditions below.`
  }
  return `The inputs you gave us don't clear a ${meta.label.toLowerCase()} in ${suburb.name}. Demand, rent-to-revenue, or capital adequacy is under the line — the full report will show you which variables to fix before signing a lease.`
}

function parseRentMidpoint(range: string): number | null {
  // "$3,500–$7,500/month" -> 5500
  const nums = range.match(/\d[\d,]*/g)
  if (!nums || nums.length < 2) return null
  const a = parseInt(nums[0].replace(/,/g, ''), 10)
  const b = parseInt(nums[1].replace(/,/g, ''), 10)
  if (isNaN(a) || isNaN(b)) return null
  return Math.round((a + b) / 2)
}

function formatMoney(n: number): string {
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'k'
  return '$' + n
}

function getBestForKey(b: BusinessType): string {
  // Map our form values to the suburb data strings (cafes/restaurants/retail/gyms/takeaway)
  if (b === 'cafe') return 'cafes'
  if (b === 'restaurant') return 'restaurants'
  if (b === 'retail') return 'retail'
  if (b === 'gym') return 'gyms'
  if (b === 'takeaway') return 'takeaway'
  if (b === 'bar') return 'restaurants'
  if (b === 'salon') return 'retail'
  return 'cafes'
}

// ─── UI helpers ───────────────────────────────────────────────────────────

export const BUSINESS_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: 'cafe',       label: 'Café / Coffee Shop' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'takeaway',   label: 'Takeaway / QSR' },
  { value: 'retail',     label: 'Retail Shop' },
  { value: 'gym',        label: 'Gym / Studio' },
  { value: 'salon',      label: 'Salon / Beauty' },
  { value: 'bar',        label: 'Bar / Pub' },
]

export const BUDGET_OPTIONS: { value: BudgetBand; label: string }[] = [
  { value: 'under-50k',  label: 'Under $50k' },
  { value: '50k-100k',   label: '$50k – $100k' },
  { value: '100k-250k',  label: '$100k – $250k' },
  { value: '250k-plus',  label: '$250k+' },
]

export function getSuburbOptions() {
  return SUBURBS
    .slice()
    .sort((a, b) => (a.city + a.name).localeCompare(b.city + b.name))
    .map((s) => ({
      value: s.slug,
      label: `${s.name}, ${s.city}`,
      city: s.city,
    }))
}
