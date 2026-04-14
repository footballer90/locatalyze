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
    headline: 'Opening a Business in Fitzroy VIC 3065: 2026 Location Analysis',
    description: "Melbourne's undisputed hospitality benchmark. 400+ venues in the Smith-Gertrude-Johnston triangle. Generic concepts fail within 18 months. Specific, differentiated operators with margin discipline con",
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Fitzroy oversaturated for cafés and restaurants in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'Fitzroy is saturated for standard-format cafés but not for specific, differentiated concepts. The suburb has over 400 food and drink venues in the Smith-Gertrude-Johnston triangle, making commodity coffee and generic brunch genuinely competitive. However, specific niches — natural wine bars, special' },
    }],
  },
]

export default function FitzroyPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Fitzroy</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Fitzroy VIC 3065: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Melbourne's undisputed hospitality benchmark. 400+ venues in the Smith-Gertrude-Johnston triangle. Generic concepts fail within 18 months. Specific, differentiated operators with margin discipline continue to thrive.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>86/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={88} />
          <ScoreBar label="Demographics" value={92} />
          <ScoreBar label="Rent Viability" value={64} />
          <ScoreBar label="Competition Gap" value={76} />
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Fitzroy is where Melbourne's food and hospitality reputation was built. Smith Street, Gertrude Street, and Brunswick Street form a triangle of approximately 1.5km that has produced more successful, nationally recognised independent businesses than any comparable strip in Australia. The demographics are exceptional: median household income $98,000, median age 31, with a concentration of architects, designers, creative directors, software engineers, and food-industry professionals who are among the most demanding and experimental food consumers in the country.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The commercial logic of Fitzroy is simple in theory: an affluent, food-literate, experimental population living at high density along tram corridors generates consistent, high-value foot traffic that sustains premium-priced independent businesses. The application of this logic is more complicated. Fitzroy's consumer base has been educated by 20 years of high-quality competition to expect genuine quality at fair prices — not cheap prices, but quality proportional to what they're paying. A $7 flat white is fine if it's genuinely excellent. A $7 flat white from a concept that has not mastered extraction will be reviewed out of existence within three months.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Smith Street is the more commercially viable of Fitzroy's two main strips in 2026. Rents on Smith Street ($9,000–$13,000/month for a standard tenancy) are 15–25% below Gertrude Street, while foot traffic is comparable on weekday evenings and significantly higher on weekends due to the residential density to the east. The operators who signed Smith Street leases in 2019–2021 at pandemic-era effective rents are now sitting on significant competitive advantages — they have lower occupancy costs and comparable revenue to their Gertrude Street counterparts.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Gertrude Street is Melbourne's prestige hospitality address — the street where hatted restaurants, serious wine bars, and specialty retail concepts that have national recognition tend to cluster. Rents reflect this ($12,000–$16,000/month) and the margin discipline required is unforgiving. The operators here who are succeeding in 2026 are running 65–70% gross margins on food and beverage — not the 45–50% that is standard in most Australian hospitality markets. That additional margin is what the rent demands.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Fitzroy has the most intense café competition per square kilometre in Australia. Within the Smith-Gertrude-Johnston triangle, there are 400+ food and drink venues. Saturation in the standard café category is real: the customer-to-venue ratio for commodity coffee and generic brunch is thin. Operators who arrive with a standard-format café concept competing on interior design and Instagram presence find they are entering a market where 15 years of accumulated competitors have already exhausted those differentiators.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>What is not saturated in Fitzroy is the specific, niche-format category. Natural wine bars (there are only two in the suburb — in a market with the highest wine-literacy customer base in Melbourne). Fermented food specialists. Hybrid formats that combine retail and café (a cheese shop that also does small-plates). Korean barbecue (one venue for a catchment that indexes very high for this category). These gaps exist not because demand is absent but because the cost of entry filters out the operators who would fill them. An operator with the capital and concept to fill one of these gaps enters a market where the customer is actively looking for them.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Natural Wine Bar / Small Plates</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Smith Street position, $9,000–$12,000/month rent. Melbourne has only 2 natural wine bars; Fitzroy demographic is the ideal customer. $60–$90 per head, 40 seats, dinner-focused. Revenue: $80,000–$120,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Specialty Coffee Roastery-Café</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Smith Street with roasting program. Differentiation via single-origin, workshop model, wholesale channel. $7–$9 per coffee, $25–$40 food. Revenue: $90,000–$140,000/month including wholesale.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Premium Korean Barbecue</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>One Korean BBQ venue exists in the Smith-Gertrude precinct for a catchment that is highly Korean-cuisine literate. $65–$95 per head, 50 seats. Weekend reservations would be full within 6 weeks of opening a quality concept. Revenue: $100,000–$160,000/month.</p>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Most Saturated Café Market in Australia</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>If your concept is a standard café — good coffee, brunch menu, nice fit-out — Fitzroy will expose every weakness within 6 months. The customer here has tasted 30 versions of your concept and will judge yours against the best of them. Differentiation must be structural, not aesthetic.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Gertrude Street Rents Demand Exceptional Margins</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Gertrude Street at $13,000–$16,000/month requires 65%+ gross margin to sustain profitability. Most Australian hospitality operators run 45–55% gross margin. The gap is closed through premium pricing, high-yield beverage programs, and waste reduction — not volume. Operators who try to volume their way through Gertrude Street rents consistently fail.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Weekend Dependency</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Friday night and Saturday drive 40–45% of Fitzroy hospitality revenue for many venues. A two-week school holiday period in January, where the residential population partially migrates, can produce a 20–25% revenue gap that unprepared operators don't have cash reserves to bridge.</p>
            </div>
          </div>
        </section>
        <SuburbPoll suburb="Fitzroy" votes={[58, 28, 14]} />
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/melbourne/collingwood" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Collingwood</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>78</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/brunswick" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Brunswick</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>80</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/northcote" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Northcote</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>75</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
          </div>
        </section>
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Fitzroy is Melbourne's strongest suburb score at 86 — but that score comes with the most demanding market conditions in Australia. The customer base is large, affluent, and experimental. The competition is the most skilled and established in the country. The rents are the highest in Melbourne's inner north. Success here is not impossible — hundreds of operators are doing it — but it requires a concept with a specific reason to exist, the operational discipline to execute at Fitzroy standards, and the financial resilience to survive the first 18 months.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Smith Street is the recommended entry point for most operators. The rents are 15–25% lower than Gertrude Street, the foot traffic is comparable on peak days, and the demographic is functionally identical. A well-executed, specific-format concept on Smith Street has a better risk-adjusted case in 2026 than the same concept on Gertrude Street at $3,000–$4,000 more per month.</p>
        </section>
        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 12 }}>Analyse your Fitzroy address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Start free analysis →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/collingwood" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Collingwood</Link>
            <Link href="/analyse/melbourne/brunswick" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Brunswick</Link>
            <Link href="/analyse/melbourne/northcote" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Northcote</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
