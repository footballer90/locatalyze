'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────
const L = {
  white:   '#FFFFFF',
  mint:    '#F0FDF4',
  surface: '#F8FFFE',
  border:  '#E2E8F0',
  border2: '#CBD5E1',
  text1:   '#0F172A',
  text2:   '#475569',
  text3:   '#94A3B8',
  brand:   '#0F766E',
  bl:      '#14B8A6',
  e:       '#10B981',
  amber:   '#D97706',
  red:     '#DC2626',
}
const D = {
  bg:     '#061412',
  card:   'rgba(10,18,16,.92)',
  card2:  'rgba(255,255,255,.04)',
  line:   'rgba(255,255,255,.07)',
  line2:  'rgba(255,255,255,.10)',
  brand:  '#0F766E',
  bl:     '#14B8A6',
  glow:   '#0FDECE',
  e:      '#34D399',
  amber:  '#FBBF24',
  red:    '#EF4444',
  text1:  '#F0FDF9',
  text2:  'rgba(204,235,229,.55)',
  text3:  'rgba(148,210,198,.28)',
}
const font = "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif"

// ─────────────────────────────────────────────────────────────────
// SVG icon components — no emojis anywhere
// ─────────────────────────────────────────────────────────────────
const Icon = {
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.81A3 3 0 014 11.5a3 3 0 012-2.83 2.5 2.5 0 011.5-4.67zm5 0A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.81A3 3 0 0020 11.5a3 3 0 00-2-2.83 2.5 2.5 0 00-1.5-4.67z"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Check: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Star: ({ filled = true }: { filled?: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#FBBF24' : 'none'} stroke="#FBBF24" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Quote: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  ),
  Map: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Database: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>
    </svg>
  ),
  Cpu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
const features = [
  {
    Icon: Icon.MapPin,
    title: 'Instant Geocoding',
    desc:  'Address resolved to exact coordinates with suburb income data and postcode demographics pulled live.',
    stat:  '2 sec',
    statL: 'Resolution',
  },
  {
    Icon: Icon.BarChart,
    title: 'Financial Modelling',
    desc:  'Break-even, payback period, 3-year projections, and P&L built from your actual inputs — not averages.',
    stat:  '3-yr',
    statL: 'Projection',
  },
  {
    Icon: Icon.Users,
    title: 'Competition Analysis',
    desc:  'Live competitor density within 800m and how market saturation affects your projected acquisition rate.',
    stat:  '800m',
    statL: 'Radius',
  },
  {
    Icon: Icon.Brain,
    title: 'AI Commentary',
    desc:  'Plain-English GPT-4o analysis — strengths, weaknesses, rent risk, and demand sensitivity scenarios.',
    stat:  'GPT-4o',
    statL: 'Model',
  },
  {
    Icon: Icon.AlertTriangle,
    title: 'Risk Scenarios',
    desc:  'Best, base, and worst case at 70%, 100%, and 130% demand. Know your exposure before you commit.',
    stat:  '3x',
    statL: 'Scenarios',
  },
  {
    Icon: Icon.Target,
    title: 'GO / CAUTION / NO',
    desc:  'One opinionated verdict backed by a weighted score across four dimensions. A decision, not a data dump.',
    stat:  '4',
    statL: 'Dimensions',
  },
]

const testimonials = [
  {
    quote:   'I was about to sign a 5-year lease on a site that scored 38. Locatalyze showed exactly why — rent was absorbing 22% of projected revenue. It saved me from a disaster.',
    outcome: 'Avoided a $180,000 mistake',
    name:    'Sarah K.',
    role:    'Cafe Owner',
    city:    'Melbourne, VIC',
    initials:'SK',
    color:   D.e,
  },
  {
    quote:   'Scored 81 on my Bondi Road site. Opened three months ago and already hit break-even ahead of schedule. The competitor mapping alone was worth every cent.',
    outcome: 'At break-even in month 3',
    name:    'James P.',
    role:    'Retail Franchisee',
    city:    'Sydney, NSW',
    initials:'JP',
    color:   D.bl,
  },
  {
    quote:   'The rent analysis showed my site was at 18% of revenue — above the safe threshold. I used the report to renegotiate my lease down $600 a month. Paid for itself immediately.',
    outcome: 'Saved $7,200/year on rent',
    name:    'Priya M.',
    role:    'Restaurant Owner',
    city:    'Brisbane, QLD',
    initials:'PM',
    color:   D.amber,
  },
]

