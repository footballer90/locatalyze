'use client'
import ShareButton from '@/components/ShareButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ─── Design tokens ────────────────────────────────────────────────────────────
const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand:       '#0F766E',
  brandLight:  '#14B8A6',
  brandFaded:  '#F0FDFA',
  brandBorder: '#99F6E4',
  n50:         '#FAFAF9',
  n100:        '#F5F5F4',
  n200:        '#E7E5E4',
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Report {
  id: string
  report_id?: string | null
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
  full_report_markdown: string | null
  result_data: any | null
  created_at: string
  is_public?: boolean | null
  public_token?: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number | null | undefined, prefix = '$') {
  if (n == null) return '—'
  return prefix + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function verdictCfg(v: string | null) {
  if (v === 'GO')      return { label: 'GO',      desc: 'LOW RISK',    bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, dot: S.emerald  }
  if (v === 'CAUTION') return { label: 'CAUTION', desc: 'MEDIUM RISK', bg: S.amberBg,   text: S.amber,   border: S.amberBdr,   dot: S.amber    }
  return                      { label: 'NO',      desc: 'HIGH RISK',   bg: S.redBg,     text: S.red,     border: S.redBdr,     dot: S.red      }
}

function scoreColor(s: number) {
  if (s >= 70) return S.emerald
  if (s >= 45) return S.amber
  return S.red
}

function card(extra?: object) {
  return {
    background: S.white,
    borderRadius: 16,
    border: `1px solid ${S.n200}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden' as const,
    marginBottom: 12,
    ...extra,
  }
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
      {children}
    </p>
  )
}

function ScoreBar({ label, score, weight }: { label: string; score: number | null; weight: string }) {
  const s = score ?? 0
  const color = scoreColor(s)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: S.n700, fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: S.n400 }}>{weight}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{s}</span>
        </div>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s}%`, background: color, borderRadius: 100, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: string }) {
  return (
    <div style={{ background: S.n50, borderRadius: 12, border: `1px solid ${S.n200}`, padding: '14px 16px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 800, color: highlight || S.n900, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: S.n400, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

// ─── Polling hook ─────────────────────────────────────────────────────────────
function useReport(reportId: string) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(`report_${reportId}`)
      if (cached) {
        const raw = JSON.parse(cached)
        const shaped: Report = {
          id: raw.reportId, report_id: raw.reportId,
          verdict: raw.verdict, overall_score: raw.overall_score,
          score_rent: raw.score_rent, score_competition: raw.score_competition,
          score_demand: raw.score_demand, score_profitability: raw.score_profitability,
          score_cost: raw.score_cost, recommendation: raw.recommendation,
          competitor_analysis: raw.competitor_analysis, rent_analysis: raw.rent_analysis,
          market_demand: raw.market_demand, cost_analysis: raw.cost_analysis,
          profitability: raw.profitability, pl_summary: raw.pl_summary,
          three_year_projection: raw.three_year_projection, sensitivity_analysis: raw.sensitivity_analysis,
          swot_analysis: raw.swot_analysis, breakeven_monthly: raw.breakeven_monthly,
          breakeven_daily: raw.breakeven_daily, breakeven_months: raw.breakeven_months,
          location_name: raw.location?.formattedAddress || null,
          business_type: raw.location?.businessType || null,
          monthly_rent: raw.financials?.rent?.submitted || null,
          full_report_markdown: null, result_data: raw,
          created_at: raw.generatedAt || new Date().toISOString(),
        }
        setReport(shaped); setLoading(false); return
      }
    } catch {}

    const supabase = createClient()
    let attempts = 0
    const MAX = 20

    async function fetchFromDB() {
      const { data, error } = await supabase.from('reports').select('*').eq('report_id', reportId).maybeSingle()
      if (error) { setLoading(false); setNotFound(true); return }
      if (!data) { attempts++; if (attempts >= MAX) { setLoading(false); setNotFound(true) }; return }
      setReport(data as Report); setLoading(false)
      if (!data.verdict) { attempts++; if (attempts < MAX) return } else { clearInterval(timer) }
    }

    fetchFromDB()
    const timer = setInterval(fetchFromDB, 3000)
    return () => clearInterval(timer)
  }, [reportId])

  return { report, loading, notFound }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params)
  const router = useRouter()
  const { report, loading, notFound } = useReport(reportId)
  const [activeTab, setActiveTab] = useState('overview')

  // ── Loading ──
  if (loading || (report && !report.verdict)) {
    return (
      <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${S.n200}`, borderTopColor: S.brand, margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>Generating your report</p>
          <p style={{ fontSize: 13, color: S.n400 }}>This takes about 20 seconds…</p>
        </div>
      </div>
    )
  }

  // ── Not found ──
  if (notFound || !report) {
    return (
      <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Report not found</h2>
          <p style={{ fontSize: 14, color: S.n500, marginBottom: 24 }}>This report may still be processing or the link is invalid.</p>
          <button onClick={() => router.push('/dashboard')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: S.font }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const vc = verdictCfg(report.verdict)
  const fin = report.result_data?.financials || {}
  const scoring = report.result_data?.scoring || {}
  const projections = fin.projections || {}
  const riskScenarios = fin.riskScenarios || {}

  const tabs = [
    { id: 'overview',    label: '📊 Overview'    },
    { id: 'financials',  label: '💰 Financials'  },
    { id: 'analysis',    label: '🔍 Analysis'    },
    { id: 'projections', label: '📈 Projections' },
  ]

  // ── Parse SWOT ──
  function parseSwotSection(key: string, arr: string[]) {
    const idx = arr.indexOf(key)
    const next = arr[idx + 1]
    const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
   const match = report?.swot_analysis?.match(new RegExp(pattern, 'is'))
    if (!match) return []
    return match[1].split(/[,.]/).map(s => s.trim()).filter(s => s.length > 5).slice(0, 3)
  }
  const swotKeys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
  const swotConfig = {
    STRENGTHS:     { icon: '💪', bg: S.emeraldBg, border: S.emeraldBdr, text: '#065F46' },
    WEAKNESSES:    { icon: '⚠️', bg: S.amberBg,   border: S.amberBdr,   text: '#92400E' },
    OPPORTUNITIES: { icon: '🚀', bg: S.blueBg,    border: S.blueBdr,    text: '#1D4ED8' },
    THREATS:       { icon: '🔴', bg: S.redBg,     border: S.redBdr,     text: '#991B1B' },
  }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
          </button>
          <span style={{ color: S.n300 as any }}>›</span>
          <span style={{ fontSize: 13, color: S.n500, fontWeight: 500 }}>{report.business_type}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportPDFButton report={report} />
          <ShareButton
            reportId={report.report_id ?? report.id}
            initialIsPublic={report.is_public ?? false}
            initialToken={report.public_token ?? null}
          />
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* ── Hero card ── */}
        <div style={card({ marginBottom: 14 })}>
          {/* Top section */}
          <div style={{ padding: '24px 24px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: S.n400, marginBottom: 5 }}>📍 {report.location_name || '—'}</p>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 10 }}>{report.business_type}</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: vc.bg, color: vc.text, border: `1.5px solid ${vc.border}`, borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: vc.dot, display: 'inline-block' }} />
                  {vc.label} · {vc.desc}
                </span>
              </div>
              {/* Score ring */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ position: 'relative', width: 96, height: 96 }}>
                  <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="48" cy="48" r="38" fill="none" stroke={S.n100} strokeWidth="10" />
                    <circle cx="48" cy="48" r="38" fill="none"
                      stroke={vc.text} strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 38}`}
                      strokeDashoffset={`${2 * Math.PI * 38 * (1 - (report.overall_score ?? 0) / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: vc.text, lineHeight: 1 }}>{report.overall_score}</span>
                    <span style={{ fontSize: 10, color: S.n400 }}>/100</span>
                  </div>
                </div>
                <p style={{ fontSize: 10, color: S.n400, marginTop: 4 }}>Location Score</p>
              </div>
            </div>

            {/* Recommendation */}
            {report.recommendation && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: vc.bg, borderRadius: 12, border: `1px solid ${vc.border}` }}>
                <p style={{ fontSize: 13, color: vc.text, lineHeight: 1.7 }}>{report.recommendation}</p>
              </div>
            )}
          </div>

          {/* Metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: `1px solid ${S.n100}` }}>
            {[
              { l: 'Monthly Revenue',    v: fmt(fin.monthlyRevenue),   s: 'est.' },
              { l: 'Net Profit / Mo',    v: fmt(fin.monthlyNetProfit),  s: fin.profitMargin ? `${fin.profitMargin}% margin` : '' },
              { l: 'Break-even / Day',   v: report.breakeven_daily ? `${report.breakeven_daily} cust.` : '—', s: 'needed daily' },
              { l: 'Payback Period',     v: !report.breakeven_months || report.breakeven_months === 999 ? 'Not viable' : `${report.breakeven_months} mo`, s: '' },
            ].map((m, i) => (
              <div key={m.l} style={{ padding: '14px 16px', borderRight: i < 3 ? `1px solid ${S.n100}` : 'none' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{m.l}</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: S.n800, letterSpacing: '-0.01em' }}>{m.v}</p>
                {m.s && <p style={{ fontSize: 10, color: S.n400, marginTop: 2 }}>{m.s}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 4, background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: 4, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
                background: activeTab === t.id ? S.brand : 'transparent',
                color: activeTab === t.id ? S.white : S.n500,
                fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════ OVERVIEW ══════════ */}
        {activeTab === 'overview' && (
          <>
            {/* Score breakdown */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionLabel>Score Breakdown</SectionLabel>
              <ScoreBar label="Rent Affordability"  score={report.score_rent}          weight="30%" />
              <ScoreBar label="Profitability"        score={report.score_profitability}  weight="25%" />
              <ScoreBar label="Competition"          score={report.score_competition}    weight="25%" />
              <ScoreBar label="Area Demographics"    score={report.score_demand}         weight="20%" />
              {scoring.riskFlags?.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {scoring.riskFlags.map((flag: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', background: S.amberBg, borderRadius: 8, border: `1px solid ${S.amberBdr}` }}>
                      <span>⚠️</span>
                      <span style={{ fontSize: 12, color: S.amber }}>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SWOT */}
            {report.swot_analysis && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionLabel>SWOT Analysis</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {swotKeys.map(key => {
                    const items = parseSwotSection(key, swotKeys)
                    const cfg = swotConfig[key as keyof typeof swotConfig]
                    if (!items.length) return null
                    return (
                      <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '14px 16px' }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: cfg.text, marginBottom: 8 }}>{cfg.icon} {key}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {items.map((item, i) => (
                            <p key={i} style={{ fontSize: 12, color: cfg.text, opacity: 0.85, lineHeight: 1.5 }}>· {item}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Competition + Demand side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={card({ padding: '20px 22px', marginBottom: 0 })}>
                <SectionLabel>Competition</SectionLabel>
                {report.result_data?.competitors && (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1, background: S.n50, borderRadius: 10, padding: '10px 12px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: S.n900 }}>{report.result_data.competitors.count}</p>
                      <p style={{ fontSize: 10, color: S.n400 }}>within 500m</p>
                    </div>
                    <div style={{ flex: 1, background: S.n50, borderRadius: 10, padding: '10px 12px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: report.result_data.competitors.intensityLabel === 'LOW' ? S.emerald : report.result_data.competitors.intensityLabel === 'MEDIUM' ? S.amber : S.red }}>
                        {report.result_data.competitors.intensityLabel}
                      </p>
                      <p style={{ fontSize: 10, color: S.n400 }}>intensity</p>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{report.competitor_analysis}</p>
              </div>
              <div style={card({ padding: '20px 22px', marginBottom: 0 })}>
                <SectionLabel>Market Demand</SectionLabel>
                {report.result_data?.demographics && (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1, background: S.n50, borderRadius: 10, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                      <p style={{ fontSize: 10, color: S.n400, marginBottom: 3 }}>Median Income</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>{fmt(report.result_data.demographics.medianIncome)}/yr</p>
                    </div>
                    <div style={{ flex: 1, background: S.n50, borderRadius: 10, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                      <p style={{ fontSize: 10, color: S.n400, marginBottom: 3 }}>Affordability</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.emerald }}>{report.result_data.demographics.affordabilityLabel?.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{report.market_demand}</p>
              </div>
            </div>
          </>
        )}

        {/* ══════════ FINANCIALS ══════════ */}
        {activeTab === 'financials' && (
          <>
            {/* P&L */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionLabel>Monthly P&L</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                <MetricCard label="Revenue"     value={fmt(fin.monthlyRevenue)}    />
                <MetricCard label="Total Costs" value={fmt(fin.totalMonthlyCosts)} highlight={S.red} />
                <MetricCard label="Gross Profit" value={fmt(fin.monthlyGrossProfit)} highlight={S.blue} />
                <MetricCard label="Net Profit"   value={fmt(fin.monthlyNetProfit)}  highlight={(fin.monthlyNetProfit ?? 0) >= 0 ? S.emerald : S.red} />
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{report.profitability}</p>
            </div>

            {/* Rent */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionLabel>Rent Analysis</SectionLabel>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <MetricCard label="Monthly Rent"   value={fmt(report.monthly_rent)} />
                <MetricCard label="% of Revenue"   value={`${fin.rent?.toRevenuePercent ?? '—'}%`} highlight={(fin.rent?.toRevenuePercent ?? 0) <= 12 ? S.emerald : (fin.rent?.toRevenuePercent ?? 0) <= 20 ? S.amber : S.red} />
                <MetricCard label="Rating"         value={fin.rent?.label ?? '—'} highlight={fin.rent?.label === 'EXCELLENT' ? S.emerald : fin.rent?.label === 'GOOD' ? S.blue : fin.rent?.label === 'MARGINAL' ? S.amber : S.red} />
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{report.rent_analysis}</p>
            </div>

            {/* Break-even */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionLabel>Break-even Analysis</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                <MetricCard label="Customers / Day"   value={String(report.breakeven_daily ?? '—')} />
                <MetricCard label="Revenue / Month"   value={fmt(report.breakeven_monthly)} />
                <MetricCard label="Surplus Customers" value={(fin.breakEven?.surplusCustomers != null ? (fin.breakEven.surplusCustomers >= 0 ? '+' : '') + fin.breakEven.surplusCustomers : '—') as string} highlight={fin.breakEven?.isAboveBreakEven ? S.emerald : S.red} />
              </div>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{report.cost_analysis}</p>
            </div>

            {/* Risk scenarios */}
            {riskScenarios.best && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionLabel>Risk Scenarios</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                  {[
                    { key: 'best',  label: 'Best Case',  pct: '130%', bg: S.emeraldBg, border: S.emeraldBdr, text: S.emerald },
                    { key: 'base',  label: 'Base Case',  pct: '100%', bg: S.blueBg,    border: S.blueBdr,    text: S.blue   },
                    { key: 'worst', label: 'Worst Case', pct: '70%',  bg: S.redBg,     border: S.redBdr,     text: S.red    },
                  ].map(sc => {
                    const s = riskScenarios[sc.key] || {}
                    return (
                      <div key={sc.key} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 12, padding: '14px 16px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{sc.label} <span style={{ opacity: 0.6 }}>({sc.pct})</span></p>
                        <p style={{ fontSize: 10, color: sc.text, opacity: 0.7, marginBottom: 3 }}>Revenue</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: sc.text, marginBottom: 8 }}>{fmt(s.monthlyRevenue)}</p>
                        <p style={{ fontSize: 10, color: sc.text, opacity: 0.7, marginBottom: 3 }}>Net Profit</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: sc.text }}>{fmt(s.monthlyNet)}</p>
                        {s.cashBufferNeeded > 0 && <p style={{ fontSize: 10, color: sc.text, marginTop: 8, opacity: 0.8 }}>Buffer: {fmt(s.cashBufferNeeded)}</p>}
                      </div>
                    )
                  })}
                </div>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{report.sensitivity_analysis}</p>
              </div>
            )}
          </>
        )}

        {/* ══════════ ANALYSIS ══════════ */}
        {activeTab === 'analysis' && (
          <>
            {[
              { title: 'Recommendation',      icon: '🎯', content: report.recommendation       },
              { title: 'Competitor Analysis', icon: '🏪', content: report.competitor_analysis  },
              { title: 'Rent Analysis',       icon: '🏠', content: report.rent_analysis        },
              { title: 'Market Demand',       icon: '📈', content: report.market_demand        },
              { title: 'Cost Analysis',       icon: '💸', content: report.cost_analysis        },
              { title: 'Profitability',       icon: '💰', content: report.profitability        },
            ].filter(s => s.content).map(s => (
              <div key={s.title} style={card({ padding: '20px 22px' })}>
                <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 10 }}>{s.icon} {s.title}</p>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{s.content}</p>
              </div>
            ))}

            {/* Full SWOT */}
            {report.swot_analysis && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionLabel>Full SWOT Analysis</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {swotKeys.map(key => {
                    const cfg = swotConfig[key as keyof typeof swotConfig]
                    const regex = new RegExp(`${key}:\\s*(.+?)(?=(?:STRENGTHS|WEAKNESSES|OPPORTUNITIES|THREATS):|$)`, 'is')
                    const match = report.swot_analysis!.match(regex)
                    const text = match ? match[1].trim() : ''
                    if (!text) return null
                    return (
                      <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '14px 16px' }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: cfg.text, marginBottom: 8 }}>{cfg.icon} {key}</p>
                        <p style={{ fontSize: 12, color: cfg.text, opacity: 0.85, lineHeight: 1.65 }}>{text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════ PROJECTIONS ══════════ */}
        {activeTab === 'projections' && (
          <>
            {projections.year1 && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionLabel>3-Year Financial Projections</SectionLabel>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${S.n100}` }}>
                      {['Metric', 'Year 1', 'Year 2', 'Year 3'].map((h, i) => (
                        <th key={h} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 0', fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Revenue',    key: 'revenue',   color: S.n800   },
                      { label: 'Costs',      key: 'costs',     color: S.red    },
                      { label: 'Net Profit', key: 'netProfit', color: S.emerald },
                    ].map(row => (
                      <tr key={row.key} style={{ borderBottom: `1px solid ${S.n100}` }}>
                        <td style={{ padding: '12px 0', fontSize: 13, color: S.n500 }}>{row.label}</td>
                        {['year1', 'year2', 'year3'].map(y => (
                          <td key={y} style={{ padding: '12px 0', textAlign: 'right', fontSize: 13, fontWeight: 700, color: row.color }}>
                            {fmt(projections[y]?.[row.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75, marginTop: 16 }}>{report.three_year_projection}</p>
              </div>
            )}

            {report.pl_summary && (
              <div style={card({ padding: '20px 22px' })}>
                <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 10 }}>📋 P&L Summary</p>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{report.pl_summary}</p>
              </div>
            )}

            {report.sensitivity_analysis && (
              <div style={card({ padding: '20px 22px' })}>
                <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 10 }}>🎲 Sensitivity Analysis</p>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75, marginBottom: 14 }}>{report.sensitivity_analysis}</p>
                {riskScenarios.worst?.cashBufferNeeded > 0 && (
                  <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.amber, marginBottom: 6 }}>⚠️ Worst-case cash buffer required</p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: S.n900 }}>{fmt(riskScenarios.worst.cashBufferNeeded)}</p>
                    <p style={{ fontSize: 11, color: S.n400, marginTop: 4 }}>At 70% of baseline demand</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Footer ── */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${S.n200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: S.n400 }}>
            Report ID: {report.id} · {new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 8px rgba(15,118,110,0.25)' }}
          >
            ➕ Analyse another location
          </button>
        </div>
      </div>
    </div>
  )
}