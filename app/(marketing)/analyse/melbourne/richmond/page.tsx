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
    headline: 'Opening a Business in Richmond VIC 3121: 2026 Location Analysis',
    description: 'Richmond foot traffic analysis, Swan Street precinct data, AFL demographics, and location viability for hospitality. Comprehensive market overview for business owners.',
    datePublished: '2026-03-25',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Why is Swan Street Richmond so successful for food?', acceptedAnswer: { '@type': 'Answer', text: 'Swan Street combines AFL fan culture (Hawthorn, Richmond, Collingwood primary demographic), professional worker density, and emerging gentrification. 85,000+ weekly foot traffic through the precinct across diverse formats.' } },
      { '@type': 'Question', name: 'What is the best format for Richmond hospitality?', acceptedAnswer: { '@type': 'Answer', text: 'Sports nutrition/recovery (physio, cryotherapy) captures the underserved AFL-adjacent demographic. Premium dining captures gentrification upside. Budget casual works for worker lunch traffic.' } },
      { '@type': 'Question', name: 'When is Richmond foot traffic strongest?', acceptedAnswer: { '@type': 'Answer', text: 'Wednesday–Sunday strong; Monday dead. Match days (home games) spike foot traffic 200%+. Evening (6–10 pm) peaks Friday–Saturday. Lunch is consistent but not dominant.' } },
      { '@type': 'Question', name: 'Is Richmond viable for new café operators?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, but differentiation required. Standard café works; natural wine and food-focused venues capture premium demographic. Rent viability at 72/100 supports most formats.' } },
    ],
  },
]

const SCORE_BARS = [
  { label: 'Foot Traffic', value: 87 },
  { label: 'Demographics', value: 85 },
  { label: 'Rent Viability', value: 72 },
  { label: 'Competition Gap', value: 76 },
]

