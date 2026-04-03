import { C } from './AnalyseTheme'

type Verdict = 'GO' | 'CAUTION' | 'NO'

interface Props {
  verdict: Verdict
  showLabel?: boolean
}

export function RiskBadge({ verdict, showLabel = true }: Props) {
  const cfg: Record<
    Verdict,
    { bg: string; bdr: string; txt: string; icon: string; label: string }
  > = {
    GO: {
      bg: C.emeraldBg,
      bdr: C.emeraldBdr,
      txt: C.emerald,
      icon: '✓',
      label: 'Low Risk',
    },
    CAUTION: {
      bg: C.amberBg,
      bdr: C.amberBdr,
      txt: C.amber,
      icon: '⚠',
      label: 'Moderate Risk',
    },
    NO: {
      bg: C.redBg,
      bdr: C.redBdr,
      txt: C.red,
      icon: '✕',
      label: 'High Risk',
    },
  }
  const { bg, bdr, txt, icon, label } = cfg[verdict]
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: bg,
        border: `1px solid ${bdr}`,
        borderRadius: '8px',
        color: txt,
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 700 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.2 }}>{verdict}</div>
        {showLabel && (
          <div style={{ fontSize: '11px', opacity: 0.8, lineHeight: 1.2 }}>{label}</div>
        )}
      </div>
    </div>
  )
}
