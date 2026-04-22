'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { MapPin, Users, Home, BarChart2, Bot, TrendingUp, Map, Globe, RefreshCw, Lightbulb, LineChart, Navigation, Zap, Shield, Trophy, Target, Activity, Coffee, UtensilsCrossed, ShoppingBag, Dumbbell, Croissant, Scissors, FileText, Unlock, Package, Briefcase } from 'lucide-react'
import {
  DEMO_SCENARIOS,
  HOMEPAGE_MINI_SNAP,
  rentToRevenueLabel,
  type DemoScenarioKey,
} from '@/lib/marketing/demo-scenarios'
import { LogoMark } from '@/components/Logo'
import { HomepageDemoProvider, useHomepageDemo } from '@/components/homepage-demo/HomepageDemoContext'
import NewsletterForm from '@/components/landing/NewsletterForm'

const ReportDemoSection = dynamic(() => import('@/components/ReportDemoSection'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: 920, background: '#030C0B', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
  ),
})

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div style={{ minHeight: 520, background: '#080F0E' }} />,
})

// Testimonials auto-hides when the data array is empty, so dynamically
// importing is cheap: if no quotes are live, React receives `null` and
// the module payload is still small. Kept non-ssr to match the rest of
// the marketing section layout and keep the SSR manifest lean.
const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  ssr: false,
  loading: () => null,
})

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
  const [v, setV] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setV(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return v
}

function useInView<T extends HTMLElement>(threshold = 0.15, rootMargin = '200px 0px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold, rootMargin })
    obs.observe(node)
    return () => obs.disconnect()
  }, [threshold, rootMargin])

  return { ref, inView }
}

// ── ReportPreview — hero widget (metrics + score from DEMO_SCENARIOS only) ──
const HERO_CHROME: Record<
  DemoScenarioKey,
  {
    icon: string
    location: string
    verdict: string
    verdictSub: string
    color: string
    colorLight: string
    colorMid: string
    gradHeader: string
    tags: string[]
  }
> = {
  go: {
    icon: 'coffee',
    location: 'Subiaco WA 6008',
    verdict: 'GO',
    verdictSub: 'Strong fundamentals',
    color: '#059669',
    colorLight: '#ECFDF5',
    colorMid: '#A7F3D0',
    gradHeader: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)',
    tags: ['High Income Area', 'Low Competition', '500m Radius Checked'],
  },
  caution: {
    icon: 'restaurant',
    location: 'Fremantle WA 6160',
    verdict: 'CAUTION',
    verdictSub: 'Proceed Carefully',
    color: '#D97706',
    colorLight: '#FFFBEB',
    colorMid: '#FDE68A',
    gradHeader: 'linear-gradient(135deg, #451A03 0%, #78350F 40%, #B45309 100%)',
    tags: ['Seasonal Risk', 'High Competition', 'Review Financials'],
  },
  no: {
    icon: 'gym',
    location: 'Joondalup WA 6027',
    verdict: 'NO',
    verdictSub: 'Not Recommended',
    color: '#DC2626',
    colorLight: '#FEF2F2',
    colorMid: '#FECACA',
    gradHeader: 'linear-gradient(135deg, #2D0000 0%, #7F1D1D 40%, #991B1B 100%)',
    tags: ['Oversaturated', 'Rent Too High', 'Not Viable'],
  },
}

const HERO_KEYS: DemoScenarioKey[] = ['go', 'caution', 'no']

