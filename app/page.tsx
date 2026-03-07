'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const S = {
  font:        "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand:       '#0F766E',
  brandLight:  '#14B8A6',
  brandFaded:  '#F0FDFA',
  brandBorder: '#99F6E4',
  n50:         '#FAFAF9',
  n100:        '#F5F5F4',
  n200:        '#E7E5E4',
  n400:        '#A8A29E',
  n500:        '#78716C',
  n700:        '#44403C',
  n800:        '#292524',
  n900:        '#1C1917',
  white:       '#FFFFFF',
  emerald:     '#059669',
  emeraldBg:   '#ECFDF5',
  emeraldBdr:  '#A7F3D0',
  amber:       '#D97706',
  amberBg:     '#FFFBEB',
  amberBdr:    '#FDE68A',
  red:         '#DC2626',
  redBg:       '#FEF2F2',
  redBdr:      '#FECACA',
}

// ── Animated product demo ─────────────────────────────────────────────────────
function ProductDemo() {
  const [phase, setPhase] = useState(0)
  // 0=idle, 1=typing, 2=analyzing, 3=complete
  const [typed, setTyped] = useState('')
  const address = '45 King St, Newtown NSW'
  const [progress, setProgress] = useState(0)
  const [scoreVisible, setScoreVisible] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    let t: any
    // Start typing after 1s
    t = setTimeout(() => {
      setPhase(1)
      let i = 0
      const typer = setInterval(() => {
        i++
        setTyped(address.slice(0, i))
        if (i >= address.length) {
          clearInterval(typer)
          // Start analyzing after 500ms
          setTimeout(() => {
            setPhase(2)
            let p = 0
            const prog = setInterval(() => {
              p += 2
              setProgress(p)
              if (p >= 100) {
                clearInterval(prog)
                setPhase(3)
                setScoreVisible(true)
                let s = 0
                const scoreAnim = setInterval(() => {
                  s += 2
                  setScore(Math.min(s, 82))
                  if (s >= 82) clearInterval(scoreAnim)
                }, 20)
              }
            }, 40)
          }, 500)
        }
      }, 55)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  const msgs = ['Resolving coordinates...', 'Scanning competitors...', 'Analysing demographics...', 'Building financial model...', 'Generating verdict...']
  const msgIdx = Math.min(Math.floor(progress / 22), msgs.length - 1)

  return (
    <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden', width: '100%', maxWidth: 460 }}>
      {/* Window chrome */}
      <div style={{ background: S.n50, borderBottom: `1px solid ${S.n100}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBE2E' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C840' }} />
        </div>
        <div style={{ flex: 1, background: S.n100, borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          <span style={{ fontSize: 11, color: S.n400 }}>locatalyze.vercel.app</span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Input */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Business Address</p>
          <div style={{ background: S.n50, border: `1.5px solid ${phase >= 1 ? S.brand : S.n200}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: S.n800, fontWeight: 500, minHeight: 40, transition: 'border-color 0.3s', display: 'flex', alignItems: 'center', gap: 2 }}>
            {typed || <span style={{ color: S.n400 }}>Enter address...</span>}
            {phase === 1 && <span style={{ width: 2, height: 16, background: S.brand, display: 'inline-block', animation: 'blink 0.7s infinite' }} />}
          </div>
        </div>

        {/* Analyzing state */}
        {phase === 2 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: S.n500 }}>{msgs[msgIdx]}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: S.brand }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${S.brand},${S.brandLight})`, borderRadius: 100, transition: 'width 0.1s linear' }} />
            </div>
          </div>
        )}

        {/* Result */}
        {phase === 3 && (
          <div>
            {/* Verdict + score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 800 }}>
                ✅ GO
              </span>
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="32" cy="32" r="26" fill="none" stroke={S.n100} strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke={S.emerald} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - score / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: 8, color: S.n400 }}>/100</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { l: 'Est. Annual Profit', v: '$297,600', color: S.emerald },
                { l: 'Monthly Revenue',    v: '$91,200',  color: S.n800    },
                { l: 'Break-even / Day',   v: '38 customers', color: S.n800 },
                { l: 'Payback Period',     v: '7 months', color: S.brand   },
              ].map(m => (
                <div key={m.l} style={{ background: S.n50, borderRadius: 8, border: `1px solid ${S.n100}`, padding: '10px 12px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{m.l}</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.v}</p>
                </div>
              ))}
            </div>

            {/* Score bars */}
            {[
              { l: 'Demand',        s: 85, c: S.emerald },
              { l: 'Rent',          s: 78, c: S.emerald },
              { l: 'Competition',   s: 72, c: S.emerald },
              { l: 'Profitability', s: 90, c: S.emerald },
            ].map(b => (
              <div key={b.l} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: S.n500 }}>{b.l}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.s}</span>
                </div>
                <div style={{ height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.s}%`, background: b.c, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  )
}

