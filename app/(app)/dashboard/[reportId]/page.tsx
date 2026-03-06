'use client'
import PrintButton from '@/components/PrintButton'
import ShareButton from '@/components/ShareButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

function verdictConfig(verdict: string | null) {
  if (verdict === 'GO')      return { label: 'GO',      color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', bar: 'bg-emerald-400', dot: 'bg-emerald-400', emoji: '✅' }
  if (verdict === 'CAUTION') return { label: 'CAUTION', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   bar: 'bg-amber-400',   dot: 'bg-amber-400',   emoji: '⚠️' }
  return                            { label: 'NO',      color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30',     bar: 'bg-red-400',     dot: 'bg-red-400',     emoji: '🚫' }
}

function ScoreBar({ label, score, weight }: { label: string; score: number | null; weight: string }) {
  const s = score ?? 0
  const v = verdictConfig(s >= 70 ? 'GO' : s >= 45 ? 'CAUTION' : 'NO')
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{weight}</span>
          <span className={`text-sm font-semibold ${v.color}`}>{s}</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${v.bar}`}
          style={{ width: `${s}%` }}
        />
      </div>
    </div>
  )
}

function Card({ title, icon, children, className = '' }: { title: string; icon: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Polling hook ─────────────────────────────────────────────────────────────
function useReport(reportId: string) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // ── Try sessionStorage first (set by onboarding page right after n8n returns)
    try {
      const cached = sessionStorage.getItem(`report_${reportId}`)
      if (cached) {
        const raw = JSON.parse(cached)
        // Shape the raw n8n report into the Report interface
        const shaped: Report = {
          id:                    raw.reportId,
          report_id:             raw.reportId,
          verdict:               raw.verdict,
          overall_score:         raw.overall_score,
          score_rent:            raw.score_rent,
          score_competition:     raw.score_competition,
          score_demand:          raw.score_demand,
          score_profitability:   raw.score_profitability,
          score_cost:            raw.score_cost,
          recommendation:        raw.recommendation,
          competitor_analysis:   raw.competitor_analysis,
          rent_analysis:         raw.rent_analysis,
          market_demand:         raw.market_demand,
          cost_analysis:         raw.cost_analysis,
          profitability:         raw.profitability,
          pl_summary:            raw.pl_summary,
          three_year_projection: raw.three_year_projection,
          sensitivity_analysis:  raw.sensitivity_analysis,
          swot_analysis:         raw.swot_analysis,
          breakeven_monthly:     raw.breakeven_monthly,
          breakeven_daily:       raw.breakeven_daily,
          breakeven_months:      raw.breakeven_months,
          location_name:         raw.location?.formattedAddress || null,
          business_type:         raw.location?.businessType    || null,
          monthly_rent:          raw.financials?.rent?.submitted || null,
          full_report_markdown:  null,
          result_data:           raw,
          created_at:            raw.generatedAt || new Date().toISOString(),
        }
        setReport(shaped)
        setLoading(false)
        return
      }
    } catch {}

    // ── Fallback: poll Supabase
    const supabase = createClient()
    let attempts = 0
    const MAX = 20

    async function fetchFromDB() {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle()

      if (error) { setLoading(false); setNotFound(true); return }

      if (!data) {
        attempts++
        if (attempts >= MAX) { setLoading(false); setNotFound(true) }
        return
      }

      setReport(data as Report)
      setLoading(false)

      if (!data.verdict) {
        attempts++
        if (attempts < MAX) return
      } else {
        clearInterval(timer)
      }
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

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading || (report && !report.verdict)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin" />
          </div>
          <p className="text-white font-semibold mb-1">Generating your report</p>
          <p className="text-slate-400 text-sm">This takes about 20 seconds…</p>
        </div>
      </div>
    )
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (notFound || !report) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-white mb-2">Report not found</h2>
          <p className="text-slate-400 mb-6">This report may still be processing or the link is invalid.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Derived data ─────────────────────────────────────────────────────────
  const vc = verdictConfig(report.verdict)
  const fin = report.result_data?.financials || {}
  const scoring = report.result_data?.scoring || {}
  const projections = fin.projections || {}
  const riskScenarios = fin.riskScenarios || {}

  const tabs = [
    { id: 'overview',     label: 'Overview'    },
    { id: 'financials',   label: 'Financials'  },
    { id: 'analysis',     label: 'Analysis'    },
    { id: 'projections',  label: 'Projections' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => router.push('/dashboard')} className="hover:text-slate-300 transition-colors">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-300">{report.business_type || 'Report'}</span>
        </div>

        {/* ── Hero ── */}
        <div className={`relative overflow-hidden rounded-3xl border ${vc.border} ${vc.bg} p-8 mb-6`}>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${vc.border} ${vc.bg} mb-4`}>
                  <div className={`w-2 h-2 rounded-full ${vc.dot} animate-pulse`} />
                  <span className={`text-sm font-bold tracking-wider ${vc.color}`}>{vc.label}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {report.business_type}
                </h1>
                <p className="text-slate-400 text-sm mb-4">
                  📍 {report.location_name || report.result_data?.location?.formattedAddress}
                </p>
                <p className="text-slate-300 leading-relaxed max-w-2xl">
                  {report.recommendation}
                </p>
              </div>

              {/* Score ring */}
              <div className="flex-shrink-0 text-center">
                <div className={`relative w-32 h-32 mx-auto`}>
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke={report.verdict === 'GO' ? '#34d399' : report.verdict === 'CAUTION' ? '#fbbf24' : '#f87171'}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - (report.overall_score ?? 0) / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${vc.color}`}>{report.overall_score}</span>
                    <span className="text-slate-500 text-xs">/ 100</span>
                  </div>
                </div>
               <p className="text-slate-400 text-xs mt-2">Location Score</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <ShareButton
                reportId={report.report_id ?? report.id}
                initialIsPublic={report.is_public ?? false}
                initialToken={report.public_token ?? null}
              />
            </div>

          </div>
        </div>

        {/* ── Key metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Metric
            label="Monthly Revenue"
            value={fmt(fin.monthlyRevenue)}
            sub="demand-driven estimate"
          />
          <Metric
            label="Monthly Net Profit"
            value={fmt(fin.monthlyNetProfit)}
            sub={fin.profitMargin != null ? `${fin.profitMargin}% margin` : undefined}
          />
          <Metric
            label="Break-even / Day"
            value={report.breakeven_daily != null ? `${report.breakeven_daily} customers` : '—'}
            sub={fmt(report.breakeven_monthly) + '/mo required'}
          />
          <Metric
            label="Payback Period"
            value={report.breakeven_months === 999 || !report.breakeven_months ? 'Not viable' : `${report.breakeven_months} months`}
            sub={fin.investment?.paybackLabel || ''}
          />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════ TAB: OVERVIEW ═══════════ */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4">

            {/* Score breakdown */}
            <Card title="Score Breakdown" icon="📊">
              <div className="space-y-4">
                <ScoreBar label="Rent Affordability"  score={report.score_rent}         weight="30%" />
                <ScoreBar label="Profitability"        score={report.score_profitability} weight="25%" />
                <ScoreBar label="Competition"          score={report.score_competition}   weight="25%" />
                <ScoreBar label="Area Demographics"    score={report.score_demand}        weight="20%" />
              </div>
              {scoring.riskFlags && scoring.riskFlags.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {scoring.riskFlags.map((flag: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-400">
                      <span className="mt-0.5">⚠️</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* SWOT */}
            <Card title="SWOT Analysis" icon="🎯">
              {report.swot_analysis ? (
                <div className="space-y-3">
                  {['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS'].map((section, idx, arr) => {
                    const nextSection = arr[idx + 1]
                    const pattern = nextSection ? `${section}:\\s*(.*?)(?=${nextSection}:)` : `${section}:\\s*(.*?)$`
                    const regex = new RegExp(pattern, 'is')
                    const match = report.swot_analysis!.match(regex)
                    const raw = match ? match[1].trim() : ''
                    const items = raw.split(/[,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 5)
                    const cfg = {
                      STRENGTHS:    { emoji: '💪', color: 'text-emerald-400' },
                      WEAKNESSES:   { emoji: '⚠️', color: 'text-amber-400'  },
                      OPPORTUNITIES:{ emoji: '🚀', color: 'text-blue-400'   },
                      THREATS:      { emoji: '🔴', color: 'text-red-400'    },
                    }[section] || { emoji: '•', color: 'text-slate-400' }
                    return items.length > 0 ? (
                      <div key={section}>
                        <p className={`text-xs font-semibold ${cfg.color} mb-1`}>{cfg.emoji} {section}</p>
                        <ul className="space-y-0.5">
                          {items.filter(Boolean).slice(0, 2).map((item, i) => (
                            <li key={i} className="text-slate-300 text-xs pl-3 border-l border-slate-700">{item.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  })}
                </div>
              ) : <p className="text-slate-500 text-sm">Not available</p>}
            </Card>

            {/* Competitor analysis */}
            <Card title="Competition" icon="🏪">
              <p className="text-slate-300 text-sm leading-relaxed">{report.competitor_analysis}</p>
              {report.result_data?.competitors && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-4 py-2 text-center">
                    <p className="text-xl font-bold text-white">{report.result_data.competitors.count}</p>
                    <p className="text-xs text-slate-500">within 500m</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-4 py-2 text-center">
                    <p className={`text-sm font-bold ${
                      report.result_data.competitors.intensityLabel === 'LOW' ? 'text-emerald-400' :
                      report.result_data.competitors.intensityLabel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                    }`}>{report.result_data.competitors.intensityLabel}</p>
                    <p className="text-xs text-slate-500">intensity</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Market demand */}
            <Card title="Market Demand" icon="📈">
              <p className="text-slate-300 text-sm leading-relaxed">{report.market_demand}</p>
              {report.result_data?.demographics && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2">
                    <p className="text-xs text-slate-500 mb-0.5">Median Income</p>
                    <p className="text-sm font-semibold text-white">{fmt(report.result_data.demographics.medianIncome)}/yr</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2">
                    <p className="text-xs text-slate-500 mb-0.5">Affordability</p>
                    <p className="text-sm font-semibold text-emerald-400">{report.result_data.demographics.affordabilityLabel?.replace('_', ' ')}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ═══════════ TAB: FINANCIALS ═══════════ */}
        {activeTab === 'financials' && (
          <div className="space-y-4">

            {/* Revenue vs costs */}
            <Card title="Monthly P&L" icon="💰">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Revenue</p>
                  <p className="text-lg font-bold text-white">{fmt(fin.monthlyRevenue)}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Total Costs</p>
                  <p className="text-lg font-bold text-red-400">{fmt(fin.totalMonthlyCosts)}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Gross Profit</p>
                  <p className="text-lg font-bold text-blue-400">{fmt(fin.monthlyGrossProfit)}</p>
                </div>
                <div className={`border rounded-xl p-3 ${(fin.monthlyNetProfit ?? 0) >= 0 ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-red-400/5 border-red-400/20'}`}>
                  <p className="text-xs text-slate-500 mb-1">Net Profit</p>
                  <p className={`text-lg font-bold ${(fin.monthlyNetProfit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(fin.monthlyNetProfit)}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{report.profitability}</p>
            </Card>

            {/* Rent analysis */}
            <Card title="Rent Analysis" icon="🏠">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-500 mb-0.5">Monthly Rent</p>
                  <p className="text-xl font-bold text-white">{fmt(report.monthly_rent)}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-500 mb-0.5">% of Revenue</p>
                  <p className={`text-xl font-bold ${
                    (fin.rent?.toRevenuePercent ?? 0) <= 12 ? 'text-emerald-400' :
                    (fin.rent?.toRevenuePercent ?? 0) <= 20 ? 'text-amber-400' : 'text-red-400'
                  }`}>{fin.rent?.toRevenuePercent ?? '—'}%</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-500 mb-0.5">Rating</p>
                  <p className={`text-xl font-bold ${
                    fin.rent?.label === 'EXCELLENT' ? 'text-emerald-400' :
                    fin.rent?.label === 'GOOD'      ? 'text-blue-400'   :
                    fin.rent?.label === 'MARGINAL'  ? 'text-amber-400'  : 'text-red-400'
                  }`}>{fin.rent?.label ?? '—'}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{report.rent_analysis}</p>
            </Card>

            {/* Break-even */}
            <Card title="Break-even Analysis" icon="⚖️">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-white">{report.breakeven_daily}</p>
                  <p className="text-xs text-slate-500">customers/day</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-white">{fmt(report.breakeven_monthly)}</p>
                  <p className="text-xs text-slate-500">revenue/month</p>
                </div>
                <div className={`border rounded-xl p-3 text-center ${
                  (fin.breakEven?.isAboveBreakEven) ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-red-400/5 border-red-400/20'
                }`}>
                  <p className={`text-2xl font-black ${fin.breakEven?.isAboveBreakEven ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fin.breakEven?.surplusCustomers != null
                      ? (fin.breakEven.surplusCustomers >= 0 ? '+' : '') + fin.breakEven.surplusCustomers
                      : '—'}
                  </p>
                  <p className="text-xs text-slate-500">surplus customers</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{report.cost_analysis}</p>
            </Card>

            {/* Risk scenarios */}
            {riskScenarios.best && (
              <Card title="Risk Scenarios" icon="🎲">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { key: 'best',  label: 'Best Case',  mult: '130%', color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5' },
                    { key: 'base',  label: 'Base Case',  mult: '100%', color: 'text-blue-400',    border: 'border-blue-400/20',    bg: 'bg-blue-400/5' },
                    { key: 'worst', label: 'Worst Case', mult: '70%',  color: 'text-red-400',     border: 'border-red-400/20',     bg: 'bg-red-400/5' },
                  ].map(({ key, label, mult, color, border, bg }) => {
                    const s = riskScenarios[key] || {}
                    return (
                      <div key={key} className={`border ${border} ${bg} rounded-xl p-3`}>
                        <p className={`text-xs font-semibold ${color} mb-2`}>{label} <span className="text-slate-500">({mult})</span></p>
                        <p className="text-xs text-slate-500 mb-0.5">Monthly Revenue</p>
                        <p className="text-sm font-bold text-white mb-2">{fmt(s.monthlyRevenue)}</p>
                        <p className="text-xs text-slate-500 mb-0.5">Net Profit</p>
                        <p className={`text-sm font-bold ${(s.monthlyNet ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(s.monthlyNet)}</p>
                        {s.cashBufferNeeded > 0 && (
                          <p className="text-xs text-amber-400 mt-2">Buffer needed: {fmt(s.cashBufferNeeded)}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{report.sensitivity_analysis}</p>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════ TAB: ANALYSIS ═══════════ */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {[
              { title: 'Recommendation',   icon: '🎯', content: report.recommendation        },
              { title: 'Competitor Analysis', icon: '🏪', content: report.competitor_analysis },
              { title: 'Rent Analysis',    icon: '🏠', content: report.rent_analysis          },
              { title: 'Market Demand',    icon: '📈', content: report.market_demand          },
              { title: 'Cost Analysis',    icon: '💸', content: report.cost_analysis          },
              { title: 'Profitability',    icon: '💰', content: report.profitability          },
            ].map(({ title, icon, content }) => content ? (
              <Card key={title} title={title} icon={icon}>
                <p className="text-slate-300 text-sm leading-relaxed">{content}</p>
              </Card>
            ) : null)}

            {/* SWOT full */}
            {report.swot_analysis && (
              <Card title="Full SWOT Analysis" icon="🎲">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'STRENGTHS',     emoji: '💪', color: 'border-emerald-400/30 bg-emerald-400/5', titleColor: 'text-emerald-400' },
                    { key: 'WEAKNESSES',    emoji: '⚠️', color: 'border-amber-400/30   bg-amber-400/5',   titleColor: 'text-amber-400'   },
                    { key: 'OPPORTUNITIES', emoji: '🚀', color: 'border-blue-400/30    bg-blue-400/5',    titleColor: 'text-blue-400'    },
                    { key: 'THREATS',       emoji: '🔴', color: 'border-red-400/30     bg-red-400/5',     titleColor: 'text-red-400'     },
                  ].map(({ key, emoji, color, titleColor }) => {
                    const regex = new RegExp(`${key}:\\s*(.+?)(?=(?:STRENGTHS|WEAKNESSES|OPPORTUNITIES|THREATS):|$)`, 'is')
                    const match = report.swot_analysis!.match(regex)
                    const text = match ? match[1].trim() : ''
                    return (
                      <div key={key} className={`border ${color} rounded-xl p-3`}>
                        <p className={`text-xs font-bold ${titleColor} mb-2`}>{emoji} {key}</p>
                        <p className="text-slate-300 text-xs leading-relaxed">{text}</p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════ TAB: PROJECTIONS ═══════════ */}
        {activeTab === 'projections' && (
          <div className="space-y-4">

            {/* 3 year table */}
            {projections.year1 && (
              <Card title="3-Year Financial Projections" icon="📅">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left text-slate-500 font-medium pb-3">Metric</th>
                        <th className="text-right text-slate-400 font-semibold pb-3">Year 1</th>
                        <th className="text-right text-slate-400 font-semibold pb-3">Year 2</th>
                        <th className="text-right text-slate-400 font-semibold pb-3">Year 3</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      {[
                        { label: 'Revenue',    key: 'revenue',   color: 'text-white' },
                        { label: 'Costs',      key: 'costs',     color: 'text-red-400' },
                        { label: 'Net Profit', key: 'netProfit', color: 'text-emerald-400' },
                      ].map(({ label, key, color }) => (
                        <tr key={key} className="border-b border-slate-800">
                          <td className="py-3 text-slate-400">{label}</td>
                          <td className={`py-3 text-right font-semibold ${color}`}>{fmt(projections.year1?.[key])}</td>
                          <td className={`py-3 text-right font-semibold ${color}`}>{fmt(projections.year2?.[key])}</td>
                          <td className={`py-3 text-right font-semibold ${color}`}>{fmt(projections.year3?.[key])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <p className="text-slate-300 text-sm leading-relaxed">{report.three_year_projection}</p>
                </div>
              </Card>
            )}

            {/* P&L summary */}
            {report.pl_summary && (
              <Card title="P&L Summary" icon="📋">
                <p className="text-slate-300 text-sm leading-relaxed">{report.pl_summary}</p>
              </Card>
            )}

            {/* Sensitivity */}
            {report.sensitivity_analysis && (
              <Card title="Sensitivity Analysis" icon="🎲">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">{report.sensitivity_analysis}</p>
                {riskScenarios.worst && (
                  <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
                    <p className="text-amber-400 text-xs font-semibold mb-2">⚠️ Worst-case cash buffer required</p>
                    <p className="text-2xl font-black text-white">
                      {riskScenarios.worst.cashBufferNeeded > 0
                        ? fmt(riskScenarios.worst.cashBufferNeeded)
                        : 'None required'}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">At 70% of baseline demand</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* ── Footer ── */}
     <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
  <div className="text-slate-600 text-xs">
    Report ID: {report.id} · Generated {new Date(report.created_at).toLocaleString('en-AU')}
  </div>
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <ExportPDFButton report={report} />
    <ShareButton
      reportId={report.report_id ?? report.id}
      initialIsPublic={report.is_public ?? false}
      initialToken={report.public_token ?? null}
    />
    <button
      onClick={() => router.push('/onboarding')}
      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all"
    >
      ➕ Analyse another location
   </button>
          </div>
        </div>
      </div>
    </div>
  )
}