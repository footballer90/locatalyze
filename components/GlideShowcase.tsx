// No external icon imports - using inline SVGs
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const TABS = [
 {
    id: 'location-analysis', label: 'Location Analysis', accent: '#0F766E',
  photo: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  headline: 'Location intelligence,\nilluminated.',
  sub: 'Understand exactly what makes a location work — or fail. Analyse foot traffic, demographics and proximity to demand generators before you commit to a single dollar of rent.',
  cta: 'See how it works', ui: 'score',
 },
  {
    id: 'suburb-scoring', label: 'Suburb Scoring', accent: '#0891B2',
  photo: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80',
  headline: 'Every suburb scored\nfor your business.',
  sub: 'Compare suburbs side by side using income data, population density, age profile and spending behaviour. Find where your concept has the strongest natural advantage.',
  cta: 'Explore suburb scores', ui: 'suburbs',
 },
  {
    id: 'competitor-mapping', label: 'Competitor Mapping', accent: '#7C3AED',
  photo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
  headline: 'See every competitor\nbefore they see you.',
  sub: 'Map every direct competitor within your chosen radius. Understand their ratings, proximity and threat level — and find the gaps where your concept can own the category.',
  cta: 'Map competitors now', ui: 'competitors',
 },
  {
    id: 'rent-affordability', label: 'Rent Affordability', accent: '#D97706',
  photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
  headline: 'Know if the rent\nmakes financial sense.',
  sub: 'Enter your expected rent and average transaction value. Locatalyze calculates the exact daily volume you need to stay profitable — and tells you if this location can deliver it.',
  cta: 'Run a rent analysis', ui: 'rent',
 },
  {
    id: 'feasibility-reports', label: 'Feasibility Reports', accent: '#DC2626',
  photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80',
  headline: 'A full report,\nin 30 seconds.',
  sub: 'Get a complete feasibility report covering demand, competition, demographics and financials. Share it with your accountant, investor or landlord as a professional PDF — instantly.',
  cta: 'See a sample report', ui: 'report',
 },
]

const SCORE_BARS = [
  { label: 'Foot Traffic', pct: 85, color: '#34D399', val: 'High' },
 { label: 'Demographics', pct: 78, color: '#34D399', val: 'Strong' },
 { label: 'Competition', pct: 52, color: '#FBBF24', val: 'Moderate' },
 { label: 'Rent Ratio',  pct: 82, color: '#34D399', val: '9.2%' },
]

function ScoreUI({ animKey }: { animKey: number }) {
 const [score, setScore] = useState(0)
  const [bars, setBars] = useState(false)
  useEffect(() => {
    setScore(0); setBars(false)
    let n = 0
    const t = setInterval(() => {
      n = Math.min(n + 2, 84); setScore(n)
      if (n >= 84) { clearInterval(t); setBars(true) }
    }, 18)
    return () => clearInterval(t)
  }, [animKey])
  const offset = 188 - (188 * score / 100)
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}> 142 Bourke St, Melbourne VIC</p>
   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
    <div style={{ position: 'relative', width: 72, height: 72 }}>
     <svg viewBox="0 0 60 60" width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
      <defs><linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0F766E"/><stop offset="100%" stopColor="#14B8A6"/></linearGradient></defs>
      <circle fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6" cx="30" cy="30" r="24"/>
      <circle fill="none" stroke="url(#rg2)" strokeWidth="6" strokeLinecap="round" cx="30" cy="30" r="24" strokeDasharray="188" strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset .05s linear' }}/>
     </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 900, color: '#F0FDF9' }}>{score}</div>
    </div>
        <div style={{ background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.28)', borderRadius: 9, padding: '7px 14px', textAlign: 'center', opacity: score >= 84 ? 1 : 0, transition: 'opacity .4s' }}>
     <p style={{ fontSize: 17, fontWeight: 900, color: '#34D399' }}>GO </p>
     <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Verdict</p>
    </div>
      </div>
      {SCORE_BARS.map((b, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{b.label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.val}</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: b.color, borderRadius: 2, width: bars ? `${b.pct}%` : '0%', transition: `width 1.1s ease ${i * 0.12}s` }}/>
     </div>
        </div>
      ))}
    </div>
  )
}

