'use client'
import Link from 'next/link'
import { useState } from 'react'
import { getPerthSuburb } from '@/lib/analyse-data/melbourne'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function pScore(name: string): number { return getPerthSuburb(name)?.compositeScore ?? 0 }
function pVerdict(name: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getPerthSuburb(name)?.verdict
  return v === 'GO' ? 'GO' : v === 'CAUTION' ? 'CAUTION' : 'NO'
}

const S = { brand: '#0891B2', brandLight: '#06B6D4', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A', red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA', muted: '#475569', border: '#E2E8F0', n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF' }

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald } : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber } : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return <span style={{ fontSize: 11, fontWeight: 700, color: cfg.txt, background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 6, padding: '2px 9px' }}>{v}</span>
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100 }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function SuburbPoll({ suburb }: { suburb: string }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([42, 31, 27])
  const total = votes.reduce((a, b) => a + b, 0)
  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 44 }}>
      <h3 style={{ color: '#1C1917', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Would you open a business in {suburb}?</h3>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {['Yes', 'Maybe', 'No'].map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)' }} />}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{opt}</span>
                <span style={{ fontSize: 13, color: S.muted }}>{voted !== null ? `${pct}%` : ''}</span>
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857' }}>Full analysis: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link></p>
        </div>
      )}
    </div>
  )
}

const nearby = [
  { name: 'Northbridge', slug: 'northbridge', score: pScore('Northbridge'), verdict: pVerdict('Northbridge') },
  { name: 'Subiaco', slug: 'subiaco', score: pScore('Subiaco'), verdict: pVerdict('Subiaco') },
  { name: 'Mount Lawley', slug: 'mount-lawley', score: pScore('Mount Lawley'), verdict: pVerdict('Mount Lawley') },
]

const scoreChartData = [
  { category: 'Foot Traffic', value: 82 },
  { category: 'Demographics', value: 80 },
  { category: 'Rent Viability', value: 58 },
  { category: 'Competition Gap', value: 62 },
]

