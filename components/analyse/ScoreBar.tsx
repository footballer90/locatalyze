import { C } from './AnalyseTheme'

interface Props {
  label: string
  value: number
  showValue?: boolean
  color?: string
}

export function ScoreBar({ label, value, showValue = true, color = C.brand }: Props) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const barColor = clampedValue >= 75 ? C.emerald : clampedValue >= 55 ? C.brand : C.amber

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: C.muted, fontWeight: 500 }}>{label}</span>
        {showValue && (
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.n800 }}>{clampedValue}</span>
        )}
      </div>
      <div
        style={{
          height: '8px',
          background: C.n100,
          borderRadius: '100px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${clampedValue}%`,
            background: barColor,
            borderRadius: '100px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  )
}
