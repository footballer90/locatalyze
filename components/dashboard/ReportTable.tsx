import type { ReportListItem } from '@/types/report'
import VerdictBadge from '@/components/ui/VerdictBadge'
import Link from 'next/link'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n)

interface Props {
  reports: ReportListItem[]
}

export default function ReportTable({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-500 text-sm">No reports yet.</p>
        <p className="text-slate-400 text-xs mt-1">
          Run your first location analysis to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {['Location', 'Business type', 'Score', 'Verdict', 'Rent/mo', 'Created'].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-slate-500 px-5 py-3.5"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr
              key={r.id}
              className={`hover:bg-slate-50 transition-colors ${
                i < reports.length - 1 ? 'border-b border-slate-50' : ''
              }`}
            >
              <td className="px-5 py-4">
                <Link
                  href={`/dashboard/${r.id}?tab=decision`}
                  className="text-sm font-medium text-slate-900 hover:underline"
                >
                  {r.locationName}
                </Link>
                <div className="text-xs text-slate-400">{r.address ?? '—'}</div>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{r.businessType}</td>
              <td className="px-5 py-4">
                <span className="font-mono text-sm font-medium text-slate-900">
                  {r.locationScore}
                </span>
                <span className="text-xs text-slate-400">/100</span>
              </td>
              <td className="px-5 py-4">
                <VerdictBadge verdict={r.verdict} />
              </td>
              <td className="px-5 py-4 text-sm text-slate-600 font-mono">
                {fmt(r.monthlyRent)}
              </td>
              <td className="px-5 py-4 text-sm text-slate-400">
                {r.createdAt.slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
