interface Props {
  label: string
  value: number
  max?: number
}

export default function MetricBar({ label, value, max = 100 }: Props) {
  const pct = (value / max) * 100
  const color = value >= 70 ? 'bg-emerald-500' : value >= 45 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-mono text-slate-800 font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
