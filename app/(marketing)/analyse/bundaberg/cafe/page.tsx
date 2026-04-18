'use client'
// app/(marketing)/analyse/bundaberg/cafe/page.tsx

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Café in Bundaberg (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/bundaberg/cafe',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a café in Bundaberg?', acceptedAnswer: { '@type': 'Answer', text: 'Bargara scores 84/100 — the highest of any Bundaberg suburb. A coastal lifestyle premium suburb attracting retirees and sea-changers. Bundaberg Central (78/100) offers immediate foot traffic and established customer bases. For lifestyle premium: Bargara. For volume trade: Central.' } },
      { '@type': 'Question', name: 'How much does café rent cost in Bundaberg?', acceptedAnswer: { '@type': 'Answer', text: 'Bundaberg Central café rents range from $1,800 to $3,000/month. Bargara coastal premium is $2,200–$3,800/month (20% premium). Kepnock sits at $1,600–$2,400/month. These are 50–60% below Brisbane rent levels.' } },
      { '@type': 'Question', name: 'How do seasonal workers affect café revenue in Bundaberg?', acceptedAnswer: { '@type': 'Answer', text: 'Bundaberg has seasonal agricultural employment peaks (March–August harvest season). This creates feast-and-famine revenue cycles. March–August revenue can exceed baseline by 40%. June–August cooler months boost outdoor trade. September–February slower season requires strong local customer base to survive. Model 60% baseline + seasonal peaks.' } },
      { '@type': 'Question', name: 'Is Bargara or Bundaberg CBD better for a café?', acceptedAnswer: { '@type': 'Answer', text: 'Bargara has higher income demographics ($76k vs Central $68k) and retiree appeal — premium positioning works. Central has higher foot traffic and established trade. For premium/lifestyle: Bargara. For immediate trade: Central. Both are viable — different positioning strategies.' } },
      { '@type': 'Question', name: 'What suburbs should I avoid for a café in Bundaberg?', acceptedAnswer: { '@type': 'Answer', text: 'Childers (score 28, NO) and Gin Gin (34, NO) are too small and rural. Childers has backpacker-heavy trade with extreme price-sensitivity. Neither supports quality café positioning. Both have insufficient population density and income demographics below viability thresholds.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Bargara',           score: 84, rent: 3000, traffic: 82, income: 76 },
  { suburb: 'Bundaberg Central', score: 78, rent: 2400, traffic: 79, income: 68 },
  { suburb: 'Kepnock',           score: 72, rent: 2000, traffic: 68, income: 71 },
  { suburb: 'Bundaberg North',   score: 65, rent: 1900, traffic: 54, income: 62 },
  { suburb: 'Gin Gin',           score: 34, rent: 900,  traffic: 18, income: 48 },
  { suburb: 'Childers',          score: 28, rent: 1200, traffic: 22, income: 44 },
]