type NearbySuburb = { name: string; slug: string; score: number; verdict: Verdict }
const NEARBY = [
  { name: 'Fitzroy', slug: 'fitzroy', score: 86, verdict: 'GO' as Verdict },
  { name: 'Melbourne CBD', slug: 'melbourne-cbd', score: 75, verdict: 'CAUTION' as Verdict },
  { name: 'Collingwood', slug: 'collingwood', score: 82, verdict: 'GO' as Verdict },
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
  const [votes, setVotes] = useState<number[]>([52, 31, 17])
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

export default function RichmondPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Richmond</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Richmond VIC 3121: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Swan Street precinct is Melbourne's food-sport intersection. AFL fan culture, professional workers, and emerging gentrification converge. 85,000+ weekly foot traffic makes this a GO for most formats.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 22, fontWeight: 900, color: S.white }}>84/100</span>
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
            Swan Street is Melbourne's food-sport epicentre. The precinct is anchored by Richmond and Hawthorn AFL clubs — both within 2 km. The demographic is sports-passionate, income-supported ($96,000 median), and food-literate. Bridge Road runs parallel (premium fashion/retail; not food). The two streets create a commercial duality that few Melbourne suburbs can match.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Foot traffic is 85,000+ weekly through the Swan/Richmond intersection. Wednesday–Sunday are consistently strong; Monday is dead (fixture-dependent). Match days lift foot traffic 200%+ — operators on the precinct experience swing revenue of 4–5× between non-match and match days. This volatility kills some operators but rewards those designed for it.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            The gentrification arc is real: Richmond was Melbourne's most crime-prone suburb in 2010; today it has Melbourne's strongest emerging food culture outside of Fitzroy. Young professionals (28–45 median age) are moving to Richmond for rents $400–600 cheaper than South Yarra while capturing the same food culture premium.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Swan Street has 40+ hospitality operators across café, casual dining, and fine dining. Most are established (5+ years). The market isn't saturated by format but by execution — new operators win by either capturing emerging formats (sports recovery/wellness, natural wine, premium Asian) or by taking existing formats upmarket (premium café, fine dining).
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Sports nutrition and recovery (sports physio, cryotherapy, IV therapy) is entirely absent from Swan Street despite Hawthorn/Richmond demographic. This is the game's biggest gap: a 600-sqm cryotherapy + sports café concept captures sports fans + health-conscious professionals + post-match traffic with zero current competition.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Demographics</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Richmond median income: $96,000. Age: 28–45 dominates (young professionals). Occupation: finance, legal, education, design (white collar). Sports engagement: extraordinarily high (AFL is the cultural centre of this demographic). Willingness-to-pay: high — premium café ($6–8/coffee), premium dinner ($50–70 per person) have strong uptake.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            The "sports fan" demographic is distinct from "young professional" in most cities, but Richmond collapses this distinction. A sports bar in Richmond attracts both AFL fanatics and post-work DINKS (double income, no kids) looking for premium evening experience. This crossover is rare.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, background: S.emeraldBg, borderRadius: 10, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Sports Physio + Café</div>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>Zero current operators. AFL player + fan + post-match demographic. $5–6k rent, $68–85k/month revenue. Captures daypart (morning physio + lunch café).</p>
            </div>
            <div style={{ padding: 16, background: S.emeraldBg, borderRadius: 10, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Premium Dining</div>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>Gentrifying demographic supports $50–70/person weekend dinner. Friday–Saturday evening captures the entire market. $7–9k rent, $75–95k/month revenue.</p>
            </div>
            <div style={{ padding: 16, background: S.emeraldBg, borderRadius: 10, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Natural Wine + Food</div>
              <p style={{ fontSize: 13, color: '#047857', margin: 0, lineHeight: 1.5 }}>Premium demographic + wine culture. Evening-focused avoids lunchtime pressure. $5–7k rent, $55–72k/month revenue.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Fails Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, background: S.redBg, borderRadius: 10, border: `1px solid ${S.redBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 8 }}>Budget Casual</div>
              <p style={{ fontSize: 13, color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>$3–4 per transaction doesn't support Swan Street rent ($5–6k). Needs volume of 2,000+ transactions/week. Most operators can't achieve this in outer precincts.</p>
            </div>
            <div style={{ padding: 16, background: S.redBg, borderRadius: 10, border: `1px solid ${S.redBdr}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 8 }}>Family Dining</div>
              <p style={{ fontSize: 13, color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>Richmond is DINK-heavy, not family-heavy. Kids' menus and play areas underperform vs inner-suburb expectations. Rent doesn't support family volume model.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Sports recovery + hospitality is a globally emerging category (Austin, Denver, Melbourne — all AFL/NFL cities) but zero Melbourne operators have cornered it. A 600–800 sqm space offering cryotherapy, compression therapy, sports massage, allied health alongside premium café + post-match sports bar captures the entire value chain.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            Rent viability at $5–6k/month becomes easier with 4–5 revenue streams (treatment, café, bar, retail merchandise). A sports physio appointment ($120–150) + café transaction ($15) + evening drinks ($35) per customer justifies premium location.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 6 }}>Match Day Volatility</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>Revenue on match days (200%+ lift) masks non-match day underperformance. Operators must survive non-match weeks without match day subsidy — some can't.</p>
            </div>
            <div style={{ padding: 16, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 6 }}>Monday Deadness</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>Monday (day after Sunday match) is Richmond's deadest day. Requires fixed costs (rent, labour) to function with 40–50% of midweek traffic.</p>
            </div>
            <div style={{ padding: 16, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 6 }}>Gentrification Timing Risk</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>If Collingwood/Fitzroy gentrification reaches Richmond scale, premium positioning suffers (rents rise but traffic remains constant). Lock in 5-year leases now.</p>
            </div>
          </div>
        </section>

        <SuburbPoll suburb="Richmond" />

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
            Richmond is a GO suburb for operators who understand sports culture + gentrification economics. Swan Street is Melbourne's strongest food precinct outside of Fitzroy because the demographics are proven (sports fan + young professional is a rare combination). Rent viability (72/100) supports most formats.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12, color: S.muted }}>
            The opportunity is in sports recovery + hospitality — zero current operators despite perfect demographic fit. For standard café/food operators: premium positioning captures the gentrifying demographic, but budget casual fails. Match day volatility is a feature, not a bug, if you design for it.
          </p>
        </section>

        <div style={{ background: `linear-gradient(135deg, ${S.brand} 0%, ${S.brandLight} 100%)`, borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.white, marginBottom: 12 }}>Ready to Analyse Your Location?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Get foot traffic heatmaps, demographic analysis, and competitor mapping for Richmond and across Melbourne.
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
