'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import ShareButton from '@/components/ShareButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import ReferralPrompt from '@/components/ReferralPrompt'
import { use, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { MapInsights, Competitor, Anchor } from '@/components/MapboxMap'
import type { ComputedResult } from '@/types/computed'
import { whatIfCalc, scoreRent, scoreProfitability, compositeScore, resolveBizKey as resolveClientBizKey, CLIENT_BENCHMARKS } from '@/lib/compute/client-calc'
import { displayMoney, displayPercent, displayCustomers, getConfidenceTier, gateSection, shouldSuppressFinancials, type ConfidenceTier, type DisplayNumber } from '@/lib/compute/display-discipline'

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false })
const MapInsightPanel = dynamic(() => import('@/components/MapInsightPanel'), { ssr: false })

// ── Business type options (for map selector) ──────────────────────────────────
const BUSINESS_TYPES = [
  { id: 'cafe', label: 'Cafe' }, { id: 'restaurant', label: 'Restaurant' },
  { id: 'bakery', label: 'Bakery' }, { id: 'gym', label: 'Gym / Fitness' },
  { id: 'salon', label: 'Hair Salon' }, { id: 'retail', label: 'Retail Store' },
  { id: 'bar', label: 'Bar / Pub' }, { id: 'takeaway', label: 'Takeaway' },
  { id: 'pharmacy', label: 'Pharmacy' }, { id: 'other', label: 'Other' },
]