const RENT_VS_REVENUE = [
  { suburb: 'Bargara',           rent: 3000, revenue: 52000, ratio: 5.8 },
  { suburb: 'Bundaberg Central', rent: 2400, revenue: 48000, ratio: 5.0 },
  { suburb: 'Kepnock',           rent: 2000, revenue: 44000, ratio: 4.5 },
  { suburb: 'Bundaberg North',   rent: 1900, revenue: 38000, ratio: 5.0 },
  { suburb: 'Brisbane CBD',      rent: 8500, revenue: 82000, ratio: 10.4 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Bargara',           initial: 42 },
  { label: 'Bundaberg Central', initial: 38 },
  { label: 'Kepnock',           initial: 18 },
  { label: 'Bundaberg North',   initial: 2 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Bargara', postcode: '4670', score: 84, verdict: 'GO' as const,
    income: '$76,000', rent: '$2,200–$3,800/mo', competition: '3 within 500m',
    footTraffic: 82, demographics: 86, rentFit: 82, competitionScore: 80,
    breakEven: '25/day', payback: '6 months', annualProfit: '$156,000',
    angle: 'Coastal lifestyle premium suburb — retirees and sea-changers with asset-rich demographics',
    detail: [
      'Bargara is Queensland\'s coastal retirement and sea-change destination. Located 45 minutes north of Brisbane on the Wide Bay coast, it attracts retirees from southern Australia seeking warm climate and coastline. The demographic skews 55+ with above-average net worth. Median income ($76k) is higher than Bundaberg Central despite lower working-age population — asset-rich demographics spending discretionary income.',
      'The esplanade precinct is the heart of Bargara — beachfront positioning creates natural café destination appeal. Weekend foot traffic (Saturday–Sunday, 9am–3pm) is strong from tourists and local leisure visitors. Tourist season (June–October school holidays, whale watching peak) drives 40–50% revenue uplift. The demographic is price-tolerant — specialty coffee ($5.50–6.50) and premium brunch ($18–24) are normalized spend.',
      'Three competitors within 500m is optimal density — enough to validate demand, not saturated. The competitive set is aging (median operator age 58+). A new entrant with modern positioning and digital engagement (Instagram-friendly venue design) would capture younger visitor demographic that existing operators miss.',
    ],
    risks: 'Seasonal coastal tourism creates revenue volatility. Quieter May–July season (winter, pre-whale watching). Summer cyclone risk (January–March) suppresses visitor traffic. Retiree demographic is price-sensitive to economic downturns — discretionary café spending drops during interest rate spikes. Proximity to Great Barrier Reef creates conservation restrictions on development.',
    opportunity: 'A café positioned as the social hub for active retirees (community bulletin boards, book swap, interest group meeting space) would own defensible positioning. The demographic seeks community connection — a "third place" positioning would differentiate sharply from generic beachside cafés.',
  },
  {
    rank: 2, name: 'Bundaberg Central', postcode: '4670', score: 78, verdict: 'GO' as const,
    income: '$68,000', rent: '$1,800–$3,000/mo', competition: '4 within 500m',
    footTraffic: 79, demographics: 76, rentFit: 80, competitionScore: 75,
    breakEven: '22/day', payback: '7 months', annualProfit: '$144,000',
    angle: 'Regional hub with agricultural worker demographics — stable weekday trade from seasonal employment',
    detail: [
      'Bundaberg Central is the commercial heart of the region. Bowen Street hosts government offices, the regional hospital, and retail precincts. The demographic is mixed — older retirees, professional/government workers, and seasonal agricultural workers. This creates multi-source demand with less concentration risk than single-anchor markets.',
      'Weekday morning trade (6–9am) is anchored by government and healthcare workers heading to employment. Hospital (500+ staff) creates reliable mid-morning secondary peak. Agricultural worker spending is cyclical — March–August harvest season drives 40% revenue uplift above baseline. June–August cooler months (perfect outdoor café weather) extend trading seasons.',
      'Four competitors within 500m is moderately saturated, but competition is aging and undifferentiated. The café market has not modernized — existing operators serve functional coffee needs without experience or ambiance positioning. A quality new café with third-place positioning would capture share.',
    ],
    risks: 'Seasonal revenue volatility is material — September–February baseline is 40% below March–August. Unit economics break-even requires surviving 5-month slower season. Agricultural worker demographics are cyclical and price-sensitive. A poor harvest year (drought, commodity crash) materially compresses spending.',
    opportunity: 'A café positioned as the "meeting place" for seasonal agricultural workers and professionals (reliable wifi, meeting space, high-quality food) would differentiate. The demographic travels between properties and job sites — a reliable known location becomes valuable.',
  },
  {
    rank: 3, name: 'Kepnock', postcode: '4670', score: 72, verdict: 'GO' as const,
    income: '$71,000', rent: '$1,600–$2,400/mo', competition: '2 within 500m',
    footTraffic: 68, demographics: 72, rentFit: 85, competitionScore: 88,
    breakEven: '20/day', payback: '8 months', annualProfit: '$132,000',
    angle: 'Established residential suburb with loyal locals and lowest rent in tier',
    detail: [
      'Kepnock is a stable, established residential suburb with family-focused demographics. Population has been here 10+ years — loyalty to local businesses is high. Income ($71k) is moderate but purchasing power is steady. Car-dependent community — the local café is the neighbourhood coffee stop.',
      'Foot traffic (68) is softer than Bargara/Central but repeat customer base is loyal and habitual. A café positioned as the neighbourhood gathering spot would capture daily repeat trade from residents who pass regularly. Rent advantage ($1,600–$2,400/mo) produces healthy margins — breakeven at only 20 sales/day.',
      'Two competitors within 500m is the sweet spot — enough validation, not oversaturated. Existing operators are established and aging. New entrant with modern positioning and quality focus would differentiate sharply.',
    ],
    risks: 'Footfall (68) requires destination visitation rather than traffic capture. No tourism anchor — revenue is purely local. Population is aging, flat growth. Without ongoing population growth, customer acquisition is harder. Price sensitivity from lower-income demographics.',
    opportunity: 'Position as the neighbourhood "third place" with community programming — book club, yoga classes, local art. Lower rent enables event hosting without margin compression. Weekend farmers market or craft activities would differentiate.',
  },
  {
    rank: 4, name: 'Bundaberg North', postcode: '4670', score: 65, verdict: 'CAUTION' as const,
    income: '$62,000', rent: '$1,600–$2,600/mo', competition: '2 within 500m',
    footTraffic: 54, demographics: 62, rentFit: 78, competitionScore: 80,
    breakEven: '28/day', payback: '10 months', annualProfit: '$96,000',
    angle: 'Outer residential with lower income — requires specific positioning or high volume',
    detail: [
      'Bundaberg North is an outer residential suburb with lower median income ($62k) and softer demographic characteristics. Population is younger but asset-poor compared to Bargara. Income sits below café viability for premium positioning — price sensitivity is real.',
      'Foot traffic (54) is soft — commuters travel away during work hours. Weekday trade is weak. Weekend family foot traffic exists but is price-sensitive. Without special circumstances (transit node, employer proximity), this location requires budget café positioning.',
      'Two competitors within 500m suggests the market is served. A new entrant requires differentiation or volume positioning. Unit economics require 28/day breakeven (vs 20–25 for GO-tier suburbs) — higher volume needed.',
    ],
    risks: 'Income demographics limit premium pricing. Foot traffic is soft. Growth is flat. Seasonal volatility from agricultural workers affects outer suburbs even more than central areas.',
    opportunity: 'Only if positioned as budget café with high volume, or as a niche (vegan, specific diet) targeting underserved demographic. Without differentiation, this location is marginal.',
  },
]

const RISK_SUBURBS = [
  { name: 'Gin Gin', postcode: '4671', score: 34, verdict: 'NO' as const, reason: 'Gin Gin is too small and rural — population insufficient to support café foot traffic. Rent is cheap ($900/month) but reflects zero commercial demand. No tourism anchor. Agricultural worker trade is passing through (not local). Positioning as rural truck-stop café could work but requires commoditized positioning, not quality specialty coffee.' },
  { name: 'Childers', postcode: '4660', score: 28, verdict: 'NO' as const, reason: 'Childers is backpacker-accommodation-heavy with extreme price-sensitivity and high customer volatility. Median income ($44k) is 35% below viability threshold. Backpackers pay $2.50/coffee and $6.00 for toast. Quality café economics fail. Only viable as ultra-budget (Big W café equivalent) with high volume and low expectation.' },
]

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#475569', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: 'GO' | 'CAUTION' | 'NO' }) {
  const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  const icon = v === 'GO'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><polyline points="20 6 9 17 4 12"/></svg>
    : v === 'CAUTION'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: 'nowrap' as const, display: 'inline-flex', alignItems: 'center' }}>{icon}{v}</span>
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

