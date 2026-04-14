'use client'

import Link from 'next/link'
import { useState } from 'react'

const S = {
  brand: '#0891B2', brandLight: '#06B6D4', emerald: '#059669',
  emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706',
  amberBg: '#FFFBEB', amberBdr: '#FDE68A', red: '#DC2626',
  redBg: '#FEF2F2', redBdr: '#FECACA', muted: '#475569',
  mutedLight: '#94A3B8', border: '#E2E8F0', n50: '#FAFAF9',
  n100: '#F5F5F4', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg = v === 'GO'
    ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION'
    ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return <span style={{ fontSize: 11, fontWeight: 700, color: cfg.txt, background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 6, padding: '2px 9px' }}>{v}</span>
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? S.emerald : value >= 55 ? S.amber : S.red
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: S.muted, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}/100</span>
      </div>
      <div style={{ height: 7, background: S.n100, borderRadius: 100 }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function SuburbPoll({ suburb, votes: initVotes }: { suburb: string; votes: number[] }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(initVotes)
  const total = votes.reduce((a, b) => a + b, 0)
  const opts = ['Yes, the numbers work', 'Maybe — needs more research', "No, I'd look elsewhere"]
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 44 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: S.n900 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>Based on what you've read — what's your read on this location?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => { if (voted !== null) return; setVoted(i); setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v)) }}
              disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', borderRadius: 10 }} />}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: S.n900 }}>{opt}</span>
                {voted !== null && <span style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>{pct}%</span>}
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>
            Run a full analysis for {suburb}: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: 'Opening a Business in Werribee VIC 3030: 2026 Location Analysis',
    description: 'Western growth corridor with genuine population momentum. Commercial maturity typically lags residential growth by 5-7 years — the economics work for patient operators with a 3+ year horizon.',
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Werribee Melbourne a good location for opening a business in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: "Werribee is a CAUTION for most operators in 2026. The suburb's population grew 18% from 2020–2025 but commercial maturity lags residential growth by 5–7 years. Average household income of $72,000 limits premium positioning. Value-positioned cafés, allied health practices, and children's education se" },
    }],
  },
]

