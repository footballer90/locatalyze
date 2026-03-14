'use client'
import Footer from '@/components/Footer'
import ReportDemoSection from '@/components/ReportDemoSection'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MapPin, Users, Home, BarChart2, Bot, TrendingUp, Map, Globe, RefreshCw, Lightbulb, LineChart, Navigation, Zap, Shield, Trophy, Target, Activity, Coffee, UtensilsCrossed, ShoppingBag, Dumbbell, Croissant, Scissors } from 'lucide-react'

// ── Design tokens ──────────────────────────────────────────────────
const L = {
  white:      '#FFFFFF',
  mint:       '#F0FDF4',
  emerald:    '#10B981',
  emeraldDk:  '#059669',
  emeraldLt:  '#D1FAE5',
  emeraldXlt: '#ECFDF5',
  slate:      '#0F172A',
  muted:      '#64748B',
  border:     '#E2E8F0',
  go:         '#059669',
  goBg:       '#ECFDF5',
  goBdr:      '#A7F3D0',
  caution:    '#D97706',
  cautionBg:  '#FFFBEB',
  cautionBdr: '#FDE68A',
  danger:     '#DC2626',
  dangerBg:   '#FEF2F2',
  dangerBdr:  '#FECACA',
  amber:      '#F59E0B',
}

const D = {
  brand:  '#0F766E',
  bl:     '#14B8A6',
  glow:   '#0FDECE',
  e:      '#34D399',
  amber:  '#FBBF24',
  text1:  '#F0FDF9',
  text2:  'rgba(204,235,229,.55)',
  text3:  'rgba(148,210,198,.28)',
  border: 'rgba(20,184,166,.14)',
}

const font = "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif"

// ── Lucide icon wrapper ───────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LI_MAP: Record<string, any> = {
  mapPin: MapPin, users: Users, home: Home, barChart: BarChart2, bot: Bot,
  trendingUp: TrendingUp, map: Map, globe: Globe, refreshCw: RefreshCw,
  lightbulb: Lightbulb, lineChart: LineChart, navigation: Navigation,
  zap: Zap, shield: Shield, trophy: Trophy, target: Target, activity: Activity,
}
function LI({ n, size = 18, color = 'currentColor', sw = 2 }: { n: string; size?: number; color?: string; sw?: number }) {
  const C = LI_MAP[n]
  if (!C) return null
  return <C size={size} color={color} strokeWidth={sw}/>
}

// ── Hooks ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [v, setV] = useState(false)
  useEffect(() => {
    const c = () => setV(window.innerWidth < 768)
    c(); window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  return v
}

// ── ReportPreview — hero widget ───────────────────────────────────
const RP_CASES = [
  {
    id: 0,
    biz: 'Specialty Coffee Shop', emoji: '☕', location: 'Subiaco WA 6008',
    verdict: 'GO', verdictSub: 'Strong Opportunity',
    score: 82, scoreLabel: 'Feasibility Score',
    color: '#059669', colorLight: '#ECFDF5', colorMid: '#A7F3D0',
    gradHeader: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)',
    metrics: [
      { l: 'Annual Profit',    v: '$297,600', highlight: true },
      { l: 'Monthly Revenue',  v: '$91,200',  highlight: false },
      { l: 'Break-even',       v: '38/day',   highlight: false },
      { l: 'Payback Period',   v: '7 months', highlight: false },
    ],
    tags: ['High Income Area', 'Low Competition', '500m Radius Checked'],
    snap: [{ l: 'Demand', v: 85 }, { l: 'Rent Fit', v: 78 }, { l: 'Comp.', v: 72 }],
  },
  {
    id: 1,
    biz: 'Casual Dining Restaurant', emoji: '🍽️', location: 'Fremantle WA 6160',
    verdict: 'CAUTION', verdictSub: 'Proceed Carefully',
    score: 61, scoreLabel: 'Feasibility Score',
    color: '#D97706', colorLight: '#FFFBEB', colorMid: '#FDE68A',
    gradHeader: 'linear-gradient(135deg, #451A03 0%, #78350F 40%, #B45309 100%)',
    metrics: [
      { l: 'Annual Profit',    v: '$134,400', highlight: true },
      { l: 'Monthly Revenue',  v: '$74,400',  highlight: false },
      { l: 'Break-even',       v: '52/day',   highlight: false },
      { l: 'Payback Period',   v: '14 months',highlight: false },
    ],
    tags: ['Seasonal Risk', 'High Competition', 'Review Financials'],
    snap: [{ l: 'Demand', v: 68 }, { l: 'Rent Fit', v: 55 }, { l: 'Comp.', v: 60 }],
  },
  {
    id: 2,
    biz: 'Boutique Gym', emoji: '💪', location: 'Joondalup WA 6027',
    verdict: 'NO', verdictSub: 'Not Recommended',
    score: 44, scoreLabel: 'Feasibility Score',
    color: '#DC2626', colorLight: '#FEF2F2', colorMid: '#FECACA',
    gradHeader: 'linear-gradient(135deg, #2D0000 0%, #7F1D1D 40%, #991B1B 100%)',
    metrics: [
      { l: 'Annual Profit',    v: '$38,400',  highlight: true },
      { l: 'Monthly Revenue',  v: '$51,000',  highlight: false },
      { l: 'Break-even',       v: '74/day',   highlight: false },
      { l: 'Payback Period',   v: 'Not viable',highlight: false },
    ],
    tags: ['Oversaturated', 'Rent Too High', 'Not Viable'],
    snap: [{ l: 'Demand', v: 48 }, { l: 'Rent Fit', v: 38 }, { l: 'Comp.', v: 42 }],
  },
]

