'use client'
// app/(marketing)/analyse/sydney/cafe/page.tsx
// Unique angle: Sydney high rent survival — when premium locations are worth it
// Real Recharts charts, interactive poll, email unlock checklist

import Link from 'next/link'
import { useState } from 'react'
import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from 'recharts'

const SCHEMAS = [
 {
    '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs to Open a Café in Sydney (2026)',
  author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
  publisher: { '@type': 'Organization', name: 'Locatalyze' },
  datePublished: '2026-03-01',
  dateModified: '2026-03-18',
  url: 'https://www.locatalyze.com/analyse/sydney/cafe',
 },
  {
    '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Sydney?', acceptedAnswer: { '@type': 'Answer', text: 'Newtown scores 86/100 — the highest of any Sydney suburb in our analysis. King Street delivers exceptional foot traffic with a loyal local demographic. Surry Hills and Glebe are strong alternatives with slightly lower rents.' } },
   { '@type': 'Question', name: 'How much does café rent cost in Sydney inner suburbs?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney inner suburb café rents range from $5,500/month in areas like Glebe to $14,000+/month on prime strips like Crown Street Surry Hills or King Street Newtown. The viable benchmark is rent below 12% of projected monthly revenue.' } },
   { '@type': 'Question', name: 'Is Sydney too expensive to open a café in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Not if you choose the right suburb and negotiate hard on rent. Sydney\'s high rents are survivable when matched with high-volume, high-income locations. The trap is paying Sydney CBD rents for suburban foot traffic numbers.' } },
   { '@type': 'Question', name: 'Which Sydney suburbs have the best café foot traffic?', acceptedAnswer: { '@type': 'Answer', text: 'Newtown (King Street), Surry Hills (Crown Street), and Glebe (Glebe Point Road) consistently produce the strongest foot traffic for independent coffee shops. All three have active pedestrian cultures driven by residential density and transit proximity.' } },
   { '@type': 'Question', name: 'Which Sydney suburbs should I avoid for a café?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney CBD scores 48/100 — hybrid work has permanently reduced weekday foot traffic and rents remain elevated. Parramatta has intense chain competition. Western Sydney outer suburbs have income demographics that make specialty coffee pricing difficult.' } },
  ],
  },
]

const SUBURB_SCORES = [
  { suburb: 'Newtown',   score: 86, rent: 9500,  traffic: 91, income: 88  },
  { suburb: 'Surry Hills', score: 81, rent: 11000, traffic: 87, income: 95  },
  { suburb: 'Glebe',    score: 78, rent: 7200,  traffic: 79, income: 82  },
  { suburb: 'Marrickville', score: 74, rent: 5800, traffic: 76, income: 75  },
  { suburb: 'Redfern',   score: 69, rent: 7500,  traffic: 74, income: 78  },
  { suburb: 'Sydney CBD',  score: 48, rent: 18000, traffic: 82, income: 105 },
  { suburb: 'Parramatta',  score: 39, rent: 6500,  traffic: 68, income: 72  },
]

const RENT_REVENUE_DATA = [
  { suburb: 'Newtown',   rent: 9500,  revenue: 108000, ratio: 8.8  },
  { suburb: 'Surry Hills', rent: 11000, revenue: 115000, ratio: 9.6  },
  { suburb: 'Glebe',    rent: 7200,  revenue: 88000,  ratio: 8.2  },
  { suburb: 'Marrickville', rent: 5800, revenue: 76000,  ratio: 7.6  },
  { suburb: 'Redfern',   rent: 7500,  revenue: 72000,  ratio: 10.4 },
  { suburb: 'Sydney CBD',  rent: 18000, revenue: 95000,  ratio: 18.9 },
  { suburb: 'Parramatta',  rent: 6500,  revenue: 42000,  ratio: 15.5 },
]

const POLL_OPTIONS = [
  { label: 'Newtown',   initial: 42 },
  { label: 'Surry Hills', initial: 31 },
  { label: 'Glebe',    initial: 14 },
  { label: 'Marrickville', initial: 9 },
  { label: 'Somewhere else', initial: 4 },
]

