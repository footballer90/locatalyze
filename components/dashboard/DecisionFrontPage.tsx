import React from 'react'

const VARIANT = {
  dashboard: {
    brand: '#4F46E5',
    gradientFrom: 'rgba(79,70,229,0.08)',
    gradientVia: 'rgba(99,102,241,0.06)',
    gradientTo: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(99,102,241,0.22)',
    shadow: '0 10px 28px rgba(79,70,229,0.08)',
    label: 'Locatalyze - decision summary',
  },
  public: {
    brand: '#0F766E',
    gradientFrom: 'rgba(15,118,110,0.09)',
    gradientVia: 'rgba(20,184,166,0.06)',
    gradientTo: 'rgba(255,255,255,0.94)',
    border: '1px solid rgba(45,212,191,0.28)',
    shadow: '0 10px 28px rgba(15,118,110,0.08)',
    label: 'Locatalyze - decision summary',
  },
} as const

const T = {
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  mono: "'JetBrains Mono','Fira Mono','Courier New',monospace",
  n400: '#94A3B8',
  n500: '#64748B',
  n700: '#334155',
  n900: '#0F172A',
  white: '#FFFFFF',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
}

export type DecisionFrontPageProps = {
  variant?: 'dashboard' | 'public'
  locationTitle: string
  businessType: string
  reportDateLabel: string
  reportId: string | null
  verdictBadge: string
  verdictColors: { text: string; bg: string; border: string }
  oneLine: string
  advisorLine?: string | null
  metrics: {
    rentToRevenue: string
    breakEvenDaily: string
    revenueRange: string
    revenueDetail?: string | null
    netMonthly: string
    netQualifier?: string | null
  }
  killSwitch?: string | null
  financialsBlocked?: boolean
  financialsBlockedReason?: string | null
  dataCompletenessPct: number
  modelConfidenceLabel: string
}

export default function DecisionFrontPage({
  variant = 'dashboard',
  locationTitle,
  businessType,
  reportDateLabel,
  reportId,
  verdictBadge,
  verdictColors,
  oneLine,
  advisorLine,
  metrics,
  killSwitch,
  financialsBlocked,
  financialsBlockedReason,
  dataCompletenessPct,
  modelConfidenceLabel,
}: DecisionFrontPageProps) {
  const V = VARIANT[variant]

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 18,
        padding: '22px 24px',
        background: `linear-gradient(130deg, ${V.gradientFrom} 0%, ${V.gradientVia} 45%, ${V.gradientTo} 100%)`,
        border: V.border,
        boxShadow: V.shadow,
        fontFamily: T.font,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 200, flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: V.brand, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {V.label}
          </p>
          <h1 style={{ fontSize: 'clamp(22px, 3.2vw, 30px)', fontWeight: 900, color: T.n900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 6 }}>
            {locationTitle}
          </h1>
          <p style={{ fontSize: 13, color: T.n500, lineHeight: 1.55, marginBottom: 4 }}>
            {(businessType || 'Business').replace(/\b\w/g, (c) => c.toUpperCase())} · {reportDateLabel}
          </p>
          {reportId && <p style={{ fontSize: 11, color: T.n400, fontFamily: T.mono }}>Report ID: {reportId}</p>}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, border: `2px solid ${verdictColors.border}`, background: verdictColors.bg, alignSelf: 'flex-start' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: T.n500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verdict</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: verdictColors.text, letterSpacing: '-0.02em' }}>{verdictBadge}</span>
        </div>
      </div>

      <p style={{ fontSize: 17, fontWeight: 800, color: T.n900, marginTop: 16, lineHeight: 1.35 }}>{oneLine}</p>
      {advisorLine && <p style={{ fontSize: 13, color: T.n700, marginTop: 10, lineHeight: 1.55, fontWeight: 600 }}>{advisorLine}</p>}

      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 200px', padding: '10px 14px', borderRadius: 10, background: T.white, border: `1px solid rgba(148,163,184,0.35)` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Data completeness</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: T.n900, fontFamily: T.mono }}>{dataCompletenessPct}%</p>
          <p style={{ fontSize: 11, color: T.n500, marginTop: 2 }}>Share of inputs we could verify from live or structured sources</p>
        </div>
        <div style={{ flex: '1 1 200px', padding: '10px 14px', borderRadius: 10, background: T.white, border: `1px solid rgba(148,163,184,0.35)` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Model confidence</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: T.n900 }}>{modelConfidenceLabel}</p>
          <p style={{ fontSize: 11, color: T.n500, marginTop: 2 }}>How strongly the forecast can be trusted given data mode</p>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        {[
          { k: 'Rent / revenue', v: metrics.rentToRevenue, hint: 'Monthly rent as % of monthly revenue' },
          { k: 'Break-even / day', v: metrics.breakEvenDaily, hint: 'Customers per trading day to cover all costs' },
          { k: 'Monthly revenue', v: metrics.revenueRange, sub: metrics.revenueDetail, hint: 'Central estimate or range from the model' },
          { k: 'Net / month', v: metrics.netMonthly, sub: metrics.netQualifier, hint: 'Operating profit after rent, staff, COGS, other' },
        ].map((row) => (
          <div key={row.k} title={row.hint} style={{ background: T.white, border: `1px solid rgba(226,232,240,0.9)`, borderRadius: 12, padding: '12px 14px', minHeight: 88 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: T.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{row.k}</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: financialsBlocked ? T.n500 : T.n900, fontFamily: T.mono, lineHeight: 1.25 }}>
              {financialsBlocked ? '-' : row.v}
            </p>
            {row.sub && !financialsBlocked && <p style={{ fontSize: 11, color: T.n500, marginTop: 4, lineHeight: 1.35 }}>{row.sub}</p>}
          </div>
        ))}
      </div>

      {financialsBlocked && financialsBlockedReason && (
        <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)' }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#92400E', marginBottom: 4 }}>Financial view withheld</p>
          <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.55 }}>{financialsBlockedReason}</p>
        </div>
      )}

      {killSwitch && (
        <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 12, background: T.redBg, border: `2px solid ${T.redBdr}` }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: T.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Kill switch - do not proceed if
          </p>
          <p style={{ fontSize: 14, color: '#991B1B', fontWeight: 700, lineHeight: 1.5 }}>{killSwitch}</p>
        </div>
      )}
    </div>
  )
}
