'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  calculateViability,
  BUSINESS_OPTIONS,
  BUDGET_OPTIONS,
  getSuburbOptions,
  type BusinessType,
  type BudgetBand,
  type ViabilityResult,
} from '@/lib/viability-calc'

// ── Design tokens — all styles are inline so globals.css dark theme can't bleed in ──
const S = {
  brand: '#2563EB',
  brandBg: '#EFF6FF',
  brandBdr: '#BFDBFE',
  white: '#FFFFFF',
  bg: '#F8FAFC',
  bgSubtle: '#F1F5F9',
  border: '#E2E8F0',
  n900: '#0F172A',
  n800: '#1E293B',
  n700: '#334155',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  shadow: '0 1px 3px rgba(15,23,42,0.06), 0 4px 14px rgba(15,23,42,0.05)',
  shadowCard: '0 2px 8px rgba(15,23,42,0.06), 0 16px 40px rgba(15,23,42,0.07)',
  shadowHeavy: '0 8px 24px rgba(15,23,42,0.10), 0 32px 64px rgba(15,23,42,0.08)',
}

// Base input style — overrides globals.css dark input rules via inline specificity
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
  boxShadow: '0 0 0 3px rgba(37,99,235,0.12)',
}

export default function ViabilityChecker() {
  const [businessType, setBusinessType] = useState<BusinessType>('cafe')
  const [suburbSlug, setSuburbSlug] = useState<string>('surry-hills')
  const [monthlyRent, setMonthlyRent] = useState<string>('6000')
  const [budget, setBudget] = useState<BudgetBand>('100k-250k')
  const [avgTicket, setAvgTicket] = useState<string>('')
  const [result, setResult] = useState<ViabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const suburbOptions = useMemo(() => getSuburbOptions(), [])
  const selectedSuburb = useMemo(
    () => suburbOptions.find((s) => s.value === suburbSlug),
    [suburbOptions, suburbSlug]
  )

  const f = (id: string): React.CSSProperties => ({
    ...INPUT,
    ...(focused === id ? INPUT_FOCUS : {}),
  })

  const run = () => {
    const rentValue = parseInt(monthlyRent, 10) || 0
    if (rentValue <= 0) {
      setFormError('Enter a valid monthly rent above $0.')
      return
    }
    setFormError(null)
    setLoading(true)
    setTimeout(() => {
      const r = calculateViability({
        businessType,
        suburbSlug,
        monthlyRent: rentValue,
        monthlyBudget: budget,
        avgTicket: avgTicket ? parseFloat(avgTicket) : undefined,
      })
      setResult(r)
      setLoading(false)
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('vc-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }, 380)
  }

  const applyExample = (ex: {
    type: BusinessType; suburb: string; rent: string
    budgetBand: BudgetBand; ticket?: string
  }) => {
    setBusinessType(ex.type)
    setSuburbSlug(ex.suburb)
    setMonthlyRent(ex.rent)
    setBudget(ex.budgetBand)
    setAvgTicket(ex.ticket ?? '')
  }

  return (
    <div className="vc-grid">

      {/* ── FORM COLUMN ─────────────────────────────────────────────── */}
      <div>
        <div className="vc-form-card" style={{
          background: S.white,
          border: `1px solid ${S.border}`,
          borderRadius: 20,
          padding: 28,
          boxShadow: S.shadowHeavy,
        }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 3, fontFamily: 'inherit' }}>
                Check viability
              </div>
              <div style={{ fontSize: 13, color: S.muted, fontFamily: 'inherit' }}>
                Suburb-level preview in ~10 seconds
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

          {/* Quick examples */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: S.mutedLight, marginBottom: 8, fontFamily: 'inherit' }}>
              Quick examples
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: 'Café · Surry Hills', type: 'cafe' as BusinessType, suburb: 'surry-hills', rent: '6500', budgetBand: '100k-250k' as BudgetBand, ticket: '14' },
                { label: 'Restaurant · Parramatta', type: 'restaurant' as BusinessType, suburb: 'parramatta', rent: '7500', budgetBand: '250k-plus' as BudgetBand, ticket: '45' },
                { label: 'Retail · Subiaco', type: 'retail' as BusinessType, suburb: 'subiaco', rent: '4200', budgetBand: '50k-100k' as BudgetBand },
              ].map(ex => (
                <button
                  key={ex.label}
                  onClick={() => applyExample(ex)}
                  style={{
                    background: S.bg, border: `1px solid ${S.border}`,
                    borderRadius: 100, padding: '5px 12px',
                    fontSize: 12, fontWeight: 500, color: S.n800,
                    cursor: 'pointer', fontFamily: 'inherit',
                    lineHeight: 1.4, whiteSpace: 'nowrap',
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Business type */}
          <SelectField
            label="Business type" id="bt" value={businessType}
            onChange={v => setBusinessType(v as BusinessType)}
            options={BUSINESS_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            focused={focused} setFocused={setFocused}
          />

          {/* Suburb */}
          <SelectField
            label="Suburb" id="suburb" value={suburbSlug}
            onChange={setSuburbSlug}
            groups={groupByCity(suburbOptions)}
            focused={focused} setFocused={setFocused}
          />

          {/* Monthly rent */}
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: S.n800, marginBottom: 6, fontFamily: 'inherit' }}>
              Monthly rent (AUD)
            </span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.mutedLight, userSelect: 'none', fontFamily: 'inherit' }}>
                $
              </span>
              <input
                type="number"
                inputMode="numeric"
                value={monthlyRent}
                onChange={e => setMonthlyRent(e.target.value)}
                onFocus={() => setFocused('rent')}
                onBlur={() => setFocused(null)}
                placeholder="6000"
                style={{ ...f('rent'), paddingLeft: 28 }}
              />
            </div>
            {formError && (
              <p style={{ fontSize: 12, color: S.red, marginTop: 6, fontFamily: 'inherit' }}>{formError}</p>
            )}
          </label>

          {/* Setup budget */}
          <SelectField
            label="Setup budget" id="budget" value={budget}
            onChange={v => setBudget(v as BudgetBand)}
            options={BUDGET_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            focused={focused} setFocused={setFocused}
          />

          {/* Average ticket */}
          <label style={{ display: 'block', marginBottom: 22 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: S.n800, marginBottom: 6, fontFamily: 'inherit' }}>
              Average ticket{' '}
              <span style={{ fontWeight: 400, color: S.mutedLight }}>(optional)</span>
            </span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.mutedLight, userSelect: 'none' }}>
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={avgTicket}
                onChange={e => setAvgTicket(e.target.value)}
                onFocus={() => setFocused('ticket')}
                onBlur={() => setFocused(null)}
                placeholder="We'll use a typical value if blank"
                style={{ ...f('ticket'), paddingLeft: 28 }}
              />
            </div>
          </label>

          {/* Submit */}
          <button
            onClick={run}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? S.muted : S.brand,
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
                <svg className="vc-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Scoring location…
              </>
            ) : (
              <>
                Analyse location
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>

          <p style={{ fontSize: 11, color: S.mutedLight, marginTop: 12, lineHeight: 1.5, fontFamily: 'inherit' }}>
            Free preview · Suburb demand models · Not financial advice · No signup
          </p>
        </div>
      </div>

      {/* ── RESULT COLUMN ───────────────────────────────────────────── */}
      <div id="vc-result">
        {!result
          ? <EmptyState suburb={selectedSuburb?.label ?? null} />
          : <ResultPanel result={result} />
        }
      </div>
    </div>
  )
}

