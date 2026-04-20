'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// ── Benchmark data ────────────────────────────────────────────────────────────
// Monthly rent ranges (lo/hi) and typical benchmark revenue by city × zone × type.
// Revenue figures are realistic benchmarks for a standard ~80–120sqm tenancy in
// the relevant zone. They drive the rent-to-revenue ratio signal.
// Sources: REA commercial listings, CBRE Australian retail reports (2024–2025),
// Colliers hospitality rent review data.

type BizType = 'cafe' | 'restaurant' | 'retail' | 'gym' | 'salon'
type Zone = 'inner' | 'middle' | 'outer'

interface ZoneData {
  label: string
  cafe:       { lo: number; hi: number; revenue: number }
  restaurant: { lo: number; hi: number; revenue: number }
  retail:     { lo: number; hi: number; revenue: number }
  gym:        { lo: number; hi: number; revenue: number }
  salon:      { lo: number; hi: number; revenue: number }
}

const BENCHMARKS: Record<string, { label: string; zones: Record<Zone, ZoneData> }> = {
  sydney: {
    label: 'Sydney',
    zones: {
      inner:  { label: 'Inner (CBD, Surry Hills, Newtown, Glebe)',
        cafe:       { lo: 9_000,  hi: 16_000, revenue: 75_000 },
        restaurant: { lo: 11_000, hi: 20_000, revenue: 90_000 },
        retail:     { lo: 8_000,  hi: 18_000, revenue: 60_000 },
        gym:        { lo: 8_000,  hi: 15_000, revenue: 65_000 },
        salon:      { lo: 5_000,  hi: 12_000, revenue: 42_000 } },
      middle: { label: 'Middle ring (Parramatta, Chatswood, Strathfield)',
        cafe:       { lo: 5_500,  hi: 10_000, revenue: 52_000 },
        restaurant: { lo: 6_500,  hi: 12_000, revenue: 65_000 },
        retail:     { lo: 5_000,  hi: 9_000,  revenue: 42_000 },
        gym:        { lo: 5_000,  hi: 9_000,  revenue: 48_000 },
        salon:      { lo: 3_500,  hi: 7_000,  revenue: 30_000 } },
      outer:  { label: 'Outer suburbs (Blacktown, Liverpool, Penrith)',
        cafe:       { lo: 3_000,  hi: 6_500,  revenue: 35_000 },
        restaurant: { lo: 3_500,  hi: 7_500,  revenue: 42_000 },
        retail:     { lo: 2_500,  hi: 5_500,  revenue: 28_000 },
        gym:        { lo: 2_800,  hi: 6_000,  revenue: 32_000 },
        salon:      { lo: 2_000,  hi: 4_500,  revenue: 22_000 } },
    },
  },
  melbourne: {
    label: 'Melbourne',
    zones: {
      inner:  { label: 'Inner (Fitzroy, Collingwood, South Yarra, CBD)',
        cafe:       { lo: 7_500,  hi: 14_000, revenue: 68_000 },
        restaurant: { lo: 9_000,  hi: 16_000, revenue: 80_000 },
        retail:     { lo: 7_000,  hi: 15_000, revenue: 55_000 },
        gym:        { lo: 7_000,  hi: 13_000, revenue: 60_000 },
        salon:      { lo: 4_500,  hi: 10_000, revenue: 38_000 } },
      middle: { label: 'Middle ring (Hawthorn, Richmond, St Kilda)',
        cafe:       { lo: 5_000,  hi: 9_000,  revenue: 50_000 },
        restaurant: { lo: 6_000,  hi: 11_000, revenue: 60_000 },
        retail:     { lo: 4_500,  hi: 8_000,  revenue: 38_000 },
        gym:        { lo: 4_500,  hi: 8_500,  revenue: 44_000 },
        salon:      { lo: 3_000,  hi: 6_500,  revenue: 27_000 } },
      outer:  { label: 'Outer suburbs (Dandenong, Frankston, Werribee)',
        cafe:       { lo: 2_800,  hi: 5_500,  revenue: 32_000 },
        restaurant: { lo: 3_200,  hi: 7_000,  revenue: 38_000 },
        retail:     { lo: 2_500,  hi: 5_000,  revenue: 25_000 },
        gym:        { lo: 2_500,  hi: 5_500,  revenue: 29_000 },
        salon:      { lo: 1_800,  hi: 4_000,  revenue: 20_000 } },
    },
  },
  perth: {
    label: 'Perth',
    zones: {
      inner:  { label: 'Inner (Leederville, Subiaco, Fremantle, Northbridge)',
        cafe:       { lo: 5_500,  hi: 10_000, revenue: 60_000 },
        restaurant: { lo: 6_500,  hi: 11_000, revenue: 70_000 },
        retail:     { lo: 5_000,  hi: 9_000,  revenue: 45_000 },
        gym:        { lo: 5_500,  hi: 9_500,  revenue: 52_000 },
        salon:      { lo: 3_500,  hi: 7_000,  revenue: 32_000 } },
      middle: { label: 'Middle ring (Victoria Park, Mt Lawley, Applecross)',
        cafe:       { lo: 3_500,  hi: 7_000,  revenue: 42_000 },
        restaurant: { lo: 4_500,  hi: 8_500,  revenue: 52_000 },
        retail:     { lo: 3_000,  hi: 6_500,  revenue: 32_000 },
        gym:        { lo: 3_500,  hi: 7_000,  revenue: 38_000 },
        salon:      { lo: 2_500,  hi: 5_000,  revenue: 24_000 } },
      outer:  { label: 'Outer suburbs (Armadale, Midland, Rockingham)',
        cafe:       { lo: 2_000,  hi: 4_500,  revenue: 28_000 },
        restaurant: { lo: 2_500,  hi: 5_500,  revenue: 34_000 },
        retail:     { lo: 1_800,  hi: 4_000,  revenue: 22_000 },
        gym:        { lo: 2_000,  hi: 4_500,  revenue: 26_000 },
        salon:      { lo: 1_500,  hi: 3_500,  revenue: 18_000 } },
    },
  },
  brisbane: {
    label: 'Brisbane',
    zones: {
      inner:  { label: 'Inner (CBD, Fortitude Valley, West End, South Brisbane)',
        cafe:       { lo: 6_500,  hi: 12_000, revenue: 62_000 },
        restaurant: { lo: 8_000,  hi: 14_000, revenue: 75_000 },
        retail:     { lo: 6_000,  hi: 12_000, revenue: 50_000 },
        gym:        { lo: 6_000,  hi: 11_000, revenue: 55_000 },
        salon:      { lo: 4_000,  hi: 8_500,  revenue: 36_000 } },
      middle: { label: 'Middle ring (Chermside, Toowong, Carindale)',
        cafe:       { lo: 4_500,  hi: 8_000,  revenue: 46_000 },
        restaurant: { lo: 5_500,  hi: 10_000, revenue: 57_000 },
        retail:     { lo: 4_000,  hi: 7_500,  revenue: 36_000 },
        gym:        { lo: 4_000,  hi: 8_000,  revenue: 42_000 },
        salon:      { lo: 2_800,  hi: 6_000,  revenue: 26_000 } },
      outer:  { label: 'Outer suburbs (Logan, Redcliffe, Ipswich)',
        cafe:       { lo: 2_500,  hi: 5_500,  revenue: 30_000 },
        restaurant: { lo: 3_000,  hi: 6_500,  revenue: 36_000 },
        retail:     { lo: 2_200,  hi: 5_000,  revenue: 24_000 },
        gym:        { lo: 2_200,  hi: 5_000,  revenue: 28_000 },
        salon:      { lo: 1_600,  hi: 3_800,  revenue: 19_000 } },
    },
  },
  adelaide: {
    label: 'Adelaide',
    zones: {
      inner:  { label: 'Inner (CBD, Rundle Street, Norwood, Glenelg)',
        cafe:       { lo: 4_500,  hi: 8_500,  revenue: 52_000 },
        restaurant: { lo: 5_500,  hi: 10_000, revenue: 62_000 },
        retail:     { lo: 4_000,  hi: 8_000,  revenue: 40_000 },
        gym:        { lo: 4_500,  hi: 8_500,  revenue: 46_000 },
        salon:      { lo: 3_000,  hi: 6_000,  revenue: 28_000 } },
      middle: { label: 'Middle ring (Prospect, Unley, Burnside)',
        cafe:       { lo: 3_000,  hi: 6_000,  revenue: 38_000 },
        restaurant: { lo: 3_500,  hi: 7_000,  revenue: 46_000 },
        retail:     { lo: 2_800,  hi: 5_500,  revenue: 29_000 },
        gym:        { lo: 3_000,  hi: 5_800,  revenue: 34_000 },
        salon:      { lo: 2_000,  hi: 4_500,  revenue: 21_000 } },
      outer:  { label: 'Outer suburbs (Salisbury, Elizabeth, Christies Beach)',
        cafe:       { lo: 1_800,  hi: 4_000,  revenue: 25_000 },
        restaurant: { lo: 2_200,  hi: 5_000,  revenue: 30_000 },
        retail:     { lo: 1_600,  hi: 3_500,  revenue: 20_000 },
        gym:        { lo: 1_800,  hi: 4_000,  revenue: 23_000 },
        salon:      { lo: 1_200,  hi: 3_000,  revenue: 15_000 } },
    },
  },
}

