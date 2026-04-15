'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand:      '#0F766E',
  brandLight: '#14B8A6',
  brandFaded: '#F0FDFA',
  brandBorder: '#99F6E4',
  n50:        '#FAFAF9',
  n100:       '#F5F5F4',
  n200:       '#E7E5E4',
  n400:       '#A8A29E',
  n500:       '#78716C',
  n700:       '#44403C',
  n800:       '#292524',
  n900:       '#1C1917',
  white:      '#FFFFFF',
  emerald:    '#059669',
  emeraldBg:  '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber:      '#D97706',
  amberBg:    '#FFFBEB',
  amberBdr:   '#FDE68A',
  red:        '#DC2626',
  redBg:      '#FEF2F2',
  redBdr:     '#FECACA',
  blue:       '#2563EB',
  blueBg:     '#EFF6FF',
  blueBdr:    '#BFDBFE',
  // Sidebar specific
  sidebarBg:  '#0C1F1C',
  sidebarBorder: 'rgba(255,255,255,0.07)',
  sidebarText:  'rgba(255,255,255,0.55)',
  sidebarActive: 'rgba(255,255,255,0.08)',
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
  location_name: string | null
  business_type: string | null
  monthly_rent: number | null
  breakeven_months: number | null
  breakeven_daily: number | null
  created_at: string
  result_data: any
  computed_result?: { netProfit?: number; revenue?: number; breakEvenMonths?: number | null } | null
  label?: string | null
  // Save & Track
  is_saved?: boolean | null
  location_status?: string | null
  saved_at?: string | null
  // Feedback
  outcome_feedback?: any | null
}

function verdictCfg(v: string | null) {
  if (v === 'GO')      return { label: 'GO',      icon: 'go',      bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, dot: '#059669' }
  if (v === 'CAUTION') return { label: 'CAUTION', icon: 'caution', bg: S.amberBg,   text: S.amber,   border: S.amberBdr,   dot: '#D97706' }
  return                      { label: 'NO',      icon: 'no',      bg: S.redBg,     text: S.red,     border: S.redBdr,     dot: '#DC2626' }
}

