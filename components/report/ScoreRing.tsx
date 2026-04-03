interface Props {
  score: number
}

export default function ScoreRing({ score }: Props) {
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'DM Mono, monospace' }}>
          {score}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">/ 100</div>
      </div>
    </div>
  )
}