const BIZ_LABELS: Record<BizType, string> = {
  cafe:       'Café / Coffee',
  restaurant: 'Restaurant',
  retail:     'Retail shop',
  gym:        'Gym / Fitness',
  salon:      'Salon / Beauty',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return '$' + n.toLocaleString()
}

function pct(rent: number, rev: number) {
  return ((rent / rev) * 100).toFixed(1)
}

type RentSignal = 'well-below' | 'below' | 'within' | 'above' | 'well-above'

function getRentSignal(rent: number, lo: number, hi: number): RentSignal {
  const mid   = (lo + hi) / 2
  const range = hi - lo
  if (rent < lo - range * 0.2)    return 'well-below'
  if (rent < lo)                  return 'below'
  if (rent <= hi)                 return 'within'
  if (rent < hi + range * 0.25)   return 'above'
  return 'well-above'
}

type RentVerdict = 'GO' | 'CAUTION' | 'NO'

function getRentVerdict(rentRatioPct: number): RentVerdict {
  if (rentRatioPct < 12) return 'GO'
  if (rentRatioPct < 15) return 'CAUTION'
  return 'NO'
}

const SIGNAL_META: Record<RentSignal, { label: string; color: string; bg: string; bdr: string; hint: string }> = {
  'well-below': { label: 'Well below typical',    color: '#059669', bg: '#F0FDF4', bdr: '#A7F3D0',
    hint: 'This rent is meaningfully below what comparable spaces typically ask in this area. Either the space has a limitation (smaller, weaker position, limited frontage) or there is genuine negotiation room in the market. Dig into why before signing.' },
  below:        { label: 'Below typical range',   color: '#0284C7', bg: '#F0F9FF', bdr: '#BAE6FD',
    hint: 'Slightly below the typical range for this city, zone, and business type. This is a good starting position — landlord may have flexibility, or the site has a minor drawback worth understanding.' },
  within:       { label: 'Within typical range',  color: '#6B7280', bg: '#F8FAFC', bdr: '#E2E8F0',
    hint: 'This rent is within the typical range for this city, zone, and business type. Whether it is fair value depends on the specific site quality, lease terms, and your revenue model.' },
  above:        { label: 'Above typical range',   color: '#D97706', bg: '#FFFBEB', bdr: '#FDE68A',
    hint: 'This rent is above the typical range. The landlord may have leverage (premium corner, transport node, fit-out included) or the market is tightening. Verify with 2–3 comparable live listings before accepting.' },
  'well-above': { label: 'Significantly above',   color: '#DC2626', bg: '#FEF2F2', bdr: '#FECACA',
    hint: 'This rent is well above what comparable spaces typically ask. Unless there is a clear premium justification (best corner in the strip, included fit-out worth $200k+, anchor-adjacent), this rent is hard to justify. Get comparable listings and push back.' },
}