function ReportPreview() {
  const [caseIdx, setCaseIdx]   = useState(0)
  const [animKey, setAnimKey]   = useState(0)
  const [score, setScore]       = useState(0)
  const [snapping, setSnapping] = useState(false)

  const switchTo = (i: number) => {
    setSnapping(true)
    setTimeout(() => {
      setCaseIdx(i); setAnimKey(k => k + 1)
      setSnapping(false)
    }, 200)
  }

  useEffect(() => {
    const t = setInterval(() => switchTo((caseIdx + 1) % RP_CASES.length), 4800)
    return () => clearInterval(t)
  }, [caseIdx])

  useEffect(() => {
    setScore(0)
    const target = RP_CASES[caseIdx].score
    let s = 0
    const id = setInterval(() => {
      s = Math.min(s + 2, target)
      setScore(s)
      if (s >= target) clearInterval(id)
    }, 14)
    return () => clearInterval(id)
  }, [animKey])

  const c   = RP_CASES[caseIdx]
  const r   = 34
  const cir = 2 * Math.PI * r
  const vIcon = c.verdict === 'GO' ? '✅' : c.verdict === 'CAUTION' ? '⚠️' : '🚫'

  return (
    <div style={{ width: '100%', maxWidth: 460, fontFamily: font }}>

      {/* Switcher dots */}
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

      {/* Report card */}
      <div style={{
        borderRadius: 22, overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,.15), 0 4px 16px rgba(0,0,0,.08)',
        opacity: snapping ? 0 : 1, transform: snapping ? 'translateY(6px) scale(.99)' : 'translateY(0) scale(1)',
        transition: 'opacity .2s, transform .2s',
      }}>
        {/* Dark gradient header */}
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
              <span style={{ fontSize:22 }}>{c.emoji}</span>
              <div>
                <p style={{ fontSize:16, fontWeight:900, color:'#fff', letterSpacing:'-.02em', lineHeight:1.1 }}>{c.biz}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:2 }}>📍 {c.location}</p>
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
              <div style={{ textAlign:'center' as const }}>
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

        {/* White body */}
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

        {/* Footer */}
        <div style={{ background:'#F8FAFC', borderTop:`1px solid ${L.border}`, padding:'10px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:10, color:L.muted }}>Based on live data · Australian addresses only</span>
          <span style={{ fontSize:10, fontWeight:700, color:c.color }}>View full report →</span>
        </div>
      </div>

      {/* Progress bar under card */}
      <div style={{ height:2, background:L.border, borderRadius:100, marginTop:12, overflow:'hidden' }}>
        <div key={animKey} style={{ height:'100%', background:c.color, borderRadius:100, animation:'rp-bar 4.8s linear both' }}/>
      </div>

      <style>{`
        @keyframes rp-bar { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  )
}

// ── Showcase (dark, inline) ────────────────────────────────────────
const SHOWCASE_TABS = [
  { id: 'loc',  label: 'Location Analysis', headline: 'Location intelligence,\nilluminated.', sub: 'Understand exactly what makes a location work — or fail. Analyse foot traffic, demographics and proximity to demand generators before you commit to a single dollar of rent.', ui: 'score' },
  { id: 'sub',  label: 'Suburb Scoring',    headline: 'Every suburb scored\nfor your business.', sub: 'Compare suburbs side by side using income data, population density, age profile and spending behaviour. Find where your concept has the strongest natural advantage.', ui: 'suburbs' },
  { id: 'comp', label: 'Competitor Mapping',headline: 'See every competitor\nbefore they see you.', sub: 'Map every direct competitor within your chosen radius. Understand their ratings, proximity and threat level — and find the gaps where your concept can own the category.', ui: 'competitors' },
  { id: 'rent', label: 'Rent Affordability',headline: 'Know if the rent\nmakes financial sense.', sub: 'Enter your expected rent and average transaction value. Locatalyze calculates the exact daily volume you need to stay profitable — and tells you if this location can deliver it.', ui: 'rent' },
  { id: 'rep',  label: 'Feasibility Reports',headline: 'A full report,\nin 30 seconds.', sub: 'Get a complete feasibility report covering demand, competition, demographics and financials. Share it with your accountant, investor or landlord as a professional PDF — instantly.', ui: 'report' },
]

function ShowcaseScoreUI({ ak }: { ak: number }) {
  const [sc, setSc] = useState(0); const [bars, setBars] = useState(false)
  useEffect(() => { setSc(0); setBars(false); let n=0; const t=setInterval(()=>{ n=Math.min(n+2,84); setSc(n); if(n>=84){clearInterval(t); setBars(true)} },18); return()=>clearInterval(t) }, [ak])
  const off = 188-(188*sc/100)
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 8, display:'flex', alignItems:'center', gap:4 }}>
        <LI n="mapPin" size={10} color='#6B7280'/>142 Bourke St, Melbourne VIC
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 72, height: 72 }}>
          <svg viewBox="0 0 60 60" width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
            <defs><linearGradient id="sg"><stop offset="0%" stopColor="#0F766E"/><stop offset="100%" stopColor="#14B8A6"/></linearGradient></defs>
            <circle fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6" cx="30" cy="30" r="24"/>
            <circle fill="none" stroke="url(#sg)" strokeWidth="6" strokeLinecap="round" cx="30" cy="30" r="24" strokeDasharray="188" strokeDashoffset={off} style={{ transition: 'stroke-dashoffset .05s linear' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 900, color: D.text1 }}>{sc}</div>
        </div>
        <div style={{ background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.28)', borderRadius: 9, padding: '7px 14px', textAlign: 'center', opacity: sc>=84?1:0, transition: 'opacity .4s' }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: D.e }}>GO ✅</p>
          <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Verdict</p>
        </div>
      </div>
      {[{l:'Foot Traffic',p:85,c:D.e,v:'High'},{l:'Demographics',p:78,c:D.e,v:'Strong'},{l:'Competition',p:52,c:D.amber,v:'Moderate'},{l:'Rent Ratio',p:82,c:D.e,v:'9.2%'}].map((b,i)=>(
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ fontSize: 11, color: '#9CA3AF' }}>{b.l}</span><span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.v}</span></div>
          <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', background: b.c, borderRadius: 2, width: bars?`${b.p}%`:'0%', transition: `width 1.1s ease ${i*.12}s` }}/></div>
        </div>
      ))}
    </div>
  )
}

function ShowcaseSuburbsUI() {
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: D.text1, marginBottom: 14 }}>🏘️ Top Suburbs for Cafés</p>
      {[{n:'Fitzroy VIC 3065',s:92,b:'Top Pick',c:'#059669'},{n:'Newtown NSW 2042',s:87,b:'Strong',c:'#0F766E'},{n:'Subiaco WA 6008',s:83,b:'Strong',c:'#0F766E'},{n:'New Farm QLD 4005',s:79,b:'Good',c:'#D97706'},{n:'Leederville WA 6007',s:74,b:'Good',c:'#D97706'}].map((row,i)=>(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', marginBottom: 6, borderRadius: 9, background: i===0?'rgba(15,118,110,.14)':'rgba(255,255,255,.03)', border: `1px solid ${i===0?'rgba(15,118,110,.3)':'rgba(255,255,255,.06)'}` }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#14B8A6', width: 20 }}>#{i+1}</span>
          <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{row.n}</span>
          <span style={{ fontSize: 10, color: '#fff', background: row.c, borderRadius: 5, padding: '2px 8px', fontWeight: 700 }}>{row.b}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: row.s>85?D.e:'#FCD34D' }}>{row.s}</span>
        </div>
      ))}
    </div>
  )
}

function ShowcaseCompetitorsUI() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><p style={{ fontSize: 12, fontWeight: 700, color: D.text1 }}>🗺️ Competitors within 500m</p><span style={{ fontSize: 11, color: '#6B7280' }}>4 found</span></div>
      {[{n:'The Daily Grind',d:'120m',st:4.2,t:'High',c:'#F87171'},{n:'Brew & Co.',d:'280m',st:3.8,t:'Med',c:'#FBBF24'},{n:'Sunrise Café',d:'390m',st:4.5,t:'High',c:'#F87171'},{n:'Quick Bites',d:'470m',st:3.1,t:'Low',c:'#34D399'}].map((r,i)=>(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: i<3?'1px solid rgba(255,255,255,.05)':'none' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.c, flexShrink: 0 }}/>
          <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{r.n}</span>
          <span style={{ fontSize: 10, color: '#6B7280' }}>{r.d}</span>
          <span style={{ fontSize: 10, color: '#FBBF24' }}>★ {r.st}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: r.c, background: r.c+'18', borderRadius: 4, padding: '2px 7px' }}>{r.t}</span>
        </div>
      ))}
    </div>
  )
}

function ShowcaseRentUI() {
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: D.text1, marginBottom: 14 }}>💰 Rent Analysis</p>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 30, fontWeight: 900, color: D.text1, letterSpacing: '-.04em' }}>$4,200 / mo</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 7, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', borderRadius: 20, padding: '4px 14px' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: D.e }}>9.8%</span>
          <span style={{ fontSize: 10, color: '#6B7280' }}>of revenue</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>Healthy ✓</span>
        </div>
      </div>
      {[['Revenue needed','$42,800 / mo'],['Daily transactions','156 / day'],['Break-even','~7 months'],['Safety buffer','$4,600 / mo']].map(([l,v],i)=>(
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{l}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#E5E7EB' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

function ShowcaseReportUI() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 2, display:'flex', alignItems:'center', gap:4 }}>
            <LI n="mapPin" size={10} color='#6B7280'/>88 Oxford St, Darlinghurst NSW
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: D.text1 }}>Feasibility Report</p>
        </div>
        <div style={{ background: 'rgba(5,150,105,.15)', border: '1px solid rgba(5,150,105,.4)', borderRadius: 8, padding: '7px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: D.e }}>GO</p>
          <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Score: 88</p>
        </div>
      </div>
      {[{i:'📍',l:'Location Score',v:'88 / 100',c:D.e},{i:'👥',l:'Demand Signal',v:'Strong',c:D.e},{i:'🏪',l:'Competition Risk',v:'Moderate',c:D.amber},{i:'💰',l:'Rent Viability',v:'Viable',c:D.e},{i:'📊',l:'Demographics',v:'Excellent',c:D.e}].map((r,i)=>(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i<4?'1px solid rgba(255,255,255,.05)':'none' }}>
          <span style={{ fontSize: 14 }}>{r.i}</span>
          <span style={{ fontSize: 12, color: '#9CA3AF', flex: 1 }}>{r.l}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: r.c }}>{r.v}</span>
        </div>
      ))}
    </div>
  )
}

function ShowcaseDeviceUI({ ui, ak }: { ui: string; ak: number }) {
  if (ui === 'score')       return <ShowcaseScoreUI ak={ak}/>
  if (ui === 'suburbs')     return <ShowcaseSuburbsUI/>
  if (ui === 'competitors') return <ShowcaseCompetitorsUI/>
  if (ui === 'rent')        return <ShowcaseRentUI/>
  return <ShowcaseReportUI/>
}

function DarkShowcase() {
  const [idx, setIdx] = useState(0)
  const [ak, setAk]   = useState(0)
  const paused = useRef(false)
  const tab = SHOWCASE_TABS[idx]

  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) { setIdx(i=>(i+1)%SHOWCASE_TABS.length); setAk(k=>k+1) } }, 4500)
    return () => clearInterval(t)
  }, [])

  function go(i: number) { setIdx(i); setAk(k=>k+1); paused.current=true; setTimeout(()=>{ paused.current=false },10000) }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', fontFamily: font }}
      onMouseEnter={()=>{ paused.current=true }} onMouseLeave={()=>{ paused.current=false }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(15,118,110,.2) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(6,95,70,.18) 0%, transparent 55%), linear-gradient(160deg, #061412 0%, #030C0B 50%, #071814 100%)' }}/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.5) 50%, transparent)', zIndex: 5 }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.3) 50%, transparent)', zIndex: 5 }}/>

      {/* Tab bar */}
      <div style={{ position: 'relative', zIndex: 5, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', overflowX: 'auto', padding: '0 40px', scrollbarWidth: 'none' as const }}>
          {SHOWCASE_TABS.map((t,i)=>(
            <button key={t.id} onClick={()=>go(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '16px 22px 14px', fontFamily: font, fontSize: 13.5, fontWeight: i===idx?700:400, color: i===idx?D.text1:D.text3, whiteSpace: 'nowrap' as const, position: 'relative', transition: 'color .2s' }}>
              {t.label}
              <div style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', height: 2, background: `linear-gradient(90deg,${D.brand},${D.glow})`, borderRadius: 2, width: i===idx?'80%':'0%', transition: 'width .35s ease' }}/>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, padding: '72px 40px 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left text */}
          <div key={tab.id+'-t-'+ak} style={{ animation: 'sc-up .45s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(15,118,110,.14)', border: `1px solid ${D.glow}40`, borderRadius: 30, padding: '5px 16px 5px 10px', fontSize: 10.5, fontWeight: 700, color: D.glow, letterSpacing: '.12em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: D.glow, display: 'inline-block' }}/>
              Feature Showcase
            </div>
            <h2 style={{ fontSize: 'clamp(26px,3.8vw,40px)', fontWeight: 900, letterSpacing: '-.045em', lineHeight: 1.08, marginBottom: 18, whiteSpace: 'pre-line' as const, background: `linear-gradient(135deg, ${D.text1} 30%, ${D.glow} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {tab.headline}
            </h2>
            <p style={{ fontSize: 14.5, color: D.text2, lineHeight: 1.8, marginBottom: 28 }}>{tab.sub}</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid rgba(20,184,166,.3)`, background: 'rgba(15,118,110,.12)', color: D.text1, borderRadius: 10, padding: '12px 20px', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', fontFamily: font }}>
              See how it works →
            </Link>
          </div>

          {/* Right device */}
          <div key={tab.id+'-d-'+ak} style={{ animation: 'sc-up .5s ease both', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', maxWidth: 440, background: 'rgba(10,18,16,.92)', border: D.border, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,.6), 0 0 60px rgba(15,118,110,.08)' }}>
              <div style={{ background: 'rgba(255,255,255,.035)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>{['#FF5F57','#FFBD2E','#28CA41'].map(c=><div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>)}</div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4B5563' }}>locatalyze.com/analyse</div>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: `linear-gradient(135deg,${D.brand},${D.bl})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900, color: '#fff' }}>L</div>
              </div>
              <div style={{ background: '#0A1210', minHeight: 280 }}>
                <ShowcaseDeviceUI ui={tab.ui} ak={ak}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ position: 'relative', zIndex: 5, height: 2, background: 'rgba(255,255,255,.04)' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg,${D.brand},${D.bl})`, width: `${((idx+1)/SHOWCASE_TABS.length)*100}%`, transition: 'width .4s ease' }}/>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '24px 20px 32px', background: 'rgba(3,12,11,.55)', borderTop: '1px solid rgba(255,255,255,.04)' }}>
        <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${D.brand},#0B9488)`, color: '#fff', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none', fontFamily: font, boxShadow: '0 6px 24px rgba(15,118,110,.35)' }}>
          Analyse my location free →
        </Link>
        <p style={{ fontSize: 11, color: D.text3, marginTop: 8 }}>No credit card · Any Australian address · 30 seconds</p>
      </div>
    </div>
  )
}

