'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  calculateBreakEven,
  getDefaultTicket,
  getDefaultCogs,
  BUSINESS_OPTIONS_BE,
  STAFF_OPTIONS,
  COGS_OPTIONS,
  type BusinessTypeBE,
  type StaffSetup,
  type BreakEvenResult,
} from '@/lib/break-even-calc'

// ── Design tokens — inline styles so globals.css dark theme can't bleed in ──
const S = {
  brand    : '#2563EB',
  brandBg  : '#EFF6FF',
  brandBdr : '#BFDBFE',
  white    : '#FFFFFF',
  bg       : '#F8FAFC',
  bgSubtle : '#F1F5F9',
  border   : '#E2E8F0',
  n900     : '#0F172A',
  n800     : '#1E293B',
  n700     : '#334155',
  muted    : '#64748B',
  mutedLt  : '#94A3B8',
  emerald  : '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr:'#A7F3D0',
  amber    : '#D97706',
  amberBg  : '#FFFBEB',
  amberBdr : '#FDE68A',
  red      : '#DC2626',
  redBg    : '#FEF2F2',
  redBdr   : '#FECACA',
  orange   : '#EA580C',
  orangeBg : '#FFF7ED',
  orangeBdr: '#FED7AA',
  shadow   : '0 1px 3px rgba(15,23,42,0.06), 0 4px 14px rgba(15,23,42,0.05)',
  shadowHvy: '0 8px 24px rgba(15,23,42,0.10), 0 32px 64px rgba(15,23,42,0.08)',
}

const INPUT: React.CSSProperties = {
  width: '100%',
  background: '#FFFFFF',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 14,
  lineHeight: 1.5,
  color: '#0F172A',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  boxSizing: 'border-box',
}
const INPUT_FOCUS: React.CSSProperties = {
  borderColor: '#2563EB',
  boxShadow : '0 0 0 3px rgba(37,99,235,0.12)',
}

