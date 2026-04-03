import type { SwotData } from '@/types/report'

interface Props {
  swot: SwotData
}

const quadrants = [
  {
    key: 'strengths' as const,
    label: 'Strengths',
    color: 'border-emerald-200 bg-emerald-50',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  {
    key: 'weaknesses' as const,
    label: 'Weaknesses',
    color: 'border-amber-200 bg-amber-50',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  {
    key: 'opportunities' as const,
    label: 'Opportunities',
    color: 'border-blue-200 bg-blue-50',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  {
    key: 'threats' as const,
    label: 'Threats',
    color: 'border-red-200 bg-red-50',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
]

export default function SwotMatrix({ swot }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {quadrants.map(({ key, label, color, text, dot }) => (
        <div key={key} className={`border rounded-lg p-4 ${color}`}>
          <div className={`text-xs font-semibold uppercase tracking-widest mb-3 ${text}`}>
            {label}
          </div>
          <div className="space-y-2">
            {swot[key].map((item) => (
              <div key={item} className="flex gap-2 text-xs">
                <span className={`w-1 h-1 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
                <span className={text}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