const VERDICT_META: Record<RentVerdict, { color: string; bg: string; bdr: string; label: string }> = {
  GO:      { color: '#059669', bg: '#F0FDF4', bdr: '#A7F3D0', label: 'GO' },
  CAUTION: { color: '#D97706', bg: '#FFFBEB', bdr: '#FDE68A', label: 'CAUTION' },
  NO:      { color: '#DC2626', bg: '#FEF2F2', bdr: '#FECACA', label: 'NO' },
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RentChecker() {
  const [city,    setCity]    = useState<string>('sydney')
  const [zone,    setZone]    = useState<Zone>('inner')
  const [bizType, setBizType] = useState<BizType>('cafe')
  const [rentStr, setRentStr] = useState('')

  const rent = useMemo(() => {
    const n = parseFloat(rentStr.replace(/[^0-9.]/g, ''))
    return isNaN(n) ? null : n
  }, [rentStr])

  const cityData = BENCHMARKS[city]
  const zoneData = cityData?.zones[zone]
  const biz      = zoneData?.[bizType]

  const result = useMemo(() => {
    if (!rent || !biz) return null
    const ratio   = (rent / biz.revenue) * 100
    const signal  = getRentSignal(rent, biz.lo, biz.hi)
    const verdict = getRentVerdict(ratio)
    const maxGo   = Math.floor(biz.revenue * 0.10 / 100) * 100
    const maxCaution = Math.floor(biz.revenue * 0.12 / 100) * 100
    const revenueNeeded = Math.ceil(rent / 0.10 / 1000) * 1000
    return { ratio, signal, verdict, maxGo, maxCaution, revenueNeeded }
  }, [rent, biz])

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', fontSize: 14, fontWeight: 500,
    border: '1.5px solid #E2E8F0', borderRadius: 10, outline: 'none',
    background: '#fff', color: '#0F172A', appearance: 'none' as const,
    fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 700, color: '#475569',
    marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Geist', Inter, -apple-system, sans-serif", color: '#0F172A', maxWidth: 760, margin: '0 auto' }}>

      {/* ── Form ── */}
      <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 1px 3px rgba(15,23,42,.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>

          {/* City */}
          <div>
            <label style={labelStyle}>City</label>
            <select value={city} onChange={e => setCity(e.target.value)} style={inputStyle}>
              {Object.entries(BENCHMARKS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Zone */}
          <div>
            <label style={labelStyle}>Area type</label>
            <select value={zone} onChange={e => setZone(e.target.value as Zone)} style={inputStyle}>
              {cityData && Object.entries(cityData.zones).map(([k, v]) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)} — {v.label}</option>
              ))}
            </select>
          </div>

          {/* Business type */}
          <div>
            <label style={labelStyle}>Business type</label>
            <select value={bizType} onChange={e => setBizType(e.target.value as BizType)} style={inputStyle}>
              {Object.entries(BIZ_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Rent */}
          <div>
            <label style={labelStyle}>Quoted monthly rent</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>$</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 7600"
                value={rentStr}
                onChange={e => setRentStr(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 26 }}
              />
            </div>
          </div>
        </div>

        {/* Benchmark context */}
        {biz && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, color: '#64748B' }}>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>Benchmark for {BIZ_LABELS[bizType]} in {cityData.label} {zone}:</span>
            <span>{fmt(biz.lo)}–{fmt(biz.hi)}/mo typical asking rent</span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span>~{fmt(biz.revenue)}/mo revenue benchmark</span>
          </div>
        )}
      </div>

      {/* ── Result ── */}
      {result && rent && biz ? (
        <div style={{ marginTop: 20, display: 'grid', gap: 14 }}>

          {/* Market position card */}
          <div style={{ background: SIGNAL_META[result.signal].bg, border: `1.5px solid ${SIGNAL_META[result.signal].bdr}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: SIGNAL_META[result.signal].color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: SIGNAL_META[result.signal].color, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
                {SIGNAL_META[result.signal].label}
              </span>
              <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#0F172A', fontWeight: 700, marginLeft: 'auto' }}>
                {fmt(rent)}/mo vs {fmt(biz.lo)}–{fmt(biz.hi)} typical
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
              {SIGNAL_META[result.signal].hint}
            </p>
          </div>

          {/* 3-metric row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {/* Ratio verdict */}
            <div style={{ background: VERDICT_META[result.verdict].bg, border: `1.5px solid ${VERDICT_META[result.verdict].bdr}`, borderRadius: 14, padding: '18px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>Rent-to-revenue</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: VERDICT_META[result.verdict].color, fontFamily: 'monospace', lineHeight: 1, marginBottom: 4 }}>
                {result.ratio.toFixed(1)}%
              </p>
              <span style={{ fontSize: 11, fontWeight: 800, color: VERDICT_META[result.verdict].color, background: 'rgba(0,0,0,0.06)', borderRadius: 5, padding: '2px 7px' }}>
                {VERDICT_META[result.verdict].label}
              </span>
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>
                {result.verdict === 'GO' ? '< 12% — healthy range' : result.verdict === 'CAUTION' ? '12–15% — tight but viable' : '> 15% — dangerously high'}
              </p>
            </div>

            {/* Max viable rent */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>GO rent ceiling</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#059669', fontFamily: 'monospace', lineHeight: 1, marginBottom: 4 }}>
                {fmt(result.maxGo)}
              </p>
              <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>
                Max rent at 10% of {fmt(biz.revenue)} benchmark revenue. This is your walkaway number.
              </p>
            </div>

            {/* Revenue needed */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>Revenue to justify</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: result.verdict === 'GO' ? '#059669' : result.verdict === 'CAUTION' ? '#D97706' : '#DC2626', fontFamily: 'monospace', lineHeight: 1, marginBottom: 4 }}>
                {fmt(result.revenueNeeded)}
              </p>
              <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>
                Monthly revenue needed to keep this rent at 10%. {result.verdict !== 'GO' ? `That is ${Math.round((result.revenueNeeded / biz.revenue - 1) * 100)}% above the ${fmt(biz.revenue)} benchmark.` : `Achievable on this benchmark.`}
              </p>
            </div>
          </div>

          {/* Negotiation note */}
          {result.verdict !== 'GO' && (
            <div style={{ background: '#0B1512', border: '1px solid rgba(167,243,208,.15)', borderRadius: 14, padding: '18px 22px' }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#6EE7B7', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 8 }}>Negotiation position</p>
              <p style={{ fontSize: 13, color: '#D1FAE5', lineHeight: 1.7, margin: 0 }}>
                {result.verdict === 'CAUTION'
                  ? <>Your target is <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{fmt(result.maxGo)}/mo</strong> — a reduction of <strong style={{ color: '#FCD34D', fontFamily: 'monospace' }}>{fmt(Math.round(rent - result.maxGo))}</strong>. If the landlord won&apos;t move on face rent, push for a <strong style={{ color: '#fff' }}>rent-free period</strong> (1–3 months) or a <strong style={{ color: '#fff' }}>CPI-capped review clause</strong> to protect yourself from crossing 15% in year 2. Either lever reduces your effective rent per dollar committed.</>
                  : <>At this rent-to-revenue ratio, the economics don&apos;t work at the {cityData.label} benchmark for {BIZ_LABELS[bizType]}. You need to either: (1) negotiate face rent below <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{fmt(result.maxCaution)}/mo</strong>, or (2) demonstrate a credible reason your revenue will exceed the benchmark by {Math.round((result.revenueNeeded / biz.revenue - 1) * 100)}%. A <strong style={{ color: '#fff' }}>full Locatalyze report</strong> will show you whether the specific address has the foot traffic to support that claim.</>
                }
              </p>
            </div>
          )}

          {/* CTA strip */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <Link href={`/onboarding`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#059669', color: '#fff', borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Run full analysis for this address →
            </Link>
            <Link href="/tools/break-even-foot-traffic" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#0F172A', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Calculate break-even customers →
            </Link>
          </div>
        </div>
      ) : (
        /* Empty state */
        !rent && (
          <div style={{ marginTop: 20, background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 16, padding: '32px 24px', textAlign: 'center' as const }}>
            <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>
              Enter your quoted monthly rent to see whether it is above market, below market, or within the typical range — and what the rent-to-revenue ratio means for your viability.
            </p>
          </div>
        )
      )}
    </div>
  )
}
