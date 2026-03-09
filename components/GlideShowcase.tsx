'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── Each tab = one full feature showcase ───────────────────────────────────
const TABS = [
  {
    id: 'location-analysis',
    label: 'Location Analysis',
    headline: 'Location intelligence,\nilluminated.',
    sub: 'Understand exactly what makes a location work — or fail. Analyse foot traffic, daytime population, suburb demographics and proximity to demand generators before you commit to a single dollar of rent.',
    cta: 'See how it works',
    href: '/use-case/all',
    // Background: a street / city aerial
    photo: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
    photoAlt: 'City aerial view',
    // Mini UI shown inside device mockup
    ui: {
      type: 'score',
      address: '142 Bourke St, Melbourne VIC',
      score: 84,
      verdict: 'GO',
      verdictColor: '#059669',
      rows: [
        { label: 'Foot Traffic', pct: 85, color: '#059669', val: 'High' },
        { label: 'Demographics', pct: 78, color: '#059669', val: 'Strong' },
        { label: 'Competition', pct: 52, color: '#D97706', val: 'Moderate' },
        { label: 'Rent Ratio', pct: 82, color: '#059669', val: '9.2%' },
      ],
    },
  },
  {
    id: 'suburb-scoring',
    label: 'Suburb Scoring',
    headline: 'Every suburb scored\nfor your business.',
    sub: 'Compare suburbs side by side using income data, population density, age profile and spending behaviour. Find the suburb where your business concept has the strongest natural advantage.',
    cta: 'Explore suburb scores',
    href: '/use-case/all',
    photo: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80',
    photoAlt: 'Suburban street',
    ui: {
      type: 'suburbs',
      rows: [
        { name: 'Fitzroy VIC 3065', score: 92, badge: 'Top Pick', badgeColor: '#059669' },
        { name: 'Newtown NSW 2042', score: 87, badge: 'Strong', badgeColor: '#0F766E' },
        { name: 'Subiaco WA 6008', score: 83, badge: 'Strong', badgeColor: '#0F766E' },
        { name: 'New Farm QLD 4005', score: 79, badge: 'Good', badgeColor: '#D97706' },
        { name: 'Leederville WA 6007', score: 74, badge: 'Good', badgeColor: '#D97706' },
      ],
    },
  },
  {
    id: 'competitor-mapping',
    label: 'Competitor Mapping',
    headline: 'See every competitor\nbefore they see you.',
    sub: 'Map every direct competitor within your chosen radius. Understand their ratings, proximity and threat level — and identify the gaps in the market where your concept can own the category.',
    cta: 'Map competitors now',
    href: '/use-case/all',
    photo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    photoAlt: 'Retail street',
    ui: {
      type: 'competitors',
      radius: '500m',
      count: 4,
      rows: [
        { name: 'The Daily Grind', dist: '120m', stars: 4.2, threat: 'High', color: '#DC2626' },
        { name: 'Brew & Co.', dist: '280m', stars: 3.8, threat: 'Med', color: '#D97706' },
        { name: 'Sunrise Café', dist: '390m', stars: 4.5, threat: 'High', color: '#DC2626' },
        { name: 'Quick Bites', dist: '470m', stars: 3.1, threat: 'Low', color: '#059669' },
      ],
    },
  },
  {
    id: 'rent-affordability',
    label: 'Rent Affordability',
    headline: 'Know if the rent\nmakes financial sense.',
    sub: 'Enter your expected rent and average transaction value. Locatalyze calculates the exact daily customer volume you need to stay profitable — and tells you if this location can realistically deliver it.',
    cta: 'Run a rent analysis',
    href: '/use-case/all',
    photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    photoAlt: 'Commercial property',
    ui: {
      type: 'rent',
      rent: '$4,200 / mo',
      ratio: '9.8%',
      status: 'Healthy ✓',
      statusColor: '#059669',
      rows: [
        { label: 'Revenue needed', val: '$42,800 / mo' },
        { label: 'Daily transactions', val: '156 / day' },
        { label: 'Break-even', val: '~7 months' },
        { label: 'Safety buffer', val: '$4,600 / mo' },
      ],
    },
  },
  {
    id: 'feasibility-reports',
    label: 'Feasibility Reports',
    headline: 'A full report,\nin 30 seconds.',
    sub: 'Get a complete location feasibility report covering demand, competition, demographics and financials. Share it with your accountant, investor or landlord as a professional PDF — generated instantly.',
    cta: 'See a sample report',
    href: '/use-case/all',
    photo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80',
    photoAlt: 'Business planning',
    ui: {
      type: 'report',
      address: '88 Oxford St, Darlinghurst NSW',
      verdict: 'GO',
      verdictColor: '#059669',
      score: 88,
      sections: [
        { icon: '📍', label: 'Location Score', val: '88 / 100', good: true },
        { icon: '👥', label: 'Demand Signal', val: 'Strong', good: true },
        { icon: '🏪', label: 'Competition Risk', val: 'Moderate', good: null },
        { icon: '💰', label: 'Rent Viability', val: 'Viable', good: true },
        { icon: '📊', label: 'Demographics', val: 'Excellent', good: true },
      ],
    },
  },
]

