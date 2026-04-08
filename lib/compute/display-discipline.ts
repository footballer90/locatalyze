/**
 * lib/compute/display-discipline.ts
 *
 * Display Discipline Layer
 *
 * Core principle: "Compute can be detailed. Display must match confidence."
 *
 * This module gates what financial numbers are shown to the user and at
 * what precision, based on the compute engine's confidence metadata.
 *
 * RULES:
 * - HIGH confidence  → show exact numbers
 * - MEDIUM confidence → show rounded ranges (±15%)
 * - LOW confidence    → show wide ranges (±30%) with "directional" qualifier
 * - BENCHMARK_DEFAULT → show ranges (±40%) with strong "estimated" qualifier
 * - When data is missing → suppress the number entirely, show a CTA
 *
 * Safe for client import.
 */

import type { ComputedResult } from '@/types/computed'

// ── Types ────────────────────────────────────────────────────────────────────

export type ConfidenceTier = 'high' | 'medium' | 'low' | 'benchmark_default'

export interface DisplayNumber {
  /** The formatted display string (e.g. "$12,000 – $18,000" or "$15,000") */
  display: string
  /** Whether this is a range or an exact number */
  isRange: boolean
  /** Qualifier label: null for high confidence, "estimated" / "directional" otherwise */
  qualifier: string | null
  /** The raw numeric value (for sorting/comparison, not for display) */
  raw: number | null
  /** Should this number be shown at all? False when data is completely missing. */
  visible: boolean
}

