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

export const FREE_LIMIT = 3

interface QuotaMeterProps {
  used: number
  variant: 'dashboard' | 'nav' | 'onboarding'
  onUpgrade?: () => void
}

export default function QuotaMeter({ used, variant, onUpgrade }: QuotaMeterProps) {
  const remaining = Math.max(0, FREE_LIMIT - used)
  const pct = Math.min((used / FREE_LIMIT) * 100, 100)
  const isAtLimit = used >= FREE_LIMIT
  const isNearLimit = remaining === 1

  const barColor = isAtLimit ? S.red : isNearLimit ? S.amber : S.brand

  // ── Nav variant: compact inline ──────────────────────────────────────────
  if (variant === 'nav') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 48, height: 4, background: S.n200, borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 100, transition: 'width 0.5s ease' }} />
          </div>
          <span style={{ fontSize: 11, color: isAtLimit ? S.red : S.n500, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {used}/{FREE_LIMIT}
          </span>
        </div>
        {isAtLimit ? (
          <button onClick={onUpgrade} style={{ fontSize: 11, fontWeight: 700, background: S.red, color: S.white, border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Upgrade
          </button>
        ) : isNearLimit ? (
          <button onClick={onUpgrade} style={{ fontSize: 11, fontWeight: 700, background: S.amber, color: S.white, border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Upgrade
          </button>
        ) : (
          <button onClick={onUpgrade} style={{ fontSize: 11, fontWeight: 600, background: S.brandFaded, color: S.brand, border: `1px solid ${S.brandBorder}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit' } as any}>
            Upgrade
          </button>
        )}
      </div>
    )
  }

  // ── Onboarding variant: inline warning bar ────────────────────────────────
  if (variant === 'onboarding') {
    if (isAtLimit) {
      return (
        <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 18px', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 6 }}>🚫 You've used all 3 free reports</p>
          <p style={{ fontSize: 13, color: S.n700, marginBottom: 16, lineHeight: 1.6 }}>
            Upgrade to Pro to keep analysing locations — unlimited reports, PDF export, and comparison tool included.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Unlimited reports', 'PDF export', 'Location comparison', 'Priority support'].map(f => (
              <span key={f} style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>✓ {f}</span>
            ))}
          </div>
          <button onClick={onUpgrade} style={{ marginTop: 16, width: '100%', background: S.brand, color: S.white, border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            Upgrade to Pro →
          </button>
        </div>
      )
    }
    return (
      <div style={{ background: isNearLimit ? S.amberBg : S.brandFaded, border: `1px solid ${isNearLimit ? S.amberBdr : S.brandBorder}`, borderRadius: 10, padding: '10px 14px', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: isNearLimit ? S.amber : S.brand, fontWeight: 600 }}>
          {isNearLimit ? '⚠️ Last free report' : `Free plan · ${remaining} report${remaining !== 1 ? 's' : ''} remaining`}
        </p>
        <button onClick={onUpgrade} style={{ fontSize: 11, fontWeight: 700, background: isNearLimit ? S.amber : S.brand, color: S.white, border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Upgrade
        </button>
      </div>
    )
  }

  // ── Dashboard variant: full card ─────────────────────────────────────────
  return (
    <div style={{
      background: isAtLimit ? S.redBg : isNearLimit ? S.amberBg : S.white,
      border: `1px solid ${isAtLimit ? S.redBdr : isNearLimit ? S.amberBdr : S.n200}`,
      borderRadius: 16, padding: '18px 20px', marginBottom: 16,
      fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: isAtLimit ? S.red : isNearLimit ? S.amber : S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Free Plan</p>
          <p style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>
            {isAtLimit ? '🚫 Limit reached' : isNearLimit ? '⚠️ Last free report' : `${remaining} report${remaining !== 1 ? 's' : ''} remaining`}
          </p>
        </div>
        <button
          onClick={onUpgrade}
          style={{
            background: isAtLimit ? S.red : isNearLimit ? S.amber : S.brand,
            color: S.white, border: 'none', borderRadius: 9,
            padding: '8px 16px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: `0 2px 8px ${isAtLimit ? 'rgba(220,38,38,0.25)' : isNearLimit ? 'rgba(217,119,6,0.25)' : 'rgba(15,118,110,0.25)'}`,
          }}
        >
          Upgrade to Pro →
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ height: 8, background: isAtLimit ? '#FEE2E2' : isNearLimit ? '#FEF3C7' : S.n100, borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 100, transition: 'width 0.8s ease' }} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: isAtLimit ? S.red : isNearLimit ? S.amber : S.n400 }}>
        {used} of {FREE_LIMIT} free reports used
      </p>

      {/* Upgrade value props — show when at or near limit */}
      {(isAtLimit || isNearLimit) && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${isAtLimit ? S.redBdr : S.amberBdr}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.n700, marginBottom: 8 }}>Pro includes:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
              <p key={f} style={{ fontSize: 11, color: S.brand, fontWeight: 600 }}>✓ {f}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}