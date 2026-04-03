'use client'
import Link from 'next/link'

export default function NotFound() {
  const S = {
    page: {
      minHeight: '100vh',
      background: '#0C1F1C',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '40px 24px',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    // Background grid
    grid: {
      position: 'absolute' as const,
      inset: 0,
      backgroundImage: `linear-gradient(rgba(15,118,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.06) 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      pointerEvents: 'none' as const,
    },
    // Glow
    glow: {
      position: 'absolute' as const,
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(15,118,110,0.12) 0%, transparent 70%)',
      pointerEvents: 'none' as const,
    },
    content: {
      position: 'relative' as const,
      zIndex: 1,
      textAlign: 'center' as const,
      maxWidth: '480px',
    },
    // Score ring — repurposed as 404
    scoreRing: {
      width: '140px',
      height: '140px',
      margin: '0 auto 32px',
      position: 'relative' as const,
    },
    scoreInner: {
      position: 'absolute' as const,
      inset: '12px',
      borderRadius: '50%',
      background: '#0C1F1C',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(15,118,110,0.2)',
    },
    scoreNum: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#0F766E',
      lineHeight: 1,
      letterSpacing: '-1px',
    },
    scoreLabel: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#6B7280',
      letterSpacing: '2px',
      textTransform: 'uppercase' as const,
      marginTop: '2px',
    },
    verdictBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(220,38,38,0.12)',
      border: '1px solid rgba(220,38,38,0.3)',
      borderRadius: '20px',
      padding: '4px 14px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#DC2626',
      letterSpacing: '1.5px',
      textTransform: 'uppercase' as const,
      marginBottom: '20px',
    },
    heading: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#F9FAFB',
      lineHeight: 1.3,
      marginBottom: '12px',
      letterSpacing: '-0.5px',
    },
    sub: {
      fontSize: '15px',
      color: '#9CA3AF',
      lineHeight: 1.6,
      marginBottom: '36px',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
      alignItems: 'center',
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#0F766E',
      color: '#fff',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '15px',
      fontWeight: '600',
      padding: '12px 28px',
      borderRadius: '8px',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    btnSecondary: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'transparent',
      color: '#9CA3AF',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '14px',
      fontWeight: '500',
      padding: '10px 20px',
      borderRadius: '8px',
      textDecoration: 'none',
      border: '1px solid rgba(255,255,255,0.08)',
      cursor: 'pointer',
      transition: 'color 0.15s, border-color 0.15s',
    },
    divider: {
      width: '40px',
      height: '1px',
      background: 'rgba(15,118,110,0.3)',
      margin: '28px auto',
    },
    hint: {
      fontSize: '13px',
      color: '#4B5563',
    },
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.page}>
        <div style={S.grid} />
        <div style={S.glow} />

        <div style={S.content}>
          {/* Score ring — repurposed */}
          <div style={S.scoreRing}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
              {/* Track */}
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
              {/* Red arc — ~40% */}
              <circle
                cx="70" cy="70" r="58"
                fill="none"
                stroke="#DC2626"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${0.38 * 2 * Math.PI * 58} ${2 * Math.PI * 58}`}
                strokeDashoffset={`${0.25 * 2 * Math.PI * 58}`}
                transform="rotate(-90 70 70)"
                opacity="0.7"
              />
            </svg>
            <div style={S.scoreInner}>
              <span style={S.scoreNum}>404</span>
              <span style={S.scoreLabel}>Score</span>
            </div>
          </div>

          <div style={S.verdictBadge}>
            <span>●</span> NO — Page Not Found
          </div>

          <h1 style={S.heading}>
            This location doesn't exist
          </h1>
          <p style={S.sub}>
            The page you're looking for has moved, been deleted, or never existed.
            Let's get you back to a viable location.
          </p>

          <div style={S.actions}>
            <Link href="/dashboard" style={S.btnPrimary}>
              ← Back to Dashboard
            </Link>
            <Link href="/onboarding" style={S.btnSecondary}>
              Run a new analysis
            </Link>
          </div>

          <div style={S.divider} />
          <p style={S.hint}>
            If you followed a link and ended up here, the report may have been deleted.
          </p>
        </div>
      </div>
    </>
  )
}