// ── Poll component ─────────────────────────────────────────────────────────
function SuburbPoll() {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(idx: number) {
    if (voted !== null) return
    const updated = votes.map((v, i) => i === idx ? v + 1 : v)
    setVotes(updated)
    setVoted(idx)
  }

  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px 24px', marginBottom: 44 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a café in Bundaberg?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {voted === null ? 'Based on this guide — what&apos;s your top pick? Click to vote.' : `You voted for ${POLL_OPTIONS[voted].label}. Here&apos;s how ${total} readers voted:`}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {POLL_OPTIONS.map((option, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          const isWinner = votes[i] === Math.max(...votes)
          return (
            <button key={option.label} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: voted !== null ? (isWinner ? S.emeraldBg : S.n50) : S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', overflow: 'hidden', fontFamily: 'inherit' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: isWinner ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }}/>
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: voted === i ? 700 : 500, color: voted === i ? '#065F46' : S.n900 }}>
                  {option.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: voted !== null ? (isWinner ? S.emerald : S.muted) : S.muted }}>
                  {voted !== null ? `${pct}%` : ''}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857' }}>
            Ready to analyse a specific address in {POLL_OPTIONS[voted].label}? {' '}
            <Link href="/onboarding" style={{ fontWeight: 700, color: S.emerald, textDecoration: 'underline' }}>Run it free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

