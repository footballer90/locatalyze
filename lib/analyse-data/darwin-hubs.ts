/**
 * Darwin marketing-hub locations — explicit 1–10 factors, scored through the shared engine.
 * (Differs from Newcastle/Wollongong seed rows: Darwin hub had no structured suburb records before.)
 */

import {
  computeLocationModel,
  type LocationFactors,
  type LocationVerdict,
} from '@/lib/analyse-data/scoring-engine'

export interface DarwinHubEntry {
  slug: string
  name: string
  /** Qualitative labels preserved for UI copy */
  competitionLabel: string
  rentLabel: string
  demandLabel: string
  riskLabel: string
  factors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
}

const RAW: { slug: string; name: string; competitionLabel: string; rentLabel: string; demandLabel: string; riskLabel: string; factors: LocationFactors }[] = [
  {
    slug: 'darwin-cbd',
    name: 'Darwin CBD',
    competitionLabel: 'Medium',
    rentLabel: '$70–$95/m²',
    demandLabel: 'Seasonal',
    riskLabel: 'Medium',
    factors: { demandStrength: 7, rentPressure: 8, competitionDensity: 6, seasonalityRisk: 7, tourismDependency: 8 },
  },
  {
    slug: 'parap',
    name: 'Parap',
    competitionLabel: 'Low',
    rentLabel: '$50–$65/m²',
    demandLabel: 'Strong',
    riskLabel: 'Low',
    factors: { demandStrength: 8, rentPressure: 4, competitionDensity: 3, seasonalityRisk: 5, tourismDependency: 6 },
  },
  {
    slug: 'fannie-bay',
    name: 'Fannie Bay',
    competitionLabel: 'Low',
    rentLabel: '$55–$70/m²',
    demandLabel: 'Good',
    riskLabel: 'Low',
    factors: { demandStrength: 7, rentPressure: 5, competitionDensity: 3, seasonalityRisk: 5, tourismDependency: 5 },
  },
  {
    slug: 'nightcliff',
    name: 'Nightcliff',
    competitionLabel: 'Low',
    rentLabel: '$45–$60/m²',
    demandLabel: 'Community-driven',
    riskLabel: 'Low',
    factors: { demandStrength: 7, rentPressure: 4, competitionDensity: 3, seasonalityRisk: 5, tourismDependency: 4 },
  },
  {
    slug: 'mitchell-street',
    name: 'Mitchell St',
    competitionLabel: 'High',
    rentLabel: '$80–$100/m²',
    demandLabel: 'Tourist',
    riskLabel: 'Medium',
    factors: { demandStrength: 8, rentPressure: 9, competitionDensity: 8, seasonalityRisk: 8, tourismDependency: 9 },
  },
  {
    slug: 'casuarina',
    name: 'Casuarina',
    competitionLabel: 'High',
    rentLabel: '$65–$85/m²',
    demandLabel: 'Variable',
    riskLabel: 'High',
    factors: { demandStrength: 6, rentPressure: 8, competitionDensity: 8, seasonalityRisk: 6, tourismDependency: 5 },
  },
]

export const DARWIN_HUBS: DarwinHubEntry[] = RAW.map((row) => {
  const m = computeLocationModel(row.factors)
  return {
    ...row,
    cafe: m.cafe,
    restaurant: m.restaurant,
    retail: m.retail,
    compositeScore: m.compositeScore,
    verdict: m.verdict,
  }
})

export function getDarwinHub(slug: string): DarwinHubEntry | undefined {
  return DARWIN_HUBS.find((h) => h.slug === slug)
}
