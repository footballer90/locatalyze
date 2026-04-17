'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import ShareButton from '@/components/ShareButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import ReferralPrompt from '@/components/ReferralPrompt'
import DataQualitySummary from '@/components/DataQualitySummary'
import CalibrationSummary from '@/components/CalibrationSummary'
import { use, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { MapInsights, Competitor, Anchor } from '@/components/MapboxMap'
import type { ComputedResult } from '@/types/computed'
import { displayMoney, displayPercent, displayCustomers, getConfidenceTier, shouldSuppressFinancials, type ConfidenceTier, type DisplayNumber } from '@/lib/compute/display-discipline'

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
  brand:       '#4F46E5',
  brandLight:  '#6366F1',
  brandFaded:  '#EEF2FF',
  brandBorder: '#C7D2FE',
  n50:  '#F8FAFC', n100: '#F1F5F9', n200: '#E2E8F0',
  n400: '#94A3B8', n500: '#64748B', n700: '#334155',
  n800: '#1E293B', n900: '#0F172A', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  blue: '#4F46E5', blueBg: '#EEF2FF', blueBdr: '#C7D2FE',
  headerBg: '#0B1020',
  headerBorder: '#1E293B',
  topShellA: '#0B1020',
  topShellB: '#1E1B4B',
  topShellC: '#312E81',
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
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 3, height: 20, background: S.brand, borderRadius: 2, flexShrink: 0, opacity: 0.8 }} />
        <h2 style={{ fontSize: 17, fontWeight: 800, color: S.n800, letterSpacing: '-0.02em', lineHeight: 1 }}>{children}</h2>
        {badge === 'ai'     && <AIBadge />}
        {badge === 'engine' && <EngineBadge />}
      </div>
      {sub && <p style={{ fontSize: 12, color: S.n500, marginTop: 7, marginLeft: 13, maxWidth: 760, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style: extra }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: S.white, borderRadius: 18, border: '1px solid rgba(28,25,23,0.04)',
      boxShadow: '0 10px 28px rgba(28,25,23,0.06)', overflow: 'hidden' as const,
      padding: '28px 32px', ...extra,
    }}>
      {children}
    </div>
  )
}

// ─── Metric tile ──────────────────────────────────────────────────────────────
function Tile({ label, value, sub, color, mono }: { label: string; value: string; sub?: string; color?: string; mono?: boolean }) {
  return (
    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFB 100%)', borderRadius: 12, border: '1px solid rgba(28,25,23,0.08)', padding: '16px 16px 15px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 900, color: color || S.n900, letterSpacing: '-0.035em', lineHeight: 1, fontFamily: mono ? S.mono : S.font }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: S.n500, marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function ExplainLabel({ label, help }: { label: string; help: string }) {
  return (
    <span
      title={help}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'help' }}
    >
      <span>{label}</span>
      <span
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `1px solid ${S.n200}`,
          color: S.n500,
          fontSize: 10,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        ?
      </span>
    </span>
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
// CONTRADICTION BANNER — surfaces data conflicts caught by the trust layer
// filterSections: optional — when provided, only shows warnings affecting those sections
// Visual design: thick left border + labelled header = serious, not just informational
// ═══════════════════════════════════════════════════════════════════════════════
function ContradictionBanner({
  computed,
  filterSections,
}: {
  computed: import('@/types/computed').ComputedResult | null
  filterSections?: string[]
}) {
  if (!computed?.contradictions || computed.contradictions.length === 0) return null

  const relevant = filterSections
    ? computed.contradictions.filter(c => c.affectedSections.some(s => filterSections.includes(s)))
    : computed.contradictions

  const errors   = relevant.filter(c => c.severity === 'error')
  const warnings = relevant.filter(c => c.severity === 'warning')
  if (errors.length === 0 && warnings.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {errors.map((c, i) => (
        <div key={i} style={{
          background: S.white,
          border: `1px solid ${S.redBdr}`,
          borderLeft: `4px solid ${S.red}`,
          borderRadius: 10,
        }}>
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            background: S.redBg,
            borderBottom: `1px solid ${S.redBdr}`,
            borderRadius: '9px 9px 0 0',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={S.red} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 800, color: S.red, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
              Data Conflict
            </span>
            {c.affectedSections.length > 0 && (
              <span style={{ fontSize: 11, color: '#991B1B', opacity: 0.7 }}>
                — affects {c.affectedSections.join(', ')}
              </span>
            )}
          </div>
          {/* Body */}
          <div style={{ padding: '11px 14px' }}>
            <p style={{ fontSize: 13, color: S.n800, lineHeight: 1.65, margin: 0 }}>{c.reason}</p>
          </div>
        </div>
      ))}
      {warnings.map((c, i) => (
        <div key={i} style={{
          background: S.white,
          border: `1px solid ${S.amberBdr}`,
          borderLeft: `4px solid ${S.amber}`,
          borderRadius: 10,
        }}>
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 14px',
            background: S.amberBg,
            borderBottom: `1px solid ${S.amberBdr}`,
            borderRadius: '9px 9px 0 0',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={S.amber} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 800, color: S.amber, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
              Model Notice
            </span>
            {c.affectedSections.length > 0 && (
              <span style={{ fontSize: 11, color: '#92400E', opacity: 0.75 }}>
                — affects {c.affectedSections.join(', ')}
              </span>
            )}
          </div>
          {/* Body */}
          <div style={{ padding: '11px 14px' }}>
            <p style={{ fontSize: 13, color: '#78400D', lineHeight: 1.65, margin: 0 }}>{c.reason}</p>
          </div>
        </div>
      ))}
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

  const revLabel  = srcRev  === 'a5_live' ? 'live market data' : srcRev  === 'a5_blended' ? 'market data + estimate' : srcRev  === 'a4_fallback' ? 'financial model' : 'industry average'
  const costLabel = srcCosts === 'a4_live' ? 'financial model' : srcCosts === 'a4_blended' ? 'financial model + est.' : 'industry average'

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
            Locatalyze Engine v{C.meta.engineVersion} · Scoring v{C.meta.scoringVersion} · Computed {new Date(C.meta.computedAt).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'short', timeStyle: 'short' })} · <a href="/methodology#scoring-changelog" style={{ color: '#A8A29E' }}>methodology changelog</a>
          </p>
        </div>
      )}
    </div>
  )
}



function getDriverStatus(score: number | null | undefined): 'good' | 'watch' | 'risk' {
  const s = score ?? 0
  if (s >= 75) return 'good'
  if (s >= 55) return 'watch'
  return 'risk'
}

function driverStatusTone(status: 'good' | 'watch' | 'risk') {
  if (status === 'good') return { color: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr, label: 'Good' }
  if (status === 'watch') return { color: S.amber, bg: S.amberBg, border: S.amberBdr, label: 'Watch' }
  return { color: S.red, bg: S.redBg, border: S.redBdr, label: 'Risk' }
}

function driverOneLine(label: 'Rent' | 'Competition' | 'Demand' | 'Profitability', status: 'good' | 'watch' | 'risk') {
  if (label === 'Rent') return status === 'good' ? 'Rent load is within a healthy operating band.' : status === 'watch' ? 'Rent is workable but compresses margin buffer.' : 'Rent burden is likely to stress unit economics.'
  if (label === 'Competition') return status === 'good' ? 'Competitive density is manageable for entry.' : status === 'watch' ? 'Competition requires clear differentiation.' : 'Market saturation is a major pressure point.'
  if (label === 'Demand') return status === 'good' ? 'Demand signals support baseline throughput assumptions.' : status === 'watch' ? 'Demand supports a cautious base-case only.' : 'Demand signals are weak for this model.'
  return status === 'good' ? 'Projected profit supports viable operation.' : status === 'watch' ? 'Profitability is thin and execution-sensitive.' : 'Projected profitability is currently unattractive.'
}


