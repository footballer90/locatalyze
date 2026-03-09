'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const ADDRESS = '142 Bourke St, Melbourne VIC 3000'
const STEP_DURATION = 4200

const STEPS = [
  {
    num: '01',
    icon: '📍',
    label: 'Step 1',
    title: 'Enter your location',
    desc: 'Type any Australian address. Add your business type, monthly rent and average order size. Takes 60 seconds.',
  },
  {
    num: '02',
    icon: '⚙️',
    label: 'Step 2',
    title: 'AI analyses in real time',
    desc: 'We pull live competitor data, demographics, rental benchmarks and foot traffic signals — all automatically.',
  },
  {
    num: '03',
    icon: '📊',
    label: 'Step 3',
    title: 'Get your full report',
    desc: 'GO / CAUTION / NO verdict with full financial model, SWOT analysis and 3-year projection.',
  },
]

const PROCESS_STEPS = [
  { icon: '🗺️', text: 'Scanning competitors within 500m' },
  { icon: '👥', text: 'Loading ABS demographic data' },
  { icon: '🚶', text: 'Estimating foot traffic patterns' },
  { icon: '💰', text: 'Calculating rent-to-revenue ratio' },
  { icon: '📊', text: 'Generating feasibility report' },
]

const REPORT_ROWS = [
  { icon: '📍', label: 'Location Score', val: '84 / 100', color: '#34D399' },
  { icon: '👥', label: 'Demand Signal', val: 'Strong', color: '#34D399' },
  { icon: '🏪', label: 'Competition Risk', val: 'Moderate', color: '#FCD34D' },
  { icon: '💰', label: 'Rent Viability', val: 'Viable — 9.8%', color: '#34D399' },
  { icon: '📊', label: 'Demographics', val: 'Excellent match', color: '#34D399' },
]

const S = {
  brand: '#0F766E', brandLight: '#14B8A6',
  n900: '#1C1917', n700: '#44403C', n500: '#78716C',
  font: "'DM Sans', sans-serif",
}

// ── PANEL 1: Enter location ──────────────────────────────────────
function Panel1({ typedAddr, fieldsReady }: { typedAddr: string; fieldsReady: boolean }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Business Address</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#161B22', border: '1.5px solid #0F766E', borderRadius: 9, padding: '11px 13px', marginBottom: 12, boxShadow: '0 0 0 3px rgba(15,118,110,.1)' }}>
        <span style={{ fontSize: 14 }}>📍</span>
        <span style={{ fontSize: 13, color: '#E5E7EB', flex: 1 }}>{typedAddr}</span>
        <span style={{ display: 'inline-block', width: 2, height: 13, background: '#14B8A6', verticalAlign: 'middle', animation: 'blink .85s infinite' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Business Type</p>
          <div style={{ background: '#161B22', border: '1.5px solid #1F2937', borderRadius: 9, padding: '10px 12px', fontSize: 12, color: fieldsReady ? '#E5E7EB' : '#4B5563', opacity: fieldsReady ? 1 : 0.35, transition: 'opacity .4s' }}>
            {fieldsReady ? '☕ Café' : '— Select —'}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Monthly Rent</p>
          <div style={{ background: '#161B22', border: '1.5px solid #1F2937', borderRadius: 9, padding: '10px 12px', fontSize: 12, color: fieldsReady ? '#E5E7EB' : '#4B5563', opacity: fieldsReady ? 1 : 0.35, transition: 'opacity .4s' }}>
            {fieldsReady ? '$4,200 / mo' : '$0 / mo'}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Average Order Value</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#161B22', border: '1.5px solid #1F2937', borderRadius: 9, padding: '11px 13px', marginBottom: 18, opacity: fieldsReady ? 1 : 0.35, transition: 'opacity .4s' }}>
        <span style={{ fontSize: 14 }}>💰</span>
        <span style={{ fontSize: 13, color: '#E5E7EB' }}>{fieldsReady ? '$9.50' : '—'}</span>
      </div>
      <button style={{ width: '100%', background: fieldsReady ? S.brand : 'rgba(255,255,255,.06)', color: fieldsReady ? '#fff' : '#4B5563', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, fontFamily: S.font, cursor: fieldsReady ? 'pointer' : 'default', transition: 'background .4s, color .4s' }}>
        Analyse this location →
      </button>
    </div>
  )
}

// ── PANEL 2: Processing ──────────────────────────────────────────
function Panel2({ activePs }: { activePs: number }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: 'center', paddingBottom: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 12, display: 'inline-block', animation: 'spin 2s linear infinite' }}>⚙️</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#F9FAFB', marginBottom: 4 }}>Analysing your location…</p>
        <p style={{ fontSize: 12, color: '#6B7280' }}>This usually takes 8–12 seconds</p>
      </div>
      {PROCESS_STEPS.map((ps, i) => {
        const done = i < activePs
        const active = i === activePs
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 6, background: done ? 'rgba(5,150,105,.05)' : active ? 'rgba(15,118,110,.08)' : '#111827', border: `1px solid ${done ? 'rgba(5,150,105,.3)' : active ? 'rgba(15,118,110,.4)' : '#1F2937'}`, opacity: (done || active) ? 1 : 0.3, transition: 'all .4s' }}>
            <span style={{ fontSize: 14 }}>{ps.icon}</span>
            <span style={{ fontSize: 12, color: (done || active) ? '#E5E7EB' : '#9CA3AF', flex: 1 }}>{ps.text}</span>
            {active && <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(15,118,110,.3)', borderTopColor: '#14B8A6', animation: 'spin .7s linear infinite', flexShrink: 0 }} />}
            {done && <span style={{ fontSize: 12, color: '#34D399' }}>✓</span>}
          </div>
        )
      })}
    </div>
  )
}

