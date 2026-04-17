'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  calculateViability,
  BUSINESS_OPTIONS,
  BUDGET_OPTIONS,
  getSuburbOptions,
  type BusinessType,
  type BudgetBand,
  type ViabilityResult,
} from '@/lib/viability-calc'

export default function ViabilityChecker() {
  const [businessType, setBusinessType] = useState<BusinessType>('cafe')
  const [suburbSlug, setSuburbSlug] = useState<string>('surry-hills')
  const [monthlyRent, setMonthlyRent] = useState<string>('6000')
  const [budget, setBudget] = useState<BudgetBand>('100k-250k')
  const [avgTicket, setAvgTicket] = useState<string>('')
  const [result, setResult] = useState<ViabilityResult | null>(null)
  const [loading, setLoading] = useState(false)

  const suburbOptions = useMemo(() => getSuburbOptions(), [])

  const run = () => {
    setLoading(true)
    setTimeout(() => {
      const r = calculateViability({
        businessType,
        suburbSlug,
        monthlyRent: parseInt(monthlyRent, 10) || 0,
        monthlyBudget: budget,
        avgTicket: avgTicket ? parseFloat(avgTicket) : undefined,
      })
      setResult(r)
      setLoading(false)
      // Smooth-scroll to result on mobile
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('viability-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }, 350)
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* ── FORM ─────────────────────────────────────────────────────── */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-7 sticky top-6">
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">Run the check</h2>
          <p className="text-[13px] text-gray-500 mb-6">Takes 10 seconds. No signup needed.</p>

          <Field label="Business type">
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {BUSINESS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Suburb">
            <select
              value={suburbSlug}
              onChange={(e) => setSuburbSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {groupByCity(suburbOptions).map((group) => (
                <optgroup key={group.city} label={group.city}>
                  {group.items.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>

          <Field label="Monthly rent (AUD)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                inputMode="numeric"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="6000"
              />
            </div>
          </Field>

          <Field label="Setup budget">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetBand)}
              className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Average ticket size (optional)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={avgTicket}
                onChange={(e) => setAvgTicket(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="We'll use a typical value if left blank"
              />
            </div>
          </Field>

          <button
            onClick={run}
            disabled={loading}
            className="w-full mt-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-[15px] px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Scoring location…' : 'Check viability'}
          </button>

          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            Free preview based on suburb-level demand models. For an address-level report with live
            competitor, foot-traffic and demographic data, run the full Locatalyze analysis.
          </p>
        </div>
      </div>

      {/* ── RESULT ───────────────────────────────────────────────────── */}
      <div id="viability-result" className="lg:col-span-3">
        {!result ? <EmptyState /> : <ResultPanel result={result} />}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <h3 className="text-[17px] font-bold text-gray-900 mb-2">Your viability score will appear here</h3>
      <p className="text-[14px] text-gray-500 max-w-sm mx-auto leading-relaxed">
        Fill in the form and get an instant GO / CAUTION / NO verdict, base-case revenue and profit,
        and the specific conditions that would have to hold for it to work.
      </p>
    </div>
  )
}

function ResultPanel({ result }: { result: ViabilityResult }) {
  const verdictColor =
    result.verdict === 'GO' ? { bg: '#ecfdf5', fg: '#047857', border: '#a7f3d0' } :
    result.verdict === 'CAUTION' ? { bg: '#fffbeb', fg: '#b45309', border: '#fde68a' } :
    { bg: '#fef2f2', fg: '#b91c1c', border: '#fecaca' }

  const fmt = (n: number) => n >= 1000 ? '$' + Math.round(n / 1000).toLocaleString() + 'k' : '$' + n.toLocaleString()
  const money = (n: number) => '$' + Math.round(n).toLocaleString()

  return (
    <div className="space-y-5">
      {/* Verdict hero */}
      <div
        className="rounded-2xl p-6 md:p-7 border"
        style={{ backgroundColor: verdictColor.bg, borderColor: verdictColor.border }}
      >
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-1.5" style={{ color: verdictColor.fg }}>
              Viability verdict
            </div>
            <div className="text-[40px] font-bold leading-none mb-2" style={{ color: verdictColor.fg }}>
              {result.verdict}
            </div>
            <p className="text-[14px] text-gray-700 leading-relaxed max-w-xl">{result.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-1">Score</div>
            <div className="text-[44px] font-bold leading-none" style={{ color: verdictColor.fg }}>{result.score}</div>
            <div className="text-[11px] text-gray-500 mt-1">out of 100</div>
          </div>
        </div>
      </div>

      {/* Numbers grid */}
      {result.estimatedMonthlyRevenue && result.estimatedNetProfit ? (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Base revenue / mo"
            value={fmt(result.estimatedMonthlyRevenue.base)}
            sub={`${fmt(result.estimatedMonthlyRevenue.low)} – ${fmt(result.estimatedMonthlyRevenue.high)}`}
          />
          <StatCard
            label="Base net profit / mo"
            value={fmt(result.estimatedNetProfit.base)}
            sub={`${fmt(result.estimatedNetProfit.low)} – ${fmt(result.estimatedNetProfit.high)}`}
            tone={result.estimatedNetProfit.base > 0 ? 'good' : 'bad'}
          />
          <StatCard
            label="Break-even"
            value={result.breakEvenMonths ? `${result.breakEvenMonths} mo` : '—'}
            sub={result.breakEvenMonths ? 'on base case' : 'not profitable on base case'}
            tone={result.breakEvenMonths && result.breakEvenMonths <= 18 ? 'good' : 'neutral'}
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-[13px] text-gray-600">
          Revenue could not be calculated — average ticket size or demand estimate is missing.
        </div>
      )}

      {/* Strengths / Risks */}
      <div className="grid md:grid-cols-2 gap-5">
        <ListCard title="What's working" tone="good" items={result.strengths} emptyText="No clear strengths from the inputs you gave us." />
        <ListCard title="What to watch" tone="bad"  items={result.risks}     emptyText="No major red flags on the inputs you gave us." />
      </div>

      {/* Conditions / Failure modes */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-3">Conditions</div>
        <p className="text-[14px] text-gray-800 mb-2 font-medium">This location works ONLY IF:</p>
        <ul className="space-y-1.5 mb-5">
          {result.conditions.map((c, i) => (
            <li key={i} className="text-[14px] text-gray-700 flex gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span><span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="text-[14px] text-gray-800 mb-2 font-medium">This will fail if:</p>
        <ul className="space-y-1.5">
          {result.failureModes.map((c, i) => (
            <li key={i} className="text-[14px] text-gray-700 flex gap-2">
              <span className="text-red-500 mt-0.5">✗</span><span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suburb context */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-1">Suburb signal</div>
            <h3 className="text-[16px] font-bold text-gray-900">{result.suburb.name}, {result.suburb.city}</h3>
          </div>
          <Link href={`/analyse/${result.suburb.citySlug}/${result.suburb.slug}`} className="text-[13px] font-semibold text-blue-600 hover:text-blue-700">
            See full suburb page →
          </Link>
        </div>
        <p className="text-[14px] text-gray-700 leading-relaxed mb-4">{result.suburb.keyInsight}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <MiniStat label="Foot traffic" value={result.suburb.footTraffic} />
          <MiniStat label="Rent range" value={result.suburb.rentRange.replace('/month','')} />
          <MiniStat label="Avg income" value={result.suburb.avgIncome} />
          <MiniStat label="Parking" value={result.suburb.parkingEase} />
        </div>
      </div>

      {/* Paid CTA — what's locked */}
      <div
        className="rounded-2xl p-7 md:p-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0b1220 100%)' }}
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold tracking-wide">Address-level report</span>
          </div>
          <h3 className="text-[22px] md:text-[26px] font-bold leading-[1.2] mb-3">
            This is the suburb-level preview. The full report analyses your exact address.
          </h3>
          <p className="text-[14px] text-white/70 mb-6 max-w-xl">
            Most leases fail or succeed on variables a suburb average can't see.
            Here's what unlocks when you run the full Locatalyze analysis on your address:
          </p>

          <div className="grid md:grid-cols-2 gap-3 mb-6">
            <LockedItem title="Live competitor scan" body={result.locked.competitorIntel} />
            <LockedItem title="Foot traffic by hour" body={result.locked.footTraffic} />
            <LockedItem title="Catchment demographics" body={result.locked.demographics} />
            <LockedItem title="Rent benchmarking" body={result.locked.rentValidation} />
            <LockedItem title="12-month P&L model" body={result.locked.financialModel} />
            <LockedItem title="Map + 500m radius" body="Every competitor, transit stop, and anchor within 500m of your door, plotted." />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href={`/onboarding?suburb=${result.suburb.slug}&city=${result.suburb.citySlug}`}
              className="bg-white text-gray-900 font-semibold rounded-xl px-5 py-3 text-[14px] hover:bg-gray-100 transition inline-flex items-center gap-2"
            >
              Run full analysis — from $49
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/sample-report" className="text-white/80 hover:text-white text-[13px] font-medium underline underline-offset-4">
              See a sample report
            </Link>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        Data completeness on this preview: {result.dataCompleteness}% · Uses Locatalyze suburb demand models · Not financial advice.
      </p>
    </div>
  )
}

// ─── Bits ──────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-[13px] font-semibold text-gray-700 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function StatCard({ label, value, sub, tone = 'neutral' }: {
  label: string
  value: string
  sub?: string
  tone?: 'good' | 'bad' | 'neutral'
}) {
  const color = tone === 'good' ? '#047857' : tone === 'bad' ? '#b91c1c' : '#111827'
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 mb-1">{label}</div>
      <div className="text-[22px] font-bold leading-none mb-1" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
    </div>
  )
}

function ListCard({ title, tone, items, emptyText }: { title: string; tone: 'good' | 'bad'; items: string[]; emptyText: string }) {
  const color = tone === 'good' ? '#047857' : '#b91c1c'
  const dot = tone === 'good' ? '●' : '▲'
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color }}>{dot}</span>
        <h4 className="text-[14px] font-bold text-gray-900">{title}</h4>
      </div>
      {items.length === 0 ? (
        <p className="text-[13px] text-gray-500">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="text-[13.5px] text-gray-700 leading-relaxed">{it}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-500 mb-1">{label}</div>
      <div className="text-[13px] font-semibold text-gray-900">{value}</div>
    </div>
  )
}

function LockedItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span className="text-[12px] font-bold">{title}</span>
      </div>
      <p className="text-[12px] text-white/70 leading-relaxed">{body}</p>
    </div>
  )
}

function groupByCity(items: { value: string; label: string; city: string }[]) {
  const map = new Map<string, { value: string; label: string; city: string }[]>()
  for (const it of items) {
    if (!map.has(it.city)) map.set(it.city, [])
    map.get(it.city)!.push(it)
  }
  return Array.from(map.entries()).map(([city, arr]) => ({ city, items: arr }))
}
