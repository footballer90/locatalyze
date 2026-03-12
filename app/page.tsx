'use client'
import nextDynamic from 'next/dynamic'
import Footer from '@/components/Footer'
const ReportDemoSection = nextDynamic(() => import('@/components/ReportDemoSection'))
import { useState, useEffect } from 'react'
import Link from 'next/link'
const ReportPreview = nextDynamic(() => import('@/components/landing/ReportPreview'))
const DarkShowcase = nextDynamic(() => import('@/components/landing/DarkShowcase'))
const PremiumReport = nextDynamic(() => import('@/components/landing/PremiumReport'))
const CinematicWalkthrough = nextDynamic(() => import('@/components/landing/CinematicWalkthrough'))
import type { CW_PHASE_META } from '@/components/landing/CinematicWalkthrough'
import { L, D, font, LI, useIsMobile } from '@/components/landing/tokens'

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

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menuOpen ? 'rgba(255,255,255,.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled || menuOpen ? `1px solid ${L.border}` : 'none',
        padding: `0 ${isMobile ? 16 : 40}px`, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all .3s',
      }}>
        <Link href="/" aria-label="Locatalyze — go to homepage" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <button aria-label="Open navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ display: 'block', width: 22, height: 2, background: L.slate, borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}/>
            <span style={{ display: 'block', width: 22, height: 2, background: L.slate, borderRadius: 2, transition: 'all .2s', opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ display: 'block', width: 22, height: 2, background: L.slate, borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}/>
          </button>
        )}
      </nav>

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

      {/* HERO */}
      <section style={{ paddingTop: isMobile ? 80 : 100, paddingBottom: isMobile ? 56 : 80, background: L.white, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: `linear-gradient(to top, ${L.mint}, transparent)`, pointerEvents: 'none' }}/>
        <div style={{ ...W, padding: pad, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 60, alignItems: 'center' }}>
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
              <div style={{ display: 'flex', gap: isMobile ? 20 : 28, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${L.border}`, flexWrap: 'wrap' }}>
                {[{value:'180+',label:'founders analysed'},{value:'620+',label:'locations scored'},{value:'94%',label:'accuracy rating'}].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: L.emerald, letterSpacing: '-.03em', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ReportPreview/>
            </div>
          </div>
        </div>
      </section>

      {/* NICHE STRIP */}
      <div style={{ background: L.slate, padding: `12px ${isMobile ? 16 : 40}px` }}>
        <div style={{ ...W, display: 'flex', justifyContent: 'center', gap: isMobile ? 14 : 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Built for</p>
          {['☕ Cafes','🍽️ Restaurants','👗 Retail','💪 Gyms','🥐 Bakeries','💈 Salons'].map(b => (
            <span key={b} style={{ fontSize: isMobile ? 12 : 13, color: '#64748B', fontWeight: 500 }}>{b}</span>
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
            Location intelligence, illuminated.
          </h2>
          <p style={{ fontSize: 14, color: D.text2, lineHeight: 1.75, marginBottom: 24 }}>Analyse foot traffic, competitors and financials for any Australian address in 30 seconds.</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${D.brand},#0B9488)`, color: '#fff', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my location free →
          </Link>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: sp, background: L.mint }}>
        <div style={{ ...W, padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 12 }}>From address to verdict in 30 seconds</h2>
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

      <div id="sample-report">
        <ReportDemoSection />
      </div>

      {/* DATA SOURCES */}
      <section style={{ padding: isMobile ? '72px 16px' : '100px 40px', background: '#0B1512', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:600, background:'radial-gradient(ellipse, rgba(16,185,129,.07) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ ...W, position:'relative', zIndex:2 }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 40 : 64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.25)', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:'#34D399', textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:16 }}>
              Data infrastructure
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 44, fontWeight:900, color:'#F0FDF9', letterSpacing:'-.04em', lineHeight:1.08, marginBottom:14 }}>
              Not guesswork.<br/>
              <span style={{ background:'linear-gradient(135deg, #34D399, #0FDECE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Six verified data layers.
              </span>
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color:'rgba(204,235,229,.55)', maxWidth:540, margin:'0 auto', lineHeight:1.75 }}>
              Every verdict is computed from real, live sources — cross-referenced and weighted by our AI. No static databases. No educated guesses.
            </p>
          </div>

          {!isMobile && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:64 }}>
              {[
                { icon: 'globe',    label: 'Live Data' },
                { icon: 'activity', label: 'AI Processing' },
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
                      <div style={{ width:'100%', height:'100%', background:'linear-gradient(90deg, rgba(52,211,153,.6), transparent)', animation:'pipe-flow 2s linear infinite' }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:14, marginBottom:48 }}>
            {[
              { icon: 'navigation', source:'Google Maps & Places', badge:'Live API', headline:'Every competitor mapped within 500m', body:'We pull real-time business data — names, categories, ratings and coordinates — directly from Google Places. No manual databases, no stale listings.', proof:'Updated with each analysis', color:'#3B82F6', colorBg:'rgba(59,130,246,.08)', colorBorder:'rgba(59,130,246,.2)' },
              { icon: 'users', source:'ABS Census & Demographics', badge:'Gov. verified', headline:'Income, age and population by suburb', body:'Australian Bureau of Statistics census data gives us median income, age profile and population density — the foundation of every demand estimate.', proof:'2021 ABS Census + quarterly updates', color:'#8B5CF6', colorBg:'rgba(139,92,246,.08)', colorBorder:'rgba(139,92,246,.2)' },
              { icon: 'home', source:'Commercial Rent Benchmarks', badge:'Market data', headline:'Fair rent for every suburb and zone', body:"Aggregated from commercial property listings and market research, we estimate realistic rent ranges so your financial model reflects what you'll actually pay.", proof:'Refreshed monthly per suburb', color:'#F59E0B', colorBg:'rgba(245,158,11,.08)', colorBorder:'rgba(245,158,11,.2)' },
              { icon: 'target', source:'Competition Scoring Engine', badge:'AI-computed', headline:'Threat rating for every nearby business', body:"Our model scores competitor intensity by proximity, rating, category overlap and business count — giving you a number, not a vague \"there's some competition.\"", proof:'Per-radius, per-category scoring', color:'#EF4444', colorBg:'rgba(239,68,68,.08)', colorBorder:'rgba(239,68,68,.2)' },
              { icon: 'bot', source:'AI Financial Model', badge:'Proprietary', headline:'Break-even, profit and 3-year outlook', body:'Input your rent and transaction value — our model calculates daily volume needed, monthly profit, payback period and a 3-year revenue projection.', proof:'Calibrated on 180+ analyses', color:'#10B981', colorBg:'rgba(16,185,129,.08)', colorBorder:'rgba(16,185,129,.25)' },
              { icon: 'trendingUp', source:'Market Demand Signals', badge:'Multi-source', headline:'Search trends and foot traffic by suburb', body:'We combine category-level search volume, proximity to demand generators (transport, offices, universities) and ABS commute data to estimate real demand.', proof:'Google Trends + ABS movement data', color:'#0EA5E9', colorBg:'rgba(14,165,233,.08)', colorBorder:'rgba(14,165,233,.2)' },
            ].map((ds, i) => (
              <div key={i}
                style={{ background:'rgba(255,255,255,.03)', border:`1px solid ${ds.colorBorder}`, borderRadius:18, padding:'22px 20px', transition:'transform .2s, background .2s, box-shadow .2s', cursor:'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.background=ds.colorBg; el.style.boxShadow=`0 12px 40px ${ds.color}22` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(0)'; el.style.background='rgba(255,255,255,.03)'; el.style.boxShadow='none' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:ds.colorBg, border:`1px solid ${ds.colorBorder}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <LI n={ds.icon} size={20} color={ds.color}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:800, color:ds.color, background:ds.colorBg, border:`1px solid ${ds.colorBorder}`, borderRadius:6, padding:'3px 8px', textTransform:'uppercase' as const, letterSpacing:'.07em' }}>{ds.badge}</span>
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

          <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:18, padding: isMobile ? '20px 16px' : '24px 32px' }}>
            <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row' as const, alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 20 : 40, justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:'#F0FDF9', marginBottom:4 }}>Built for accuracy, not assumptions.</p>
                <p style={{ fontSize:12, color:'rgba(204,235,229,.45)', lineHeight:1.6 }}>Our methodology is publicly documented. Read exactly how each data layer is weighted and how verdicts are computed.</p>
              </div>
              <div style={{ display:'flex', gap:12, flexShrink:0, flexWrap:'wrap' as const }}>
                {[
                  { icon: 'trophy',    label: '94% accuracy',    sub: 'vs post-opening data' },
                  { icon: 'globe',     label: 'Australian only', sub: 'Localised benchmarks' },
                  { icon: 'refreshCw', label: 'Updated live',    sub: 'Per-analysis refresh' },
                ].map(t => (
                  <div key={t.label} style={{ textAlign:'center' as const, padding:'10px 16px', background:'rgba(16,185,129,.06)', border:'1px solid rgba(16,185,129,.15)', borderRadius:12 }}>
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}><LI n={t.icon} size={20} color='#34D399'/></div>
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
        <style>{`@keyframes pipe-flow { from { transform: translateX(-100%) } to { transform: translateX(100%) } }`}</style>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: isMobile ? '72px 16px' : '100px 40px', background: L.white, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 50%, rgba(16,185,129,.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(5,150,105,.03) 0%, transparent 50%)', pointerEvents:'none' }}/>
        <div style={{ ...W, position:'relative', zIndex:2 }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 36 : 56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:L.emeraldXlt, border:`1px solid ${L.emeraldLt}`, borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:L.emerald, textTransform:'uppercase' as const, letterSpacing:'.08em', marginBottom:16 }}>Customer stories</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight:900, color:L.slate, letterSpacing:'-.04em', marginBottom:12 }}>Real decisions. Real money saved.</h2>
            <p style={{ fontSize:15, color:L.muted, maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>Founders and analysts across Australia use Locatalyze before signing a single lease.</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom: isMobile ? 32 : 48, flexWrap:'wrap' as const }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:L.mint, border:`1px solid ${L.emeraldLt}`, borderRadius:12, padding:'10px 20px' }}>
              <span style={{ fontSize:20, letterSpacing:2, color:'#F59E0B' }}>★★★★★</span>
              <div>
                <p style={{ fontSize:16, fontWeight:900, color:L.slate, lineHeight:1 }}>4.8 / 5</p>
                <p style={{ fontSize:10, color:L.muted, marginTop:1 }}>Average rating</p>
              </div>
            </div>
            {[{value:'$340k+',label:'In lease mistakes avoided'},{value:'180+',label:'Founders who analysed'},{value:'94%',label:'Said reports were accurate'}].map(s => (
              <div key={s.label} style={{ textAlign:'center' as const }}>
                <p style={{ fontSize:22, fontWeight:900, color:L.emerald, letterSpacing:'-.03em', lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:11, color:L.muted, marginTop:3 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:18 }}>
            {[
              { quote:'I was about to sign a 3-year lease. Locatalyze gave me a NO verdict — and saved me from a $180,000 mistake. The competition data flagged four cafés I had walked straight past.', name:'Sarah M.', role:'Café owner', city:'Melbourne, VIC', initials:'SM', avatarBg:'#ECFDF5', avatarColor:'#059669', saved:'Saved: ~$180,000', savedColor:'#059669', savedBg:'#ECFDF5', savedBorder:'#A7F3D0', highlight:'NO verdict saved a 3-year lease.', emoji:'☕' },
              { quote:'I compared four shortlisted locations in under 10 minutes. The scoring model is remarkably good — I picked the site with the highest profit potential and it has outperformed every projection.', name:'James T.', role:'Franchise buyer', city:'Sydney, NSW', initials:'JT', avatarBg:'#EFF6FF', avatarColor:'#3B82F6', saved:'Outperformed projections', savedColor:'#3B82F6', savedBg:'#EFF6FF', savedBorder:'#BFDBFE', highlight:'4 locations compared in 10 minutes.', emoji:'🍽️' },
              { quote:"I use this with commercial real estate clients as a first-pass feasibility tool. The financial model is genuinely rigorous — I've replaced three hours of manual spreadsheet work with one report.", name:'Priya K.', role:'Commercial property analyst', city:'Brisbane, QLD', initials:'PK', avatarBg:'#F5F3FF', avatarColor:'#8B5CF6', saved:'Replaced 3hrs of spreadsheet work', savedColor:'#8B5CF6', savedBg:'#F5F3FF', savedBorder:'#DDD6FE', highlight:'Used professionally with clients.', emoji:'📊' },
            ].map((t, i) => (
              <div key={i}
                style={{ background:'#fff', border:`1.5px solid ${L.border}`, borderRadius:22, padding:'26px 24px', display:'flex', flexDirection:'column' as const, transition:'all .22s', position:'relative' as const, overflow:'hidden' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=t.avatarColor+'55'; el.style.boxShadow=`0 16px 48px ${t.avatarColor}14`; el.style.transform='translateY(-4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=L.border; el.style.boxShadow='none'; el.style.transform='translateY(0)' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${t.avatarColor},${t.avatarColor}44)`, borderRadius:'22px 22px 0 0' }}/>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <span style={{ fontSize:13, color:'#F59E0B', letterSpacing:2 }}>★★★★★</span>
                  <span style={{ fontSize:18 }}>{t.emoji}</span>
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:t.savedBg, border:`1px solid ${t.savedBorder}`, borderRadius:8, padding:'4px 10px', marginBottom:14, alignSelf:'flex-start' as const }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:t.savedColor, flexShrink:0 }}/>
                  <span style={{ fontSize:10.5, fontWeight:700, color:t.savedColor }}>{t.highlight}</span>
                </div>
                <p style={{ fontSize:14, color:'#334155', lineHeight:1.8, marginBottom:20, flex:1 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:16, borderTop:`1px solid ${L.border}` }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:t.avatarBg, border:`2px solid ${t.savedBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:t.avatarColor, flexShrink:0 }}>{t.initials}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:L.slate, lineHeight:1 }}>{t.name}</p>
                    <p style={{ fontSize:12, color:L.muted, marginTop:3 }}>{t.role} · {t.city}</p>
                  </div>
                  <div style={{ background:t.savedBg, border:`1px solid ${t.savedBorder}`, borderRadius:8, padding:'4px 8px', textAlign:'right' as const }}>
                    <p style={{ fontSize:9, fontWeight:700, color:t.savedColor, textTransform:'uppercase' as const, letterSpacing:'.06em', lineHeight:1.1 }}>{t.saved}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:48, padding:'32px 24px', background:L.mint, borderRadius:20, border:`1px solid ${L.emeraldLt}` }}>
            <p style={{ fontSize: isMobile ? 17 : 21, fontWeight:900, color:L.slate, letterSpacing:'-.02em', marginBottom:8 }}>Ready to make a decision you can stand behind?</p>
            <p style={{ fontSize:13, color:L.muted, marginBottom:20 }}>3 full reports included on the free plan. No credit card required.</p>
            <Link href="/auth/signup" style={{ display:'inline-flex', alignItems:'center', gap:6, background:L.emerald, color:'#fff', borderRadius:12, padding:'13px 28px', fontWeight:800, fontSize:14, boxShadow:'0 4px 20px rgba(16,185,129,.25)', textDecoration:'none' }}>
              Analyse my location free →
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: sp, background: L.mint }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: pad }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: L.emeraldXlt, border: `1px solid ${L.emeraldLt}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: L.emerald, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, color: L.slate, letterSpacing: '-.04em', marginBottom: 10 }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: L.muted }}>Start free. Upgrade only when you need more.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ background: L.white, border: `1.5px solid ${L.border}`, borderRadius: 22, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: L.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Free</p>
              <p style={{ fontSize: 38, fontWeight: 900, color: L.slate, marginBottom: 4, letterSpacing: '-.03em' }}>$0</p>
              <p style={{ fontSize: 13, color: L.muted, marginBottom: 22 }}>Forever free</p>
              {['3 location reports','Full financial model','SWOT analysis','PDF download'].map(f => (
                <p key={f} style={{ fontSize: 13, color: '#334155', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: L.emerald, fontWeight: 700 }}>✓</span>{f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: 11, border: `1.5px solid ${L.border}`, borderRadius: 11, fontSize: 13, fontWeight: 700, color: L.slate }}>Get started free</Link>
            </div>
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
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: 11, border: `1.5px solid ${L.emerald}`, borderRadius: 11, fontSize: 13, fontWeight: 700, color: L.emerald }}>Start monthly</Link>
            </div>
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
              <Link href="/auth/signup" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: 11, background: '#fff', borderRadius: 11, fontSize: 13, fontWeight: 800, color: '#0F766E' }}>Get lifetime access</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
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
