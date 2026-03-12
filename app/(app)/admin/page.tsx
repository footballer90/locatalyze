'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── Your admin email — change this to your email ──────────────────────────────
const ADMIN_EMAILS = ['pg4441@gmail.com']

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

function fmt(n: number) {
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
  return `${days}d ago`
}

function VerdictPill({ v }: { v: string }) {
  const cfg =
    v === 'GO'      ? { bg: S.emeraldBg, color: S.emerald, border: S.emeraldBdr } :
    v === 'CAUTION' ? { bg: S.amberBg,   color: S.amber,   border: S.amberBdr   } :
                      { bg: S.redBg,     color: S.red,     border: S.redBdr     }
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
      {v}
    </span>
  )
}

// ── Sparkline bar chart ───────────────────────────────────────────────────────
function SparkBars({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: color, borderRadius: 3, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.4, height: `${(v / max) * 100}%`, minHeight: v > 0 ? 4 : 2 }} />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview')

  // ── Data state ──
  const [stats, setStats] = useState({
    totalUsers: 0, totalReports: 0,
    reportsToday: 0, reportsThisWeek: 0,
    goCount: 0, cautionCount: 0, noCount: 0,
    proUsers: 0, freeUsers: 0,
    avgScore: 0, estMonthlyRevenue: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [sparkData, setSparkData] = useState<number[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        setUnauthorized(true); setLoading(false); return
      }

      // ── Fetch all reports ──
      const { data: allReports } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      const rpts = allReports || []
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const weekAgo  = new Date(now.getTime() - 7 * 86400000)

      // Build 14-day sparkline
      const spark: number[] = []
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000).toISOString().split('T')[0]
        spark.push(rpts.filter(r => r.created_at?.startsWith(d)).length)
      }
      setSparkData(spark)

      const scores = rpts.map(r => r.overall_score).filter(Boolean)
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

      setStats({
        totalReports:      rpts.length,
        reportsToday:      rpts.filter(r => r.created_at?.startsWith(todayStr)).length,
        reportsThisWeek:   rpts.filter(r => new Date(r.created_at) >= weekAgo).length,
        goCount:           rpts.filter(r => r.verdict === 'GO').length,
        cautionCount:      rpts.filter(r => r.verdict === 'CAUTION').length,
        noCount:           rpts.filter(r => r.verdict === 'NO').length,
        avgScore,
        totalUsers: 0, proUsers: 0, freeUsers: 0,
        estMonthlyRevenue: 0,
      })
      setReports(rpts.slice(0, 50))

      // ── Fetch user profiles ──
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      const profs = profiles || []
      const proCount  = profs.filter(p => p.plan === 'pro').length
      const freeCount = profs.filter(p => p.plan !== 'pro').length
      const lifetimeCount  = profs.filter(p => p.plan_type === 'lifetime').length
      const monthlyCount   = profs.filter(p => p.plan_type === 'monthly').length
      const estRevenue     = lifetimeCount * 49 + monthlyCount * 19

      setStats(s => ({ ...s, totalUsers: profs.length, proUsers: proCount, freeUsers: freeCount, estMonthlyRevenue: estRevenue }))

      // Build user rows with report counts
      const userRows = profs.map(p => ({
        ...p,
        reportCount: rpts.filter(r => r.user_id === p.user_id).length,
        lastReport:  rpts.find(r => r.user_id === p.user_id)?.created_at || null,
      }))
      setUsers(userRows)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${S.n100}`, borderTop: `3px solid ${S.brand}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: S.n400, fontSize: 14 }}>Loading admin data...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (unauthorized) return (
    <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🔒</p>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Access denied</h1>
        <p style={{ color: S.n500, fontSize: 14, marginBottom: 20 }}>This page is only accessible to admins.</p>
        <button onClick={() => router.push('/dashboard')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: S.font }}>
          ← Back to dashboard
        </button>
      </div>
    </div>
  )

  const conversionRate = stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;cursor:pointer;} @keyframes spin{to{transform:rotate(360deg)}} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ── Top nav ── */}
      <nav style={{ background: S.n900, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: S.white, letterSpacing: '-0.02em' }}>Locatalyze</span>
          </div>
          <span style={{ fontSize: 11, color: S.n500, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px', fontWeight: 600 }}>ADMIN</span>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ fontSize: 13, color: S.n400, background: 'none', border: 'none', fontWeight: 500 }}>
          ← Back to app
        </button>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── Page title ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: S.n400 }}>Live data from your Supabase database</p>
        </div>

        {/* ── KPI cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Users',       value: stats.totalUsers,       icon: '👥', sub: `${stats.proUsers} Pro · ${stats.freeUsers} Free`,     color: S.blue,    bg: S.blueBg    },
            { label: 'Total Reports',     value: stats.totalReports,     icon: '📊', sub: `${stats.reportsToday} today · ${stats.reportsThisWeek} this week`, color: S.brand,   bg: S.brandFaded },
            { label: 'Conversion Rate',   value: `${conversionRate}%`,   icon: '🎯', sub: `${stats.proUsers} of ${stats.totalUsers} upgraded`,    color: S.emerald, bg: S.emeraldBg },
            { label: 'Est. Revenue',      value: fmt(stats.estMonthlyRevenue), icon: '💰', sub: 'Lifetime + monthly',                             color: S.amber,   bg: S.amberBg   },
          ].map(k => (
            <div key={k.label} style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k.label}</p>
                <span style={{ fontSize: 18 }}>{k.icon}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 900, color: k.color, letterSpacing: '-0.03em', marginBottom: 4 }}>{k.value}</p>
              <p style={{ fontSize: 11, color: S.n400 }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Secondary stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {/* Verdict breakdown */}
          <div style={{ gridColumn: 'span 2', background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Verdict Distribution</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'GO',      count: stats.goCount,      color: S.emerald, bg: S.emeraldBg },
                { label: 'CAUTION', count: stats.cautionCount, color: S.amber,   bg: S.amberBg   },
                { label: 'NO',      count: stats.noCount,      color: S.red,     bg: S.redBg     },
              ].map(v => (
                <div key={v.label} style={{ flex: 1, background: v.bg, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 900, color: v.color }}>{v.count}</p>
                  <p style={{ fontSize: 11, color: v.color, fontWeight: 700 }}>{v.label}</p>
                </div>
              ))}
            </div>
            {stats.totalReports > 0 && (
              <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(stats.goCount / stats.totalReports) * 100}%`, background: S.emerald }} />
                <div style={{ width: `${(stats.cautionCount / stats.totalReports) * 100}%`, background: S.amber }} />
                <div style={{ width: `${(stats.noCount / stats.totalReports) * 100}%`, background: S.red }} />
              </div>
            )}
          </div>

          {/* Avg score */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Location Score</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: S.brand, letterSpacing: '-0.03em' }}>{stats.avgScore}<span style={{ fontSize: 16, color: S.n400 }}>/100</span></p>
            <p style={{ fontSize: 11, color: S.n400 }}>Across all reports</p>
          </div>

          {/* 14-day activity */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Reports · Last 14 days</p>
            <SparkBars data={sparkData} color={S.brand} />
            <p style={{ fontSize: 11, color: S.n400, marginTop: 6 }}>{stats.reportsThisWeek} this week</p>
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: S.n100, borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {(['overview', 'users', 'reports'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '8px 18px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600, background: activeTab === t ? S.white : 'transparent', color: activeTab === t ? S.n900 : S.n500, boxShadow: activeTab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize' }}>
              {t === 'overview' ? '📊 Overview' : t === 'users' ? `👥 Users (${stats.totalUsers})` : `📄 Reports (${stats.totalReports})`}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Top locations */}
            <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 16 }}>🏆 Top scoring reports</p>
              {reports.slice(0, 5).sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0)).map((r, i) => (
                <div key={r.report_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? `1px solid ${S.n100}` : 'none' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: S.n200, width: 20 }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: S.n800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.location_name || 'Unknown'}</p>
                    <p style={{ fontSize: 11, color: S.n400 }}>{r.business_type}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <VerdictPill v={r.verdict || '—'} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: S.brand }}>{r.overall_score}</span>
                  </div>
                </div>
              ))}
              {reports.length === 0 && <p style={{ fontSize: 13, color: S.n400 }}>No reports yet.</p>}
            </div>

            {/* Most active users */}
            <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 16 }}>🔥 Most active users</p>
              {[...users].sort((a, b) => b.reportCount - a.reportCount).slice(0, 5).map((u, i) => (
                <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? `1px solid ${S.n100}` : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: S.brand, flexShrink: 0 }}>
                    {(u.email || u.user_id || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: S.n800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email || u.user_id?.slice(0, 8) + '...'}</p>
                    <p style={{ fontSize: 11, color: S.n400 }}>{u.lastReport ? timeAgo(u.lastReport) : 'No reports'}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: u.plan === 'pro' ? S.emerald : S.n400, background: u.plan === 'pro' ? S.emeraldBg : S.n100, borderRadius: 100, padding: '2px 8px' }}>{u.plan === 'pro' ? 'PRO' : 'FREE'}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n700 }}>{u.reportCount}</span>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p style={{ fontSize: 13, color: S.n400 }}>No users yet.</p>}
            </div>
          </div>
        )}

        {/* ── Users tab ── */}
        {activeTab === 'users' && (
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
                  {['User', 'Plan', 'Reports', 'Last active', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: S.n400, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: S.n400, fontSize: 14 }}>No users found. Make sure the user_profiles table exists in Supabase.</td></tr>
                ) : users.map((u, i) => (
                  <tr key={u.user_id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: S.brand, flexShrink: 0 }}>
                          {(u.email || 'U')[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, color: S.n800, fontWeight: 500 }}>{u.email || u.user_id?.slice(0, 12) + '...'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: u.plan === 'pro' ? S.emerald : S.n400, background: u.plan === 'pro' ? S.emeraldBg : S.n100, borderRadius: 100, padding: '3px 10px' }}>
                        {u.plan === 'pro' ? `PRO · ${u.plan_type || ''}` : 'FREE'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: S.n800 }}>{u.reportCount}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: S.n500 }}>{u.lastReport ? timeAgo(u.lastReport) : '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: S.n500 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-AU') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Reports tab ── */}
        {activeTab === 'reports' && (
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
                  {['Location', 'Business type', 'Verdict', 'Score', 'Created'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: S.n400, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: S.n400, fontSize: 14 }}>No reports found.</td></tr>
                ) : reports.map((r, i) => (
                  <tr key={r.report_id} style={{ borderBottom: i < reports.length - 1 ? `1px solid ${S.n100}` : 'none', cursor: 'pointer' }}
                    onClick={() => router.push(`/dashboard/${r.report_id}`)}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: S.n800 }}>{r.location_name?.split(',')[0] || 'Unknown'}</p>
                      <p style={{ fontSize: 11, color: S.n400 }}>{r.location_name?.split(',').slice(1).join(',').trim() || ''}</p>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: S.n700 }}>{r.business_type || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><VerdictPill v={r.verdict || '—'} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 48, height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${r.overall_score || 0}%`, background: r.overall_score >= 70 ? S.emerald : r.overall_score >= 50 ? S.amber : S.red, borderRadius: 100 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>{r.overall_score ?? '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: S.n500 }}>{r.created_at ? timeAgo(r.created_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}