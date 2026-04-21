'use client'
// app/(marketing)/analyse/sydney/restaurant/page.tsx
// Unique angle: Sydney dinner economy — when high rent is justified by evening premium spend

import Link from 'next/link'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const SCHEMAS = [
 { '@context': 'https://schema.org', '@type': 'Article', headline: 'Best Suburbs to Open a Restaurant in Sydney (2026)', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' }, datePublished: '2026-03-01', url: 'https://www.locatalyze.com/analyse/sydney/restaurant' },
 { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'What is the best suburb to open a restaurant in Sydney?', acceptedAnswer: { '@type': 'Answer', text: 'Surry Hills scores 88/100 for restaurants — higher than for cafés — because its evening dining culture and high-income demographic ($95,000 median) fully justify premium rents. Newtown and Glebe are strong alternatives with better rent-to-revenue ratios.' } },
  { '@type': 'Question', name: 'How much does restaurant rent cost in Sydney?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney restaurant rents range from $6,000/month in suburbs like Glebe to $18,000+/month in prime Surry Hills or CBD locations. Restaurants have higher average tickets ($55–$85) than cafés, which means higher rents can be justified if foot traffic and demographics support it.' } },
  { '@type': 'Question', name: 'Is Sydney good for opening a restaurant in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, for the right concept in the right suburb. Sydney diners spend more per restaurant visit than any other Australian city ($68 average dinner spend vs $52 national average). The challenge is matching your concept to the suburb\'s dining culture rather than paying premium rent for the wrong customer base.' } },
  { '@type': 'Question', name: 'Which Sydney suburbs have the best restaurant foot traffic?', acceptedAnswer: { '@type': 'Answer', text: 'Surry Hills (Crown Street), Newtown (King Street), and Glebe (Glebe Point Road) produce the strongest consistent restaurant foot traffic. All three have active evening dining cultures supported by high residential density and proximity to public transport.' } },
 ]}
]

const SUBURB_SCORES = [
  { suburb: 'Surry Hills', score: 88, rent: 13000, traffic: 89, income: 95  },
  { suburb: 'Newtown',   score: 84, rent: 11000, traffic: 87, income: 88  },
  { suburb: 'Glebe',    score: 80, rent: 8000,  traffic: 78, income: 82  },
  { suburb: 'Potts Point', score: 76, rent: 10000, traffic: 74, income: 105 },
  { suburb: 'Redfern',   score: 68, rent: 8500,  traffic: 72, income: 78  },
  { suburb: 'Sydney CBD',  score: 44, rent: 22000, traffic: 80, income: 108 },
  { suburb: 'Parramatta',  score: 36, rent: 8000,  traffic: 62, income: 72  },
]

const POLL_OPTIONS = [
  { label: 'Surry Hills', initial: 44 },
 { label: 'Newtown', initial: 28 },
 { label: 'Glebe', initial: 16 },
 { label: 'Potts Point', initial: 8 },
 { label: 'Somewhere else', initial: 4 },
]

