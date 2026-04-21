export type DemoScenarioKey = 'go' | 'caution' | 'no'

/** Homepage hero + full demo tab order (single source for context index ↔ key). */
export const DEMO_SCENARIO_KEYS_IN_ORDER: DemoScenarioKey[] = ['go', 'caution', 'no']

/**
 * Three mini-bars on the hero card — labels align with the 5-dim methodology.
 * Values match `ReportDemoSection` pentagon vertices (Market Demand, Rent Afford., Competition).
 */
export const HOMEPAGE_MINI_SNAP: Record<
  DemoScenarioKey,
  { l: string; v: number }[]
> = {
  go: [
    { l: 'Market Demand', v: 88 },
    { l: 'Rent Afford.', v: 78 },
    { l: 'Competition', v: 72 },
  ],
  caution: [
    { l: 'Market Demand', v: 70 },
    { l: 'Rent Afford.', v: 76 },
    { l: 'Competition', v: 45 },
  ],
  no: [
    { l: 'Market Demand', v: 52 },
    { l: 'Rent Afford.', v: 44 },
    { l: 'Competition', v: 24 },
  ],
}

/**
 * Single source of truth for every demo scenario shown on marketing
 * surfaces (homepage hero mini-card, homepage interactive ReportDemoSection,
 * and any downstream landing components).
 *
 * Historical bug: the mini-card and the full demo had independent
 * hardcoded copies of rent / revenue / rent-to-revenue — each audit
 * cycle patched one and the other drifted. Audit #8 asked for a
 * shared data object initialised at mount time. This is that object.
 *
 * Rules when editing:
 *   1. Change `rent` and revenue bounds here; never hardcode them
 *      in ReportPreview / ReportDemoSection.
 *   2. Rent-to-revenue strings on marketing surfaces MUST be derived
 *      via `rentToRevenueLabel()` below, not written by hand.
 *   3. Scores shown on separate surfaces (mini-card vs full demo)
 *      must match; both read `score` from here.
 */
export interface DemoScenario {
  biz: string
  location: string
  /** Canonical verdict score rendered in every surface. */
  score: number
  /** Display string for the monthly revenue range (e.g. "$78k–$88k"). */
  monthlyRevenue: string
  /** Numeric low bound of revenue range, used to derive ratios. */
  monthlyRevenueLo: number
  /** Numeric high bound of revenue range, used to derive ratios. */
  monthlyRevenueHi: number
  /** Canonical monthly rent in AUD, single source of truth. */
  rent: number
  monthlyProfit: string
  breakEven: string
  annualRevenue: string
  /** Competitor count inside the canonical 500 m radius. */
  competitors500m: string
}

export const DEMO_SCENARIOS: Record<DemoScenarioKey, DemoScenario> = {
  go: {
    biz: 'Specialty Coffee Shop',
    location: 'Subiaco, WA',
    score: 82,
    monthlyRevenue: '$78k–$88k',
    monthlyRevenueLo: 78000,
    monthlyRevenueHi: 88000,
    rent: 3500,
    monthlyProfit: '$27,200',
    breakEven: '35–50/day',
    annualRevenue: '$936k–$1.06m',
    competitors500m: '4',
  },
  caution: {
    biz: 'Casual Dining Restaurant',
    location: 'Fremantle, WA',
    score: 61,
    monthlyRevenue: '$54k–$74k',
    monthlyRevenueLo: 54000,
    monthlyRevenueHi: 74000,
    rent: 2100,
    monthlyProfit: '$9,200',
    breakEven: '50–70/day',
    annualRevenue: '$480k–$720k',
    competitors500m: '11',
  },
  no: {
    // Score aligned with the full demo (ReportDemoSection) where NO = 38.
    // Previously 44 here, which produced different numbers on the hero
    // mini-card vs the full demo — flagged repeatedly in audits.
    biz: 'Boutique Gym',
    location: 'Joondalup, WA',
    score: 38,
    monthlyRevenue: '$14k–$20k',
    monthlyRevenueLo: 14000,
    monthlyRevenueHi: 20000,
    rent: 4200,
    monthlyProfit: '-$3,400',
    breakEven: '70–90/day',
    annualRevenue: '$300k–$480k',
    competitors500m: '22',
  },
}

/**
 * Derive the rent-to-revenue display string from the canonical
 * numbers on a scenario so it cannot drift from the rent and
 * revenue values shown next to it.
 *
 * Returns strings like "~4%" for narrow ranges and "~21–30%"
 * for ranges where the low/high bounds round to different
 * integers.
 */
export function rentToRevenueLabel(s: DemoScenario): string {
  // Midpoint of the revenue band (audit: $3,500 ÷ ~$83k ≈ 4.2% for GO scenario)
  const mid = (s.monthlyRevenueLo + s.monthlyRevenueHi) / 2
  const pct = Math.round((s.rent / mid) * 1000) / 10
  return `~${pct}%`
}
