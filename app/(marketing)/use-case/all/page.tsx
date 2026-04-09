'use client'
import Link from 'next/link'
import { useState } from 'react'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n200: '#E7E5E4', n500: '#78716C', n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const TYPES = [
 { icon: '', label: 'Cafes & Coffee', href: '/use-case/cafes', color: '#92400E', bg: '#FFFBEB', desc: 'Morning foot traffic, rent-to-revenue and competition analysis for café owners.' },
 { icon: '', label: 'Restaurants', href: '/use-case/restaurants', color: '#1D4ED8', bg: '#EFF6FF', desc: 'Evening trade, parking access and dining precinct analysis for restaurant operators.' },
 { icon: '', label: 'Retail Stores', href: '/use-case/retail', color: '#7C3AED', bg: '#F5F3FF', desc: 'Pedestrian volume, anchor store proximity and demographic matching for retailers.' },
 { icon: '', label: 'Gyms & Fitness', href: '/use-case/gyms', color: '#059669', bg: '#ECFDF5', desc: 'Residential catchment, format gap analysis and membership modelling for fitness businesses.' },
 { icon: '', label: 'Takeaway', href: '/use-case/takeaway', color: '#DC2626', bg: '#FEF2F2', desc: 'Delivery zone density, cuisine gap and office proximity analysis for takeaway operators.' },
]

const STEPS = [
 { n: '01', title: 'Enter your address', body: 'Paste any Australian street address. Works for any suburb in any state.' },
 { n: '02', title: 'Choose your business type', body: 'Select from café, restaurant, retail, gym, takeaway or general business.' },
 { n: '03', title: 'Add your financial inputs', body: 'Enter your expected rent, average transaction value and trading days.' },
 { n: '04', title: 'Get your report', body: 'Receive a full feasibility report with GO / CAUTION / NO verdict in about 90 seconds.' },
]