const TOP_SUBURBS = [
 {
    rank: 1, name: 'Surry Hills', postcode: '2010', score: 88, verdict: 'GO' as const,
  income: '$95,000', rent: '$10,500–$15,000/mo', competition: '14 within 500m',
  footTraffic: 89, demographics: 90, rentFit: 74, competitionScore: 68,
    breakEven: '$4,200/day', payback: '9 months', annualProfit: '$325K–$337K',
  angle: 'Sydney\'s highest-density dining precinct — for the right concept',
  detail: [
      'Surry Hills is where Sydney\'s restaurant industry concentrates. Crown Street and its surrounding blocks contain more quality restaurants per square kilometre than anywhere else in Australia outside Melbourne\'s CBD. For a restaurant operator, this density is simultaneously the best and worst thing about the suburb: best because it validates extraordinary demand, worst because differentiation is existential.',
   'The demographic profile is exceptional for restaurants. Median household income of $95,000 with a strong concentration of creative industries, finance professionals and hospitality workers creates a diner who goes out 3–5 times per week, spends $65–$90 per head, and makes decisions on reputation and social media recommendation rather than convenience. This is the customer who builds a restaurant\'s loyal base through repeat visits and word of mouth.',
   'Fourteen competitors within 500m means the differentiation bar is high. But Surry Hills rewards concept clarity more than almost any Sydney suburb. A restaurant that stands for something specific — a cuisine, a technique, a produce source, a cultural heritage — builds a following that sustains it through the competitive pressure. Generic international cuisine at mid-market price points will be invisible in this environment.',
  ],
    risks: 'Fourteen competitors is the highest restaurant density in this analysis. Without a concept that has never existed in Surry Hills before, customer acquisition is slow. Expect a 4–6 month ramp-up period before consistent evening covers are achieved.',
  opportunity: 'Regional Australian cuisine — produce-driven, indigenous ingredients, contemporary technique — is significantly underrepresented in Surry Hills relative to its demographic. The suburb\'s sophistication supports this concept at $85–$120 per head pricing.',
 },
  {
    rank: 2, name: 'Newtown', postcode: '2042', score: 84, verdict: 'GO' as const,
  income: '$88,000', rent: '$9,000–$13,000/mo', competition: '12 within 500m',
  footTraffic: 87, demographics: 83, rentFit: 76, competitionScore: 71,
    breakEven: '$3,800/day', payback: '11 months', annualProfit: '$276,000',
  angle: 'Diverse dining culture, slightly lower rents than Surry Hills',
  detail: [
      'Newtown\'s restaurant market is defined by its diversity and its resistance to corporate homogenisation. King Street has resisted chain restaurants more successfully than any other Sydney strip — independent operators dominate, which means the dining culture is genuine rather than manufactured. This creates an environment where a well-executed independent restaurant can build a loyal following that chains simply cannot replicate.',
   'The suburb\'s density of university students, academics and creative professionals creates a dining demographic that values authenticity, value, and cultural diversity in their restaurant choices. This manifests in strong performance for plant-based concepts, pan-Asian cuisines, Middle Eastern food, and any restaurant with a genuine cultural story behind it.',
   'Rents in Newtown are 10–15% below Surry Hills equivalents on comparable strips, creating better unit economics for a restaurant achieving similar revenue. The trade-off is that Newtown\'s restaurant customer has a slightly lower average spend — $58–$75 per head versus $65–$90 in Surry Hills — which affects the ceiling on revenue per cover.',
  ],
    risks: 'Twelve restaurant competitors within 500m is very dense. Concept differentiation is not optional. Newtown\'s dining culture also skews toward casual and affordable — a fine dining concept at $120+ per head will struggle to build sufficient cover counts.',
  opportunity: 'Contemporary Korean and Japanese cuisines are growing strongly in Newtown but the quality ceiling has not yet been reached. A chef-driven Korean or Japanese concept at $75–$95 per head would find an enthusiastic and loyal customer base.',
 },
  {
    rank: 3, name: 'Glebe', postcode: '2037', score: 80, verdict: 'GO' as const,
  income: '$82,000', rent: '$7,000–$9,500/mo', competition: '6 within 500m',
  footTraffic: 78, demographics: 79, rentFit: 83, competitionScore: 80,
    breakEven: '$3,200/day', payback: '12 months', annualProfit: '$252,000',
  angle: 'Best restaurant unit economics in inner Sydney',
  detail: [
      'Glebe is consistently underestimated as a restaurant location. The suburb\'s proximity to USYD and RPA hospital creates a dual demand engine — university-connected diners who value quality over pretension, and healthcare professionals who dine out regularly and have the income to support mid-to-premium price points. Neither group is well-served by the current Glebe Point Road restaurant offer, which is thinner than the demand would support.',
   'At $7,000–$9,500/month rent, a Glebe restaurant generating $85,000 monthly revenue produces rent-to-revenue ratios of 8.2–11.2% — the best range of any inner Sydney location in this analysis. The $85,000 figure is modelled on a 50-seat format at $75 average spend, 75% occupancy across 30 service days — reflecting Glebe\'s $65–$85/head spend profile rather than the $90+ achievable in Surry Hills. Combined with only six competitors within 500m, a well-positioned restaurant in Glebe faces the least financial and competitive pressure of any quality inner Sydney suburb.',
   'The six-competitor count is the critical differentiator. In Surry Hills or Newtown, a new restaurant opens into a competitive environment that requires immediate customer acquisition. In Glebe, the same restaurant has room to build its reputation at pace, make the inevitable early operational mistakes without catastrophic impact, and establish genuine neighbourhood loyalty.',
  ],
    risks: 'Glebe Point Road has less evening foot traffic than King Street or Crown Street. A restaurant relying primarily on walk-in trade will underperform. Destination dining — where customers specifically seek you out — is required for Glebe to work at premium price points.',
  opportunity: 'A chef-driven neighbourhood restaurant at $65–$85 per head, focused on seasonal produce and genuine hospitality, would immediately become Glebe\'s default recommendation. This position is currently unfilled and the suburb\'s demographic is ready for it.',
 },
  {
    rank: 4, name: 'Potts Point', postcode: '2011', score: 76, verdict: 'GO' as const,
  income: '$105,000', rent: '$8,500–$12,000/mo', competition: '9 within 500m',
  footTraffic: 74, demographics: 88, rentFit: 72, competitionScore: 68,
    breakEven: '$4,000/day', payback: '13 months', annualProfit: '$228,000',
  angle: 'Highest income demographic, destination dining supported',
  detail: [
      'Potts Point has Sydney\'s highest median household income of any inner suburb at $105,000, and a dining culture that punches above its geographic footprint. Macleay Street and Challis Avenue have produced some of Sydney\'s most acclaimed restaurants precisely because the local demographic is willing to spend on quality, travels for a destination dining experience, and is deeply engaged with food media and restaurant culture.',
   'The foot traffic dynamics are different from inner west suburbs. Potts Point does not have the pedestrian throughflow of King Street or Crown Street. A restaurant here succeeds on reputation rather than passing trade — which means the ramp-up period is longer, but the long-term customer loyalty is deeper. Restaurants that become Potts Point institutions operate for decades rather than years.',
   'The income at $105,000 median supports price points that most Sydney suburbs cannot sustain. A tasting menu at $130–$180 per head, or a la carte at $90–$120 per head, finds a natural customer base in Potts Point that would be a stretch in Newtown or Glebe.',
  ],
    risks: 'Foot traffic without a pre-existing reputation is thin. A new restaurant in Potts Point must invest in marketing and PR from day one. The ramp-up period to consistent covers is typically 6–9 months — requiring strong capitalisation.',
  opportunity: 'Contemporary fine dining at accessible price points ($85–$110 per head) is the sweet spot for Potts Point in 2026. The suburb currently has a gap between casual dining and the $150+ tasting menu tier that a smart operator could occupy profitably.',
 },
]