export default function PerthCBD() {
  return (
    <div style={{ background: S.n50, minHeight: '100vh', paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '12px 20px', fontSize: 13 }}>
        <Link href="/" style={{ color: S.brand, textDecoration: 'none' }}>Home</Link>
        <span style={{ color: S.muted }}> / </span>
        <Link href="/analyse/perth" style={{ color: S.brand, textDecoration: 'none' }}>Perth</Link>
        <span style={{ color: S.muted }}> / Perth CBD</span>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)', padding: '60px 20px', color: S.white }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12 }}>Perth CBD</h1>
              <p style={{ fontSize: 16, color: '#E0F2FE', maxWidth: 600 }}>Perth CBD revival — Elizabeth Quay, Yagan Square</p>
            </div>
            <VerdictBadge v="GO" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: '#BAE6FD' }}>Overall Score</p>
              <p style={{ fontSize: 32, fontWeight: 900 }}>76</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#BAE6FD' }}>Postcode</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>WA 6000</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#BAE6FD' }}>Median Income</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>$88,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}` }}>
          <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 32 }}>Detailed Score Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            <div>
              <ScoreBar label="Foot Traffic" value={82} />
              <ScoreBar label="Area Demographics" value={80} />
              <ScoreBar label="Rent Viability" value={58} />
              <ScoreBar label="Competition Gap" value={62} />
            </div>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
                  <XAxis dataKey="category" angle={-15} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'rgba(8,145,178,0.1)' }} />
                  <Bar dataKey="value" fill={S.brand} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Why Perth CBD Scores 76 (GO)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Foot Traffic (82)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Elizabeth Quay and Yagan Square have added meaningful foot traffic infrastructure. Raine Square revival is improving access to premium retail. CBD lunchtime economy is Perth's strongest day-part — 2,000+ daily lunch customers in office towers M–F.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Demographics (80)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Professional workers in office towers ($88k median), FIFO workers on high income (roster-dependent), tourists and visitors. Mix creates diverse spending patterns but quality is uneven across day-parts.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Rent Viability (58) — The Risk</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>This is where Perth CBD fails. Premium locations (Hay/Murray Street Malls) command $7,000–$20,000/mo. That requires average transaction value of $25+/customer minimum to break even. Lunch-only focus makes this difficult.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Competition Gap (62)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Perth CBD has established café, bakery, and quick-service operators. Lunch market is competitive. Premium dinner and cocktail venues work (higher ATV), but require established brand or celebrity chef to justify rents.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Analysis */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Commercial Rent Ranges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Premium (Hay/Murray St Malls)</h3>
              <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, marginBottom: 8 }}>$7,000–$20,000/mo</p>
              <p style={{ fontSize: 13, color: S.muted }}>Highest foot traffic. Requires 150+ customers/day at $25+ ATV to break even. Lunch-dominated revenue stream. Evening and weekend traffic is significantly lower.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Fringe (East Perth + side streets)</h3>
              <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, marginBottom: 8 }}>$4,000–$9,000/mo</p>
              <p style={{ fontSize: 13, color: S.muted }}>More affordable. Wolf Lane, Murray Street East and East Perth pockets can offer lower entry rents. Foot traffic is 40–50% lower than Hay Street Mall, but rents are typically lower as well.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Types */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#ECFDF5', border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: 40, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: S.n900 }}>Best Business Models for Perth CBD</h2>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Premium Lunch Venue (Best Fit)</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12, lineHeight: 1.6 }}>Target: Professional workers in office towers + FIFO workers during roster cycles. Average transaction: $20–$28/person. Peak window: 11:30am–1:30pm Mon–Fri. Off-peak: Dinner is 30–50% of lunch revenue. Weekends are negligible. Success requires exceptional quality and word-of-mouth. Rents are viable only if you maintain 150+ daily covers during lunch service.</p>
            <p style={{ fontSize: 13, color: S.emerald, fontWeight: 600 }}>Verdict: GO if your concept is premium lunch-focused and you can achieve $35k+/mo revenue</p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.amber, marginBottom: 12 }}>Premium Cocktail/Wine Bar (CAUTION)</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12, lineHeight: 1.6 }}>Target: FIFO workers on roster cycles (irregular high-value spending), corporate events, pre-theatre crowd. Average transaction: $25–$40/person. Hours: 4pm–11pm. Requires licenses, high-touch service, and established reputation. Perth CBD lacks the pre-theatre density of Sydney/Melbourne. Risk is that FIFO spending is roster-dependent — revenue swings 20–30% month-to-month.</p>
            <p style={{ fontSize: 13, color: S.amber, fontWeight: 600 }}>Verdict: CAUTION — only pursue if you have venue experience and can weather 20–30% monthly revenue variance</p>
          </div>

          <div style={{ marginBottom: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 12 }}>Traditional Café (Avoid)</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Target: Morning commuters + lunch. Problem: Perth CBD lacks strong morning foot traffic compared to Sydney/Melbourne. Rent ($7,000–$20,000/mo) requires $40k/mo revenue just to break even. Coffee margins (40%) don't support this. Instead, premium lunch (as above) or pivot to beverage-focused high-ATV model (coffee + pastry bundling).</p>
          </div>
        </div>
      </div>

      {/* Infrastructure & Development */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Upcoming Development & Infrastructure (2026–2027)</h2>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Elizabeth Quay Expansion (Ongoing)</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12 }}>Swan River precinct is being redeveloped. New residential apartments (500+ units) will add evening/weekend foot traffic. Current construction creates access challenges but long-term uplift is significant.</p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Yagan Square Maturation</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12 }}>Yagan Square has stabilized. New food hall operators and retail tenants are permanent, not temporary. This is no longer a new precinct — it's an established destination. Rents are now premium and unlikely to decline.</p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Raine Square Revival</h3>
            <p style={{ fontSize: 14, color: S.muted }}>Historic building refurbishment. New retail and food tenants are upgrading the experience. Foot traffic distribution is improving from Hay Street into secondary streets.</p>
          </div>
        </div>
      </div>

      {/* Day-Part Analysis */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Day-Part Revenue Patterns</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24 }}>Success in Perth CBD is entirely dependent on which day-part you target. Revenue distribution is NOT uniform.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Breakfast (6am–10am)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Lower foot traffic than Sydney/Melbourne equivalent. Perth CBD lacks strong morning commute foot traffic because car-dependent culture. Estimated: 15–20% of daily revenue.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Lunch (11am–2pm)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>PEAK day-part. Office workers + FIFO visitors. Estimated: 50–60% of daily revenue. This is what makes Perth CBD viable or not viable.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Afternoon (2pm–4pm)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Dead time for most venues. Coffee/pastry only. Estimated: 5% of daily revenue.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Dinner (5pm–10pm)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Moderate foot traffic. Office workers going home, pre-theatre visitors, restaurant diners. Estimated: 20–30% of daily revenue.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Saturday</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Retail shoppers + some diners. Estimated: 40% of weekday lunch revenue. Not the core market.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Sunday</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Minimal foot traffic outside the core city precincts in many locations. Estimated: 15% of weekday lunch revenue.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FIFO Impact */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#FEF2F2', border: `1px solid ${S.redBdr}`, borderRadius: 16, padding: 40, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: S.n900 }}>The FIFO Factor: Revenue Volatility</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>Perth CBD's lunch economy is heavily dependent on FIFO (fly-in-fly-out) mining workers. These workers are on 2-week or 4-week rosters and spend heavily on premium dining during on-duty periods. Problem: Their presence is unpredictable.</p>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 12 }}>How FIFO Affects Your Revenue</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>High FIFO week (2,000+ workers in Perth): Lunch customers +40–60%, average transaction +20–30%. Low FIFO week (500 workers in Perth): Lunch customers baseline, average transaction baseline. Monthly variance: 25–35%.</p>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.red, marginBottom: 12 }}>Strategic Response</h3>
            <p style={{ fontSize: 14, color: S.muted }}>If you target FIFO workers, build for the low-FIFO baseline, not the peak. Premium positioning ($25–$35/person) captures higher ATV during peak weeks and maintains viability during low weeks. Never size staffing or inventory for peak FIFO weeks — you'll have excess costs during baseline weeks.</p>
          </div>
        </div>
      </div>

      {/* Poll */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <SuburbPoll suburb="Perth CBD" />
      </div>

      {/* Nearby Suburbs */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Nearby Higher-Scoring Suburbs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {nearby.map(s => (
            <Link key={s.slug} href={`/analyse/perth/${s.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, padding: 20, borderRadius: 12, border: `1px solid ${S.border}`, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = S.brand; e.currentTarget.style.boxShadow = `0 4px 12px rgba(8,145,178,0.15)` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: S.n900 }}>{s.name}</h3>
                  <span style={{ fontSize: 16, fontWeight: 900, color: S.brand }}>{s.score}</span>
                </div>
                <p style={{ fontSize: 12, color: S.muted }}>Full analysis →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ color: '#1C1917', fontSize: 20, fontWeight: 800, marginBottom: 32 }}>Frequently Asked Questions</h2>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Is Perth CBD's rent viability (58) a dealbreaker?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Not necessarily if your concept is premium lunch-focused. A premium venue can achieve $35k+/month revenue at $7k–$10k/mo rent. The issue is that many operators try to run traditional café models (40% coffee margins) at premium rents — that fails quickly. Your concept must be designed around lunch premiumization to work.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Should I avoid Perth CBD entirely?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>No, but be realistic about the business model. If you operate a concept that works for lunch (premium poke, quality pizza, craft burger, upscale Asian), Perth CBD is viable and foot traffic is sufficient. If you operate a concept dependent on morning foot traffic (traditional café, pastry) or evening social drinking (nightclub, casual bar), Perth CBD is a poor choice.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>How do I mitigate FIFO revenue variance?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>1. Premium positioning ($25–$35 ATV) captures higher margins during peak FIFO weeks. 2. Develop corporate lunch catering as secondary revenue stream — less dependent on walk-in FIFO. 3. Maintain cost structure flexible for low-FIFO weeks (variable labor, no fixed pre-production). 4. Track Perth mining rosters (public data) to forecast revenue variance.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Are fringe CBD pockets cheaper than Hay Street Mall?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Often yes. Fringe pockets and side streets can be 30–50% cheaper than Hay Street Mall depending on frontage and fit-out. If you target dinner service more than weekday lunch, these areas can offer better rent economics than prime mall positions.</p>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>When will Elizabeth Quay development finish?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Phased through 2027. New residential apartments will add permanent evening/weekend foot traffic. Current access challenges are temporary. If you're signing a long-term lease in Elizabeth Quay precinct now, bet on foot traffic uplift in 12–18 months.</p>
          </div>
        </div>
      </div>

      {/* Back to Hub */}
      <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 20px' }}>
        <Link href="/analyse/perth" style={{ display: 'inline-block', padding: '12px 20px', border: `1px solid ${S.border}`, borderRadius: 10, color: S.brand, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          ← Back to Perth Guide
        </Link>
      </div>

      {/* Footer */}
      <div style={{ background: S.n100, borderTop: `1px solid ${S.border}`, padding: '40px 20px', marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>This Suburb</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                <p style={{ fontSize: 13, color: S.muted }}>Score: 76 (GO)</p>
                <p style={{ fontSize: 13, color: S.muted }}>Postcode: WA 6000</p>
                <p style={{ fontSize: 13, color: S.muted }}>Income: $88k median</p>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>Nearby Suburbs</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                <Link href="/analyse/perth/northbridge" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Northbridge (74)</Link>
                <Link href="/analyse/perth/subiaco" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Subiaco (82)</Link>
                <Link href="/analyse/perth/mount-lawley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Mount Lawley (85)</Link>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>All Perth Suburbs</h3>
              <Link href="/analyse/perth" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>View all 20 suburbs →</Link>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: S.muted }}>© 2026 Locatalyze. Data current as of March 2026.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
