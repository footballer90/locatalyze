'use client'
// app/(app)/compare/page.tsx
// Location Comparison — Pro feature
// Side-by-side verdict for up to 3 reports from the user's history.
// Free users see the UI but get a paywall overlay on the second/third column.

import { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/Logo'
import DecisionFrontPage from '@/components/dashboard/DecisionFrontPage'
import { shouldSuppressFinancials } from '@/lib/compute/display-discipline'
import type { ComputedResult } from '@/types/computed'
import { DECISION_EVENTS } from '@/lib/analytics/decision'

const ADMIN_BYPASS_EMAILS = new Set(['pg4441@gmail.com'])

// ── Style constants (matches rest of app) ────────────────────────────────────
const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  mono:        "'JetBrains Mono','Fira Mono',monospace",
  brand:       '#0F766E',
  brandLight:  '#14B8A6',
  brandFaded:  '#F0FDFA',
  headerBg:    '#0C2340',
  n50:         '#FAFAF9',
  n100:        '#F5F5F4',
  n200:        '#E7E5E4',
  n300:        '#D6D3D1',
  n400:        '#A8A29E',
  n500:        '#78716C',
  n700:        '#44403C',
  n800:        '#292524',
  n900:        '#1C1917',
  white:       '#FFFFFF',
  emerald:     '#059669',
  emeraldBg:   '#ECFDF5',
  emeraldBdr:  '#A7F3D0',
  amber:       '#D97706',
  amberBg:     '#FFFBEB',
  amberBdr:    '#FDE68A',
  red:         '#DC2626',
  redBg:       '#FEF2F2',
  redBdr:      '#FECACA',
  blue:        '#2563EB',
  blueBg:      '#EFF6FF',
  blueBdr:     '#BFDBFE',
}

interface ReportSummary {
  id:              string
  report_id:       string | null
  verdict:         string | null
  overall_score:   number | null
  score_rent:      number | null
  score_competition: number | null
  score_demand:    number | null
  score_profitability: number | null
  location_name:   string | null
  business_type:   string | null
  monthly_rent:    number | null
  breakeven_daily: number | null
  created_at:      string
  computed_result: any | null
  result_data:     any | null
}

function trackCompareEvent(properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const posthog = (window as any).posthog
  if (!posthog || typeof posthog.capture !== 'function') return
  try {
    posthog.capture(DECISION_EVENTS.locationCompareUsed, properties)
  } catch {
    // analytics should never break UX
  }
}

function fmt(n: number | null | undefined) {
  if (n == null) return null
  return `A$${Math.abs(n).toLocaleString('en-AU')}`
}

function fmtMoneyK(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1000000) return `A$${(n / 1000000).toFixed(1)}M`
  return `A$${Math.round(n / 1000)}K`
}

function normalizeVerdict(v: string | null | undefined): 'GO' | 'CAUTION' | 'NO' {
  const raw = String(v ?? '').toLowerCase().trim()
  if (raw === 'go' || raw === 'strong go' || raw === 'conditional go') return 'GO'
  if (raw === 'caution') return 'CAUTION'
  return 'NO'
}

function verdictBadgeLabel(v: string | null | undefined): string {
  const s = String(v ?? '').toLowerCase()
  if (s.includes('conditional')) return 'CONDITIONAL GO'
  const n = normalizeVerdict(v)
  if (n === 'GO') return 'GO'
  if (n === 'CAUTION') return 'CAUTION'
  return 'NO GO'
}

function decisionFrontOneLine(v: string | null | undefined): string {
  const n = normalizeVerdict(v)
  if (n === 'NO') return 'NO GO: Current economics are not viable under this lease setup.'
  if (n === 'CAUTION') return 'CAUTION: Viable only if key conditions are tightened before signing.'
  return 'GO: Viable under current assumptions.'
}

/** Verdict strip colors aligned with dashboard / share link */
function verdictColorsDecisionFront(v: string | null | undefined): { text: string; bg: string; border: string } {
  const n = normalizeVerdict(v)
  const raw = String(v ?? '').toLowerCase()
  if (raw.includes('conditional')) return { text: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr }
  if (n === 'GO') return { text: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr }
  if (n === 'CAUTION') return { text: S.amber, bg: S.amberBg, border: S.amberBdr }
  return { text: S.red, bg: S.redBg, border: S.redBdr }
}

