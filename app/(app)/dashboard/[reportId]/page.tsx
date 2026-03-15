'use client'
import ShareButton from '@/components/ShareButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import { use, useCallback, useEffect, useMemo, useState, useRef } from 'react'
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
  id: string                        // text PK (may hold req_... ID)
  report_id?: string | null         // text col — n8n stores req_... here
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
  input_data?: any | null
  status?: string | null
  created_at: string
  user_id?: string | null
  is_public?: boolean | null
  public_token?: string | null      // mapped from share_token
  share_token?: string | null       // actual DB column name
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
function PLWaterfall({ fin, submittedRent }: { fin: any; submittedRent?: number | null }) {
  const revenue = fin.monthlyRevenue    ?? 0
  // Always prefer the user's submitted rent (report.monthly_rent) over the computed fin.rent.amount
  // which may be null or miscalculated. Fall back to totalMonthlyCosts*0.35 only as last resort.
  const rent    = submittedRent ?? fin.rent?.amount ?? (fin.totalMonthlyCosts ? fin.totalMonthlyCosts * 0.35 : 0)
  // COGS and labour: derive from totalMonthlyCosts minus rent if direct fields absent
  const opBase  = fin.totalMonthlyCosts ?? (rent * 1.45)
  const cogs    = fin.cogs    ?? (opBase > rent ? (opBase - rent) * 0.52 : 0)
  const labour  = fin.labour  ?? (opBase > rent ? (opBase - rent) * 0.35 : 0)
  const other   = Math.max(0, (opBase ?? 0) - rent - cogs - labour)
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
  // If we don't have BOTH the actual customer count AND the break-even threshold
  // as distinct values, the gauge is meaningless — show N/A instead.
  if (!daily || !breakeven || daily === breakeven) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <p style={{ fontSize: 13, color: S.n400, fontWeight: 600 }}>Break-even data unavailable</p>
        <p style={{ fontSize: 11, color: S.n400, marginTop: 4 }}>Re-run analysis to generate gauge</p>
      </div>
    )
  }
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
function MapPanel({ address, lat, lng, businessType, competitorNames, competitorCount }: {
  address: string | null
  lat?: number | null
  lng?: number | null
  businessType?: string | null
  competitorNames?: string[]
  competitorCount?: number
}) {
  const [mapHtml, setMapHtml] = useState<string | null>(null)
  const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [competitors, setCompetitors] = useState<Array<{ lat: number; lng: number; name: string }>>([])

  // Use coords from report if available, otherwise geocode
  useEffect(() => {
    if (lat && lng && lat !== 0 && lng !== 0) {
      setResolvedCoords({ lat, lng })
      return
    }
    if (!address) return
    setGeoLoading(true)
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=au`, {
      headers: { 'User-Agent': 'Locatalyze/1.0' },
    })
      .then(r => r.json())
      .then(data => { if (data?.[0]) setResolvedCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }) })
      .catch(() => {})
      .finally(() => setGeoLoading(false))
  }, [address, lat, lng])

  // Fetch competitor locations from Geoapify once we have coords
  useEffect(() => {
    if (!resolvedCoords) return
    const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || ''
    const CATEGORY_MAP: Record<string, string> = {
      cafe: 'catering.cafe,catering.coffee', coffee: 'catering.cafe,catering.coffee',
      restaurant: 'catering.restaurant,catering.fast_food', bar: 'catering.bar,catering.pub',
      pub: 'catering.bar,catering.pub', gym: 'sport.fitness,sport.gym',
      fitness: 'sport.fitness,sport.gym', bakery: 'catering.bakery,catering.cafe',
      salon: 'service.beauty,healthcare.beauty', retail: 'commercial.clothing,commercial.shopping_mall',
      pharmacy: 'healthcare.pharmacy', takeaway: 'catering.fast_food',
    }
    const bt = (businessType || '').toLowerCase()
    const categories = Object.entries(CATEGORY_MAP).find(([k]) => bt.includes(k))?.[1] || 'catering,commercial'
    const { lat: clat, lng: clng } = resolvedCoords
    fetch(`https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${clng},${clat},500&limit=20&apiKey=${GEOAPIFY_KEY}`)
      .then(r => r.json())
      .then(data => {
        const features = data?.features || []
        setCompetitors(features.slice(0, 15).map((f: any) => ({
          lat: f.geometry?.coordinates?.[1],
          lng: f.geometry?.coordinates?.[0],
          name: f.properties?.name || 'Competitor',
        })).filter((c: any) => c.lat && c.lng))
      })
      .catch(() => {})
  }, [resolvedCoords, businessType])

  // Build Leaflet HTML once we have coords + competitors
  useEffect(() => {
    if (!resolvedCoords) return
    const { lat: clat, lng: clng } = resolvedCoords
    const compMarkers = competitors.map(c =>
      `L.circleMarker([${c.lat},${c.lng}],{radius:7,color:'#DC2626',fillColor:'#FCA5A5',fillOpacity:0.85,weight:2})
        .bindPopup('<b style="font-size:12px">${c.name.replace(/'/g, "\\'")}</b><br><span style="font-size:11px;color:#666">Competitor · 500m radius</span>').addTo(map);`
    ).join('\n')

    const html = `<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>html,body,#map{margin:0;padding:0;width:100%;height:100%;} .leaflet-popup-content-wrapper{border-radius:8px;font-family:sans-serif;}</style>
    </head><body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {zoomControl:true, scrollWheelZoom:false}).setView([${clat},${clng}],15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
          attribution:'© OpenStreetMap contributors', maxZoom:19
        }).addTo(map);

        // Main location pin
        var mainIcon = L.divIcon({
          html: '<div style="width:18px;height:18px;background:#0F766E;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>',
          iconSize:[18,18], iconAnchor:[9,9], className:''
        });
        L.marker([${clat},${clng}], {icon: mainIcon, zIndexOffset:1000})
          .bindPopup('<b style="font-size:12px">📍 Your location</b><br><span style="font-size:11px;color:#555">${(address || '').replace(/'/g, "\\'").slice(0, 60)}</span>')
          .addTo(map).openPopup();

        // 500m radius circle
        L.circle([${clat},${clng}],{radius:500,color:'#0F766E',fillColor:'#0F766E',fillOpacity:0.06,weight:1.5,dashArray:'6,4'}).addTo(map);

        // Competitor markers
        ${compMarkers}
      </script>
    </body></html>`

    setMapHtml(html)
  }, [resolvedCoords, competitors, address])

  const loading = geoLoading && !resolvedCoords

  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${S.n200}` }}>
      {/* Legend strip */}
      <div style={{ background: S.n900, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: S.brand, border: '2px solid #fff' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Your location</span>
        </div>
        {competitors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FCA5A5', border: '2px solid #DC2626' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{competitors.length} competitor{competitors.length !== 1 ? 's' : ''} within 500m</span>
          </div>
        )}
        {competitorCount != null && competitorCount > competitors.length && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginLeft: 'auto' }}>+{competitorCount - competitors.length} estimated</span>
        )}
      </div>

      {/* Map */}
      <div style={{ height: 260, background: S.n100 }}>
        {mapHtml ? (
          <iframe
            srcDoc={mapHtml}
            title="Location map with competitors"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            sandbox="allow-scripts"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            {loading
              ? <><div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${S.n200}`, borderTopColor: S.brand, animation: 'spin 0.8s linear infinite' }} /><span style={{ fontSize: 11, color: S.n400 }}>Loading map…</span></>
              : <><span style={{ fontSize: 24, opacity: 0.3 }}>🗺</span><span style={{ fontSize: 11, color: S.n400 }}>Map unavailable</span></>
            }
          </div>
        )}
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

