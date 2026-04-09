'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { L, font, LI } from './tokens'

const PR_DATA = {
 go: {
    biz: 'Specialty Coffee Shop', location: 'Subiaco, WA', suburb: 'High-income inner suburb', verdict: 'GO', score: 82,
  verdictColor: '#059669', verdictBg: '#ECFDF5', verdictBorder: '#A7F3D0',
  accentGrad: 'linear-gradient(135deg,#059669 0%,#10B981 100%)',
  kpis: [
      { label: 'Est. monthly revenue', value: '$68k–$84k', sub: 'range estimate', up: true },
   { label: 'Monthly Profit',  value: '$24,800', sub: '27% margin',    up: true  },
      { label: 'Est. annual revenue', value: '$816k–$1.0m', sub: 'range estimate', up: true },
   { label: 'Break-even (est.)',  value: '35–50/day',  sub: 'assumptions-based', up: true },
  ],
    revenue: [58, 67, 74, 80, 86, 91],
    profit:  [10, 14, 17, 21, 23, 25],
    scores: [
      { label: 'Foot Traffic & Demand', score: 85, icon: 'activity' },
   { label: 'Rent Affordability',  score: 78, icon: 'home' },
   { label: 'Competition Level',   score: 72, icon: 'target' },
   { label: 'Profitability',     score: 90, icon: 'trendingUp' },
  ],
    heatmap: [8,6,5,7,9,8,7, 4,3,2,4,6,5,4, 6,5,4,6,8,7,6, 5,4,3,5,7,6,5, 7,6,5,7,9,8,7],
    swot: {
      strengths:     ['High foot traffic from young professionals', 'Affluent demographics — avg income $95k+', 'Underserved specialty coffee segment'],
   weaknesses:    ['Competitive market with 3 established chains', 'High commercial rent at $3,800/mo'],
   opportunities: ['Growing café culture in WA', 'Weekend brunch market largely untapped'],
   threats:       ['Large chain expansion into the area', 'Rising commercial rent prices YoY'],
  },
    rec: 'Strong directional signal. Low competitor density and above-average income demographics. Warrants in-person validation before committing to a lease.',
 },
  caution: {
    biz: 'Casual Dining Restaurant', location: 'Fremantle, WA', suburb: 'Tourist & mixed-use precinct', verdict: 'CAUTION', score: 61,
  verdictColor: '#D97706', verdictBg: '#FFFBEB', verdictBorder: '#FDE68A',
  accentGrad: 'linear-gradient(135deg,#B45309 0%,#D97706 100%)',
  kpis: [
      { label: 'Monthly Revenue', value: '$74,400', sub: '-8% vs benchmark', up: false },
      { label: 'Monthly Profit',  value: '$11,200', sub: '15% margin',    up: false },
      { label: 'Est. annual revenue', value: '$480k–$720k', sub: 'range estimate', up: false },
   { label: 'Break-even (est.)',  value: '60–80/day',  sub: 'higher risk', up: false },
  ],
    revenue: [42, 55, 68, 74, 70, 74],
    profit:  [4,  8,  12, 11, 9,  11],
    scores: [
      { label: 'Foot Traffic & Demand', score: 68, icon: 'activity' },
   { label: 'Rent Affordability',  score: 55, icon: 'home' },
   { label: 'Competition Level',   score: 60, icon: 'target' },
   { label: 'Profitability',     score: 62, icon: 'trendingUp' },
  ],
    heatmap: [7,8,9,8,6,4,3, 3,4,5,5,4,3,2, 5,6,7,7,5,4,3, 4,5,6,6,4,3,2, 6,7,8,8,6,4,3],
    swot: {
      strengths:     ['High tourist foot traffic in peak season', 'Strong weekend dining culture'],
   weaknesses:    ['Heavy seasonal demand fluctuation', 'High rent at $5,200/mo vs revenue'],
   opportunities: ['Underserved dinner market on weekdays', 'Coastal dining experience premium'],
   threats:       ['8 direct competitors within 500m', 'Off-season revenue drop risk'],
  },
    rec: 'Proceed with caution. Strong peak-season potential is undermined by significant seasonal dependency. Consider a lean operating model to protect against off-season periods.',
 },
  no: {
    biz: 'Boutique Gym', location: 'Joondalup, WA', suburb: 'Outer suburban residential', verdict: 'NO', score: 44,
  verdictColor: '#DC2626', verdictBg: '#FEF2F2', verdictBorder: '#FECACA',
  accentGrad: 'linear-gradient(135deg,#991B1B 0%,#DC2626 100%)',
  kpis: [
      { label: 'Monthly Revenue', value: '$51,000', sub: '-38% vs benchmark', up: false },
      { label: 'Monthly Profit',  value: '$3,200',  sub: '6% margin',     up: false },
      { label: 'Est. annual revenue', value: '$300k–$480k', sub: 'range estimate', up: false },
   { label: 'Break-even (est.)',  value: '80–100/day', sub: 'very high risk', up: false },
  ],
    revenue: [38, 42, 46, 50, 51, 51],
    profit:  [1,  1,  2,  3,  3,  3],
    scores: [
      { label: 'Foot Traffic & Demand', score: 48, icon: 'activity' },
   { label: 'Rent Affordability',  score: 38, icon: 'home' },
   { label: 'Competition Level',   score: 42, icon: 'target' },
   { label: 'Profitability',     score: 46, icon: 'trendingUp' },
  ],
    heatmap: [3,2,1,2,3,2,1, 2,1,1,1,2,2,1, 4,3,2,3,4,3,2, 3,2,1,2,3,2,1, 2,1,1,2,2,2,1],
    swot: {
      strengths:     ['Large 15km residential catchment', 'No specialist CrossFit within 2km'],
   weaknesses:    ['4 established gyms already within 1km', 'Rent at $6,800/mo consumes 34% revenue'],
   opportunities: ['Underserved women-only fitness niche', 'Corporate wellness contracts potential'],
   threats:       ['Planet Fitness opening 800m away Q3', 'Membership churn risk in saturated market'],
  },
    rec: 'Not recommended. The location is oversaturated with established fitness competitors and rent far exceeds safe thresholds. Without a highly differentiated concept, financial viability is unlikely.',
 },
}