function modelConfidenceLabelMc(mc: unknown): string {
  const m = String(mc ?? '').toLowerCase()
  if (!m || m === 'undefined') return 'Unknown'
  if (m === 'benchmark_default') return 'Benchmark default'
  if (m === 'low') return 'Low'
  if (m === 'medium') return 'Medium'
  if (m === 'high') return 'High'
  return mc != null ? String(mc).charAt(0).toUpperCase() + String(mc).slice(1) : 'Unknown'
}

function formatReportDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Australia/Sydney',
    })
  } catch {
    return ''
  }
}

function firstSentence(text: string | null | undefined): string | null {
  if (!text) return null
  const trimmed = text.trim()
  if (!trimmed) return null
  const idx = trimmed.indexOf('. ')
  return idx === -1 ? trimmed : trimmed.slice(0, idx + 1)
}

function buildRealityCheck(args: {
  rentRatioPct: number | null
  validCompetitorCount: number | null
  businessType: string | null | undefined
}): string | null {
  const bt = (args.businessType ?? 'business').toLowerCase()
  if (args.rentRatioPct != null && args.rentRatioPct >= 20) {
    return `Reality check: At ~${Math.round(args.rentRatioPct)}% rent-to-revenue, many comparable ${bt}s struggle to hold healthy margins without premium pricing.`
  }
  if (args.rentRatioPct != null && args.rentRatioPct >= 15) {
    return `Reality check: At ~${Math.round(args.rentRatioPct)}% rent-to-revenue, this site can work, but margin buffer is thin if revenue underperforms.`
  }
  if (args.validCompetitorCount != null && args.validCompetitorCount >= 10) {
    return `Reality check: Competition is dense (${args.validCompetitorCount} operators in range), so winning requires clear differentiation, not average execution.`
  }
  return null
}

function verdictCfg(v: string | null) {
  const u = (v ?? '').toUpperCase()
  if (u === 'GO')      return { label: 'GO',      color: S.emerald, bg: S.emeraldBg, border: S.emeraldBdr }
  if (u === 'CAUTION') return { label: 'CAUTION', color: S.amber,   bg: S.amberBg,  border: S.amberBdr   }
  return                      { label: 'NO',       color: S.red,     bg: S.redBg,    border: S.redBdr     }
}

// ── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, best }: { label: string; score: number | null; best: boolean }) {
  const pct = score ?? 0
  const color = pct >= 70 ? S.emerald : pct >= 45 ? S.amber : S.red
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.n500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: S.mono }}>{score ?? '—'}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          borderRadius: 4,
          boxShadow: best ? `0 0 6px ${color}80` : 'none',
          transition: 'width 0.5s ease',
        }} />
      </div>
      {best && <span style={{ fontSize: 10, color, fontWeight: 700 }}>Best</span>}
    </div>
  )
}