// ── Premium Report ─────────────────────────────────────────────────
const PR_DATA = {
  go: {
    biz: 'Specialty Coffee Shop', location: 'Subiaco, WA', suburb: 'High-income inner suburb', verdict: 'GO', score: 82,
    verdictColor: '#059669', verdictBg: '#ECFDF5', verdictBorder: '#A7F3D0',
    accentGrad: 'linear-gradient(135deg,#059669 0%,#10B981 100%)',
    kpis: [
      { label: 'Monthly Revenue',  value: '$91,200',  sub: '+12% vs benchmark', up: true  },
      { label: 'Monthly Profit',   value: '$24,800',  sub: '27% margin',        up: true  },
      { label: 'Annual Profit',    value: '$297,600', sub: 'Year 1 projection', up: true  },
      { label: 'Payback Period',   value: '7 months', sub: 'Below avg 14mo',    up: true  },
    ],
    revenue: [58, 67, 74, 80, 86, 91],
    profit:  [10, 14, 17, 21, 23, 25],
    scores: [
      { label: 'Foot Traffic & Demand', score: 85, icon: 'activity' },
      { label: 'Rent Affordability',    score: 78, icon: 'home' },
      { label: 'Competition Level',     score: 72, icon: 'target' },
      { label: 'Profitability',         score: 90, icon: 'trendingUp' },
    ],
    heatmap: [8,6,5,7,9,8,7, 4,3,2,4,6,5,4, 6,5,4,6,8,7,6, 5,4,3,5,7,6,5, 7,6,5,7,9,8,7],
    swot: {
      strengths:     ['High foot traffic from young professionals', 'Affluent demographics — avg income $95k+', 'Underserved specialty coffee segment'],
      weaknesses:    ['Competitive market with 3 established chains', 'High commercial rent at $3,800/mo'],
      opportunities: ['Growing café culture in WA', 'Weekend brunch market largely untapped'],
      threats:       ['Large chain expansion into the area', 'Rising commercial rent prices YoY'],
    },
    rec: 'Strong opportunity. High demand demographics combined with manageable competition makes this an excellent location for a specialty coffee concept. Financial projections indicate profitability within 7 months.',
  },
  caution: {
    biz: 'Casual Dining Restaurant', location: 'Fremantle, WA', suburb: 'Tourist & mixed-use precinct', verdict: 'CAUTION', score: 61,
    verdictColor: '#D97706', verdictBg: '#FFFBEB', verdictBorder: '#FDE68A',
    accentGrad: 'linear-gradient(135deg,#B45309 0%,#D97706 100%)',
    kpis: [
      { label: 'Monthly Revenue',  value: '$74,400',  sub: '-8% vs benchmark',  up: false },
      { label: 'Monthly Profit',   value: '$11,200',  sub: '15% margin',        up: false },
      { label: 'Annual Profit',    value: '$134,400', sub: 'Year 1 projection', up: false },
      { label: 'Payback Period',   value: '14 months',sub: 'Near avg 14mo',     up: true  },
    ],
    revenue: [42, 55, 68, 74, 70, 74],
    profit:  [4,  8,  12, 11, 9,  11],
    scores: [
      { label: 'Foot Traffic & Demand', score: 68, icon: 'activity' },
      { label: 'Rent Affordability',    score: 55, icon: 'home' },
      { label: 'Competition Level',     score: 60, icon: 'target' },
      { label: 'Profitability',         score: 62, icon: 'trendingUp' },
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
      { label: 'Monthly Revenue',  value: '$51,000',  sub: '-38% vs benchmark',  up: false },
      { label: 'Monthly Profit',   value: '$3,200',   sub: '6% margin',          up: false },
      { label: 'Annual Profit',    value: '$38,400',  sub: 'Year 1 projection',  up: false },
      { label: 'Payback Period',   value: 'Not viable',sub: '>36 months risk',   up: false },
    ],
    revenue: [38, 42, 46, 50, 51, 51],
    profit:  [1,  1,  2,  3,  3,  3],
    scores: [
      { label: 'Foot Traffic & Demand', score: 48, icon: 'activity' },
      { label: 'Rent Affordability',    score: 38, icon: 'home' },
      { label: 'Competition Level',     score: 42, icon: 'target' },
      { label: 'Profitability',         score: 46, icon: 'trendingUp' },
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

function ScoreRing({ score, color, size = 72 }: { score: number; color: string; size?: number }) {
  const [anim, setAnim] = useState(0)
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  useEffect(() => {
    setAnim(0)
    const id = setInterval(() => setAnim(a => { if (a >= score) { clearInterval(id); return score }; return a + 2 }), 14)
    return () => clearInterval(id)
  }, [score])
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth={size*0.07}/>
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

// ── icon is now a Lucide name string (activity/home/target/trendingUp)
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
    { key: 'strengths',     label: 'Strengths',     icon: '💪', bg: '#F0FDF4', border: '#BBF7D0', text: '#065F46', dot: '#059669' },
    { key: 'weaknesses',    label: 'Weaknesses',    icon: '⚠️', bg: '#FFFBEB', border: '#FDE68A', text: '#78350F', dot: '#D97706' },
    { key: 'opportunities', label: 'Opportunities', icon: '🚀', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E3A8A', dot: '#3B82F6' },
    { key: 'threats',       label: 'Threats',       icon: '⚡', bg: '#FEF2F2', border: '#FECACA', text: '#7F1D1D', dot: '#DC2626' },
  ] as const
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {quadrants.map(q => (
        <div key={q.key} style={{ background: q.bg, border: `1.5px solid ${q.border}`, borderRadius: 14, padding: '14px 16px', transition: 'transform .2s, box-shadow .2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: q.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{q.icon}</div>
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

function PremiumReport({ verdict, isMobile }: { verdict: 'go' | 'caution' | 'no'; isMobile: boolean }) {
  const d = PR_DATA[verdict]
  const [barsFired, setBarsFired] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'financials' | 'market' | 'swot'>('overview')

  useEffect(() => {
    setBarsFired(false)
    setActiveSection('overview')
    const t = setTimeout(() => setBarsFired(true), 200)
    return () => clearTimeout(t)
  }, [verdict])

  // icon is now a Lucide name string (barChart/lineChart/map/zap)
  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: 'barChart'   },
    { id: 'financials', label: 'Financials', icon: 'lineChart'  },
    { id: 'market',     label: 'Market',     icon: 'map'        },
    { id: 'swot',       label: 'SWOT',       icon: 'zap'        },
  ] as const

  return (
    <div style={{ background: L.white, borderRadius: 24, border: `1px solid ${L.border}`, boxShadow: '0 16px 64px rgba(0,0,0,.1)', overflow: 'hidden', fontFamily: font }}>

      {/* Report Header */}
      <div style={{ background: `linear-gradient(135deg, #0C1F1C 0%, #0F766E 60%, #0891B2 100%)`, padding: isMobile ? '24px 20px' : '32px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {/* Location badge — MapPin icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.12)', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
              <LI n="mapPin" size={11} color='rgba(255,255,255,.8)'/> {d.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.08)', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>
              🏙️ {d.suburb}
            </div>
            <div style={{ marginLeft: 'auto' as const, background: 'rgba(255,255,255,.1)', borderRadius: 8, padding: '3px 10px', fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 20 }}>
            <div>
              <h3 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color: '#fff', letterSpacing: '-.03em', marginBottom: 12, lineHeight: 1.1 }}>{d.biz}</h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: d.verdictBg, border: `2px solid ${d.verdictBorder}`, borderRadius: 14, padding: '8px 18px' }}>
                <span style={{ fontSize: 20 }}>{verdict === 'go' ? '✅' : verdict === 'caution' ? '⚠️' : '🚫'}</span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 900, color: d.verdictColor, lineHeight: 1 }}>{d.verdict}</p>
                  <p style={{ fontSize: 10, color: d.verdictColor, opacity: 0.75, marginTop: 1 }}>Location Verdict</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' as const }}>
              <div style={{ textAlign: 'center' as const }}>
                <ScoreRing score={d.score} color={d.verdictColor} size={isMobile ? 68 : 84}/>
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

      {/* Inner nav tabs — Lucide icons */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${L.border}`, background: '#FAFBFC', overflowX: 'auto' as const }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)}
            style={{ flex: isMobile ? 'none' : 1, padding: isMobile ? '12px 16px' : '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: activeSection === t.id ? 700 : 500, color: activeSection === t.id ? d.verdictColor : L.muted, borderBottom: `2px solid ${activeSection === t.id ? d.verdictColor : 'transparent'}`, whiteSpace: 'nowrap' as const, transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <LI n={t.icon} size={14} color={activeSection === t.id ? d.verdictColor : L.muted}/>
            {t.label}
          </button>
        ))}
      </div>

      {/* AI Verdict banner — Lightbulb icon */}
      <div style={{ margin: '20px 24px 0', background: d.verdictBg, border: `1px solid ${d.verdictBorder}`, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: d.verdictColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <LI n="lightbulb" size={14} color="#fff"/>
        </div>
        <p style={{ fontSize: 13, color: d.verdictColor, lineHeight: 1.65 }}><strong>AI Analysis:</strong> {d.rec}</p>
      </div>

      {/* Tab content */}
      <div style={{ padding: isMobile ? '20px 16px' : '24px 24px 32px' }}>

        {/* OVERVIEW */}
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

        {/* FINANCIALS */}
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

        {/* MARKET */}
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

        {/* SWOT */}
        {activeSection === 'swot' && (
          <div style={{ animation: 'cw-fade .3s ease' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: d.verdictColor, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 14 }}>SWOT Analysis</p>
            <SwotGrid swot={d.swot}/>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ borderTop: `1px solid ${L.border}`, padding: isMobile ? '16px' : '18px 24px', background: L.mint, display: 'flex', flexDirection: isMobile ? 'column' : 'row' as const, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: L.slate, marginBottom: 2 }}>This is a sample. Your real report uses live data.</p>
          <p style={{ fontSize: 11, color: L.muted }}>Every address generates a unique analysis — no two reports are the same.</p>
        </div>
        <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: L.emerald, color: '#fff', borderRadius: 12, padding: '12px 24px', fontSize: 13, fontWeight: 800, boxShadow: '0 4px 16px rgba(16,185,129,.3)', whiteSpace: 'nowrap' as const, textDecoration: 'none' }}>
          Get my free report →
        </Link>
      </div>
    </div>
  )
}

// ── Cinematic Walkthrough ─────────────────────────────────────────
const CW_PINS = [
  { x:58, y:40, label:'The Daily Grind', threat:'High', rating:4.2, dist:'120m', color:'#EF4444', d:0 },
  { x:28, y:58, label:'Brew & Co.',      threat:'Med',  rating:3.8, dist:'280m', color:'#F59E0B', d:350 },
  { x:72, y:68, label:'Sunrise Café',    threat:'High', rating:4.5, dist:'390m', color:'#EF4444', d:700 },
  { x:20, y:30, label:'Quick Bites',     threat:'Low',  rating:3.1, dist:'470m', color:'#10B981', d:1050 },
]

// icon is a Lucide name string (mapPin/navigation/users/trendingUp/barChart)
const CW_STEPS = [
  { icon: 'mapPin',     label: 'Address resolved',     detail: '45 King St, Newtown NSW 2042' },
  { icon: 'navigation', label: 'Competitors scanned',  detail: '4 businesses within 500m' },
  { icon: 'users',      label: 'Demographics loaded',   detail: 'ABS — high income, young adults' },
  { icon: 'trendingUp', label: 'Financial model built', detail: 'Rent viability + break-even' },
  { icon: 'barChart',   label: 'Verdict generated',     detail: 'GO — score 82 / 100' },
]

const CW_PHASE_META = [
  { step:'01', label:'Enter Address',   desc:'Type any Australian address. Add your business type, monthly rent and transaction value. Done in 60 seconds.' },
  { step:'02', label:'AI Analyses',     desc:'Locatalyze scans competitors, loads live demographics, calculates rent viability and builds your financial model — all in real time.' },
  { step:'03', label:'Get Your Report', desc:'Receive a clear GO, CAUTION or NO verdict with a full financial model, score breakdown, SWOT analysis and 3-year projection.' },
]

function CinematicWalkthrough() {
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
      {/* Phase stepper */}
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

      {/* Browser mockup */}
      <div style={{ background: L.white, borderRadius: 20, border: `1px solid ${L.border}`, boxShadow: '0 8px 48px rgba(0,0,0,.1)', overflow: 'hidden' }}>
        {/* Chrome bar */}
        <div style={{ background: '#F8FAFC', borderBottom: `1px solid ${L.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#FF5F57','#FFBE2E','#27C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
          </div>
          <div style={{ flex: 1, background: L.border, borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
            <span style={{ fontSize: 11, color: L.muted }}>locatalyze.com/analyse</span>
          </div>
          {phase >= 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: L.emerald }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: L.emerald, display: 'inline-block', animation: phase === 2 ? 'pulse-dot .8s infinite' : 'none' }}/>
              {phase === 2 ? 'Analysing…' : 'Complete'}
            </div>
          )}
        </div>

        {/* Split-screen body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340 }}>

          {/* LEFT PANEL */}
          <div style={{ padding: '24px 24px', borderRight: `1px solid ${L.border}` }}>

            {/* Phase 1 & 2: form */}
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

                {/* Progress — Lucide step icons */}
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

            {/* Phase 3: report summary */}
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

          {/* RIGHT PANEL — map */}
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

            {/* Phase 1: idle overlay — Map icon */}
            {phase <= 1 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', background: 'rgba(240,253,244,.5)', backdropFilter: 'blur(2px)' }}>
                <div style={{ marginBottom: 8 }}>
                  <LI n="map" size={36} color={L.muted}/>
                </div>
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

        {/* Bottom progress bar */}
        <div style={{ height: 3, background: L.border }}>
          <div style={{ height: '100%', background: L.emerald, transition: 'width .3s ease', width: phase === 0 ? '0%' : phase === 1 ? '33%' : phase === 2 ? '66%' : '100%' }}/>
        </div>
      </div>

      {/* Phase descriptions */}
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

// ── Page ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'go'|'caution'|'no'>('go')
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { if (scrolled && menuOpen) setMenuOpen(false) }, [scrolled])

  const pad = isMobile ? '0 16px' : '0 40px'
  const sp  = isMobile ? '64px 16px' : '96px 40px'
  const W   = { maxWidth: 1240, margin: '0 auto' }

  return (
    <div style={{ minHeight: '100vh', background: L.white, fontFamily: font, color: L.slate }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        button{font-family:inherit;cursor:pointer}
        html{scroll-behavior:smooth}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes sc-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)}}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menuOpen ? 'rgba(255,255,255,.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled || menuOpen ? `1px solid ${L.border}` : 'none',
        padding: `0 ${isMobile ? 16 : 40}px`, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all .3s',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: L.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.03em', color: L.slate }}>Locatalyze</span>
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <a href="#how-it-works" style={{ fontSize: 13, color: L.muted, fontWeight: 500, padding: '6px 12px' }}>How it works</a>
            <a href="#sample-report" style={{ fontSize: 13, color: L.muted, fontWeight: 500, padding: '6px 12px' }}>Sample report</a>
            <a href="#pricing" style={{ fontSize: 13, color: L.muted, fontWeight: 500, padding: '6px 12px' }}>Pricing</a>
            <Link href="/methodology" style={{ fontSize: 13, color: L.muted, fontWeight: 500, padding: '6px 12px' }}>Methodology</Link>
            <Link href="/auth/login" style={{ fontSize: 13, color: L.slate, fontWeight: 600, padding: '6px 12px' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: L.emerald, color: '#fff', borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 10px rgba(16,185,129,.25)' }}>
              Try free →
            </Link>
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ display: 'block', width: 22, height: 2, background: L.slate, borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}/>
            <span style={{ display: 'block', width: 22, height: 2, background: L.slate, borderRadius: 2, transition: 'all .2s', opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ display: 'block', width: 22, height: 2, background: L.slate, borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}/>
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99, background: L.white, borderBottom: `1px solid ${L.border}`, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,.08)' }}>
          {[{l:'How it works',h:'#how-it-works'},{l:'Sample report',h:'#sample-report'},{l:'Pricing',h:'#pricing'},{l:'Methodology',h:'/methodology'}].map(item => (
            <a key={item.l} href={item.h} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 8px', fontSize: 15, fontWeight: 600, color: L.slate, borderBottom: `1px solid ${L.border}` }}>{item.l}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: 12, border: `1.5px solid ${L.border}`, borderRadius: 10, fontSize: 14, fontWeight: 700, color: L.slate }}>Sign in</Link>
            <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{ flex: 2, textAlign: 'center', padding: 12, background: L.emerald, borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff' }}>Try free →</Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ paddingTop: isMobile ? 80 : 100, paddingBottom: isMobile ? 56 : 80, background: L.white, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: `linear-gradient(to top, ${L.mint}, transparent)`, pointerEvents: 'none' }}/>
        <div style={{ ...W, padding: pad, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 60, alignItems: 'center' }}>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 100, padding: '5px 14px 5px 10px', fontSize: 11, fontWeight: 700, color: L.emerald, marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: L.emerald, display: 'inline-block', animation: 'pulse-dot 2s infinite' }}/>
                AI-powered location analysis for business owners
              </div>
              <h1 style={{ fontSize: isMobile ? 36 : 54, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: 18 }}>
                The wrong location<br/>costs <span style={{ color: L.emerald }}>$200,000+.</span>
              </h1>
              <p style={{ fontSize: isMobile ? 15 : 17, color: L.muted, lineHeight: 1.75, marginBottom: 28, maxWidth: 440 }}>
                Paste any Australian address. Get a full AI analysis with a clear <strong style={{ color: L.slate }}>GO, CAUTION or NO</strong> verdict in 30 seconds.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emerald, color: '#fff', borderRadius: 12, padding: isMobile ? '13px 22px' : '15px 28px', fontWeight: 800, fontSize: isMobile ? 14 : 15, boxShadow: '0 4px 20px rgba(16,185,129,.3)' }}>
                  Analyse your first location free →
                </Link>
                <a href="#sample-report" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.white, color: L.slate, borderRadius: 12, padding: isMobile ? '13px 18px' : '15px 22px', fontWeight: 600, fontSize: 14, border: `1.5px solid ${L.border}` }}>
                  See sample report
                </a>
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Free plan · No credit card · 3 full reports included</p>

              <div style={{ display: 'flex', gap: isMobile ? 20 : 28, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${L.border}`, flexWrap: 'wrap' }}>
                {[{value:'180+',label:'founders analysed‡'},{value:'620+',label:'locations scored'},{value:'94%',label:'accuracy rating*'}].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: L.emerald, letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ReportPreview/>
            </div>
          </div>
        </div>
      </section>

      {/* NICHE STRIP */}
      <div style={{ background: L.slate, padding: `12px ${isMobile ? 16 : 40}px` }}>
        <div style={{ ...W, display: 'flex', justifyContent: 'center', gap: isMobile ? 14 : 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Built for</p>
          {[
            { icon: <Coffee size={14} strokeWidth={1.8} />, label: 'Cafes' },
            { icon: <UtensilsCrossed size={14} strokeWidth={1.8} />, label: 'Restaurants' },
            { icon: <ShoppingBag size={14} strokeWidth={1.8} />, label: 'Retail' },
            { icon: <Dumbbell size={14} strokeWidth={1.8} />, label: 'Gyms' },
            { icon: <Croissant size={14} strokeWidth={1.8} />, label: 'Bakeries' },
            { icon: <Scissors size={14} strokeWidth={1.8} />, label: 'Salons' },
          ].map(b => (
            <span key={b.label} style={{ fontSize: isMobile ? 12 : 13, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
              {b.icon}{b.label}
            </span>
          ))}
        </div>
      </div>

      {/* DARK SHOWCASE */}
      {!isMobile && <DarkShowcase/>}

      {isMobile && (
        <section style={{ padding: '56px 16px', background: '#030C0B', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(15,118,110,.14)', border: '1px solid rgba(20,184,166,.28)', borderRadius: 30, padding: '5px 14px 5px 10px', fontSize: 10.5, fontWeight: 700, color: D.glow, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: D.glow, display: 'inline-block' }}/>Feature Showcase
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: 14, background: `linear-gradient(135deg, ${D.text1} 30%, ${D.glow} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Location intelligence, illuminated.
          </h2>
          <p style={{ fontSize: 14, color: D.text2, lineHeight: 1.75, marginBottom: 24 }}>Analyse foot traffic, competitors and financials for any Australian address in 30 seconds.</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${D.brand},#0B9488)`, color: '#fff', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my location free →
          </Link>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: sp, background: L.mint }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 12 }}>From address to verdict in 30 seconds</h2>
            <p style={{ fontSize: 15, color: L.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>No spreadsheets. No consultants. Just paste the address.</p>
          </div>
          {!isMobile && <CinematicWalkthrough/>}
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CW_PHASE_META.map((p, i) => (
                <div key={i} style={{ background: L.white, borderRadius: 16, border: `1px solid ${L.border}`, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: L.emerald, color: '#fff', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.step}</div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: L.slate }}>{p.label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: L.muted, lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div id="sample-report">
        <ReportDemoSection />
      </div>

      {/* DATA SOURCES — Dark premium — Lucide icons throughout */}
      <section style={{ padding: isMobile ? '72px 16px' : '100px 40px', background: '#0B1512', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:600, background:'radial-gradient(ellipse, rgba(16,185,129,.07) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ ...W, position:'relative', zIndex:2 }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom: isMobile ? 40 : 64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.25)', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:'#34D399', textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:16 }}>
              Data infrastructure
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 44, fontWeight:900, color:'#F0FDF9', letterSpacing:'-.04em', lineHeight:1.08, marginBottom:14 }}>
              Not guesswork.<br/>
              <span style={{ background:'linear-gradient(135deg, #34D399, #0FDECE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Six verified data layers.
              </span>
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color:'rgba(204,235,229,.55)', maxWidth:540, margin:'0 auto', lineHeight:1.75 }}>
              Every verdict is computed from real, live sources — cross-referenced and weighted by our AI. No static databases. No educated guesses.
            </p>
          </div>

          {/* Pipeline row — Globe / Activity / BarChart2 / Shield */}
          {!isMobile && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:64 }}>
              {[
                { icon: 'globe',    label: 'Live Data' },
                { icon: 'activity', label: 'AI Processing' },
                { icon: 'barChart', label: 'Scoring Engine' },
                { icon: 'shield',   label: 'Your Verdict' },
              ].map((step, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column' as const, alignItems:'center', gap:8 }}>
                    <div style={{ width:52, height:52, borderRadius:16, background: i === 3 ? 'linear-gradient(135deg,#059669,#10B981)' : 'rgba(255,255,255,.05)', border: i === 3 ? 'none' : '1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: i === 3 ? '0 4px 20px rgba(16,185,129,.4)' : 'none' }}>
                      <LI n={step.icon} size={22} color={i === 3 ? '#fff' : 'rgba(204,235,229,.45)'}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: i === 3 ? '#34D399' : 'rgba(204,235,229,.45)', whiteSpace:'nowrap' as const }}>{step.label}</span>
                  </div>
                  {i < 3 && (
                    <div style={{ width:60, height:1, margin:'0 8px', marginBottom:20, background:'linear-gradient(90deg, rgba(52,211,153,.3), rgba(52,211,153,.1))' }}>
                      <div style={{ width:'100%', height:'100%', background:'linear-gradient(90deg, rgba(52,211,153,.6), transparent)', animation:'pipe-flow 2s linear infinite' }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 6 source cards — Navigation/Users/Home/Target/Bot/TrendingUp */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:14, marginBottom:48 }}>
            {[
              {
                icon: 'navigation', source:'Google Maps & Places', badge:'Live API',
                headline:'Every competitor mapped within 500m',
                body:'We pull real-time business data — names, categories, ratings and coordinates — directly from Google Places. No manual databases, no stale listings.',
                proof:'Updated with each analysis',
                color:'#3B82F6', colorBg:'rgba(59,130,246,.08)', colorBorder:'rgba(59,130,246,.2)',
              },
              {
                icon: 'users', source:'ABS Census & Demographics', badge:'Gov. verified',
                headline:'Income, age and population by suburb',
                body:'Australian Bureau of Statistics census data gives us median income, age profile and population density — the foundation of every demand estimate.',
                proof:'2021 ABS Census + quarterly updates',
                color:'#8B5CF6', colorBg:'rgba(139,92,246,.08)', colorBorder:'rgba(139,92,246,.2)',
              },
              {
                icon: 'home', source:'Commercial Rent Benchmarks', badge:'Market data',
                headline:'Fair rent for every suburb and zone',
                body:'Aggregated from commercial property listings and market research, we estimate realistic rent ranges so your financial model reflects what you\'ll actually pay.',
                proof:'Refreshed monthly per suburb',
                color:'#F59E0B', colorBg:'rgba(245,158,11,.08)', colorBorder:'rgba(245,158,11,.2)',
              },
              {
                icon: 'target', source:'Competition Scoring Engine', badge:'AI-computed',
                headline:'Threat rating for every nearby business',
                body:'Our model scores competitor intensity by proximity, rating, category overlap and business count — giving you a number, not a vague "there\'s some competition."',
                proof:'Per-radius, per-category scoring',
                color:'#EF4444', colorBg:'rgba(239,68,68,.08)', colorBorder:'rgba(239,68,68,.2)',
              },
              {
                icon: 'bot', source:'AI Financial Model', badge:'Proprietary',
                headline:'Break-even, profit and 3-year outlook',
                body:'Input your rent and transaction value — our model calculates daily volume needed, monthly profit, payback period and a 3-year revenue projection.',
                proof:'Calibrated on 180+ analyses‡',
                color:'#10B981', colorBg:'rgba(16,185,129,.08)', colorBorder:'rgba(16,185,129,.25)',
              },
              {
                icon: 'trendingUp', source:'Market Demand Signals', badge:'Multi-source',
                headline:'Search trends and foot traffic by suburb',
                body:'We combine category-level search volume, proximity to demand generators (transport, offices, universities) and ABS commute data to estimate real demand.',
                proof:'Google Trends + ABS movement data',
                color:'#0EA5E9', colorBg:'rgba(14,165,233,.08)', colorBorder:'rgba(14,165,233,.2)',
              },
            ].map((ds, i) => (
              <div key={i}
                style={{ background:'rgba(255,255,255,.03)', border:`1px solid ${ds.colorBorder}`, borderRadius:18, padding:'22px 20px', transition:'transform .2s, background .2s, box-shadow .2s', cursor:'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.background=ds.colorBg; el.style.boxShadow=`0 12px 40px ${ds.color}22` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(0)'; el.style.background='rgba(255,255,255,.03)'; el.style.boxShadow='none' }}>

                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:ds.colorBg, border:`1px solid ${ds.colorBorder}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <LI n={ds.icon} size={20} color={ds.color}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:800, color:ds.color, background:ds.colorBg, border:`1px solid ${ds.colorBorder}`, borderRadius:6, padding:'3px 8px', textTransform:'uppercase' as const, letterSpacing:'.07em' }}>
                    {ds.badge}
                  </span>
                </div>

                <p style={{ fontSize:10, fontWeight:700, color:ds.color, textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:6 }}>{ds.source}</p>
                <p style={{ fontSize:14, fontWeight:800, color:'#F0FDF9', lineHeight:1.35, marginBottom:8 }}>{ds.headline}</p>
                <p style={{ fontSize:12.5, color:'rgba(204,235,229,.5)', lineHeight:1.7, marginBottom:12 }}>{ds.body}</p>

                <div style={{ display:'flex', alignItems:'center', gap:5, paddingTop:12, borderTop:'1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:ds.color, animation:'pulse-dot 2s infinite', flexShrink:0 }}/>
                  <span style={{ fontSize:10, color:'rgba(204,235,229,.35)', fontWeight:600 }}>{ds.proof}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust bar — Trophy / Globe / RefreshCw */}
          <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:18, padding: isMobile ? '20px 16px' : '24px 32px' }}>
            <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row' as const, alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 20 : 40, justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:'#F0FDF9', marginBottom:4 }}>Built for accuracy, not assumptions.</p>
                <p style={{ fontSize:12, color:'rgba(204,235,229,.45)', lineHeight:1.6 }}>Our methodology is publicly documented. Read exactly how each data layer is weighted and how verdicts are computed.</p>
              </div>
              <div style={{ display:'flex', gap:12, flexShrink:0, flexWrap:'wrap' as const }}>
                {[
                  { icon: 'trophy',    label: '94% accuracy*',   sub: 'vs post-opening data' },
                  { icon: 'globe',     label: 'Australian only', sub: 'Localised benchmarks' },
                  { icon: 'refreshCw', label: 'Updated live',    sub: 'Per-analysis refresh' },
                ].map(t => (
                  <div key={t.label} style={{ textAlign:'center' as const, padding:'10px 16px', background:'rgba(16,185,129,.06)', border:'1px solid rgba(16,185,129,.15)', borderRadius:12 }}>
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}>
                      <LI n={t.icon} size={20} color='#34D399'/>
                    </div>
                    <p style={{ fontSize:12, fontWeight:800, color:'#34D399', lineHeight:1 }}>{t.label}</p>
                    <p style={{ fontSize:10, color:'rgba(204,235,229,.4)', marginTop:2 }}>{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'center' }}>
              <Link href="/methodology" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, color:'#34D399', textDecoration:'none' }}>
                Read full data methodology →
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pipe-flow {
            from { transform: translateX(-100%) }
            to   { transform: translateX(100%) }
          }
        `}</style>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: isMobile ? '72px 16px' : '100px 40px', background: L.white, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 50%, rgba(16,185,129,.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(5,150,105,.03) 0%, transparent 50%)', pointerEvents:'none' }}/>

        <div style={{ ...W, position:'relative', zIndex:2 }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 36 : 56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:L.emeraldXlt, border:`1px solid ${L.emeraldLt}`, borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:L.emerald, textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:16 }}>
              Customer stories
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight:900, color:L.slate, letterSpacing:'-.04em', marginBottom:12 }}>
              Real decisions. Real money saved.
            </h2>
            <p style={{ fontSize:15, color:L.muted, maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
              Founders and analysts across Australia use Locatalyze before signing a single lease.
            </p>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom: isMobile ? 32 : 48, flexWrap:'wrap' as const }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:L.mint, border:`1px solid ${L.emeraldLt}`, borderRadius:12, padding:'10px 20px' }}>
              <span style={{ fontSize:20, letterSpacing:2, color:'#F59E0B' }}>★★★★★</span>
              <div>
                <p style={{ fontSize:16, fontWeight:900, color:L.slate, lineHeight:1 }}>4.8 / 5</p>
                <p style={{ fontSize:10, color:L.muted, marginTop:1 }}>Average rating</p>
              </div>
            </div>
            {[
              { value:'$340k+', label:'In lease mistakes avoided†' },
              { value:'180+',   label:'Founders who analysed‡' },
              { value:'94%',    label:'Said reports were accurate*' },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center' as const }}>
                <p style={{ fontSize:22, fontWeight:900, color:L.emerald, letterSpacing:'-.03em', lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:11, color:L.muted, marginTop:3 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:18 }}>
            {[
              {
                quote:'I was sitting on the fence about a second location for months. Ran the analysis in under a minute — the feasibility score and competitor map made the decision obvious. We opened, and revenue is tracking above forecast.',
                name:'Steven B.', role:'VacDirect Australia', city:'Fairymeadow, NSW',
                initials:'SB', avatarBg:'#ECFDF5', avatarColor:'#059669',
                saved:'New store validated', savedColor:'#059669', savedBg:'#ECFDF5', savedBorder:'#A7F3D0',
                highlight:'Revenue tracking above forecast.',
                emoji:'🏪',
              },
              {
                quote:'Finding the right suburb for a Pizza Hut franchise is high stakes. You need demographics, competition density, foot traffic patterns. Locatalyze gave me a full picture in one report. Saved weeks of research.',
                name:'Hetsav C.', role:'Pizza Hut Franchisee', city:'NSW',
                initials:'HC', avatarBg:'#EFF6FF', avatarColor:'#3B82F6',
                saved:'Franchise site locked in', savedColor:'#3B82F6', savedBg:'#EFF6FF', savedBorder:'#BFDBFE',
                highlight:'Saved weeks of franchise research.',
                emoji:'🍕',
              },
              {
                quote:'Before I signed on a restaurant I was buying, I ran the location through Locatalyze. The demographic breakdown and competitor analysis gave me a proper understanding of what I was walking into. Went in with total confidence.',
                name:'Andrew W.', role:'Restaurant owner', city:'Perth, WA',
                initials:'AW', avatarBg:'#F5F3FF', avatarColor:'#8B5CF6',
                saved:'Restaurant acquisition validated', savedColor:'#8B5CF6', savedBg:'#F5F3FF', savedBorder:'#DDD6FE',
                highlight:'Bought with total confidence.',
                emoji:'🍽️',
              },
            ].map((t, i) => (
              <div key={i}
                style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 24px', display:'flex', flexDirection:'column' as const, transition:'all .22s', position:'relative' as const, overflow:'hidden' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = t.avatarColor + '55'
                  el.style.boxShadow = `0 16px 48px ${t.avatarColor}14`
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = L.border
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${t.avatarColor},${t.avatarColor}44)`, borderRadius:'22px 22px 0 0' }}/>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <span style={{ fontSize:13, color:'#F59E0B', letterSpacing:2 }}>★★★★★</span>
                  <span style={{ fontSize:18 }}>{t.emoji}</span>
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:t.savedBg, border:`1px solid ${t.savedBorder}`, borderRadius:8, padding:'4px 10px', marginBottom:14, alignSelf:'flex-start' as const }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:t.savedColor, flexShrink:0 }}/>
                  <span style={{ fontSize:10.5, fontWeight:700, color:t.savedColor }}>{t.highlight}</span>
                </div>
                <p style={{ fontSize:14, color:'#334155', lineHeight:1.8, marginBottom:20, flex:1 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:16, borderTop:`1px solid ${L.border}` }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:t.avatarBg, border:`2px solid ${t.savedBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:t.avatarColor, flexShrink:0 }}>
                    {t.initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:L.slate, lineHeight:1 }}>{t.name}</p>
                    <p style={{ fontSize:12, color:L.muted, marginTop:3 }}>{t.role} · {t.city}</p>
                  </div>
                  <div style={{ background:t.savedBg, border:`1px solid ${t.savedBorder}`, borderRadius:8, padding:'4px 8px', textAlign:'right' as const }}>
                    <p style={{ fontSize:9, fontWeight:700, color:t.savedColor, textTransform:'uppercase' as const, letterSpacing:'.06em', lineHeight:1.1 }}>
                      {t.saved}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:48, padding:'32px 24px', background:L.mint, borderRadius:20, border:`1px solid ${L.emeraldLt}` }}>
            <p style={{ fontSize: isMobile ? 17 : 21, fontWeight:900, color:L.slate, letterSpacing:'-.02em', marginBottom:8 }}>
              Ready to make a decision you can stand behind?
            </p>
            <p style={{ fontSize:13, color:L.muted, marginBottom:20 }}>3 full reports included on the free plan. No credit card required.</p>
            <Link href="/auth/signup" style={{ display:'inline-flex', alignItems:'center', gap:6, background:L.emerald, color:'#fff', borderRadius:12, padding:'13px 28px', fontWeight:800, fontSize:14, boxShadow:'0 4px 20px rgba(16,185,129,.25)', textDecoration:'none' }}>
              Analyse my location free →
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: sp, background: L.mint }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 10 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: L.muted }}>Start free. Upgrade only when you need more.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
            {/* Free */}
              {/* Free */}
              <div style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 24px' }}>
                <p style={{ fontSize:11, fontWeight:700, color:L.muted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Free</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                  <p style={{ fontSize:34, fontWeight:900, color:L.slate, letterSpacing:'-.03em' }}>$0</p>
                </div>
                <p style={{ fontSize:12, color:L.muted, marginBottom:18 }}>3 reports · no credit card</p>
                {['3 location reports','GO/CAUTION/NO verdict','Competitor map','Demographic breakdown'].map(f => (
                  <p key={f} style={{ fontSize:12, color:'#334155', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}><span style={{ color:L.emerald, fontWeight:700 }}>✓</span>{f}</p>
                ))}
                <Link href="/auth/signup" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, border:`1.5px solid ${L.border}`, borderRadius:11, fontSize:12, fontWeight:700, color:L.muted }}>Start free</Link>
              </div>

              {/* Pro */}
              <div style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 24px' }}>
                <p style={{ fontSize:11, fontWeight:700, color:L.muted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Pro</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                  <p style={{ fontSize:34, fontWeight:900, color:L.slate, letterSpacing:'-.03em' }}>$59</p>
                  <p style={{ fontSize:13, color:L.muted }}>/month</p>
                </div>
                <p style={{ fontSize:12, color:'#059669', fontWeight:600, marginBottom:4 }}>20 reports · ≈ $2.95 each</p>
                <p style={{ fontSize:12, color:L.muted, marginBottom:18 }}>Cancel anytime</p>
                {['20 reports per month','Location comparison','PDF export','Priority support'].map(f => (
                  <p key={f} style={{ fontSize:12, color:'#334155', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}><span style={{ color:L.emerald, fontWeight:700 }}>✓</span>{f}</p>
                ))}
                <Link href="/auth/signup" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, border:`1.5px solid ${L.emerald}`, borderRadius:11, fontSize:12, fontWeight:700, color:L.emerald }}>Start Pro</Link>
              </div>

              {/* Annual */}
              <div style={{ background:'linear-gradient(135deg,#0F766E 0%,#0891B2 100%)', borderRadius:22, padding:'26px 24px', position:'relative', boxShadow:'0 8px 32px rgba(15,118,110,.25)', marginTop: isMobile ? 16 : 0 }}>
                <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:L.amber, color:'#fff', borderRadius:100, padding:'4px 14px', fontSize:11, fontWeight:800, whiteSpace:'nowrap' }}>⭐ MOST POPULAR</div>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Annual</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                  <p style={{ fontSize:34, fontWeight:900, color:'#fff', letterSpacing:'-.03em' }}>$490</p>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>/year</p>
                </div>
                <p style={{ fontSize:12, color:'rgba(255,255,255,.7)', fontWeight:600, marginBottom:4 }}>240 reports · save $218</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,.45)', marginBottom:18 }}>vs $708 monthly</p>
                {['240 reports per year','Location comparison','PDF export','Priority support'].map(f => (
                  <p key={f} style={{ fontSize:12, color:'rgba(255,255,255,.85)', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}><span style={{ fontWeight:700 }}>✓</span>{f}</p>
                ))}
                <Link href="/auth/signup" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, background:'#fff', borderRadius:11, fontSize:12, fontWeight:800, color:'#0F766E' }}>Get Annual — $490/yr</Link>
              </div>

              {/* Business */}
              <div style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 24px' }}>
                <p style={{ fontSize:11, fontWeight:700, color:L.muted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Business</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                  <p style={{ fontSize:34, fontWeight:900, color:L.slate, letterSpacing:'-.03em' }}>$119</p>
                  <p style={{ fontSize:13, color:L.muted }}>/month</p>
                </div>
                <p style={{ fontSize:12, color:'#059669', fontWeight:600, marginBottom:4 }}>60 reports · ≈ $1.98 each</p>
                <p style={{ fontSize:12, color:L.muted, marginBottom:18 }}>Agencies & franchisees</p>
                {['60 reports per month','Location comparison','PDF export','Team sharing (soon)','API access (soon)'].map(f => (
                  <p key={f} style={{ fontSize:12, color:'#334155', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}><span style={{ color:L.emerald, fontWeight:700 }}>✓</span>{f}</p>
                ))}
                <Link href="/auth/signup" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, border:`1.5px solid ${L.border}`, borderRadius:11, fontSize:12, fontWeight:700, color:L.muted }}>Start Business</Link>
              </div>
            </div>
          </div>

      {/* FINAL CTA */}
      <section style={{ padding: sp, background: L.white, textAlign: 'center', borderTop: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: pad }}>
          <h2 style={{ fontSize: isMobile ? 30 : 44, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 14, lineHeight: 1.1 }}>
            Don&apos;t sign a lease<br/>without running this first.
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: L.muted, marginBottom: 32, lineHeight: 1.75 }}>
            The average location mistake costs $200,000+. A Locatalyze report is free to start.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: L.emerald, color: '#fff', borderRadius: 14, padding: isMobile ? '15px 28px' : '17px 38px', fontWeight: 800, fontSize: isMobile ? 15 : 17, boxShadow: '0 6px 28px rgba(16,185,129,.3)', textDecoration: 'none' }}>
            Analyse your first location free →
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontSize: 12, color: '#94A3B8', marginTop: 14, flexWrap: 'wrap' }}>
            <span>✓ No credit card</span><span>·</span><span>✓ 3 free reports</span><span>·</span><span>✓ 30 seconds</span>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}