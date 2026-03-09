'use client'
import Footer from '@/components/Footer'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Design tokens ──────────────────────────────────────────────────
const L = {
  // Light sections
  white:      '#FFFFFF',
  mint:       '#F0FDF4',
  emerald:    '#10B981',
  emeraldDk:  '#059669',
  emeraldLt:  '#D1FAE5',
  emeraldXlt: '#ECFDF5',
  slate:      '#0F172A',
  muted:      '#64748B',
  border:     '#E2E8F0',
  // Verdicts
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

// Dark showcase tokens
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

// ── Product Demo ──────────────────────────────────────────────────
function ProductDemo() {
  const [phase, setPhase] = useState(0)
  const [typed, setTyped]   = useState('')
  const [progress, setProgress] = useState(0)
  const [score, setScore]   = useState(0)
  const addr = '45 King St, Newtown NSW'

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase(1); let i = 0
      const ty = setInterval(() => {
        i++; setTyped(addr.slice(0, i))
        if (i >= addr.length) {
          clearInterval(ty)
          setTimeout(() => {
            setPhase(2); let p = 0
            const pr = setInterval(() => {
              p += 2; setProgress(p)
              if (p >= 100) {
                clearInterval(pr); setPhase(3); let s = 0
                const sc = setInterval(() => { s += 2; setScore(Math.min(s, 82)); if (s >= 82) clearInterval(sc) }, 20)
              }
            }, 40)
          }, 500)
        }
      }, 55)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  const msgs = ['Resolving coordinates...','Scanning competitors...','Analysing demographics...','Building financial model...','Generating verdict...']
  const mi = Math.min(Math.floor(progress / 22), msgs.length - 1)

  return (
    <div style={{ background: L.white, borderRadius: 18, border: `1px solid ${L.border}`, boxShadow: '0 12px 48px rgba(0,0,0,.1)', overflow: 'hidden', width: '100%', maxWidth: 440 }}>
      {/* Browser chrome */}
      <div style={{ background: '#F8FAFC', borderBottom: `1px solid ${L.border}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FFBE2E','#27C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
        </div>
        <div style={{ flex: 1, background: L.border, borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          <span style={{ fontSize: 11, color: L.muted }}>locatalyze.vercel.app/analyse</span>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: L.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>Business Address</p>
        <div style={{ background: '#F8FAFC', border: `1.5px solid ${phase >= 1 ? L.emerald : L.border}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: L.slate, fontWeight: 500, minHeight: 38, transition: 'border-color .3s', display: 'flex', alignItems: 'center', gap: 2, marginBottom: 12 }}>
          {typed || <span style={{ color: '#CBD5E1' }}>Enter address...</span>}
          {phase === 1 && <span style={{ width: 2, height: 14, background: L.emerald, display: 'inline-block', animation: 'blink .7s infinite' }}/>}
        </div>
        {phase === 2 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: L.muted }}>{msgs[mi]}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: L.emerald }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: L.border, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${L.emerald},#34D399)`, borderRadius: 100, transition: 'width .1s linear' }}/>
            </div>
          </div>
        )}
        {phase === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ background: L.goBg, color: L.go, border: `1.5px solid ${L.goBdr}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 800 }}>✅ GO</span>
              <div style={{ position: 'relative', width: 56, height: 56 }}>
                <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="28" cy="28" r="22" fill="none" stroke={L.border} strokeWidth="5"/>
                  <circle cx="28" cy="28" r="22" fill="none" stroke={L.emerald} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*22}`} strokeDashoffset={`${2*Math.PI*22*(1-score/100)}`}
                    style={{ transition: 'stroke-dashoffset .05s linear' }}/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: L.emerald, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: 8, color: L.muted }}>/100</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
              {[{l:'Annual Profit',v:'$297,600',hi:true},{l:'Monthly Revenue',v:'$91,200',hi:false},{l:'Break-even/Day',v:'38 customers',hi:false},{l:'Payback Period',v:'7 months',hi:false}].map(m => (
                <div key={m.l} style={{ background: m.hi ? L.emeraldXlt : '#F8FAFC', borderRadius: 8, border: `1px solid ${m.hi ? L.emeraldLt : L.border}`, padding: '8px 10px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: L.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{m.l}</p>
                  <p style={{ fontSize: 12, fontWeight: 800, color: m.hi ? L.emerald : L.slate }}>{m.v}</p>
                </div>
              ))}
            </div>
            {[{l:'Demand',s:85},{l:'Rent',s:78},{l:'Competition',s:72},{l:'Profitability',s:90}].map(b => (
              <div key={b.l} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: L.muted }}>{b.l}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: L.emerald }}>{b.s}</span>
                </div>
                <div style={{ height: 3, background: L.border, borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.s}%`, background: L.emerald, borderRadius: 100 }}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
      <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 8 }}>📍 142 Bourke St, Melbourne VIC</p>
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
        <div><p style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>📍 88 Oxford St, Darlinghurst NSW</p><p style={{ fontSize: 13, fontWeight: 700, color: D.text1 }}>Feasibility Report</p></div>
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
      {/* Mesh BG */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(15,118,110,.2) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(6,95,70,.18) 0%, transparent 55%), linear-gradient(160deg, #061412 0%, #030C0B 50%, #071814 100%)' }}/>
      {/* Top glow line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.5) 50%, transparent)', zIndex: 5 }}/>
      {/* Bottom glow line */}
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
              <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4B5563' }}>app.locatalyze.com.au/analyse</div>
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

// ── ScoreBar (sample report) ──────────────────────────────────────
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: L.muted, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 5, background: L.border, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 100 }}/>
      </div>
    </div>
  )
}

// ── How It Works animated demo (light theme) ─────────────────────
function HowItWorksDemo() {
  const [phase, setPhase]       = useState(0)
  const [typed, setTyped]       = useState('')
  const [progress, setProgress] = useState(0)
  const [score, setScore]       = useState(0)
  const [key, setKey]           = useState(0)
  const addr = '45 King St, Newtown NSW'

  useEffect(() => {
    let cancelled = false
    setPhase(0); setTyped(''); setProgress(0); setScore(0)
    const t1 = setTimeout(() => {
      if (cancelled) return
      setPhase(1); let i = 0
      const ty = setInterval(() => {
        if (cancelled) { clearInterval(ty); return }
        i++; setTyped(addr.slice(0, i))
        if (i >= addr.length) {
          clearInterval(ty)
          const t2 = setTimeout(() => {
            if (cancelled) return
            setPhase(2); let p = 0
            const pr = setInterval(() => {
              if (cancelled) { clearInterval(pr); return }
              p += 2; setProgress(p)
              if (p >= 100) {
                clearInterval(pr); setPhase(3); let s = 0
                const sc = setInterval(() => {
                  if (cancelled) { clearInterval(sc); return }
                  s += 2; setScore(Math.min(s, 82))
                  if (s >= 82) clearInterval(sc)
                }, 20)
              }
            }, 40)
          }, 500)
          return () => clearTimeout(t2)
        }
      }, 55)
    }, 600)
    // Auto-replay every 15s
    const replay = setTimeout(() => { if (!cancelled) setKey(k => k + 1) }, 15000)
    return () => { cancelled = true; clearTimeout(t1); clearTimeout(replay) }
  }, [key])

  const msgs = ['Resolving coordinates…','Scanning competitors…','Analysing demographics…','Building financial model…','Generating verdict…']
  const mi = Math.min(Math.floor(progress / 22), msgs.length - 1)

  return (
    <div style={{ background: L.white, borderRadius: 16, border: `1px solid ${L.border}`, boxShadow: '0 4px 24px rgba(0,0,0,.08)', overflow: 'hidden', width: '100%', maxWidth: 400 }}>
      {/* Browser chrome */}
      <div style={{ background: '#F8FAFC', borderBottom: `1px solid ${L.border}`, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FFBE2E','#27C840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }}/>)}
        </div>
        <div style={{ flex: 1, background: L.border, borderRadius: 5, height: 20, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          <span style={{ fontSize: 10, color: L.muted }}>locatalyze.vercel.app/analyse</span>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 5 }}>Business Address</p>
        <div style={{ background: '#F8FAFC', border: `1.5px solid ${phase >= 1 ? L.emerald : L.border}`, borderRadius: 9, padding: '8px 11px', fontSize: 13, color: L.slate, fontWeight: 500, minHeight: 36, transition: 'border-color .3s', display: 'flex', alignItems: 'center', gap: 2, marginBottom: 12 }}>
          {typed || <span style={{ color: '#CBD5E1' }}>Enter address...</span>}
          {phase === 1 && <span style={{ width: 2, height: 13, background: L.emerald, display: 'inline-block', animation: 'blink .7s infinite' }}/>}
        </div>

        {phase === 2 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: L.muted }}>{msgs[mi]}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: L.emerald }}>{progress}%</span>
            </div>
            <div style={{ height: 5, background: L.emeraldXlt, borderRadius: 100, overflow: 'hidden', border: `1px solid ${L.emeraldLt}` }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${L.emerald},#34D399)`, borderRadius: 100, transition: 'width .1s linear' }}/>
            </div>
          </div>
        )}

        {phase === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ background: L.goBg, color: L.go, border: `1.5px solid ${L.goBdr}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 800 }}>✅ GO — Strong</span>
              <div style={{ position: 'relative', width: 52, height: 52 }}>
                <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="26" cy="26" r="21" fill="none" stroke={L.emeraldLt} strokeWidth="5"/>
                  <circle cx="26" cy="26" r="21" fill="none" stroke={L.emerald} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*21}`} strokeDashoffset={`${2*Math.PI*21*(1-score/100)}`}
                    style={{ transition: 'stroke-dashoffset .05s linear' }}/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: L.emerald, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: 7, color: L.muted }}>/100</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
              {[{l:'Annual Profit',v:'$297,600',hi:true},{l:'Monthly Revenue',v:'$91,200',hi:false},{l:'Break-even/Day',v:'38 customers',hi:false},{l:'Payback Period',v:'7 months',hi:false}].map(m => (
                <div key={m.l} style={{ background: m.hi ? L.emeraldXlt : '#F8FAFC', borderRadius: 8, border: `1px solid ${m.hi ? L.emeraldLt : L.border}`, padding: '7px 9px' }}>
                  <p style={{ fontSize: 8, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 2 }}>{m.l}</p>
                  <p style={{ fontSize: 11, fontWeight: 800, color: m.hi ? L.emerald : L.slate }}>{m.v}</p>
                </div>
              ))}
            </div>

            {[{l:'Demand',s:85},{l:'Rent',s:78},{l:'Competition',s:72},{l:'Profitability',s:90}].map(b => (
              <div key={b.l} style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: L.muted }}>{b.l}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: L.emerald }}>{b.s}</span>
                </div>
                <div style={{ height: 3, background: L.emeraldXlt, borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.s}%`, background: L.emerald, borderRadius: 100 }}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {phase === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: L.muted, fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
            Starting demo…
          </div>
        )}
      </div>
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

  const sampleReports = {
    go: {
      biz: 'Specialty Coffee Shop', location: 'Subiaco, WA', verdict: 'GO', score: 82,
      revenue: '$91,200', profit: '$24,800', annualProfit: '$297,600', breakeven: '38 customers/day', payback: '7 months',
      scores: [{label:'Demand & Demographics',score:85,color:L.go},{label:'Rent Affordability',score:78,color:L.go},{label:'Competition',score:72,color:L.go},{label:'Profitability',score:90,color:L.go}],
      swot: { strengths:['Strong foot traffic from professionals','High disposable income area'], weaknesses:['Competitive market with established brands'], opportunities:['Growing brunch culture in the area'], threats:['Rising commercial rents in suburb'] },
      rec: 'Strong opportunity. High demand demographics combined with manageable competition makes this an excellent location.',
    },
    caution: {
      biz: 'Casual Dining Restaurant', location: 'Fremantle, WA', verdict: 'CAUTION', score: 61,
      revenue: '$74,400', profit: '$11,200', annualProfit: '$134,400', breakeven: '52 customers/day', payback: '14 months',
      scores: [{label:'Demand & Demographics',score:68,color:L.caution},{label:'Rent Affordability',score:55,color:L.caution},{label:'Competition',score:60,color:L.caution},{label:'Profitability',score:62,color:L.caution}],
      swot: { strengths:['High tourist foot traffic in peak season'], weaknesses:['Strong seasonal demand fluctuation'], opportunities:['Underserved dinner market on weekdays'], threats:['8 direct competitors within 500m'] },
      rec: 'Proceed with caution. Seasonal tourism dependency creates revenue instability.',
    },
    no: {
      biz: 'Boutique Gym', location: 'Joondalup, WA', verdict: 'NO', score: 44,
      revenue: '$51,000', profit: '$3,200', annualProfit: '$38,400', breakeven: '74 customers/day', payback: 'Not viable',
      scores: [{label:'Demand & Demographics',score:48,color:L.danger},{label:'Rent Affordability',score:38,color:L.danger},{label:'Competition',score:42,color:L.danger},{label:'Profitability',score:46,color:L.danger}],
      swot: { strengths:['Large residential catchment area'], weaknesses:['4 established gyms already nearby'], opportunities:['Limited group fitness options'], threats:['High rent consuming 34% of projected revenue'] },
      rec: 'Not recommended. Oversaturated fitness market with insufficient margin.',
    },
  }

  const r  = sampleReports[activeTab]
  const vc = activeTab === 'go'
    ? { bg: L.goBg,       text: L.go,      border: L.goBdr,      icon: '✅' }
    : activeTab === 'caution'
    ? { bg: L.cautionBg,  text: L.caution, border: L.cautionBdr, icon: '⚠️' }
    : { bg: L.dangerBg,   text: L.danger,  border: L.dangerBdr,  icon: '🚫' }

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

      {/* ── NAV ── */}
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

      {/* Mobile menu */}
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

      {/* ══ HERO — White ══════════════════════════════════════ */}
      <section style={{ paddingTop: isMobile ? 80 : 100, paddingBottom: isMobile ? 56 : 80, background: L.white, position: 'relative', overflow: 'hidden' }}>
        {/* Soft mint gradient at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: `linear-gradient(to top, ${L.mint}, transparent)`, pointerEvents: 'none' }}/>
        <div style={{ ...W, padding: pad, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 60, alignItems: 'center' }}>

            {/* Copy */}
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

              {/* Stats */}
              <div style={{ display: 'flex', gap: isMobile ? 20 : 28, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${L.border}`, flexWrap: 'wrap' }}>
                {[{value:'1,200+',label:'founders analysed'},{value:'4,800+',label:'locations scored'},{value:'94%',label:'accuracy rating'}].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: L.emerald, letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ProductDemo/>
            </div>
          </div>
        </div>
      </section>

      {/* ══ NICHE STRIP ══════════════════════════════════════ */}
      <div style={{ background: L.slate, padding: `12px ${isMobile ? 16 : 40}px` }}>
        <div style={{ ...W, display: 'flex', justifyContent: 'center', gap: isMobile ? 14 : 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Built for</p>
          {['☕ Cafes','🍽️ Restaurants','👗 Retail','💪 Gyms','🥐 Bakeries','💈 Salons'].map(b => (
            <span key={b} style={{ fontSize: isMobile ? 12 : 13, color: '#64748B', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* ══ DARK SHOWCASE ════════════════════════════════════ */}
      {!isMobile && <DarkShowcase/>}

      {/* Mobile version of showcase (simplified) */}
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

      {/* ══ HOW IT WORKS — Mint ══════════════════════════════ */}
      <section id="how-it-works" style={{ padding: sp, background: L.mint }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 12 }}>From address to verdict in 30 seconds</h2>
            <p style={{ fontSize: 15, color: L.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>No spreadsheets. No consultants. Just paste the address.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 18 }}>
            {[
              {n:'01',icon:'📍',title:'Enter your location',desc:'Type any Australian address. Add your business type, monthly rent and average order size. Takes 60 seconds.'},
              {n:'02',icon:'⚙️',title:'AI analyses in real time',desc:'We pull live competitor data, demographics, rental benchmarks and foot traffic signals — all automatically.'},
              {n:'03',icon:'📊',title:'Get your full report',desc:'GO / CAUTION / NO verdict with full financial model, SWOT analysis and 3-year projection.'},
            ].map(s => (
              <div key={s.n} style={{ background: L.white, borderRadius: 22, border: `1px solid rgba(0,0,0,.04)`, padding: '32px 26px', boxShadow: '0 2px 16px rgba(0,0,0,.05)', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 14px 36px rgba(16,185,129,.12)' }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 2px 16px rgba(0,0,0,.05)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: L.emerald, color: '#fff', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 4px 12px rgba(16,185,129,.3)' }}>{s.n}</div>
                <span style={{ fontSize: 26, display: 'block', marginBottom: 12 }}>{s.icon}</span>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: L.slate, marginBottom: 9 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: L.muted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Live animated demo ── */}
          <div style={{ marginTop: 48, background: L.white, borderRadius: 24, border: `1px solid ${L.border}`, boxShadow: '0 4px 28px rgba(0,0,0,.06)', overflow: 'hidden' }}>
            {/* Demo header */}
            <div style={{ background: L.emeraldXlt, borderBottom: `1px solid ${L.emeraldLt}`, padding: isMobile ? '16px 20px' : '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 10 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: L.emerald, marginBottom: 2 }}>🎬 Watch it in action</p>
                <p style={{ fontSize: 12, color: L.muted }}>See a real analysis run from address to verdict — auto-replays every 15 seconds.</p>
              </div>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emerald, color: '#fff', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 10px rgba(16,185,129,.25)', whiteSpace: 'nowrap' as const }}>
                Try it yourself →
              </Link>
            </div>

            {/* Two-column: steps list + live widget */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
              {/* Left: what happens */}
              <div style={{ padding: isMobile ? '24px 20px' : '36px 40px', borderRight: isMobile ? 'none' : `1px solid ${L.border}`, borderBottom: isMobile ? `1px solid ${L.border}` : 'none' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 22 }}>What happens under the hood</p>
                {[
                  { icon: '📍', title: 'Address resolved',      detail: '45 King St, Newtown NSW 2042' },
                  { icon: '🗺️', title: 'Competitors scanned',   detail: '6 businesses found within 500m' },
                  { icon: '👥', title: 'Demographics loaded',    detail: 'ABS Census — high income suburb' },
                  { icon: '💰', title: 'Financial model built',  detail: 'Rent viability + break-even calc' },
                  { icon: '📊', title: 'Verdict generated',      detail: 'GO — score 82 / 100' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: L.emeraldXlt, border: `1.5px solid ${L.emeraldLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1, paddingTop: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: L.slate }}>{item.title}</p>
                        <span style={{ fontSize: 11, color: L.emerald, fontWeight: 700 }}>✓</span>
                      </div>
                      <p style={{ fontSize: 12, color: L.muted }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: live demo */}
              <div style={{ padding: isMobile ? '24px 20px' : '36px 40px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', background: '#F8FBFA' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 18, alignSelf: 'flex-start' as const }}>Live preview</p>
                <HowItWorksDemo/>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ══ SAMPLE REPORT — White ════════════════════════════ */}
      <section id="sample-report" style={{ padding: sp, background: L.white }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Sample report</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 10 }}>See exactly what you get</h2>
            <p style={{ fontSize: 15, color: L.muted }}>Select a verdict to see how each scenario looks.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            {(['go','caution','no'] as const).map(v => (
              <button key={v} onClick={() => setActiveTab(v)} style={{
                padding: isMobile ? '9px 16px' : '11px 24px', borderRadius: 10, border: 'none', fontSize: isMobile ? 12 : 14, fontWeight: 700,
                background: activeTab === v ? (v==='go'?L.emerald:v==='caution'?L.caution:L.danger) : L.white,
                color: activeTab === v ? '#fff' : L.muted,
                boxShadow: activeTab === v ? '0 4px 16px rgba(0,0,0,.15)' : '0 1px 3px rgba(0,0,0,.06)',
                outline: activeTab === v ? 'none' : `1.5px solid ${L.border}`,
              }}>
                {v==='go'?'✅ GO verdict':v==='caution'?'⚠️ CAUTION':'🚫 NO verdict'}
              </button>
            ))}
          </div>

          {/* Report card */}
          <div style={{ background: L.white, borderRadius: 24, border: `1px solid ${L.border}`, boxShadow: '0 8px 48px rgba(0,0,0,.08)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg,#0F766E 0%,#0891B2 100%)`, padding: isMobile ? '24px 20px' : '32px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 4 }}>📍 {r.location}</p>
                  <h3 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900, color: '#fff', letterSpacing: '-.02em', marginBottom: 12 }}>{r.biz}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: vc.bg, color: vc.text, border: `1.5px solid ${vc.border}`, borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 800 }}>
                    {vc.icon} {r.verdict} Verdict
                  </span>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ position: 'relative', width: isMobile ? 72 : 96, height: isMobile ? 72 : 96 }}>
                    <svg width={isMobile?72:96} height={isMobile?72:96} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={isMobile?36:48} cy={isMobile?36:48} r={isMobile?28:38} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="8"/>
                      <circle cx={isMobile?36:48} cy={isMobile?36:48} r={isMobile?28:38} fill="none" stroke={vc.text} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2*Math.PI*(isMobile?28:38)}`} strokeDashoffset={`${2*Math.PI*(isMobile?28:38)*(1-r.score/100)}`}/>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: isMobile?20:26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{r.score}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' }}>/100</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>Score</p>
                </div>
              </div>
            </div>

            <div style={{ padding: isMobile ? '20px 16px' : '32px 40px' }}>
              <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: vc.text, lineHeight: 1.7 }}>💡 <strong>AI Verdict:</strong> {r.rec}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 32 }}>
                {/* Financials */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Key Financials</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                    {[{l:'Monthly Revenue',v:r.revenue,hi:false},{l:'Monthly Profit',v:r.profit,hi:false},{l:'Annual Profit',v:r.annualProfit,hi:true},{l:'Payback Period',v:r.payback,hi:false}].map(m => (
                      <div key={m.l} style={{ background: m.hi ? L.emeraldXlt : '#F8FAFC', borderRadius: 10, border: `1px solid ${m.hi ? L.emeraldLt : L.border}`, padding: '12px 14px' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: L.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{m.l}</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: m.hi ? L.emerald : L.slate }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Score Breakdown</p>
                  {r.scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color}/>)}
                </div>
                {/* SWOT */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>SWOT Analysis</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      {key:'strengths',icon:'💪',items:r.swot.strengths,bg:L.goBg,border:L.goBdr,text:'#065F46'},
                      {key:'weaknesses',icon:'⚠️',items:r.swot.weaknesses,bg:L.cautionBg,border:L.cautionBdr,text:'#92400E'},
                      {key:'opportunities',icon:'🚀',items:r.swot.opportunities,bg:'#EFF6FF',border:'#BFDBFE',text:'#1D4ED8'},
                      {key:'threats',icon:'🔴',items:r.swot.threats,bg:L.dangerBg,border:L.dangerBdr,text:'#991B1B'},
                    ].map(sw => (
                      <div key={sw.key} style={{ background: sw.bg, border: `1px solid ${sw.border}`, borderRadius: 10, padding: '10px 12px' }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: sw.text, marginBottom: 4, textTransform: 'uppercase' }}>{sw.icon} {sw.key}</p>
                        {sw.items.map((item,i) => <p key={i} style={{ fontSize: 12, color: sw.text, opacity: .85 }}>· {item}</p>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${L.border}`, padding: isMobile ? 16 : '20px 40px', background: L.mint, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
              <p style={{ fontSize: 13, color: L.muted }}>This is a sample. Your real report uses live data for your exact address.</p>
              <Link href="/auth/signup" style={{ background: L.emerald, color: '#fff', borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 10px rgba(16,185,129,.25)', whiteSpace: 'nowrap' }}>
                Get my report free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DATA SOURCES — Mint ════════════════════════════════ */}
      <section style={{ padding: sp, background: L.mint }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Data sources</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 10 }}>Where the data comes from</h2>
            <p style={{ fontSize: 15, color: L.muted }}>Every report is built on real, live data — not guesses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: 14 }}>
            {[
              {icon:'🗺️',title:'Google Maps & Places',desc:'Real competitor locations within 500m.'},
              {icon:'👥',title:'Demographics',desc:'Population, income and spending by suburb.'},
              {icon:'🏠',title:'Rental Benchmarks',desc:'Commercial rent estimates for your area.'},
              {icon:'📊',title:'Competition Scoring',desc:'Intensity rating from competitor data.'},
              {icon:'🤖',title:'AI Financial Model',desc:'Break-even and 3-year projections.'},
              {icon:'📈',title:'Market Demand',desc:'Search trends and foot traffic signals.'},
            ].map(d => (
              <div key={d.title} style={{ background: L.white, border: `1px solid rgba(0,0,0,.04)`, borderRadius: 18, padding: isMobile ? '18px 14px' : '24px 20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 10px 28px rgba(16,185,129,.1)' }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 2px 12px rgba(0,0,0,.05)' }}>
                <div style={{ width: 40, height: 40, background: L.emeraldXlt, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>{d.icon}</div>
                <h3 style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: L.slate, marginBottom: 5 }}>{d.title}</h3>
                <p style={{ fontSize: isMobile ? 12 : 13, color: L.muted, lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/methodology" style={{ fontSize: 13, color: L.emerald, fontWeight: 700 }}>Read full data methodology →</Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS — White ══════════════════════════════ */}
      <section style={{ padding: sp, background: L.white }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>What founders say</div>
            <h2 style={{ fontSize: isMobile ? 26 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em' }}>Used by founders across Australia</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {[
              {quote:'I was about to sign a 3-year lease. Locatalyze gave me a NO verdict and saved me from a $180k mistake. The competition data was spot on.',name:'Sarah M.',role:'Cafe owner, Melbourne'},
              {quote:'Compared 4 locations in 10 minutes. The comparison tool is brilliant — picked the site with the highest profit potential immediately.',name:'James T.',role:'Franchise buyer, Sydney'},
              {quote:'As a commercial real estate analyst I use this with clients. The financial model is genuinely useful for early-stage feasibility.',name:'Priya K.',role:'Property analyst, Brisbane'},
            ].map(t => (
              <div key={t.name} style={{ background: L.white, border: `1.5px solid ${L.border}`, borderRadius: 20, padding: 26, transition: 'all .2s' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor=L.emeraldLt; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 28px rgba(16,185,129,.08)'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)' }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor=L.border; (e.currentTarget as HTMLElement).style.boxShadow='none'; (e.currentTarget as HTMLElement).style.transform='translateY(0)' }}>
                <p style={{ fontSize: 14, color: L.amber, marginBottom: 12, letterSpacing: 2 }}>★★★★★</p>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.75, marginBottom: 18 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ paddingTop: 14, borderTop: `1px solid ${L.border}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: L.slate }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING — Mint ════════════════════════════════════ */}
      <section id="pricing" style={{ padding: sp, background: L.mint }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 10 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: L.muted }}>Start free. Upgrade only when you need more.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
            {/* Free */}
            <div style={{ background: L.white, border: `1.5px solid ${L.border}`, borderRadius: 22, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: L.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Free</p>
              <p style={{ fontSize: 38, fontWeight: 900, color: L.slate, marginBottom: 4, letterSpacing: '-.03em' }}>$0</p>
              <p style={{ fontSize: 13, color: L.muted, marginBottom: 22 }}>Forever free</p>
              {['3 location reports','Full financial model','SWOT analysis','PDF download'].map(f => (
                <p key={f} style={{ fontSize: 13, color: '#334155', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: L.emerald, fontWeight: 700 }}>✓</span>{f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: 11, border: `1.5px solid ${L.border}`, borderRadius: 11, fontSize: 13, fontWeight: 700, color: L.slate }}>
                Get started free
              </Link>
            </div>
            {/* Monthly */}
            <div style={{ background: L.white, border: `1.5px solid ${L.border}`, borderRadius: 22, padding: 26, boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: L.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Pro Monthly</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <p style={{ fontSize: 38, fontWeight: 900, color: L.slate, letterSpacing: '-.03em' }}>$19</p>
                <p style={{ fontSize: 13, color: L.muted }}>/month</p>
              </div>
              <p style={{ fontSize: 13, color: L.muted, marginBottom: 22 }}>Cancel anytime</p>
              {['Unlimited reports','Location comparison','PDF export','Priority support'].map(f => (
                <p key={f} style={{ fontSize: 13, color: '#334155', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: L.emerald, fontWeight: 700 }}>✓</span>{f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: 11, border: `1.5px solid ${L.emerald}`, borderRadius: 11, fontSize: 13, fontWeight: 700, color: L.emerald }}>
                Start monthly
              </Link>
            </div>
            {/* Lifetime */}
            <div style={{ background: `linear-gradient(135deg,#0F766E 0%,#0891B2 100%)`, borderRadius: 22, padding: 26, position: 'relative', boxShadow: '0 8px 32px rgba(15,118,110,.25)', marginTop: isMobile ? 16 : 0 }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: L.amber, color: '#fff', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>BEST VALUE</div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Pro Lifetime</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <p style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-.03em' }}>$49</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>one-time</p>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 22 }}>Pay once, use forever</p>
              {['Unlimited reports','Location comparison','PDF export','Priority support'].map(f => (
                <p key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontWeight: 700 }}>✓</span>{f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: 11, background: '#fff', borderRadius: 11, fontSize: 13, fontWeight: 800, color: '#0F766E' }}>
                Get lifetime access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA — White ════════════════════════════════ */}
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