// ── Sample report tabs ────────────────────────────────────────────────────────
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: S.n700, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'go' | 'caution' | 'no'>('go')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const sampleReports = {
    go: {
      biz: 'Specialty Coffee Shop', location: 'Subiaco, WA', verdict: 'GO', score: 82,
      revenue: '$91,200', profit: '$24,800', annualProfit: '$297,600', breakeven: '38 customers/day', payback: '7 months',
      scores: [
        { label: 'Demand & Demographics', score: 85, color: S.emerald },
        { label: 'Rent Affordability',    score: 78, color: S.emerald },
        { label: 'Competition',           score: 72, color: S.emerald },
        { label: 'Profitability',         score: 90, color: S.emerald },
      ],
      swot: { strengths: ['Strong foot traffic from professionals', 'High disposable income area'], weaknesses: ['Competitive market with established brands'], opportunities: ['Growing brunch culture in the area'], threats: ['Rising commercial rents in suburb'] },
      rec: 'Strong opportunity. High demand demographics combined with manageable competition makes this an excellent location.',
    },
    caution: {
      biz: 'Casual Dining Restaurant', location: 'Fremantle, WA', verdict: 'CAUTION', score: 61,
      revenue: '$74,400', profit: '$11,200', annualProfit: '$134,400', breakeven: '52 customers/day', payback: '14 months',
      scores: [
        { label: 'Demand & Demographics', score: 68, color: S.amber },
        { label: 'Rent Affordability',    score: 55, color: S.amber },
        { label: 'Competition',           score: 60, color: S.amber },
        { label: 'Profitability',         score: 62, color: S.amber },
      ],
      swot: { strengths: ['High tourist foot traffic in peak season'], weaknesses: ['Strong seasonal demand fluctuation'], opportunities: ['Underserved dinner market on weekdays'], threats: ['8 direct competitors within 500m'] },
      rec: 'Proceed with caution. Seasonal tourism dependency creates revenue instability.',
    },
    no: {
      biz: 'Boutique Gym', location: 'Joondalup, WA', verdict: 'NO', score: 44,
      revenue: '$51,000', profit: '$3,200', annualProfit: '$38,400', breakeven: '74 customers/day', payback: 'Not viable',
      scores: [
        { label: 'Demand & Demographics', score: 48, color: S.red },
        { label: 'Rent Affordability',    score: 38, color: S.red },
        { label: 'Competition',           score: 42, color: S.red },
        { label: 'Profitability',         score: 46, color: S.red },
      ],
      swot: { strengths: ['Large residential catchment area'], weaknesses: ['4 established gyms already nearby'], opportunities: ['Limited group fitness options'], threats: ['High rent consuming 34% of projected revenue'] },
      rec: 'Not recommended. Oversaturated fitness market with insufficient margin.',
    },
  }

  const r = sampleReports[activeTab]
  const vc = activeTab === 'go'
    ? { bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, icon: '✅' }
    : activeTab === 'caution'
    ? { bg: S.amberBg,   text: S.amber,   border: S.amberBdr,   icon: '⚠️' }
    : { bg: S.redBg,     text: S.red,     border: S.redBdr,     icon: '🚫' }

  const W = { maxWidth: 1280, margin: '0 auto', padding: '0 40px' }

  return (
    <div style={{ minHeight: '100vh', background: S.white, fontFamily: S.font, color: S.n900 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        html { scroll-behavior: smooth; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
          .w-pad { padding: 0 20px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Sticky Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${S.n100}` : 'none',
        padding: '0 40px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 15 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>Locatalyze</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <a href="#how-it-works" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 14px' }}>How it works</a>
          <a href="#sample-report" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 14px' }}>Sample report</a>
          <a href="#pricing" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 14px' }}>Pricing</a>
          <Link href="/methodology" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 14px' }}>Data & Methodology</Link>
          <Link href="/auth/login" style={{ fontSize: 13, color: S.n700, fontWeight: 600, padding: '6px 14px' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: S.white, borderRadius: 10, padding: '9px 20px', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 10px rgba(15,118,110,0.2)', letterSpacing: '-0.01em' }}>
            Try free →
          </Link>
        </div>
      </nav>

      {/* ── Hero — split layout ── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${S.brandFaded} 0%, ${S.white} 70%)` }}>
        <div style={{ ...W, paddingTop: 20 }} className="w-pad">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">

            {/* Left — copy */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 24, boxShadow: '0 1px 4px rgba(15,118,110,0.1)' }}>
                📍 AI-powered location analysis for business owners
              </div>
              <h1 style={{ fontSize: 54, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 20 }}>
                The wrong location<br />costs <span style={{ color: S.brand }}>$200,000+.</span>
              </h1>
              <p style={{ fontSize: 17, color: S.n500, lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
                Paste any Australian address. Get a full AI analysis of competition, foot traffic, demographics and profitability — with a clear <strong style={{ color: S.n800 }}>GO, CAUTION or NO</strong> verdict in 30 seconds.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '15px 28px', fontWeight: 800, fontSize: 15, boxShadow: '0 4px 20px rgba(15,118,110,0.3)', letterSpacing: '-0.01em' }}>
                  Analyse your first location free →
                </Link>
                <a href="#sample-report" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, color: S.n700, borderRadius: 12, padding: '15px 22px', fontWeight: 600, fontSize: 14, border: `1.5px solid ${S.n200}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  See sample report
                </a>
              </div>
              <p style={{ fontSize: 12, color: S.n400 }}>Free plan · No credit card · 3 full reports included</p>

              {/* Social proof */}
              <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: `1px solid ${S.n100}`, flexWrap: 'wrap' }}>
                {[
                  { value: '1,200+', label: 'founders analysed' },
                  { value: '4,800+', label: 'locations scored'  },
                  { value: '94%',    label: 'accuracy rating'   },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: 22, fontWeight: 900, color: S.brand, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: S.n400, marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — animated demo */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ProductDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── Niche strip ── */}
      <section style={{ background: S.n900, padding: '16px 40px', borderTop: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ ...W, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ fontSize: 11, color: S.n500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Built for</p>
          {['☕ Cafes', '🍽️ Restaurants', '👗 Retail', '💪 Gyms', '🥐 Bakeries', '💈 Salons', '🏪 Any retail business'].map(b => (
            <span key={b} style={{ fontSize: 13, color: S.n400, fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '100px 40px', background: S.white }}>
        <div style={W} className="w-pad">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>How it works</p>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 14 }}>From address to verdict in 30 seconds</h2>
            <p style={{ fontSize: 17, color: S.n500, maxWidth: 500, margin: '0 auto' }}>No spreadsheets. No consultants. Just paste the address.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-3">
            {[
              { n: '01', icon: '📍', title: 'Enter your location', desc: 'Type any Australian address. Add your business type, monthly rent and average order size. Takes 60 seconds.' },
              { n: '02', icon: '⚙️', title: 'AI analyses in real time', desc: 'We pull live competitor data, demographics, rental benchmarks and foot traffic signals — all automatically.' },
              { n: '03', icon: '📊', title: 'Get your full report', desc: 'GO / CAUTION / NO verdict with full financial model, SWOT analysis, risk scenarios and 3-year projection.' },
            ].map(s => (
              <div key={s.n} style={{ background: S.n50, borderRadius: 20, border: `1px solid ${S.n200}`, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 36, fontWeight: 900, color: S.n100, letterSpacing: '-0.04em' }}>{s.n}</div>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 16 }}>{s.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Report — FULL WIDTH ── */}
      <section id="sample-report" style={{ padding: '100px 40px', background: S.n50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }} className="w-pad">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Sample report</p>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 12 }}>See exactly what you get</h2>
            <p style={{ fontSize: 16, color: S.n500 }}>Select a verdict to see how each scenario looks.</p>
          </div>

          {/* Verdict tabs */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
            {(['go', 'caution', 'no'] as const).map(v => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{
                  padding: '11px 28px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700,
                  background: activeTab === v ? (v === 'go' ? S.emerald : v === 'caution' ? S.amber : S.red) : S.white,
                  color: activeTab === v ? S.white : S.n500,
                  boxShadow: activeTab === v ? '0 4px 16px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                  border: `1.5px solid ${activeTab === v ? 'transparent' : S.n200}`,
                  transition: 'all 0.15s',
                }}
              >
                {v === 'go' ? '✅ GO verdict' : v === 'caution' ? '⚠️ CAUTION verdict' : '🚫 NO verdict'}
              </button>
            ))}
          </div>

          {/* Wide report card */}
          <div style={{ background: S.white, borderRadius: 24, border: `1px solid ${S.n200}`, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, padding: '32px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>📍 {r.location}</p>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: S.white, letterSpacing: '-0.03em', marginBottom: 14 }}>{r.biz}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: vc.bg, color: vc.text, border: `1.5px solid ${vc.border}`, borderRadius: 100, padding: '7px 18px', fontSize: 13, fontWeight: 800 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: vc.text, display: 'inline-block' }} />
                    {vc.icon} {r.verdict} Verdict
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 100, height: 100 }}>
                    <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke={vc.text} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - r.score / 100)}`}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 28, fontWeight: 900, color: S.white, lineHeight: 1 }}>{r.score}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>/100</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Location Score</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '32px 40px' }}>
              {/* Verdict box */}
              <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 28 }}>
                <p style={{ fontSize: 14, color: vc.text, lineHeight: 1.7 }}>💡 <strong>AI Verdict:</strong> {r.rec}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {/* Left */}
                <div>
                  {/* Metrics */}
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Key Financials</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                    {[
                      { l: 'Monthly Revenue',  v: r.revenue,      highlight: false },
                      { l: 'Monthly Profit',   v: r.profit,       highlight: false },
                      { l: 'Annual Profit',    v: r.annualProfit,  highlight: true  },
                      { l: 'Payback Period',   v: r.payback,      highlight: false },
                    ].map(m => (
                      <div key={m.l} style={{ background: S.n50, borderRadius: 12, border: `1px solid ${S.n200}`, padding: '14px 16px' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{m.l}</p>
                        <p style={{ fontSize: 17, fontWeight: 800, color: m.highlight ? S.emerald : S.n800 }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  {/* Score bars */}
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Score Breakdown</p>
                  {r.scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />)}
                </div>

                {/* Right — SWOT */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>SWOT Analysis</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { key: 'strengths',     icon: '💪', items: r.swot.strengths,     bg: S.emeraldBg, border: S.emeraldBdr, text: '#065F46' },
                      { key: 'weaknesses',    icon: '⚠️', items: r.swot.weaknesses,    bg: S.amberBg,   border: S.amberBdr,   text: '#92400E' },
                      { key: 'opportunities', icon: '🚀', items: r.swot.opportunities, bg: '#EFF6FF',   border: '#BFDBFE',    text: '#1D4ED8' },
                      { key: 'threats',       icon: '🔴', items: r.swot.threats,       bg: S.redBg,     border: S.redBdr,     text: '#991B1B' },
                    ].map(sw => (
                      <div key={sw.key} style={{ background: sw.bg, border: `1px solid ${sw.border}`, borderRadius: 10, padding: '10px 14px' }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: sw.text, marginBottom: 4, textTransform: 'uppercase' }}>{sw.icon} {sw.key}</p>
                        {sw.items.map((item, i) => <p key={i} style={{ fontSize: 12, color: sw.text, opacity: 0.85 }}>· {item}</p>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${S.n100}`, padding: '20px 40px', background: S.n50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 14, color: S.n500 }}>This is a sample. Your real report is generated from live data for your exact address.</p>
              <Link href="/auth/signup" style={{ background: S.brand, color: S.white, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, boxShadow: '0 2px 10px rgba(15,118,110,0.25)' }}>
                Get my report free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison showcase ── */}
      <section style={{ padding: '100px 40px', background: S.n900 }}>
        <div style={W} className="w-pad">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: S.brandLight, marginBottom: 20 }}>
                ⚖️ Comparison tool
              </div>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: S.white, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>
                Compare multiple locations<br />side by side
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 28 }}>
                Analysed 3 potential sites? Compare them instantly. Revenue, profit, competition and score — all in one table. The winner is highlighted automatically.
              </p>
              <Link href="/auth/signup" style={{ display: 'inline-flex', background: S.brandLight, color: S.white, borderRadius: 12, padding: '13px 24px', fontWeight: 700, fontSize: 14 }}>
                Try comparison tool free →
              </Link>
            </div>
            {/* Comparison table mockup */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location Comparison</p>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>Metric</th>
                    {[
                      { name: 'Subiaco',   winner: true  },
                      { name: 'Fremantle', winner: false },
                      { name: 'Perth CBD', winner: false },
                    ].map(c => (
                      <th key={c.name} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: c.winner ? S.brandLight : 'rgba(255,255,255,0.5)' }}>
                        {c.winner && '🏆 '}{c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: 'Location Score', vals: ['82', '61', '74'],       best: 0, colors: [S.emerald, S.amber, S.emerald] },
                    { metric: 'Annual Profit',  vals: ['$297k', '$134k', '$245k'], best: 0 },
                    { metric: 'Competition',    vals: ['Medium', 'High', 'High'],  best: 0 },
                    { metric: 'Payback',        vals: ['7 mo', '14 mo', '9 mo'],   best: 0 },
                    { metric: 'Verdict',        vals: ['GO', 'CAUTION', 'GO'],     best: 0, isVerdict: true },
                  ].map((row, i) => (
                    <tr key={row.metric} style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{row.metric}</td>
                      {row.vals.map((v, vi) => (
                        <td key={vi} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: vi === 0 ? 800 : 600, color: vi === 0 ? S.white : 'rgba(255,255,255,0.4)' }}>
                          {row.isVerdict ? (
                            <span style={{ background: v === 'GO' ? 'rgba(5,150,105,0.15)' : 'rgba(217,119,6,0.15)', color: v === 'GO' ? S.emerald : S.amber, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{v}</span>
                          ) : v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section style={{ padding: '100px 40px', background: S.white }}>
        <div style={W} className="w-pad">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Data sources</p>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 12 }}>Where the data comes from</h2>
            <p style={{ fontSize: 16, color: S.n500, maxWidth: 440, margin: '0 auto' }}>Every report is built on real, live data — not guesses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="grid-3">
            {[
              { icon: '🗺️', title: 'Google Maps & Places', desc: 'Real competitor locations, ratings and business density within 500m.' },
              { icon: '👥', title: 'Demographics data',    desc: 'Population, income levels, household density and spending patterns by suburb.' },
              { icon: '🏠', title: 'Rental benchmarks',   desc: 'Commercial rent estimates calibrated against current market rates.' },
              { icon: '📊', title: 'Competition scoring',  desc: 'Intensity rating based on competitor count and their market strength.' },
              { icon: '🤖', title: 'AI financial model',  desc: 'Break-even, 3-year projections and profitability using your inputs.' },
              { icon: '📈', title: 'Market demand signals', desc: 'Search trends, foot traffic proxies and category growth by business type.' },
            ].map(d => (
              <div key={d.title} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{d.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{d.title}</h3>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/methodology" style={{ fontSize: 14, color: S.brand, fontWeight: 700 }}>Read full data methodology →</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '100px 40px', background: S.n50 }}>
        <div style={W} className="w-pad">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>What founders say</p>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em' }}>Used by founders across Australia</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="grid-3">
            {[
              { quote: 'I was about to sign a 3-year lease. Locatalyze gave me a NO verdict and saved me from a $180k mistake. The competition data was spot on.', name: 'Sarah M.', role: 'Cafe owner, Melbourne' },
              { quote: 'Compared 4 locations in 10 minutes. The comparison tool is brilliant — picked the site with the highest profit potential immediately.', name: 'James T.', role: 'Franchise buyer, Sydney' },
              { quote: 'As a commercial real estate analyst I use this with clients. The financial model is genuinely useful for early-stage feasibility.', name: 'Priya K.', role: 'Property analyst, Brisbane' },
            ].map(t => (
              <div key={t.name} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 20, padding: '28px 26px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 16, color: S.amber, marginBottom: 14, letterSpacing: 2 }}>★★★★★</p>
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.75, marginBottom: 20 }}>"{t.quote}"</p>
                <div style={{ paddingTop: 16, borderTop: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: S.n900 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: S.n400, marginTop: 2 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '100px 40px', background: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }} className="w-pad">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 12 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 16, color: S.n500 }}>Start free. Upgrade only when you need more.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }} className="grid-3">
            {/* Free */}
            <div style={{ background: S.n50, border: `1.5px solid ${S.n200}`, borderRadius: 24, padding: '28px 24px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Free</p>
              <p style={{ fontSize: 38, fontWeight: 900, color: S.n900, marginBottom: 4, letterSpacing: '-0.03em' }}>$0</p>
              <p style={{ fontSize: 13, color: S.n400, marginBottom: 24 }}>Forever free</p>
              {['3 location reports', 'Full financial model', 'SWOT analysis', 'PDF download'].map(f => (
                <p key={f} style={{ fontSize: 13, color: S.n700, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: S.emerald, fontWeight: 700 }}>✓</span> {f}
                </p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 24, textAlign: 'center', padding: '12px', border: `1.5px solid ${S.n200}`, borderRadius: 12, fontSize: 14, fontWeight: 700, color: S.n700 }}>
                Get started free
              </Link>
            </div>
            {/* Monthly */}
            <div style={{ background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pro Monthly</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <p style={{ fontSize: 38, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>$19</p>
                <p style={{ fontSize: 14, color: S.n400 }}>/month</p>
              </div>
              <p style={{ fontSize: 13, color: S.n400, marginBottom: 24 }}>Cancel anytime</p>
              {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
                <p key={f} style={{ fontSize: 13, color: S.n700, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: S.emerald, fontWeight: 700 }}>✓</span> {f}
                </p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 24, textAlign: 'center', padding: '12px', border: `1.5px solid ${S.brand}`, borderRadius: 12, fontSize: 14, fontWeight: 700, color: S.brand }}>
                Start monthly
              </Link>
            </div>
            {/* Lifetime */}
            <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 24, padding: '28px 24px', position: 'relative', boxShadow: '0 8px 32px rgba(15,118,110,0.25)' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: S.amber, color: S.white, borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(217,119,6,0.3)' }}>
                BEST VALUE
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pro Lifetime</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <p style={{ fontSize: 38, fontWeight: 900, color: S.white, letterSpacing: '-0.03em' }}>$49</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>one-time</p>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Pay once, use forever</p>
              {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
                <p key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>✓</span> {f}
                </p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 24, textAlign: 'center', padding: '12px', background: S.white, borderRadius: 12, fontSize: 14, fontWeight: 800, color: S.brand }}>
                Get lifetime access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '100px 40px', background: `linear-gradient(135deg,${S.n900} 0%,#0C1F1C 100%)`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, left: '10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${S.brand}20 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: '10%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle,#0891B220 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: S.white, letterSpacing: '-0.04em', marginBottom: 18, lineHeight: 1.1 }}>
            Don't sign a lease<br />without running this first.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', marginBottom: 36, lineHeight: 1.75 }}>
            The average location mistake costs $200,000+. A Locatalyze report is free to start.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, color: S.brand, borderRadius: 14, padding: '18px 36px', fontWeight: 800, fontSize: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            Analyse your first location free →
          </Link>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>No credit card · 3 free reports · 30 seconds</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: S.n900, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '36px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: S.white, letterSpacing: '-0.02em' }}>Locatalyze</span>
          </div>
          <p style={{ fontSize: 13, color: S.n500 }}>© 2026 Locatalyze. Built for Australian business owners.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/methodology" style={{ fontSize: 13, color: S.n500, fontWeight: 500 }}>How it works</Link>
            <Link href="/analyse"     style={{ fontSize: 13, color: S.n500, fontWeight: 500 }}>Location guides</Link>
            <Link href="/auth/signup" style={{ fontSize: 13, color: S.brand,  fontWeight: 700 }}>Try free →</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}