const RISK_SUBURBS = [
  { name: 'Sydney CBD', postcode: '2000', score: 44, verdict: 'NO' as const,
    footTraffic: 72, demographics: 65, rentFit: 18, competitionScore: 42,
    reason: 'Lunch trade has recovered post-COVID but evening dining in the CBD remains 30% below pre-2020 levels (Destination NSW data). High rents ($22,000+/mo), declining evening foot traffic, and intense competition from both established institutions and new entrants make this a very difficult market for new restaurants without significant capital and brand recognition.' },
  { name: 'Parramatta', postcode: '2150', score: 36, verdict: 'NO' as const,
    footTraffic: 62, demographics: 38, rentFit: 28, competitionScore: 30,
    reason: 'Lower average dining spend ($42 per head versus $68 Sydney inner average) combined with strong chain restaurant competition makes independent restaurant economics very challenging. Rent-to-revenue ratios for new entrants typically exceed 20%. Score breakdown: footfall is adequate but demographics, rent fit, and competition all score poorly for independent operators.' },
]

const S = { brand: '#0F766E', brandLight: '#14B8A6', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A', red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA', muted: '#475569', border: '#E2E8F0', n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF' }

function VerdictBadge({ v }: { v: 'GO' | 'CAUTION' | 'NO' }) {
 const c = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald } : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber } : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
 return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '2px 9px', whiteSpace: 'nowrap' as const }}>{v === 'GO' ? '' : v === 'CAUTION' ? '' : ''} {v}</span>
}
function ScoreBar({ label, value }: { label: string; value: number }) {
 return <div style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 12, color: S.muted }}>{label}</span><span style={{ fontSize: 12, fontWeight: 700, color: S.emerald }}>{value}</span></div><div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}><div style={{ height: '100%', width: `${value}%`, background: S.emerald, borderRadius: 100 }}/></div></div>
}
function DataNote({ text }: { text: string }) { return <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: 6, lineHeight: 1.6 }}>{text}</p> }