// ─── Device mockup UI renderers ──────────────────────────────────────────────
function MockupUI({ tab }: { tab: typeof TABS[0] }) {
  const ui = tab.ui
  const f = "'DM Sans', sans-serif"

  if (ui.type === 'score') {
    return (
      <div style={{ fontFamily: f, padding: '20px' }}>
        <p style={{ fontSize: 10, color: '#6B7280', margin: '0 0 4px' }}>📍 {ui.address}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>Location Score</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#F9FAFB', letterSpacing: '-0.04em', margin: '2px 0' }}>{ui.score}</p>
          </div>
          <div style={{ textAlign: 'center', background: ui.verdictColor + '20', border: `1px solid ${ui.verdictColor}50`, borderRadius: 10, padding: '8px 16px' }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: ui.verdictColor, margin: 0 }}>{ui.verdict} ✅</p>
            <p style={{ fontSize: 9, color: '#6B7280', margin: '2px 0 0' }}>Verdict</p>
          </div>
        </div>
        {(ui.rows as Array<{label:string;pct:number;color:string;val:string}>).map((r, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{r.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.val}</span>
            </div>
            <div style={{ height: 5, background: '#1F2937', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (ui.type === 'suburbs') {
    return (
      <div style={{ fontFamily: f, padding: '20px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB', margin: '0 0 14px' }}>🏘️ Top Suburbs for Cafés</p>
        {(ui.rows as Array<{name:string;score:number;badge:string;badgeColor:string}>).map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', marginBottom: 6, background: i === 0 ? 'rgba(15,118,110,0.15)' : '#111827', borderRadius: 9, border: i === 0 ? '1px solid rgba(15,118,110,0.3)' : '1px solid #1F2937' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#14B8A6', width: 18 }}>#{i + 1}</span>
            <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{r.name}</span>
            <span style={{ fontSize: 10, color: '#fff', background: r.badgeColor, borderRadius: 5, padding: '2px 7px', fontWeight: 700 }}>{r.badge}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: r.score > 85 ? '#34D399' : '#FCD34D' }}>{r.score}</span>
          </div>
        ))}
      </div>
    )
  }

  if (ui.type === 'competitors') {
    return (
      <div style={{ fontFamily: f, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>🗺️ Competitors within {ui.radius}</p>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{ui.count} found</span>
        </div>
        {(ui.rows as Array<{name:string;dist:string;stars:number;threat:string;color:string}>).map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: i < 3 ? '1px solid #1F2937' : 'none' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}>{r.name}</span>
            <span style={{ fontSize: 10, color: '#6B7280' }}>{r.dist}</span>
            <span style={{ fontSize: 10, color: '#FCD34D' }}>★ {r.stars}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: r.color + '20', borderRadius: 4, padding: '2px 6px' }}>{r.threat}</span>
          </div>
        ))}
      </div>
    )
  }

  if (ui.type === 'rent') {
    return (
      <div style={{ fontFamily: f, padding: '20px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB', margin: '0 0 14px' }}>💰 Rent Analysis</p>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 30, fontWeight: 900, color: '#F9FAFB', letterSpacing: '-0.04em', margin: 0 }}>{ui.rent}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6, background: '#059669' + '15', border: '1px solid #059669' + '40', borderRadius: 20, padding: '4px 12px' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#34D399' }}>{ui.ratio}</span>
            <span style={{ fontSize: 10, color: '#6B7280' }}>of revenue</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: ui.statusColor }}>{ui.status}</span>
          </div>
        </div>
        {(ui.rows as Array<{label:string;val:string}>).map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #1F2937' }}>
            <span style={{ fontSize: 11, color: '#6B7280' }}>{r.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#E5E7EB' }}>{r.val}</span>
          </div>
        ))}
      </div>
    )
  }

  if (ui.type === 'report') {
    return (
      <div style={{ fontFamily: f, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 10, color: '#6B7280', margin: '0 0 2px' }}>📍 {ui.address}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>Feasibility Report</p>
          </div>
          <div style={{ background: ui.verdictColor + '20', border: `1px solid ${ui.verdictColor}50`, borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: ui.verdictColor, margin: 0 }}>{ui.verdict}</p>
            <p style={{ fontSize: 9, color: '#6B7280', margin: '1px 0 0' }}>Score: {ui.score}</p>
          </div>
        </div>
        {(ui.sections as Array<{icon:string;label:string;val:string;good:boolean|null}>).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid #1F2937' : 'none' }}>
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            <span style={{ fontSize: 12, color: '#9CA3AF', flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: s.good === true ? '#34D399' : s.good === null ? '#FCD34D' : '#F87171' }}>{s.val}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function GlideShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [paused, setPaused] = useState(false)
  const font = "'DM Sans', sans-serif"

  const active = TABS[activeIdx]

  function goTo(idx: number) {
    if (idx === activeIdx || isTransitioning) return
    setPrevIdx(activeIdx)
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIdx(idx)
      setIsTransitioning(false)
    }, 300)
  }

  // Auto-advance
  useEffect(() => {
    if (paused) return
    autoRef.current = setInterval(() => {
      setActiveIdx(prev => {
        setPrevIdx(prev)
        setIsTransitioning(true)
        setTimeout(() => setIsTransitioning(false), 300)
        return (prev + 1) % TABS.length
      })
    }, 5000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [paused])

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(32px) } to { opacity: 1; transform: translateX(0) } }
        .showcase-bg {
          transition: opacity 0.5s ease;
        }
        .tab-underline {
          transition: width 0.3s ease, background 0.3s ease;
        }
        .device-float {
          animation: slideInRight 0.5s ease both;
        }
        .text-reveal {
          animation: slideUp 0.45s ease both;
        }
      `}</style>

      <section
        style={{ position: 'relative', fontFamily: font, overflow: 'hidden', background: '#0A0A0A' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Background photo with dark overlay ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Current bg */}
          <img
            key={active.id + '-bg'}
            src={active.photo}
            alt={active.photoAlt}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'grayscale(60%) brightness(0.35)',
              animation: 'fadeIn 0.6s ease both',
            }}
          />
          {/* Gradient overlays for text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,6,6,0.92) 40%, rgba(6,6,6,0.3) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,0.8) 0%, transparent 50%)' }} />
          {/* Teal accent glow */}
          <div style={{ position: 'absolute', bottom: -100, left: -100, width: 600, height: 400, borderRadius: '50%', background: `radial-gradient(ellipse, ${active.id === 'rent-affordability' ? '#D97706' : '#0F766E'}18, transparent 70%)`, transition: 'background 0.6s ease', pointerEvents: 'none' }} />
        </div>

        {/* ── Tab navigation — exactly like Glide ── */}
        <div style={{ position: 'relative', zIndex: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', overflowX: 'auto', gap: 0 }}>
            {TABS.map((tab, i) => {
              const isActive = i === activeIdx
              return (
                <button
                  key={tab.id}
                  onClick={() => { goTo(i); setPaused(true); setTimeout(() => setPaused(false), 10000) }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '22px 28px 20px', position: 'relative',
                    color: isActive ? '#F9FAFB' : 'rgba(255,255,255,0.38)',
                    fontSize: 14, fontWeight: isActive ? 700 : 400,
                    fontFamily: font, whiteSpace: 'nowrap',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {tab.label}
                  {/* Active underline */}
                  <div style={{
                    position: 'absolute', bottom: -1, left: '50%',
                    transform: 'translateX(-50%)',
                    height: 2, background: '#ffffff',
                    borderRadius: 2,
                    width: isActive ? '80%' : '0%',
                    transition: 'width 0.3s ease',
                  }} />
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Main content: text left + device right ── */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '72px 40px 80px', display: 'flex', alignItems: 'center', gap: 48, minHeight: 520 }}>

          {/* LEFT: text content */}
          <div style={{ flex: '0 0 auto', maxWidth: 460 }} key={active.id + '-text'} className="text-reveal">
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900,
              color: '#F9FAFB', letterSpacing: '-0.04em',
              lineHeight: 1.1, margin: '0 0 20px',
              whiteSpace: 'pre-line',
            }}>
              {active.headline}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 380 }}>
              {active.sub}
            </p>
            <Link
              href={active.href}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                color: '#F9FAFB', borderRadius: 10,
                padding: '13px 22px', fontSize: 14, fontWeight: 600,
                textDecoration: 'none', fontFamily: font,
                transition: 'background 0.2s ease',
              }}
            >
              {active.cta}
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
          </div>

          {/* RIGHT: Floating device mockup — exactly like Glide's tablet */}
          <div
            key={active.id + '-device'}
            className="device-float"
            style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <div style={{
              width: '100%', maxWidth: 580,
              background: 'rgba(10,10,10,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}>
              {/* Device toolbar */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#FF5F57','#FFBD2E','#28CA41'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#6B7280' }}>🔒</span>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>app.locatalyze.com.au/analyse</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>L</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>Locatalyze</span>
                </div>
              </div>
              {/* Device content */}
              <div style={{ background: '#0F1117', minHeight: 300 }}>
                <MockupUI tab={active} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Progress bar at bottom ── */}
        <div style={{ position: 'relative', zIndex: 2, height: 2, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #0F766E, #14B8A6)',
            width: `${((activeIdx + 1) / TABS.length) * 100}%`,
            transition: 'width 0.4s ease',
            borderRadius: 1,
          }} />
        </div>

        {/* ── Bottom CTA strip ── */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '32px 24px 44px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/auth/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#0F766E', color: '#fff', borderRadius: 12,
            padding: '14px 30px', fontSize: 15, fontWeight: 700,
            textDecoration: 'none', fontFamily: font,
            boxShadow: '0 4px 24px rgba(15,118,110,0.4)',
          }}>
            Analyse my location free
            <span style={{ fontSize: 18 }}>→</span>
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 10 }}>
            No credit card required · Any Australian address · Results in 30 seconds
          </p>
        </div>
      </section>
    </>
  )
}