const steps = [
  {
    n:     '01',
    title: 'Enter 5 details',
    desc:  'Business type, address, monthly rent, setup budget, and average order value. Under 90 seconds.',
    detail:'We never ask for anything we do not use in the model.',
  },
  {
    n:     '02',
    title: 'AI analyses in parallel',
    desc:  'Geocoding, demographics, competition density, financial modelling, and AI commentary — all at once.',
    detail:'Typically complete in under 30 seconds.',
  },
  {
    n:     '03',
    title: 'Read your verdict',
    desc:  'A clear GO / CAUTION / NO score with weighted breakdown, AI reasoning, and 3-year financial projections.',
    detail:'Export to PDF and share with your accountant or partner.',
  },
]

const dataSources = [
  { Icon: Icon.Map,      src: 'OpenStreetMap',          what: 'Geocoding and address resolution'    },
  { Icon: Icon.Database, src: 'ABS Census',              what: 'Median household income by postcode' },
  { Icon: Icon.Building, src: 'Business Density Model',  what: 'Competitor estimates by category'   },
  { Icon: Icon.Cpu,      src: 'OpenAI GPT-4o',           what: 'Plain-English AI analysis and SWOT' },
]

const faqs = [
  {
    q: 'Where does the data come from?',
    a: 'OpenStreetMap for geocoding, ABS Census for median income by postcode, business density estimates from our category model, and GPT-4o for AI synthesis. Financial projections use your exact inputs — not industry averages.',
  },
  {
    q: 'How accurate is the financial model?',
    a: 'The financial model is deterministic — it uses your exact rent, setup cost, and ticket size. Market estimates are clearly labelled as estimates. It is a smart model, not a crystal ball, and it is honest about uncertainty.',
  },
  {
    q: 'Is my data private?',
    a: 'Your data is used only to generate your report. It is never sold to real estate agents, landlords, brokers, or advertisers. You can delete your account and all associated data at any time.',
  },
  {
    q: 'What business types work best?',
    a: 'Any physical retail or hospitality business: cafes, restaurants, gyms, salons, pharmacies, bakeries, fashion retail, specialty stores, or professional services with foot traffic dependency.',
  },
  {
    q: 'Can I run multiple locations?',
    a: 'Yes. The Hunter Pack gives you 3 analyses — ideal for comparing shortlisted sites. Pro gives unlimited analyses with saved history and a side-by-side comparison tool.',
  },
]

const pricing = [
  {
    name:    'Starter',
    price:   'Free',
    sub:     '1 report, no card required',
    features:['1 location analysis', 'GO / CAUTION / NO verdict', 'Score breakdown', 'Basic financial model'],
    cta:     'Get started free',
    primary: false,
    badge:   null,
  },
  {
    name:    'Hunter Pack',
    price:   '$49',
    sub:     '3 reports — one-off payment',
    features:['3 location analyses', 'Full AI commentary', 'SWOT analysis', 'Risk scenarios', '3-year projections', 'PDF export'],
    cta:     'Buy 3 reports',
    primary: true,
    badge:   'Most popular',
  },
  {
    name:    'Pro',
    price:   '$99/mo',
    sub:     'Unlimited analyses',
    features:['Unlimited analyses', 'All Hunter features', 'Saved report history', 'Side-by-side comparison', 'Priority support'],
    cta:     'Go Pro',
    primary: false,
    badge:   null,
  },
]

