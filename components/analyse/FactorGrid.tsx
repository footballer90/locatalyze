import { C } from './AnalyseTheme'
import {
  GOLD_COAST_FACTOR_META,
  type GoldCoastSuburbFactors,
} from '@/lib/analyse-data/gold-coast'

function factorColor(value: number, dir: 'high' | 'low' | 'ctx'): string {
  if (dir === 'high') return value >= 7 ? C.emerald : value >= 4 ? C.amber : C.red
  if (dir === 'low') return value <= 4 ? C.emerald : value <= 6 ? C.amber : C.red
  return C.muted
}

interface Props {
  factors: GoldCoastSuburbFactors
}

export function FactorGrid({ factors }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 10,
        margin: '12px 0 14px',
      }}
    >
      {GOLD_COAST_FACTOR_META.map(({ key, label, dir }) => {
        const value = factors[key]
        const color = factorColor(value, dir)

        return (
          <div
            key={key}
            style={{
              textAlign: 'center',
              padding: '10px 8px',
              background: C.n50,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>
              {value}
              <span style={{ fontSize: 10, fontWeight: 600, color: C.mutedLight }}>/10</span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: 1.4,
              }}
            >
              {label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