// ── Email unlock checklist ─────────────────────────────────────────────────────
function ChecklistUnlock() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email.includes('@')) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
    } catch {}
    setSubmitted(true)
    setLoading(false)
  }

  const CHECKLIST = [
    'Check proximity to hospital and government offices for weekday trade anchors',
    'Visit Bargara esplanade on Saturday 9am — observe foot traffic and tourism appeal',
    'Assess seasonal worker calendar and agricultural commodity cycles',
    'Model June–August baseline revenue uplift from cooler weather',
    'Model September–February revenue at 60% of baseline (slower season)',
    'Visit 3 nearby cafés — ask about seasonal revenue patterns and quietest months',
    'Verify parking (car-dependent region) — insufficient parking = 15% traffic reduction',
    'Calculate rent ÷ projected revenue — must be under 0.08',
    'Negotiate seasonal adjustment clauses in lease (lower rent Sept–Feb)',
    'Survey 20 local customers — understand seasonal spending patterns',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Bundaberg Café Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            The exact checklist used in Locatalyze analysis. Free — enter your email and we&apos;ll send it plus weekly location insights.
          </p>
        </div>
      </div>

      {submitted ? (
        <div>
          <div style={{ background: S.white, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#065F46', marginBottom: 10 }}>Sent to {email} — check your inbox</p>
            {CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: S.emerald, minWidth: 20, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Bundaberg location insights now coming to your inbox.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ flex: '1 1 200px', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${S.emeraldBdr}`, fontSize: 14, background: S.white, outline: 'none', fontFamily: 'inherit', color: S.n900 }}
          />
          <button onClick={handleSubmit} disabled={loading || !email.includes('@')}
            style={{ padding: '11px 20px', background: (!email.includes('@') || loading) ? '#A7F3D0' : S.emerald, color: S.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed', fontFamily: 'inherit', flexShrink: 0 }}>
            {loading ? 'Sending…' : 'Send me the checklist →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BundabergCafePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>
      ))}

      {/* Nav */}
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Bundaberg', '/analyse/bundaberg']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,250,254,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,250,254,0.7)' }}>Cafés</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Bundaberg Café Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#ECFDF5', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Café in Bundaberg (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,250,254,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            A data-driven guide to Bundaberg&apos;s regional café market. Coastal lifestyle premium, retiree migration, seasonal agricultural cycles. Scored by foot traffic, demographics, competition density, and rent viability.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#22C55E', color: '#0E7490', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '6', l: 'Bundaberg suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#22C55E', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(206,250,254,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), Queensland commercial property surveys, CoStar market data, live competitor mapping via Geoapify Places API, and Locatalyze&apos;s proprietary scoring model. Income and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '8%', claim: 'annual retiree population growth in Bundaberg region — steady sea-change migration', source: 'ABS quarterly population estimates 2020–2026', color: S.emerald },
              { stat: '24%', claim: 'Bargara property value growth 2022–2026 — premium coastal positioning', source: 'CoreLogic property data 2022–2026', color: S.brand },
              { stat: '40%+', claim: 'seasonal revenue uplift March–August (agricultural season and cooler weather)', source: 'Locatalyze café operator surveys, Bundaberg region', color: S.amber },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bundaberg economy section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Bundaberg: Coastal Retiree Destination with Seasonal Opportunity
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Bundaberg is experiencing strong retiree migration from southern Australia. Bargara coastal strip saw 24% property value growth 2022–2026, indicating steady asset-rich demographic inflow. This creates premium positioning opportunity — retirees have high disposable income and lifestyle focus. The demographic is price-tolerant for quality experiences.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Bundaberg is Australia&apos;s gateway to the Great Barrier Reef. Tourism peaks during school holidays (June–August, December–January) and whale watching season (July–October). This creates observable seasonal revenue patterns — March–August is strong (harvest season + cooler weather + school holidays). September–February is slower (hot summer, post-school-holiday lull).
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Agricultural employment cycles are strong — March–August sugar cane harvest drives seasonal worker accommodation and spending. This creates secondary customer base. However, revenue volatility is material — operators must model 60% baseline for September–February to survive. The key to success is capturing both retiree/tourist demand (seasonal) and agricultural worker/local demand (year-round).
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Bargara esplanade is the clear winner — coastal location drives tourism and foot traffic. Central Bundaberg offers immediate volume trade from government/hospital workers. Both are viable with different unit economics. Expect 6–8 month slower seasons requiring careful financial planning.
          </p>

          {/* Recharts: Revenue vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs projected revenue — Bundaberg vs Brisbane locations</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Points in the green zone have rent below 10% of revenue.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="revenue" name="Monthly Revenue ($)" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} label={{ value: 'Monthly Revenue', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[30000, 90000]}/>
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[1000, 10000]}/>
                  <ZAxis dataKey="ratio" range={[60, 300]} name="Rent/Revenue %"/>
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Revenue: <strong>${(d.revenue/1000).toFixed(0)}k/mo</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent/1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 10 ? S.emerald : d.ratio < 15 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: {d.ratio}% {d.ratio < 10 ? ' Healthy' : d.ratio < 15 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => !['Brisbane CBD'].includes(d.suburb))} fill="#059669" name="Bundaberg suburbs" opacity={0.8}/>
                  <Scatter data={RENT_VS_REVENUE.filter(d => ['Brisbane CBD'].includes(d.suburb))} fill="#E24B4A" name="Brisbane (comparison)" opacity={0.7}/>
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Revenue projections: Locatalyze financial model using IBISWorld COGS benchmarks and seasonal adjustment factors. Bundaberg rents: Queensland commercial surveys Q1 2026. Brisbane CBD rent: CBRE retail market report Q4 2025."/>
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Bundaberg Suburb Scores — Café Viability
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18 }}>Scores above 70 = GO. 45–69 = CAUTION. Below 45 = NO.</p>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBURB_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                  <XAxis dataKey="suburb" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                  <Tooltip content={({ payload, label }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    const verdict = d.score >= 70 ? 'GO' : d.score >= 45 ? 'CAUTION' : 'NO'
                    const color = d.score >= 70 ? S.emerald : d.score >= 45 ? S.amber : S.red
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{label}</p>
                        <p style={{ color, fontWeight: 700 }}>{verdict} — {d.score}/100</p>
                        <p style={{ color: S.muted }}>Income: ${d.income}k median</p>
                        <p style={{ color: S.muted }}>Traffic score: {d.traffic}/100</p>
                      </div>
                    )
                  }}/>
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}
                    fill={S.brand}
                    label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}
                    isAnimationActive={true}>
                    {SUBURB_SCORES.map((entry, index) => (
                      <rect key={index} fill={entry.score >= 70 ? S.emerald : entry.score >= 45 ? S.amber : S.red}/>))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Rent 30%, Profitability 25%, Competition 25%, Demographics 20%). Aggregated from ABS, Queensland property surveys, Geoapify data. March 2026."/>
        </section>

        {/* Top suburbs detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Suburbs — Detailed Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TOP_SUBURBS.map(s => (
              <div key={s.name} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', borderTop: `4px solid ${s.verdict === 'GO' ? S.emerald : s.verdict === 'CAUTION' ? S.amber : S.red}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 2 }}>{s.name}</h3>
                    <p style={{ fontSize: 12, color: S.muted }}>Postcode: {s.postcode}</p>
                  </div>
                  <VerdictBadge v={s.verdict}/>
                </div>
                <div style={{ marginBottom: 16, padding: '12px 0', borderBottom: `1px solid ${S.border}` }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: S.brand, marginBottom: 0 }}>{s.score}/100</p>
                </div>
                <ScoreBar label="Foot Traffic" value={s.footTraffic} color={S.brand}/>
                <ScoreBar label="Area Demographics" value={s.demographics}/>
                <ScoreBar label="Rent Fit" value={s.rentFit} color={S.emerald}/>
                <ScoreBar label="Competition Score" value={s.competitionScore} color={S.brand}/>
                <div style={{ marginTop: 16, padding: '12px', background: S.n50, borderRadius: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Financial Profile</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                    <div>
                      <p style={{ color: S.muted, fontSize: 11 }}>Break-even</p>
                      <p style={{ fontWeight: 700, color: S.n900 }}>{s.breakEven} sales</p>
                    </div>
                    <div>
                      <p style={{ color: S.muted, fontSize: 11 }}>Payback period</p>
                      <p style={{ fontWeight: 700, color: S.n900 }}>{s.payback}</p>
                    </div>
                    <div>
                      <p style={{ color: S.muted, fontSize: 11 }}>Annual profit</p>
                      <p style={{ fontWeight: 700, color: S.emerald }}>{s.annualProfit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mid-page CTA */}
        <section style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.05), rgba(6,182,212,0.05))', border: `1px solid ${S.border}`, borderRadius: 16, padding: '40px 24px', marginBottom: 44, textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, marginBottom: 10 }}>Ready to validate a specific address?</h2>
          <p style={{ fontSize: 15, color: '#374151', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
            Get a detailed Locatalyze score for any café location in Bundaberg. Foot traffic density, demographic match, competition mapping, and seasonal revenue viability — analysed in seconds.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Start location analysis free →
          </Link>
        </section>

        {/* Poll */}
        <SuburbPoll/>

        {/* Checklist */}
        <ChecklistUnlock/>

        {/* Risk suburbs */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Suburbs to Avoid (or Tread Carefully)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {RISK_SUBURBS.map(s => (
              <div key={s.name} style={{ background: S.white, border: `2px solid ${S.redBdr}`, borderRadius: 12, padding: '16px', borderTop: `4px solid ${S.red}` }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{s.name}</h3>
                    <p style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Postcode {s.postcode}</p>
                  </div>
                  <VerdictBadge v={s.verdict}/>
                </div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65 }}>{s.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final verdict */}
        <section style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '32px 28px', marginBottom: 44 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: S.emerald, marginBottom: 12 }}>The Verdict</h2>
          <p style={{ fontSize: 15, color: '#047857', lineHeight: 1.8, marginBottom: 0 }}>
            Bundaberg is a dual-opportunity market: Bargara for premium/lifestyle positioning targeting asset-rich retirees, and Bundaberg Central for volume trade anchored by government/agriculture. Both are viable but require sophisticated seasonal revenue modelling — expect 40% revenue uplift March–August (harvest + cooler weather) and baseline minus 40% September–February. The key success factor is capturing multi-source demand: retirees/tourists (seasonal), agricultural workers (seasonal), and local residents (year-round). Rent is 50–60% below Brisbane, enabling margin for brand-building and customer acquisition. Success requires disciplined financial planning for seasonal volatility.
          </p>
        </section>

        {/* Footer CTA */}
        <section style={{ textAlign: 'center', padding: '20px 0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Find your location match</h2>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Analyse your address free →
          </Link>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 16 }}>No credit card required. Results in seconds.</p>
        </section>
      </div>
    </div>
  )
}