function ScoreRing({ score, color, size = 72, fired = false }: { score: number; color: string; size?: number; fired?: boolean }) {
  const [anim, setAnim] = useState(0)
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  useEffect(() => {
    if (!fired) { setAnim(0); return }
    setAnim(0)
    const id = setInterval(() => setAnim(a => { if (a >= score) { clearInterval(id); return score }; return a + 2 }), 14)
    return () => clearInterval(id)
  }, [score, fired])
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
   <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={size*0.07}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07}
     strokeLinecap="round" strokeDasharray={circ}
     strokeDashoffset={circ - circ * anim / 100}
          style={{ transition: 'stroke-dashoffset .03s linear' }}/>
   </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ fontSize: size * 0.24, fontWeight: 900, color, lineHeight: 1 }}>{anim}</span>
        <span style={{ fontSize: size * 0.115, color: L.muted, marginTop: 1 }}>/100</span>
      </div>
    </div>
  )
}

function RevenueChart({ revenue, profit, color }: { revenue: number[]; profit: number[]; color: string }) {
  const [fired, setFired] = useState(false)
  useEffect(() => { setFired(false); const t = setTimeout(() => setFired(true), 80); return () => clearTimeout(t) }, [revenue])
  const months = ['Jul','Aug','Sep','Oct','Nov','Dec']
 const maxR = Math.max(...revenue)
  const W = 340, H = 100, padL = 32, padB = 20, padT = 8
  const bW = (W - padL) / revenue.length - 6
  const pts = profit.map((v, i) => {
    const x = padL + i * ((W - padL) / revenue.length) + bW / 2
    const y = padT + (H - padT - padB) * (1 - v / maxR)
    return `${x},${y}`
  })
  const linePath = 'M ' + pts.join(' L ')
 return (
    <div style={{ position: 'relative' }}>
   <svg viewBox={`0 0 ${W} ${H + padB}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
    {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={padL} y1={padT + (H - padT - padB) * (1 - f)} x2={W} y2={padT + (H - padT - padB) * (1 - f)}
            stroke={L.border} strokeWidth=".8" strokeDasharray="4 3"/>
    ))}
        {revenue.map((v, i) => {
          const x = padL + i * ((W - padL) / revenue.length) + 3
          const barH = (H - padT - padB) * (v / maxR)
          const y = padT + (H - padT - padB) - barH
          return (
            <rect key={i} x={x} y={fired ? y : padT + H - padT - padB} width={bW}
              height={fired ? barH : 0} rx="4"
       fill={`${color}22`} stroke={`${color}44`} strokeWidth=".8"
       style={{ transition: `height .6s ease ${i * .07}s, y .6s ease ${i * .07}s` }}/>
          )
        })}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
     strokeDasharray="400" strokeDashoffset={fired ? '0' : '400'}
     style={{ transition: 'stroke-dashoffset 1.2s ease .3s' }}/>
    {profit.map((v, i) => {
          const x = padL + i * ((W - padL) / revenue.length) + bW / 2
          const y = padT + (H - padT - padB) * (1 - v / maxR)
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke={color} strokeWidth="2"
      opacity={fired ? 1 : 0} style={{ transition: `opacity .2s ease ${.8 + i * .07}s` }}/>
        })}
        {months.map((m, i) => (
          <text key={m} x={padL + i * ((W - padL) / revenue.length) + bW / 2} y={H + padB - 2}
            textAnchor="middle" fontSize="9" fill={L.muted}>{m}</text>
    ))}
        {[0, 50, 100].map(v => (
          <text key={v} x={padL - 4} y={padT + (H - padT - padB) * (1 - v / maxR) + 3}
            textAnchor="end" fontSize="8" fill={L.muted}>{v > 0 ? `$${v}k` : ''}</text>
    ))}
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
     <div style={{ width: 10, height: 10, borderRadius: 2, background: `${color}33`, border: `1px solid ${color}55` }}/>
          <span style={{ fontSize: 10, color: L.muted }}>Monthly Revenue ($k)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
     <div style={{ width: 16, height: 2, background: color, borderRadius: 2 }}/>
          <span style={{ fontSize: 10, color: L.muted }}>Monthly Profit ($k)</span>
        </div>
      </div>
    </div>
  )
}

function DemandHeatmap({ data, color }: { data: number[]; color: string }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
 const times = ['Morning','Midday','Arvo','Evening','Night']
 const max = Math.max(...data)
  const [hov, setHov] = useState<number|null>(null)
  return (
    <div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 4, paddingLeft: 38 }}>
    {days.map(d => <div key={d} style={{ flex: 1, fontSize: 8, color: L.muted, textAlign: 'center' as const, fontWeight: 600 }}>{d}</div>)}
   </div>
      {times.map((t, ti) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
     <div style={{ width: 34, fontSize: 8, color: L.muted, textAlign: 'right' as const, paddingRight: 4, fontWeight: 600, flexShrink: 0 }}>{t}</div>
     {days.map((_, di) => {
            const idx = ti * 7 + di
            const v = data[idx] || 0
            const intensity = v / max
            return (
              <div key={di} onMouseEnter={() => setHov(idx)} onMouseLeave={() => setHov(null)}
                style={{ flex: 1, height: 18, borderRadius: 4, cursor: 'default',
         background: intensity > 0.7 ? color : intensity > 0.4 ? `${color}88` : intensity > 0.2 ? `${color}44` : `${color}18`,
                  transition: 'transform .15s', transform: hov === idx ? 'scale(1.25)' : 'scale(1)',
         position: 'relative' as const,
        }}/>
            )
          })}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
    <span style={{ fontSize: 9, color: L.muted }}>Low</span>
        {[0.15, 0.35, 0.55, 0.75, 1].map(f => (
          <div key={f} style={{ width: 14, height: 10, borderRadius: 3, background: f > 0.7 ? color : f > 0.4 ? `${color}88` : f > 0.2 ? `${color}44` : `${color}18` }}/>
        ))}
        <span style={{ fontSize: 9, color: L.muted }}>High</span>
      </div>
    </div>
  )
}

function PremiumBar({ label, score, color, icon, delay = 0, fired }: { label: string; score: number; color: string; icon: string; delay?: number; fired: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
     <LI n={icon} size={16} color={color}/>
          <span style={{ fontSize: 12.5, color: L.slate, fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
     <span style={{ fontSize: 13, fontWeight: 800, color }}>{score}</span>
          <span style={{ fontSize: 10, color: L.muted }}>/100</span>
        </div>
      </div>
      <div style={{ height: 8, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden' }}>
    <div style={{
          height: '100%', borderRadius: 100,
     background: `linear-gradient(90deg, ${color}cc, ${color})`,
          width: fired ? `${score}%` : '0%',
     transition: `width 1s cubic-bezier(.4,0,.2,1) ${delay}s`,
          boxShadow: `0 0 8px ${color}55`,
        }}/>
      </div>
    </div>
  )
}

function SwotGrid({ swot }: { swot: typeof PR_DATA.go.swot }) {
  const quadrants = [
    { key: 'strengths',   label: 'Strengths',   bg: '#F0FDF4', border: '#BBF7D0', text: '#065F46', dot: '#059669' },
    { key: 'weaknesses',  label: 'Weaknesses',  bg: '#FFFBEB', border: '#FDE68A', text: '#78350F', dot: '#D97706' },
    { key: 'opportunities', label: 'Opportunities', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E3A8A', dot: '#3B82F6' },
    { key: 'threats',    label: 'Threats',    bg: '#FEF2F2', border: '#FECACA', text: '#7F1D1D', dot: '#DC2626' },
 ] as const
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
   {quadrants.map(q => (
        <div key={q.key} style={{ background: q.bg, border: `1.5px solid ${q.border}`, borderRadius: 14, padding: '14px 16px', transition: 'transform .2s, box-shadow .2s' }}
     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.08)' }}
     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: q.dot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /></div>
      <span style={{ fontSize: 11, fontWeight: 800, color: q.text, textTransform: 'uppercase' as const, letterSpacing: '.07em' }}>{q.label}</span>
     </div>
          {(swot[q.key] as string[]).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
       <div style={{ width: 5, height: 5, borderRadius: '50%', background: q.dot, marginTop: 5, flexShrink: 0 }}/>
       <p style={{ fontSize: 11.5, color: q.text, lineHeight: 1.55 }}>{item}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function PremiumReport({ verdict, isMobile }: { verdict: 'go' | 'caution' | 'no'; isMobile: boolean }) {
 const d = PR_DATA[verdict]
  const [barsFired, setBarsFired] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'financials' | 'market' | 'swot'>('overview')
 const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBarsFired(false)
    setActiveSection('overview')
 }, [verdict])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setBarsFired(true), 100) } },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: 'barChart'  },
    { id: 'financials', label: 'Financials', icon: 'lineChart' },
    { id: 'market',   label: 'Market',   icon: 'map'    },
    { id: 'swot',    label: 'SWOT',    icon: 'zap'    },
  ] as const

  return (
    <div ref={containerRef} style={{ background: L.white, borderRadius: 24, border: `1px solid ${L.border}`, boxShadow: '0 16px 64px rgba(0,0,0,.1)', overflow: 'hidden', fontFamily: font }}>
   <div style={{ background: `linear-gradient(135deg, #0C1F1C 0%, #0F766E 60%, #0891B2 100%)`, padding: isMobile ? '24px 20px' : '32px 40px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }}/>
    <div style={{ position: 'absolute', bottom: -20, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }}/>
    <div style={{ position: 'relative', zIndex: 2 }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.12)', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
       <LI n="mapPin" size={11} color='rgba(255,255,255,.8)'/> {d.location}
      </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.08)', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>
        {d.suburb}
            </div>
            <div style={{ marginLeft: 'auto' as const, background: 'rgba(255,255,255,.1)', borderRadius: 8, padding: '3px 10px', fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>
       {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 20 }}>
      <div>
              <h3 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color: '#fff', letterSpacing: '-.03em', marginBottom: 12, lineHeight: 1.1 }}>{d.biz}</h3>
       <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: d.verdictBg, border: `2px solid ${d.verdictBorder}`, borderRadius: 14, padding: '8px 18px' }}>
        <span style={{ display: 'inline-flex' }}>{verdict === 'go' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={d.verdictColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : verdict === 'caution' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={d.verdictColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={d.verdictColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}</span>
        <div>
                  <p style={{ fontSize: 16, fontWeight: 900, color: d.verdictColor, lineHeight: 1 }}>{d.verdict}</p>
                  <p style={{ fontSize: 10, color: d.verdictColor, opacity: 0.75, marginTop: 1 }}>Location Verdict</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' as const }}>
       <div style={{ textAlign: 'center' as const }}>
        <ScoreRing score={d.score} color={d.verdictColor} size={isMobile ? 68 : 84} fired={barsFired}/>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>Feasibility Score</p>
       </div>
              {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
         {d.kpis.slice(0, 2).map(k => (
                    <div key={k.label} style={{ background: 'rgba(255,255,255,.1)', borderRadius: 10, padding: '8px 16px', backdropFilter: 'blur(4px)' }}>
           <p style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 2 }}>{k.label}</p>
           <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{k.value}</p>
          </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: `1px solid ${L.border}`, background: '#FAFBFC', overflowX: 'auto' as const }}>
    {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)}
            style={{ flex: isMobile ? 'none' : 1, padding: isMobile ? '12px 16px' : '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: activeSection === t.id ? 700 : 500, color: activeSection === t.id ? d.verdictColor : L.muted, borderBottom: `2px solid ${activeSection === t.id ? d.verdictColor : 'transparent'}`, whiteSpace: 'nowrap' as const, transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <LI n={t.icon} size={14} color={activeSection === t.id ? d.verdictColor : L.muted}/>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ margin: '20px 24px 0', background: d.verdictBg, border: `1px solid ${d.verdictBorder}`, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <div style={{ width: 28, height: 28, borderRadius: 8, background: d.verdictColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
     <LI n="lightbulb" size={14} color="#fff"/>
    </div>
        <p style={{ fontSize: 13, color: d.verdictColor, lineHeight: 1.65 }}><strong>AI Analysis:</strong> {d.rec}</p>
      </div>

      <div style={{ padding: isMobile ? '20px 16px' : '24px 24px 32px' }}>
    {activeSection === 'overview' && (
     <div style={{ animation: 'cw-fade .3s ease' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 12 }}>Key Metrics</p>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
       {d.kpis.map((k, i) => (
                <div key={i} style={{ background: i === 2 ? d.verdictBg : '#F8FAFC', borderRadius: 14, border: `1.5px solid ${i === 2 ? d.verdictBorder : L.border}`, padding: '14px 16px', transition: 'transform .2s, box-shadow .2s', cursor: 'default' }}
         onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0,0,0,.08)' }}
         onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
         <p style={{ fontSize: 9, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 6 }}>{k.label}</p>
         <p style={{ fontSize: isMobile ? 15 : 18, fontWeight: 900, color: i === 2 ? d.verdictColor : L.slate, letterSpacing: '-.02em', lineHeight: 1, marginBottom: 4 }}>{k.value}</p>
         <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: k.up ? '#059669' : '#DC2626' }}>{k.up ? '↑' : '↓'}</span>
          <span style={{ fontSize: 9, color: L.muted }}>{k.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 14 }}>Score Breakdown</p>
      <div style={{ background: '#FAFBFC', borderRadius: 16, border: `1px solid ${L.border}`, padding: '18px 20px' }}>
       {d.scores.map((s, i) => (
                <PremiumBar key={i} label={s.label} score={s.score} color={d.verdictColor} icon={s.icon} delay={i * 0.1} fired={barsFired}/>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'financials' && (
     <div style={{ animation: 'cw-fade .3s ease' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 14 }}>6-Month Revenue & Profit Projection</p>
      <div style={{ background: '#FAFBFC', borderRadius: 16, border: `1px solid ${L.border}`, padding: '20px' }}>
       <RevenueChart revenue={d.revenue} profit={d.profit} color={d.verdictColor}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginTop: 20 }}>
       <div style={{ background: '#FAFBFC', borderRadius: 14, border: `1px solid ${L.border}`, padding: '16px 18px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12 }}>Break-Even Analysis</p>
        {[['Daily customers needed', verdict === 'go' ? '38' : verdict === 'caution' ? '52' : '74'],
         ['Avg. transaction value', verdict === 'go' ? '$8.50' : verdict === 'caution' ? '$42' : '$55'],
         ['Fixed costs / month', verdict === 'go' ? '$14,200' : verdict === 'caution' ? '$18,600' : '$22,400'],
         ['Variable cost ratio', verdict === 'go' ? '38%' : verdict === 'caution' ? '42%' : '48%'],
        ].map(([l, v]) => (
                  <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${L.border}` }}>
          <span style={{ fontSize: 12, color: L.muted }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: L.slate }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#FAFBFC', borderRadius: 14, border: `1px solid ${L.border}`, padding: '16px 18px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12 }}>3-Year Outlook</p>
        {[['Year 1 Revenue', verdict === 'go' ? '$1.09M' : verdict === 'caution' ? '$893k' : '$612k'],
         ['Year 2 Revenue', verdict === 'go' ? '$1.31M' : verdict === 'caution' ? '$982k' : '$637k'],
         ['Year 3 Revenue', verdict === 'go' ? '$1.48M' : verdict === 'caution' ? '$1.04M' : '$651k'],
         ['3-Year Total Profit', verdict === 'go' ? '$1.04M' : verdict === 'caution' ? '$452k' : '$89k'],
        ].map(([l, v], i) => (
                  <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${L.border}` }}>
          <span style={{ fontSize: 12, color: L.muted }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: i === 3 ? d.verdictColor : L.slate }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'market' && (
     <div style={{ animation: 'cw-fade .3s ease' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 14 }}>Demand Heatmap — Weekly Foot Traffic</p>
      <div style={{ background: '#FAFBFC', borderRadius: 16, border: `1px solid ${L.border}`, padding: '20px' }}>
       <DemandHeatmap data={d.heatmap} color={d.verdictColor}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginTop: 20 }}>
       <div style={{ background: '#FAFBFC', borderRadius: 14, border: `1px solid ${L.border}`, padding: '16px 18px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12 }}>Competitor Proximity</p>
        {[
                  { name: 'Direct competitors (500m)', val: verdict === 'go' ? '3' : verdict === 'caution' ? '8' : '4', risk: verdict === 'go' ? 'low' : verdict === 'caution' ? 'high' : 'med' },
         { name: 'Indirect competitors (1km)', val: verdict === 'go' ? '7' : verdict === 'caution' ? '14' : '12', risk: verdict === 'go' ? 'low' : 'high' },
         { name: 'Competition intensity', val: verdict === 'go' ? 'Moderate' : verdict === 'caution' ? 'High' : 'Very High', risk: verdict === 'go' ? 'low' : 'high' },
         { name: 'Market gap score', val: verdict === 'go' ? '72 / 100' : verdict === 'caution' ? '44 / 100' : '28 / 100', risk: verdict === 'go' ? 'low' : 'high' },
        ].map(row => (
                  <div key={row.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${L.border}` }}>
          <span style={{ fontSize: 12, color: L.muted }}>{row.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: row.risk === 'low' ? '#059669' : row.risk === 'med' ? '#D97706' : '#DC2626' }}>{row.val}</span>
         </div>
                ))}
              </div>
              <div style={{ background: '#FAFBFC', borderRadius: 14, border: `1px solid ${L.border}`, padding: '16px 18px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12 }}>Demographics Snapshot</p>
        {[
                  { label: 'Population (5km)', value: verdict === 'go' ? '42,800' : verdict === 'caution' ? '31,200' : '58,400' },
         { label: 'Median Income', value: verdict === 'go' ? '$94,200' : verdict === 'caution' ? '$71,400' : '$68,800' },
         { label: 'Primary Age Group', value: verdict === 'go' ? '25–44 yrs' : verdict === 'caution' ? '20–35 yrs' : '35–55 yrs' },
         { label: 'Foot Traffic Score', value: verdict === 'go' ? '85 / 100' : verdict === 'caution' ? '68 / 100' : '48 / 100' },
        ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${L.border}` }}>
          <span style={{ fontSize: 12, color: L.muted }}>{row.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: L.slate }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'swot' && (
     <div style={{ animation: 'cw-fade .3s ease' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 14 }}>SWOT Analysis</p>
      <SwotGrid swot={d.swot}/>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${L.border}`, padding: isMobile ? '16px' : '18px 24px', background: L.mint, display: 'flex', flexDirection: isMobile ? 'column' : 'row' as const, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
    <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: L.slate, marginBottom: 2 }}>This is a sample. Your real report uses live data.</p>
          <p style={{ fontSize: 11, color: L.muted }}>Every address generates a unique analysis — no two reports are the same.</p>
        </div>
        <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: L.emerald, color: '#fff', borderRadius: 12, padding: '12px 24px', fontSize: 13, fontWeight: 800, boxShadow: '0 4px 16px rgba(16,185,129,.3)', whiteSpace: 'nowrap' as const, textDecoration: 'none' }}>
     Get my free report →
        </Link>
      </div>
    </div>
  )
}