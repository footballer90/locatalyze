import type { Verdict } from '@/types/report'

interface Props {
  verdict: Verdict
  large?: boolean
}

const styles: Record<Verdict, string> = {
  GO: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CAUTION: 'bg-amber-50 text-amber-700 border border-amber-200',
  NO: 'bg-red-50 text-red-700 border border-red-200',
}

const dots: Record<Verdict, string> = {
  GO: 'bg-emerald-500',
  CAUTION: 'bg-amber-500',
  NO: 'bg-red-500',
}

export default function VerdictBadge({ verdict, large = false }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono font-semibold tracking-widest ${
        large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      } ${styles[verdict]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[verdict]}`} />
      {verdict}
    </span>
  )
}
