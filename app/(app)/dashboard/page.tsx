'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

function verdictStyle(v: string | null) {
  if (v === 'GO')      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }
  if (v === 'CAUTION') return { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'   }
  return                      { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500'     }
}

function fmt(n: number | null) {
  if (!n) return '—'
  return '$' + n.toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function Navbar({ userName }: { userName?: string }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-bold">L</div>
          <span className="font-bold text-stone-900 text-sm">Locatalyze</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">FREE</span>
          <Link href="/onboarding" className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
            + New analysis
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-3xl mx-auto mb-5">
        📍
      </div>
      <h2 className="text-xl font-bold text-stone-900 mb-2">No analyses yet</h2>
      <p className="text-stone-400 text-sm max-w-sm mx-auto mb-6">
        Run your first location analysis to find out if a site will make you money before you sign the lease.
      </p>
      <Link
        href="/onboarding"
        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
      >
        Analyse your first location →
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      setUserEmail(user.email?.split('@')[0] || 'there')

      const { data } = await supabase
        .from('reports')
        .select('id, report_id, verdict, overall_score, location_name, business_type, monthly_rent, breakeven_months, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setReports(data as ReportSummary[])
      setLoading(false)
    }
    load()
  }, [router])

  function goToReport(r: ReportSummary) {
    router.push(`/dashboard/${r.report_id || r.id}`)
  }

  const goCount      = reports.filter(r => r.verdict === 'GO').length
  const cautionCount = reports.filter(r => r.verdict === 'CAUTION').length
  const noCount      = reports.filter(r => r.verdict === 'NO').length

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400">Loading your reports...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <Navbar userName={userEmail} />

      <div className="max-w-5xl mx-auto px-4 py-6 pb-24">

        {/* Welcome card */}
        <div className="bg-teal-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 right-12 w-20 h-20 bg-white/5 rounded-full translate-y-6" />
          <p className="text-teal-100 text-sm mb-1">Welcome back, {userEmail} 👋</p>
          <h1 className="text-white font-bold text-xl mb-4">Ready to analyse your next location?</h1>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-colors"
          >
            New Analysis →
          </Link>
        </div>

        {/* Stats */}
        {reports.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total reports', value: reports.length, color: 'text-stone-800' },
              { label: 'GO verdicts', value: goCount, color: 'text-emerald-600' },
              { label: 'CAUTION', value: cautionCount, color: 'text-amber-600' },
              { label: 'NO verdicts', value: noCount, color: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reports section */}
        {reports.length === 0 ? <EmptyState /> : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-stone-700 text-sm">Active Reports</h2>
              <span className="text-xs text-stone-400">{reports.length} location{reports.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {reports.map(r => {
                const vs = verdictStyle(r.verdict)
                return (
                  <div
                    key={r.id}
                    onClick={() => goToReport(r)}
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 text-sm truncate">{r.business_type || 'Report'}</p>
                        <p className="text-xs text-stone-400 truncate mt-0.5">{r.location_name || '—'}</p>
                      </div>
                      <span className={`flex-shrink-0 ml-2 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${vs.bg} ${vs.text} ${vs.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vs.dot}`} />
                        {r.verdict}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span>Score: <strong className="text-stone-800">{r.overall_score ?? '—'}</strong></span>
                        <span>Rent: <strong className="text-stone-800">{fmt(r.monthly_rent)}/mo</strong></span>
                      </div>
                      <span className="text-xs text-stone-300">{timeAgo(r.created_at)}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left text-xs font-semibold text-stone-400 uppercase tracking-wide px-5 py-3">Location</th>
                    <th className="text-left text-xs font-semibold text-stone-400 uppercase tracking-wide px-4 py-3">Business</th>
                    <th className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wide px-4 py-3">Verdict</th>
                    <th className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wide px-4 py-3">Score</th>
                    <th className="text-right text-xs font-semibold text-stone-400 uppercase tracking-wide px-4 py-3">Rent/mo</th>
                    <th className="text-right text-xs font-semibold text-stone-400 uppercase tracking-wide px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => {
                    const vs = verdictStyle(r.verdict)
                    return (
                      <tr
                        key={r.id}
                        onClick={() => goToReport(r)}
                        className={`cursor-pointer hover:bg-stone-50 transition-colors ${i < reports.length - 1 ? 'border-b border-stone-50' : ''}`}
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-stone-700 font-medium truncate max-w-[200px]">{r.location_name || '—'}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-stone-500">{r.business_type || '—'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${vs.bg} ${vs.text} ${vs.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${vs.dot}`} />
                            {r.verdict || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-sm font-bold ${vs.text}`}>{r.overall_score ?? '—'}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-sm text-stone-500">{fmt(r.monthly_rent)}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-xs text-stone-400">{timeAgo(r.created_at)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 pb-safe">
        <div className="flex items-center justify-around h-16">
          {[
            { icon: '🏠', label: 'Home', href: '/dashboard', active: true },
            { icon: '📋', label: 'Reports', href: '/dashboard', active: false },
            { icon: '➕', label: 'Analyse', href: '/onboarding', active: false },
          ].map(item => (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 ${item.active ? 'text-teal-600' : 'text-stone-400'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}s