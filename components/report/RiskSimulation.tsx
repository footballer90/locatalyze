'use client'

import { useState } from 'react'
import type { RiskScenarios } from '@/types/report'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n)

interface Props {
  risk: RiskScenarios
}

type ScenarioKey = 'best' | 'base' | 'worst'

export default function RiskSimulation({ risk }: Props) {
  const [active, setActive] = useState<ScenarioKey>('base')

  return (
    <div>
      <div className="text-sm font-semibold text-slate-900 mb-4">Risk Scenarios — Year 1</div>
      <div className="flex border border-slate-200 rounded-lg overflow-hidden mb-4">
        {(['best', 'base', 'worst'] as ScenarioKey[]).map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
              active === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {[
          { label: 'Annual revenue', value: fmt(risk[active].revenue) },
          { label: 'Annual profit/loss', value: fmt(risk[active].profit), profit: risk[active].profit },
          { label: 'Occupancy rate', value: `${risk[active].occupancyRate}%` },
        ].map(({ label, value, profit }) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs text-slate-500">{label}</span>
            <span
              className={`text-sm font-mono font-medium ${
                profit !== undefined
                  ? profit > 0
                    ? 'text-emerald-600'
                    : 'text-red-500'
                  : 'text-slate-900'
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-3">
        {active === 'best' && 'Assumes 135% of projected customer volume with stable costs.'}
        {active === 'base' && 'Assumes 100% of projected volume with moderate cost escalation.'}
        {active === 'worst' && 'Assumes 60% of projected volume — poor launch or competitor pressure.'}
      </p>
    </div>
  )
}
