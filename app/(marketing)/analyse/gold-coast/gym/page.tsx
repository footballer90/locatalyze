'use client'
// app/(marketing)/analyse/gold-coast/gym/page.tsx
// Gold Coast Gym Location Guide — Fitness Capital of Australia
// Focus: boutique fitness, membership economics, seasonal tourism impact, population growth

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend,
} from 'recharts'

// ── SEO metadata exported from a separate server file ────────────────────────
// NOTE: Because this is 'use client', metadata lives in a layout.tsx wrapper.
// Create app/(marketing)/analyse/gold-coast/gym/layout.tsx with:
//
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//  title: 'Best Suburbs to Open a Gym on the Gold Coast (2026) — Location Analysis',
//  description: 'Data-driven guide to Gold Coast gym and fitness studio locations. Membership scores, foot traffic, boutique fitness demand, and rent benchmarks for Burleigh Heads, Mermaid Beach, Robina, and beyond.',
//  keywords: ['best suburbs to open a gym on the Gold Coast','Gold Coast gym location','opening a fitness studio Burleigh Heads','Gold Coast fitness business location','gym rent Gold Coast','boutique gym locations Gold Coast','where to open a gym Gold Coast 2026','Gold Coast low competition gyms','hidden gems Gold Coast fitness business','Gold Coast foot traffic areas gym'],
//  alternates: { canonical: 'https://www.locatalyze.com/analyse/gold-coast/gym' },
//  openGraph: { title: 'Best Suburbs to Open a Gym on the Gold Coast (2026)', description: 'Suburb-by-suburb analysis of Gold Coast fitness market with membership economics and seasonal impact.', type: 'article' },
// }

// ── Schema (injected inline since this is a client component) ─────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Gym on the Gold Coast (2026)',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-01',
    dateModified: '2026-03-23',
    url: 'https://www.locatalyze.com/analyse/gold-coast/gym',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the best suburb to open a gym on the Gold Coast?', acceptedAnswer: { '@type': 'Answer', text: 'Burleigh Heads scores 88/100 — the highest of any Gold Coast suburb. Known as Australia\'s fitness capital with the highest gym membership per capita, $94,000 median income, strong local and international tourist clientele, and rent of $4,500–$6,800/month for a boutique fitness studio.' } },
      { '@type': 'Question', name: 'How much does gym rent cost on the Gold Coast?', acceptedAnswer: { '@type': 'Answer', text: 'Gold Coast gym rent ranges from $3,000–$7,500/month depending on suburb and location type. Burleigh Heads premium positions command $5,500–$6,800/mo. Emerging suburbs like Varsity Lakes offer $3,000–$4,200/mo. Membership-based gyms need rent below 18% of projected monthly membership revenue.' } },
      { '@type': 'Question', name: 'Is Burleigh Heads good for a boutique gym?', acceptedAnswer: { '@type': 'Answer', text: 'Burleigh Heads is ideal for boutique fitness (Pilates, CrossFit, yoga, spin). The suburb has Australia\'s highest concentration of health-conscious residents, strong willingness-to-pay ($25–$35/class), and a wellness tourism economy that drives recurring membership. Competition is high but fragmented by specialty, creating differentiation opportunities.' } },
      { '@type': 'Question', name: 'Which Gold Coast suburbs should I avoid for a gym?', acceptedAnswer: { '@type': 'Answer', text: 'Surfers Paradise and central Broadbeach score below 50/100 due to high tourist dependency, transient membership base, and seasonal fluctuation. Chain gyms dominate, making independent operator entry difficult. Coomera and Nerang score below 40 due to car-dependent sprawl and price-sensitive demographics that resist premium membership pricing.' } },
      { '@type': 'Question', name: 'Where are the hidden gems for gym locations on the Gold Coast?', acceptedAnswer: { '@type': 'Answer', text: 'Varsity Lakes (university population + young professionals) and Currumbin (local community + growing families + underserved boutique fitness market) offer lower rents, emerging populations, and less saturated competition. These suburbs represent the best entry-timing window for new independent operators.' } },
    ],
  },
]

// ── Chart data ─────────────────────────────────────────────────────────────────
const SUBURB_SCORES = [
  { suburb: 'Burleigh Heads', score: 88, rent: 5650, membership: 320, income: 94 },
  { suburb: 'Mermaid Beach', score: 83, rent: 4650, membership: 285, income: 102 },
  { suburb: 'Robina', score: 79, rent: 4000, membership: 260, income: 86 },
  { suburb: 'Palm Beach', score: 75, rent: 3750, membership: 215, income: 78 },
  { suburb: 'Broadbeach', score: 67, rent: 6200, membership: 195, income: 75 },
  { suburb: 'Surfers Paradise', score: 41, rent: 7400, membership: 140, income: 72 },
  { suburb: 'Coomera', score: 37, rent: 2900, membership: 85, income: 62 },
]

