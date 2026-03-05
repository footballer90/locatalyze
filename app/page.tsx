'use client'
import Link from 'next/link'
import { useState } from 'react'

const S = {
  font: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n300: '#D6D3D1',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBorder: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
}

const card = (extra = {}) => ({
  background: S.white, borderRadius: 20,
  border: `1px solid ${S.n200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04)',
  overflow: 'hidden', ...extra,
})

const scores = [
  { label: 'Rent Affordability', w: '30%', score: 70 },
  { label: 'Profitability', w: '25%', score: 90 },
  { label: 'Competition', w: '25%', score: 40 },
  { label: 'Demographics', w: '20%', score: 97 },
]

const features = [
  { icon: '📍', title: 'Instant Geocoding', desc: 'Address resolved to exact coordinates with suburb income data and postcode demographics.' },
  { icon: '📊', title: 'Financial Modelling', desc: 'Break-even, payback period, 3-year projections, and P&L built from your actual inputs.' },
  { icon: '🏪', title: 'Competition Analysis', desc: 'Competitor density within 500m and how saturation suppresses your acquisition rate.' },
  { icon: '🤖', title: 'GPT-4o Analysis', desc: 'Plain-English AI commentary — SWOT, market demand, rent risk, and sensitivity scenarios.' },
  { icon: '⚠️', title: 'Risk Scenarios', desc: 'Best, base, and worst case at 70%, 100%, and 130% demand. Know exactly what can go wrong.' },
  { icon: '🎯', title: 'GO / CAUTION / NO', desc: 'One opinionated verdict backed by a weighted score across 4 dimensions. A decision, not a data dump.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Cafe Owner · Melbourne', quote: 'I was about to sign a 5-year lease on a site that scored 38. This tool saved me from a disaster.', avatar: 'SK' },
  { name: 'James P.', role: 'Retail Franchisee · Sydney', quote: 'Scored 81 on my Bondi site. Opened 3 months ago, already at break-even ahead of schedule.', avatar: 'JP' },
  { name: 'Priya M.', role: 'Restaurant Owner · Brisbane', quote: 'The rent analysis alone is worth it. Showed my rent was 18% of revenue — I renegotiated down.', avatar: 'PM' },
]

const faqs = [
  { q: 'Where does the data come from?', a: 'OpenStreetMap for geocoding, national census data for median income by postcode, business density estimates, and GPT-4o for AI synthesis. Financial projections use your exact inputs — not assumptions.' },
  { q: 'How accurate is the analysis?', a: 'The financial model is deterministic — your exact rent, setup cost, and ticket size. Market estimates are clearly labelled. It\'s a smart financial model, not a crystal ball.' },
  { q: 'Is my data private?', a: 'Your data is used only to generate your report. It is never sold to real estate agents, brokers, or advertisers. You can delete your account and all data at any time.' },
  { q: 'What business types work best?', a: 'Any physical retail or hospitality business: cafes, restaurants, gyms, salons, pharmacies, bakeries, fashion retail, specialty stores, professional services with foot traffic dependency.' },
]

function ScoreBar({ label, w, score }: { label: string; w: string; score: number }) {
  const color = score >= 70 ? S.emerald : score >= 45 ? S.amber : S.red
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: S.n700, fontWeight: 500 }}>{label} <span style={{ color: S.n400, fontSize: 11 }}>{w}</span></span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ fontFamily: S.font, background: S.white, color: S.n900, margin: 0, padding: 0 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }
        input, select { font-family: inherit; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${S.brand}, ${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 15, boxShadow: '0 2px 8px rgba(15,118,110,0.3)' }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/auth/login" style={{ fontSize: 13, color: S.n500, padding: '6px 12px', fontWeight: 500 }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontWeight: 700, boxShadow: '0 1px 3px rgba(15,118,110,0.3)' }}>Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '72px 24px 64px', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: S.brandFaded, color: S.brand, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 600, marginBottom: 24, letterSpacing: '0.01em' }}>
          <span style={{ width: 6, height: 6, background: S.brandLight, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          AI-powered location intelligence
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: 900, color: S.n900, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 20 }}>
          Know if this location will<br />
          <span style={{ color: S.brand }}>make you money</span><br />
          before you sign the lease
        </h1>
        <p style={{ fontSize: 17, color: S.n500, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 36px', fontWeight: 400 }}>
          Input your business details and get a complete financial feasibility report in 30 seconds — break-even, 3-year projections, and a clear GO / CAUTION / NO verdict.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ background: S.brand, color: S.white, borderRadius: 12, padding: '14px 28px', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(15,118,110,0.25)', display: 'inline-block' }}>
            Analyse your first location free →
          </Link>
          <Link href="/auth/signup" style={{ background: S.white, color: S.n700, border: `1.5px solid ${S.n200}`, borderRadius: 12, padding: '14px 24px', fontWeight: 600, fontSize: 14, display: 'inline-block' }}>
            See sample report
          </Link>
        </div>
        <p style={{ fontSize: 12, color: S.n400, marginTop: 14, fontWeight: 500 }}>Free for your first location · No credit card required · Results in 30 seconds</p>
      </section>

      {/* SAMPLE REPORT */}
      <section style={{ padding: '0 24px 80px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Sample report</p>
          <p style={{ fontSize: 14, color: S.n500 }}>Cafe at Surry Hills, Sydney — real output from Locatalyze</p>
        </div>
        <div style={card()}>
          {/* Header */}
          <div style={{ padding: '24px 24px 20px', borderBottom: `1px solid ${S.n100}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: S.n400, marginBottom: 4 }}>📍 Surry Hills, Sydney NSW</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em' }}>Cafe</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: S.amberBg, color: S.amber, border: `1.5px solid ${S.amberBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: S.amber, display: 'inline-block' }} />CAUTION
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 3, marginTop: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: S.amber, lineHeight: 1, letterSpacing: '-0.03em' }}>74</span>
                  <span style={{ fontSize: 13, color: S.n400 }}>/100</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '12px 16px', background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBorder}` }}>
              <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                This location scores 74/100 — CAUTION. Rent at 13.1% of revenue leaves a limited buffer. High competition density (7 within 500m) suppresses demand.
              </p>
            </div>
          </div>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: `1px solid ${S.n100}` }}>
            {[['Monthly Revenue','$64,800'],['Net Profit','$27,851'],['Break-even','37/day'],['Payback','7 months']].map(([l,v],i) => (
              <div key={l} style={{ padding: '14px 12px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${S.n100}` : 'none' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{l}</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: S.n800, letterSpacing: '-0.02em' }}>{v}</p>
              </div>
            ))}
          </div>
          {/* Score bars */}
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Score Breakdown</p>
            {scores.map(s => <ScoreBar key={s.label} {...s} />)}
            <p style={{ fontSize: 11, color: S.n400, textAlign: 'center', marginTop: 12 }}>Full reports include AI analysis, SWOT, risk scenarios &amp; 3-year projections</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div style={{ background: S.n50, borderTop: `1px solid ${S.n100}`, borderBottom: `1px solid ${S.n100}`, padding: '18px 24px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: S.n400, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Trusted by business owners across Australia</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          {['Cafe Owners','Restaurant Groups','Retail Franchisees','Gym Operators','Salon Chains'].map(t => (
            <span key={t} style={{ fontSize: 13, color: S.n500, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>What's inside every report</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', lineHeight: 1.15 }}>Everything you need to make the decision</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          {features.map(f => (
            <div key={f.title} style={{ ...card({ padding: '22px' }) }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: S.n50, borderTop: `1px solid ${S.n100}`, borderBottom: `1px solid ${S.n100}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Process</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em' }}>From address to verdict in 30 seconds</h2>
          </div>
          {[
            { n:'01', title:'Enter 5 details', desc:'Business type, address, monthly rent, setup budget, average order value. Takes under 90 seconds.' },
            { n:'02', title:'AI analyses everything', desc:'Geocoding, demographics, competition density, financial modelling, and GPT-4o commentary — all in parallel.' },
            { n:'03', title:'Read your verdict', desc:'A clear GO / CAUTION / NO score with weighted breakdown, AI reasoning, and 3-year financial projections.' },
          ].map((s,i) => (
            <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: i < 2 ? 32 : 0 }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: S.brand, color: S.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '0.02em' }}>{s.n}</div>
              <div style={{ paddingTop: 4 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 6, letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Customer stories</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em' }}>Real decisions, real outcomes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
          {testimonials.map(t => (
            <div key={t.name} style={card({ padding: '22px' })}>
              <div style={{ marginBottom: 12 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>)}</div>
              <p style={{ fontSize: 13, color: S.n700, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: S.brand, color: S.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: S.n400 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DATA SOURCES */}
      <section style={{ background: S.n50, borderTop: `1px solid ${S.n100}`, borderBottom: `1px solid ${S.n100}`, padding: '60px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Transparency</p>
          <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Not a black box</h2>
          <p style={{ fontSize: 13, color: S.n500, marginBottom: 28 }}>Every data point in your report has a named source</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
            {[
              { icon:'🗺️', src:'OpenStreetMap', what:'Geocoding & address resolution' },
              { icon:'👥', src:'ABS / Census', what:'Median income by postcode' },
              { icon:'🏪', src:'Business Density Model', what:'Competitor estimates by category' },
              { icon:'🤖', src:'OpenAI GPT-4o', what:'Plain-English AI analysis & SWOT' },
            ].map(d => (
              <div key={d.src} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '16px 18px', textAlign: 'left', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>{d.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>{d.src}</p>
                  <p style={{ fontSize: 11, color: S.n400, marginTop: 2 }}>{d.what}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '80px 24px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em' }}>Pay per decision, not per month</h2>
          <p style={{ fontSize: 13, color: S.n500, marginTop: 10 }}>SMBs sign one lease at a time. Our pricing reflects that.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
          {[
            { name:'Starter', price:'Free', sub:'1 report', features:['1 location analysis','GO/CAUTION/NO verdict','Score breakdown','Basic financials'], cta:'Get started free', primary:false },
            { name:'Hunter Pack', price:'$49', sub:'3 reports — one-off', features:['3 location analyses','Full AI commentary','SWOT analysis','Risk scenarios','3-year projections','PDF export'], cta:'Buy 3 reports', primary:true },
            { name:'Pro', price:'$99/mo', sub:'Unlimited', features:['Unlimited analyses','All Hunter features','Saved report history','Comparison tool','Priority support'], cta:'Go Pro', primary:false },
          ].map(p => (
            <div key={p.name} style={{ ...card({ padding: '24px 20px', border: p.primary ? `2px solid ${S.brand}` : `1px solid ${S.n200}`, position: 'relative' }) }}>
              {p.primary && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: S.brand, color: S.white, borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
              )}
              <p style={{ fontSize: 11, fontWeight: 700, color: S.n500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{p.name}</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 2 }}>{p.price}</p>
              <p style={{ fontSize: 12, color: S.n400, marginBottom: 20 }}>{p.sub}</p>
              <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: S.emerald, fontSize: 13, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: S.n500 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: p.primary ? S.brand : S.white, color: p.primary ? S.white : S.n700, border: p.primary ? 'none' : `1.5px solid ${S.n200}`, boxSizing: 'border-box' as any }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: S.n50, borderTop: `1px solid ${S.n100}`, borderBottom: `1px solid ${S.n100}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 28 }}>Common questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: S.n800 }}>{f.q}</span>
                  <span style={{ color: S.n400, fontSize: 20, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', lineHeight: 1 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', paddingTop: 12, fontSize: 13, color: S.n500, lineHeight: 1.7, borderTop: `1px solid ${S.n100}` }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: `linear-gradient(135deg, ${S.brand} 0%, #0891B2 100%)`, borderRadius: 28, padding: '56px 40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(15,118,110,0.2)' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Ready to analyse your location?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 32, lineHeight: 1.6 }}>Your first report is completely free.<br />No credit card. Results in 30 seconds.</p>
            <Link href="/auth/signup" style={{ display: 'inline-block', background: S.white, color: S.brand, borderRadius: 12, padding: '14px 32px', fontWeight: 700, fontSize: 15 }}>
              Get your free report →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${S.n100}`, padding: '28px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 700, fontSize: 13 }}>L</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: S.n700 }}>Locatalyze</span>
          </div>
          <p style={{ fontSize: 12, color: S.n400 }}>AI-powered location intelligence for SMBs</p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy','Terms','Contact'].map(l => <span key={l} style={{ fontSize: 12, color: S.n400, cursor: 'pointer' }}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  )
}