// ── SelectField ──────────────────────────────────────────────────────────────
function SelectField({
  label, id, value, onChange, options, groups, focused, setFocused,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  options?: { value: string; label: string }[]
  groups?: { city: string; items: { value: string; label: string; city: string }[] }[]
  focused: string | null
  setFocused: (id: string | null) => void
}) {
  const isFocused = focused === id
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
            ...(isFocused ? INPUT_FOCUS : {}),
          }}
        >
          {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          {groups?.map(g => (
            <optgroup key={g.city} label={g.city}>
              {g.items.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </optgroup>
          ))}
        </select>
        {/* Custom chevron — replaces the dark arrow from globals.css */}
        <svg
          style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', flexShrink: 0 }}
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={S.mutedLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </label>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({ suburb }: { suburb: string | null }) {
  return (
    <div style={{
      background: S.white,
      border: `1px solid ${S.border}`,
      borderRadius: 20,
      boxShadow: S.shadowHeavy,
      overflow: 'hidden',
    }}>
      {/* Dark header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
        padding: '32px 32px 28px',
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, fontFamily: 'inherit' }}>
          Result panel
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-0.02em', fontFamily: 'inherit' }}>
          Run your first check
        </h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, fontFamily: 'inherit' }}>
          {suburb ? `${suburb} is ready. ` : ''}Fill in the form and click Analyse location for an instant GO / CAUTION / NO verdict with revenue, profit and break-even.
        </p>
      </div>

      {/* Preview of what you'll see */}
      <div style={{ padding: '24px 28px 28px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: S.mutedLight, marginBottom: 14, fontFamily: 'inherit' }}>
          What you'll get
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {[
            { label: 'Verdict', value: 'GO / CAUTION / NO', note: 'Clear action signal' },
            { label: 'Monthly revenue', value: '$45k – $90k', note: 'Low / base / high' },
            { label: 'Net profit / mo', value: '$6k – $18k', note: 'After rent + staff + COGS' },
            { label: 'Break-even', value: '~14 months', note: 'On base case' },
            { label: 'Key conditions', value: '3–5 specifics', note: 'What must hold' },
            { label: 'Failure modes', value: 'Named triggers', note: 'What breaks it' },
          ].map(c => (
            <div key={c.label} style={{
              background: S.bg, border: `1px solid ${S.border}`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: S.mutedLight, marginBottom: 6, fontFamily: 'inherit' }}>
                {c.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 2, fontFamily: 'inherit' }}>
                {c.value}
              </div>
              <div style={{ fontSize: 11, color: S.mutedLight, fontFamily: 'inherit' }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ResultPanel ───────────────────────────────────────────────────────────────
function ResultPanel({ result }: { result: ViabilityResult }) {
  const vc =
    result.verdict === 'GO'      ? { bg: S.emeraldBg, fg: S.emerald, bdr: S.emeraldBdr } :
    result.verdict === 'CAUTION' ? { bg: S.amberBg,   fg: S.amber,   bdr: S.amberBdr   } :
                                   { bg: S.redBg,     fg: S.red,     bdr: S.redBdr     }

  const fmt   = (n: number) => n >= 1000 ? '$' + Math.round(n / 1000).toLocaleString() + 'k' : '$' + n.toLocaleString()
  const money = (n: number) => '$' + Math.round(n).toLocaleString()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Verdict hero ── */}
      <div style={{
        background: vc.bg, border: `1.5px solid ${vc.bdr}`,
        borderRadius: 20, padding: '28px 28px 22px',
        boxShadow: S.shadow,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: vc.fg, marginBottom: 6, fontFamily: 'inherit' }}>
              Viability verdict
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: vc.fg, lineHeight: 1, marginBottom: 10, letterSpacing: '-0.025em', fontFamily: 'inherit' }}>
              {result.verdict}
            </div>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, maxWidth: 500, fontFamily: 'inherit' }}>
              {result.summary}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.mutedLight, marginBottom: 2, fontFamily: 'inherit' }}>
              Score
            </div>
            <div style={{ fontSize: 54, fontWeight: 900, color: vc.fg, lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'inherit' }}>
              {result.score}
            </div>
            <div style={{ fontSize: 11, color: S.mutedLight, marginTop: 2, fontFamily: 'inherit' }}>out of 100</div>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[result.suburb.name, result.suburb.city, `${result.dataCompleteness}% data completeness`].map(t => (
            <span key={t} style={{
              background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 100, padding: '3px 10px',
              fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'inherit',
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Financial stats grid ── */}
      {result.estimatedMonthlyRevenue && result.estimatedNetProfit ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          <StatCard
            label="Revenue / mo"
            value={fmt(result.estimatedMonthlyRevenue.base)}
            range={`${fmt(result.estimatedMonthlyRevenue.low)} – ${fmt(result.estimatedMonthlyRevenue.high)}`}
          />
          <StatCard
            label="Net profit / mo"
            value={fmt(result.estimatedNetProfit.base)}
            range={`${fmt(result.estimatedNetProfit.low)} – ${fmt(result.estimatedNetProfit.high)}`}
            tone={result.estimatedNetProfit.base > 0 ? 'good' : 'bad'}
          />
          <StatCard
            label="Est. costs / mo"
            value={money(result.estimatedMonthlyCosts.base)}
            range={`${money(result.estimatedMonthlyCosts.low)} – ${money(result.estimatedMonthlyCosts.high)}`}
          />
          <StatCard
            label="Break-even"
            value={result.breakEvenMonths ? `${result.breakEvenMonths} mo` : '—'}
            range={result.breakEvenMonths ? 'on base case' : 'not profitable'}
            tone={result.breakEvenMonths && result.breakEvenMonths <= 18 ? 'good' : 'neutral'}
          />
        </div>
      ) : (
        <div style={{
          background: S.white, border: `1px solid ${S.border}`,
          borderRadius: 14, padding: '16px 20px',
          fontSize: 13, color: S.muted, fontFamily: 'inherit',
        }}>
          Revenue could not be calculated — average ticket size or demand estimate is missing.
        </div>
      )}

      {/* ── Strengths / Risks ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <ListCard title="What's working"  tone="good" items={result.strengths} empty="No clear strengths from the inputs you gave us." />
        <ListCard title="What to watch"   tone="bad"  items={result.risks}     empty="No major red flags on the inputs you gave us." />
      </div>

      {/* ── Conditions + failure modes ── */}
      <div style={{
        background: S.white, border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '22px 24px', boxShadow: S.shadow,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: S.mutedLight, marginBottom: 18, fontFamily: 'inherit' }}>
          Decision criteria
        </div>

        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 10, fontFamily: 'inherit' }}>
            This location works ONLY IF:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {result.conditions.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151', lineHeight: 1.55, fontFamily: 'inherit' }}>
                <span style={{ color: S.emerald, flexShrink: 0 }}>✓</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 10, fontFamily: 'inherit' }}>
            This will fail if:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {result.failureModes.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151', lineHeight: 1.55, fontFamily: 'inherit' }}>
                <span style={{ color: S.red, flexShrink: 0 }}>✗</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Suburb signal ── */}
      <div style={{
        background: S.white, border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '22px 24px', boxShadow: S.shadow,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: S.mutedLight, marginBottom: 4, fontFamily: 'inherit' }}>
              Suburb signal
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900, fontFamily: 'inherit' }}>
              {result.suburb.name}, {result.suburb.city}
            </h3>
          </div>
          <Link
            href={`/analyse/${result.suburb.citySlug}/${result.suburb.slug}`}
            style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Full suburb page →
          </Link>
        </div>
        <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, marginBottom: 16, fontFamily: 'inherit' }}>
          {result.suburb.keyInsight}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: 'Foot traffic', value: result.suburb.footTraffic },
            { label: 'Rent range', value: result.suburb.rentRange.replace('/month', '') },
            { label: 'Avg income', value: result.suburb.avgIncome },
            { label: 'Parking', value: result.suburb.parkingEase },
          ].map(m => (
            <div key={m.label} style={{ background: S.bg, borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: S.mutedLight, marginBottom: 4, fontFamily: 'inherit' }}>
                {m.label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: S.n900, fontFamily: 'inherit' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Paid CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0B1220 100%)',
        borderRadius: 20,
        padding: 32,
        boxShadow: '0 20px 60px rgba(2,6,23,0.65)',
        color: '#FFFFFF',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 100, padding: '4px 12px', marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', fontFamily: 'inherit' }}>Address-level report</span>
        </div>

        <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 10, fontFamily: 'inherit' }}>
          This is the suburb preview. The full report analyses your exact address.
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 22, maxWidth: 520, fontFamily: 'inherit' }}>
          Most leases fail or succeed on variables a suburb average can't see — specific competitors
          within 500m, hour-by-hour foot traffic, and whether your rent is above comparable listings.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10, marginBottom: 24 }}>
          {[
            { title: 'Live competitor scan',    body: result.locked.competitorIntel },
            { title: 'Foot traffic by hour',    body: result.locked.footTraffic },
            { title: 'Catchment demographics',  body: result.locked.demographics },
            { title: 'Rent benchmarking',       body: result.locked.rentValidation },
            { title: '12-month P&L model',      body: result.locked.financialModel },
            { title: 'Map + 500m radius',       body: 'Every competitor, transit stop, and anchor within 500m plotted on an interactive map.' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>{item.title}</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, fontFamily: 'inherit' }}>{item.body}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Link
            href={`/onboarding?suburb=${result.suburb.slug}&city=${result.suburb.citySlug}`}
            style={{
              background: '#FFFFFF', color: '#0F172A',
              borderRadius: 12, padding: '12px 24px',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: 'inherit',
            }}
          >
            Run full analysis — from $49
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link href="/sample-report" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}>
            See a sample report
          </Link>
        </div>
      </div>

      <p style={{ fontSize: 11, color: S.mutedLight, textAlign: 'center', fontFamily: 'inherit' }}>
        Data completeness: {result.dataCompleteness}% · Suburb demand models · Not financial advice
      </p>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, range, tone = 'neutral' }: {
  label: string; value: string; range?: string; tone?: 'good' | 'bad' | 'neutral'
}) {
  const color = tone === 'good' ? S.emerald : tone === 'bad' ? S.red : S.n900
  return (
    <div style={{
      background: S.white, border: `1px solid ${S.border}`,
      borderRadius: 14, padding: '16px 18px', boxShadow: S.shadow,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: S.mutedLight, marginBottom: 6, fontFamily: 'inherit' }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1, marginBottom: 4, letterSpacing: '-0.02em', fontFamily: 'inherit' }}>
        {value}
      </div>
      {range && (
        <div style={{ fontSize: 11, color: S.mutedLight, lineHeight: 1.4, fontFamily: 'inherit' }}>{range}</div>
      )}
    </div>
  )
}

