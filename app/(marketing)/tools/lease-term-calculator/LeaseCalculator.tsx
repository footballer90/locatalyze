'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  font:      "'DM Sans', 'Geist', Inter, -apple-system, sans-serif",
  n900:      '#0F172A',
  n800:      '#1E293B',
  n700:      '#334155',
  n500:      '#64748B',
  n400:      '#94A3B8',
  n200:      '#E2E8F0',
  n100:      '#F1F5F9',
  n50:       '#F8FAFC',
  white:     '#FFFFFF',
  emerald:   '#059669',
  emeraldBg: '#F0FDF4',
  emeraldBdr:'#A7F3D0',
  emeraldDk: '#065F46',
  amber:     '#D97706',
  amberBg:   '#FFFBEB',
  amberBdr:  '#FDE68A',
  amberDk:   '#92400E',
  red:       '#DC2626',
  redBg:     '#FEF2F2',
  redBdr:    '#FECACA',
  blue:      '#2563EB',
  blueBg:    '#EFF6FF',
  blueBdr:   '#BFDBFE',
  dark:      '#0B1512',
  mono:      "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
}

function fmt(n: number, decimals = 0): string {
  return '$' + n.toLocaleString('en-AU', { maximumFractionDigits: decimals })
}

// ── Derived model ─────────────────────────────────────────────────────────────
//
// Given: monthly rent, monthly net profit (after all costs incl. rent & owner
// salary), fit-out cost, and a lease term in years, compute:
//
//   committed_rent       = rent × 12 × years
//   total_capital        = fit_out + committed_rent (rough exposure ceiling)
//   cumulative_profit[m] = net_profit × m   (simplified linear ramp)
//   payback_months       = fit_out / net_profit  (months to recover fit-out)
//   break_even_months    = (fit_out + committed_rent) / net_profit
//                          (months to recover ALL committed capital)
//
// Loss scenario (if business closes at month M):
//   sunk_fitout       = fit_out  (not recoverable)
//   remaining_lease   = rent × (term_months − M)  (landlord claim without subletting)
//   total_loss        = sunk_fitout + remaining_lease − profit_earned_so_far
//
// Note: this intentionally ignores subletting value (unknowable), goodwill on
// sale (speculative), and tax treatment — to keep the output conservative and
// simple. Operators should verify with their accountant before signing.

interface Scenario {
  years:             number
  months:            number
  label:             string
  committed:         number        // total rent obligation
  totalCapital:      number        // fit-out + committed rent
  paybackMonths:     number        // months to recover fit-out only
  breakevenMonths:   number        // months to recover all committed capital
  lossIfCloseYr1:    number        // net loss if close at end of month 12
  lossIfCloseYr2:    number        // net loss if close at end of month 24
  lossIfCloseYr3:    number        // net loss if close at end of month 36
  profitByEnd:       number        // cumulative net profit by end of term
  roi:               number        // profitByEnd / totalCapital (%)
  verdict:           'strong' | 'reasonable' | 'exposed'
}

function buildScenario(
  years: number,
  rent: number,
  profit: number,
  fitout: number,
): Scenario {
  const months       = years * 12
  const committed    = rent * months
  const totalCapital = fitout + committed
  const payback      = profit > 0 ? fitout / profit : Infinity
  const breakeven    = profit > 0 ? totalCapital / profit : Infinity

  function lossAtMonth(m: number): number {
    const remaining  = rent * Math.max(0, months - m)
    const profitEarned = profit * m
    return fitout + remaining - profitEarned
  }

  const profitByEnd = profit * months
  const roi         = totalCapital > 0 ? (profitByEnd / totalCapital) * 100 : 0

  // Verdict: based on how well the business can handle early closure
  const lossYr1 = lossAtMonth(12)
  let verdict: Scenario['verdict']
  if (lossYr1 < fitout * 0.5 && breakeven < months * 0.6) {
    verdict = 'strong'
  } else if (lossYr1 < fitout * 1.5) {
    verdict = 'reasonable'
  } else {
    verdict = 'exposed'
  }

  return {
    years, months, label: `${years}-year`,
    committed, totalCapital, paybackMonths: payback, breakevenMonths: breakeven,
    lossIfCloseYr1: lossAtMonth(12),
    lossIfCloseYr2: lossAtMonth(24),
    lossIfCloseYr3: lossAtMonth(36),
    profitByEnd, roi, verdict,
  }
}