function SuburbsUI() {
  const rows = [
    { name: 'Fitzroy VIC 3065', score: 92, badge: 'Top Pick', bc: '#059669' },
  { name: 'Newtown NSW 2042', score: 87, badge: 'Strong', bc: '#0F766E' },
  { name: 'Subiaco WA 6008', score: 83, badge: 'Strong', bc: '#0F766E' },
  { name: 'New Farm QLD 4005', score: 79, badge: 'Good', bc: '#D97706' },
  { name: 'Leederville WA 6007', score: 74, badge: 'Good', bc: '#D97706' },
 ]
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#F0FDF9', marginBottom: 14 }}>Top Suburbs for Cafés</p>
   {rows.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', marginBottom: 6, borderRadius: 9, background: i === 0 ? 'rgba(15,118,110,.14)' : 'rgba(255,255,255,.03)', border: `1px solid ${i === 0 ? 'rgba(15,118,110,.3)' : 'rgba(255,255,255,.06)'}` }}>
     <span style={{ fontSize: 12, fontWeight: 800, color: '#14B8A6', width: 20 }}>#{i + 1}</span>
     <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{s.name}</span>
     <span style={{ fontSize: 10, color: '#fff', background: s.bc, borderRadius: 5, padding: '2px 8px', fontWeight: 700 }}>{s.badge}</span>
     <span style={{ fontSize: 13, fontWeight: 800, color: s.score > 85 ? '#34D399' : '#FCD34D' }}>{s.score}</span>
    </div>
      ))}
    </div>
  )
}

function CompetitorsUI() {
  const rows = [
    { name: 'The Daily Grind', dist: '120m', stars: 4.2, threat: 'High', c: '#F87171' },
  { name: 'Brew & Co.', dist: '280m', stars: 3.8, threat: 'Med', c: '#FBBF24' },
  { name: 'Sunrise Café', dist: '390m', stars: 4.5, threat: 'High', c: '#F87171' },
  { name: 'Quick Bites', dist: '470m', stars: 3.1, threat: 'Low', c: '#34D399' },
 ]
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
    <p style={{ fontSize: 12, fontWeight: 700, color: '#F0FDF9' }}>Competitors within 500m</p>
    <span style={{ fontSize: 11, color: '#6B7280' }}>4 found</span>
   </div>
      {rows.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
     <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.c, flexShrink: 0 }}/>
     <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{c.name}</span>
     <span style={{ fontSize: 10, color: '#6B7280' }}>{c.dist}</span>
     <span style={{ fontSize: 10, color: '#FBBF24' }}> {c.stars}</span>
     <span style={{ fontSize: 10, fontWeight: 700, color: c.c, background: c.c + '18', borderRadius: 4, padding: '2px 7px' }}>{c.threat}</span>
    </div>
      ))}
    </div>
  )
}

function RentUI() {
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#F0FDF9', marginBottom: 14 }}>Rent Analysis</p>
   <div style={{ textAlign: 'center', marginBottom: 16 }}>
    <p style={{ fontSize: 30, fontWeight: 900, color: '#F0FDF9', letterSpacing: '-0.04em' }}>$4,200 / mo</p>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 7, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', borderRadius: 20, padding: '4px 14px' }}>
     <span style={{ fontSize: 15, fontWeight: 800, color: '#34D399' }}>9.8%</span>
     <span style={{ fontSize: 10, color: '#6B7280' }}>of revenue</span>
     <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>Healthy </span>
    </div>
      </div>
      {[['Revenue needed','$42,800 / mo'],['Daily transactions','156 / day'],['Break-even','~7 months'],['Safety buffer','$4,600 / mo']].map(([l, v], i) => (
    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.05)' }}>
     <span style={{ fontSize: 11, color: '#6B7280' }}>{l}</span>
     <span style={{ fontSize: 11, fontWeight: 700, color: '#E5E7EB' }}>{v}</span>
    </div>
      ))}
    </div>
  )
}