export default function WerribeePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/analyse/melbourne" style={{ fontWeight: 700, fontSize: 14, color: S.brand, textDecoration: 'none' }}>← Melbourne</Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
      </nav>
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Melbourne</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Werribee</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Werribee VIC 3030: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Western growth corridor with genuine population momentum. Commercial maturity typically lags residential growth by 5-7 years — the economics work for patient operators with a 3+ year horizon.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>66/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={60} />
          <ScoreBar label="Demographics" value={58} />
          <ScoreBar label="Rent Viability" value={78} />
          <ScoreBar label="Competition Gap" value={70} />
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Werribee's population grew 18% from 2020 to 2025 — among the fastest growth rates of any Melbourne suburb. This growth is driven by housing affordability: young families who are first home buyers purchasing in the western corridor because land and housing costs are 40–60% below inner-ring equivalents. The demographic is predominantly 25–40 years old, working families, with household incomes averaging $72,000. This is a market in formation, not a market in decline — but commercial maturity typically lags residential growth by 5–7 years, and Werribee in 2026 is at roughly year 2–3 of a 7-year trajectory.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Watton Street is Werribee's primary commercial strip, running through the town centre. The strip serves the immediate residential catchment with everyday food, services, and retail — cafés, takeaway, hairdressers, medical centres. The commercial character is functional rather than aspirational: the community is relatively young, relatively cost-conscious, and prioritises value in most spending categories. The specialty coffee culture, natural wine bars, and premium hospitality that characterise inner-north Melbourne are not yet embedded in Werribee's commercial culture.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The infrastructure investment narrative is real but forward-looking. The Regional Rail Link connecting Werribee to Southern Cross Station in 21 minutes has improved accessibility significantly. The Werribee Employment Precinct and the broader Western Wedge infrastructure plan are genuine government commitments that will reshape the western corridor over the next decade. These investments will improve the commercial attractiveness of Werribee over time — but they are not yet delivering the income upgrade or the professional demographic shift that would make premium commercial positions viable today.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The practical commercial opportunity in Werribee in 2026 is in everyday service businesses and value-positioned food that the growing residential population needs. A second-generation bakery, a quality takeaway concept, a medical or allied health practice, or a children's education service all have genuine demand from a catchment that is growing 3–4% annually. Premium hospitality positioned for a demographic that doesn't yet exist at sufficient scale is premature.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Werribee's competitive landscape is thin relative to its population size — which is both the opportunity and the caution signal. The thinness of competition exists because experienced commercial operators have correctly assessed the current commercial conditions as insufficient for premium or specialty concepts. The operators who are succeeding on Watton Street are those serving genuine everyday needs at value price points — not the specialty coffee operators or quality restaurant concepts.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The competition gap that is genuinely commercially available in Werribee is in everyday hospitality at accessible price points. There are 3–4 café concepts on Watton Street for a residential catchment that is 40,000+ and growing. A well-run, value-positioned café at $4–$6 coffee and $12–$20 food has less competition relative to its catchment size than any suburb on this list — but the revenue ceiling per customer is also lower.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Value Café (everyday community)</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Watton Street. $4.50–$6 coffee, $12–$20 food. Growing young family catchment. Low rent $2,500–$4,500/month. Volume model — needs 150+ daily transactions to be viable. Revenue: $40,000–$65,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Allied Health Practice</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Physio, GP, psychology. Growing young family demographic has increasing healthcare needs. Bulk-billing or near-bulk-billing essential for income demographics. Revenue: $60,000–$90,000/month with correct pricing.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Children's Education Services</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Tutoring, music, arts, STEM education. Young family demographic with school-age children. Parents will sacrifice other discretionary spending for children's education. Revenue: $30,000–$55,000/month per service category.</p>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Commercial Maturity Is 5-7 Years Away</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>The household income ($72K average) and commercial culture (value-focused) of Werribee in 2026 are not yet sufficient for premium or specialty hospitality concepts. Operators who arrive in Werribee before the demographic supports their concept face years of below-projection revenue while waiting for the market to mature.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Infrastructure Promised vs. Infrastructure Delivered</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Western Melbourne infrastructure investment has a history of announcement-to-delivery gaps. Model your business case on the demographics that exist today, not the demographics that infrastructure investment is projected to bring. The investment is real; the timeline is uncertain.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Young Family Demographics Have High Non-Discretionary Spending</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>First home buyer families with mortgages, young children, and single or dual incomes below $72K average have limited discretionary spending after housing, childcare, and food costs. Premium pricing strategies that assume suburban discretionary spending equivalence with inner-ring demographics will underperform.</p>
            </div>
          </div>
        </section>
        <SuburbPoll suburb="Werribee" votes={[30, 42, 28]} />
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/melbourne/footscray" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Footscray</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>77</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/dandenong" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Dandenong</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>68</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/docklands" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Docklands</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>65</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
          </div>
        </section>
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Werribee is a CAUTION in 2026 — not because it lacks potential, but because the commercial conditions don't yet support most operator profiles. The population growth is real, the infrastructure investment is real, and the long-term commercial trajectory is positive. But the household income, commercial culture, and discretionary spending capacity of the current catchment limit what is viable today.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The operators who should consider Werribee are those with a 3–5 year patience horizon, a value-positioned concept that serves everyday community needs, and the financial capacity to build a customer base during the below-capacity period. Everyday cafés, allied health practices, and children's education services are all viable at current demographics. Premium hospitality and specialty concepts are premature — come back in 2028.</p>
        </section>
        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 12 }}>Analyse your Werribee address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Start free analysis →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/footscray" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Footscray</Link>
            <Link href="/analyse/melbourne/dandenong" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Dandenong</Link>
            <Link href="/analyse/melbourne/docklands" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Docklands</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
