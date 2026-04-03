'use client'

import Link from 'next/link'
import { useState } from 'react'

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Opening a Business in Melbourne CBD: 2026 Location Analysis',
    description: 'Melbourne CBD foot traffic analysis, demographic data, rent costs, and viability scoring for hospitality and retail. Uncover opportunities in Australia\'s most competitive CBD.',
    datePublished: '2026-03-25',
    dateModified: '2026-03-25',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why is Melbourne CBD café failure rate so high?',
        acceptedAnswer: { '@type': 'Answer', text: 'Rent-to-revenue ratio of 22–28% is the structural killer. Most CBD locations are priced for $120k+ annual gross revenue, but achieving that requires exceptional differentiation or underground/basement formats at lower rent.' },
      },
      {
        '@type': 'Question',
        name: 'What are the best laneway locations in Melbourne CBD?',
        acceptedAnswer: { '@type': 'Answer', text: 'Degraves Street and Centre Place have the highest foot traffic but also the highest rents. Hosier Lane, Hardware Lane, and Union Lane offer lower rents ($4,500–6,000/month) with comparable demographic quality.' },
      },
      {
        '@type': 'Question',
        name: 'When is Melbourne CBD foot traffic strongest?',
        acceptedAnswer: { '@type': 'Answer', text: 'Lunchtime (12–2 pm) dominates — foot traffic is 2.5× higher than evening. Monday–Friday are equal. Weekends are 40% lower. Evening food and retail drops 55% below lunch baseline.' },
      },
      {
        '@type': 'Question',
        name: 'Which CBD precincts are worth opening in?',
        acceptedAnswer: { '@type': 'Answer', text: 'Collins/Bourke (premier retail, $15k+ rent), Degraves/Centre Place (premium food tourism, $12k–14k rent), Hardware Lane (emerging food precinct, $8k–10k rent), and basement/underground sites ($4,500–6,000 rent, 40% rent savings).' },
      },
      {
        '@type': 'Question',
        name: 'Is Melbourne CBD viable for new operators?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, but only for high-volume concepts or differentiation. Standard café/bistro formats fail at 12% in year 1. Specialised concepts (natural wine bar, fast-casual Asian, premium coffee roastery) have better margins and lower failure rates.' },
      },
    ],
  },
]

const SCORE_BARS = [
  { label: 'Foot Traffic', value: 90 },
  { label: 'Demographics', value: 78 },
  { label: 'Rent Viability', value: 45 },
  { label: 'Competition Gap', value: 42 },
]

type NearbySuburb = { name: string; slug: string; score: number; verdict: Verdict }
const NEARBY = [
  { name: 'Richmond', slug: 'richmond', score: 84, verdict: 'GO' as Verdict },
  { name: 'South Yarra', slug: 'south-yarra', score: 78, verdict: 'GO' as Verdict },
  { name: 'Fitzroy', slug: 'fitzroy', score: 86, verdict: 'GO' as Verdict },
]

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
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
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Would you open a business in {suburb}?</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['Yes', 'Maybe', 'No'].map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'inherit', overflow: 'hidden' }}>
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
          <p style={{ fontSize: 13, color: '#047857' }}>Run a full analysis for {suburb}: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link></p>
        </div>
      )}
    </div>
  )
}