function ReportPreview({ isMobile }: { isMobile: boolean }) {
  const { scenarioIndex, activeKey, setScenarioIndex } = useHomepageDemo()
  const [animKey, setAnimKey]   = useState(0)
  const [snapping, setSnapping] = useState(false)
  const [visible, setVisible]   = useState(true)
  const [ringScore, setRingScore] = useState(0)
  const [isComputing, setIsComputing] = useState(true)
  const rpRef                   = useRef<HTMLDivElement>(null)
  const scoreAnimRef            = useRef<number>(0)

  useEffect(() => {
    const el = rpRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const switchTo = (i: number) => {
    if (i === scenarioIndex) return
    setSnapping(true)
    setTimeout(() => {
      setScenarioIndex(i)
      setAnimKey(k => k + 1)
      setSnapping(false)
    }, 200)
  }

  useEffect(() => {
    if (!visible || isMobile) return
    const t = setInterval(() => switchTo((scenarioIndex + 1) % HERO_KEYS.length), 4800)
    return () => clearInterval(t)
  }, [scenarioIndex, visible, isMobile])

  const scenario = DEMO_SCENARIOS[activeKey]
  const chrome = HERO_CHROME[activeKey]
  const scoreTarget = scenario.score
  const snap = HOMEPAGE_MINI_SNAP[activeKey]

  // Circular score: 0 → target over ~1.5s on mount and whenever the demo scenario changes.
  // Signals "calculating" instead of a static 0/100 flash.
  useEffect(() => {
    if (!visible) return
    cancelAnimationFrame(scoreAnimRef.current)
    setRingScore(0)
    setIsComputing(true)
    const start = performance.now()
    const duration = 1500
    const easeOut = (t: number) => 1 - (1 - t) ** 3
    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration)
      setRingScore(Math.round(easeOut(raw) * scoreTarget))
      if (raw < 1) {
        scoreAnimRef.current = requestAnimationFrame(tick)
      } else {
        setIsComputing(false)
      }
    }
    scoreAnimRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(scoreAnimRef.current)
  }, [visible, activeKey, animKey, scoreTarget])
  const noteText = activeKey === 'no' ? 'High risk' : 'Estimate only'
  const c = {
    ...chrome,
    biz: scenario.biz,
    score: ringScore,
    scoreLabel: 'Feasibility Score' as const,
    metrics: [
      { l: 'Est. monthly revenue', v: scenario.monthlyRevenue, highlight: false },
      { l: 'Est. rent-to-revenue', v: rentToRevenueLabel(scenario), highlight: false },
      { l: 'Break-even (est.)', v: scenario.breakEven, highlight: false },
      { l: 'Note', v: noteText, highlight: true },
    ],
    snap,
  }
  const r   = 34
  const cir = 2 * Math.PI * r
  return (
    <div ref={rpRef} style={{ width: '100%', maxWidth: 460, minHeight: 560, fontFamily: font }}>

      {/* Switcher dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {HERO_KEYS.map((key, i) => {
          const cs = HERO_CHROME[key]
          return (
          <button key={key} aria-label={`Show ${cs.verdict} example`} onClick={() => switchTo(i)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 12px 5px 8px', borderRadius: 100, border: 'none', cursor: 'pointer',
            fontFamily: font, fontSize: 11, fontWeight: i === scenarioIndex ? 700 : 500,
            background: i === scenarioIndex ? cs.color : '#F1F5F9',
            color: i === scenarioIndex ? '#fff' : L.muted,
            transition: 'all .22s',
            boxShadow: i === scenarioIndex ? `0 3px 12px ${cs.color}55` : 'none',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
            <span>{cs.verdict}</span>
          </button>
        )})}
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
                <div style={{ width:22, height:22, borderRadius:6, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff' }}><LogoMark size="sm" /></div>
                <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:'.03em' }}>Locatalyze Report</span>
              </div>
              <span style={{ fontSize:10, color:'rgba(255,255,255,.35)', background:'rgba(255,255,255,.08)', borderRadius:6, padding:'2px 8px' }}>
                {new Date().toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}
              </span>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, minHeight: 34 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} /></div>
              <div>
                <p style={{ fontSize:16, fontWeight:900, color:'#fff', letterSpacing:'-.02em', lineHeight:1.1 }}>{c.biz}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:2 }}>{c.location}</p>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:c.colorLight, border:`2px solid ${c.colorMid}`, borderRadius:14, padding:'8px 16px' }}>
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
                      strokeDashoffset={cir - cir * Math.min(100, Math.max(0, ringScore)) / 100}
                      style={{ transition: isComputing ? 'none' : 'stroke-dashoffset 0.35s ease', filter:`drop-shadow(0 0 5px ${c.color}bb)` }}/>
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:20, fontWeight:900, color:'#fff', lineHeight:1 }}>{ringScore}</span>
                    <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>/100</span>
                  </div>
                </div>
                <p style={{ fontSize:9, color:'rgba(255,255,255,.3)', marginTop:2 }}>{isComputing ? 'Computing…' : c.scoreLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* White body */}
        <div style={{ background:'#fff' }}>
          <div style={{ padding:'12px 20px 0', display:'flex', gap:6, flexWrap:'wrap' as const, minHeight: 36 }}>
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
          <span style={{ fontSize:10, color:L.muted }}>Illustrative demo data · Australian addresses</span>
          <span style={{ fontSize:10, fontWeight:700, color:c.color }}>View full report →</span>
        </div>
      </div>

      {/* Progress bar under card */}
      <div style={{ height:2, background:L.border, borderRadius:100, marginTop:12, overflow:'hidden' }}>
        <div key={animKey} style={{ height:'100%', background:c.color, borderRadius:100, width: isMobile ? '100%' : undefined, animation: isMobile ? 'none' : 'rp-bar 4.8s linear both' }}/>
      </div>

      <style>{`
        @keyframes rp-bar { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  )
}

// ── Showcase (dark, inline) ────────────────────────────────────────
const SHOWCASE_TABS = [
  { id: 'loc',  label: 'Location Analysis', headline: 'Most lease mistakes are made\nbefore the first competitor is mapped.', sub: 'Map demand signals, competitor density and rent viability for any Australian address — before you commit to a dollar of rent.', ui: 'score' },
  { id: 'sub',  label: 'Suburb Scoring',    headline: 'Every suburb scored\nfor your business.', sub: 'Compare suburbs side by side using income data, population density, age profile and spending behaviour. Find where your concept has the strongest natural advantage.', ui: 'suburbs' },
  { id: 'comp', label: 'Competitor Mapping',headline: 'See every competitor\nbefore they see you.', sub: 'Map every direct competitor within your chosen radius. Understand their ratings, proximity and threat level — and find the gaps where your concept can own the category.', ui: 'competitors' },
  { id: 'rent', label: 'Rent Affordability',headline: 'Know if the rent\nmakes financial sense.', sub: 'Enter your expected rent and average transaction value. Locatalyze calculates the exact daily volume you need to stay profitable — and tells you if this location can deliver it.', ui: 'rent' },
  { id: 'rep',  label: 'Feasibility Reports',headline: 'A full report,\nin about 90 seconds.', sub: 'Get a complete feasibility report covering demand, competition, demographics and financials. Share it with your accountant, investor or landlord as a professional PDF — instantly.', ui: 'report' },
]

function ShowcaseScoreUI({ ak }: { ak: number }) {
  const target = DEMO_SCENARIOS.go.score
  const [sc, setSc] = useState(target); const [bars, setBars] = useState(true)
  const isFirstMount = useRef(true)
  useEffect(() => {
    // Use a ref to detect true first mount vs remount after tab cycle.
    // ak===0 guard fails when component remounts with ak already >0.
    if (isFirstMount.current) { isFirstMount.current = false; return }
    setSc(0); setBars(false); let n=0; const t=setInterval(()=>{ n=Math.min(n+2,target); setSc(n); if(n>=target){clearInterval(t); setBars(true)} },18); return()=>clearInterval(t)
  }, [ak, target])
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
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 900, color: D.text1 }}>{sc > 0 ? sc : target}</div>
        </div>
        <div style={{ background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.28)', borderRadius: 9, padding: '7px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 900, color: D.e }}>GO</p>
          <p style={{ fontSize: 9, color: '#6B7280', marginTop: 1 }}>Verdict</p>
        </div>
      </div>
      {[
        { l: 'Rent Affordability', p: 78, c: D.e, r: '20%' },
        { l: 'Competition', p: 72, c: D.amber, r: '25%' },
        { l: 'Market Demand', p: 88, c: D.e, r: '20%' },
        { l: 'Profitability', p: 90, c: D.e, r: '25%' },
        { l: 'Location Quality', p: 80, c: D.e, r: '10%' },
      ].map((b,i)=>(
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ fontSize: 11, color: '#9CA3AF' }}>{b.l}</span><span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.r}</span></div>
          <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', background: b.c, borderRadius: 2, width: bars?`${b.p}%`:'0%', transition: `width 1.1s ease ${i*.12}s` }}/></div>
        </div>
      ))}
    </div>
  )
}

function ShowcaseSuburbsUI() {
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: D.text1, marginBottom: 14 }}>Top Suburbs for Cafés</p>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><p style={{ fontSize: 12, fontWeight: 700, color: D.text1 }}>Competitors within 500m</p><span style={{ fontSize: 11, color: '#6B7280' }}>4 found · sample data</span></div>
      {[{n:'The Daily Grind',d:'120m',st:4.2,t:'High',c:'#F87171'},{n:'Brew & Co.',d:'280m',st:3.8,t:'Med',c:'#FBBF24'},{n:'Sunrise Café',d:'390m',st:4.5,t:'High',c:'#F87171'},{n:'Quick Bites',d:'470m',st:3.1,t:'Low',c:'#34D399'}].map((r,i)=>(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: i<3?'1px solid rgba(255,255,255,.05)':'none' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.c, flexShrink: 0 }}/>
          <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{r.n}</span>
          <span style={{ fontSize: 10, color: '#6B7280' }}>{r.d}</span>
          <span style={{ fontSize: 10, color: '#FBBF24' }}>{r.st}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: r.c, background: r.c+'18', borderRadius: 4, padding: '2px 7px' }}>{r.t}</span>
        </div>
      ))}
    </div>
  )
}

function ShowcaseRentUI() {
  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: D.text1, marginBottom: 14 }}>Rent Analysis</p>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 30, fontWeight: 900, color: D.text1, letterSpacing: '-.04em' }}>$4,200 / mo</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 7, background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.3)', borderRadius: 20, padding: '4px 14px' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: D.e }}>9.8%</span>
          <span style={{ fontSize: 10, color: '#6B7280' }}>of revenue</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>Healthy</span>
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
      {[{dot:'#34D399',l:'Rent Affordability',v:'78 · 20%',c:D.e},{dot:'#34D399',l:'Competition',v:'72 · 25%',c:D.amber},{dot:'#34D399',l:'Market Demand',v:'88 · 20%',c:D.e},{dot:'#34D399',l:'Profitability',v:'90 · 25%',c:D.e},{dot:'#34D399',l:'Location Quality',v:'80 · 10%',c:D.e}].map((r,i)=>(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i<4?'1px solid rgba(255,255,255,.05)':'none' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
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
  const { ref: showcaseRef, inView } = useInView<HTMLDivElement>(0.15, '200px 0px')
  const tab = SHOWCASE_TABS[idx]

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => { if (!paused.current) { setIdx(i=>(i+1)%SHOWCASE_TABS.length); setAk(k=>k+1) } }, 4500)
    return () => clearInterval(t)
  }, [inView])

  function go(i: number) { setIdx(i); setAk(k=>k+1); paused.current=true; setTimeout(()=>{ paused.current=false },10000) }

  return (
    <div ref={showcaseRef} style={{ position: 'relative', overflow: 'hidden', fontFamily: font }}
      onMouseEnter={()=>{ paused.current=true }} onMouseLeave={()=>{ paused.current=false }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(15,118,110,.2) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(6,95,70,.18) 0%, transparent 55%), linear-gradient(160deg, #061412 0%, #030C0B 50%, #071814 100%)' }}/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.5) 50%, transparent)', zIndex: 5 }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(20,184,166,.3) 50%, transparent)', zIndex: 5 }}/>

      {/* Tab bar */}
      <div style={{ position: 'relative', zIndex: 5, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', overflowX: 'auto', padding: '0 40px', scrollbarWidth: 'none' as const }}>
          {SHOWCASE_TABS.map((t,i)=>(
            <button key={t.id} aria-label={`Show ${t.label}`} onClick={()=>go(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '16px 22px 14px', fontFamily: font, fontSize: 13.5, fontWeight: i===idx?700:400, color: i===idx?D.text1:D.text3, whiteSpace: 'nowrap' as const, position: 'relative', transition: 'color .2s' }}>
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
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid rgba(20,184,166,.3)`, background: 'rgba(15,118,110,.12)', color: D.text1, borderRadius: 10, padding: '12px 20px', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', fontFamily: font }}>
              Check your location →
            </Link>
          </div>

          {/* Right device */}
          <div key={tab.id+'-d-'+ak} style={{ animation: 'sc-up .5s ease both', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', maxWidth: 440, background: 'rgba(10,18,16,.92)', border: D.border, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,.6), 0 0 60px rgba(15,118,110,.08)' }}>
              <div style={{ background: 'rgba(255,255,255,.035)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>{['#FF5F57','#FFBD2E','#28CA41'].map(c=><div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>)}</div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4B5563' }}>locatalyze.com/analyse</div>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: `linear-gradient(135deg,${D.brand},${D.bl})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}><LogoMark size="sm" /></div>
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
        <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${D.brand},#0B9488)`, color: '#fff', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none', fontFamily: font, boxShadow: '0 6px 24px rgba(15,118,110,.35)' }}>
          Check my location →
        </Link>
        <p style={{ fontSize: 11, color: D.text3, marginTop: 8 }}>No signup needed · Any Australian address · See competitors instantly</p>
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
  { step:'01', label:'Enter Address',   desc:'Type any Australian address. Add your business type, monthly rent and transaction value. Takes about 90 seconds.' },
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
  const [scoreAnim, setScoreAnim]= useState(82)
  const [barsFired, setBarsFired]= useState(true)
  const [replay, setReplay]      = useState(0)
  const { ref: cinematicRef, inView } = useInView<HTMLDivElement>(0.15, '200px 0px')
  const addr = '45 King St, Newtown NSW'

  useEffect(() => {
    if (!inView) return
    let dead = false
    setPhase(0); setTyped(''); setProgress(0); setSteps(0)
    setScanLine(0); setPins([]); setBarsFired(false)
    // scoreAnim is NOT reset here — resetting it at the top of the loop causes
    // a 0/100 flash while phase 3 is still visible from the previous cycle.
    // It is reset to 0 inside the phase-3 timeout, just before counting begins.

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
              if (dead) return; setScoreAnim(0); setPhase(3); let s = 0
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
  }, [replay, inView])

  const circ = 2 * Math.PI * 28
  const phaseIdx = phase === 0 || phase === 1 ? 0 : phase === 2 ? 1 : 2

  return (
    <div ref={cinematicRef} style={{ width: '100%', fontFamily: font }}>
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
              }}>{phaseIdx > i ? 'Done' : p.step}</div>
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
                  {[{l:'Business Type',v:'Café'},{l:'Monthly Rent',v:'$3,800'}].map(f => (
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
                        {stepsVisible > i && <span style={{ fontSize: 12, color: L.emerald, fontWeight: 800 }}>Done</span>}
                      </div>
                    ))}
                  </div>
                )}

                {phase === 1 && (
                  <div style={{ background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ fontSize: 12, color: L.emerald, fontWeight: 600 }}>Add your address to begin your free analysis</p>
                  </div>
                )}
              </div>
            )}

            {/* Phase 3: report summary */}
            {phase === 3 && (
              <div style={{ animation: 'cw-fade .4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.goBg, color: L.go, border: `1.5px solid ${L.goBdr}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 800, marginBottom: 5 }}>GO — Strong</div>
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
                      <span style={{ fontSize: 16, fontWeight: 900, color: L.emerald, lineHeight: 1 }}>{scoreAnim > 0 ? scoreAnim : 82}</span>
                      <span style={{ fontSize: 10, color: L.muted }}>/100</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 14 }}>
                  {[{l:'Est. revenue range',v:'$78k–$88k/mo',hi:false},{l:'Break-even (est.)',v:'35–50/day',hi:false},{l:'Rent-to-revenue',v:'~4.2%',hi:false},{l:'Note',v:'Estimate only',hi:true}].map(m => (
                    <div key={m.l} style={{ background: m.hi ? L.emeraldXlt : '#F8FAFC', borderRadius: 8, border: `1px solid ${m.hi ? L.emeraldLt : L.border}`, padding: '8px 10px' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: L.muted, textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 2 }}>{m.l}</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: m.hi ? L.emerald : L.slate }}>{m.v}</p>
                    </div>
                  ))}
                </div>

                {[{l:'Market Demand',s:85},{l:'Rent Affordability',s:78},{l:'Competition',s:72},{l:'Profitability',s:90},{l:'Location Quality',s:84}].map((b, i) => (
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
                Newtown NSW 2042
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
                {CW_PINS.length} competitors mapped · sample data
              </div>
            )}

            {phase >= 2 && (
              <div style={{ position: 'absolute', left: '45%', top: '52%', transform: 'translate(-50%,-50%)', width: 140, height: 140, borderRadius: '50%', border: '1.5px dashed rgba(16,185,129,.45)', background: 'rgba(16,185,129,.04)', animation: 'ring-in .5s ease', pointerEvents: 'none', zIndex: 3 }}/>
            )}

            {phase >= 2 && CW_PINS.map((c, i) => pins.includes(i) && (
              <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-100%)', animation: 'pin-drop .35s cubic-bezier(.175,.885,.32,1.275) both', zIndex: 4 }}>
                <div style={{ position: 'relative', width: 20, height: 20 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50% 50% 50% 0', background: c.color, transform: 'rotate(-45deg)', border: '2px solid #fff', boxShadow: `0 2px 8px ${c.color}60` }}/>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 900 }}>
                    {c.threat==='High'?'!':c.threat==='Med'?'~':'OK'}
                  </div>
                </div>
              </div>
            ))}

            {phase >= 2 && (
              <div style={{ position: 'absolute', left: '45%', top: '52%', transform: 'translate(-50%,-100%)', animation: 'pin-drop .4s cubic-bezier(.175,.885,.32,1.275) both', zIndex: 6 }}>
                <div style={{ position: 'relative', width: 24, height: 24 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50% 50% 50% 0', background: L.emerald, transform: 'rotate(-45deg)', border: '2.5px solid #fff', boxShadow: `0 3px 12px rgba(16,185,129,.5)` }}/>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0F766E', border: '2px solid #fff' }} /></div>
                </div>
                <div style={{ marginTop: 2, background: L.emerald, color: '#fff', borderRadius: 5, padding: '1px 6px', fontSize: 10, fontWeight: 800, textAlign: 'center' as const }}>You</div>
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

/** Matches on-page “Common questions” (pricing FAQ) — source of truth for FAQ JSON-LD. */
const HOMEPAGE_FAQS: { question: string; answer: string }[] = [
  {
    question: "What's free vs paid?",
    answer:
      "Free: GO/CAUTION/NO verdict, competitor map (500m), top-level location score, and a rent-to-revenue range (not a full P&L). All city and suburb marketing pages, the blog, and free tools (rent calculator, break-even checker, etc.) are free. Paid ($29+): full P&L, exact break-even customers/day, 3-year projection, full SWOT, PDF export, detailed competitor threat scores, and best/worst risk scenarios.",
  },
  {
    question: 'Do credits expire?',
    answer: "No. Report credits have no expiry date. Buy a 3-pack or 10-pack and use them whenever you're ready — across any Australian address.",
  },
  {
    question: 'What is your refund policy?',
    answer:
      "If a report fails to generate due to a technical error on our end, we'll refund the credit or regenerate the report at no charge. Because reports are generated on demand using live data, completed reports are non-refundable.",
  },
  {
    question: "What does 'Compare locations side-by-side' mean?",
    answer:
      'When you have two or more reports in your dashboard, you can view them together to compare scores, rent-to-revenue ratios, and verdicts across different addresses. This helps you shortlist before committing to a site visit.',
  },
  {
    question: 'Is this financial advice?',
    answer:
      "No. Locatalyze is a directional analysis tool — not a licensed financial adviser. Use reports as a second opinion before you speak to your accountant or solicitor, not as a substitute for professional advice.",
  },
]

// ── Page ──────────────────────────────────────────────────────────
function LandingPageInner() {
  const { scenarioIndex, setScenarioIndex } = useHomepageDemo()
  const isMobile = useIsMobile()

  const pad = isMobile ? '0 16px' : '0 40px'
  const sp  = isMobile ? '64px 16px' : '96px 40px'
  const W   = { maxWidth: 1240, margin: '0 auto' }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((f) => ({
      '@type': 'Question' as const,
      name: f.question,
      acceptedAnswer: { '@type': 'Answer' as const, text: f.answer },
    })),
  }

  return (
    <main style={{ minHeight: '100vh', background: L.white, fontFamily: font, color: L.slate }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        button{font-family:inherit;cursor:pointer}
        html{scroll-behavior:smooth}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes sc-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)}}
      `}</style>

      {/* HERO */}
      <section style={{ paddingTop: isMobile ? 28 : 36, paddingBottom: isMobile ? 56 : 80, background: L.white, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: `linear-gradient(to top, ${L.mint}, transparent)`, pointerEvents: 'none' }}/>
        <div style={{ ...W, padding: pad, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 60, alignItems: 'center' }}>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 100, padding: '5px 14px 5px 10px', fontSize: 11, fontWeight: 700, color: L.emerald, marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: L.emerald, display: 'inline-block', animation: 'pulse-dot 2s infinite' }}/>
                Location analysis for Australian business owners
              </div>
              <h1 style={{ fontSize: isMobile ? 36 : 54, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: 18 }}>
                The wrong location<br/>costs <span style={{ color: L.emerald }}>$200,000+.</span>
              </h1>
              <p style={{ fontSize: isMobile ? 15 : 17, color: L.muted, lineHeight: 1.75, marginBottom: 8, maxWidth: 440 }}>
                Get a <strong style={{ color: L.slate }}>GO / CAUTION / NO</strong> decision for any Australian address in 90 seconds.
              </p>
              <p style={{ fontSize: isMobile ? 15 : 17, color: L.slate, lineHeight: 1.65, marginBottom: 16, maxWidth: 440, fontWeight: 600 }}>
                Unlock the full financial model before you commit to a lease — <span style={{ color: L.emerald }}>$29</span>.
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
                {[
                  { icon: <Home size={12} strokeWidth={2}/>, label:'Pre-lease due diligence' },
                  { icon: <TrendingUp size={12} strokeWidth={2}/>, label:'Expansion site selection' },
                  { icon: <RefreshCw size={12} strokeWidth={2}/>, label:'Lease renewal check' },
                  { icon: <Briefcase size={12} strokeWidth={2}/>, label:'Investor / bank report' },
                ].map(uc => (
                  <span key={uc.label} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'#475569', background:'#F8FAFC', border:`1px solid ${L.border}`, borderRadius:100, padding:'5px 12px' }}>
                    {uc.icon}{uc.label}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emerald, color: '#fff', borderRadius: 12, padding: isMobile ? '13px 22px' : '15px 28px', fontWeight: 800, fontSize: isMobile ? 14 : 15, boxShadow: '0 4px 20px rgba(16,185,129,.3)' }}>
                  Check your location →
                </Link>
                <Link href="/sample-report" style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, color: L.muted, textDecoration: 'none', padding: isMobile ? '13px 16px' : '15px 16px', border: `1px solid ${L.border}`, borderRadius: 12, fontWeight: 600 }}>
                  See sample report
                </Link>
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Free verdict · Full unlock $29 · Results in 90 seconds</p>

              <div style={{ display: 'flex', gap: isMobile ? 20 : 28, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${L.border}`, flexWrap: 'wrap' }}>
                {[{value:'Free to start',label:'no signup required'},{value:'Live data',label:'competitor mapping'},{value:'~90s',label:'to get your verdict'}].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: L.emerald, letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ReportPreview isMobile={isMobile}/>
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
            Most lease mistakes are made<br/>before the first competitor is mapped. We fix that.
          </h2>
          <p style={{ fontSize: 14, color: D.text2, lineHeight: 1.75, marginBottom: 24 }}>Map demand signals, competitors and financials for any Australian address in about 90 seconds.</p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${D.brand},#0B9488)`, color: '#fff', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Check your location →
          </Link>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: sp, background: L.mint, contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 12 }}>From address to verdict in about 90 seconds</h2>
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

      {/* AFTER YOUR REPORT — conversion funnel transparency */}
      <section style={{ padding: isMobile ? '64px 16px' : '80px 40px', background: L.white, borderTop: `1px solid ${L.border}`, contentVisibility: 'auto', containIntrinsicSize: '700px' }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 36 : 48 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:L.emeraldXlt, border:`1px solid ${L.emeraldLt}`, borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:L.emerald, textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:14 }}>
              What happens next
            </div>
            <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight:900, color:L.slate, letterSpacing:'-.04em', marginBottom:10 }}>
              After your free report
            </h2>
            <p style={{ fontSize:15, color:L.muted, maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
              Your first report is free. Here&apos;s exactly what the experience looks like.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 16 : 24 }}>
            {[
              {
                step: '1',
                color: L.emerald,
                bg: L.emeraldXlt,
                border: L.emeraldLt,
                icon: <FileText size={16} strokeWidth={2} color={L.emerald}/>,
                title: 'Your free verdict lands instantly',
                body: 'You get a GO, CAUTION, or NO verdict with a competitor map and top-level score — free, no card required. See whether this location is worth a site visit.',
                cta: null,
              },
              {
                step: '2',
                color: '#0891B2',
                bg: 'rgba(8,145,178,.06)',
                border: 'rgba(8,145,178,.2)',
                icon: <Unlock size={16} strokeWidth={2} color='#0891B2'/>,
                title: 'Unlock the full analysis for $29',
                body: 'Get the complete financial model, break-even analysis, revenue projections, SWOT insights, and a downloadable PDF. One report, one price — no subscriptions required.',
                cta: { label: 'See pricing', href: '#pricing' },
              },
              {
                step: '3',
                color: '#7C3AED',
                bg: 'rgba(124,58,237,.06)',
                border: 'rgba(124,58,237,.2)',
                icon: <Package size={16} strokeWidth={2} color='#7C3AED'/>,
                title: 'Save more with report packs',
                body: 'Comparing multiple locations? Grab a 3-pack for $59 ($19.67 each) or a 10-pack for $149 ($14.90 each). Use credits on any location, any time.',
                cta: { label: 'See pricing', href: '#pricing' },
              },
            ].map(s => (
              <div key={s.step} style={{ background:'#FAFAFA', border:`1.5px solid ${s.border}`, borderRadius:20, padding:'26px 24px', display:'flex', flexDirection:'column' as const, gap:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize:11, fontWeight:800, color:s.color, textTransform:'uppercase' as const, letterSpacing:'.08em' }}>Step {s.step}</span>
                </div>
                <p style={{ fontSize:15, fontWeight:800, color:L.slate, lineHeight:1.3 }}>{s.title}</p>
                <p style={{ fontSize:13, color:L.muted, lineHeight:1.75, flex:1 }}>{s.body}</p>
                {s.cta && (
                  <Link href={s.cta.href} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:s.color, textDecoration:'none' }}>
                    {s.cta.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="sample-report" style={{ minHeight: 920 }}>
        <ReportDemoSection homepageScenarioIndex={scenarioIndex} onHomepageScenarioChange={setScenarioIndex} />
      </div>

      {/* DATA SOURCES — Dark premium — Lucide icons throughout */}
      <section style={{ padding: isMobile ? '72px 16px' : '100px 40px', background: '#0B1512', position: 'relative', overflow: 'hidden', contentVisibility: 'auto', containIntrinsicSize: '1200px' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:600, background:'radial-gradient(ellipse, rgba(16,185,129,.07) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ ...W, position:'relative', zIndex:2 }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom: isMobile ? 40 : 64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.25)', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:'#34D399', textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:16 }}>
              Data infrastructure
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 44, fontWeight:900, color:'#F0FDF9', letterSpacing:'-.04em', lineHeight:1.08, marginBottom:14 }}>
              The verdict is deterministic.<br/>
              <span style={{ background:'linear-gradient(135deg, #34D399, #0FDECE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                The AI explains it. The data builds it.
              </span>
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color:'rgba(204,235,229,.55)', maxWidth:540, margin:'0 auto', lineHeight:1.75 }}>
              Every verdict is computed from real, live sources — the GO / CAUTION / NO call and the score come from our deterministic scoring engine, not from an AI. The written narrative (SWOT, market read, 3-year outlook) is generated by OpenAI on top of those numbers. No static databases. No educated guesses.
            </p>
          </div>

          {/* Pipeline row — Globe / Activity / BarChart2 / Shield */}
          {!isMobile && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:64 }}>
              {[
                { icon: 'globe',    label: 'Live Data' },
                { icon: 'activity', label: 'OpenAI narrative + in-house compute engine' },
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
                      <div style={{ width:'100%', height:'100%', background:'linear-gradient(90deg, rgba(52,211,153,.6), transparent)' }}/>
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
                icon: 'users', source:'ABS Census & Demographics', badge:'2021 data',
                headline:'Income, age and population by suburb',
                body:'ABS census data gives us median income, age profile and density — the foundation of every demand estimate. This uses 2021 census data; the next full census release is expected in 2026.',
                proof:'2021 ABS Census — next update 2026',
                color:'#8B5CF6', colorBg:'rgba(139,92,246,.08)', colorBorder:'rgba(139,92,246,.2)',
              },
              {
                icon: 'home', source:'Commercial Rent Benchmarks', badge:'Market data',
                headline:'Fair rent for every suburb and zone',
                body:'Aggregated from commercial property listings and market research, we estimate realistic rent ranges so your financial model reflects what you\'ll actually pay.',
                proof:'Based on publicly available commercial listings',
                color:'#F59E0B', colorBg:'rgba(245,158,11,.08)', colorBorder:'rgba(245,158,11,.2)',
              },
              {
                icon: 'target', source:'Competition Scoring Engine', badge:'Rules-based',
                headline:'Threat rating for every nearby business',
                body:'Our deterministic model scores competitor intensity by proximity, rating, category overlap and business count — giving you a number, not a vague "there\'s some competition."',
                proof:'Per-radius, per-category scoring',
                color:'#EF4444', colorBg:'rgba(239,68,68,.08)', colorBorder:'rgba(239,68,68,.2)',
              },
              {
                icon: 'bot', source:'AI Narrative + Compute Engine', badge:'OpenAI + in-house',
                headline:'Break-even, profit and 3-year outlook',
                body:'A deterministic rules-based engine (in-house) calculates daily volume needed, monthly profit, payback period and the 3-year revenue projection from your rent and transaction value. OpenAI is used on top of those numbers to write the narrative analysis — it explains the verdict, it does not decide it.',
                proof:'Based on ABS Census + live business data',
                color:'#10B981', colorBg:'rgba(16,185,129,.08)', colorBorder:'rgba(16,185,129,.25)',
              },
              {
                icon: 'trendingUp', source:'Market Demand Signals', badge:'Multi-source',
                headline:'Search volume and demand-proximity signals by suburb',
                body:'We combine category-level search volume and proximity to demand generators (transport, offices, universities) to estimate relative demand. Note: this is a proximity proxy, not direct foot-count data.',
                proof:'Google Trends + proximity scoring',
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
                <p style={{ fontSize:13, fontWeight:800, color:'#F0FDF9', marginBottom:4 }}>Built on public data, explained transparently.</p>
                <p style={{ fontSize:12, color:'rgba(204,235,229,.45)', lineHeight:1.6 }}>Our methodology is publicly documented. Read exactly how each data layer is weighted and how verdicts are computed.</p>
              </div>
              <div style={{ display:'flex', gap:12, flexShrink:0, flexWrap:'wrap' as const }}>
                {[
                  { icon: 'shield',    label: 'AU data sources',  sub: 'ABS + business listings' },
                  { icon: 'globe',     label: 'Australian only',  sub: 'Localised benchmarks' },
                  { icon: 'refreshCw', label: 'Competitors live', sub: 'Demographics: 2021 census' },
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

      {/* ORIGIN + TRUST */}
      <section style={{ padding: isMobile ? '72px 16px' : '96px 40px', background: '#FAFBFC', borderTop:`1px solid ${L.border}`, contentVisibility: 'auto', containIntrinsicSize: '700px' }}>
        <div style={{ ...W }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64, alignItems:'center' }}>

            {/* Left: origin story */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:L.emeraldXlt, border:`1px solid ${L.emeraldLt}`, borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:L.emerald, textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:20 }}>
                Why this exists
              </div>
              <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight:900, color:L.slate, letterSpacing:'-.04em', lineHeight:1.15, marginBottom:18 }}>
                Built after a location cost us $180,000.
              </h2>
              <p style={{ fontSize:15, color:L.muted, lineHeight:1.8, marginBottom:16 }}>
                In 2021, we signed a lease in Perth that looked right on paper — good street, solid foot traffic, rent that felt manageable. Eighteen months later, the business closed. Three things we didn&apos;t check: the rent-to-revenue ceiling was too tight, an established competitor moved into the same block three months later, and the demographics skewed 15 years older than our target customer.
              </p>
              <p style={{ fontSize:15, color:L.muted, lineHeight:1.8 }}>
                The data that would have changed the decision existed — it just wasn&apos;t assembled anywhere. Locatalyze is the tool we wish we&apos;d had. It doesn&apos;t make the choice for you — it gives you the numbers to make it clearly.
              </p>
            </div>

            {/* Right: trust signals */}
            <div style={{ display:'flex', flexDirection:'column' as const, gap:16 }}>
              {[
                {
                  label: 'Registered Australian business',
                  detail: 'VSG Group Australia Pty Ltd · ABN 47 683 197 819',
                  icon: 'shield',
                },
                {
                  label: 'Built and operated in Perth, WA',
                  detail: 'Not an overseas tool with Australian branding — built here, for here.',
                  icon: 'mapPin',
                },
                {
                  label: 'Methodology is public',
                  detail: 'Every score, every weight, every data source is documented. No black box.',
                  icon: 'lightbulb',
                  link: '/methodology',
                },
                {
                  label: 'Directional analysis — not financial advice',
                  detail: 'Locatalyze gives you evidence. Your accountant and solicitor help you act on it.',
                  icon: 'target',
                },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', alignItems:'flex-start', gap:14, background:L.white, border:`1px solid ${L.border}`, borderRadius:14, padding:'16px 18px' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:L.emeraldXlt, border:`1px solid ${L.emeraldLt}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <LI n={item.icon} size={16} color={L.emerald}/>
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:L.slate, marginBottom:3 }}>{item.label}</p>
                    <p style={{ fontSize:12, color:L.muted, lineHeight:1.6 }}>{item.detail}</p>
                    {'link' in item && item.link && (
                      <Link href={item.link} style={{ fontSize:12, fontWeight:700, color:L.emerald, textDecoration:'none', marginTop:4, display:'inline-block' }}>
                        Read methodology →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SOCIAL PROOF — data-backed trust strip */}
      <section style={{ padding: '36px 24px', background: '#0C1F1C', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', contentVisibility: 'auto', containIntrinsicSize: '320px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 28 }}>
            What the data shows across analysed locations
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
            {[
              { value: '2,000+', label: 'Australian addresses analysed' },
              { value: '38%',    label: 'Score GO — viable without major caveats' },
              { value: '3.1×',   label: 'Revenue difference, top vs bottom suburb quartile' },
              { value: '81%',    label: 'Of NO verdicts had rent-to-revenue above 16%' },
            ].map(({ value, label }) => (
              <div key={label} style={{ padding: '24px 20px', background: '#0F2820', textAlign: 'center' }}>
                <p style={{ fontSize: isMobile ? 26 : 32, fontWeight: 900, color: '#14B8A6', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 16, fontStyle: 'italic' }}>
            Based on Locatalyze analysis of 2,000+ addresses across Melbourne, Sydney, Brisbane, Perth and Adelaide · 2025–2026 · <a href="/methodology" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'underline' }}>Methodology</a>
          </p>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 14, lineHeight: 1.65, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Used Locatalyze on a real site? We&apos;re collecting short quotes — suburb, business type, one specific outcome.{' '}
            <Link href="/contact" style={{ color: '#5EEAD4', fontWeight: 700, textDecoration: 'underline' }}>Send yours via Contact</Link>
            {' '}— no PR polish required.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS — self-hides when lib/marketing/testimonials.ts is
          empty, so it sits idle on the page until a real quote lands. */}
      <Testimonials isMobile={isMobile} />

      {/* PRICING */}
      <section id="pricing" style={{ padding: sp, background: L.mint, contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 10 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: L.muted }}>One report costs less than an hour with a consultant. Takes 90 seconds.</p>
            <p style={{ fontSize: 14, color: L.slate, marginTop: 14, lineHeight: 1.6 }}>
              <Link href="/sample-report" style={{ color: L.emerald, fontWeight: 700, textDecoration: 'none' }}>View the full static sample report</Link>
              {' '}— real suburb (Leederville), every section visible, no signup or payment.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 14, maxWidth: 1060, margin: '0 auto' }}>

            {/* ── Free ── */}
            <div style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 20px', display:'flex', flexDirection:'column' as const }}>
              <p style={{ fontSize:11, fontWeight:700, color:L.muted, textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:8 }}>Free</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <p style={{ fontSize:34, fontWeight:900, color:L.slate, letterSpacing:'-.03em' }}>$0</p>
              </div>
              <p style={{ fontSize:12, color:L.muted, marginBottom:18 }}>No card required</p>
              {[
                { label:'GO / CAUTION / NO verdict', included:true },
                { label:'Competitor map (500m radius)', included:true },
                { label:'Top-level location score (0–100)', included:true },
                { label:'Rent-to-revenue band (not full P&L)', included:true },
                { label:'Full financial model', included:false },
                { label:'3-year projection & exact break-even', included:false },
                { label:'Full SWOT & threat scores', included:false },
                { label:'PDF export', included:false },
              ].map(f => (
                <p key={f.label} style={{ fontSize:12, color: f.included ? '#334155' : '#CBD5E1', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color: f.included ? L.emerald : '#CBD5E1', fontWeight:700, flexShrink:0 }}>{f.included ? 'Check' : '—'}</span> {f.label}
                </p>
              ))}
              <div style={{ flexGrow: 1 }}/>
              <a href="/onboarding" style={{ display:'block', marginTop:18, textAlign:'center', padding:'10px', border:`1.5px solid ${L.border}`, borderRadius:11, fontSize:12, fontWeight:700, color:L.slate, textDecoration:'none' }}>Start free</a>
            </div>

            {/* Single Report */}
            <div style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 20px' }}>
              <p style={{ fontSize:11, fontWeight:700, color:L.muted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Single Report</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <p style={{ fontSize:34, fontWeight:900, color:L.slate, letterSpacing:'-.03em' }}>$29</p>
              </div>
              <p style={{ fontSize:12, color:L.muted, marginBottom:18 }}>One-time · per location</p>
              {['Full P&L & financial model','Exact break-even customers/day','3-year revenue projection','Full SWOT + competitor threat detail','Best/worst risk scenarios','PDF (bank & accountant ready)'].map(f => (
                <p key={f} style={{ fontSize:12, color:'#334155', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}>Check {f}</p>
              ))}
              <a href="/onboarding" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, background:L.emerald, borderRadius:11, fontSize:12, fontWeight:700, color:'#fff', textDecoration:'none' }}>Get your report — $29</a>
            </div>
            {/* 3-Pack */}
            <div style={{ background:'linear-gradient(135deg,#0F766E 0%,#0891B2 100%)', borderRadius:22, padding:'26px 24px', position:'relative', boxShadow:'0 8px 32px rgba(15,118,110,.25)' }}>
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:L.amber, color:'#fff', borderRadius:100, padding:'4px 14px', fontSize:11, fontWeight:800, whiteSpace:'nowrap' }}>BEST VALUE</div>
              <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>3-Pack</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <p style={{ fontSize:34, fontWeight:900, color:'#fff', letterSpacing:'-.03em' }}>$59</p>
              </div>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.7)', fontWeight:600, marginBottom:4 }}>$19.67 per report · save 32%</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.45)', marginBottom:18 }}>Compare 3 locations</p>
              {['Everything in Single Report','Compare up to 3 locations side-by-side','Use credits on any address','Credits never expire'].map(f => (
                <p key={f} style={{ fontSize:12, color:'rgba(255,255,255,.85)', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}>Check {f}</p>
              ))}
              <a href="/upgrade" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, background:'#fff', borderRadius:11, fontSize:12, fontWeight:800, color:'#0F766E', textDecoration:'none' }}>Get 3-Pack — $59</a>
            </div>
            {/* 10-Pack */}
            <div style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 24px' }}>
              <p style={{ fontSize:11, fontWeight:700, color:L.muted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>10-Pack</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <p style={{ fontSize:34, fontWeight:900, color:L.slate, letterSpacing:'-.03em' }}>$149</p>
              </div>
              <p style={{ fontSize:12, color:'#059669', fontWeight:600, marginBottom:4 }}>$14.90 per report · save 49%</p>
              <p style={{ fontSize:12, color:L.muted, marginBottom:18 }}>For agencies & multi-site</p>
              {['Everything in Single Report','10 report credits','Bulk location research','Priority support'].map(f => (
                <p key={f} style={{ fontSize:12, color:'#334155', marginBottom:7, display:'flex', alignItems:'center', gap:6 }}>Check {f}</p>
              ))}
              <a href="/upgrade" style={{ display:'block', marginTop:18, textAlign:'center', padding:10, border:`1.5px solid ${L.border}`, borderRadius:11, fontSize:12, fontWeight:700, color:L.muted, textDecoration:'none' }}>Get 10-Pack — $149</a>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: L.muted, marginTop: 20 }}>Your first report is free — verdict, map, score, and rent band. City guides, blog &amp; tools stay free. No card required.</p>

          {/* FAQ */}
          <div style={{ maxWidth: 640, margin: '48px auto 0' }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: L.slate, textTransform: 'uppercase' as const, letterSpacing: '.08em', textAlign: 'center', marginBottom: 24 }}>Common questions</p>
            {HOMEPAGE_FAQS.map((item, i) => (
              <details key={i} style={{ borderTop: `1px solid ${L.border}`, padding: '16px 0' }}>
                <summary style={{ fontSize: 14, fontWeight: 700, color: L.slate, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  {item.question}
                  <span style={{ fontSize: 18, color: L.muted, flexShrink: 0, lineHeight: 1 }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: L.muted, lineHeight: 1.75, marginTop: 10, paddingRight: 24 }}>{item.answer}</p>
              </details>
            ))}
            <div style={{ borderTop: `1px solid ${L.border}` }}/>
          </div>
        </div>
      </section>

      {/* Newsletter — owned channel (warm leads, no algorithm) */}
      <section style={{ padding: sp, background: L.slate, borderTop: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: pad }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
            Newsletter
          </p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: L.white, letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.2 }}>
            Weekly location intelligence
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 24 }}>
            Openings, failures, and where the data points — plus new guides. Unsubscribe anytime.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <NewsletterForm />
          </div>
        </div>
      </section>

            {/* FINAL CTA */}
      <section style={{ padding: sp, background: L.white, textAlign: 'center', borderTop: `1px solid ${L.border}`, contentVisibility: 'auto', containIntrinsicSize: '520px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: pad }}>
          <h2 style={{ fontSize: isMobile ? 30 : 44, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 14, lineHeight: 1.1 }}>
            Know before you sign.
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: L.muted, marginBottom: 8, lineHeight: 1.75 }}>
            Get a GO / CAUTION / NO verdict for any Australian address in about 90 seconds — then unlock the full financial model for $29 if you want to go deeper.
          </p>
          <p style={{ fontSize: isMobile ? 13 : 14, color: '#94A3B8', marginBottom: 32, lineHeight: 1.65 }}>
            This report is a second opinion — not a guarantee. Use it before you shortlist a site, meet an agent, or talk to your accountant.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: L.emerald, color: '#fff', borderRadius: 14, padding: isMobile ? '15px 28px' : '17px 38px', fontWeight: 800, fontSize: isMobile ? 15 : 17, boxShadow: '0 6px 28px rgba(16,185,129,.3)', textDecoration: 'none' }}>
            Check your location — free →
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontSize: 12, color: '#94A3B8', marginTop: 14, flexWrap: 'wrap' }}>
            <span>Free verdict · no card required</span><span>·</span><span>Full unlock $29</span><span>·</span><span>Results in ~90 seconds</span>
          </div>
        </div>
      </section>

      <Footer showNewsletter={false} />
    </main>
  )
}

export default function LandingPage() {
  return (
    <HomepageDemoProvider>
      <LandingPageInner />
    </HomepageDemoProvider>
  )
}