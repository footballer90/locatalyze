'use client'

import { useEffect, useState } from 'react'

type CalibrationResponse = {
  success: boolean
  summary: null | {
    evaluatedAt: string
    scoringVersion: string
    totalSamples: number
    exactBandHitRate: number
    survivalAccuracy: number
    avgAbsErrorPct: number | null
  }
  goCalibration: {
    sampleCount: number
    successCount: number
    successRate: number | null
    hasReliableSample: boolean
  }
}

function pct(v: number | null | undefined): string {
  if (v == null) return 'N/A'
  return `${Math.round(v * 100)}%`
}

export default function CalibrationSummary() {
  const [data, setData] = useState<CalibrationResponse | null>(null)

  useEffect(() => {
    let active = true
    void fetch('/api/calibration/summary', { cache: 'no-store' })
      .then(r => r.json())
      .then((json: CalibrationResponse) => {
        if (!active) return
        setData(json)
      })
      .catch(() => {
        if (!active) return
        setData(null)
      })
    return () => { active = false }
  }, [])

  if (!data?.success) {
    return (
      <div style={{ border: '1px solid #E7E5E4', borderRadius: 10, background: '#FFFFFF', padding: '10px 12px' }}>
        <p style={{ fontSize: 11, color: '#78716C', margin: 0 }}>
          Calibration snapshot unavailable — outcome sample still building.
        </p>
      </div>
    )
  }

  const summary = data.summary
  const go = data.goCalibration

  return (
    <div style={{ border: '1px solid #E7E5E4', borderRadius: 10, background: '#FFFFFF', padding: '10px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#78716C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Historical calibration</span>
        <span style={{ fontSize: 11, color: '#44403C', fontWeight: 700 }}>{go.sampleCount} GO outcomes</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ border: '1px solid #A7F3D0', borderRadius: 8, background: '#ECFDF5', padding: '6px 8px' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#065F46', fontWeight: 700 }}>GO success rate</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#059669', fontWeight: 800 }}>
            {pct(go.successRate)}{go.hasReliableSample ? '' : ' (early sample)'}
          </p>
        </div>
        <div style={{ border: '1px solid #BFDBFE', borderRadius: 8, background: '#EFF6FF', padding: '6px 8px' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#1E3A8A', fontWeight: 700 }}>Revenue band hit</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#2563EB', fontWeight: 800 }}>
            {pct(summary?.exactBandHitRate)}
          </p>
        </div>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 10, color: '#78716C' }}>
        {summary
          ? `Scoring v${summary.scoringVersion} · last evaluated ${new Date(summary.evaluatedAt).toLocaleDateString('en-AU')}`
          : 'No evaluator snapshot yet.'}
      </p>
    </div>
  )
}