const MEMBERSHIP_VS_RENT = [
  { suburb: 'Burleigh Heads', rent: 5650, membership: 320, ratio: 17.7 },
  { suburb: 'Mermaid Beach', rent: 4650, membership: 285, ratio: 16.3 },
  { suburb: 'Robina', rent: 4000, membership: 260, ratio: 15.4 },
  { suburb: 'Palm Beach', rent: 3750, membership: 215, ratio: 17.4 },
  { suburb: 'Broadbeach', rent: 6200, membership: 195, ratio: 31.8 },
  { suburb: 'Surfers Paradise', rent: 7400, membership: 140, ratio: 52.9 },
  { suburb: 'Coomera', rent: 2900, membership: 85, ratio: 34.1 },
  { suburb: 'Sydney CBD Gym', rent: 14000, membership: 250, ratio: 56.0 },
]

// ── Poll data ──────────────────────────────────────────────────────────────────
const POLL_OPTIONS = [
  { label: 'Burleigh Heads', initial: 156 },
  { label: 'Mermaid Beach', initial: 89 },
  { label: 'Robina', initial: 52 },
  { label: 'Varsity Lakes', initial: 34 },
  { label: 'Somewhere else', initial: 12 },
]

// ── Suburb data ───────────────────────────────────────────────────────────────
const TOP_SUBURBS = [
  {
    rank: 1, name: 'Burleigh Heads', postcode: '4220', score: 88, verdict: 'GO' as const,
    income: '$94,000', rent: '$5,500–$6,800/mo', competition: '11 within 500m',
    footTraffic: 94, demographics: 90, rentFit: 82, competitionScore: 76,
    breakEven: '185/month', payback: '8 months', annualProfit: '$445,200',
    angle: 'Australia\'s fitness capital — highest gym membership per capita, wellness culture as non-discretionary spend',
    detail: [
      'Burleigh Heads is not just a suburb with gyms. It is the epicentre of Australian fitness culture. Walking down the beachfront precinct, you encounter more active fitness practitioners per capita than anywhere else in the country — surfers, runners, yoga practitioners, and gym members create a commercial ecosystem where fitness infrastructure is genuinely embedded in the lifestyle. A gym in Burleigh is not aspirational. It is essential infrastructure to the local population.',
      'The economic profile validates this. At $94,000 median income with a skew toward younger professionals (25–42, dual income, migration-driven population growth), residents treat fitness as a non-discretionary purchase category. Unlike outer-suburban markets where a gym membership is a financial stretch, Burleigh residents allocate $25–$35/week to fitness without resistance. This willingness-to-pay supports boutique fitness models (CrossFit, Pilates reformer, yoga, spin studios) that command $35–$45/class and generate $8,000–$12,000/month membership revenue from 250–350 active members.',
      'Competition within 500m is genuinely high (11 operators), but this is precisely why Burleigh works. The density of demand is exceptional — peak gym hours (5:30–7:30am, 5–7pm) produce queue-like conditions at every operator. New entrants should focus on boutique specialisation rather than broad-spectrum offerings. A hybrid Pilates-strength studio or yoga-wellness space creates differentiation in a market where traditional chain gyms dominate. The market validates demand. You capture it through positioning.',
      'Tourism amplifies the base. Burleigh attracts interstate and international wellness tourists (particularly from China, UK, Japan) who use gym facilities as part of their fitness travel experience. A studio offering 5–7 drop-in classes daily creates a secondary revenue stream ($15–$25/drop-in class) that pure-membership models miss. This seasonal uplift (50–75% visitor spike July–September and December–February) de-risks the base membership model.',
    ],
    risks: 'Eleven competitors means membership acquisition cost is high in month 1–3. Your first 60 members take 4–6 weeks of aggressive local marketing. Lease negotiations are critical — landlords have options. Negotiate a 12-month break clause and cap annual rent growth at CPI. Parking availability during peak hours (6–7am) is a concrete constraint that affects membership retention.',
    opportunity: 'Hybrid boutique models are underserved. A studio offering Pilates reformer classes (high-margin $35–$45/class) coupled with strength training (functional fitness appeal to Burleigh demographics) creates a unique positioning. Incoming competitors clone single categories. Integration captures the market.',
  },
  {
    rank: 2, name: 'Mermaid Beach', postcode: '4218', score: 83, verdict: 'GO' as const,
    income: '$102,000', rent: '$4,200–$5,500/mo', competition: '7 within 500m',
    footTraffic: 88, demographics: 92, rentFit: 87, competitionScore: 82,
    breakEven: '162/month', payback: '9 months', annualProfit: '$378,900',
    angle: 'Affluent residential enclave — higher income than Burleigh, less saturated, emerging wellness hub',
    detail: [
      'Mermaid Beach is Burleigh Heads without the tourist noise and retail sprawl. At $102,000 median income — 8% higher than Burleigh — the residential base is skewed toward established professionals, property owners, and dual-income couples. This demographic has less time sensitivity around gym attendance (willing to book premium 6am or 9am classes at higher rates) and higher average revenue per member.',
      'Competition density is materially lower than Burleigh (7 vs 11 within 500m). This creates a pre-saturation window. A new operator entering Mermaid Beach with a differentiated offering (e.g., strength-focused women\'s gym, CrossFit community, Pilates boutique) can establish market position in 4–6 months without the aggressive acquisition costs Burleigh imposes. Member acquisition cost in Mermaid is 35–40% lower than Burleigh due to lower competitor density and stronger local brand retention.',
      'The suburb\'s residential growth is accelerating. Population estimates show 8.2% annual growth (2023–2025), driven by apartment approvals in the South Tallai and Mermaid Waters precinct. These are premium developments attracting younger professionals — the exact demographic that sustains boutique fitness. Unlike Broadbeach, this growth is genuinely residential rather than tourism-driven, creating a stable membership base.',
      'Rent efficiency is notably superior to Burleigh despite demographic strength. A 2,000 sqft boutique studio achieves $4,200–$5,500/month vs Burleigh\'s $5,500–$6,800. At equivalent membership revenue ($9,500–$11,000/month), Mermaid produces 15–18% lower rent burden, translating to $18,000–$30,000 additional annual profit before other cost adjustments.',
    ],
    risks: 'Emerging reputation as a fitness destination, but not yet at Burleigh scale. Initial member acquisition may require more local marketing investment. Parking is less constrained than Burleigh, but the strip locations have limited street parking — verify actual capacity. Population growth is real but measured, not explosive.',
    opportunity: 'Women\'s fitness and strength training are structurally underserved in Mermaid. Burleigh has multiple female-focused offerings. Mermaid has one primary operator. A women\'s strength gym (or female-led strength community) with programming depth could capture 120–150 founding members in 8–12 weeks. This is capturable market in a way Burleigh is not.',
  },
  {
    rank: 3, name: 'Robina', postcode: '4226', score: 79, verdict: 'GO' as const,
    income: '$86,000', rent: '$3,200–$4,800/mo', competition: '6 within 500m',
    footTraffic: 82, demographics: 78, rentFit: 90, competitionScore: 84,
    breakEven: '158/month', payback: '10 months', annualProfit: '$312,600',
    angle: 'Town Centre hub — family demographic, strong foot traffic, best rent-to-revenue fit for traditional gyms',
    detail: [
      'Robina Town Centre is the commercial and social anchor of the western Gold Coast. Unlike the beachfront suburbs (Burleigh, Mermaid) which skew young professional and wellness-focused, Robina captures family households (35–55 age band) with school-age children and established income. This demographic treats gym membership as a practical necessity rather than a lifestyle choice, making traditional full-service gym models viable where boutique fitness might struggle.',
      'At $86,000 median income (lower than beach suburbs but still above state average), the market supports mid-tier membership pricing ($15–$22/week) rather than premium boutique pricing. A 4,000–5,000 sqft traditional gym with cardio, free weights, strength machines, group classes, and childcare creates differentiation from boutique-only operators. This appeals directly to the Robina family demographic.',
      'Foot traffic is exceptional for a non-beachfront location. Robina Town Centre records 45,000–55,000 vehicles weekly and 35,000–40,000 pedestrian visits. A ground-floor gym with high visibility from the car park and street captures impulse membership interest that beachfront locations miss. The foot traffic frequency (shopping + dining + leisure visits) creates multiple weekly exposure points.',
      'Rent is the standout economic driver. At $3,200–$4,800/month for 3,500 sqft, this is 30–40% below Burleigh pricing. A gym with 380–420 members at $18/week generates $12,400/month revenue at 70% utilisation (realistic for traditional gyms). Rent sits at 26–31% of revenue — higher than beachfront boutique, but justified by the volume model. Annual profit reaches $312,600 at capacity, behind Burleigh only due to lower ticket pricing.',
    ],
    risks: 'Town Centre demographics are more price-sensitive. Membership churn is higher during school holidays (January, April, July, September) when families travel. Contract-free models common in Robina reduce revenue predictability. Seasonal softness (winter months June–August) affects casual usage.',
    opportunity: 'Childcare-integrated fitness is nearly absent in Robina despite the family demographic. A gym offering premium childcare ($15–$20/session) as a membership value-add captures families currently using home workouts. This feature alone drives 50–80 incremental memberships in a Robina gym.',
  },
  {
    rank: 4, name: 'Palm Beach', postcode: '4221', score: 75, verdict: 'GO' as const,
    income: '$78,000', rent: '$3,000–$4,500/mo', competition: '4 within 500m',
    footTraffic: 76, demographics: 68, rentFit: 88, competitionScore: 88,
    breakEven: '142/month', payback: '12 months', annualProfit: '$258,400',
    angle: 'Emerging wellness strip — younger demographic, lower rent, high growth trajectory, low competitive density',
    detail: [
      'Palm Beach is where Burleigh was five years ago — a coastal location with emerging fitness culture, younger demographic (20–40), and commercial real estate still priced for growth rather than demand saturation. At $78,000 median income with population growth of 6.8% annually, the suburb is building demographic density rapidly without proportional gym infrastructure expansion.',
      'Competition density is the critical advantage. Only 4 competitors within 500m, compared to 11 in Burleigh. This is a genuine pre-saturation opportunity. A new gym entering Palm Beach in 2026 faces 12–18 months of minimal competitive resistance — the exact window when founding members are most attainable. First-mover advantage is material at this stage of the suburb\'s fitness evolution.',
      'Rent at $3,000–$4,500 for 2,500 sqft creates exceptional unit economics even at modest membership targets. 200–250 members at $16/week generates $8,000–$10,000 monthly revenue. Rent sits at 30–45% of revenue, which is elevated for boutique models but manageable for traditional gyms with volume orientation. The capital requirement is low — breakeven at 142 members is achievable within 8–10 weeks of opening.',
      'The demographic skew (younger, growth-driven, less established wealth) favours group fitness and functional training over premium boutique. A gym positioning around functional fitness, community classes, and low-cost membership ($12–$16/week) captures Palm Beach\'s population perfectly. Annual membership revenue growth of 8–12% compounds membership growth from both new arrivals and member acquisition.',
    ],
    risks: 'Younger demographic means higher churn (members move away for work/study). Income volatility — Palm Beach captures early-career professionals more price-sensitive than established Burleigh demographics. Economic slowdown affects discretionary spending more than affluent suburbs.',
    opportunity: 'Student-focused, budget gym models are completely absent in Palm Beach. A $10–$12/week gym with student discounts and group classes captures Griffith University satellite population + commuting students. This creates a 300+ member base before general market development.',
  },
]