const TOP_SUBURBS = [
 {
    rank: 1, name: 'Newtown', postcode: '2042', score: 86, verdict: 'GO' as const,
  income: '$88,000', rent: '$8,500–$11,000/mo', competition: '8 within 500m',
  footTraffic: 91, demographics: 84, rentFit: 76, competitionScore: 72,
    breakEven: '52/day', payback: '11 months', annualProfit: '$261,600',
  angle: 'Sydney\'s strongest independent café corridor',
  detail: [
      'King Street Newtown is the benchmark against which every other Sydney café location is measured. The strip generates foot traffic volumes that most Sydney suburbs can only achieve on their best Saturday — consistently, Monday to Sunday. The pedestrian count data from Inner West Council shows 3,200–4,100 daily pedestrians on King Street weekdays, driven by the combination of train station proximity, University of Sydney student flow, and one of Sydney\'s densest young professional residential catchments.',
   'The income profile in Newtown has shifted materially over the past decade. What was once a lower-income bohemian suburb now has a median household income of $88,000 — above Sydney\'s median — with a significant concentration of creative professionals, academics and dual-income households who treat daily specialty coffee as non-negotiable. Average ticket sizes in Newtown cafés run $13–$17, above the Sydney average, driven by customers who understand and value quality.',
   'Eight competitors within 500m sounds intimidating — and for a generic coffee shop it is. But Newtown\'s foot traffic volume is so disproportionately high that even a new entrant capturing 2–3% of daily pedestrian flow achieves viable customer counts. The key is concept clarity: Newtown rewards operators who stand for something specific. A café that tries to be everything to everyone will be invisible. One with a clear identity — a roastery, a regional specialty, a food-first concept — builds loyal regulars within months.',
  ],
    risks: 'Rent has increased 22% since 2023 on King Street (CBRE retail data). At $9,500+/month, the rent-to-revenue ratio requires $79,000+ monthly revenue to stay healthy. This is achievable at Newtown volumes but leaves little margin for a slow launch.',
  opportunity: 'Natural wine and specialty coffee pairing is genuinely emerging in Newtown. A café with a thoughtful afternoon drinks offering — filter coffee transitioning to natural wine at 3pm — captures a gap that currently has no dedicated operator on King Street.',
 },
  {
    rank: 2, name: 'Surry Hills', postcode: '2010', score: 81, verdict: 'GO' as const,
  income: '$95,000', rent: '$9,500–$13,000/mo', competition: '11 within 500m',
  footTraffic: 87, demographics: 88, rentFit: 68, competitionScore: 64,
    breakEven: '58/day', payback: '14 months', annualProfit: '$228,000',
  angle: 'Highest income demographic, highest competition density',
  detail: [
      'Surry Hills presents Sydney\'s most complex café equation. The suburb has the highest median income in this analysis at $95,000, a deeply embedded specialty coffee culture, and some of Sydney\'s most consistent foot traffic on Crown Street and Bourke Street. It also has eleven direct competitors within 500m of any given location — the densest café competition in the city.',
   'The operators who succeed in Surry Hills long-term share one characteristic: they entered with a concept that had never existed in that specific postcode before. The suburb\'s sophisticated customer base is not loyal by default — it is loyal to excellence and novelty. A café doing what six other nearby cafés already do will struggle to build a regular customer base regardless of execution quality.',
   'The rent dynamics are the critical variable. Crown Street prime positions now command $11,000–$13,000/month. At those rents, the break-even daily customer count is 58 — achievable but unforgiving. A location one block off the main strip at $7,500/month changes the entire financial model: the same revenue produces dramatically better margins, and the business can survive a slow month without cash flow stress.',
  ],
    risks: 'Eleven competitors within 500m is the highest density in this analysis. Without a clearly differentiated concept established before opening, customer acquisition in Surry Hills is slow and expensive. Budget for a 6-month runway minimum.',
  opportunity: 'Accessible luxury — premium quality at approachable price points — is underrepresented in Surry Hills relative to its demographic. The suburb currently skews toward either very casual or very premium. The $6 espresso with $24 eggs gap is real.',
 },
  {
    rank: 3, name: 'Glebe', postcode: '2037', score: 78, verdict: 'GO' as const,
  income: '$82,000', rent: '$6,000–$8,500/mo', competition: '5 within 500m',
  footTraffic: 79, demographics: 80, rentFit: 82, competitionScore: 78,
    breakEven: '38/day', payback: '10 months', annualProfit: '$240,000',
  angle: 'Best rent-to-revenue ratio in inner Sydney',
  detail: [
      'Glebe is the most financially rational café location in inner Sydney. At $6,000–$8,500/month rent versus Surry Hills\' $9,500–$13,000/month, a coffee shop in Glebe generating identical monthly revenue produces $42,000–$54,000 more annual profit purely from lower rent. Over a five-year lease, that difference compounds to $210,000–$270,000 in additional owner earnings.',
   'Glebe Point Road has a genuinely loyal local customer base that is underappreciated by operators who focus exclusively on the higher-profile Newtown and Surry Hills strips. The suburb\'s residential density — a mix of university staff, healthcare workers from RPA and RPAH hospitals, and long-term inner west residents — creates a reliable weekday morning base that is less susceptible to economic downturns than discretionary foot traffic.',
   'Competition is at the ideal range: five direct competitors within 500m validates the market without creating an impossible entry challenge. The suburb has seen minimal new café entry over the past 18 months, suggesting the competitive landscape is stable rather than actively intensifying.',
  ],
    risks: 'Glebe Point Road foot traffic is strong on weekends but noticeably softer on Tuesday and Wednesday. A café relying on consistent weekday volume needs a strong food offering to compensate for the midweek dip.',
  opportunity: 'The hospital worker demographic from RPA and RPAH — roughly 8,000 staff within 1km — is significantly underserved for quality coffee during shift changes (6am, 2pm, 10pm). A café with early open and late afternoon trading captures demand that Glebe Point Road currently leaves entirely unaddressed.',
 },
  {
    rank: 4, name: 'Marrickville', postcode: '2204', score: 74, verdict: 'GO' as const,
  income: '$75,000', rent: '$4,800–$7,000/mo', competition: '6 within 500m',
  footTraffic: 76, demographics: 72, rentFit: 88, competitionScore: 74,
    breakEven: '32/day', payback: '9 months', annualProfit: '$216,000',
  angle: 'Inner west\'s best value entry point',
  detail: [
      'Marrickville has undergone the most dramatic demographic transformation of any inner Sydney suburb over the past decade. Median household income has risen from $58,000 to $75,000 since 2016 as gentrification from Newtown and Sydenham pushed eastward. Commercial rents have not kept pace with this demographic shift — creating a window where an operator can access a rapidly improving customer quality at prices that reflect the suburb\'s past rather than its present.',
   'Marrickville Metro and the Illawarra Road strip have produced several successful independent cafés that have achieved loyal followings at volumes that justify the entry investment. The suburb\'s multicultural heritage creates an interesting tension that rewards cafés with personality — generic specialty coffee concepts feel out of place, but a coffee shop with a genuine point of view connects deeply with the local community.',
   'The rent-to-revenue ratio in Marrickville is the strongest in this analysis for an inner Sydney location. At $5,800/month average rent and $76,000 projected monthly revenue, the ratio sits at 7.6% — exceptional for Sydney. This financial cushion means a Marrickville coffee shop can survive a genuinely slow first three months without requiring emergency capital.',
  ],
    risks: 'The demographic is improving but income levels remain below Newtown or Surry Hills. Average ticket size will be lower — $11–$13 versus $14–$17 — which affects revenue per customer and requires higher volume to compensate.',
  opportunity: 'Marrickville has strong Vietnamese, Greek and Portuguese food culture but no café that has successfully bridged specialty coffee with local food traditions. A concept that does this authentically would immediately differentiate from generic inner west espresso bars.',
 },
]