// ── PANEL 3: Report ──────────────────────────────────────────────
function Panel3({ visibleRows, showVerdict, showFinal }: { visibleRows: number; showVerdict: boolean; showFinal: boolean }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 3 }}>📍 142 Bourke St, Melbourne VIC 3000</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>Feasibility Report · Café</p>
        </div>
        <div style={{ background: 'rgba(5,150,105,.15)', border: '1px solid rgba(5,150,105,.4)', borderRadius: 9, padding: '7px 14px', textAlign: 'center', opacity: showVerdict ? 1 : 0, transform: showVerdict ? 'scale(1)' : 'scale(.9)', transition: 'opacity .5s, transform .5s' }}>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#34D399' }}>GO</p>
          <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Score: 84</p>
        </div>
      </div>
      {REPORT_ROWS.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#111827', border: '1px solid #1F2937', borderRadius: 8, marginBottom: 6, opacity: i < visibleRows ? 1 : 0, transform: i < visibleRows ? 'translateX(0)' : 'translateX(-10px)', transition: 'opacity .35s ease, transform .35s ease' }}>
          <span style={{ fontSize: 14 }}>{row.icon}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF', flex: 1 }}>{row.label}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: row.color }}>{row.val}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', borderRadius: 10, padding: '12px 16px', marginTop: 8, opacity: showFinal ? 1 : 0, transform: showFinal ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity .5s, transform .5s' }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#34D399' }}>GO — This location is viable</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Based on 6 weighted data factors</p>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [typedAddr, setTypedAddr] = useState('')
  const [fieldsReady, setFieldsReady] = useState(false)
  const [activePs, setActivePs] = useState(-1)
  const [visibleRows, setVisibleRows] = useState(0)
  const [showVerdict, setShowVerdict] = useState(false)
  const [showFinal, setShowFinal] = useState(false)
  const [showBadgeComp, setShowBadgeComp] = useState(false)
  const [showBadgeScore, setShowBadgeScore] = useState(false)
  const [progWidth, setProgWidth] = useState([0, 0, 0])

  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const psRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  function clearAllTimers() {
    if (autoRef.current) clearTimeout(autoRef.current)
    if (typeRef.current) clearInterval(typeRef.current)
    if (psRef.current)   clearInterval(psRef.current)
  }

  function startStep(idx: number) {
    clearAllTimers()
    setActiveStep(idx)
    setProgWidth(prev => { const n = [0,0,0]; n[idx] = 100; return n })

    // reset all states
    setTypedAddr(''); setFieldsReady(false)
    setActivePs(-1)
    setVisibleRows(0); setShowVerdict(false); setShowFinal(false)
    setShowBadgeComp(false); setShowBadgeScore(false)

    if (idx === 0) {
      // type address
      let i = 0
      typeRef.current = setInterval(() => {
        if (i < ADDRESS.length) {
          setTypedAddr(ADDRESS.slice(0, ++i))
        } else {
          clearInterval(typeRef.current!)
          setTimeout(() => setFieldsReady(true), 300)
        }
      }, 42)
    }

    if (idx === 1) {
      // process steps
      let ps = 0
      setActivePs(0)
      setTimeout(() => setShowBadgeComp(true), 1200)
      psRef.current = setInterval(() => {
        ps++
        if (ps <= PROCESS_STEPS.length) setActivePs(ps)
        if (ps >= PROCESS_STEPS.length) clearInterval(psRef.current!)
      }, 560)
    }

    if (idx === 2) {
      // report rows
      setTimeout(() => setShowVerdict(true), 200)
      for (let r = 1; r <= REPORT_ROWS.length; r++) {
        setTimeout(() => setVisibleRows(r), 300 + r * 320)
      }
      setTimeout(() => setShowFinal(true), 300 + REPORT_ROWS.length * 320)
      setTimeout(() => setShowBadgeScore(true), 800)
    }

    // auto advance
    autoRef.current = setTimeout(() => startStep((idx + 1) % 3), STEP_DURATION + 200)
  }

  useEffect(() => { startStep(0); return () => clearAllTimers() }, [])

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
      `}</style>

      <section style={{ background: '#060D0C', padding: '96px 24px', fontFamily: S.font, position: 'relative', overflow: 'hidden' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(15,118,110,.06), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative' }}>

          {/* HEADER */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,.14)', border: '1px solid rgba(15,118,110,.28)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#14B8A6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14B8A6', animation: 'pulseDot 2s infinite', display: 'inline-block' }} />
              How it works
            </div>
            <h2 style={{ fontSize: 'clamp(30px,5vw,46px)', fontWeight: 900, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 12 }}>
              From address to verdict<br />
              <span style={{ color: '#14B8A6' }}>in 30 seconds.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.42)', lineHeight: 1.75, maxWidth: 500 }}>
              No spreadsheets. No consultants. Just paste the address.
            </p>
          </div>

          {/* TWO COLUMN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>

            {/* LEFT: STEPS */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((step, i) => {
                const isActive = activeStep === i
                return (
                  <div
                    key={i}
                    onClick={() => startStep(i)}
                    style={{ display: 'flex', gap: 20, padding: '22px 20px', borderRadius: 16, cursor: 'pointer', border: `1px solid ${isActive ? 'rgba(15,118,110,.25)' : 'transparent'}`, background: isActive ? 'rgba(15,118,110,.08)' : 'transparent', transition: 'all .25s', marginBottom: 4, position: 'relative' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, background: isActive ? S.brand : 'rgba(255,255,255,.06)', color: isActive ? '#fff' : 'rgba(255,255,255,.3)', transition: 'all .25s', marginTop: 2 }}>
                      {step.num}
                    </div>
                    <div style={{ fontSize: 20, flexShrink: 0, marginTop: 8 }}>{step.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#14B8A6' : 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>{step.label}</p>
                      <p style={{ fontSize: 17, fontWeight: 800, color: isActive ? '#F9FAFB' : 'rgba(255,255,255,.4)', letterSpacing: '-0.02em', marginBottom: isActive ? 8 : 0, transition: 'color .25s' }}>{step.title}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, maxHeight: isActive ? 80 : 0, overflow: 'hidden', opacity: isActive ? 1 : 0, transition: 'max-height .4s ease, opacity .3s ease' }}>{step.desc}</p>
                      {/* progress bar */}
                      <div style={{ height: 2, background: 'rgba(255,255,255,.08)', borderRadius: 2, marginTop: isActive ? 12 : 0, overflow: 'hidden', opacity: isActive ? 1 : 0, transition: 'opacity .2s, margin .3s' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg,#0F766E,#14B8A6)', borderRadius: 2, width: isActive ? '100%' : '0%', transition: isActive ? `width ${STEP_DURATION}ms linear` : 'none' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* RIGHT: DEVICE */}
            <div style={{ position: 'relative' }}>

              {/* Floating badge: score */}
              <div style={{ position: 'absolute', top: -18, right: -18, zIndex: 10, background: 'rgba(10,14,18,.95)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', gap: 8, opacity: showBadgeScore ? 1 : 0, transform: showBadgeScore ? 'translateY(0) scale(1)' : 'translateY(8px) scale(.95)', transition: 'opacity .4s, transform .4s' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 900, color: '#34D399', lineHeight: 1 }}>84</p>
                  <p style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Score</p>
                </div>
                <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,.08)' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#34D399' }}>GO ✅</p>
                  <p style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Verdict</p>
                </div>
              </div>

              {/* Floating badge: competitors */}
              <div style={{ position: 'absolute', bottom: 24, left: -20, zIndex: 10, background: 'rgba(10,14,18,.95)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.5)', opacity: showBadgeComp ? 1 : 0, transform: showBadgeComp ? 'translateY(0) scale(1)' : 'translateY(8px) scale(.95)', transition: 'opacity .4s, transform .4s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🗺️</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB' }}>4 competitors found</p>
                    <p style={{ fontSize: 10, color: '#6B7280' }}>within 500m radius</p>
                  </div>
                </div>
              </div>

              {/* Device */}
              <div style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,.09)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,.04), 0 40px 80px rgba(0,0,0,.7), 0 0 80px rgba(15,118,110,.05)' }}>
                {/* browser bar */}
                <div style={{ background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4B5563' }}>
                    app.locatalyze.com.au/analyse
                  </div>
                  <div style={{ width: 17, height: 17, borderRadius: 4, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>L</div>
                </div>
                {/* panels */}
                <div style={{ background: '#0F1117', minHeight: 380 }}>
                  {activeStep === 0 && <Panel1 typedAddr={typedAddr} fieldsReady={fieldsReady} />}
                  {activeStep === 1 && <Panel2 activePs={activePs} />}
                  {activeStep === 2 && <Panel3 visibleRows={visibleRows} showVerdict={showVerdict} showFinal={showFinal} />}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: '#fff', borderRadius: 12, padding: '15px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(15,118,110,.38)', fontFamily: S.font }}>
              Analyse my location free →
            </Link>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', marginTop: 10 }}>No credit card · Any Australian address · 30 seconds</p>
          </div>

        </div>
      </section>
    </>
  )
}
