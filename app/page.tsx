'use client'
import { useState, useEffect } from 'react'
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

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const duration = 1500
    const steps = 40
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])
  return <>{prefix}{count.toLocaleString()}{suffix}</>
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
      biz: 'Specialty Coffee Shop',
      location: 'Subiaco, WA',
      verdict: 'GO',
      score: 82,
      revenue: '$91,200',
      profit: '$24,800',
      annualProfit: '$297,600',
      breakeven: '38 customers/day',
      payback: '7 months',
      scores: [
        { label: 'Demand & Demographics', score: 85, color: S.emerald },
        { label: 'Rent Affordability',    score: 78, color: S.emerald },
        { label: 'Competition',           score: 72, color: S.emerald },
        { label: 'Profitability',         score: 90, color: S.emerald },
      ],
      swot: {
        strengths:     ['Strong foot traffic from professionals', 'High disposable income area'],
        weaknesses:    ['Competitive market with established brands'],
        opportunities: ['Growing brunch culture in the area'],
        threats:       ['Rising commercial rents in suburb'],
      },
      rec: 'Strong opportunity. High demand demographics combined with manageable competition makes this an excellent location for a specialty coffee concept.',
    },
    caution: {
      biz: 'Casual Dining Restaurant',
      location: 'Fremantle, WA',
      verdict: 'CAUTION',
      score: 61,
      revenue: '$74,400',
      profit: '$11,200',
      annualProfit: '$134,400',
      breakeven: '52 customers/day',
      payback: '14 months',
      scores: [
        { label: 'Demand & Demographics', score: 68, color: S.amber },
        { label: 'Rent Affordability',    score: 55, color: S.amber },
        { label: 'Competition',           score: 60, color: S.amber },
        { label: 'Profitability',         score: 62, color: S.amber },
      ],
      swot: {
        strengths:     ['High tourist foot traffic in peak season'],
        weaknesses:    ['Strong seasonal demand fluctuation'],
        opportunities: ['Underserved dinner market on weekdays'],
        threats:       ['8 direct competitors within 500m'],
      },
      rec: 'Proceed with caution. Seasonal tourism dependency creates revenue instability. Ensure sufficient cash buffer for off-peak periods.',
    },
    no: {
      biz: 'Boutique Gym',
      location: 'Joondalup, WA',
      verdict: 'NO',
      score: 44,
      revenue: '$51,000',
      profit: '$3,200',
      annualProfit: '$38,400',
      breakeven: '74 customers/day',
      payback: 'Not viable',
      scores: [
        { label: 'Demand & Demographics', score: 48, color: S.red },
        { label: 'Rent Affordability',    score: 38, color: S.red },
        { label: 'Competition',           score: 42, color: S.red },
        { label: 'Profitability',         score: 46, color: S.red },
      ],
      swot: {
        strengths:     ['Large residential catchment area'],
        weaknesses:    ['4 established gyms already operating nearby'],
        opportunities: ['Limited group fitness options'],
        threats:       ['High rent consuming 34% of projected revenue'],
      },
      rec: 'Not recommended. Oversaturated fitness market combined with high rent leaves insufficient margin. This location would likely operate at a loss.',
    },
  }

  const r = sampleReports[activeTab]
  const vc = activeTab === 'go'
    ? { bg: S.emeraldBg, text: S.emerald, border: S.emeraldBdr, icon: '✅' }
    : activeTab === 'caution'
    ? { bg: S.amberBg, text: S.amber, border: S.amberBdr, icon: '⚠️' }
    : { bg: S.redBg, text: S.red, border: S.redBdr, icon: '🚫' }

  return (
    <div style={{ minHeight: '100vh', background: S.white, fontFamily: S.font, color: S.n900 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── Sticky Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${S.n100}` : 'none',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="#how-it-works" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>How it works</a>
          <a href="#sample-report" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>Sample report</a>
          <a href="#pricing" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>Pricing</a>
          <Link href="/auth/login" style={{ fontSize: 13, color: S.n700, fontWeight: 600, padding: '6px 12px' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 9, padding: '8px 16px', fontWeight: 700, boxShadow: '0 2px 8px rgba(15,118,110,0.2)' }}>
            Try free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, background: `linear-gradient(180deg, ${S.brandFaded} 0%, ${S.white} 100%)`, textAlign: 'center', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 24, boxShadow: '0 1px 4px rgba(15,118,110,0.1)' }}>
            📍 AI-powered location analysis for business owners
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Opening in the wrong location<br />
            <span style={{ color: S.brand }}>costs $200,000+.</span>
          </h1>
          <p style={{ fontSize: 18, color: S.n500, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Locatalyze analyses competition, foot traffic, demographics and profitability for any location in Australia — and gives you a clear <strong style={{ color: S.n800 }}>GO, CAUTION or NO</strong> verdict in under 30 seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '14px 28px', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 16px rgba(15,118,110,0.3)', letterSpacing: '-0.01em' }}>
              Analyse your first location free →
            </Link>
            <a href="#sample-report" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, color: S.n700, borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, border: `1.5px solid ${S.n200}` }}>
              See sample report
            </a>
          </div>
          <p style={{ fontSize: 12, color: S.n400 }}>Free plan · No credit card · 3 full reports included</p>
        </div>

        {/* Social proof bar */}
        <div style={{ maxWidth: 600, margin: '48px auto 0', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { value: '1,200', label: 'founders analysed', suffix: '+' },
            { value: '4,800', label: 'locations scored',  suffix: '+' },
            { value: '94',    label: 'accuracy rating',   suffix: '%' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: S.brand, letterSpacing: '-0.03em' }}>{s.value}{s.suffix}</p>
              <p style={{ fontSize: 12, color: S.n400, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Niche positioning bar ── */}
      <section style={{ background: S.n900, padding: '18px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built for</p>
          {['☕ Cafes & Coffee Shops', '🍽️ Restaurants & Dining', '👗 Retail & Fashion', '💪 Gyms & Fitness', '💈 Salons & Beauty', '🏪 Any retail business'].map(b => (
            <span key={b} style={{ fontSize: 13, color: S.n400, fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: S.white }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>How it works</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>From address to verdict in 30 seconds</h2>
            <p style={{ fontSize: 16, color: S.n500, maxWidth: 480, margin: '0 auto' }}>No spreadsheets. No consultants. Just paste the address and get a professional-grade analysis.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { n: '01', icon: '📍', title: 'Enter your location', desc: 'Type any Australian address. Add your business type, monthly rent and average order size.' },
              { n: '02', icon: '⚙️', title: 'AI analyses the location', desc: 'We pull competition data, demographics, rental benchmarks and foot traffic signals in real time.' },
              { n: '03', icon: '📊', title: 'Get your verdict', desc: 'Receive a full report: GO / CAUTION / NO verdict, financial model, SWOT analysis and 3-year projection.' },
            ].map(s => (
              <div key={s.n} style={{ background: S.n50, borderRadius: 16, border: `1px solid ${S.n200}`, padding: '24px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: S.brand, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 6, padding: '3px 8px' }}>{s.n}</span>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 8, letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Report ── */}
      <section id="sample-report" style={{ padding: '80px 24px', background: S.n50 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Sample report</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>See exactly what you get</h2>
            <p style={{ fontSize: 15, color: S.n500 }}>Real outputs from actual Locatalyze reports. Select a verdict to see how each scenario looks.</p>
          </div>

          {/* Verdict tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {(['go', 'caution', 'no'] as const).map(v => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{
                  padding: '9px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700,
                  background: activeTab === v ? (v === 'go' ? S.emerald : v === 'caution' ? S.amber : S.red) : S.white,
                  color: activeTab === v ? S.white : S.n500,
                  boxShadow: activeTab === v ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  outline: activeTab === v ? 'none' : `1.5px solid ${S.n200}`,
                  transition: 'all 0.15s',
                }}
              >
                {v === 'go' ? '✅ GO verdict' : v === 'caution' ? '⚠️ CAUTION verdict' : '🚫 NO verdict'}
              </button>
            ))}
          </div>

          {/* Report card */}
          <div style={{ background: S.white, borderRadius: 20, border: `1px solid ${S.n200}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

            {/* Report header */}
            <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>📍 {r.location}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: S.white, letterSpacing: '-0.02em', marginBottom: 10 }}>{r.biz}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: vc.bg, color: vc.text, border: `1.5px solid ${vc.border}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: vc.text, display: 'inline-block' }} />
                    {vc.icon} {r.verdict}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 42, fontWeight: 900, color: vc.text, lineHeight: 1, background: S.white, borderRadius: 16, padding: '8px 16px' }}>{r.score}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Location Score / 100</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Recommendation */}
              <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: vc.text, lineHeight: 1.7 }}>💡 <strong>AI Verdict:</strong> {r.rec}</p>
              </div>

              {/* Metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  { l: 'Monthly Revenue',  v: r.revenue    },
                  { l: 'Monthly Profit',   v: r.profit     },
                  { l: 'Annual Profit',    v: r.annualProfit, highlight: true },
                  { l: 'Payback Period',   v: r.payback    },
                ].map(m => (
                  <div key={m.l} style={{ background: S.n50, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '12px 14px' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{m.l}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: m.highlight ? S.emerald : S.n800 }}>{m.v}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Score breakdown */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Score Breakdown</p>
                  {r.scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} color={s.color} />)}
                </div>

                {/* SWOT */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>SWOT Summary</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { key: 'strengths',     icon: '💪', items: r.swot.strengths,     bg: S.emeraldBg, border: S.emeraldBdr, text: '#065F46' },
                      { key: 'weaknesses',    icon: '⚠️', items: r.swot.weaknesses,    bg: S.amberBg,   border: S.amberBdr,   text: '#92400E' },
                      { key: 'opportunities', icon: '🚀', items: r.swot.opportunities, bg: '#EFF6FF',   border: '#BFDBFE',    text: '#1D4ED8' },
                      { key: 'threats',       icon: '🔴', items: r.swot.threats,       bg: S.redBg,     border: S.redBdr,     text: '#991B1B' },
                    ].map(sw => (
                      <div key={sw.key} style={{ background: sw.bg, border: `1px solid ${sw.border}`, borderRadius: 8, padding: '8px 10px' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: sw.text, marginBottom: 3 }}>{sw.icon} {sw.key.toUpperCase()}</p>
                        {sw.items.map((item, i) => <p key={i} style={{ fontSize: 11, color: sw.text, opacity: 0.85 }}>· {item}</p>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA inside report */}
            <div style={{ borderTop: `1px solid ${S.n100}`, padding: '20px 28px', background: S.n50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 13, color: S.n500 }}>This is a sample. Your real report is generated from live data.</p>
              <Link href="/auth/signup" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700 }}>
                Get my report free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section style={{ padding: '80px 24px', background: S.white }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Data sources</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>Where the data comes from</h2>
            <p style={{ fontSize: 15, color: S.n500, maxWidth: 480, margin: '0 auto' }}>Every Locatalyze report is built on real data — not guesses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { icon: '🗺️', title: 'Google Maps & Places', desc: 'Real competitor locations, ratings, and business density within 500m of your address.' },
              { icon: '👥', title: 'Demographics data',    desc: 'Population age, income levels, household density and spending patterns by suburb.' },
              { icon: '🏠', title: 'Rental benchmarks',    desc: 'Commercial rent estimates calibrated against current market rates for your area.' },
              { icon: '📊', title: 'Competition scoring',  desc: 'Intensity rating based on number of direct competitors and their market strength.' },
              { icon: '🤖', title: 'AI financial model',   desc: 'Break-even analysis, 3-year projections and profitability estimates using your inputs.' },
              { icon: '📈', title: 'Market demand signals', desc: 'Search trends, foot traffic proxies and category growth data by business type.' },
            ].map(d => (
              <div key={d.title} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px 18px' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>{d.icon}</span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 6 }}>{d.title}</h3>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '80px 24px', background: S.n50 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>What founders say</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>Used by business owners across Australia</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { quote: 'I was about to sign a 3-year lease. Locatalyze gave me a NO verdict and saved me from a $180k mistake. The competition data was spot on.', name: 'Sarah M.', role: 'Cafe owner, Melbourne' },
              { quote: 'Compared 4 locations in 10 minutes. The comparison tool is brilliant — picked the site with the highest profit potential immediately.', name: 'James T.', role: 'Franchise buyer, Sydney' },
              { quote: 'As a commercial real estate analyst I use this with clients. The financial model is genuinely useful for early-stage feasibility.', name: 'Priya K.', role: 'Property analyst, Brisbane' },
            ].map(t => (
              <div key={t.name} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '22px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 14, color: S.brand, marginBottom: 12, fontWeight: 700 }}>★★★★★</p>
                <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.7, marginBottom: 16 }}>"{t.quote}"</p>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: S.n400 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '80px 24px', background: S.white }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: S.n500 }}>Start free. Upgrade only when you need more.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {/* Free */}
            <div style={{ background: S.n50, border: `1.5px solid ${S.n200}`, borderRadius: 20, padding: '24px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: S.n900, marginBottom: 4 }}>$0</p>
              <p style={{ fontSize: 12, color: S.n400, marginBottom: 20 }}>Forever free</p>
              {['3 location reports', 'Full financial model', 'SWOT analysis', 'PDF download'].map(f => (
                <p key={f} style={{ fontSize: 12, color: S.n700, marginBottom: 7 }}>✓ {f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 20, textAlign: 'center', padding: '10px', border: `1.5px solid ${S.n200}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: S.n700 }}>
                Get started
              </Link>
            </div>
            {/* Pro Monthly */}
            <div style={{ background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 20, padding: '24px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pro Monthly</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: S.n900 }}>$19</p>
                <p style={{ fontSize: 12, color: S.n400 }}>/month</p>
              </div>
              <p style={{ fontSize: 12, color: S.n400, marginBottom: 20 }}>Cancel anytime</p>
              {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
                <p key={f} style={{ fontSize: 12, color: S.n700, marginBottom: 7 }}>✓ {f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 20, textAlign: 'center', padding: '10px', border: `1.5px solid ${S.brand}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: S.brand }}>
                Start monthly
              </Link>
            </div>
            {/* Pro Lifetime */}
            <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, border: 'none', borderRadius: 20, padding: '24px 20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: S.amber, color: S.white, borderRadius: 100, padding: '3px 12px', fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>
                BEST VALUE
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pro Lifetime</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: S.white }}>$49</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>one-time</p>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Pay once, use forever</p>
              {['Unlimited reports', 'Location comparison', 'PDF export', 'Priority support'].map(f => (
                <p key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 7 }}>✓ {f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 20, textAlign: 'center', padding: '10px', background: S.white, borderRadius: 10, fontSize: 13, fontWeight: 800, color: S.brand }}>
                Get lifetime access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '80px 24px', background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: S.white, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>
            Don't sign a lease<br />without running this first.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 32, lineHeight: 1.7 }}>
            The average business location mistake costs $200,000+. A Locatalyze report costs nothing to start.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, color: S.brand, borderRadius: 12, padding: '16px 32px', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            Analyse your first location free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 14 }}>No credit card · 3 free reports · Takes 30 seconds</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: S.n900, padding: '32px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 12 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: S.white, letterSpacing: '-0.02em' }}>Locatalyze</span>
          </div>
          <p style={{ fontSize: 12, color: S.n500 }}>© 2026 Locatalyze. Built for Australian business owners.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/auth/signup" style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>Sign up</Link>
            <Link href="/auth/login"  style={{ fontSize: 12, color: S.n500, fontWeight: 500 }}>Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}