// ─── Realtime hook — replaces polling entirely ────────────────────────────────
// Architecture: subscribe to the exact Supabase row for this reportId.
// n8n writes the completed report back to this same row (status: complete).
// Supabase pushes the change to us in real time — no polling, no timeouts.
function useReport(reportId: string) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Check sessionStorage first (set by onboarding page after analysis)
    try {
      const cached = sessionStorage.getItem(`report_${reportId}`)
      if (cached) {
        const raw = JSON.parse(cached)
        setReport({
          id: raw.reportId || reportId,
          report_id: raw.reportId || reportId,
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

    // ── Step 1: Fetch whatever is in the DB right now ────────────────────────
    // The report may already be complete (e.g. user refreshed the page).
    // We do an initial fetch, then subscribe to live updates for anything pending.
    async function fetchCurrent() {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .or(`report_id.eq.${reportId},id.eq.${reportId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('[Report] Initial fetch error:', error.code, error.message)
        return null
      }
      return data
    }

    // ── Step 2: Subscribe to Realtime updates on this exact row ─────────────
    // Supabase Realtime pushes a notification the moment n8n writes status=complete.
    // This eliminates the 3s polling delay and works even if n8n takes 90+ seconds.
    const channel = supabase
      .channel(`report:${reportId}`)
      .on(
        'postgres_changes',
        {
          event: '*',           // INSERT or UPDATE
          schema: 'public',
          table: 'reports',
          filter: `report_id=eq.${reportId}`,
        },
        (payload) => {
          const updated = payload.new as Report
          console.log('[Realtime] Report update:', updated.status, updated.progress_step)
          setReport(updated)
          if (updated.status === 'complete' && updated.verdict) {
            setLoading(false)
          } else if (updated.status === 'failed') {
            setLoading(false)
          }
        }
      )
      .subscribe()

    // ── Step 3: Initial fetch + fallback polling (safety net) ────────────────
    // Realtime handles live updates. The initial fetch covers the case where
    // the report completed before our subscription was ready.
    // Fallback polling (every 8s) covers Realtime connection failures.
    let pollInterval: ReturnType<typeof setInterval> | null = null
    let pollAttempts = 0
    const MAX_POLL = 20 // 20 × 8s = ~160s max wait

    async function checkAndSettle() {
      pollAttempts++
      const data = await fetchCurrent()

      if (data) {
        setReport(data as Report)
        if ((data.status === 'complete' && data.verdict) || data.status === 'failed') {
          setLoading(false)
          if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
          return
        }
      }

      if (pollAttempts >= MAX_POLL) {
        setLoading(false)
        if (!data) setNotFound(true)
        if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
      }
    }

    // Small delay to let Supabase auth session hydrate
    const startDelay = setTimeout(() => {
      checkAndSettle()
      pollInterval = setInterval(checkAndSettle, 8000) // 8s fallback (Realtime handles fast path)
    }, 300)

    return () => {
      clearTimeout(startDelay)
      if (pollInterval) clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [reportId])

  return { report, loading, notFound }
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params)
  const router = useRouter()
  const { report, loading, notFound } = useReport(reportId)
  const [activeTab, setActiveTab] = useState('overview')

  // ── Live recalculation sliders ────────────────────────────────────────────
  const [sliderOpen, setSliderOpen] = useState(false)
  const [adjRent,     setAdjRent]     = useState<number | null>(null)
  const [adjTicket,   setAdjTicket]   = useState<number | null>(null)
  const [adjCustomers,setAdjCustomers]= useState<number | null>(null)

  // ── Recalc engine — must be BEFORE early returns (Rules of Hooks) ─────────
  const GROSS_MARGIN   = 0.62
  const COST_MULTIPLIER = 1.45
  const TRADING_DAYS   = 30

  // Safe base values — fall back to 0 when report not yet loaded
  const _fin         = report?.result_data?.financials || {}
  const baseRent     = report?.monthly_rent ?? _fin?.rent?.submitted ?? 0
  const baseTicket   = _fin?.baselineCustomers
    ? Math.round((_fin.monthlyRevenue || 0) / ((_fin.baselineCustomers || 1) * TRADING_DAYS))
    : 0
  const baseCustomers = _fin?.baselineCustomers ?? 0
  const _scoreComp   = report?.score_competition ?? 50
  const _scoreDem    = report?.score_demand ?? 50

  const adjCalc = useMemo(() => {
    const rent      = adjRent      ?? baseRent
    const ticket    = adjTicket    ?? baseTicket
    const customers = adjCustomers ?? baseCustomers

    const monthlyRevenue     = Math.round(customers * ticket * TRADING_DAYS)
    const totalMonthlyCosts  = Math.round(rent * COST_MULTIPLIER)
    const monthlyGrossProfit = Math.round(monthlyRevenue * GROSS_MARGIN)
    const monthlyNetProfit   = Math.round(monthlyGrossProfit - totalMonthlyCosts)
    const profitMargin       = parseFloat(((monthlyNetProfit / Math.max(monthlyRevenue, 1)) * 100).toFixed(1))
    const rentToRevRatio     = parseFloat((rent / Math.max(monthlyRevenue, 1)).toFixed(3))
    const rentPct            = parseFloat((rentToRevRatio * 100).toFixed(1))
    const breakEvenMonthly   = Math.round(totalMonthlyCosts / GROSS_MARGIN)
    const breakEvenDaily     = Math.ceil(breakEvenMonthly / (Math.max(ticket, 1) * TRADING_DAYS))

    const scoreRent          = rentPct <= 12 ? 90 : rentPct <= 20 ? 70 : rentPct <= 30 ? 40 : 10
    const scoreProfitability = monthlyNetProfit > 2000 ? 90 : monthlyNetProfit >= 1000 ? 70 : monthlyNetProfit > 0 ? 50 : 10
    const overall = Math.round(scoreRent * 0.30 + scoreProfitability * 0.25 + _scoreComp * 0.25 + _scoreDem * 0.20)
    const verdict = overall >= 70 ? 'GO' : overall >= 45 ? 'CAUTION' : 'NO'
    const changed = (adjRent != null && adjRent !== baseRent)
      || (adjTicket != null && adjTicket !== baseTicket)
      || (adjCustomers != null && adjCustomers !== baseCustomers)

    return { rent, ticket, customers, monthlyRevenue, totalMonthlyCosts, monthlyGrossProfit, monthlyNetProfit, profitMargin, rentToRevRatio, rentPct, breakEvenMonthly, breakEvenDaily, scoreRent, scoreProfitability, overall, verdict, changed }
  }, [adjRent, adjTicket, adjCustomers, baseRent, baseTicket, baseCustomers, _scoreComp, _scoreDem])

  const adjVc = verdictCfg(adjCalc.verdict)
  const isChanged = adjCalc.changed

  // ── Loading screen — shows live progress from Supabase Realtime ──
  if (loading || (report && !report.verdict && report.status !== 'failed')) {
    const STEPS = [
      'Queued',
      'Sending to analysis engine',
      'Resolving address',
      'Scanning competitors',
      'Querying demographics',
      'Modelling financials',
      'Writing report',
      'Finalising',
    ]
    const currentStep = report?.progress_step || 'Queued'
    const currentIdx  = STEPS.indexOf(currentStep)
    const isFailed    = report?.status === 'failed'

    return (
      <div style={{ minHeight: '100vh', background: S.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: S.font }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 40 }}>
          {isFailed ? (
            <>
              <div style={{ fontSize: 36, marginBottom: 20 }}>⚠️</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: S.white, marginBottom: 8 }}>Analysis failed</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
                {report?.progress_step || 'The analysis engine could not be reached. Please try again.'}
              </p>
              <button
                onClick={() => window.history.back()}
                style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}
              >
                ← Try again
              </button>
            </>
          ) : (
            <>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', borderTopColor: S.brandLight, margin: '0 auto 28px', animation: 'spin 0.9s linear infinite' }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: S.white, letterSpacing: '-0.03em', marginBottom: 6 }}>
                Analysing your location
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
                Usually ready in 20–40 seconds
              </p>

              {/* Live step list — each step lights up as n8n progresses */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                {STEPS.filter(s => s !== 'Queued').map((step, i) => {
                  const stepIdx   = STEPS.indexOf(step)
                  const isDone    = currentIdx > stepIdx
                  const isActive  = currentIdx === stepIdx
                  const isPending = currentIdx < stepIdx

                  return (
                    <div
                      key={step}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px',
                        background: isActive ? 'rgba(20,184,166,0.1)' : isDone ? 'rgba(255,255,255,0.03)' : 'transparent',
                        borderRadius: 10,
                        border: isActive ? '1px solid rgba(20,184,166,0.25)' : '1px solid transparent',
                        transition: 'all 0.3s ease',
                        animation: isActive ? 'fadeIn 0.3s ease' : 'none',
                      }}
                    >
                      {/* Status indicator */}
                      <div style={{ flexShrink: 0, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isDone ? (
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: S.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>✓</span>
                          </div>
                        ) : isActive ? (
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: S.brandLight, animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                        )}
                      </div>

                      {/* Step label */}
                      <span style={{
                        fontSize: 13,
                        fontWeight: isActive ? 700 : isDone ? 600 : 400,
                        color: isActive ? S.brandLight : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                        transition: 'color 0.3s ease',
                      }}>
                        {step}
                      </span>

                      {isActive && (
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(20,184,166,0.6)', animation: 'pulse 1.5s ease infinite' }}>
                          Running…
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 28 }}>
                Live updates via Supabase Realtime
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        button { font-family: inherit; cursor: pointer; }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

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
        <div style={{ padding: '28px 32px' }}>
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
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 60px' }}>
        {/* Two-column layout: main content + right sidebar */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>

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

        {/* ═══════ RECALCULATION PANEL ═══════ */}
        <div style={{ marginBottom: 16 }}>
          {/* Toggle button */}
          <button
            onClick={() => setSliderOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: isChanged ? S.brand : S.white,
              color: isChanged ? S.white : S.n700,
              border: `1.5px solid ${isChanged ? S.brand : S.n200}`,
              borderRadius: 10, padding: '8px 16px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: S.font, boxShadow: isChanged ? '0 2px 10px rgba(15,118,110,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 15 }}>🎚</span>
            {isChanged ? `Adjusted: ${adjCalc.verdict} (${adjCalc.overall}/100)` : 'Adjust assumptions'}
            {isChanged && (
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginLeft: 4 }}>
                {adjCalc.overall > (report.overall_score ?? 0) ? `▲ +${adjCalc.overall - (report.overall_score ?? 0)}` : `▼ ${adjCalc.overall - (report.overall_score ?? 0)}`}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 11 }}>{sliderOpen ? '▲' : '▼'}</span>
          </button>

          {sliderOpen && (
            <div style={{
              marginTop: 10, background: S.white,
              border: `1.5px solid ${S.brandBorder}`,
              borderRadius: 16, padding: '20px 24px',
              boxShadow: '0 4px 20px rgba(15,118,110,0.08)',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>What-if calculator</p>
                  <p style={{ fontSize: 12, color: S.n500, marginTop: 2 }}>Drag to see how changes affect your verdict in real time</p>
                </div>
                {isChanged && (
                  <button
                    onClick={() => { setAdjRent(null); setAdjTicket(null); setAdjCustomers(null) }}
                    style={{ background: S.n100, border: 'none', color: S.n500, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}
                  >Reset</button>
                )}
              </div>

              {/* Three sliders */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                {/* Monthly Rent */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: S.n700 }}>Monthly Rent</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>${(adjRent ?? baseRent).toLocaleString()}</span>
                  </div>
                  <input type="range"
                    min={Math.max(500, Math.round(baseRent * 0.4))}
                    max={Math.round(baseRent * 2.5)}
                    step={100}
                    value={adjRent ?? baseRent}
                    onChange={e => setAdjRent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: S.brand, cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: S.n400 }}>${Math.round(baseRent * 0.4).toLocaleString()}</span>
                    <span style={{ fontSize: 10, color: S.n400 }}>${Math.round(baseRent * 2.5).toLocaleString()}</span>
                  </div>
                  {adjRent != null && adjRent !== baseRent && (
                    <p style={{ fontSize: 11, color: adjRent < baseRent ? S.emerald : S.red, marginTop: 4, fontWeight: 600 }}>
                      {adjRent < baseRent ? '▼' : '▲'} {Math.abs(Math.round(((adjRent - baseRent) / baseRent) * 100))}% vs original
                    </p>
                  )}
                </div>

                {/* Avg Ticket Size */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: S.n700 }}>Avg Ticket Size</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>${adjTicket ?? baseTicket}</span>
                  </div>
                  <input type="range"
                    min={Math.max(1, Math.round(baseTicket * 0.4))}
                    max={Math.round(baseTicket * 2.5)}
                    step={1}
                    value={adjTicket ?? baseTicket}
                    onChange={e => setAdjTicket(Number(e.target.value))}
                    style={{ width: '100%', accentColor: S.brand, cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: S.n400 }}>${Math.round(baseTicket * 0.4)}</span>
                    <span style={{ fontSize: 10, color: S.n400 }}>${Math.round(baseTicket * 2.5)}</span>
                  </div>
                  {adjTicket != null && adjTicket !== baseTicket && (
                    <p style={{ fontSize: 11, color: adjTicket > baseTicket ? S.emerald : S.red, marginTop: 4, fontWeight: 600 }}>
                      {adjTicket > baseTicket ? '▲' : '▼'} {Math.abs(Math.round(((adjTicket - baseTicket) / Math.max(baseTicket,1)) * 100))}% vs original
                    </p>
                  )}
                </div>

                {/* Daily Customers */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: S.n700 }}>Daily Customers</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>{adjCustomers ?? baseCustomers}</span>
                  </div>
                  <input type="range"
                    min={Math.max(5, Math.round(baseCustomers * 0.3))}
                    max={Math.round(baseCustomers * 3)}
                    step={1}
                    value={adjCustomers ?? baseCustomers}
                    onChange={e => setAdjCustomers(Number(e.target.value))}
                    style={{ width: '100%', accentColor: S.brand, cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: S.n400 }}>{Math.round(baseCustomers * 0.3)}/day</span>
                    <span style={{ fontSize: 10, color: S.n400 }}>{Math.round(baseCustomers * 3)}/day</span>
                  </div>
                  {adjCustomers != null && adjCustomers !== baseCustomers && (
                    <p style={{ fontSize: 11, color: adjCustomers > baseCustomers ? S.emerald : S.red, marginTop: 4, fontWeight: 600 }}>
                      {adjCustomers > baseCustomers ? '▲' : '▼'} {Math.abs(Math.round(((adjCustomers - baseCustomers) / Math.max(baseCustomers,1)) * 100))}% vs original
                    </p>
                  )}
                </div>
              </div>

              {/* Live results strip */}
              {isChanged && (
                <div style={{
                  marginTop: 20, padding: '14px 18px',
                  background: adjVc.bg, border: `1.5px solid ${adjVc.border}`,
                  borderRadius: 12, display: 'grid',
                  gridTemplateColumns: 'auto repeat(4,1fr)',
                  gap: 16, alignItems: 'center',
                }}>
                  {/* New verdict */}
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: adjVc.text, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>New Verdict</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: adjVc.text }}>{adjCalc.overall}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: adjVc.text }}>{adjVc.label}</span>
                    </div>
                    <p style={{ fontSize: 10, color: adjVc.text, opacity: 0.7, marginTop: 2 }}>
                      was {report.overall_score} {vc.label}
                    </p>
                  </div>
                  {[
                    { label: 'Monthly Revenue', orig: fin.monthlyRevenue, adj: adjCalc.monthlyRevenue, format: (v: number) => '$' + (v/1000).toFixed(1) + 'k' },
                    { label: 'Net Profit/Mo',   orig: fin.monthlyNetProfit, adj: adjCalc.monthlyNetProfit, format: (v: number) => '$' + (v/1000).toFixed(1) + 'k' },
                    { label: 'Rent %',          orig: fin.rent?.toRevenuePercent, adj: adjCalc.rentPct, format: (v: number) => v.toFixed(1) + '%' },
                    { label: 'Break-even/Day',  orig: report.breakeven_daily, adj: adjCalc.breakEvenDaily, format: (v: number) => v + ' cust.' },
                  ].map(m => {
                    const delta = (m.adj ?? 0) - (m.orig ?? 0)
                    const better = m.label === 'Rent %' || m.label === 'Break-even/Day' ? delta < 0 : delta > 0
                    return (
                      <div key={m.label} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: adjVc.text, opacity: 0.65, marginBottom: 4 }}>{m.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 900, color: adjVc.text, fontFamily: S.mono }}>{m.adj != null ? m.format(m.adj) : '—'}</p>
                        {delta !== 0 && m.orig != null && (
                          <p style={{ fontSize: 10, color: better ? S.emerald : S.red, fontWeight: 700, marginTop: 2 }}>
                            {better ? '▲' : '▼'} {m.format(Math.abs(delta))}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <p style={{ fontSize: 11, color: S.n400, marginTop: 12, textAlign: 'center' }}>
                These are estimates based on the original model assumptions. Recalculation runs in your browser — no data is sent.
              </p>
            </div>
          )}
        </div>

        {/* ═══════ OVERVIEW ═══════ */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>

            {/* Map + rent ratio side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div style={card({ padding: '16px', marginBottom: 0 })}>
                <SectionHeading>Location Map</SectionHeading>
                <MapPanel
                  address={report.location_name}
                  lat={report.result_data?.location?.lat}
                  lng={report.result_data?.location?.lng}
                  businessType={report.business_type}
                  competitorNames={competitors?.names || []}
                  competitorCount={competitors?.count}
                />
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
                {(competitorDataQuality === 'estimated_fallback' || competitors?.count === 0) && (
                  <div style={{ display: 'flex', gap: 8, padding: '8px 12px', background: S.amberBg, borderRadius: 8, border: `1px solid ${S.amberBdr}`, marginBottom: 10 }}>
                    <span style={{ fontSize: 12 }}>⚠️</span>
                    <span style={{ fontSize: 11, color: S.amber, lineHeight: 1.5 }}>Live competitor data unavailable for this location. Count may be underestimated — manual check recommended before committing.</span>
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
                {demographicsDataQuality && demographicsDataQuality.includes('abs_state_default') && (
                  <div style={{ display: 'flex', gap: 8, padding: '8px 12px', background: S.amberBg, borderRadius: 8, border: `1px solid ${S.amberBdr}`, marginTop: 10 }}>
                    <span style={{ fontSize: 12 }}>⚠️</span>
                    <span style={{ fontSize: 11, color: S.amber, lineHeight: 1.5 }}>Local ABS data unavailable — demand estimate uses national baseline and may be conservative for this suburb.</span>
                  </div>
                )}
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
                <Tile label="Revenue"          value={fmt(fin.monthlyRevenue)}    mono />
                <Tile label="Operating Costs"  value={fmt(fin.totalMonthlyCosts)} color={S.red} mono sub="rent + labour + overhead" />
                <Tile label="Gross Profit"     value={fmt(fin.monthlyGrossProfit)} color={S.blue} mono sub="revenue − COGS only" />
                <Tile label="Net Profit"       value={fmt(fin.monthlyNetProfit)}  color={(fin.monthlyNetProfit ?? 0) >= 0 ? S.emerald : S.red} mono />
              </div>
              {fin.monthlyRevenue && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, textAlign: 'center' }}>Monthly Cost Structure</p>
                  <PLWaterfall fin={fin} submittedRent={report.monthly_rent} />
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
                  <BreakevenGauge daily={report.breakeven_daily} breakeven={fin.breakEven?.dailyCustomers ?? null} />
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

        </div>{/* end left column */}

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
        <div style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 24 }}>

          {/* Verdict summary */}
          <div style={{ background: vc.bg, border: `1.5px solid ${vc.border}`, borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Verdict</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: vc.text, lineHeight: 1 }}>{report.overall_score}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: vc.text }}>{vc.label}</p>
                <p style={{ fontSize: 11, color: S.n500 }}>out of 100</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: S.n700, lineHeight: 1.5 }}>{report.recommendation?.slice(0, 120)}{(report.recommendation?.length || 0) > 120 ? '…' : ''}</p>
          </div>

          {/* Key numbers */}
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Key Numbers</p>
            {[
              { label: 'Monthly Revenue',   value: fmt(fin.monthlyRevenue),   color: S.n900 },
              { label: 'Net Profit / Mo',   value: fmt(fin.monthlyNetProfit), color: (fin.monthlyNetProfit || 0) >= 0 ? S.emerald : S.red },
              { label: 'Rent-to-Revenue',   value: fin.rent?.toRevenuePercent != null ? fin.rent.toRevenuePercent + '%' : '—', color: (fin.rent?.toRevenuePercent || 0) <= 12 ? S.emerald : (fin.rent?.toRevenuePercent || 0) <= 20 ? S.amber : S.red },
              { label: 'Break-even / Day',  value: report.breakeven_daily ? report.breakeven_daily + ' cust.' : '—', color: S.n900 },
              { label: 'Payback Period',    value: report.breakeven_months && report.breakeven_months !== 999 ? report.breakeven_months + ' months' : 'Not viable', color: S.n900 },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${S.n100}` }}>
                <span style={{ fontSize: 12, color: S.n500 }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: item.color, fontFamily: S.mono }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Score pills */}
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Score Components</p>
            {[
              { label: 'Rent',          score: report.score_rent },
              { label: 'Competition',   score: report.score_competition },
              { label: 'Demographics',  score: report.score_demand },
              { label: 'Profitability', score: report.score_profitability },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: S.n700 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.score != null ? (item.score >= 70 ? S.emerald : item.score >= 45 ? S.amber : S.red) : S.n400 }}>{item.score ?? '—'}</span>
                </div>
                <div style={{ height: 5, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.score || 0}%`, background: item.score != null ? (item.score >= 70 ? S.emerald : item.score >= 45 ? S.amber : S.red) : S.n200, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => router.push('/dashboard')} style={{ background: S.white, color: S.n700, border: `1.5px solid ${S.n200}`, borderRadius: 11, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: S.font }}>
              ← Back to dashboard
            </button>
            <button onClick={() => router.push('/onboarding')} style={{ background: S.brand, color: S.white, border: 'none', borderRadius: 11, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,118,110,0.2)', fontFamily: S.font }}>
              ➕ Analyse new location
            </button>
          </div>

        </div>{/* end right sidebar */}

        </div>{/* end two-column */}
      </div>
    </div>
  )
}