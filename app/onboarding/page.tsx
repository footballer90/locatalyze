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

const WEBHOOK_TIMEOUT_MS = 35000 // 35 seconds before showing timeout warning

export default function OnboardingPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')
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
      if (!data.user) {
        router.push('/auth/login?redirectTo=/onboarding')
      } else {
        setUserId(data.user.id)
      }
    })
  }, [router])

  // Cleanup timeout on unmount
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const step1Valid = form.businessType.trim() && form.address.trim()
  const step2Valid =
    form.monthlyRent && !isNaN(parseFloat(form.monthlyRent)) && parseFloat(form.monthlyRent) > 0 &&
    form.setupBudget && !isNaN(parseFloat(form.setupBudget)) && parseFloat(form.setupBudget) > 0 &&
    form.avgTicketSize && !isNaN(parseFloat(form.avgTicketSize)) && parseFloat(form.avgTicketSize) > 0

  async function handleSubmit() {
    if (!step2Valid) return
    setLoading(true)
    setTimedOut(false)
    setError(null)

    setProgressMessage(PROGRESS_MESSAGES[0].text)
    const timers = PROGRESS_MESSAGES.slice(1).map(({ delay, text }) =>
      setTimeout(() => setProgressMessage(text), delay)
    )

    // Show timeout warning after 35s (but keep waiting — n8n sometimes takes 40s)
    timeoutRef.current = setTimeout(() => setTimedOut(true), WEBHOOK_TIMEOUT_MS)

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
        throw new Error(data.error?.message || 'The analysis completed but returned no data. Please try again.')
      }

      const { report, reportId } = data
      timers.forEach(clearTimeout)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setProgressMessage('Saving your report...')

      // Save to sessionStorage immediately — this is the reliable fallback
      try {
        sessionStorage.setItem(`report_${reportId}`, JSON.stringify(report))
      } catch {}

      // Save to Supabase (best-effort — page works even if this fails)
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from('reports')
        .upsert({
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

      if (dbError) {
        // Non-blocking — report page uses sessionStorage
        console.warn('Supabase save error (non-blocking):', dbError.message)
      }

      router.push(`/dashboard/${reportId}`)

    } catch (err: any) {
      timers.forEach(clearTimeout)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setLoading(false)
      setTimedOut(false)
      setProgressMessage('')

      const msg = err.message || ''
      if (msg === 'Failed to fetch' || msg.includes('fetch')) {
        setError('Could not reach the analysis server. Please check your internet connection and try again.')
      } else if (msg.includes('35') || msg.includes('timeout')) {
        setError('The analysis timed out. Please try again — this is usually a temporary issue.')
      } else {
        setError(msg || 'Something went wrong. Please try again.')
      }
    }
  }

  // ── Timeout warning overlay (shown over the spinner if 35s passes) ──────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative mx-auto mb-8 w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">📍</div>
          </div>

          {timedOut ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-3">Taking longer than usual…</h2>
              <p className="text-slate-400 mb-6">
                The analysis is still running. Please wait a little longer — this occasionally takes up to 45 seconds.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-3">Analysing location</h2>
              <p className="text-slate-400 mb-6 min-h-[1.5rem]">{progressMessage}</p>
            </>
          )}

          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full animate-[progress_40s_linear_forwards]" />
          </div>
          <p className="text-slate-500 text-sm mt-4">
            {timedOut ? 'Still working...' : 'This takes about 20 seconds'}
          </p>
        </div>
        <style jsx>{`
          @keyframes progress { from { width: 0% } to { width: 95% } }
        `}</style>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-emerald-400 text-sm font-medium">📍 Locatalyze</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Analyse a location</h1>
          <p className="text-slate-400">Get an AI-powered feasibility report in 20 seconds</p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                step > s ? 'bg-emerald-500 border-emerald-500 text-white' :
                step === s ? 'border-emerald-400 text-emerald-400' :
                'border-slate-600 text-slate-500'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm font-medium mb-1">⚠️ Analysis failed</p>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-400 text-xs underline hover:text-red-300"
              >
                Dismiss and try again
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">About your business</h2>
                <p className="text-slate-400 text-sm">Tell us what you're opening and where</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Business type <span className="text-red-400">*</span>
                </label>
                <select value={form.businessType} onChange={update('businessType')}
                  className="w-full bg-slate-900/80 border border-slate-600/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-all">
                  <option value="">Select a type...</option>
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location address <span className="text-red-400">*</span>
                </label>
                <input type="text" value={form.address} onChange={update('address')}
                  onKeyDown={e => e.key === 'Enter' && step1Valid && setStep(2)}
                  placeholder="e.g. 123 Oxford St, Paddington NSW 2021"
                  className="w-full bg-slate-900/80 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all" />
                <p className="text-slate-500 text-xs mt-1.5">Include suburb and postcode for best results</p>
              </div>
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Financial details</h2>
                <p className="text-slate-400 text-sm">Used to calculate break-even and profitability</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{form.businessType}</p>
                  <p className="text-slate-400 text-xs">{form.address}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-emerald-400 text-xs hover:text-emerald-300">Edit</button>
              </div>
              {[
                { field: 'monthlyRent',   label: 'Monthly rent budget',         placeholder: '3500',  hint: 'Monthly rent for the space' },
                { field: 'setupBudget',   label: 'Setup / fit-out budget',      placeholder: '60000', hint: 'Total upfront investment' },
                { field: 'avgTicketSize', label: 'Average order / ticket size', placeholder: '12',    hint: 'Average spend per customer visit' },
              ].map(({ field, label, placeholder, hint }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{label} <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input type="number" value={form[field as keyof FormData]} onChange={update(field as keyof FormData)}
                      onKeyDown={e => e.key === 'Enter' && field === 'avgTicketSize' && step2Valid && handleSubmit()}
                      placeholder={placeholder} min="1"
                      className="w-full bg-slate-900/80 border border-slate-600/60 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all" />
                  </div>
                  <p className="text-slate-500 text-xs mt-1.5">{hint}</p>
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep(1)}
                  className="px-5 py-3.5 border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white font-medium rounded-xl transition-all">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={!step2Valid}
                  className="flex-1 py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all">
                  Run Analysis →
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Your data is used solely to generate this report and is never shared.
        </p>
      </div>
    </div>
  )
}