export type Verdict = 'GO' | 'CAUTION' | 'NO'
export type Plan = 'free' | 'pro' | 'team'
export type SaturationLevel = 'low' | 'medium' | 'high'
export type AffordabilityRating = 'excellent' | 'good' | 'marginal' | 'risky'

export interface ReportInput {
  locationName: string
  address: string
  businessType: string
  monthlyRent: number
  avgTransactionValue: number
  expectedMonthlyCustomers: number
  monthlyOperatingCosts: number
  latitude?: number
  longitude?: number
}

export interface ScoreBreakdown {
  overall: number
  footTraffic: number
  demographics: number
  competition: number
  rentAffordability: number
  accessibility: number
}

export interface BreakEvenAnalysis {
  dailyCustomersRequired: number
  monthlyRevenueRequired: number
  monthsToBreakEven: number
  breakEvenDate: string
}

export interface YearProjection {
  revenue: number
  profit: number
  customers: number
}

export interface RevenueProjection {
  year1: YearProjection
  year2: YearProjection
  year3: YearProjection
}

export interface RiskScenario {
  revenue: number
  profit: number
  occupancyRate: number
}

export interface RiskScenarios {
  best: RiskScenario
  base: RiskScenario
  worst: RiskScenario
}

export interface NearbyBusiness {
  name: string
  distance: number
  type: string
}

export interface CompetitorData {
  count: number
  saturationLevel: SaturationLevel
  nearbyBusinesses: NearbyBusiness[]
}

export interface DemographicData {
  medianIncome: number
  populationDensity: number
  ageDistribution: Record<string, number>
  incomeAffordabilityScore: number
}

export interface RentAnalysis {
  marketMedianRent: number
  rentToRevenueRatio: number
  affordabilityRating: AffordabilityRating
}

export interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface ReportResult {
  score: ScoreBreakdown
  breakEven: BreakEvenAnalysis
  projection: RevenueProjection
  risk: RiskScenarios
  competitors: CompetitorData
  demographics: DemographicData
  rentAnalysis: RentAnalysis
  swot: SwotData
  verdict: Verdict
  aiSummary: string
}

export interface Report {
  id: string
  userId: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
  verdict: Verdict | null
  locationName: string
  address: string | null
  businessType: string
  monthlyRent: number
  locationScore: number | null
  inputData: ReportInput
  resultData: ReportResult | null
  createdAt: string
  updatedAt: string
}

export interface ReportListItem {
  id: string
  verdict: Verdict
  locationName: string
  address: string | null
  businessType: string
  monthlyRent: number
  locationScore: number
  status: string
  createdAt: string
}

export interface Profile {
  id: string
  email: string
  fullName: string | null
  plan: Plan
  stripeCustomerId: string | null
  reportsUsed: number
  createdAt: string
}