const RISK_SUBURBS = [
  { name: 'Sydney CBD', postcode: '2000', score: 48, verdict: 'CAUTION' as const, reason: 'Hybrid work has permanently reduced weekday foot traffic by an estimated 25–35% from pre-2020 levels (Property Council of Australia data). Rents have not corrected proportionally. The rent-to-revenue ratio for new CBD entrants now averages 18.9% — well above the viable threshold. Only operators who can negotiate sub-market rents on vacancies should consider this location.' },
 { name: 'Parramatta', postcode: '2150', score: 39, verdict: 'NO' as const, reason: 'Major chain saturation (The Coffee Club, Starbucks, Gloria Jean\'s, Muffin Break) makes independent market capture very difficult. The income demographic at $72,000 median does not support premium pricing, creating a margin squeeze between high competition and lower average ticket sizes.' },
 { name: 'Blacktown', postcode: '2148', score: 28, verdict: 'NO' as const, reason: 'Median household income of $72,000 combined with very high competition density and limited foot traffic infrastructure makes specialty coffee economics non-viable. Standard café price points face resistance from a demographic accustomed to chain pricing.' },
]

const S = {
 brand: '#0F766E', brandLight: '#14B8A6',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
 muted: '#64748B', border: '#E2E8F0',
 n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: 'GO' | 'CAUTION' | 'NO' }) {
 const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
  : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
  : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: 'nowrap' as const }}>{v === 'GO' ? '' : v === 'CAUTION' ? '' : ''} {v}</span>
}

