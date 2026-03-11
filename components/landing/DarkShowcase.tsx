'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { D, font, LI } from './tokens'

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

export default function DarkShowcase() {
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

      <div style={{ position: 'relative', zIndex: 5, padding: '72px 40px 80px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
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

      <div style={{ position: 'relative', zIndex: 5, height: 2, background: 'rgba(255,255,255,.04)' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg,${D.brand},${D.bl})`, width: `${((idx+1)/SHOWCASE_TABS.length)*100}%`, transition: 'width .4s ease' }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '24px 20px 32px', background: 'rgba(3,12,11,.55)', borderTop: '1px solid rgba(255,255,255,.04)' }}>
        <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${D.brand},#0B9488)`, color: '#fff', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none', fontFamily: font, boxShadow: '0 6px 24px rgba(15,118,110,.35)' }}>
          Analyse my location free →
        </Link>
        <p style={{ fontSize: 11, color: D.text3, marginTop: 8 }}>No credit card · Any Australian address · 30 seconds</p>
      </div>
    </div>
  )
}
