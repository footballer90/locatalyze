'use client'

// SampleReportClient.tsx — interactive tabbed sample report
// Split from page.tsx so metadata stays in the Server Component

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { onboardingRef } from '@/lib/funnel-links'

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
//
//   Break-even has two meaningful tiers — showing both is honest.
//   Contribution margin per customer = ticket × grossMarginRate = 17.50 × 0.62 = 10.85
//
//   beDailyFull (full break-even — covers ALL fixed costs, incl. paid staff)
//     = ((rent + staff + overheads) ÷ tradingDays) ÷ contribution
//     = (30,160 ÷ 26) ÷ 10.85 = 1,160 ÷ 10.85 ≈ 107
//
//   beDailySolo (survival floor — owner runs it, zero paid staff)
//     = ((rent + overheads)        ÷ tradingDays) ÷ contribution
//     = (10,160 ÷ 26) ÷ 10.85 =   390.77 ÷ 10.85 ≈ 36
//
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
  beDaily:      107, // full break-even (incl. paid staff) — alias kept for legacy refs
  beDailyFull:  107, // covers rent + $20k/mo labour + $2,560 overhead
  beDailySolo:  36,  // owner-operated floor: rent + overheads only
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

// ─────────────────────────────────────────────────────────────────────────────
// Rent Sensitivity Slider
//
// The audit's #1 feature request: "what rent makes this GO?"
// Every report shows a static rent-to-revenue ratio. This slider lets the user
// drag to any rent value and see the verdict, score, net profit, and payback
// update in real time — no new data, pure calculation, but the feature that
// turns a report into a lease negotiation tool.
//
// Design decisions:
//   - Revenue is held fixed (the market determines customers × ticket × days).
//     Rent is the only operator-controlled variable in a lease negotiation.
//   - Score is re-derived from just the Rent Affordability sub-score; the other
//     four factors are held constant (the market hasn't changed, just the lease
//     ask). This makes the score delta honest and attributable.
//   - The track is painted in GO/CAUTION/NO zones — the user can see exactly
//     which zone they're in without reading numbers.
//   - One dynamic sentence at the bottom names the exact dollar flip point,
//     which is the number the user needs at the lease table.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rent Affordability sub-score from ratio.
 *
 * Calibrated so that 11.2% → 90, which produces the baseline total of 84
 * (90×0.20 + 80×0.25 + 85×0.20 + 80×0.25 + 90×0.10 = 84).
 * All outputs are rounded to the nearest 5 per the stated rounding rule.
 *
 * Verification:
 *   calcRentAffordabilityScore(0.112)
 *   → raw 80 + (0.12-0.112)/0.02*20 = 80+8 = 88 → rounds to 90 ✓
 */
function calcRentAffordabilityScore(ratio: number): number {
  if (ratio <= 0.10) return 100
  if (ratio <= 0.12) return Math.round((80 + (0.12 - ratio) / 0.02 * 20) / 5) * 5
  if (ratio <= 0.15) return Math.round((40 + (0.15 - ratio) / 0.03 * 40) / 5) * 5
  return 30
}

const REVENUE = M.revenue          // 68,000 — the market, not the lease
const COGS    = REVENUE * M.cogsRate  // 25,840
const BASE_FIXED_EX_RENT = 22_560   // staff $20k + overhead $2,560
// netProfit(rent) = REVENUE - (rent + BASE_FIXED_EX_RENT + COGS)
//                = 19,600 - rent
const NET_PROFIT_INTERCEPT = REVENUE - BASE_FIXED_EX_RENT - COGS   // 19,600

const SLIDER_MIN  = 3_000
const SLIDER_MAX  = 15_000
const SLIDER_STEP = 100

// Verdict band dollar boundaries (derived from revenue so they agree with
// the rest of the report; rounded to nearest $100 for a clean label)
const CAUTION_THRESHOLD = Math.round(REVENUE * 0.12 / 100) * 100  // $8,200 (=12%)
const NO_THRESHOLD      = Math.round(REVENUE * 0.15 / 100) * 100  // $10,200 (=15%)