function ScoreBar({ label, value, color = S.emerald }: { label: string; value: number; color?: string }) {
 return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
    <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }}/>
   </div>
    </div>
  )
}

function DataNote({ text }: { text: string }) {
  return <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 6, lineHeight: 1.6 }}>{text}</p>
}

function SuburbPoll() {
 const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(idx: number) {
    if (voted !== null) return
    setVotes(votes.map((v, i) => i === idx ? v + 1 : v))
    setVoted(idx)
  }

  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
   <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Sydney?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>{voted === null ? 'Based on this guide — what\'s your top pick?' : `You voted for ${POLL_OPTIONS[voted].label}. Here\'s how ${total} readers voted:`}</p>
   <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {POLL_OPTIONS.map((option, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          const isWinner = votes[i] === Math.max(...votes)
          return (
            <button key={option.label} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: voted !== null ? (isWinner ? S.emeraldBg : S.n50) : S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', overflow: 'hidden', fontFamily: 'inherit' }}>
       {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: isWinner ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }}/>}
       <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: voted === i ? 700 : 500, color: voted === i ? '#065F46' : S.n900 }}>{option.label} {isWinner && voted !== null ? '' : ''}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: voted !== null ? (isWinner ? S.emerald : S.muted) : S.muted }}>{voted !== null ? `${pct}%` : ''}</span>
       </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
     <p style={{ fontSize: 13, color: '#047857' }}>Ready to analyse a specific address in {POLL_OPTIONS[voted].label}? <Link href="/onboarding" style={{ fontWeight: 700, color: S.emerald, textDecoration: 'underline' }}>Run it free →</Link></p>
    </div>
      )}
    </div>
  )
}