// ── Single comparison column ─────────────────────────────────────────────────
function CompareColumn({ report, isBest, isBlocked, onRemove, slot }: {
  report: ReportSummary | null
  isBest: boolean
  isBlocked: boolean
  onRemove: () => void
  slot: number
}) {
  const router = useRouter()

  if (!report) {
    return (
      <div style={{
        flex: 1, border: `2px dashed ${S.n200}`, borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 40, color: S.n400, textAlign: 'center',
        minHeight: 400,
      }}>
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>Location</div>
        <p style={{ fontSize: 14, fontWeight: 700, color: S.n500, marginBottom: 6 }}>Slot {slot + 1} empty</p>
        <p style={{ fontSize: 12, color: S.n400 }}>Select a report from your history below</p>
      </div>
    )
  }

  const C = report.computed_result as ComputedResult | null
  const verdictV = C?.verdict ?? report.verdict
  const vfront = verdictColorsDecisionFront(verdictV)
  const finSup = shouldSuppressFinancials(C)
  const np = C?.netProfit ?? null
  const rev = C?.revenue ?? null
  const rr = C?.revenueRange ?? null
  const benchmark = C?.benchmarkContext ?? null
  const heroRentRatio =
    benchmark?.benchmarkRentRatio
    ?? (C?.revenue && report.monthly_rent ? (Number(report.monthly_rent) / Number(C.revenue)) * 100 : null)
  const advisorLine = firstSentence(benchmark?.benchmarkNarrative) ?? C?.verdictReasons?.[0] ?? null
  const confidencePct = C?.dataCompleteness != null ? Math.round(Number(C.dataCompleteness)) : null
  const realityCheck = buildRealityCheck({
    rentRatioPct: heroRentRatio != null ? Number(heroRentRatio) : null,
    validCompetitorCount: C?.validCompetitorCount ?? null,
    businessType: report.business_type,
  })

  const monthlyRentAmt = report.monthly_rent ?? C?.costBreakdown?.rent ?? null
  const rentToRevenueDisplay = (() => {
    if (monthlyRentAmt == null || monthlyRentAmt <= 0) return 'Not available'
    if (rr && rr.low > 0 && rr.high > 0) {
      const hi = (monthlyRentAmt / rr.low) * 100
      const lo = (monthlyRentAmt / rr.high) * 100
      return `${Math.round(lo * 10) / 10}-${Math.round(hi * 10) / 10}%`
    }
    if (rev != null && rev > 0) return `${Math.round(((monthlyRentAmt / rev) * 100) * 10) / 10}%`
    return 'Not available'
  })()

  const beDailyStr =
    C?.breakEvenDaily != null
      ? `${Math.round(Number(C.breakEvenDaily))} customers / day`
      : report.breakeven_daily != null
        ? `${report.breakeven_daily} customers / day`
        : 'Not available'

  const revenueBand = rr ? `${fmtMoneyK(rr.low)} – ${fmtMoneyK(rr.high)}` : rev != null ? fmtMoneyK(rev) : 'Not available'
  const revenueDetail =
    rr && rr.p10 != null
      ? `P10 ${fmtMoneyK(rr.p10)} · P50 ${fmtMoneyK(rr.p50)} · P90 ${fmtMoneyK(rr.p90)}`
      : null

  const netMonthlyStr =
    finSup.suppress ? '—' : np != null ? (fmt(np) ?? 'Not available') : 'Not available'

  const content = (
    <div style={{
      flex: 1, border: `2px solid ${isBest ? S.brand : vfront.border}`,
      borderRadius: 16, overflow: 'hidden',
      background: isBest ? S.brandFaded : S.white,
      position: 'relative',
    }}>
      {/* Best badge */}
      {isBest && (
        <div style={{ position: 'absolute', top: -1, left: 20, background: S.brand, color: S.white, fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: '0 0 8px 8px', letterSpacing: '0.05em' }}>
          BEST OPTION
        </div>
      )}

      {/* Remove button */}
      <button onClick={onRemove} style={{
        position: 'absolute', top: 12, right: 12, background: S.n100, border: 'none',
        borderRadius: '50%', width: 24, height: 24, fontSize: 12, color: S.n400,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: S.font,
      }}>X</button>

      {/* Decision brief (same structure as share link + dashboard) */}
      <div style={{ padding: '10px 10px 0', borderBottom: `1px solid ${S.n100}` }}>
        <DecisionFrontPage
          variant="public"
          locationTitle={report.location_name ?? 'Unknown location'}
          businessType={report.business_type ?? 'Business'}
          reportDateLabel={`Updated ${formatReportDate(report.created_at)}`}
          reportId={report.report_id ?? report.id ?? null}
          verdictBadge={verdictBadgeLabel(verdictV)}
          verdictColors={{ text: vfront.text, bg: vfront.bg, border: vfront.border }}
          oneLine={decisionFrontOneLine(verdictV)}
          advisorLine={advisorLine}
          metrics={{
            rentToRevenue: rentToRevenueDisplay,
            breakEvenDaily: beDailyStr,
            revenueRange: revenueBand,
            revenueDetail,
            netMonthly: netMonthlyStr,
            netQualifier: null,
          }}
          killSwitch={C?.decisionExplanation?.killSwitch ?? null}
          financialsBlocked={finSup.suppress}
          financialsBlockedReason={finSup.reason ?? null}
          dataCompletenessPct={confidencePct ?? 0}
          modelConfidenceLabel={modelConfidenceLabelMc(C?.modelConfidence)}
        />
        <div style={{
          margin: '0 4px 12px',
          padding: '10px 12px',
          borderRadius: 12,
          border: `1px solid ${S.n200}`,
          background: S.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
          gap: 8,
        }}>
          <span style={{ fontSize: 11, color: S.n500, fontWeight: 600 }}>Overall score</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: vfront.text, fontFamily: S.mono, letterSpacing: '-0.03em' }}>
            {report.overall_score ?? '—'}
            <span style={{ fontSize: 12, color: S.n400, fontWeight: 700 }}>/100</span>
          </span>
        </div>
        {realityCheck && (
          <div style={{ margin: '0 4px 12px', padding: '8px 10px', borderRadius: 9, border: `1px solid ${S.n200}`, background: S.n50 }}>
            <p style={{ fontSize: 11, color: S.n700, lineHeight: 1.5, fontWeight: 600 }}>{realityCheck}</p>
          </div>
        )}

        <div style={{ margin: '0 4px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: S.n500, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Why this verdict</p>
          <div style={{ border: `1px solid ${S.emeraldBdr}`, background: S.emeraldBg, borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: S.emerald, marginBottom: 5 }}>A. Why it can work</p>
            {(C?.verdictReasons ?? []).slice(0, 3).map((t: string, i: number) => (
              <p key={`w-${i}`} style={{ fontSize: 10, color: '#065F46', lineHeight: 1.45, marginBottom: 3 }}>• {t}</p>
            ))}
            {(!C?.verdictReasons?.length) && (
              <p style={{ fontSize: 10, color: S.n500, lineHeight: 1.4 }}>No upside bullets returned — open full report for detail.</p>
            )}
          </div>
          <div style={{ border: `1px solid ${S.redBdr}`, background: S.redBg, borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: S.red, marginBottom: 5 }}>B. Why it can fail</p>
            {(C?.verdictFailureModes ?? []).slice(0, 3).map((t: string, i: number) => (
              <p key={`f-${i}`} style={{ fontSize: 10, color: '#991B1B', lineHeight: 1.45, marginBottom: 3 }}>• {t}</p>
            ))}
            {(!C?.verdictFailureModes?.length) && (
              <p style={{ fontSize: 10, color: S.n500, lineHeight: 1.4 }}>No failure modes listed — assume market and execution risk remain.</p>
            )}
          </div>
          <div style={{ border: `1px solid ${S.blueBdr}`, background: S.blueBg, borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: S.blue, marginBottom: 5 }}>C. What must be true</p>
            {(C?.verdictConditions ?? []).slice(0, 3).map((t: string, i: number) => (
              <p key={`c-${i}`} style={{ fontSize: 10, color: '#1E3A8A', lineHeight: 1.45, marginBottom: 3 }}>• {t}</p>
            ))}
            {(!C?.verdictConditions?.length) && (
              <p style={{ fontSize: 10, color: S.n500, lineHeight: 1.4 }}>No non-negotiables listed — check Decision Contract on full report.</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial snapshot */}
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${S.n100}` }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Financials</p>
        {[
          { label: 'Net profit/mo',  value: np  != null ? fmt(np)  : null, positive: np != null && np >= 0 },
          { label: 'Revenue/mo',     value: rev != null ? fmt(rev) : null, positive: true },
          { label: 'Monthly rent',   value: report.monthly_rent != null ? fmt(report.monthly_rent) : null, positive: false },
          { label: 'Break-even/day', value: (C?.breakEvenDaily != null || report.breakeven_daily != null) ? `${C?.breakEvenDaily != null ? Math.round(Number(C.breakEvenDaily)) : report.breakeven_daily} cust.` : null, positive: false },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: S.n500 }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: row.value == null ? S.n300 : row.label === 'Net profit/mo' ? (np != null && np >= 0 ? S.emerald : S.red) : S.n800, fontFamily: S.mono }}>
              {row.value ?? '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Score breakdown */}
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${S.n100}` }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Scores</p>
        <ScoreBar label="Rent"         score={report.score_rent}           best={false} />
        <ScoreBar label="Competition"  score={report.score_competition}    best={false} />
        <ScoreBar label="Demand"       score={report.score_demand}         best={false} />
        <ScoreBar label="Profitability" score={report.score_profitability} best={false} />
      </div>

      {/* Data confidence */}
      {C?.dataCompleteness != null && (
        <div style={{ padding: '12px 22px', borderBottom: `1px solid ${S.n100}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: S.n500 }}>Data quality</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.dataCompleteness >= 60 ? S.emerald : C.dataCompleteness >= 30 ? S.amber : S.red }}>
              {C.dataCompleteness}% live
            </span>
          </div>
          <div style={{ height: 4, background: S.n100, borderRadius: 4, overflow: 'hidden', marginTop: 6 }}>
            <div style={{ height: '100%', width: `${C.dataCompleteness}%`, background: C.dataCompleteness >= 60 ? S.emerald : C.dataCompleteness >= 30 ? S.amber : S.red, borderRadius: 4 }} />
          </div>
        </div>
      )}

      {/* View full report */}
      <div style={{ padding: '14px 22px' }}>
        <button
          onClick={() => router.push(`/dashboard/${report.report_id ?? report.id}?tab=decision`)}
          style={{
            width: '100%', padding: '9px 0', background: isBest ? S.brand : S.white,
            color: isBest ? S.white : S.brand, border: `1.5px solid ${S.brand}`,
            borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: S.font,
          }}
        >
          View full report →
        </button>
      </div>
    </div>
  )

  if (isBlocked) {
    return (
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>{content}</div>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(2px)',
          borderRadius: 16, border: '2px solid #E7E5E4',
        }}>
          <div style={{ textAlign: 'center', padding: '0 32px' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>Locked</div>
            <p style={{ fontSize: 15, fontWeight: 800, color: S.n900, marginBottom: 6 }}>Compare more locations</p>
            <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.6, marginBottom: 20 }}>
              Unlock full reports to compare locations side by side with complete financial breakdowns. Single report $29 or save with a 3-pack for $59.
            </p>
            <a href="/upgrade" style={{
              display: 'inline-block', padding: '10px 24px', background: S.brand,
              color: S.white, borderRadius: 8, fontSize: 13, fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 2px 8px rgba(15,118,110,0.3)',
            }}>
              Unlock reports →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <div style={{ flex: 1 }}>{content}</div>
}

// ── Insight row — highlights which report wins on a metric ───────────────────
function WinnerRow({ label, reports, getValue, higherIsBetter = true, formatValue }: {
  label: string
  reports: (ReportSummary | null)[]
  getValue: (r: ReportSummary) => number | null
  higherIsBetter?: boolean
  formatValue?: (v: number) => string
}) {
  const values = reports.map(r => r ? getValue(r) : null)
  const nonNull = values.filter(v => v != null) as number[]
  if (nonNull.length === 0) return null
  const bestVal = higherIsBetter ? Math.max(...nonNull) : Math.min(...nonNull)
  const winnerIdx = values.findIndex(v => v === bestVal)

  return (
    <tr>
      <td style={{ padding: '10px 16px', fontSize: 13, color: S.n700, borderBottom: `1px solid ${S.n100}`, fontWeight: 600, whiteSpace: 'nowrap' as const }}>{label}</td>
      {reports.map((r, i) => (
        <td key={i} style={{
          padding: '10px 16px', textAlign: 'center' as const,
          fontSize: 13, fontFamily: S.mono, fontWeight: 700,
          borderBottom: `1px solid ${S.n100}`,
          color: values[i] == null ? S.n300 : i === winnerIdx ? S.emerald : S.n700,
          background: i === winnerIdx && values[i] != null ? S.emeraldBg : 'transparent',
        }}>
          {values[i] != null ? (formatValue ? formatValue(values[i] as number) : String(values[i])) : '—'}
          {i === winnerIdx && values[i] != null && <span style={{ marginLeft: 4, fontSize: 10 }}>Check</span>}
        </td>
      ))}
    </tr>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const router                    = useRouter()
  const [reports, setReports]     = useState<ReportSummary[]>([])
  const [selected, setSelected]   = useState<(ReportSummary | null)[]>([null, null, null])
  const [plan, setPlan]           = useState<string>('free')
  const [isAdminBypass, setIsAdminBypass] = useState<boolean>(false)
  const [loading, setLoading]     = useState(true)
  const compareViewTracked = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      const email = String(user.email ?? '').toLowerCase()
      if (ADMIN_BYPASS_EMAILS.has(email)) setIsAdminBypass(true)

      // Load plan
      supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            if (String(data.plan ?? '').toLowerCase() === 'admin') setIsAdminBypass(true)
            setPlan(data.plan ?? 'free')
          }
        })
      // Backward-compat fallback: some environments store plan in user_profiles.
      supabase.from('user_profiles').select('plan').eq('user_id', user.id).maybeSingle()
        .then(({ data }) => {
          if (String(data?.plan ?? '').toLowerCase() === 'admin') setIsAdminBypass(true)
        })

      // Load completed reports
      void supabase.from('reports')
        .select('id,report_id,verdict,overall_score,score_rent,score_competition,score_demand,score_profitability,location_name,business_type,monthly_rent,breakeven_daily,created_at,computed_result,result_data')
        .eq('user_id', user.id)
        .not('verdict', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setReports(data as ReportSummary[])
          setLoading(false)
        })
    })
  }, [router])

  const isFree = plan === 'free' && !isAdminBypass

  // Auto-select first two reports
  useEffect(() => {
    if (reports.length >= 1 && !selected[0]) {
      setSelected(prev => [reports[0] ?? null, prev[1], prev[2]])
    }
    if (reports.length >= 2 && !selected[1]) {
      setSelected(prev => [prev[0], reports[1] ?? null, prev[2]])
    }
  }, [reports]) // eslint-disable-line react-hooks/exhaustive-deps

  // Best report = highest overall_score among selected
  const bestIdx = useMemo(() => {
    const scores = selected.map(r => r?.overall_score ?? null)
    const max = Math.max(...scores.filter(s => s != null) as number[])
    return scores.findIndex(s => s === max && s != null)
  }, [selected])

  function selectReport(slot: number, report: ReportSummary) {
    setSelected(prev => prev.map((r, i) => i === slot ? report : r))
    trackCompareEvent({
      source: 'compare_select',
      slot: slot + 1,
      selected_report_id: report.report_id ?? report.id,
      selected_verdict: report.verdict ?? null,
      selected_business_type: report.business_type ?? null,
      is_free_plan: isFree,
    })
  }

  function removeSlot(slot: number) {
    setSelected(prev => prev.map((r, i) => i === slot ? null : r))
  }

  const activeReports = selected.filter(Boolean)

  useEffect(() => {
    if (compareViewTracked.current) return
    trackCompareEvent({
      source: 'compare_page_view',
      compared_count: activeReports.length,
      is_free_plan: isFree,
    })
    compareViewTracked.current = true
  }, [activeReports.length, isFree])

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ background: S.headerBg, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <Logo variant="dark" size="md" />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>›</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Compare Locations</span>
        </div>
        {isFree && (
          <a href="/upgrade" style={{ fontSize: 12, fontWeight: 700, color: '#FCD34D', textDecoration: 'none', border: '1px solid rgba(252,211,77,0.3)', borderRadius: 20, padding: '4px 12px' }}>
            Unlock reports for comparison →
          </a>
        )}
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: S.n900, marginBottom: 6, letterSpacing: '-0.03em' }}>Compare Locations</h1>
          <p style={{ fontSize: 14, color: S.n500 }}>
            Compare your top locations side by side before committing to a lease.
            {isFree && <span style={{ color: S.amber, fontWeight: 700 }}> Pro unlocks 3-way comparison.</span>}
          </p>
        </div>

        {/* Comparison columns */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, alignItems: 'stretch' }}>
          {[0, 1, 2].map(slot => (
            <CompareColumn
              key={slot}
              report={selected[slot]}
              isBest={selected[slot] != null && bestIdx === slot}
              isBlocked={isFree && slot >= 2}
              onRemove={() => removeSlot(slot)}
              slot={slot}
            />
          ))}
        </div>

        {/* Head-to-head comparison table */}
        {activeReports.length >= 2 && (
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${S.n100}` }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Head-to-head breakdown</p>
              <p style={{ fontSize: 12, color: S.n400, marginTop: 2 }}>Green highlight = winner on that metric</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: S.n50 }}>
                  <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', borderBottom: `1px solid ${S.n100}` }}>Metric</th>
                  {selected.map((r, i) => r ? (
                    <th key={i} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: S.n700, textAlign: 'center', borderBottom: `1px solid ${S.n100}`, maxWidth: 180 }}>
                      {(r.location_name ?? `Report ${i + 1}`).split(',')[0]}
                    </th>
                  ) : null)}
                </tr>
              </thead>
              <tbody>
                <WinnerRow label="Overall score"       reports={selected} getValue={r => r.overall_score}                                      higherIsBetter />
                <WinnerRow label="Rent score"          reports={selected} getValue={r => r.score_rent}                                         higherIsBetter />
                <WinnerRow label="Competition score"   reports={selected} getValue={r => r.score_competition}                                  higherIsBetter />
                <WinnerRow label="Demand score"        reports={selected} getValue={r => r.score_demand}                                       higherIsBetter />
                <WinnerRow label="Timing score"        reports={selected} getValue={r => {
                  const v = r.computed_result?.benchmarkContext?.timingScore
                  return v == null ? null : Number(v)
                }}                                                                                                                               higherIsBetter formatValue={(v) => `${Math.round(v)}/100`} />
                <WinnerRow label="Benchmark rent %"    reports={selected} getValue={r => {
                  const v = r.computed_result?.benchmarkContext?.benchmarkRentRatio
                  return v == null ? null : Math.round(Number(v) * 10) / 10
                }}                                                                                                                               higherIsBetter={false} formatValue={(v) => `${v.toFixed(1)}%`} />
                <WinnerRow label="Net profit / mo"     reports={selected} getValue={r => r.computed_result?.netProfit ?? null}                 higherIsBetter />
                <WinnerRow label="Monthly rent"        reports={selected} getValue={r => r.monthly_rent}                                       higherIsBetter={false} />
                <WinnerRow label="Break-even (days)"   reports={selected} getValue={r => r.breakeven_daily}                                   higherIsBetter={false} />
                <WinnerRow label="Data completeness %" reports={selected} getValue={r => r.computed_result?.dataCompleteness ?? null}          higherIsBetter />
              </tbody>
            </table>
          </div>
        )}

        {/* Report selector */}
        <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${S.n100}` }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Your reports</p>
            <p style={{ fontSize: 12, color: S.n400, marginTop: 2 }}>Click a report to add it to a comparison slot</p>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: S.n400 }}>Loading reports…</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: S.n500, marginBottom: 16 }}>No completed reports yet.</p>
              <a href="/onboarding" style={{ display: 'inline-block', padding: '10px 22px', background: S.brand, color: S.white, borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Run your first analysis →
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, background: S.n100 }}>
              {reports.map(report => {
                const vc     = verdictCfg(report.verdict)
                const isUsed = selected.some(s => s?.id === report.id)
                const nextEmpty = selected.findIndex(s => s === null)

                return (
                  <button
                    key={report.id}
                    disabled={isUsed || (isFree && nextEmpty >= 2)}
                    onClick={() => {
                      if (nextEmpty >= 0 && !(isFree && nextEmpty >= 2)) selectReport(nextEmpty, report)
                    }}
                    style={{
                      background: isUsed ? S.brandFaded : S.white,
                      border: 'none', padding: '16px 20px', textAlign: 'left',
                      cursor: isUsed || (isFree && nextEmpty >= 2) ? 'not-allowed' : 'pointer',
                      opacity: isUsed ? 0.6 : 1,
                      fontFamily: S.font,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {(report.location_name ?? 'Unknown location').split(',').slice(0, 2).join(',')}
                        </p>
                        <p style={{ fontSize: 11, color: S.n400 }}>{report.business_type} - {new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 20, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: vc.color }}>{vc.label}</span>
                        {report.overall_score != null && <span style={{ fontSize: 10, color: vc.color, opacity: 0.7 }}>{report.overall_score}</span>}
                      </div>
                    </div>
                    {isUsed && <p style={{ fontSize: 11, color: S.brand, fontWeight: 600, marginTop: 4 }}>Check Added to comparison</p>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
