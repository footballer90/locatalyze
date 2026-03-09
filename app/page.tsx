'use client'
import Footer from '@/components/Footer'
import GlideShowcase from '@/components/GlideShowcase'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import HowItWorks from '@/components/HowItWorks'

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ── Animated product demo ─────────────────────────────────────────────────────
function ProductDemo() {
  const [phase, setPhase] = useState(0)
  const [typed, setTyped] = useState('')
  const address = '45 King St, Newtown NSW'
  const [progress, setProgress] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase(1)
      let i = 0
      const typer = setInterval(() => {
        i++
        setTyped(address.slice(0, i))
        if (i >= address.length) {
          clearInterval(typer)
          setTimeout(() => {
            setPhase(2)
            let p = 0
            const prog = setInterval(() => {
              p += 2
              setProgress(p)
              if (p >= 100) {
                clearInterval(prog)
                setPhase(3)
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
    <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.n200}`, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden', width: '100%', maxWidth: 440 }}>
      <div style={{ background: S.n50, borderBottom: `1px solid ${S.n100}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FFBE2E','#27C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, background: S.n100, borderRadius: 6, height: 22, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          <span style={{ fontSize: 11, color: S.n400 }}>locatalyze.vercel.app</span>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Business Address</p>
          <div style={{ background: S.n50, border: `1.5px solid ${phase >= 1 ? S.brand : S.n200}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: S.n800, fontWeight: 500, minHeight: 38, transition: 'border-color 0.3s', display: 'flex', alignItems: 'center', gap: 2 }}>
            {typed || <span style={{ color: S.n400 }}>Enter address...</span>}
            {phase === 1 && <span style={{ width: 2, height: 14, background: S.brand, display: 'inline-block', animation: 'blink 0.7s infinite' }} />}
          </div>
        </div>
        {phase === 2 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: S.n500 }}>{msgs[msgIdx]}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: S.brand }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${S.brand},${S.brandLight})`, borderRadius: 100, transition: 'width 0.1s linear' }} />
            </div>
          </div>
        )}
        {phase === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 800 }}>✅ GO</span>
              <div style={{ position: 'relative', width: 56, height: 56 }}>
                <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="28" cy="28" r="22" fill="none" stroke={S.n100} strokeWidth="5" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke={S.emerald} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - score / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: 8, color: S.n400 }}>/100</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
              {[
                { l: 'Annual Profit', v: '$297,600', color: S.emerald },
                { l: 'Monthly Revenue', v: '$91,200', color: S.n800 },
                { l: 'Break-even / Day', v: '38 customers', color: S.n800 },
                { l: 'Payback Period', v: '7 months', color: S.brand },
              ].map(m => (
                <div key={m.l} style={{ background: S.n50, borderRadius: 7, border: `1px solid ${S.n100}`, padding: '8px 10px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{m.l}</p>
                  <p style={{ fontSize: 12, fontWeight: 800, color: m.color }}>{m.v}</p>
                </div>
              ))}
            </div>
            {[
              { l: 'Demand', s: 85 },{ l: 'Rent', s: 78 },{ l: 'Competition', s: 72 },{ l: 'Profitability', s: 90 },
            ].map(b => (
              <div key={b.l} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: S.n500 }}>{b.l}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald }}>{b.s}</span>
                </div>
                <div style={{ height: 3, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.s}%`, background: S.emerald, borderRadius: 100 }} />
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
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  }, [scrolled])

  const sampleReports = {
    go: {
      biz: 'Specialty Coffee Shop', location: 'Subiaco, WA', verdict: 'GO', score: 82,
      revenue: '$91,200', profit: '$24,800', annualProfit: '$297,600', breakeven: '38 customers/day', payback: '7 months',
      scores: [
        { label: 'Demand & Demographics', score: 85, color: S.emerald },
        { label: 'Rent Affordability', score: 78, color: S.emerald },
        { label: 'Competition', score: 72, color: S.emerald },
        { label: 'Profitability', score: 90, color: S.emerald },
      ],
      swot: { strengths: ['Strong foot traffic from professionals', 'High disposable income area'], weaknesses: ['Competitive market with established brands'], opportunities: ['Growing brunch culture in the area'], threats: ['Rising commercial rents in suburb'] },
      rec: 'Strong opportunity. High demand demographics combined with manageable competition makes this an excellent location.',
    },
    caution: {
      biz: 'Casual Dining Restaurant', location: 'Fremantle, WA', verdict: 'CAUTION', score: 61,
      revenue: '$74,400', profit: '$11,200', annualProfit: '$134,400', breakeven: '52 customers/day', payback: '14 months',
      scores: [
        { label: 'Demand & Demographics', score: 68, color: S.amber },
        { label: 'Rent Affordability', score: 55, color: S.amber },
        { label: 'Competition', score: 60, color: S.amber },
        { label: 'Profitability', score: 62, color: S.amber },
      ],
      swot: { strengths: ['High tourist foot traffic in peak season'], weaknesses: ['Strong seasonal demand fluctuation'], opportunities: ['Underserved dinner market on weekdays'], threats: ['8 direct competitors within 500m'] },
      rec: 'Proceed with caution. Seasonal tourism dependency creates revenue instability.',
    },
    no: {
      biz: 'Boutique Gym', location: 'Joondalup, WA', verdict: 'NO', score: 44,
      revenue: '$51,000', profit: '$3,200', annualProfit: '$38,400', breakeven: '74 customers/day', payback: 'Not viable',
      scores: [
        { label: 'Demand & Demographics', score: 48, color: S.red },
        { label: 'Rent Affordability', score: 38, color: S.red },
        { label: 'Competition', score: 42, color: S.red },
        { label: 'Profitability', score: 46, color: S.red },
      ],
      swot: { strengths: ['Large residential catchment area'], weaknesses: ['4 established gyms already nearby'], opportunities: ['Limited group fitness options'], threats: ['High rent consuming 34% of projected revenue'] },
      rec: 'Not recommended. Oversaturated fitness market with insufficient margin.',
    },
  }

  const r = sampleReports[activeTab]
  const vc = activeTab === 'go'
    ? { bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, icon: '✅' }
    : activeTab === 'caution'
    ? { bg: S.amberBg, text: S.amber, border: S.amberBdr, icon: '⚠️' }
    : { bg: S.redBg, text: S.red, border: S.redBdr, icon: '🚫' }

  const pad = isMobile ? '0 16px' : '0 40px'
  const sectionPad = isMobile ? '60px 16px' : '100px 40px'
  const W = { maxWidth: 1280, margin: '0 auto' }

  return (
    <div style={{ minHeight: '100vh', background: S.white, fontFamily: S.font, color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } a { text-decoration: none; color: inherit; } button { font-family: inherit; cursor: pointer; } html { scroll-behavior: smooth; }`}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menuOpen ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled || menuOpen ? `1px solid ${S.n100}` : 'none',
        padding: `0 ${isMobile ? 16 : 40}px`, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em' }}>Locatalyze</span>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <a href="#how-it-works" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>How it works</a>
            <a href="#sample-report" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>Sample report</a>
            <a href="#pricing" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>Pricing</a>
            <Link href="/methodology" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>Methodology</Link>
            <Link href="/auth/login" style={{ fontSize: 13, color: S.n700, fontWeight: 600, padding: '6px 12px' }}>Sign in</Link>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: 13, boxShadow: '0 2px 10px rgba(15,118,110,0.2)' }}>
              Try free →
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}>
            <span style={{ display: 'block', width: 22, height: 2, background: S.n700, borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: S.n700, borderRadius: 2, transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: S.n700, borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        )}
      </nav>

      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99, background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Sample report', href: '#sample-report' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Methodology', href: '/methodology' },
          ].map(item => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 8px', fontSize: 15, fontWeight: 600, color: S.n700, borderBottom: `1px solid ${S.n100}` }}>
              {item.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}
              style={{ flex: 1, textAlign: 'center', padding: '12px', border: `1.5px solid ${S.n200}`, borderRadius: 10, fontSize: 14, fontWeight: 700, color: S.n700 }}>
              Sign in
            </Link>
            <Link href="/auth/signup" onClick={() => setMenuOpen(false)}
              style={{ flex: 2, textAlign: 'center', padding: '12px', background: S.brand, borderRadius: 10, fontSize: 14, fontWeight: 700, color: S.white }}>
              Try free →
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ paddingTop: isMobile ? 80 : 100, paddingBottom: isMobile ? 48 : 80, background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${S.brandFaded} 0%, ${S.white} 70%)` }}>
        <div style={{ ...W, padding: pad, paddingTop: isMobile ? 16 : 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 60, alignItems: 'center' }}>

            {/* Copy */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: S.brand, marginBottom: 20, boxShadow: '0 1px 4px rgba(15,118,110,0.1)' }}>
                📍 AI-powered location analysis for business owners
              </div>
              <h1 style={{ fontSize: isMobile ? 36 : 54, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16 }}>
                The wrong location<br />costs <span style={{ color: S.brand }}>$200,000+.</span>
              </h1>
              <p style={{ fontSize: isMobile ? 15 : 17, color: S.n500, lineHeight: 1.75, marginBottom: 28, maxWidth: 440 }}>
                Paste any Australian address. Get a full AI analysis with a clear <strong style={{ color: S.n800 }}>GO, CAUTION or NO</strong> verdict in 30 seconds.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: S.white, borderRadius: 12, padding: isMobile ? '13px 22px' : '15px 28px', fontWeight: 800, fontSize: isMobile ? 14 : 15, boxShadow: '0 4px 20px rgba(15,118,110,0.3)' }}>
                  Analyse your first location free →
                </Link>
                <a href="#sample-report" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, color: S.n700, borderRadius: 12, padding: isMobile ? '13px 18px' : '15px 22px', fontWeight: 600, fontSize: 14, border: `1.5px solid ${S.n200}` }}>
                  See sample report
                </a>
              </div>
              <p style={{ fontSize: 12, color: S.n400 }}>Free plan · No credit card · 3 full reports included</p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: isMobile ? 20 : 28, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${S.n100}`, flexWrap: 'wrap' }}>
                {[
                  { value: '1,200+', label: 'founders analysed' },
                  { value: '4,800+', label: 'locations scored' },
                  { value: '94%', label: 'accuracy rating' },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: S.brand, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: S.n400, marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ProductDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── Niche strip ── */}
      <section style={{ background: S.n900, padding: `14px ${isMobile ? 16 : 40}px` }}>
        <div style={{ ...W, display: 'flex', justifyContent: 'center', gap: isMobile ? 14 : 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ fontSize: 10, color: S.n500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Built for</p>
          {['☕ Cafes', '🍽️ Restaurants', '👗 Retail', '💪 Gyms', '🥐 Bakeries', '💈 Salons'].map(b => (
            <span key={b} style={{ fontSize: isMobile ? 12 : 13, color: S.n400, fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </section>

      <GlideShowcase />

      <HowItWorks />

      {/* ── Sample Report ── */}
      <section id="sample-report" style={{ padding: sectionPad, background: S.n50 }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Sample report</p>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 10 }}>See exactly what you get</h2>
            <p style={{ fontSize: 15, color: S.n500 }}>Select a verdict to see how each scenario looks.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            {(['go', 'caution', 'no'] as const).map(v => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{
                  padding: isMobile ? '9px 16px' : '11px 24px', borderRadius: 10, border: 'none', fontSize: isMobile ? 12 : 14, fontWeight: 700,
                  background: activeTab === v ? (v === 'go' ? S.emerald : v === 'caution' ? S.amber : S.red) : S.white,
                  color: activeTab === v ? S.white : S.n500,
                  boxShadow: activeTab === v ? '0 4px 16px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                  outline: activeTab === v ? 'none' : `1.5px solid ${S.n200}`,
                }}>
                {v === 'go' ? '✅ GO verdict' : v === 'caution' ? '⚠️ CAUTION' : '🚫 NO verdict'}
              </button>
            ))}
          </div>

          {/* Report card */}
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, padding: isMobile ? '24px 20px' : '32px 40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>📍 {r.location}</p>
                  <h3 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900, color: S.white, letterSpacing: '-0.02em', marginBottom: 12 }}>{r.biz}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: vc.bg, color: vc.text, border: `1.5px solid ${vc.border}`, borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 800 }}>
                    {vc.icon} {r.verdict} Verdict
                  </span>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ position: 'relative', width: isMobile ? 72 : 96, height: isMobile ? 72 : 96 }}>
                    <svg width={isMobile ? 72 : 96} height={isMobile ? 72 : 96} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={isMobile ? 36 : 48} cy={isMobile ? 36 : 48} r={isMobile ? 28 : 38} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                      <circle cx={isMobile ? 36 : 48} cy={isMobile ? 36 : 48} r={isMobile ? 28 : 38} fill="none" stroke={vc.text} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * (isMobile ? 28 : 38)}`}
                        strokeDashoffset={`${2 * Math.PI * (isMobile ? 28 : 38) * (1 - r.score / 100)}`} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color: S.white, lineHeight: 1 }}>{r.score}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>/100</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Score</p>
                </div>
              </div>
            </div>

            <div style={{ padding: isMobile ? '20px 16px' : '32px 40px' }}>
              <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: vc.text, lineHeight: 1.7 }}>💡 <strong>AI Verdict:</strong> {r.rec}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 32 }}>
                {/* Financials + scores */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Key Financials</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                    {[
                      { l: 'Monthly Revenue', v: r.revenue, highlight: false },
                      { l: 'Monthly Profit', v: r.profit, highlight: false },
                      { l: 'Annual Profit', v: r.annualProfit, highlight: true },
                      { l: 'Payback Period', v: r.payback, highlight: false },
                    ].map(m => (
                      <div key={m.l} style={{ background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '12px 14px' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.l}</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: m.highlight ? S.emerald : S.n800 }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Score Breakdown</p>
                  {r.scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />)}
                </div>

                {/* SWOT */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>SWOT Analysis</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { key: 'strengths', icon: '💪', items: r.swot.strengths, bg: S.emeraldBg, border: S.emeraldBdr, text: '#065F46' },
                      { key: 'weaknesses', icon: '⚠️', items: r.swot.weaknesses, bg: S.amberBg, border: S.amberBdr, text: '#92400E' },
                      { key: 'opportunities', icon: '🚀', items: r.swot.opportunities, bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
                      { key: 'threats', icon: '🔴', items: r.swot.threats, bg: S.redBg, border: S.redBdr, text: '#991B1B' },
                    ].map(sw => (
                      <div key={sw.key} style={{ background: sw.bg, border: `1px solid ${sw.border}`, borderRadius: 9, padding: '10px 12px' }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: sw.text, marginBottom: 3, textTransform: 'uppercase' }}>{sw.icon} {sw.key}</p>
                        {sw.items.map((item, i) => <p key={i} style={{ fontSize: 12, color: sw.text, opacity: 0.85 }}>· {item}</p>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${S.n100}`, padding: isMobile ? '16px' : '20px 40px', background: S.n50, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
              <p style={{ fontSize: 13, color: S.n500 }}>This is a sample. Your real report uses live data for your exact address.</p>
              <Link href="/auth/signup" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 10px rgba(15,118,110,0.25)', whiteSpace: 'nowrap' }}>
                Get my report free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section style={{ padding: sectionPad, background: S.white }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Data sources</p>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 10 }}>Where the data comes from</h2>
            <p style={{ fontSize: 15, color: S.n500 }}>Every report is built on real, live data — not guesses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: 12 }}>
            {[
              { icon: '🗺️', title: 'Google Maps & Places', desc: 'Real competitor locations within 500m.' },
              { icon: '👥', title: 'Demographics', desc: 'Population, income and spending by suburb.' },
              { icon: '🏠', title: 'Rental benchmarks', desc: 'Commercial rent estimates for your area.' },
              { icon: '📊', title: 'Competition scoring', desc: 'Intensity rating from competitor data.' },
              { icon: '🤖', title: 'AI financial model', desc: 'Break-even and 3-year projections.' },
              { icon: '📈', title: 'Market demand', desc: 'Search trends and foot traffic signals.' },
            ].map(d => (
              <div key={d.title} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 14, padding: isMobile ? '16px 14px' : '22px 20px' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>{d.icon}</span>
                <h3 style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: S.n900, marginBottom: 5 }}>{d.title}</h3>
                <p style={{ fontSize: isMobile ? 11 : 13, color: S.n500, lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/methodology" style={{ fontSize: 13, color: S.brand, fontWeight: 700 }}>Read full data methodology →</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: sectionPad, background: S.n50 }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>What founders say</p>
            <h2 style={{ fontSize: isMobile ? 26 : 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em' }}>Used by founders across Australia</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {[
              { quote: 'I was about to sign a 3-year lease. Locatalyze gave me a NO verdict and saved me from a $180k mistake. The competition data was spot on.', name: 'Sarah M.', role: 'Cafe owner, Melbourne' },
              { quote: 'Compared 4 locations in 10 minutes. The comparison tool is brilliant — picked the site with the highest profit potential immediately.', name: 'James T.', role: 'Franchise buyer, Sydney' },
              { quote: 'As a commercial real estate analyst I use this with clients. The financial model is genuinely useful for early-stage feasibility.', name: 'Priya K.', role: 'Property analyst, Brisbane' },
            ].map(t => (
              <div key={t.name} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 15, color: S.amber, marginBottom: 12, letterSpacing: 2 }}>★★★★★</p>
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.75, marginBottom: 18 }}>"{t.quote}"</p>
                <div style={{ paddingTop: 14, borderTop: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: S.n900 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: S.n400, marginTop: 2 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: sectionPad, background: S.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', marginBottom: 10 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: S.n500 }}>Start free. Upgrade only when you need more.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 14 }}>
            {/* Free */}
            <div style={{ background: S.n50, border: `1.5px solid ${S.n200}`, borderRadius: 20, padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: S.n900, marginBottom: 4, letterSpacing: '-0.03em' }}>$0</p>
              <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Forever free</p>
              {['3 location reports', 'Full financial model', 'SWOT analysis', 'PDF download'].map(f => (
                <p key={f} style={{ fontSize: 13, color: S.n700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ color: S.emerald, fontWeight: 700 }}>✓</span> {f}
                </p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 20, textAlign: 'center', padding: '11px', border: `1.5px solid ${S.n200}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: S.n700 }}>
                Get started free
              </Link>
            </div>
            {/* Monthly */}
            <div style={{ background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pro Monthly</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <p style={{ fontSize: 36, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>$19</p>
                <p style={{ fontSize: 13, color: S.n400 }}>/month</p>
              </div>
              <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Cancel anytime</p>
              {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
                <p key={f} style={{ fontSize: 13, color: S.n700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ color: S.emerald, fontWeight: 700 }}>✓</span> {f}
                </p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 20, textAlign: 'center', padding: '11px', border: `1.5px solid ${S.brand}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: S.brand }}>
                Start monthly
              </Link>
            </div>
            {/* Lifetime */}
            <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 20, padding: '24px', position: 'relative', boxShadow: '0 8px 32px rgba(15,118,110,0.25)', marginTop: isMobile ? 16 : 0 }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: S.amber, color: S.white, borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                BEST VALUE
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pro Lifetime</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <p style={{ fontSize: 36, fontWeight: 900, color: S.white, letterSpacing: '-0.03em' }}>$49</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>one-time</p>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Pay once, use forever</p>
              {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
                <p key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontWeight: 700 }}>✓</span> {f}
                </p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 20, textAlign: 'center', padding: '11px', background: S.white, borderRadius: 10, fontSize: 13, fontWeight: 800, color: S.brand }}>
                Get lifetime access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: sectionPad, background: `linear-gradient(135deg,${S.n900} 0%,#0C1F1C 100%)`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '5%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle,${S.brand}20 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative', padding: isMobile ? '0 4px' : '0' }}>
          <h2 style={{ fontSize: isMobile ? 30 : 48, fontWeight: 900, color: S.white, letterSpacing: '-0.04em', marginBottom: 14, lineHeight: 1.1 }}>
            Don't sign a lease<br />without running this first.
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.75 }}>
            The average location mistake costs $200,000+. A Locatalyze report is free to start.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, color: S.brand, borderRadius: 12, padding: isMobile ? '15px 28px' : '18px 36px', fontWeight: 800, fontSize: isMobile ? 14 : 16, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            Analyse your first location free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>No credit card · 3 free reports · 30 seconds</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}