import { C } from './AnalyseTheme'

type Verdict = 'GO' | 'CAUTION' | 'NO'

interface Props {
  verdict: Verdict
  size?: 'sm' | 'md' | 'lg'
}

export function VerdictBadge({ verdict, size = 'md' }: Props) {
  const cfg: Record<Verdict, { bg: string; bdr: string; txt: string }> = {
    GO: { bg: C.emeraldBg, bdr: C.emeraldBdr, txt: C.emerald },
    CAUTION: { bg: C.amberBg, bdr: C.amberBdr, txt: C.amber },
    NO: { bg: C.redBg, bdr: C.redBdr, txt: C.red },
  }
  const sizing = {
    sm: { fontSize: '10px', padding: '2px 8px', borderRadius: '4px' },
    md: { fontSize: '12px', padding: '4px 12px', borderRadius: '6px' },
    lg: { fontSize: '14px', padding: '6px 16px', borderRadius: '8px' },
  }
  const { bg, bdr, txt } = cfg[verdict]
  const { fontSize, padding, borderRadius } = sizing[size]
  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: txt,
        background: bg,
        border: `1px solid ${bdr}`,
        borderRadius,
        padding,
        fontSize,
      }}
    >
      {verdict}
    </span>
  )
}
