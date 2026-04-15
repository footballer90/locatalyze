'use client'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
 n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
 white: '#FFFFFF',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
}

export const FREE_LIMIT = 1

interface QuotaMeterProps {
 used: number
  variant: 'dashboard' | 'nav' | 'onboarding'
 onUpgrade?: () => void
}

export default function QuotaMeter({ used, variant, onUpgrade }: QuotaMeterProps) {
  const remaining = Math.max(0, FREE_LIMIT - used)
  const pct = Math.min((used / FREE_LIMIT) * 100, 100)
  const isAtLimit = used >= FREE_LIMIT
  const barColor = isAtLimit ? S.red : S.brand

  // ── Nav variant: compact inline ──────────────────────────────────────────
  if (variant === 'nav') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: isAtLimit ? S.red : S.n500, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {isAtLimit ? 'Free report used' : '1 free report'}
        </span>
        <button onClick={onUpgrade} style={{
          fontSize: 11, fontWeight: 700,
          background: isAtLimit ? S.amber : S.brandFaded,
          color: isAtLimit ? S.white : S.brand,
          border: isAtLimit ? 'none' : `1px solid ${S.brandBorder}`,
          borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {isAtLimit ? 'Unlock full report — $29' : 'Pricing'}
        </button>
      </div>
    )
  }

  // ── Onboarding variant: inline warning bar ────────────────────────────────
  if (variant === 'onboarding') {
    if (isAtLimit) {
      return (
        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: '16px 18px', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#92400E', marginBottom: 6 }}>You've used your free report</p>
          <p style={{ fontSize: 13, color: S.n700, marginBottom: 12, lineHeight: 1.6 }}>
            Unlock full reports with complete financial models, break-even analysis, and PDF export starting at $29.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            {['Full financial model', 'Break-even analysis', 'PDF export', 'Revenue projections'].map(f => (
              <span key={f} style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>Check {f}</span>
            ))}
          </div>
          <button onClick={onUpgrade} style={{ width: '100%', background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            Unlock full report — $29 →
          </button>
        </div>
      )
    }
    return (
      <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10, padding: '10px 14px', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>
          Your first report is free — see verdict, competitor map, and top-level score
        </p>
      </div>
    )
  }

  // ── Dashboard variant: full card ─────────────────────────────────────────
  return (
    <div style={{
      background: isAtLimit ? S.amberBg : S.white,
      border: `1px solid ${isAtLimit ? S.amberBdr : S.n200}`,
      borderRadius: 16, padding: '18px 20px', marginBottom: 16,
      fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: isAtLimit ? S.amber : S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Free Tier</p>
          <p style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>
            {isAtLimit ? 'Free report used — unlock full analysis' : 'You have 1 free report'}
          </p>
        </div>
        <button
          onClick={onUpgrade}
          style={{
            background: S.brand, color: S.white, border: 'none', borderRadius: 9,
            padding: '8px 16px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(15,118,110,0.25)',
          }}
        >
          {isAtLimit ? 'Unlock — $29' : 'See pricing'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ height: 8, background: isAtLimit ? '#FEF3C7' : S.n100, borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 100, transition: 'width 0.8s ease' }} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: isAtLimit ? S.amber : S.n400 }}>
        {isAtLimit ? 'Unlock full financial model, break-even analysis, and PDF for $29' : '1 free report includes: verdict, competitor map, and top-level score'}
      </p>

      {/* What you get — show when at limit */}
      {isAtLimit && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${S.amberBdr}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.n700, marginBottom: 8 }}>Unlock includes:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {['Full financial model', 'Break-even analysis', 'Revenue & cost projections', 'PDF export', 'SWOT / AI insights', 'Location comparison'].map(f => (
              <p key={f} style={{ fontSize: 11, color: S.brand, fontWeight: 600 }}>Check {f}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
