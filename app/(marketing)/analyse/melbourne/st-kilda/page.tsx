'use client'

import Link from 'next/link'
import { useState } from 'react'

const S = {
  brand: '#0891B2', brandLight: '#06B6D4', emerald: '#059669',
  emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706',
  amberBg: '#FFFBEB', amberBdr: '#FDE68A', red: '#DC2626',
  redBg: '#FEF2F2', redBdr: '#FECACA', muted: '#64748B',
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
    headline: 'Opening a Business in St Kilda VIC 3182: 2026 Location Analysis',
    description: "Melbourne's beach-lifestyle premium strip. Summer trade runs 130-150% of winter. The operators who survive long-term are those who run profitably in July — and treat the summer premium as upside.",
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'What businesses work best in St Kilda Melbourne?',
      acceptedAnswer: { '@type': 'Answer', text: 'Resident-oriented hospitality on Carlisle Street (neighbourhood café, quality restaurant) and destination dining on Fitzroy Street (licensed, cocktail-led, private dining) both work in St Kilda. The critical condition is understanding seasonal economics: summer trade can be 40–50% higher than winter' },
    }],
  },
]

export default function StKildaPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/analyse/melbourne" style={{ fontWeight: 700, fontSize: 14, color: S.brand, textDecoration: 'none' }}>← Melbourne</Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
      </nav>
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #06B6D4 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Melbourne</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>St Kilda</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in St Kilda VIC 3182: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Melbourne's beach-lifestyle premium strip. Summer trade runs 130-150% of winter. The operators who survive long-term are those who run profitably in July — and treat the summer premium as upside.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>74/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={82} />
          <ScoreBar label="Demographics" value={76} />
          <ScoreBar label="Rent Viability" value={60} />
          <ScoreBar label="Competition Gap" value={68} />
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>St Kilda's commercial identity is inextricably linked to its beach. The suburb functions as Melbourne's coastal leisure destination — the place where the city goes on summer afternoons, January weekends, and long public holiday weekends. This creates a commercial environment with extraordinary upside in the October–March summer period and a significantly quieter April–September winter that separates operators who have built their businesses correctly from those who modelled on summer alone.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Fitzroy Street is the primary hospitality strip, running 600m from the St Kilda Road intersection to the foreshore. The street has genuine character — it's been Melbourne's destination for late-night dining and live music since the 1980s — but it has also cycled through significant tenancy turnover, particularly in the northern section. The Acland Street precinct anchors the suburb's daytime trade with its famous cake shops (a decades-long St Kilda institution) and a hospitality cluster that serves a more tourist and family-day-trip demographic. The two strips have different customer bases and different commercial dynamics.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>St Kilda's residential demographic is younger than its coastal-premium reputation suggests. The suburb's median age is 33, with a significant share of renters in the 25–38 bracket — a demographic with moderate household incomes ($72,000 average) but high discretionary spending propensity. These residents create consistent year-round demand for hospitality, particularly in the Carlisle Street and Barkly Street secondary strips that are less tourist-exposed and more resident-oriented.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The tourist dynamic matters significantly. St Kilda receives an estimated 1.5 million visitors annually, predominantly from Melbourne's eastern and northern suburbs, with significant interstate and international visitors during the Melbourne tourism peak (January–March). These visitors arrive predominantly at weekends and on public holidays, creating revenue spikes that are real but temporal. An operator who mistakes the January long weekend trade for a typical January weekend trade, and a typical January weekend for a typical July weekend, will have misstated their annual revenue by 30–40%.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Fitzroy Street's competitive environment has thinned since the pandemic. Several long-standing venues closed in 2020–2021 and have not been replaced, creating a more navigable competitive landscape for new entrants than the pre-2020 strip. The remaining operators are a mix of high-quality destination venues (Circa, some cocktail bars) and tourist-serving volume hospitality. The gap in the middle — quality, neighbourhood-scale hospitality at $35–$65 per head — is available and is being filled slowly.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Carlisle Street, one block east of Fitzroy Street, has a more resident-oriented hospitality scene with less tourist exposure and lower rents ($6,000–$9,000/month vs. $8,000–$13,000 on Fitzroy Street). The competitive density on Carlisle Street is lower and the customer base is more loyal — residents who walk to local hospitality from nearby apartments are repeat-visit customers with more consistent spending patterns than tourists. Several strong operators on Carlisle Street outperform their Fitzroy Street counterparts on a revenue-per-square-metre basis despite lower foot counts.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Fitzroy Street Restaurant (destination)</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>60–100 seats. Summer peak revenue of $40,000–$60,000/week must support $15,000–$20,000/month rent year-round. Works for operators with strong cocktail program and private dining channels. Revenue: $130,000–$200,000/month (summer average); $60,000–$90,000/month (winter).</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Carlisle Street Neighbourhood Café</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Resident-focused, year-round consistent. $7 coffee, $28–$42 brunch. Lower tourist exposure means less summer spike but also less winter drop. Revenue: $80,000–$120,000/month with lower seasonal variance.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Acland Street Daytime Concept</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Tourist and family day-trip catchment. Strong weekends October–April; significantly weaker May–September. Cake/pastry or quick-service formats that match the tourist demographic. Revenue: $50,000–$80,000/month average with high seasonal swing.</p>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Seasonal Swing of 40–50 Percentage Points</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>January trade at 150% of July trade means operators who model annual revenue from summer counts overstate sustainable rent by 30–40%. Every St Kilda business case must be built on a July trading week as the baseline — summer is upside, not average.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Fitzroy Street Northern Section Vacancy</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>The northern section of Fitzroy Street (between St Kilda Road and Grey Street) has persistent vacancy issues and lower foot counts than the southern section near the foreshore. Signing north of Grey Street requires a destination concept strategy and verification of specific foot counts at different times and seasons.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Parking and Transport Complexity</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>St Kilda has a parking shortage on peak summer weekends that creates genuine access problems and real customer frustration. Operations that rely on easy weekend parking for a drive-from-suburbs customer will encounter problems. The tram (16, 96) is the reliable access mode, and tram-stop-adjacent locations consistently outperform those set back from the tram line.</p>
            </div>
          </div>
        </section>
        <SuburbPoll suburb="St Kilda" votes={[52, 34, 14]} />
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/melbourne/prahran" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Prahran</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>76</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/south-yarra" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>South Yarra</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>82</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/southbank" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Southbank</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>71</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
          </div>
        </section>
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>St Kilda is a GO for operators who understand seasonal economics and position on the resident-oriented secondary strips rather than on peak-rent Fitzroy Street. The suburb has genuine commercial strength — the residential density, the beach lifestyle premium, and the tourist trade create a multi-layered customer base that few Melbourne suburbs can match. But the economics only work if you model on winter, not summer.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The specific advice: a quality café on Carlisle Street at $6,500–$9,000/month, serving the resident demographic (not the tourist trade), building loyal repeat customers who come 2–3 times per week. This model generates less revenue than a summer-peak Fitzroy Street venue but generates it more consistently, with lower seasonal variance and a lower probability of the cash flow crisis that catches out tourist-dependent St Kilda operators between May and September.</p>
        </section>
        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.white, marginBottom: 12 }}>Analyse your St Kilda address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Start free analysis →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/prahran" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Prahran</Link>
            <Link href="/analyse/melbourne/south-yarra" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>South Yarra</Link>
            <Link href="/analyse/melbourne/southbank" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Southbank</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
