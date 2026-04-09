'use client'
import { useState, useEffect, useRef } from 'react'
import { L, font } from './tokens'

const RP_CASES = [
 {
    id: 0,
    biz: 'Specialty Coffee Shop', emoji: '', location: 'Subiaco WA 6008',
  verdict: 'GO', verdictSub: 'Strong Opportunity',
  score: 82, scoreLabel: 'Feasibility Score',
  color: '#059669', colorLight: '#ECFDF5', colorMid: '#A7F3D0',
  gradHeader: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)',
  metrics: [
      { l: 'Est. revenue range', v: '$68k–$84k/mo', highlight: false },
   { l: 'Break-even (est.)', v: '35–50/day', highlight: false },
   { l: 'Break-even',    v: '38/day',  highlight: false },
      { l: 'Note', v: 'Estimate only', highlight: true },
  ],
    tags: ['High Income Area', 'Low Competition', '500m Radius Checked'],
  snap: [{ l: 'Demand', v: 85 }, { l: 'Rent Fit', v: 78 }, { l: 'Comp.', v: 72 }],
 },
  {
    id: 1,
    biz: 'Casual Dining Restaurant', emoji: '', location: 'Fremantle WA 6160',
  verdict: 'CAUTION', verdictSub: 'Proceed Carefully',
  score: 61, scoreLabel: 'Feasibility Score',
  color: '#D97706', colorLight: '#FFFBEB', colorMid: '#FDE68A',
  gradHeader: 'linear-gradient(135deg, #451A03 0%, #78350F 40%, #B45309 100%)',
  metrics: [
      { l: 'Est. revenue range', v: '$45k–$80k/mo', highlight: false },
   { l: 'Monthly Revenue', v: '$74,400', highlight: false },
      { l: 'Break-even',    v: '52/day',  highlight: false },
      { l: 'Note', v: 'Estimate only', highlight: true },
  ],
    tags: ['Seasonal Risk', 'High Competition', 'Review Financials'],
  snap: [{ l: 'Demand', v: 68 }, { l: 'Rent Fit', v: 55 }, { l: 'Comp.', v: 60 }],
 },
  {
    id: 2,
    biz: 'Boutique Gym', emoji: '', location: 'Joondalup WA 6027',
  verdict: 'NO', verdictSub: 'Not Recommended',
  score: 44, scoreLabel: 'Feasibility Score',
  color: '#DC2626', colorLight: '#FEF2F2', colorMid: '#FECACA',
  gradHeader: 'linear-gradient(135deg, #2D0000 0%, #7F1D1D 40%, #991B1B 100%)',
  metrics: [
      { l: 'Est. revenue range', v: '$30k–$55k/mo', highlight: false },
   { l: 'Monthly Revenue', v: '$51,000', highlight: false },
      { l: 'Break-even',    v: '74/day',  highlight: false },
      { l: 'Note', v: 'High risk', highlight: true },
  ],
    tags: ['Oversaturated', 'Rent Too High', 'Not Viable'],
  snap: [{ l: 'Demand', v: 48 }, { l: 'Rent Fit', v: 38 }, { l: 'Comp.', v: 42 }],
 },
]

