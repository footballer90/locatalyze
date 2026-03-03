'use client';
import React from 'react';

/* ─── ALL STYLES AS JS OBJECTS — zero Tailwind classes used ─── */
const S: Record<string, React.CSSProperties> = {
  page:        { fontFamily: "'DM Sans', sans-serif", background: '#f5f4f0', color: '#1a1a1a', minHeight: '100vh' },
  nav:         { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(245,244,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e0d8', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  navLogo:     { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: '#1a1a1a', textDecoration: 'none', letterSpacing: '-0.5px' },
  navLinks:    { display: 'flex', alignItems: 'center', gap: 32 },
  navLink:     { fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 },
  navCta:      { background: '#c84b31', color: '#fff', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' },
  heroWrap:    { maxWidth: 1100, margin: '0 auto', padding: '88px 40px 64px' },
  eyebrow:     { display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e0d8', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#c84b31', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 28 },
  eyebrowDot:  { width: 6, height: 6, borderRadius: '50%', background: '#c84b31', display: 'inline-block' },
  h1:          { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', color: '#1a1a1a', maxWidth: 820, marginBottom: 28, margin: '0 0 28px' },
  h1Red:       { color: '#c84b31' },
  heroSub:     { fontSize: 18, color: '#555', lineHeight: 1.7, maxWidth: 560, marginBottom: 40 },
  heroActions: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 },
  btnPrimary:  { background: '#c84b31', color: '#fff', padding: '16px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 },
  btnSecond:   { background: '#fff', color: '#1a1a1a', padding: '16px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid #e2e0d8', display: 'inline-flex', alignItems: 'center', gap: 8 },
  heroNote:    { fontSize: 13, color: '#999' },
  strip:       { borderTop: '1px solid #e2e0d8', borderBottom: '1px solid #e2e0d8', background: '#fff', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, flexWrap: 'wrap' },
  stripItem:   { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#777', fontWeight: 500 },
  stripNum:    { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a' },
  mockWrap:    { maxWidth: 1100, margin: '0 auto', padding: '72px 40px' },
  mockCard:    { background: '#fff', border: '1px solid #e2e0d8', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.08)' },
  mockBar:     { background: '#1a1a1a', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 },
  mockInner:   { padding: '28px 32px' },
  mockMetrics: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 },
  mockMetric:  { background: '#f5f4f0', borderRadius: 12, padding: '20px 22px' },
  mockLabel:   { fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 },
  mockVal:     { fontFamily: "'Syne', sans-serif", fontSize: 34, fontWeight: 900, color: '#1a1a1a', marginBottom: 2 },
  mockSub:     { fontSize: 12, color: '#aaa' },
  scoreGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  scoreRow:    { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444', marginBottom: 5 },
  scoreTrack:  { height: 6, background: '#ede9e1', borderRadius: 100, overflow: 'hidden' },
  featureWrap: { maxWidth: 1100, margin: '0 auto', padding: '80px 40px' },
  secEye:      { fontSize: 12, fontWeight: 700, color: '#c84b31', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 },
  secTitle:    { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1px', color: '#1a1a1a', lineHeight: 1.15, marginBottom: 56 },
  featGrid:    { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  featCard:    { background: '#fff', border: '1px solid #e2e0d8', borderRadius: 16, padding: 28 },
  featIcon:    { fontSize: 28, marginBottom: 14 },
  featTitle:   { fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
  featDesc:    { fontSize: 14, color: '#666', lineHeight: 1.65 },
  howWrap:     { background: '#1a1a1a', padding: '80px 40px' },
  howInner:    { maxWidth: 1100, margin: '0 auto' },
  howGrid:     { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, marginTop: 56 },
  howStep:     { borderTop: '2px solid #2a2a2a', paddingTop: 28 },
  howNum:      { fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 900, color: '#2d2d2d', marginBottom: 16 },
  howTitle:    { fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 700, color: '#f5f4f0', marginBottom: 10 },
  howDesc:     { fontSize: 14, color: '#777', lineHeight: 1.7 },
  pricWrap:    { maxWidth: 1100, margin: '0 auto', padding: '80px 40px' },
  pricGrid:    { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 56 },
  ctaWrap:     { background: '#c84b31', padding: '88px 40px', textAlign: 'center' },
  ctaTitle:    { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,56px)', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: 20 },
  ctaSub:      { fontSize: 18, color: 'rgba(255,255,255,0.78)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' },
  ctaBtn:      { display: 'inline-block', background: '#fff', color: '#c84b31', padding: '18px 44px', borderRadius: 10, fontWeight: 800, fontSize: 17, textDecoration: 'none', letterSpacing: '-0.3px' },
  footer:      { background: '#111', padding: '48px 40px' },
  footerIn:    { maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 },
  footerLogo:  { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff' },
  footerNote:  { fontSize: 13, color: '#444' },
};

const verdictStyle = (v: string): React.CSSProperties => ({
  display: 'inline-block',
  background: v === 'GO' ? '#dcfce7' : v === 'CAUTION' ? '#fef9c3' : '#fee2e2',
  color: v === 'GO' ? '#16a34a' : v === 'CAUTION' ? '#ca8a04' : '#dc2626',
  fontWeight: 800, fontSize: 13, padding: '5px 14px', borderRadius: 100,
});

const scoreFill = (pct: number): React.CSSProperties => ({
  height: '100%', width: `${pct}%`,
  background: 'linear-gradient(90deg, #c84b31, #e8734a)', borderRadius: 100,
});

const pricingCard = (featured: boolean): React.CSSProperties => ({
  background: featured ? '#1a1a1a' : '#fff',
  border: featured ? 'none' : '1px solid #e2e0d8',
  borderRadius: 20, padding: 36, position: 'relative',
});

const features = [
  { icon: '📍', title: 'Location Score 0–100', desc: 'Every site gets a score across competition, rent value, demand, cost, and profitability. No guesswork.' },
  { icon: '💸', title: 'Break-Even in Plain Numbers', desc: 'How many customers per day do you need to cover costs? We calculate it from your actual rent and ticket size.' },
  { icon: '🤖', title: 'AI-Written Report', desc: 'GPT-4 writes a full analysis explaining why this location is a GO, CAUTION, or NO — in plain English.' },
  { icon: '📊', title: '3-Year Revenue Projection', desc: 'Year 1, 2, and 3 forecasts based on your business type, targets, and real market conditions.' },
  { icon: '⚔️', title: 'Competitor Intelligence', desc: 'Understand who is already nearby, how saturated the market is, and whether there\'s room for you.' },
  { icon: '📋', title: 'SWOT Analysis', desc: 'Strengths, weaknesses, opportunities, threats — specific to your location, not recycled advice.' },
];

const steps = [
  { num: '01', title: 'Tell us about your business', desc: 'Answer 10 questions about your type, location, budget, and goals. Under 3 minutes.' },
  { num: '02', title: 'AI analyses your location', desc: 'We run competitor analysis, market research, and financial projections in under 60 seconds.' },
  { num: '03', title: 'Get your verdict', desc: 'A full report with GO, CAUTION, or NO — and the exact numbers behind the decision.' },
];

const plans = [
  { plan: 'Starter', price: '$0', per: '1 report, no credit card', featured: false, badge: '', items: ['1 location analysis', 'Overall score + verdict', 'Basic break-even calc', 'Competitor overview'] },
  { plan: 'Professional', price: '$49', per: 'per month', featured: true, badge: 'Most Popular', items: ['Unlimited analyses', 'Full AI report + SWOT', '3-year revenue projections', 'Sensitivity analysis', 'PDF export', 'Priority support'] },
  { plan: 'Team', price: '$149', per: 'per month', featured: false, badge: '', items: ['Everything in Pro', 'Up to 5 team members', 'Compare locations side-by-side', 'Custom templates', 'Dedicated onboarding'] },
];

export default function LandingPage() {
  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <a href="/" style={S.navLogo}>Locata<span style={{ color: '#c84b31' }}>lyze</span></a>
        <div style={S.navLinks}>
          <a href="#features" style={S.navLink}>Features</a>
          <a href="#how" style={S.navLink}>How it works</a>
          <a href="#pricing" style={S.navLink}>Pricing</a>
          <a href="/onboarding" style={S.navCta}>Get free report →</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={S.heroWrap}>
        <div style={S.eyebrow}><span style={S.eyebrowDot} />&nbsp;AI Location Intelligence</div>
        <h1 style={S.h1}>
          Know If This Location Will{' '}
          <span style={S.h1Red}>Make You Money</span>{' '}
          Before You Sign the Lease.
        </h1>
        <p style={S.heroSub}>
          You&apos;re about to commit 3–5 years of your life and your savings to a location. 
          Locatalyze gives you a data-backed GO or NO verdict in under 60 seconds — so you don&apos;t find out the hard way.
        </p>
        <div style={S.heroActions}>
          <a href="/onboarding" style={S.btnPrimary}>Analyse my location →</a>
          <a href="#how" style={S.btnSecond}>See how it works</a>
        </div>
        <p style={S.heroNote}>Free for your first location. No credit card required.</p>
      </div>

      {/* STRIP */}
      <div style={S.strip}>
        {[['60s', 'Average report time'], ['5', 'Dimensions analysed'], ['GO / NO', 'Clear verdict always'], ['GPT-4o', 'AI engine']].map(([num, label], i) => (
          <div key={i} style={S.stripItem}><span style={S.stripNum}>{num}</span><span>{label}</span></div>
        ))}
      </div>

      {/* MOCK DASHBOARD */}
      <div style={S.mockWrap}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={S.secEye}>Live example</div>
          <div style={{ ...S.secTitle, maxWidth: '100%', textAlign: 'center', marginBottom: 0 }}>What your report looks like</div>
        </div>
        <div style={S.mockCard}>
          <div style={S.mockBar}>
            {['#ff5f57','#ffbd2e','#28c940'].map((c,i) => <div key={i} style={{ width:12, height:12, borderRadius:'50%', background:c }} />)}
            <span style={{ color: '#444', fontSize: 12, marginLeft: 12, fontFamily: 'monospace' }}>locatalyze.com/dashboard/abc-123</span>
          </div>
          <div style={S.mockInner}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:4 }}>Fitzroy, Melbourne VIC</div>
                <div style={{ fontSize:14, color:'#888' }}>Café / Coffee Shop · Free tier analysis</div>
              </div>
              <div style={verdictStyle('GO')}>✓ GO</div>
            </div>
            <div style={S.mockMetrics}>
              {[['Location Score','82','out of 100'],['Break-Even Daily','47','customers/day'],['Payback Period','14mo','estimated']].map(([l,v,s],i)=>(
                <div key={i} style={S.mockMetric}>
                  <div style={S.mockLabel}>{l}</div>
                  <div style={S.mockVal}>{v}</div>
                  <div style={S.mockSub}>{s}</div>
                </div>
              ))}
            </div>
            <div style={S.scoreGrid}>
              {[['Competition',70],['Rent Value',85],['Market Demand',78],['Profitability',80]].map(([l,s],i)=>(
                <div key={i}>
                  <div style={S.scoreRow}><span>{l}</span><span style={{ fontWeight:700 }}>{s}</span></div>
                  <div style={S.scoreTrack}><div style={scoreFill(s as number)} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={S.featureWrap}>
        <div style={S.secEye}>What you get</div>
        <div style={S.secTitle}>Everything you need to make the call</div>
        <div style={S.featGrid}>
          {features.map((f,i)=>(
            <div key={i} style={S.featCard}>
              <div style={S.featIcon}>{f.icon}</div>
              <div style={S.featTitle}>{f.title}</div>
              <div style={S.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={S.howWrap}>
        <div style={S.howInner}>
          <div style={{ ...S.secEye, color:'#555' }}>How it works</div>
          <div style={{ ...S.secTitle, color:'#f5f4f0', marginBottom:0 }}>From idea to verdict in 3 minutes</div>
          <div style={S.howGrid}>
            {steps.map((s,i)=>(
              <div key={i} style={S.howStep}>
                <div style={S.howNum}>{s.num}</div>
                <div style={S.howTitle}>{s.title}</div>
                <div style={S.howDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={S.pricWrap}>
        <div style={S.secEye}>Pricing</div>
        <div style={S.secTitle}>Start free. Pay when it saves you money.</div>
        <div style={S.pricGrid}>
          {plans.map((p,i)=>(
            <div key={i} style={pricingCard(p.featured)}>
              {p.badge && <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'#c84b31', color:'#fff', fontSize:11, fontWeight:700, padding:'5px 16px', borderRadius:100, whiteSpace:'nowrap' }}>{p.badge}</div>}
              <div style={{ fontSize:11, fontWeight:700, color:'#777', letterSpacing:'1px', textTransform:'uppercase', marginBottom:12 }}>{p.plan}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:48, fontWeight:900, color: p.featured?'#fff':'#1a1a1a', letterSpacing:'-1px', marginBottom:4 }}>{p.price}</div>
              <div style={{ fontSize:13, color:'#777', marginBottom:28 }}>{p.per}</div>
              {p.items.map((feat,j)=>(
                <div key={j} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color: p.featured?'#ccc':'#444', marginBottom:12 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background: p.featured?'#c84b31':'#f0ede6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0, color: p.featured?'#fff':'#c84b31', fontWeight:700 }}>✓</div>
                  {feat}
                </div>
              ))}
              <a href="/onboarding" style={{ display:'block', textAlign:'center', marginTop:28, padding:'14px 24px', borderRadius:10, fontWeight:700, fontSize:15, textDecoration:'none', background: p.featured?'#c84b31':'#f5f4f0', color: p.featured?'#fff':'#1a1a1a' }}>Get started →</a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={S.ctaWrap}>
        <div style={S.ctaTitle}>Stop guessing.<br/>Get the verdict.</div>
        <p style={S.ctaSub}>Your first location analysis is completely free. Takes 3 minutes.</p>
        <a href="/onboarding" style={S.ctaBtn}>Analyse my location — it&apos;s free</a>
      </div>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.footerIn}>
          <div style={S.footerLogo}>Locatalyze</div>
          <div style={S.footerNote}>© 2026 Locatalyze. Built for business owners who don&apos;t want to gamble their savings.</div>
        </div>
      </footer>
    </div>
  );
}