const VERDICT_META = {
  strong:     { color: T.emerald, bg: T.emeraldBg, bdr: T.emeraldBdr, dk: T.emeraldDk, label: 'Strong' },
  reasonable: { color: T.amber,   bg: T.amberBg,   bdr: T.amberBdr,   dk: T.amberDk,   label: 'Reasonable' },
  exposed:    { color: T.red,     bg: T.redBg,      bdr: T.redBdr,     dk: '#991B1B',   label: 'High exposure' },
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeaseCalculator() {
  const [rentStr,   setRentStr]   = useState('7600')
  const [profitStr, setProfitStr] = useState('12000')
  const [fitoutStr, setFitoutStr] = useState('150000')
  const [focusedTerm, setFocusedTerm] = useState<number>(5)

  const rent   = parseFloat(rentStr.replace(/[^0-9.]/g, ''))   || 0
  const profit = parseFloat(profitStr.replace(/[^0-9.]/g, '')) || 0
  const fitout = parseFloat(fitoutStr.replace(/[^0-9.]/g, '')) || 0

  const TERMS = [3, 4, 5] as const

  const scenarios = useMemo(
    () => TERMS.map(y => buildScenario(y, rent, profit, fitout)),
    [rent, profit, fitout],
  )

  const focused = scenarios.find(s => s.years === focusedTerm) ?? scenarios[2]

  // Diff between 5yr and 3yr for the "what does a longer term cost?" callout
  const s3 = scenarios[0]
  const s5 = scenarios[2]
  const extraCommitment = s5.committed - s3.committed
  const extraRecovery   = profit > 0 ? Math.ceil(extraCommitment / profit) : null

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px 11px 28px',
    fontSize: 15, fontWeight: 600,
    border: `1.5px solid ${T.n200}`, borderRadius: 10,
    background: T.white, color: T.n900,
    fontFamily: T.font, outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: T.n500,
    marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.07em',
  }

  const hasData = rent > 0 && profit > 0 && fitout > 0

  return (
    <div style={{ fontFamily: T.font, color: T.n900 }}>

      {/* ── Inputs ── */}
      <div style={{ background: T.white, border: `1.5px solid ${T.n200}`, borderRadius: 18, padding: '24px 24px 20px', boxShadow: '0 1px 4px rgba(15,23,42,.04)', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
          {[
            { label: 'Monthly rent',       value: rentStr,   set: setRentStr,   tip: 'The quoted monthly rent in $AUD' },
            { label: 'Monthly net profit', value: profitStr, set: setProfitStr, tip: 'After all costs including rent and owner salary' },
            { label: 'Fit-out cost',       value: fitoutStr, set: setFitoutStr, tip: 'Total capital to open (fit-out, equipment, deposits)' },
          ].map(f => (
            <div key={f.label}>
              <label style={labelStyle}>{f.label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: T.n400 }}>$</span>
                <input
                  type="number" min="0"
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <p style={{ fontSize: 11, color: T.n400, marginTop: 5 }}>{f.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {hasData ? (
        <>
          {/* ── Term selector + summary cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {scenarios.map(sc => {
              const vm  = VERDICT_META[sc.verdict]
              const isFocused = sc.years === focusedTerm
              return (
                <button
                  key={sc.years}
                  onClick={() => setFocusedTerm(sc.years)}
                  style={{
                    background: isFocused ? T.dark : T.white,
                    border: `2px solid ${isFocused ? vm.color : T.n200}`,
                    borderRadius: 16, padding: '18px 16px',
                    cursor: 'pointer', textAlign: 'left' as const,
                    transition: 'all 150ms',
                    boxShadow: isFocused ? `0 4px 20px rgba(0,0,0,.15)` : '0 1px 3px rgba(15,23,42,.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: isFocused ? '#F8FAFC' : T.n900 }}>{sc.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: vm.color, background: isFocused ? 'rgba(255,255,255,0.08)' : vm.bg, border: `1px solid ${vm.bdr}`, borderRadius: 5, padding: '2px 7px', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                      {vm.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: isFocused ? 'rgba(255,255,255,0.35)' : T.n500, marginBottom: 10, lineHeight: 1.4 }}>Total committed rent</p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: isFocused ? '#F8FAFC' : T.n900, fontFamily: T.mono, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 6 }}>
                    {fmt(sc.committed)}
                  </p>
                  <p style={{ fontSize: 11, color: isFocused ? 'rgba(255,255,255,0.25)' : T.n400, lineHeight: 1.4 }}>
                    Break-even in {isFinite(sc.breakevenMonths) ? `${Math.ceil(sc.breakevenMonths)} mo` : '—'}
                  </p>
                </button>
              )
            })}
          </div>

          {/* ── Detail panel for focused term ── */}
          <div style={{ background: T.white, border: `1.5px solid ${T.n200}`, borderRadius: 18, padding: '24px', marginBottom: 20, boxShadow: '0 1px 4px rgba(15,23,42,.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: T.n900, margin: 0 }}>{focused.label} lease — full model</h2>
              <span style={{ fontSize: 11, color: T.n400, fontWeight: 600 }}>Click a card above to compare terms</span>
            </div>

            {/* Metrics 2×3 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total rent commitment',  value: fmt(focused.committed),    sub: `${fmt(rent)}/mo × ${focused.months} mo`,         color: T.n900 },
                { label: 'Total capital at risk',  value: fmt(focused.totalCapital), sub: `fit-out + all rent`,                               color: T.n900 },
                { label: 'Fit-out payback',        value: isFinite(focused.paybackMonths)   ? `${Math.ceil(focused.paybackMonths)} months`   : '—', sub: 'months to recover fit-out only', color: T.n900 },
                { label: 'Full break-even',        value: isFinite(focused.breakevenMonths) ? `${Math.ceil(focused.breakevenMonths)} months` : '—', sub: 'months to recover all committed capital', color: focused.breakevenMonths < focused.months ? T.emerald : T.amber },
                { label: 'Profit by end of term',  value: fmt(focused.profitByEnd),   sub: `${fmt(profit)}/mo × ${focused.months} mo`,        color: focused.profitByEnd > focused.totalCapital ? T.emerald : T.amber },
                { label: 'Return on commitment',   value: isFinite(focused.roi) ? `${focused.roi.toFixed(0)}%` : '—', sub: `net profit ÷ total committed capital`,   color: focused.roi > 100 ? T.emerald : T.amber },
              ].map(m => (
                <div key={m.label} style={{ background: T.n50, border: `1px solid ${T.n200}`, borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: T.n400, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 }}>{m.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: m.color, fontFamily: T.mono, lineHeight: 1, marginBottom: 4 }}>{m.value}</p>
                  <p style={{ fontSize: 11, color: T.n400, lineHeight: 1.4 }}>{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Loss scenario table */}
            <div style={{ marginTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: T.n500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>
                Net loss if business closes at…
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                {[
                  { label: 'End of Year 1', months: 12, loss: focused.lossIfCloseYr1, note: 'Most common failure window' },
                  { label: 'End of Year 2', months: 24, loss: focused.lossIfCloseYr2, note: 'After initial ramp-up phase' },
                  focused.years >= 3
                    ? { label: 'End of Year 3', months: 36, loss: focused.lossIfCloseYr3, note: 'Past typical survival threshold' }
                    : null,
                ].filter(Boolean).map(r => {
                  if (!r) return null
                  const isProfit = r.loss < 0
                  return (
                    <div key={r.label} style={{ background: isProfit ? T.emeraldBg : r.loss < fitout * 0.75 ? T.amberBg : T.redBg, border: `1px solid ${isProfit ? T.emeraldBdr : r.loss < fitout * 0.75 ? T.amberBdr : T.redBdr}`, borderRadius: 12, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: T.n500, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>{r.label}</p>
                      <p style={{ fontSize: 20, fontWeight: 900, color: isProfit ? T.emerald : r.loss < fitout * 0.75 ? T.amber : T.red, fontFamily: T.mono, lineHeight: 1, marginBottom: 4 }}>
                        {isProfit ? `+${fmt(Math.abs(r.loss))}` : fmt(r.loss)}
                      </p>
                      <p style={{ fontSize: 11, color: T.n500, lineHeight: 1.4 }}>{isProfit ? 'In profit' : 'Net loss'} · {r.note}</p>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 11, color: T.n400, marginTop: 10, lineHeight: 1.6 }}>
                Loss = fit-out sunk cost + remaining lease obligation − profit earned. Assumes no subletting income, no goodwill on sale. Conservative by design.
              </p>
            </div>
          </div>

          {/* ── 3yr vs 5yr comparison callout ── */}
          {rent > 0 && profit > 0 && (
            <div style={{ background: T.dark, border: `1px solid rgba(167,243,208,0.12)`, borderRadius: 16, padding: '22px 24px', marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#6EE7B7', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 10 }}>
                3-year vs 5-year — the actual trade-off
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                    A 5-year term commits{' '}
                    <strong style={{ color: '#FCD34D', fontFamily: T.mono }}>{fmt(extraCommitment)}</strong>{' '}
                    more in rent than a 3-year term.
                    {extraRecovery !== null && (
                      <> At <strong style={{ color: '#fff', fontFamily: T.mono }}>{fmt(profit)}/mo</strong> net profit, you recover that extra commitment in <strong style={{ color: '#6EE7B7' }}>{extraRecovery} months</strong>.</>
                    )}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: '#fff' }}>5-year is worth it</strong> when: fit-out cost exceeds{' '}
                    <strong style={{ color: '#6EE7B7', fontFamily: T.mono }}>{fmt(rent * 12)}</strong> (one year&apos;s rent),
                    and net profit exceeds{' '}
                    <strong style={{ color: '#6EE7B7', fontFamily: T.mono }}>{fmt(rent * 0.8)}/mo</strong>.
                    Otherwise, protect yourself with a <strong style={{ color: '#FCD34D' }}>12-month break clause</strong> inside the 5-year term.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Break clause note ── */}
          <div style={{ background: T.blueBg, border: `1px solid ${T.blueBdr}`, borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: T.blue, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 8 }}>Negotiation note</p>
            <p style={{ fontSize: 13, color: '#1E3A8A', lineHeight: 1.7, margin: 0 }}>
              A <strong>5-year lease with a 12-month break clause</strong> is functionally a 1-year lease with 4 optional extension years.
              If trading assumptions prove wrong, you exit at month 12 with only{' '}
              <strong style={{ fontFamily: T.mono }}>{fmt(rent * 12)}</strong> in remaining obligation (vs{' '}
              <strong style={{ fontFamily: T.mono }}>{fmt(rent * 48)}</strong> without the clause).
              This framing typically works on landlords because their preferred outcome is a long-term tenant — the clause is an insurance premium, not a concession.
            </p>
          </div>

          {/* ── CTA ── */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.emerald, color: '#fff', borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Run full address analysis →
            </Link>
            <Link href="/tools/checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.white, color: T.n900, border: `1.5px solid ${T.n200}`, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Before-you-sign checklist →
            </Link>
          </div>
        </>
      ) : (
        <div style={{ background: T.n50, border: `1px dashed ${T.n200}`, borderRadius: 16, padding: '36px 24px', textAlign: 'center' as const }}>
          <p style={{ fontSize: 14, color: T.n400, margin: 0 }}>
            Enter your monthly rent, net profit, and fit-out cost to compare 3, 4, and 5-year lease terms.
          </p>
        </div>
      )}
    </div>
  )
}
