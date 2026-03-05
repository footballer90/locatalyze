'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const S = {
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand: '#0F766E', brandLight: '#14B8A6',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF', red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
}

const BIZ_TYPES = ['Cafe','Coffee Shop','Restaurant','Bar','Retail - Fashion','Retail - Food','Gym / Fitness','Bakery','Salon / Beauty','Pharmacy','Professional Services','Other']

const MSGS = ['Resolving address coordinates...','Analysing competition density...','Loading area demographics...','Running financial model...','Generating AI analysis...','Building your report...']

export default function OnboardingPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [biz, setBiz] = useState('')
  const [addr, setAddr] = useState('')
  const [rent, setRent] = useState('')
  const [setup, setSetup] = useState('')
  const [ticket, setTicket] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const timers = useRef<any[]>([])

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login?redirectTo=/onboarding')
      else setUserId(data.user.id)
    })
    return () => timers.current.forEach(clearTimeout)
  }, [router])

  const step1Valid = biz.trim() && addr.trim()
  const step2Valid = parseFloat(rent) > 0 && parseFloat(setup) > 0 && parseFloat(ticket) > 0

  async function handleSubmit() {
    setLoading(true); setError(null); setProgress(0); setTimedOut(false)
    setMsg(MSGS[0])
    let i = 0
    const iv = setInterval(() => { i = Math.min(i + 1, MSGS.length - 1); setMsg(MSGS[i]); setProgress(p => Math.min(p + 15, 90)) }, 3500)
    const tot = setTimeout(() => setTimedOut(true), 35000)
    timers.current = [iv as any, tot]

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType: biz, address: addr, monthlyRent: parseFloat(rent), setupBudget: parseFloat(setup), avgTicketSize: parseFloat(ticket), userId: userId || 'anonymous' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `Error ${res.status}`)
      }
      const data = await res.json()
      if (!data.success || !data.reportId) throw new Error(data.error?.message || 'No report returned')
      clearInterval(iv); clearTimeout(tot)
      setProgress(100); setMsg('Saving your report...')
      try { sessionStorage.setItem(`report_${data.reportId}`, JSON.stringify(data.report)) } catch {}
      const supabase = createClient()
      await supabase.from('reports').upsert({
        report_id: data.reportId, user_id: userId || null,
        verdict: data.report.verdict, overall_score: data.report.overall_score,
        location_name: data.report.location?.formattedAddress || addr,
        business_type: data.report.location?.businessType || biz,
        monthly_rent: parseFloat(rent),
        recommendation: data.report.recommendation,
        competitor_analysis: data.report.competitor_analysis,
        rent_analysis: data.report.rent_analysis,
        market_demand: data.report.market_demand,
        profitability: data.report.profitability,
        pl_summary: data.report.pl_summary,
        three_year_projection: data.report.three_year_projection,
        sensitivity_analysis: data.report.sensitivity_analysis,
        swot_analysis: data.report.swot_analysis,
        breakeven_monthly: data.report.breakeven_monthly,
        breakeven_daily: data.report.breakeven_daily,
        breakeven_months: data.report.breakeven_months,
        score_competition: data.report.score_competition,
        score_rent: data.report.score_rent,
        score_demand: data.report.score_demand,
        score_profitability: data.report.score_profitability,
        score_cost: data.report.score_cost,
        result_data: data.report, status: 'complete',
      }, { onConflict: 'report_id' })
      router.push(`/dashboard/${data.reportId}`)
    } catch (err: any) {
      clearInterval(iv); clearTimeout(tot)
      setLoading(false); setProgress(0); setMsg('')
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: S.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: S.font }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 28px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${S.n100}` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${S.brand}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📍</div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
          {timedOut ? 'Taking a little longer...' : 'Analysing your location'}
        </h2>
        <p style={{ fontSize: 13, color: S.n400, marginBottom: 28, minHeight: 20 }}>{timedOut ? 'Still running — usually takes up to 45 seconds.' : msg}</p>
        <div style={{ height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ height: '100%', background: S.brand, borderRadius: 100, width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ fontSize: 12, color: S.n400 }}>Typically takes 20–30 seconds</p>
      </div>
    </div>
  )

  const inputStyle = { width: '100%', background: S.n50, border: `1.5px solid ${S.n200}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: S.n800, outline: 'none', boxSizing: 'border-box' as const, fontFamily: S.font }
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: S.n700, display: 'block' as const, marginBottom: 7, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} button{font-family:inherit;cursor:pointer;} input,select{font-family:inherit;}`}</style>

      <header style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </div>
      </header>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '32px 20px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          {[{ n: 1, label: 'Business details' }, { n: 2, label: 'Financials' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${step >= s.n ? S.brand : S.n200}`, background: step > s.n ? S.brand : S.white, color: step > s.n ? S.white : step === s.n ? S.brand : S.n400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, transition: 'all 0.2s' }}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: step === s.n ? S.n700 : S.n400 }}>{s.label}</span>
              {i < 1 && <div style={{ width: 36, height: 2, background: step > 1 ? S.brand : S.n200, margin: '0 4px', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)', padding: 28 }}>
          {error && (
            <div style={{ marginBottom: 20, padding: '14px 16px', background: S.redBg, border: `1px solid ${S.redBorder}`, borderRadius: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.red, marginBottom: 4 }}>⚠️ Analysis failed</p>
              <p style={{ fontSize: 13, color: S.red }}>{error}</p>
            </div>
          )}

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 4 }}>About your business</h2>
                <p style={{ fontSize: 13, color: S.n400 }}>What are you opening and where?</p>
              </div>
              <div>
                <label style={labelStyle}>Business type</label>
                <select value={biz} onChange={e => setBiz(e.target.value)} style={inputStyle}>
                  <option value="">Select a type...</option>
                  {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location address</label>
                <input value={addr} onChange={e => setAddr(e.target.value)} placeholder="e.g. 45 King St, Newtown NSW 2042" style={inputStyle} />
                <p style={{ fontSize: 11, color: S.n400, marginTop: 5 }}>Include suburb and postcode for best results</p>
              </div>
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                style={{ background: step1Valid ? S.brand : S.n100, color: step1Valid ? S.white : S.n400, border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 14, width: '100%', opacity: step1Valid ? 1 : 0.7 }}>
                Continue →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 4 }}>Financial details</h2>
                <p style={{ fontSize: 13, color: S.n400 }}>Used to calculate break-even and profitability</p>
              </div>
              <div style={{ background: S.n50, border: `1.5px solid ${S.n200}`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: S.n800 }}>{biz}</p>
                  <p style={{ fontSize: 12, color: S.n400 }}>{addr}</p>
                </div>
                <button onClick={() => setStep(1)} style={{ fontSize: 12, color: S.brand, background: 'none', border: 'none', fontWeight: 700 }}>Edit</button>
              </div>
              {[
                { label: 'Monthly rent', val: rent, set: setRent, ph: '3,500', hint: 'Monthly cost of the space' },
                { label: 'Setup / fit-out cost', val: setup, set: setSetup, ph: '60,000', hint: 'Total upfront investment' },
                { label: 'Average order value', val: ticket, set: setTicket, ph: '12', hint: 'Average spend per customer visit' },
              ].map(f => (
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: S.n400, fontSize: 14 }}>$</span>
                    <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} min="1"
                      style={{ ...inputStyle, paddingLeft: 28 }} />
                  </div>
                  <p style={{ fontSize: 11, color: S.n400, marginTop: 5 }}>{f.hint}</p>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setStep(1)} style={{ padding: '12px 18px', background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 10, fontSize: 13, fontWeight: 600, color: S.n700 }}>← Back</button>
                <button onClick={handleSubmit} disabled={!step2Valid}
                  style={{ flex: 1, background: step2Valid ? S.brand : S.n100, color: step2Valid ? S.white : S.n400, border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 14 }}>
                  Run Analysis →
                </button>
              </div>
            </div>
          )}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: S.n400, marginTop: 16 }}>🔒 Your data is used solely to generate this report and is never shared</p>
      </div>
    </div>
  )
}