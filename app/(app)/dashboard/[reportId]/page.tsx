'use client'
import ShareButton from '@/components/ShareButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import { use, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  // Sharp financial header
  headerBg: '#111827',
  headerBorder: '#1F2937',
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
  if (v === 'GO')      return { label: 'GO',      desc: 'LOW RISK',    bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, headerAccent: '#059669', headerText: '#ECFDF5' }
  if (v === 'CAUTION') return { label: 'CAUTION', desc: 'MEDIUM RISK', bg: S.amberBg,   text: S.amber,   border: S.amberBdr,   headerAccent: '#D97706', headerText: '#FFFBEB' }
  return                      { label: 'NO',      desc: 'HIGH RISK',   bg: S.redBg,     text: S.red,     border: S.redBdr,     headerAccent: '#DC2626', headerText: '#FEF2F2' }
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

// ─── Data source badge ────────────────────────────────────────────────────────
function SourceBadge({ icon, source, detail }: { icon: string; source: string; detail?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 20, marginRight: 6, marginTop: 6 }}>
      <span style={{ fontSize: 11 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: S.n500, letterSpacing: '0.02em' }}>{source}</span>
      {detail && <span style={{ fontSize: 10, color: S.n400 }}>· {detail}</span>}
    </div>
  )
}

function SourceRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${S.n100}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0 }}>
      <span style={{ fontSize: 10, color: S.n400, fontWeight: 600, marginRight: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data</span>
      {children}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function card(extra?: object) {
  return {
    background: S.white,
    borderRadius: 12,
    border: `1px solid ${S.n200}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    overflow: 'hidden' as const,
    marginBottom: 10,
    ...extra,
  }
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ width: 3, height: 16, background: S.brand, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</span>
    </div>
  )
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, weight }: { label: string; score: number | null; weight: string }) {
  const s = score ?? 0
  const color = scoreColor(s)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: S.n400, fontFamily: S.mono }}>{weight}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: S.mono, minWidth: 24, textAlign: 'right' }}>{s}</span>
        </div>
      </div>
      <div style={{ height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s}%`, background: color, borderRadius: 100, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
    </div>
  )
}

// ─── Metric tile ──────────────────────────────────────────────────────────────
function Tile({ label, value, sub, color, mono }: { label: string; value: string; sub?: string; color?: string; mono?: boolean }) {
  return (
    <div style={{ background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '12px 14px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 900, color: color || S.n900, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: mono ? S.mono : S.font }}>{value}</p>
      {sub && <p style={{ fontSize: 10, color: S.n400, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

// ─── Rent-to-revenue ratio — primary metric ───────────────────────────────────
function RentRatioPanel({ rent, revenue }: { rent: number | null; revenue: number | null }) {
  if (!rent || !revenue || revenue === 0) return null
  const ratio = rent / revenue
  const pct = (ratio * 100).toFixed(1)
  const cfg = rentRatioColor(ratio)
  const barWidth = Math.min(ratio / 0.25, 1) * 100

  return (
    <div style={{ border: `1.5px solid ${cfg.border}`, borderRadius: 12, padding: '18px 20px', background: cfg.bg, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Rent-to-Revenue Ratio</p>
          <p style={{ fontSize: 11, color: cfg.text, opacity: 0.75 }}>Professional benchmark: under 12% · Above 20% is a red flag</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: cfg.text, letterSpacing: '-0.04em', lineHeight: 1, fontFamily: S.mono }}>{pct}%</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.white, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: '3px 10px', marginTop: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.text }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: cfg.text, letterSpacing: '0.06em' }}>{cfg.label}</span>
          </div>
        </div>
      </div>
      {/* Bar */}
      <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barWidth}%`, background: cfg.text, borderRadius: 4, opacity: 0.8, transition: 'width 1.2s ease' }} />
        {/* 12% target marker */}
        <div style={{ position: 'absolute', top: 0, left: '48%', width: 2, height: '100%', background: S.white, opacity: 0.8 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 9, color: cfg.text, opacity: 0.65 }}>0%</span>
        <span style={{ fontSize: 9, color: cfg.text, opacity: 0.65 }}>12% target</span>
        <span style={{ fontSize: 9, color: cfg.text, opacity: 0.65 }}>25%</span>
      </div>
    </div>
  )
}

// ─── Radar chart ──────────────────────────────────────────────────────────────
function RadarChart({ scores, color }: { scores: { label: string; value: number }[]; color: string }) {
  const cx = 110, cy = 110, r = 80
  const n = scores.length
  const points = scores.map((s, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const val = (s.value ?? 0) / 100
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
      lx: cx + (r + 26) * Math.cos(angle),
      ly: cy + (r + 26) * Math.sin(angle),
    }
  })
  return (
    <svg width="220" height="220" style={{ display: 'block', margin: '0 auto' }}>
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
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />)}
      {scores.map((s, i) => {
        const p = points[i]
        const anchor = p.lx < cx - 5 ? 'end' : p.lx > cx + 5 ? 'start' : 'middle'
        return (
          <g key={i}>
            <text x={p.lx} y={p.ly - 5} textAnchor={anchor} fontSize="8" fontWeight="700" fill={S.n400} fontFamily="DM Sans,sans-serif" letterSpacing="0.06em">{s.label.split(' ')[0].toUpperCase()}</text>
            <text x={p.lx} y={p.ly + 7} textAnchor={anchor} fontSize="11" fontWeight="900" fill={color} fontFamily="JetBrains Mono,monospace">{s.value ?? 0}</text>
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
  const W = 340, H = 140, barW = 28, gap = 10, groupW = barW * 2 + gap, groupGap = 32
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
            <text x={x + groupW / 2} y={H + 14} textAnchor="middle" fontSize="10" fontWeight="700" fill={S.n400} fontFamily="DM Sans,sans-serif">{labels[i]}</text>
            <text x={x + barW / 2} y={H - revH - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill={S.brand} fontFamily="JetBrains Mono,monospace">
              {d.revenue ? '$' + (d.revenue / 1000).toFixed(0) + 'k' : ''}
            </text>
            <text x={x + barW + gap + barW / 2} y={H - profH - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill={S.emerald} fontFamily="JetBrains Mono,monospace">
              {d.netProfit ? '$' + (d.netProfit / 1000).toFixed(0) + 'k' : ''}
            </text>
          </g>
        )
      })}
      <rect x={startX} y={H + 30} width={10} height={8} rx="2" fill={S.brand} fillOpacity="0.8" />
      <text x={startX + 14} y={H + 38} fontSize="9" fill={S.n400} fontFamily="DM Sans,sans-serif">Revenue</text>
      <rect x={startX + 80} y={H + 30} width={10} height={8} rx="2" fill={S.emerald} fillOpacity="0.8" />
      <text x={startX + 94} y={H + 38} fontSize="9" fill={S.n400} fontFamily="DM Sans,sans-serif">Net Profit</text>
    </svg>
  )
}

// ─── P&L waterfall ────────────────────────────────────────────────────────────
function PLWaterfall({ fin }: { fin: any }) {
  const revenue = fin.monthlyRevenue    ?? 0
  const rent    = fin.rent?.amount      ?? (fin.totalMonthlyCosts ? fin.totalMonthlyCosts * 0.35 : 0)
  const cogs    = fin.cogs              ?? (fin.totalMonthlyCosts ? fin.totalMonthlyCosts * 0.3 : 0)
  const labour  = fin.labour            ?? (fin.totalMonthlyCosts ? fin.totalMonthlyCosts * 0.25 : 0)
  const other   = Math.max(0, (fin.totalMonthlyCosts ?? 0) - rent - cogs - labour)
  const profit  = fin.monthlyNetProfit  ?? 0
  if (!revenue) return null
  const bars = [
    { label: 'Revenue', value: revenue,           color: S.brand   },
    { label: 'Rent',    value: rent,               color: S.red     },
    { label: 'COGS',    value: cogs,               color: '#F97316' },
    { label: 'Labour',  value: labour,             color: S.amber   },
    { label: 'Other',   value: other,              color: S.n400    },
    { label: 'Profit',  value: Math.abs(profit),   color: profit >= 0 ? S.emerald : S.red },
  ].filter(b => b.value > 0)
  const maxH = 90
  const W = 340, barW = Math.min(34, (W - 20) / bars.length - 8)
  return (
    <svg width={W} height={maxH + 56} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {bars.map((b, i) => {
        const h = (b.value / revenue) * maxH
        const x = 10 + i * ((W - 20) / bars.length)
        return (
          <g key={b.label}>
            <rect x={x} y={maxH - h} width={barW} height={h} rx="3" fill={b.color} fillOpacity="0.85" />
            <text x={x + barW / 2} y={maxH - h - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill={b.color} fontFamily="JetBrains Mono,monospace">
              ${(b.value / 1000).toFixed(0)}k
            </text>
            <text x={x + barW / 2} y={maxH + 13} textAnchor="middle" fontSize="9" fontWeight="600" fill={S.n500} fontFamily="DM Sans,sans-serif">{b.label}</text>
          </g>
        )
      })}
      <line x1="10" y1={maxH} x2={W - 10} y2={maxH} stroke={S.n200} strokeWidth="1.5" />
    </svg>
  )
}

// ─── Break-even gauge ─────────────────────────────────────────────────────────
function BreakevenGauge({ daily, breakeven }: { daily: number | null; breakeven: number | null }) {
  if (!daily || !breakeven) return null
  const maxCustomers = Math.max(daily * 2, breakeven * 1.5)
  const pct = Math.min((daily / maxCustomers), 1)
  const bePct = Math.min((breakeven / maxCustomers), 1)
  const cx = 110, cy = 90, r = 70
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
    <svg width="220" height="120" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {arcPath(0, 1, S.n100, 10)}
      {arcPath(bePct, 1, S.emeraldBg, 10)}
      {arcPath(0, pct, isViable ? S.emerald : S.red, 10)}
      <circle cx={be.x} cy={be.y} r="5" fill={S.white} stroke={S.amber} strokeWidth="2.5" />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="26" fontWeight="900" fill={isViable ? S.emerald : S.red} fontFamily="JetBrains Mono,monospace">{daily}</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="9" fill={S.n400} fontFamily="DM Sans,sans-serif">customers / day</text>
      <text x={be.x} y={be.y - 10} textAnchor="middle" fontSize="8" fontWeight="700" fill={S.amber} fontFamily="DM Sans,sans-serif">break-even: {breakeven}</text>
    </svg>
  )
}

// ─── Map panel ────────────────────────────────────────────────────────────────
function MapPanel({ address }: { address: string | null }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return
    setLoading(true)
    const query = encodeURIComponent(address)
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=au`, {
      headers: { 'User-Agent': 'Locatalyze/1.0' },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.[0]) setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [address])

  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.015},${coords.lat - 0.012},${coords.lng + 0.015},${coords.lat + 0.012}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : null

  return (
    <div style={{ position: 'relative', height: 200, background: S.n100, borderRadius: 10, overflow: 'hidden', border: `1px solid ${S.n200}` }}>
      {mapSrc ? (
        <iframe
          src={mapSrc}
          title="Location map"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          loading="lazy"
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          {loading
            ? <><div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${S.n200}`, borderTopColor: S.brand, animation: 'spin 0.8s linear infinite' }} /><span style={{ fontSize: 11, color: S.n400 }}>Locating address…</span></>
            : <><span style={{ fontSize: 24, opacity: 0.3 }}>📍</span><span style={{ fontSize: 11, color: S.n400 }}>Map unavailable</span></>
          }
        </div>
      )}
      {/* Attribution overlay */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', padding: '3px 8px', borderTopLeftRadius: 6 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)' }}>© OpenStreetMap contributors</span>
      </div>
    </div>
  )
}

// ─── Assumptions panel ────────────────────────────────────────────────────────
function AssumptionsPanel({ report }: { report: Report }) {
  const [open, setOpen] = useState(false)
  const fin = report.result_data?.financials || {}
  const items = [
    { label: 'Business type',      value: report.business_type || '—' },
    { label: 'Address',            value: report.location_name || '—' },
    { label: 'Monthly rent (input)', value: fmt(report.monthly_rent) },
    { label: 'Avg ticket size',    value: fmt(fin.avgTicketSize) },
    { label: 'Est. daily customers', value: report.breakeven_daily ? `${report.breakeven_daily} / day` : '—' },
    { label: 'Monthly revenue',    value: fmt(fin.monthlyRevenue) },
    { label: 'Profit margin',      value: fin.profitMargin ? `${fin.profitMargin}%` : '—' },
    { label: 'Competitor data',    value: 'OpenStreetMap Overpass API · 500m radius' },
    { label: 'Demographics source', value: 'ABS 2021 Census · SA2 region' },
    { label: 'Geocoding source',   value: 'OpenStreetMap Nominatim' },
    { label: 'Report generated',   value: new Date(report.created_at).toLocaleString('en-AU') },
  ]

  return (
    <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '13px 18px', background: S.n50, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: S.font }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 14, background: S.n400, borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model Assumptions & Data Sources</span>
        </div>
        <span style={{ fontSize: 11, color: S.n400, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ background: S.white }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.label} style={{ borderTop: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '9px 18px', fontSize: 11, color: S.n400, fontWeight: 600, width: '40%' }}>{item.label}</td>
                  <td style={{ padding: '9px 18px', fontSize: 11, color: S.n800, fontWeight: 600, fontFamily: S.mono }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 18px', background: S.n50, borderTop: `1px solid ${S.n100}` }}>
            <p style={{ fontSize: 10, color: S.n400, lineHeight: 1.6 }}>
              This model uses live data from OpenStreetMap and ABS 2021 Census. All financial projections are estimates based on submitted inputs and industry benchmarks. This report is not financial advice.
            </p>
          </div>
        </div>
      )}
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
        setReport({
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
        })
        setLoading(false)
        return
      }
    } catch {}

    const supabase = createClient()
    let attempts = 0
    const MAX = 20

    async function poll() {
      const { data, error } = await supabase.from('reports').select('*').eq('report_id', reportId).maybeSingle()
      if (error) { setLoading(false); setNotFound(true); return }
      if (!data) { attempts++; if (attempts >= MAX) { setLoading(false); setNotFound(true) }; return }
      setReport(data as Report); setLoading(false)
      if (data.verdict) clearInterval(timer)
      else { attempts++; if (attempts >= MAX) clearInterval(timer) }
    }

    poll()
    const timer = setInterval(poll, 3000)
    return () => clearInterval(timer)
  }, [reportId])

  return { report, loading, notFound }
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params)
  const router = useRouter()
  const { report, loading, notFound } = useReport(reportId)
  const [activeTab, setActiveTab] = useState('overview')

  // ── Loading screen ──
  if (loading || (report && !report.verdict)) {
    const steps = ['Resolving coordinates', 'Scanning competitors (500m)', 'Querying ABS demographics', 'Modelling financials', 'Writing report']
    return (
      <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.1)`, borderTopColor: S.brandLight, margin: '0 auto 28px', animation: 'spin 0.9s linear infinite' }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: S.white, letterSpacing: '-0.03em', marginBottom: 8 }}>Analysing location</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>This takes about 25 seconds</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, animation: `pulse 2s ease ${i * 0.3}s infinite` }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: S.brandLight, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Not found ──
  if (notFound || !report) {
    return (
      <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>404</p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Report not found</h2>
          <p style={{ fontSize: 13, color: S.n500, marginBottom: 24 }}>This report may still be processing or the link has expired.</p>
          <button onClick={() => router.push('/dashboard')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 9, padding: '10px 22px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: S.font }}>
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
  const competitors = report.result_data?.competitors || null
  const demographics = report.result_data?.demographics || null
  const competitorDataQuality = report.result_data?.competitors?.dataQuality || null
  const demographicsDataQuality = report.result_data?.demographics?.dataQuality || null

  const tabs = [
    { id: 'overview',    label: 'Overview'    },
    { id: 'financials',  label: 'Financials'  },
    { id: 'analysis',    label: 'Analysis'    },
    { id: 'projections', label: 'Projections' },
  ]

  function parseSwot(key: string, allKeys: string[]) {
    const next = allKeys[allKeys.indexOf(key) + 1]
    const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
    const match = report?.swot_analysis?.match(new RegExp(pattern, 'is'))
    return match ? match[1].split(/[,.]/).map(s => s.trim()).filter(s => s.length > 5).slice(0, 3) : []
  }
  const swotKeys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
  const swotCfg = {
    STRENGTHS:     { bg: S.emeraldBg, border: S.emeraldBdr, text: '#065F46', dot: S.emerald },
    WEAKNESSES:    { bg: S.amberBg,   border: S.amberBdr,   text: '#92400E', dot: S.amber   },
    OPPORTUNITIES: { bg: S.blueBg,    border: S.blueBdr,    text: '#1D4ED8', dot: S.blue    },
    THREATS:       { bg: S.redBg,     border: S.redBdr,     text: '#991B1B', dot: S.red     },
  }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        button { font-family: inherit; cursor: pointer; }
      `}</style>

      {/* ── Dark header bar ── */}
      <div style={{ background: S.headerBg, borderBottom: `1px solid ${S.headerBorder}` }}>
        {/* Nav strip */}
        <nav style={{ padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${S.headerBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', padding: 0 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 900, fontSize: 12 }}>L</div>
              <span style={{ fontWeight: 800, fontSize: 14, color: S.white, letterSpacing: '-0.02em' }}>Locatalyze</span>
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Location Report</span>
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

        {/* Verdict hero */}
        <div style={{ padding: '28px 24px', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            {/* Left: address + verdict + recommendation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>📍</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500, fontFamily: S.mono }}>{report.location_name || '—'}</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: S.white, letterSpacing: '-0.04em', marginBottom: 14, lineHeight: 1.2 }}>
                {report.business_type}
              </h1>
              {/* Verdict badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `${vc.headerAccent}22`, border: `1.5px solid ${vc.headerAccent}55`, borderRadius: 8, padding: '8px 16px', marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: vc.headerAccent, boxShadow: `0 0 8px ${vc.headerAccent}` }} />
                <span style={{ fontSize: 14, fontWeight: 900, color: vc.headerAccent, letterSpacing: '0.06em' }}>{vc.label}</span>
                <span style={{ width: 1, height: 14, background: `${vc.headerAccent}44` }} />
                <span style={{ fontSize: 11, color: `${vc.headerAccent}AA`, fontWeight: 600 }}>{vc.desc}</span>
              </div>
              {/* Recommendation */}
              {report.recommendation && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 420 }}>{report.recommendation}</p>
              )}
            </div>
            {/* Right: score ring */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 90, height: 90 }}>
                <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="45" cy="45" r="36" fill="none"
                    stroke={vc.headerAccent} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - (report.overall_score ?? 0) / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: vc.headerAccent, lineHeight: 1, fontFamily: S.mono }}>{report.overall_score}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>/100</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</p>
            </div>
          </div>

          {/* Key metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: S.headerBorder, borderRadius: 10, overflow: 'hidden', marginTop: 24, border: `1px solid ${S.headerBorder}` }}>
            {[
              { l: 'Monthly Revenue',  v: fmt(fin.monthlyRevenue),  s: 'estimated' },
              { l: 'Net Profit / Mo',  v: fmt(fin.monthlyNetProfit), s: fin.profitMargin ? `${fin.profitMargin}% margin` : '' },
              { l: 'Break-even Daily', v: report.breakeven_daily ? `${report.breakeven_daily} cust.` : '—', s: 'to cover costs' },
              { l: 'Payback Period',   v: !report.breakeven_months || report.breakeven_months === 999 ? 'Not viable' : `${report.breakeven_months} mo`, s: '' },
            ].map((m, i) => (
              <div key={m.l} style={{ padding: '14px 16px', background: '#161D27' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{m.l}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: S.white, letterSpacing: '-0.02em', fontFamily: S.mono }}>{m.v}</p>
                {m.s && <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{m.s}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 20px 60px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, background: S.white, border: `1px solid ${S.n200}`, borderRadius: 10, padding: 4, marginBottom: 14, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '8px 6px', borderRadius: 7, border: 'none',
                background: activeTab === t.id ? S.headerBg : 'transparent',
                color: activeTab === t.id ? S.white : S.n500,
                fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* ═══════ OVERVIEW ═══════ */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>

            {/* Map + rent ratio side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div style={card({ padding: '16px', marginBottom: 0 })}>
                <SectionHeading>Location Map</SectionHeading>
                <MapPanel address={report.location_name} />
                <SourceRow>
                  <SourceBadge icon="🗺" source="OpenStreetMap" detail="Nominatim geocoding" />
                </SourceRow>
              </div>
              <div style={card({ padding: '16px', marginBottom: 0, display: 'flex', flexDirection: 'column' })}>
                <SectionHeading>Rent Analysis</SectionHeading>
                <RentRatioPanel rent={report.monthly_rent} revenue={fin.monthlyRevenue} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, alignContent: 'end' }}>
                  <Tile label="Monthly Rent" value={fmt(report.monthly_rent)} mono />
                  <Tile label="Rent Rating"  value={fin.rent?.label || '—'} color={fin.rent?.label === 'EXCELLENT' ? S.emerald : fin.rent?.label === 'GOOD' ? S.blue : fin.rent?.label === 'MARGINAL' ? S.amber : S.red} />
                </div>
              </div>
            </div>

            {/* Score breakdown + radar */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionHeading>Score Breakdown</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, alignItems: 'center' }}>
                <div>
                  <ScoreBar label="Rent Affordability" score={report.score_rent}         weight="30%" />
                  <ScoreBar label="Profitability"       score={report.score_profitability} weight="25%" />
                  <ScoreBar label="Competition"         score={report.score_competition}   weight="25%" />
                  <ScoreBar label="Area Demographics"   score={report.score_demand}        weight="20%" />
                </div>
                <RadarChart color={vc.text}
                  scores={[
                    { label: 'Rent',          value: report.score_rent          ?? 0 },
                    { label: 'Profitability', value: report.score_profitability  ?? 0 },
                    { label: 'Competition',   value: report.score_competition    ?? 0 },
                    { label: 'Demand',        value: report.score_demand         ?? 0 },
                    { label: 'Cost',          value: report.score_cost           ?? 0 },
                  ]}
                />
              </div>
              {scoring.riskFlags?.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {scoring.riskFlags.map((flag: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', background: S.amberBg, borderRadius: 8, border: `1px solid ${S.amberBdr}` }}>
                      <span style={{ fontSize: 11 }}>⚠️</span>
                      <span style={{ fontSize: 12, color: S.amber }}>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Competition + Demographics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={card({ padding: '18px 20px', marginBottom: 0 })}>
                <SectionHeading>Competition</SectionHeading>
                {competitors && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <div style={{ flex: 1, background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>{competitors.count}</p>
                      <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>within 500m</p>
                    </div>
                    <div style={{ flex: 1, background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: competitors.intensityLabel === 'LOW' ? S.emerald : competitors.intensityLabel === 'MEDIUM' ? S.amber : S.red }}>
                        {competitors.intensityLabel}
                      </p>
                      <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>intensity</p>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>{report.competitor_analysis}</p>
                <SourceRow>
                  <SourceBadge icon="📡" source="OpenStreetMap" detail="500m radius" />
                  {competitorDataQuality && <SourceBadge icon="✓" source={competitorDataQuality} />}
                </SourceRow>
              </div>

              <div style={card({ padding: '18px 20px', marginBottom: 0 })}>
                <SectionHeading>Area Demographics</SectionHeading>
                {demographics && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                      <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Median Income</p>
                      <p style={{ fontSize: 14, fontWeight: 800, color: S.n800, fontFamily: S.mono }}>{fmt(demographics.medianIncome)}<span style={{ fontSize: 10, fontWeight: 500, color: S.n400, fontFamily: S.font }}>/yr</span></p>
                    </div>
                    <div style={{ background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                      <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Affordability</p>
                      <p style={{ fontSize: 12, fontWeight: 800, color: S.emerald }}>{demographics.affordabilityLabel?.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>{report.market_demand}</p>
                <SourceRow>
                  <SourceBadge icon="📊" source="ABS 2021 Census" detail="SA2 region" />
                  {demographicsDataQuality && <SourceBadge icon="✓" source={demographicsDataQuality} />}
                </SourceRow>
              </div>
            </div>

            {/* SWOT */}
            {report.swot_analysis && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionHeading>SWOT Analysis</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {swotKeys.map(key => {
                    const items = parseSwot(key, swotKeys)
                    const cfg = swotCfg[key as keyof typeof swotCfg]
                    if (!items.length) return null
                    return (
                      <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '13px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
                          <p style={{ fontSize: 10, fontWeight: 800, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {items.map((item, i) => (
                            <p key={i} style={{ fontSize: 11, color: cfg.text, opacity: 0.85, lineHeight: 1.55 }}>· {item}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ FINANCIALS ═══════ */}
        {activeTab === 'financials' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>

            {/* Rent ratio — top of financials too */}
            <RentRatioPanel rent={report.monthly_rent} revenue={fin.monthlyRevenue} />

            {/* P&L */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionHeading>Monthly P&L</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
                <Tile label="Revenue"      value={fmt(fin.monthlyRevenue)}    mono />
                <Tile label="Total Costs"  value={fmt(fin.totalMonthlyCosts)} color={S.red} mono />
                <Tile label="Gross Profit" value={fmt(fin.monthlyGrossProfit)} color={S.blue} mono />
                <Tile label="Net Profit"   value={fmt(fin.monthlyNetProfit)}  color={(fin.monthlyNetProfit ?? 0) >= 0 ? S.emerald : S.red} mono />
              </div>
              {fin.monthlyRevenue && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, textAlign: 'center' }}>Monthly Cost Structure</p>
                  <PLWaterfall fin={fin} />
                </div>
              )}
              <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>{report.profitability}</p>
            </div>

            {/* Rent */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionHeading>Rent Breakdown</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                <Tile label="Monthly Rent"   value={fmt(report.monthly_rent)} mono />
                <Tile label="% of Revenue"   value={`${fin.rent?.toRevenuePercent ?? '—'}%`} color={(fin.rent?.toRevenuePercent ?? 0) <= 12 ? S.emerald : (fin.rent?.toRevenuePercent ?? 0) <= 20 ? S.amber : S.red} mono />
                <Tile label="Rating"         value={fin.rent?.label ?? '—'} color={fin.rent?.label === 'EXCELLENT' ? S.emerald : fin.rent?.label === 'GOOD' ? S.blue : fin.rent?.label === 'MARGINAL' ? S.amber : S.red} />
              </div>
              <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>{report.rent_analysis}</p>
            </div>

            {/* Break-even */}
            <div style={card({ padding: '20px 22px' })}>
              <SectionHeading>Break-even Analysis</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20, alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  <Tile label="Customers / Day"    value={String(report.breakeven_daily ?? '—')} mono />
                  <Tile label="Revenue / Month"    value={fmt(report.breakeven_monthly)} mono />
                  <Tile label="Surplus Customers"  value={(fin.breakEven?.surplusCustomers != null ? (fin.breakEven.surplusCustomers >= 0 ? '+' : '') + fin.breakEven.surplusCustomers : '—') as string} color={fin.breakEven?.isAboveBreakEven ? S.emerald : S.red} mono />
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, textAlign: 'center' }}>Current vs Break-even</p>
                  <BreakevenGauge daily={report.breakeven_daily} breakeven={fin.breakEven?.dailyCustomers ?? report.breakeven_daily} />
                </div>
              </div>
              <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>{report.cost_analysis}</p>
            </div>

            {/* Risk scenarios */}
            {riskScenarios.best && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionHeading>Risk Scenarios</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                  {[
                    { key: 'best',  label: 'Best Case',  pct: '130%', bg: S.emeraldBg, border: S.emeraldBdr, text: S.emerald },
                    { key: 'base',  label: 'Base Case',  pct: '100%', bg: S.blueBg,    border: S.blueBdr,    text: S.blue   },
                    { key: 'worst', label: 'Worst Case', pct: '70%',  bg: S.redBg,     border: S.redBdr,     text: S.red    },
                  ].map(sc => {
                    const s = riskScenarios[sc.key] || {}
                    return (
                      <div key={sc.key} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 10, padding: '14px 15px' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{sc.label} · {sc.pct}</p>
                        <p style={{ fontSize: 9, color: sc.text, opacity: 0.6, marginBottom: 2 }}>Revenue</p>
                        <p style={{ fontSize: 15, fontWeight: 900, color: sc.text, marginBottom: 8, fontFamily: S.mono }}>{fmt(s.monthlyRevenue)}</p>
                        <p style={{ fontSize: 9, color: sc.text, opacity: 0.6, marginBottom: 2 }}>Net Profit</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: sc.text, fontFamily: S.mono }}>{fmt(s.monthlyNet)}</p>
                        {s.cashBufferNeeded > 0 && <p style={{ fontSize: 9, color: sc.text, marginTop: 8, opacity: 0.7 }}>Buffer: {fmt(s.cashBufferNeeded)}</p>}
                      </div>
                    )
                  })}
                </div>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>{report.sensitivity_analysis}</p>
              </div>
            )}
          </div>
        )}

        {/* ═══════ ANALYSIS ═══════ */}
        {activeTab === 'analysis' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            {[
              { title: 'Recommendation',      content: report.recommendation       },
              { title: 'Competitor Analysis', content: report.competitor_analysis  },
              { title: 'Rent Analysis',       content: report.rent_analysis        },
              { title: 'Market Demand',       content: report.market_demand        },
              { title: 'Cost Analysis',       content: report.cost_analysis        },
              { title: 'Profitability',       content: report.profitability        },
            ].filter(s => s.content).map(s => (
              <div key={s.title} style={card({ padding: '18px 22px' })}>
                <SectionHeading>{s.title}</SectionHeading>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.8 }}>{s.content}</p>
              </div>
            ))}

            {report.swot_analysis && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionHeading>Full SWOT Analysis</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {swotKeys.map(key => {
                    const cfg = swotCfg[key as keyof typeof swotCfg]
                    const regex = new RegExp(`${key}:\\s*(.+?)(?=(?:STRENGTHS|WEAKNESSES|OPPORTUNITIES|THREATS):|$)`, 'is')
                    const match = report.swot_analysis!.match(regex)
                    const text = match ? match[1].trim() : ''
                    if (!text) return null
                    return (
                      <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '13px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
                          <p style={{ fontSize: 10, fontWeight: 800, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key}</p>
                        </div>
                        <p style={{ fontSize: 12, color: cfg.text, opacity: 0.85, lineHeight: 1.7 }}>{text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ PROJECTIONS ═══════ */}
        {activeTab === 'projections' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            {projections.year1 && (
              <div style={card({ padding: '20px 22px' })}>
                <SectionHeading>3-Year Financial Projections</SectionHeading>
                <div style={{ marginBottom: 24 }}>
                  <ProjectionBars projections={projections} />
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${S.n100}` }}>
                      {['Metric', 'Year 1', 'Year 2', 'Year 3'].map((h, i) => (
                        <th key={h} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 0', fontSize: 10, fontWeight: 800, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Revenue',    key: 'revenue',   color: S.n800    },
                      { label: 'Costs',      key: 'costs',     color: S.red     },
                      { label: 'Net Profit', key: 'netProfit', color: S.emerald },
                    ].map(row => (
                      <tr key={row.key} style={{ borderBottom: `1px solid ${S.n100}` }}>
                        <td style={{ padding: '11px 0', fontSize: 12, color: S.n500 }}>{row.label}</td>
                        {['year1', 'year2', 'year3'].map(y => (
                          <td key={y} style={{ padding: '11px 0', textAlign: 'right', fontSize: 13, fontWeight: 800, color: row.color, fontFamily: S.mono }}>
                            {fmt(projections[y]?.[row.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.8, marginTop: 16 }}>{report.three_year_projection}</p>
              </div>
            )}

            {report.pl_summary && (
              <div style={card({ padding: '18px 22px' })}>
                <SectionHeading>P&L Summary</SectionHeading>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.8 }}>{report.pl_summary}</p>
              </div>
            )}

            {report.sensitivity_analysis && (
              <div style={card({ padding: '18px 22px' })}>
                <SectionHeading>Sensitivity Analysis</SectionHeading>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.8, marginBottom: 14 }}>{report.sensitivity_analysis}</p>
                {riskScenarios.worst?.cashBufferNeeded > 0 && (
                  <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Worst-case cash buffer required</p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>{fmt(riskScenarios.worst.cashBufferNeeded)}</p>
                    <p style={{ fontSize: 10, color: S.n400, marginTop: 4 }}>At 70% of baseline demand</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Assumptions panel — always visible */}
        <AssumptionsPanel report={report} />

        {/* Footer */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${S.n200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ fontSize: 10, color: S.n400, fontFamily: S.mono }}>Report {report.report_id ?? report.id}</p>
            <p style={{ fontSize: 10, color: S.n400, marginTop: 2 }}>{new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button
            onClick={() => router.push('/onboarding')}
            style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 9, padding: '10px 20px', fontWeight: 700, fontSize: 12, boxShadow: '0 2px 8px rgba(15,118,110,0.2)', fontFamily: S.font }}
          >
            Analyse another location →
          </button>
        </div>
      </div>
    </div>
  )
}