export default function ReportPreview() {
  const [caseIdx, setCaseIdx]   = useState(0)
  const [animKey, setAnimKey]   = useState(0)
  const [score, setScore]       = useState(0)
  const [snapping, setSnapping] = useState(false)
  const [visible, setVisible]   = useState(false)
  const containerRef            = useRef<HTMLDivElement>(null)

  // Only start animations when component is visible on screen
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const switchTo = (i: number) => {
    setSnapping(true)
    setTimeout(() => {
      setCaseIdx(i); setAnimKey(k => k + 1)
      setSnapping(false)
    }, 200)
  }

  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => switchTo((caseIdx + 1) % RP_CASES.length), 4800)
    return () => clearInterval(t)
  }, [caseIdx, visible])

  useEffect(() => {
    // Gate on visible — prevents 0/100 flash when component is above the fold on mount
    if (!visible) { setScore(0); return }
    setScore(0)
    // Small delay so first render paints at score=0 with opacity:0, avoiding flash
    const delay = setTimeout(() => {
      const target = RP_CASES[caseIdx].score
      let s = 0
      const id = setInterval(() => {
        s = Math.min(s + 2, target)
        setScore(s)
        if (s >= target) clearInterval(id)
      }, 14)
    }, 50)
    return () => clearTimeout(delay)
  }, [animKey, visible])

  const c   = RP_CASES[caseIdx]
  const r   = 34
  const cir = 2 * Math.PI * r
  const vIcon = c.verdict === 'GO' ? '' : c.verdict === 'CAUTION' ? '' : '✕'

 return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: 460, fontFamily: font }}>
   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
    {RP_CASES.map((cs, i) => (
          <button key={i} onClick={() => switchTo(i)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 12px 5px 8px', borderRadius: 100, border: 'none', cursor: 'pointer',
      fontFamily: font, fontSize: 11, fontWeight: i === caseIdx ? 700 : 500,
            background: i === caseIdx ? cs.color : '#F1F5F9',
      color: i === caseIdx ? '#fff' : L.muted,
      transition: 'all .22s',
      boxShadow: i === caseIdx ? `0 3px 12px ${cs.color}55` : 'none',
     }}>
            <span style={{ fontSize: 14 }}>{cs.emoji}</span>
            <span>{cs.verdict}</span>
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: L.emerald, animation: 'pulse-dot 2s infinite' }}/>
    <span style={{ fontSize: 10, color: L.muted }}>Live demo</span>
      </div>

      <div style={{
        borderRadius: 22, overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0,0,0,.15), 0 4px 16px rgba(0,0,0,.08)',
    opacity: snapping ? 0 : 1, transform: snapping ? 'translateY(6px) scale(.99)' : 'translateY(0) scale(1)',
    transition: 'opacity .2s, transform .2s',
   }}>
        <div style={{ background: c.gradHeader, padding: '22px 22px 18px', position: 'relative', overflow: 'hidden' }}>
     <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', border:'1px solid rgba(255,255,255,.07)', pointerEvents:'none' }}/>
     <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', border:'1px solid rgba(255,255,255,.05)', pointerEvents:'none' }}/>
     <div style={{ position:'relative', zIndex:2 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
       <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <div style={{ width:22, height:22, borderRadius:6, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff' }}>L</div>
        <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:'.03em' }}>Locatalyze Report</span>
       </div>
              <span style={{ fontSize:10, color:'rgba(255,255,255,.35)', background:'rgba(255,255,255,.08)', borderRadius:6, padding:'2px 8px' }}>
        {new Date().toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}
       </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
       <span style={{ fontSize:22, textAlign: 'center', width: 28 }}>{c.emoji}</span>
              <div>
                <p style={{ fontSize:16, fontWeight:900, color:'#fff', letterSpacing:'-.02em', lineHeight:1.1 }}>{c.biz}</p>
        <p style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:2 }}> {c.location}</p>
       </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
       <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:c.colorLight, border:`2px solid ${c.colorMid}`, borderRadius:14, padding:'8px 16px' }}>
        <span style={{ fontSize:20 }}>{vIcon}</span>
                <div>
                  <p style={{ fontSize:17, fontWeight:900, color:c.color, lineHeight:1 }}>{c.verdict}</p>
                  <p style={{ fontSize:9.5, color:c.color, opacity:.75, marginTop:1 }}>{c.verdictSub}</p>
                </div>
              </div>
              <div style={{ textAlign:'center' as const, opacity: score > 0 ? 1 : 0, transition: 'opacity 0.2s' }}>
        <div style={{ position:'relative', width:74, height:74 }}>
         <svg width="74" height="74" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="37" cy="37" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="6"/>
          <circle cx="37" cy="37" r={r} fill="none" stroke={c.color} strokeWidth="6"
           strokeLinecap="round" strokeDasharray={cir}
           strokeDashoffset={cir - cir * score / 100}
                      style={{ transition:'stroke-dashoffset .03s linear', filter:`drop-shadow(0 0 5px ${c.color}bb)` }}/>
         </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:20, fontWeight:900, color:'#fff', lineHeight:1 }}>{score}</span>
          <span style={{ fontSize:8, color:'rgba(255,255,255,.4)' }}>/100</span>
         </div>
                </div>
                <p style={{ fontSize:9, color:'rgba(255,255,255,.3)', marginTop:2 }}>{c.scoreLabel}</p>
       </div>
            </div>
          </div>
        </div>

        <div style={{ background:'#fff' }}>
     <div style={{ padding:'12px 20px 0', display:'flex', gap:6, flexWrap:'wrap' as const }}>
      {c.tags.map(t => (
              <span key={t} style={{ fontSize:10, fontWeight:700, color:c.color, background:c.colorLight, border:`1px solid ${c.colorMid}`, borderRadius:6, padding:'2px 8px' }}>{t}</span>
      ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:L.border, margin:'12px 0 0', borderTop:`1px solid ${L.border}` }}>
      {c.metrics.map((m, i) => (
              <div key={i} style={{ background: m.highlight ? c.colorLight : '#fff', padding:'12px 16px' }}>
        <p style={{ fontSize:9, fontWeight:700, color:L.muted, textTransform:'uppercase' as const, letterSpacing:'.07em', marginBottom:4 }}>{m.l}</p>
        <p style={{ fontSize:17, fontWeight:900, color: m.highlight ? c.color : L.slate, letterSpacing:'-.02em', lineHeight:1 }}>{m.v}</p>
       </div>
            ))}
          </div>
          <div style={{ padding:'12px 20px 16px', display:'flex', gap:12 }}>
      {c.snap.map((s, i) => (
              <div key={i} style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
         <span style={{ fontSize:9, color:L.muted, fontWeight:600 }}>{s.l}</span>
                  <span style={{ fontSize:9, fontWeight:800, color:c.color }}>{s.v}</span>
                </div>
                <div style={{ height:4, background:'#F1F5F9', borderRadius:100, overflow:'hidden' }}>
         <div style={{ height:'100%', width:`${s.v}%`, borderRadius:100, background:c.color, opacity:.8 }}/>
        </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#F8FAFC', borderTop:`1px solid ${L.border}`, padding:'10px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
     <span style={{ fontSize:10, color:L.muted }}>Based on live data · Australian addresses only</span>
          <span style={{ fontSize:10, fontWeight:700, color:c.color }}>View full report →</span>
        </div>
      </div>

      <div style={{ height:2, background:L.border, borderRadius:100, marginTop:12, overflow:'hidden' }}>
    <div key={animKey} style={{ height:'100%', background:c.color, borderRadius:100, animation:'rp-bar 4.8s linear both' }}/>
   </div>
      <style>{`@keyframes rp-bar { from{width:0%} to{width:100%} }`}</style>
    </div>
  )
}