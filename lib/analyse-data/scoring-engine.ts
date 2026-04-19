/**
 * Unified location scoring engine for multi-city analyse hubs.
 *
 * All business-type scores (0–100) and suburb verdicts are derived deterministically
 * from five 1–10 factors and the weight tables below — never from hand-entered scores.
 *
 * Factor semantics:
 * - demandStrength: higher = stronger demand (better)
 * - rentPressure: higher = more expensive / harder rent (worse)
 * - competitionDensity: higher = more saturated (worse)
 * - seasonalityRisk: higher = more revenue volatility (worse)
 * - tourismDependency: higher = more tourism-driven trade (contextual; see tourism contribution rules)
 *
 * Verdict thresholds apply to the **same integer composite** shown in the UI (no float/round split).
 *
 * Explicit cross-city note: hub marketing pages that only expose ordinal levels (Low/Medium/High)
 * use `deriveFactorsFromAnalyseLevels` — a documented deterministic mapping, not raw ABS inputs.
 */

export type LocationVerdict = 'GO' | 'CAUTION' | 'RISKY'

export interface LocationFactors {
  demandStrength: number
  rentPressure: number
  competitionDensity: number
  seasonalityRisk: number
  tourismDependency: number
}

export type BusinessTypeKey = 'cafe' | 'restaurant' | 'retail'

/** Percent weights per business type — must sum to 100 where factors are used. */
export const BUSINESS_TYPE_WEIGHTS: Record<
  BusinessTypeKey,
  Partial<Record<keyof LocationFactors, number>>
> = {
  cafe: { demandStrength: 40, rentPressure: 28, competitionDensity: 18, seasonalityRisk: 14 },
  restaurant: {
    demandStrength: 32,
    rentPressure: 22,
    competitionDensity: 18,
    seasonalityRisk: 14,
    tourismDependency: 14,
  },
  retail: {
    demandStrength: 28,
    rentPressure: 22,
    tourismDependency: 22,
    competitionDensity: 18,
    seasonalityRisk: 10,
  },
}

/** Blend of business-type scores into one suburb headline score (0–100 integer). */
export const COMPOSITE_BLEND = { cafe: 0.4, restaurant: 0.35, retail: 0.25 } as const

/**
 * Integer composite thresholds (applied to the same rounded value as UI).
 * (Legacy float threshold 68.5 aligns to composite ≥ 69 after rounding.)
 */
export const VERDICT_SCORE_THRESHOLDS = {
  go: 69,
  caution: 60,
} as const

export const FACTOR_META: {
  key: keyof LocationFactors
  label: string
  dir: 'high' | 'low' | 'ctx'
}[] = [
  { key: 'demandStrength', label: 'Demand', dir: 'high' },
  { key: 'rentPressure', label: 'Rent cost', dir: 'low' },
  { key: 'competitionDensity', label: 'Competition', dir: 'low' },
  { key: 'seasonalityRisk', label: 'Seasonality', dir: 'low' },
  { key: 'tourismDependency', label: 'Tourism dep', dir: 'ctx' },
]

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function clampFactor(n: number): number {
  return clamp(Math.round(n), 1, 10)
}

/**
 * Maps each raw factor to a 0–100 **contribution** before applying weights.
 * Tourism: higher raw value increases score for restaurant/retail; for cafe the factor is omitted from weights.
 */
function factorContribution(
  key: keyof LocationFactors,
  value: number,
  businessType: BusinessTypeKey,
): number {
  const v = clampFactor(value)
  switch (key) {
    case 'demandStrength':
      return v * 10
    case 'rentPressure':
    case 'competitionDensity':
    case 'seasonalityRisk':
      return (11 - v) * 10
    case 'tourismDependency':
      if (businessType === 'cafe') {
        return (11 - v) * 10
      }
      return v * 10
    default:
      return 0
  }
}

/**
 * Weighted 0–100 business-type score from five factors.
 */
export function calculateBusinessScore(
  factors: LocationFactors,
  businessType: BusinessTypeKey,
): number {
  const weights = BUSINESS_TYPE_WEIGHTS[businessType]
  let sum = 0
  for (const key of Object.keys(weights) as (keyof LocationFactors)[]) {
    const pct = weights[key]
    if (pct === undefined || pct === 0) continue
    sum += (pct / 100) * factorContribution(key, factors[key], businessType)
  }
  return clamp(Math.round(sum), 0, 100)
}

export function computeLocationBusinessScores(factors: LocationFactors): Record<BusinessTypeKey, number> {
  return {
    cafe: calculateBusinessScore(factors, 'cafe'),
    restaurant: calculateBusinessScore(factors, 'restaurant'),
    retail: calculateBusinessScore(factors, 'retail'),
  }
}