function fmt(n: number | null | undefined, prefix = '$') {
  if (n == null) return ''
  if (n >= 1000) return prefix + (n / 1000).toFixed(0) + 'k'
  return prefix + n
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

/** Prefer computed_result.netProfit (engine v2) → fall back to result_data (legacy v1) */
function getNetProfit(r: Report): number {
  return r.computed_result?.netProfit ?? r.result_data?.financials?.monthlyNetProfit ?? 0
}
function getRevenue(r: Report): number {
  return r.computed_result?.revenue ?? r.result_data?.financials?.monthlyRevenue ?? 0
}
function getBEM(r: Report): number | null {
  const bm = r.computed_result?.breakEvenMonths ?? r.breakeven_months
  return (bm && bm !== 999) ? bm : null
}

function pickWinner(reports: Report[]) {
  if (reports.length < 2) return null
  const scored = reports.map(r => ({
    report: r,
    total: Math.min(getNetProfit(r) / 1000, 40)
         + (r.overall_score || 0) * 0.4
         + (getBEM(r) ? Math.max(0, 20 - getBEM(r)!) : 0),
  }))
  scored.sort((a, b) => b.total - a.total)
  const winner = scored[0].report
  const reasons: string[] = []
  if ((winner.overall_score || 0) === Math.max(...reports.map(r => r.overall_score || 0))) reasons.push('Highest overall location score')
  if (getNetProfit(winner) === Math.max(...reports.map(getNetProfit))) reasons.push('Strongest profit potential')
  if ((winner.score_demand || 0) === Math.max(...reports.map(r => r.score_demand || 0))) reasons.push('Best demand & demographics')
  const wBEM = getBEM(winner)
  if (wBEM && wBEM === Math.min(...reports.map(r => getBEM(r) ?? 999))) reasons.push('Fastest payback period')
  if (reasons.length === 0) reasons.push('Best combined score across all metrics')
  return { report: winner, reasons: reasons.slice(0, 3) }
}

//  Comparison View 
function ComparisonView({ reports, onClose }: { reports: Report[]; onClose: () => void }) {
  const winner = pickWinner(reports)
  const colWidth = `${Math.floor(70 / reports.length)}%`
  const rows = {
    scores: [
      { label: 'Demand & Demographics', key: 'score_demand'       },
      { label: 'Competition',           key: 'score_competition'  },
      { label: 'Rent Affordability',    key: 'score_rent'         },
      { label: 'Profitability',         key: 'score_profitability' },
    ],
    financials: [
      { label: 'Est. Monthly Revenue', fn: (r: Report) => fmt(getRevenue(r) || null) },
      { label: 'Est. Monthly Profit',  fn: (r: Report) => fmt(getNetProfit(r) || null) },
      { label: 'Break-even Period',    fn: (r: Report) => { const b = getBEM(r); return b ? `${b} mo` : 'Not viable' } },
      { label: 'Break-even / Day',     fn: (r: Report) => r.breakeven_daily ? `${r.breakeven_daily} customers` : '' },
    ],
  }
  return (
    <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Location Comparison</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{reports.length} locations side by side</p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: S.white, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700 }}> Close</button>
      </div>
      <div style={{ padding: '0 28px 28px' }}>
        {winner && (
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 14, padding: '16px 20px', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 28 }}></span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: S.amber, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Best Opportunity</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', marginBottom: 6 }}>{winner.report.location_name}</p>
                {winner.reasons.map((r, i) => <p key={i} style={{ fontSize: 12, color: S.n700 }}>· {r}</p>)}
              </div>
            </div>
          </div>
        )}
        <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20, marginTop: 4 }}>
          <div style={{ display: 'flex', background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
            <div style={{ width: '30%', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n400 }}>Location</div>
            {reports.map(r => <div key={r.id} style={{ width: colWidth, padding: '10px 14px', fontSize: 12, fontWeight: 700, color: winner?.report.id === r.id ? S.brand : S.n800, borderLeft: `1px solid ${S.n200}` }}>{winner?.report.id === r.id && ' '}{r.location_name?.split(',')[0] || r.business_type}</div>)}
          </div>
          <div style={{ display: 'flex', borderBottom: `1px solid ${S.n100}` }}>
            <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n500 }}>Verdict</div>
            {reports.map(r => { const vc = verdictCfg(r.verdict); return <div key={r.id} style={{ width: colWidth, padding: '12px 14px', borderLeft: `1px solid ${S.n100}` }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: vc.bg, color: vc.text, border: `1px solid ${vc.border}`, borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{vc.label}</span></div> })}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n500 }}>Score</div>
            {reports.map(r => <div key={r.id} style={{ width: colWidth, padding: '12px 14px', borderLeft: `1px solid ${S.n100}` }}><span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(r.overall_score || 0) }}>{r.overall_score}</span><span style={{ fontSize: 11, color: S.n400 }}>/100</span></div>)}
          </div>
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Score Breakdown</p>
        <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'flex', background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
            <div style={{ width: '30%', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n400 }}>Metric</div>
            {reports.map(r => <div key={r.id} style={{ width: colWidth, padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n500, borderLeft: `1px solid ${S.n200}` }}>{r.location_name?.split(',')[0] || r.business_type}</div>)}
          </div>
          {rows.scores.map((row, idx) => (
            <div key={row.key} style={{ display: 'flex', borderBottom: idx < rows.scores.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
              <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n700 }}>{row.label}</div>
              {reports.map(r => <div key={r.id} style={{ width: colWidth, padding: '12px 14px', borderLeft: `1px solid ${S.n100}` }}><MiniBar score={r[row.key as keyof Report] as number} /></div>)}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Financial Metrics</p>
        <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
            <div style={{ width: '30%', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n400 }}>Metric</div>
            {reports.map(r => <div key={r.id} style={{ width: colWidth, padding: '10px 14px', fontSize: 11, fontWeight: 700, color: S.n500, borderLeft: `1px solid ${S.n200}` }}>{r.location_name?.split(',')[0] || r.business_type}</div>)}
          </div>
          {rows.financials.map((row, idx) => (
            <div key={row.label} style={{ display: 'flex', borderBottom: idx < rows.financials.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
              <div style={{ width: '30%', padding: '12px 14px', fontSize: 12, color: S.n700 }}>{row.label}</div>
              {reports.map(r => <div key={r.id} style={{ width: colWidth, padding: '12px 14px', fontSize: 13, fontWeight: 700, color: S.n800, borderLeft: `1px solid ${S.n100}` }}>{row.fn(r)}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

//  Sidebar 
function Sidebar({ user, stats, reports, plan, onNewAnalysis, onSignOut }: {
  user: any; stats: any; reports: Report[]; plan: string; onNewAnalysis: () => void; onSignOut: () => void
}) {
  const FREE_LIMIT = 1
  const used = Math.min(reports.length, FREE_LIMIT)
  const pct = (used / FREE_LIMIT) * 100
  const quotaColor = used >= FREE_LIMIT ? S.red : S.emerald
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'annual' ? 'Annual' : plan === 'business' ? 'Business' : 'Free plan'

  const bestScore = reports.length > 0 ? Math.max(...reports.map(r => r.overall_score || 0)) : null
  const avgScore  = reports.length > 0 ? Math.round(reports.reduce((a, r) => a + (r.overall_score || 0), 0) / reports.length) : null

  return (
    <aside style={{
      width: 260, flexShrink: 0, background: S.sidebarBg,
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      borderRight: `1px solid ${S.sidebarBorder}`,
    }}>

      {/*  Logo  */}
      <div style={{ padding: '20px 20px 0', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
        </div>
      </div>

      {/*  Divider  */}
      <div style={{ height: 1, background: S.sidebarBorder, margin: '12px 20px' }} />

      {/* Nav */}
      <nav style={{ padding: '0 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>

        {/* Dashboard — active */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8, background: S.sidebarActive, cursor: 'default' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: S.white, letterSpacing: '-0.01em' }}>Dashboard</span>
        </div>

        {/* New analysis */}
        <NavItem label="New Analysis" onClick={onNewAnalysis}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </NavItem>

        {/* Compare locations */}
        <NavItem label="Compare Locations" href="/compare">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>
        </NavItem>

        {/* Methodology */}
        <NavItem label="Data & Methodology" href="/methodology">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        </NavItem>

        {/* Location guides */}
        <NavItem label="Location Guides" href="/analyse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </NavItem>

        {/* Profile */}
        <NavItem label="Profile" href="/profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </NavItem>
      </nav>

      {/*  User footer  */}
      <div style={{ padding: '12px', borderTop: `1px solid ${S.sidebarBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: S.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email?.split('@')[0]}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{planLabel}</p>
          </div>
          <button
            onClick={onSignOut}
            title="Sign out"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 14, cursor: 'pointer', padding: '4px', borderRadius: 6, lineHeight: 1 }}
          >
            
          </button>
        </div>
      </div>
    </aside>
  )
}

//  Main Dashboard 
function VerdictIcon({ type, color, size = 20 }: { type: string; color: string; size?: number }) {
  const p = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: '1.8', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'go') return <svg {...p} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
  if (type === 'caution') return <svg {...p} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  if (type === 'no') return <svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  return <svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
}

function StatIcon({ type, color, size = 20 }: { type: string; color: string; size?: number }) {
  const p = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: '1.8', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'total') return <svg {...p} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  if (type === 'go') return <svg {...p} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
  if (type === 'caution') return <svg {...p} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
  if (type === 'no') return <svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  return <svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
}


function shortAddr(addr?: string | null): string {
  if (!addr) return ''
  const m = addr.match(/\b(NSW|VIC|QLD|WA|SA|ACT|TAS|NT)\b/i)
  const state = m ? ' ' + m[1].toUpperCase() : ''
  const parts = addr.split(',').map((s: string) => s.trim()).filter(Boolean)
  if (parts.length <= 2) return addr
  return parts.slice(0, 2).join(', ') + state
}

// Reusable nav item
function NavItem({ label, href, onClick, children }: {
  label: string
  href?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
    borderRadius: 8, textDecoration: 'none', border: 'none', background: 'transparent',
    cursor: 'pointer', width: '100%', textAlign: 'left' as const,
    color: 'rgba(255,255,255,0.55)', fontFamily: 'inherit', marginTop: 2,
    transition: 'background 0.12s',
  }
  function onEnter(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = 'white'
  }
  function onLeave(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
  }
  const iconBox: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color: 'inherit',
  }
  const inner = (
    <>
      <div style={iconBox}>{children}</div>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'inherit', letterSpacing: '-0.01em' }}>{label}</span>
    </>
  )
  if (href) return <a href={href} style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</a>
  return <button style={base} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</button>
}


export default function DashboardPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<string>('free')
  const [selected, setSelected] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [menuOpenId, setMenuOpenId]               = useState<string | null>(null)
  const [deletingId, setDeletingId]               = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId]     = useState<string | null>(null)
  const [renamingId, setRenamingId]               = useState<string | null>(null)
  const [renameValue, setRenameValue]             = useState('')
  const [panelOpen, setPanelOpen]                 = useState(true)
  const [viewFilter, setViewFilter]               = useState<'all' | 'saved'>('all')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      if (!user.email_confirmed_at) { router.push('/auth/verify-email'); return }
      setUser(user)
      const [{ data }, { data: profile }] = await Promise.all([
        supabase.from('reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('plan').eq('id', user.id).single(),
      ])
      setReports((data || []) as Report[])
      if (profile?.plan) setPlan(profile.plan)
      setLoading(false)
    }
    load()
  }, [])

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)
  }

  const selectedReports = reports.filter(r => selected.includes(r.id))
  const stats = {
    total:   reports.length,
    go:      reports.filter(r => r.verdict === 'GO').length,
    caution: reports.filter(r => r.verdict === 'CAUTION').length,
    no:      reports.filter(r => r.verdict === 'NO').length,
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const goingDate = new Date()
  const hour = goingDate.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  //  Delete report 
  async function deleteReport(reportId: string) {
    setDeletingId(reportId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('reports')
        .delete()
        .or(`report_id.eq.${reportId},id.eq.${reportId}`)
      if (error) throw error
      setReports(prev => prev.filter(r => r.report_id !== reportId && r.id !== reportId))
    } catch (err: any) {
      console.error('Delete failed:', err.message)
      console.error('Delete error — check Supabase RLS policy on reports table allows DELETE for authenticated users')
      alert('Could not delete. Check your connection and try again.')
    } finally {
      setDeletingId(null)
      setDeleteConfirmId(null)
      setMenuOpenId(null)
    }
  }

  //  Rename report (stores label in result_data.label locally) 
  async function renameReport(reportId: string, newLabel: string) {
    try {
      const supabase = createClient()
      // Store label in result_data jsonb column
      const report = reports.find(r => (r.report_id || r.id) === reportId)
      if (!report) return
      const updatedResultData = { ...(report.result_data || {}), label: newLabel.trim() }
      const { error } = await supabase
        .from('reports')
        .update({ result_data: updatedResultData })
        .or(`report_id.eq.${reportId},id.eq.${reportId}`)
      if (error) throw error
      setReports(prev => prev.map(r =>
        (r.report_id || r.id) === reportId
          ? { ...r, result_data: updatedResultData, label: newLabel.trim() }
          : r
      ))
    } catch (err: any) {
      console.error('Rename failed:', err.message)
    } finally {
      setRenamingId(null)
      setRenameValue('')
      setMenuOpenId(null)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/*  Left Sidebar  */}
      <Sidebar
        user={user}
        stats={stats}
        reports={reports}
        plan={plan}
        onNewAnalysis={() => router.push('/onboarding')}
        onSignOut={handleSignOut}
      />

      {/*  Main content  */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'auto' }}>

        {/*  Top bar  */}
        <header style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n800 }}>{greeting}, {user?.email?.split('@')[0] || 'there'} </p>
            <p style={{ fontSize: 11, color: S.n400 }}>{new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {compareMode && selected.length >= 2 && (
              <button
                onClick={() => setComparing(true)}
                style={{ background: S.amber, color: S.white, border: 'none', borderRadius: 9, padding: '8px 16px', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(217,119,6,0.25)' }}
              >
                Compare {selected.length} locations
              </button>
            )}
            {reports.length >= 2 && (
              <button
                onClick={() => { setCompareMode(!compareMode); setSelected([]); setComparing(false) }}
                style={{ background: compareMode ? S.brandFaded : S.white, color: compareMode ? S.brand : S.n700, border: `1.5px solid ${compareMode ? S.brandBorder : S.n200}`, borderRadius: 9, padding: '8px 14px', fontSize: 13, fontWeight: 600 }}
              >
                {compareMode ? ' Exit Compare' : 'Compare'}
              </button>
            )}
            <button
              onClick={() => router.push('/onboarding')}
              style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(15,118,110,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
               New Analysis
            </button>
          </div>
        </header>

        {/*  Content area  */}
        <div style={{ flex: 1, padding: '28px 32px 60px', animation: 'fadeIn 0.3s ease' }}>

          {/*  Compare mode banner  */}
          {compareMode && !comparing && (
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.amber }}>Compare Mode</p>
                <p style={{ fontSize: 12, color: S.n700, marginTop: 2 }}>
                  {selected.length === 0 && 'Select 23 locations using the checkboxes'}
                  {selected.length === 1 && 'Select 1 or 2 more to compare'}
                  {selected.length >= 2 && `${selected.length} selected  ready to compare`}
                </p>
              </div>
              {selected.length >= 2 && (
                <button onClick={() => setComparing(true)} style={{ background: S.amber, color: S.white, border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700 }}>Compare </button>
              )}
            </div>
          )}

          {/*  Comparison view  */}
          {comparing && selectedReports.length >= 2 && (
            <ComparisonView reports={selectedReports} onClose={() => { setComparing(false); setSelected([]); setCompareMode(false) }} />
          )}

          {!comparing && (
            <>
              {/*  Two-column layout: reports (left) + insight panel (right)  */}
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              {/*  LEFT: main content  */}
              <div style={{ flex: 1, minWidth: 0 }}>
              {/*  Stats cards  */}
              {reports.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                  {[
                    { icon: 'total',   label: 'Total Reports',  value: stats.total,   sub: 'analyses run',   color: S.brand   },
                    { icon: 'go',      label: 'GO Verdicts',    value: stats.go,      sub: 'strong locations', color: S.emerald },
                    { icon: 'caution', label: 'Caution',        value: stats.caution, sub: 'proceed carefully', color: S.amber   },
                    { icon: 'no',      label: 'NO Verdicts',    value: stats.no,      sub: 'avoid these',    color: S.red     },
                  ].map(s => (
                    <div key={s.label} style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <StatIcon type={s.icon} color={s.color} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: `${s.color}15`, borderRadius: 100, padding: '2px 8px' }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: 32, fontWeight: 900, color: s.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
                      <p style={{ fontSize: 11, color: S.n400 }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
              )}

              {/*  Report list  */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${S.n200}`, borderTopColor: S.brand, margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ fontSize: 13, color: S.n400 }}>Loading reports</p>
                </div>
              ) : reports.length === 0 ? (
                <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, padding: '64px 32px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 20, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}></div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>No analyses yet</h2>
                  <p style={{ fontSize: 14, color: S.n500, marginBottom: 8, maxWidth: 380, margin: '0 auto 8px' }}>Pin any Australian address, enter your rent, and get a GO / CAUTION / NO verdict with a full financial model in about 90 seconds.</p>
                  <p style={{ fontSize: 13, color: S.n400, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>Tip: use the "Calibrate your model" section to improve accuracy up to 98% before submitting.</p>
                  <button onClick={() => router.push('/onboarding')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(15,118,110,0.25)' }}>
                    Analyse a location →
                  </button>
                </div>
              ) : (
                (() => {
                  const savedCount   = reports.filter(r => r.is_saved).length
                  const displayList  = viewFilter === 'saved' ? reports.filter(r => r.is_saved) : reports
                  const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
                    shortlisted: { label: 'Shortlisted', color: S.brand,   bg: S.brandFaded },
                    visited:     { label: 'Visited',     color: '#7C3AED', bg: '#F5F3FF' },
                    opened:      { label: 'Opened',      color: S.emerald, bg: S.emeraldBg },
                    rejected:    { label: 'Rejected',    color: S.red,     bg: S.redBg },
                    researching: { label: 'Researching', color: S.n500,    bg: S.n100 },
                  }
                  return (
                <div>
                  {/* Filter tabs */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { key: 'all',   label: `All (${reports.length})` },
                        { key: 'saved', label: `Location Saved (${savedCount})` },
                      ].map(tab => (
                        <button key={tab.key} onClick={() => setViewFilter(tab.key as any)}
                          style={{
                            padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                            background: viewFilter === tab.key ? S.brand : S.white,
                            color:      viewFilter === tab.key ? S.white   : S.n500,
                            border:     `1px solid ${viewFilter === tab.key ? S.brand : S.n200}`,
                          }}>
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    {compareMode && selected.length > 0 && (
                      <p style={{ fontSize: 12, color: S.amber, fontWeight: 600 }}>{selected.length}/3 selected</p>
                    )}
                  </div>

                  {/* Empty saved state */}
                  {viewFilter === 'saved' && savedCount === 0 && (
                    <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '40px 28px', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>Location</div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n700, marginBottom: 6 }}>No saved locations yet</p>
                      <p style={{ fontSize: 12, color: S.n400 }}>Open any report and click "Save location" to track it here.</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {displayList.map(r => {
                      const statusCfg = STATUS_CFG[r.location_status ?? 'researching'] ?? STATUS_CFG.researching
                      const vc = verdictCfg(r.verdict)
                      const isSelected = selected.includes(r.id)
                      const fin = r.result_data?.financials || {}
                      const scoreCol = scoreColor(r.overall_score || 0)
                      const rId = r.report_id || r.id
                      const label = r.result_data?.label || null
                      const isMenuOpen = menuOpenId === rId
                      const isDeleting = deletingId === rId
                      const isConfirmingDelete = deleteConfirmId === rId
                      const isRenaming = renamingId === rId

                      return (
                        <div key={r.id} style={{ position: 'relative' }}>
                          {/*  Delete confirm overlay  */}
                          {isConfirmingDelete && (
                            <div style={{ position: 'absolute', inset: 0, zIndex: 20, borderRadius: 16, background: S.redBg, border: `1.5px solid ${S.redBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px' }}>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: S.red, marginBottom: 2 }}>Delete this report?</p>
                                <p style={{ fontSize: 12, color: S.n500 }}>This cannot be undone.</p>
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null) }} style={{ background: S.white, border: `1px solid ${S.n200}`, color: S.n700, borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={(e) => { e.stopPropagation(); deleteReport(rId) }} disabled={isDeleting} style={{ background: S.red, border: 'none', color: S.white, borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: isDeleting ? 0.6 : 1 }}>
                                  {isDeleting ? 'Deleting' : 'Yes, delete'}
                                </button>
                              </div>
                            </div>
                          )}

                          <div
                            onClick={() => {
                              if (isConfirmingDelete || isRenaming) return
                              if (isMenuOpen) { setMenuOpenId(null); return }
                              compareMode ? toggleSelect(r.id) : router.push(`/dashboard/${rId}`)
                            }}
                            style={{
                              background: S.white,
                              borderRadius: 16,
                              border: `1.5px solid ${isSelected ? S.brand : isConfirmingDelete ? S.redBdr : S.n200}`,
                              boxShadow: isSelected ? `0 0 0 3px ${S.brandFaded}` : '0 1px 4px rgba(0,0,0,0.04)',
                              padding: '18px 22px',
                              cursor: isConfirmingDelete ? 'default' : 'pointer',
                              transition: 'all 0.15s',
                              display: 'grid',
                              gridTemplateColumns: 'auto 1fr auto',
                              gap: 16,
                              alignItems: 'center',
                              opacity: isDeleting ? 0.4 : 1,
                            }}
                          >
                            {/* Checkbox or verdict icon */}
                            {compareMode ? (
                              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? S.brand : S.n200}`, background: isSelected ? S.brand : S.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {isSelected && <span style={{ color: S.white, fontSize: 12, fontWeight: 900 }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                              </div>
                            ) : (
                              <div style={{ width: 44, height: 44, borderRadius: 14, background: vc.bg, border: `1px solid ${vc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <VerdictIcon type={vc.icon} color={vc.text} />
                              </div>
                            )}

                            {/* Info */}
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                {/* Inline rename input */}
                                {isRenaming ? (
                                  <input
                                    autoFocus
                                    value={renameValue}
                                    onChange={e => setRenameValue(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') renameReport(rId, renameValue)
                                      if (e.key === 'Escape') { setRenamingId(null); setRenameValue('') }
                                    }}
                                    onClick={e => e.stopPropagation()}
                                    placeholder={label || r.business_type || 'Label this location'}
                                    style={{ fontSize: 15, fontWeight: 700, color: S.n900, border: `1.5px solid ${S.brand}`, borderRadius: 7, padding: '3px 8px', outline: 'none', width: '100%', maxWidth: 240, fontFamily: S.font }}
                                  />
                                ) : (
                                  <p style={{ fontSize: 15, fontWeight: 700, color: S.n900 }}>
                                    {label || r.business_type}
                                    {label && <span style={{ fontSize: 11, fontWeight: 400, color: S.n400, marginLeft: 6 }}>{r.business_type}</span>}
                                  </p>
                                )}
                                {!isRenaming && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: vc.bg, color: vc.text, border: `1px solid ${vc.border}`, borderRadius: 100, padding: '2px 9px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: vc.dot, display: 'inline-block' }} />
                                    {vc.label}
                                  </span>
                                )}
                                {!isRenaming && r.is_saved && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.color}30`, borderRadius: 100, padding: '2px 9px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                                    Location {statusCfg.label}
                                  </span>
                                )}
                              </div>
                              <p style={{ fontSize: 12, color: S.n400, marginBottom: 8 }}>{shortAddr(r.location_name)}</p>
                              {isRenaming ? (
                                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                                  <button onClick={() => renameReport(rId, renameValue)} style={{ background: S.brand, border: 'none', color: S.white, borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                                  <button onClick={() => { setRenamingId(null); setRenameValue('') }} style={{ background: S.n100, border: 'none', color: S.n700, borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                  {fin.monthlyRevenue && <span style={{ fontSize: 12, color: S.n500 }}> {fmt(fin.monthlyRevenue)}/mo est.</span>}
                                  {fin.monthlyNetProfit != null && <span style={{ fontSize: 12, color: fin.monthlyNetProfit >= 0 ? S.emerald : S.red }}> {fmt(fin.monthlyNetProfit)} profit</span>}
                                  {r.breakeven_months && r.breakeven_months !== 999 && <span style={{ fontSize: 12, color: S.n500 }}>{r.breakeven_months}mo payback</span>}
                                  <span style={{ fontSize: 12, color: S.n400 }}>{timeAgo(r.created_at)}</span>
                                </div>
                              )}
                            </div>

                            {/* Right side: score ring + menu button */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ position: 'relative', width: 52, height: 52 }}>
                                  <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="26" cy="26" r="20" fill="none" stroke={S.n100} strokeWidth="5" />
                                    <circle cx="26" cy="26" r="20" fill="none" stroke={scoreCol} strokeWidth="5" strokeLinecap="round"
                                      strokeDasharray={`${2 * Math.PI * 20}`}
                                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - (r.overall_score || 0) / 100)}`}
                                    />
                                  </svg>
                                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 13, fontWeight: 900, color: scoreCol, lineHeight: 1 }}>{r.overall_score ?? ''}</span>
                                  </div>
                                </div>
                                <p style={{ fontSize: 9, color: S.n400, marginTop: 3 }}>score</p>
                              </div>

                              {/*  menu button */}
                              {!compareMode && (
                                <div style={{ position: 'relative' }}>
                                  <button
                                    onClick={e => { e.stopPropagation(); setMenuOpenId(isMenuOpen ? null : rId); setDeleteConfirmId(null) }}
                                    style={{ background: isMenuOpen ? S.n200 : S.n100, border: `1px solid ${S.n200}`, borderRadius: 7, width: 30, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.n700, transition: 'all 0.1s' }}
                                  ></button>

                                  {isMenuOpen && (
                                    <div
                                      onClick={e => e.stopPropagation()}
                                      style={{ position: 'absolute', right: 0, top: 30, zIndex: 30, background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden' }}
                                    >
                                      <button onClick={() => { router.push(`/dashboard/${rId}`); setMenuOpenId(null) }} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '10px 14px', fontSize: 13, color: S.n800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        View report
                                      </button>
                                      <button onClick={() => { setRenamingId(rId); setRenameValue(label || ''); setMenuOpenId(null) }} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '10px 14px', fontSize: 13, color: S.n800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        Rename
                                      </button>
                                      <div style={{ height: 1, background: S.n200, margin: '2px 0' }} />
                                      <button onClick={() => { setDeleteConfirmId(rId); setMenuOpenId(null) }} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '10px 14px', fontSize: 13, color: S.red, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        Delete report
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                  )
                })()
              )}
              </div>{/* end left column */}

              {/*  RIGHT: Insight panel  */}
              {reports.length > 0 && (
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0, width: panelOpen ? 268 : 44, transition: 'width 0.25s ease' }}>

                  {/* Toggle button */}
                  <button
                    onClick={() => setPanelOpen(p => !p)}
                    title={panelOpen ? 'Collapse panel' : 'Expand insights'}
                    style={{
                      alignSelf: 'flex-end',
                      marginBottom: 12,
                      width: 32, height: 32,
                      borderRadius: 9,
                      border: `1px solid ${S.n200}`,
                      background: S.white,
                      color: S.n500,
                      cursor: 'pointer',
                      fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                  >{panelOpen ? '' : ''}</button>

                  {/* Panel content  hidden when collapsed */}
                  {panelOpen && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Best location card */}
                  {(() => {
                    const best = [...reports].sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))[0]
                    if (!best) return null
                    const vc = verdictCfg(best.verdict)
                    const fin = best.result_data?.financials || {}
                    const rId = best.report_id || best.id
                    const label = best.result_data?.label || best.business_type
                    return (
                      <div style={{ background: S.white, borderRadius: 18, border: `1px solid ${S.n200}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div style={{ background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, padding: '14px 18px' }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}> Top Location</p>
                          <p style={{ fontSize: 14, fontWeight: 800, color: S.white, marginBottom: 2 }}>{label}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortAddr(best.location_name)}</p>
                        </div>
                        <div style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div>
                              <p style={{ fontSize: 32, fontWeight: 900, color: scoreColor(best.overall_score || 0), lineHeight: 1 }}>{best.overall_score}</p>
                              <p style={{ fontSize: 10, color: S.n400 }}>out of 100</p>
                            </div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: vc.bg, color: vc.text, border: `1px solid ${vc.border}`, borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: vc.dot, display: 'inline-block' }} />
                              {vc.label}
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                            {[
                              { label: 'Est. Revenue', value: fin.monthlyRevenue ? '$' + (fin.monthlyRevenue/1000).toFixed(0) + 'k/mo' : '' },
                              { label: 'Net Profit', value: fin.monthlyNetProfit != null ? '$' + (fin.monthlyNetProfit/1000).toFixed(1) + 'k/mo' : '', color: fin.monthlyNetProfit >= 0 ? S.emerald : S.red },
                              { label: 'Rent Ratio', value: fin.rent?.toRevenuePercent != null ? fin.rent.toRevenuePercent + '%' : '' },
                              { label: 'Payback', value: best.breakeven_months && best.breakeven_months !== 999 ? best.breakeven_months + ' mo' : 'N/A' },
                            ].map(m => (
                              <div key={m.label} style={{ background: S.n50, borderRadius: 10, padding: '8px 10px' }}>
                                <p style={{ fontSize: 10, color: S.n400, marginBottom: 2 }}>{m.label}</p>
                                <p style={{ fontSize: 13, fontWeight: 800, color: (m as any).color || S.n900 }}>{m.value}</p>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => router.push(`/dashboard/${rId}`)} style={{ width: '100%', background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            View full report 
                          </button>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Score breakdown across all reports */}
                  <div style={{ background: S.white, borderRadius: 18, border: `1px solid ${S.n200}`, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.n500, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Score Breakdown</p>
                    {[
                      { label: 'Rent Affordability', key: 'score_rent' },
                      { label: 'Competition',        key: 'score_competition' },
                      { label: 'Demographics',       key: 'score_demand' },
                      { label: 'Profitability',      key: 'score_profitability' },
                    ].map(({ label, key }) => {
                      const vals = reports.map(r => (r as any)[key] || 0).filter(Boolean)
                      const avg = vals.length ? Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length) : 0
                      return (
                        <div key={key} style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: S.n700 }}>{label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(avg) }}>{avg}</span>
                          </div>
                          <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${avg}%`, background: scoreColor(avg), borderRadius: 100, transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Tips panel */}
                  <div style={{ background: `linear-gradient(135deg,${S.brandFaded},${S.white})`, borderRadius: 18, border: `1px solid ${S.brandBorder}`, padding: '16px 18px' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}> Insights</p>
                    {(() => {
                      const tips: string[] = []
                      const avgRent = reports.reduce((a, r) => a + (r.score_rent || 0), 0) / reports.length
                      const avgComp = reports.reduce((a, r) => a + (r.score_competition || 0), 0) / reports.length
                      const goCount = reports.filter(r => r.verdict === 'GO').length
                      const worstRent = [...reports].sort((a, b) => (a.score_rent || 0) - (b.score_rent || 0))[0]

                      if (goCount === 0) tips.push('None of your locations scored GO yet. Try suburbs with lower commercial rent.')
                      else if (goCount === reports.length) tips.push("All locations score GO  you're in a strong position to shortlist.")
                      if (avgRent < 50) tips.push(`Rent is your biggest drag (avg score ${Math.round(avgRent)}). Negotiate hard or look at cheaper suburbs.`)
                      if (avgComp > 70) tips.push('Low competition across your locations is a strong demand signal.')
                      if (avgComp < 40) tips.push('High competition detected. Focus on differentiation  format, price point, or experience.')
                      if (reports.length === 1) tips.push('Test at least 23 locations before deciding. Comparison is where Locatalyze shines.')
                      if (tips.length === 0) tips.push('Your locations show a healthy spread of scores. Use Compare mode to see the trade-offs.')
                      return tips.slice(0, 2).map((tip, i) => (
                        <p key={i} style={{ fontSize: 12, color: S.n700, lineHeight: 1.5, marginBottom: i < 1 ? 8 : 0, paddingBottom: i < 1 ? 8 : 0, borderBottom: i < 1 ? `1px solid ${S.brandBorder}` : 'none' }}>
                          {tip}
                        </p>
                      ))
                    })()}
                  </div>

                  {/* New analysis CTA */}
                  <button onClick={() => router.push('/onboarding')} style={{ width: '100%', background: S.brand, color: S.white, border: 'none', borderRadius: 14, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(15,118,110,0.25)' }}>
                     Analyse new location
                  </button>

                  </div>}{/* end panelOpen content */}

                </div>
              )}
              </div>{/* end two-column */}
            </>
          )}
        </div>
      </main>
    </div>
  )
}