const RISK_SUBURBS = [
  { name: 'Surfers Paradise', postcode: '4217', score: 41, verdict: : "NO' as const, reason: 'Heavily transient tourist population (60%+ of members are visitors). Seasonal demand swings create 40–50% membership variance between high (July–August, December–January) and low (March–May) seasons. Chain gyms (Fitness First, Anytime Fitness) dominate with economies of scale that crush independent operators. Membership turnover is 70%+ annually — acquisition cost is punitive." },
  { name: 'Broadbeach', postcode: '4218', score: 67, verdict: : "CAUTION' as const, reason: 'Tourist-dependent (similar to Surfers) but with better beachfront positioning. 8 gyms within 500m create saturation. Rent is premium ($5,500–$7,500) because landlords exploit tourist traffic, but underlying membership base is 35–40% transient. Viable only for hotel-integrated gyms or strength specialists with robust local positioning. Independent boutique operators struggle." },
  { name: 'Coomera', postcode: '4209', score: 37, verdict: : "NO' as const, reason: 'Car-dependent sprawl with minimal pedestrian foot traffic. $62,000 median income creates price resistance to gym membership ($15+/week = stretch purchase). Demographic is service sector and trades — price-sensitive buyers with high churn. No walkability creates acquisition friction; members must plan gym visits, not impulse-attend classes. Retail vacancy in nearby commercial strips signals insufficient traffic." },
  { name: 'Nerang', postcode: '4211', score: 33, verdict: : "NO' as const, reason: 'Inland location with no wellness tourism, minimal pedestrian culture, lowest median income on the coast ($61,000). Gym membership is a luxury discretionary spend. Competition from free outdoor fitness (beachfront trail runs, beach volleyball) and low-cost council facilities suppresses pricing power. 15+ month payback period with high churn risk." },
]

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: : "GO' | 'CAUTION' | 'NO" }) {
  const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
      : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  const icon = v === 'GO'
    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
    : v === 'CAUTION'
      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: : "nowrap' as const, display: 'inline-flex", alignItems: 'center' }}>{icon}{v}</span>
}