function RentSlider() {
  const [rent, setRent] = useState<number>(M.rent)   // starts at the sample report's $7,600

  const netProfit  = NET_PROFIT_INTERCEPT - rent
  const rentRatio  = rent / REVENUE
  const rentPct    = parseFloat((rentRatio * 100).toFixed(1))
  const payback    = netProfit > 0 ? Math.round(M.setupBudget / netProfit) : null

  const rentScore  = calcRentAffordabilityScore(rentRatio)
  // Other sub-scores are held constant — only the lease term changed
  const totalScore = Math.round(rentScore * 0.20 + 80 * 0.25 + 85 * 0.20 + 80 * 0.25 + 90 * 0.10)

  const verdict     = rentRatio < 0.12 ? 'GO' : rentRatio < 0.15 ? 'CAUTION' : 'NO'
  const vColor      = verdict === 'GO' ? S.emerald : verdict === 'CAUTION' ? S.amber : S.red
  const vBg         = verdict === 'GO' ? S.emeraldBg : verdict === 'CAUTION' ? S.amberBg : S.redBg
  const vBdr        = verdict === 'GO' ? S.emeraldBdr : verdict === 'CAUTION' ? S.amberBdr : S.redBdr
  const vDarkText   = verdict === 'GO' ? '#065F46' : verdict === 'CAUTION' ? '#92400E' : '#991B1B'

  // Track zone percentages
  const pct = (v: number) => ((v - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN) * 100).toFixed(2)
  const cautionPct = pct(CAUTION_THRESHOLD)
  const noPct      = pct(NO_THRESHOLD)

  // Flip-point insight sentence (the lease negotiation number)
  let insight: React.ReactNode
  if (verdict === 'GO') {
    const flipAt = CAUTION_THRESHOLD
    insight = <>At <strong style={{ fontFamily: S.mono }}>${rent.toLocaleString()}/mo</strong>, this location scores <strong style={{ color: S.emerald }}>GO</strong>. The rent can rise to <strong style={{ fontFamily: S.mono, color: S.amber }}>${flipAt.toLocaleString()}/mo</strong> before it flips to CAUTION. That&apos;s your maximum concession in negotiation.</>
  } else if (verdict === 'CAUTION') {
    const flipDown = CAUTION_THRESHOLD
    const flipUp   = NO_THRESHOLD
    insight = <>At <strong style={{ fontFamily: S.mono }}>${rent.toLocaleString()}/mo</strong>, this is <strong style={{ color: S.amber }}>CAUTION</strong>. Negotiate below <strong style={{ fontFamily: S.mono, color: S.emerald }}>${flipDown.toLocaleString()}/mo</strong> to get back to GO — or accept CAUTION and insist on a 12-month break clause. If rent rises above <strong style={{ fontFamily: S.mono, color: S.red }}>${flipUp.toLocaleString()}/mo</strong>, this becomes NO.</>
  } else {
    const revenueNeeded = Math.round(rent / 0.15)
    const pctAbove = Math.round((revenueNeeded / REVENUE - 1) * 100)
    insight = <>At <strong style={{ fontFamily: S.mono }}>${rent.toLocaleString()}/mo</strong>, this location scores <strong style={{ color: S.red }}>NO</strong>. You would need monthly revenue above <strong style={{ fontFamily: S.mono, color: S.red }}>${revenueNeeded.toLocaleString()}</strong> to justify this rent — {pctAbove}% above the benchmarked model. Walk away unless you have strong evidence your revenue will beat the benchmark.</>
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4, flexWrap: 'wrap' as const }}>
        <div>
          <SectionLabel>Rent Sensitivity</SectionLabel>
          <p style={{ fontSize: 12, color: S.n500, marginBottom: 0, marginTop: -8, lineHeight: 1.6 }}>
            Drag to see how rent changes the verdict, profit, and payback. These numbers go on the lease table.
          </p>
        </div>
      </div>

      {/* Rent + verdict summary row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Monthly Rent</p>
          <p style={{ fontSize: 36, fontWeight: 900, color: vColor, fontFamily: S.mono, lineHeight: 1, letterSpacing: '-0.04em', transition: 'color 180ms' }}>
            ${rent.toLocaleString()}
          </p>
          <p style={{ fontSize: 11, color: S.n400, marginTop: 3 }}>/ month</p>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'right' as const }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: vBg, border: `1.5px solid ${vBdr}`, borderRadius: 8, padding: '8px 16px',
            transition: 'background 180ms, border-color 180ms',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: vColor, transition: 'background 180ms' }} />
            <span style={{ fontSize: 16, fontWeight: 900, color: vColor, letterSpacing: '0.06em', transition: 'color 180ms' }}>{verdict}</span>
            <span style={{ width: 1, height: 14, background: vBdr }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: vColor, fontFamily: S.mono, transition: 'color 180ms' }}>{totalScore}</span>
          </div>
          <p style={{ fontSize: 11, color: S.n500, marginTop: 6, fontFamily: S.mono }}>{rentPct}% of revenue</p>
        </div>
      </div>

      {/* Slider track + thumb */}
      <div style={{ position: 'relative', marginBottom: 6 }} data-verdict={verdict}>
        {/* Coloured zone track (behind the input) */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 8,
          borderRadius: 4, transform: 'translateY(-50%)',
          background: `linear-gradient(to right,
            ${S.emerald} 0%, ${S.emerald} ${cautionPct}%,
            ${S.amber}   ${cautionPct}%, ${S.amber} ${noPct}%,
            ${S.red}     ${noPct}%, ${S.red} 100%
          )`,
          opacity: 0.3,
        }} />
        <input
          type="range"
          className="rent-slider"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={SLIDER_STEP}
          value={rent}
          onChange={e => setRent(Number(e.target.value))}
          aria-label="Monthly rent"
          aria-valuetext={`$${rent.toLocaleString()} per month — verdict ${verdict}`}
          style={{ '--slider-color': vColor } as React.CSSProperties}
        />
      </div>

      {/* Zone labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 10, color: S.n400, fontFamily: S.mono }}>${(SLIDER_MIN / 1000).toFixed(0)}k</span>
        <span style={{ fontSize: 10, color: S.emerald, fontWeight: 700, opacity: 0.8 }}>GO  &lt;12%</span>
        <span style={{ fontSize: 10, color: S.amber, fontWeight: 700, opacity: 0.8 }}>CAUTION 12–15%</span>
        <span style={{ fontSize: 10, color: S.red, fontWeight: 700, opacity: 0.8 }}>NO  ≥15%</span>
        <span style={{ fontSize: 10, color: S.n400, fontFamily: S.mono }}>${(SLIDER_MAX / 1000).toFixed(0)}k</span>
      </div>

      {/* Three live metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 14px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Net Profit / Mo</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: netProfit > 0 ? S.emerald : S.red, fontFamily: S.mono, lineHeight: 1, transition: 'color 180ms' }}>
            {netProfit >= 0 ? `~$${netProfit.toLocaleString()}` : `–$${Math.abs(netProfit).toLocaleString()}`}
          </p>
          <p style={{ fontSize: 10, color: S.n400, marginTop: 3 }}>excl. owner salary</p>
        </div>
        <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 14px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Rent-to-Revenue</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: vColor, fontFamily: S.mono, lineHeight: 1, transition: 'color 180ms' }}>{rentPct}%</p>
          <p style={{ fontSize: 10, color: S.n400, marginTop: 3 }}>GO threshold: &lt;12%</p>
        </div>
        <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 14px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Payback Period</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: payback && payback > 0 ? S.n800 : S.red, fontFamily: S.mono, lineHeight: 1 }}>
            {payback && payback > 0 ? `${payback} mo` : 'Never'}
          </p>
          <p style={{ fontSize: 10, color: S.n400, marginTop: 3 }}>excl. ramp-up</p>
        </div>
      </div>

      {/* Flip-point insight — the lease negotiation number */}
      <div style={{
        background: vBg, border: `1px solid ${vBdr}`, borderRadius: 10, padding: '12px 15px',
        transition: 'background 180ms, border-color 180ms',
      }}>
        <p style={{ fontSize: 12, color: vDarkText, lineHeight: 1.65 }}>{insight}</p>
      </div>
    </Card>
  )
}