function KeyDriversGrid({
  drivers,
}: {
  drivers: Array<{ label: 'Rent' | 'Competition' | 'Demand' | 'Profitability'; score: number | null }>
}) {
  return (
    <Card style={{ marginBottom: 18 }}>
      <SectionHeading>Key Drivers</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {drivers.map((d) => {
          const status = getDriverStatus(d.score)
          const tone = driverStatusTone(status)
          const score = d.score ?? 0
          return (
            <div key={d.label} style={{ border: '1px solid rgba(28,25,23,0.08)', borderRadius: 12, padding: '13px 13px 12px', background: '#FFFEFD', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: S.n800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.label}</p>
                <span style={{ fontSize: 10, fontWeight: 800, color: tone.color, background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 999, padding: '3px 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tone.label}</span>
              </div>
              <div style={{ height: 7, background: S.n100, borderRadius: 999, overflow: 'hidden', marginBottom: 9 }}>
                <div style={{ width: `${Math.max(0, Math.min(100, score))}%`, height: '100%', background: tone.color, boxShadow: '0 0 8px rgba(0,0,0,0.06)' }} />
              </div>
              <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.55 }}>{driverOneLine(d.label, status)}</p>
            </div>
          )
        })}
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
  if (C.breakEvenDaily != null) mustBeTrue.push(`Average ${C.breakEvenDaily}+ customers per day from month 3 onward`)
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

function ScoreBar({ label, score, weight, estimated, estimatedReason }: { label: string; score: number | null; weight: string; estimated?: boolean; estimatedReason?: string }) {
  const s = score ?? 0
  const color = estimated ? S.amber : scoreColor(s)
  const explain = SCORE_EXPLANATIONS[label]?.(s) ?? ''
  const tier = s >= 70 ? 'Strong' : s >= 45 ? 'Moderate' : 'Weak'

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: S.n700, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 11, color: S.n400 }}>{weight}</span>
          {estimated && (
            <span style={{ fontSize: 10, fontWeight: 700, color: S.amber, background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 4, padding: '1px 5px', letterSpacing: '0.04em' }}>EST.</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, padding: '2px 8px', background: `${color}12`, borderRadius: 6 }}>{estimated ? 'Estimated' : tier}</span>
          <span style={{ fontSize: 14, fontWeight: 900, color, fontFamily: S.mono }}>{s}</span>
        </div>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${s}%`, background: color, borderRadius: 100, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      {/* Always-visible explanation, or estimated reason when data is missing */}
      <p style={{ fontSize: 12, color: estimated ? '#92400E' : S.n500, lineHeight: 1.5 }}>
        {estimated && estimatedReason ? `Warning ${estimatedReason}` : explain}
      </p>
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



// ═══════════════════════════════════════════════════════════════════════════════
// SCORE LEVER EXPLANATION — what drives each score up/down, biggest lever
// ═══════════════════════════════════════════════════════════════════════════════
function ScoreLeverPanel({
  report, computed,
}: {
  report: Report
  computed: import('@/types/computed').ComputedResult | null
}) {
  const C = computed
  const [activeIdx, setActiveIdx] = React.useState(0)

  const bt = (report.business_type ?? 'business').toLowerCase()
  const rent = report.monthly_rent ?? 0
  const revenue = C?.revenue ?? null
  const rentPct = rent > 0 && revenue && revenue > 0 ? Math.round(rent / revenue * 100) : null
  const compCount = C?.validCompetitorCount ?? 0
  const np = C?.netProfit ?? null

  const levers: Array<{
    dimension: string
    score: number
    weight: string
    status: 'strong' | 'moderate' | 'weak'
    whatDrivesItUp: string
    whatPullsItDown: string
    biggestLever: string
  }> = [
    {
      dimension: 'Rent Affordability',
      score: report.score_rent ?? 0,
      weight: '20%',
      status: (report.score_rent ?? 0) >= 70 ? 'strong' : (report.score_rent ?? 0) >= 45 ? 'moderate' : 'weak',
      whatDrivesItUp: `Lower rent, higher revenue, or both. For a ${bt}, rent below 12% of monthly revenue produces a strong score. At ${rentPct != null ? rentPct + '%' : 'the current ratio'}, ${rentPct != null && rentPct <= 12 ? 'you are already in the strong zone' : 'negotiate rent down or increase average ticket size'}.`,
      whatPullsItDown: `Rent rising at renewal, or revenue falling below forecast. A 10% revenue drop moves rent-to-revenue up by 1–2 percentage points. At the margin, this matters.`,
      biggestLever: rent > 0
        ? `Negotiate rent. Every $500/month reduction in rent improves this score by ~3–5 points and directly improves net profit.`
        : `Submit an actual rent figure — this score is estimated from the area median and may not reflect your specific property.`,
    },
    {
      dimension: 'Competition',
      score: report.score_competition ?? 0,
      weight: '25%',
      status: (report.score_competition ?? 0) >= 70 ? 'strong' : (report.score_competition ?? 0) >= 45 ? 'moderate' : 'weak',
      whatDrivesItUp: `Fewer direct competitors, or lower-quality existing operators. ${compCount <= 5 ? `At ${Math.round(compCount)} competitors, you are already in a favourable position.` : `The ${Math.round(compCount)} existing operators are pulling this score down.`}`,
      whatPullsItDown: `More competitors, especially well-reviewed ones. Every new ${bt} within your catchment reduces your addressable customer base.`,
      biggestLever: compCount > 8
        ? `Consider a slightly different location — even 500m can mean 2–3 fewer competitors and a meaningfully different score.`
        : `Verify competitor count manually on Google Maps. If the automated count is too high, re-running the analysis with a more specific business type can refine it.`,
    },
    {
      dimension: 'Market Demand',
      score: C?.scores?.demand ?? report.score_demand ?? 0,
      weight: '20%',
      status: (C?.scores?.demand ?? report.score_demand ?? 0) >= 70 ? 'strong' : (C?.scores?.demand ?? report.score_demand ?? 0) >= 45 ? 'moderate' : 'weak',
      whatDrivesItUp: `Growing search volume for your business type, high population density, strong transit access, and upward income trends in the area.`,
      whatPullsItDown: `Declining search trend, low population density, or a demographic profile that doesn't match your target customer.`,
      biggestLever: `Check the Market tab for demand trend direction. A growing trend adds significant credibility to revenue projections — a declining one is a hard signal to ignore.`,
    },
    {
      dimension: 'Profitability',
      score: np != null ? (np > 5000 ? 85 : np > 2000 ? 70 : np > 0 ? 55 : np > -2000 ? 35 : 15) : 50,
      weight: '25%',
      status: np != null ? (np > 2000 ? 'strong' : np > 0 ? 'moderate' : 'weak') : 'moderate',
      whatDrivesItUp: `Higher revenue (more customers or higher average ticket), lower costs (rent, staff, COGS), or both. This is the single highest-weighted dimension.`,
      whatPullsItDown: `Revenue below break-even, high rent, or high staffing costs relative to throughput. Benchmark estimates make this less reliable when live revenue data is unavailable.`,
      biggestLever: np != null && np < 0
        ? `The model projects a loss — revenue needs to increase or costs need to decrease before this score can improve. Focus on the Financials tab What-If sliders.`
        : `Average ticket size is the most controllable lever. Increasing it by 10–15% typically adds $3,000–8,000/month net profit without adding a single customer.`,
    },
    {
      dimension: 'Location Quality',
      score: report.score_cost ?? 0,
      weight: '10%',
      status: (report.score_cost ?? 0) >= 70 ? 'strong' : (report.score_cost ?? 0) >= 45 ? 'moderate' : 'weak',
      whatDrivesItUp: `Main road frontage, nearby train/tram stops, anchor tenants (supermarkets, pharmacies), and high residential density within 500m.`,
      whatPullsItDown: `Side street location, no public transit, or no nearby anchor tenants that draw regular foot traffic.`,
      biggestLever: `This dimension has the lowest weight (10%). A weak location score rarely changes a verdict on its own — but high foot traffic genuinely reduces your marketing cost to acquire each customer.`,
    },
  ]

  const active = levers[activeIdx]
  const activeColor = active.status === 'strong' ? S.emerald : active.status === 'moderate' ? S.amber : S.red

  return (
    <Card>
      <SectionHeading badge="engine" sub="Understand what moves each score — and the single biggest lever to improve your result.">
        Score Levers
      </SectionHeading>

      {/* Dimension selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 16 }}>
        {levers.map((l, i) => {
          const col = l.status === 'strong' ? S.emerald : l.status === 'moderate' ? S.amber : S.red
          const isActive = i === activeIdx
          return (
            <button
              key={l.dimension}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${isActive ? col : S.n200}`,
                background: isActive ? `${col}12` : S.white, cursor: 'pointer',
                fontFamily: S.font, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: col }} />
              <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? col : S.n700 }}>
                {l.dimension}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: col, fontFamily: S.mono }}>{l.score}</span>
            </button>
          )
        })}
      </div>

      {/* Active dimension detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: S.emerald, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>What drives it up</p>
          <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.65 }}>{active.whatDrivesItUp}</p>
        </div>
        <div style={{ padding: '12px 14px', background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: S.red, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>What pulls it down</p>
          <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.65 }}>{active.whatPullsItDown}</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderLeft: `3px solid #0EA5E9`, borderRadius: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 5 }}>Biggest lever</p>
        <p style={{ fontSize: 13, color: '#0C4A6E', lineHeight: 1.65 }}>{active.biggestLever}</p>
      </div>
    </Card>
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
    { label: 'Business type', value: report.business_type || 'Not specified' },
    { label: 'Address', value: report.location_name || 'Not specified' },
    { label: 'Monthly rent (input)', value: fmt(report.monthly_rent) },
    { label: 'Avg ticket size', value: fmt(fin.avgTicketSize) },
    { label: 'Est. daily customers', value: report.breakeven_daily != null ? `${report.breakeven_daily} / day` : 'Not available' },
    { label: 'Monthly revenue', value: fmt(fin.monthlyRevenue) },
    { label: 'Profit margin', value: fin.profitMargin != null ? `${fin.profitMargin}%` : 'Not available' },
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
              This model uses live data from OpenStreetMap and ABS 2021 Census. Financial projections are benchmark estimates calibrated to your inputs — use them to shortlist and pressure-test the economics, then validate on site before signing.
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
          <div style={{ fontSize: 24, marginBottom: 10 }}>Locked</div>
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

      if (data && data.user_id && userId && data.user_id !== userId && data.is_public !== true) {
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
    const a2raw  = (parsed.a2?.outputs  || parsed.a2 || parsed.a2_data || parsed.agentOutputs?.a2 || parsed.rentData) ?? {}
    const a2out  = (a2raw?.outputs || a2raw) ?? {}
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

    const top3FromA2 = Array.isArray(a2out.top_3_recommendations) ? a2out.top_3_recommendations : []
    const pricesForFallback: number[] = Array.isArray(a2out.median_rent?.all_monthly_prices)
      ? (a2out.median_rent.all_monthly_prices as any[]).map((v) => Number(v)).filter((v) => Number.isFinite(v) && v > 0)
      : []
    const synthesizedTop3 = pricesForFallback.slice(0, 3).map((monthly, idx) => ({
      rank: idx + 1,
      address: `${parsed.locality ?? parsed.area ?? parsed.city ?? 'Area'} market comparable ${idx + 1}`,
      price_monthly: Math.round(monthly),
      price_annual: Math.round(monthly * 12),
      price_display: `A$${Math.round(monthly).toLocaleString('en-AU')} / month (comparable)`,
      sqm: null,
      price_per_sqm_pa: null,
      vs_area_median: null,
      within_budget: false,
      size_verdict: 'Comparable',
      listing_url: null,
      maps_url: null,
      score: 60 - idx * 5,
      snippet: 'Generated from A2 market comparables when exact listing cards were unavailable.',
    }))
    const top3Unified = top3FromA2.length > 0 ? top3FromA2 : synthesizedTop3

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
        topListing:      (top3Unified ?? [])[0] ?? null,
        topListings:     top3Unified,
        top3Note:        a2out.top_3_note ?? null,
        withinBudgetCount: Number(a2out.within_budget_count ?? 0) || 0,
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
  const searchParams = useSearchParams()
  const { report, loading, notFound, elapsedSeconds } = useReport(reportId)
  const userPlan = useUserPlan(report?.is_unlocked ?? undefined)
  const [activeTab, setActiveTab] = useState('overview')
  const debugDataSync = searchParams.get('debug') === '1'
  const [assumptionPreview, setAssumptionPreview] = useState<ComputedResult | null>(null)
  const [assumptionLoading, setAssumptionLoading] = useState(false)
  const [assumptionError, setAssumptionError] = useState<string | null>(null)
  const [assumptionInputs, setAssumptionInputs] = useState({ rent: '', ticket: '', staffing: '100' })

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
      const inData = safeInputData(report.input_data)
      setAssumptionInputs({
        rent: String(report.monthly_rent ?? inData.monthlyRent ?? inData.monthly_rent ?? ''),
        ticket: String(inData.avgTicketSize ?? inData.avg_ticket_size ?? ''),
        staffing: '100',
      })
      setAssumptionPreview(null)
      setAssumptionError(null)
    }
  }, [report?.is_saved, report?.location_status, report?.monthly_rent, report?.input_data])

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
    const reportId = report.report_id ?? report.id
    await fetch(`/api/reports/${reportId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proceeded, accuracy: feedbackAccuracy, notes: feedbackNotes }),
    })
    await fetch(`/api/reports/${reportId}/outcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        survivalStatus: proceeded ? 'operating' : 'unknown',
        notes: feedbackNotes,
        submissionConfidence: feedbackAccuracy,
      }),
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

  const runAssumptionPreview = async () => {
    if (!report || assumptionLoading) return
    setAssumptionLoading(true)
    setAssumptionError(null)
    try {
      const payload = {
        rent: Number(assumptionInputs.rent),
        avgTicketSize: Number(assumptionInputs.ticket),
        staffingPercent: Number(assumptionInputs.staffing || '100'),
      }
      const res = await fetch(`/api/reports/${report.report_id ?? report.id}/assumptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data?.computedResult) {
        throw new Error(data?.error || 'Could not apply assumptions')
      }
      setAssumptionPreview(data.computedResult as ComputedResult)
    } catch (err: any) {
      setAssumptionError(err?.message || 'Could not apply assumptions')
      setAssumptionPreview(null)
    } finally {
      setAssumptionLoading(false)
    }
  }

  const resetAssumptionPreview = () => {
    setAssumptionPreview(null)
    setAssumptionError(null)
    if (!report) return
    const inData = safeInputData(report.input_data)
    setAssumptionInputs({
      rent: String(report.monthly_rent ?? inData.monthlyRent ?? inData.monthly_rent ?? ''),
      ticket: String(inData.avgTicketSize ?? inData.avg_ticket_size ?? ''),
      staffing: '100',
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

    // ── Progress ring constants ──────────────────────────────────────────────
    const RING_R   = 54
    const RING_C   = 2 * Math.PI * RING_R
    const ringOffset = RING_C - (displayPct / 100) * RING_C

    // ── 5 milestone markers (horizontal timeline) ───────────────────────────
    const MILESTONES = [
      { label: 'Address',     pct: 28 },
      { label: 'Competitors', pct: 43 },
      { label: 'Market',      pct: 57 },
      { label: 'Financials',  pct: 71 },
      { label: 'Report',      pct: 85 },
    ]

    // ── Dynamic ETA ─────────────────────────────────────────────────────────
    const remaining = Math.max(0, 90 - elapsedSeconds)
    const etaLabel  = elapsedSeconds < 10  ? 'About 90 seconds'
                    : elapsedSeconds < 25  ? `About ${Math.ceil(remaining / 10) * 10} seconds`
                    : elapsedSeconds < 60  ? `About ${Math.max(5, Math.ceil(remaining / 5) * 5)} seconds`
                    : elapsedSeconds < 80  ? 'Almost there…'
                    : elapsedSeconds < 100 ? 'Wrapping up…'
                    : 'Still running — nearly done'

    // ── Rotating discovery chips ─────────────────────────────────────────────
    const DISCOVERIES = [
      'Scanning Google Places for competitors…',
      'Loading ABS 2021 census demographics…',
      'Fetching commercial rent benchmarks…',
      'Running IBISWorld cost model…',
      'Calculating daily break-even threshold…',
      'Mapping 500m competitor radius…',
      'Calibrating revenue scenarios…',
    ]
    const discoveryIdx = Math.floor(elapsedSeconds / 5) % DISCOVERIES.length
    const bizLabel     = report?.business_type ?? 'Business'
    const addrLabel    = report?.address ?? report?.location_name ?? ''

    return (
      <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <style>{`
          @keyframes spin      { to { transform:rotate(360deg) } }
          @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.35} }
          @keyframes fadeUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
          @keyframes chipFade  { 0%{opacity:0;transform:translateY(4px)} 15%,85%{opacity:1;transform:none} 100%{opacity:0;transform:translateY(-4px)} }
          @keyframes ringGlow  { 0%,100%{filter:drop-shadow(0 0 6px rgba(20,184,166,0.4))} 50%{filter:drop-shadow(0 0 14px rgba(20,184,166,0.7))} }
        `}</style>

        <div style={{ textAlign: 'center', maxWidth: 460, width: '100%', padding: '48px 24px', animation: 'fadeUp 0.5s ease' }}>

          {isFailed ? (
            <>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Analysis failed</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>{report?.progress_step || 'The analysis engine could not be reached. Please try again.'}</p>
              <button onClick={() => window.history.back()} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>Try again</button>
            </>
          ) : (
            <>
              {/* ── Address chip ─────────────────────────────── */}
              {addrLabel && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', marginBottom: 28 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={S.brandLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.01em', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {bizLabel}{addrLabel ? ` · ${addrLabel}` : ''}
                  </span>
                </div>
              )}

              {/* ── Circular progress ring ───────────────────── */}
              <div style={{ position: 'relative', width: 148, height: 148, margin: '0 auto 28px' }}>
                {/* Outer glow ring */}
                <svg width="148" height="148" viewBox="0 0 148 148" style={{ position: 'absolute', inset: 0, animation: 'ringGlow 2.5s ease infinite' }}>
                  <circle cx="74" cy="74" r={RING_R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
                  <circle cx="74" cy="74" r={RING_R} fill="none"
                    stroke={`url(#ringGrad)`} strokeWidth="7"
                    strokeDasharray={RING_C}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 74 74)"
                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0F766E"/>
                      <stop offset="100%" stopColor="#5EEAD4"/>
                    </linearGradient>
                  </defs>
                </svg>
                {/* Inner spinner */}
                <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.04)', borderTopColor: 'rgba(20,184,166,0.3)', animation: 'spin 2s linear infinite' }} />
                {/* Percentage */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 30, fontWeight: 900, color: S.white, lineHeight: 1, fontVariantNumeric: 'tabular-nums' as const, transition: 'all 0.4s ease' }}>{displayPct}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontWeight: 600 }}>%</span>
                </div>
              </div>

              {/* ── Title + active step ──────────────────────── */}
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 6 }}>
                Building your report
              </h2>
              <p style={{ fontSize: 13, color: S.brandLight, marginBottom: 6, fontWeight: 600, minHeight: 20 }}>
                {STEPS.find((_, i) => i === activeIdx)?.label ?? 'Processing…'}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 28, animation: 'pulse 3s ease infinite' }}>
                {etaLabel}
              </p>

              {/* ── 5-milestone horizontal tracker ──────────── */}
              <div style={{ position: 'relative', marginBottom: 28, padding: '0 8px' }}>
                {/* connector line */}
                <div style={{ position: 'absolute', top: 7, left: '8%', right: '8%', height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: `linear-gradient(90deg,${S.brand},${S.brandLight})`, borderRadius: 2, width: `${Math.min(100, Math.max(0, (displayPct - 28) / (85 - 28) * 100))}%`, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {MILESTONES.map((m) => {
                    const done   = displayPct >= m.pct
                    const active = displayPct >= m.pct - 14 && displayPct < m.pct
                    return (
                      <div key={m.label} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', border: `2px solid ${done ? S.emerald : active ? S.brandLight : 'rgba(255,255,255,0.15)'}`,
                          background: done ? S.emerald : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.5s ease', flexShrink: 0,
                        }}>
                          {done && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><polyline points="1,4 3,6.5 7,1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{ fontSize: 9, fontWeight: done ? 700 : 500, color: done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                          {m.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Step list (compact) ──────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, textAlign: 'left', marginBottom: 20 }}>
                {STEPS.filter(s => s.key !== 'Queued').map((step) => {
                  const stepIdx  = STEPS.findIndex(s2 => s2.key === step.key)
                  const isDone   = activeIdx > stepIdx
                  const isActive = activeIdx === stepIdx
                  return (
                    <div key={step.key} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 8,
                      background: isActive ? 'rgba(20,184,166,0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(20,184,166,0.2)' : '1px solid transparent',
                      transition: 'all 0.4s ease',
                    }}>
                      <div style={{ flexShrink: 0, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isDone ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill={S.emerald}/><polyline points="3,7 6,10 11,4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        ) : isActive ? (
                          <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: S.brandLight, animation: 'spin 0.75s linear infinite' }} />
                        ) : (
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: 'auto' }} />
                        )}
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: isActive ? 700 : isDone ? 500 : 400, color: isActive ? S.brandLight : isDone ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.15)', flex: 1 }}>
                        {step.label}
                      </span>
                      {isDone && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="rgba(5,150,105,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* ── Discovery chip ───────────────────────────── */}
              <div key={discoveryIdx} style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', animation: 'chipFade 5s ease forwards' }}>
                  {DISCOVERIES[discoveryIdx]}
                </span>
              </div>

              {/* ── Timeout warning ──────────────────────────── */}
              {isStuck && (
                <div style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, fontSize: 12, color: '#FCD34D', lineHeight: 1.7, textAlign: 'left', animation: 'fadeUp 0.5s ease' }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Still processing…</div>
                  You can leave this page — your report will be ready at this URL when complete.
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button onClick={() => window.location.reload()} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Refresh</button>
                    <button onClick={() => { window.location.href = '/dashboard' }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Back to dashboard</button>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                Live · {elapsedSeconds}s elapsed
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

  if (!report.computed_result) {
    return (
      <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <div style={{ maxWidth: 620, background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px 30px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Compute engine data required</h2>
          <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.7, marginBottom: 16 }}>
            This report was generated before strict compute authority enforcement. To prevent UI-side or API-side number drift,
            final financial values are shown only when `computed_result` exists.
          </p>
          <p style={{ fontSize: 13, color: S.n700, marginBottom: 20 }}>
            Re-run this location analysis to generate an engine-authoritative report.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/onboarding')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: S.font }}>Run analysis again</button>
            <button onClick={() => router.push('/dashboard')} style={{ background: S.white, color: S.n700, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '10px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: S.font }}>Back to Dashboard</button>
          </div>
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
  const C: ComputedResult | null = assumptionPreview ?? report.computed_result ?? null
  const hasComputed = C !== null
  const _engineDemandScore: number | null = C?.scores?.demand ?? null

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
      projection:           C.projection,       // engine 3-year: { year1, year2|null, year3|null, suppressed }
      riskScenarios:        {},
      breakEvenMonths:      C.breakEvenMonths,
      paybackMonths:        C.breakEvenMonths,  // months to recoup setup budget (null = estimated budget)
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
      top3Note:       _rd.areaContext?.top3Note ?? null,
      withinBudgetCount: _rd.areaContext?.withinBudgetCount ?? null,
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
  const knownResultKeys = new Set([
    'competitors', 'financials', 'areaContext', 'market', 'demographics', 'location', 'scoring',
    'agent_statuses', 'raw_inputs', 'metadata', 'sources', 'warnings',
  ])
  const additionalBackendSignals = Object.entries(_rd || {})
    .filter(([k, v]) => !knownResultKeys.has(k) && v != null && (typeof v !== 'object' || Object.keys(v as any).length > 0))
    .slice(0, 12)
  const missingDisplayFields = Object.entries({
    monthly_rent: report.monthly_rent,
    gross_margin_pct: C?.grossMarginPct ?? null,
    break_even_daily: C?.breakEvenDaily ?? null,
    payback_months: C?.breakEvenMonths ?? null,
    competitor_count: C?.validCompetitorCount ?? null,
    demand_score: C?.scores?.demand ?? null,
    revenue_source: C?.meta?.computeLog?.revenueSource ?? null,
  })
    .filter(([, value]) => value == null)
    .map(([key]) => key)

  // Break-even — always read from computed_result (engine is authoritative).
  // No inline math: the engine already stores both daily and monthly values.
  const _beDaily: number | null =
    C?.breakEvenDaily
    ?? fin.customerVolume?.daily_customers_needed_breakeven
    ?? report.breakeven_daily
    ?? null

  // Break-even monthly REVENUE (not payback months).
  // = daily_customers_needed × avg_ticket × 26 trading days
  // C.breakEvenMonths is the payback period — do NOT use it here as a dollar amount.
  const _beMonthly: number | null = (() => {
    const daily  = _beDaily
    const ticket = fin.avgTicketSize ?? C?.avgTicketSize ?? null
    if (daily == null || ticket == null || ticket === 0) return null
    return Math.round(daily * ticket * 26)
  })()

  // ── Display Discipline Layer ──────────────────────────────────────────────
  // Confidence tier determines precision: exact numbers, ranges, or suppressed.
  // SAFETY CAP: if the compute engine's dataCompleteness < 45, never show exact
  // numbers — the engine may have set modelConfidence incorrectly.
  // Tier order (lowest → highest): benchmark_default < low < medium < high
  const _rawTier: ConfidenceTier = getConfidenceTier(C)
  const _confidenceTier: ConfidenceTier = (() => {
    if (!C) return 'benchmark_default'
    const dc = C.dataCompleteness ?? 100
    // Hard cap: < 45% data → force benchmark_default (ranges + "industry avg" qualifier)
    if (dc < 45) return 'benchmark_default'
    // Soft cap: < 65% data → cap at 'low' even if engine said 'medium' or 'high'
    if (dc < 65 && (_rawTier === 'medium' || _rawTier === 'high')) return 'low'
    return _rawTier
  })()
  const _financialsSuppressed = shouldSuppressFinancials(C)
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
  const _beBufferDaily: number | null =
    (_beDailyForGauge != null && _currentDailyCustomers != null)
      ? Math.round(_currentDailyCustomers - _beDailyForGauge)
      : null

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
    return match ? match[1].split(/[,.\n·]/).map(s => s.replace(/\*+/g, '').replace(/^\s*[-–]\s*/, '').trim()).filter(s => s.length > 5).slice(0, 2) : []
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
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 10, letterSpacing: '-0.03em' }}>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F6F8FF 0%, #F8FAFC 38%, #FFFFFF 100%)', fontFamily: S.font, color: S.n900 }}>
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
      <div style={{ position: 'sticky', top: 0, zIndex: 60, padding: '10px clamp(14px, 3vw, 28px) 0', backdropFilter: 'blur(10px)' }}>
        <nav style={{
          maxWidth: 1180, margin: '0 auto',
          background: `linear-gradient(120deg, ${S.topShellA} 0%, ${S.topShellB} 52%, ${S.topShellC} 100%)`,
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 14,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 14px 34px rgba(15,23,42,0.24)',
          gap: 10,
          flexWrap: 'wrap' as const,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', padding: 0 }}>
              <img src="/logo.svg" alt="Locatalyze" style={{ height: 28, width: 'auto', display: 'block' }} />
            </button>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>&#8250;</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Location Report</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <button onClick={() => router.push('/compare')} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#E2E8F0', borderRadius: 10, padding: '7px 14px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
            }}>
              Compare
            </button>

            {/* ── Save / Track button ── */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={isSaved ? () => setShowStatusMenu(v => !v) : toggleSave}
                disabled={saveLoading}
                title={isSaved ? 'Update tracking status' : 'Save this location'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: isSaved ? '#E0E7FF' : 'rgba(255,255,255,0.12)',
                  border: `1px solid ${isSaved ? '#C7D2FE' : 'rgba(255,255,255,0.2)'}`,
                  color: isSaved ? '#3730A3' : '#E2E8F0',
                  borderRadius: 10, padding: '7px 14px',
                  fontSize: 12, fontWeight: 700, cursor: saveLoading ? 'default' : 'pointer',
                  fontFamily: S.font, opacity: saveLoading ? 0.6 : 1, transition: 'all 0.15s',
                }}>
                {isSaved ? 'Location' : 'Bookmark'}
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
                    { value: 'shortlisted', label: 'Checklist Shortlisted',  desc: 'On my radar' },
                    { value: 'visited',     label: 'Visited Site visited',  desc: 'Inspected in person' },
                    { value: 'opened',      label: 'Approved Opened here',   desc: 'Business launched' },
                    { value: 'rejected',    label: 'Not suitable Not pursuing',  desc: 'Ruled out' },
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
                    <p style={{ fontSize: 12, fontWeight: 600, color: S.red }}>X Unsave</p>
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
      </div>

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
                  How did this location work out? Store
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
                    Approved Yes, I opened here
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
                <p style={{ fontSize: 13, fontWeight: 700, color: S.emerald }}>Thanks — your feedback helps calibrate our model. Thanks</p>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '38px clamp(18px, 4vw, 40px) 96px' }}>
        <div style={{
          marginBottom: 24,
          borderRadius: 18,
          padding: '18px 20px',
          background: 'linear-gradient(130deg, rgba(79,70,229,0.1) 0%, rgba(99,102,241,0.08) 45%, rgba(255,255,255,0.8) 100%)',
          border: '1px solid rgba(99,102,241,0.22)',
          boxShadow: '0 10px 28px rgba(79,70,229,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
            <div style={{ minWidth: 220, flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Locatalyze Intelligence Report</p>
              <h1 style={{ fontSize: 'clamp(22px, 3.2vw, 32px)', fontWeight: 900, color: S.n900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 8 }}>
                {report.location_name ?? report.address ?? 'Location report'}
              </h1>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.6 }}>
                {(report.business_type ?? 'Business')} feasibility report · Updated {new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px,1fr))', gap: 10, minWidth: 290 }}>
              <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Verdict</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: verdictCfg(report.verdict).text }}>{verdictCfg(report.verdict).label}</p>
              </div>
              <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Confidence</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: S.n900 }}>{String(confidence.level).toUpperCase()}</p>
              </div>
              <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Revenue / mo</p>
                <p style={{ fontSize: 14, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>{_dRevenue.display}</p>
              </div>
              <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Net / mo</p>
                <p style={{ fontSize: 14, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>{_dNetProfit.display}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 1: DECISION-FIRST LAYER ═══ */}
        <div style={{ marginBottom: 34 }}>
          <Card style={{ marginBottom: 18, border: `1px solid ${verdictCfg(report.verdict).border}`, background: `linear-gradient(180deg, ${verdictCfg(report.verdict).bg} 0%, #FFFFFF 100%)` }}>
            {(() => {
              const nv = normalizeVerdict(report.verdict)
              const vc = verdictCfg(report.verdict)
              const medianRent = C?.locationSignals?.medianRent ?? areaContext?.medianRent?.monthly ?? null
              const targetRent = medianRent ? Math.round(Number(medianRent) * 0.9) : null
              const beDaily = _beDaily ?? (fin as any).breakEvenDailyEst ?? null
              const projectedDaily = _currentDailyCustomers ?? null
              const compCount = C?.validCompetitorCount ?? competitors?.count ?? 0
              const margin = C?.grossMarginPct ?? fin?.grossMarginPct ?? null
              const action = nv === 'NO'
                ? (targetRent
                  ? `Do not sign unless rent drops below A$${targetRent.toLocaleString('en-AU')}/month.`
                  : 'Do not sign at current terms.')
                : nv === 'CAUTION'
                ? (targetRent
                  ? `Proceed only if rent is capped near A$${targetRent.toLocaleString('en-AU')}/month and break-even stays under ${beDaily ?? 'N/A'} customers/day.`
                  : `Proceed only if break-even stays under ${beDaily ?? 'N/A'} customers/day.`)
                : `Proceed now, but keep rent below 12% of monthly revenue and hold break-even near ${beDaily ?? 'N/A'} customers/day.`

              const reasons = [
                report.monthly_rent && medianRent
                  ? `Rent is ${Math.round(((report.monthly_rent - Number(medianRent)) / Number(medianRent)) * 100)}% vs local median.`
                  : null,
                compCount ? `${compCount} competitors detected within analysis radius.` : null,
                margin != null ? `Gross margin tracks at ${Math.round(Number(margin))}%.` : null,
                _dNetProfit.display ? `Projected net is ${_dNetProfit.display} per month.` : null,
              ].filter(Boolean).slice(0, 3) as string[]

              const oneLine = nv === 'NO'
                ? 'Current economics are not viable under this lease setup.'
                : nv === 'CAUTION'
                ? 'This site is viable only if key conditions are tightened before signing.'
                : 'This site is viable under the current assumptions.'

              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' as const }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: vc.text, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                      {nv === 'GO' ? 'OPEN' : nv === 'NO' ? 'DO NOT OPEN' : 'CAUTION'}
                    </p>
                    <span style={{ fontSize: 11, color: S.n500, fontWeight: 700 }}>Confidence: {String(confidence.level).toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: 16, color: S.n900, fontWeight: 800, marginBottom: 8 }}>{oneLine}</p>
                  <p style={{ fontSize: 14, color: vc.text, fontWeight: 800, marginBottom: 10 }}>{action}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {reasons.map((r, i) => (
                      <p key={i} style={{ fontSize: 12, color: S.n700, lineHeight: 1.55 }}>
                        <span style={{ color: vc.text, fontWeight: 800, marginRight: 6 }}>-</span>{r}
                      </p>
                    ))}
                  </div>
                </>
              )
            })()}
          </Card>
          <KeyDriversGrid
            drivers={[
              { label: 'Rent', score: report.score_rent },
              { label: 'Competition', score: report.score_competition },
              { label: 'Demand', score: _engineDemandScore ?? report.score_demand },
              { label: 'Profitability', score: computedScoreProfitability },
            ]}
          />
          <ReferralPrompt reportScore={report.overall_score ?? 0} verdict={report.verdict ?? ''} />

        </div>

        <div style={{ marginBottom: 16 }}>
          <ContradictionBanner computed={C} />
        </div>

        <details style={{ marginTop: 2, marginBottom: 26, background: S.white, border: '1px solid rgba(28,25,23,0.08)', borderRadius: 10, padding: '9px 11px' }}>
          <summary style={{ fontSize: 12, fontWeight: 700, color: S.n500, cursor: 'pointer' }}>Method, assumptions, and limitations</summary>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.6 }}>
              {_confidenceTier === 'benchmark_default'
                ? 'Benchmark mode is active: some numbers are directional estimates from industry averages.'
                : 'Financial projections are model-based estimates and should be validated before signing a lease.'}
            </p>
            <DataQualityHeader computed={C} report={report} />
            <DataQualitySummary computed={C} />
            <CalibrationSummary />
          </div>
        </details>
        {debugDataSync && (
          <details style={{ marginTop: -12, marginBottom: 26, background: S.white, border: '1px solid rgba(28,25,23,0.08)', borderRadius: 10, padding: '9px 11px' }}>
            <summary style={{ fontSize: 12, fontWeight: 700, color: S.n500, cursor: 'pointer' }}>
              Missing Data / Not Displayed (debug mode)
            </summary>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {additionalBackendSignals.length > 0 && additionalBackendSignals.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, fontSize: 12 }}>
                  <span style={{ color: S.n500, fontWeight: 700 }}>{k}</span>
                  <span style={{ color: S.n700, fontFamily: S.mono, wordBreak: 'break-word' }}>
                    {typeof v === 'object' ? JSON.stringify(v).slice(0, 220) : String(v)}
                  </span>
                </div>
              ))}
              {debugDataSync && (
                <div style={{ marginTop: 4, padding: '10px 12px', borderRadius: 8, background: S.n50, border: `1px solid ${S.n200}` }}>
                  <p style={{ fontSize: 12, color: S.n700, marginBottom: 6 }}>
                    Missing or currently not mapped fields: {missingDisplayFields.length > 0 ? missingDisplayFields.join(', ') : 'none'}.
                  </p>
                  <p style={{ fontSize: 12, color: S.n500 }}>
                    This data exists in backend — should it be shown in the report? (Yes/No mapping needed)
                  </p>
                </div>
              )}
            </div>
          </details>
        )}

        {/* ═══ SECTION 3: TABS ═══ */}
        <div style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(148,163,184,0.22)',
          borderRadius: 14,
          padding: 6,
          marginBottom: 28,
          boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
          position: 'sticky',
          top: 78,
          zIndex: 45,
          backdropFilter: 'blur(8px)',
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none',
                background: activeTab === t.id ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'transparent',
                color: activeTab === t.id ? S.white : S.n500,
                fontSize: 13, fontWeight: 700, letterSpacing: '0.01em', transition: 'all 0.15s',
                boxShadow: activeTab === t.id ? '0 8px 18px rgba(79,70,229,0.28)' : 'none',
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* ═══ ADJUST ASSUMPTIONS ═══ */}
        <div id="adjust-panel" style={{ marginBottom: 20 }}>
          <div style={{ background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: S.n800, marginBottom: 6 }}>Refine your numbers for a more accurate result</p>
            <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65, marginBottom: 12 }}>
              Location is locked. You can safely adjust rent, average ticket size, and staffing estimate. We re-run the compute engine using your assumptions, without changing saved report data.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 11, color: S.n500, fontWeight: 700 }}>Monthly rent (A$)</span>
                <input
                  value={assumptionInputs.rent}
                  onChange={(e) => setAssumptionInputs((p) => ({ ...p, rent: e.target.value.replace(/[^\d]/g, '') }))}
                  inputMode="numeric"
                  style={{ border: `1px solid ${S.n200}`, borderRadius: 8, padding: '8px 10px', fontSize: 13, fontFamily: S.mono }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 11, color: S.n500, fontWeight: 700 }}>Average ticket (A$)</span>
                <input
                  value={assumptionInputs.ticket}
                  onChange={(e) => setAssumptionInputs((p) => ({ ...p, ticket: e.target.value.replace(/[^\d.]/g, '') }))}
                  inputMode="decimal"
                  style={{ border: `1px solid ${S.n200}`, borderRadius: 8, padding: '8px 10px', fontSize: 13, fontFamily: S.mono }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 11, color: S.n500, fontWeight: 700 }}>Staffing estimate (%)</span>
                <input
                  value={assumptionInputs.staffing}
                  onChange={(e) => setAssumptionInputs((p) => ({ ...p, staffing: e.target.value.replace(/[^\d]/g, '') }))}
                  inputMode="numeric"
                  style={{ border: `1px solid ${S.n200}`, borderRadius: 8, padding: '8px 10px', fontSize: 13, fontFamily: S.mono }}
                />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
              <button
                onClick={runAssumptionPreview}
                disabled={assumptionLoading}
                style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: assumptionLoading ? 'wait' : 'pointer' }}
              >
                {assumptionLoading ? 'Updating preview...' : 'Apply assumptions'}
              </button>
              <button
                onClick={resetAssumptionPreview}
                disabled={assumptionLoading}
                style={{ background: S.n50, color: S.n700, border: `1px solid ${S.n200}`, borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Reset
              </button>
              {assumptionPreview && <span style={{ fontSize: 11, color: S.emerald, fontWeight: 700 }}>Preview applied</span>}
              {assumptionError && <span style={{ fontSize: 11, color: S.red, fontWeight: 700 }}>{assumptionError}</span>}
            </div>
          </div>
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Big P&L hero + top risks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Monthly financials hero */}
              <Card style={{ padding: '24px 28px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  <ExplainLabel label="Net profit / month" help="Net profit is what remains each month after rent, staff, COGS, and operating costs." />
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
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      <ExplainLabel label="Break-even" help="Break-even is the point where revenue covers all monthly costs, so profit is zero." />
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: S.n800, fontFamily: S.mono }}>
                      {(() => { const bm = _canonicalBEM; return bm && bm !== 999 ? `${bm} mo` : 'N/A' })()}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      <ExplainLabel label="Gross margin" help="Gross margin shows how much of each dollar of sales remains after direct product costs." />
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: S.emerald, fontFamily: S.mono }}>{_dMargin.display}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      <ExplainLabel label="Payback (36mo ROI)" help="Payback shows how quickly setup cost is recovered. 36-month ROI shows return after three years." />
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: fin.roiTimeline?.roi36?.startsWith('+') ? S.emerald : fin.roiTimeline?.roi36 ? S.red : S.n400, fontFamily: S.mono }}>{fin.roiTimeline?.roi36 ?? 'N/A'}</p>
                  </div>
                </div>
                {/* Provenance badges — shows data source for revenue and costs at a glance */}
                {C?.provenance && (C.provenance.revenue || C.provenance.costs) && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.n100}`, display: 'flex', flexWrap: 'wrap' as const, gap: 5, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginRight: 2 }}>Sources</span>
                    {C.provenance.revenue && (
                      <span style={{ fontSize: 10, padding: '2px 8px', background: C.provenance.revenue.isBenchmark ? S.amberBg : S.emeraldBg, border: `1px solid ${C.provenance.revenue.isBenchmark ? S.amberBdr : S.emeraldBdr}`, borderRadius: 20, color: C.provenance.revenue.isBenchmark ? S.amber : S.emerald, fontWeight: 700 }}>
                        Revenue — {C.provenance.revenue.sourceLabel}
                      </span>
                    )}
                    {C.provenance.costs && (
                      <span style={{ fontSize: 10, padding: '2px 8px', background: C.provenance.costs.isBenchmark ? S.amberBg : S.emeraldBg, border: `1px solid ${C.provenance.costs.isBenchmark ? S.amberBdr : S.emeraldBdr}`, borderRadius: 20, color: C.provenance.costs.isBenchmark ? S.amber : S.emerald, fontWeight: 700 }}>
                        Costs — {C.provenance.costs.sourceLabel}
                      </span>
                    )}
                  </div>
                )}
              </Card>

              {/* Critical risks (merged): top risks + contradictions + hidden traps */}
              <Card style={{ padding: '24px 28px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Critical Risks</p>
                {(() => {
                  const contradictionReasons = (C?.contradictions ?? []).map((c: any) => c.reason).filter(Boolean)
                  const hiddenRisk = (_beDaily != null && _currentDailyCustomers != null && _currentDailyCustomers < _beDaily)
                    ? `Demand gap: projected ${_currentDailyCustomers}/day vs break-even ${_beDaily}/day.`
                    : null
                  const mergedRisks = [
                    ...(Array.isArray(market?.topRisks) ? market.topRisks.map((risk: any) => typeof risk === 'string' ? risk : (risk.risk ?? risk.title ?? risk.description ?? String(risk))) : []),
                    ...contradictionReasons,
                    hiddenRisk,
                  ].filter(Boolean).slice(0, 5)
                  if (mergedRisks.length === 0) {
                    return <p style={{ fontSize: 13, color: S.n400 }}>No critical risks detected from current data.</p>
                  }
                  return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {mergedRisks.map((label: string, i: number) => {
                      const isHigh = i < 2
                      return (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: isHigh ? S.redBg : S.amberBg, borderRadius: 9, border: `1px solid ${isHigh ? S.redBdr : S.amberBdr}` }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: isHigh ? S.red : S.amber, marginTop: 5, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, color: isHigh ? '#991B1B' : '#92400E', lineHeight: 1.5, fontWeight: 500 }}>{label}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  )
                })()}
              </Card>
            </div>

            {(areaContext?.medianRent || areaContext?.topListings?.length > 0) && (
              <Card style={{ padding: '22px 24px', border: `1px solid ${S.n200}`, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' as const }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    A2 Rent Intelligence
                  </p>
                  {areaContext?.medianRent?.median_source && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: S.n500 }}>
                      Source: {String(areaContext.medianRent.median_source).replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, marginBottom: 14 }}>
                  <Tile
                    label="Median monthly rent"
                    value={areaContext?.medianRent?.monthly != null ? `A$${Number(areaContext.medianRent.monthly).toLocaleString('en-AU')}` : 'N/A'}
                    mono
                    color={S.brand}
                  />
                  <Tile
                    label="Listings sampled"
                    value={areaContext?.medianRent?.listings_sampled != null ? String(areaContext.medianRent.listings_sampled) : 'N/A'}
                    mono
                  />
                  <Tile
                    label="Min monthly"
                    value={areaContext?.medianRent?.price_range?.min_monthly != null ? `A$${Number(areaContext.medianRent.price_range.min_monthly).toLocaleString('en-AU')}` : 'N/A'}
                    mono
                  />
                  <Tile
                    label="Max monthly"
                    value={areaContext?.medianRent?.price_range?.max_monthly != null ? `A$${Number(areaContext.medianRent.price_range.max_monthly).toLocaleString('en-AU')}` : 'N/A'}
                    mono
                  />
                </div>
                {areaContext?.top3Note && (
                  <p style={{ fontSize: 12, color: S.n500, marginBottom: 10, lineHeight: 1.6 }}>{areaContext.top3Note}</p>
                )}
                {areaContext?.topListings?.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                    {areaContext.topListings.slice(0, 3).map((p: any, idx: number) => (
                      <div key={idx} style={{ border: `1px solid ${S.n200}`, borderRadius: 10, padding: '10px 12px', background: S.n50 }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: S.n700, marginBottom: 4 }}>#{idx + 1} {p.address ?? 'Comparable listing'}</p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: S.n900, fontFamily: S.mono }}>
                          {p.price_monthly != null ? `A$${Number(p.price_monthly).toLocaleString('en-AU')}/mo` : p.price_display ?? 'Price unavailable'}
                        </p>
                        <p style={{ fontSize: 11, color: S.n500, marginTop: 4, lineHeight: 1.5 }}>
                          {p.snippet ? String(p.snippet).slice(0, 100) : 'Closest market comparable from A2.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

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
                  <ScoreBar label="Rent Affordability" score={report.score_rent} weight="20%"
                    estimated={!report.monthly_rent || report.monthly_rent === 0}
                    estimatedReason="No rent submitted — score estimated from area median rent"
                  />
                  <ScoreBar label="Competition" score={report.score_competition} weight="25%"
                    estimated={_rd.competitors?.dataQuality === 'estimated_fallback' || _rd.competitors?.dataQuality === 'no_data'}
                    estimatedReason="Live competitor data unavailable — score estimated from area averages"
                  />
                  <ScoreBar
                    label="Market Demand"
                    score={_engineDemandScore ?? report.score_demand}
                    weight="20%"
                    estimated={_engineDemandScore == null || _rd.demographics?.dataQuality?.includes('abs_state_default') || (_confidenceTier === 'benchmark_default' && !_rd.demographics?.medianIncome)}
                    estimatedReason={_engineDemandScore == null ? 'No demand data returned by A3 agent — score is unavailable' : 'Market demand data is from area averages — not verified against this specific location'}
                  />
                  <ScoreBar label="Profitability" score={computedScoreProfitability} weight="25%"
                    estimated={_confidenceTier === 'benchmark_default'}
                    estimatedReason="Revenue is from industry benchmarks — not verified against this address"
                  />
                  <ScoreBar label="Location Quality" score={report.score_cost ?? 0} weight="10%"
                    estimated={!_rd.location?.footfallSignal}
                    estimatedReason="Location signals (footfall, transit) are estimated from area patterns"
                  />
                </div>
                <RadarChart color={vc.text} scores={[
                  { label: 'Rent', value: report.score_rent ?? 0 },
                  { label: 'Profitability', value: computedScoreProfitability },
                  { label: 'Competition', value: report.score_competition ?? 0 },
                  { label: 'Demand', value: _engineDemandScore ?? report.score_demand ?? 0 },
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

            {/* Score Levers — what moves each dimension up or down */}
            <ScoreLeverPanel report={report} computed={C} />

            <Card>
              <SectionHeading sub="Merged view of market narrative and SWOT signals.">Market Outlook</SectionHeading>
              {(() => {
                const swotItems = swotKeys.flatMap(k => parseSwot(k, swotKeys).slice(0, 2))
                const marketItems = [
                  market?.demandTrend ? `Demand trend: ${market.demandTrend}` : null,
                  market?.marketVerdict ? `Market verdict: ${market.marketVerdict}` : null,
                  market?.bestEntryTiming ? `Best entry timing: ${market.bestEntryTiming}` : null,
                  ...(Array.isArray(market?.topOpportunities) ? market.topOpportunities.map((o: any) => typeof o === 'string' ? o : (o.opportunity ?? o.title ?? o.description ?? String(o))) : []),
                  ...swotItems,
                ].filter(Boolean).slice(0, 5)
                if (marketItems.length === 0) return <p style={{ fontSize: 13, color: S.n500 }}>Market outlook not available for this report yet.</p>
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {marketItems.map((item, i) => (
                      <p key={i} style={{ fontSize: 13, color: S.n700, lineHeight: 1.6 }}>
                        <span style={{ color: S.brand, fontWeight: 800, marginRight: 6 }}>-</span>{item}
                      </p>
                    ))}
                  </div>
                )
              })()}
            </Card>

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
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Check What's modelled</p>
                  {[
                    'Competitor density within your business-type catchment radius',
                    'Rent-to-revenue ratio and break-even timeline',
                    'Foot traffic signals from transit nodes and anchor tenants',
                    'Market demand trends from search and population data',
                    'Demographics — median income, population age mix',
                    'Scenario modelling: worst / base / optimistic revenue',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: S.emerald, fontSize: 12, flexShrink: 0, marginTop: 1 }}>Check</span>
                      <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '18px 22px' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>X What's not modelled</p>
                  {[
                    { item: 'Lease negotiation outcomes', note: 'Incentives, fit-out contributions, and rent reviews are between you and the landlord' },
                    { item: 'Tenancy mix and anchor changes', note: 'Future tenant departures or new anchors can shift foot traffic significantly' },
                    { item: 'Pending developments', note: 'Approved DA projects, rezoning, or new competitor openings are not captured' },
                    { item: 'Access and visibility specifics', note: 'Street-level signage, car parking, and disabled access require an on-site visit' },
                    { item: 'Operator execution', note: 'Staff quality, product-market fit, and marketing are not factored into projections' },
                  ].map(({ item, note }) => (
                    <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <span style={{ color: S.amber, fontSize: 12, flexShrink: 0, marginTop: 1 }}>X</span>
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
                    <Tile key="other" label="Other Business Types" value={String(_exc)} sub={`nearby non-${_bt} businesses (shown on map but excluded from score)`} color={S.n400} mono />
                    <Tile key="sat" label="Saturation" value={_sat} color={_satColor} sub={`based on ${_vc} direct competitors`} mono />
                    <Tile key="threat" label="Threat Level" value={_vc === 0 ? 'Low' : (market?.competitorThreat ?? (_sat === 'HIGH' ? 'High' : _sat === 'MEDIUM' ? 'Medium' : 'Low'))} color={_vc === 0 ? S.emerald : (_sat === 'HIGH' ? S.red : _sat === 'MEDIUM' ? S.amber : S.emerald)} mono />
                  </div>
                  {_exc > 0 && (
                    <p style={{ fontSize: 11, color: S.n400, fontStyle: 'italic', marginTop: 4 }}>
                      Note: The map shows all {_dc + _exc} nearby businesses. This section counts only the {_dc} direct {_bt} competitors — the {_exc} other business types are shown on the map for context but excluded from the competition score.
                    </p>
                  )}
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

            {/* Winning angle (merged): opportunity gaps + differentiation */}
            {(competitors?.opportunity_gaps?.length > 0 || competitors?.differentiation_suggestions?.length > 0) && (
              <Card>
                <SectionHeading sub="The clearest ways to win in this market.">Winning Angle</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                  {[
                    ...(competitors?.opportunity_gaps ?? []),
                    ...(competitors?.differentiation_suggestions ?? []),
                  ].filter(Boolean).slice(0, 5).map((tip: string, i: number) => (
                    <div key={i} style={{ padding: '12px 14px', background: i < 2 ? S.brandFaded : S.n50, borderRadius: 10, border: `1px solid ${i < 2 ? S.brandBorder : S.n200}`, display: 'flex', gap: 10 }}>
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
                  <Tile label="Median Monthly Rent" value={areaContext.medianRent.monthly != null ? `A$${(areaContext.medianRent.monthly).toLocaleString()}` : 'Not available'} mono color={S.brand} />
                  <Tile label="Range (Low)" value={areaContext.medianRent.price_range?.min_monthly != null ? `A$${areaContext.medianRent.price_range.min_monthly.toLocaleString()}` : 'Not available'} mono />
                  <Tile label="Range (High)" value={areaContext.medianRent.price_range?.max_monthly != null ? `A$${areaContext.medianRent.price_range.max_monthly.toLocaleString()}` : 'Not available'} mono color={S.red} />
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
                    const _resolvedThreat = _validCompCount === 0 ? 'Low (0 direct)' : (market.competitorThreat ?? 'N/A')
                    const _threatColor = _validCompCount === 0 ? S.emerald
                      : (market.competitorThreat === 'High' ? S.red : market.competitorThreat === 'Low' ? S.emerald : S.amber)
                    return [
                      { label: 'Demand Trend', value: market.demandTrend ?? 'N/A', color: market.demandTrend === 'Rising' ? S.emerald : market.demandTrend === 'Declining' ? S.red : S.amber },
                      { label: 'Market Maturity', value: market.marketMaturity ?? 'N/A', color: S.n800 },
                      { label: 'Best Entry Timing', value: market.bestEntryTiming ?? 'N/A', color: market.bestEntryTiming === 'Immediate' ? S.emerald : S.amber },
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
                        Benchmark estimates calibrated to comparable locations — validate key assumptions on site.
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
                            {ceiling ? displayMoney(ceiling, _confidenceTier).display : ticket ? '—' : 'Need ticket'}
                          </p>
                          <p style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>{Math.round(util * 100)}% util · {turns} turns/day</p>
                          <ConfLine conf={ceilConf} />
                        </div>
                        <div style={{ padding: '12px 14px', background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}` }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Projected Revenue</p>
                          <p style={{ fontSize: 18, fontWeight: 700, color: S.n900, fontFamily: S.mono }}>
                            {projected ? displayMoney(projected, _confidenceTier).display : '—'}
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
                      <span style={{ fontSize: 14, flexShrink: 0 }}>Warning</span>
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
                <Tile label="% of Revenue" value={fin.rent?.toRevenuePercent != null ? displayPercent(fin.rent.toRevenuePercent, _confidenceTier).display : 'Not available'} color={fin.rent?.toRevenuePercent == null ? S.n400 : (fin.rent.toRevenuePercent <= 12 ? S.emerald : fin.rent.toRevenuePercent <= 20 ? S.amber : S.red)} mono />
                <Tile label="Rating" value={fin.rent?.label ?? 'N/A'} color={fin.rent?.label === 'EXCELLENT' ? S.emerald : fin.rent?.label === 'GOOD' ? S.blue : fin.rent?.label === 'MARGINAL' ? S.amber : fin.rent?.label ? S.red : S.n400} />
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{report.rent_analysis}</p>
            </Card>

            <Card>
              <SectionHeading badge="engine">Break-even Analysis</SectionHeading>
              {/* Single canonical break-even values — _beDailyForGauge = required, _currentDailyCustomers = projected */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  <Tile label="Break-even / Day" value={_beDailyForGauge != null ? `${displayCustomers(_beDailyForGauge, _confidenceTier).display} cust.` : 'Not available'} mono sub="customers needed" />
                  <Tile label="Projected / Day" value={_currentDailyCustomers != null ? `${_dCustomers.display} cust.` : 'Not available'} mono sub="at base demand" color={(_currentDailyCustomers ?? 0) >= (_beDailyForGauge ?? Infinity) ? S.emerald : S.red} />
                  <Tile
                    label="Buffer / Day"
                    value={_beBufferDaily != null ? `${_beBufferDaily > 0 ? '+' : ''}${_beBufferDaily} cust.` : 'Not available'}
                    mono
                    sub="projected minus break-even"
                    color={_beBufferDaily == null ? S.n400 : _beBufferDaily >= 0 ? S.emerald : S.red}
                  />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>Projected vs Break-even</p>
                  <BreakevenGauge daily={_currentDailyCustomers} breakeven={_beDailyForGauge} />
                </div>
              </div>
              <div style={{ marginBottom: 14, padding: '10px 12px', background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.6 }}>
                  Break-even summary: needs <strong>{_beDailyForGauge != null ? `${displayCustomers(_beDailyForGauge, _confidenceTier).display}` : 'N/A'}</strong> customers/day, projects <strong>{_currentDailyCustomers != null ? _dCustomers.display : 'N/A'}</strong>/day,
                  buffer <strong>{_beBufferDaily != null ? `${_beBufferDaily > 0 ? '+' : ''}${_beBufferDaily}` : 'N/A'}</strong> customers/day.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12 }}>
                <Tile label="Revenue / Month to Break-even" value={_beMonthly != null ? displayMoney(_beMonthly, _confidenceTier).display : 'Not available'} mono sub="estimated break-even revenue" />
                <Tile
                  label="Setup Payback"
                  value={fin.paybackMonths != null ? `${fin.paybackMonths} mo` : fin.breakEvenMonths != null ? `${fin.breakEvenMonths} mo` : _inputData?.setupBudgetIsEstimated ? 'Est. budget' : 'Not available'}
                  mono
                  sub={fin.paybackMonths != null || fin.breakEvenMonths != null ? 'months to recoup setup cost' : _inputData?.setupBudgetIsEstimated ? 'payback suppressed — setup budget was estimated' : 'setup budget not provided'}
                  color={fin.paybackMonths != null ? (fin.paybackMonths <= 18 ? S.emerald : fin.paybackMonths <= 36 ? S.amber : S.red) : S.n400}
                />
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: S.n700, marginBottom: 8 }}>Financial Verdict</p>
              <div style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${(displayNetProfit ?? 0) >= 0 ? S.emeraldBdr : S.redBdr}`, background: (displayNetProfit ?? 0) >= 0 ? S.emeraldBg : S.redBg, marginBottom: 14 }}>
                <p style={{ fontSize: 13, color: (displayNetProfit ?? 0) >= 0 ? '#065F46' : '#991B1B', lineHeight: 1.6 }}>
                  {(displayNetProfit ?? 0) >= 0
                    ? 'Financially viable under current assumptions, but validate assumptions with local trading data before signing.'
                    : 'Not financially viable under current assumptions. Viability requires higher demand, lower rent, or lower staffing/COGS.'}
                </p>
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{report.cost_analysis}</p>
            </Card>

            {fin.monthlyRevenue && (
              <Card>
                <SectionHeading sub={(fin as any).scenarioSource === 'benchmark' ? 'Generated from industry benchmarks — directional only.' : 'Best, base, and worst-case from A5 revenue model.'}>Scenario Analysis</SectionHeading>
                {_confidenceTier === 'benchmark_default' ? (
                  <div style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${S.amberBdr}`, background: S.amberBg }}>
                    <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                      Scenario outputs are hidden in benchmark mode to avoid false precision.
                    </p>
                  </div>
                ) : fin.sensitivityAnalysis ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                    <ScenarioCard label="Worst Case" data={fin.sensitivityAnalysis.worst_case} color={S.red} bg={S.redBg} border={S.redBdr} />
                    <ScenarioCard label="Base Case" data={fin.sensitivityAnalysis.base_case} color={S.blue} bg={S.blueBg} border={S.blueBdr} />
                    <ScenarioCard label="Best Case" data={fin.sensitivityAnalysis.best_case} color={S.emerald} bg={S.emeraldBg} border={S.emeraldBdr} />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
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
              </Card>
            )}

            {/* ── 3-Year Profit Projection (from compute engine) ── */}
            {fin.projection?.year1 != null && (
              <Card>
                <SectionHeading badge="engine" sub={fin.projection.suppressed ? 'Year 2–3 projections suppressed — revenue is benchmark-derived, not verified locally' : 'Annual net profit based on engine financial model'}>
                  3-Year Profit Outlook
                </SectionHeading>
                {fin.projection.suppressed ? (
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
                    {/* Year 1 only */}
                    <div style={{ flex: '0 0 auto', minWidth: 140, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' as const }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 8 }}>Year 1</p>
                      <p style={{ fontSize: 22, fontWeight: 900, color: S.brand, fontFamily: S.mono }}>
                        {displayMoney(fin.projection.year1, _confidenceTier).display}
                      </p>
                      <p style={{ fontSize: 10, color: S.n400, marginTop: 4 }}>annual net profit</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 200, background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={S.amber} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                        Year 2 and Year 3 projections are suppressed because revenue was estimated from industry benchmarks, not live local data. Re-run with a verified address for multi-year projections.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {[
                      { label: 'Year 1', value: fin.projection.year1, color: S.brand, bg: S.brandFaded, border: S.brandBorder },
                      { label: 'Year 2', value: fin.projection.year2, color: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr },
                      { label: 'Year 3', value: fin.projection.year3, color: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr },
                    ].map(yr => yr.value != null && (
                      <div key={yr.label} style={{ background: yr.bg, border: `1px solid ${yr.border}`, borderRadius: 12, padding: '18px 20px', textAlign: 'center' as const }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: yr.color, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>{yr.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 900, color: yr.color, fontFamily: S.mono }}>
                          {displayMoney(yr.value, _confidenceTier).display}
                        </p>
                        <p style={{ fontSize: 10, color: S.n400, marginTop: 6 }}>annual net profit</p>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: 11, color: S.n400, marginTop: 12, lineHeight: 1.5 }}>
                  Year 1 assumes base-case revenue. Year 2 applies 8% growth; Year 3 applies a further 10%. Use these projections to stress-test your business case — validate against comparable trading venues before signing.
                </p>
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
                          <span style={{ fontSize: 10, fontWeight: 800, color: S.emerald, letterSpacing: '0.04em' }}>Check FOURSQUARE VERIFIED</span>
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
                        {mapInsights?.competitorCount500m ?? competitors?.count ?? '0'}
                      </p>
                      <p style={{ fontSize: 10, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>within {mapRadius ?? C?.competitorRadius ?? 500}m</p>
                    </div>
                    <div style={{ background: S.n50, borderRadius: 10, padding: '14px', border: `1px solid ${S.n100}`, textAlign: 'center' }}>
                      <p style={{
                        fontSize: 14, fontWeight: 800, textTransform: 'uppercase',
                        color: (mapInsights?.density ?? competitors?.intensityLabel?.toLowerCase()) === 'high' ? S.red
                          : (mapInsights?.density ?? competitors?.intensityLabel?.toLowerCase()) === 'medium' ? S.amber : S.emerald,
                      }}>
                        {mapInsights?.density ?? competitors?.intensityLabel ?? 'N/A'}
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

                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Top competitors
                  </p>
                  {mapCompetitors
                    .slice()
                    .sort((a: any, b: any) => ((b.rating || 0) - (a.rating || 0)) || ((a.distance || 0) - (b.distance || 0)))
                    .slice(0, 3)
                    .map((c: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? `1px solid ${S.n100}` : 'none' }}>
                        <span style={{ fontSize: 12, color: S.n800, fontWeight: 600 }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: S.n500, fontFamily: S.mono }}>
                          {c.rating ? `${c.rating.toFixed(1)} ★` : 'N/A'} · {Math.round(c.distance || 0)}m
                        </span>
                      </div>
                    ))}
                  {mapCompetitors.length === 0 && (
                    <p style={{ fontSize: 12, color: S.n400 }}>Top competitors will appear once live pins load.</p>
                  )}
                </div>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Key nearby features
                  </p>
                  {mapAnchors.slice(0, 5).map((a: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < Math.min(mapAnchors.length, 5) - 1 ? `1px solid ${S.n100}` : 'none' }}>
                      <span style={{ fontSize: 12, color: S.n800, fontWeight: 600 }}>{a.name}</span>
                      <span style={{ fontSize: 11, color: S.n500, fontFamily: S.mono }}>{Math.round(a.distance ?? 0)}m</span>
                    </div>
                  ))}
                  {mapAnchors.length === 0 && (
                    <p style={{ fontSize: 12, color: S.n400 }}>Anchors and footfall drivers will appear once map sources load.</p>
                  )}
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