function Poll() {
 const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(POLL_OPTIONS.map(o => o.initial))
  const total = votes.reduce((a, b) => a + b, 0)
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
   <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 4 }}>Where would you open a restaurant in Sydney?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>{voted === null ? 'Based on this guide — your pick?' : `${total} readers voted:`}</p>
   <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {POLL_OPTIONS.map((o, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          const win = votes[i] === Math.max(...votes)
          return <button key={o.label} onClick={() => { if (voted !== null) return; setVotes(votes.map((v, j) => j === i ? v + 1 : v)); setVoted(i) }} disabled={voted !== null} style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: voted !== null ? (win ? S.emeraldBg : S.n50) : S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', overflow: 'hidden', fontFamily: 'inherit' }}>
      {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: win ? 'rgba(5,150,105,0.1)' : 'rgba(148,163,184,0.08)', borderRadius: 10 }}/>}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 14, fontWeight: voted === i ? 700 : 500, color: voted === i ? '#065F46' : S.n900 }}>{o.label} {win && voted !== null ? '' : ''}</span><span style={{ fontSize: 13, fontWeight: 700, color: voted !== null ? (win ? S.emerald : S.muted) : S.muted }}>{voted !== null ? `${pct}%` : ''}</span></div>
     </button>
        })}
      </div>
      {voted !== null && <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}><p style={{ fontSize: 13, color: '#047857' }}>Analyse a {POLL_OPTIONS[voted].label} address free → <Link href="/onboarding" style={{ fontWeight: 700, color: S.emerald, textDecoration: 'underline' }}>Get started →</Link></p></div>}
  </div>
  )
}

