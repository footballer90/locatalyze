'use client'
import { useState, useEffect } from 'react'
import { L, font, LI } from './tokens'

const CW_PINS = [
  { x:58, y:40, label:'The Daily Grind', threat:'High', rating:4.2, dist:'120m', color:'#EF4444', d:0 },
  { x:28, y:58, label:'Brew & Co.',      threat:'Med',  rating:3.8, dist:'280m', color:'#F59E0B', d:350 },
  { x:72, y:68, label:'Sunrise Café',    threat:'High', rating:4.5, dist:'390m', color:'#EF4444', d:700 },
  { x:20, y:30, label:'Quick Bites',     threat:'Low',  rating:3.1, dist:'470m', color:'#10B981', d:1050 },
]

const CW_STEPS = [
  { icon: 'mapPin',     label: 'Address resolved',     detail: '45 King St, Newtown NSW 2042' },
  { icon: 'navigation', label: 'Competitors scanned',  detail: '4 businesses within 500m' },
  { icon: 'users',      label: 'Demographics loaded',   detail: 'ABS — high income, young adults' },
  { icon: 'trendingUp', label: 'Financial model built', detail: 'Rent viability + break-even' },
  { icon: 'barChart',   label: 'Verdict generated',     detail: 'GO — score 82 / 100' },
]

export const CW_PHASE_META = [
  { step:'01', label:'Enter Address',   desc:'Type any Australian address. Add your business type, monthly rent and transaction value. Done in 60 seconds.' },
  { step:'02', label:'AI Analyses',     desc:'Locatalyze scans competitors, loads live demographics, calculates rent viability and builds your financial model — all in real time.' },
  { step:'03', label:'Get Your Report', desc:'Receive a clear GO, CAUTION or NO verdict with a full financial model, score breakdown, SWOT analysis and 3-year projection.' },
]

