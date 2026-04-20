'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/components/Logo'

const ADDRESS = '142 Bourke St, Melbourne VIC 3000'
const STEP_DURATION = 4200
const font = "'DM Sans', sans-serif"

const STEPS = [
 { num: '01', tag: 'Step 1', title: 'Enter your location',   desc: 'Type any Australian address. Add your business type, monthly rent and average order size. Takes ~90 seconds.' },
 { num: '02', tag: 'Step 2', title: 'Analysis runs in real time', desc: 'We pull live competitor data, demographics, rental benchmarks and foot traffic signals -- all automatically.' },
 { num: '03', tag: 'Step 3', title: 'Get your full report',   desc: 'GO / CAUTION / NO verdict with full financial model, SWOT analysis and 3-year projection.' },
]

const PS = [
 { text: 'Scanning competitors within 500m' },
 { text: 'Loading ABS demographic data' },
 { text: 'Estimating foot traffic patterns' },
 { text: 'Calculating rent-to-revenue ratio' },
 { text: 'Generating feasibility report' },
]

const RR = [
 { label: 'Location Score',  val: '84 / 100',  c: '#34D399' },
 { label: 'Demand Signal',   val: 'Strong',   c: '#34D399' },
 { label: 'Competition Risk', val: 'Moderate',  c: '#FBBF24' },
 { label: 'Rent Viability',  val: 'Viable -- 9.8%', c: '#34D399' },
 { label: 'Demographics',   val: 'Excellent match', c: '#34D399' },
]

// ── Panel 1 ──────────────────────────────────────────────────────
function Panel1({ typed, ready }: { typed: string; ready: boolean }) {
 const inp: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1.5px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '11px 13px', marginBottom: 11, fontSize: 13, color: '#F0FDF9', transition: 'border .3s, box-shadow .3s' }
 const lbl: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }
 return (
    <div style={{ padding: 22 }}>
      <p style={lbl}>Business Address</p>
      <div style={{ ...inp, border: '1.5px solid #0F766E', boxShadow: '0 0 0 3px rgba(15,118,110,.1)' }}>
        <span style={{ flex: 1 }}>{typed}</span>
        <span style={{ display: 'inline-block', width: 2, height: 13, background: '#0FDECE', verticalAlign: 'middle', animation: 'hiw-blink .85s infinite' }}/>
   </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 11 }}>
    <div>
          <p style={lbl}>Business Type</p>
          <div style={{ ...inp, marginBottom: 0, opacity: ready ? 1 : .3, transition: 'opacity .4s' }}>{ready ? ' Café' : '— Select —'}</div>
    </div>
        <div>
          <p style={lbl}>Monthly Rent</p>
          <div style={{ ...inp, marginBottom: 0, opacity: ready ? 1 : .3, transition: 'opacity .4s' }}>{ready ? '$4,200 / mo' : '$0 / mo'}</div>
    </div>
      </div>
      <p style={lbl}>Average Order Value</p>
      <div style={{ ...inp, opacity: ready ? 1 : .3, transition: 'opacity .4s' }}>
    <span>{ready ? '$9.50' : '—'}</span>
   </div>
      <button style={{ width: '100%', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, fontFamily: font, cursor: ready ? 'pointer' : 'default', background: ready ? 'linear-gradient(135deg,#0F766E,#0B9488)' : 'rgba(255,255,255,.05)', color: ready ? '#fff' : 'rgba(255,255,255,.2)', boxShadow: ready ? '0 4px 18px rgba(15,118,110,.35)' : 'none', transition: 'all .4s' }}>
    Analyse this location →
      </button>
    </div>
  )
}