export function computeCompositeScore(scores: Record<BusinessTypeKey, number>): number {
  const raw =
    scores.cafe * COMPOSITE_BLEND.cafe +
    scores.restaurant * COMPOSITE_BLEND.restaurant +
    scores.retail * COMPOSITE_BLEND.retail
  return clamp(Math.round(raw), 0, 100)
}

export function deriveVerdictFromComposite(compositeScore: number): LocationVerdict {
  if (compositeScore >= VERDICT_SCORE_THRESHOLDS.go) return 'GO'
  if (compositeScore >= VERDICT_SCORE_THRESHOLDS.caution) return 'CAUTION'
  return 'RISKY'
}

/** Single pipeline: factors → business scores → composite (int) → verdict */
export function computeLocationModel(factors: LocationFactors): {
  factors: LocationFactors
  cafe: number
  restaurant: number
  retail: number
  compositeScore: number
  verdict: LocationVerdict
} {
  const scores = computeLocationBusinessScores(factors)
  const compositeScore = computeCompositeScore(scores)
  const verdict = deriveVerdictFromComposite(compositeScore)
  return {
    factors,
    cafe: scores.cafe,
    restaurant: scores.restaurant,
    retail: scores.retail,
    compositeScore,
    verdict,
  }
}

/**
 * Guards against suburb seed objects that accidentally include computed score fields.
 * Call this on raw seed arrays BEFORE passing to computeLocationModel().
 *
 * If a seed already has a numeric `score`, `compositeScore`, `cafe`, `restaurant`,
 * `retail`, or string `verdict`, it means someone bypassed the engine — throw immediately
 * so the CI build fails rather than silently serving inconsistent data.
 */
export function assertNoManualScores(seed: Record<string, unknown>, label = 'unknown'): void {
  const forbidden: (keyof typeof seed)[] = [
    'score', 'compositeScore', 'cafe', 'restaurant', 'retail', 'verdict',
  ]
  for (const key of forbidden) {
    if (key in seed) {
      throw new Error(
        `[scoring-engine] Manual "${key}" field detected on suburb "${label}". ` +
        `Remove it and let computeLocationModel() derive this value instead.`,
      )
    }
  }
}

/**
 * Deterministic mapping from Newcastle/Wollongong suburb detail fields to factors.
 * Documented here so differences vs Gold Coast explicit raw factors are visible.
 */
export function deriveFactorsFromAnalyseLevels(
  rentLevel: 'Low' | 'Medium' | 'High',
  competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High',
  footTrafficLevel: 'Low' | 'Medium' | 'High' | 'Very High',
): LocationFactors {
  const rentPressure = rentLevel === 'Low' ? 4 : rentLevel === 'Medium' ? 6 : 9
  const competitionDensity =
    competitionLevel === 'Low'
      ? 3
      : competitionLevel === 'Medium'
        ? 5
        : competitionLevel === 'High'
          ? 8
          : 9
  const ftN =
    footTrafficLevel === 'Low' ? 4 : footTrafficLevel === 'Medium' ? 6 : footTrafficLevel === 'High' ? 8 : 9
  const demandStrength = clampFactor(ftN + 2 - (competitionDensity >= 8 ? 2 : competitionDensity >= 5 ? 1 : 0))
  const seasonalityRisk = footTrafficLevel === 'Low' ? 6 : footTrafficLevel === 'Medium' ? 5 : 4
  const tourismDependency =
    rentLevel === 'High' && footTrafficLevel !== 'Low'
      ? 7
      : footTrafficLevel === 'Very High'
        ? 6
        : 4

  return {
    demandStrength,
    rentPressure,
    competitionDensity,
    seasonalityRisk,
    tourismDependency: clampFactor(tourismDependency),
  }
}

/**
 * Hub listing cards (demandScore + Low/Medium/High) → factors for summary tables.
 */
export function deriveFactorsFromMarketingCard(
  demandScore: number,
  competition: 'Low' | 'Medium' | 'High',
  rent: 'Low' | 'Medium' | 'High',
  footTraffic: 'Low' | 'Medium' | 'High',
): LocationFactors {
  const rentPressure = rent === 'Low' ? 4 : rent === 'Medium' ? 6 : 9
  const competitionDensity = competition === 'Low' ? 3 : competition === 'Medium' ? 6 : 8
  const demandStrength = clampFactor(demandScore)
  const seasonalityRisk = footTraffic === 'Low' ? 6 : footTraffic === 'Medium' ? 5 : 4
  const tourismDependency = clampFactor(Math.round(5 + (demandStrength - 5) * 0.6))

  return {
    demandStrength,
    rentPressure,
    competitionDensity,
    seasonalityRisk,
    tourismDependency,
  }
}
