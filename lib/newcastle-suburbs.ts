// lib/newcastle-suburbs.ts
// Canonical data model for future /analyse/newcastle/[suburb] pages.
// Keep this file syntax-safe and deterministic for static generation.

export type Verdict = 'GO' | 'CAUTION' | 'NO'
export type Level = 'Low' | 'Medium' | 'High' | 'Very High'
export type FitRating = 'Excellent' | 'Good' | 'Fair' | 'Poor'
export type SaturationLevel = 'Oversaturated' | 'Competitive' | 'Moderate' | 'Low' | 'Untapped'
export type RiskReward = 'Excellent' | 'Good' | 'Moderate' | 'Poor'

export interface BusinessFit {
  rating: FitRating
  reason: string
}

export interface RelatedSuburb {
  slug: string
  name: string
  reason: string
}

export interface NewcastleSuburb {
  slug: string
  name: string
  metaTitle: string
  metaDescription: string
  heroSubline: string
  verdict: Verdict
  verdictReason: string
  revenueRange: string
  rentRange: string
  rentLevel: 'Low' | 'Medium' | 'High'
  competitionLevel: Level
  footTrafficLevel: Level
  demographics: string
  medianIncome: string
  spendingBehavior: string
  suburbVibe: string
  peakZones: string[]
  anchorBusinesses: string[]
  businessFit: {
    cafe: BusinessFit
    restaurant: BusinessFit
    retail: BusinessFit
    gym: BusinessFit
  }
  competitorCount: string
  saturationLevel: SaturationLevel
  whatWorking: string
  marketGaps: string[]
  rentJustified: boolean
  rentReason: string
  riskReward: RiskReward
  successConditions: string[]
  failureRisks: string[]
  relatedSuburbs: RelatedSuburb[]
  keyInsight: string
}

export const NEWCASTLE_SUBURBS: Record<string, NewcastleSuburb> = {}

export function getNewcastleSuburb(slug: string): NewcastleSuburb | null {
  return NEWCASTLE_SUBURBS[slug] ?? null
}

export function getAllNewcastleSuburbs(): NewcastleSuburb[] {
  return Object.values(NEWCASTLE_SUBURBS)
}