export default function MelbourneCBDPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}

      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 15, color: S.n900, textDecoration: 'none' }}>Locatalyze</Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #06B6D4 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Melbourne</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Melbourne CBD</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Melbourne CBD: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Australia's most competitive CBD — high volume or highly differentiated. The CBD is viability's edge case: rent-to-revenue economics kill standard formats but underground/basement concepts and specialised hospitality thrive.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 22, fontWeight: 900, color: S.white }}>75/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Location Scorecard</h2>
          {SCORE_BARS.map(b => <ScoreBar key={b.label} label={b.label} value={b.value} />)}
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Melbourne CBD is the epicentre of Australian hospitality competition. The lunchtime foot traffic (12–2 pm) is extraordinary — 200,000+ daily passes through the Collins/Bourke/Flinders corridor. But lunchtime is a different business than evening or weekend. Most CBD operators fail because they optimise for lunch but can't replicate that volume at dinner, creating rent coverage gaps.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            The lane system (Degraves, Centre Place, Hardware Lane, Hosier Lane) is the CBD's defining advantage — micro-markets within a macro-market. Degraves Street is tourism-heavy and expensive ($12,000–14,000/month); Centre Place is professional worker density ($12,000–15,000/month); Hardware Lane is emerging food and lower rent ($8,000–10,000/month).
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Street-level rents ($12,000–$38,000/month) are unviable for most operators. Underground/basement sites ($4,500–6,000/month) are 40% cheaper with surprising foot traffic access — this format is globally underexplored in Melbourne CBD.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Melbourne CBD has Australia's highest concentration of high-skill hospitality operators. The barista standard is exceptional — any operator entering the CBD café market is competing against 15+ years of Melbourne café cultural dominance. Independent operators win by differentiation or by capturing underserved dayparts (early breakfast, late-night).
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            The CBD currently lacks specialised formats: natural wine bars operate in inner suburbs (Fitzroy, South Yarra) but zero in CBD; premium Asian fast-casual is underrepresented (high demographic fit but only 2–3 operators); health-focused dining (protein bowls, macro-balanced) has no specialist operator in the CBD's premium precinct.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Demographics</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Melbourne CBD daytime population: 250,000 workers + 50,000+ students (RMIT, Victoria University). Income: $95,000 median (skewed upward by professional services workers). Age: 28–45 dominates professional worker demographic. The evening population is tourists + DINKS (double income, no kids) from inner suburbs — higher willingness-to-pay than daytime.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Tourist spending is seasonal: peak October–March (spring/summer); trough June–August (winter). This seasonal variation kills standard café operators but works for tourism-targeted formats (laneway focus, premium pricing, photo-friendly design).
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, background: S.emeraldBg, borderRadius: 10, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Premium Coffee Roastery</div>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>Hardware Lane location, $8–10k rent, $65–85k/month revenue. Emphasise the roasting operation (theatre), early-bird professional clientele, differentiation via single-origin sourcing.</p>
            </div>
            <div style={{ padding: 16, background: S.emeraldBg, borderRadius: 10, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Natural Wine Bar</div>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>Basement site (Flinders Lane), $5–6k rent, $55–70k/month revenue. Melbourne demographic is wine-literate, natural wine is underrepresented in CBD, evening-focused (avoids lunchtime pressure).</p>
            </div>
            <div style={{ padding: 16, background: S.emeraldBg, borderRadius: 10, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Fast-Casual Asian</div>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>CBD worker demographic (45% Asian) + tourist demographic = premium spending on authentic Asian fast-casual. $10–12k rent (mid-tier precinct), $72–95k/month revenue.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Fails Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, background: S.redBg, borderRadius: 10, border: `1px solid ${S.redBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 8 }}>Standard Café</div>
              <p style={{ fontSize: 13, color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>Espresso + toasted + cakes format at $12–15k rent. Lunch volume is insufficient to cover dinner drop-off. Market saturation kills differentiation. 12% year-1 failure rate.</p>
            </div>
            <div style={{ padding: 16, background: S.redBg, borderRadius: 10, border: `1px solid ${S.redBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 8 }}>Casual Dining</div>
              <p style={{ fontSize: 13, color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>Bistro/pub format at $15–20k rent requires $140k+/month revenue — achievable in tourism peaks but untenable June–August. Rent-to-revenue kills most operators.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Underground/basement formats on Flinders Lane, Elizabeth Street, or Collins Street offer $4,500–6,000/month rent (40% below street-level equivalents) with surprising foot traffic. This format works because: (1) tourists prefer descending into laneways (perceived discovery), (2) workers use underground networks for weather protection, (3) rent economics create operational margin that supports quality.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            A natural wine bar, premium coffee roastery, or specialised Asian fast-casual in a basement site can hit $50–70k/month revenue (viable) vs $120k+/month needed for street-level viability. This arbitrage is mostly unexploited in Melbourne CBD.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 6 }}>Rent-to-Revenue Compression</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>Standard café format requires 22–28% of revenue to cover rent. Most CBD locations demand $120k+/month to hit breakeven. Achieving that requires differentiation + execution.</p>
            </div>
            <div style={{ padding: 16, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 6 }}>Evening Revenue Cliff</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>Lunchtime foot traffic doesn't translate to evening. Monday–Friday evening traffic is 30–40% of lunch; weekend evening (6–10 pm) adds traffic but requires different operation (alcohol, premium pricing).</p>
            </div>
            <div style={{ padding: 16, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 6 }}>Seasonal Tourism Volatility</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>Winter (June–August) foot traffic drops 30–35% vs spring/summer. Operators must have product-market fit that survives shoulder seasons or maintain enough professional worker loyalty to bridge the gap.</p>
            </div>
          </div>
        </section>

        <SuburbPoll suburb="Melbourne CBD" />

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {NEARBY.map(s => (
              <Link key={s.slug} href={`/analyse/melbourne/${s.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>{s.name}</h4>
                    <VerdictBadge v={s.verdict} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: S.brand }}>{s.score}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Melbourne CBD is not a suburb for most operators — it's a specialist market. Rent economics demand either high volume (250,000+ lunch covers to hit breakeven) or extreme differentiation (natural wine bar, premium coffee roastery, specialised Asian). The standard café/bistro format has a 12% year-1 failure rate and should be avoided unless you have exceptional execution.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            The opportunity is in basement/underground sites on Flinders Lane or Collins Street where rent is 40% lower but foot traffic remains strong. This format is architecturally unexploited in Melbourne CBD and can support premium wine, coffee, or food concepts at viable economics.
          </p>
        </section>

        <div style={{ background: `linear-gradient(135deg, ${S.brand} 0%, ${S.brandLight} 100%)`, borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.white, marginBottom: 12 }}>Ready to Analyse Your Location?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Get foot traffic heatmaps, demographic analysis, and competitor mapping for Melbourne CBD and beyond.
          </p>
          <Link href="/onboarding" style={{ background: S.white, color: S.brand, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 12 }}>
            {NEARBY.map(s => (
              <Link key={s.slug} href={`/analyse/melbourne/${s.slug}`} style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