function ReportUI() {
  const rows = [
    { label: 'Location Score', val: '88 / 100', c: '#34D399' },
    { label: 'Demand Signal', val: 'Strong', c: '#34D399' },
    { label: 'Competition Risk', val: 'Moderate', c: '#FBBF24' },
    { label: 'Rent Viability', val: 'Viable', c: '#34D399' },
    { label: 'Demographics', val: 'Excellent', c: '#34D399' },
  ]
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
    <div>
          <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>88 Oxford St, Darlinghurst NSW</p>
     <p style={{ fontSize: 13, fontWeight: 700, color: '#F0FDF9' }}>Feasibility Report</p>
    </div>
        <div style={{ background: 'rgba(5,150,105,.15)', border: '1px solid rgba(5,150,105,.4)', borderRadius: 8, padding: '7px 14px', textAlign: 'center' }}>
     <p style={{ fontSize: 17, fontWeight: 900, color: '#34D399' }}>GO</p>
     <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Score: 88</p>
    </div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
     <span style={{ display: 'inline-flex' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={r.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></span>
          <span style={{ fontSize: 12, color: '#9CA3AF', flex: 1 }}>{r.label}</span>
     <span style={{ fontSize: 12, fontWeight: 700, color: r.c }}>{r.val}</span>
        </div>
      ))}
    </div>
  )
}

function DeviceUI({ uiType, animKey }: { uiType: string; animKey: number }) {
  if (uiType === 'score')    return <ScoreUI animKey={animKey}/>
  if (uiType === 'suburbs')   return <SuburbsUI/>
  if (uiType === 'competitors') return <CompetitorsUI/>
 if (uiType === 'rent')    return <RentUI/>
  return <ReportUI/>
}

const font = "'DM Sans', sans-serif"

