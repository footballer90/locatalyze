'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReportSummary {
  id: string
  report_id: string | null
  verdict: string | null
  overall_score: number | null
  location_name: string | null
  business_type: string | null
  monthly_rent: number | null
  breakeven_months: number | null
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function verdictConfig(verdict: string | null) {
  if (verdict === 'GO')      return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' }
  if (verdict === 'CAUTION') return { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30'   }
  return                            { color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30'     }
}

function fmt(n: number | null) {
  if (n == null) return '—'
  return '$' + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl mb-6">
        📍
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">No analyses yet</h2>
      <p className="text-slate-400 text-center max-w-sm mb-8">
        Run your first location analysis to get an AI-powered feasibility report in 20 seconds.
      </p>
      <button
        onClick={onNew}
        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all text-lg"
      >
        ➕ Analyse your first location
      </button>
    </div>
  )
}

// ─── Report Card (mobile) ─────────────────────────────────────────────────────
function ReportCard({ report, onClick }: { report: ReportSummary; onClick: () => void }) {
  const vc = verdictConfig(report.verdict)
  return (
    <div
      onClick={onClick}
      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 cursor-pointer hover:border-slate-500 hover:bg-slate-800 transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{report.business_type || 'Report'}</p>
          <p className="text-slate-400 text-sm truncate">{report.location_name || '—'}</p>
        </div>
        <div className={`flex-shrink-0 px-3 py-1 rounded-full border text-xs font-bold ${vc.color} ${vc.bg} ${vc.border}`}>
          {report.verdict || '—'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-slate-900/60 rounded-xl p-2.5 text-center">
          <p className={`text-lg font-black ${vc.color}`}>{report.overall_score ?? '—'}</p>
          <p className="text-slate-500 text-xs">score</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2.5 text-center">
          <p className="text-sm font-bold text-white">{fmt(report.monthly_rent)}</p>
          <p className="text-slate-500 text-xs">rent/mo</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-2.5 text-center">
          <p className="text-sm font-bold text-white">
            {report.breakeven_months === 999 || !report.breakeven_months ? '—' : `${report.breakeven_months}mo`}
          </p>
          <p className="text-slate-500 text-xs">payback</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs">{timeAgo(report.created_at)}</span>
        <span className="text-emerald-400 text-xs font-medium">View report →</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)

      // Fetch reports for this user from Supabase
      const { data, error } = await supabase
        .from('reports')
        .select('id, report_id, verdict, overall_score, location_name, business_type, monthly_rent, breakeven_months, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) setReports(data as ReportSummary[])
      setLoading(false)
    }
    load()
  }, [router])

  function navigateToReport(report: ReportSummary) {
    // Use report_id (req_...) if available, otherwise fall back to id (UUID)
    const id = report.report_id || report.id
    router.push(`/dashboard/${id}`)
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm">Loading your reports...</p>
        </div>
      </div>
    )
  }

  // ── Stats bar (only show if there are reports) ────────────────────────────
  const goCount      = reports.filter(r => r.verdict === 'GO').length
  const cautionCount = reports.filter(r => r.verdict === 'CAUTION').length
  const noCount      = reports.filter(r => r.verdict === 'NO').length
  const avgScore     = reports.length
    ? Math.round(reports.reduce((s, r) => s + (r.overall_score ?? 0), 0) / reports.length)
    : null

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your analyses</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {reports.length === 0
                ? 'No reports yet'
                : `${reports.length} location${reports.length !== 1 ? 's' : ''} analysed`}
            </p>
          </div>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all text-sm"
          >
            ➕ New analysis
          </button>
        </div>

        {/* ── Empty state ── */}
        {reports.length === 0 && (
          <EmptyState onNew={() => router.push('/onboarding')} />
        )}

        {/* ── Stats bar ── */}
        {reports.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total analyses', value: reports.length.toString(),  color: 'text-white' },
              { label: 'GO verdicts',    value: goCount.toString(),          color: 'text-emerald-400' },
              { label: 'CAUTION',        value: cautionCount.toString(),     color: 'text-amber-400' },
              { label: 'Avg score',      value: avgScore ? `${avgScore}/100` : '—', color: 'text-blue-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-center">
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Mobile cards ── */}
        {reports.length > 0 && (
          <>
            {/* Mobile: card grid */}
            <div className="grid gap-3 md:hidden">
              {reports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => navigateToReport(report)}
                />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Location</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Business</th>
                    <th className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Verdict</th>
                    <th className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Score</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Rent/mo</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-4">Payback</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, i) => {
                    const vc = verdictConfig(report.verdict)
                    return (
                      <tr
                        key={report.id}
                        onClick={() => navigateToReport(report)}
                        className={`cursor-pointer hover:bg-slate-700/30 transition-colors ${
                          i < reports.length - 1 ? 'border-b border-slate-700/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <p className="text-white text-sm font-medium truncate max-w-[200px]">
                            {report.location_name || '—'}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-300 text-sm">{report.business_type || '—'}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${vc.color} ${vc.bg} ${vc.border}`}>
                            {report.verdict || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-sm font-bold ${vc.color}`}>
                            {report.overall_score ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-slate-300 text-sm">{fmt(report.monthly_rent)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-slate-300 text-sm">
                            {report.breakeven_months === 999 || !report.breakeven_months
                              ? '—'
                              : `${report.breakeven_months} months`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-slate-500 text-sm">{timeAgo(report.created_at)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Footer note ── */}
        {reports.length > 0 && (
          <p className="text-center text-slate-600 text-xs mt-6">
            Reports are saved to your account and accessible anytime.
          </p>
        )}
      </div>
    </div>
  )
}