export interface SectionGate {
  /** Should the section be shown? */
  visible: boolean
  /** If not visible, the reason message to display instead */
  suppressionMessage: string | null
  /** Confidence tier for this section */
  tier: ConfidenceTier
  /** Warning banner text, if any (section visible but with caveats) */
  caveat: string | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtAUD(n: number): string {
  return 'A$' + Math.round(n).toLocaleString('en-AU')
}

function roundTo(n: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(n / factor) * factor
}

// ── Core display functions ───────────────────────────────────────────────────

/**
 * Format a financial number using k-notation rounded to the nearest meaningful unit.
 * Used for benchmark and low-confidence figures where exact cents are misleading.
 * e.g. 99000 → "~$99k", 47213 → "~$47k", 132600 → "~$133k"
 */
function fmtK(value: number, prefix: string): string {
  const k = Math.round(value / 1000)
  return `~${prefix}${k}k`
}

/**
 * Format a financial number with confidence-appropriate precision.
 *
 * HIGH:             Exact number   → "$99,000"          (real data)
 * MEDIUM:           Rounded range  → "$84k – $114k"     (±15%, k-notation)
 * LOW:              Rough range    → "$80k – $120k"      (±20%, k-notation)
 * BENCHMARK_DEFAULT: Single approx → "~$99k"            (industry avg — no range, single figure is honest)
 *
 * Design rationale:
 * - Ranges look fake when computed mechanically (±30% gives $69,000–$129,000 which screams "generated").
 * - k-notation ("~$99k") reads as an approximation, not a precise forecast.
 * - benchmark_default uses a single figure, not a range — a range implies statistical sampling,
 *   which we don't have. We have one benchmark number; showing a range around it is dishonest.
 */
export function displayMoney(
  value: number | null | undefined,
  confidence: ConfidenceTier,
  opts?: { prefix?: string; suppressIfNull?: boolean }
): DisplayNumber {
  const prefix = opts?.prefix ?? 'A$'

  if (value == null || value === 0) {
    return {
      display: 'N/A',
      isRange: false,
      qualifier: null,
      raw: null,
      visible: opts?.suppressIfNull !== false,
    }
  }

  switch (confidence) {
    case 'high': {
      // Exact number — real verified data, full precision
      return {
        display: prefix + Math.round(value).toLocaleString('en-AU'),
        isRange: false,
        qualifier: null,
        raw: value,
        visible: true,
      }
    }

    case 'medium': {
      // Tight range ±15% in k-notation — mix of live and estimated data
      const lo = Math.round(value * 0.85 / 1000)
      const hi = Math.round(value * 1.15 / 1000)
      return {
        display: `${prefix}${lo}k – ${prefix}${hi}k`,
        isRange: true,
        qualifier: 'estimated',
        raw: value,
        visible: true,
      }
    }

    case 'low': {
      // Moderate range ±20% in k-notation — limited live data
      const lo = Math.round(value * 0.80 / 1000)
      const hi = Math.round(value * 1.20 / 1000)
      return {
        display: `${prefix}${lo}k – ${prefix}${hi}k`,
        isRange: true,
        qualifier: 'directional — low data',
        raw: value,
        visible: true,
      }
    }

    case 'benchmark_default': {
      // Single approximate figure in k-notation — industry average, not a forecast.
      // We intentionally do NOT show a range: we have one benchmark number, and a mechanical
      // ±40% band around it would look generated and imply a precision we don't have.
      return {
        display: fmtK(value, prefix),
        isRange: false,
        qualifier: 'industry avg — not your forecast',
        raw: value,
        visible: true,
      }
    }

    default:
      return { display: fmtAUD(value), isRange: false, qualifier: null, raw: value, visible: true }
  }
}

/**
 * Determine the confidence tier from ComputedResult metadata.
 */
export function getConfidenceTier(computed: ComputedResult | null): ConfidenceTier {
  if (!computed) return 'benchmark_default'

  const mc = computed.modelConfidence
  if (mc === 'high') return 'high'
  if (mc === 'medium') return 'medium'
  if (mc === 'benchmark_default') return 'benchmark_default'
  return 'low'
}

/**
 * Gate a section based on data availability and confidence.
 * Returns whether the section should be shown and any caveats.
 */
export function gateSection(
  sectionName: string,
  computed: ComputedResult | null,
  opts?: {
    /** Required fields that must be non-null for this section to show */
    requiredFields?: (keyof ComputedResult)[]
    /** Minimum data completeness (0-100) to show this section */
    minCompleteness?: number
  }
): SectionGate {
  if (!computed) {
    return {
      visible: true,
      suppressionMessage: null,
      tier: 'benchmark_default',
      caveat: 'This report was generated before our compute engine upgrade. Re-run for validated data.',
    }
  }

  const tier = getConfidenceTier(computed)

  // Check required fields
  if (opts?.requiredFields) {
    for (const field of opts.requiredFields) {
      const val = computed[field]
      if (val == null || val === 0) {
        return {
          visible: false,
          suppressionMessage: `${sectionName} cannot be displayed — required data is missing. Re-run the analysis for complete results.`,
          tier,
          caveat: null,
        }
      }
    }
  }

  // Check minimum completeness
  const minComp = opts?.minCompleteness ?? 0
  if (computed.dataCompleteness < minComp) {
    return {
      visible: false,
      suppressionMessage: `${sectionName} suppressed — data completeness is ${computed.dataCompleteness}% (minimum ${minComp}% required).`,
      tier,
      caveat: null,
    }
  }

  // Determine caveat based on confidence
  let caveat: string | null = null
  if (tier === 'benchmark_default') {
    caveat = 'All numbers in this section are industry estimates — no local market data was available. Treat as directional only.'
  } else if (tier === 'low') {
    caveat = 'Limited live data available. Numbers shown are directional estimates with wide uncertainty bands.'
  }

  return { visible: true, suppressionMessage: null, tier, caveat }
}

/**
 * Check if financials should be completely suppressed.
 * Per CLAUDE.md: suppress if revenue, avgTicketSize, or setupBudget is null/0.
 */
export function shouldSuppressFinancials(computed: ComputedResult | null): {
  suppress: boolean
  reason: string | null
} {
  if (!computed) return { suppress: false, reason: null }

  if (computed.revenue == null || computed.revenue === 0) {
    return {
      suppress: true,
      reason: 'Revenue could not be calculated — average ticket size or demand estimate is missing.',
    }
  }

  if (computed.avgTicketSize == null || computed.avgTicketSize === 0) {
    return {
      suppress: true,
      reason: 'Average ticket size is unknown. Financial projections require this input.',
    }
  }

  return { suppress: false, reason: null }
}

/**
 * Format a percentage with confidence-appropriate precision.
 * HIGH → "12.3%", MEDIUM → "~12%", LOW/BENCHMARK → "10–15%"
 */
export function displayPercent(
  value: number | null | undefined,
  confidence: ConfidenceTier
): DisplayNumber {
  if (value == null) {
    return { display: 'N/A', isRange: false, qualifier: null, raw: null, visible: true }
  }

  switch (confidence) {
    case 'high':
      return { display: `${value.toFixed(1)}%`, isRange: false, qualifier: null, raw: value, visible: true }
    case 'medium':
      return { display: `~${Math.round(value)}%`, isRange: false, qualifier: 'estimated', raw: value, visible: true }
    case 'low':
    case 'benchmark_default': {
      const lo = Math.max(0, Math.round(value - 5))
      const hi = Math.round(value + 5)
      return { display: `${lo}–${hi}%`, isRange: true, qualifier: confidence === 'benchmark_default' ? 'benchmark estimate' : 'directional', raw: value, visible: true }
    }
    default:
      return { display: `${value.toFixed(1)}%`, isRange: false, qualifier: null, raw: value, visible: true }
  }
}

/**
 * Format a customer count with confidence-appropriate precision.
 */
export function displayCustomers(
  value: number | null | undefined,
  confidence: ConfidenceTier
): DisplayNumber {
  if (value == null) {
    return { display: 'N/A', isRange: false, qualifier: null, raw: null, visible: true }
  }

  switch (confidence) {
    case 'high':
      return { display: String(Math.round(value)), isRange: false, qualifier: null, raw: value, visible: true }
    case 'medium':
      return { display: `~${Math.round(value)}`, isRange: false, qualifier: 'estimated', raw: value, visible: true }
    case 'low':
    case 'benchmark_default': {
      const lo = Math.round(value * 0.70)
      const hi = Math.round(value * 1.30)
      return { display: `${lo}–${hi}`, isRange: true, qualifier: 'directional', raw: value, visible: true }
    }
    default:
      return { display: String(Math.round(value)), isRange: false, qualifier: null, raw: value, visible: true }
  }
}
