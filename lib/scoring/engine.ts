import type {
  ReportInput,
  ScoreBreakdown,
  BreakEvenAnalysis,
  RevenueProjection,
  RiskScenarios,
  Verdict,
} from '@/types/report'

interface ExternalData {
  footTrafficScore: number
  medianIncome: number
  competitorCount: number
  populationDensity: number
}

export function calculateScore(
  input: ReportInput,
  external: ExternalData
): ScoreBreakdown {
  const rentAffordability = getRentAffordabilityScore(input)
  const competition = Math.max(0, 100 - external.competitorCount * 8)
  const demographics = Math.min(100, external.medianIncome / 800)
  const footTraffic = external.footTrafficScore
  const accessibility = Math.min(100, external.populationDensity / 50)

  const overall = Math.round(
    rentAffordability * 0.3 +
    footTraffic * 0.25 +
    demographics * 0.2 +
    competition * 0.15 +
    accessibility * 0.1
  )

  return {
    overall,
    footTraffic: Math.round(footTraffic),
    demographics: Math.round(demographics),
    competition: Math.round(competition),
    rentAffordability: Math.round(rentAffordability),
    accessibility: Math.round(accessibility),
  }
}

function getRentAffordabilityScore(input: ReportInput): number {
  const monthlyRevenue = input.avgTransactionValue * input.expectedMonthlyCustomers
  const ratio = input.monthlyRent / monthlyRevenue
  if (ratio <= 0.08) return 95
  if (ratio <= 0.12) return 80
  if (ratio <= 0.18) return 55
  if (ratio <= 0.25) return 30
  return 10
}

export function calculateBreakEven(input: ReportInput): BreakEvenAnalysis {
  const totalMonthlyCosts = input.monthlyRent + input.monthlyOperatingCosts
  const monthlyRevenue = input.avgTransactionValue * input.expectedMonthlyCustomers
  const monthlyProfit = monthlyRevenue - totalMonthlyCosts
  const monthlyRevenueRequired = totalMonthlyCosts / 0.85
  const dailyCustomersRequired = Math.ceil(
    monthlyRevenueRequired / (input.avgTransactionValue * 26)
  )
  const monthsToBreakEven =
    monthlyProfit > 0
      ? Math.ceil((totalMonthlyCosts * 6) / monthlyProfit)
      : 999

  const breakEvenDate = new Date(
    Date.now() + Math.min(monthsToBreakEven, 60) * 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 7)

  return {
    dailyCustomersRequired,
    monthlyRevenueRequired: Math.round(monthlyRevenueRequired),
    monthsToBreakEven: Math.max(1, monthsToBreakEven),
    breakEvenDate,
  }
}

export function calculateProjections(input: ReportInput): RevenueProjection {
  const baseMonthlyRevenue =
    input.avgTransactionValue * input.expectedMonthlyCustomers
  const baseMonthlyCosts = input.monthlyRent + input.monthlyOperatingCosts

  const project = (growthRate: number, year: number) => {
    const annualRevenue =
      baseMonthlyRevenue * 12 * Math.pow(1 + growthRate, year)
    const annualCosts = baseMonthlyCosts * 12 * Math.pow(1.04, year)
    return {
      revenue: Math.round(annualRevenue),
      profit: Math.round(annualRevenue - annualCosts),
      customers: Math.round(
        input.expectedMonthlyCustomers * 12 * Math.pow(1 + growthRate, year)
      ),
    }
  }

  return {
    year1: project(0.05, 1),
    year2: project(0.12, 2),
    year3: project(0.18, 3),
  }
}

export function calculateRiskScenarios(input: ReportInput): RiskScenarios {
  const baseRevenue =
    input.avgTransactionValue * input.expectedMonthlyCustomers * 12
  const costs = (input.monthlyRent + input.monthlyOperatingCosts) * 12

  return {
    best: {
      revenue: Math.round(baseRevenue * 1.35),
      profit: Math.round(baseRevenue * 1.35 - costs),
      occupancyRate: 92,
    },
    base: {
      revenue: Math.round(baseRevenue),
      profit: Math.round(baseRevenue - costs),
      occupancyRate: 72,
    },
    worst: {
      revenue: Math.round(baseRevenue * 0.6),
      profit: Math.round(baseRevenue * 0.6 - costs),
      occupancyRate: 45,
    },
  }
}

export function deriveVerdict(score: number): Verdict {
  if (score >= 70) return 'GO'
  if (score >= 45) return 'CAUTION'
  return 'NO'
}