export default function GlideShowcase() {
 const [activeIdx, setActiveIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const pausedRef = useRef(false)
  const active = TABS[activeIdx]

  useEffect(() => {
    const t = setInterval(() => {
      if (!pausedRef.current) {
        setActiveIdx(i => (i + 1) % TABS.length)
        setAnimKey(k => k + 1)
      }
    }, 4500)
    return () => clearInterval(t)
  }, [])

  function goTo(i: number) {
    setActiveIdx(i); setAnimKey(k => k + 1)
    pausedRef.current = true
    setTimeout(() => { pausedRef.current = false }, 10000)
  }

  return (
    <>
      <style>{`
        @keyframes gsUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .gs-anim { animation: gsUp .45s ease both }
        .gs-tab-btn:hover { color: rgba(240,253,249,.65) !important }
      `}</style>

      <section
        style={{ position: 'relative', fontFamily: font, overflow: 'hidden' }}
    onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {/* Mesh BG */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(15,118,110,.2) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(6,95,70,.18) 0%, transparent 55%), radial-gradient(ellipse 100% 80% at 50% 50%, rgba(3,12,11,.9) 0%, transparent 100%), linear-gradient(160deg, #061412 0%, #030C0B 50%, #071814 100%)' }}/>
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: .025, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }}/>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 10, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.35) 30%, rgba(20,184,166,.5) 50%, rgba(20,184,166,.35) 70%, transparent)' }}/>

    {/* Tabs */}
        <div style={{ position: 'relative', zIndex: 5, borderBottom: '1px solid rgba(255,255,255,.05)', display: 'flex', overflowX: 'auto', padding: '0 40px', scrollbarWidth: 'none' }}>
     {TABS.map((tab, i) => (
            <button key={tab.id} className="gs-tab-btn" onClick={() => goTo(i)}
       style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '18px 24px 16px', fontFamily: font, fontSize: 13.5, fontWeight: i === activeIdx ? 700 : 400, color: i === activeIdx ? '#F0FDF9' : 'rgba(148,210,198,.3)', whiteSpace: 'nowrap', position: 'relative', transition: 'color .2s' }}>
       {tab.label}
              <div style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', height: 2, borderRadius: 2, background: 'linear-gradient(90deg,#0F766E,#0FDECE)', width: i === activeIdx ? '80%' : '0%', transition: 'width .35s ease' }}/>
      </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', gap: 48, padding: '72px 48px 80px', minHeight: 460 }}>
     {/* BG photo */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <img key={active.id} src={active.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(60%) brightness(.22)', position: 'absolute', inset: 0 }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,20,18,.97) 40%, rgba(6,20,18,.3) 100%)' }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,12,11,.9) 0%, transparent 55%)' }}/>
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 500, height: 380, borderRadius: '50%', background: `radial-gradient(ellipse, ${active.accent}20, transparent 70%)`, transition: 'background .6s', pointerEvents: 'none' }}/>
     </div>

          {/* Left text */}
          <div key={active.id + '-t-' + animKey} className="gs-anim" style={{ flex: '0 0 auto', maxWidth: 380, position: 'relative', zIndex: 5 }}>
      <h2 style={{ fontSize: 'clamp(26px,3.8vw,40px)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.08, marginBottom: 18, whiteSpace: 'pre-line', background: 'linear-gradient(135deg, #F0FDF9 30%, #0FDECE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
       {active.headline}
            </h2>
            <p style={{ fontSize: 14.5, color: 'rgba(204,235,229,.55)', lineHeight: 1.8, marginBottom: 28 }}>{active.sub}</p>
      <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(20,184,166,.3)', background: 'rgba(15,118,110,.12)', backdropFilter: 'blur(10px)', color: '#F0FDF9', borderRadius: 10, padding: '12px 20px', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', fontFamily: font }}>
       {active.cta} &nbsp;→
            </Link>
          </div>

          {/* Right device */}
          <div key={active.id + '-d-' + animKey} className="gs-anim" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 5 }}>
      <div style={{ width: '100%', maxWidth: 460, background: 'rgba(10,18,16,.92)', border: '1px solid rgba(20,184,166,.14)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,.03), 0 40px 80px rgba(0,0,0,.6), 0 0 60px rgba(15,118,110,.08)', backdropFilter: 'blur(20px)' }}>
       <div style={{ background: 'rgba(255,255,255,.035)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
         {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>)}
        </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4B5563' }}>locatalyze.com/analyse</div>
        <div style={{ width: 17, height: 17, borderRadius: 4, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
       </div>
              <div style={{ background: '#0A1210', minHeight: 300 }}>
        <DeviceUI uiType={active.ui} animKey={animKey}/>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ position: 'relative', zIndex: 5, height: 2, background: 'rgba(255,255,255,.04)' }}>
     <div style={{ height: '100%', background: `linear-gradient(90deg,${active.accent},#14B8A6)`, width: `${((activeIdx + 1) / TABS.length) * 100}%`, transition: 'width .4s ease' }}/>
    </div>

        {/* Bottom CTA */}
        <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '28px 20px 36px', background: 'rgba(3,12,11,.6)', borderTop: '1px solid rgba(255,255,255,.04)', backdropFilter: 'blur(10px)' }}>
     <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#0F766E,#0B9488)', color: '#fff', borderRadius: 12, padding: '14px 30px', fontSize: 14.5, fontWeight: 800, textDecoration: 'none', fontFamily: font, boxShadow: '0 6px 28px rgba(15,118,110,.35), inset 0 1px 0 rgba(255,255,255,.12)' }}>
      Analyse my location free &nbsp;→
          </Link>
          <p style={{ fontSize: 11.5, color: 'rgba(148,210,198,.28)', marginTop: 10 }}>No credit card required · Any Australian address · Results in 30 seconds</p>
    </div>
      </section>
    </>
  )
}