// ── Panel 2 ──────────────────────────────────────────────────────
function Panel2({ activePs }: { activePs: number }) {
  return (
    <div style={{ padding: 22 }}>
      <div style={{ textAlign: 'center', paddingBottom: 16 }}>
    <div style={{ fontSize: 30, display: 'inline-block', animation: 'hiw-spin 2s linear infinite' }}>Settings</div>
    <p style={{ fontSize: 14, fontWeight: 700, color: '#F0FDF9', marginTop: 10, marginBottom: 4 }}>Analysing your location…</p>
    <p style={{ fontSize: 12, color: '#6B7280' }}>This usually takes 8–12 seconds</p>
   </div>
      {PS.map((ps, i) => {
        const done = i < activePs
        const cur  = i === activePs
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 6, background: done ? 'rgba(5,150,105,.06)' : cur ? 'rgba(15,118,110,.1)' : 'rgba(255,255,255,.03)', border: `1px solid ${done ? 'rgba(5,150,105,.25)' : cur ? 'rgba(20,184,166,.35)' : 'rgba(255,255,255,.06)'}`, opacity: done || cur ? 1 : .3, transition: 'all .4s' }}>
      <span style={{ display: 'inline-flex' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg></span>
            <span style={{ fontSize: 12, color: done || cur ? '#E5E7EB' : '#9CA3AF', flex: 1 }}>{ps.text}</span>
      {cur  && <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(15,118,110,.25)', borderTopColor: '#0FDECE', animation: 'hiw-spin .7s linear infinite', flexShrink: 0 }}/>}
      {done && <span style={{ display: 'inline-flex' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
     </div>
        )
      })}
    </div>
  )
}

// ── Panel 3 ──────────────────────────────────────────────────────
function Panel3({ visibleRows, showVerdict, showFinal }: { visibleRows: number; showVerdict: boolean; showFinal: boolean }) {
  return (
    <div style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
    <div>
          <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}> 142 Bourke St, Melbourne VIC</p>
     <p style={{ fontSize: 13, fontWeight: 700, color: '#F0FDF9' }}>Feasibility Report · Café</p>
    </div>
        <div style={{ background: 'rgba(5,150,105,.15)', border: '1px solid rgba(5,150,105,.4)', borderRadius: 9, padding: '7px 14px', textAlign: 'center', opacity: showVerdict ? 1 : 0, transform: showVerdict ? 'scale(1)' : 'scale(.9)', transition: 'opacity .5s, transform .5s' }}>
     <p style={{ fontSize: 17, fontWeight: 900, color: '#34D399' }}>GO</p>
     <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Score: 84</p>
    </div>
      </div>
      {RR.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, marginBottom: 6, opacity: i < visibleRows ? 1 : 0, transform: i < visibleRows ? 'translateX(0)' : 'translateX(-10px)', transition: 'opacity .35s ease, transform .35s ease' }}>
     <span style={{ display: 'inline-flex' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={row.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></span>
          <span style={{ fontSize: 11, color: '#9CA3AF', flex: 1 }}>{row.label}</span>
     <span style={{ fontSize: 11, fontWeight: 700, color: row.c }}>{row.val}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.28)', borderRadius: 10, padding: '12px 16px', marginTop: 6, opacity: showFinal ? 1 : 0, transform: showFinal ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity .5s, transform .5s' }}>
    <span style={{ display: 'inline-flex' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#34D399' }}>GO -- This location is viable</p>
     <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Based on 6 weighted data factors</p>
    </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────
export default function HowItWorks() {
  const [step, setStep]           = useState(0)
  const [typed, setTyped]         = useState('')
 const [ready, setReady]         = useState(false)
  const [activePs, setActivePs]   = useState(-1)
  const [visRows, setVisRows]     = useState(0)
  const [showVerdict, setShowVerdict] = useState(false)
  const [showFinal, setShowFinal] = useState(false)
  const [showComp, setShowComp]   = useState(false)
  const [showScore, setShowScore] = useState(false)

  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const psRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  function clear() {
    if (autoRef.current) clearTimeout(autoRef.current)
    if (typeRef.current) clearInterval(typeRef.current)
    if (psRef.current)   clearInterval(psRef.current)
  }

  function startStep(idx: number) {
    clear()
    setStep(idx)
    setTyped(''); setReady(false); setActivePs(-1)
  setVisRows(0); setShowVerdict(false); setShowFinal(false)
    setShowComp(false); setShowScore(false)

    if (idx === 0) {
      let i = 0
      typeRef.current = setInterval(() => {
        if (i < ADDRESS.length) { setTyped(ADDRESS.slice(0, ++i)) }
        else {
          clearInterval(typeRef.current!)
          setTimeout(() => setReady(true), 300)
        }
      }, 42)
    }

    if (idx === 1) {
      let ps = 0; setActivePs(0)
      setTimeout(() => setShowComp(true), 1200)
      psRef.current = setInterval(() => {
        ps++; setActivePs(ps)
        if (ps >= PS.length) clearInterval(psRef.current!)
      }, 560)
    }

    if (idx === 2) {
      setTimeout(() => setShowVerdict(true), 200)
      RR.forEach((_, i) => setTimeout(() => setVisRows(i + 1), 300 + i * 320))
      setTimeout(() => setShowFinal(true), 300 + RR.length * 320)
      setTimeout(() => setShowScore(true), 800)
    }

    autoRef.current = setTimeout(() => startStep((idx + 1) % 3), STEP_DURATION + 200)
  }

  useEffect(() => { startStep(0); return clear }, [])

  return (
    <>
      <style>{`
        @keyframes hiw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hiw-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes hiw-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }
      `}</style>

      <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 24px', fontFamily: font }}>
    {/* Mesh BG */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 70% 60% at 85% 15%, rgba(5,150,105,.16) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 5% 90%, rgba(15,118,110,.14) 0%, transparent 55%), radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,.85) 0%, transparent 100%), linear-gradient(200deg, #071A16 0%, #040E0C 40%, #081E18 100%)' }}/>
    {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundImage: 'linear-gradient(rgba(20,184,166,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,.025) 1px, transparent 1px)', backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)' }}/>
    {/* Noise */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: .02, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }}/>
    {/* Top edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 10, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.25) 30%, rgba(20,184,166,.4) 50%, rgba(20,184,166,.25) 70%, transparent)' }}/>

    <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative', zIndex: 5 }}>

     {/* Header */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(15,118,110,.12)', border: '1px solid rgba(20,184,166,.28)', borderRadius: 30, padding: '5px 16px 5px 10px', fontSize: 10.5, fontWeight: 700, color: '#0FDECE', letterSpacing: '1.8px', textTransform: 'uppercase', marginBottom: 18 }}>
       <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0FDECE', animation: 'hiw-pulse 2s infinite', display: 'inline-block', flexShrink: 0 }}/>
       How it works
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4.5vw,44px)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.1, marginBottom: 12, background: 'linear-gradient(135deg, #F0FDF9 30%, #0FDECE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
       From address to verdict<br/>in 30 seconds.
            </h2>
            <p style={{ fontSize: 15.5, color: 'rgba(204,235,229,.52)', lineHeight: 1.75, maxWidth: 480 }}>No spreadsheets. No consultants. Just paste the address.</p>
     </div>

          {/* Two column */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>

      {/* Steps */}
            <div>
              {STEPS.map((s, i) => {
                const active = step === i
                return (
                  <div key={i} onClick={() => startStep(i)} style={{ display: 'flex', gap: 18, padding: '22px 20px', borderRadius: 16, cursor: 'pointer', border: `1px solid ${active ? 'rgba(20,184,166,.22)' : 'transparent'}`, background: active ? 'rgba(15,118,110,.08)' : 'transparent', transition: 'all .25s', marginBottom: 4, boxShadow: active ? '0 0 0 1px rgba(20,184,166,.05) inset' : 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, background: active ? '#0F766E' : 'rgba(255,255,255,.05)', color: active ? '#fff' : 'rgba(255,255,255,.25)', boxShadow: active ? '0 4px 12px rgba(15,118,110,.4)' : 'none', transition: 'all .25s', marginTop: 2 }}>{s.num}</div>
          {/* Step icon removed — clean layout */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5, color: active ? '#0FDECE' : 'rgba(255,255,255,.2)', transition: 'color .25s' }}>{s.tag}</p>
           <p style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: active ? 8 : 0, color: active ? '#F0FDF9' : 'rgba(255,255,255,.35)', transition: 'color .25s' }}>{s.title}</p>
           <p style={{ fontSize: 13, color: 'rgba(204,235,229,.45)', lineHeight: 1.75, maxHeight: active ? 80 : 0, overflow: 'hidden', opacity: active ? 1 : 0, transition: 'max-height .4s ease, opacity .3s' }}>{s.desc}</p>
           <div style={{ height: 2, background: 'rgba(255,255,255,.07)', borderRadius: 2, marginTop: active ? 12 : 0, overflow: 'hidden', opacity: active ? 1 : 0, transition: 'opacity .2s, margin .3s' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#0F766E,#0FDECE)', borderRadius: 2, width: active ? '100%' : '0%', transition: active ? `width ${STEP_DURATION}ms linear` : 'none' }}/>
           </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Device */}
            <div style={{ position: 'relative' }}>
       {/* Score badge */}
              <div style={{ position: 'absolute', top: -18, right: -18, zIndex: 10, background: 'rgba(8,20,18,.95)', border: '1px solid rgba(20,184,166,.2)', borderRadius: 14, padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,.5)', backdropFilter: 'blur(12px)', opacity: showScore ? 1 : 0, transform: showScore ? 'translateY(0) scale(1)' : 'translateY(8px) scale(.95)', transition: 'opacity .45s, transform .45s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
         <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: '#34D399', lineHeight: 1 }}>84</p>
          <p style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Score</p>
         </div>
                  <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,.08)' }}/>
         <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontWeight: 900, color: '#34D399' }}>GO </p>
          <p style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>Verdict</p>
         </div>
                </div>
              </div>
              {/* Competitors badge */}
              <div style={{ position: 'absolute', bottom: 28, left: -20, zIndex: 10, background: 'rgba(8,20,18,.95)', border: '1px solid rgba(20,184,166,.2)', borderRadius: 14, padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,.5)', backdropFilter: 'blur(12px)', opacity: showComp ? 1 : 0, transform: showComp ? 'translateY(0) scale(1)' : 'translateY(8px) scale(.95)', transition: 'opacity .45s, transform .45s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
         <span style={{ display: 'inline-flex' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#F0FDF9' }}>4 competitors found</p>
          <p style={{ fontSize: 10, color: '#6B7280' }}>within 500m radius</p>
         </div>
                </div>
              </div>

              <div style={{ background: 'rgba(10,18,16,.92)', border: '1px solid rgba(20,184,166,.14)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,.03), 0 40px 80px rgba(0,0,0,.7), 0 0 80px rgba(15,118,110,.06)' }}>
        <div style={{ background: 'rgba(255,255,255,.035)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
         <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>)}
         </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4B5563' }}>locatalyze.com/analyse</div>
         <div style={{ width: 17, height: 17, borderRadius: 4, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}><LogoMark size="sm" /></div>
        </div>
                <div style={{ background: '#0A1210', minHeight: 380 }}>
         {step === 0 && <Panel1 typed={typed} ready={ready}/>}
                  {step === 1 && <Panel2 activePs={activePs}/>}
                  {step === 2 && <Panel3 visibleRows={visRows} showVerdict={showVerdict} showFinal={showFinal}/>}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
      <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#0F766E,#0B9488)', color: '#fff', borderRadius: 12, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', fontFamily: font, boxShadow: '0 6px 28px rgba(15,118,110,.35), inset 0 1px 0 rgba(255,255,255,.12)' }}>
       Analyse my location free →
            </Link>
            <p style={{ fontSize: 12, color: 'rgba(148,210,198,.28)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
     </div>

        </div>
      </section>
    </>
  )
}