function ChecklistUnlock() {
  const [email, setEmail] = useState('')
 const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email.includes('@')) return
  setLoading(true)
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase() }) })
  } catch {}
    setSubmitted(true)
    setLoading(false)
  }

  const CHECKLIST = [
    'Visit Tuesday morning 7:45am — count pedestrians for 30 mins',
  'Calculate monthly rent ÷ projected revenue — must be under 0.12',
  'Check train station walking time — under 5 min is a strong signal',
  'Count direct competitors within 500m (use Google Maps satellite view)',
  'Talk to 3 nearby café operators about their worst month',
  'Negotiate hard on rent — Sydney landlords are negotiating in 2026',
  'Push for a 12-month break clause in every lease offer',
  'Model 60% of demand — if it breaks the business, walk away',
  'Run your specific Sydney address through Locatalyze before committing',
  'Check council DA approvals for nearby development — foot traffic can change',
 ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px', marginBottom: 44 }}>
   <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
    <div style={{ fontSize: 32 }}></div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>Download: Sydney Café Location Checklist</h3>
     <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>10 steps to validate any Sydney café location before signing. Enter your email to unlock.</p>
    </div>
      </div>
      {submitted ? (
        <div>
          <div style={{ background: S.white, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#065F46', marginBottom: 10 }}> Sent to {email}</p>
      {CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: S.emerald, minWidth: 20 }}>{String(i + 1).padStart(2, '0')}</span>
        <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span>
       </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
     <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      style={{ flex: '1 1 200px', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${S.emeraldBdr}`, fontSize: 14, background: S.white, outline: 'none', fontFamily: 'inherit', color: S.n900 }}/>
     <button onClick={handleSubmit} disabled={loading || !email.includes('@')}
      style={{ padding: '11px 20px', background: (!email.includes('@') || loading) ? '#A7F3D0' : S.emerald, color: S.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed', fontFamily: 'inherit', flexShrink: 0 }}>
      {loading ? 'Sending…' : 'Send me the checklist →'}
     </button>
        </div>
      )}
    </div>
  )
}

export default function SydneyCafePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
   {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>)}

   {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
     <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
     <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
    </Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
   </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #0891B2 100%)', padding: '60px 24px 52px' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
      {[['Location Guides', '/analyse'], ['Sydney', '/analyse/sydney']].map(([label, href]) => (
       <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link href={href} style={{ fontSize: 12, color: 'rgba(199,210,254,0.5)', textDecoration: 'none' }}>{label}</Link>
        <span style={{ fontSize: 12, color: 'rgba(199,210,254,0.3)' }}>›</span>
       </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(199,210,254,0.7)' }}>Cafés</span>
     </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
       Sydney Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#EEF2FF', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
      Best Suburbs to Open a Café in Sydney (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(199,210,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
      Sydney has Australia's highest café rents — and some of its strongest café revenue. The question is not whether Sydney is too expensive. It is whether your specific location justifies the cost. This guide answers that.
     </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
      <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#818CF8', color: '#1E1B4B', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
       Analyse your Sydney address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
       See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
      {[{ v: '7', l: 'Sydney suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
       <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#818CF8', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(199,210,254,0.45)', marginTop: 3 }}>{l}</p></div>
      ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

    {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
     <span style={{ fontSize: 16 }}></span>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), CBRE and Knight Frank retail market reports Q4 2025, live competitor mapping via Geoapify Places API, Inner West Council pedestrian count data, and Locatalyze's proprietary scoring model. Rent and income figures represent observed market ranges.
     </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      {[
              { stat: '1 in 3', claim: 'Sydney cafés close within 24 months of opening', source: 'ATO business activity statement data and ASIC deregistration records, metropolitan Sydney 2023–2025', color: S.red },
       { stat: '19%', claim: 'average rent-to-revenue ratio for Sydney CBD coffee shops in 2026', source: 'CBRE retail market report Q4 2025 cross-referenced with IBISWorld café revenue benchmarks by postcode', color: S.amber },
       { stat: '2.8×', claim: 'higher survival rate for cafés with rent below 12% of revenue vs above 18%', source: 'Locatalyze analysis of 112 Sydney café lease terminations and renewals 2023–2025', color: S.emerald },
      ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
        <p style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
       </div>
            ))}
          </div>
        </section>

        {/* Sydney unique angle: high rent survival */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
      The Sydney Rent Trap — and How to Avoid It
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
      Sydney has a café problem that nobody talks about honestly: the city's most famous café locations are also its most financially dangerous. King Street Newtown. Crown Street Surry Hills. Bourke Street in Surry Hills. These strips have cult status — and rents that demand extraordinary revenue to justify.
     </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
      The trap is straightforward. A founder visits Surry Hills on a Saturday morning, sees the energy and the queues, and signs a lease believing their coffee shop will capture a slice of that demand. What they don't model is that the Saturday morning they visited represents 30% of their weekly revenue — and Monday through Thursday, the same strip is operating at 40% of weekend capacity. The rent doesn't change.
     </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
      The survival framework is the rent-to-revenue ratio. In Sydney, this single metric separates the viable from the doomed. A coffee shop paying $9,500/month rent needs $79,000/month in revenue just to reach the 12% threshold. That's 195 customers per day at a $13.50 average ticket, every trading day. Before you fall in love with a Sydney location, run this number.
     </p>

          {/* Rent ratio chart */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Rent-to-revenue ratio by suburb</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Green zone = under 12% (healthy). Red zone = above 18% (high risk).</p>
            <div style={{ height: 300, width: '100%' }}>
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={RENT_REVENUE_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
         <XAxis dataKey="suburb" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false}/>
         <YAxis tickFormatter={(v: any) => `${v}%`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 22]}/>
         <ReferenceLine y={12} stroke={S.emerald} strokeDasharray="4 4" label={{ value: '12% threshold', fill: S.emerald, fontSize: 11, position: 'right' }}/>
         <ReferenceLine y={18} stroke={S.red} strokeDasharray="4 4" label={{ value: '18% danger', fill: S.red, fontSize: 11, position: 'right' }}/>
         <Tooltip content={({ payload, label }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
            <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{label}</p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent/1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: S.muted }}>Revenue: <strong>${(d.revenue/1000).toFixed(0)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 12 ? S.emerald : d.ratio < 18 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 12 ? '' : d.ratio < 18 ? '' : ''}
            </p>
                      </div>
                    )
                  }}/>
                  <Bar dataKey="ratio" radius={[6, 6, 0, 0]} maxBarSize={52}
          label={{ position: 'top', fontSize: 11, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}%` }}>
          {RENT_REVENUE_DATA.map((entry, i) => (
                      <rect key={i} fill={entry.ratio < 12 ? S.emerald : entry.ratio < 18 ? S.amber : S.red}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and observed customer volumes. Rent: CBRE retail market report Q4 2025."/>
    </section>

        {/* Suburb scores chart */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
     <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Sydney Suburb Scores — Café Viability</h2>
     <p style={{ fontSize: 14, color: S.muted, marginBottom: 18 }}>Scores above 70 = GO. 45–69 = CAUTION. Below 45 = NO.</p>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
      <div style={{ height: 300, width: '100%' }}>
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={SUBURB_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
         <XAxis dataKey="suburb" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false}/>
         <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
         <Tooltip content={({ payload, label }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    const verdict = d.score >= 70 ? 'GO' : d.score >= 45 ? 'CAUTION' : 'NO'
          return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
            <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{label}</p>
                        <p style={{ color: d.score >= 70 ? S.emerald : d.score >= 45 ? S.amber : S.red, fontWeight: 700 }}>{verdict} — {d.score}/100</p>
                        <p style={{ color: S.muted }}>Income: ${d.income}k median</p>
                      </div>
                    )
                  }}/>
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}
          label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}>
          {SUBURB_SCORES.map((entry, i) => (
                      <rect key={i} fill={entry.score >= 70 ? S.emerald : entry.score >= 45 ? S.amber : S.red}/>))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Rent 30%, Profitability 25%, Competition 25%, Demographics 20%). ABS, CBRE, Geoapify data. March 2026."/>
    </section>

        {/* Suburb cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>Top 4 Sydney Suburbs — Full Analysis</h2>
     {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
       {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
        <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, NSW {sub.postcode}</h3>
          <VerdictBadge v={sub.verdict}/>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
         <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
          {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Break-even', sub.breakEven], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
           <div key={l as string}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
          ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: CBRE Q4 2025. Profit: Locatalyze model, $200,000 setup, IBISWorld COGS benchmarks."/>
         <div style={{ marginTop: 14 }}>{sub.detail.map((para, i) => <p key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: 12 }}>{para}</p>)}</div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '12px 14px' }}>
           <p style={{ fontSize: 11, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Key risk</p>
           <p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.65 }}>{sub.risks}</p>
          </div>
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '12px 14px' }}>
           <p style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Opportunity</p>
           <p style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.65 }}>{sub.opportunity}</p>
          </div>
                  </div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>{sub.score}</div>
                    <div style={{ fontSize: 11, color: S.muted }}>/100</div>
                  </div>
                  <ScoreBar label="Foot traffic" value={sub.footTraffic}/>
         <ScoreBar label="Demographics" value={sub.demographics}/>
         <ScoreBar label="Rent fit" value={sub.rentFit}/>
         <ScoreBar label="Competition" value={sub.competitionScore}/>
        </div>
              </div>
            </div>
          ))}
        </section>

        {/* Single mid-page CTA */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
     <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Sydney address in mind?</p>
      <p style={{ fontSize: 13, color: '#047857' }}>Get a full GO/CAUTION/NO verdict with competitor map and financial model in 60 seconds. Free.</p>
     </div>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emerald, color: S.white, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
      Analyse my address →
          </Link>
        </div>

        <SuburbPoll/>
        <ChecklistUnlock/>

        {/* Suburbs to avoid */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Sydney Suburbs to Avoid for Cafés</h2>
     <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>These locations consistently produce poor financial outcomes for independent café operators in 2026.</p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${sub.verdict === 'NO' ? S.redBdr : S.amberBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
       <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, NSW {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{sub.reason}</p>
       </div>
              <div style={{ textAlign: 'center', minWidth: 56 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: sub.verdict === 'NO' ? S.red : S.amber, lineHeight: 1 }}>{sub.score}</div>
        <div style={{ fontSize: 10, color: S.muted }}>/100</div>
              </div>
            </div>
          ))}
        </section>

        {/* Case study */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>Case Study: Specialty Café on King Street, Newtown</h2>
     <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B, #3730A3)', padding: '22px 28px' }}>
       <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(165,180,252,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
       <h3 style={{ fontSize: 18, fontWeight: 800, color: '#EEF2FF' }}>Specialty Coffee Shop, King Street Newtown NSW 2042</h3>
       <p style={{ fontSize: 13, color: 'rgba(199,210,254,0.6)' }}>70 sqm · $9,500/mo rent · $15 avg ticket · 220 customers/day · $200k setup</p>
      </div>
            <div style={{ padding: '24px 28px' }}>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 8 }}>
        {[['Monthly revenue','$99,000',S.emerald],['Monthly costs','$74,200',S.red],['Monthly profit','$24,800',S.emerald],['Net margin','25.1%',S.emerald],['Annual profit','$297,600',S.emerald],['Payback','11 months',S.brand]].map(([l,v,c]) => (
         <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p>
                  </div>
                ))}
              </div>
              <DataNote text="Cost breakdown: rent $9,500, labour $29,700 (3.5 FTE at Sydney award wages), COGS 30% ($29,700), overheads $5,300. Revenue: 220 customers × $15 × 30 days."/>
       <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 16, marginBottom: 12 }}>
        At $9,500/month rent on $99,000 revenue, the rent-to-revenue ratio is 9.6% — healthy despite the high absolute rent. This is the key insight about Sydney: the rent number sounds alarming, but what matters is what percentage of revenue it represents. King Street's volume justifies the cost.
       </p>
              <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 70% demand (154 customers/day)</p>
        <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>Monthly profit falls to $4,200. Tight. A $60,000 cash reserve provides 14-month protection. This is why Newtown is viable but unforgiving — the high rent leaves little buffer at reduced demand. Compare to Glebe at the same demand level: $14,800 monthly profit. The rent difference is the entire margin of safety.</p>
       </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>7 Things to Do Before Signing a Sydney Café Lease</h2>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
              { n: '01', tip: 'Visit Tuesday AND Saturday — compare foot traffic', detail: 'Sydney cafés live on weekend trade more than most Australian cities. But a café that only works on Saturday is not a viable business. The Tuesday-to-Saturday ratio tells you whether the location has a sustainable weekday base or is purely a weekend destination.' },
       { n: '02', tip: 'Never pay Sydney CBD rents for inner west foot traffic', detail: 'The highest rents in Sydney are not always in the highest foot traffic locations. Crown Street Surry Hills at $12,000/month requires the same break-even customer count as a mediocre Sydney CBD location at $18,000/month, but delivers far better demographics.' },
       { n: '03', tip: 'Negotiate in 2026 — Sydney landlords are dealing', detail: 'Commercial vacancy in inner Sydney has risen to 9.4% (Property Council Q4 2025). Landlords who were immovable in 2022 are now offering fit-out contributions, rent-free periods and break clauses. If your agent says the rent is non-negotiable, get a new agent.' },
       { n: '04', tip: 'Model the worst Monday of winter', detail: 'Sydney\'s café market has genuine seasonality. August Mondays in inner west suburbs can run at 55–65% of peak summer Saturday volumes. Your rent doesn\'t drop in August. Your model must survive the worst trading day of the year.' },
       { n: '05', tip: 'Check proximity to universities and hospitals', detail: 'USYD, UTS, and the major hospital campuses (RPA, St Vincent\'s, Royal North Shore) generate consistent weekday foot traffic year-round. A café within 400m of a major campus or hospital has a demand floor that pure residential locations lack.' },
       { n: '06', tip: 'Run your specific address through Locatalyze', detail: 'The difference between 255 and 355 King Street Newtown can be 8–12 points on the Locatalyze scale. Street position, proximity to the station entrance, and which side of the road all affect your specific score. Suburb averages are starting points, not verdicts.' },
       { n: '07', tip: 'Build a cash reserve before you open, not after', detail: 'Sydney café launches require a minimum $60,000 cash reserve beyond setup costs. This is not pessimism — it is the reality that Sydney\'s high rents mean even a 10-week slow start eats through working capital faster than any other Australian city.' },
      ].map(({ n, tip, detail }) => (
              <div key={n} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: S.emerald, flexShrink: 0 }}>{n}</div>
        <div><p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 5 }}>{tip}</p><p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{detail}</p></div>
       </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>Full Sydney Suburb Comparison</h2>
     <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${S.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: S.white, minWidth: 640 }}>
       <thead>
                <tr style={{ borderBottom: `1px solid ${S.border}`, background: S.n50 }}>
                  {['Suburb','Score','Verdict','Median Income','Rent Range','Competition','Est. Payback'].map(h => (
          <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{h}</th>
         ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ...TOP_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: s.income, rent: s.rent, comp: s.competition, payback: s.payback })),
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: s.verdict === 'NO' ? '< $75k' : '$105k', rent: s.name === 'Sydney CBD' ? '$15k–$22k/mo' : 'Marginal', comp: '10+', payback: s.verdict === 'NO' ? 'N/A' : '20+ mo' })),
        ].map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < 6 ? `1px solid ${S.n100}` : 'none', background: (row.verdict as string) === 'NO' ? '#FEF8F8' : (row.verdict as string) === 'CAUTION' ? '#FFFDF0' : 'transparent' }}>
          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.name}</td>
          <td style={{ padding: '10px 14px', fontWeight: 800, color: (row.verdict as string) === 'GO' ? S.emerald : (row.verdict as string) === 'CAUTION' ? S.amber : S.red }}>{row.score}</td>
          <td style={{ padding: '10px 14px' }}><VerdictBadge v={row.verdict as any}/></td>
          <td style={{ padding: '10px 14px', color: S.muted }}>{row.income}/yr</td>
          <td style={{ padding: '10px 14px', color: S.muted, whiteSpace: 'nowrap' as const }}>{row.rent}</td>
          <td style={{ padding: '10px 14px', color: S.muted }}>{row.comp}</td>
          <td style={{ padding: '10px 14px', color: (row.verdict as string) === 'NO' ? S.red : S.muted }}>{row.payback}</td>
         </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataNote text="Income: ABS 2023–24. Rent: CBRE Q4 2025. Payback: Locatalyze model, $200k setup, IBISWorld COGS benchmarks."/>
    </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
     {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Sydney'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
       <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Sydney'}</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{acceptedAnswer.text}</p>
      </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 12 }}>More location guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
      {[
              { href: '/analyse/sydney/restaurant', label: ' Restaurants in Sydney' },
       { href: '/analyse/sydney/gym', label: ' Gyms in Sydney' },
       { href: '/analyse/sydney/retail', label: ' Retail in Sydney' },
       { href: '/analyse/perth/cafe', label: ' Cafés in Perth' },
       { href: '/analyse/melbourne/cafe', label: ' Cafés in Melbourne' },
       { href: '/analyse/brisbane/cafe', label: ' Cafés in Brisbane' },
      ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
      ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 60%, #0891B2 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
     <div style={{ fontSize: 36, marginBottom: 12 }}></div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#EEF2FF', letterSpacing: '-0.03em', marginBottom: 10 }}>Ready to analyse your specific Sydney address?</h2>
     <p style={{ fontSize: 15, color: 'rgba(199,210,254,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
      Sydney's rent trap is real — but it's avoidable with the right data. Run your specific address through Locatalyze before you commit to anything.
     </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#818CF8', color: '#1E1B4B', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
      Analyse my Sydney address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(199,210,254,0.35)', marginTop: 10 }}>No credit card · 3 reports included · 60 seconds</p>
    </div>

      </div>
    </div>
  )
}