export default function CinematicWalkthrough() {
  const [phase, setPhase]        = useState(0)
  const [typed, setTyped]        = useState('')
  const [progress, setProgress]  = useState(0)
  const [stepsVisible, setSteps] = useState(0)
  const [scanLine, setScanLine]  = useState(0)
  const [pins, setPins]          = useState<number[]>([])
  const [scoreAnim, setScoreAnim]= useState(0)
  const [barsFired, setBarsFired]= useState(false)
  const [replay, setReplay]      = useState(0)
  const addr = '45 King St, Newtown NSW'

  useEffect(() => {
    let dead = false
    setPhase(0); setTyped(''); setProgress(0); setSteps(0)
    setScanLine(0); setPins([]); setScoreAnim(0); setBarsFired(false)

    const t1 = setTimeout(() => {
      if (dead) return; setPhase(1); let i = 0
      const ty = setInterval(() => {
        if (dead) { clearInterval(ty); return }
        i++; setTyped(addr.slice(0, i))
        if (i >= addr.length) {
          clearInterval(ty)
          const t2 = setTimeout(() => {
            if (dead) return; setPhase(2)
            let sl = 0
            const scan = setInterval(() => {
              if (dead) { clearInterval(scan); return }
              sl += 2; setScanLine(sl)
              if (sl >= 100) clearInterval(scan)
            }, 28)
            let p = 0
            const pr = setInterval(() => {
              if (dead) { clearInterval(pr); return }
              p += 1.4; setProgress(Math.min(p, 100))
              if (p >= 100) clearInterval(pr)
            }, 38)
            CW_STEPS.forEach((_, idx) => {
              setTimeout(() => { if (!dead) setSteps(idx + 1) }, 500 + idx * 520)
            })
            CW_PINS.forEach((pin, idx) => {
              setTimeout(() => { if (!dead) setPins(v => [...v, idx]) }, 400 + pin.d)
            })
            const t3 = setTimeout(() => {
              if (dead) return; setPhase(3); let s = 0
              const sa = setInterval(() => {
                if (dead) { clearInterval(sa); return }
                s += 2; setScoreAnim(Math.min(s, 82))
                if (s >= 82) { clearInterval(sa); setTimeout(() => { if (!dead) setBarsFired(true) }, 200) }
              }, 18)
            }, 3800)
            return () => { clearTimeout(t3) }
          }, 600)
          return () => { clearTimeout(t2) }
        }
      }, 65)
    }, 500)

    const rp = setTimeout(() => { if (!dead) setReplay(r => r + 1) }, 17000)
    return () => { dead = true; clearTimeout(t1); clearTimeout(rp) }
  }, [replay])

  const circ = 2 * Math.PI * 30
  const phaseIdx = phase === 0 || phase === 1 ? 0 : phase === 2 ? 1 : 2

  return (
    <div style={{ width: '100%', fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
        {CW_PHASE_META.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: phaseIdx === i ? L.emerald : phaseIdx > i ? L.emeraldLt : '#F1F5F9',
                border: phaseIdx === i ? `2px solid ${L.emerald}` : phaseIdx > i ? `2px solid ${L.emeraldLt}` : `2px solid ${L.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 900,
                color: phaseIdx === i ? '#fff' : phaseIdx > i ? L.emerald : L.muted,
                boxShadow: phaseIdx === i ? '0 4px 14px rgba(16,185,129,.35)' : 'none',
                transition: 'all .4s',
              }}>{phaseIdx > i ? '✓' : p.step}</div>
              <span style={{ fontSize: 11, fontWeight: phaseIdx === i ? 700 : 500, color: phaseIdx === i ? L.emerald : L.muted, whiteSpace: 'nowrap' as const }}>{p.label}</span>
            </div>
            {i < 2 && (
              <div style={{ width: 80, height: 2, margin: '0 6px', marginBottom: 18, background: phaseIdx > i ? L.emerald : L.border, transition: 'background .4s' }}/>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: L.white, borderRadius: 20, border: `1px solid ${L.border}`, boxShadow: '0 8px 48px rgba(0,0,0,.1)', overflow: 'hidden' }}>
        <div style={{ background: '#F8FAFC', borderBottom: `1px solid ${L.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#FF5F57','#FFBE2E','#27C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
          </div>
          <div style={{ flex: 1, background: L.border, borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
            <span style={{ fontSize: 11, color: L.muted }}>locatalyze.vercel.app/analyse</span>
          </div>
          {phase >= 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: L.emerald }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: L.emerald, display: 'inline-block', animation: phase === 2 ? 'pulse-dot .8s infinite' : 'none' }}/>
              {phase === 2 ? 'Analysing…' : 'Complete'}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340 }}>
          <div style={{ padding: '24px 24px', borderRight: `1px solid ${L.border}` }}>
            {phase <= 2 && (
              <div style={{ animation: 'cw-fade .3s ease' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 6 }}>Business Address</p>
                <div style={{ background: '#F8FAFC', border: `1.5px solid ${phase >= 1 ? L.emerald : L.border}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: L.slate, fontWeight: 500, minHeight: 38, display: 'flex', alignItems: 'center', gap: 2, marginBottom: 14, transition: 'border-color .3s' }}>
                  {typed || <span style={{ color: '#CBD5E1' }}>Enter your business address…</span>}
                  {phase === 1 && <span style={{ width: 2, height: 14, background: L.emerald, display: 'inline-block', animation: 'blink .7s infinite' }}/>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {[{l:'Business Type',v:'☕ Café'},{l:'Monthly Rent',v:'$3,800'}].map(f => (
                    <div key={f.l}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{f.l}</p>
                      <div style={{ background: '#F8FAFC', border: `1px solid ${L.border}`, borderRadius: 8, padding: '7px 10px', fontSize: 12, color: L.slate, fontWeight: 600 }}>
                        {phase >= 1 ? f.v : <span style={{ color: '#CBD5E1' }}>—</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {phase === 2 && (
                  <div style={{ animation: 'cw-fade .3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: L.muted }}>{CW_STEPS[Math.min(stepsVisible, CW_STEPS.length-1)]?.label}…</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: L.emerald }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ height: 6, background: L.emeraldXlt, borderRadius: 100, overflow: 'hidden', marginBottom: 16 }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${L.emerald},#34D399)`, borderRadius: 100, transition: 'width .1s linear' }}/>
                    </div>
                    {CW_STEPS.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, opacity: stepsVisible > i ? 1 : 0.28, transition: 'opacity .3s' }}>
                        <LI n={s.icon} size={15} color={stepsVisible > i ? L.emerald : L.muted}/>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: stepsVisible > i ? L.slate : L.muted }}>{s.label}</span>
                          {stepsVisible > i && <p style={{ fontSize: 10, color: L.muted, marginTop: 1 }}>{s.detail}</p>}
                        </div>
                        {stepsVisible > i && <span style={{ fontSize: 12, color: L.emerald, fontWeight: 800 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
                {phase === 1 && (
                  <div style={{ background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ fontSize: 12, color: L.emerald, fontWeight: 600 }}>✨ Add your address to begin your free analysis</p>
                  </div>
                )}
              </div>
            )}
            {phase === 3 && (
              <div style={{ animation: 'cw-fade .4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.goBg, color: L.go, border: `1.5px solid ${L.goBdr}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 800, marginBottom: 5 }}>✅ GO — Strong</div>
                    <p style={{ fontSize: 11, color: L.muted }}>45 King St, Newtown NSW</p>
                  </div>
                  <div style={{ position: 'relative', width: 64, height: 64 }}>
                    <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="32" cy="32" r="28" fill="none" stroke={L.emeraldLt} strokeWidth="6"/>
                      <circle cx="32" cy="32" r="28" fill="none" stroke={L.emerald} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={circ - circ * scoreAnim / 100}
                        style={{ transition: 'stroke-dashoffset .04s linear' }}/>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: L.emerald, lineHeight: 1 }}>{scoreAnim}</span>
                      <span style={{ fontSize: 8, color: L.muted }}>/100</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 14 }}>
                  {[{l:'Annual Profit',v:'$297,600',hi:true},{l:'Monthly Revenue',v:'$91,200',hi:false},{l:'Break-even',v:'38/day',hi:false},{l:'Payback Period',v:'7 months',hi:false}].map(m => (
                    <div key={m.l} style={{ background: m.hi ? L.emeraldXlt : '#F8FAFC', borderRadius: 8, border: `1px solid ${m.hi ? L.emeraldLt : L.border}`, padding: '8px 10px' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 2 }}>{m.l}</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: m.hi ? L.emerald : L.slate }}>{m.v}</p>
                    </div>
                  ))}
                </div>
                {[{l:'Demand',s:85},{l:'Rent Viability',s:78},{l:'Competition',s:72},{l:'Profitability',s:90}].map((b, i) => (
                  <div key={b.l} style={{ marginBottom: 7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: L.muted }}>{b.l}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: L.emerald }}>{b.s}</span>
                    </div>
                    <div style={{ height: 4, background: L.emeraldXlt, borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 100, background: L.emerald, width: barsFired ? `${b.s}%` : '0%', transition: `width 1s ease ${i * .12}s` }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative', background: '#EFF6EE', overflow: 'hidden', minHeight: 340 }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
              {[[22,26,22,23],[47,26,22,23],[22,51,22,23],[47,51,22,23],[0,0,18,24],[72,0,28,24],[0,76,18,24],[72,76,28,24],[0,26,18,23],[72,26,27,23],[0,51,18,23],[72,51,27,23]].map(([x,y,w,h],i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill="#D1FAE5" opacity=".75"/>
              ))}
              {[[0,25,100,25],[0,50,100,50],[0,75,100,75],[20,0,20,100],[45,0,45,100],[70,0,70,100]].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A7F3D0" strokeWidth=".6"/>
              ))}
              {phase === 2 && scanLine < 100 && (
                <rect x="0" y={scanLine - 4} width="100" height="8" fill="url(#cwScan)" opacity=".8"/>
              )}
              <defs>
                <linearGradient id="cwScan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0"/>
                  <stop offset="50%" stopColor="#10B981" stopOpacity=".55"/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>

            {phase <= 1 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', background: 'rgba(240,253,244,.5)', backdropFilter: 'blur(2px)' }}>
                <div style={{ marginBottom: 8 }}><LI n="map" size={36} color={L.muted}/></div>
                <p style={{ fontSize: 13, fontWeight: 600, color: L.muted }}>Map loads after address entry</p>
              </div>
            )}
            {phase >= 2 && (
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,.92)', borderRadius: 8, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: L.slate, backdropFilter: 'blur(4px)', border: `1px solid ${L.border}`, zIndex: 5 }}>
                📍 Newtown NSW 2042
              </div>
            )}
            {phase === 2 && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: L.emerald, color: '#fff', borderRadius: 8, padding: '3px 10px', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, zIndex: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse-dot .8s infinite' }}/>
                Scanning…
              </div>
            )}
            {phase === 3 && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: '#fff', color: L.slate, borderRadius: 8, padding: '3px 10px', fontSize: 10, fontWeight: 700, border: `1px solid ${L.border}`, boxShadow: '0 2px 8px rgba(0,0,0,.08)', zIndex: 5 }}>
                {CW_PINS.length} competitors mapped
              </div>
            )}
            {phase >= 2 && (
              <div style={{ position: 'absolute', left: '45%', top: '52%', transform: 'translate(-50%,-50%)', width: 140, height: 140, borderRadius: '50%', border: '1.5px dashed rgba(16,185,129,.45)', background: 'rgba(16,185,129,.04)', animation: 'ring-in .5s ease', pointerEvents: 'none', zIndex: 3 }}/>
            )}
            {phase >= 2 && CW_PINS.map((c, i) => pins.includes(i) && (
              <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-100%)', animation: 'pin-drop .35s cubic-bezier(.175,.885,.32,1.275) both', zIndex: 4 }}>
                <div style={{ position: 'relative', width: 20, height: 20 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50% 50% 50% 0', background: c.color, transform: 'rotate(-45deg)', border: '2px solid #fff', boxShadow: `0 2px 8px ${c.color}60` }}/>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 900 }}>
                    {c.threat==='High'?'!':c.threat==='Med'?'~':'✓'}
                  </div>
                </div>
              </div>
            ))}
            {phase >= 2 && (
              <div style={{ position: 'absolute', left: '45%', top: '52%', transform: 'translate(-50%,-100%)', animation: 'pin-drop .4s cubic-bezier(.175,.885,.32,1.275) both', zIndex: 6 }}>
                <div style={{ position: 'relative', width: 24, height: 24 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50% 50% 50% 0', background: L.emerald, transform: 'rotate(-45deg)', border: '2.5px solid #fff', boxShadow: `0 3px 12px rgba(16,185,129,.5)` }}/>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>📍</div>
                </div>
                <div style={{ marginTop: 2, background: L.emerald, color: '#fff', borderRadius: 5, padding: '1px 6px', fontSize: 8, fontWeight: 800, textAlign: 'center' as const }}>You</div>
              </div>
            )}
            {phase === 3 && (
              <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(255,255,255,.94)', borderRadius: 10, padding: '8px 12px', display: 'flex', gap: 12, backdropFilter: 'blur(4px)', border: `1px solid ${L.border}`, zIndex: 5 }}>
                {[{c:'#EF4444',l:'High (2)'},{c:'#F59E0B',l:'Medium (1)'},{c:'#10B981',l:'Low (1)'}].map(item => (
                  <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.c }}/>
                    <span style={{ fontSize: 10, color: L.muted }}>{item.l}</span>
                  </div>
                ))}
                <span style={{ fontSize: 10, color: L.muted, marginLeft: 'auto' }}>500m radius</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, color: '#94A3B8', zIndex: 2 }}>Locatalyze Maps</div>
          </div>
        </div>

        <div style={{ height: 3, background: L.border }}>
          <div style={{ height: '100%', background: L.emerald, transition: 'width .3s ease', width: phase === 0 ? '0%' : phase === 1 ? '33%' : phase === 2 ? '66%' : '100%' }}/>
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {CW_PHASE_META.map((p, i) => (
          <div key={i} style={{ padding: '18px 20px', borderRadius: 16, background: phaseIdx === i ? L.emeraldXlt : '#F8FAFC', border: `1.5px solid ${phaseIdx === i ? L.emeraldLt : L.border}`, transition: 'all .4s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: phaseIdx === i ? L.emerald : L.border, color: phaseIdx === i ? '#fff' : L.muted, fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .4s' }}>{p.step}</div>
              <span style={{ fontSize: 13, fontWeight: 800, color: phaseIdx === i ? L.emerald : L.slate }}>{p.label}</span>
            </div>
            <p style={{ fontSize: 12.5, color: L.muted, lineHeight: 1.65 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes cw-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pin-drop { from{opacity:0;transform:translate(-50%,-80%) scale(.5)} to{opacity:1;transform:translate(-50%,-100%) scale(1)} }
        @keyframes ring-in { from{opacity:0;transform:translate(-50%,-50%) scale(.6)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
      `}</style>
    </div>
  )
}