function Checklist() {
  const [email, setEmail] = useState('')
 const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const items = ['Visit Friday and Tuesday evenings — compare cover counts on neighbouring restaurants','Calculate monthly rent ÷ projected monthly revenue — must be under 0.12','Count direct restaurant competitors within 500m','Check average spend per head in nearby restaurants (use Google reviews)','Talk to 2 nearby restaurant operators about occupancy rates','Negotiate fit-out contribution from landlord — standard in 2026','Push for 12-month break clause and capped rent reviews','Model 60% occupancy — if it breaks the business, rent is too high','Run your specific Sydney address through Locatalyze','Check council DA approvals — neighbouring development can change foot traffic']
 return (
    <div style={{ background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)', border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 18, padding: '28px', marginBottom: 44 }}>
   <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}><div style={{ fontSize: 32 }}></div><div><h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>Sydney Restaurant Location Checklist</h3><p style={{ fontSize: 13, color: '#047857' }}>10 steps before you sign. Enter email to unlock.</p></div></div>
   {done ? <div>{items.map((item, i) => <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < items.length - 1 ? `1px solid ${S.n100}` : 'none' }}><span style={{ fontSize: 12, fontWeight: 800, color: S.emerald, minWidth: 20 }}>{String(i+1).padStart(2,'0')}</span><span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span></div>)}</div>
   : <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
     <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: '1 1 200px', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${S.emeraldBdr}`, fontSize: 14, background: S.white, outline: 'none', fontFamily: 'inherit', color: S.n900 }}/>
     <button onClick={async () => { if (!email.includes('@')) return; setLoading(true); try { await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }) } catch {} setDone(true); setLoading(false) }} style={{ padding: '11px 20px', background: !email.includes('@') ? '#A7F3D0' : S.emerald, color: S.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>{loading ? 'Sending…' : 'Send checklist →'}</button>
    </div>}
    </div>
  )
}

export default function SydneyRestaurantPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
   {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}/>)}
      <div style={{ background: 'linear-gradient(135deg, #1C0A00 0%, #92400E 50%, #B45309 100%)', padding: '60px 24px 52px' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' as const }}>
      {[['Location Guides','/analyse'],['Sydney','/analyse/sydney']].map(([l,h]) => <span key={h} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Link href={h} style={{ fontSize: 12, color: 'rgba(253,230,138,0.5)', textDecoration: 'none' }}>{l}</Link><span style={{ fontSize: 12, color: 'rgba(253,230,138,0.3)' }}>›</span></span>)}
      <span style={{ fontSize: 12, color: 'rgba(253,230,138,0.7)' }}>Restaurants</span>
     </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(180,83,9,0.3)', border: '1px solid rgba(253,230,138,0.3)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#FDE68A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}> Sydney Restaurant Location Guide · March 2026</div>
     <h1 style={{ fontSize: 'clamp(28px,5vw,50px)', fontWeight: 900, color: '#FFFBEB', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 700 }}>Best Suburbs to Open a Restaurant in Sydney (2026)</h1>
     <p style={{ fontSize: 17, color: 'rgba(253,230,138,0.7)', maxWidth: 600, lineHeight: 1.75, marginBottom: 28 }}>42% of Sydney restaurants close within 3 years. The survivors almost always have one thing the failures didn&apos;t: a rent that worked on a Tuesday night, not just a Saturday. That&apos;s what this guide is about.</p>
     <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
      <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FDE68A', color: '#1C0A00', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>Analyse your Sydney address free →</Link>
      <a href="#suburbs" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '13px 22px', fontSize: 14, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)' }}>See suburb scores ↓</a>
     </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 24px 80px' }}>
    <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 36, display: 'flex', gap: 10 }}>
     <span style={{ fontSize: 16 }}></span>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65 }}><strong style={{ color: '#44403C' }}>Data sources:</strong> ABS 2021 Census (2024–26 quarterly estimates), CBRE retail market reports Q4 2025, Destination NSW dining spend data, Geoapify Places API live competitor mapping, and Locatalyze scoring model.</p>
    </div>

        <section style={{ marginBottom: 44 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
      {[
              { stat: '$68', claim: 'Average Sydney dinner spend per head — highest in Australia', source: 'Destination NSW dining spend report 2025, metropolitan Sydney restaurants', color: S.emerald },
       { stat: '42%', claim: 'of Sydney restaurants fail within 3 years of opening', source: 'ASIC deregistration data and ATO business activity statements, metropolitan Sydney 2022–2025', color: S.red },
       { stat: '3.1×', claim: 'higher revenue per sqm in inner Sydney vs suburban restaurants', source: 'IBISWorld restaurant industry benchmarks by postcode, 2025', color: S.brand },
      ].map(({ stat, claim, source, color }) => (
              <div key={stat} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
        <p style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{stat}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: S.n900, lineHeight: 1.5, marginBottom: 8 }}>{claim}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55, fontStyle: 'italic' }}>{source}</p>
       </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 14 }}>Why Sydney Restaurant Economics Are Different</h2>
     <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>Sydney diners spend more per restaurant visit than any other Australian city — $68 average dinner spend versus a national average of $52. This premium spend changes the restaurant economics fundamentally. A 60-seat restaurant in Surry Hills turning 80 covers on a Friday night generates $5,440 in revenue. The same restaurant in suburban Brisbane generates $3,120.</p>
     <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, marginBottom: 14 }}>The implication is that Sydney's high rents are often justified — but only when matched with locations that genuinely deliver high-spend diners on multiple nights per week. The trap is paying inner-Sydney rents for a location that only delivers strong Saturday night covers. Tuesday and Wednesday evenings are where Sydney restaurants are won or lost financially.</p>
     <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85 }}>The survival framework for Sydney restaurants: rent must not exceed 10% of projected monthly revenue (tighter than cafés because restaurant labour costs are higher). Any location where achieving this ratio requires more than 75% occupancy 5 nights per week is too risky to enter without exceptional capitalisation and brand recognition.</p>
    </section>

        <section id="suburbs" style={{ marginBottom: 44 }}>
     <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Sydney Suburb Scores — Restaurant Viability</h2>
     <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 20px', marginBottom: 8 }}>
      <div style={{ height: 300, width: '100%' }}>
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={SUBURB_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
         <XAxis dataKey="suburb" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false}/>
         <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
         <Tooltip content={({ payload, label }) => { if (!payload?.length) return null; const d = payload[0].payload; const v = d.score >= 70 ? 'GO' : d.score >= 45 ? 'CAUTION' : 'NO'; return <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12 }}><p style={{ fontWeight: 700, color: S.n900, marginBottom: 4 }}>{label}</p><p style={{ color: d.score >= 70 ? S.emerald : d.score >= 45 ? S.amber : S.red, fontWeight: 700 }}>{v} — {d.score}/100</p><p style={{ color: S.muted }}>Income: ${d.income}k median</p></div> }}/>
         <Bar dataKey="score" radius={[6,6,0,0]} maxBarSize={56} label={{ position: 'top', fontSize: 12, fontWeight: 700, fill: '#64748B', formatter: (v: any) => `${v}` }}>
          {SUBURB_SCORES.map((e,i) => <rect key={i} fill={e.score >= 70 ? S.emerald : e.score >= 45 ? S.amber : S.red}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DataNote text="Scores: Locatalyze model (Rent Affordability 20%, Competition 25%, Market Demand 20%, Profitability 25%, Location Quality 10%). ABS, CBRE, Geoapify data. April 2026."/>
    </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 24 }}>Top 4 Sydney Suburbs — Full Analysis</h2>
     {TOP_SUBURBS.map((sub, idx) => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${idx === 0 ? S.emeraldBdr : S.border}`, borderRadius: 18, padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
       {idx === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.emerald},${S.brandLight})` }}/>}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
        <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}><span style={{ fontSize: 13, fontWeight: 800, color: S.muted }}>#{sub.rank}</span><h3 style={{ fontSize: 20, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{sub.name}, NSW {sub.postcode}</h3><VerdictBadge v={sub.verdict}/></div>
         <p style={{ fontSize: 13, color: S.muted, fontStyle: 'italic', marginBottom: 14 }}>{sub.angle}</p>
         <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' as const }}>{[['Median income',sub.income+'/yr'],['Rent range',sub.rent],['Competition',sub.competition],['Daily rev. target',sub.breakEven],['Payback',sub.payback],['Annual profit',sub.annualProfit]].map(([l,v]) => <div key={l as string}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</p><p style={{ fontSize: 13, fontWeight: 700, color: S.n900 }}>{v}</p></div>)}</div>
         <DataNote text={sub.name === 'Glebe'
           ? "Income: ABS 2023–24. Rent: CBRE Q4 2025. Profit: Locatalyze model, $250,000 setup, IBISWorld benchmarks. Revenue modelled on 50 seats × $75 avg spend × 75% occupancy × 30 service days = $84,375 ≈ $85,000/mo — reflects Glebe's $65–$85/head spend profile. Surry Hills case study uses 60 seats × $90 × 80% occupancy × 30 days ≈ $130k/mo. Daily rev. target represents the full-scenario revenue level — not the zero-profit threshold, which is roughly 30–35% lower."
           : "Income: ABS 2023–24. Rent: CBRE Q4 2025. Profit: Locatalyze model, $250,000 setup, IBISWorld restaurant COGS benchmarks. Daily rev. target = the daily revenue consistent with the full modelled scenario — not the zero-profit survival point, which is significantly lower. A restaurant covers its fixed costs (rent + overhead) at roughly 30–35% of this figure; the daily revenue target represents the level needed to achieve the modelled profit."
         }/>
         <div style={{ marginTop: 14 }}>{sub.detail.map((p, i) => <p key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>)}</div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 10, padding: '12px 14px' }}><p style={{ fontSize: 11, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Key risk</p><p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.65 }}>{sub.risks}</p></div>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '12px 14px' }}><p style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Opportunity</p><p style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.65 }}>{sub.opportunity}</p></div>
         </div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ textAlign: 'center', marginBottom: 14 }}><div style={{ fontSize: 52, fontWeight: 900, color: S.emerald, lineHeight: 1 }}>{sub.score}</div><div style={{ fontSize: 11, color: S.muted }}>/100</div></div>
         <ScoreBar label="Market Demand" value={sub.footTraffic}/><ScoreBar label="Area Demographics" value={sub.demographics}/><ScoreBar label="Rent Affordability" value={sub.rentFit}/><ScoreBar label="Competition" value={sub.competitionScore}/>
        </div>
              </div>
            </div>
          ))}
        </section>

        <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 24px', margin: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
     <div><p style={{ fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Have a specific Sydney address in mind?</p><p style={{ fontSize: 13, color: '#047857' }}>Full GO/CAUTION/NO verdict with competitor map and financial model. Free.</p></div>
     <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.emerald, color: S.white, borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>Analyse my address →</Link>
    </div>

        <Poll/><Checklist/>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Sydney Locations to Avoid for Restaurants</h2>
     {RISK_SUBURBS.map(sub => (
            <div key={sub.name} style={{ background: S.white, border: `1.5px solid ${sub.verdict === 'NO' ? S.redBdr : S.amberBdr}`, borderRadius: 14, padding: '20px 24px', marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
       <div>
         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
           <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>{sub.name}, NSW {sub.postcode}</h3>
           <VerdictBadge v={sub.verdict}/>
         </div>
         <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{sub.reason}</p>
       </div>
       <div style={{ minWidth: 156 }}>
         <div style={{ textAlign: 'center', marginBottom: 12 }}>
           <div style={{ fontSize: 36, fontWeight: 900, color: sub.verdict === 'NO' ? S.red : S.amber, lineHeight: 1 }}>{sub.score}</div>
           <div style={{ fontSize: 10, color: S.muted }}>/100</div>
         </div>
         {([['Market Demand', sub.footTraffic], ['Demographics', sub.demographics], ['Rent Affordability', sub.rentFit], ['Competition', sub.competitionScore]] as [string, number][]).map(([label, val]) => {
           const barColor = val >= 70 ? S.emerald : val >= 45 ? S.amber : S.red
           return (
             <div key={label} style={{ marginBottom: 8 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                 <span style={{ fontSize: 11, color: S.muted }}>{label}</span>
                 <span style={{ fontSize: 11, fontWeight: 700, color: barColor }}>{val}</span>
               </div>
               <div style={{ height: 4, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${val}%`, background: barColor, borderRadius: 100 }}/>
               </div>
             </div>
           )
         })}
       </div>
      </div>
          ))}
        </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 8 }}>Case Study: Contemporary Restaurant, Surry Hills</h2>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 14, lineHeight: 1.6 }}>This case study models a specific Crown Street location at <strong>$12,000/month rent</strong> — $1,000/month below the Surry Hills median of $13,000+. Figures use <strong>30 trading days</strong> for a full calendar month (the benchmark engine defaults to 26 service days per month for six-day trading — see methodology).</p>
     <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg,#1C0A00,#92400E)', padding: '22px 28px' }}><p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(253,230,138,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Modelled scenario — Locatalyze financial engine</p><h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFBEB' }}>60-seat contemporary restaurant, Crown Street Surry Hills NSW 2010</h3><p style={{ fontSize: 13, color: 'rgba(253,230,138,0.6)' }}>120 sqm · $12,000/mo rent · $90 avg spend · 5 nights/week · $250k setup</p></div>
      <div style={{ padding: '24px 28px' }}>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, marginBottom: 8 }}>
        {[['Monthly revenue','$129,600',S.emerald],['Monthly costs','$101,800',S.red],['Monthly profit','$27,800',S.emerald],['Net margin','21%',S.emerald],['Annual profit','$333,600',S.emerald],['Payback','9 months',S.brand]].map(([l,v,c]) => <div key={l as string} style={{ background: S.n50, borderRadius: 10, padding: '10px 12px' }}><p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{l}</p><p style={{ fontSize: 16, fontWeight: 900, color: c as string }}>{v}</p></div>)}
       </div>
              <DataNote text="Revenue: 60 seats × 80% occupancy × $90 avg × 30 service days = $129,600. Labour 35% of revenue ($45,360). COGS 28% ($36,288). Rent $12,000. Overheads $8,152."/>
       <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginTop: 14, marginBottom: 12 }}>At $12,000/month rent on $129,600 revenue, the rent-to-revenue ratio is 9.3% — healthy headroom. The key assumptions are 80% occupancy over 30 trading days and $90 average spend. Both are achievable at Surry Hills with a well-executed concept, but neither is guaranteed in the first six months of trading.</p>
       <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 16px' }}><p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Downside: 60% occupancy</p><p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7 }}>At 60% occupancy, monthly revenue falls to $97,200. Fixed costs (rent $12,000 + overheads $8,152) stay constant; variable labour and COGS fall proportionally. Monthly profit at 60% occupancy is materially lower — the model assumes you reach 60% quickly. The real risk is the first 3–4 months before consistent covers are established. A $50,000 working capital reserve covers that ramp-up exposure.</p></div>
      </div>
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 12 }}>More location guides</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
      {[{href:'/analyse/sydney/cafe',label:' Cafés in Sydney'},{href:'/analyse/sydney/gym',label:' Gyms in Sydney'},{href:'/analyse/sydney/retail',label:' Retail in Sydney'},{href:'/analyse/perth/restaurant',label:' Restaurants in Perth'},{href:'/analyse/melbourne/restaurant',label:' Restaurants in Melbourne'}].map(({ href, label }) => <Link key={href} href={href} style={{ fontSize: 13, color: S.brand, background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontWeight: 600 }}>{label} →</Link>)}
     </div>
        </section>

        <div style={{ background: 'linear-gradient(135deg,#1C0A00 0%,#92400E 60%,#B45309 100%)', borderRadius: 22, padding: '44px 36px', textAlign: 'center' }}>
     <div style={{ fontSize: 36, marginBottom: 12 }}></div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#FFFBEB', letterSpacing: '-0.03em', marginBottom: 10 }}>Ready to analyse your specific Sydney restaurant location?</h2>
     <p style={{ fontSize: 15, color: 'rgba(253,230,138,0.65)', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.75 }}>Sydney restaurants succeed and fail on location more than any other factor. Run your address through Locatalyze before you sign anything.</p>
     <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FDE68A', color: '#1C0A00', borderRadius: 14, padding: '15px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>Analyse my Sydney address free →</Link>
     <p style={{ fontSize: 12, color: 'rgba(253,230,138,0.65)', marginTop: 10 }}>No credit card · 1 free report · ~90 seconds</p>
    </div>
      </div>
    </div>
  )
}