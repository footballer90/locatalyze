import { C } from './AnalyseTheme'
import { VerdictBadge } from './VerdictBadge'

type Verdict = 'GO' | 'CAUTION' | 'NO'

interface SuburbRow {
  name: string
  score: number
  verdict: Verdict
  rent: string
  footTraffic: string
  bestFor: string
}

interface Props {
  title?: string
  rows: SuburbRow[]
}

export function ComparisonTable({ title = 'Suburb Comparison', rows }: Props) {
  return (
    <div style={{ marginBottom: '40px' }}>
      {title && (
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: C.n900,
            marginBottom: '16px',
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: `1px solid ${C.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: C.n50 }}>
              {['Suburb', 'Score', 'Verdict', 'Rent (mo)', 'Foot Traffic', 'Best For'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: C.muted,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderBottom: `1px solid ${C.border}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.name}
                style={{
                  backgroundColor: i % 2 === 0 ? C.white : C.n50,
                  borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : undefined,
                }}
              >
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: C.n900,
                  }}
                >
                  {row.name}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: row.score >= 80 ? C.emerald : row.score >= 70 ? C.brand : C.amber,
                    }}
                  >
                    {row.score}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <VerdictBadge verdict={row.verdict} size="sm" />
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    fontSize: '13px',
                    color: C.n800,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.rent}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: C.muted }}>
                  {row.footTraffic}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: C.muted }}>
                  {row.bestFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