export default function BreakEvenCalculator() {
  const [bizType,    setBizType]    = useState<BusinessTypeBE>('cafe')
  const [monthlyRent,setRent]       = useState<string>('5000')
  const [staffSetup, setStaff]      = useState<StaffSetup>('2')
  const [avgTicket,  setTicket]     = useState<string>(String(getDefaultTicket('cafe')))
  const [cogsPercent,setCogs]       = useState<string>(String(getDefaultCogs('cafe')))
  const [result,     setResult]     = useState<BreakEvenResult | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [formError,  setFormError]  = useState<string | null>(null)
  const [focused,    setFocused]    = useState<string | null>(null)

  const f = (id: string): React.CSSProperties => ({
    ...INPUT,
    ...(focused === id ? INPUT_FOCUS : {}),
  })

  // When business type changes, reset ticket + cogs to sensible defaults
  const onBizTypeChange = (v: BusinessTypeBE) => {
    setBizType(v)
    setTicket(String(getDefaultTicket(v)))
    setCogs(String(getDefaultCogs(v)))
  }

  const run = () => {
    const rent   = parseInt(monthlyRent, 10) || 0
    const ticket = parseFloat(avgTicket) || 0
    const cogs   = parseFloat(cogsPercent) || 0
    if (rent <= 0)   { setFormError('Enter a valid monthly rent.'); return }
    if (ticket <= 0) { setFormError('Enter a valid average ticket above $0.'); return }
    setFormError(null)
    setLoading(true)
    setTimeout(() => {
      setResult(calculateBreakEven({
        businessType: bizType,
        monthlyRent : rent,
        staffSetup,
        avgTicket   : ticket,
        cogsPercent : cogs,
      }))
      setLoading(false)
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setTimeout(() =>
          document.getElementById('be-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        , 80)
      }
    }, 320)
  }

  return (
    <div className="be-grid">

      {/* ── FORM CARD ──────────────────────────────────────────────────── */}
      <div>
        <div className="be-form-sticky" style={{
          background: S.white,
          border: `1px solid ${S.border}`,
          borderRadius: 20,
          padding: 28,
          boxShadow: S.shadowHvy,
        }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 3, fontFamily: 'inherit' }}>
                Calculate break-even
              </div>
              <div style={{ fontSize: 13, color: S.muted, fontFamily: 'inherit' }}>
                See your daily survival number in seconds
              </div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`,
              borderRadius: 100, padding: '3px 10px',
              fontSize: 11, fontWeight: 700, color: S.emerald, fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: S.emerald, display: 'inline-block', flexShrink: 0 }} />
              Free
            </span>
          </div>

          {/* Business type */}
          <BESelect
            label="Business type" id="biz" value={bizType}
            onChange={v => onBizTypeChange(v as BusinessTypeBE)}
            options={BUSINESS_OPTIONS_BE}
            focused={focused} setFocused={setFocused}
          />

          {/* Monthly rent */}
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: S.n800, marginBottom: 6, fontFamily: 'inherit' }}>
              Monthly rent (AUD)
            </span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.mutedLt, fontFamily: 'inherit', userSelect: 'none' }}>
                $
              </span>
              <input
                type="number" inputMode="numeric"
                value={monthlyRent}
                onChange={e => setRent(e.target.value)}
                onFocus={() => setFocused('rent')}
                onBlur={() => setFocused(null)}
                placeholder="5000"
                style={{ ...f('rent'), paddingLeft: 28 }}
              />
            </div>
          </label>

          {/* Staff setup */}
          <BESelect
            label="Staff setup" id="staff" value={staffSetup}
            onChange={v => setStaff(v as StaffSetup)}
            options={STAFF_OPTIONS}
            focused={focused} setFocused={setFocused}
          />

          {/* Average ticket */}
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: S.n800, marginBottom: 6, fontFamily: 'inherit' }}>
              Average ticket per customer (AUD)
            </span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.mutedLt, fontFamily: 'inherit', userSelect: 'none' }}>
                $
              </span>
              <input
                type="number" inputMode="decimal"
                value={avgTicket}
                onChange={e => setTicket(e.target.value)}
                onFocus={() => setFocused('ticket')}
                onBlur={() => setFocused(null)}
                placeholder="14"
                style={{ ...f('ticket'), paddingLeft: 28 }}
              />
            </div>
          </label>

          {/* COGS % */}
          <BESelect
            label="Product / COGS cost" id="cogs" value={cogsPercent}
            onChange={setCogs}
            options={COGS_OPTIONS}
            focused={focused} setFocused={setFocused}
          />

          {formError && (
            <p style={{ fontSize: 12, color: S.red, marginBottom: 12, fontFamily: 'inherit' }}>{formError}</p>
          )}

          {/* CTA button */}
          <button
            onClick={run}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? S.muted : S.n900,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              padding: '13px 20px',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '-0.01em',
            }}
          >
            {loading ? (
              <>
                <svg className="be-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Calculating…
              </>
            ) : (
              <>
                Calculate my break-even
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>

          <p style={{ fontSize: 11, color: S.mutedLt, marginTop: 12, lineHeight: 1.5, fontFamily: 'inherit' }}>
            Free tool · Based on real cost benchmarks · Not financial advice
          </p>
        </div>
      </div>

      {/* ── RESULT COLUMN ──────────────────────────────────────────────── */}
      <div id="be-result">
        {!result
          ? <EmptyState />
          : <ResultPanel result={result} />
        }
      </div>
    </div>
  )
}

// ── SelectField ───────────────────────────────────────────────────────────────
function BESelect({
  label, id, value, onChange, options, focused, setFocused,
}: {
  label: string; id: string; value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  focused: string | null; setFocused: (id: string | null) => void
}) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: S.n800, marginBottom: 6, fontFamily: 'inherit' }}>
        {label}
      </span>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          style={{
            ...INPUT,
            paddingRight: 40,
            cursor: 'pointer',
            ...(focused === id ? INPUT_FOCUS : {}),
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={S.mutedLt} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </label>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{
      background: S.white,
      border: `1px solid ${S.border}`,
      borderRadius: 20,
      boxShadow: S.shadowHvy,
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
        padding: '32px 32px 28px',
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, fontFamily: 'inherit' }}>
          Your results
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-0.02em', fontFamily: 'inherit' }}>
          Run your calculation
        </h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, fontFamily: 'inherit' }}>
          Fill in your costs on the left and click Calculate. You'll see exactly how many customers you need every day to survive.
        </p>
      </div>

      <div style={{ padding: '24px 28px 28px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: S.mutedLt, marginBottom: 14, fontFamily: 'inherit' }}>
          What you'll see
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {[
            { label: 'Customers/day', value: 'Your number',     note: 'The critical daily target' },
            { label: 'Weekly revenue', value: 'Survival line',  note: 'What you must take in' },
            { label: 'Monthly threshold', value: 'Fixed costs', note: 'Total to cover every month' },
            { label: 'Risk level',    value: 'Low → Critical',  note: 'Can your suburb support it?' },
            { label: 'Profit buffer', value: 'Cushion check',   note: 'How tight is the margin?' },
            { label: 'Cost breakdown', value: 'Rent + staff',   note: 'Where the money goes' },
          ].map(c => (
            <div key={c.label} style={{
              background: S.bg, border: `1px solid ${S.border}`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: S.mutedLt, marginBottom: 6, fontFamily: 'inherit' }}>
                {c.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 2, fontFamily: 'inherit' }}>{c.value}</div>
              <div style={{ fontSize: 11, color: S.mutedLt, fontFamily: 'inherit' }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ResultPanel ───────────────────────────────────────────────────────────────
function ResultPanel({ result }: { result: BreakEvenResult }) {
  const risk = result.riskLevel
  const riskColor = {
    low     : S.emerald,
    medium  : S.amber,
    high    : S.orange,
    critical: S.red,
  }[risk]
  const riskBg = {
    low     : S.emeraldBg,
    medium  : S.amberBg,
    high    : S.orangeBg,
    critical: S.redBg,
  }[risk]
  const riskBdr = {
    low     : S.emeraldBdr,
    medium  : S.amberBdr,
    high    : S.orangeBdr,
    critical: S.redBdr,
  }[risk]

  const bufColor = {
    high    : S.emerald,
    medium  : S.amber,
    low     : S.orange,
    critical: S.red,
  }[result.bufferLevel]
  const bufLabel = { high: 'High buffer', medium: 'Medium buffer', low: 'Low buffer', critical: 'No buffer' }[result.bufferLevel]

  const fmt = (n: number) => n >= 1000 ? '$' + (n / 1000).toFixed(0) + 'k' : '$' + n

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Hero: the number ── */}
      <div style={{
        background: riskBg, border: `1.5px solid ${riskBdr}`,
        borderRadius: 20, padding: '28px 28px 22px',
        boxShadow: S.shadow,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: riskColor, marginBottom: 6, fontFamily: 'inherit' }}>
              Your daily break-even
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 64, fontWeight: 900, color: riskColor, lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'inherit' }}>
                {result.dailyCustomersNeeded}
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: riskColor, fontFamily: 'inherit' }}>
                customers/day
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, maxWidth: 440, fontFamily: 'inherit' }}>
              {result.insight}
            </p>
          </div>
          {/* Risk badge */}
          <div style={{
            background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${riskBdr}`,
            borderRadius: 14, padding: '12px 16px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: S.mutedLt, marginBottom: 4, fontFamily: 'inherit' }}>
              Risk level
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: riskColor, fontFamily: 'inherit' }}>
              {result.riskLabel}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-stat strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <StatCard label="Weekly revenue" value={fmt(result.weeklyRevenueRequired)} sub="to survive" />
        <StatCard label="Monthly threshold" value={fmt(result.monthlyRevenueRequired)} sub="total needed" />
        <StatCard label="Profit buffer" value={bufLabel} sub={result.bufferLevel} tone={result.bufferLevel === 'high' ? 'good' : result.bufferLevel === 'critical' ? 'bad' : 'neutral'} />
      </div>

      {/* ── Risk explanation ── */}
      <div style={{
        background: riskBg, border: `1px solid ${riskBdr}`,
        borderRadius: 14, padding: '18px 20px',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: -2 }}>
            {risk === 'low' ? '✓' : risk === 'medium' ? '⚠' : '⚠'}
          </span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 4, fontFamily: 'inherit' }}>
              {result.riskExplanation}
            </p>
            <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, fontFamily: 'inherit' }}>
              {result.bufferNote}
            </p>
          </div>
        </div>
      </div>

      {/* ── Cost breakdown ── */}
      <div style={{
        background: S.white, border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '20px 22px', boxShadow: S.shadow,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: S.mutedLt, marginBottom: 14, fontFamily: 'inherit' }}>
          Monthly cost breakdown
        </div>
        {[
          { label: 'Monthly rent',      value: result.costs.rent,     note: 'As entered' },
          { label: 'Staff (est.)',      value: result.costs.staff,     note: 'Based on your staff setup' },
          { label: 'Overheads',         value: result.costs.overhead,  note: 'Utilities, insurance, misc' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: `1px solid ${S.border}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: S.n800, fontFamily: 'inherit' }}>{row.label}</div>
              <div style={{ fontSize: 11, color: S.mutedLt, fontFamily: 'inherit' }}>{row.note}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: S.n900, fontFamily: 'inherit' }}>
              ${row.value.toLocaleString()}
            </div>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, marginTop: 2,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: S.n900, fontFamily: 'inherit' }}>Total fixed costs</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: S.n900, fontFamily: 'inherit' }}>
            ${result.costs.total.toLocaleString()}
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: S.bg, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: S.muted, fontFamily: 'inherit' }}>
            Each customer contributes <strong style={{ color: S.n900 }}>${result.contributionMarginPerCust}</strong> toward covering these costs.
            You need <strong style={{ color: S.n900 }}>{result.dailyCustomersNeeded}</strong> per day (across 26 trading days) to clear them.
          </div>
        </div>
      </div>

      {/* ── Paid CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0B1220 100%)',
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 20px 60px rgba(2,6,23,0.65)',
        color: '#FFFFFF',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 100, padding: '4px 12px', marginBottom: 14,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', fontFamily: 'inherit' }}>
            Next step
          </span>
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8, fontFamily: 'inherit' }}>
          {result.ctaNote}
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20, maxWidth: 480, fontFamily: 'inherit' }}>
          The full Locatalyze report tells you the estimated daily foot traffic for your exact address, how many of those are your target customer, and whether the location can actually hit your survival number.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 22 }}>
          {[
            { t: 'Foot traffic estimate', b: 'Estimated daily visitors for your exact address and block.' },
            { t: 'Competitor density',    b: 'How many direct competitors are sharing that customer pool.' },
            { t: 'Catchment demographics',b: 'Income, spending habits and format fit for your 500m catchment.' },
            { t: '12-month P&L model',    b: 'Revenue, costs and break-even timeline at your actual address.' },
          ].map(item => (
            <div key={item.t} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'inherit' }}>{item.t}</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, fontFamily: 'inherit' }}>{item.b}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Link href="/onboarding" style={{
            background: '#FFFFFF', color: '#0F172A',
            borderRadius: 12, padding: '12px 22px',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'inherit',
          }}>
            Check if your suburb can support {result.dailyCustomersNeeded}/day
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link href="/tools/business-viability-checker" style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500,
            textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit',
          }}>
            Also check suburb viability →
          </Link>
        </div>
      </div>

      <p style={{ fontSize: 11, color: S.mutedLt, textAlign: 'center', fontFamily: 'inherit' }}>
        Estimates based on industry benchmarks · Not financial advice · Results vary by location
      </p>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, tone = 'neutral' }: {
  label: string; value: string; sub?: string; tone?: 'good' | 'bad' | 'neutral'
}) {
  const color = tone === 'good' ? S.emerald : tone === 'bad' ? S.red : S.n900
  return (
    <div style={{
      background: S.white, border: `1px solid ${S.border}`,
      borderRadius: 14, padding: '16px', boxShadow: S.shadow,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: S.mutedLt, marginBottom: 6, fontFamily: 'inherit' }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, marginBottom: 3, letterSpacing: '-0.02em', fontFamily: 'inherit' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: S.mutedLt, fontFamily: 'inherit' }}>{sub}</div>
      )}
    </div>
  )
}