// ── Catchment radius per business type (how far customers realistically travel) ─
// Mirrors lib/compute/benchmarks.ts — do NOT import that server-only file here.
const CATCHMENT_RADIUS_M: Record<string, number> = {
  cafe:       500,
  restaurant: 3000,
  bakery:     500,
  gym:        5000,
  fitness:    5000,
  salon:      800,
  retail:     2000,
  bar:        1500,
  takeaway:   400,
  pharmacy:   800,
  other:      1500,
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  mono:        "'JetBrains Mono','Fira Mono','Courier New',monospace",
  brand:       '#0F766E',
  brandLight:  '#14B8A6',
  brandFaded:  '#F0FDFA',
  brandBorder: '#99F6E4',
  n50:  '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
  n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  blue: '#2563EB', blueBg: '#EFF6FF', blueBdr: '#BFDBFE',
  headerBg: '#111827',
  headerBorder: '#1F2937',
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Report {
  id: string
  report_id?: string | null
  submission_id?: string | null
  verdict: string | null
  overall_score: number | null
  score_rent: number | null
  score_competition: number | null
  score_demand: number | null
  score_profitability: number | null
  score_cost: number | null
  recommendation: string | null
  competitor_analysis: string | null
  rent_analysis: string | null
  market_demand: string | null
  cost_analysis: string | null
  profitability: string | null
  pl_summary: string | null
  three_year_projection: string | null
  sensitivity_analysis: string | null
  swot_analysis: string | null
  breakeven_monthly: number | null
  breakeven_daily: number | null
  breakeven_months: number | null
  location_name: string | null
  business_type: string | null
  monthly_rent: number | null
  address?: string | null
  full_report_markdown: string | null
  result_data: any | null
  computed_result?: ComputedResult | null   // engine v2 — authoritative financial data
  input_data?: any | null
  status?: string | null
  progress_step?: string | null
  created_at: string
  user_id?: string | null
  is_public?: boolean | null
  public_token?: string | null
  share_token?: string | null
  // Save & Track
  is_saved?: boolean | null
  location_status?: string | null
  saved_at?: string | null
  saved_label?: string | null
  // Outcomes feedback
  outcome_feedback?: any | null
  feedback_dismissed_at?: string | null
  // Pricing / unlock
  is_unlocked?: boolean | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseMoney(v: any): number | null {
  if (v == null) return null
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? null : n
}

function fmt(n: number | null | undefined, prefix = '$') {
  if (n == null) return 'N/A'
  return prefix + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function fmtRange(base: number | null | undefined, prefix = '$', variance = 0.2) {
  if (base == null) return 'N/A'
  const lo = Math.round(base * (1 - variance))
  const hi = Math.round(base * (1 + variance))
  return `${prefix}${lo.toLocaleString('en-AU')} – ${prefix}${hi.toLocaleString('en-AU')}`
}

// Normalise verdict from n8n ('Strong Go', 'Conditional Go', 'Caution', 'No Go')
// or legacy ('GO', 'CAUTION', 'NO') to a canonical form for comparisons
function normalizeVerdict(v: string | null): 'GO' | 'CAUTION' | 'NO' {
  const u = (v ?? '').toLowerCase().trim()
  if (u === 'go' || u === 'strong go' || u === 'conditional go') return 'GO'
  if (u === 'caution') return 'CAUTION'
  return 'NO'
}

function verdictCfg(v: string | null) {
  const norm = normalizeVerdict(v)
  const label = (v ?? '').toLowerCase().includes('conditional') ? 'CONDITIONAL GO'
              : norm === 'GO' ? 'GO'
              : norm === 'CAUTION' ? 'CAUTION'
              : 'NO GO'
  if (norm === 'GO')      return { label, desc: 'LOW RISK',    bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, headerAccent: '#059669', headerText: '#ECFDF5' }
  if (norm === 'CAUTION') return { label, desc: 'MEDIUM RISK', bg: S.amberBg,   text: S.amber,   border: S.amberBdr,   headerAccent: '#D97706', headerText: '#FFFBEB' }
  return                         { label, desc: 'HIGH RISK',   bg: S.redBg,     text: S.red,     border: S.redBdr,     headerAccent: '#DC2626', headerText: '#FEF2F2' }
}

function scoreColor(s: number) {
  if (s >= 70) return S.emerald
  if (s >= 45) return S.amber
  return S.red
}

function rentRatioColor(ratio: number) {
  if (ratio <= 0.10) return { text: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr, label: 'HEALTHY' }
  if (ratio <= 0.15) return { text: S.amber,   bg: S.amberBg,   border: S.amberBdr,   label: 'MARGINAL' }
  return                    { text: S.red,     bg: S.redBg,     border: S.redBdr,     label: 'RISK' }
}

function confidenceLevel(report: Report, computed: ComputedResult | null): { level: 'low' | 'medium' | 'high'; pct: number; reasons: string[] } {
  // ── ENGINE V2 PATH — use sealed compute metadata ──────────────────────────
  if (computed) {
    const lvl = computed.modelConfidence === 'high' ? 'high'
              : computed.modelConfidence === 'medium' ? 'medium'
              : 'low'
    const reasons: string[] = []
    const log = computed.meta?.computeLog
    if (log?.revenueSource) reasons.push(`Revenue source: ${log.revenueSource}`)
    if (log?.costsSource)   reasons.push(`Cost source: ${log.costsSource}`)
    if (log?.rejectedValues && log.rejectedValues.length > 0)
      reasons.push(`${log.rejectedValues.length} agent value(s) rejected (out of range)`)
    const cdq = computed.competitorDataQuality
    if (cdq === 'zero_warning')
      reasons.push('Competitor count is 0 — coverage may be incomplete; verify locally')
    else if (cdq === 'no_data')
      reasons.push('Competitor data unavailable — competition score is a neutral estimate')
    else if (cdq === 'live_verified')
      reasons.push(`${computed.validCompetitorCount} competitor(s) confirmed within ${computed.competitorRadius}m`)
    if (reasons.length === 0) reasons.push('Computed from verified benchmark data')
    return { level: lvl, pct: computed.dataCompleteness, reasons }
  }

  // ── LEGACY V1 PATH ────────────────────────────────────────────────────────
  const rd = safeResultData(report.result_data)
  const reasons: string[] = []
  let score = 50

  const compQuality = rd.competitors?.dataQuality
  if (compQuality === 'estimated_fallback') { score -= 15; reasons.push('Competitor data estimated (API unavailable)') }
  else { score += 15; reasons.push('Live competitor data from OpenStreetMap') }

  const demoQuality = rd.demographics?.dataQuality
  if (demoQuality?.includes('abs_state_default')) { score -= 10; reasons.push('Demographics use state-level averages (suburb data unavailable)') }
  else { score += 10; reasons.push('Suburb-level ABS Census demographics') }

  if (report.monthly_rent && report.monthly_rent > 0) { score += 10; reasons.push('User-provided rent figure') }
  else { score -= 5; reasons.push('Rent is estimated from area averages') }

  if (rd.financials?.avgTicketSize) { score += 5 }

  const pct = Math.max(20, Math.min(95, score))
  const level = pct >= 70 ? 'high' : pct >= 45 ? 'medium' : 'low'
  return { level, pct, reasons }
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children, sub, badge }: { children: string; sub?: string; badge?: 'ai' | 'engine' | null }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 3, height: 18, background: S.brand, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontSize: 15, fontWeight: 800, color: S.n800, letterSpacing: '-0.02em', lineHeight: 1 }}>{children}</h2>
        {badge === 'ai'     && <AIBadge />}
        {badge === 'engine' && <EngineBadge />}
      </div>
      {sub && <p style={{ fontSize: 12, color: S.n400, marginTop: 6, marginLeft: 13 }}>{sub}</p>}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style: extra }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: S.white, borderRadius: 14, border: `1px solid ${S.n200}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' as const,
      padding: '24px 28px', ...extra,
    }}>
      {children}
    </div>
  )
}

// ─── Metric tile ──────────────────────────────────────────────────────────────
function Tile({ label, value, sub, color, mono }: { label: string; value: string; sub?: string; color?: string; mono?: boolean }) {
  return (
    <div style={{ background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '14px 16px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 900, color: color || S.n900, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: mono ? S.mono : S.font }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: S.n400, marginTop: 5 }}>{sub}</p>}
    </div>
  )
}

// ─── Data source badge ────────────────────────────────────────────────────────
function SourceBadge({ source, detail }: { source: string; detail?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 20, marginRight: 6, marginTop: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: S.n500, letterSpacing: '0.02em' }}>{source}</span>
      {detail && <span style={{ fontSize: 11, color: S.n400 }}>— {detail}</span>}
    </div>
  )
}

// ─── AI vs Engine attribution pills ─────────────────────────────────────────
// These are placed on every section heading so users always know whether a
// number was computed by the deterministic engine or written by an AI model.
function AIBadge() {
  return (
    <span title="This section is written by an AI language model. Qualitative analysis only — verify specific claims independently." style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 100,
      background: '#FEF3C7', border: '1px solid #FDE68A',
      fontSize: 10, fontWeight: 700, color: '#92400E',
      letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0,
      cursor: 'help',
    }}>
      AI Analysis
    </span>
  )
}

function EngineBadge() {
  return (
    <span title="This section is calculated by the deterministic compute engine using your inputs and verified benchmarks." style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 100,
      background: S.brandFaded, border: `1px solid ${S.brandBorder}`,
      fontSize: 10, fontWeight: 700, color: S.brand,
      letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0,
      cursor: 'help',
    }}>
      Engine
    </span>
  )
}

// ─── AI text sanitizer ───────────────────────────────────────────────────────
// Strips the most common hallucination patterns from AI-generated narrative:
// - Made-up specific percentages not derived from actual data fields
// - Invented year-over-year growth figures the AI has no source for
// - Fabricated suburb-specific statistics presented as facts
// Returns cleaned text, or the original if no risky patterns found.
function sanitizeAIText(text: string | null | undefined): string {
  if (!text) return ''
  let out = text

  // Remove invented annual growth/decline claims ("grew 23% since 2022", "up 18% year-on-year")
  // Keep round numbers like "growing market" but flag suspiciously precise invented stats
  // Pattern: "[digit(s)][%] [since|in|over|year|annually|YoY|y-o-y]"
  out = out.replace(/\b(\d{1,2}(?:\.\d)?%)\s+(since\s+\d{4}|year[- ]on[- ]year|YoY|y-o-y|annually|per annum|p\.a\.)\b/gi, (_, pct) =>
    `approximately ${pct} (market estimate)`
  )

  // Remove "X% of [suburb] residents/households" invented census claims
  out = out.replace(/\b(\d{1,2}(?:\.\d)?%)\s+of\s+(?:local\s+)?(?:residents?|households?|population|businesses?)\b/gi,
    (_match, pct) => `approximately ${pct} of local residents`
  )

  // Remove fabricated CAGR claims not from actual A3 data ("7.3% CAGR", "4.8% compound")
  // We keep these only if they came from the fiveYearForecast.estimated_cagr field (already displayed separately)
  out = out.replace(/\b(\d{1,2}(?:\.\d{1,2})?%)\s+(?:CAGR|compound(?:ed)?\s+annual(?:ly)?|compound\s+growth)\b/gi,
    () => 'compound annual growth (estimate)'
  )

  // Truncate extremely long AI narratives — a wall of unverified text is worse than a short hedged one
  if (out.length > 1200) {
    const sentences = out.match(/[^.!?]+[.!?]+/g) || [out]
    let truncated = ''
    for (const s of sentences) {
      if ((truncated + s).length > 1100) break
      truncated += s
    }
    out = truncated.trim() + (truncated.length < out.length ? ' [Analysis truncated — full detail in report data.]' : '')
  }

  return out.trim()
}

function SourceRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${S.n100}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0 }}>
      <span style={{ fontSize: 11, color: S.n400, fontWeight: 600, marginRight: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data</span>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECOMMENDATION PANEL — the most important new component
// ═══════════════════════════════════════════════════════════════════════════════
function RecommendationPanel({ report, confidence }: { report: Report; confidence: { level: string; pct: number; reasons: string[] } }) {
  const C = report.computed_result ?? null
  const vc = verdictCfg(report.verdict)
  const rd = safeResultData(report.result_data)
  const fin = rd.financials || {}
  const competitors = rd.competitors || null
  const router = useRouter()
  const normVerdict = normalizeVerdict(report.verdict)

  // ── Verdict label: when a gate was triggered, reframe CAUTION honestly ───────
  const gateTriggered = C?.verdictGateTriggered ?? null
  const isGateCaution = normVerdict === 'CAUTION' && gateTriggered != null
  const verdictDisplayLabel = isGateCaution ? 'PROCEED — VERIFY FIRST' : vc.label

  // ── Why reasons: use pre-computed verdictReasons from engine when available ──
  const whyReasons: string[] = (() => {
    // Engine v2: use validated, specific reasons from compute engine
    if (C?.verdictReasons && C.verdictReasons.length > 0) return C.verdictReasons

    // Legacy fallback: build from raw financial fields
    const reasons: string[] = []
    const rentPct = fin.rent?.toRevenuePercent
    if (rentPct != null) {
      if (rentPct <= 12) reasons.push(`Rent is ${rentPct}% of revenue — well within the safe zone`)
      else if (rentPct <= 20) reasons.push(`Rent is ${rentPct}% of revenue — manageable but leaves thin margins`)
      else reasons.push(`Rent is ${rentPct}% of revenue — exceeds the 20% danger threshold`)
    }
    const _whyCompCount = (competitors as any)?.validCount ?? competitors?.count
    const _whyRadius    = C?.competitorRadius ?? 500
    if (_whyCompCount != null) {
      if (_whyCompCount <= 5) reasons.push(`Only ${_whyCompCount} direct competitors within ${_whyRadius}m — low saturation`)
      else if (_whyCompCount <= 12) reasons.push(`${_whyCompCount} competitors within ${_whyRadius}m — moderate saturation, differentiation needed`)
      else reasons.push(`${_whyCompCount} competitors within ${_whyRadius}m — highly saturated market`)
    }
    // Confidence-aware: avoid exact $ amounts when data is benchmark only
    const _confLevel = confidence.level
    if (fin.monthlyNetProfit != null) {
      if (fin.monthlyNetProfit > 2000) reasons.push(_confLevel === 'high' ? `Projected net profit of ${fmt(fin.monthlyNetProfit)}/month at baseline demand` : 'Projected to be profitable at benchmark assumptions — verify with local sales data')
      else if (fin.monthlyNetProfit > 0) reasons.push('Marginal profitability at baseline — thin buffer, verify revenue assumptions locally')
      else reasons.push(`Negative profitability at baseline — business does not cover costs`)
    }
    const demographics = rd.demographics
    if (demographics?.medianIncome) {
      if (demographics.medianIncome >= 100000) reasons.push(`High-income area — strong local spending power`)
      else if (demographics.medianIncome >= 70000) reasons.push(`Moderate-income area — average consumer spending`)
      else reasons.push(`Lower-income area — price sensitivity likely, verify average spend assumptions`)
    }
    return reasons
  })()

  // ── Conditions: what needs to be true for this to work (gate-triggered) ──────
  const conditions: string[] = C?.verdictConditions ?? []

  // ── Failure modes: what kills this deal ──────────────────────────────────────
  const failureModes: string[] = C?.verdictFailureModes ?? []

  // ── Gate explanation copy ─────────────────────────────────────────────────────
  const gateExplain: Record<string, string> = {
    benchmark_default_confidence:   'Revenue is from benchmark estimates — verify against local sales data before signing a lease.',
    insufficient_data_completeness: 'Less than 25% of data points were live — the model is working with incomplete information.',
    declining_demand:               'Demand trend is declining in this category — timing and differentiation matter more than usual.',
    no_competitor_data:             'No competitor data was found — verify locally before assuming low competition.',
  }

  const actions: Array<{ label: string; onClick: () => void; primary?: boolean }> = []
  if (normVerdict === 'GO') {
    actions.push({ label: 'Download PDF report', onClick: () => {}, primary: true })
    actions.push({ label: 'Compare with another location', onClick: () => router.push('/onboarding') })
  } else if (normVerdict === 'CAUTION') {
    actions.push({ label: 'Adjust assumptions to test viability', onClick: () => document.getElementById('adjust-panel')?.scrollIntoView({ behavior: 'smooth' }), primary: true })
    actions.push({ label: 'Try a different location', onClick: () => router.push('/onboarding') })
  } else {
    actions.push({ label: 'Try a different location', onClick: () => router.push('/onboarding'), primary: true })
    actions.push({ label: 'Adjust assumptions', onClick: () => document.getElementById('adjust-panel')?.scrollIntoView({ behavior: 'smooth' }) })
  }

  return (
    <Card style={{
      padding: 0, marginBottom: 0,
      border: `1.5px solid ${vc.border}`,
      background: vc.bg,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 16px', borderBottom: `1px solid ${vc.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `${vc.text}18`, border: `1.5px solid ${vc.text}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: vc.text, fontFamily: S.mono, lineHeight: 1 }}>{report.overall_score}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: vc.text, letterSpacing: '0.04em' }}>{verdictDisplayLabel}</span>
                {!isGateCaution && <span style={{ fontSize: 12, color: vc.text, opacity: 0.6 }}>{vc.desc}</span>}
              </div>
              <p style={{ fontSize: 13, color: S.n700, marginTop: 2 }}>
                {report.business_type} — {report.location_name}
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 20,
            background: confidence.level === 'high' ? S.emeraldBg : confidence.level === 'medium' ? S.amberBg : S.redBg,
            border: `1px solid ${confidence.level === 'high' ? S.emeraldBdr : confidence.level === 'medium' ? S.amberBdr : S.redBdr}`,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidence.level === 'high' ? S.emerald : confidence.level === 'medium' ? S.amber : S.red }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: confidence.level === 'high' ? S.emerald : confidence.level === 'medium' ? S.amber : S.red }}>
              {confidence.pct}% data confidence
            </span>
          </div>
        </div>

        {/* Gate explanation — only shown when a gate overrode the verdict */}
        {isGateCaution && gateTriggered && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: `${S.amber}10`, border: `1px solid ${S.amberBdr}`, borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
              <span style={{ fontWeight: 800 }}>Why not GO: </span>
              {gateExplain[gateTriggered] ?? `Data gate triggered: ${gateTriggered.replace(/_/g, ' ')}.`}
            </p>
          </div>
        )}

        {/* Bottleneck one-liner — reads from compute engine, NO inline math */}
        {(() => {
          if (!C) return null
          // The compute engine already determines if revenue < totalCosts (loss scenario)
          // and if break-even is unreachable. We just surface that here.
          const projected = C.revenue
          const breakeven = C.totalCosts
          if (!projected || !breakeven) return null
          // Only show warning when projected revenue cannot cover costs
          if (projected >= breakeven) return null
          const deficit = breakeven - projected
          const msg = `Projected revenue of A$${projected.toLocaleString()}/mo falls short of estimated costs (A$${breakeven.toLocaleString()}/mo) by A$${deficit.toLocaleString()}/mo at baseline demand.`
          return (
            <div style={{ marginTop: 10, padding: '9px 14px', background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={S.red} strokeWidth="2.5" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p style={{ fontSize: 12, color: S.red, lineHeight: 1.55, fontWeight: 500 }}>{msg}</p>
            </div>
          )
        })()}
      </div>

      {/* Body: WHY + ACTIONS */}
      <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32 }}>
        {/* Left column: Why + Conditions + Failure modes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Why this verdict */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Why this verdict
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {whyReasons.slice(0, 5).map((reason, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: vc.text, marginTop: 6, flexShrink: 0, opacity: 0.6 }} />
                  <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.6 }}>{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions — "This works ONLY IF" */}
          {conditions.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                This works only if
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {conditions.slice(0, 4).map((cond, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', background: S.amberBg, borderRadius: 8, border: `1px solid ${S.amberBdr}` }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: S.amber, flexShrink: 0, marginTop: 2 }}>!</span>
                    <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>{cond}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failure modes */}
          {failureModes.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                This will fail if
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {failureModes.slice(0, 3).map((mode, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.red, marginTop: 6, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.6 }}>{mode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* What to do next */}
        <div style={{ minWidth: 220 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            What to do next
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                style={{
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: S.font, textAlign: 'left',
                  border: action.primary ? 'none' : `1.5px solid ${S.n200}`,
                  background: action.primary ? S.brand : S.white,
                  color: action.primary ? S.white : S.n700,
                  boxShadow: action.primary ? '0 2px 8px rgba(15,118,110,0.2)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {action.label} {action.primary ? ' →' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function ConfidencePanel({ confidence }: { confidence: { level: string; pct: number; reasons: string[] } }) {
  const color = confidence.level === 'high' ? S.emerald : confidence.level === 'medium' ? S.amber : S.red
  const bg = confidence.level === 'high' ? S.emeraldBg : confidence.level === 'medium' ? S.amberBg : S.redBg
  const border = confidence.level === 'high' ? S.emeraldBdr : confidence.level === 'medium' ? S.amberBdr : S.redBdr

  return (
    <Card style={{ padding: '20px 24px', marginBottom: 0, background: bg, border: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color }}>Data Confidence: {confidence.level.toUpperCase()}</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: S.mono }}>{confidence.pct}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.6)', borderRadius: 100, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${confidence.pct}%`, background: color, borderRadius: 100, transition: 'width 1s ease' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {confidence.reasons.map((r, i) => (
          <p key={i} style={{ fontSize: 12, color: S.n700, lineHeight: 1.5 }}>
            <span style={{ color, fontWeight: 700, marginRight: 6 }}>--</span>{r}
          </p>
        ))}
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTRADICTION BANNER — surfaces data conflicts caught by the trust layer
// ═══════════════════════════════════════════════════════════════════════════════
function ContradictionBanner({ computed }: { computed: import('@/types/computed').ComputedResult | null }) {
  if (!computed?.contradictions || computed.contradictions.length === 0) return null
  const errors   = computed.contradictions.filter(c => c.severity === 'error')
  const warnings = computed.contradictions.filter(c => c.severity === 'warning')
  if (errors.length === 0 && warnings.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {errors.map((c, i) => (
        <div key={i} style={{ padding: '12px 16px', background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.red} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: S.red, marginBottom: 2 }}>Data conflict detected</p>
            <p style={{ fontSize: 12, color: '#991B1B', lineHeight: 1.6 }}>{c.reason}</p>
            {c.affectedSections.length > 0 && (
              <p style={{ fontSize: 11, color: S.red, opacity: 0.7, marginTop: 4 }}>Affects: {c.affectedSections.join(', ')}</p>
            )}
          </div>
        </div>
      ))}
      {warnings.map((c, i) => (
        <div key={i} style={{ padding: '10px 14px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.amber} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>{c.reason}</p>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVENUE RANGE DISPLAY — honest uncertainty band instead of false precision
// ═══════════════════════════════════════════════════════════════════════════════
function RevenueRangeTile({ revenueRange }: { revenueRange: import('@/types/computed').RevenueRange | null | undefined }) {
  if (!revenueRange || revenueRange.uncertainty <= 0) return null
  const { low, high, uncertainty, source, note } = revenueRange
  const [expanded, setExpanded] = React.useState(false)
  return (
    <div style={{ background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '14px 16px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Monthly Revenue Range</p>
      <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: S.mono }}>
        {fmt(low)} – {fmt(high)}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
        <span style={{ fontSize: 11, color: S.n400 }}>±{uncertainty}% uncertainty</span>
        <span style={{ fontSize: 11, color: S.n400 }}>·</span>
        <button onClick={() => setExpanded(e => !e)} style={{ fontSize: 11, color: S.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: S.font, fontWeight: 600 }}>
          {expanded ? 'less' : 'why?'}
        </button>
      </div>
      {expanded && (
        <p style={{ fontSize: 11, color: S.n500, marginTop: 6, lineHeight: 1.6 }}>{note} Source: {source}.</p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION CONFIDENCE BADGE — shows per-tab trust level from sectionConfidence
// ═══════════════════════════════════════════════════════════════════════════════
function SectionConfBadge({ section }: { section: import('@/types/computed').SectionScore | null | undefined }) {
  if (!section) return null
  const color = section.label === 'high' ? S.emerald : section.label === 'medium' ? S.amber : section.label === 'insufficient' ? S.red : S.red
  const bg    = section.label === 'high' ? S.emeraldBg : section.label === 'medium' ? S.amberBg : S.redBg
  const bdr   = section.label === 'high' ? S.emeraldBdr : section.label === 'medium' ? S.amberBdr : S.redBdr
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: bg, border: `1px solid ${bdr}`, borderRadius: 20, marginBottom: 16 }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>
        {section.label.toUpperCase()} DATA — {section.score}% complete
        {section.gaps.length > 0 ? ` · missing: ${section.gaps.slice(0, 2).join(', ')}` : ''}
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXECUTIVE NARRATIVE — Investor-style "why this result happened" summary
// Generates a 4-sentence prose explanation from computed data.
// Placed at the top of the Overview tab, before financial cards.
// ═══════════════════════════════════════════════════════════════════════════════
function ExecutiveNarrative({ computed, report }: {
  computed: import('@/types/computed').ComputedResult | null
  report: Report
}) {
  const S2 = {
    font:   "'DM Sans','Helvetica Neue',Arial,sans-serif",
    brand:  '#0F766E', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
    n400: '#A8A29E', n500: '#78716C', n700: '#44403C', n900: '#1C1917',
    emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
    amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
    red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
    white: '#FFFFFF',
  }

  if (!computed) return null

  const bt         = (report.business_type ?? 'business').toLowerCase()
  const suburb     = report.location_name ?? report.address ?? 'this location'
  const verdict    = computed.verdict ?? 'CAUTION'
  const np         = computed.netProfit
  const revenue    = computed.revenue
  const rent       = report.monthly_rent ?? 0
  const breakEven  = computed.breakEvenDaily
  const dailyCust  = computed.dailyCustomers
  const compCount  = computed.validCompetitorCount ?? 0
  const reasons    = computed.verdictReasons ?? []
  const conditions = computed.verdictConditions ?? []
  const failures   = computed.verdictFailureModes ?? []

  // Derive confidence tier from computed — same logic as main component
  const _narrativeTier: import('@/lib/compute/display-discipline').ConfidenceTier =
    computed.modelConfidence === 'high' ? 'high'
    : computed.modelConfidence === 'medium' ? 'medium'
    : computed.modelConfidence === 'benchmark_default' ? 'benchmark_default'
    : 'low'

  // Pull specific model fields for data-cited narrative
  const costs        = computed.totalCosts ?? null
  const costBd       = computed.costBreakdown ?? null
  const revSrc       = computed.provenance?.revenue?.sourceLabel ?? null
  const compSrc      = computed.competitorDataQuality === 'live_verified' ? 'Google Places' : null
  const demandScore  = computed.scores?.demand ?? null
  const rentPct      = (rent > 0 && revenue && revenue > 0) ? Math.round(rent / revenue * 100) : null
  const topCostDriver = costBd
    ? (Object.entries({ Staff: costBd.staff ?? 0, 'COGS': costBd.cogs ?? 0, 'Rent': costBd.rent ?? 0, 'Other': costBd.other ?? 0 })
        .sort((a, b) => b[1] - a[1])[0])
    : null

  // ── Sentence 1: Revenue vs costs — cite source ───────────────────────────────
  const s1 = (() => {
    if (np == null || revenue == null) return `This ${bt} in ${suburb} could not be fully modelled — revenue or cost data was missing.`
    const revDisplay = displayMoney(revenue, _narrativeTier).display
    const srcNote    = _narrativeTier === 'benchmark_default' ? ` (${revSrc ?? 'industry benchmark'} — not verified locally)` : revSrc ? ` (${revSrc})` : ''
    if (np >= 0) {
      const npNote = _narrativeTier === 'high' ? ` — A$${Math.round(np).toLocaleString('en-AU')}/month net` : ''
      return `At ${revDisplay}/month revenue${srcNote}, estimated costs of ${costs != null ? displayMoney(costs, _narrativeTier).display : 'N/A'}/month leave this ${bt} in ${suburb} with a ${np === 0 ? 'break-even' : 'positive'} margin${npNote}.`
    } else {
      const gap = Math.abs(np)
      const gapNote = _narrativeTier === 'high' ? `A$${Math.round(gap).toLocaleString('en-AU')}` : `~A$${Math.round(gap / 1000)}k`
      return `Revenue of ${revDisplay}/month${srcNote} falls ${gapNote}/month short of estimated costs${costs != null ? ` (${displayMoney(costs, _narrativeTier).display})` : ''}${topCostDriver && topCostDriver[1] > 0 ? ` — ${topCostDriver[0]} is the largest cost at ${displayMoney(topCostDriver[1], _narrativeTier).display}/month` : ''}.`
    }
  })()

  // ── Sentence 2: Competition — cite source and count ──────────────────────────
  const s2 = compCount > 0
    ? `${Math.round(compCount)} ${bt} competitor${Math.round(compCount) === 1 ? '' : 's'} confirmed within ${computed.competitorRadius ?? 600}m${compSrc ? ` via ${compSrc}` : ''} — ${compCount > 10 ? 'a highly saturated market' : compCount > 5 ? 'moderate competitive pressure' : 'limited direct competition'}.`
    : null

  // ── Sentence 3: Demand — cite score if available ─────────────────────────────
  const s3 = (() => {
    if (breakEven != null && breakEven > 0 && dailyCust != null) {
      const gap = dailyCust - breakEven
      if (gap < 0) return `Model projects ${dailyCust} customers/day — ${Math.abs(gap)} short of the ${breakEven}/day needed to cover fixed costs.`
      return `At ${dailyCust} projected customers/day, the location clears the ${breakEven}/day break-even threshold by ${gap} customers.`
    }
    if (demandScore != null) return `Demand score: ${demandScore}/100${demandScore < 50 ? ' — below the threshold for confident revenue forecasting in this area' : ' — consistent with reasonable footfall assumptions'}.`
    return null
  })()

  // ── Sentence 4: Rent ratio — always data-anchored ────────────────────────────
  const s4 = rentPct != null
    ? `Rent (A$${rent.toLocaleString('en-AU')}/month) is ${rentPct}% of estimated revenue — ${rentPct <= 10 ? 'well within the safe zone' : rentPct <= 15 ? 'manageable' : rentPct <= 20 ? 'above typical thresholds — leaves thin margins' : 'a red flag — exceeds the 20% danger zone'}.`
    : null

  const verdictColor = verdict === 'GO' ? S2.emerald : verdict === 'NO' ? S2.red : S2.amber
  const verdictBg    = verdict === 'GO' ? S2.emeraldBg : verdict === 'NO' ? S2.redBg : S2.amberBg
  const verdictBdr   = verdict === 'GO' ? S2.emeraldBdr : verdict === 'NO' ? S2.redBdr : S2.amberBdr

  return (
    <div style={{
      padding: '20px 24px', background: verdict === 'GO' ? S2.emeraldBg : verdict === 'NO' ? S2.redBg : S2.amberBg,
      border: `1px solid ${verdictBdr}`, borderRadius: 12, fontFamily: S2.font
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ padding: '3px 10px', borderRadius: 6, background: verdictColor, color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em' }}>
          {verdict}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: S2.n900 }}>Executive Summary</span>
        <span style={{ fontSize: 11, color: S2.n400, marginLeft: 'auto' }}>Generated from {computed.meta?.engineVersion ?? 'engine'}</span>
      </div>

      {/* Data-cited narrative: each sentence explicitly traces to a model output */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 14, color: S2.n700, lineHeight: 1.65, margin: 0 }}>{s1}</p>
        {s2 && <p style={{ fontSize: 13, color: S2.n700, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{s2}</p>}
        {s3 && <p style={{ fontSize: 13, color: S2.n700, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{s3}</p>}
        {s4 && <p style={{ fontSize: 13, color: S2.n700, lineHeight: 1.6, margin: 0, opacity: 0.9 }}>{s4}</p>}
      </div>

      {(conditions.length > 0 || failures.length > 0) && (
        <div style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
          {conditions.length > 0 && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: verdictColor, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 6 }}>
                This works if
              </p>
              {conditions.slice(0, 2).map((c, i) => (
                <p key={i} style={{ fontSize: 12, color: S2.n700, lineHeight: 1.5, marginBottom: 4, paddingLeft: 10, borderLeft: `2px solid ${verdictColor}` }}>
                  {c}
                </p>
              ))}
            </div>
          )}
          {failures.length > 0 && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S2.red, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 6 }}>
                This fails if
              </p>
              {failures.slice(0, 2).map((f, i) => (
                <p key={i} style={{ fontSize: 12, color: S2.n700, lineHeight: 1.5, marginBottom: 4, paddingLeft: 10, borderLeft: `2px solid ${S2.red}` }}>
                  {typeof f === 'string' ? f : (f as any).trigger ?? String(f)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA QUALITY HEADER — Stripe-style transparency strip
// Shows: live vs estimated, source per dimension, alerts for rejected/adjusted data
// Expandable to full model-decisions audit trail
// ═══════════════════════════════════════════════════════════════════════════════
function DataQualityHeader({ computed, report }: {
  computed: import('@/types/computed').ComputedResult | null
  report: Report
}) {
  const C = computed
  if (!C) return null
  const rejected  = (C.meta.computeLog.rejectedValues ?? []) as Array<{ field: string; reason: string; agentValue?: number }>
  const hasIssues = !!(C.verdictGateTriggered || rejected.length > 0 || C.competitorPressure?.revenueAdjusted)
  const [expanded, setExpanded] = React.useState(hasIssues)

  const log      = C.meta.computeLog
  const complete = C.dataCompleteness
  const isLive   = C.modelConfidence !== 'benchmark_default'
  const pressure = C.competitorPressure
  const gate     = C.verdictGateTriggered

  const srcRev   = log.revenueSource ?? 'unknown'
  const srcCosts = log.costsSource   ?? 'unknown'
  const compQ    = C.competitorDataQuality
  const rawComp  = log.rawCompetitorCount ?? 0
  const valComp  = log.validatedCompetitorCount ?? 0
  const hasDemand = C.marketSignals.demandScore != null

  const revLabel  = srcRev  === 'a5_live' ? 'A5 live' : srcRev  === 'a5_blended' ? 'A5 blended' : srcRev  === 'a4_fallback' ? 'A4 model' : 'industry avg'
  const costLabel = srcCosts === 'a4_live' ? 'A4 live' : srcCosts === 'a4_blended' ? 'A4 blended' : 'industry avg'

  const modeColor = isLive ? '#059669' : '#D97706'
  const modeBg    = isLive ? '#ECFDF5' : '#FFFBEB'
  const modeBdr   = isLive ? '#A7F3D0' : '#FCD34D'
  const modeLabel = isLive ? 'LIVE DATA' : 'ESTIMATED'

  const alerts = []
  if (gate)             alerts.push({ label: 'VERDICT DOWNGRADED', bg: '#FEF3C7', bdr: '#FCD34D', color: '#B45309' })
  if (rejected.length)  alerts.push({ label: `${rejected.length} VALUE${rejected.length > 1 ? 'S' : ''} REJECTED`, bg: '#FEF2F2', bdr: '#FCA5A5', color: '#DC2626' })
  if (pressure?.revenueAdjusted) alerts.push({ label: 'REVENUE ADJUSTED', bg: '#EFF6FF', bdr: '#BFDBFE', color: '#2563EB' })

  const chips = [
    { k: 'Revenue',     v: revLabel,  ok: srcRev  !== 'benchmark_default' },
    { k: 'Costs',       v: costLabel, ok: srcCosts !== 'benchmark_default' },
    {
      k: 'Competition',
      v: compQ === 'live_verified'
        ? `${valComp} verified`
        : compQ === 'partial' ? 'partial'
        : rawComp > 0 ? `${rawComp} raw, 0 matched` : 'no data',
      ok: compQ === 'live_verified' || compQ === 'partial',
    },
    { k: 'Market', v: hasDemand ? 'A3 data' : 'estimated', ok: hasDemand },
  ]

  return (
    <div style={{ background: '#FAFAFA', border: '1px solid #E7E5E4', borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
      {/* ── Collapsed header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', flexWrap: 'wrap' }}>
        {/* Mode badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: modeBg, border: `1px solid ${modeBdr}`, borderRadius: 20, flexShrink: 0 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: modeColor }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: modeColor, letterSpacing: '0.07em' }}>{modeLabel}</span>
        </div>
        {/* Completeness */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: '#A8A29E' }}>{complete}% live</span>
          <div style={{ width: 52, height: 4, background: '#E7E5E4', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${complete}%`, background: modeColor, borderRadius: 4 }} />
          </div>
        </div>
        {/* Source chips */}
        <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {chips.map(s => (
            <div key={s.k} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#A8A29E' }}>{s.k}:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.ok ? '#059669' : '#D97706' }}>{s.v}</span>
            </div>
          ))}
        </div>
        {/* Alert badges */}
        {alerts.length > 0 && (
          <div style={{ display: 'flex', gap: 5 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ padding: '2px 7px', background: a.bg, border: `1px solid ${a.bdr}`, borderRadius: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: a.color }}>{a.label}</span>
              </div>
            ))}
          </div>
        )}
        {/* Expand toggle */}
        <button onClick={() => setExpanded(e => !e)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
          fontSize: 11, color: '#78716C', fontFamily: S.font, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
        }}>
          How this was built {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* ── Expanded audit trail ── */}
      {expanded && (
        <div style={{ borderTop: '1px solid #E7E5E4', padding: '18px 20px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Model Decisions — what the engine used and why</p>

          {/* Revenue */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, padding: '10px 14px', background: srcRev === 'benchmark_default' ? '#FFFBEB' : '#F0FDF4', borderRadius: 8, border: `1px solid ${srcRev === 'benchmark_default' ? '#FCD34D' : '#A7F3D0'}` }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Revenue</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: srcRev !== 'benchmark_default' ? '#059669' : '#D97706' }}>{revLabel}</p>
            </div>
            <p style={{ fontSize: 12, color: '#44403C', lineHeight: 1.6 }}>
              {srcRev === 'a5_live'      && 'A5 market agent returned verified revenue data — within 25% of industry benchmark. Used directly.'}
              {srcRev === 'a5_blended'   && `A5 revenue diverged ${log.revenueDiffPct != null ? Math.round(log.revenueDiffPct) + '%' : ''} from benchmark (25–60% band). Blended to reduce single-source risk.`}
              {srcRev === 'a4_fallback'  && 'A5 revenue unavailable. A4 cost model estimated revenue as a fallback — lower confidence than live market data.'}
              {srcRev === 'benchmark_default' && `No live revenue data available. Using Australian ${(report.business_type ?? 'business').toLowerCase()} industry average (${fmt(C.revenue)}/month). Uncertainty: ±40%.`}
            </p>
          </div>

          {/* Costs */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, padding: '10px 14px', background: srcCosts === 'benchmark_default' ? '#FFFBEB' : '#F0FDF4', borderRadius: 8, border: `1px solid ${srcCosts === 'benchmark_default' ? '#FCD34D' : '#A7F3D0'}` }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Costs</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: srcCosts !== 'benchmark_default' ? '#059669' : '#D97706' }}>{costLabel}</p>
            </div>
            <p style={{ fontSize: 12, color: '#44403C', lineHeight: 1.6 }}>
              {srcCosts === 'a4_live'    && 'A4 agent returned total monthly costs within acceptable range. Used directly.'}
              {srcCosts === 'a4_blended' && `A4 cost data diverged from industry benchmark. Blended for a more conservative estimate.`}
              {srcCosts === 'benchmark_default' && `No A4 cost data returned. Costs modelled from industry benchmarks for ${(report.business_type ?? 'business').toLowerCase()}s at this rent level.`}
            </p>
          </div>

          {/* Competition */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, padding: '10px 14px', background: compQ === 'no_data' ? '#FEF2F2' : '#EFF6FF', borderRadius: 8, border: `1px solid ${compQ === 'no_data' ? '#FCA5A5' : '#BAE6FD'}` }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Competition</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: compQ === 'live_verified' ? '#059669' : '#D97706' }}>
                {compQ === 'live_verified' ? `${valComp} verified` : compQ === 'partial' ? 'partial data' : 'no match'}
              </p>
            </div>
            <p style={{ fontSize: 12, color: '#44403C', lineHeight: 1.6 }}>
              {rawComp > 0 && valComp === 0
                ? `A1 returned ${rawComp} nearby businesses. 0 passed the ${(report.business_type ?? 'business').toLowerCase()} category filter — all were unrelated business types. This means no confirmed direct competitors, which may reflect genuine scarcity or a category mismatch in the data.`
                : rawComp === 0
                ? 'A1 returned no competitor data for this area. Competition level cannot be assessed from this report alone — ground-truth verification recommended.'
                : `A1 returned ${rawComp} businesses, ${valComp} matched the category filter and were used for scoring.`
              }
            </p>
          </div>

          {/* Competitor pressure */}
          {pressure != null && (
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, padding: '10px 14px', background: pressure.revenueAdjusted ? '#EFF6FF' : '#F9FAFB', borderRadius: 8, border: `1px solid ${pressure.revenueAdjusted ? '#BFDBFE' : '#E7E5E4'}` }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Comp. Pressure</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: pressure.revenueAdjusted ? '#2563EB' : '#A8A29E' }}>
                  {pressure.revenueAdjusted ? `−${Math.round((1 - pressure.pressureFactor) * 100)}% applied` : 'none'}
                </p>
              </div>
              <p style={{ fontSize: 12, color: '#44403C', lineHeight: 1.6 }}>
                {pressure.revenueAdjusted
                  ? `Nearby competitor density (${pressure.rawCount500m} businesses within ${C.competitorRadius ?? 500}m) triggered a revenue reduction of ${Math.round((1 - pressure.pressureFactor) * 100)}%. Without this, projected revenue would be ${fmt(Math.round(C.revenue / pressure.pressureFactor))}/month.`
                  : 'No competitor density adjustment applied. Revenue projection reflects the raw model output without pressure discounting.'
                }
              </p>
            </div>
          )}

          {/* Rejected values */}
          {rejected.length > 0 && (
            <div style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FCA5A5' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>
                {rejected.length} AI-supplied value{rejected.length > 1 ? 's were' : ' was'} rejected and replaced with industry benchmarks:
              </p>
              {rejected.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < rejected.length - 1 ? 6 : 0 }}>
                  <span style={{ fontSize: 11, color: '#B91C1C', fontWeight: 700, minWidth: 130, flexShrink: 0 }}>{r.field.replace(/_/g, ' ')}</span>
                  <span style={{ fontSize: 11, color: '#7F1D1D', lineHeight: 1.5 }}>{r.reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Verdict gate */}
          {gate && (
            <div style={{ padding: '10px 14px', background: '#FFF7ED', borderRadius: 8, border: '1px solid #FED7AA' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#EA580C', marginBottom: 4 }}>Verdict was downgraded by the trust layer</p>
              <p style={{ fontSize: 12, color: '#7C2D12', lineHeight: 1.6 }}>
                {gate === 'benchmark_default_confidence' && 'All financial data is based on industry benchmarks — no live revenue or cost data was available. A GO verdict requires at minimum one verified data source.'}
                {gate === 'insufficient_data_completeness' && `Data completeness is ${complete}% — below the 25% threshold required for a confident forward-looking verdict.`}
                {gate === 'declining_demand' && 'Market demand trend is declining. Entering a contracting market requires demonstrated differentiation — the engine conservatively downgrades GO verdicts under declining demand.'}
                {gate === 'no_competitor_data' && 'Competitor data was unavailable. Without knowing the competitive landscape, a GO verdict cannot be validated.'}
                {!['benchmark_default_confidence','insufficient_data_completeness','declining_demand','no_competitor_data'].includes(gate) && gate}
              </p>
            </div>
          )}

          <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 4, lineHeight: 1.5 }}>
            Locatalyze Engine v{C.meta.engineVersion} · Computed {new Date(C.meta.computedAt).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'short', timeStyle: 'short' })}
          </p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEY INSIGHTS — synthesised, data-backed insight cards (the "worth paying for" section)
// ═══════════════════════════════════════════════════════════════════════════════
function KeyInsights({ report, computed, fin, competitors, market }: {
  report: Report
  computed: import('@/types/computed').ComputedResult | null
  fin: any
  competitors: any
  market: any
}) {
  const C = computed
  const insights: Array<{ headline: string; detail: string; severity: 'positive' | 'warning' | 'critical' | 'neutral'; source: string }> = []
  const _bt = (report.business_type ?? 'business').toLowerCase()

  // ── Insight 1: Competition landscape ────────────────────────────────────────
  if (C?.marketIntelligence) {
    const mi = C.marketIntelligence
    const total = C.validCompetitorCount
    const radius = C.competitorRadius ?? 500
    if (total > 0) {
      const strongText = mi.strongCount > 0 ? `${mi.strongCount} are strong operators` : 'none are strong operators'
      const severity = mi.saturationBand === 'high' || mi.saturationBand === 'very_high' ? 'critical' as const
        : mi.saturationBand === 'moderate' ? 'warning' as const : 'positive' as const
      insights.push({
        headline: `${total} competitors within ${radius}m — ${strongText}`,
        detail: mi.strongCount >= 3
          ? `High-threat environment. ${mi.strongCount} established operators with strong ratings and review volume. Premium positioning or niche differentiation required to compete.`
          : mi.strongCount === 0
          ? `Competitors are primarily weak or unrated. This is an opportunity if you can deliver quality above the current market standard.`
          : `Mixed competitive landscape. Focus on outperforming the ${mi.weakCount} weak operators while differentiating from the ${mi.strongCount} strong one${mi.strongCount > 1 ? 's' : ''}.`,
        severity,
        source: C.competitorPressure?.sources?.join(' + ') ?? 'A1 agent'
      })
    } else {
      insights.push({
        headline: `No direct ${_bt} competitors found within ${radius}m`,
        detail: 'This may indicate an underserved market or a data gap. Visit the area to verify before assuming low competition.',
        severity: 'neutral',
        source: 'competitor scan'
      })
    }
  }

  // ── Insight 2: Revenue reality check ────────────────────────────────────────
  if (C?.revenueRange) {
    const rr = C.revenueRange
    const isBenchmark = C.provenance?.revenue?.isBenchmark ?? false
    insights.push({
      headline: `Revenue estimated at ${fmt(rr.low)}–${fmt(rr.high)}/month (±${rr.uncertainty}%)`,
      detail: isBenchmark
        ? `This is a benchmark estimate based on Australian ${_bt} industry averages — not validated against local sales data. Verify with comparable venues before committing to a lease.`
        : `Based on market demand analysis with ${rr.uncertainty}% confidence band. The central estimate of ${fmt(rr.mid)}/month assumes ${C.dailyCustomers} daily customers at ${fmt(C.avgTicketSize)} average ticket.`,
      severity: isBenchmark ? 'warning' : 'neutral',
      source: C.provenance?.revenue?.sourceLabel ?? 'financial model'
    })
  }

  // ── Insight 3: Rent pressure ────────────────────────────────────────────────
  const rentPct = fin?.rent?.toRevenuePercent
  if (rentPct != null && rentPct > 0) {
    insights.push({
      headline: `Rent is ${rentPct.toFixed(1)}% of projected revenue${rentPct > 20 ? ' — exceeds safe threshold' : ''}`,
      detail: rentPct <= 12
        ? 'Well within the industry safe zone (under 12%). Leaves healthy margin for operating costs and profit.'
        : rentPct <= 20
        ? 'Manageable but tight. Industry benchmark is under 12%. Consider negotiating a lower base rent or revenue-share structure.'
        : 'Above the 20% danger threshold. At this ratio, even small revenue drops will push the business into loss. Negotiate rent down or find cheaper premises.',
      severity: rentPct <= 12 ? 'positive' : rentPct <= 20 ? 'warning' : 'critical',
      source: 'user input + financial model'
    })
  }

  // ── Insight 4: Market gap or opportunity ────────────────────────────────────
  if (C?.marketIntelligence?.marketGapNote) {
    insights.push({
      headline: 'Market gap detected',
      detail: C.marketIntelligence.marketGapNote,
      severity: 'positive',
      source: 'competitor analysis'
    })
  }

  // ── Insight 5: Demand trend ─────────────────────────────────────────────────
  if (C?.marketSignals?.demandTrend) {
    const trend = C.marketSignals.demandTrend
    insights.push({
      headline: `${_bt.charAt(0).toUpperCase() + _bt.slice(1)} demand is ${trend} in this area`,
      detail: trend === 'growing'
        ? 'Rising demand supports new market entry. Focus on capturing share while the market expands.'
        : trend === 'declining'
        ? 'Declining demand means the market is contracting. New entrants face higher risk — you need to take share from existing operators, not ride market growth.'
        : 'Stable demand means the market is mature. Growth will come from taking share, not market expansion. Differentiation is essential.',
      severity: trend === 'growing' ? 'positive' : trend === 'declining' ? 'critical' : 'neutral',
      source: 'market analysis (A3)'
    })
  }

  // ── Insight 6: Data confidence warning (only if low) ────────────────────────
  if (C && C.dataCompleteness < 50) {
    const gaps = C.sectionConfidence
      ? Object.entries(C.sectionConfidence)
          .filter(([, v]) => v.label === 'low' || v.label === 'insufficient')
          .map(([k]) => k)
      : []
    insights.push({
      headline: `Report based on ${C.dataCompleteness}% live data — treat numbers as directional`,
      detail: gaps.length > 0
        ? `Low confidence in: ${gaps.join(', ')}. Remaining data filled from industry benchmarks. Use this report for initial screening, not final commitment.`
        : 'Significant data gaps filled with industry benchmarks. Verify key assumptions locally before making financial commitments.',
      severity: 'warning',
      source: 'data quality assessment'
    })
  }

  if (insights.length === 0) return null

  const severityStyle = (sev: string) => {
    switch (sev) {
      case 'positive': return { bg: S.emeraldBg, border: S.emeraldBdr, dot: S.emerald, text: '#065F46' }
      case 'warning':  return { bg: S.amberBg,   border: S.amberBdr,   dot: S.amber,   text: '#92400E' }
      case 'critical': return { bg: S.redBg,     border: S.redBdr,     dot: S.red,     text: '#991B1B' }
      default:         return { bg: S.n50,       border: S.n200,       dot: S.n500,    text: S.n700 }
    }
  }

  return (
    <Card>
      <SectionHeading sub="Data-backed findings — ordered by impact on your decision.">Key Insights</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.slice(0, 6).map((insight, i) => {
          const ss = severityStyle(insight.severity)
          return (
            <div key={i} style={{
              padding: '16px 20px', borderRadius: 12,
              background: ss.bg, border: `1px solid ${ss.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: ss.dot, marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: ss.text, lineHeight: 1.4, marginBottom: 6 }}>{insight.headline}</p>
                  <p style={{ fontSize: 13, color: ss.text, lineHeight: 1.7, opacity: 0.85 }}>{insight.detail}</p>
                  <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'rgba(255,255,255,0.5)', borderRadius: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: ss.dot, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{insight.source}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISION ENGINE — "Should You Open Here?" (THE premium section)
// ═══════════════════════════════════════════════════════════════════════════════
function DecisionEngine({ report, computed, fin, competitors, market, demographics: demoProp }: {
  report: Report
  computed: import('@/types/computed').ComputedResult | null
  fin: any; competitors: any; market: any; demographics?: any
}) {
  const C = computed
  const _bt = (report.business_type ?? 'business').toLowerCase()
  const normVerdict = normalizeVerdict(report.verdict)
  const vc = verdictCfg(report.verdict)

  // ── PROCEED reasons (green) ─────────────────────────────────────────────────
  const proceedReasons: Array<{ data: string; implication: string; action: string }> = []
  const avoidReasons: Array<{ data: string; implication: string; action: string }> = []
  const conditions: string[] = []
  const failureModes: string[] = []

  // Competition
  const mi = C?.marketIntelligence
  const compCount = C?.validCompetitorCount ?? (competitors as any)?.validCount ?? 0
  const strongCount = mi?.strongCount ?? 0
  const weakCount = mi?.weakCount ?? 0
  const radius = C?.competitorRadius ?? 500

  if (compCount <= 5 && compCount > 0) {
    proceedReasons.push({
      data: `Only ${compCount} competitor${compCount !== 1 ? 's' : ''} within ${radius}m`,
      implication: 'Low saturation means lower customer acquisition cost and faster brand awareness',
      action: 'Focus on visibility and convenience rather than aggressive pricing'
    })
  } else if (compCount > 12) {
    avoidReasons.push({
      data: `${compCount} competitors within ${radius}m (${strongCount} strong)`,
      implication: 'Customer acquisition will be expensive and slow in this density',
      action: 'Enter only with strong differentiation, niche positioning, or superior location within the strip'
    })
  } else if (compCount > 5) {
    if (strongCount <= 1) {
      proceedReasons.push({
        data: `${compCount} competitors but only ${strongCount} strong operator`,
        implication: 'Most existing players are weak — opportunity to become the area leader',
        action: 'Invest in quality and reviews from day one to establish dominance'
      })
    }
  }

  // Revenue + rent — computed_result is authoritative; fin is already mapped from C in v2 path
  const netProfit = C?.netProfit ?? fin?.monthlyNetProfit ?? null
  const revenue = C?.revenue ?? fin?.monthlyRevenue ?? null
  // Rent-to-revenue: prefer computed value; fin.rent.toRevenuePercent is mapped from C in v2
  const rentPct = C && revenue && revenue > 0 && (report.monthly_rent ?? 0) > 0
    ? Math.round((report.monthly_rent! / revenue) * 1000) / 10
    : (fin?.rent?.toRevenuePercent ?? null)
  const isBenchmark = C?.provenance?.revenue?.isBenchmark ?? fin?.isEstimated

  if (netProfit != null && netProfit > 5000) {
    proceedReasons.push({
      data: `Projected net profit of ${fmt(netProfit)}/month`,
      implication: `Breakeven within ${C?.breakEvenMonths ?? '--'} months, building equity quickly`,
      action: 'Lock in a 3+ year lease with capped annual increases to protect this margin'
    })
  } else if (netProfit != null && netProfit < 0) {
    avoidReasons.push({
      data: `Projected net loss of ${fmt(Math.abs(netProfit))}/month at baseline`,
      implication: 'The business loses money from day one unless assumptions change significantly',
      action: 'Do not sign a lease at this rent — renegotiate rent or increase average ticket size'
    })
  }

  if (rentPct != null && rentPct > 20) {
    avoidReasons.push({
      data: `Rent consumes ${rentPct.toFixed(1)}% of projected revenue`,
      implication: 'Industry safe threshold is 8–15%. At this ratio, a 10% revenue dip wipes out profit',
      action: `Negotiate rent below ${fmt(Math.round((revenue ?? 0) * 0.15))}/month or find cheaper premises`
    })
  } else if (rentPct != null && rentPct <= 12) {
    proceedReasons.push({
      data: `Rent is ${rentPct.toFixed(1)}% of projected revenue`,
      implication: 'Well within the safe zone — leaves healthy margin for staff, COGS, and profit',
      action: 'This cost structure is sustainable even with revenue fluctuations'
    })
  }

  // Demand
  const demandTrend = C?.marketSignals?.demandTrend ?? market?.demandTrend
  if (demandTrend === 'growing') {
    proceedReasons.push({
      data: `${_bt.charAt(0).toUpperCase() + _bt.slice(1)} demand is growing in this area`,
      implication: 'Market is expanding — new entrants can grow with the market rather than stealing share',
      action: 'Time entry for early mover advantage before competitors notice the trend'
    })
  } else if (demandTrend === 'declining') {
    avoidReasons.push({
      data: `${_bt.charAt(0).toUpperCase() + _bt.slice(1)} demand is declining in this area`,
      implication: 'Shrinking pie — you must take customers from existing operators who have loyalty',
      action: 'Only proceed with a significantly differentiated concept that creates its own demand'
    })
  }

  // Demographics — use the prop (already parsed in parent), never raw result_data
  const income = demoProp?.median_income ?? demoProp?.medianIncome ?? null
  if (income && income < 55000) {
    avoidReasons.push({
      data: `Median household income is $${Math.round(income / 1000)}k/year`,
      implication: 'Lower spending power limits average ticket size and visit frequency',
      action: 'Price aggressively or target volume over margin'
    })
  }

  // Conditions from engine
  if (C?.verdictConditions) conditions.push(...C.verdictConditions)
  if (conditions.length === 0) {
    if (C?.breakEvenDaily) conditions.push(`Achieve ${C.breakEvenDaily} customers/day consistently within 3 months`)
    if (revenue) conditions.push(`Maintain monthly revenue above ${fmt(Math.round(revenue * 0.80))}`)
    if (strongCount > 2) conditions.push('Offer a clear point of differentiation from the ' + strongCount + ' strong operators')
  }

  // Failure modes from engine
  if (C?.verdictFailureModes) failureModes.push(...C.verdictFailureModes)
  if (failureModes.length === 0) {
    failureModes.push('Slow customer ramp (under 60% of target by month 3) burns through working capital')
    if (rentPct != null && rentPct > 15) failureModes.push(`Rent increase at next renewal above ${fmt(Math.round((report.monthly_rent ?? 0) * 1.15))}/month flips to loss`)
    failureModes.push('A strong competitor opening within 200m would split the existing customer base')
  }

  // Honesty badge
  const hasData = proceedReasons.length > 0 || avoidReasons.length > 0

  if (!hasData) return null

  return (
    <Card style={{
      padding: 0, border: `2px solid ${vc.border}`,
      background: `linear-gradient(135deg, ${vc.bg} 0%, ${S.white} 100%)`,
    }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${vc.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${vc.text}15`, border: `2px solid ${vc.text}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 20 }}>{normVerdict === 'GO' ? '\u2714' : normVerdict === 'NO' ? '\u2718' : '\u26A0'}</span>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: vc.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Decision Analysis</p>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Should you open {report.business_type === 'Other' ? 'a business' : `a ${_bt}`} here?
            </h2>
          </div>
        </div>
        {isBenchmark && (
          <div style={{ marginTop: 14, padding: '8px 14px', background: `${S.amber}10`, border: `1px solid ${S.amberBdr}`, borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
              Financial projections use industry benchmarks, not local sales data. Treat numbers as directional, not precise.
            </p>
          </div>
        )}
      </div>

      {/* Two-column: Proceed vs Avoid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* Reasons to proceed */}
        <div style={{ padding: '24px 28px', borderRight: `1px solid ${S.n200}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.emerald }} />
            <p style={{ fontSize: 13, fontWeight: 800, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Reasons to proceed ({proceedReasons.length})
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {proceedReasons.slice(0, 4).map((r, i) => (
              <div key={i}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#065F46', lineHeight: 1.4, marginBottom: 4 }}>{r.data}</p>
                <p style={{ fontSize: 12, color: '#065F46', opacity: 0.75, lineHeight: 1.6, marginBottom: 4 }}>{r.implication}</p>
                <p style={{ fontSize: 12, color: S.emerald, fontWeight: 600 }}>\u2192 {r.action}</p>
              </div>
            ))}
            {proceedReasons.length === 0 && (
              <p style={{ fontSize: 13, color: S.n400 }}>No strong proceed signals detected for this location.</p>
            )}
          </div>
        </div>

        {/* Reasons to avoid */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.red }} />
            <p style={{ fontSize: 13, fontWeight: 800, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Reasons to avoid ({avoidReasons.length})
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {avoidReasons.slice(0, 4).map((r, i) => (
              <div key={i}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', lineHeight: 1.4, marginBottom: 4 }}>{r.data}</p>
                <p style={{ fontSize: 12, color: '#991B1B', opacity: 0.75, lineHeight: 1.6, marginBottom: 4 }}>{r.implication}</p>
                <p style={{ fontSize: 12, color: S.red, fontWeight: 600 }}>\u2192 {r.action}</p>
              </div>
            ))}
            {avoidReasons.length === 0 && (
              <p style={{ fontSize: 13, color: S.n400 }}>No major red flags detected for this location.</p>
            )}
          </div>
        </div>
      </div>

      {/* Conditions + Failure modes */}
      <div style={{ borderTop: `1px solid ${S.n200}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ padding: '20px 28px', borderRight: `1px solid ${S.n200}` }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            This works only if
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {conditions.slice(0, 4).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: S.amber, fontWeight: 800, fontSize: 11, marginTop: 2, flexShrink: 0 }}>IF</span>
                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '20px 28px' }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            This will fail if
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {failureModes.slice(0, 3).map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: S.red, fontWeight: 800, fontSize: 11, marginTop: 2, flexShrink: 0 }}>\u26A0</span>
                <p style={{ fontSize: 12, color: '#991B1B', lineHeight: 1.6 }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPETITIVE POSITIONING — how to enter this market
// ═══════════════════════════════════════════════════════════════════════════════
function CompetitivePositioning({ computed, businessType }: {
  computed: import('@/types/computed').ComputedResult | null
  businessType: string
}) {
  const C = computed
  if (!C?.marketIntelligence) return null
  const mi = C.marketIntelligence
  const strongCount = mi.strongCount ?? 0
  const weakCount = mi.weakCount ?? 0
  const total = strongCount + (mi.moderateCount ?? 0) + weakCount
  if (total === 0) return null

  const bt = (businessType ?? 'business').toLowerCase()

  // Determine recommended positioning
  type Positioning = 'premium' | 'value_leader' | 'niche_specialist' | 'convenience' | 'avoid'
  let recommended: Positioning = 'convenience'
  let rationale = ''
  let tactics: string[] = []

  if (strongCount >= 3 && total > 10) {
    recommended = 'niche_specialist'
    rationale = `With ${strongCount} strong operators already established, a direct head-to-head strategy is high-risk. The market is saturated at the general level, but niches within ${bt} are likely underserved.`
    tactics = [
      `Identify the specific subcategory none of the ${strongCount} strong operators covers well`,
      'Build your brand around that niche from day one — menu, design, marketing',
      'Price at or above market rate to signal quality, not desperation',
      'Target a specific customer persona rather than trying to serve everyone',
    ]
  } else if (strongCount === 0 && weakCount > 3) {
    recommended = 'premium'
    rationale = `All ${total} competitors are weak or mid-tier — no one has claimed the quality position. This is a rare opportunity to become the area's go-to ${bt} by simply being excellent.`
    tactics = [
      'Invest in fit-out quality, branding, and online presence — first impressions matter',
      'Price 15–25% above current market average to signal premium positioning',
      `Target 4.5+ Google rating within 90 days — actively solicit reviews`,
      'Build a loyalty program early to create switching costs',
    ]
  } else if (strongCount <= 1 && total <= 5) {
    recommended = 'convenience'
    rationale = `Low competition with only ${total} operator${total !== 1 ? 's' : ''} suggests this area is either underserved or low-traffic. Focus on capturing the existing demand reliably.`
    tactics = [
      'Prioritise location visibility and ease of access over premium fit-out',
      'Offer extended hours or unique service windows competitors do not cover',
      'Build a strong delivery and online ordering presence from launch',
      'Monitor foot traffic patterns to optimise staffing and operating hours',
    ]
  } else if (strongCount >= 2) {
    recommended = 'value_leader'
    rationale = `${strongCount} strong operators control the premium segment. Competing on quality alone is expensive. Instead, capture the price-sensitive segment they overlook.`
    tactics = [
      `Offer comparable quality at 10–20% lower price than the top ${strongCount} operator${strongCount !== 1 ? 's' : ''}`,
      'Keep overhead lean — smaller footprint, efficient layout, minimal waste',
      'Win on speed, consistency, and convenience rather than ambience',
      'Use social media and local community engagement for low-cost marketing',
    ]
  }

  const positioningStyles: Record<Positioning, { label: string; color: string; bg: string; border: string }> = {
    premium:          { label: 'Premium Leader',       color: '#4338CA', bg: '#EEF2FF', border: '#C7D2FE' },
    value_leader:     { label: 'Value Leader',         color: S.brand,   bg: S.brandFaded, border: S.brandBorder },
    niche_specialist: { label: 'Niche Specialist',     color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    convenience:      { label: 'Convenience & Access', color: S.blue,    bg: S.blueBg,  border: S.blueBdr },
    avoid:            { label: 'Avoid — Too Saturated', color: S.red,    bg: S.redBg,   border: S.redBdr },
  }
  const ps = positioningStyles[recommended]

  return (
    <Card>
      <SectionHeading sub="Based on competitor strength distribution and market gaps.">How to Position This Business</SectionHeading>
      <div style={{ padding: '20px 24px', background: ps.bg, border: `1.5px solid ${ps.border}`, borderRadius: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ padding: '6px 14px', background: `${ps.color}15`, border: `1.5px solid ${ps.color}35`, borderRadius: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: ps.color }}>{ps.label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: ps.color, opacity: 0.7 }}>RECOMMENDED POSITIONING</span>
        </div>
        <p style={{ fontSize: 13, color: ps.color, lineHeight: 1.7, opacity: 0.85 }}>{rationale}</p>
      </div>

      <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
        Entry Tactics
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tactics.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: S.n100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: S.n500 }}>{i + 1}</span>
            </div>
            <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.6 }}>{t}</p>
          </div>
        ))}
      </div>

      {mi.marketGapNote && (
        <div style={{ marginTop: 20, padding: '14px 18px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.emerald, marginBottom: 4 }}>Market Gap Detected</p>
          <p style={{ fontSize: 12, color: '#065F46', lineHeight: 1.6 }}>{mi.marketGapNote}</p>
        </div>
      )}
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL TRUST — honest assumptions, break conditions, failure triggers
// ═══════════════════════════════════════════════════════════════════════════════
function FinancialTrust({ computed, fin, report }: {
  computed: import('@/types/computed').ComputedResult | null
  fin: any; report: Report
}) {
  const C = computed
  if (!C) return null

  const bt = (report.business_type ?? 'business').toLowerCase()
  const isBenchmark = C.provenance?.revenue?.isBenchmark ?? false
  const revenueSource = C.provenance?.revenue?.sourceLabel ?? 'unknown'
  const costsSource = C.provenance?.costs?.sourceLabel ?? 'unknown'

  // What the model assumes
  const assumptions: Array<{ assumption: string; risk: 'low' | 'medium' | 'high'; note: string }> = []

  assumptions.push({
    assumption: `${C.dailyCustomers} customers/day at $${C.avgTicketSize} average ticket`,
    risk: isBenchmark ? 'high' : 'medium',
    note: isBenchmark
      ? `This is an industry average for Australian ${bt}s — your actual volume depends on location quality, marketing, and competition.`
      : 'Based on demand modelling for this specific location. Still an estimate — validate with comparable venues.',
  })

  if (C.costBreakdown) {
    const staffPct = Math.round((C.costBreakdown.staff / Math.max(C.totalCosts, 1)) * 100)
    assumptions.push({
      assumption: `Staff costs of $${C.costBreakdown.staff.toLocaleString()}/month (${staffPct}% of total)`,
      risk: staffPct > 40 ? 'high' : 'medium',
      note: `Based on ${bt} staffing benchmarks. Award wages, superannuation, and worker's comp included. Actual costs vary with roster and experience levels.`,
    })
  }

  const rentPct = fin?.rent?.toRevenuePercent
  if (rentPct) {
    assumptions.push({
      assumption: `Rent at ${rentPct.toFixed(1)}% of projected revenue`,
      risk: rentPct > 18 ? 'high' : rentPct > 12 ? 'medium' : 'low',
      note: rentPct > 18
        ? 'This ratio is uncomfortably high. A 10% revenue shortfall would push rent above 20% — the widely-cited danger threshold for retail tenancies.'
        : 'Within industry norms. Annual CPI-linked rent reviews could push this higher over a 3-year lease term.',
    })
  }

  // What needs to be true
  const mustBeTrue: string[] = []
  if (C.breakEvenDaily) mustBeTrue.push(`Average ${C.breakEvenDaily}+ customers per day from month 3 onward`)
  if (C.revenue) mustBeTrue.push(`Monthly revenue stays above ${fmt(Math.round(C.revenue * 0.80))} (80% of projection)`)
  if (C.costBreakdown?.staff) mustBeTrue.push(`Staff costs do not exceed $${Math.round(C.costBreakdown.staff * 1.15).toLocaleString()}/month`)
  mustBeTrue.push('No major competitor opens within 200m during the first 12 months')
  mustBeTrue.push('Foot traffic patterns match the model (weekday lunch or weekend peak)')

  // What would cause failure
  const wouldFail: Array<{ trigger: string; consequence: string }> = []
  if (C.revenue && C.totalCosts) {
    const cushion = C.revenue - C.totalCosts
    if (cushion <= 0) {
      // Already operating at a loss — no revenue cushion at all
      wouldFail.push({
        trigger: 'Business is already projected to lose money at current volume',
        consequence: `There is no revenue cushion — every dollar of underperformance worsens a deficit that is already ${fmt(Math.abs(cushion))}/month`,
      })
    } else {
      // Show a realistic range (cushion ± buffer) rather than a single over-precise number
      const cushionPct = Math.round((cushion / C.revenue) * 100)
      if (cushionPct < 10) {
        // Thin margin — express as a range to avoid misleading precision like "3%"
        wouldFail.push({
          trigger: 'Revenue falls 10–15% below projection',
          consequence: 'Thin margin means even a modest shortfall eliminates net profit entirely',
        })
      } else {
        wouldFail.push({
          trigger: `Revenue drops more than ${Math.max(10, cushionPct - 5)}% below projection`,
          consequence: 'Net profit hits zero — the business cannot cover its operating costs',
        })
      }
    }
  }
  if (report.monthly_rent) {
    const breakRent = Math.round((report.monthly_rent) * 1.3)
    wouldFail.push({
      trigger: `Rent increases to $${breakRent.toLocaleString()}/month at renewal`,
      consequence: 'Profit margin disappears — lease becomes unviable without revenue growth to match',
    })
  }
  wouldFail.push({
    trigger: 'Customer ramp takes 6+ months instead of 3',
    consequence: `Burns through $${Math.round((C.totalCosts - (C.revenue * 0.5)) * 3).toLocaleString()} in additional working capital during the slow period`,
  })

  const riskColor = (r: string) => r === 'high' ? S.red : r === 'medium' ? S.amber : S.emerald
  const riskBg = (r: string) => r === 'high' ? S.redBg : r === 'medium' ? S.amberBg : S.emeraldBg

  return (
    <Card>
      <SectionHeading sub="Every projection rests on assumptions. Here they are, with their risk levels.">Financial Model Assumptions</SectionHeading>

      {/* Assumptions table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
        {assumptions.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < assumptions.length - 1 ? `1px solid ${S.n100}` : 'none', alignItems: 'flex-start' }}>
            <div style={{ padding: '3px 10px', background: riskBg(a.risk), border: `1px solid ${riskColor(a.risk)}30`, borderRadius: 8, flexShrink: 0, marginTop: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: riskColor(a.risk), textTransform: 'uppercase' }}>{a.risk} risk</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.n800, marginBottom: 3 }}>{a.assumption}</p>
              <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.6 }}>{a.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data sources */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: S.n400, fontWeight: 600, marginRight: 4 }}>Data sources:</span>
        <span style={{ fontSize: 11, padding: '2px 8px', background: isBenchmark ? S.amberBg : S.emeraldBg, border: `1px solid ${isBenchmark ? S.amberBdr : S.emeraldBdr}`, borderRadius: 10, color: isBenchmark ? S.amber : S.emerald, fontWeight: 700 }}>Revenue: {revenueSource}</span>
        <span style={{ fontSize: 11, padding: '2px 8px', background: S.n100, borderRadius: 10, color: S.n500, fontWeight: 600 }}>Costs: {costsSource}</span>
      </div>

      {/* Two columns: Must be true + Would cause failure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: '18px 20px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            What must be true
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mustBeTrue.slice(0, 5).map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: S.amber, fontWeight: 900, fontSize: 14, lineHeight: 1, marginTop: 1 }}>\u2022</span>
                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '18px 20px', background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            What would cause failure
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {wouldFail.slice(0, 3).map((f, i) => (
              <div key={i}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', lineHeight: 1.4 }}>{f.trigger}</p>
                <p style={{ fontSize: 11, color: '#991B1B', opacity: 0.7, lineHeight: 1.5, marginTop: 2 }}>\u2192 {f.consequence}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALUE PERCEPTION — hidden risks, success patterns, common mistakes
// ═══════════════════════════════════════════════════════════════════════════════
function ValuePerception({ computed, businessType, locationName }: {
  computed: import('@/types/computed').ComputedResult | null
  businessType: string; locationName: string
}) {
  const C = computed
  const bt = (businessType ?? 'business').toLowerCase()
  const area = locationName?.split(',')[0]?.trim() ?? 'this area'
  const mi = C?.marketIntelligence
  const strongCount = mi?.strongCount ?? 0
  const total = (mi?.strongCount ?? 0) + (mi?.moderateCount ?? 0) + (mi?.weakCount ?? 0)

  // Hidden risks most people miss
  const hiddenRisks: Array<{ risk: string; why: string }> = []
  if (C?.competitorDataQuality === 'zero_warning' || C?.competitorDataQuality === 'no_data') {
    hiddenRisks.push({
      risk: 'Competition may be higher than shown',
      why: 'Our data sources have gaps in this area. Walk the streets, check Google Maps manually, and count what our scanners may have missed.',
    })
  }
  if (strongCount === 0 && total > 0) {
    hiddenRisks.push({
      risk: 'Weak competitors may not mean weak market',
      why: 'Sometimes areas with only weak operators have low foot traffic. The businesses survive on low rent, not high revenue. Verify the demand is real.',
    })
  }
  if (C?.provenance?.revenue?.isBenchmark) {
    hiddenRisks.push({
      risk: 'Revenue projection has no local validation',
      why: `The $${C?.revenue?.toLocaleString()}/month figure is a national ${bt} average scaled to this area. Actual revenue could be 30-50% lower in a newly opened venue during the ramp period.`,
    })
  }
  const demandTrend = C?.marketSignals?.demandTrend
  if (demandTrend === 'stable') {
    hiddenRisks.push({
      risk: 'Stable demand is not growing demand',
      why: 'In a stable market, every customer you win is a customer someone else loses. Expect resistance from incumbents and slower-than-expected growth.',
    })
  }
  hiddenRisks.push({
    risk: 'Lease terms are the biggest hidden cost',
    why: 'Bond, fit-out contribution, make-good clauses, and annual CPI increases can add 15-25% to your effective rent over a 3-year lease. Read the lease before the numbers.',
  })

  // What successful businesses in areas like this do
  const successPatterns: string[] = []
  if (strongCount > 0) {
    successPatterns.push(`Study the top ${strongCount} operator${strongCount > 1 ? 's' : ''} in detail — their menu, pricing, peak hours, and online reviews reveal exactly what works in ${area}`)
  }
  successPatterns.push(`New ${bt}s that survive year one in Australia typically achieve 70% of target revenue by month 3 — plan your working capital for a 3-month ramp, not instant profitability`)
  successPatterns.push('The businesses that fail fastest are those that overinvest in fit-out and underinvest in marketing and cash reserves')
  if (total > 5) {
    successPatterns.push('In competitive areas, the winners consistently invest in Google reviews, local SEO, and community presence over paid advertising')
  }
  successPatterns.push('Successful operators negotiate rent-free periods (2-3 months) or turnover-based rent structures to de-risk the launch')

  // Common mistakes
  const mistakes: string[] = [
    'Signing a 5-year lease without a break clause — if it does not work in 18 months, you need an exit',
    'Budgeting based on best-case revenue instead of worst-case — always plan for 60% of projected revenue in months 1-6',
    `Ignoring online presence — 78% of Australian consumers check Google reviews before visiting a new ${bt}`,
    'Underestimating staffing costs — award wages, super, and leave loading add 30-40% on top of base hourly rates',
  ]

  return (
    <Card>
      <SectionHeading sub="Insights that could save you from an expensive mistake.">What Most People Miss</SectionHeading>

      {/* Hidden risks */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Hidden Risks
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hiddenRisks.slice(0, 4).map((r, i) => (
            <div key={i} style={{ padding: '14px 18px', background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>{r.risk}</p>
              <p style={{ fontSize: 12, color: '#991B1B', opacity: 0.8, lineHeight: 1.6 }}>{r.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What works */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          What Successful Operators Do
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {successPatterns.slice(0, 4).map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
              <span style={{ fontSize: 14, color: S.emerald, fontWeight: 900, flexShrink: 0, marginTop: -1 }}>\u2713</span>
              <p style={{ fontSize: 12, color: '#065F46', lineHeight: 1.6 }}>{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Common Mistakes to Avoid
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {mistakes.map((m, i) => (
            <div key={i} style={{ padding: '14px 16px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>{m}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION INTELLIGENCE — actionable WHY analysis
// ═══════════════════════════════════════════════════════════════════════════════
function LocationIntelligence({ computed, report }: {
  computed: import('@/types/computed').ComputedResult | null
  report: Report
}) {
  const C = computed
  const ls = C?.locationSignals
  if (!ls) return null

  const bt = (report.business_type ?? 'business').toLowerCase()
  const area = report.location_name?.split(',')[0]?.trim() ?? 'this location'
  const anchors = ls.nearbyAnchors ?? []

  const signals: Array<{ label: string; value: string; implication: string; positive: boolean }> = []

  // Footfall
  const footfall = ls.footfallSignal ?? ''
  if (footfall) {
    const isGood = footfall.toLowerCase().includes('high') || footfall.toLowerCase().includes('very high')
    signals.push({
      label: 'Location Activity',
      value: footfall,
      implication: isGood
        ? `High location activity signals strong walk-in conversion for ${bt}s — reduces reliance on destination marketing`
        : footfall.toLowerCase().includes('low')
        ? `Low location activity means you must drive customers here through marketing, delivery apps, or destination appeal — impulse walk-ins will be rare`
        : `Moderate location activity — supplement with online presence and delivery channels for consistent volume`,
      positive: isGood,
    })
  }

  // Transit
  const transit = ls.transitSignal ?? ''
  if (transit) {
    const isGood = transit.toLowerCase().includes('excellent') || transit.toLowerCase().includes('good') || transit.toLowerCase().includes('high')
    signals.push({
      label: 'Public Transit',
      value: transit,
      implication: isGood
        ? 'Strong transit access widens your catchment beyond the immediate neighbourhood — draws commuters, students, and workers'
        : 'Limited transit means your customers are primarily local residents and drivers. Ensure parking is available.',
      positive: isGood,
    })
  }

  // Anchors
  if (anchors.length > 0) {
    signals.push({
      label: 'Anchor Tenants',
      value: anchors.slice(0, 3).join(', '),
      implication: `${anchors.length} major anchor${anchors.length !== 1 ? 's' : ''} nearby — these generate consistent foot traffic that benefits neighbouring businesses. Being close to an anchor is one of the strongest location signals for retail success.`,
      positive: true,
    })
  } else {
    signals.push({
      label: 'Anchor Tenants',
      value: 'None detected nearby',
      implication: 'No major anchors (supermarket, shopping centre, transport hub) detected within walking distance. Your business must generate its own traffic.',
      positive: false,
    })
  }

  // Rent context — from medianRent or general knowledge
  const hasMedianRent = ls.medianRent != null && ls.medianRent > 0
  if (hasMedianRent) {
    const rent = report.monthly_rent ?? 0
    const median = ls.medianRent!
    const diff = rent > 0 ? ((rent - median) / median) : 0
    const isAbove = diff > 0.1
    const isBelow = diff < -0.1
    signals.push({
      label: 'Rent Context',
      value: isAbove ? `Above median (+${Math.round(diff*100)}%)` : isBelow ? `Below median (${Math.round(diff*100)}%)` : 'At area median',
      implication: isAbove
        ? 'Above-median rent suggests a prime strip or high-demand pocket. Expect corresponding foot traffic to justify the premium.'
        : isBelow
        ? 'Below-median rent could mean a secondary location. Lower rent is good for margins, but verify the reason is not low demand.'
        : 'Rent is in line with area medians — standard market pricing.',
      positive: !isAbove,
    })
  }

  if (signals.length === 0) return null

  // Check whether we have any real agent-sourced signals (not just the fallback "none detected" anchor)
  const hasRealSignalData = (ls.footfallSignal ?? '').trim() !== ''
    || (ls.transitSignal ?? '').trim() !== ''
    || (ls.medianRent != null && ls.medianRent > 0)
    || anchors.length > 0

  // If all we have is the placeholder "no anchors" signal and no other data, show an
  // insufficient-data message rather than a misleading "Weak location signals" verdict.
  if (!hasRealSignalData) {
    return (
      <Card>
        <SectionHeading sub={`Location signals require live data from the A2 agent.`}>Location Intelligence</SectionHeading>
        <div style={{
          padding: '20px 24px', background: S.n50, border: `1px solid ${S.n200}`,
          borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.n700, marginBottom: 4 }}>Location data unavailable for this report</p>
            <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.6 }}>
              Foot traffic, transit access, and rent benchmarks could not be retrieved for {area}. This section requires live data from the location intelligence agent. Re-run the report for a full location assessment.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  // Overall location verdict
  const positiveCount = signals.filter(s => s.positive).length
  const locationVerdict = positiveCount >= 3 ? 'strong'
    : positiveCount >= 2 ? 'adequate'
    : 'weak'

  return (
    <Card>
      <SectionHeading sub={`Why ${area} does or does not work for a ${bt}.`}>Location Intelligence</SectionHeading>

      {/* Location verdict bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', marginBottom: 20,
        background: locationVerdict === 'strong' ? S.emeraldBg : locationVerdict === 'adequate' ? S.amberBg : S.redBg,
        border: `1px solid ${locationVerdict === 'strong' ? S.emeraldBdr : locationVerdict === 'adequate' ? S.amberBdr : S.redBdr}`,
        borderRadius: 10,
      }}>
        <span style={{
          fontSize: 13, fontWeight: 800,
          color: locationVerdict === 'strong' ? S.emerald : locationVerdict === 'adequate' ? S.amber : S.red,
        }}>
          {locationVerdict === 'strong' ? 'Strong location signals' : locationVerdict === 'adequate' ? 'Mixed location signals' : 'Weak location signals — limited data returned for this suburb'}
          {' '}\u2014 {positiveCount}/{signals.length} factors are positive
        </span>
      </div>

      {/* Signal cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {signals.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, padding: '16px 0', borderBottom: i < signals.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: s.positive ? S.emerald : S.red }}>{s.value}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.positive ? S.emerald : S.red, marginTop: 6, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.7 }}>{s.implication}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREAT BREAKDOWN — strength-based competitor analysis
// ═══════════════════════════════════════════════════════════════════════════════
function ThreatBreakdown({ computed }: { computed: import('@/types/computed').ComputedResult | null }) {
  const C = computed
  if (!C?.marketIntelligence) return null
  const mi = C.marketIntelligence
  const total = (mi.strongCount ?? 0) + (mi.moderateCount ?? 0) + (mi.weakCount ?? 0)
  if (total === 0) return null

  const strongPct = Math.round((mi.strongCount / total) * 100)
  const medPct    = Math.round((mi.moderateCount / total) * 100)
  const weakPct   = 100 - strongPct - medPct

  return (
    <Card>
      <SectionHeading sub="Competitors ranked by threat score (rating, reviews, proximity, brand recognition).">Competitor Strength</SectionHeading>

      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 14, borderRadius: 100, overflow: 'hidden', marginBottom: 16 }}>
        {mi.strongCount > 0 && <div style={{ width: `${strongPct}%`, background: S.red, transition: 'width 0.8s ease' }} />}
        {mi.moderateCount > 0 && <div style={{ width: `${medPct}%`, background: S.amber, transition: 'width 0.8s ease' }} />}
        {mi.weakCount > 0 && <div style={{ width: `${weakPct}%`, background: S.emerald, transition: 'width 0.8s ease' }} />}
      </div>

      {/* Legend + counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Strong', count: mi.strongCount, color: S.red, bg: S.redBg, border: S.redBdr, desc: '4.5+ rating, 200+ reviews, or chain brand' },
          { label: 'Medium', count: mi.moderateCount, color: S.amber, bg: S.amberBg, border: S.amberBdr, desc: 'Established local with moderate presence' },
          { label: 'Weak', count: mi.weakCount, color: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr, desc: 'Low ratings, few reviews, or unverified' },
        ].map(tier => (
          <div key={tier.label} style={{ padding: '14px 16px', background: tier.bg, border: `1px solid ${tier.border}`, borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: tier.color, fontFamily: S.mono, lineHeight: 1 }}>{tier.count}</p>
            <p style={{ fontSize: 12, fontWeight: 800, color: tier.color, marginTop: 4 }}>{tier.label}</p>
            <p style={{ fontSize: 11, color: tier.color, opacity: 0.7, marginTop: 2 }}>{tier.desc}</p>
          </div>
        ))}
      </div>

      {/* Top threats */}
      {mi.topThreats && mi.topThreats.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Top Threats
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mi.topThreats.slice(0, 3).map((t: any, i: number) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', background: S.n50, borderRadius: 10,
                border: `1px solid ${t.threatLabel === 'strong' ? S.redBdr : t.threatLabel === 'moderate' ? S.amberBdr : S.n200}`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: t.threatLabel === 'strong' ? S.redBg : t.threatLabel === 'moderate' ? S.amberBg : S.emeraldBg,
                  border: `1px solid ${t.threatLabel === 'strong' ? S.redBdr : t.threatLabel === 'moderate' ? S.amberBdr : S.emeraldBdr}`,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: t.threatLabel === 'strong' ? S.red : t.threatLabel === 'moderate' ? S.amber : S.emerald }}>
                    #{i + 1}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{t.name}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                    {t.rating != null && t.rating > 0 && <span style={{ fontSize: 11, color: S.n500 }}>{t.rating.toFixed(1)} stars</span>}
                    {t.distance != null && <span style={{ fontSize: 11, color: S.n500 }}>{t.distance}m away</span>}
                    {t.threatScore != null && <span style={{ fontSize: 11, fontWeight: 700, color: t.threatLabel === 'strong' ? S.red : S.amber }}>Threat: {t.threatScore}/100</span>}
                  </div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: t.threatLabel === 'strong' ? S.redBg : t.threatLabel === 'moderate' ? S.amberBg : S.emeraldBg,
                  color: t.threatLabel === 'strong' ? S.red : t.threatLabel === 'moderate' ? S.amber : S.emerald,
                  border: `1px solid ${t.threatLabel === 'strong' ? S.redBdr : t.threatLabel === 'moderate' ? S.amberBdr : S.emeraldBdr}`,
                  textTransform: 'uppercase',
                }}>
                  {t.threatLabel ?? 'unknown'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market gap */}
      {mi.marketGapNote && (
        <div style={{ padding: '16px 20px', background: S.brandFaded, border: `1.5px solid ${S.brandBorder}`, borderRadius: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Market Gap Detected</p>
          <p style={{ fontSize: 14, color: S.n800, lineHeight: 1.7 }}>{mi.marketGapNote}</p>
        </div>
      )}

      {/* Revenue adjustment note */}
      {C.competitorPressure?.revenueAdjusted && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
            Revenue adjusted down {Math.round((1 - (C.competitorPressure.pressureFactor ?? 1)) * 100)}% due to competitor density pressure. Without this adjustment, projected revenue would be {fmt(Math.round(C.revenue / (C.competitorPressure.pressureFactor ?? 1)))}/month.
          </p>
        </div>
      )}
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORE BAR — with inline explanation (always visible)
// ═══════════════════════════════════════════════════════════════════════════════
const SCORE_EXPLANATIONS: Record<string, (s: number) => string> = {
  'Rent Affordability': (s) => {
    if (s >= 90) return 'Rent is under 12% of projected revenue -- excellent cost structure.'
    if (s >= 70) return 'Rent is 12--20% of projected revenue -- manageable but watch margins.'
    if (s >= 40) return 'Rent is 20--30% of projected revenue -- high pressure on profitability.'
    return 'Rent exceeds 30% of projected revenue -- viability is in question.'
  },
  'Profitability': (s) => {
    if (s >= 90) return 'Net profit projected above $2,000/month at baseline demand.'
    if (s >= 70) return 'Net profit projected $1,000--$2,000/month -- healthy but thin.'
    if (s >= 50) return 'Net profit projected $1--$999/month -- marginally viable.'
    return 'Net profit is negative at baseline demand -- business does not cover costs.'
  },
  'Competition': (s) => {
    if (s >= 80) return '2--5 competitors within 500m -- healthy market with proven demand.'
    if (s >= 60) return '6--9 competitors within 500m -- moderate saturation, differentiation needed.'
    if (s >= 40) return '10--14 competitors within 500m -- high saturation, difficult market entry.'
    return '15+ competitors within 500m -- very crowded market.'
  },
  'Area Demographics': (s) => {
    if (s >= 80) return 'Median income $100k+ -- strong spending power for your ticket size.'
    if (s >= 60) return 'Median income $70k--$100k -- moderate spending power, price sensitivity likely.'
    if (s >= 40) return 'Median income $55k--$70k -- lower spending power, value positioning important.'
    return 'Median income below $55k -- premium pricing will be challenged.'
  },
}

function ScoreBar({ label, score, weight }: { label: string; score: number | null; weight: string }) {
  const s = score ?? 0
  const color = scoreColor(s)
  const explain = SCORE_EXPLANATIONS[label]?.(s) ?? ''
  const tier = s >= 70 ? 'Strong' : s >= 45 ? 'Moderate' : 'Weak'

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: S.n700, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 11, color: S.n400 }}>{weight}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, padding: '2px 8px', background: `${color}12`, borderRadius: 6 }}>{tier}</span>
          <span style={{ fontSize: 14, fontWeight: 900, color, fontFamily: S.mono }}>{s}</span>
        </div>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${s}%`, background: color, borderRadius: 100, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      {/* Always-visible explanation */}
      <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.5 }}>{explain}</p>
    </div>
  )
}

// ─── Rent-to-revenue ratio panel ──────────────────────────────────────────────
function RentRatioPanel({ rent, revenue }: { rent: number | null; revenue: number | null }) {
  if (!rent || !revenue || revenue === 0) return null
  const ratio = rent / revenue
  const pct = (ratio * 100).toFixed(1)
  const cfg = rentRatioColor(ratio)
  const barWidth = Math.min(ratio / 0.25, 1) * 100

  return (
    <div style={{ border: `1.5px solid ${cfg.border}`, borderRadius: 14, padding: '20px 24px', background: cfg.bg }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Rent-to-Revenue Ratio</p>
          <p style={{ fontSize: 12, color: cfg.text, opacity: 0.75 }}>Professional benchmark: under 12%. Above 20% is a red flag.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: cfg.text, letterSpacing: '-0.04em', lineHeight: 1, fontFamily: S.mono }}>{pct}%</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.white, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: '3px 10px', marginTop: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.text }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: cfg.text, letterSpacing: '0.06em' }}>{cfg.label}</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barWidth}%`, background: cfg.text, borderRadius: 4, opacity: 0.8, transition: 'width 1.2s ease' }} />
        <div style={{ position: 'absolute', top: 0, left: '48%', width: 2, height: '100%', background: S.white, opacity: 0.8 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: cfg.text, opacity: 0.65 }}>0%</span>
        <span style={{ fontSize: 10, color: cfg.text, opacity: 0.65 }}>12% target</span>
        <span style={{ fontSize: 10, color: cfg.text, opacity: 0.65 }}>25%</span>
      </div>
    </div>
  )
}

// ─── Radar chart ──────────────────────────────────────────────────────────────
function RadarChart({ scores, color }: { scores: { label: string; value: number }[]; color: string }) {
  const cx = 120, cy = 120, r = 90
  const n = scores.length
  const points = scores.map((s, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const val = (s.value ?? 0) / 100
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
      lx: cx + (r + 28) * Math.cos(angle),
      ly: cy + (r + 28) * Math.sin(angle),
    }
  })
  return (
    <svg width="240" height="240" style={{ display: 'block', margin: '0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map(level => {
        const gpts = scores.map((_, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2
          return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`
        }).join(' ')
        return <polygon key={level} points={gpts} fill="none" stroke={S.n200} strokeWidth="1" />
      })}
      {scores.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke={S.n200} strokeWidth="1" />
      })}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />)}
      {scores.map((s, i) => {
        const p = points[i]
        const anchor = p.lx < cx - 5 ? 'end' : p.lx > cx + 5 ? 'start' : 'middle'
        return (
          <g key={i}>
            <text x={p.lx} y={p.ly - 5} textAnchor={anchor} fontSize="9" fontWeight="700" fill={S.n400} fontFamily="DM Sans,sans-serif" letterSpacing="0.06em">{s.label.split(' ')[0].toUpperCase()}</text>
            <text x={p.lx} y={p.ly + 8} textAnchor={anchor} fontSize="12" fontWeight="900" fill={color} fontFamily="JetBrains Mono,monospace">{s.value ?? 0}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── 3-year bar chart ─────────────────────────────────────────────────────────
function ProjectionBars({ projections }: { projections: any }) {
  if (!projections?.year1) return null
  const years = ['year1', 'year2', 'year3']
  const labels = ['Year 1', 'Year 2', 'Year 3']
  const maxVal = Math.max(...years.map(y => projections[y]?.revenue ?? 0), 1)
  const W = 380, H = 150, barW = 30, gap = 10, groupW = barW * 2 + gap, groupGap = 36
  const totalW = years.length * groupW + (years.length - 1) * groupGap
  const startX = (W - totalW) / 2
  return (
    <svg width={W} height={H + 48} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map(level => (
        <line key={level} x1={startX - 8} y1={H - H * level} x2={startX + totalW + 8} y2={H - H * level} stroke={S.n100} strokeWidth="1" strokeDasharray="3,3" />
      ))}
      {years.map((y, i) => {
        const d = projections[y] || {}
        const revH  = ((d.revenue  ?? 0) / maxVal) * H
        const profH = Math.max(0, ((d.netProfit ?? 0) / maxVal) * H)
        const x = startX + i * (groupW + groupGap)
        return (
          <g key={y}>
            <rect x={x} y={H - revH} width={barW} height={revH} rx="3" fill={S.brand} fillOpacity="0.8" />
            <rect x={x + barW + gap} y={H - profH} width={barW} height={profH} rx="3" fill={S.emerald} fillOpacity="0.8" />
            <text x={x + groupW / 2} y={H + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill={S.n400} fontFamily="DM Sans,sans-serif">{labels[i]}</text>
            <text x={x + barW / 2} y={H - revH - 6} textAnchor="middle" fontSize="9" fontWeight="700" fill={S.brand} fontFamily="JetBrains Mono,monospace">
              {d.revenue ? '$' + (d.revenue / 1000).toFixed(0) + 'k' : ''}
            </text>
            <text x={x + barW + gap + barW / 2} y={H - profH - 6} textAnchor="middle" fontSize="9" fontWeight="700" fill={S.emerald} fontFamily="JetBrains Mono,monospace">
              {d.netProfit ? '$' + (d.netProfit / 1000).toFixed(0) + 'k' : ''}
            </text>
          </g>
        )
      })}
      <rect x={startX} y={H + 32} width={10} height={8} rx="2" fill={S.brand} fillOpacity="0.8" />
      <text x={startX + 14} y={H + 40} fontSize="10" fill={S.n400} fontFamily="DM Sans,sans-serif">Revenue</text>
      <rect x={startX + 80} y={H + 32} width={10} height={8} rx="2" fill={S.emerald} fillOpacity="0.8" />
      <text x={startX + 94} y={H + 40} fontSize="10" fill={S.n400} fontFamily="DM Sans,sans-serif">Net Profit</text>
    </svg>
  )
}

// ─── P&L waterfall ────────────────────────────────────────────────────────────
function PLWaterfall({ fin, submittedRent, computed }: { fin: any; submittedRent?: number | null; computed?: ComputedResult | null }) {
  // Prefer computed_result cost breakdown (engine-validated) over legacy fin guesses
  const C = computed
  const revenue = C?.revenue ?? fin.monthlyRevenue ?? 0
  const rent = submittedRent ?? (C ? C.costBreakdown.rent : fin.rent?.amount) ?? 0
  const cogs = C?.costBreakdown.cogs ?? fin.cogs ?? 0
  const labour = C?.costBreakdown.staff ?? fin.labour ?? 0
  const other = C?.costBreakdown.other ?? Math.max(0, (C?.totalCosts ?? fin.totalMonthlyCosts ?? 0) - rent - cogs - labour)
  const profit = C?.netProfit ?? fin.monthlyNetProfit ?? 0
  if (!revenue) return null
  const bars = [
    { label: 'Revenue', value: revenue, color: S.brand },
    { label: 'Rent', value: rent, color: S.red },
    { label: 'COGS', value: cogs, color: '#F97316' },
    { label: 'Labour', value: labour, color: S.amber },
    { label: 'Other', value: other, color: S.n400 },
    { label: 'Profit', value: Math.abs(profit), color: profit >= 0 ? S.emerald : S.red },
  ].filter(b => b.value > 0)
  const maxH = 100
  const W = 380, barW = Math.min(38, (W - 20) / bars.length - 8)
  return (
    <svg width={W} height={maxH + 56} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {bars.map((b, i) => {
        const h = (b.value / revenue) * maxH
        const x = 10 + i * ((W - 20) / bars.length)
        return (
          <g key={b.label}>
            <rect x={x} y={maxH - h} width={barW} height={h} rx="3" fill={b.color} fillOpacity="0.85" />
            <text x={x + barW / 2} y={maxH - h - 6} textAnchor="middle" fontSize="9" fontWeight="700" fill={b.color} fontFamily="JetBrains Mono,monospace">${(b.value / 1000).toFixed(0)}k</text>
            <text x={x + barW / 2} y={maxH + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill={S.n500} fontFamily="DM Sans,sans-serif">{b.label}</text>
          </g>
        )
      })}
      <line x1="10" y1={maxH} x2={W - 10} y2={maxH} stroke={S.n200} strokeWidth="1.5" />
    </svg>
  )
}

// ─── Break-even gauge ─────────────────────────────────────────────────────────
function BreakevenGauge({ daily, breakeven }: { daily: number | null; breakeven: number | null }) {
  if (!daily || !breakeven || daily === breakeven) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <p style={{ fontSize: 13, color: S.n400, fontWeight: 600 }}>Break-even data unavailable</p>
        <p style={{ fontSize: 12, color: S.n400, marginTop: 4 }}>Re-run analysis to generate gauge</p>
      </div>
    )
  }
  const maxCustomers = Math.max(daily * 2, breakeven * 1.5)
  const pct = Math.min((daily / maxCustomers), 1)
  const bePct = Math.min((breakeven / maxCustomers), 1)
  const cx = 120, cy = 95, r = 75
  const toXY = (p: number) => {
    const angle = Math.PI - p * Math.PI
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) }
  }
  const current = toXY(pct)
  const be = toXY(bePct)
  const arcPath = (from: number, to: number, stroke: string, sw: number) => {
    const sv = toXY(from), ev = toXY(to)
    return <path d={`M${sv.x},${sv.y} A${r},${r} 0 0,1 ${ev.x},${ev.y}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
  }
  const isViable = daily >= breakeven
  return (
    <svg width="240" height="130" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {arcPath(0, 1, S.n100, 10)}
      {arcPath(bePct, 1, S.emeraldBg, 10)}
      {arcPath(0, pct, isViable ? S.emerald : S.red, 10)}
      <circle cx={be.x} cy={be.y} r="5" fill={S.white} stroke={S.amber} strokeWidth="2.5" />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="28" fontWeight="900" fill={isViable ? S.emerald : S.red} fontFamily="JetBrains Mono,monospace">{daily}</text>
      <text x={cx} y={cy + 32} textAnchor="middle" fontSize="10" fill={S.n400} fontFamily="DM Sans,sans-serif">customers / day</text>
      <text x={be.x} y={be.y - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill={S.amber} fontFamily="DM Sans,sans-serif">break-even: {breakeven}</text>
    </svg>
  )
}

// ─── Assumptions panel ────────────────────────────────────────────────────────
function AssumptionsPanel({ report }: { report: Report }) {
  const [open, setOpen] = useState(false)
  const rd  = safeResultData(report.result_data)
  const fin = rd.financials || {}
  const demoQuality = rd.demographics?.dataQuality || null
  const demoSource  = demoQuality === 'suburb_level'
    ? 'ABS 2021 Census – suburb (POA) level'
    : demoQuality === 'abs_state_default'
      ? 'ABS 2021 Census – state-level estimate'
      : 'ABS 2021 Census'
  const items = [
    { label: 'Business type', value: report.business_type || '--' },
    { label: 'Address', value: report.location_name || '--' },
    { label: 'Monthly rent (input)', value: fmt(report.monthly_rent) },
    { label: 'Avg ticket size', value: fmt(fin.avgTicketSize) },
    { label: 'Est. daily customers', value: report.breakeven_daily ? `${report.breakeven_daily} / day` : '--' },
    { label: 'Monthly revenue', value: fmt(fin.monthlyRevenue) },
    { label: 'Profit margin', value: fin.profitMargin ? `${fin.profitMargin}%` : '--' },
    { label: 'Competitor data', value: `OpenStreetMap Overpass API – ${(report as any).computed_result?.competitorRadius ?? 500}m radius` },
    { label: 'Demographics source', value: demoSource },
    { label: 'Geocoding source', value: 'OpenStreetMap Nominatim' },
    { label: 'Report generated', value: new Date(report.created_at).toLocaleString('en-AU') },
  ]

  return (
    <div style={{ border: `1px solid ${S.n200}`, borderRadius: 14, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '14px 20px', background: S.n50, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: S.font }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 14, background: S.n400, borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model Assumptions & Data Sources</span>
        </div>
        <span style={{ fontSize: 12, color: S.n400, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
      </button>
      {open && (
        <div style={{ background: S.white }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {items.map(item => (
                <tr key={item.label} style={{ borderTop: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '10px 20px', fontSize: 12, color: S.n400, fontWeight: 600, width: '40%' }}>{item.label}</td>
                  <td style={{ padding: '10px 20px', fontSize: 12, color: S.n800, fontWeight: 600, fontFamily: S.mono }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '14px 20px', background: S.n50, borderTop: `1px solid ${S.n100}` }}>
            <p style={{ fontSize: 11, color: S.n400, lineHeight: 1.6 }}>
              This model uses live data from OpenStreetMap and ABS 2021 Census. All financial projections are estimates based on submitted inputs and industry benchmarks. This report is not financial advice.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? S.amber : S.n200}
          stroke={i < Math.round(rating) ? S.amber : S.n200}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize: 11, color: S.n500, marginLeft: 4, fontFamily: S.mono, fontWeight: 700 }}>{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
    </div>
  )
}

// ─── Competitor card ──────────────────────────────────────────────────────────
function CompetitorCard({ c, idx }: { c: any; idx: number }) {
  // ── Price level: Google Maps price_level (1–4) → $ symbols ──────────────────
  const priceLevelRaw: number | null = c.price_level ?? null
  const priceLevelStr = priceLevelRaw != null
    ? ['', '$', '$$', '$$$', '$$$$'][Math.min(priceLevelRaw, 4)] || null
    : null
  // Also accept string "budget"/"mid"/"premium" from older A1 versions
  const pricingFallback: string | null = c.pricing ?? null
  const priceDisplay = priceLevelStr ?? pricingFallback
  const pricingColor = (priceLevelRaw != null && priceLevelRaw <= 1) || pricingFallback === 'Budget'
    ? S.emerald
    : (priceLevelRaw != null && priceLevelRaw >= 3) || pricingFallback === 'Premium'
    ? S.red
    : S.amber

  // ── Review count → demand strength signal ────────────────────────────────────
  const reviewCount: number = c.reviews ?? c.review_count ?? c.user_ratings_total ?? 0
  const reviewDemandLabel = reviewCount >= 2000 ? 'Dominant'
    : reviewCount >= 500  ? 'High demand'
    : reviewCount >= 100  ? 'Established'
    : reviewCount >= 20   ? 'Active'
    : reviewCount > 0     ? 'New/quiet'
    : null
  const reviewDemandColor = reviewCount >= 2000 ? S.red
    : reviewCount >= 500  ? '#EA580C'
    : reviewCount >= 100  ? S.amber
    : S.n400

  // ── Opening hours / competition pressure ─────────────────────────────────────
  const isOpenNow: boolean | null = c.is_open_now ?? c.opening_hours?.open_now ?? null
  const openingHours: string | null = c.opening_hours?.weekday_text?.[0] ?? c.hours_summary ?? null

  // ── Threat strength score: rating (40pts) + reviews log (25pts) + price (20pts) + proximity (15pts) ──
  const strengthScore: number = (() => {
    if (c.threatLabel === 'strong')   return 85
    if (c.threatLabel === 'moderate') return 55
    if (c.threatLabel === 'weak')     return 25
    if (typeof c.threatScore === 'number') return c.threatScore
    const ratingPts  = c.rating     > 0 ? (c.rating / 5) * 40 : 0
    const reviewPts  = reviewCount  > 0 ? Math.min(25, Math.log10(reviewCount) / Math.log10(2000) * 25) : 0
    const pricePts   = priceLevelRaw != null ? (priceLevelRaw / 4) * 20 : 10 // high price = premium = stronger
    const proxPts    = c.within_500m ? 15 : 0
    return Math.round(ratingPts + reviewPts + pricePts + proxPts)
  })()

  const strengthLabel = strengthScore >= 70 ? 'Dominant'
    : strengthScore >= 50 ? 'Strong'
    : strengthScore >= 30 ? 'Moderate'
    : 'Weak'
  const strengthColor = strengthScore >= 70 ? S.red
    : strengthScore >= 50 ? '#EA580C'
    : strengthScore >= 30 ? S.amber
    : S.emerald
  const strengthBg = strengthScore >= 70 ? S.redBg
    : strengthScore >= 50 ? '#FFF7ED'
    : strengthScore >= 30 ? S.amberBg
    : S.emeraldBg

  // ── Distance display ─────────────────────────────────────────────────────────
  const distanceM: number | null = c.distance_meters ?? c.distance ?? null
  const distanceLabel = distanceM != null
    ? distanceM < 100  ? `${Math.round(distanceM)}m`
    : distanceM < 1000 ? `${Math.round(distanceM)}m`
    : `${(distanceM / 1000).toFixed(1)}km`
    : c.within_500m ? '< 500m' : null

  return (
    <div style={{
      border: `1.5px solid ${strengthScore >= 70 ? '#FCA5A5' : S.n200}`,
      borderRadius: 12, padding: '16px 18px',
      background: strengthScore >= 70 ? '#FFF5F5' : S.white,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: S.n900, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {c.type && <span style={{ fontSize: 11, color: S.n400 }}>{c.type}</span>}
            {distanceLabel && <span style={{ fontSize: 10, fontWeight: 700, color: S.n400 }}>· {distanceLabel}</span>}
            {isOpenNow === true  && <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald }}>· Open now</span>}
            {isOpenNow === false && <span style={{ fontSize: 10, fontWeight: 700, color: S.red }}>· Closed</span>}
          </div>
        </div>
        {/* Strength badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: strengthBg, border: `1px solid ${strengthColor}40`, borderRadius: 20 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: strengthColor }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: strengthColor, letterSpacing: '0.04em' }}>{strengthLabel}</span>
            <span style={{ fontSize: 10, color: strengthColor, opacity: 0.6 }}>{strengthScore}</span>
          </div>
          {priceDisplay && (
            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: `${pricingColor}15`, color: pricingColor, letterSpacing: '0.04em' }}>
              {priceLevelStr ?? priceDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Rating + review demand signal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <StarRating rating={c.rating ?? 0} />
        {reviewCount > 0 && (
          <span style={{ fontSize: 11, color: reviewDemandColor, fontFamily: S.mono, fontWeight: 600 }}>
            {reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount}
            {reviewDemandLabel && <span style={{ fontFamily: S.font, fontWeight: 400, color: S.n400 }}> · {reviewDemandLabel}</span>}
          </span>
        )}
      </div>

      {/* Opening hours note — a real competition pressure signal */}
      {openingHours && (
        <div style={{ fontSize: 11, color: S.n500, padding: '4px 8px', background: S.n50, borderRadius: 6, lineHeight: 1.4 }}>
          {openingHours}
        </div>
      )}

      {/* Strengths */}
      {c.strengths?.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Strengths</p>
          {c.strengths.slice(0, 2).map((s: string, i: number) => (
            <p key={i} style={{ fontSize: 11, color: '#065F46', lineHeight: 1.5 }}>+ {s}</p>
          ))}
        </div>
      )}

      {/* Weaknesses / exploitable gaps */}
      {c.weaknesses?.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Gaps you can exploit</p>
          {c.weaknesses.slice(0, 2).map((w: string, i: number) => (
            <p key={i} style={{ fontSize: 11, color: '#991B1B', lineHeight: 1.5 }}>→ {w}</p>
          ))}
        </div>
      )}

      {/* Google Maps link if place_id available */}
      {(c.place_id || c.maps_url || c.google_maps_url) && (
        <a href={c.maps_url ?? c.google_maps_url ?? `https://www.google.com/maps/place/?q=place_id:${c.place_id}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 11, color: S.brand, fontWeight: 700, textDecoration: 'none', marginTop: 2 }}>
          View on Google Maps →
        </a>
      )}
    </div>
  )
}

// ─── Property card ────────────────────────────────────────────────────────────
function PropertyCard({ p, rank }: { p: any; rank: number }) {
  const isGood = p.vs_area_median && (p.vs_area_median.includes('-') || p.vs_area_median.toLowerCase().includes('below'))
  const verdictColor = p.size_verdict === 'Ideal' ? S.emerald : p.size_verdict === 'Tight' ? S.amber : S.n500
  return (
    <div style={{
      border: `1.5px solid ${rank === 1 ? S.brand : S.n200}`, borderRadius: 12,
      padding: '16px 18px', background: rank === 1 ? S.brandFaded : S.white, position: 'relative',
    }}>
      {rank === 1 && (
        <div style={{ position: 'absolute', top: -10, left: 16, background: S.brand, color: S.white, fontSize: 10, fontWeight: 800, padding: '2px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>TOP PICK</div>
      )}
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: S.n900, lineHeight: 1.4 }}>{p.address ?? `Property ${rank}`}</p>
        {p.size_verdict && <span style={{ fontSize: 11, fontWeight: 700, color: verdictColor, marginTop: 2, display: 'block' }}>{p.size_verdict} size</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rent/Month</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: rank === 1 ? S.brand : S.n900, fontFamily: S.mono }}>${(p.price_monthly ?? 0).toLocaleString()}</p>
        </div>
        {p.sqm && (
          <div>
            <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Area</p>
            <p style={{ fontSize: 16, fontWeight: 900, color: S.n800, fontFamily: S.mono }}>{p.sqm}m²</p>
          </div>
        )}
      </div>
      {p.vs_area_median && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: isGood ? S.emeraldBg : S.amberBg, border: `1px solid ${isGood ? S.emeraldBdr : S.amberBdr}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: isGood ? S.emerald : S.amber }}>{p.vs_area_median} vs. area median</span>
        </div>
      )}
      {p.maps_url && (
        <a href={p.maps_url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', marginTop: 10, fontSize: 12, color: S.brand, fontWeight: 700, textDecoration: 'none' }}>
          View on Maps →
        </a>
      )}
    </div>
  )
}

// ─── Monthly cost table ───────────────────────────────────────────────────────
function MonthlyCostTable({ breakdown }: { breakdown: any }) {
  if (!breakdown) return null
  const rows = [
    { key: 'rent',                    label: 'Rent' },
    { key: 'staff_salaries',          label: 'Staff & Salaries' },
    { key: 'utilities',               label: 'Utilities' },
    { key: 'technology_subscriptions',label: 'Technology' },
    { key: 'marketing_ongoing',       label: 'Marketing (ongoing)' },
    { key: 'consumables_inventory',   label: 'Consumables & Inventory' },
    { key: 'miscellaneous',           label: 'Miscellaneous' },
  ].filter(r => breakdown[r.key])

  return (
    <div style={{ border: `1px solid ${S.n200}`, borderRadius: 10, overflow: 'hidden' }}>
      {rows.map((row, i) => {
        const val = breakdown[row.key]
        const amount = typeof val === 'object' ? (val.amount ?? val) : val
        const headcount = typeof val === 'object' ? val.headcount : null
        return (
          <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', background: i % 2 === 0 ? S.n50 : S.white, borderBottom: i < rows.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
            <div>
              <span style={{ fontSize: 13, color: S.n700 }}>{row.label}</span>
              {headcount && <span style={{ fontSize: 11, color: S.n400, marginLeft: 8 }}>{headcount} FTE</span>}
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: S.n900, fontFamily: S.mono }}>{String(amount).replace('AUD', 'A$')}</span>
          </div>
        )
      })}
      {breakdown.total_monthly && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', background: S.n900 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: S.white, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Monthly</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: S.white, fontFamily: S.mono }}>{String(breakdown.total_monthly).replace('AUD', 'A$')}</span>
        </div>
      )}
    </div>
  )
}

// ─── Scenario card ────────────────────────────────────────────────────────────
function ScenarioCard({ label, data, color, bg, border }: { label: string; data: any; color: string; bg: string; border: string }) {
  if (!data) return null
  const assumption = data.assumption ?? data.description ?? ''
  const revenue = data.monthly_revenue ?? data.revenue ?? null
  const profit = data.monthly_profit_loss ?? data.monthly_profit ?? data.profit ?? null
  const customers = data.daily_customers ?? null
  return (
    <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      {assumption && <p style={{ fontSize: 12, color, opacity: 0.8, lineHeight: 1.6 }}>{assumption}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {revenue != null && (
          <div>
            <p style={{ fontSize: 10, color, opacity: 0.6, marginBottom: 2 }}>Monthly Revenue</p>
            <p style={{ fontSize: 22, fontWeight: 900, color, fontFamily: S.mono }}>{String(revenue).replace('AUD', 'A$')}</p>
          </div>
        )}
        {profit != null && (
          <div>
            <p style={{ fontSize: 10, color, opacity: 0.6, marginBottom: 2 }}>Net Profit / Loss</p>
            <p style={{ fontSize: 16, fontWeight: 800, color, fontFamily: S.mono }}>{String(profit).replace('AUD', 'A$')}</p>
          </div>
        )}
        {customers != null && (
          <div>
            <p style={{ fontSize: 10, color, opacity: 0.6, marginBottom: 2 }}>Customers / Day</p>
            <p style={{ fontSize: 14, fontWeight: 700, color, fontFamily: S.mono }}>{customers}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── User plan hook ───────────────────────────────────────────────────────────
// Accepts optional reportUnlocked flag from the report's is_unlocked column
function useUserPlan(reportUnlocked?: boolean) {
  const [plan, setPlan]     = useState<string>('free')
  const [used, setUsed]     = useState<number>(0)
  const [credits, setCredits] = useState<number>(0)
  const FREE_LIMIT          = 1

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('plan,total_analyses_used,report_credits').eq('id', user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setPlan(data.plan ?? 'free')
            setUsed(data.total_analyses_used ?? 0)
            setCredits(data.report_credits ?? 0)
          }
        })
    })
  }, [])

  const isFreePlan   = plan === 'free'
  const remaining    = Math.max(0, FREE_LIMIT - used)
  const usedDisplay  = Math.min(used, FREE_LIMIT)
  // Report is "free" (locked) if: user is on free plan AND this report hasn't been individually unlocked AND they have no credits
  // Paid plan users or individually unlocked reports always see full content
  const isFree       = isFreePlan && !reportUnlocked && credits <= 0
  return { plan, used: usedDisplay, remaining, isFree, FREE_LIMIT, credits, isFreePlan }
}

// ─── Paywall gate — blurs premium content for free/locked reports ────────────
function PaywallGate({ locked, label, reportId, children }: {
  locked: boolean
  label: string
  reportId?: string
  children: React.ReactNode
}) {
  if (!locked) return <>{children}</>
  const upgradeUrl = reportId ? `/upgrade?report=${reportId}` : '/upgrade'
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
      {/* Blurred content preview */}
      <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.5 }}>
        {children}
      </div>
      {/* Overlay CTA */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)',
        borderRadius: 12, border: '1.5px solid #E7E5E4',
      }}>
        <div style={{ textAlign: 'center', padding: '24px 32px', maxWidth: 360 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🔒</div>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#1C1917', marginBottom: 6 }}>{label}</p>
          <p style={{ fontSize: 12, color: '#78716C', lineHeight: 1.6, marginBottom: 14 }}>
            Unlock the full financial model, break-even analysis, revenue projections, SWOT insights, and PDF export for this location.
          </p>
          <a href={upgradeUrl} style={{
            display: 'inline-block', padding: '10px 24px', borderRadius: 8,
            background: '#0F766E', color: '#fff', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 2px 8px rgba(15,118,110,0.3)',
          }}>
            Unlock full report — $29
          </a>
          <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 8 }}>
            Or save with a <a href="/upgrade" style={{ color: '#0F766E', fontWeight: 600, textDecoration: 'none' }}>3-pack ($59)</a> or <a href="/upgrade" style={{ color: '#0F766E', fontWeight: 600, textDecoration: 'none' }}>10-pack ($149)</a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Upgrade nudge — shown at the bottom of each free-tier report ─────────────
function UpgradeNudge({ plan, used, remaining, FREE_LIMIT, reportId }: {
  plan: string; used: number; remaining: number; FREE_LIMIT: number; reportId?: string
}) {
  if (plan !== 'free') return null

  return (
    <div style={{
      margin: '8px 0 0', padding: '20px 24px',
      background: '#1C1917',
      border: '1px solid #D97706',
      borderRadius: 12, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#FDE68A', marginBottom: 4 }}>
            Unlock the full financial model for this location
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            Get the complete break-even analysis, revenue projections, SWOT insights, and downloadable PDF for $29.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <a href={reportId ? `/upgrade?report=${reportId}` : '/upgrade'} style={{
            padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: '#0F766E', color: '#FFFFFF', border: 'none', textDecoration: 'none', cursor: 'pointer',
            boxShadow: '0 1px 8px rgba(15,118,110,0.4)'
          }}>
            Unlock full report — $29
          </a>
        </div>
      </div>
      <p style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
        Save with a 3-pack ($59) or 10-pack ($149) — credits never expire
      </p>
    </div>
  )
}

// ─── Realtime hook ────────────────────────────────────────────────────────────
function useReport(reportId: string) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Fire the "report ready" email once when completion is first detected.
  // Uses sessionStorage to deduplicate across re-renders and page refreshes.
  function maybeSendCompletionEmail(reportId: string) {
    try {
      const key = `email_sent_${reportId}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
      fetch('/api/email/report-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      }).catch(() => {/* non-critical */})
    } catch {/* sessionStorage may be unavailable */}
  }

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [loading])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(`report_${reportId}`)
      if (cached) {
        const raw = JSON.parse(cached)
        setReport({
          id: raw.reportId || reportId, report_id: raw.reportId || reportId,
          verdict: raw.verdict, overall_score: raw.overall_score,
          score_rent: raw.score_rent, score_competition: raw.score_competition,
          score_demand: raw.score_demand, score_profitability: raw.score_profitability,
          score_cost: raw.score_cost, recommendation: raw.recommendation,
          competitor_analysis: raw.competitor_analysis, rent_analysis: raw.rent_analysis,
          market_demand: raw.market_demand, cost_analysis: raw.cost_analysis,
          profitability: raw.profitability, pl_summary: raw.pl_summary,
          three_year_projection: raw.three_year_projection,
          sensitivity_analysis: raw.sensitivity_analysis,
          swot_analysis: raw.swot_analysis, breakeven_monthly: raw.breakeven_monthly,
          breakeven_daily: raw.breakeven_daily, breakeven_months: raw.breakeven_months,
          location_name: raw.location?.formattedAddress || null,
          business_type: raw.location?.businessType || null,
          monthly_rent: raw.financials?.rent?.submitted || null,
          full_report_markdown: null, result_data: raw,
          created_at: raw.generatedAt || new Date().toISOString(),
          is_public: false, public_token: null,
        })
        setLoading(false)
        return
      }
    } catch {}

    const supabase = createClient()

    async function fetchCurrent() {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id
      const { data, error } = await supabase
        .from('reports').select('*')
        .or(`report_id.eq.${reportId},id.eq.${reportId}`)
        .order('created_at', { ascending: false }).limit(1).maybeSingle()

      if (data && data.user_id && userId && data.user_id !== userId && !data.is_public) {
        setLoading(false); setNotFound(true); return
      }
      if (error) { console.error('[Report] fetch error:', error.code, error.message); return null }
      return data
    }

    const channel = supabase
      .channel(`report:${reportId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports', filter: `report_id=eq.${reportId}` },
        (payload) => {
          const updated = payload.new as Report
          setReport(updated)
          // v2: complete when computed_result is written (engine ran)
          // v1: complete when status=complete + verdict present
          const isComplete = updated.computed_result != null
            || ((updated.status === 'complete' || updated.status === 'completed') && updated.verdict)
          if (isComplete) { setLoading(false); maybeSendCompletionEmail(reportId) }
          else if (updated.status === 'failed') setLoading(false)
        }
      ).subscribe()

    let pollInterval: ReturnType<typeof setInterval> | null = null
    let pollAttempts = 0

    async function checkAndSettle() {
      pollAttempts++
      const data = await fetchCurrent()
      if (data) {
        setReport(data as Report)
        const reportComplete = (data as any).computed_result != null
          || ((data.status === 'complete' || data.status === 'completed') && data.verdict)
        if (reportComplete || data.status === 'failed') {
          setLoading(false)
          if (reportComplete) maybeSendCompletionEmail(reportId)
          if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
          return
        }
      }
      if (pollAttempts >= 20) {
        setLoading(false)
        if (!data) setNotFound(true)
        if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
      }
    }

    const startDelay = setTimeout(() => {
      checkAndSettle()
      pollInterval = setInterval(checkAndSettle, 8000)
    }, 300)

    return () => {
      clearTimeout(startDelay)
      if (pollInterval) clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [reportId])

  return { report, loading, notFound, elapsedSeconds }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shortAddr(addr?: string | null): string {
  if (!addr) return ''
  const stateMatch = addr.match(/\b(NSW|VIC|QLD|WA|SA|ACT|TAS|NT)\b/i)
  const state = stateMatch ? ' ' + stateMatch[1].toUpperCase() : ''
  const parts = addr.split(',').map(s => s.trim()).filter(Boolean)
  if (parts.length <= 2) return addr
  return parts.slice(0, 2).join(', ') + state
}

// Parse any value that might be a JSON string or already an object
function safeParse(v: any): any {
  if (!v) return {}
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return {} }
}

// Parse submitted input_data column (may be string or object)
function safeInputData(id: any): any {
  return safeParse(id)
}

// Extract a numeric value from pl_summary string
// e.g. parsePLValue("Revenue: AUD 35,000/mo | Net: AUD 31,000/mo", "Net") → 31000
function parsePLValue(pl: string | null | undefined, key: string): number | null {
  if (!pl) return null
  const match = pl.match(new RegExp(key + '[:\\s]+(?:[A-Z$]+\\s*)?([\\d,]+)', 'i'))
  return match ? (parseInt(match[1].replace(/,/g, ''), 10) || null) : null
}

// Normalise result_data: handles both the old scoring-engine format and the
// new n8n multi-agent format (keys a1…a8 + agent_statuses).
// Returns a unified object that the rest of the page can read.
function safeResultData(rd: any): any {
  if (!rd) return {}
  const parsed: any = safeParse(rd)

  // Old scoring-engine format already has 'financials' or 'score' key — pass through
  if (parsed.financials || parsed.score) return parsed

  // n8n agent format: keys are a1, a2 … a8 + agent_statuses / errors
  if (parsed.a1 !== undefined || parsed.agent_statuses !== undefined) {
    const a1out  = (parsed.a1?.outputs  || parsed.a1)  ?? {}
    const a2out  = (parsed.a2?.outputs  || parsed.a2)  ?? {}
    const a3out  = (parsed.a3?.outputs  || parsed.a3)  ?? {}
    const a4out  = (parsed.a4?.outputs  || parsed.a4)  ?? {}
    const a5out  = (parsed.a5?.outputs  || parsed.a5)  ?? {}
    const a6out  = (parsed.a6?.outputs  || parsed.a6)  ?? {}

    const competitorCount = Number(a1out.competitors_within_500m ?? a1out.total_competitors_found ?? 0)
    const satLevelRaw     = String(a1out.saturation_level ?? '').toUpperCase() || 'UNKNOWN'
    // saturation_level comes as 'High' → normalise to 'HIGH' so the intensity colour logic works
    const intensityLabel  = satLevelRaw === 'HIGH' ? 'HIGH' : satLevelRaw === 'LOW' ? 'LOW' : 'MEDIUM'

    const monthlyRevenue   = parseMoney(a5out.monthly_revenue ?? a5out.projected_monthly_revenue
      ?? a5out.revenue_range?.monthly_base
      ?? a4out.financial_projections?.estimated_monthly_revenue) || null
    const monthlyNetProfit = parseMoney(a5out.net_profit ?? a5out.monthly_profit ?? a5out.monthly_net_profit
      ?? a5out.sensitivity_analysis?.base_case?.monthly_profit_loss
      ?? a4out.financial_projections?.monthly_profit_at_capacity) || null
    const totalCosts       = parseMoney(a4out.total_monthly_costs ?? a4out.monthly_total
      ?? a4out.monthly_operating_cost?.total_monthly) || null

    return {
      ...parsed,
      competitors: {
        count:                competitorCount,
        directCompetitorCount: (a1out.competitor_profiles ?? []).filter((c: any) =>
          String(c.competitor_type ?? '').toLowerCase() === 'direct').length,
        saturationLevel:  intensityLabel.toLowerCase(),
        intensityLabel,
        nearbyBusinesses: (a1out.competitor_profiles ?? []).map((c: any) => ({
          name:        c.name ?? '',
          rating:      c.rating ?? 0,
          type:        c.competitor_type ?? '',
          distance:    0,
          reviews:     c.review_count ?? 0,
          pricing:     c.estimated_pricing ?? '',
          strengths:   Array.isArray(c.strengths)  ? c.strengths  : [],
          weaknesses:  Array.isArray(c.weaknesses) ? c.weaknesses : [],
          within_500m: c.within_500m ?? false,
        })),
        dataQuality:              parsed.a1?.status === 'success' ? 'live' : 'estimated_fallback',
        opportunity_gaps:         a1out.opportunity_gaps ?? [],
        differentiation_suggestions: a1out.differentiation_suggestions ?? [],
        threat_summary:           a1out.threat_summary ?? null,
        locality_context:         a1out.locality_context ?? null,
        pricing_bands:            a1out.pricing_bands ?? null,
      },
      demographics: {
        medianIncome:      Number(a6out.median_household_income ?? a6out.median_income ?? 0) || null,
        populationDensity: Number(a6out.population_density ?? 0) || null,
        ageDistribution:   a6out.age_distribution ?? null,
        affordabilityLabel: a6out.affordability_label ?? null,
        dataQuality:       parsed.a6?.status === 'success' ? 'suburb_level' : 'abs_state_default',
      },
      financials: {
        monthlyRevenue,
        totalMonthlyCosts: totalCosts,
        monthlyNetProfit,
        avgTicketSize:     parseMoney(
          a5out.avg_ticket_size
          ?? a5out.avg_ticket_validation?.market_benchmark
          ?? a5out.avg_ticket_validation?.user_range
        ) || null,
        baselineCustomers: Number(a5out.daily_customers ?? a5out.baseline_customers ?? a5out.customer_volume?.daily_customers_base ?? 0) || null,
        profitMargin:      Number(a5out.profit_margin ?? 0) || null,
        rent: {
          areaMedianMonthly: parseMoney(a2out.median_rent?.monthly) || null,
          amount:            parseMoney(a2out.median_rent?.monthly) || null,
          submitted:         null,   // set in render from report.monthly_rent
          toRevenuePercent:  null,   // computed in render after submitted is known
          label:             null,
        },
        labour: parseMoney(a4out.monthly_labour ?? a4out.monthly_staff_cost ?? a4out.monthly_operating_cost?.staff_salaries?.amount) || null,
        cogs:   parseMoney(a4out.cogs ?? a4out.monthly_cogs ?? a4out.monthly_operating_cost?.consumables_inventory?.amount) || null,
        projections:    { year1: null, year2: null, year3: null },
        riskScenarios:  {},
        // A5 rich fields
        revenueChannels:    a5out.revenue_channels    ?? [],
        pricingStrategies:  a5out.pricing_strategies  ?? [],
        recommendedPricing: (a5out.pricing_strategies ?? []).find((s: any) => s.recommended) ?? null,
        monthlyRamp:        a5out.year1_monthly_ramp  ?? [],
        breakEvenMonthsA5:  Number(a5out.break_even_months ?? 0) || null,
        // A4 setup cost fields
        setupCostRec:   parseMoney(a4out.setup_cost_estimate?.recommended) || null,
        setupCostMin:   parseMoney(a4out.setup_cost_estimate?.total_min)   || null,
        setupCostMax:   parseMoney(a4out.setup_cost_estimate?.total_max)   || null,
        setupBreakdown: a4out.setup_cost_breakdown ?? null,
        roiTimeline: {
          roi12: a4out.financial_projections?.roi_12_months ?? null,
          roi24: a4out.financial_projections?.roi_24_months ?? null,
          roi36: a4out.financial_projections?.roi_36_months ?? null,
        },
        monthlyCostBreakdown:  a4out.monthly_operating_cost ?? null,
        breakEvenMonths:       Number(a4out.financial_projections?.break_even_months ?? 0) || null,
        grossMarginPct:        a4out.financial_projections?.gross_margin_pct ?? null,
        costOptimisationTips:  a4out.cost_optimisation_tips ?? [],
        sensitivityAnalysis:   a5out.sensitivity_analysis ?? null,
        revenueGrowthLevers:   a5out.revenue_growth_levers ?? [],
        customerVolume:        a5out.customer_volume ?? null,
      },
      // A2 area context
      areaContext: {
        roadType:        a2out.area_context?.road_type       ?? null,
        footfallSignal:  a2out.area_context?.footfall_signal ?? null,
        transitSignal:   a2out.area_context?.transport_signal ?? null,
        transitStops:    a2out.area_context?.transit_stops   ?? null,
        majorAnchors:    a2out.area_context?.major_anchors_nearby ?? [],
        anchorEffect:    a2out.area_context?.anchor_effect   ?? null,
        foodRetailPois:  a2out.area_context?.food_retail_pois ?? null,
        topListing:      (a2out.top_3_recommendations ?? [])[0] ?? null,
        topListings:     a2out.top_3_recommendations ?? [],
        medianRent:      a2out.median_rent ?? null,
      },
      // A3 market intelligence
      market: {
        demandTrend:       a3out.demand_trend          ?? null,
        growthScore:       a3out.growth_score          ?? null,
        opportunityScore:  a3out.opportunity_score     ?? null,
        bestEntryTiming:   a3out.best_entry_timing     ?? null,
        marketMaturity:    a3out.market_maturity_stage ?? null,
        marketVerdict:     a3out.overall_market_verdict ?? null,
        competitorThreat:  a3out.competitor_threat_level ?? null,
        regulatoryFlags:   a3out.regulatory_flags      ?? [],
        topOpportunities:  a3out.top_opportunities     ?? [],
        topRisks:          a3out.top_risks             ?? [],
        seasonalPatterns:  a3out.seasonal_demand_patterns ?? [],
        targetSegments:    a3out.target_customer_segments ?? [],
        fiveYearForecast:  a3out.five_year_forecast    ?? null,
      },
    }
  }

  return parsed
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params)
  const router = useRouter()
  const { report, loading, notFound, elapsedSeconds } = useReport(reportId)
  const userPlan = useUserPlan(report?.is_unlocked ?? undefined)
  const [activeTab, setActiveTab] = useState('overview')

  // ── Save & Track state ─────────────────────────────────────────────────────
  const [isSaved, setIsSaved]               = useState(false)
  const [locationStatus, setLocationStatus] = useState<string>('researching')
  const [saveLoading, setSaveLoading]       = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  // Sync from report once loaded
  useEffect(() => {
    if (report) {
      setIsSaved(report.is_saved ?? false)
      setLocationStatus(report.location_status ?? 'researching')
    }
  }, [report?.is_saved, report?.location_status])

  const toggleSave = async () => {
    if (!report || saveLoading) return
    const next = !isSaved
    setSaveLoading(true)
    setIsSaved(next)
    try {
      await fetch(`/api/reports/${report.report_id ?? report.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved: next, status: next ? 'shortlisted' : 'researching' }),
      })
      if (next) setLocationStatus('shortlisted')
    } catch { setIsSaved(!next) }
    setSaveLoading(false)
  }

  const updateStatus = async (status: string) => {
    if (!report) return
    setLocationStatus(status)
    setShowStatusMenu(false)
    await fetch(`/api/reports/${report.report_id ?? report.id}/save`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  // ── Feedback state ─────────────────────────────────────────────────────────
  const [feedbackDismissed, setFeedbackDismissed] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackProceeded, setFeedbackProceeded] = useState<boolean | null>(null)
  const [feedbackAccuracy, setFeedbackAccuracy]   = useState<number | null>(null)
  const [feedbackNotes, setFeedbackNotes]         = useState('')
  const [feedbackLoading, setFeedbackLoading]     = useState(false)

  const submitFeedback = async (proceeded: boolean) => {
    if (!report || feedbackLoading) return
    setFeedbackProceeded(proceeded)
    setFeedbackLoading(true)
    await fetch(`/api/reports/${report.report_id ?? report.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proceeded, accuracy: feedbackAccuracy, notes: feedbackNotes }),
    })
    setFeedbackSubmitted(true)
    setFeedbackLoading(false)
  }

  const dismissFeedback = async () => {
    if (!report) return
    setFeedbackDismissed(true)
    await fetch(`/api/reports/${report.report_id ?? report.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dismissed: true }),
    })
  }

  // ── Map state ──────────────────────────────────────────────────────────────
  const [mapInsights, setMapInsights] = useState<MapInsights | null>(null)
  const [mapCompetitors, setMapCompetitors] = useState<Competitor[]>([])
  const [mapAnchors, setMapAnchors] = useState<Anchor[]>([])
  const [mapRadius, setMapRadius] = useState<number | undefined>(undefined)
  const [mapCatchmentRadius, setMapCatchmentRadius] = useState<number>(1500)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showIsochrones, setShowIsochrones] = useState(true)
  const [mapBusinessType, setMapBusinessType] = useState('cafe')
  const handleInsightsUpdate = useCallback((insights: MapInsights) => setMapInsights(insights), [])
  const handleCompetitorsUpdate = useCallback((comps: Competitor[]) => setMapCompetitors(comps), [])
  const handleAnchorsUpdate = useCallback((a: Anchor[]) => setMapAnchors(a), [])

  // ── Recalculation sliders ──────────────────────────────────────────────────
  // Uses shared whatIfCalc() from lib/compute/client-calc.ts — same formulas
  // as the server-side compute engine (benchmark path).
  const [sliderOpen, setSliderOpen] = useState(false)
  const [adjRent, setAdjRent] = useState<number | null>(null)
  const [adjTicket, setAdjTicket] = useState<number | null>(null)
  const [adjCustomers, setAdjCustomers] = useState<number | null>(null)

  // Resolve benchmark defaults for slider ranges
  const _btBizKey = resolveClientBizKey(report?.business_type ?? 'other')
  const _btBenchmark = CLIENT_BENCHMARKS[_btBizKey] ?? CLIENT_BENCHMARKS['other']

  const _fin = safeResultData(report?.result_data)?.financials || {}
  const _cr = report?.computed_result as any // engine v2 — referenced before C is declared
  const baseRent = report?.monthly_rent ?? _fin?.rent?.submitted ?? 2500
  // Ticket: compute engine → fin derived → business type benchmark
  const _rawTicket = (_cr?.avgTicketSize ?? null) || (_fin?.avgTicketSize ?? null) || null
  const baseTicket = (_rawTicket && _rawTicket > 0) ? Math.round(_rawTicket) : _btBenchmark.avgTicketSize
  // Customers: compute engine → fin baseline → business type benchmark
  const _rawCustomers = (_cr?.dailyCustomers ?? null) || (_fin?.baselineCustomers ?? null) || null
  const baseCustomers = (_rawCustomers && _rawCustomers > 0) ? Math.round(_rawCustomers) : _btBenchmark.dailyCustomersBase
  const _scoreComp = report?.score_competition ?? 50
  const _scoreDem = report?.score_demand ?? 50

  const adjCalc = useMemo(() => {
    const rent = adjRent ?? baseRent
    const ticket = adjTicket ?? baseTicket
    const customers = adjCustomers ?? baseCustomers

    // Use shared whatIfCalc — same formulas as compute engine
    const calc = whatIfCalc({
      businessType: report?.business_type ?? 'other',
      monthlyRent: rent,
      avgTicketSize: ticket,
      dailyCustomers: customers,
    })

    const rentScore = scoreRent(calc.rentToRevenuePct)
    const profitScore = scoreProfitability(calc.netProfit)
    const { overall, verdict } = compositeScore({
      rent: rentScore,
      profitability: profitScore,
      competition: _scoreComp,
      demand: _scoreDem,
    })
    const changed = (adjRent != null && adjRent !== baseRent) || (adjTicket != null && adjTicket !== baseTicket) || (adjCustomers != null && adjCustomers !== baseCustomers)

    return {
      rent,
      ticket,
      customers,
      monthlyRevenue: calc.monthlyRevenue,
      totalMonthlyCosts: calc.totalCosts,
      monthlyGrossProfit: Math.round(calc.monthlyRevenue * calc.grossMarginPct / 100),
      monthlyNetProfit: calc.netProfit,
      profitMargin: calc.profitMarginPct,
      rentToRevRatio: calc.rentToRevenuePct / 100,
      rentPct: calc.rentToRevenuePct,
      breakEvenMonthly: 0, // not used in UI
      breakEvenDaily: calc.breakEvenDaily,
      scoreRent: rentScore,
      scoreProfitability: profitScore,
      overall,
      verdict,
      changed,
    }
  }, [adjRent, adjTicket, adjCustomers, baseRent, baseTicket, baseCustomers, _scoreComp, _scoreDem, report?.business_type])

  // Hysteresis: only show a verdict flip when score moves by ≥8 points.
  // Without this, crossing a single scoring threshold (e.g. rent% from 17.9%→18.1%)
  // flips the verdict which feels broken even though it's mathematically correct.
  const _origScore      = report?.overall_score ?? 50
  const _adjScoreDelta  = adjCalc.overall - _origScore
  const _normalizedOrigVerdict = normalizeVerdict(report?.verdict ?? null) as 'GO' | 'CAUTION' | 'NO'
  const _verdictFlipped = Math.abs(_adjScoreDelta) >= 8 && adjCalc.verdict !== _normalizedOrigVerdict
  // Displayed verdict in what-if: use adjusted only when it has meaningfully shifted
  const _adjDisplayVerdict: 'GO' | 'CAUTION' | 'NO' =
    _verdictFlipped ? adjCalc.verdict : _normalizedOrigVerdict
  const adjVc = verdictCfg(_adjDisplayVerdict)
  const isChanged = adjCalc.changed

  // Sync map business type + radii from report / computed_result
  useEffect(() => {
    if (report?.business_type) {
      const bt = (report.business_type || '').toLowerCase()
      const match = BUSINESS_TYPES.find(b => bt.includes(b.id))
      if (match) {
        setMapBusinessType(match.id)
        setMapCatchmentRadius(CATCHMENT_RADIUS_M[match.id] ?? 1500)
      }
    }
  }, [report?.business_type])

  useEffect(() => {
    const compR = (report?.computed_result as any)?.competitorRadius
    if (compR && compR > 0) setMapRadius(compR)
  }, [(report?.computed_result as any)?.competitorRadius])

  // Map tab: lazy load ref (must be before early returns)
  const mapTabMounted = useRef(false)
  if (activeTab === 'map') mapTabMounted.current = true

  // Map banner computed values (must be before early returns)
  const _rdMap = report ? safeResultData(report.result_data) : {}
  const _competitors = _rdMap.competitors || null

  const mapBannerText = useMemo(() => {
    const bt = report?.business_type || 'businesses'
    // Prefer live map data (post-filter) over raw A1 agent count
    if (mapInsights) {
      const count = mapInsights.competitorCount500m ?? 0
      const density = mapInsights.density ?? 'unknown'
      const cityAvg = count > 20 ? '12--18' : count > 10 ? '8--12' : '3--6'
      if (density === 'high' || count > 15) return `High competition zone — ${count} ${bt.toLowerCase()} within 500m (city avg: ${cityAvg})`
      if (density === 'medium' || count > 6) return `Moderate competition — ${count} ${bt.toLowerCase()} within 500m (city avg: ${cityAvg})`
      return `Low competition area — only ${count} ${bt.toLowerCase()} within 500m`
    }
    // No live map yet — use computed_result competitor count if available
    const _comp = report?.computed_result ?? null
    if (_comp) {
      const validCount = _comp.validCompetitorCount
      if (validCount === 0) return null
      const radius = _comp.competitorRadius ?? 500
      const cityAvg = validCount > 20 ? '12–18' : validCount > 10 ? '8–12' : '3–6'
      const density = validCount <= 3 ? 'low' : validCount <= 8 ? 'medium' : 'high'
      if (density === 'high' || validCount > 15) return `High competition zone — ${validCount} ${bt.toLowerCase()} within ${radius}m (city avg: ${cityAvg})`
      if (density === 'medium' || validCount > 6) return `Moderate competition — ${validCount} ${bt.toLowerCase()} within ${radius}m (city avg: ${cityAvg})`
      return `Low competition area — only ${validCount} ${bt.toLowerCase()} within ${radius}m`
    }
    return null
  }, [report?.computed_result, mapInsights, report?.business_type])

  const mapBannerColor = useMemo(() => {
    const _comp = report?.computed_result ?? null
    const count = mapInsights?.competitorCount500m ?? (_comp?.validCompetitorCount ?? 0)
    const density = mapInsights?.density ?? (count <= 3 ? 'low' : count <= 8 ? 'medium' : 'high')
    if (density === 'high' || count > 15) return { bg: S.redBg, border: S.redBdr, text: S.red, icon: S.red }
    if (density === 'medium' || count > 6) return { bg: S.amberBg, border: S.amberBdr, text: S.amber, icon: S.amber }
    return { bg: S.emeraldBg, border: S.emeraldBdr, text: S.emerald, icon: S.emerald }
  }, [report?.computed_result, mapInsights])

  const avgRating = useMemo(() => {
    const rated = mapCompetitors.filter((c: any) => c.rating && c.rating > 0)
    if (rated.length === 0) return null
    return (rated.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / rated.length).toFixed(1)
  }, [mapCompetitors])

  // ── Loading screen ──────────────────────────────────────────────────────────
  // Hard timeout: after 5 min, stop blocking on the loading screen
  const _isHardTimeout = elapsedSeconds > 300
  if (!_isHardTimeout && (loading || (report && !report.verdict && report.status !== 'failed' && report.status !== 'completed' && report.status !== 'complete'))) {
    const STEPS = [
      { key: 'Queued',                     label: 'Queued' },
      { key: 'Sending to analysis engine', label: 'Connecting to engine' },
      { key: 'Resolving address',          label: 'Resolving address' },
      { key: 'Scanning competitors',       label: 'Scanning competitors' },
      { key: 'Querying demographics',      label: 'Querying demographics' },
      { key: 'Modelling financials',       label: 'Modelling financials' },
      { key: 'Writing report',             label: 'Writing report' },
      { key: 'Finalising',                 label: 'Finalising' },
    ]
    const currentStep  = report?.progress_step || 'Queued'
    const activeIdx    = Math.max(0, STEPS.findIndex(s => s.key === currentStep))
    const stepPct      = Math.round((activeIdx / (STEPS.length - 1)) * 100)
    const timeNudge    = Math.min(Math.floor(elapsedSeconds / 5), 5)
    const displayPct   = Math.min(stepPct + timeNudge, 96)
    const isFailed     = report?.status === 'failed'
    const isStuck      = elapsedSeconds > 90

    const etaText = elapsedSeconds < 20
      ? 'Usually ready in 60–90 seconds'
      : elapsedSeconds < 45
      ? `Almost there\u2026`
      : elapsedSeconds < 90
      ? 'Wrapping up\u2026'
      : 'Taking longer than usual — still running'

    return (
      <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <style>{`
          @keyframes spin    { to { transform:rotate(360deg) } }
          @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
          @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
          @keyframes barGlow { 0%,100%{box-shadow:0 0 8px rgba(20,184,166,0.35)} 50%{box-shadow:0 0 20px rgba(20,184,166,0.65)} }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        `}</style>
        <div style={{ textAlign: 'center', maxWidth: 440, width: '100%', padding: '40px 24px' }}>
          {isFailed ? (
            <>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✕</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: S.white, marginBottom: 8 }}>Analysis failed</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>{report?.progress_step || 'The analysis engine could not be reached. Please try again.'}</p>
              <button onClick={() => window.history.back()} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>Try again</button>
            </>
          ) : (
            <>
              {/* Dual-ring spinner with pin */}
              <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto 24px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: S.brandLight, animation: 'spin 1s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.04)', borderBottomColor: 'rgba(20,184,166,0.35)', animation: 'spin 1.7s linear infinite reverse' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📍</div>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, color: S.white, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Analysing your location
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, animation: 'pulse 3s ease infinite' }}>
                {etaText}
              </p>

              {/* Progress bar */}
              <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${displayPct}%`,
                  background: `linear-gradient(90deg, ${S.brand}, ${S.brandLight})`,
                  borderRadius: 4,
                  transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
                  animation: 'barGlow 2s ease infinite',
                }} />
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%', width: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2.2s ease infinite',
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 28, textAlign: 'right' }}>{displayPct}%</div>

              {/* Step list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left', marginBottom: 24 }}>
                {STEPS.filter(s => s.key !== 'Queued').map((step) => {
                  const stepIdx  = STEPS.findIndex(s2 => s2.key === step.key)
                  const isDone   = activeIdx > stepIdx
                  const isActive = activeIdx === stepIdx
                  return (
                    <div key={step.key} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 14px',
                      background:   isActive ? 'rgba(20,184,166,0.1)' : isDone ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderRadius: 10,
                      border:       isActive ? '1px solid rgba(20,184,166,0.28)' : '1px solid transparent',
                      transition:   'all 0.4s ease',
                      animation:    isActive ? 'fadeIn 0.4s ease' : 'none',
                    }}>
                      <div style={{ flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isDone ? (
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: S.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        ) : isActive ? (
                          <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', borderTopColor: S.brandLight, animation: 'spin 0.75s linear infinite' }} />
                        ) : (
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                        )}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: isActive ? 700 : isDone ? 500 : 400, color: isActive ? S.brandLight : isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)', flex: 1 }}>
                        {step.label}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: 10, color: S.brandLight, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.22)', borderRadius: 20, padding: '2px 8px', fontWeight: 700, letterSpacing: '0.06em', animation: 'pulse 1.8s ease infinite' }}>
                          RUNNING
                        </span>
                      )}
                      {isDone && <span style={{ fontSize: 10, color: 'rgba(5,150,105,0.55)', fontWeight: 500 }}>done</span>}
                    </div>
                  )
                })}
              </div>

              {/* Timeout warning */}
              {isStuck && (
                <div style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 12, color: '#FCD34D', lineHeight: 1.7, textAlign: 'left', animation: 'fadeIn 0.5s ease' }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Still processing\u2026</div>
                  Your report is in the queue. You can leave this page \u2014 it will be ready at this URL when complete.
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => window.location.reload()} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Refresh</button>
                    <button onClick={() => { window.location.href = '/dashboard' }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Back to dashboard</button>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Live via Supabase Realtime &nbsp;·&nbsp; {elapsedSeconds}s
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Not found ──
  if (notFound || !report) {
    return (
      <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, marginBottom: 12, opacity: 0.4, color: S.n400 }}>404</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Report not found</h2>
          <p style={{ fontSize: 14, color: S.n500, marginBottom: 24 }}>This report may still be processing or the link has expired.</p>
          <button onClick={() => router.push('/dashboard')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: S.font }}>Back to Dashboard</button>
        </div>
      </div>
    )
  }

  // ─── REPORT DATA ────────────────────────────────────────────────────────────
  const vc = verdictCfg(report.verdict)

  // Always parse result_data for narrative/text fields (SWOT, A3 risks, A6 demographics, etc.)
  // These are NOT produced by computeEngine — they come from raw n8n agent narrative outputs.
  const _rd = safeResultData(report.result_data)
  const scoring   = _rd.scoring || {}
  const _inputData = safeInputData(report.input_data)
  const reportLat: number | null = _rd.location?.lat ?? _inputData?.lat ?? null
  const reportLng: number | null = _rd.location?.lng ?? _inputData?.lng ?? null
  const _submittedRent: number | null =
    report.monthly_rent
    ?? parseMoney((_inputData as any)?.monthlyRent ?? (_inputData as any)?.monthly_rent)
    ?? null

  // ── Engine v2: computed_result is the authoritative financial source ──────────
  // If present, ALL financial and scoring values come exclusively from here.
  // The UI NEVER computes, falls back, patches, or re-derives anything.
  const C: ComputedResult | null = report.computed_result ?? null
  const hasComputed = C !== null

  // ── fin / competitors / areaContext / market / demographics ──────────────────
  // v2 path: built from computed_result (immutable, pre-validated)
  // v1 path: built from legacy safeResultData + inline computation (old reports)
  let fin:         any
  let competitors: any
  let areaContext: any
  let market:      any
  let demographics: any

  if (hasComputed && C) {
    // ════════════════════════════════════════════════════════════════════════
    // ENGINE V2 PATH — zero arithmetic here, only field mapping
    // ════════════════════════════════════════════════════════════════════════
    const rentPct = C.revenue > 0 && _submittedRent != null
      ? Math.round(_submittedRent / C.revenue * 1000) / 10 : null

    fin = {
      monthlyRevenue:    C.revenue,
      totalMonthlyCosts: C.totalCosts,
      monthlyNetProfit:  C.netProfit,        // INVARIANT enforced by computeEngine
      grossMarginPct:    `${C.grossMarginPct}%`,
      avgTicketSize:     C.avgTicketSize,
      baselineCustomers: C.dailyCustomers,
      revenueChannels:   C.revenueChannels.map((ch: any) => ({
        channel:           ch.channel,
        revenue_split_pct: ch.pct,
        // Use k-notation for benchmark channels — exact dollars imply precision we don't have
        monthly_revenue:   ch.isBenchmark
          ? `~A$${Math.round(Number(ch.monthly) / 1000)}k`
          : `A$${Number(ch.monthly).toLocaleString('en-AU')}`,
        isBenchmark:       ch.isBenchmark ?? false,
      })),
      sensitivityAnalysis: {
        worst_case: { assumption: C.scenarios.worst.assumption, monthly_revenue: C.scenarios.worst.monthly_revenue, monthly_profit_loss: C.scenarios.worst.monthly_profit, daily_customers: C.scenarios.worst.customers_needed },
        base_case:  { assumption: C.scenarios.base.assumption,  monthly_revenue: C.scenarios.base.monthly_revenue,  monthly_profit_loss: C.scenarios.base.monthly_profit,  daily_customers: C.scenarios.base.customers_needed  },
        best_case:  { assumption: C.scenarios.best.assumption,  monthly_revenue: C.scenarios.best.monthly_revenue,  monthly_profit_loss: C.scenarios.best.monthly_profit,  daily_customers: C.scenarios.best.customers_needed  },
      },
      scenarioSource: C.meta.computeLog.revenueSource === 'benchmark_default' ? 'benchmark' : 'a5',
      rent: {
        submitted:         _submittedRent,
        toRevenuePercent:  rentPct,
        areaMedianMonthly: C.locationSignals.medianRent,
        label: rentPct == null ? null
          : rentPct <= 12 ? 'EXCELLENT'
          : rentPct <= 20 ? 'GOOD'
          : rentPct <= 30 ? 'MARGINAL' : 'HIGH RISK',
      },
      isEstimated:          C.meta.computeLog.revenueSource === 'benchmark_default',
      confidenceNote:       C.meta.computeLog.revenueSource === 'benchmark_default'
        ? `Estimated from ${((report.business_type ?? 'business').toLowerCase().split(/[\s\/]/)[0])} industry benchmarks (AU)` : null,
      revenueGrowthLevers:  _rd.financials?.revenueGrowthLevers ?? [],
      monthlyRamp:          _rd.financials?.monthlyRamp          ?? [],
      setupCostRec:         parseMoney((_inputData as any)?.setupBudget) ?? null,
      roiTimeline:          { roi12: null, roi24: null, roi36: null },
      projections:          { year1: null, year2: null, year3: null },
      riskScenarios:        {},
      breakEvenMonths:      C.breakEvenMonths,
      costOptimisationTips: [],
      customerVolume:       { daily_customers_needed_breakeven: C.breakEvenDaily },
      monthlyCostBreakdown: null,
      profitMargin:         C.revenue > 0 ? (C.netProfit / C.revenue * 100).toFixed(1) : null,
    }

    competitors = {
      count:                 C.validCompetitorCount,
      validCount:            C.validCompetitorCount,
      directCompetitorCount: C.competitors.filter((c: any) => c.type === 'direct').length,
      validNearbyBusinesses: C.competitors,
      nearbyBusinesses:      C.competitors,
      // rawCompetitorCount = all A1 businesses before type-filtering; subtract validated to get filtered
      filteredOutCount:      Math.max(0, (C.meta.computeLog.rawCompetitorCount ?? 0) - C.validCompetitorCount),
      intensityLabel:  C.marketSignals.saturationLabel?.toUpperCase()
        ?? (C.validCompetitorCount <= 3 ? 'LOW' : C.validCompetitorCount <= 8 ? 'MEDIUM' : 'HIGH'),
      saturationLevel: C.marketSignals.saturationLabel
        ?? (C.validCompetitorCount <= 3 ? 'low' : C.validCompetitorCount <= 8 ? 'medium' : 'high'),
      dataQuality:             'live',
      opportunity_gaps:        _rd.competitors?.opportunity_gaps         ?? [],
      differentiation_suggestions: _rd.competitors?.differentiation_suggestions ?? [],
      threat_summary:          _rd.competitors?.threat_summary           ?? null,
      locality_context:        _rd.competitors?.locality_context         ?? null,
      pricing_bands:           _rd.competitors?.pricing_bands            ?? null,
    }

    areaContext = {
      roadType:       C.locationSignals.roadType,
      footfallSignal: C.locationSignals.footfallSignal,
      transitSignal:  C.locationSignals.transitSignal,
      transitStops:   null,
      majorAnchors:   C.locationSignals.nearbyAnchors,
      anchorEffect:   null,
      foodRetailPois: null,
      medianRent:     C.locationSignals.medianRent != null
        ? { monthly: C.locationSignals.medianRent } : null,
      topListings:    _rd.areaContext?.topListings ?? [],
      topListing:     _rd.areaContext?.topListing  ?? null,
    }

    // Market narrative comes from A3 raw output — engine only computes scores, not text
    market = _rd.market ?? {
      demandTrend: C.marketSignals.demandTrend,  growthScore: C.marketSignals.demandScore,
      opportunityScore: C.marketSignals.demandScore, topRisks: [], topOpportunities: [],
      competitorThreat: null, regulatoryFlags: [], seasonalPatterns: [], targetSegments: [],
      fiveYearForecast: null, marketMaturity: null, marketVerdict: null, bestEntryTiming: null,
    }

    demographics = _rd.demographics ?? null

  } else {
    // ════════════════════════════════════════════════════════════════════════
    // LEGACY V1 PATH — old reports without computed_result
    // Display raw agent data as-is — no client-side financial computation.
    // Users are directed to re-run for validated financials.
    // ════════════════════════════════════════════════════════════════════════
    const _finL  = _rd.financials || {}
    const _compL = _rd.competitors || null

    if (_finL.rent == null) (_finL as any).rent = {}
    ;(_finL as any).rent.submitted = _submittedRent
    ;(_finL as any).isLegacy = true
    ;(_finL as any).confidenceNote =
      'This report was generated before our compute engine upgrade. Re-run for validated financials.'

    // Sanitise "Insufficient data" / "-" strings to null so UI renders '--' not raw error text
    const INSUF = /^(insufficient data|n\/a|not available|not calculated|not modelled|tbd|-)$/i
    ;['monthlyRevenue', 'totalMonthlyCosts', 'monthlyNetProfit', 'grossMarginPct'].forEach(k => {
      const v = (_finL as any)[k]
      if (typeof v === 'string' && INSUF.test(v.trim())) (_finL as any)[k] = null
    })

    fin         = _finL
    competitors = _compL
    areaContext = _rd.areaContext  || null
    market      = _rd.market      || null
    demographics = _rd.demographics || null
  }

  // ── Legacy fields used in tabs (safe whether v1 or v2) ───────────────────────
  const _businessType = (report.business_type ?? '').toLowerCase()
  const competitorDataQuality   = competitors?.dataQuality   || null
  const demographicsDataQuality = demographics?.dataQuality  || null
  const confidence = confidenceLevel(report, C)

  const projections  = fin.projections  || {}
  const riskScenarios = fin.riskScenarios || {}

  // Break-even — always read from computed_result (engine is authoritative).
  // No inline math: the engine already stores both daily and monthly values.
  const _beDaily: number | null =
    C?.breakEvenDaily
    ?? fin.customerVolume?.daily_customers_needed_breakeven
    ?? report.breakeven_daily
    ?? null
  const _beMonthly: number | null =
    C?.breakEvenMonths
    ?? report.breakeven_monthly
    ?? null

  // ── Display Discipline Layer ──────────────────────────────────────────────
  // Confidence tier determines precision: exact numbers, ranges, or suppressed.
  const _confidenceTier: ConfidenceTier = getConfidenceTier(C)
  const _financialsSuppressed = shouldSuppressFinancials(C)
  const _financialGate = gateSection('Financial projections', C, { requiredFields: ['revenue'] })

  // ── Display Discipline Layer ──────────────────────────────────────────────
  // Confidence tier determines precision: exact numbers, ranges, or suppressed.
  const _confidenceTier: ConfidenceTier = getConfidenceTier(C)
  const _financialsSuppressed = shouldSuppressFinancials(C)
  const _financialGate = gateSection('Financial projections', C, { requiredFields: ['revenue'] })

  // ── Display variables — UI reads ONLY these, never raw fin fields directly ────
  // Raw values (for calculations/comparisons — NOT for rendering to user)
  const displayRevenue:      number | null = fin.monthlyRevenue    ?? null
  const displayNetProfit:    number | null = fin.monthlyNetProfit  ?? null
  const displayProfitMargin: string | null = fin.profitMargin ? `${fin.profitMargin}%` : null

  // Confidence-aware formatted values (for rendering to user)
  const _dRevenue   = displayMoney(displayRevenue, _confidenceTier)
  const _dNetProfit = displayMoney(displayNetProfit, _confidenceTier)
  const _dMargin    = displayPercent(fin.profitMargin ? parseFloat(fin.profitMargin) : null, _confidenceTier)
  const _dCustomers = displayCustomers(fin.baselineCustomers, _confidenceTier)

  // Profitability score — from computed_result.scores when available, else derived
  const computedScoreProfitability: number = C
    ? C.scores.profitability
    : (() => {
        if (displayNetProfit == null)  return report.score_profitability ?? 50
        if (displayNetProfit > 2000)   return 90
        if (displayNetProfit >= 1000)  return 75
        if (displayNetProfit > 0)      return 50
        return 15
      })()

  // Break-even gauge values
  const _beDailyForGauge:       number | null = _beDaily ?? report.breakeven_daily ?? null
  const _currentDailyCustomers: number | null = fin.baselineCustomers ?? null

  // Canonical payback period
  const _canonicalBEM: number | null = (() => {
    const bm = fin.breakEvenMonths ?? report.breakeven_months ?? null
    return bm && bm !== 999 && bm !== 0 ? Number(bm) : null
  })()

  const tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'suburb',      label: 'Suburb Intel' },
    { id: 'competition', label: 'Competition' },
    { id: 'location',    label: 'Location & Rent' },
    { id: 'market',      label: 'Market' },
    { id: 'financials',  label: 'Financials' },
    { id: 'map',         label: 'Map' },
  ]

  function parseSwot(key: string, allKeys: string[]) {
    const next = allKeys[allKeys.indexOf(key) + 1]
    const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
    const match = report?.swot_analysis?.match(new RegExp(pattern, 'is'))
    return match ? match[1].split(/[,.\n·]/).map(s => s.replace(/\*+/g, '').replace(/^\s*[-–]\s*/, '').trim()).filter(s => s.length > 5).slice(0, 3) : []
  }
  const swotKeys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
  const swotCfg = {
    STRENGTHS:     { bg: S.emeraldBg, border: S.emeraldBdr, text: '#065F46', dot: S.emerald },
    WEAKNESSES:    { bg: S.amberBg,   border: S.amberBdr,   text: '#92400E', dot: S.amber },
    OPPORTUNITIES: { bg: S.blueBg,    border: S.blueBdr,    text: '#1D4ED8', dot: S.blue },
    THREATS:       { bg: S.redBg,     border: S.redBdr,     text: '#991B1B', dot: S.red },
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FAILED STATE — show before main render so no fake NO GO appears
  // ═══════════════════════════════════════════════════════════════════════════
  if (report?.status === 'failed' && !report.verdict) {
    return (
      <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>
        <div style={{ textAlign: 'center', maxWidth: 460, width: '100%', padding: '48px 24px', animation: 'fadeIn 0.4s ease' }}>
          {/* Error icon */}
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.white, marginBottom: 10, letterSpacing: '-0.03em' }}>
            Analysis failed
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 8, lineHeight: 1.65 }}>
            The analysis engine could not complete this report.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 32, lineHeight: 1.5 }}>
            This is usually a temporary issue — try re-running the analysis.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/onboarding')}
              style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}
            >
              Run analysis again →
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}
            >
              My reports
            </button>
          </div>
          <p style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>
            Report ID: {report.report_id ?? report.id}
          </p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        button { font-family: inherit; cursor: pointer; }
        input[type="range"] { accent-color: ${S.brand}; cursor: pointer; }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* ── Nav bar ── */}
      <nav style={{ background: S.headerBg, borderBottom: `1px solid ${S.headerBorder}`, padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', padding: 0 }}>
            <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>&#8250;</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Location Report</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => router.push('/compare')} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font,
          }}>
            ⇄ Compare
          </button>

          {/* ── Save / Track button ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={isSaved ? () => setShowStatusMenu(v => !v) : toggleSave}
              disabled={saveLoading}
              title={isSaved ? 'Update tracking status' : 'Save this location'}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: isSaved ? S.brand : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isSaved ? S.brand : 'rgba(255,255,255,0.12)'}`,
                color: isSaved ? S.white : 'rgba(255,255,255,0.7)',
                borderRadius: 8, padding: '6px 14px',
                fontSize: 12, fontWeight: 700, cursor: saveLoading ? 'default' : 'pointer',
                fontFamily: S.font, opacity: saveLoading ? 0.6 : 1, transition: 'all 0.15s',
              }}>
              {isSaved ? '📍' : '🔖'}
              {isSaved
                ? ({ researching: 'Researching', shortlisted: 'Shortlisted', visited: 'Visited', opened: 'Opened', rejected: 'Rejected' }[locationStatus] ?? 'Saved')
                : 'Save location'
              }
              {isSaved && <span style={{ fontSize: 9, opacity: 0.7 }}>▼</span>}
            </button>
            {showStatusMenu && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 200,
                background: S.white, border: `1px solid ${S.n200}`,
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: 170, overflow: 'hidden',
              }}>
                {[
                  { value: 'shortlisted', label: '📋 Shortlisted',  desc: 'On my radar' },
                  { value: 'visited',     label: '🚶 Site visited',  desc: 'Inspected in person' },
                  { value: 'opened',      label: '✅ Opened here',   desc: 'Business launched' },
                  { value: 'rejected',    label: '❌ Not pursuing',  desc: 'Ruled out' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => updateStatus(opt.value)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px',
                      background: locationStatus === opt.value ? S.brandFaded : 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: S.font,
                      borderBottom: `1px solid ${S.n100}`,
                    }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: locationStatus === opt.value ? S.brand : S.n800 }}>{opt.label}</p>
                    <p style={{ fontSize: 10, color: S.n400, marginTop: 1 }}>{opt.desc}</p>
                  </button>
                ))}
                <button onClick={() => { toggleSave(); setShowStatusMenu(false) }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: S.font }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: S.red }}>✕ Unsave</p>
                </button>
              </div>
            )}
          </div>

          {!userPlan.isFree && <ExportPDFButton report={report} />}
          {userPlan.isFree && (
            <button
              onClick={() => router.push(`/upgrade?report=${report.report_id ?? report.id}`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: S.n400, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}
              title="Unlock to export PDF"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Export PDF
            </button>
          )}
          <ShareButton reportId={report.report_id ?? report.id} initialIsPublic={report.is_public ?? false} initialToken={report.public_token ?? null} />
        </div>
      </nav>

      {/* ── Outcomes feedback banner ─────────────────────────────────────────── */}
      {(() => {
        const reportAgeDays = report ? (Date.now() - new Date(report.created_at).getTime()) / 86400000 : 0
        const showFeedback  = reportAgeDays >= 60
          && !report?.outcome_feedback
          && !report?.feedback_dismissed_at
          && !feedbackDismissed
          && !feedbackSubmitted

        if (!showFeedback) return null

        return (
          <div style={{ background: S.amberBg, borderBottom: `1px solid ${S.amberBdr}`, padding: '10px 32px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
                  How did this location work out? 🏪
                </p>
                {feedbackProceeded === null ? (
                  <p style={{ fontSize: 11, color: '#B45309', marginTop: 2 }}>
                    You ran this report {Math.round(reportAgeDays)} days ago — your outcome helps us improve accuracy for everyone.
                  </p>
                ) : (
                  <p style={{ fontSize: 11, color: '#B45309', marginTop: 2 }}>
                    How accurate was the revenue projection? (1 = way off, 5 = spot on)
                  </p>
                )}
              </div>
              {feedbackProceeded === null ? (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => submitFeedback(true)} disabled={feedbackLoading} style={{ background: S.emerald, color: S.white, border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
                    ✅ Yes, I opened here
                  </button>
                  <button onClick={() => submitFeedback(false)} disabled={feedbackLoading} style={{ background: S.white, color: S.n700, border: `1px solid ${S.n200}`, borderRadius: 7, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>
                    Didn't proceed
                  </button>
                  <button onClick={dismissFeedback} style={{ background: 'none', border: 'none', color: S.n400, fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>×</button>
                </div>
              ) : !feedbackSubmitted ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setFeedbackAccuracy(n)}
                      style={{ width: 32, height: 32, borderRadius: 6, border: `1.5px solid ${feedbackAccuracy === n ? S.brand : S.n200}`, background: feedbackAccuracy === n ? S.brandFaded : S.white, color: feedbackAccuracy === n ? S.brand : S.n500, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: S.font }}>
                      {n}
                    </button>
                  ))}
                  <button onClick={() => submitFeedback(feedbackProceeded!)} disabled={feedbackAccuracy === null || feedbackLoading}
                    style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: feedbackAccuracy === null ? 'default' : 'pointer', opacity: feedbackAccuracy === null ? 0.5 : 1, fontFamily: S.font }}>
                    Submit
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: 13, fontWeight: 700, color: S.emerald }}>Thanks — your feedback helps calibrate our model. 🙏</p>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── Main content ── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* ═══ SECTION 1: RECOMMENDATION PANEL ═══ */}
        <div style={{ marginBottom: 24 }}>
          <RecommendationPanel report={report} confidence={confidence} />
          <ReferralPrompt reportScore={report.overall_score ?? 0} verdict={report.verdict ?? ''} />

          {/* ── Post-verdict upgrade nudge — shown immediately after verdict for free users ──
               This is the highest-conversion placement: user just saw GO/CAUTION/NO and
               wants to understand WHY and WHAT it means financially. ─────────────────── */}
          {userPlan.isFree && (() => {
            const nv = normalizeVerdict(report.verdict)
            const rid = report.report_id ?? report.id

            // ── NO verdict: numeric, unavoidable — reads from compute engine only ───────
            if (nv === 'NO') {
              const rentMonthly = report.monthly_rent ?? 0
              const revMonthly  = displayRevenue
              const rtr = (rentMonthly && revMonthly && revMonthly > 0)
                ? (rentMonthly / revMonthly) * 100 : null

              // Use compute engine values directly — no inline capacity calculation
              const _noBreakeven: number | null = C?.totalCosts ?? null
              const _noDeficit = (_noBreakeven != null && revMonthly != null && revMonthly < _noBreakeven)
                ? _noBreakeven - revMonthly : null

              // 3 lines — all from engine data, hedged where confidence is low
              const line1 = _noDeficit != null && _noBreakeven != null
                ? `Projected revenue of ${_dRevenue.display}/mo falls A$${_noDeficit.toLocaleString()} short of estimated costs (A$${_noBreakeven.toLocaleString()}/mo)`
                : rtr != null
                ? `Rent-to-revenue is ${Math.round(rtr)}% against a 12% safe threshold — at current demand assumptions, this rent is unlikely to be sustainable`
                : 'Based on current assumptions, rent appears above the sustainable 12%-of-revenue threshold'

              const line2 = (_beDaily != null && _currentDailyCustomers != null)
                ? `Model estimates ${_currentDailyCustomers} customers/day at this location — break-even requires ${_beDaily}/day`
                : _beDaily != null
                ? `Break-even is estimated at ${_beDaily} customers/day — unlock to compare against local demand estimates`
                : 'The revenue gap to break-even is in the full model — unlock to see the shortfall'

              const line3 = `Unlock what-if scenarios — how lower rent, higher ticket size, or different hours affect the outcome`

              return (
                <div style={{
                  marginTop: 12, borderRadius: 14,
                  background: S.n900,
                  border: '1.5px solid rgba(239,68,68,0.3)',
                  overflow: 'hidden',
                }}>
                  {/* Top band */}
                  <div style={{ padding: '20px 22px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' as const }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: '#F87171', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 10 }}>
                          {_noDeficit != null ? 'Based on current assumptions, projected revenue does not cover costs at this location.' : 'Based on current assumptions, this location is unlikely to be viable at this rent.'}
                        </p>
                        {[line1, line2, line3].map((line, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
                            <span style={{ fontSize: 12, color: S.brandLight, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>→</span>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{line}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, alignSelf: 'center' }}>
                        <a href={`/upgrade?report=${rid}`} style={{
                          display: 'inline-block', padding: '13px 24px', borderRadius: 9,
                          background: S.brand, color: '#fff', fontSize: 14, fontWeight: 800,
                          textDecoration: 'none', whiteSpace: 'nowrap' as const,
                          boxShadow: '0 4px 18px rgba(15,118,110,0.5)',
                        }}>
                          Unlock full breakdown — $29
                        </a>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' as const }}>
                          or <a href="/upgrade" style={{ color: S.brandLight, textDecoration: 'underline' }}>3-pack $59</a> · no expiry
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Levers row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {[
                      { label: 'Rent reduction needed',   detail: rtr != null ? `At ${Math.round(rtr)}% rent-to-revenue, rent must drop ${Math.max(0,Math.round(rtr-12))}pp to be viable` : 'Rent exceeds the 12% revenue threshold' },
                      { label: 'Revenue increase required', detail: _beDaily != null ? `${_beDaily} customers/day needed — see exact gap` : 'Revenue must rise to cover fixed costs — see full model' },
                      { label: 'Revenue gap',              detail: _noDeficit != null ? `Revenue falls A$${_noDeficit.toLocaleString()}/mo short of costs` : 'Unlock the full financial model to see the gap' },
                    ].map((lv, i) => (
                      <div key={lv.label} style={{
                        padding: '12px 16px',
                        borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        background: 'rgba(255,255,255,0.015)',
                      }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{lv.label}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>{lv.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            // ── GO / CAUTION: standard nudge ──────────────────────────────────────────
            const headline =
              nv === 'GO'
                ? 'This location looks viable — see the full financial breakdown before you call the agent.'
                : 'There are real risks here — see the exact cost and revenue numbers before you commit.'
            const sub =
              nv === 'GO'
                ? 'Full cost breakdown, 3-year projections, SWOT analysis and a PDF you can share with your accountant.'
                : 'Understand the exact revenue gap, staffing cost assumptions, and scenarios that shift this verdict.'
            const borderColor = nv === 'GO' ? S.emeraldBdr : S.amberBdr
            const accentColor = nv === 'GO' ? S.emerald    : S.amber
            const bgColor     = nv === 'GO' ? S.emeraldBg  : S.amberBg
            return (
              <div style={{
                marginTop: 12, padding: '16px 20px', borderRadius: 12,
                background: bgColor, border: `1.5px solid ${borderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' as const,
              }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: S.n900, marginBottom: 4, lineHeight: 1.4 }}>
                    🔒 {headline}
                  </p>
                  <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.6 }}>{sub}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <a href={`/upgrade?report=${rid}`} style={{
                    display: 'inline-block', padding: '11px 22px', borderRadius: 9,
                    background: S.brand, color: '#fff', fontSize: 13, fontWeight: 800,
                    textDecoration: 'none', whiteSpace: 'nowrap' as const,
                    boxShadow: '0 3px 12px rgba(15,118,110,0.3)',
                  }}>
                    Unlock full report — $29
                  </a>
                  <p style={{ fontSize: 11, color: accentColor, fontWeight: 600, textAlign: 'center' as const }}>
                    Or <a href="/upgrade" style={{ color: accentColor, textDecoration: 'underline' }}>3-pack $59</a> · credits never expire
                  </p>
                </div>
              </div>
            )
          })()}
        </div>

        {/* ═══ SECTION 2: KEY METRICS (ranges) ═══ */}
        {/* When revenueRange is available (trust layer), show it as the primary revenue display */}
        {C?.revenueRange && C.revenueRange.uncertainty > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
            <RevenueRangeTile revenueRange={C.revenueRange} />
            <Tile
              label="Net Profit / Mo"
              value={_dNetProfit.display}
              sub={_dNetProfit.qualifier ?? (displayProfitMargin ?? '')}
              color={(displayNetProfit ?? 0) >= 0 ? S.emerald : S.red}
              mono
            />
            <Tile
              label="Break-even Daily"
              value={(_beDaily ?? (fin as any).breakEvenDailyEst) ? `${_beDaily ?? (fin as any).breakEvenDailyEst} cust.` : '--'}
              sub="customers/day needed"
              color={S.n900}
              mono
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              {
                l: 'Monthly Revenue',
                v: _dRevenue.display,
                sub: (fin as any).isEstimated ? 'industry benchmark' : 'market demand model',
                color: S.n900,
              },
              {
                l: 'Net Profit / Mo',
                v: _dNetProfit.display,
                sub: _dNetProfit.qualifier ?? (displayProfitMargin ?? ''),
                color: (displayNetProfit ?? 0) >= 0 ? S.emerald : S.red,
              },
              {
                l: 'Break-even Daily',
                v: (_beDaily ?? (fin as any).breakEvenDailyEst)
                  ? `${_beDaily ?? (fin as any).breakEvenDailyEst} cust.`
                  : 'Data unavailable',
                sub: 'customers/day needed',
                color: S.n900,
              },
              {
                l: 'Payback Period',
                v: _canonicalBEM ? `${_canonicalBEM} mo` : 'N/A',
                sub: 'from setup cost',
                color: S.n900,
              },
            ].map(m => (
              <Tile key={m.l} label={m.l} value={m.v} sub={m.sub} color={m.color} mono />
            ))}
          </div>
        )}

        {/* ═══ DATA QUALITY HEADER — transparency strip ═══ */}
        <DataQualityHeader computed={C} report={report} />

        {/* ═══ SECTION 3: TABS ═══ */}
        <div style={{ display: 'flex', gap: 2, background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: 4, marginBottom: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: 8, border: 'none',
                background: activeTab === t.id ? S.headerBg : 'transparent',
                color: activeTab === t.id ? S.white : S.n500,
                fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* ═══ ADJUST ASSUMPTIONS ═══ */}
        <div id="adjust-panel" style={{ marginBottom: 20 }}>
          <button onClick={() => setSliderOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: isChanged ? S.brand : S.white,
              color: isChanged ? S.white : S.n700,
              border: `1.5px solid ${isChanged ? S.brand : S.n200}`,
              borderRadius: 12, padding: '10px 18px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: S.font, boxShadow: isChanged ? '0 2px 10px rgba(15,118,110,0.25)' : 'none',
              transition: 'all 0.2s',
            }}>
            {isChanged ? `Adjusted: ${adjCalc.verdict} (${adjCalc.overall}/100)` : 'Adjust assumptions'}
            {isChanged && (
              <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginLeft: 4 }}>
                {adjCalc.overall > (report.overall_score ?? 0) ? `+${adjCalc.overall - (report.overall_score ?? 0)}` : `${adjCalc.overall - (report.overall_score ?? 0)}`}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 12 }}>{sliderOpen ? '▲' : '▼'}</span>
          </button>

          {sliderOpen && (
            <div style={{ marginTop: 12, background: S.white, border: `1.5px solid ${S.brandBorder}`, borderRadius: 16, padding: '24px 28px', boxShadow: '0 4px 20px rgba(15,118,110,0.08)', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>What-if calculator</p>
                  <p style={{ fontSize: 13, color: S.n500, marginTop: 3 }}>Drag to see how changes affect your verdict in real time</p>
                </div>
                {isChanged && (
                  <button onClick={() => { setAdjRent(null); setAdjTicket(null); setAdjCustomers(null) }}
                    style={{ background: S.n100, border: 'none', color: S.n500, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>Reset</button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {[
                  { label: 'Monthly Rent', value: adjRent ?? baseRent, base: baseRent, set: setAdjRent, prefix: '$', min: Math.max(500, Math.round(baseRent * 0.4)), max: Math.max(Math.round(baseRent * 2.5), baseRent + 5000), step: 100, invert: true },
                  { label: 'Avg Ticket Size', value: adjTicket ?? baseTicket, base: baseTicket, set: setAdjTicket, prefix: '$', min: Math.max(1, Math.round(baseTicket * 0.4)), max: Math.max(Math.round(baseTicket * 2.5), baseTicket + 50), step: 1, invert: false },
                  { label: 'Daily Customers', value: adjCustomers ?? baseCustomers, base: baseCustomers, set: setAdjCustomers, prefix: '', min: Math.max(5, Math.round(baseCustomers * 0.3)), max: Math.max(Math.round(baseCustomers * 3), baseCustomers + 100), step: 5, invert: false },
                ].map(s => {
                  const delta = s.value - s.base
                  const pctDelta = s.base > 0 ? Math.abs(Math.round((delta / s.base) * 100)) : 0
                  const better = s.invert ? delta < 0 : delta > 0
                  return (
                    <div key={s.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: S.n700 }}>{s.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>{s.prefix}{s.value.toLocaleString()}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                        onChange={e => s.set(Number(e.target.value))} style={{ width: '100%' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: S.n400 }}>{s.prefix}{s.min.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: S.n400 }}>{s.prefix}{s.max.toLocaleString()}</span>
                      </div>
                      {delta !== 0 && (
                        <p style={{ fontSize: 12, color: better ? S.emerald : S.red, marginTop: 4, fontWeight: 600 }}>
                          {better ? 'Up' : 'Down'} {pctDelta}% vs original
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              {isChanged && (
                <div style={{ marginTop: 24, padding: '16px 20px', background: adjVc.bg, border: `1.5px solid ${adjVc.border}`, borderRadius: 12, display: 'grid', gridTemplateColumns: 'auto repeat(4,1fr)', gap: 16, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: adjVc.text, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {_verdictFlipped ? 'New Verdict' : 'Scenario Score'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: adjVc.text }}>{adjCalc.overall}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: adjVc.text }}>{adjVc.label}</span>
                    </div>
                    <p style={{ fontSize: 11, color: adjVc.text, opacity: 0.7, marginTop: 2 }}>
                      {_verdictFlipped
                        ? `was ${_origScore} ${vc.label}`
                        : `${_adjScoreDelta > 0 ? '+' : ''}${_adjScoreDelta} pts — same verdict`}
                    </p>
                    {!_verdictFlipped && Math.abs(_adjScoreDelta) > 0 && (
                      <p style={{ fontSize: 10, color: adjVc.text, opacity: 0.6, marginTop: 3 }}>
                        needs {_adjScoreDelta > 0 ? 8 - _adjScoreDelta : 8 + _adjScoreDelta}+ more pts to flip
                      </p>
                    )}
                  </div>
                  {[
                    { label: 'Monthly Revenue', orig: fin.monthlyRevenue, adj: adjCalc.monthlyRevenue, format: (v: number) => '$' + (v/1000).toFixed(1) + 'k' },
                    { label: 'Net Profit/Mo', orig: fin.monthlyNetProfit, adj: adjCalc.monthlyNetProfit, format: (v: number) => '$' + (v/1000).toFixed(1) + 'k' },
                    { label: 'Rent %', orig: fin.rent?.toRevenuePercent, adj: adjCalc.rentPct, format: (v: number) => v.toFixed(1) + '%' },
                    { label: 'Break-even/Day', orig: report.breakeven_daily, adj: adjCalc.breakEvenDaily, format: (v: number) => v + ' cust.' },
                  ].map(m => {
                    const delta = (m.adj ?? 0) - (m.orig ?? 0)
                    const better = m.label === 'Rent %' || m.label === 'Break-even/Day' ? delta < 0 : delta > 0
                    return (
                      <div key={m.label} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 11, color: adjVc.text, opacity: 0.65, marginBottom: 4 }}>{m.label}</p>
                        <p style={{ fontSize: 15, fontWeight: 900, color: adjVc.text, fontFamily: S.mono }}>{m.adj != null ? m.format(m.adj) : '--'}</p>
                        {delta !== 0 && m.orig != null && (
                          <p style={{ fontSize: 11, color: better ? S.emerald : S.red, fontWeight: 700, marginTop: 2 }}>{m.format(Math.abs(delta))}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {(_confidenceTier === 'benchmark_default' || _confidenceTier === 'low') && (
                <div style={{ marginTop: 12, padding: '8px 14px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
                    <strong>Directional only —</strong> base figures come from industry benchmarks, not local sales data. Results show the direction of change, not precise outcomes. Small slider moves can cross score thresholds — treat verdict changes as indicators, not conclusions.
                  </p>
                </div>
              )}
              <p style={{ fontSize: 12, color: S.n400, marginTop: 10, textAlign: 'center' }}>
                Recalculation runs in your browser — no data is sent. Base values:{' '}
                {_cr?.avgTicketSize ? 'from compute engine' : _fin?.avgTicketSize ? 'from financial model' : 'industry benchmark defaults'}
                {' '}· {_btBenchmark.grossMarginPct}% gross margin · 30 trading days/month
              </p>
            </div>
          )}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Executive Narrative — investor-style "why this result happened" prose */}
            <ExecutiveNarrative computed={C} report={report} />

            {/* Big P&L hero + top risks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Monthly financials hero */}
              <Card style={{ padding: '24px 28px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  Net Profit / Month
                  {_dNetProfit.qualifier && <span style={{ marginLeft: 8, fontSize: 10, color: S.amber, fontWeight: 600 }}>({_dNetProfit.qualifier})</span>}
                </p>
                {_financialsSuppressed.suppress ? (
                  <div style={{ padding: '16px 0' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: S.n500 }}>{_financialsSuppressed.reason}</p>
                  </div>
                ) : _confidenceTier === 'benchmark_default' ? (
                  // ── Benchmark: amber treatment — visually different from verified data ──
                  // The number is real (industry average) but it is NOT a forecast for this business.
                  // Amber signals "caution / estimate". Smaller font + "~" prefix (via fmtK) signals approximation.
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <p style={{ fontSize: 34, fontWeight: 700, fontStyle: 'italic', color: S.amber, fontFamily: S.mono, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {_dNetProfit.display}
                      </p>
                      <span style={{ fontSize: 11, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 2 }}>est.</span>
                    </div>
                    <p style={{ fontSize: 12, color: S.amber, marginTop: 6, lineHeight: 1.4 }}>
                      Industry average for {(report.business_type ?? 'this type').toLowerCase()} businesses — <strong>not verified against this location.</strong> Re-run with local revenue data to get an accurate figure.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: _dNetProfit.isRange ? 32 : 48, fontWeight: 900, color: (displayNetProfit ?? 0) >= 0 ? S.emerald : S.red, fontFamily: S.mono, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {_dNetProfit.display}
                    </p>
                    <p style={{ fontSize: 13, color: S.n400, marginTop: 8 }}>
                      {_confidenceTier === 'low'
                        ? 'Limited live data — treat range as directional, verify locally'
                        : 'Based on market demand analysis for this location'}
                    </p>
                    {_confidenceTier === 'low' && (
                      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 20 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.amber }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: S.amber }}>LOW DATA — range may shift ±20%</span>
                      </div>
                    )}
                  </>
                )}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${S.n100}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Monthly Revenue</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: S.n800, fontFamily: S.mono }}>{_dRevenue.display}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Break-even</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: S.n800, fontFamily: S.mono }}>
                      {(() => { const bm = _canonicalBEM; return bm && bm !== 999 ? `${bm} mo` : 'N/A' })()}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Gross Margin</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: S.emerald, fontFamily: S.mono }}>{_dMargin.display}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>ROI at 36mo</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: fin.roiTimeline?.roi36?.startsWith('+') ? S.emerald : S.red, fontFamily: S.mono }}>{fin.roiTimeline?.roi36 ?? '--'}</p>
                  </div>
                </div>
              </Card>

              {/* Top risks from A3 */}
              <Card style={{ padding: '24px 28px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Top Risks</p>
                {market?.topRisks?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {market.topRisks.slice(0, 4).map((risk: any, i: number) => {
                      const label = typeof risk === 'string' ? risk : (risk.risk ?? risk.title ?? risk.description ?? String(risk))
                      const severity = typeof risk === 'object' ? (risk.severity ?? risk.level ?? '') : ''
                      const isHigh = String(severity).toLowerCase().includes('high')
                      return (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: isHigh ? S.redBg : S.amberBg, borderRadius: 9, border: `1px solid ${isHigh ? S.redBdr : S.amberBdr}` }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: isHigh ? S.red : S.amber, marginTop: 5, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, color: isHigh ? '#991B1B' : '#92400E', lineHeight: 1.5, fontWeight: 500 }}>{label}</p>
                            {severity && <p style={{ fontSize: 10, color: isHigh ? S.red : S.amber, fontWeight: 700, marginTop: 2, textTransform: 'uppercase' }}>{severity}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: S.n400 }}>Run the market analysis to see top risks.</p>
                )}
              </Card>
            </div>

            {/* DECISION ENGINE — the premium "Should You Open Here?" section */}
            <DecisionEngine report={report} computed={C} fin={fin} competitors={competitors} market={market} demographics={demographics} />

            {/* Key insights — the "worth paying for" section */}
            <KeyInsights report={report} computed={C} fin={fin} competitors={competitors} market={market} />

            {/* Value Perception — hidden risks, success patterns, common mistakes */}
            <ValuePerception computed={C} businessType={report.business_type ?? ''} locationName={report.location_name ?? ''} />

            <ConfidencePanel confidence={confidence} />
            <ContradictionBanner computed={C} />
            <RentRatioPanel rent={report.monthly_rent ?? areaContext?.medianRent?.monthly} revenue={displayRevenue} />

            {/* CTA to Map tab */}
            {reportLat && reportLng && (
              <Card style={{ padding: '18px 24px' }}>
                <button onClick={() => setActiveTab('map')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: S.font, padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Interactive Competition Map</p>
                      <p style={{ fontSize: 12, color: S.n500 }}>View competitors, heatmap, and density analysis</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </Card>
            )}

            {/* Score breakdown + radar */}
            <Card>
              <SectionHeading badge="engine" sub="Each component is weighted to produce your overall score.">Score Breakdown</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 32, alignItems: 'center' }}>
                <div>
                  <ScoreBar label="Rent Affordability" score={report.score_rent} weight="30%" />
                  <ScoreBar label="Profitability" score={computedScoreProfitability} weight="25%" />
                  <ScoreBar label="Competition" score={report.score_competition} weight="25%" />
                  <ScoreBar label="Area Demographics" score={report.score_demand} weight="20%" />
                </div>
                <RadarChart color={vc.text} scores={[
                  { label: 'Rent', value: report.score_rent ?? 0 },
                  { label: 'Profitability', value: computedScoreProfitability },
                  { label: 'Competition', value: report.score_competition ?? 0 },
                  { label: 'Demand', value: report.score_demand ?? 0 },
                  { label: 'Cost', value: report.score_cost ?? 0 },
                ]} />
              </div>
              {scoring.riskFlags?.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {scoring.riskFlags.map((flag: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '10px 14px', background: S.amberBg, borderRadius: 8, border: `1px solid ${S.amberBdr}` }}>
                      <span style={{ fontSize: 13, color: S.amber }}>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* ── Locked SWOT + scenario teaser — shown only on free reports ──────
                 Revenue/profit/break-even are already shown above the tabs, so we
                 DON'T blur those. Instead we show the shape of SWOT and 3-year
                 scenarios — both genuinely locked — to drive curiosity → upgrade. */}
            {userPlan.isFree && (
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${S.n200}`, background: S.white }}>
                {/* Blurred SWOT + scenario preview — real structure, no fake numbers */}
                <div style={{ filter: 'blur(7px)', userSelect: 'none', pointerEvents: 'none', padding: '24px 28px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>SWOT Analysis</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                    {[
                      { label: 'Strengths', bg: S.emeraldBg, clr: S.emerald },
                      { label: 'Weaknesses', bg: S.redBg, clr: '#991B1B' },
                      { label: 'Opportunities', bg: S.brandFaded, clr: S.brand },
                      { label: 'Threats', bg: S.amberBg, clr: '#92400E' },
                    ].map(q => (
                      <div key={q.label} style={{ background: q.bg, borderRadius: 10, padding: '12px 14px' }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: q.clr, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{q.label}</p>
                        {[1,2,3].map(i => <div key={i} style={{ height: 9, background: q.clr, opacity: 0.15, borderRadius: 4, marginBottom: 6 }} />)}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>3-Year Scenarios</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {['Worst case', 'Base case', 'Best case'].map(s => (
                      <div key={s} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 9, padding: '10px 12px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: S.n500, marginBottom: 6 }}>{s}</p>
                        <div style={{ height: 22, background: S.n200, borderRadius: 4, marginBottom: 4 }} />
                        <div style={{ height: 14, background: S.n200, borderRadius: 4, width: '70%' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lock overlay */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(2px)',
                }}>
                  <div style={{ textAlign: 'center', padding: '24px 28px', maxWidth: 360 }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>🔒</div>
                    <p style={{ fontSize: 15, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', marginBottom: 5 }}>
                      SWOT analysis + 3-year scenarios locked
                    </p>
                    <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65, marginBottom: 16 }}>
                      Unlock to see full strengths, weaknesses, opportunities and threats — plus worst, base and best-case projections over 36 months.
                    </p>
                    <a href={`/upgrade?report=${report.report_id ?? report.id}`} style={{
                      display: 'inline-block', padding: '11px 26px', borderRadius: 9,
                      background: S.brand, color: '#fff', fontSize: 13, fontWeight: 800,
                      textDecoration: 'none', boxShadow: '0 3px 14px rgba(15,118,110,0.3)',
                    }}>
                      Unlock full report — $29
                    </a>
                    <p style={{ fontSize: 11, color: S.n400, marginTop: 8 }}>
                      <a href="/upgrade" style={{ color: S.brand, fontWeight: 600, textDecoration: 'none' }}>3-pack ($59)</a>
                      {' '}·{' '}
                      <a href="/upgrade" style={{ color: S.brand, fontWeight: 600, textDecoration: 'none' }}>10-pack ($149)</a>
                      {' '}· credits never expire
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SWOT — locked for free users */}
            {report.swot_analysis && (
              <PaywallGate locked={userPlan.isFree} label="SWOT Analysis" reportId={report.report_id ?? report.id}>
              <Card>
                <SectionHeading badge="ai" sub="Qualitative analysis from AI agent — verify suburb-specific claims independently.">SWOT Analysis</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {swotKeys.map(key => {
                    const items = parseSwot(key, swotKeys)
                    const cfg = swotCfg[key as keyof typeof swotCfg]
                    if (!items.length) return null
                    return (
                      <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
                          <p style={{ fontSize: 11, fontWeight: 800, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {items.map((item, i) => (
                            <p key={i} style={{ fontSize: 12, color: cfg.text, opacity: 0.85, lineHeight: 1.6 }}>-- {item}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
              </PaywallGate>
            )}

            {/* ── Comparison CTA — drives 3-pack purchases ──────────────────────────
                 Shown to all users (not just free) since even paid single-report users
                 benefit from buying a pack to compare. Free users see the stronger copy. */}
            <div style={{
              background: S.n900, borderRadius: 16, padding: '24px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' as const,
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Before you decide
                </p>
                <p style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 5, lineHeight: 1.3 }}>
                  Are you comparing locations?
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  Most founders shortlist 2–3 sites before committing. A 3-pack ($59) gives you a full report on each — $19.67 per location — and lets you compare them side by side before signing anything.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                <a href="/upgrade" style={{
                  display: 'inline-block', padding: '12px 22px', borderRadius: 9, whiteSpace: 'nowrap' as const,
                  background: S.white, color: S.brand, fontSize: 13, fontWeight: 800,
                  textDecoration: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}>
                  Get 3-pack — $59
                </a>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                  $19.67/report · save 32% · no expiry
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SUBURB INTELLIGENCE TAB ═══ */}
        {activeTab === 'suburb' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Suburb overview */}
            <Card style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em' }}>
                    {report.location_name ?? 'Location Profile'}
                  </h2>
                  <p style={{ fontSize: 13, color: S.n400 }}>{report.business_type} viability assessment</p>
                </div>
              </div>
              {/* AI-synthesised suburb summary */}
              {(() => {
                const _bt = (report.business_type ?? 'business').toLowerCase()
                const income = demographics?.medianIncome
                const pop = demographics?.populationDensity
                const transit = C?.locationSignals?.transitSignal ?? areaContext?.transitSignal
                const footfall = C?.locationSignals?.footfallSignal ?? areaContext?.footfallSignal
                const compCount = C?.validCompetitorCount ?? (competitors as any)?.validCount ?? 0
                const anchors = C?.locationSignals?.nearbyAnchors ?? areaContext?.majorAnchors ?? []
                const area = report.location_name?.split(',')[0]?.trim() ?? 'This area'

                // Build a contextual summary from available data
                const parts: string[] = []
                if (income && income > 100000) parts.push(`a high-income area (median $${Math.round(income/1000)}k) with strong spending power`)
                else if (income && income > 70000) parts.push(`a moderate-income area (median $${Math.round(income/1000)}k)`)
                else if (income) parts.push(`a lower-income area (median $${Math.round(income/1000)}k) where price sensitivity is likely`)
                if (pop && pop > 5000) parts.push('dense urban environment with high pedestrian activity')
                else if (pop && pop > 2000) parts.push('suburban density with moderate foot traffic')
                if (transit === 'Excellent' || transit === 'Good' || transit === 'High') parts.push('well-served by public transit')
                if (footfall === 'Very High' || footfall === 'High') parts.push('high foot traffic zone')
                if (anchors.length > 0) parts.push(`anchored by ${anchors.slice(0,3).join(', ')}`)
                if (compCount > 10) parts.push(`a competitive ${_bt} market (${compCount} operators)`)
                else if (compCount > 0) parts.push(`${compCount} existing ${_bt}${compCount > 1 ? 's' : ''} in the area`)
                else parts.push(`no direct ${_bt} competitors detected nearby`)

                const summary = parts.length > 0
                  ? `${area} is ${parts.slice(0, 4).join(', ')}. ${compCount > 8
                    ? `For a new ${_bt}, differentiation will be critical — this is not a market you can enter with a generic offering.`
                    : compCount > 3
                    ? `The market has room for a well-positioned new ${_bt}, but you will need to compete on either quality, convenience, or price.`
                    : `The low competition suggests either an underserved opportunity or a location that existing operators have avoided — verify on the ground.`}`
                  : `Limited data available for this suburb. Visit the area and use the Map tab for live competitor data.`

                return <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.8 }}>{summary}</p>
              })()}
            </Card>

            {/* Demographics grid */}
            {demographics && (
              <Card>
                <SectionHeading sub="ABS Census data for the surrounding statistical area.">Demographics</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  <Tile
                    label="Median Income"
                    value={demographics.medianIncome ? `$${Math.round(demographics.medianIncome/1000)}k/yr` : 'N/A'}
                    color={demographics.medianIncome >= 100000 ? S.emerald : demographics.medianIncome >= 70000 ? S.amber : S.red}
                    sub={demographics.medianIncome >= 100000 ? 'High spending power' : demographics.medianIncome >= 70000 ? 'Moderate spending power' : 'Price-sensitive market'}
                    mono
                  />
                  <Tile
                    label="Population Density"
                    value={demographics.populationDensity ? `${demographics.populationDensity.toLocaleString()}/km²` : 'N/A'}
                    sub={demographics.populationDensity > 5000 ? 'Dense urban' : demographics.populationDensity > 2000 ? 'Suburban' : 'Low density'}
                    color={S.n900}
                    mono
                  />
                  <Tile
                    label="Affordability"
                    value={demographics.affordabilityLabel ?? 'N/A'}
                    color={demographics.affordabilityLabel === 'High' ? S.emerald : demographics.affordabilityLabel === 'Low' ? S.red : S.amber}
                    mono
                  />
                  <Tile
                    label="Data Quality"
                    value={demographics.dataQuality === 'suburb_level' ? 'Suburb' : 'State Avg'}
                    sub={demographics.dataQuality === 'suburb_level' ? 'SA2-level Census data' : 'State-level averages used'}
                    color={demographics.dataQuality === 'suburb_level' ? S.emerald : S.amber}
                  />
                </div>
                {demographics.ageDistribution && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${S.n100}` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Age Distribution</p>
                    <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.7 }}>
                      {typeof demographics.ageDistribution === 'string' ? demographics.ageDistribution : JSON.stringify(demographics.ageDistribution)}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Location & lifestyle signals */}
            <Card>
              <SectionHeading sub="Location activity, transit access, and anchor tenant signals for this address.">Lifestyle & Access Signals</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                {(() => {
                  const signals = [
                    {
                      label: 'Location Activity',
                      value: C?.locationSignals?.footfallSignal ?? areaContext?.footfallSignal,
                      meaning: (v: string | null) => {
                        if (!v) return 'No location activity data available'
                        const _v = v.toLowerCase()
                        if (_v.includes('high') || _v.includes('very')) return 'Strong walk-in potential — customers discover businesses organically'
                        if (_v.includes('moderate') || _v.includes('medium')) return 'Moderate location activity — signage and marketing will be important'
                        return 'Low location activity — marketing-driven acquisition will be essential'
                      },
                    },
                    {
                      label: 'Transit Access',
                      value: C?.locationSignals?.transitSignal ?? areaContext?.transitSignal,
                      meaning: (v: string | null) => {
                        if (!v) return 'No transit data available'
                        const _v = v.toLowerCase()
                        if (_v.includes('excellent') || _v.includes('good') || _v.includes('high')) return 'Well-connected by public transport — expands catchment area beyond walking distance'
                        return 'Limited transit access — most customers will drive or live nearby'
                      },
                    },
                    {
                      label: 'Road Type',
                      value: C?.locationSignals?.roadType ?? areaContext?.roadType,
                      meaning: (v: string | null) => {
                        if (!v) return 'No road type data'
                        if (v.toLowerCase().includes('main')) return 'Main road frontage — high visibility but potentially high rent'
                        return 'Side street location — lower visibility but potentially lower rent'
                      },
                    },
                    {
                      label: 'Anchor Tenants',
                      value: (() => {
                        const anch = C?.locationSignals?.nearbyAnchors ?? areaContext?.majorAnchors ?? []
                        return anch.length > 0 ? anch.slice(0,3).join(', ') : null
                      })(),
                      meaning: (v: string | null) => {
                        if (!v) return 'No major anchor tenants detected nearby'
                        return `Anchor tenants generate consistent foot traffic — beneficial for walk-in businesses`
                      },
                    },
                  ]

                  return signals.map((sig) => {
                    const val = sig.value
                    const hasData = val != null && val.length > 0
                    return (
                      <div key={sig.label} style={{
                        padding: '16px 18px', borderRadius: 12,
                        background: hasData ? S.n50 : S.amberBg,
                        border: `1px solid ${hasData ? S.n200 : S.amberBdr}`,
                      }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{sig.label}</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: hasData ? S.n900 : S.amber, marginBottom: 8 }}>
                          {val ?? 'No data'}
                        </p>
                        <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.6 }}>{sig.meaning(val)}</p>
                      </div>
                    )
                  })
                })()}
              </div>
            </Card>

            {/* Rent context */}
            {(areaContext?.medianRent || report.monthly_rent) && (
              <Card>
                <SectionHeading sub="How your rent compares to the area median.">Rent Context</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                  <Tile label="Your Rent" value={report.monthly_rent ? `A$${report.monthly_rent.toLocaleString()}` : 'N/A'} sub="per month (submitted)" mono color={S.n900} />
                  <Tile label="Area Median" value={areaContext?.medianRent?.monthly ? `A$${areaContext.medianRent.monthly.toLocaleString()}` : 'N/A'} sub="comparable listings" mono color={S.brand} />
                  <Tile label="vs. Median" value={(() => {
                    if (!report.monthly_rent || !areaContext?.medianRent?.monthly) return 'N/A'
                    const diff = ((report.monthly_rent - areaContext.medianRent.monthly) / areaContext.medianRent.monthly * 100).toFixed(0)
                    return Number(diff) > 0 ? `+${diff}%` : `${diff}%`
                  })()} sub={(() => {
                    if (!report.monthly_rent || !areaContext?.medianRent?.monthly) return ''
                    const diff = (report.monthly_rent - areaContext.medianRent.monthly) / areaContext.medianRent.monthly
                    return diff > 0.15 ? 'Above area average — negotiate' : diff < -0.1 ? 'Below average — good value' : 'In line with area'
                  })()} mono color={(() => {
                    if (!report.monthly_rent || !areaContext?.medianRent?.monthly) return S.n400
                    const diff = (report.monthly_rent - areaContext.medianRent.monthly) / areaContext.medianRent.monthly
                    return diff > 0.15 ? S.red : diff < -0.1 ? S.emerald : S.amber
                  })()} />
                </div>
                <RentRatioPanel rent={report.monthly_rent ?? areaContext?.medianRent?.monthly} revenue={displayRevenue} />
              </Card>
            )}

            {/* "What this means" synthesis */}
            <Card style={{ background: S.brandFaded, border: `1.5px solid ${S.brandBorder}` }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: S.brand, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What this means for your {(report.business_type ?? 'business').toLowerCase()}</p>
                  <p style={{ fontSize: 14, color: S.n800, lineHeight: 1.8 }}>
                    {(() => {
                      const _bt = (report.business_type ?? 'business').toLowerCase()
                      const income = demographics?.medianIncome
                      const compCount = C?.validCompetitorCount ?? (competitors as any)?.validCount ?? 0
                      const demand = C?.marketSignals?.demandTrend
                      const rentPct = fin?.rent?.toRevenuePercent
                      const parts: string[] = []

                      if (income && income >= 100000) parts.push(`The high median income ($${Math.round(income/1000)}k) supports premium pricing — customers here can afford quality and will pay for it`)
                      else if (income && income >= 70000) parts.push(`Moderate local income ($${Math.round(income/1000)}k) supports mid-range pricing — value perception matters`)
                      else if (income) parts.push(`Lower local income ($${Math.round(income/1000)}k) means price sensitivity is high — budget-friendly positioning or strong value proposition required`)

                      if (compCount > 10) parts.push(`With ${compCount} existing ${_bt}s, this is a saturated market. New entrants need a clear point of difference — a unique product, underserved time slot, or niche customer segment`)
                      else if (compCount >= 3) parts.push(`${compCount} existing ${_bt}s suggests proven demand with room for a well-differentiated newcomer`)
                      else if (compCount > 0) parts.push(`Only ${compCount} ${_bt}${compCount > 1 ? 's' : ''} nearby — the low competition could indicate untapped demand or a challenging trading environment`)

                      if (demand === 'growing') parts.push('Market demand is rising, which favours new entrants')
                      else if (demand === 'declining') parts.push('Demand is declining — timing the entry carefully and keeping setup costs low is critical')

                      if (rentPct && rentPct > 20) parts.push(`At ${rentPct.toFixed(0)}% of projected revenue, rent is the biggest risk factor — negotiate hard or consider nearby side streets`)

                      return parts.length > 0
                        ? parts.join('. ') + '.'
                        : `Visit the area during peak and off-peak hours to assess foot traffic, customer demographics, and competitive landscape firsthand. No data model can replace on-the-ground observation.`
                    })()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Business Implications — demographics translated to actionable strategy */}
            {demographics && (() => {
              const _bt = (report.business_type ?? 'business').toLowerCase()
              const income = demographics.medianIncome
              const pop = demographics.populationDensity
              const implications: Array<{ signal: string; implication: string; positive: boolean }> = []

              if (income && income >= 100000) {
                implications.push({ signal: `High median income ($${Math.round(income/1000)}k)`, implication: `Supports premium pricing. Customers expect quality fit-out, curated offerings, and excellent service. They will pay more but expect more.`, positive: true })
              } else if (income && income < 55000) {
                implications.push({ signal: `Lower median income ($${Math.round(income/1000)}k)`, implication: `Price sensitivity is high. Focus on value deals, combo pricing, and high-volume/low-margin model. Avoid premium positioning.`, positive: false })
              }

              if (pop && pop > 5000) {
                implications.push({ signal: `High population density (${pop?.toLocaleString()}/km\u00B2)`, implication: `Dense residential area means reliable weekday + weekend traffic. Walk-in customers will be a primary revenue driver. Invest in street-level visibility and signage.`, positive: true })
              } else if (pop && pop < 1500) {
                implications.push({ signal: `Low population density`, implication: `Fewer people living nearby means you need to draw customers from a wider catchment. Delivery, online ordering, and destination appeal become critical.`, positive: false })
              }

              const youngPop = demographics.ageDistribution && typeof demographics.ageDistribution === 'string' && demographics.ageDistribution.toLowerCase().includes('young')
              if (youngPop) {
                implications.push({ signal: 'Young demographic skew', implication: `Younger population favours social media presence, Instagram-worthy interiors, and online ordering. Invest in digital marketing over traditional channels.`, positive: true })
              }

              const renters = demographics.housingType === 'majority_renters' || (demographics.renterPercent && demographics.renterPercent > 55)
              if (renters) {
                implications.push({ signal: 'High renter population', implication: `Renters tend to be more transient — customer loyalty may be harder to build. Focus on quick wins: impulse purchases, convenient location, and fast service over long-term relationship building.`, positive: false })
              }

              if (implications.length === 0) return null

              return (
                <Card>
                  <SectionHeading sub="How the demographics translate into business strategy.">Business Implications</SectionHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {implications.map((imp, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, padding: '14px 0', borderBottom: i < implications.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: imp.positive ? S.emerald : S.red }} />
                            <p style={{ fontSize: 12, fontWeight: 700, color: imp.positive ? S.emerald : S.red }}>{imp.positive ? 'Positive' : 'Challenge'}</p>
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: S.n800 }}>{imp.signal}</p>
                        </div>
                        <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.7 }}>{imp.implication}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })()}

            {/* ─── What this report covers and doesn't ──────────────────── */}
            <div style={{ border: `1px solid ${S.n200}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: S.n50, borderBottom: `1px solid ${S.n100}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 14, background: S.n400, borderRadius: 2 }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What this report covers and doesn't cover</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: '18px 22px', borderRight: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✓ What's modelled</p>
                  {[
                    'Competitor density within your business-type catchment radius',
                    'Rent-to-revenue ratio and break-even timeline',
                    'Foot traffic signals from transit nodes and anchor tenants',
                    'Market demand trends from search and population data',
                    'Demographics — median income, population age mix',
                    'Scenario modelling: worst / base / optimistic revenue',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: S.emerald, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '18px 22px' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✗ What's not modelled</p>
                  {[
                    { item: 'Lease negotiation outcomes', note: 'Incentives, fit-out contributions, and rent reviews are between you and the landlord' },
                    { item: 'Tenancy mix and anchor changes', note: 'Future tenant departures or new anchors can shift foot traffic significantly' },
                    { item: 'Pending developments', note: 'Approved DA projects, rezoning, or new competitor openings are not captured' },
                    { item: 'Access and visibility specifics', note: 'Street-level signage, car parking, and disabled access require an on-site visit' },
                    { item: 'Operator execution', note: 'Staff quality, product-market fit, and marketing are not factored into projections' },
                  ].map(({ item, note }) => (
                    <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <span style={{ color: S.amber, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✗</span>
                      <div>
                        <p style={{ fontSize: 12, color: S.n800, fontWeight: 600, lineHeight: 1.5 }}>{item}</p>
                        <p style={{ fontSize: 11, color: S.n400, lineHeight: 1.5, marginTop: 2 }}>{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px 22px', background: S.n50, borderTop: `1px solid ${S.n100}` }}>
                <p style={{ fontSize: 11, color: S.n500, lineHeight: 1.7 }}>
                  This report is best used to <strong>shortlist and de-risk locations</strong> before committing to a site visit or engaging a commercial agent. It is not a substitute for a solicitor review, accountant sign-off, or a physical site inspection.
                </p>
              </div>
            </div>

            <AssumptionsPanel report={report} />
          </div>
        )}

        {/* ═══ COMPETITION TAB ═══ */}
        {activeTab === 'competition' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {C?.sectionConfidence?.competition && <SectionConfBadge section={C.sectionConfidence.competition} />}

            {/* Live density reconciliation banner — shown when A1 agent data is missing
                but the compute engine has confirmed live competitor density via Google/Geoapify.
                Prevents contradiction: competition tab showing "0 competitors" while Overview
                shows a low competition score derived from 7+ live-verified competitors. */}
            {(() => {
              const _liveCount = C?.validCompetitorCount
              const _a1Count   = (competitors as any)?.validCount ?? null
              const _liveVerif = C?.competitorDataQuality === 'live_verified'
              if (_liveVerif && _liveCount && _liveCount > 0 && (_a1Count == null || _a1Count === 0)) {
                return (
                  <div style={{ padding: '14px 18px', background: S.blueBg, border: `1px solid ${S.blueBdr}`, borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.blue} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.blue, marginBottom: 4 }}>
                        Live map data: {Math.round(_liveCount)} competitor{_liveCount !== 1 ? 's' : ''} detected nearby
                      </p>
                      <p style={{ fontSize: 12, color: S.blue, opacity: 0.8, lineHeight: 1.55 }}>
                        Google Places + Geoapify detected {C.competitorPressure?.rawCount1km ?? Math.round(_liveCount)} businesses within {C.competitorRadius ?? 1000}m. The A1 competitor profiling agent did not return named cards for this area — competitor density is confirmed but individual profiles are unavailable. Scores in the Overview tab use the live count.
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            })()}

            {/* Header stats */}
            {(competitors || C?.validCompetitorCount) && (() => {
              // Prefer live-verified count from compute engine over A1 agent (which may have failed)
              const _liveVerified = C?.competitorDataQuality === 'live_verified' && (C?.validCompetitorCount ?? 0) > 0
              const _vc  = _liveVerified ? Math.round(C!.validCompetitorCount) : ((competitors as any)?.validCount ?? 0)
              const _dc  = _liveVerified ? Math.round(C!.validCompetitorCount) : ((competitors as any)?.directCompetitorCount ?? 0)
              const _exc = (competitors as any)?.filteredOutCount ?? 0
              // Saturation: derive from live count when A1 label is missing
              const _a1Sat = (competitors as any)?.intensityLabel ?? null
              const _liveSat = _vc > 12 ? 'HIGH' : _vc > 5 ? 'MEDIUM' : 'LOW'
              const _sat = _a1Sat ?? _liveSat
              const _satColor = _sat === 'LOW' ? S.emerald : _sat === 'MEDIUM' ? S.amber : S.red
              const _bt  = (report.business_type ?? 'business').toLowerCase()
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                    <Tile key="direct" label="Direct Competitors" value={String(_dc)} sub={_vc === 0 && _exc > 0 ? `${_exc} nearby businesses, none are ${_bt}s` : `of ${_vc} ${_bt}s detected nearby`} mono color={_dc === 0 ? S.emerald : _dc <= 5 ? S.amber : S.red} />
                    <Tile key="other" label="Other Business Types" value={String(_exc)} sub={`nearby non-${_bt} businesses excluded from analysis`} color={S.n400} mono />
                    <Tile key="sat" label="Saturation" value={_sat} color={_satColor} sub={`based on ${_vc} direct competitors`} mono />
                    <Tile key="threat" label="Threat Level" value={_vc === 0 ? 'Low' : (market?.competitorThreat ?? (_sat === 'HIGH' ? 'High' : _sat === 'MEDIUM' ? 'Medium' : 'Low'))} color={_vc === 0 ? S.emerald : (_sat === 'HIGH' ? S.red : _sat === 'MEDIUM' ? S.amber : S.emerald)} mono />
                  </div>
                  {_vc === 0 && _exc > 0 && (
                    <div style={{ padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.emerald} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 2 }}>No direct {_bt} competitors found in this area</p>
                        <p style={{ fontSize: 12, color: '#065F46', lineHeight: 1.5, opacity: 0.85 }}>
                          {_exc} nearby businesses detected by A1 agent were {_bt === 'gym' ? 'retail/food/service' : 'unrelated'} businesses (not {_bt}s). This may indicate an <strong>underserved market opportunity</strong> for a new {_bt} in this location.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Threat breakdown — strength-based competitor analysis */}
            <ThreatBreakdown computed={C} />

            {/* Saturation bar */}
            {competitors && ((competitors as any)?.validCount ?? competitors?.count ?? 0) >= 0 && (
              <Card>
                <SectionHeading sub="Competitive density relative to typical benchmarks for this business type — non-business POIs excluded.">Market Saturation</SectionHeading>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 12, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (((competitors as any)?.validCount ?? competitors?.count ?? 0) / 20) * 100)}%`,
                      background: (competitors as any)?.intensityLabel === 'LOW' ? S.emerald : (competitors as any)?.intensityLabel === 'MEDIUM' ? S.amber : S.red,
                      borderRadius: 100, transition: 'width 1s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: (competitors as any)?.intensityLabel === 'LOW' ? S.emerald : (competitors as any)?.intensityLabel === 'MEDIUM' ? S.amber : S.red, width: 80, textAlign: 'right' }}>{(competitors as any)?.intensityLabel ?? competitors?.intensityLabel ?? 'UNKNOWN'}</span>
                </div>
                {competitors?.pricing_bands && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 }}>
                    {[
                      { label: 'Budget competitors', value: competitors.pricing_bands.budget_count ?? 0, color: S.emerald },
                      { label: 'Mid-range', value: competitors.pricing_bands.mid_range_count ?? 0, color: S.amber },
                      { label: 'Premium', value: competitors.pricing_bands.premium_count ?? 0, color: S.red },
                    ].map(b => (
                      <div key={b.label} style={{ textAlign: 'center', padding: '12px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}` }}>
                        <p style={{ fontSize: 28, fontWeight: 900, color: b.color, fontFamily: S.mono }}>{b.value}</p>
                        <p style={{ fontSize: 11, color: S.n400, fontWeight: 600, marginTop: 2 }}>{b.label}</p>
                      </div>
                    ))}
                  </div>
                )}
                {/* Only show threat summary if it aligns with the validated competitor count — suppress when 0 direct competitors */}
                {competitors?.threat_summary && (competitors as any).validCount > 0 && (
                  <div style={{ marginTop: 14, padding: '12px 16px', background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
                    <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>{competitors.threat_summary}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Data source badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {competitorDataQuality === 'live' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.emerald }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: S.emerald }}>LIVE DATA — Google Maps + Geoapify</span>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 20 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.amber }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: S.amber }}>A1 AGENT DATA — from analysis run</span>
                </div>
              )}
              <span style={{ fontSize: 11, color: S.n400 }}>Non-{(report.business_type ?? 'business').toLowerCase()} businesses automatically excluded</span>
            </div>

            {/* Competitor profile cards — validated only */}
            {((competitors as any)?.validNearbyBusinesses ?? competitors?.nearbyBusinesses ?? []).length > 0 && (
              <Card>
                <SectionHeading sub="Validated competitor profiles — parks, infrastructure and unrelated businesses excluded.">Competitor Profiles</SectionHeading>
                {/* First 3 cards always visible; remaining locked for free users */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {((competitors as any)?.validNearbyBusinesses ?? competitors?.nearbyBusinesses ?? []).slice(0, 3).map((c: any, i: number) => (
                      <CompetitorCard key={i} c={c} idx={i} />
                    ))}
                  </div>
                  {((competitors as any)?.validNearbyBusinesses ?? competitors?.nearbyBusinesses ?? []).length > 3 && (
                    <PaywallGate locked={userPlan.isFree} label="Full Competitor Analysis" reportId={report.report_id ?? report.id}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                        {((competitors as any)?.validNearbyBusinesses ?? competitors?.nearbyBusinesses ?? []).slice(3).map((c: any, i: number) => (
                          <CompetitorCard key={i + 3} c={c} idx={i + 3} />
                        ))}
                      </div>
                    </PaywallGate>
                  )}
                </div>
                {((competitors as any)?.validNearbyBusinesses ?? []).length === 0 && (
                  <p style={{ fontSize: 13, color: S.n400, padding: '12px 0' }}>No direct competitors found within {C?.competitorRadius ?? 500}m after filtering. This may indicate a low-saturation opportunity.</p>
                )}
              </Card>
            )}

            {/* Opportunity gaps */}
            {competitors?.opportunity_gaps?.length > 0 && (
              <Card>
                <SectionHeading sub="Gaps in the market that represent entry opportunities.">Opportunity Gaps</SectionHeading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {competitors.opportunity_gaps.map((gap: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: S.white }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.6 }}>{gap}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Differentiation suggestions */}
            {competitors?.differentiation_suggestions?.length > 0 && (
              <Card>
                <SectionHeading sub="How to position your business to stand out from local competition.">Differentiation Playbook</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                  {competitors.differentiation_suggestions.map((tip: string, i: number) => (
                    <div key={i} style={{ padding: '12px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, display: 'flex', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.brand, marginTop: 6, flexShrink: 0 }} />
                      <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.6 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {/* Competitive Positioning Recommendation */}
            <CompetitivePositioning computed={C} businessType={report.business_type ?? ''} />
          </div>
        )}

        {/* ═══ LOCATION & RENT TAB ═══ */}
        {activeTab === 'location' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {C?.sectionConfidence?.location && <SectionConfBadge section={C.sectionConfidence.location} />}

            {/* Median rent hero */}
            {areaContext?.medianRent && (
              <Card>
                <SectionHeading sub="Area median rent from A2 agent based on comparable commercial listings.">Area Rent Analysis</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                  <Tile label="Median Monthly Rent" value={areaContext.medianRent.monthly != null ? `A$${(areaContext.medianRent.monthly).toLocaleString()}` : '--'} mono color={S.brand} />
                  <Tile label="Range (Low)" value={areaContext.medianRent.price_range?.min_monthly != null ? `A$${areaContext.medianRent.price_range.min_monthly.toLocaleString()}` : '--'} mono />
                  <Tile label="Range (High)" value={areaContext.medianRent.price_range?.max_monthly != null ? `A$${areaContext.medianRent.price_range.max_monthly.toLocaleString()}` : '--'} mono color={S.red} />
                </div>
                <RentRatioPanel rent={areaContext.medianRent.monthly} revenue={displayRevenue} />
              </Card>
            )}

            {/* Location signals */}
            {(() => {
              const _locationRows = areaContext ? [
                { label: 'Footfall Signal', value: areaContext.footfallSignal, good: ['Very High','High','Good'], bad: ['Low','Poor'] },
                { label: 'Transit Signal', value: areaContext.transitSignal, good: ['Excellent','Good','High'], bad: ['Poor','Low'] },
                { label: 'Road Type', value: areaContext.roadType, good: [], bad: [] },
                { label: 'Transit Stops', value: areaContext.transitStops ? `${areaContext.transitStops} stops` : null, good: [], bad: [] },
                { label: 'Food & Retail POIs', value: areaContext.foodRetailPois ? `${areaContext.foodRetailPois} nearby` : null, good: [], bad: [] },
              ].filter(r => r.value) : []
              return (
                <Card>
                  <SectionHeading sub="Foot traffic signals, transit access, and nearby anchors from A2.">Location Intelligence</SectionHeading>
                  {_locationRows.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 16 }}>
                      {_locationRows.map(r => {
                        const isGood = r.good.some(v => String(r.value).includes(v))
                        const isBad  = r.bad.some(v => String(r.value).includes(v))
                        return (
                          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}` }}>
                            <span style={{ fontSize: 13, color: S.n500 }}>{r.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: isGood ? S.emerald : isBad ? S.red : S.n800 }}>{r.value}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ padding: '14px 16px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Location signal data unavailable</p>
                        <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                          The A2 location agent did not return footfall, transit, or road-type signals for this address.
                          This typically happens when the address is in a less-indexed area. The Map tab may still show live competitor
                          and footfall data loaded from OpenStreetMap.
                        </p>
                      </div>
                      <button onClick={() => setActiveTab('map')} style={{ alignSelf: 'flex-start', background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
                        View Map for live signals →
                      </button>
                    </div>
                  )}
                  {areaContext?.majorAnchors?.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Major Anchor Tenants Nearby</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {areaContext.majorAnchors.map((a: string, i: number) => (
                          <span key={i} style={{ padding: '6px 14px', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, fontSize: 12, fontWeight: 600, color: S.brand }}>{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })()}

            {/* Actionable Location Intelligence */}
            <LocationIntelligence computed={C} report={report} />

            {/* Property recommendations */}
            {areaContext?.topListings?.length > 0 && (
              <Card>
                <SectionHeading sub="Top 3 commercial property recommendations from A2 agent.">Property Recommendations</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {areaContext.topListings.map((p: any, i: number) => (
                    <PropertyCard key={i} p={p} rank={i + 1} />
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═══ MARKET TAB ═══ */}
        {activeTab === 'market' && (
          <PaywallGate locked={userPlan.isFree} label="Market Demand Analysis" reportId={report.report_id ?? report.id}>
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {C?.sectionConfidence?.demand && <SectionConfBadge section={C.sectionConfidence.demand} />}

            {/* Market signals */}
            {market && (
              <>
                {/* When direct competitors = 0, override A3's competitor threat to match validated data */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {(() => {
                    const _validCompCount = (competitors as any)?.validCount ?? competitors?.count ?? 0
                    const _resolvedThreat = _validCompCount === 0 ? 'Low (0 direct)' : (market.competitorThreat ?? '--')
                    const _threatColor = _validCompCount === 0 ? S.emerald
                      : (market.competitorThreat === 'High' ? S.red : market.competitorThreat === 'Low' ? S.emerald : S.amber)
                    return [
                      { label: 'Demand Trend', value: market.demandTrend ?? '--', color: market.demandTrend === 'Rising' ? S.emerald : market.demandTrend === 'Declining' ? S.red : S.amber },
                      { label: 'Market Maturity', value: market.marketMaturity ?? '--', color: S.n800 },
                      { label: 'Best Entry Timing', value: market.bestEntryTiming ?? '--', color: market.bestEntryTiming === 'Immediate' ? S.emerald : S.amber },
                      { label: 'Competitor Threat', value: _resolvedThreat, color: _threatColor },
                    ].map(m => <Tile key={m.label} label={m.label} value={m.value} color={m.color} />)
                  })()}
                </div>

                {/* 5-year forecast */}
                {market.fiveYearForecast && (
                  <Card>
                    <SectionHeading badge="ai" sub="AI-generated market outlook — qualitative trend analysis, not a financial forecast.">5-Year Market Forecast</SectionHeading>
                    {market.fiveYearForecast.estimated_cagr && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, marginBottom: 14 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estimated CAGR</span>
                        <span style={{ fontSize: 18, fontWeight: 900, color: S.emerald, fontFamily: S.mono }}>{market.fiveYearForecast.estimated_cagr}</span>
                      </div>
                    )}
                    {market.fiveYearForecast.narrative && (
                      <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.8, marginBottom: 14 }}>{sanitizeAIText(market.fiveYearForecast.narrative)}</p>
                    )}
                    {market.fiveYearForecast.key_growth_drivers?.length > 0 && (
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Key Growth Drivers</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {market.fiveYearForecast.key_growth_drivers.map((d: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', background: S.brandFaded, borderRadius: 8, border: `1px solid ${S.brandBorder}` }}>
                              <span style={{ fontSize: 12, color: S.brand, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                              <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.5 }}>{d}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Customer segments */}
                {market.targetSegments?.length > 0 && (
                  <Card>
                    <SectionHeading sub="Target segments identified for this business type and location.">Target Customer Segments</SectionHeading>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                      {market.targetSegments.map((seg: any, i: number) => (
                        <div key={i} style={{ padding: '16px 18px', background: S.n50, borderRadius: 12, border: `1px solid ${S.n200}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <p style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>{seg.segment_name}</p>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: seg.demand_fit === 'High' ? S.emeraldBg : S.amberBg, color: seg.demand_fit === 'High' ? S.emerald : S.amber, flexShrink: 0 }}>{seg.demand_fit} fit</span>
                          </div>
                          {seg.estimated_size && <p style={{ fontSize: 12, color: S.n500, marginBottom: 4 }}>Size: {seg.estimated_size}</p>}
                          {seg.spend_profile && <p style={{ fontSize: 12, color: S.n500, marginBottom: 4 }}>Avg spend: {seg.spend_profile}</p>}
                          {seg.how_to_reach && <p style={{ fontSize: 12, color: S.n400, marginTop: 6, fontStyle: 'italic' }}>{seg.how_to_reach}</p>}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Seasonal patterns */}
                {market.seasonalPatterns?.length > 0 && (
                  <Card>
                    <SectionHeading sub="Plan staffing and inventory around these demand patterns.">Seasonal Demand</SectionHeading>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                      {market.seasonalPatterns.map((p: any, i: number) => {
                        const col = p.level === 'Peak' ? S.brand : p.level === 'High' ? S.emerald : p.level === 'Medium' ? S.amber : S.n400
                        return (
                          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}` }}>
                            <div style={{ width: 4, borderRadius: 4, background: col, flexShrink: 0 }} />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: col }}>{p.period}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', background: `${col}15`, color: col, borderRadius: 10 }}>{p.level}</span>
                              </div>
                              <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.5 }}>{p.reason}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )}

                {/* Top opportunities */}
                {market.topOpportunities?.length > 0 && (
                  <Card>
                    <SectionHeading badge="ai" sub="Qualitative opportunities identified by AI — validate against your own market research.">Top Market Opportunities</SectionHeading>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {market.topOpportunities.map((o: any, i: number) => {
                        const label = typeof o === 'string' ? o : (o.opportunity ?? o.title ?? String(o))
                        return (
                          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: S.emerald, flexShrink: 0 }}>+</span>
                            <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>{label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
          </PaywallGate>
        )}

        {/* ═══ FINANCIALS TAB ═══ */}
        {activeTab === 'financials' && (
          <PaywallGate locked={userPlan.isFree} label="Full Financial Model" reportId={report.report_id ?? report.id}>
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {C?.sectionConfidence?.financials && <SectionConfBadge section={C.sectionConfidence.financials} />}

            {/* Agent-failure gate: if financials cannot be computed, show CTA instead of broken data */}
            {_financialsSuppressed.suppress ? (
              <Card style={{ padding: '32px 28px', textAlign: 'center' as const }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={S.amber} strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto 16px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{ fontSize: 16, fontWeight: 800, color: S.n700, marginBottom: 8 }}>Financial projections unavailable</p>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>{_financialsSuppressed.reason}</p>
                <button onClick={() => router.push('/dashboard/new')} style={{ marginTop: 20, padding: '10px 24px', background: S.brand, color: S.white, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
                  Re-run analysis with complete inputs
                </button>
              </Card>
            ) : (<>

            {/* Confidence caveat banner */}
            {_financialGate.caveat && (
              <div style={{ padding: '12px 16px', background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.amber} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 2 }}>
                    {_confidenceTier === 'benchmark_default' ? 'Financial estimates based on industry benchmarks' : 'Limited data — estimates are directional'}
                  </p>
                  <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>{_financialGate.caveat}</p>
                </div>
              </div>
            )}

            {/* Financial Trust — assumptions, what must be true, failure modes */}
            <FinancialTrust computed={C} fin={fin} report={report} />

            <RentRatioPanel rent={report.monthly_rent ?? areaContext?.medianRent?.monthly} revenue={displayRevenue} />

            {/* Key financials tiles — use confidence-aware display */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <Tile
                label="Monthly Revenue"
                value={_dRevenue.display}
                mono color={S.n900}
                sub={(fin as any).isEstimated ? 'industry benchmark — not local sales' : 'market demand model'}
              />
              <Tile label="Monthly Costs"
                value={fin.totalMonthlyCosts != null ? displayMoney(fin.totalMonthlyCosts, _confidenceTier).display : 'Data unavailable'}
                mono color={S.red}
                sub={_confidenceTier === 'benchmark_default' ? 'industry benchmark estimate' : _confidenceTier === 'low' ? 'directional — verify locally' : 'all operating costs'}
              />
              <Tile label="Net Profit / Mo"
                value={_dNetProfit.display}
                mono color={(displayNetProfit ?? 0) >= 0 ? S.emerald : S.red}
                sub={_dNetProfit.qualifier ?? ((fin as any).isEstimated ? 'industry benchmark' : 'financial model')}
              />
              <Tile label="Gross Margin"
                value={_dMargin.display}
                sub={_dMargin.qualifier ?? undefined}
                color={S.brand}
              />
            </div>
            {/* Provenance row — shows data source for each key metric when trust layer is available */}
            {C?.provenance && Object.keys(C.provenance).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
                <span style={{ fontSize: 11, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>Sources</span>
                {(['revenue', 'costs', 'avgTicketSize', 'demandScore'] as const).map(key => {
                  const p = C.provenance[key]
                  if (!p) return null
                  const isBench = p.isBenchmark
                  return (
                    <div key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: isBench ? S.amberBg : S.emeraldBg, border: `1px solid ${isBench ? S.amberBdr : S.emeraldBdr}`, borderRadius: 20 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: isBench ? S.amber : S.emerald }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: isBench ? S.amber : S.emerald, textTransform: 'uppercase' }}>
                        {key === 'avgTicketSize' ? 'ticket' : key} — {p.sourceLabel}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Revenue Intelligence Panel ── */}
            {(() => {
              const seats = _inputData?.seatingCapacity ? Number(_inputData.seatingCapacity) : 0
              if (!seats || seats <= 0) return null
              const bizType = (report.business_type ?? '').toLowerCase()
              const turnsMap: Record<string, number> = {
                cafe: 3, bakery: 3, takeaway: 6,
                restaurant: 2, bar: 2,
                gym: 4, fitness: 4,
                retail: 0, salon: 0, pharmacy: 0,
              }
              const turns = turnsMap[bizType] ?? 2
              if (turns === 0) return null

              // Dynamic utilisation — external inputs only (demand score + competition)
              // NEVER influenced by verdict: that would create circular logic
              const _nv          = normalizeVerdict(report.verdict)
              const _demandScore = C?.scores?.demand ?? report.score_demand ?? null
              const _compCount   = (C as any)?.competitorCount ?? null
              let util = 0.60
              if (_demandScore != null && _demandScore > 65) util += 0.10
              if (_demandScore != null && _demandScore < 40) util -= 0.10
              if (_compCount   != null && _compCount < 3)    util += 0.05
              if (_compCount   != null && _compCount >= 5)   util -= 0.10
              util = Math.min(0.80, Math.max(0.35, util))

              const ticket    = fin.avgTicketSize ?? C?.avgTicketSize ?? null
              const sqm       = Math.round(seats * 2.2)
              const ceiling   = ticket ? Math.round(seats * turns * ticket * util * 30) : null
              const projected = fin.monthlyRevenue ?? null
              // Break-even monthly = totalCosts (point where revenue = costs)
              const breakeven: number | null = (C?.totalCosts != null && C.totalCosts > 0)
                ? C.totalCosts
                : (fin.totalMonthlyCosts ?? null)

              // Bottleneck classification
              type BN = 'DEMAND_LIMITED' | 'CAPACITY_LIMITED' | 'BALANCED'
              const bottleneck: BN | null = (ceiling && projected)
                ? projected < ceiling * 0.75   ? 'DEMAND_LIMITED'
                  : projected >= ceiling * 0.85 ? 'CAPACITY_LIMITED'
                  : 'BALANCED'
                : null

              const BL_CFG = {
                DEMAND_LIMITED:   { label: 'Demand-limited',  color: S.amber,   bg: S.amberBg,   bdr: S.amberBdr,   txt: '#92400E' as string },
                CAPACITY_LIMITED: { label: 'Capacity-limited', color: S.red,     bg: S.redBg,     bdr: S.redBdr,     txt: S.red     as string },
                BALANCED:         { label: 'Well matched',     color: S.emerald, bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald as string },
              }
              const bl = bottleneck ? BL_CFG[bottleneck] : null

              const bottleneckSentence = bottleneck === 'DEMAND_LIMITED'
                ? `This suburb cannot generate enough demand to fill your ${seats}-seat venue — demand is the binding constraint, not space.`
                : bottleneck === 'CAPACITY_LIMITED'
                ? `Your ${seats}-seat venue limits monthly revenue to A$${ceiling?.toLocaleString()} — demand exists but you can't physically serve more without expanding.`
                : bottleneck === 'BALANCED'
                ? `Demand and seating capacity are well matched — growth here requires improving both simultaneously.`
                : null

              // Revenue Triangle: single horizontal scale
              const triangleMax = Math.max(ceiling ?? 0, projected ?? 0, breakeven ?? 0, 1)
              const ceilingPct  = ceiling   ? Math.min(99, Math.round((ceiling   / triangleMax) * 100)) : null
              const projPct     = projected ? Math.min(99, Math.round((projected  / triangleMax) * 100)) : null
              const bePct       = breakeven ? Math.min(97, Math.round((breakeven / triangleMax) * 100)) : null
              const projColor   = _nv === 'NO' ? '#FCA5A5' : _nv === 'CAUTION' ? '#FDE68A' : '#99F6E4'

              return (
                <Card>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Revenue Intelligence</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: S.n800 }}>
                        {seats} seats · {sqm}m² · {turns} turns/day · {Math.round(util * 100)}% utilisation
                      </p>
                    </div>
                    {bl && (
                      <div style={{ padding: '4px 12px', background: bl.bg, border: `1px solid ${bl.bdr}`, borderRadius: 20, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: bl.color }}>{bl.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottleneck sentence — only when meaningful */}
                  {bottleneckSentence && bl && (
                    <div style={{ padding: '10px 14px', borderRadius: 8, background: bl.bg, border: `1px solid ${bl.bdr}`, marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: bl.txt, lineHeight: 1.55, fontWeight: 500 }}>{bottleneckSentence}</p>
                    </div>
                  )}

                  {/* Revenue Triangle — one unified bar */}
                  {triangleMax > 1 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ position: 'relative', height: 32, background: S.n100, borderRadius: 8 }}>
                        {/* Projected fill */}
                        {projPct != null && (
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${projPct}%`, background: projColor,
                            borderRadius: 8, transition: 'width 0.6s ease',
                          }} />
                        )}
                        {/* Break-even marker */}
                        {bePct != null && (
                          <div style={{ position: 'absolute', top: -6, bottom: -6, left: `${bePct}%`, width: 2, background: S.red, zIndex: 2, borderRadius: 1 }}>
                            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 900, color: S.red, whiteSpace: 'nowrap', letterSpacing: '0.06em' }}>B/E</div>
                          </div>
                        )}
                        {/* Capacity ceiling marker */}
                        {ceilingPct != null && (
                          <div style={{ position: 'absolute', top: -6, bottom: -6, left: `${ceilingPct}%`, width: 2, background: S.n400, zIndex: 2, borderRadius: 1, borderTop: '2px dashed' }}>
                            <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 900, color: S.n400, whiteSpace: 'nowrap', letterSpacing: '0.06em' }}>MAX</div>
                          </div>
                        )}
                      </div>
                      {/* Legend */}
                      <div style={{ display: 'flex', gap: 14, marginTop: 22, flexWrap: 'wrap' as const }}>
                        {projected != null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 12, height: 8, borderRadius: 2, background: projColor }} />
                            <span style={{ fontSize: 11, color: S.n500, fontWeight: 600 }}>Projected A${projected.toLocaleString()}/mo</span>
                          </div>
                        )}
                        {breakeven != null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 2, height: 12, background: S.red, borderRadius: 1 }} />
                            <span style={{ fontSize: 11, color: S.n500, fontWeight: 600 }}>Break-even A${breakeven.toLocaleString()}/mo</span>
                          </div>
                        )}
                        {ceiling != null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 2, height: 12, background: S.n400, borderRadius: 1 }} />
                            <span style={{ fontSize: 11, color: S.n500, fontWeight: 600 }}>Capacity ceiling A${ceiling.toLocaleString()}/mo</span>
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 10, color: S.n400, marginTop: 10, fontStyle: 'italic' }}>
                        Estimates based on comparable locations · ranges may vary ±25–35%
                      </p>
                    </div>
                  )}

                  {/* 3 metric tiles with per-metric confidence */}
                  {(() => {
                    // Confidence derivation — external inputs only, never from verdict
                    // Ceiling: HIGH if user provided ticket size, MEDIUM if from compute engine, LOW if benchmark
                    const _ticketSrc = _inputData?.avgTicketSize ? 'user'
                      : C?.avgTicketSize ? 'engine' : 'benchmark'
                    const ceilConf: 'high'|'medium'|'low' = !ticket ? 'low'
                      : _ticketSrc === 'user' ? 'high'
                      : _ticketSrc === 'engine' ? 'medium' : 'low'
                    // Projected revenue: HIGH if engine has real demand, MEDIUM if estimated, LOW if benchmark default
                    const _revSrc = C?.provenance?.revenue
                    const projConf: 'high'|'medium'|'low' = !projected ? 'low'
                      : _revSrc && !_revSrc.isBenchmark ? 'medium'
                      : (fin as any).isEstimated ? 'low' : 'medium'
                    // Constraint: lower of the two
                    const confRank = { high: 2, medium: 1, low: 0 }
                    const constraintConf: 'high'|'medium'|'low' = bottleneck
                      ? (confRank[ceilConf] <= confRank[projConf] ? ceilConf : projConf)
                      : 'low'
                    const CONF_DOT = {
                      high:   { color: S.emerald, label: 'Your data · high confidence'        },
                      medium: { color: S.amber,   label: 'Mixed inputs · verify before signing' },
                      low:    { color: S.n400,    label: 'Benchmark estimate · local data missing' },
                    }
                    const ConfLine = ({ conf }: { conf: 'high'|'medium'|'low' }) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: CONF_DOT[conf].color, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: CONF_DOT[conf].color, fontWeight: 600 }}>{CONF_DOT[conf].label}</span>
                      </div>
                    )
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        <div style={{ padding: '12px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}` }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Capacity Ceiling</p>
                          <p style={{ fontSize: 18, fontWeight: 700, color: S.n900, fontFamily: S.mono }}>
                            {ceiling ? `A$${ceiling.toLocaleString()}` : ticket ? '—' : 'Need ticket'}
                          </p>
                          <p style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>{Math.round(util * 100)}% util · {turns} turns/day</p>
                          <ConfLine conf={ceilConf} />
                        </div>
                        <div style={{ padding: '12px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}` }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Projected Revenue</p>
                          <p style={{ fontSize: 18, fontWeight: 700, color: S.n900, fontFamily: S.mono }}>
                            {projected ? `A$${projected.toLocaleString()}` : '—'}
                          </p>
                          <p style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>demand model output</p>
                          <ConfLine conf={projConf} />
                        </div>
                        <div style={{ padding: '12px 14px', borderRadius: 10, background: bl?.bg ?? S.n50, border: `1px solid ${bl?.bdr ?? S.n200}` }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Binding Constraint</p>
                          <p style={{ fontSize: 18, fontWeight: 700, color: bl?.color ?? S.n400, fontFamily: S.mono }}>
                            {bottleneck === 'DEMAND_LIMITED' ? 'Demand' : bottleneck === 'CAPACITY_LIMITED' ? 'Seats' : bottleneck === 'BALANCED' ? 'Matched' : '—'}
                          </p>
                          <p style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>what limits revenue</p>
                          <ConfLine conf={constraintConf} />
                        </div>
                      </div>
                    )
                  })()}
                </Card>
              )
            })()}

            {/* A4 Monthly cost breakdown */}
            {fin.monthlyCostBreakdown && (
              <Card>
                <SectionHeading badge="engine" sub="Line-by-line operating costs from A4 agent financial model.">Monthly Operating Costs (A4)</SectionHeading>
                <MonthlyCostTable breakdown={fin.monthlyCostBreakdown} />
                {fin.costOptimisationTips?.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${S.n100}` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Cost Optimisation Tips</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {fin.costOptimisationTips.map((tip: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', background: S.brandFaded, borderRadius: 8, border: `1px solid ${S.brandBorder}` }}>
                          <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>↓</span>
                          <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.5 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            <Card>
              <SectionHeading badge="engine">Monthly P&L Waterfall</SectionHeading>
              {fin.monthlyRevenue && (
                <div style={{ marginBottom: 20 }}>
                  <PLWaterfall fin={fin} submittedRent={report.monthly_rent} computed={C} />
                </div>
              )}
              {/* Only render profitability text if it doesn't contradict the computed net profit */}
              {report.profitability && (() => {
                // Suppress if the text contains a profit/loss number that contradicts displayNetProfit
                const _plText = report.profitability ?? ''
                const _plMatch = _plText.match(/(?:loss|profit|net)[:\s\$A]*([+-]?\s*[\d,]+)/i)
                if (_plMatch && displayNetProfit != null) {
                  const _plNum = parseFloat(_plMatch[1].replace(/[,\s]/g, ''))
                  if (!isNaN(_plNum) && Math.sign(_plNum) !== Math.sign(displayNetProfit) && Math.abs(_plNum - displayNetProfit) > 3000) {
                    return null // suppress contradictory text
                  }
                }
                return <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{_plText}</p>
              })()}
            </Card>

            {/* Revenue Channels (A5 or benchmark fallback) */}
            {fin.monthlyRevenue && (fin.revenueChannels?.length > 0) && (() => {
              const _anyBench = fin.revenueChannels.some((ch: any) => ch.isBenchmark)
              return (
                <Card>
                  <SectionHeading sub={_anyBench ? 'Industry-average channel split — your actual mix will differ.' : 'Projected revenue split across channels at base demand.'}>Revenue Channels</SectionHeading>
                  {_anyBench && (
                    <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                      <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5, margin: 0 }}>
                        <strong>Benchmark split — not verified for this business.</strong> A5 agent did not return channel data, so these percentages use industry-average ratios for this business type. Your actual channel mix may differ significantly.
                      </p>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {fin.revenueChannels.map((ch: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 110, fontSize: 13, color: S.n700, fontWeight: 500, flexShrink: 0 }}>{ch.channel}</div>
                        <div style={{ flex: 1, height: 8, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${ch.revenue_split_pct ?? 0}%`, background: i === 0 ? S.brand : i === 1 ? S.blue : S.amber, borderRadius: 100 }} />
                        </div>
                        <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: S.n500, textAlign: 'right' }}>{ch.revenue_split_pct}%</div>
                        <div style={{ width: 80, fontSize: 13, fontWeight: 700, color: ch.isBenchmark ? S.amber : S.n800, textAlign: 'right', fontFamily: S.mono, fontStyle: ch.isBenchmark ? 'italic' : 'normal' }}>{ch.monthly_revenue}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })()}

            {/* Pricing Strategies (A5) */}
            {fin.pricingStrategies?.length > 0 && (
              <Card>
                <SectionHeading sub="Three pricing tiers modelled for your business type and location.">Pricing Strategy Analysis</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {fin.pricingStrategies.map((s: any, i: number) => {
                    const isRec = s.recommended
                    return (
                      <div key={i} style={{ border: `${isRec ? '2px' : '1px'} solid ${isRec ? S.brand : S.n200}`, borderRadius: 12, padding: '16px 18px', background: isRec ? S.brandFaded : S.white, position: 'relative' }}>
                        {isRec && (
                          <div style={{ position: 'absolute', top: -10, left: 16, background: S.brand, color: S.white, fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Recommended</div>
                        )}
                        <p style={{ fontSize: 14, fontWeight: 800, color: S.n900, marginBottom: 2 }}>{s.strategy}</p>
                        <p style={{ fontSize: 22, fontWeight: 900, color: isRec ? S.brand : S.n800, fontFamily: S.mono, marginBottom: 12 }}>{s.avg_ticket}<span style={{ fontSize: 11, fontWeight: 500, color: S.n400 }}>/visit</span></p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {[
                            { label: 'Monthly revenue', val: s.monthly_revenue },
                            { label: 'Monthly profit', val: s.monthly_profit, color: S.emerald },
                            { label: 'Customers/day', val: s.daily_customers_needed ? `${s.daily_customers_needed} cust.` : null },
                          ].filter(r => r.val).map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 11, color: S.n400 }}>{r.label}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: r.color || S.n700, fontFamily: S.mono }}>{r.val}</span>
                            </div>
                          ))}
                        </div>
                        {(s.pros || s.cons) && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.n100}` }}>
                            {s.pros && <p style={{ fontSize: 11, color: S.emerald, marginBottom: 2 }}>+ {s.pros}</p>}
                            {s.cons && <p style={{ fontSize: 11, color: S.red }}>- {s.cons}</p>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Setup Cost Estimate (A4) */}
            {(fin.setupCostRec || fin.setupCostMin) && (
              <Card>
                <SectionHeading badge="engine" sub="Estimated one-time costs to open your business in this location.">Setup Cost Estimate</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                  <Tile label="Recommended budget" value={fmt(fin.setupCostRec)} mono color={S.brand} />
                  <Tile label="Minimum viable" value={fmt(fin.setupCostMin)} mono />
                  <Tile label="High-end estimate" value={fmt(fin.setupCostMax)} mono color={S.red} />
                </div>
                {fin.setupBreakdown && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {Object.entries(fin.setupBreakdown as Record<string, any>).slice(0, 6).map(([key, val]: [string, any]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${S.n100}` }}>
                        <span style={{ fontSize: 13, color: S.n500, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: S.n800, fontFamily: S.mono }}>{val.min} – {val.max}</span>
                          {val.notes && <p style={{ fontSize: 11, color: S.n400 }}>{val.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {fin.roiTimeline?.roi12 && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${S.n100}` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Projected ROI on setup cost</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {[
                        { label: 'Year 1', val: fin.roiTimeline.roi12 },
                        { label: 'Year 2', val: fin.roiTimeline.roi24 },
                        { label: 'Year 3', val: fin.roiTimeline.roi36 },
                      ].map(r => {
                        const isPos = String(r.val).startsWith('+') || (!String(r.val).startsWith('-') && r.val)
                        return (
                          <div key={r.label} style={{ background: S.n50, borderRadius: 10, padding: '12px 14px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                            <p style={{ fontSize: 11, color: S.n400, marginBottom: 4 }}>{r.label}</p>
                            <p style={{ fontSize: 18, fontWeight: 900, color: isPos ? S.emerald : S.red, fontFamily: S.mono }}>{r.val}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )}

            <Card>
              <SectionHeading>Rent Breakdown</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                <Tile label="Monthly Rent" value={fmt(report.monthly_rent)} mono />
                <Tile label="% of Revenue" value={fin.rent?.toRevenuePercent != null ? displayPercent(fin.rent.toRevenuePercent, _confidenceTier).display : '--'} color={fin.rent?.toRevenuePercent == null ? S.n400 : (fin.rent.toRevenuePercent <= 12 ? S.emerald : fin.rent.toRevenuePercent <= 20 ? S.amber : S.red)} mono />
                <Tile label="Rating" value={fin.rent?.label ?? '--'} color={fin.rent?.label === 'EXCELLENT' ? S.emerald : fin.rent?.label === 'GOOD' ? S.blue : fin.rent?.label === 'MARGINAL' ? S.amber : S.red} />
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{report.rent_analysis}</p>
            </Card>

            <Card>
              <SectionHeading badge="engine">Break-even Analysis</SectionHeading>
              {/* Single canonical break-even values — _beDailyForGauge = required, _currentDailyCustomers = projected */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  <Tile label="Break-even / Day" value={_beDailyForGauge != null ? `${displayCustomers(_beDailyForGauge, _confidenceTier).display} cust.` : '--'} mono sub="customers needed" />
                  <Tile label="Projected / Day" value={_currentDailyCustomers != null ? `${_dCustomers.display} cust.` : '--'} mono sub="at base demand" color={(_currentDailyCustomers ?? 0) >= (_beDailyForGauge ?? Infinity) ? S.emerald : S.red} />
                  <Tile label="Revenue / Month" value={_beMonthly != null ? displayMoney(_beMonthly, _confidenceTier).display : '--'} mono sub="needed to break even" />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>Projected vs Break-even</p>
                  <BreakevenGauge daily={_currentDailyCustomers} breakeven={_beDailyForGauge} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{report.cost_analysis}</p>
            </Card>

            {/* Scenarios — prefer A5 sensitivity_analysis, fallback to old riskScenarios */}
            {fin.monthlyRevenue && (
              <Card>
                <SectionHeading sub={(fin as any).scenarioSource === 'benchmark' ? "Generated from industry benchmarks — run analysis for live A5 projections" : "Best, base, and worst-case from A5 revenue model"}>Scenario Analysis</SectionHeading>
                {fin.sensitivityAnalysis ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 }}>
                    <ScenarioCard label="Worst Case" data={fin.sensitivityAnalysis.worst_case} color={S.red} bg={S.redBg} border={S.redBdr} />
                    <ScenarioCard label="Base Case" data={fin.sensitivityAnalysis.base_case} color={S.blue} bg={S.blueBg} border={S.blueBdr} />
                    <ScenarioCard label="Best Case" data={fin.sensitivityAnalysis.best_case} color={S.emerald} bg={S.emeraldBg} border={S.emeraldBdr} />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                    {[
                      { key: 'best', label: 'Best Case', bg: S.emeraldBg, border: S.emeraldBdr, text: S.emerald },
                      { key: 'base', label: 'Base Case', bg: S.blueBg, border: S.blueBdr, text: S.blue },
                      { key: 'worst', label: 'Worst Case', bg: S.redBg, border: S.redBdr, text: S.red },
                    ].map(sc => {
                      const s = riskScenarios[sc.key] || {}
                      return (
                        <div key={sc.key} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 12, padding: '16px 18px' }}>
                          <p style={{ fontSize: 10, fontWeight: 800, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>{sc.label}</p>
                          <p style={{ fontSize: 10, color: sc.text, opacity: 0.6, marginBottom: 2 }}>Revenue</p>
                          <p style={{ fontSize: _confidenceTier === 'high' ? 17 : 14, fontWeight: 900, color: sc.text, marginBottom: 10, fontFamily: S.mono }}>{displayMoney(s.monthlyRevenue, _confidenceTier).display}</p>
                          <p style={{ fontSize: 10, color: sc.text, opacity: 0.6, marginBottom: 2 }}>Net Profit</p>
                          <p style={{ fontSize: _confidenceTier === 'high' ? 14 : 12, fontWeight: 700, color: sc.text, fontFamily: S.mono }}>{displayMoney(s.monthlyNet, _confidenceTier).display}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                {fin.revenueGrowthLevers?.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${S.n100}` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Revenue Growth Levers</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {fin.revenueGrowthLevers.map((lever: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: S.n50, borderRadius: 8, border: `1px solid ${S.n200}` }}>
                          <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>↑</span>
                          <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.5 }}>{lever}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Year 1 Revenue Ramp (A5) */}
            {fin.monthlyRamp?.length > 0 && (
              <Card>
                <SectionHeading badge="engine" sub="Customer ramp trajectory from A5 model — month 1 through 12.">Year 1 Revenue Ramp</SectionHeading>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, marginBottom: 14 }}>
                  {fin.monthlyRamp.map((m: any, i: number) => {
                    const cust = Number(m.customers_per_day ?? m.utilisation_pct ?? 0)
                    const maxC = Math.max(...fin.monthlyRamp.map((r: any) => Number(r.customers_per_day ?? r.utilisation_pct ?? 0)), 1)
                    const h = Math.round((cust / maxC) * 72)
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: '100%', height: Math.max(h, 4), background: S.brand, borderRadius: '3px 3px 0 0', opacity: 0.5 + (i / fin.monthlyRamp.length) * 0.5 }} />
                        <span style={{ fontSize: 9, color: S.n400 }}>M{i + 1}</span>
                      </div>
                    )
                  })}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${S.n100}` }}>
                      {['Month', 'Customers/Day', 'Utilisation', 'Cumulative P&L'].map((h, i) => (
                        <th key={h} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 0', fontSize: 10, fontWeight: 800, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fin.monthlyRamp.map((m: any, i: number) => {
                      const isProfitable = m.cumulative_profit_loss && !String(m.cumulative_profit_loss).startsWith('-')
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${S.n100}` }}>
                          <td style={{ padding: '8px 0', fontSize: 12, color: S.n700, fontWeight: 600 }}>Month {m.month}</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontSize: 12, fontWeight: 700, color: S.n800, fontFamily: S.mono }}>{m.customers_per_day}</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontSize: 12, color: S.n500 }}>{m.utilisation_pct}</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontSize: 12, fontWeight: 700, color: isProfitable ? S.emerald : S.red, fontFamily: S.mono }}>{m.cumulative_profit_loss}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </>)}
          </div>
          </PaywallGate>
        )}

        {/* ═══ MAP TAB ═══ */}
        {activeTab === 'map' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Top insight banner */}
            {mapBannerText && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 20px', marginBottom: 16,
                background: mapBannerColor.bg, border: `1px solid ${mapBannerColor.border}`,
                borderRadius: 12,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={mapBannerColor.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{ fontSize: 13, fontWeight: 600, color: mapBannerColor.text, lineHeight: 1.5 }}>{mapBannerText}</p>
              </div>
            )}

            {/* Map + Insights split layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 0, borderRadius: 14, overflow: 'hidden', border: `1px solid ${S.n200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', background: S.white }}>
              {/* LEFT: Mapbox */}
              <div style={{ height: 720, position: 'relative', borderRight: `1px solid ${S.n200}` }}>
                {reportLat && reportLng && mapTabMounted.current ? (
                  <MapboxMap
                    lat={reportLat} lng={reportLng}
                    businessType={mapBusinessType}
                    radius={mapRadius}
                    competitorRadiusM={mapRadius ?? 600}
                    catchmentRadiusM={mapCatchmentRadius}
                    onInsightsUpdate={handleInsightsUpdate}
                    onCompetitorsUpdate={handleCompetitorsUpdate}
                    onAnchorsUpdate={handleAnchorsUpdate}
                    showHeatmap={showHeatmap}
                    showIsochrones={showIsochrones}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: S.n100 }}>
                    <p style={{ fontSize: 13, color: S.n400 }}>Map coordinates unavailable</p>
                  </div>
                )}
              </div>

              {/* RIGHT: Insights panel */}
              <div style={{ height: 720, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Panel header */}
                <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${S.n100}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.n700} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <span style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Competition Insights</span>
                  </div>
                  {/* Data source badge — shows Foursquare for gym types */}
                  {mapInsights && (
                    <div style={{ marginBottom: 12 }}>
                      {(mapInsights as any).foursquareVerified ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.emerald }} />
                          <span style={{ fontSize: 10, fontWeight: 800, color: S.emerald, letterSpacing: '0.04em' }}>✓ FOURSQUARE VERIFIED</span>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: S.blueBg, border: `1px solid ${S.blueBdr}`, borderRadius: 20 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.blue }} />
                          <span style={{ fontSize: 10, fontWeight: 800, color: S.blue, letterSpacing: '0.04em' }}>GEOAPIFY LIVE</span>
                        </div>
                      )}
                    </div>
                  )}
                  <select
                    value={mapBusinessType}
                    onChange={e => setMapBusinessType(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: 13, fontWeight: 600, border: `1px solid ${S.n200}`, borderRadius: 10, background: S.n50, color: S.n800, fontFamily: S.font, cursor: 'pointer', outline: 'none', appearance: 'auto' as any }}
                  >
                    {BUSINESS_TYPES.map(bt => (
                      <option key={bt.id} value={bt.id}>{bt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Metrics grid */}
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${S.n100}` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={{ background: S.n50, borderRadius: 10, padding: '14px', border: `1px solid ${S.n100}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 28, fontWeight: 900, color: S.n900, fontFamily: S.mono, letterSpacing: '-0.03em' }}>
                        {mapInsights?.competitorCount500m ?? competitors?.count ?? '--'}
                      </p>
                      <p style={{ fontSize: 10, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>within {mapRadius ?? C?.competitorRadius ?? 500}m</p>
                    </div>
                    <div style={{ background: S.n50, borderRadius: 10, padding: '14px', border: `1px solid ${S.n100}`, textAlign: 'center' }}>
                      <p style={{
                        fontSize: 14, fontWeight: 800, textTransform: 'uppercase',
                        color: (mapInsights?.density ?? competitors?.intensityLabel?.toLowerCase()) === 'high' ? S.red
                          : (mapInsights?.density ?? competitors?.intensityLabel?.toLowerCase()) === 'medium' ? S.amber : S.emerald,
                      }}>
                        {mapInsights?.density ?? competitors?.intensityLabel ?? '--'}
                      </p>
                      <p style={{ fontSize: 10, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>density</p>
                    </div>
                  </div>
                  {avgRating && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n100}` }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: S.n500 }}>Avg. rating</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={S.amber} stroke={S.amber} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span style={{ fontSize: 14, fontWeight: 800, color: S.n800, fontFamily: S.mono }}>{avgRating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>
                    {(() => {
                      const count = mapInsights?.competitorCount500m ?? competitors?.count ?? 0
                      const density = mapInsights?.density ?? competitors?.intensityLabel?.toLowerCase() ?? 'unknown'
                      if (density === 'high' || count > 15) return 'This area has significantly higher competition than the city average. Differentiation and a strong value proposition will be critical for market entry.'
                      if (density === 'medium' || count > 6) return 'Competition in this area is moderate. There is room for a well-positioned business, but market research on pricing and positioning is recommended.'
                      return 'Low competition suggests an underserved market. Validate that demand exists before committing -- low supply can indicate low foot traffic.'
                    })()}
                  </p>
                </div>

                {/* Layer toggles */}
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${S.n100}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {([
                    { label: 'Density Heatmap', state: showHeatmap, toggle: () => setShowHeatmap(h => !h), color: S.brand },
                    { label: 'Drive-time Zones', state: showIsochrones, toggle: () => setShowIsochrones(v => !v), color: '#6366F1' },
                  ] as Array<{ label: string; state: boolean; toggle: () => void; color: string }>).map(item => (
                    <button
                      key={item.label}
                      onClick={item.toggle}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${item.state ? item.color : S.n200}`, background: item.state ? `${item.color}10` : S.white, cursor: 'pointer', fontFamily: S.font, transition: 'all 0.15s' }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.state ? item.color : S.n700 }}>{item.label}</span>
                      <div style={{ width: 32, height: 18, borderRadius: 9, background: item.state ? item.color : S.n200, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: S.white, position: 'absolute', top: 2, left: item.state ? 16 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Competitor list */}
                <div style={{ padding: '16px 20px', flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    Nearby ({mapCompetitors.length})
                  </p>
                  {mapCompetitors.length === 0 && (
                    <div>
                      <p style={{ fontSize: 12, color: S.n400, marginBottom: 8 }}>
                        {reportLat && reportLng ? 'Loading live competitor data…' : 'Map coordinates unavailable'}
                      </p>
                      {/* Fallback: show A1 agent businesses while map loads */}
                      {((competitors as any)?.validNearbyBusinesses ?? competitors?.nearbyBusinesses ?? []).slice(0, 5).map((c: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 4 ? `1px solid ${S.n100}` : 'none' }}>
                          <span style={{ fontSize: 12, color: S.n700, fontWeight: 500 }}>{c.name}</span>
                          <span style={{ fontSize: 11, color: S.n400 }}>A1 data</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {mapCompetitors.slice(0, 12).map((c: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < Math.min(mapCompetitors.length, 12) - 1 ? `1px solid ${S.n100}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.distance <= 500 ? S.red : S.amber, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: S.n800, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {c.rating > 0 && <span style={{ fontSize: 11, color: S.n400, fontFamily: S.mono }}>{c.rating?.toFixed(1)}</span>}
                        <span style={{ fontSize: 11, color: S.n400, fontWeight: 600, fontFamily: S.mono }}>{Math.round(c.distance)}m</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div style={{ padding: '14px 20px', borderTop: `1px solid ${S.n100}`, background: S.n50 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {[
                      { color: '#EF4444', label: 'Competitor' },
                      { color: S.brand, label: `${mapRadius ?? C?.competitorRadius ?? 500}m competitor area` },
                      { color: '#6366F1', label: `${mapCatchmentRadius >= 1000 ? `${mapCatchmentRadius / 1000}km` : `${mapCatchmentRadius}m`} catchment` },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: 10, color: S.n500, fontWeight: 600 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 10, color: S.n400, marginTop: 8 }}>Data: OpenStreetMap Overpass API + Google Places + Foursquare</p>
                </div>
              </div>
            </div>

            {/* Strategic map insights — below the map */}
            {mapCompetitors.length > 0 && (() => {
              const close = mapCompetitors.filter((c: any) => c.distance <= 300)
              const strong = mapCompetitors.filter((c: any) => c.rating >= 4.0)
              const saturatedZone = close.length >= 5
              const gapZone = mapCompetitors.filter((c: any) => c.distance > 500 && c.distance <= 1000).length <= 2

              return (
                <Card style={{ marginTop: 16 }}>
                  <SectionHeading sub="Strategic analysis based on competitor positions on the map.">Map Strategy</SectionHeading>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                    <div style={{ padding: '16px 18px', background: saturatedZone ? S.redBg : S.emeraldBg, border: `1px solid ${saturatedZone ? S.redBdr : S.emeraldBdr}`, borderRadius: 12 }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: saturatedZone ? S.red : S.emerald, fontFamily: S.mono }}>{close.length}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: saturatedZone ? S.red : S.emerald, textTransform: 'uppercase', marginTop: 2 }}>within 300m</p>
                      <p style={{ fontSize: 12, color: saturatedZone ? '#991B1B' : '#065F46', marginTop: 6, lineHeight: 1.5 }}>
                        {saturatedZone ? 'Immediate vicinity is saturated — customers have many choices within walking distance' : 'Low immediate-vicinity competition — walk-in customers have few nearby alternatives'}
                      </p>
                    </div>
                    <div style={{ padding: '16px 18px', background: strong.length >= 3 ? S.redBg : S.amberBg, border: `1px solid ${strong.length >= 3 ? S.redBdr : S.amberBdr}`, borderRadius: 12 }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: strong.length >= 3 ? S.red : S.amber, fontFamily: S.mono }}>{strong.length}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: strong.length >= 3 ? S.red : S.amber, textTransform: 'uppercase', marginTop: 2 }}>rated 4.0+</p>
                      <p style={{ fontSize: 12, color: strong.length >= 3 ? '#991B1B' : '#92400E', marginTop: 6, lineHeight: 1.5 }}>
                        {strong.length >= 3 ? 'Multiple high-rated operators — quality bar is high, customers have strong alternatives' : 'Few high-rated competitors — opportunity to become the quality leader in this area'}
                      </p>
                    </div>
                    <div style={{ padding: '16px 18px', background: gapZone ? S.emeraldBg : S.n50, border: `1px solid ${gapZone ? S.emeraldBdr : S.n200}`, borderRadius: 12 }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: gapZone ? S.emerald : S.n700, fontFamily: S.mono }}>{gapZone ? 'Yes' : 'No'}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: gapZone ? S.emerald : S.n500, textTransform: 'uppercase', marginTop: 2 }}>opportunity gap</p>
                      <p style={{ fontSize: 12, color: gapZone ? '#065F46' : S.n500, marginTop: 6, lineHeight: 1.5 }}>
                        {gapZone ? `The ${mapRadius ?? C?.competitorRadius ?? 500}m–${mapCatchmentRadius >= 1000 ? `${mapCatchmentRadius / 1000}km` : `${mapCatchmentRadius}m`} ring has very few operators — potential opportunity to serve the wider catchment` : 'Competition is distributed evenly across the catchment area — no obvious spatial gaps'}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })()}
          </div>
        )}

        {/* Assumptions + Footer */}
        <div style={{ marginTop: 28 }}>
          <AssumptionsPanel report={report} />
        </div>

        {/* Upgrade nudge — shown for free users */}
        <UpgradeNudge plan={userPlan.plan} used={userPlan.used} remaining={userPlan.remaining} FREE_LIMIT={userPlan.FREE_LIMIT} reportId={report.report_id ?? report.id} />

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${S.n200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: S.n400, fontFamily: S.mono }}>Report {report.report_id ?? report.id}</p>
            <p style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>{new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={() => router.push('/onboarding')}
            style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 8px rgba(15,118,110,0.2)', fontFamily: S.font }}>
            Analyse another location &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