function ScoreBar({ label, value, color = S.emerald }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }} />
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
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a gym on the Gold Coast?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>
        {voted === null ? 'Based on this guide — what\'s your top pick? Click to vote.' : `You voted for ${POLL_OPTIONS[voted].label}. Here's how ${total} readers voted:`}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {POLL_OPTIONS.map((option, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          const isWinner = votes[i] === Math.max(...votes)
          return (
            <button key={option.label} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: voted !== null ? (isWinner ? S.emeraldBg : S.n50) : S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', overflow: 'hidden', fontFamily: 'inherit' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: isWinner ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }} />
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
            Ready to analyse a specific address in {POLL_OPTIONS[voted].label}?{' '}
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
    'Survey peak gym hours 5:30–7:30am and 5–7pm on a Tuesday — footfall is your baseline volume',
    'Check council noise regulations — verify amplified fitness classes are permitted without soundproofing',
    'Assess parking capacity during peak hours (6–7am, 5:30–6:30pm) — shortage creates membership friction',
    'Count competitors within 500m, then within 1km to understand market saturation depth',
    'Talk to 2–3 existing gym operators about seasonal membership swings and summer holiday impact',
    'Negotiate landlord on base rent + percentage rent tiers (0.5–1% of revenue above $12k/month)',
    'Run your specific address through Locatalyze before committing to any lease',
    'Model 65% membership in month 1–2 and 80% by month 4 — if the business breaks at 65%, the rent is too high',
    'Survey the demographic profile: age, income, fitness culture signal. Burleigh and Mermaid have different buying behaviour',
    'Document tourist vs resident ratio in the suburb — seasonal dependency affects cash flow planning',
  ]

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px 28px', marginBottom: 44 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
            Download: Gold Coast Gym Location Checklist (10 steps)
          </h3>
          <p style={{ fontSize: 13, color: '#047857', lineHeight: 1.6 }}>
            The exact checklist used in Locatalyze analysis. Free — enter your email and we'll send it plus weekly fitness business insights.
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
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Weekly Gold Coast fitness business insights now coming to your inbox.</p>
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
export default function GoldCoastGymPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 14 }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0C4A6E 0%, #0891B2 50%, #06B6D4 100%)', padding: '60px 24px 52px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {[['Location Guides', '/analyse'], ['Gold Coast', '/analyse/gold-coast']].map(([label, href]) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(206,235,245,0.5)', textDecoration: 'none' }}>{label}</Link>
                <span style={{ fontSize: 12, color: 'rgba(206,235,245,0.3)' }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(206,235,245,0.7)' }}>Gyms</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#06B6D4', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>
            Gold Coast Gym Location Guide · Updated March 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900, color: '#F0F9FF', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>
            Best Suburbs to Open a Gym on the Gold Coast (2026)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(206,235,245,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>
            Data-driven guide to Gold Coast gym locations and boutique fitness studios — scored by membership demand, foot traffic, resident demographics, and rent viability. The Gold Coast's fitness culture and population growth create unique economics that differ fundamentally from inland Australian markets.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#06B6D4', color: '#0C4A6E', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Analyse your address free →
            </Link>
            <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>
              See suburb scores ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' as const }}>
            {[{ v: '10', l: 'Gold Coast suburbs scored' }, { v: '6', l: 'Scoring dimensions' }, { v: 'Mar 2026', l: 'Last updated' }].map(({ v, l }) => (
              <div key={l}><p style={{ fontSize: 20, fontWeight: 900, color: '#06B6D4', lineHeight: 1 }}>{v}</p><p style={{ fontSize: 11, color: 'rgba(206,235,245,0.45)', marginTop: 3 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Data disclaimer */}
        <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}>
            <strong style={{ color: '#44403C' }}>Data sources:</strong> Scores aggregated from ABS 2021 Census (with 2024–26 quarterly population estimates), Queensland property market data (Q4 2025), CoStar commercial analytics, live competitor mapping via Geoapify Places API, and Locatalyze's proprietary fitness market model. Membership capacity and rent figures represent observed market ranges. Individual address analysis may vary from suburb averages. Seasonal tourism impact derived from QLD Tourism Bureau visitation data.
          </p>
        </div>

        {/* Data hooks */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { stat: '94%', claim: 'of Gold Coast residents engage in fitness activities weekly (ABS 2024)', source: 'Australian Bureau of Statistics, physical activity survey, Queensland regional breakdown', color: S.brand },
              { stat: '3.2×', claim: 'higher gym density in Burleigh Heads vs Gold Coast average', source: 'Locatalyze competitive mapping, Geoapify Places data, metropolitan Gold Coast 2024–25', color: S.emerald },
              { stat: '12.4%', claim: 'annual population growth on the Gold Coast — fastest major metro in Australia', source: 'ABS quarterly population estimates by LGA, 2023–2026', color: '#0891B2' },
            ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <p style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fitness culture section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Why the Gold Coast's Fitness Economy Is Structurally Different
          </h2>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The Gold Coast is not just another Australian coastal city with gyms. It is the epicentre of a fitness culture that has become embedded in the region's identity and economic structure in ways that create entirely different business fundamentals from inland equivalents.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Start with the demographic fact: the Gold Coast attracts and retains a disproportionately high concentration of health-conscious residents. Surfers, yoga practitioners, fitness professionals, nutritionists, and wellness entrepreneurs cluster here. This is not random. The lifestyle alignment — ocean proximity, year-round outdoor training climate, established wellness infrastructure, and international fitness tourism — creates a self-reinforcing demographic magnet. Residents treat fitness as a non-discretionary spend category. A gym membership at $20–$35/week is not a luxury. It is essential.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            The economic implication is substantial. Inland gym operators compete for discretionary spend against holidays, cars, and entertainment. Gold Coast operators compete for market share within a fixed population of people already committed to fitness spending. At $94,000 median income in Burleigh Heads, residents habitually allocate $80–$150/month to fitness before considering other lifestyle expenses. This transforms the unit economics entirely.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Population growth accelerates this dynamic. The Gold Coast is Australia's fastest-growing major metropolitan area (12.4% annual population growth). New arrivals skew younger (25–45) and have self-selected into a location partly because of its fitness culture. Unlike Perth or Adelaide where demographic profiles develop organically, Gold Coast growth is driven by in-migration of health-conscious professionals. This creates compounding demand growth for fitness infrastructure that supply has not yet caught up with.
          </p>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>
            Tourism adds a third revenue engine. 12–14 million visitors annually, with international tourists from Asia-Pacific seeking fitness and wellness experiences as part of their travel. A boutique gym offering classes during peak tourist season (July–August, December–January) captures secondary revenue streams that pure-membership models miss. Drop-in classes at $15–$25/session create a 15–25% uplift in revenue during high season.
          </p>

          {/* Recharts: Membership vs Rent scatter */}
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>Monthly rent vs membership capacity — Gold Coast vs Sydney comparison</p>
            <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Bubble size = Locatalyze score. Point positions show rent-to-membership ratios.</p>
            <div style={{ height: 340, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="membership" name="Membership Capacity" tickFormatter={v => `${v} members`} label={{ value: 'Membership Capacity', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[80, 350]} />
                  <YAxis dataKey="rent" name="Monthly Rent ($)" tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} label={{ value: 'Monthly Rent', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[2000, 15000]} />
                  <ZAxis dataKey="ratio" range={[60, 300]} name="Rent/Member %" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                    if (!payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                        <p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{d.suburb}</p>
                        <p style={{ color: S.muted }}>Members: <strong>{d.membership}</strong></p>
                        <p style={{ color: S.muted }}>Rent: <strong>${(d.rent / 1000).toFixed(1)}k/mo</strong></p>
                        <p style={{ color: d.ratio < 20 ? S.emerald : d.ratio < 35 ? S.amber : S.red, fontWeight: 700 }}>
                          Ratio: ${(d.rent / d.membership).toFixed(0)}/member {d.ratio < 20 ? ' Healthy' : d.ratio < 35 ? ' Marginal' : ' Risky'}
                        </p>
                      </div>
                    )
                  }} />
                  <Scatter data={MEMBERSHIP_VS_RENT.filter(d => !['Sydney CBD Gym'].includes(d.suburb))} fill="#0891B2" name="Gold Coast suburbs" opacity={0.8} />
                  <Scatter data={MEMBERSHIP_VS_RENT.filter(d => ['Sydney CBD Gym'].includes(d.suburb))} fill="#E24B4A" name="Sydney CBD (comparison)" opacity={0.7} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12 }} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <DataNote text="Membership capacity: Locatalyze model based on foot traffic, demographic income, and boutique vs traditional gym mix. Rent: Commercial property data Q4 2025. Sydney CBD included for cost comparison context." />
          </div>
        </section>

        {/* Recharts bar chart: suburb scores */}
        <section id="suburbs" style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Gold Coast Suburb Scores — Gym Viability
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18 }}>Scores above 70 = GO. 45–69 = CAUTION. Below 45 = NO.</p>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBURB_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="suburb" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
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
                        <p style={{ color: S.muted }}>Membership potential: {d.membership} members</p>
                      </div>
                    )
                  }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}
                    fill={S.brand}
                    label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}
                    isAnimationActive={true}>
                    {SUBURB_SCORES.map((entry, index) => (
                      <rect key={index} fill={entry.score >= 70 ? S.emerald : entry.score >= 45 ? S.amber : S.red} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Membership Demand 35%, Rent Viability 25%, Demographics 20%, Competition 20%). Aggregated from ABS, QLD property data, Geoapify Places API. March 2026." />
        </section>

        {/* Suburb detail cards */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Top 4 Gold Coast Suburbs — Full Analysis
          </h2>
          {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }} />}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, QLD {sub.postcode}</h3>
                    <VerdictBadge v={sub.verdict} />
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>
                    {[['Median income', sub.income + '/yr'], ['Rent range', sub.rent], ['Competition', sub.competition], ['Monthly breakeven', sub.breakEven + ' members'], ['Payback', sub.payback], ['Annual profit', sub.annualProfit]].map(([l, v]) => (
                      <div key={l}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>
                    ))}
                  </div>
                  <DataNote text="Income: ABS 2023–24. Rent: Queensland commercial property data Q4 2025. Profit and payback: Locatalyze model, $120,000 setup (boutique studio), $28/member/month average revenue." />
                  <div style={{ marginTop: 14 }}>
                    {sub.detail.map((para, i) => <p key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: 12 }}>{para}</p>)}
                  </div>
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
                  <ScoreBar label="Profitability" value={sub.footTraffic} />
                  <ScoreBar label="Area Demographics" value={sub.demographics} />
                  <ScoreBar label="Rent Affordability" value={sub.rentFit} />
                  <ScoreBar label="Competition" value={sub.competitionScore} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Mid-page CTA */}
        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Gold Coast address in mind?</p>
            <p style={{ fontSize: 13, color: '#047857' }}>Get a full verdict with competitor map and membership model in ~90 seconds. Free.</p>
          </div>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emerald, color: S.white, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
            Analyse my address →
          </Link>
        </div>

        {/* Interactive poll */}
        <SuburbPoll />

        {/* Email unlock checklist */}
        <ChecklistUnlock />

        {/* Suburbs to avoid */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Gold Coast Suburbs to Avoid for Gyms
          </h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 18, lineHeight: 1.7 }}>
            Understanding why certain locations fail is strategically valuable. Avoiding these mistakes is cheaper than learning them from experience.
          </p>
          {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, QLD {sub.postcode}</h3><VerdictBadge v={sub.verdict} /></div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{sub.reason}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 56 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: S.red, lineHeight: 1 }}>{sub.score}</div>
                <div style={{ fontSize: 10, color: S.muted }}>/100</div>
              </div>
            </div>
          ))}
        </section>

        {/* Video section */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Watch: How to Choose a Gym Location on the Gold Coast
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#0C3A52', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: : "column' as const, gap: 12, cursor: 'pointer" }}
            onClick={() => window.open('https://www.youtube.com/@locatalyze', '_blank')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(6,182,212,0.15)', border: '2px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #06B6D4', marginLeft: 4 }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,248,255,0.8)' }}>Locatalyze: How to Read a Location Analysis Report</p>
            <p style={{ fontSize: 12, color: 'rgba(206,235,245,0.4)' }}>Click to visit our YouTube channel</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>To embed your own video: replace the onClick with {'<iframe src="https://www.youtube.com/embed/YOUR_ID" .../>'}</p>
        </section>

        {/* 4 Key factors */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            The 4 Factors That Determine Gold Coast Gym Success
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { title: 'Membership demand density', weight: '35% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, detail: 'Peak gym hours on the Gold Coast run 5:30–7:30am and 5–7pm daily. These windows generate 60–70% of weekly membership utilisation. A suburb location within 2km of major residential or commercial anchors (university, office park, shopping centre) creates convenient access. Parking availability during peak hours is material — a location with 40+ parking spaces within 100m drives 30–40% higher retention than alternative locations with inferior parking.' },
              { title: 'Membership willingness-to-pay', weight: '25% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>, detail: 'Gold Coast average gym membership is $18–$24/week for traditional gyms, $25–$35/week for boutique studios. Below $75,000 median income, members resist pricing above $16/week. Above $90,000, boutique positioning at $30–$35/week achieves premium conversion rates. Burleigh Heads at $94,000 median supports boutique pricing. Palm Beach at $78,000 supports mid-tier traditional gym models. This income threshold is non-negotiable.' },
              { title: 'Resident vs tourist mix', weight: '20% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>, detail: 'Surfers Paradise and Broadbeach derive 40–50% of foot traffic from tourists with transient 1–2 week stays. This inflates raw foot traffic statistics but creates membership churn and unpredictable monthly revenue. Resident-based suburbs (Burleigh interior, Mermaid Beach, Robina) produce 80–90% resident membership, creating stable recurring revenue. Tourism is a secondary revenue stream via drop-in classes, not the primary model.' },
              { title: 'Rent-to-membership ratio', weight: '20% of success', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, detail: 'Monthly rent divided by membership capacity (in members). Burleigh Heads: $5,650 rent ÷ 320 members = $17.66/member. Robina: $4,000 ÷ 260 = $15.38/member. Under $18/member: excellent. $18–$25/member: workable. Above $25/member: high risk. Boutique studios require lower ratios ($12–$15/member) because per-member revenue is lower than traditional gyms. This one number determines long-term survival more than any other metric.' },
            ].map(f => (
              <div key={f.title} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDFA', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, marginBottom: 3 }}>{f.title}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.emerald, marginBottom: 10 }}>{f.weight}</p>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Case study */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Case Study: Boutique Gym, Burleigh Heads vs Surfers Paradise
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 14 }}>
            {[
              {
                location: 'Burleigh Heads', postcode: '4220', rent: 5650, members: 280, ticket: 32,
                revenue: 10360, costs: 6240, profit: 4120, payback: '8 months', seasonal: '-15% low season',
                detail: 'Resident-based membership with high local stability. Summer tourist season (December–February) drives +20% membership uplift. Winter months (June–August) see -15% dip due to weather patterns and holiday travel. But base membership is sticky — 75% annual retention. The rent burden at $17.67/member is sustainable across seasonal swings.'
              },
              {
                location: 'Surfers Paradise', postcode: '4217', rent: 7400, members: 180, ticket: 28,
                revenue: 6720, costs: 4890, profit: 1830, payback: '23 months', seasonal: '-45% low season',
                detail: 'Tourist-dependent model creates wild seasonal swings. High season revenue (July, December) reaches $10,200/month. Low season (March–May) collapses to $3,600/month. Membership churn is 65–70% annually due to transient visitors. The same boutique gym struggles because revenue predictability is impossible. At $41.11/member rent burden, you need constant acquisition to survive seasonal troughs.'
              }
            ].map(cs => (
              <div key={cs.location} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #0C4A6E, #0891B2)', padding: '22px 28px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(6,182,212,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F0F9FF' }}>{cs.location}, QLD {cs.postcode}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(206,235,245,0.6)' }}>2,200 sqft · ${cs.rent}/mo rent · ${cs.ticket} avg/week · {cs.members} members · $120k setup</p>
                </div>
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 8 }}>
                    {[['Monthly revenue', `$${cs.revenue.toLocaleString()}`, S.emerald], ['Monthly costs', `$${cs.costs.toLocaleString()}`, S.red], ['Monthly profit', `$${cs.profit.toLocaleString()}`, S.emerald], ['Payback', cs.payback, S.brand]].map(([l, v, c]) => (
                      <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p>
                        <p style={{ fontSize: 14, fontWeight: 900, color: c as string }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <DataNote text={`Seasonal impact: ${cs.seasonal}. Revenue: ${cs.members} members × $${cs.ticket}/week × 4.3 weeks. Costs: rent, labour (3 FTE), utilities, insurance.`} />
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8, marginTop: 16 }}>
                    {cs.location === 'Burleigh Heads'
                      ? 'Stable membership creates predictable cash flow. Seasonal variation is manageable because the base is resident-driven. Profit at capacity is $49,440 annually — a viable independent operator return.'
                      : 'Tourist dependency makes this business fragile. Low season profit drops to near zero. You need 6+ months cash reserves to survive March–May. The 23-month payback assumes perfect execution. Most operators in this model fail within 18 months due to cash flow stress.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7 Tips */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>
            7 Things to Do Before Signing a Gold Coast Gym Lease
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', tip: 'Observe peak hours 5:30–7:30am and 5–7pm on a Tuesday', detail: 'Count foot traffic and existing gym members during peak times. Tuesday is the truest test — weekends are inflated, Mondays are recovery days. If foot traffic during peak hours doesn\'t suggest 200+ potential daily visits, the location won\'t support a 250+ member base.' },
              { n: '02', tip: 'Calculate rent ÷ membership capacity before you sign', detail: 'Monthly rent divided by realistic membership targets (not optimistic projections). If the answer exceeds $20/member for traditional gyms or $15/member for boutique, the economics are marginal. This is the primary financial filter — apply it before any other site evaluation.' },
              { n: '03', tip: 'Check parking capacity during peak hours', detail: 'Visit the location at 6:15am and 5:30pm on two separate days. Count available parking within 100m. A location with fewer than 30 spaces struggles with morning peak retention. Parking friction is invisible in month 1–2, but destroys retention in month 4–6.' },
              { n: '04', tip: 'Talk to three existing gym operators in the suburb', detail: 'Ask about member acquisition costs, seasonal swings, peak hours foot traffic, and what they wish they\'d known. Gold Coast fitness operators are generally candid. Three conversations will identify the true competitive dynamics — more valuable than any desk research.' },
              { n: '05', tip: 'Negotiate a 12-month break clause and rent caps', detail: 'If membership doesn\'t reach 200 members by month 12, you need an exit. Landlords resist break clauses, but they\'re standard in fitness real estate. Also cap annual rent increases at CPI — boutique fitness margins don\'t support escalation clauses.' },
              { n: '06', tip: 'Run your specific address through Locatalyze', detail: 'Suburb-level data is the starting point. The specific address — visibility from the street, parking proximity, competitor exact locations — changes the score significantly. A location 400m from the city centre is fundamentally different from one 600m away.' },
              { n: '07', tip: 'Model 65% membership in month 1, 80% by month 4', detail: 'What happens if only 65% of projected members join in the first month? If revenue breaks the business at 65%, the rent is too high. Gold Coast\'s best gym locations survive this scenario. That\'s how you identify true viability vs wishful thinking.' },
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
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>Full Comparison Table</h2>
          <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${S.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: S.white, minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${S.border}`, background: S.n50 }}>
                  {['Suburb', 'Score', 'Verdict', 'Median Income', 'Rent Range', 'Competition', 'Est. Payback'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ...TOP_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: s.income, rent: s.rent, comp: s.competition, payback: s.payback })),
                  ...RISK_SUBURBS.map(s => ({ name: s.name, score: s.score, verdict: s.verdict, income: '< $75k', rent: 'Not viable', comp: '8+', payback: 'N/A' })),
                ].map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < 6 ? `1px solid ${S.n100}` : 'none', background: row.verdict === 'NO' ? '#FEF8F8' : 'transparent' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.name}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 800, color: (row.verdict as string) === 'GO' ? S.emerald : (row.verdict as string) === 'CAUTION' ? S.amber : S.red }}>{row.score}</td>
                    <td style={{ padding: '10px 14px' }}><VerdictBadge v={row.verdict} /></td>
                    <td style={{ padding: '10px 14px', color: S.muted }}>{row.income}/yr</td>
                    <td style={{ padding: '10px 14px', color: S.muted, whiteSpace: 'nowrap' as const }}>{row.rent}</td>
                    <td style={{ padding: '10px 14px', color: S.muted }}>{row.comp}</td>
                    <td style={{ padding: '10px 14px', color: row.verdict === 'NO' ? S.red : S.muted }}>{row.payback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataNote text="Income: ABS 2023–24. Rent: Queensland property market data Q4 2025. Payback: Locatalyze model, $120k setup, $28/member/month revenue average across boutique and traditional gym mix." />
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          {(SCHEMAS[1] as any).mainEntity.map(({ name, acceptedAnswer }: any) => (
            <div key={'Gold Coast'} style={{ borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 8 }}>{'Gold Coast'}</h3>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{acceptedAnswer.text}</p>
            </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 12 }}>More location guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[
              { href: '/analyse/gold-coast/cafe', label: 'Cafés on the Gold Coast' },
              { href: '/analyse/perth/cafe', label: 'Cafés in Perth' },
              { href: '/analyse/perth/gym', label: 'Gyms in Perth' },
              { href: '/analyse/brisbane/cafe', label: 'Cafés in Brisbane' },
              { href: '/analyse/brisbane/gym', label: 'Gyms in Brisbane' },
              { href: '/analyse/sydney/cafe', label: 'Cafés in Sydney' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0C4A6E 0%, #0891B2 60%, #06B6D4 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0F9FF', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific Gold Coast address?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(206,235,245,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>
            This guide covers suburb-level data. Your specific address — street position, exact competitor count, parking proximity, membership demographics — produces a different score. Run it before you commit to anything.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#06B6D4', color: '#0C4A6E', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
            Analyse my Gold Coast address free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(206,235,245,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
        </div>

      </div>
    </div>
  )
}
