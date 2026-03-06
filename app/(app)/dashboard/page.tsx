'use client'
import { useEffect, useState } from 'react'
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

interface Report {
  id: string
  report_id?: string | null
  verdict: string | null
  overall_score: number | null
  score_rent: number | null
  score_competition: number | null
  score_demand: number | null
  score_profitability: number | null
  recommendation: string | null
  competitor_analysis: string | null
  location_name: string | null
  business_type: string | null
  monthly_rent: number | null
  breakeven_months: number | null
  breakeven_daily: number | null
  created_at: string
  result_data: any
}

function verdictCfg(v: string | null) {
  if (v === 'GO')      return { label: 'GO',      icon: '✅', bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr }
  if (v === 'CAUTION') return { label: 'CAUTION', icon: '⚠️', bg: S.amberBg,   text: S.amber,   border: S.amberBdr   }
  return                      { label: 'NO',      icon: '🚫', bg: S.redBg,     text: S.red,     border: S.redBdr     }
}

function fmt(n: number | null | undefined, prefix = '$') {
  if (n == null) return '—'
  if (n >= 1000) return prefix + (n / 1000).toFixed(0) + 'k'
  return prefix + n
}

function fmtFull(n: number | null | undefined, prefix = '$') {
  if (n == null) return '—'
  return prefix + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function scoreColor(s: number) {
  if (s >= 70) return S.emerald
  if (s >= 45) return S.amber
  return S.red
}

// ─── Mini score bar for comparison table ─────────────────────────────────────
function MiniBar({ score }: { score: number | null }) {
  const s = score ?? 0
  const color = scoreColor(s)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s}%`, background: color, borderRadius: 100 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 22, textAlign: 'right' }}>{s}</span>
    </div>
  )
}

// ─── Best location algorithm ──────────────────────────────────────────────────
function pickWinner(reports: Report[]) {
  if (reports.length < 2) return null
  const scored = reports.map(r => {
    const fin = r.result_data?.financials || {}
    const profitScore   = Math.min((fin.monthlyNetProfit || 0) / 1000, 40)
    const scoreScore    = (r.overall_score || 0) * 0.4
    const paybackScore  = r.breakeven_months ? Math.max(0, 20 - r.breakeven_months) : 0
    return { report: r, total: profitScore + scoreScore + paybackScore }
  })
  scored.sort((a, b) => b.total - a.total)
  const winner = scored[0].report
  const fin = winner.result_data?.financials || {}

  const reasons: string[] = []
  if ((winner.overall_score || 0) === Math.max(...reports.map(r => r.overall_score || 0)))
    reasons.push('Highest overall location score')
  if ((fin.monthlyNetProfit || 0) === Math.max(...reports.map(r => r.result_data?.financials?.monthlyNetProfit || 0)))
    reasons.push('Strongest profit potential')
  if ((winner.score_demand || 0) === Math.max(...reports.map(r => r.score_demand || 0)))
    reasons.push('Best demand & demographics')
  if ((winner.breakeven_months || 999) === Math.min(...reports.map(r => r.breakeven_months || 999)))
    reasons.push('Fastest payback period')
  if (reasons.length === 0) reasons.push('Best combined score across all metrics')

  return { report: winner, reasons: reasons.slice(0, 3) }
}

// ─── Comparison View ──────────────────────────────────────────────────────────
function ComparisonView({ reports, onClose }: { reports: Report[]; onClose: () => void }) {
  const winner = pickWinner(reports)

  const rows = {
    scores: [
      { label: 'Demand & Demographics', key: 'score_demand'        },
      { label: 'Competition',           key: 'score_competition'   },
      { label: 'Rent Affordability',    key: 'score_rent'          },
      { label: 'Profitability',         key: 'score_profitability' },
    ],
    financials: [
      { label: 'Est. Monthly Revenue', fn: (r: Report) => fmt(r.result_data?.financials?.monthlyRevenue) },
      { label: 'Est. Monthly Profit',  fn: (r: Report) => fmt(r.result_data?.financials?.monthlyNetProfit) },
      { label: 'Break-even Period',    fn: (r: Report) => r.breakeven_months && r.breakeven_months !== 999 ? `${r.breakeven_months} months` : 'Not viable' },
      { label: 'Break-even / Day',     fn: (r: Report) => r.breakeven_daily ? `${r.breakeven_daily} customers` : '—' },
    ],
  }

  const colWidth = `${Math.floor(70 / reports.length)}%`

  return (
    <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 24 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: S.white, letterSpacing: '-0.02em' }}>Location Comparison</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{reports.length} locations compared side by side</p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: S.white, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
          ✕ Close
        </button>
      </div>

      <div style={{ padding: '0 24px 24px' }}>

        {/* 🏆 Winner banner */}
        {winner && (
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 14, padding: '16px 20px', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: S.amber, marginBottom: 4 }}>BEST OPPORTUNITY</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', marginBottom: 8 }}>{winner.report.location_name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {winner.reasons.map((r, i) => (
                    <p key={i} style={{ fontSize: 12, color: S.n700 }}>· {r}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Section 1: Verdict + Score ── */}
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, marginTop: 4 }}>Overall Verdict</p>
        <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          {/* Column headers */}
          <div style={{ display: 'flex', background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
            <div style={{ width: '30%', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n400 }}>Location</div>
            {reports.map(r => (
              <div key={r.id} style={{ width: colWidth, padding: '10px 14px', fontSize: 12, fontWeight: 700, color: winner?.report.id === r.id ? S.brand : S.n800, borderLeft: `1px solid ${S.n200}` }}>
                {winner?.report.id === r.id && <span style={{ marginRight: 4 }}>🏆</span>}
                {r.location_name?.split(',')[0] || r.business_type}
              </div>
            ))}
          </div>
          {/* Verdict row */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${S.n100}` }}>
            <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n500 }}>Verdict</div>
            {reports.map(r => {
              const vc = verdictCfg(r.verdict)
              return (
                <div key={r.id} style={{ width: colWidth, padding: '12px 14px', borderLeft: `1px solid ${S.n100}` }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: vc.bg, color: vc.text, border: `1px solid ${vc.border}`, borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    <span>{vc.icon}</span> {vc.label}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Score row */}
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n500 }}>Overall Score</div>
            {reports.map(r => (
              <div key={r.id} style={{ width: colWidth, padding: '12px 14px', borderLeft: `1px solid ${S.n100}` }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(r.overall_score || 0) }}>{r.overall_score}</span>
                <span style={{ fontSize: 11, color: S.n400 }}>/100</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Score Breakdown ── */}
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Score Breakdown</p>
        <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'flex', background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
            <div style={{ width: '30%', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n400 }}>Metric</div>
            {reports.map(r => (
              <div key={r.id} style={{ width: colWidth, padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n500, borderLeft: `1px solid ${S.n200}` }}>
                {r.location_name?.split(',')[0] || r.business_type}
              </div>
            ))}
          </div>
          {rows.scores.map((row, idx) => (
            <div key={row.key} style={{ display: 'flex', borderBottom: idx < rows.scores.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
              <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n700, fontWeight: 500 }}>{row.label}</div>
              {reports.map(r => (
                <div key={r.id} style={{ width: colWidth, padding: '12px 14px', borderLeft: `1px solid ${S.n100}` }}>
                  <MiniBar score={r[row.key as keyof Report] as number} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Section 3: Financials ── */}
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Financial Metrics</p>
        <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'flex', background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
            <div style={{ width: '30%', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n400 }}>Metric</div>
            {reports.map(r => (
              <div key={r.id} style={{ width: colWidth, padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n500, borderLeft: `1px solid ${S.n200}` }}>
                {r.location_name?.split(',')[0] || r.business_type}
              </div>
            ))}
          </div>
          {rows.financials.map((row, idx) => (
            <div key={row.label} style={{ display: 'flex', borderBottom: idx < rows.financials.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
              <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n700, fontWeight: 500 }}>{row.label}</div>
              {reports.map(r => (
                <div key={r.id} style={{ width: colWidth, padding: '12px 14px', fontSize: 13, fontWeight: 700, color: S.n800, borderLeft: `1px solid ${S.n100}` }}>
                  {row.fn(r)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Section 4: Risk Summary ── */}
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Risk Summary</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${reports.length}, 1fr)`, gap: 10 }}>
          {reports.map(r => {
            const vc = verdictCfg(r.verdict)
            const fin = r.result_data?.financials || {}
            const risks: string[] = []
            if ((r.score_rent || 0) < 50)        risks.push('High rent burden')
            if ((r.score_competition || 0) < 50)  risks.push('High competitor density')
            if ((r.score_demand || 0) < 50)       risks.push('Low demand signal')
            if ((fin.rent?.toRevenuePercent || 0) > 20) risks.push(`Rent is ${fin.rent?.toRevenuePercent}% of revenue`)
            if (r.breakeven_months && r.breakeven_months > 18) risks.push('Long payback period')
            if (risks.length === 0) risks.push('No major risk flags')
            return (
              <div key={r.id} style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: vc.text, marginBottom: 10 }}>
                  {vc.icon} {r.location_name?.split(',')[0] || r.business_type}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {risks.map((risk, i) => (
                    <p key={i} style={{ fontSize: 11, color: vc.text, opacity: 0.85 }}>· {risk}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setReports((data || []) as Report[])
      setLoading(false)
    }
    load()
  }, [])

  function toggleSelect(id: string) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const selectedReports = reports.filter(r => selected.includes(r.id))

  const stats = {
    total:   reports.length,
    go:      reports.filter(r => r.verdict === 'GO').length,
    caution: reports.filter(r => r.verdict === 'CAUTION').length,
    no:      reports.filter(r => r.verdict === 'NO').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} button{font-family:inherit;cursor:pointer;} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ── Nav ── */}
      <nav style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
          <span style={{ fontSize: 10, background: S.brandFaded, color: S.brand, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>FREE</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {compareMode && selected.length >= 2 && (
            <button
              onClick={() => setComparing(true)}
              style={{ background: S.amber, color: S.white, border: 'none', borderRadius: 9, padding: '7px 16px', fontSize: 12, fontWeight: 700 }}
            >
              ⚖️ Compare {selected.length} Locations
            </button>
          )}
          {reports.length >= 2 && (
            <button
              onClick={() => { setCompareMode(!compareMode); setSelected([]); setComparing(false) }}
              style={{ background: compareMode ? S.n100 : S.white, color: compareMode ? S.brand : S.n700, border: `1.5px solid ${compareMode ? S.brandBorder : S.n200}`, borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 600 }}
            >
              {compareMode ? '✕ Exit Compare' : '⚖️ Compare Locations'}
            </button>
          )}
          <button
            onClick={() => router.push('/onboarding')}
            style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 6px rgba(15,118,110,0.2)' }}
          >
            + New Analysis
          </button>
          <button
            onClick={async () => { const s = createClient(); await s.auth.signOut(); router.push('/auth/login') }}
            style={{ background: 'none', border: 'none', fontSize: 12, color: S.n400, fontWeight: 500 }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── Compare mode banner ── */}
        {compareMode && (
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.amber }}>⚖️ Compare Mode Active</p>
              <p style={{ fontSize: 12, color: S.n700, marginTop: 2 }}>
                {selected.length === 0 && 'Select 2 or 3 locations using the checkboxes below'}
                {selected.length === 1 && 'Select 1 or 2 more locations'}
                {selected.length >= 2 && `${selected.length} locations selected — click "Compare" to see results`}
              </p>
            </div>
            {selected.length >= 2 && (
              <button
                onClick={() => setComparing(true)}
                style={{ background: S.amber, color: S.white, border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700 }}
              >
                Compare →
              </button>
            )}
          </div>
        )}

        {/* ── Comparison view ── */}
        {comparing && selectedReports.length >= 2 && (
          <ComparisonView
            reports={selectedReports}
            onClose={() => { setComparing(false); setSelected([]); setCompareMode(false) }}
          />
        )}

        {/* ── Welcome ── */}
        {!comparing && (
          <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 20, padding: '24px 28px', marginBottom: 20, boxShadow: '0 4px 20px rgba(15,118,110,0.2)' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Welcome back 👋</p>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: S.white, letterSpacing: '-0.02em', marginBottom: 16 }}>
              {user?.email?.split('@')[0] || 'Your'} Dashboard
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {[
                { l: 'Total Reports', v: stats.total, c: S.white       },
                { l: 'GO',           v: stats.go,    c: '#6EE7B7'     },
                { l: 'CAUTION',      v: stats.caution, c: '#FCD34D'   },
                { l: 'NO',           v: stats.no,    c: '#FCA5A5'     },
              ].map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 14px' }}>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{s.l}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: s.c }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Report list ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${S.n200}`, borderTopColor: S.brand, margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ fontSize: 13, color: S.n400 }}>Loading reports…</p>
          </div>
        ) : reports.length === 0 ? (
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>📍</p>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 8 }}>No analyses yet</h2>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 24 }}>Run your first location analysis to get started.</p>
            <button
              onClick={() => router.push('/onboarding')}
              style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, boxShadow: '0 2px 8px rgba(15,118,110,0.25)' }}
            >
              + Analyse a location
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {reports.length} Report{reports.length !== 1 ? 's' : ''}
              </p>
              {compareMode && selected.length > 0 && (
                <p style={{ fontSize: 12, color: S.amber, fontWeight: 600 }}>{selected.length}/3 selected</p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reports.map(r => {
                const vc = verdictCfg(r.verdict)
                const isSelected = selected.includes(r.id)
                const fin = r.result_data?.financials || {}
                return (
                  <div
                    key={r.id}
                    onClick={() => compareMode ? toggleSelect(r.id) : router.push(`/dashboard/${r.report_id || r.id}`)}
                    style={{
                      background: S.white,
                      borderRadius: 16,
                      border: `1.5px solid ${isSelected ? S.brand : S.n200}`,
                      boxShadow: isSelected ? `0 0 0 3px ${S.brandFaded}` : '0 1px 3px rgba(0,0,0,0.04)',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    {/* Checkbox in compare mode */}
                    {compareMode && (
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, border: `2px solid ${isSelected ? S.brand : S.n300 as any}`,
                        background: isSelected ? S.brand : S.white, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && <span style={{ color: S.white, fontSize: 11, fontWeight: 800 }}>✓</span>}
                      </div>
                    )}

                    {/* Verdict dot */}
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: vc.bg, border: `1px solid ${vc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {vc.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 2 }}>{r.business_type}</p>
                          <p style={{ fontSize: 12, color: S.n400 }}>📍 {r.location_name}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: vc.text, lineHeight: 1 }}>{r.overall_score}</p>
                          <p style={{ fontSize: 10, color: S.n400 }}>score</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                        <span style={{ fontSize: 11, color: S.n500 }}>💰 {fmt(fin.monthlyRevenue)}/mo est.</span>
                        <span style={{ fontSize: 11, color: S.n500 }}>📈 {fmt(fin.monthlyNetProfit)} profit</span>
                        <span style={{ fontSize: 11, color: S.n400, marginLeft: 'auto' }}>{timeAgo(r.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}