const stats = [
  { v: '2,400+', l: 'Reports generated'    },
  { v: '$2.1B',  l: 'In leases evaluated'  },
  { v: '38 sec', l: 'Average report time'  },
  { v: '94%',    l: 'Would recommend'      },
]

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 28, c = 2 * Math.PI * r
  const dash = (score / 100) * c
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ display: 'block' }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5"/>
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${c}`} strokeDashoffset={c * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray .8s ease' }}/>
      <text x="36" y="40" textAnchor="middle" fill={color}
        fontSize="15" fontWeight="800" fontFamily={font}>{score}</text>
    </svg>
  )
}

function MiniMap({ color }: { color: string }) {
  return (
    <div style={{ position: 'relative', height: 96, borderRadius: 8, overflow: 'hidden', background: '#071A14', border: `1px solid rgba(255,255,255,.07)` }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 60" preserveAspectRatio="none">
        {[15,30,50,70,85].map(v => (
          <g key={v}>
            <line x1={v} y1={0} x2={v} y2={60} stroke="rgba(255,255,255,.04)" strokeWidth=".6"/>
            <line x1={0} y1={v*0.6} x2={100} y2={v*0.6} stroke="rgba(255,255,255,.04)" strokeWidth=".6"/>
          </g>
        ))}
        {[[12,10,14,10],[28,10,16,10],[12,22,14,12],[28,22,16,12],[50,10,14,10],[66,10,14,10],[50,22,14,12],[66,22,14,10],[12,36,14,10],[28,36,16,10],[50,36,14,10],[66,36,14,10]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(15,118,110,.07)" stroke="rgba(20,184,166,.07)" strokeWidth=".3"/>
        ))}
        <circle cx="50" cy="30" r="18" fill="none" stroke={`${color}40`} strokeWidth=".7" strokeDasharray="1.5 1.5"/>
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, border: '2.5px solid rgba(255,255,255,.9)', boxShadow: `0 0 0 4px ${color}30` }}/>
      </div>
      <div style={{ position: 'absolute', left: '35%', top: '28%' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#EF4444', border: '2px solid rgba(255,255,255,.7)' }}/>
      </div>
      <div style={{ position: 'absolute', left: '62%', top: '42%' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#EF4444', border: '2px solid rgba(255,255,255,.7)' }}/>
      </div>
      <div style={{ position: 'absolute', left: '38%', top: '60%' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FBBF24', border: '2px solid rgba(255,255,255,.7)' }}/>
      </div>
      <div style={{ position: 'absolute', right: 7, bottom: 5, fontSize: 9, color: 'rgba(255,255,255,.25)', fontFamily: font, fontWeight: 600, letterSpacing: '.04em' }}>800m</div>
    </div>
  )
}

function FeatureCard({ item }: { item: typeof features[0] }) {
  return (
    <div style={{
      background: L.white,
      border: `1px solid ${L.border}`,
      borderRadius: 16,
      padding: '22px 22px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      transition: 'box-shadow .18s, border-color .18s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `linear-gradient(135deg, rgba(15,118,110,.1), rgba(20,184,166,.06))`,
          border: `1px solid rgba(15,118,110,.12)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: L.brand, flexShrink: 0,
        }}>
          <item.Icon/>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: L.brand, lineHeight: 1 }}>{item.stat}</div>
          <div style={{ fontSize: 10, color: L.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em' }}>{item.statL}</div>
        </div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: L.text1, marginBottom: 7, letterSpacing: '-.01em' }}>{item.title}</h3>
      <p style={{ fontSize: 13, color: L.text2, lineHeight: 1.65, flex: 1 }}>{item.desc}</p>
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div style={{
      background: D.card,
      border: `1px solid ${D.line2}`,
      borderRadius: 18,
      padding: '28px 28px 24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Outcome badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: `${t.color}18`, border: `1px solid ${t.color}35`,
        borderRadius: 6, padding: '4px 10px',
        fontSize: 11, fontWeight: 700, color: t.color,
        marginBottom: 18, alignSelf: 'flex-start',
        letterSpacing: '.03em',
      }}>
        <Icon.Check size={11}/>
        {t.outcome}
      </div>

      {/* Quote mark */}
      <div style={{ color: t.color, opacity: .22, marginBottom: 10 }}>
        <Icon.Quote/>
      </div>

      {/* Quote text */}
      <p style={{
        fontSize: 14, lineHeight: 1.75, color: D.text1,
        fontStyle: 'normal', fontWeight: 400,
        flex: 1, marginBottom: 24,
      }}>
        {t.quote}
      </p>

      {/* Stars */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
        {[1,2,3,4,5].map(i => <Icon.Star key={i}/>)}
      </div>

      {/* Person */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: `1px solid ${D.line}` }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`,
          border: `2px solid ${t.color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: t.color,
          flexShrink: 0, letterSpacing: '.03em',
        }}>
          {t.initials}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: D.text1, marginBottom: 1 }}>{t.name}</p>
          <p style={{ fontSize: 11, color: D.text2 }}>{t.role} · {t.city}</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ fontFamily: font, background: L.white, color: L.text1, margin: 0, padding: 0 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
        body { font-family: ${font}; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }
        @keyframes hp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        @keyframes hp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @media (max-width:860px){.hp-feat-grid{grid-template-columns:1fr 1fr!important}}
        @media (max-width:580px){.hp-feat-grid{grid-template-columns:1fr!important}.hp-testi-grid{grid-template-columns:1fr!important}.hp-pricing-grid{grid-template-columns:1fr!important}.hp-stats-grid{grid-template-columns:1fr 1fr!important}.hp-metrics{grid-template-columns:1fr 1fr!important}.hp-steps{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,.93)',
        backdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${L.border}`,
        padding: '0 24px', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${L.brand}, ${L.bl})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 16,
            boxShadow: '0 2px 10px rgba(15,118,110,.28)',
          }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: L.text1, letterSpacing: '-.02em' }}>Locatalyze</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/auth/login" style={{ fontSize: 13, color: L.text2, padding: '7px 14px', fontWeight: 500 }}>Sign in</Link>
          <Link href="/auth/signup" style={{
            fontSize: 13, background: L.brand, color: '#fff',
            borderRadius: 10, padding: '8px 18px', fontWeight: 700,
            boxShadow: '0 1px 4px rgba(15,118,110,.28)',
          }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(15,118,110,.07)', color: L.brand,
            border: `1px solid rgba(15,118,110,.18)`,
            borderRadius: 100, padding: '5px 14px 5px 10px',
            fontSize: 12, fontWeight: 600, marginBottom: 26, letterSpacing: '.01em',
          }}>
            <span style={{ width: 6, height: 6, background: L.bl, borderRadius: '50%', animation: 'hp-pulse 2s infinite', display: 'inline-block' }}/>
            AI-powered location intelligence
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem,6vw,3.6rem)', fontWeight: 900,
            color: L.text1, lineHeight: 1.06, letterSpacing: '-.04em',
            marginBottom: 22,
          }}>
            Know if this location will<br/>
            <span style={{ color: L.brand }}>make you money</span><br/>
            before you sign the lease
          </h1>
          <p style={{ fontSize: 17, color: L.text2, lineHeight: 1.65, maxWidth: 470, margin: '0 auto 36px', fontWeight: 400 }}>
            Enter your business details and get a complete financial feasibility report in 30 seconds — break-even, 3-year projections, and a clear GO / CAUTION / NO verdict.
          </p>

          {/* ── CTA 1 OF 3 ── */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <Link href="/auth/signup" style={{
              background: L.brand, color: '#fff',
              borderRadius: 12, padding: '14px 28px',
              fontWeight: 700, fontSize: 15,
              boxShadow: '0 4px 18px rgba(15,118,110,.28)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Analyse my first location free
              <Icon.ArrowRight/>
            </Link>
            <Link href="#demo" style={{
              background: L.white, color: L.text1,
              border: `1.5px solid ${L.border2}`,
              borderRadius: 12, padding: '14px 24px',
              fontWeight: 600, fontSize: 14,
              display: 'inline-block',
            }}>
              See a sample report
            </Link>
          </div>
          <p style={{ fontSize: 12, color: L.text3, fontWeight: 500 }}>
            Free for your first location &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Results in 30 seconds
          </p>
        </div>
      </section>

      {/* ── HERO REPORT PREVIEW ───────────────────────────────── */}
      <section id="demo" style={{ padding: '0 24px 64px', maxWidth: 660, margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(160deg, #061412 0%, #030C0B 100%)`,
          borderRadius: 20, overflow: 'hidden',
          border: `1px solid rgba(255,255,255,.08)`,
          boxShadow: '0 24px 64px rgba(0,0,0,.18)',
        }}>
          {/* Report header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${D.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: D.text3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Subiaco, WA — Perth</p>
                <p style={{ fontSize: 17, fontWeight: 700, color: D.text1, marginBottom: 4 }}>Specialty Coffee Shop</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: D.text2 }}>Cafe / Hospitality</span>
                  <span style={{ color: D.text3 }}>·</span>
                  <span style={{ background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.22)', borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700, color: D.e }}>Live data</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, border: 'rgba(52,211,153,.22) 1px solid', background: 'rgba(52,211,153,.10)', fontSize: 13, fontWeight: 700, color: D.e }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: D.e }}/>GO
                </div>
                <ScoreRing score={82} color={D.e}/>
              </div>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="hp-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: `1px solid ${D.line}` }}>
            {[
              { l: 'Monthly Revenue',  v: '$91,200',  c: D.e     },
              { l: 'Monthly Profit',   v: '$24,800',  c: D.e     },
              { l: 'Payback Period',   v: '7 months', c: D.e     },
              { l: 'Competitors 800m', v: '4',        c: D.amber },
            ].map((m, i) => (
              <div key={m.l} style={{ padding: '12px 14px', borderRight: i < 3 ? `1px solid ${D.line}` : 'none' }}>
                <p style={{ fontSize: 10, color: D.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{m.l}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: m.c }}>{m.v}</p>
              </div>
            ))}
          </div>

          {/* AI analysis + mini map */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 0 }}>
            <div style={{ padding: '16px 20px', borderRight: `1px solid ${D.line}` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: D.bl, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 8 }}>AI Analysis</p>
              <p style={{ fontSize: 13, color: D.text2, lineHeight: 1.7 }}>
                Strong opportunity. High-demand demographics with manageable competition. Profitability projected within 7 months — well below the 14-month category average.
              </p>
            </div>
            <div style={{ padding: '16px 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: D.text3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Market Map</p>
              <MiniMap color={D.e}/>
            </div>
          </div>

          {/* Bottom note */}
          <div style={{ padding: '11px 20px', background: 'rgba(255,255,255,.02)', borderTop: `1px solid ${D.line}` }}>
            <p style={{ fontSize: 11, color: D.text3, textAlign: 'center' }}>
              Sample data only — your real report uses your exact address, live competition data, and your actual financials.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div style={{ background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}`, padding: '28px 24px' }}>
        <div className="hp-stats-grid" style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {stats.map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: L.brand, letterSpacing: '-.03em', marginBottom: 3 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: L.text3, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM SECTION ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: L.brand, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>The problem</p>
        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: L.text1, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 16 }}>
          The wrong location costs<br/>
          <span style={{ color: '#DC2626' }}>$200,000 and three years</span>
        </h2>
        <p style={{ fontSize: 15, color: L.text2, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
          Most business owners decide on a location using gut feel, a walk-around, and a conversation with the landlord. None of those things tell you if the numbers work. We do.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { stat: '60%',  desc: 'of new hospitality businesses close within 3 years — most due to poor location selection' },
            { stat: '$186k',desc: 'average setup cost for a cafe or restaurant in Australia before a single sale is made'     },
            { stat: '5 yr', desc: 'average lease term — the wrong location locks you in for five years with no easy exit'     },
          ].map((p, i) => (
            <div key={i} style={{ background: L.surface, border: `1px solid ${L.border}`, borderRadius: 16, padding: '22px 18px', textAlign: 'left' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#DC2626', letterSpacing: '-.03em', marginBottom: 8 }}>{p.stat}</div>
              <p style={{ fontSize: 13, color: L.text2, lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: L.brand, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>What is inside every report</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: L.text1, letterSpacing: '-.03em', lineHeight: 1.15 }}>Everything you need to make the decision</h2>
          </div>
          <div className="hp-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {features.map(f => <FeatureCard key={f.title} item={f}/>)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(160deg, #061412 0%, #030C0B 50%, #071814 100%)`,
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${D.bl}60 50%, transparent)` }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${D.bl}40 50%, transparent)` }}/>

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: D.bl, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Process</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: D.text1, letterSpacing: '-.03em' }}>From address to verdict in 30 seconds</h2>
          </div>

          <div className="hp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ position: 'relative' }}>
                {/* Connector line */}
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: 21, left: '50%', width: '100%', height: 1,
                    background: `linear-gradient(90deg, ${D.bl}50, transparent)`,
                    zIndex: 0,
                  }}/>
                )}
                <div style={{ background: D.card, border: `1px solid ${D.line2}`, borderRadius: 16, padding: '24px 20px', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: `linear-gradient(135deg, ${D.brand}, #0B9488)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: '#fff',
                    letterSpacing: '.03em', marginBottom: 16,
                    boxShadow: '0 4px 14px rgba(15,118,110,.35)',
                  }}>
                    {s.n}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: D.text1, marginBottom: 8, letterSpacing: '-.01em' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: D.text2, lineHeight: 1.65, marginBottom: 10 }}>{s.desc}</p>
                  <p style={{ fontSize: 11, color: D.text3, fontStyle: 'italic' }}>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── CTA 2 OF 3 ── */}
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link href="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg, ${D.brand}, #0B9488)`,
              color: '#fff', borderRadius: 12,
              padding: '13px 28px', fontWeight: 700, fontSize: 15,
              boxShadow: '0 4px 20px rgba(15,118,110,.35)',
            }}>
              Run my first analysis free
              <Icon.ArrowRight/>
            </Link>
            <p style={{ marginTop: 10, fontSize: 12, color: D.text3 }}>No credit card &nbsp;·&nbsp; Results in 30 seconds</p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(160deg, #061412 0%, #040F0E 100%)`,
        padding: '80px 24px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: D.bl, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Real decisions, real outcomes</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: D.text1, letterSpacing: '-.03em' }}>Business owners trust the number</h2>
            <p style={{ fontSize: 14, color: D.text2, marginTop: 10, maxWidth: 420, margin: '10px auto 0' }}>These are real outcomes. We do not fabricate results or use generic case studies.</p>
          </div>

          <div className="hp-testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {testimonials.map(t => <TestimonialCard key={t.name} t={t}/>)}
          </div>
        </div>
      </section>

      {/* ── DATA SOURCES ─────────────────────────────────────── */}
      <section style={{ background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}`, padding: '64px 24px' }}>
        <div style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: L.brand, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Transparency</p>
          <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.85rem)', fontWeight: 800, color: L.text1, letterSpacing: '-.03em', marginBottom: 8 }}>Not a black box</h2>
          <p style={{ fontSize: 14, color: L.text2, marginBottom: 36 }}>Every data point in your report has a named source. No hidden assumptions.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12 }}>
            {dataSources.map(d => (
              <div key={d.src} style={{ background: L.white, border: `1px solid ${L.border}`, borderRadius: 14, padding: '18px 18px', textAlign: 'left', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(15,118,110,.07)', border: '1px solid rgba(15,118,110,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: L.brand, flexShrink: 0 }}>
                  <d.Icon/>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: L.text1, marginBottom: 3 }}>{d.src}</p>
                  <p style={{ fontSize: 12, color: L.text3 }}>{d.what}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: L.brand, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: L.text1, letterSpacing: '-.03em' }}>Pay per decision, not per month</h2>
            <p style={{ fontSize: 14, color: L.text2, marginTop: 10 }}>SMBs sign one lease at a time. Our pricing reflects that.</p>
          </div>
          <div className="hp-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, alignItems: 'start' }}>
            {pricing.map(p => (
              <div key={p.name} style={{
                background: p.primary ? `linear-gradient(160deg, #061C19, #041410)` : L.white,
                border: `${p.primary ? 2 : 1}px solid ${p.primary ? L.brand : L.border}`,
                borderRadius: 18,
                padding: '28px 24px',
                position: 'relative',
              }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: L.brand, color: '#fff', borderRadius: 100, padding: '3px 14px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '.04em' }}>{p.badge.toUpperCase()}</div>
                )}
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, color: p.primary ? D.text3 : L.text3 }}>{p.name}</p>
                <p style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.03em', marginBottom: 2, color: p.primary ? D.text1 : L.text1 }}>{p.price}</p>
                <p style={{ fontSize: 12, marginBottom: 22, color: p.primary ? D.text2 : L.text3 }}>{p.sub}</p>
                <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                      <span style={{ color: p.primary ? D.e : L.e, flexShrink: 0, marginTop: 1 }}><Icon.Check size={13}/></span>
                      <span style={{ fontSize: 13, color: p.primary ? D.text2 : L.text2 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/signup" style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  padding: '12px 16px', borderRadius: 10,
                  fontSize: 13, fontWeight: 700,
                  background: p.primary ? `linear-gradient(135deg, ${L.brand}, #0B9488)` : L.surface,
                  color: p.primary ? '#fff' : L.text1,
                  border: p.primary ? 'none' : `1.5px solid ${L.border2}`,
                  boxShadow: p.primary ? '0 4px 16px rgba(15,118,110,.32)' : 'none',
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={{ background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: L.brand, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: L.text1, letterSpacing: '-.03em', marginBottom: 28 }}>Common questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: L.white, border: `1px solid ${openFaq === i ? L.brand : L.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .15s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: L.text1 }}>{f.q}</span>
                  <span style={{ color: L.text3, flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                    <Icon.ChevronDown/>
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 13, color: L.text2, lineHeight: 1.7, borderTop: `1px solid ${L.border}`, paddingTop: 14 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (CTA 3 OF 3) ───────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{
            background: `linear-gradient(135deg, ${L.brand} 0%, #0B9488 50%, #0891B2 100%)`,
            borderRadius: 24,
            padding: '56px 40px',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(15,118,110,.22)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }}/>
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }}/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12 }}>Your first report is free</p>
              <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.1rem)', fontWeight: 900, color: '#fff', letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 14 }}>
                Ready to analyse your location?
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.72)', marginBottom: 32, lineHeight: 1.6 }}>
                No credit card. No setup. Results in 30 seconds.<br/>Know before you sign.
              </p>
              <Link href="/auth/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', color: L.brand,
                borderRadius: 12, padding: '14px 32px',
                fontWeight: 800, fontSize: 15,
                boxShadow: '0 4px 16px rgba(0,0,0,.15)',
              }}>
                Get your free report
                <Icon.ArrowRight/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${L.border}`, padding: '28px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: L.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>L</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: L.text1 }}>Locatalyze</span>
          </div>
          <p style={{ fontSize: 12, color: L.text3 }}>AI-powered location intelligence for Australian businesses</p>
          <div style={{ display: 'flex', gap: 18 }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact'], ['Blog', '/blog']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 12, color: L.text3, fontWeight: 500 }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}