// ── ListCard ──────────────────────────────────────────────────────────────────
function ListCard({ title, tone, items, empty }: {
  title: string; tone: 'good' | 'bad'; items: string[]; empty: string
}) {
  const accent   = tone === 'good' ? S.emerald    : S.red
  const accentBg = tone === 'good' ? S.emeraldBg  : S.redBg
  const accentBdr= tone === 'good' ? S.emeraldBdr : S.redBdr
  return (
    <div style={{
      background: S.white, border: `1px solid ${S.border}`,
      borderRadius: 16, padding: '18px 20px', boxShadow: S.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: accentBg, border: `1px solid ${accentBdr}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: accent, flexShrink: 0,
        }}>
          {tone === 'good' ? '✓' : '⚠'}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: S.n900, fontFamily: 'inherit' }}>{title}</span>
      </div>
      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: S.mutedLight, fontFamily: 'inherit' }}>{empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', lineHeight: 1.55, fontFamily: 'inherit' }}>
              <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>
                {tone === 'good' ? '✓' : '·'}
              </span>
              <span>{it}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function groupByCity(items: { value: string; label: string; city: string }[]) {
  const map = new Map<string, typeof items>()
  for (const it of items) {
    if (!map.has(it.city)) map.set(it.city, [])
    map.get(it.city)!.push(it)
  }
  return Array.from(map.entries()).map(([city, arr]) => ({ city, items: arr }))
}
