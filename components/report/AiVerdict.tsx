import type { Verdict } from '@/types/report'
import VerdictBadge from '@/components/ui/VerdictBadge'

interface Props {
  verdict: Verdict
  score: number
  summary: string
}

export default function AiVerdict({ verdict, score, summary }: Props) {
  return (
    <div className="bg-slate-900 rounded-xl p-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">
            AI-written verdict
          </div>
          <VerdictBadge verdict={verdict} large />
        </div>
        <div className="text-xs text-slate-500 font-mono">Score: {score}/100</div>
      </div>
      <p className="text-slate-300 leading-relaxed text-sm max-w-4xl">{summary}</p>
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-6">
        <div className="text-xs text-slate-500">Locatalyze Scoring Engine v2.1</div>
        <div className="text-xs text-slate-500">
          Google Places · ABS Census · Commercial Lease API
        </div>
        <div className="text-xs text-slate-500 ml-auto">Not financial advice.</div>
      </div>
    </div>
  )
}