export default function SampleReportClient() {
  const [activeTab, setActiveTab] = useState('overview')
  // Sticky decision strip — persists the verdict + one-line action across
  // the whole report, so the decision is always the loudest thing on screen.
  const heroRef = useRef<HTMLDivElement>(null)
  const [stickyOn, setStickyOn] = useState(false)
  // Full SWOT lives in a deep-dive layer by default. The surface shows a
  // 2-bullet "Decision Notes" — one kill risk + one reason to pursue.
  // Twelve SWOT bullets don't make a decision; two do.
  const [swotOpen, setSwotOpen] = useState(false)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setStickyOn(!entry.isIntersecting),
      // Fire as soon as the hero's bottom passes below the 64px nav.
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Rent Sensitivity slider ────────────────────────────────────────
           Native range inputs are notoriously hard to style cross-browser.
           We use appearance:none to strip the default track/thumb, then
           paint our own. The track background (the colored GO/CAUTION/NO
           zones) is rendered as a separate div below the input in DOM order,
           so it isn't affected by browser ::-webkit-slider-runnable-track
           quirks. The thumb is a white circle with a border in the current
           verdict color (passed via --slider-color CSS variable). */
        .rent-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
          background: transparent;
          position: relative;
          z-index: 1;
        }
        .rent-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--slider-color, #10B981);
          cursor: grab;
          box-shadow: 0 1px 6px rgba(0,0,0,0.18), 0 0 0 3px color-mix(in srgb, var(--slider-color, #10B981) 15%, transparent);
          transition: border-color 180ms, box-shadow 180ms;
        }
        .rent-slider:active::-webkit-slider-thumb { cursor: grabbing; }
        .rent-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--slider-color, #10B981);
          cursor: grab;
          box-shadow: 0 1px 6px rgba(0,0,0,0.18);
          transition: border-color 180ms;
        }
        .rent-slider::-webkit-slider-runnable-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }
        .rent-slider::-moz-range-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }
      `}</style>

      {/* Persistent decision strip — only visible after the hero scrolls out.
          Single source of truth for the GO/CAUTION/NO call + the one action
          the user needs to take. Keeps the verdict the loudest thing on screen.
          Sits just below the 64px marketing Navbar (z-index 60). */}
      <div
        aria-hidden={!stickyOn}
        style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 50,
          background: '#0B1512',
          borderBottom: '1px solid rgba(167,243,208,0.15)',
          boxShadow: stickyOn ? '0 6px 24px rgba(0,0,0,0.25)' : 'none',
          transform: stickyOn ? 'translateY(0)' : 'translateY(-110%)',
          opacity: stickyOn ? 1 : 0,
          transition: 'transform 240ms cubic-bezier(.2,.7,.2,1), opacity 200ms',
          pointerEvents: stickyOn ? 'auto' : 'none',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as const }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(5,150,105,0.18)', border: '1.5px solid rgba(5,150,105,0.5)', borderRadius: 6, padding: '4px 10px', flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: S.emerald, boxShadow: `0 0 8px ${S.emerald}` }} />
            <span style={{ fontSize: 12, fontWeight: 900, color: S.emerald, letterSpacing: '0.06em' }}>GO</span>
            <span style={{ width: 1, height: 11, background: 'rgba(5,150,105,0.3)' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: S.emerald, fontFamily: S.mono }}>84</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#E5E7EB', lineHeight: 1.35, flex: 1, minWidth: 240 }}>
            Rent is <strong style={{ color: '#FCD34D', fontWeight: 800, fontFamily: S.mono }}>11.2%</strong> — 1 point from the danger zone. Book a site visit and negotiate rent down before signing, or this becomes <strong style={{ color: '#FCD34D', fontWeight: 800, letterSpacing: '0.04em' }}>CAUTION</strong>.
          </p>
          <Link href={onboardingRef('sample_report_sticky')} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#34D399', color: '#064E3B', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            Run my address →
          </Link>
        </div>
      </div>

      {/* Sample banner */}
      <div style={{ background: S.amber, padding: '10px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
          SAMPLE REPORT — address is fictional. Numbers are modelled from real benchmarks for a 214 Oxford St-equivalent location. Your live report uses your actual address.{' '}
          <Link href={onboardingRef('sample_report_banner')} style={{ color: '#fff', textDecoration: 'underline', fontWeight: 800 }}>
            Run yours free →
          </Link>
        </p>
      </div>

      {/* Dark header */}
      <div style={{ background: S.headerBg, borderBottom: '1px solid #1F2937' }}>

        <div style={{ padding: '12px 24px', borderBottom: '1px solid #1F2937', maxWidth: 1200, margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af' }}>
            <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ opacity: 0.35, margin: '0 8px' }}>/</span>
            <span style={{ color: '#e5e7eb' }}>Sample report</span>
          </nav>
        </div>

        {/* Verdict hero */}
        <div ref={heroRef} style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Sample report</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: S.mono }}>214 Oxford Street, Leederville WA 6007</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Competitor data · Google Maps · ABS 2021 Census</span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.2 }}>
                Specialty Café
              </h1>
              {/* Verdict badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(5,150,105,0.15)', border: '1.5px solid rgba(5,150,105,0.4)', borderRadius: 8, padding: '8px 16px', marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.emerald, boxShadow: `0 0 8px ${S.emerald}` }} />
                <span style={{ fontSize: 14, fontWeight: 900, color: S.emerald, letterSpacing: '0.06em' }}>GO</span>
                <span style={{ width: 1, height: 14, background: 'rgba(5,150,105,0.3)' }} />
                <span style={{ fontSize: 11, color: 'rgba(5,150,105,0.7)', fontWeight: 600 }}>LOW RISK</span>
              </div>

              {/* THE DECISION — one synthesised sentence the user cannot miss.
                  Verdict + binding constraint + action + flip-trigger.
                  Everything else in the report is evidence for this line. */}
              <p style={{
                fontSize: 20, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.015em',
                color: '#F8FAFC', maxWidth: 640, marginBottom: 14,
              }}>
                This location scores <span style={{ color: S.emerald, fontWeight: 900 }}>GO</span>.
                Rent is <span style={{ color: '#FCD34D', fontWeight: 900, fontFamily: S.mono }}>11.2%</span> — 1 point from the danger zone.
                Book a site visit and negotiate rent down before signing, or this becomes <span style={{ color: '#FCD34D', fontWeight: 900, letterSpacing: '0.03em' }}>CAUTION</span>.
              </p>

              {/* Supporting context — one specific, concrete observation
                  rather than a "high / moderate / good" sweep. Every variable
                  listed has a number or a comparator attached. */}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: 560 }}>
                Leederville's quality ceiling is soft — two of the four competing cafés score below 4.0 on Google. A serious specialty concept clears that on day one. The binding constraint is the lease, not the market.
              </p>
            </div>
            {/* Score ring — intentionally the single dominant visual element:
                scanners read "84" first, then the decision sentence, then
                badge + context. One hierarchy, not four competing signals. */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 124, height: 124 }}>
                <svg width="124" height="124" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="62" cy="62" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle cx="62" cy="62" r="52" fill="none" stroke={S.emerald} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - 84 / 100)}`}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: S.emerald, lineHeight: 1, fontFamily: S.mono, letterSpacing: '-0.03em' }}>84</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>/100</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location Score</p>
            </div>
          </div>

          {/* Key metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#1F2937', borderRadius: 10, overflow: 'hidden', border: '1px solid #1F2937' }}>
            {[
              { l: 'Monthly Revenue',  v: `~$${M.revenue.toLocaleString()}`,    s: '±20% band' },
              { l: 'Net Profit / Mo',  v: `~$${M.netProfit.toLocaleString()}`,  s: '±25% · excl. owner salary' },
              { l: 'Break-even Daily', v: `${M.beDailyFull} cust.`,             s: `full break-even incl. $20k staff · ~${M.beDailySolo}/day if owner-operated` },
              { l: 'Payback Period',   v: `${M.paybackMonths} months`,          s: 'excl. ramp-up' },
            ].map(m => (
              <div key={m.l} style={{ padding: '14px 16px', background: '#161D27' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{m.l}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: S.mono }}>{m.v}</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{m.s}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginTop: 10, paddingLeft: 4, lineHeight: 1.6 }}>
            Model inputs: your address, business type, rent, AOV and operating hours. Ranges on revenue (±20%) and profit (±25%) reflect modelled uncertainty — they are a decision aid for a lease evaluation, not financial advice. Sources &amp; math: <Link href="/methodology" style={{ color: 'inherit', textDecoration: 'underline' }}>methodology</Link>.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px' }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── Analyst's read ─────────────────────────────────────────
                The single dominant element below the hero. Everything else
                in this column is evidence for the position stated here.
                Written with a concrete point of view — the one lever that
                moves the verdict, and the specific deal structure that
                lets this location work. Persists across all tabs. */}
            <div style={{
              background: '#0B1512',
              borderRadius: 12,
              padding: '20px 22px',
              marginBottom: 14,
              border: `1px solid ${S.emeraldBdr}`,
              boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Left accent — ties this block to the emerald verdict */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: S.emerald }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 900, color: S.emerald,
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                }}>Analyst's read</span>
                <span style={{ width: 1, height: 10, background: 'rgba(167,243,208,0.2)' }} />
                <span style={{ fontSize: 10, color: 'rgba(167,243,208,0.55)', fontWeight: 600 }}>
                  One position. One lever. What I&apos;d actually do.
                </span>
              </div>
              <p style={{
                fontSize: 15, fontWeight: 500, lineHeight: 1.65, color: '#E5E7EB',
                maxWidth: 720, margin: 0,
              }}>
                The numbers support the concept — rent at{' '}
                <strong style={{ color: '#F8FAFC', fontWeight: 800, fontFamily: S.mono }}>11.2%</strong>,{' '}
                <strong style={{ color: '#F8FAFC', fontWeight: 800, fontFamily: S.mono }}>$96k</strong> median income, four competitors in a precinct where two are rated below 4.0. The deal hinges on one clause: the lease. You&apos;re{' '}
                <strong style={{ color: '#FCD34D', fontWeight: 800 }}>1 point from CAUTION</strong> today, and a standard CPI review in year 2 tips you over.{' '}
                <strong style={{ color: '#F8FAFC', fontWeight: 800 }}>Negotiate a 5-year term with CPI-capped reviews and a 12-month break clause.</strong>{' '}
                Get those and this is a straight GO. Walk away without them — the market doesn&apos;t carry a bad lease here.
              </p>
            </div>

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
                    {/* Rent ratio panel — colour agrees with the verdict.
                        11.2% sits under the 12% healthy threshold, so the
                        whole panel reads as PASS. The single point of margin
                        to the danger zone is surfaced as a watch-out in the
                        hero decision line, not as a competing warning here. */}
                    <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 800, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Rent-to-Revenue Ratio</p>
                          <p style={{ fontSize: 11, color: S.emerald, opacity: 0.85 }}>Benchmark: under 12% healthy · 11.2% passes with 1pt to spare</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 32, fontWeight: 900, color: S.emerald, letterSpacing: '-0.04em', lineHeight: 1, fontFamily: S.mono }}>11.2%</div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fff', border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '3px 10px', marginTop: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.emerald }} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: S.emerald, letterSpacing: '0.06em' }}>EXCELLENT</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: 7, background: 'rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '93%', background: S.emerald, borderRadius: 4, opacity: 0.75 }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      <Tile label="Monthly Rent" value="$7,600" mono />
                      <Tile label="Rating" value="Excellent" color={S.emerald} />
                    </div>

                    {/* ── Rent Breakpoints ────────────────────────────
                        Answers the $200k-decision-maker's actual
                        question: "how much can the rent rise before
                        this stops being GO?" Computed from the model
                        (revenue × verdict-band %), so the exact numbers
                        on the negotiation table are visible here, not
                        buried in a ratio.

                        Band thresholds:
                          <12%  GO
                          13%   flips to CAUTION
                          15%   flips to NO  (matches the 15% danger
                                threshold referenced elsewhere) */}
                    {(() => {
                      const cautionRent = Math.round(M.revenue * 0.13 / 10) * 10
                      const noRent      = Math.round(M.revenue * 0.15 / 10) * 10
                      const dCaution    = cautionRent - M.rent
                      const dNo         = noRent      - M.rent
                      const pctCaution  = Math.round(dCaution / M.rent * 100)
                      const pctNo       = Math.round(dNo      / M.rent * 100)
                      const row = (dotColor: string, labelColor: string, verdict: string, rent: string, detail: string) => (
                        <div key={verdict} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: `1px solid ${S.n100}` }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 900, color: labelColor, letterSpacing: '0.08em', width: 62, flexShrink: 0 }}>{verdict}</span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: S.n900, fontFamily: S.mono, minWidth: 68 }}>{rent}</span>
                          <span style={{ fontSize: 11, color: S.n500, fontFamily: S.mono }}>{detail}</span>
                        </div>
                      )
                      return (
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 800, color: S.n500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Rent Breakpoints</p>
                          <p style={{ fontSize: 11, color: S.n400, marginBottom: 4 }}>What it takes to flip the verdict — take this into lease negotiation.</p>
                          {row(S.emerald, '#065F46', 'GO',      `$${M.rent.toLocaleString()}/mo`,       'today · 11.2% of revenue')}
                          {row(S.amber,   '#92400E', 'CAUTION', `$${cautionRent.toLocaleString()}/mo`, `+$${dCaution.toLocaleString()} (+${pctCaution}%) · 13% ratio`)}
                          {row(S.red,     '#991B1B', 'NO',      `$${noRent.toLocaleString()}/mo`,      `+$${dNo.toLocaleString()} (+${pctNo}%) · 15% ratio`)}
                        </div>
                      )
                    })()}
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
                      <ScoreBar label="Location Quality"    score={90} weight="10%" />
                      <p style={{ fontSize: 10, color: S.n400, marginTop: 10, lineHeight: 1.6 }}>
                        <strong style={{ fontWeight: 700, color: S.n500 }}>How each score is derived:</strong> Rent Affordability (90) — rent/revenue ratio of 11.2% vs 15% danger threshold. Competition (80) — 4 verified competitors within 500m, moderate saturation. Market Demand (85) — median household income and growth trend. Profitability (80) — net margin of 17.6% and 1.4× break-even cushion. Location Quality (90) — high footfall and excellent transit access. Each sub-score is rounded to the nearest 5. Weighted total: 90×0.20 + 80×0.25 + 85×0.20 + 80×0.25 + 90×0.10 = <strong style={{ fontWeight: 700, color: S.n500 }}>84</strong>.
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
                        <p style={{ fontSize: 9, color: S.n400, marginTop: 2 }}>ABS 2021 data (Census)</p>
                      </div>
                      <div style={{ background: S.n50, borderRadius: 9, padding: '10px 12px', border: `1px solid ${S.n200}` }}>
                        <p style={{ fontSize: 9, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Affordability</p>
                        <p style={{ fontSize: 12, fontWeight: 800, color: S.emerald }}>HIGH</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.75 }}>Leederville's median household income of $96,000 (ABS 2021 Census, SA2) is 21% above the Perth metro average. The 25–44 age cohort represents 48% of the residential population.</p>
                  </Card>
                </div>

                {/* ── Decision Notes ──────────────────────────────────
                    Twelve SWOT bullets don't make a decision; two do.
                    Surface the one reason to pursue and the one thing that
                    could kill the deal. Full 4-quadrant SWOT is kept for
                    analysts who want it, but moved behind an expand toggle
                    so it doesn't compete with the decision for attention. */}
                <Card>
                  <SectionLabel>Decision Notes</SectionLabel>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10, padding: '13px 15px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span aria-hidden style={{ fontSize: 16, lineHeight: 1, color: S.emerald, marginTop: 1 }}>↑</span>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Reason to pursue</p>
                        <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6, fontWeight: 500 }}>Two of the four competing cafés score below 4.0 on Google. There&apos;s an unmet quality ceiling in the precinct — a serious specialty concept clears it on day one.</p>
                      </div>
                    </div>
                    <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '13px 15px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span aria-hidden style={{ fontSize: 16, lineHeight: 1, color: S.red, marginTop: 1 }}>↓</span>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Kill risk</p>
                        <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6, fontWeight: 500 }}>The rent review clause. At 11.2% you&apos;re 1 point from CAUTION — any CPI uplift in year 2 pushes you into negative-margin territory. Get a CPI cap or walk.</p>
                      </div>
                    </div>
                  </div>

                  {/* Expand to full SWOT — kept available for analysts
                      who want the full 4-quadrant breakdown, but demoted
                      behind a toggle so the 2-bullet decision is the lede. */}
                  <button
                    type="button"
                    onClick={() => setSwotOpen(o => !o)}
                    aria-expanded={swotOpen}
                    style={{
                      marginTop: 12, fontSize: 11, color: S.n500, fontWeight: 700,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      fontFamily: S.font, letterSpacing: '0.02em',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}>
                    <span style={{ display: 'inline-block', transform: swotOpen ? 'rotate(90deg)' : 'none', transition: 'transform 180ms' }}>▸</span>
                    {swotOpen ? 'Hide full SWOT' : 'Show full SWOT (4 quadrants · 8 data points)'}
                  </button>
                  {swotOpen && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                      {[
                        { key: 'Strengths', items: ['Oxford Street foot traffic among Perth\'s highest on weekday mornings', 'Rent-to-revenue at 11.2% — within the 12% healthy threshold'], bg: S.emeraldBg, border: S.emeraldBdr, color: '#065F46', dot: S.emerald },
                        { key: 'Weaknesses', items: ['4 existing café competitors — clear positioning required', 'Weekend foot traffic noticeably lower than weekday commuter flow'], bg: S.amberBg, border: S.amberBdr, color: '#92400E', dot: S.amber },
                        { key: 'Opportunities', items: ['Two of four existing operators have no online ordering — Leederville Station commuter pre-order flow (7:15–8:45am) is structurally unserved', 'Bar/restaurant cluster at the north end of Oxford Street drives post-work foot traffic; a specialty concept with extended evening hours captures dinner-adjacent coffee trade uncontested'], bg: S.blueBg, border: S.blueBdr, color: '#1E3A8A', dot: S.blue },
                        { key: 'Threats', items: ['Rent review clause could push costs above the 12% threshold at renewal — the 13% line sits at ~$8,840/mo ($1,240 above today)', 'Saturday morning coffee trade on Oxford Street runs ~30% below weekday commuter peaks — Leederville\'s weekend gravity is evening-based, not daytime'], bg: S.redBg, border: S.redBdr, color: '#991B1B', dot: S.red },
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
                  )}
                </Card>
              </>
            )}

            {/* Financials tab */}
            {activeTab === 'financials' && <>
              {/* Rent Sensitivity slider — intentionally the FIRST thing in this
                  tab. The user arrived here with a lease decision to make; the
                  slider gives them the exact negotiation number immediately.
                  The P&L, break-even, and scenarios below are the evidence for
                  whatever rent they land on. */}
              <RentSlider />
              <Card>
                <SectionLabel>Monthly P&L</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
                  <Tile label="Revenue"         value="~$68,000" sub="industry benchmark" mono />
                  <Tile label="Operating Costs" value="~$56,000" color={S.red}     sub="rent + labour + COGS" mono />
                  <Tile label="Gross Profit"    value="~$42,200" color={S.blue}    sub="62% gross margin" mono />
                  <Tile label="Net Profit"      value={`~$${M.netProfit.toLocaleString()}`} color={S.emerald} sub="excl. owner salary" mono />
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
                {/* Two tiers of break-even — "full" includes paid staff,
                    "survival floor" assumes owner runs it alone. Owners
                    shopping a lease need both numbers: the realistic target
                    AND the worst-case downturn floor. */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                  <Tile label="Survival floor"       value={`~${M.beDailySolo} cust.`}  sub="rent + overheads · owner-run" mono />
                  <Tile label="Full break-even"      value={`${M.beDailyFull} cust.`}   sub="incl. $20k/mo paid staff" mono />
                  <Tile label="Modelled / Day"       value={`${M.customers} cust.`}    sub={`${((M.customers / M.beDailyFull)).toFixed(1)}× full BE`} color={S.emerald} mono />
                </div>
                <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: 12, color: '#047857', lineHeight: 1.8 }}>
                    Contribution per customer is $10.85 ($17.50 × 62% gross margin).
                    <strong style={{ fontWeight: 700 }}> Full break-even is 107 cust/day</strong> —
                    covers $30,160/mo in fixed costs ($7,600 rent + $20,000 labour + $2,560 overhead).
                    <strong style={{ fontWeight: 700 }}> Survival floor is ~36 cust/day</strong> —
                    if you operate it yourself (no paid staff), you only need to cover $10,160/mo in rent + overheads.
                    The modelled 150/day gives a 1.4× cushion on the full break-even and a 4.2× cushion on the survival floor — meaningful downside protection through ramp-up and any demand shock.
                  </p>
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
                  Year 1 annualises the base case (~$68k/mo × 12). Years 2–3 assume a 10% annual revenue growth rate using industry benchmarks. Actual growth will vary.
                </p>
                <div style={{ marginTop: 12, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
                  <p style={{ fontSize: 12, color: S.brand, lineHeight: 1.5 }}>Year 2 &amp; 3 growth model — including compounding revenue, reinvestment scenarios and break-even trajectory — unlocks when you run a full report on your actual address.</p>
                  <a href={onboardingRef('sample_report_inline')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.brand, color: S.white, borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' as const }}>Run my report →</a>
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
                  <span style={{ fontSize: 9, color: S.n400, fontStyle: 'italic' }}>Google Places · competitor data cached up to 48 hours</span>
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
                        <span style={{ fontSize: 11, color: S.amber, fontWeight: 700 }}> {c.rating}</span>
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
              <p style={{ fontSize: 9, color: S.n400, marginBottom: 8 }}>Scoring v2.1 · 5 factors</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>84</span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: S.emerald }}>GO</p>
                  <p style={{ fontSize: 11, color: S.n500 }}>out of 100</p>
                </div>
              </div>
              <p style={{ fontSize: 11, color: S.n700, lineHeight: 1.55 }}>Strong location fundamentals. Proceed with lease negotiation — push for a 5-year term with CPI-capped rent reviews and a 12-month break clause.</p>
            </div>

            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '14px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Data Quality</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: S.n500 }}>Data Completeness</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.n800 }}>78%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: S.n500 }}>Model Confidence</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.n800 }}>Medium</span>
              </div>
            </div>

            {/* Key numbers */}
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '16px 18px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Key Numbers</p>
              {[
                { label: 'Monthly Revenue',  value: `~$${M.revenue.toLocaleString()}`,   color: S.n900,   sub: 'monthly, modelled' },
                { label: 'Net Profit / Mo',  value: `~$${M.netProfit.toLocaleString()}`, color: S.emerald, sub: 'excl. owner salary' },
                { label: 'Rent-to-Revenue',  value: M.rentRatio,                          color: S.amber,  sub: 'of revenue' },
                { label: 'Break-even / Day', value: `${M.beDailyFull} cust.`,            color: S.n900,   sub: `with paid staff · ~${M.beDailySolo} if owner-run` },
                { label: 'Payback Period',   value: `${M.paybackMonths} mo`,             color: S.n900,   sub: 'excl. ramp-up' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: `1px solid ${S.n100}` }}>
                  <div>
                    <span style={{ fontSize: 12, color: S.n500, display: 'block' }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: S.n400 }}>{item.sub}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: item.color, fontFamily: S.mono }}>{item.value}</span>
                </div>
              ))}
              <p style={{ fontSize: 10, color: S.n400, marginTop: 8, lineHeight: 1.5 }}>Confidence bands and assumptions are in the <Link href="/methodology" style={{ color: 'inherit', textDecoration: 'underline' }}>methodology</Link>. Payback allows 3–4 months to reach full volume.</p>
            </div>

            {/* CTA */}
            <div style={{ background: S.headerBg, borderRadius: 14, padding: '18px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', marginBottom: 8, lineHeight: 1.4 }}>Ready to analyse your address?</p>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 14, lineHeight: 1.6 }}>Your report is generated live from real data. First report free, no credit card.</p>
              <Link href={onboardingRef('sample_report_sidebar')} style={{ display: 'block', textAlign: 'center', background: S.brand, color: '#fff', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
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
          <Link href={onboardingRef('sample_report_footer')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34D399', color: '#064E3B', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Run my free analysis →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(167,243,208,0.35)', marginTop: 10 }}>No credit card · first report free · ~90 seconds</p>
        </div>
      </div>
    </div>
  )
}
