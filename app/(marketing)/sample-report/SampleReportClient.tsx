'use client'

// SampleReportClient.tsx — interactive tabbed sample report
// Split from page.tsx so metadata stays in the Server Component

import Link from 'next/link'
import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — all financial figures for this sample report
// Update numbers HERE only. Do not hardcode figures elsewhere in this file.
// Derivation:
//   revenue     = customers × ticket × tradingDays = 150 × 17.50 × 26 = 68,250 ≈ 68,000
//   cogs        = revenue × cogsRate               = 68,000 × 0.38   = 25,840
//   grossProfit = revenue × grossMarginRate        = 68,000 × 0.62   = 42,160
//   fixedCosts  = rent + staff + overheads         = 7,600 + 20,000 + 2,560 = 30,160
//   totalCosts  = fixedCosts + cogs                = 30,160 + 25,840 = 56,000
//   netProfit   = revenue − totalCosts             = 68,000 − 56,000 = 12,000
//   rentRatio   = rent / revenue                   = 7,600 / 68,000  = 11.2%
//   beDaily     = (fixedCosts/mo ÷ tradingDays) ÷ (ticket × grossMarginRate)
//               = (30,160 ÷ 26) ÷ (17.50 × 0.62) = 1,160 ÷ 10.85   ≈ 107
//   payback     = setupBudget / netProfit           = 147,200 / 12,000 = 12.3 → 12 mo
// ─────────────────────────────────────────────────────────────────────────────
const M = {
  // Inputs
  rent:         7_600,
  customers:    150,
  ticket:       17.50,
  tradingDays:  26,
  cogsRate:     0.38,
  setupBudget:  147_200,
  // Derived — do not edit independently
  revenue:      68_000,
  grossProfit:  42_200,
  totalCosts:   56_000,
  netProfit:    12_000,
  rentRatio:    '11.2%',
  beDaily:      107,
  paybackMonths: 12,
  // Scenarios (operating leverage: fixed $30,160 + variable 38%)
  best:   { label: 'Best Case',   pct: '130% demand', rev: '$88,400', costs: '$63,800', profit: '$24,600' },
  base:   { label: 'Base Case',   pct: '100% demand', rev: '$68,000', costs: '$56,000', profit: '$12,000' },
  stress: { label: 'Stress Case', pct: '80% demand',  rev: '$54,400', costs: '$50,800', profit: '$3,600' },
} as const

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  blue: '#2563EB', blueBg: '#EFF6FF', blueBdr: '#BFDBFE',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C',
  n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#111827', mono: "'JetBrains Mono','Fira Mono',monospace",
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: string }) {
  const color = score >= 70 ? S.emerald : score >= 45 ? S.amber : S.red
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: S.n500 }}>{label}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: S.n400, fontFamily: S.mono }}>{weight}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color, fontFamily: S.mono }}>{score}</span>
        </div>
      </div>
      <div style={{ height: 5, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function Tile({ label, value, sub, color, mono }: { label: string; value: string; sub?: string; color?: string; mono?: boolean }) {
  return (
    <div style={{ background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '12px 14px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 900, color: color || S.n900, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: mono ? S.mono : S.font }}>{value}</p>
      {sub && <p style={{ fontSize: 10, color: S.n400, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 3, height: 14, background: S.brand, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</span>
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: S.white, borderRadius: 12, border: `1px solid ${S.n200}`,
      padding: '20px 22px', marginBottom: 12, ...style,
    }}>
      {children}
    </div>
  )
}

// Fake competitor map placeholder — real reports use Leaflet with live data
function MapPlaceholder() {
  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${S.n200}` }}>
      <div style={{ background: S.n900, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: S.brand, border: '2px solid #fff' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Your location</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FCA5A5', border: '2px solid #DC2626' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>4 competitors within 500m</span>
        </div>
      </div>
      <div style={{
        height: 240, background: '#E8EDF2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 10, position: 'relative',
      }}>
        {/* Fake map grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ position: 'absolute', left: `${i * 25}%`, top: 0, bottom: 0, width: 1, background: '#CBD5E1' }} />
          ))}
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ position: 'absolute', top: `${i * 25}%`, left: 0, right: 0, height: 1, background: '#CBD5E1' }} />
          ))}
        </div>
        {/* Centre pin */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: S.brand, border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
        </div>
        {/* Radius circle hint */}
        <div style={{
          position: 'absolute', width: 120, height: 120, borderRadius: '50%',
          border: `1.5px dashed ${S.brand}`, opacity: 0.4,
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />
        {/* Competitor dots */}
        {[
          { top: '28%', left: '38%' }, { top: '55%', left: '62%' },
          { top: '40%', left: '58%' }, { top: '65%', left: '44%' },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', width: 12, height: 12, borderRadius: '50%',
            background: '#FCA5A5', border: '2px solid #DC2626',
            top: pos.top, left: pos.left, zIndex: 2,
          }} />
        ))}
        <div style={{
          position: 'absolute', bottom: 10, right: 10, zIndex: 3,
          background: 'rgba(255,255,255,0.9)', borderRadius: 8,
          padding: '6px 10px', fontSize: 11, color: S.n700, fontWeight: 600,
        }}>
          Live map in full report
        </div>
      </div>
    </div>
  )
}

export default function SampleReportClient() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Sample banner */}
      <div style={{ background: S.amber, padding: '10px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
          SAMPLE REPORT — Illustrative data only. Address "214 Oxford Street, Leederville WA 6007" is fictional. These numbers must not be used for investment or leasing decisions.{' '}
          <Link href="/onboarding" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 800 }}>
            Run yours free →
          </Link>
        </p>
      </div>

      {/* Dark header */}
      <div style={{ background: S.headerBg, borderBottom: '1px solid #1F2937' }}>

        {/* Nav */}
        <nav style={{ padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '-0.02em' }}>Locatalyze</span>
            </Link>
            <span style={{ color: '#374151' }}>›</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>Sample Report</span>
          </div>
          <Link href="/onboarding" style={{ background: S.brand, color: '#fff', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Run my report free →
          </Link>
        </nav>

        {/* Verdict hero */}
        <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Sample report</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: S.mono }}>214 Oxford Street, Leederville WA 6007</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Competitor data · Google Maps · illustrative sample only</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.2 }}>
                Specialty Café
              </h1>
              {/* Verdict badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(5,150,105,0.15)', border: '1.5px solid rgba(5,150,105,0.4)', borderRadius: 8, padding: '8px 16px', marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.emerald, boxShadow: `0 0 8px ${S.emerald}` }} />
                <span style={{ fontSize: 14, fontWeight: 900, color: S.emerald, letterSpacing: '0.06em' }}>GO</span>
                <span style={{ width: 1, height: 14, background: 'rgba(5,150,105,0.3)' }} />
                <span style={{ fontSize: 11, color: 'rgba(5,150,105,0.7)', fontWeight: 600 }}>LOW RISK</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 480 }}>
                Leederville's Oxford Street is one of Perth's strongest café corridors. The rent-to-revenue ratio of 11.2% sits within the healthy range for specialty coffee, foot traffic density is high, and competition is manageable. The demographic profile — median income $96,000, age skew 25–44 — aligns closely with consistent specialty coffee spend.
              </p>
            </div>
            {/* Score ring */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 90, height: 90 }}>
                <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="45" cy="45" r="36" fill="none" stroke={S.emerald} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 84 / 100)}`}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: S.emerald, lineHeight: 1, fontFamily: S.mono }}>84</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>/100</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</p>
            </div>
          </div>

          {/* Key metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#1F2937', borderRadius: 10, overflow: 'hidden', border: '1px solid #1F2937' }}>
            {[
              { l: 'Monthly Revenue',  v: `~$${M.revenue.toLocaleString()}`,    s: 'benchmark est. ±20%' },
              { l: 'Net Profit / Mo',  v: `~$${M.netProfit.toLocaleString()}`,  s: 'benchmark est. ±25% · excl. owner' },
              { l: 'Break-even Daily', v: `${M.beDaily} cust.`,                 s: 'to cover costs' },
              { l: 'Payback Period',   v: `${M.paybackMonths} months`,          s: 'excl. ramp-up' },
            ].map(m => (
              <div key={m.l} style={{ padding: '14px 16px', background: '#161D27' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{m.l}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: S.mono }}>{m.v}</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{m.s}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8, paddingLeft: 4, fontStyle: 'italic' }}>
            Revenue (±20%) and profit (±25%) are model estimates from industry benchmarks — not financial forecasts. Actual results will vary.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px' }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, background: S.white, border: `1px solid ${S.n200}`, borderRadius: 10, padding: 4, marginBottom: 14 }}>
              {['Overview', 'Competition', 'Financials', 'Market'].map((t) => {
                const id = t.toLowerCase()
                return (
                  <div key={t} onClick={() => setActiveTab(id)}
                    style={{
                      flex: 1, padding: '8px 6px', borderRadius: 7,
                      background: activeTab === id ? S.headerBg : 'transparent',
                      color: activeTab === id ? '#fff' : S.n500,
                      fontSize: 12, fontWeight: 700, textAlign: 'center', cursor: 'pointer',
                      letterSpacing: '-0.01em',
                    }}>
                    {t}
                  </div>
                )
              })}
            </div>

            {/* Overview tab */}
            {activeTab === 'overview' && (
              <>
                {/* Map + Rent ratio */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Card style={{ padding: 16 }}>
                    <SectionLabel>Location Map</SectionLabel>
                    <MapPlaceholder />
                  </Card>
                  <Card style={{ padding: 16 }}>
                    <SectionLabel>Rent Analysis</SectionLabel>
                    {/* Rent ratio panel */}
                    <div style={{ background: S.amberBg, border: `1.5px solid ${S.amberBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 800, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Rent-to-Revenue Ratio</p>
                          <p style={{ fontSize: 11, color: S.amber, opacity: 0.85 }}>Benchmark: under 12% healthy · 1% margin to threshold</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 32, fontWeight: 900, color: S.amber, letterSpacing: '-0.04em', lineHeight: 1, fontFamily: S.mono }}>11.2%</div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fff', border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '3px 10px', marginTop: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.amber }} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: S.amber, letterSpacing: '0.06em' }}>MONITOR</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: 7, background: 'rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '93%', background: S.amber, borderRadius: 4, opacity: 0.7 }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <Tile label="Monthly Rent" value="$7,600" mono />
                      <Tile label="Rating" value="Excellent" color={S.emerald} />
                    </div>
                  </Card>
                </div>

                {/* Score breakdown */}
                <Card>
                  <SectionLabel>Score Breakdown</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, alignItems: 'center' }}>
                    <div>
                      <ScoreBar label="Rent Affordability" score={90} weight="20%" />
                      <ScoreBar label="Competition"         score={80} weight="25%" />
                      <ScoreBar label="Market Demand"       score={85} weight="20%" />
                      <ScoreBar label="Profitability"       score={80} weight="25%" />
                      <ScoreBar label="Location Quality"    score={88} weight="10%" />
                      <p style={{ fontSize: 10, color: S.n400, marginTop: 10, lineHeight: 1.6 }}>
                        <strong style={{ fontWeight: 700, color: S.n500 }}>How each score is derived:</strong> Rent Affordability (90) — rent/revenue ratio of 11.2% vs 15% danger threshold. Competition (80) — 6 verified competitors within 1km, moderate saturation. Market Demand (85) — median household income and growth trend. Profitability (80) — net margin of 17.6% and 1.4× break-even cushion. Location Quality (88) — high footfall and excellent transit access. Sub-scores rounded to nearest 5 (±5pt model accuracy). Weighted total: 90×0.20 + 80×0.25 + 85×0.20 + 80×0.25 + 88×0.10 = <strong style={{ fontWeight: 700, color: S.n500 }}>83</strong>.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <svg width="180" height="180" viewBox="0 0 220 220">
                        {[0.25,0.5,0.75,1].map(l => {
                          const pts = [0,1,2,3].map(i => {
                            const a = (i/4)*2*Math.PI - Math.PI/2
                            return `${110+80*l*Math.cos(a)},${110+80*l*Math.sin(a)}`
                          }).join(' ')
                          return <polygon key={l} points={pts} fill="none" stroke="#E7E5E4" strokeWidth="1" />
                        })}
                        {[0,1,2,3].map(i => {
                          const a = (i/4)*2*Math.PI - Math.PI/2
                          return <line key={i} x1={110} y1={110} x2={110+80*Math.cos(a)} y2={110+80*Math.sin(a)} stroke="#E7E5E4" strokeWidth="1" />
                        })}
                        {(() => {
                          const scores = [90,80,80,85]
                          const pts = scores.map((s,i) => {
                            const a = (i/4)*2*Math.PI - Math.PI/2
                            const v = s/100
                            return `${110+80*v*Math.cos(a)},${110+80*v*Math.sin(a)}`
                          }).join(' ')
                          return <polygon points={pts} fill={S.emerald} fillOpacity="0.12" stroke={S.emerald} strokeWidth="2" strokeLinejoin="round" />
                        })()}
                      </svg>
                    </div>
                  </div>
                </Card>

                {/* Competition + Demographics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Card style={{ marginBottom: 0 }}>
                    <SectionLabel>Competition</SectionLabel>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <div style={{ flex: 1, background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                        <p style={{ fontSize: 24, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>4</p>
                        <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>within 500m</p>
                      </div>
                      <div style={{ flex: 1, background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}`, textAlign: 'center' }}>
                        <p style={{ fontSize: 14, fontWeight: 900, color: S.amber }}>MEDIUM</p>
                        <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>intensity</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>Four café operators within 500m is manageable for a specialty concept with clear positioning. Two of the four score below 4.0 on Google Maps — indicating an unmet quality ceiling in the precinct.</p>
                    <button onClick={() => setActiveTab('competition')} style={{ marginTop: 8, fontSize: 11, color: S.brand, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: S.font }}>View named competitors + ratings →</button>
                  </Card>

                  <Card style={{ marginBottom: 0 }}>
                    <SectionLabel>Area Demographics</SectionLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      <div style={{ background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                        <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Median Income</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: S.n800, fontFamily: S.mono }}>$96,000<span style={{ fontSize: 10, fontWeight: 500, color: S.n400, fontFamily: S.font }}>/yr</span></p>
                        <p style={{ fontSize: 9, color: S.n400, marginTop: 2 }}>ABS 2021 Census</p>
                      </div>
                      <div style={{ background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                        <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Affordability</p>
                        <p style={{ fontSize: 12, fontWeight: 800, color: S.emerald }}>HIGH</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>Leederville's median household income of $96,000 (ABS 2021 Census, SA2) is 21% above the Perth metro average. The 25–44 age cohort represents 48% of the residential population.</p>
                  </Card>
                </div>

                {/* SWOT */}
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 3, height: 14, background: S.brand, borderRadius: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>SWOT Analysis</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: S.n400, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 4, padding: '1px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI-generated</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'Strengths', items: ['Oxford Street foot traffic among Perth\'s highest on weekday mornings', 'Rent-to-revenue at 11.2% — within the 12% healthy threshold', 'Demographics align strongly: 25–44, $96K median income'], bg: S.emeraldBg, border: S.emeraldBdr, color: '#065F46', dot: S.emerald },
                      { key: 'Weaknesses', items: ['4 existing café competitors require clear positioning', 'Parking on Oxford Street is limited', 'Weekend foot traffic lower than weekday commuter flow'], bg: S.amberBg, border: S.amberBdr, color: '#92400E', dot: S.amber },
                      { key: 'Opportunities', items: ['Specialty coffee quality ceiling unmet by current operators', 'Apartment development expanding catchment', 'Wholesale supply to nearby offices is adjacent revenue'], bg: S.blueBg, border: S.blueBdr, color: '#1E3A8A', dot: S.blue },
                      { key: 'Threats', items: ['Rent review clause could push costs above 12% at renewal', 'New entrant risk if concept succeeds', 'Rising COGS — green bean prices up 18% since 2024'], bg: S.redBg, border: S.redBdr, color: '#991B1B', dot: S.red },
                    ].map(s => (
                      <div key={s.key} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '13px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
                          <p style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.key}</p>
                        </div>
                        {s.items.map((item, i) => (
                          <p key={i} style={{ fontSize: 11, color: s.color, opacity: 0.85, lineHeight: 1.6, marginBottom: i < s.items.length - 1 ? 5 : 0 }}>· {item}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Financials tab */}
            {activeTab === 'financials' && <>
              <Card>
                <SectionLabel>Monthly P&L</SectionLabel>
                <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.55 }}>
                    ⚠ These figures are model estimates derived from industry benchmarks — not real trading data. Actual revenue, costs and profit will vary. Revenue carries ±20% uncertainty (the input); net profit carries ±25% (the output after fixed costs). Higher revenue uncertainty does not imply lower profit uncertainty — operating leverage compounds both.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
                  <Tile label="Revenue"         value="~$68,000" sub="±20% benchmark est." mono />
                  <Tile label="Operating Costs" value="~$56,000" color={S.red}     sub="rent + labour + COGS" mono />
                  <Tile label="Gross Profit"    value="~$42,200" color={S.blue}    sub="62% gross margin" mono />
                  <Tile label="Net Profit"      value={`~$${M.netProfit.toLocaleString()}`} color={S.emerald} sub="±25% benchmark est. · excl. owner salary" mono />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
                  <Tile label="Monthly Rent"    value="$7,600"    mono />
                  <Tile label="Rent-to-Revenue" value="11.2%"     color={S.emerald} />
                  <Tile label="Setup Budget"    value="$147,200"  mono sub="assumed fit-out" />
                  <Tile label="Payback Period"  value={`${M.paybackMonths} months`} color={S.brand} sub={`$${M.setupBudget.toLocaleString()} ÷ $${M.netProfit.toLocaleString()}/mo · no ramp-up`} />
                </div>
                <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '14px 16px', marginBottom: 8 }}>
                  <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.8 }}>At $7,600/month rent and 150 daily customers at $17.50 average spend over 26 trading days, monthly revenue of ~$68,000 gives a rent-to-revenue ratio of 11.2% — within the healthy threshold for specialty coffee. Payback of 12 months assumes a $147,200 fit-out cost ($147,200 ÷ $12,000/mo net profit). The model assumes COGS of 38% and fixed labour of $20,000/month (2 FT + 2 casual). Net profit does not include owner salary — add $60,000–$90,000/yr depending on operator involvement.</p>
                </div>
                <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.55 }}>⏱ Payback assumes full trading from day 1. Allow 3–4 additional months for ramp-up to full customer volume — bringing realistic payback to 15–16 months.</p>
                </div>
              </Card>
              <Card>
                <SectionLabel>Break-even Analysis</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                  <Tile label="Break-even / Day"   value="107 cust."  mono />
                  <Tile label="Modelled / Day"     value="150 cust."  color={S.emerald} mono />
                  <Tile label="Surplus"            value="+43 cust."  color={S.emerald} mono />
                </div>
                <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: 12, color: '#047857', lineHeight: 1.8 }}>The modelled daily customer count of 150 is 1.4× the break-even threshold of 107 — calculated from fixed costs of $30,160/month ($7,600 rent + $20,000 labour + $2,560 overhead) divided by contribution margin of $10.85/customer ($17.50 × 62% gross margin). At 80% of projected demand (120 customers/day), this location remains above break-even. This provides meaningful downside protection during the ramp-up period.</p>
                </div>
              </Card>
              <Card>
                <SectionLabel>Risk Scenarios</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[
                    { ...M.best,   bg: S.emeraldBg, border: S.emeraldBdr, color: S.emerald },
                    { ...M.base,   bg: S.blueBg,    border: S.blueBdr,    color: S.blue },
                    { ...M.stress, bg: S.amberBg,   border: S.amberBdr,   color: S.amber },
                  ].map(sc => (
                    <div key={sc.label} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 10, padding: '14px 15px' }}>
                      <p style={{ fontSize: 9, fontWeight: 800, color: sc.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{sc.label}</p>
                      <p style={{ fontSize: 10, color: sc.color, opacity: 0.7, marginBottom: 8 }}>{sc.pct}</p>
                      <p style={{ fontSize: 9, color: sc.color, opacity: 0.6, marginBottom: 2 }}>Revenue</p>
                      <p style={{ fontSize: 15, fontWeight: 900, color: sc.color, marginBottom: 6, fontFamily: S.mono }}>{sc.rev}</p>
                      <p style={{ fontSize: 9, color: sc.color, opacity: 0.6, marginBottom: 2 }}>Costs</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: sc.color, opacity: 0.8, marginBottom: 6, fontFamily: S.mono }}>{sc.costs}</p>
                      <p style={{ fontSize: 9, color: sc.color, opacity: 0.6, marginBottom: 2 }}>Net Profit</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: sc.color, fontFamily: S.mono }}>{sc.profit}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <SectionLabel>3-Year Projection</SectionLabel>
                  <span style={{ fontSize: 10, fontWeight: 700, color: S.brand, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 6, padding: '3px 8px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Premium</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {/* Year 1 — visible */}
                  <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10, padding: '14px 15px' }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color: S.emerald, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 }}>Year 1</p>
                    <p style={{ fontSize: 9, color: S.n500, marginBottom: 2 }}>Net Profit</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: S.emerald, fontFamily: S.mono, marginBottom: 6 }}>$144k</p>
                    <p style={{ fontSize: 9, color: S.n500, marginBottom: 2 }}>Revenue</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: S.n700, fontFamily: S.mono }}>$816k</p>
                  </div>
                  {/* Year 2 — blurred */}
                  <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '14px 15px', position: 'relative' as const, overflow: 'hidden' }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color: S.n400, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 }}>Year 2</p>
                    <div style={{ filter: 'blur(5px)', userSelect: 'none' as const, pointerEvents: 'none' as const }}>
                      <p style={{ fontSize: 9, color: S.n500, marginBottom: 2 }}>Net Profit</p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: S.n700, fontFamily: S.mono, marginBottom: 6 }}>$158k</p>
                      <p style={{ fontSize: 9, color: S.n500, marginBottom: 2 }}>Revenue</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.n700, fontFamily: S.mono }}>$897k</p>
                    </div>
                  </div>
                  {/* Year 3 — blurred */}
                  <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '14px 15px', position: 'relative' as const, overflow: 'hidden' }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color: S.n400, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 }}>Year 3</p>
                    <div style={{ filter: 'blur(5px)', userSelect: 'none' as const, pointerEvents: 'none' as const }}>
                      <p style={{ fontSize: 9, color: S.n500, marginBottom: 2 }}>Net Profit</p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: S.n700, fontFamily: S.mono, marginBottom: 6 }}>$175k</p>
                      <p style={{ fontSize: 9, color: S.n500, marginBottom: 2 }}>Revenue</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: S.n700, fontFamily: S.mono }}>$987k</p>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 10, color: S.n400, marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
                  Year 1 annualises the base case (~$68k/mo × 12). Years 2–3 assume ~10% annual revenue growth — the median compound growth rate for established inner-suburban Australian café operators (IBISWorld Cafés in Australia, 2025). Actual growth will vary.
                </p>
                <div style={{ marginTop: 12, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
                  <p style={{ fontSize: 12, color: S.brand, lineHeight: 1.5 }}>Year 2 &amp; 3 growth model — including compounding revenue, reinvestment scenarios and break-even trajectory — unlocks when you run a full report on your actual address.</p>
                  <a href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.brand, color: S.white, borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' as const }}>Run my report →</a>
                </div>
              </Card>
            </>}

            {/* Market tab */}
            {activeTab === 'market' && <>
              <Card>
                <SectionLabel>Market Demand</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                  <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 900, color: S.emerald }}>HIGH</p>
                    <p style={{ fontSize: 9, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demand score</p>
                  </div>
                  <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: S.n800, fontFamily: S.mono }}>+12%</p>
                    <p style={{ fontSize: 9, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Café growth 3yr</p>
                  </div>
                  <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: S.n800, fontFamily: S.mono }}>25–44</p>
                    <p style={{ fontSize: 9, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary cohort</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.85 }}>Leederville's daytime population exceeds its residential count by approximately 40% on weekdays — office workers, students from nearby institutions, and staff from the adjacent hospital precinct create a dense daytime customer pool. Saturday morning foot traffic on Oxford Street is among the strongest of any Perth inner suburb. The 25–44 demographic skew is ideal: this cohort has the disposable income for daily coffee habits and the lowest likelihood of switching to home brewing.</p>
              </Card>
              <Card>
                <SectionLabel>Customer Segments</SectionLabel>
                {[
                  { segment: 'Daily commuters & office workers', share: '45%', insight: 'Weekday AM peak. High frequency, lower avg ticket ($6–8). Drives predictable morning revenue.' },
                  { segment: 'Local residents (25–44)', share: '30%', insight: 'Weekend and AM regulars. Higher avg ticket ($12–18 with food). Most loyal cohort.' },
                  { segment: 'Students & freelancers', share: '15%', insight: 'Long dwell time. Important for off-peak revenue and reputation building.' },
                  { segment: 'Tourists & pass-through', share: '10%', insight: 'Low frequency but adds to peak-period volume. Oxford Street benefits from northbound weekend traffic.' },
                ].map(s => (
                  <div key={s.segment} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${S.n100}`, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: S.brand }}>{s.share}</div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: S.n800, marginBottom: 3 }}>{s.segment}</p>
                      <p style={{ fontSize: 11, color: S.n500, lineHeight: 1.55 }}>{s.insight}</p>
                    </div>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionLabel>Seasonal Patterns</SectionLabel>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.85 }}>Perth's year-round mild climate means café revenue variance is lower than eastern-state operators. Leederville's covered footpath seating reduces the impact of summer heat periods. Expected revenue dip of 8–12% in January (holiday period) and moderate uptick in June–August (shoulder season foot traffic increase). No material seasonal risk at this location.</p>
              </Card>
            </>}

            {/* Competition tab */}
            {activeTab === 'competition' && <>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, background: S.brand, borderRadius: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: S.n700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Competitor Overview</span>
                  </div>
                  <span style={{ fontSize: 9, color: S.n400, fontStyle: 'italic' }}>Google Places · up to 48 hr cache</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                  <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 26, fontWeight: 900, color: S.n900, fontFamily: S.mono }}>4</p>
                    <p style={{ fontSize: 9, color: S.n400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>within 500m</p>
                  </div>
                  <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 900, color: S.amber }}>MEDIUM</p>
                    <p style={{ fontSize: 9, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Competition level</p>
                  </div>
                  <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 900, color: S.emerald }}>GAP</p>
                    <p style={{ fontSize: 9, color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quality ceiling</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.8, marginBottom: 16 }}>Four café operators within 500m is manageable for a specialty concept with clear positioning. Two of the four score below 4.0 on Google Maps — indicating an unmet quality ceiling in the precinct.</p>
              </Card>
              <Card>
                <SectionLabel>Competitor Breakdown</SectionLabel>
                {[
                  { name: 'The Grind Co.', rating: '3.8', reviews: 142, distance: '180m', threat: 'LOW', threatColor: S.emerald, threatBg: S.emeraldBg, note: 'Mid-market, average reviews, no specialty positioning. Price level: $.' },
                  { name: 'Blend & Co.', rating: '3.6', reviews: 87, distance: '240m', threat: 'LOW', threatColor: S.emerald, threatBg: S.emeraldBg, note: 'Low ratings, limited menu. Quality gap confirmed. Price level: $.' },
                  { name: 'Morning Rush', rating: '4.4', reviews: 310, distance: '370m', threat: 'MEDIUM', threatColor: S.amber, threatBg: S.amberBg, note: 'Strong ratings and volume. Direct competition if targeting commuter traffic. Price level: $$.' },
                  { name: 'Oxford Espresso', rating: '4.6', reviews: 520, distance: '420m', threat: 'HIGH', threatColor: S.red, threatBg: S.redBg, note: 'Highest-rated café on the strip. Established customer base. Differentiation required. Price level: $$$.' },
                ].map(c => (
                  <div key={c.name} style={{ display: 'flex', gap: 14, padding: '13px 0', borderBottom: `1px solid ${S.n100}`, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: S.n50, border: `1px solid ${S.n200}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: S.n400 }}>{c.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>{c.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: c.threatColor, background: c.threatBg, borderRadius: 100, padding: '2px 8px' }}>Threat: {c.threat}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: S.amber, fontWeight: 700 }}>★ {c.rating}</span>
                        <span style={{ fontSize: 11, color: S.n400 }}>{c.reviews} reviews</span>
                        <span style={{ fontSize: 11, color: S.n400 }}>{c.distance} away</span>
                      </div>
                      <p style={{ fontSize: 11, color: S.n500, lineHeight: 1.55 }}>{c.note}</p>
                    </div>
                  </div>
                ))}
              </Card>
              <Card>
                <SectionLabel>Opportunity Gaps</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { gap: 'Specialty / third-wave coffee', detail: 'No operator in the 500m radius is positioning on coffee quality. A roaster-sourced specialty menu at $6.50+ flat white has no direct local competitor.' },
                    { gap: 'Afternoon / all-day food', detail: 'Three of the four competitors close by 2pm. An all-day format captures the afternoon work-from-café cohort currently underserved.' },
                    { gap: 'Quality-price signal', detail: 'Two operators are priced at $ with below-4.0 ratings — customers are paying for poor quality. A $$ premium positioning has clear head-room.' },
                  ].map(g => (
                    <div key={g.gap} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 9, padding: '12px 14px' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 4 }}>{g.gap}</p>
                      <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65 }}>{g.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>}

          </div>

          {/* Sidebar */}
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Verdict summary */}
            <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '16px 18px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Verdict</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>84</span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: S.emerald }}>GO</p>
                  <p style={{ fontSize: 11, color: S.n500 }}>out of 100</p>
                </div>
              </div>
              <p style={{ fontSize: 11, color: S.n700, lineHeight: 1.55 }}>Strong location fundamentals. Proceed with lease negotiation — push for a 5-year term with CPI-capped rent reviews and a 12-month break clause.</p>
            </div>

            {/* Key numbers */}
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '16px 18px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Key Numbers</p>
              {[
                { label: 'Monthly Revenue',  value: `~$${M.revenue.toLocaleString()}`,   color: S.n900,   sub: 'benchmark est. ±20%' },
                { label: 'Net Profit / Mo',  value: `~$${M.netProfit.toLocaleString()}`, color: S.emerald, sub: 'benchmark est. ±25% · excl. owner salary' },
                { label: 'Rent-to-Revenue',  value: M.rentRatio,                          color: S.amber,  sub: 'of revenue' },
                { label: 'Break-even / Day', value: `${M.beDaily} cust.`,                color: S.n900,   sub: 'fixed cost threshold' },
                { label: 'Payback Period',   value: `${M.paybackMonths} mo †`,           color: S.n900,   sub: 'excl. ramp-up' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: `1px solid ${S.n100}` }}>
                  <div>
                    <span style={{ fontSize: 12, color: S.n500, display: 'block' }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: S.n400 }}>{item.sub}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: item.color, fontFamily: S.mono }}>{item.value}</span>
                </div>
              ))}
              <p style={{ fontSize: 10, color: S.n400, marginTop: 8, lineHeight: 1.5 }}>† Excl. ramp-up. Allow 3–4 additional months to reach full volume. All figures are model estimates — not financial forecasts. Net profit excludes owner salary.</p>
            </div>

            {/* CTA */}
            <div style={{ background: S.headerBg, borderRadius: 14, padding: '18px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', marginBottom: 8, lineHeight: 1.4 }}>Ready to analyse your address?</p>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 14, lineHeight: 1.6 }}>Your report is generated live from real data. First report free, no credit card.</p>
              <Link href="/onboarding" style={{ display: 'block', textAlign: 'center', background: S.brand, color: '#fff', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Run my free report →
              </Link>
            </div>

            {/* Data sources */}
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Data sources</p>
              {['Google Places (competitors)', 'Geoapify / OSM (density)', 'ABS 2021 Census · SA2', 'Industry benchmarks'].map(src => (
                <p key={src} style={{ fontSize: 11, color: S.n500, padding: '4px 0', borderBottom: `1px solid ${S.n100}` }}>{src}</p>
              ))}
            </div>

          </aside>
        </div>

        {/* Bottom CTA */}
        <div style={{ background: `linear-gradient(135deg, #064E3B, ${S.brand})`, borderRadius: 20, padding: '44px 40px', textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(167,243,208,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Your address. Your numbers.</p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0FDF4', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.2 }}>This is what your report will look like</h2>
          <p style={{ fontSize: 15, color: 'rgba(167,243,208,0.65)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.75 }}>
            Paste any Australian address. Choose your business type. Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection in about 90 seconds.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Run my free analysis →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(167,243,208,0.35)', marginTop: 10 }}>No credit card · first report free · ~90 seconds</p>
        </div>
      </div>
    </div>
  )
}
