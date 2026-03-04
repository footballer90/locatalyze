'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface FormData {
  businessType: string
  address: string
  monthlyRent: string
  setupBudget: string
  avgTicketSize: string
}

const BUSINESS_TYPES = [
  'Cafe', 'Coffee Shop', 'Restaurant', 'Bar',
  'Retail - Fashion', 'Retail - Food', 'Retail - Health',
  'Gym / Fitness', 'Bakery', 'Salon / Beauty',
  'Pharmacy', 'Professional Services', 'Other',
]

const PROGRESS_MESSAGES = [
  { delay: 0,     text: 'Locating your address...' },
  { delay: 3000,  text: 'Estimating local competition...' },
  { delay: 6000,  text: 'Analysing area demographics...' },
  { delay: 9000,  text: 'Running financial model...' },
  { delay: 13000, text: 'Writing AI analysis...' },
  { delay: 18000, text: 'Finalising your report...' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')
  const [progressPct, setProgressPct] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [form, setForm] = useState<FormData>({
    businessType: '',
    address: '',
    monthlyRent: '',
    setupBudget: '',
    avgTicketSize: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login?redirectTo=/onboarding')
      else setUserId(data.user.id)
    })
  }, [router])

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const step1Valid = form.businessType.trim() && form.address.trim()
  const step2Valid =
    form.monthlyRent && parseFloat(form.monthlyRent) > 0 &&
    form.setupBudget && parseFloat(form.setupBudget) > 0 &&
    form.avgTicketSize && parseFloat(form.avgTicketSize) > 0

  async function handleSubmit() {
    if (!step2Valid) return
    setLoading(true)
    setTimedOut(false)
    setError(null)
    setProgressPct(0)

    setProgressMessage(PROGRESS_MESSAGES[0].text)
    const timers = PROGRESS_MESSAGES.slice(1).map(({ delay, text }) =>
      setTimeout(() => setProgressMessage(text), delay)
    )

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgressPct(p => Math.min(p + 1.5, 92))
    }, 400)

    timeoutRef.current = setTimeout(() => setTimedOut(true), 35000)

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType:  form.businessType,
          address:       form.address,
          monthlyRent:   parseFloat(form.monthlyRent),
          setupBudget:   parseFloat(form.setupBudget),
          avgTicketSize: parseFloat(form.avgTicketSize),
          userId:        userId || 'anonymous',
        }),
      })

      if (!res.ok) throw new Error(`Analysis server returned an error (${res.status}). Please try again.`)

      const data = await res.json()
      if (!data.success || !data.reportId || !data.report) {
        throw new Error(data.error?.message || 'No report returned. Please try again.')
      }

      const { report, reportId } = data
      timers.forEach(clearTimeout)
      clearInterval(progressInterval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setProgressPct(100)
      setProgressMessage('Saving your report...')

      try { sessionStorage.setItem(`report_${reportId}`, JSON.stringify(report)) } catch {}

      const supabase = createClient()
      await supabase.from('reports').upsert({
        report_id:             reportId,
        user_id:               userId || null,
        verdict:               report.verdict,
        overall_score:         report.overall_score,
        score_competition:     report.score_competition,
        score_rent:            report.score_rent,
        score_demand:          report.score_demand,
        score_cost:            report.score_cost,
        score_profitability:   report.score_profitability,
        location_name:         report.location?.formattedAddress || form.address,
        business_type:         report.location?.businessType    || form.businessType,
        monthly_rent:          parseFloat(form.monthlyRent),
        recommendation:        report.recommendation,
        competitor_analysis:   report.competitor_analysis,
        rent_analysis:         report.rent_analysis,
        market_demand:         report.market_demand,
        cost_analysis:         report.cost_analysis,
        profitability:         report.profitability,
        pl_summary:            report.pl_summary,
        three_year_projection: report.three_year_projection,
        sensitivity_analysis:  report.sensitivity_analysis,
        swot_analysis:         report.swot_analysis,
        breakeven_monthly:     report.breakeven_monthly,
        breakeven_daily:       report.breakeven_daily,
        breakeven_months:      report.breakeven_months,
        result_data:           report,
        full_report_markdown:  JSON.stringify(report.financials),
        status:                'complete',
      }, { onConflict: 'report_id' })

      router.push(`/dashboard/${reportId}`)

    } catch (err: any) {
      timers.forEach(clearTimeout)
      clearInterval(progressInterval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setLoading(false)
      setTimedOut(false)
      setProgressPct(0)
      setProgressMessage('')
      const msg = err.message || ''
      setError(msg.includes('fetch') ? 'Could not reach the analysis server. Please check your connection.' : msg || 'Something went wrong. Please try again.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto mb-8 w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-stone-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-teal-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">📍</div>
        </div>

        {timedOut ? (
          <>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Taking a little longer...</h2>
            <p className="text-stone-400 text-sm mb-6">Still running — occasionally takes up to 45 seconds.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Analysing location</h2>
            <p className="text-stone-400 text-sm mb-6 min-h-[1.25rem]">{progressMessage}</p>
          </>
        )}

        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mb-2">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-stone-400">This takes about 20 seconds</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-bold">L</div>
          <span className="font-bold text-stone-900 text-sm">Locatalyze</span>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  step > s  ? 'bg-teal-600 border-teal-600 text-white' :
                  step === s ? 'border-teal-600 text-teal-600 bg-white' :
                               'border-stone-200 text-stone-300 bg-white'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-xs font-medium ${step === s ? 'text-stone-700' : 'text-stone-300'}`}>
                  {s === 1 ? 'Business details' : 'Financials'}
                </span>
                {s < 2 && <div className={`w-8 h-0.5 mx-1 ${step > s ? 'bg-teal-600' : 'bg-stone-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-700 text-sm font-medium mb-0.5">⚠️ Analysis failed</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button onClick={() => setError(null)} className="text-red-400 text-xs underline mt-1">Dismiss</button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 mb-0.5">About your business</h2>
                  <p className="text-stone-400 text-sm">What are you opening and where?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Business type</label>
                  <select value={form.businessType} onChange={update('businessType')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all">
                    <option value="">Select a type...</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Location address</label>
                  <input type="text" value={form.address} onChange={update('address')}
                    onKeyDown={e => e.key === 'Enter' && step1Valid && setStep(2)}
                    placeholder="e.g. 123 Oxford St, Paddington NSW 2021"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all" />
                  <p className="text-stone-400 text-xs mt-1">Include suburb and postcode for best results</p>
                </div>

                <button onClick={() => setStep(2)} disabled={!step1Valid}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-stone-100 disabled:text-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm">
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 mb-0.5">Financial details</h2>
                  <p className="text-stone-400 text-sm">Used to model your break-even and profitability</p>
                </div>

                {/* Summary chip */}
                <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{form.businessType}</p>
                    <p className="text-xs text-stone-400">{form.address}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-teal-600 text-xs font-medium hover:text-teal-700">Edit</button>
                </div>

                {[
                  { field: 'monthlyRent',   label: 'Monthly rent',         placeholder: '3,500',  hint: 'Monthly cost of the space' },
                  { field: 'setupBudget',   label: 'Setup / fit-out cost', placeholder: '60,000', hint: 'Total upfront investment' },
                  { field: 'avgTicketSize', label: 'Avg order value',      placeholder: '12',     hint: 'Average spend per customer' },
                ].map(({ field, label, placeholder, hint }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                      <input type="number" value={form[field as keyof FormData]} onChange={update(field as keyof FormData)}
                        onKeyDown={e => e.key === 'Enter' && field === 'avgTicketSize' && step2Valid && handleSubmit()}
                        placeholder={placeholder} min="1"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-4 py-3 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all" />
                    </div>
                    <p className="text-stone-400 text-xs mt-1">{hint}</p>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setStep(1)}
                    className="px-4 py-3 border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700 font-medium rounded-xl transition-all text-sm">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} disabled={!step2Valid}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-stone-100 disabled:text-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm">
                    Run Analysis →
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-stone-400 text-xs mt-5">
            Your data is used solely to generate this report and is never shared.
          </p>
        </div>
      </div>
    </div>
  )
}