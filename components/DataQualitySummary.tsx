'use client'

import type { ComputedResult } from '@/types/computed'

type Tone = { bg: string; border: string; text: string }

function toneForState(state: 'live' | 'estimated' | 'missing'): Tone {
  if (state === 'live') return { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' }
  if (state === 'estimated') return { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' }
  return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' }
}

function sourceState(sourceLabel?: string, isBenchmark?: boolean): 'live' | 'estimated' | 'missing' {
  if (!sourceLabel) return 'missing'
  if (isBenchmark) return 'estimated'
  const s = sourceLabel.toLowerCase()
  if (s.includes('live')) return 'live'
  if (s.includes('estimate') || s.includes('benchmark')) return 'estimated'
  return 'live'
}

export default function DataQualitySummary({ computed }: { computed: ComputedResult | null | undefined }) {
  if (!computed) return null

  const rev = computed.provenance?.revenue
  const cost = computed.provenance?.costs
  const demand = computed.provenance?.demandScore
  const comps = computed.provenance?.competitors

  const rows = [
    { label: 'Revenue', state: sourceState(rev?.sourceLabel, rev?.isBenchmark), source: rev?.sourceLabel ?? 'Missing' },
    { label: 'Costs', state: sourceState(cost?.sourceLabel, cost?.isBenchmark), source: cost?.sourceLabel ?? 'Missing' },
    { label: 'Demand', state: sourceState(demand?.sourceLabel, demand?.isBenchmark), source: demand?.sourceLabel ?? 'Missing' },
    { label: 'Competition', state: sourceState(comps?.sourceLabel, comps?.isBenchmark), source: comps?.sourceLabel ?? 'Missing' },
  ] as const

  return (
    <div style={{ border: '1px solid #E7E5E4', borderRadius: 10, padding: '10px 12px', background: '#FFFFFF' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: '#78716C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data quality</span>
        <span style={{ fontSize: 11, color: '#44403C', fontWeight: 700 }}>
          {computed.dataCompleteness}% · {computed.modelConfidence}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {rows.map(row => {
          const tone = toneForState(row.state)
          return (
            <div key={row.label} style={{ border: `1px solid ${tone.border}`, borderRadius: 8, background: tone.bg, padding: '6px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 11, color: '#44403C', fontWeight: 700 }}>{row.label}</span>
                <span style={{ fontSize: 10, color: tone.text, fontWeight: 700, textTransform: 'uppercase' }}>{row.state}</span>
              </div>
              <span style={{ fontSize: 10, color: '#78716C' }}>{row.source}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