export default function Page() {
 const [poll, setPoll] = useState<string | null>(null)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
   <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

    {/* Hero */}
        <div style={{ background: S.headerBg, position: 'relative', overflow: 'hidden' }}>
     <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${S.brand}20,transparent 70%)` }} />
     <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${S.brandLight}10,transparent 70%)` }} />
     <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px 64px', position: 'relative', textAlign: 'center' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 36 }}>
       <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}><img src="/logo-mark.svg" alt="" style={{ width: \'13px\', height: \'13px\' }} /></div>
       <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
      </Link>
            <div style={{ display: 'inline-flex', background: 'rgba(15,118,110,0.18)', border: '1px solid rgba(15,118,110,0.35)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 18 }}>Location Analysis for Every Business Type</div>
      <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.12, marginBottom: 18 }}>Find the right location for<br />your Australian business</h1>
      <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>Locatalyze analyses demographics, competition, foot traffic and rent affordability for any Australian address — and delivers a GO / CAUTION / NO verdict in about 90 seconds.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
       <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.4)' }}>
        Analyse my location free →
              </Link>
              <a href="#business-types" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', color: '#E5E7EB', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '14px 22px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
        Browse by business type ↓
              </a>
            </div>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 56, maxWidth: 800, margin: '56px auto 0' }}>
       {[['$287K', 'Average cost of a bad location decision'], ['60%', 'Of failures linked to poor location'], ['30s', 'Time to get your analysis'], ['500m', 'Competition radius we analyse']].map(([v, l]) => (
        <div key={v} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 12px', textAlign: 'center' }}>
         <p style={{ fontSize: 26, fontWeight: 900, color: S.brandLight, letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</p>
         <p style={{ fontSize: 11, color: '#6B7280', marginTop: 5, lineHeight: 1.4 }}>{l}</p>
        </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 20px 80px' }}>

     {/* Business type cards */}
          <div id="business-types" style={{ marginBottom: 72 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, textAlign: 'center' }}>Guides by business type</p>
      <h2 style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 8 }}>What type of business are you opening?</h2>
      <p style={{ fontSize: 15, color: S.n500, textAlign: 'center', marginBottom: 36 }}>Each guide covers the specific factors that determine success for that business type.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
       {TYPES.map(t => (
                <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
         <div style={{ background: S.white, border: `1.5px solid ${S.n200}`, borderRadius: 18, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'transform 0.15s', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{t.icon}</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: S.n900, marginBottom: 8 }}>{t.label}</h3>
                    <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7, flex: 1 }}>{t.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
           <span style={{ fontSize: 13, color: t.color, fontWeight: 700 }}>Read location guide →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ background: S.n900, borderRadius: 24, padding: '48px', marginBottom: 72 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center' }}>How it works</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 36 }}>From address to verdict in about 90 seconds</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
       {STEPS.map((step, i) => (
                <div key={step.n} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '22px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>{step.title}</p>
         </div>
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.65 }}>{step.body}</p>
        </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
       <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,118,110,0.3)' }}>
        Start my free analysis →
              </Link>
            </div>
          </div>

          {/* What we analyse */}
          <div style={{ marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, textAlign: 'center' }}>What we analyse</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 36 }}>Every factor that determines profitability</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
       {[
                { icon: '', title: 'Foot traffic & daytime population', body: 'We combine ABS daytime worker data with commuter density to estimate the real population that passes your site daily — not just residents.' },
        { icon: '', title: 'Suburb demographics', body: 'Median household income, age profile and household type from the ABS Census tell us whether the local population matches your business model.' },
        { icon: '', title: 'Competition mapping', body: 'We identify every direct competitor within your relevant radius, score them by proximity and category overlap, and calculate a competition index.' },
        { icon: '', title: 'Rent affordability', body: 'Input your rent and average transaction value. We calculate the daily transactions required to keep rent below 12% of revenue.' },
        { icon: '', title: 'Revenue projection', body: 'Based on foot traffic, capture rates and your pricing, we model a realistic revenue range for the site at 3, 6 and 12 months.' },
        { icon: '', title: 'GO / CAUTION / NO verdict', body: 'A final composite score across all variables gives you a clear, justified verdict — with the supporting data to understand every factor.' },
       ].map(f => (
                <div key={f.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '22px' }}>
         <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{f.icon}</span>
         <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rent guide */}
          <div style={{ marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>The rent affordability guide</p>
      <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 20 }}>The rent-to-revenue ratio every business owner must know</h2>
      <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, overflow: 'hidden' }}>
       {[
                { pct: 'Under 10%', label: 'Excellent', body: 'Healthy buffer for slow periods, marketing spend and unexpected costs. Your location economics are working strongly in your favour.', color: S.emerald, bg: S.emeraldBg },
        { pct: '10–12%', label: 'Healthy', body: 'Industry standard for most categories. Manageable with solid execution. This is the target range for most well-run businesses.', color: '#16A34A', bg: '#F0FDF4' },
        { pct: '13–15%', label: 'Caution', body: 'Viable but limited buffer. Any shortfall in projected revenue puts cashflow under pressure. Negotiate hard before signing.', color: S.amber, bg: S.amberBg },
        { pct: '16–20%', label: 'High Risk', body: 'Statistically difficult to sustain. Requires exceptional execution and above-projection revenue to survive long-term.', color: '#EA580C', bg: '#FFF7ED' },
        { pct: 'Over 20%', label: 'Avoid', body: 'Almost universally unsustainable for independent operators. Unless your revenue model has been proven at this location, walk away.', color: S.red, bg: S.redBg },
       ].map(row => (
                <div key={row.pct} style={{ display: 'flex', gap: 16, padding: '16px 22px', borderBottom: `1px solid ${S.n200}`, background: S.white, alignItems: 'center', flexWrap: 'wrap' }}>
         <div style={{ background: row.bg, borderRadius: 8, padding: '6px 14px', minWidth: 90, textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: row.color }}>{row.pct}</p>
                  </div>
                  <div style={{ width: 80 }}><span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.label}</span></div>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65, flex: 1, minWidth: 200 }}>{row.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Poll */}
          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16, padding: '32px', marginBottom: 72 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Quick poll</p>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: S.n900, marginBottom: 20 }}>What is the biggest challenge you face when choosing a business location?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
       {['Understanding local competition', 'Knowing if rent is affordable', 'Finding the right demographics', 'Estimating realistic revenue'].map(o => (
        <button key={o} onClick={() => setPoll(o)} style={{ padding: '14px 16px', borderRadius: 10, border: `2px solid ${poll === o ? S.brand : S.brandBorder}`, background: poll === o ? S.brand : S.white, color: poll === o ? '#fff' : S.n700, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: S.font, textAlign: 'left' }}>
         {poll === o ? ' ' : ''}{o}
        </button>
              ))}
            </div>
            {poll && (
              <div style={{ marginTop: 16, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 10, padding: '14px 18px' }}>
        <p style={{ fontSize: 14, color: S.brand, fontWeight: 700 }}>Locatalyze is built to solve exactly that. <Link href="/onboarding" style={{ textDecoration: 'underline', color: S.brand }}>Run a free analysis →</Link></p>
       </div>
            )}
          </div>

          {/* Final CTA */}
          <div style={{ background: `linear-gradient(135deg,${S.headerBg},#0F2E2A)`, borderRadius: 24, padding: '56px 40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Start for free today</p>
      <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 14 }}>Stop guessing. Start with data.</h2>
      <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>Paste any Australian address. Get a full location feasibility report with competition analysis, demographic scoring and a GO / CAUTION / NO verdict in about 90 seconds. Free to start.</p>
      <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 12, padding: '16px 32px', fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 24px rgba(15,118,110,0.4)' }}>
       Analyse my location free — no credit card →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}